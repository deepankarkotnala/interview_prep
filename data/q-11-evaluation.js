/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["11-evaluation"] = {
  "lede": "Evaluation in 2026 covers both single-turn GenAI and multi-step agents. Strong answers separate final outcomes from the trajectory that produced them, combine deterministic, model and human graders, run repeated trials where variance matters, and turn real failures into regression tests. New to evaluation? The questions are ordered for a first read: every High priority card first, from how you know a feature works through golden sets, LLM judges, RAG metrics, hallucination and CI gates, then Medium, then Low.",
  "grounding": "current agent-evaluation guidance + production evaluation practice + public AI engineering job descriptions",
  "evening": [
    "ev-01",
    "ev-03",
    "ev-04",
    "ev-06",
    "ev-09",
    "ev-13"
  ],
  "cards": [
    {
      "id": "ev-01",
      "q": "How do you know your GenAI feature is working?",
      "round": [
        "screening",
        "tech1",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "basics",
        "metrics"
      ],
      "why": "The opening question of the whole topic. It reveals in thirty seconds whether you have shipped.",
      "simple": "**Short version: you need two kinds of checks - a fixed test before release, and real-user signals after it.**\n\n**Offline (before release):** a fixed list of test questions with known good answers. This is called the golden set. You run it on every change, and it tells you if you broke something. Because every version sees exactly the same questions, it is the only fair way to compare two versions.\n\n**Online (after release):** what real users actually do. Do they click thumbs up or down? Do they ask the same question again in different words? Do they click the citation? Do they give up and ask for a human? And underneath all of that, the business number - tickets resolved, time saved, sales made.\n\nThink of a restaurant. The offline test is the chef tasting every dish before it leaves the kitchen. The online signal is whether customers finish their plates and come back. You need both.\n\nTeams that only test offline ship changes that score well and help nobody. Teams that only watch online cannot debug, because they cannot tell which change caused what.",
      "points": [
        "Offline golden set - regression safety, version comparison, runs in CI.",
        "Online signals - thumbs, rephrase rate, citation clicks, escalation.",
        "Business metric - the one your manager is measured on.",
        "Offline catches breakage; online proves value. Neither replaces the other."
      ],
      "say": "Two layers. Offline is a golden set of cases with known good answers that runs on every change - it is the only fair way to compare two versions, because both see the same inputs. Online is real user behaviour: thumbs, rephrase rate, citation clicks, escalation to a human, and the business metric underneath. Offline tells me whether I broke something. Online tells me whether it mattered.",
      "numbers": "A common starting point is around 100 golden cases. With only a few dozen, run-to-run noise can be as large as the change you are trying to measure, so report variance as well as the average.",
      "wrong": "\"We test it manually before release.\" Honest, but the follow-up is how you compare two versions or prove a change broke nothing - and manual spot checks cannot answer either.",
      "follow": "Where does that golden set come from?",
      "followAnswer": "Mostly from production: real user queries sampled across the traffic we serve, plus every failure anyone reported. A domain expert writes or approves the correct answers, not the engineer. I deliberately add edge cases, adversarial inputs and questions that should get 'I don't know'. Before launch, with no traffic yet, I start from expert-written questions and support tickets, then swap in real queries as they arrive."
    },
    {
      "id": "ev-02",
      "q": "How do you build a golden evaluation set?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "dataset",
        "process"
      ],
      "why": "Everyone agrees you need one. Few candidates can describe getting one built.",
      "simple": "**A golden set is a fixed list of test questions, each with its correct answer, that you run every time you change something.**\n\n**Where the questions come from:** real users. Take a sample of real production questions - not the ones the team imagined. Then add every failure anyone ever reported. Failures are the most valuable test cases you have.\n\n**Where the answers come from:** a domain expert, not an engineer. For an insurance claims assistant, that is a claims person. This takes real calendar time, and most candidates skip it when they describe the process - which is exactly why mentioning it lands well.\n\n**What to cover on purpose:**\n- common questions,\n- tricky edge cases,\n- attack-style inputs,\n- questions where the right answer is \"I don't know\",\n- other languages, if your users speak them.\n\nThe \"I don't know\" questions matter more than people expect. If the set has none, you will never notice when the model stops refusing and starts inventing.\n\n**Then freeze it.** Give it a version number. If the set quietly changes, you cannot compare two releases. Add new cases as a new version; never edit old ones. And keep a small slice hidden that you never tune against, so you know you have not simply memorised the test.",
      "points": [
        "Source from production traffic, plus every reported failure.",
        "Labels come from domain experts, not engineers.",
        "Cover: common, edge, adversarial, unanswerable, multilingual.",
        "Freeze and version. Comparison needs identical inputs.",
        "Grow by adding versions, never by editing in place.",
        "Hold back a slice you never tune against."
      ],
      "say": "Mostly from production - real queries sampled across the distribution we serve, plus every failure anyone reported, because those are the highest-value cases. Labels come from a domain expert, not from me. I cover common, edge, adversarial and unanswerable cases deliberately, and multilingual if the product serves multiple languages. Then I freeze and version it, because comparing two releases needs identical inputs, and I hold back a slice I never tune against.",
      "numbers": "100 cases to start, 300–500 for a mature system. Roughly 10–15% should be unanswerable, or you will never detect a model that stopped refusing.",
      "wrong": "\"We generated the test set with an LLM.\" Useful for scale, dangerous alone - the model generates the questions it is already good at, and your scores go up while quality does not.",
      "follow": "How do you keep it from going stale as the product changes?",
      "followAnswer": "I keep feeding it from production. Every month I sample fresh real queries, and every confirmed failure from feedback or incidents becomes a new case. I compare the topic mix of the set with live traffic and fill the gaps. Old cases are never edited in place: if a policy change alters the right answer, I retire the case and add a new version, so older runs stay comparable."
    },
    {
      "id": "ev-03",
      "q": "What is LLM-as-a-judge, and when do you trust it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "llm-judge",
        "bias"
      ],
      "why": "Everyone uses judges now. The senior signal is knowing where they lie to you.",
      "simple": "**LLM-as-a-judge means using one model to grade another model's answer.** You give the judge the question, the answer, sometimes the retrieved context, and a marking guide. It returns a score: is this supported, is it relevant, is it complete?\n\nIt is popular because it scales. A human can review a hundred answers a day. A judge can review a hundred thousand. For open-ended text there is often no other practical option.\n\n**But judges have known biases**, and naming them is what makes this answer strong:\n- they prefer **longer** answers,\n- they prefer answers written in **their own style** (same model family),\n- in A-versus-B comparisons they are swayed by **which answer comes first**,\n- on a 1-to-10 scale they **stick to the middle** and avoid the extremes,\n- they are **inconsistent** - the same answer can get a different score on the next run.\n\n**So you check the judge before you trust it.** Have humans grade 100-200 examples. Run the judge on the same examples. Measure how often they agree. (Cohen's kappa is the usual measure - it is simply agreement with lucky guesses removed.) If the judge agrees with your experts, use it at scale and re-check now and then. If it does not, fix the marking guide first.\n\nThink of a new teacher marking exams. Before you let them mark alone, you compare their marks against an experienced teacher's on a sample of papers.\n\n**Design rules that help:** pass/fail or 3-point scales instead of 1-to-10, a clear rubric with an example of each score, ask for the reason before the score, and shuffle the order in A-versus-B comparisons.",
      "points": [
        "Biases: length, self-preference, position, middle-clustering, run-to-run variance.",
        "Calibrate against 100–200 human labels and measure agreement.",
        "Binary or three-point scales. Wide one-to-ten scales are usually noisy.",
        "Rubric with concrete examples of each level.",
        "Reason first, score second - it improves consistency.",
        "Randomise order in pairwise comparisons.",
        "Use a different model family from the one being judged where you can."
      ],
      "say": "A model scores another model's output. It scales where human review cannot, but it has known biases - it prefers longer answers, prefers its own style, is sensitive to option order, and clusters scores mid-scale. So I calibrate against a couple of hundred human labels and measure agreement before trusting it. I use binary or three-point scales with an explicit rubric, ask for the reason before the score, and randomise pairwise order.",
      "numbers": "Calibrate on 100–200 human-labelled examples. Recheck agreement quarterly, and after any judge-model version change.",
      "wrong": "\"We use GPT to score the outputs, it gives about 0.9.\" A number with no calibration behind it. The obvious follow-up - how do you know the judge is right - needs agreement with human labels to answer.",
      "follow": "Your judge scores 0.9 and users are complaining. What is happening?",
      "followAnswer": "Either the judge is wrong or it is measuring something users do not care about. First I check calibration: does it still agree with human labels, especially after any judge model change? Then I read the complaint cases - often the answers are faithful but unhelpful, too long or slow, which the rubric never scored. The fix is usually a new rubric criterion plus the real complaints added to the set."
    },
    {
      "id": "ev-04",
      "q": "Which RAG metrics are deterministic, which need an LLM judge, and which do you lead with?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "rag",
        "metrics"
      ],
      "why": "rag-07 covers the full RAG evaluation design. This checks the next layer: sorting metrics by which half of the pipeline they test and how they are scored, and knowing which can run on every commit.",
      "simple": "**Short version: sort RAG metrics by two questions - which half of the pipeline does it test, and who does the scoring, plain code or an LLM judge?** (The full RAG evaluation design is in rag-07.)\n\n**Retrieval, scored by code.** You need a labelled set: questions plus the chunk that holds each answer. Then:\n- **recall@k** - is the right chunk anywhere in the top k?\n- **MRR** - how close to the top is it?\n- **hit rate** - did we find at least one right chunk?\nThese need no model calls. They are cheap, exact and fast enough to run on every commit.\n\n**Retrieval, scored by a judge.** Ragas context precision (is most of what we fetched actually useful, and is the useful part near the top?) and context recall (did we fetch everything the answer needs?). They are still retrieval metrics - they just use an LLM instead of labels, so they cost money and need checking.\n\n**Generation, scored by a judge.** **Faithfulness** - is every claim in the answer backed by the retrieved text? **Answer relevance** - does it actually answer what was asked?\n\n**Lead with faithfulness.** It is the closest thing to a hallucination score, and regulated employers ask for it by name. Like every judged metric, check it against human labels before you trust the number.\n\nThen, on top: **end-to-end task success** on the golden set - the number a business person understands - with cost and p95 latency next to it. A quality win that doubles the cost is not a win.",
      "points": [
        "Retrieval, code-scored: recall@k, MRR, hit rate - objective, cheap, run in CI.",
        "Retrieval, judge-scored: Ragas context precision and context recall.",
        "Generation, judge-scored: faithfulness and answer relevance.",
        "Faithfulness is the hallucination proxy. Lead with it.",
        "Calibrate every judged metric against human labels before trusting it.",
        "End-to-end task success is the number a stakeholder understands.",
        "Track cost and p95 latency alongside - a quality win that doubles cost is not a win."
      ],
      "say": "I sort them two ways: which half of the pipeline they test, and whether code or a judge scores them. Retrieval gets recall at k and MRR from a labelled set - cheap enough for every commit - plus Ragas context precision and recall, which are judged retrieval metrics. Generation gets faithfulness and answer relevance. I lead with faithfulness as the hallucination proxy, calibrate the judge against human labels, and report end-to-end task success with cost and p95.",
      "numbers": "Useful bar: recall@10 above 0.90 before touching the prompt, and faithfulness above 0.90 before launch. Set your own thresholds from your own data.",
      "wrong": "Naming BLEU or ROUGE. They compare word overlap with a reference answer, which says little about groundedness in open-ended generation - the follow-up about where the reference answers come from exposes that (see ev-11).",
      "follow": "Faithfulness is 0.95 but users say the answers are useless. Explain.",
      "followAnswer": "Faithfulness only says the answer is supported by the retrieved context, not that it answers the question. So either retrieval brought back related but wrong chunks and the model summarised them faithfully, or the answer is safe but vague. I check context recall and answer relevance on the complaint cases, then read them. Usually the fix is in retrieval, not in the prompt."
    },
    {
      "id": "ev-18",
      "q": "How do you measure hallucination?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "evaluation",
        "hallucination",
        "faithfulness",
        "metrics"
      ],
      "why": "One of the most-asked GenAI questions. The mark is separating 'not supported by the source' from 'not true in the world', and turning either into a number.",
      "simple": "First say which kind you mean, because they are measured differently.\n\nA faithfulness hallucination is when the answer says something the provided source does not support. This is the RAG case. You have the source, so you can check against it. A factual hallucination is when the answer is false about the world and no source was given. This is the closed-book case. You need a reference answer or a trusted source to check against.\n\nThe standard way to measure both is claim by claim. Split the answer into small factual claims. Label each one: supported, contradicted, or not found. For faithfulness, check against the retrieved context with an LLM judge or an NLI model - a classifier that decides whether one text supports another. For factuality, check against a reference answer or a trusted knowledge source. Then report the share of unsupported claims, and the share of answers with at least one.\n\nTwo more checks help. Put unanswerable questions in the test set and measure how often the model invents instead of saying it does not know. And when there is no reference, ask the same question several times: if the answers disagree with each other, the model is probably guessing. That is the idea behind SelfCheckGPT.\n\nThe checker is itself a model, so calibrate it against human labels first. For catching hallucination in production, see rag-15.",
      "points": [
        "**Faithfulness** - not supported by the given source (RAG). **Factuality** - false about the world (closed-book).",
        "Split answers into claims; label each supported, contradicted or not found.",
        "Checkers: an LLM judge or NLI model against the context; reference answers or trusted sources for facts.",
        "Report the claim-level rate and the answer-level rate (answers with at least one unsupported claim).",
        "Unanswerable questions measure invention versus an honest \"I don't know\".",
        "Sampling consistency (the SelfCheckGPT idea): disagreement across samples signals guessing.",
        "Calibrate the checker against human labels. Production detection: rag-15."
      ],
      "say": "First I separate the two kinds: unfaithful, meaning not supported by the source we gave the model, and non-factual, meaning false about the world. Either way I measure claim by claim - split the answer into claims and check each against the retrieved context or a reference, using an LLM judge or an entailment model. I report the unsupported-claim rate, add unanswerable questions to catch invention, and calibrate the checker against human labels.",
      "numbers": "No universal acceptable rate - it depends on the stakes. Report both the share of claims that are unsupported and the share of answers with at least one, and keep roughly 10-15% unanswerable questions in the set so abstention is measured too.",
      "wrong": "\"We ask the model to rate its own confidence.\" Stated confidence is poorly calibrated, and the model that invented a fact will often defend it. You need an independent check against a source.",
      "follow": "The answer is faithful to the context, but the context itself is out of date. Is that a hallucination?",
      "followAnswer": "Not by the faithfulness definition - the model did what we asked. But to the user it is still a wrong answer, so it is a factual failure caused by our data, not the model. I catch it with freshness metadata on documents, a check that answers cite the latest version, and eval cases for recently changed policies. The fix belongs in ingestion, not in the prompt."
    },
    {
      "id": "ev-11",
      "q": "BLEU, ROUGE, BERTScore - what are they and would you use them?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "metrics",
        "theory",
        "judgement"
      ],
      "why": "Asked by name in almost every evaluation round. The mark is not the definition - it is knowing they mostly do not apply to what you build.",
      "simple": "**Short version: know what they are, then explain why they rarely fit GenAI work.**\n\n**What they are:**\n- **BLEU** - counts how many word sequences in the output also appear in a reference answer. Built for machine translation.\n- **ROUGE** - the other direction: how much of the reference shows up in the output. Built for summarisation.\n- **BERTScore** - compares meaning using embeddings instead of exact words, so a paraphrase still scores well.\n\n**Why they rarely fit:** all three need a reference answer - one \"correct\" text to compare against. Most GenAI features do not have one. A support reply or a summary can be right in many different wordings.\n\nWorse, on RAG they can mislead you. An answer can share most of its words with the reference and still contain a made-up number. And a correct answer in different words scores badly. High ROUGE with a hallucinated figure is entirely possible.\n\n**Where they do fit:** translation, and summarisation when you have real reference summaries. They are fast and free, so they work well as a cheap alarm in CI - watch for sudden drops rather than chasing the number.\n\n**What I use instead:** for RAG, faithfulness plus context precision and recall. For open-ended writing, an LLM judge with a rubric, checked against human labels. For extraction, exact field accuracy - the one place a hard metric works cleanly.",
      "points": [
        "BLEU: n-gram precision, built for translation. ROUGE: recall, built for summarisation. BERTScore: embedding similarity, so paraphrase survives.",
        "All three need a reference answer. Most GenAI tasks have no single correct output.",
        "On RAG they mislead: high overlap with a hallucinated number is possible.",
        "Legitimate use: translation, and summarisation with real references as a cheap CI regression signal.",
        "For RAG use faithfulness, context precision and context recall instead.",
        "For extraction, exact field accuracy is the honest hard metric.",
        "Name the metric, then say what the task actually requires."
      ],
      "say": "BLEU is n-gram precision for translation, ROUGE is the recall counterpart for summarisation, and BERTScore swaps exact matching for embedding similarity so paraphrases survive. But all three need a reference answer, and most of what we build has no single correct output. On RAG they actively mislead, because an answer can overlap the reference and still be ungrounded. I use faithfulness and context metrics instead, and a validated rubric judge for subjective work.",
      "numbers": "If you do use ROUGE in CI, treat it as a regression tripwire rather than a quality score - watch for sudden drops, do not chase the absolute number.",
      "wrong": "Listing all three confidently as your RAG evaluation plan. The follow-up - where do the reference answers come from, and what does word overlap say about grounding - exposes that they do not fit the task.",
      "follow": "You have no reference answers and no budget for human labelling. What is your first metric?",
      "followAnswer": "Faithfulness for anything grounded, because it needs no reference answer - a judge checks each claim against the retrieved context. For retrieval I generate questions from chunks, so I know which chunk should come back, and measure recall at k with no human labels. Then I find whatever small budget I can to label fifty cases and check the judge, because an unchecked judge is a guess."
    },
    {
      "id": "ev-15",
      "q": "Which evaluation frameworks have you used - Ragas, DeepEval, TruLens, promptfoo, LangSmith - and what do they actually do for you?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "evaluation",
        "tooling",
        "ragas",
        "frameworks"
      ],
      "why": "Almost every GenAI job description names one of these. The panel wants to hear that you understand what the tool computes, not just that you installed it.",
      "simple": "**Short version: they are all ways to run a test set, score the answers and compare runs. The tool is not the hard part - the test set and a judge you trust are.**\n\n**What each one is known for:**\n- **Ragas** - ready-made RAG metrics: faithfulness, response relevancy (earlier called answer relevancy), context precision and context recall. Most use an LLM as the judge under the hood.\n- **DeepEval** - evals written like unit tests (pytest style), with many built-in metrics and custom rubric metrics (G-Eval). Easy to drop into CI.\n- **TruLens** - known for the \"RAG triad\": context relevance, groundedness and answer relevance, plus app tracing.\n- **promptfoo** - a config file listing prompts, models and test cases with pass/fail checks. Good for side-by-side prompt comparison and red-team tests in CI. Acquired by OpenAI in 2026 and still open source.\n- **LangSmith, Langfuse, Arize Phoenix** - observability platforms that also store datasets, run evaluators and compare experiments next to the traces.\n\n**What to say beyond the names:**\n- A \"faithfulness\" metric is usually an LLM judge with a fixed prompt, so check it against human labels before trusting it.\n- Pin the judge model and the library version. If either changes, scores move even though your app did not.\n- Scores are not comparable across tools - each defines its metrics a little differently.\n\nThink of these tools like a test runner: pytest does not write good tests for you, and Ragas does not give you a good golden set.",
      "points": [
        "**Ragas** - RAG metrics (faithfulness, response relevancy, context precision and recall), mostly LLM-judged.",
        "**DeepEval** - pytest-style LLM tests with built-in and custom (G-Eval) metrics; fits CI.",
        "**TruLens** - the RAG triad (context relevance, groundedness, answer relevance) plus tracing.",
        "**promptfoo** - config-driven prompt and model comparisons, and red-team tests in CI.",
        "**LangSmith / Langfuse / Phoenix** - datasets, evaluators and experiments beside the traces.",
        "Judged metrics need calibration against humans; pin the judge model and library version.",
        "Scores are not comparable across tools."
      ],
      "say": "I typically use Ragas for RAG metrics like faithfulness and context recall, and a pytest-style tool like DeepEval to run evals in CI, with traces and experiment comparisons in Langfuse or LangSmith. The key point is that most of these metrics are an LLM judge behind a fixed prompt, so I calibrate them against human labels, pin the judge model and library version, and never compare scores across tools.",
      "numbers": "No universal number. A practical check: before trusting a framework's judged metric, have humans label 50–100 of the same answers and confirm the tool agrees with them most of the time.",
      "wrong": "\"We use Ragas, so our evaluation is covered.\" A tool computes scores. It does not give you a representative test set, correct labels or a judge you have checked.",
      "follow": "Ragas says faithfulness is 0.92. How do you know that number is right?",
      "followAnswer": "I don't, until I check it. I take fifty to a hundred answers, have a domain expert mark each claim as supported or not, and compare with the tool's verdicts - raw agreement plus something like Cohen's kappa. I read the disagreements to see whether the judge is too lenient on paraphrase or misses wrong numbers. Then I pin the judge model and re-check after any library or judge change."
    },
    {
      "id": "ev-06",
      "q": "How does evaluation fit into CI/CD?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "ci",
        "llmops",
        "process"
      ],
      "why": "Whether evaluation is a practice in your team or a slide.",
      "simple": "**The problem:** LLM evals are slow and cost money. Put the whole suite on every commit and people will start skipping it.\n\n**So split it into tiers - cheap and frequent at the bottom, expensive and rare at the top.**\n\n**Every commit** - the free, fast layer. Unit tests with the model faked out, checks that the output format is valid, and retrieval metrics against the labelled set (no model calls needed). It takes seconds and costs nothing, so nobody has an excuse.\n\n**Every pull request that changes a prompt or a chain** - run about fifty test cases against the real model. A few minutes, a few dollars. Post the result on the pull request as \"this branch versus main\", so the reviewer sees the effect of the change instead of guessing.\n\n**Before release** - the full golden set, with a threshold. If quality drops below the current production score, the deploy is blocked.\n\n**Nightly** - the full set again, plus samples of real production traffic. This catches drift that no code change caused: the provider quietly updated the model, or users started asking new kinds of questions.\n\nOne rule ties it together: a prompt change is a deploy. Version it and test it like code.",
      "points": [
        "Every commit - mocked unit tests, schema checks, retrieval metrics. Free and fast.",
        "Every PR touching prompts - 50-case subset, results posted as a diff on the PR.",
        "Pre-release - full golden set with a blocking threshold.",
        "Nightly - full set plus production samples, to catch drift with no code change.",
        "Version prompts like code. A prompt change is a deploy."
      ],
      "say": "Tiered, or people skip it. Every commit runs the free layer: mocked unit tests, schema validation and retrieval metrics, which need no model calls. Every pull request that touches a prompt runs a fifty-case subset against a real model, posted as a diff against main so the reviewer sees the effect. Pre-release runs the full golden set with a blocking threshold. Nightly runs it again to catch drift no code change caused.",
      "numbers": "Fifty cases per PR is usually a few minutes and a few dollars - cheap enough that nobody argues, large enough to catch a real regression.",
      "wrong": "\"We run evals before major releases.\" Then a prompt change ships untested, and prompt changes are where regressions come from.",
      "follow": "The eval blocks a release the business wants today. What do you do?",
      "followAnswer": "I look at what failed before arguing. If it is a real regression in something users hit, I show the examples and the business decides with facts - perhaps shipping with that feature flagged off. If it is noise or a known flaky case, I re-run it and fix the test afterwards. What I never do is quietly lower the threshold; any override is recorded with a named approver."
    },
    {
      "id": "ev-10",
      "q": "Your offline scores are great and users are unhappy. Explain.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "debugging",
        "judgement"
      ],
      "why": "A diagnostic scenario. It tests whether you understand the limits of your own measurements.",
      "simple": "**Short version: your test is measuring something different from what users care about.** Usually it is one of five reasons.\n\n**1. The test set does not look like real traffic.** Engineers wrote it, or a model generated it. Real users ask shorter, vaguer questions, in other languages, about things nobody anticipated. This is the most common cause by far.\n\n**2. You are measuring the wrong thing.** Faithfulness is high because the answer just repeats the retrieved text - but it never actually answers the question. High score, useless answer.\n\n**3. You tuned until the test stopped being a test.** If the same set guided a hundred prompt tweaks, the prompt has effectively memorised it - like a student who has already seen the exam paper.\n\n**4. The problem is not correctness at all.** It is speed, tone or format. The answer is right, but it arrives after the user gave up.\n\n**5. The average hides a failing group.** Overall 0.9, but one language or one document type sits at 0.6 - and that group is the one complaining.\n\n**The move:** take fifty real complaints, run them through your pipeline, and look for cases where your score says \"good\" but the user said \"bad\". That gap is the answer - and those fifty cases become your next golden-set additions.",
      "points": [
        "Eval set does not match real traffic - the most common cause by far.",
        "Measuring a property that is not usefulness.",
        "Overfitted to the set through repeated tuning.",
        "The complaint is latency or tone, not correctness.",
        "Averages hide a failing segment. Slice by language, document type, user group.",
        "Fix: run 50 real complaints through the pipeline and find where score and reality disagree."
      ],
      "say": "Usually the eval set does not match real traffic, because it was written by engineers rather than sampled from users. Or I am measuring the wrong property - faithfulness stays high when the answer just repeats the context without answering. Or we overfitted by tuning against the same set. Or the complaint is latency, not correctness. I take fifty real complaints, run them through the pipeline, and find where the score and reality disagree.",
      "numbers": "Always slice quality metrics by language, document type and user segment. A 0.9 average routinely hides a 0.6 segment, and that segment is the one complaining.",
      "wrong": "\"The users do not understand what the system can do.\" It may even be partly true, but the interviewer wants a diagnosis of your measurement, and this answer skips it.",
      "follow": "How would you stop your eval set drifting away from production again?",
      "followAnswer": "Make refreshing it a routine, not a project. Every month, sample new real queries into the set and add every confirmed complaint as a case. Track the topic and language mix of the set against live traffic, so gaps show up on a dashboard. Keep a held-out slice nobody tunes against. And after each release, compare online metrics with offline scores, so a gap between them is noticed early."
    },
    {
      "id": "ev-05",
      "q": "How do you evaluate something that has no single correct answer?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "subjective",
        "rubric"
      ],
      "why": "Summarisation, drafting and creative tasks are common, and most candidates have only evaluated extraction.",
      "simple": "**Short version: stop asking \"is it correct?\" and start asking \"does it have the properties a good answer needs?\"**\n\nA summary has no single right wording. But you can still check specific things:\n- Does it contain any claim that is **not in the source**?\n- Does it **cover the key points**?\n- Is it within the **length limit**?\n- Is the **tone** right?\n\nSome of these plain code can check - length, banned phrases, required sections. The rest a judge can check with a clear rubric.\n\n**The second trick is A-versus-B comparison.** People and judges are both much better at \"which of these two is better?\" than at \"score this out of ten\". Think of an eye test: the optician never asks you to rate a lens from 1 to 10 - they ask \"clearer with this one, or this one?\" So to compare two versions, run both on the same inputs, ask which wins, and shuffle the order. You get a **win rate**, which is far more trustworthy than two averaged scores.\n\nFinally, keep a small human review for the things no rubric captures, focused on the cases the automatic checks marked as borderline.",
      "points": [
        "Decompose into checkable properties instead of scoring correctness.",
        "Code-check what code can check: length, format, required sections, banned terms.",
        "Judge the rest with a rubric that has concrete examples per level.",
        "Pairwise comparison with randomised order beats absolute scoring.",
        "Report win rate against the current production version."
      ],
      "say": "I stop scoring correctness and score properties instead. For a summary: does it contain a claim absent from the source, does it cover the key points, is it within length, is the tone right. Some of those code can check, the rest a judge with a rubric can. For comparing versions I use pairwise - which of these two is better, with order randomised - because win rate is far more reliable than averaged absolute scores.",
      "numbers": "Pairwise win rate against the current production version is the cleanest release signal. Decide the bar before the test and check the win rate is distinguishable from 50% at your sample size - a tie can still be worth shipping if the new version is cheaper or faster.",
      "wrong": "\"Subjective tasks cannot really be evaluated.\" The follow-up is how you would compare two summary prompts, and decomposing into checkable properties plus pairwise comparison is the answer it is looking for.",
      "follow": "How do you stop the judge just preferring the longer summary?"
    },
    {
      "id": "ev-17",
      "q": "The same input gives a different output on every run. How do you evaluate a system like that?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "non-determinism",
        "variance",
        "statistics"
      ],
      "why": "Whether you trust a single run. Many reported 'improvements' are just noise.",
      "simple": "**Short version: one run is one sample, not the truth. Run more than once, look at the spread, and only believe a change that is bigger than the noise.**\n\nLLMs are not fully repeatable. Even at temperature 0 on a hosted model, outputs can differ slightly. So if version A scores 82% and version B scores 84% on one run each, you may have learned nothing - the next run could flip it.\n\n**What to do:**\n\n**1. Measure the noise first.** Run the same version on the same test set three to five times and see how much the score moves. That is your noise floor. Any \"improvement\" smaller than that is not real.\n\n**2. Use enough test cases.** With 30 cases, one case flipping moves the score by about 3%. With 300 cases, it moves by about 0.3%. More cases means less noise.\n\n**3. Compare on the same questions.** Run A and B on identical inputs and count where they differ - \"B fixed 12 cases and broke 4\". That tells you far more than two averages.\n\n**4. For important cases, measure consistency, not just success.** \"Passes at least once in 5 tries\" (pass@k) and \"passes all 5 tries\" (often written pass^k) are very different things. A customer-facing agent needs the second one.\n\n**5. Keep settings fixed while testing** - same temperature, same model version, same judge - so the only thing that changes is the thing you are testing.\n\nIt is like weighing yourself. One reading straight after lunch means nothing - you look at several readings over time.",
      "points": [
        "One run is a sample. Measure the noise floor by repeating the same version 3–5 times.",
        "Bigger test sets shrink noise: one flip is ~3% of 30 cases but ~0.3% of 300.",
        "Compare A and B on identical inputs; count cases fixed versus broken.",
        "pass@k (succeeds at least once) versus pass^k (succeeds every time) - pick the one your product needs.",
        "Pin temperature, model version and judge while comparing."
      ],
      "say": "I treat one run as one sample. First I measure the noise floor by running the same version three to five times, and I only believe a change bigger than that spread. I use a few hundred cases so one flip barely moves the score, compare versions on identical inputs by counting cases fixed and broken, and for agents I report whether a case passes every time, not just once.",
      "numbers": "With 50 cases, each case is worth 2 percentage points - so a 2-point 'win' can be one lucky answer. Repeat runs 3–5 times and report the average and the range.",
      "wrong": "\"The new prompt scored 84 against 82, so it is better.\" On one run each, a gap that small is often within normal run-to-run noise.",
      "follow": "Your agent passes a task 4 times out of 5. Is it ready to ship?"
    },
    {
      "id": "ev-16",
      "q": "How do you evaluate a multi-turn chatbot, not just single answers?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "conversation",
        "multi-turn",
        "chatbot"
      ],
      "why": "Most eval sets are one question, one answer. Real chat products fail on turn four.",
      "simple": "**Short version: test whole conversations, not single questions - because most chatbot failures only show up a few turns in.**\n\nA single-turn test asks one question and grades one answer. But real users say things like \"what about the second one?\" or \"no, I meant last year\". The bot has to remember, work out what \"it\" refers to, and not contradict itself.\n\n**Three ways to build multi-turn tests:**\n\n**1. Replay real conversations.** Take real chat logs, with personal data removed. Keep the earlier turns fixed and grade only the bot's reply to the last turn. Simple, cheap and realistic.\n\n**2. Scripted scenarios.** Write conversations that each test one skill: a follow-up that depends on memory, a user who changes their mind, a topic switch, a correction (\"no, that's wrong\").\n\n**3. Simulated users.** Use a second LLM to play the user, with a goal and a persona - \"impatient customer who wants a refund\". Let the conversation run, then grade the whole transcript. This finds surprises, but it is noisier, so run each scenario several times.\n\n**What to grade:**\n- **Each turn** - is this reply correct and grounded?\n- **The whole conversation** - did it remember earlier facts? Did it contradict itself? Did it stay in role and within policy?\n- **The end** - did the user reach their goal? How many turns did it take? Did it hand over to a human when it should have?\n\nIn production, watch conversation-level signals: users repeating themselves, conversations that end without a resolution, and escalations.",
      "points": [
        "Most chat failures appear only after a few turns.",
        "Replay real anonymised logs, keep earlier turns fixed, grade the last reply.",
        "Scripted scenarios for memory, corrections and topic switches.",
        "Simulated users (an LLM playing a persona) for wider coverage - run each several times.",
        "Grade each turn, the whole conversation, and final goal completion.",
        "Online: repeated questions, unresolved endings, escalations."
      ],
      "say": "I test whole conversations, because most chatbot failures appear on turn three or four. I replay real anonymised logs with earlier turns fixed and grade the final reply, add scripted scenarios for follow-ups, corrections and topic switches, and use an LLM-simulated user for broader coverage, run several times. I grade each turn for correctness, the whole conversation for memory and consistency, and the end for goal completion and turn count.",
      "numbers": "Start with 30–50 multi-turn scenarios of 3–6 turns each. Run simulated-user scenarios at least three times each - one run of a conversation between two models tells you little.",
      "wrong": "\"We evaluate each question independently.\" That misses the failures users actually hit: forgetting context, resolving \"it\" to the wrong thing, and contradicting an earlier answer.",
      "follow": "Your simulated user is too polite and never tests edge cases. How do you fix that?"
    },
    {
      "id": "ev-07",
      "q": "What do you monitor in production for a GenAI system?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "monitoring",
        "production",
        "llmops"
      ],
      "why": "Whether you have operated one, where you have no labels and no reproducibility.",
      "simple": "**Short version: four groups of signals - and most candidates only mention the first.** (This is the whole-system view. For telling retrieval failures from generation failures in RAG, see rag-49.)\n\n**1. System health** - error rate, p50 and p95 latency, timeouts, provider rate limits, retries. Normal, necessary, and not enough on its own.\n\n**2. Cost** - tokens per request, cost per request, cost per completed task, split by feature. This dashboard gets attention fastest, because it is the one finance asks about.\n\n**3. Quality signals** - in production nobody hands you the correct answer, so you watch clues instead: groundedness on a sample, whether citations are valid, how often the model says \"I don't know\", retrieval scores, answer length, and how often the output fails to parse. Each of these moves before users complain. A sudden drop in \"I don't know\" answers can mean the model started inventing instead of declining.\n\n**4. User behaviour** - thumbs up and down, users rephrasing the same question, users giving up, escalation to a human, and the business metric.\n\n**Alert on changes, not fixed numbers.** You will not know the \"right\" refusal rate in advance. But you will notice when it moves 20% overnight.\n\nA GenAI system can be perfectly healthy - fast, no errors - and still be confidently wrong. That is why groups 3 and 4 exist.",
      "points": [
        "Health: errors, p50 and p95, timeouts, rate limits, retries.",
        "Cost: tokens and cost per request and per resolved task, split by feature.",
        "Quality proxies: groundedness sample, citation validity, refusal rate, retrieval scores, parse failures.",
        "Behaviour: thumbs, rephrase rate, abandonment, escalation, business metric.",
        "Alert on change, not on absolute thresholds you had to guess."
      ],
      "say": "Four groups. System health - errors, p95, timeouts, rate limits. Cost - tokens and cost per request and per resolved task, split by feature. Quality proxies, since there are no labels in production - sampled groundedness, citation validity, refusal rate, retrieval score distribution and parse failures. And user behaviour - thumbs, rephrase rate, escalation. I alert on the deltas, because I cannot know the right absolute value in advance.",
      "numbers": "Sample 1–5% of traffic for automated quality checks. As a starting point, alert on a 10–20% day-over-day shift in any quality proxy, then tune to your traffic's normal variance.",
      "wrong": "\"Latency, errors and uptime.\" That monitors the service, not the model. A GenAI system can be perfectly healthy and completely wrong.",
      "follow": "Refusal rate dropped 30% overnight. Walk me through your investigation."
    },
    {
      "id": "ev-08",
      "q": "How do you A/B test a GenAI feature?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "ab-testing",
        "experimentation"
      ],
      "why": "The bridge between engineering and business impact, which is what a hiring manager is listening for.",
      "simple": "**Short version: like any A/B test, plus two extra problems - noisy outputs and cost.**\n\n**The basics:**\n- Split by **user**, not by request, so one person gets a consistent experience.\n- Choose the **main metric before you start**, and make it a business metric - resolution rate, handling time - not a model score.\n- Set **guardrail metrics** that must not get worse: cost per request, p95 latency, escalation rate.\n- Run it long enough to be statistically sure.\n\n**Extra problem 1: noise.** The same model gives different answers on different runs, so results bounce around more than in a normal A/B test. You need more traffic, or more time, to be sure.\n\n**Extra problem 2: cost.** If version B uses a pricier model, the experiment itself costs money. Cap how many users see B, and know the daily spend before you start.\n\n**Before any of that: a shadow run.** Send a copy of real traffic to B, compare the answers offline, and show B's answers to nobody. It catches disasters with zero user risk - and it is the step most teams skip.",
      "points": [
        "Split by user, not request. Consistency matters more than balance.",
        "Primary metric is a business metric, chosen before launch.",
        "Guardrails: cost per request, p95 latency, escalation rate.",
        "Higher output variance means a higher noise floor - plan for more traffic.",
        "Shadow run first: real traffic to B, compared offline, shown to no one."
      ],
      "say": "Split by user, not request, so the experience stays consistent. Pick the primary metric before launch and make it a business metric - resolution rate, handling time - with cost and p95 as guardrails that must not degrade. Model variance raises the noise floor, so I plan for more traffic than a normal test. And I shadow-run first: real traffic to B, compared offline, visible to nobody, which catches disasters at zero user risk.",
      "numbers": "Shadow-run on 5–10% of traffic before any user-visible split. Set a daily spend cap on the experiment arm before it starts.",
      "wrong": "\"We show both answers and let users pick.\" That is a preference test, not an A/B test, and it changes the product while measuring it.",
      "follow": "B wins on quality and costs three times more. What do you recommend?"
    },
    {
      "id": "ev-09",
      "q": "How do you prove your GenAI project delivered business value?",
      "round": [
        "manager",
        "hr"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "business",
        "story",
        "roi"
      ],
      "why": "The hiring manager's real question. Technical metrics do not fund a second phase.",
      "simple": "**Short version: tie it to a number the business already tracked before your project existed.**\n\nA faithfulness score of 0.94 means nothing to the person approving next year's budget. So use a metric that already existed: average handling time, first-contact resolution, documents processed per hour, support tickets avoided, time from request to answer.\n\n**Make it believable:**\n- **Baseline first** - measure the number before you ship.\n- **Fair comparison after** - ideally one group with the feature and one without, at the same time. Before-versus-after on everyone is weaker, because something else always changes in the same month.\n- **Be honest about credit.** If handling time fell 12% and a process change landed the same month, say so. Overclaiming is the most common way this answer fails, and experienced managers notice.\n- **Include the running cost.** Value minus cost is the number that gets phase two approved.\n\nAnd count adoption. A feature nobody uses delivered nothing, however good its scores.",
      "points": [
        "Use a metric that existed before the project. Do not invent one.",
        "Baseline before, comparison after, ideally on a controlled split.",
        "State attribution honestly - name what else changed.",
        "Include running cost. Net value is what gets funded.",
        "Adoption is a real metric. A feature nobody uses delivered nothing."
      ],
      "say": "I connect it to a metric that existed before the project - average handling time, first-contact resolution, documents processed per hour - with a baseline measured before we shipped and a controlled comparison after, not just before-and-after on everyone. I state attribution honestly if something else changed in the same window. And I include the running cost, because net value is what gets phase two approved.",
      "numbers": "Use your real figures - baseline, after, sample size, run cost per month. A specific modest number is far more credible than a round large one.",
      "wrong": "\"It saved a lot of manual effort.\" No baseline, no number, no attribution. It reads as a project you did not measure.",
      "follow": "What did not work, and what did that cost you?"
    },
    {
      "id": "ev-13",
      "q": "How do you grade an agent on the state it leaves behind, not what it says it did?",
      "round": [
        "tech1",
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "agents",
        "trajectory",
        "tools",
        "regression"
      ],
      "why": "ag-09 and ag-31 cover agent metrics and trajectory scoring. This is the harness question: a controlled environment, verifying the real end state, and mixing graders - because final-text scoring can say success when the tool calls were unsafe, wasteful or wrong.",
      "simple": "**Short version: check what actually changed in the world, not what the agent says it did.**\n\nAn agent's final message is just text. It can say \"your flight is booked\" when nothing was booked. So for each test task I:\n\n**1. Define success clearly** - for example, \"a booking exists for this passenger on this date\".\n**2. Run the agent in a safe test environment** - sandboxed or fake systems, not production.\n**3. Record the full trace** - every model turn, tool call, argument and result.\n**4. Check the end state** - look in the booking system. Is the reservation really there?\n\nThe end state is usually the most important check. Then I look at **the path** when it matters: did it call the right tools, with valid arguments, in the required order? How many turns did it take? What did it cost?\n\nIt is like checking a plumber's work: you do not trust the invoice that says \"leak fixed\" - you turn on the tap.\n\n**Mix graders:** plain code for things code can check (does the record exist?), an LLM judge for open-ended quality, and humans to check the judge and review important failures.\n\n**Run important cases several times**, because agents behave differently from run to run. Once a hard case passes reliably, it moves into the regression suite, so later changes cannot quietly break it.\n\n(Metric definitions for tool selection and trajectory scoring: ag-09 and ag-31.)",
      "points": [
        "Grade the environment outcome, not only what the agent claims in its final message.",
        "Keep the full trace or trajectory: model turns, tool calls, arguments, intermediate results and state changes.",
        "Use deterministic graders where possible, model graders for nuance, and humans for calibration and high-value review.",
        "Track efficiency too: turns, tool calls, tokens, latency and cost.",
        "Run multiple trials for important non-deterministic tasks.",
        "Turn solved capability cases and production failures into regression tests."
      ],
      "say": "I evaluate an agent at two levels: the outcome and the path. The outcome is the real external state, such as whether a reservation actually exists, not whether the final message says it does. Then I inspect the trajectory for required or unsafe tool calls, bad arguments, excess turns, tokens and latency. I combine deterministic, model and human graders, run repeated trials where variance matters, and promote solved or production-failure cases into regression tests.",
      "numbers": "There is no universal trial count. Use more repeated trials for high-variance or high-risk cases, and report both pass rate and the number of trials so the score is interpretable.",
      "wrong": "Grading only the final answer. An agent can produce a polished confirmation after calling the wrong tool, changing the wrong record or failing to change anything at all.",
      "follow": "The agent gets the right outcome but uses a different tool sequence from your reference solution. Do you fail it?"
    },
    {
      "id": "ev-12",
      "q": "How do you red team a GenAI application before launch?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "evaluation",
        "red-team",
        "guardrails",
        "safety",
        "process"
      ],
      "why": "Increasingly a named requirement in enterprise and BFSI JDs, and most candidates conflate it with ordinary testing.",
      "simple": "**Short version: testing checks that the system does what it should. Red teaming checks what it does when someone is actively trying to break it.**\n\nDifferent mindset, different people. And a red team that finds nothing has failed, not passed.\n\n**Organise it by type of attack**, rather than improvising:\n- **Prompt injection** - direct (in the user's message) and indirect (hidden inside a document the system reads). Indirect matters most for RAG: an attacker plants instructions in a file that later gets retrieved.\n- **Jailbreaks** - role-play, \"hypothetically...\", encoded text, slowly escalating over many turns.\n- **Data extraction** - trying to reveal the system prompt, another customer's data, or training data.\n- **Harm specific to your domain** - a bank worries about unauthorised financial advice, a health app about diagnosis.\n- **For agents, dangerous actions** - can someone talk it into deleting, paying or sending something?\n\n**Run it like a campaign.** Use tools such as PyRIT, garak or promptfoo to generate lots of attacks automatically, and humans for the creative ones nobody scripted. Include people outside the build team - builders are blind to their own assumptions. Log every attempt and its result.\n\n**The step that makes it engineering, not theatre:** every attack that works becomes a permanent test that runs on every deploy.\n\n**Agree the launch rules before you start** - which severity blocks launch, which can ship with a fix planned - or the findings get argued away under deadline pressure.",
      "points": [
        "Testing checks intended behaviour; red teaming checks adversarial behaviour.",
        "A red team that finds nothing has failed.",
        "Cover: direct and indirect injection, jailbreaks, data extraction, domain-specific harm, destructive tool calls.",
        "Indirect injection through ingested documents is the RAG-specific one people miss.",
        "Mix automated generation for volume with humans for creativity; include outsiders.",
        "Every successful attack becomes a permanent regression test.",
        "Agree severity thresholds that block launch before you start, not after."
      ],
      "say": "Testing checks the system does what it should; red teaming checks what it does when someone tries to break it, so a red team that finds nothing has failed. I structure it by attack class - direct and indirect injection, jailbreaks, data extraction, domain-specific harm, and destructive tool calls for agents. I mix automated generation with human creativity and outsiders, and every successful attack becomes a permanent regression test.",
      "numbers": "Indirect injection through an ingested document is the one to demonstrate. If your corpus accepts user-uploaded files, that is a live path from an attacker into your model's instructions.",
      "wrong": "Describing it as running the guardrail test suite again. That is testing your known controls, which is the opposite of looking for the unknown ones.",
      "follow": "Red teaming found a jailbreak you cannot fully fix. Do you launch?"
    },
    {
      "id": "ev-14",
      "q": "The agent reaches the right outcome through a different tool path. Is that a failure?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "evaluation",
        "agents",
        "trajectory",
        "judgement"
      ],
      "why": "A modern agent-eval judgement question: do you verify safety and outcomes without overfitting the grader to one exact path?",
      "simple": "**Short version: usually no. Grade the result and the rules that truly matter - not your favourite route.**\n\nThere is often more than one valid way to finish a task. If the agent looked up the order first and the customer second, instead of the other way round, and the outcome is correct, that is fine.\n\nSo I grade in three layers.\n\n**1. The outcome.** Did the right change happen? Did the user get the right answer?\n\n**2. The hard rules.** Some steps are real requirements, and breaking them is a fail even if the outcome looks right. For example: verify identity before a refund, get approval before a destructive action, never call a tool the agent is not allowed to use.\n\n**3. Efficiency - measured, not failed.** Extra tool calls, too many turns, tokens, latency. Track them so waste is visible, but do not fail a correct run just because it took a different path.\n\nThink of a taxi to the airport. You care that you arrived on time and the driver obeyed the traffic rules - not that they took the exact route your map app suggested.\n\nExact path matching is fine for a narrow protocol test. For measuring whether an agent can do the job, it is too brittle - it punishes valid alternatives.",
      "points": [
        "Prefer outcome checks over exact path matching.",
        "Hard-fail safety and business invariants such as approval, identity and permission rules.",
        "Measure unnecessary calls, turns, latency and tokens as efficiency metrics.",
        "Only require an exact sequence when the sequence is genuinely part of the contract.",
        "Avoid graders that punish valid alternative strategies."
      ],
      "say": "Usually not. I grade the real outcome first and then enforce only the trajectory rules that are true requirements, such as verifying identity before a refund or getting approval before a destructive action. A different valid sequence should pass. I still measure extra tool calls, turns, tokens and latency so inefficient behaviour is visible. Exact path matching is useful for protocol tests, but it is often too brittle for an agent capability evaluation.",
      "numbers": "Track efficiency distributions such as median and p95 turns or tool calls rather than one magic maximum, then set hard limits only where cost, latency or safety requires them.",
      "wrong": "Failing every run that differs from the reference trace. That teaches the evaluation to prefer one implementation rather than measuring whether the agent solved the task safely and correctly.",
      "follow": "Which tool calls would you make mandatory in a refund-agent evaluation?"
    }
  ]
};
