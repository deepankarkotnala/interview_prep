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
│   └── tracks.js              employer tracks: framing + card ids, no questions
├── tools/check.js             content + standalone validator, exits non-zero on failure
├── PLAN.md                    the plan, tweaked from the original
└── README.md
```

## What is built

| Topic | Cards |
| --- | ---: |
| 01 LLM foundations | 17 |
| 02 Transformers and attention | 14 |
| 03 Prompting and structured output | 11 |
| 04 Embeddings and vector databases | 10 |
| 05 RAG | 44 |
| 06 Advanced RAG | 13 |
| 07 Agents | 37 |
| 08 LangChain | 9 |
| 19 LangGraph | 10 |
| 09 MCP, A2A and the tool boundary | 10 |
| 10 Fine-tuning and adaptation | 8 |
| 11 Evaluation | 14 |
| 12 LLMOps and observability | 10 |
| 13 Guardrails, security, responsible AI | 8 |
| 14 Cost, latency and serving | 9 |
| 15 Cloud and deployment | 8 |
| 16 ML fundamentals | 36 |
| 17 Python and the coding round | 31 |
| 18 System design, project story, HR | 25 |
| **Total** | **324** |

Plus **5 employer tracks** in `data/tracks.js` - each naming its ten
most-likely questions in priority order and one worked 40-minute scenario.
A track owns no questions of its own; it points at cards by id, and
`tools/check.js` fails the build if any id no longer exists.

All 19 topics are live. Wave history is in `PLAN.md` §8.

### 2026 role-scope refresh

The bank is aimed at AI/ML/GenAI engineering roles worldwide in the 3–10 year
range. Alongside RAG and agents, it now includes SQL and data pipelines,
distributed APIs and queues, PyTorch training basics, mixed/distributed training,
high-throughput inference, multimodal systems, Kubernetes/IaC, model registries,
production evaluation, calibration, and reliability under retries/backpressure.
Regional privacy and data-residency rules are treated as deployment constraints,
not as assumptions about where the candidate works.

### September 2026 content refresh

The live bank now has **324 questions**. The version-sensitive sections were
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
  simple:  "Plain language. Short sentences. One analogy allowed.\n\nBlank line = new paragraph.",
  points:  ["Optional bullets"],
  code:    "Optional snippet",
  say:     "The 55–75 words you actually say out loud. No analogies here.",
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
- a `say` that has quietly grown past 85 words - too long to deliver in one breath
- a duplicate card id
- a round or level outside the vocabulary in `data/topics.js`
- a live topic with no page in `topics/`, or no data file
- an "if you only have one evening" shortlist pointing at a card that does not exist
- an employer track naming a card id that no longer exists

It does not check prose quality. The 55–75 word target for `say` is a guide; the
validator only fails outside 50–85, so a deliberately tight or full answer passes.

## The two voices

Each card is written in two registers on purpose.

**`simple`** is the teaching voice. Everyday words, short sentences, at most one
concrete analogy. Read this until the mechanism is obvious.

**`say`** is the interview voice. 55–75 words, no analogies, nothing you would
stumble over. An analogy in the room reads as evasion; in a tutorial it reads as
clarity. Same fact, different register.

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
