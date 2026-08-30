/* Topic 14 - Cost, latency, throughput and serving.
   Grounding: public JDs asking for production ownership and cost accountability,
   plus documented serving behaviour. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["14-cost-latency"] = {
  lede: "At retail scale and in services firms this topic can be the whole technical conversation, because the margin lives here. The questions are simple to state and easy to answer badly: every one of them wants a number, a measured breakdown, and a trade you made on purpose.",
  grounding: "public JDs requiring cost accountability + documented serving behaviour",
  evening: ["cl-01", "cl-03", "cl-05", "cl-07"],

  cards: [
    {
      id: "cl-01",
      q: "How do you work out the cost of a GenAI feature?",
      round: ["screening", "tech1", "manager"],
      level: "5-10",
      tags: ["cost", "estimation", "business"],
      why: "A commercial-literacy check. Many strong engineers have never done this arithmetic.",
      simple:
        "Cost per request, then multiply by volume - and the part people get wrong is what goes into the per-request number.\n\n" +
        "Input tokens are usually the biggest line, and they are mostly not the user's question. They are the system prompt, the tool definitions, the conversation history and, dominating everything, the retrieved context. Output tokens are priced higher per token but there are usually far fewer of them.\n\n" +
        "Then add what people forget: the embedding call on every query, the reranker call, any guardrail or judge model calls, retries, and reasoning tokens if you are on a reasoning model. In an agent, multiply by the number of loop steps, because every step re-sends the whole history.\n\n" +
        "Then the number that actually matters in a business conversation: cost per completed task, not cost per call. A cheaper model that needs two attempts and an escalation is not cheaper, and expressing it this way is what lets you win an argument about model choice.",
      points: [
        "Input tokens dominate, and retrieved context dominates input.",
        "Add embeddings, reranking, guardrail and judge calls, retries, reasoning tokens.",
        "In an agent, multiply by loop steps - each step re-sends the full history.",
        "Report cost per completed task, not per call.",
        "Split the dashboard by feature and by tenant. One feature is usually most of the bill."
      ],
      say: "Cost per request times volume, but the per-request number has to include everything: system prompt, tool definitions, history and retrieved context, which usually dominates, plus embedding, reranking, guardrail calls, retries and reasoning tokens. In an agent I multiply by loop steps, since each step re-sends the whole history. Then I report cost per completed task, because a cheap model needing two attempts is not cheap.",
      numbers: "Worked example: 4 chunks × 600 tokens = 2,400 context tokens, plus ~600 of prompt and history, ~500 output. At 10,000 requests a day that is 30M input and 5M output tokens a month - price it against your provider's current rates.",
      wrong: "Quoting only the model's per-token price. It ignores embeddings, reranking, guardrails and retries, which together are often a third of the bill.",
      follow: "Where would you look first to cut that number by half?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-02",
      q: "Your p95 latency is 6 seconds and the budget is 3. What do you cut?",
      round: ["tech2"],
      level: "5-10",
      tags: ["latency", "optimisation", "debugging"],
      why: "A diagnostic scenario. It marks whether you measure before cutting.",
      simple:
        "First get the breakdown, because the answer is almost never where people guess. A trace should give you time in embedding, retrieval, reranking, prefill, decode, and any guardrail calls.\n\n" +
        "Then attack by size. If prefill dominates, the prompt is too long - rerank to fewer chunks, trim boilerplate, and enable provider prompt caching on the stable prefix, which cuts prefill directly. If decode dominates, the output is too long - cap it, and ask whether the user needs three paragraphs. If retrieval dominates, look at the index, the filters and whether the reranker is running on too many candidates. If a guardrail model call is in the critical path, move it off the path or run it in parallel.\n\n" +
        "Then the two structural moves. Run independent steps concurrently rather than in sequence - embedding and a metadata lookup do not need to wait for each other. And stream, which does not reduce total time but changes what the user experiences, because time to first token is what people actually feel.\n\n" +
        "And say the honest thing: if the budget still cannot be met, the feature scope has to change.",
      points: [
        "Get the per-stage breakdown first. The bottleneck is rarely where you guess.",
        "Prefill-bound → shorter prompt, fewer chunks, prompt caching.",
        "Decode-bound → cap output length; ask whether the length is needed.",
        "Retrieval-bound → index, filters, reranker candidate count.",
        "Move guardrail calls off the critical path or run them in parallel.",
        "Parallelise independent steps; stream to fix perceived latency.",
        "If the budget still cannot be met, the scope changes. Say so."
      ],
      say: "I get the per-stage breakdown first - embedding, retrieval, reranking, prefill, decode, guardrails - because the bottleneck is rarely where people guess. If prefill dominates I cut prompt length and turn on prompt caching. If decode dominates I cap output. I move guardrail calls off the critical path, run independent steps concurrently, and stream so the user sees output early. If it still misses, the scope changes.",
      numbers: "Time to first token under about 1 second reads as responsive. Past 3 seconds users assume failure, whatever the total time is.",
      wrong: "\"Use a faster model.\" Sometimes correct and it should not be first. Without the breakdown you may be swapping the model when retrieval was the problem.",
      follow: "Prefill dominates and you cannot shorten the context. Now what?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-03",
      q: "How does caching work in a GenAI system, and where do you apply it?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["cost", "caching", "latency"],
      why: "The biggest single cost lever, with several distinct layers most candidates conflate.",
      simple:
        "Four different caches, and they are not the same thing.\n\n" +
        "Provider prompt caching: the provider keeps the processed form of a stable prompt prefix, so repeated requests skip re-processing it. It cuts input cost and prefill latency together, and it needs your stable content - system prompt, tool definitions, few-shot examples - placed first, before anything that varies. Getting the order wrong silently disables it.\n\n" +
        "Embedding cache: the same query text embedded repeatedly. Key on text plus embedding model version.\n\n" +
        "Exact-match answer cache: the same question asked again. Cheap and effective for FAQ-shaped traffic, and the key must include the user's entitlements and a corpus version, or you serve leaked or stale answers.\n\n" +
        "Semantic cache: near-identical questions match. Powerful, and risky - a loose threshold serves the answer to a different question, which users notice far faster than any saving pays for.\n\n" +
        "Start with provider prompt caching. It is the safest and usually the largest win.",
      points: [
        "Provider prompt caching - stable prefix first. Cuts cost and prefill together.",
        "Embedding cache - key on text plus model version.",
        "Exact-match answer cache - key must include entitlements and corpus version.",
        "Semantic cache - high threshold, or it answers a different question.",
        "Start with prompt caching: safest, usually biggest.",
        "Anything varying placed before the stable prefix silently kills the cache hit."
      ],
      /* Four caches on one request path, in the order a request meets them.
         Drawn as a path rather than a list because the card's whole point is
         that they are different layers doing different jobs - and a list is
         exactly what lets a candidate conflate them. */
      diagram: {
        alt: "Where the four caches sit on a request path: answer and semantic cache, embedding cache, then provider prompt caching at the model call.",
        rows: [
          [{ id: "q", label: "Query" }],
          [{ id: "ans", label: "Exact answer cache", note: "key: question + entitlements + corpus ver", accent: "warn" },
           { id: "sem", label: "Semantic cache", note: "high threshold, or it answers another question", accent: "bad" }],
          [{ id: "emb", label: "Embedding cache", note: "key: text + model version" },
           { id: "ret", label: "Retrieve" }],
          [{ id: "model", label: "Model call - provider prompt cache", note: "stable prefix FIRST", accent: "accent" }],
          [{ id: "out", label: "Answer", accent: "accent" }]
        ],
        edges: [
          { from: "q", to: "ans" },
          { from: "ans", to: "sem", label: "miss" },
          { from: "sem", to: "emb", label: "miss" },
          { from: "emb", to: "ret" },
          { from: "ret", to: "model" },
          { from: "model", to: "out" },
          { from: "ans", to: "out", label: "hit" }
        ],
        caption: "**Start at the bottom.** Provider prompt caching is the safest and usually the largest win, and it only works if your stable content - system prompt, tool definitions, few-shot examples - sits before anything that varies. The two coloured boxes are where answers leak or go stale: both keys must carry the user's entitlements."
      },
      say: "Four layers. Provider prompt caching keeps the processed stable prefix, cutting input cost and prefill latency together - but the stable content has to come first or the cache never hits. Embedding cache keyed on text plus model version. Exact-match answer cache, keyed to include entitlements and corpus version, or it leaks or goes stale. And semantic caching, which needs a high threshold. I start with prompt caching.",
      numbers: "Prompt caching typically discounts cached input tokens substantially and cuts time to first token. Check your provider's current rate rather than quoting one from memory.",
      wrong: "\"We cache the responses.\" Which cache, keyed on what? Keyed on question text alone, it is both a staleness bug and a data leak.",
      follow: "A timestamp in your system prompt. What does that do to your cache hit rate?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-04",
      q: "What is continuous batching and why does it matter?",
      round: ["tech2"],
      level: "5-10",
      tags: ["serving", "throughput", "vllm", "self-hosting"],
      why: "Self-hosting knowledge. It is the difference between a GPU at 20% utilisation and one at 80%.",
      simple:
        "GPUs are efficient when processing many things at once, so serving batches requests together. The naive approach - static batching - collects a batch, runs it, and waits for every request in it to finish before starting the next.\n\n" +
        "That is badly suited to generation, because requests finish at wildly different times. One request writes 20 tokens, another writes 800, and the whole batch waits for the longest. Most of the GPU sits idle.\n\n" +
        "Continuous batching works at the token level instead. When a request finishes, it leaves the batch immediately and a queued request takes its slot on the next step. The batch is continuously refilled rather than drained and refilled.\n\n" +
        "The result is a large throughput improvement on identical hardware, which is why vLLM and similar servers became standard for self-hosting. Paired with paged attention, which manages KV cache memory in blocks so you are not reserving worst-case space per request, it is what makes self-hosted serving economical at all.",
      points: [
        "Static batching waits for the slowest request in the batch. Most of the GPU idles.",
        "Continuous batching swaps finished requests out at each token step.",
        "Large throughput gain on the same hardware.",
        "Paged attention manages KV cache in blocks - no worst-case reservation per request.",
        "Together they are why vLLM-style servers are the default for self-hosting.",
        "Throughput improves; single-request latency does not."
      ],
      say: "Static batching runs a batch and waits for every request in it to finish, so one request writing 800 tokens holds up a batch where others wrote 20 - most of the GPU idles. Continuous batching works per token step: a finished request leaves immediately and a queued one takes its slot. That is a large throughput gain on the same hardware, and with paged attention managing KV cache in blocks, it is what makes self-hosting economical.",
      numbers: "It improves throughput, not single-request latency. If you are optimising one user's wait, this is the wrong lever.",
      wrong: "\"vLLM makes inference faster.\" Faster in aggregate throughput, not for a single request. That distinction is exactly what a serving-focused interviewer is checking.",
      follow: "So does continuous batching help my p95 for one user?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-05",
      q: "Self-host or use an API? How do you decide?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["cost", "serving", "architecture", "trade-off"],
      why: "A real architecture and budget decision, common at Indian centres where cost pressure is explicit.",
      simple:
        "Constraints first, then economics, and say them in that order because half the time the constraints decide it before cost is discussed.\n\n" +
        "Constraints: does data residency or a contract forbid sending data to a provider; do you need a model no API offers; do you need guaranteed capacity rather than shared rate limits.\n\n" +
        "Then the economics, which are volume-dependent. An API costs per token with no fixed cost, so at low or bursty volume it is far cheaper. Self-hosting is a fixed GPU cost whether you use it or not, so it wins only above a break-even utilisation - and the honest version includes the engineering time: serving stack, autoscaling, monitoring, upgrades, and someone on call.\n\n" +
        "The pattern that usually wins in practice: API for the frontier model on hard tasks, self-hosted small model for the high-volume narrow work. Most traffic is narrow.\n\n" +
        "And name the break-even as a number you would calculate, rather than asserting a threshold you half-remember.",
      points: [
        "Constraints first: residency, contracts, model availability, guaranteed capacity.",
        "API - pure variable cost, wins at low or bursty volume.",
        "Self-hosting - fixed cost, wins above a break-even utilisation.",
        "Count engineering time and on-call in the self-hosting cost. It is not free.",
        "Common answer: API for hard tasks, self-hosted small model for high-volume narrow work.",
        "Calculate the break-even for your volume rather than quoting a rule of thumb."
      ],
      say: "Constraints first - residency, contract terms, model availability, guaranteed capacity - because those often decide it before cost comes up. Then economics: an API is pure variable cost and wins at low or bursty volume, while self-hosting is fixed cost and only wins above a break-even utilisation, including the engineering time and on-call. The split that usually wins is API for hard tasks and a self-hosted small model for high-volume narrow work.",
      numbers: "A GPU costs the same idle as busy - that is the whole break-even argument. Compute yours from your actual duty cycle, not a blog post's threshold.",
      wrong: "\"Self-hosting is cheaper.\" Only above a utilisation you have not stated, and only if the engineering time is free, which it never is.",
      follow: "What utilisation would you need to justify a dedicated GPU?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-06",
      q: "How do you route between a cheap and an expensive model?",
      round: ["tech2"],
      level: "5-10",
      tags: ["cost", "routing", "architecture"],
      why: "The highest-leverage cost technique in most pipelines, and it needs real design thinking.",
      simple:
        "The premise is that traffic is not uniform. Most requests are easy and a minority are hard, and paying frontier prices for the easy majority is where most GenAI budgets go.\n\n" +
        "The simplest routing that works is by task, not by difficulty. Classification, extraction, routing, query rewriting and summarisation of short text go to a small model. Final generation on a complex question goes to the large one. This needs no classifier and no judgement - it is a design decision you make once.\n\n" +
        "Above that, difficulty routing: a cheap classifier or heuristic estimates whether this request needs the large model. Input length, question type, the retrieval score and the user's tier are all useful signals.\n\n" +
        "Then the fallback pattern: try the small model, check the output with a cheap validator, and escalate to the large model only if it fails. You pay for the large model only on the requests that needed it.\n\n" +
        "And evaluate the router itself, because a routing error looks exactly like a quality failure and gets debugged in the wrong place.",
      points: [
        "Route by task first - no classifier needed, decided once.",
        "Then by difficulty, using input length, question type, retrieval score, user tier.",
        "Try-small-then-escalate: pay for the big model only when the small one fails.",
        "Evaluate the router separately. Routing errors masquerade as quality failures.",
        "Track cost per completed task after routing, not per call - escalations count."
      ],
      say: "Most traffic is easy and a minority is hard, so paying frontier prices for the majority is where budgets go. I route by task first - classification, extraction, rewriting and short summarisation go to a small model, final generation on hard questions to the large one. Then by difficulty using length, question type and retrieval score. And try-small-then-escalate, so I pay for the big model only when needed.",
      numbers: "Price tiers commonly differ by 10–20×. Moving the high-volume narrow steps down a tier is usually the largest single saving available.",
      wrong: "\"We use the cheaper model everywhere.\" That trades a cost problem for a quality problem, and the escalations and retries often erase the saving.",
      follow: "Your router sends 30% to the expensive model. How would you get that to 10%?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-07",
      q: "Cost went up 40% this month and traffic did not. What happened?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["cost", "incident", "monitoring", "debugging"],
      why: "An incident scenario. It checks whether your instrumentation could even answer the question.",
      simple:
        "Traffic flat and cost up means tokens per request went up, so the question is which component grew.\n\n" +
        "The usual suspects, in the order I would check them. Context grew - someone raised the retrieved chunk count, or a document type started producing much larger chunks after an ingestion change. Retries increased, because a downstream tool or a parser started failing and every failure now costs a full extra call. Conversation history stopped being trimmed, so long sessions carry everything. An agent loop stopped terminating early and is now averaging eight steps instead of four. Prompt caching stopped hitting, because something variable - a timestamp, a user name - was moved into the stable prefix. Or output length grew after a prompt change.\n\n" +
        "You can separate these in minutes if you log tokens per request split by input and output, per feature. Without that split you are guessing.\n\n" +
        "And the preventive answer: alert on tokens per request, not just on spend. Spend alerts arrive after the money is gone.",
      points: [
        "Context grew - chunk count raised, or ingestion changed chunk sizes.",
        "Retries increased - a tool or parser started failing.",
        "History stopped being trimmed.",
        "Agent loops running more steps than before.",
        "Prompt caching stopped hitting - something variable entered the stable prefix.",
        "Output length grew after a prompt change.",
        "Alert on tokens per request, not only on spend."
      ],
      say: "Traffic flat and cost up means tokens per request grew, so I check which component. Usually: retrieved context grew after a chunk-count or ingestion change; retries increased because a tool or parser started failing; history stopped being trimmed; an agent loop is averaging more steps; or prompt caching stopped hitting because something variable entered the stable prefix. Logging tokens per request split by input and output answers it in minutes.",
      numbers: "Alert on a 30% day-over-day move in tokens per request. Monthly spend alerts arrive after the money is spent.",
      wrong: "\"I'd check the provider's billing dashboard.\" It tells you the total went up, which you already knew. The breakdown has to be in your own telemetry.",
      follow: "You find prompt caching stopped hitting. Why would that happen silently?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "cl-08",
      q: "You are self-hosting. Which GPU, and what do you do when the model does not fit on one?",
      round: ["tech2"],
      level: "5-10",
      tags: ["serving", "self-hosting", "gpu", "cost", "architecture"],
      why: "Anyone who claims self-hosting experience gets this. The arithmetic is simple and not knowing it is disqualifying.",
      simple:
        "Start with the arithmetic, because it is the part being tested. Weights are parameters times bytes per parameter: FP16 is two bytes, INT8 one, INT4 half. So a 7B model in FP16 is about 14 GB, a 70B is about 140 GB. Then add the KV cache, which scales with batch size and sequence length and is what actually kills you at long context - plan roughly 20-30% headroom, more if you serve long prompts.\n\n" +
        "Now match that to hardware. A 7B or 13B model fits comfortably on a single A10G or L4. A 70B in FP16 does not fit on any single GPU - an 80 GB A100 or H100 is not enough - so you either quantise it to INT8 and squeeze onto one 80 GB card, or you shard it.\n\n" +
        "Sharding has two forms and interviewers like the distinction. Tensor parallelism splits each layer across GPUs; every token requires communication between them, so it needs fast interconnect like NVLink and is what you use inside one machine. Pipeline parallelism puts different layers on different GPUs; it tolerates slower links and works across machines, but it introduces bubbles where GPUs idle, so throughput per GPU is worse. Default to tensor parallelism within a node, pipeline only when you must cross nodes.\n\n" +
        "Then the answer that scores highest: for most Indian enterprise workloads the honest recommendation is not to self-host a 70B at all. Quantise a smaller model, or use an API, and self-host only when data residency, volume or fine-tuning genuinely require it - which is exactly the cl-05 argument.",
      points: [
        "Weights = parameters x bytes/param. FP16 is 2, INT8 is 1, INT4 is 0.5.",
        "7B FP16 is ~14 GB; 70B FP16 is ~140 GB and fits on no single GPU.",
        "Add 20-30% for KV cache; it grows with batch size and context length.",
        "7B/13B: a single A10G or L4. 70B: quantise to fit 80 GB, or shard.",
        "Tensor parallelism splits layers across GPUs - needs NVLink, use within a node.",
        "Pipeline parallelism splits by layer across machines - tolerates slow links, adds idle bubbles.",
        "The senior answer: most workloads should quantise a smaller model or use an API instead."
      ],
      say: "First the arithmetic: weights are parameters times bytes per parameter, so 7B in FP16 is about 14 GB and 70B is about 140 GB, plus twenty to thirty percent for KV cache. A 7B fits one A10G; a 70B fits no single GPU, so I quantise to INT8 for an 80 GB card or shard it. Tensor parallelism within a node where NVLink is available, pipeline across nodes. Usually though, the right answer is a smaller model or an API.",
      numbers: "Rule of thumb: usable GPU memory should be roughly 1.3x the model weights. An 80 GB H100 comfortably serves a quantised 70B; in FP16 it does not.",
      wrong: "Naming a GPU before doing the memory arithmetic. The panel wants to see you size the model, not recall a product page.",
      follow: "You sharded across four GPUs and throughput barely improved. What went wrong?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
  ]
};
