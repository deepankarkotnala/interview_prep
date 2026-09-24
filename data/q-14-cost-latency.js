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
      "quick": [
        "Work out cost per request, then multiply by volume.",
        "Most input is instructions, history and fetched documents.",
        "Add search, checking and judge calls, retries and thinking.",
        "In an agent, every step resends the whole history.",
        "Report cost per finished task, not per call."
      ],
      "simple": "The cost of a GenAI feature is cost per request multiplied by volume, but the real work is getting the per-request number right. Input tokens are usually the biggest line, and most of them are the system prompt, history and, above all, retrieved context. Then you add what people forget, like embedding and reranker calls, guardrail calls, retries and, in an agent, every loop step, since each one re-sends the whole history.\n\nFor example, 4 chunks of 600 tokens plus prompt and history come to about 3,000 input tokens and 500 output tokens per request. At 10,000 requests a day, that's 30 million input tokens daily, which you price against your provider's current rates.\n\nIn a business conversation, the number that matters is cost per completed task, not per call, because a cheaper model that needs two attempts isn't actually cheaper.",
      "points": [
        "Input tokens dominate, and retrieved context dominates input.",
        "Add embeddings, reranking, guardrail and judge calls, retries, reasoning tokens.",
        "In an agent, multiply by loop steps - each step re-sends the full history.",
        "Report cost per completed task, not per call.",
        "Split the dashboard by feature and by tenant. One feature is usually most of the bill."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "The parts of one request's cost: system prompt and tools, history, retrieved context, output tokens, and extra calls, multiplied by agent steps.",
        "top": "one request",
        "bottom": "x volume = the bill",
        "layers": [
          {
            "label": "System prompt, tools",
            "note": "stable prefix, cacheable"
          },
          {
            "label": "Conversation history",
            "note": "grows unless trimmed"
          },
          {
            "label": "Retrieved context",
            "note": "usually the biggest line",
            "accent": "warn"
          },
          {
            "label": "Output tokens",
            "note": "pricier, but far fewer"
          },
          {
            "label": "Extra calls",
            "note": "embed, rerank, judges, retries",
            "accent": "warn"
          },
          {
            "label": "x agent loop steps",
            "note": "each resends full history",
            "accent": "bad"
          }
        ],
        "caption": "Input tokens dominate, and **retrieved context dominates input**. Report **cost per completed task**, not per call - retries and escalations count."
      },
      "say": "Cost per request times volume, but the real work is getting the per-request number right. Input tokens are usually the biggest line, and most of them aren't the user's question. They're the system prompt, tool definitions, conversation history and, above all, retrieved context. Output tokens cost more each, but there are far fewer. Then I add what people forget: embedding and reranker calls, guardrail and judge calls, retries, and reasoning tokens on a reasoning model. In an agent I multiply by loop steps, since every step resends the whole history. Here's a quick worked version. Four 600-token chunks plus prompt and history come to about 3,000 input tokens, with maybe 500 out. At 10,000 requests a day that's 30 million input tokens daily, around 900 million a month. I price that at current rates, with prompt caching discounting the repeated prefix. What I bring to the business is cost per completed task, because a cheaper model needing two attempts and an escalation isn't cheaper.",
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
      "quick": [
        "TTFT is the wait before the first word appears.",
        "TPOT and ITL measure how fast words come after that.",
        "One long pause between words feels like a freeze.",
        "Throughput is total work per second across all users.",
        "Log times per request and report slowest cases, not averages."
      ],
      "simple": "These terms describe two things, the speed one user feels and the total work the system does. TTFT, or time to first token, is the wait before anything appears. It includes queueing, retrieval and prefill, where the model reads the whole prompt. TPOT, or time per output token, is the average pace after that, and ITL, or inter-token latency, is the gap between two tokens, where one long pause feels like a freeze.\n\nThroughput is total tokens or requests per second across all users, and it trades against per-user speed, because a bigger batch serves more people but each waits a little longer per token.\n\nTo measure them, you log received, first-token and last-token timestamps per request and report p50, p95 and p99, never averages. For example, a common chat target is TTFT under about one second at p95.",
      "points": [
        "**TTFT**: queueing + pre-model steps + prefill. What users feel most.",
        "**TPOT**: average time per output token after the first. **ITL**: gap between consecutive tokens - watch the tail.",
        "End-to-end latency ≈ TTFT + TPOT x (output tokens - 1).",
        "**Throughput**: tokens or requests per second across all users - it trades against per-user speed.",
        "Report p50/p95/p99 from per-request timestamps, never just the average.",
        "Load-test self-hosted serving at real lengths and concurrency (`vllm bench serve`, AIPerf) and track **goodput**."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Timeline of one request: queue, pre-model steps and prefill make up TTFT; then decode produces tokens at the TPOT pace until the last token.",
        "lanes": [
          {
            "label": "Queue",
            "note": "busy servers add wait"
          },
          {
            "label": "Retrieval etc.",
            "note": "pre-model steps"
          },
          {
            "label": "Prefill",
            "note": "reads whole prompt",
            "accent": "warn"
          },
          {
            "label": "First token",
            "note": "TTFT ends here",
            "accent": "accent"
          },
          {
            "label": "Decode",
            "note": "TPOT, ITL per token"
          },
          {
            "label": "Last token",
            "note": "end-to-end latency"
          }
        ],
        "caption": "**TTFT** = queue + pre-model steps + prefill; users feel it most. End-to-end is about **TTFT + TPOT x (tokens - 1)**. Report p50/p95/p99, never averages."
      },
      "say": "TTFT and TPOT describe the speed one user feels, and throughput is the total work the system does across everyone. TTFT, time to first token, is the wait before anything appears. It covers queueing, steps like retrieval, and prefill, where the model reads the whole prompt, so long prompts and busy servers hurt it. TPOT, time per output token, is the average pace after that, and ITL, inter-token latency, is the gap between consecutive tokens. With ITL I watch the tail, since one long pause feels like a freeze. End-to-end latency is roughly TTFT plus TPOT times the remaining tokens. Throughput trades against per-user speed, because a bigger batch serves more people per GPU but each waits a little longer per token. To measure, I log received, first-token and last-token timestamps with token counts, and report p50, p95 and p99, never averages. For self-hosting, I load-test at realistic lengths and concurrency and track goodput, the share of requests meeting every target.",
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
      "quick": [
        "There are four different kinds of cache.",
        "Reuse the fixed prompt opening, keeping it first.",
        "Save search results for repeated text.",
        "Save answers to repeated questions, keyed by user permissions.",
        "Matching similar questions is risky, start with prompt reuse."
      ],
      "simple": "There are four separate caches in a GenAI system, and mixing them up is the usual mistake. Provider prompt caching keeps the processed form of a stable prompt prefix, so repeated requests skip re-reading it, which cuts cost and latency. It only works if stable content comes first. For example, putting a timestamp ahead of the system prompt silently kills every cache hit.\n\nAn embedding cache avoids embedding the same text twice. An exact-match answer cache suits FAQ-style traffic, but its key must include the user's entitlements and a corpus version, or you serve leaked or stale answers. A semantic cache matches near-identical questions, but a loose threshold hands someone the answer to a different question.\n\nSo you start with provider prompt caching, since it's the safest layer and usually the biggest win.",
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
      "say": "There are four separate caches, and mixing them up is the usual mistake. Provider prompt caching keeps the processed form of a stable prompt prefix, so repeat requests skip re-reading it. That cuts input cost and prefill latency together, but only if the stable part, the system prompt, tool definitions and examples, comes first. Put a timestamp ahead of it and every hit silently disappears. An embedding cache avoids re-embedding the same text, keyed on the text plus the embedding model version. An exact-match answer cache suits FAQ-shaped traffic, but the key must include the user's entitlements and a corpus version, or it serves leaked or stale answers. A semantic cache matches near-identical questions. It's powerful and risky, because a loose threshold hands someone the answer to a different question, and users notice that far faster than any saving pays for. So I start with prompt caching. It's the safest layer and usually the biggest win.",
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
      "quick": [
        "Most requests are easy, so do not pay top prices.",
        "First route by task, small jobs go to a small model.",
        "Then route by difficulty using length and question type.",
        "Try the small model and upgrade only if its answer fails.",
        "Test the router itself and track cost per finished task."
      ],
      "simple": "Routing between models starts from one fact, which is that most requests are easy and only a minority are hard. Paying frontier prices for the easy majority is where most GenAI budgets go, and the smallest and largest tiers often differ by roughly 5-25 times per token.\n\nThe simplest routing is by task. Classification, extraction and query rewriting go to a small model, while final answers to complex questions go to the large one. Above that sits difficulty routing, where a cheap classifier estimates whether a request needs the large model. There's also the fallback pattern, where the small model tries first, a cheap validator checks it, and you escalate only if it fails.\n\nFor example, a support assistant can let a small model answer order-status questions and escalate only when the validator finds a missing citation.",
      "points": [
        "Route by task first - no classifier needed, decided once.",
        "Then by difficulty, using input length, question type, retrieval score, user tier.",
        "Try-small-then-escalate: pay for the big model only when the small one fails.",
        "Evaluate the router separately. Routing errors masquerade as quality failures.",
        "Track cost per completed task after routing, not per call - escalations count."
      ],
      "diagram": {
        "alt": "Routing flow: narrow tasks go to a small model whose output is checked by a cheap validator; passes are delivered and failures escalate to the large model.",
        "rows": [
          [
            {
              "id": "r",
              "label": "Route by task",
              "note": "hard tasks go straight to large"
            }
          ],
          [
            {
              "id": "s",
              "label": "Small model",
              "note": "extract, classify, rewrite",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "v",
              "label": "Cheap validator"
            }
          ],
          [
            {
              "id": "ok",
              "label": "Deliver",
              "accent": "accent"
            },
            {
              "id": "l",
              "label": "Large model",
              "note": "failures, plus hard tasks",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "r",
            "to": "s",
            "label": "narrow task"
          },
          {
            "from": "s",
            "to": "v"
          },
          {
            "from": "v",
            "to": "ok",
            "label": "pass"
          },
          {
            "from": "v",
            "to": "l",
            "label": "fail: escalate"
          }
        ],
        "caption": "Pay for the big model **only where it was needed**. Evaluate the router itself - a routing error looks exactly like a quality failure."
      },
      "say": "Traffic isn't uniform, so I route. Most requests are easy, and paying frontier prices for the easy majority is where most budgets go. The simplest routing is by task, and it needs no classifier. Classification, extraction, query rewriting and short summaries go to a small model, while the final answer on a complex question goes to the large one. That's a design decision made once. Above that sits difficulty routing, where cheap signals like input length, question type, retrieval score and user tier decide whether a request needs the big model. Then there's the fallback pattern. The small model tries first, a cheap validator checks its output, and only failures escalate, so I pay for the large model only where it was needed. The thing juniors miss is evaluating the router itself, because a routing error looks exactly like a quality failure and gets debugged in the wrong place. And I measure cost per completed task, escalations included.",
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
      "quick": [
        "Check rules first, like where data may be stored.",
        "An API charges per use, best for low or uneven volume.",
        "Own hardware costs the same busy or idle.",
        "Count the engineering and on-call time too.",
        "Often mix, API for hard tasks, small model for bulk work."
      ],
      "simple": "To decide between self-hosting and an API, you check constraints first, because they often settle it. Does a contract or data residency rule forbid sending data out? Do you need a model no API offers, or guaranteed capacity?\n\nIf not, it comes down to volume. An API charges per token with no fixed cost, so it's far cheaper at low or bursty volume. A GPU costs the same idle as busy, so self-hosting only wins above a break-even utilisation, and the honest sum includes the engineering time to run it. There's also a middle option, managed endpoints for open-weight models, billed per token without running GPUs.\n\nThe usual winner is a mix. For example, a company might use a frontier API for complex contract questions while a small open model classifies millions of support tickets a day.",
      "points": [
        "Constraints first: residency, contracts, model availability, guaranteed capacity.",
        "API - pure variable cost, wins at low or bursty volume.",
        "Self-hosting - fixed cost, wins above a break-even utilisation.",
        "Count engineering time and on-call in the self-hosting cost. It is not free.",
        "Middle option: managed per-token endpoints for open-weight models.",
        "Common answer: API for hard tasks, small self-hosted or managed model for high-volume narrow work.",
        "Calculate the break-even for your volume rather than quoting a rule of thumb."
      ],
      "say": "Constraints first, then economics, because the constraints often settle it before cost comes up. Does residency or a contract forbid sending data to a provider? Do we need a model no API offers, or guaranteed capacity instead of shared rate limits? If none of that forces the choice, it comes down to volume. An API charges per token with no fixed cost, so it wins at low or bursty volume. A GPU costs the same idle as busy, so self-hosting only wins above a break-even utilisation. That figure has to include engineering time for the serving stack, autoscaling, upgrades and on-call, which is never free. People also forget the middle option, managed per-token endpoints for open-weight models, where we get the model without running GPUs. The pattern that usually wins is an API for the frontier model on hard tasks and a small self-hosted or managed model for the high-volume narrow work. And I'd calculate the break-even from our real volume, not quote a rule of thumb.",
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
      "quick": [
        "Measure how long each stage takes before cutting.",
        "Long prompt means send fewer, better document pieces.",
        "Long answers mean cap the reply length.",
        "Run independent steps together and stream the answer.",
        "If it still misses the target, cut the feature scope."
      ],
      "simple": "When p95 latency is 6 seconds and the budget is 3, you measure before cutting, because the slow part is rarely where people guess. A trace shows the time in each stage, like retrieval, reranking, guardrails, prefill, where the model reads the prompt, and decode, where it writes the answer. Then you fix the biggest stage first.\n\nIf prefill is slow, you pass fewer chunks and turn on prompt caching. If decode is slow, you cap the output. If retrieval is slow, you check the index and the reranker. For example, a reranker scoring 20-50 candidates typically costs 50-300 ms, so scoring fewer wins time back.\n\nTwo moves help everywhere. Independent steps run in parallel, and you stream the answer, because time to first token is what users actually feel.",
      "points": [
        "Get the per-stage breakdown first. The bottleneck is rarely where you guess.",
        "Prefill-bound → shorter prompt, fewer chunks, prompt caching.",
        "Decode-bound → cap output length; ask whether the length is needed.",
        "Retrieval-bound → index, filters, reranker candidate count.",
        "Move guardrail calls off the critical path or run them in parallel.",
        "Parallelise independent steps; stream to fix perceived latency.",
        "If the budget still cannot be met, the scope changes. Say so."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Per-stage latency breakdown from a trace, with the fix for each stage: retrieval, reranking, guardrails, prefill and decode, plus streaming.",
        "top": "p95 6 s: trace every stage",
        "bottom": "3 s budget, or cut scope",
        "layers": [
          {
            "label": "Embed and retrieve",
            "note": "index, filters"
          },
          {
            "label": "Rerank",
            "note": "fewer candidates scored"
          },
          {
            "label": "Guardrail calls",
            "note": "parallel or off path"
          },
          {
            "label": "Prefill",
            "note": "fewer chunks, prompt caching",
            "accent": "warn"
          },
          {
            "label": "Decode",
            "note": "cap output length",
            "accent": "warn"
          },
          {
            "label": "Stream the answer",
            "note": "fixes perceived latency",
            "accent": "accent"
          }
        ],
        "caption": "**Measure before cutting** - fix the biggest stage first. If the budget still cannot be met, say plainly that **the scope has to change**."
      },
      "say": "I'd measure before cutting anything, because the slow part is rarely where people guess. A trace should break the time into stages: embedding, retrieval, reranking, guardrails, prefill, where the model reads the prompt, and decode, where it writes the answer. Then the biggest stage gets fixed first. If prefill dominates, the prompt is too long, so I pass fewer chunks after reranking, trim boilerplate and turn on prompt caching for the fixed start. If decode dominates, I cap the output and ask whether users really need three paragraphs. Slow retrieval means checking the index, the filters and how many candidates the reranker scores. A guardrail model in the critical path can usually run in parallel or move off it. Two structural moves help everywhere. Independent steps run at the same time, and streaming means users see words early, even though total time doesn't change. If it still can't hit three seconds, I'd say plainly that the feature scope has to change.",
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
      "quick": [
        "Same traffic means each request now uses more text.",
        "Check if more document pieces are sent than before.",
        "Check retries, untrimmed history and longer agent loops.",
        "A changing value in the fixed opening stops reuse savings.",
        "Alert on text per request, not only on the bill."
      ],
      "simple": "If traffic is flat and cost went up 40%, then tokens per request went up, so you find which part grew. The usual suspects are more retrieved context, because someone raised the chunk count, and more retries, because a tool or parser started failing. Conversation history may have stopped being trimmed, or an agent loop may have stopped ending early. For example, an agent that averaged four steps and now averages eight roughly doubles its cost with no extra users.\n\nPrompt caching is the sneaky one. If something variable, like a timestamp, moves into the stable prefix, cache hits stop silently.\n\nYou can separate all of these in minutes if you log tokens per request, split by input and output, per feature. So the preventive answer is to alert on tokens per request, because monthly spend alerts arrive after the money is gone.",
      "points": [
        "Context grew - chunk count raised, or ingestion changed chunk sizes.",
        "Retries increased - a tool or parser started failing.",
        "History stopped being trimmed.",
        "Agent loops running more steps than before.",
        "Prompt caching stopped hitting - something variable entered the stable prefix.",
        "Output length grew after a prompt change.",
        "Alert on tokens per request, not only on spend."
      ],
      "say": "Flat traffic and higher cost means tokens per request went up, so I look for which component grew. Retrieved context is my first check. Someone may have raised the chunk count, or an ingestion change started producing much bigger chunks. Retries come next, because when a tool or parser starts failing, every failure costs a full extra call. Then I check whether conversation history stopped being trimmed, whether agent loops now average eight steps instead of four, and whether output length grew after a prompt change. Prompt caching is the sneaky one. Move a timestamp or user name into the stable prefix and hits stop silently, since a miss isn't an error. All of this separates in minutes if we log tokens per request, split by input and output, per feature. Without that split I'm guessing, and the provider's billing page only tells me the total went up. So the preventive fix is alerting on tokens per request, because spend alerts arrive after the money's gone.",
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
      "quick": [
        "Graphics chips work best on many requests at once.",
        "The old way waits for the slowest request to finish.",
        "Continuous batching swaps in a new request as one finishes.",
        "The same hardware serves many more users.",
        "One request is not faster, but queues get shorter."
      ],
      "simple": "GPUs are efficient when they process many requests at once, so a serving engine groups them into batches. Static batching waits for every request in a batch to finish before starting the next. That suits text generation badly, because requests finish at very different times. For example, one request writes 20 tokens and another writes 800, so the short one's slot sits idle while the batch waits.\n\nContinuous batching works at the token level instead. When a request finishes, it leaves at once, and a queued request takes its slot on the very next step, so the batch is always full. That gives a large throughput gain on the same hardware, which is why vLLM became standard.\n\nThe point interviewers check is that one request doesn't decode faster. The win is that the same GPU serves far more users.",
      "points": [
        "Static batching waits for the slowest request in the batch. Most of the GPU idles.",
        "Continuous batching swaps finished requests out at each token step.",
        "Large throughput gain on the same hardware.",
        "Paged attention manages KV cache in blocks - no worst-case reservation per request.",
        "Together they are why vLLM-style servers are the default for self-hosting.",
        "Throughput improves most. A lone request is not faster, but under load queueing delay drops versus static batching."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Static batching compared with continuous batching: when slots refill, what happens to finished requests, GPU use and what gets faster.",
        "aspects": [
          "Refills the batch",
          "Finished request",
          "GPU",
          "What improves"
        ],
        "columns": [
          {
            "label": "Static batching",
            "note": "drain, then refill",
            "accent": "bad",
            "cells": [
              "When all finish",
              "Slot sits idle",
              "Waits for the longest",
              "Nothing under load"
            ]
          },
          {
            "label": "Continuous batching",
            "note": "refill every token step",
            "accent": "accent",
            "cells": [
              "Every token step",
              "Leaves immediately",
              "Stays full",
              "Throughput, queueing, p95"
            ]
          }
        ],
        "caption": "Continuous batching swaps requests in and out **at each token step**. A lone request is not faster - the win is **throughput** and shorter queues under load."
      },
      "say": "It's how a serving engine keeps the GPU full while generating, and it matters because the same hardware ends up serving far more users. GPUs work best on many requests at once. Static batching collects a batch and waits for every request in it to finish before starting the next. That suits generation badly, because lengths vary wildly. One request writes 20 tokens, another writes 800, and the short one's slot sits idle while the long one grinds on. Continuous batching works at the token step instead. When a request finishes, it leaves immediately and a queued request takes its slot on the next step, so the batch is constantly refilled. Paired with PagedAttention, that's why vLLM-style servers became the default for self-hosting. The distinction interviewers check is what gets faster. A lone request decodes no faster, sometimes slightly slower in a bigger batch. The win is throughput, and under load, much shorter queueing and a better p95.",
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
      "quick": [
        "The model keeps a growing memory of earlier words.",
        "Old servers reserved one big memory block per request.",
        "Most of that reserved memory sat empty.",
        "PagedAttention hands out small blocks only when needed.",
        "More requests fit at once, but each is not faster."
      ],
      "simple": "PagedAttention is about memory, not faster maths. While a model generates text, it keeps a KV cache for every earlier token, and nobody knows in advance how long an answer will be. Older servers reserved one big chunk of GPU memory per request for the maximum length, so most of it sat empty. For example, the vLLM paper found earlier systems used only about 20-40% of KV-cache memory for real data.\n\nPagedAttention borrows virtual memory from operating systems. The cache is split into small fixed-size blocks, and a request gets a new block only when its last one fills up, which cut waste to under 4%.\n\nLess waste means more requests fit in memory, so batches get bigger and throughput rises. But it doesn't make one request faster. It lets one GPU serve many more at once.",
      "points": [
        "The KV cache grows per token, and the final length is unknown in advance.",
        "Old approach: reserve a max-length contiguous slab per request - most of it wasted.",
        "PagedAttention: fixed-size blocks (vLLM's default is 16 tokens) plus a block table, like OS virtual memory.",
        "Less waste → more concurrent requests → bigger batches → higher throughput.",
        "Blocks can be shared across requests - the basis of prefix caching and parallel sampling.",
        "It improves capacity and throughput, not single-request speed."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Chain of effects from PagedAttention: fixed-size KV blocks, little wasted memory, more requests in memory, bigger batches, higher throughput.",
        "lanes": [
          {
            "label": "16-token blocks",
            "note": "plus a block table"
          },
          {
            "label": "Waste under 4%",
            "note": "was 60-80% idle"
          },
          {
            "label": "More requests fit",
            "note": "same GPU memory"
          },
          {
            "label": "Bigger batches",
            "note": "continuous batching"
          },
          {
            "label": "Higher throughput",
            "note": "roughly 2-4x",
            "accent": "accent"
          }
        ],
        "caption": "PagedAttention is **memory management**, like OS virtual memory - not faster maths. One request is not quicker; one GPU just **serves many more**."
      },
      "say": "PagedAttention stores each request's KV cache in small fixed-size blocks, like pages in virtual memory, so almost no GPU memory is wasted. The KV cache holds keys and values for every earlier token, it grows one entry per token, and nobody knows in advance how long an answer will be. Older servers reserved one contiguous slab per request, sized for the maximum length, and most of it sat empty. The vLLM paper found those systems used only about 20 to 40 percent of that memory for real tokens. PagedAttention hands out a block, 16 tokens by default, only when the last one fills, and a block table tells the kernel where each piece lives. Waste drops under 4 percent, more requests fit, batches get bigger, and throughput rose roughly two to four times over the systems compared. Blocks can also be shared, which is how prefix caching works. It's memory management, not faster maths like FlashAttention, so a single request isn't quicker.",
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
      "quick": [
        "Work out memory as model size times bytes per number.",
        "Add at least 20 to 30 percent extra room.",
        "A small 7 billion model fits one 24 GB card.",
        "Too big means compress the numbers or split across cards.",
        "Most teams should use a smaller model or an API."
      ],
      "simple": "Choosing a GPU starts with memory arithmetic. The weights need parameters multiplied by bytes per parameter, where FP16 is 2 bytes and INT4 is half a byte. So a 7B model in FP16 is about 14 GB, and a 70B is about 140 GB. Then you add at least 20-30% for the KV cache, which grows with context length and concurrent requests.\n\nThen you match that to hardware. A 7B in FP16 just fits a 24 GB card. For example, a 70B in FP16 doesn't fit one 80 GB H100, so you quantise it, use a larger card, or split it across GPUs.\n\nTensor parallelism splits each layer across GPUs that talk on every token, so it needs fast links inside one machine, and it's the default. Honestly, most enterprise workloads should use a smaller model or an API instead.",
      "points": [
        "Weights = parameters x bytes/param. FP16/BF16 is 2, INT8/FP8 is 1, INT4 is 0.5.",
        "7B FP16 is ~14 GB; 70B FP16 is ~140 GB - too big for any 80 GB card.",
        "Add at least 20-30% for KV cache; far more at long context or high concurrency.",
        "7B FP16: one 24 GB L4/A10G. 13B: quantise, or a 40-48 GB card. 70B: INT4 on one 80 GB card, or shard.",
        "Tensor parallelism splits layers across GPUs - needs NVLink, use within a node.",
        "Pipeline parallelism splits by layer across machines - tolerates slow links, adds idle bubbles.",
        "The senior answer: most workloads should quantise a smaller model or use an API instead."
      ],
      "diagram": {
        "alt": "GPU sizing decision: compute weights plus KV cache; if it fits one card, use the smallest card; if not, quantise, then use tensor parallelism within a node.",
        "rows": [
          [
            {
              "id": "w",
              "label": "Weights",
              "note": "params x bytes per param"
            }
          ],
          [
            {
              "id": "k",
              "label": "+ KV cache",
              "note": "at least 20-30% more",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "one",
              "label": "Smallest card that fits",
              "accent": "accent"
            },
            {
              "id": "q",
              "label": "Quantise",
              "note": "70B INT4 ~35 GB fits 80 GB",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "tp",
              "label": "Tensor parallel",
              "note": "within a node, NVLink"
            }
          ]
        ],
        "edges": [
          {
            "from": "w",
            "to": "k"
          },
          {
            "from": "k",
            "to": "one",
            "label": "fits"
          },
          {
            "from": "k",
            "to": "q",
            "label": "too big"
          },
          {
            "from": "q",
            "to": "tp",
            "label": "still too big"
          }
        ],
        "caption": "Do **the memory arithmetic** before naming a GPU: 70B in FP16 is ~140 GB, too big for any 80 GB card. Most workloads should run a smaller quantised model or an API."
      },
      "say": "I do the memory arithmetic before naming any GPU. Weights are parameters times bytes per parameter. FP16 is 2 bytes, INT8 or FP8 is 1, INT4 is half. So a 7B model in FP16 is about 14 GB and a 70B is about 140 GB. The KV cache sits on top, at least 20 to 30 percent more, and far more at long context or high concurrency. Then I match hardware. A 7B in FP16 fits a 24 GB L4, just about. A 70B in FP16 doesn't fit any 80 GB card, so I'd quantise to INT4, around 35 GB, use a bigger card, or split it. Tensor parallelism splits each layer across GPUs, which talk every token, so it needs NVLink inside one machine. Pipeline parallelism puts layers on different machines but leaves GPUs idle waiting. My default is tensor parallelism within a node. Honestly, though, most enterprise workloads should run a smaller quantised model or an API.",
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
      "quick": [
        "They solve different problems, engine versus server.",
        "vLLM serves text models fast for many users.",
        "TensorRT-LLM squeezes top speed out of NVIDIA chips.",
        "Triton hosts many model types in production.",
        "ONNX Runtime runs models on many kinds of hardware."
      ],
      "simple": "These four tools sit at different layers, so it helps to separate the model engine from the serving layer. vLLM is an LLM serving engine built for high throughput, because it manages batching and KV-cache memory well. TensorRT-LLM is NVIDIA's stack for strong performance on NVIDIA GPUs, worth the extra build work when hardware-specific speed really matters.\n\nTriton Inference Server, now NVIDIA Dynamo-Triton, is broader. It's a production model server that hosts different backends, handles model versions and exposes endpoints. ONNX Runtime runs exported models across many kinds of hardware, so it's common for smaller, non-LLM models where portability matters.\n\nFor example, a realistic stack might serve the main chat model on vLLM while a small intent classifier runs on ONNX Runtime on cheaper hardware. Either way, you benchmark on your real traffic before promising a speedup.",
      "points": [
        "vLLM: LLM-focused high-throughput serving engine.",
        "TensorRT-LLM: NVIDIA-focused optimisation/runtime for supported LLMs.",
        "Triton (now Dynamo-Triton): production model server that can host multiple backends.",
        "ONNX Runtime: portable runtime for models exported to ONNX.",
        "Benchmark your model, hardware, batch shape and latency target before choosing."
      ],
      "say": "They sit at different layers, so I separate the model engine from the serving layer. vLLM is an LLM-focused serving engine built for high-throughput generation, because it manages batching and KV-cache memory efficiently, and SGLang is its closest open-source peer. TensorRT-LLM is NVIDIA's optimisation and runtime stack for supported LLMs on NVIDIA GPUs. It's worth the extra build and tuning when hardware-specific speed really matters. Triton, now Dynamo-Triton, is a broader model server. It hosts different backends, handles versions and batching, and can wrap an optimised engine rather than replace it. NVIDIA Dynamo on top can split prefill and decode across GPUs. ONNX Runtime runs models exported to ONNX across many kinds of hardware, so it's common where portability matters, mostly for smaller non-LLM models. A realistic stack might serve the chat model on vLLM while a small intent classifier runs on ONNX Runtime. I choose on hardware, latency target and the team's operating cost, then benchmark the real workload.",
      "numbers": "Do not promise a universal speedup. Throughput changes sharply with model size, prompt/output lengths, batch/concurrency and GPU type; benchmark the workload you will actually serve.",
      "wrong": "Treating all four as interchangeable LLM servers. They live at different layers and optimise different constraints.",
      "follow": "Your benchmark shows higher throughput but much worse p99 latency. What serving knob or queue behaviour do you inspect next?",
      "followAnswer": "I look at how the bigger batches were bought, starting with the scheduler queue and the concurrency limit. Higher throughput usually means more sequences per step, so long prompts' prefill stalls other users' decoding and requests wait longer in the queue. I check queue time against model time in the per-request timestamps, the max concurrent sequences and batched token settings, whether chunked prefill is on, and whether KV cache pressure is causing preemption. Then I tune for goodput at our p99 target, not raw throughput."
    }
  ]
};
