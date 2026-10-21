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

## Data

| File | Holds |
|---|---|
| `data/topics.js` | Topic list (order = sidebar order) and links to the matching Learn GenAI lessons |
| `data/q-<topic>.js` | The questions. Card fields: `why`, `quick`, `simple`, `points`, `diagram`, `say`, `numbers`, `wrong`, `follow`, `followAnswer`, plus `tags`, `builds` (prerequisites), `next` (where the panel goes next), `alsoIn` / `dupOf` (cross-links), `deeper` (source ids), `check` (multiple choice), `try` (exercise), `verified` (month time-sensitive facts were last checked) |
| `data/tags.js` | The controlled tag list - a card may only use these |
| `data/sources.js` | The reading list behind "Go deeper" - the only file with external links |
| `data/tracks.js` | Employer tracks |
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
