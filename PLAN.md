# Interview Room — plan (v2, standalone)

An **independent** portal for the questions actually asked in GenAI / AI / ML
interviews for **senior engineer roles in India**, with answers written in simple
language — the way CampusX explains LangChain and LangGraph on YouTube.

This file supersedes `../interview_focused_portal_plan.md`. What changed and why
is in §0.

---

## 0 · What changed from v1, and why

| v1 said | v2 says | Why |
| --- | --- | --- |
| Live inside the main portal, reuse `../assets/*` | **Own `assets/`, own `data/`, zero parent imports** | The ask is an independent portal. It must run if you copy the folder to a USB stick and double-click `index.html`. |
| Register every page in `assets/curriculum.js`, add a validator check | **No registration, no validator coupling** | Those are the main portal's guardrails. Importing them re-couples the two. |
| Hand-write ~505 `<details>` cards across 18 HTML files | **Cards are JS data; one renderer draws them** | 500 cards as hand-written markup is unmaintainable and drifts. As data, adding a question is 12 lines in a list, and every card is structurally identical by construction. |
| "No metaphors, no analogies" | **One concrete analogy allowed, in the `simple` slot only** | The stated target is CampusX's teaching voice, which is built on analogies. The ban stays where precision matters — the `say` slot. |
| Answer voice: formal, written | **Two voices per card** — teaching voice (`simple`) and interview voice (`say`) | You learn in one register and speak in another. Collapsing them makes the answer either unclear or unsayable. |
| 18 topics, all breadth | **18 topics, GenAI-first ordering, senior cut** | The market is hiring senior GenAI engineers. Python/ML basics stay, but late. |
| Employer tracks by named company | **Tracks by employer *type*, unchanged from v1 §1** | v1's sourcing honesty was right. Keeping it verbatim. |

Everything else from v1 — the round axis, employer tracks, the rehearsal loop,
the honesty rule about sourcing — is kept.

---

## 1 · Sourcing honesty (kept from v1, unchanged)

No page claims "this was asked at company X." What the questions are actually
built from:

1. **Public job descriptions** for GenAI / AI Engineer / ML Engineer roles at
   India centres — the panel is briefed from these.
2. **The domain the employer works in.** A healthcare payer asks about PHI and
   Azure OpenAI in a locked tenant because that is the system they run.
3. **Published interview process** — round structure and durations companies
   document themselves.
4. **What the technology forces you to know.** If you run RAG in production you
   will be asked why retrieval fails silently, because it does.

Every question set carries a grounding label. There is a slot to add real
questions from your own interviews, dated and attributed.

---

## 2 · The answer card

Each card is one object in a data file:

```js
{
  id:     "rag-04",
  q:      "Your RAG app gives wrong answers. How do you debug it?",
  round:  ["tech1", "tech2"],
  level:  "5-10",
  tags:   ["rag", "debugging", "evaluation"],

  why:    "Whether you have actually run RAG in production, or only built a demo",
  simple: "Teaching voice. Plain words. One analogy allowed. 3-6 sentences.",
  points: ["Optional bullets for a checklist or a sequence"],
  code:   "Optional short snippet",
  say:    "The 55-75 words you actually say out loud in the room",
  numbers:"One real figure to attach",
  wrong:  "The answer a real candidate gives that loses the offer",
  follow: "The next question the interviewer asks"
}
```

| Slot | Rule |
| --- | --- |
| `why` | One line. Names the *skill* being tested, not the topic |
| `simple` | CampusX voice — everyday words, short sentences, at most one analogy, no undefined jargon. If a technical noun is correct, keep it and define it once |
| `say` | 55–75 words, ≤20 words per sentence, nothing you would stumble over. **No analogies here** — an analogy in the room reads as evasion |
| `numbers` | A real figure. Every senior answer needs one, or says plainly that none applies |
| `wrong` | Quoted, then corrected in one line. Must be an answer a real candidate gives, not a strawman |
| `follow` | The next question |

`say` is the product. Everything else exists to get you there.

---

## 3 · Three ways in, one question set

- **By topic** — 18 pages, one per subject.
- **By round** — screening / technical 1 / technical 2 / hiring manager / HR.
  Same question, different answer depending on the round.
- **By employer type** — five tracks (§5).

Plus a **rehearsal loop**: pick a card, start a timer, say it out loud, mark it
delivered. State in `localStorage`.

---

## 4 · Topic map

GenAI-first, because that is what the senior roles are for.

