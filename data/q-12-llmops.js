/* Topic 12 — LLMOps, tracing and observability.
   Grounding: public JDs asking for "LLMOps" and production ownership, plus what
   operating a non-deterministic system forces you to know. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["12-llmops"] = {
  lede: "LLMOps questions come late in the process, usually from someone who will be on call with you. They are checking one thing: have you kept a GenAI system running when it started behaving differently and nothing had been deployed. Everything here follows from that.",
  grounding: "public JDs asking for production ownership + what non-determinism forces you to know",
  evening: ["ops-01", "ops-03", "ops-05", "ops-07", "ops-08"],

  cards: [
    {
      id: "ops-01",
      q: "What is different about running an LLM system versus a normal service?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["llmops", "basics", "operations"],
      why: "The framing question. It sets up everything else in the topic.",
      simple:
        "Four things, and they compound.\n\n" +
        "It is non-deterministic. The same input can produce a different output, so you cannot reproduce an incident by re-running it. Whatever the trace captured at the time is all you will ever have.\n\n" +
        "There is no pass or fail. A normal service returns correct or an error. This one returns something plausible that may be wrong, and wrong looks exactly like right until someone reads it.\n\n" +
        "The core dependency is someone else's model, which can be updated underneath you. Your code did not change and your behaviour did.\n\n" +
        "And cost is variable per request. A normal endpoint costs roughly the same each time; here a long document or a long agent loop can cost a hundred times a short one, so cost is a runtime metric rather than a capacity plan.\n\n" +
        "So the operational stack has to add: full tracing rather than logging, quality metrics rather than only health metrics, version pinning, and cost per request on a dashboard.",
      points: [
        "Non-deterministic — you cannot reproduce by re-running. The trace is everything.",
        "Failures are plausible rather than loud. Wrong looks like right.",
        "The model can change underneath you without any deploy.",
        "Cost varies per request by orders of magnitude.",
        "Therefore: tracing, quality metrics, pinned versions, cost dashboards."
      ],
      say: "Four things. It is non-deterministic, so I cannot reproduce an incident by re-running — the trace is all I get. Failures are plausible rather than loud, so wrong looks like right. The model can change underneath me with no deploy on my side. And cost varies per request by orders of magnitude. So the stack needs full tracing, quality metrics alongside health metrics, pinned versions, and cost per request.",
      numbers: "No number applies. What follows from it is that cost per request belongs on a dashboard, not in a capacity spreadsheet.",
      wrong: "\"It's the same, just with an API call in the middle.\" It is the answer of someone who has not been on call for one.",
      follow: "Nothing was deployed and quality dropped. Where do you start?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-02",
      q: "What do you put in a trace?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["llmops", "tracing", "observability"],
      why: "Concrete and easy to verify. Vague answers mean you have never debugged from a trace.",
      simple:
        "Whatever you would need to explain a single bad response six weeks later, because you will not be able to reproduce it.\n\n" +
        "Per request: a trace id, the session and user reference, the exact assembled prompt including retrieved context — not the template, the final text — the model name and version, sampling parameters, the raw output before parsing, token counts split into input and output, latency split into time to first token and total, and the cost.\n\n" +
        "For retrieval: the query as sent, the filters applied, the chunk ids returned with their scores, and which ones survived into the prompt.\n\n" +
        "For agents: every step, each tool call with arguments and raw result, and why the loop terminated.\n\n" +
        "Then the things that make it usable rather than merely complete: consistent trace ids across services, PII redaction at write time rather than read time, sampling for the verbose payloads but one hundred percent retention of failed runs, and a retention policy someone has actually agreed with legal.",
      points: [
        "The final assembled prompt, not the template.",
        "Model name and version, sampling parameters, raw pre-parse output.",
        "Retrieval: query, filters, chunk ids, scores, what survived into the prompt.",
        "Agents: every step, tool arguments, raw results, termination reason.",
        "Tokens and latency split — input/output, first token/total.",
        "Redact PII at write time. Keep 100% of failures, sample the rest."
      ],
      say: "Whatever I would need to explain one bad response six weeks later, because I cannot reproduce it. The final assembled prompt rather than the template, model name and version, sampling parameters, raw output before parsing, token and latency splits, and cost. For retrieval, the query, filters, chunk ids and scores. For agents, every step with arguments and results. PII redacted at write time, all failures retained.",
      numbers: "Traces are large — a 10-step agent run can be 30–60 KB. Sample verbose payloads in high volume, but never sample away the failures.",
      wrong: "\"We log the input and the output.\" It tells you it went wrong and nothing about where, which in a multi-step pipeline is the entire question.",
      follow: "Your traces contain PHI. How do you keep them for a year?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-03",
      q: "How do you version prompts and models in production?",
      round: ["tech2"],
      level: "5-10",
      tags: ["llmops", "versioning", "process"],
      why: "Without this, no quality question afterwards can be answered — which is why it gets asked early.",
      simple:
        "Three things need versions, and every request needs to record which ones it used.\n\n" +
        "The prompt, in version control, reviewed like code. The model — pinned to an explicit version, never a floating alias, because an alias means the vendor can change your system without telling you. And the retrieval corpus, because the same prompt over a changed index is a different system.\n\n" +
        "Stamp all three on every request. That single practice is what turns \"quality seems worse this week\" from an unanswerable question into a query.\n\n" +
        "For rollout, treat a prompt change like a code change: canary on a small share of traffic, watch the quality proxies, then widen. And keep rollback fast and independent of a deploy, because prompt regressions often only show in production and waiting for a pipeline is the wrong shape of response.\n\n" +
        "The mistake to name: a prompt stored in a database field that someone edits directly. It has no version, no review and no rollback, and it will eventually cause an incident nobody can explain.",
      points: [
        "Prompt in version control, reviewed. Model pinned explicitly. Corpus versioned.",
        "Stamp all three on every request.",
        "Canary a prompt change like a code change, then widen.",
        "Rollback must be fast and independent of a deploy.",
        "Never allow direct editing of a live prompt."
      ],
      say: "Three things get versions — the prompt in source control, the model pinned to an explicit version rather than a floating alias, and the retrieval corpus, because the same prompt over a changed index is a different system. All three are stamped on every request, which is what makes drift attributable. Prompt changes canary like code changes, and rollback is fast and independent of a deploy.",
      numbers: "Canary on 5–10% of traffic and watch the quality proxies for at least a full daily cycle before widening. Traffic mix changes by hour.",
      wrong: "\"We use the latest model version so we get improvements automatically.\" You also get regressions automatically, with no rollback and no idea when it happened.",
      follow: "You are pinned and the vendor deprecates your version. What is your plan?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-04",
      q: "How do you control cost in production?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["llmops", "cost", "monitoring"],
      why: "Cost ownership is a senior expectation, and the answer must be operational, not theoretical.",
      simple:
        "Visibility first. Cost per request, per feature, per user or tenant, on a dashboard, updated daily. Almost every team that has a cost problem also has no breakdown, and the breakdown alone usually reveals that one feature is most of the bill.\n\n" +
        "Then the controls. Hard limits: per-user and per-session token budgets enforced in the runtime, not in the prompt. Alerts on daily spend and on a spike in tokens per request, because a spike usually means a bug — a retry loop, a context that stopped being trimmed, an agent that stopped terminating.\n\n" +
        "Then the reductions, in order of payoff: right-size the model per step, cache the stable prompt prefix with the provider, cut retrieved context, and route easy traffic to a cheap model.\n\n" +
        "And the governance piece that gets attention at review time: cost per completed task, not cost per call. A cheaper model that needs three attempts is not cheaper, and that is the number that makes the argument for you.",
      points: [
        "Cost per request, per feature, per tenant — on a dashboard, daily.",
        "Hard token budgets per user and per session, enforced in code.",
        "Alert on spend and on tokens-per-request spikes — spikes usually mean bugs.",
        "Reduce: right-size per step, cache the prefix, cut context, route by difficulty.",
        "Report cost per completed task, not per call."
      ],
      say: "Visibility first — cost per request, per feature and per tenant on a daily dashboard, because teams with a cost problem usually have no breakdown, and the breakdown shows one feature is most of the bill. Then hard token budgets per session enforced in the runtime, and alerts on token-per-request spikes, because a spike is usually a bug. Then right-sizing, caching and context trimming. And I report cost per completed task.",
      numbers: "Alert on a 30% day-over-day move in tokens per request. That threshold catches retry loops and untrimmed contexts before the invoice does.",
      wrong: "\"We monitor our monthly spend.\" Monthly is too late — a runaway agent loop can spend a month's budget in a weekend.",
      follow: "Tokens per request doubled overnight. What are the three likeliest causes?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-05",
      q: "Quality dropped and nothing was deployed. Walk me through it.",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["llmops", "incident", "debugging", "drift"],
      why: "The signature LLMOps incident. It only has a good answer if you built for it beforehand.",
      simple:
        "Something changed, and it was not your code. There are five candidates and you can separate them quickly if you instrumented properly.\n\n" +
        "The model changed. Check the logged model version across the period. If you pinned, this is ruled out in one query — and if you did not, this is where the incident began.\n\n" +
        "The corpus changed. An ingestion run added, removed or reprocessed documents. Check the corpus version and the ingestion logs for that window.\n\n" +
        "The traffic changed. Users started asking about something new — a product launch, a policy change, a seasonal event. Compare the query distribution before and after. This is the most common cause and the least suspected.\n\n" +
        "A dependency changed. A tool API started returning a different shape, and the model is now working from worse inputs.\n\n" +
        "Or nothing changed and the measurement did — a judge model updated, or your sampling shifted.\n\n" +
        "Then: run the golden set now and compare with the last stored run. That tells you whether the system moved or the users did, which is the fork the whole investigation hangs on.",
      points: [
        "Model version changed — one query if you pinned and logged.",
        "Corpus changed — check ingestion logs for the window.",
        "Traffic changed — compare query distributions. Most common, least suspected.",
        "A tool dependency changed shape.",
        "The measurement changed — judge model update, sampling shift.",
        "Run the golden set and compare to the last stored run. System moved, or users did."
      ],
      say: "Five candidates. The model version changed — one query if I pinned and logged it. The corpus changed through an ingestion run. The traffic changed, which is the most common and least suspected, so I compare query distributions before and after. A tool dependency changed shape. Or the measurement changed. Then I run the golden set and compare against the last stored run — that tells me whether the system moved or the users did.",
      numbers: "Store every golden-set run with its date, model version and corpus version. Without a stored history there is nothing to compare against and this investigation stalls at step one.",
      wrong: "\"I'd check the logs and try some prompts.\" Unstructured, and it usually lands on changing the prompt, which is the one thing you know did not cause it.",
      follow: "The query distribution shifted. Is that a bug?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-06",
      q: "How do you handle provider outages and rate limits?",
      round: ["tech2"],
      level: "5-10",
      tags: ["llmops", "reliability", "fallback", "architecture"],
      why: "Ordinary reliability engineering, which GenAI-focused candidates often forget applies here too.",
      simple:
        "Treat the provider as an unreliable dependency, because it is one.\n\n" +
        "Retries with exponential backoff and jitter, and a cap — but only on the errors that deserve them. Retrying a rate limit is correct; retrying a content-policy refusal just burns money.\n\n" +
        "A circuit breaker, so when the provider is down you fail fast rather than queueing thousands of requests that will time out and take your own service down with them.\n\n" +
        "A fallback model, ideally with a different provider or region, which is why the provider abstraction matters. Know in advance whether the fallback is good enough, because switching under pressure to something you have never evaluated is how one incident becomes two.\n\n" +
        "Then graceful degradation. For a chat feature, an honest \"the assistant is unavailable, here are the top matching documents\" is a far better outcome than a spinner. Retrieval usually still works when generation does not, and that is a real fallback product.\n\n" +
        "And queue what can be queued. Not everything needs an answer inside a second.",
      points: [
        "Retry with backoff and jitter, capped, and only on retryable errors.",
        "Circuit breaker — fail fast rather than queueing into your own outage.",
        "Fallback model, different provider or region, evaluated in advance.",
        "Degrade honestly: retrieval results beat a spinner.",
        "Queue asynchronous work instead of holding requests open.",
        "Track provider errors as a first-class SLO, separate from your own."
      ],
      say: "I treat the provider as an unreliable dependency. Capped retries with backoff and jitter, but only on retryable errors — retrying a policy refusal just burns money. A circuit breaker so we fail fast instead of queueing into our own outage. A fallback model on another provider or region, evaluated in advance. And honest degradation: showing the top matching documents beats a spinner, because retrieval usually still works when generation does not.",
      numbers: "Cap retries at 2–3 with jitter. Uncapped retries during a provider incident turn one outage into a self-inflicted second one.",
      wrong: "\"We retry on failure.\" Without the error-type distinction and the circuit breaker, retrying is how a provider blip becomes your incident.",
      follow: "Your fallback model has never been evaluated. What do you do today?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-07",
      q: "How do you get user feedback and actually use it?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["llmops", "feedback", "evaluation", "process"],
      why: "The loop that turns operations into improvement, and most teams collect feedback and then do nothing with it.",
      simple:
        "Collecting is the easy half. Thumbs up and down, attached to the trace that produced the response — that link is what makes the feedback usable, because without it you have an opinion with no evidence.\n\n" +
        "Implicit signals are often better than explicit ones, because almost nobody clicks thumbs. Did the user rephrase and ask again. Did they click the citation. Did they copy the answer. Did they escalate to a human. Did they abandon the session. Each is a quality signal you get on every interaction rather than on two percent of them.\n\n" +
        "The loop that matters is what happens next. Every thumbs-down goes into a triage queue. Someone reads a sample weekly — an engineer and a domain person together. Confirmed failures become golden-set cases, which is how the eval set stays connected to reality.\n\n" +
        "Then you close it visibly: when a fix ships, re-run those cases and report the change. Teams that skip that step find feedback volume drops, because users learn it goes nowhere.",
      points: [
        "Attach every rating to its trace. Feedback without evidence is unusable.",
        "Implicit signals — rephrase, citation click, copy, escalation, abandonment.",
        "Weekly triage, engineer plus domain expert.",
        "Confirmed failures become golden-set cases.",
        "Re-run those cases after the fix and report it. Visible loops keep feedback coming."
      ],
      say: "Thumbs attached to the trace that produced the answer, because feedback without evidence is unusable. But implicit signals matter more, since almost nobody clicks — rephrase rate, citation clicks, escalation, abandonment. Then the loop: weekly triage with a domain expert, confirmed failures become golden-set cases, and after a fix I re-run those cases and report the change, so users see the feedback went somewhere.",
      numbers: "Explicit feedback rates are typically low single-digit percentages. Design for implicit signals as the primary source and treat thumbs as a bonus.",
      wrong: "\"We have thumbs up and down on every response.\" Collection without a triage process is a dataset nobody reads.",
      follow: "Nobody clicks the thumbs. What do you use instead?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-08",
      q: "How do you deploy a prompt change safely?",
      round: ["tech2"],
      level: "5-10",
      tags: ["llmops", "deployment", "ci", "process"],
      why: "Prompt changes cause most regressions and are the least controlled change in most teams.",
      simple:
        "Same discipline as a code change, plus one accommodation for the fact that quality is not binary.\n\n" +
        "In the pull request: the deterministic checks — does output parse, are required sections present, is length within bounds — plus the golden set run against both versions, posted as a comparison. The reviewer sees the effect, not just the diff. That is the single highest-value practice in this topic.\n\n" +
        "On merge: canary to a small share of traffic. Watch the quality proxies you can measure without labels — groundedness on a sample, refusal rate, parse failures, output length distribution, thumbs — plus latency and cost per request. Give it a full daily cycle, because traffic mix changes by hour.\n\n" +
        "Then widen, with rollback ready and independent of a deploy.\n\n" +
        "And the accommodation: a prompt change that improves the average can badly hurt one segment. So compare per segment, not just overall, before widening.",
      points: [
        "PR: deterministic checks plus golden-set comparison against main, posted on the PR.",
        "Canary on a small traffic share for a full daily cycle.",
        "Watch groundedness sample, refusal rate, parse failures, length, thumbs, cost, p95.",
        "Compare per segment — averages hide a segment you broke.",
        "Rollback fast, independent of a deploy."
      ],
      say: "Like a code change, plus one accommodation. In the pull request, deterministic checks plus the golden set run against both versions and posted as a comparison, so the reviewer sees the effect rather than the diff. Then canary on a small share for a full daily cycle, watching refusal rate, parse failures, groundedness and cost. And I compare per segment, because a change that lifts the average can break one language or document type.",
      numbers: "Canary 5–10%, hold for at least 24 hours. Shorter windows miss the shift in traffic mix between working hours and overnight.",
      wrong: "\"Prompts are config, so we can just push them.\" That is exactly why they cause most regressions — they bypass the review that code gets.",
      follow: "The canary looks fine overall but one tenant is complaining. What now?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ops-09",
      q: "Ollama locally and vLLM in production — is that a real strategy?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["llmops", "serving", "vllm", "self-hosting", "trade-off"],
      why: "A common practical setup, and the question checks whether you know why they are different rather than treating both as 'runs a model'.",
      simple:
        "Yes, and it is a normal setup, but say why rather than naming the tools.\n\n" +
        "Ollama is a developer runtime. One binary, pulls quantised models, runs on a laptop in minutes. It is built for one user at a time — requests are effectively serialised — which is exactly right for iteration and useless under real load.\n\n" +
        "vLLM is a serving engine. The two features that matter are PagedAttention, which manages the KV cache in pages so memory is not fragmented and wasted, and continuous batching, which admits new requests into a running batch instead of waiting for the current one to finish. Together they keep the GPU busy and are the difference between a GPU at 30% utilisation and one at 85-90%.\n\n" +
        "The reason the pairing works is that both speak an OpenAI-compatible API, so moving from local to production is a base URL change and not a rewrite. That is the practical point worth making.\n\n" +
        "Then the caveats that show you have actually done it. The model must be identical in both places — it is easy to develop against a 4-bit quantised local model and deploy an FP16 one, and then behaviour differs in ways that look like a code bug. Pin the version and the quantisation. Generation defaults differ between runtimes, so set them explicitly rather than inheriting. And you cannot load-test meaningfully against Ollama; throughput numbers must come from the vLLM setup.\n\n" +
        "And the honest framing for most teams: this only matters if you are self-hosting at all, which is the cl-05 decision. If you use an API in production, Ollama locally is still useful for offline work and for cost-free iteration.",
      points: [
        "Ollama: developer runtime, effectively one request at a time. Right for iteration.",
        "vLLM: serving engine. PagedAttention for KV-cache memory, continuous batching for throughput.",
        "Continuous batching admits new requests mid-batch — that is where the utilisation gain comes from.",
        "Both expose an OpenAI-compatible API, so promotion is a base URL change.",
        "Pin the same model and quantisation in both, or local and prod behave differently.",
        "Set generation parameters explicitly; runtime defaults differ.",
        "Never load-test against Ollama — the throughput numbers are meaningless.",
        "All of this presupposes you should self-host at all."
      ],
      say: "Yes, and the reason is that they solve different problems. Ollama is a developer runtime serving one request at a time, which is right for iteration. vLLM is a serving engine — PagedAttention stops KV-cache fragmentation and continuous batching admits new requests into a running batch, which is what keeps a GPU near ninety percent utilisation. Both are OpenAI-compatible, so promotion is a base URL change. I pin identical model and quantisation across both.",
      numbers: "Continuous batching plus PagedAttention commonly delivers an order-of-magnitude throughput gain over naive serving once you have ten or more concurrent users.",
      wrong: "Treating them as interchangeable, or proposing Ollama for production traffic. Serialised request handling under concurrency is a straightforward outage.",
      follow: "Your vLLM box handles 50 concurrent users and falls over at 200. What do you look at first?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
  ]
};
