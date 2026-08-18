/* Topic 16 — ML fundamentals for AI engineers.
   Grounding: public JDs that list ML fundamentals alongside GenAI skills, plus
   the failure modes these questions exist to catch. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["16-ml-fundamentals"] = {
  lede: "Every GenAI job description still lists machine learning fundamentals, and this is where GenAI-only candidates lose rounds they expected to pass. The panel is not asking you to derive anything. They are checking that you can reason about data, measurement and failure — which is exactly the skill GenAI evaluation also needs.",
  grounding: "public JDs listing ML fundamentals + the failure modes these questions catch",
  evening: ["ml-01", "ml-03", "ml-05", "ml-07"],

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
        "How you diagnose it, which is the part that matters: compare training error with validation error. Both high means high bias, so the model is underfitting — use a more capable model or better features. Training error low and validation error much higher means high variance, so it is overfitting — get more data, regularise, or simplify.\n\n" +
        "That diagnostic is the answer. The definition alone tells the interviewer you have read about it.",
      points: [
        "Bias — model too simple. Wrong on training data too. Underfitting.",
        "Variance — model too sensitive to its training data. Overfitting.",
        "Diagnose by comparing training error with validation error.",
        "Both high → more capacity, better features.",
        "Train low, validation high → more data, regularisation, simpler model."
      ],
      say: "Bias is error from a model too simple to capture the pattern — it is wrong on the training data too. Variance is error from a model so sensitive to its training data that it learned the noise. I diagnose by comparing training and validation error: both high means underfitting, so more capacity or better features; training low and validation much higher means overfitting, so more data or regularisation.",
      numbers: "No number applies. The training-versus-validation gap is the measurement, not a threshold.",
      wrong: "Reciting only the definitions. Every candidate can. The interviewer wants the diagnostic that follows from them.",
      follow: "Training accuracy 99%, validation 71%. What do you do first?"
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
        "Precision is: of the cases I flagged, how many were real. It matters when a false positive is expensive — you are sending investigators, or blocking a legitimate transaction.\n\n" +
        "Recall is: of the real cases, how many did I catch. It matters when a false negative is expensive — a missed fraud, a missed disease.\n\n" +
        "F1 combines them when you need one number. AUC-PR is the better summary than AUC-ROC on heavily imbalanced data, because ROC looks optimistic when negatives dominate.\n\n" +
        "And the answer that scores: which mistake costs more in this business? That decides the metric, and it is a question you ask rather than assume.",
      points: [
        "Imbalance makes accuracy meaningless — a constant prediction can score 99%.",
        "Precision: of those I flagged, how many were real. Guards against false positives.",
        "Recall: of the real cases, how many I caught. Guards against false negatives.",
        "F1 when you need one number; AUC-PR over AUC-ROC on heavy imbalance.",
        "The metric follows from which error costs more. Ask, do not assume."
      ],
      say: "Because of imbalance — if one in a hundred cases is fraud, predicting \"not fraud\" always is 99% accurate and useless. So I look at the confusion matrix and choose by which error costs more. Precision when a false positive is expensive, recall when a false negative is. F1 when I need one number, and AUC-PR rather than ROC on heavy imbalance. Which mistake costs more is a question I ask.",
      numbers: "On a 1% positive rate, a constant negative prediction scores 99% accuracy and 0% recall. That is the example to quote.",
      wrong: "Listing precision, recall and F1 without connecting them to the cost of each error. The connection is the answer.",
      follow: "The business wants both high precision and high recall. What do you tell them?"
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
        "The forms it takes. Target leakage — a feature that is a consequence of the outcome rather than a cause. A column like `payout_date` predicting claim approval is perfect, and useless, because it only exists after approval. Train-test contamination — scaling or imputing across the whole dataset before splitting, so test statistics leaked into training. Temporal leakage — random splitting on time-series data, so the model trained on the future to predict the past. And duplicate rows landing on both sides of the split.\n\n" +
        "How you catch it: be suspicious of any result that is too good. Check feature importance — a single feature dominating is the classic signature. Ask when each feature becomes available in real time, which is the question that catches target leakage. And split by time whenever the data has time in it.\n\n" +
        "The senior habit: fit every transformation inside the training fold only.",
      points: [
        "Target leakage — a feature that exists only because the outcome happened.",
        "Contamination — scaling or imputing before splitting.",
        "Temporal leakage — random split on time-ordered data.",
        "Duplicates landing on both sides of the split.",
        "Signature: results too good; one feature dominating importance.",
        "The catch-all test: when does this feature become available in production?",
        "Fit every transformation inside the training fold only."
      ],
      say: "Leakage is information reaching the model in training that will not exist at prediction time, so validation looks brilliant and production fails. Target leakage is a feature that exists only because the outcome happened. Contamination is scaling before splitting. Temporal leakage is random-splitting time-ordered data. I catch it by being suspicious of results that are too good, checking whether one feature dominates, and asking when each feature becomes available.",
      numbers: "No number applies. The tell is a suspiciously high score and one feature carrying most of the importance.",
      wrong: "\"I use train-test split to avoid it.\" A random split is itself the cause of temporal leakage, so this answer names the mechanism that created the problem.",
      follow: "Your model scores 0.99 AUC. Are you pleased?"
    },

    {
      id: "ml-04",
      q: "How do you handle imbalanced data?",
      round: ["tech1"],
      level: "2-5",
      tags: ["ml-fundamentals", "imbalanced-data", "training"],
      why: "Common and practical. The good answer starts by questioning whether resampling is needed at all.",
      simple:
        "First ask whether it is actually a problem. Imbalance itself is not — many models handle it fine. The problem is when the minority class is what you care about and the model has learned to ignore it. So check the recall on that class before changing anything.\n\n" +
        "Then the options, cheapest first. Change the metric and the decision threshold — often the whole fix, because the model's ranking may already be good and only the 0.5 cutoff is wrong. Use class weights, which most libraries support and which needs no data manipulation. Then resampling: undersample the majority when you have plenty of data, oversample or synthesise the minority when you do not.\n\n" +
        "The rule about resampling that separates people who have done this: resample inside the training fold only, never before the split, and never touch the validation or test set. A resampled test set gives you a number that does not correspond to anything real.\n\n" +
        "And if the minority class has only a handful of examples, consider whether this is anomaly detection rather than classification.",
      points: [
        "First check whether minority-class recall is actually bad. Imbalance alone is not a problem.",
        "Adjust the decision threshold — often the entire fix.",
        "Class weights next: no data manipulation needed.",
        "Then resampling — inside the training fold only.",
        "Never resample validation or test. The number stops meaning anything.",
        "Very few positives → consider anomaly detection instead."
      ],
      say: "First I check whether minority-class recall is actually bad, because imbalance alone is not a problem. Then, cheapest first: adjust the decision threshold, which is often the whole fix since the ranking may already be fine. Then class weights, which need no data manipulation. Then resampling, inside the training fold only — never on validation or test, because a resampled test score corresponds to nothing real.",
      numbers: "The default 0.5 threshold is rarely right on imbalanced data. Choose it from the precision-recall curve against the business cost of each error.",
      wrong: "\"I use SMOTE.\" Jumping to synthesis before trying the threshold and class weights, and it invites the question of whether you applied it before or after the split.",
      follow: "Where exactly in your pipeline does the resampling happen?"
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
        "So you monitor the things you can see immediately. Input drift — the distribution of incoming features shifting away from training. Prediction drift — the distribution of your model's own outputs moving, which is a strong early signal and cheap to compute. Data quality — nulls appearing, a category you have never seen, a unit change upstream. And segment volumes, because a shift in who is being scored changes what the aggregate means.\n\n" +
        "Then accuracy retrospectively, as labels arrive, backfilled onto the period they belong to.\n\n" +
        "The distinction worth naming: data drift means the inputs changed; concept drift means the relationship between inputs and outcome changed. Drift detection finds the first. Only labels find the second, which is why a delayed-label pipeline is not optional.",
      points: [
        "Labels arrive late or never — you cannot watch accuracy live.",
        "Monitor input drift, prediction drift, data quality, segment volumes.",
        "Prediction drift is the cheapest strong early signal.",
        "Backfill accuracy onto the right period as labels arrive.",
        "Data drift = inputs changed. Concept drift = the relationship changed.",
        "Only labels reveal concept drift. Build the delayed-label pipeline."
      ],
      say: "Labels usually arrive late, so I cannot watch accuracy live. I monitor input drift, prediction drift — which is cheap and a strong early signal — data quality, and segment volumes. Then I backfill accuracy onto the right period as labels arrive. The distinction that matters is that drift detection finds changed inputs, but only labels reveal concept drift, where the relationship itself changed.",
      numbers: "Prediction drift is computable on every request at no label cost. It is the first monitor to build, before any accuracy pipeline.",
      wrong: "\"We monitor accuracy in production.\" Only if labels arrive quickly. If they do not, this answer says you have not operated a model with delayed feedback.",
      follow: "Inputs look stable and accuracy fell. What is that?"
    },

    {
      id: "ml-06",
      q: "Explain cross-validation and when you should not use it.",
      round: ["tech1"],
      level: "2-5",
      tags: ["ml-fundamentals", "validation", "evaluation"],
      why: "The 'when not to' half is what distinguishes the answer.",
      simple:
        "Cross-validation splits the data into k parts, trains on k minus one and validates on the held-out part, then rotates. Every row gets used for validation exactly once, and you average the scores. It gives a more stable estimate than one split, and a sense of the variance across folds — which is itself informative, because widely varying folds mean an unstable model.\n\n" +
        "When not to use it. Time-series data, because a random split trains on the future — use forward-chaining, where each fold trains only on earlier periods. Grouped data, where the same customer or patient appears in several rows, so you split by group or the model recognises the individual rather than the pattern. And when training is expensive, since k-fold means k trainings, which is why fine-tuning is almost never cross-validated.\n\n" +
        "And the general principle behind all three: the split has to mirror how the model will actually be used. If production means predicting for an unseen customer next month, the validation split has to be unseen customers, next month.",
      points: [
        "k folds, each row validated once, scores averaged. More stable than one split.",
        "Fold variance is itself a signal — wide spread means an unstable model.",
        "Time series → forward-chaining, never random.",
        "Grouped data → split by group, or the model learns the individual.",
        "Expensive training → k-fold costs k trainings.",
        "The split must mirror how the model will be used in production."
      ],
      say: "It splits data into k folds, trains on k minus one and validates on the rest, rotating so every row is validated once. The spread across folds is itself useful — wide variance means an unstable model. I would not use it on time series, where a random split trains on the future, or on grouped data where the same customer appears in many rows. The split has to mirror production use.",
      numbers: "k = 5 or 10 is standard. On time series use forward-chaining folds instead, and report performance per fold, not just the mean.",
      wrong: "\"I always use 5-fold cross-validation.\" On time-series or grouped data that produces an optimistic number that will not survive production.",
      follow: "Your data has one row per transaction and many rows per customer. How do you split?"
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
        "For a well-defined task with labelled data — fraud scoring, churn, demand forecasting, document routing at volume — a gradient-boosted model on tabular data is faster, far cheaper, deterministic, and usually more accurate than any prompt. It also gives you a calibrated probability, which an LLM does not.\n\n" +
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
      say: "Yes, for cost and precision. On a well-defined task with labels — fraud, churn, forecasting — a gradient-boosted model is faster, far cheaper, deterministic and usually more accurate than a prompt, and it gives a calibrated probability an LLM cannot. LLMs win on unstructured language, no labels, or prose output. The best pattern combines them: the LLM extracts structured fields, a classical model scores them.",
      numbers: "A gradient-boosted model serves predictions in single-digit milliseconds at effectively zero marginal cost. Compare that against a per-token bill before choosing an LLM for a scoring task.",
      wrong: "\"LLMs can do everything now.\" It suggests you would spend a large budget on a problem logistic regression solves better, which is a costly instinct to hire.",
      follow: "Give me a task in our business where you would refuse to use an LLM."
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
        "Local: why this particular decision? That is what a customer or a regulator asks, and it needs a per-prediction method — SHAP values are the usual choice, giving each feature's contribution to this specific outcome.\n\n" +
        "Then translate, because the raw output is not an explanation. \"SHAP value of 0.34 for tenure\" means nothing to anyone. \"This application was declined mainly because the account is four months old and three payments were late; if it were twelve months old the decision would likely change\" is an explanation, and it is also actionable, which is what people actually want.\n\n" +
        "And the honest caveat: these methods explain what the model did, not what is true in the world. Correlation in the features shows up as importance. Saying that distinguishes you from someone who treats SHAP as ground truth.",
      points: [
        "Global explanation — feature importance. For trusting the system.",
        "Local explanation — SHAP per prediction. For explaining one decision.",
        "Translate into plain, actionable language. A SHAP value is not an explanation.",
        "Include what would change the outcome. That is what people want.",
        "These explain the model, not the world. Correlated features look important.",
        "In regulated settings, prefer an inherently interpretable model where accuracy allows."
      ],
      say: "I separate global from local. Globally, feature importance shows what drives the model, which is what a stakeholder needs to trust it. Locally, SHAP gives each feature's contribution to one decision, which is what a customer or regulator asks about. Then I translate into plain language including what would change the outcome. And I am clear that these explain the model, not the world — correlated features look important.",
      numbers: "No number applies. If the setting is regulated, consider whether an interpretable model at slightly lower accuracy is the better trade.",
      wrong: "\"I show them the SHAP plot.\" Handing over a technical artefact is not explaining. The translation is the deliverable.",
      follow: "The model declined a loan and the customer asks why. What exactly do you send them?"
    }
  ]
};
