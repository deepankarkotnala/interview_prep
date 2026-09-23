/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["17-python-coding"] = {
  "lede": "Coding rounds for AI engineers mix normal Python with AI-specific work: async model calls, validation, streaming, retries, testing, NumPy and SQL. Product companies may still add a standard data-structures round, so this topic covers both. New to Python coding rounds? The questions are ordered for a first read: every High priority card first, from core Python (async, the GIL, generators, decorators, data structures) through NumPy, chunking and validation to resilient API calls, testing and streaming, then Medium, then Low.",
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
      "priority": "high",
      "tags": [
        "python",
        "async",
        "concurrency"
      ],
      "why": "The most relevant Python question for this role, because the work is almost entirely I/O-bound.",
      "simple": "Use async when your code spends most of its time waiting. An AI app waits a lot: for the model, the vector database, a tool API. Async lets one program wait on many of these at once.\n\nThe rule: async helps I/O-bound work, not CPU-bound work. I/O-bound means the time goes on waiting for the network or disk. CPU-bound means the time goes on calculation.\n\nA quick example. Twenty model calls take about one second each. One after another, that is twenty seconds. With ten running at a time, they finish in two waves, so about two seconds. Do not remove the limit completely, though. Thousands of calls at once will hit rate limits and connection limits.\n\nFor CPU-heavy work, like parsing big PDFs, async does not help. Use a process pool or a separate worker service. Threads still help when a library only offers blocking I/O. (py-19 covers the GIL and free-threaded Python.)\n\nThe classic bug is a blocking call inside async code, such as `requests.get` or `time.sleep`. The event loop is the single scheduler that runs all your coroutines. One blocking call freezes it, and every other request waits too. Use an async client, or move the call to a thread with `asyncio.to_thread`.",
      "code": "import asyncio\n\n# sequential: about 20s for twenty ~1s calls\nresults = [await llm.ainvoke(q) for q in questions]\n\n# bounded concurrency: ten at a time -> roughly two waves\nsem = asyncio.Semaphore(10)\n\nasync def one(q):\n    async with sem:\n        return await llm.ainvoke(q)\n\nresults = await asyncio.gather(\n    *(one(q) for q in questions),\n    return_exceptions=True,\n)",
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
      "follow": "Your gather of 500 calls returns rate-limit errors. What do you change?",
      "followAnswer": "First I lower concurrency. A semaphore sized from the provider's requests-per-minute and tokens-per-minute limits, not 500 at once. Then each call gets a retry with exponential backoff and jitter that honours Retry-After. I keep return_exceptions=True, so the successes are kept and only the failures are retried. If it is an offline job rather than a user request, I use the provider's batch API instead."
    },
    {
      "id": "py-19",
      "q": "Explain the GIL and when multiprocessing beats threading for AI workloads.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "python",
        "concurrency",
        "gil"
      ],
      "why": "Frequently asked, and the correct answer for this role is counter-intuitive to people who half-remember it.",
      "simple": "The GIL is the Global Interpreter Lock. In standard CPython, it lets only one thread run Python code at a time. So adding threads does not speed up pure-Python CPU work.\n\nThreads still help with waiting. When a thread waits on the network or disk, it releases the lock and another thread runs. That is why threads work well for blocking I/O.\n\nFor CPU-heavy Python code, multiprocessing is the classic answer. Each process has its own interpreter and its own GIL, so processes really run on separate cores. The cost is memory, and data must be copied (pickled) between processes.\n\nLibraries like NumPy and PyTorch are different. Their heavy maths runs in C and often releases the GIL. So profile before you add processes.\n\nThe version caveat matters now. Python 3.13 added an experimental free-threaded build with no GIL. Python 3.14 made it officially supported, but it is still optional and not the default. Python 3.15, due in October 2026, keeps the GIL build as the default too. Some C extensions are not ready yet, and importing one can switch the GIL back on. So decide based on the runtime you actually deploy.\n\nFor an AI service: async or threads for model and API calls, and processes or a worker service for heavy CPU work like PDF parsing.",
      "points": [
        "Standard CPython still has a GIL; pure Python CPU threads do not normally scale across cores.",
        "Threads remain useful for blocking I/O - the lock is released while waiting.",
        "Multiprocessing gives each process its own GIL - real parallel CPU, at the cost of memory and pickling.",
        "Free-threaded CPython: experimental in 3.13, officially supported in 3.14, still optional and not the default.",
        "Extension compatibility still matters, so verify the production runtime.",
        "NumPy and PyTorch release the GIL in native code - profile before adding processes."
      ],
      "say": "The GIL answer now depends on the Python build. Standard CPython still lets only one thread execute Python bytecode at a time, so threads mainly help blocking I/O. Optional free-threaded builds can run Python threads across cores, but extension compatibility still matters and some modules can change that behaviour. So I choose based on the runtime we deploy: async or threads for I/O, and processes or worker services when I need predictable CPU parallelism.",
      "numbers": "On a standard build, four threads running pure-Python CPU code take about as long as one. Four processes on four cores can approach a 4x speed-up, minus process start-up and pickling cost. Measure it on your own workload.",
      "wrong": "Saying 'Python threads can never use multiple cores' without mentioning free-threaded builds, or saying the GIL is simply gone for everyone. Both are now too absolute.",
      "follow": "Your ingestion job is CPU-bound on PDF parsing and I/O-bound on embedding. How do you structure it?",
      "followAnswer": "I split it into two stages joined by a bounded queue. PDF parsing runs in a process pool, for example a ProcessPoolExecutor driven from asyncio with run_in_executor, sized to the CPU cores. Embedding runs as async tasks with a semaphore sized to the provider's rate limit. The bounded queue gives backpressure, so if embedding falls behind, parsing pauses instead of filling memory."
    },
    {
      "id": "py-02",
      "q": "Why do generators matter when processing documents?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "generators",
        "memory"
      ],
      "why": "A common live-coding theme, because ingestion pipelines are exactly where this bites.",
      "simple": "A generator gives you items one at a time, instead of building a whole list in memory. You write one with `yield` instead of `return`.\n\nFor document ingestion this matters a lot. Say you read ten thousand documents into a list, chunk them into another list, then embed. You now hold everything in memory at once. On a big corpus the process runs out of memory and the operating system kills it.\n\nWith generators, each document flows through the pipeline and is released before the next one is read. Memory stays flat, whatever the corpus size. Think of a conveyor belt instead of a warehouse.\n\nGenerators also fit streaming. You yield each token as it arrives, rather than waiting for the full response.\n\nTwo trade-offs to say out loud. A generator can be used only once. If you need the data twice, store it in a list or create the generator again. And you cannot ask for its length without using it up. So a progress bar over a generator needs the total passed in separately.\n\nThe code shows the standard pattern: a chunk generator, plus a helper that groups items into batches for the embedding API. Python 3.12+ has this helper built in as `itertools.batched`.",
      "code": "def chunks(paths):\n    for p in paths:                  # one document in memory at a time\n        for c in split(read(p)):\n            yield c\n\ndef batched(it, n):                  # embed in batches without a full list\n    batch = []\n    for item in it:\n        batch.append(item)\n        if len(batch) == n:\n            yield batch\n            batch = []\n    if batch:\n        yield batch\n\nfor group in batched(chunks(paths), 100):\n    store.add(embed(group))",
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
      "follow": "You need to retry a failed batch. What does that do to your generator design?",
      "followAnswer": "A generator cannot rewind, so I cannot re-read the failed batch from it. But the batch itself is already a small list, so I keep it and retry that list with backoff. If it still fails, I write its chunk ids to a dead-letter list and carry on. Because chunks have stable ids and writes are upserts, rerunning just those documents later is safe."
    },
    {
      "id": "py-32",
      "q": "Explain decorators and context managers, and write one of each.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "decorators",
        "context-managers",
        "basics"
      ],
      "why": "Core Python fluency. Almost every AI codebase uses both, for logging, retries, tracing and cleaning up connections.",
      "simple": "Both let you wrap extra behaviour around code without rewriting that code.\n\nA decorator is a function that takes a function and returns a new one. The new one usually does something before and after calling the original. Writing `@retry` above a function is shorthand for `fn = retry(fn)`. Typical uses in AI code are logging, timing, retries, caching and auth checks.\n\nTwo details interviewers check. First, use `functools.wraps`. Without it, the wrapped function loses its name and docstring, and every trace shows `wrapper`. Second, a decorator that takes arguments, like `@retry(times=3)`, needs three layers. The outer function takes the arguments and returns the real decorator.\n\nA context manager handles setup and cleanup around a block of code, using `with`. The cleanup always runs, even when the block raises an error. `with open(path) as f:` closes the file for you. Think of a door that locks itself behind you.\n\nYou can write one as a class with `__enter__` and `__exit__`. Or, more simply, as a generator with `@contextmanager`. Code before `yield` is setup, and code in `finally` is cleanup. Put the cleanup in `finally`, or an error will skip it.\n\nBoth have async forms. An async decorator needs an `async def` wrapper that awaits the call. Async resources use `async with` and `@asynccontextmanager`.",
      "code": "import functools, time\nfrom contextlib import contextmanager\n\n# 1) A decorator that takes arguments: three layers\ndef retry(times=3, on=(TimeoutError,), delay=0.5):\n    def decorator(fn):\n        @functools.wraps(fn)                # keep fn.__name__ and docstring\n        def wrapper(*args, **kwargs):\n            for attempt in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except on:\n                    if attempt == times - 1:\n                        raise\n                    time.sleep(delay * 2 ** attempt)\n        return wrapper\n    return decorator\n\n@retry(times=3)\ndef fetch_context(query):\n    return vector_store.search(query)       # may raise TimeoutError\n\n# 2) A context manager: setup, yield, guaranteed cleanup\n@contextmanager\ndef span(name):\n    start = time.perf_counter()\n    try:\n        yield                               # the with-block runs here\n    finally:                                # runs even if the block raises\n        ms = (time.perf_counter() - start) * 1000\n        print(f\"{name} took {ms:.0f} ms\")\n\nwith span(\"retrieve\"):\n    docs = fetch_context(\"refund policy\")",
      "points": [
        "A decorator takes a function and returns a wrapped one; `@d` means `fn = d(fn)`.",
        "Always use `functools.wraps` so names and docstrings survive in traces.",
        "A decorator with arguments has three layers: factory, decorator, wrapper.",
        "A context manager guarantees cleanup around a `with` block, even on errors.",
        "`@contextmanager`: setup before `yield`, cleanup in `finally`.",
        "If `__exit__` returns True it swallows the exception - usually a bug.",
        "Async code needs an `async def` wrapper and `@asynccontextmanager`."
      ],
      "say": "A decorator is a function that takes a function and returns a wrapped version, so I can add logging, timing, retries or caching without touching the body. I always use functools.wraps so the name survives in traces, and a decorator with arguments needs an extra factory layer. A context manager guarantees setup and cleanup around a with block, even when it raises. I usually write one with contextmanager and put the cleanup in finally.",
      "numbers": "No meaningful number applies. The wrapper adds one extra function call per invocation, which is negligible next to a model call measured in hundreds of milliseconds.",
      "wrong": "\"A decorator is the @ symbol that adds features to a function.\" It names the syntax, not the mechanism. The follow-up - write one that takes arguments, or explain why every traced function is now called wrapper - shows whether you have actually written one.",
      "follow": "How would you write a decorator that works on both sync and async functions?",
      "followAnswer": "I check the target with inspect.iscoroutinefunction when the decorator is applied. If it is async, I return an async def wrapper that awaits the call; otherwise, a normal wrapper. Both use functools.wraps. The shared logic, like timing and logging, lives in a small helper, so the two wrappers stay tiny. Checking once at decoration time avoids a type check on every call."
    },
    {
      "id": "py-33",
      "q": "List vs tuple vs set vs dict - when do you use each, and what are the mutability gotchas?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "data-structures",
        "basics",
        "mutability"
      ],
      "why": "A screening favourite. It checks basic fluency, and whether you know the shared-state bug that leaks data between requests.",
      "simple": "Pick the structure by what you need to do with the data.\n\nA list is an ordered sequence you can change. Use it for items in order, like retrieved chunks. Checking `x in my_list` scans every item, so it gets slow on big lists.\n\nA tuple is an ordered sequence you cannot change. Use it for fixed records, like `(doc_id, score)`. Because it cannot change, it can be a dict key or a set member, as long as everything inside it is also unchangeable.\n\nA set holds unique items with no order. Checking `x in my_set` is fast, whatever the size. Use it to remove duplicates or to ask \"have I seen this id?\".\n\nA dict maps keys to values, with fast lookup by key. Since Python 3.7, dicts keep insertion order.\n\nNow the gotchas. Mutable means an object can change in place. Lists, dicts and sets are mutable. Tuples, strings and numbers are not.\n\nThe famous bug is a mutable default argument, like `def add(msg, history=[])`. Python creates that list once, when the function is defined, not on each call. So every call shares one list, and conversation history leaks between users. Use `None` as the default and create the list inside.\n\nTwo more traps. `[[]] * 3` gives three references to the same inner list. And `b = a` does not copy; it gives the same list a second name.",
      "code": "# The mutable default bug\ndef add_turn(msg, history=[]):        # ONE list, created at def time\n    history.append(msg)\n    return history\n\nadd_turn(\"hi\")                        # ['hi']\nadd_turn(\"hello\")                     # ['hi', 'hello']  <- leaked in\n\n# The fix: None as the default, a new list per call\ndef add_turn(msg, history=None):\n    if history is None:\n        history = []\n    history.append(msg)\n    return history\n\n# Aliasing traps\ngrid = [[]] * 3                       # three names for ONE inner list\ngrid[0].append(\"x\")                   # [['x'], ['x'], ['x']]\ngrid = [[] for _ in range(3)]         # three separate lists\n\n# Picking the structure\nresults = [(\"d1\", 0.91), (\"d2\", 0.88), (\"d1\", 0.91)]   # tuples as records\nseen = set()                          # fast membership test\nunique = []\nfor doc_id, score in results:\n    if doc_id not in seen:\n        seen.add(doc_id)\n        unique.append((doc_id, score))\nscores = dict(unique)                 # key -> value lookup",
      "points": [
        "**list**: ordered, mutable; `in` scans every item, O(n).",
        "**tuple**: ordered, immutable; hashable if its contents are, so it can be a dict key.",
        "**set**: unique and unordered; O(1) average membership - for dedup and seen-checks.",
        "**dict**: key to value, O(1) average lookup, insertion-ordered since 3.7.",
        "Default arguments are evaluated once, at def time - use `None` and create inside.",
        "`[[]] * 3` and `b = a` alias; use a comprehension or `copy.deepcopy`.",
        "Dataclasses: `field(default_factory=list)` for mutable defaults."
      ],
      "say": "I pick by access pattern. A list for ordered items I will change, a tuple for fixed records like doc id and score, which can also be dict keys, a set for fast membership and deduplication, and a dict for lookups by key. The gotcha I always mention is the mutable default argument: the default list is created once, at definition time, so every call shares it. I use None and create the list inside.",
      "numbers": "Membership in a list is O(n); in a set or dict it is O(1) on average. In a quick check, 10,000 lookups against a 100,000-item list took several seconds; against a set, about a millisecond.",
      "wrong": "\"Tuples are just faster lists.\" The real difference is immutability and hashability. And missing the mutable-default bug suggests you have never debugged shared state in a long-running service.",
      "follow": "Why can a tuple be a dict key but a list cannot?",
      "followAnswer": "A dict finds keys by their hash, so a key's hash must never change while it is stored. A list is mutable - append to it and its hash would change, and the dict could no longer find it - so lists are unhashable. A tuple is immutable, so it can be hashed, but only if everything inside it is hashable too. A tuple that contains a list still raises a TypeError."
    },
    {
      "id": "py-30",
      "q": "Two sum, group anagrams, merge intervals - the DSA baseline you still get.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "dsa",
        "coding"
      ],
      "why": "Product companies still screen with these. Pretending otherwise costs candidates offers.",
      "simple": "Many product companies still run a standard coding round for AI roles. Strong GenAI experience does not exempt you. Prepare for it as a separate track.\n\nThe good news is that the pattern list is short. Many easy and medium problems reduce to one idea: use a hash map (a Python dict) to turn a nested loop into one pass.\n\nTwo sum: store each number's index in a dict as you go. For each new number, check whether its partner is already there. That is O(n) instead of O(n²).\n\nGroup anagrams: sort each word's letters to get a key. Words with the same key are anagrams, so group them in a dict.\n\nMerge intervals: sort by start first. Then walk through and extend the last interval whenever the next one overlaps it.\n\nThe habits matter more than any single answer. Ask about input size, duplicates and whether the data is sorted. Say the time and space complexity before you are asked. Test the empty case out loud. Interviewers grade how you approach a new problem, not whether you memorised this one.\n\nThe patterns worth practising: hash maps, two pointers, sliding window, binary search, heaps for top-k, and basic BFS and DFS on trees and graphs.",
      "code": "from collections import defaultdict\n\ndef two_sum(nums, target):\n    seen = {}                                # value -> index\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for w in words:\n        groups[tuple(sorted(w))].append(w)   # canonical key\n    return list(groups.values())\n\ndef merge_intervals(intervals):\n    out = []\n    for start, end in sorted(intervals):     # sort first, always\n        if out and start <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], end)\n        else:\n            out.append([start, end])\n    return out",
      "points": [
        "Product-company AI roles still screen on DSA - prepare for it.",
        "Hash map, two pointers, sliding window, binary search, heaps, BFS/DFS.",
        "State time and space complexity unprompted.",
        "Ask about input size and edge cases before writing.",
        "Services companies weight this far less than product companies do."
      ],
      "say": "I would not skip DSA preparation for an AI role at a product company - the screening round is often still standard. The pattern set is small: hash maps to collapse nested loops, two pointers, sliding window, binary search, and basic graph traversal. I state complexity before being asked and check the empty case. It is a separate preparation track from GenAI depth, and both get tested.",
      "numbers": "Roughly 30–45 minutes for one or two problems. Practise speaking while coding - silent solving reads as guessing even when the answer is right.",
      "wrong": "Assuming GenAI experience exempts you from the coding round. It is the most common way strong AI candidates fail a product-company loop.",
      "follow": "Walk me through your approach before you write anything.",
      "followAnswer": "Sure. First I restate the problem and ask about constraints: input size, duplicates, negative numbers, whether it is sorted. Then I give the brute force and its complexity, so we have a baseline. Then I look for the better pattern - usually a hash map, two pointers or sorting - and state its time and space cost. I agree that with you before coding, then test the edge cases out loud."
    },
    {
      "id": "py-34",
      "q": "NumPy and Pandas: why vectorise instead of looping, and what is broadcasting?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "numpy",
        "pandas",
        "vectorisation"
      ],
      "why": "Most data and retrieval code in AI roles is NumPy or Pandas. Loop-heavy code is the quickest way to look junior in a live round.",
      "simple": "Vectorising means you hand NumPy or Pandas a whole array in one call, instead of looping over items in Python.\n\nIt is faster because the loop still happens, but in compiled C code over tightly packed numbers. A Python loop pays interpreter overhead on every single item. The speed-up is often tens or hundreds of times.\n\nBroadcasting is how NumPy combines arrays of different shapes without copying data. It lines the shapes up from the right. Two sizes match if they are equal, or if one of them is 1. A size-1 axis is stretched to fit. So a (1000, 768) matrix minus a (768,) mean vector subtracts the mean from every row.\n\nThe classic trap is a silent wrong axis. Row norms have shape (n,). Dividing an (n, d) matrix by them fails, or, if n equals d, runs and divides the wrong way. Use `keepdims=True` to keep the shape (n, 1).\n\nIn Pandas the same idea applies. Use column maths like `df[\"a\"] * df[\"b\"]`, and `np.where` for simple conditions. Avoid `iterrows()` and row-wise `apply`, which are Python loops in disguise.\n\nThe trade-off: vectorised code builds full temporary arrays. For data that does not fit in memory, work in chunks. And a tiny loop that runs once is fine; readability wins there.",
      "code": "import numpy as np\nimport pandas as pd\n\nx = np.random.rand(1_000_000)\n\n# Loop: interpreter overhead on every element\ntotal = 0.0\nfor v in x:\n    total += v * v\n\n# Vectorised: one call, the loop runs in C\ntotal = float(np.dot(x, x))\n\n# Broadcasting: (n, d) with (d,) -> subtract the mean from every row\nE = np.random.rand(1000, 768).astype(np.float32)\ncentred = E - E.mean(axis=0)                    # (1000, 768) - (768,)\n\n# keepdims keeps norms as (n, 1), so each ROW is divided by its own norm\nunit = E / np.linalg.norm(E, axis=1, keepdims=True)\n\n# Pandas: column maths and np.where, not iterrows or row-wise apply\nPRICE_IN, PRICE_OUT = 3e-6, 15e-6               # illustrative $ per token\ndf = pd.DataFrame({\"tokens_in\": [1200, 300], \"tokens_out\": [400, 50]})\ndf[\"cost\"] = df[\"tokens_in\"] * PRICE_IN + df[\"tokens_out\"] * PRICE_OUT\ndf[\"size\"] = np.where(df[\"tokens_in\"] > 1000, \"long\", \"short\")",
      "points": [
        "Vectorise: one call over the whole array; the loop runs in compiled code.",
        "Broadcasting aligns shapes from the right; sizes match if equal or 1.",
        "`keepdims=True` for per-row reductions, or you divide along the wrong axis.",
        "Pandas: column expressions and `np.where`; avoid `iterrows` and row-wise `apply`.",
        "Use float32 for embeddings - half the memory of float64.",
        "Vectorised code creates temporaries - chunk data that does not fit in memory."
      ],
      "say": "Vectorising means handing NumPy or Pandas the whole array, so the loop runs in compiled code instead of the Python interpreter, which is often tens or hundreds of times faster. Broadcasting lets arrays of different shapes combine: shapes align from the right and a size-one axis stretches. The bug I watch for is dividing by row norms without keepdims, which fails or divides the wrong way. In Pandas I use column operations, not iterrows.",
      "numbers": "Summing the squares of a million floats: a Python loop took about 250 ms in a quick check, np.dot under 1 ms. A (1,000,000, 768) float32 matrix is about 3 GB; the same in float64 is about 6 GB.",
      "wrong": "Writing `df.apply(lambda row: ..., axis=1)` and calling it vectorised. It is still one Python function call per row, and the interviewer will ask you to time it.",
      "follow": "Your array is 20 GB and does not fit in memory. What now?",
      "followAnswer": "I process it in chunks. I memory-map the file with np.memmap, or read it in blocks of rows, do the vectorised work per block and combine the results - for top-k, a running best-k across blocks. I check the dtype first, since float32 instead of float64 halves the size. If it is a recurring job, I move to a tool built for it, like DuckDB or Polars, or a vector index."
    },
    {
      "id": "py-07",
      "q": "Implement cosine similarity from scratch, then vectorise it.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "numpy",
        "embeddings",
        "coding"
      ],
      "why": "The single most-asked AI coding question in these loops. It checks whether you understand the maths behind retrieval or only call a library.",
      "simple": "Cosine similarity asks one question: do two vectors point the same way? It ignores their length and looks only at direction. Two texts about the same topic point the same way, even if one is short and one is long.\n\nThe formula is the dot product divided by the two lengths multiplied together. The length of a vector is called its norm. Dividing by the norms removes size and leaves pure direction. The result runs from -1 (opposite) to 1 (same direction).\n\nWrite the two-vector version first, so the interviewer sees you know the formula. Guard against a zero vector, which has no direction and would divide by zero.\n\nThen vectorise. In retrieval you compare one query against a million documents. Calling the pair function in a Python loop takes many seconds. Instead, normalise every row of the matrix and do one matrix-vector product. Use `keepdims=True` on the row norms, or the shapes will not line up correctly.\n\nThe senior step: normalise your vectors once, when you store them. Then every query is just one dot product per document. That is what a vector database does inside, with an index on top so it does not check every row.",
      "code": "import numpy as np\n\ndef cosine(a, b):\n    na, nb = np.linalg.norm(a), np.linalg.norm(b)\n    if na == 0 or nb == 0:\n        return 0.0                         # zero vector: no direction\n    return float(np.dot(a, b) / (na * nb))\n\ndef cosine_batch(q, M, eps=1e-12):\n    # q: (d,)   M: (n, d)  ->  scores: (n,)\n    q = q / max(np.linalg.norm(q), eps)\n    M = M / np.maximum(np.linalg.norm(M, axis=1, keepdims=True), eps)\n    return M @ q",
      "points": [
        "Cosine measures direction only; magnitude is divided out.",
        "Write the loop version first, then vectorise - show both.",
        "keepdims=True on the row norms, or broadcasting fails - or, when n equals d, silently divides along the wrong axis.",
        "Normalise once at write time; then cosine equals a plain dot product.",
        "Guard the zero vector - a zero-length vector divides by zero."
      ],
      "say": "Cosine is the dot product over the product of the norms, so it measures direction and ignores magnitude. I would write the two-line version first, then vectorise it: normalise the query, normalise the matrix rows with keepdims, and take a single matrix-vector product. In production I normalise at write time, so retrieval is one dot product rather than recomputing norms per query.",
      "numbers": "A million 768-dimension vectors is about 3 GB in float32. On a laptop CPU, one matrix-vector product over pre-normalised rows takes on the order of 100 ms, because it is limited by memory bandwidth. Calling the pair function in a Python loop over the same rows takes well over ten seconds.",
      "wrong": "Writing the loop and stopping there. The interviewer is waiting to see if you notice it will not survive a real index, and most candidates do not.",
      "follow": "Now the matrix does not fit in memory. What changes?",
      "followAnswer": "I stop loading it all at once. I store float32, or quantised int8, to shrink it, memory-map the file and score it in blocks, keeping a running top-k across blocks. That fixes memory but not latency, because every query still reads every vector. For interactive search at that size I move to an ANN index, such as HNSW or IVF with quantisation, and measure its recall against exact search."
    },
    {
      "id": "py-09",
      "q": "Write a text chunker with configurable size and overlap.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "chunking",
        "rag",
        "coding"
      ],
      "why": "A small function where the off-by-one errors are the entire test.",
      "simple": "A chunker cuts long text into pieces of a fixed size. Overlap means each piece repeats the end of the previous one. So a sentence cut at a boundary still appears whole in one of them.\n\nIt looks like three lines of code. It is also where many candidates make a bug live.\n\nThe core idea: each new chunk starts `size - overlap` characters after the last one. That distance is the step. With size 1000 and overlap 200, chunks start at 0, 800, 1600 and so on.\n\nTrap one: stepping by `size`. Then chunks sit end to end and there is no overlap at all.\n\nTrap two: overlap equal to or bigger than size. The step becomes zero or negative. A zero step makes `range` raise an error, a negative one silently returns nothing, and a hand-written `while` loop never ends. Check it at the top and fail with a clear message.\n\nTrap three: stop once a chunk reaches the end of the text. Otherwise you emit tiny trailing chunks that only repeat the end.\n\nThen give the honest caveat. Characters are not tokens. A real chunker splits on structure, like headings and paragraphs, and measures in tokens.",
      "code": "def chunk(text, size=1000, overlap=200):\n    if overlap >= size:\n        raise ValueError(\"overlap must be smaller than size\")\n    step = size - overlap\n    out = []\n    for start in range(0, len(text), step):\n        piece = text[start:start + size]\n        if piece:\n            out.append(piece)\n        if start + size >= len(text):   # window reached the end\n            break\n    return out",
      "points": [
        "step = size - overlap. This is the whole function.",
        "Reject overlap >= size up front - otherwise you get an error, an empty result or an infinite loop.",
        "Break once the window covers the end, to avoid trailing fragments.",
        "Character size is not token size - convert before trusting a limit.",
        "State that a real chunker splits on structure, not raw characters."
      ],
      "say": "The core is that the step is size minus overlap, not size. I validate that overlap is smaller than size at the top, because otherwise the step is zero or negative, and the function errors, returns nothing, or loops forever. I break once a window reaches the end, so there are no tiny trailing fragments. And I say that character chunking is a baseline - for real documents I split on structure and measure in tokens.",
      "numbers": "1000 characters with 200 overlap is a reasonable default, roughly 250 tokens. Overlap above about a quarter of the chunk size mostly buys duplicate storage.",
      "wrong": "Stepping by `size` and never subtracting the overlap. The chunks sit end to end, a sentence cut at a boundary is broken in both chunks, and nobody notices until retrieval quality drops.",
      "follow": "This splits a sentence in half. Fix it.",
      "followAnswer": "I stop cutting at fixed character positions. I split the text into sentences first, then pack whole sentences into a chunk until the next one would go over the budget, and carry the last sentence over as overlap. A sentence longer than the whole budget gets a hard split as a fallback. In production I use a proper sentence splitter, because a simple regex breaks on abbreviations like 'Dr.'."
    },
    {
      "id": "py-03",
      "q": "How do you use Pydantic in an LLM pipeline?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "python",
        "pydantic",
        "validation",
        "structured-output"
      ],
      "why": "Pydantic is named in a large share of these JDs, and its role here is specific.",
      "simple": "Pydantic lets you define data as a Python class with typed fields, then checks real data against it. In an LLM pipeline it does two jobs.\n\nJob one: it defines what you ask the model for. Most SDKs and frameworks can turn a Pydantic class into a JSON schema. A JSON schema is a formal description of the fields and types you expect. You send it as the structured-output format or a tool definition. So one class describes the request and parses the reply, and the two cannot drift apart.\n\nJob two: it checks what comes back. You need this even with strict structured output, because valid JSON is not correct JSON. A claim id can have the right shape and still not exist. Put those business rules in validators. Pass per-request facts, such as the retrieved chunk ids, with `model_validate(data, context={...})`.\n\nThree practical tips. Keep models shallow; deep nesting tends to raise failure rates. Use `Literal` or an enum when the allowed values are known, because that limits what the model can generate. And write good field descriptions. They go into the schema the model reads, so they are really part of the prompt.",
      "code": "from typing import Literal\nfrom pydantic import BaseModel, Field, field_validator\n\nclass ClaimDecision(BaseModel):\n    claim_id: str = Field(description=\"Claim reference as printed on the form, e.g. C-4471\")\n    decision: Literal[\"approve\", \"deny\", \"refer\"]\n    reason:   str = Field(max_length=300)\n    cited:    list[str] = Field(description=\"Chunk ids supporting this decision\")\n\n    @field_validator(\"cited\")\n    @classmethod\n    def cited_must_exist(cls, v, info):\n        # shape was guaranteed by the schema; existence never is\n        retrieved = (info.context or {}).get(\"retrieved_ids\", set())\n        unknown = set(v) - retrieved\n        if unknown:\n            raise ValueError(f\"invented citations: {unknown}\")\n        return v\n\n# decision = ClaimDecision.model_validate(data, context={\"retrieved_ids\": ids})",
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
      "follow": "The schema validated and the claim id does not exist. Where does that get caught?",
      "followAnswer": "In a validator that checks the id against the source of truth - the claims database, or the ids we actually retrieved - passed in through validation context. The schema only guarantees shape. If the check fails, I send the validation error back to the model for one retry. If it fails again, the request goes to a human or returns a clear 'could not process' state, never a guessed id."
    },
    {
      "id": "py-11",
      "q": "Parse JSON from a model response that wraps it in markdown fences.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "python",
        "parsing",
        "structured-output",
        "coding"
      ],
      "why": "One of the most common real-world parsing bugs in LLM applications, and a good test of defensive thinking.",
      "simple": "You asked the model for JSON. It replied with a friendly sentence, then the JSON wrapped in a markdown code fence. `json.loads` fails on that.\n\nSo write a parser that accepts what models really send. Try the cheap options first.\n\nStep one: try `json.loads` on the whole text. Often it just works.\n\nStep two: look for a fenced block with a regex and parse what is inside. Use the `re.DOTALL` flag, so the dot also matches newlines, because the JSON spans several lines.\n\nStep three: take everything from the first `{` to the last `}`. Use `rfind` for the closing brace, so nested objects are not cut short.\n\nIf all three fail, raise an error that includes the start of the raw text. Without it, you are debugging blind.\n\nThe senior point: this is a safety net, not the fix. The real fix is structured output, where the provider forces the reply to match a JSON schema. But keep the parser anyway. Providers change behaviour, and a clear error beats a crash at 3 a.m. After parsing, validate the fields with Pydantic, because parsed does not mean correct.",
      "code": "import json, re\n\n# What the model actually sent:\n#   Sure! Here is the JSON you asked for:\n#   ```json\n#   {\"name\": \"Priya\", \"score\": 8}\n#   ```\n\nFENCE = re.compile(r\"```(?:json)?\\s*(.*?)```\", re.DOTALL)\n\ndef parse_json(text):\n    try:\n        return json.loads(text)              # happy path first\n    except json.JSONDecodeError:\n        pass\n    m = FENCE.search(text)\n    if m:\n        return json.loads(m.group(1).strip())\n    start, end = text.find(\"{\"), text.rfind(\"}\")\n    if start != -1 and end > start:\n        return json.loads(text[start:end + 1])\n    raise ValueError(f\"no JSON found in: {text[:200]!r}\")",
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
      "follow": "It parses now but a required field is missing. Where does that get caught?",
      "followAnswer": "In schema validation, straight after parsing. I load the parsed dict into a Pydantic model, so a missing or wrongly typed field raises a ValidationError that names exactly which fields failed. I send that error back to the model as one bounded retry. If it still fails, I log the raw output and return a clear fallback, instead of passing half-filled data downstream."
    },
    {
      "id": "py-14",
      "q": "Implement a function that batches API calls with a concurrency limit.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "python",
        "async",
        "concurrency",
        "coding"
      ],
      "why": "The most realistic async task for this role, and the semaphore is the point.",
      "simple": "You have ten thousand documents to embed. Sending all ten thousand requests at once hits the rate limit and may run out of connections. Sending them one at a time takes hours. You want a fixed number in flight.\n\nAn `asyncio.Semaphore` does this. It is a counter with a waiting line. With a limit of eight, eight tasks get in. The ninth waits at `async with sem` until one finishes.\n\nNote what the semaphore limits. All ten thousand tasks are still created up front; only eight run their request at a time. For millions of items, feed a fixed pool of workers from a queue instead (see py-27).\n\n`return_exceptions=True` is the production detail. Without it, the first error is raised out of `gather` and you lose all the results. The other tasks keep running in the background, because `gather` does not cancel them. With it, errors come back as values in the result list. So you keep the successes and retry the failures.\n\n`asyncio.TaskGroup` (Python 3.11+) works the other way. On the first failure it cancels the rest. That is right for all-or-nothing work and wrong for a bulk job like this.\n\n`gather` returns results in input order, so you can zip them back to the inputs.",
      "code": "import asyncio\n\nasync def map_bounded(items, fn, limit=8):\n    sem = asyncio.Semaphore(limit)\n\n    async def run(item):\n        async with sem:                    # at most `limit` in here\n            return await fn(item)\n\n    return await asyncio.gather(\n        *(run(i) for i in items),\n        return_exceptions=True,            # one failure must not lose the rest\n    )\n\n# usage, inside an async function\nresults = await map_bounded(docs, embed)\nok = [r for r in results if not isinstance(r, Exception)]\nfailed = [d for d, r in zip(docs, results) if isinstance(r, Exception)]",
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
      "follow": "Half the batch failed with 429s. What now?",
      "followAnswer": "Half failing means my limit is above what the provider will accept, so retrying at the same rate just fails again. I lower concurrency, or add a token bucket sized to requests and tokens per minute. Then I retry only the failed items, with exponential backoff and jitter that honours Retry-After, and I log the 429 rate. For large offline jobs I use the provider's batch API instead."
    },
    {
      "id": "py-04",
      "q": "Write a retry wrapper for a model call. What does it need?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "python",
        "reliability",
        "retries",
        "coding"
      ],
      "why": "A very common live-coding task, and most candidates miss two of the four requirements.",
      "simple": "A safe retry wrapper needs four things.\n\nOne: retry only temporary failures. That means rate limits (HTTP 429), timeouts, dropped connections and some 5xx server errors. A bad request, a failed login or a policy refusal will fail the same way again, so fail fast.\n\nTwo: wait between attempts, and wait longer each time. This is exponential backoff. Add jitter, a small random extra wait, so many clients do not all retry at the same moment. If the server sends a `Retry-After` header, obey it.\n\nThree: cap both the number of attempts and the total time. A user waiting on a chat reply will not wait a minute for retries.\n\nFour: make repeats safe. If the call creates something, like a ticket or a payment, use an idempotency key. That is a unique id that lets the server spot and ignore a duplicate. Log every retry too; a rising retry rate is an early warning.\n\nOne SDK trap. The official OpenAI and Anthropic Python clients already retry connection errors, timeouts, 429s and 5xx errors, twice by default (`max_retries`). Set `max_retries=0` or count them. Otherwise your three attempts quietly become up to nine calls.\n\nIn production I use a tested library such as tenacity, but I can explain what it does.",
      "code": "import asyncio, logging, random, time\nfrom openai import APIConnectionError, InternalServerError, RateLimitError\n# (the anthropic SDK has the same names; APITimeoutError subclasses APIConnectionError)\n\nlog = logging.getLogger(__name__)\nRETRYABLE = (RateLimitError, APIConnectionError, InternalServerError)\n\ndef retry_after_seconds(e):\n    response = getattr(e, \"response\", None)\n    value = response.headers.get(\"retry-after\") if response is not None else None\n    try:\n        return float(value)\n    except (TypeError, ValueError):\n        return None        # absent, or an HTTP-date this sketch does not parse\n\nasync def call(prompt, attempts=3, deadline=20.0):\n    started = time.monotonic()\n    for i in range(attempts):\n        try:\n            return await llm.ainvoke(prompt)\n        except RETRYABLE as e:\n            elapsed = time.monotonic() - started\n            retry_after = retry_after_seconds(e)\n            fallback = min(2 ** i, 8) + random.uniform(0, 1)\n            wait = retry_after if retry_after is not None else fallback\n            if i == attempts - 1 or elapsed + wait > deadline:\n                raise\n            log.info(\"retrying attempt=%s wait=%.2fs\", i + 1, wait)\n            await asyncio.sleep(wait)\n        # permanent errors are not caught and fail immediately",
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
      "follow": "The provider is down for ten minutes. Does your wrapper help or hurt?",
      "followAnswer": "It hurts if nothing else changes. Every request burns its full retry budget, users wait longer for the same failure, and the retries add load to a service that is already struggling. So I add a circuit breaker: after a run of failures it stops calling the provider for a cool-down and fails fast, or routes to a fallback model or provider. Retries handle blips; circuit breakers handle outages."
    },
    {
      "id": "py-05",
      "q": "How do you test code that calls an LLM?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "python",
        "testing",
        "mocking"
      ],
      "why": "It reveals whether your GenAI code is production code or notebook code.",
      "simple": "Only the model call is unpredictable. Everything around it is normal code, so test that part like normal code.\n\nStart with the design. Put the model call behind a small interface, like a `complete(prompt)` method. In tests, swap in a fake that returns a fixed reply. Now prompt building, parsing, validation, routing and stop conditions are all deterministic. Deterministic means the same input always gives the same output. These tests run in milliseconds and need no API key. They are most of your suite.\n\nNext, test the failure paths on purpose. A fake makes this easy. Return malformed JSON, a cut-off reply, a rate-limit error, an empty search result, or a tool that raises. This is where production breaks.\n\nThen keep a small integration suite that calls a real model. Check structure, not wording. Does it parse? Are the required fields there? Is it in the right language? Never assert on exact text.\n\nFinally, keep evaluation separate from testing. An eval is a quality score you track over time, such as accuracy on a labelled set. A test is pass or fail. Mixing them gives a flaky suite that people learn to ignore.",
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
      "follow": "Your fake returns valid JSON. What bug does that hide?",
      "followAnswer": "It hides every parsing and recovery bug. Real models sometimes return fenced JSON, prose around the JSON, output cut off at the token limit, or a missing field. If the fake is always perfect, the error-handling code never runs in tests. So I keep fixtures of realistic bad outputs, ideally copied from production logs, and test that each one is handled."
    },
    {
      "id": "py-20",
      "q": "Write a FastAPI endpoint that streams an LLM response.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "python",
        "fastapi",
        "streaming",
        "coding"
      ],
      "why": "The most realistic take-home task in this market - it is the actual shape of the job.",
      "simple": "Streaming sends the answer to the browser token by token, instead of waiting for the full reply. The user sees text in a few hundred milliseconds instead of several seconds.\n\nServer-Sent Events (SSE) is the usual format. It is a simple one-way stream from server to browser over normal HTTP. Each event is a few text lines, like `event: token` and `data: {...}`, then a blank line.\n\nFastAPI 0.135 (March 2026) added native SSE. Set `response_class=EventSourceResponse` and `yield` `ServerSentEvent` objects from the endpoint. FastAPI then handles the event format, the streaming headers and keep-alive pings. Pings stop proxies from closing a quiet connection. It also JSON-encodes the `data` field for you. Use `raw_data` for a plain string, like a `[DONE]` marker. On older versions you use `StreamingResponse` and write the `data:` lines yourself.\n\nThree production details matter more than the syntax.\n\nCancellation: if the user closes the tab, stop the upstream model call, so you do not pay for tokens nobody reads.\n\nErrors: once streaming has started, you cannot switch to a normal 500 response. Send a typed error event the client understands, or close the stream.\n\nSafety: tokens already sent cannot be taken back. High-risk apps may buffer and check small chunks before sending them.",
      "code": "import asyncio\nfrom collections.abc import AsyncIterable\nfrom fastapi import FastAPI\nfrom fastapi.sse import EventSourceResponse, ServerSentEvent\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass ChatRequest(BaseModel):\n    message: str\n\n@app.post(\"/chat\", response_class=EventSourceResponse)\nasync def chat(req: ChatRequest) -> AsyncIterable[ServerSentEvent]:\n    try:\n        async for chunk in llm.astream(req.message):\n            yield ServerSentEvent(event=\"token\", data={\"text\": chunk.content})\n        yield ServerSentEvent(event=\"done\", raw_data=\"[DONE]\")\n    except asyncio.CancelledError:\n        # client disconnected: release/cancel upstream work if needed\n        raise",
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
      "follow": "How do you run an output guardrail on a response you are already streaming?",
      "followAnswer": "I buffer a small window - a sentence or a few dozen tokens - run the check on it, and release it only if it passes. That adds a little latency but keeps unsafe text off the screen. For lower-risk apps I stream straight away and run the check alongside, then stop the stream and replace the message if it fails. The choice depends on how bad one leaked sentence would be."
    },
    {
      "id": "py-08",
      "q": "Implement top-k retrieval over a matrix of embeddings.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "python",
        "numpy",
        "retrieval",
        "coding"
      ],
      "why": "Whether you know that sorting everything to take five results is the wrong complexity.",
      "simple": "You have similarity scores for a million documents and want the best five. The obvious move is to sort everything and take the top. It works, but it does far more work than needed.\n\nA full sort is O(n log n), and it orders all million scores when you need five. `np.argpartition` does a partial selection in O(n). It moves the k largest values to the front, in no particular order, without sorting the rest. Then you sort just those k, which costs almost nothing.\n\nThree small details. NumPy partitions in ascending order, so negate the scores to get the largest. Clamp k to the array length, because a new index can hold fewer than k items and argpartition raises an error. And remember this is still a full scan of every score.\n\nAt real scale, an approximate nearest-neighbour (ANN) index does this job for you. It finds close vectors without scoring every one.",
      "code": "import numpy as np\n\ndef top_k(scores, k=5):\n    k = min(k, len(scores))\n    if k == 0:\n        return np.array([], dtype=int)\n    idx = np.argpartition(-scores, k - 1)[:k]    # O(n), unordered\n    return idx[np.argsort(-scores[idx])]         # sort only the k",
      "points": [
        "argpartition is O(n); a full sort is O(n log n).",
        "Partition first, then sort only the k survivors.",
        "Negate the scores because NumPy works ascending.",
        "Clamp k to the array length - a small corpus otherwise raises.",
        "At real scale this is what the ANN index does for you."
      ],
      "say": "I would use argpartition rather than a sort. Partitioning is linear and puts the k best at the front without ordering the rest, then I sort just those k, which is negligible. I negate because NumPy partitions ascending, and I clamp k to the array length so a corpus smaller than k does not raise. Beyond a few million rows I stop doing this in NumPy and use an ANN index.",
      "numbers": "On a million scores, argpartition plus a sort of the top k was roughly 5-10x faster than a full argsort in a quick NumPy check. Past a few million vectors, or once the exact scan misses your latency budget, move to an ANN index such as HNSW rather than tuning this.",
      "wrong": "np.argsort(scores)[-k:] with a comment saying it is fine. It works and it is the answer of someone who has not thought about the cost per query at a thousand queries a second.",
      "follow": "Where does this break down, and what would you replace it with?",
      "followAnswer": "It is still a linear scan: every query scores every vector, so latency grows with the corpus and memory must hold the whole matrix. Past a few million vectors, or when p95 misses the budget, I replace it with an ANN index like HNSW, or IVF with quantisation, through FAISS or a vector database. I compare it with exact search to measure the recall I give up."
    },
    {
      "id": "py-12",
      "q": "Write a decorator that logs latency and token usage for any LLM call.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "decorators",
        "observability",
        "coding"
      ],
      "why": "Two things in one card: whether you can write a real decorator, and whether you know what is worth measuring.",
      "simple": "A decorator wraps a function, so you can run code before and after it without editing the function. For LLM calls that is ideal. You want every call measured, without pasting timing code into forty places.\n\nThree details separate a real answer from a textbook one.\n\n`functools.wraps` copies the original function's name and docstring onto the wrapper. Without it, every function in your traces is called `wrapper`.\n\n`time.perf_counter` is the right clock for timing. It is monotonic, meaning it never jumps backwards when the system clock is corrected. `time.time` can.\n\nLog in a `finally` block, so failed calls are measured too. Errors are the calls you most want latency on. And re-raise the exception. An observability decorator that swallows errors hides real failures.\n\nToken counts come from the SDK response object, but the field names differ. Anthropic and the OpenAI Responses API use `input_tokens` and `output_tokens`. OpenAI Chat Completions uses `prompt_tokens` and `completion_tokens`. Map them to one log schema.\n\nFor async functions, you need an `async def` wrapper that awaits the call. A normal wrapper would only time creating the coroutine, which is almost zero.",
      "code": "import functools, time, logging\n\nlog = logging.getLogger(__name__)\n\ndef observed(fn):\n    @functools.wraps(fn)               # keeps __name__ and the docstring\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        status, usage = \"ok\", None\n        try:\n            result = fn(*args, **kwargs)\n            usage = getattr(result, \"usage\", None)   # token counts\n            return result\n        except Exception:\n            status = \"error\"\n            raise                      # measure it, do not swallow it\n        finally:\n            log.info(\"llm_call\", extra={\n                \"fn\": fn.__name__,\n                \"ms\": round((time.perf_counter() - start) * 1000),\n                \"status\": status,\n                \"input_tokens\": getattr(usage, \"input_tokens\", None),\n                \"output_tokens\": getattr(usage, \"output_tokens\", None),\n            })\n    return wrapper",
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
      "follow": "The function is async. What changes?",
      "followAnswer": "The wrapper must be async def and await the call inside the try. Otherwise it only times creating the coroutine, which is close to zero. Everything else stays the same: functools.wraps, perf_counter, logging in finally. If I want one decorator for both kinds, I check inspect.iscoroutinefunction when decorating and return the matching wrapper. For streaming calls I also log time to first token."
    },
    {
      "id": "py-10",
      "q": "Implement exponential backoff with jitter from scratch.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "python",
        "reliability",
        "retry",
        "coding"
      ],
      "why": "Everyone says they use a retry library. This checks whether you know what it is doing and why jitter exists.",
      "simple": "Retrying straight away against a rate-limited API just burns your quota faster. So you wait, and double the wait each time: one second, two, four, eight. That is exponential backoff. A cap stops the wait growing forever.\n\nJitter is the part candidates miss. Picture a hundred workers, all rate-limited at the same moment. Without jitter, they all wait exactly two seconds, then all retry in the same millisecond. You have rebuilt the traffic spike that caused the problem. Jitter adds randomness to each wait, so the retries spread out. \"Full jitter\" picks a random wait between zero and the current backoff limit.\n\nKnow what to retry. A 429 (rate limit) or a 503 (service unavailable) is worth retrying. A 400 means your request is malformed, and it will stay malformed.\n\nIf the server sends a `Retry-After` header, obey it. The server knows more than your formula.\n\nFinally, cap the total time as well as the number of attempts. The code checks a deadline before each sleep.\n\nFor the rest of the policy, such as idempotency, logging and the SDK's own retries, see py-04.",
      "code": "import random, time\n\ndef backoff(attempt, base=1.0, cap=60.0):\n    window = min(cap, base * (2 ** attempt))\n    return random.uniform(0, window)          # full jitter\n\ndef call_with_retry(fn, retries=5, deadline=30.0):\n    start = time.monotonic()\n    for attempt in range(retries):\n        try:\n            return fn()\n        except (RateLimited, ServerError) as e:   # 429 and 5xx only\n            wait = getattr(e, \"retry_after\", None) or backoff(attempt)\n            out_of_time = time.monotonic() - start + wait > deadline\n            if attempt == retries - 1 or out_of_time:\n                raise\n            time.sleep(wait)\n        # anything else - 400, 401, validation errors - propagates at once",
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
      "follow": "Your retries now exceed the user's timeout. What gives?",
      "followAnswer": "The retry budget has to fit inside the user's timeout. So I pass a deadline down from the request and stop retrying when the next wait would cross it. Interactive calls get fewer attempts, then a fast, clear failure or a fallback model. Long retries belong in background jobs, where nobody is waiting. A retry that succeeds after the user has left is wasted spend."
    },
    {
      "id": "py-18",
      "q": "Mock an LLM API in pytest and test the retry path.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "testing",
        "pytest",
        "coding"
      ],
      "why": "Whether you can test code whose dependency is slow, costly and non-deterministic.",
      "simple": "You cannot call a real model in unit tests. It costs money, it is slow, and the output changes every run, so you cannot assert on it exactly.\n\nSo test your code, not the model. Your retry logic, parsing and fallbacks are fully deterministic once the API is replaced by a mock. A mock is a fake object that records how it was called and returns whatever you script.\n\nThe key tool is `side_effect` with a list. Each call takes the next item. If the item is an exception, the mock raises it. So you can script exactly: two rate limits, then a success.\n\nAssert the call count as well as the result. The count is what proves the retry happened.\n\nPatch `time.sleep`, so the test does not really wait out the backoff. Patch the name where your code looks it up. `patch(\"time.sleep\")` works if your code calls `time.sleep`. After `from time import sleep`, you must patch `yourmodule.sleep`.\n\nThe second test is the one candidates forget. Check that a 400 is not retried. A retry loop on a bad request just burns quota.\n\nThe tests assume a `summarise(client, text)` function built on the py-10 retry loop.",
      "code": "import pytest\nfrom unittest.mock import Mock, patch\n\ndef test_retries_then_succeeds():\n    client = Mock()\n    client.complete.side_effect = [\n        RateLimited(\"429\"),\n        RateLimited(\"429\"),\n        Mock(text='{\"ok\": true}'),\n    ]\n    with patch(\"time.sleep\"):              # do not actually wait\n        result = summarise(client, \"hello\")\n    assert result == {\"ok\": True}\n    assert client.complete.call_count == 3\n\ndef test_does_not_retry_bad_request():\n    client = Mock()\n    client.complete.side_effect = BadRequest(\"400\")\n    with pytest.raises(BadRequest):\n        summarise(client, \"hello\")\n    assert client.complete.call_count == 1",
      "points": [
        "side_effect with a list scripts an exact failure sequence.",
        "Patch sleep, or your suite waits out the real backoff.",
        "Assert call_count - it is how you prove retry behaviour.",
        "Test the negative case: 400 must not be retried.",
        "Keep a small live smoke test outside CI for real behaviour."
      ],
      "say": "I mock the client and use side_effect with a list to script the exact sequence - two rate limits then a success - and assert both the result and the call count, which proves the retry ran. I patch sleep so the suite does not wait out the backoff. I always add the negative test that a 400 is not retried, since retrying a malformed request just burns quota. Real model behaviour belongs in evals.",
      "numbers": "Unit tests should run in seconds. Anything model-dependent goes in the eval suite, which runs on a schedule rather than on every commit.",
      "wrong": "Calling the real API in CI and asserting on the text. It is slow, it costs money, and it fails randomly, so the team learns to ignore red builds.",
      "follow": "How do you test that the prompt itself is any good?",
      "followAnswer": "Not with unit tests - with an eval. I build a labelled set of realistic inputs, including hard cases from production, and score each prompt version on it: exact checks where possible, an LLM judge with a clear rubric where not. I compare versions on the same set, run it on every prompt change, and read the failures by hand, not just the average score."
    },
    {
      "id": "py-23",
      "q": "Write a Pydantic model with a custom validator for an LLM output schema.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "python",
        "pydantic",
        "validation",
        "coding"
      ],
      "why": "Structured output is only as good as the validation behind it, and the semantic checks are where candidates stop early.",
      "simple": "Valid shape is not the same as correct. A model can return perfect JSON with a confidence of 3.7 and a citation to a document you never retrieved.\n\nPydantic gives you three layers of checks.\n\nField constraints handle cheap structural rules: number ranges with `ge` and `le`, string lengths, and fixed choices with `Literal`.\n\nA `field_validator` adds a meaning check on one field. The valuable one here checks each citation against the ids you actually retrieved. That catches an invented source. It does not catch a real source cited for a claim it does not support; that needs a faithfulness check. The retrieved ids arrive through validation context: `Answer.model_validate_json(raw, context={\"retrieved_ids\": ids})`. With no context, the check fails closed and rejects every citation.\n\nA `model_validator(mode=\"after\")` runs once the whole object is built. So it can check rules across fields, such as \"a high-confidence answer must cite something\".\n\nWhen validation fails, send the error message back to the model as a retry. Models usually fix their output when told exactly what was wrong. Cap it at one or two retries.",
      "code": "from typing import Literal\nfrom pydantic import BaseModel, Field, field_validator, model_validator\n\nclass Answer(BaseModel):\n    text: str = Field(min_length=1)\n    confidence: float = Field(ge=0.0, le=1.0)\n    citations: list[str] = Field(default_factory=list)\n    sentiment: Literal[\"positive\", \"neutral\", \"negative\"]\n\n    @field_validator(\"citations\")\n    @classmethod\n    def known_docs(cls, v, info):\n        allowed = (info.context or {}).get(\"retrieved_ids\", set())\n        unknown = [c for c in v if c not in allowed]\n        if unknown:\n            raise ValueError(f\"cited documents not retrieved: {unknown}\")\n        return v\n\n    @model_validator(mode=\"after\")\n    def confident_answers_cite(self):\n        if self.confidence > 0.8 and not self.citations:\n            raise ValueError(\"high confidence requires a citation\")\n        return self\n\n# answer = Answer.model_validate_json(raw, context={\"retrieved_ids\": ids})",
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
      "id": "py-15",
      "q": "Parse streaming SSE output from an LLM API.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "streaming",
        "parsing",
        "coding"
      ],
      "why": "Practical and discriminating - the partial-chunk problem catches most candidates.",
      "simple": "Streaming replies arrive as server-sent events. In the OpenAI-style format, each line starts with `data:` and carries one JSON object. The stream ends with `data: [DONE]`.\n\nThe trap: the network does not respect your line breaks. One chunk off the socket can end halfway through a line. So you cannot parse chunk by chunk. Keep a buffer. Add each chunk to it, parse only complete lines, and leave the unfinished tail for the next chunk. That one pattern is most of the answer.\n\nFour real-world details. Treat `[DONE]` as the end signal, not as JSON. Use `.get(\"content\")`, because the first delta often carries only the role. Skip events with an empty `choices` list; with usage reporting switched on, the final chunk carries only token usage. And decode UTF-8 incrementally. One character, like an emoji or a Hindi letter, can be split across two reads, and decoding each chunk alone corrupts it.\n\nOther providers differ. Anthropic's Messages stream uses named `event:` lines with different payloads. In production the provider SDK parses the stream for you. The exercise shows you know what it handles.",
      "code": "import codecs, json\n\nasync def stream(response):\n    decoder = codecs.getincrementaldecoder(\"utf-8\")()\n    buffer = \"\"\n    async for raw in response.aiter_bytes():\n        buffer += decoder.decode(raw)     # holds back a split character\n        while \"\\n\" in buffer:\n            line, buffer = buffer.split(\"\\n\", 1)\n            line = line.strip()\n            if not line.startswith(\"data:\"):\n                continue\n            payload = line[5:].strip()\n            if payload == \"[DONE]\":\n                return\n            try:\n                event = json.loads(payload)\n            except json.JSONDecodeError:\n                continue              # malformed line: skip, do not crash\n            choices = event.get(\"choices\") or []\n            if not choices:           # e.g. the final usage-only chunk\n                continue\n            text = choices[0].get(\"delta\", {}).get(\"content\")\n            if text:\n                yield text",
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
      "priority": "medium",
      "tags": [
        "python",
        "context",
        "tokens",
        "coding"
      ],
      "why": "Applies the context-window topic to code, and the system-message detail is the tell.",
      "simple": "A conversation keeps growing until it no longer fits the context window. You need to drop old turns while keeping the request valid.\n\nThree things are being tested.\n\nPin the system message. If you trim it away, the model forgets its instructions. This is the most common bug in home-grown memory code. It shows up as \"the model stopped following the system prompt after twenty turns\".\n\nWalk backwards from the newest message, adding turns until the next one would go over budget. Recent turns matter most in a conversation.\n\nDo not start the kept history mid-pair. If the oldest kept message is an assistant reply or a tool result, its question or tool call is gone. That history is confusing, and some APIs reject it. So drop leading messages until the history starts with a user turn.\n\nThe budget is not the full context window. It is the window minus the space you reserve for the answer, minus a small safety margin. And count with the model's real tokeniser, not characters divided by four.",
      "code": "def trim(messages, budget, count):\n    system = [m for m in messages if m[\"role\"] == \"system\"]\n    rest = [m for m in messages if m[\"role\"] != \"system\"]\n\n    used = sum(count(m) for m in system)\n    kept = []\n    for m in reversed(rest):              # newest first\n        c = count(m)\n        if used + c > budget:\n            break\n        kept.append(m)\n        used += c\n    kept.reverse()\n\n    while kept and kept[0][\"role\"] != \"user\":\n        kept.pop(0)                       # no orphaned reply or tool result\n    return system + kept",
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
      "follow": "The user refers to something from turn three, which you dropped. Now what?",
      "followAnswer": "Dropping loses it, so I stop dropping blindly. Older turns get folded into a running summary that stays pinned after the system message. I also keep the full history outside the prompt, so I can search it and pull back the relevant old turn when the user refers to it. Key facts, like names or decisions, can go into a small structured memory. Then I test with long conversations that refer back."
    },
    {
      "id": "py-06",
      "q": "Live task: build a concurrent document ingestion pipeline.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "coding",
        "pipeline",
        "concurrency"
      ],
      "why": "A representative hands-on task. What is being marked is error handling and bounded concurrency, not the happy path.",
      "simple": "Before coding, state the requirements. Do not load the whole corpus into memory. Do not let one bad document kill the run. Keep concurrency bounded. Make reruns safe.\n\nThen build it in steps. Stream documents in and make chunks lazily with a generator. Group chunks into batches for the embedding API. Run a small window of batches at the same time. That gives parallel I/O without creating thousands of tasks at once.\n\nEach batch catches its own error and records the failed ids for a later retry. Writes are upserts with stable ids. An upsert updates a row if the id exists and inserts it if not. So a rerun updates the same chunks instead of duplicating them.\n\nTwo common mistakes. First, a semaphore around a function, but each batch still awaited in a plain `for` loop. It looks concurrent but runs one batch at a time. Second, one giant `gather` over the whole corpus. That creates too many tasks and hits rate limits.\n\nThe window version in the code is simple, but each window waits for its slowest batch. A fixed pool of workers pulling from a bounded queue (py-27) keeps every slot busy. For long production jobs, save checkpoints or use a job queue, so a restart resumes instead of starting over.",
      "code": "async def ingest(paths, batch_size=100, concurrency=8):\n    sem = asyncio.Semaphore(concurrency)\n    failed = []\n\n    async def process(group):\n        async with sem:\n            try:\n                vectors = await embedder.aembed([c.text for c in group])\n                await store.upsert([\n                    (c.stable_id, v, c.metadata)\n                    for c, v in zip(group, vectors)\n                ])\n            except Exception:\n                log.exception(\"embedding batch failed\")\n                failed.extend(c.stable_id for c in group)\n\n    groups = batched(chunks(paths), batch_size)     # generators from py-02\n    # windowed: each window waits for its slowest batch. A fixed pool of\n    # workers pulling from a bounded queue (see py-27) keeps every slot busy.\n    for window in batched(groups, concurrency):\n        await asyncio.gather(*(process(group) for group in window))\n\n    return failed",
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
      "follow": "The run died at 60%. What happens when you restart it?",
      "followAnswer": "Because upserts use stable chunk ids, a full rerun is safe - it just repeats work. To avoid that, I save a checkpoint of finished document ids, or content hashes, and skip those on restart. Failed batches were recorded separately, so I retry only them. For big jobs I use a durable queue, so each document is acknowledged only after its vectors are written."
    },
    {
      "id": "py-27",
      "q": "Write an async pipeline where stage two starts before stage one finishes.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "async",
        "pipeline",
        "coding"
      ],
      "why": "Producer-consumer with a queue. Tests whether you can overlap stages instead of batching them.",
      "simple": "The naive version chunks all ten thousand documents first, then embeds them all. The embedder sits idle during chunking, and every chunk sits in memory.\n\nBetter: start embedding the first chunks while chunking is still running. Put a queue between the two stages. A producer puts chunks in. Several consumers take them out and embed them.\n\nTwo design points carry this answer.\n\nThe queue is bounded, and that is deliberate. It gives backpressure: if embedding is slower than chunking, the producer waits at `put` instead of filling memory. Memory stays flat, whatever the corpus size. An unbounded queue is a memory leak with extra steps.\n\nSend one stop marker, called a sentinel, per consumer. Each consumer takes exactly one and exits. Send only one and the other seven wait forever. The sentinels go out in a `finally` block, so a chunking failure still releases the consumers.\n\nEach consumer also catches its own errors. Otherwise one bad chunk kills a worker and fails the whole `gather`.\n\nAn alternative to sentinels is `queue.join()` with `task_done()`, then cancelling the workers. Python 3.13 also added `Queue.shutdown()` for this.",
      "code": "async def pipeline(docs, limit=8, queue_size=100):\n    q = asyncio.Queue(maxsize=queue_size)      # bounded = backpressure\n    DONE = object()\n\n    async def producer():\n        try:\n            for doc in docs:\n                for c in chunk(doc):\n                    await q.put(c)             # waits when full\n        finally:                               # even if chunking fails\n            for _ in range(limit):\n                await q.put(DONE)              # one sentinel per consumer\n\n    results = []\n    async def consumer():\n        while True:\n            item = await q.get()\n            if item is DONE:\n                return\n            try:\n                results.append(await embed(item))\n            except Exception:\n                log.exception(\"embed failed\")  # record it, keep consuming\n\n    await asyncio.gather(producer(),\n                         *(consumer() for _ in range(limit)))\n    return results",
      "points": [
        "Bounded queue gives backpressure and flat memory.",
        "One sentinel per consumer, or the rest hang.",
        "Consumers must catch their own exceptions, or one bad chunk kills a worker and fails the whole gather.",
        "Overlapping stages beats batching whenever both are non-trivial.",
        "`queue.join()` with `task_done()`, or `Queue.shutdown()` on 3.13+, are alternatives to sentinels."
      ],
      "say": "I put a bounded asyncio.Queue between the stages so consumers start while the producer is still working. Bounded is the important word - it gives backpressure, so if embedding is slower than chunking the producer blocks instead of loading the whole corpus into memory. I send one sentinel per consumer so they all terminate, and each consumer catches its own exceptions so a single bad chunk does not kill a worker.",
      "numbers": "Queue size around 100 and eight consumers is a reasonable start. Watch queue depth - persistently full means the consumer is the bottleneck.",
      "wrong": "An unbounded queue. It runs fine on a hundred documents and exhausts memory on the real corpus, because the producer always outruns the network-bound consumer.",
      "follow": "The queue is always full. What does that tell you, and what do you do?",
      "followAnswer": "A queue that is always full means the consumers are the bottleneck - here, embedding. Backpressure is doing its job, so memory is safe. To go faster I add consumers, if the provider's rate limit has headroom, or send bigger embedding batches per request. If I am already at the rate limit, the queue staying full is simply the correct steady state."
    },
    {
      "id": "py-21",
      "q": "Debug this code - it deadlocks under concurrency.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "async",
        "debugging",
        "coding"
      ],
      "why": "A debugging round, not a writing round. Reading broken concurrent code is a different and rarer skill.",
      "simple": "The first class in the code works in tests and hangs in production.\n\nThe bug: `asyncio.Lock` is not reentrant. Reentrant means the holder can take the same lock again. `get_or_fetch` holds the lock, then calls `fetch`, which tries to take the same lock. It waits for a lock held by its own caller, and its caller waits for it. Nothing moves, forever.\n\nWhy tests pass: a warm-cache request returns before it ever reaches `fetch`. The hang needs a cache miss.\n\nThere is a second, quieter bug. Holding a lock across a slow `await` on an API makes every caller queue. A hundred requests for a hundred different keys run one after another. The lock should protect the dictionary, not the network call.\n\nThe fix: take the lock to check the cache, release it, fetch without the lock, then take the lock again to store the result. `setdefault` handles the race where two callers miss at the same time. Both fetch, the first stored value wins, and both return the same object.\n\nIf duplicate fetches are expensive, store an in-flight future per key, so later callers await the first fetch.",
      "code": "import asyncio\n\n# Broken: hangs on the first cache miss\nclass Cache:\n    def __init__(self):\n        self.lock = asyncio.Lock()\n        self.data = {}\n\n    async def get_or_fetch(self, key):\n        async with self.lock:\n            if key in self.data:\n                return self.data[key]\n            value = await self.fetch(key)      # slow API call\n            self.data[key] = value\n            return value\n\n    async def fetch(self, key):\n        async with self.lock:                  # <-- same lock again\n            return await call_api(key)\n\n# Fixed: lock the dictionary, not the network call\nclass FixedCache:\n    def __init__(self):\n        self.lock = asyncio.Lock()\n        self.data = {}\n\n    async def get_or_fetch(self, key):\n        async with self.lock:\n            if key in self.data:\n                return self.data[key]\n        value = await call_api(key)            # no lock held here\n        async with self.lock:\n            return self.data.setdefault(key, value)",
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
      "follow": "Two requests miss the cache for the same key at once. What happens in your version?",
      "followAnswer": "Both see a miss, both release the lock and both call the API, so we pay for one duplicate fetch. When they store the result, setdefault keeps the first value, so both callers get the same object and the cache stays consistent. If duplicate calls are expensive, I store an in-flight future per key, so the second caller awaits the first fetch instead of starting its own."
    },
    {
      "id": "py-24",
      "q": "Implement an LRU cache without functools.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "python",
        "data-structures",
        "caching",
        "coding"
      ],
      "why": "A classic that still appears, and the O(1) requirement is the actual question.",
      "simple": "An LRU cache keeps the most recent N results and evicts the least recently used one when it is full. The real requirement is that both get and put run in O(1), constant time.\n\nIn Python, `OrderedDict` gives you that directly. It remembers order and can move a key to the end in constant time. So the end holds the newest items and the front holds the oldest.\n\nOn get, move the key to the end to mark it as recently used. On put, move an existing key to the end too. Assigning to an existing key keeps its old position, so without the move, eviction picks the wrong victim. After inserting, if you are over capacity, pop from the front with `popitem(last=False)`.\n\nIf the interviewer bans `OrderedDict`, they want the structure underneath. That is a hash map for O(1) lookup plus a doubly linked list for O(1) reordering. The map points at list nodes. On each access you unlink the node and move it to the end.\n\nTwo notes. This class is not thread-safe. And `get` returns `None` for a miss, so a cached `None` looks like a miss; use a sentinel if that matters.",
      "code": "from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, capacity=128):\n        self.capacity = capacity\n        self.data = OrderedDict()\n\n    def get(self, key):\n        if key not in self.data:\n            return None\n        self.data.move_to_end(key)          # mark as recently used\n        return self.data[key]\n\n    def put(self, key, value):\n        if key in self.data:\n            self.data.move_to_end(key)\n        self.data[key] = value\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)   # evict oldest",
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
      "follow": "Two threads call put at the same time. What happens?",
      "followAnswer": "The individual dict operations are safe, but put is several steps, and two threads can interleave between them. Both insert, both see the cache over capacity, and it evicts twice - or one thread evicts a key the other is about to move, which raises a KeyError. I wrap get and put in a threading.Lock. Across processes or pods a local cache is not shared anyway, so there I use Redis."
    },
    {
      "id": "py-13",
      "q": "Implement a rate limiter - token bucket or sliding window.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "concurrency",
        "reliability",
        "coding"
      ],
      "why": "A common systems-flavoured coding question, and the follow-up on thread safety is the real test.",
      "simple": "You are allowed sixty requests a minute. Your code must never go over.\n\nThe token bucket is the standard answer. A bucket holds tokens. Each request takes one. Tokens refill at a steady rate. When the bucket is empty, you wait. It allows a short burst, because a full bucket can serve several requests at once, while holding the long-run average to the limit.\n\nA sliding window is the stricter option. It counts requests in the last sixty seconds and refuses when the count hits the limit. No burst goes above the limit.\n\nTwo details in the code are the real test.\n\nRefill lazily. Work out the new tokens from the time since the last call. No background timer thread is needed, and it stays correct after an idle hour.\n\nSleep outside the lock. Compute the wait while holding the lock, release it, then sleep. Sleeping while holding the lock blocks every other thread for the whole wait.\n\nUse `time.monotonic`, which never jumps when the system clock changes.\n\nAnd say the scaling limit. A local bucket limits only one process. With several pods, the bucket must live somewhere shared, such as Redis.",
      "code": "import time, threading\n\nclass TokenBucket:\n    def __init__(self, rate, capacity):\n        self.rate = rate               # tokens per second\n        self.capacity = capacity\n        self.tokens = float(capacity)\n        self.updated = time.monotonic()\n        self.lock = threading.Lock()\n\n    def acquire(self, n=1):\n        if n > self.capacity:          # could never be satisfied\n            raise ValueError(\"n exceeds bucket capacity\")\n        while True:\n            with self.lock:\n                now = time.monotonic()\n                self.tokens = min(\n                    self.capacity,\n                    self.tokens + (now - self.updated) * self.rate)\n                self.updated = now\n                if self.tokens >= n:\n                    self.tokens -= n\n                    return\n                deficit = (n - self.tokens) / self.rate\n            time.sleep(deficit)        # sleep OUTSIDE the lock",
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
      "follow": "You now run eight pods. What breaks?",
      "followAnswer": "Each pod has its own bucket, so together they can send up to eight times the limit, and the provider rate-limits all of them. I move the bucket to Redis and update it atomically, with a Lua script or a library that does this, so every pod draws from one shared count. A simpler option is giving each pod an eighth of the quota, but that wastes capacity when traffic is uneven."
    },
    {
      "id": "py-17",
      "q": "Implement reciprocal rank fusion to merge two ranked lists.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "retrieval",
        "hybrid-search",
        "coding"
      ],
      "why": "Short, elegant, and it proves you understand why hybrid search needs a merge step at all.",
      "simple": "Hybrid search gives you two ranked lists: one from vector search and one from keyword search (BM25). You must merge them. You cannot compare their scores directly, because cosine similarity and BM25 use completely different scales.\n\nReciprocal rank fusion (RRF) avoids the problem. It ignores the scores and uses only the positions.\n\nEach document gets 1 / (k + rank) from every list it appears in, and the parts add up. So a document ranked third in both lists beats one ranked first in only one list. That is the behaviour you want: two different methods agreeing is strong evidence.\n\nThe constant k, usually 60, flattens the curve at the top. Without it, rank 1 would count so much more than rank 2 that one list would dominate. With it, one retriever being confidently wrong does less damage.\n\nThat is the whole algorithm: a few lines, no score normalisation, and little tuning beyond k. It is a common default in hybrid search engines, though some engines use normalised score fusion instead.\n\nTo trust one list more, multiply its contribution by a weight.",
      "code": "from collections import defaultdict\n\ndef rrf(*lists, k=60):\n    scores = defaultdict(float)\n    for ranked in lists:\n        for rank, doc_id in enumerate(ranked, start=1):\n            scores[doc_id] += 1.0 / (k + rank)\n    return sorted(scores, key=scores.get, reverse=True)",
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
      "follow": "You trust the vector results more than BM25. How do you express that?",
      "followAnswer": "I use weighted RRF: multiply each list's contribution by a weight, for example 1.0 for vector and 0.5 for BM25, so the score is a weighted sum of one over k plus rank. I choose the weights on a labelled query set by measuring recall at k, not by feel. Some search engines expose this directly as a per-retriever weight."
    },
    {
      "id": "py-31",
      "q": "Write SQL to keep the latest model event for each request id.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "sql",
        "coding",
        "data",
        "window-functions"
      ],
      "why": "SQL and data handling appear in many senior AI/ML jobs even when the title says AI Engineer rather than Data Engineer.",
      "simple": "Use a window function. A window function computes a value across related rows without collapsing them into one. Here, `ROW_NUMBER()` numbers the events inside each request, newest first. Then you keep row 1.\n\n`GROUP BY` with `MAX(event_time)` is the tempting wrong answer. It gives you the latest time, but not the other columns from that same row.\n\nAdd a tie-breaker. Two events can share a timestamp. Without a second sort column, such as an increasing event id, the database may pick a different winner on each run.\n\nDecide what happens with nulls. PostgreSQL, Oracle and Snowflake sort NULLs first under `DESC`, so a row with a missing timestamp would win. `NULLS LAST` fixes that. MySQL and SQL Server already put NULLs last under `DESC`, but they do not accept the `NULLS LAST` keyword, so drop it there.\n\nIn production, select only the columns you need instead of `SELECT *`. If the table is large, ask about partitioning and indexes.\n\nThen test the awkward cases: null timestamps, duplicate timestamps, requests with one row, and late-arriving events. Those look fine on a toy sample and fail in a pipeline.",
      "code": "WITH ranked AS (\n    SELECT\n        request_id,\n        event_id,\n        event_time,\n        status,\n        output,\n        ROW_NUMBER() OVER (\n            PARTITION BY request_id\n            ORDER BY event_time DESC NULLS LAST, event_id DESC\n        ) AS rn\n    FROM model_events\n)\nSELECT request_id, event_id, event_time, status, output\nFROM ranked\nWHERE rn = 1;",
      "points": [
        "Use `ROW_NUMBER()` partitioned by the business key.",
        "Order newest first and include a deterministic tie-breaker.",
        "Decide NULL ordering explicitly - `NULLS LAST` where the dialect supports it.",
        "Snowflake, BigQuery, Databricks and DuckDB accept `QUALIFY rn = 1`, which removes the CTE.",
        "Test duplicate timestamps, nulls and late-arriving events.",
        "Ask about partitioning/indexing when the table is large."
      ],
      "say": "I use `ROW_NUMBER()` over each request id, ordered by event time descending, then keep row one. I add a stable tie-breaker such as event id because timestamps can collide, otherwise the result can change between runs. I select only the columns the pipeline needs and ask about table size, partitioning and indexes if this is on a hot path. I would test duplicate timestamps, nulls and late-arriving events rather than only the happy sample.",
      "numbers": "No fixed row count changes the SQL idea, but scale changes the physical design. Check the query plan on production-like data before assuming an index or partition strategy helps.",
      "wrong": "Using `MAX(event_time)` alone and then assuming the rest of the columns come from that same row. You need a deterministic way to select the whole winning row.",
      "follow": "A late event arrives tomorrow with an event_time from yesterday. Should it replace the row you kept, and how does that change the pipeline?",
      "followAnswer": "It depends on what 'latest' means for the business. If it means latest by event time, the late event should not replace a newer row, but the pipeline must still recheck that request, so I use incremental loads with a lookback window, or a MERGE keyed on request id. If it means latest received, I order by ingestion time instead. Either way, I write the rule down and test it."
    },
    {
      "id": "py-22",
      "q": "This retrieval function is O(n) per query. Make it faster.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "optimisation",
        "retrieval",
        "coding"
      ],
      "why": "An optimisation round with a stated target. The best answer questions the premise before micro-tuning.",
      "simple": "The starting code loops over two million documents in Python, scores each one, sorts everything and returns five. It also crashes on a tied score: the sort then compares two doc objects, which Python cannot do. `key=lambda t: t[0]` fixes that.\n\nWork through it in order of payoff.\n\nFirst, vectorise. The Python loop is the biggest cost. Stack the vectors into one matrix, normalise them when you store them, and scoring becomes one matrix-vector product. That is commonly a hundred times faster, with the same results.\n\nSecond, stop sorting everything. You want five results, not two million in order. `argpartition` is linear.\n\nThird, the real answer: it is still O(n) per query. Every query still touches every vector. Vectorising made each step cheap; it did not change the complexity.\n\nTo beat O(n) you need an index that does not look at everything. HNSW is a graph index that hops between close neighbours. It searches in roughly logarithmic time, for a small and tunable loss in recall. Recall here means the share of the true top results you actually get back.\n\nSay the trade-off honestly. Approximate search can miss a true neighbour. Tune the `ef` setting against a measured recall target, not by guessing.",
      "code": "import numpy as np\n\n# Before: Python loop + full sort (and a TypeError on a tied score)\ndef search(query_vec, docs, k=5):\n    scored = []\n    for doc in docs:                        # docs: 2 million\n        s = cosine(query_vec, doc.vector)\n        scored.append((s, doc))\n    scored.sort(reverse=True)\n    return scored[:k]\n\n# Steps 1-2: one matrix product + partial selection\n# M: (n, d) float32 matrix, rows normalised at write time\ndef search_fast(q, M, ids, k=5):\n    scores = M @ (q / np.linalg.norm(q))\n    k = min(k, len(scores))\n    idx = np.argpartition(-scores, k - 1)[:k]\n    idx = idx[np.argsort(-scores[idx])]\n    return [(ids[i], float(scores[i])) for i in idx]\n\n# Step 3: an ANN index to beat O(n)\nimport hnswlib\nindex = hnswlib.Index(space=\"cosine\", dim=768)\nindex.init_index(max_elements=2_000_000, ef_construction=200, M=16)\nindex.add_items(vectors, ids)                   # ids: integer labels\nindex.set_ef(64)                                # recall/latency knob\nlabels, distances = index.knn_query(query_vec, k=5)   # distance = 1 - cosine",
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
      "follow": "Recall dropped to 85% and the product team noticed. What do you change?",
      "followAnswer": "First I confirm it against exact search on a labelled query set, so I know the index is the cause, not the embeddings or the data. Then I raise ef at query time, which buys recall with latency, and check p95. If that is not enough, I rebuild with a higher M or ef_construction, or fetch more candidates and rerank them exactly. I pick the setting that meets both targets."
    },
    {
      "id": "py-28",
      "q": "Implement a token-aware chunker that never splits mid-sentence.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "python",
        "chunking",
        "rag",
        "coding"
      ],
      "why": "The harder chunker variant. Boundary logic plus the character-versus-token distinction.",
      "simple": "Character chunking cuts sentences in half. Half a sentence has a muddled meaning, so it embeds badly. And characters are the wrong unit anyway, because model limits are in tokens.\n\nSo split the text into sentences first. Then pack whole sentences into a chunk until the next one would go over the token budget. Start a new chunk and carry the last sentence or two across as overlap.\n\nThe case that separates a complete answer is one sentence longer than the whole budget. Think of a table row, a code block or a long legal clause. It can never fit. Without a guard you either drop it or loop forever. So split it by force as a fallback, for example word by word up to the budget.\n\nTwo smaller guards. `overlap_sents=0` must mean no overlap, because `current[-0:]` returns the whole list, a classic Python slicing bug. And drop carried sentences if they would push the next chunk over budget.\n\nThen give the honest caveat. The regex breaks on abbreviations like \"Dr.\" and \"e.g.\". In production, use a real sentence splitter, such as spaCy or NLTK, and split on document structure first.",
      "code": "import re\n\nSENT = re.compile(r\"(?<=[.!?])\\s+\")\n\ndef hard_split(s, count, max_tokens):\n    # fallback for one oversized sentence: pack words greedily\n    out, cur = [], []\n    for w in s.split():\n        if cur and count(\" \".join(cur + [w])) > max_tokens:\n            out.append(\" \".join(cur))\n            cur = []\n        cur.append(w)\n    if cur:\n        out.append(\" \".join(cur))\n    return out\n\ndef chunk_by_tokens(text, count, max_tokens=500, overlap_sents=1):\n    sentences = [s for s in SENT.split(text) if s.strip()]\n    chunks, current, used = [], [], 0\n\n    for s in sentences:\n        n = count(s)\n        if n > max_tokens:                     # single huge sentence\n            if current:\n                chunks.append(\" \".join(current))\n                current, used = [], 0\n            chunks.extend(hard_split(s, count, max_tokens))\n            continue\n        if used + n > max_tokens and current:\n            chunks.append(\" \".join(current))\n            current = current[-overlap_sents:] if overlap_sents > 0 else []\n            used = sum(count(x) for x in current)\n            while current and used + n > max_tokens:\n                used -= count(current.pop(0))   # overlap must fit too\n        current.append(s)\n        used += n\n\n    if current:\n        chunks.append(\" \".join(current))\n    return chunks",
      "points": [
        "Split into sentences, then pack greedily to a token budget.",
        "Handle the sentence longer than max_tokens - the case most miss.",
        "Overlap by sentences, so carried context stays coherent.",
        "Count tokens with the real tokeniser, not a character estimate.",
        "Name the regex limitation on abbreviations before being asked."
      ],
      "say": "I split into sentences and pack them greedily until the next one would exceed the token budget, then carry the last sentence forward as overlap. The case that matters is a single sentence longer than the budget, like a table row or code block. It needs a hard fallback split, or it is dropped or loops forever. I count with the real tokeniser and use a proper sentence splitter in production.",
      "numbers": "500 tokens with one sentence of overlap is a reasonable default. Structure-aware splitting on headings usually beats any tuning of these numbers.",
      "wrong": "Splitting on the full stop with no guard for the oversized sentence. It works on prose and breaks on the first document containing a table.",
      "follow": "The document is a contract with numbered clauses. Does your chunker still make sense?",
      "followAnswer": "Only partly. Clauses are the natural unit, so I split on the clause numbering first and keep each clause whole where it fits. Each chunk gets its clause number and section heading as a prefix and as metadata, so it can be cited. Contracts cross-reference a lot - 'subject to clause 4.2' - so I store those links and can fetch the referenced clause alongside."
    },
    {
      "id": "py-25",
      "q": "Implement a simple vector store class with add, search and delete.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "python",
        "design",
        "retrieval",
        "coding"
      ],
      "why": "A design question wearing a coding question's clothes. Delete is where it gets interesting.",
      "simple": "**Short version: keep every vector in one normalised matrix, make add an upsert, and delete by marking rows dead instead of removing them.**\n\nDelete is the real design question. If you physically remove a row, every row after it shifts up one place. Your id-to-row map is now wrong, and search returns the wrong documents without any error. So real stores use tombstones. A tombstone marks a row as dead. Search skips dead rows, and a background job compacts the matrix later.\n\nNormalise each vector when you add it. Then search is one matrix-vector product, and the scores are cosine similarities.\n\nMake add an upsert. If the id already exists, overwrite its row. Otherwise re-ingesting a document silently creates a duplicate.\n\nCheck the dimension on write. A wrong-sized vector should fail at add time, not at the next query.\n\nSay the scaling limits too. `np.vstack` copies the whole matrix on every add, which is O(n) per add. Pre-allocate and grow in blocks for real use. And once an exact scan gets too slow, use an ANN index.",
      "code": "import numpy as np\n\nclass VectorStore:\n    def __init__(self, dim):\n        self.dim = dim\n        self.vectors = np.zeros((0, dim), dtype=np.float32)\n        self.ids = []\n        self.pos = {}                       # id -> row index\n        self.dead = set()                   # tombstoned rows\n\n    def add(self, id_, vec, meta=None):\n        v = np.asarray(vec, dtype=np.float32)\n        if v.shape != (self.dim,):\n            raise ValueError(f\"expected dim {self.dim}, got {v.shape}\")\n        norm = np.linalg.norm(v)\n        if norm == 0:\n            raise ValueError(\"zero vector has no direction\")\n        v = v / norm                        # normalise at write time\n        if id_ in self.pos:                 # upsert, not duplicate\n            self.vectors[self.pos[id_]] = v\n            return\n        self.vectors = np.vstack([self.vectors, v])\n        self.pos[id_] = len(self.ids)\n        self.ids.append(id_)\n\n    def delete(self, id_):\n        if id_ in self.pos:\n            self.dead.add(self.pos[id_])    # tombstone, do not compact\n            del self.pos[id_]\n\n    def search(self, q, k=5):\n        q = np.asarray(q, dtype=np.float32)\n        k = min(k, len(self.ids) - len(self.dead))\n        if k <= 0 or not np.linalg.norm(q):\n            return []\n        scores = self.vectors @ (q / np.linalg.norm(q))\n        if self.dead:\n            scores[list(self.dead)] = -np.inf\n        idx = np.argpartition(-scores, k - 1)[:k]\n        idx = idx[np.argsort(-scores[idx])]\n        return [(self.ids[i], float(scores[i])) for i in idx]",
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
      "priority": "low",
      "tags": [
        "python",
        "retrieval",
        "bm25",
        "coding"
      ],
      "why": "Separates candidates who understand hybrid search from those who can only name it.",
      "simple": "BM25 scores how well a document matches the words in a query. It stacks three ideas, and each fixes a flaw in the one before.\n\nIdea one: a document that uses a query word more often is more relevant. But common words like \"the\" appear everywhere and mean nothing. So weight each word by how rare it is across the corpus. That weight is IDF, inverse document frequency.\n\nIdea two: a word appearing twenty times is not twenty times more relevant than one appearing once. So the count saturates. The `k1` setting controls how fast extra occurrences stop helping.\n\nIdea three: long documents contain more of every word, so they would always win. So normalise by length. The `b` setting controls how strongly.\n\nIn the IDF formula, the +1 inside the log keeps the weight positive, even for words found in most documents. This is the form Lucene uses.\n\nThis is why hybrid search works. BM25 matches exact tokens, such as a part number or an error code. That is exactly where dense embeddings are weakest.\n\nA real engine does not score every document per query. It uses an inverted index: a map from each word to the documents that contain it.",
      "code": "import math\nfrom collections import Counter\n\nclass BM25:\n    def __init__(self, docs, k1=1.5, b=0.75):     # docs: lists of tokens\n        self.docs = [Counter(d) for d in docs]\n        self.len = [len(d) for d in docs]\n        self.avg = sum(self.len) / len(docs)\n        self.k1, self.b = k1, b\n        self.df = Counter()\n        for d in self.docs:\n            self.df.update(d.keys())\n        self.N = len(docs)\n\n    def idf(self, term):\n        n = self.df.get(term, 0)\n        return math.log((self.N - n + 0.5) / (n + 0.5) + 1)\n\n    def score(self, query, i):\n        total = 0.0\n        norm = self.len[i] / self.avg\n        for term in query:\n            f = self.docs[i].get(term, 0)\n            if not f:\n                continue\n            total += self.idf(term) * (f * (self.k1 + 1)) / (\n                f + self.k1 * (1 - self.b + self.b * norm))\n        return total",
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
      "id": "py-29",
      "q": "Write a semantic cache with a similarity threshold.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "python",
        "caching",
        "embeddings",
        "coding"
      ],
      "why": "The applied version of the LRU question, and the wrong-hit failure mode is the real discussion.",
      "simple": "An exact-match cache almost never hits on natural language. \"What is the refund policy?\" and \"How do refunds work?\" are the same question but different strings.\n\nA semantic cache embeds each query and stores the answer with it. For a new query, it finds the closest stored query. If the similarity is above a threshold, it returns the stored answer.\n\nThe threshold is the whole design, and it is risky in a way an exact cache is not. Set it too low and you serve a confidently wrong answer. \"Refund policy for domestic orders\" might match a cached answer about international orders. The user has no way to tell.\n\nSo start high, around 0.95, and tune it on a labelled set of query pairs, not by feel. Similarity scales differ between embedding models, so a threshold never transfers blindly.\n\nThree more requirements. Add a TTL (time to live), because answers about changing data go stale. Keep a separate cache per tenant, or one customer's answer leaks to another. And never cache personalised answers.\n\nThis sketch scans every entry and evicts the oldest. A production cache uses a vector index and a proper eviction policy.",
      "code": "import numpy as np\n\nclass SemanticCache:\n    def __init__(self, embed, dim, threshold=0.95, max_size=10_000):\n        self.embed = embed\n        self.threshold = threshold\n        self.max_size = max_size\n        self.vecs = np.zeros((0, dim), dtype=np.float32)\n        self.entries = []                   # (query, answer, expires_at)\n\n    def _unit(self, text):\n        v = np.asarray(self.embed(text), dtype=np.float32)\n        return v / np.linalg.norm(v)\n\n    def put(self, query, answer, now, ttl=3600):\n        self.vecs = np.vstack([self.vecs, self._unit(query)])\n        self.entries.append((query, answer, now + ttl))\n        if len(self.entries) > self.max_size:   # drop the oldest\n            self.vecs, self.entries = self.vecs[1:], self.entries[1:]\n\n    def get(self, query, now):\n        if not len(self.vecs):\n            return None\n        scores = self.vecs @ self._unit(query)\n        i = int(np.argmax(scores))\n        if scores[i] < self.threshold:\n            return None\n        _, answer, expires = self.entries[i]\n        if expires < now:\n            return None                     # stale, treat as a miss\n        return answer",
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
    }
  ]
};
