/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["17-python-coding"] = {
  "lede": "Senior AI engineer coding rounds mix normal software engineering with AI-specific I/O: async APIs, validation, streaming, SQL, testing, data pipelines and failure handling. Product companies may still include standard data-structure problems, so this topic covers both production code and interview coding rather than assuming every round is an LLM wrapper exercise.",
  "grounding": "public JDs requiring Python + the coding tasks that appear in these loops",
  "evening": [
    "py-01",
    "py-07",
    "py-11",
    "py-14",
    "py-20"
  ],
  "cards": [
    {
      "id": "py-01",
      "q": "When would you use async in an AI application?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "async",
        "concurrency"
      ],
      "why": "The most relevant Python question for this role, because the work is almost entirely I/O-bound.",
      "simple": "Almost everything an AI application does is waiting - for a model, vector database, tool API or remote store. Waiting is exactly what async is good at.\n\nThe rule is simple: async helps I/O-bound work, not CPU-bound work. If twenty model calls each take about one second, sequential execution takes about twenty seconds. With a concurrency limit of ten, they complete in roughly two waves, so around two seconds plus overhead. Unbounded concurrency is not better; it usually hits rate limits or connection limits.\n\nFor CPU-heavy work such as image processing or expensive parsing, use a process pool or a worker service when you need parallel CPU execution. A thread can still be useful for blocking I/O libraries, and optional free-threaded Python builds change the CPU story, but you should not assume every runtime and extension is ready for that.\n\nThe common bug is a blocking call inside async code. One synchronous network call can block the event loop and make unrelated requests wait too.",
      "code": "# sequential: about 20s for twenty ~1s calls\nresults = [await llm.ainvoke(q) for q in questions]\n\n# bounded concurrency: ten at a time -> roughly two waves\nsem = asyncio.Semaphore(10)\n\nasync def one(q):\n    async with sem:\n        return await llm.ainvoke(q)\n\nresults = await asyncio.gather(\n    *(one(q) for q in questions),\n    return_exceptions=True,\n)",
      "points": [
        "Async helps I/O-bound work such as model, retrieval, tool and database calls.",
        "Bound concurrency with a semaphore or worker pool.",
        "A limit of ten means twenty one-second calls need about two waves, not one.",
        "Move CPU-heavy work off the event loop.",
        "Do not call blocking network libraries directly inside async request code."
      ],
      "say": "I use async for I/O-bound work such as model calls, retrieval and tool APIs, because waiting can overlap. If twenty calls take about one second each and I allow ten at a time, I expect roughly two waves, not one second total. I bound concurrency to protect rate limits. CPU-heavy work goes to an appropriate worker or process path, and I avoid blocking library calls inside async code because they stall the event loop.",
      "numbers": "With a concurrency limit of 10, twenty independent one-second calls have a lower bound of about two seconds plus overhead. Pick the limit from provider and connection capacity, not a magic constant.",
      "wrong": "\"Async makes it faster.\" Only for I/O. Saying it generally invites the follow-up about CPU-bound work, which this answer cannot survive.",
      "follow": "Your gather of 500 calls returns rate-limit errors. What do you change?"
    },
    {
      "id": "py-02",
      "q": "Why do generators matter when processing documents?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "generators",
        "memory"
      ],
      "why": "A common live-coding theme, because ingestion pipelines are exactly where this bites.",
      "simple": "A generator produces items one at a time instead of building the whole list in memory. For ingestion that is the difference between a pipeline that runs and one that gets killed by the operating system.\n\nIf you read ten thousand documents into a list, chunk them all into another list, and embed from that, you are holding everything at once. With generators, each document flows through the pipeline and is released before the next one is read, so memory stays flat regardless of corpus size.\n\nThe other place it matters here is streaming. A generator is the natural shape for token-by-token output - you yield each token as it arrives rather than waiting for the whole response.\n\nThe two things to know about the trade-off: a generator can only be consumed once, so if you need the data twice you must materialise it or regenerate it. And you cannot take its length without consuming it, which is why progress bars over generators need the count passed in separately.",
      "code": "def chunks(paths):\n    for p in paths:                       # one document in memory at a time\n        for c in split(read(p)):\n            yield c\n\ndef batched(it, n):                       # embed in batches without a full list\n    batch = []\n    for item in it:\n        batch.append(item)\n        if len(batch) == n:\n            yield batch; batch = []\n    if batch: yield batch\n\nfor group in batched(chunks(paths), 100):\n    store.add(embed(group))",
      "points": [
        "One item in memory at a time - memory stays flat as the corpus grows.",
        "The natural shape for token streaming.",
        "Consumable once. Need it twice, materialise or regenerate.",
        "No length without consuming - pass the count separately for progress.",
        "Batching over a generator is the standard ingestion pattern."
      ],
      "say": "A generator yields items one at a time instead of building the whole list, so an ingestion pipeline holds one document rather than ten thousand and memory stays flat as the corpus grows. It is also the natural shape for token streaming. The trade-offs are that it can only be consumed once, so I materialise if I need the data twice, and I cannot take its length without consuming it.",
      "numbers": "No number applies - memory stays roughly constant instead of scaling with corpus size, which is the whole point.",
      "wrong": "\"Generators are more memory efficient.\" True and unexplained. The interviewer wants the ingestion pipeline consequence.",
      "follow": "You need to retry a failed batch. What does that do to your generator design?"
    },
    {
      "id": "py-03",
      "q": "How do you use Pydantic in an LLM pipeline?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "pydantic",
        "validation",
        "structured-output"
      ],
      "why": "Pydantic is named in a large share of these JDs, and its role here is specific.",
      "simple": "It does two jobs, and they are worth separating.\n\nFirst, it defines the schema you hand to the model. Most frameworks and providers can turn a Pydantic model into the JSON schema for structured output or a tool definition, so the model is constrained by the same class your code uses. One definition, no drift between what you asked for and what you parse.\n\nSecond, it validates what comes back. This is the part that matters even with constrained decoding, because valid JSON is not correct JSON. A field can hold a claim ID with the right shape that does not exist, or a date in the future. Pydantic validators are where you put those business rules; pass per-request facts such as the retrieved chunk ids in with `model_validate(data, context={...})`.\n\nThe practical points: keep models shallow where you can, because deeply nested schemas tend to raise failure rates, especially without strict constrained decoding. Use `Literal` or an enum rather than a free-text string wherever the values are known, since that constrains generation too. And write field descriptions, because they become part of the schema the model reads - they are prompt text, not documentation.",
      "code": "class ClaimDecision(BaseModel):\n    claim_id: str = Field(description=\"Claim reference as printed on the form, e.g. C-4471\")\n    decision: Literal[\"approve\", \"deny\", \"refer\"]\n    reason:   str = Field(max_length=300)\n    cited:    list[str] = Field(description=\"Chunk ids supporting this decision\")\n\n    @field_validator(\"cited\")\n    @classmethod\n    def cited_must_exist(cls, v, info):\n        # shape was guaranteed by the schema; existence never is\n        retrieved = (info.context or {}).get(\"retrieved_ids\", set())\n        unknown = set(v) - retrieved\n        if unknown: raise ValueError(f\"invented citations: {unknown}\")\n        return v",
      "points": [
        "One class defines both the schema sent to the model and the parser.",
        "Validate even with constrained decoding - valid JSON is not correct JSON.",
        "Business rules go in validators: does this id exist, is this date plausible.",
        "Keep models shallow. Deep nesting tends to raise failure rates.",
        "`Literal` and enums over free text - they constrain generation too.",
        "Field descriptions are prompt text the model reads, not documentation."
      ],
      "say": "Two jobs. It defines the schema handed to the model, so one class is both the tool definition and the parser and nothing drifts. And it validates what comes back, which matters even with constrained decoding, because valid JSON is not correct JSON - a well-shaped claim id can still be invented. Business rules go in validators. I keep models shallow and use Literal over free text, since that constrains generation too.",
      "numbers": "There is no universal limit, but two levels of nesting or fewer is a sensible default. Measure the failure rate on your own provider and schema before going deeper.",
      "wrong": "\"I use it to parse the JSON response.\" Half its value. It misses that the same class defines what you asked the model for.",
      "follow": "The schema validated and the claim id does not exist. Where does that get caught?"
    },
    {
      "id": "py-04",
      "q": "Write a retry wrapper for a model call. What does it need?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "reliability",
        "retries",
        "coding"
      ],
      "why": "A very common live-coding task, and most candidates miss two of the four requirements.",
      "simple": "A safe retry policy needs four things.\n\nFirst, retry only temporary failures: rate limits, timeouts, connection errors and selected 5xx responses. Authentication failures, malformed requests and policy refusals usually need a fix, not another identical call.\n\nSecond, back off between attempts and add jitter so many clients do not retry at exactly the same time. If the service returns a `Retry-After` value or the SDK exposes an equivalent hint, honour it instead of inventing a shorter delay.\n\nThird, cap both attempts and total elapsed time. An interactive request should not spend a minute retrying after the user has already left.\n\nFourth, make repeated work safe. If the call can create a side effect, use an idempotency key or deduplication record. Log retry reason, attempt and final outcome, because rising retry volume is an early incident signal. In production I normally use a tested retry library rather than reimplementing all of this.\n\nOne SDK trap: the official OpenAI and Anthropic Python clients already retry connection errors, timeouts, 429s and 5xx responses, twice by default (`max_retries`). Set `max_retries=0` on the client or count those retries, otherwise three outer attempts quietly become up to nine calls.",
      "code": "# openai / anthropic SDK exception names; APITimeoutError subclasses APIConnectionError\nRETRYABLE = (RateLimitError, APIConnectionError, InternalServerError)\n\ndef retry_after_seconds(e):\n    response = getattr(e, \"response\", None)\n    value = response.headers.get(\"retry-after\") if response is not None else None\n    try:\n        return float(value)\n    except (TypeError, ValueError):\n        return None        # absent, or an HTTP-date this sketch does not parse\n\nasync def call(prompt, attempts=3, deadline=20.0):\n    started = time.monotonic()\n    for i in range(attempts):\n        try:\n            return await llm.ainvoke(prompt)\n        except RETRYABLE as e:\n            elapsed = time.monotonic() - started\n            retry_after = retry_after_seconds(e)\n            fallback = min(2 ** i, 8) + random.uniform(0, 1)\n            wait = retry_after if retry_after is not None else fallback\n            if i == attempts - 1 or elapsed + wait > deadline:\n                raise\n            log.info(\"retrying attempt=%s wait=%.2fs\", i + 1, wait)\n            await asyncio.sleep(wait)\n        # permanent errors are not caught and fail immediately",
      "points": [
        "Retry temporary failures only.",
        "Use backoff plus jitter; honour server retry hints when available.",
        "Cap attempts and total elapsed time.",
        "Use idempotency or deduplication when a retry could repeat a side effect.",
        "Log retry rate and final outcome.",
        "Account for the SDK's built-in retries (`max_retries`) so you do not retry twice."
      ],
      "say": "I retry only temporary failures such as rate limits, timeouts and selected server errors. Between attempts I use backoff plus jitter, and I honour a server Retry-After hint when it is available. I cap both attempts and total elapsed time so an interactive request cannot hang forever. If the operation has a side effect, I add idempotency or deduplication. Every retry is logged, because a rising retry rate is an early incident signal.",
      "numbers": "Two or three attempts inside a bounded interactive deadline is a reasonable starting point, but the real values come from the service SLA, timeout budget and retry guidance.",
      "wrong": "Retrying every exception. It converts a permanent failure into a slow permanent failure, at three times the cost, with the real error buried.",
      "follow": "The provider is down for ten minutes. Does your wrapper help or hurt?"
    },
    {
      "id": "py-05",
      "q": "How do you test code that calls an LLM?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "testing",
        "mocking"
      ],
      "why": "It reveals whether your GenAI code is production code or notebook code.",
      "simple": "Isolate the non-deterministic part and test everything around it, which is most of the code.\n\nStructure for it first: the model call sits behind a small interface, so tests can substitute a fake that returns a fixed response. Now your prompt assembly, parsing, validation, error handling, routing and termination logic are all deterministic and test in milliseconds without an API key. This is the bulk of your test suite and the part most teams never write.\n\nThen test the failure paths explicitly, because they are where production breaks and they are trivial to test with a fake: malformed JSON, a truncated response, a rate-limit error, an empty retrieval result, a tool that raises.\n\nA small integration suite runs against a real model, asserting structure rather than wording - does it parse, are required fields present, is it in the right language. Never assert on exact text.\n\nAnd evaluation is separate from testing: a score you track, not a boolean that passes. Conflating the two gives you a flaky test suite people learn to ignore.",
      "points": [
        "Model call behind an interface so a fake can be substituted.",
        "Unit-test prompt assembly, parsing, validation, routing, termination - all deterministic.",
        "Explicitly test failure paths: malformed JSON, truncation, rate limits, empty retrieval.",
        "Integration tests assert structure, never exact wording.",
        "Evaluation is a tracked score, not a pass/fail test. Keep them separate.",
        "If every test needs an API key, the suite will not run in CI."
      ],
      "say": "I put the model call behind a small interface so tests can substitute a fake with a fixed response. Then prompt assembly, parsing, validation, routing and termination are all deterministic and test in milliseconds without an API key - that is the bulk of the suite. I explicitly test failure paths like malformed JSON and rate limits. Integration tests assert structure, never wording. And evaluation is a tracked score, not a test.",
      "numbers": "Keep the mocked suite fast enough to run on every commit - seconds, not minutes. If it needs an API key it will get skipped.",
      "wrong": "\"You cannot really test LLM code because it is non-deterministic.\" Only the model call is. Everything around it is ordinary software, and this answer says you did not try.",
      "follow": "Your fake returns valid JSON. What bug does that hide?"
    },
    {
      "id": "py-06",
      "q": "Live task: build a concurrent document ingestion pipeline.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "coding",
        "pipeline",
        "concurrency"
      ],
      "why": "A representative hands-on task. What is being marked is error handling and bounded concurrency, not the happy path.",
      "simple": "Before coding, I state the requirements: do not load the whole corpus into memory, do not let one bad document kill the run, keep concurrency bounded, and make reruns safe.\n\nI stream documents, generate chunks lazily, group chunks into embedding batches, and process only a small window of batches concurrently. That gives parallel I/O without creating thousands of tasks at once. Each batch handles its own error and records the failed item for retry. Upserts use stable ids, so rerunning the job updates the same chunks instead of duplicating them.\n\nA common mistake is putting a semaphore around a function but still awaiting every batch inside a normal `for` loop. That code looks concurrent but only runs one batch at a time. Another mistake is one giant `gather` over the corpus, which creates too many tasks and usually hits rate limits.\n\nFor a long-running production job, I also persist checkpoints or use a queue so it can resume after a restart.",
      "code": "async def ingest(paths, batch_size=100, concurrency=8):\n    sem = asyncio.Semaphore(concurrency)\n    failed = []\n\n    async def process(group):\n        async with sem:\n            try:\n                vectors = await embedder.aembed([c.text for c in group])\n                await store.upsert([\n                    (c.stable_id, v, c.metadata)\n                    for c, v in zip(group, vectors)\n                ])\n            except Exception:\n                log.exception(\"embedding batch failed\")\n                failed.extend(c.stable_id for c in group)\n\n    groups = batched(chunks(paths), batch_size)\n    # windowed: each window waits for its slowest batch. A fixed pool of\n    # workers pulling from a bounded queue (see py-27) keeps every slot busy.\n    for window in batched(groups, concurrency):\n        await asyncio.gather(*(process(group) for group in window))\n\n    return failed",
      "points": [
        "Stream input and batch chunks; do not materialise the corpus.",
        "Run several batches concurrently, but keep the window bounded.",
        "Catch and record per-batch failures without killing the whole run.",
        "Use stable ids so retries and reruns are idempotent.",
        "Persist progress or use a queue for long-running production ingestion."
      ],
      "say": "I stream documents, generate chunks lazily, batch them for the embedding API, and process only a bounded window of batches concurrently. The important coding detail is that I actually schedule several batch tasks together; a semaphore around a loop that awaits one batch at a time is still sequential. Each batch records failures separately, and vector upserts use stable ids so a retry or full rerun does not duplicate data. For long jobs I persist progress too.",
      "numbers": "Start with a small concurrency such as 4–8 embedding batches and tune from measured rate limits, latency and provider batch limits. The important property is bounded work, not the exact number.",
      "wrong": "An unbounded `asyncio.gather` over every document. It looks impressively concurrent and rate-limits on the first real corpus.",
      "follow": "The run died at 60%. What happens when you restart it?"
    },
    {
      "id": "py-07",
      "q": "Implement cosine similarity from scratch, then vectorise it.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "numpy",
        "embeddings",
        "coding"
      ],
      "why": "The single most-asked AI coding question in these loops. It checks whether you understand the maths behind retrieval or only call a library.",
      "simple": "Cosine similarity asks one question: do these two vectors point the same way? Not how long they are - only the direction. Two documents about the same topic point the same way even if one is a paragraph and one is a page.\n\nThe formula is the dot product divided by the product of the two lengths. Dividing by the lengths is what removes magnitude and leaves pure direction.\n\nThe two-vector version first, so the interviewer sees you know the formula:\n\n    import numpy as np\n\n    def cosine(a, b):\n        na, nb = np.linalg.norm(a), np.linalg.norm(b)\n        if na == 0 or nb == 0:\n            return 0.0                  # zero vector: no direction\n        return float(np.dot(a, b)) / (na * nb)\n\nNow the version that matters. In retrieval you compare one query against a million documents, and calling that function in a Python loop over a million rows is far too slow. Push it into one matrix operation:\n\n    def cosine_batch(q, M, eps=1e-12):\n        # q: (d,)   M: (n, d)  ->  (n,)\n        q = q / max(np.linalg.norm(q), eps)\n        M = M / np.maximum(np.linalg.norm(M, axis=1, keepdims=True), eps)\n        return M @ q\n\nThe senior move is the last step: if you normalise your vectors once at write time, every future query is a single dot product. Cosine similarity stops existing as a computation - it becomes a matrix multiply, which is exactly what a vector database does internally.",
      "points": [
        "Cosine measures direction only; magnitude is divided out.",
        "Write the loop version first, then vectorise - show both.",
        "keepdims=True on the row norms, or broadcasting fails - or, when n equals d, silently divides along the wrong axis.",
        "Normalise once at write time; then cosine equals a plain dot product.",
        "Guard the zero vector - a zero-length vector divides by zero."
      ],
      "say": "Cosine is the dot product over the product of the norms, so it measures direction and ignores magnitude. I would write the two-line version first, then vectorise it: normalise the query, normalise the matrix rows with keepdims, and take a single matrix-vector product. In production I normalise at write time, so retrieval is one dot product rather than recomputing norms per query.",
      "numbers": "A million 768-dimension vectors is about 3 GB in float32. On a laptop CPU the matrix-vector product over pre-normalised rows takes on the order of 100 ms, because it is limited by memory bandwidth. Calling the pair function in a Python loop takes tens of seconds, and pure-Python maths far longer.",
      "wrong": "Writing the loop and stopping there. The interviewer is waiting to see if you notice it will not survive a real index, and most candidates do not.",
      "follow": "Now the matrix does not fit in memory. What changes?"
    },
    {
      "id": "py-08",
      "q": "Implement top-k retrieval over a matrix of embeddings.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "numpy",
        "retrieval",
        "coding"
      ],
      "why": "Whether you know that sorting everything to take five results is the wrong complexity.",
      "simple": "You have similarity scores for a million documents and you want the best five. The obvious move is to sort and slice - and it is the wrong one.\n\nSorting is O(n log n) and it orders all million results when you asked for five. What you want is a partial selection, which is O(n):\n\n    def top_k(scores, k=5):\n        k = min(k, len(scores))\n        idx = np.argpartition(-scores, k - 1)[:k]   # O(n), unordered\n        return idx[np.argsort(-scores[idx])]        # order just the k\n\nThe idea behind argpartition is a rearrangement, not a sort. It shoves the k largest values into the front of the array without caring about their internal order. Then you sort only those k, which is trivially cheap.\n\nThe negation is there because NumPy partitions ascending, and we want the largest. And clamping k to the array length matters - a corpus smaller than k is a real case on a fresh index, and argpartition raises on it.",
      "points": [
        "argpartition is O(n); a full sort is O(n log n).",
        "Partition first, then sort only the k survivors.",
        "Negate the scores because NumPy works ascending.",
        "Clamp k to the array length - a small corpus otherwise raises.",
        "At real scale this is what the ANN index does for you."
      ],
      "say": "I would use argpartition rather than a sort. Partitioning is linear and puts the k best at the front without ordering the rest, then I sort just those k, which is negligible. I negate because NumPy partitions ascending, and I clamp k to the array length so a corpus smaller than k does not raise. Beyond a few million rows I stop doing this in NumPy and use an ANN index.",
      "numbers": "On a million scores, argpartition was about ten times faster than a full argsort in a quick NumPy check. Past a few million vectors, or once the exact scan misses your latency budget, move to an ANN index such as HNSW rather than tuning this.",
      "wrong": "np.argsort(scores)[-k:] with a comment saying it is fine. It works and it is the answer of someone who has not thought about the cost per query at a thousand queries a second.",
      "follow": "Where does this break down, and what would you replace it with?"
    },
    {
      "id": "py-09",
      "q": "Write a text chunker with configurable size and overlap.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "chunking",
        "rag",
        "coding"
      ],
      "why": "A small function where the off-by-one errors are the entire test.",
      "simple": "Chunking looks like three lines and is where most candidates introduce a bug live.\n\n    def chunk(text, size=1000, overlap=200):\n        if overlap >= size:\n            raise ValueError(\"overlap must be smaller than size\")\n        step = size - overlap\n        out = []\n        for start in range(0, len(text), step):\n            piece = text[start:start + size]\n            if piece:\n                out.append(piece)\n            if start + size >= len(text):\n                break\n        return out\n\nTwo traps, and interviewers watch for both.\n\nFirst: the step is size minus overlap, not size. Get that wrong and you either lose text between chunks or produce far more chunks than you expected.\n\nSecond, and this is the one that hangs: if overlap is greater than or equal to size, step becomes zero or negative. With a zero step you loop forever. Validate it at the top rather than discovering it in an ingestion job at 2 a.m.\n\nThe break at the end stops you emitting a run of tiny trailing fragments once the window has passed the end of the text.",
      "points": [
        "step = size - overlap. This is the whole function.",
        "Reject overlap >= size explicitly, or you get an infinite loop.",
        "Break once the window covers the end, to avoid trailing fragments.",
        "Character size is not token size - convert before trusting a limit.",
        "State that a real chunker splits on structure, not raw characters."
      ],
      "say": "The core is that the step is size minus overlap rather than size. I validate that overlap is smaller than size at the top, because otherwise the step is zero and the loop never terminates. I break once the window has covered the end so I do not emit trailing fragments. And I would say out loud that character chunking is a baseline - for real documents I split on structure and measure in tokens.",
      "numbers": "1000 characters with 200 overlap is a reasonable default, roughly 250 tokens. Overlap above about a quarter of the chunk size mostly buys duplicate storage.",
      "wrong": "range(0, len(text), size) with a slice of size plus overlap. It silently drops the overlap semantics and nobody notices until retrieval quality is bad.",
      "follow": "This splits a sentence in half. Fix it."
    },
    {
      "id": "py-10",
      "q": "Implement exponential backoff with jitter from scratch.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "reliability",
        "retry",
        "coding"
      ],
      "why": "Everyone says they use a retry library. This checks whether you know what it is doing and why jitter exists.",
      "simple": "Retrying immediately against a rate-limited API just spends your quota faster. So you wait, and you double the wait each time - one second, two, four, eight.\n\n    import random, time\n\n    def backoff(attempt, base=1.0, cap=60.0):\n        window = min(cap, base * (2 ** attempt))\n        return random.uniform(0, window)     # full jitter\n\n    def call_with_retry(fn, retries=5, deadline=30.0):\n        start = time.monotonic()\n        for attempt in range(retries):\n            try:\n                return fn()\n            except (RateLimited, ServerError) as e:   # 429 and 5xx only\n                wait = getattr(e, \"retry_after\", None) or backoff(attempt)\n                out_of_time = time.monotonic() - start + wait > deadline\n                if attempt == retries - 1 or out_of_time:\n                    raise\n                time.sleep(wait)\n            # anything else - 400, 401, validation errors - propagates at once\n\nNow the part candidates miss: the jitter. Picture a hundred workers all rate-limited at the same instant. Without jitter they all wait exactly two seconds, then all retry in the same millisecond, and you have rebuilt the stampede that caused the problem. Randomising the wait spreads them out.\n\nThe other two rules are about knowing what to retry. A 429 or a 503 is worth retrying; a 400 means your request is malformed and will be malformed forever. And if the server sent a Retry-After header, obey it - it knows more than your formula does.\n\nFor the rest of the retry policy - idempotency, logging and the SDK's own built-in retries - see py-04; this card is about the wait calculation.",
      "points": [
        "Double the wait each attempt, with a ceiling.",
        "Full jitter randomises the wait so retries do not synchronise.",
        "Retry 429 and 5xx; never retry 400 or 401.",
        "Honour Retry-After when the provider sends it.",
        "Cap total elapsed time, not just the attempt count."
      ],
      "say": "Exponential backoff doubles the wait each attempt with a ceiling, and jitter randomises it so that a hundred clients rate-limited at once do not all retry in the same millisecond and rebuild the stampede. I only retry 429 and 5xx - a 400 is malformed and will stay malformed. I honour Retry-After when the provider sends it, and I bound total elapsed time so a request cannot hang for minutes.",
      "numbers": "Base 1 second, cap 60, five attempts. Bound the total to roughly 30 seconds for an interactive request - the `deadline` check in the code - because a user will not wait longer than that.",
      "wrong": "Backoff without jitter. It looks correct in a single-client test and causes synchronised retry storms the moment you run more than one worker.",
      "follow": "Your retries now exceed the user's timeout. What gives?"
    },
    {
      "id": "py-11",
      "q": "Parse JSON from a model response that wraps it in markdown fences.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "parsing",
        "structured-output",
        "coding"
      ],
      "why": "One of the most common real-world parsing bugs in LLM applications, and a good test of defensive thinking.",
      "simple": "You asked for JSON. The model returned this:\n\n    Sure! Here is the JSON you asked for:\n    ```json\n    {\"name\": \"Priya\", \"score\": 8}\n    ```\n\njson.loads throws on that. So you need a parser that tolerates what models actually emit:\n\n    import json, re\n\n    FENCE = re.compile(r\"```(?:json)?\\s*(.*?)```\", re.DOTALL)\n\n    def parse_json(text):\n        try:\n            return json.loads(text)          # the happy path, try it first\n        except json.JSONDecodeError:\n            pass\n        m = FENCE.search(text)\n        if m:\n            return json.loads(m.group(1).strip())\n        start = text.find(\"{\")\n        end = text.rfind(\"}\")\n        if start != -1 and end > start:\n            return json.loads(text[start:end + 1])\n        raise ValueError(f\"no JSON found in: {text[:200]}\")\n\nThree layers, cheapest first: try it clean, then strip the fence, then grab the outermost braces. DOTALL matters because the JSON spans lines. And rfind rather than find for the closing brace, so nested objects survive.\n\nThe senior point is that this is a fallback, not a strategy. If you are parsing like this in production, you should be using structured output or constrained decoding so the model cannot emit prose in the first place. But you still keep the parser, because providers change behaviour and a raised exception at 3 a.m. is worse than a regex.",
      "points": [
        "Try json.loads first - usually it just works.",
        "re.DOTALL, because the JSON spans multiple lines.",
        "rfind for the closing brace so nested objects are not truncated.",
        "Include the raw text in the error; debugging without it is guesswork.",
        "Say this is a fallback - structured output is the real fix."
      ],
      "say": "I layer it cheapest first: try json.loads directly, then strip a markdown fence with a DOTALL regex, then fall back to the outermost braces using find and rfind so nested objects survive. I put the raw text in the exception because otherwise you cannot debug it. And I would say this is a safety net - the real fix is structured output or constrained decoding so the model cannot wrap it in prose at all.",
      "numbers": "Without structured output, fence-wrapping can show up in a small share of responses even with an explicit instruction not to. At a million calls a month, even 1% is ten thousand failures.",
      "wrong": "json.loads(response) with no try/except. It passes the demo; the first fenced or prose-wrapped response in production raises an unhandled exception, and the follow-up asks what the user sees then.",
      "follow": "It parses now but a required field is missing. Where does that get caught?"
    },
    {
      "id": "py-12",
      "q": "Write a decorator that logs latency and token usage for any LLM call.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "decorators",
        "observability",
        "coding"
      ],
      "why": "Two things in one card: whether you can write a real decorator, and whether you know what is worth measuring.",
      "simple": "A decorator wraps a function so you can run code before and after it without touching the function body. For LLM calls that is exactly what you want - every call should be measured, and you do not want that arithmetic pasted into forty call sites.\n\n    import functools, time, logging\n\n    log = logging.getLogger(__name__)\n\n    def observed(fn):\n        @functools.wraps(fn)               # keeps __name__ and the docstring\n        def wrapper(*args, **kwargs):\n            start = time.perf_counter()\n            status, usage = \"ok\", None\n            try:\n                result = fn(*args, **kwargs)\n                usage = getattr(result, \"usage\", None)   # token counts\n                return result\n            except Exception:\n                status = \"error\"\n                raise                     # measure it, do not swallow it\n            finally:\n                log.info(\"llm_call\", extra={\n                    \"fn\": fn.__name__,\n                    \"ms\": round((time.perf_counter() - start) * 1000),\n                    \"status\": status,\n                    \"input_tokens\": getattr(usage, \"input_tokens\", None),\n                    \"output_tokens\": getattr(usage, \"output_tokens\", None),\n                })\n        return wrapper\n\nThree details that separate a real answer from a textbook one.\n\nfunctools.wraps preserves the wrapped function's name and docstring - without it every function in your traces is called wrapper, which makes the logs useless.\n\nperf_counter, not time.time, because it is monotonic and will not jump when the clock syncs.\n\nThe finally block means failed calls are measured too. Errors are the calls you most want latency on, and a naive version only logs the successes. And re-raise inside the except - an observability decorator that swallows exceptions is a bug factory.\n\nToken counts come off the SDK response object, and the field names differ: `input_tokens`/`output_tokens` on Anthropic and the OpenAI Responses API, `prompt_tokens`/`completion_tokens` on Chat Completions. Map them to one log schema.",
      "points": [
        "functools.wraps, or every traced function is named wrapper.",
        "perf_counter is monotonic; time.time can jump backwards.",
        "Log in finally so failures are measured too.",
        "Re-raise - never let instrumentation swallow an exception.",
        "For async, you need a parallel async def wrapper with await."
      ],
      "say": "I wrap with functools.wraps so the traced name survives, time with perf_counter because it is monotonic, and log inside a finally block so failed calls are measured too - errors are exactly the calls you want latency on. I re-raise rather than swallowing. I would pull token counts off the response object and log them alongside, so cost attribution is per-feature rather than one bill at month end.",
      "numbers": "Structured logs, not f-strings - you cannot aggregate on a string. Tag with feature and tenant at call time; you cannot reconstruct attribution later.",
      "wrong": "Timing with time.time and logging only on success. You lose the failure latencies, which is where your p99 actually lives.",
      "follow": "The function is async. What changes?"
    },
    {
      "id": "py-13",
      "q": "Implement a rate limiter - token bucket or sliding window.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "concurrency",
        "reliability",
        "coding"
      ],
      "why": "A common systems-flavoured coding question, and the follow-up on thread safety is the real test.",
      "simple": "You are allowed sixty requests a minute. You need to not exceed that.\n\nThe token bucket is the standard mental model. A bucket holds tokens. Each request takes one. Tokens refill at a steady rate. When the bucket is empty, you wait. What makes it good is that it allows a short burst - the bucket can be full when traffic arrives - while holding the long-run average to the limit.\n\n    import time, threading\n\n    class TokenBucket:\n        def __init__(self, rate, capacity):\n            self.rate = rate               # tokens per second\n            self.capacity = capacity\n            self.tokens = float(capacity)\n            self.updated = time.monotonic()\n            self.lock = threading.Lock()\n\n        def acquire(self, n=1):\n            if n > self.capacity:          # could never be satisfied\n                raise ValueError(\"n exceeds bucket capacity\")\n            while True:\n                with self.lock:\n                    now = time.monotonic()\n                    self.tokens = min(\n                        self.capacity,\n                        self.tokens + (now - self.updated) * self.rate)\n                    self.updated = now\n                    if self.tokens >= n:\n                        self.tokens -= n\n                        return\n                    deficit = (n - self.tokens) / self.rate\n                time.sleep(deficit)        # sleep OUTSIDE the lock\n\nThe line that matters is the last one. Sleeping while holding the lock blocks every other thread for the full wait and serialises your whole application. Compute the wait inside the lock, release it, then sleep.\n\nNote also that tokens refill by elapsed time rather than on a timer thread - no background thread to manage, and it is correct even if nobody called for an hour.",
      "points": [
        "Token bucket permits bursts; sliding window is stricter and smoother.",
        "Refill lazily from elapsed time - no timer thread needed.",
        "monotonic, so an NTP correction cannot break the maths.",
        "Never sleep while holding the lock.",
        "For multiple processes this must move to Redis, not a local object."
      ],
      "say": "I would use a token bucket: tokens refill lazily from elapsed monotonic time, each request takes one, and an empty bucket waits. It allows a controlled burst while holding the average. The critical detail is computing the wait inside the lock but sleeping outside it - sleeping while holding the lock serialises every caller. Across processes this has to live in Redis, since a local bucket only limits one worker.",
      "numbers": "Set capacity to roughly the burst you want to tolerate and rate to the sustained limit. Run at about 80% of the provider's stated limit to leave headroom for retries.",
      "wrong": "A local in-memory limiter on a service running four replicas. Each replica limits itself to the full quota, so you exceed it by four times and cannot work out why.",
      "follow": "You now run eight pods. What breaks?"
    },
    {
      "id": "py-14",
      "q": "Implement a function that batches API calls with a concurrency limit.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "async",
        "concurrency",
        "coding"
      ],
      "why": "The most realistic async task for this role, and the semaphore is the point.",
      "simple": "You have ten thousand documents to embed. Firing ten thousand concurrent requests will rate-limit you instantly and probably exhaust your file descriptors. Doing them one at a time takes hours. You want a fixed number in flight.\n\n    import asyncio\n\n    async def map_bounded(items, fn, limit=8):\n        sem = asyncio.Semaphore(limit)\n\n        async def run(item):\n            async with sem:                       # at most `limit` inside\n                return await fn(item)\n\n        return await asyncio.gather(\n            *(run(i) for i in items),\n            return_exceptions=True)               # one failure must not kill the run\n\nThe semaphore is a counter with a queue. Eight coroutines get in; the ninth waits at the async with until one leaves. All ten thousand tasks are created immediately, but only eight are ever executing.\n\nreturn_exceptions=True is the detail that matters in production. Without it, the first exception propagates out of gather and you lose every result, while the other tasks keep running in the background, because gather does not cancel them. (`asyncio.TaskGroup`, Python 3.11+, does cancel the rest on the first failure - right for all-or-nothing work, wrong here.) With it, failures come back as exception objects in the results list and you decide what to do:\n\n    results = await map_bounded(docs, embed)\n    ok = [r for r in results if not isinstance(r, Exception)]\n    failed = [d for d, r in zip(docs, results) if isinstance(r, Exception)]\n\nResults stay in input order, which is what lets that zip work.",
      "points": [
        "Semaphore bounds what is in flight, not what is created.",
        "return_exceptions=True, or one failure discards every result.",
        "gather preserves input order - safe to zip back to the inputs.",
        "For very large inputs, stream in batches rather than creating millions of tasks.",
        "Combine with retry so a transient 429 is not counted as a failure."
      ],
      "say": "I bound concurrency with an asyncio.Semaphore - every task acquires it before the call, so only N are in flight regardless of how many exist. I pass return_exceptions=True so a single failure does not throw away the whole gather, then split the results into successes and a dead-letter list by index, since gather preserves order. For very large inputs I would chunk rather than create millions of task objects at once.",
      "numbers": "Concurrency of 8 to 16 is a sane starting point for a hosted embedding API. Tune against the provider's requests-per-minute rather than raising it until it breaks.",
      "wrong": "asyncio.gather over the entire list with no semaphore. It is the answer that looks most confident and fails on the first real corpus.",
      "follow": "Half the batch failed with 429s. What now?"
    },
    {
      "id": "py-15",
      "q": "Parse streaming SSE output from an LLM API.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "streaming",
        "parsing",
        "coding"
      ],
      "why": "Practical and discriminating - the partial-chunk problem catches most candidates.",
      "simple": "Streaming responses arrive as server-sent events: lines beginning with data:, one JSON object each, terminated by data: [DONE] in the OpenAI-style format.\n\nThe trap is that TCP does not respect your line boundaries. A chunk off the socket can end mid-line, so you cannot parse chunk by chunk. You need a buffer:\n\n    import codecs, json\n\n    async def stream(response):\n        decoder = codecs.getincrementaldecoder(\"utf-8\")()\n        buffer = \"\"\n        async for raw in response.aiter_bytes():\n            buffer += decoder.decode(raw)     # holds back a split character\n            while \"\\n\" in buffer:\n                line, buffer = buffer.split(\"\\n\", 1)\n                line = line.strip()\n                if not line.startswith(\"data:\"):\n                    continue\n                payload = line[5:].strip()\n                if payload == \"[DONE]\":\n                    return\n                try:\n                    event = json.loads(payload)\n                except json.JSONDecodeError:\n                    continue              # malformed line: skip, do not crash\n                choices = event.get(\"choices\") or []\n                if not choices:           # e.g. the final usage-only chunk\n                    continue\n                text = choices[0].get(\"delta\", {}).get(\"content\")\n                if text:\n                    yield text\n\nAccumulate into the buffer, and only consume complete lines - everything after the last newline stays buffered for the next chunk. That single pattern is the whole answer.\n\nThree more real-world details. Use .get(\"content\") rather than indexing, because the first delta can carry a role with no content. Skip events whose choices list is empty - with usage reporting switched on, the final chunk carries only usage, and choices[0] would raise. And use an incremental UTF-8 decoder: a multi-byte character (Hindi text, an emoji) can be split across two socket reads, and decoding each chunk separately corrupts it, even with errors=\"replace\".\n\nOther APIs, such as Anthropic's Messages stream, send named event: lines with different payloads. In production the provider SDK's stream iterator does this parsing for you; the exercise is about knowing what it handles.",
      "points": [
        "Buffer across chunks - socket reads do not align to lines.",
        "Only consume up to the last complete newline.",
        "Handle [DONE] as termination, not as JSON.",
        "Use .get for content - the first delta has none.",
        "With usage reporting on, the final chunk has usage and empty choices - handle it and record the usage.",
        "Decode UTF-8 incrementally - a character can straddle two reads."
      ],
      "say": "The key point is that socket chunks do not align to line boundaries, so I accumulate into a buffer and only parse complete lines, leaving the remainder for the next read. I treat [DONE] as termination rather than JSON, skip lines that are not data, and use .get for content because the first delta only carries a role. I also capture the usage block on the final chunk for cost tracking.",
      "numbers": "TTFT is what the user perceives - typically a few hundred milliseconds against several seconds for the full response. That gap is the entire reason to stream.",
      "wrong": "json.loads on each chunk as it arrives. It works locally where responses come in one piece and fails under real network conditions.",
      "follow": "The connection drops at 80%. What does the user see?"
    },
    {
      "id": "py-16",
      "q": "Implement a sliding-window conversation trimmer that respects a token budget.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "context",
        "tokens",
        "coding"
      ],
      "why": "Applies the context-window topic to code, and the system-message detail is the tell.",
      "simple": "A conversation grows until it exceeds the context window. You need to drop old turns while keeping the request valid.\n\n    def trim(messages, budget, count):\n        system = [m for m in messages if m[\"role\"] == \"system\"]\n        rest = [m for m in messages if m[\"role\"] != \"system\"]\n\n        used = sum(count(m) for m in system)\n        kept = []\n        for m in reversed(rest):              # newest first\n            c = count(m)\n            if used + c > budget:\n                break\n            kept.append(m)\n            used += c\n        kept.reverse()\n\n        while kept and kept[0][\"role\"] != \"user\":\n            kept.pop(0)                       # no orphaned reply or tool result\n        return system + kept\n\nThree things are being tested here.\n\nThe system message is pinned. Trim it away and the model forgets its instructions - this is the single most common bug in home-grown memory code, and it presents as 'the model stopped following the system prompt after twenty turns'.\n\nYou walk backwards from the newest message, because recency is what matters in a conversation.\n\nAnd you drop a leading assistant turn. A history that opens with an assistant reply to a user message you removed is incoherent, and some APIs reject it outright. The same goes for a tool result whose tool call was trimmed away. Pairs should stay together.\n\nThe budget is not the context window - it is the window minus the space you are reserving for the answer.",
      "points": [
        "Pin the system message; never let it be trimmed.",
        "Walk from newest to oldest - recency wins.",
        "Do not leave a dangling assistant turn or tool result at the front.",
        "Budget = context window − reserved output − a safety margin.",
        "Count with the real tokeniser, not len(text) // 4."
      ],
      "say": "I separate the system message and pin it, then walk the remaining turns newest-first, accumulating until I would exceed the budget. I reverse back into order and drop a leading assistant turn so the history does not start mid-pair. The budget is the window minus reserved output space, not the whole window, and I count with the provider's tokeniser rather than estimating from characters.",
      "numbers": "Reserve 1–2k tokens for the answer. Summarise rather than drop once you are discarding turns that carry decisions the user still refers to.",
      "wrong": "Keeping the last N messages by count. A single pasted document blows the budget and the request fails regardless of N.",
      "follow": "The user refers to something from turn three, which you dropped. Now what?"
    },
    {
      "id": "py-17",
      "q": "Implement reciprocal rank fusion to merge two ranked lists.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "retrieval",
        "hybrid-search",
        "coding"
      ],
      "why": "Short, elegant, and it proves you understand why hybrid search needs a merge step at all.",
      "simple": "Hybrid search gives you two ranked lists - one from vector search, one from BM25. You have to merge them, and you cannot compare their scores directly: cosine similarity lives on one scale, BM25 on a completely different one. Normalising them is fiddly and unstable.\n\nReciprocal rank fusion sidesteps the problem entirely by throwing the scores away and using only the positions:\n\n    from collections import defaultdict\n\n    def rrf(*lists, k=60):\n        scores = defaultdict(float)\n        for ranked in lists:\n            for rank, doc_id in enumerate(ranked, start=1):\n                scores[doc_id] += 1.0 / (k + rank)\n        return sorted(scores, key=scores.get, reverse=True)\n\nA document scores 1/(k+rank) in each list it appears in, and the contributions add up. So a document ranked third in both lists beats one ranked first in a single list - which is exactly the behaviour you want, because agreement across two different retrieval methods is strong evidence.\n\nThe k constant, conventionally 60, flattens the curve near the top. Without it, rank 1 would dominate rank 2 so heavily that the second list barely mattered. It makes the fusion tolerant of one retriever being confidently wrong.\n\nThat is the whole algorithm. Five lines, no normalisation and little tuning beyond k. It is a common default in hybrid search engines, though some engines default to normalised score fusion instead.",
      "points": [
        "Uses rank only - no score normalisation needed.",
        "Documents found by both retrievers rise to the top.",
        "k around 60 damps the top-rank dominance.",
        "Extends to any number of lists, including a reranker.",
        "Weight lists by multiplying their contribution if one is more trusted."
      ],
      "say": "RRF merges ranked lists using positions rather than scores, which avoids normalising cosine against BM25 - different scales that do not compare cleanly. Each document gets one over k plus rank from every list it appears in, summed, so agreement across retrievers wins over a single confident hit. k around sixty flattens the top so one retriever cannot dominate. It is five lines and needs almost no tuning, which is why it is a common production default.",
      "numbers": "k=60 is the standard from the original paper and works well unchanged. Hybrid with RRF often beats either retriever alone on mixed keyword-and-semantic queries - confirm it on your own labelled set.",
      "wrong": "Adding raw cosine and BM25 scores together. They live on different scales, so one retriever silently dominates. Score fusion needs normalisation first, and even min-max is sensitive to outliers and candidate-set size - which is what the follow-up probes.",
      "follow": "You trust the vector results more than BM25. How do you express that?"
    },
    {
      "id": "py-18",
      "q": "Mock an LLM API in pytest and test the retry path.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "testing",
        "pytest",
        "coding"
      ],
      "why": "Whether you can test code whose dependency is slow, costly and non-deterministic.",
      "simple": "You cannot call a real model in unit tests. It costs money, it is slow, and it returns something different each run - so your assertions cannot be exact.\n\nThe fix is to test your code, not the model. Your retry logic, your parsing, your fallbacks are all fully deterministic once the API is mocked. The tests below assume a `summarise(client, text)` built on the py-10 retry loop.\n\n    import pytest\n    from unittest.mock import Mock, patch\n\n    def test_retries_then_succeeds():\n        client = Mock()\n        client.complete.side_effect = [\n            RateLimited(\"429\"),\n            RateLimited(\"429\"),\n            Mock(text='{\"ok\": true}'),\n        ]\n        with patch(\"time.sleep\"):              # do not actually wait\n            result = summarise(client, \"hello\")\n        assert result == {\"ok\": True}\n        assert client.complete.call_count == 3\n\n    def test_does_not_retry_bad_request():\n        client = Mock()\n        client.complete.side_effect = BadRequest(\"400\")\n        with pytest.raises(BadRequest):\n            summarise(client, \"hello\")\n        assert client.complete.call_count == 1\n\nside_effect with a list is the key tool: each call takes the next entry, so you can script a failure sequence precisely.\n\nPatching time.sleep keeps the suite fast - otherwise your backoff test genuinely waits out the jittered delays. Patch the name where your code looks it up: `patch(\"time.sleep\")` works when the retry code calls `time.sleep`, but after `from time import sleep` you must patch `yourmodule.sleep`.\n\nAnd the second test is the one candidates forget. Asserting that you do not retry a 400 is as important as asserting that you do retry a 429, because a retry loop on a malformed request burns quota for nothing.",
      "points": [
        "side_effect with a list scripts an exact failure sequence.",
        "Patch sleep, or your suite waits out the real backoff.",
        "Assert call_count - it is how you prove retry behaviour.",
        "Test the negative case: 400 must not be retried.",
        "Keep a small live smoke test outside CI for real behaviour."
      ],
      "say": "I mock the client and use side_effect with a list to script the exact sequence - two rate limits then a success - and assert both the result and the call count, which is what proves the retry ran. I patch sleep so the suite does not wait out the backoff. I always add the negative test that a 400 is not retried, since a retry loop on a malformed request just burns quota. Real model behaviour belongs in evals, not unit tests.",
      "numbers": "Unit tests should run in seconds. Anything model-dependent goes in the eval suite, which runs on a schedule rather than on every commit.",
      "wrong": "Calling the real API in CI and asserting on the text. It is slow, it costs money, and it fails randomly, so the team learns to ignore red builds.",
      "follow": "How do you test that the prompt itself is any good?"
    },
    {
      "id": "py-19",
      "q": "Explain the GIL and when multiprocessing beats threading for AI workloads.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "concurrency",
        "gil"
      ],
      "why": "Frequently asked, and the correct answer for this role is counter-intuitive to people who half-remember it.",
      "simple": "The GIL answer now needs a version caveat. In a normal CPython build, the Global Interpreter Lock means only one thread executes Python bytecode at a time, so adding threads does not usually speed up pure Python CPU work. Threads are still very useful for blocking I/O because the lock is released while waiting in many libraries.\n\nPython also has optional free-threaded builds, introduced experimentally in 3.13 and officially supported (still optional, not the default) from 3.14, where Python threads can run bytecode on multiple cores. That changes what is possible, but some extension modules may not yet be fully compatible or may cause the GIL to be enabled again.\n\nSo I choose based on the deployed runtime, not a slogan. For network-heavy AI services I usually use async and threads for blocking I/O. For portable CPU-heavy parallelism, processes or a separate worker service are still a predictable choice. For native numerical libraries such as NumPy or PyTorch, I profile first because much of the heavy work happens outside Python bytecode anyway.",
      "points": [
        "Standard CPython still has a GIL; pure Python CPU threads do not normally scale across cores.",
        "Threads remain useful for blocking I/O.",
        "Optional free-threaded CPython builds can run Python threads in parallel.",
        "Extension compatibility still matters, so verify the production runtime.",
        "For CPU-heavy work, profile native libraries and use processes/workers when portability matters."
      ],
      "say": "The GIL answer now depends on the Python build. Standard CPython still lets only one thread execute Python bytecode at a time, so threads mainly help blocking I/O. Optional free-threaded builds can run Python threads across cores, but extension compatibility still matters and some modules can change that behaviour. So I choose based on the runtime we deploy: async or threads for I/O, and processes or worker services when I need predictable CPU parallelism.",
      "numbers": "Do not quote a universal concurrency count. Measure event-loop lag, memory, connection-pool limits and provider rate limits, then set a bounded concurrency limit for the deployed service.",
      "wrong": "Saying 'Python threads can never use multiple cores' without mentioning free-threaded builds, or saying the GIL is simply gone for everyone. Both are now too absolute.",
      "follow": "Your ingestion job is CPU-bound on PDF parsing and I/O-bound on embedding. How do you structure it?"
    },
    {
      "id": "py-20",
      "q": "Write a FastAPI endpoint that streams an LLM response.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "fastapi",
        "streaming",
        "coding"
      ],
      "why": "The most realistic take-home task in this market - it is the actual shape of the job.",
      "simple": "For current FastAPI (0.135 and later), I prefer its native Server-Sent Events support instead of manually formatting `data:` lines with a generic streaming response. SSE is a good fit for one-way token and progress events from server to browser.\n\n    import asyncio\n    from collections.abc import AsyncIterable\n    from fastapi import FastAPI\n    from fastapi.sse import EventSourceResponse, ServerSentEvent\n\n    app = FastAPI()\n\n    @app.post(\"/chat\", response_class=EventSourceResponse)\n    async def chat(req: ChatRequest) -> AsyncIterable[ServerSentEvent]:\n        try:\n            async for chunk in llm.astream(req.message):\n                yield ServerSentEvent(\n                    event=\"token\",\n                    data={\"text\": chunk.content},\n                )\n            yield ServerSentEvent(event=\"done\", raw_data=\"[DONE]\")\n        except asyncio.CancelledError:\n            # client disconnected: release/cancel upstream work if needed\n            raise\n\nWith `response_class=EventSourceResponse`, FastAPI handles event framing, keep-alive pings and standard streaming headers. `ServerSentEvent.data` is JSON-encoded for me, and `raw_data` is available for a sentinel such as `[DONE]`. I still need cancellation cleanup, bounded upstream work and useful event types.\n\nErrors after streaming starts cannot be turned into a normal JSON 500 response, so I either emit a typed error event the client understands or terminate the stream and let the client retry. Output safety is also harder once tokens have been sent, so high-risk applications may buffer or moderate small chunks before releasing them.",
      "points": [
        "Use FastAPI's native `EventSourceResponse` and `ServerSentEvent` for SSE.",
        "Yield typed token/progress/done events directly from the path operation.",
        "Let `ServerSentEvent.data` handle JSON serialization; use `raw_data` only for preformatted payloads.",
        "Handle cancellation so a disconnected client stops upstream work where possible.",
        "Mid-stream failures need an in-band error event or a closed stream.",
        "Streaming and output moderation require an explicit design trade-off."
      ],
      "say": "For current FastAPI I set EventSourceResponse as the response class and yield ServerSentEvent objects directly from the async endpoint. FastAPI handles SSE framing and JSON-encodes the data field, while I use typed token, progress and done events. I still handle cancellation so a disconnect stops upstream work. After bytes are sent, failures need an in-band error event or a closed stream, and output moderation needs an explicit streaming strategy.",
      "numbers": "Measure time to first event and total completion separately. Do not quote a universal target; the acceptable budget depends on whether the endpoint is interactive chat, voice, or a background workflow.",
      "wrong": "Awaiting the whole model response and returning JSON, or manually reimplementing SSE framing when the FastAPI version in use already provides a native SSE response.",
      "follow": "How do you run an output guardrail on a response you are already streaming?"
    },
    {
      "id": "py-21",
      "q": "Debug this code - it deadlocks under concurrency.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "async",
        "debugging",
        "coding"
      ],
      "why": "A debugging round, not a writing round. Reading broken concurrent code is a different and rarer skill.",
      "simple": "Here is the code. It works in tests and hangs in production:\n\n    class Cache:\n        def __init__(self):\n            self.lock = asyncio.Lock()\n            self.data = {}\n\n        async def get_or_fetch(self, key):\n            async with self.lock:\n                if key in self.data:\n                    return self.data[key]\n                value = await self.fetch(key)      # slow API call\n                self.data[key] = value\n                return value\n\n        async def fetch(self, key):\n            async with self.lock:                  # <-- same lock again\n                return await call_api(key)\n\nThe bug is that asyncio.Lock is not reentrant. get_or_fetch holds the lock, then calls fetch, which tries to acquire the same lock. It waits for a lock held by its own caller, which is waiting for it. Nothing moves, forever.\n\nWhy it passes tests: with a single warm-cache request you return before reaching fetch. The deadlock needs a cache miss to appear.\n\nThere is a second, quieter bug even after you fix that. Holding the lock across an await on a slow API serialises every caller - a hundred concurrent requests for a hundred different keys queue behind one another. The lock should protect the dictionary, not the network call:\n\n    async def get_or_fetch(self, key):\n        async with self.lock:\n            if key in self.data:\n                return self.data[key]\n        value = await self.fetch(key)          # no lock held here\n        async with self.lock:\n            return self.data.setdefault(key, value)\n\nsetdefault handles the race where two callers miss simultaneously - both fetch, one wins, both return the same object.",
      "points": [
        "asyncio.Lock is not reentrant - re-acquiring self-deadlocks.",
        "It only appears on a cache miss, so tests pass.",
        "Never hold a lock across a slow await.",
        "Lock the data structure, not the network call.",
        "setdefault resolves the duplicate-fetch race cleanly."
      ],
      "say": "The deadlock is that asyncio.Lock is not reentrant - get_or_fetch holds it and fetch tries to take it again, so it waits on itself. It only shows on a cache miss, which is why tests pass. The deeper problem is holding a lock across a slow await, which serialises every caller. I would lock only the dictionary reads and writes, fetch outside the lock, and use setdefault to settle the duplicate-fetch race.",
      "numbers": "This class of bug typically appears at the first real concurrency, not in staging. Timeouts on lock acquisition turn a permanent hang into a visible error.",
      "wrong": "Reaching for a reentrant lock. asyncio has none, and a threading.RLock is owned by the event-loop thread, so it gives no mutual exclusion between coroutines. Even a working reentrant lock would leave the serialisation, which the throughput follow-up exposes.",
      "follow": "Two requests miss the cache for the same key at once. What happens in your version?"
    },
    {
      "id": "py-22",
      "q": "This retrieval function is O(n) per query. Make it faster.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "optimisation",
        "retrieval",
        "coding"
      ],
      "why": "An optimisation round with a stated target. The best answer questions the premise before micro-tuning.",
      "simple": "The starting point:\n\n    def search(query_vec, docs, k=5):\n        scored = []\n        for doc in docs:                        # docs: 2 million\n            s = cosine(query_vec, doc.vector)\n            scored.append((s, doc))\n        scored.sort(reverse=True)\n        return scored[:k]\n\n(It also crashes on a score tie: sort falls back to comparing two doc objects. `key=lambda t: t[0]` fixes that.)\n\nWork through it in order of payoff rather than jumping to the clever answer.\n\nFirst, vectorise. The Python loop is the dominant cost. Stack the vectors into one matrix, normalise at write time, and the scoring becomes a single matrix-vector product - commonly a hundred times faster with no change in results.\n\nSecond, stop sorting. You want five results, not two million ordered ones. argpartition is linear.\n\nThird - and this is the real answer - it is still O(n) per query. Every query touches every vector. Vectorising made the constant small; it did not change the complexity. To beat O(n) you need an index that does not look at everything: HNSW gives you roughly logarithmic search for a small, tunable recall loss.\n\n    import hnswlib\n    index = hnswlib.Index(space=\"cosine\", dim=768)\n    index.init_index(max_elements=2_000_000, ef_construction=200, M=16)\n    index.add_items(vectors, ids)\n    index.set_ef(64)                            # recall/latency knob\n    labels, distances = index.knn_query(query_vec, k=5)\n\nState the trade honestly: approximate search can miss a true neighbour. You tune ef against a recall measurement rather than guessing, and you say so - that is the difference between an engineer and someone who has read a benchmark.",
      "points": [
        "Vectorise first - the biggest win for the least risk.",
        "argpartition instead of a full sort.",
        "Both are constant-factor wins; complexity is unchanged.",
        "An ANN index is what actually beats O(n).",
        "Approximate means recall loss - quantify it, do not hide it."
      ],
      "say": "I would take it in stages. Vectorise the loop into one matrix product and normalise at write time - that alone is roughly a hundred times faster. Replace the sort with argpartition. But both are constant-factor wins and it is still linear per query, so the real fix is an ANN index like HNSW for roughly logarithmic search. That costs exact recall, so I would tune ef against a measured recall target rather than guessing.",
      "numbers": "Two million 768-dimension vectors is about 6 GB in float32. HNSW typically holds 95%+ recall at a fraction of the latency; ef is the knob that trades one for the other.",
      "wrong": "Jumping straight to 'use a vector database' without the arithmetic. It is often right, but stated without cost or recall it sounds like a memorised answer rather than a decision.",
      "follow": "Recall dropped to 85% and the product team noticed. What do you change?"
    },
    {
      "id": "py-23",
      "q": "Write a Pydantic model with a custom validator for an LLM output schema.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "pydantic",
        "validation",
        "coding"
      ],
      "why": "Structured output is only as good as the validation behind it, and the semantic checks are where candidates stop early.",
      "simple": "Schema validity is not correctness. A model can return perfectly-formed JSON with a confidence of 3.7 and a citation that points at a document you never retrieved.\n\n    from typing import Literal\n    from pydantic import BaseModel, Field, field_validator, model_validator\n\n    class Answer(BaseModel):\n        text: str = Field(min_length=1)\n        confidence: float = Field(ge=0.0, le=1.0)\n        citations: list[str] = Field(default_factory=list)\n        sentiment: Literal[\"positive\", \"neutral\", \"negative\"]\n\n        @field_validator(\"citations\")\n        @classmethod\n        def known_docs(cls, v, info):\n            allowed = (info.context or {}).get(\"retrieved_ids\", set())\n            unknown = [c for c in v if c not in allowed]\n            if unknown:\n                raise ValueError(f\"cited documents not retrieved: {unknown}\")\n            return v\n\n        @model_validator(mode=\"after\")\n        def confident_answers_cite(self):\n            if self.confidence > 0.8 and not self.citations:\n                raise ValueError(\"high confidence requires a citation\")\n            return self\n\nField constraints handle the cheap structural checks - ranges, lengths, enums via Literal.\n\nfield_validator adds semantic checks on one field. The citation check is the valuable one: it catches a fabricated source by testing it against what you actually retrieved. That catches one kind of hallucination - an invented source - though not a real source cited for a claim it does not support. The ids arrive through validation context, `Answer.model_validate_json(raw, context={\"retrieved_ids\": ids})`; with no context the check fails closed and rejects every citation.\n\nmodel_validator runs after the whole object is built, so it can enforce rules that span fields - here, that a confident answer must be grounded.\n\nThen feed the validation error back to the model as a retry message. It usually fixes its own output when told precisely what was wrong.",
      "points": [
        "Field constraints for ranges, lengths and enums via Literal.",
        "field_validator for one field; model_validator for cross-field rules.",
        "Validate citations against actually-retrieved ids.",
        "Pass the error text back as a retry - the model usually self-corrects.",
        "Bound retries; two failures means the prompt is wrong, not the output."
      ],
      "say": "I use field constraints for the structural checks - ranges, lengths, Literal for enums - then a field_validator for semantics. The one that earns its place checks that every citation is in the set of documents actually retrieved, which catches fabricated sources directly. A model_validator enforces cross-field rules like high confidence requiring a citation. On failure I feed the error back as a retry, bounded at two attempts.",
      "numbers": "One retry with the validation error attached fixes the large majority of schema failures. If two do not fix it, the prompt or schema is the problem.",
      "wrong": "Defining the model and calling it validated. Type-correct output that cites a document you never retrieved is exactly the failure you needed to catch.",
      "follow": "The model fails validation twice in a row. What does the user get?"
    },
    {
      "id": "py-24",
      "q": "Implement an LRU cache without functools.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "data-structures",
        "caching",
        "coding"
      ],
      "why": "A classic that still appears, and the O(1) requirement is the actual question.",
      "simple": "Cache the last N results, evict the least recently used. The requirement that makes it interesting is that both get and put must be O(1).\n\nIn Python, OrderedDict gives you this directly, because it maintains insertion order and can move a key to the end in constant time:\n\n    from collections import OrderedDict\n\n    class LRU:\n        def __init__(self, capacity=128):\n            self.capacity = capacity\n            self.data = OrderedDict()\n\n        def get(self, key):\n            if key not in self.data:\n                return None\n            self.data.move_to_end(key)          # mark as recently used\n            return self.data[key]\n\n        def put(self, key, value):\n            if key in self.data:\n                self.data.move_to_end(key)\n            self.data[key] = value\n            if len(self.data) > self.capacity:\n                self.data.popitem(last=False)   # evict oldest\n\nThe detail in put: assigning to a key that already exists keeps its old position in an OrderedDict, so an update must also call move_to_end (before or after the assignment - either works), or eviction picks the wrong victim. Evict only after inserting, and only when over capacity.\n\nIf the interviewer says no OrderedDict, they want the underlying structure: a hash map for O(1) lookup plus a doubly-linked list for O(1) reordering. The map points at nodes; the list tracks recency; you unlink and re-append on access. That pairing is the whole idea, and OrderedDict is that structure with the work already done.",
      "points": [
        "Both get and put must be O(1) - that is the real constraint.",
        "OrderedDict plus move_to_end is the idiomatic answer.",
        "popitem(last=False) evicts the oldest.",
        "Underneath: hash map for lookup, doubly-linked list for recency.",
        "Not thread-safe - add a lock if shared across threads."
      ],
      "say": "I use an OrderedDict, which keeps insertion order and lets me move a key to the end in constant time. get moves the key to the end and returns it; put moves it if present, assigns, then evicts from the front with popitem when over capacity. Underneath, that is a hash map for O(1) lookup plus a doubly-linked list for O(1) reordering, which is what I would write if OrderedDict were disallowed.",
      "numbers": "For LLM work, cache on a hash of the normalised prompt plus model plus temperature. Excluding any of those returns answers from the wrong configuration.",
      "wrong": "A dict plus a list of keys for recency. Removing from the middle of a list is O(n), which breaks the one constraint the question is testing.",
      "follow": "Two threads call put at the same time. What happens?"
    },
    {
      "id": "py-25",
      "q": "Implement a simple vector store class with add, search and delete.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "design",
        "retrieval",
        "coding"
      ],
      "why": "A design question wearing a coding question's clothes. Delete is where it gets interesting.",
      "simple": "**Short version: keep every vector in one normalised matrix, make add an upsert, and delete by marking rows dead instead of removing them.**\n\n    import numpy as np\n\n    class VectorStore:\n        def __init__(self, dim):\n            self.dim = dim\n            self.vectors = np.zeros((0, dim), dtype=np.float32)\n            self.ids = []\n            self.pos = {}                       # id -> row index\n            self.dead = set()                   # tombstoned rows\n\n        def add(self, id_, vec, meta=None):\n            v = np.asarray(vec, dtype=np.float32)\n            if v.shape != (self.dim,):\n                raise ValueError(f\"expected dim {self.dim}, got {v.shape}\")\n            norm = np.linalg.norm(v)\n            if norm == 0:\n                raise ValueError(\"zero vector has no direction\")\n            v = v / norm                        # normalise at write time\n            if id_ in self.pos:                 # upsert, not duplicate\n                self.vectors[self.pos[id_]] = v\n                return\n            self.vectors = np.vstack([self.vectors, v])\n            self.pos[id_] = len(self.ids)\n            self.ids.append(id_)\n\n        def delete(self, id_):\n            if id_ in self.pos:\n                self.dead.add(self.pos[id_])    # tombstone, do not compact\n                del self.pos[id_]\n\n        def search(self, q, k=5):\n            if not len(self.vectors):\n                return []\n            q = np.asarray(q, dtype=np.float32)\n            scores = self.vectors @ (q / np.linalg.norm(q))\n            if self.dead:\n                scores[list(self.dead)] = -np.inf\n            k = min(k, len(scores) - len(self.dead))\n            idx = np.argpartition(-scores, k - 1)[:k]\n            idx = idx[np.argsort(-scores[idx])]\n            return [(self.ids[i], float(scores[i])) for i in idx]\n\nDelete is the design question. Physically removing a row means every subsequent index shifts and your whole id map is wrong. So real stores tombstone: mark it dead, exclude it from results, compact later in a background job. That single decision is what the interviewer is looking for.\n\nThe other two: normalise at write time so search is one matrix product, and make add an upsert so re-ingesting a document does not silently duplicate it.",
      "points": [
        "Normalise at write time; search becomes a single dot product.",
        "add is an upsert - re-ingestion must not duplicate.",
        "Tombstone deletes; compaction is a separate background job.",
        "vstack per add is O(n) - pre-allocate and grow in blocks for real use.",
        "Validate the dimension on write, not at query time."
      ],
      "say": "The interesting part is delete. Physically removing a row shifts every index after it and invalidates the id map, so I tombstone: mark the row dead, mask it to negative infinity at search time, and compact in a background job. I normalise on write so search is one matrix product, and I make add an upsert so re-ingesting a document does not duplicate it. For real scale, vstack per add is too slow - pre-allocate in blocks.",
      "numbers": "Compact when tombstones exceed roughly 20% of rows. Once an exact scan stops meeting your latency budget - often somewhere between a few hundred thousand and a few million vectors - use a real ANN index.",
      "wrong": "np.delete on the row and moving on. Every index after it shifts, the id map now points at the wrong vectors, and search silently returns wrong documents.",
      "follow": "A million deletes and no compaction. What does search look like?"
    },
    {
      "id": "py-26",
      "q": "Write BM25 scoring from scratch.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "retrieval",
        "bm25",
        "coding"
      ],
      "why": "Separates candidates who understand hybrid search from those who can only name it.",
      "simple": "BM25 scores how well a document matches query terms. Three ideas stacked on top of each other, and each one is a fix for a flaw in the previous.\n\nStart with: a document containing the term more often is more relevant. True, but 'the' appears everywhere and means nothing - so weight each term by how rare it is across the corpus. That is IDF.\n\nNext flaw: a term appearing twenty times is not twenty times more relevant than once. So saturate the count - the k1 parameter controls how quickly extra occurrences stop helping.\n\nLast flaw: long documents contain more of everything and would always win. So normalise by length, with b controlling how aggressively.\n\n    import math\n    from collections import Counter\n\n    class BM25:\n        def __init__(self, docs, k1=1.5, b=0.75):\n            self.docs = [Counter(d) for d in docs]\n            self.len = [len(d) for d in docs]\n            self.avg = sum(self.len) / len(docs)\n            self.k1, self.b = k1, b\n            self.df = Counter()\n            for d in self.docs:\n                self.df.update(d.keys())\n            self.N = len(docs)\n\n        def idf(self, term):\n            n = self.df.get(term, 0)\n            return math.log((self.N - n + 0.5) / (n + 0.5) + 1)\n\n        def score(self, query, i):\n            total = 0.0\n            norm = self.len[i] / self.avg\n            for term in query:\n                f = self.docs[i].get(term, 0)\n                if not f:\n                    continue\n                total += self.idf(term) * (f * (self.k1 + 1)) / (\n                    f + self.k1 * (1 - self.b + self.b * norm))\n            return total\n\nThe plus-one inside the log keeps IDF non-negative for terms appearing in most documents. And this is exactly why hybrid search works: BM25 matches exact tokens - a part number, an error code - which is precisely where dense embeddings are weakest.",
      "points": [
        "IDF weights rare terms above common ones.",
        "k1 saturates term frequency - the twentieth hit adds little.",
        "b normalises for document length.",
        "Typical k1 is 1.2-2.0 (Lucene uses 1.2, rank_bm25 1.5) with b=0.75; tune only with evidence.",
        "BM25 catches exact identifiers that dense retrieval misses."
      ],
      "say": "BM25 stacks three corrections. IDF weights rare terms higher. k1 saturates term frequency so the twentieth occurrence barely adds anything. And b normalises for document length so long documents do not win by default. Typical values are k1 around 1.2 to 2 and b of 0.75. The reason it matters is that it matches exact tokens - part numbers, error codes, names - which is exactly where dense embeddings are weakest, so the two are complementary.",
      "numbers": "k1 between 1.2 and 2.0 (Lucene and Elasticsearch default to 1.2) and b=0.75. In production use an inverted index rather than scanning every document per query.",
      "wrong": "Describing it as 'like TF-IDF but better' with no mechanism. The follow-up is always what k1 and b do, and that is where it ends.",
      "follow": "Combine this with your vector scores. How?"
    },
    {
      "id": "py-27",
      "q": "Write an async pipeline where stage two starts before stage one finishes.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "async",
        "pipeline",
        "coding"
      ],
      "why": "Producer-consumer with a queue. Tests whether you can overlap stages instead of batching them.",
      "simple": "Chunking then embedding, done naively, is: chunk all ten thousand documents, then embed all of them. The embedder sits idle for the entire chunking phase, and you hold every chunk in memory.\n\nBetter: let embedding start on the first chunks while chunking is still running. A queue between the stages does exactly that.\n\n    async def pipeline(docs, limit=8, queue_size=100):\n        q = asyncio.Queue(maxsize=queue_size)      # bounded = backpressure\n        DONE = object()\n\n        async def producer():\n            try:\n                for doc in docs:\n                    for c in chunk(doc):\n                        await q.put(c)             # blocks when full\n            finally:                               # even if chunking fails\n                for _ in range(limit):\n                    await q.put(DONE)              # one sentinel per consumer\n\n        results = []\n        async def consumer():\n            while True:\n                item = await q.get()\n                if item is DONE:\n                    return\n                try:\n                    results.append(await embed(item))\n                except Exception:\n                    log.exception(\"embed failed\")  # record it, keep consuming\n\n        await asyncio.gather(producer(),\n                             *(consumer() for _ in range(limit)))\n        return results\n\nTwo design points carry this answer.\n\nThe queue is bounded, and that is deliberate. It gives you backpressure: if embedding is slower than chunking, the producer blocks on put rather than reading the entire corpus into memory. Memory stays flat regardless of corpus size. An unbounded queue is just a memory leak with extra steps.\n\nOne sentinel per consumer, because each consumer swallows exactly one. Send a single DONE and the other seven wait forever. The sentinels go out in a finally block, so a chunking failure still releases the consumers instead of leaving them blocked.",
      "points": [
        "Bounded queue gives backpressure and flat memory.",
        "One sentinel per consumer, or the rest hang.",
        "Consumers must catch their own exceptions, or one bad chunk kills a worker and fails the whole gather.",
        "Overlapping stages beats batching whenever both are non-trivial.",
        "queue.join with task_done is the alternative to sentinels."
      ],
      "say": "I put a bounded asyncio.Queue between the stages so consumers start while the producer is still working. Bounded is the important word - it gives backpressure, so if embedding is slower than chunking the producer blocks instead of loading the whole corpus into memory. I send one sentinel per consumer so they all terminate, and each consumer catches its own exceptions so a single bad chunk does not kill a worker.",
      "numbers": "Queue size around 100 and eight consumers is a reasonable start. Watch queue depth - persistently full means the consumer is the bottleneck.",
      "wrong": "An unbounded queue. It runs fine on a hundred documents and exhausts memory on the real corpus, because the producer always outruns the network-bound consumer.",
      "follow": "The queue is always full. What does that tell you, and what do you do?"
    },
    {
      "id": "py-28",
      "q": "Implement a token-aware chunker that never splits mid-sentence.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "chunking",
        "rag",
        "coding"
      ],
      "why": "The harder chunker variant. Boundary logic plus the character-versus-token distinction.",
      "simple": "Character chunking cuts sentences in half, which produces chunks that embed badly - half a sentence has muddled meaning. And character limits are the wrong unit anyway, because the model's limit is in tokens.\n\nSo: split into sentences, then greedily pack them up to a token budget.\n\n    import re\n\n    SENT = re.compile(r\"(?<=[.!?])\\s+\")\n\n    def chunk_by_tokens(text, count, max_tokens=500, overlap_sents=1):\n        sentences = [s for s in SENT.split(text) if s.strip()]\n        chunks, current, used = [], [], 0\n\n        for s in sentences:\n            n = count(s)\n            if n > max_tokens:                     # single huge sentence\n                if current:\n                    chunks.append(\" \".join(current))\n                    current, used = [], 0\n                chunks.extend(hard_split(s, count, max_tokens))  # e.g. token windows\n                continue\n            if used + n > max_tokens and current:\n                chunks.append(\" \".join(current))\n                current = current[-overlap_sents:] if overlap_sents > 0 else []\n                used = sum(count(x) for x in current)\n                while current and used + n > max_tokens:\n                    used -= count(current.pop(0))   # overlap must fit too\n            current.append(s)\n            used += n\n\n        if current:\n            chunks.append(\" \".join(current))\n        return chunks\n\nThe case that separates a complete answer from a partial one is the single sentence longer than the whole budget. A table row, a code block, a badly-formatted legal clause. Without the guard, that sentence can never fit, and depending on how you wrote the loop you either drop it or loop forever. You need a hard fallback split.\n\nOverlap is measured in sentences rather than characters, so the carried context is always coherent. Two small guards: `overlap_sents=0` must mean no overlap (`current[-0:]` is the whole list, a classic slicing bug), and carried sentences are dropped if they would push the next chunk over budget.\n\nAnd the honest caveat: the regex mishandles abbreviations like 'Dr.' and 'i.e.'. Say that before being asked, and name a real sentence splitter as the production answer.",
      "points": [
        "Split into sentences, then pack greedily to a token budget.",
        "Handle the sentence longer than max_tokens - the case most miss.",
        "Overlap by sentences, so carried context stays coherent.",
        "Count tokens with the real tokeniser, not a character estimate.",
        "Name the regex limitation on abbreviations before being asked."
      ],
      "say": "I split into sentences and pack greedily until adding the next would exceed the token budget, then carry the last sentence or two forward as overlap so context is not lost at the boundary. The case that matters is a single sentence longer than the budget - a table row or code block - which needs a hard fallback split or the loop cannot terminate. I count with the real tokeniser, and I would use a proper sentence splitter in production rather than a regex.",
      "numbers": "500 tokens with one sentence of overlap is a reasonable default. Structure-aware splitting on headings usually beats any tuning of these numbers.",
      "wrong": "Splitting on the full stop with no guard for the oversized sentence. It works on prose and breaks on the first document containing a table.",
      "follow": "The document is a contract with numbered clauses. Does your chunker still make sense?"
    },
    {
      "id": "py-29",
      "q": "Write a semantic cache with a similarity threshold.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "python",
        "caching",
        "embeddings",
        "coding"
      ],
      "why": "The applied version of the LRU question, and the wrong-hit failure mode is the real discussion.",
      "simple": "An exact-match cache almost never hits on natural language. 'What is the refund policy?' and 'How do refunds work?' are the same question and different strings.\n\nA semantic cache embeds the query and returns a stored answer if a previous query was close enough:\n\n    class SemanticCache:\n        def __init__(self, embed, dim, threshold=0.95, max_size=10_000):\n            self.embed = embed\n            self.threshold = threshold\n            self.max_size = max_size\n            self.vecs = np.zeros((0, dim), dtype=np.float32)\n            self.entries = []                   # (query, answer, expires_at)\n\n        def _unit(self, text):\n            v = np.asarray(self.embed(text), dtype=np.float32)\n            return v / np.linalg.norm(v)\n\n        def put(self, query, answer, now, ttl=3600):\n            self.vecs = np.vstack([self.vecs, self._unit(query)])\n            self.entries.append((query, answer, now + ttl))\n            if len(self.entries) > self.max_size:   # drop the oldest\n                self.vecs, self.entries = self.vecs[1:], self.entries[1:]\n\n        def get(self, query, now):\n            if not len(self.vecs):\n                return None\n            scores = self.vecs @ self._unit(query)\n            i = int(np.argmax(scores))\n            if scores[i] < self.threshold:\n                return None\n            _, answer, expires = self.entries[i]\n            if expires < now:\n                return None                     # stale, treat as a miss\n            return answer\n\nThe threshold is the entire design, and it is dangerous in a way an exact cache never is. Set it too low and you serve a confidently wrong answer: 'What is the refund policy for domestic orders?' matching a cached answer about international orders is a wrong hit, and the user has no way of knowing.\n\nSo start high - 0.95 is a common starting point - and tune it against a labelled set of query pairs, not by feel. Similarity scales differ between embedding models, so a threshold never transfers blindly.\n\nThree more requirements: TTL, because answers over changing data go stale. Per-tenant namespacing, because a cache shared across customers leaks one tenant's answer to another. And never cache personalised responses at all.",
      "points": [
        "Embed the query; hit when similarity clears the threshold.",
        "A wrong hit is worse than a miss - it is invisible to the user.",
        "Start high (around 0.95) and tune on labelled pairs; thresholds do not transfer between embedding models.",
        "TTL, because cached answers over live data go stale.",
        "Namespace by tenant, or you leak across customers."
      ],
      "say": "I embed the query, compare against cached query vectors, and return the stored answer only above a high similarity threshold. The threshold is the whole design: too low and you serve a confidently wrong answer the user cannot detect, so I start high, around 0.95, and tune it on labelled pairs. I add a TTL for staleness and namespace per tenant, because a shared cache leaks one customer's answer to another.",
      "numbers": "Hit rates depend heavily on traffic: repetitive support queries can reach tens of percent, open-ended chat far less. Each hit saves the full generation cost and returns in milliseconds instead of seconds.",
      "wrong": "Lowering the threshold to 0.85 because it improves the hit rate, without measuring wrong hits. Hits do go up - and the cache starts answering questions the user did not ask, which costs far more than a miss.",
      "follow": "How would you detect that your cache is serving wrong answers?"
    },
    {
      "id": "py-30",
      "q": "Two sum, group anagrams, merge intervals - the DSA baseline you still get.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "python",
        "dsa",
        "coding"
      ],
      "why": "Product companies still screen with these. Pretending otherwise costs candidates offers.",
      "simple": "AI engineering interviews at many product companies still include a standard data-structures-and-algorithms round. It is worth being honest about that rather than assuming GenAI depth exempts you.\n\nThe good news is that the pattern list is short. Nearly all of it reduces to: use a hash map to turn a nested loop into one pass.\n\n    from collections import defaultdict\n\n    def two_sum(nums, target):\n        seen = {}                                # value -> index\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target - n], i]\n            seen[n] = i\n        return []\n\n    def group_anagrams(words):\n        groups = defaultdict(list)\n        for w in words:\n            groups[tuple(sorted(w))].append(w)   # canonical key\n        return list(groups.values())\n\n    def merge_intervals(intervals):\n        out = []\n        for start, end in sorted(intervals):     # sort first, always\n            if out and start <= out[-1][1]:\n                out[-1][1] = max(out[-1][1], end)\n            else:\n                out.append([start, end])\n        return out\n\nThe habits that matter more than any single solution: state the complexity before you are asked, ask about the input size and whether it is sorted, and check the empty case. Interviewers are grading how you approach an unfamiliar problem, not whether you memorised this one.\n\nThe patterns worth knowing are hash maps, two pointers, sliding window, binary search, and a basic BFS or DFS. That covers most of what actually appears in these loops.",
      "points": [
        "Product-company AI roles still screen on DSA - prepare for it.",
        "Hash map, two pointers, sliding window, binary search, BFS/DFS.",
        "State time and space complexity unprompted.",
        "Ask about input size and edge cases before writing.",
        "Services companies weight this far less than product companies do."
      ],
      "say": "I would not skip DSA preparation for an AI role at a product company - the screening round is often still standard. The pattern set is small: hash maps to collapse nested loops, two pointers, sliding window, binary search, and basic graph traversal. I state complexity before being asked and check the empty case. It is a separate preparation track from GenAI depth, and both get tested.",
      "numbers": "Roughly 30–45 minutes for one or two problems. Practise speaking while coding - silent solving reads as guessing even when the answer is right.",
      "wrong": "Assuming GenAI experience exempts you from the coding round. It is the most common way strong AI candidates fail a product-company loop.",
      "follow": "Walk me through your approach before you write anything."
    },
    {
      "id": "py-31",
      "q": "Write SQL to keep the latest model event for each request id.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "sql",
        "coding",
        "data",
        "window-functions"
      ],
      "why": "SQL and data handling appear in many senior AI/ML jobs even when the title says AI Engineer rather than Data Engineer.",
      "simple": "I use a window function because I want to rank rows inside each request, not collapse them with a `GROUP BY` and then struggle to recover the other columns.\n\nThe important detail is a deterministic tie-breaker. Two events can have the same timestamp, so I add a monotonically increasing event id or another stable ordering column.\n\nNulls need a decision too. PostgreSQL, Oracle and Snowflake sort NULLs first under DESC, so a row with a missing timestamp would win; `NULLS LAST` fixes that. MySQL and SQL Server already put NULLs last under DESC but do not accept the `NULLS LAST` keyword, so drop it there.\n\nI also say which columns I actually need in production instead of carrying `SELECT *` through a large pipeline. For an interview, keeping it compact is fine, but I call out the data-volume and index/partitioning question if this runs frequently.\n\nAfter deduplication I would test null timestamps, duplicate timestamps, one-row requests and late-arriving events, because those are the cases that make a query look correct on a toy sample and fail in a pipeline.",
      "code": "WITH ranked AS (\n    SELECT\n        request_id,\n        event_id,\n        event_time,\n        status,\n        output,\n        ROW_NUMBER() OVER (\n            PARTITION BY request_id\n            ORDER BY event_time DESC NULLS LAST, event_id DESC\n        ) AS rn\n    FROM model_events\n)\nSELECT request_id, event_id, event_time, status, output\nFROM ranked\nWHERE rn = 1;",
      "points": [
        "Use `ROW_NUMBER()` partitioned by the business key.",
        "Order newest first and include a deterministic tie-breaker.",
        "Select the columns you need in production.",
        "Test duplicate timestamps, nulls and late-arriving events.",
        "Ask about partitioning/indexing when the table is large."
      ],
      "say": "I use `ROW_NUMBER()` over each request id, ordered by event time descending, then keep row one. I add a stable tie-breaker such as event id because timestamps can collide, otherwise the result can change between runs. I select only the columns the pipeline needs and ask about table size, partitioning and indexes if this is on a hot path. I would test duplicate timestamps, nulls and late-arriving events rather than only the happy sample.",
      "numbers": "No fixed row count changes the SQL idea, but scale changes the physical design. Check the query plan on production-like data before assuming an index or partition strategy helps.",
      "wrong": "Using `MAX(event_time)` alone and then assuming the rest of the columns come from that same row. You need a deterministic way to select the whole winning row.",
      "follow": "A late event arrives tomorrow with an event_time from yesterday. Should it replace the row you kept, and how does that change the pipeline?"
    }
  ]
};
