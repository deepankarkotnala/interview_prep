/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["18-system-design"] = {
  "lede": "This topic decides more offers than any technical subject, and candidates prepare for it least. The design round is not testing whether you know the components - you do. It is testing whether you gather requirements before naming technology. The manager round is not testing what you built. It is testing whether you owned it. New to these rounds? The questions are ordered for a first read: High priority first - how to run a design round, the RAG chatbot, tenant isolation and the multi-agent design, then your project and incident stories and the HR questions every process asks - then Medium, then Low.",
  "grounding": "published interview processes + what these rounds structurally test",
  "evening": [
    "sd-01",
    "sd-03",
    "sd-05",
    "sd-07",
    "sd-09"
  ],
  "cards": [
    {
      "id": "sd-01",
      "q": "Design a GenAI assistant for our support team. You have 45 minutes.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "system-design",
        "process",
        "requirements"
      ],
      "why": "The open design prompt. Most candidates fail it in the first two minutes by naming technology.",
      "quick": [
        "Spend the first five minutes asking questions, not naming tools.",
        "Ask who uses it, volume, speed, data, access and success.",
        "Say your assumptions out loud and get them confirmed.",
        "Design from data flow to search, answers, safety, testing, running.",
        "Walk one request through, then name trade-offs at ten times scale."
      ],
      "simple": "This is an open design prompt, and most candidates fail it in the first two minutes by naming technology. The first five minutes should go on questions, because the answers change the whole design.\n\nThe biggest question is who uses the assistant. For example, support agents on a live call need fast answers mid-conversation, while customers typing directly need a stricter tone and tighter guardrails. Then you ask about volume, latency, the data it answers from, who may see what, the success metric and what is out of scope, and you state your assumptions out loud.\n\nOnly then do you design, in order: data flow, retrieval, generation, guardrails, evaluation and operations. You walk one request through end to end and name your trade-offs unprompted. When the interviewer pushes on a choice, defending it or changing it well both count.",
      "points": [
        "Five minutes of questions first: users, volume, latency, data, permissions, success metric, scope.",
        "State assumptions and get them confirmed.",
        "Design in order: data flow, retrieval, generation, guardrails, evaluation, operations.",
        "Walk one request end to end out loud.",
        "Name trade-offs unprompted, and what changes at 10× scale.",
        "Expect to be pushed. Defending or changing well are both good outcomes."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "The shape of a 45-minute design answer: questions first, confirm assumptions, design in a fixed order, walk one request, then name trade-offs.",
        "lanes": [
          {
            "label": "Ask questions",
            "note": "first 5 minutes",
            "accent": "warn"
          },
          {
            "label": "Confirm assumptions",
            "note": "say them out loud"
          },
          {
            "label": "Design in order",
            "note": "data, retrieval, generation...",
            "accent": "accent"
          },
          {
            "label": "Walk one request",
            "note": "end to end"
          },
          {
            "label": "Name trade-offs",
            "note": "and what breaks at 10x"
          }
        ],
        "caption": "**Questions before technology.** Users, volume, latency, data, permissions, success metric and scope decide the design - naming a vector database in minute one is how you design the wrong system."
      },
      "say": "I'd spend the first five minutes asking questions, not naming technology, because the answers change the whole design. The biggest one is who actually uses it. Support agents on a live call need fast answers mid-conversation, while customers typing directly need a stricter tone and much tighter guardrails, so that one answer reshapes latency, safety and risk. Then I'd ask about peak volume, the latency budget, where the data lives and how often it changes, who may see what, which business metric defines success, and what's out of scope. I'd say my assumptions out loud and get them confirmed, so we're designing the same system. Only then do I design, in order: data flow and indexing, retrieval, generation, guardrails, evaluation and operations. I walk one request through end to end, then name my trade-offs and what breaks at ten times the scale. Being pushed on a choice is the point, and defending it or changing it well both count.",
      "numbers": "Spend roughly the first 5 minutes of a 45-minute round on requirements. Skipping it is the most common way to design the wrong system confidently.",
      "wrong": "Opening with \"I'd use LangChain with a vector database.\" You have chosen technology before knowing the volume, the latency budget or the permission model. The first follow-up on scale or access control will show the choice had no basis.",
      "follow": "Now the same system for 10,000 concurrent users. What changes?",
      "followAnswer": "The architecture mostly stays; capacity and failure handling change. I estimate peak requests and tokens per minute, then check provider quota or buy provisioned throughput, and spread load across deployments or regions. I add caching for repeated questions, autoscaling on the retrieval tier, per-user rate limits, and a queue for ingestion. Then I load-test to find the real p95 and plan fallbacks for when the provider throttles us."
    },
    {
      "id": "sd-26",
      "q": "Design a RAG chatbot over internal company documents, end to end.",
      "round": [
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "system-design",
        "rag",
        "architecture",
        "access-control"
      ],
      "why": "The single most common GenAI design prompt. It checks that you can connect ingestion, permissions, retrieval, generation, evaluation and operations into one working system.",
      "quick": [
        "Build two parts, one keeps documents indexed, one answers.",
        "Store every document piece with its source, version and access list.",
        "Handle deletes, or withdrawn policies keep being quoted.",
        "Search only documents this user may open, keep the best few.",
        "Answer with sources, or say nothing was found."
      ],
      "simple": "A RAG chatbot over internal documents is two pipelines. One runs in the background and keeps an index of the documents up to date, and the other answers questions from that index.\n\nIn ingestion, connectors pull documents with their access lists, then the text is parsed, split into chunks of a few hundred tokens and embedded with its source, version and who can see it. Updates and deletes must flow through too, or withdrawn policies keep being quoted. The query pipeline identifies the user, rewrites a follow-up into a standalone question, runs keyword plus vector search filtered to documents this user may open, reranks, and answers only from the best few chunks with citations, or says it could not find it.\n\nThe key principle is that permissions are enforced in retrieval, never by asking the model. For example, a contractor should simply never receive a chunk from an HR-only policy.",
      "points": [
        "**Ingestion**: connectors → parse → chunk → embed → index, with access lists and version metadata on every chunk.",
        "Handle updates and deletes incrementally - a stale index quotes withdrawn policies.",
        "**Query**: identify user → rewrite with history → hybrid search with a permission pre-filter → rerank → cited answer.",
        "An explicit \"not found\" path instead of a guess.",
        "Evaluate retrieval and answers separately on a golden set of real questions.",
        "Trace every stage; watch p95 latency, cost per answer and thumbs-down rate."
      ],
      "diagram": {
        "alt": "Two pipelines meeting at the index: documents with their access lists are parsed, chunked and embedded into the index; a user question is rewritten, searched with a permission filter, reranked and answered with citations.",
        "rows": [
          [
            {
              "id": "src",
              "label": "Sources + access lists"
            },
            {
              "id": "user",
              "label": "User question",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "ing",
              "label": "Parse, chunk, embed",
              "note": "updates and deletes too"
            },
            {
              "id": "rw",
              "label": "Rewrite with chat history"
            }
          ],
          [
            {
              "id": "idx",
              "label": "Index: vectors, keywords, ACL metadata",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "ret",
              "label": "Hybrid search + permission filter",
              "accent": "warn"
            },
            {
              "id": "rr",
              "label": "Rerank to top 3-5"
            }
          ],
          [
            {
              "id": "gen",
              "label": "Answer with citations or \"not found\"",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "src",
            "to": "ing"
          },
          {
            "from": "ing",
            "to": "idx"
          },
          {
            "from": "user",
            "to": "rw"
          },
          {
            "from": "rw",
            "to": "idx",
            "label": "query"
          },
          {
            "from": "idx",
            "to": "ret"
          },
          {
            "from": "ret",
            "to": "rr"
          },
          {
            "from": "rr",
            "to": "gen"
          }
        ],
        "caption": "**Two pipelines, one index.** Ingestion keeps the index current - including deletes - and stores who may see each chunk. The query path filters by that permission inside the search, so the model never sees a document the user cannot open."
      },
      "say": "I'd build it as two pipelines: one keeps the index current, the other answers questions from it. Ingestion pulls documents through connectors along with their access lists, parses them, splits them into chunks of a few hundred tokens, and embeds each chunk with its source, version and who can see it. It has to handle updates and deletes incrementally, because a stale index keeps quoting withdrawn policies. The query side identifies the user, rewrites a follow-up into a standalone question, and runs keyword plus vector search with a permission pre-filter. A reranker keeps the best few chunks, and the model answers only from those, with citations, or says plainly that it couldn't find it. Permissions live in retrieval, never in the prompt. A contractor should simply never receive a chunk from an HR-only policy. Around both pipelines I'd put a golden set of real questions that scores retrieval and answers separately, plus tracing on every stage, watching p95 latency, cost per answer and thumbs-down rate.",
      "numbers": "A typical starting point: chunks of 300-800 tokens, retrieve 20-50 candidates, rerank to 3-5, and aim for the first token within 1-2 seconds. Tune each on your own eval set rather than copying these.",
      "wrong": "\"Embed the PDFs, put them in a vector database and call the LLM.\" That is a demo. It has no permission model, no update or delete path, no evaluation and no not-found behaviour - the four things that decide whether it reaches production.",
      "follow": "A user sees an answer quoting a document they are not allowed to open. Where did your design fail?",
      "followAnswer": "The permission filter was missing or stale somewhere. I would check three places. Was the access list captured at ingestion and re-synced when access changed? Was the filter applied inside retrieval on every search path, including keyword search and any answer cache? And did the user's identity come from the verified session? The fix goes in retrieval, plus a test that attempts exactly this access on every build."
    },
    {
      "id": "sd-07",
      "q": "Design a system where the model must never expose one customer's data to another.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "system-design",
        "multi-tenant",
        "security"
      ],
      "why": "A constraint-driven design question. It rewards defence in depth over a single clever idea.",
      "quick": [
        "Keep customers apart in code, never by trusting the model.",
        "Give each customer separate storage, or a forced customer filter.",
        "Take the customer's identity from their login, never the request.",
        "Every cache and log must be split by customer.",
        "Test cross-customer access on every build and keep an audit log."
      ],
      "simple": "The principle is that customers are kept apart by code and infrastructure, never by the model. The model has no idea who is asking and it can be argued with, so every control lives in code, and the bar is zero leaks, not a good average.\n\nEach tenant gets its own namespace where the engine supports it. Where small tenants share an index, a mandatory tenant filter runs server-side in a layer no feature team can bypass. The tenant identity comes from the authenticated session, never from a field the client can set.\n\nThe classic leak arrives later, through caching. For example, someone adds a cache to cut cost and keys it on the prompt alone, and now one customer's answer is served to another. So every cache key includes the tenant, and automated tests attempt cross-tenant reads on every build.",
      "points": [
        "Isolation in infrastructure, never in the prompt.",
        "Separate namespaces per tenant where the engine supports it; if shared, a server-side filter, ideally a pre-filter.",
        "Tenant identity from the authenticated session, injected centrally.",
        "Every cache key includes the tenant and user entitlements. This is the classic leak.",
        "Traces and eval data are tenant-scoped - they contain prompts.",
        "Cross-tenant access attempts as automated tests on every build.",
        "An audit log that can prove isolation held, not just assert it."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Layers where tenant isolation is enforced in code: identity from the session, storage separation, cache keys, traces, and cross-tenant tests.",
        "top": "request from tenant A",
        "bottom": "provably no cross-tenant read",
        "layers": [
          {
            "label": "Tenant from session",
            "note": "injected centrally, never a client field",
            "accent": "accent"
          },
          {
            "label": "Storage",
            "note": "namespace per tenant, or server-side pre-filter"
          },
          {
            "label": "Cache keys",
            "note": "tenant + entitlements - the classic leak",
            "accent": "bad"
          },
          {
            "label": "Traces and eval data",
            "note": "tenant-scoped: they hold prompts",
            "accent": "warn"
          },
          {
            "label": "Tests on every build",
            "note": "attempt cross-tenant reads, audit log"
          }
        ],
        "caption": "**Isolation lives in the infrastructure, never the prompt.** The leak usually arrives later, when someone adds a cache keyed on the prompt alone."
      },
      "say": "Isolation has to live in the infrastructure, never in the prompt, because the model doesn't know who's asking and it can be argued with. So each tenant gets its own namespace where the engine supports it. Where small tenants share an index, a mandatory tenant filter runs server-side, ideally as a pre-filter, in a layer no feature team can bypass. Tenant identity comes from the authenticated session and is injected centrally, never taken from a field the client can set. The classic leak arrives later, when someone adds a cache to save cost and keys it on the prompt alone. So every cache key includes the tenant, plus the user's entitlements where permissions differ inside a tenant. Traces and eval data are tenant-scoped too, since they're full of customer prompts. Then I make it provable. Automated tests attempt cross-tenant reads on every build, and an audit log shows isolation held. It's a binary control, so the bar is zero leaks, not a good average.",
      "numbers": "No number applies - this is a binary control. What you measure is that the cross-tenant test suite runs on every build and has never let a cross-tenant read through.",
      "wrong": "\"We add tenant_id to the metadata filter.\" Necessary and insufficient. It leaves caching, traces and where the filter is enforced unaddressed, and caching is where the leak usually is.",
      "follow": "Someone adds a response cache to cut costs. What review catches the problem?",
      "followAnswer": "Ideally nothing depends on a reviewer remembering. The shared cache library builds the key itself - tenant, user entitlements, prompt version, corpus version - so feature code cannot pass the raw question as the key. The cross-tenant test suite runs on every build: tenant A asks a question, tenant B asks the same one, and the build fails if B gets A's answer. A design-review checklist item for any new cache backs that up."
    },
    {
      "id": "sd-27",
      "q": "Design a multi-agent research assistant that writes reports.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "system-design",
        "agents",
        "multi-agent",
        "research"
      ],
      "why": "The standard agentic design prompt of 2025-26. It checks whether you add agents for a real reason, control cost and loops, and keep the report grounded in sources.",
      "quick": [
        "First check if one agent with search is enough.",
        "A planner splits the question into parts.",
        "Researchers work in parallel and return short quoted notes with links.",
        "A writer drafts from notes, a checker matches claims to sources.",
        "Cap steps, cost and time, since it uses far more text."
      ],
      "simple": "A multi-agent research assistant works like a small team. A planner splits the question into parts, a few researchers work on them in parallel, a writer assembles the report, and a checker makes sure every claim has a source. But first you check whether one agent with a search tool would do, because it often does.\n\nEach researcher returns short notes with the exact quoted passage and link rather than whole pages, so the planner's context stays small. The writer drafts only from those notes, and the checker sends gaps back for another round.\n\nControl matters most, because this is token-hungry. For example, Anthropic reported its multi-agent research system used roughly fifteen times the tokens of a normal chat. So you cap researchers, steps, tokens and time per report, and give researchers read-only tools, since fetched pages can carry prompt injection.",
      "points": [
        "Planner (supervisor) → parallel researchers → writer → citation checker.",
        "Researchers return compact notes with quoted passages and links, not raw pages.",
        "Hard budgets: number of researchers, steps, tokens, wall-clock time.",
        "Durable state so long runs can resume; stream progress to the user.",
        "Fetched pages are untrusted input - read-only tools, injection defences.",
        "Evaluate citation accuracy, coverage, cost and time per report."
      ],
      "diagram": {
        "alt": "A planner splits the question for parallel researchers, who return quoted notes to a writer; a checker verifies citations and sends gaps back to the planner.",
        "rows": [
          [
            {
              "id": "plan",
              "label": "Planner",
              "note": "sub-questions + outline",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "res",
              "label": "Researchers x N",
              "note": "in parallel, read-only tools"
            }
          ],
          [
            {
              "id": "wr",
              "label": "Writer",
              "note": "drafts only from notes"
            }
          ],
          [
            {
              "id": "chk",
              "label": "Citation checker",
              "note": "claim vs quoted passage",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "rep",
              "label": "Cited report",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "plan",
            "to": "res"
          },
          {
            "from": "res",
            "to": "wr",
            "label": "quoted notes"
          },
          {
            "from": "wr",
            "to": "chk"
          },
          {
            "from": "chk",
            "to": "rep"
          },
          {
            "from": "chk",
            "to": "plan",
            "label": "gaps, one round",
            "kind": "back"
          }
        ],
        "caption": "Researchers return **quotes and links, not pages**, so context stays small. Around it all sit **hard budgets** on researchers, steps, tokens and time - runs can cost about 15x a chat."
      },
      "say": "A planner splits the question, a few researchers work on the parts in parallel, a writer drafts, and a checker verifies every citation, all under hard budgets. Before building that, I'd check whether one agent with a search tool would do, because it often does. Multiple agents only earn their place when the research genuinely splits into parallel parts. Each researcher returns short notes with the exact quoted passage and link, not whole pages, so the planner's context stays small. The writer drafts only from those notes, and the checker matches each claim to its passage and sends gaps back for another round. Control is the senior part. Anthropic has reported its multi-agent research system using around fifteen times the tokens of a normal chat, so I cap researchers, steps, tokens and wall-clock time. Fetched pages can carry prompt injection, so researchers get read-only tools. Durable state lets long runs resume, and I'd measure citation accuracy, coverage, and cost and time per report.",
      "numbers": "Multi-agent research is token-hungry: Anthropic reported its multi-agent research system used roughly 15x the tokens of a normal chat interaction. Set a per-report token and time budget up front, and measure real cost per report on a test set.",
      "wrong": "Five agents - a 'researcher', a 'critic', a 'manager' - chatting freely with no budget. It loops, costs a fortune, loses context at every handoff, and nobody can tell which agent introduced the wrong fact.",
      "follow": "The report cites a source that does not say what the report claims. How do you stop that?",
      "followAnswer": "I make citation checking a step, not a hope. Researchers store the exact quoted passage with each note, not just a link. The writer may only cite notes, and a checker compares each claim with its passage and flags anything unsupported. Unsupported claims are removed or sent back for more research. And citation accuracy is a tracked metric on the test set, so a prompt or model change that worsens it is caught."
    },
    {
      "id": "sd-03",
      "q": "Tell me about a GenAI project you built.",
      "round": [
        "screening",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "story",
        "behavioural",
        "ownership"
      ],
      "why": "The most predictable question in the process, and the most commonly wasted.",
      "quick": [
        "Have a two-minute and a ten-minute version ready.",
        "State the business problem and what you built, briefly.",
        "Say plainly which part was yours.",
        "Share one hard decision and its trade-off.",
        "Give a result with a number and one regret."
      ],
      "simple": "This is the most predictable question in the process, and also the most commonly wasted. Have a two-minute version and a ten-minute version, and in a screening call it is the two-minute one.\n\nYou describe the problem in business terms, then what you built in a sentence or two. You state your own role plainly, because a panel cannot tell what \"we\" covers and will keep probing. Then you give one hard decision and its trade-off, the result with a number, and one thing you would do differently.\n\nThe differentiator is specificity. For example, \"we built a RAG chatbot for internal documents\" describes a thousand projects, while \"four hundred support agents, twelve thousand policy pages, and handling time cut from nine minutes to six\" describes yours. And be honest about your part, because claiming the whole system falls apart under one follow-up.",
      "points": [
        "Two-minute and ten-minute versions. Know which is wanted.",
        "Problem in business terms, then what you built in one or two sentences.",
        "State your specific role. An unexplained \"we\" invites probing.",
        "One hard decision and its trade-off.",
        "A result with a number.",
        "One thing you would do differently - it makes the whole story credible."
      ],
      "say": "The one I'd pick is a policy assistant for our internal support agents, who were losing a lot of time hunting through policy documents. It answers their questions from those documents, with citations. My part was retrieval and evaluation, and a colleague owned the interface, so that's where I can go deepest. The hardest call was retrieval versus putting whole documents into a long context window. We needed per-user document permissions, and retrieval let us enforce them at search time, which pasting everything in never could. The result was a clear drop in average handling time, measured before and after on the same queues, and that's the number the support lead cared about. If I did it again, I'd build the delete path in ingestion from day one, because leaving it out caused us trouble later. That's the two-minute version, and I'm happy to go deeper on any part.",
      "numbers": "Use your real numbers - users, documents, the metric before and after, and the timeframe. Vague scale reads as a project you observed.",
      "wrong": "A component tour: \"we used LangChain, Pinecone, GPT-4 and Streamlit.\" It answers what you installed, not what you did.",
      "follow": "What was the hardest part, and what did you get wrong?",
      "followAnswer": "Shape it with your own facts: the hardest part was [a specific technical problem], for example getting tables in scanned PDFs to retrieve correctly. What I got wrong was [a decision], for example building the eval set from questions engineers wrote, so we missed how real users phrase things. We fixed it by adding a weekly sample of real queries to the eval set, and that became the number we reported."
    },
    {
      "id": "sd-04",
      "q": "What went wrong on that project?",
      "round": [
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "story",
        "behavioural",
        "ownership",
        "failure"
      ],
      "why": "The question the whole manager round hinges on. A frictionless story is not believed.",
      "quick": [
        "Pick a real, specific technical failure that you owned.",
        "Say how you found out, even if a user told you.",
        "Cover the impact, the quick fix and the lasting fix.",
        "Avoid blaming others or hiding a boast.",
        "Best if it was poor judgement, not missing knowledge."
      ],
      "simple": "The whole manager round hinges on this question, because a frictionless story is simply not believed. So you need a real failure, and it has to be one you owned.\n\nThe shape is what went wrong, how you found out, the impact, what you did immediately, what you changed so it could not recur, and what it taught you. For example, your ingestion handled document updates but never deletes, so a withdrawn policy was quoted to support agents for three weeks until support spotted it. You pulled the stale content, then added tombstone handling and a nightly job that alerts on drift between source and index.\n\nAvoid blaming someone else or a humblebrag like \"we were too ambitious\". The version that lands hardest is a gap in judgement, not knowledge, because you knew how to build the delete path and decided it could wait.",
      "points": [
        "Real, specific, technical, owned by you.",
        "How you found out - including if it was a user rather than monitoring.",
        "Impact, immediate action, structural fix, lesson.",
        "Avoid blame, avoid humblebrags, avoid anything you would repeat.",
        "Strongest version: a judgement gap, not a knowledge gap."
      ],
      "say": "The biggest miss was mine: our ingestion handled document updates but never deletes. So a withdrawn policy kept being quoted to support agents for a few weeks, and it was support who spotted it, not our monitoring. I pulled the stale content out straight away. Then I fixed it properly with tombstone handling, where a deleted document is marked so it drops out of the index, plus a nightly job that compares document IDs in the source with the index and alerts on drift. After that we had no more stale-answer reports. The honest part is that I knew the delete path was missing and decided it could wait. So it was a gap in my judgement, not my knowledge, and that's the lesson I took. I now treat the unhappy paths of a pipeline as part of the first release, and what happens on delete is a standard question in my design reviews.",
      "numbers": "Include the duration and the impact. \"Three weeks, caught by support, zero reports after the fix\" is credible in a way that an unquantified story is not.",
      "wrong": "\"We didn't face major issues.\" It answers a different question and throws away the round's best opportunity to show ownership.",
      "follow": "How would you have caught that earlier?",
      "followAnswer": "With a reconciliation check from day one - a nightly job that compares document IDs in the source with those in the index and alerts on anything the source no longer has. Plus an eval case with a withdrawn document, asserting it is never cited. And in design review I now treat 'what happens when a document is deleted' as a required question for any ingestion pipeline, not an edge case."
    },
    {
      "id": "sd-21",
      "q": "Describe a production incident you owned end to end.",
      "round": [
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "behavioural",
        "incident",
        "ownership"
      ],
      "why": "Ownership is what separates a senior hire from a capable engineer. The structure of the answer reveals it.",
      "quick": [
        "Say honestly how you found out.",
        "Stop the damage first, roll back before digging in.",
        "Name the exact cause, not a vague category.",
        "Give how long it lasted and who was affected.",
        "End with the lasting fix and add the case to tests."
      ],
      "simple": "Ownership is what separates a senior hire from a capable engineer, and the structure of this answer reveals it. Keep it to about three minutes, covering how you found out, how you stopped the damage, what caused it, the impact, and what you changed.\n\nYou stop the damage before you dig into the cause, by rolling back, turning the feature off or switching to a fallback, because debugging while users are still affected is a classic mistake. Then you name the cause specifically. For example, a provider model update changed the output format and broke your response parser. You also say how long it lasted and how many users it hit.\n\nThe structural fix matters most, such as an alert on parse failures or a canary for provider model changes. For GenAI, you also add the failing case to the eval set, so it cannot quietly return.",
      "points": [
        "State detection honestly - and fix it if it was a user report.",
        "Triage before diagnosis: restore service, then investigate.",
        "Name the specific mechanism, not a vague category.",
        "Quantify duration and impact.",
        "Close with the structural fix - for GenAI, the eval-set addition."
      ],
      "say": "The one I'd tell is when a provider model update changed the output format and broke our response parser, so answers started failing. Honestly, users noticed before our monitoring did. My first move was to switch to a fallback and restore service, and only then dig into the cause, because debugging while users are still affected just makes the incident longer. I traced it to the specific format change, and I kept stakeholders updated throughout, so nobody heard about it from customers first. I also pinned down exactly how long it ran and how many users it hit, and both went into the write-up. The part I care about most is the structural fix. We added an alert on format and parse failures, a tested rollback path and a canary for provider model changes. And the failing case went into our eval set, so it can't quietly come back.",
      "numbers": "Quantify duration and users affected. An incident story without numbers sounds like a story rather than something you owned.",
      "wrong": "An incident where nothing was your fault and nothing changed afterwards. The follow-up asks what you changed and what your part was, and there is nothing to point to.",
      "follow": "What would have caught it an hour earlier?",
      "followAnswer": "An alert on a leading signal rather than on uptime. In the parser example, a spike in output-format or schema-validation failures would have fired within minutes, long before users noticed. So I now alert on error and retry rates, refusal rate, format failures and tokens per request. And provider model version changes go through a canary on a small share of traffic, so a changed model is caught before everyone gets it."
    },
    {
      "id": "sd-08",
      "q": "How do you handle disagreement with a colleague on a technical decision?",
      "round": [
        "manager",
        "hr"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "behavioural",
        "collaboration"
      ],
      "why": "A standard behavioural question. In GenAI it is usually asked because these decisions are unusually opinion-driven.",
      "quick": [
        "Turn opinions into evidence wherever you can.",
        "Agree the measure, data and pass mark before testing.",
        "For judgement calls, state both sides and let the owner decide.",
        "Share an example where you turned out to be wrong.",
        "Then commit fully and do not reopen it later."
      ],
      "simple": "In GenAI, technical disagreements are unusually opinion-driven. Whether a reranker is worth the latency or whether to fine-tune usually cannot be settled by argument, so a strong answer is about turning opinion into evidence.\n\nYou separate what is testable from what is a judgement call. Where it is testable, you agree the metric, the dataset and the threshold in advance, then run it, which turns a debate into an experiment and takes seniority out of it. Where it is a judgement call, you state both positions and the risk each guards against, and the owner decides.\n\nHave an example where you were wrong. For example, \"I argued against the reranker on latency grounds. We agreed a test, it added 180 milliseconds but lifted accuracy enough that I was clearly wrong, and we shipped it.\" Then commit properly, without reopening it a month later.",
      "points": [
        "Separate testable from judgement.",
        "Testable: agree the metric, dataset and threshold in advance, then run it.",
        "Judgement: state both positions and their risks, escalate to the owner, commit.",
        "Have an example where you were wrong. It is stronger than one you won.",
        "Commit properly - no relitigating it later."
      ],
      "say": "I try to turn the opinion into evidence, because most GenAI debates, like whether a reranker is worth its latency or whether we need fine-tuning, can't be settled by argument. So I separate what's testable from what's a judgement call. If it's testable, we agree the metric, the dataset and the threshold before anyone runs anything. That turns a debate into an experiment and takes seniority out of it. I once argued against adding a reranker on latency grounds. We agreed a test, and it did add latency, but it lifted answer accuracy enough that I was clearly wrong, so we shipped it. If it's a judgement call, I lay out both positions and the risk each one guards against, and the owner decides. When the evidence is close, I lean towards whichever option is cheaper to reverse. Either way I commit properly, which means not reopening the argument a month later.",
      "numbers": "No number applies, but the answer is stronger if the example carries one - what the test measured and what it showed.",
      "wrong": "\"I explain my reasoning and usually they agree.\" The follow-up asks about the time they did not agree, and the answer has no mechanism for that case.",
      "follow": "What if the test is inconclusive and a decision is needed this week?",
      "followAnswer": "Then I pick the option that is cheaper to reverse, and say that is why. If the numbers do not separate the two, the risk each one carries decides it. I write down the decision, the reason, and the metric or date that would make us revisit it. If we still disagree, the owner makes the call, and I back it fully rather than reopening it later."
    },
    {
      "id": "sd-09",
      "q": "Why are you leaving, and what are you looking for?",
      "round": [
        "hr",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "behavioural",
        "hr",
        "fitment"
      ],
      "why": "It looks like a formality. Inconsistency or bitterness here undoes a strong technical loop.",
      "quick": [
        "Talk about what you want next, not what is wrong.",
        "Never criticise your employer, manager or team.",
        "Name the problem, scale and ownership you want.",
        "Keep it consistent with every other round.",
        "Keep it to about thirty seconds."
      ],
      "simple": "This question looks like a formality, but inconsistency or bitterness here can undo a strong technical loop. So keep the answer short, forward-looking and consistent with everything else you have said.\n\nThe reason should be about what you want next, not what is wrong where you are. For example, \"I have taken our RAG platform as far as the current scope allows, and I want to work on systems at a larger scale\" is a complete answer. Never criticise your current employer, manager or team, because the panel imagines how you will describe them in two years.\n\nThen say what you are looking for, specific enough to check against the role, such as owning evaluation and the production side. Keep it to about thirty seconds, because the only outcomes here are neutral or bad.",
      "points": [
        "Forward-looking: what you want, not what is wrong.",
        "Never criticise the current employer, manager or team.",
        "Be specific about the problem, scale and ownership you want.",
        "Consistent with your story in every other round.",
        "Thirty seconds. There is no upside in a long answer here."
      ],
      "say": "It's mostly about what I want next, not anything wrong where I am. I've taken our retrieval platform about as far as the current scope allows, it's been a good run, and I'd happily work with that team again. What I'm looking for now is bigger scale and ownership of the whole system. I'd like to own evaluation and the production side, not just build features that someone else runs. I also want a role where GenAI is the product itself rather than an internal tool, because that's where these systems get pushed hardest. That's what caught my eye here, since this role seems to offer exactly that scope. So it's a move towards a bigger problem, not away from my team.",
      "numbers": "No number applies. Thirty seconds is the target.",
      "wrong": "Anything critical about the current employer, and anything vague like \"looking for growth\". Criticism makes the panel wonder how you will describe them later; vagueness gives them nothing to match against the role.",
      "follow": "What would make you turn down an offer?",
      "followAnswer": "Mainly a mismatch in the work. If the role turned out to be mostly maintenance, with no path to production GenAI work or no way to measure quality, that would matter more to me than a small difference in pay. Beyond that, the usual - a level or package well below the scope, or a team setup different from what we discussed. I would raise those openly before deciding."
    },
    {
      "id": "sd-11",
      "q": "What are your salary expectations?",
      "round": [
        "hr",
        "screening"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "behavioural",
        "hr",
        "compensation"
      ],
      "why": "Whether you can hold a position without becoming difficult. It is asked early precisely to anchor you.",
      "quick": [
        "Ask for the role's approved pay range first.",
        "Check what total pay includes, like bonus and shares.",
        "If pushed, give a researched range you would truly accept.",
        "Base it on the role, not your current salary.",
        "Keep detailed pay talks with the recruiter."
      ],
      "simple": "This question is often asked early to anchor you to a number, and it tests whether you can hold a position without becoming difficult. So you first ask for the role's approved range and what total compensation includes, such as base, bonus and equity. For example, a lower base with a strong bonus or equity can easily add up to more than a higher base on its own.\n\nIf you must give a figure, give a range you have researched for that role, level and location, with a bottom you would genuinely accept. Anchor it to the role's scope rather than your current pay, though if you share current pay, state it accurately, since norms and laws differ by market.\n\nKeep the tone factual, and leave the detailed negotiation to the recruiter rather than a technical round.",
      "points": [
        "Ask for the role's approved range and what total compensation includes.",
        "If pressed, give a researched range whose lower end you would accept.",
        "Separate role expectations from current salary history; local rules vary.",
        "Ground negotiation in level, scope, location and market evidence.",
        "Keep detailed compensation discussion with the recruiter/hiring contact."
      ],
      "say": "I'd like to understand the approved range for the role first, and what total compensation includes, because base, bonus and equity can make two offers look very different. A lower base with a strong bonus or equity can easily add up to more than a higher base on its own. If you need a figure from me now, I can give a range I've researched for this role, level and location, and the bottom of it will be a number I'd genuinely accept. I'd rather anchor to the scope of the role than to my current salary, though I'll share that accurately if your process needs it. Pay matters, but so do level, scope, flexibility and growth, and I weigh them together. When we get to an offer, I'm glad to go through the detail with the recruiter.",
      "numbers": "Use the market for the actual role, level and location rather than a universal percentage increase. Norms differ: some markets routinely ask for current pay and may verify it with payslips, while others restrict salary-history questions by law. If you share current pay, state it accurately, and anchor your expectation to the role.",
      "wrong": "Giving a precise minimum before knowing the level and package, or inventing market data. A defensible range is stronger than an arbitrary anchor.",
      "follow": "That is above our band for this level. How do you respond?",
      "followAnswer": "I would ask what the band is and which level it maps to. If the scope we discussed fits a higher level, I would make that case from the specific responsibilities. If the band is genuinely fixed, I would look at the whole package - joining bonus, equity, review timing - and decide honestly. I would not pretend a number works if it does not; better to say so clearly now."
    },
    {
      "id": "sd-12",
      "q": "What is your notice period, and when can you join?",
      "round": [
        "hr"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "behavioural",
        "hr",
        "logistics"
      ],
      "why": "A logistics question with one trap: overpromising a date you cannot meet.",
      "quick": [
        "Quote your contract notice period and a realistic start date.",
        "Never promise early release your manager has not approved.",
        "Raise visa, moving or handover issues early.",
        "Say what you can explore if they have a deadline.",
        "Tell the recruiter at once if the date changes."
      ],
      "simple": "This is a logistics question with one trap, which is overpromising a date you cannot meet. So you base the answer on your contract, giving the formal notice period, any flexibility that is actually confirmed, and the earliest start date you can responsibly commit to.\n\nDo not promise an early release or buyout your manager has not approved, because it is usually at the employer's discretion, and if it falls through the team is planning around a date you cannot meet. For example, you might say your contract states three months, unused leave could shorten it by two weeks if your manager agrees, and you will confirm in writing within a week.\n\nFlag any visa, relocation or handover constraint early. And if the date changes later, tell the recruiter immediately, because a late surprise damages trust more than a longer date would have.",
      "points": [
        "Quote the formal contract and a realistic earliest start date.",
        "Do not promise unapproved buyout or early release.",
        "Disclose material visa, relocation or handover constraints early.",
        "If the employer has a hard deadline, explain what is and is not negotiable.",
        "Update the recruiter as soon as the date changes."
      ],
      "say": "I'll give you the notice period exactly as my contract states it, and the earliest start date I can genuinely commit to, not an optimistic guess. I won't promise an early release or buyout my manager hasn't approved, because if it falls through, you'd be planning around a date I can't meet. If something like unused leave or a buyout policy could shorten it, I'll tell you plainly what's confirmed in writing and what still needs approval. I'll also flag any visa, relocation or handover constraint now, so your team can plan around it instead of finding out late. If you have a hard deadline, tell me, and I'll be clear about what's negotiable on my side and what isn't. And if the date moves once I resign or agree the handover, I'll update the recruiter straight away rather than the week before joining.",
      "numbers": "Use your actual contract dates. Notice periods range from a couple of weeks to three months or more depending on country, employer and seniority, and early release or buyout is usually at the employer's discretion - so do not promise it until it is confirmed in writing.",
      "wrong": "Promising a start date that depends on an unconfirmed release, buyout or visa step. A realistic date is more valuable than an optimistic one you later renegotiate.",
      "follow": "We need someone in four weeks. Does that rule you out?",
      "followAnswer": "Not necessarily, but I will not promise it blindly. My contract says [your notice period]. I can ask my employer about early release this week and confirm by [date]. If it is not possible, I would ask whether a start on [realistic date] works, perhaps with some onboarding reading done beforehand. I would rather give you a date I can keep than one I have to renegotiate."
    },
    {
      "id": "sd-10",
      "q": "Do you have questions for us?",
      "round": [
        "hr",
        "manager",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "behavioural",
        "hr",
        "closing"
      ],
      "why": "Almost always asked, almost always wasted, and it is the one part of the process you fully control.",
      "quick": [
        "Ask about three questions, about the work, not perks.",
        "Ask how they measure whether their AI features work.",
        "Ask what is live versus still being tried out.",
        "Ask who decides when the model is not good enough.",
        "Ask what success looks like, and really listen."
      ],
      "simple": "This question is almost always asked and almost always wasted, yet it is the one part of the process you fully control. Bring three questions about the work, not the perks, because more reads as an interrogation and fewer as disinterest.\n\nThe best ones reveal how the team really operates. Ask how they measure whether a GenAI feature is working, which shows whether they have real evaluation or mostly impressions. Ask what is in production compared with what is still in pilot, which tells you what the job actually is. And ask who decides when the model is not good enough, which shows how ownership works.\n\nThen actually listen. For example, if the answer is that people try it and it seems fine, you have learned something important, because you are also deciding whether you would do your best work there.",
      "points": [
        "How do you measure whether a GenAI feature works? Reveals evaluation maturity.",
        "What is in production versus in pilot? Reveals what the job actually is.",
        "Who decides when the model is not good enough? Reveals ownership.",
        "What does success look like at ninety days and at a year?",
        "Nothing answerable from the careers page. No compensation in a technical round.",
        "Listen to the answers - you are also deciding."
      ],
      "say": "Yes, three, and they're all about the work rather than the perks. The first is how you measure whether a GenAI feature is actually working, because that tells me whether there's real evaluation here or mostly impressions. The second is what's in production today compared with what's still in pilot. That ratio tells me what this job really looks like day to day. The third is who makes the call when a model isn't good enough for a use case, because it shows me how ownership works on the team. I'll listen closely to the answers, since I want to be sure this is a place where I'd do my best work.",
      "numbers": "Three questions is right. More reads as interrogation, fewer as disinterest.",
      "wrong": "\"No, I think you have covered everything.\" It reads as disengagement, and it discards the only part of the process you fully control.",
      "follow": "We don't really measure quality yet. Does that put you off?",
      "followAnswer": "Not at all - it is a common stage, and it is work I would enjoy. What I would want to know is that there is support to build it: time to create a small golden set from real traffic, and agreement on one or two metrics the business cares about. If that support is there, setting up evaluation is one of the most useful things I could do in my first ninety days."
    },
    {
      "id": "sd-28",
      "q": "Design an LLM gateway for a company - routing, rate limits, keys and logging.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "system-design",
        "gateway",
        "llmops",
        "cost",
        "security"
      ],
      "why": "Platform teams now build or buy one. It checks whether you can put central control - identity, quotas, cost, fallbacks and logging - in front of many teams and many model providers.",
      "quick": [
        "One company endpoint every team calls instead of providers.",
        "It alone holds the provider keys and checks callers.",
        "It sets request and spending limits for each team.",
        "Simple names like fast map to real models, with backups.",
        "Log team, model, cost and speed, and consider buying one."
      ],
      "simple": "An LLM gateway is one internal endpoint every team calls instead of calling model providers directly. Without it, every team holds its own provider keys, nobody knows who is spending what, and switching provider means changing twenty codebases.\n\nThe real provider keys live only in the gateway, and teams sign in with company identity. Each team gets rate limits and a token budget, usually through a token bucket, an allowance that refills over time so short bursts are fine, and over the limit it returns HTTP 429 with a retry time. For example, aliases like \"fast\" or \"smart\" map to real models, so the platform team can swap models without app changes, and retries and fallbacks live here too.\n\nEvery request logs team, model, tokens, latency and cost. It should add only a few milliseconds, and it is worth considering buying before building.",
      "points": [
        "One internal endpoint; provider keys only in the gateway.",
        "Per-team rate limits and token budgets (token bucket); 429 with a retry time.",
        "Model aliases and routing, retries, fallback provider or region, circuit breaker.",
        "Usage log per request: team, model, tokens, latency, cost. Bodies only with redaction and retention.",
        "Optional central guardrails: PII redaction, content filters, an approved-model list.",
        "Stateless and horizontally scaled - and consider buying before building."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "An LLM gateway between team apps and model providers, with layers for identity, quotas, routing and usage logging.",
        "top": "every team's app",
        "bottom": "model providers",
        "layers": [
          {
            "label": "Identity",
            "note": "company sign-in; provider keys stay here",
            "accent": "accent"
          },
          {
            "label": "Quotas and rate limits",
            "note": "token bucket per team, 429 + retry",
            "accent": "warn"
          },
          {
            "label": "Routing",
            "note": "aliases, fallback, circuit breaker"
          },
          {
            "label": "Usage log",
            "note": "team, model, tokens, latency, cost"
          },
          {
            "label": "Optional guardrails",
            "note": "PII redaction, approved models",
            "accent": "muted"
          }
        ],
        "caption": "**One endpoint, one place** for keys, budgets and cost. It sits on every request, so keep it thin - a few milliseconds - and **consider buying** before building."
      },
      "say": "It's one internal endpoint every team calls instead of hitting model providers directly, so keys, cost and policy are managed in one place. Without it, every team holds its own provider keys, nobody knows who's spending what, and switching provider means touching many codebases. So the real keys live only in the gateway's secret store, and teams authenticate with normal company identity. The gateway enforces per-team rate limits and token budgets, usually with a token bucket. Each team gets an allowance that refills over time, so short bursts are fine, and past the limit it returns a 429 with a retry time. The counters sit in a shared store like Redis, so every replica sees the same numbers. It maps aliases like fast or smart to real models, with retries, a fallback provider or region, and a circuit breaker. Every request logs team, model, tokens, latency and cost. It should add only a few milliseconds, and I'd seriously consider buying before building.",
      "numbers": "The gateway should add only a few milliseconds per request - measure it. Rate-limit counters usually live in a fast shared store such as Redis, so every gateway replica sees the same counts.",
      "wrong": "\"Each team gets its own provider key and we check the bill monthly.\" No attribution, no limits, keys scattered everywhere, and a provider change touches every codebase.",
      "follow": "One team's batch job is using all the quota and chat users are getting 429s. What do you change?",
      "followAnswer": "I separate the traffic classes. Interactive chat gets a reserved share of the provider quota, and batch work gets a lower-priority lane with its own token limit. The batch job goes through a queue that drains at a controlled rate, or moves to the provider's batch API, which is usually cheaper anyway. Per-team budgets then stop one team starving everyone else again."
    },
    {
      "id": "sd-17",
      "q": "Design an agent that files expense reports end to end.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "design",
        "agents",
        "workflow"
      ],
      "why": "A bounded agentic task where the right answer is mostly workflow with narrow agentic steps.",
      "quick": [
        "This is mostly fixed steps, not a free-roaming agent.",
        "Read the receipt, ask the user about unclear fields.",
        "Pick categories from a fixed list, check policy in code.",
        "Stop duplicate filings with a unique id and matching checks.",
        "Show what will be filed, confirm big amounts."
      ],
      "simple": "The first decision to say out loud is that filing expense reports is mostly a workflow, not an open-ended agent. The steps are known, from extracting the receipt to categorising it, checking policy, submitting and tracking. Only a few points need model judgement.\n\nExtraction uses a vision model with a confidence score per field, and the user confirms anything uncertain. Categories come from a fixed list, and the policy check is plain code, because rules must be testable and auditable. Submission carries an idempotency key so a retry cannot file the same expense twice. For example, a re-photographed receipt has a different file hash, so you also check merchant, date and amount for duplicates.\n\nThe agent earns its place on the unhappy paths, like a rejected claim or a missing field. And the user sees exactly what will be filed before it is submitted.",
      "points": [
        "Mostly workflow; agentic only on the unhappy paths.",
        "Categorise into a fixed enum, not free text.",
        "Policy limits are deterministic code, never model judgement.",
        "Idempotency key per filing, plus duplicate detection on extracted fields.",
        "Show the user what will be submitted before submitting."
      ],
      "diagram": {
        "alt": "Expense filing as a fixed workflow: extract, categorise, policy check in code, user confirms, then an idempotent submit; only rejections and missing fields go to the agent.",
        "rows": [
          [
            {
              "id": "ex",
              "label": "Extract receipt",
              "note": "vision model, per-field confidence"
            }
          ],
          [
            {
              "id": "cat",
              "label": "Categorise",
              "note": "fixed enum, not free text"
            }
          ],
          [
            {
              "id": "pol",
              "label": "Policy check",
              "note": "deterministic code",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "conf",
              "label": "User sees and confirms",
              "note": "required above threshold"
            }
          ],
          [
            {
              "id": "sub",
              "label": "Submit",
              "note": "idempotency key + duplicate check",
              "accent": "accent"
            },
            {
              "id": "ag",
              "label": "Agent",
              "note": "unhappy paths only",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "ex",
            "to": "cat"
          },
          {
            "from": "cat",
            "to": "pol"
          },
          {
            "from": "pol",
            "to": "conf"
          },
          {
            "from": "conf",
            "to": "sub"
          },
          {
            "from": "conf",
            "to": "ag",
            "label": "rejected, missing"
          }
        ],
        "caption": "**Mostly a workflow, agentic only on the unhappy paths.** Rules live in code, and a retry or a re-photographed receipt must never file the same expense twice."
      },
      "say": "This is mostly a workflow, not an open-ended agent, because the steps are known: extract the receipt, categorise it, check policy, submit. Extraction uses a vision model with a confidence score per field, and the user confirms anything uncertain. Categories come from a fixed list, not free text, and policy limits are plain code, because rules have to be testable and auditable rather than left to a model's judgement. Submission carries an idempotency key, a unique id per filing, so a retry can't file the same expense twice. That alone isn't enough. Photograph the same receipt twice and you get a different file hash, so I also check merchant, date and amount for duplicates. The agent earns its place only on the unhappy paths, like a rejected claim or a missing field. And before anything goes in, the user sees exactly what will be filed, with explicit confirmation above a value threshold agreed with finance.",
      "numbers": "Use an idempotency key per filing, plus a duplicate check on merchant, date and amount - a re-photographed receipt has a different file hash. Require explicit confirmation above a value threshold set with finance.",
      "wrong": "Building it as an open-ended agent because the brief said agent. Most of this is a known sequence, and an agent makes it slower, costlier and harder to audit.",
      "follow": "The agent misreads an amount as 5,000 instead of 500. Where does that get caught?",
      "followAnswer": "It gets caught by deterministic checks before submission, not by trusting the model. The extraction step reports a confidence score per field, so an uncertain amount is shown to the user for confirmation. Code also cross-checks the amount against other fields on the receipt, such as line items, tax and the total, and against what is typical for that category and merchant. A 5,000 claim would also cross the policy limit and the confirmation threshold agreed with finance, so the user sees it explicitly before anything is filed."
    },
    {
      "id": "sd-16",
      "q": "Design a code assistant for an internal 500-engineer codebase.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "design",
        "code",
        "retrieval"
      ],
      "why": "Repo-scale retrieval with hard latency and IP constraints. Different from document RAG in instructive ways.",
      "quick": [
        "Split code into whole functions and classes.",
        "Match exact names too, since developers search for them.",
        "Also pull in code that calls or is called by it.",
        "Update the index on every merge, stale code misleads.",
        "Answer within a second, keep code private, respect repo access."
      ],
      "simple": "A code assistant for a large codebase is a retrieval problem, but code search differs from document search. You chunk by syntax, parsing the code so each chunk is a whole function or class with its signature and imports.\n\nYou use hybrid search, because developers search for exact names. For example, someone pastes an error string or a config key, and keyword search finds it straight away where vector search struggles. When you retrieve a function you also pull its callers and callees from the code graph, which often beats adding more similar-looking chunks. And you re-index changed files on every merge, because a nightly rebuild is already stale in an active monorepo.\n\nChat answers should start streaming within about a second, or developers stop using it. Source code is IP, so you use a self-hosted or no-training endpoint and filter by repository access before anything reaches the model.",
      "points": [
        "Chunk on AST boundaries - functions and classes, with imports.",
        "Hybrid search is close to essential: developers search exact identifiers.",
        "Expand along the call graph, not just semantic neighbours.",
        "Incremental reindex on merge - stale code answers are harmful.",
        "Streaming within about a second in the IDE, and source code is IP."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Document RAG compared with code RAG across chunking, search, expansion, freshness and latency.",
        "aspects": [
          "Chunk by",
          "Search",
          "Expand with",
          "Refresh",
          "Answer speed"
        ],
        "columns": [
          {
            "label": "Document RAG",
            "note": "the usual defaults",
            "cells": [
              "A few hundred tokens",
              "Vector, often hybrid",
              "More similar chunks",
              "Incremental sync",
              "First token 1-2 s"
            ]
          },
          {
            "label": "Code assistant",
            "note": "what changes",
            "accent": "accent",
            "cells": [
              "Whole function or class",
              "Hybrid is essential: exact names",
              "Callers and callees",
              "Reindex on every merge",
              "About 1 s; completions faster"
            ]
          }
        ],
        "caption": "Developers search **exact identifiers** and code has **explicit links**, so chunk by syntax, keep keyword search and walk the call graph. Source code is IP too."
      },
      "say": "Code needs different retrieval from document RAG, so once I've confirmed scope, say question answering inside the IDE, I'd change three things. Chunking follows syntax. I parse the code so each chunk is a whole function or class with its signature and imports. Search has to be hybrid, because developers look for exact identifiers that vector search handles poorly. Someone pastes an error string or a config key, and keyword search finds it straight away. And when I retrieve a function, I also pull its callers and callees from the call graph, which usually beats adding more similar-looking chunks. The index updates changed files on every merge, because a nightly rebuild is already stale in an active monorepo, and a stale answer about deleted code is worse than none. Chat answers should start streaming within about a second. Source code is IP, so I'd use a self-hosted or no-training endpoint and filter results by repository access.",
      "numbers": "Target first tokens within about a second for chat and a few hundred milliseconds for inline completion. Reindex incrementally on merge - a nightly rebuild is already stale for an active monorepo.",
      "wrong": "Applying a document RAG design unchanged. Character chunking splits functions, and pure dense retrieval fails on the identifier searches developers actually make.",
      "follow": "A developer asks why a function exists. Does your retrieval find the answer?",
      "followAnswer": "Usually not from the code alone, because code shows what a function does, not why it exists. The why lives in commit messages, pull request descriptions, linked tickets, design docs and code comments. So I index those as well and link them to the code, for example by running git blame on the function to find the commits and pull requests that introduced or changed it, then retrieving their descriptions. The answer should cite those sources, and say plainly when no rationale was recorded instead of inventing one."
    },
    {
      "id": "sd-14",
      "q": "Design a document intelligence platform for an insurance company.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "design",
        "insurance",
        "ingestion"
      ],
      "why": "An ingestion-heavy design in a regulated vertical. The messy input is the problem, not the model.",
      "quick": [
        "The hard part is reading messy scans, not the AI.",
        "Sort each document by type, since type decides the fields.",
        "Give each field its own confidence score.",
        "Check totals and policy numbers in code.",
        "Send unsure fields to a person, track hands-free share."
      ],
      "simple": "For a document intelligence platform in insurance, the hard part is reading messy scanned documents reliably, not the AI model. The flow is intake, classify, extract, validate, route and review, and classification matters because the document type decides which fields you pull.\n\nFor example, scanned hospital bills are often skewed phone photos, sometimes handwritten and in mixed scripts. So you use layout-aware OCR, a vision model for the fields OCR mangles, and a confidence score per field rather than per document, because one bad field can hide inside a confident-looking page. Validation runs in code, checking that totals add up and policy numbers exist.\n\nAnything uncertain goes to a reviewer with the field highlighted on the source page. The business metric is the straight-through rate at a required precision, with a threshold that starts conservative and rises only as precision justifies.",
      "points": [
        "Extraction quality dominates - OCR and layout, not the LLM.",
        "Confidence per field, not per document.",
        "Validate arithmetically in code; low confidence routes to review.",
        "Link every field to a bounding box for fast human verification.",
        "The business metric is straight-through rate at a precision bar."
      ],
      "diagram": {
        "alt": "Insurance documents flow through intake, classify, extract and validate, then route by confidence either straight through or to a human reviewer.",
        "rows": [
          [
            {
              "id": "in",
              "label": "Intake",
              "note": "normalise, capture provenance"
            }
          ],
          [
            {
              "id": "cl",
              "label": "Classify",
              "note": "type decides the schema"
            }
          ],
          [
            {
              "id": "ex",
              "label": "Extract",
              "note": "layout OCR + vision, per field",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "va",
              "label": "Validate in code",
              "note": "totals add up, policy exists"
            }
          ],
          [
            {
              "id": "st",
              "label": "Straight through",
              "note": "confident and complete",
              "accent": "accent"
            },
            {
              "id": "rv",
              "label": "Human review",
              "note": "field boxed on source page",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "in",
            "to": "cl"
          },
          {
            "from": "cl",
            "to": "ex"
          },
          {
            "from": "ex",
            "to": "va"
          },
          {
            "from": "va",
            "to": "st",
            "label": "high confidence"
          },
          {
            "from": "va",
            "to": "rv",
            "label": "below threshold"
          }
        ],
        "caption": "The weight sits at the front: **reading messy scans**, not the LLM. Score confidence **per field**, and measure the straight-through rate at the required precision."
      },
      "say": "The hard part is reading messy documents reliably, not the language model. The flow is intake, classify, extract, validate, route, and classification matters because the document type decides which fields we pull. Scanned hospital bills are often skewed phone photos, sometimes handwritten, sometimes in mixed scripts. So I'd use layout-aware OCR, a vision model for the fields OCR mangles, and a confidence score per field rather than per document, because one bad field can hide inside a confident-looking page. Validation runs in code, checking that totals add up and policy numbers exist. Anything below threshold goes to a reviewer with the field highlighted on the source page, so they can verify it without rereading the whole document. Health data stays in-region, and I'd audit which model version extracted each field. The business metric is straight-through rate at a required precision, and I'd start that threshold conservative and raise it only as measured precision justifies.",
      "numbers": "Report confidence per field rather than per document. Set the straight-through threshold with the business - start conservative and raise it as measured precision justifies.",
      "wrong": "Designing around the LLM and treating ingestion as a preprocessing detail. On scanned documents, extraction is where the project succeeds or fails.",
      "follow": "Ten percent of bills are handwritten. What does that do to your design?",
      "followAnswer": "It makes handwriting a separate path rather than a lower-accuracy version of the main one. Classification flags handwritten pages, which go to a model suited to handwriting, and I expect field confidence to be lower, so more of them go to human review. I measure accuracy and straight-through rate for that slice separately, so it does not hide inside the overall average. The review interface with field highlighting matters most here, and reviewer corrections become labelled data for improving extraction over time."
    },
    {
      "id": "sd-24",
      "q": "Design a multimodal support assistant that accepts text, screenshots and voice.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "system-design",
        "multimodal",
        "voice",
        "vision",
        "rag"
      ],
      "why": "Multimodal and voice experiences are now common extensions of enterprise and consumer GenAI systems.",
      "quick": [
        "Clean and check each input type before the model sees it.",
        "Keep how sure the speech or image reading was.",
        "Turn everything into one request with the same access rules.",
        "Confirm risky actions when a voice request is unclear.",
        "Test each input type and mixes, and log the original media."
      ],
      "simple": "A multimodal support assistant accepts text, screenshots and voice, and each fails in its own way. So the key idea is to validate and normalise every input before the model reasons over it. Screenshots are checked, then passed to a vision model or OCR, and voice goes through speech recognition, keeping its confidence score instead of pretending the transcript is perfect.\n\nAll of these become one request object carrying the original evidence, the extracted text and the user's identity and permissions, so retrieval applies the same access control whatever came in. Confidence matters most when the assistant can act. For example, if a noisy voice note seems to say \"cancel my order\", a low-confidence transcript gets a confirmation question, not a cancellation.\n\nYou evaluate each modality and mixed cases separately, including where OCR or speech recognition gets it wrong, and logging has to keep the original media, not just the text.",
      "points": [
        "Validate and normalise each modality before reasoning.",
        "Preserve OCR/speech confidence and original evidence.",
        "Apply the same identity and retrieval permissions to every modality.",
        "Confirm sensitive actions when speech/vision input is uncertain.",
        "Evaluate mixed-modality failures and govern original media in logs/retention."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Text, screenshots and voice are validated, converted with confidence kept, merged into one request object, retrieved with permissions, and gated before sensitive actions.",
        "top": "text, screenshot or voice",
        "bottom": "answer or confirmed action",
        "layers": [
          {
            "label": "Validate each input",
            "note": "safety, file type, size, sensitive content"
          },
          {
            "label": "Convert, keep confidence",
            "note": "OCR, vision, speech-to-text + language"
          },
          {
            "label": "One request object",
            "note": "evidence, text, identity, permissions",
            "accent": "accent"
          },
          {
            "label": "Permissioned retrieval",
            "note": "same access control for every input"
          },
          {
            "label": "Confidence gate",
            "note": "uncertain transcript? ask first",
            "accent": "warn"
          }
        ],
        "caption": "**Normalise before you reason.** Every modality becomes the same request object, and a low-confidence voice note that says cancel my order gets a **question, not a cancellation**."
      },
      "say": "Every input gets validated and normalised before the model reasons over it, because each modality fails in its own way. Text goes through the usual safety and intent checks. Screenshots are checked for file type, size and sensitive content, then passed to a vision model or OCR. Voice goes through speech recognition, and I keep the confidence score and detected language rather than pretending the transcript is perfect. It all becomes one request object carrying the original evidence, the extracted text, and the user's identity and permissions, which means retrieval applies the same access control whatever came in. Confidence matters most on actions. If a noisy voice note says cancel my order, a low-confidence transcript gets a confirmation question, not a cancellation. I evaluate text, screenshot, speech and mixed cases separately, including the ones where OCR or transcription goes wrong. And logging and retention have to cover the original media too, not just the final text.",
      "numbers": "For voice, track time to first audio/text response, transcription error by language/noise condition, and task completion. For screenshots, track extraction/grounding errors rather than only final-answer preference.",
      "wrong": "Converting everything to text and discarding the original confidence and evidence. That hides OCR or speech errors and makes sensitive actions unsafe.",
      "follow": "The transcript confidence is low but the user says “yes” to a payment action. What exactly do you ask them to confirm?",
      "followAnswer": "I ask them to confirm the specific action in words they can check, not a generic yes. I read back the payee, the amount and the account or card, and ask them to confirm those details, ideally shown on screen as well as spoken. Because the transcript was uncertain, a yes to an unclear question proves nothing. For payments I also require a stronger step, such as a PIN, a one-time code or an in-app tap, and if confidence stays low I hand over to a person."
    },
    {
      "id": "sd-23",
      "q": "Design a system that supports both batch predictions and real-time ML scoring.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "system-design",
        "ml",
        "batch",
        "realtime",
        "features"
      ],
      "why": "Many 3-10 year ML roles require production prediction pipelines beyond LLM request handling.",
      "quick": [
        "First decide which decisions truly need instant scoring.",
        "Batch runs a fixed model on saved data, with timestamps.",
        "Instant scoring needs fast inputs and a live model service.",
        "Compute inputs the same way as in training.",
        "Log versions and outcomes, and have a safe backup score."
      ],
      "simple": "Many ML systems need both batch predictions and real-time scoring. The first step is deciding which decisions truly need online scoring, because the two paths have very different cost and reliability. For example, a daily churn score can happily be batch, but a fraud check at payment time cannot.\n\nThe batch path runs a pinned model over a versioned data snapshot and stamps each prediction with the model and data versions. The online path needs low-latency features and a model service. Both must reuse the same feature definitions as training, or you get train-serve skew, where production computes a feature differently from what the model learned on and quality drops silently.\n\nYou log model version, feature freshness and outcomes for monitoring and retraining. And you design a fallback, such as the latest batch score, so a missing feature does not time out every request.",
      "points": [
        "Separate batch and online paths by actual decision latency requirements.",
        "Version data, features and model with every prediction artifact.",
        "Reuse feature definitions to avoid train-serve skew.",
        "Log outcomes and freshness for monitoring and retraining.",
        "Define a safe fallback for missing features or online service failure."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Batch and online prediction paths compared by example, input, output, freshness target and failure handling, sharing one set of feature definitions.",
        "aspects": [
          "Example",
          "Reads",
          "Writes",
          "Target",
          "Shares"
        ],
        "columns": [
          {
            "label": "Batch path",
            "note": "cheap, scheduled",
            "cells": [
              "Daily churn score",
              "Versioned data snapshot",
              "Predictions stamped with versions",
              "Its own freshness SLO",
              "Feature definitions from training"
            ]
          },
          {
            "label": "Online path",
            "note": "when the decision cannot wait",
            "accent": "warn",
            "cells": [
              "Fraud check at payment",
              "Low-latency features",
              "Score from a model service",
              "Its own latency SLO",
              "Same definitions; batch fallback"
            ]
          }
        ],
        "caption": "Split paths by **real decision latency**, but share **one set of feature definitions** to avoid train-serve skew. If an online feature is missing, fall back to the latest batch score."
      },
      "say": "I'd start by deciding which decisions genuinely need online scoring, because the two paths have very different cost and reliability profiles. A daily churn score can happily be batch. A fraud check at payment time can't. The batch path reads a versioned data snapshot, runs a pinned model over the whole set, and writes predictions stamped with model and data versions, so downstream users know what they're looking at. The online path needs low-latency features and a model service. Both must reuse the same feature definitions as training, otherwise you get train-serve skew, where production computes a feature differently from what the model learned on. Each path also gets its own freshness and latency targets, because a daily score and a fifty-millisecond feature can't share one vague idea of fresh enough. I log model version, feature freshness and outcomes for monitoring and retraining. And there's always a fallback, like the latest batch score, so a missing feature doesn't time out every request.",
      "numbers": "Define separate freshness and latency SLOs for batch and online paths. A daily batch score and a 50 ms online feature cannot share one vague definition of “fresh enough.”",
      "wrong": "Putting the batch model behind the same synchronous API and calling it real time. Data freshness, feature access, throughput and failure handling are different design problems.",
      "follow": "Training uses a feature computed nightly but online scoring recomputes it from live events. How do you prove the two definitions match?",
      "followAnswer": "I prove it by computing both and comparing them, not by reading the code. The best fix is one feature definition used by both paths, but I still check. I log the online feature values at scoring time, recompute the same features offline for the same entities and timestamps, and compare the distributions and per-row differences against a tolerance. I run that comparison continuously and alert on drift. Point-in-time correctness matters too, so training only uses values that would have been available at prediction time."
    },
    {
      "id": "sd-22",
      "q": "REST, gRPC, or a queue/event bus between AI services - how do you choose?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "system-design",
        "rest",
        "grpc",
        "kafka",
        "queues"
      ],
      "why": "Current senior AI roles expect ordinary distributed-systems judgement around model and agent services.",
      "quick": [
        "Choose by how the services talk to each other.",
        "REST for simple request and reply, easy to debug.",
        "gRPC for typed internal calls or streaming.",
        "A queue for long or bursty jobs, Kafka for replayable events.",
        "You still must plan retries, duplicates and slow consumers."
      ],
      "simple": "REST, gRPC and queues are three ways for services to talk, and the choice should come from the interaction pattern, not a generic latency benchmark. REST is a good default for simple request and response, especially across teams, because every tool speaks HTTP. gRPC fits typed internal calls or streaming, where both sides can adopt it comfortably.\n\nA queue or event bus is for asynchronous work, where the caller should not hold a connection open. For example, a large document ingestion or a long agent job goes on a queue, which also buffers bursts and lets consumers scale on their own. Kafka earns its place when you need durable, replayable events with several consumers.\n\nWhatever you pick, you still design timeouts, idempotency keys, dead-letter handling and backpressure, because no protocol solves those for you.",
      "points": [
        "REST for straightforward request/response and broad interoperability.",
        "gRPC for typed internal RPC and efficient streaming where it fits.",
        "Queues/events for long-running or bursty asynchronous work.",
        "Choose Kafka when durable event streams/multiple consumers are real requirements.",
        "Design retries, idempotency, dead letters, ordering and backpressure explicitly."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "REST, gRPC and a queue or event bus compared by interaction pattern, best use and when to pick them.",
        "aspects": [
          "Pattern",
          "Best for",
          "Pick it when"
        ],
        "columns": [
          {
            "label": "REST",
            "note": "the default",
            "accent": "accent",
            "cells": [
              "Request and response",
              "Across teams, external clients",
              "Easy tooling and debugging"
            ]
          },
          {
            "label": "gRPC",
            "note": "typed internal RPC",
            "cells": [
              "Typed calls, streaming",
              "Internal service to service",
              "Low overhead matters, both sides adopt"
            ]
          },
          {
            "label": "Queue / event bus",
            "note": "asynchronous",
            "cells": [
              "Fire and process later",
              "Ingestion, batch inference, agent jobs",
              "Bursty or long-running work"
            ]
          }
        ],
        "caption": "Choose by **interaction pattern**, not a benchmark. Whichever you pick, you still design **timeouts, idempotency, dead letters, ordering and backpressure**."
      },
      "say": "I choose by interaction pattern, not by a generic latency benchmark. REST is my default for simple request and response, especially across teams, because every tool speaks HTTP and it's easy to debug. gRPC fits typed internal service-to-service calls or streaming, when both sides can adopt it comfortably and the lower overhead actually matters. A queue or event bus fits long-running or bursty work, like large document ingestion or batch inference, because the caller shouldn't hold a connection open and consumers can scale on their own. Kafka specifically earns its place when you need durable, replayable events with several independent consumers. For plain background jobs, a simple work queue is enough. Whatever I pick, I still design timeouts, idempotency keys, dead-letter handling, ordering and backpressure, meaning what happens when a consumer is slower than the producer. No protocol solves those for you. And I'd measure payload size, request rate, burstiness and consumer lag in our own system before trusting anyone's benchmark.",
      "numbers": "Do not choose from a generic latency benchmark. Measure payload size, request rate, burstiness, consumer lag and acceptable end-to-end delay in your own system.",
      "wrong": "Choosing Kafka because the system is large, or gRPC because it is faster. The interaction and delivery requirements should justify the protocol.",
      "follow": "Your embedding consumer is falling behind the producer. Which backpressure and scaling signals do you inspect?",
      "followAnswer": "I look first at consumer lag, meaning how far behind the consumers are, and whether it is growing or stable. Then I compare the producer's input rate with consumer throughput, and check consumer utilisation, the embedding provider's 429 and latency rates, and retry and dead-letter counts. If consumers are idle waiting on the provider, adding more will not help; I batch more per request or raise the quota. If they are saturated and the provider has headroom, I scale consumers out, and if nothing helps, I slow the producer."
    },
    {
      "id": "sd-25",
      "q": "How do you make an AI workflow safe under retries, duplicate messages and backpressure?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "system-design",
        "idempotency",
        "retries",
        "backpressure",
        "reliability"
      ],
      "why": "Agentic and ML systems are distributed systems; senior interviews increasingly probe failure handling beyond the happy path.",
      "quick": [
        "Assume a call can time out after the work succeeded.",
        "Give each action a unique id so repeats do nothing.",
        "Retry only temporary failures, park permanent ones for review.",
        "Cap queue sizes and parallel work, and watch the backlog.",
        "Tag each request with one id to follow it everywhere."
      ],
      "simple": "AI workflows are distributed systems, so assume any call can time out after the remote side has already done the work. A blind retry can then repeat a side effect, like a second payment or a duplicate ticket.\n\nSo every action with a side effect gets a stable idempotency key. Before acting, the service checks whether that key already completed and returns the existing result instead of acting twice. For example, an agent that raises a support ticket times out and retries, but the ticket service sees the same key and returns the ticket it already created. Retries are limited to temporary failures, and permanent ones go to a dead-letter queue.\n\nFor backpressure, queues and concurrency are bounded so producers cannot create infinite work, and you watch lag and throughput. Correlation ids let you trace one user action across every call and retry.",
      "points": [
        "Assume timeouts can happen after the remote side succeeded.",
        "Use stable idempotency keys for side effects and duplicate delivery.",
        "Retry temporary failures only and dead-letter/review permanent ones.",
        "Bound queues and concurrency; monitor lag and processing rate.",
        "Trace one workflow end to end with correlation ids."
      ],
      "diagram": {
        "alt": "A message carrying an idempotency key is checked against a processed-event record: if the key already completed, the stored result is returned; otherwise the side effect runs with bounded retries for temporary failures, and permanent failures go to a dead-letter queue.",
        "rows": [
          [
            {
              "id": "m",
              "label": "Message or retry",
              "note": "stable idempotency key"
            }
          ],
          [
            {
              "id": "k",
              "label": "Key already done?",
              "accent": "warn",
              "note": "processed-event record"
            }
          ],
          [
            {
              "id": "r",
              "label": "Return stored result",
              "note": "no second side effect",
              "accent": "accent"
            },
            {
              "id": "d",
              "label": "Do side effect",
              "note": "bounded retries, temporary fails only"
            }
          ],
          [
            {
              "id": "dl",
              "label": "Dead-letter queue",
              "note": "permanent failures, with context",
              "accent": "bad"
            }
          ]
        ],
        "edges": [
          {
            "from": "m",
            "to": "k"
          },
          {
            "from": "k",
            "to": "r",
            "label": "yes"
          },
          {
            "from": "k",
            "to": "d",
            "label": "no"
          },
          {
            "from": "d",
            "to": "dl",
            "label": "permanent fail"
          }
        ],
        "caption": "Assume a call can **time out after the other side succeeded**. A stable key makes redelivery harmless; bounded queues and concurrency stop producers creating infinite work."
      },
      "say": "I assume any call can time out after the other side has already done the work, so a blind retry can repeat a side effect. That assumption drives everything else. Every action with a side effect gets a stable idempotency key. Before creating a payment or a ticket, the service checks whether that key already completed and returns the existing result instead of acting twice. Message consumers record the events they've processed, so a redelivery is harmless. Retries are only for temporary failures, a limited number of times, and permanent failures go to a dead-letter queue with enough context to repair them. Backpressure means bounded queues and bounded concurrency, so producers can't create infinite work. I watch lag, retry rate, duplicates suppressed and throughput together, because the system is only safe while consumers keep up or overload is shed on purpose. Finally, correlation ids let me trace one user action across model calls, tools, messages and every retry.",
      "numbers": "Track queue depth/lag, retry rate, duplicate-suppression count and processing throughput together. Capacity is safe only while sustained consumer throughput stays above incoming work or overload is deliberately shed.",
      "wrong": "Relying on “exactly once” as a magic broker setting. End-to-end side effects still need application-level idempotency and a clear duplicate policy.",
      "follow": "The model call timed out, you retry, and the provider bills both attempts. How do you prevent duplicate downstream actions even if duplicate compute cannot be avoided?",
      "followAnswer": "I make the downstream action idempotent, keyed on the business operation rather than on the model call. The key comes from the workflow, for example the request id plus the step, and is created before the first attempt. Whichever attempt finishes first records its result against that key, and any later attempt finds it already done and returns the stored result instead of acting again. The side effect, like creating a ticket, also passes that key to the downstream system, so its own deduplication backs mine up."
    },
    {
      "id": "sd-02",
      "q": "How do you decide between building and buying?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "system-design",
        "judgement",
        "business"
      ],
      "why": "A senior judgement question. Engineers reflexively build, and the panel is checking for commercial reasoning.",
      "quick": [
        "Build what makes you different, buy the generic parts.",
        "Your data, business rules and test set make you different.",
        "Models, databases and tracking tools are generic.",
        "If building takes over a quarter and good options exist, buy.",
        "Watch lock-in through data, and always own your test set."
      ],
      "simple": "This is a senior judgement question, because engineers reflexively want to build and the panel is checking for commercial reasoning. The simple rule is to build what differentiates you and buy what is necessary but generic.\n\nThe differentiating parts are usually your data, domain logic and evaluation set, because nobody else can copy them. Models, vector stores, tracing platforms and parsers are generic, and building one means maintaining it forever. For example, if a tracing platform would take more than a quarter to build and a mature product exists, you buy it and spend that quarter on your data and evaluation instead.\n\nThe trap is lock-in through data rather than code. Swapping a vector database is a rebuild you can plan, but losing your traces and evaluation history is far worse. So whatever you decide, you own the eval set, because it is the asset that transfers.",
      "points": [
        "Build the differentiating part: data, domain logic, evaluation.",
        "Buy the undifferentiated necessity: models, stores, tracing, parsers.",
        "Ask: proprietary? more than a quarter to build? mature alternative? exit cost?",
        "Watch for lock-in through data, not code - traces and eval history especially.",
        "Own the evaluation set whatever you decide. It is the asset that transfers."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A two-by-two grid: whether a part is differentiating against whether a mature option exists, showing when to build and when to buy.",
        "xLabel": "Mature option on the market?",
        "yLabel": "The part",
        "cols": [
          "Yes",
          "No"
        ],
        "rows": [
          "Differentiating",
          "Generic"
        ],
        "cells": [
          [
            {
              "label": "Buy platform, own data",
              "note": "keep it behind an interface",
              "accent": "warn"
            },
            {
              "label": "Build",
              "note": "data, domain logic, eval",
              "accent": "accent"
            }
          ],
          [
            {
              "label": "Buy",
              "note": "models, stores, tracing, parsers",
              "accent": "accent"
            },
            {
              "label": "Build only if needed",
              "note": "you maintain it forever",
              "accent": "bad"
            }
          ]
        ],
        "caption": "**Build what differentiates, buy what is generic.** If building takes more than a quarter and a mature option exists, buy - and whatever you decide, **own the evaluation set**."
      },
      "say": "Build what differentiates you, buy what's necessary but generic. The differentiating parts are usually your data, your domain logic and your evaluation set, because nobody else can copy them. Models, vector stores, tracing platforms and document parsers are generic, and building one means maintaining it forever. So I ask four questions. Does it touch our proprietary data? Would building take more than a quarter? Is there a mature option? And how hard would it be to leave later? If it's more than a quarter of work and a good option exists, I buy, and spend that quarter on data and evaluation instead. The lock-in people miss comes through data, not code. Swapping a vector database is a rebuild you can plan. Losing your traces and evaluation history is far worse. So whatever we decide, we own the eval set, because it's the asset that transfers.",
      "numbers": "A useful rule: if building it takes more than a quarter and a mature option exists, buy it and spend the quarter on the data and evaluation instead.",
      "wrong": "\"We built our own framework for full control.\" It invites the question of what that control bought, and how much of the year went into maintaining it.",
      "follow": "You bought the platform and now need a feature they will not build. What now?",
      "followAnswer": "First I check whether I can build it around the platform rather than inside it. Most good platforms have APIs, webhooks or plugin points, so I build the feature as a thin service of ours that sits beside it. I also raise it formally with the vendor, since a clear business case sometimes changes the roadmap. If the gap is core to what differentiates us, I revisit the build-versus-buy decision, which is where owning our data and eval set pays off, because leaving becomes realistic."
    },
    {
      "id": "sd-18",
      "q": "How do you gather requirements when the client says 'we want AI'?",
      "round": [
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "consulting",
        "scoping",
        "stakeholders"
      ],
      "why": "The services-company staple. Scoping is the actual skill being hired for.",
      "quick": [
        "Treat we want AI as a start, not a requirement.",
        "Walk through today's process with one real example.",
        "Get volume, handling time and the cost of mistakes.",
        "Agree the number that must move and what must not worsen.",
        "Check data access early, and the fix may not be AI."
      ],
      "simple": "This is the services-company staple, because scoping is the actual skill being hired for. \"We want AI\" is a starting point, not a requirement, so the job is to turn it into a specific problem with a measurable outcome before anyone picks a model.\n\nYou ask the client to walk you through the current process with a real example. For example, following one insurance claim through the team shows where the time goes and where errors happen. Then you get three numbers, which are volume, handling time and the cost of an error, because without them there is no business case. You agree which metric must move, and you confirm data access early, since it is a common timeline killer.\n\nAnd you stay willing to conclude the answer is not AI at all, because saying so builds more trust than a pilot that goes nowhere.",
      "points": [
        "Ask them to walk through the current process with a real example.",
        "Quantify volume, time and error cost - no numbers, no business case.",
        "Define the measurable success metric before designing anything.",
        "Data access is a very common timeline killer - confirm it early.",
        "Be willing to conclude the answer is not AI."
      ],
      "say": "That's a starting point, not a requirement, so my job is to turn it into a specific problem with a measurable outcome before anyone picks a model. I start by asking them to walk me through the current process with a real example. Following one claim through the team shows me where the time and the errors actually pile up. Then I get three numbers: volume, handling time and the cost of an error. Without those there's no business case. Next we agree which metric must move, by how much, and what mustn't get worse. I check feasibility early, especially data access, because it's one of the most common timeline killers, along with the accuracy bar and who owns the final decision. And I stay willing to conclude it isn't an AI problem at all. Sometimes the real fix is better search or an integration, and saying so builds more trust than a pilot that goes nowhere.",
      "numbers": "Without volume, handling time and error cost, there is no business case. Get those three numbers before proposing an architecture.",
      "wrong": "Taking the brief literally and proposing a chatbot. It wins the meeting and produces a pilot that never reaches production because nobody defined what success was.",
      "follow": "You conclude their problem does not need AI. How do you say that to the client?",
      "followAnswer": "I say it plainly, with the evidence, and lead with the solution rather than the no. I walk them through what we found in their own process, such as the delays coming from a missing integration or poor search, then show that a simpler fix meets their metric faster, cheaper and more reliably. I frame it as protecting their budget and timeline, not rejecting their idea. And I say where AI could genuinely help later, so they know I am not against it, just against a pilot that goes nowhere."
    },
    {
      "id": "sd-19",
      "q": "How do you estimate effort and timeline for a GenAI project?",
      "round": [
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "consulting",
        "estimation",
        "delivery"
      ],
      "why": "Asked directly in services-company interviews, and the honest structure is what earns credit.",
      "quick": [
        "Quality is found by building, so estimate in stages.",
        "Discovery takes one to two weeks, then go or stop.",
        "Pilot takes four to six weeks with real users.",
        "Hardening takes six to ten weeks and is always underestimated.",
        "Give a range with assumptions and flag data access delays."
      ],
      "simple": "GenAI projects are harder to estimate than normal software, because quality is discovered rather than specified. You do not know how good retrieval will be until it runs on real data, so you estimate in phases with go or no-go gates, not as one number.\n\nDiscovery takes one to two weeks and checks data access and feasibility on real examples. The pilot takes four to six weeks and produces a measured quality number from real users. Hardening takes six to ten weeks and is the phase everyone underestimates, because security, permissions, guardrails, monitoring and integrations routinely take as long as the pilot. Rollout adds four weeks or more.\n\nFor example, after a five-week pilot, those phases add another ten to fourteen weeks or more. So you give a range with the assumptions written down, and flag data access delays with a named owner.",
      "points": [
        "Quality is discovered, not specified - estimate in phases with gates.",
        "Discovery 1–2 weeks, pilot 4–6, hardening 6–10, rollout 4+.",
        "Hardening is routinely at least as long as the pilot, and often underestimated.",
        "Data access delays are among the most common overruns.",
        "Give a range with assumptions, and gate after discovery."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "GenAI project phases with durations: discovery with a go or no-go gate, pilot, hardening, then rollout.",
        "lanes": [
          {
            "label": "Discovery",
            "note": "1-2 weeks, go / no-go gate",
            "accent": "accent"
          },
          {
            "label": "Pilot",
            "note": "4-6 weeks, measured quality"
          },
          {
            "label": "Hardening",
            "note": "6-10 weeks, underestimated",
            "accent": "warn"
          },
          {
            "label": "Rollout",
            "note": "4+ weeks, phased users"
          }
        ],
        "caption": "**Quality is discovered, not specified**, so estimate in phases with a gate after discovery. Pilot to production often takes **2-3x the pilot effort**."
      },
      "say": "In phases with go or no-go gates, because quality is discovered rather than specified. We don't know how good retrieval will be until it runs on real data. Discovery is one to two weeks: data access, feasibility on about twenty real examples and an agreed success metric, ending in a go or no-go with evidence. The pilot is four to six weeks, a working system tested by real users rather than the project team, which produces a measured quality number. Hardening is six to ten weeks, and it's the phase everyone underestimates. Security review, permissions, guardrails, monitoring, cost controls and real integrations routinely take at least as long as the pilot. Rollout and stabilisation add four weeks or more. So as a rough heuristic, pilot to production often takes two to three times the pilot effort. Data access delays are a common overrun outside our control, so they get a named owner. And I always give a range with the assumptions written down.",
      "numbers": "A planning heuristic, not a law: pilot to production often takes 2–3× the pilot effort - the phases above give 10–14+ weeks after a 4–6 week pilot. Hardening is commonly at least as long as the pilot.",
      "wrong": "Quoting a single number for the whole project. It hides the feasibility uncertainty, and it sets up the conversation where hardening looks like scope creep.",
      "follow": "The client wants a fixed price for the whole thing. What do you propose?",
      "followAnswer": "I propose fixed price per phase, not for the whole thing, because quality is discovered rather than specified. Discovery is fixed price with a clear deliverable, a go or no-go backed by evidence. Once we know the data and the achievable quality, I can price the pilot, and then hardening, each with written assumptions and an agreed success metric. If they insist on one number, I make the assumptions explicit, attach a change process for when they break, and price in the risk rather than hoping."
    },
    {
      "id": "sd-05",
      "q": "How would you convince a sceptical stakeholder to fund a GenAI project?",
      "round": [
        "manager",
        "hr"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "story",
        "business",
        "communication"
      ],
      "why": "Senior engineers are expected to sell work, not just do it. Services and consulting panels press hard here.",
      "quick": [
        "Do not lead with the technology.",
        "Start from a problem they already complain about.",
        "Show what that problem costs them today.",
        "Offer a short trial on one task with an agreed target.",
        "Agree to stop if it misses, and be honest about limits."
      ],
      "simple": "Senior engineers are expected to sell work, and the key insight is that you do not convince a sceptic with the technology. Sceptics have usually seen an impressive demo that delivered nothing, so more talk about capability only confirms their doubt.\n\nInstead, you start from a problem they already complain about, in their own metric, such as handling time or backlog, and put a figure on what it costs today. Then you propose the smallest thing that tests the idea. For example, a six-to-eight-week pilot on a single support queue, with one success metric agreed in advance and a kill criterion that says if it misses the number, you stop.\n\nYou are also straight about the limitations, where a human stays in the loop and what it costs to run. The upside gets attention, but the credibility comes from the kill criterion and the honesty.",
      "points": [
        "Start from a problem they already complain about, in their metric.",
        "Quantify what that problem costs today.",
        "Propose the smallest time-boxed pilot on one narrow workflow.",
        "Agree the success metric - and a kill criterion - in advance.",
        "State the limitations, the human-in-the-loop point and the running cost.",
        "Credibility comes from the kill criterion, not the upside."
      ],
      "say": "I'd lead with their problem, not the technology, because sceptics have usually seen an impressive demo that delivered nothing. So I start from something they already complain about, in their own metric, like handling time or backlog, and put a figure on what it costs today. Then I propose the smallest pilot that could prove the point: six to eight weeks on one narrow workflow, say a single support queue, with one success metric agreed up front. Crucially, we also agree a kill criterion. If it misses the number, we stop. That's what actually converts a sceptic, because it shows I'm not just selling. I'm upfront about the limitations too, where a human stays in the loop, and what it'll cost to run. The upside gets their attention, but the credibility comes from the kill criterion and the honesty.",
      "numbers": "Time-box the pilot - six to eight weeks on one workflow with one agreed metric. Open-ended pilots are how these projects quietly die.",
      "wrong": "Leading with what the technology can do. It is the same pitch that produced the demo they already distrust.",
      "follow": "The pilot hit its metric but nobody is using it. What happened?",
      "followAnswer": "Usually it solved the metric but not the workflow. I would go and watch the users first, because the reasons are often simple: it sits in a separate tool instead of where they already work, it is slower than their shortcut, they do not trust it after one bad answer, or nobody changed the process to expect it. Then I fix the adoption problem, such as embedding it in their existing screen, adding citations and training, and I track usage as a success metric alongside quality next time."
    },
    {
      "id": "sd-06",
      "q": "How do you explain a limitation to a non-technical stakeholder?",
      "round": [
        "manager",
        "hr"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "story",
        "communication",
        "expectations"
      ],
      "why": "Expectation management is most of a senior role, and this is a fast way to test it.",
      "quick": [
        "Say what it cannot do, why, and your fix.",
        "Be concrete, like one answer in twenty needs correcting.",
        "Pair each limit with the safeguard you built.",
        "Share a number you will report on regularly.",
        "Say it before launch, not after something breaks."
      ],
      "simple": "Expectation management is most of a senior role, and this question tests it quickly. A strong answer says what the system cannot do, why, and what you did about it, in plain words and without hedging.\n\nThe common mistake is softening a limitation into vagueness. \"The model may occasionally produce inaccurate results\" means nothing and gives you no cover later. For example, saying \"about one answer in twenty needs correction, which is why every response shows its source and a person approves anything that changes a record\" is concrete, and it pairs the limitation with the control you built, so it sounds like a design choice rather than an apology.\n\nThen give a number you will report on a schedule. And say it early, because a limitation disclosed before launch is a design decision, while the same one after an incident is a surprise.",
      "points": [
        "Concrete over hedged. A vague warning protects nobody.",
        "Pair the limitation with the control you built for it.",
        "Use their frame, not model vocabulary.",
        "Give a number you will report on, so it is monitored not just disclosed.",
        "Disclose early - before launch it is a design decision, after an incident it is a surprise."
      ],
      "say": "Plainly and early: what it can't do, why, and what we've built to handle it. A vague warning that the model may occasionally be inaccurate protects nobody. It means nothing to the stakeholder and gives us no cover later. So I make it concrete and put it in their terms. I might say that roughly one answer in twenty needs correcting, which is why every response shows its source and a person approves anything that changes a record. Now the limitation arrives paired with its control, and it sounds like a design choice rather than an apology. Then I give them a number I'll report on a schedule, so the limitation is monitored, not just disclosed once. Timing is what people get wrong. A limitation raised before launch is a design decision. The same limitation after an incident is a surprise, and that's what damages trust.",
      "numbers": "Whatever accuracy figure you quote, commit to reporting it on a schedule. A one-time disclosure is not expectation management.",
      "wrong": "\"I explain that LLMs are probabilistic.\" True, and it transfers the problem to them instead of telling them what to do about it.",
      "follow": "They ask you to guarantee it will never be wrong. What do you say?",
      "followAnswer": "I say honestly that I cannot guarantee that, and that nobody honestly can for any system, human or automated. What I can guarantee is how we handle it. We measure the error rate on real cases and report it on a schedule, every answer shows its source so errors are easy to spot, a person approves anything that changes a record, and we have a clear path to report and fix mistakes. Then I ask what error rate the business can accept, and design to that."
    },
    {
      "id": "sd-13",
      "q": "You have a competing offer. How do you handle it?",
      "round": [
        "hr",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "behavioural",
        "hr",
        "compensation",
        "judgement"
      ],
      "why": "It tests whether you are straightforward under leverage - the panel is imagining you negotiating with a client.",
      "quick": [
        "Treat the other offer as timing news, not a threat.",
        "Share the real decision deadline early.",
        "State a genuine preference if you have one.",
        "Never invent an offer, and ask for changes directly.",
        "Once you accept, treat it as a real commitment."
      ],
      "simple": "This question tests whether you are straightforward under leverage, because the panel is imagining how you would negotiate with a client. So you treat the competing offer as useful scheduling information, not a threat.\n\nYou share the real decision deadline early, so the team can decide whether to speed up. If you have a genuine preference, say it plainly. For example, \"I have an offer that needs an answer by the 14th, but this role is my first choice because of the work.\" Never invent an offer or a false deadline, because it is easy to check and impossible to walk back. If you want a change in level or pay, ask directly and ground it in the role's scope or market evidence.\n\nThen decide on the whole role, and once you accept, treat it as a real commitment rather than a negotiating placeholder.",
      "points": [
        "Share the real decision deadline so the team can act.",
        "State a genuine preference if you have one, without threatening.",
        "Never invent an offer or a false deadline.",
        "Ask directly about level/compensation using role evidence.",
        "Treat an acceptance as a serious commitment."
      ],
      "say": "I treat it as scheduling information, not leverage, and I share the real decision deadline early so the team can choose whether to move faster. If I have a genuine preference, I say so plainly. Something like, I have an offer that needs an answer by a specific date, but this role is my first choice because of the work. If I want a change in level or pay, I ask for it directly and ground it in the role's scope, responsibilities or market evidence, rather than expecting the other offer to argue for me. I never invent an offer or a deadline, because it's easy to check and impossible to walk back. In the end I decide on the whole role: the work, the manager, the level and the pay. And once I accept, that's a real commitment, not a placeholder while I keep negotiating.",
      "numbers": "The only important number here is the real decision deadline. Give the exact date rather than saying 'soon' if you expect the company to act on it.",
      "wrong": "Inventing or exaggerating another offer to create leverage. The short-term pressure is not worth the credibility risk.",
      "follow": "We cannot match it. Would you still join?",
      "followAnswer": "I answer honestly, based on the whole role rather than the one number. The framework: say whether the gap matters to you and why, then name what would make it work, such as a higher level if the scope justifies it, a joining bonus, equity, or an earlier pay review with clear criteria. If this is genuinely your first choice and the package is fair, say yes clearly. If the gap is too large, say so politely now rather than accepting and continuing to shop around."
    },
    {
      "id": "sd-15",
      "q": "Design a multilingual customer assistant for low-bandwidth markets.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "design",
        "multilingual",
        "low-bandwidth",
        "voice"
      ],
      "why": "A globally relevant design where language, intermittent connectivity, channel choice, cost and voice quality interact.",
      "quick": [
        "First clarify languages, scripts, channel and allowed actions.",
        "Save chat progress so users can return later.",
        "Detect language on every message, since people switch.",
        "Test search across languages, measure cost per language.",
        "Check every result by language, since averages hide failures."
      ],
      "simple": "A multilingual assistant for low-bandwidth markets is a design where language, patchy connectivity, channel and cost all interact. The channel shapes the state model. On messaging apps, a user may disappear for an hour and come back on another device, so session state must be durable and resumable, and replies must be useful even without streaming.\n\nLanguage is detected per message, not once per account, because people switch mid-conversation. For example, a user might type Hindi in Latin script, so you normalise it for search while keeping the original for display and audit. You also test cross-language retrieval rather than assuming it works.\n\nCost needs per-language measurement too, because Indic scripts can take roughly 1.5 to 3 times the tokens of English, depending on the tokeniser. And every metric is sliced by language and channel, because an overall average can hide the one market that is failing.",
      "points": [
        "Use durable state for intermittent/asynchronous channels.",
        "Detect language per message and handle code-switching/transliteration.",
        "Test cross-language retrieval rather than assuming it works.",
        "Measure cost, latency and speech quality per language/channel.",
        "Confirm sensitive actions when transcript confidence is low."
      ],
      "say": "I'd first pin down the languages, scripts, channel and allowed actions, because the channel shapes the whole state model. On messaging apps, people drop off and come back an hour later, maybe on another device, so session state has to be durable and resumable, and replies must be useful even without streaming. Language gets detected per message, not once per account, because people switch mid-conversation. A user might type Hindi in Latin script, so I normalise that for search while keeping the original for display and audit. I test cross-language retrieval on the languages we serve before choosing multilingual embeddings or translation. Cost needs per-language measurement too, because Indic scripts can take roughly one and a half to three times the tokens of English, depending on the tokeniser. For voice, I keep transcript confidence and confirm sensitive actions when it's low. And every metric is sliced by language and channel, because an overall average can hide the one market that's failing.",
      "numbers": "Measure per-language token use, retrieval recall, speech error rate, latency and task completion on representative traffic. Indic scripts such as Devanagari often cost roughly 1.5–3× the tokens of equivalent English depending on the tokenizer, so measure on your own traffic rather than applying one multiplier to every language.",
      "wrong": "Treating multilingual support as a translation layer at the edge. Language changes retrieval, tokenisation, speech quality, evaluation and sometimes the whole channel design.",
      "follow": "A user mixes two languages and types both in Latin script. How does your retrieval pipeline normalise without losing the original meaning?",
      "followAnswer": "I keep the original text untouched and add normalised versions alongside it for search. Language identification runs at the word or phrase level, so a sentence mixing romanised Hindi and English is recognised as mixed, not forced into one language. I then generate a transliterated form in the native script and a cleaned version, and search across all of them with hybrid retrieval, since keyword search catches exact product names. The model answers from the original message, so nothing is lost, and I evaluate on real code-switched queries."
    },
    {
      "id": "sd-20",
      "q": "Tell me about a time you said a GenAI approach would not work.",
      "round": [
        "manager"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "behavioural",
        "judgement",
        "communication"
      ],
      "why": "A strong differentiator. Panels are wary of candidates who think every problem is an LLM problem.",
      "quick": [
        "Give a real example where you said no.",
        "Bring measurements on their own data, not opinion.",
        "Common reasons are accuracy, cost, simpler fixes, data or law.",
        "Always offer a better alternative with the no.",
        "Say the outcome, even if you were overruled."
      ],
      "simple": "This is a strong differentiator, because panels are wary of candidates who think every problem is an LLM problem. You need a real example, told as the situation, your analysis, how you communicated it and the outcome.\n\nThe analysis must be specific and quantified, not a general reservation. Valid reasons include an unreachable accuracy bar, cost per transaction above its value, a cheaper deterministic option like search or rules, missing data or regulation. For example, a team wanted an LLM for an extraction task needing near-perfect accuracy, and you measured it on about twenty real examples from their data, showing the gap was too large to close.\n\nThen comes how you said it. You bring evidence, not opinion, and you offer an alternative rather than only a refusal, which keeps you a partner rather than a blocker. Finally, you state the outcome, even if you were overruled.",
      "points": [
        "Bring quantified evidence measured on their data, not opinion.",
        "Common valid reasons: accuracy bar, economics, determinism, no data, regulation.",
        "Always pair the no with a concrete alternative.",
        "Frame it as protecting them from a failed programme.",
        "State the outcome, including if you were overruled."
      ],
      "say": "The one I'd use is a team that wanted an LLM for an extraction task needing near-perfect accuracy. Rather than argue from principle, I measured it on about twenty real examples from their own data. The gap to their accuracy bar was too big to close with the labelled data they had, and that result was far more persuasive than any opinion of mine. I shared it openly, and I didn't stop at no. I offered an alternative, a rules-based approach combined with better search, which was more reliable and far cheaper. I framed it as protecting them from a failed programme, which kept me a partner rather than a blocker. The alternative shipped and did the job. If I'd been overruled, I'd tell that version just as honestly, what happened and what I learned. What makes the story land is the evidence and the alternative, not the refusal.",
      "numbers": "A measurement on twenty real examples from their data carries more weight than any argument from principle.",
      "wrong": "A generic answer about managing expectations. The question wants a specific decision with a cost attached, and the follow-up will ask what you measured and what saying no cost.",
      "follow": "They disagreed and went ahead anyway. What did you do?",
      "followAnswer": "I made my case once, clearly and in writing, with the evidence and the risks, and then committed to making their approach succeed. That is the framework to fill with your own story. I helped define early checkpoints and a stop criterion, so we would know quickly whether it was working. Then give the outcome honestly: either it worked and what you learned about your own assumptions, or it missed the checkpoint and you helped move to the alternative without saying I told you so."
    }
  ]
};
