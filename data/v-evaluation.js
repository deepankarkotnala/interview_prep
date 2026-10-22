/* Visual explanation: how you prove an LLM system got better, not just different.
   Drawn by assets/visual.js - scene format in README.md. The bot, metrics, scores
   and thresholds are illustrative. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
window.IR.v["evaluation"] = {
  view: [1290, 640],

  parts: [
    { id: "golden", kind: "db", x: 30, y: 50, w: 200, h: 120, label: "Golden set", sub: "200 questions · v3", tone: "data", concept: "golden" },
    { id: "why", kind: "box", x: 30, y: 220, w: 200, h: 120, label: "Five tries?", icon: "alert", tone: "guard", concept: "why",
      sub: "outputs vary run to run; you need a fixed set and numbers" },

    { id: "sut", kind: "box", x: 290, y: 50, w: 270, h: 80, label: "HR bot v2", sub: "new chunking + new prompt", icon: "spark", tone: "model", concept: "sut" },
    { id: "trace", kind: "code", x: 290, y: 166, w: 270, title: "Trace - question 37", tone: "neutral", hidden: true, concept: "traces",
      lines: ["retrieved: §4.2, §4.1, §9.4", "answer: \"15 days, within", "  6 months of the birth\"", "latency 1.8 s · ₹0.40"] },

    { id: "retrieval", kind: "bars", x: 610, y: 62, w: 300, lw: 90, fmt: "raw", label: "Retrieval", tone: "data", hidden: true, concept: "retrieval",
      items: [{ label: "recall@5", value: 0.92 }, { label: "MRR", value: 0.81 }] },
    { id: "det", kind: "box", x: 610, y: 160, w: 300, h: 70, label: "Deterministic checks", sub: "format · must-mention facts · refusals", icon: "check", tone: "guard", concept: "deterministic" },
    { id: "judge", kind: "box", x: 610, y: 262, w: 300, h: 80, label: "LLM judge", sub: "rubric: faithfulness, relevance", icon: "scale", tone: "model", concept: "judge" },
    { id: "calib", kind: "box", x: 610, y: 372, w: 300, h: 70, label: "Calibrate the judge", sub: "agrees with humans? any bias?", icon: "users", tone: "guard", concept: "calibrate" },

    { id: "card", kind: "bars", x: 960, y: 70, w: 306, lw: 116, label: "Scorecard - v2", tone: "output", hidden: true, concept: "scorecard",
      items: [
        { label: "faithfulness", value: 0.91, text: "0.91" }, { label: "relevance", value: 0.88, text: "0.88" },
        { label: "leave slice", value: 0.74, text: "0.74" }, { label: "p95 latency", value: 0.38, text: "1.9 s" },
        { label: "cost / answer", value: 0.3, text: "₹0.40" }
      ] },
    { id: "gate", kind: "box", x: 960, y: 262, w: 306, h: 88, label: "CI regression gate", icon: "shield", tone: "guard", concept: "gate",
      sub: "blocks the release if faithfulness drops" },

    { id: "fails", kind: "box", x: 610, y: 482, w: 300, h: 80, label: "New failures", sub: "become new golden questions", icon: "flag", tone: "guard", concept: "flywheel" },
    { id: "online", kind: "box", x: 960, y: 482, w: 306, h: 80, label: "In production", sub: "feedback, sampled traces, A/B tests", icon: "eye", tone: "output", concept: "online" }
  ],

  links: [
    { id: "l-gold-sut", from: "golden:r:0.45", to: "sut:l", tone: "data" },
    { id: "l-sut-trace", from: "sut:b", to: "trace:t", style: "straight", tone: "model" },
    { id: "l-trace-ret", from: "trace:r:0.2", to: "retrieval:l", tone: "data" },
    { id: "l-trace-det", from: "trace:r:0.6", to: "det:l", tone: "guard" },
    { id: "l-det-judge", from: "det:b", to: "judge:t", style: "straight", tone: "model" },
    { id: "l-judge-cal", from: "judge:b", to: "calib:t", style: "straight", tone: "guard" },
    { id: "l-ret-card", from: "retrieval:r", to: "card:l:0.25", tone: "output" },
    { id: "l-judge-card", from: "judge:r", to: "card:l:0.75", tone: "output" },
    { id: "l-card-gate", from: "card:b", to: "gate:t", style: "straight", tone: "guard" },
    { id: "l-gate-online", from: "gate:b", to: "online:t", style: "straight", tone: "output", label: "release", labelAt: 0.5 },
    { id: "l-online-fails", from: "online:l", to: "fails:r", style: "straight", tone: "guard" },
    { id: "l-fails-gold", from: "fails:b", to: "golden:r:0.8", via: [[760, 612], [260, 612], [260, 146]], dashed: true, tone: "data", label: "add to the golden set", labelAt: 0.45 }
  ],

  steps: [
    { title: "Better, or just different?",
      text: "Version 2 of the HR bot changes the chunking and the prompt. Is it better or just different? Evaluation answers with a fixed test set, measured numbers and a gate that stops a worse version shipping." },
    { title: "Five tries prove nothing",
      text: "Trying a few questions by hand feels convincing but proves little. LLM outputs vary from run to run, and a change that fixes one question often breaks another you did not try.",
      focus: ["why"] },
    { title: "Build a golden set",
      text: "The golden set is 200 real employee questions with the expected answer and the policy passage that supports it, including tricky and should-refuse cases. It is versioned like code.",
      focus: ["golden"] },
    { title: "Run every question, keep traces",
      text: "Version 2 answers all 200 questions. For each one the run records a trace: the chunks retrieved, the answer, the latency and the cost.",
      focus: ["golden", "sut", "trace"], flow: ["l-gold-sut", "l-sut-trace"],
      packets: [{ on: "l-gold-sut", text: "200 questions" }, { on: "l-sut-trace", text: "trace" }], set: { trace: { hidden: false } } },
    { title: "Did retrieval find the passage?",
      text: "Because each golden question names its source passage, retrieval can be scored on its own: **recall@5** asks whether the passage was in the top five, **MRR** how high it ranked.",
      focus: ["trace", "retrieval"], flow: ["l-trace-ret"], hl: { trace: [0] },
      packets: [{ on: "l-trace-ret", text: "retrieved" }], set: { retrieval: { hidden: false } } },
    { title: "Cheap checks first",
      text: "Deterministic checks are fast, free and never disagree with themselves: is the format right, does the answer mention **15 days**, does it refuse when it should?",
      focus: ["trace", "det"], flow: ["l-trace-det"], hl: { trace: [1, 2] }, packets: [{ on: "l-trace-det", text: "answer" }] },
    { title: "An LLM judge with a rubric",
      text: "For what code cannot check, an LLM judge scores each answer against a rubric: is every claim supported by the retrieved passages (faithfulness), and does it answer the question (relevance)?",
      focus: ["det", "judge"], flow: ["l-det-judge"], packets: [{ on: "l-det-judge" }] },
    { title: "Check the judge",
      text: "A judge is a model too. Compare its scores with human ratings on a sample and watch for known biases: favouring longer answers, the first option shown, or its own model family.",
      focus: ["judge", "calib"], flow: ["l-judge-cal"], packets: [{ on: "l-judge-cal", text: "sample" }] },
    { title: "One scorecard, sliced",
      text: "Everything rolls up into one scorecard with p95 latency and cost per answer. Slicing by topic shows what an average hides: leave questions score only 0.74.",
      focus: ["card", "retrieval", "judge"], flow: ["l-ret-card", "l-judge-card"], hl: { card: [2] },
      packets: [{ on: "l-ret-card" }, { on: "l-judge-card", "with": true }], set: { card: { hidden: false } } },
    { title: "Gate the release",
      text: "The scorecard is compared with version 1's. In CI, the release is blocked if faithfulness drops past a threshold. Version 2 scores 0.91 against 0.86, so it passes.",
      focus: ["card", "gate"], flow: ["l-card-gate"], packets: [{ on: "l-card-gate", text: "v2 vs v1" }],
      set: { gate: { sub: "passed: faithfulness 0.91 vs 0.86 baseline" } } },
    { title: "Keep learning in production",
      text: "After release, user feedback, sampled traces judged daily and A/B tests keep measuring. Every new failure found in production becomes a new golden question, so the test set keeps getting harder.",
      focus: ["gate", "online", "fails", "golden"], flow: ["l-gate-online", "l-online-fails", "l-fails-gold"],
      packets: [{ on: "l-gate-online", text: "v2" }, { on: "l-online-fails", text: "bad answer" }, { on: "l-fails-gold", text: "new case" }] }
  ],

  concepts: {
    why: {
      title: "Why spot checks are not evidence",
      tip: "A few hand-picked tries cannot show a change is better: outputs vary between runs, and fixes in one place break others.",
      detail: [
        "After changing the chunking and the prompt, someone tries five questions and the answers look good. That feels like proof, but it is not. The same question can get a different answer on the next run, and five questions cover almost nothing.",
        "LLM changes have side effects. A prompt tweak that fixes paternity-leave questions can quietly break questions about notice periods - and nobody tried those.",
        "Evaluation replaces impressions with numbers: the same fixed set of questions, scored the same way, for every version. Then \"better\" means a measured improvement, not a good feeling."
      ],
      oneLiner: "Spot checks miss regressions and run-to-run variation; only a fixed test set scored the same way for every version shows real improvement."
    },
    golden: {
      title: "Golden dataset",
      tip: "A fixed, versioned set of real questions with expected answers and supporting sources - the yardstick every version is measured against.",
      detail: [
        "The golden set holds 200 real questions employees have asked, each with the expected answer and the passage that supports it. It includes easy questions, hard ones, ambiguous ones, and ones the bot should refuse.",
        "Build it from real traffic, not invented examples, and get experts to check the expected answers. A few hundred well-chosen cases usually beat thousands of synthetic ones.",
        "Version it like code. When you add or fix cases, the version number changes, so scores are always compared on the same set. Keep some cases hidden from whoever tunes prompts, so the set cannot be gamed."
      ],
      oneLiner: "A golden set is a versioned collection of real questions with expected answers and sources, covering edge and refusal cases, used to score every version."
    },
    sut: {
      title: "The version under test",
      tip: "The complete system being evaluated - here version 2 with new chunking and a new prompt - run exactly as it would be in production.",
      detail: [
        "Evaluate the whole system, not just the model: the same retrieval, prompts, model and settings that users will get. A model that scores well on its own can still fail inside a weak pipeline.",
        "Change one thing at a time where you can. If version 2 changes the chunking and the prompt together and the score moves, you will not know which change did it.",
        "Run the full golden set for every candidate version, ideally several times or at a fixed low temperature, so random variation does not decide the result."
      ],
      oneLiner: "Evaluate the full production pipeline, change one thing at a time where possible, and run enough to separate real changes from noise."
    },
    traces: {
      title: "Traces",
      tip: "A record of everything that happened for one question: retrieved chunks, prompt, answer, latency, tokens and cost.",
      detail: [
        "For every question, the run saves a trace: which chunks were retrieved, the prompt sent, the answer, how long it took, how many tokens it used and what it cost.",
        "Traces turn a score into an explanation. When question 37 fails, you can see whether the right passage was retrieved and ignored, or never retrieved at all.",
        "Tools such as LangSmith, Langfuse or Arize Phoenix store traces for both test runs and production, so the same debugging works before and after release."
      ],
      oneLiner: "Traces record retrieval, prompts, answers, latency and cost per question, turning a failing score into a diagnosable cause."
    },
    retrieval: {
      title: "Retrieval metrics",
      tip: "Scores retrieval on its own: recall@k (was the right passage in the top k?) and MRR (how high did it rank?).",
      detail: [
        "Because every golden question names its supporting passage, you can check retrieval without looking at the answer. Recall@5 is the share of questions whose passage appeared in the top five results; here 0.92.",
        "MRR, mean reciprocal rank, rewards ranking the passage near the top: 1 if it is first, 0.5 if second, and so on, averaged over questions. Here 0.81.",
        "Measure retrieval first. If the right passage never reaches the model, no prompt or model change can fix the answer, so this tells you which half of the system to work on."
      ],
      oneLiner: "Recall@k and MRR score retrieval separately from generation, showing whether failures start before the model ever sees the context."
    },
    deterministic: {
      title: "Deterministic checks",
      tip: "Code-based checks - format, required facts, correct refusals - that are fast, free and give the same result every time.",
      detail: [
        "Some things can be checked with plain code. Is the output valid JSON? Does the answer contain \"15 days\"? Does the bot refuse questions about other employees' salaries?",
        "These checks cost nothing, run in milliseconds and never change their mind, so they make a stable base for every evaluation and for CI.",
        "Use them wherever an exact answer exists, and save the more expensive, more variable LLM judge for qualities that code cannot measure, such as whether an explanation is faithful and helpful."
      ],
      oneLiner: "Use deterministic code checks - format, required facts, refusals - wherever possible, and reserve LLM judges for qualities code cannot measure."
    },
    judge: {
      title: "LLM-as-a-judge",
      tip: "A model that scores answers against a rubric, such as faithfulness to the sources and relevance to the question.",
      detail: [
        "Many qualities have no single right string: is the answer supported by the retrieved policy? Does it actually answer what was asked? An LLM judge reads the question, the context and the answer, and scores them against a written rubric.",
        "Faithfulness asks whether every claim is backed by the context, which catches hallucination. Relevance asks whether the answer addresses the question. Frameworks such as Ragas and DeepEval package metrics like these.",
        "Judges work best with narrow, concrete questions - \"is this sentence supported by this passage, yes or no?\" - rather than \"rate this answer from 1 to 10\". Ask for a short reason with each score to make disagreements easy to inspect."
      ],
      oneLiner: "An LLM judge scores answers on rubric criteria like faithfulness and relevance; narrow, concrete yes/no questions make it far more reliable."
    },
    calibrate: {
      title: "Calibrating the judge",
      tip: "Check the judge against human ratings and look for its biases before trusting its scores to make release decisions.",
      detail: [
        "A judge can be wrong in systematic ways. Before trusting it, have people rate a sample of answers - say 50 to 100 - and measure how often the judge agrees with them.",
        "Known biases include preferring longer answers, preferring whichever option is shown first, and favouring outputs from its own model family. Shuffle option order, use a different model as judge, and keep rubrics specific to reduce them.",
        "Re-check agreement whenever you change the judge model or the rubric. If the judge and humans disagree often, fix the rubric before using its scores to gate releases."
      ],
      oneLiner: "Validate an LLM judge against human ratings and control its biases - length, position, self-preference - before letting it gate releases."
    },
    scorecard: {
      title: "Scorecard and slices",
      tip: "All metrics in one view - quality, latency, cost - broken down by slice so weak areas are not hidden by a good average.",
      detail: [
        "The scorecard puts the key numbers side by side: faithfulness, relevance, retrieval, p95 latency and cost per answer. Quality alone is not enough; a better answer that takes ten seconds may still be a worse product.",
        "Averages hide problems. Slicing by topic shows leave questions scoring only 0.74 while the average looks fine. Slice by topic, difficulty, language and user type.",
        "Look at the failing examples, not just the numbers. Reading twenty failures usually tells you more about what to fix than any score."
      ],
      oneLiner: "A scorecard combines quality, latency and cost, sliced by topic or language so weak areas show, and is always read alongside actual failures."
    },
    gate: {
      title: "Regression gate in CI",
      tip: "An automated check in the release pipeline that compares the new version with the baseline and blocks it if key metrics drop.",
      detail: [
        "Every candidate version runs the evaluation in CI, and its scores are compared with the current production version - the baseline. Here faithfulness rises from 0.86 to 0.91, so the gate passes.",
        "The gate needs clear rules agreed in advance: for example, block if faithfulness drops by more than 0.02, if any safety case fails, or if p95 latency grows by more than 20%.",
        "Small differences can be noise, so run enough questions, repeat runs where needed, and treat tiny changes with care. The goal is to catch real regressions automatically, not to chase decimal points."
      ],
      oneLiner: "A CI regression gate compares each candidate with the production baseline against pre-agreed thresholds and blocks releases that regress."
    },
    online: {
      title: "Evaluation in production",
      tip: "After release, keep measuring with real traffic: user feedback, sampled traces scored daily, and A/B tests between versions.",
      detail: [
        "Offline tests cannot cover everything real users ask. In production, collect thumbs-up and thumbs-down, sample a few hundred traces a day for the judge or a human to score, and watch latency and cost.",
        "A/B tests send part of the traffic to the new version and compare real outcomes, such as resolved questions or fewer escalations to HR, not just model scores.",
        "Set alerts on these signals. A drop in faithfulness on sampled traffic, or a spike in thumbs-down for one topic, is often the first sign that documents changed or a new kind of question appeared."
      ],
      oneLiner: "Production evaluation uses feedback, daily scoring of sampled traces and A/B tests on business outcomes, with alerts for drops."
    },
    flywheel: {
      title: "The evaluation flywheel",
      tip: "Every failure found in production becomes a new golden question, so the test set grows towards what users really ask.",
      detail: [
        "When a real answer goes wrong - a thumbs-down, an escalation, a bad sampled trace - turn it into a golden case with the correct answer and source. Then it can never silently break again.",
        "Over time the golden set shifts from what the team imagined users would ask to what they actually ask, including the hard cases. Each version is tested against a tougher set.",
        "This loop - ship, observe, add failures, re-test - is what separates teams whose LLM products steadily improve from teams that keep fixing the same bugs."
      ],
      oneLiner: "Feeding production failures back into the golden set keeps evaluation aligned with real users and stops fixed bugs from returning."
    }
  }
};
