/* Topic 18 — System design, project story and behavioural.
   Grounding: published interview processes describing the design and hiring
   manager rounds, plus what those rounds are structurally testing. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["18-system-design"] = {
  lede: "This topic decides more offers than any technical subject, and candidates prepare for it least. The design round is not testing whether you know the components — you do. It is testing whether you gather requirements before naming technology. The manager round is not testing what you built. It is testing whether you owned it.",
  grounding: "published interview processes + what these rounds structurally test",
  evening: ["sd-01", "sd-03", "sd-05", "sd-07", "sd-09"],

  cards: [
    {
      id: "sd-01",
      q: "Design a GenAI assistant for our support team. You have 45 minutes.",
      round: ["tech2"],
      level: "5-10",
      tags: ["system-design", "process", "requirements"],
      why: "The open design prompt. Most candidates fail it in the first two minutes by naming technology.",
      simple:
        "The first five minutes decide the round, and they are not about architecture.\n\n" +
        "Ask questions. Who uses this — agents on a call, or customers directly? That single answer changes latency requirements, tone, guardrails and the whole risk profile. How many requests at peak. What is the latency budget. What data does it answer from and how often does it change. Who is allowed to see what. What does success look like in a number the business already tracks. And what is explicitly out of scope.\n\n" +
        "Then state your assumptions out loud and get them confirmed, so the rest of the discussion has a shared basis.\n\n" +
        "Then design from those constraints, in this order: data flow first — where documents come from and how they get indexed — then retrieval, then generation, then guardrails, then evaluation, then operations. Draw it. Talk through one request end to end.\n\n" +
        "Then name the trade-offs you made and what you would do differently at ten times the scale. The interviewer is marking whether you can be pushed on a choice and defend or change it, not whether you produced the diagram they had in mind.",
      points: [
        "Five minutes of questions first: users, volume, latency, data, permissions, success metric, scope.",
        "State assumptions and get them confirmed.",
        "Design in order: data flow, retrieval, generation, guardrails, evaluation, operations.",
        "Walk one request end to end out loud.",
        "Name trade-offs unprompted, and what changes at 10× scale.",
        "Expect to be pushed. Defending or changing well are both good outcomes."
      ],
      say: "I would start with questions, because the answers change the design. Who uses it — agents on a call or customers directly, since that changes latency, tone and risk. Peak volume, latency budget, what data it answers from and how often it changes, who may see what, and what success looks like in a metric you already track. Then I state my assumptions, design data flow first, and walk one request end to end.",
      numbers: "Spend roughly the first 5 minutes of a 45-minute round on requirements. Candidates who skip it almost always design the wrong system confidently.",
      wrong: "Opening with \"I'd use LangChain with a vector database.\" You have chosen technology before knowing the volume, the latency budget or the permission model. It is the most common way this round is lost.",
      follow: "Now the same system for 10,000 concurrent users. What changes?"
    },

    {
      id: "sd-02",
      q: "How do you decide between building and buying?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["system-design", "judgement", "business"],
      why: "A senior judgement question. Engineers reflexively build, and the panel is checking for commercial reasoning.",
      simple:
        "Build what is differentiating. Buy what is undifferentiated but necessary.\n\n" +
        "For most companies, the differentiating part is the data, the domain logic and the evaluation — the things nobody else can copy because they come from your business. The undifferentiated parts are the model itself, the vector store, the tracing platform and the document parsers. Building those means maintaining them forever while a vendor improves theirs.\n\n" +
        "The specific questions I would ask: does it touch our proprietary data or our differentiating logic; would building it take more than a quarter; is there a mature option; what does the vendor's failure mode cost us; and can we get out later.\n\n" +
        "The trap to name is lock-in through data rather than through code. Swapping a vector database is a rebuild you can plan. Losing access to your traces and evaluation history is worse, because that is the institutional knowledge that lets you improve anything.\n\n" +
        "So buy the platform, own the data and the evaluation set, and keep the integration behind an interface.",
      points: [
        "Build the differentiating part: data, domain logic, evaluation.",
        "Buy the undifferentiated necessity: models, stores, tracing, parsers.",
        "Ask: proprietary? more than a quarter to build? mature alternative? exit cost?",
        "Watch for lock-in through data, not code — traces and eval history especially.",
        "Own the evaluation set whatever you decide. It is the asset that transfers."
      ],
      say: "Build what differentiates us, buy what is necessary but undifferentiated. The differentiating parts are the data, the domain logic and the evaluation set, because they come from our business and cannot be copied. Models, vector stores and tracing platforms are not. The trap I watch for is lock-in through data rather than code — losing our traces and evaluation history costs more than swapping a database. So I own the eval set regardless.",
      numbers: "A useful rule: if building it takes more than a quarter and a mature option exists, buy it and spend the quarter on the data and evaluation instead.",
      wrong: "\"We built our own framework for full control.\" It invites the question of what that control bought, and how much of the year went into maintaining it.",
      follow: "You bought the platform and now need a feature they will not build. What now?"
    },

    {
      id: "sd-03",
      q: "Tell me about a GenAI project you built.",
      round: ["screening", "manager"],
      level: "5-10",
      tags: ["story", "behavioural", "ownership"],
      why: "The most predictable question in the process, and the most commonly wasted.",
      simple:
        "Have a two-minute version and a ten-minute version, and know which one is being asked for. In a screening call, two minutes.\n\n" +
        "The structure that works: the problem in business terms and who had it. What you built, in one or two sentences — no component tour. Your specific role, stated plainly, because a panel assumes \"we\" means you watched. One hard decision you made and the trade-off in it. The result, with a number. And one thing you would do differently.\n\n" +
        "The differentiator is specificity. \"We built a RAG chatbot for internal documents\" describes a thousand projects. \"Four hundred support agents, twelve thousand policy pages, we cut average handling time from nine minutes to six\" describes yours.\n\n" +
        "And be honest about your part. If you owned retrieval and someone else owned the front end, say that. Claiming the whole system falls apart under one follow-up question about a part you did not build, and that recovery is very hard.",
      points: [
        "Two-minute and ten-minute versions. Know which is wanted.",
        "Problem in business terms, then what you built in one or two sentences.",
        "State your specific role. \"We\" reads as \"I watched\".",
        "One hard decision and its trade-off.",
        "A result with a number.",
        "One thing you would do differently — it makes the whole story credible."
      ],
      say: "I built a policy assistant for about four hundred internal support agents over roughly twelve thousand pages. I owned retrieval and evaluation; a colleague owned the interface. The hard decision was rejecting long-context in favour of retrieval, because we needed per-user document permissions. Average handling time went from about nine minutes to six over a quarter. I would have built the delete path in ingestion from day one.",
      numbers: "Use your real numbers — users, documents, the metric before and after, and the timeframe. Vague scale reads as a project you observed.",
      wrong: "A component tour: \"we used LangChain, Pinecone, GPT-4 and Streamlit.\" It answers what you installed, not what you did.",
      follow: "What was the hardest part, and what did you get wrong?"
    },

    {
      id: "sd-04",
      q: "What went wrong on that project?",
      round: ["manager"],
      level: "5-10",
      tags: ["story", "behavioural", "ownership", "failure"],
      why: "The question the whole manager round hinges on. A frictionless story is not believed.",
      simple:
        "You need a real failure, and it has to be one you owned.\n\n" +
        "The shape: what went wrong, how you found out — and being found out by a user rather than by your monitoring is fine to admit, it is often the honest answer — what the impact was, what you did immediately, what you changed so it could not recur, and what it taught you.\n\n" +
        "Choose a failure that is technical, specific and recoverable. Ingestion never handled document deletion, so withdrawn policies kept being quoted for three weeks. The evaluation set was written by engineers, so real users failed in ways we never tested. We shipped without cost monitoring and found out from finance.\n\n" +
        "What to avoid: a failure caused entirely by someone else, which reads as blame; a disguised humblebrag like \"we were too ambitious\"; and anything that suggests you would repeat it.\n\n" +
        "The one that lands hardest is where the failure was a gap in your judgement, not your knowledge — you knew how to build the delete path and decided it could wait. That is the answer of someone who has learned something.",
      points: [
        "Real, specific, technical, owned by you.",
        "How you found out — including if it was a user rather than monitoring.",
        "Impact, immediate action, structural fix, lesson.",
        "Avoid blame, avoid humblebrags, avoid anything you would repeat.",
        "Strongest version: a judgement gap, not a knowledge gap."
      ],
      say: "Our ingestion handled document updates but never handled deletes, so a withdrawn policy kept being quoted for three weeks. Support found it, not our monitoring. I added tombstone handling and a nightly reconciliation between source and index, and stale-answer reports went to zero. The honest lesson is that I knew the delete path was missing and judged it could wait, which was the actual mistake.",
      numbers: "Include the duration and the impact. \"Three weeks, caught by support, zero reports after the fix\" is credible in a way that an unquantified story is not.",
      wrong: "\"We didn't face major issues.\" It answers a different question and throws away the round's best opportunity to show ownership.",
      follow: "How would you have caught that earlier?"
    },

    {
      id: "sd-05",
      q: "How would you convince a sceptical stakeholder to fund a GenAI project?",
      round: ["manager", "hr"],
      level: "5-10",
      tags: ["story", "business", "communication"],
      why: "Senior engineers are expected to sell work, not just do it. Services and consulting panels press hard here.",
      simple:
        "Not with the technology. Sceptical stakeholders have usually seen a demo that impressed them and delivered nothing, so more capability talk confirms their scepticism.\n\n" +
        "Start from a problem they already complain about, and use their metric — handling time, backlog, turnaround, cost per case. Then quantify the current cost of that problem in their terms, because that number is what a budget is compared against.\n\n" +
        "Then propose the smallest thing that tests it. A time-boxed pilot on one narrow workflow, with a defined success metric agreed in advance and a stated kill criterion. Being the person who says \"and if it does not hit this number, we stop\" is what converts scepticism, because it shows you are not selling.\n\n" +
        "Then be straight about limitations: it will be wrong sometimes, here is where a human stays in the loop, here is the running cost, here is what it does not do.\n\n" +
        "The credibility comes from the kill criterion and the honesty about failure modes, not from the upside.",
      points: [
        "Start from a problem they already complain about, in their metric.",
        "Quantify what that problem costs today.",
        "Propose the smallest time-boxed pilot on one narrow workflow.",
        "Agree the success metric — and a kill criterion — in advance.",
        "State the limitations, the human-in-the-loop point and the running cost.",
        "Credibility comes from the kill criterion, not the upside."
      ],
      say: "Not with the technology, because they have usually seen a demo that delivered nothing. I start from a problem they already complain about, in their metric, and quantify what it costs today. Then I propose the smallest time-boxed pilot on one narrow workflow, with the success metric and a kill criterion agreed in advance. And I state the limitations and running cost up front. The kill criterion is what converts scepticism.",
      numbers: "Time-box the pilot — six to eight weeks on one workflow with one agreed metric. Open-ended pilots are how these projects quietly die.",
      wrong: "Leading with what the technology can do. It is the same pitch that produced the demo they already distrust.",
      follow: "The pilot hit its metric but nobody is using it. What happened?"
    },

    {
      id: "sd-06",
      q: "How do you explain a limitation to a non-technical stakeholder?",
      round: ["manager", "hr"],
      level: "5-10",
      tags: ["story", "communication", "expectations"],
      why: "Expectation management is most of a senior role, and this is a fast way to test it.",
      simple:
        "Say what it cannot do, why, and what you did about it — in their language, without hedging.\n\n" +
        "The mistake is softening it into vagueness. \"The model may occasionally produce inaccurate results\" means nothing to a stakeholder and gives you no cover later. \"About one answer in twenty needs correction, which is why every response shows its source and why a person approves anything that changes a record\" is honest, concrete, and it sets up the control as a feature rather than an apology.\n\n" +
        "Use their frame. To a support manager, \"treat it like a well-read new joiner — fast, useful, and you check its work before it goes to a customer\" lands better than any accuracy statistic.\n\n" +
        "Then give them the number you will report on, so the limitation is monitored rather than merely disclosed.\n\n" +
        "And say it early. A limitation disclosed before launch is a design decision. The same limitation disclosed after an incident is a surprise, and that distinction is what determines whether you are trusted the next time.",
      points: [
        "Concrete over hedged. A vague warning protects nobody.",
        "Pair the limitation with the control you built for it.",
        "Use their frame, not model vocabulary.",
        "Give a number you will report on, so it is monitored not just disclosed.",
        "Disclose early — before launch it is a design decision, after an incident it is a surprise."
      ],
      say: "Concretely, and early. Not \"it may occasionally be inaccurate\", which means nothing, but \"about one answer in twenty needs correction, which is why every response shows its source and why a person approves anything that changes a record\". I use their frame rather than model vocabulary, and I give them the number I will report on, so the limitation is monitored rather than just disclosed once.",
      numbers: "Whatever accuracy figure you quote, commit to reporting it on a schedule. A one-time disclosure is not expectation management.",
      wrong: "\"I explain that LLMs are probabilistic.\" True, and it transfers the problem to them instead of telling them what to do about it.",
      follow: "They ask you to guarantee it will never be wrong. What do you say?"
    },

    {
      id: "sd-07",
      q: "Design a system where the model must never expose one customer's data to another.",
      round: ["tech2"],
      level: "5-10",
      tags: ["system-design", "multi-tenant", "security"],
      why: "A constraint-driven design question. It rewards defence in depth over a single clever idea.",
      simple:
        "The design principle to state first: isolation is enforced by the infrastructure, never by the model. The model has no idea who is asking and can be argued with. So every control lives in code, before and after the model call.\n\n" +
        "Storage: separate collections or namespaces per tenant is the strongest option and it scales to hundreds of tenants. A shared collection with a tenant filter is acceptable only if the engine pre-filters, never post-filters, and if that filter is applied in a shared layer no feature team can bypass.\n\n" +
        "Query path: tenant identity comes from the authenticated session, never from a request parameter the client can set, and it is injected by the framework rather than by each caller.\n\n" +
        "Caching: every cache key includes the tenant. This is the most common leak in multi-tenant GenAI systems, because caching is added later by someone optimising cost.\n\n" +
        "Traces and evaluation data: tenant-scoped too, since a trace holds the prompt and the prompt holds their data.\n\n" +
        "Then verification: automated tests that attempt cross-tenant access on every build, and an audit log good enough to prove isolation held.",
      points: [
        "Isolation in infrastructure, never in the prompt.",
        "Separate namespaces per tenant where possible; pre-filter only if shared.",
        "Tenant identity from the authenticated session, injected centrally.",
        "Every cache key includes the tenant. This is the classic leak.",
        "Traces and eval data are tenant-scoped — they contain prompts.",
        "Cross-tenant access attempts as automated tests on every build.",
        "An audit log that can prove isolation held, not just assert it."
      ],
      say: "Isolation is enforced by infrastructure, never by the model, because the model does not know who is asking. Separate namespaces per tenant where I can, and a pre-filter applied in a shared layer no feature team can bypass if I cannot. Tenant identity comes from the authenticated session and is injected centrally. Every cache key includes the tenant, since that is the classic leak. Traces are tenant-scoped too.",
      numbers: "No number applies — this is a binary control. What you measure is that the cross-tenant test suite runs on every build and has never passed a leak.",
      wrong: "\"We add tenant_id to the metadata filter.\" Necessary and insufficient. It leaves caching, traces and the post-filter question unaddressed, and caching is where the leak usually is.",
      follow: "Someone adds a response cache to cut costs. What review catches the problem?"
    },

    {
      id: "sd-08",
      q: "How do you handle disagreement with a colleague on a technical decision?",
      round: ["manager", "hr"],
      level: "5-10",
      tags: ["behavioural", "collaboration"],
      why: "A standard behavioural question. In GenAI it is usually asked because these decisions are unusually opinion-driven.",
      simple:
        "The useful version of this answer is about converting opinion into evidence, because in GenAI most disagreements are genuinely undecidable by argument — whether a reranker is worth the latency, whether to fine-tune, whether an agent is needed.\n\n" +
        "So the approach: separate what is testable from what is judgement. Where it is testable, agree the test in advance — the metric, the dataset, the threshold — and run it. That converts a debate into an experiment and takes seniority out of it, which is what usually makes the disagreement productive.\n\n" +
        "Where it is judgement, make both positions explicit including the risk each is optimising against, escalate to whoever owns the decision, and commit to the outcome properly.\n\n" +
        "Then have a real example, ideally one where you were wrong. \"I argued against the reranker on latency grounds, we agreed a test, it added 180 milliseconds and lifted answer accuracy enough that I was clearly wrong, and we shipped it\" is a stronger story than any disagreement you won.\n\n" +
        "Disagree and commit, genuinely — including not relitigating it a month later.",
      points: [
        "Separate testable from judgement.",
        "Testable: agree the metric, dataset and threshold in advance, then run it.",
        "Judgement: state both positions and their risks, escalate to the owner, commit.",
        "Have an example where you were wrong. It is stronger than one you won.",
        "Commit properly — no relitigating it later."
      ],
      say: "Most GenAI disagreements are testable, so I separate what evidence can settle from what is genuine judgement. Where it is testable, we agree the metric, dataset and threshold in advance and run it, which turns a debate into an experiment. Where it is judgement, I state both positions with the risk each is optimising against and escalate to whoever owns it. I once argued against a reranker on latency and the test showed I was wrong.",
      numbers: "No number applies, but the answer is stronger if the example carries one — what the test measured and what it showed.",
      wrong: "\"I explain my reasoning and usually they agree.\" It says you have not had a real disagreement, or you do not notice losing them.",
      follow: "What if the test is inconclusive and a decision is needed this week?"
    },

    {
      id: "sd-09",
      q: "Why are you leaving, and what are you looking for?",
      round: ["hr", "manager"],
      level: "5-10",
      tags: ["behavioural", "hr", "fitment"],
      why: "It looks like a formality. Inconsistency or bitterness here undoes a strong technical loop.",
      simple:
        "Short, forward-looking, and consistent with everything else you have said.\n\n" +
        "The reason should be about what you want next rather than what is wrong where you are. \"I have taken our RAG platform as far as the scope allows and I want to work on systems at a larger scale\" is complete, and it is true for a great many people.\n\n" +
        "Never criticise your current employer, manager or team. It costs you nothing to be gracious and it costs a surprising amount not to be — the panel is imagining how you will describe them in two years.\n\n" +
        "Then say what you are looking for, and make it specific enough to be checkable against the role: the kind of problem, the scale, the ownership. If it does not match the job, they should know now, and so should you.\n\n" +
        "Keep it to thirty seconds. This question has no upside beyond being answered cleanly — the only outcomes are neutral and bad, so take the neutral one and move on.",
      points: [
        "Forward-looking: what you want, not what is wrong.",
        "Never criticise the current employer, manager or team.",
        "Be specific about the problem, scale and ownership you want.",
        "Consistent with your story in every other round.",
        "Thirty seconds. There is no upside in a long answer here."
      ],
      say: "I have taken our retrieval platform about as far as the current scope allows, and I want to work on systems at a larger scale with more ownership of the evaluation and production side. I have had a good run here and I would happily work with the team again. What I am looking for is a role where the GenAI work is the product rather than an internal tool, which is why this one interested me.",
      numbers: "No number applies. Thirty seconds is the target.",
      wrong: "Anything critical about the current employer, and anything vague like \"looking for growth\". The first costs you the round; the second wastes it.",
      follow: "What would make you turn down an offer?"
    },

    {
      id: "sd-10",
      q: "Do you have questions for us?",
      round: ["hr", "manager", "tech2"],
      level: "5-10",
      tags: ["behavioural", "hr", "closing"],
      why: "Almost always asked, almost always wasted, and it is the one part of the process you fully control.",
      simple:
        "Have three, and make them about the work rather than the perks.\n\n" +
        "The ones that reveal most, and that signal seniority by being asked at all: how do you currently measure whether a GenAI feature is working — the answer tells you whether they have evaluation or vibes. What is in production today versus in a pilot — the ratio tells you what this job actually is. And who owns the decision when the model is not good enough for a use case.\n\n" +
        "Then one about the role: what would the first ninety days look like, and what would make this hire clearly successful in a year.\n\n" +
        "What to avoid: anything answerable from the careers page, and compensation in a technical round.\n\n" +
        "And listen to the answers rather than performing the questions. If they cannot describe how they measure quality, you have learned something important about the job — and that is worth as much to you as anything they learned about you.",
      points: [
        "How do you measure whether a GenAI feature works? Reveals evaluation maturity.",
        "What is in production versus in pilot? Reveals what the job actually is.",
        "Who decides when the model is not good enough? Reveals ownership.",
        "What does success look like at ninety days and at a year?",
        "Nothing answerable from the careers page. No compensation in a technical round.",
        "Listen to the answers — you are also deciding."
      ],
      say: "Three things. How do you currently measure whether a GenAI feature is working — I am interested in whether evaluation is in place or still being built. What is in production today versus in pilot, because that tells me what the work really is. And who owns the call when the model is not good enough for a use case. Then, what would make this hire clearly successful after a year.",
      numbers: "Three questions is right. More reads as interrogation, fewer as disinterest.",
      wrong: "\"No, I think you have covered everything.\" It reads as disengagement, and it discards the only part of the process you fully control.",
      follow: "What would make you turn down this role?"
    },

    {
      id: "sd-11",
      q: "What are your salary expectations?",
      round: ["hr", "screening"],
      level: "5-10",
      tags: ["behavioural", "hr", "compensation"],
      why: "Whether you can hold a position without becoming difficult. It is asked early precisely to anchor you.",
      simple:
        "This is asked early to set an anchor, and answering with a single number before you know the role's band usually costs you.\n\n" +
        "The move that works: defer once, politely and with a reason, then give a researched range if pressed. \"I would rather understand the scope and the level first — do you have a band for this role?\" is normal and expected in the Indian market, and asking for their band is a fair exchange rather than a dodge.\n\n" +
        "If they push, give a range, not a point. Base it on the market for your years and stack in your city, quote it as total fixed compensation to avoid ambiguity between base, variable and stock, and make the bottom of your range a number you would genuinely accept — because that is the number you will be offered.\n\n" +
        "Then the two things people get wrong. Do not inflate your current compensation; it is verified at offer stage in most Indian processes and the damage is disproportionate. And do not negotiate in a technical round — if it comes up there, redirect it to the recruiter.",
      points: [
        "It is an anchoring question. Defer once, with a reason.",
        "Ask for their band. That is a fair exchange, not a dodge.",
        "If pressed, give a researched range, not a point.",
        "Say \"total fixed\" explicitly — base, variable and stock get conflated otherwise.",
        "The bottom of your range is what you will be offered. Set it accordingly.",
        "Never inflate current compensation. It is verified at offer stage.",
        "Never negotiate in a technical round. Redirect to the recruiter."
      ],
      say: "I would rather understand the scope and the level first — do you have a band for this role? If it helps, based on the market for my experience and stack I am looking in the range of X to Y total fixed, and I am flexible depending on the overall package and the scope. I would rather get the fit right than optimise a number early.",
      numbers: "Research your own range before the call — your years, your stack, your city. The bottom of the range you state is the number you will be offered, so do not state one you would decline.",
      wrong: "Naming a single number in the first screening call. You have anchored yourself before knowing the band, and you cannot revise upward later without looking inconsistent.",
      follow: "That is above our band for this level. How do you respond?"
    },

    {
      id: "sd-12",
      q: "What is your notice period, and when can you join?",
      round: ["hr"],
      level: "5-10",
      tags: ["behavioural", "hr", "logistics"],
      why: "A logistics question with one trap: overpromising a date you cannot meet.",
      simple:
        "Answer accurately, because this gets written into an offer and a start date, and missing it starts the relationship badly.\n\n" +
        "State the contractual notice, then what is realistically negotiable and what it depends on. In Indian services firms ninety days is common and buyouts are sometimes possible but not guaranteed; say that plainly rather than promising thirty days you cannot deliver.\n\n" +
        "If there is anything that genuinely constrains the date — a project handover, a notice period that cannot be shortened, a relocation — say it now. A constraint disclosed at this stage is a scheduling detail. The same constraint disclosed after an offer is a credibility problem, and it is the one thing this question can actually cost you.\n\n" +
        "Then be straightforward about anything else in flight. You do not owe anyone the details of other processes, and \"I am in a couple of other conversations, and I will be transparent about timelines\" is both honest and a reasonable thing to say.\n\n" +
        "Keep it factual. There is nothing to sell here.",
      points: [
        "State the contractual notice accurately. It goes into the offer.",
        "Say what is negotiable and what it depends on. Do not promise a buyout you cannot get.",
        "Disclose real constraints now — a handover, relocation, an immovable date.",
        "A constraint disclosed now is scheduling. Disclosed after an offer it is credibility.",
        "You need not detail other processes; committing to transparency on timelines is enough.",
        "Factual and short. Nothing to sell."
      ],
      say: "My contractual notice is ninety days. In practice I would expect to negotiate that down somewhat depending on handover, and a buyout may be possible but I would not want to promise it before checking. So realistically I would say sixty to ninety days, and I will confirm precisely once I have spoken to my manager. If timing is a constraint on your side, tell me and I will work with it.",
      numbers: "Ninety days is standard in Indian services firms; thirty to sixty is more common in product companies. Quote your actual contract, not the norm.",
      wrong: "Promising an early joining date on the assumption a buyout will be approved. If it is refused you are renegotiating a signed start date, which is the worst possible first impression.",
      follow: "We need someone in four weeks. Does that rule you out?"
    },

    {
      id: "sd-13",
      q: "You have a competing offer. How do you handle it?",
      round: ["hr", "manager"],
      level: "5-10",
      tags: ["behavioural", "hr", "compensation", "judgement"],
      why: "It tests whether you are straightforward under leverage — the panel is imagining you negotiating with a client.",
      simple:
        "Be honest that one exists, without turning it into a threat. Those are different conversations and the difference is entirely in how you frame it.\n\n" +
        "What works: state the fact, state your genuine preference if you have one, and give a real timeline. \"I do have another offer with a decision date of the fifteenth. I would rather join you, and I wanted to tell you now rather than spring it on you later.\" That is useful information which lets them move, and it costs you nothing.\n\n" +
        "What does not work: using it purely as leverage, inventing one, or being vague about the deadline so they cannot act on it. Recruiters talk to each other in this market, and a fabricated offer is a genuine risk to a reputation you will need again.\n\n" +
        "If you want them to improve the offer, ask directly and once, with a reason grounded in scope or level rather than in the other number alone. Then accept the answer either way.\n\n" +
        "And do not accept an offer you intend to renege on. In the Indian market that is remembered, sometimes for years.",
      points: [
        "State the fact and a real deadline. It lets them act.",
        "State your genuine preference if you have one. It is not weakness.",
        "Never invent a competing offer. Recruiters talk.",
        "Ask once, directly, with a reason grounded in scope or level.",
        "Accept the answer either way, and do not renege on an acceptance.",
        "Leverage framing reads as how you will behave with clients later."
      ],
      say: "I do have another offer, with a decision date around the fifteenth. I wanted to be upfront rather than spring it on you later. Honestly, this role interests me more because of the scope and the ownership, so if you are able to move the process along or revisit the level, that would help me say yes. Either way I will give you a straight answer by then.",
      numbers: "Give the actual decision date. A vague \"soon\" gives them nothing to act on and reads as a tactic.",
      wrong: "\"I have another offer at a higher number, can you beat it?\" It converts a collaborative conversation into a bidding one, and this panel is imagining how you will negotiate with their clients.",
      follow: "We cannot match it. Would you still join?"
    }
,

    {
      id: "sd-14",
      q: "Design a document intelligence platform for an insurance company.",
      round: ["tech2"],
      level: "5-10",
      tags: ["design", "insurance", "ingestion"],
      why: "An ingestion-heavy design in a regulated vertical. The messy input is the problem, not the model.",
      simple:
        "Scope it first, out loud. Ask what documents, what volume, what decisions depend on the output, and what the accuracy bar is. Assume claim documents, policy schedules and scanned hospital bills at a few thousand a day, feeding a human adjudication queue.\n\n" +
        "The architecture, and the weight sits at the front:\n\n" +
        "    intake -> classify -> extract -> validate -> route -> review UI\n\n" +
        "Intake normalises formats and captures provenance. Classify identifies the document type, which decides the extraction schema — a claim form and a discharge summary need different fields.\n\n" +
        "Extraction is the hard part and it is mostly not an LLM problem. Scanned Indian hospital bills are photographs, often skewed, sometimes handwritten, frequently in mixed scripts. So: OCR with a layout-aware model, then a vision-language model for the fields OCR mangles, and a deterministic parser for anything structured. Return confidence per field, not per document.\n\n" +
        "Validate is where correctness is enforced. Cross-check totals arithmetically in code, verify the policy number exists, confirm dates are consistent. Any field below a confidence threshold goes to human review rather than through.\n\n" +
        "Route by confidence: high-confidence complete extractions to straight-through processing, anything else to a reviewer with the field highlighted on the source image.\n\n" +
        "Then the things that make it real. Every extracted field links back to a bounding box on the source page, because a reviewer must verify without reading the whole document. PHI stays in-region with restricted logging. Full audit of what was extracted, by which model version, and who confirmed it.\n\n" +
        "State the honest metric: not accuracy, but the share of documents processed without human touch at the required precision. That is what the business is buying.",
      points: [
        "Extraction quality dominates — OCR and layout, not the LLM.",
        "Confidence per field, not per document.",
        "Validate arithmetically in code; low confidence routes to review.",
        "Link every field to a bounding box for fast human verification.",
        "The business metric is straight-through rate at a precision bar."
      ],
      say: "I would scope volume and the accuracy bar first, then design around extraction, because scanned Indian hospital bills are the hard part, not the model. OCR with layout awareness, a vision model for what OCR mangles, and per-field confidence. Validation checks totals in code and routes anything low-confidence to human review with the field highlighted on the source image. The metric that matters is straight-through rate at the required precision.",
      numbers: "Report confidence per field rather than per document. Set the straight-through threshold with the business — start conservative and raise it as measured precision justifies.",
      wrong: "Designing around the LLM and treating ingestion as a preprocessing detail. On scanned documents, extraction is where the project succeeds or fails.",
      follow: "Ten percent of bills are handwritten. What does that do to your design?"
    },

    {
      id: "sd-15",
      q: "Design a multilingual customer assistant for tier-2 and tier-3 cities.",
      round: ["tech2"],
      level: "5-10",
      tags: ["design", "multilingual", "india"],
      why: "An India-specific design where language, cost and bandwidth constraints interact.",
      simple:
        "Clarify first: which languages, what channel, and what the assistant is allowed to do. Assume Hindi and English plus two regional languages, on WhatsApp and a low-bandwidth web view, handling account queries and support.\n\n" +
        "Channel shapes everything. WhatsApp means asynchronous messaging, short turns, and users on intermittent connections — so no long streaming responses, and state must survive a user disappearing for an hour. That means durable session state, not an in-memory conversation.\n\n" +
        "Language handling. Detect language per message rather than per session, because code-switching mid-conversation is normal — users mix Hindi and English in one sentence constantly. Transliteration matters: users type Hindi in Latin script far more often than in Devanagari, so normalise both forms for retrieval.\n\n" +
        "Retrieval needs cross-lingual alignment. Content is usually authored in English while questions arrive in Hindi, so the embedding model must retrieve English documents from a Hindi query. Test that explicitly.\n\n" +
        "Cost is the constraint people miss. Devanagari costs two to three times the tokens of equivalent English, so a Hindi conversation costs materially more than the same conversation in English. Budget from Hindi, not English, and lean hard on a small model for routine turns with escalation to a larger one only when needed.\n\n" +
        "Voice matters here more than in a metro-facing product — many users prefer speaking. Speech-to-text for Indian languages is weaker than for English, so design for imperfect transcripts and confirm intent before acting.\n\n" +
        "Then the safety floor: never guess on financial actions, always offer a human handoff, and answer in the language the user wrote in.",
      points: [
        "WhatsApp means async and durable state, not in-memory sessions.",
        "Detect language per message — code-switching is normal.",
        "Handle Latin-script transliteration, not just native script.",
        "Budget cost from Hindi tokens, which run 2–3× English.",
        "Design for imperfect speech transcripts; confirm before acting."
      ],
      say: "The channel drives it — WhatsApp means asynchronous turns and durable session state, since users disappear and return. I detect language per message because code-switching is normal, and normalise Latin-script transliteration since users rarely type Devanagari. Retrieval needs genuine cross-lingual alignment because content is in English and questions are in Hindi. And I budget from Hindi token counts, which run two to three times English.",
      numbers: "Hindi costs roughly 2–3× the tokens of equivalent English. Any cost model built on English benchmarks understates a Hindi-majority product badly.",
      wrong: "Treating multilingual as a translation layer bolted on at the edges. Language affects retrieval, cost, tokenisation and evaluation simultaneously.",
      follow: "A user writes one sentence mixing Hindi and English. What does your pipeline do?"
    },

    {
      id: "sd-16",
      q: "Design a code assistant for an internal 500-engineer codebase.",
      round: ["tech2"],
      level: "5-10",
      tags: ["design", "code", "retrieval"],
      why: "Repo-scale retrieval with hard latency and IP constraints. Different from document RAG in instructive ways.",
      simple:
        "Scope: what does it do — answer questions, review, or generate? Assume question answering and code explanation over a large monorepo, in the IDE.\n\n" +
        "Code retrieval differs from document retrieval in ways that matter.\n\n" +
        "Chunk on syntax, not characters. Parse to an AST and chunk by function or class, so a chunk is a complete unit. A function split in half is useless. Include the signature, docstring and imports with each chunk, since imports tell you what the code depends on.\n\n" +
        "Hybrid search is mandatory, not optional. Developers search for exact identifiers — a function name, an error string, a config key — and dense embeddings are weak at exact tokens. BM25 carries that load.\n\n" +
        "Exploit the graph. Code has explicit structure that documents lack: call graphs, imports, definitions. When retrieving a function, pull its callers and callees too. That structural expansion typically beats adding more semantic neighbours.\n\n" +
        "Freshness is a real constraint. The codebase changes hourly, so incremental indexing on merge, keyed by file hash. A stale index that describes deleted code is actively harmful.\n\n" +
        "Latency budget is tight because it sits in the IDE. Under a second or developers stop using it — that is a product requirement, not a nice-to-have. So aggressive caching and a small fast model for routine queries.\n\n" +
        "Then the constraints specific to this setting. Source code is IP, so self-hosted or a zero-retention endpoint, and check what the contract permits. Respect repository permissions — not everyone can see every repo. And cite file and line so the developer can verify, because a plausible wrong answer about code is expensive.",
      points: [
        "Chunk on AST boundaries — functions and classes, with imports.",
        "Hybrid search is mandatory: developers search exact identifiers.",
        "Expand along the call graph, not just semantic neighbours.",
        "Incremental reindex on merge — stale code answers are harmful.",
        "Sub-second latency in the IDE, and source code is IP."
      ],
      say: "Code retrieval differs from documents. I chunk on AST boundaries so each chunk is a complete function with its signature and imports, and hybrid search is mandatory because developers search exact identifiers that dense vectors handle poorly. I expand along the call graph rather than just semantic neighbours. The index reindexes incrementally on merge, latency has to stay under a second for IDE use, and source code being IP forces self-hosting or zero retention.",
      numbers: "Target sub-second response in the IDE. Reindex incrementally on merge — a nightly rebuild is already stale for an active monorepo.",
      wrong: "Applying a document RAG design unchanged. Character chunking splits functions, and pure dense retrieval fails on the identifier searches developers actually make.",
      follow: "A developer asks why a function exists. Does your retrieval find the answer?"
    },

    {
      id: "sd-17",
      q: "Design an agent that files expense reports end to end.",
      round: ["tech2"],
      level: "5-10",
      tags: ["design", "agents", "workflow"],
      why: "A bounded agentic task where the right answer is mostly workflow with narrow agentic steps.",
      simple:
        "The first design decision, and I would say it explicitly: this is largely a workflow, not an open-ended agent. The steps are known — extract the receipt, classify the category, apply policy, submit, handle rejection. Only a few points genuinely need model judgement.\n\n" +
        "    receipt -> extract -> categorise -> policy check -> submit -> track\n\n" +
        "Extraction from a photographed receipt: vision model, per-field confidence, and a human confirmation step for anything uncertain. Receipts are crumpled and badly lit.\n\n" +
        "Categorisation is a classification problem with a fixed taxonomy, so constrain the output to an enum rather than letting the model free-text a category.\n\n" +
        "Policy check is deterministic code, not a model. Per-diem limits, approval thresholds and eligible categories are rules, and rules belong in code where they are testable and auditable. The model may explain a rejection; it does not decide it.\n\n" +
        "Submission is a tool call into the expense system, and it must be idempotent — an idempotency key on the receipt hash, so a retry cannot file the same expense twice. Duplicate submissions are the failure that erodes trust fastest.\n\n" +
        "Where the agentic part actually earns its place: handling the unhappy path. A rejected claim needing clarification, a missing field the user must supply, a currency conversion, an out-of-policy item needing justification. Those branches are hard to enumerate, which is exactly the condition for an agent.\n\n" +
        "Guardrails: never submit above a value threshold without explicit user confirmation, show the user what will be filed before filing, and keep an audit trail. And design the correction path — the user must be able to fix a misread amount easily, because they will need to.",
      points: [
        "Mostly workflow; agentic only on the unhappy paths.",
        "Categorise into a fixed enum, not free text.",
        "Policy limits are deterministic code, never model judgement.",
        "Idempotency key on the receipt hash — never file twice.",
        "Show the user what will be submitted before submitting."
      ],
      say: "I would build this mostly as a workflow, because the steps are known — extract, categorise, policy check, submit. Categorisation is constrained to a fixed enum and the policy limits are deterministic code, since rules belong where they are testable. Submission is idempotent on the receipt hash so a retry cannot double-file. The genuinely agentic part is the unhappy path: clarifications, missing fields, out-of-policy justifications.",
      numbers: "Use an idempotency key derived from the receipt hash. Require explicit confirmation above a value threshold set with finance.",
      wrong: "Building it as an open-ended agent because the brief said agent. Most of this is a known sequence, and an agent makes it slower, costlier and harder to audit.",
      follow: "The agent misreads an amount as 5,000 instead of 500. Where does that get caught?"
    },

    {
      id: "sd-18",
      q: "How do you gather requirements when the client says 'we want AI'?",
      round: ["manager"],
      level: "5-10",
      tags: ["consulting", "scoping", "stakeholders"],
      why: "The services-company staple. Scoping is the actual skill being hired for.",
      simple:
        "'We want AI' is not a requirement, and taking it at face value is how projects fail. My job is to convert it into a problem with a measurable outcome, and the conversation runs roughly like this.\n\n" +
        "Start with the pain, not the technology. What takes too long today, what costs too much, where do errors happen. Ask them to walk me through the current process step by step with a real example. That single request surfaces more than any requirements document.\n\n" +
        "Then quantify. How many times a day does this happen, how long does each take, what does an error cost. Without numbers there is no business case and no way to size the work.\n\n" +
        "Define success before design. What number moves, by how much, by when. 'Reduce average handling time from 8 minutes to 5' is a project. 'Improve customer experience' is not.\n\n" +
        "Then the questions that decide feasibility, and these are the ones that matter. Where is the data, who owns it, and can we actually access it — data access is the most common thing that kills a timeline. What is the accuracy bar, and what happens when the system is wrong. Who is accountable for a wrong output. What regulatory constraints apply. And what does the current process do that nobody documented.\n\n" +
        "Establish the human's role early. Assist or automate — that decides the entire architecture and the acceptance criteria.\n\n" +
        "Then be willing to say the answer is not AI. Often the real problem is a broken form, a missing integration or an unindexed knowledge base. Saying so builds more credibility than delivering an impressive system that solves nothing — and it is what distinguishes a consultant from an order-taker.",
      points: [
        "Ask them to walk through the current process with a real example.",
        "Quantify volume, time and error cost — no numbers, no business case.",
        "Define the measurable success metric before designing anything.",
        "Data access is the most common timeline killer — confirm it early.",
        "Be willing to conclude the answer is not AI."
      ],
      say: "I start from the pain rather than the technology — walk me through the current process with a real example, then quantify volume, handling time and error cost. Then define success as a number that must move by a date. The questions that decide feasibility are data access, the accuracy bar, who is accountable when it is wrong, and whether the human assists or is replaced. And I stay willing to say the answer is not AI.",
      numbers: "Without volume, handling time and error cost, there is no business case. Get those three numbers before proposing an architecture.",
      wrong: "Taking the brief literally and proposing a chatbot. It wins the meeting and produces a pilot that never reaches production because nobody defined what success was.",
      follow: "You conclude their problem does not need AI. How do you say that to the client?"
    },

    {
      id: "sd-19",
      q: "How do you estimate effort and timeline for a GenAI project?",
      round: ["manager"],
      level: "5-10",
      tags: ["consulting", "estimation", "delivery"],
      why: "Asked directly in services-company interviews, and the honest structure is what earns credit.",
      simple:
        "The honest framing first: GenAI projects are harder to estimate than conventional software because quality is discovered rather than specified. You do not know how good retrieval will be until you build it on real data. So I estimate in phases with decision points, not as one number.\n\n" +
        "Discovery, one to two weeks. Data access, a sample corpus, feasibility on twenty real examples, and a defined success metric. The deliverable is a go or no-go with evidence, and this phase de-risks everything after it.\n\n" +
        "Pilot, four to six weeks. A working end-to-end system on real data with a real eval set, tested by actual users rather than the project team. The deliverable is a measured quality number against the agreed metric.\n\n" +
        "Hardening, six to ten weeks, and this is the phase everyone underestimates. Security review, permissions, guardrails, observability, cost controls, error handling, load testing, integration with the real systems. It is routinely as long as the pilot and it is where prototypes go to die.\n\n" +
        "Rollout and stabilisation, four or more weeks. Phased users, monitoring, feedback loop, tuning against real traffic.\n\n" +
        "The estimation rules I would state: pilot to production is typically two to three times the pilot effort, not a small increment. Data access delays are the most common overrun and they are outside your control, so flag them as a dependency with a named owner. And evaluation infrastructure is real work that must be in the plan rather than assumed.\n\n" +
        "Give a range with the assumptions written down, and put the go or no-go gate after discovery so the client is not committing to a full build before feasibility is known.",
      points: [
        "Quality is discovered, not specified — estimate in phases with gates.",
        "Discovery 1–2 weeks, pilot 4–6, hardening 6–10, rollout 4+.",
        "Hardening is routinely as long as the pilot and always underestimated.",
        "Data access delays are the most common overrun.",
        "Give a range with assumptions, and gate after discovery."
      ],
      say: "I estimate in phases with decision gates, because quality is discovered rather than specified. Discovery is one to two weeks to prove feasibility on real examples and agree a metric. Pilot is four to six weeks to a measured number. Hardening — security, permissions, observability, cost controls — is six to ten and is what teams underestimate. Then phased rollout. I give a range with assumptions and gate the commitment after discovery.",
      numbers: "Pilot to production is typically 2–3× the pilot effort. Hardening is commonly as long as the pilot itself.",
      wrong: "Quoting a single number for the whole project. It signals you have not shipped one, and it sets up the conversation where hardening looks like scope creep.",
      follow: "The client wants a fixed price for the whole thing. What do you propose?"
    },

    {
      id: "sd-20",
      q: "Tell me about a time you said a GenAI approach would not work.",
      round: ["manager"],
      level: "5-10",
      tags: ["behavioural", "judgement", "communication"],
      why: "A strong differentiator. Panels are wary of candidates who think every problem is an LLM problem.",
      simple:
        "This is a judgement question, and it wants a real example with a real cost to saying no. Structure it as situation, your analysis, how you communicated it, and the outcome.\n\n" +
        "What makes a strong answer is the analysis being specific and quantified rather than a general reservation. Good reasons to say no, with the shape of the evidence:\n\n" +
        "The accuracy bar was unreachable. The process needed near-perfect extraction and measurement on a real sample showed a gap too large to close with the available data.\n\n" +
        "The economics did not work. Cost per transaction exceeded the value of the transaction — that is a calculation you can put in front of a finance stakeholder.\n\n" +
        "A deterministic solution was better. The real problem was an unindexed knowledge base or a missing integration, and search or a rules engine solved it more reliably and far cheaper.\n\n" +
        "The data was not there. No labelled examples, no ground truth, no way to evaluate — so nobody could tell whether it was working.\n\n" +
        "Regulation forbade it. The decision legally required a human, so automation was not on the table regardless of quality.\n\n" +
        "Then the part that actually distinguishes the answer: how you said it. Bring evidence, not opinion — a measurement on their data beats an argument. Offer the alternative rather than only the refusal; 'this will not work, and here is what will' keeps you a partner. And frame it as protecting them from a failed programme.\n\n" +
        "Close with the outcome. Ideally the alternative shipped and worked. If they overruled you, say what happened and what you learned — that is also a real answer, and honest.",
      points: [
        "Bring quantified evidence measured on their data, not opinion.",
        "Common valid reasons: accuracy bar, economics, determinism, no data, regulation.",
        "Always pair the no with a concrete alternative.",
        "Frame it as protecting them from a failed programme.",
        "State the outcome, including if you were overruled."
      ],
      say: "I would give a specific example where I measured on their data rather than arguing from principle — for instance an extraction task where the required accuracy was unreachable with the available labelled examples, or where cost per transaction exceeded the transaction's value. The key is bringing evidence and pairing the no with a concrete alternative that does work, so it reads as protecting the programme rather than declining the work.",
      numbers: "A measurement on twenty real examples from their data carries more weight than any argument from principle.",
      wrong: "A generic answer about managing expectations. The question wants a specific decision with a cost attached, and vagueness reads as never having made the call.",
      follow: "They disagreed and went ahead anyway. What did you do?"
    },

    {
      id: "sd-21",
      q: "Describe a production incident you owned end to end.",
      round: ["manager"],
      level: "5-10",
      tags: ["behavioural", "incident", "ownership"],
      why: "Ownership is what separates a senior hire from a capable engineer. The structure of the answer reveals it.",
      simple:
        "Use a clear structure and keep it to a few minutes: what broke, how you found it, what you did, what the outcome was, and what changed afterwards.\n\n" +
        "What makes an answer strong.\n\n" +
        "Detection. Say how you found out. 'A user told us' is an honest but weak detection story, and acknowledging that is fine if you then fixed the monitoring. 'An alert fired on refusal rate' is stronger.\n\n" +
        "Triage before diagnosis. Say what you did to stop the bleeding first — rolled back, disabled the feature, switched to a fallback — before explaining root cause. Senior engineers restore service and then investigate. Juniors debug while users suffer.\n\n" +
        "The diagnosis, with the actual mechanism. Be specific: a provider model update changed output formatting and broke a downstream parser, an index rebuild silently dropped a filter, a prompt change increased refusals. Vagueness here reads as not having been the person who fixed it.\n\n" +
        "Communication. Who you told and when. Stakeholders finding out from customers is a failure mode of its own.\n\n" +
        "The outcome with a number. Duration, users affected, what recovered.\n\n" +
        "And the part that matters most: what changed structurally. A fix that only repairs the instance is incomplete. Did you add an alert, a regression test, a rollback path, a canary? For GenAI specifically, the strongest close is adding the failing case to the eval set so it cannot silently return.\n\n" +
        "Own your part honestly. If your change caused it, say so plainly. Panels trust candidates who can describe their own mistake without deflecting far more than candidates whose incidents were always someone else's fault.",
      points: [
        "State detection honestly — and fix it if it was a user report.",
        "Triage before diagnosis: restore service, then investigate.",
        "Name the specific mechanism, not a vague category.",
        "Quantify duration and impact.",
        "Close with the structural fix — for GenAI, the eval-set addition."
      ],
      say: "I would structure it as detection, triage, diagnosis, outcome and the structural fix. The important parts are that I restored service before diagnosing — rollback or fallback first — and that I name the actual mechanism rather than a vague category. Then quantify duration and users affected, and close with what changed so it cannot recur: an alert, a rollback path, and for GenAI, adding the failing case to the eval set.",
      numbers: "Quantify duration and users affected. An incident story without numbers sounds like a story rather than something you owned.",
      wrong: "An incident where nothing was your fault and nothing changed afterwards. It reads as either not having been involved or not having learned anything.",
      follow: "What would have caught it an hour earlier?"
    }
  ]
};
