/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["14-cost-latency"] = {
  "lede": "At retail scale and in services firms this topic can be the whole technical conversation, because the margin lives here. The questions are simple to state and easy to answer badly: every one of them wants a number, a measured breakdown, and a trade you made on purpose. New to cost and serving? The questions are ordered for a first read: High priority first, from working out what a feature costs through latency metrics, caching, routing and the self-host decision to the latency and cost incidents, then Medium (serving internals and GPU sizing), then Low.",
  "grounding": "public JDs requiring cost accountability + documented serving behaviour",
  "evening": [
    "cl-01",
    "cl-03",
    "cl-05",
    "cl-07"
  ],
  "cards": [
    {
      "id": "cl-01",
      "q": "How do you work out the cost of a GenAI feature?",
      "round": [
        "screening",
        "tech1",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "estimation",
        "business"
      ],
      "why": "A commercial-literacy check. Many strong engineers have never done this arithmetic.",
      "simple": "Cost per request, then multiply by volume - and the part people get wrong is what goes into the per-request number. (A RAG request broken down line by line is rag-34.)\n\nInput tokens are usually the biggest line, and they are mostly not the user's question. They are the system prompt, the tool definitions, the conversation history and, dominating everything, the retrieved context. Output tokens are priced higher per token but there are usually far fewer of them.\n\nThen add what people forget: the embedding call on every query, the reranker call, any guardrail or judge model calls, retries, and reasoning tokens if you are on a reasoning model. In an agent, multiply by the number of loop steps, because every step re-sends the whole history.\n\nThen the number that actually matters in a business conversation: cost per completed task, not cost per call. A cheaper model that needs two attempts and an escalation is not cheaper, and expressing it this way is what lets you win an argument about model choice.",
      "points": [
        "Input tokens dominate, and retrieved context dominates input.",
        "Add embeddings, reranking, guardrail and judge calls, retries, reasoning tokens.",
        "In an agent, multiply by loop steps - each step re-sends the full history.",
        "Report cost per completed task, not per call.",
        "Split the dashboard by feature and by tenant. One feature is usually most of the bill."
      ],
      "say": "Cost per request times volume, but the per-request number has to include everything: system prompt, tool definitions, history and retrieved context, which usually dominates, plus embedding, reranking, guardrail calls, retries and reasoning tokens. In an agent I multiply by loop steps, since each step re-sends the whole history. Then I report cost per completed task, because a cheap model needing two attempts is not cheap.",
      "numbers": "Worked example: 4 chunks × 600 tokens = 2,400 context tokens, plus ~600 of prompt and history = ~3,000 input and ~500 output per request. At 10,000 requests a day that is 30M input and 5M output tokens a day - roughly 900M and 150M a month. Price it against your provider's current rates, and remember prompt caching can discount the repeated prefix.",
      "wrong": "Quoting only the model's per-token price. It ignores embeddings, reranking, guardrails and retries, which can be a significant share of the bill - retries and judge calls especially.",
      "follow": "Where would you look first to cut that number by half?",
      "followAnswer": "Input tokens, because they are usually most of the bill. First I check that prompt caching actually hits on the stable prefix. Then I cut retrieved context - rerank and pass four chunks instead of ten - and trim conversation history. Then I move narrow steps like classification and rewriting to a smaller model. After each change I re-run the eval set, so the saving does not quietly cost quality."
    },
    {
      "id": "cl-10",
      "q": "What are TTFT, TPOT/ITL and throughput, and how do you measure them?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "latency",
        "serving",
        "metrics",
        "benchmarking"
      ],
      "why": "The vocabulary of every latency conversation. If you cannot say which of these you are optimising, you cannot argue a trade-off.",
      "simple": "**Short version: TTFT is how long until the first word appears. TPOT and ITL describe how fast the words come after that. Throughput is how much total work the system does per second across all users.**\n\nTTFT - time to first token - is the wait between sending a request and seeing the first token. It includes queueing, steps like retrieval, and prefill - the model reading the whole prompt. Long prompts and busy servers make it worse. Users feel it most.\n\nTPOT - time per output token - is the average time for each token after the first. ITL - inter-token latency - is the gap between two tokens in a row. Look at its spread, because one long pause feels like a freeze. Both come from decode, the model writing one token at a time.\n\nEnd-to-end latency is roughly TTFT + TPOT x (output tokens - 1).\n\nThroughput is total tokens or requests per second across all users. It trades against per-user speed: a bigger batch serves more people per GPU, but each waits a little longer per token.\n\nTo measure: in production, log timestamps per request - received, first token, last token - plus token counts, and report p50, p95 and p99, not averages. For self-hosted serving, load-test at realistic prompt lengths, output lengths and concurrency with a tool like `vllm bench serve` or NVIDIA AIPerf. Goodput - the share of requests meeting all your latency targets - ties it together.",
      "points": [
        "**TTFT**: queueing + pre-model steps + prefill. What users feel most.",
        "**TPOT**: average time per output token after the first. **ITL**: gap between consecutive tokens - watch the tail.",
        "End-to-end latency ≈ TTFT + TPOT x (output tokens - 1).",
        "**Throughput**: tokens or requests per second across all users - it trades against per-user speed.",
        "Report p50/p95/p99 from per-request timestamps, never just the average.",
        "Load-test self-hosted serving at real lengths and concurrency (`vllm bench serve`, AIPerf) and track **goodput**."
      ],
      "say": "TTFT is the time until the first token, which covers queueing and prefill of the prompt, and it is what users feel most. TPOT is the average time per token after that, and inter-token latency is the gap between consecutive tokens, where I watch the tail. Throughput is tokens per second across all users, and it trades against per-user speed. I log per-request timestamps, report p95, and load-test at realistic lengths.",
      "numbers": "Common chat targets are TTFT under about one second at p95 and roughly 20 or more tokens per second per user (TPOT around 50 ms or less). People read at roughly 5 tokens per second, so faster streaming mainly helps long answers and skimming. Set your own targets from the product.",
      "wrong": "\"Our latency is two seconds.\" To the first token or the last? Average or p95? At what load? One average hides both the tail and the difference between waiting to start and waiting to finish.",
      "follow": "You doubled the batch size and throughput went up. What happened to TTFT and TPOT, and is that acceptable?",
      "followAnswer": "Throughput rose because each decode step now serves more users. But each step does more work, so TPOT usually gets a bit worse, and TTFT can rise because new prompts' prefill competes with the running batch. Whether that is acceptable depends on the targets. I check goodput - the share of requests still meeting our TTFT and TPOT limits. If goodput fell, the bigger batch is not a win."
    },
    {
      "id": "cl-03",
      "q": "How does caching work in a GenAI system, and where do you apply it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "caching",
        "latency"
      ],
      "why": "The biggest single cost lever, with several distinct layers most candidates conflate.",
      "simple": "Four different caches, and they are not the same thing. (Prompt-caching mechanics: llm-15. RAG cache keys and invalidation: ar-10.)\n\nProvider prompt caching: the provider keeps the processed form of a stable prompt prefix, so repeated requests skip re-processing it. It cuts input cost and prefill latency together, and it needs your stable content - system prompt, tool definitions, few-shot examples - placed first, before anything that varies. Getting the order wrong silently disables it.\n\nEmbedding cache: the same query text embedded repeatedly. Key on text plus embedding model version.\n\nExact-match answer cache: the same question asked again. Cheap and effective for FAQ-shaped traffic, and the key must include the user's entitlements and a corpus version, or you serve leaked or stale answers.\n\nSemantic cache: near-identical questions match. Powerful, and risky - a loose threshold serves the answer to a different question, which users notice far faster than any saving pays for.\n\nStart with provider prompt caching. It is the safest and usually the largest win.",
      "points": [
        "Provider prompt caching - stable prefix first. Cuts cost and prefill together.",
        "Embedding cache - key on text plus model version.",
        "Exact-match answer cache - key must include entitlements and corpus version.",
        "Semantic cache - high threshold, or it answers a different question.",
        "Start with prompt caching: safest, usually biggest.",
        "Anything varying placed before the stable prefix silently kills the cache hit."
      ],
      "diagram": {
        "alt": "Where the four caches sit on a request path: answer and semantic cache, embedding cache, then provider prompt caching at the model call.",
        "rows": [
          [
            {
              "id": "q",
              "label": "Query"
            }
          ],
          [
            {
              "id": "ans",
              "label": "Exact answer cache",
              "note": "key: question + entitlements + corpus ver",
              "accent": "warn"
            },
            {
              "id": "sem",
              "label": "Semantic cache",
              "note": "high threshold, or it answers another question",
              "accent": "bad"
            }
          ],
          [
            {
              "id": "emb",
              "label": "Embedding cache",
              "note": "key: text + model version"
            },
            {
              "id": "ret",
              "label": "Retrieve"
            }
          ],
          [
            {
              "id": "model",
              "label": "Model call - provider prompt cache",
              "note": "stable prefix FIRST",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "out",
              "label": "Answer",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "ans"
          },
          {
            "from": "ans",
            "to": "sem",
            "label": "miss"
          },
          {
            "from": "sem",
            "to": "emb",
            "label": "miss"
          },
          {
            "from": "emb",
            "to": "ret"
          },
          {
            "from": "ret",
            "to": "model"
          },
          {
            "from": "model",
            "to": "out"
          },
          {
            "from": "ans",
            "to": "out",
            "label": "hit"
          }
        ],
        "caption": "**Start at the bottom.** Provider prompt caching is the safest and usually the largest win, and it only works if your stable content - system prompt, tool definitions, few-shot examples - sits before anything that varies. The two coloured boxes are where answers leak or go stale: both keys must carry the user's entitlements."
      },
      "say": "Four layers. Provider prompt caching keeps the processed stable prefix, cutting input cost and prefill latency together - but the stable content has to come first or the cache never hits. Embedding cache keyed on text plus model version. Exact-match answer cache, keyed to include entitlements and corpus version, or it leaks or goes stale. And semantic caching, which needs a high threshold. I start with prompt caching.",
      "numbers": "Prompt caching typically discounts cached input tokens substantially and cuts time to first token. Some providers charge extra to write the cache and caches usually expire within minutes, so the saving depends on request frequency - check current rates rather than quoting one from memory.",
      "wrong": "\"We cache the responses.\" Which cache, keyed on what? Keyed on question text alone, it is both a staleness bug and a data leak.",
      "follow": "A timestamp in your system prompt. What does that do to your cache hit rate?",
      "followAnswer": "It can drop the hit rate to almost zero. Prompt caching matches an exact prefix - the start of the prompt - so if the first lines change on every request, nothing after them matches either. I move anything that varies, like the timestamp, user name or retrieved chunks, after the stable part, or round the time to the day. Then I check the cached-token count in the API usage data to confirm hits."
    },
    {
      "id": "cl-06",
      "q": "How do you route between a cheap and an expensive model?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "routing",
        "architecture"
      ],
      "why": "The highest-leverage cost technique in most pipelines, and it needs real design thinking.",
      "simple": "The premise is that traffic is not uniform. Most requests are easy and a minority are hard, and paying frontier prices for the easy majority is where most GenAI budgets go.\n\nThe simplest routing that works is by task, not by difficulty. Classification, extraction, routing, query rewriting and summarisation of short text go to a small model. Final generation on a complex question goes to the large one. This needs no classifier and no judgement - it is a design decision you make once.\n\nAbove that, difficulty routing: a cheap classifier or heuristic estimates whether this request needs the large model. Input length, question type, the retrieval score and the user's tier are all useful signals.\n\nThen the fallback pattern: try the small model, check the output with a cheap validator, and escalate to the large model only if it fails. You pay for the large model only on the requests that needed it.\n\nAnd evaluate the router itself, because a routing error looks exactly like a quality failure and gets debugged in the wrong place.",
      "points": [
        "Route by task first - no classifier needed, decided once.",
        "Then by difficulty, using input length, question type, retrieval score, user tier.",
        "Try-small-then-escalate: pay for the big model only when the small one fails.",
        "Evaluate the router separately. Routing errors masquerade as quality failures.",
        "Track cost per completed task after routing, not per call - escalations count."
      ],
      "say": "Most traffic is easy and a minority is hard, so paying frontier prices for the majority is where budgets go. I route by task first - classification, extraction, rewriting and short summarisation go to a small model, final generation on hard questions to the large one. Then by difficulty using length, question type and retrieval score. And try-small-then-escalate, so I pay for the big model only when needed.",
      "numbers": "Within one provider, the smallest and largest tiers often differ by roughly 5–25× per token - check current rates. Moving the high-volume narrow steps down a tier is usually the largest single saving available.",
      "wrong": "\"We use the cheaper model everywhere.\" That trades a cost problem for a quality problem, and the escalations and retries often erase the saving.",
      "follow": "Your router sends 30% to the expensive model. How would you get that to 10%?",
      "followAnswer": "First I look at what that 30 percent actually is. I sample escalated requests and check whether the small model's answer would have been fine - routers are often over-cautious, so I tune the threshold against the eval set. For the genuinely hard ones, I raise the small model's success rate with better retrieval, a tighter prompt, examples, or fine-tuning on the cases it fails. And I track quality alongside cost per task."
    },
    {
      "id": "cl-05",
      "q": "Self-host or use an API? How do you decide?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "serving",
        "architecture",
        "trade-off"
      ],
      "why": "A real architecture and budget decision, common wherever cost pressure is explicit.",
      "simple": "Constraints first, then economics - and say them in that order, because half the time the constraints decide it before cost comes up.\n\nConstraints: does data residency or a contract forbid sending data to a provider? Do you need a model no API offers? Do you need guaranteed capacity rather than shared rate limits?\n\nThen the economics, which depend on volume. An API charges per token with no fixed cost, so at low or bursty volume it is far cheaper. Self-hosting is a fixed GPU cost whether you use it or not, so it only wins above a break-even utilisation - the share of time the GPU is busy. The honest version includes engineering time: the serving stack, autoscaling, monitoring, upgrades and someone on call.\n\nThere is also a middle option people forget: managed endpoints for open-weight models on Bedrock, Microsoft Foundry, Google's Agent Platform or an inference provider. You get the model you want, billed per token, without running GPUs.\n\nThe pattern that usually wins: an API for the frontier model on hard tasks, and a small self-hosted or managed open model for high-volume narrow work. Most traffic is narrow.\n\nAnd name the break-even as a number you would calculate, rather than a threshold you half-remember.",
      "points": [
        "Constraints first: residency, contracts, model availability, guaranteed capacity.",
        "API - pure variable cost, wins at low or bursty volume.",
        "Self-hosting - fixed cost, wins above a break-even utilisation.",
        "Count engineering time and on-call in the self-hosting cost. It is not free.",
        "Middle option: managed per-token endpoints for open-weight models.",
        "Common answer: API for hard tasks, small self-hosted or managed model for high-volume narrow work.",
        "Calculate the break-even for your volume rather than quoting a rule of thumb."
      ],
      "say": "Constraints first - residency, contract terms, model availability, guaranteed capacity - because those often decide it before cost comes up. Then economics: an API is pure variable cost and wins at low or bursty volume, while self-hosting is fixed cost and only wins above a break-even utilisation, including the engineering time and on-call. The split that usually wins is API for hard tasks and a self-hosted small model for high-volume narrow work.",
      "numbers": "A GPU costs the same idle as busy - that is the whole break-even argument. Compute yours from your actual duty cycle, not a blog post's threshold.",
      "wrong": "\"Self-hosting is cheaper.\" Only above a utilisation you have not stated, and only if the engineering time is free, which it never is.",
      "follow": "What utilisation would you need to justify a dedicated GPU?",
      "followAnswer": "I would calculate it rather than quote one. Take the GPU's monthly cost plus a share of engineering and on-call time. Benchmark how many tokens it serves per month at our real prompt and output lengths. That gives a cost per million tokens at a given utilisation. Compare it with the API price for a model of the same quality. If our steady traffic sits well below the crossing point, we stay on the API."
    },
    {
      "id": "cl-02",
      "q": "Your p95 latency is 6 seconds and the budget is 3. What do you cut?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "latency",
        "optimisation",
        "debugging"
      ],
      "why": "A diagnostic scenario. It checks whether you measure before cutting.",
      "simple": "Measure first, because the slow part is rarely where people guess. A trace should show the time spent in each stage: embedding, retrieval, reranking, guardrail calls, prefill (the model reading the prompt) and decode (the model writing the answer).\n\nThen fix the biggest stage first.\n\nIf prefill is slow, the prompt is too long. Pass fewer chunks after reranking, trim boilerplate, and turn on prompt caching for the fixed start of the prompt, so the provider skips re-reading it.\n\nIf decode is slow, the answer is too long. Cap the output, and ask whether users really need three paragraphs.\n\nIf retrieval is slow, check the index, the filters and how many candidates the reranker scores - a cross-encoder over 20-50 candidates typically costs 50-300 ms.\n\nIf a guardrail model sits in the critical path, run it in parallel or move it off the path.\n\nTwo structural moves help everywhere. Run independent steps at the same time instead of one after another. And stream the answer - total time stays the same, but time to first token is what users actually feel.\n\nIf the budget still cannot be met, the feature scope has to change. Say that plainly.",
      "points": [
        "Get the per-stage breakdown first. The bottleneck is rarely where you guess.",
        "Prefill-bound → shorter prompt, fewer chunks, prompt caching.",
        "Decode-bound → cap output length; ask whether the length is needed.",
        "Retrieval-bound → index, filters, reranker candidate count.",
        "Move guardrail calls off the critical path or run them in parallel.",
        "Parallelise independent steps; stream to fix perceived latency.",
        "If the budget still cannot be met, the scope changes. Say so."
      ],
      "say": "I get the per-stage breakdown first - embedding, retrieval, reranking, prefill, decode, guardrails - because the bottleneck is rarely where people guess. If prefill dominates I cut prompt length and turn on prompt caching. If decode dominates I cap output. I move guardrail calls off the critical path, run independent steps concurrently, and stream so the user sees output early. If it still misses, the scope changes.",
      "numbers": "As a rough guide, time to first token under about a second feels responsive; several seconds of nothing and users start assuming it failed. Streaming is what buys you the difference.",
      "wrong": "\"Use a faster model.\" Sometimes correct and it should not be first. Without the breakdown you may be swapping the model when retrieval was the problem.",
      "follow": "Prefill dominates and you cannot shorten the context. Now what?",
      "followAnswer": "Then I make each request do less prefill work. Prompt caching, or prefix caching on a self-hosted server, means the shared part of the prompt is processed once and reused, which cuts time to first token directly - so stable content goes first. If self-hosted, a faster GPU or more tensor parallelism speeds prefill, and chunked prefill stops long prompts blocking other users. Meanwhile I show sources or progress while the answer is generated."
    },
    {
      "id": "cl-07",
      "q": "Cost went up 40% this month and traffic did not. What happened?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "incident",
        "monitoring",
        "debugging"
      ],
      "why": "An incident scenario. It checks whether your instrumentation could even answer the question.",
      "simple": "Traffic flat and cost up means tokens per request went up, so the question is which component grew.\n\nThe usual suspects, in the order I would check them. Context grew - someone raised the retrieved chunk count, or a document type started producing much larger chunks after an ingestion change. Retries increased, because a downstream tool or a parser started failing and every failure now costs a full extra call. Conversation history stopped being trimmed, so long sessions carry everything. An agent loop stopped terminating early and is now averaging eight steps instead of four. Prompt caching stopped hitting, because something variable - a timestamp, a user name - was moved into the stable prefix. Or output length grew after a prompt change.\n\nYou can separate these in minutes if you log tokens per request split by input and output, per feature. Without that split you are guessing.\n\nAnd the preventive answer: alert on tokens per request, not just on spend. Spend alerts arrive after the money is gone.",
      "points": [
        "Context grew - chunk count raised, or ingestion changed chunk sizes.",
        "Retries increased - a tool or parser started failing.",
        "History stopped being trimmed.",
        "Agent loops running more steps than before.",
        "Prompt caching stopped hitting - something variable entered the stable prefix.",
        "Output length grew after a prompt change.",
        "Alert on tokens per request, not only on spend."
      ],
      "say": "Traffic flat and cost up means tokens per request grew, so I check which component. Usually: retrieved context grew after a chunk-count or ingestion change; retries increased because a tool or parser started failing; history stopped being trimmed; an agent loop is averaging more steps; or prompt caching stopped hitting because something variable entered the stable prefix. Logging tokens per request split by input and output answers it in minutes.",
      "numbers": "A starting point: alert on a ~30% day-over-day move in tokens per request, tuned to your normal variance. Monthly spend alerts arrive after the money is spent.",
      "wrong": "\"I'd check the provider's billing dashboard.\" It tells you the total went up, which you already knew. The breakdown has to be in your own telemetry.",
      "follow": "You find prompt caching stopped hitting. Why would that happen silently?",
      "followAnswer": "Because a cache miss is not an error. The request still succeeds, just slower and more expensive, so nothing alerts. Usual causes: something variable moved into the prefix, like a timestamp, user name or reordered tool list; the stable part became shorter than the provider's minimum cacheable length; or traffic spread out so entries expired between calls. So I alert on the cached-token share from the usage data, not only on spend."
    },
    {
      "id": "cl-04",
      "q": "What is continuous batching and why does it matter?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "throughput",
        "vllm",
        "self-hosting"
      ],
      "why": "Self-hosting knowledge. It explains why the same GPU can serve many times more users with a modern serving engine.",
      "simple": "GPUs are efficient when processing many things at once, so serving batches requests together. The naive approach - static batching - collects a batch, runs it, and waits for every request in it to finish before starting the next.\n\nThat is badly suited to generation, because requests finish at wildly different times. One request writes 20 tokens, another writes 800, and the whole batch waits for the longest. Most of the GPU sits idle.\n\nContinuous batching works at the token level instead. When a request finishes, it leaves the batch immediately and a queued request takes its slot on the next step. The batch is continuously refilled rather than drained and refilled.\n\nThe result is a large throughput improvement on identical hardware, which is why vLLM and similar servers became standard for self-hosting. Paired with paged attention, which manages KV cache memory in blocks so you are not reserving worst-case space per request, it is what makes self-hosted serving economical at all.",
      "points": [
        "Static batching waits for the slowest request in the batch. Most of the GPU idles.",
        "Continuous batching swaps finished requests out at each token step.",
        "Large throughput gain on the same hardware.",
        "Paged attention manages KV cache in blocks - no worst-case reservation per request.",
        "Together they are why vLLM-style servers are the default for self-hosting.",
        "Throughput improves most. A lone request is not faster, but under load queueing delay drops versus static batching."
      ],
      "say": "Static batching runs a batch and waits for every request in it to finish, so one request writing 800 tokens holds up a batch where others wrote 20 - most of the GPU idles. Continuous batching works per token step: a finished request leaves immediately and a queued one takes its slot. That is a large throughput gain on the same hardware, and with paged attention managing KV cache in blocks, it is what makes self-hosting economical.",
      "numbers": "It mainly improves throughput. An isolated request decodes no faster (sometimes slightly slower in a bigger batch), but under load requests stop waiting for a batch to drain, so queueing time and p95 usually improve versus static batching.",
      "wrong": "\"vLLM makes inference faster.\" Faster how? Aggregate throughput and queueing under load improve; a single isolated request does not decode faster. That distinction is what a serving-focused interviewer is checking.",
      "follow": "So does continuous batching help my p95 for one user?",
      "followAnswer": "Not for a lone request - it decodes at the same speed, sometimes slightly slower inside a bigger batch. It helps p95 under load, because new requests join the running batch at the next step instead of waiting for a whole batch to drain. So for one user on a quiet server, no. For one user among hundreds, yes, mostly through much shorter queueing time."
    },
    {
      "id": "cl-11",
      "q": "What is PagedAttention, and why did it make vLLM fast?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "vllm",
        "kv-cache",
        "memory",
        "self-hosting"
      ],
      "why": "The standard serving-internals question when vLLM is on the JD. It checks that you know serving is limited by KV-cache memory, not only by compute.",
      "simple": "**Short version: PagedAttention stores each request's KV cache in small fixed-size blocks, like pages in computer memory, instead of one big reserved slab. Almost no memory is wasted, so the same GPU holds far more requests at once.**\n\nBackground. While generating, the model keeps a KV cache - the stored keys and values for every earlier token, so they are not recomputed (tf-03). It grows by one entry per token, and nobody knows in advance how long an answer will be.\n\nOlder servers reserved one continuous chunk of GPU memory per request, big enough for the maximum length. Most of it sat empty, and the gaps between chunks were often too small to reuse.\n\nPagedAttention borrows virtual memory from operating systems. The cache is split into blocks of, say, 16 tokens. A request gets a new block only when its last one fills up. A small block table maps each request's tokens to wherever its blocks physically sit, and the attention kernel reads through that table.\n\nTwo wins follow. Less waste means more requests fit in memory, so continuous batching (cl-04) can run bigger batches - that is where the throughput gain comes from. And blocks can be shared: requests with the same prompt prefix can point at the same blocks, which is how prefix caching works.\n\nIt does not make one request faster. It lets one GPU serve many more at once.",
      "points": [
        "The KV cache grows per token, and the final length is unknown in advance.",
        "Old approach: reserve a max-length contiguous slab per request - most of it wasted.",
        "PagedAttention: fixed-size blocks (vLLM's default is 16 tokens) plus a block table, like OS virtual memory.",
        "Less waste → more concurrent requests → bigger batches → higher throughput.",
        "Blocks can be shared across requests - the basis of prefix caching and parallel sampling.",
        "It improves capacity and throughput, not single-request speed."
      ],
      "say": "PagedAttention stores the KV cache in small fixed-size blocks instead of one contiguous slab per request, with a block table mapping each request's tokens to physical blocks, much like virtual memory. Older servers reserved space for the maximum length, and most of it sat empty. With almost no waste, far more requests fit on the GPU, so continuous batching runs bigger batches. Shared blocks also make prefix caching cheap.",
      "numbers": "The vLLM paper (Kwon et al., 2023) found earlier systems used only about 20-40% of KV-cache memory for real token data; PagedAttention cut waste to under 4% and gave roughly 2-4x higher throughput than the systems it was compared against. Your gain depends on model, lengths and load.",
      "wrong": "\"PagedAttention is a faster attention algorithm, like FlashAttention.\" It is a memory-management technique. FlashAttention speeds up the attention maths; PagedAttention stops the KV cache wasting memory. Modern servers use both.",
      "follow": "Your vLLM logs show requests being preempted. What does that mean, and what do you tune?",
      "followAnswer": "It means the KV cache ran out of free blocks, so vLLM paused some running requests and freed their blocks, to recompute them later. Those users see latency spikes. I would lower the maximum concurrent sequences or the maximum context length, give the cache more GPU memory if there is headroom, store the KV cache in FP8, or add GPUs. Then I re-run the load test and check p95."
    },
    {
      "id": "cl-08",
      "q": "You are self-hosting. Which GPU, and what do you do when the model does not fit on one?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "self-hosting",
        "gpu",
        "cost",
        "architecture"
      ],
      "why": "Anyone who claims self-hosting experience gets this. The arithmetic is simple, and every follow-up builds on it.",
      "simple": "**Short version: work out how much memory the model needs, pick the smallest setup that holds it - and ask whether you should self-host at all.**\n\nWeights first. Memory = parameters x bytes per parameter. FP16/BF16 is 2 bytes, INT8 or FP8 is 1, INT4 is half a byte. So a 7B model in FP16 is about 14 GB and a 70B is about 140 GB.\n\nThen add the KV cache - the model's stored memory of earlier tokens (tf-03). It grows with context length and with how many requests run at once. Plan at least 20-30% on top of the weights; at long context or high concurrency it can rival the weights (tf-12 has the arithmetic).\n\nMatch that to hardware. A 7B in FP16 fits a 24 GB card such as an L4 or A10G, with little room to spare. A 13B (~26 GB) needs quantising or a 48 GB card such as an L40S. A 70B in FP16 does not fit one 80 GB A100 or H100. So quantise it - INT4 (~35 GB) fits comfortably, FP8 (~70 GB) is tight - or use a bigger card (B200- or MI300X-class GPUs have roughly 180-192 GB), or split it across GPUs.\n\nSplitting comes in two forms. Tensor parallelism splits each layer across GPUs; they talk on every token, so it needs fast links like NVLink inside one machine. Pipeline parallelism puts different layers on different GPUs; it works across machines, but GPUs sit idle waiting for each other, so throughput per GPU drops. Default to tensor parallelism within a node.\n\nThe senior answer: most enterprise workloads should not self-host a 70B at all. Quantise a smaller model or use an API, unless residency, volume or fine-tuning genuinely require it (cl-05).",
      "points": [
        "Weights = parameters x bytes/param. FP16/BF16 is 2, INT8/FP8 is 1, INT4 is 0.5.",
        "7B FP16 is ~14 GB; 70B FP16 is ~140 GB - too big for any 80 GB card.",
        "Add at least 20-30% for KV cache; far more at long context or high concurrency.",
        "7B FP16: one 24 GB L4/A10G. 13B: quantise, or a 40-48 GB card. 70B: INT4 on one 80 GB card, or shard.",
        "Tensor parallelism splits layers across GPUs - needs NVLink, use within a node.",
        "Pipeline parallelism splits by layer across machines - tolerates slow links, adds idle bubbles.",
        "The senior answer: most workloads should quantise a smaller model or use an API instead."
      ],
      "say": "First the arithmetic: weights are parameters times bytes per parameter, so 7B in FP16 is about 14 GB and 70B about 140 GB, plus twenty to thirty percent or more for KV cache. A 7B fits one 24 GB L4; a 70B fits no 80 GB card, so I quantise - INT4 fits comfortably - or shard, with tensor parallelism inside a node and pipeline across nodes. Usually, though, the right answer is a smaller model or an API.",
      "numbers": "Rule of thumb: plan usable GPU memory at roughly 1.3x the weights or more. On an 80 GB H100, a 70B in INT4 (~35 GB) is comfortable, INT8/FP8 (~70 GB) is tight, and FP16 does not fit.",
      "wrong": "Naming a GPU before doing the memory arithmetic. The panel wants to see you size the model, not recall a product page.",
      "follow": "You sharded across four GPUs and throughput barely improved. What went wrong?",
      "followAnswer": "Usually communication or not enough load. If the GPUs talk over PCIe instead of NVLink, tensor parallelism spends much of each step waiting on data transfer. If the model already fitted on fewer GPUs, sharding only added overhead - running separate replicas would scale better. And if concurrency is low, there is no batch to spread. I would check interconnect, GPU utilisation and batch size, then compare against two replicas on two GPUs each."
    },
    {
      "id": "cl-09",
      "q": "vLLM, TensorRT-LLM, Triton and ONNX Runtime - what problem does each solve?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "serving",
        "vllm",
        "tensorrt",
        "triton",
        "onnx",
        "inference"
      ],
      "why": "Senior ML/AI postings increasingly name high-performance inference stacks, not only hosted model APIs.",
      "simple": "I separate the model engine from the serving layer.\n\n`vLLM` is an LLM-focused serving engine. It is built for high-throughput generation and manages batching and KV-cache memory efficiently. SGLang is a comparable open-source engine.\n\n`TensorRT-LLM` is NVIDIA's optimisation and runtime stack for getting strong inference performance from supported LLMs on NVIDIA GPUs. It is worth the extra build and tuning work when hardware-specific speed matters.\n\n`Triton Inference Server` (renamed NVIDIA Dynamo-Triton in 2025, part of NVIDIA's Dynamo platform) is broader. It hosts different model backends, handles model versions and batching, and exposes production inference endpoints. It can wrap an optimised backend rather than replace it. NVIDIA Dynamo itself is the newer layer for distributed LLM serving: it can run vLLM, SGLang or TensorRT-LLM underneath and split prefill and decode across different GPUs.\n\n`ONNX Runtime` runs models exported to the ONNX format across different hardware. It is common when portability matters, especially for smaller and non-LLM models.\n\nI choose from the model architecture, hardware, latency and throughput target, portability needs and the team's operating cost - then benchmark the real workload.",
      "points": [
        "vLLM: LLM-focused high-throughput serving engine.",
        "TensorRT-LLM: NVIDIA-focused optimisation/runtime for supported LLMs.",
        "Triton (now Dynamo-Triton): production model server that can host multiple backends.",
        "ONNX Runtime: portable runtime for models exported to ONNX.",
        "Benchmark your model, hardware, batch shape and latency target before choosing."
      ],
      "say": "I separate the engine from the server. vLLM is an LLM-focused serving engine for high-throughput generation and KV-cache management. TensorRT-LLM is a more NVIDIA-specific optimisation and runtime path when squeezing GPU performance matters. Triton is a broader production inference server that can host different backends and model versions. ONNX Runtime is useful for portable execution of exported models. I choose by model, hardware, latency, throughput and operating complexity, then benchmark the real traffic shape.",
      "numbers": "Do not promise a universal speedup. Throughput changes sharply with model size, prompt/output lengths, batch/concurrency and GPU type; benchmark the workload you will actually serve.",
      "wrong": "Treating all four as interchangeable LLM servers. They live at different layers and optimise different constraints.",
      "follow": "Your benchmark shows higher throughput but much worse p99 latency. What serving knob or queue behaviour do you inspect next?"
    }
  ]
};
