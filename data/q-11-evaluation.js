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
      "quick": [
        "Use two kinds of checks, before and after release.",
        "Before release, run fixed test questions on every change.",
        "The same questions every time make versions fair to compare.",
        "After release, watch thumbs down, rephrasing and asking for humans.",
        "Tests catch breakage, user signals prove real value."
      ],
      "simple": "Knowing that a GenAI feature is working needs two kinds of evidence: a fixed test before release, and real-user signals after it. Each one catches what the other misses, so you need both.\n\nBefore release, you run a golden set on every change. That is a fixed list of test questions with known good answers, usually around a hundred to start, and because every version sees the same questions, it is the only fair way to compare versions. After release, you watch what real users do, because a good test score doesn't prove anyone was helped. Do they give a thumbs down, rephrase the question or ask for a human? Underneath sits the business number, such as tickets resolved.\n\nFor example, a support assistant might pass every golden-set question and still see users rephrasing constantly. Teams that only test offline ship changes that help nobody, and teams that only watch online cannot tell which change caused what.",
      "points": [
        "Offline golden set - regression safety, version comparison, runs in CI.",
        "Online signals - thumbs, rephrase rate, citation clicks, escalation.",
        "Business metric - the one your manager is measured on.",
        "Offline catches breakage; online proves value. Neither replaces the other."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Offline evaluation before release compared with online signals after release, by when it runs, what it uses, what it catches and its blind spot.",
        "aspects": [
          "When",
          "Uses",
          "Catches",
          "Blind spot"
        ],
        "columns": [
          {
            "label": "Offline",
            "note": "chef tastes the dish",
            "accent": "accent",
            "cells": [
              "Every change, before release",
              "Frozen golden set",
              "Breakage, version comparison",
              "Whether anyone is helped"
            ]
          },
          {
            "label": "Online",
            "note": "diners clear the plate",
            "accent": "warn",
            "cells": [
              "After release, real users",
              "Thumbs, rephrases, escalations",
              "Real value, business number",
              "Which change caused what"
            ]
          }
        ],
        "caption": "**Offline catches breakage; online proves value.** Each covers the other's blind spot, so you need both."
      },
      "say": "I need two kinds of evidence, a fixed test before release and real-user signals after it, because each catches what the other misses. Before release, I run a golden set on every change. That's a fixed list of test questions with known good answers, usually around a hundred to start. Every version sees exactly the same questions, so it's the only fair way to compare two versions, and it tells me straight away if I broke something. After release, I watch what users actually do, because a good test score doesn't prove anyone was helped. Do they give a thumbs down, rephrase the same question, or give up and ask for a human? Under all of that sits the business number, like tickets resolved. Teams that only test offline ship changes that score well and help nobody. Teams that only watch online can't debug, because they can't tell which change caused what.",
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
      "quick": [
        "Start from real user questions, not imagined ones.",
        "Add every failure anyone has ever reported.",
        "Experts in the field write the correct answers.",
        "Include tricky, hostile and unanswerable questions on purpose.",
        "Freeze and version it, and hide a slice from tuning."
      ],
      "simple": "A golden set is a fixed list of test questions, each with its correct answer, that you run every time you change something. Everyone agrees you need one, but the value is in how it is built.\n\nThe questions should come from real production traffic, not ones the team imagined, plus every failure anyone has reported. The answers should come from a domain expert, not an engineer. For example, on an insurance claims assistant, a claims handler writes and checks them, which takes real calendar time. Cover common, edge, adversarial and unanswerable questions on purpose, with roughly 10 to 15 percent unanswerable, or you will never notice when the model stops refusing and starts inventing.\n\nThen freeze it and give it a version number, because comparing releases needs identical inputs. New cases go into a new version, and keep a small slice hidden that you never tune against.",
      "points": [
        "Source from production traffic, plus every reported failure.",
        "Labels come from domain experts, not engineers.",
        "Cover: common, edge, adversarial, unanswerable, multilingual.",
        "Freeze and version. Comparison needs identical inputs.",
        "Grow by adding versions, never by editing in place.",
        "Hold back a slice you never tune against."
      ],
      "say": "I start from real production questions, not the ones the team imagined, because users ask things nobody anticipated. Then I add every failure anyone has ever reported, since failures are the most valuable cases we have. The correct answers come from a domain expert, not an engineer. On a claims assistant, a claims handler writes and checks them, and that takes real calendar time, so I plan for it. I also cover common, edge, adversarial and unanswerable questions on purpose. Around ten to fifteen percent should be unanswerable, or we'd never notice the model stop refusing and start inventing. Then I freeze the set and give it a version number, because comparing two releases needs identical inputs. New cases go into a new version, and old ones are never edited in place. Finally, I hold back a small slice we never tune against, so we know we haven't simply memorised the test.",
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
      "quick": [
        "One model grades another model's answers.",
        "It scales far beyond what human reviewers can do.",
        "Judges favour long answers, their own style, and first place.",
        "Check it first against 100 to 200 human grades.",
        "Use pass or fail scales and ask for reasons first."
      ],
      "simple": "LLM-as-a-judge means using one model to grade another model's answers. You give the judge the question, the answer and a marking guide, and it returns a score for things like whether the answer is supported and relevant. It is popular because it scales, since a human can review a hundred answers a day and a judge a hundred thousand.\n\nBut judges have known biases. They prefer longer answers and their own style, they are swayed by which answer comes first, and on a 1-to-10 scale they stick to the middle.\n\nSo you check the judge before you trust it. Humans grade 100 to 200 examples, the judge grades the same ones, and you measure how often they agree. For example, if the judge keeps passing answers your experts marked as unsupported, you fix the rubric first. Pass/fail scales and asking for the reason before the score help too.",
      "points": [
        "Biases: length, self-preference, position, middle-clustering, run-to-run variance.",
        "Calibrate against 100–200 human labels and measure agreement.",
        "Binary or three-point scales. Wide one-to-ten scales are usually noisy.",
        "Rubric with concrete examples of each level.",
        "Reason first, score second - it improves consistency.",
        "Randomise order in pairwise comparisons.",
        "Use a different model family from the one being judged where you can."
      ],
      "diagram": {
        "alt": "Humans label a sample, the judge grades the same sample, and agreement is measured. If they agree the judge is used at scale; if not the rubric is fixed and the judge is tested again.",
        "rows": [
          [
            {
              "id": "h",
              "label": "Humans grade",
              "note": "100-200 examples"
            },
            {
              "id": "j",
              "label": "Judge grades",
              "note": "same examples"
            }
          ],
          [
            {
              "id": "a",
              "label": "Measure agreement",
              "note": "e.g. Cohen's kappa",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "u",
              "label": "Use at scale",
              "note": "re-check on model change",
              "accent": "accent"
            },
            {
              "id": "f",
              "label": "Fix the rubric",
              "note": "then re-test the judge",
              "accent": "bad"
            }
          ]
        ],
        "edges": [
          {
            "from": "h",
            "to": "a"
          },
          {
            "from": "j",
            "to": "a"
          },
          {
            "from": "a",
            "to": "u",
            "label": "agrees"
          },
          {
            "from": "a",
            "to": "f",
            "label": "disagrees"
          }
        ],
        "caption": "**Check the judge before you trust it.** Compare it with expert labels first, like checking a new teacher's marking against an experienced one."
      },
      "say": "One model grades another model's answers against a marking guide, and I trust it only after checking it against humans. It's popular because it scales. A person can review a hundred answers a day, and a judge can review a hundred thousand. The catch is known biases. Judges prefer longer answers and answers in their own style, they're swayed by which answer comes first in a comparison, and on a one-to-ten scale they cluster in the middle. So I calibrate first. Humans grade 100 to 200 examples, the judge grades the same ones, and I measure agreement, often with Cohen's kappa. If the judge keeps passing answers our experts marked unsupported, I fix the rubric before using it at scale. Design helps too. I use pass-fail or three-point scales, ask for the reason before the score, and shuffle the order in comparisons. And I re-check agreement whenever the judge model changes.",
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
      "quick": [
        "Sort metrics by what they test and who scores them.",
        "Search checks scored by plain code are cheap enough for every change.",
        "Some search checks and all answer checks need an LLM judge.",
        "Lead with whether answers are backed by the found text.",
        "Show task success next to cost and speed."
      ],
      "simple": "RAG metrics are easiest to understand if you sort them by two questions: which half of the pipeline the metric tests, and who does the scoring, plain code or an LLM judge.\n\nOn the retrieval side, recall@k, MRR and hit rate are scored by code against a labelled set of questions and the chunks that answer them. They need no model calls, so they are cheap and fast enough to run on every commit. On the generation side, a judge scores faithfulness, meaning whether every claim is backed by the retrieved text, and answer relevance, meaning whether it answers what was asked.\n\nLead with faithfulness, because it is the closest thing to a hallucination score. For example, faithfulness drops when an answer quotes a refund limit that the retrieved context never mentions. Like any judged metric, calibrate it against human labels, and report end-to-end success next to cost and latency.",
      "points": [
        "Retrieval, code-scored: recall@k, MRR, hit rate - objective, cheap, run in CI.",
        "Retrieval, judge-scored: Ragas context precision and context recall.",
        "Generation, judge-scored: faithfulness and answer relevance.",
        "Faithfulness is the hallucination proxy. Lead with it.",
        "Calibrate every judged metric against human labels before trusting it.",
        "End-to-end task success is the number a stakeholder understands.",
        "Track cost and p95 latency alongside - a quality win that doubles cost is not a win."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A grid of RAG metrics sorted by pipeline half, retrieval or generation, and by scorer, plain code or an LLM judge.",
        "xLabel": "Who scores it",
        "yLabel": "Which half",
        "cols": [
          "Plain code",
          "LLM judge"
        ],
        "rows": [
          "Retrieval",
          "Generation"
        ],
        "cells": [
          [
            {
              "label": "Recall@k, MRR, hit rate",
              "note": "cheap, run every commit",
              "accent": "accent"
            },
            {
              "label": "Context precision, recall",
              "note": "Ragas, costs money",
              "accent": "warn"
            }
          ],
          [
            {
              "label": "Rarely possible",
              "note": "no single right text",
              "accent": "muted"
            },
            {
              "label": "Faithfulness first",
              "note": "the hallucination proxy",
              "accent": "accent"
            }
          ]
        ],
        "caption": "Sort each metric by **which half it tests and who scores it**. Code-scored retrieval runs in CI; lead the report with **faithfulness**."
      },
      "say": "I sort them by which half of the pipeline they test and who scores them, and I lead with faithfulness. Retrieval metrics like recall at k, MRR and hit rate come from a labelled set with no model calls. That makes them cheap and exact enough to run on every commit. Ragas context precision and context recall also measure retrieval, but they use a judge, so they cost money and need checking. On the generation side, a judge scores faithfulness and answer relevance. Faithfulness goes first because it's the closest thing we have to a hallucination score. It drops when an answer quotes a refund limit the retrieved context never mentions. Like any judged metric, I calibrate it against human labels before trusting the number. Above all of that sits end-to-end task success on the golden set, reported next to cost and p95 latency. A quality win that doubles the cost isn't a win.",
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
      "quick": [
        "First say which kind of hallucination you mean.",
        "One kind is unsupported by the source, the other just false.",
        "Split answers into small claims and label each one.",
        "Report unsupported claims and answers with at least one.",
        "Add unanswerable questions and check the checker against humans."
      ],
      "simple": "The first step in measuring hallucination is to say which kind you mean. A faithfulness hallucination is when the answer says something the provided source does not support, which is the RAG case, so you check against the source. A factual hallucination is when the answer is false about the world and no source was given, so you need a reference answer or a trusted source.\n\nEither way, you measure claim by claim. Split the answer into small factual claims and label each one as supported, contradicted or not found, using an LLM judge or an entailment model. For example, a refund answer can be right overall and still contain one unsupported date, so you report the share of unsupported claims and the share of answers with at least one.\n\nAlso keep unanswerable questions in the test set to see how often the model invents. And since the checker is a model too, calibrate it against humans.",
      "points": [
        "**Faithfulness** - not supported by the given source (RAG). **Factuality** - false about the world (closed-book).",
        "Split answers into claims; label each supported, contradicted or not found.",
        "Checkers: an LLM judge or NLI model against the context; reference answers or trusted sources for facts.",
        "Report the claim-level rate and the answer-level rate (answers with at least one unsupported claim).",
        "Unanswerable questions measure invention versus an honest \"I don't know\".",
        "Sampling consistency (the SelfCheckGPT idea): disagreement across samples signals guessing.",
        "Calibrate the checker against human labels. Production detection: rag-15."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Measuring hallucination claim by claim: split the answer into claims, check each against a source, label it, and report two rates.",
        "lanes": [
          {
            "label": "Answer",
            "note": "from the system"
          },
          {
            "label": "Split into claims",
            "note": "small factual statements"
          },
          {
            "label": "Check each",
            "note": "judge or NLI model",
            "accent": "warn"
          },
          {
            "label": "Label",
            "note": "supported, contradicted, not found"
          },
          {
            "label": "Report two rates",
            "note": "claims and answers",
            "accent": "accent"
          }
        ],
        "caption": "Measure **claim by claim**: one unsupported date can hide in a mostly right answer. Report the claim rate and the answer rate."
      },
      "say": "First I say which kind I mean, because the two are measured differently. A faithfulness hallucination is a claim the provided source doesn't support. That's the RAG case, so I check against the retrieved context. A factual hallucination is something false about the world when no source was given, so I need a reference answer or a trusted source. Either way, I measure claim by claim. I split the answer into small claims and label each one supported, contradicted or not found, using an LLM judge or an entailment model. A refund answer can be right overall and still contain one unsupported date. So I report two numbers, the share of unsupported claims and the share of answers with at least one. I also keep unanswerable questions in the set to see how often the model invents instead of saying it doesn't know. And the checker is a model too, so I calibrate it against human labels first.",
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
      "quick": [
        "They compare output words against one correct reference answer.",
        "BLEU was built for translation, ROUGE for summaries.",
        "BERTScore compares meaning, so rewording still scores well.",
        "Most tasks lack one answer, and made-up numbers slip through.",
        "Use them only as a cheap alarm for sudden drops."
      ],
      "simple": "BLEU, ROUGE and BERTScore are classic metrics that compare a model's output with a reference answer. BLEU counts word sequences the output shares with the reference and was built for translation. ROUGE checks how much of the reference shows up in the output and was built for summarisation. BERTScore compares meaning using embeddings, so a paraphrase still scores well.\n\nThey rarely fit GenAI work because all three need one correct reference, and most GenAI answers can be right in many wordings. On RAG they can actively mislead. For example, an answer can share most of its words with the reference and still contain a made-up refund figure, while a correct answer in different words scores badly.\n\nThey do fit translation, and summarisation with real reference summaries, and they make a cheap tripwire in CI. For RAG, use faithfulness and context metrics instead.",
      "points": [
        "BLEU: n-gram precision, built for translation. ROUGE: recall, built for summarisation. BERTScore: embedding similarity, so paraphrase survives.",
        "All three need a reference answer. Most GenAI tasks have no single correct output.",
        "On RAG they mislead: high overlap with a hallucinated number is possible.",
        "Legitimate use: translation, and summarisation with real references as a cheap CI regression signal.",
        "For RAG use faithfulness, context precision and context recall instead.",
        "For extraction, exact field accuracy is the honest hard metric.",
        "Name the metric, then say what the task actually requires."
      ],
      "say": "They're classic overlap metrics, and I rarely use them for GenAI work because most tasks don't have one correct reference. BLEU counts word sequences the output shares with a reference answer, and it was built for translation. ROUGE goes the other way, checking how much of the reference shows up in the output, and it was built for summarisation. BERTScore compares meaning with embeddings, so a paraphrase still scores well. All three need a reference, and a support reply can be right in many wordings. On RAG they can actively mislead. An answer can overlap the reference heavily and still contain a made-up number, while a correct answer in different words scores badly. They do fit translation, and summarisation with real reference summaries. Because they're fast and free, I'll use them as a cheap tripwire in CI, watching for sudden drops. For RAG I rely on faithfulness and context metrics instead.",
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
      "quick": [
        "They all run a test set, score answers, compare runs.",
        "Ragas gives ready-made RAG scores, DeepEval works like unit tests.",
        "TruLens checks three RAG basics, promptfoo compares prompts side by side.",
        "The hard part is the test set and a trusted grader.",
        "Check scores against humans and pin model and library versions."
      ],
      "simple": "Ragas, DeepEval, TruLens, promptfoo and LangSmith all do roughly the same job. They run a test set, score the answers and compare runs. The tool is not the hard part; the test set and a judge you trust are.\n\nEach is known for something slightly different. Ragas gives ready-made RAG metrics such as faithfulness and context recall, DeepEval lets you write evals like pytest tests so it fits CI, TruLens is known for the RAG triad, promptfoo is good for prompt comparisons and red-team tests, and LangSmith keeps datasets and experiments beside the traces.\n\nFor example, a Ragas faithfulness score is really an LLM judge behind a fixed prompt, so have humans label 50 to 100 of the same answers and confirm the tool agrees before believing it. Pin the judge model and library version, and never compare scores across tools.",
      "points": [
        "**Ragas** - RAG metrics (faithfulness, response relevancy, context precision and recall), mostly LLM-judged.",
        "**DeepEval** - pytest-style LLM tests with built-in and custom (G-Eval) metrics; fits CI.",
        "**TruLens** - the RAG triad (context relevance, groundedness, answer relevance) plus tracing.",
        "**promptfoo** - config-driven prompt and model comparisons, and red-team tests in CI.",
        "**LangSmith / Langfuse / Phoenix** - datasets, evaluators and experiments beside the traces.",
        "Judged metrics need calibration against humans; pin the judge model and library version.",
        "Scores are not comparable across tools."
      ],
      "say": "I've worked with several, and they all do roughly the same job, running a test set, scoring the answers and comparing runs. Ragas gives ready-made RAG metrics like faithfulness and context recall. DeepEval lets me write evals like pytest unit tests, so it drops straight into CI. TruLens is known for the RAG triad of context relevance, groundedness and answer relevance. promptfoo is good for side-by-side prompt comparisons and red-team tests. LangSmith and Langfuse keep datasets and experiments right beside the traces. The tool isn't the hard part, though. The test set and a judge we trust are. A Ragas faithfulness score is really an LLM judge behind a fixed prompt, so I calibrate it against human labels before I believe it. I pin the judge model and the library version, because if either changes, scores move even when the app didn't. And I never compare scores across tools, since each defines its metrics a little differently.",
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
      "quick": [
        "Model tests are slow and costly, so split them into tiers.",
        "Every change runs free, fast checks with the model faked.",
        "Prompt changes run about 50 real cases against main.",
        "Before release, the full test set can block the deploy.",
        "Nightly runs catch quiet model updates from the provider."
      ],
      "simple": "Evaluation fits into CI/CD as tiers, with cheap and frequent checks at the bottom and expensive, rare ones at the top. That matters because LLM evals are slow and cost money, and if the whole suite runs on every commit, people start skipping it.\n\nEvery commit runs the free layer: unit tests with the model faked out, output format checks and retrieval metrics, which take seconds. Every pull request that changes a prompt runs about fifty real test cases, which costs a few minutes and a few dollars. For example, the result is posted on the pull request as 'this branch versus main', so the reviewer sees the effect instead of guessing. Before release, the full golden set runs and a quality drop blocks the deploy, and a nightly run catches drift such as a quiet provider update.\n\nThe rule tying it together is that a prompt change is a deploy.",
      "points": [
        "Every commit - mocked unit tests, schema checks, retrieval metrics. Free and fast.",
        "Every PR touching prompts - 50-case subset, results posted as a diff on the PR.",
        "Pre-release - full golden set with a blocking threshold.",
        "Nightly - full set plus production samples, to catch drift with no code change.",
        "Version prompts like code. A prompt change is a deploy."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Evaluation tiers in CI, from nightly runs at the top down to checks on every commit at the bottom.",
        "top": "expensive and rare",
        "bottom": "cheap and frequent",
        "layers": [
          {
            "label": "Nightly",
            "note": "full set + production samples",
            "accent": "warn"
          },
          {
            "label": "Before release",
            "note": "full golden set, blocks deploy",
            "accent": "accent"
          },
          {
            "label": "Every prompt PR",
            "note": "~50 real cases, diff vs main"
          },
          {
            "label": "Every commit",
            "note": "mocked tests, schema, retrieval"
          }
        ],
        "caption": "**Tier it: cheap and frequent at the bottom, expensive and rare at the top.** And remember: a prompt change is a deploy."
      },
      "say": "As tiers, cheap and frequent at the bottom, expensive and rare at the top. LLM evals are slow and cost money, and if everything runs on every commit, people start skipping it. So every commit runs the free layer. That's unit tests with the model mocked, output format checks, and retrieval metrics on the labelled set. It takes seconds, so nobody has an excuse. Every pull request that touches a prompt or chain runs about fifty real cases, which is a few minutes and a few dollars. The result goes on the pull request as this branch versus main, so the reviewer sees the effect instead of guessing. Before release, the full golden set runs with a blocking threshold, and a drop below production quality stops the deploy. Nightly runs cover the full set plus production samples, which catches drift no code change caused, like a quiet provider update. The rule tying it together is simple. A prompt change is a deploy.",
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
      "quick": [
        "Your test measures something users do not care about.",
        "Most often, test questions do not look like real ones.",
        "The test may reward repeating text, or be memorised by tuning.",
        "Complaints may be about speed, tone, or one hidden failing group.",
        "Run 50 real complaints and find where scores disagree."
      ],
      "simple": "When offline scores are great but users are unhappy, your test is measuring something different from what users care about. There are usually five suspects.\n\nThe most common by far is a test set that doesn't look like real traffic, because engineers wrote it while real users ask shorter, vaguer questions. The second is measuring the wrong thing. For example, faithfulness stays high when an answer just repeats the retrieved text but never answers the question. The third is overfitting, where a hundred prompt tweaks against the same set have memorised it. The fourth is that the complaint is speed or tone, not correctness. The fifth is an average hiding a failing group, such as one language at 0.6 inside a 0.9 overall.\n\nSo take fifty real complaints, run them through the pipeline, and look for cases where your score says good but the user said bad. Those cases then join the golden set.",
      "points": [
        "Eval set does not match real traffic - the most common cause by far.",
        "Measuring a property that is not usefulness.",
        "Overfitted to the set through repeated tuning.",
        "The complaint is latency or tone, not correctness.",
        "Averages hide a failing segment. Slice by language, document type, user group.",
        "Fix: run 50 real complaints through the pipeline and find where score and reality disagree."
      ],
      "say": "It means our test is measuring something different from what users care about, and there are usually five suspects. The most common by far is an eval set that doesn't look like real traffic. Engineers wrote it, while real users ask shorter, vaguer questions about things nobody anticipated. The second is measuring the wrong property. Faithfulness stays high when an answer just repeats the retrieved text and never answers the question. The third is overfitting. If the same set guided a hundred prompt tweaks, the prompt has effectively memorised it. The fourth is that the complaint isn't about correctness at all. The answer is right but slow, or the tone is off. The fifth is an average hiding a segment, where 0.9 overall hides one language at 0.6. So I take fifty real complaints, run them through the pipeline, and look for cases where our score says good but the user said bad. Those cases then join the golden set.",
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
      "quick": [
        "Check the qualities a good answer needs, not exact wording.",
        "Check for made-up claims, missed key points, length and tone.",
        "Code checks length and format, a judge checks the rest.",
        "Compare two versions head to head and report win rate.",
        "A small human review covers the borderline cases."
      ],
      "simple": "When a task has no single correct answer, such as summarisation or drafting, you stop asking 'is it correct?' and start asking 'does it have the properties a good answer needs?'\n\nSo break the task into checkable properties. Does the summary add a claim that is not in the source? Does it cover the key points, stay within the length limit and get the tone right? Plain code checks the mechanical parts, such as length and required sections, and a judge with a clear rubric checks the rest.\n\nTo compare versions, use A-versus-B comparison, because people and judges are much better at picking the better of two than at scoring out of ten. It is like an eye test, where the optician only asks which lens is clearer. For example, you run the new and current summarisation prompts on the same inputs, shuffle the order, and report a win rate against production.",
      "points": [
        "Decompose into checkable properties instead of scoring correctness.",
        "Code-check what code can check: length, format, required sections, banned terms.",
        "Judge the rest with a rubric that has concrete examples per level.",
        "Pairwise comparison with randomised order beats absolute scoring.",
        "Report win rate against the current production version."
      ],
      "diagram": {
        "alt": "An open-ended answer is split into checkable properties, code checks the mechanical ones and a judge checks the rest, then a pairwise comparison against production gives a win rate.",
        "rows": [
          [
            {
              "id": "o",
              "label": "Open-ended output",
              "note": "e.g. a summary"
            }
          ],
          [
            {
              "id": "c",
              "label": "Code checks",
              "note": "length, sections, banned terms"
            },
            {
              "id": "j",
              "label": "Rubric judge",
              "note": "coverage, no new claims, tone",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "p",
              "label": "Pairwise vs production",
              "note": "same inputs, shuffled order"
            }
          ],
          [
            {
              "id": "w",
              "label": "Win rate",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "o",
            "to": "c"
          },
          {
            "from": "o",
            "to": "j"
          },
          {
            "from": "c",
            "to": "p"
          },
          {
            "from": "j",
            "to": "p"
          },
          {
            "from": "p",
            "to": "w"
          }
        ],
        "caption": "Ask **\"does it have the properties?\"** not \"is it correct?\". Then compare versions like an eye test: **which is better**, not a score out of ten."
      },
      "say": "I stop asking whether it's correct and start asking whether it has the properties a good answer needs. A summary has no single right wording, but I can still check whether it adds a claim that isn't in the source, covers the key points, stays within the length limit and gets the tone right. Plain code handles the mechanical parts, like length, banned phrases and required sections. A judge with a clear rubric handles the rest. To compare two versions I use pairwise comparison, because people and judges are much better at picking the better of two answers than at scoring one out of ten. It's like an eye test. The optician asks which lens is clearer, never for a score. So I run both versions on the same inputs, shuffle the order, and report a win rate against production. A small human review then covers the borderline cases no rubric captures.",
      "numbers": "Pairwise win rate against the current production version is the cleanest release signal. Decide the bar before the test and check the win rate is distinguishable from 50% at your sample size - a tie can still be worth shipping if the new version is cheaper or faster.",
      "wrong": "\"Subjective tasks cannot really be evaluated.\" The follow-up is how you would compare two summary prompts, and decomposing into checkable properties plus pairwise comparison is the answer it is looking for.",
      "follow": "How do you stop the judge just preferring the longer summary?",
      "followAnswer": "I control for length in the design and then check the judge for it. A hard length limit is checked in code first, and the rubric says plainly that length isn't a merit, that padding counts against an answer and that coverage of key points is what matters. I shuffle the order in every pair. Then I measure the bias directly, comparing the judge's picks with human picks on pairs of different lengths, and if it still favours longer ones, I compare length-matched pairs."
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
      "quick": [
        "One run is one sample, not the truth.",
        "Run the same version 3 to 5 times to see the noise.",
        "Use enough test cases, since small sets jump around.",
        "Compare versions on the same questions, count fixed and broken.",
        "Keep settings fixed, and check critical cases pass every time."
      ],
      "simple": "When the same input gives a different output on every run, one run is just one sample, not the truth. Even at temperature 0 on a hosted model, outputs can differ. So if version A scores 82 percent and B scores 84 percent on one run each, you may have learned nothing.\n\nFirst, measure the noise by running the same version on the same test set three to five times and seeing how far the score moves. Any 'improvement' smaller than that isn't real. Then use enough cases. For example, with 50 cases each case is worth 2 percentage points, so a 2-point win can be one lucky answer. Compare A and B on identical inputs and count what each fixed and broke, with the temperature, model and judge kept fixed.\n\nFor important cases, measure consistency too, because passing once in five tries is very different from passing all five.",
      "points": [
        "One run is a sample. Measure the noise floor by repeating the same version 3–5 times.",
        "Bigger test sets shrink noise: one flip is ~3% of 30 cases but ~0.3% of 300.",
        "Compare A and B on identical inputs; count cases fixed versus broken.",
        "pass@k (succeeds at least once) versus pass^k (succeeds every time) - pick the one your product needs.",
        "Pin temperature, model version and judge while comparing."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Evaluating a non-repeatable system: repeat the same version to find the noise floor, run both versions on identical inputs, count cases fixed and broken, and only believe a change bigger than the noise.",
        "lanes": [
          {
            "label": "Repeat same version",
            "note": "3-5 runs"
          },
          {
            "label": "Find noise floor",
            "note": "how far scores move",
            "accent": "warn"
          },
          {
            "label": "A and B, same inputs",
            "note": "settings pinned"
          },
          {
            "label": "Count fixed vs broken",
            "note": "e.g. fixed 12, broke 4"
          },
          {
            "label": "Beats the noise?",
            "note": "only then believe it",
            "accent": "accent"
          }
        ],
        "caption": "**One run is one sample, not the truth.** An 84 versus 82 means nothing until it is bigger than the noise floor."
      },
      "say": "One run is one sample, not the truth, so I only believe a change that's bigger than the noise. Even at temperature zero, hosted models don't repeat exactly. So first I measure the noise floor by running the same version on the same test set three to five times and seeing how far the score moves. Then I make sure the set is big enough. With 30 cases, one flipped answer moves the score by about three points. With 300 cases, it's about a third of a point. Next I compare versions on identical inputs and count what each one fixed and broke. B fixed twelve and broke four tells me far more than 84 versus 82. I keep temperature, model version and judge fixed throughout. And for important cases I measure consistency, not just success. Passing once in five tries is very different from passing all five, and a customer-facing agent needs the second.",
      "numbers": "With 50 cases, each case is worth 2 percentage points - so a 2-point 'win' can be one lucky answer. Repeat runs 3–5 times and report the average and the range.",
      "wrong": "\"The new prompt scored 84 against 82, so it is better.\" On one run each, a gap that small is often within normal run-to-run noise.",
      "follow": "Your agent passes a task 4 times out of 5. Is it ready to ship?",
      "followAnswer": "Not on that number alone. Four out of five might be fine for a draft a human reviews and unacceptable for an agent that moves money or talks to customers unsupervised. So I look at what happens on the failing run. Does it fail safely, by asking or escalating, or does it do something wrong? Five trials is also a tiny sample, so I run more and check how often it succeeds every time on the important cases. Harmless, caught failures can ship behind a guard."
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
      "quick": [
        "Test whole conversations, since failures show up turns later.",
        "Replay real chats with personal data removed, grade the last reply.",
        "Write scripts testing memory, corrections and topic switches.",
        "Let a second model play the user, and repeat runs.",
        "Grade each reply, the whole chat, and goal reached."
      ],
      "simple": "Evaluating a multi-turn chatbot means testing whole conversations, not single questions, because most chatbot failures only show up a few turns in. Real users say things like 'what about the second one?' or 'no, I meant last year', so the bot has to remember and resolve what they mean.\n\nThere are three ways to build these tests. The cheapest is replaying real chat logs with personal data removed, keeping earlier turns fixed and grading only the last reply. The second is scripted scenarios that each test one skill, such as a correction or a topic switch. The third is a simulated user, where a second LLM plays a persona. For example, it might play an impatient customer who wants a refund, and you grade the whole transcript, running it several times because it is noisy.\n\nYou grade each turn, the whole conversation for memory and consistency, and whether the user reached their goal.",
      "points": [
        "Most chat failures appear only after a few turns.",
        "Replay real anonymised logs, keep earlier turns fixed, grade the last reply.",
        "Scripted scenarios for memory, corrections and topic switches.",
        "Simulated users (an LLM playing a persona) for wider coverage - run each several times.",
        "Grade each turn, the whole conversation, and final goal completion.",
        "Online: repeated questions, unresolved endings, escalations."
      ],
      "say": "I test whole conversations, not single answers, because most chatbot failures only show up a few turns in. Users say things like what about the second one, or no, I meant last year, and the bot has to remember and resolve that correctly. I build those tests three ways. The cheapest is replaying real chat logs with personal data removed. The earlier turns stay fixed, and I grade only the bot's reply to the last one. Then I write scripted scenarios that each test one skill, like a follow-up that depends on memory, a topic switch or a correction. For wider coverage, a second LLM plays a simulated user with a goal and a persona, say an impatient customer chasing a refund. That's noisy, so I run each scenario several times. I grade each turn, the whole conversation for memory and consistency, and whether the user reached their goal. In production, I watch repeated questions, unresolved endings and escalations.",
      "numbers": "Start with 30–50 multi-turn scenarios of 3–6 turns each. Run simulated-user scenarios at least three times each - one run of a conversation between two models tells you little.",
      "wrong": "\"We evaluate each question independently.\" That misses the failures users actually hit: forgetting context, resolving \"it\" to the wrong thing, and contradicting an earlier answer.",
      "follow": "Your simulated user is too polite and never tests edge cases. How do you fix that?",
      "followAnswer": "I give the simulator a harder brief and check that it follows it. Each scenario gets a persona and a goal plus behaviours to show, like changing its mind, giving partial information, correcting the bot or getting impatient, and a rule not to accept vague answers. I seed those edge cases from real chat logs where users struggled. Then I review a sample of simulated conversations and track coverage of each behaviour, so an overly polite simulator shows up as a gap rather than a pass."
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
      "quick": [
        "Watch four groups, not just errors and speed.",
        "Track cost per request and per finished task.",
        "Watch quality clues like \"I don't know\" rate and citations.",
        "Watch users rephrasing, giving up or asking for a human.",
        "Alert on sudden changes, not fixed numbers."
      ],
      "simple": "Monitoring a GenAI system in production needs four groups of signals, because a system can be fast and error-free and still be confidently wrong. Nobody hands you the correct answer in production, so you watch for clues.\n\nThe first group is system health, such as error rate, latency and timeouts. The second is cost per request and per completed task, which finance asks about first. The third is quality signals, such as sampled groundedness checks, citation validity, refusal rate and parse failures, since these move before users complain. For example, a sudden drop in 'I don't know' answers can mean the model started inventing instead of declining. The fourth is user behaviour, such as thumbs, rephrasing, escalation and the business metric.\n\nThe key choice is to alert on changes, not fixed numbers. You won't know the right refusal rate in advance, but you will notice when it moves 20 percent overnight.",
      "points": [
        "Health: errors, p50 and p95, timeouts, rate limits, retries.",
        "Cost: tokens and cost per request and per resolved task, split by feature.",
        "Quality proxies: groundedness sample, citation validity, refusal rate, retrieval scores, parse failures.",
        "Behaviour: thumbs, rephrase rate, abandonment, escalation, business metric.",
        "Alert on change, not on absolute thresholds you had to guess."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Four groups of production signals for a GenAI system: system health, cost, quality clues and user behaviour.",
        "layers": [
          {
            "label": "System health",
            "note": "errors, p95, timeouts, rate limits"
          },
          {
            "label": "Cost",
            "note": "per request and per resolved task"
          },
          {
            "label": "Quality clues",
            "note": "groundedness sample, refusal rate",
            "accent": "accent"
          },
          {
            "label": "User behaviour",
            "note": "thumbs, rephrases, escalations",
            "accent": "accent"
          }
        ],
        "caption": "Most people stop at health. A system can be **fast, error-free and confidently wrong**, so watch quality and behaviour too, and **alert on change**."
      },
      "say": "Four groups of signals, because a system can be fast and error-free and still confidently wrong. The first is system health, meaning error rate, p50 and p95 latency, timeouts and provider rate limits. Necessary, but not enough on its own. The second is cost per request and per resolved task, split by feature, and that's the dashboard finance asks about first. The third is quality clues, because production never hands me the correct answer. I track sampled groundedness, citation validity, refusal rate and parse failures, since these move before users complain. A sudden drop in I don't know answers can mean the model started inventing instead of declining. The fourth is user behaviour, like thumbs, rephrasing, giving up and escalation to a human, plus the business metric. I can't know the right refusal rate in advance, so I alert on changes, not fixed numbers. A refusal rate that moves twenty percent overnight gets looked at.",
      "numbers": "Sample 1–5% of traffic for automated quality checks. As a starting point, alert on a 10–20% day-over-day shift in any quality proxy, then tune to your traffic's normal variance.",
      "wrong": "\"Latency, errors and uptime.\" That monitors the service, not the model. A GenAI system can be perfectly healthy and completely wrong.",
      "follow": "Refusal rate dropped 30% overnight. Walk me through your investigation.",
      "followAnswer": "I treat it as a possible regression before a win. First, what changed overnight: a deploy, a prompt edit, a provider model update, an ingestion run or a shift in traffic. Then I slice the drop by feature, language and question type to find where it sits. Next I read a sample of questions that used to be refused and see what they get now. If they're grounded answers, fine. If the model is inventing, I roll back and add those cases to the golden set."
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
      "quick": [
        "Split by user, so each person gets the same version.",
        "Pick a business number to judge by before starting.",
        "Make sure cost and speed do not get worse.",
        "Noisy answers need more traffic, and pricier models need spend caps.",
        "First send copies of real traffic to B, shown to nobody."
      ],
      "simple": "A/B testing a GenAI feature works like any A/B test, plus two extra problems: noisy outputs and cost.\n\nThe basics still apply. You split by user, not by request, so each person gets a consistent experience. You choose a business metric before you start, such as resolution rate, not a model score, and set guardrails like cost per request and latency that must not get worse. Because the same model gives different answers on different runs, results bounce around more, so you need more traffic or time. And if version B uses a pricier model, you cap how many users see it and set a daily spend limit.\n\nBefore any of that, do a shadow run, sending a copy of 5 to 10 percent of real traffic to B and showing its answers to nobody. For example, if B starts quoting the wrong refund policy, you catch it in the logs before any customer sees it.",
      "points": [
        "Split by user, not request. Consistency matters more than balance.",
        "Primary metric is a business metric, chosen before launch.",
        "Guardrails: cost per request, p95 latency, escalation rate.",
        "Higher output variance means a higher noise floor - plan for more traffic.",
        "Shadow run first: real traffic to B, compared offline, shown to no one."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A/B testing a GenAI feature: shadow run first, then split by user, judge on a business metric chosen in advance, and watch guardrail metrics and spend.",
        "lanes": [
          {
            "label": "Shadow run",
            "note": "real traffic, shown to nobody",
            "accent": "accent"
          },
          {
            "label": "Split by user",
            "note": "not by request"
          },
          {
            "label": "Business metric",
            "note": "chosen before launch"
          },
          {
            "label": "Guardrails",
            "note": "cost, p95, escalations",
            "accent": "warn"
          },
          {
            "label": "Enough traffic",
            "note": "noisy outputs need more"
          }
        ],
        "caption": "Like any A/B test, plus **noise and cost**. The step most teams skip is the **shadow run**: it catches disasters with zero user risk."
      },
      "say": "Like any A/B test, plus two extra problems, noisy outputs and cost. The basics still apply. I split by user rather than by request, so each person gets a consistent experience. I pick a business metric before launch, like resolution rate or handling time, not a model score. Guardrail metrics such as cost per request, p95 latency and escalation rate must not get worse. Noise is the first extra problem. The same model gives different answers on different runs, so results bounce around more, and I plan for more traffic or more time. Cost is the second. If version B uses a pricier model, the experiment itself costs money, so I cap how many users see it and set a daily spend limit. Before any user sees B, though, I run it in shadow mode on a copy of real traffic, compare answers offline and show them to nobody. That catches disasters with zero user risk, and it's the step most teams skip.",
      "numbers": "Shadow-run on 5–10% of traffic before any user-visible split. Set a daily spend cap on the experiment arm before it starts.",
      "wrong": "\"We show both answers and let users pick.\" That is a preference test, not an A/B test, and it changes the product while measuring it.",
      "follow": "B wins on quality and costs three times more. What do you recommend?",
      "followAnswer": "It depends on whether the quality gain is worth three times the cost in business terms. I set the value of the improvement, say extra tickets resolved times what each one saves, against the added cost per request at our real volume. If it pays, we ship B. Often the better answer is routing, sending only the hard queries to B and keeping A for the rest, or testing a cheaper model with B's prompt. I present the trade with numbers and let the business decide."
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
      "quick": [
        "Tie it to a number the business already tracked.",
        "Measure that number before you ship.",
        "Compare against a group without the feature, at the same time.",
        "Be honest about credit and include running cost.",
        "Count adoption, since unused features deliver nothing."
      ],
      "simple": "Proving business value means tying your GenAI project to a number the business already tracked before the project existed. A faithfulness score of 0.94 means nothing to the person approving next year's budget, but average handling time or first-contact resolution does.\n\nFirst, measure the baseline before you ship. Then compare fairly, ideally one group with the feature and one without, at the same time, because a plain before-and-after is weaker when something else changes that month. Be honest about credit. For example, if handling time fell 12 percent and a process change landed the same month, say so, because overclaiming is where this answer usually fails. Include the running cost too, since value minus cost is what gets phase two approved.\n\nAdoption counts as well, because a feature nobody uses delivered nothing. A specific, modest number you can defend beats a big round one.",
      "points": [
        "Use a metric that existed before the project. Do not invent one.",
        "Baseline before, comparison after, ideally on a controlled split.",
        "State attribution honestly - name what else changed.",
        "Include running cost. Net value is what gets funded.",
        "Adoption is a real metric. A feature nobody uses delivered nothing."
      ],
      "say": "I tie it to a number the business already tracked before the project existed, because a faithfulness score means nothing to whoever approves the budget. Average handling time or first-contact resolution works well. I measure a baseline before shipping. Afterwards I compare fairly, ideally one group with the feature and one without, at the same time. A plain before and after is weaker, because something else always changes in the same month. I'm honest about credit. If a process change landed that month, I say so, since overclaiming is where this answer usually falls apart and experienced managers spot it. I include running cost, because value minus cost is the number that gets phase two approved. And I count adoption. A feature nobody uses delivered nothing, however good its scores look. A specific, modest number I can defend beats a big round one every time.",
      "numbers": "Use your real figures - baseline, after, sample size, run cost per month. A specific modest number is far more credible than a round large one.",
      "wrong": "\"It saved a lot of manual effort.\" No baseline, no number, no attribution. It reads as a project you did not measure.",
      "follow": "What did not work, and what did that cost you?",
      "followAnswer": "I'd give a real one, with what it cost and what we changed. A typical example is measuring success with a judge score first. It looked good while handling time barely moved, because agents didn't trust the answers and rechecked everything. That cost us a few weeks and some credibility with the sponsor. We switched to a metric the business already tracked and added citations so agents could verify quickly. The lesson I took was to agree the business metric before building."
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
      "quick": [
        "Check what actually changed, not what the agent claims.",
        "Define success clearly and run in a safe test setup.",
        "Record every step, tool use and result.",
        "Look in the real system, like the booking records.",
        "Mix code checks, a model grader and humans, and repeat runs."
      ],
      "simple": "Grading an agent means checking what actually changed in the world, not what the agent says it did. Its final message is just text, so it can say 'your flight is booked' when nothing was booked.\n\nSo each test task starts with a clear success condition. For example, 'a booking exists for this passenger on this date'. The agent runs in a sandbox with fake systems, not production, and you record the full trace of tool calls and results. Then you look in the booking system to see whether the reservation is really there, which is usually the most important check. It is like checking a plumber's work by turning on the tap, not trusting the invoice.\n\nAfter that, check the path where it matters, such as the right tools in the required order, and the cost. Since agents vary between runs, repeat important cases, and move solved hard cases into the regression suite.",
      "points": [
        "Grade the environment outcome, not only what the agent claims in its final message.",
        "Keep the full trace or trajectory: model turns, tool calls, arguments, intermediate results and state changes.",
        "Use deterministic graders where possible, model graders for nuance, and humans for calibration and high-value review.",
        "Track efficiency too: turns, tool calls, tokens, latency and cost.",
        "Run multiple trials for important non-deterministic tasks.",
        "Turn solved capability cases and production failures into regression tests."
      ],
      "diagram": {
        "alt": "An agent runs a task in a sandbox and its final message claims success. The claim is ignored; the grader checks the real end state in the system, then the path and cost.",
        "rows": [
          [
            {
              "id": "t",
              "label": "Task in sandbox",
              "note": "clear success condition"
            }
          ],
          [
            {
              "id": "a",
              "label": "Agent runs",
              "note": "full trace recorded"
            }
          ],
          [
            {
              "id": "m",
              "label": "Final message",
              "note": "\"flight booked!\"",
              "accent": "muted"
            },
            {
              "id": "s",
              "label": "Check end state",
              "note": "is the booking there?",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "p",
              "label": "Then the path",
              "note": "tools, order, turns, cost"
            }
          ]
        ],
        "edges": [
          {
            "from": "t",
            "to": "a"
          },
          {
            "from": "a",
            "to": "m",
            "label": "claims"
          },
          {
            "from": "a",
            "to": "s",
            "label": "changed"
          },
          {
            "from": "s",
            "to": "p"
          }
        ],
        "caption": "**Turn on the tap, don't trust the invoice.** Grade what actually changed in the world, not what the agent says it did."
      },
      "say": "I check what actually changed in the world, because an agent's final message is just text. It can say your flight is booked when nothing was booked. So each test task starts with a clear success condition, like a booking exists for this passenger on this date. The agent runs in a sandbox with fake systems, not production, and I record the full trace of model turns, tool calls, arguments and results. Then I look in the booking system and check the reservation is really there. That end state is usually the most important check. After that I look at the path where it matters, meaning the right tools, valid arguments, the required order, number of turns and cost. Graders are mixed. Code checks facts like whether the record exists, an LLM judge covers open-ended quality, and humans check the judge. I repeat important cases, because agents vary between runs, and solved hard cases move into the regression suite.",
      "numbers": "There is no universal trial count. Use more repeated trials for high-variance or high-risk cases, and report both pass rate and the number of trials so the score is interpretable.",
      "wrong": "Grading only the final answer. An agent can produce a polished confirmation after calling the wrong tool, changing the wrong record or failing to change anything at all.",
      "follow": "The agent gets the right outcome but uses a different tool sequence from your reference solution. Do you fail it?",
      "followAnswer": "No, not if the outcome is right and the hard rules were respected. A reference solution shows one valid route, not the only one. I check the end state in the system first, then the invariants, like identity verified before a refund or approval before anything destructive. If both pass, it's a pass, and any extra or different calls show up in the efficiency metrics instead. I'd only fail it when the sequence itself is part of the contract, like a mandated compliance order."
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
      "quick": [
        "A red team tests what happens when someone tries to break it.",
        "Cover tricking it, leaking data, and dangerous agent actions.",
        "Watch for hidden instructions planted inside uploaded files.",
        "Every working attack becomes a permanent test.",
        "Agree which problems block launch before you start."
      ],
      "simple": "Testing checks that a GenAI system does what it should. Red teaming checks what it does when someone is actively trying to break it. It is a different mindset, and a red team that finds nothing has failed, not passed.\n\nIt works best organised by type of attack: prompt injection, jailbreaks, data extraction, harm specific to your domain, and for agents, dangerous actions like paying or deleting. Indirect injection is the one people miss. For example, if your corpus accepts user-uploaded files, an attacker can plant instructions in a file that later gets retrieved. Tools such as PyRIT or garak generate attacks at volume, humans find the creative ones, and people outside the build team help, because builders are blind to their own assumptions.\n\nWhat makes it engineering rather than theatre is that every attack that works becomes a permanent test on every deploy, with launch-blocking severity agreed before you start.",
      "points": [
        "Testing checks intended behaviour; red teaming checks adversarial behaviour.",
        "A red team that finds nothing has failed.",
        "Cover: direct and indirect injection, jailbreaks, data extraction, domain-specific harm, destructive tool calls.",
        "Indirect injection through ingested documents is the RAG-specific one people miss.",
        "Mix automated generation for volume with humans for creativity; include outsiders.",
        "Every successful attack becomes a permanent regression test.",
        "Agree severity thresholds that block launch before you start, not after."
      ],
      "say": "Red teaming asks what the system does when someone is actively trying to break it, which ordinary testing never does. Testing checks intended behaviour. A red team is hunting for the unintended, so one that finds nothing has failed, not passed. I organise it by attack type rather than improvising. That means prompt injection, jailbreaks, data extraction, harm specific to our domain, and for agents, dangerous actions like paying or deleting. Indirect injection is the one people miss. In a RAG system, an attacker hides instructions in an uploaded file that later gets retrieved, and that's a live path into the model's instructions. Tools like PyRIT, garak or promptfoo generate attacks at volume, and humans find the creative ones nobody scripted. I bring in people outside the build team, because builders are blind to their own assumptions. Every attack that works becomes a permanent test on every deploy. And I agree which severity blocks launch before we start, so findings don't get argued away under deadline pressure.",
      "numbers": "Indirect injection through an ingested document is the one to demonstrate. If your corpus accepts user-uploaded files, that is a live path from an attacker into your model's instructions.",
      "wrong": "Describing it as running the guardrail test suite again. That is testing your known controls, which is the opposite of looking for the unknown ones.",
      "follow": "Red teaming found a jailbreak you cannot fully fix. Do you launch?",
      "followAnswer": "Not automatically. It depends on severity and exposure, measured against the threshold we agreed before testing began. If the jailbreak produces something embarrassing but low harm, I can launch with layered mitigations, meaning input and output filters, monitoring and alerts on that pattern, rate limits, and a documented accepted risk with a named owner. If it lets someone extract other users' data or trigger a harmful action, it blocks launch, and I remove the tool or permission until it's contained."
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
      "quick": [
        "Usually not a failure, since many valid paths exist.",
        "First check the outcome is right.",
        "Some rules must hold, like checking identity before refunds.",
        "Measure extra steps and cost, but do not fail them.",
        "Exact path checks only suit narrow protocol tests."
      ],
      "simple": "When an agent reaches the right outcome through a different tool path, it is usually not a failure. There is often more than one valid way to finish a task, so you grade the result and the rules that truly matter, not your favourite route.\n\nIt helps to grade in three layers. First the outcome: did the right change happen, and did the user get the right answer? Then the hard rules, where breaking one is a fail even if the outcome looks right. For example, a refund agent must verify identity before refunding and get approval before anything destructive, whatever order it does the rest in. Last comes efficiency, meaning extra tool calls, turns and tokens, which you measure but don't fail a correct run for.\n\nExact path matching only makes sense when the sequence is genuinely part of the contract. Otherwise it is too brittle, because it punishes valid alternatives.",
      "points": [
        "Prefer outcome checks over exact path matching.",
        "Hard-fail safety and business invariants such as approval, identity and permission rules.",
        "Measure unnecessary calls, turns, latency and tokens as efficiency metrics.",
        "Only require an exact sequence when the sequence is genuinely part of the contract.",
        "Avoid graders that punish valid alternative strategies."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Three layers for grading an agent: the outcome, the hard rules that must never break, and efficiency, which is measured but not failed.",
        "layers": [
          {
            "label": "Outcome",
            "note": "right change, right answer",
            "accent": "accent"
          },
          {
            "label": "Hard rules",
            "note": "identity, approval, permissions",
            "accent": "bad"
          },
          {
            "label": "Efficiency",
            "note": "measured, not failed",
            "accent": "muted"
          }
        ],
        "caption": "**Grade the destination and the traffic rules, not the route.** A different valid tool path is fine; breaking a hard rule is a fail."
      },
      "say": "Usually not. I grade the result and the rules that truly matter, not my favourite route. There's often more than one valid way to finish a task, so I grade in three layers. The outcome comes first. Did the right change happen, and did the user get the right answer? Then the hard rules, where breaking one is a fail even if the outcome looks right. A refund agent must verify identity before refunding and get approval before anything destructive, whatever order it does the rest in. Last is efficiency, meaning extra tool calls, turns and tokens. I measure those so waste stays visible, but I don't fail a correct run for them. Exact path matching still makes sense for a narrow protocol test where the sequence is part of the contract. For measuring whether an agent can actually do the job, it's too brittle, because it punishes valid alternatives.",
      "numbers": "Track efficiency distributions such as median and p95 turns or tool calls rather than one magic maximum, then set hard limits only where cost, latency or safety requires them.",
      "wrong": "Failing every run that differs from the reference trace. That teaches the evaluation to prefer one implementation rather than measuring whether the agent solved the task safely and correctly.",
      "follow": "Which tool calls would you make mandatory in a refund-agent evaluation?",
      "followAnswer": "Only the ones that protect the customer and the company. Identity verification before any refund action. A lookup of the order and the refund policy, so eligibility and the amount come from the system, not the model. An approval step when the amount crosses the threshold. And the refund call itself, followed by a check that it succeeded before telling the customer. Order is mandatory only between those, verify before refunding and approve before executing. How it searches or phrases things stays free."
    }
  ]
};
