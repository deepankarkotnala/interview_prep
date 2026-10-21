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
        "rag"
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
      "numbers": "Worked example: 4 chunks × 600 tokens = 2,400 context tokens, plus ~600 of prompt and history = ~3,000 input and ~500 output per request. At 10,000 requests a day that is 30M input and 5M output tokens a day - roughly 900M and 150M a month. On October 2026 list prices at the major providers, output tokens cost roughly 5-8x input, cached input reads about a tenth of the input price or less, and batch APIs about half - so price it against current rates, not a remembered number.",
      "verified": "2026-10",
      "wrong": "Quoting only the model's per-token price. It ignores embeddings, reranking, guardrails and retries, which can be a significant share of the bill - retries and judge calls especially.",
      "follow": "Where would you look first to cut that number by half?",
      "followAnswer": "Input tokens, because they are usually most of the bill. First I check that prompt caching actually hits on the stable prefix. Then I cut retrieved context - rerank and pass four chunks instead of ten - and trim conversation history. Then I move narrow steps like classification and rewriting to a smaller model. After each change I re-run the eval set, so the saving does not quietly cost quality.",
      "builds": [
        "llm-01",
        "rag-34"
      ],
      "next": [
        "cl-07",
        "cl-06",
        "cl-03"
      ],
      "alsoIn": [
        "riq-1008"
      ],
      "deeper": [
        "openai-pricing",
        "claude-pricing"
      ],
      "check": {
        "kind": "numbers",
        "q": "A request uses 3,000 input and 500 output tokens, and output costs 5x input per token. Roughly what share of the token bill is output?",
        "options": [
          "About 14%",
          "About 45%",
          "About 83%",
          "About 5%"
        ],
        "answer": 1,
        "why": "Input costs 3,000 units and output 500 x 5 = 2,500, so output is 2,500 of 5,500, about 45%. Counting tokens alone (14%) undercounts output badly. Input still leads, which is why cutting retrieved context is usually the first lever."
      },
      "try": {
        "title": "Build a cost-per-request calculator",
        "minutes": 15,
        "steps": [
          "Install `tiktoken` and count tokens for a real system prompt, three sample chunks and a question.",
          "Plug the counts into the starter code, using current rates from your provider's pricing page.",
          "Observe how the monthly bill splits between system prompt, retrieved context and output.",
          "Halve the number of chunks, then set a 90% cache-hit rate on the system prompt, and compare which change saves more."
        ],
        "code": "def monthly_cost(sys_tok, ctx_tok, q_tok, out_tok, req_per_day,\n                 in_price, out_price, cached_share=0.0, cache_discount=0.9):\n    # prices are per million tokens\n    prefix = sys_tok * (1 - cached_share * cache_discount)\n    per_req = ((prefix + ctx_tok + q_tok) * in_price + out_tok * out_price) / 1e6\n    return per_req, per_req * req_per_day * 30\n\nfor label, cached in [(\"no cache\", 0.0), (\"90% prefix hits\", 0.9)]:\n    per_req, month = monthly_cost(600, 2400, 50, 500, 10_000,\n                                  in_price=1.0, out_price=5.0, cached_share=cached)\n    print(f\"{label}: {per_req:.5f} per request, {month:,.0f} per month\")"
      }
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
        "inference"
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
      "followAnswer": "Throughput rose because each decode step now serves more users. But each step does more work, so TPOT usually gets a bit worse, and TTFT can rise because new prompts' prefill competes with the running batch. Whether that is acceptable depends on the targets. I check goodput - the share of requests still meeting our TTFT and TPOT limits. If goodput fell, the bigger batch is not a win.",
      "builds": [
        "tf-05",
        "llm-14"
      ],
      "next": [
        "cl-02",
        "cl-04",
        "cl-09"
      ],
      "deeper": [
        "vllm",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "numbers",
        "q": "TTFT is 800 ms, TPOT is 40 ms, and the answer is 300 tokens. Roughly when does the last token arrive?",
        "options": [
          "About 1.2 seconds",
          "About 8 seconds",
          "About 12.8 seconds",
          "About 40 seconds"
        ],
        "answer": 2,
        "why": "0.8 s for the first token plus 299 x 40 ms, about 12 s, gives roughly 12.8 s. That is why streaming matters: the user starts reading at 0.8 s. Forgetting the per-token time (1.2 s) is the usual slip."
      },
      "try": {
        "title": "Measure TTFT and TPOT on a local model",
        "minutes": 15,
        "steps": [
          "Run Ollama with a small model and install the `openai` package.",
          "Run the starter code five times and record TTFT and TPOT each time.",
          "Observe how TTFT changes when you paste a 2,000-word document into the prompt (prefill grows) while TPOT barely moves.",
          "Report p50 and the worst run rather than the average, and note how far apart they are."
        ],
        "code": "import time\nfrom openai import OpenAI\n\nc = OpenAI(base_url=\"http://localhost:11434/v1\", api_key=\"ollama\")\nt0 = time.perf_counter(); first = None; n = 0\nstream = c.chat.completions.create(model=\"llama3.2:3b\", stream=True,\n    messages=[{\"role\": \"user\", \"content\": \"Explain HNSW in 200 words.\"}])\nfor ch in stream:\n    if ch.choices and ch.choices[0].delta.content:\n        n += 1\n        first = first or time.perf_counter()\nend = time.perf_counter()\nprint(f\"TTFT {first - t0:.2f}s  TPOT {(end - first) / max(n - 1, 1) * 1000:.0f} ms  chunks {n}\")"
      }
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
        "caching",
        "cost",
        "latency"
      ],
      "why": "The biggest single way to cut cost, with several distinct layers most candidates mix up.",
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
      "numbers": "Cached input reads were priced at about a tenth of the normal input rate or less at the major providers in October 2026, and caching also cuts time to first token. Some providers charge extra to write the cache (Anthropic charges 1.25x for a 5-minute entry) and caches usually expire within minutes unless reused, so the saving depends on request frequency - check current rates rather than quoting one from memory.",
      "verified": "2026-10",
      "wrong": "\"We cache the responses.\" Which cache, keyed on what? Keyed on question text alone, it is both a staleness bug and a data leak.",
      "follow": "A timestamp in your system prompt. What does that do to your cache hit rate?",
      "followAnswer": "It can drop the hit rate to almost zero. Prompt caching matches an exact prefix - the start of the prompt - so if the first lines change on every request, nothing after them matches either. I move anything that varies, like the timestamp, user name or retrieved chunks, after the stable part, or round the time to the day. Then I check the cached-token count in the API usage data to confirm hits.",
      "builds": [
        "llm-15"
      ],
      "next": [
        "ar-10",
        "cl-07",
        "py-29"
      ],
      "alsoIn": [
        "riq-2908"
      ],
      "deeper": [
        "claude-prompt-caching",
        "openai-prompt-caching"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "Prompt assembly:\n    prompt = f\"Now: {datetime.now()}\\n{SYSTEM_PROMPT}\\n{TOOLS}\\n{question}\"\nProvider prompt caching is enabled, but the hit rate is zero. Why?",
        "options": [
          "The tools block is too long to cache.",
          "Caching only works on the user's question.",
          "f-strings disable prompt caching.",
          "The timestamp comes first, so every request has a different prefix and nothing after it can match."
        ],
        "answer": 3,
        "why": "Prompt caches match from the start of the prompt, so one changing value at the front invalidates everything after it. Put the stable system prompt and tools first and variable data last. Long stable blocks are exactly what caching is for."
      }
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
        "trade-offs",
        "evaluation"
      ],
      "why": "The highest-leverage cost technique in most pipelines, and it needs real design thinking.",
      "quick": [
        "Most requests are easy, so do not pay top prices.",
        "First route by task, small jobs go to a small model.",
        "Then route by difficulty using length and question type.",
        "Try the small model and upgrade only if its answer fails.",
        "Test the router itself and track cost per finished task."
      ],
      "simple": "Routing between models starts from one fact, which is that most requests are easy and only a minority are hard. Paying frontier prices for the easy majority is where most GenAI budgets go, and within one provider the smallest and largest tiers often differ by 10 times or more per token.\n\nThe simplest routing is by task. Classification, extraction and query rewriting go to a small model, while final answers to complex questions go to the large one. Above that sits difficulty routing, where a cheap classifier estimates whether a request needs the large model. There's also the fallback pattern, where the small model tries first, a cheap validator checks it, and you escalate only if it fails.\n\nFor example, a support assistant can let a small model answer order-status questions and escalate only when the validator finds a missing citation.",
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
      "numbers": "On October 2026 list prices, the cheapest and most expensive tiers within one provider differed by roughly 8-40x per input token - check current rates. Moving the high-volume narrow steps down a tier is usually the largest single saving available.",
      "verified": "2026-10",
      "wrong": "\"We use the cheaper model everywhere.\" That trades a cost problem for a quality problem, and the escalations and retries often erase the saving.",
      "follow": "Your router sends 30% to the expensive model. How would you get that to 10%?",
      "followAnswer": "First I look at what that 30 percent actually is. I sample escalated requests and check whether the small model's answer would have been fine - routers are often over-cautious, so I tune the threshold against the eval set. For the genuinely hard ones, I raise the small model's success rate with better retrieval, a tighter prompt, examples, or fine-tuning on the cases it fails. And I track quality alongside cost per task.",
      "builds": [
        "cl-01",
        "llm-08"
      ],
      "next": [
        "cl-07",
        "ev-06",
        "sd-28"
      ],
      "deeper": [
        "litellm",
        "openai-pricing"
      ],
      "check": {
        "kind": "numbers",
        "q": "The large model costs 20x the small one per request. Your router sends 30% of traffic to the large model. What is total cost relative to sending everything to the large model?",
        "options": [
          "About 30%",
          "About 34%",
          "About 70%",
          "About 5%"
        ],
        "answer": 1,
        "why": "0.7 x (1/20) + 0.3 x 1 = 0.035 + 0.3, about 34%. The expensive share dominates, so cutting it from 30% to 10% drops cost to about 15%. Answering 30% ignores the small model's cost; 5% ignores the escalations."
      }
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
        "trade-offs"
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
        "Calculate the break-even for your volume rather than quoting a rough guess."
      ],
      "say": "Constraints first, then economics, because the constraints often settle it before cost comes up. Does residency or a contract forbid sending data to a provider? Do we need a model no API offers, or guaranteed capacity instead of shared rate limits? If none of that forces the choice, it comes down to volume. An API charges per token with no fixed cost, so it wins at low or bursty volume. A GPU costs the same idle as busy, so self-hosting only wins above a break-even utilisation. That figure has to include engineering time for the serving stack, autoscaling, upgrades and on-call, which is never free. People also forget the middle option, managed per-token endpoints for open-weight models, where we get the model without running GPUs. The pattern that usually wins is an API for the frontier model on hard tasks and a small self-hosted or managed model for the high-volume narrow work. And I'd calculate the break-even from our real volume, not quote a rough guess.",
      "numbers": "A GPU costs the same idle as busy - that is the whole break-even argument. Compute yours from your actual duty cycle, not a blog post's threshold.",
      "wrong": "\"Self-hosting is cheaper.\" Only above a utilisation you have not stated, and only if the engineering time is free, which it never is.",
      "follow": "What utilisation would you need to justify a dedicated GPU?",
      "followAnswer": "I would calculate it rather than quote one. Take the GPU's monthly cost plus a share of engineering and on-call time. Benchmark how many tokens it serves per month at our real prompt and output lengths. That gives a cost per million tokens at a given utilisation. Compare it with the API price for a model of the same quality. If our steady traffic sits well below the crossing point, we stay on the API.",
      "builds": [
        "cl-01",
        "llm-16"
      ],
      "next": [
        "cl-08",
        "cd-09",
        "cl-04"
      ],
      "alsoIn": [
        "riq-2303"
      ],
      "deeper": [
        "vllm",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "numbers",
        "q": "A dedicated GPU costs 100 units a day and can serve 200M tokens a day at full load. An API of equal quality costs 1 unit per million tokens. Ignoring staff time, where do they break even?",
        "options": [
          "At 20M tokens a day.",
          "At 200M tokens a day - only at full load.",
          "Never - the API is always cheaper.",
          "At 100M tokens a day, which is 50% utilisation."
        ],
        "answer": 3,
        "why": "100 units buys 100M API tokens, so the GPU wins only above 100M tokens a day - half its capacity, sustained. Add engineering and on-call time and the real break-even rises further. Bursty traffic that averages below that stays cheaper on the API."
      }
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
        "debugging",
        "rag"
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
      "followAnswer": "Then I make each request do less prefill work. Prompt caching, or prefix caching on a self-hosted server, means the shared part of the prompt is processed once and reused, which cuts time to first token directly - so stable content goes first. If self-hosted, a faster GPU or more tensor parallelism speeds prefill, and chunked prefill stops long prompts blocking other users. Meanwhile I show sources or progress while the answer is generated.",
      "builds": [
        "cl-10",
        "rag-35"
      ],
      "next": [
        "cl-03",
        "rag-12",
        "cl-04"
      ],
      "deeper": [
        "huyen-llm-production",
        "vllm"
      ],
      "check": {
        "kind": "judgement",
        "q": "A p95 trace shows: retrieval 300 ms, rerank of 100 candidates 1.4 s, guardrails 400 ms, TTFT 900 ms, decode 3 s. The budget is 3 seconds to the full answer. What do you cut first?",
        "options": [
          "Switch to a faster model straight away.",
          "Cap output length and rerank about 30 candidates instead of 100 - the two biggest stages - and stream.",
          "Add more retrieval replicas.",
          "Raise the guardrail timeout so it never fails."
        ],
        "answer": 1,
        "why": "Decode and rerank are 4.4 of the 6 seconds, so they come first; streaming makes the rest feel faster. A faster model attacks only part of the problem and may cost quality. Retrieval is already small, and guardrail timeouts do not cut time."
      }
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
        "debugging",
        "observability"
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
      "followAnswer": "Because a cache miss is not an error. The request still succeeds, just slower and more expensive, so nothing alerts. Usual causes: something variable moved into the prefix, like a timestamp, user name or reordered tool list; the stable part became shorter than the provider's minimum cacheable length; or traffic spread out so entries expired between calls. So I alert on the cached-token share from the usage data, not only on spend.",
      "builds": [
        "cl-01",
        "ops-04"
      ],
      "next": [
        "cl-03",
        "ag-05",
        "ops-05"
      ],
      "deeper": [
        "huyen-llm-production",
        "langfuse"
      ],
      "check": {
        "kind": "predict",
        "q": "Traffic is flat and cost rose 40%. Input tokens per request are unchanged, but the share of input served from the prompt cache fell from 70% to 5%. What happened?",
        "options": [
          "The provider raised prices for cached tokens.",
          "Users are asking longer questions.",
          "Something variable moved into the stable prefix, or its order changed, so cache hits stopped.",
          "An agent loop is running more steps."
        ],
        "answer": 2,
        "why": "Same tokens with far fewer cached means the prefix no longer matches between requests - often a timestamp, user ID or reordered tools placed up front. Longer questions or more agent steps would raise tokens per request, which did not change."
      }
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
        "inference"
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
      "followAnswer": "Not for a lone request - it decodes at the same speed, sometimes slightly slower inside a bigger batch. It helps p95 under load, because new requests join the running batch at the next step instead of waiting for a whole batch to drain. So for one user on a quiet server, no. For one user among hundreds, yes, mostly through much shorter queueing time.",
      "builds": [
        "tf-05",
        "llm-06"
      ],
      "next": [
        "cl-11",
        "cl-10",
        "ops-09"
      ],
      "deeper": [
        "paged-attention",
        "vllm"
      ],
      "check": {
        "kind": "concept",
        "q": "With static batching, one batch holds a 20-token request and an 800-token request. What happens to the short request's slot after it finishes?",
        "options": [
          "It sits idle until the 800-token request finishes; continuous batching would fill it with a queued request on the next step.",
          "It is immediately given to the next queued request.",
          "The 800-token request speeds up to use the freed compute.",
          "The batch is cancelled and restarted."
        ],
        "answer": 0,
        "why": "Static batching runs until the longest request ends, wasting slots. Continuous batching refills slots per decode step, which is where the throughput gain comes from. The long request does not decode faster either way."
      },
      "try": {
        "title": "Simulate static versus continuous batching",
        "minutes": 15,
        "steps": [
          "Run the starter code, which counts decode steps for 400 requests of mixed length with 8 slots.",
          "Observe the speed-up of continuous over static batching.",
          "Make all requests the same length and observe the speed-up fall to about 1 - the gain comes from uneven lengths.",
          "Increase the share of 800-token requests and observe how the gap changes."
        ],
        "code": "import random\nrandom.seed(0)\nlens = [random.choice([20, 50, 100, 800]) for _ in range(400)]\nB = 8\n\n# static: each batch takes as many steps as its longest request\nstatic = sum(max(lens[i:i + B]) for i in range(0, len(lens), B))\n\n# continuous: a slot is refilled as soon as its request finishes\nslots, queue, steps = [0] * B, list(lens), 0\nwhile queue or any(slots):\n    for i in range(B):\n        if slots[i] == 0 and queue:\n            slots[i] = queue.pop(0)\n    slots = [max(s - 1, 0) for s in slots]\n    steps += 1\nprint(\"static\", static, \"continuous\", steps, \"speed-up\", round(static / steps, 2))"
      }
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
        "inference"
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
      "followAnswer": "It means the KV cache ran out of free blocks, so vLLM paused some running requests and freed their blocks, to recompute them later. Those users see latency spikes. I would lower the maximum concurrent sequences or the maximum context length, give the cache more GPU memory if there is headroom, store the KV cache in FP8, or add GPUs. Then I re-run the load test and check p95.",
      "builds": [
        "tf-03",
        "tf-12",
        "cl-04"
      ],
      "next": [
        "cl-08",
        "cl-09",
        "tf-13"
      ],
      "deeper": [
        "paged-attention",
        "vllm"
      ],
      "check": {
        "kind": "numbers",
        "q": "An older server reserves KV-cache space for 4,096 tokens per request, but requests average 900 tokens. Roughly what share of the reserved memory holds real data?",
        "options": [
          "About 22%",
          "About 50%",
          "About 90%",
          "About 4%"
        ],
        "answer": 0,
        "why": "900 / 4,096 is about 22%, in line with the 20-40% the vLLM paper measured. With 16-token blocks, PagedAttention wastes at most part of one block per request, so far more requests fit - more throughput, not a faster single request."
      }
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
        "open-weights",
        "cost"
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
      "numbers": "Rough guide: plan usable GPU memory at roughly 1.3x the weights or more. On an 80 GB H100, a 70B in INT4 (~35 GB) is comfortable, INT8/FP8 (~70 GB) is tight, and FP16 does not fit.",
      "wrong": "Naming a GPU before doing the memory arithmetic. The panel wants to see you size the model, not recall a product page.",
      "follow": "You sharded across four GPUs and throughput barely improved. What went wrong?",
      "followAnswer": "Usually communication or not enough load. If the GPUs talk over PCIe instead of NVLink, tensor parallelism spends much of each step waiting on data transfer. If the model already fitted on fewer GPUs, sharding only added overhead - running separate replicas would scale better. And if concurrency is low, there is no batch to spread. I would check interconnect, GPU utilisation and batch size, then compare against two replicas on two GPUs each.",
      "builds": [
        "llm-12",
        "tf-12"
      ],
      "next": [
        "cl-11",
        "cl-05",
        "ml-34"
      ],
      "deeper": [
        "vllm",
        "k8s-gpus"
      ],
      "check": {
        "kind": "numbers",
        "q": "You want to serve a 70B model in INT8 on one 80 GB GPU, planning 30% headroom for the KV cache. Does it fit?",
        "options": [
          "Yes - 70 GB of weights fits inside 80 GB.",
          "Yes - INT8 makes a 70B model about 35 GB.",
          "No - INT8 still needs about 140 GB.",
          "No - 70 GB x 1.3 is about 91 GB, so use INT4, a larger card or two GPUs."
        ],
        "answer": 3,
        "why": "INT8 is 1 byte per parameter, so about 70 GB of weights, and with KV-cache headroom you need about 91 GB. 'It fits' forgets the cache; 35 GB is INT4; 140 GB is FP16."
      },
      "try": {
        "title": "Size GPU memory for three models",
        "minutes": 10,
        "steps": [
          "Run the starter code to see the weight memory and planned memory for 7B, 13B and 70B models at FP16, INT8 and INT4.",
          "Mark which combinations fit a 24 GB, 48 GB and 80 GB card with 30% headroom.",
          "Raise headroom to 60% for a long-context, high-concurrency workload and observe which options drop out.",
          "Pick the cheapest card for a 13B model and write one sentence defending it."
        ],
        "code": "BYTES = {\"FP16\": 2, \"INT8\": 1, \"INT4\": 0.5}\nCARDS = [24, 48, 80]\nHEADROOM = 1.3\n\nfor params_b in (7, 13, 70):\n    for fmt, b in BYTES.items():\n        weights = params_b * b          # GB, since 1B params x 1 byte = 1 GB\n        need = weights * HEADROOM\n        fits = [c for c in CARDS if c >= need]\n        print(f\"{params_b:>3}B {fmt}: weights {weights:5.1f} GB, plan {need:5.1f} GB, fits {fits or 'none'}\")"
      }
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
      "verified": "2026-10",
      "wrong": "Treating all four as interchangeable LLM servers. They live at different layers and optimise different constraints.",
      "follow": "Your benchmark shows higher throughput but much worse p99 latency. What serving setting or queue behaviour do you inspect next?",
      "followAnswer": "I look at how the bigger batches were bought, starting with the scheduler queue and the concurrency limit. Higher throughput usually means more sequences per step, so long prompts' prefill stalls other users' decoding and requests wait longer in the queue. I check queue time against model time in the per-request timestamps, the max concurrent sequences and batched token settings, whether chunked prefill is on, and whether KV cache pressure is causing preemption. Then I tune for goodput at our p99 target, not raw throughput.",
      "builds": [
        "cl-04",
        "cl-11"
      ],
      "next": [
        "cl-10",
        "cl-08",
        "cd-08"
      ],
      "deeper": [
        "tensorrt-llm",
        "triton"
      ],
      "check": {
        "kind": "concept",
        "q": "On NVIDIA GPUs you must serve a chat LLM, a small ONNX intent classifier and an image model behind one set of versioned endpoints. Which tool plays the general serving-layer role?",
        "options": [
          "ONNX Runtime, because it runs everything.",
          "Dynamo-Triton (formerly Triton Inference Server), hosting several backends and able to wrap an optimised LLM engine.",
          "vLLM, because it serves image models best.",
          "TensorRT-LLM, because it is a model server."
        ],
        "answer": 1,
        "why": "Triton, now Dynamo-Triton, is the multi-backend model server with versioning and batching. vLLM and TensorRT-LLM are LLM engines, and ONNX Runtime is a portable runtime for exported models, not a fleet server."
      }
    },
    {
      "id": "cl-12",
      "q": "Users say the assistant feels slow, but your p95 latency dashboard is green. What are they feeling?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "latency",
        "inference",
        "observability"
      ],
      "why": "cl-10 defines the metrics. This checks you can connect them to perception: which delay users notice in chat, in agents and in voice, and which number your dashboard is missing.",
      "quick": [
        "Users feel the wait for the first word, not averages.",
        "Once streaming, anything faster than reading speed feels fine.",
        "Stalls mid-answer feel broken even when averages look good.",
        "Agents and non-streamed JSON make total time what users feel.",
        "Voice needs first audio within a conversational pause."
      ],
      "simple": "Users don't feel p95 end-to-end latency. They feel specific moments. In streaming chat the first is time to first token: a blank screen for two or three seconds feels like a failure, even if the answer finishes quickly afterwards. After text starts, speed matters less than you'd think. People read only a few words a second, so a stream faster than reading feels instant for prose, though developers skimming code do notice slow output.\n\nThe second moment is stalls. A stream that pauses for a second midway feels broken, and averages hide it. Stalls come from the server pre-empting requests under memory pressure, long prefills from other requests interrupting decoding, or a tool call mid-answer with no visible progress. So you track the worst gap between tokens per request at p95, not just mean time per token.\n\nThe third depends on the product. An agent that runs four tool steps before answering, or an API that returns one JSON object at the end, has no stream to hide behind, so total time is what users feel and progress messages matter. Voice is strictest: natural turn-taking gaps are a few hundred milliseconds, so time to first audio is the metric. For example, a dashboard showing a healthy end-to-end p95 can hide that a fifth of answers sit on a blank screen for three seconds.",
      "points": [
        "Maps each product surface to the delay users perceive.",
        "TTFT for chat, inter-token stalls, end-to-end for agents and JSON.",
        "Reading speed caps the value of faster decoding for prose.",
        "Measures the worst inter-token gap per request.",
        "Progress indicators for multi-step agents."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "What users feel and which metric to watch for streaming chat, an agent with tools, a JSON API and voice.",
        "caption": "**Measure the moment users feel.** End-to-end p95 hides blank screens and mid-stream stalls; voice is the strictest of all.",
        "aspects": [
          "What users feel",
          "Metric to watch"
        ],
        "columns": [
          {
            "label": "Streaming chat",
            "cells": [
              "Blank screen before the first word",
              "TTFT p95 and max stall"
            ]
          },
          {
            "label": "Agent with tools",
            "cells": [
              "Silence while steps run",
              "End-to-end p95, progress events"
            ]
          },
          {
            "label": "JSON API",
            "cells": [
              "Whole response time",
              "End-to-end p95"
            ]
          },
          {
            "label": "Voice",
            "accent": "accent",
            "cells": [
              "Gap before the assistant speaks",
              "Time to first audio"
            ]
          }
        ]
      },
      "say": "They're feeling a moment the dashboard doesn't show. In streaming chat that's usually time to first token: two or three seconds of blank screen feels broken even if the whole answer finishes on time. Once text flows, anything faster than reading speed feels fine for prose, so extra decode speed buys little. The second culprit is stalls, a one-second pause mid-stream from pre-emption, another request's long prefill, or a hidden tool call. Mean time per token hides that, so I track the worst inter-token gap per request at p95. Third, for agents or endpoints that return one JSON object there's no stream, so total time is what users feel, and visible progress like \"checking your orders\" matters. For voice, time to first audio has to fit a conversational pause. So I'd split the dashboard by surface - TTFT p95, max stall p95, end-to-end - and compare it with where users complain.",
      "numbers": "Adults read roughly 3-5 words a second, so for prose a stream of 20 or more tokens per second already outpaces reading. Beyond that, TTFT and stalls dominate perception; code and skimmed output are the exception.",
      "wrong": "\"Our p95 is under budget, so the complaint is subjective.\" End-to-end p95 hides blank-screen waits and mid-stream stalls, which are exactly what users report.",
      "follow": "TTFT p95 is 3 seconds. Where does that time go?",
      "followAnswer": "I'd trace it into stages: queueing at the gateway or rate limiter, input guardrails, retrieval and reranking, prompt assembly, then prefill, which grows with prompt length. Often it's retrieval and reranking running in sequence with an input classifier, or a long prompt whose prompt cache stopped hitting. The fixes follow: run checks in parallel with retrieval, pass fewer chunks, restore cache hits by moving variable content to the end, and send a first visible event, such as a status line, as soon as the request is accepted.",
      "builds": [
        "cl-10",
        "tf-05"
      ],
      "next": [
        "cl-13",
        "cl-02",
        "cl-24"
      ],
      "deeper": [
        "huyen-ai-engineering",
        "vllm-bench"
      ],
      "check": {
        "kind": "predict",
        "q": "You halve time-per-output-token on a chat assistant that writes 150-word prose answers, with TTFT unchanged at 2.5 s. What will users most likely notice?",
        "options": [
          "A big improvement - answers now feel twice as fast.",
          "A worse experience, because faster streams are harder to read.",
          "Little difference - the stream already outpaced reading, and the 2.5 s blank screen remains.",
          "Fewer stalls, because TPOT measures the worst pause."
        ],
        "answer": 2,
        "why": "For prose, a stream already faster than reading feels the same when made faster; the blank 2.5 s before the first word is what users feel. TPOT is an average, so it says nothing about the worst stall."
      }
    },
    {
      "id": "cl-13",
      "q": "You turned on streaming and things broke. What goes wrong with streaming and partial rendering, and how do you fix it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "api-design",
        "latency",
        "structured-output"
      ],
      "why": "Streaming is the cheapest perceived-latency win, but it touches proxies, renderers, guardrails, retries and cost accounting. The panel checks you have shipped it, not just set a flag.",
      "quick": [
        "Proxies and compression can buffer the whole stream.",
        "Half-written Markdown and JSON need tolerant rendering.",
        "Guardrails need chunked checks and a retraction path.",
        "Cancel upstream on disconnect to stop paying for unread tokens.",
        "Mid-stream failures need a restart or resume decision."
      ],
      "simple": "Streaming changes the contract from one response to a sequence of events, and every layer between the model and the screen has to cope.\n\nThe first surprise is that nothing streams. A reverse proxy, load balancer or compression middleware buffers the response until it's complete, so you turn buffering off for that route (for nginx, `proxy_buffering off` or an `X-Accel-Buffering: no` header) and don't compress server-sent events. Then the renderer sees half-written content. An unclosed code fence or half a table makes Markdown jump around, and half a JSON object won't parse, so you use a tolerant incremental parser or stream structured output field by field.\n\nGuardrails change too. Output can't be fully checked before display, so you moderate sentence-sized chunks with a short hold-back buffer and a way to retract. Citations are validated when the answer completes.\n\nCost and reliability come last. When the user closes the tab, cancel the upstream generation, or you keep paying for tokens nobody reads. A network drop mid-stream needs a decision: restart, or resume from stored partial output. Token usage often arrives only in the final event, so log it there. For example, a team streaming through a corporate proxy may see the full answer arrive in one burst after eight seconds, which looks exactly like no streaming at all.",
      "points": [
        "Proxy and compression buffering; correct SSE headers.",
        "Tolerant rendering of partial Markdown and JSON.",
        "Chunked moderation with retraction; citations checked at the end.",
        "Cancellation propagated upstream to save cost.",
        "Mid-stream failure handling and usage accounting."
      ],
      "say": "Streaming fails in five places. First, buffering: a proxy, load balancer or gzip middleware holds the whole response, so the user still waits and then gets everything at once. I turn buffering off on that route and don't compress server-sent events. Second, rendering: half a code fence or half a JSON object breaks naive renderers, so I use a tolerant incremental Markdown renderer and stream structured output field by field. Third, guardrails: I can't check the whole answer before display, so I moderate sentence-sized chunks with a short hold-back buffer that can retract, and validate citations at the end. Fourth, cost: when the client disconnects I cancel the upstream call, otherwise we pay for tokens nobody reads. Fifth, failure: a mid-stream drop needs a restart or resume decision, and usage counts often come only in the last event, so that's where I log them.",
      "numbers": "A stream only needs to beat reading speed, roughly 3-5 words a second. When a \"streamed\" answer arrives in one burst, buffering in the path is the usual cause, not model speed.",
      "wrong": "\"Streaming is just setting `stream=True`.\" Without fixing proxies, renderers, guardrails and cancellation you get no visible streaming, flickering output and unchecked text on screen.",
      "follow": "How do you stream an answer that must be valid JSON for the frontend?",
      "followAnswer": "I avoid making the user wait on the whole object. Either the schema puts the user-visible text in one field that I stream as plain text events while the structured fields arrive in a final event, or I use a partial-JSON parser that yields fields as they close, so the UI fills in progressively. Schema validation still runs on the completed object before anything acts on it. If validation fails, the UI keeps the text but disables actions, and the request is logged for review.",
      "builds": [
        "py-20",
        "riq-1007",
        "cl-12"
      ],
      "next": [
        "gr-24",
        "py-15",
        "lg-07"
      ],
      "deeper": [
        "fastapi-streaming",
        "openai-docs"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "Your FastAPI endpoint yields tokens as server-sent events and streams fine locally, but in production the whole answer appears at once after 8 seconds. What is the most likely cause?",
        "options": [
          "A proxy or compression layer between client and server is buffering the response.",
          "The model provider disabled streaming for your account.",
          "Python's GIL prevents yielding while the model generates.",
          "Server-sent events do not work over HTTPS."
        ],
        "answer": 0,
        "why": "Local works, production does not, and the content arrives complete - the classic sign of an intermediary buffering. Disable proxy buffering and compression on the stream route. SSE works over HTTPS, and the GIL does not stop an async generator yielding."
      }
    },
    {
      "id": "cl-14",
      "q": "How much more do Hindi and other Indic-language users cost in tokens, and how do you measure it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "cost",
        "multilingual",
        "india"
      ],
      "why": "rag-30 states that Hindi costs more. This tests whether you can measure the inflation properly, explain why it happens and turn it into budget and design decisions for an Indian product.",
      "quick": [
        "Tokenisers trained mostly on English split Indic scripts into more pieces.",
        "Measure with parallel sentences: tokens in language over tokens in English.",
        "Ratios vary sharply by tokeniser, so test your exact model.",
        "Inflation raises cost, streaming time and context use together.",
        "Keep instructions in English; answer in the user's language."
      ],
      "simple": "A tokeniser learns its vocabulary from training text, and when that text is mostly English, English words become single tokens while Devanagari, Tamil or Bengali text is split into smaller pieces, sometimes single characters or bytes. The same meaning therefore costs more tokens. Petrov and colleagues found the same text could differ by up to 15 times in token length across languages in their study.\n\nYou measure it with parallel text. Take a few hundred real sentences from your domain with good translations, count tokens with the exact tokeniser of the model you plan to use, and compute the ratio to English per language and script, including romanised Hindi. For example, in a quick test on three customer-support sentences, OpenAI's older `cl100k_base` tokeniser used about 5.7 times as many tokens for Devanagari Hindi as for English, while the newer `o200k_base` used about 1.7 times, close to romanised Hindi. So a figure from one model doesn't transfer to another.\n\nThe impact is threefold: cost per turn rises by the ratio for those users, answers take proportionally longer to stream, and context fills faster, so fewer retrieved chunks fit. The design responses are to keep system prompts and instructions in English while answering in the user's language, to compare candidate models on this ratio, and to budget per language.",
      "points": [
        "Explains the vocabulary-training cause.",
        "Parallel-sentence ratio method with the exact tokeniser.",
        "Script and romanisation measured separately.",
        "Cost, latency and context-capacity effects.",
        "English instructions, model choice and per-language budgets."
      ],
      "say": "Tokenisers learn their vocabulary mostly from English, so Indic scripts get split into more, smaller pieces and the same meaning costs more tokens. How much depends heavily on the tokeniser, so I measure rather than quote. I take a few hundred real sentences from our domain with translations, count tokens with the exact model's tokeniser, and compute the ratio to English per language, with romanised Hindi measured separately. In a quick test of mine, an older OpenAI tokeniser used almost six times the English tokens for Devanagari Hindi, and the newer one about 1.7 times. The ratio then multiplies three things for those users: cost per turn, time to stream the answer, and how much context fits. So I keep instructions in English, answer in the user's language, compare candidate models on this ratio, and budget per language rather than with one blended number.",
      "numbers": "In a small test of three support sentences, `cl100k_base` used about 5.7x the English tokens for Devanagari Hindi and `o200k_base` about 1.7x; romanised Hindi was about 1.6x on both. Measure on your own text and model.",
      "verified": "2026-10",
      "wrong": "\"A token is about four characters, so we'll budget by character count.\" That rule of thumb is for English; for Indic scripts the characters-per-token ratio is very different and changes with the tokeniser.",
      "follow": "60% of your users write in Hindi. How does that change your monthly estimate?",
      "followAnswer": "I'd build the estimate per language segment. If Hindi turns use 1.7 times the tokens of English on our chosen model and 60% of turns are Hindi, the blended multiplier is 0.4 plus 0.6 times 1.7, about 1.42, so a budget built on English samples is around 40% low. Because instructions stay in English, the inflation mainly hits user messages, Hindi documents and answers, so I apply it to those parts rather than the whole prompt, which usually lowers the effective figure. Then I re-check against real usage after launch.",
      "builds": [
        "llm-01",
        "rag-30"
      ],
      "next": [
        "cl-15",
        "gr-18",
        "cl-12"
      ],
      "deeper": [
        "petrov-tokenizers",
        "tiktoken"
      ],
      "check": {
        "kind": "numbers",
        "q": "Hindi answers average 1.7x the tokens of equivalent English answers on your model, and decoding runs at a steady tokens-per-second rate. How does a Hindi answer's streaming time compare with English?",
        "options": [
          "The same, because tokens per second is fixed.",
          "About 1.7x longer, because there are 1.7x more tokens to generate.",
          "Shorter, because Hindi sentences have fewer words.",
          "It depends only on the input prompt length."
        ],
        "answer": 1,
        "why": "Decode time scales with output tokens, so 1.7x the tokens takes about 1.7x as long at the same per-token speed. A fixed tokens-per-second rate means meaning arrives more slowly in the more heavily tokenised language."
      },
      "try": {
        "title": "Measure Hindi token inflation across tokeniser generations",
        "minutes": 15,
        "steps": [
          "Install tiktoken and run the script on the three sentence pairs.",
          "Compare the Hindi-to-English ratio for the two tokenisers and note how much the newer one narrows the gap.",
          "Add ten sentences from your own domain with careful translations and re-run.",
          "Add a Tamil or Bengali column and observe whether its ratio differs from Hindi.",
          "Optionally load an open Indic-focused model's tokeniser from Hugging Face and compare the same ratio."
        ],
        "code": "import tiktoken\n\npairs = [\n    (\"Your refund will be credited to your bank account within five working days.\",\n     \"आपका रिफंड पाँच कार्य दिवसों के भीतर आपके बैंक खाते में जमा कर दिया जाएगा।\",\n     \"Aapka refund paanch working days ke andar aapke bank account mein credit ho jayega.\"),\n    (\"Please share your order number so I can check the delivery status.\",\n     \"कृपया अपना ऑर्डर नंबर साझा करें ताकि मैं डिलीवरी की स्थिति देख सकूँ।\",\n     \"Please apna order number share karein taaki main delivery status check kar sakoon.\"),\n    (\"The policy covers hospital expenses but not routine dental treatment.\",\n     \"यह पॉलिसी अस्पताल के खर्चों को कवर करती है लेकिन नियमित दंत उपचार को नहीं।\",\n     \"Yeh policy hospital ke kharchon ko cover karti hai lekin routine dental treatment ko nahin.\"),\n]\nfor name in [\"cl100k_base\", \"o200k_base\"]:\n    enc = tiktoken.get_encoding(name)\n    en, hi, ro = (sum(len(enc.encode(p[i])) for p in pairs) for i in range(3))\n    print(f\"{name}: en {en}, hi {hi} ({hi/en:.2f}x), romanised {ro} ({ro/en:.2f}x)\")"
      }
    },
    {
      "id": "cl-15",
      "q": "Estimate the monthly LLM bill in rupees for a support assistant in an Indian consumer app.",
      "round": [
        "tech1",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "india",
        "system-design"
      ],
      "why": "A common case-style question at Indian product companies. The panel wants a structured estimate with stated assumptions, Indian traffic shape, caching and taxes, not a number from memory.",
      "quick": [
        "Start from users, conversations and turns, not requests per second.",
        "Split tokens per turn: stable prefix, context, output.",
        "Apply caching to the prefix; convert at the day's rupee rate.",
        "Add GST, embeddings, guardrails, retries and a margin.",
        "Size rate limits for the evening peak, not the monthly average."
      ],
      "simple": "A good estimate is a chain of stated assumptions you can defend and change. Start with usage. Suppose the app has 5 million monthly active users, 8% use the assistant, each has 4 conversations a month, and each conversation has 6 turns. That's 9.6 million turns a month.\n\nThen tokens per turn: 1,500 tokens of stable prefix (system prompt and tool definitions), 1,000 of history, retrieved context and the user's message, and 250 of output. That's 24 billion input and 2.4 billion output tokens a month.\n\nNow price it with clearly illustrative numbers: a small model at $0.20 per million input and $0.80 per million output tokens, cache reads at 0.1x and writes at 1.25x of input, and ₹95 to the dollar. Without caching, input is $4,800 and output $1,920, about $6,720 or ₹6.4 lakh. With 80% cache hits on the prefix, the prefix costs about a third of list price, saving roughly $1,930, so the total is about $4,790, around ₹4.5 lakh. Check current prices and the exchange rate before using any of this.\n\nThen add what people forget: embeddings, guardrail and judge calls, retries, GST on imported services (confirm the treatment with finance) and a 20-30% margin. Finally check the peak minute, because Indian consumer traffic bunches into evenings and sale days, and tokens-per-minute limits are set by the peak.",
      "points": [
        "Usage funnel from monthly users to turns.",
        "Token breakdown per turn with the stable prefix separated.",
        "Labelled illustrative prices, caching maths and currency conversion.",
        "Hidden lines: embeddings, guardrails, retries, GST, margin.",
        "Peak-minute sizing for rate limits."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Building a monthly estimate: usage funnel, stable cacheable prefix, history and context, output, extra calls and the peak minute.",
        "caption": "**Every line is an assumption you can change.** Illustrative prices only - check current rates and the day's exchange rate.",
        "top": "one month",
        "bottom": "x ₹/$ + GST + margin = the bill",
        "layers": [
          {
            "label": "Usage funnel",
            "note": "5M MAU to 9.6M turns"
          },
          {
            "label": "Stable prefix",
            "note": "1,500 tokens, cacheable",
            "accent": "accent"
          },
          {
            "label": "History, context, question",
            "note": "1,000 tokens"
          },
          {
            "label": "Output",
            "note": "250 tokens, priced higher"
          },
          {
            "label": "Extra calls",
            "note": "embeddings, guardrails, retries",
            "accent": "warn"
          },
          {
            "label": "Peak minute",
            "note": "sets rate limits",
            "accent": "warn"
          }
        ]
      },
      "say": "I'd build it as a chain of assumptions. Say 5 million monthly users, 8% use the assistant, four conversations each, six turns per conversation: 9.6 million turns a month. Per turn, 1,500 tokens of stable prefix, 1,000 of history, context and question, and 250 out, so 24 billion input and 2.4 billion output tokens a month. With purely illustrative small-model prices of 20 cents per million in and 80 cents out, that's about 6,700 dollars, roughly 6.4 lakh rupees at 95 to the dollar. If the prefix hits the cache 80% of the time at the common 0.1x read and 1.25x write multipliers, it drops to about 4.5 lakh. Then I add embeddings, guardrail calls, retries, GST on imported services and a 25% margin, and check the evening peak against tokens-per-minute limits. Every number is a lever, so the discussion becomes which assumption to change.",
      "numbers": "Worked example (illustrative prices, check current rates): 9.6M turns x (2,500 in, 250 out) = 24B input + 2.4B output tokens a month, about $6,720 or ₹6.4 lakh at ₹95/$; with 80% cache hits on a 1,500-token prefix about $4,790 or ₹4.5 lakh, before GST, extra calls and margin.",
      "verified": "2026-10",
      "wrong": "Quoting one per-token price times a guessed request count. Without the usage funnel, token breakdown and caching, the estimate can't be defended or adjusted when an assumption changes.",
      "follow": "Finance wants the number with 30% fewer tokens per turn. Where do those tokens come from?",
      "followAnswer": "Mostly from the 1,000 tokens of history and context, because the prefix is already cheap when cached and output is only 250. I'd rerank and pass three chunks instead of six, summarise history beyond the last few turns, and drop tool definitions the support flow never uses. That can remove several hundred tokens per turn. I'd re-run the eval set after each change, then re-price. Moving intent classification and FAQ-style turns to a cheaper model or an answer cache may save more than trimming tokens.",
      "builds": [
        "cl-01",
        "rag-34",
        "cl-14"
      ],
      "next": [
        "cl-16",
        "cl-19",
        "cd-09"
      ],
      "deeper": [
        "openai-pricing",
        "claude-pricing"
      ],
      "check": {
        "kind": "numbers",
        "q": "9.6 million turns a month, 2,500 input tokens each. At an illustrative $0.20 per million input tokens, what is the monthly input cost before caching?",
        "options": [
          "$480",
          "$4,800",
          "$48,000",
          "$480,000"
        ],
        "answer": 1,
        "why": "9.6M x 2,500 = 24 billion tokens = 24,000 million; x $0.20 = $4,800. The usual slip is mixing up millions and billions, which moves the answer by a factor of 1,000."
      }
    },
    {
      "id": "cl-16",
      "q": "Do the maths: when does prompt caching actually save money, and how much?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "caching",
        "cost",
        "latency"
      ],
      "why": "llm-15 explains how prompt caching works. This tests the arithmetic - write premiums, hit ratios, cache lifetimes and how much of the bill is even cacheable - which decides whether caching is worth turning on.",
      "quick": [
        "Common multipliers: writes about 1.25x input, reads about 0.1x.",
        "With those, caching breaks even near a 22% hit ratio.",
        "Hit ratio depends on requests per prefix within the cache lifetime.",
        "Savings apply only to the cacheable share of the bill.",
        "Per-tenant or per-user text near the top fragments the cache."
      ],
      "simple": "Caching pricing has two sides. On several providers a cache write costs about 1.25 times the normal input price for a short lifetime and a read costs about 0.1 times, with longer lifetimes costing more to write and some newer models discounting reads further. Some providers charge nothing extra to write. So the effective price of the cacheable prefix, relative to list price, is h x 0.1 + (1 - h) x 1.25, where h is the hit ratio.\n\nSetting that equal to 1 gives break-even at h of about 0.22. Below roughly 22% hits, caching costs more than not caching. At 50% the prefix costs about 0.68 of list price, and at 90% about 0.22, a 78% saving.\n\nHit ratio isn't a setting. It depends on how often the same exact prefix arrives within the cache lifetime. A prefix used every few seconds stays warm; one used every ten minutes with a five-minute lifetime never hits. Tenant or user details near the start split one prefix into thousands of cold ones.\n\nThen scale to the bill. For example, if the prefix is 60% of input tokens and input is 70% of spend, a 78% prefix saving cuts the total by about 0.78 x 0.6 x 0.7, roughly 33%. That's large, but it isn't the headline discount.",
      "points": [
        "States write and read multipliers and the effective-price formula.",
        "Break-even near a 22% hit ratio at 1.25x and 0.1x.",
        "Hit ratio as a function of traffic per prefix and lifetime.",
        "Prefix fragmentation from tenant or user data.",
        "Turns a prefix saving into a total-bill saving."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Prefix cost relative to list price at 0%, 22%, 50% and 90% cache hit ratios, assuming 1.25x writes and 0.1x reads.",
        "caption": "**Below about 22% hits, caching loses money.** Assumes 1.25x writes and 0.1x reads - check your provider's current multipliers.",
        "aspects": [
          "Prefix cost vs list",
          "Saving on the prefix"
        ],
        "columns": [
          {
            "label": "0% hits",
            "cells": [
              "1.25x",
              "-25% (a loss)"
            ]
          },
          {
            "label": "22% hits",
            "cells": [
              "about 1.0x",
              "break-even"
            ]
          },
          {
            "label": "50% hits",
            "cells": [
              "about 0.68x",
              "about 32%"
            ]
          },
          {
            "label": "90% hits",
            "accent": "accent",
            "cells": [
              "about 0.22x",
              "about 78%"
            ]
          }
        ]
      },
      "say": "It's arithmetic. With the common multipliers, writes at about 1.25 times input and reads at about 0.1 times, the cacheable prefix costs h times 0.1 plus one minus h times 1.25 of list price. That breaks even around a 22% hit ratio, so below that caching costs money. At 90% hits the prefix is about 22% of list price, a 78% saving. But hit ratio isn't a switch. It depends on the same exact prefix arriving within the cache lifetime, so low-traffic prefixes with a five-minute lifetime never hit, and tenant or user details near the top split one warm prefix into thousands of cold ones. Then I scale it: if the prefix is 60% of input and input is 70% of spend, a 78% prefix saving is about a third off the bill. Large, but not the headline 90%. Multipliers differ by provider and model, so I check the current ones.",
      "numbers": "With 1.25x writes and 0.1x reads: break-even near h = 22%; h = 50% gives the prefix at about 0.68x list; h = 90% about 0.22x (78% saving). Multipliers differ by provider, cache lifetime and model - check current docs.",
      "verified": "2026-10",
      "wrong": "\"Caching gives a 90% discount, so input cost drops 90%.\" The discount applies only to hits on the cacheable prefix, writes may cost extra, and real hit ratios are often far below 100%.",
      "follow": "Your prefix is used about once every eight minutes and the cache lifetime is five. What are your options?",
      "followAnswer": "As things stand it almost never hits, and with a write premium it costs more than no caching. Options: pay for a longer lifetime if the provider offers one, which costs more per write but pays back after a couple of hits; merge similar prefixes so more traffic shares one, for example one system prompt for several features with the variable parts moved later; or turn explicit caching off for that route. For a batch job, I'd group the requests sharing the prefix so they run back to back.",
      "builds": [
        "llm-15",
        "cl-03"
      ],
      "next": [
        "cl-17",
        "cl-07",
        "cl-15"
      ],
      "deeper": [
        "claude-prompt-caching",
        "openai-prompt-caching"
      ],
      "check": {
        "kind": "numbers",
        "q": "Cache writes cost 1.25x input and reads 0.1x. Your logs show a 15% hit ratio on the cached prefix. Compared with not caching, the prefix costs:",
        "options": [
          "About 85% less",
          "About 15% less",
          "Exactly the same",
          "About 8% more"
        ],
        "answer": 3,
        "why": "0.15 x 0.1 + 0.85 x 1.25 is about 1.08, so the prefix costs about 8% more than list. Below roughly 22% hits the write premium outweighs the read discount; the discount only applies to hits."
      },
      "try": {
        "title": "Simulate cache hit ratio against request rate",
        "minutes": 15,
        "steps": [
          "Run the script and read the hit ratio and prefix cost for each request rate.",
          "Find the rate where prefix cost crosses 1.0x; observe it sits near one request every 20 minutes for a 5-minute lifetime.",
          "Change the lifetime to 60 minutes and the write multiplier to 2.0, and see how break-even moves.",
          "Model ten tenants that each get a tenth of the traffic with their own prefix, and observe how fragmentation lowers the hit ratio."
        ],
        "code": "import random\n\ndef simulate(rate_per_min, ttl_min=5.0, n=20000, write=1.25, read=0.1):\n    t, expires, hits = 0.0, -1.0, 0\n    for _ in range(n):\n        t += random.expovariate(rate_per_min)  # Poisson arrivals\n        if t <= expires:\n            hits += 1\n        expires = t + ttl_min  # a write or a hit refreshes the lifetime\n    h = hits / n\n    return h, h * read + (1 - h) * write\n\nfor rate in [0.02, 0.05, 0.1, 0.2, 0.5, 1, 5, 30]:\n    h, cost = simulate(rate)\n    print(f\"{rate:>5} req/min  hit ratio {h:4.2f}  prefix cost {cost:4.2f}x list\")"
      }
    },
    {
      "id": "cl-17",
      "q": "When do you use a provider's batch API, and how do you design an offline job around it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "cost",
        "llmops",
        "api-design"
      ],
      "why": "Many offline workloads run on real-time endpoints at full price. The panel checks you know the batch trade-off and the operational details that make batch jobs reliable.",
      "quick": [
        "Major providers discount batch about 50%, with a 24-hour window.",
        "Fits evals, backfills, enrichment, classification and re-embedding.",
        "Not for anything a user waits on, or tightly chained steps.",
        "Idempotent custom IDs; resubmit errored and expired requests.",
        "Can stack with prompt caching; group shared prefixes."
      ],
      "simple": "A batch API takes a file of requests, processes them asynchronously and returns results later. OpenAI, Anthropic and Google all price batch at about half the real-time rate, with a completion window of up to 24 hours, and many batches finish much sooner. Batch work usually has its own limits too, so it doesn't eat the real-time quota your users depend on.\n\nAnything nobody is waiting for is a candidate: nightly eval runs, LLM-as-judge scoring, back-filling summaries or contextual chunk headers across a corpus, classifying a month of tickets, generating synthetic test data and re-embedding after a model change. It's a poor fit for user-facing paths and for pipelines where each step needs the previous one, since every stage could wait up to a day.\n\nThe job design is where teams slip. Give every request a stable custom ID derived from its input, so results join back and re-runs don't duplicate work. Expect partial outcomes: some requests error and some expire unprocessed at the deadline (Anthropic doesn't bill expired ones), so the job collects them and resubmits. Split big jobs to stay under size limits and record the prompt version in a job manifest. For example, a 2-million-ticket classification run becomes 20 batches of 100,000 tracked in one manifest. Batch discounts can stack with prompt caching, so group requests that share a long prefix, ideally with a longer cache lifetime.",
      "points": [
        "About 50% discount and a 24-hour window across major providers.",
        "Suitable versus unsuitable workloads.",
        "Separate quota protects real-time traffic.",
        "Idempotent IDs, partial failures, expiry handling, chunking.",
        "Stacking with prompt caching."
      ],
      "say": "If nobody is waiting for the answer, I default to batch. The major providers price batch at about half the real-time rate, with up to a 24-hour window, and it usually has its own limits, so it doesn't compete with live traffic for quota. Typical uses are nightly evals, judge scoring, back-filling summaries or chunk headers, classifying ticket archives and re-embedding. I wouldn't use it on a user path or for chained steps, because each stage could wait a day. The engineering is in the job: stable custom IDs so results join back and re-runs are idempotent, collecting errored and expired requests for resubmission, chunking to stay under size limits, and recording the prompt version in a job manifest. Batch discounts can stack with prompt caching, so I group requests that share a long prefix.",
      "numbers": "OpenAI, Anthropic and Google document roughly a 50% batch discount with a window of up to 24 hours. Anthropic says most batches finish within an hour, caps a batch at 100,000 requests or 256 MB, and does not bill expired requests. Check current terms.",
      "verified": "2026-10",
      "wrong": "\"Batch is just a loop that sends requests in parallel.\" Client-side parallelism pays full price and competes with live traffic for rate limits; the discount and separate quota come only from the provider's batch endpoint.",
      "follow": "Your nightly eval must finish before the 9am release gate. Is batch safe to use?",
      "followAnswer": "Only with a fallback, because the provider promises completion within its window, not by my deadline. I'd submit early in the evening, poll, and at a cut-off, say 6am, send any unfinished requests to the real-time endpoint at full price. Usually most of the batch has finished long before then, so the fallback costs little. I also keep the eval set small enough that the real-time fallback alone could finish in time, and alert if batch completion time trends upwards.",
      "builds": [
        "riq-1202",
        "cd-09",
        "cl-01"
      ],
      "next": [
        "cl-16",
        "cl-23",
        "cl-19"
      ],
      "deeper": [
        "openai-batch",
        "claude-batch"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which workload is the worst fit for a 50%-discount batch API with a completion window of up to 24 hours?",
        "options": [
          "Scoring last night's 5,000 eval answers with an LLM judge.",
          "Re-embedding the document corpus after an embedding model upgrade.",
          "A three-step agent that drafts, critiques and revises a reply while the customer waits.",
          "Classifying a year of archived support tickets."
        ],
        "answer": 2,
        "why": "A customer is waiting and each step depends on the previous one, so a window of up to 24 hours per step is unacceptable. The others are offline, independent requests where half-price processing is ideal."
      }
    },
    {
      "id": "cl-18",
      "q": "How do reasoning tokens change the cost and latency of a feature, and how do you keep them under control?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cost",
        "inference",
        "latency"
      ],
      "why": "llm-19 explains what reasoning models are. This tests the operational reality: invisible tokens billed as output, truncated answers from tight limits, and budgeting effort per task.",
      "quick": [
        "Reasoning tokens are hidden but billed as output tokens.",
        "They delay the first visible token, so users see silence.",
        "Output limits include reasoning, so tight caps can return nothing.",
        "Set effort per task; log reasoning tokens from usage fields.",
        "Route easy requests away from reasoning modes."
      ],
      "simple": "A reasoning model writes an internal chain of thought before the visible answer. Those reasoning tokens usually aren't returned in full, but they're billed as output tokens, the expensive kind, and they take context space. A 300-token answer that needed 3,000 reasoning tokens bills 3,300 output tokens, eleven times what you see.\n\nThey also change latency. The model is generating the whole time it thinks, so time to first visible token can stretch to many seconds. Streaming a reasoning summary or a progress message helps the experience, but not the bill.\n\nThe classic production bug is the output limit. OpenAI's documentation states that `max_output_tokens` caps reasoning and visible output together. If the model spends the budget thinking, the response comes back incomplete, possibly with no visible text, and you've still paid. OpenAI recommends reserving at least 25,000 tokens for reasoning and output when you start experimenting, then tuning.\n\nControl comes from measurement and routing. Log reasoning tokens from the usage fields per task, choose the lowest effort level that passes each task's eval, cap budgets where the API allows, and route easy requests such as extraction or short chat to a non-reasoning model or the lowest effort. For example, a team may find that high effort on a classification step adds seconds and several times the cost for no accuracy gain.",
      "points": [
        "Billing and context effects of hidden reasoning.",
        "TTFT impact and how to soften it.",
        "Output cap includes reasoning; incomplete responses.",
        "Per-task effort tuned on evals; usage-field logging.",
        "Routing to avoid reasoning where unnecessary."
      ],
      "say": "Reasoning tokens are invisible but billed as output, the expensive side, so a 300-token answer that needed 3,000 tokens of thinking bills eleven times the output you see. They also push back the first visible token, because the model is generating the whole time it thinks. The bug that catches teams is the output limit: on OpenAI's models `max_output_tokens` covers reasoning plus the answer, so a tight cap returns an incomplete response, sometimes with no visible text, and you still pay. OpenAI suggests starting with at least 25,000 tokens reserved and tuning down. So I log reasoning tokens per task from the usage fields, pick the lowest effort level that passes each task's eval, and route easy work like extraction to a non-reasoning model. I also show progress during long thinking so the wait feels intentional.",
      "numbers": "Example: 300 visible + 3,000 reasoning tokens = 3,300 billed output tokens, 11x the visible answer. OpenAI's reasoning guide recommends reserving at least 25,000 tokens for reasoning and output when starting out.",
      "verified": "2026-10",
      "wrong": "\"Set `max_output_tokens` to 500 since answers are short.\" The cap includes reasoning, so the model can exhaust it while thinking and return nothing visible - and you are billed anyway.",
      "follow": "How would you choose the effort level for each step of a pipeline?",
      "followAnswer": "Empirically. For each step I run the eval set at every available effort level and record accuracy, reasoning tokens, cost and p95 latency, then pick the lowest level within an agreed margin of the best accuracy. Extraction and classification usually land at the lowest setting or a non-reasoning model, while planning or multi-document analysis justifies more. I re-run this when the model version changes, because effort levels don't map to the same token counts across versions, and I alert if reasoning tokens per request drift upwards.",
      "builds": [
        "llm-19",
        "pr-03"
      ],
      "next": [
        "cl-19",
        "cl-12",
        "cl-15"
      ],
      "deeper": [
        "openai-reasoning",
        "claude-docs"
      ],
      "check": {
        "kind": "predict",
        "q": "A reasoning model is called with `max_output_tokens=600` on a hard question. The response status is incomplete and the visible text is empty. What happened, and are you billed?",
        "options": [
          "The model spent the 600-token budget on reasoning; you pay for input and those reasoning tokens.",
          "The provider timed out, so nothing is billed.",
          "Moderation filtered the answer, so only input is billed.",
          "The model refused, and reasoning tokens are free."
        ],
        "answer": 0,
        "why": "The output cap covers reasoning plus visible text, so a tight cap can be used up entirely by thinking. Reasoning tokens are billed as output whether or not any answer appears."
      }
    },
    {
      "id": "cl-19",
      "q": "Design a model cascade: how does the small model decide to escalate, and when does the cascade actually save money?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "trade-offs",
        "evaluation"
      ],
      "why": "cl-06 covers routing patterns. This drills into the cascade specifically - the escalation signal, its calibration and the cost and latency arithmetic - which is where cascades quietly fail.",
      "quick": [
        "Small model first; escalate when a check says the answer is doubtful.",
        "Best signals are verifiable: schema, citations, tests, tool results.",
        "Self-reported confidence is poorly calibrated; calibrate on labelled data.",
        "Expected cost = small + escalation rate x large.",
        "Escalated requests pay both latencies, so watch p95."
      ],
      "simple": "In a cascade, every request goes to a cheap model first, and only answers that fail a check go to an expensive one. FrugalGPT reported matching the best single model's accuracy with up to 98% lower cost on its benchmarks, but the saving depends entirely on the escalation signal.\n\nThe best signals are things code can verify. Does the output parse against the schema, does every citation resolve to a retrieved chunk, does the generated SQL run, do the generated tests pass? Next come statistical signals, such as agreement between two or three samples, or token log-probabilities where the API exposes them. A small trained verifier can learn from labelled outcomes. Least reliable is asking the model how confident it is, because verbal confidence is poorly calibrated.\n\nThe arithmetic is simple. Expected cost per request is small cost plus escalation rate times large cost. If the small model costs a tenth of the large one and 30% escalate, you pay 0.1 + 0.3 = 0.4 of large-only, a 60% saving. But escalated requests pay both latencies, so p95 rises, and a lenient check lets wrong answers through cheaply. So you calibrate the threshold on a labelled set to keep quality within an agreed margin of large-only, then track escalation rate and quality per segment. For example, if escalation drifts from 30% to 60% after a data change, the saving halves.",
      "points": [
        "Verifiable escalation signals first.",
        "Calibration on labelled data; verbal confidence unreliable.",
        "Expected-cost formula with worked numbers.",
        "Latency penalty on escalated requests.",
        "Monitoring escalation rate and quality per segment."
      ],
      "diagram": {
        "alt": "Cascade: every request goes to the small model, a verifiable check returns most answers directly and escalates the rest to the large model.",
        "caption": "**The check is the design.** Cost is small + escalation rate x large, and escalated requests pay both latencies.",
        "rows": [
          [
            {
              "id": "r",
              "label": "Request"
            }
          ],
          [
            {
              "id": "s",
              "label": "Small model",
              "note": "every request"
            }
          ],
          [
            {
              "id": "c",
              "label": "Verifiable check",
              "note": "schema, citations, tests",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "ok",
              "label": "Return answer",
              "note": "most requests"
            },
            {
              "id": "l",
              "label": "Large model",
              "note": "escalated share pays both",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "r",
            "to": "s"
          },
          {
            "from": "s",
            "to": "c"
          },
          {
            "from": "c",
            "to": "ok"
          },
          {
            "from": "c",
            "to": "l"
          }
        ]
      },
      "say": "Every request hits the small model first, and only answers that fail a check go to the large one. The design is all in that check. I prefer signals code can verify: the output validates against the schema, citations resolve, the SQL runs, the tests pass. Next are sample agreement and log-probabilities, then a small trained verifier. Asking the model how confident it is comes last, because that's poorly calibrated. The cost is small plus escalation rate times large, so with a small model at a tenth of the price and 30% escalating, I pay 40% of large-only. But escalated requests pay both latencies, so I check p95, and I calibrate the threshold on a labelled set so quality stays within an agreed margin of large-only. In production I watch escalation rate per segment, because if it drifts up the saving disappears quietly.",
      "numbers": "Expected cost = c_small + q x c_large. With c_small = 0.1 x c_large: q = 30% gives 0.4 of large-only (60% saving); q = 60% gives 0.7 (30% saving). The cascade costs more than large-only once q exceeds 1 - c_small/c_large.",
      "wrong": "\"The small model will say when it isn't sure.\" Self-reported confidence is poorly calibrated; without a verifiable or calibrated signal the cascade either escalates everything or ships confident wrong answers.",
      "follow": "Escalated requests now breach the p95 latency budget. What do you change?",
      "followAnswer": "Three options, often together. Predict escalation up front for request types that almost always escalate and send them straight to the large model, so they don't pay twice. Run the cheap checks as early as possible, so escalation starts sooner. And for latency-critical surfaces, call both models in parallel on the hard segment and cancel the large call if the small answer passes, accepting some extra cost there. I'd measure cost and p95 for each option on replayed traffic before choosing.",
      "builds": [
        "cl-06",
        "ag-27"
      ],
      "next": [
        "cl-20",
        "cl-18",
        "ops-04"
      ],
      "deeper": [
        "frugalgpt",
        "litellm"
      ],
      "check": {
        "kind": "numbers",
        "q": "A small model costs 20% of the large one per request. Above what escalation rate does the cascade cost more than always using the large model?",
        "options": [
          "20%",
          "50%",
          "80%",
          "100%"
        ],
        "answer": 2,
        "why": "Cascade cost is 0.2 + q times the large cost, which exceeds 1.0 once q passes 0.8. Below that it saves money on cost alone, though latency and quality may argue against it much earlier."
      }
    },
    {
      "id": "cl-20",
      "q": "Your semantic cache hits 35% of requests, and complaints about wrong answers went up. What went wrong?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "caching",
        "embeddings",
        "debugging"
      ],
      "why": "py-29 builds a semantic cache and ar-10 covers safe cache keys. This is the debugging scenario: the specific ways similarity matching serves the wrong answer, and how to measure false hits.",
      "quick": [
        "Similar wording isn't the same question: negation, entities, numbers.",
        "Follow-ups like 'what about the premium plan?' need conversation context.",
        "One global threshold fails; tune per intent on labelled pairs.",
        "Measure false-hit rate by regenerating and judging sampled hits.",
        "Never cache personalised, time-sensitive or permission-scoped answers."
      ],
      "simple": "A semantic cache returns a stored answer when a new query's embedding is close enough to an old one. The trouble is that embeddings capture topic well and precise meaning badly. \"How do I cancel my order?\" and \"How do I cancel my subscription?\" can sit very close, and so can \"is this covered\" and \"is this not covered\", or two questions that differ only in a number or a city. A 35% hit rate with rising complaints usually means the threshold is admitting these near-misses.\n\nOther causes show up in the logs. Follow-up turns such as \"and for the premium plan?\" mean nothing without the conversation, so caching them on the last message alone is wrong. Answers that depend on the user, the date or their permissions were cached as if they were general. An embedding model upgrade moved the similarity scale, so an old threshold now means something different. Multilingual and romanised queries may cluster by language more than by meaning.\n\nThe fix starts with measurement. Sample cache hits daily, regenerate fresh answers and have a judge or reviewer compare them, giving a false-hit rate. Tune thresholds per intent on labelled pairs, add exact-match filters on extracted entities such as product, plan and amounts, skip caching for follow-ups and personalised intents, and expire entries when content versions change. For example, requiring the extracted product name to match exactly removes the order-versus-subscription confusion entirely.",
      "points": [
        "Names the near-miss classes: negation, entities, numbers.",
        "Context-dependent follow-ups and personalised answers.",
        "Threshold drift after embedding model changes.",
        "False-hit rate from sampled hits, regenerated and judged.",
        "Per-intent thresholds, entity filters and cache exclusions."
      ],
      "say": "A 35% hit rate with rising complaints means the cache is admitting near-misses. Embeddings capture topic well and exact meaning badly, so cancelling an order and cancelling a subscription, a question and its negation, or two questions differing only in a number all score as similar. I'd check the logs for the other usual causes: follow-up turns cached without their conversation, personalised or permission-dependent answers cached as general, and an embedding upgrade that shifted the similarity scale under an old threshold. Then I'd measure: sample hits daily, regenerate fresh answers and have a judge compare them, which gives a false-hit rate. The fixes are per-intent thresholds tuned on labelled pairs, exact-match filters on extracted entities like product and plan, no caching for follow-ups or personalised intents, and expiry tied to content versions. A lower hit rate with near-zero false hits is the better trade.",
      "numbers": "Track false-hit rate next to hit rate. A cache with 35% hits and 3% of those hits wrong serves a wrong answer on about 1 in 100 requests, which most products cannot accept.",
      "wrong": "\"Lower the threshold to get more hits.\" That trades a small cost saving for confidently wrong answers, which cost far more in support load and trust.",
      "follow": "How do you pick the threshold per intent?",
      "followAnswer": "From labelled pairs. For each intent I collect query pairs from logs, label whether one answer would correctly serve both, and plot the precision and recall of cache hits across thresholds. I choose the threshold that keeps precision above the agreed bar, usually very high, and accept whatever hit rate that gives. Intents that never reach the bar, like account-specific questions, are excluded. I repeat this whenever the embedding model changes, because scores aren't comparable across models.",
      "builds": [
        "py-29",
        "ar-10"
      ],
      "next": [
        "cl-16",
        "cl-19"
      ],
      "deeper": [
        "eugeneyan-patterns",
        "sentence-transformers"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which query pair is a semantic cache with a 0.92 similarity threshold most likely to wrongly treat as the same question?",
        "options": [
          "\"Reset my password\" / \"How do I change my password?\"",
          "\"Is dental covered under my plan?\" / \"Is dental not covered under my plan?\"",
          "\"Store opening hours\" / \"When does the store open?\"",
          "\"Track my parcel\" / \"Where is my delivery?\""
        ],
        "answer": 1,
        "why": "Negation barely moves an embedding, so the two dental questions score as near-identical but need opposite answers. The other pairs really are the same question, where a cache hit is correct."
      },
      "try": {
        "title": "See why one similarity threshold can't separate paraphrases from near-misses",
        "minutes": 15,
        "steps": [
          "Install sentence-transformers and run the script.",
          "Compare the paraphrase scores with the near-miss scores and note any near-miss scoring as high as a paraphrase.",
          "Try to choose one threshold that admits every paraphrase and rejects every near-miss, and observe whether one exists.",
          "Add a rule that the extracted product word must match, and see which near-misses it removes.",
          "Swap in a different embedding model and observe how all the scores shift, which is why thresholds need re-tuning."
        ],
        "code": "from sentence_transformers import SentenceTransformer, util\n\nm = SentenceTransformer(\"all-MiniLM-L6-v2\")\npairs = {\n    \"paraphrase\": [(\"How do I reset my password?\", \"I forgot my password, how can I change it?\"),\n                   (\"When does the store open?\", \"What are your opening hours?\")],\n    \"near-miss\": [(\"How do I cancel my order?\", \"How do I cancel my subscription?\"),\n                  (\"Is dental covered under my plan?\", \"Is dental not covered under my plan?\"),\n                  (\"Refund for orders over 5000 rupees\", \"Refund for orders under 5000 rupees\")],\n}\nfor kind, items in pairs.items():\n    for a, b in items:\n        s = util.cos_sim(m.encode(a), m.encode(b)).item()\n        print(f\"{kind:10s} {s:.3f}  {a} | {b}\")"
      }
    },
    {
      "id": "cl-21",
      "q": "Size the GPUs: a 70B model serving 50 concurrent users with up to 8k tokens of context each.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "open-weights",
        "inference"
      ],
      "why": "cl-08 and tf-12 give the formulas. This checks you can combine weights, KV cache and overhead into a concrete deployment, and know which levers change the answer.",
      "quick": [
        "Weights: parameters x bytes; 70B in FP16 is about 140 GB.",
        "KV per token = 2 x layers x KV heads x head dim x bytes.",
        "A Llama-3-70B-shaped model needs about 320 KB per token in FP16.",
        "50 users at 8k tokens is about 134 GB of KV cache.",
        "FP8 weights and KV roughly halve it: two 80 GB GPUs."
      ],
      "simple": "GPU memory has three parts: weights, KV cache and overhead. Weights are parameters times bytes per parameter, so a 70B model needs about 140 GB in FP16 and about 70 GB in FP8.\n\nThe KV cache is per token: 2 (keys and values) x layers x KV heads x head dimension x bytes. For a Llama-3-70B-shaped model with 80 layers, 8 KV heads (grouped-query attention) and a head dimension of 128 in FP16, that's 2 x 80 x 8 x 128 x 2 = 327,680 bytes, about 320 KB per token. An 8k-token conversation needs about 2.7 GB, and 50 of them at full length about 134 GB.\n\nSo FP16 needs about 274 GB plus overhead for activations and the runtime. vLLM reserves 90% of each GPU's memory by default and gives what's left after weights to the KV cache, so four 80 GB GPUs, about 288 GB usable, is tight. Quantising weights to FP8 (70 GB) and the KV cache to FP8 (about 67 GB) brings it to about 137 GB, which just fits two 80 GB GPUs with tensor parallelism, if FP8 passes your evals.\n\nThe worst case is rarely the real case. PagedAttention allocates only the tokens actually used, so if average context is 3k you fit far more users. Size from the real distribution of context lengths, then load-test.",
      "points": [
        "Three components: weights, KV cache, overhead.",
        "Correct KV formula with grouped-query attention numbers.",
        "Worked totals for FP16 and FP8.",
        "vLLM memory reservation and tensor parallelism.",
        "Real context distribution versus the worst case."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "GPU memory budget for a 70B model serving 50 users at 8k context: weights, KV cache, runtime overhead, engine headroom, and real context lengths.",
        "caption": "**The KV cache is as big as the weights here.** FP8 for both halves the total; real context lengths, not the worst case, set true capacity.",
        "top": "80 GB x N GPUs",
        "bottom": "fits or not",
        "layers": [
          {
            "label": "Weights",
            "note": "140 GB FP16, 70 GB FP8"
          },
          {
            "label": "KV cache",
            "note": "320 KB/token FP16, 134 GB for 50 x 8k",
            "accent": "warn"
          },
          {
            "label": "Runtime overhead",
            "note": "activations, CUDA graphs"
          },
          {
            "label": "Engine headroom",
            "note": "vLLM uses 90% by default"
          },
          {
            "label": "Real lengths",
            "note": "average context sets real capacity",
            "accent": "accent"
          }
        ]
      },
      "say": "Three parts: weights, KV cache and overhead. A 70B model in FP16 is about 140 GB of weights. For the KV cache, a Llama-3-70B-shaped model has 80 layers, 8 KV heads and a head dimension of 128, so 2 x 80 x 8 x 128 x 2 bytes is about 320 KB per token. Fifty users at 8k tokens is about 400,000 tokens, roughly 134 GB. So FP16 needs about 274 GB plus runtime overhead, which is tight on four 80 GB GPUs once vLLM keeps its 10% headroom. With FP8 weights and an FP8 KV cache it's about 137 GB, which fits two 80 GB GPUs with tensor parallelism, if FP8 passes our evals. But 8k for everyone at once is the worst case. PagedAttention only allocates tokens actually used, so I'd size from the real context-length distribution and confirm with a load test at the target latency.",
      "numbers": "Llama-3-70B shape (80 layers, 8 KV heads, head dim 128): about 320 KB per token in FP16, about 2.7 GB per 8k sequence. 50 x 8k is about 134 GB of KV + 140 GB FP16 weights = about 274 GB; with FP8 weights and KV about 137 GB.",
      "wrong": "\"70B in FP8 is 70 GB, so one 80 GB GPU is enough.\" That leaves almost nothing for the KV cache, so the server fits one or two short requests at best.",
      "follow": "How many concurrent 8k users fit on one 80 GB GPU with an FP8 70B model?",
      "followAnswer": "Very few. Usable memory is about 72 GB at vLLM's default 90% reservation, the weights take about 70 GB, so roughly 2 GB is left for the KV cache before overhead. An 8k sequence with an FP8 KV cache needs about 1.3 GB, so perhaps one full-length user, which isn't a real deployment. I'd use two GPUs, or quantise weights to INT4 with something like AWQ, about 35 GB, leaving roughly 35 GB for around 25 full-length sequences, or move to a GPU with more memory. Each option gets checked for quality and latency.",
      "builds": [
        "tf-12",
        "cl-08",
        "cl-11"
      ],
      "next": [
        "cl-22",
        "cl-23",
        "cl-25"
      ],
      "deeper": [
        "paged-attention",
        "vllm"
      ],
      "check": {
        "kind": "numbers",
        "q": "A model has 32 layers, 8 KV heads, head dimension 128 and an FP16 KV cache. Roughly how much KV memory does one 8,192-token sequence need?",
        "options": [
          "About 128 MB",
          "About 4 GB",
          "About 16 GB",
          "About 1 GB"
        ],
        "answer": 3,
        "why": "2 x 32 x 8 x 128 x 2 bytes = 131,072 bytes (128 KB) per token, times 8,192 is about 1.07 GB. The 4 GB answer assumes 32 KV heads, which ignores grouped-query attention."
      }
    },
    {
      "id": "cl-22",
      "q": "Which quantisation do you choose for serving, and how do you know it hasn't hurt quality?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "open-weights",
        "serving",
        "evaluation"
      ],
      "why": "llm-12 explains what quantisation is. This tests serving judgement: which format helps which bottleneck, on which hardware, and how you validate it, especially for Indian languages.",
      "quick": [
        "Weight-only INT4 (AWQ, GPTQ) shrinks memory and speeds low-batch decoding.",
        "FP8 weights and activations speed compute-heavy prefill and large batches.",
        "An FP8 KV cache roughly doubles how much context fits.",
        "Check the engine has fast kernels for that format on your GPU.",
        "Validate per language; non-Latin scripts degrade first."
      ],
      "simple": "Quantisation formats target different bottlenecks. Decoding at small batch sizes is memory-bound: the GPU spends its time reading weights. Weight-only formats like AWQ or GPTQ at INT4 shrink weights about fourfold from FP16, so each step reads less, which lowers per-token latency and frees memory. But the maths still runs in 16-bit after de-quantising, so under heavy batching the gain shrinks. FP8 for weights and activations, on GPUs with FP8 tensor cores, speeds up the compute itself, so it helps prefill and large batches, and quality is usually close to FP16. Quantising the KV cache to FP8 halves its size, roughly doubling how much context fits, which is often the real capacity limit.\n\nSo choose by workload. A latency-sensitive, low-concurrency internal tool may prefer INT4 weights, while a high-throughput service on recent GPUs often prefers FP8 weights plus an FP8 KV cache. Check your serving engine has fast kernels for the format on your exact GPU, because an unsupported combination can be slower than FP16.\n\nValidation is the step that gets skipped. Perplexity and general benchmarks understate damage, so run your own task evals, long-context cases and every language you serve. A study of quantised multilingual models found non-Latin-script languages were hurt most, and that automatic metrics badly underestimated what human evaluators saw. For example, an INT4 model can match FP16 on English FAQs and still slip on Hindi answers.",
      "points": [
        "Matches format to bottleneck: memory-bound decode versus compute-bound batches.",
        "KV cache quantisation for concurrency.",
        "Hardware and kernel support checked.",
        "Task, long-context and per-language evals with a human-rated sample.",
        "Notes that non-Latin scripts degrade more."
      ],
      "say": "I pick by bottleneck. Low-batch decoding is memory-bound, so weight-only INT4 like AWQ cuts the bytes read per token and frees memory, which suits latency-sensitive, low-concurrency services. High-throughput serving is more compute-bound, so on GPUs with FP8 tensor cores I'd use FP8 weights and activations, which usually stays very close to FP16 quality. I often quantise the KV cache to FP8 too, because it roughly doubles how much context fits, and that's usually the real concurrency limit. I check the serving engine has fast kernels for that format on our exact GPU, since an unsupported combination can be slower than FP16. Then I validate on our own task evals, long-context cases and every language we serve. Research on quantised multilingual models found non-Latin scripts degrade most and automatic metrics underestimate it, so for Hindi I'd add a human-rated sample.",
      "numbers": "Weights shrink to about 1/2 (8-bit) or 1/4 (4-bit) of FP16, plus a few percent for scales; an FP8 KV cache halves KV memory. Marchisio et al. (2024) found human raters saw a 16% drop on realistic Japanese prompts that automatic metrics largely missed.",
      "wrong": "\"INT4 is always fastest because it's smallest.\" Weight-only INT4 still computes in 16-bit; at high batch sizes, or without good kernels for your GPU, FP8 or even FP16 can deliver more throughput.",
      "follow": "Your INT4 model matches FP16 on English evals but users report worse Hindi answers. What next?",
      "followAnswer": "I'd confirm it with a Hindi eval set rated by native speakers, comparing FP16 and INT4 side by side, since automatic metrics may hide it. If the gap is real, I'd try FP8, which usually loses less, or recalibrate AWQ or GPTQ with a calibration set that includes Hindi text, since calibration data shapes which weights are protected. If neither closes it, I'd route Hindi traffic to the higher-precision deployment and size capacity for that split.",
      "builds": [
        "llm-12",
        "cl-21"
      ],
      "next": [
        "cl-23",
        "cl-24",
        "ft-09"
      ],
      "deeper": [
        "awq",
        "quant-multilingual"
      ],
      "check": {
        "kind": "predict",
        "q": "You serve a model at batch size 64 on FP8-capable GPUs and switch from FP8 weights and activations to weight-only INT4. Throughput drops. Why?",
        "options": [
          "INT4 weights take more memory than FP8.",
          "INT4 disables continuous batching.",
          "Quantisation always lowers throughput.",
          "Weight-only INT4 computes in 16-bit, so compute-bound large batches lose FP8's faster maths."
        ],
        "answer": 3,
        "why": "At large batch, serving is compute-bound and FP8 tensor cores speed the maths. Weight-only INT4 saves memory bandwidth, which matters most at small batch, but computes in 16-bit. INT4 weights are smaller, not larger."
      }
    },
    {
      "id": "cl-23",
      "q": "Do the TCO maths: at what volume does self-hosting an open-weight model beat paying per token?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cost",
        "open-weights",
        "trade-offs"
      ],
      "why": "cl-05 covers the decision factors. This checks the arithmetic - GPU-hours, measured throughput, utilisation, redundancy and people - with rupee pricing and honest assumptions.",
      "quick": [
        "Self-hosting is a fixed hourly cost; APIs scale with tokens.",
        "Measure throughput at your latency target, not peak.",
        "Average utilisation, not peak, sets real cost per request.",
        "Count redundancy: at least two GPUs for availability.",
        "Engineering and on-call time often exceed the GPU bill."
      ],
      "simple": "Self-hosting turns a variable cost into a fixed one, so the question is the volume at which the fixed cost per request drops below the API price.\n\nHere is the arithmetic with clearly illustrative numbers. Assume an H100-class GPU at ₹300 an hour on an Indian cloud (on-demand rates vary widely), about ₹2.2 lakh a month. Suppose a load test shows one GPU running a small open-weight model sustains 6 requests a second at your p95 target, with 3,000 input and 300 output tokens each. At 100% utilisation that's about 15.8 million requests a month, roughly ₹14 per thousand. Indian traffic peaks in the evening and falls overnight, so 30% average utilisation is realistic, which makes it about ₹46 per thousand.\n\nNow the API. At an illustrative $0.15 per million input and $0.60 per million output tokens, the same request costs about $0.00063, roughly ₹60 per thousand at ₹95 to the dollar. Self-hosting looks cheaper until you add redundancy and people. Two GPUs for availability cost ₹4.4 lakh a month before serving anything, so you need about 7.3 million requests a month, around 240,000 a day, just to match the API on hardware. A share of an engineer's time for on-call, upgrades and security usually adds more than the GPUs.\n\nSo self-hosting wins at high, steady volume, or when data residency decides it. Below that, an API or a managed open-weight endpoint is cheaper.",
      "points": [
        "Fixed versus variable cost framing.",
        "Throughput measured at the latency target; utilisation from traffic shape.",
        "Worked per-request comparison with labelled prices.",
        "Redundancy floor and break-even volume.",
        "People cost and managed open-weight endpoints."
      ],
      "say": "I compare cost per thousand requests. Self-hosted cost is GPU-hours divided by requests actually served. Illustratively, an H100-class GPU at ₹300 an hour is about ₹2.2 lakh a month. If a load test shows it sustains six requests a second at our latency target, that's about ₹14 per thousand at full use, but Indian consumer traffic peaks in the evening, so at 30% average utilisation it's about ₹46. An illustrative small API model at 15 cents in and 60 cents out per million tokens is about ₹60 per thousand for the same request. So self-hosting looks cheaper, until I add a second GPU for availability: that's ₹4.4 lakh a month fixed, so we need around 7 million requests a month just to break even on hardware, before on-call and upgrades. Self-hosting wins at high, steady volume or when residency forces it. Otherwise an API or a managed open-weight endpoint.",
      "numbers": "Illustrative (check current prices): ₹300 per GPU-hour x 730 h = about ₹2.2 lakh a month. 6 req/s is about 15.8M requests a month at 100% use (₹14 per 1,000); at 30% use about ₹46 per 1,000. Against an API at about ₹60 per 1,000, a two-GPU floor of ₹4.4 lakh needs about 7.3M requests a month to break even.",
      "verified": "2026-10",
      "wrong": "Dividing the GPU price by its peak benchmark throughput. That assumes 100% utilisation, a single GPU with no failover and zero engineering time - three assumptions that are each wrong.",
      "follow": "80% of your traffic arrives in a six-hour evening window. How does that change the decision?",
      "followAnswer": "It hurts self-hosting, because I provision for the evening peak and pay for idle GPUs the other eighteen hours, so average utilisation could fall well below 30%. Options: autoscale GPU nodes with the daily curve if the cloud has capacity and model loading is fast enough, fill off-peak hours with batch work like evals and backfills, or keep a small self-hosted base and burst to an API at peak. If none of those works, the API's pay-per-token model suits a peaky curve better and I'd stay on it.",
      "builds": [
        "cl-05",
        "cl-21"
      ],
      "next": [
        "cl-25",
        "cd-09",
        "cl-22"
      ],
      "deeper": [
        "vllm",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "numbers",
        "q": "A GPU costs ₹2.2 lakh a month and could serve 15 million requests a month at full utilisation. Traffic averages 25% of that capacity. What is the GPU cost per 1,000 requests actually served?",
        "options": [
          "About ₹15",
          "About ₹37",
          "About ₹59",
          "About ₹147"
        ],
        "answer": 2,
        "why": "Requests served = 25% x 15M = 3.75M, and ₹2.2 lakh / 3,750 thousand is about ₹59. Using full capacity gives the tempting ₹15, which is why benchmark-based TCO looks far better than reality."
      }
    },
    {
      "id": "cl-24",
      "q": "Should you turn on speculative decoding for your vLLM deployment? How do you decide?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "inference",
        "serving",
        "latency"
      ],
      "why": "llm-13 explains speculative decoding. This tests production judgement: which drafting method suits which workload, why gains vanish at high batch sizes, and how to measure it.",
      "quick": [
        "It helps when decoding is memory-bound: low batch, latency-critical.",
        "Gains shrink, and can reverse, at large batch sizes.",
        "Drafters: small model, EAGLE-style heads, n-gram prompt lookup.",
        "N-gram drafting suits outputs that copy the input, like RAG.",
        "Measure accepted tokens per step and p95 at real concurrency."
      ],
      "simple": "Speculative decoding helps because at low batch sizes each decoding step is limited by reading weights from memory, so verifying several drafted tokens costs about the same as generating one. At high batch sizes the GPU is already doing useful maths for many requests, so the spare capacity that made verification cheap is gone, and drafting becomes overhead. One published measurement in vLLM saw an EAGLE-based speed-up fall from about 1.3x at batch size 2 to 0.7x, a slowdown, at batch size 48.\n\nThe drafting method matters. A separate small draft model needs the same tokeniser and its own memory. EAGLE-style heads are small layers trained on the target model's hidden states and tend to get more tokens accepted. N-gram or prompt-lookup drafting proposes tokens copied from the prompt and needs no extra model, so it suits outputs that repeat the input, such as RAG answers quoting sources, summaries and code edits.\n\nTo decide, measure on your own traffic at your real concurrency. Track mean accepted tokens per step, time per output token and end-to-end p50 and p95, with and without speculation. For example, a quiet internal code assistant running at batch sizes of 1 to 4 may gain substantially, while a busy public chatbot at batch 64 may lose throughput. Some teams enable it only below a load threshold.",
      "points": [
        "Memory-bound mechanism and why batch size erodes it.",
        "Draft model, EAGLE heads and n-gram trade-offs.",
        "Workload fit: copy-heavy outputs for n-gram drafting.",
        "Acceptance length and latency measured at real concurrency.",
        "Load-dependent enabling."
      ],
      "say": "It depends on batch size and workload, so I'd measure. Speculative decoding works because low-batch decoding is memory-bound, so checking several drafted tokens costs about the same as generating one. At high batch sizes that spare capacity is gone and the drafting becomes overhead. One published vLLM measurement saw EAGLE go from about 1.3x faster at batch 2 to 0.7x, slower, at batch 48. Method matters too. A small draft model needs memory and the same tokeniser; EAGLE-style heads usually get more tokens accepted; n-gram prompt lookup needs no model and suits RAG answers, summaries and code edits that copy from the input. So I'd test on replayed traffic at our real concurrency, comparing accepted tokens per step, TPOT and p95 with it on and off. A quiet internal tool probably gains; a busy public chatbot may lose. Some teams enable it only below a load threshold.",
      "numbers": "Reported: EAGLE-based speculation in vLLM fell from about 1.3x speed-up at batch size 2 to about 0.7x (a slowdown) at batch size 48, as cited in \"Efficient Speculative Decoding for Llama at Scale\" (2025). Measure at your own concurrency.",
      "wrong": "\"Speculative decoding is free latency, so turn it on everywhere.\" The output is unchanged, but under heavy batching the extra work can cut throughput and raise latency.",
      "follow": "Your acceptance rate is high but end-to-end latency didn't improve. Why?",
      "followAnswer": "First I'd check where the time goes. If most latency is prefill, queueing or tool calls, faster decoding barely shows end to end. Second, at our batch size the verification passes may cost more than the steps they save, so high acceptance doesn't become speed. Third, drafting overhead, such as CPU-side n-gram matching or a draft model competing for GPU memory, can eat the gain and even shrink the KV cache, causing more pre-emption. I'd compare TPOT separately from TTFT and queue time to see which it is.",
      "builds": [
        "llm-13",
        "cl-04"
      ],
      "next": [
        "cl-25",
        "cl-22",
        "cl-12"
      ],
      "deeper": [
        "speculative-decoding",
        "eagle"
      ],
      "check": {
        "kind": "predict",
        "q": "Speculative decoding gives a 2x speed-up for a single user in testing. In production the server runs at batch size 64. What should you expect?",
        "options": [
          "A much smaller gain, possibly a slowdown, because decoding is no longer memory-bound.",
          "The same 2x, because output quality is unchanged.",
          "A larger gain, because more requests share the draft model.",
          "No effect at any batch size."
        ],
        "answer": 0,
        "why": "At large batch the GPU's compute is busy serving many requests, so verifying drafts is no longer nearly free. Unchanged output quality is true but says nothing about speed."
      }
    },
    {
      "id": "cl-25",
      "q": "How do you load test an LLM service so the numbers predict production?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "serving",
        "latency",
        "testing"
      ],
      "why": "riq-2901 is one project's story. This tests the general method - realistic workload modelling, open versus closed loops, the right metrics, goodput and finding the knee - which separates capacity planning from a demo benchmark.",
      "quick": [
        "Replay real input and output length distributions, not fixed prompts.",
        "Use open-loop arrivals; closed loops hide queueing.",
        "Measure TTFT, TPOT, worst stall and end-to-end at p50/p95/p99.",
        "Goodput: requests per second meeting every latency target.",
        "Ramp in steps; capacity is the last step meeting targets."
      ],
      "simple": "An LLM load test only predicts production if the workload looks like production. Request cost varies enormously with input and output length, so replay sampled real prompts or at least real length distributions. A test with 200-token prompts and 100-token answers will overstate the capacity of a RAG system that sends 4,000 tokens and writes 500. Warm the prefix cache as production would, and include multi-turn sessions.\n\nThe arrival pattern matters next. In a closed loop each virtual user waits for its response before sending again, so the load eases off when the server slows, hiding queueing. An open loop sends requests at a set rate, with Poisson or burstier arrivals, which is how independent users behave. `vllm bench serve` supports a request rate with a burstiness setting; NVIDIA's AIPerf, the successor to GenAI-Perf, and Locust or k6 with streaming clients cover the full stack.\n\nMeasure TTFT, time per output token, the worst inter-token gap, end-to-end latency at p50, p95 and p99, and errors including 429s. Then compute goodput, the rate of requests meeting all your targets at once, an idea from the DistServe paper that vLLM's benchmark also reports. Raw throughput keeps rising after users are unhappy; goodput peaks. Ramp the rate in steps, hold each until stable, and quote capacity as the last step meeting targets. Test the model server alone and the full stack, and for hosted APIs, against your real rate limits.",
      "points": [
        "Realistic length distributions and cache warm-up.",
        "Open versus closed loop, and burstiness.",
        "Full latency metric set at percentiles, plus errors.",
        "Goodput as the capacity metric.",
        "Stepped ramp to the knee; server-only and full-stack runs."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Load-test steps: model the workload, choose open-loop arrivals, warm up, ramp in steps, measure latency metrics, and find the knee in goodput.",
        "caption": "**Capacity is goodput at your targets, not peak throughput.** Realistic lengths and open-loop arrivals are what make the number predictive.",
        "lanes": [
          {
            "label": "Model the workload",
            "note": "real length distributions"
          },
          {
            "label": "Choose arrivals",
            "note": "open loop, bursty"
          },
          {
            "label": "Warm up",
            "note": "prefix cache, autoscaling"
          },
          {
            "label": "Ramp in steps",
            "note": "hold until stable"
          },
          {
            "label": "Measure",
            "note": "TTFT, TPOT, stalls, errors"
          },
          {
            "label": "Find the knee",
            "note": "goodput at targets",
            "accent": "accent"
          }
        ]
      },
      "say": "First, the workload has to look like production, because LLM request cost depends on token lengths. I replay sampled real prompts, or at least the real input and output length distributions, warm the prefix cache and include multi-turn sessions. Second, I use open-loop arrivals at a set rate with some burstiness, because a closed loop of virtual users backs off when the server slows and hides the queue. `vllm bench serve` does that for the model server; Locust or k6 with streaming clients test the full stack. Third, I measure TTFT, TPOT, worst inter-token gap and end-to-end at p50, p95 and p99, plus errors and 429s, and compute goodput: requests per second meeting every target together. Throughput keeps rising after users are unhappy; goodput peaks. I ramp in steps, hold each until stable, and quote capacity as the last step that meets the targets.",
      "numbers": "Quote capacity as goodput at your targets, for example \"12 requests/s with p95 TTFT under 1 s and p95 TPOT under 50 ms\", not peak throughput. Hold each ramp step for several minutes so queues and caches settle.",
      "verified": "2026-10",
      "wrong": "\"We ran 100 concurrent users sending the same short prompt and got 300 requests a second.\" Identical short prompts hit the prefix cache and understate prefill and decode, and a closed loop hides queueing.",
      "follow": "Goodput peaks at 8 requests a second but you expect 20 at peak. What are your options?",
      "followAnswer": "First, which target fails first. If TTFT fails, prefill or queueing is the limit, so I'd look at prompt caching, shorter prompts, chunked prefill or more replicas. If TPOT fails, decode is saturated, so quantisation, a smaller model for part of the traffic, or more GPUs. Adding replicas is the dependable fix, at about 2.5 times the hardware here. In parallel I'd shave demand: cache common answers, route easy requests to a smaller model and move non-urgent work to batch. Then re-test, because each change moves the knee.",
      "builds": [
        "riq-2901",
        "cl-10",
        "cl-04"
      ],
      "next": [
        "cl-23",
        "cl-02",
        "cl-21"
      ],
      "deeper": [
        "vllm-bench",
        "distserve"
      ],
      "check": {
        "kind": "concept",
        "q": "Why can a closed-loop load test, where each virtual user waits for its reply before sending again, overstate an LLM service's capacity?",
        "options": [
          "Closed loops send more requests than open loops.",
          "As the server slows, users send less, so the queueing real independent traffic would cause is hidden.",
          "Closed loops cannot measure time to first token.",
          "Closed loops always use identical prompts."
        ],
        "answer": 1,
        "why": "In a closed loop the arrival rate falls as latency rises, so the system never sees the backlog real users would create. Open-loop arrivals at a set rate expose queueing; closed loops can still measure TTFT."
      },
      "try": {
        "title": "Find the knee of a local model with open-loop load",
        "minutes": 25,
        "steps": [
          "Pull a small model with Ollama (for example `ollama pull llama3.2:1b`) and run the script.",
          "Read TTFT p50 and p95 at each arrival rate and note where p95 starts climbing steeply - that is the knee.",
          "Replace the short prompts with a 2,000-token document plus a question and observe how much the knee moves.",
          "Rewrite the loop as a closed loop of N users that wait for each reply, and compare how much better its latency looks at similar throughput.",
          "Write down your capacity as the highest rate whose p95 TTFT meets a 2-second target."
        ],
        "code": "import asyncio, random, time, statistics, httpx\n\nURL, MODEL = \"http://localhost:11434/api/generate\", \"llama3.2:1b\"\nPROMPTS = [\"Summarise a refund policy in 3 bullets.\", \"Explain a KV cache to a new engineer.\"]\n\nasync def one(client, ttfts):\n    t0, first = time.perf_counter(), None\n    async with client.stream(\"POST\", URL, json={\"model\": MODEL, \"prompt\": random.choice(PROMPTS)}) as r:\n        async for _ in r.aiter_lines():  # read the whole stream, like a real client\n            first = first or time.perf_counter() - t0\n    ttfts.append(first)\n\nasync def run(rate, seconds=30):\n    ttfts, tasks = [], []\n    async with httpx.AsyncClient(timeout=600) as client:\n        end = time.perf_counter() + seconds\n        while time.perf_counter() < end:\n            tasks.append(asyncio.create_task(one(client, ttfts)))\n            await asyncio.sleep(random.expovariate(rate))  # open loop: Poisson arrivals\n        await asyncio.gather(*tasks)\n    p95 = statistics.quantiles(ttfts, n=20)[18]\n    print(f\"rate {rate}/s  n={len(ttfts)}  TTFT p50 {statistics.median(ttfts):.2f}s  p95 {p95:.2f}s\")\n\nfor rate in [0.2, 0.5, 1, 2]:\n    asyncio.run(run(rate))"
      }
    }
  ]
};
