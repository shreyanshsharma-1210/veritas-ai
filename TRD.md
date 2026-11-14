# Technical Requirements Document (TRD)
## Diagnose → Debate → Decide — AI Sales Assistant

**Version:** 1.0 · **Project Category:** Sales Bot · **Event:** FlowZint AI Hackathon 2026
**Author:** [Your Name] · **Last Updated:** July 2026

---

## 1. Purpose & Scope

This document specifies the technical requirements, system architecture, data models, API contracts, and detailed application flow for the "Diagnose → Debate → Decide" sales assistant. It is intended to guide solo implementation over a 17-day build window and to serve as submission documentation for hackathon judging (Documentation Clarity — 20% of score).

**In scope:** single-session web app, structured diagnostic intake, two-agent LLM debate loop with resolution tracking, final recommendation output.
**Out of scope:** multi-user accounts, persistent database, authentication, billing, production monitoring/observability, CRM integrations (all explicitly deferred as post-hackathon roadmap items).

---

## 2. System Overview

| Property | Value |
|---|---|
| Architecture style | Client-server, stateless backend with in-memory session state |
| Frontend | React (Vite) + Tailwind CSS + React Flow |
| Backend | FastAPI (Python 3.11+) |
| LLM Provider | Groq API (Llama 3.3 70B) — primary; Gemini API — fallback/alternative |
| Data persistence | None required (in-memory dict, keyed by session ID) |
| Hosting | Vercel (frontend), Render free tier (backend) |
| Auth | None (single-user demo scope) |

---

## 3. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | System shall present a branching diagnostic question flow (4–6 questions) | Must |
| FR-2 | System shall validate numeric/logical consistency of diagnostic answers in real time | Must |
| FR-3 | System shall compile diagnostic answers into a structured JSON `Diagnosis` object | Must |
| FR-4 | System shall generate an initial proposal via the Closer agent from the `Diagnosis` object | Must |
| FR-5 | System shall generate objections via the Skeptic agent, each tagged to a specific diagnosis field | Must |
| FR-6 | System shall allow the Closer agent to respond to each tagged objection individually | Must |
| FR-7 | System shall track resolution status (`resolved` / `unresolved`) per objection | Must |
| FR-8 | System shall terminate the debate loop when all objections are resolved OR 3 rounds are reached | Must |
| FR-9 | System shall present unresolved objections as "open risks" in the final output, not conceal them | Must |
| FR-10 | System shall render the diagnostic tree visually with active/pruned branch states | Should |
| FR-11 | System shall render the debate as a live, turn-by-turn reasoning panel | Should |
| FR-12 | System shall render a final recommendation snapshot (plan, metrics, resolved/open risks, next step) | Must |
| FR-13 | System shall handle LLM API failures gracefully with a user-visible retry state | Should |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | End-to-end flow (diagnosis → debate → recommendation) should complete in under 60 seconds, given Groq's inference speed |
| NFR-2 | UI must remain responsive during LLM calls (loading states, no blocking freezes) |
| NFR-3 | System must degrade gracefully if an LLM call returns malformed JSON (retry once, then fallback to a generic error state) |
| NFR-4 | Codebase must be structured for a judge to trace the resolution-state logic without reading the entire repo |
| NFR-5 | No user data is persisted beyond the active session (privacy-by-default, no DB) |

---

## 5. System Architecture

```
┌─────────────────┐        ┌──────────────────────┐        ┌────────────────┐
│   React Frontend │  HTTP  │   FastAPI Backend     │  API   │   Groq LLM API  │
│  - Tree UI        │◄─────►│  - Diagnosis validator │◄─────►│  - Closer role   │
│  - Reasoning panel │        │  - Debate controller   │        │  - Skeptic role  │
│  - Recommendation  │        │  - Session state (dict)│        │                  │
└─────────────────┘        └──────────────────────┘        └────────────────┘
```

**Backend modules:**
- `diagnosis.py` — question tree definition, Pydantic validation models
- `agents.py` — Closer/Skeptic prompt templates and LLM call wrappers
- `debate_controller.py` — orchestrates the round loop, resolution tracking, stopping condition
- `main.py` — FastAPI routes

---

## 6. Data Models

```python
class Diagnosis(BaseModel):
    goal: str
    leakage_point: str
    m1_retention_pct: float
    m3_retention_pct: float
    top_signal: str
    constraints: dict  # e.g. {"eng": 4, "pm": 1, "design_bandwidth": "limited"}

    @validator("m3_retention_pct")
    def m3_not_higher_than_m1(cls, v, values):
        if "m1_retention_pct" in values and v > values["m1_retention_pct"]:
            raise ValueError("M3 retention cannot exceed M1 retention")
        return v

class Objection(BaseModel):
    id: str
    tag: str            # maps to a Diagnosis field, e.g. "constraints.design_bandwidth"
    text: str
    status: Literal["unresolved", "resolved"]
    mitigation: str | None = None

class DebateRound(BaseModel):
    round_number: int
    closer_statement: str
    objections: list[Objection]

class DebateLog(BaseModel):
    diagnosis: Diagnosis
    rounds: list[DebateRound]
    final_recommendation: str
    resolved_risks: list[Objection]
    open_risks: list[Objection]
```

