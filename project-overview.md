# Diagnose → Debate → Decide
### An AI Sales Assistant That Argues With Itself Before It Pitches You

**FlowZint AI Hackathon 2026 — Sales Bot Category**
**Built by:** [Your Name] · **Submission Deadline:** July 19, 2026

---

## 1. The Problem

Most AI sales bots follow one pattern: user describes a need, bot generates a pitch. The pitch sounds confident, generic, and — because it's optimized to close, not to be right — it rarely acknowledges the real constraints (limited team bandwidth, uncertain ROI assumptions, competing priorities) that determine whether a recommendation will actually work.

This erodes trust. Buyers know a sales pitch when they see one, and a bot that only ever says "yes, this will work" reads as exactly that — a pitch, not advice.

## 2. The Idea

**Diagnose → Debate → Decide** is a sales assistant for B2B SaaS growth and sales leaders that behaves like a sharp human consultant instead of a scripted pitch generator:

1. It **diagnoses** the prospect's real situation through a structured, guided conversation — not a generic intake form.
2. It **debates itself internally** — a "Closer" agent proposes a plan, a "Skeptic" agent pressure-tests it with pointed, specific objections, and the Closer must actually resolve those objections (or admit it can't).
3. It **decides** — presenting a final recommendation that's honest about what's resolved and what risk remains open.

The user watches this entire internal reasoning process happen in real time, in a visible panel, before the final plan appears. The transparency *is* the trust mechanism — this bot doesn't just claim to be right, it shows its work.

## 3. Target Field & Scenario

**Domain:** B2B SaaS / digital subscription companies.

**Why this domain:** SaaS growth metrics (activation, retention, churn, CAC, LTV) are widely understood, easy to validate in a live demo, and directly map to revenue — a judge doesn't need domain expertise to evaluate whether the bot's numbers make sense.

**Specific demo scenario (kept narrow on purpose):** rather than a generic "reduce churn" story, the demo is anchored on a sharper, more observed insight: *users activate successfully but silently downgrade or go quiet after month 2* — a more specific and credible leakage point than generic onboarding drop-off, and one that makes the diagnostic and debate steps feel like real analysis rather than a templated demo.

## 4. Complete User Flow

### Step 0 — Framing
The bot opens by explicitly setting expectations:

> "Before I recommend anything, I want to understand your situation — like a good sales consultant would. I'll ask a few questions, then think through the trade-offs out loud before giving you a plan."

This immediately signals: this is a discovery-led sales conversation, not a chatbot FAQ.

### Step 1 — Guided Diagnostic
The bot asks 4–6 branching questions:

- Primary goal (e.g., reduce churn, increase expansion revenue)
- Where the leakage actually happens (e.g., post-activation, month 2+)
- Supporting metrics (e.g., Month-1 retention, Month-3 retention)
- Team/resource constraints (eng bandwidth, design bandwidth, timeline)

**UI:** a visible tree — the active path is highlighted, unselected branches gray out — with a live "Diagnosis so far" side panel summarizing what's been captured.

**Validation, not blind acceptance:** if an answer is inconsistent (e.g., Month-3 retention reported higher than Month-1, which is impossible), the bot catches it inline and asks for clarification instead of silently building a recommendation on bad data. Diagnosis is only marked "complete" once required fields are filled *and* internally consistent.

**Example diagnosis captured:**
```
Goal: Reduce post-activation churn
Leakage point: Silent downgrade after month 2
M1 retention: 71%
M3 retention: 44%
Top signal: Feature usage drops sharply after week 6
Team: 4 eng, 1 PM, limited design bandwidth
Current initiatives: none targeting month 2+ specifically
```

### Step 2 — Closer Opens
The structured diagnosis (not raw chat text) is passed to the **Closer** agent, which proposes one concrete plan with a stated numeric impact and required effort.

> **Closer (Round 1):** "Recommend a targeted 're-engagement checkpoint' at week 5 — a personalized in-app prompt highlighting the specific feature tied to each user's original activation goal. Expected impact: Month-3 retention from 44% → 50–52% within 8 weeks. Effort: 1 PM, 1.5 eng, minimal design (reuses existing notification component)."

### Step 3 — The Debate (core mechanism)
This is the technical heart of the project, and it's built to be a real, auditable process — not just two prompts alternating turns for show.

- The **Skeptic** agent reviews the diagnosis and the Closer's proposal, and raises objections — each one explicitly **tagged to a specific diagnosis field**, e.g.:
  - `objection: assumption_of_lift` — "6–8pt lift is optimistic without prior evidence."
  - `objection: root_cause_mismatch` — "If usage drops after week 6, is week 5 the right intervention point, or too late?"
- The **Closer** must respond to each tagged objection individually with a real mitigation (e.g., narrower pilot scope, revised timing, added instrumentation) — not a vague reassurance.
- Each objection is then marked **resolved** or **unresolved**, based on whether the mitigation actually addresses the specific constraint raised.
- **Stopping condition:** the debate ends when either (a) all objections are resolved, or (b) 3 rounds are reached — whichever comes first.
- If objections remain unresolved after round 3, they are **not hidden** — they're carried forward honestly into the final recommendation as open risks.

> **Skeptic (Round 1):** "Two concerns: (1) You're assuming 6–8pt lift — do you have precedent for that? (2) Usage drops after week 6, but your intervention is at week 5 — is that early enough, or are we treating a symptom that started earlier?"
>
> **Closer (Round 2):** "Fair. (1) Scaling the claim back — we'll pilot first and only project lift once we see real data, not upfront. (2) Good catch — shifting the checkpoint to week 4 instead of week 5, and adding a lightweight usage-trend alert so we catch decline before week 6, not after."
>
> **Skeptic (Round 2):** "Objection 1: resolved — pilot-first approach removes the unfounded assumption. Objection 2: resolved — earlier checkpoint plus a leading indicator directly addresses the timing concern."

This is the difference between a demo gimmick and a real system: the objections are structured data with a resolution state, not just conversational back-and-forth — which means it's something a judge can actually inspect in the codebase, not just watch happen.

### Step 4 — Final Recommendation
The bot presents:

- A plain-language "do this next" plan.
- Baseline → target metric, with the pilot-first threshold that emerged from the debate.
- **Resolved risks** (with their mitigations) shown separately from any **open risks** (disclosed honestly, not concealed).
- A concrete next step (e.g., "Start a 2-week pilot on the week-4 checkpoint, track usage-trend alerts as a leading indicator").
- Optionally rendered as a clean one-page "Plan + Rationale" snapshot, so the demo ends on a tangible artifact rather than chat trailing off.

## 5. Technical Architecture

**Core data structures:**

```json
// Diagnosis object
{
  "goal": "Reduce post-activation churn",
  "leakage_point": "Silent downgrade after month 2",
  "metrics": { "m1_retention_pct": 71, "m3_retention_pct": 44 },
  "top_signal": "Feature usage drops after week 6",
  "constraints": { "eng": 4, "pm": 1, "design_bandwidth": "limited" }
}

// Debate log
{
  "rounds": [
    {
      "closer_proposal": "...",
      "objections": [
        { "id": "obj_1", "tag": "assumption_of_lift", "text": "...", "status": "unresolved" },
        { "id": "obj_2", "tag": "root_cause_mismatch", "text": "...", "status": "unresolved" }
      ]
    },
    {
      "closer_mitigations": [
        { "objection_id": "obj_1", "response": "...", "status": "resolved" },
        { "objection_id": "obj_2", "response": "...", "status": "resolved" }
      ]
    }
  ],
  "final_recommendation": "...",
  "resolved_risks": [...],
  "open_risks": []
}
```

**Agent design:** two role-specific system prompts (Closer, Skeptic) run against the same underlying LLM, orchestrated by a lightweight controller that:
1. Tracks objection state (resolved/unresolved) as structured data, not free text.
2. Enforces the stopping condition (all resolved OR max 3 rounds).
3. Passes only the structured diagnosis + debate log between agents — never raw chat history — keeping context clean and auditable.

**Suggested stack:**
- **Frontend:** React (tree visualization + reasoning panel + recommendation snapshot)
- **Backend:** Lightweight API layer (e.g., FastAPI or Node/Express) orchestrating the diagnosis flow and debate loop
- **LLM:** Claude or OpenAI API, with distinct system prompts per agent role
- **State:** Simple JSON-based session state (no database needed for a hackathon-scale demo)

## 6. Why This Is Different

- Most sales bots are single-pass generation optimized to sound convincing. This bot is built to **survive scrutiny**, not just sound good — because it scrutinizes itself first.
- The objection-tagging and resolution-state system means the "internal debate" isn't just a UI trick — it's a real, inspectable control-flow mechanism, which stands up to a technical judge reading the code, not just watching the demo.
- Honesty about **open risks** (rather than hiding weaknesses) is itself a differentiator — most bots are built to always sound certain; this one is built to be trustworthy, including when it doesn't have a clean answer.

## 7. Business Outcome & Customer Impact

- **For the sales/growth team using it:** faster, higher-quality first-pass analysis of a churn/retention problem — like having a consultant's discovery-and-pressure-test process compressed into minutes instead of a multi-day exercise.
- **For their end customers/prospects (if deployed customer-facing):** recommendations that come with visible reasoning and honestly disclosed risk, rather than a black-box pitch — which increases trust and reduces the "sounds too good to be true" skepticism that kills deals.
- **Tie to revenue:** directly targets retention/expansion metrics, so impact is easy to quantify (e.g., "+X pts Month-3 retention") — a concrete, defensible ROI story rather than a vague productivity claim.

## 8. Alignment with Judging Criteria

| Criterion | Weight | How this project addresses it |
|---|---|---|
| Model Innovation & Novelty | 30% | Structured, resolvable, auditable multi-agent debate — not a prompt trick |
| Real-World Applicability | 25% | Grounded in familiar SaaS metrics; mirrors real consultative sales motion |
| Technical Architecture | 25% | Clean separation of diagnosis/debate/recommendation state; real stopping logic |
| Documentation Clarity | 20% | Structured data model makes the reasoning process easy to document and demo |

## 9. Build Plan (Solo, ~17 Days)

1. **Days 1–3:** Diagnosis flow (question tree logic + validation) and data structure.
2. **Days 4–8:** Closer/Skeptic agent prompts, objection-tagging system, resolution-state tracking, stopping condition.
3. **Days 9–12:** Frontend — tree visualization, reasoning panel, recommendation snapshot.
4. **Days 13–15:** End-to-end testing, edge cases (contradictory input, unresolved objections after 3 rounds), polish.
5. **Days 16–17:** Demo video recording, documentation, GitHub repo cleanup, final submission.
