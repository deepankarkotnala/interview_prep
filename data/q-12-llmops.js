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
      "quick": [
        "Monitoring says something is wrong, observability shows why.",
        "Monitoring watches fixed numbers like errors and speed.",
        "LLM apps also need the exact prompt, found text and answer.",
        "Add step timings, cost, quality scores and user feedback.",
        "A fast, error-free app can still give wrong answers."
      ],
      "simple": "Monitoring is dashboards and alerts on numbers you chose in advance, like error rate and latency, so it tells you whether the service is up and fast. Observability means you recorded enough detail to investigate any single request after the fact, including questions you didn't think of in advance.\n\nAn LLM app needs more, because a request can succeed technically and still be a bad answer. So LLM observability also keeps the content, meaning the exact prompt, the retrieved chunks and the output. It traces each step with its own timing and cost, and attaches sampled quality scores and user feedback.\n\nFor example, a support bot can show zero errors and fast responses while confidently quoting the wrong refund policy. Every panel is green, and only content-level observability catches it. Bad traces then go into the eval set, so the same failure is caught before the next release.",
      "points": [
        "**Monitoring** - known metrics and alerts: is it up, is it fast?",
        "**Observability** - enough recorded detail to investigate any single request later.",
        "LLM additions: prompts and outputs, step-level traces, sampled quality scores, feedback, cost.",
        "A healthy-looking service can still be giving wrong answers.",
        "Bad traces feed back into the eval set."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Monitoring compared with LLM observability by the question it answers, what it records, and whether it catches confident wrong answers.",
        "aspects": [
          "Answers",
          "Records",
          "Wrong answers",
          "Picture"
        ],
        "columns": [
          {
            "label": "Monitoring",
            "note": "known numbers",
            "cells": [
              "Is it up, is it fast?",
              "Chosen metrics, alerts",
              "Missed, all panels green",
              "Heart-rate alarm"
            ]
          },
          {
            "label": "Observability",
            "note": "any request, later",
            "accent": "accent",
            "cells": [
              "Why did this go wrong?",
              "Prompt, chunks, output, spans",
              "Caught by quality scores",
              "Full patient chart"
            ]
          }
        ],
        "caption": "Monitoring says **something is wrong**; observability lets you work out **why**. Zero errors and fast replies can still be confidently wrong."
      },
      "say": "Monitoring tells me something is wrong. Observability lets me work out why, for any single request, after the fact. Monitoring is dashboards and alerts on numbers I picked in advance, like latency and error rate, so it answers whether the service is up and fast. That's not enough for an LLM app, because a request can succeed technically and still be a bad answer. Picture a support bot with zero errors and fast responses that's confidently quoting the wrong refund policy. Every panel is green and users are being misled. So I trace each step, retrieval, reranking, the model call and any tools, and keep the actual prompt, the retrieved chunks and the output, with timing, tokens and cost. Then I attach sampled quality scores and user feedback to those traces. The part juniors miss is closing the loop. Bad traces go straight into the eval set, so the same failure gets caught before the next release.",
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
      "quick": [
        "Normal services fail loudly, LLMs can be confidently wrong.",
        "Re-running rarely repeats the problem, so log everything.",
        "A wrong answer looks just like a right one.",
        "The provider can change the model without your deploy.",
        "Cost per request can vary a hundred times."
      ],
      "simple": "A normal service is either right or it throws an error. An LLM system is different, because it can be fast, healthy and confidently wrong at the same time.\n\nFour things cause this. It isn't repeatable, so re-running a bad request usually won't reproduce the problem, and whatever you logged is all you have. There's no clear pass or fail, since a wrong answer looks exactly like a right one until someone reads it. The model belongs to a provider who can update it, so your behaviour can change without your code changing. And cost varies per request.\n\nFor example, a policy assistant might give worse answers on Monday with no deploy on your side, because the provider updated the model over the weekend. Each point leads to a control: full tracing, quality metrics next to health metrics, pinned model versions and a live cost dashboard.",
      "points": [
        "Non-deterministic - re-running rarely reproduces. The trace is everything.",
        "Failures are plausible rather than loud. Wrong looks like right.",
        "The model can change underneath you without any deploy.",
        "Cost varies per request by orders of magnitude.",
        "Therefore: tracing, quality metrics, pinned versions, cost dashboards."
      ],
      "say": "A normal service is either right or it throws an error. An LLM system can be fast, healthy and confidently wrong. Four things drive that. It isn't repeatable, so re-running a bad request rarely reproduces it, and whatever I logged at the time is all I'll ever have. Failures are plausible rather than loud, because a wrong answer reads exactly like a right one until someone checks it. The model belongs to a provider who can change it, so behaviour can shift with no deploy on our side. And cost swings per request, since a long agent loop can cost a hundred times more than a short question. Each of those points to a control. Full tracing covers the first, quality metrics next to health metrics cover the second, pinned model versions cover the third, and cost per request goes on a live dashboard, not a capacity spreadsheet. Treating it as just an API call in the middle is the mistake.",
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
      "quick": [
        "Record enough to explain one bad answer weeks later.",
        "Keep the exact final prompt, model version and raw output.",
        "Log what search found, its scores, and what was used.",
        "For agents, log every tool use and why it stopped.",
        "Remove personal data when saving, and keep every failure."
      ],
      "simple": "A trace is the full record of one request. It's made of spans, one per step, such as retrieval, the LLM call or a tool call, each with its own inputs, outputs, timing and cost. Since you usually can't reproduce a bad LLM answer, the goal is to record everything you'd need to explain it weeks later.\n\nFor every request, I record the exact final prompt sent to the model, not the template, plus the model version, temperature, the raw output, tokens and timing. Retrieval gets its own detail, meaning the query as sent, the chunk IDs with scores, and which chunks made it into the prompt. For an agent, I log every tool call and why the loop stopped.\n\nFor example, if a user got a wrong leave-policy answer, the trace shows whether the right chunk was retrieved but dropped, or never found. You can sample healthy traces, but you always keep 100% of failures.",
      "points": [
        "The final assembled prompt, not the template.",
        "Model name and version, sampling parameters, raw pre-parse output.",
        "Retrieval: query, filters, chunk ids, scores, what survived into the prompt.",
        "Agents: every step, tool arguments, raw results, termination reason.",
        "Tokens and latency split - input/output, first token/total.",
        "Redact PII at write time. Keep 100% of failures, sample the rest."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "The contents of one trace: request-level fields, then one span per step for retrieval, the LLM call and tool calls.",
        "top": "one request = one trace",
        "bottom": "read it like a black box",
        "layers": [
          {
            "label": "Trace",
            "note": "trace ID, session, user",
            "accent": "accent"
          },
          {
            "label": "Retrieve span",
            "note": "query, filters, chunk IDs, scores"
          },
          {
            "label": "LLM span",
            "note": "final prompt, model version, raw output"
          },
          {
            "label": "Tool span",
            "note": "arguments, raw result, stop reason"
          },
          {
            "label": "Every span",
            "note": "timing, tokens, cost",
            "accent": "warn"
          }
        ],
        "caption": "Record what you need to **explain one bad answer six weeks later**. Keep the real filled-in prompt and **100% of failures**."
      },
      "say": "Everything I'd need to explain one bad answer six weeks from now, because with an LLM I usually can't reproduce it. A trace is the record of one request, split into spans, one per step, each with its own inputs, outputs, timing and cost. At the request level I keep the exact final prompt that went to the model, not the template, plus the model version, temperature, the raw output before parsing, and tokens in and out with time to first token and total time. Retrieval gets its own detail: the query as actually sent, the filters, the chunk IDs with scores, and which chunks survived into the prompt. For an agent, I log every tool call with arguments and raw result, and why the loop stopped. One trace ID runs across every service. Personal data is redacted when the trace is written, not when it's read. And I might sample healthy traces, but I keep every failure.",
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
      "quick": [
        "They all record LLM calls step by step with feedback.",
        "LangSmith is mainly hosted and easiest with its sister frameworks.",
        "Langfuse and Phoenix are open source and self-hostable.",
        "OpenTelemetry is the open standard, so switching tools stays cheap.",
        "Choose on privacy, hosting, lock-in and cost at your volume."
      ],
      "simple": "LangSmith, Langfuse and Arize Phoenix all do the same core job. They capture traces of your LLM calls and let you attach evaluations and user feedback, so the real choice is about hosting, data privacy and lock-in, not features. LangSmith comes from the LangChain team, so it fits LangChain and LangGraph best, and it's mainly hosted. Langfuse and Phoenix are open source and can be self-hosted.\n\nOpenTelemetry sits underneath all of them. It's the open standard for traces, and its GenAI conventions give agreed field names for things like model name and token counts. If you instrument with it, the same traces can go to any backend, like a standard plug socket.\n\nFor example, say a team is on LangGraph but legal won't let prompts leave the network. I'd self-host Langfuse or Phoenix and instrument with OpenTelemetry, so moving backends later doesn't mean re-instrumenting.",
      "points": [
        "**LangSmith** - LangChain ecosystem, mainly hosted: tracing, datasets, evals, prompts.",
        "**Langfuse** - open source, self-hostable: tracing, prompt versions, evals, cost.",
        "**Arize Phoenix** - open source, OpenTelemetry-native, strong RAG and eval views.",
        "**OpenTelemetry GenAI conventions** - vendor-neutral traces; swap backends without re-instrumenting.",
        "Choose on data residency, framework fit, existing APM and cost at your volume."
      ],
      "say": "I pick between them on hosting, data privacy and lock-in, because they all do the core job of tracing LLM calls and attaching evals and feedback. LangSmith comes from the LangChain team, so it's the smoothest fit on LangChain or LangGraph, and it's mainly hosted, with self-hosting on enterprise plans. Langfuse and Arize Phoenix are open source and self-hostable, which matters when prompts and customer data can't leave our own cloud. Phoenix is also strong on RAG and eval views. OpenTelemetry sits underneath all of them. It's the open standard for traces, and its GenAI conventions give agreed field names for things like model name and token counts. They're still maturing but widely supported. So say we're on LangGraph but legal won't let prompts leave the network. I'd self-host Langfuse or Phoenix and instrument with OpenTelemetry, so moving backends later doesn't mean re-instrumenting. Before committing, I estimate cost at our real trace volume, because that decides the bill and the retention we can afford.",
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
      "quick": [
        "Version prompt, model and documents, and stamp them on every request.",
        "Keep prompts in version control and review them like code.",
        "Pin an exact dated model, never a floating \"latest\" name.",
        "Release to a small share first, with a fast undo.",
        "Never let anyone hand-edit a live prompt."
      ],
      "simple": "In an LLM system, three things decide behaviour, so all three need a version number: the prompt, the model and the document index. The prompt lives in version control and is reviewed like code. The model is pinned to an exact dated ID, never a floating name like latest, because that lets the provider change your system without telling you. The index gets a version too, since the same prompt over a changed corpus is really a different system.\n\nThe habit that pays off is stamping all three versions on every request. That turns \"quality seems worse this week\" from a guess into a query. For example, if wrong refund answers start on Wednesday, you can see that every bad trace used index version 42, rebuilt that morning, while the prompt and model were unchanged.\n\nA prompt change then rolls out like code, to a small canary first, with fast rollback that doesn't need a full deploy.",
      "points": [
        "Prompt in version control, reviewed. Model pinned explicitly. Corpus versioned.",
        "Stamp all three on every request.",
        "Canary a prompt change like a code change, then widen.",
        "Rollback must be fast and independent of a deploy.",
        "Never allow direct editing of a live prompt."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Three versions stamped on every request: the prompt version, the pinned model version and the index version.",
        "top": "every request logs",
        "bottom": "filter by version, then compare",
        "layers": [
          {
            "label": "Prompt version",
            "note": "in git, reviewed like code"
          },
          {
            "label": "Model version",
            "note": "exact dated ID, never latest",
            "accent": "warn"
          },
          {
            "label": "Index version",
            "note": "changed corpus = new system"
          }
        ],
        "caption": "**Stamp prompt, model and index on every request.** Then \"quality feels worse\" becomes a database query, not a guess."
      },
      "say": "Three things get a version, the prompt, the model and the document index, and every request records which versions it used. The prompt lives in version control and gets reviewed like code. The model is pinned to an exact dated ID, never a floating name like latest, because a floating name lets the provider change our system without telling us. The index gets a version too, since the same prompt over a changed corpus is really a different system. Stamping all three is what makes incidents tractable. When someone says quality feels worse this week, I filter by version and compare, instead of guessing. Rollout follows the code pattern. A prompt change goes to a small canary slice first, I watch the quality signals, then widen, and rollback is fast and separate from a full deploy, because prompt problems often only show up in production. The thing I won't allow is a live prompt in a database field that someone edits by hand.",
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
      "quick": [
        "Something changed, just not your code.",
        "Check the model version and recent document updates.",
        "Users asking new kinds of questions is most common.",
        "Also check tools and the measuring setup itself.",
        "Re-run the fixed test set, a drop means the system changed."
      ],
      "simple": "When quality drops and nothing was deployed, something still changed, just not your code. Good logging lets you check five usual suspects quickly. The model may have changed, which is one query if you pinned and logged it. The documents may have changed through an ingestion job. The users may be asking about something new, which is the most common cause and the least suspected. A tool may return data in a different shape, or the measurement itself may have moved, like an updated judge model.\n\nThen comes the key test. You run your golden set now and compare it with the last saved run. If the score dropped, the system changed, and if it held, the users changed. For example, if a banking assistant's scores fall the week a new credit card launches but the golden set scores the same, the real problem is new questions. This only works if past runs are stored with their versions.",
      "points": [
        "Model version changed - one query if you pinned and logged.",
        "Corpus changed - check ingestion logs for the window.",
        "Traffic changed - compare query distributions. Most common, least suspected.",
        "A tool dependency changed shape.",
        "The measurement changed - judge model update, sampling shift.",
        "Run the golden set and compare to the last stored run. System moved, or users did."
      ],
      "diagram": {
        "alt": "When quality drops with no deploy, re-run the golden set. If the score dropped the system changed, so check model, documents, tools and judge. If it held, the users changed, so compare the question mix.",
        "rows": [
          [
            {
              "id": "q",
              "label": "Quality dropped",
              "note": "nothing deployed",
              "accent": "bad"
            }
          ],
          [
            {
              "id": "g",
              "label": "Re-run golden set",
              "note": "vs last stored run",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "s",
              "label": "System changed",
              "note": "model, documents, tools, judge"
            },
            {
              "id": "u",
              "label": "Users changed",
              "note": "compare question mix",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "g"
          },
          {
            "from": "g",
            "to": "s",
            "label": "score fell"
          },
          {
            "from": "g",
            "to": "u",
            "label": "score held"
          }
        ],
        "caption": "**One fork splits the investigation**: golden set fell means the system moved, held means the users did. Users changing is the **most common, least suspected** cause."
      },
      "say": "Something did change, just not our code, and there are five usual suspects I can check quickly if logging is good. First the model version, which is one query if we pinned and logged it. Then the documents, because an ingestion job may have added, removed or re-processed files in that window. Then the users. This is the most common cause and the least suspected. A product launch or a policy change shifts what people ask, so I compare the question mix before and after. After that, a tool dependency may be returning data in a different shape, or the measurement itself moved, like an updated judge model or a sampling change. Then comes the test that splits the investigation. I re-run the golden set and compare it with the last stored run. If the score dropped, the system changed. If it held, the users changed. None of this works unless golden-set runs are stored with their model and corpus versions.",
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
      "quick": [
        "First see where the money goes, per feature and customer.",
        "Set hard spending limits per user in code, not prompts.",
        "Alert on sudden jumps, which usually mean a bug.",
        "Cut cost with smaller models, caching and sending less text.",
        "Report cost per finished task, not per call."
      ],
      "simple": "Controlling cost in production works in three steps. First you see where the money goes, then you put hard limits in place, and only then do you reduce. Visibility comes first because most teams with a cost problem have no breakdown, and a daily dashboard of cost per request, feature and customer usually shows one feature is most of the bill.\n\nLimits come next. Token budgets per user and per session are enforced in code, not by asking the model nicely, and you alert on sudden jumps in tokens per request, because a jump is usually a bug. For example, a retry loop or a conversation history that stopped being trimmed can double tokens per request overnight.\n\nOnly then do you cut, with smaller models for easy steps, prompt caching, less retrieved text and routing by difficulty. The number to report is cost per completed task, because a cheap model that needs three tries isn't actually cheap.",
      "points": [
        "Cost per request, per feature, per tenant - on a dashboard, daily.",
        "Hard token budgets per user and per session, enforced in code.",
        "Alert on spend and on tokens-per-request spikes - spikes usually mean bugs.",
        "Reduce: right-size per step, cache the prefix, cut context, route by difficulty.",
        "Report cost per completed task, not per call."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Controlling cost in three steps, see where money goes, put hard limits in place, then reduce, and report cost per completed task.",
        "lanes": [
          {
            "label": "See",
            "note": "cost per feature, daily"
          },
          {
            "label": "Limit",
            "note": "token budgets in code, alerts",
            "accent": "warn"
          },
          {
            "label": "Reduce",
            "note": "smaller model, cache, route"
          },
          {
            "label": "Report",
            "note": "cost per completed task",
            "accent": "accent"
          }
        ],
        "caption": "**See, limit, then reduce.** A cheap model that needs three tries is not cheap, so report **cost per completed task**."
      },
      "say": "I work in three steps: see where the money goes, put hard limits in place, and only then reduce. Visibility comes first because most teams with a cost problem have no breakdown. A daily dashboard of cost per request, per feature and per customer usually shows one feature is most of the bill. Limits come next. Token budgets per user and per session are enforced in code, not by asking the model nicely in the prompt, and I alert on daily spend and on jumps in tokens per request. A jump like that is usually a bug, say a retry loop, a history that stopped being trimmed, or an agent that never stops. Only then do I cut. Smaller models take the easy steps, prompt caching covers the fixed prefix, retrieval sends less text, and routing keeps hard questions for the strong model. The number I report is cost per completed task, because a cheap model that needs three tries isn't cheap.",
      "numbers": "A starting point: alert on a ~30% day-over-day move in tokens per request, tuned to your normal variance. That threshold catches retry loops and untrimmed contexts before the invoice does.",
      "wrong": "\"We monitor our monthly spend.\" Monthly is too late - a runaway agent loop can spend a month's budget in a weekend.",
      "follow": "Tokens per request doubled overnight. What are the three likeliest causes?",
      "followAnswer": "My three likeliest causes are a retry loop, conversation history that stopped being trimmed, and an agent loop that no longer terminates. I'd check them in that order using traces, comparing input and output tokens separately. Input growth points at history or retrieval stuffing more chunks into the prompt, while output growth or extra calls per request points at retries or a runaway agent. I'd also check whether a prompt or retrieval setting changed that night, and put a hard token cap in code while I fix it."
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
      "quick": [
        "Link every thumbs up or down to that exact answer.",
        "Watch hidden clues like rephrasing, copying or asking for humans.",
        "Each week, an engineer and expert review bad answers.",
        "Confirmed failures become new test questions.",
        "Re-run them after the fix and share results."
      ],
      "simple": "Collecting user feedback is easy, but turning it into fixes is the hard part. The first rule is to attach every thumbs up or down to the trace of the answer it's about, because without that link you have an opinion with no evidence.\n\nThe second rule is to use hidden signals, not just buttons, since explicit feedback rates are usually low single-digit percentages. Every user leaves clues, like rephrasing the question, clicking a citation, asking for a human or leaving mid-conversation. For example, if many users rephrase the same question about expense limits straight after an answer, that answer failed, even though nobody pressed thumbs-down.\n\nThen you close the loop, which most teams skip. Each week an engineer and a domain expert review a sample of failures, and confirmed ones become golden-set test cases. When a fix ships, you re-run them and share the result, because users stop giving feedback if it goes nowhere.",
      "points": [
        "Attach every rating to its trace. Feedback without evidence is unusable.",
        "Implicit signals - rephrase, citation click, copy, escalation, abandonment.",
        "Weekly triage, engineer plus domain expert.",
        "Confirmed failures become golden-set cases.",
        "Re-run those cases after the fix and report it. Visible loops keep feedback coming."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "The feedback loop: signals attached to traces go to a review queue, weekly triage turns confirmed failures into golden-set cases, and the fix is re-run and shared with users.",
        "lanes": [
          {
            "label": "Signal + trace",
            "note": "thumbs, rephrase, escalation"
          },
          {
            "label": "Review queue",
            "note": "every thumbs-down"
          },
          {
            "label": "Weekly triage",
            "note": "engineer + domain expert",
            "accent": "warn"
          },
          {
            "label": "Golden-set cases",
            "note": "confirmed failures",
            "accent": "accent"
          },
          {
            "label": "Fix, re-run, share",
            "note": "repeat: users keep giving"
          }
        ],
        "caption": "Collecting feedback is easy; **closing the loop** is the part teams skip. Confirmed failures become **golden-set cases**, and visible fixes keep feedback coming."
      },
      "say": "Collecting feedback is easy. The hard part is turning it into fixes, so I design for both. Every thumbs up or down is attached to the trace of the answer it's about, because a rating without that evidence can't be debugged. I lean on hidden signals more than buttons, since only a few percent of users ever click thumbs. Someone rephrasing the same question, clicking a citation, copying the answer, asking for a human or leaving mid-conversation tells me a lot, and I get that on every interaction. Then the loop has to close, which is the step most teams skip. Thumbs-downs land in a review queue. Each week an engineer and a domain expert read a sample together, and confirmed failures become golden-set cases, which keeps the test set tied to reality. When a fix ships, I re-run those cases and share the result. If users feel their feedback goes nowhere, they stop giving it.",
      "numbers": "Explicit feedback rates are typically low single-digit percentages. Design for implicit signals as the primary source and treat thumbs as a bonus.",
      "wrong": "\"We have thumbs up and down on every response.\" Collection without a triage process is a dataset nobody reads.",
      "follow": "Nobody clicks the thumbs. What do you use instead?",
      "followAnswer": "I use implicit signals, because they come from every interaction rather than the few percent who click. A user rephrasing the same question straight away is a strong sign the answer missed. Copying the answer or clicking a citation suggests it helped, while asking for a human or abandoning mid-conversation suggests it didn't. I attach those signals to the trace, then sample the negative ones into a weekly review with a domain expert, and confirmed failures become golden-set cases."
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
      "quick": [
        "Treat it like a code release, small slice first.",
        "Send 5 to 10 percent of traffic to the new prompt.",
        "Watch signals that need no correct answers, for a full day.",
        "Compare each group, since averages hide a broken one.",
        "Then widen, with a one-click undo, no full deploy needed."
      ],
      "simple": "Rolling out a prompt change uses the same discipline as a code release: a small slice first, then watch, then widen. By release, the golden set has already been run on both prompts, but it isn't your real traffic, so some risk is left.\n\nSo I send 5-10% of traffic to the new prompt as a canary and hold it for at least 24 hours, because the traffic mix changes between working hours and overnight. I watch signals that don't need correct answers, such as sampled groundedness, the \"I don't know\" rate, parse failures, thumbs, latency and cost.\n\nThe extra check is comparing by segment, not just overall. A prompt can improve the average while badly hurting one language or one customer. For example, a new prompt might lift average groundedness but make German answers noticeably worse, which only shows when you look per language. Then I widen, keeping a one-click rollback that doesn't need a full deploy.",
      "points": [
        "PR: deterministic checks plus golden-set comparison against main, posted on the PR.",
        "Canary on a small traffic share for a full daily cycle.",
        "Watch groundedness sample, refusal rate, parse failures, length, thumbs, cost, p95.",
        "Compare per segment - averages hide a segment you broke.",
        "Rollback fast, independent of a deploy."
      ],
      "diagram": {
        "alt": "Rolling out a prompt change: after CI, a 5-10% canary is held for a full day and compared segment by segment. If every segment is healthy the rollout widens; if not, one-click rollback.",
        "rows": [
          [
            {
              "id": "ci",
              "label": "Passed PR and CI",
              "note": "golden set vs main"
            }
          ],
          [
            {
              "id": "cn",
              "label": "Canary 5-10%",
              "note": "hold 24 hours"
            }
          ],
          [
            {
              "id": "sg",
              "label": "Check each segment",
              "note": "language, doc type, tenant",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "w",
              "label": "Widen",
              "accent": "accent"
            },
            {
              "id": "rb",
              "label": "One-click rollback",
              "note": "no full deploy",
              "accent": "bad"
            }
          ]
        ],
        "edges": [
          {
            "from": "ci",
            "to": "cn"
          },
          {
            "from": "cn",
            "to": "sg"
          },
          {
            "from": "sg",
            "to": "w",
            "label": "all healthy"
          },
          {
            "from": "sg",
            "to": "rb",
            "label": "one worse"
          }
        ],
        "caption": "**Small slice, full day, then widen.** Compare **by segment**: a prompt can lift the average while breaking one language."
      },
      "say": "Same discipline as a code release, a small slice first, then widen, with one extra check because quality isn't simply pass or fail. By this point the golden set has run on both the old and new prompt. But the golden set isn't real traffic, so some risk is left. I send five to ten percent of traffic to the new prompt as a canary and hold it for a full day, because the traffic mix shifts between working hours and overnight. During that window I watch signals that need no labels: parse failures, the I don't know rate, sampled groundedness, answer length, thumbs, latency and cost. The extra check is comparing by segment. A prompt can lift the average while badly hurting one language, one document type or one tenant, and the overall number hides it. So I look at each group before widening, and keep a one-click rollback that doesn't need a full deploy.",
      "numbers": "Canary 5–10%, hold for at least 24 hours. Shorter windows miss the shift in traffic mix between working hours and overnight.",
      "wrong": "\"Prompts are config, so we can just push them.\" Then a prompt change skips the review, canary and rollback that code gets - and prompt edits are a frequent source of regressions.",
      "follow": "The canary looks fine overall but one tenant is complaining. What now?",
      "followAnswer": "I pause the rollout for that tenant, or roll back entirely if they're large, because the average can hide one segment we broke. Then I slice the canary metrics by tenant and pull their traces from both the old and new prompt. Often the cause is something specific to them, such as a document type, a language or a custom instruction the new prompt handles badly. Once I've fixed it, those cases go into the golden set and per-tenant comparison becomes a gate before widening."
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
      "quick": [
        "Treat the provider like any unreliable outside service.",
        "Retry only fixable errors, 2 or 3 times, waiting longer.",
        "Stop calling a clearly down provider and fail fast.",
        "Keep a tested backup model from another provider.",
        "Show relevant documents instead of an endless spinner."
      ],
      "simple": "An LLM provider can go down or rate-limit you, so you treat it like any unreliable dependency. The first defence is careful retries with exponential backoff and jitter, capped at 2-3 attempts, and only on errors that can succeed next time, like a rate limit or a timeout. Uncapped retries during an incident turn one outage into a second, self-inflicted one.\n\nNext is a circuit breaker, which stops sending requests for a short while when the provider is clearly down, so requests don't pile up and take your own service down too. Then you keep a fallback model from a different provider or region, tested in advance, because switching to an unevaluated model mid-incident turns one problem into two.\n\nFinally, you degrade gracefully. For example, a RAG chat can say the assistant is unavailable and show the most relevant documents, which is far better than an endless spinner, since search usually still works when generation doesn't.",
      "points": [
        "Retry with backoff and jitter, capped, and only on retryable errors.",
        "Circuit breaker - fail fast rather than queueing into your own outage.",
        "Fallback model, different provider or region, evaluated in advance.",
        "Degrade honestly: retrieval results beat a spinner.",
        "Queue asynchronous work instead of holding requests open.",
        "Track provider errors as a first-class SLO, separate from your own."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Layers of defence against provider outages and rate limits, from capped retries through a circuit breaker and a tested fallback model to a degraded mode and a queue.",
        "top": "provider fails",
        "bottom": "user still gets something",
        "layers": [
          {
            "label": "Capped retries",
            "note": "backoff + jitter, 2-3 max"
          },
          {
            "label": "Circuit breaker",
            "note": "fail fast, the fuse",
            "accent": "warn"
          },
          {
            "label": "Fallback model",
            "note": "other provider, tested first",
            "accent": "accent"
          },
          {
            "label": "Degrade gracefully",
            "note": "show documents, the torch"
          },
          {
            "label": "Queue",
            "note": "work that can wait",
            "accent": "muted"
          }
        ],
        "caption": "Treat the provider like **any unreliable dependency**: a fuse that trips, a **generator you have tested**, and a torch for when both fail."
      },
      "say": "I treat the provider like any unreliable external dependency, because that's what it is. Retries come first, with exponential backoff and jitter, capped at two or three attempts, and only on errors that can succeed next time. Rate limits and timeouts qualify, and I respect the Retry-After header. A content-policy refusal doesn't, so retrying it just burns money. Next is a circuit breaker. When the provider is clearly down, I stop sending for a short while and fail fast, otherwise requests pile up, time out and take our own service down too. Then a fallback model on a different provider or region, evaluated in advance, because switching to an untested model mid-incident turns one problem into two. Degrading gracefully matters as well. A RAG chat that says generation is unavailable and shows the most relevant documents beats an endless spinner. Work that can wait goes on a queue. And I track provider errors as their own SLO, separate from ours.",
      "numbers": "Cap retries at 2–3 with jitter. Uncapped retries during a provider incident turn one outage into a self-inflicted second one.",
      "wrong": "\"We retry on failure.\" Without the error-type distinction and the circuit breaker, retrying is how a provider blip becomes your incident.",
      "follow": "Your fallback model has never been evaluated. What do you do today?",
      "followAnswer": "Today I evaluate it, quickly, before any incident forces me to use it. I run the golden set through the fallback with our current prompts and compare quality, latency, cost and parse failures against the primary. If it's clearly worse, I adjust the prompts or restrict fallback to features where it performs acceptably, and degrade honestly elsewhere by showing retrieved documents instead. Then I add the fallback to the regular eval runs, so it's retested whenever prompts change."
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
      "quick": [
        "Record enough to explain any result months later.",
        "For trained models, save code, data, settings and results.",
        "For hosted models, save model, prompt and search versions.",
        "Also version the test set and its results.",
        "The registry shows which version is approved and live."
      ],
      "simple": "An experiment system or model registry exists so that, months later, you can answer \"what exactly produced this result?\" and roll back just the piece that changed. For a model you trained or fine-tuned, you record the code commit, the data snapshot, the training settings, the base model and resulting checkpoint, the environment and the metrics. The registry then records which version is approved for staging and which is in production.\n\nFor an app on a hosted API, you don't own the weights, but plenty still changes behaviour. So you record the provider's model version, the prompt and tool definitions, the embedding model and index version, and the eval-set results. For example, if a contract-summary feature starts missing clauses, you can see the prompt and model were the same but the embedding model changed, and roll back only that.\n\nThe common trap is tracking only the model name, because a prompt or index change moves behaviour just as much.",
      "points": [
        "Track code, data, model/checkpoint and training configuration for trained models.",
        "Track prompt, retrieval, tool and provider versions for API-based GenAI.",
        "Version the evaluation set and store quality, latency and cost results.",
        "Use a registry or release record for promotion history and rollback.",
        "The goal is reproducibility, not collecting metadata for its own sake."
      ],
      "say": "Enough to answer, months later, what exactly produced a result, and to roll back just the piece that changed. For a model we trained or fine-tuned, that's the code commit, the exact data snapshot, the training settings and seed, the base model and resulting checkpoint or adapter, the environment, and the metrics. On a hosted API we don't own the weights, but plenty still changes behaviour. So I record the provider's model version, the prompt and tool definitions, retrieval settings, the embedding model and index version, and the eval-set version with its quality, latency and cost results. The registry then says which tested version is approved for staging and which is live, which gives a clean promotion history. The trap is tracking only the model name. In a GenAI app, a prompt or index change moves behaviour just as much. MLflow or similar tools store it, but the real test is whether we can explain a production result without relying on someone's memory.",
      "numbers": "No fixed count matters. The test is operational: can you reproduce or explain a production result months later without relying on somebody remembering what changed?",
      "wrong": "Tracking only the model name. In a GenAI application, prompt, retrieval, tools and index versions can change behaviour just as much as the model.",
      "follow": "The provider uses a floating model alias and silently updates it. What extra evidence do you store around each production trace?",
      "followAnswer": "I store whatever the provider returns about the model on each response, such as the model identifier or fingerprint, alongside our own prompt, index and config versions. I also run a small canary eval set on a schedule and store the scores with timestamps, so a silent update shows up as a step change in quality, output length or latency. Where possible I'd pin a dated version instead, but when I can't, that daily baseline is my evidence of what changed."
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
      "quick": [
        "Ollama runs a model on your laptop while building.",
        "vLLM serves many users at once, using memory well.",
        "Both speak the same API, so switching is mostly a URL change.",
        "Use the same model and compression level in both.",
        "Never test speed under load on Ollama."
      ],
      "simple": "Using Ollama locally and vLLM in production is a sound strategy, because the two tools solve different problems. Ollama is a developer tool that downloads a quantised model and runs it on a laptop in minutes, but it isn't built for heavy traffic. vLLM is a production serving engine. PagedAttention stores the KV cache in small pages so GPU memory isn't wasted, and continuous batching lets new requests join the running batch straight away.\n\nThe pairing works because both offer an OpenAI-compatible API, so moving from laptop to production is mostly a change of base URL, not a rewrite.\n\nThe catches are where experience shows. For example, if you develop against a 4-bit model and deploy a full-precision one, behaviour differs in ways that look like a code bug, so you use the same model at the same compression level in both. And you never load-test on Ollama, because its speed tells you nothing about vLLM.",
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
      "diagram": {
        "kind": "compare",
        "alt": "Ollama compared with vLLM by purpose, concurrency, what makes it work, and what they share.",
        "aspects": [
          "For",
          "Concurrency",
          "Key feature",
          "Shared"
        ],
        "columns": [
          {
            "label": "Ollama",
            "note": "your laptop",
            "cells": [
              "Building and testing",
              "A few requests",
              "One install, quantised model",
              "OpenAI-compatible API"
            ]
          },
          {
            "label": "vLLM",
            "note": "production",
            "accent": "accent",
            "cells": [
              "Serving many users",
              "Heavy concurrent load",
              "PagedAttention, continuous batching",
              "OpenAI-compatible API"
            ]
          }
        ],
        "caption": "A sound pairing: promotion is **mostly a base URL change**. Keep the **same model and quantisation** in both, and never load-test on Ollama."
      },
      "say": "Yes, it's a sound strategy, as long as the model is identical in both, because the two tools solve different problems. Ollama is a developer runtime. One install, it pulls a quantised model and runs it on a laptop in minutes, and it handles a few parallel requests but isn't built for heavy traffic. vLLM is a production serving engine. PagedAttention stores the KV cache in small pages so GPU memory isn't wasted, and continuous batching lets new requests join a running batch straight away, which keeps the GPU busy under concurrent load. Both expose an OpenAI-compatible API, so promotion is mostly a base URL change. The catches are where experience shows. Develop against a 4-bit model and deploy full precision, and behaviour differs in ways that look like a code bug. Runtime defaults differ too, so I set temperature and max tokens explicitly. And I never load-test on Ollama, because its throughput says nothing about vLLM.",
      "numbers": "Continuous batching plus PagedAttention can give several-fold or larger throughput gains over naive serving under concurrent load. The size depends on model, prompt and output lengths, and GPU - benchmark your own traffic shape.",
      "wrong": "Treating them as interchangeable, or proposing Ollama for production traffic. The follow-up about concurrency and throughput exposes that it was not designed for that load.",
      "follow": "Your vLLM box handles 50 concurrent users and falls over at 200. What do you look at first?",
      "followAnswer": "I look at GPU memory and the KV cache first, because that's usually what runs out as concurrency rises. With 200 users, long prompts and outputs can fill the cache, so vLLM queues or preempts requests and latency climbs. I check cache utilisation, queue depth, time to first token and the max model length and max sequence settings. The fixes are capping context length and max tokens, tuning concurrency limits, a quantised model or adding replicas behind a load balancer, then load-testing with realistic prompt lengths."
    }
  ]
};
