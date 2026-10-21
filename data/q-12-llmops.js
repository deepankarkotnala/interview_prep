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
        "observability",
        "llmops"
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
      "followAnswer": "Enough to explain one bad answer weeks later. The final assembled prompt, not the template. Model name and version, sampling settings, the raw output, token counts, latency and cost. For retrieval: the query, filters, chunk IDs and scores. For agents: each tool call with its arguments and result, and why the loop stopped. All under one trace ID, with personal data redacted when the trace is written.",
      "builds": [
        "ops-01"
      ],
      "next": [
        "ops-02",
        "ops-12",
        "ev-07"
      ],
      "deeper": [
        "otel-genai",
        "langfuse"
      ],
      "check": {
        "kind": "predict",
        "q": "A support bot's dashboards show zero errors and a p95 of 1.2 seconds - every panel green. Users report it quotes the wrong refund policy. Which data lets you diagnose one of those answers?",
        "options": [
          "More latency percentiles, such as p99 and p99.9.",
          "A content trace for that request: final prompt, retrieved chunk IDs and the raw output.",
          "CPU and memory metrics from the inference hosts.",
          "The monthly error budget report."
        ],
        "answer": 1,
        "why": "Monitoring tells you the service is healthy; only content-level observability shows whether the right policy chunk was retrieved, dropped or misread. More latency or host metrics describe the server, not the answer."
      }
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
        "observability"
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
      "followAnswer": "With what changed that is not my code. I check the logged model version first - if we pin, that is one query. Then the corpus and ingestion logs for that window, then the query mix, then tool dependencies, then whether the judge or sampling changed. And I re-run the golden set against the last stored run, which tells me whether the system moved or the users did.",
      "builds": [
        "llm-03",
        "llm-10"
      ],
      "next": [
        "ops-05",
        "ops-02",
        "ops-03"
      ],
      "deeper": [
        "huyen-llm-production",
        "sre-book"
      ],
      "check": {
        "kind": "concept",
        "q": "Why does 're-run the failing request and see what happens' usually fail as a debugging step for a bad LLM answer?",
        "options": [
          "LLM APIs block repeated identical requests.",
          "Re-running is too expensive to do even once.",
          "Outputs are sampled, and the model version, corpus or retrieved context may have changed, so the trace captured at the time is the evidence.",
          "The model remembers the earlier request and answers differently on purpose."
        ],
        "answer": 2,
        "why": "Sampling, provider updates and a changing index mean a re-run is a different experiment. Whatever you logged at request time is all you will ever have, which is why full tracing comes first. Models do not remember earlier API calls."
      }
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
        "observability",
        "llmops",
        "rag"
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
      "followAnswer": "Ideally I do not keep the PHI itself. I redact or tokenise it when the trace is written, so the stored trace holds placeholders, and a secured vault maps them back only for authorised people. Traces live in an approved region, encrypted, with role-based access and audit logs. Raw payloads get shorter retention than redacted metadata, and the retention period is one legal has signed off.",
      "builds": [
        "ops-11"
      ],
      "next": [
        "ops-12",
        "gr-03",
        "rag-55"
      ],
      "deeper": [
        "otel-genai",
        "langfuse"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "Your trace records the prompt template name, the user's question and the final answer. A user reports a wrong leave-policy answer. What can you not tell from this trace?",
        "options": [
          "Whether the right chunk was retrieved but dropped, or never retrieved - the final assembled prompt and chunk IDs are missing.",
          "Which user asked the question.",
          "What the final answer said.",
          "Which prompt template was used."
        ],
        "answer": 0,
        "why": "Without the final assembled prompt and retrieval details, you cannot locate the failure in a multi-step pipeline. The template name is not the prompt; the retrieved context is what changes per request."
      },
      "try": {
        "title": "Emit a nested RAG trace with OpenTelemetry",
        "minutes": 20,
        "steps": [
          "Install `opentelemetry-sdk` and run the starter code, which prints spans to the console.",
          "Observe that the retrieve and model spans share the root span's trace ID and point to it as their parent.",
          "Add a `retrieval.used_chunk_ids` attribute that differs from the retrieved list and decide how you would query for dropped chunks.",
          "Add a fake exception in the model span and observe how the error status is recorded on the span."
        ],
        "code": "from opentelemetry import trace\nfrom opentelemetry.sdk.trace import TracerProvider\nfrom opentelemetry.sdk.trace.export import SimpleSpanProcessor, ConsoleSpanExporter\n\nprovider = TracerProvider()\nprovider.add_span_processor(SimpleSpanProcessor(ConsoleSpanExporter()))\ntrace.set_tracer_provider(provider)\ntracer = trace.get_tracer(\"rag-demo\")\n\nwith tracer.start_as_current_span(\"rag_request\") as root:\n    root.set_attribute(\"app.prompt_version\", \"v12\")\n    with tracer.start_as_current_span(\"retrieve\") as s:\n        s.set_attribute(\"retrieval.chunk_ids\", [\"doc7#3\", \"doc2#1\", \"doc9#4\"])\n    with tracer.start_as_current_span(\"chat model-x\") as s:\n        s.set_attribute(\"gen_ai.request.model\", \"model-x\")\n        s.set_attribute(\"gen_ai.usage.input_tokens\", 2900)\n        s.set_attribute(\"gen_ai.usage.output_tokens\", 410)"
      }
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
        "observability",
        "llmops",
        "privacy"
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
      "followAnswer": "Redact before the trace leaves the application: mask names, IDs and account numbers at write time, with a PII detector plus rules for our own ID formats. Then either self-host the tracing backend or use a vendor region and contract that legal has approved. Access is role-based and audited, raw payloads have short retention, and sensitive fields can be hashed so traces still link without exposing the value.",
      "builds": [
        "ops-11",
        "ops-02"
      ],
      "next": [
        "gr-03",
        "ops-02",
        "lg-09"
      ],
      "deeper": [
        "otel-genai",
        "langfuse"
      ],
      "check": {
        "kind": "judgement",
        "q": "Your team builds on LangGraph, and legal says prompts containing customer data must not leave your network. Which tracing choice fits best?",
        "options": [
          "Use the hosted tool that integrates best with LangGraph and accept the data transfer.",
          "Turn tracing off for customer requests.",
          "Log prompts to a local text file on each server.",
          "Self-host Langfuse or Phoenix and instrument with OpenTelemetry, so the backend can change later without re-instrumenting."
        ],
        "answer": 3,
        "why": "Data residency decides the hosting, and OpenTelemetry keeps the decision reversible. Framework fit matters less than where the prompts land. Turning tracing off or scattering files across servers loses the evidence you need to debug."
      }
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
        "rag"
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
      "followAnswer": "Deprecations come with notice, so I track the provider's schedule and put the date on our risk register. When one is announced, I run the full golden set on the replacement with the same prompts, then adjust prompts if needed. It rolls out like any change: shadow, canary, widen. I also keep a second model already evaluated, so a forced migration is never the first time we test an alternative.",
      "builds": [
        "ops-01"
      ],
      "next": [
        "ops-08",
        "ops-05",
        "ops-10"
      ],
      "deeper": [
        "mlflow",
        "langfuse"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "Config says `model: provider-flagship-latest`, and support staff edit the live prompt in an admin screen that writes straight to the database. Wrong answers start on Wednesday. Why will this be hard to explain?",
        "options": [
          "The admin screen is too slow for production use.",
          "A floating model alias and unversioned live prompt edits mean neither version is known or stamped on each request.",
          "Database-stored prompts cannot be cached by the provider.",
          "Flagship models are not allowed in production."
        ],
        "answer": 1,
        "why": "If the model and prompt can change without a version, you cannot filter traces by what changed, so the investigation becomes guesswork. Pin a dated model ID, keep prompts in version control and stamp prompt, model and index versions on every request."
      }
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
        "debugging",
        "evaluation"
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
      "followAnswer": "Not in the code, but it is still our problem. Users are asking about something new - a product launch or policy change - that the system was never tested for. I check whether the corpus covers the topic, add those queries to the golden set, and close the gap with new documents, a routing rule or a prompt change. Then I alert on topic mix, so the next shift shows before complaints do.",
      "builds": [
        "ops-03",
        "ev-02"
      ],
      "next": [
        "ops-06",
        "ev-07",
        "ops-10"
      ],
      "deeper": [
        "huyen-llm-production",
        "evidently"
      ],
      "check": {
        "kind": "predict",
        "q": "Quality complaints rise and nothing was deployed. You re-run the golden set and it scores the same as last month's stored run. What is the most likely cause?",
        "options": [
          "The users changed - the mix of questions shifted, for example after a product launch.",
          "The provider silently updated the model.",
          "The prompt was edited.",
          "The golden set is broken and should be discarded."
        ],
        "answer": 0,
        "why": "A stable golden-set score means the system behaves as before on known questions, so what moved is the traffic. A model or prompt change would usually shift the golden score. Compare query distributions before and after, then add the new question types to the set."
      }
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
        "cost",
        "llmops",
        "observability"
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
      "followAnswer": "My three likeliest causes are a retry loop, conversation history that stopped being trimmed, and an agent loop that no longer terminates. I'd check them in that order using traces, comparing input and output tokens separately. Input growth points at history or retrieval stuffing more chunks into the prompt, while output growth or extra calls per request points at retries or a runaway agent. I'd also check whether a prompt or retrieval setting changed that night, and put a hard token cap in code while I fix it.",
      "builds": [
        "cl-01"
      ],
      "next": [
        "cl-07",
        "cl-06",
        "cl-03"
      ],
      "deeper": [
        "huyen-llm-production",
        "litellm"
      ],
      "check": {
        "kind": "judgement",
        "q": "Where should a per-user daily token budget be enforced?",
        "options": [
          "In the system prompt, asking the model to keep answers short.",
          "In the application or LLM gateway, before the model call is made.",
          "In the monthly invoice review with finance.",
          "By choosing a model with a smaller context window."
        ],
        "answer": 1,
        "why": "A budget is a control, so it lives in code that can refuse or downgrade a call. A prompt instruction does not stop a retry loop, the invoice arrives after the money is spent, and a smaller context window limits one request, not a day's spend."
      }
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
        "evaluation"
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
      "followAnswer": "I use implicit signals, because they come from every interaction rather than the few percent who click. A user rephrasing the same question straight away is a strong sign the answer missed. Copying the answer or clicking a citation suggests it helped, while asking for a human or abandoning mid-conversation suggests it didn't. I attach those signals to the trace, then sample the negative ones into a weekly review with a domain expert, and confirmed failures become golden-set cases.",
      "builds": [
        "ev-01"
      ],
      "next": [
        "ev-02",
        "ev-10",
        "ops-05"
      ],
      "deeper": [
        "hamel-evals",
        "langfuse"
      ],
      "check": {
        "kind": "concept",
        "q": "Only 1-2% of users ever press thumbs up or down. Which implicit signal most directly marks a single answer as a failure?",
        "options": [
          "The session lasted longer than average.",
          "The user scrolled through the whole answer.",
          "The user asked a different question afterwards.",
          "The user immediately rephrased the same question."
        ],
        "answer": 3,
        "why": "An immediate rephrase says 'that did not answer me', and it is tied to one specific answer. Long sessions and scrolling are ambiguous, and moving on to a new topic often means the answer worked."
      }
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
        "evaluation"
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
      "followAnswer": "I pause the rollout for that tenant, or roll back entirely if they're large, because the average can hide one segment we broke. Then I slice the canary metrics by tenant and pull their traces from both the old and new prompt. Often the cause is something specific to them, such as a document type, a language or a custom instruction the new prompt handles badly. Once I've fixed it, those cases go into the golden set and per-tenant comparison becomes a gate before widening.",
      "builds": [
        "ev-06",
        "ops-03"
      ],
      "next": [
        "ops-05",
        "cd-05",
        "ev-08"
      ],
      "deeper": [
        "sre-book",
        "huyen-llm-production"
      ],
      "check": {
        "kind": "predict",
        "q": "A prompt change runs as a 10% canary for two hours on a weekday morning, shows no change in overall metrics, and is widened to 100%. What did this rollout most likely miss?",
        "options": [
          "Nothing - two hours at 10% is enough traffic.",
          "Latency regressions, which only show at 100% traffic.",
          "Overnight and weekend traffic mix, and segment-level damage (one language or tenant) hidden by the overall average.",
          "Changes in the provider's pricing."
        ],
        "answer": 2,
        "why": "Traffic mix shifts across the day, and averages hide a broken segment. Hold the canary for at least a full daily cycle and compare per language and tenant. Volume alone does not cover a mix the canary never saw."
      }
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
        "trade-offs"
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
        "Track provider errors as a separate SLO, separate from your own."
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
      "followAnswer": "Today I evaluate it, quickly, before any incident forces me to use it. I run the golden set through the fallback with our current prompts and compare quality, latency, cost and parse failures against the primary. If it's clearly worse, I adjust the prompts or restrict fallback to features where it performs acceptably, and degrade honestly elsewhere by showing retrieved documents instead. Then I add the fallback to the regular eval runs, so it's retested whenever prompts change.",
      "builds": [
        "py-04",
        "py-10"
      ],
      "next": [
        "sd-28",
        "ops-04",
        "cl-06"
      ],
      "alsoIn": [
        "riq-1009",
        "riq-2905",
        "riq-3104"
      ],
      "deeper": [
        "sre-book",
        "litellm"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "During a provider outage this wrapper makes things worse. Why?\n    for attempt in range(10):\n        try:\n            return call_model(req)\n        except Exception:\n            time.sleep(1)",
        "options": [
          "It sleeps too long between attempts.",
          "It retries every error, including non-retryable ones, ten times at a fixed interval with no jitter or circuit breaker, multiplying load in lockstep.",
          "It should retry forever until the provider recovers.",
          "It should catch only `TimeoutError` and never retry anything else."
        ],
        "answer": 1,
        "why": "Uncapped, synchronised retries on every error turn a provider blip into a self-inflicted overload. Retry only retryable errors (429, timeouts, 5xx) two or three times with exponential backoff and jitter, and trip a breaker when the provider is clearly down."
      }
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
        "fine-tuning"
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
      "followAnswer": "I store whatever the provider returns about the model on each response, such as the model identifier or fingerprint, alongside our own prompt, index and config versions. I also run a small canary eval set on a schedule and store the scores with timestamps, so a silent update shows up as a step change in quality, output length or latency. Where possible I'd pin a dated version instead, but when I can't, that daily baseline is my evidence of what changed.",
      "builds": [
        "ops-03"
      ],
      "next": [
        "ft-07",
        "ops-05",
        "cd-05"
      ],
      "deeper": [
        "mlflow",
        "langsmith"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Your release record stores only the model name for each version of a contract-summary feature. Which regression will you be unable to explain?",
        "options": [
          "The provider deprecated the model you pinned.",
          "The embedding model was swapped and the index rebuilt, while the prompt and model stayed the same.",
          "A new model version was rolled out.",
          "The model's per-token price changed."
        ],
        "answer": 1,
        "why": "Behaviour depends on prompt, retrieval, tools and index as much as the model. If only the model name is tracked, an embedding or index change is invisible. The other events show up in the model name or the provider's notices."
      }
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
        "serving",
        "open-weights",
        "llmops"
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
      "followAnswer": "I look at GPU memory and the KV cache first, because that's usually what runs out as concurrency rises. With 200 users, long prompts and outputs can fill the cache, so vLLM queues or preempts requests and latency climbs. I check cache utilisation, queue depth, time to first token and the max model length and max sequence settings. The fixes are capping context length and max tokens, tuning concurrency limits, a quantised model or adding replicas behind a load balancer, then load-testing with realistic prompt lengths.",
      "builds": [
        "cl-04",
        "llm-12"
      ],
      "next": [
        "cl-11",
        "cl-08",
        "cl-05"
      ],
      "deeper": [
        "vllm",
        "ollama"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "Developers build against a 4-bit 8B model in Ollama. Production serves the 16-bit version of the same model on vLLM. In production a JSON field is sometimes missing. What is the most likely cause?",
        "options": [
          "vLLM does not support JSON output.",
          "Production has more concurrent users.",
          "Ollama's API is not OpenAI-compatible.",
          "Different quantisation and runtime defaults make it effectively a different model - pin the same weights and set generation parameters explicitly."
        ],
        "answer": 3,
        "why": "A 4-bit and a 16-bit model behave differently, and the runtimes have different default temperature and token limits. That looks like a code bug but is a model mismatch. Both tools expose OpenAI-compatible APIs, and load does not change the output format."
      },
      "try": {
        "title": "Call a local model through the OpenAI-compatible API",
        "minutes": 15,
        "steps": [
          "Install Ollama, pull a small model such as `llama3.2:3b`, and install the `openai` Python package.",
          "Run the starter code and note the usage block that comes back with the response.",
          "Run it three times with temperature 0 and three times with the default, and observe which runs differ.",
          "Note that pointing `base_url` at a vLLM server would be the only code change - and list what else must match (model, quantisation, parameters)."
        ],
        "code": "from openai import OpenAI\n\nclient = OpenAI(base_url=\"http://localhost:11434/v1\", api_key=\"ollama\")\nr = client.chat.completions.create(\n    model=\"llama3.2:3b\",\n    messages=[{\"role\": \"user\", \"content\": \"Name three uses of a KV cache.\"}],\n    temperature=0,\n    max_tokens=150,\n)\nprint(r.choices[0].message.content)\nprint(r.usage)"
      }
    },
    {
      "id": "ops-13",
      "q": "Prompts in Git or in a prompt registry? How do you run a registry without losing control?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "prompting"
      ],
      "why": "Prompt registries are now common in LLM stacks. The panel wants to know you understand immutable versions versus movable labels, and who is allowed to move production.",
      "quick": [
        "Registry versions are immutable; labels like `production` are movable pointers.",
        "Moving a label is a release, so gate it like a deploy.",
        "Cache prompts in-process with a bundled fallback copy.",
        "Stamp prompt name and version on every trace.",
        "Prompts coupled to code changes stay in Git."
      ],
      "simple": "Prompts in Git are reviewed and released with the code. A prompt registry - Langfuse prompt management or MLflow's Prompt Registry, for example - lets you change a prompt without a deploy, which is both the benefit and the risk.\n\nThe mechanism is similar everywhere: each save creates an immutable version, and a label or alias such as `production` points at one version. Langfuse fetches the `production`-labelled version by default, and MLflow loads a prompt by URI such as `prompts:/support-answer@production`. Promoting a prompt means moving a pointer, and rolling back means moving it back. That is a release, so it goes through the same eval gate and approval as code, and every move is audited.\n\nTwo operational details decide whether it works. First, the registry must not become a runtime dependency. SDKs cache prompts in the process, and you bundle a fallback copy with the app so a registry outage or a cold start does not take the product down. Second, every trace records the prompt name and version, or 'which prompt produced this answer?' cannot be answered.\n\nFor example, product managers may edit wording in the registry, but only CI moves the `production` label, after the golden set passes. Prompts whose variables or output format change together with code stay in Git, because they must ship together.",
      "points": [
        "Immutable versions plus movable labels or aliases (`production`, `staging`).",
        "Label moves go through the eval gate and approval; audit who moved what.",
        "In-process caching and a bundled fallback prompt.",
        "Prompt name and version on every trace and eval run.",
        "Prompts coupled to code (variables, output schema) stay in Git."
      ],
      "say": "Both, with a clear split. Prompts coupled to code - where variables or the output schema change with it - live in Git and ship with the code. Prompts that non-engineers tune can live in a registry like Langfuse or MLflow's, as long as it's run like a release system. The mechanism is immutable versions plus a movable label such as production, so promotion and rollback are just moving that pointer. Moving it is a release, so only the pipeline moves it after the eval gate passes, and every move is audited. Two details make it safe in production. The registry can't be a runtime dependency, so prompts are cached in the process with a bundled fallback for cold starts. And every trace records the prompt name and version, otherwise nobody can say which prompt produced a bad answer. What I wouldn't allow is anyone moving the production label from a UI with no gate.",
      "numbers": "Cache prompts in-process and refresh on an interval of seconds to minutes. Fetching the prompt on every request adds a network hop and puts the registry inside your availability budget.",
      "verified": "2026-10",
      "wrong": "\"With a registry we don't need review - product managers can update the live prompt.\" That removes the eval gate and the audit trail, and prompt edits are a frequent source of regressions.",
      "follow": "A bad prompt was promoted on Friday evening. How fast can you roll it back, and how do you find the answers it affected?",
      "followAnswer": "Rollback is moving the `production` label back to the previous version, which takes seconds and spreads as cached copies refresh. To find affected answers I query traces by prompt name and version for the window it was live, then run the relevant checks or a judge over that slice. If it was customer-facing, the affected tenants are told. Afterwards I tighten who, or what, may move the label.",
      "builds": [
        "ops-03",
        "pr-07"
      ],
      "next": [
        "ops-15",
        "ops-22"
      ],
      "deeper": [
        "langfuse-prompts",
        "mlflow-prompts"
      ],
      "check": {
        "kind": "predict",
        "q": "Your app fetches the `production` prompt from the registry on every request, with no cache. The registry has a 20-minute outage. What happens?",
        "options": [
          "Nothing - the model provider caches prompts for you.",
          "Requests fail or stall, because the registry has become a hard runtime dependency.",
          "The app automatically falls back to the newest version.",
          "Only new users are affected."
        ],
        "answer": 1,
        "why": "Without in-process caching and a bundled fallback, the registry sits on your critical path, so its outage is your outage. SDK caches plus a shipped fallback copy keep serving the last known prompt."
      }
    },
    {
      "id": "ops-14",
      "q": "How do you version the golden set and the vector index so that any eval result is reproducible?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "evaluation",
        "vector-db"
      ],
      "why": "A reproducibility question. Teams version code and prompts and forget that the eval data and the index change underneath them, which makes before-and-after comparisons meaningless.",
      "quick": [
        "Golden sets are immutable snapshots with a version and content hash.",
        "An index version is corpus + chunker + embedding model + settings.",
        "Write a manifest; never rebuild an index in place.",
        "Switch indexes with an alias; keep the previous one for rollback.",
        "Every eval run records dataset, index, prompt and model versions."
      ],
      "simple": "An eval score only means something if you can say exactly what it was measured on. Two things drift quietly: the golden set, as people add and fix cases, and the index, as documents and pipelines change.\n\nFor the golden set, every release is an immutable snapshot with a version and a content hash, stored in object storage or a dataset tool and never edited in place. New cases create a new version. Each eval run records the dataset version, so when a score moves from 82 to 85 you can tell whether the system improved or the test got easier.\n\nFor the index, the version is a manifest, not a date: the corpus snapshot (document IDs with their hashes), parser and chunker settings, the embedding model and exact version, and index parameters. Change any of them and it is a new index. You build it alongside the old one, validate retrieval on a labelled set, then switch an alias so the application never hard-codes a physical index name. The old index stays until the new one has proven itself.\n\nFor example, if recall@5 drops after a release, the manifests show that chunk size went from 512 to 1,024 tokens while the corpus was unchanged, and you switch the alias back in seconds. The embedding model used at query time must always match the index's manifest.",
      "points": [
        "Golden set: versioned, immutable, hashed; a held-out slice never tuned against.",
        "Index manifest: corpus snapshot, parser and chunker config, embedding model version, index parameters.",
        "Blue/green indexes behind an alias; the old index kept for rollback.",
        "The query-time embedding model must match the index manifest.",
        "Every eval run and trace stamps dataset, index, prompt and model versions."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "What an index version manifest contains: corpus snapshot with hashes, parser and chunker config, embedding model and version, index parameters and the validation result, published behind a live alias.",
        "caption": "**An index version is a recipe, not a date.** Change any ingredient and it is a new index, built alongside and switched by alias.",
        "top": "index version 43",
        "bottom": "alias: policies-live",
        "layers": [
          {
            "label": "Corpus snapshot",
            "note": "doc IDs + content hashes"
          },
          {
            "label": "Parser and chunker config",
            "note": "chunk size, overlap, rules"
          },
          {
            "label": "Embedding model + version",
            "note": "must match the query side",
            "accent": "warn"
          },
          {
            "label": "Index parameters",
            "note": "HNSW settings, analysers"
          },
          {
            "label": "Validation result",
            "note": "recall@k on a labelled set",
            "accent": "accent"
          }
        ]
      },
      "say": "I treat both as release artefacts with manifests. The golden set is an immutable snapshot with a version and a content hash. Nobody edits it in place; new cases make a new version, and each eval run records which one it used, so I can tell an improved system from an easier test. The index version is a manifest, not a date: the corpus snapshot with document hashes, parser and chunker settings, the exact embedding model and the index parameters. Changing any of them makes a new index, which I build alongside the old one, validate on a labelled retrieval set and then switch behind an alias, so the app never names a physical index. The old one stays warm for rollback. One rule I enforce in code is that the query embedding model matches the manifest, because a mismatch returns plausible nonsense rather than an error. Every trace and eval run stamps all four versions.",
      "numbers": "Keep at least the previous index live until the new one has run a full traffic cycle - a day or more. Rebuilding a large index can take hours, which is far too slow to count as a rollback.",
      "wrong": "\"We re-index nightly into the same index.\" Then no eval result can be reproduced, there is nothing to roll back to, and a bad ingestion silently replaces a good one.",
      "follow": "You upgrade the embedding model. Can you re-embed only the new documents?",
      "followAnswer": "No. Vectors from different embedding models live in different spaces, so mixing them in one index makes similarity scores meaningless, and query embeddings would only match part of the corpus. A model change means re-embedding the whole corpus into a new index, validating retrieval against the old one on a labelled set and then switching the alias. I budget for the compute and for running both indexes for a while, and I keep the old index until the new one wins.",
      "builds": [
        "ev-02",
        "cd-05"
      ],
      "next": [
        "ops-22",
        "ops-15"
      ],
      "deeper": [
        "mlflow",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "numbers",
        "q": "Your golden-set score rose from 82% to 86% between releases. The prompt changed, and in the same week 40 hard cases were removed as 'ambiguous'. What can you conclude?",
        "options": [
          "The prompt improved quality by 4 points.",
          "Nothing yet - run both prompts on the same dataset version to separate the two effects.",
          "The provider improved the model.",
          "The removed cases were noise, so 86% is the true score."
        ],
        "answer": 1,
        "why": "Two things changed at once: the system and the test. Only a paired run of both prompts on one dataset version isolates the prompt's effect, and removing hard cases can raise the score on its own."
      },
      "try": {
        "title": "Build an index manifest and catch a model mismatch",
        "minutes": 20,
        "steps": [
          "Embed ten short documents with two sentence-transformers models that share a dimension, such as `all-MiniLM-L6-v2` and `paraphrase-MiniLM-L3-v2`.",
          "Write a manifest dict for the first index: model name, document IDs, a SHA-256 of each document and the chunk settings.",
          "Query the first index with embeddings from the second model and observe that scores look plausible but the rankings are wrong.",
          "Add a check that compares the query model with the manifest and raises on mismatch; observe it fail fast.",
          "Edit one document and observe its hash change, which makes the corpus snapshot a new version."
        ]
      }
    },
    {
      "id": "ops-15",
      "q": "Design the evaluation gate that can block a release. What are the rules, and how do you stop it being flaky or ignored?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "evaluation",
        "testing"
      ],
      "why": "Many teams have an eval job; few have a gate people trust. The panel wants decision rules, a way to handle noise and an override process - the parts that make a gate real.",
      "quick": [
        "Compare candidate with production on the same cases, not a fixed threshold.",
        "Must-pass slices such as safety block, whatever the averages say.",
        "Allow for noise: small sets cannot see small drops.",
        "Pin the judge model and judge prompt; version them too.",
        "Overrides need a named owner and a written reason."
      ],
      "simple": "A release gate turns eval results into ship or no-ship automatically. To be trusted it needs four properties.\n\nFirst, it compares like with like. The candidate and the current production configuration run on the same dataset version in the same job, and the gate looks at the paired difference rather than an absolute threshold that drifts as the set changes. Second, it has tiers of rules. Must-pass cases - safety refusals, PII leaks, regulated answers - block on a single failure. Aggregate metrics such as groundedness or task success use non-inferiority: the candidate may not be worse than production by more than an agreed margin. Cost and latency get their own ceilings.\n\nThird, it respects noise. Outputs and judges vary between runs, and a small set cannot detect small changes. For example, on 200 cases at about 85% pass rate the standard error is about 2.5 points, so a 2-point drop is invisible, and flagging it makes the gate flaky. Run judged cases more than once, use paired differences and size the set for the drop you care about. Fourth, the judge is part of the system under test: pin its model and prompt, and calibrate it against human labels.\n\nFinally, overrides exist but are expensive: a named owner, a written reason and a follow-up ticket. A gate that cannot be overridden gets bypassed; one overridden silently is decoration.",
      "points": [
        "Paired comparison with production on one dataset version.",
        "Must-pass slices block on any failure; aggregates use non-inferiority margins.",
        "Size the set for the effect you need to see; repeat runs to tame variance.",
        "Pin and calibrate the judge; version its prompt.",
        "Gate cost and latency too; overrides logged and owned."
      ],
      "diagram": {
        "alt": "Release gate: candidate and production run on the same dataset version, then three checks - must-pass slice, aggregate non-inferiority, cost and latency ceilings - all feed the decision to canary or to an owned override.",
        "caption": "**Compare, don't threshold.** Must-pass cases block alone; averages need a margin wider than the noise.",
        "rows": [
          [
            {
              "id": "r",
              "label": "Candidate vs production",
              "note": "same dataset version, same run"
            }
          ],
          [
            {
              "id": "m",
              "label": "Must-pass slice",
              "note": "safety, PII, regulated answers",
              "accent": "bad"
            },
            {
              "id": "a",
              "label": "Aggregates",
              "note": "non-inferiority margin"
            },
            {
              "id": "c",
              "label": "Cost and latency",
              "note": "ceilings"
            }
          ],
          [
            {
              "id": "s",
              "label": "Ship to canary",
              "note": "or a named, logged override",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "r",
            "to": "m"
          },
          {
            "from": "r",
            "to": "a"
          },
          {
            "from": "r",
            "to": "c"
          },
          {
            "from": "m",
            "to": "s"
          },
          {
            "from": "a",
            "to": "s"
          },
          {
            "from": "c",
            "to": "s"
          }
        ]
      },
      "say": "The gate compares the candidate with production on the same dataset version in the same run, because an absolute threshold drifts as the set changes. It has tiers. Must-pass cases - safety refusals, PII, regulated answers - block on a single failure. Aggregate scores like groundedness use non-inferiority: the candidate can't be worse than production by more than an agreed margin. Cost and latency get ceilings. Then I deal with noise, which is what makes gates flaky. With 200 cases at about 85% pass rate, the standard error is around two and a half points, so a two-point drop is invisible. I run judged cases more than once, use paired differences and size the set for the drop I actually care about. The judge is pinned and calibrated against human labels, since it's part of the system. And overrides are allowed but owned: a named person, a reason and a ticket. Otherwise people route around the gate.",
      "numbers": "Standard error of a pass rate is sqrt(p(1 - p) / n). At p = 0.85 and n = 200 that is about 0.025, so roughly plus or minus 5 points at 95% confidence on a single run - too wide to gate on a 2-point change without more cases or a paired analysis.",
      "wrong": "\"Block if the score is below 80%.\" A fixed threshold ignores noise and dataset changes: it fails good releases on random dips and passes regressions whenever the set gets easier.",
      "follow": "The gate fails on a release the product team badly needs today. What do you do?",
      "followAnswer": "First I look at what failed. If it is a must-pass safety or compliance case, the answer is no - we fix that case or ship without that change. If it is an aggregate within noise, or a known judge quirk, the documented override applies: the product owner signs it, we record the reason, ship to a small canary with tighter monitoring and open a ticket to fix the gate or the cases. Overrides are visible in the release log, so if they become routine, the gate itself gets reviewed.",
      "builds": [
        "ev-06",
        "ev-02",
        "ev-03"
      ],
      "next": [
        "ops-16",
        "ops-25"
      ],
      "deeper": [
        "hamel-evals",
        "promptfoo"
      ],
      "check": {
        "kind": "numbers",
        "q": "Your gate runs 100 cases once each. Production passes 88 and the candidate 86. What is the right reading?",
        "options": [
          "The candidate is 2 points worse - block it.",
          "A 2-case gap on 100 single runs is within noise; use paired, repeated runs or more cases before deciding.",
          "The candidate is better, because the variance favours it.",
          "Lower the threshold to 85% so it passes."
        ],
        "answer": 1,
        "why": "At about 87% and n = 100 the standard error is roughly 3.4 points per arm, so a 2-case gap is noise. Pair the comparison on the same cases and repeat runs, or enlarge the set, before treating it as a regression."
      },
      "try": {
        "title": "See how noisy a small eval gate is",
        "minutes": 15,
        "steps": [
          "Simulate a system whose true pass rate is 85%, scored on 200 cases, using numpy.",
          "Repeat the simulation 1,000 times and print the spread of observed pass rates.",
          "Observe how often an unchanged system scores 2 or more points below 85% - each of those is a false alarm.",
          "Repeat with 1,000 cases and observe the spread shrink by about the square root of five.",
          "Write down the smallest drop your gate can reliably detect at each set size."
        ],
        "code": "import numpy as np\n\nrng = np.random.default_rng(0)\nfor n in (200, 1000):\n    scores = rng.binomial(n, 0.85, size=1000) / n\n    false_alarm = (scores <= 0.83).mean()\n    print(n, round(scores.std(), 4), f\"false alarm at -2 pts: {false_alarm:.0%}\")"
      }
    },
    {
      "id": "ops-16",
      "q": "Shadow, canary or A/B - which do you use for a model swap versus a prompt tweak, and what does shadowing an LLM actually cost?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "evaluation",
        "cost"
      ],
      "why": "Tests release judgement. Each technique answers a different question, and shadowing an LLM has costs and dangers that shadowing a web service does not.",
      "quick": [
        "Shadow: how differently does it behave? Users see nothing.",
        "Canary: does anything break live? Small exposure, fast rollback.",
        "A/B: does it improve the business metric? Needs time and power.",
        "Shadowing pays for tokens twice on the sampled traffic.",
        "Never let a shadow call tools that write."
      ],
      "simple": "The three techniques answer different questions, so the choice depends on what is changing.\n\nShadowing sends a copy of real requests to the candidate and shows its output to nobody. It answers 'how differently does this behave on real traffic?', which makes it the right first step for a model swap, where behaviour can change everywhere at once. The costs are real: every shadowed request is paid for twice, so you sample a small percentage and cap the spend, and you compare outputs with a pairwise judge and diff metrics, then read the largest disagreements. The danger is side effects. A shadow agent must never call tools that write, send email or charge cards, so those tools are stubbed to record the call they would have made.\n\nA canary sends a small share of real users to the candidate and watches signals that need no labels - errors, latency, cost, refusals, parse failures, sampled groundedness - with automatic rollback triggers. It answers 'does anything break in the real world?' and suits a prompt tweak that already passed the eval gate. An A/B test answers 'is it better for the business?' and needs a pre-registered metric, user-level randomisation and enough traffic.\n\nFor example, moving to a new model family: shadow a few percent for several days and review the biggest disagreements, then canary, then A/B if you need proof of business value. A typo fix in a prompt goes straight to a short canary.",
      "points": [
        "Shadow for big behavioural changes; canary for small gated changes; A/B for business impact.",
        "Shadow cost: duplicated tokens on the sample - budget and cap it.",
        "Stub writing and external tools in the shadow; record intended calls.",
        "Compare shadow outputs with pairwise judges, then read the largest disagreements.",
        "A canary needs automatic rollback triggers on label-free signals."
      ],
      "say": "They answer different questions, so I pick by the change. Shadowing answers how differently the candidate behaves on real traffic, with users seeing nothing. It's my first step for a model swap, where behaviour can shift everywhere. It isn't free: every shadowed request is paid twice, so I sample a few percent and cap spend, and I compare outputs with a pairwise judge before reading the biggest disagreements. The real danger is side effects. A shadow agent must never call tools that write or send anything, so those tools are stubbed to record what it would have done. A canary answers whether anything breaks with real users, at a small share with automatic rollback on errors, latency, cost and refusal rate. That's enough for a prompt tweak that passed the gate. An A/B test answers whether it's better for the business, which needs a pre-registered metric and time. A typo fix gets a short canary; a new model family gets all three.",
      "numbers": "Shadowing 5% of traffic adds roughly 5% to token spend while it runs - more if the candidate is a pricier tier or writes longer outputs. Work it out before starting and set a daily cap.",
      "wrong": "\"Shadow everything for a week to be safe.\" It doubles the bill, and without stubbed write tools a shadow agent can carry out real actions that no user asked for.",
      "follow": "The shadow comparison shows the new model disagrees with production on 30% of requests. Is that bad?",
      "followAnswer": "Not necessarily - disagreement is not error. I'd sample the disagreements, have a pairwise judge and a domain expert label which answer is better, and segment them by intent. If most are equivalent wording, that is fine. If they cluster in one intent where the new model is worse, I fix the prompt for that intent or keep routing it to the old model. Only when the labelled sample shows parity or better do I move to a canary.",
      "builds": [
        "ops-08",
        "ev-08"
      ],
      "next": [
        "ops-25",
        "ops-22"
      ],
      "deeper": [
        "huyen-ai-engineering",
        "sre-book"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A team shadows a new model for its expense agent by duplicating 10% of requests to the candidate, which has the same tools as production. What is the most serious problem?",
        "options": [
          "10% is too small a sample to learn anything.",
          "The shadow agent can call real write tools, filing or approving duplicate expenses.",
          "Shadow outputs should be shown to users to collect feedback.",
          "A shadow cannot use the same prompts as production."
        ],
        "answer": 1,
        "why": "A shadow must have no side effects. With live write tools the candidate performs real actions nobody asked for. Stub or sandbox every writing tool and record the intended calls instead."
      }
    },
    {
      "id": "ops-17",
      "q": "How do you instrument an LLM app with OpenTelemetry's GenAI conventions today, and how stable are they?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "observability",
        "llmops"
      ],
      "why": "OpenTelemetry is how teams avoid observability lock-in. The panel checks whether you know the span model and the honest status: the conventions are still in development, so you plan for change.",
      "quick": [
        "One span per operation: chat, embeddings, retrieval, execute_tool, invoke_agent.",
        "Core attributes: operation name, provider name, models, token usage.",
        "Prompt and response content is opt-in, off by default.",
        "Still at Development stability, so pin your instrumentation versions.",
        "Redact in the Collector, then export to any backend."
      ],
      "simple": "OpenTelemetry gives you vendor-neutral traces, and its GenAI semantic conventions define what LLM spans are called and which attributes they carry, so any backend can read them. The model is one span per operation. Operation names include `chat`, `embeddings`, `retrieval`, `execute_tool` and `invoke_agent`, and span names combine the operation with the model or tool, such as `execute_tool get_order_status`. Core attributes include `gen_ai.operation.name`, `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.response.model` and token usage such as `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens`, which feed cost dashboards. There are MCP conventions as well, and MCP itself documents passing `traceparent` in a request's `_meta` so tool-server spans join the agent's trace.\n\nContent is deliberately opt-in. Attributes such as `gen_ai.input.messages` and `gen_ai.output.messages` may contain sensitive data, and instrumentations should not capture them by default. You switch capture on deliberately and redact in the OpenTelemetry Collector before export.\n\nThe honest status matters. As of October 2026 the GenAI conventions are still marked Development, and they have moved to their own repository, separate from the core semantic conventions. Attribute names have changed between releases before. So you pin instrumentation and convention versions and keep attribute mapping in one place. For example, a cost dashboard reads token counts through one view you update when names change, instead of hard-coding raw attribute names in twenty panels.",
      "points": [
        "A span per operation; names like `chat {model}` and `execute_tool {tool}`.",
        "Required: `gen_ai.operation.name`, `gen_ai.provider.name`; token-usage attributes drive cost.",
        "Message-content attributes are opt-in and sensitive.",
        "Status: Development; the conventions now live in a dedicated GenAI repository.",
        "MCP: trace context via `_meta`, plus MCP-specific conventions.",
        "Pin versions, normalise in the Collector, redact before export."
      ],
      "say": "I instrument with OpenTelemetry using the GenAI semantic conventions, so traces aren't tied to one vendor. Each operation gets a span - chat, embeddings, retrieval, execute_tool, invoke_agent - named from the operation plus the model or tool. The core attributes are the operation name, the provider name, the requested and response models, and input and output token counts, which feed the cost dashboards. Message content is opt-in because it's sensitive, so I turn capture on deliberately and redact in the Collector before export. For MCP, trace context travels in the request's `_meta`, so tool-server spans join the agent's trace. The honest part is status. As of now the GenAI conventions are still marked Development and have moved into their own repository, and names have changed between releases. So I pin the instrumentation and convention versions and keep attribute mapping in one place, so a rename is a config change rather than a broken dashboard.",
      "numbers": "Content capture is the size and risk multiplier. Token-count attributes add a few bytes per span; full message content can add tens of KB per call. Capture content on a sample or on failures only unless you have a clear reason.",
      "verified": "2026-10",
      "wrong": "\"OpenTelemetry GenAI is a stable standard, so we built dashboards directly on raw attribute names.\" The conventions are still in Development and names have changed; unpinned instrumentation can silently break those dashboards.",
      "follow": "Legal says prompts may contain customer PII. Can you still trace?",
      "followAnswer": "Yes. Content capture stays off by default, so spans carry structure, models, tokens, latency and IDs but no text. Where content is needed for debugging, I enable it on a sample or on failed requests, run a redaction processor in the OpenTelemetry Collector and route content to a store with stricter access and shorter retention than metrics. I also record a hash of the prompt, so identical inputs can be matched without storing them.",
      "builds": [
        "ops-12",
        "ops-02"
      ],
      "next": [
        "ops-18",
        "mcp-23"
      ],
      "deeper": [
        "otel-genai-repo",
        "otel-genai"
      ],
      "check": {
        "kind": "concept",
        "q": "You enable OpenTelemetry GenAI instrumentation with default settings. What do your chat spans contain?",
        "options": [
          "Full prompts and completions, because tracing captures everything.",
          "Operation, provider, model and token usage - message content is opt-in and off by default.",
          "Only latency, because GenAI attributes need a paid backend.",
          "Nothing until every attribute is declared stable."
        ],
        "answer": 1,
        "why": "Content attributes such as input and output messages may hold sensitive data, so the conventions say instrumentations should not capture them by default. Structural attributes like model and token usage are recorded normally."
      }
    },
    {
      "id": "ops-18",
      "q": "How do you attribute LLM cost to each tenant and feature when calls go through shared agents, caches and retries?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cost",
        "llmops",
        "observability"
      ],
      "why": "Finance asks 'what does customer X cost us?'. The panel wants a design that survives shared infrastructure, cached tokens and retries, and that reconciles to the invoice.",
      "quick": [
        "Tag every model call with tenant, feature and task ID at the gateway.",
        "Cost = usage tokens times a versioned price table.",
        "Price cached, input, output and reasoning tokens separately.",
        "Count embeddings, rerankers, judges and retries, not just chat calls.",
        "Reconcile monthly to the invoice; allocate shared costs by a stated rule."
      ],
      "simple": "Cost attribution starts with tagging, not maths. Every model call goes through a gateway or wrapper that attaches tenant, user, feature and a request or task ID, and agents propagate those IDs to every sub-call. Without that, a shared agent's calls cannot be attributed to anyone.\n\nThen you compute cost per call from the usage the provider returns - input, cached input, output and, for reasoning models, reasoning tokens, each of which can be billed differently - multiplied by a price table. The price table is versioned data with effective dates, because prices change and last quarter's report must not be recomputed with this quarter's prices. You also count everything around the model call: embeddings, reranker calls, guardrail and judge calls, tool APIs and every retry, since a retried call costs as much as a successful one.\n\nShared costs need an explicit rule. Index builds, nightly evals and provisioned capacity are not caused by one request, so you allocate them - for example by each tenant's share of tokens - and write the rule down. Finally, reconcile monthly against the provider invoice. If your computed total is well below the invoice, something is untagged.\n\nFor example, cost per resolved ticket per tenant might show that one enterprise customer's long documents make them five times as expensive as the median, which turns a pricing conversation from opinion into data.",
      "points": [
        "Gateway tags: tenant, user, feature, request or task ID, propagated through agents.",
        "Versioned price table with effective dates; separate cached, input, output and reasoning rates.",
        "Include embeddings, reranking, guardrails, judges, retries and tool APIs.",
        "A stated allocation rule for shared and provisioned costs.",
        "Monthly reconciliation against the invoice; untagged spend is a bug."
      ],
      "say": "I make attribution a property of the call path, not a reporting job. Every model call goes through a gateway that attaches tenant, user, feature and a task ID, and agents propagate those to sub-calls. Cost per call comes from the usage the provider returns - input, cached input, output and reasoning tokens, priced separately - against a versioned price table with effective dates, so old reports don't change when prices do. I include everything that isn't the chat call: embeddings, reranking, guardrails, judges, tool APIs and every retry. Shared costs like index builds, nightly evals and provisioned capacity get an explicit allocation rule, such as share of tokens. Then I reconcile monthly against the invoice, and a gap means untagged traffic. The number finance actually needs is cost per completed task per tenant, because that's what feeds pricing and margin decisions.",
      "numbers": "Aim to tag nearly all spend: after reconciliation, treat more than a few percent of unattributed cost as a defect to fix, not a rounding error.",
      "wrong": "\"We split the monthly invoice by each tenant's request count.\" Requests vary hugely in tokens, retries and model tier, so heavy tenants are subsidised and pricing decisions rest on fiction.",
      "follow": "A tenant disputes their chargeback. How do you prove the number?",
      "followAnswer": "I can drill from their monthly total to features, then to individual tasks and calls, each with tokens, model, price-table version and retries. I'd show which features drove the cost, a few representative traces, and how their cost per task compares with the median tenant. If the dispute exposes our bug - for example retries caused by our own timeouts - we credit it and fix it, because charging customers for our failures erodes trust in the whole scheme.",
      "builds": [
        "cl-01",
        "ops-04"
      ],
      "next": [
        "cl-07",
        "ops-23"
      ],
      "deeper": [
        "litellm",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which design will under-report a tenant's true LLM cost?",
        "options": [
          "Tagging at the gateway and propagating task IDs through sub-agents.",
          "Counting only successful chat completions, skipping retries, embeddings and judge calls.",
          "Pricing cached input tokens at their own rate.",
          "Keeping the price table with effective dates."
        ],
        "answer": 1,
        "why": "Retries are billed like successes, and embeddings, rerankers and judge calls are real spend. Counting only successful chat calls systematically understates cost, often most for the tenants causing the most retries."
      }
    },
    {
      "id": "ops-19",
      "q": "What kinds of drift hit an LLM application, and how do you catch each one before users do?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "observability",
        "evaluation"
      ],
      "why": "The prevention side of the 'quality dropped and nothing was deployed' incident. The panel wants named drift types, a detector for each and the idea that some drift never shows up in model metrics.",
      "quick": [
        "Input drift: users ask new things in new ways.",
        "Corpus drift: documents added, removed or gone stale.",
        "Provider drift: aliases move, models retire, defaults change.",
        "Measurement drift: the judge or golden set changed.",
        "A detector per type, plus a nightly golden run."
      ],
      "simple": "An LLM app has four kinds of drift, and each needs its own detector.\n\nInput drift is change in what users ask. Detect it by embedding queries and tracking each topic cluster's share of traffic, plus simple features like language mix and query length. A common rule of thumb borrowed from credit scoring, the population stability index, treats a shift above about 0.25 as significant. For example, a product launch shows up as a new cluster the golden set does not cover.\n\nCorpus drift is change in the documents. Track documents added, removed and updated per day, the age of documents actually retrieved, the share of queries with no hit above a score threshold, and the distribution of retrieval scores. A sudden fall in top scores often means an ingestion job broke.\n\nProvider drift is change on the model side: a floating alias moving to a new snapshot, a retirement, or a changed default. Pin dated model versions where the provider offers them, log the model the response reports, and run the golden set nightly against the production configuration, so a change shows up as a score break with no deploy.\n\nMeasurement drift is the sneakiest: a judge update or an edited golden set moves the score while the system is unchanged. Pin the judge, version the set and keep a fixed anchor subset that never changes, so trends stay comparable.",
      "points": [
        "Input: topic-cluster shares, language mix, length; PSI-style distribution checks.",
        "Corpus: ingestion volume, retrieved-document age, no-hit rate, score distributions.",
        "Provider: pinned versions, logged response model, nightly golden run.",
        "Measurement: pinned judge, versioned set, fixed anchor subset.",
        "New clusters feed the golden set and the content backlog."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Four kinds of drift in an LLM application - input, corpus, provider and measurement - with what changes, the signal to watch and the first response for each.",
        "caption": "**Each drift has its own detector.** A flat golden score rules out the system changing - not the users or the documents.",
        "aspects": [
          "What changes",
          "Signal to watch",
          "First response"
        ],
        "columns": [
          {
            "label": "Input",
            "note": "users",
            "cells": [
              "What users ask",
              "Cluster shares, language mix",
              "Label new cases"
            ]
          },
          {
            "label": "Corpus",
            "note": "documents",
            "cells": [
              "The documents",
              "No-hit rate, top scores",
              "Check ingestion"
            ]
          },
          {
            "label": "Provider",
            "note": "model side",
            "accent": "accent",
            "cells": [
              "Model or defaults",
              "Nightly golden run",
              "Pin, compare, migrate"
            ]
          },
          {
            "label": "Measurement",
            "note": "the yardstick",
            "accent": "warn",
            "cells": [
              "Judge or test set",
              "Anchor-subset score",
              "Pin judge, version set"
            ]
          }
        ]
      },
      "say": "I separate four kinds, because each needs its own detector. Input drift is users asking new things: I embed queries and watch each topic cluster's share of traffic, plus language mix and length, and a new cluster the golden set doesn't cover becomes a work item. Corpus drift is the documents changing: I track ingestion volume, the age of documents actually retrieved, the share of queries with no good hit and the score distribution - a sudden drop in top scores usually means ingestion broke. Provider drift is the model side: aliases moving, retirements, changed defaults. I pin dated versions where offered, log the model the response reports, and run the golden set nightly so a change shows as a score break with no deploy. Measurement drift is the sneaky one: the judge or the test set changes and the score moves with the system untouched. So the judge is pinned and a fixed anchor subset never changes.",
      "numbers": "Population stability index rule of thumb: below 0.1 stable, 0.1-0.25 worth watching, above 0.25 a significant shift. It is a heuristic from credit scoring - calibrate it on your own week-to-week variation before alerting on it.",
      "wrong": "\"We monitor accuracy, so we'd see drift.\" In production you rarely get labels in time, and corpus or measurement drift can change outcomes while every model metric you watch stays flat.",
      "follow": "A new query cluster appears and is growing 20% a week. What do you do with it?",
      "followAnswer": "I sample it and read real examples first, to understand the intent. Then three actions: add representative, expert-labelled cases to the golden set so we can measure it; check whether the corpus covers it, since a new product often means missing documents; and decide on routing - if we cannot answer it well yet, a clear hand-off beats a confident wrong answer. I'd also tell the product owner, because a growing cluster is usually a business change, not a model problem.",
      "builds": [
        "ops-05",
        "ml-26"
      ],
      "next": [
        "ops-20",
        "ops-21"
      ],
      "deeper": [
        "evidently",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "predict",
        "q": "Nightly golden-set scores are flat, but the share of production queries with no retrieval hit above threshold doubled this week. Which drift is most likely?",
        "options": [
          "Provider drift - the model changed.",
          "Input drift - users are asking about things the corpus does not cover.",
          "Measurement drift - the judge changed.",
          "No drift, because the golden scores are flat."
        ],
        "answer": 1,
        "why": "A flat golden set means the system behaves the same on known questions. A rising no-hit rate in live traffic points to new questions the corpus and the golden set do not cover. A model or judge change would move the golden scores."
      },
      "try": {
        "title": "Detect input drift with embedding clusters",
        "minutes": 25,
        "steps": [
          "Write 200 'last month' queries and 200 'this week' queries, where this week includes 40 about a new topic, and embed them with `all-MiniLM-L6-v2`.",
          "Fit KMeans with 8 clusters on last month's embeddings and assign both periods to those clusters.",
          "Compute each cluster's share in both periods and the population stability index with the starter function.",
          "Observe which cluster's share jumps, and read its queries to name the new topic.",
          "Remove the new-topic queries, recompute and confirm the index falls back towards zero."
        ],
        "code": "import numpy as np\n\ndef psi(expected, actual, eps=1e-6):\n    e = np.asarray(expected) + eps\n    a = np.asarray(actual) + eps\n    return float(np.sum((a - e) * np.log(a / e)))\n\n# cluster shares per period, each summing to 1\nprint(psi([0.25, 0.25, 0.25, 0.25], [0.15, 0.20, 0.25, 0.40]))"
      }
    },
    {
      "id": "ops-20",
      "q": "How do production failures become golden-set cases without poisoning or overfitting the set?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "llmops",
        "privacy"
      ],
      "why": "Everyone says 'feed failures back into the eval set'. The panel wants the pipeline - triage, labelling, privacy, balance and a held-out slice - because a careless loop makes the set useless.",
      "quick": [
        "Triage first: confirm it is a real failure and name its cause.",
        "A domain expert writes the expected answer, not the engineer.",
        "Scrub personal data and check retention rules before storing.",
        "Add failures as tagged slices; keep the set balanced.",
        "Keep a fixed anchor and a held-out slice; bump the version."
      ],
      "simple": "The feedback loop is a pipeline with gates, not a button that copies bad traces into the eval set.\n\nIt starts with triage. A flagged answer - a thumbs-down, an escalation, a failed automated check - is reviewed to confirm it really is wrong and to classify the cause: retrieval miss, reasoning error, out-of-scope question or a bad source document. Only confirmed failures move on, and near-duplicates are merged so one persistent user does not create twenty similar cases.\n\nNext come labelling and privacy. A domain expert writes or approves the expected answer and grading criteria. The case is scrubbed of personal data and checked against your retention and consent rules, because production traces often hold things you may not keep indefinitely - in India, DPDP Act obligations about purpose and retention apply to what you store.\n\nThen composition. If every new case is a failure, the set drifts towards edge cases and a score change no longer means what it used to. So new cases go into slices tagged by cause and date, and reports show each slice separately. A fixed anchor subset never changes, for trend lines, and a held-out slice is never used for prompt tuning. Every addition creates a new dataset version.\n\nFor example, twelve failures about a new reimbursement rule become four expert-labelled cases in a 'reimbursement-2026-10' slice; the fix is checked against them while the overall trend stays comparable.",
      "points": [
        "Triage and root-cause before admitting a case; merge near-duplicates.",
        "Expert-labelled expected answers and grading criteria.",
        "PII scrubbing plus retention and consent checks.",
        "Slices tagged by cause and date, reported separately.",
        "Fixed anchor subset, held-out slice, new dataset version per change."
      ],
      "say": "As a pipeline with gates. A flagged answer is triaged first: is it really wrong, and why - retrieval miss, reasoning error, out of scope, bad source document? Only confirmed failures go further, and near-duplicates are merged so one persistent user doesn't create twenty cases. A domain expert writes the expected answer and grading criteria, not the engineer who'll fix it. The case is scrubbed of personal data and checked against our retention and consent rules, because traces often hold things we can't keep. Then composition, which is where loops go wrong. If every new case is a failure, the set drifts towards edge cases and scores stop being comparable. So new cases land in tagged slices that are reported separately, a fixed anchor subset never changes, and a held-out slice is never used for prompt tuning. Every addition is a new dataset version.",
      "numbers": "A workable cadence is a weekly triage session that admits a handful to a few dozen cases. If hundreds arrive each week, cluster and sample first - labelling quality falls quickly when experts are rushed.",
      "wrong": "\"Every thumbs-down goes straight into the golden set.\" Many thumbs-downs are not model errors, duplicates swamp the set, personal data ends up in long-lived test data and the score stops being comparable over time.",
      "follow": "Your team keeps fixing prompts against the new failure cases and the score keeps rising. Why might that mislead you?",
      "followAnswer": "Because they are tuning against the test. Each prompt tweak aimed at known cases can overfit them while doing nothing, or harm, for unseen traffic. That is why I keep a held-out slice nobody may look at while tuning, and an anchor subset that stays fixed. If the tuned slice rises but the held-out and anchor scores stay flat, the gains are overfitting. Shadow or canary results on live traffic are the final check.",
      "builds": [
        "ops-07",
        "ev-02"
      ],
      "next": [
        "ops-15",
        "ops-14"
      ],
      "deeper": [
        "hamel-evals",
        "dpdp-act"
      ],
      "check": {
        "kind": "judgement",
        "q": "Which change to your feedback loop will most damage the golden set's usefulness over a year?",
        "options": [
          "Adding expert-labelled failures as a tagged slice each month.",
          "Replacing old cases with recent failures so the set stays a fixed size.",
          "Keeping a held-out slice that nobody tunes against.",
          "Creating a new dataset version on every change."
        ],
        "answer": 1,
        "why": "Swapping old cases for recent failures changes the test every month, so scores stop being comparable and the set skews towards edge cases. Tagged slices, a held-out slice and versioning all preserve comparability."
      }
    },
    {
      "id": "ops-21",
      "q": "Your provider announces the retirement of the model version you are pinned to. Walk me through the migration.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "evaluation",
        "cost"
      ],
      "why": "Every production LLM team now does this regularly. The panel wants a plan driven by evaluation, with the non-obvious breakages - parameters, tokenisers, partner-platform dates - called out.",
      "quick": [
        "Read the notice: retirement date and recommended replacement.",
        "Find every caller from gateway logs and usage exports, not memory.",
        "Run the golden set on candidates; expect prompt re-tuning.",
        "Check the API surface: parameters, output format, token counts, cost.",
        "Shadow, canary, switch - weeks before the date."
      ],
      "simple": "Model retirement is now routine, so it should be a runbook, not a scramble. Providers publish lifecycle pages with dates and recommended replacements. Anthropic, for example, commits to at least 60 days' notice before retiring a publicly released model, and OpenAI states at least six months for generally available models, less for specialised variants and potentially much less for previews. Partner clouds such as Bedrock or Vertex can set their own schedules, so check the platform you actually call.\n\nStep one is inventory: every service, batch job, fallback path and judge that uses the model, taken from gateway logs or the provider's usage export. Judges are often forgotten and they matter, because changing the judge moves every score.\n\nStep two is evaluation. Run the golden set on the recommended replacement and one or two alternatives, comparing quality, latency, cost per task and refusal behaviour per segment, and expect to re-tune prompts. Check the API surface too, which breaks more often than people expect. Newer models can reject parameters older ones accepted - Anthropic's documentation, for example, lists non-default `temperature`, `top_p` and `top_k` as returning errors on its newer models. Tokenisers differ, which changes both cost and how much fits in context, and output formats can shift enough to break parsers.\n\nStep three is release: shadow, canary, switch, with the old model as rollback while it still exists - finishing weeks before the date, not on it.",
      "points": [
        "Notice periods differ by provider and platform; read the lifecycle page.",
        "Inventory every caller, including judges, evals, batch jobs and fallbacks.",
        "Per-segment golden-set comparison; budget for prompt re-tuning.",
        "API breakages: rejected parameters, tokeniser and output-format changes.",
        "Shadow, canary, switch early - the rollback only exists until retirement."
      ],
      "say": "I run it as a project with a deadline. First I read the notice: the retirement date and the recommended replacement. Notice varies - Anthropic commits to at least sixty days for public models, OpenAI to at least six months for generally available ones - and partner clouds can set their own dates. Then inventory: every service, batch job, fallback and judge that uses the model, from gateway logs or the usage export, not memory. Judges matter because swapping one moves every score. Then I run the golden set on the replacement and an alternative, per segment, comparing quality, latency, cost per task and refusals, and I budget for prompt re-tuning. I also check the API surface, because newer models can reject parameters older ones accepted, tokenisers change cost and context fit, and output formats can break parsers. Finally shadow, canary and switch, finishing weeks early while the old model still exists as a rollback.",
      "numbers": "Checked October 2026: Anthropic gives at least 60 days' notice before retiring publicly released models; OpenAI gives at least 6 months for generally available models, at least 3 months for specialised variants and possibly much less for previews. Re-check the live pages - policies change.",
      "verified": "2026-10",
      "wrong": "\"We'll just change the model string to the recommended replacement.\" Prompts, parameters, parsers, cost and judges can all break, and finding out on the retirement date leaves no rollback.",
      "follow": "The replacement is 8% worse on one segment and the retirement date is five weeks away. What do you do?",
      "followAnswer": "I treat it as a scoped problem, not a blocker. First I check whether it is the model or the prompt: a few targeted prompt changes for that segment often close most of the gap. If not, I evaluate an alternative model for that segment only, behind the router. In parallel I tell the product owner the residual risk and we decide together whether it is acceptable. What I don't do is wait, because after the retirement date there is no old model to fall back to.",
      "builds": [
        "ops-03",
        "ev-06"
      ],
      "next": [
        "ops-22",
        "ops-06"
      ],
      "deeper": [
        "claude-deprecations",
        "openai-deprecations"
      ],
      "check": {
        "kind": "which-fails",
        "q": "In a migration inventory, which caller is most often forgotten and most likely to distort your evaluation?",
        "options": [
          "The main chat endpoint.",
          "The LLM judge used by your eval pipeline.",
          "The customer-facing API.",
          "The canary deployment."
        ],
        "answer": 1,
        "why": "Judges rarely appear in the product's dependency list, but if the judge model is retired or swapped, every quality score moves at once, which looks like a product regression. Migrate and recalibrate the judge as a separate, deliberate step."
      }
    },
    {
      "id": "ops-22",
      "q": "Can you roll back the model, the prompt and the index independently? How do you design for that?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "deployment",
        "vector-db"
      ],
      "why": "Rollback is where release engineering for LLM apps gets real. The panel wants the artefacts versioned separately, the compatibility rules between them and the things that cannot be rolled back.",
      "quick": [
        "A release manifest pins model, prompt, index and tool versions.",
        "Each is switched by a pointer: config, label or alias.",
        "Index and query embedding model always move together.",
        "Prompts tuned for one model may not roll back alone.",
        "Written data - memories, tickets, emails - cannot be rolled back."
      ],
      "simple": "Independent rollback works if each artefact is switched by a pointer and the combination is recorded. The model is a configuration value (a dated model ID or a gateway alias), the prompt is a registry label or a Git version, and the index sits behind an alias. A release manifest records the exact combination - model, prompt version, index version, tool and parser versions - and every trace stamps the manifest ID. Rolling back means moving one pointer and recording a new manifest.\n\nThe skill is knowing the coupling rules. The index and the query-side embedding model are welded together: roll back the index and the query embedder must roll back with it. Prompts are often tuned to a model, so rolling back the model alone can leave a prompt relying on behaviour the old model lacks; test the pairs you might need. Output parsers must accept what both versions produce during the switch.\n\nSome things cannot be rolled back. If the new version wrote long-term memories, sent emails, created tickets or wrote summaries into a store, moving a pointer does not undo them. Each release needs a list of such side effects and a clean-up plan, and writes should be tagged with the manifest ID so they can be found and repaired.\n\nFor example, after a bad index rebuild you switch the alias back in seconds while the model and prompt stay put, because the manifest shows only the index changed.",
      "points": [
        "Pointers: model alias or config, prompt label, index alias.",
        "A release manifest stamped on traces; a rollback creates a new manifest.",
        "Coupled pairs: index with query embedder, prompt with model, parser with output format.",
        "Pre-test the rollback combinations you would actually use.",
        "Irreversible side effects: memories, messages, tickets - tag writes by manifest."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "Rollback coupling grid: rolling back the index always requires rolling back the query embedder; rolling back the model needs the prompt pair tested and the parser checked; rolling back the prompt needs the parser checked only if the output schema changed.",
        "caption": "**Pointers make rollback fast; coupling makes it safe or unsafe.** Know which pieces must move together before the incident.",
        "xLabel": "Must this move too?",
        "yLabel": "Roll back",
        "cols": [
          "Query embedder",
          "Prompt",
          "Parser"
        ],
        "rows": [
          "Index",
          "Model",
          "Prompt"
        ],
        "cells": [
          [
            {
              "label": "Yes, always",
              "accent": "bad"
            },
            {
              "label": "Usually no"
            },
            {
              "label": "No"
            }
          ],
          [
            {
              "label": "No"
            },
            {
              "label": "Test the pair",
              "accent": "warn"
            },
            {
              "label": "Check output format",
              "accent": "warn"
            }
          ],
          [
            {
              "label": "No"
            },
            {
              "label": "-"
            },
            {
              "label": "If schema changed",
              "accent": "warn"
            }
          ]
        ]
      },
      "say": "Yes, if each one is switched by a pointer and the combination is recorded. The model is a config value or gateway alias, the prompt is a registry label or Git version, and the index sits behind an alias. A release manifest records the exact set - model, prompt, index, tools, parser - and every trace stamps the manifest ID, so I can see which piece changed when quality moved. The skill is the coupling rules. The index and the query embedding model always move together, or retrieval quietly returns nonsense. Prompts are often tuned to a model, so I test the pairs I might fall back to. Parsers must accept both versions' output during a switch. And some things can't be rolled back at all: memories written, emails sent, tickets created. So each release lists its side effects, and writes are tagged with the manifest ID so I can find and repair them.",
      "numbers": "A pointer rollback should take seconds to minutes. If rolling back any artefact needs a rebuild or a full redeploy, you do not have a rollback plan - you have a recovery project.",
      "wrong": "\"We roll back by redeploying the previous Git commit.\" That reverts code, but not a registry label someone moved, an index rebuilt in place or memories the new version already wrote.",
      "follow": "With limited time, which combinations would you test in advance?",
      "followAnswer": "The ones I would actually reach for in an incident. Usually that is the current prompt with the previous model, for a provider problem, and the current model with the previous index, for an ingestion problem. I run both through the golden set at release time, so a rollback is a known quantity. Combinations that are invalid by construction, such as an index with a mismatched query embedder, I block in code so nobody can choose them under pressure.",
      "builds": [
        "ops-03",
        "ops-14",
        "cd-05"
      ],
      "next": [
        "ops-24",
        "ops-13"
      ],
      "deeper": [
        "huyen-ai-engineering",
        "sre-book"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "To undo a bad re-index, an engineer points the search alias back at last week's index but leaves the query embedding model on the new version shipped with the re-index. What happens?",
        "options": [
          "Retrieval works normally - indexes are independent of the query model.",
          "Search compares vectors from different models and returns plausible but poor results, with no errors.",
          "The search engine rejects every query.",
          "Only latency changes."
        ],
        "answer": 1,
        "why": "Vectors from different embedding models live in different spaces. If the dimensions match, nothing errors - results just quietly degrade. Index and query embedder must always roll back together, which is why the manifest couples them."
      }
    },
    {
      "id": "ops-23",
      "q": "Define SLOs for an LLM feature. What do you measure beyond availability and latency?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "observability",
        "latency"
      ],
      "why": "SLOs force a team to say what 'working' means. For LLM features the panel wants streaming-aware latency, a quality SLI you can actually measure and an error budget that drives decisions.",
      "quick": [
        "Availability: requests completing without error, timeout or empty answer.",
        "Latency: time to first token and full response, at p95.",
        "Quality: sampled pass rate on pinned checks, over days.",
        "Cost per task as a budget, not an SLO.",
        "Alert on burn rate; a spent budget slows releases."
      ],
      "simple": "An SLO is a target for an SLI - a measured ratio of good events - over a window, and the gap to 100% is the error budget you can spend on change. LLM features need the usual SLIs adapted, plus a new one.\n\nAvailability counts requests that complete without an error, a timeout or an empty response, and the team decides up front whether an answer from a fallback model counts as good. Latency for a streaming UI needs two SLIs: time to first token, which users feel as responsiveness, and total response time, each measured at p95 or p99 against a threshold. For example, '95% of chat turns show the first token within 1.5 seconds'.\n\nThe new one is quality. You cannot label every answer, so you sample - a few hundred responses a day, say - and score them with pinned automated checks such as citation validity, parse success and a calibrated groundedness judge. The SLI is the pass rate over a window long enough for the sample to be stable, usually days rather than minutes, which makes it a ticket-level alert rather than a page.\n\nCost per completed task works better as a budget with alerts than as an SLO. Then use the error budget the way SRE practice intends: alert on burn rate over short and long windows, and when the budget is spent, slow down releases and fix reliability before shipping features.",
      "points": [
        "Availability SLI includes timeouts and empty answers; decide whether fallbacks count.",
        "Separate time-to-first-token and total-time SLIs for streaming.",
        "Quality SLI from sampled, pinned checks over multi-day windows.",
        "Cost per task as a budget with alerts.",
        "Multi-window burn-rate alerts; the error budget gates releases."
      ],
      "say": "I'd define three SLOs and one budget. Availability counts requests that complete without an error, timeout or empty answer, and the team decides up front whether a fallback model's answer counts as good. Latency gets two SLIs for a streaming UI: time to first token, which is what users feel, and total response time, both at p95. Then quality, which is the new one. I can't label everything, so I sample a few hundred responses a day and score them with pinned checks - citation validity, parse success, a calibrated groundedness judge - and the SLI is the pass rate over several days, because the sample needs time to be stable. That one opens tickets rather than paging anyone. Cost per completed task is a budget with alerts rather than an SLO. And the error budget does real work: burn-rate alerts across short and long windows, and when it's spent we slow releases.",
      "numbers": "A 99.9% monthly availability target allows about 43 minutes of failure in a 30-day month (0.1% of 43,200 minutes). If your provider's own record is worse than that, your SLO must rely on fallbacks or be set lower.",
      "wrong": "\"Our SLO is 99.9% uptime and 2-second latency.\" It ignores streaming, says nothing about whether answers are right, and a service can meet it while confidently answering wrong.",
      "follow": "The quality SLO is breaching but availability and latency are fine. Who gets paged?",
      "followAnswer": "Nobody at 3 a.m. - a sampled quality SLI over days is too slow and noisy to page on. It opens a high-priority ticket for the owning team, freezes non-urgent prompt and model releases while the budget is exhausted, and triggers the quality runbook: check recent manifests, the nightly golden run and the drift signals. If it is a safety failure rather than general quality, that is a separate, immediate alert with its own on-call path.",
      "builds": [
        "ev-07",
        "cl-10"
      ],
      "next": [
        "ops-24",
        "ops-18"
      ],
      "deeper": [
        "sre-book"
      ],
      "check": {
        "kind": "numbers",
        "q": "You sample 50 answers a day for a groundedness SLI with a 95% target. Why is alerting on each day's result a bad idea?",
        "options": [
          "50 answers a day is too many to score.",
          "At n = 50 the daily pass rate swings several points by chance, so alerts fire on noise; aggregate over a multi-day window.",
          "Groundedness cannot be an SLI.",
          "SLOs only apply to latency."
        ],
        "answer": 1,
        "why": "At 95% and n = 50 the standard error is about 3 points, so a day at 90% can be pure chance. Aggregating over several days, or sampling more, makes the quality SLI stable enough to act on."
      }
    },
    {
      "id": "ops-24",
      "q": "What goes into a runbook for an LLM incident, and how is on-call different from a normal service?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "llmops",
        "debugging",
        "security"
      ],
      "why": "Incident handling separates people who have run LLM systems from people who have demoed them. The panel wants incident types, the switches you can pull in minutes and how you handle evidence.",
      "quick": [
        "Types: outage, quality regression, safety or data leak, cost runaway, abuse.",
        "Pre-built switches: fallback model, read-only mode, tool flags, manifest rollback.",
        "Preserve traces before retention rotates or overwrites them.",
        "Safety and data incidents bring in security, legal and comms early.",
        "Name who decides reporting duties, such as CERT-In's six hours."
      ],
      "simple": "An LLM runbook covers failure modes a normal service runbook does not, and its main job is to make the first fifteen minutes mechanical.\n\nIt starts with classification, because each type has a different first move. A provider outage means failing over to a tested fallback model or degrading gracefully. A quality regression means checking the release manifest and recent changes, then rolling back the pointer that changed. A safety incident - harmful output, a data leak between users, a prompt injection that triggered a tool - means containment first: disable the affected tools or put the feature into read-only mode, then investigate. A cost runaway means per-tenant caps and killing the looping job. Abuse means rate limits and blocking keys.\n\nThe switches must exist before the incident: a flag per tool, a read-only mode, a fallback route, manifest rollback and a kill switch for the whole feature. Each is exercised in a game day, because an untested kill switch tends to fail exactly when it is needed.\n\nEvidence matters more than usual, because LLM failures rarely reproduce. Snapshot the relevant traces, prompts, retrieved documents and manifest IDs before retention jobs rotate them. Safety and data incidents bring in security, legal and communications early. In India, CERT-In's 2022 directions require specified cyber incidents to be reported within six hours of noticing them, so the runbook names who decides whether an incident is reportable. For example, a cross-tenant leak through a retrieval bug is a security incident, not a quality bug.",
      "points": [
        "Classify: outage, quality, safety or data, cost, abuse - each with a first move.",
        "Tested switches: per-tool flags, read-only mode, fallback, manifest rollback, kill switch.",
        "Preserve traces, prompts, retrieved documents and manifest IDs at once.",
        "Escalate safety and data incidents to security, legal and comms.",
        "A named owner for regulatory reporting, such as CERT-In's six-hour window.",
        "Blameless postmortem; failing cases go into the golden set."
      ],
      "say": "The runbook's job is to make the first fifteen minutes mechanical. It starts by classifying, because each type has a different first move. A provider outage means failing over to a tested fallback or degrading gracefully. A quality regression means checking the release manifest and rolling back whichever pointer changed. A safety incident - harmful output, a leak between users, an injection that triggered a tool - means containment first: disable the tool or go read-only, then investigate. A cost runaway means caps and killing the loop. Those switches must exist and be tested in game days beforehand. Evidence handling is different too, because LLM failures rarely reproduce, so I snapshot traces, prompts, retrieved documents and manifest IDs before retention rotates them. Safety and data incidents pull in security, legal and comms early, and in India someone owns the decision on CERT-In's six-hour reporting window.",
      "numbers": "CERT-In's April 2022 directions require specified cyber incidents to be reported within 6 hours of noticing them. The runbook should name who decides reportability, not leave it to whoever is on call.",
      "verified": "2026-10",
      "wrong": "\"We'd roll back and look at the logs.\" There may be no rollback for the failing piece, logs may not contain prompts or retrieved content, and a data leak handled as a quality bug can miss a legal deadline.",
      "follow": "An injected document caused your agent to email a customer list externally. What are your first three actions?",
      "followAnswer": "First, contain: disable the email tool and any other outbound tool for the feature, or switch it to read-only, and rotate any credentials the agent used. Second, preserve evidence: snapshot the traces, the injected document and the manifest before anything rotates. Third, escalate: security and legal decide on regulatory reporting and customer notification, because this is a data breach, not a quality bug. Only then do I quarantine the source document and work on the fix.",
      "builds": [
        "ops-06",
        "ops-22",
        "gr-02"
      ],
      "next": [
        "ops-23",
        "sd-21"
      ],
      "deeper": [
        "sre-book",
        "cert-in-2022"
      ],
      "check": {
        "kind": "judgement",
        "q": "Mid-shift, a user reports that the assistant showed them another customer's invoice. Which first move is best?",
        "options": [
          "Tweak the system prompt to forbid showing other customers' data.",
          "Contain by disabling the retrieval path or feature, preserve traces, and escalate to security as a potential breach.",
          "Wait for the nightly eval run to confirm it.",
          "Roll the model back to last month's version."
        ],
        "answer": 1,
        "why": "A cross-customer leak is a security incident: contain first, preserve evidence and escalate early so reporting decisions are made in time. A prompt tweak does not fix an access-control bug, and the model is rarely the cause of a retrieval permission failure."
      }
    },
    {
      "id": "ops-25",
      "q": "Your A/B test says the new prompt wins. What could make that result dishonest?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "llmops",
        "ml-basics"
      ],
      "why": "A/B tests are easy to run and easy to fool yourself with. The panel wants the specific traps, including the ones unique to LLM features, and how you would guard against each.",
      "quick": [
        "Peeking and stopping on a good day inflates false wins.",
        "Metric picked afterwards, or many metrics and segments scanned.",
        "Sample ratio mismatch means the split itself is broken.",
        "Arms leak through shared caches or conversations.",
        "Judge-based metrics can reward style rather than quality."
      ],
      "simple": "An A/B result is only honest if the experiment was designed before the data came in. The classic traps apply. Peeking - checking daily and stopping on the first significant day - greatly inflates false positives unless you use a sequential method built for it. Picking the metric afterwards, or scanning twenty segments until one is significant, finds noise. So you pre-register one primary metric, the minimum detectable effect and the sample size.\n\nThen check the plumbing. A sample ratio mismatch - a 50/50 split that comes out noticeably uneven at large traffic - means users are being dropped or misassigned somewhere, and the result cannot be trusted until that is explained. Randomise by user, not by request, and make sure the arms cannot leak: a shared semantic cache can serve arm B users answers generated by arm A, and a conversation started in A must not continue in B.\n\nLLM features add their own traps. Novelty effects fade, so run long enough for them to settle. If the metric comes from an LLM judge, it may prefer one arm's style - longer answers, say - rather than better answers, so calibrate it against human labels on a sample. Watch guardrail metrics too: a prompt that wins on resolution but costs 40% more tokens or raises escalations has not really won.\n\nFor example, detecting a 2-point lift from a 50% baseline at 80% power and 5% significance needs roughly 10,000 users per arm.",
      "points": [
        "Pre-register primary metric, minimum detectable effect and sample size; no peeking without sequential tests.",
        "Correct for multiple metrics and segments.",
        "Check sample ratio mismatch before reading any result.",
        "User-level randomisation; no leakage through caches or conversations.",
        "Calibrate judge-based metrics; wait out novelty; track cost and latency guardrails."
      ],
      "say": "Several things, and I check them before believing the win. First, design: were the primary metric and sample size fixed in advance? Peeking daily and stopping on a good day inflates false wins, and scanning many metrics or segments finds noise. Second, plumbing. I check for sample ratio mismatch - if a 50/50 split comes out noticeably uneven at scale, users are being dropped or misassigned and the result is void until explained. Randomisation must be by user, and the arms mustn't leak, for example through a shared semantic cache serving one arm's answers to the other. Third, the LLM-specific traps. Novelty effects fade, so the test runs long enough to settle. A judge metric can reward style, like longer answers, so I calibrate it against human labels. And I check the guardrails: a prompt that wins resolution but costs much more or raises escalations hasn't really won.",
      "numbers": "Sample size per arm is roughly (z_alpha/2 + z_beta)^2 x 2p(1 - p) / d^2. For p = 0.5, d = 0.02, 5% significance and 80% power: (1.96 + 0.84)^2 x 0.5 / 0.0004 = about 9,800 users per arm.",
      "wrong": "\"It was significant at p < 0.05, so we shipped.\" Without a fixed sample size, one primary metric and a sample-ratio check, that p-value may mean nothing - especially if someone looked at it every day.",
      "follow": "The test shows no significant difference. The team wants to ship anyway because the new prompt is cheaper. Is that reasonable?",
      "followAnswer": "It can be, if it is framed as a non-inferiority decision rather than 'no difference'. I'd look at the confidence interval: if it rules out a drop larger than the margin we agreed we can tolerate, shipping the cheaper prompt is sound. If the interval is wide enough to include a meaningful drop, the test was underpowered and 'no difference' only means 'we don't know'. Then we either run longer or ship behind a canary with close monitoring.",
      "builds": [
        "ev-08",
        "ml-25",
        "ops-16"
      ],
      "next": [
        "ops-15",
        "ev-09"
      ],
      "deeper": [
        "huyen-ai-engineering",
        "google-rules-ml"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A 50/50 A/B test of a new prompt ran on 200,000 users. Arm A got 101,900 users and arm B 98,100, and B wins on resolution rate. What do you do first?",
        "options": [
          "Ship B - the win is significant.",
          "Investigate the sample ratio mismatch - a 1,900-user imbalance at this scale is extremely unlikely by chance.",
          "Rerun with 100 users to confirm.",
          "Ignore it; small imbalances are normal."
        ],
        "answer": 1,
        "why": "The expected split is 100,000 each with a standard deviation of about 224 users, so a 1,900 gap is over 8 standard deviations - a broken assignment or logging path. Results from a mismatched split cannot be trusted until it is explained."
      },
      "try": {
        "title": "Simulate peeking and a sample ratio mismatch",
        "minutes": 20,
        "steps": [
          "Run the starter code: an A/A test where both arms have a true 50% success rate, 500 users per arm per day for 20 days.",
          "It tests the cumulative data each day and counts runs where any day reaches p < 0.05.",
          "Observe how often peeking declares a 'winner' with no real difference, then change the code to test only on day 20 and compare.",
          "Simulate a 50/50 split of 200,000 users 10,000 times and observe how rarely the imbalance exceeds 1,900 by chance.",
          "Write the rule for each trap that you would put in your experiment template."
        ],
        "code": "import numpy as np\nfrom scipy.stats import norm\n\nrng = np.random.default_rng(1)\n\ndef p_value(sa, sb, n):\n    p = (sa + sb) / (2 * n)\n    se = np.sqrt(p * (1 - p) * 2 / n)\n    return 2 * (1 - norm.cdf(abs(sa - sb) / n / se))\n\nhits = 0\nfor _ in range(1000):\n    a = rng.binomial(500, 0.5, 20).cumsum()\n    b = rng.binomial(500, 0.5, 20).cumsum()\n    n = 500 * np.arange(1, 21)\n    hits += any(p_value(a[i], b[i], n[i]) < 0.05 for i in range(20))\nprint(f\"peeking false-win rate: {hits / 1000:.0%}\")"
      }
    }
  ]
};