| # | Topic | Target cards | Wave |
| --- | --- | --- | --- |
| 01 | LLM foundations — tokens, context, sampling, inference | 30 | 1 |
| 02 | Transformers and attention | 25 | 3 |
| 03 | Prompting and structured output | 25 | 2 |
| 04 | Embeddings and vector databases | 30 | 2 |
| 05 | RAG — build, evaluate, debug | 40 | 1 |
| 06 | Advanced RAG — rerank, hybrid, GraphRAG, agentic RAG | 25 | 2 |
| 07 | Agents — loop, tools, memory, termination | 35 | 1 |
| 08 | LangChain and LangGraph | 30 | 1 |
| 09 | MCP, A2A and the tool boundary | 20 | 2 |
| 10 | Fine-tuning, LoRA, distillation — and when not to | 25 | 3 |
| 11 | Evaluation — offline, online, LLM judges | 30 | 1 |
| 12 | LLMOps, tracing, observability | 25 | 2 |
| 13 | Guardrails, security, responsible AI | 30 | 2 |
| 14 | Cost, latency, throughput, serving | 25 | 3 |
| 15 | Cloud and deployment — Azure, AWS, Databricks | 25 | 3 |
| 16 | ML fundamentals for AI engineers | 30 | 4 |
| 17 | Python and coding round | 30 | 4 |
| 18 | System design, project story, behavioural | 25 | 3 |
| | **Total** | **≈505** | |

---

## 5 · Employer tracks

| Track | Covers | Questions skew to |
| --- | --- | --- |
| Healthcare payer / provider | Optum, UHG, Philips, Siemens Healthineers | PHI, de-identification, HIPAA, Azure OpenAI in a regulated tenant, audit trails, human in the loop |
| Banking and financial services | JPMorgan, Goldman, Amex, Wells Fargo, Deutsche | Auditability, citations, model risk governance, data residency, deterministic fallbacks |
| Retail and supply chain | Walmart Global Tech, Target, Lowe's, Tesco | Cost per request at volume, catalogue RAG, latency budgets, caching, multilingual |
| Product and platform | Microsoft IDC, Google, Salesforce, ServiceNow, Adobe | Depth on one system, evaluation rigour, trade-off defence, a coding round alongside |
| Services and consulting | TCS, Infosys, Wipro, Cognizant, Accenture | Breadth over depth, client framing, delivery estimates, accelerators, multi-cloud |

---

## 6 · Rounds

| Round | Typical | Tests | Answer shape |
| --- | --- | --- | --- |
| Screening | 20–30 min, recruiter | Are the CV claims real | 30 seconds, no jargon, one number |
| Technical 1 | 45–60 min | Fundamentals, did you build it yourself | 2 minutes, mechanism then trade-off |
| Technical 2 / design | 60 min | Can you architect and defend it | Requirements before technology names |
| Hiring manager | 45 min | Ownership, incidents, judgement | A story with a decision and a consequence |
| HR / fitment | 30 min | Stability, expectations, notice | Short, consistent, no negotiation detail |

---

## 7 · Files

```
0_interview_focused_portal/
  index.html            three ways in
  rounds.html           by round
  tracks.html           by employer type
  rehearsal.html        timer + delivered-out-loud tracker
  topics/NN-slug.html   one shell per topic
  assets/portal.css     all styling, no parent imports
  assets/portal.js      theme, nav, search, filters, card renderer
  assets/rehearsal.js   timer and localStorage progress
  assets/fonts/         vendored woff2 — Inter, JetBrains Mono
  assets/brand/         vendored logo, used by the sidebar mark
  data/topics.js        topic registry
  data/q-NN-slug.js     the cards
  tools/check.js        content + standalone validator
  PLAN.md  README.md
```

A topic page is a shell. It sets `data-topic`, loads its data file and the
renderer, and contains no card markup.

**Nothing is loaded from outside this folder** — no `../..` paths, no CDN, no
sibling directory. Fonts and the brand logo are vendored into `assets/`. Files
at the root reference `assets/…`; pages in `topics/` reference `../assets/…`,
which is still inside the portal. `node tools/check.js` fails the build on any
path that climbs above the portal root and on any external URL, so this cannot
regress unnoticed.

---

## 8 · Waves

- **Wave 1 — done.** Framework, plus topics 01, 05, 07, 08, 11 (60 cards).
  These five carry most of what a senior GenAI interview actually spends time on.
- **Wave 2 — done.** Topics 03, 04, 06, 09, 12, 13 (52 cards). Portal total 112.
- **Wave 3 — done.** Topics 02, 10, 14, 15, 18 (38 cards). Portal total 150.
- **Wave 4 — done.** Topics 16, 17 (14 cards), then the five employer tracks.
  Portal total 167 cards across all 18 topics, plus 5 tracks.

All planned waves are complete. What remains is not a wave but ongoing work:
adding real questions from actual interviews, dated and attributed (§1), and
pruning any card that stops being asked.

Card counts per topic are below the wave-2 targets in §4 by design — each topic
carries the questions that earn their place today, and grows when a real
interview supplies one. `node tools/check.js` gates every addition.

---

## 9 · A card is done when

1. All slots filled.
2. `simple` reads like it was spoken to a beginner, and contains at most one analogy.
3. `say` is 55–75 words and contains none.
4. It carries a real number, or says no number applies.
5. `wrong` quotes something a real candidate would actually say.
6. Round, level and tags are set.
7. No undefined jargon.

---

## 10 · Out of scope

DSA, salary negotiation, visa and relocation, non-AI backend rounds beyond
topic 17.
