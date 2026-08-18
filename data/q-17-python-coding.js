/* Topic 17 — Python and the coding round.
   Grounding: public JDs requiring Python for AI engineering, plus the coding
   tasks that actually appear in these loops. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["17-python-coding"] = {
  lede: "AI engineer coding rounds are rarely algorithm puzzles. They are usually: write this pipeline properly, make it concurrent, validate this output, handle this failure. The questions here are the ones that come up because the job involves calling slow, unreliable, expensive APIs — which is a specific kind of Python problem.",
  grounding: "public JDs requiring Python + the coding tasks that appear in these loops",
  evening: ["py-01", "py-03", "py-04", "py-06"],

  cards: [
    {
      id: "py-01",
      q: "When would you use async in an AI application?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["python", "async", "concurrency"],
      why: "The most relevant Python question for this role, because the work is almost entirely I/O-bound.",
      simple:
        "Almost everything an AI application does is waiting — for a model, for a vector database, for a tool API. Waiting is exactly what async is for.\n\n" +
        "The rule: async helps with I/O-bound work, not CPU-bound work. Twenty model calls that each take a second take twenty seconds sequentially and about one second concurrently, because the waiting overlaps. Twenty CPU-heavy computations take the same time either way, and worse, they block the event loop and stall everything else.\n\n" +
        "So in practice: async for model calls, retrieval, tool calls and database queries. For genuine CPU work — a large tokenisation job, image processing — push it to a thread or process pool so it does not block the loop.\n\n" +
        "The specific trap worth naming, because it is the bug interviewers look for: one synchronous call inside an async function blocks the entire event loop, not just that coroutine. A single `requests.get` in an otherwise async pipeline silently serialises everything, and it is very hard to see.",
      code:
        "# sequential: ~20s for 20 calls\n" +
        "results = [await llm.ainvoke(q) for q in questions]\n\n" +
        "# concurrent: ~1s, bounded so we do not trip rate limits\n" +
        "sem = asyncio.Semaphore(10)\n" +
        "async def one(q):\n" +
        "    async with sem:\n" +
        "        return await llm.ainvoke(q)\n" +
        "results = await asyncio.gather(*(one(q) for q in questions),\n" +
        "                               return_exceptions=True)   # one failure ≠ all lost",
      points: [
        "Async helps I/O-bound work. Model calls, retrieval, tools, databases.",
        "CPU-bound work belongs in a thread or process pool.",
        "One blocking call inside an async function stalls the whole event loop.",
        "Bound concurrency with a semaphore, or you will hit provider rate limits.",
        "`return_exceptions=True` on gather, so one failure does not lose the batch."
      ],
      say: "Almost everything here is waiting on a model, a vector store or a tool API, which is exactly what async is for. Twenty one-second calls take twenty seconds sequentially and about one concurrently. CPU-bound work goes to a thread or process pool instead. The trap is that a single blocking call inside an async function stalls the whole event loop, so one `requests.get` silently serialises the pipeline.",
      numbers: "Bound concurrency with a semaphore — around 10 is a common starting point. Unbounded gather over hundreds of calls trips provider rate limits immediately.",
      wrong: "\"Async makes it faster.\" Only for I/O. Saying it generally invites the follow-up about CPU-bound work, which this answer cannot survive.",
      follow: "Your gather of 500 calls returns rate-limit errors. What do you change?"
    },

    {
      id: "py-02",
      q: "Why do generators matter when processing documents?",
      round: ["tech1"],
      level: "2-5",
      tags: ["python", "generators", "memory"],
      why: "A common live-coding theme, because ingestion pipelines are exactly where this bites.",
      simple:
        "A generator produces items one at a time instead of building the whole list in memory. For ingestion that is the difference between a pipeline that runs and one that gets killed by the operating system.\n\n" +
        "If you read ten thousand documents into a list, chunk them all into another list, and embed from that, you are holding everything at once. With generators, each document flows through the pipeline and is released before the next one is read, so memory stays flat regardless of corpus size.\n\n" +
        "The other place it matters here is streaming. A generator is the natural shape for token-by-token output — you yield each token as it arrives rather than waiting for the whole response.\n\n" +
        "The two things to know about the trade-off: a generator can only be consumed once, so if you need the data twice you must materialise it or regenerate it. And you cannot take its length without consuming it, which is why progress bars over generators need the count passed in separately.",
      code:
        "def chunks(paths):\n" +
        "    for p in paths:                       # one document in memory at a time\n" +
        "        for c in split(read(p)):\n" +
        "            yield c\n\n" +
        "def batched(it, n):                       # embed in batches without a full list\n" +
        "    batch = []\n" +
        "    for item in it:\n" +
        "        batch.append(item)\n" +
        "        if len(batch) == n:\n" +
        "            yield batch; batch = []\n" +
        "    if batch: yield batch\n\n" +
        "for group in batched(chunks(paths), 100):\n" +
        "    store.add(embed(group))",
      points: [
        "One item in memory at a time — memory stays flat as the corpus grows.",
        "The natural shape for token streaming.",
        "Consumable once. Need it twice, materialise or regenerate.",
        "No length without consuming — pass the count separately for progress.",
        "Batching over a generator is the standard ingestion pattern."
      ],
      say: "A generator yields items one at a time instead of building the whole list, so an ingestion pipeline holds one document rather than ten thousand and memory stays flat as the corpus grows. It is also the natural shape for token streaming. The trade-offs are that it can only be consumed once, so I materialise if I need the data twice, and I cannot take its length without consuming it.",
      numbers: "No number applies — memory stays roughly constant instead of scaling with corpus size, which is the whole point.",
      wrong: "\"Generators are more memory efficient.\" True and unexplained. The interviewer wants the ingestion pipeline consequence.",
      follow: "You need to retry a failed batch. What does that do to your generator design?"
    },

    {
      id: "py-03",
      q: "How do you use Pydantic in an LLM pipeline?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["python", "pydantic", "validation", "structured-output"],
      why: "Pydantic is named in a large share of these JDs, and its role here is specific.",
      simple:
        "It does two jobs, and they are worth separating.\n\n" +
        "First, it defines the schema you hand to the model. Most frameworks and providers can turn a Pydantic model into the JSON schema for structured output or a tool definition, so the model is constrained by the same class your code uses. One definition, no drift between what you asked for and what you parse.\n\n" +
        "Second, it validates what comes back. This is the part that matters even with constrained decoding, because valid JSON is not correct JSON. A field can hold a claim ID with the right shape that does not exist, or a date in the future. Pydantic validators are where you put those business rules.\n\n" +
        "The practical points: keep models flat, because deeply nested schemas raise the model's failure rate on every provider. Use `Literal` or an enum rather than a free-text string wherever the values are known, since that constrains generation too. And write field descriptions, because they become part of the schema the model reads — they are prompt text, not documentation.",
      code:
        "class ClaimDecision(BaseModel):\n" +
        "    claim_id: str = Field(description=\"Claim reference as printed on the form, e.g. C-4471\")\n" +
        "    decision: Literal[\"approve\", \"deny\", \"refer\"]\n" +
        "    reason:   str = Field(max_length=300)\n" +
        "    cited:    list[str] = Field(description=\"Chunk ids supporting this decision\")\n\n" +
        "    @field_validator(\"cited\")\n" +
        "    def cited_must_exist(cls, v, info):\n" +
        "        # shape was guaranteed by the schema; existence never is\n" +
        "        unknown = set(v) - RETRIEVED_IDS.get()\n" +
        "        if unknown: raise ValueError(f\"invented citations: {unknown}\")\n" +
        "        return v",
      points: [
        "One class defines both the schema sent to the model and the parser.",
        "Validate even with constrained decoding — valid JSON is not correct JSON.",
        "Business rules go in validators: does this id exist, is this date plausible.",
        "Keep models flat. Nesting raises failure rates on every provider.",
        "`Literal` and enums over free text — they constrain generation too.",
        "Field descriptions are prompt text the model reads, not documentation."
      ],
      say: "Two jobs. It defines the schema handed to the model, so one class is both the tool definition and the parser and nothing drifts. And it validates what comes back, which matters even with constrained decoding, because valid JSON is not correct JSON — a well-shaped claim id can still be invented. Business rules go in validators. I keep models flat and use Literal over free text, since that constrains generation too.",
      numbers: "Keep schemas to two levels of nesting or fewer. Failure rates climb noticeably with depth across providers.",
      wrong: "\"I use it to parse the JSON response.\" Half its value. It misses that the same class defines what you asked the model for.",
      follow: "The schema validated and the claim id does not exist. Where does that get caught?"
    },

    {
      id: "py-04",
      q: "Write a retry wrapper for a model call. What does it need?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["python", "reliability", "retries", "coding"],
      why: "A very common live-coding task, and most candidates miss two of the four requirements.",
      simple:
        "Four things, and the ones people forget are the third and fourth.\n\n" +
        "Exponential backoff with jitter. Backoff so you stop hammering a struggling service; jitter so a thousand clients do not all retry at the same instant and recreate the spike.\n\n" +
        "A cap on attempts and on total elapsed time. Without a time cap, three retries against a service timing out at thirty seconds is a ninety-second request nobody is still waiting for.\n\n" +
        "Retry only what is retryable. Rate limits, timeouts and 5xx errors deserve a retry. A content-policy refusal, an authentication failure or a malformed request will fail identically every time, and retrying them burns money and hides the real error. This is the requirement most candidates skip.\n\n" +
        "And observability: log every retry with the reason and count. A rising retry rate is a leading indicator of an incident, and if you swallow retries silently your latency gets worse for reasons nobody can see.\n\n" +
        "In production, use a library like tenacity rather than hand-rolling it — but know what it is doing.",
      code:
        "RETRYABLE = (RateLimitError, APITimeoutError, InternalServerError)\n\n" +
        "async def call(prompt, attempts=3, deadline=20.0):\n" +
        "    start = time.monotonic()\n" +
        "    for i in range(attempts):\n" +
        "        try:\n" +
        "            return await llm.ainvoke(prompt)\n" +
        "        except RETRYABLE as e:\n" +
        "            elapsed = time.monotonic() - start\n" +
        "            wait = min(2 ** i, 8) + random.uniform(0, 1)   # backoff + jitter\n" +
        "            if i == attempts - 1 or elapsed + wait > deadline:\n" +
        "                log.warning(\"giving up\", attempt=i, elapsed=elapsed, err=str(e))\n" +
        "                raise\n" +
        "            log.info(\"retrying\", attempt=i, wait=wait, err=type(e).__name__)\n" +
        "            await asyncio.sleep(wait)\n" +
        "        # non-retryable errors propagate immediately, uncaught",
      points: [
        "Exponential backoff plus jitter — jitter prevents synchronised retry storms.",
        "Cap attempts **and** total elapsed time.",
        "Retry only retryable errors. Policy refusals and auth failures never are.",
        "Log every retry with reason and count — it is a leading incident indicator.",
        "Use tenacity in production, but know what it does.",
        "A circuit breaker sits above this for sustained outages."
      ],
      say: "Four things. Exponential backoff with jitter, so clients do not synchronise into a retry storm. A cap on both attempts and total elapsed time, because three retries against a thirty-second timeout is a request nobody is waiting for. Retrying only retryable errors — a policy refusal or auth failure fails identically and burns money. And logging every retry, because a rising retry rate is a leading incident indicator.",
      numbers: "2–3 attempts with a total deadline around 20 seconds is a sane default for an interactive path. Uncapped retries turn a provider blip into your own outage.",
      wrong: "Retrying every exception. It converts a permanent failure into a slow permanent failure, at three times the cost, with the real error buried.",
      follow: "The provider is down for ten minutes. Does your wrapper help or hurt?"
    },

    {
      id: "py-05",
      q: "How do you test code that calls an LLM?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["python", "testing", "mocking"],
      why: "It reveals whether your GenAI code is production code or notebook code.",
      simple:
        "Isolate the non-deterministic part and test everything around it, which is most of the code.\n\n" +
        "Structure for it first: the model call sits behind a small interface, so tests can substitute a fake that returns a fixed response. Now your prompt assembly, parsing, validation, error handling, routing and termination logic are all deterministic and test in milliseconds without an API key. This is the bulk of your test suite and the part most teams never write.\n\n" +
        "Then test the failure paths explicitly, because they are where production breaks and they are trivial to test with a fake: malformed JSON, a truncated response, a rate-limit error, an empty retrieval result, a tool that raises.\n\n" +
        "A small integration suite runs against a real model, asserting structure rather than wording — does it parse, are required fields present, is it in the right language. Never assert on exact text.\n\n" +
        "And evaluation is separate from testing: a score you track, not a boolean that passes. Conflating the two gives you a flaky test suite people learn to ignore.",
      points: [
        "Model call behind an interface so a fake can be substituted.",
        "Unit-test prompt assembly, parsing, validation, routing, termination — all deterministic.",
        "Explicitly test failure paths: malformed JSON, truncation, rate limits, empty retrieval.",
        "Integration tests assert structure, never exact wording.",
        "Evaluation is a tracked score, not a pass/fail test. Keep them separate.",
        "If every test needs an API key, the suite will not run in CI."
      ],
      say: "I put the model call behind a small interface so tests can substitute a fake with a fixed response. Then prompt assembly, parsing, validation, routing and termination are all deterministic and test in milliseconds without an API key — that is the bulk of the suite. I explicitly test failure paths like malformed JSON and rate limits. Integration tests assert structure, never wording. And evaluation is a tracked score, not a test.",
      numbers: "Keep the mocked suite fast enough to run on every commit — seconds, not minutes. If it needs an API key it will get skipped.",
      wrong: "\"You cannot really test LLM code because it is non-deterministic.\" Only the model call is. Everything around it is ordinary software, and this answer says you did not try.",
      follow: "Your fake returns valid JSON. What bug does that hide?"
    },

    {
      id: "py-06",
      q: "Live task: build a concurrent document ingestion pipeline.",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["python", "coding", "pipeline", "concurrency"],
      why: "A representative hands-on task. What is being marked is error handling and bounded concurrency, not the happy path.",
      simple:
        "Say your requirements out loud before typing, because that is being marked too: it must not hold the whole corpus in memory, one bad document must not kill the run, concurrency must be bounded so we do not trip rate limits, and it must be resumable.\n\n" +
        "Then the shape. Stream documents rather than listing them. Chunk with a generator. Batch the chunks, because embedding APIs are far cheaper and faster per item in batches. Run embedding calls concurrently under a semaphore. Catch per-document failures, log them with the document id, and continue — a dead-letter list, not a crash. Record progress so a rerun skips completed work.\n\n" +
        "The things interviewers watch for: an unbounded `gather` over the whole corpus, which will rate-limit immediately; a bare `except` that swallows the reason; loading everything into a list first; and no idempotency, so a rerun duplicates chunks in the index.\n\n" +
        "Say the resumability requirement even if you do not implement it in the time. It is the thing that separates a script from a pipeline.",
      code:
        "async def ingest(paths, batch=100, concurrency=8):\n" +
        "    sem = asyncio.Semaphore(concurrency)\n" +
        "    failed = []\n\n" +
        "    async def embed_batch(group):\n" +
        "        async with sem:                      # bounded: respects rate limits\n" +
        "            return await embedder.aembed([c.text for c in group])\n\n" +
        "    for group in batched(chunks(paths), batch):   # generators: flat memory\n" +
        "        try:\n" +
        "            vectors = await embed_batch(group)\n" +
        "            # upsert by deterministic chunk id -> rerunning is idempotent\n" +
        "            await store.upsert([(c.id, v, c.meta) for c, v in zip(group, vectors)])\n" +
        "            await progress.mark([c.doc_id for c in group])\n" +
        "        except Exception as e:\n" +
        "            log.error(\"batch failed\", ids=[c.id for c in group], err=str(e))\n" +
        "            failed.extend(group)             # dead-letter, do not abort the run\n" +
        "    return failed",
      points: [
        "State requirements first: memory, failure isolation, bounded concurrency, resumability.",
        "Generators for streaming; batch before embedding.",
        "Semaphore-bounded concurrency, never an unbounded gather over the corpus.",
        "Per-batch error handling into a dead-letter list. Do not abort the run.",
        "Deterministic chunk ids and upsert, so a rerun is idempotent.",
        "Record progress so a rerun skips completed work."
      ],
      say: "I would state the requirements first: flat memory, one bad document must not kill the run, bounded concurrency for rate limits, and resumability. Then generators to stream documents and chunks, batching before embedding, embedding calls under a semaphore, per-batch error handling into a dead-letter list rather than aborting, and deterministic chunk ids with upsert so a rerun is idempotent rather than duplicating.",
      numbers: "Batch size around 100 for embeddings, concurrency around 8. Tune both against your provider's rate limits rather than guessing upward.",
      wrong: "An unbounded `asyncio.gather` over every document. It looks impressively concurrent and rate-limits on the first real corpus.",
      follow: "The run died at 60%. What happens when you restart it?"
    }
  ]
};
