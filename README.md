# Interview Room

GenAI / AI / ML interview preparation for senior engineers in India. Every question explains the
mechanism in plain language, gives the words to say in the room, and then checks that you really
know it: a "Check yourself" question, a hands-on exercise where it helps, and a self-rating
(Blank / Shaky / Nailed) that schedules when the question comes back.

Open `index.html` in a browser. No server, no build step to read it, no account; progress is stored
in your browser only.

## Pages

| Page | What it is for |
|---|---|
| `index.html` | Today and readiness, readiness by topic and round, all topics |
| `review.html` | Today's review: due questions first, then new ones, rated as you go |
| `mock.html` | A timed mock round with the panel's follow-up, optional recording |
| `rehearsal.html` | One random question and a timer |
| `rounds.html`, `tracks.html` | Every question by interview round; by employer type |
| `topics/*.html` | One page per topic (generated) |
| `visuals.html` | Visual explanations: every system animated from start to end |
| `visuals/*.html` | One page per visual explanation (generated) |

## Data

| File | Holds |
|---|---|
| `data/topics.js` | Topic list (order = sidebar order) and links to the matching Learn GenAI lessons |
| `data/q-<topic>.js` | The questions. Card fields: `why`, `quick`, `simple`, `points`, `diagram`, `say`, `numbers`, `wrong`, `follow`, `followAnswer`, plus `tags`, `builds` (prerequisites), `next` (where the panel goes next), `alsoIn` / `dupOf` (cross-links), `deeper` (source ids), `check` (multiple choice), `try` (exercise), `verified` (month time-sensitive facts were last checked) |
| `data/tags.js` | The controlled tag list - a card may only use these |
| `data/sources.js` | The reading list behind "Go deeper" - the only file with external links |
| `data/tracks.js` | Employer tracks |
| `data/visuals.js` | Visual explanations list (order = sidebar order), the topics each links from, its practise card ids |
| `data/v-<slug>.js` | One visual explanation's scene - see "Visual explanations" below |
| `data/catalog.js`, `data/search-index.js` | Generated - do not edit |

## After editing anything in `data/`

```
node tools/build-search-index.js   # search index + catalog
node tools/build-pages.js          # topic pages + shared <head> in the root pages
node tools/check.js                # validates everything; exits non-zero on a problem
```

To ship a change to returning readers, bump `V` at the top of `assets/portal.js` and re-run
`build-pages.js` (it copies the version into every page).

The "Learn it first" links assume the Learn GenAI portal sits next to this folder as `../genai-main/`.
Change `learnBase` in `data/topics.js` if it lives elsewhere.

`_archive/` holds retired files; nothing there is loaded.

## Visual explanations

Each visual is an SVG scene drawn by `assets/visual.js` from `data/v-<slug>.js` and walked through step
by step. Hovering a part shows its `tip`; clicking opens its full explanation. To add one: add an entry
to `data/visuals.js`, write `data/v-<slug>.js`, run `build-pages.js` and `check.js`. Open the page with
`?debug` in the address to see a 50-unit grid, every part's box and its id.

```js
window.IR.v["slug"] = {
  view: [1200, 640],            // viewBox width and height
  rows: { y: 190, gap: 56 },    // optional row grid shared by `col` parts (row centres)
  caption: "...",               // optional; the default says the numbers are illustrative
  zones:    [{ id, x, y, w, h, label, sub, tone }],          // dashed background frames, not interactive
  parts:    [{ id, kind, x, y, w, h, label, sub, tone, icon, concept, hidden, keep, ...kind keys }],
  links:    [{ id, from, to, kind, style, via, path, label, labelAt, dashed, tone, arrow, both, rows }],
  steps:    [{ title, text, focus, flow, packets, set, hl, camera }],
  concepts: { id: { title, tip, detail: [/* 3-4 paragraphs */], oneLiner } }
};
```

**Parts.** A part with a `concept` can be hovered, clicked and tabbed to; several parts may share a
concept, and decorative parts have none. `keep: true` stops a part dimming when a step lights others.
`hidden: true` hides it until a step's `set` shows it.

| `kind` | Draws | Own keys |
|---|---|---|
| `box` | Rounded box, centred `label` + wrapped `sub` (or explicit `lines`), optional `icon` | `shape: "pill"`, `rx`, `lines` |
| `stack` | A box with layers behind it (×N blocks, several agents) | `count`, `badge` |
| `db` | Cylinder | - |
| `doc` | Page(s) with the label below | `count` |
| `note` | Text only | `align`, `lines` |
| `tokens` | Row (or `dir: "col"`) of chips; items are strings or `{ t, s }` (s = small second line) | `items`, `dir`, `gap` |
| `vector` | Strip of cells, darker = larger, red = negative; `values` or `n` + `seed` | `values`, `n`, `seed`, `cell`, `dir` |
| `matrix` | Grid of dots sized by value 0-1; `mask: "causal"` greys the future | `rows`, `cols`, `values`, `mask`, `cell`, `colLabels` |
| `bars` | Horizontal bars, `items: [{ label, value, text? }]`; changes slide | `items`, `rowH`, `lw`, `max`, `fmt` |
| `col` | One cell per row of `rows`: `cell` = `text`, `chip`, `vec`, `qkv` or `dot` | `cell`, `items`, `values`, `n`, `seed`, `rows`, `align`, `cellSize` |
| `code` | Monospace block with an optional title bar | `lines`, `title` |
| `msg` | Chat bubble with a role label; `side: "r"` puts the tail right | `role`, `text`, `lines`, `side` |
| `scatter` | 2-D map; `points: [{ x, y, label, tone, r, query }]` in 0-1 (0,0 bottom-left), `rings: [{ x, y, r }]` | `points`, `rings` |
| `art` | Raw SVG markup (classes only, no colours) | `svg` |

Tones: `input`, `model`, `data`, `tool`, `guard`, `output`, `neutral` (plus `q`, `k`, `v`). Icons: user,
users, doc, db, chip, spark, tool, search, chat, server, shield, layers, clock, check, lock, graph, globe,
gear, list, code, scale, flag, eye, gauge, bolt, memory, stop, loop, plug, key, pen, filter, target,
alert, ruler, box.

**Links.** `from` / `to` is a part id, `"id:side"` (`l r t b c`), `"id:side:0.3"` (fraction along that
side), `"id:side@2"` (row 2 of a `col`, `tokens` column or `matrix`), or `[x, y]`. `style` is `curve`
(default), `straight` or `elbow`; `via: [[x, y], ...]` routes through points; `path` overrides
everything. `kind: "line"` has no arrowhead; `kind: "ribbon"` draws one band per row between two
row-aligned parts (`rows` picks some).

**Steps.** `focus` lights parts and dims the rest (step 1 is usually an overview with no focus). `flow`
highlights links. `packets: [{ on: linkId, text, with, rev, row, tone }]` travel their links once, in
order; `with: true` starts with the previous one. `set: { id: { ...keys } }` changes parts from that step
on (later steps inherit it; stepping back undoes it). `hl: { partId: [indices] }` highlights rows, chips,
bars, points or code lines for that step only. `camera: [x, y, w, h]` overrides the phone zoom.

**Writing.** Plain words, short sentences, the running example wherever it helps, British spelling,
` - ` rather than a long dash. `check.js` enforces: `tip` ≤ 30 words; `detail` 3-4 paragraphs of ≤ 95
words (what it is, how it works, what it means in practice, and optionally the interview angle);
`oneLiner` ≤ 40 words; step `text` ≤ 45 words; every concept used; every interactive part lit in at
least one step; practise ids that exist.
