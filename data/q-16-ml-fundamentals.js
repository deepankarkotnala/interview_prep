/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["16-ml-fundamentals"] = {
  "lede": "Every GenAI job description still lists machine learning fundamentals, and this is where GenAI-only candidates lose rounds they expected to pass. The panel is not asking you to derive anything. They are checking that you can reason about data, measurement and failure - which is exactly the skill GenAI evaluation also needs. New to ML fundamentals? The questions are ordered for a first read: every High priority card first, from learning types and bias-variance through regularisation, core models, neural-network training, metrics and production failure, then Medium, then Low.",
  "grounding": "public JDs listing ML fundamentals + the failure modes these questions catch",
  "evening": [
    "ml-01",
    "ml-09",
    "ml-10",
    "ml-12",
    "ml-30"
  ],
  "cards": [
    {
      "id": "ml-37",
      "q": "Supervised, unsupervised, self-supervised and reinforcement learning - what is the difference?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "basics",
        "learning-types"
      ],
      "why": "A screening opener. The good answer places LLM training inside these categories rather than reciting four definitions.",
      "simple": "The four differ in where the learning signal comes from.\n\nSupervised learning uses labelled examples: an input plus the correct answer, such as emails marked spam or not spam. The model learns to map input to label. Classification and regression are both supervised.\n\nUnsupervised learning has no labels. The model looks for structure on its own, such as groups of similar customers (clustering) or a smaller summary of the data (dimensionality reduction).\n\nSelf-supervised learning makes labels from the data itself. Hide the next word and ask the model to predict it. Nobody labelled anything, yet every sentence gives many training examples. This is how LLMs and embedding models are pre-trained, and why they can learn from huge amounts of raw text.\n\nReinforcement learning learns from rewards instead of correct answers. An agent tries actions, gets a score, and learns which actions lead to higher scores over time. Think of training a dog with treats rather than showing it the right move.\n\nThe senior point is that modern LLMs use several of these in sequence. Self-supervised pre-training builds general knowledge. Supervised fine-tuning teaches the instruction-following format. Reinforcement learning - from human preferences, or from checkable rewards such as passing tests - shapes behaviour and reasoning.\n\nSemi-supervised learning sits in between: a few labels plus lots of unlabelled data.",
      "points": [
        "**Supervised** - labelled input-output pairs. Classification, regression.",
        "**Unsupervised** - no labels; find structure. Clustering, PCA, anomaly detection.",
        "**Self-supervised** - labels made from the data itself, such as predicting the next token or a masked word.",
        "**Reinforcement** - learn from rewards for actions, not from correct answers.",
        "LLMs: self-supervised pre-training → supervised fine-tuning → RL (from human feedback or verifiable rewards)."
      ],
      "say": "The difference is where the learning signal comes from. Supervised learning uses labelled input-output pairs, like classification. Unsupervised has no labels and finds structure, like clustering. Self-supervised builds labels from the data itself, such as predicting the next token, which is how LLMs are pre-trained. Reinforcement learning learns from rewards for actions rather than correct answers. Modern LLMs use three in sequence: self-supervised pre-training, supervised fine-tuning, then reinforcement learning.",
      "numbers": "No single number applies. The useful contrast is scale: self-supervised pre-training runs on trillions of unlabelled tokens, while supervised fine-tuning sets are typically thousands to a few million examples.",
      "wrong": "Four textbook definitions with no link to the models you build. The follow-up usually asks where LLMs fit, and calling pre-training simply \"unsupervised\" is imprecise - it is self-supervised, and post-training adds supervised and reinforcement learning.",
      "follow": "When would you choose reinforcement learning over supervised learning?",
      "followAnswer": "When there is no single correct answer to label, but I can score outcomes - a sequence of decisions where the payoff comes later, or reasoning where I can check the final answer but not write every step. If I can label the right output directly, supervised learning is cheaper, more stable and easier to debug, so that stays my default."
    },
    {
      "id": "ml-01",
      "q": "Explain the bias-variance trade-off.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "basics",
        "overfitting"
      ],
      "why": "The classic opener. Reciting the definition is expected; connecting it to what you would do is not.",
      "simple": "Bias is error from a model that is too simple to capture the pattern. It gets things wrong the same way every time, and it is wrong on the training data too.\n\nVariance is error from a model that is too sensitive to the particular data it saw. It fits the training set beautifully and falls apart on anything new, because it learned the noise along with the signal.\n\nThe trade-off is that reducing one usually raises the other. A more flexible model cuts bias and adds variance.\n\nHow you diagnose it, which is the part that matters: compare training error with validation error. Both high, and close to each other, means high bias, so the model is underfitting - use a more capable model or better features. Training error low and validation error much higher means high variance, so it is overfitting - get more data, regularise, or simplify.\n\nThat diagnostic is the answer. The definition alone tells the interviewer you have read about it.",
      "points": [
        "Bias - model too simple. Wrong on training data too. Underfitting.",
        "Variance - model too sensitive to its training data. Overfitting.",
        "Diagnose by comparing training error with validation error.",
        "Both high and close → more capacity, better features.",
        "Train low, validation high → more data, regularisation, simpler model."
      ],
      "say": "Bias is error from a model too simple to capture the pattern - it is wrong on the training data too. Variance is error from a model so sensitive to its training data that it learned the noise. I diagnose by comparing training and validation error: both high means underfitting, so more capacity or better features; training low and validation much higher means overfitting, so more data or regularisation.",
      "numbers": "No number applies. The training-versus-validation gap is the measurement, not a threshold.",
      "wrong": "Reciting only the definitions. Every candidate can. The interviewer wants the diagnostic that follows from them.",
      "follow": "Training accuracy 99%, validation 71%. What do you do first?",
      "followAnswer": "That gap is overfitting, but before tuning anything I check the split for leakage or a difference between the training and validation data, because a gap that large can also mean validation is simply different. If the split is sound, I regularise - stronger L2, shallower trees or dropout - add early stopping, and get more data if I can. Then I re-check the gap."
    },
    {
      "id": "ml-12",
      "q": "Explain overfitting and every technique you would use against it.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "basics",
        "regularisation",
        "training"
      ],
      "why": "The most basic screening question. A structured answer signals organised thinking; a scattered list signals memorisation.",
      "simple": "Overfitting is when the model learns the noise in your training data instead of the pattern. It looks brilliant on data it has seen and fails on anything new. The signature is a large gap between training and validation performance.\n\nThe reason it happens is capacity exceeding evidence: the model has more flexibility than the data can constrain, so it uses the spare capacity to memorise.\n\nThat framing tells you there are three main levers, and grouping them this way is what makes the answer sound senior rather than recited.\n\nAdd data. More examples, or augmentation to synthesise variety. Always the best fix when it is available, because it attacks the cause.\n\nReduce capacity. A simpler model, fewer features, shallower trees, or regularisation - L1 and L2 penalise large weights, dropout randomly disables units so no single path can dominate.\n\nStop early. Watch validation loss and stop when it turns upward while training loss is still falling. That turning point is the moment memorisation begins.\n\nThe one people forget: cross-validation does not prevent overfitting, it detects it. And if you tune hyperparameters against your test set, you have overfit the test set too - which is why you keep a third split you touch once.",
      "points": [
        "Symptom: training performance far above validation.",
        "Cause: model capacity exceeds what the data can constrain.",
        "Three levers - more data, less capacity, early stopping.",
        "Cross-validation detects overfitting; it does not prevent it.",
        "Tuning against the test set overfits the test set."
      ],
      "say": "Overfitting is learning noise rather than signal, and the symptom is training performance far above validation. The cause is capacity exceeding the evidence, which gives you three levers: add data or augment it, reduce capacity through a simpler model or regularisation like L2 and dropout, or stop early when validation loss turns up. Cross-validation detects it rather than preventing it, and tuning on the test set overfits that too.",
      "numbers": "A validation gap of a few percent is normal. Training accuracy at 99% with validation at 70% means memorisation, not learning.",
      "wrong": "Listing techniques with no organising idea - 'dropout, regularisation, more data, early stopping'. Correct, and it sounds like a flashcard rather than understanding.",
      "follow": "Training and validation loss are both high and flat. Is that overfitting?",
      "followAnswer": "No, that is underfitting - high bias. The model cannot even fit the data it has seen. So I add capacity or better features, reduce regularisation and train longer. I also check the basics: a learning rate that is too low or too high, noisy labels, or features that simply do not carry the signal. More data will not fix this one."
    },
    {
      "id": "ml-13",
      "q": "L1 against L2 regularisation - what is the geometric intuition?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "regularisation",
        "theory",
        "feature-selection"
      ],
      "why": "Whether you understand why L1 zeroes coefficients rather than just knowing that it does.",
      "simple": "**Short version: both penalties push weights toward zero. L1 pushes some all the way to zero, so it doubles as feature selection. L2 only shrinks them.**\n\nBoth add a penalty on the size of the weights to the loss. L1 (lasso) adds the sum of absolute values. L2 (ridge) adds the sum of squares.\n\nThe geometry is worth being able to draw. Picture two weights on a plane. The penalty limits you to a region around the origin. For L2 that region is a circle. For L1 it is a diamond, with its corners sitting on the axes.\n\nThe loss forms oval contours around the unpenalised best fit. The answer is where those contours first touch the region. A circle is smooth, so the touch point usually has both weights small but non-zero. A diamond's corners stick out, so the contours often hit a corner first. At a corner, one weight is exactly zero.\n\nThe gradient view says the same thing. L2's pull is proportional to the weight, so it weakens as the weight shrinks and never quite reaches zero. L1's pull is constant, so it can push small weights all the way to zero.\n\nThe practical choice. L1 when you want a sparse, explainable model. L2 when features are correlated and you want the weight shared between them. Elastic net mixes both. One warning: with correlated features, L1 keeps one somewhat arbitrarily, and which one can flip between retrains.",
      "points": [
        "L1 (lasso) penalises absolute values; L2 (ridge) penalises squares.",
        "L1's constraint region is a diamond with corners on the axes.",
        "Contours often hit a corner first, so a coefficient becomes exactly zero.",
        "L2's circular region has no corners - shrinkage without sparsity.",
        "Gradient view: L2's pull shrinks with the weight; L1's pull is constant, so it reaches zero.",
        "L1 with correlated features keeps one somewhat arbitrarily; the choice is unstable."
      ],
      "say": "L1 penalises absolute values and L2 penalises squares, and the geometry explains the difference. L1's constraint region is a diamond whose corners sit on the axes, so the expanding loss contours tend to touch at a corner, which means a coefficient is exactly zero. L2's region is a circle with no corners, so it shrinks without zeroing. I use L1 for feature selection and L2 for correlated features.",
      "numbers": "Tune the strength on validation across a log scale. With correlated features, L1's selection can change between retrains - check stability before reporting it.",
      "wrong": "'L1 gives sparsity, L2 does not.' True and shallow. The follow-up is always why, and the geometry is the answer.",
      "follow": "Two features are almost perfectly correlated. What does L1 do?",
      "followAnswer": "L1 usually keeps one and drives the other to zero, and which one it keeps can be close to arbitrary - a small change in the data can flip the choice. So I would not tell the business the dropped feature does not matter. If I want the weight shared across both, I use L2 or elastic net, which keeps groups of correlated features together."
    },
    {
      "id": "ml-06",
      "q": "Explain cross-validation and when you should not use it.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "validation",
        "evaluation"
      ],
      "why": "The 'when not to' half is what distinguishes the answer.",
      "simple": "Cross-validation splits the data into k parts, trains on k minus one and validates on the held-out part, then rotates. Every row gets used for validation exactly once, and you average the scores. It gives a more stable estimate than one split, and a sense of the variance across folds - which is itself informative, because widely varying folds suggest an unstable model or too little data.\n\nWhen not to use it. Time-series data, because a random split trains on the future - use forward-chaining, where each fold trains only on earlier periods. Grouped data, where the same customer or patient appears in several rows, so you split by group or the model recognises the individual rather than the pattern. And when training is expensive, since k-fold means k trainings, which is why fine-tuning is almost never cross-validated.\n\nAnd the general principle behind all three: the split has to mirror how the model will actually be used. If production means predicting for an unseen customer next month, the validation split has to be unseen customers, next month.",
      "points": [
        "k folds, each row validated once, scores averaged. More stable than one split.",
        "Fold variance is itself a signal - wide spread suggests an unstable model or too little data.",
        "Time series → forward-chaining, never random.",
        "Grouped data → split by group, or the model learns the individual.",
        "Expensive training → k-fold costs k trainings.",
        "The split must mirror how the model will be used in production."
      ],
      "say": "It splits data into k folds, trains on k minus one and validates on the rest, rotating so every row is validated once. The spread across folds is itself useful - wide variance signals an unstable model or too little data. I would not use it on time series, where a random split trains on the future, or on grouped data where the same customer appears in many rows. The split has to mirror production use.",
      "numbers": "k = 5 or 10 is standard. On time series use forward-chaining folds instead, and report performance per fold, not just the mean.",
      "wrong": "\"I always use 5-fold cross-validation.\" On time-series or grouped data that produces an optimistic number that will not survive production.",
      "follow": "Your data has one row per transaction and many rows per customer. How do you split?",
      "followAnswer": "By customer, not by row. I use group k-fold so every transaction from one customer lands in the same fold. Otherwise the model sees a customer in training and is scored on the same customer in validation, which is optimistic. If time matters too, I combine both: train on earlier periods, validate on later ones, and keep customers separate across the split."
    },
    {
      "id": "ml-38",
      "q": "Linear vs logistic regression - and why does logistic regression use cross-entropy, not MSE?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "basics",
        "regression",
        "loss-functions"
      ],
      "why": "The most common classical-model question. The loss-function half checks whether you know why, not just what.",
      "simple": "Linear regression predicts a number, such as a house price. It fits a straight line (or flat surface) through the data by minimising mean squared error (MSE) - the average of the squared gaps between prediction and truth.\n\nLogistic regression predicts a probability for a yes-or-no outcome, such as whether a customer will churn. It computes the same weighted sum, then passes it through the sigmoid function, which squeezes any number into the range 0 to 1. Despite the name, it is a classification model.\n\nWhy cross-entropy (also called log loss) instead of MSE? Three reasons.\n\nIt fits the problem. Cross-entropy is what maximum likelihood gives you when the outcome is yes or no. MSE assumes bell-shaped noise around a number, which does not describe a 0-or-1 label.\n\nIt punishes confident mistakes hard. Predict 0.01 when the answer is 1 and log loss is about 4.6, while squared error can never exceed 1.\n\nIt trains well. With sigmoid plus MSE the loss is non-convex, and the gradient almost vanishes when the model is confidently wrong. With cross-entropy the gradient is simply prediction minus label, and the loss is convex, so there is one best answer to find.\n\nThe same reasoning is why neural classifiers and LLMs train with cross-entropy: next-token prediction is cross-entropy over the vocabulary.",
      "points": [
        "Linear: predicts a number; trained with MSE.",
        "Logistic: weighted sum → sigmoid → probability; a classifier despite the name.",
        "Cross-entropy is the maximum-likelihood loss for a yes/no outcome.",
        "Sigmoid + MSE is non-convex, and its gradient vanishes when confidently wrong.",
        "Cross-entropy's gradient is `p − y`: large when wrong, convex, stable.",
        "Coefficients are log-odds: `exp(w)` is the odds ratio per unit of the feature.",
        "Loss cheat-sheet: MSE, MAE or Huber for regression; binary cross-entropy for yes/no; categorical cross-entropy for many classes."
      ],
      "say": "Linear regression predicts a continuous value and is trained with mean squared error. Logistic regression puts the same weighted sum through a sigmoid to get a probability, so it is a classifier. It uses cross-entropy because that is the maximum-likelihood loss for a yes-or-no outcome. With sigmoid plus MSE the loss is non-convex and the gradient nearly vanishes when the model is confidently wrong; cross-entropy's gradient is simply prediction minus label.",
      "numbers": "Predicting 0.01 for a true positive costs about 4.6 in log loss but at most 1 in squared error. A logistic coefficient of 0.7 means the odds roughly double (e^0.7 ≈ 2.0) per unit increase in that feature.",
      "wrong": "Saying MSE would work just as well, or treating logistic regression as a regression model because of its name. The follow-up asks why not MSE, and the answer is convexity and the vanishing gradient when the model is confidently wrong.",
      "follow": "Why not just use linear regression and threshold it at 0.5?",
      "followAnswer": "Because linear regression is unbounded, so it predicts values below zero and above one that are not probabilities. It is also pulled around by extreme points: add a few easy examples far from the boundary and the fitted line tilts, moving the 0.5 crossing even though nothing about the hard cases changed. Logistic regression models the log-odds, keeps outputs between zero and one, and trains with log loss."
    },
    {
      "id": "ml-16",
      "q": "How do decision trees split, and what does a random forest add?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "trees",
        "ensembles",
        "basics"
      ],
      "why": "Trees still win on tabular data, and this is the base for the boosting question that follows.",
      "simple": "A decision tree asks a series of yes-or-no questions about features. At each node it picks the split that best separates the classes.\n\n'Best' means the largest drop in impurity. Gini impurity is the chance of misclassifying a random sample if you labelled it by the node's distribution - zero when a node is pure. Entropy measures the same idea in information terms. They almost always choose the same splits; Gini is marginally cheaper, which is why it is the default.\n\nThe tree evaluates every feature and every candidate threshold, takes the best split, and recurses.\n\nThe problem is that a single tree overfits badly. Grown deep, it isolates individual training rows and memorises the data. It is also unstable - change a few rows and you get a visibly different tree.\n\nA random forest fixes this with two sources of randomness.\n\nBagging: train each tree on a bootstrap sample, so every tree sees a different resample of the data.\n\nFeature subsampling: at each split, consider only a random subset of features. This is the crucial one - without it, one strong feature would sit at the root of every tree and they would all be nearly identical, so averaging would gain nothing.\n\nThen average the predictions. Individual trees are high-variance but roughly unbiased, and averaging many decorrelated high-variance estimates cuts variance without adding bias. That is the whole argument.",
      "points": [
        "Splits maximise impurity reduction - Gini or entropy.",
        "A single deep tree memorises and is unstable.",
        "Bagging: each tree trains on a bootstrap resample.",
        "Feature subsampling decorrelates the trees - the essential part.",
        "Averaging decorrelated high-variance trees cuts variance, not bias."
      ],
      "say": "A tree picks the split that most reduces impurity, measured by Gini or entropy, then recurses. A single deep tree memorises and is unstable. A random forest trains each tree on a bootstrap sample and restricts each split to a random feature subset - that second part is what decorrelates them, otherwise one dominant feature sits at every root. Averaging decorrelated high-variance trees cuts variance without adding bias.",
      "numbers": "Feature subsampling defaults to the square root of the feature count for classification. More trees never overfits a forest - it just stops improving, typically past a few hundred.",
      "wrong": "'It builds many trees and averages them.' It misses feature subsampling, which is the mechanism that makes averaging worth anything.",
      "follow": "Why does adding more trees to a forest not cause overfitting?",
      "followAnswer": "Because each extra tree is one more vote in an average. As trees are added, the forest's prediction settles to a stable value, so the error flattens rather than rising. Overfitting in a forest comes from individual trees being too deep on too little data, or from trees being too similar, not from their number. Past a few hundred trees you mostly pay in memory and latency."
    },
    {
      "id": "ml-18",
      "q": "Bagging against boosting - bias or variance?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ensembles",
        "bias-variance",
        "basics"
      ],
      "why": "A quick check that the bias-variance frame is a tool you use, not a phrase you repeat.",
      "simple": "Both combine many models. They attack opposite problems.\n\nBagging trains models in parallel on bootstrap resamples and averages them. Averaging many roughly independent estimates reduces variance and leaves bias roughly unchanged - the average of many unbiased estimators is still unbiased, just more stable. So bagging is for models that are individually accurate but unstable. Deep trees are exactly that, which is why random forests work.\n\nBoosting trains models in sequence, each fixing the previous ensemble's errors. That systematically attacks bias - the ensemble becomes able to represent patterns no single weak learner could. So boosting starts from deliberately underfit stumps and builds capacity.\n\nThe one-line version: bagging makes unstable models stable, boosting makes weak models strong.\n\nThe practical consequences follow directly. Bagging is parallel, so it trains fast on many cores; boosting is sequential and cannot be parallelised the same way. More trees never hurt a bagged forest, but too many boosting rounds will overfit. And bagging is far more forgiving of hyperparameters, which is why a random forest is a good first baseline and a tuned boosted model is usually the final one.",
      "points": [
        "Bagging: parallel on resamples, reduces variance.",
        "Boosting: sequential on errors, reduces bias.",
        "Bagging stabilises unstable models; boosting strengthens weak ones.",
        "Extra trees are harmless in bagging, dangerous in boosting.",
        "Forest as the quick baseline; boosting for the tuned final model."
      ],
      "say": "Bagging trains models in parallel on bootstrap resamples and averages them, which reduces variance while leaving bias roughly unchanged - so it suits deep trees that are accurate but unstable. Boosting trains sequentially with each model fixing the previous errors, which attacks bias, so it starts from deliberately weak stumps. Practically, more trees never hurt a forest but too many boosting rounds overfit, so boosting needs early stopping.",
      "numbers": "A forest with 500 trees needs almost no tuning. A boosted model with 500 rounds and no early stopping is very likely overfit.",
      "wrong": "Getting them backwards, which happens often under pressure. Anchor on the mechanism - averaging reduces variance, sequential correction reduces bias.",
      "follow": "You have one afternoon and a tabular dataset. Which do you reach for?",
      "followAnswer": "A random forest first, as the baseline, because it trains fast, needs almost no tuning and gives a trustworthy number within the hour. Then I spend the rest of the afternoon on LightGBM or XGBoost with early stopping, which usually wins by a few points. If boosting does not clearly beat the forest, I ship the simpler model."
    },
    {
      "id": "ml-17",
      "q": "Explain gradient boosting. Why does XGBoost still win on tabular data?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "boosting",
        "ensembles",
        "tabular"
      ],
      "why": "The honest answer to 'which model would you actually use' for structured data, in an LLM-heavy interview.",
      "simple": "**Short version: boosting builds small trees one after another, each fixing the mistakes of the ones before. On spreadsheet-style data it is still the model to beat.**\n\nA random forest builds trees independently and averages them. Boosting builds them in sequence. Fit a shallow tree. Look at what it got wrong (the residuals). Fit the next tree to predict those errors, add it in at a small learning rate, and repeat. Formally, each tree fits the negative gradient of the loss - hence \"gradient\" boosting.\n\nThe trees are deliberately weak, depth 3 to 6. Strong trees overcorrect and the sequence overfits fast.\n\nXGBoost adds regularisation on tree complexity, uses second-order gradient information, learns a default direction for missing values, and is heavily optimised. LightGBM grows trees leaf-wise and is very fast on large data. CatBoost handles categorical features natively.\n\nWhy it still wins on tabular data: the columns are mixed - an amount, a category, a count, a date - with no spatial or sequence structure for a neural network to exploit. Trees handle mixed types and sharp thresholds natively, need little preprocessing, and learn well from modest amounts of data. Tabular foundation models such as TabPFN are now competitive on small datasets, but tuned boosted trees remain the default to beat.\n\nThe catch: unlike a forest, boosting genuinely overfits with too many rounds, so early stopping on a validation set is not optional.",
      "points": [
        "Sequential: each tree fits the current ensemble's errors.",
        "Weak learners, depth 3 to 6, with a small learning rate.",
        "Forests reduce variance; boosting reduces bias.",
        "Boosting does overfit - early stopping is mandatory.",
        "Tabular data has little structure for a network to exploit; boosted trees are the default to beat."
      ],
      "say": "Boosting builds trees sequentially, each fitting the residual errors of the current ensemble at a small learning rate - formally the negative gradient of the loss. The trees are deliberately shallow, because strong learners overcorrect. Against a forest it reduces bias rather than variance, so it is more accurate but genuinely overfits and needs early stopping. It is still the default on tabular data because mixed feature types have little structure a network can exploit.",
      "numbers": "Learning rate 0.05 to 0.1, depth 3 to 6, with early stopping on validation. Lower learning rate needs more rounds and usually generalises slightly better.",
      "wrong": "Saying deep learning has superseded it. On medium-sized tabular problems well-tuned boosted trees are still the baseline to beat, and the follow-up will ask for the benchmark that says otherwise.",
      "follow": "Your boosted model scores 0.99 on training and 0.72 on validation. What happened?",
      "followAnswer": "It is overfitting - most likely too many rounds, trees that are too deep, or a learning rate that is too high. I add early stopping on validation, cap depth at three to six, lower the learning rate, and add row and column subsampling plus regularisation. But a gap that big also makes me check first for leakage or a mismatch between the training and validation data."
    },
    {
      "id": "ml-14",
      "q": "Explain gradient descent and its variants.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "optimisation",
        "training",
        "basics"
      ],
      "why": "Foundational, and it connects directly to why transformer training works the way it does.",
      "simple": "You are on a hillside in fog and want the valley. You feel which way the ground slopes and step downhill. Repeat. That is gradient descent - the gradient is the slope of the loss with respect to each weight, and you step against it.\n\nThe variants differ only in how much data you use to estimate the slope before stepping.\n\nBatch gradient descent uses the whole dataset per step. The direction is accurate but you take one step per full pass, which is impossibly slow at scale.\n\nStochastic uses one example. Very fast, very noisy - you stagger downhill rather than walking.\n\nMini-batch uses 32 to 512 examples. Accurate enough, and it maps onto how GPUs actually work. This is what everyone uses.\n\nThen the improvements, each fixing a specific failure.\n\nMomentum: keep a running average of recent gradients, so you build speed in consistent directions and damp oscillation across a narrow valley.\n\nAdaptive learning rates: give each parameter its own step size, so rarely-updated parameters can still move.\n\nAdam combines both and is the sensible default for deep learning. AdamW fixes how Adam handled weight decay and is what transformers actually train with.\n\nThe one hyperparameter that matters most is the learning rate. Too high and the loss diverges; too low and training stalls. Warmup and a decay schedule are standard for exactly that reason.",
      "points": [
        "Step against the gradient of the loss.",
        "Batch, stochastic, mini-batch differ in data used per step.",
        "Momentum damps oscillation; adaptive rates fix per-parameter scale.",
        "AdamW is the transformer default; newer optimisers such as Muon are being tried in some large pre-training runs.",
        "Learning rate is the hyperparameter that decides success."
      ],
      "say": "Gradient descent steps the weights against the gradient of the loss. The variants differ in how much data estimates that gradient - mini-batch is the practical choice because it balances a stable direction with GPU efficiency. Momentum averages recent gradients to damp oscillation, adaptive methods give each parameter its own step size, and AdamW combines both and is the transformer default. Learning rate is the hyperparameter that decides whether it works.",
      "numbers": "Full fine-tuning uses small learning rates - roughly 1e-5 to 5e-5 for BERT-sized models, often lower for large LLMs. LoRA adapters usually run higher, around 1e-4 to 2e-4. Pre-training uses warmup then decay. A diverging loss most often means the learning rate is too high.",
      "wrong": "Describing gradient descent and stopping. The question is nearly always really about why Adam is the default, so go there yourself.",
      "follow": "Your loss is oscillating rather than decreasing. What do you change?",
      "followAnswer": "First the learning rate - oscillation usually means the steps are too big, so I lower it or add warmup and a decay schedule. If the loss spikes, I add gradient clipping. I check the batch size, because very small batches give noisy gradients, and I check the data, because shuffling bugs or bad labels can look like an optimisation problem. One change at a time."
    },
    {
      "id": "ml-39",
      "q": "Explain backpropagation simply.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "deep-learning",
        "backprop",
        "basics"
      ],
      "why": "The core deep-learning mechanism. Panels want the chain-rule idea and why it is efficient, not calculus on a whiteboard.",
      "simple": "Backpropagation is how a neural network works out how much each weight contributed to the error, so gradient descent knows which way to move each one.\n\nIt has two passes.\n\nForward pass: the input flows through the layers and produces a prediction. The loss function scores how wrong it is. Along the way, the framework stores each intermediate value (the activations).\n\nBackward pass: starting from the loss, it works backwards layer by layer. At each step it asks: if this value changed a little, how much would the loss change? That quantity is the gradient. It uses the chain rule from calculus - the effect of an early weight on the loss is the product of the effects along the path from that weight to the output.\n\nThe clever part is reuse. Each layer's gradient is built from the one after it, so a single backward pass gives the gradient for every weight, at about twice the cost of the forward pass. Nudging each weight separately to see what happens would be millions of times slower.\n\nThen the optimiser, such as SGD or AdamW, uses those gradients to update the weights.\n\nTwo practical consequences. Training must keep the forward activations in memory, which is a big reason training needs far more GPU memory than inference. And because gradients are multiplied through many layers, they can shrink or blow up - the vanishing and exploding gradient problems.\n\nIn PyTorch, `loss.backward()` runs the backward pass; autograd records the graph for you during the forward pass.",
      "points": [
        "Forward pass computes the prediction and loss, storing activations.",
        "Backward pass applies the chain rule from the loss back to every weight.",
        "Reuse makes it cheap: one backward pass costs about 2× a forward pass, for all weights at once.",
        "Backprop computes gradients; the optimiser uses them. Two different steps.",
        "Stored activations are a big reason training needs much more memory than inference."
      ],
      "say": "Backpropagation computes how much each weight contributed to the error. The forward pass produces a prediction and a loss, storing the intermediate activations. The backward pass then applies the chain rule from the loss back through each layer, reusing each layer's gradient to compute the one before it. That gives the gradient for every weight at roughly twice the cost of a forward pass. The optimiser then uses those gradients to update the weights.",
      "numbers": "The backward pass costs roughly twice the forward pass, so a training step is about three times the compute of inference on the same batch. That is where the common estimate of about 6 × parameters × tokens for training FLOPs comes from.",
      "wrong": "\"Backpropagation is gradient descent.\" They are separate steps: backprop computes the gradients, the optimiser uses them to update weights. Merging them suggests the idea was memorised as one word.",
      "follow": "What does `loss.backward()` actually compute in PyTorch?",
      "followAnswer": "It walks backwards through the computation graph that autograd recorded during the forward pass, applying the chain rule at each operation. The result is the gradient of the loss with respect to every parameter that requires gradients, stored in each parameter's `.grad`. It adds to whatever is already there, which is why we zero gradients each step. The optimiser step then uses them."
    },
    {
      "id": "ml-40",
      "q": "Why do neural networks need activation functions? Compare sigmoid, tanh, ReLU and GELU.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "deep-learning",
        "activations",
        "basics"
      ],
      "why": "A standard deep-learning screen. The non-linearity argument is the real question; the comparison shows whether you know what modern models use.",
      "simple": "Without an activation function, a neural network is just a stack of linear layers. And a stack of linear layers collapses into one linear layer - multiplying matrices together just gives another matrix. So however deep the network, it could only draw straight-line boundaries. The activation adds a bend after each layer, and many stacked bends let the network model curved, complex patterns.\n\nThe common choices:\n\nSigmoid squeezes values into 0 to 1. It is still used at the output for a yes-or-no probability. It is poor in hidden layers: it goes flat (saturates) for large inputs, and its slope is at most 0.25, so gradients shrink layer by layer.\n\nTanh squeezes values into -1 to 1. It is centred on zero, which helps, but it still saturates. You still find it inside LSTM cells.\n\nReLU outputs the input if positive, otherwise zero. It is cheap, and its slope is 1 for positive inputs, so gradients pass through. It made deep networks practical. The flaw: a unit stuck on negative inputs outputs zero forever - a \"dead\" neuron. Leaky ReLU keeps a small slope for negatives.\n\nGELU is a smooth version of ReLU that lets small negative values through. BERT and GPT-2 use it. SwiGLU, a gated variant, is the feed-forward activation in Llama and most recent open LLMs.\n\nSoftmax is different: it turns a vector of scores into probabilities that sum to 1, used at the output for multi-class and next-token prediction.",
      "points": [
        "Stacked linear layers without activations collapse into one linear layer.",
        "Sigmoid: 0 to 1, used at binary outputs; saturates, max slope 0.25.",
        "Tanh: -1 to 1, zero-centred, still saturates.",
        "ReLU: slope 1 for positives, cheap; can leave dead units (Leaky ReLU helps).",
        "GELU (BERT, GPT-2) and SwiGLU (Llama and most recent open LLMs) are the transformer choices.",
        "Softmax turns output scores into a probability distribution."
      ],
      "say": "Without activations, stacked linear layers collapse into a single linear function, so depth adds nothing - the non-linearity is what lets a network model complex patterns. Sigmoid and tanh saturate, and sigmoid's slope is at most 0.25, so gradients vanish in deep networks; sigmoid now mainly appears at binary outputs. ReLU passes gradients through and is cheap, though units can die. Transformers use smoother variants: GELU in BERT and GPT-2, SwiGLU in Llama-style models.",
      "numbers": "Sigmoid's slope peaks at 0.25, tanh's at 1, and ReLU's is exactly 1 for any positive input. SwiGLU layers usually shrink the hidden size to about two-thirds of the classic 4× width so the parameter count stays comparable.",
      "wrong": "\"Activations keep the output between 0 and 1.\" That describes sigmoid, not the purpose. The purpose is non-linearity - without it, depth is pointless.",
      "follow": "Why did LLMs move from ReLU to GELU and SwiGLU?",
      "followAnswer": "ReLU outputs exactly zero for every negative input, so units can die and stop learning. GELU is a smooth version that lets small negative values through, and it trained better in BERT and GPT-2. SwiGLU adds a gate: one projection decides how much of another passes through. In experiments it gave better quality for similar compute, so Llama and most recent open models use it."
    },
    {
      "id": "ml-15",
      "q": "What is the vanishing gradient problem and how was it solved?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "deep-learning",
        "training",
        "theory"
      ],
      "why": "It explains three design choices in every transformer - a clean bridge from classical ML to what you build now.",
      "simple": "**Short version: in a deep network the learning signal is multiplied by small numbers at every layer on the way back, so it fades before reaching the early layers. ReLU-style activations, residual connections, normalisation and careful initialisation stop it fading.**\n\nBackpropagation multiplies gradients layer by layer, from the output back to the input. Multiply many numbers smaller than one and the result collapses toward zero. The early layers get almost no signal and stop learning.\n\nSigmoid made it worse. Its slope is at most 0.25, so every layer shrank the gradient at least four times. Tanh's slope peaks at 1, but it goes flat (saturates) for large inputs, so it vanishes too.\n\nThe fixes - and you can point at most of them inside a transformer:\n\nReLU and its successors. The slope is 1 for positive inputs, so the gradient passes through unshrunk.\n\nResidual (skip) connections. Each block adds its input back to its output, giving the gradient a direct path around the block. This is what makes very deep networks trainable.\n\nNormalisation. Layer norm keeps activations in a steady range. Modern transformers normalise before each sublayer (pre-norm), which trains more stably.\n\nGood initialisation. Xavier or He initialisation scales the starting weights so signals neither shrink nor grow from layer to layer.\n\nIn RNNs, LSTM gates were the fix. The mirror problem, exploding gradients, is handled with gradient clipping.",
      "points": [
        "Gradients multiply backwards; values under 1 collapse toward zero.",
        "Sigmoid's maximum derivative is 0.25 - a guaranteed shrink. Tanh peaks at 1 but saturates.",
        "ReLU passes gradient unchanged for positive inputs.",
        "Residual connections give gradients a path around each block.",
        "Normalisation and Xavier/He initialisation keep the scale stable.",
        "Clipping handles the exploding case; LSTM gates fixed it for RNNs."
      ],
      "say": "Backpropagation multiplies gradients layer by layer, so values below one collapse and early layers stop learning. Sigmoid made it worse because its derivative caps at 0.25. The fixes: ReLU-style activations pass the gradient through unchanged, residual connections give it a path around each block, and normalisation plus careful initialisation keep activations in range. All of these are visible in a transformer, which is why depth stopped being the limit.",
      "numbers": "Sigmoid's maximum derivative is 0.25, so across ten layers the activation derivatives alone shrink the gradient by at least a million times (0.25^10 ≈ 1e-6). Gradient clipping around 1.0 is standard for the exploding case.",
      "wrong": "Naming ReLU alone. Residual connections are the more important fix at real depth, and skipping them misses the link to transformers.",
      "follow": "Where do you see all three of those fixes in a transformer block?",
      "followAnswer": "Each block has two sublayers, attention and a feed-forward network. Each is wrapped in a residual connection, so its input is added back to its output. Each is preceded by a normalisation layer - layer norm or RMSNorm - in the pre-norm design. And the feed-forward network uses a non-saturating activation such as GELU or SwiGLU. Gradient clipping lives in the training script."
    },
    {
      "id": "ml-09",
      "q": "Explain precision, recall and F1 with a real business trade-off.",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "metrics",
        "classification",
        "basics"
      ],
      "why": "The most-asked ML question in any loop. Reciting definitions passes nothing - connecting them to a cost does.",
      "simple": "**Short version: precision is how often your alarms are right; recall is how many of the real cases you catch. Which one matters more depends on which mistake is more expensive.**\n\nTake a fraud model. It flags a transaction as fraudulent or not.\n\nPrecision asks: of everything I flagged, how much was actually fraud? Every false alarm pulls it down.\n\nRecall asks: of all the real fraud, how much did I catch? Every miss pulls it down.\n\nThey pull against each other. Flag everything and recall is perfect while precision collapses. Flag only the one case you are certain of and precision is perfect while recall is near zero.\n\nSo the question is never 'which is better' - it is which mistake costs more in this business.\n\nFraud detection at a bank: a missed fraud is a direct loss and a regulatory problem, while a false alarm is one annoyed customer and a phone call. Recall wins.\n\nA spam filter: a missed spam is mildly irritating, but a legitimate invoice in the junk folder loses real money. Precision wins.\n\nA cancer screening test: a miss can be fatal, a false positive is a follow-up scan. Recall wins, heavily.\n\nF1 is the harmonic mean of the two, useful as one number when both matter roughly equally. The harmonic mean is deliberately unforgiving - it punishes imbalance, so 0.9 and 0.1 gives about 0.18, not 0.5.",
      "points": [
        "Precision: of what I flagged, how much was right. Hurt by false alarms.",
        "Recall: of what was there, how much I caught. Hurt by misses.",
        "They trade against each other - the threshold moves both.",
        "Choose by which error costs the business more, never by default.",
        "F1 is the harmonic mean; it punishes imbalance rather than averaging it."
      ],
      "say": "Precision is how much of what I flagged was correct, recall is how much of the real thing I caught, and they trade against each other through the threshold. Which one I optimise depends on cost: for fraud a miss is a direct loss so I favour recall, for a spam filter a false positive buries a real invoice so I favour precision. F1 is the harmonic mean when both matter, and it punishes imbalance rather than averaging it away.",
      "numbers": "The harmonic mean is deliberately harsh: precision 0.9 with recall 0.1 gives an F1 near 0.18, not 0.5. That is the point of using it.",
      "wrong": "Reciting the two formulas and stopping. The question is always really about the business trade-off, and the follow-up will force it.",
      "follow": "Your fraud model has 95% precision and 40% recall. Is that good?",
      "followAnswer": "It depends on the cost of a miss. Ninety-five percent precision means the alerts are trustworthy, but forty percent recall means we miss sixty percent of the fraud. For a bank that is usually too low. So I would lower the threshold, see how much precision we give up for extra recall, and check the review team can handle the extra alerts."
    },
    {
      "id": "ml-02",
      "q": "Why is accuracy a bad metric, and what do you use instead?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "metrics",
        "imbalanced-data"
      ],
      "why": "The most useful metric question there is, and it transfers directly to GenAI evaluation.",
      "simple": "Because of imbalance. If one in a hundred claims is fraudulent, a model that says \"not fraud\" every single time is 99% accurate and completely useless. Accuracy hid the only thing you cared about.\n\nSo you look at the confusion matrix and pick metrics that match the cost of each mistake.\n\nPrecision is: of the cases I flagged, how many were real. It matters when a false positive is expensive - you are sending investigators, or blocking a legitimate transaction.\n\nRecall is: of the real cases, how many did I catch. It matters when a false negative is expensive - a missed fraud, a missed disease.\n\nF1 combines them when you need one number. AUC-PR is the better summary than AUC-ROC on heavily imbalanced data, because ROC looks optimistic when negatives dominate.\n\nAnd the answer that scores: which mistake costs more in this business? That decides the metric, and it is a question you ask rather than assume.\n\nFor the precision-recall trade-off itself, see the precision, recall and F1 card; for ROC against PR-AUC, see the ROC card.",
      "points": [
        "Imbalance makes accuracy meaningless - a constant prediction can score 99%.",
        "Precision: of those I flagged, how many were real. Guards against false positives.",
        "Recall: of the real cases, how many I caught. Guards against false negatives.",
        "F1 when you need one number; AUC-PR over AUC-ROC on heavy imbalance.",
        "The metric follows from which error costs more. Ask, do not assume."
      ],
      "say": "Because of imbalance - if one in a hundred cases is fraud, predicting \"not fraud\" always is 99% accurate and useless. So I look at the confusion matrix and choose by which error costs more. Precision when a false positive is expensive, recall when a false negative is. F1 when I need one number, and AUC-PR rather than ROC on heavy imbalance. Which mistake costs more is a question I ask.",
      "numbers": "On a 1% positive rate, a constant negative prediction scores 99% accuracy and 0% recall. That is the example to quote.",
      "wrong": "Listing precision, recall and F1 without connecting them to the cost of each error. The connection is the answer.",
      "follow": "The business wants both high precision and high recall. What do you tell them?",
      "followAnswer": "That with a fixed model the two trade against each other - the threshold only moves us along the curve. To get both, the model itself must improve: better features, more labelled data or a better model. Meanwhile I show them the precision-recall curve, ask which error costs more, and agree an operating point, for example the best recall we can get with precision above 80%."
    },
    {
      "id": "ml-10",
      "q": "What is the ROC curve, and when is PR-AUC the better choice?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "metrics",
        "imbalance",
        "evaluation"
      ],
      "why": "Whether you know that ROC-AUC flatters a model on imbalanced data - which is nearly every real problem.",
      "simple": "**Short version: ROC-AUC asks \"does the model rank positives above negatives?\". When positives are rare it can look great while the alert queue is full of false alarms. PR-AUC shows that problem directly.**\n\nA classifier outputs a score. Sweep the threshold from high to low and you get a different confusion matrix at each point. The ROC curve plots the true positive rate (recall) against the false positive rate across that sweep. AUC is the area under it: the probability that a random positive scores higher than a random negative. 0.5 is a coin flip, 1.0 is perfect.\n\nThe catch is the false positive rate. It divides false alarms by all negatives, and when negatives are huge, false alarms barely move it.\n\nExample: fraud is 0.1% of one million transactions. The model wrongly flags 10,000 legitimate ones - an unusable alert queue. Yet the false positive rate is 10,000 ÷ 999,000, about 1%. ROC-AUC still looks excellent.\n\nThe precision-recall curve fixes this, because precision divides by what you flagged, not by all negatives. Those 10,000 false alarms hit precision hard.\n\nRule of thumb: with balanced classes, ROC-AUC is fine. With rare positives - fraud, defects, disease - lead with PR-AUC and precision at your operating threshold, and report ROC-AUC alongside. The baselines differ too: random ROC-AUC is 0.5, but random PR-AUC equals the positive rate. At 0.1% prevalence, a PR-AUC of 0.4 is strong.",
      "points": [
        "ROC-AUC: probability a random positive outranks a random negative.",
        "FPR divides by all negatives, so imbalance hides false alarms.",
        "PR-AUC uses precision, which reacts to the alert-queue cost.",
        "Baseline: ROC 0.5 always; PR equals the positive rate.",
        "Rare positives are the normal case - lead with PR-AUC there, ROC-AUC alongside."
      ],
      "say": "ROC plots true positive rate against false positive rate as you sweep the threshold, and AUC is the chance a random positive outranks a random negative. The catch is that false positive rate divides by all negatives, so on imbalanced data thousands of false alarms barely move it and the curve looks great. PR-AUC uses precision instead, which reflects the alert-queue cost, so for rare positives that is what I report.",
      "numbers": "At 0.1% prevalence, random PR-AUC is 0.001. So a PR-AUC of 0.4 is a strong model, even though the same number would look poor as an ROC-AUC.",
      "wrong": "Reporting a 0.97 ROC-AUC on a 1%-positive problem as proof it works. On its own it can hide a precision too low to be usable, and the follow-up will ask what precision looks like at the operating threshold.",
      "follow": "Your PR-AUC is 0.4 and the business asks if that is good. Answer them.",
      "followAnswer": "Compared with what? A random model's PR-AUC equals the positive rate, so at 0.1% fraud, 0.4 is hundreds of times better than chance. But the business needs an operating point, not an area. So I translate it: at our chosen threshold we catch this share of fraud, and this share of alerts are real. Then I compare that with the system they use today."
    },
    {
      "id": "ml-04",
      "q": "How do you handle imbalanced data?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "imbalanced-data",
        "training"
      ],
      "why": "Common and practical. The good answer starts by questioning whether resampling is needed at all.",
      "simple": "First ask whether it is actually a problem. Imbalance itself is not - many models handle it fine. The problem is when the minority class is what you care about and the model has learned to ignore it. So check the recall on that class before changing anything.\n\nThen the options, cheapest first. Change the metric and the decision threshold - often the whole fix, because the model's ranking may already be good and only the 0.5 cutoff is wrong. Use class weights, which most libraries support and which needs no data manipulation. Then resampling: undersample the majority when you have plenty of data, oversample or synthesise the minority when you do not.\n\nThe rule about resampling that separates people who have done this: resample inside the training fold only, never before the split, and never touch the validation or test set. A resampled test set gives you a number that does not correspond to anything real.\n\nAnd if the minority class has only a handful of examples, consider whether this is anomaly detection rather than classification.",
      "points": [
        "First check whether minority-class recall is actually bad. Imbalance alone is not a problem.",
        "Adjust the decision threshold - often the entire fix.",
        "Class weights next: no data manipulation needed.",
        "Then resampling - inside the training fold only.",
        "Never resample validation or test. The number stops meaning anything.",
        "Very few positives → consider anomaly detection instead."
      ],
      "say": "First I check whether minority-class recall is actually bad, because imbalance alone is not a problem. Then, cheapest first: adjust the decision threshold, which is often the whole fix since the ranking may already be fine. Then class weights, which need no data manipulation. Then resampling, inside the training fold only - never on validation or test, because a resampled test score corresponds to nothing real.",
      "numbers": "The default 0.5 threshold is rarely right on imbalanced data. Choose it from the precision-recall curve against the business cost of each error.",
      "wrong": "\"I use SMOTE.\" Jumping to synthesis before trying the threshold and class weights, and it invites the question of whether you applied it before or after the split.",
      "follow": "Where exactly in your pipeline does the resampling happen?",
      "followAnswer": "Inside the training fold, after the split, and only on training data. In scikit-learn I put the sampler inside an imbalanced-learn Pipeline, so cross-validation resamples each training fold separately. Validation and test keep the real class balance, because those numbers must reflect production. Resampling before the split would leak synthetic copies of minority examples into validation and inflate the score."
    },
    {
      "id": "ml-03",
      "q": "What is data leakage and how do you catch it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "ml-fundamentals",
        "leakage",
        "validation"
      ],
      "why": "The failure that produces excellent offline results and a useless production model. Experience shows immediately.",
      "simple": "Leakage is when information reaches the model during training that will not be available when it actually runs. The model looks brilliant in validation because it was effectively shown the answer.\n\nThe forms it takes. Target leakage - a feature that is a consequence of the outcome rather than a cause. A column like `payout_date` predicting claim approval is perfect, and useless, because it only exists after approval. Train-test contamination - scaling or imputing across the whole dataset before splitting, so test statistics leaked into training. Temporal leakage - random splitting on time-series data, so the model trained on the future to predict the past. And duplicate rows landing on both sides of the split.\n\nHow you catch it: be suspicious of any result that is too good. Check feature importance - a single feature dominating is the classic signature. Ask when each feature becomes available in real time, which is the question that catches target leakage. And split by time whenever the data has time in it.\n\nThe senior habit: fit every transformation inside the training fold only.",
      "points": [
        "Target leakage - a feature that exists only because the outcome happened.",
        "Contamination - scaling or imputing before splitting.",
        "Temporal leakage - random split on time-ordered data.",
        "Duplicates landing on both sides of the split.",
        "Signature: results too good; one feature dominating importance.",
        "The catch-all test: when does this feature become available in production?",
        "Fit every transformation inside the training fold only."
      ],
      "say": "Leakage is information reaching the model in training that will not exist at prediction time, so validation looks brilliant and production fails. Target leakage is a feature that exists only because the outcome happened. Contamination is scaling before splitting. Temporal leakage is random-splitting time-ordered data. I catch it by being suspicious of results that are too good, checking whether one feature dominates, and asking when each feature becomes available.",
      "numbers": "No number applies. The tell is a suspiciously high score and one feature carrying most of the importance.",
      "wrong": "\"I use train-test split to avoid it.\" On time-ordered data a random split is itself the cause of temporal leakage, so the follow-up will show this answer names the mechanism that created the problem.",
      "follow": "Your model scores 0.99 AUC. Are you pleased?",
      "followAnswer": "Suspicious first. On most real problems 0.99 means leakage until proven otherwise. I check feature importance for one dominant feature, ask when each top feature becomes available in production, look for duplicates or the same entity on both sides of the split, and confirm the split respects time. If it survives all that, I test on a fresh, later sample before believing it."
    },
    {
      "id": "ml-26",
      "q": "Explain data drift against concept drift and how you detect each.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "monitoring",
        "drift",
        "production"
      ],
      "why": "The vocabulary for why a model silently decays, and it applies directly to GenAI monitoring.",
      "simple": "Both mean your model is quietly getting worse. They have different causes and different fixes.\n\nData drift is the input distribution changing while the underlying relationship holds. You launch in three cities, expand to fifteen, and the incoming customer profile no longer resembles your training data. The mapping from features to outcome is unchanged - you are just extrapolating into regions you never saw. Retraining on recent data usually fixes it.\n\nConcept drift is the relationship itself changing. What predicted fraud in 2024 does not predict it in 2026, because fraudsters adapted. Your inputs may look identical while the correct answer for the same input has changed. This is worse, because retraining only helps once you have enough newly-labelled data reflecting the new reality - and that means waiting for the labels.\n\nDetection differs accordingly. Data drift is detectable immediately without labels: compare recent feature distributions against training, using population stability index or a KS test per feature. Concept drift needs outcome labels, so you can only see it once ground truth arrives - which for churn might be ninety days later.\n\nThat lag is why you monitor proxies too: prediction distribution shifts, confidence dropping, or the rate of manual overrides climbing. A sudden change in the share of positive predictions is an early warning that costs nothing to watch.\n\nFor GenAI the same split applies. Data drift is users asking different questions than you designed for. Concept drift is the correct answer changing because the underlying policy changed - and your RAG index still serves the old document.",
      "points": [
        "Data drift: inputs change, relationship holds. Retraining usually fixes it.",
        "Concept drift: the relationship changes. Needs new labels.",
        "Data drift is detectable without labels - PSI or KS per feature.",
        "Concept drift only shows once ground truth arrives.",
        "Watch prediction distribution and override rate as early proxies."
      ],
      "say": "Data drift is the input distribution moving while the relationship holds - you expand to new cities and see customers unlike your training data. Retraining usually fixes that. Concept drift is the relationship itself changing, like fraud patterns adapting, and that needs newly-labelled data, so it is harder. I detect data drift without labels using PSI or a KS test per feature, and watch prediction distribution and override rates as proxies while waiting for ground truth.",
      "numbers": "PSI below 0.1 is stable, 0.1 to 0.2 warrants attention, above 0.2 is significant drift. Alert on the features the model actually weights, not on all of them.",
      "wrong": "Treating them as one thing. They have different detection methods and different remedies, and conflating them means monitoring for the easy one and missing the dangerous one.",
      "follow": "Feature distributions are unchanged but accuracy fell 8 points. Which is it?",
      "followAnswer": "Concept drift is the likely answer: the inputs look the same but their relationship to the outcome changed. Before concluding that, I rule out a change in how labels are recorded, and train-serve skew hiding inside a stable-looking distribution. Then I confirm by retraining on recent labelled data - if the recent model recovers the accuracy, the concept moved."
    },
    {
      "id": "ml-30",
      "q": "You have 500 labelled examples and need a classifier. LLM or fine-tuned BERT?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "decision",
        "cost",
        "classification",
        "genai"
      ],
      "why": "The most practical modern ML decision, and the one that connects this topic to the rest of the portal.",
      "simple": "**Short version: try the LLM first because it is quick. Switch to a small fine-tuned model when volume, latency or cost demand it - or use the LLM to label data for that small model.**\n\nStart with the LLM, because it costs an afternoon. Write a few-shot prompt with a dozen examples and evaluate on a held-out set. No training, no infrastructure, and by the end of the day you have a real accuracy number. Often it is good enough.\n\nThree things push you toward fine-tuning a small encoder model such as BERT, DeBERTa or ModernBERT.\n\nVolume. An LLM call per item costs real money at millions of items a month. A small encoder runs on a CPU or a cheap GPU for almost nothing per call.\n\nLatency. An encoder classifies in milliseconds to tens of milliseconds. An API call takes hundreds of milliseconds or more. In a real-time path, that decides it.\n\nSubtle domain labels. 500 clean examples is enough to fine-tune a small encoder, and it often beats prompting because the boundaries come from the data, not from prompt wording.\n\nWhat keeps you on the LLM: label definitions still changing, low volume, or a task that needs broad world knowledge.\n\nThe move that gets both is distillation. Use the LLM to label ten thousand unlabelled examples, check a sample by hand, and train the encoder on that. Keep your 500 gold labels as the test set that proves it worked.",
      "points": [
        "Prototype with the LLM first - a working baseline in an afternoon.",
        "High volume or tight latency pushes you to a fine-tuned encoder.",
        "500 clean examples is enough to fine-tune a small encoder.",
        "Unstable labels or low volume favour keeping the LLM.",
        "Distil: LLM labels the bulk data, encoder serves production."
      ],
      "say": "I would prototype with the LLM first, because few-shot gives a real accuracy number in an afternoon with no infrastructure. Then I decide on volume and latency: at millions of calls a month, or in a real-time path, a fine-tuned encoder is far cheaper and responds in milliseconds. The best of both is distillation - use the LLM to label ten thousand examples, train the encoder on that, and keep my 500 gold labels as the test set.",
      "numbers": "500 clean examples is a workable fine-tuning set for a small encoder. Per-call, an encoder on CPU is orders of magnitude cheaper than a hosted LLM API.",
      "wrong": "'Use an LLM, it is state of the art.' It ignores cost and latency, which are exactly what the question is testing, and it does not survive the volume follow-up.",
      "follow": "This runs on ten million documents a month. Does your answer change?",
      "followAnswer": "Yes. At ten million a month, per-call LLM cost and latency dominate. So I would use the LLM to label a large sample, check a slice by hand, and fine-tune a small encoder for production. I keep the LLM only for the low-confidence cases the encoder routes to it. My 500 gold labels stay as the test set that proves the encoder matches the LLM."
    },
    {
      "id": "ml-11",
      "q": "How do you pick a classification threshold?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "metrics",
        "thresholds",
        "deployment"
      ],
      "why": "0.5 is a default, not a decision. This checks whether you have deployed a classifier or only trained one.",
      "simple": "A model outputs 0.73. Is that positive or negative? Only a threshold decides, and 0.5 is just the value the library picked for you.\n\nThe right way is a cost matrix. Write down what each outcome is worth:\n\n    false negative - missed fraud       = ₹8,000 average loss\n    false positive - blocked good txn   = ₹200 support cost\n\nA miss costs forty times a false alarm, so you should be flagging far more aggressively than 0.5. If the scores are calibrated probabilities there is a formula: flag when p × ₹8,000 > (1 − p) × ₹200, which gives p > 200 ÷ 8,200 ≈ 0.024. With uncalibrated scores - the usual case - sweep the threshold over your validation set, compute total cost at each point, and take the minimum. Either way the answer is far below 0.5.\n\nWhen you genuinely cannot get costs, use a constraint instead. 'The review team can process 500 alerts a day' sets the threshold by capacity. 'Regulation requires catching 95% of cases' sets it by recall.\n\nTwo things people forget. Model scores are usually not calibrated - a 0.7 from a random forest, or from any model trained with class weights or resampling, often does not mean 70% likelihood, so do not read the threshold as a probability unless you calibrated it. And the optimal threshold drifts as the base rate changes, so it needs re-checking on a schedule, not setting once.",
      "points": [
        "0.5 is a library default, never an analysis.",
        "Build a cost matrix and minimise expected cost on validation data.",
        "No costs available? Use a capacity or regulatory constraint instead.",
        "Raw scores are not calibrated probabilities without calibration.",
        "Re-check the threshold as prevalence drifts."
      ],
      "say": "I treat the threshold as a business decision, not a default. I write a cost matrix - what a miss costs against what a false alarm costs - then sweep the threshold on validation data and pick the point minimising expected cost. If costs are not available I use a constraint, like the number of alerts the review team can handle. And I re-check it periodically, because the optimum moves as prevalence drifts.",
      "numbers": "If a miss costs 40 times a false alarm, the break-even threshold for calibrated probabilities is 1 ÷ (1 + 40) ≈ 0.024 - far below 0.5. With uncalibrated scores find it by sweeping on validation, never on test.",
      "wrong": "Reporting metrics at 0.5 and treating that as the model's performance. You are reporting one arbitrary operating point out of a hundred available.",
      "follow": "Your threshold was set six months ago. What would make you revisit it?",
      "followAnswer": "Anything that changes the cost calculation: the base rate of positives shifting, a retrained model, calibration drifting, the cost of a miss or a false alarm changing, or the review team's capacity changing. I would also revisit it if alert volume or precision at the threshold moved noticeably. In practice I schedule a quarterly re-check rather than waiting for a complaint."
    },
    {
      "id": "ml-31",
      "q": "What is model calibration, and why can a high-AUC model still be risky?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml",
        "calibration",
        "probability",
        "metrics"
      ],
      "why": "Senior ML roles often require turning model scores into decisions, where probability quality matters beyond ranking metrics.",
      "simple": "Calibration asks whether a predicted probability means what it says. If a model gives many cases a score around 0.8, roughly 80% of those cases should actually be positive in a well-calibrated system.\n\nAUC measures ranking: does the model usually score positives above negatives? A model can rank very well and still output probabilities that are too confident or too cautious. That matters when the score drives pricing, risk, human review or a threshold tied to cost.\n\nI check a reliability diagram - predicted probability against the observed positive rate, in bins - plus a proper probability metric such as Brier score or log loss, and often expected calibration error (ECE). If calibration is poor, I fit a calibration mapping on held-out data: Platt scaling or isotonic regression for classical models, temperature scaling for neural networks. Class weights and resampling are common causes, because they deliberately distort the base rate.\n\nThen I re-check by segment and over time. A single global curve can hide one population where confidence is badly wrong, and drift can break calibration even when ranking quality looks stable.",
      "points": [
        "Calibration compares predicted probability with observed frequency.",
        "AUC measures ranking, not probability correctness.",
        "Check reliability curves plus Brier score, log loss or ECE.",
        "Fix with Platt, isotonic or temperature scaling - fitted on held-out data, not training data.",
        "Class weights and resampling distort probabilities; recalibrate after using them.",
        "Monitor calibration by segment and over time."
      ],
      "say": "Calibration asks whether a probability means what it says. If the model predicts about 0.8 for many cases, roughly 80 percent should be positive. AUC only tells me how well the model ranks positives above negatives, so a high-AUC model can still be badly overconfident. I check a calibration curve and probability metrics such as Brier score, calibrate on held-out data if needed, and monitor by segment because one group can be miscalibrated even when the average looks fine.",
      "numbers": "A prediction of 0.8 is interpretable only if outcomes near that score occur about 80% of the time over a suitable sample. Do not infer calibration from AUC alone.",
      "wrong": "Saying an AUC of 0.9 means a predicted probability of 0.9 is trustworthy. Ranking quality and probability calibration are different properties.",
      "follow": "Your ranking metric is unchanged but users say the risk score feels more aggressive. Which calibration view would you compare across releases?"
    },
    {
      "id": "ml-19",
      "q": "Explain k-means and how you choose k.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "clustering",
        "unsupervised",
        "basics"
      ],
      "why": "The standard unsupervised question, and its assumptions matter directly for embedding clustering.",
      "simple": "**Short version: k-means groups points around k centres by repeatedly moving each centre to the middle of its group. It works best on round, similar-sized, well-scaled clusters, and choosing k is partly judgement.**\n\nThe algorithm: pick k starting centres. Assign every point to its nearest centre. Move each centre to the average of its points. Repeat until nothing moves. It always converges, but not always to the best answer, so run it several times.\n\nChoosing k. The elbow method plots within-cluster spread against k and looks for the bend where gains slow down; the bend is often unclear. The silhouette score measures how much closer each point is to its own cluster than to the next one, from -1 to 1, and usually gives a clearer peak. Often the business decides: five segments because marketing can run five campaigns.\n\nThe assumptions are where a senior answer stands out. k-means expects round, similar-sized clusters separated by straight-line (Euclidean) distance. Long or curved clusters break it. It is sensitive to feature scale, so standardise first. It is sensitive to the starting centres, so use k-means++ and several restarts. And it forces every point into a cluster, so outliers drag centres around.\n\nFor text embeddings, normalise the vectors so distance tracks cosine similarity, or use HDBSCAN, which finds clusters of any shape and labels outliers as noise.",
      "points": [
        "Assign to nearest centre, move centres to the mean, repeat.",
        "Silhouette usually gives a clearer peak; the elbow is often ambiguous.",
        "Assumes spherical, similar-sized, Euclidean-separated clusters.",
        "Standardise features; use k-means++ and multiple restarts.",
        "For embeddings prefer cosine, or HDBSCAN for arbitrary shapes."
      ],
      "say": "k-means alternates assigning points to the nearest centre and moving centres to the mean until it converges. For k I prefer silhouette score over the elbow, because the elbow is usually ambiguous, and often the business constrains k anyway. The important part is the assumptions: spherical, similar-sized clusters under Euclidean distance, sensitive to scale and initialisation. For embeddings I would use cosine distance or HDBSCAN instead.",
      "numbers": "Standardise tabular features before k-means (for embeddings, L2-normalise instead). Use k-means++ with around ten restarts - a single random initialisation regularly lands in a poor local optimum.",
      "wrong": "Describing the algorithm with no mention of assumptions. The follow-up is always about where it fails, and shape and scale are the answers.",
      "follow": "You cluster 100k document embeddings and get one huge cluster. What went wrong?"
    },
    {
      "id": "ml-20",
      "q": "What is PCA and when would you use it?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "dimensionality",
        "unsupervised",
        "embeddings"
      ],
      "why": "Connects classical ML to embedding work, where dimensionality is a live cost concern.",
      "simple": "PCA finds the directions along which your data varies most, and re-expresses the data in terms of those directions. The first component captures the most variance, the second the most of what remains while being perpendicular to the first, and so on. Keep the first few and you have fewer dimensions holding most of the information.\n\nGeometrically it is a rotation of the axes to align with the shape of the data, then dropping the axes where the data barely varies.\n\nChoose the number of components by cumulative explained variance - keep enough to reach 95%, say - rather than picking a round number.\n\nWhere it genuinely helps: compressing embeddings for cheaper storage and faster search, removing multicollinearity before a linear model, denoising, and 2D visualisation.\n\nThe costs are real. Components are linear combinations of every original feature, so you lose most of the interpretability - you can no longer point at a single original feature that drove a prediction. It only captures linear structure. It is scale-sensitive, so standardise first or the largest-unit feature dominates the first component. And it is unsupervised, so a low-variance direction that happens to be exactly what predicts your target can be discarded.\n\nFor embeddings specifically, PCA works but Matryoshka embeddings are usually better if the model supports them, since they are trained so that truncating dimensions degrades gracefully - no separate transform to fit, store and version.",
      "points": [
        "Rotates axes onto directions of maximum variance, then truncates.",
        "Choose components by cumulative explained variance, not a round number.",
        "Standardise first - PCA is scale-sensitive.",
        "Unsupervised: it can discard a low-variance but predictive direction.",
        "For embeddings, Matryoshka truncation often beats fitting a PCA."
      ],
      "say": "PCA rotates the axes onto the directions of greatest variance and keeps the first few, so you hold most of the information in fewer dimensions. I choose the count by cumulative explained variance rather than a round number, and I standardise first because it is scale-sensitive. The costs are losing interpretability and only capturing linear structure. For embeddings I would check Matryoshka truncation first, since it needs no fitted transform.",
      "numbers": "95% explained variance is a common cutoff. Embeddings often keep most retrieval quality at half their dimensions - but measure recall, do not assume it.",
      "wrong": "Calling it feature selection. It is feature extraction - every component mixes all the original features, which is exactly why interpretability disappears.",
      "follow": "Does PCA help your model's accuracy?"
    },
    {
      "id": "ml-21",
      "q": "How do you handle missing data?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "data",
        "preprocessing",
        "basics"
      ],
      "why": "The mechanism behind the missingness decides the method - that reasoning is what is being tested.",
      "simple": "Before choosing a technique, ask why the data is missing. That determines everything.\n\nMissing completely at random: a sensor dropped readings for unrelated reasons. Dropping rows is safe here, just wasteful.\n\nMissing at random: missingness depends on other observed variables - a survey question skipped more often by younger respondents. You can impute using those other variables.\n\nMissing not at random: missingness depends on the unobserved value itself. High earners decline to state income. This is the dangerous case, because imputing from the observed data alone is systematically biased and the fact of missingness is itself information.\n\nThen the methods. Dropping rows is fine for a few percent if the data is missing completely at random, and destructive beyond that. Dropping a column is worth considering past roughly half missing. Mean or median imputation is quick but shrinks variance and distorts correlations. Model-based imputation using the other features is better but risks leakage if fitted before splitting.\n\nThe technique people forget, and the one that most often wins: add a binary was-missing indicator alongside the imputed value. In the not-at-random case that flag frequently carries more signal than the value would have. A blank income field is a genuine predictor.\n\nAnd boosted trees handle missing values natively by learning a default direction per split, so for tabular work the best answer is often to impute nothing and let the model decide.",
      "points": [
        "Diagnose the mechanism first - MCAR, MAR or MNAR.",
        "MNAR is the dangerous case; imputing from observed data alone is biased.",
        "Mean imputation shrinks variance and distorts correlation.",
        "Add a was-missing indicator - often the strongest signal available.",
        "XGBoost and LightGBM handle missingness natively; use that."
      ],
      "say": "I start with why it is missing, because that decides the method. Completely at random means dropping is safe; at random means I can impute from other features; not at random means any imputation is biased and the missingness itself carries signal. In that case I add a was-missing indicator, which is frequently more predictive than the value. For tabular models I often let XGBoost handle it natively rather than imputing at all.",
      "numbers": "Under about 5% missing and completely at random, dropping rows is usually fine. Past roughly 50% in a column, consider dropping the column and keeping the indicator.",
      "wrong": "'Fill with the mean.' It is the reflex answer, it shrinks variance, distorts relationships, and throws away the information that the value was absent.",
      "follow": "Income is missing for 30% of rows, mostly high earners. What do you do?"
    },
    {
      "id": "ml-22",
      "q": "What is feature engineering and does it still matter?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "features",
        "tabular",
        "practice"
      ],
      "why": "Tests calibration. The answer is genuinely split by data type, and a blanket answer either way is wrong.",
      "simple": "Feature engineering is constructing inputs that expose the pattern to the model. Not new information - a better representation of information you already have.\n\nThe honest answer is that it depends entirely on the data type, and saying so is the point.\n\nFor unstructured data - text, images, audio - it is largely over. Deep learning learns representations from raw input better than hand-crafted features ever did. Hand-built n-gram features are now mostly a fast baseline (TF-IDF plus logistic regression is still a strong one); the default is an embedding or a fine-tuned encoder.\n\nFor tabular data it absolutely still matters, and it is usually where the accuracy actually comes from. A gradient-boosted model cannot invent a ratio. Give it revenue and headcount separately and it must approximate revenue-per-employee through many splits; give it the ratio directly and one split captures it.\n\nThe high-value moves on tabular data: ratios and differences between related columns, aggregations over an entity such as a customer's mean transaction and their count over 30 days, time-since-last-event, cyclical encoding of hour and weekday as sine and cosine so 23:00 and 01:00 are close, and target encoding for high-cardinality categories - computed inside the cross-validation fold, or you leak.\n\nIn GenAI work the same instinct reappears with a different name. Choosing what goes into a chunk, what metadata you attach, how you structure a prompt - that is feature engineering for LLMs. The retrieved context is the feature vector.",
      "points": [
        "Largely superseded for text, images and audio.",
        "Still decisive for tabular data - models cannot invent ratios.",
        "Ratios, aggregations, time-since, cyclical encodings.",
        "Target encoding must be computed inside the fold or it leaks.",
        "Chunk design and prompt structure are its GenAI equivalent."
      ],
      "say": "It depends on the data type. For text and images, learned representations beat hand-crafted features, so it is largely over. For tabular data it is still where most of the accuracy comes from - a boosted model cannot invent a ratio, so giving it revenue per employee directly beats making it approximate that through splits. Ratios, entity aggregations and time-since features are the reliable wins, with target encoding computed inside the fold.",
      "numbers": "On tabular problems, good feature engineering routinely beats model choice. Moving from logistic regression to XGBoost often gains less than adding the right ten features.",
      "wrong": "'Deep learning made it obsolete.' True for unstructured data and wrong for tabular, which is most of what enterprises actually run.",
      "follow": "Give me three features you would build for a churn model."
    },
    {
      "id": "ml-41",
      "q": "Batch norm vs layer norm - and what does dropout do?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "deep-learning",
        "normalisation",
        "regularisation"
      ],
      "why": "Checks that you know why transformers use layer norm, and the train-versus-inference behaviour behind a classic bug.",
      "simple": "Both normalisations rescale activations so each layer sees inputs in a steady range - roughly mean zero, spread one - then apply a learned scale and shift. Steady inputs make training faster and more stable. The difference is what they average over.\n\nBatch norm averages each feature across the examples in the batch. It works well in CNNs for images. But it depends on the batch: small batches give noisy statistics, and at inference there may be one example, so it uses running averages saved during training.\n\nLayer norm averages across the features of a single example. It does not care about batch size or sequence length, and it behaves the same in training and inference. That is why transformers use it. Many modern LLMs use RMSNorm, a cheaper variant that skips subtracting the mean and only rescales.\n\nDropout is different - it is regularisation, not normalisation. During training it randomly switches off a fraction of units, say 10%, on each step. The network cannot lean on any single unit, so it learns sturdier, spread-out features. At inference dropout is off. PyTorch scales up the kept units during training, so nothing needs changing at inference.\n\nThe classic bug links them: forget `model.eval()` and dropout stays on while batch norm keeps updating its statistics.\n\nOne modern footnote: large LLM pre-training often uses little or no dropout, because with so much data overfitting is not the main risk. It still matters for fine-tuning and smaller models.",
      "points": [
        "Batch norm: normalise each feature across the batch. Great for CNNs; needs running stats at inference.",
        "Layer norm: normalise across one example's features. Batch-independent - the transformer choice.",
        "RMSNorm: layer norm without mean-centring; used in Llama-style LLMs.",
        "Dropout: randomly zero units during training only - a regulariser.",
        "Forgetting `model.eval()` leaves dropout on and batch-norm stats updating."
      ],
      "say": "Both rescale activations to a stable range and then apply a learned scale and shift. Batch norm computes statistics per feature across the batch, which suits CNNs but depends on batch size and needs running averages at inference. Layer norm computes them across one example's features, so it is batch-independent - that is why transformers use it, often as RMSNorm. Dropout is regularisation: it randomly zeroes units during training and is switched off at inference.",
      "numbers": "Typical dropout rates are 0.1 to 0.5, with 0.1 common in transformers when it is used at all; LoRA adapters often use 0.05 to 0.1. Batch norm gets unreliable at small per-device batch sizes, roughly below 16.",
      "wrong": "\"They are the same thing on different axes, so it does not matter.\" The axis is exactly why it matters: batch norm struggles with small batches and variable-length sequences, which is why transformers use layer norm.",
      "follow": "Your model gives different predictions for the same input on every call at inference. What is the likely bug?",
      "followAnswer": "Most likely the model is still in training mode, so dropout is active and randomly zeroing units on every call. I would check that `model.eval()` is called before inference, and wrap it in `torch.no_grad()` or inference mode. Eval mode also stops batch norm updating its running statistics. For an LLM, the other obvious cause is sampling with temperature above zero."
    },
    {
      "id": "ml-42",
      "q": "CNNs, RNNs and LSTMs in one minute - and why did transformers replace RNNs for language?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "deep-learning",
        "cnn",
        "rnn",
        "architecture"
      ],
      "why": "Checks you know the pre-transformer building blocks and exactly which problem attention solved.",
      "simple": "A CNN (convolutional neural network) is built for grid data such as images. It slides small filters across the image, each looking for a local pattern like an edge. The same filter is reused everywhere, so it needs far fewer weights than a fully connected layer and spots a pattern wherever it appears. Stacked layers build edges into shapes into objects.\n\nAn RNN (recurrent neural network) is built for sequences. It reads one token at a time and carries a hidden state - a running memory - from each step to the next. The problem: gradients pass back through every step, so over long sequences they vanish and the network forgets early words.\n\nAn LSTM (long short-term memory) adds gates - small learned switches that decide what to keep, what to forget and what to output. That lets useful information survive much longer. A GRU is a simpler version of the same idea.\n\nWhy transformers replaced them for language: an RNN must process tokens one after another, so training cannot run in parallel across a sequence, and distant words connect only through many steps. Attention connects every token to every other token directly, and the whole sequence trains at once on GPUs.\n\nWhere they still matter: CNNs remain strong for vision on small data and on edge devices. And recurrent ideas are back in state-space models such as Mamba, used in some hybrid LLMs for cheaper long-context processing.",
      "points": [
        "**CNN**: shared local filters; finds a pattern anywhere; efficient on images.",
        "**RNN**: hidden state carried step by step; vanishing gradients over long sequences.",
        "**LSTM/GRU**: gates decide what to keep or forget; much longer memory.",
        "Transformers won on language: parallel training and direct token-to-token paths.",
        "Still relevant: CNNs for small-data and edge vision; state-space models (Mamba) revive recurrence for long context."
      ],
      "say": "CNNs slide shared filters over grid data like images, so they detect local patterns anywhere with few parameters. RNNs process a sequence one step at a time with a hidden state, but gradients vanish over long sequences. LSTMs add gates that control what to keep or forget, which extends memory. Transformers replaced them for language because attention links every token directly and trains the whole sequence in parallel, instead of step by step.",
      "numbers": "An RNN needs n sequential steps for a sequence of length n; a transformer layer processes all n positions at once, paying for it with attention cost that grows with n squared. That trade is the whole story.",
      "wrong": "\"RNNs are obsolete.\" Too strong. Recurrent ideas returned in state-space and hybrid models for long context, and CNNs still win in many small-data and on-device vision settings.",
      "follow": "If attention is quadratic in sequence length, why not go back to RNNs for long documents?",
      "followAnswer": "Because classic RNNs still train one step at a time and forget over long ranges. The modern answer is a middle path: state-space models such as Mamba keep a recurrent state, so inference cost grows linearly with length, yet they can still be trained in parallel. Several recent LLMs are hybrids that keep some attention layers, because pure recurrent models are weaker at exact recall from far back."
    },
    {
      "id": "ml-32",
      "q": "Walk me through a clean PyTorch training loop.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml",
        "pytorch",
        "training",
        "deep-learning"
      ],
      "why": "Many senior AI roles still expect hands-on deep-learning training knowledge even when the team also builds GenAI applications.",
      "simple": "A training loop repeats the same few steps.\n\nLoad a mini-batch and move the tensors to the device. Put the model in training mode. Run the forward pass to get predictions, compute the loss, clear old gradients, call `backward()` to compute new gradients, and let the optimizer update the weights. Repeat over the training data.\n\nValidation is different: switch to evaluation mode, disable gradient tracking, run the held-out data and record metrics without updating weights. Save the best checkpoint based on the validation target, not just the final epoch.\n\nThe senior details are around reliability: seed what can reasonably be seeded, log configuration and data version, watch training and validation curves, clip gradients if instability requires it, and use a learning-rate schedule only when it improves the measured result.\n\nFor larger models I may add mixed precision, gradient accumulation and distributed training, but the basic loop is still the same.",
      "points": [
        "Forward pass, loss, zero gradients, backward pass, optimizer step.",
        "Use train mode for training and eval mode with no gradients for validation.",
        "Choose checkpoints from held-out validation metrics.",
        "Log code/data/config so the run can be reproduced.",
        "Mixed precision, accumulation and distribution extend the same core loop."
      ],
      "code": "import torch\nfrom torch import nn\nfrom torch.utils.data import DataLoader, TensorDataset\n\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\nX, y = torch.randn(1000, 20), torch.randint(0, 2, (1000,))\ntrain_dl = DataLoader(TensorDataset(X[:800], y[:800]), batch_size=32, shuffle=True)\nval_dl = DataLoader(TensorDataset(X[800:], y[800:]), batch_size=64)\n\nmodel = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 2)).to(device)\nloss_fn = nn.CrossEntropyLoss()\nopt = torch.optim.AdamW(model.parameters(), lr=1e-3)\nbest = float(\"inf\")\n\nfor epoch in range(5):\n    model.train()                                  # dropout / batch norm in train mode\n    for xb, yb in train_dl:\n        xb, yb = xb.to(device), yb.to(device)\n        opt.zero_grad()                            # clear old gradients\n        loss = loss_fn(model(xb), yb)              # forward + loss\n        loss.backward()                            # backward pass\n        nn.utils.clip_grad_norm_(model.parameters(), 1.0)\n        opt.step()                                 # update weights\n\n    model.eval()                                   # eval mode, no gradient tracking\n    total = 0.0\n    with torch.no_grad():\n        for xb, yb in val_dl:\n            xb, yb = xb.to(device), yb.to(device)\n            total += loss_fn(model(xb), yb).item() * len(xb)\n    val_loss = total / len(val_dl.dataset)\n    if val_loss < best:                            # keep the best checkpoint\n        best = val_loss\n        torch.save(model.state_dict(), \"best.pt\")",
      "say": "A PyTorch loop is forward pass, loss, clear old gradients, backward pass and optimizer step for each mini-batch. Validation switches to eval mode and disables gradient tracking, because it measures without updating weights. I select checkpoints using the held-out metric rather than the final epoch and log the data and configuration with the run. For larger models I add mixed precision, gradient accumulation or distributed training, but those are extensions of the same basic loop.",
      "numbers": "Do not quote a default epoch or batch count without the dataset. Track steps, examples seen, validation metric and learning-rate schedule so runs can be compared fairly.",
      "wrong": "Describing only `loss.backward()` and `optimizer.step()`. Validation mode, gradient clearing, checkpoint selection and reproducibility are part of a production training answer.",
      "follow": "Training loss keeps falling while validation loss rises. What do you change first, and how do you know it helped?"
    },
    {
      "id": "ml-33",
      "q": "Mixed precision and gradient accumulation - why do we use them?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml",
        "pytorch",
        "mixed-precision",
        "gradient-accumulation",
        "gpu"
      ],
      "why": "These are common practical controls when training or adapting models on limited GPU memory.",
      "simple": "They solve different memory and speed problems.\n\nMixed precision uses lower-precision number formats for much of training while keeping the parts that need more range or accuracy in safer formats. On supported GPUs this reduces memory use and can make matrix operations faster. BF16 is often easier to train with than FP16 because it has a wider numeric range, but hardware support matters.\n\nGradient accumulation lets me behave as if I used a larger batch than fits in memory. I run several smaller micro-batches, add their gradients, and call the optimizer only after the chosen number of steps. Divide each micro-batch loss by the number of accumulation steps, or the summed gradient is that many times too large, and zero gradients only after the optimizer step.\n\nThe trap is forgetting that an optimiser step now happens less often. Learning-rate schedules, gradient clipping, logging and distributed synchronisation must be defined in terms of optimizer steps or effective batch size, not blindly copied from the old loop.\n\nNeither technique is free. I compare throughput, memory and validation quality after the change.",
      "points": [
        "Mixed precision reduces memory and can increase accelerator throughput.",
        "BF16 and FP16 have different numeric ranges and hardware support.",
        "FP16 needs loss scaling (`torch.amp.GradScaler`) so small gradients do not underflow; BF16 usually does not.",
        "Gradient accumulation simulates a larger effective batch from smaller micro-batches.",
        "Schedulers and logging must account for fewer optimizer steps.",
        "Re-measure throughput and model quality after changing precision or batch behaviour."
      ],
      "say": "Mixed precision uses lower-precision math where it is safe, which reduces GPU memory and can improve throughput on supported hardware. Gradient accumulation solves a different problem: it runs several smaller micro-batches, accumulates their gradients, then performs one optimizer step, so the effective batch is larger than what fits at once. I adjust schedules and logging around optimizer steps and effective batch size, then verify memory, speed and validation quality because neither change is automatically free.",
      "numbers": "Effective batch size is micro-batch size × accumulation steps × data-parallel workers. Use that number when comparing runs and choosing learning-rate changes.",
      "wrong": "Calling gradient accumulation the same as increasing the physical batch. It changes when optimizer and synchronisation steps happen and can change training behaviour.",
      "follow": "You double the number of data-parallel GPUs. What happens to effective batch size if you change nothing else?"
    },
    {
      "id": "ml-34",
      "q": "Data parallel, tensor parallel, pipeline parallel and FSDP - what is the difference?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml",
        "distributed-training",
        "pytorch",
        "gpu"
      ],
      "why": "Senior roles that train or serve larger models expect basic distributed-compute trade-offs, not only single-GPU code.",
      "simple": "They split the training problem in different ways.\n\nData parallelism keeps a copy of the model on each worker and gives each worker different examples. Gradients are combined so every copy stays in sync. It is simple, but every worker must fit the model and its training state.\n\nTensor parallelism splits individual large matrix operations or layers across devices. It helps when one layer or model does not fit on a single GPU, but it needs frequent communication between those GPUs.\n\nPipeline parallelism puts different groups of layers on different devices and moves micro-batches through them like stages. It saves memory but introduces pipeline scheduling and idle-time trade-offs.\n\nFSDP, Fully Sharded Data Parallel, shards parameters, gradients and optimizer state across workers and gathers pieces when needed. It keeps a data-parallel programming style while reducing per-GPU memory.\n\nLarge training jobs often combine these. I choose based on what does not fit, network speed, model shape and the complexity the team can operate.",
      "points": [
        "Data parallel: full model copy, different data, synchronised gradients.",
        "Tensor parallel: split large layer computations across devices; needs fast links, so it usually stays inside one node.",
        "Pipeline parallel: split layers into stages across devices; idle \"bubbles\" are the cost.",
        "FSDP: shard parameters, gradients and optimizer state while keeping a data-parallel style - the same idea as DeepSpeed ZeRO stage 3.",
        "MoE models add expert parallelism; very long context adds sequence or context parallelism.",
        "Choose from memory bottleneck, communication cost and operational complexity."
      ],
      "say": "Data parallelism copies the model and gives each worker different examples, then synchronises gradients. Tensor parallelism splits large layer computations across GPUs when the model or layer is too large for one device. Pipeline parallelism places different layer groups on different devices and sends micro-batches through stages. FSDP shards parameters, gradients and optimizer state across workers to cut per-GPU memory. Large jobs often combine them, so I choose based on the memory bottleneck and network cost.",
      "numbers": "Communication can become the bottleneck before compute. Compare scaling efficiency as GPUs increase rather than assuming twice the GPUs gives twice the training speed.",
      "wrong": "Calling every multi-GPU job data parallelism. The split can be across examples, tensors, layers, or training state, and each has different communication costs.",
      "follow": "The model fits on one GPU but optimizer state does not. Which approach would you try before tensor parallelism?",
      "followAnswer": "I would shard the optimizer state first - ZeRO stage 1 or 2, or FSDP - so each GPU holds only its slice of the Adam states. On a single GPU, an 8-bit optimizer or offloading optimizer state to CPU memory is the cheaper option. Tensor parallelism splits the layer computation itself, which I only need when the weights and activations do not fit."
    },
    {
      "id": "ml-23",
      "q": "Explain the difference between correlation and causation with a work example.",
      "round": [
        "tech1",
        "manager"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "statistics",
        "reasoning",
        "stakeholders"
      ],
      "why": "Tests whether you can stop a business from acting on a spurious pattern - a senior responsibility.",
      "simple": "Correlation says two things move together. Causation says changing one changes the other. Models learn the first and stakeholders assume the second, and that gap is where expensive decisions go wrong.\n\nA concrete case. A churn model finds that customers who contact support are far more likely to churn. The eager conclusion: support contact drives churn, so reduce support contact.\n\nThat is backwards. Customers contact support because they already have a problem. The problem drives both the contact and the churn - support is a symptom, not a cause. Act on the correlation and you remove the one channel that was helping, and churn gets worse.\n\nThree ways correlation appears without causation. A confounder influences both, as above. Reverse causality - the effect causes the predictor. And selection effects, where how the data was collected creates the pattern.\n\nPrediction and intervention are genuinely different problems. Support contact is a perfectly good predictor of churn - it earns its place in the model. It is simply useless as a lever. That distinction is the point worth making out loud.\n\nTo establish causation you need an experiment: randomise who gets the intervention and compare. When you cannot randomise, quasi-experimental methods like difference-in-differences give you something weaker but real. The practical habit is to ask 'are we predicting or intervening?' before anyone acts on a feature importance chart.",
      "points": [
        "Models learn association; stakeholders hear causation.",
        "Confounders, reverse causality and selection all produce it.",
        "A useful predictor can be a useless lever.",
        "Only randomised experiments establish causation cleanly.",
        "Ask whether the decision is prediction or intervention."
      ],
      "say": "Correlation means two things move together; causation means changing one changes the other. A churn model showing support contacts predict churn does not mean reducing support helps - the underlying problem drives both, so support is a symptom. A feature can be a strong predictor and a useless lever. Before anyone acts on feature importance I ask whether we are predicting or intervening, because only an experiment answers the second.",
      "numbers": "Feature importance measures predictive contribution, not causal effect. Presenting it as a to-do list of interventions is a common and costly mistake.",
      "wrong": "Reaching for ice cream and drowning. It shows you know the concept and not that you can apply it - use an example from work.",
      "follow": "The business wants to act on your top feature. How do you respond?"
    },
    {
      "id": "ml-24",
      "q": "What is a p-value, and what does it not mean?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "statistics",
        "ab-testing",
        "evaluation"
      ],
      "why": "Almost everyone gets the definition subtly wrong, and it matters for every A/B test you will run.",
      "simple": "**Short version: a p-value answers \"if the change truly did nothing, how surprising would this data be?\". Small means surprising. It does not tell you the chance the change works, or how big the effect is.**\n\nFormally: the probability of a result at least as extreme as yours, assuming the null hypothesis (no real effect) is true. That \"assuming\" is the whole concept.\n\nWhat it is not:\n\nNot the probability that the null is true. It assumes the null and asks about the data, not the other way round.\n\nNot a measure of effect size. With a million users, a 0.01% lift can be highly significant and commercially worthless.\n\nNot proof of no effect when it is above 0.05. You simply did not detect one, often because the test was too small (low power).\n\nThe practical traps. Peeking: checking daily and stopping the moment p dips below 0.05 greatly inflates false positives, because you gave chance many tries. Fix the sample size in advance, or use a sequential test built for monitoring. Multiple comparisons: test twenty metrics at 0.05 and you expect about one false positive even when nothing changed, so correct for it.\n\nThe senior habit is to lead with the effect size and its confidence interval. \"A 3% lift, 95% interval 1% to 5%\" gives a stakeholder direction and precision; a p-value alone gives neither.",
      "points": [
        "P(data this extreme | null is true) - the conditional is the point.",
        "Not the probability the null is true, and not a fluke probability.",
        "Significance is not effect size; large n makes trivia significant.",
        "Peeking inflates false positives - fix n in advance.",
        "Lead with the confidence interval, not the p-value."
      ],
      "say": "A p-value is the probability of data at least this extreme assuming the null is true. It is not the probability the null is true, and it says nothing about effect size - at large sample sizes a commercially meaningless lift is highly significant. The practical traps are peeking, which inflates false positives, and multiple comparisons. I lead with the effect size and confidence interval, because that tells a stakeholder direction and precision.",
      "numbers": "Fix the sample size before starting. Testing twenty metrics at 0.05 yields roughly one false positive by chance - correct for it or expect to chase noise.",
      "wrong": "'It is the probability the result happened by chance.' It is the near-universal phrasing and it is the definition inverted.",
      "follow": "Your test hits p = 0.04 on day three. Do you ship?"
    },
    {
      "id": "ml-25",
      "q": "How do you design an A/B test - sample size, duration, guardrail metrics?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ab-testing",
        "experimentation",
        "statistics"
      ],
      "why": "Every model change needs an experiment. Design flaws are invisible until the result is already wrong.",
      "simple": "**Short version: decide in advance what you will measure, how many users you need, for how long, and what must not get worse. Then run it to the end without peeking.**\n\nStart with the decision. What will you do differently depending on the result? If nothing changes either way, do not run the test.\n\nPick one primary metric before launch. Choosing afterwards from ten metrics makes a false winner likely - about a 40% chance of at least one at the 5% level.\n\nWork out the sample size before launch from three inputs: the baseline rate, the smallest lift worth detecting, and power (the chance of detecting a real effect, usually 80%). The key fact: halving the lift you want to detect quadruples the users you need.\n\nRun at least one full week, because weekday and weekend users differ. Two weeks is a common default. Stop at the planned sample size, not when the result looks good.\n\nSet guardrail metrics - things you are not trying to improve but must not damage: latency, error rate, cost per request, complaints. A GenAI feature that lifts engagement while doubling cost is not a win.\n\nCheck validity. Randomise by user, not by request, so one person does not see both versions. Run an A/A test to confirm the setup finds no difference when there is none. Check for sample ratio mismatch: a planned 50/50 split arriving as 52/48 on a large sample means assignment is broken.\n\nFor GenAI-specific complications such as output variance and shadow runs, see the A/B testing card in the evaluation section.",
      "points": [
        "Decide the action first; fix one primary metric in advance.",
        "Halving the detectable effect quadruples the required sample.",
        "Cover a full weekly cycle - two weeks is a sane default.",
        "Guardrails: latency, error rate, cost, support volume.",
        "Check A/A and sample ratio mismatch before trusting anything."
      ],
      "say": "I fix the decision and one primary metric first, then compute sample size from the baseline rate, the minimum lift worth detecting and 80% power - halving the detectable effect quadruples the sample. I run at least a full weekly cycle without peeking. I set guardrails on latency, cost and error rate, because a GenAI feature that lifts engagement while doubling cost is not a win. Then I verify with an A/A test and a sample ratio check.",
      "numbers": "80% power at 5% significance is standard. Two weeks minimum duration. On 10,000 users, a 50/50 split arriving at 52/48 gives a chi-square p-value near 0.0001 - broken assignment - investigate before reading the result.",
      "wrong": "Running until the result looks good. It is peeking with extra steps, and it produces a stream of exciting findings that never replicate.",
      "follow": "The primary metric is flat but a secondary one is up 8%. What do you conclude?"
    },
    {
      "id": "ml-08",
      "q": "How would you explain a model's decision to a business user?",
      "round": [
        "tech1",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml-fundamentals",
        "explainability",
        "communication"
      ],
      "why": "Regulated employers require explainability, and it is a communication test as much as a technical one.",
      "simple": "Separate two questions, because they need different tools and people conflate them.\n\nGlobal: what drives the model overall? Feature importance answers this, and it is what you show a stakeholder deciding whether to trust the system.\n\nLocal: why this particular decision? That is what a customer or a regulator asks, and it needs a per-prediction method - SHAP values are the usual choice, giving each feature's contribution to this specific outcome.\n\nThen translate, because the raw output is not an explanation. \"SHAP value of 0.34 for tenure\" means nothing to anyone. \"This application was declined mainly because the account is four months old and three payments were late; if it were twelve months old the decision would likely change\" is an explanation, and it is also actionable, which is what people actually want.\n\nAnd the honest caveat: these methods explain what the model did, not what is true in the world. Correlation in the features shows up as importance. Saying that distinguishes you from someone who treats SHAP as ground truth.",
      "points": [
        "Global explanation - feature importance. For trusting the system.",
        "Local explanation - SHAP per prediction. For explaining one decision.",
        "Translate into plain, actionable language. A SHAP value is not an explanation.",
        "Include what would change the outcome. That is what people want.",
        "These explain the model, not the world. Correlated features look important.",
        "In regulated settings, prefer an inherently interpretable model where accuracy allows."
      ],
      "say": "I separate global from local. Globally, feature importance shows what drives the model, which is what a stakeholder needs to trust it. Locally, SHAP gives each feature's contribution to one decision, which is what a customer or regulator asks about. Then I translate into plain language including what would change the outcome. And I am clear that these explain the model, not the world - correlated features look important.",
      "numbers": "No number applies. If the setting is regulated, consider whether an interpretable model at slightly lower accuracy is the better trade.",
      "wrong": "\"I show them the SHAP plot.\" Handing over a technical artefact is not explaining. The translation is the deliverable.",
      "follow": "The model declined a loan and the customer asks why. What exactly do you send them?"
    },
    {
      "id": "ml-29",
      "q": "What is SHAP and how do you read a SHAP plot?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "explainability",
        "shap",
        "stakeholders"
      ],
      "why": "The named tool for explainability, and regulated employers will ask specifically.",
      "simple": "**Short version: SHAP splits one prediction into \"how much each feature pushed it up or down\", and the pieces add up exactly to the prediction.**\n\nIt comes from Shapley values in game theory. Treat the features as players in a team, and fairly share out the difference between this prediction and the average prediction among them.\n\nThe key property is additivity. The base value plus all the SHAP values equals the prediction. So you can say: the average default risk is 8%, this applicant is at 31%, and the gap is +15 points from debt-to-income, +9 from recent credit enquiries and -1 from account age. A credit officer can act on that, and a regulator can inspect it.\n\nOne detail that trips people up: for boosted-tree classifiers, SHAP values are usually in log-odds by default, not probability. Convert, or explain the probability output, before quoting percentage points.\n\nReading the plots. A beeswarm shows every row: features ordered by importance, position is the SHAP value, colour is whether the feature value was high or low - so you see direction, not just size. A waterfall explains one prediction step by step. A dependence plot shows how one feature's effect changes across its range.\n\nMean absolute SHAP is a more trustworthy global importance than a tree's built-in importance, which favours features with many distinct values.\n\nThe caveat: SHAP explains what the model does, not what is true. A spurious pattern the model learned gets a confident explanation, and correlated features can split credit in confusing ways.",
      "points": [
        "Shapley values: fairly attribute one prediction across features.",
        "Additive: base value plus SHAP values equals the prediction exactly.",
        "Boosted-tree classifiers usually report SHAP in log-odds - convert before quoting probabilities.",
        "Beeswarm for global, waterfall for one prediction, dependence for shape.",
        "Mean |SHAP| is more reliable than a tree's built-in feature importance.",
        "Explains the model, not reality - spurious learning explains confidently."
      ],
      "say": "SHAP attributes a prediction across features using a game-theory fair-division argument, and the key property is additivity - the base value plus the SHAP values equals the prediction exactly. So I can tell a credit officer that the average is 8%, this applicant is 31%, and debt-to-income contributed 15 points of that. Beeswarm for global patterns, waterfall for one case. The caveat is that it explains the model, not reality.",
      "numbers": "TreeSHAP is exact and fast for tree models. KernelSHAP is model-agnostic and slow - sample rather than running it over a full dataset.",
      "wrong": "Presenting SHAP values as causal effects. They describe the model's behaviour; a spurious correlation produces a confident and misleading explanation.",
      "follow": "SHAP shows postcode as the top feature in a lending model. What now?"
    },
    {
      "id": "ml-05",
      "q": "How do you know a model has degraded in production?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml-fundamentals",
        "drift",
        "monitoring"
      ],
      "why": "It maps directly onto GenAI monitoring, and it is where classical ML experience becomes an asset.",
      "simple": "The difficulty is that labels usually arrive late or never. You predicted churn today and you find out in ninety days, so you cannot watch accuracy in real time.\n\nSo you monitor the things you can see immediately. Input drift - the distribution of incoming features shifting away from training. Prediction drift - the distribution of your model's own outputs moving, which is a strong early signal and cheap to compute. Data quality - nulls appearing, a category you have never seen, a unit change upstream. And segment volumes, because a shift in who is being scored changes what the aggregate means.\n\nThen accuracy retrospectively, as labels arrive, backfilled onto the period they belong to.\n\nThe distinction worth naming: data drift means the inputs changed; concept drift means the relationship between inputs and outcome changed. Drift detection finds the first. Only labels find the second, which is why a delayed-label pipeline is not optional.\n\nThe data-drift against concept-drift card goes deeper on detecting each.",
      "points": [
        "Labels arrive late or never - you cannot watch accuracy live.",
        "Monitor input drift, prediction drift, data quality, segment volumes.",
        "Prediction drift is the cheapest strong early signal.",
        "Backfill accuracy onto the right period as labels arrive.",
        "Data drift = inputs changed. Concept drift = the relationship changed.",
        "Only labels reveal concept drift. Build the delayed-label pipeline."
      ],
      "say": "Labels usually arrive late, so I cannot watch accuracy live. I monitor input drift, prediction drift - which is cheap and a strong early signal - data quality, and segment volumes. Then I backfill accuracy onto the right period as labels arrive. The distinction that matters is that drift detection finds changed inputs, but only labels reveal concept drift, where the relationship itself changed.",
      "numbers": "Prediction drift is computable on every request at no label cost. It is the first monitor to build, before any accuracy pipeline.",
      "wrong": "\"We monitor accuracy in production.\" Only if labels arrive quickly. If they do not, the follow-up about delayed labels exposes a gap: you need drift and prediction monitoring in the meantime.",
      "follow": "Inputs look stable and accuracy fell. What is that?"
    },
    {
      "id": "ml-28",
      "q": "Explain train-serve skew with an example of how it happened.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "production",
        "debugging",
        "mlops"
      ],
      "why": "The classic production ML failure, and a concrete example proves you have shipped rather than only trained.",
      "simple": "Train-serve skew is when the features a model receives in production differ from what it saw in training. Offline metrics look fine and production performance is worse, with nothing obviously broken.\n\nA concrete case. Training data was built from the warehouse, where a customer's country was a clean two-letter code. The serving path read from an API that returned full country names, with a fallback to empty string on timeout. The encoder mapped every unrecognised value to a single unknown bucket. So in production, a feature the model relied on was constant. Accuracy dropped several points, and every monitoring dashboard was green because the pipeline was not erroring - it was succeeding with degraded input.\n\nThe common causes are worth listing, because they recur. Different code paths computing the same feature. Different data sources with different conventions. Time-window boundaries handled inconsistently. Missing-value handling that differs between pipelines. And scalers or encoders fitted on training data but not versioned with the model, so a retrain silently changes the mapping.\n\nPrevention: share the transformation code between training and serving rather than reimplementing it; version the fitted preprocessor with the model artefact; and log the actual feature vector at inference so you can compare distributions against training.\n\nThat last one is what turns a two-week investigation into a two-hour one, and it is the part most teams skip until it has cost them once.",
      "points": [
        "Serving features differ from training features; offline metrics stay clean.",
        "Causes: separate code paths, different sources, unversioned encoders.",
        "It fails silently - the pipeline succeeds with degraded input.",
        "Share transformation code; version the preprocessor with the model.",
        "Log inference features and compare distributions to training."
      ],
      "say": "It is when production features differ from training features, so offline metrics look fine while real performance drops. A classic case: country arrives as a two-letter code in the warehouse and a full name from the serving API, so the encoder mapped everything to unknown and a key feature went constant - with green dashboards throughout, because nothing errored. I prevent it by sharing transformation code, versioning the fitted preprocessor with the model, and logging inference features.",
      "numbers": "It typically costs several accuracy points and goes unnoticed for weeks. Comparing logged inference feature distributions against training is the fastest detection there is.",
      "wrong": "Defining it without an example. Every candidate can define it; having actually debugged one is what the question is really asking.",
      "follow": "How would you detect this within a day rather than a month?"
    },
    {
      "id": "ml-07",
      "q": "Does classical ML still matter if we are building with LLMs?",
      "round": [
        "tech1",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml-fundamentals",
        "judgement",
        "trade-off"
      ],
      "why": "Increasingly asked, and the strong answer is specific about where each tool wins.",
      "simple": "Yes, and the reason is cost and precision rather than nostalgia.\n\nFor a well-defined task with labelled data - fraud scoring, churn, demand forecasting, document routing at volume - a gradient-boosted model on tabular data is faster, far cheaper, deterministic, and usually more accurate than any prompt. It also gives you a probability score you can calibrate and threshold, which an LLM's text output does not reliably provide.\n\nLLMs win where the input is unstructured language, where you have no labelled data, where the task changes weekly, or where the output has to be prose.\n\nThe pattern that shows real judgement is combining them: an LLM extracts structured fields from a messy document, and a classical model scores those fields. You get the LLM's flexibility on the input and the classical model's precision, calibration and cost profile on the decision.\n\nAnd the point worth saying plainly: a common mistake is using an LLM for a binary classification that logistic regression would do as well or better, at a fraction of the cost. Knowing which tool the problem needs is the skill.",
      "points": [
        "Labelled tabular task → gradient boosting. Cheaper, faster, deterministic, calibrated.",
        "LLMs win on unstructured language, no labels, fast-changing tasks, prose output.",
        "Classical models give probability scores you can calibrate. LLM outputs do not reliably.",
        "Best pattern: LLM extracts structure, classical model scores it.",
        "Using an LLM for a task logistic regression solves is usually a cost mistake."
      ],
      "say": "Yes, for cost and precision. On a well-defined task with labels - fraud, churn, forecasting - a gradient-boosted model is faster, far cheaper, deterministic and usually more accurate than a prompt, and it gives a probability you can calibrate, which an LLM does not reliably provide. LLMs win on unstructured language, no labels, or prose output. The best pattern combines them: the LLM extracts structured fields, a classical model scores them.",
      "numbers": "A gradient-boosted model serves predictions in single-digit milliseconds at effectively zero marginal cost. Compare that against a per-token bill before choosing an LLM for a scoring task.",
      "wrong": "\"LLMs can do everything now.\" The follow-up on cost per prediction, latency and calibration will expose it, because for labelled tabular tasks a simple model often wins on all three.",
      "follow": "Give me a task in our business where you would refuse to use an LLM."
    },
    {
      "id": "ml-36",
      "q": "How do you evaluate search or ranking quality?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "ml",
        "ranking",
        "search",
        "metrics"
      ],
      "why": "Search, RAG and recommendation roles all need ranking metrics and an understanding of where offline metrics stop.",
      "simple": "I choose a metric that matches what the user can actually see and do.\n\nRecall@K asks what fraction of the relevant items appeared in the top K - with one relevant item, simply whether it appeared at all. That is useful for a candidate generator, where missing the item is fatal. Precision@K asks how much of the visible set is relevant.\n\nMRR focuses on the rank of the first relevant result, which fits tasks where one good answer is enough. NDCG gives more credit when highly relevant items appear near the top and can handle graded relevance rather than only relevant/not relevant.\n\nThe labels matter as much as the formula. Human judgments can be expensive; clicks are plentiful but biased by position, presentation and previous ranking.\n\nOffline metrics are regression tools, not the product outcome. I slice by query type and user segment, then validate important changes online with task success, click/conversion, reformulation, abandonment and latency guardrails.\n\nFor a worked calculation of each metric on one query, see the Precision@k, Recall@k, MRR and nDCG card in the RAG section.",
      "points": [
        "Recall@K for not missing relevant candidates.",
        "Precision@K for relevance of the visible set.",
        "MRR when the first good result matters most.",
        "NDCG for graded relevance and position-sensitive ranking.",
        "Online behaviour is needed because click labels and offline judgments are imperfect."
      ],
      "say": "I match the metric to the product. Recall@K is useful for candidate generation because missing a relevant item is fatal. Precision@K measures how clean the visible set is. MRR fits cases where the first correct result matters, while NDCG handles graded relevance and rewards putting the best items near the top. I also question the labels, because clicks have position bias, and I validate major changes online with task-success and latency guardrails.",
      "numbers": "Use K equal to meaningful product cutoffs: the retrieved set passed to a reranker or the number of results a user can reasonably inspect. A metric at an irrelevant K can be misleading.",
      "wrong": "Reporting one average NDCG and stopping. Ranking quality should be sliced by query/user type and checked against real online behaviour.",
      "follow": "Why can click-through be a bad relevance label, and how would you reduce position bias?"
    },
    {
      "id": "ml-27",
      "q": "What is a feature store and do you need one?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "mlops",
        "features",
        "architecture"
      ],
      "why": "The honest answer is usually no, and knowing when it is yes shows real production judgement.",
      "simple": "A feature store is a central place where features are defined once, computed, stored, and served to both training and inference.\n\nThe problem it exists to solve is train-serve skew. Your training pipeline computes a customer's 30-day average transaction in a Spark job. Your serving code recomputes it in Python from a different table. The two definitions drift apart - a boundary handled differently, a filter applied in one and not the other - and the model receives inputs at serving time that differ subtly from training. Accuracy degrades and nothing in your monitoring explains it.\n\nA feature store fixes this by making one definition the only definition, serving offline for training and online for inference from the same computation.\n\nIt also handles point-in-time correctness, which is the harder problem. When building training data you must use the feature value as it was at the moment of the event, not today's value. Doing this by hand with joins is where subtle label leakage creeps in, and a feature store does it for you.\n\nSo when do you need one? When multiple teams reuse the same features, when you serve real-time predictions with strict latency, or when point-in-time joins have already burned you.\n\nWhen do you not? Most of the time. One team, batch predictions, a handful of models - a feature store is significant infrastructure to run, and a shared feature-computation library with tests gives you most of the benefit for a fraction of the cost. Saying that plainly is the senior answer; reaching for it by default is not.",
      "points": [
        "Solves train-serve skew by making one definition authoritative.",
        "Handles point-in-time correctness, which prevents subtle leakage.",
        "Serves the same features offline for training and online for inference.",
        "Justified by multi-team reuse or real-time serving.",
        "For one team doing batch, a shared library is usually enough."
      ],
      "say": "A feature store defines features once and serves them to both training and inference, which solves train-serve skew - the same feature computed by two different pipelines that quietly diverge. It also handles point-in-time correctness so training rows use the value as of the event, which prevents leakage. It is worth it for multi-team reuse or real-time serving. For one team doing batch predictions, a shared computation library is usually enough.",
      "numbers": "Online serving typically needs feature retrieval in single-digit milliseconds, which is why the online store is a key-value store rather than a warehouse.",
      "wrong": "Recommending one for every project. It is heavy infrastructure, and for a single batch model the follow-up on operating cost will show a shared feature library would have done the job.",
      "follow": "How would you get point-in-time correctness without a feature store?"
    },
    {
      "id": "ml-35",
      "q": "How would you design a recommendation or ranking system?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "ml",
        "recommendation",
        "ranking",
        "system-design"
      ],
      "why": "Recommendation and ranking remain common senior ML interview areas outside pure GenAI teams.",
      "simple": "I split the problem into candidate generation and ranking.\n\nCandidate generation quickly reduces a huge catalog to a few hundred plausible items using signals such as recent behaviour, popularity, rules, embeddings or collaborative filtering. It optimises recall: do not lose the good item too early.\n\nThe ranker then scores that smaller set with richer user, item and context features. It can be a gradient-boosted model, neural ranker or other supervised model depending on data and latency. The final stage may apply business constraints such as diversity, inventory, freshness or safety.\n\nTraining data needs careful labels because clicks are biased by what was shown and where it was shown. I include exploration or debiasing where possible and handle cold-start users/items with content features or popularity.\n\nOffline I measure ranking metrics at the positions users actually see. Online I run an experiment on business metrics plus guardrails such as latency, diversity and complaint rate.",
      "points": [
        "Candidate generation optimises recall over a huge catalog.",
        "Ranking uses richer features on a much smaller candidate set.",
        "Account for exposure/position bias in click labels.",
        "Design a cold-start path for new users and items.",
        "Validate with online experiments, not offline ranking metrics alone."
      ],
      "say": "I separate candidate generation from ranking. The first stage cheaply retrieves a few hundred plausible items and is tuned for recall. A second model ranks that set with richer user, item and context features, then business rules such as diversity or inventory apply. Click labels carry exposure and position bias, and I plan a cold-start path. Offline metrics narrow the choice; an online experiment with guardrails makes the final decision.",
      "numbers": "Candidate and displayed-set sizes depend on latency and catalog scale. Report metrics at the actual product cutoffs, such as Recall@K or NDCG@K, rather than a convenient arbitrary K.",
      "wrong": "Training one classifier over every item in the catalog and calling that the recommender. Large systems usually need a fast retrieval stage before expensive ranking.",
      "follow": "Offline NDCG improved but click-through fell in the experiment. What biases or product effects would you investigate?"
    }
  ]
};
