/* Topic 16 - ML fundamentals for AI engineers.
   Grounding: public JDs that list ML fundamentals alongside GenAI skills, plus
   the failure modes these questions exist to catch. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["16-ml-fundamentals"] = {
  lede: "Every GenAI job description still lists machine learning fundamentals, and this is where GenAI-only candidates lose rounds they expected to pass. The panel is not asking you to derive anything. They are checking that you can reason about data, measurement and failure - which is exactly the skill GenAI evaluation also needs.",
  grounding: "public JDs listing ML fundamentals + the failure modes these questions catch",
  evening: ["ml-01", "ml-09", "ml-10", "ml-12", "ml-30"],

  cards: [
    {
      id: "ml-01",
      q: "Explain the bias-variance trade-off.",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["ml-fundamentals", "basics", "overfitting"],
      why: "The classic opener. Reciting the definition is expected; connecting it to what you would do is not.",
      simple:
        "Bias is error from a model that is too simple to capture the pattern. It gets things wrong the same way every time, and it is wrong on the training data too.\n\n" +
        "Variance is error from a model that is too sensitive to the particular data it saw. It fits the training set beautifully and falls apart on anything new, because it learned the noise along with the signal.\n\n" +
        "The trade-off is that reducing one usually raises the other. A more flexible model cuts bias and adds variance.\n\n" +
        "How you diagnose it, which is the part that matters: compare training error with validation error. Both high means high bias, so the model is underfitting - use a more capable model or better features. Training error low and validation error much higher means high variance, so it is overfitting - get more data, regularise, or simplify.\n\n" +
        "That diagnostic is the answer. The definition alone tells the interviewer you have read about it.",
      points: [
        "Bias - model too simple. Wrong on training data too. Underfitting.",
        "Variance - model too sensitive to its training data. Overfitting.",
        "Diagnose by comparing training error with validation error.",
        "Both high → more capacity, better features.",
        "Train low, validation high → more data, regularisation, simpler model."
      ],
      say: "Bias is error from a model too simple to capture the pattern - it is wrong on the training data too. Variance is error from a model so sensitive to its training data that it learned the noise. I diagnose by comparing training and validation error: both high means underfitting, so more capacity or better features; training low and validation much higher means overfitting, so more data or regularisation.",
      numbers: "No number applies. The training-versus-validation gap is the measurement, not a threshold.",
      wrong: "Reciting only the definitions. Every candidate can. The interviewer wants the diagnostic that follows from them.",
      follow: "Training accuracy 99%, validation 71%. What do you do first?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-02",
      q: "Why is accuracy a bad metric, and what do you use instead?",
      round: ["tech1"],
      level: "2-5",
      tags: ["ml-fundamentals", "metrics", "imbalanced-data"],
      why: "The most useful metric question there is, and it transfers directly to GenAI evaluation.",
      simple:
        "Because of imbalance. If one in a hundred claims is fraudulent, a model that says \"not fraud\" every single time is 99% accurate and completely useless. Accuracy hid the only thing you cared about.\n\n" +
        "So you look at the confusion matrix and pick metrics that match the cost of each mistake.\n\n" +
        "Precision is: of the cases I flagged, how many were real. It matters when a false positive is expensive - you are sending investigators, or blocking a legitimate transaction.\n\n" +
        "Recall is: of the real cases, how many did I catch. It matters when a false negative is expensive - a missed fraud, a missed disease.\n\n" +
        "F1 combines them when you need one number. AUC-PR is the better summary than AUC-ROC on heavily imbalanced data, because ROC looks optimistic when negatives dominate.\n\n" +
        "And the answer that scores: which mistake costs more in this business? That decides the metric, and it is a question you ask rather than assume.",
      points: [
        "Imbalance makes accuracy meaningless - a constant prediction can score 99%.",
        "Precision: of those I flagged, how many were real. Guards against false positives.",
        "Recall: of the real cases, how many I caught. Guards against false negatives.",
        "F1 when you need one number; AUC-PR over AUC-ROC on heavy imbalance.",
        "The metric follows from which error costs more. Ask, do not assume."
      ],
      say: "Because of imbalance - if one in a hundred cases is fraud, predicting \"not fraud\" always is 99% accurate and useless. So I look at the confusion matrix and choose by which error costs more. Precision when a false positive is expensive, recall when a false negative is. F1 when I need one number, and AUC-PR rather than ROC on heavy imbalance. Which mistake costs more is a question I ask.",
      numbers: "On a 1% positive rate, a constant negative prediction scores 99% accuracy and 0% recall. That is the example to quote.",
      wrong: "Listing precision, recall and F1 without connecting them to the cost of each error. The connection is the answer.",
      follow: "The business wants both high precision and high recall. What do you tell them?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-03",
      q: "What is data leakage and how do you catch it?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["ml-fundamentals", "leakage", "validation"],
      why: "The failure that produces excellent offline results and a useless production model. Experience shows immediately.",
      simple:
        "Leakage is when information reaches the model during training that will not be available when it actually runs. The model looks brilliant in validation because it was effectively shown the answer.\n\n" +
        "The forms it takes. Target leakage - a feature that is a consequence of the outcome rather than a cause. A column like `payout_date` predicting claim approval is perfect, and useless, because it only exists after approval. Train-test contamination - scaling or imputing across the whole dataset before splitting, so test statistics leaked into training. Temporal leakage - random splitting on time-series data, so the model trained on the future to predict the past. And duplicate rows landing on both sides of the split.\n\n" +
        "How you catch it: be suspicious of any result that is too good. Check feature importance - a single feature dominating is the classic signature. Ask when each feature becomes available in real time, which is the question that catches target leakage. And split by time whenever the data has time in it.\n\n" +
        "The senior habit: fit every transformation inside the training fold only.",
      points: [
        "Target leakage - a feature that exists only because the outcome happened.",
        "Contamination - scaling or imputing before splitting.",
        "Temporal leakage - random split on time-ordered data.",
        "Duplicates landing on both sides of the split.",
        "Signature: results too good; one feature dominating importance.",
        "The catch-all test: when does this feature become available in production?",
        "Fit every transformation inside the training fold only."
      ],
      say: "Leakage is information reaching the model in training that will not exist at prediction time, so validation looks brilliant and production fails. Target leakage is a feature that exists only because the outcome happened. Contamination is scaling before splitting. Temporal leakage is random-splitting time-ordered data. I catch it by being suspicious of results that are too good, checking whether one feature dominates, and asking when each feature becomes available.",
      numbers: "No number applies. The tell is a suspiciously high score and one feature carrying most of the importance.",
      wrong: "\"I use train-test split to avoid it.\" A random split is itself the cause of temporal leakage, so this answer names the mechanism that created the problem.",
      follow: "Your model scores 0.99 AUC. Are you pleased?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-04",
      q: "How do you handle imbalanced data?",
      round: ["tech1"],
      level: "2-5",
      tags: ["ml-fundamentals", "imbalanced-data", "training"],
      why: "Common and practical. The good answer starts by questioning whether resampling is needed at all.",
      simple:
        "First ask whether it is actually a problem. Imbalance itself is not - many models handle it fine. The problem is when the minority class is what you care about and the model has learned to ignore it. So check the recall on that class before changing anything.\n\n" +
        "Then the options, cheapest first. Change the metric and the decision threshold - often the whole fix, because the model's ranking may already be good and only the 0.5 cutoff is wrong. Use class weights, which most libraries support and which needs no data manipulation. Then resampling: undersample the majority when you have plenty of data, oversample or synthesise the minority when you do not.\n\n" +
        "The rule about resampling that separates people who have done this: resample inside the training fold only, never before the split, and never touch the validation or test set. A resampled test set gives you a number that does not correspond to anything real.\n\n" +
        "And if the minority class has only a handful of examples, consider whether this is anomaly detection rather than classification.",
      points: [
        "First check whether minority-class recall is actually bad. Imbalance alone is not a problem.",
        "Adjust the decision threshold - often the entire fix.",
        "Class weights next: no data manipulation needed.",
        "Then resampling - inside the training fold only.",
        "Never resample validation or test. The number stops meaning anything.",
        "Very few positives → consider anomaly detection instead."
      ],
      say: "First I check whether minority-class recall is actually bad, because imbalance alone is not a problem. Then, cheapest first: adjust the decision threshold, which is often the whole fix since the ranking may already be fine. Then class weights, which need no data manipulation. Then resampling, inside the training fold only - never on validation or test, because a resampled test score corresponds to nothing real.",
      numbers: "The default 0.5 threshold is rarely right on imbalanced data. Choose it from the precision-recall curve against the business cost of each error.",
      wrong: "\"I use SMOTE.\" Jumping to synthesis before trying the threshold and class weights, and it invites the question of whether you applied it before or after the split.",
      follow: "Where exactly in your pipeline does the resampling happen?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-05",
      q: "How do you know a model has degraded in production?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["ml-fundamentals", "drift", "monitoring"],
      why: "It maps directly onto GenAI monitoring, and it is where classical ML experience becomes an asset.",
      simple:
        "The difficulty is that labels usually arrive late or never. You predicted churn today and you find out in ninety days, so you cannot watch accuracy in real time.\n\n" +
        "So you monitor the things you can see immediately. Input drift - the distribution of incoming features shifting away from training. Prediction drift - the distribution of your model's own outputs moving, which is a strong early signal and cheap to compute. Data quality - nulls appearing, a category you have never seen, a unit change upstream. And segment volumes, because a shift in who is being scored changes what the aggregate means.\n\n" +
        "Then accuracy retrospectively, as labels arrive, backfilled onto the period they belong to.\n\n" +
        "The distinction worth naming: data drift means the inputs changed; concept drift means the relationship between inputs and outcome changed. Drift detection finds the first. Only labels find the second, which is why a delayed-label pipeline is not optional.",
      points: [
        "Labels arrive late or never - you cannot watch accuracy live.",
        "Monitor input drift, prediction drift, data quality, segment volumes.",
        "Prediction drift is the cheapest strong early signal.",
        "Backfill accuracy onto the right period as labels arrive.",
        "Data drift = inputs changed. Concept drift = the relationship changed.",
        "Only labels reveal concept drift. Build the delayed-label pipeline."
      ],
      say: "Labels usually arrive late, so I cannot watch accuracy live. I monitor input drift, prediction drift - which is cheap and a strong early signal - data quality, and segment volumes. Then I backfill accuracy onto the right period as labels arrive. The distinction that matters is that drift detection finds changed inputs, but only labels reveal concept drift, where the relationship itself changed.",
      numbers: "Prediction drift is computable on every request at no label cost. It is the first monitor to build, before any accuracy pipeline.",
      wrong: "\"We monitor accuracy in production.\" Only if labels arrive quickly. If they do not, this answer says you have not operated a model with delayed feedback.",
      follow: "Inputs look stable and accuracy fell. What is that?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-06",
      q: "Explain cross-validation and when you should not use it.",
      round: ["tech1"],
      level: "2-5",
      tags: ["ml-fundamentals", "validation", "evaluation"],
      why: "The 'when not to' half is what distinguishes the answer.",
      simple:
        "Cross-validation splits the data into k parts, trains on k minus one and validates on the held-out part, then rotates. Every row gets used for validation exactly once, and you average the scores. It gives a more stable estimate than one split, and a sense of the variance across folds - which is itself informative, because widely varying folds mean an unstable model.\n\n" +
        "When not to use it. Time-series data, because a random split trains on the future - use forward-chaining, where each fold trains only on earlier periods. Grouped data, where the same customer or patient appears in several rows, so you split by group or the model recognises the individual rather than the pattern. And when training is expensive, since k-fold means k trainings, which is why fine-tuning is almost never cross-validated.\n\n" +
        "And the general principle behind all three: the split has to mirror how the model will actually be used. If production means predicting for an unseen customer next month, the validation split has to be unseen customers, next month.",
      points: [
        "k folds, each row validated once, scores averaged. More stable than one split.",
        "Fold variance is itself a signal - wide spread means an unstable model.",
        "Time series → forward-chaining, never random.",
        "Grouped data → split by group, or the model learns the individual.",
        "Expensive training → k-fold costs k trainings.",
        "The split must mirror how the model will be used in production."
      ],
      say: "It splits data into k folds, trains on k minus one and validates on the rest, rotating so every row is validated once. The spread across folds is itself useful - wide variance means an unstable model. I would not use it on time series, where a random split trains on the future, or on grouped data where the same customer appears in many rows. The split has to mirror production use.",
      numbers: "k = 5 or 10 is standard. On time series use forward-chaining folds instead, and report performance per fold, not just the mean.",
      wrong: "\"I always use 5-fold cross-validation.\" On time-series or grouped data that produces an optimistic number that will not survive production.",
      follow: "Your data has one row per transaction and many rows per customer. How do you split?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-07",
      q: "Does classical ML still matter if we are building with LLMs?",
      round: ["tech1", "manager"],
      level: "5-10",
      tags: ["ml-fundamentals", "judgement", "trade-off"],
      why: "Increasingly asked, and the strong answer is specific about where each tool wins.",
      simple:
        "Yes, and the reason is cost and precision rather than nostalgia.\n\n" +
        "For a well-defined task with labelled data - fraud scoring, churn, demand forecasting, document routing at volume - a gradient-boosted model on tabular data is faster, far cheaper, deterministic, and usually more accurate than any prompt. It also gives you a calibrated probability, which an LLM does not.\n\n" +
        "LLMs win where the input is unstructured language, where you have no labelled data, where the task changes weekly, or where the output has to be prose.\n\n" +
        "The pattern that shows real judgement is combining them: an LLM extracts structured fields from a messy document, and a classical model scores those fields. You get the LLM's flexibility on the input and the classical model's precision, calibration and cost profile on the decision.\n\n" +
        "And the sentence worth saying plainly: I have seen teams use an LLM for a binary classification that logistic regression would do better and for a fraction of the cost. Knowing which tool the problem needs is the skill.",
      points: [
        "Labelled tabular task → gradient boosting. Cheaper, faster, deterministic, calibrated.",
        "LLMs win on unstructured language, no labels, fast-changing tasks, prose output.",
        "Classical models give calibrated probabilities. LLMs do not.",
        "Best pattern: LLM extracts structure, classical model scores it.",
        "Using an LLM for a task logistic regression solves is a cost and accuracy mistake."
      ],
      say: "Yes, for cost and precision. On a well-defined task with labels - fraud, churn, forecasting - a gradient-boosted model is faster, far cheaper, deterministic and usually more accurate than a prompt, and it gives a calibrated probability an LLM cannot. LLMs win on unstructured language, no labels, or prose output. The best pattern combines them: the LLM extracts structured fields, a classical model scores them.",
      numbers: "A gradient-boosted model serves predictions in single-digit milliseconds at effectively zero marginal cost. Compare that against a per-token bill before choosing an LLM for a scoring task.",
      wrong: "\"LLMs can do everything now.\" It suggests you would spend a large budget on a problem logistic regression solves better, which is a costly instinct to hire.",
      follow: "Give me a task in our business where you would refuse to use an LLM.",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-08",
      q: "How would you explain a model's decision to a business user?",
      round: ["tech1", "manager"],
      level: "5-10",
      tags: ["ml-fundamentals", "explainability", "communication"],
      why: "Regulated employers require explainability, and it is a communication test as much as a technical one.",
      simple:
        "Separate two questions, because they need different tools and people conflate them.\n\n" +
        "Global: what drives the model overall? Feature importance answers this, and it is what you show a stakeholder deciding whether to trust the system.\n\n" +
        "Local: why this particular decision? That is what a customer or a regulator asks, and it needs a per-prediction method - SHAP values are the usual choice, giving each feature's contribution to this specific outcome.\n\n" +
        "Then translate, because the raw output is not an explanation. \"SHAP value of 0.34 for tenure\" means nothing to anyone. \"This application was declined mainly because the account is four months old and three payments were late; if it were twelve months old the decision would likely change\" is an explanation, and it is also actionable, which is what people actually want.\n\n" +
        "And the honest caveat: these methods explain what the model did, not what is true in the world. Correlation in the features shows up as importance. Saying that distinguishes you from someone who treats SHAP as ground truth.",
      points: [
        "Global explanation - feature importance. For trusting the system.",
        "Local explanation - SHAP per prediction. For explaining one decision.",
        "Translate into plain, actionable language. A SHAP value is not an explanation.",
        "Include what would change the outcome. That is what people want.",
        "These explain the model, not the world. Correlated features look important.",
        "In regulated settings, prefer an inherently interpretable model where accuracy allows."
      ],
      say: "I separate global from local. Globally, feature importance shows what drives the model, which is what a stakeholder needs to trust it. Locally, SHAP gives each feature's contribution to one decision, which is what a customer or regulator asks about. Then I translate into plain language including what would change the outcome. And I am clear that these explain the model, not the world - correlated features look important.",
      numbers: "No number applies. If the setting is regulated, consider whether an interpretable model at slightly lower accuracy is the better trade.",
      wrong: "\"I show them the SHAP plot.\" Handing over a technical artefact is not explaining. The translation is the deliverable.",
      follow: "The model declined a loan and the customer asks why. What exactly do you send them?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
,

    {
      id: "ml-09",
      q: "Explain precision, recall and F1 with a real business trade-off.",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["metrics", "classification", "basics"],
      why: "The most-asked ML question in any loop. Reciting definitions passes nothing - connecting them to a cost does.",
      simple:
        "Take a fraud model. It flags a transaction as fraudulent or not.\n\n" +
        "Precision asks: of everything I flagged, how much was actually fraud? It is the cost of a false alarm.\n\n" +
        "Recall asks: of all the real fraud, how much did I catch? It is the cost of a miss.\n\n" +
        "They pull against each other. Flag everything and recall is perfect while precision collapses. Flag only the one case you are certain of and precision is perfect while recall is near zero.\n\n" +
        "So the question is never 'which is better' - it is which mistake costs more in this business.\n\n" +
        "Fraud detection at a bank: a missed fraud is a direct loss and a regulatory problem, while a false alarm is one annoyed customer and a phone call. Recall wins.\n\n" +
        "A spam filter: a missed spam is mildly irritating, but a legitimate invoice in the junk folder loses real money. Precision wins.\n\n" +
        "A cancer screening test: a miss can be fatal, a false positive is a follow-up scan. Recall wins, heavily.\n\n" +
        "F1 is the harmonic mean of the two, useful as one number when both matter roughly equally. The harmonic mean is deliberately unforgiving - it punishes imbalance, so 0.9 and 0.1 gives about 0.18, not 0.5.",
      points: [
        "Precision: of what I flagged, how much was right. Cost of a false alarm.",
        "Recall: of what was there, how much I caught. Cost of a miss.",
        "They trade against each other - the threshold moves both.",
        "Choose by which error costs the business more, never by default.",
        "F1 is the harmonic mean; it punishes imbalance rather than averaging it."
      ],
      say: "Precision is how much of what I flagged was correct, recall is how much of the real thing I caught, and they trade against each other through the threshold. Which one I optimise depends on cost: for fraud a miss is a direct loss so I favour recall, for a spam filter a false positive buries a real invoice so I favour precision. F1 is the harmonic mean when both matter, and it punishes imbalance rather than averaging it away.",
      numbers: "The harmonic mean is deliberately harsh: precision 0.9 with recall 0.1 gives an F1 near 0.18, not 0.5. That is the point of using it.",
      wrong: "Reciting the two formulas and stopping. The question is always really about the business trade-off, and the follow-up will force it.",
      follow: "Your fraud model has 95% precision and 40% recall. Is that good?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-10",
      q: "What is the ROC curve, and when is PR-AUC the better choice?",
      round: ["tech1", "tech2"],
      level: "2-5",
      tags: ["metrics", "imbalance", "evaluation"],
      why: "Whether you know that ROC-AUC flatters a model on imbalanced data - which is nearly every real problem.",
      simple:
        "A classifier outputs a probability. Sweep the threshold from 0 to 1 and you get a different confusion matrix at every point. ROC plots true positive rate against false positive rate across that sweep, and AUC is the area underneath.\n\n" +
        "AUC has a clean interpretation: the probability that a randomly chosen positive scores higher than a randomly chosen negative. 0.5 is a coin flip, 1.0 is perfect.\n\n" +
        "The problem is the false positive rate. It divides by the number of negatives - and when negatives massively outnumber positives, that denominator is enormous. So a large number of false positives barely moves the rate at all.\n\n" +
        "Concretely: fraud at 0.1% of transactions, one million rows. Your model flags 10,000 legitimate transactions as fraud. That is a swamped, unusable alert queue. But the false positive rate is 10,000 over 999,000 - about 1%. ROC-AUC still looks excellent.\n\n" +
        "The precision-recall curve fixes this because precision divides by what you predicted positive, not by all the negatives. Those 10,000 false alarms hit precision hard and immediately.\n\n" +
        "So the rule: balanced classes, ROC-AUC is fine. Rare positives - fraud, defects, churn, disease, most things anyone actually builds - use PR-AUC. Note also the baseline differs: random ROC-AUC is always 0.5, but random PR-AUC equals the positive rate, so at 0.1% prevalence a PR-AUC of 0.4 is very strong.",
      points: [
        "ROC-AUC: probability a random positive outranks a random negative.",
        "FPR divides by all negatives, so imbalance hides false alarms.",
        "PR-AUC uses precision, which reacts to the alert-queue cost.",
        "Baseline: ROC 0.5 always; PR equals the positive rate.",
        "Rare positives are the normal case - default to PR-AUC there."
      ],
      say: "ROC plots true positive rate against false positive rate as you sweep the threshold, and AUC is the chance a random positive outranks a random negative. The catch is that false positive rate divides by all negatives, so on imbalanced data thousands of false alarms barely move it and the curve looks great. PR-AUC uses precision instead, which reflects the alert-queue cost, so for rare positives that is what I report.",
      numbers: "At 0.1% prevalence, random PR-AUC is 0.001. So a PR-AUC of 0.4 is a strong model, even though the same number would look poor as an ROC-AUC.",
      wrong: "Reporting a 0.97 ROC-AUC on a 1%-positive problem as proof it works. It is the most common way a useless model gets signed off.",
      follow: "Your PR-AUC is 0.4 and the business asks if that is good. Answer them.",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-11",
      q: "How do you pick a classification threshold?",
      round: ["tech1"],
      level: "2-5",
      tags: ["metrics", "thresholds", "deployment"],
      why: "0.5 is a default, not a decision. This checks whether you have deployed a classifier or only trained one.",
      simple:
        "A model outputs 0.73. Is that positive or negative? Only a threshold decides, and 0.5 is just the value the library picked for you.\n\n" +
        "The right way is a cost matrix. Write down what each outcome is worth:\n\n" +
        "    false negative - missed fraud       = ₹8,000 average loss\n" +
        "    false positive - blocked good txn   = ₹200 support cost\n\n" +
        "A miss costs forty times a false alarm, so you should be flagging far more aggressively than 0.5. Sweep the threshold over your validation set, compute total expected cost at each point, and take the minimum. The answer might be 0.15.\n\n" +
        "When you genuinely cannot get costs, use a constraint instead. 'The review team can process 500 alerts a day' sets the threshold by capacity. 'Regulation requires catching 95% of cases' sets it by recall.\n\n" +
        "Two things people forget. Model scores are usually not calibrated - a 0.7 from a boosted tree does not mean 70% likelihood, so do not read the threshold as a probability unless you calibrated it. And the optimal threshold drifts as the base rate changes, so it needs re-checking on a schedule, not setting once.",
      points: [
        "0.5 is a library default, never an analysis.",
        "Build a cost matrix and minimise expected cost on validation data.",
        "No costs available? Use a capacity or regulatory constraint instead.",
        "Raw scores are not calibrated probabilities without calibration.",
        "Re-check the threshold as prevalence drifts."
      ],
      say: "I treat the threshold as a business decision, not a default. I write a cost matrix - what a miss costs against what a false alarm costs - then sweep the threshold on validation data and pick the point minimising expected cost. If costs are not available I use a constraint, like the number of alerts the review team can handle. And I re-check it periodically, because the optimum moves as prevalence drifts.",
      numbers: "If a miss costs 40 times a false alarm, the optimal threshold is far below 0.5 - often around 0.1 to 0.2. Tune it on validation, never on test.",
      wrong: "Reporting metrics at 0.5 and treating that as the model's performance. You are reporting one arbitrary operating point out of a hundred available.",
      follow: "Your threshold was set six months ago. What would make you revisit it?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-12",
      q: "Explain overfitting and every technique you would use against it.",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["basics", "regularisation", "training"],
      why: "The most basic screening question. A structured answer signals organised thinking; a scattered list signals memorisation.",
      simple:
        "Overfitting is when the model learns the noise in your training data instead of the pattern. It looks brilliant on data it has seen and fails on anything new. The signature is a large gap between training and validation performance.\n\n" +
        "The reason it happens is capacity exceeding evidence: the model has more flexibility than the data can constrain, so it uses the spare capacity to memorise.\n\n" +
        "That framing tells you there are exactly three levers, and grouping them this way is what makes the answer sound senior rather than recited.\n\n" +
        "Add data. More examples, or augmentation to synthesise variety. Always the best fix when it is available, because it attacks the cause.\n\n" +
        "Reduce capacity. A simpler model, fewer features, shallower trees, or regularisation - L1 and L2 penalise large weights, dropout randomly disables units so no single path can dominate.\n\n" +
        "Stop early. Watch validation loss and stop when it turns upward while training loss is still falling. That turning point is the moment memorisation begins.\n\n" +
        "The one people forget: cross-validation does not prevent overfitting, it detects it. And if you tune hyperparameters against your test set, you have overfit the test set too - which is why you keep a third split you touch once.",
      points: [
        "Symptom: training performance far above validation.",
        "Cause: model capacity exceeds what the data can constrain.",
        "Three levers - more data, less capacity, early stopping.",
        "Cross-validation detects overfitting; it does not prevent it.",
        "Tuning against the test set overfits the test set."
      ],
      say: "Overfitting is learning noise rather than signal, and the symptom is training performance far above validation. The cause is capacity exceeding the evidence, which gives you three levers: add data or augment it, reduce capacity through a simpler model or regularisation like L2 and dropout, or stop early when validation loss turns up. Cross-validation detects it rather than preventing it, and tuning on the test set overfits that too.",
      numbers: "A validation gap of a few percent is normal. Training accuracy at 99% with validation at 70% means memorisation, not learning.",
      wrong: "Listing techniques with no organising idea - 'dropout, regularisation, more data, early stopping'. Correct, and it sounds like a flashcard rather than understanding.",
      follow: "Training and validation loss are both high and flat. Is that overfitting?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-13",
      q: "L1 against L2 regularisation - what is the geometric intuition?",
      round: ["tech1", "tech2"],
      level: "2-5",
      tags: ["regularisation", "theory", "feature-selection"],
      why: "Whether you understand why L1 zeroes coefficients rather than just knowing that it does.",
      simple:
        "Both add a penalty on coefficient size. L1 penalises absolute values, L2 penalises squares. The consequence differs sharply: L1 drives coefficients to exactly zero, L2 shrinks them toward zero but never quite there.\n\n" +
        "The geometry explains why, and it is worth being able to draw.\n\n" +
        "Picture two coefficients on a plane. The penalty constrains you to a region around the origin. For L2 that region is a circle. For L1 it is a diamond - a square rotated 45 degrees, with corners sitting on the axes.\n\n" +
        "Your loss function forms contours expanding outward from the unconstrained best fit. The solution is where those contours first touch the constraint region.\n\n" +
        "A circle has no corners, so the touch point lands almost anywhere - generally with both coefficients small but non-zero.\n\n" +
        "A diamond has sharp corners, and those corners lie exactly on the axes. Expanding contours are disproportionately likely to hit a corner first. A corner means one coefficient is exactly zero. That is the whole mechanism.\n\n" +
        "So the practical choice: L1 when you want feature selection and a sparse, explainable model. L2 when features are correlated and you want the weight spread across them rather than arbitrarily assigned to one. Elastic net combines both. And with correlated features L1 picks one essentially at random, which makes it unstable across retrains - worth knowing before you build a story on which features it selected.",
      points: [
        "L1 penalises absolute value; L2 penalises squares.",
        "L1's constraint region is a diamond with corners on the axes.",
        "Contours hit a corner first, so a coefficient becomes exactly zero.",
        "L2's circular region has no corners - shrinkage without sparsity.",
        "L1 with correlated features picks one arbitrarily; it is unstable."
      ],
      say: "L1 penalises absolute values and L2 penalises squares, and the geometry explains the difference. L1's constraint region is a diamond whose corners sit on the axes, so the expanding loss contours tend to touch at a corner, which means a coefficient is exactly zero. L2's region is a circle with no corners, so it shrinks without zeroing. I use L1 for feature selection and L2 for correlated features.",
      numbers: "Tune the strength on validation across a log scale. With correlated features, L1's selection can change between retrains - check stability before reporting it.",
      wrong: "'L1 gives sparsity, L2 does not.' True and shallow. The follow-up is always why, and the geometry is the answer.",
      follow: "Two features are almost perfectly correlated. What does L1 do?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-14",
      q: "Explain gradient descent and its variants.",
      round: ["tech1"],
      level: "2-5",
      tags: ["optimisation", "training", "basics"],
      why: "Foundational, and it connects directly to why transformer training works the way it does.",
      simple:
        "You are on a hillside in fog and want the valley. You feel which way the ground slopes and step downhill. Repeat. That is gradient descent - the gradient is the slope of the loss with respect to each weight, and you step against it.\n\n" +
        "The variants differ only in how much data you use to estimate the slope before stepping.\n\n" +
        "Batch gradient descent uses the whole dataset per step. The direction is accurate but you take one step per full pass, which is impossibly slow at scale.\n\n" +
        "Stochastic uses one example. Very fast, very noisy - you stagger downhill rather than walking.\n\n" +
        "Mini-batch uses 32 to 512 examples. Accurate enough, and it maps onto how GPUs actually work. This is what everyone uses.\n\n" +
        "Then the improvements, each fixing a specific failure.\n\n" +
        "Momentum: keep a running average of recent gradients, so you build speed in consistent directions and damp oscillation across a narrow valley.\n\n" +
        "Adaptive learning rates: give each parameter its own step size, so rarely-updated parameters can still move.\n\n" +
        "Adam combines both and is the sensible default for deep learning. AdamW fixes how Adam handled weight decay and is what transformers actually train with.\n\n" +
        "The one hyperparameter that matters most is the learning rate. Too high and the loss diverges; too low and training stalls. Warmup and a decay schedule are standard for exactly that reason.",
      points: [
        "Step against the gradient of the loss.",
        "Batch, stochastic, mini-batch differ in data used per step.",
        "Momentum damps oscillation; adaptive rates fix per-parameter scale.",
        "AdamW is the transformer default.",
        "Learning rate is the hyperparameter that decides success."
      ],
      say: "Gradient descent steps the weights against the gradient of the loss. The variants differ in how much data estimates that gradient - mini-batch is the practical choice because it balances a stable direction with GPU efficiency. Momentum averages recent gradients to damp oscillation, adaptive methods give each parameter its own step size, and AdamW combines both and is the transformer default. Learning rate is the hyperparameter that decides whether it works.",
      numbers: "Typical fine-tuning learning rates are 1e-5 to 5e-5; pre-training uses higher with warmup. A diverging loss almost always means the learning rate is too high.",
      wrong: "Describing gradient descent and stopping. The question is nearly always really about why Adam is the default, so go there yourself.",
      follow: "Your loss is oscillating rather than decreasing. What do you change?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-15",
      q: "What is the vanishing gradient problem and how was it solved?",
      round: ["tech1", "tech2"],
      level: "2-5",
      tags: ["deep-learning", "training", "theory"],
      why: "It explains three design choices in every transformer - a clean bridge from classical ML to what you build now.",
      simple:
        "Backpropagation multiplies gradients layer by layer on the way back. Multiply many numbers smaller than one and the result collapses toward zero. So early layers receive almost no gradient and effectively stop learning. That is vanishing gradients, and it is why deep networks were nearly untrainable before about 2012.\n\n" +
        "Sigmoid and tanh made it worse: their derivative is at most 0.25, so every layer shrank the gradient by at least four times. Ten layers and the signal is gone.\n\n" +
        "Three fixes, and you can point at all three inside a transformer.\n\n" +
        "ReLU. Its derivative is exactly 1 for positive inputs, so the gradient passes through unshrunk. The activation change alone made much deeper networks trainable.\n\n" +
        "Residual connections. Add the input back to the output of each block, and the gradient gets an unobstructed path around the block. This is what makes hundred-layer networks work, and it is why every transformer block has a skip connection.\n\n" +
        "Normalisation. Layer norm keeps activations in a sane range so gradients neither vanish nor explode. Pre-norm placement - normalising before the sublayer rather than after - improved stability further, which is why modern transformers use it.\n\n" +
        "The mirror problem is exploding gradients, where values grow instead of shrink. That one is handled with gradient clipping, which is standard in LLM training scripts.",
      points: [
        "Gradients multiply backwards; values under 1 collapse toward zero.",
        "Sigmoid and tanh have a maximum derivative of 0.25 - a guaranteed shrink.",
        "ReLU passes gradient unchanged for positive inputs.",
        "Residual connections give gradients a path around each block.",
        "Normalisation stabilises the scale; clipping handles the exploding case."
      ],
      say: "Backpropagation multiplies gradients layer by layer, so values below one collapse and early layers stop learning. Sigmoid made it worse because its derivative caps at 0.25. Three fixes solved it: ReLU passes gradient through unchanged, residual connections give the gradient a path around each block, and normalisation holds activations in range. All three are visible in a transformer block, which is why depth stopped being the limit.",
      numbers: "Sigmoid's maximum derivative is 0.25, so ten layers shrink the gradient by at least a million times. Gradient clipping around 1.0 is standard for the exploding case.",
      wrong: "Naming ReLU alone. Residual connections are the more important fix at real depth, and skipping them misses the link to transformers.",
      follow: "Where do you see all three of those fixes in a transformer block?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-16",
      q: "How do decision trees split, and what does a random forest add?",
      round: ["tech1"],
      level: "2-5",
      tags: ["trees", "ensembles", "basics"],
      why: "Trees still win on tabular data, and this is the base for the boosting question that follows.",
      simple:
        "A decision tree asks a series of yes-or-no questions about features. At each node it picks the split that best separates the classes.\n\n" +
        "'Best' means the largest drop in impurity. Gini impurity is the chance of misclassifying a random sample if you labelled it by the node's distribution - zero when a node is pure. Entropy measures the same idea in information terms. They almost always choose the same splits; Gini is marginally cheaper, which is why it is the default.\n\n" +
        "The tree evaluates every feature and every candidate threshold, takes the best split, and recurses.\n\n" +
        "The problem is that a single tree overfits badly. Grown deep, it isolates individual training rows and memorises the data. It is also unstable - change a few rows and you get a visibly different tree.\n\n" +
        "A random forest fixes this with two sources of randomness.\n\n" +
        "Bagging: train each tree on a bootstrap sample, so every tree sees a different resample of the data.\n\n" +
        "Feature subsampling: at each split, consider only a random subset of features. This is the crucial one - without it, one strong feature would sit at the root of every tree and they would all be nearly identical, so averaging would gain nothing.\n\n" +
        "Then average the predictions. Individual trees are high-variance but roughly unbiased, and averaging many decorrelated high-variance estimates cuts variance without adding bias. That is the whole argument.",
      points: [
        "Splits maximise impurity reduction - Gini or entropy.",
        "A single deep tree memorises and is unstable.",
        "Bagging: each tree trains on a bootstrap resample.",
        "Feature subsampling decorrelates the trees - the essential part.",
        "Averaging decorrelated high-variance trees cuts variance, not bias."
      ],
      say: "A tree picks the split that most reduces impurity, measured by Gini or entropy, then recurses. A single deep tree memorises and is unstable. A random forest trains each tree on a bootstrap sample and restricts each split to a random feature subset - that second part is what decorrelates them, otherwise one dominant feature sits at every root. Averaging decorrelated high-variance trees cuts variance without adding bias.",
      numbers: "Feature subsampling defaults to the square root of the feature count for classification. More trees never overfits a forest - it just stops improving, typically past a few hundred.",
      wrong: "'It builds many trees and averages them.' It misses feature subsampling, which is the mechanism that makes averaging worth anything.",
      follow: "Why does adding more trees to a forest not cause overfitting?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-17",
      q: "Explain gradient boosting. Why does XGBoost still win on tabular data?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["boosting", "ensembles", "tabular"],
      why: "The honest answer to 'which model would you actually use' for structured data, in an LLM-heavy interview.",
      simple:
        "Random forests build trees in parallel and average them. Boosting builds them in sequence, and each new tree is trained to correct what the current ensemble got wrong.\n\n" +
        "Concretely: fit a shallow tree, compute the residual errors, fit the next tree to predict those residuals, add it in at a small learning rate, repeat. Each round nudges the ensemble toward the errors it has not yet fixed. Formally each tree fits the negative gradient of the loss, which is where the name comes from.\n\n" +
        "The trees are deliberately weak - depth 3 to 6. Boosting a series of weak learners beats boosting strong ones, because strong learners overcorrect and the sequence overfits fast.\n\n" +
        "XGBoost adds regularisation on tree complexity, second-order gradient information, native missing-value handling that learns a default direction per split, and an implementation engineered for cache efficiency. LightGBM and CatBoost make different trade-offs - leaf-wise growth, and native categorical handling respectively.\n\n" +
        "Why it still wins on tabular data: tabular features are heterogeneous - a rupee amount, a category, a count, a date - with no spatial or sequential structure for a neural network to exploit. Trees handle mixed types and non-linear thresholds natively, need little preprocessing, and are extremely sample-efficient. Deep learning has repeatedly failed to beat boosted trees on medium-sized tabular problems, and that remains true.\n\n" +
        "The trade against a forest: boosting is more accurate but genuinely overfits with too many rounds, so early stopping on a validation set is not optional.",
      points: [
        "Sequential: each tree fits the current ensemble's errors.",
        "Weak learners, depth 3 to 6, with a small learning rate.",
        "Forests reduce variance; boosting reduces bias.",
        "Boosting does overfit - early stopping is mandatory.",
        "Tabular data has no structure for a network to exploit; trees win."
      ],
      say: "Boosting builds trees sequentially, each fitting the residual errors of the current ensemble at a small learning rate - formally the negative gradient of the loss. The trees are deliberately shallow, because strong learners overcorrect. Against a forest it reduces bias rather than variance, so it is more accurate but genuinely overfits and needs early stopping. It still wins on tabular data because mixed feature types have no structure a network can exploit.",
      numbers: "Learning rate 0.05 to 0.1, depth 3 to 6, with early stopping on validation. Lower learning rate needs more rounds and usually generalises slightly better.",
      wrong: "Saying deep learning has superseded it. On medium-sized tabular problems boosted trees still win, and claiming otherwise signals you have not worked with real tabular data.",
      follow: "Your boosted model scores 0.99 on training and 0.72 on validation. What happened?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-18",
      q: "Bagging against boosting - bias or variance?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["ensembles", "bias-variance", "basics"],
      why: "A quick check that the bias-variance frame is a tool you use, not a phrase you repeat.",
      simple:
        "Both combine many weak models. They attack opposite problems.\n\n" +
        "Bagging trains models in parallel on bootstrap resamples and averages them. Averaging independent estimates reduces variance and leaves bias roughly unchanged - the average of many unbiased estimators is still unbiased, just more stable. So bagging is for models that are individually accurate but unstable. Deep trees are exactly that, which is why random forests work.\n\n" +
        "Boosting trains models in sequence, each fixing the previous ensemble's errors. That systematically attacks bias - the ensemble becomes able to represent patterns no single weak learner could. So boosting starts from deliberately underfit stumps and builds capacity.\n\n" +
        "The one-line version: bagging makes unstable models stable, boosting makes weak models strong.\n\n" +
        "The practical consequences follow directly. Bagging is parallel, so it trains fast on many cores; boosting is sequential and cannot be parallelised the same way. More trees never hurt a bagged forest, but too many boosting rounds will overfit. And bagging is far more forgiving of hyperparameters, which is why a random forest is a good first baseline and a tuned boosted model is usually the final one.",
      points: [
        "Bagging: parallel on resamples, reduces variance.",
        "Boosting: sequential on errors, reduces bias.",
        "Bagging stabilises unstable models; boosting strengthens weak ones.",
        "Extra trees are harmless in bagging, dangerous in boosting.",
        "Forest as the quick baseline; boosting for the tuned final model."
      ],
      say: "Bagging trains models in parallel on bootstrap resamples and averages them, which reduces variance while leaving bias roughly unchanged - so it suits deep trees that are accurate but unstable. Boosting trains sequentially with each model fixing the previous errors, which attacks bias, so it starts from deliberately weak stumps. Practically, more trees never hurt a forest but too many boosting rounds overfit, so boosting needs early stopping.",
      numbers: "A forest with 500 trees needs almost no tuning. A boosted model with 500 rounds and no early stopping is very likely overfit.",
      wrong: "Getting them backwards, which happens often under pressure. Anchor on the mechanism - averaging reduces variance, sequential correction reduces bias.",
      follow: "You have one afternoon and a tabular dataset. Which do you reach for?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-19",
      q: "Explain k-means and how you choose k.",
      round: ["tech1"],
      level: "2-5",
      tags: ["clustering", "unsupervised", "basics"],
      why: "The standard unsupervised question, and its assumptions matter directly for embedding clustering.",
      simple:
        "Pick k centres. Assign each point to its nearest centre. Move each centre to the mean of its assigned points. Repeat until nothing moves. It always converges, though not necessarily to the best solution.\n\n" +
        "Choosing k is the real question, and there is no clean answer.\n\n" +
        "The elbow method plots within-cluster variance against k. It always falls as k rises, so you look for the bend where improvement slows. In practice the bend is often ambiguous.\n\n" +
        "Silhouette score measures how much closer a point is to its own cluster than to the next nearest, from -1 to 1. It gives a real optimum rather than a judgement call, so prefer it.\n\n" +
        "Often the honest answer is that the business chooses k. Five customer segments because the marketing team can run five campaigns.\n\n" +
        "Now the assumptions, which is where a senior answer separates. k-means assumes clusters are roughly spherical, similar in size, and separated by Euclidean distance. Elongated or crescent-shaped clusters break it. It is sensitive to feature scale, so standardise first or the largest-range feature dominates. It is sensitive to initialisation - use k-means++ and multiple restarts. And it forces every point into a cluster, so outliers drag centres around.\n\n" +
        "For embeddings specifically: high-dimensional vectors on a normalised sphere are better served by cosine distance, so either normalise and use spherical k-means, or use HDBSCAN, which finds arbitrary shapes and can label outliers as noise.",
      points: [
        "Assign to nearest centre, move centres to the mean, repeat.",
        "Silhouette gives a real optimum; the elbow is often ambiguous.",
        "Assumes spherical, similar-sized, Euclidean-separated clusters.",
        "Standardise features; use k-means++ and multiple restarts.",
        "For embeddings prefer cosine, or HDBSCAN for arbitrary shapes."
      ],
      say: "k-means alternates assigning points to the nearest centre and moving centres to the mean until it converges. For k I prefer silhouette score over the elbow, because the elbow is usually ambiguous, and often the business constrains k anyway. The important part is the assumptions: spherical, similar-sized clusters under Euclidean distance, sensitive to scale and initialisation. For embeddings I would use cosine distance or HDBSCAN instead.",
      numbers: "Always standardise before k-means. Use k-means++ with around ten restarts - a single random initialisation regularly lands in a poor local optimum.",
      wrong: "Describing the algorithm with no mention of assumptions. The follow-up is always about where it fails, and shape and scale are the answers.",
      follow: "You cluster 100k document embeddings and get one huge cluster. What went wrong?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-20",
      q: "What is PCA and when would you use it?",
      round: ["tech1"],
      level: "2-5",
      tags: ["dimensionality", "unsupervised", "embeddings"],
      why: "Connects classical ML to embedding work, where dimensionality is a live cost concern.",
      simple:
        "PCA finds the directions along which your data varies most, and re-expresses the data in terms of those directions. The first component captures the most variance, the second the most of what remains while being perpendicular to the first, and so on. Keep the first few and you have fewer dimensions holding most of the information.\n\n" +
        "Geometrically it is a rotation of the axes to align with the shape of the data, then dropping the axes where the data barely varies.\n\n" +
        "Choose the number of components by cumulative explained variance - keep enough to reach 95%, say - rather than picking a round number.\n\n" +
        "Where it genuinely helps: compressing embeddings for cheaper storage and faster search, removing multicollinearity before a linear model, denoising, and 2D visualisation.\n\n" +
        "The costs are real. Components are linear combinations of every original feature, so you lose interpretability entirely - you can no longer say which feature drove a prediction. It only captures linear structure. It is scale-sensitive, so standardise first or the largest-unit feature dominates the first component. And it is unsupervised, so a low-variance direction that happens to be exactly what predicts your target can be discarded.\n\n" +
        "For embeddings specifically, PCA works but Matryoshka embeddings are usually better if the model supports them, since they are trained so that truncating dimensions degrades gracefully - no separate transform to fit, store and version.",
      points: [
        "Rotates axes onto directions of maximum variance, then truncates.",
        "Choose components by cumulative explained variance, not a round number.",
        "Standardise first - PCA is scale-sensitive.",
        "Unsupervised: it can discard a low-variance but predictive direction.",
        "For embeddings, Matryoshka truncation often beats fitting a PCA."
      ],
      say: "PCA rotates the axes onto the directions of greatest variance and keeps the first few, so you hold most of the information in fewer dimensions. I choose the count by cumulative explained variance rather than a round number, and I standardise first because it is scale-sensitive. The costs are losing interpretability and only capturing linear structure. For embeddings I would check Matryoshka truncation first, since it needs no fitted transform.",
      numbers: "95% explained variance is a common cutoff. Embeddings often keep most retrieval quality at half their dimensions - but measure recall, do not assume it.",
      wrong: "Calling it feature selection. It is feature extraction - every component mixes all the original features, which is exactly why interpretability disappears.",
      follow: "Does PCA help your model's accuracy?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-21",
      q: "How do you handle missing data?",
      round: ["tech1"],
      level: "2-5",
      tags: ["data", "preprocessing", "basics"],
      why: "The mechanism behind the missingness decides the method - that reasoning is what is being tested.",
      simple:
        "Before choosing a technique, ask why the data is missing. That determines everything.\n\n" +
        "Missing completely at random: a sensor dropped readings for unrelated reasons. Dropping rows is safe here, just wasteful.\n\n" +
        "Missing at random: missingness depends on other observed variables - a survey question skipped more often by younger respondents. You can impute using those other variables.\n\n" +
        "Missing not at random: missingness depends on the unobserved value itself. High earners decline to state income. This is the dangerous case, because any imputation is systematically biased and the fact of missingness is itself information.\n\n" +
        "Then the methods. Dropping rows is fine for a few percent and destructive beyond that. Dropping a column makes sense past roughly half missing. Mean or median imputation is quick but shrinks variance and distorts correlations. Model-based imputation using the other features is better but risks leakage if fitted before splitting.\n\n" +
        "The technique people forget, and the one that most often wins: add a binary was-missing indicator alongside the imputed value. In the not-at-random case that flag frequently carries more signal than the value would have. A blank income field is a genuine predictor.\n\n" +
        "And boosted trees handle missing values natively by learning a default direction per split, so for tabular work the best answer is often to impute nothing and let the model decide.",
      points: [
        "Diagnose the mechanism first - MCAR, MAR or MNAR.",
        "MNAR is the dangerous case; imputation there is biased by construction.",
        "Mean imputation shrinks variance and distorts correlation.",
        "Add a was-missing indicator - often the strongest signal available.",
        "XGBoost and LightGBM handle missingness natively; use that."
      ],
      say: "I start with why it is missing, because that decides the method. Completely at random means dropping is safe; at random means I can impute from other features; not at random means any imputation is biased and the missingness itself carries signal. In that case I add a was-missing indicator, which is frequently more predictive than the value. For tabular models I often let XGBoost handle it natively rather than imputing at all.",
      numbers: "Under about 5% missing, dropping rows is usually fine. Past roughly 50% in a column, drop the column and keep the indicator.",
      wrong: "'Fill with the mean.' It is the reflex answer, it shrinks variance, distorts relationships, and throws away the information that the value was absent.",
      follow: "Income is missing for 30% of rows, mostly high earners. What do you do?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-22",
      q: "What is feature engineering and does it still matter?",
      round: ["tech1"],
      level: "2-5",
      tags: ["features", "tabular", "practice"],
      why: "Tests calibration. The answer is genuinely split by data type, and a blanket answer either way is wrong.",
      simple:
        "Feature engineering is constructing inputs that expose the pattern to the model. Not new information - a better representation of information you already have.\n\n" +
        "The honest answer is that it depends entirely on the data type, and saying so is the point.\n\n" +
        "For unstructured data - text, images, audio - it is largely over. Deep learning learns representations from raw input better than hand-crafted features ever did. Nobody engineers n-gram features for text classification any more; you use an embedding.\n\n" +
        "For tabular data it absolutely still matters, and it is usually where the accuracy actually comes from. A gradient-boosted model cannot invent a ratio. Give it revenue and headcount separately and it must approximate revenue-per-employee through many splits; give it the ratio directly and one split captures it.\n\n" +
        "The high-value moves on tabular data: ratios and differences between related columns, aggregations over an entity such as a customer's mean transaction and their count over 30 days, time-since-last-event, cyclical encoding of hour and weekday as sine and cosine so 23:00 and 01:00 are close, and target encoding for high-cardinality categories - computed inside the cross-validation fold, or you leak.\n\n" +
        "In GenAI work the same instinct reappears with a different name. Choosing what goes into a chunk, what metadata you attach, how you structure a prompt - that is feature engineering for LLMs. The retrieved context is the feature vector.",
      points: [
        "Largely superseded for text, images and audio.",
        "Still decisive for tabular data - models cannot invent ratios.",
        "Ratios, aggregations, time-since, cyclical encodings.",
        "Target encoding must be computed inside the fold or it leaks.",
        "Chunk design and prompt structure are its GenAI equivalent."
      ],
      say: "It depends on the data type. For text and images, learned representations beat hand-crafted features, so it is largely over. For tabular data it is still where most of the accuracy comes from - a boosted model cannot invent a ratio, so giving it revenue per employee directly beats making it approximate that through splits. Ratios, entity aggregations and time-since features are the reliable wins, with target encoding computed inside the fold.",
      numbers: "On tabular problems, good feature engineering routinely beats model choice. Moving from logistic regression to XGBoost often gains less than adding the right ten features.",
      wrong: "'Deep learning made it obsolete.' True for unstructured data and wrong for tabular, which is most of what enterprises actually run.",
      follow: "Give me three features you would build for a churn model.",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-23",
      q: "Explain the difference between correlation and causation with a work example.",
      round: ["tech1", "manager"],
      level: "2-5",
      tags: ["statistics", "reasoning", "stakeholders"],
      why: "Tests whether you can stop a business from acting on a spurious pattern - a senior responsibility.",
      simple:
        "Correlation says two things move together. Causation says changing one changes the other. Models learn the first and stakeholders assume the second, and that gap is where expensive decisions go wrong.\n\n" +
        "A concrete case. A churn model finds that customers who contact support are far more likely to churn. The eager conclusion: support contact drives churn, so reduce support contact.\n\n" +
        "That is backwards. Customers contact support because they already have a problem. The problem drives both the contact and the churn - support is a symptom, not a cause. Act on the correlation and you remove the one channel that was helping, and churn gets worse.\n\n" +
        "Three ways correlation appears without causation. A confounder influences both, as above. Reverse causality - the effect causes the predictor. And selection effects, where how the data was collected creates the pattern.\n\n" +
        "Prediction and intervention are genuinely different problems. Support contact is a perfectly good predictor of churn - it earns its place in the model. It is simply useless as a lever. That distinction is the point worth making out loud.\n\n" +
        "To establish causation you need an experiment: randomise who gets the intervention and compare. When you cannot randomise, quasi-experimental methods like difference-in-differences give you something weaker but real. The practical habit is to ask 'are we predicting or intervening?' before anyone acts on a feature importance chart.",
      points: [
        "Models learn association; stakeholders hear causation.",
        "Confounders, reverse causality and selection all produce it.",
        "A useful predictor can be a useless lever.",
        "Only randomised experiments establish causation cleanly.",
        "Ask whether the decision is prediction or intervention."
      ],
      say: "Correlation means two things move together; causation means changing one changes the other. A churn model showing support contacts predict churn does not mean reducing support helps - the underlying problem drives both, so support is a symptom. A feature can be a strong predictor and a useless lever. Before anyone acts on feature importance I ask whether we are predicting or intervening, because only an experiment answers the second.",
      numbers: "Feature importance measures predictive contribution, not causal effect. Presenting it as a to-do list of interventions is a common and costly mistake.",
      wrong: "Reaching for ice cream and drowning. It shows you know the concept and not that you can apply it - use an example from work.",
      follow: "The business wants to act on your top feature. How do you respond?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-24",
      q: "What is a p-value, and what does it not mean?",
      round: ["tech2"],
      level: "5-10",
      tags: ["statistics", "ab-testing", "evaluation"],
      why: "Almost everyone gets the definition subtly wrong, and it matters for every A/B test you will run.",
      simple:
        "A p-value is the probability of seeing a result at least as extreme as yours, assuming the null hypothesis is true. That conditional - assuming the null is true - is the entire concept.\n\n" +
        "What it is not, and these are the errors that get corrected in interviews:\n\n" +
        "It is not the probability that the null hypothesis is true. It assumes the null and asks about the data, not the reverse.\n\n" +
        "It is not the probability your result was a fluke.\n\n" +
        "It says nothing about effect size. With a million users, a 0.01% lift is highly significant and commercially worthless. Report the effect size and its confidence interval, always.\n\n" +
        "And p above 0.05 is not evidence of no effect. It means you did not detect one, which is often just insufficient power.\n\n" +
        "Then the practical traps. Peeking - checking daily and stopping when it crosses 0.05 - massively inflates your false positive rate, because you gave yourself many chances. Fix the sample size in advance, or use a sequential test designed for it. Multiple comparisons: test twenty metrics at 0.05 and you expect one false positive by chance, so correct for it. And 0.05 is a convention, not a law of nature.\n\n" +
        "The senior habit is to lead with the confidence interval instead. 'A 3% lift, interval 1% to 5%' tells a stakeholder both direction and precision, which a p-value alone never does.",
      points: [
        "P(data this extreme | null is true) - the conditional is the point.",
        "Not the probability the null is true, and not a fluke probability.",
        "Significance is not effect size; large n makes trivia significant.",
        "Peeking inflates false positives - fix n in advance.",
        "Lead with the confidence interval, not the p-value."
      ],
      say: "A p-value is the probability of data at least this extreme assuming the null is true. It is not the probability the null is true, and it says nothing about effect size - at large sample sizes a commercially meaningless lift is highly significant. The practical traps are peeking, which inflates false positives, and multiple comparisons. I lead with the effect size and confidence interval, because that tells a stakeholder direction and precision.",
      numbers: "Fix the sample size before starting. Testing twenty metrics at 0.05 yields roughly one false positive by chance - correct for it or expect to chase noise.",
      wrong: "'It is the probability the result happened by chance.' It is the near-universal phrasing and it is the definition inverted.",
      follow: "Your test hits p = 0.04 on day three. Do you ship?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-25",
      q: "How do you design an A/B test - sample size, duration, guardrail metrics?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["ab-testing", "experimentation", "statistics"],
      why: "Every model change needs an experiment. Design flaws are invisible until the result is already wrong.",
      simple:
        "Start with the decision, not the metric. What will you do differently depending on the result? If nothing changes either way, do not run the test.\n\n" +
        "Then one primary metric, fixed in advance. Choosing afterwards from ten metrics guarantees a winner by chance.\n\n" +
        "Sample size comes before launch, from three inputs: current baseline rate, the minimum lift worth detecting, and your power - conventionally 80% at 5% significance. The relationship worth internalising is that halving the detectable effect quadruples the sample needed. That is why detecting a 1% lift is so much more expensive than a 5% one, and it is usually the fact that reshapes the plan.\n\n" +
        "Duration must cover at least one full weekly cycle, because weekday and weekend users behave differently. Two weeks is a common default. Run to the planned sample size and stop - no peeking.\n\n" +
        "Guardrail metrics are the ones you are not trying to improve but refuse to damage: latency, error rate, cost per request, support volume. A GenAI feature that lifts engagement while doubling latency and cost is not a win, and without guardrails you would ship it.\n\n" +
        "Then the validity checks. Randomise at the level of the decision unit - user, not request, or the same person sees both variants. Run an A/A test to confirm the framework reports no difference when there is none. Check for a sample ratio mismatch: if a 50/50 split arrives 52/48, the assignment is broken and the result is untrustworthy.\n\n" +
        "For GenAI specifically, latency and cost per request are mandatory guardrails, and quality needs an eval-based measure alongside behavioural metrics.",
      points: [
        "Decide the action first; fix one primary metric in advance.",
        "Halving the detectable effect quadruples the required sample.",
        "Cover a full weekly cycle - two weeks is a sane default.",
        "Guardrails: latency, error rate, cost, support volume.",
        "Check A/A and sample ratio mismatch before trusting anything."
      ],
      say: "I fix the decision and one primary metric first, then compute sample size from the baseline rate, the minimum lift worth detecting and 80% power - remembering that halving the detectable effect quadruples the sample. I run at least a full weekly cycle and do not peek. I always set guardrails on latency, cost and error rate, because a GenAI feature that lifts engagement while doubling cost is not a win. Then I verify with an A/A test and a sample ratio check.",
      numbers: "80% power at 5% significance is standard. Two weeks minimum duration. A 50/50 split arriving at 52/48 signals broken assignment - investigate before reading the result.",
      wrong: "Running until the result looks good. It is peeking with extra steps, and it produces a stream of exciting findings that never replicate.",
      follow: "The primary metric is flat but a secondary one is up 8%. What do you conclude?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-26",
      q: "Explain data drift against concept drift and how you detect each.",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["monitoring", "drift", "production"],
      why: "The vocabulary for why a model silently decays, and it applies directly to GenAI monitoring.",
      simple:
        "Both mean your model is quietly getting worse. They have different causes and different fixes.\n\n" +
        "Data drift is the input distribution changing while the underlying relationship holds. You launch in three cities, expand to fifteen, and the incoming customer profile no longer resembles your training data. The mapping from features to outcome is unchanged - you are just extrapolating into regions you never saw. Retraining on recent data fixes it.\n\n" +
        "Concept drift is the relationship itself changing. What predicted fraud in 2024 does not predict it in 2026, because fraudsters adapted. Your inputs may look identical while the correct answer for the same input has changed. This is worse, because retraining only helps once you have enough newly-labelled data reflecting the new reality - and that means waiting for the labels.\n\n" +
        "Detection differs accordingly. Data drift is detectable immediately without labels: compare recent feature distributions against training, using population stability index or a KS test per feature. Concept drift needs outcome labels, so you can only see it once ground truth arrives - which for churn might be ninety days later.\n\n" +
        "That lag is why you monitor proxies too: prediction distribution shifts, confidence dropping, or the rate of manual overrides climbing. A sudden change in the share of positive predictions is an early warning that costs nothing to watch.\n\n" +
        "For GenAI the same split applies. Data drift is users asking different questions than you designed for. Concept drift is the correct answer changing because the underlying policy changed - and your RAG index still serves the old document.",
      points: [
        "Data drift: inputs change, relationship holds. Retraining fixes it.",
        "Concept drift: the relationship changes. Needs new labels.",
        "Data drift is detectable without labels - PSI or KS per feature.",
        "Concept drift only shows once ground truth arrives.",
        "Watch prediction distribution and override rate as early proxies."
      ],
      say: "Data drift is the input distribution moving while the relationship holds - you expand to new cities and see customers unlike your training data. Retraining fixes that. Concept drift is the relationship itself changing, like fraud patterns adapting, and that needs newly-labelled data, so it is harder. I detect data drift without labels using PSI or a KS test per feature, and watch prediction distribution and override rates as proxies while waiting for ground truth.",
      numbers: "PSI below 0.1 is stable, 0.1 to 0.2 warrants attention, above 0.2 is significant drift. Alert on the features the model actually weights, not on all of them.",
      wrong: "Treating them as one thing. They have different detection methods and different remedies, and conflating them means monitoring for the easy one and missing the dangerous one.",
      follow: "Feature distributions are unchanged but accuracy fell 8 points. Which is it?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-27",
      q: "What is a feature store and do you need one?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["mlops", "features", "architecture"],
      why: "The honest answer is usually no, and knowing when it is yes shows real production judgement.",
      simple:
        "A feature store is a central place where features are defined once, computed, stored, and served to both training and inference.\n\n" +
        "The problem it exists to solve is train-serve skew. Your training pipeline computes a customer's 30-day average transaction in a Spark job. Your serving code recomputes it in Python from a different table. The two definitions drift apart - a boundary handled differently, a filter applied in one and not the other - and the model receives inputs at serving time that differ subtly from training. Accuracy degrades and nothing in your monitoring explains it.\n\n" +
        "A feature store fixes this by making one definition the only definition, serving offline for training and online for inference from the same computation.\n\n" +
        "It also handles point-in-time correctness, which is the harder problem. When building training data you must use the feature value as it was at the moment of the event, not today's value. Doing this by hand with joins is where subtle label leakage creeps in, and a feature store does it for you.\n\n" +
        "So when do you need one? When multiple teams reuse the same features, when you serve real-time predictions with strict latency, or when point-in-time joins have already burned you.\n\n" +
        "When do you not? Most of the time. One team, batch predictions, a handful of models - a feature store is significant infrastructure to run, and a shared feature-computation library with tests gives you most of the benefit for a fraction of the cost. Saying that plainly is the senior answer; reaching for it by default is not.",
      points: [
        "Solves train-serve skew by making one definition authoritative.",
        "Handles point-in-time correctness, which prevents subtle leakage.",
        "Serves the same features offline for training and online for inference.",
        "Justified by multi-team reuse or real-time serving.",
        "For one team doing batch, a shared library is usually enough."
      ],
      say: "A feature store defines features once and serves them to both training and inference, which solves train-serve skew - the same feature computed by two different pipelines that quietly diverge. It also handles point-in-time correctness so training rows use the value as of the event, which prevents leakage. It is worth it for multi-team reuse or real-time serving. For one team doing batch predictions, a shared computation library is usually enough.",
      numbers: "Online serving typically needs feature retrieval in single-digit milliseconds, which is why the online store is a key-value store rather than a warehouse.",
      wrong: "Recommending one for every project. It is heavy infrastructure, and proposing it for a single batch model signals resume-driven design.",
      follow: "How would you get point-in-time correctness without a feature store?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-28",
      q: "Explain train-serve skew with an example of how it happened.",
      round: ["tech2"],
      level: "5-10",
      tags: ["production", "debugging", "mlops"],
      why: "The classic production ML failure, and a concrete example proves you have shipped rather than only trained.",
      simple:
        "Train-serve skew is when the features a model receives in production differ from what it saw in training. Offline metrics look fine and production performance is worse, with nothing obviously broken.\n\n" +
        "A concrete case. Training data was built from the warehouse, where a customer's country was a clean two-letter code. The serving path read from an API that returned full country names, with a fallback to empty string on timeout. The encoder mapped every unrecognised value to a single unknown bucket. So in production, a feature the model relied on was constant. Accuracy dropped several points, and every monitoring dashboard was green because the pipeline was not erroring - it was succeeding with degraded input.\n\n" +
        "The common causes are worth listing, because they recur. Different code paths computing the same feature. Different data sources with different conventions. Time-window boundaries handled inconsistently. Missing-value handling that differs between pipelines. And scalers or encoders fitted on training data but not versioned with the model, so a retrain silently changes the mapping.\n\n" +
        "Prevention: share the transformation code between training and serving rather than reimplementing it; version the fitted preprocessor with the model artefact; and log the actual feature vector at inference so you can compare distributions against training.\n\n" +
        "That last one is what turns a two-week investigation into a two-hour one, and it is the part most teams skip until it has cost them once.",
      points: [
        "Serving features differ from training features; offline metrics stay clean.",
        "Causes: separate code paths, different sources, unversioned encoders.",
        "It fails silently - the pipeline succeeds with degraded input.",
        "Share transformation code; version the preprocessor with the model.",
        "Log inference features and compare distributions to training."
      ],
      say: "It is when production features differ from training features, so offline metrics look fine while real performance drops. I have seen country arrive as a two-letter code in the warehouse and a full name from the serving API, so the encoder mapped everything to unknown and a key feature went constant - with green dashboards throughout, because nothing errored. I prevent it by sharing transformation code, versioning the fitted preprocessor with the model, and logging inference features.",
      numbers: "It typically costs several accuracy points and goes unnoticed for weeks. Comparing logged inference feature distributions against training is the fastest detection there is.",
      wrong: "Defining it without an example. Every candidate can define it; having actually debugged one is what the question is really asking.",
      follow: "How would you detect this within a day rather than a month?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-29",
      q: "What is SHAP and how do you read a SHAP plot?",
      round: ["tech2"],
      level: "5-10",
      tags: ["explainability", "shap", "stakeholders"],
      why: "The named tool for explainability, and regulated employers will ask specifically.",
      simple:
        "SHAP assigns each feature a contribution to a specific prediction, in the units of the output. The idea comes from cooperative game theory: treat features as players, and fairly divide the difference between this prediction and the average prediction among them.\n\n" +
        "The property that matters is additivity. The base value plus every SHAP value equals the prediction exactly. So you can say: the average default probability is 8%, this applicant is at 31%, and the increase breaks down as +15 points from debt-to-income, +9 from recent enquiries, −1 from tenure. That is an explanation a credit officer can act on and a regulator can inspect.\n\n" +
        "Reading the plots. A beeswarm shows every row, with features ordered by importance, position showing SHAP value, and colour showing whether the feature value was high or low - so you see direction, not just magnitude. A waterfall explains one prediction, stepping from base value to final output. A dependence plot shows how one feature's contribution varies across its range, revealing non-linearity.\n\n" +
        "Two distinctions worth stating. Global importance from SHAP is the mean absolute value across rows, which is more trustworthy than a tree's built-in importance because that is biased toward high-cardinality features. And local explanation is per-prediction, which is what regulation usually requires.\n\n" +
        "The caveat: SHAP explains what the model does, not what is true. A spurious correlation the model learned shows up as a confident explanation. It is a model-debugging and communication tool, not evidence of causation.",
      points: [
        "Fairly attributes a prediction across features, in output units.",
        "Additive: base value plus SHAP values equals the prediction exactly.",
        "Beeswarm for global, waterfall for one prediction, dependence for shape.",
        "More reliable than a tree's built-in feature importance.",
        "Explains the model, not reality - spurious learning explains confidently."
      ],
      say: "SHAP attributes a prediction across features using a game-theory fair-division argument, and the key property is additivity - the base value plus the SHAP values equals the prediction exactly. So I can tell a credit officer that the average is 8%, this applicant is 31%, and debt-to-income contributed 15 points of that. Beeswarm for global patterns, waterfall for one case. The caveat is that it explains the model, not reality.",
      numbers: "TreeSHAP is exact and fast for tree models. KernelSHAP is model-agnostic and slow - sample rather than running it over a full dataset.",
      wrong: "Presenting SHAP values as causal effects. They describe the model's behaviour; a spurious correlation produces a confident and misleading explanation.",
      follow: "SHAP shows postcode as the top feature in a lending model. What now?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ml-30",
      q: "You have 500 labelled examples and need a classifier. LLM or fine-tuned BERT?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["decision", "cost", "classification", "genai"],
      why: "The most practical modern ML decision, and the one that connects this topic to the rest of the portal.",
      simple:
        "This is the question every team actually faces now, and the answer depends on volume and latency rather than on which technology is newer.\n\n" +
        "Start with the LLM, because it costs an afternoon. Few-shot prompt with a dozen examples, evaluate on a held-out set. No training, no infrastructure, and you have a working baseline and a real accuracy number by the end of the day. Often it is good enough and you stop there.\n\n" +
        "Now decide whether to keep it. Three things push you toward a fine-tuned encoder.\n\n" +
        "Volume. An LLM API call for every classification costs real money at scale, while a fine-tuned encoder runs on CPU for effectively nothing per call. At millions of classifications a month the arithmetic is not close.\n\n" +
        "Latency. An encoder classifies in single-digit milliseconds. An API call is hundreds. If this sits in a real-time path, that decides it.\n\n" +
        "Task specificity. For domain-specific labels with subtle boundaries, 500 well-labelled examples is genuinely enough to fine-tune a small encoder, and it will often beat few-shot prompting because the boundaries come from the data rather than from your prompt wording.\n\n" +
        "And what pushes you to keep the LLM: label definitions still changing, low volume, or a task needing broad world knowledge the encoder does not have.\n\n" +
        "The move that gets you both is distillation. Use the LLM to label ten thousand unlabelled examples, verify a sample by hand, then train the encoder on that. You get LLM-level quality at encoder cost and latency. Your 500 gold examples become the test set that tells you whether it worked.",
      points: [
        "Prototype with the LLM first - a working baseline in an afternoon.",
        "High volume or tight latency pushes you to a fine-tuned encoder.",
        "500 clean examples is enough to fine-tune a small encoder.",
        "Unstable labels or low volume favour keeping the LLM.",
        "Distil: LLM labels the bulk data, encoder serves production."
      ],
      say: "I would prototype with the LLM first, because few-shot gives a real accuracy number in an afternoon with no infrastructure. Then decide on volume and latency: at millions of calls a month, or in a real-time path, a fine-tuned encoder runs on CPU for a fraction of the cost and responds in milliseconds. The best of both is distillation - use the LLM to label ten thousand examples and train the encoder on that, keeping my 500 gold labels as the test set.",
      numbers: "500 clean examples is a workable fine-tuning set for a small encoder. Per-call, an encoder on CPU is orders of magnitude cheaper than a hosted LLM API.",
      wrong: "'Use an LLM, it is state of the art.' It ignores cost and latency, which are exactly what the question is testing, and it does not survive the volume follow-up.",
      follow: "This runs on ten million documents a month. Does your answer change?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
  ]
};
