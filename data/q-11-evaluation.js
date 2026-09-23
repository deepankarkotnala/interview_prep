/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["11-evaluation"] = {
  "lede": "Evaluation in 2026 covers both single-turn GenAI and multi-step agents. Strong answers separate final outcomes from the trajectory that produced them, combine deterministic, model and human graders, run repeated trials where variance matters, and turn real failures into regression tests.",
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
      "tags": [
        "evaluation",
        "basics",
        "metrics"
      ],
      "why": "The opening question of the whole topic. It reveals in thirty seconds whether you have shipped.",
      "simple": "Two layers, and you need both.\n\nOffline: a fixed set of test cases with known good answers - the golden set. You run it on every change and it tells you whether you broke something. It is fast, repeatable and cheap, and it is the only way to compare two versions fairly, because both see identical inputs.\n\nOnline: what real users do. Thumbs up and down, whether they rephrase the question, whether they click the citation, whether they escalate to a human, and the actual business metric - resolution rate, handling time, conversion.\n\nThe relationship between them is the point. Offline tells you whether you broke something. Online tells you whether it mattered. Teams that only do offline ship changes that score well and help nobody. Teams that only do online cannot debug, because they cannot isolate a change.",
      "points": [
        "Offline golden set - regression safety, version comparison, runs in CI.",
        "Online signals - thumbs, rephrase rate, citation clicks, escalation.",
        "Business metric - the one your manager is measured on.",
        "Offline catches breakage; online proves value. Neither replaces the other."
      ],
      "say": "Two layers. Offline is a golden set of cases with known good answers that runs on every change - it is the only fair way to compare two versions, because both see the same inputs. Online is real user behaviour: thumbs, rephrase rate, citation clicks, escalation to a human, and the business metric underneath. Offline tells me whether I broke something. Online tells me whether it mattered.",
      "numbers": "A common starting point is around 100 golden cases. With only a few dozen, run-to-run noise can be as large as the change you are trying to measure, so report variance as well as the average.",
      "wrong": "\"We test it manually before release.\" Honest, but the follow-up is how you compare two versions or prove a change broke nothing - and manual spot checks cannot answer either.",
      "follow": "Where does that golden set come from?"
    },
    {
      "id": "ev-02",
      "q": "How do you build a golden evaluation set?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "dataset",
        "process"
      ],
      "why": "Everyone agrees you need one. Few candidates can describe getting one built.",
      "simple": "The best source is production. Real user queries, sampled across the distribution you actually serve, not the ones you imagined. Add every failure anyone reported, because failures are the highest-value cases you have.\n\nThen you need correct answers, and that means a domain expert, not an engineer. For a claims assistant, a claims person. This is the part that takes real calendar time and the part candidates skip when describing it - which is exactly why mentioning it lands well.\n\nCover deliberately: common cases, edge cases, adversarial inputs, cases where the correct answer is \"I do not know\", and multilingual if the product serves multiple languages. That last category matters more than people expect - a set with no unanswerable questions will never catch a model that has stopped refusing.\n\nThen freeze it and version it. A set that quietly changes cannot be used to compare two releases. Grow it by adding new cases as new versions, never by editing old ones.",
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
      "follow": "How do you keep it from going stale as the product changes?"
    },
    {
      "id": "ev-03",
      "q": "What is LLM-as-a-judge, and when do you trust it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "llm-judge",
        "bias"
      ],
      "why": "Everyone uses judges now. The senior signal is knowing where they lie to you.",
      "simple": "You use a model to score another model's output - is this answer supported by the context, is it relevant, is it complete. It scales in a way human review never will, and for open-ended text there is often no other option.\n\nBut judges have known biases, and naming them is what separates a good answer here. They prefer longer answers. They prefer their own family's writing style. They are sensitive to option order in comparisons. They cluster scores in the middle of a numeric scale and avoid the extremes. And they are inconsistent - the same input can get different scores on different runs.\n\nSo you calibrate. Have humans label a couple of hundred examples, run the judge on the same ones, and measure agreement - raw agreement plus a chance-corrected measure such as Cohen's kappa. If the judge agrees with your experts, you can use it at scale, and you re-check that agreement periodically. If it does not, fix the rubric before you trust a single number it produces.\n\nThe design rules that help: binary or three-point scales rather than one-to-ten, an explicit rubric with examples, ask for the reason before the score, and randomise order in pairwise comparisons.",
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
      "follow": "Your judge scores 0.9 and users are complaining. What is happening?"
    },
    {
      "id": "ev-04",
      "q": "Which RAG metrics are deterministic, which need an LLM judge, and which do you lead with?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "rag",
        "metrics"
      ],
      "why": "rag-07 covers the full RAG evaluation design. This checks the next layer: sorting metrics by which half of the pipeline they test and how they are scored, and knowing which can run on every commit.",
      "simple": "**Short version: sort RAG metrics two ways - which half they test (retrieval or generation) and who scores them (code or an LLM judge). The full evaluation design is in rag-07.**\n\nRetrieval, scored by code: with a labelled set of questions and the chunks that answer them, recall@k (is the right chunk in the top k), MRR (is it near the top) and hit rate are objective, need no model calls, and can run on every commit.\n\nRetrieval, scored by a judge: RAGAS context precision (is the retrieved context mostly relevant and ranked near the top) and context recall (did retrieval bring back everything the answer needs). They are still retrieval metrics - they just use an LLM instead of chunk labels, so they cost money and need calibration.\n\nGeneration, scored by a judge: faithfulness (is every claim supported by the retrieved context) and answer relevance (does it address the question asked). Faithfulness is the one to lead with, because it is the closest proxy to hallucination and the one a regulated employer will ask about by name.\n\nAny judged metric is only as good as the judge, so check it against human labels before trusting the number.\n\nThen end-to-end task success on the golden set - the number a business stakeholder understands - with cost and p95 latency alongside.",
      "points": [
        "Retrieval, code-scored: recall@k, MRR, hit rate - objective, cheap, run in CI.",
        "Retrieval, judge-scored: RAGAS context precision and context recall.",
        "Generation, judge-scored: faithfulness and answer relevance.",
        "Faithfulness is the hallucination proxy. Lead with it.",
        "Calibrate every judged metric against human labels before trusting it.",
        "End-to-end task success is the number a stakeholder understands.",
        "Track cost and p95 latency alongside - a quality win that doubles cost is not a win."
      ],
      "say": "I sort them two ways: which half of the pipeline they test, and whether code or a judge scores them. Retrieval gets recall at k and MRR from a labelled set - cheap enough for every commit - plus RAGAS context precision and recall, which are judged retrieval metrics. Generation gets faithfulness and answer relevance. I lead with faithfulness as the hallucination proxy, calibrate the judge against human labels, and report end-to-end task success with cost and p95.",
      "numbers": "Useful bar: recall@10 above 0.90 before touching the prompt, and faithfulness above 0.90 before launch. Set your own thresholds from your own data.",
      "wrong": "Naming BLEU or ROUGE. They compare word overlap with a reference answer, which says little about groundedness in open-ended generation - the follow-up about where the reference answers come from exposes that (see ev-11).",
      "follow": "Faithfulness is 0.95 but users say the answers are useless. Explain."
    },
    {
      "id": "ev-05",
      "q": "How do you evaluate something that has no single correct answer?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "subjective",
        "rubric"
      ],
      "why": "Summarisation, drafting and creative tasks are common, and most candidates have only evaluated extraction.",
      "simple": "Stop trying to score correctness and start scoring properties. A summary has no single right form, but it can be checked for specific things: does it contain any claim not in the source, does it cover the key points, is it within the length limit, does it keep the required tone.\n\nEach of those is checkable. Some by code - length, banned phrases, required sections. Some by a judge with a clear rubric.\n\nThe second technique is pairwise comparison. Humans and judges are both far more reliable at \"which of these two is better\" than at \"score this out of ten\". So for version comparison, run A and B on the same inputs and ask which wins, with the order randomised. You get a win rate, which is a much more trustworthy signal than a pair of averaged scores.\n\nAnd keep a small human review loop for the things no rubric captures, weighted toward cases the automated checks flagged as borderline.",
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
      "id": "ev-06",
      "q": "How does evaluation fit into CI/CD?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "ci",
        "llmops",
        "process"
      ],
      "why": "Whether evaluation is a practice in your team or a slide.",
      "simple": "The problem with LLM evaluation in CI is that it is slow and costs money, so if you put the whole thing on every commit, people will start skipping it.\n\nSo tier it. On every commit, the fast deterministic layer: unit tests with the model mocked, schema validation, and retrieval metrics against the labelled set, which needs no model calls at all. Seconds, free, no excuses.\n\nOn every pull request that touches a prompt or a chain, a subset - maybe fifty cases with a real model. A few minutes and a few dollars. The result is posted on the PR as a comparison against main, so the reviewer sees the effect of the change rather than guessing.\n\nBefore release, the full golden set, with a threshold that blocks the deploy if quality drops below the current production score.\n\nNightly, the full set against production traffic samples, to catch drift that no code change caused - a provider model update, or a shift in what users are asking.",
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
      "follow": "The eval blocks a release the business wants today. What do you do?"
    },
    {
      "id": "ev-07",
      "q": "What do you monitor in production for a GenAI system?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "monitoring",
        "production",
        "llmops"
      ],
      "why": "Whether you have operated one, where you have no labels and no reproducibility.",
      "simple": "Four groups, and candidates usually only mention the first. (This is the whole-system dashboard; for telling a retrieval failure from a generation failure in RAG, see rag-49.)\n\nSystem health: error rate, p50 and p95 latency, timeouts, provider rate limits and retries. Ordinary and necessary.\n\nCost: tokens per request, cost per request, cost per resolved task, split by feature. This one gets attention faster than any other dashboard you build, because it is the one finance asks about.\n\nQuality proxies, since you have no labels in production: groundedness on a sample, citation validity, refusal rate, retrieval score distribution, output length distribution, and parse-failure rate. Each is a leading indicator. A sudden drop in refusal rate can mean the model started inventing instead of declining.\n\nUser behaviour: thumbs, rephrase rate, session abandonment, escalation to a human, and the business metric.\n\nThen alert on the deltas, not the absolutes. You will not know the right absolute value, but you will notice when it moves ten percent overnight.",
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
      "tags": [
        "evaluation",
        "ab-testing",
        "experimentation"
      ],
      "why": "The bridge between engineering and business impact, which is what a hiring manager is listening for.",
      "simple": "Same as any A/B test, with two complications.\n\nThe mechanics: split users, not requests, so one person gets a consistent experience. Pick the primary metric before you start - a business metric like resolution rate or handling time, not a model metric. Run long enough for significance. Keep guardrail metrics that must not degrade: cost per request, p95 latency, escalation rate.\n\nThe first complication is variance. Model outputs vary run to run, so the noise floor is higher than in a normal test and you need more traffic or longer to reach significance.\n\nThe second is cost. If B uses a more expensive model, you are paying for the experiment, so cap the exposure and know the daily burn before you start.\n\nAnd before any of it, a shadow run: send a slice of real traffic to B, compare offline, show nobody. It catches disasters at zero user risk, and it is the step most teams skip.",
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
      "tags": [
        "evaluation",
        "business",
        "story",
        "roi"
      ],
      "why": "The hiring manager's real question. Technical metrics do not fund a second phase.",
      "simple": "Model metrics do not survive contact with a business review. Faithfulness of 0.94 means nothing to the person approving next year's budget.\n\nSo you connect to a metric that already existed before your project. Average handling time. First-contact resolution. Documents processed per hour. Support tickets deflected. Time from request to answer.\n\nThe credible version has a baseline, measured before you shipped, and a comparison after, ideally on a controlled split rather than before-and-after on the whole population - because something else always changes at the same time.\n\nThen be honest about attribution. If handling time fell twelve percent and a process change landed the same month, say so. Overclaiming is the most common way this answer fails, and a hiring manager who has seen a few of these will notice.\n\nAnd include the cost side. Value minus running cost is the number that gets phase two approved.",
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
      "id": "ev-10",
      "q": "Your offline scores are great and users are unhappy. Explain.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "debugging",
        "judgement"
      ],
      "why": "A diagnostic scenario. It tests whether you understand the limits of your own measurements.",
      "simple": "Usually one of five things.\n\nYour evaluation set does not match reality. It was written by engineers, or generated by a model, and real users ask differently - shorter, vaguer, in a different language, about things you never anticipated.\n\nYou are measuring the wrong property. Faithfulness is high because the answer only repeats the retrieved text, but it never actually answers the question. High score, useless output.\n\nYou optimised against the set until it stopped being a test. If the same set drove a hundred prompt iterations, you fitted to it.\n\nThe problem is not answer quality at all. It is latency, or tone, or the answer is right but arrives after the user gave up.\n\nOr the failures are concentrated in a segment your average hides - one language, one document type, one customer tier.\n\nThe move: take fifty real complaints, run them through your pipeline, and look at where the pipeline and the score disagree. That gap is the answer, and it usually also becomes your next batch of golden cases.",
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
      "follow": "How would you stop your eval set drifting away from production again?"
    },
    {
      "id": "ev-11",
      "q": "BLEU, ROUGE, BERTScore - what are they and would you use them?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "metrics",
        "theory",
        "judgement"
      ],
      "why": "Asked by name in almost every evaluation round. The mark is not the definition - it is knowing they mostly do not apply to what you build.",
      "simple": "Know the definitions, then know why you rarely reach for them.\n\nBLEU is precision over n-grams against a reference, built for machine translation. ROUGE is the recall counterpart, built for summarisation - ROUGE-L uses longest common subsequence rather than fixed n-grams. Both compare surface word overlap. BERTScore replaces exact matching with embedding similarity, so a paraphrase scores well where BLEU would score zero.\n\nNow the part that scores. All three need a reference answer, and most GenAI features do not have one. A support reply, a summary, an agent trajectory - there is no single correct string, so a metric that measures distance from one reference is measuring the wrong thing. Worse, on RAG they are actively misleading: an answer can overlap heavily with the reference and still be ungrounded, and a correct answer phrased differently scores badly. High ROUGE with a hallucinated number is entirely possible.\n\nWhere they genuinely fit: translation, and summarisation where you have real reference summaries and want a cheap regression signal in CI. They are fast and deterministic, which is worth something when you run them on every commit.\n\nWhat I actually use instead: for RAG, faithfulness and context precision and recall. For subjective output, a rubric with an LLM judge, validated against human labels. For extraction, exact field accuracy, which is the one place a hard metric works cleanly. The senior answer names the metric, then says why the task decides it.",
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
      "follow": "You have no reference answers and no budget for human labelling. What is your first metric?"
    },
    {
      "id": "ev-12",
      "q": "How do you red team a GenAI application before launch?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "red-team",
        "guardrails",
        "safety",
        "process"
      ],
      "why": "Increasingly a named requirement in enterprise and BFSI JDs, and most candidates conflate it with ordinary testing.",
      "simple": "The distinction to open with: testing checks that the system does what it should. Red teaming checks what it does when someone actively tries to make it misbehave. Different mindset, different people, different success criterion - a red team that finds nothing has failed, not passed.\n\nStructure it by attack class rather than improvising. Prompt injection, direct and indirect - the indirect case matters most for RAG, where the malicious instruction sits inside an ingested document rather than in the user's message. Jailbreaks: role-play framing, hypothetical framing, encoding tricks, slow escalation across turns. Data extraction: attempts to make it reveal the system prompt, other tenants' data, or training data. Harmful output for your domain specifically - a bank cares about unauthorised financial advice, a health product about diagnosis. And for agents, the highest-stakes class: can you talk it into a destructive tool call?\n\nRun it as a campaign, not a checklist. Mix automated adversarial generation for volume (open-source tools such as PyRIT, garak or promptfoo) with human creativity for the attacks nobody scripted, and include people from outside the build team, because authors are blind to their own assumptions. Time-box it and log every attempt with its outcome.\n\nThen the part that makes it engineering rather than theatre: every successful attack becomes a permanent regression test. The red team runs before launch; that suite runs on every deploy forever. Without that, you have an anecdote instead of a control.\n\nAnd decide the launch criteria in advance - which severities block, which get accepted with mitigation - otherwise the findings get argued away under shipping pressure.",
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
      "id": "ev-13",
      "q": "How do you grade an agent on the state it leaves behind, not what it says it did?",
      "round": [
        "tech1",
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "agents",
        "trajectory",
        "tools",
        "regression"
      ],
      "why": "ag-09 and ag-31 cover agent metrics and trajectory scoring. This is the harness question: a controlled environment, verifying the real end state, and mixing graders - because final-text scoring can say success when the tool calls were unsafe, wasteful or wrong.",
      "simple": "For an agent, I grade more than the last message. I define a task with a clear success condition, run the agent in a controlled environment, record the full trace, and verify the final state of the world.\n\nThe final outcome is usually the most important check. If a booking agent says a flight was booked, I check the reservation system rather than trusting the sentence. Then I look at the trajectory when it matters: which tools it called, whether the arguments were valid, whether it respected required steps, how many turns it took, and how much it cost.\n\nI combine graders. Deterministic checks are best for things code can verify, an LLM rubric is useful for open-ended quality, and human review is used to calibrate subjective graders and inspect important failures.\n\nBecause agent runs vary, I run multiple trials on important cases. New difficult cases measure capability; once a case is solved reliably, it becomes part of the regression suite so later changes cannot silently break it.\n\n(Metric definitions for tool selection and trajectory scoring: ag-09 and ag-31.)",
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
      "id": "ev-14",
      "q": "The agent reaches the right outcome through a different tool path. Is that a failure?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "evaluation",
        "agents",
        "trajectory",
        "judgement"
      ],
      "why": "A modern agent-eval judgement question: do you verify safety and outcomes without overfitting the grader to one exact path?",
      "simple": "Usually no. Agents can find several valid ways to complete the same task, so I do not require an exact tool sequence unless the sequence itself is part of the requirement.\n\nI first grade the outcome: did the intended state change happen, and did the user get the correct result? Then I enforce the path constraints that actually matter. For example, identity must be verified before a refund, a destructive action may require approval, and the agent must not call a tool it is not authorised to use.\n\nEverything else can be measured rather than hard-failed: unnecessary tool calls, too many turns, tokens or latency. That lets the agent be flexible without rewarding waste.\n\nExact trajectory matching is useful for a narrow protocol test, but it is often too brittle for a capability eval. I grade required invariants and outcomes, not my favourite implementation.",
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
