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
      "simple": "The first five minutes decide the round, and they are not about architecture.\n\nAsk questions. Who uses this - agents on a call, or customers directly? That single answer changes latency requirements, tone, guardrails and the whole risk profile. How many requests at peak. What is the latency budget. What data does it answer from and how often does it change. Who is allowed to see what. What does success look like in a number the business already tracks. And what is explicitly out of scope.\n\nThen state your assumptions out loud and get them confirmed, so the rest of the discussion has a shared basis.\n\nThen design from those constraints, in this order: data flow first - where documents come from and how they get indexed - then retrieval, then generation, then guardrails, then evaluation, then operations. Draw it. Talk through one request end to end.\n\nThen name the trade-offs you made and what you would do differently at ten times the scale. The interviewer is marking whether you can be pushed on a choice and defend or change it, not whether you produced the diagram they had in mind.",
      "points": [
        "Five minutes of questions first: users, volume, latency, data, permissions, success metric, scope.",
        "State assumptions and get them confirmed.",
        "Design in order: data flow, retrieval, generation, guardrails, evaluation, operations.",
        "Walk one request end to end out loud.",
        "Name trade-offs unprompted, and what changes at 10× scale.",
        "Expect to be pushed. Defending or changing well are both good outcomes."
      ],
      "say": "I would start with questions, because the answers change the design. Who uses it - agents on a call or customers directly, since that changes latency, tone and risk. Peak volume, latency budget, what data it answers from and how often it changes, who may see what, and what success looks like in a metric you already track. Then I state my assumptions, design data flow first, and walk one request end to end.",
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
      "simple": "**Short version: two pipelines - one keeps an index of the documents up to date, the other answers questions from it - with permissions, citations and evaluation built in from day one.**\n\nStart with a few questions: which sources (SharePoint, Confluence, shared drives), how many documents and users, how often things change, and who may see what. (How to run those first minutes is sd-01.)\n\nThe ingestion pipeline runs in the background. Connectors pull documents together with their access lists. A parser gets clean text out, including tables. Chunking splits the text into pieces of a few hundred tokens, keeping headings attached. An embedding model turns each chunk into a vector - a list of numbers that captures meaning - stored with metadata: source, version, date and who can see it. Updates and deletes must flow through too, or withdrawn policies keep being quoted.\n\nThe query pipeline runs per question. Identify the user. Rewrite a follow-up like \"what about contractors?\" into a standalone question using the chat history. Run hybrid search - keyword plus vector - filtered to documents this user may open. Rerank the top 20-50 and keep the best 3-5. The model answers only from those chunks, cites each one, and says it could not find the answer when nothing fits.\n\nAround both: an evaluation set of real questions, tracing of every step, cost and latency dashboards, and a feedback button.\n\nThe senior point: permissions are enforced in retrieval, never by asking the model.",
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
      "say": "I split it into two pipelines. Ingestion pulls documents with their access lists, parses, chunks, embeds and indexes them, and handles updates and deletes incrementally. At query time I identify the user, rewrite the question with chat history, run hybrid search pre-filtered to what that user may see, rerank to the best few chunks, and generate a cited answer with a clear not-found path. Evaluation, tracing and cost monitoring wrap both.",
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
      "simple": "**Short version: the code, not the model, keeps customers apart - in storage, in every query, in every cache and in every log.**\n\nThe design principle to state first: isolation is enforced by the infrastructure, never by the model. The model has no idea who is asking and can be argued with. So every control lives in code, before and after the model call.\n\nStorage: a separate namespace, partition or index per tenant gives the strongest isolation. How far that scales depends on the engine - some handle very many namespaces, while per-tenant collections carry real overhead - so thousands of small tenants often share a collection with a mandatory tenant filter. That filter is enforced server-side in a shared layer no feature team can bypass, ideally as a pre-filter inside the vector query. A post-filter is not a leak as long as it runs before anything reaches the model, but it can return fewer than k results.\n\nQuery path: tenant identity comes from the authenticated session, never from a request parameter the client can set, and it is injected by the framework rather than by each caller.\n\nCaching: every cache key includes the tenant, and the user's entitlements where permissions differ inside a tenant. This is the most common leak in multi-tenant GenAI systems, because caching is added later by someone optimising cost.\n\nTraces and evaluation data: tenant-scoped too, since a trace holds the prompt and the prompt holds their data.\n\nThen verification: automated tests that attempt cross-tenant access on every build, and an audit log good enough to prove isolation held.",
      "points": [
        "Isolation in infrastructure, never in the prompt.",
        "Separate namespaces per tenant where the engine supports it; if shared, a server-side filter, ideally a pre-filter.",
        "Tenant identity from the authenticated session, injected centrally.",
        "Every cache key includes the tenant and user entitlements. This is the classic leak.",
        "Traces and eval data are tenant-scoped - they contain prompts.",
        "Cross-tenant access attempts as automated tests on every build.",
        "An audit log that can prove isolation held, not just assert it."
      ],
      "say": "Isolation is enforced by infrastructure, never by the model, because the model does not know who is asking. Separate namespaces per tenant where I can, and a pre-filter applied in a shared layer no feature team can bypass if I cannot. Tenant identity comes from the authenticated session and is injected centrally. Every cache key includes the tenant and entitlements, since that is the classic leak. Traces are tenant-scoped too.",
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
      "simple": "**Short version: a planner agent splits the question, a few researcher agents work on the parts in parallel, and a writer assembles a cited report - with hard limits on steps, cost and time, and a check that every claim has a source.**\n\nFirst ask: who reads the report, how long it is, which sources are allowed (web, internal documents, databases) and how fresh it must be. And check whether one agent with a search tool would do - it often does (ag-07).\n\nMultiple agents earn their place here because research splits naturally into parallel parts. The planner (a supervisor) turns the question into sub-questions and an outline. Each researcher takes one sub-question, searches, reads, and returns short notes with the exact quoted passage and link - not whole pages, so the planner's context stays small. A writer drafts only from those notes. A checker compares each claim with its quoted source and sends gaps back for one more round.\n\nControl is the senior part. Cap the number of researchers, the steps each may take, total tokens and wall-clock time. Keep the plan, notes and sources in durable state outside the prompt, so a failed run can resume. Treat fetched web pages as untrusted - they can carry prompt injection - so researchers get read-only tools. Show progress, because runs take minutes.\n\nEvaluate on a fixed set of research questions: citation accuracy, coverage of the outline, and cost and time per report.",
      "points": [
        "Planner (supervisor) → parallel researchers → writer → citation checker.",
        "Researchers return compact notes with quoted passages and links, not raw pages.",
        "Hard budgets: number of researchers, steps, tokens, wall-clock time.",
        "Durable state so long runs can resume; stream progress to the user.",
        "Fetched pages are untrusted input - read-only tools, injection defences.",
        "Evaluate citation accuracy, coverage, cost and time per report."
      ],
      "say": "I would use a supervisor pattern, because research splits into parallel parts. A planner turns the question into sub-questions and an outline, researcher agents handle each part in parallel and return compact notes with quoted sources, and a writer drafts only from those notes. A checker verifies every claim against its citation. I cap researchers, steps, tokens and time, keep state durable so runs resume, and treat fetched pages as untrusted.",
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
      "simple": "Have a two-minute version and a ten-minute version, and know which one is being asked for. In a screening call, two minutes.\n\nThe structure that works: the problem in business terms and who had it. What you built, in one or two sentences - no component tour. Your specific role, stated plainly, because a panel cannot tell what \"we\" covers and will probe until it can. One hard decision you made and the trade-off in it. The result, with a number. And one thing you would do differently.\n\nThe differentiator is specificity. \"We built a RAG chatbot for internal documents\" describes a thousand projects. \"Four hundred support agents, twelve thousand policy pages, we cut average handling time from nine minutes to six\" describes yours.\n\nAnd be honest about your part. If you owned retrieval and someone else owned the front end, say that. Claiming the whole system falls apart under one follow-up question about a part you did not build, and that recovery is very hard.",
      "points": [
        "Two-minute and ten-minute versions. Know which is wanted.",
        "Problem in business terms, then what you built in one or two sentences.",
        "State your specific role. An unexplained \"we\" invites probing.",
        "One hard decision and its trade-off.",
        "A result with a number.",
        "One thing you would do differently - it makes the whole story credible."
      ],
      "say": "Shape it like this, with your own facts: I built a policy assistant for [number] internal support agents over [number] documents. I owned retrieval and evaluation; a colleague owned the interface. The hard decision was choosing retrieval over long-context, because we needed per-user document permissions. Handling time fell from [before] to [after] over [timeframe]. And one thing I would do differently, such as building the delete path in ingestion from day one.",
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
      "simple": "You need a real failure, and it has to be one you owned.\n\nThe shape: what went wrong, how you found out - and being found out by a user rather than by your monitoring is fine to admit, it is often the honest answer - what the impact was, what you did immediately, what you changed so it could not recur, and what it taught you.\n\nChoose a failure that is technical, specific and recoverable. Ingestion never handled document deletion, so withdrawn policies kept being quoted for three weeks. The evaluation set was written by engineers, so real users failed in ways we never tested. We shipped without cost monitoring and found out from finance.\n\nWhat to avoid: a failure caused entirely by someone else, which reads as blame; a disguised humblebrag like \"we were too ambitious\"; and anything that suggests you would repeat it.\n\nThe one that lands hardest is where the failure was a gap in your judgement, not your knowledge - you knew how to build the delete path and decided it could wait. That is the answer of someone who has learned something.",
      "points": [
        "Real, specific, technical, owned by you.",
        "How you found out - including if it was a user rather than monitoring.",
        "Impact, immediate action, structural fix, lesson.",
        "Avoid blame, avoid humblebrags, avoid anything you would repeat.",
        "Strongest version: a judgement gap, not a knowledge gap."
      ],
      "say": "A failure in this shape, using your own: ingestion handled document updates but never deletes, so a withdrawn policy kept being quoted for weeks, and support found it before monitoring did. The fix was tombstone handling plus a nightly reconciliation between source and index, and stale-answer reports stopped. The lesson I would state: I knew the delete path was missing and judged it could wait - a judgement gap, not a knowledge gap.",
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
      "simple": "Use a simple structure and keep it to about three minutes: how you found out, how you stopped the damage, what caused it, the impact, and what you changed so it cannot happen again.\n\nDetection. Say honestly how you found out. 'A user told us' is weak but fine if you then fixed the monitoring. 'An alert on refusal rate fired' is stronger.\n\nStop the damage first. Roll back, turn off the feature, or switch to a fallback before you dig into the cause. Panels listen for this, because debugging while users are still affected is a classic mistake.\n\nThe cause, specifically. 'A provider model update changed the output format and broke our parser' or 'an index rebuild silently dropped a filter'. A vague cause sounds like you were not the one who fixed it.\n\nCommunication and impact. Who you told and when, how long it lasted, how many users were affected. Stakeholders hearing about it from customers first is a failure of its own.\n\nThe structural fix - the part that matters most. An alert, a regression test, a rollback path, a canary. For GenAI, add the failing case to the eval set so it cannot quietly return.\n\nOwn your part. If your change caused it, say so plainly. Panels trust people who describe their own mistakes without deflecting far more than people whose incidents were always someone else's fault.",
      "points": [
        "State detection honestly - and fix it if it was a user report.",
        "Triage before diagnosis: restore service, then investigate.",
        "Name the specific mechanism, not a vague category.",
        "Quantify duration and impact.",
        "Close with the structural fix - for GenAI, the eval-set addition."
      ],
      "say": "I would structure it as detection, triage, diagnosis, outcome and the structural fix. The important parts are that I restored service before diagnosing - rollback or fallback first - and that I name the actual mechanism rather than a vague category. Then quantify duration and users affected, and close with what changed so it cannot recur: an alert, a rollback path, and for GenAI, adding the failing case to the eval set.",
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
      "simple": "The useful version of this answer is about converting opinion into evidence, because in GenAI most disagreements are genuinely undecidable by argument - whether a reranker is worth the latency, whether to fine-tune, whether an agent is needed.\n\nSo the approach: separate what is testable from what is judgement. Where it is testable, agree the test in advance - the metric, the dataset, the threshold - and run it. That converts a debate into an experiment and takes seniority out of it, which is what usually makes the disagreement productive.\n\nWhere it is judgement, make both positions explicit including the risk each is optimising against, escalate to whoever owns the decision, and commit to the outcome properly.\n\nThen have a real example, ideally one where you were wrong. \"I argued against the reranker on latency grounds, we agreed a test, it added 180 milliseconds and lifted answer accuracy enough that I was clearly wrong, and we shipped it\" is a stronger story than any disagreement you won.\n\nDisagree and commit, genuinely - including not relitigating it a month later.",
      "points": [
        "Separate testable from judgement.",
        "Testable: agree the metric, dataset and threshold in advance, then run it.",
        "Judgement: state both positions and their risks, escalate to the owner, commit.",
        "Have an example where you were wrong. It is stronger than one you won.",
        "Commit properly - no relitigating it later."
      ],
      "say": "Most GenAI disagreements are testable, so I separate what evidence can settle from what is genuine judgement. Where it is testable, we agree the metric, dataset and threshold in advance and run it, which turns a debate into an experiment. Where it is judgement, I state both positions with the risk each is optimising against and escalate to whoever owns it. My best example is one where the agreed test showed I was wrong.",
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
      "simple": "Short, forward-looking, and consistent with everything else you have said.\n\nThe reason should be about what you want next rather than what is wrong where you are. \"I have taken our RAG platform as far as the scope allows and I want to work on systems at a larger scale\" is complete, and it is true for a great many people.\n\nNever criticise your current employer, manager or team. It costs you nothing to be gracious and it costs a surprising amount not to be - the panel is imagining how you will describe them in two years.\n\nThen say what you are looking for, and make it specific enough to be checkable against the role: the kind of problem, the scale, the ownership. If it does not match the job, they should know now, and so should you.\n\nKeep it to thirty seconds. This question has no upside beyond being answered cleanly - the only outcomes are neutral and bad, so take the neutral one and move on.",
      "points": [
        "Forward-looking: what you want, not what is wrong.",
        "Never criticise the current employer, manager or team.",
        "Be specific about the problem, scale and ownership you want.",
        "Consistent with your story in every other round.",
        "Thirty seconds. There is no upside in a long answer here."
      ],
      "say": "Adapted to your facts: I have taken our retrieval platform about as far as the current scope allows, and I want to work on systems at a larger scale with more ownership of the evaluation and production side. I have had a good run here and I would happily work with the team again. What I am looking for is a role where the GenAI work is the product rather than an internal tool, which is why this one interested me.",
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
      "simple": "I avoid anchoring on one number before I understand the level and package. I first ask for the approved compensation range and confirm what the company includes in total compensation: base, bonus, equity or other regular components.\n\nIf I need to give a number, I use a researched range for the role, level and location, and I make sure the bottom is a number I would genuinely accept. I also distinguish expected compensation from current compensation; in many markets those are separate conversations and local rules about salary history differ.\n\nI keep the tone factual. Compensation is one part of the decision along with role scope, level, location, flexibility and growth. If the offer later differs from the responsibilities or market evidence, I explain the gap directly and ask whether the level or package can be revisited.\n\nI do not negotiate during a technical problem unless the interviewer explicitly owns compensation; normally I take that conversation back to the recruiter or hiring contact.",
      "points": [
        "Ask for the role's approved range and what total compensation includes.",
        "If pressed, give a researched range whose lower end you would accept.",
        "Separate role expectations from current salary history; local rules vary.",
        "Ground negotiation in level, scope, location and market evidence.",
        "Keep detailed compensation discussion with the recruiter/hiring contact."
      ],
      "say": "I would first ask for the approved range and what the company includes in total compensation, because base, bonus and equity can make two numbers look very different. If you need my expectation now, I can give a researched range for this level and location, with a lower end I would accept. I would rather align it with the scope than negotiate from my current salary, and I am happy to handle the detailed discussion with the recruiter.",
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
      "simple": "I answer with the contract, not a market stereotype. I state my formal notice period, any confirmed flexibility such as unused leave or a written buyout policy, and the earliest start date I can responsibly commit to.\n\nI do not promise an accelerated release that depends on a manager approving something I have not asked for yet. If the hiring team has a hard deadline, I say what I can explore and when I can confirm it.\n\nNotice periods vary widely by country, employer and contract, so a good answer is specific to my situation. The same applies to relocation, visa transfer, background checks or project handover: I disclose a real constraint early enough for the company to plan around it.\n\nThen I keep communication updated. If the date changes after resignation or a handover discussion, I tell the recruiter immediately rather than waiting until the week before joining.",
      "points": [
        "Quote the formal contract and a realistic earliest start date.",
        "Do not promise unapproved buyout or early release.",
        "Disclose material visa, relocation or handover constraints early.",
        "If the employer has a hard deadline, explain what is and is not negotiable.",
        "Update the recruiter as soon as the date changes."
      ],
      "say": "My formal notice period is the one in my contract, and I would give you the earliest date I can responsibly commit to rather than promise an unapproved early release. If a written buyout, leave balance, visa or relocation option could change it, I will explain what is confirmed and what still needs approval. If your team has a hard start-date requirement, I will check the realistic options and update you when I have a firm answer.",
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
      "simple": "Have three, and make them about the work rather than the perks.\n\nThe ones that reveal most, and that signal seniority by being asked at all: how do you currently measure whether a GenAI feature is working - the answer tells you whether they have evaluation or vibes. What is in production today versus in a pilot - the ratio tells you what this job actually is. And who owns the decision when the model is not good enough for a use case.\n\nThen one about the role: what would the first ninety days look like, and what would make this hire clearly successful in a year.\n\nWhat to avoid: anything answerable from the careers page, and compensation in a technical round.\n\nAnd listen to the answers rather than performing the questions. If they cannot describe how they measure quality, you have learned something important about the job - and that is worth as much to you as anything they learned about you.",
      "points": [
        "How do you measure whether a GenAI feature works? Reveals evaluation maturity.",
        "What is in production versus in pilot? Reveals what the job actually is.",
        "Who decides when the model is not good enough? Reveals ownership.",
        "What does success look like at ninety days and at a year?",
        "Nothing answerable from the careers page. No compensation in a technical round.",
        "Listen to the answers - you are also deciding."
      ],
      "say": "Three things. How do you currently measure whether a GenAI feature is working - I am interested in whether evaluation is in place or still being built. What is in production today versus in pilot, because that tells me what the work really is. And who owns the call when the model is not good enough for a use case. Then, what would make this hire clearly successful after a year.",
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
      "simple": "**Short version: one internal endpoint that every team calls instead of calling providers directly. It holds the real provider keys, checks who is calling, enforces budgets and rate limits, routes to the right model and logs usage - so security and cost are managed in one place.**\n\nWhy build it: without one, every team has its own provider keys, nobody knows who is spending what, and switching provider means changing twenty codebases.\n\nThe main parts.\n\nIdentity. Teams sign in with normal company identity or a gateway-issued key. The real provider keys live only in the gateway's secret store.\n\nQuotas and rate limits. Per team and per app: requests per minute, tokens per minute and a monthly budget. A token bucket works well - each team gets an allowance that refills over time, so short bursts are fine. Over the limit, return HTTP 429 with a retry time.\n\nRouting. One API format (often OpenAI-compatible) mapped to many providers. Aliases like \"fast\" or \"smart\" let the platform team swap models without app changes. Retries, fallbacks to another region or provider, and circuit breakers live here too (ops-06).\n\nLogging and cost. For every request, log team, model, tokens, latency and cost. Prompt and response bodies hold sensitive data, so store them only where policy allows, with redaction and retention limits.\n\nKeep it thin: it sits on every request, so it must add only milliseconds and scale out. And consider buying - LiteLLM, Portkey, Kong and Azure API Management's AI gateway features already cover most of this.",
      "points": [
        "One internal endpoint; provider keys only in the gateway.",
        "Per-team rate limits and token budgets (token bucket); 429 with a retry time.",
        "Model aliases and routing, retries, fallback provider or region, circuit breaker.",
        "Usage log per request: team, model, tokens, latency, cost. Bodies only with redaction and retention.",
        "Optional central guardrails: PII redaction, content filters, an approved-model list.",
        "Stateless and horizontally scaled - and consider buying before building."
      ],
      "say": "A gateway is one internal endpoint every team calls instead of the providers. It holds the real provider keys, authenticates callers with company identity, and enforces per-team rate limits and token budgets. It routes model aliases to providers, with retries, fallbacks and circuit breakers. It logs team, model, tokens, latency and cost for every request, storing prompt bodies only where policy allows. And it must be stateless, fast and highly available.",
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
      "simple": "The first design decision, and I would say it explicitly: this is largely a workflow, not an open-ended agent. The steps are known - extract the receipt, classify the category, apply policy, submit, handle rejection. Only a few points genuinely need model judgement.\n\n    receipt -> extract -> categorise -> policy check -> submit -> track\n\nExtraction from a photographed receipt: vision model, per-field confidence, and a human confirmation step for anything uncertain. Receipts are crumpled and badly lit.\n\nCategorisation is a classification problem with a fixed taxonomy, so constrain the output to an enum rather than letting the model free-text a category.\n\nPolicy check is deterministic code, not a model. Per-diem limits, approval thresholds and eligible categories are rules, and rules belong in code where they are testable and auditable. The model may explain a rejection; it does not decide it.\n\nSubmission is a tool call into the expense system, and it must be idempotent - an idempotency key per filing, so a retry cannot file the same expense twice - plus a duplicate check on merchant, date and amount, because the same receipt photographed twice has a different file hash. Duplicate submissions are the failure that erodes trust fastest.\n\nWhere the agentic part actually earns its place: handling the unhappy path. A rejected claim needing clarification, a missing field the user must supply, a currency conversion, an out-of-policy item needing justification. Those branches are hard to enumerate, which is exactly the condition for an agent.\n\nGuardrails: never submit above a value threshold without explicit user confirmation, show the user what will be filed before filing, and keep an audit trail. And design the correction path - the user must be able to fix a misread amount easily, because they will need to.",
      "points": [
        "Mostly workflow; agentic only on the unhappy paths.",
        "Categorise into a fixed enum, not free text.",
        "Policy limits are deterministic code, never model judgement.",
        "Idempotency key per filing, plus duplicate detection on extracted fields.",
        "Show the user what will be submitted before submitting."
      ],
      "say": "I would build this mostly as a workflow, because the steps are known - extract, categorise, policy check, submit. Categorisation is constrained to a fixed enum and the policy limits are deterministic code, since rules belong where they are testable. Submission carries an idempotency key so a retry cannot double-file, plus a duplicate check on merchant, date and amount. The genuinely agentic part is the unhappy path: clarifications, missing fields, out-of-policy justifications.",
      "numbers": "Use an idempotency key per filing, plus a duplicate check on merchant, date and amount - a re-photographed receipt has a different file hash. Require explicit confirmation above a value threshold set with finance.",
      "wrong": "Building it as an open-ended agent because the brief said agent. Most of this is a known sequence, and an agent makes it slower, costlier and harder to audit.",
      "follow": "The agent misreads an amount as 5,000 instead of 500. Where does that get caught?"
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
      "simple": "**Short version: code search needs exact-name matching, whole functions as chunks, a fresh index and fast answers - and it must respect who can see which repo.**\n\nScope first: answer questions, review code, or generate it? Assume question answering and code explanation over a large monorepo, inside the IDE.\n\nCode retrieval differs from document retrieval in four ways.\n\nChunk by syntax. Parse the code into its structure (an AST - abstract syntax tree) and chunk by function or class, so each chunk is a complete unit. Keep the signature, docstring and imports with it.\n\nUse hybrid search. Developers search for exact names - a function, an error string, a config key. Vector search is weak at exact tokens; keyword search (BM25) catches them.\n\nUse the code graph. Code has explicit links: who calls what, what imports what. When you retrieve a function, also pull its callers and callees. That often beats adding more 'similar' chunks - measure it on your own questions.\n\nKeep it fresh. Re-index changed files on every merge, keyed by file hash. A stale index describing deleted code is worse than none.\n\nThen the product constraints. Speed: chat answers should start streaming within about a second, and inline completions need a few hundred milliseconds, or developers stop using it - so cache aggressively, stream, and use a small fast model for routine questions. IP: source code is sensitive, so use a self-hosted model or an enterprise endpoint with no training on your data and agreed retention. Permissions: filter by repository access on the server before any chunk reaches the model. And cite file and line so developers can check the answer.\n\n(Chunking code on its own is rag-48; this card is the product design around it.)",
      "points": [
        "Chunk on AST boundaries - functions and classes, with imports.",
        "Hybrid search is close to essential: developers search exact identifiers.",
        "Expand along the call graph, not just semantic neighbours.",
        "Incremental reindex on merge - stale code answers are harmful.",
        "Streaming within about a second in the IDE, and source code is IP."
      ],
      "say": "Code retrieval differs from documents. I chunk on AST boundaries so each chunk is a complete function with its signature and imports, and hybrid search is close to essential because developers search exact identifiers that dense vectors handle poorly. I expand along the call graph rather than just semantic neighbours. The index reindexes incrementally on merge, answers must start within about a second in the IDE, and source code being IP means self-hosting or a no-training endpoint.",
      "numbers": "Target first tokens within about a second for chat and a few hundred milliseconds for inline completion. Reindex incrementally on merge - a nightly rebuild is already stale for an active monorepo.",
      "wrong": "Applying a document RAG design unchanged. Character chunking splits functions, and pure dense retrieval fails on the identifier searches developers actually make.",
      "follow": "A developer asks why a function exists. Does your retrieval find the answer?"
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
      "simple": "**Short version: the hard part is reading messy scanned documents reliably, not the AI model - so check every field in code and send anything uncertain to a person.**\n\nScope it first, out loud. Ask what documents, what volume, what decisions depend on the output, and what the accuracy bar is. Assume claim documents, policy schedules and scanned hospital bills at a few thousand a day, feeding a human adjudication queue.\n\nThe architecture, and the weight sits at the front:\n\n    intake -> classify -> extract -> validate -> route -> review UI\n\nIntake normalises formats and captures provenance. Classify identifies the document type, which decides the extraction schema - a claim form and a discharge summary need different fields.\n\nExtraction is the hard part and it is mostly not an LLM problem. Scanned hospital bills are photographs, often skewed, sometimes handwritten, frequently in mixed scripts. So: OCR with a layout-aware model, then a vision-language model for the fields OCR mangles, and a deterministic parser for anything structured. Return confidence per field, not per document.\n\nValidate is where correctness is enforced. Cross-check totals arithmetically in code, verify the policy number exists, confirm dates are consistent. Any field below a confidence threshold goes to human review rather than through.\n\nRoute by confidence: high-confidence complete extractions to straight-through processing, anything else to a reviewer with the field highlighted on the source image.\n\nThen the things that make it real. Every extracted field links back to a bounding box on the source page, because a reviewer must verify without reading the whole document. PHI stays in-region with restricted logging. Full audit of what was extracted, by which model version, and who confirmed it.\n\nState the honest metric: not accuracy, but the share of documents processed without human touch at the required precision. That is what the business is buying.",
      "points": [
        "Extraction quality dominates - OCR and layout, not the LLM.",
        "Confidence per field, not per document.",
        "Validate arithmetically in code; low confidence routes to review.",
        "Link every field to a bounding box for fast human verification.",
        "The business metric is straight-through rate at a precision bar."
      ],
      "say": "I would scope volume and the accuracy bar first, then design around extraction, because scanned hospital bills are the hard part, not the model. OCR with layout awareness, a vision model for what OCR mangles, and per-field confidence. Validation checks totals in code and routes anything low-confidence to human review with the field highlighted on the source image. The metric that matters is straight-through rate at the required precision.",
      "numbers": "Report confidence per field rather than per document. Set the straight-through threshold with the business - start conservative and raise it as measured precision justifies.",
      "wrong": "Designing around the LLM and treating ingestion as a preprocessing detail. On scanned documents, extraction is where the project succeeds or fails.",
      "follow": "Ten percent of bills are handwritten. What does that do to your design?"
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
      "simple": "I normalise the inputs before I let the model reason over them. Text goes through the normal safety and intent path. Screenshots are checked for file type, size and sensitive content, then passed to vision/OCR as needed. Voice is streamed or uploaded to speech recognition, with confidence and language information preserved instead of pretending the transcript is perfect.\n\nAll modalities become a common request object containing the original evidence, extracted text, user identity and permissions. Retrieval still applies access control before documents reach the model.\n\nFor voice, latency is more visible, so I stream progress and the final response when possible, but I do not execute a sensitive action from a low-confidence transcript without confirmation.\n\nEvaluation is split by modality and by combinations: text only, screenshot plus question, noisy speech, code-switched language, and cases where OCR or speech recognition is wrong. Logs and retention must cover the original media, not only the final text transcript.",
      "points": [
        "Validate and normalise each modality before reasoning.",
        "Preserve OCR/speech confidence and original evidence.",
        "Apply the same identity and retrieval permissions to every modality.",
        "Confirm sensitive actions when speech/vision input is uncertain.",
        "Evaluate mixed-modality failures and govern original media in logs/retention."
      ],
      "say": "I normalise each modality first. Screenshots get type, size and sensitive-data checks before vision or OCR; voice keeps language and recognition confidence instead of turning an uncertain transcript into trusted text. I build a common request object with identity and permissions, then run retrieval and generation normally. Sensitive actions require confirmation when the source is uncertain. I evaluate text, image, speech and mixed cases separately, and my retention policy covers the original media as well as the transcript.",
      "numbers": "For voice, track time to first audio/text response, transcription error by language/noise condition, and task completion. For screenshots, track extraction/grounding errors rather than only final-answer preference.",
      "wrong": "Converting everything to text and discarding the original confidence and evidence. That hides OCR or speech errors and makes sensitive actions unsafe.",
      "follow": "The transcript confidence is low but the user says “yes” to a payment action. What exactly do you ask them to confirm?"
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
      "simple": "I start by defining which decisions truly need online scoring. Batch and real-time paths have different cost and reliability shapes, so I do not force every use case into one endpoint.\n\nThe batch path reads a versioned data snapshot, computes features, runs the pinned model over a large set, and writes predictions with model/data timestamps so downstream users know what they are looking at.\n\nThe online path needs low-latency features and a model service. I try to reuse the same feature definitions as training, often through shared transformation code or a feature platform, so the online value does not drift from what the model saw during training.\n\nEvents from production feed monitoring and future training data. I log model version, feature freshness, latency and outcomes where they become available.\n\nThen I design fallbacks: if an online feature is missing or the model service is down, use a safe default or recent batch score if the product allows it rather than timing out every user request.",
      "points": [
        "Separate batch and online paths by actual decision latency requirements.",
        "Version data, features and model with every prediction artifact.",
        "Reuse feature definitions to avoid train-serve skew.",
        "Log outcomes and freshness for monitoring and retraining.",
        "Define a safe fallback for missing features or online service failure."
      ],
      "say": "I separate batch and online scoring by the decision SLA. Batch jobs run a pinned model over a versioned data snapshot and write timestamped predictions. Online scoring uses low-latency features and a model service, but I keep the feature definitions shared with training so train-serve skew does not creep in. Production events feed monitoring and future training data. I also define a fallback, such as a recent batch score or safe default, for missing features or service failure.",
      "numbers": "Define separate freshness and latency SLOs for batch and online paths. A daily batch score and a 50 ms online feature cannot share one vague definition of “fresh enough.”",
      "wrong": "Putting the batch model behind the same synchronous API and calling it real time. Data freshness, feature access, throughput and failure handling are different design problems.",
      "follow": "Training uses a feature computed nightly but online scoring recomputes it from live events. How do you prove the two definitions match?"
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
      "simple": "I choose from the interaction pattern first.\n\nREST is a good default for simple request/response APIs, especially across teams and external clients because HTTP tooling and debugging are easy.\n\ngRPC fits strongly typed internal service-to-service calls where low overhead, code-generated contracts or streaming are useful and both sides can use the protocol comfortably.\n\nA queue or event bus is for asynchronous work. The caller should not have to hold a connection while a long ingestion, batch inference or agent job runs. It also buffers bursts and lets consumers scale independently. Kafka is a good event-stream choice when durable, replayable event histories (ordered per partition) and multiple consumers matter; a simpler work queue may be enough for background jobs.\n\nThe hard parts are retries and ownership. I define timeouts, idempotency keys, dead-letter handling, ordering requirements and what happens when a consumer is slower than the producer. The protocol does not remove those system-design questions.",
      "points": [
        "REST for straightforward request/response and broad interoperability.",
        "gRPC for typed internal RPC and efficient streaming where it fits.",
        "Queues/events for long-running or bursty asynchronous work.",
        "Choose Kafka when durable event streams/multiple consumers are real requirements.",
        "Design retries, idempotency, dead letters, ordering and backpressure explicitly."
      ],
      "say": "I start from the interaction pattern. REST is my simple request-response default and is easy to debug across teams. gRPC fits typed internal RPC or streaming when both sides support it. A queue or event bus fits long-running or bursty work where the caller should not hold a connection; Kafka earns its complexity when I need a durable event stream and multiple consumers. Whatever I choose, I still design timeouts, idempotency, retries, dead letters and backpressure.",
      "numbers": "Do not choose from a generic latency benchmark. Measure payload size, request rate, burstiness, consumer lag and acceptable end-to-end delay in your own system.",
      "wrong": "Choosing Kafka because the system is large, or gRPC because it is faster. The interaction and delivery requirements should justify the protocol.",
      "follow": "Your embedding consumer is falling behind the producer. Which backpressure and scaling signals do you inspect?"
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
      "simple": "I assume every network call can time out after the remote side actually completed the work. That means a retry can repeat a side effect unless I design for duplicates.\n\nEvery workflow or action gets a stable idempotency key. Before creating a payment, ticket or email, the service checks whether that key has already completed and returns the existing result instead of doing it again. Message consumers also store or atomically update a processed-event record so redelivery is harmless.\n\nRetries are bounded and only for temporary failures. Permanent failures go to a dead-letter or review path with enough context to repair them.\n\nFor backpressure, I do not let producers create infinite work. Queues have limits, consumers expose lag and processing rate, concurrency is capped, and overload can trigger admission control or a slower fallback.\n\nFinally, I trace the workflow with correlation ids so one user action can be followed across model calls, tools, messages and retries.",
      "points": [
        "Assume timeouts can happen after the remote side succeeded.",
        "Use stable idempotency keys for side effects and duplicate delivery.",
        "Retry temporary failures only and dead-letter/review permanent ones.",
        "Bound queues and concurrency; monitor lag and processing rate.",
        "Trace one workflow end to end with correlation ids."
      ],
      "say": "I assume a timeout can happen after the remote side succeeded, so every side effect needs a stable idempotency key and duplicate delivery must return the existing result. Retries are bounded and only for temporary failures; permanent cases go to a dead-letter or human-review path. I bound queue size and worker concurrency, monitor consumer lag and processing rate, and apply admission control or a fallback under overload. Correlation ids let me trace one workflow through every retry and tool call.",
      "numbers": "Track queue depth/lag, retry rate, duplicate-suppression count and processing throughput together. Capacity is safe only while sustained consumer throughput stays above incoming work or overload is deliberately shed.",
      "wrong": "Relying on “exactly once” as a magic broker setting. End-to-end side effects still need application-level idempotency and a clear duplicate policy.",
      "follow": "The model call timed out, you retry, and the provider bills both attempts. How do you prevent duplicate downstream actions even if duplicate compute cannot be avoided?"
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
      "simple": "Build what is differentiating. Buy what is undifferentiated but necessary.\n\nFor most companies, the differentiating part is the data, the domain logic and the evaluation - the things nobody else can copy because they come from your business. The undifferentiated parts are the model itself, the vector store, the tracing platform and the document parsers. Building those means maintaining them forever while a vendor improves theirs.\n\nThe specific questions I would ask: does it touch our proprietary data or our differentiating logic; would building it take more than a quarter; is there a mature option; what does the vendor's failure mode cost us; and can we get out later.\n\nThe trap to name is lock-in through data rather than through code. Swapping a vector database is a rebuild you can plan. Losing access to your traces and evaluation history is worse, because that is the institutional knowledge that lets you improve anything.\n\nSo buy the platform, own the data and the evaluation set, and keep the integration behind an interface.",
      "points": [
        "Build the differentiating part: data, domain logic, evaluation.",
        "Buy the undifferentiated necessity: models, stores, tracing, parsers.",
        "Ask: proprietary? more than a quarter to build? mature alternative? exit cost?",
        "Watch for lock-in through data, not code - traces and eval history especially.",
        "Own the evaluation set whatever you decide. It is the asset that transfers."
      ],
      "say": "Build what differentiates us, buy what is necessary but undifferentiated. The differentiating parts are the data, the domain logic and the evaluation set, because they come from our business and cannot be copied. Models, vector stores and tracing platforms are not. The trap I watch for is lock-in through data rather than code - losing our traces and evaluation history costs more than swapping a database. So I own the eval set regardless.",
      "numbers": "A useful rule: if building it takes more than a quarter and a mature option exists, buy it and spend the quarter on the data and evaluation instead.",
      "wrong": "\"We built our own framework for full control.\" It invites the question of what that control bought, and how much of the year went into maintaining it.",
      "follow": "You bought the platform and now need a feature they will not build. What now?"
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
      "simple": "\"We want AI\" is not a requirement. I turn it into a specific problem with a measurable outcome before I choose any model or architecture.\n\nI start by asking the client to walk through the current process using a real example: where does time go, where do errors happen, and who is affected? Then I quantify the basics - volume, handling time, error cost and current service level - so we have a baseline.\n\nNext I define success in business terms: what metric should move, by how much, and what must not get worse. Then I check feasibility: where the data lives, whether we can legally and technically access it, how accurate the system must be, what happens when it is wrong, and who owns the final decision.\n\nI also decide whether the system assists a human or automates a step, because that changes the risk and acceptance criteria. If the real issue is a broken workflow, missing integration or search problem, I say so. The goal is to solve the business problem, not to force AI into it.",
      "points": [
        "Ask them to walk through the current process with a real example.",
        "Quantify volume, time and error cost - no numbers, no business case.",
        "Define the measurable success metric before designing anything.",
        "Data access is a very common timeline killer - confirm it early.",
        "Be willing to conclude the answer is not AI."
      ],
      "say": "I start from the pain rather than the technology - walk me through the current process with a real example, then quantify volume, handling time and error cost. Then define success as a number that must move by a date. The questions that decide feasibility are data access, the accuracy bar, who is accountable when it is wrong, and whether the human assists or is replaced. And I stay willing to say the answer is not AI.",
      "numbers": "Without volume, handling time and error cost, there is no business case. Get those three numbers before proposing an architecture.",
      "wrong": "Taking the brief literally and proposing a chatbot. It wins the meeting and produces a pilot that never reaches production because nobody defined what success was.",
      "follow": "You conclude their problem does not need AI. How do you say that to the client?"
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
      "simple": "The honest framing first: GenAI projects are harder to estimate than conventional software because quality is discovered rather than specified. You do not know how good retrieval will be until you build it on real data. So I estimate in phases with decision points, not as one number.\n\nDiscovery, one to two weeks. Data access, a sample corpus, feasibility on twenty real examples, and a defined success metric. The deliverable is a go or no-go with evidence, and this phase de-risks everything after it.\n\nPilot, four to six weeks. A working end-to-end system on real data with a real eval set, tested by actual users rather than the project team. The deliverable is a measured quality number against the agreed metric.\n\nHardening, six to ten weeks, and this is the phase everyone underestimates. Security review, permissions, guardrails, observability, cost controls, error handling, load testing, integration with the real systems. It is routinely at least as long as the pilot and it is where prototypes go to die.\n\nRollout and stabilisation, four or more weeks. Phased users, monitoring, feedback loop, tuning against real traffic.\n\nThe estimation rules I would state: as a planning heuristic, pilot to production often takes two to three times the pilot effort, not a small increment. Data access delays are among the most common overruns and they are outside your control, so flag them as a dependency with a named owner. And evaluation infrastructure is real work that must be in the plan rather than assumed.\n\nGive a range with the assumptions written down, and put the go or no-go gate after discovery so the client is not committing to a full build before feasibility is known.",
      "points": [
        "Quality is discovered, not specified - estimate in phases with gates.",
        "Discovery 1–2 weeks, pilot 4–6, hardening 6–10, rollout 4+.",
        "Hardening is routinely at least as long as the pilot, and often underestimated.",
        "Data access delays are among the most common overruns.",
        "Give a range with assumptions, and gate after discovery."
      ],
      "say": "I estimate in phases with decision gates, because quality is discovered rather than specified. Discovery is one to two weeks to prove feasibility on real examples and agree a metric. Pilot is four to six weeks to a measured number. Hardening - security, permissions, observability, cost controls - is six to ten and is what teams underestimate. Then phased rollout. I give a range with assumptions and gate the commitment after discovery.",
      "numbers": "A planning heuristic, not a law: pilot to production often takes 2–3× the pilot effort - the phases above give 10–14+ weeks after a 4–6 week pilot. Hardening is commonly at least as long as the pilot.",
      "wrong": "Quoting a single number for the whole project. It hides the feasibility uncertainty, and it sets up the conversation where hardening looks like scope creep.",
      "follow": "The client wants a fixed price for the whole thing. What do you propose?"
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
      "simple": "Not with the technology. Sceptical stakeholders have usually seen a demo that impressed them and delivered nothing, so more capability talk confirms their scepticism.\n\nStart from a problem they already complain about, and use their metric - handling time, backlog, turnaround, cost per case. Then quantify the current cost of that problem in their terms, because that number is what a budget is compared against.\n\nThen propose the smallest thing that tests it. A time-boxed pilot on one narrow workflow, with a defined success metric agreed in advance and a stated kill criterion. Being the person who says \"and if it does not hit this number, we stop\" is what converts scepticism, because it shows you are not selling.\n\nThen be straight about limitations: it will be wrong sometimes, here is where a human stays in the loop, here is the running cost, here is what it does not do.\n\nThe credibility comes from the kill criterion and the honesty about failure modes, not from the upside.",
      "points": [
        "Start from a problem they already complain about, in their metric.",
        "Quantify what that problem costs today.",
        "Propose the smallest time-boxed pilot on one narrow workflow.",
        "Agree the success metric - and a kill criterion - in advance.",
        "State the limitations, the human-in-the-loop point and the running cost.",
        "Credibility comes from the kill criterion, not the upside."
      ],
      "say": "Not with the technology, because they have usually seen a demo that delivered nothing. I start from a problem they already complain about, in their metric, and quantify what it costs today. Then I propose the smallest time-boxed pilot on one narrow workflow, with the success metric and a kill criterion agreed in advance. And I state the limitations and running cost up front. The kill criterion is what converts scepticism.",
      "numbers": "Time-box the pilot - six to eight weeks on one workflow with one agreed metric. Open-ended pilots are how these projects quietly die.",
      "wrong": "Leading with what the technology can do. It is the same pitch that produced the demo they already distrust.",
      "follow": "The pilot hit its metric but nobody is using it. What happened?"
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
      "simple": "Say what it cannot do, why, and what you did about it - in their language, without hedging.\n\nThe mistake is softening it into vagueness. \"The model may occasionally produce inaccurate results\" means nothing to a stakeholder and gives you no cover later. \"About one answer in twenty needs correction, which is why every response shows its source and why a person approves anything that changes a record\" is honest, concrete, and it sets up the control as a feature rather than an apology.\n\nUse their frame. To a support manager, \"treat it like a well-read new joiner - fast, useful, and you check its work before it goes to a customer\" lands better than any accuracy statistic.\n\nThen give them the number you will report on, so the limitation is monitored rather than merely disclosed.\n\nAnd say it early. A limitation disclosed before launch is a design decision. The same limitation disclosed after an incident is a surprise, and that distinction is what determines whether you are trusted the next time.",
      "points": [
        "Concrete over hedged. A vague warning protects nobody.",
        "Pair the limitation with the control you built for it.",
        "Use their frame, not model vocabulary.",
        "Give a number you will report on, so it is monitored not just disclosed.",
        "Disclose early - before launch it is a design decision, after an incident it is a surprise."
      ],
      "say": "Concretely, and early. Not \"it may occasionally be inaccurate\", which means nothing, but \"about one answer in twenty needs correction, which is why every response shows its source and why a person approves anything that changes a record\". I use their frame rather than model vocabulary, and I give them the number I will report on, so the limitation is monitored rather than just disclosed once.",
      "numbers": "Whatever accuracy figure you quote, commit to reporting it on a schedule. A one-time disclosure is not expectation management.",
      "wrong": "\"I explain that LLMs are probabilistic.\" True, and it transfers the problem to them instead of telling them what to do about it.",
      "follow": "They ask you to guarantee it will never be wrong. What do you say?"
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
      "simple": "I state the competing offer as useful scheduling information, not as a threat. I give the real decision deadline and, if I have a genuine preference, I say it plainly. That lets the hiring team decide whether they can accelerate their process.\n\nI do not invent an offer or hide the deadline behind vague language. If I want a change in level or compensation, I ask directly and explain the reason from role scope, responsibilities or market evidence rather than expecting the other offer to do the arguing for me.\n\nThen I make my own decision based on the whole role: work, manager, level, compensation, location, flexibility and risk. I do not keep extending deadlines that are not real.\n\nIf I accept, I treat that as a serious commitment. Circumstances can change, but using acceptances casually as negotiating placeholders damages trust and creates unnecessary disruption for both teams.",
      "points": [
        "Share the real decision deadline so the team can act.",
        "State a genuine preference if you have one, without threatening.",
        "Never invent an offer or a false deadline.",
        "Ask directly about level/compensation using role evidence.",
        "Treat an acceptance as a serious commitment."
      ],
      "say": "I do have another offer with a real decision deadline, and I would share that date early so you can decide whether the process can move. If this role is my preference, I will say why rather than use the other offer as a threat. If I need to discuss level or compensation, I will ask directly and ground it in the scope. Either way, I will give both companies a clear answer by the dates I commit to instead of creating artificial pressure.",
      "numbers": "The only important number here is the real decision deadline. Give the exact date rather than saying 'soon' if you expect the company to act on it.",
      "wrong": "Inventing or exaggerating another offer to create leverage. The short-term pressure is not worth the credibility risk.",
      "follow": "We cannot match it. Would you still join?"
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
      "simple": "I clarify languages, scripts, channel and allowed actions first. Assume several languages, some code-switching or transliteration, intermittent mobile connectivity, and both text and voice support.\n\nThe channel shapes the state model. On asynchronous messaging, a user may disappear for an hour and return on another device, so session state must be durable and resumable rather than tied to one open web connection. Responses should be concise and useful even if streaming is unavailable.\n\nLanguage handling happens per message, not once per account. Users can switch languages mid-conversation or type one language in another script. I normalise common transliteration patterns for search while preserving the original text for audit and display.\n\nRetrieval needs cross-language testing when the knowledge base and user query use different languages. I choose multilingual embeddings or translation only after measuring recall on the languages we serve.\n\nCost and latency also need per-language measurement because tokenisation and speech recognition differ by model and script. Voice input keeps transcription confidence, and sensitive actions require confirmation when the transcript is uncertain.\n\nFinally, every important metric is sliced by language and channel; an overall average can hide the one market that is failing.",
      "points": [
        "Use durable state for intermittent/asynchronous channels.",
        "Detect language per message and handle code-switching/transliteration.",
        "Test cross-language retrieval rather than assuming it works.",
        "Measure cost, latency and speech quality per language/channel.",
        "Confirm sensitive actions when transcript confidence is low."
      ],
      "say": "I start from the channel and language mix. Intermittent messaging needs durable session state because users disappear and return. I detect language per message, handle code-switching and transliteration, and test cross-language retrieval when the knowledge base uses a different language. I measure token use, latency and speech-recognition quality by language instead of applying one English benchmark. For voice, I keep transcript confidence and explicitly confirm sensitive actions when the source is uncertain.",
      "numbers": "Measure per-language token use, retrieval recall, speech error rate, latency and task completion on representative traffic. Indic scripts such as Devanagari often cost roughly 1.5–3× the tokens of equivalent English depending on the tokenizer, so measure on your own traffic rather than applying one multiplier to every language.",
      "wrong": "Treating multilingual support as a translation layer at the edge. Language changes retrieval, tokenisation, speech quality, evaluation and sometimes the whole channel design.",
      "follow": "A user mixes two languages and types both in Latin script. How does your retrieval pipeline normalise without losing the original meaning?"
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
      "simple": "This is a judgement question, and it wants a real example with a real cost to saying no. Structure it as situation, your analysis, how you communicated it, and the outcome.\n\nWhat makes a strong answer is the analysis being specific and quantified rather than a general reservation. Good reasons to say no, with the shape of the evidence:\n\nThe accuracy bar was unreachable. The process needed near-perfect extraction and measurement on a real sample showed a gap too large to close with the available data.\n\nThe economics did not work. Cost per transaction exceeded the value of the transaction - that is a calculation you can put in front of a finance stakeholder.\n\nA deterministic solution was better. The real problem was an unindexed knowledge base or a missing integration, and search or a rules engine solved it more reliably and far cheaper.\n\nThe data was not there. No labelled examples, no ground truth, no way to evaluate - so nobody could tell whether it was working.\n\nRegulation forbade it. The decision legally required a human, so automation was not on the table regardless of quality.\n\nThen the part that actually distinguishes the answer: how you said it. Bring evidence, not opinion - a measurement on their data beats an argument. Offer the alternative rather than only the refusal; 'this will not work, and here is what will' keeps you a partner. And frame it as protecting them from a failed programme.\n\nClose with the outcome. Ideally the alternative shipped and worked. If they overruled you, say what happened and what you learned - that is also a real answer, and honest.",
      "points": [
        "Bring quantified evidence measured on their data, not opinion.",
        "Common valid reasons: accuracy bar, economics, determinism, no data, regulation.",
        "Always pair the no with a concrete alternative.",
        "Frame it as protecting them from a failed programme.",
        "State the outcome, including if you were overruled."
      ],
      "say": "I would give a specific example where I measured on their data rather than arguing from principle - for instance an extraction task where the required accuracy was unreachable with the available labelled examples, or where cost per transaction exceeded the transaction's value. The key is bringing evidence and pairing the no with a concrete alternative that does work, so it reads as protecting the programme rather than declining the work.",
      "numbers": "A measurement on twenty real examples from their data carries more weight than any argument from principle.",
      "wrong": "A generic answer about managing expectations. The question wants a specific decision with a cost attached, and the follow-up will ask what you measured and what saying no cost.",
      "follow": "They disagreed and went ahead anyway. What did you do?"
    }
  ]
};
