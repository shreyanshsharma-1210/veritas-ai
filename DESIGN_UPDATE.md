# VERITAS AI — BRAND REDESIGN & VISUAL IDENTITY BLUEPRINT
## Design Direction: BURGUNDY × GOLD — PREMIUM BUSINESS INTELLIGENCE

**Document Version:** 2.0.0  
**Effective Date:** November 2026  
**Status:** Implemented & Verified in Production Build

---

## 1. Executive Summary & Brand Positioning

Veritas AI has transitioned from its original olive/beige exploratory palette into an authoritative, executive-grade design system: **BURGUNDY × GOLD — Premium Business Intelligence**.

Traditional enterprise sales assistants rely on opaque single-prompt LLM generation. Veritas AI operates on structured discovery, multi-agent adversarial debate, and transparent empirical decisions:
$$\text{Diagnose} \longrightarrow \text{Debate} \longrightarrow \text{Decide}$$

The aesthetic communicates:
* **Intelligence & Analytical Depth:** Deep Burgundy structures and high-density financial metrics.
* **Trust & Enterprise Authority:** Signature Gold accents and formal Cormorant Garamond display typography.
* **Restraint:** A hybrid light/dark composition with zero frivolous neon glows, electric gradients, or decorative distractions.

---

## 2. Colour System Architecture

The palette enforces a **45% / 30% / 15% / 10%** visual distribution ratio:
* **45% Warm Ivory & White:** Core content legibility, cards, forms, and editorial reading surfaces.
* **30% Deep Burgundy & Charcoal Plum:** High-authority dark contrast sections (Problem vs Solution, Architecture/Technology, Final CTA, and Footer).
* **15% Neutral Supporting Surfaces:** Soft Blush panels and warm borders (`#E2D9D4`).
* **10% Signature Gold & Dusty Rose:** Controlled accents, active indicators, agent signatures, and key metrics.

### Core Swatches

| Token Name | Hex Code | Role & Surface Mapping |
| :--- | :--- | :--- |
| **Deep Burgundy** | `#451F2D` | Primary brand surface, hero headings, Problem vs Solution background, Final CTA background. |
| **Warm Ivory** | `#F5F1ED` | Main light page background, navigation surface, and methodology backdrop. |
| **Signature Gold** | `#C7A05A` | Golden Veritas AI logo accent, live telemetry badges, flowchart lines, and premium highlights. |
| **Dusty Rose** | `#9B747A` | Skeptic Agent identity, unresolved risk indicators, and subtle supporting graphics. |
| **Charcoal Plum** | `#30272A` | Deep dark technology/architecture background, technical node surrounds, and footer. |
| **Soft Blush** | `#E9DFDC` | Secondary panel backgrounds, subtle card alternation, and chip fills. |
| **Card White** | `#FFFFFF` | Primary dashboard cards, architecture nodes, and wizard container surfaces. |

### Semantic State Colors

| State | Background | Foreground / Border | Purpose |
| :--- | :--- | :--- | :--- |
| **Active / Live** | `#F5F1ED` | `#C7A05A` | Real-time debate SSE streaming, active round tabs |
| **Resolved / Mitigated** | `#E8F2EC` | `#2E5A44` | Verified objections with empirical proof |
| **Unresolved / Residual** | `#F7EFF1` | `#9B747A` | Transparently disclosed residual risks |
| **Warning / Monotonicity** | `#FBF4E8` | `#A88340` | Cohort decay alerts ($M_3 \le M_1$ constraints) |

---

## 3. Typography Hierarchy

| Category | Typeface | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Display Headings** | *Cormorant Garamond* | Light (300), Medium (500), Bold (700) | Hero title, section headings, executive quotes, stage numerals |
| **Interface & Data** | *Inter* | Regular (400), Medium (500), Semibold (600), Bold (700) | Navigation links, body copy, dashboard cards, metric values, buttons |
| **Technical Specs** | *JetBrains Mono / monospace* | Regular (400), Medium (500) | Formulaic definitions, LLM model IDs, SSE event logs, ARR math |

---

## 4. Section-Level Architectural Treatments

### A. Navigation (`src/components/Navbar.tsx`)
* **Background:** Warm Ivory (`#F5F1ED`) with a fine border (`#E2D9D4`).
* **Branding:** Original golden Veritas AI logo preserved in full resolution alongside Deep Burgundy serif wordmark.
* **Links:** Deep Burgundy text (`#451F2D`) with Signature Gold hover transition. Smooth hash scrolling to `#problem-solution`, `#technology`, and `#working`.
* **Primary Action:** Deep Burgundy button with Signature Gold border and warm ivory text.

