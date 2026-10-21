/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["00-jev"] = {
  "lede": "Jev is a new kind of AI model from TypeSafe AI, released in early access in September 2026. Instead of writing text like an LLM, it returns a structured decision with a confidence score that your code can act on straight away. Five short cards: what it is, how it differs from an LLM, where it fits, how to combine the two, and how to judge the claims.",
  "grounding": "TypeSafe AI's launch post (15 Sept 2026), the CampusX video walkthrough and independent coverage - vendor claims are marked as claims",
  "evening": [
    "jev-01",
    "jev-02",
    "jev-03"
  ],
  "cards": [
    {
      "id": "jev-01",
      "q": "What is Jev, and what is a System-1 decision model?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "jev",
        "system-1",
        "basics"
      ],
      "why": "Whether you can explain a brand-new model type in plain words, and why it exists.",
      "quick": [
        "Jev is an AI model that returns decisions, not text.",
        "You define the allowed answers first, and it picks one.",
        "Each answer comes with an honest confidence score.",
        "System 1 means fast, instinctive calls, like a human glance.",
        "Built for automation inside software, not for chatting."
      ],
      "simple": "Jev is a model from TypeSafe AI that makes decisions instead of writing text. You give it some state, such as an email or a game situation, plus the possible answers you allow, and it returns one of those answers with a probability. It can never return something outside the list, so your code can use the result directly.\n\nThe name System-1 comes from psychology. System 1 is our fast, instinctive thinking, and System 2 is slow, careful reasoning. LLMs behave like System 2: they think step by step and write long answers. Jev is built for the quick, routine calls that software makes thousands of times a day. For example, deciding whether a support email is urgent, billing or spam takes Jev a fraction of a second, with a confidence score attached.",
      "points": [
        "Input: unstructured state. Output: a typed decision from a list you define.",
        "Every answer carries a calibrated probability and confidence.",
        "System 1 = fast, routine decisions; System 2 = slow reasoning, like an LLM.",
        "Trained with RLCD - Reinforcement Learning for Calibrated Decisions."
      ],
      "say": "Jev is a System-1 model from TypeSafe AI, released in early access in September 2026. The idea is that most decisions inside software don't need an essay, they need a fast, reliable choice. So instead of generating text, Jev takes some state plus a typed question with the allowed answers, and returns one of those answers with a calibrated probability. It can't return anything outside the schema, so code can branch on it directly. The System-1 name comes from fast, instinctive thinking, as opposed to the slow, step-by-step reasoning an LLM does. For instance, triaging a support email into urgent, billing or spam is a System-1 call. It's trained with a method TypeSafe calls reinforcement learning for calibrated decisions, so a higher confidence should really mean higher accuracy.",
      "numbers": "TypeSafe claims responses in about 70-500 ms, and pricing of $42 per billion input tokens with output tokens free. These are vendor figures.",
      "wrong": "\"Jev is just a smaller, faster LLM.\" It doesn't generate text at all. It chooses from answers you define and attaches a probability, which is a different job.",
      "follow": "Why would a decision model need calibrated confidence, and not just an answer?",
      "followAnswer": "Because the confidence is what lets software act safely. If a 0.9 really means right nine times in ten, I can let high-confidence decisions run automatically, send medium ones for review and escalate low ones to an LLM or a person. Without calibration, every answer looks equally sure, so I would need a human checking everything, which defeats the point of automating the decision."
    },
    {
      "id": "jev-02",
      "q": "How is Jev different from an LLM?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "jev",
        "llm",
        "comparison"
      ],
      "why": "Whether you understand the trade-off: structure and speed versus flexibility.",
      "quick": [
        "An LLM writes word by word, Jev picks an answer at once.",
        "Jev's answer always fits the options you defined.",
        "Jev gives a probability you can trust and branch on.",
        "Jev is claimed to be far faster and cheaper.",
        "Jev can't write, chat or reason through open problems."
      ],
      "simple": "An LLM writes its answer one token at a time, so it is flexible but slow, and you pay for every word it writes. Its answers can drift from the format you asked for, and its confidence is often too high. Jev works differently. It never writes free text. It fills in a structure you defined in advance and samples the whole answer in parallel, so it returns in well under a second with a probability attached.\n\nThat structure is also its limit. For example, Jev can decide whether a refund request should be approved, reviewed or rejected, but it cannot draft the reply to the customer. So the two are not rivals: the LLM handles open-ended thinking and writing, and Jev handles fast, repeatable decisions.",
      "points": [
        "LLM: free text, token by token, seconds, pays per output token.",
        "Jev: typed decision, sampled in parallel, milliseconds, output free.",
        "Jev guarantees the schema - no type errors - but can still be wrong.",
        "Choice (up to 255 options), score (ordered levels) and true/false probability."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "LLM versus Jev: output, how it is produced, speed, cost, confidence and best use.",
        "caption": "**Text versus decisions.** Use the LLM to think and write, and Jev to make fast, typed calls your code can trust.",
        "aspects": [
          "Output",
          "Produced",
          "Speed",
          "Cost",
          "Confidence",
          "Best for"
        ],
        "columns": [
          {
            "label": "LLM",
            "note": "System 2",
            "accent": "warn",
            "cells": [
              "Free text",
              "One token at a time",
              "Seconds",
              "Pay per output token",
              "Often overconfident",
              "Reasoning and writing"
            ]
          },
          {
            "label": "Jev",
            "note": "System 1",
            "accent": "accent",
            "cells": [
              "Typed decision + probability",
              "Whole answer in parallel",
              "About 70-500 ms",
              "Output tokens free",
              "Calibrated",
              "Fast decisions in code"
            ]
          }
        ]
      },
      "say": "The core difference is that an LLM generates text and Jev returns decisions. An LLM writes one token at a time, which makes it flexible but slow, you pay for every output token, and its format and confidence aren't guaranteed. Jev fills in a schema you define in advance, such as a choice from up to 255 options, a score on an ordered scale or a true-or-false probability, and it samples the whole answer in parallel. So it returns in milliseconds, it can't break the format, and the probability is calibrated. For instance, Jev can decide whether a refund should be approved, reviewed or rejected, but it can't write the email to the customer. That's why I see them as complementary: the LLM thinks and writes, and Jev makes the fast, repeatable calls.",
      "numbers": "In TypeSafe's own benchmark, one workflow took 0.114 s and $0.000081 with Jev against 8.566 s and $0.01388 with a large LLM - about 194x faster and 445x cheaper. Vendor-run, so test on your own data.",
      "wrong": "\"Jev can't hallucinate, so it's always right.\" The guarantee is that the answer fits the schema. The chosen answer can still be wrong.",
      "follow": "When would you still pick an LLM over Jev for a decision?",
      "followAnswer": "When the decision needs open-ended reasoning, explanation or information that doesn't fit a fixed list of options. For example, choosing which of 2,000 products to recommend, or deciding and then writing a justification for an auditor. Jev caps choices at 255 and produces no text, so for rare, complex calls where a few seconds don't matter, the LLM's flexibility is worth the extra time and cost."
    },
    {
      "id": "jev-03",
      "q": "Where would you use Jev, and where would you not?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "jev",
        "use-cases",
        "judgement"
      ],
      "why": "Whether you can match a new tool to the right problems instead of using it everywhere.",
      "quick": [
        "Use it for fast, repeated decisions with fixed answers.",
        "Good fits are triage, routing, scoring and guardrails.",
        "Also suited to real-time loops like games and robots.",
        "Avoid it for writing, chat or open reasoning.",
        "It is early access, so test before relying on it."
      ],
      "simple": "Jev fits anywhere software makes the same kind of decision again and again, and the possible answers are known in advance. Think of email and ticket triage, routing a request to the right team, scoring a call or a video, checking whether an agent's next action should be allowed, or running a quick decision over millions of records. Because it answers in milliseconds, it also suits real-time loops such as games, robots and simulations.\n\nIt is the wrong tool when you need words or open-ended thinking. For example, it cannot write a summary, hold a conversation or plan a multi-step task. And since it is still in early access as a hosted API, with no self-hosted option yet, it is best to trial it on one narrow, high-volume decision first.",
      "points": [
        "Fits: triage, routing, scoring, smart conditionals in workflows.",
        "Fits: guardrails for agents (allow, ask or deny) and checking LLM outputs.",
        "Fits: map-reduce over large datasets and real-time loops.",
        "Not for: text generation, chat, creative work, open-ended reasoning.",
        "Hosted API in early access; no published weights or self-hosting."
      ],
      "say": "I'd use Jev wherever software makes the same kind of decision many times and the possible answers are known in advance. That covers ticket and email triage, routing requests, scoring calls or videos, smart conditions inside workflows, and running a quick decision across a large dataset. It's also a strong fit for guardrails, for instance deciding whether an agent's next action should be allowed, need approval or be denied, because it answers in milliseconds with a confidence score. Real-time loops like games and robots are another fit. I wouldn't use it for anything that needs words or open reasoning, such as summarising, chatting or planning a task. And because it's an early-access hosted API, I'd trial it on one narrow, high-volume decision before building on it.",
      "numbers": "TypeSafe targets decisions that must return in about 500 ms or less, and allows up to 255 options per choice.",
      "wrong": "Proposing Jev as a replacement for the LLM in a chatbot. It produces no text, so it can route or guard the chat, but it can't answer the user.",
      "follow": "Pick one process at your company where Jev would pay off. Why that one?",
      "followAnswer": "I would pick support ticket triage. It is high volume, the categories are fixed, and today it either waits for a person or uses an LLM call per ticket, which is slow and costly. Jev could route each ticket in milliseconds with a confidence score, send clear cases straight to the right queue and pass unclear ones to a person, and I could measure the gain in routing accuracy and time to first response."
    },
    {
      "id": "jev-04",
      "q": "How would you combine Jev with an LLM in a real system?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "jev",
        "architecture",
        "routing"
      ],
      "why": "Whether you can design a System 1 plus System 2 setup that saves cost without losing quality.",
      "quick": [
        "Let Jev make the fast first call on every request.",
        "Act directly when its confidence is high.",
        "Send low-confidence cases to an LLM or a person.",
        "Use Jev to check the LLM's actions before they run.",
        "Most traffic stays fast and cheap, hard cases get care."
      ],
      "simple": "The natural pattern is System 1 first, System 2 when needed. Jev looks at every incoming item and makes a quick decision with a confidence score. When the confidence is high, the system acts straight away. When it is low, the item goes to an LLM for careful reasoning, or to a person.\n\nFor example, in an insurance claims flow, Jev might approve clearly valid small claims on the spot and pass unusual ones to an LLM agent that reads the documents in detail. Jev can also work the other way round, as a fast guard that checks each action an LLM agent wants to take. The result is that most traffic is handled quickly and cheaply, and the expensive reasoning is saved for the cases that really need it.",
      "points": [
        "Jev triages everything; confidence decides the path.",
        "High confidence: act. Medium: review. Low: escalate to LLM or human.",
        "Jev as a guardrail on LLM or agent actions (allow, ask, deny).",
        "Tune the thresholds on real data and watch accuracy per band."
      ],
      "diagram": {
        "alt": "An incoming request goes to Jev, which decides with a confidence score. High confidence acts directly; low confidence escalates to an LLM or a human.",
        "caption": "**Fast by default, careful when unsure.** The confidence score decides whether Jev acts alone or hands over.",
        "rows": [
          [
            {
              "id": "in",
              "label": "Incoming request",
              "note": "ticket, claim, action"
            }
          ],
          [
            {
              "id": "jev",
              "label": "Jev decides",
              "note": "typed answer + confidence",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "act",
              "label": "Act directly",
              "note": "most traffic, milliseconds",
              "accent": "accent"
            },
            {
              "id": "esc",
              "label": "Escalate",
              "note": "uncommon or unclear cases",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "llm",
              "label": "LLM or human",
              "note": "careful reasoning"
            }
          ]
        ],
        "edges": [
          {
            "from": "in",
            "to": "jev"
          },
          {
            "from": "jev",
            "to": "act",
            "label": "high"
          },
          {
            "from": "jev",
            "to": "esc",
            "label": "low"
          },
          {
            "from": "esc",
            "to": "llm"
          }
        ]
      },
      "say": "I'd put Jev in front as the System-1 layer and keep the LLM as System 2. Every incoming item goes to Jev first, which returns a typed decision with a confidence score. If the confidence is high, the system acts straight away. If it's in a middle band, a person reviews it, and if it's low, it escalates to an LLM that can reason through the case. For instance, in a claims flow Jev approves clearly valid small claims instantly, and unusual ones go to an LLM agent that reads the documents. Jev also works the other way round, as a fast guardrail that checks each action an agent wants to take. I'd tune the thresholds on real labelled data and track accuracy within each confidence band, so the routing stays trustworthy.",
      "numbers": "No universal thresholds. Set them from your own data, for example by checking that decisions above your 'act' threshold are right at the rate the business needs.",
      "wrong": "Sending everything to both models \"to be safe\". That pays the LLM's full cost and latency on every item and throws away the reason for using Jev.",
      "follow": "How would you choose the confidence thresholds?",
      "followAnswer": "From labelled data, not guesses. I would run Jev on a few hundred real, labelled cases and look at accuracy at each confidence level. Then I would set the act threshold where accuracy meets the business target, and the escalate threshold where errors start to cost more than a review. After launch I keep sampling each band, because thresholds can drift as the traffic changes."
    },
    {
      "id": "jev-05",
      "q": "Jev claims to be about 100 times faster and cheaper and says it can't hallucinate. How would you evaluate that?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "jev",
        "evaluation",
        "judgement"
      ],
      "why": "Whether you test vendor claims on your own data instead of repeating the launch post.",
      "quick": [
        "Treat the numbers as vendor claims until tested.",
        "No hallucination means the format is safe, not the answer.",
        "Test on your own labelled data against your current setup.",
        "Check that confidence really matches accuracy.",
        "Include lock-in and early-access risk in the decision."
      ],
      "simple": "Launch numbers come from the vendor's own tests, so they are a starting point, not proof. The first thing to understand is what \"can't hallucinate\" means here: Jev's answer always fits the schema you defined, so it never invents a new option or breaks the format. But it can still pick the wrong option.\n\nSo I would test it myself. For example, I would take a few hundred real, labelled support tickets and run them through Jev and through the current LLM prompt, then compare accuracy, speed and cost. I would also check calibration, meaning whether answers marked 90 per cent confident are really right about nine times in ten. Finally, I would weigh the practical risks: it is early access, hosted only, and the pricing may change.",
      "points": [
        "Benchmarks are vendor-run; the low price may not be permanent.",
        "\"No hallucination\" = schema guarantee; answers can still be wrong.",
        "Compare accuracy, latency and cost on your own labelled data.",
        "Check calibration: confidence should match observed accuracy.",
        "Weigh early access, hosted-only and lock-in risk."
      ],
      "say": "I'd treat the launch numbers as vendor claims until I've tested them. The benchmarks were run by TypeSafe, and they've said themselves the workflow results may be on the high end. I'd also be precise about \"can't hallucinate\". It means the answer always fits the schema, so there are no invented options or broken formats, but Jev can still choose the wrong option. So I'd run my own comparison: for instance, a few hundred real labelled tickets through Jev and through our current LLM prompt, comparing accuracy, latency and cost. Then I'd check calibration, whether answers marked ninety percent confident are right about nine times in ten, because the whole design relies on that. Finally I'd weigh the risks of an early-access, hosted-only API before depending on it.",
      "numbers": "A useful test set is a few hundred labelled real cases, split by confidence band, so you can see accuracy at each level.",
      "wrong": "Quoting \"193x faster, 444x cheaper and zero hallucinations\" as fact in a design review. Those are vendor results, and zero hallucinations only covers the output format.",
      "follow": "Jev's accuracy is slightly lower than your LLM's, but it is far faster and cheaper. What do you recommend?",
      "followAnswer": "It depends on the cost of a wrong decision. If a mistake is cheap and easy to fix, the speed and cost savings usually win, especially if low-confidence cases still go to the LLM, which often recovers most of the lost accuracy. If mistakes are costly, like approving payments, I would use Jev only above a high confidence threshold and keep the LLM or a person for everything else."
    }
  ]
};
