/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["12-llmops"] = {
  "lede": "LLMOps questions come late in the process, usually from someone who will be on call with you. They are checking one thing: have you kept a GenAI system running when it started behaving differently and nothing had been deployed. Everything here follows from that. New to LLMOps? The questions are ordered for a first read: every High priority card first, from what observability means through traces, tools, versioning and the nothing-was-deployed incident, then Medium, then Low.",
  "grounding": "public JDs asking for production ownership + what non-determinism forces you to know",
  "evening": [
    "ops-01",
    "ops-03",
    "ops-05",
    "ops-07",
    "ops-08"
  ],
  "cards": [
    {
      "id": "ops-11",
      "q": "What is LLM observability, and how is it different from normal monitoring?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "llmops",
        "observability",
        "monitoring",
        "basics"
      ],
      "why": "The opening observability question. It checks whether you know that a healthy-looking LLM service can still be giving wrong answers.",
      "simple": "**Short version: monitoring tells you that something is wrong. Observability lets you work out why - for any single request, after the fact.**\n\n**Monitoring** is dashboards and alerts on numbers you chose in advance: error rate, latency, requests per second. It answers \"is the service up, and is it fast?\"\n\n**Observability** means you recorded enough detail to investigate questions you did not think of in advance. For normal software that means logs, metrics and traces.\n\n**An LLM app needs more**, because a request can succeed technically and still be a bad answer. So LLM observability adds:\n- **the content** - the exact prompt, the retrieved chunks and the model's output,\n- **step-by-step traces** - retrieval, reranking, the model call and tool calls, each with its own timing and cost,\n- **quality scores** - groundedness or relevance checks run on a sample of answers,\n- **user feedback** - thumbs, rephrased questions and escalations, attached to the exact trace,\n- **tokens and cost** - per request, per feature, per user.\n\nThink of a hospital. Monitoring is the heart-rate alarm - it beeps when something is off. Observability is the full patient chart - it lets the doctor work out what went wrong and why.\n\n**The key sentence for the interview:** an LLM app can show zero errors and fast responses while confidently giving wrong answers. Only content-level observability catches that.",
      "points": [
        "**Monitoring** - known metrics and alerts: is it up, is it fast?",
        "**Observability** - enough recorded detail to investigate any single request later.",
        "LLM additions: prompts and outputs, step-level traces, sampled quality scores, feedback, cost.",
        "A healthy-looking service can still be giving wrong answers.",
        "Bad traces feed back into the eval set."
      ],
      "say": "Monitoring tells me that something is wrong, using metrics I chose in advance, like latency and error rate. Observability lets me explain why, for any single request, after the fact. For an LLM app that means tracing each step - retrieval, model call, tool calls - with the actual prompt, context and output, plus sampled quality scores, user feedback and cost. A service can be healthy and still confidently wrong.",
      "numbers": "Keep 100% of traces for failed or flagged requests. For healthy traffic, a common balance is metrics on every request plus full traces on a sample, tuned to your volume and storage budget.",
      "wrong": "\"We have dashboards for latency and errors, so we are covered.\" That watches the server, not the answers. Every panel can be green while users get wrong answers.",
      "follow": "What exactly do you put in a trace?",
      "followAnswer": "Enough to explain one bad answer weeks later. The final assembled prompt, not the template. Model name and version, sampling settings, the raw output, token counts, latency and cost. For retrieval: the query, filters, chunk IDs and scores. For agents: each tool call with its arguments and result, and why the loop stopped. All under one trace ID, with personal data redacted when the trace is written."
    },
    {
      "id": "ops-01",
      "q": "What is different about running an LLM system versus a normal service?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "basics",
        "operations"
      ],
      "why": "The framing question. It sets up everything else in the topic.",
      "simple": "**Short version: a normal service is either right or throws an error. An LLM system can be fast, healthy and confidently wrong. Four things make it different.**\n\n**1. It is not repeatable.** The same input can give a different output. Re-running a bad request usually will not reproduce the problem - even temperature 0 is not guaranteed to be identical on a hosted model. Whatever you logged at the time is all you will ever have.\n\n**2. There is no clear pass or fail.** A normal API returns the right data or an error. An LLM returns something that sounds right and may be wrong - and wrong looks exactly like right until someone reads it.\n\n**3. Your key dependency can change without you.** The model belongs to a provider, and they can update it. Your code did not change, but your behaviour did.\n\n**4. Cost changes per request.** A normal endpoint costs about the same every time. Here, a long document or a long agent loop can cost a hundred times more than a short question.\n\nIt is like the difference between a calculator and a new employee. A calculator either works or it does not. An employee can be busy, polite and on time - and still give you the wrong answer.\n\n**So you add:** full tracing (not just logs), quality metrics next to health metrics, pinned model versions, and cost per request on a dashboard.",
      "points": [
        "Non-deterministic - re-running rarely reproduces. The trace is everything.",
        "Failures are plausible rather than loud. Wrong looks like right.",
        "The model can change underneath you without any deploy.",
        "Cost varies per request by orders of magnitude.",
        "Therefore: tracing, quality metrics, pinned versions, cost dashboards."
      ],
      "say": "Four things. It is non-deterministic, so re-running rarely reproduces an incident - the trace is all I get. Failures are plausible rather than loud, so wrong looks like right. The model can change underneath me with no deploy on my side. And cost varies per request by orders of magnitude. So the stack needs full tracing, quality metrics alongside health metrics, pinned versions, and cost per request.",
      "numbers": "No number applies. What follows from it is that cost per request belongs on a dashboard, not in a capacity spreadsheet.",
      "wrong": "\"It's the same, just with an API call in the middle.\" The follow-up - nothing was deployed and quality dropped - has no answer under that model, because it ignores provider-side changes and plausible-but-wrong failures.",
      "follow": "Nothing was deployed and quality dropped. Where do you start?",
      "followAnswer": "With what changed that is not my code. I check the logged model version first - if we pin, that is one query. Then the corpus and ingestion logs for that window, then the query mix, then tool dependencies, then whether the judge or sampling changed. And I re-run the golden set against the last stored run, which tells me whether the system moved or the users did."
    },
    {
      "id": "ops-02",
      "q": "What do you put in a trace?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "tracing",
        "observability"
      ],
      "why": "Concrete and easy to verify. Vague answers mean you have never debugged from a trace.",
      "simple": "**Short version: record everything you would need to explain one bad answer six weeks from now - because you will not be able to reproduce it.**\n\nA **trace** is the full record of one request. It is made of **spans** - one span per step, such as \"retrieve\", \"rerank\", \"call the LLM\", \"call a tool\" - each with its own inputs, outputs, timing and cost.\n\n**For every request, record:**\n- a trace ID, plus the session and user reference,\n- the **exact final prompt** sent to the model, including the retrieved text - not the template, the real filled-in text,\n- the model name and version, and settings like temperature,\n- the **raw output** before any parsing,\n- tokens in and out, time to first token, total time, and cost.\n\n**For the retrieval step:** the query as actually sent, the filters applied, the chunk IDs returned with their scores, and which chunks made it into the prompt.\n\n**For agents:** every step, each tool call with its arguments and raw result, and why the loop stopped.\n\n**Make it usable, not just complete:**\n- Use the same trace ID across all services, so you can follow one request end to end.\n- Remove personal data **when writing** the trace, not when reading it.\n- Sample the bulky successful traces if you must, but **keep 100% of failures**.\n- Agree with your legal team how long traces are kept.\n\nThink of it as the black box on an aircraft. After an incident you cannot fly the same flight again - you can only read what the box recorded.",
      "points": [
        "The final assembled prompt, not the template.",
        "Model name and version, sampling parameters, raw pre-parse output.",
        "Retrieval: query, filters, chunk ids, scores, what survived into the prompt.",
        "Agents: every step, tool arguments, raw results, termination reason.",
        "Tokens and latency split - input/output, first token/total.",
        "Redact PII at write time. Keep 100% of failures, sample the rest."
      ],
      "say": "Whatever I would need to explain one bad response six weeks later, because I cannot reproduce it. The final assembled prompt rather than the template, model name and version, sampling parameters, raw output before parsing, token and latency splits, and cost. For retrieval, the query, filters, chunk ids and scores. For agents, every step with arguments and results. PII redacted at write time, all failures retained.",
      "numbers": "Traces are large - a multi-step agent run with long contexts can reach tens or hundreds of KB. Sample verbose payloads at high volume, but never sample away the failures.",
      "wrong": "\"We log the input and the output.\" It tells you it went wrong and nothing about where, which in a multi-step pipeline is the entire question.",
      "follow": "Your traces contain PHI. How do you keep them for a year?",
      "followAnswer": "Ideally I do not keep the PHI itself. I redact or tokenise it when the trace is written, so the stored trace holds placeholders, and a secured vault maps them back only for authorised people. Traces live in an approved region, encrypted, with role-based access and audit logs. Raw payloads get shorter retention than redacted metadata, and the retention period is one legal has signed off."
    },
    {
      "id": "ops-12",
      "q": "Which LLM observability tools have you used - LangSmith, Langfuse, Arize Phoenix - and where does OpenTelemetry fit?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "llmops",
        "observability",
        "tooling",
        "tracing",
        "opentelemetry"
      ],
      "why": "These tools appear in many job descriptions. The panel wants your reason for choosing one and the lock-in trade-off, not a list of logos.",
      "simple": "**Short version: they all capture traces of your LLM calls and let you attach evaluations and feedback. Choose on hosting, data privacy and lock-in - and instrument with OpenTelemetry so switching later is cheap.**\n\n**The common options:**\n- **LangSmith** - from the LangChain team. Easiest with LangChain or LangGraph, but works without them. Tracing, datasets, evaluations and prompt management. Mainly hosted, with a self-hosted option for enterprise plans.\n- **Langfuse** - open source (MIT) and can be self-hosted; owned by ClickHouse since January 2026. Tracing, prompt versioning, evaluations and cost tracking. Popular when data must stay inside your own cloud.\n- **Arize Phoenix** - open source, strong on RAG and evaluation views, built on OpenTelemetry.\n- **Also seen:** MLflow tracing, Weights & Biases Weave, and APM tools such as Datadog that now have LLM features.\n\n**Where OpenTelemetry fits:** OpenTelemetry (OTel) is the open standard for traces, metrics and logs. Its GenAI conventions - agreed field names for things like model name, token counts and prompts - are still maturing but widely supported. Instrument with OTel and the same traces can go to Phoenix, Langfuse, Datadog or your own backend. Think of it as a standard plug socket: you can swap the appliance without rewiring the house.\n\n**How to choose:**\n- Are prompts and answers allowed to leave your network? If not, self-host (Langfuse, Phoenix).\n- Which framework are you on? LangGraph teams often pick LangSmith.\n- Already on an APM tool like Datadog? One place for on-call helps.\n- What does it cost at your trace volume?",
      "points": [
        "**LangSmith** - LangChain ecosystem, mainly hosted: tracing, datasets, evals, prompts.",
        "**Langfuse** - open source, self-hostable: tracing, prompt versions, evals, cost.",
        "**Arize Phoenix** - open source, OpenTelemetry-native, strong RAG and eval views.",
        "**OpenTelemetry GenAI conventions** - vendor-neutral traces; swap backends without re-instrumenting.",
        "Choose on data residency, framework fit, existing APM and cost at your volume."
      ],
      "say": "They all trace LLM calls step by step and let you attach evaluations and user feedback. LangSmith fits naturally with LangChain and LangGraph, while Langfuse and Arize Phoenix are open source and can be self-hosted when prompts cannot leave our network. I instrument with OpenTelemetry and its GenAI conventions, so the same traces can go to any backend and switching tools does not mean re-instrumenting the code.",
      "numbers": "No universal number. Estimate volume before choosing: requests per day multiplied by average trace size (a multi-step RAG or agent trace can be tens of KB) decides both the bill and the retention you can afford.",
      "wrong": "Naming a tool with no reason. \"We used LangSmith\" invites the follow-up - why that one, and where do your prompts and customer data end up - and silence there hurts more than not knowing the tool.",
      "follow": "Your prompts contain customer data. How do you trace them without breaking privacy rules?",
      "followAnswer": "Redact before the trace leaves the application: mask names, IDs and account numbers at write time, with a PII detector plus rules for our own ID formats. Then either self-host the tracing backend or use a vendor region and contract that legal has approved. Access is role-based and audited, raw payloads have short retention, and sensitive fields can be hashed so traces still link without exposing the value."
    },
    {
      "id": "ops-03",
      "q": "How do you version prompts and models in production?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "versioning",
        "process"
      ],
      "why": "Without this, no quality question afterwards can be answered - which is why it gets asked early.",
      "simple": "**Short version: three things need a version number - the prompt, the model and the document index - and every request should record which versions it used.**\n\n**The prompt** lives in version control and gets reviewed like code.\n\n**The model** is pinned to an exact version, such as a dated model ID - never a floating name like \"latest\". A floating name means the provider can change your system without telling you.\n\n**The retrieval corpus** gets a version too. The same prompt over a changed index is a different system.\n\n**Stamp all three on every request.** That one habit turns \"quality seems worse this week\" from a guess into a database query: filter by version, then compare.\n\n**Rolling out a change:** treat a prompt change like a code change. Release it to a small share of traffic first (a canary), watch the quality signals, then widen. Keep rollback fast and separate from a full deploy - prompt problems often only show up in production, and you do not want to wait for a pipeline to undo one.\n\n**The mistake to name:** a prompt stored in a database field that someone edits by hand in production. No version, no review, no rollback - and eventually an incident nobody can explain.",
      "points": [
        "Prompt in version control, reviewed. Model pinned explicitly. Corpus versioned.",
        "Stamp all three on every request.",
        "Canary a prompt change like a code change, then widen.",
        "Rollback must be fast and independent of a deploy.",
        "Never allow direct editing of a live prompt."
      ],
      "say": "Three things get versions - the prompt in source control, the model pinned to an explicit version rather than a floating alias, and the retrieval corpus, because the same prompt over a changed index is a different system. All three are stamped on every request, which is what makes drift attributable. Prompt changes canary like code changes, and rollback is fast and independent of a deploy.",
      "numbers": "Canary on 5–10% of traffic and watch the quality proxies for at least a full daily cycle before widening. Traffic mix changes by hour.",
      "wrong": "\"We use the latest model version so we get improvements automatically.\" You also get regressions automatically, with no rollback and no idea when it happened.",
      "follow": "You are pinned and the vendor deprecates your version. What is your plan?",
      "followAnswer": "Deprecations come with notice, so I track the provider's schedule and put the date on our risk register. When one is announced, I run the full golden set on the replacement with the same prompts, then adjust prompts if needed. It rolls out like any change: shadow, canary, widen. I also keep a second model already evaluated, so a forced migration is never the first time we test an alternative."
    },
    {
      "id": "ops-05",
      "q": "Quality dropped and nothing was deployed. Walk me through it.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "incident",
        "debugging",
        "drift"
      ],
      "why": "The signature LLMOps incident. It only has a good answer if you built for it beforehand.",
      "simple": "**Short version: something changed - just not your code. There are five usual suspects, and good logging lets you check each one quickly.**\n\n**1. The model changed.** Check the model version in your logs across the time window. If you pinned the version, this is ruled out in one query. If you did not, this is probably where the incident started.\n\n**2. The documents changed.** An ingestion job added, removed or re-processed documents. Check the index version and the ingestion logs for that window.\n\n**3. The users changed.** People started asking about something new - a product launch, a policy change, a seasonal event. Compare the kinds of questions before and after. **This is the most common cause and the least suspected.**\n\n**4. A dependency changed.** A tool or API started returning data in a different shape, so the model is now working from worse inputs.\n\n**5. The measurement changed.** Nothing actually got worse - the judge model was updated, or the sampling changed.\n\n**Then the key test:** run your golden set now and compare it with the last saved run. If the golden-set score dropped, **the system changed**. If the score is the same, **the users changed**. That one fork decides where the rest of the investigation goes.",
      "points": [
        "Model version changed - one query if you pinned and logged.",
        "Corpus changed - check ingestion logs for the window.",
        "Traffic changed - compare query distributions. Most common, least suspected.",
        "A tool dependency changed shape.",
        "The measurement changed - judge model update, sampling shift.",
        "Run the golden set and compare to the last stored run. System moved, or users did."
      ],
      "say": "Five candidates. The model version changed - one query if I pinned and logged it. The corpus changed through an ingestion run. The traffic changed, which is the most common and least suspected, so I compare query distributions before and after. A tool dependency changed shape. Or the measurement changed. Then I run the golden set and compare against the last stored run - that tells me whether the system moved or the users did.",
      "numbers": "Store every golden-set run with its date, model version and corpus version. Without a stored history there is nothing to compare against and this investigation stalls at step one.",
      "wrong": "\"I'd check the logs and try some prompts.\" Unstructured, and it usually lands on changing the prompt, which is the one thing you know did not cause it.",
      "follow": "The query distribution shifted. Is that a bug?",
      "followAnswer": "Not in the code, but it is still our problem. Users are asking about something new - a product launch or policy change - that the system was never tested for. I check whether the corpus covers the topic, add those queries to the golden set, and close the gap with new documents, a routing rule or a prompt change. Then I alert on topic mix, so the next shift shows before complaints do."
    },
    {
      "id": "ops-04",
      "q": "How do you control cost in production?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "cost",
        "monitoring"
      ],
      "why": "Cost ownership is a senior expectation, and the answer must be operational, not theoretical.",
      "simple": "**Short version: first see where the money goes, then put hard limits in place, then reduce.**\n\n**1. Visibility.** Show cost per request, per feature and per customer on a dashboard, updated daily. Almost every team with a cost problem has no breakdown - and the breakdown alone usually shows that one feature is most of the bill.\n\n**2. Hard limits and alerts.**\n- Token budgets per user and per session, enforced **in code** - not by asking the model nicely in the prompt.\n- Alerts on daily spend, and on sudden jumps in tokens per request. A jump usually means a bug: a retry loop, a conversation history that stopped being trimmed, or an agent that never stops.\n\n**3. Reductions, biggest payoff first:**\n- use a smaller model for the easy steps,\n- cache the fixed part of the prompt with the provider (prompt caching),\n- send less retrieved text,\n- send easy questions to a cheap model and hard ones to a strong one (routing).\n\n**The number to report is cost per completed task, not cost per call.** A cheap model that needs three tries is not cheap.\n\n(Debugging a sudden cost jump: cl-07. Routing and caching in depth: cl-06 and cl-03.)",
      "points": [
        "Cost per request, per feature, per tenant - on a dashboard, daily.",
        "Hard token budgets per user and per session, enforced in code.",
        "Alert on spend and on tokens-per-request spikes - spikes usually mean bugs.",
        "Reduce: right-size per step, cache the prefix, cut context, route by difficulty.",
        "Report cost per completed task, not per call."
      ],
      "say": "Visibility first - cost per request, per feature and per tenant on a daily dashboard, because teams with a cost problem usually have no breakdown, and the breakdown shows one feature is most of the bill. Then hard token budgets per session enforced in the runtime, and alerts on token-per-request spikes, because a spike is usually a bug. Then right-sizing, caching and context trimming. And I report cost per completed task.",
      "numbers": "A starting point: alert on a ~30% day-over-day move in tokens per request, tuned to your normal variance. That threshold catches retry loops and untrimmed contexts before the invoice does.",
      "wrong": "\"We monitor our monthly spend.\" Monthly is too late - a runaway agent loop can spend a month's budget in a weekend.",
      "follow": "Tokens per request doubled overnight. What are the three likeliest causes?"
    },
    {
      "id": "ops-07",
      "q": "How do you get user feedback and actually use it?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "feedback",
        "evaluation",
        "process"
      ],
      "why": "The loop that turns operations into improvement, and most teams collect feedback and then do nothing with it.",
      "simple": "**Short version: collecting feedback is easy. The hard part is turning it into fixes.**\n\n**Collect it with context.** Attach every thumbs up or down to the trace of the answer it is about. Without that link, you have an opinion with no evidence.\n\n**Use hidden signals, not just buttons.** Very few users click thumbs. But every user leaves clues:\n- Did they ask the same question again in different words?\n- Did they click the citation?\n- Did they copy the answer?\n- Did they ask for a human?\n- Did they leave in the middle of the conversation?\nYou get these on every interaction, not on 2% of them.\n\n**Close the loop - this is the part most teams skip:**\n- Every thumbs-down goes into a review queue.\n- Every week, an engineer and a domain expert read a sample together.\n- Confirmed failures become new golden-set test cases. This keeps your test set connected to reality.\n- When a fix ships, re-run those cases and share the result.\n\nThat last step matters. If users feel their feedback goes nowhere, they stop giving it.",
      "points": [
        "Attach every rating to its trace. Feedback without evidence is unusable.",
        "Implicit signals - rephrase, citation click, copy, escalation, abandonment.",
        "Weekly triage, engineer plus domain expert.",
        "Confirmed failures become golden-set cases.",
        "Re-run those cases after the fix and report it. Visible loops keep feedback coming."
      ],
      "say": "Thumbs attached to the trace that produced the answer, because feedback without evidence is unusable. But implicit signals matter more, since almost nobody clicks - rephrase rate, citation clicks, escalation, abandonment. Then the loop: weekly triage with a domain expert, confirmed failures become golden-set cases, and after a fix I re-run those cases and report the change, so users see the feedback went somewhere.",
      "numbers": "Explicit feedback rates are typically low single-digit percentages. Design for implicit signals as the primary source and treat thumbs as a bonus.",
      "wrong": "\"We have thumbs up and down on every response.\" Collection without a triage process is a dataset nobody reads.",
      "follow": "Nobody clicks the thumbs. What do you use instead?"
    },
    {
      "id": "ops-08",
      "q": "A prompt change has passed review and CI. How do you roll it out to production safely?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "deployment",
        "ci",
        "process"
      ],
      "why": "pr-04 and ev-06 cover testing a prompt in the pull request. This is the release half - canary, what to watch without labels, per-segment comparison and rollback - where regressions the golden set missed show up.",
      "simple": "**Short version: the same discipline as a code release - a small slice first, watch, then widen - with one extra check, because quality is not simply pass or fail.**\n\n**Before merge (already done):** the automatic checks passed, and the golden set was run on both the old and the new prompt, with the comparison posted on the pull request (see pr-04 and ev-06). But the golden set is not your real traffic - so some risk is left.\n\n**On release, a canary.** Send 5-10% of traffic to the new prompt. Watch the signals you can see without knowing the correct answers:\n- groundedness on a sample,\n- the \"I don't know\" rate,\n- outputs that fail to parse,\n- answer length,\n- thumbs up and down,\n- latency and cost per request.\nWait a full day, because the kind of traffic changes between morning, evening and night.\n\n**Then widen**, with a one-click rollback that does not need a full deploy.\n\n**The extra check: compare by segment, not just overall.** A prompt change can improve the average while badly hurting one language, one document type or one customer. Look at each group before widening.",
      "points": [
        "PR: deterministic checks plus golden-set comparison against main, posted on the PR.",
        "Canary on a small traffic share for a full daily cycle.",
        "Watch groundedness sample, refusal rate, parse failures, length, thumbs, cost, p95.",
        "Compare per segment - averages hide a segment you broke.",
        "Rollback fast, independent of a deploy."
      ],
      "say": "Like a code change, plus one accommodation. In the pull request, deterministic checks plus the golden set run against both versions and posted as a comparison, so the reviewer sees the effect rather than the diff. Then canary on a small share for a full daily cycle, watching refusal rate, parse failures, groundedness and cost. And I compare per segment, because a change that lifts the average can break one language or document type.",
      "numbers": "Canary 5–10%, hold for at least 24 hours. Shorter windows miss the shift in traffic mix between working hours and overnight.",
      "wrong": "\"Prompts are config, so we can just push them.\" Then a prompt change skips the review, canary and rollback that code gets - and prompt edits are a frequent source of regressions.",
      "follow": "The canary looks fine overall but one tenant is complaining. What now?"
    },
    {
      "id": "ops-06",
      "q": "How do you handle provider outages and rate limits?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "reliability",
        "fallback",
        "architecture"
      ],
      "why": "Ordinary reliability engineering, which GenAI-focused candidates often forget applies here too.",
      "simple": "**Short version: treat the LLM provider like any unreliable external service - because it is one.**\n\n**1. Retry carefully.** Retry with exponential backoff (wait longer each time) plus jitter (a little randomness, so all clients do not retry at the same moment), and cap it at 2-3 attempts. Only retry errors that can succeed next time: a rate limit (respect the provider's Retry-After header) or a timeout. Retrying a content-policy refusal just burns money.\n\n**2. Circuit breaker.** When the provider is clearly down, stop sending requests for a short while and fail fast. Otherwise thousands of requests pile up, time out, and take your own service down too.\n\n**3. Fallback model.** Keep a backup model, ideally from a different provider or region. **Test it in advance** - switching to a model you have never evaluated, in the middle of an incident, is how one problem becomes two.\n\n**4. Degrade gracefully.** For a RAG chat feature, \"The assistant is unavailable right now - here are the most relevant documents\" is far better than an endless spinner. Search usually still works when generation does not.\n\n**5. Queue what can wait.** Not every task needs an answer within a second - reports and batch jobs can be retried later.\n\nIt is like a power cut at home: you want a fuse that trips (the circuit breaker), a backup generator you have actually tested (the fallback), and a torch (the degraded mode).",
      "points": [
        "Retry with backoff and jitter, capped, and only on retryable errors.",
        "Circuit breaker - fail fast rather than queueing into your own outage.",
        "Fallback model, different provider or region, evaluated in advance.",
        "Degrade honestly: retrieval results beat a spinner.",
        "Queue asynchronous work instead of holding requests open.",
        "Track provider errors as a first-class SLO, separate from your own."
      ],
      "say": "I treat the provider as an unreliable dependency. Capped retries with backoff and jitter, but only on retryable errors - retrying a policy refusal just burns money. A circuit breaker so we fail fast instead of queueing into our own outage. A fallback model on another provider or region, evaluated in advance. And honest degradation: showing the top matching documents beats a spinner, because retrieval usually still works when generation does not.",
      "numbers": "Cap retries at 2–3 with jitter. Uncapped retries during a provider incident turn one outage into a self-inflicted second one.",
      "wrong": "\"We retry on failure.\" Without the error-type distinction and the circuit breaker, retrying is how a provider blip becomes your incident.",
      "follow": "Your fallback model has never been evaluated. What do you do today?"
    },
    {
      "id": "ops-10",
      "q": "What do you track in an experiment system or model registry for an AI application?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "llmops",
        "mlflow",
        "registry",
        "reproducibility"
      ],
      "why": "Current AI roles often expect MLflow-style experiment tracking and release governance alongside LLM observability.",
      "simple": "**Short version: record enough that, months later, you can answer \"what exactly produced this result?\" - and roll back the one piece that changed.**\n\n**For a model you trained or fine-tuned, record:**\n- the code commit,\n- the exact data snapshot,\n- the training settings (and random seed, where useful),\n- the base model and the resulting checkpoint or adapter,\n- the environment (library versions, hardware),\n- the metrics and output files.\nA **model registry** then records which tested version is approved for staging and which is in production.\n\n**For an app built on a hosted API**, you do not own the model weights - so you record the things that still change behaviour:\n- the provider's model version,\n- the prompt version and tool definitions,\n- retrieval settings, embedding model and index version,\n- the eval-set version and its quality, latency and cost results.\n\nThink of it as a recipe card for every dish you served: ingredients, quantities, oven temperature. If a customer gets sick, you can find exactly which batch it came from.\n\nTools like MLflow store these runs and files, but the tool name is not the point. The point is reproducibility and a clear promotion history.",
      "points": [
        "Track code, data, model/checkpoint and training configuration for trained models.",
        "Track prompt, retrieval, tool and provider versions for API-based GenAI.",
        "Version the evaluation set and store quality, latency and cost results.",
        "Use a registry or release record for promotion history and rollback.",
        "The goal is reproducibility, not collecting metadata for its own sake."
      ],
      "say": "I track enough to reproduce the behaviour. For a trained model that means code, data snapshot, base model or checkpoint, training settings, environment and metrics. For an API-based GenAI system I also need the provider model version, prompt, tools, retrieval configuration, index and evaluation-set version. A registry or release record shows what was promoted and why. The goal is that an incident can identify the exact configuration and roll back the component that changed.",
      "numbers": "No fixed count matters. The test is operational: can you reproduce or explain a production result months later without relying on somebody remembering what changed?",
      "wrong": "Tracking only the model name. In a GenAI application, prompt, retrieval, tools and index versions can change behaviour just as much as the model.",
      "follow": "The provider uses a floating model alias and silently updates it. What extra evidence do you store around each production trace?"
    },
    {
      "id": "ops-09",
      "q": "Ollama locally and vLLM in production - is that a real strategy?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "llmops",
        "serving",
        "vllm",
        "self-hosting",
        "trade-off"
      ],
      "why": "A common practical setup, and the question checks whether you know why they are different rather than treating both as 'runs a model'.",
      "simple": "**Short version: yes. Ollama is for running a model on your laptop while you build. vLLM is for serving many users at once in production. Just keep the model identical in both.**\n\n**Ollama** is a developer tool. One install, it downloads a compressed (quantised) model, and it runs on a laptop in minutes. It can handle a few requests at once, but it is not built for heavy traffic. Great for building and testing, wrong for production load.\n\n**vLLM** is a production serving engine. Two features make it fast:\n- **PagedAttention** - it stores the model's working memory (the KV cache) in small pages, the way an operating system manages RAM, so GPU memory is not wasted.\n- **Continuous batching** - new requests join the running batch straight away, instead of waiting for the current batch to finish.\nTogether they keep the GPU busy when many users arrive at once. (SGLang and TensorRT-LLM are the common alternatives; cl-04 goes deeper.)\n\n**Why the pairing works:** both offer an OpenAI-compatible API. Moving from laptop to production is mostly a change of base URL, not a rewrite.\n\n**The catches that show you have actually done it:**\n- **Use the same model at the same compression level in both.** Developing against a 4-bit model and deploying a full-precision one makes behaviour differ in ways that look like a code bug.\n- **Set generation settings explicitly** (temperature, max tokens). The defaults differ between the two.\n- **Do not load-test on Ollama.** Its speed tells you nothing about vLLM.\n\nAll of this assumes you self-host at all (the cl-05 decision).",
      "points": [
        "Ollama: developer runtime with limited concurrency. Right for iteration, not production load.",
        "vLLM: serving engine. PagedAttention for KV-cache memory, continuous batching for throughput.",
        "Continuous batching admits new requests mid-batch - that is where the utilisation gain comes from.",
        "Both expose an OpenAI-compatible API, so promotion is a base URL change.",
        "Pin the same model and quantisation in both, or local and prod behave differently.",
        "Set generation parameters explicitly; runtime defaults differ.",
        "Do not load-test against Ollama - its throughput says nothing about the vLLM deployment.",
        "All of this presupposes you should self-host at all."
      ],
      "say": "Yes, and the reason is that they solve different problems. Ollama is a developer runtime with limited concurrency, which is right for iteration. vLLM is a serving engine - PagedAttention stops KV-cache fragmentation and continuous batching admits new requests into a running batch, which is what keeps the GPU busy under load. Both are OpenAI-compatible, so promotion is a base URL change. I pin identical model and quantisation across both.",
      "numbers": "Continuous batching plus PagedAttention can give several-fold or larger throughput gains over naive serving under concurrent load. The size depends on model, prompt and output lengths, and GPU - benchmark your own traffic shape.",
      "wrong": "Treating them as interchangeable, or proposing Ollama for production traffic. The follow-up about concurrency and throughput exposes that it was not designed for that load.",
      "follow": "Your vLLM box handles 50 concurrent users and falls over at 200. What do you look at first?"
    }
  ]
};