### B. Hero & Product Centerpiece (`src/components/Hero.tsx` & `src/components/DashboardPreview.tsx`)
* **Background:** Warm Ivory (`#F5F1ED`).
* **Headline:** Deep Burgundy (`#451F2D`) Cormorant Garamond display.
* **Pipeline Flowchart:** Gold vertical guide connector lines (`#C7A05A`) linking Business Context &rarr; Diagnose &rarr; Debate &rarr; Decide &rarr; Verified Recommendation.
* **Dashboard Preview Centerpiece:**
  * Clean White card (`#FFFFFF`) with Deep Burgundy headings.
  * Signature Gold pulsing "Live" status badge.
  * Closer sparkline in Deep Burgundy (`#451F2D`); Skeptic sparkline in Dusty Rose (`#9B747A`).
  * Live status spinner rendered in Signature Gold.

### C. Statistics Section (`src/components/StatsBar.tsx`)
* **Background:** Crisp White (`#FFFFFF`) container with warm dividers.
* **Key Metrics:** `50+ Analyses Run`, `93% Risk Resolution Rate`, and `Minutes to Recommendation` rendered in bold Deep Burgundy with Signature Gold numeric accents.

### D. Problem vs Solution (`src/components/ProblemSolution.tsx`)
* **Background:** Prominent **Deep Burgundy (`#451F2D`)** full dark section.
* **Divider:** Floating Signature Gold (`#C7A05A`) circular arrow badge.
* **The Problem (Left):** Deep Plum panel (`#371723`) with Dusty Rose scribble graphic and cross icons.
* **The Solution (Right):** Rich Burgundy panel (`#3E1B28`) with Signature Gold concentric alignment rings and verified checkmarks.

### E. Consultative Methodology (`src/components/Methodology.tsx`)
* **Background:** Warm Ivory (`#F5F1ED`).
* **Three Strategic Cards:** White surfaces (`#FFFFFF`) with Signature Gold stage numerals (`01`, `02`, `03`), Deep Burgundy titles, and ping-pong adversarial debate visualizer.

### F. Feature Grid (`src/components/FeatureGrid.tsx`)
* **Cards:** Alternating White (`#FFFFFF`) and Soft Blush (`#FAF8F5`) cards with Signature Gold icon badge containers and Deep Burgundy typography.

### G. Technology & Architecture (`src/components/Technology.tsx`)
* **Background:** Full-bleed **Charcoal Plum (`#30272A`)** dark technical visualization.
* **Visual Runtime Pipeline:** White architecture nodes on dark Charcoal Plum base connected with animated Signature Gold pulse lines.
* **4 Technical Pillars:**
  1. *Dual Groq LPU Inference* (Key 1 Closer / Key 2 Skeptic).
  2. *Deterministic Math Engine* ($M_3 \le M_1$ Monotonicity & ARR formulas).
  3. *Bounded 3-Round State Machine* (Hard stop with early convergence).
  4. *Async FastAPI + SQLite WAL* (SSE real-time streaming).
* **Tech Stack Bar:** Dark Charcoal Plum pills highlighting Python 3.14, FastAPI, Groq LPU, SQLite WAL, React 19, TypeScript, and Tailwind CSS v4.

### H. Final CTA (`src/components/CTA.tsx`)
* **Background:** Prominent **Deep Burgundy (`#451F2D`)** section.
* **Typography:** Warm Ivory text with Signature Gold italic keyword highlight (`reasoning?`).
* **Button:** High-contrast Signature Gold button (`#C7A05A`) with Deep Burgundy text.

### I. Footer (`src/components/Footer.tsx`)
* **Background:** **Charcoal Plum (`#30272A`)** with fine dark plum border (`#4A3A40`).
* **Layout:** Clean two-column format with Veritas AI golden logo and tagline on the left, and builder attribution with Signature Gold heart on the right.

---

## 5. Agent Differentiation in Workspace

| Agent | Visual Identity | Primary Hex | Accent Hex | Role Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Closer AI** | Deep Burgundy | `#451F2D` | `#C7A05A` | Formulation of ARR-accretive solutions, onboarding milestones, and in-app triggers |
| **Skeptic AI** | Dusty Rose | `#9B747A` | `#451F2D` | Stress-testing assumptions against diagnostic facts, engineer bandwidth, and false churn |
| **Debate Evaluator** | Neutral Editorial | `#30272A` | `#2E5A44` | Deterministic resolution audit, 3-round upper bound enforcement, and fast convergence |

---

## 6. Verification & Quality Assurance

* **TypeScript:** `npx tsc -b` completed with **0 errors**.
* **Linting:** `oxlint` scanned 24 files with 103 rules and reported **0 warnings, 0 errors**.
* **Build Check:** `npm run build` compiled client bundle in **2.65s** cleanly into `dist/`.
* **Asset Integrity:** Original golden `/logo.png` preserved without alteration or loss of fidelity.
* **Link Preservation:** All hash anchors (`#problem-solution`, `#technology`, `#working`), workspace routes (`/app`, `/app/new`, `/app/history`, `/app/settings`), and external GitHub links function with smooth scrolling.