---

## 7. API Contract

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/diagnosis/start` | Initializes a session, returns first question node |
| `POST` | `/api/diagnosis/answer` | Submits an answer, returns next node or validation error |
| `POST` | `/api/debate/run` | Takes completed `Diagnosis`, runs full debate loop, returns `DebateLog` |
| `GET`  | `/api/debate/{session_id}` | Retrieves current debate state (for polling/streaming updates to the reasoning panel) |

**Example request/response — `POST /api/debate/run`:**
```json
// Request
{ "diagnosis": { "goal": "Reduce post-activation churn", "leakage_point": "...", ... } }

// Response
{
  "rounds": [ { "round_number": 1, "closer_statement": "...", "objections": [ {"id": "obj_1", "tag": "assumption_of_lift", "text": "...", "status": "unresolved"} ] } ],
  "final_recommendation": "...",
  "resolved_risks": [...],
  "open_risks": []
}
```

---

## 8. Detailed Application Flow

### 8.1 State Machine

```
[START] 
   │
   ▼
[DIAGNOSIS_IN_PROGRESS] ──(invalid answer)──► [DIAGNOSIS_VALIDATION_ERROR] ──► back to DIAGNOSIS_IN_PROGRESS
   │ (all fields complete + consistent)
   ▼
[DIAGNOSIS_COMPLETE]
   │
   ▼
[DEBATE_ROUND_1: Closer proposes]
   │
   ▼
[DEBATE_ROUND_1: Skeptic objects] ── objections tagged & stored
   │
   ▼
[DEBATE_ROUND_N: Closer mitigates] ── each objection marked resolved/unresolved
   │
   ├── all resolved ──────────────► [RECOMMENDATION_READY]
   ├── round < 3, unresolved exist ──► loop to next DEBATE_ROUND
   └── round == 3, unresolved exist ──► [RECOMMENDATION_READY] (with open_risks populated)
   │
   ▼
[RECOMMENDATION_READY] → renders final snapshot
```

### 8.2 Step-by-Step Flow (User-Facing)

1. **Landing / Framing** — bot states its process upfront (discovery → internal debate → recommendation).
2. **Diagnostic questions** — presented one at a time; tree UI updates live; inline validation triggers a clarifying question if an answer is inconsistent.
3. **Diagnosis summary confirmation** — user sees the compiled `Diagnosis` object in plain language and can confirm or correct before debate begins.
4. **Debate begins** — Closer's Round 1 proposal streams into the reasoning panel.
5. **Skeptic objections appear**, each visually tagged (e.g., a small pill/badge showing which diagnosis field it relates to).
6. **Closer's mitigations appear**, each explicitly linked to the objection it addresses; objection badges update from "unresolved" (amber) to "resolved" (green) in real time.
7. **Loop continues** up to 3 rounds or until all objections show resolved.
8. **Final recommendation renders**: plan, metric target, resolved risks (green section), open risks (amber section, only if any remain), and a next-step CTA.

---

## 9. Error Handling

| Scenario | Handling |
|---|---|
| LLM returns malformed JSON | Retry once with stricter format instruction; if still malformed, show "Having trouble reasoning through this — try again" with a retry button |
| User gives contradictory diagnostic answer | Inline validation message; block progression to next question until resolved |
| Debate loop exceeds 3 rounds without resolution | Not an error — expected path; renders open risks honestly |
| Backend cold start (Render free tier) | Frontend shows a "waking up the assistant" loading state on first request |

---

## 10. Deployment

- Frontend: `vercel deploy` from the `frontend/` directory, connected to GitHub for auto-deploy on push.
- Backend: Render Web Service, free tier, connected to GitHub, environment variable `GROQ_API_KEY` set in Render dashboard (never committed to repo).
- CORS: backend configured to allow the deployed Vercel origin only.

---

## 11. Out-of-Scope / Future Work (for documentation completeness)

- Persistent user accounts and history across sessions
- CRM integration (Salesforce/HubSpot) to pull real account data into the `Diagnosis` object
- Multi-turn negotiation beyond the initial recommendation (e.g., follow-up Q&A after the plan is shown)
- Analytics on which objections recur most often across users, to improve the Skeptic's prompt over time
