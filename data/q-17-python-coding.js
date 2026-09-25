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
      "quick": [
        "Use async when code mostly waits, not calculates.",
        "AI apps wait on the model, search and tools.",
        "Twenty one-second calls, ten at a time, take two seconds.",
        "Still cap how many run at once.",
        "One blocking call freezes everything, and heavy work needs separate processes."
      ],
      "simple": "Async is a way of writing Python so that one program can wait on many things at the same time. An AI application spends most of its time waiting for the model, the vector database or a tool API, so the work is I/O-bound, and that is exactly where async helps. For CPU-bound work it does nothing.\n\nFor example, twenty model calls of about one second each take twenty seconds one after another. With async and a limit of ten calls in flight, they finish in two waves, so roughly two seconds. You still bound the concurrency with a semaphore, because thousands of calls at once hit rate limits.\n\nThe classic bug is a blocking call like requests.get inside async code, which freezes the event loop so every request waits. So the simple rule is async for waiting and processes for computing.",
      "points": [
        "Async helps I/O-bound work such as model, retrieval, tool and database calls.",
        "Bound concurrency with a semaphore or worker pool.",
        "A limit of ten means twenty one-second calls need about two waves, not one.",
        "Move CPU-heavy work off the event loop.",
        "Do not call blocking network libraries directly inside async request code."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Twenty one-second model calls compared three ways: in sequence takes about twenty seconds, ten in flight takes about two, and unbounded hits rate limits.",
        "aspects": [
          "In flight",
          "Twenty 1s calls",
          "Risk"
        ],
        "columns": [
          {
            "label": "One at a time",
            "note": "sync, queued",
            "accent": "bad",
            "cells": [
              "1",
              "About 20 seconds",
              "Slow for everyone"
            ]
          },
          {
            "label": "Bounded async",
            "note": "semaphore of 10",
            "accent": "accent",
            "cells": [
              "Up to 10",
              "About 2 seconds",
              "Tune the limit"
            ]
          },
          {
            "label": "Unbounded async",
            "note": "everything at once",
            "accent": "warn",
            "cells": [
              "Thousands",
              "Fails partway",
              "Rate and connection limits"
            ]
          }
        ],
        "caption": "Async overlaps the **waiting**, so twenty calls finish in two waves. Keep a **cap**, and keep blocking calls and CPU work off the event loop."
      },
      "say": "Almost always, because an AI app spends most of its time waiting rather than calculating. It waits on the model, the vector database and tool APIs, and async lets one program overlap those waits instead of queuing them. Say you have twenty model calls of about a second each. In sequence that's twenty seconds, but with ten in flight they finish in two waves, so roughly two seconds. I still cap the concurrency with a semaphore or a worker pool, because thousands of calls at once will hit rate limits and connection limits. The mistake I watch for is a blocking call like requests.get or time.sleep inside async code. It freezes the event loop, so every other request waits too, and the fix is an async client or asyncio.to_thread. Async also does nothing for CPU-heavy work like parsing big PDFs, which belongs in a process pool or a separate worker. My rule is simple: async for waiting, processes for computing.",
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
      "quick": [
        "The GIL lets only one thread run Python at a time.",
        "Threads still help while waiting on network or disk.",
        "Heavy calculation needs separate processes, one per core.",
        "Processes cost memory and data copying between them.",
        "NumPy often skips the lock, so measure first."
      ],
      "simple": "The GIL is the Global Interpreter Lock. In standard CPython it lets only one thread run Python code at a time, so four threads doing pure-Python calculation take about as long as one.\n\nThreads still help with waiting, because a thread waiting on the network or disk releases the lock and another thread runs. For CPU-heavy Python code, multiprocessing is the classic answer. Each process has its own interpreter and its own GIL, so the work really runs on separate cores, at the cost of memory and the time to copy data between processes.\n\nFor example, in an AI service I would use async or threads for model calls, and a process pool for heavy CPU work like PDF parsing. NumPy and PyTorch often release the GIL anyway, so I profile first. Python 3.14 supports an optional free-threaded build with no GIL, but it is not the default yet.",
      "points": [
        "Standard CPython still has a GIL; pure Python CPU threads do not normally scale across cores.",
        "Threads remain useful for blocking I/O - the lock is released while waiting.",
        "Multiprocessing gives each process its own GIL - real parallel CPU, at the cost of memory and pickling.",
        "Free-threaded CPython: experimental in 3.13, officially supported in 3.14, still optional and not the default.",
        "Extension compatibility still matters, so verify the production runtime.",
        "NumPy and PyTorch release the GIL in native code - profile before adding processes."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A grid of work type against tool: threads suit I/O-bound work, processes suit CPU-bound work, threads give no speed-up on CPU-bound Python, processes are overkill for I/O.",
        "xLabel": "Tool",
        "yLabel": "Work type",
        "cols": [
          "Threads",
          "Processes"
        ],
        "rows": [
          "I/O-bound",
          "CPU-bound"
        ],
        "cells": [
          [
            {
              "label": "Works well",
              "note": "lock released while waiting",
              "accent": "accent"
            },
            {
              "label": "Overkill",
              "note": "memory for nothing",
              "accent": "muted"
            }
          ],
          [
            {
              "label": "No speed-up",
              "note": "one GIL, one thread runs",
              "accent": "bad"
            },
            {
              "label": "Real parallel",
              "note": "own GIL; pays memory, pickling",
              "accent": "accent"
            }
          ]
        ],
        "caption": "One GIL per process: **threads for waiting, processes for computing**. NumPy and PyTorch often release the GIL, so profile first."
      },
      "say": "In standard CPython the GIL, the Global Interpreter Lock, lets only one thread run Python bytecode at a time, so threads don't speed up pure-Python CPU work. They still help with waiting, because a thread releases the lock during network or disk I/O and another one runs. For CPU-heavy code, multiprocessing is the classic answer. Each process has its own interpreter and its own GIL, so the work really runs on separate cores, but you pay in memory and in pickling data between processes. In an AI service that usually means async or threads for model calls and a process pool for PDF parsing. What juniors miss is that NumPy and PyTorch do their heavy maths in C and often release the GIL anyway, so I profile before adding processes. The free-threaded build was experimental in 3.13 and is officially supported in 3.14, but it's still optional and not the default. So I decide based on the runtime and extensions we actually deploy.",
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
      "quick": [
        "Generators hand over one item at a time.",
        "Memory stays flat however many documents you have.",
        "A full list of everything can crash the program.",
        "They suit sending the answer word by word.",
        "Usable only once, and no length without using them up."
      ],
      "simple": "A generator is a function that hands you items one at a time, instead of building a whole list in memory. You write it with yield instead of return, and each item is produced only when the next step asks for it.\n\nThis matters a lot for document ingestion. If you read ten thousand documents into a list, chunk them into another list and then embed them, a big corpus runs out of memory. With generators, each document flows through the pipeline and is released before the next one, so memory stays flat, like a conveyor belt instead of a warehouse. For example, a chunk generator can feed itertools.batched, which groups chunks into batches for the embedding API.\n\nThe trade-off is that a generator can be used only once, and you cannot ask its length without using it up. So stream by default, and build a list only when you need a second pass.",
      "points": [
        "One item in memory at a time - memory stays flat as the corpus grows.",
        "The natural shape for token streaming.",
        "Consumable once. Need it twice, materialise or regenerate.",
        "No length without consuming - pass the count separately for progress.",
        "Batching over a generator is the standard ingestion pattern."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "A list is a warehouse holding every document at once so memory grows with the corpus; a generator is a conveyor belt holding one item so memory stays flat.",
        "aspects": [
          "Holds",
          "Memory",
          "Passes",
          "Length"
        ],
        "columns": [
          {
            "label": "List",
            "note": "warehouse",
            "accent": "warn",
            "cells": [
              "Every document at once",
              "Grows with corpus",
              "Reuse freely",
              "Known"
            ]
          },
          {
            "label": "Generator",
            "note": "conveyor belt",
            "accent": "accent",
            "cells": [
              "One item at a time",
              "Stays flat",
              "Consumed once",
              "Pass count separately"
            ]
          }
        ],
        "caption": "A generator is a **conveyor belt, not a warehouse**: each document is released before the next is read, so memory stays flat at any corpus size."
      },
      "say": "Generators hand you one item at a time instead of a whole list, so memory stays flat however large the corpus gets. Each document is released before the next one is read. Picture reading ten thousand documents into a list, chunking them into a second list, then embedding. You're holding everything at once, and on a big corpus the process runs out of memory. Chain generators into a batching step for the embedding API and that simply doesn't happen, which is why it's the standard ingestion pattern. They're also the natural shape for token streaming, because you yield each token as it arrives. The catch is that a generator is consumed once. If I need the data twice, I materialise it or recreate the generator. I also can't get its length without consuming it, so a progress bar needs the total passed in separately. Stream by default, and only build a list when you truly need random access or a second pass.",
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
      "quick": [
        "Both wrap extra behaviour around code without rewriting it.",
        "A decorator takes a function and returns a wrapped one.",
        "Use functools.wraps so the real function name survives in logs.",
        "A context manager runs setup and guaranteed cleanup around code.",
        "Put the cleanup in finally so errors cannot skip it."
      ],
      "simple": "Decorators and context managers both let you wrap extra behaviour around code without rewriting it, which is why AI codebases use them for logging, retries and cleaning up connections.\n\nA decorator is a function that takes a function and returns a new one, which usually does something before and after calling the original. For example, I can write one retry decorator and put it on every model call without touching their bodies. Use functools.wraps, because without it every trace shows the name wrapper, and remember that a decorator taking arguments needs three layers.\n\nA context manager handles setup and cleanup around a with block, and the cleanup always runs, even when the block raises an error. Opening a file in a with block closes it for you. The simplest way to write one is a generator with the contextmanager decorator, with the cleanup in a finally block so an error cannot skip it.",
      "points": [
        "A decorator takes a function and returns a wrapped one; `@d` means `fn = d(fn)`.",
        "Always use `functools.wraps` so names and docstrings survive in traces.",
        "A decorator with arguments has three layers: factory, decorator, wrapper.",
        "A context manager guarantees cleanup around a `with` block, even on errors.",
        "`@contextmanager`: setup before `yield`, cleanup in `finally`.",
        "If `__exit__` returns True it swallows the exception - usually a bug.",
        "Async code needs an `async def` wrapper and `@asynccontextmanager`."
      ],
      "say": "Both wrap extra behaviour around code without rewriting it, which is why almost every AI codebase leans on them. A decorator is a function that takes a function and returns a wrapped version, so at d above a def just means fn equals d of fn. I'd write a timing or retry decorator and put it on every model call without touching their bodies. I always use functools.wraps, because otherwise every trace shows the name wrapper. If the decorator takes arguments, it needs a third layer, a factory that returns the real decorator. A context manager handles setup and cleanup around a with block, and the cleanup runs even when the block raises. The quickest way to write one is the contextmanager decorator, with setup before the yield and cleanup in a finally block, because without finally an error skips the cleanup. One trap is an exit method that returns True, which silently swallows the exception. Async code needs an async def wrapper and asynccontextmanager.",
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
      "quick": [
        "Pick the structure by what you do with the data.",
        "List is ordered and changeable, but slow to search.",
        "Tuple is fixed, so it can be a dict key.",
        "Set gives unique items and fast checks, dict gives fast lookup.",
        "A list as a default argument is shared by every call."
      ],
      "simple": "You pick a data structure by what you need to do with the data. A list is an ordered sequence you can change, but membership checks scan every item, so they are O(n). A tuple is an ordered sequence you cannot change, so it can be a dict key. A set holds unique items with O(1) membership on average, which suits removing duplicates. A dict maps keys to values with fast lookup and keeps insertion order. For example, 10,000 lookups against a 100,000-item list took several seconds, but against a set about a millisecond.\n\nMutable means an object can change in place, and this causes the famous bug. A default argument that is an empty list is created once, when the function is defined, so every call shares it and conversation history leaks between users. The fix is to default to None and create the list inside.",
      "points": [
        "**list**: ordered, mutable; `in` scans every item, O(n).",
        "**tuple**: ordered, immutable; hashable if its contents are, so it can be a dict key.",
        "**set**: unique and unordered; O(1) average membership - for dedup and seen-checks.",
        "**dict**: key to value, O(1) average lookup, insertion-ordered since 3.7.",
        "Default arguments are evaluated once, at def time - use `None` and create inside.",
        "`[[]] * 3` and `b = a` alias; use a comprehension or `copy.deepcopy`.",
        "Dataclasses: `field(default_factory=list)` for mutable defaults."
      ],
      "say": "I pick by what I need to do with the data. A list is ordered and changeable, which suits retrieved chunks, but a membership check scans every item, so it's O of n and gets slow on big lists. A tuple is fixed, so it fits records like a document id and score, and because it's hashable when its contents are, it can be a dict key. A set holds unique items with O of one average membership, ideal for deduplication and seen-checks. A dict gives fast lookup by key and has kept insertion order since 3.7. The gotcha I always raise is a mutable default argument. A default history list is created once, when the function is defined, so every call shares it and conversation history leaks between users. I default to None and create the list inside, or use default_factory in a dataclass. The related trap is aliasing. Assigning b equals a, or multiplying a nested list, copies nothing.",
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
      "quick": [
        "Product companies still test classic coding problems.",
        "A dict often turns a double loop into one pass.",
        "Two sum stores each number and checks for its partner.",
        "Anagrams group by sorted letters, intervals need sorting first.",
        "Ask about input, state the speed, test the empty case."
      ],
      "simple": "Many product companies still run a standard coding round for AI roles, and strong GenAI experience does not exempt you from it, so prepare it as a separate track.\n\nThe good news is that many easy and medium problems reduce to one idea, which is using a dict to turn a nested loop into one pass. For example, in two sum you store each number's index in a dict as you go and check whether its partner is already there, which makes it O(n) instead of O(n²). In group anagrams, the sorted letters of each word become the dict key, and in merge intervals you sort by start and extend the last interval whenever the next one overlaps.\n\nThe habits matter more than any single answer. Ask about input size and edge cases first, state the complexity before you are asked, and speak while coding, because silent solving reads as guessing.",
      "points": [
        "Product-company AI roles still screen on DSA - prepare for it.",
        "Hash map, two pointers, sliding window, binary search, heaps, BFS/DFS.",
        "State time and space complexity unprompted.",
        "Ask about input size and edge cases before writing.",
        "Services companies weight this far less than product companies do."
      ],
      "say": "I prepare for DSA as its own track, because many product companies still screen AI engineers on two sum and merge intervals, whatever their GenAI experience. The good news is the pattern list is short: hash maps, two pointers, sliding windows, binary search, heaps and graph traversal. A lot of problems just use a Python dict to turn a nested loop into one pass. In two sum, I store each number's index as I go and check whether its partner is already there, which makes it linear instead of quadratic. Group anagrams keys a dict on the sorted letters, and merge intervals sorts by start first, then sweeps. How you work matters as much as the answer. I ask about input size and duplicates before writing, state time and space complexity without being asked, and test the empty case out loud. Services companies weigh this far less, but for product roles I'd assume it's coming and talk while I code.",
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
      "quick": [
        "Hand the whole array to NumPy in one call.",
        "It runs in fast compiled code, often a hundred times faster.",
        "Broadcasting stretches size-one sides so arrays match without copying.",
        "Keep the shape when dividing by row lengths, or rows mix up.",
        "In Pandas use column maths, and split huge data into parts."
      ],
      "simple": "Vectorising means handing NumPy or Pandas a whole array in one call, instead of looping over items in Python. The loop still happens, but in compiled C code, whereas a Python loop pays interpreter overhead on every item. For example, summing the squares of a million floats took about 250 ms with a Python loop and under 1 ms with np.dot.\n\nBroadcasting is how NumPy combines arrays of different shapes without copying data. It lines the shapes up from the right, and a size of 1 is stretched to fit, so a 1000 by 768 embedding matrix minus a mean vector of length 768 subtracts the mean from every row. The classic trap is a silent wrong axis, which keepdims set to True fixes.\n\nIn Pandas the same idea means column maths instead of iterrows. The cost is memory, so use float32 for embeddings and work in chunks.",
      "points": [
        "Vectorise: one call over the whole array; the loop runs in compiled code.",
        "Broadcasting aligns shapes from the right; sizes match if equal or 1.",
        "`keepdims=True` for per-row reductions, or you divide along the wrong axis.",
        "Pandas: column expressions and `np.where`; avoid `iterrows` and row-wise `apply`.",
        "Use float32 for embeddings - half the memory of float64.",
        "Vectorised code creates temporaries - chunk data that does not fit in memory."
      ],
      "say": "Vectorising hands the library a whole array in one call, which is often tens or hundreds of times faster than a Python loop. The loop still happens, just in compiled code over packed numbers, whereas Python pays interpreter overhead on every single item. Broadcasting is how NumPy combines arrays of different shapes without copying. It lines the shapes up from the right, and each axis must match or be size one, which gets stretched. So subtracting a mean vector from an embedding matrix subtracts it from every row. The bug I watch for is dividing by row norms without keepdims. That either fails or, when the sizes happen to match, silently divides along the wrong axis. In Pandas the same idea means column expressions and np.where, not iterrows or row-wise apply. The cost is memory, because vectorised code builds full temporary arrays. I use float32 for embeddings and work in chunks when the data doesn't fit.",
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
      "quick": [
        "Cosine similarity checks if two vectors point the same way.",
        "Divide the dot product by both lengths.",
        "Write the simple version first and guard the zero vector.",
        "Then scale each row once and do one matrix multiply.",
        "Scale vectors once when storing, so search is one multiply."
      ],
      "simple": "Cosine similarity asks whether two vectors point the same way. It ignores their length and looks only at direction, which is why it is the standard score for embeddings: two texts about the same topic point the same way even if one is longer. The formula is the dot product divided by the two lengths, called norms, so the result runs from minus one to one.\n\nIn the interview, I write the two-vector version first, with a guard for a zero vector, which would divide by zero. Then I vectorise, because retrieval compares one query against a million documents. For example, a Python loop over a million vectors takes well over ten seconds, while normalising the rows and doing one matrix-vector product takes on the order of 100 ms.\n\nIn production you normalise the vectors once, when you store them, so every query is just a dot product.",
      "points": [
        "Cosine measures direction only; magnitude is divided out.",
        "Write the loop version first, then vectorise - show both.",
        "keepdims=True on the row norms, or broadcasting fails - or, when n equals d, silently divides along the wrong axis.",
        "Normalise once at write time; then cosine equals a plain dot product.",
        "Guard the zero vector - a zero-length vector divides by zero."
      ],
      "say": "Cosine similarity asks whether two vectors point the same way, ignoring length, which is why it's the standard score for embeddings. You take the dot product and divide by both norms, so magnitude drops out and only direction is left. I'd write the two-vector version first so the interviewer sees the formula, with a guard for a zero vector, since that divides by zero. Then I'd vectorise, because calling that function in a Python loop over a million documents takes well over ten seconds. Normalise every row of the document matrix, using keepdims so the shapes line up, then do one matrix-vector product with the query. Over pre-normalised rows that's on the order of a hundred milliseconds, and it's limited by memory bandwidth. Skip keepdims and it either fails or, when rows equal columns, silently divides along the wrong axis. In production I normalise once at write time, so each query is a plain dot product, which is essentially what a vector database does inside.",
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
      "quick": [
        "Cut text into fixed pieces that repeat a little at the edges.",
        "Each piece starts size minus overlap after the last.",
        "Reject overlap equal to or bigger than size.",
        "Stop at the end to avoid tiny leftover pieces.",
        "Real splitters follow headings and count words, not letters."
      ],
      "simple": "A chunker cuts long text into pieces of a fixed size. Overlap means each piece repeats the end of the previous one, so a sentence cut at a boundary still appears whole in one of them. It looks like three lines of code, but the off-by-one errors are the entire test.\n\nThe whole function rests on one idea: each new chunk starts size minus overlap characters after the last one. For example, with size 1000 and overlap 200, chunks start at 0, 800, 1600 and so on. The traps are stepping by the size, which gives no overlap, and an overlap as big as the size, which makes the step zero or negative, so you check it at the top and fail clearly.\n\nThis is the interview version, though. A real chunker splits on headings and paragraphs and measures in tokens, since 1000 characters is only about 250 tokens.",
      "points": [
        "step = size - overlap. This is the whole function.",
        "Reject overlap >= size up front - otherwise you get an error, an empty result or an infinite loop.",
        "Break once the window covers the end, to avoid trailing fragments.",
        "Character size is not token size - convert before trusting a limit.",
        "State that a real chunker splits on structure, not raw characters."
      ],
      "say": "The whole function rests on one line: each chunk starts size minus overlap characters after the previous one. Overlap repeats the tail of each piece at the start of the next, so a sentence cut at a boundary still appears whole somewhere. With size 1000 and overlap 200, chunks start at 0, 800, 1600 and so on. The edge cases are where people slip. If the overlap equals or exceeds the size, the step is zero or negative, and the code errors, returns nothing or loops forever. So I reject that at the top with a clear error. I also stop once a window reaches the end of the text, which avoids tiny trailing fragments. Then I'd say out loud that this is the interview version. A real chunker splits on structure like headings and paragraphs, and measures in tokens, because character size isn't token size. Overlap above about a quarter of the chunk mostly buys duplicate storage.",
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
      "quick": [
        "Pydantic defines expected data as a typed class.",
        "The same class tells the model the format and reads the reply.",
        "Still check the reply, since valid JSON can be wrong.",
        "Check business rules, like whether an id really exists.",
        "Keep it shallow, limit allowed values, write clear field descriptions."
      ],
      "simple": "Pydantic lets you define data as a Python class with typed fields, and then checks real data against it. In an LLM pipeline it does two jobs, which is what makes it so useful.\n\nThe first job is defining what you ask the model for. Most SDKs can turn a Pydantic class into a JSON schema that you send as the structured-output format, so one class describes the request and parses the reply, and the two cannot drift apart. The second job is checking what comes back, because valid JSON is not the same as correct JSON. For example, a claim id can have the right shape and still not exist, so business rules like that go in validators.\n\nKeep models shallow, use Literal for known values, and write good field descriptions, because the model reads them. Validation catches bad output but does not prevent it, so you still need a plan for failures.",
      "points": [
        "One class defines both the schema sent to the model and the parser.",
        "Validate even with constrained decoding - valid JSON is not correct JSON.",
        "Business rules go in validators: does this id exist, is this date plausible.",
        "Keep models shallow. Deep nesting tends to raise failure rates.",
        "`Literal` and enums over free text - they constrain generation too.",
        "Field descriptions are prompt text the model reads, not documentation."
      ],
      "say": "I define the output I expect as one typed Pydantic class, and that class does two jobs. It defines what we ask for, because most SDKs turn a Pydantic class into the JSON schema sent as the structured-output format. It also parses the reply, so the request and the parser can't drift apart. I still validate what comes back, even with strict structured output, because valid JSON isn't the same as correct JSON. A claim id can have the right shape and still not exist, so a validator checks it against the real ids passed in through validation context. Business rules like plausible dates live there too. I keep models shallow, around two levels of nesting by default, because deep nesting tends to raise failure rates. I use Literal or enums for known values, which constrains generation too. And I write field descriptions carefully, since the model reads them as prompt text, not documentation.",
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
      "quick": [
        "First try to read the whole reply as JSON.",
        "Next, pull out the fenced block and read that.",
        "Then take the first opening brace to the last closing brace.",
        "If all fail, show the raw reply's start in the error.",
        "This is a backup, the real fix is forcing a fixed format."
      ],
      "simple": "You asked the model for JSON, and it replied with a friendly sentence and then the JSON wrapped in a markdown code fence, so a plain json.loads call fails. The answer is a forgiving parser that tries the cheap options first.\n\nFirst, try json.loads on the whole text, because often it just works. If it fails, look for a fenced block with a regular expression and parse what is inside. The third step takes everything from the first opening brace to the last closing brace. If all three fail, raise an error that includes the start of the raw text, and after parsing, still validate the fields with Pydantic.\n\nThis is a safety net, not the fix. For example, at a million calls a month, even 1% of replies wrapped in fences is ten thousand failures. The real fix is structured output, but I keep the parser because providers change behaviour.",
      "points": [
        "Try json.loads first - usually it just works.",
        "re.DOTALL, because the JSON spans multiple lines.",
        "rfind for the closing brace so nested objects are not truncated.",
        "Include the raw text in the error; debugging without it is guesswork.",
        "Say this is a fallback - structured output is the real fix."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A fallback ladder for parsing model JSON: parse the whole text, then a fenced block, then first brace to last brace, and only if all three fail raise an error with the raw text.",
        "lanes": [
          {
            "label": "Parse whole text",
            "note": "often just works",
            "accent": "accent"
          },
          {
            "label": "Fenced block",
            "note": "regex with DOTALL"
          },
          {
            "label": "First to last brace",
            "note": "rfind the closing brace"
          },
          {
            "label": "Raise with raw text",
            "note": "only if all three fail",
            "accent": "bad"
          }
        ],
        "caption": "Try the **cheapest parse first** and fall back step by step, then validate with Pydantic. It is a safety net; **structured output** is the real fix."
      },
      "say": "I write a forgiving parser that tries the cheap options first. Step one is json.loads on the whole text, which often just works. If that fails, I look for a fenced block with a regex and parse what's inside, using the DOTALL flag since the JSON spans several lines. The last fallback takes everything from the first opening brace to the last closing brace, and I find that closing brace with rfind from the end, so a nested object isn't cut short. If all three fail, I raise an error that includes the start of the raw text, because debugging without it is guesswork. After parsing, I still validate the fields with Pydantic. But this is a safety net, not the design. Without structured output, fences can show up in a small share of replies even when you ask it not to, and at a million calls a month even one percent is ten thousand failures. Structured output is the real fix.",
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
      "quick": [
        "Keep a fixed number of requests running at once.",
        "A semaphore lets eight in, the ninth waits.",
        "Collect errors as results so one failure loses nothing.",
        "Results come back in input order, so retry just the failures.",
        "For millions of items, use a few workers pulling from a queue."
      ],
      "simple": "The goal is to keep a fixed number of API calls in flight. For example, if you have ten thousand documents to embed, sending all the requests at once hits the rate limit, while sending them one at a time takes hours.\n\nAn asyncio Semaphore solves this. It is a counter with a waiting line, so with a limit of eight, eight tasks get in and the ninth waits until one finishes. Then you collect the results with gather, with return_exceptions set to true. Without it, the first error is raised and you lose all the results, while with it, errors come back as values, so you keep the successes and retry just the failures.\n\nTaskGroup works the other way, cancelling the rest on the first failure, which suits all-or-nothing work but not a bulk job. A concurrency of 8 to 16 is a sane start, tuned against the provider's limits.",
      "points": [
        "Semaphore bounds what is in flight, not what is created.",
        "return_exceptions=True, or one failure discards every result.",
        "gather preserves input order - safe to zip back to the inputs.",
        "For very large inputs, stream in batches rather than creating millions of tasks.",
        "Combine with retry so a transient 429 is not counted as a failure."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Bounded batching: all tasks are created up front, a semaphore lets eight run their request at a time, gather returns errors as values in input order, and only the failures are retried.",
        "lanes": [
          {
            "label": "Create all tasks",
            "note": "all 10,000 exist",
            "accent": "warn"
          },
          {
            "label": "Semaphore gate",
            "note": "8 in flight, rest wait",
            "accent": "accent"
          },
          {
            "label": "Call the API",
            "note": "embed one batch"
          },
          {
            "label": "Gather results",
            "note": "errors come back as values",
            "accent": "accent"
          },
          {
            "label": "Retry failures",
            "note": "zip back by input order"
          }
        ],
        "caption": "The semaphore bounds **what runs, not what is created**. With return_exceptions on, one failure no longer throws away every other result."
      },
      "say": "The goal is a fixed number of requests in flight, because ten thousand at once hits the rate limit and one by one takes hours. I use an asyncio Semaphore, which is a counter with a waiting line. With a limit of eight, eight tasks run and the ninth waits until one finishes. Then I call gather with return_exceptions set to true, because otherwise the first error propagates and I lose every other result. If a few embedding batches fail, I keep the successes and retry just the failures, and since gather preserves input order, I can zip results back to inputs. I'd pair it with retry logic too, so a transient 429 isn't counted as a failure. What people miss is that the semaphore limits what runs, not what's created, so all ten thousand tasks still exist up front. For millions of items I switch to a fixed pool of workers pulling from a queue, and I tune the limit against the provider's requests-per-minute.",
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
      "quick": [
        "Retry only temporary failures like too many requests or timeouts.",
        "Wait longer each time, add a little random delay.",
        "Cap the number of tries and the total time.",
        "Use a unique request id so repeats create no duplicates.",
        "The official clients already retry, so do not retry twice."
      ],
      "simple": "A retry wrapper re-sends a failed model call, and a safe one needs four things.\n\nFirst, it retries only temporary failures, like rate limits (HTTP 429), timeouts and some 5xx errors, while a bad request fails fast. Second, it waits longer after each attempt, which is exponential backoff, with a little random jitter so clients do not all retry at once. Third, it caps both the number of attempts and the total time, because a user will not wait a minute for a chat reply. Fourth, it makes repeats safe. For example, if the call creates a payment, you send an idempotency key so the server can ignore a duplicate.\n\nThere is one SDK trap. The official OpenAI and Anthropic clients already retry twice by default, so wrapping them in three attempts of your own can turn one request into up to nine calls. Set max_retries deliberately.",
      "points": [
        "Retry temporary failures only.",
        "Use backoff plus jitter; honour server retry hints when available.",
        "Cap attempts and total elapsed time.",
        "Use idempotency or deduplication when a retry could repeat a side effect.",
        "Log retry rate and final outcome.",
        "Account for the SDK's built-in retries (`max_retries`) so you do not retry twice."
      ],
      "diagram": {
        "alt": "A retry decision path: a permanent error fails fast; a temporary error backs off with jitter and calls again only while attempts and time remain, otherwise it gives up and logs.",
        "rows": [
          [
            {
              "id": "call",
              "label": "Call the model",
              "note": "idempotency key if it creates"
            }
          ],
          [
            {
              "id": "tmp",
              "label": "Temporary failure?",
              "note": "429, timeout, some 5xx",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "ff",
              "label": "Fail fast",
              "note": "bad request, auth, refusal",
              "accent": "bad"
            },
            {
              "id": "left",
              "label": "Attempts and time left?",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "give",
              "label": "Give up and log",
              "accent": "bad"
            },
            {
              "id": "wait",
              "label": "Back off with jitter",
              "note": "Retry-After; then call again",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "call",
            "to": "tmp",
            "label": "error"
          },
          {
            "from": "tmp",
            "to": "ff",
            "label": "no"
          },
          {
            "from": "tmp",
            "to": "left",
            "label": "yes"
          },
          {
            "from": "left",
            "to": "give",
            "label": "no"
          },
          {
            "from": "left",
            "to": "wait",
            "label": "yes"
          }
        ],
        "caption": "Four needs: **retry only temporary failures, back off with jitter, cap attempts and time, make repeats safe**. Count the SDK's own retries too."
      },
      "say": "It needs four things, and most people miss at least two. It should retry only temporary failures like rate limits, timeouts and some server errors, because a bad request will fail the same way again. It should back off longer each time, with jitter, a small random extra wait, so clients don't all retry in lockstep, and it should honour a Retry-After header. It needs a cap on attempts and on total time, because a chat user won't wait a minute. And if the call creates something like a ticket, it needs an idempotency key so the server can ignore a duplicate. The trap is that the official OpenAI and Anthropic clients already retry twice by default. Wrap them in three attempts of your own and one request can quietly become nine calls, so I set max_retries deliberately. I also log the retry rate and final outcome. In production I'd use a tested library like tenacity, but I can explain exactly what it does.",
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
      "quick": [
        "Only the model call is unpredictable, test the rest normally.",
        "Swap the model for a fake with a fixed reply.",
        "Test failures on purpose, like broken JSON and overload errors.",
        "Real model tests check the shape, never the exact wording.",
        "Keep quality scores separate from pass or fail tests."
      ],
      "simple": "When code calls an LLM, only the model call itself is unpredictable. Everything around it is normal code, so you test that part like normal code.\n\nIt starts with the design. You put the model call behind a small interface, and in tests you swap in a fake that returns a fixed reply. Now prompt building, parsing, validation and routing are deterministic, and these tests run in milliseconds with no API key. Then you test the failure paths on purpose. For example, the fake returns malformed JSON, a cut-off reply or a rate-limit error, and you check the code handles each one.\n\nYou also keep a small integration suite that calls a real model and checks structure, not exact wording. Evaluation stays separate, because an eval is a quality score tracked over time, while a test is pass or fail, and mixing them gives a flaky suite.",
      "points": [
        "Model call behind an interface so a fake can be substituted.",
        "Unit-test prompt assembly, parsing, validation, routing, termination - all deterministic.",
        "Explicitly test failure paths: malformed JSON, truncation, rate limits, empty retrieval.",
        "Integration tests assert structure, never exact wording.",
        "Evaluation is a tracked score, not a pass/fail test. Keep them separate.",
        "If every test needs an API key, the suite will not run in CI."
      ],
      "say": "Only the model call is unpredictable, so everything around it gets tested like normal code. I put the model call behind a small interface and swap in a fake that returns a fixed reply. That makes prompt building, parsing, validation and routing deterministic, so those tests run in milliseconds without an API key, and they're most of the suite. Next I test the failure paths on purpose, because that's where production breaks. The fake returns malformed JSON, a cut-off reply, a rate-limit error or empty retrieval, and I check the code handles each one. Then I keep a small integration suite that calls a real model and checks structure, like whether the reply parses, but never exact wording. Evaluation stays separate, as a quality score tracked over time. Mixing it into pass-or-fail tests gives a flaky suite that people learn to ignore. If every test needs an API key, the suite won't run in CI, and then it isn't really a suite.",
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
      "quick": [
        "Send the answer word by word so users see text fast.",
        "Use a one-way stream from server to browser.",
        "Newer FastAPI handles the format and keep-alive pings.",
        "Stop the model call when the user closes the tab.",
        "Mid-stream errors need an error message, sent text cannot be recalled."
      ],
      "simple": "Streaming means sending the answer to the browser token by token instead of waiting for the full reply, so the user sees text in a few hundred milliseconds instead of several seconds. Server-Sent Events, or SSE, is the usual format, a simple one-way stream from server to browser over normal HTTP.\n\nFastAPI 0.135 added native SSE. You set EventSourceResponse as the response class and yield ServerSentEvent objects, and FastAPI handles the event format, headers and keep-alive pings. On older versions you use StreamingResponse and write the data lines yourself.\n\nThe production details matter more than the syntax. For example, if the user closes the tab, you cancel the upstream model call, so you do not pay for tokens nobody reads. And once streaming has started you cannot switch to a normal 500 response, so a failure goes out as a typed error event.",
      "points": [
        "Use FastAPI's native `EventSourceResponse` and `ServerSentEvent` for SSE.",
        "Yield typed token/progress/done events directly from the path operation.",
        "Let `ServerSentEvent.data` handle JSON serialization; use `raw_data` only for preformatted payloads.",
        "Handle cancellation so a disconnected client stops upstream work where possible.",
        "Mid-stream failures need an in-band error event or a closed stream.",
        "Streaming and output moderation require an explicit design trade-off."
      ],
      "say": "I stream tokens as Server-Sent Events, so the user sees text almost immediately instead of waiting for the whole reply. SSE is a simple one-way stream from server to browser over plain HTTP. Recent FastAPI versions support it natively, so I set EventSourceResponse as the response class and yield ServerSentEvent objects for tokens, progress and done. FastAPI handles the format, the headers and the keep-alive pings that stop proxies closing a quiet connection. Three production details matter more than the syntax. If the user closes the tab, I cancel the upstream model call, so we stop paying for tokens nobody reads. Once streaming starts, I can't send a normal error response, so failures go out as a typed error event. And tokens already sent can't be taken back, so a high-risk app needs a moderation plan, like checking small chunks before release. I measure time to first event and total completion separately, because they're different budgets.",
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
      "quick": [
        "Do not sort a million scores to get five.",
        "Pull the top k to the front without sorting the rest.",
        "Then sort only those few.",
        "Flip the sign for largest first, and cap k at the size.",
        "At big scale, use a fast approximate search index instead."
      ],
      "simple": "Top-k retrieval means taking similarity scores for many documents and returning the best few. For example, you have scores for a million documents and want the best five. Sorting everything works, but it does far more work than needed.\n\nA full sort is O(n log n) and orders all million scores. NumPy's argpartition does a partial selection in O(n) instead, moving the k largest values to the front without sorting the rest, and then you sort just those k. In a quick check this was roughly five to ten times faster. You negate the scores, since it partitions in ascending order, and clamp k to the array length.\n\nBut this is still a full scan of every score. Past a few million vectors, you move to an approximate index such as HNSW, which finds close vectors without scoring every one, at the cost of occasionally missing a true neighbour.",
      "points": [
        "argpartition is O(n); a full sort is O(n log n).",
        "Partition first, then sort only the k survivors.",
        "Negate the scores because NumPy works ascending.",
        "Clamp k to the array length - a small corpus otherwise raises.",
        "At real scale this is what the ANN index does for you."
      ],
      "say": "I avoid sorting every score, because a full sort orders a million values when I only need five. Instead I use argpartition, which is linear rather than n log n. It moves the k largest to the front without ordering the rest, and then I sort just those k survivors, which costs almost nothing. NumPy partitions in ascending order, so I negate the scores to get the largest. I also clamp k to the array length, because a small index might hold fewer than k items and argpartition raises an error. In a quick check this was roughly five to ten times faster than a full argsort. The honest caveat is that it's still a full scan of every score. Past a few million vectors, or once the exact scan misses the latency budget, I'd stop tuning this and move to an approximate nearest-neighbour index like HNSW, which is what a vector database is doing for you anyway.",
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
      "quick": [
        "A decorator times every model call without editing each one.",
        "Keep the real function name in the logs.",
        "Use a clock that never jumps backwards.",
        "Log in finally so failures count, then re-raise the error.",
        "Providers name word counts differently, so map to one log format."
      ],
      "simple": "A decorator wraps a function so you can run code before and after it without editing the function. For LLM calls that is ideal, because you want every call measured without pasting timing code into forty places. So the decorator starts a timer, calls the model, reads the token usage and writes one log line.\n\nA few details separate a real answer from a textbook one. Use functools.wraps so traces keep the real function name, and time.perf_counter, because it never jumps backwards. Log in a finally block so failed calls are measured too, and always re-raise the exception.\n\nToken field names differ by provider. For example, Anthropic reports input_tokens and output_tokens, while OpenAI Chat Completions uses prompt_tokens and completion_tokens, so you map both into one structured log schema. And a normal wrapper around an async function only times creating the coroutine, so you need an async def wrapper that awaits the call.",
      "points": [
        "functools.wraps, or every traced function is named wrapper.",
        "perf_counter is monotonic; time.time can jump backwards.",
        "Log in finally so failures are measured too.",
        "Re-raise - never let instrumentation swallow an exception.",
        "For async, you need a parallel async def wrapper with await."
      ],
      "say": "The point is to measure every LLM call without pasting timing code into forty places. I use functools.wraps so traces keep the real function name instead of wrapper. I time with perf_counter, because it's monotonic, whereas time.time can jump backwards when the system clock is corrected. I log inside a finally block, so failed calls get measured too, and I always re-raise, because instrumentation that swallows errors hides real failures. Token fields differ by provider. Anthropic reports input and output tokens, while OpenAI Chat Completions calls them prompt and completion tokens, so I map both into one schema. The logs are structured, not f-strings, and tagged with feature and tenant at call time, because you can't aggregate a string or reconstruct attribution later. The bit people miss is async. A plain wrapper around an async function only times creating the coroutine, so I need a parallel async def wrapper that awaits the call.",
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
      "quick": [
        "Double the wait after each failure, up to a cap.",
        "Add randomness so many clients do not retry together.",
        "Retry overload and outage errors, never bad requests.",
        "Obey the server's Retry-After wait when it sends one.",
        "Cap the total time as well as the attempts."
      ],
      "simple": "Exponential backoff means that after each failure you wait before retrying, and you double the wait each time: one second, two, four, eight. Retrying straight away against a rate-limited API just burns your quota, so waiting gives the provider room to recover, and a cap stops the wait growing forever.\n\nJitter is the part candidates miss. For example, picture a hundred workers that all get rate-limited at the same moment. Without jitter, they all wait exactly two seconds and retry in the same millisecond, rebuilding the spike that caused the problem. With full jitter, each worker sleeps a random time between zero and the current backoff limit, so the retries spread out.\n\nYou retry a 429 or a 5xx error, but never a 400 or 401, because those will not fix themselves. You obey a Retry-After header, and cap the total time as well as the attempts.",
      "points": [
        "Double the wait each attempt, with a ceiling.",
        "Full jitter randomises the wait so retries do not synchronise.",
        "Retry 429 and 5xx; never retry 400 or 401.",
        "Honour Retry-After when the provider sends it.",
        "Cap total elapsed time, not just the attempt count."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "An exponential backoff timeline with full jitter: after each failure the wait is random between zero and a limit that doubles from one to two to four to eight seconds, capped at sixty, with a total deadline.",
        "lanes": [
          {
            "label": "Fail: 429 or 503",
            "accent": "bad"
          },
          {
            "label": "Wait 0 to 1s",
            "note": "random, full jitter",
            "accent": "accent"
          },
          {
            "label": "Wait 0 to 2s",
            "note": "limit doubles",
            "accent": "accent"
          },
          {
            "label": "Wait 0 to 4s",
            "accent": "accent"
          },
          {
            "label": "Wait 0 to 8s",
            "note": "never past 60s cap",
            "accent": "accent"
          },
          {
            "label": "Deadline check",
            "note": "about 30s total",
            "accent": "warn"
          }
        ],
        "caption": "**Double the limit, randomise the wait, stop at a cap.** Without jitter a hundred workers retry in the same millisecond and rebuild the spike."
      },
      "say": "Double the wait after every failure, add randomness to it, and stop at a cap. Retrying straight away against a rate-limited API only burns quota faster, so the wait grows from one second to two, four and eight, never past sixty. Jitter is the part candidates usually miss. Picture a hundred workers rate-limited in the same moment. Without jitter they all wait exactly two seconds and retry in the same millisecond, which rebuilds the spike that caused the problem. With full jitter each one sleeps a random time between zero and the current limit, so the retries spread out. I only retry 429s and 5xx errors, because a 400 is malformed and will stay malformed. If the server sends Retry-After, I obey it, since it knows more than my formula. The last guard is a total deadline, not just five attempts. I check it before each sleep, because a user won't wait much longer than thirty seconds.",
      "numbers": "Base 1 second, cap 60, five attempts. Bound the total to roughly 30 seconds for an interactive request - a deadline check that stops retrying - because a user will not wait longer than that.",
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
      "quick": [
        "Never call the real model in unit tests.",
        "Use a fake client that follows a script of replies.",
        "Script two rate-limit errors, then a success.",
        "Check the call count and skip real waiting.",
        "Also test that a bad request is never retried."
      ],
      "simple": "You cannot call a real model in unit tests, because it costs money, it is slow and the output changes every run. So you test your own code. Your retry logic and parsing are fully deterministic once the API is replaced by a mock, a fake object that records its calls and returns whatever you script.\n\nThe key tool is side_effect set to a list. Each call takes the next item, and if the item is an exception, the mock raises it. For example, you script two rate-limit errors followed by a success, then assert both the result and a call count of three, which proves the retry happened. You also patch time.sleep, so the test does not really wait, patching the name where your code looks it up.\n\nThe second test is the one candidates forget. A 400 must fail after exactly one call, because retrying a bad request just burns quota.",
      "points": [
        "side_effect with a list scripts an exact failure sequence.",
        "Patch sleep, or your suite waits out the real backoff.",
        "Assert call_count - it is how you prove retry behaviour.",
        "Test the negative case: 400 must not be retried.",
        "Keep a small live smoke test outside CI for real behaviour."
      ],
      "say": "I never let a unit test call the real model, so I mock the client and test my own retry logic. A real call is slow, costs money and answers differently every run. A mock is a fake object that records its calls and returns whatever I script. Setting side_effect to a list gives an exact sequence, where each call takes the next item and raises it if it's an exception. So I script two rate-limit errors, then a success, and assert both the result and a call count of three. The count is what proves the retry actually happened. I patch time.sleep too, or the suite sits through the real backoff. Then comes the negative test people forget. A 400 must fail after exactly one call, because retrying it just burns quota. Whether the model itself behaves well is a different question. That belongs in an eval suite on a schedule, while unit tests stay fast and deterministic.",
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
      "quick": [
        "Right shape does not mean right answer.",
        "Field rules check ranges, lengths and allowed choices.",
        "Check each citation against documents you really found.",
        "A whole-object check handles rules across several fields.",
        "On failure, send the error back, retry once or twice."
      ],
      "simple": "Valid shape is not the same as correct. A model can return perfect JSON with a confidence of 3.7 and a citation to a document you never retrieved. So structured output is only as good as the validation behind it, and Pydantic gives you three layers of checks.\n\nField constraints handle cheap structural rules, like a confidence between zero and one. A field_validator adds a meaning check on one field. For example, it checks each citation against the ids you actually retrieved, which arrive through the validation context. A model_validator runs once the whole object is built, so it can check rules across fields, such as a high-confidence answer needing a citation.\n\nWhen validation fails, you send the error back to the model as a retry, and one retry usually fixes it. Cap it at one or two, because beyond that the prompt or schema is the problem.",
      "points": [
        "Field constraints for ranges, lengths and enums via Literal.",
        "field_validator for one field; model_validator for cross-field rules.",
        "Validate citations against actually-retrieved ids.",
        "Pass the error text back as a retry - the model usually self-corrects.",
        "Bound retries; two failures means the prompt is wrong, not the output."
      ],
      "say": "Right shape isn't right answer, so I validate an LLM's output in three layers. Field constraints handle the cheap structural rules, like a confidence between zero and one, a non-empty string, or a sentiment limited to three values with Literal. A field_validator then checks the meaning of one field. Take citations. I pass the ids we actually retrieved in through the validation context, and the validator rejects any citation outside that set. That catches an invented source, though not a real source cited for the wrong claim. A model_validator runs after the whole object is built, so it handles rules across fields, such as a high-confidence answer needing at least one citation. When validation fails, I send the error text back to the model and ask again, because models usually fix their output when told exactly what was wrong. I cap that at one or two retries. If two don't fix it, the prompt or schema is the problem, not the output.",
      "numbers": "One retry with the validation error attached fixes the large majority of schema failures. If two do not fix it, the prompt or schema is the problem.",
      "wrong": "Defining the model and calling it validated. Type-correct output that cites a document you never retrieved is exactly the failure you needed to catch.",
      "follow": "The model fails validation twice in a row. What does the user get?",
      "followAnswer": "They get a clear, honest fallback, never the half-valid output. After two failed attempts I stop retrying, log the raw output and the validation errors, and return a typed failure state the interface can show, such as 'I could not complete this, here is what I found' or a handoff to a person. If a safe partial answer exists, like the retrieved sources without a summary, I show that. Then I treat the repeated failure as a prompt or schema bug and add the case to the eval set."
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
      "quick": [
        "Each data line holds one JSON piece, ending with DONE.",
        "Network pieces can end halfway through a line.",
        "Keep a buffer and read only complete lines.",
        "Treat DONE as the end, and the first piece may be empty.",
        "Decode text gradually, since one character can split across reads."
      ],
      "simple": "Streaming replies from an LLM API arrive as server-sent events. In the OpenAI-style format, each line starts with data and carries one JSON object with a small piece of the answer, and the stream ends with a data line saying DONE.\n\nThe trap is that the network does not respect your line breaks. One chunk can end halfway through a line, so if you parse chunk by chunk, json.loads blows up. So you keep a buffer, parse only the complete lines up to the last newline, and leave the unfinished tail for the next chunk. The same happens with text. For example, an emoji or a Hindi letter is several bytes and can be split across two reads, so you need an incremental UTF-8 decoder.\n\nYou also treat DONE as the end signal rather than JSON, and skip events with an empty choices list. In production the SDK does this, but knowing it helps when a stream misbehaves.",
      "points": [
        "Buffer across chunks - socket reads do not align to lines.",
        "Only consume up to the last complete newline.",
        "Handle [DONE] as termination, not as JSON.",
        "Use .get for content - the first delta has none.",
        "With usage reporting on, the final chunk has usage and empty choices - handle it and record the usage.",
        "Decode UTF-8 incrementally - a character can straddle two reads."
      ],
      "say": "Each SSE data line carries one JSON delta and the stream ends with a DONE marker, but you can't parse it chunk by chunk. Network reads don't line up with line breaks, so one read can end halfway through a line and json.loads blows up. That's why I keep a buffer, append each chunk, consume only complete lines, and leave the unfinished tail for the next read. The same thing happens one level down with text. An emoji or a Hindi letter is several bytes and can straddle two reads, so I decode UTF-8 with an incremental decoder. A few details are easy to miss. DONE is a signal, not JSON. The first delta often carries only the role, so I read content with get. And with usage reporting on, the final chunk has empty choices plus the token counts, which I record. In production the provider SDK does all of this for you, but knowing it matters when a stream misbehaves.",
      "numbers": "TTFT is what the user perceives - typically a few hundred milliseconds against several seconds for the full response. That gap is the entire reason to stream.",
      "wrong": "json.loads on each chunk as it arrives. It works locally where responses come in one piece and fails under real network conditions.",
      "follow": "The connection drops at 80%. What does the user see?",
      "followAnswer": "They see the 80% that already arrived, followed by a clear message that the answer was cut off, never a silently truncated reply that looks complete. On the client I detect that the stream ended without the done marker or a finish reason, keep the partial text, and offer a retry. On the server I log the partial output and token usage, because we were still billed. For a retry I usually regenerate from scratch rather than stitch, since continuing mid-sentence reliably is harder than it looks."
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
      "quick": [
        "Drop old turns so the chat fits the limit.",
        "Always keep the system message at the top.",
        "Add turns from newest back until the budget runs out.",
        "Make the kept history start with a user message.",
        "Leave room for the answer, count with the real counter."
      ],
      "simple": "A conversation keeps growing until it no longer fits the model's context window. So you need a trimmer that drops old turns while keeping the request valid, and three things are being tested.\n\nFirst, you pin the system message, because trimming it makes the model forget its instructions, which is the most common bug in home-grown memory code. Second, you walk backwards from the newest message, adding turns until the next one would go over budget, because recent turns matter most. Third, you do not start the kept history mid-pair. For example, if the oldest kept message is a tool result whose tool call was trimmed, some APIs reject the request, so you start with a user turn.\n\nThe budget is the window minus the space reserved for the answer, counted with the real tokeniser. Once you would drop turns the user still refers to, summarise them instead.",
      "points": [
        "Pin the system message; never let it be trimmed.",
        "Walk from newest to oldest - recency wins.",
        "Do not leave a dangling assistant turn or tool result at the front.",
        "Budget = context window − reserved output − a safety margin.",
        "Count with the real tokeniser, not len(text) // 4."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "The layout of a trimmed request inside the context window: a pinned system message, dropped old turns, dropped leading assistant or tool messages, the newest turns that fit, and space reserved for the answer.",
        "top": "context window",
        "bottom": "sent to the model",
        "layers": [
          {
            "label": "System message",
            "note": "pinned, never trimmed",
            "accent": "accent"
          },
          {
            "label": "Oldest turns",
            "note": "dropped first",
            "accent": "muted"
          },
          {
            "label": "Leading assistant or tool",
            "note": "drop until a user turn",
            "accent": "bad"
          },
          {
            "label": "Newest turns",
            "note": "walk back until budget full",
            "accent": "accent"
          },
          {
            "label": "Reserved for answer",
            "note": "1-2k tokens plus margin",
            "accent": "warn"
          }
        ],
        "caption": "**Pin the system message, keep the newest turns that fit, start on a user turn.** The budget is the window minus the answer reserve and a margin."
      },
      "say": "Pin the system message, keep as many recent turns as fit the budget, and make sure what's left is still a valid request. The system message comes first because trimming it means the model forgets its instructions, and that's the commonest bug in home-grown memory code. Then I walk backwards from the newest message, adding turns until the next one would go over, since recent turns matter most. After that I drop leading messages until the history starts with a user turn. Otherwise you can open on a tool result whose tool call was trimmed, which confuses the model, and some APIs reject it outright. The budget isn't the full context window. It's the window minus the space reserved for the answer, usually one to two thousand tokens, minus a small safety margin. I count with the model's real tokeniser, not length divided by four. And once I'm dropping turns the user still refers to, I switch to summarising them instead.",
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
      "quick": [
        "State the rules first, like memory limits and safe reruns.",
        "Read documents one by one and group pieces into batches.",
        "Run a few batches at once, not thousands.",
        "Each batch records its own failures for a later retry.",
        "Use stable ids so reruns overwrite instead of duplicating."
      ],
      "simple": "This is a hands-on task, and what is being marked is error handling and bounded concurrency, not the happy path. So before coding, you state the requirements: do not load the whole corpus into memory, do not let one bad document kill the run, keep concurrency bounded, and make reruns safe.\n\nThen you build it in steps. A generator makes chunks lazily, chunks are grouped into batches for the embedding API, and a small window of four to eight batches runs at the same time. Each batch catches its own error and records the failed ids for a retry. Writes are upserts with stable ids, so a rerun updates the same chunks instead of duplicating them.\n\nThere are two common mistakes. For example, someone wraps a function in a semaphore but still awaits each batch in a plain for loop, which runs one at a time. The other is one giant gather over the whole corpus, which hits rate limits.",
      "points": [
        "Stream input and batch chunks; do not materialise the corpus.",
        "Run several batches concurrently, but keep the window bounded.",
        "Catch and record per-batch failures without killing the whole run.",
        "Use stable ids so retries and reruns are idempotent.",
        "Persist progress or use a queue for long-running production ingestion."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A concurrent ingestion pipeline: stream documents, chunk lazily with a generator, group into batches, embed a bounded window of batches, and upsert with stable ids while recording failures.",
        "lanes": [
          {
            "label": "Stream documents",
            "note": "never load the corpus"
          },
          {
            "label": "Chunk lazily",
            "note": "generator"
          },
          {
            "label": "Batch chunks",
            "note": "embedding API size"
          },
          {
            "label": "Embed a window",
            "note": "4-8 batches at once",
            "accent": "accent"
          },
          {
            "label": "Record failures",
            "note": "failed ids, retry later",
            "accent": "warn"
          },
          {
            "label": "Upsert stable ids",
            "note": "reruns do not duplicate",
            "accent": "accent"
          }
        ],
        "caption": "Marked on the unhappy path: **bounded concurrency, per-batch errors and idempotent upserts**, not the happy-path loop."
      },
      "say": "I'd pin down four rules before writing any code. The corpus won't fit in memory, one bad document mustn't kill the run, concurrency has to be bounded, and reruns must be safe. Documents stream in, a generator chunks them lazily, and chunks are grouped into batches for the embedding API. A few batches run at once, maybe four to eight to start, tuned later against measured rate limits and latency. Each batch catches its own errors and records the failed ids, so I can retry just those. Writes are upserts keyed on stable chunk ids, which means a rerun overwrites the same rows instead of duplicating them. The classic mistake is an unbounded gather over every document, which rate-limits on the first real corpus. The quieter one is a semaphore around a function that's still awaited in a plain loop, which looks concurrent but runs one batch at a time. For long jobs, checkpoints or a durable queue let a restart resume.",
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
      "quick": [
        "Put a queue between the two stages.",
        "One worker makes pieces, several others process them.",
        "Limit the queue size so memory stays flat.",
        "Send one stop signal per worker, even after errors.",
        "Each worker catches its own errors."
      ],
      "simple": "The naive pipeline chunks all ten thousand documents first and then embeds them all, so the embedder sits idle and every chunk sits in memory. It is better to start embedding while chunking is still running, by putting a queue between the two stages. A producer puts chunks in, and several consumers take them out and embed them.\n\nTwo design points carry this answer. The queue is bounded on purpose, which gives backpressure. If embedding is slower than chunking, the producer waits instead of filling memory, so memory stays flat. The second is shutdown. You send one stop marker, called a sentinel, per consumer, from a finally block. For example, with eight consumers and only one sentinel, one consumer exits and the other seven wait forever.\n\nA queue size of about a hundred and eight consumers is a reasonable start, and a persistently full queue means the consumers are the bottleneck.",
      "points": [
        "Bounded queue gives backpressure and flat memory.",
        "One sentinel per consumer, or the rest hang.",
        "Consumers must catch their own exceptions, or one bad chunk kills a worker and fails the whole gather.",
        "Overlapping stages beats batching whenever both are non-trivial.",
        "`queue.join()` with `task_done()`, or `Queue.shutdown()` on 3.13+, are alternatives to sentinels."
      ],
      "diagram": {
        "alt": "A producer chunks documents into a bounded queue; when the queue is full the producer waits; eight consumers pull chunks, embed them and write to the vector store.",
        "rows": [
          [
            {
              "id": "prod",
              "label": "Producer",
              "note": "chunks docs; sentinels in finally"
            }
          ],
          [
            {
              "id": "q",
              "label": "Bounded queue",
              "note": "about 100 slots",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "cons",
              "label": "8 consumers",
              "note": "embed; catch own errors",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "store",
              "label": "Vector store"
            }
          ]
        ],
        "edges": [
          {
            "from": "prod",
            "to": "q",
            "label": "put"
          },
          {
            "from": "q",
            "to": "prod",
            "label": "full: wait",
            "kind": "back"
          },
          {
            "from": "q",
            "to": "cons",
            "label": "get"
          },
          {
            "from": "cons",
            "to": "store"
          }
        ],
        "caption": "A **bounded queue gives backpressure**: stage two starts at once, memory stays flat, and **one stop marker per consumer** lets every worker exit."
      },
      "say": "Put a bounded queue between the stages, so one producer chunks documents while several consumers embed them at the same time. The embedder never sits idle waiting for chunking to finish. The bound matters as much as the queue, because it gives you backpressure. If embedding is slower than chunking, which it usually is, the producer just waits at put instead of filling memory. So memory stays flat whatever the corpus size. Shutdown is where people get caught. I send one stop marker per consumer, because with a single marker only one consumer exits and the rest wait forever. I send them from a finally block, so a chunking failure still releases everyone. Each consumer also catches its own errors, or one bad chunk kills a worker and fails the whole gather. On Python 3.13 and later, Queue.shutdown is a cleaner alternative to sentinels. I'd start with a queue of about a hundred and eight consumers, then watch queue depth.",
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
      "quick": [
        "The same lock is taken twice, so it waits forever.",
        "Tests pass because it only hangs on a cache miss.",
        "Holding a lock during a slow call makes everyone queue.",
        "Lock only to read and write the cache, not to fetch.",
        "If two fetch at once, keep the first stored result."
      ],
      "simple": "This is a debugging round. The code is a small async cache with a get_or_fetch method that takes a lock, checks a dictionary, and on a miss calls a fetch method. It works in tests and hangs in production.\n\nThe bug is that asyncio.Lock is not reentrant, meaning the holder cannot take it again. Here get_or_fetch holds the lock and calls fetch, which tries to take the same lock, so each waits for the other forever. Tests pass because a warm-cache request never reaches fetch.\n\nThere is a second, quieter bug. Holding a lock across a slow API call makes every caller queue. For example, a hundred requests for a hundred different keys run one after another. The lock should protect the dictionary, not the network call. So the fix is to check the cache under the lock, release it, fetch with no lock held, and lock again to store the result.",
      "points": [
        "asyncio.Lock is not reentrant - re-acquiring self-deadlocks.",
        "It only appears on a cache miss, so tests pass.",
        "Never hold a lock across a slow await.",
        "Lock the data structure, not the network call.",
        "setdefault resolves the duplicate-fetch race cleanly."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "The buggy cache holds the lock across the fetch and re-takes it, deadlocking on a miss; the fix locks only the dictionary, fetches with no lock, and stores with setdefault.",
        "aspects": [
          "Check cache",
          "Fetch on miss",
          "Store result",
          "Under load"
        ],
        "columns": [
          {
            "label": "Buggy",
            "note": "lock the network call",
            "accent": "bad",
            "cells": [
              "Takes the lock",
              "Re-takes same lock: hangs",
              "Never reached",
              "Every key queues"
            ]
          },
          {
            "label": "Fixed",
            "note": "lock the dictionary",
            "accent": "accent",
            "cells": [
              "Lock, check, release",
              "No lock held",
              "Lock again, setdefault",
              "Keys fetch in parallel"
            ]
          }
        ],
        "caption": "asyncio.Lock is **not reentrant**, and the hang needs a cache miss, so tests pass. **Lock the data structure, never a slow await.**"
      },
      "say": "It deadlocks because asyncio.Lock isn't reentrant, so a task holding it can't take it again. get_or_fetch holds the lock and calls fetch, which tries to take the same lock, so it waits on its own caller forever. Tests pass because a warm cache returns before ever reaching fetch. The hang only appears on a cache miss, usually with the first real traffic. There's a quieter second bug too. Holding a lock across a slow API call serialises every caller, so a hundred requests for a hundred different keys run one after another. A reentrant lock isn't the answer, and asyncio has none. The fix is to lock the dictionary, not the network call. I take the lock to check the cache, release it, fetch with no lock held, then take it again to store the result. setdefault settles the case where two callers both missed. If duplicate fetches are expensive, I store an in-flight future per key, so later callers await the first.",
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
      "quick": [
        "Keep recent results, drop the least recently used.",
        "Get and put must both be instant, whatever the size.",
        "An ordered dict can move a key to the end.",
        "Move keys on every get and put, remove from the front.",
        "Underneath it is a dict plus a two-way linked list."
      ],
      "simple": "An LRU cache keeps the most recent N results and evicts the least recently used one when full. The real requirement is that both get and put run in O(1), constant time.\n\nIn Python, an OrderedDict gives you that directly, because it can move a key to the end in constant time. So the end holds the newest items and the front the oldest. On get, you move the key to the end. On put, you move an existing key to the end too, assign the value, and if you are over capacity you pop from the front. The bug people write is skipping the move on put. For example, assigning to an existing key keeps its old position, so eviction picks the wrong victim.\n\nIf OrderedDict is banned, you build what is underneath: a hash map for O(1) lookup plus a doubly linked list for O(1) reordering.",
      "points": [
        "Both get and put must be O(1) - that is the real constraint.",
        "OrderedDict plus move_to_end is the idiomatic answer.",
        "popitem(last=False) evicts the oldest.",
        "Underneath: hash map for lookup, doubly-linked list for recency.",
        "Not thread-safe - add a lock if shared across threads."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "An LRU cache as an ordered row of keys from least recently used at the front to newest at the end; a hash map points to each node, gets and puts move a key to the end, and eviction pops the front.",
        "lanes": [
          {
            "label": "Front: oldest",
            "note": "evicted when over capacity",
            "accent": "bad"
          },
          {
            "label": "Key B",
            "note": "hash map points here"
          },
          {
            "label": "Key C",
            "note": "unlink in O(1)"
          },
          {
            "label": "End: newest",
            "note": "moved here on get or put",
            "accent": "accent"
          }
        ],
        "caption": "**Hash map for O(1) lookup, doubly linked list for O(1) reordering.** Move to the end on get and on put, or eviction picks the wrong victim."
      },
      "say": "An OrderedDict does it, because the real requirement is that get and put both run in constant time. OrderedDict remembers order and can move a key to the end in constant time. So on get I call move_to_end to mark the key as recent. On put I do the same for an existing key, assign the value, and if we're over capacity I call popitem with last set to False, which evicts from the front. The bug people write is skipping the move on put. Assigning to an existing key keeps its old position, so eviction picks the wrong victim. A plain dict with a list of keys fails too, because removing from the middle of a list is O of n. If OrderedDict is banned, they want the structure underneath, and that is a hash map plus a doubly linked list. And I'd say upfront that this isn't thread-safe without a lock.",
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
      "quick": [
        "Each request takes a token, tokens refill at a steady rate.",
        "This allows short bursts but keeps the average in limit.",
        "A sliding window counts the last minute and is stricter.",
        "Refill from elapsed time, and never sleep holding the lock.",
        "Several servers need one shared counter, like Redis."
      ],
      "simple": "A rate limiter makes sure your code never goes over a request limit. For example, you are allowed sixty requests a minute to a provider, and your code must never exceed it.\n\nThe token bucket is the standard answer. A bucket holds tokens, each request takes one, and tokens refill at a steady rate, so a full bucket allows a short burst while the long-run average stays at the limit. A sliding window is stricter, counting requests in the last sixty seconds so no burst goes above it.\n\nTwo details in the implementation are the real test. You refill lazily, working out new tokens from the time since the last call with time.monotonic, so no background thread is needed. And you sleep outside the lock, so other threads are not blocked. Finally, a local bucket only limits one process, so with several pods it has to live somewhere shared, such as Redis.",
      "points": [
        "Token bucket permits bursts; sliding window is stricter and smoother.",
        "Refill lazily from elapsed time - no timer thread needed.",
        "monotonic, so an NTP correction cannot break the maths.",
        "Never sleep while holding the lock.",
        "For multiple processes this must move to Redis, not a local object."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "A token bucket refills tokens at a steady rate and allows short bursts; a sliding window counts requests in the last sixty seconds and never exceeds the limit.",
        "aspects": [
          "Idea",
          "Bursts",
          "Best for"
        ],
        "columns": [
          {
            "label": "Token bucket",
            "note": "default",
            "accent": "accent",
            "cells": [
              "Take a token, refill steadily",
              "Allowed up to capacity",
              "Long-run average"
            ]
          },
          {
            "label": "Sliding window",
            "note": "stricter",
            "accent": "warn",
            "cells": [
              "Count the last 60 seconds",
              "Never above the limit",
              "Hard limits"
            ]
          }
        ],
        "caption": "Refill **lazily from elapsed time** on a monotonic clock, **sleep outside the lock**, and move the bucket to Redis once several pods share it."
      },
      "say": "My default is a token bucket, because it allows short bursts while holding the long-run average. Each request takes a token, tokens refill at a steady rate, and when the bucket's empty the caller waits. A sliding window is the stricter option. It counts requests in the last sixty seconds, so a burst can never exceed the limit. I refill lazily from elapsed time on a monotonic clock, which means no timer thread and no breakage when the wall clock gets adjusted. The detail that really gets tested is where you sleep. I compute the wait inside the lock but sleep outside it, because sleeping while holding the lock blocks every other thread. For sizing, capacity is the burst I'll tolerate, rate is the sustained limit, and I aim for about eighty percent of the provider's quota to leave room for retries. A local bucket only limits one process, so with several pods it has to live somewhere shared like Redis.",
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
      "quick": [
        "Reciprocal rank fusion merges ranked lists from two search methods.",
        "Scores differ in scale, so use only positions.",
        "Each list adds one over sixty plus the rank.",
        "Documents found by both lists rise to the top.",
        "Multiply a list's share if you trust it more."
      ],
      "simple": "Hybrid search gives you two ranked lists, one from vector search and one from keyword search using BM25, and you have to merge them. You cannot just add their scores, because cosine similarity and BM25 use completely different scales, so one retriever would silently dominate.\n\nReciprocal rank fusion, or RRF, ignores the scores and uses only the positions. Each document gets one divided by k plus its rank from every list it appears in, and those parts add up. For example, a document ranked third in both lists beats one ranked first in only one list, which is what you want, because two methods agreeing is strong evidence. The constant k, usually 60, flattens the curve at the top so one confidently wrong list does less damage.\n\nIt is a few lines, needs no score normalisation, and extends to any number of lists, but you should still confirm the gain on your own data.",
      "points": [
        "Uses rank only - no score normalisation needed.",
        "Documents found by both retrievers rise to the top.",
        "k around 60 damps the top-rank dominance.",
        "Extends to any number of lists, including a reranker.",
        "Weight lists by multiplying their contribution if one is more trusted."
      ],
      "say": "RRF merges ranked lists using only positions, which is why it's the standard way to fuse vector and keyword search. You can't just add their scores, because cosine similarity and BM25 live on completely different scales, so one retriever silently dominates. RRF ignores the scores. Every list a document appears in contributes one over k plus its rank, and those parts add up. So a document ranked third in both lists beats one ranked first in only one, and that's what we want, because two different methods agreeing is strong evidence. The constant k, usually sixty from the original paper, flattens the curve at the top, so one retriever being confidently wrong does less damage. It needs no normalisation, little tuning, and extends to any number of lists. If I trust one list more, I multiply its contribution by a weight chosen on a labelled query set. And I'd still confirm hybrid beats either retriever alone on our data.",
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
      "quick": [
        "Number each request's events, newest first, keep number one.",
        "Taking the maximum time loses the other columns.",
        "Add a tie-breaker for events with the same time.",
        "Decide where missing times sort, or they may win.",
        "Test ties, missing times and late events."
      ],
      "simple": "The task is to keep only the latest event for each request id in a table of model events. The right tool is a window function, which computes a value across related rows without collapsing them. You use ROW_NUMBER, partitioned by request id and ordered by event time newest first, and keep the rows numbered one, so the whole winning row survives.\n\nGROUP BY with MAX of the event time is the tempting wrong answer, because it gives the latest time but not the other columns from that row. Two details make the query deterministic. You add a tie-breaker, such as an increasing event id, because two events can share a timestamp. And you decide what happens with nulls. For example, PostgreSQL sorts nulls first when ordering descending, so a row with a missing timestamp would win unless you add NULLS LAST.\n\nThen you test the awkward cases, like duplicate timestamps and late-arriving events.",
      "points": [
        "Use `ROW_NUMBER()` partitioned by the business key.",
        "Order newest first and include a deterministic tie-breaker.",
        "Decide NULL ordering explicitly - `NULLS LAST` where the dialect supports it.",
        "Snowflake, BigQuery, Databricks and DuckDB accept `QUALIFY rn = 1`, which removes the CTE.",
        "Test duplicate timestamps, nulls and late-arriving events.",
        "Ask about partitioning/indexing when the table is large."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Keeping the latest event per request with a window function: partition by request id, order newest first, add a tie-breaker, put nulls last, number the rows, and keep row one.",
        "lanes": [
          {
            "label": "Partition by request",
            "note": "one group per request id"
          },
          {
            "label": "Newest first",
            "note": "order by event time"
          },
          {
            "label": "Add a tie-breaker",
            "note": "increasing event id",
            "accent": "warn"
          },
          {
            "label": "Nulls last",
            "note": "or a missing time wins",
            "accent": "warn"
          },
          {
            "label": "Number the rows",
            "note": "ROW_NUMBER, rows kept"
          },
          {
            "label": "Keep row 1",
            "note": "whole winning row",
            "accent": "accent"
          }
        ],
        "caption": "A window function **numbers rows without collapsing them**, so the whole latest row survives. GROUP BY with MAX gives the time but not the row."
      },
      "say": "I'd use ROW_NUMBER, partitioned by request id and ordered newest first, then keep row one. A window function numbers rows within each group without collapsing them, so the whole winning row survives. GROUP BY with MAX is the tempting wrong answer, because it gives you the latest time but not the status or output from that same row. Two details make it deterministic. I add a tie-breaker like an increasing event id, since two events can share a timestamp and the database may pick a different winner each run. And I decide where nulls go. In PostgreSQL, nulls sort first in descending order, so a row with no timestamp would win unless I add NULLS LAST. On Snowflake, BigQuery or DuckDB, QUALIFY lets me drop the CTE. Then I test duplicate timestamps, nulls and late-arriving events, because they look fine on a toy sample and break in a pipeline. For a big table, I'd check the query plan before assuming an index or partitioning helps.",
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
      "quick": [
        "First do all the maths in one array call.",
        "Pick the top five without sorting everything.",
        "Both help, but every query still checks every document.",
        "A fast approximate index is what really beats that.",
        "It can miss true matches, so measure and tune it."
      ],
      "simple": "The starting code loops over two million documents in Python, scores each one, sorts everything and returns five. You work through the improvements in order of payoff.\n\nFirst, you vectorise, because the Python loop is the biggest cost. You stack the vectors into one normalised matrix, so scoring becomes one matrix-vector product, commonly around a hundred times faster. Second, you use argpartition instead of sorting everything, since you want five results, not two million in order. But these are constant-factor wins, because every query still touches every vector. For example, two million 768-dimension vectors is about 6 GB in float32, and each query scans all of it.\n\nTo actually beat O(n), you need an index such as HNSW, a graph that hops between close neighbours and searches in roughly logarithmic time. It can miss a true neighbour, so you tune its ef setting against a measured recall target.",
      "points": [
        "Vectorise first - the biggest win for the least risk.",
        "argpartition instead of a full sort.",
        "Both are constant-factor wins; complexity is unchanged.",
        "An ANN index is what actually beats O(n).",
        "Approximate means recall loss - quantify it, do not hide it."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "A ladder of speed-ups for retrieval: a Python loop, then vectorising, then argpartition, all still O(n), and finally an ANN index such as HNSW which actually beats O(n) at some recall cost.",
        "top": "slowest",
        "bottom": "fastest",
        "layers": [
          {
            "label": "Python loop, full sort",
            "note": "crashes on tied scores",
            "accent": "bad"
          },
          {
            "label": "Vectorise",
            "note": "one matrix product, about 100x"
          },
          {
            "label": "argpartition top 5",
            "note": "linear, not a full sort"
          },
          {
            "label": "Still O(n) per query",
            "note": "every vector touched",
            "accent": "warn"
          },
          {
            "label": "ANN index (HNSW)",
            "note": "about log time; tune ef",
            "accent": "accent"
          }
        ],
        "caption": "Vectorising and argpartition are **constant-factor wins**. Only an **index that skips most vectors** beats O(n), traded against measured recall."
      },
      "say": "I'd go in order of payoff, but only an index actually beats O of n. The biggest cost is the Python loop, so I vectorise first. I normalise vectors when they're stored, and scoring becomes one matrix-vector product, often around a hundred times faster. Next, I use argpartition to pick the top five instead of sorting two million scores. Both are constant-factor wins, though. Every query still touches every vector, and two million 768-dimension float32 vectors is about six gigabytes. To change the complexity I need an approximate nearest-neighbour index like HNSW, a graph that hops between close neighbours and searches in roughly logarithmic time. Approximate means it can miss a true neighbour. It typically holds recall above ninety-five percent, but I tune its ef setting against a measured recall target rather than guessing. I'd also fix the crash in the original, where a tied score makes sort compare document objects and raise a TypeError.",
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
      "quick": [
        "Split text into sentences first.",
        "Add whole sentences until the next would exceed the budget.",
        "Carry the last sentence into the next piece.",
        "Force-split any single sentence longer than the budget.",
        "Make zero overlap truly mean none, and use a proper sentence splitter."
      ],
      "simple": "Character chunking cuts sentences in half, and half a sentence has a muddled meaning, so it embeds badly. Characters are also the wrong unit, because model limits are in tokens. So a better chunker never splits mid-sentence and measures in tokens.\n\nThe approach is to split the text into sentences first, then pack whole sentences into a chunk until the next one would go over the token budget, counted with the model's real tokeniser. Then you start a new chunk and carry the last sentence or two across as overlap. The case that separates a complete answer is one sentence longer than the whole budget. For example, a long table row or legal clause can never fit, so without a guard you drop it or loop forever, and the fallback is to split it word by word.\n\nA simple regex splitter breaks on abbreviations like Dr., so in production you use a real sentence splitter such as spaCy.",
      "points": [
        "Split into sentences, then pack greedily to a token budget.",
        "Handle the sentence longer than max_tokens - the case most miss.",
        "Overlap by sentences, so carried context stays coherent.",
        "Count tokens with the real tokeniser, not a character estimate.",
        "Name the regex limitation on abbreviations before being asked."
      ],
      "say": "Split into sentences first, then pack whole sentences up to a token budget. Half a sentence has muddled meaning and embeds badly, and model limits are in tokens, not characters. So I add sentences to the current chunk until the next one would go over, then start a new chunk carrying the last sentence across as overlap. The case most people miss is one sentence longer than the whole budget. A table row or a long legal clause can never fit, so without a guard you either drop it or loop forever. My fallback force-splits it word by word. There's a subtle Python trap too. Slicing from minus zero returns the whole list, so an overlap of zero needs its own branch or it silently keeps everything. I count with the real tokeniser and use a proper sentence splitter, because a regex breaks on abbreviations. Around five hundred tokens is a sensible default, though splitting on headings usually matters more than tuning.",
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
      "quick": [
        "Keep all vectors scaled in one matrix.",
        "Search is then one multiply for all documents.",
        "Add replaces an existing id, so no duplicates.",
        "Delete marks rows dead, and a later job cleans up.",
        "Check the vector size when adding."
      ],
      "simple": "A simple vector store keeps every vector in one normalised matrix, makes add an upsert, and deletes by marking rows dead instead of removing them. It looks like a coding question, but it is really a design question, and delete is where it gets interesting.\n\nIf you physically remove a row, every row after it shifts up, so your map from id to row is wrong and search silently returns the wrong documents. So real stores use tombstones. A tombstone marks a row as dead, search skips it, and a background job compacts the matrix later, for example once tombstones exceed about 20% of the rows. Add is an upsert, because otherwise re-ingesting a document creates a duplicate, and you check the dimension on write.\n\nSearch is still an exact scan of every row, so once it misses your latency budget, you switch to a real ANN index.",
      "points": [
        "Normalise at write time; search becomes a single dot product.",
        "add is an upsert - re-ingestion must not duplicate.",
        "Tombstone deletes; compaction is a separate background job.",
        "vstack per add is O(n) - pre-allocate and grow in blocks for real use.",
        "Validate the dimension on write, not at query time."
      ],
      "say": "I keep every vector in one normalised matrix, so search is a single matrix-vector product that returns cosine scores. Add is an upsert, meaning an existing id overwrites its row, because otherwise re-ingesting a document silently creates a duplicate. I also check the dimension on add, so a wrong-sized vector fails there and not at the next query. Delete is the real design question. If I physically remove a row, every later row shifts up, the id-to-row map now points at the wrong vectors, and search returns wrong documents with no error at all. So real stores use tombstones. A deleted row is marked dead, search skips it, and a background job compacts the matrix later, say once dead rows pass about twenty percent. The other cost to name is that stacking on every add copies the whole matrix. I'd pre-allocate in blocks, and once exact search misses the latency budget, switch to a proper ANN index.",
      "numbers": "Compact when tombstones exceed roughly 20% of rows. Once an exact scan stops meeting your latency budget - often somewhere between a few hundred thousand and a few million vectors - use a real ANN index.",
      "wrong": "np.delete on the row and moving on. Every index after it shifts, the id map now points at the wrong vectors, and search silently returns wrong documents.",
      "follow": "A million deletes and no compaction. What does search look like?",
      "followAnswer": "Search gets slower and can return too few results. Every query still scores the dead rows, so if a million of the rows are tombstones, a large share of the compute and memory is wasted. Worse, if I take the top k and then drop dead rows, I can end up returning fewer than k, or nothing. So I either mask dead rows before selecting the top k, or over-fetch, and I compact once tombstones pass about twenty percent, rebuilding the matrix and the id-to-row map."
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
      "quick": [
        "BM25 scores how well a document matches query words.",
        "Rare words count more than common ones like the.",
        "Extra repeats of a word help less and less.",
        "Adjust for length so long documents do not always win.",
        "It finds exact codes and part numbers meaning-based search misses."
      ],
      "simple": "BM25 is the standard algorithm for scoring how well a document matches the words in a query. It stacks three ideas on top of plain word matching, and each one fixes a flaw in the idea before it.\n\nFirst, a document that uses a query word more often is more relevant, but common words like the mean nothing, so each word is weighted by how rare it is across the corpus, which is IDF. Second, a word appearing twenty times is not twenty times more relevant, so the count saturates, controlled by k1. Third, long documents contain more of every word, so the score is normalised by length, controlled by b. Typical values are k1 around 1.2 and b of 0.75.\n\nThis is why hybrid search works. For example, BM25 matches exact tokens such as a part number or an error code, which is where embeddings are weakest. But it knows nothing about meaning or synonyms.",
      "points": [
        "IDF weights rare terms above common ones.",
        "k1 saturates term frequency - the twentieth hit adds little.",
        "b normalises for document length.",
        "Typical k1 is 1.2-2.0 (Lucene uses 1.2, rank_bm25 1.5) with b=0.75; tune only with evidence.",
        "BM25 catches exact identifiers that dense retrieval misses."
      ],
      "say": "BM25 layers three ideas on top of plain word matching, each fixing a flaw in the one before. Rare words count more. Common words like the appear everywhere and tell you nothing, so each term is weighted by inverse document frequency. Next, term frequency saturates. A word appearing twenty times isn't twenty times more relevant, and k1 controls how quickly extra repeats stop helping. Then it normalises for length, because long documents contain more of every word and would always win, and b controls how strongly. Typical values are k1 between 1.2 and 2, with Lucene defaulting to 1.2, and b of 0.75. I'd only tune them with evidence. This is also why hybrid search works so well. BM25 nails an exact part number or error code, which is exactly where dense embeddings are weakest. In production, a real engine scores through an inverted index, so it only touches documents containing the query terms instead of scanning everything.",
      "numbers": "k1 between 1.2 and 2.0 (Lucene and Elasticsearch default to 1.2) and b=0.75. In production use an inverted index rather than scanning every document per query.",
      "wrong": "Describing it as 'like TF-IDF but better' with no mechanism. The follow-up is always what k1 and b do, and that is where it ends.",
      "follow": "Combine this with your vector scores. How?",
      "followAnswer": "I would fuse them by rank with reciprocal rank fusion rather than adding raw scores. BM25 scores are unbounded and depend on the query, while cosine similarity sits in a narrow range, so a plain sum lets one retriever dominate. With RRF each document gets one over sixty plus its rank from each list, summed. If I want score-based fusion instead, I normalise both per query, for example min-max, then take a weighted sum and tune the weight on a labelled query set."
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
      "quick": [
        "Store answers by meaning, not exact wording.",
        "Reuse a stored answer if a new question is close enough.",
        "Set the bar too low and users get wrong answers.",
        "Start high, near 0.95, and tune on labelled pairs.",
        "Expire old answers, separate customers, never store personal answers."
      ],
      "simple": "An exact-match cache almost never hits on natural language. For example, \"What is the refund policy?\" and \"How do refunds work?\" are the same question but different strings. A semantic cache matches by meaning instead. It embeds each query, finds the closest stored query, and if the similarity is above a threshold, returns the stored answer in milliseconds.\n\nThe threshold is the whole design, because a wrong hit is worse than a miss. Set it too low, and a question about domestic refunds might get a cached answer about international orders, with no way for the user to tell. So you start high, around 0.95, and tune it on a labelled set of query pairs, not by feel.\n\nYou also add a TTL so answers about changing data expire, keep a separate cache per tenant so answers do not leak, and never cache personalised answers.",
      "points": [
        "Embed the query; hit when similarity clears the threshold.",
        "A wrong hit is worse than a miss - it is invisible to the user.",
        "Start high (around 0.95) and tune on labelled pairs; thresholds do not transfer between embedding models.",
        "TTL, because cached answers over live data go stale.",
        "Namespace by tenant, or you leak across customers."
      ],
      "diagram": {
        "alt": "A semantic cache flow: embed the query, find the nearest stored query in the same tenant, and if similarity clears the threshold return the cached answer, otherwise generate and store with a time to live.",
        "rows": [
          [
            {
              "id": "emb",
              "label": "Embed the query"
            }
          ],
          [
            {
              "id": "near",
              "label": "Nearest stored query",
              "note": "same tenant only"
            }
          ],
          [
            {
              "id": "th",
              "label": "Above threshold?",
              "note": "start near 0.95",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "hit",
              "label": "Return cached answer",
              "note": "milliseconds; risk: wrong hit",
              "accent": "accent"
            },
            {
              "id": "miss",
              "label": "Generate and store",
              "note": "with a TTL; skip personal"
            }
          ]
        ],
        "edges": [
          {
            "from": "emb",
            "to": "near"
          },
          {
            "from": "near",
            "to": "th"
          },
          {
            "from": "th",
            "to": "hit",
            "label": "yes"
          },
          {
            "from": "th",
            "to": "miss",
            "label": "no"
          }
        ],
        "caption": "The **threshold is the whole design**: a wrong hit is worse than a miss because the user cannot tell. Tune it on labelled pairs."
      },
      "say": "Exact-match caching rarely hits on natural language, so a semantic cache matches by meaning instead. It embeds each query and stores the answer alongside. For a new query it finds the closest stored one and returns that answer if the similarity clears a threshold. The threshold is the whole design, because a wrong hit is worse than a miss. Set it too low and a question about domestic refunds gets a cached answer about international orders, and the user has no way to tell. So I start high, around 0.95, and tune on labelled query pairs, since thresholds don't transfer between embedding models. Then come three guards. A time to live, so answers about changing data expire. A separate namespace per tenant, so answers never leak between customers. And no caching of personalised answers at all. Hit rates vary a lot, high for repetitive support queries and low for open-ended chat, so I'd measure wrong hits before ever lowering that threshold.",
      "numbers": "Hit rates depend heavily on traffic: repetitive support queries can reach tens of percent, open-ended chat far less. Each hit saves the full generation cost and returns in milliseconds instead of seconds.",
      "wrong": "Lowering the threshold to 0.85 because it improves the hit rate, without measuring wrong hits. Hits do go up - and the cache starts answering questions the user did not ask, which costs far more than a miss.",
      "follow": "How would you detect that your cache is serving wrong answers?",
      "followAnswer": "I measure wrong hits directly, because users cannot see them. I log every hit with the new query, the cached query and the similarity score, then regularly sample hits near the threshold and have a person or an LLM judge check whether the cached answer actually fits the new question. I also watch for signals like thumbs-down, rephrased repeats or escalations straight after a cache hit. And I keep a labelled set of near-miss pairs, so any threshold or embedding change is tested before release."
    }
  ]
};
