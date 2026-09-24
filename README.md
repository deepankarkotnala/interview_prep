# Interview Room

An independent portal of GenAI / AI / ML interview questions for **senior engineer
roles worldwide**, focused on roughly **3–10 years of experience**, answered in simple language with the exact words to say out loud in the room.

## Run it

Open `index.html`. That is all. No build, no server, no install.

It works from `file://` on purpose: all data is plain JavaScript assigned onto
`window.IR`, so nothing needs `fetch` and nothing hits CORS.

## Independent by design

Nothing in this folder reads anything outside it. No path climbing to a sibling
directory, no CDN, no `curriculum.js` registration, no shared validator. Fonts
and the brand logo are vendored into `assets/`. Copy the folder anywhere - a USB
stick, a different machine - open `index.html`, and it still works.

`node tools/check.js` enforces this: it fails on any `../..` path and on any
external URL, so the guarantee cannot quietly rot. (Pages in `topics/` do use
`../assets/…` - that resolves inside the portal, which is the point.)

```
0_interview_focused_portal/
├── index.html                 three ways in + topic grid
├── rounds.html                every question, filtered by interview round
├── tracks.html                five employer tracks, rendered from data/tracks.js
├── rehearsal.html             timer + say-it-out-loud tracker
├── topics/NN-slug.html        one shell per topic (no card markup)
├── assets/
│   ├── portal.css             all styling, light + dark
│   ├── portal.js              theme, sidebar, search, filters, card renderer
│   ├── rehearsal.js           timer and progress
│   ├── fonts/                 vendored woff2 - Inter, JetBrains Mono
│   └── brand/                 vendored logo for the sidebar mark
├── data/
│   ├── topics.js              topic registry + round and level vocabulary
│   ├── q-NN-slug.js           the questions
│   ├── tracks.js              employer tracks: framing + card ids, no questions
│   └── glossary.js            term -> 1-2 line definition, shown as hover tooltips
├── tools/check.js             content + standalone validator, exits non-zero on failure
├── PLAN.md                    the plan, tweaked from the original
└── README.md
```

## What is built

| Topic | Cards |
| --- | ---: |
| 00 Jev: System-1 decision models | 5 |
| 01 LLM foundations | 20 |
| 02 Transformers and attention | 16 |
| 03 Prompting and structured output | 13 |
| 04 Embeddings and vector databases | 13 |
| 05 RAG | 64 |
| 06 Advanced RAG | 24 |
| 07 Agents | 42 |
| 08 LangChain | 12 |
| 19 LangGraph | 12 |
| 09 MCP, A2A and the tool boundary | 12 |
| 10 Fine-tuning and adaptation | 11 |
| 11 Evaluation | 18 |
| 12 LLMOps and observability | 12 |
| 13 Guardrails, security, responsible AI | 11 |
| 14 Cost, latency and serving | 11 |
| 15 Cloud and deployment | 9 |
| 16 ML fundamentals | 42 |
| 17 Python and the coding round | 34 |
| 18 System design, project story, HR | 28 |
| **Total** | **412** |

Plus **5 employer tracks** in `data/tracks.js` - each naming its ten
most-likely questions in priority order and one worked 40-minute scenario.
A track owns no questions of its own; it points at cards by id, and
`tools/check.js` fails the build if any id no longer exists.

All 20 topics are live. Wave history is in `PLAN.md` §8.

### 2026 role-scope refresh

The bank is aimed at AI/ML/GenAI engineering roles worldwide in the 3–10 year
range. Alongside RAG and agents, it now includes SQL and data pipelines,
distributed APIs and queues, PyTorch training basics, mixed/distributed training,
high-throughput inference, multimodal systems, Kubernetes/IaC, model registries,
production evaluation, calibration, and reliability under retries/backpressure.
Regional privacy and data-residency rules are treated as deployment constraints,
not as assumptions about where the candidate works.

### September 2026 content refresh

The live bank now has **398 questions**. The version-sensitive sections were
refreshed against current documentation: LangChain/LangGraph answers no longer
describe LCEL as a straight-line-only abstraction; MCP covers the `2026-07-28`
stateless core, discovery, routing/caching changes, MRTR, Tasks and MCP Apps; and
dedicated questions now cover context engineering and multi-step agent evaluation.
The longest teaching answers were also tightened so they stay easy to explain
without losing the senior-level trade-offs.

The UI remains on the performance-first snappy pass: native system typography,
no card lift/scale effects, instant question expansion, a short single theme fade,
short mobile drawer/dropdown transitions, no continuous decorative animation and
no backdrop blur. Reduced-motion preferences are respected.

### Interview-readiness audit (2026-09-23)

Every topic now follows the RAG topic's format: each card carries a `priority`
(high / medium / low), cards are ordered High → Medium → Low for a first read,
and every High card has a `followAnswer` - a sample answer to its follow-up
question. All answers were re-checked for correctness and currency, the
teaching `simple` text was rewritten in shorter sentences where it was dense,
and 56 high-frequency questions were added (for example: GenAI vs AI agents vs
agentic AI, agentic design patterns, agent frameworks, OWASP LLM Top 10,
QLoRA, backpropagation, and RAG-chatbot and multi-agent system design).
Indented lines inside `simple` now render as an aligned block instead of
collapsing into prose.

