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
  ]
};