## Adding a question

Add an object to the `cards` array in the topic's data file. Nothing else - the
renderer, search, filters, round pages and rehearsal room pick it up
automatically.

```js
{
  id:      "rag-17",                      // unique across the whole portal
  q:       "The question, as asked",
  round:   ["tech1", "tech2"],            // keys from IR.rounds
  level:   "5-10",                        // key from IR.levels
  tags:    ["rag", "chunking"],
  why:     "What the interviewer is really testing. One line.",
  quick:   ["3–5 plain bullets, 4–12 words each.", "No jargon - a cheat sheet to glance at."],
  simple:  "Plain language. Short sentences. One analogy allowed.\n\nBlank line = new paragraph.",
  points:  ["Optional bullets"],
  code:    "Optional snippet",
  say:     "The 110–150 words you actually say out loud - flowing, conversational, one for-instance.",
  numbers: "One real figure, or say plainly that none applies.",
  wrong:   "The answer a real candidate gives that loses the offer.",
  follow:  "The next question."
}
```

`simple` and `say` support `` `code` `` and `**bold**`. Everything is escaped
before formatting, so authored text can never inject markup.

## Adding a topic

1. Set that topic's `status` to `"live"` in `data/topics.js`.
2. Create `data/q-NN-slug.js` following the shape above.
3. Copy any file in `topics/` and change the three `NN-slug` references.
4. Add the new data file's `<script>` tag to `index.html`, `rounds.html`,
   `rehearsal.html` and `tracks.html` - those four aggregate across all topics.

## Adding or editing an employer track

Edit `data/tracks.js`. A track holds framing plus a `ten` array of card ids in
priority order, and an optional worked scenario. It never holds question text - 
that stays in the topic files, so a track cannot drift out of sync with the bank.
`tools/check.js` fails if a track names an id that no longer exists, if `ten` is
not ten entries, or if it repeats an id.

## Checking your work

```bash
node tools/check.js
```

Exits non-zero on failure, so it can gate a commit. It checks the things that
actually go wrong when adding questions:

- an empty slot on any card
- a `say` that has quietly grown past 170 words - more than about a minute of speech
- a `quick` list that is not 3–5 bullets, or has a bullet over 15 words
- a duplicate card id
- a round or level outside the vocabulary in `data/topics.js`
- a live topic with no page in `topics/`, or no data file
- an "if you only have one evening" shortlist pointing at a card that does not exist
- an employer track naming a card id that no longer exists

It does not check prose quality. The 110–150 word target for `say` is a guide; the
validator only fails outside 50–170, so a deliberately tight or full answer passes.

## The two voices

Each card is written in two registers on purpose.

**`simple`** is the teaching voice. Everyday words, short sentences, at most one
concrete analogy. Read this until the mechanism is obvious.

**`say`** is the interview voice: 110–150 words, about a minute of natural, flowing
speech. It opens with a full sentence that answers the question in its own words
(never a bare "No."), gives every point its reason in the same sentence ("Firstly,
the cost would be very high, because..."), links sentences the way people talk
(firstly, so, that's why, as a result), includes one concrete "for instance" from
real work, and ends on a natural closing sentence rather than a stock phrase.
Examples yes, analogies no - an analogy in the room reads as evasion; in a tutorial
it reads as clarity. Same fact, different register.

The first mention of any term in `data/glossary.js` inside a `say` is underlined
automatically and shows its definition on hover, focus or tap. To add a tooltip,
add the term there - never mark up the answer text itself.

Every question title also has a small copy button beside its priority pill.

**`quick`** is the Quick recall list shown first in every card: 3–5 bullets of 4–12
everyday words each, no jargon, no formatting - what you glance at a minute before
the interview to remember the answer.
**`diagram`** is an optional "Picture it" drawing in the answer, written as a small JSON spec (never raw SVG) and drawn by `assets/portal.js` in both themes, with a stacked phone layout. Five kinds: a flow (`rows` + `edges`), `lanes` (a sequence), `compare` (side-by-side options), `matrix` (a 2x2 or 3x3 grid) and `stack` (layers). Colours carry one meaning everywhere: `accent` green = the core path, `warn` amber = watch out or your decision, `bad` red = failure, `muted` dashed = optional. Keep to about 7 boxes, labels of 1-4 words, and a caption with the one thing to remember. `tools/check.js` validates every spec.

## Sourcing

No page claims a question was asked at a named company. Everything is grounded in
public job descriptions, the domain the employer actually operates in, published
interview processes, and what the technology forces you to know. Each topic page
carries its grounding label. See `PLAN.md` §1.

If you have real questions from your own interviews, add them with a date - that
is how this becomes a real bank rather than an inferred one.

## Storage

Only `localStorage`: `ir.theme` and `ir.delivered`. No account, no network calls,
nothing leaves the browser.

### Snappy UI pass (2026-09-10)

The UI keeps the same page structure and content, with a performance-first motion pass: lighter native-system typography, no card lift/scale animations, native instant `<details>` question expansion, a single 90 ms page fade for theme changes, shorter mobile drawer/dropdown transitions, and no continuous decorative animations or backdrop blur. `prefers-reduced-motion` disables non-essential motion entirely.
