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
      "quick": [
        "They differ in where the learning signal comes from.",
        "Supervised learns from labelled examples, like spam or not.",
        "Unsupervised finds groups in data with no labels.",
        "Self-supervised hides the next word and predicts it.",
        "Reinforcement learns from rewards, and LLMs combine three of these."
      ],
      "simple": "These four kinds of learning differ in where the learning signal comes from. Supervised learning uses labelled examples, such as emails marked spam or not spam, and learns to map each input to its label. Unsupervised learning has no labels, so the model finds structure on its own, such as groups of similar customers.\n\nSelf-supervised learning makes the labels out of the data itself. You hide the next word in a sentence and ask the model to predict it, so every sentence gives many training examples without anyone labelling anything. Reinforcement learning learns from rewards instead of correct answers, as an agent tries actions and learns which ones score higher.\n\nWhat people often miss is that modern LLMs use several of these in sequence. For example, self-supervised pre-training builds general knowledge, supervised fine-tuning teaches the instruction format, and reinforcement learning shapes behaviour. That is why calling LLM pre-training unsupervised is imprecise.",
      "points": [
        "**Supervised** - labelled input-output pairs. Classification, regression.",
        "**Unsupervised** - no labels; find structure. Clustering, PCA, anomaly detection.",
        "**Self-supervised** - labels made from the data itself, such as predicting the next token or a masked word.",
        "**Reinforcement** - learn from rewards for actions, not from correct answers.",
        "LLMs: self-supervised pre-training → supervised fine-tuning → RL (from human feedback or verifiable rewards)."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "How an LLM is trained in three stages: self-supervised pre-training on raw text, supervised fine-tuning on labelled examples, then reinforcement learning from rewards.",
        "lanes": [
          {
            "label": "Pre-training",
            "note": "self-supervised, raw text",
            "accent": "accent"
          },
          {
            "label": "Fine-tuning",
            "note": "supervised, labelled pairs"
          },
          {
            "label": "RL",
            "note": "rewards, not answers",
            "accent": "warn"
          }
        ],
        "caption": "The four types differ in **where the learning signal comes from**. A modern LLM uses three of them **in sequence**."
      },
      "say": "It comes down to where the learning signal comes from. Supervised learning uses labelled examples, like emails marked spam or not spam, and the model learns to map each input to its label. Unsupervised learning has no labels, so the model finds structure on its own, such as clusters of similar customers. Self-supervised learning makes the labels out of the data itself. Hide the next word in a sentence and ask the model to predict it. Nobody labelled anything, yet every sentence yields many training examples, and that's how LLMs are pre-trained. Reinforcement learning learns from rewards rather than correct answers, so an agent tries actions and learns which ones score higher. The thing people miss is that modern LLMs use three of these in sequence. Self-supervised pre-training builds knowledge, supervised fine-tuning teaches the format, and reinforcement learning shapes behaviour, from human preferences or checkable rewards. So calling LLM pre-training unsupervised is imprecise.",
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
      "quick": [
        "Bias is a model too simple, wrong even on training data.",
        "Variance is a model too sensitive, failing on new data.",
        "Lowering one usually raises the other.",
        "Compare training error with validation error to tell which.",
        "Both high means more capacity, a big gap means simplify."
      ],
      "simple": "Bias and variance are two opposite ways a model can go wrong. Bias comes from a model that is too simple to capture the pattern, so it is wrong even on the training data, which is underfitting. Variance comes from a model too sensitive to the data it saw, so it learns the noise along with the signal and falls apart on new data, which is overfitting. Reducing one usually raises the other.\n\nSo the useful skill is telling which problem you have, by comparing training error with validation error. If both are high and close, add capacity or better features. If training error is low and validation error much higher, get more data, regularise or simplify. For example, a churn model that is equally mediocre on both is too simple, but one that is nearly perfect on training data and much worse on validation has memorised the training customers.",
      "points": [
        "Bias - model too simple. Wrong on training data too. Underfitting.",
        "Variance - model too sensitive to its training data. Overfitting.",
        "Diagnose by comparing training error with validation error.",
        "Both high and close → more capacity, better features.",
        "Train low, validation high → more data, regularisation, simpler model."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A 2x2 grid of training error against validation error: both low is a good fit, low train with high validation is overfitting, both high is underfitting.",
        "xLabel": "Validation error",
        "yLabel": "Training error",
        "cols": [
          "Low",
          "High"
        ],
        "rows": [
          "Low",
          "High"
        ],
        "cells": [
          [
            {
              "label": "Good fit",
              "note": "ship it",
              "accent": "accent"
            },
            {
              "label": "High variance",
              "note": "more data, regularise",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "Unusual",
              "note": "check the split",
              "accent": "muted"
            },
            {
              "label": "High bias",
              "note": "more capacity, features",
              "accent": "warn"
            }
          ]
        ],
        "caption": "The diagnosis is **training error vs validation error**. A big gap means overfitting; both high means underfitting."
      },
      "say": "Bias and variance are two opposite ways a model goes wrong, and pushing one down usually pushes the other up. Bias comes from a model too simple to capture the pattern, so it's wrong even on the training data. That's underfitting. Variance comes from a model too sensitive to the particular data it saw, so it learns the noise with the signal and falls apart on new data. That's overfitting. A more flexible model cuts bias but adds variance. What matters in practice is telling which one you have, and I do that by comparing training error with validation error. If both are high and close together, the model is underfitting, so I add capacity or better features. If training error is low and validation error is much higher, it's overfitting, so I get more data, regularise or simplify. The definition is table stakes. The diagnostic is what turns it into a decision.",
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
      "quick": [
        "Overfitting means learning noise, so new data fails.",
        "The model is more flexible than the data can support.",
        "Add more data, the best fix because it hits the cause.",
        "Use a simpler model or penalties on large weights.",
        "Stop training when validation error starts rising."
      ],
      "simple": "Overfitting is when a model learns the noise in the training data instead of the underlying pattern. It looks brilliant on data it has seen and fails on anything new, so the signature is a large gap between training and validation performance, such as 99 percent training accuracy with 70 percent on validation.\n\nIt happens because the model has more flexibility than the data can constrain, so it uses the spare flexibility to memorise. That gives three levers. Add data, which is the best fix because it attacks the cause. Reduce capacity, with a simpler model or regularisation such as L2 or dropout. Or stop early, when validation loss turns upward while training loss is still falling.\n\nCross-validation only detects overfitting, it doesn't prevent it. For example, if you try dozens of settings and keep whichever scores best on the test set, that score is now optimistic, so keep a final split you touch only once.",
      "points": [
        "Symptom: training performance far above validation.",
        "Cause: model capacity exceeds what the data can constrain.",
        "Three levers - more data, less capacity, early stopping.",
        "Cross-validation detects overfitting; it does not prevent it.",
        "Tuning against the test set overfits the test set."
      ],
      "say": "Overfitting means the model has learned the noise in the training data rather than the pattern, so it looks brilliant on data it's seen and fails on anything new. Ninety-nine percent training accuracy with seventy on validation is memorisation, not learning. The cause is capacity exceeding evidence. The model has more flexibility than the data can constrain, so it spends the spare flexibility memorising. That framing gives me three levers. The first is more data, or augmentation, which is the best fix because it attacks the cause. The second is less capacity, meaning a simpler model or regularisation, like L2 penalising large weights, or dropout. The third is early stopping, when validation loss turns up while training loss is still falling. Two things people forget. Cross-validation detects overfitting, it doesn't prevent it. And tuning hyperparameters on the test set overfits the test set too, so I keep a final split I touch only once.",
      "numbers": "A validation gap of a few percent is normal. Training accuracy at 99% with validation at 70% means memorisation, not learning.",
      "wrong": "Listing techniques with no organising idea - 'dropout, regularisation, more data, early stopping'. Correct, and it sounds like a flashcard rather than understanding.",
      "follow": "Training and validation loss are both high and flat. Is that overfitting?",
      "followAnswer": "No, that is underfitting - high bias. The model cannot even fit the data it has seen. So I add capacity or better features, reduce regularisation and train longer. I also check the basics: a learning rate that is too low or too high, noisy labels, or features that simply do not carry the signal. More data will not fix this one."
    },
    {
      "id": "ml-13",
      "q": "L1 vs L2 regularisation - what is the geometric intuition?",
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
      "quick": [
        "Both penalise large weights to keep the model simple.",
        "L1 pushes some weights to exactly zero, L2 only shrinks.",
        "L1's allowed region is a diamond with corners on the axes.",
        "The best fit usually hits a corner, where a weight is zero.",
        "Use L1 for fewer features, L2 when features overlap."
      ],
      "simple": "L1 and L2 regularisation both add a penalty on the size of the weights to the loss. L1, or lasso, adds the sum of absolute values, while L2, or ridge, adds the sum of squares. The key difference is that L1 pushes some weights to exactly zero, so it doubles as feature selection, while L2 only shrinks them.\n\nPicture two weights on a plane. L2 limits you to a circle around the origin, while L1 limits you to a diamond with its corners on the axes. The loss contours grow out until they touch that region, and a diamond's corners stick out, so they are often hit first, which sets one weight to exactly zero. A circle has no corners, so L2 gives small but non-zero weights.\n\nSo choose L1 for a sparse, explainable model and L2 when correlated features should share the weight. For example, with income and spending, L1 keeps one fairly arbitrarily.",
      "points": [
        "L1 (lasso) penalises absolute values; L2 (ridge) penalises squares.",
        "L1's constraint region is a diamond with corners on the axes.",
        "Contours often hit a corner first, so a coefficient becomes exactly zero.",
        "L2's circular region has no corners - shrinkage without sparsity.",
        "Gradient view: L2's pull shrinks with the weight; L1's pull is constant, so it reaches zero.",
        "L1 with correlated features keeps one somewhat arbitrarily; the choice is unstable."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of L1 and L2 regularisation: penalty, shape of the constraint region, effect on weights, and when to use each.",
        "aspects": [
          "Penalty",
          "Constraint shape",
          "Effect on weights",
          "Pull near zero",
          "Use when"
        ],
        "columns": [
          {
            "label": "L1 (lasso)",
            "note": "diamond",
            "accent": "accent",
            "cells": [
              "Sum of absolute values",
              "Diamond, corners on axes",
              "Some become exactly zero",
              "Constant, reaches zero",
              "Want a sparse model"
            ]
          },
          {
            "label": "L2 (ridge)",
            "note": "circle",
            "cells": [
              "Sum of squares",
              "Circle, no corners",
              "All shrink, none zero",
              "Weakens as weight shrinks",
              "Features are correlated"
            ]
          }
        ],
        "caption": "Loss contours usually hit **the diamond's corners**, where a weight is exactly zero. So **L1 selects features; L2 only shrinks them**."
      },
      "say": "Both penalise the size of the weights, but L1 drives some weights to exactly zero, while L2 only shrinks them. L1, or lasso, adds the sum of absolute values to the loss. L2, or ridge, adds the sum of squares. Geometrically, with two weights, L2 limits you to a circle around the origin, while L1 limits you to a diamond with its corners on the axes. The loss contours grow outwards from the unpenalised best fit until they touch that region, and a diamond's corners stick out, so they're usually hit first. At a corner, one weight is exactly zero. A circle has no corners, so L2 gives small but non-zero weights. L1's gradient pull is also constant, while L2's fades as the weight shrinks. I'd pick L1 for a sparse, explainable model and L2 when correlated features should share the weight. The catch is that L1 keeps one of a correlated pair fairly arbitrarily, and that choice can flip between retrains.",
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
      "quick": [
        "Split data into five or ten parts and rotate the test part.",
        "Every row is tested once, and scores are averaged.",
        "A wide spread across parts means an unstable model.",
        "Not for time data, train only on the past instead.",
        "Split grouped data by customer, and skip it for costly training."
      ],
      "simple": "Cross-validation estimates how well a model will do on new data. You split the data into k parts, usually five or ten, train on all but one, validate on the held-out part, then rotate, so every row is validated once and you average the scores. That is steadier than a single split, and a wide spread across folds suggests an unstable model or too little data.\n\nPlain k-fold is wrong in three situations. Time-series data needs forward-chaining folds, because a random split trains on the future. Grouped data needs splitting by group. For example, if one patient has ten visits spread across training and validation, the model recognises the individual rather than the pattern, so you split by patient. And expensive training rules it out, since k folds means k trainings.\n\nThe principle behind all three is that the split has to mirror how the model will actually be used.",
      "points": [
        "k folds, each row validated once, scores averaged. More stable than one split.",
        "Fold variance is itself a signal - wide spread suggests an unstable model or too little data.",
        "Time series → forward-chaining, never random.",
        "Grouped data → split by group, or the model learns the individual.",
        "Expensive training → k-fold costs k trainings.",
        "The split must mirror how the model will be used in production."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "How to split data for validation depending on its shape: random k-fold for independent rows, forward-chaining for time series, and group splits for repeated customers or patients.",
        "aspects": [
          "Split by",
          "Why",
          "Watch out"
        ],
        "columns": [
          {
            "label": "Independent rows",
            "note": "k-fold",
            "accent": "accent",
            "cells": [
              "Random k folds, k = 5-10",
              "Each row validated once",
              "Fold spread signals instability"
            ]
          },
          {
            "label": "Time series",
            "note": "forward-chaining",
            "accent": "warn",
            "cells": [
              "Train on earlier periods only",
              "Random split trains on future",
              "Report per fold"
            ]
          },
          {
            "label": "Grouped data",
            "note": "group split",
            "accent": "warn",
            "cells": [
              "Whole customer or patient",
              "Else model learns the individual",
              "k trainings is expensive"
            ]
          }
        ],
        "caption": "Cross-validation averages k scores for a stable estimate. The rule behind every exception: **the split must mirror how the model is used in production**."
      },
      "say": "Cross-validation splits the data into k folds, usually five or ten, trains on all but one, validates on the held-out fold, then rotates, so every row gets validated exactly once. Averaging the scores gives a steadier estimate than one split, and the spread across folds is a signal in itself, because a wide spread points to an unstable model or too little data. There are three places I wouldn't use plain k-fold. Time series is the first, because a random split trains on the future, so I use forward-chaining folds that only train on earlier periods. Grouped data is the second. If one customer has many rows, a random split lets the model recognise the customer rather than learn the pattern, so I split by customer. The third is expensive training, since k folds means k trainings, which is why fine-tuning is almost never cross-validated. The rule behind all three is that the split must mirror how the model is used in production.",
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
      "quick": [
        "Linear regression predicts a number, like a house price.",
        "Logistic regression predicts the chance of yes or no.",
        "Cross-entropy suits yes-or-no outcomes, MSE assumes a number.",
        "It punishes confident wrong answers hard.",
        "It trains well, while MSE stalls when confidently wrong."
      ],
      "simple": "Linear regression predicts a number, such as a house price, and is trained by minimising mean squared error, or MSE. Logistic regression predicts a probability for a yes-or-no outcome, such as whether a customer will churn. It computes the same weighted sum, then passes it through the sigmoid function, which squeezes it into the range 0 to 1, so despite the name it is a classifier.\n\nIt uses cross-entropy instead of MSE for three reasons. It fits the problem, because cross-entropy is what maximum likelihood gives you for a yes-or-no outcome. It punishes confident mistakes hard. For example, predicting 0.01 for a customer who actually churned costs about 4.6 in log loss, while squared error can never exceed 1. And it trains well, since the loss is convex and the gradient is simply prediction minus label, while sigmoid plus MSE has gradients that vanish when the model is confidently wrong.",
      "points": [
        "Linear: predicts a number; trained with MSE.",
        "Logistic: weighted sum → sigmoid → probability; a classifier despite the name.",
        "Cross-entropy is the maximum-likelihood loss for a yes/no outcome.",
        "Sigmoid + MSE is non-convex, and its gradient vanishes when confidently wrong.",
        "Cross-entropy's gradient is `p − y`: large when wrong, convex, stable.",
        "Coefficients are log-odds: `exp(w)` is the odds ratio per unit of the feature.",
        "Loss cheat-sheet: MSE, MAE or Huber for regression; binary cross-entropy for yes/no; categorical cross-entropy for many classes."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Linear versus logistic regression: what each predicts, its output, the loss it uses and why.",
        "aspects": [
          "Predicts",
          "Output",
          "Loss",
          "Why this loss"
        ],
        "columns": [
          {
            "label": "Linear",
            "note": "regression",
            "cells": [
              "A number",
              "Weighted sum",
              "MSE",
              "Fits continuous targets"
            ]
          },
          {
            "label": "Logistic",
            "note": "a classifier",
            "accent": "accent",
            "cells": [
              "Yes or no",
              "Weighted sum, then sigmoid",
              "Cross-entropy",
              "Convex; gradient is p - y"
            ]
          }
        ],
        "caption": "Logistic regression is a **classifier despite the name**. Sigmoid plus MSE is non-convex and stalls when confidently wrong, so it uses **cross-entropy**."
      },
      "say": "Linear regression predicts a number, like a house price, and trains on mean squared error. Logistic regression predicts the probability of a yes-or-no outcome. It computes the same weighted sum, then passes it through a sigmoid that squeezes it between zero and one, so despite the name it's a classifier. It uses cross-entropy for three reasons. It fits the problem, because cross-entropy is what maximum likelihood gives you for a binary outcome, while MSE assumes bell-shaped noise around a number. It punishes confident mistakes hard. Predict 0.01 for a customer who actually churned and the log loss is about 4.6, while squared error can never exceed 1. And it trains well. With sigmoid plus MSE the loss is non-convex and the gradient nearly vanishes when the model is confidently wrong. With cross-entropy the loss is convex and the gradient is simply prediction minus label. That's also why LLMs train with cross-entropy over the vocabulary.",
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
      "quick": [
        "A tree asks yes-or-no questions about the features.",
        "Each split picks the question that best separates the classes.",
        "One deep tree memorises the data and is unstable.",
        "A forest trains each tree on a random resample.",
        "Each split sees random features, then averaging steadies results."
      ],
      "simple": "A decision tree predicts by asking a series of yes-or-no questions about the features. At each node it tries every feature and threshold and picks the split that most reduces impurity, measured by Gini or entropy, then repeats on each branch.\n\nThe problem is that a single deep tree memorises the training data, and changing a few rows can give a visibly different tree. A random forest fixes this with two kinds of randomness. Each tree trains on a bootstrap resample of the data, and each split considers only a random subset of features. The second one is crucial. For example, in a credit model where income is by far the strongest feature, without subsampling income would sit at the root of every tree, they would all look alike, and averaging would gain nothing.\n\nAveraging many decorrelated trees cuts variance without adding bias, which is the whole case for a forest.",
      "points": [
        "Splits maximise impurity reduction - Gini or entropy.",
        "A single deep tree memorises and is unstable.",
        "Bagging: each tree trains on a bootstrap resample.",
        "Feature subsampling decorrelates the trees - the essential part.",
        "Averaging decorrelated high-variance trees cuts variance, not bias."
      ],
      "say": "A tree splits by asking yes-or-no questions about the features, and at each node it picks the question that most reduces impurity, measured by Gini or entropy. It tries every feature and candidate threshold, takes the best, and recurses. The trouble is that one deep tree memorises the training data and is unstable. Change a few rows and you can get a visibly different tree. A random forest fixes that with two kinds of randomness. Each tree trains on a bootstrap resample, so every tree sees slightly different data. And each split only considers a random subset of features. That second one is the crucial part, because otherwise one strong feature would sit at the root of every tree, they'd all look alike, and averaging would gain nothing. Individual trees are high-variance but roughly unbiased, so averaging many decorrelated ones cuts variance without adding bias. That's the whole case for a forest.",
      "numbers": "Feature subsampling defaults to the square root of the feature count for classification. More trees never overfits a forest - it just stops improving, typically past a few hundred.",
      "wrong": "'It builds many trees and averages them.' It misses feature subsampling, which is the mechanism that makes averaging worth anything.",
      "follow": "Why does adding more trees to a forest not cause overfitting?",
      "followAnswer": "Because each extra tree is one more vote in an average. As trees are added, the forest's prediction settles to a stable value, so the error flattens rather than rising. Overfitting in a forest comes from individual trees being too deep on too little data, or from trees being too similar, not from their number. Past a few hundred trees you mostly pay in memory and latency."
    },
    {
      "id": "ml-18",
      "q": "Bagging vs boosting - bias or variance?",
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
      "quick": [
        "Bagging averages many models trained in parallel, cutting variance.",
        "Boosting trains models in turn, each fixing past mistakes, cutting bias.",
        "Bagging steadies unstable models, boosting makes weak models strong.",
        "More trees never hurt bagging, but boosting can overfit.",
        "Use a random forest first, a tuned boosted model last."
      ],
      "simple": "Bagging and boosting both combine many models, but they attack opposite problems. Bagging reduces variance, and boosting reduces bias.\n\nBagging trains models in parallel, each on a bootstrap resample, and averages them, which makes an accurate but unstable model more stable. Deep trees are exactly that, which is why random forests work. Boosting trains models in sequence, each fixing the errors of the ensemble so far, so it starts from weak, shallow trees and builds up capacity. Put simply, bagging makes unstable models stable, and boosting makes weak models strong.\n\nThe practical consequence is that extra trees never hurt bagging, while too many boosting rounds will overfit, so boosting needs early stopping. For example, a random forest with 500 trees needs almost no tuning, while a boosted model with 500 rounds and no early stopping is very likely overfit. So a forest is a good quick baseline and a tuned boosted model is usually the final one.",
      "points": [
        "Bagging: parallel on resamples, reduces variance.",
        "Boosting: sequential on errors, reduces bias.",
        "Bagging stabilises unstable models; boosting strengthens weak ones.",
        "Extra trees are harmless in bagging, dangerous in boosting.",
        "Forest as the quick baseline; boosting for the tuned final model."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Bagging versus boosting: how models are trained, what each one learns from, which error it reduces, and what extra trees do.",
        "aspects": [
          "Training",
          "Each model sees",
          "Reduces",
          "More trees",
          "Role"
        ],
        "columns": [
          {
            "label": "Bagging",
            "note": "random forest",
            "accent": "accent",
            "cells": [
              "Parallel",
              "A bootstrap resample",
              "Variance",
              "Harmless",
              "Quick baseline"
            ]
          },
          {
            "label": "Boosting",
            "note": "XGBoost, LightGBM",
            "accent": "warn",
            "cells": [
              "Sequential",
              "Previous ensemble's errors",
              "Bias",
              "Overfits without early stopping",
              "Tuned final model"
            ]
          }
        ],
        "caption": "**Bagging makes unstable models stable; boosting makes weak models strong.** Bagging cuts variance, boosting cuts bias."
      },
      "say": "Bagging reduces variance, boosting reduces bias. Bagging trains many models in parallel, each on a bootstrap resample, and averages them. Averaging roughly independent estimates makes the result more stable without changing bias much, so it suits models that are accurate but jumpy. Deep trees are exactly that, which is why random forests work. Boosting trains models one after another, each correcting the errors of the ensemble so far. It starts from deliberately weak, shallow trees and builds capacity, so the ensemble can represent patterns no single tree could. The short version is that bagging makes unstable models stable, and boosting makes weak models strong. The practical consequences follow from that. Bagging runs in parallel, forgives rough hyperparameters, and extra trees never hurt it. Boosting is sequential, and too many rounds will overfit, so it needs early stopping on a validation set. That's why a random forest is my quick baseline and a tuned boosted model is usually the final one.",
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
      "quick": [
        "Boosting builds small trees one after another.",
        "Each new tree predicts the errors left so far.",
        "Trees stay shallow and each is added in small steps.",
        "Tables mix amounts, categories and dates, which trees handle well.",
        "It overfits with too many rounds, so stop early."
      ],
      "simple": "Gradient boosting builds small decision trees one after another, with each tree fixing the mistakes of the ones before. You fit a shallow tree, look at what it got wrong, fit the next tree to predict those errors, add it in at a small learning rate, and repeat. The trees are deliberately weak, around depth 3 to 6, because strong trees overcorrect and the sequence overfits fast.\n\nXGBoost adds regularisation on tree complexity and handles missing values, and it still wins on tabular data because the columns are mixed. For example, a fraud table has an amount, a category, a count and a date, with no spatial or sequence structure for a neural network to exploit. Trees handle mixed types and sharp thresholds natively and need little preprocessing.\n\nThe one caution is that, unlike a forest, boosting genuinely overfits with too many rounds, so early stopping on a validation set is not optional.",
      "points": [
        "Sequential: each tree fits the current ensemble's errors.",
        "Weak learners, depth 3 to 6, with a small learning rate.",
        "Forests reduce variance; boosting reduces bias.",
        "Boosting does overfit - early stopping is mandatory.",
        "Tabular data has little structure for a network to exploit; boosted trees are the default to beat."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Gradient boosting loop: the current ensemble's errors are computed, a shallow tree is fitted to them and added at a small learning rate, repeating until validation stops improving.",
        "lanes": [
          {
            "label": "Current ensemble",
            "note": "starts simple"
          },
          {
            "label": "Compute errors",
            "note": "residuals"
          },
          {
            "label": "Fit shallow tree",
            "note": "depth 3-6",
            "accent": "accent"
          },
          {
            "label": "Add at small rate",
            "note": "0.05-0.1, then repeat"
          },
          {
            "label": "Early stopping",
            "note": "validation stops improving",
            "accent": "warn"
          }
        ],
        "caption": "Each new tree **fits the errors of the trees before it**. Boosting really does overfit, so **early stopping on validation is mandatory**."
      },
      "say": "Gradient boosting builds small trees in sequence, each one fitting the errors the ensemble still makes. You fit a shallow tree, look at the residuals, fit the next tree to predict them, and add it in at a small learning rate. Formally each tree fits the negative gradient of the loss, which is where the name comes from. The trees stay weak, around depth three to six, because strong trees overcorrect and the sequence overfits fast. XGBoost adds regularisation on tree complexity, uses second-order gradients and learns a default direction for missing values. It still wins on tabular data because the columns are mixed. A fraud table has an amount, a category, a count and a date, with no spatial or sequence structure for a neural network to exploit, while trees handle mixed types and sharp thresholds natively with little preprocessing. The catch is that boosting really does overfit with too many rounds, so early stopping on validation isn't optional.",
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
      "quick": [
        "Step the weights downhill against the slope of the error.",
        "Variants differ in how much data each step uses.",
        "Mini-batches of 32 to 512 examples are the norm.",
        "Momentum and per-weight step sizes, combined in AdamW, help.",
        "Step size matters most, too high and training breaks."
      ],
      "simple": "Gradient descent is how most models are trained. Imagine you are on a foggy hillside and want to reach the valley, so you feel which way the ground slopes and take a step downhill, then repeat. The gradient is the slope of the loss for each weight, and you step against it so the loss goes down.\n\nThe variants differ in how much data estimates the slope before each step. Batch uses the whole dataset, which is accurate but too slow at scale. Stochastic uses one example, which is fast but very noisy. Mini-batch uses 32 to 512 examples and fits how GPUs work, so everyone uses it. Momentum damps oscillation, adaptive rates give each weight its own step size, and AdamW combines both, which is why transformers train with it.\n\nThe learning rate matters most. Too high and the loss diverges, too low and training stalls. For example, full fine-tuning of a BERT-sized model uses roughly 1e-5 to 5e-5.",
      "points": [
        "Step against the gradient of the loss.",
        "Batch, stochastic, mini-batch differ in data used per step.",
        "Momentum damps oscillation; adaptive rates fix per-parameter scale.",
        "AdamW is the transformer default; newer optimisers such as Muon are being tried in some large pre-training runs.",
        "Learning rate is the hyperparameter that decides success."
      ],
      "say": "Gradient descent trains a model by repeatedly nudging each weight a small step against the gradient, which is the slope of the loss for that weight. The variants differ in how much data estimates that slope before each step. Batch uses the whole dataset, which is accurate but far too slow at scale. Stochastic uses one example, which is fast but very noisy. Mini-batch uses 32 to 512 examples, accurate enough and a natural fit for GPUs, so that's what everyone runs. Then come the fixes. Momentum keeps a running average of recent gradients, which damps oscillation across narrow valleys. Adaptive methods give each weight its own step size, so rarely updated weights still move. Adam combines both, and AdamW fixes how Adam handled weight decay, which makes it the transformer default. The hyperparameter that matters most is the learning rate. Too high and the loss diverges, too low and training stalls, which is why warmup and a decay schedule are standard.",
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
      "quick": [
        "Backpropagation finds how much each weight caused the error.",
        "The forward pass makes a prediction and stores values.",
        "The backward pass works from the error back, layer by layer.",
        "Reusing each layer's result makes it cheap for all weights.",
        "Stored values are why training needs far more memory."
      ],
      "simple": "Backpropagation is how a neural network works out how much each weight contributed to the error, so that gradient descent knows which way to move each one. In the forward pass, the input flows through the layers to a prediction, the loss scores it, and the intermediate activations are stored.\n\nThe backward pass starts from the loss and works back layer by layer with the chain rule, asking how much the loss would change if each value changed a little. The clever part is reuse. Each layer's gradient is built from the one after it, so one backward pass gives the gradient for every weight at about twice the cost of the forward pass. Then the optimiser, such as AdamW, uses those gradients to update the weights.\n\nFor example, storing those activations is a big reason training needs far more GPU memory than inference. And because gradients multiply through many layers, they can vanish or explode.",
      "points": [
        "Forward pass computes the prediction and loss, storing activations.",
        "Backward pass applies the chain rule from the loss back to every weight.",
        "Reuse makes it cheap: one backward pass costs about 2× a forward pass, for all weights at once.",
        "Backprop computes gradients; the optimiser uses them. Two different steps.",
        "Stored activations are a big reason training needs much more memory than inference."
      ],
      "say": "Backpropagation works out how much each weight contributed to the error, so the optimiser knows which way to move it. There are two passes. The forward pass sends the input through the layers, makes a prediction, scores the loss, and stores the intermediate activations along the way. The backward pass starts from the loss and works back layer by layer with the chain rule, asking how much the loss would change if each value changed a little. The clever part is reuse. Each layer's gradient is built from the one after it, so one backward pass gives the gradient for every weight at roughly twice the cost of the forward pass. Then a separate step, the optimiser, such as AdamW, uses those gradients to update the weights. Two consequences matter in practice. Those stored activations are a big reason training needs far more GPU memory than inference. And because gradients multiply through many layers, they can vanish or explode.",
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
      "quick": [
        "Without activations, stacked layers collapse into one straight line.",
        "Activations add bends, so the network learns curved patterns.",
        "Sigmoid squeezes to 0 to 1, now mostly used for outputs.",
        "ReLU passes positive values straight through, cheap and fast.",
        "Modern language models use smoother GELU and SwiGLU."
      ],
      "simple": "Without an activation function, a neural network is just a stack of linear layers, and that collapses into one linear layer, because multiplying matrices together just gives another matrix. The activation adds a bend after each layer, and many stacked bends let the network model curved, complex patterns.\n\nSigmoid squeezes values into 0 to 1 and is still used at the output for a yes-or-no probability, but in hidden layers it saturates and its slope is at most 0.25, so gradients shrink. Tanh is centred on zero but still saturates. ReLU passes positive inputs straight through with a slope of 1, so gradients flow, which made deep networks practical. Its flaw is that a unit stuck on negative inputs outputs zero forever, which Leaky ReLU softens.\n\nTransformers use smoother options. For example, GELU is used in BERT and GPT-2, and a gated variant called SwiGLU is used in Llama and most recent open LLMs.",
      "points": [
        "Stacked linear layers without activations collapse into one linear layer.",
        "Sigmoid: 0 to 1, used at binary outputs; saturates, max slope 0.25.",
        "Tanh: -1 to 1, zero-centred, still saturates.",
        "ReLU: slope 1 for positives, cheap; can leave dead units (Leaky ReLU helps).",
        "GELU (BERT, GPT-2) and SwiGLU (Llama and most recent open LLMs) are the transformer choices.",
        "Softmax turns output scores into a probability distribution."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of activation functions: sigmoid and tanh, ReLU, and GELU or SwiGLU, by range, maximum slope, weakness and where they are used.",
        "aspects": [
          "Output range",
          "Max slope",
          "Weakness",
          "Used in"
        ],
        "columns": [
          {
            "label": "Sigmoid / tanh",
            "note": "squash",
            "accent": "bad",
            "cells": [
              "0 to 1 / -1 to 1",
              "0.25 / 1",
              "Saturate, gradients shrink",
              "Binary output, LSTM cells"
            ]
          },
          {
            "label": "ReLU",
            "note": "max(0, x)",
            "cells": [
              "0 upwards",
              "1 for positives",
              "Dead units",
              "Deep networks, CNNs"
            ]
          },
          {
            "label": "GELU / SwiGLU",
            "note": "smooth, gated",
            "accent": "accent",
            "cells": [
              "Small negatives pass",
              "About 1 for positives",
              "Slightly more compute",
              "BERT, GPT-2, Llama"
            ]
          }
        ],
        "caption": "Without activations, stacked linear layers **collapse into one linear layer**. The bend lets depth model curves; modern transformers use **GELU or SwiGLU**."
      },
      "say": "Without them, a stack of linear layers collapses into a single linear layer, because multiplying matrices just gives another matrix, so depth would buy you nothing. An activation adds a bend after each layer, and many stacked bends let the network model curved, complex patterns. Sigmoid squeezes values into zero to one, but it saturates and its slope is at most 0.25, so gradients shrink layer by layer. Today I'd only use it at the output, for a yes-or-no probability. Tanh is centred on zero, which helps, but it still goes flat for large inputs. ReLU passes positive inputs straight through with a slope of one, so it's cheap and lets gradients flow, which is what made deep networks practical. Its flaw is that a unit stuck on negative inputs outputs zero forever, and Leaky ReLU softens that. Transformers use smoother options. GELU is in BERT and GPT-2, and a gated variant called SwiGLU is in Llama and most recent open models.",
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
      "quick": [
        "The learning signal fades before reaching early layers.",
        "Multiplying many small numbers backwards shrinks it to nothing.",
        "Sigmoid made it worse, capping each layer's slope at 0.25.",
        "ReLU and skip connections let the signal pass through.",
        "Normalisation and careful starting weights keep values steady."
      ],
      "simple": "The vanishing gradient problem is when the learning signal fades before it reaches the early layers of a deep network. Backpropagation multiplies gradients layer by layer, and multiplying many numbers smaller than one collapses toward zero, so the early layers stop learning. Sigmoid made this worse. For example, its slope is at most 0.25, so across ten layers it shrinks the gradient by about a million times.\n\nThe fixes can mostly be seen inside a modern transformer. ReLU-style activations have a slope of 1 for positive inputs, so the gradient passes through unshrunk. Residual connections add each block's input back to its output, giving the gradient a direct path around the block, which is what makes very deep networks trainable. Normalisation and careful initialisation keep values in a steady range. The mirror problem, exploding gradients, is handled with gradient clipping.",
      "points": [
        "Gradients multiply backwards; values under 1 collapse toward zero.",
        "Sigmoid's maximum derivative is 0.25 - a guaranteed shrink. Tanh peaks at 1 but saturates.",
        "ReLU passes gradient unchanged for positive inputs.",
        "Residual connections give gradients a path around each block.",
        "Normalisation and Xavier/He initialisation keep the scale stable.",
        "Clipping handles the exploding case; LSTM gates fixed it for RNNs."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A gradient flowing backwards through sigmoid layers shrinks by up to four times at each layer, reaching about one millionth after ten layers.",
        "lanes": [
          {
            "label": "Loss",
            "note": "gradient 1",
            "accent": "accent"
          },
          {
            "label": "Layer 10",
            "note": "x 0.25 = 0.25"
          },
          {
            "label": "Layer 9",
            "note": "x 0.25 = 0.06"
          },
          {
            "label": "Layer 8",
            "note": "x 0.25 = 0.016",
            "accent": "warn"
          },
          {
            "label": "...",
            "note": "keeps shrinking",
            "accent": "muted"
          },
          {
            "label": "Layer 1",
            "note": "about 1e-6, stops learning",
            "accent": "bad"
          }
        ],
        "caption": "Gradients **multiply backwards**, so slopes under 1 fade to nothing. The fixes: **ReLU, residual connections, normalisation and good initialisation**."
      },
      "say": "The learning signal fades before it reaches the early layers of a deep network, so those layers stop learning. Backpropagation multiplies gradients layer by layer on the way back, and multiplying many numbers below one collapses towards zero. Sigmoid made it worse because its slope caps at 0.25. Across ten layers that alone shrinks the gradient by about a million times. The fixes are all visible inside a modern transformer. ReLU-style activations have a slope of one for positive inputs, so the gradient passes through unshrunk. Residual connections add each block's input back to its output, which gives the gradient a direct path around the block, and at real depth that's the most important fix. Normalisation and careful initialisation, like Xavier or He, keep values in a steady range from layer to layer. Before transformers, LSTM gates solved it for RNNs. The mirror problem, exploding gradients, is handled with gradient clipping, usually around 1.0.",
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
      "quick": [
        "Precision is how often your alarms are right.",
        "Recall is how many real cases you catch.",
        "Raising one usually lowers the other.",
        "Pick by which mistake costs more, like missed fraud.",
        "F1 blends both and punishes a big gap between them."
      ],
      "simple": "Precision is how often your alarms are right, and recall is how many of the real cases you catch. For a fraud model, precision asks how much of what I flagged was actually fraud, so false alarms pull it down, while recall asks how much of the real fraud I caught, so misses pull it down.\n\nThe two pull against each other, and the threshold moves both, so the question is which mistake costs more in this business. For example, at a bank a missed fraud is a direct loss while a false alarm is one annoyed customer, so recall wins. A spam filter flips it, because a legitimate invoice in the junk folder loses real money, so precision wins.\n\nF1 is the harmonic mean of the two, useful when both matter roughly equally. It punishes imbalance, so a precision of 0.9 with a recall of 0.1 gives an F1 of about 0.18, not 0.5.",
      "points": [
        "Precision: of what I flagged, how much was right. Hurt by false alarms.",
        "Recall: of what was there, how much I caught. Hurt by misses.",
        "They trade against each other - the threshold moves both.",
        "Choose by which error costs the business more, never by default.",
        "F1 is the harmonic mean; it punishes imbalance rather than averaging it."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "Confusion matrix of truth against the model's flag: true positives, missed cases that hurt recall, false alarms that hurt precision, and true negatives.",
        "xLabel": "Model says",
        "yLabel": "Truth",
        "cols": [
          "Flagged",
          "Not flagged"
        ],
        "rows": [
          "Positive",
          "Negative"
        ],
        "cells": [
          [
            {
              "label": "Caught",
              "note": "true positive",
              "accent": "accent"
            },
            {
              "label": "Missed",
              "note": "hurts recall",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "False alarm",
              "note": "hurts precision",
              "accent": "warn"
            },
            {
              "label": "Correctly ignored",
              "note": "true negative",
              "accent": "muted"
            }
          ]
        ],
        "caption": "**Precision** = of what I flagged, how much was right. **Recall** = of what was there, how much I caught. Pick by **which error costs the business more**."
      },
      "say": "Precision is how often your alarms are right, recall is how many real cases you catch, and the costlier mistake decides which matters. Precision asks, of everything I flagged, how much was actually right, so false alarms pull it down. Recall asks, of all the real cases, how many I caught, so misses pull it down. The threshold trades one for the other. Flag more and recall rises while precision falls. At a bank, a missed fraud is a direct loss and a regulatory problem, while a false alarm is one phone call to a customer, so I'd favour recall. A spam filter flips it, because a real invoice in the junk folder loses money, so precision wins. F1 is the harmonic mean of the two, useful when both matter equally. It's deliberately unforgiving, so a precision of 0.9 with a recall of 0.1 gives about 0.18, not 0.5. The question is never which is better, only which error costs more.",
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
      "quick": [
        "If fraud is rare, always saying no scores 99 percent.",
        "That model catches nothing, so accuracy hides the real problem.",
        "Check how often alarms are right and how many cases you catch.",
        "Use one blended score when both matter equally.",
        "Ask which mistake costs the business more."
      ],
      "simple": "Accuracy is a bad metric mainly because of imbalance, and most real data is imbalanced. For example, if one in a hundred insurance claims is fraudulent, a model that says \"not fraud\" every time is 99 percent accurate and has 0 percent recall. Accuracy has hidden the only thing you cared about.\n\nSo instead you look at the confusion matrix and pick metrics that match the cost of each mistake. Precision matters when a false positive is expensive, such as sending investigators to a legitimate customer. Recall matters when a miss is expensive, such as a missed fraud or a missed disease. F1 combines the two, and on heavy imbalance PR-AUC is a better summary than ROC-AUC.\n\nThe part that really matters is asking the business which mistake costs more, rather than assuming it, because that answer decides the metric.",
      "points": [
        "Imbalance makes accuracy meaningless - a constant prediction can score 99%.",
        "Precision: of those I flagged, how many were real. Guards against false positives.",
        "Recall: of the real cases, how many I caught. Guards against false negatives.",
        "F1 when you need one number; AUC-PR over AUC-ROC on heavy imbalance.",
        "The metric follows from which error costs more. Ask, do not assume."
      ],
      "say": "Accuracy breaks on imbalanced data, which is most real data, so I use metrics tied to the cost of each mistake. If one claim in a hundred is fraud, a model that always says not fraud is 99 percent accurate and catches nothing. Accuracy has hidden the only thing we care about. So I look at the confusion matrix instead. Precision matters when a false positive is expensive, like sending investigators to a legitimate customer or blocking a good transaction. Recall matters when a miss is expensive, like a missed fraud or a missed disease. F1 gives one number when both matter, and on heavy imbalance I prefer PR-AUC to ROC-AUC, because ROC looks optimistic when negatives dominate. The part that really scores is asking the business which mistake costs more, rather than assuming it. That answer decides the metric.",
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
      "quick": [
        "The ROC curve checks if real cases score above normal ones.",
        "When real cases are rare, false alarms barely move it.",
        "So a model can look great with a flood of false alarms.",
        "PR-AUC tracks how often alarms are right, so it shows that pain.",
        "For rare fraud or disease, lead with PR-AUC."
      ],
      "simple": "A classifier outputs a score, and sweeping the decision threshold gives a different confusion matrix at each point. The ROC curve plots recall against the false positive rate across that sweep, and the area under it is the chance a random positive scores above a random negative, so 0.5 is a coin flip and 1.0 is perfect.\n\nThe problem is that the false positive rate divides by all negatives, so when negatives are huge, false alarms barely move it. For example, if fraud is 0.1 percent of a million transactions and the model wrongly flags 10,000 legitimate ones, that is an unusable alert queue, yet only about 1 percent of negatives, so ROC-AUC still looks excellent. Precision divides by what you flagged instead, so PR-AUC shows the pain directly.\n\nSo with rare positives, which is the normal case, lead with PR-AUC and report ROC-AUC alongside.",
      "points": [
        "ROC-AUC: probability a random positive outranks a random negative.",
        "FPR divides by all negatives, so imbalance hides false alarms.",
        "PR-AUC uses precision, which reacts to the alert-queue cost.",
        "Baseline: ROC 0.5 always; PR equals the positive rate.",
        "Rare positives are the normal case - lead with PR-AUC there, ROC-AUC alongside."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "ROC-AUC versus PR-AUC: what each plots, what false alarms are divided by, the random baseline, and when to lead with each.",
        "aspects": [
          "Plots",
          "Divides by",
          "Random baseline",
          "Rare positives",
          "Lead with it"
        ],
        "columns": [
          {
            "label": "ROC-AUC",
            "note": "ranking",
            "cells": [
              "Recall vs false positive rate",
              "All negatives",
              "Always 0.5",
              "Hides false alarms",
              "Balanced classes"
            ]
          },
          {
            "label": "PR-AUC",
            "note": "alert queue",
            "accent": "accent",
            "cells": [
              "Precision vs recall",
              "What you flagged",
              "The positive rate",
              "Shows false alarms",
              "Rare positives: fraud, defects"
            ]
          }
        ],
        "caption": "With huge negatives, 10,000 false alarms barely move the false positive rate. **Precision divides by what you flagged**, so PR-AUC exposes them."
      },
      "say": "The ROC curve plots recall against the false positive rate as you sweep the threshold, and it can flatter a model badly when positives are rare. The area under it is the chance a random positive scores above a random negative, so 0.5 is a coin flip and 1.0 is perfect. The catch is that the false positive rate divides by all negatives, so when negatives are huge, false alarms barely move it. Say fraud is 0.1 percent of a million transactions and the model wrongly flags 10,000 legitimate ones. That's an unusable alert queue, yet it's only about one percent of negatives, so ROC-AUC still looks excellent. Precision divides by what you flagged instead, so PR-AUC shows that pain directly. With rare positives like fraud, defects or disease, I lead with PR-AUC and precision at the operating threshold, and report ROC-AUC alongside. Mind the baselines too. Random PR-AUC equals the positive rate, so at 0.1 percent prevalence a PR-AUC of 0.4 is strong.",
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
      "quick": [
        "First check if rare cases are actually being missed.",
        "Moving the cut-off score is often the whole fix.",
        "Next, give rare cases more weight in training.",
        "Resample only inside the training data, never the test set.",
        "With very few rare cases, treat it as spotting oddities."
      ],
      "simple": "Imbalanced data means one class is much rarer than the other, such as fraud among normal transactions. The first step is to ask whether it is actually a problem, because imbalance on its own is not. What matters is whether the model ignores the minority class, so you check its recall before changing anything.\n\nIf it is hurting, go cheapest first. Moving the decision threshold is often the whole fix, because the ranking may already be good and only the default 0.5 cut-off is wrong. Next come class weights, which need no data changes. Only then do you resample.\n\nThe rule that matters most is to resample inside the training fold only. For example, if you oversample fraud cases before splitting, copies of the same rows leak into the test set, and the score stops meaning anything real. Validation and test must keep the true class balance.",
      "points": [
        "First check whether minority-class recall is actually bad. Imbalance alone is not a problem.",
        "Adjust the decision threshold - often the entire fix.",
        "Class weights next: no data manipulation needed.",
        "Then resampling - inside the training fold only.",
        "Never resample validation or test. The number stops meaning anything.",
        "Very few positives → consider anomaly detection instead."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Handling imbalanced data, cheapest fix first: check minority recall, move the threshold, add class weights, resample inside the training fold, or switch to anomaly detection.",
        "lanes": [
          {
            "label": "Check recall",
            "note": "is it really a problem?",
            "accent": "accent"
          },
          {
            "label": "Move threshold",
            "note": "often the whole fix",
            "accent": "accent"
          },
          {
            "label": "Class weights",
            "note": "no data changes"
          },
          {
            "label": "Resample",
            "note": "training fold only",
            "accent": "warn"
          },
          {
            "label": "Anomaly detection",
            "note": "if positives are very few",
            "accent": "muted"
          }
        ],
        "caption": "Go **cheapest first**: imbalance alone is not a problem. **Never resample validation or test**, or the number stops meaning anything."
      },
      "say": "First I check whether the imbalance is actually hurting, because imbalance on its own isn't a problem. What matters is recall on the minority class, so I look at that before changing anything. If it is hurting, I go cheapest first. Moving the decision threshold is often the whole fix, because the model's ranking may already be good and only the 0.5 cut-off is wrong. Next come class weights, which most libraries support and which need no changes to the data. Only then do I resample, undersampling the majority when data is plentiful or oversampling the minority when it isn't. The rule that matters is to resample inside the training fold only. Oversample fraud cases before splitting and copies leak into the test set, so the score stops meaning anything real. Validation and test keep the true class balance. And if there are only a handful of positives, I'd treat it as anomaly detection rather than classification.",
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
      "quick": [
        "Leakage is training on information not available in real use.",
        "A payout date predicts approval perfectly, but comes after it.",
        "Also watch scaling before splitting, random time splits and duplicates.",
        "Suspect results that look too good or one dominant column.",
        "Ask when each column exists in real time."
      ],
      "simple": "Data leakage is when information reaches the model during training that will not be available when it actually runs. The model looks brilliant in validation because it was effectively shown the answer, and then it fails in production.\n\nThe classic form is target leakage, a feature that is a consequence of the outcome. For example, a payout date column predicts claim approval perfectly, but it only exists after approval, so it is useless. Other forms are scaling or imputing across the whole dataset before splitting, randomly splitting time-series data so the model trains on the future, and duplicate rows landing on both sides of the split.\n\nYou catch it by distrusting any result that looks too good, especially when one feature carries most of the importance. The most useful question is when each feature becomes available in production, and every transformation should be fitted inside the training fold only.",
      "points": [
        "Target leakage - a feature that exists only because the outcome happened.",
        "Contamination - scaling or imputing before splitting.",
        "Temporal leakage - random split on time-ordered data.",
        "Duplicates landing on both sides of the split.",
        "Signature: results too good; one feature dominating importance.",
        "The catch-all test: when does this feature become available in production?",
        "Fit every transformation inside the training fold only."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Leaky versus safe practice for four kinds of data leakage: preprocessing, splitting time-ordered data, target leakage in features, and duplicate rows.",
        "aspects": [
          "Preprocessing",
          "Time-ordered data",
          "Features",
          "Duplicates"
        ],
        "columns": [
          {
            "label": "Leaky",
            "note": "too good to be true",
            "accent": "bad",
            "cells": [
              "Scale or impute before split",
              "Random split",
              "Exists only after outcome",
              "Same rows on both sides"
            ]
          },
          {
            "label": "Safe",
            "note": "mirrors production",
            "accent": "accent",
            "cells": [
              "Fit on training fold only",
              "Split by time",
              "Available at prediction time",
              "Dedupe before splitting"
            ]
          }
        ],
        "caption": "**Fit every transformation inside the training fold only.** To catch target leakage, ask: **when does this feature exist in production?**"
      },
      "say": "Leakage is when the model trains on information it won't have at prediction time, so validation looks brilliant and production fails. The classic case is target leakage. A payout date column predicts claim approval perfectly, but it only exists after approval, so it's useless for a real prediction. Other forms are scaling or imputing across the whole dataset before splitting, random splits on time-ordered data, which means training on the future, and duplicate rows landing on both sides of the split. I catch it by distrusting any result that looks too good and by checking feature importance, because one feature dominating is the classic signature. The most useful question is when each feature becomes available in production, because that catches target leakage directly. Beyond that, I split by time whenever the data has time in it, and I fit every transformation inside the training fold only, so test statistics never reach training.",
      "numbers": "No number applies. The tell is a suspiciously high score and one feature carrying most of the importance.",
      "wrong": "\"I use train-test split to avoid it.\" On time-ordered data a random split is itself the cause of temporal leakage, so the follow-up will show this answer names the mechanism that created the problem.",
      "follow": "Your model scores 0.99 AUC. Are you pleased?",
      "followAnswer": "Suspicious first. On most real problems 0.99 means leakage until proven otherwise. I check feature importance for one dominant feature, ask when each top feature becomes available in production, look for duplicates or the same entity on both sides of the split, and confirm the split respects time. If it survives all that, I test on a fresh, later sample before believing it."
    },
    {
      "id": "ml-26",
      "q": "Explain data drift vs concept drift and how you detect each.",
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
      "quick": [
        "Both make a model quietly worse.",
        "Data drift means the inputs change, but the rules hold.",
        "Concept drift means the right answer itself changes.",
        "Spot data drift at once by comparing inputs to training.",
        "Concept drift needs new labels, so watch early warning signs."
      ],
      "simple": "Data drift and concept drift both mean your model is quietly getting worse, but they have different causes. Data drift is the inputs changing while the relationship holds. For example, you expand from three cities to fifteen and incoming customers no longer resemble your training data, and retraining on recent data usually fixes it.\n\nConcept drift is the relationship itself changing. Fraudsters adapt, so what predicted fraud last year stops predicting it, even though the inputs look the same. This is worse, because retraining only helps once you have enough new labels.\n\nDetection differs too. Data drift can be spotted straight away without labels, by comparing feature distributions with a measure such as PSI, where above 0.2 is significant. Concept drift only shows once ground truth arrives, which for churn might be ninety days later, so you also watch cheap proxies like the share of positive predictions.",
      "points": [
        "Data drift: inputs change, relationship holds. Retraining usually fixes it.",
        "Concept drift: the relationship changes. Needs new labels.",
        "Data drift is detectable without labels - PSI or KS per feature.",
        "Concept drift only shows once ground truth arrives.",
        "Watch prediction distribution and override rate as early proxies."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A 2x2 grid of whether inputs change against whether the input-outcome relationship changes: stable, data drift, concept drift, or both.",
        "xLabel": "Relationship changes?",
        "yLabel": "Inputs change?",
        "cols": [
          "No",
          "Yes"
        ],
        "rows": [
          "No",
          "Yes"
        ],
        "cells": [
          [
            {
              "label": "Stable",
              "accent": "accent"
            },
            {
              "label": "Concept drift",
              "note": "needs new labels",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "Data drift",
              "note": "PSI or KS, no labels",
              "accent": "warn"
            },
            {
              "label": "Both",
              "note": "retrain on new labels",
              "accent": "bad"
            }
          ]
        ],
        "caption": "**Data drift** is visible at once without labels. **Concept drift** only shows when ground truth arrives, so watch prediction shifts as an early proxy."
      },
      "say": "Data drift means the inputs change, concept drift means the right answer for the same input changes, and you detect them differently. With data drift the relationship between features and outcome still holds. Expand from three cities to fifteen and incoming customers stop resembling the training data, and retraining on recent data usually fixes it. Concept drift is worse. Fraudsters adapt, so patterns that predicted fraud last year stop predicting it, even though the inputs look the same, and retraining only helps once enough new labels reflect the new reality. Data drift I can spot straight away without labels, using PSI or a KS test per feature, where a PSI above 0.2 means significant drift. Concept drift only shows once ground truth arrives, which for churn might be ninety days later. That lag is why I also watch cheap proxies, like the share of positive predictions and the rate of manual overrides.",
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
      "quick": [
        "Try the LLM first, a real score in an afternoon.",
        "High volume or need for speed favours a small trained BERT.",
        "500 clean examples is enough to train it.",
        "Keep the LLM if labels keep changing or volume is low.",
        "Or let the LLM label thousands of examples to train BERT."
      ],
      "simple": "With 500 labelled examples, I would try the LLM first, because it is quick, and switch to a small fine-tuned model when volume, latency or cost demand it. A few-shot prompt evaluated on a held-out set gives a real accuracy number in an afternoon, with no training and no infrastructure, and often it is good enough.\n\nA small encoder such as BERT wins at high volume, because it runs almost free per call, and in real-time paths, because it answers in milliseconds rather than hundreds of milliseconds. 500 clean examples is enough to fine-tune one, and it often beats prompting on subtle domain labels. Changing label definitions or low volume keep you on the LLM.\n\nThe move that gets both is distillation. For example, the LLM labels ten thousand unlabelled support tickets, you check a sample by hand, and the encoder trains on those, with your 500 gold labels as the test set.",
      "points": [
        "Prototype with the LLM first - a working baseline in an afternoon.",
        "High volume or tight latency pushes you to a fine-tuned encoder.",
        "500 clean examples is enough to fine-tune a small encoder.",
        "Unstable labels or low volume favour keeping the LLM.",
        "Distil: LLM labels the bulk data, encoder serves production."
      ],
      "diagram": {
        "alt": "Decision path for a 500-example classifier: prototype with an LLM first; if volume or latency demand it, distil into a fine-tuned small encoder, otherwise keep the LLM.",
        "rows": [
          [
            {
              "id": "llm",
              "label": "Prototype with LLM",
              "note": "few-shot, an afternoon",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "q",
              "label": "High volume or latency?",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "keep",
              "label": "Keep the LLM",
              "note": "low volume, changing labels"
            },
            {
              "id": "ft",
              "label": "Fine-tune encoder",
              "note": "LLM labels bulk data",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "llm",
            "to": "q"
          },
          {
            "from": "q",
            "to": "keep",
            "label": "no"
          },
          {
            "from": "q",
            "to": "ft",
            "label": "yes"
          }
        ],
        "caption": "**Start with the LLM** for a quick baseline. Switch to a small encoder when volume or latency demand it, and **keep the 500 gold labels as the test set**."
      },
      "say": "I'd start with the LLM, then move to a fine-tuned small encoder if volume or latency demand it. A few-shot prompt gives me a real accuracy number on a held-out set in an afternoon, with no training and no infrastructure, and often that's good enough. At millions of calls a month, or in a real-time path, an encoder like BERT, DeBERTa or ModernBERT is far cheaper and answers in milliseconds rather than hundreds of milliseconds. And 500 clean examples is enough to fine-tune one, which often beats prompting on subtle domain labels because the boundaries come from the data. If the label definitions are still changing, volume is low, or the task needs broad world knowledge, I'd stay with the LLM. The move that gets both is distillation. The LLM labels ten thousand unlabelled examples, I check a sample by hand, and the encoder trains on those. My 500 gold labels become the test set that proves it worked.",
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
      "quick": [
        "0.5 is a library default, not a decision.",
        "If a miss costs forty times a false alarm, flag far more.",
        "Try cut-offs on validation data and pick the cheapest.",
        "Without costs, use review capacity or a legal target.",
        "Re-check it regularly as the rate of cases changes."
      ],
      "simple": "A classifier outputs a score, say 0.73, and only a threshold decides whether that counts as positive. The default of 0.5 is just the value the library picked, not an analysis, so the right way to choose is from the cost of each mistake.\n\nFor example, say a missed fraud loses about 8,000 rupees while blocking a good transaction costs about 200 in support. A miss costs forty times a false alarm, so you should flag far more aggressively, and with calibrated probabilities the break-even is about 0.024. Scores usually aren't calibrated, so in practice you sweep the threshold on validation data, compute the total cost at each point, and take the minimum.\n\nWhen costs are unknown, use a constraint instead, such as how many alerts the review team can handle a day. And the best threshold drifts as the base rate changes, so re-check it on a schedule.",
      "points": [
        "0.5 is a library default, never an analysis.",
        "Build a cost matrix and minimise expected cost on validation data.",
        "No costs available? Use a capacity or regulatory constraint instead.",
        "Raw scores are not calibrated probabilities without calibration.",
        "Re-check the threshold as prevalence drifts."
      ],
      "say": "I pick it from the cost of each mistake, because 0.5 is just the library's default, not an analysis. The first step is a cost matrix. Say a missed fraud loses about 8,000 rupees on average and a blocked good transaction costs about 200 in support. A miss is forty times worse, so I should flag far more aggressively. With calibrated probabilities the break-even is one over forty-one, about 0.024, far below 0.5. Scores usually aren't calibrated though, especially from a random forest or a model trained with class weights, so in practice I sweep the threshold on validation data, compute total cost at each point, and take the minimum. When costs are unknown, I use a constraint instead, like how many alerts the review team can handle a day, or a regulatory recall target. The thing people forget is that the best threshold moves as the base rate drifts, so I re-check it on a schedule rather than setting it once.",
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
      "quick": [
        "Calibration asks if a score of 0.8 means 80 percent.",
        "AUC only checks ranking, not whether the numbers are honest.",
        "A good ranker can be overconfident, which hurts pricing and risk.",
        "Plot predicted against actual rates, then fix on held-out data.",
        "Class weights and resampling break it, so recheck by group."
      ],
      "simple": "Calibration asks whether a predicted probability means what it says. If a model gives many cases a score of around 0.8, roughly 80 percent of them should turn out positive. AUC cannot tell you this, because it only measures ranking, so a model can rank very well and still be too confident or too cautious.\n\nThat matters whenever the score drives a decision. For example, if an insurer prices policies from a claim-risk score, a model that says 0.8 when the true rate is 0.5 will overprice a whole group of customers, even though it ranks them correctly.\n\nYou check it with a reliability diagram, which compares each bin's average predicted probability with its observed positive rate. If it is off, fit a calibration mapping, such as Platt scaling or temperature scaling, on held-out data. Class weights and resampling distort the base rate, so recalibrate after using them.",
      "points": [
        "Calibration compares predicted probability with observed frequency.",
        "AUC measures ranking, not probability correctness.",
        "Check reliability curves plus Brier score, log loss or ECE.",
        "Fix with Platt, isotonic or temperature scaling - fitted on held-out data, not training data.",
        "Class weights and resampling distort probabilities; recalibrate after using them.",
        "Monitor calibration by segment and over time."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A 2x2 grid of ranking quality against calibration: good ranking and calibrated is trustworthy; good ranking but uncalibrated is the risky high-AUC case.",
        "xLabel": "Probabilities",
        "yLabel": "Ranking (AUC)",
        "cols": [
          "Calibrated",
          "Not calibrated"
        ],
        "rows": [
          "High AUC",
          "Low AUC"
        ],
        "cells": [
          [
            {
              "label": "Trust the scores",
              "accent": "accent"
            },
            {
              "label": "Ranks well, 0.8 is not 80%",
              "note": "the risky one",
              "accent": "warn"
            }
          ],
          [
            {
              "label": "Honest but weak",
              "accent": "muted"
            },
            {
              "label": "Poor model",
              "accent": "bad"
            }
          ]
        ],
        "caption": "**AUC measures ranking, not probability correctness.** Check a reliability curve, and recalibrate **on held-out data** when scores drive cost or risk."
      },
      "say": "Calibration is whether a predicted probability means what it says, and AUC can't tell you that. If a model scores a thousand cases around 0.8, roughly eight hundred of them should turn out positive. AUC only measures ranking, meaning whether positives usually score above negatives. So a model can rank beautifully and still be badly overconfident or too cautious, and that bites when the score drives pricing, risk, human review or a cost-based threshold. I check it with a reliability diagram, which bins the predictions and compares each bin's average score with its observed positive rate, plus Brier score or log loss. If it's off, I fit a mapping on held-out data. That's Platt scaling or isotonic regression for classical models, and temperature scaling for neural networks. Class weights and resampling deliberately distort the base rate, so I always recalibrate after using them. The rule is simple. If a number feeds a decision, check calibration by segment and over time, not just AUC once.",
      "numbers": "A prediction of 0.8 is interpretable only if outcomes near that score occur about 80% of the time over a suitable sample. Do not infer calibration from AUC alone.",
      "wrong": "Saying an AUC of 0.9 means a predicted probability of 0.9 is trustworthy. Ranking quality and probability calibration are different properties.",
      "follow": "Your ranking metric is unchanged but users say the risk score feels more aggressive. Which calibration view would you compare across releases?",
      "followAnswer": "I'd compare reliability diagrams across the two releases, ideally broken down by segment. Ranking can stay identical while the whole score distribution shifts upwards, so AUC won't move but the scores mean something different. I bin predictions, plot the average score against the observed positive rate for each bin, and overlay old and new. If the new curve sits below the diagonal, it's overconfident. I'd also compare Brier score and the score histograms, then recalibrate on held-out data if it drifted."
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
      "quick": [
        "K-means groups points around k centres.",
        "Assign points to the nearest centre, move centres, repeat.",
        "Choose k with the silhouette score, or by business need.",
        "It expects round, similar-sized groups, so scale features first.",
        "Use several restarts, since outliers and start points skew it."
      ],
      "simple": "K-means is a clustering method that groups points around k centres. You assign every point to its nearest centre, move each centre to the average of its points, and repeat until nothing moves. It always converges, but not always to a good answer, so you use k-means++ with several restarts.\n\nTo choose k, the silhouette score usually gives a clearer answer than the elbow plot, which is often ambiguous. Often the business decides. For example, if marketing can run five campaigns, you want five customer segments.\n\nThe assumptions matter most. K-means expects round, similar-sized clusters, it is sensitive to feature scale, so you standardise first, and it forces every point into a cluster, so outliers drag the centres around. For text embeddings, normalise the vectors or use HDBSCAN, which finds clusters of any shape and labels outliers as noise.",
      "points": [
        "Assign to nearest centre, move centres to the mean, repeat.",
        "Silhouette usually gives a clearer peak; the elbow is often ambiguous.",
        "Assumes spherical, similar-sized, Euclidean-separated clusters.",
        "Standardise features; use k-means++ and multiple restarts.",
        "For embeddings prefer cosine, or HDBSCAN for arbitrary shapes."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "The k-means loop: pick k starting centres with k-means++, assign each point to its nearest centre, move each centre to the mean of its points, and repeat until nothing moves.",
        "lanes": [
          {
            "label": "Pick k centres",
            "note": "k-means++, ~10 restarts",
            "accent": "warn"
          },
          {
            "label": "Assign points",
            "note": "to nearest centre"
          },
          {
            "label": "Move centres",
            "note": "to mean, then repeat"
          },
          {
            "label": "Nothing moves",
            "note": "converged",
            "accent": "accent"
          }
        ],
        "caption": "**Assign, move, repeat.** It always converges, but not always to the best answer, and it assumes **round, similar-sized, scaled clusters**."
      },
      "say": "K-means groups points around k centres by repeatedly moving each centre to the middle of its group. Every point is assigned to its nearest centre, each centre moves to the average of its points, and that repeats until nothing moves. It always converges, but not always to a good answer, so I use k-means++ with several restarts. To choose k, I lean on the silhouette score, because the elbow plot is usually ambiguous. Often the business decides anyway. If marketing can run five campaigns, you want five segments. The senior part is the assumptions. It expects round, similar-sized clusters, it's sensitive to feature scale, so I standardise first, and it forces every point into a cluster, so outliers drag the centres around. With text embeddings, I normalise the vectors so distance tracks cosine similarity, or switch to HDBSCAN, which finds clusters of any shape and labels outliers as noise. When clusters aren't round, k-means is the wrong tool.",
      "numbers": "Standardise tabular features before k-means (for embeddings, L2-normalise instead). Use k-means++ with around ten restarts - a single random initialisation regularly lands in a poor local optimum.",
      "wrong": "Describing the algorithm with no mention of assumptions. The follow-up is always about where it fails, and shape and scale are the answers.",
      "follow": "You cluster 100k document embeddings and get one huge cluster. What went wrong?",
      "followAnswer": "Usually the embeddings weren't normalised, or k-means was the wrong tool for that space. Raw embeddings vary in length, so Euclidean distance tracks magnitude rather than meaning, and many points pile around one centre. They also often share a dominant common direction. So I L2-normalise the vectors so distance follows cosine similarity, and sometimes reduce dimensions first. I check whether the big cluster is really boilerplate or near-duplicate documents. If shapes are uneven, I try HDBSCAN, which labels outliers as noise instead."
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
      "quick": [
        "PCA finds the directions where data varies most.",
        "Keep the top few, so fewer columns hold most information.",
        "Keep enough to explain about 95 percent, and scale first.",
        "Useful to shrink stored search vectors and for plots.",
        "You lose meaning per column, and it may drop useful signal."
      ],
      "simple": "PCA, principal component analysis, finds the directions along which your data varies most and re-expresses the data in those directions. It rotates the axes to line up with the shape of the data, then drops the axes where the data barely varies, so you keep most of the information in far fewer dimensions. You choose how many components to keep by explained variance, such as 95 percent.\n\nIt helps in a few places. For example, you can compress embeddings for cheaper storage and faster search, remove multicollinearity before a linear model, or plot data in 2D.\n\nThe costs are real, though. Each component mixes every original feature, so interpretability goes. It only sees linear structure, and you must standardise first. And because it is unsupervised, it can throw away a low-variance direction that happens to predict your target.",
      "points": [
        "Rotates axes onto directions of maximum variance, then truncates.",
        "Choose components by cumulative explained variance, not a round number.",
        "Standardise first - PCA is scale-sensitive.",
        "Unsupervised: it can discard a low-variance but predictive direction.",
        "For embeddings, Matryoshka truncation often beats fitting a PCA."
      ],
      "say": "PCA, principal component analysis, rotates your data onto the directions where it varies most and drops the rest. The first component captures the most variance, the next captures the most of what's left, and so on. So you keep most of the information in far fewer dimensions. I pick the number of components by cumulative explained variance, say 95 percent, rather than a round number. I standardise first, because otherwise the feature with the biggest units dominates. It's genuinely useful for compressing embeddings to make search cheaper, removing multicollinearity before a linear model, and 2D plots. The costs are real, though. Each component mixes every original feature, so interpretability goes. It only sees linear structure. And because it's unsupervised, it can throw away a low-variance direction that happens to predict the target. For embeddings, I'd check Matryoshka truncation first, since those models are trained so you can simply cut dimensions. PCA is compression, not feature selection.",
      "numbers": "95% explained variance is a common cutoff. Embeddings often keep most retrieval quality at half their dimensions - but measure recall, do not assume it.",
      "wrong": "Calling it feature selection. It is feature extraction - every component mixes all the original features, which is exactly why interpretability disappears.",
      "follow": "Does PCA help your model's accuracy?",
      "followAnswer": "Sometimes, but usually not, and I'd measure rather than assume. PCA is unsupervised, so it keeps the directions with most variance, not the ones that predict the target, and it can throw away a small but useful signal. It helps a linear model when features are highly correlated or when there are far more features than rows. Tree models like XGBoost rarely gain from it and lose interpretability. So I compare validation scores with and without it, fitting PCA inside the training fold only."
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
      "quick": [
        "First ask why the data is missing.",
        "Random gaps are safe to drop in small amounts.",
        "If gaps depend on the missing value itself, filling in is biased.",
        "Add a was-missing flag, often the strongest signal.",
        "Tree models like XGBoost can handle gaps themselves."
      ],
      "simple": "Before choosing a technique for missing data, you ask why it is missing, because the reason decides the method. If it is completely random, like a sensor dropping readings, dropping a few rows is safe, just wasteful. If the gaps depend on other columns, such as younger people skipping a survey question, you can impute from those columns. The dangerous case is when the gap depends on the missing value itself. For example, high earners often leave the income field blank, so imputing from the observed data is biased, and the blank itself carries information.\n\nThat is why you add a was-missing flag next to the imputed value, and it often carries more signal than the value would have. Mean imputation is quick but distorts correlations. And boosted trees such as XGBoost handle gaps natively, so often the best move is to impute nothing and keep the flag.",
      "points": [
        "Diagnose the mechanism first - MCAR, MAR or MNAR.",
        "MNAR is the dangerous case; imputing from observed data alone is biased.",
        "Mean imputation shrinks variance and distorts correlation.",
        "Add a was-missing indicator - often the strongest signal available.",
        "XGBoost and LightGBM handle missingness natively; use that."
      ],
      "say": "I start by asking why the data is missing, because the reason decides the method. If it's completely random, like a sensor dropping readings, dropping a few percent of rows is safe, just wasteful. If the gaps depend on other columns, say younger people skipping a survey question, I can impute from those columns. The dangerous case is when missingness depends on the missing value itself. High earners often leave the income field blank, so any imputation from the observed data is biased, and the blank itself carries information. That's why I add a was-missing flag next to the imputed value, and it's often more predictive than the value would have been. Mean imputation is quick but shrinks variance and distorts correlations. Any model-based imputation has to be fitted inside the training fold, or it leaks. For tabular work, XGBoost and LightGBM handle gaps natively, so often the best move is to impute nothing and keep the flag.",
      "numbers": "Under about 5% missing and completely at random, dropping rows is usually fine. Past roughly 50% in a column, consider dropping the column and keeping the indicator.",
      "wrong": "'Fill with the mean.' It is the reflex answer, it shrinks variance, distorts relationships, and throws away the information that the value was absent.",
      "follow": "Income is missing for 30% of rows, mostly high earners. What do you do?",
      "followAnswer": "I treat it as missing not at random, because the gap itself tells me something. Imputing from the observed incomes would pull high earners down towards the middle and bias the model. So I add an income-was-missing flag, which is probably one of the stronger signals, and either leave the gaps for XGBoost or LightGBM to handle natively or impute with a simple value alongside the flag. Anything fitted is fitted inside the training fold. Then I check whether the flag behaves the same in production."
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
      "quick": [
        "It means shaping inputs so the pattern is easier to see.",
        "For text and images it is largely over.",
        "For tables it still drives most of the accuracy.",
        "Add ratios, customer totals and time since last event.",
        "In GenAI, it is choosing what text the model sees."
      ],
      "simple": "Feature engineering means building inputs that make the pattern easier for the model to see. It adds no new information, just a better representation, and whether it still matters depends on the data type.\n\nFor text, images and audio it is largely over, because deep learning learns better representations from raw input than hand-crafted features ever did. For tabular data it still drives most of the accuracy, because a boosted model cannot invent a ratio. For example, give it revenue and headcount separately and it has to approximate revenue per employee through many splits, but give it the ratio and one split captures it. The reliable wins are ratios, customer-level aggregations, time since the last event and cyclical encodings of time. Target encoding must be computed inside the fold, or it leaks.\n\nIn GenAI the same instinct returns as choosing what goes into a chunk and what metadata it carries.",
      "points": [
        "Largely superseded for text, images and audio.",
        "Still decisive for tabular data - models cannot invent ratios.",
        "Ratios, aggregations, time-since, cyclical encodings.",
        "Target encoding must be computed inside the fold or it leaks.",
        "Chunk design and prompt structure are its GenAI equivalent."
      ],
      "say": "It depends entirely on the data type, and saying so is the point. Feature engineering means building inputs that make the pattern easier for the model to see. For text, images and audio it's largely over, because deep learning learns better representations from raw data than hand-crafted features ever did. For tabular data it still drives most of the accuracy, because a boosted model can't invent a ratio. Give it revenue and headcount separately and it has to approximate revenue per employee through many splits. Give it the ratio and one split captures it. The reliable wins are ratios, customer-level aggregations like transaction counts over thirty days, time since the last event, and sine and cosine encodings so eleven at night sits close to one in the morning. Target encoding has to be computed inside the fold, or it leaks. In GenAI the same instinct returns as choosing what goes into a chunk and what metadata it carries.",
      "numbers": "On tabular problems, good feature engineering routinely beats model choice. Moving from logistic regression to XGBoost often gains less than adding the right ten features.",
      "wrong": "'Deep learning made it obsolete.' True for unstructured data and wrong for tabular, which is most of what enterprises actually run.",
      "follow": "Give me three features you would build for a churn model.",
      "followAnswer": "I'd build a recency, a trend and a friction feature. First, days since last login or last purchase, because disengagement usually shows up before cancellation. Second, a usage trend such as the ratio of activity in the last thirty days to the previous ninety, since a falling ratio matters more than the absolute level. Third, support tickets or failed payments in the last month. Every one is computed as of the prediction date only, so nothing from after the churn event leaks in."
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
      "quick": [
        "Both norms rescale values into a steady range for stable training.",
        "Batch norm averages across examples, so it depends on batch size.",
        "Layer norm averages within one example, so language models use it.",
        "Dropout randomly switches off units in training only.",
        "Forgetting eval mode leaves dropout on, a classic bug."
      ],
      "simple": "Batch norm and layer norm both rescale activations so each layer sees inputs in a steady range, which makes training faster and more stable. The difference is what they average over. Batch norm averages each feature across the examples in a batch, so it depends on batch size and needs saved running averages at inference. Layer norm averages across the features of a single example, so it behaves the same in training and inference, which is why transformers use it.\n\nDropout is different, because it is regularisation, not normalisation. During training it randomly switches off a fraction of units, often 0.1 in transformers, so the network cannot lean on any single unit. At inference it is off.\n\nFor example, the classic bug links them. Forget to switch the model into eval mode before inference, and dropout stays on while batch norm keeps updating its statistics.",
      "points": [
        "Batch norm: normalise each feature across the batch. Great for CNNs; needs running stats at inference.",
        "Layer norm: normalise across one example's features. Batch-independent - the transformer choice.",
        "RMSNorm: layer norm without mean-centring; used in Llama-style LLMs.",
        "Dropout: randomly zero units during training only - a regulariser.",
        "Forgetting `model.eval()` leaves dropout on and batch-norm stats updating."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Batch norm versus layer norm: what each averages over, whether it depends on batch size, how it behaves at inference, and where it is used.",
        "aspects": [
          "Averages over",
          "Batch-size dependent",
          "At inference",
          "Used in"
        ],
        "columns": [
          {
            "label": "Batch norm",
            "note": "across the batch",
            "accent": "warn",
            "cells": [
              "One feature, many examples",
              "Yes, noisy below ~16",
              "Running stats from training",
              "CNNs for images"
            ]
          },
          {
            "label": "Layer norm",
            "note": "within one example",
            "accent": "accent",
            "cells": [
              "All features, one example",
              "No",
              "Same as training",
              "Transformers (RMSNorm in Llama)"
            ]
          }
        ],
        "caption": "The difference is **what they average over**. Dropout is separate: a regulariser that is **on in training only**, so never forget model.eval()."
      },
      "say": "Both norms rescale activations into a steady range so training is faster and more stable. The difference is what they average over. Batch norm averages each feature across the examples in a batch. That suits CNNs, but it depends on batch size, and at inference it needs running averages saved during training. Layer norm averages across the features of one example, so batch size and sequence length don't matter and it behaves the same in training and inference. That's why transformers use it, and many recent LLMs use RMSNorm, a cheaper variant that skips the mean. Dropout is a different thing entirely. It's a regulariser that randomly switches off a fraction of units during training only, so the network can't lean on any single unit. The classic bug ties them together. Forget model.eval() and dropout stays on while batch norm keeps updating its statistics. Large LLM pre-training often uses little dropout, but fine-tuning still benefits from it.",
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
      "quick": [
        "CNNs slide small shared filters over images to find patterns.",
        "RNNs read one word at a time with a running memory.",
        "They forget early words over long sequences.",
        "LSTMs add gates that choose what to keep or forget.",
        "Transformers link all words directly and train in parallel."
      ],
      "simple": "Before transformers, each architecture suited a kind of data. A CNN slides small shared filters across an image, each looking for a local pattern like an edge, so it spots a pattern anywhere with few weights, and stacked layers build edges into objects. An RNN reads a sequence one token at a time and carries a running memory, but gradients pass back through every step, so they vanish and it forgets early words. An LSTM adds gates that decide what to keep and forget, so information survives much longer.\n\nTransformers replaced them for language because an RNN is still sequential. For example, for n tokens an RNN needs n steps one after another, while a transformer layer handles all n positions at once and connects every token directly through attention. The price is attention cost that grows with n squared, which is why ideas like Mamba bring recurrence back for cheaper long context.",
      "points": [
        "**CNN**: shared local filters; finds a pattern anywhere; efficient on images.",
        "**RNN**: hidden state carried step by step; vanishing gradients over long sequences.",
        "**LSTM/GRU**: gates decide what to keep or forget; much longer memory.",
        "Transformers won on language: parallel training and direct token-to-token paths.",
        "Still relevant: CNNs for small-data and edge vision; state-space models (Mamba) revive recurrence for long context."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "CNN, RNN or LSTM, and transformer compared: what each is built for, how it works, its main limit, and where it is used now.",
        "aspects": [
          "Built for",
          "How",
          "Limit",
          "Today"
        ],
        "columns": [
          {
            "label": "CNN",
            "note": "shared filters",
            "cells": [
              "Grids, images",
              "Slide local filters",
              "Local view per layer",
              "Small-data, edge vision"
            ]
          },
          {
            "label": "RNN / LSTM",
            "note": "step by step",
            "accent": "warn",
            "cells": [
              "Sequences",
              "Carry hidden state; gates",
              "n sequential steps",
              "Revived in Mamba"
            ]
          },
          {
            "label": "Transformer",
            "note": "attention",
            "accent": "accent",
            "cells": [
              "Sequences, language",
              "Every token sees every token",
              "Cost grows with n squared",
              "Language default"
            ]
          }
        ],
        "caption": "Transformers replaced RNNs for language because they **train in parallel** and give **direct token-to-token paths**, paying with n-squared attention cost."
      },
      "say": "Transformers won because attention links every token directly and trains a whole sequence in parallel, which RNNs can't do. Before that, each architecture fitted a kind of data. A CNN slides small shared filters over an image, so it spots an edge anywhere with very few weights, and stacked layers build edges into objects. An RNN reads a sequence one token at a time and carries a running memory. The catch is that gradients pass back through every step, so they vanish and the network forgets early words. An LSTM adds gates that decide what to keep, forget and output, so information survives much longer. But it's still sequential. For n tokens an RNN needs n steps one after another, while a transformer layer handles all n at once, paying with attention cost that grows with n squared. Recurrence isn't dead, though. CNNs still suit small-data and on-device vision, and state-space models like Mamba bring recurrence back for cheap long context.",
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
      "quick": [
        "Load a batch and put the model in training mode.",
        "Predict, compute the loss, clear old gradients, compute new ones, update.",
        "For validation, switch to eval mode with no gradient tracking.",
        "Save the best validation checkpoint, not the last one.",
        "Seed and log settings and data version to reproduce runs."
      ],
      "simple": "A PyTorch training loop repeats the same few steps for every mini-batch. You load the batch onto the device and put the model in training mode, so dropout and batch norm behave correctly. Then you run the forward pass, compute the loss, clear the old gradients, call backward to compute new ones, and let the optimiser update the weights.\n\nValidation works differently, because you are measuring rather than learning. You switch to evaluation mode, turn off gradient tracking and record metrics without updating any weights. For example, if validation loss is lowest at epoch six and rises after that, you keep the epoch-six checkpoint, because by the final epoch the model may already be overfitting.\n\nReliability matters too, so you seed runs, log the code, configuration and data version, and clip gradients if training becomes unstable.",
      "points": [
        "Forward pass, loss, zero gradients, backward pass, optimizer step.",
        "Use train mode for training and eval mode with no gradients for validation.",
        "Choose checkpoints from held-out validation metrics.",
        "Log code/data/config so the run can be reproduced.",
        "Mixed precision, accumulation and distribution extend the same core loop."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "The core PyTorch training step: forward pass, compute loss, zero gradients, backward pass, optimiser step, repeated over the data, with validation in eval mode.",
        "lanes": [
          {
            "label": "Forward pass",
            "note": "train mode"
          },
          {
            "label": "Loss",
            "note": "predictions vs labels"
          },
          {
            "label": "Zero gradients",
            "note": "clear old ones",
            "accent": "warn"
          },
          {
            "label": "Backward",
            "note": "compute gradients"
          },
          {
            "label": "Optimiser step",
            "note": "update weights, repeat",
            "accent": "accent"
          },
          {
            "label": "Validate",
            "note": "eval mode, no gradients"
          }
        ],
        "caption": "**Forward, loss, zero, backward, step**, repeated. Validate in **eval mode with no gradients** and keep the checkpoint with the best validation score."
      },
      "say": "Every mini-batch goes through the same five steps: forward, loss, zero the gradients, backward, optimiser step. Before that, I move the batch onto the device and put the model in training mode, so dropout and batch norm behave correctly. The forward pass gives predictions, I compute the loss, clear the old gradients, call backward to get new ones, and let the optimiser update the weights. Validation is different because I'm measuring, not learning. I switch to eval mode, wrap it in no_grad, and just record metrics on held-out data. I save the checkpoint with the best validation score rather than the last epoch, since by the end it may already be overfitting. The senior details are about reliability. I seed what I can and log the config and data version so the run can be reproduced, and I clip gradients if training goes unstable. Mixed precision, accumulation and distributed training all extend this loop rather than replace it.",
      "numbers": "Do not quote a default epoch or batch count without the dataset. Track steps, examples seen, validation metric and learning-rate schedule so runs can be compared fairly.",
      "wrong": "Describing only `loss.backward()` and `optimizer.step()`. Validation mode, gradient clearing, checkpoint selection and reproducibility are part of a production training answer.",
      "follow": "Training loss keeps falling while validation loss rises. What do you change first, and how do you know it helped?",
      "followAnswer": "That's overfitting, so the first thing I change is when I stop, with early stopping on validation loss and keeping the best checkpoint. That alone often fixes it. If the gap still opens early, I add regularisation, such as more dropout or weight decay, or more data and augmentation, and I change one thing at a time. I know it helped when the best validation score improves and the gap narrows on the same held-out split, ideally confirmed across a couple of seeds."
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
      "quick": [
        "Both help when GPU memory is tight.",
        "Mixed precision uses smaller number formats to save memory and time.",
        "BF16 is easier than FP16, which needs loss scaling.",
        "Accumulation adds up small batches before one update step.",
        "Divide each loss by the step count and adjust schedules."
      ],
      "simple": "Mixed precision and gradient accumulation both help when GPU memory is tight, but they solve different problems. Mixed precision runs much of training in lower-precision number formats, which cuts memory and can speed up matrix maths. BF16 is usually easier than FP16 because it has a much wider range, while FP16 needs loss scaling so small gradients don't underflow to zero.\n\nGradient accumulation lets you act as if you had a bigger batch than fits in memory. You run several micro-batches, add up their gradients, and only then call the optimiser, dividing each loss by the number of steps. For example, a micro-batch of 8 with 4 accumulation steps on 2 GPUs behaves like a batch of 64.\n\nBut optimiser steps now happen less often, so learning-rate schedules and clipping must be defined in optimiser steps, not copied from the old loop.",
      "points": [
        "Mixed precision reduces memory and can increase accelerator throughput.",
        "BF16 and FP16 have different numeric ranges and hardware support.",
        "FP16 needs loss scaling (`torch.amp.GradScaler`) so small gradients do not underflow; BF16 usually does not.",
        "Gradient accumulation simulates a larger effective batch from smaller micro-batches.",
        "Schedulers and logging must account for fewer optimizer steps.",
        "Re-measure throughput and model quality after changing precision or batch behaviour."
      ],
      "say": "Both are ways to train when GPU memory is tight, but they fix different problems. Mixed precision runs much of training in lower-precision formats, which cuts memory and can speed up matrix maths on supported hardware. BF16 is usually easier than FP16 because it has a much wider range. FP16 needs loss scaling, through GradScaler, so small gradients don't underflow to zero. Gradient accumulation gives you a bigger effective batch than fits in memory. You run several micro-batches, add up their gradients, and only then take one optimiser step. Each micro-batch loss gets divided by the number of accumulation steps, or the summed gradient comes out that many times too large. The thing people miss is that optimiser steps now happen less often. So the learning-rate schedule, clipping and logging have to count optimiser steps, not micro-batches. Neither change is free, so I re-measure throughput, memory and validation quality afterwards.",
      "numbers": "Effective batch size is micro-batch size × accumulation steps × data-parallel workers. Use that number when comparing runs and choosing learning-rate changes.",
      "wrong": "Calling gradient accumulation the same as increasing the physical batch. It changes when optimizer and synchronisation steps happen and can change training behaviour.",
      "follow": "You double the number of data-parallel GPUs. What happens to effective batch size if you change nothing else?",
      "followAnswer": "It doubles, because effective batch size is micro-batch times accumulation steps times data-parallel workers. Each optimiser step now averages gradients over twice as many examples, and there are half as many steps per epoch. That changes the training dynamics, so the learning rate and warmup tuned for the old setup may no longer fit. I either halve the accumulation steps to keep the effective batch the same, or deliberately retune the learning rate, and compare runs by examples seen rather than steps."
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
      "quick": [
        "Data parallel copies the whole model to each GPU.",
        "Tensor parallel splits big layers across closely linked GPUs.",
        "Pipeline parallel puts groups of layers on different GPUs.",
        "FSDP splits weights and training state, saving memory per GPU.",
        "Choose by what does not fit and network speed."
      ],
      "simple": "These are all ways of spreading training across many GPUs, but each one splits a different thing. Data parallelism gives every GPU a full copy of the model and different examples, then combines the gradients. It is simple, but every GPU must fit the whole model.\n\nTensor parallelism splits individual large layers across GPUs, which needs very frequent communication, so it usually stays inside one node. Pipeline parallelism puts groups of layers on different GPUs like an assembly line, but GPUs sit idle while waiting. FSDP shards the parameters, gradients and optimiser state across workers and gathers them only when needed, so you keep the data-parallel style with far less memory per GPU.\n\nLarge jobs usually combine them. For example, a big model might use tensor parallelism inside each node, pipeline stages across nodes and data parallelism on top.",
      "points": [
        "Data parallel: full model copy, different data, synchronised gradients.",
        "Tensor parallel: split large layer computations across devices; needs fast links, so it usually stays inside one node.",
        "Pipeline parallel: split layers into stages across devices; idle \"bubbles\" are the cost.",
        "FSDP: shard parameters, gradients and optimizer state while keeping a data-parallel style - the same idea as DeepSpeed ZeRO stage 3.",
        "MoE models add expert parallelism; very long context adds sequence or context parallelism.",
        "Choose from memory bottleneck, communication cost and operational complexity."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Data parallel with FSDP, tensor parallel and pipeline parallel compared by what is split, what each GPU holds, and the main cost.",
        "aspects": [
          "Splits",
          "Each GPU holds",
          "Main cost"
        ],
        "columns": [
          {
            "label": "Data parallel / FSDP",
            "note": "split the data",
            "accent": "accent",
            "cells": [
              "Examples across workers",
              "Full copy; FSDP shards it",
              "Gradient sync"
            ]
          },
          {
            "label": "Tensor parallel",
            "note": "split a layer",
            "cells": [
              "Matrix ops within layers",
              "Slice of each layer",
              "Fast links, one node"
            ]
          },
          {
            "label": "Pipeline parallel",
            "note": "split the layers",
            "cells": [
              "Layer groups into stages",
              "Some whole layers",
              "Idle bubbles"
            ]
          }
        ],
        "caption": "Each splits the problem differently; big jobs combine them. **Communication can bottleneck before compute**, so measure scaling as GPUs increase."
      },
      "say": "They all spread training across GPUs, but each one splits a different thing. Data parallel gives every GPU a full copy of the model and different examples, then syncs the gradients. It's simple, but every GPU has to hold the whole model and its training state. Tensor parallel splits individual big layers across GPUs. That needs very fast links, so it usually stays inside one node. Pipeline parallel puts groups of layers on different GPUs and streams micro-batches through them like stages, which saves memory but leaves idle bubbles. FSDP, fully sharded data parallel, shards weights, gradients and optimiser state across GPUs and gathers pieces only when needed. You keep the simple data-parallel style with far less memory per GPU, and it's the same idea as DeepSpeed ZeRO stage 3. Big jobs usually combine several. I choose by what doesn't fit, how fast the network is, and what the team can actually operate.",
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
      "quick": [
        "Correlation means moving together, causation means one drives the other.",
        "Support contact predicts churn, but an existing problem causes both.",
        "Cutting support would remove the one thing helping.",
        "A good predictor can be a useless lever.",
        "Only a randomised experiment proves cause."
      ],
      "simple": "Correlation means two things move together, while causation means changing one actually changes the other. Models learn correlation, but stakeholders tend to hear causation, and that gap is where expensive decisions go wrong.\n\nFor example, a churn model finds that customers who contact support are far more likely to churn. The tempting move is to reduce support contact, but that is backwards. Customers contact support because they already have a problem, and the problem drives both the contact and the churn. Cut support and churn gets worse. Support contact is still a good predictor, but it is useless as a lever.\n\nTo prove causation you need an experiment, where you randomise who gets the change. So before anyone acts on a feature importance chart, ask whether we are predicting or intervening.",
      "points": [
        "Models learn association; stakeholders hear causation.",
        "Confounders, reverse causality and selection all produce it.",
        "A useful predictor can be a useless lever.",
        "Only randomised experiments establish causation cleanly.",
        "Ask whether the decision is prediction or intervention."
      ],
      "diagram": {
        "alt": "A confounder: a customer's existing problem causes both support contact and churn, so support contact correlates with churn without causing it.",
        "rows": [
          [
            {
              "id": "prob",
              "label": "Existing problem",
              "note": "the real cause",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "sup",
              "label": "Contacts support",
              "note": "a symptom, good predictor"
            },
            {
              "id": "churn",
              "label": "Churns"
            }
          ]
        ],
        "edges": [
          {
            "from": "prob",
            "to": "sup",
            "label": "causes"
          },
          {
            "from": "prob",
            "to": "churn",
            "label": "causes"
          }
        ],
        "caption": "Support contact **predicts** churn but does not **cause** it, so cutting it makes churn worse. Ask **are we predicting or intervening?**"
      },
      "say": "Correlation means two things move together. Causation means changing one actually changes the other. Models learn the first, and stakeholders tend to hear the second. Take a churn model that finds customers who contact support are far more likely to leave. The tempting conclusion is to reduce support contact, and that's backwards. People contact support because they already have a problem, and the problem drives both the contact and the churn. Support is a symptom, so cutting it removes the one channel that was helping. That makes it a good predictor but a useless lever. This pattern usually comes from a confounder like that one, from reverse causality, or from the way the data was collected. So before anyone acts on a feature importance chart, I ask whether we're predicting or intervening. Only a randomised experiment cleanly answers the intervening question, with methods like difference-in-differences as a weaker fallback.",
      "numbers": "Feature importance measures predictive contribution, not causal effect. Presenting it as a to-do list of interventions is a common and costly mistake.",
      "wrong": "Reaching for ice cream and drowning. It shows you know the concept and not that you can apply it - use an example from work.",
      "follow": "The business wants to act on your top feature. How do you respond?",
      "followAnswer": "I'd first ask whether they want to predict or to intervene, because the top feature only tells us what predicts the outcome. If it's something like support contact, pushing it down could make things worse, since it's a symptom rather than a cause. So I explain that feature importance isn't a to-do list and propose a proper test. We randomise the intervention on a slice of customers, measure the outcome against a control group, and only roll out if the effect is real."
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
      "quick": [
        "It asks how surprising the data is if nothing changed.",
        "It is not the chance that the change works.",
        "It says nothing about how big the effect is.",
        "Peeking early or testing many metrics creates false winners.",
        "Fix the sample size and lead with the effect range."
      ],
      "simple": "A p-value answers one question: if the change truly did nothing, how surprising would this data be? Formally, it is the chance of a result at least this extreme, assuming there is no real effect. A small p-value just means the data would be surprising under that assumption.\n\nSo it is not the probability that the null is true, and it is not a measure of effect size. For example, with a million users, a 0.01 percent lift can be highly significant and commercially worthless. A p-value above 0.05 doesn't prove there is no effect either, because the test may simply have been too small.\n\nA common trap is peeking, stopping the moment p dips below 0.05, which inflates false positives. The better habit is to lead with the effect size and its confidence interval.",
      "points": [
        "P(data this extreme | null is true) - the conditional is the point.",
        "Not the probability the null is true, and not a fluke probability.",
        "Significance is not effect size; large n makes trivia significant.",
        "Peeking inflates false positives - fix n in advance.",
        "Lead with the confidence interval, not the p-value."
      ],
      "say": "A p-value tells you how surprising your data would be if the change truly did nothing. Formally, it's the probability of a result at least as extreme as yours, assuming the null hypothesis of no effect is true. That assumption is the whole concept. So it isn't the probability that the change works, and it isn't the chance the result was a fluke. It also says nothing about size. With a million users, a 0.01 percent lift can be highly significant and commercially worthless. A p-value above 0.05 doesn't prove there's no effect either, because the test was often just too small. The practical traps are peeking and multiple metrics. Stopping the moment p dips below 0.05 inflates false positives, and twenty metrics at 0.05 give about one false winner by chance. So I fix the sample size in advance and lead with the effect size and its confidence interval, which gives direction and precision.",
      "numbers": "Fix the sample size before starting. Testing twenty metrics at 0.05 yields roughly one false positive by chance - correct for it or expect to chase noise.",
      "wrong": "'It is the probability the result happened by chance.' It is the near-universal phrasing and it is the definition inverted.",
      "follow": "Your test hits p = 0.04 on day three. Do you ship?",
      "followAnswer": "No, not on day three. If we planned to run for two weeks, stopping early because p dipped below 0.05 is peeking, and it inflates the false positive rate well past five percent. Three days also misses the weekly cycle, and novelty effects can fade. So I let it run to the planned sample size and duration, then look at the effect size and confidence interval. If we genuinely need early decisions, I'd design a sequential test from the start."
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
      "quick": [
        "Decide first what action depends on the result.",
        "Pick one main metric before launch.",
        "Work out users needed first, halving the lift quadruples it.",
        "Run at least a full week and stop at the planned size.",
        "Watch guardrail metrics like cost, and check the split is fair."
      ],
      "simple": "An A/B test compares the current version with a new one on real users, and the design must be fixed before launch. You start with the decision the result will change, then pick one primary metric up front, because choosing the best of many metrics afterwards invites a false winner.\n\nNext you work out the sample size from the baseline rate, the smallest lift worth detecting and power, usually 80 percent. Halving the lift you want to detect quadruples the users you need. You run for at least a full week, since weekday and weekend users differ, and stop at the planned sample size.\n\nYou also set guardrail metrics that must not get worse, such as latency, errors and cost. For example, a GenAI feature that lifts engagement while doubling cost is not a win.",
      "points": [
        "Decide the action first; fix one primary metric in advance.",
        "Halving the detectable effect quadruples the required sample.",
        "Cover a full weekly cycle - two weeks is a sane default.",
        "Guardrails: latency, error rate, cost, support volume.",
        "Check A/A and sample ratio mismatch before trusting anything."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A/B test steps: decide the action and one primary metric, compute sample size, run at least two weeks, check A/A and sample ratio mismatch, then read the result with guardrails.",
        "lanes": [
          {
            "label": "Decide action",
            "note": "one primary metric"
          },
          {
            "label": "Sample size",
            "note": "80% power, 5% level"
          },
          {
            "label": "Run 2+ weeks",
            "note": "no peeking",
            "accent": "warn"
          },
          {
            "label": "Check validity",
            "note": "A/A, sample ratio"
          },
          {
            "label": "Read result",
            "note": "plus guardrails",
            "accent": "accent"
          }
        ],
        "caption": "**Fix everything before launch.** Halving the detectable effect **quadruples the sample**, and a 52/48 split on a 50/50 plan means assignment is broken."
      },
      "say": "I start with the decision, because if nothing changes whichever way it lands, the test isn't worth running. Then I fix one primary metric before launch. Picking the best of ten afterwards gives about a 40 percent chance of a false winner. Sample size comes from the baseline rate, the smallest lift worth detecting and 80 percent power. The fact people forget is that halving that lift quadruples the users you need. I run at least a full week, often two, because weekday and weekend users behave differently, and I stop at the planned size, not when it looks good. Guardrails are metrics I'm not trying to move but mustn't damage, like latency, error rate, cost and complaints. A GenAI feature that lifts engagement but doubles cost isn't a win. Finally I check validity. Randomise by user, run an A/A test, and watch for sample ratio mismatch. A 50/50 split arriving as 52/48 on a big sample means assignment is broken.",
      "numbers": "80% power at 5% significance is standard. Two weeks minimum duration. On 10,000 users, a 50/50 split arriving at 52/48 gives a chi-square p-value near 0.0001 - broken assignment - investigate before reading the result.",
      "wrong": "Running until the result looks good. It is peeking with extra steps, and it produces a stream of exciting findings that never replicate.",
      "follow": "The primary metric is flat but a secondary one is up 8%. What do you conclude?",
      "followAnswer": "I conclude the test didn't show a win on what we agreed mattered, so I wouldn't ship on the secondary metric alone. If we tracked several secondary metrics, one rising eight percent could easily be chance, since the more metrics we test, the more false winners we get. I'd check whether it's plausible, correct for multiple comparisons, and look at guardrails. If it still looks real, I treat it as a hypothesis and run a fresh test with it as the primary metric."
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
      "quick": [
        "Separate what drives the model overall from this one decision.",
        "Overall importance helps people decide whether to trust it.",
        "For one decision, show each factor's share of the result.",
        "Translate into plain words and say what would change it.",
        "It explains the model, not the real world."
      ],
      "simple": "Explaining a model's decision starts by separating two questions. The global question is what drives the model overall, which feature importance answers and which a stakeholder needs before trusting it. The local question is why this particular decision happened, which a customer or regulator asks, and SHAP values are the usual tool because they give each feature's contribution to one outcome.\n\nThen you translate, because a SHAP value of 0.34 for tenure means nothing to anyone. For example, saying a loan was declined mainly because the account is four months old and three payments were late is an explanation, and adding that a twelve-month-old account would likely change the decision makes it actionable.\n\nThese methods explain what the model did, not what is true in the world, so a feature can look important without being a real cause.",
      "points": [
        "Global explanation - feature importance. For trusting the system.",
        "Local explanation - SHAP per prediction. For explaining one decision.",
        "Translate into plain, actionable language. A SHAP value is not an explanation.",
        "Include what would change the outcome. That is what people want.",
        "These explain the model, not the world. Correlated features look important.",
        "In regulated settings, prefer an inherently interpretable model where accuracy allows."
      ],
      "say": "I separate two questions, because they need different tools. The global one is what drives the model overall. Feature importance answers it, and it's what a stakeholder needs to decide whether to trust the system. The local one is why this particular decision happened. That's what a customer or regulator asks, and SHAP answers it by giving each feature's contribution to that one prediction. Then I translate, because a raw SHAP value means nothing to anyone. Saying the application was declined mainly because the account is four months old and three payments were late is an explanation. Adding that at twelve months the decision would likely change makes it actionable, which is what people really want. The honest caveat is that these methods explain what the model did, not what's true in the world, and correlated features can look important. So in regulated settings, I'd pick an inherently interpretable model whenever the accuracy cost is small.",
      "numbers": "No number applies. If the setting is regulated, consider whether an interpretable model at slightly lower accuracy is the better trade.",
      "wrong": "\"I show them the SHAP plot.\" Handing over a technical artefact is not explaining. The translation is the deliverable.",
      "follow": "The model declined a loan and the customer asks why. What exactly do you send them?",
      "followAnswer": "I send the main reasons in plain language, plus what would change the outcome. For example, the application was declined mainly because the account is four months old and there were three late payments in the last year. At twelve months with no late payments, the decision would likely be different. I take the top contributing factors from SHAP, translate them, and have compliance check the wording. I never send raw scores or feature names, and I tell them how to request a human review."
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
      "quick": [
        "SHAP splits one prediction into each feature's push up or down.",
        "The average plus all the pieces equals the prediction exactly.",
        "A beeswarm plot shows overall patterns, a waterfall one case.",
        "Tree models often report odds on a log scale, so convert.",
        "It explains the model, not what is true."
      ],
      "simple": "SHAP splits one prediction into how much each feature pushed it up or down, and the pieces add up exactly. It comes from Shapley values in game theory, which share a team's payoff fairly among players. Here the players are features, and the payoff is the gap between this prediction and the average one.\n\nFor example, the average default risk might be 8 percent while this applicant is at 31 percent, and SHAP shows plus 15 points from debt-to-income, plus 9 from recent credit enquiries and minus 1 from account age. A credit officer can act on that.\n\nA beeswarm plot shows every row, with position giving the SHAP value and colour showing whether the feature was high or low, while a waterfall explains one prediction step by step. But SHAP explains the model, not reality, so a spurious pattern still gets a confident explanation.",
      "points": [
        "Shapley values: fairly attribute one prediction across features.",
        "Additive: base value plus SHAP values equals the prediction exactly.",
        "Boosted-tree classifiers usually report SHAP in log-odds - convert before quoting probabilities.",
        "Beeswarm for global, waterfall for one prediction, dependence for shape.",
        "Mean |SHAP| is more reliable than a tree's built-in feature importance.",
        "Explains the model, not reality - spurious learning explains confidently."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "A SHAP waterfall for one applicant: base default risk of 8%, plus 15 points from debt-to-income, plus 9 from credit enquiries, minus 1 from account age, giving 31%.",
        "top": "base value: average risk 8%",
        "bottom": "prediction: 31%",
        "layers": [
          {
            "label": "Debt-to-income",
            "note": "+15 points",
            "accent": "bad"
          },
          {
            "label": "Recent credit enquiries",
            "note": "+9 points",
            "accent": "warn"
          },
          {
            "label": "Account age",
            "note": "-1 point",
            "accent": "accent"
          }
        ],
        "caption": "SHAP is **additive**: base value plus every feature's push **equals the prediction exactly**. It explains the model, not the world."
      },
      "say": "SHAP splits one prediction into how much each feature pushed it up or down, and the pieces add up exactly. It comes from Shapley values in game theory, which share out a team's payoff fairly among the players. Here the players are features, and the payoff is the gap between this prediction and the average one. That additivity is what makes it usable. Say the average default risk is 8 percent and this applicant sits at 31. SHAP might show debt-to-income adding 15 points, recent credit enquiries adding 9, and account age taking off 1. A credit officer can act on that. For the plots, a beeswarm shows global patterns, with colour showing direction, and a waterfall walks through one case. The trap is that boosted-tree classifiers usually report SHAP in log-odds, so I explain the probability output before quoting percentage points. And SHAP explains the model, not reality, so a spurious pattern still gets a confident explanation.",
      "numbers": "TreeSHAP is exact and fast for tree models. KernelSHAP is model-agnostic and slow - sample rather than running it over a full dataset.",
      "wrong": "Presenting SHAP values as causal effects. They describe the model's behaviour; a spurious correlation produces a confident and misleading explanation.",
      "follow": "SHAP shows postcode as the top feature in a lending model. What now?",
      "followAnswer": "I treat it as a fairness and compliance problem before anything else. Postcode can act as a proxy for protected characteristics like ethnicity, so a lending model leaning on it may be discriminating indirectly, even if it's predictive. I check whether it correlates with protected groups and compare approval rates across those groups. Then I talk to compliance. Usually I remove it or replace it with legitimate direct features, retrain, and confirm that no other feature is quietly carrying the same proxy signal."
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
      "quick": [
        "Labels arrive late, so you cannot watch accuracy live.",
        "Watch input drift and data quality, like new blanks.",
        "Watch prediction drift, the cheapest early warning.",
        "Fill in accuracy later as the real outcomes arrive.",
        "Only labels reveal when the right answer itself changed."
      ],
      "simple": "Spotting a degraded model in production is hard because labels usually arrive late or never. For example, if you predict churn today, you only learn whether you were right in ninety days, so you can't watch accuracy in real time.\n\nSo you monitor what you can see straight away. Input drift shows the incoming features have shifted from the training data. Prediction drift shows the model's own outputs are moving, and since it needs no labels and is cheap to compute, it is the first monitor to build. Data quality checks catch nulls, unseen categories or upstream unit changes.\n\nWhen labels do arrive, you measure accuracy and backfill it to the right period. That matters because drift detection only catches changed inputs, while only labels reveal concept drift, where the link between inputs and outcome has changed.",
      "points": [
        "Labels arrive late or never - you cannot watch accuracy live.",
        "Monitor input drift, prediction drift, data quality, segment volumes.",
        "Prediction drift is the cheapest strong early signal.",
        "Backfill accuracy onto the right period as labels arrive.",
        "Data drift = inputs changed. Concept drift = the relationship changed.",
        "Only labels reveal concept drift. Build the delayed-label pipeline."
      ],
      "say": "You usually can't watch accuracy live, because labels arrive late or never. If I predict churn today, I only learn whether I was right in ninety days. So I monitor what I can see straight away. Input drift tells me the incoming features have moved away from the training distribution. Data quality checks catch new nulls, unseen categories or a unit change upstream. Prediction drift, the model's own output mix shifting, is the cheapest strong early signal, because it needs no labels at all, so it's the first monitor I build. I also track segment volumes, since a change in who is being scored changes what the averages mean. Then, as labels arrive, I backfill accuracy onto the period it belongs to. The distinction that matters is that drift checks catch changed inputs, but only labels reveal concept drift, where the relationship itself changed. So a delayed-label pipeline isn't optional.",
      "numbers": "Prediction drift is computable on every request at no label cost. It is the first monitor to build, before any accuracy pipeline.",
      "wrong": "\"We monitor accuracy in production.\" Only if labels arrive quickly. If they do not, the follow-up about delayed labels exposes a gap: you need drift and prediction monitoring in the meantime.",
      "follow": "Inputs look stable and accuracy fell. What is that?",
      "followAnswer": "That's most likely concept drift, where the inputs look the same but their relationship to the outcome has changed. Fraudsters adapting is the classic example. Before I conclude that, I rule out a change in how labels are recorded, and train-serve skew hiding behind stable-looking averages, by checking segments and logged inference features. If those are clean, I retrain on recent labelled data. If the recent model recovers the accuracy, that confirms the concept moved, and I shorten the retraining cycle."
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
      "quick": [
        "Train-serve skew means live inputs differ from training inputs.",
        "Training used two-letter country codes, live data sent full names.",
        "The feature became constant, but nothing errored.",
        "Share the same data preparation code for training and serving.",
        "Log live inputs and compare them with training."
      ],
      "simple": "Train-serve skew is when the features a model gets in production differ from the ones it saw in training. Offline metrics look fine, real performance is worse, and nothing is obviously broken.\n\nFor example, training data came from the warehouse, where country was a clean two-letter code, but the serving path read an API that returned full country names. The encoder mapped every unrecognised value to one unknown bucket, so a feature the model relied on was effectively constant. Accuracy dropped several points while every dashboard stayed green, because the pipeline wasn't erroring.\n\nThe usual causes are different code paths or data sources for the same feature. So you share the transformation code between training and serving, version the fitted preprocessor with the model, and log the actual feature vector at inference so you can compare it against training.",
      "points": [
        "Serving features differ from training features; offline metrics stay clean.",
        "Causes: separate code paths, different sources, unversioned encoders.",
        "It fails silently - the pipeline succeeds with degraded input.",
        "Share transformation code; version the preprocessor with the model.",
        "Log inference features and compare distributions to training."
      ],
      "say": "Train-serve skew is when production features differ from training features, so offline metrics look fine while real performance quietly drops. Here's a classic way it happens. Training data comes from the warehouse, where country is a clean two-letter code. The serving path reads an API that returns full country names, and an empty string on timeout. The encoder maps all of those to unknown, so a feature the model relied on is now constant. Accuracy drops several points and every dashboard stays green, because nothing errored. The pipeline was succeeding with degraded input. The usual causes are separate code paths for the same feature, different data sources, and encoders that aren't versioned with the model. So I share the transformation code between training and serving, version the fitted preprocessor with the model, and log the actual inference features to compare with training. That last habit turns a two-week investigation into a two-hour one.",
      "numbers": "It typically costs several accuracy points and goes unnoticed for weeks. Comparing logged inference feature distributions against training is the fastest detection there is.",
      "wrong": "Defining it without an example. Every candidate can define it; having actually debugged one is what the question is really asking.",
      "follow": "How would you detect this within a day rather than a month?",
      "followAnswer": "I log the actual features the model receives at inference and compare them daily with the training distribution. Per-feature checks like PSI or a KS test, plus null rates and the share of unknown categories, would have flagged a country feature suddenly collapsing to unknown within hours. I'd also replay a sample of recent requests through the training pipeline and diff the two feature vectors directly. Alerting on prediction drift adds a cheap backstop, because the model's output mix shifts when a key feature breaks."
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
      "quick": [
        "Yes, mainly because of cost and accuracy.",
        "For labelled table data, boosted trees are cheaper and better.",
        "They also give a score you can set a cut-off on.",
        "LLMs win on messy language, no labels, or written output.",
        "The LLM extracts fields, then a classic model scores them."
      ],
      "simple": "Classical ML still matters when building with LLMs, because of cost and precision. For a well-defined task with labelled data, such as fraud scoring, churn or demand forecasting, a gradient-boosted model is faster, far cheaper, deterministic and usually more accurate than any prompt. It also gives a probability score you can calibrate and threshold, which an LLM's text output doesn't reliably provide.\n\nLLMs win where the input is unstructured language, there are no labels, the task changes often, or the output must be prose. The best systems often combine the two. For example, in an insurance claims flow, an LLM extracts structured fields from a messy document and a classical model scores them.\n\nA common mistake is using an LLM for a binary classification that logistic regression would handle as well, at a fraction of the cost.",
      "points": [
        "Labelled tabular task → gradient boosting. Cheaper, faster, deterministic, calibrated.",
        "LLMs win on unstructured language, no labels, fast-changing tasks, prose output.",
        "Classical models give probability scores you can calibrate. LLM outputs do not reliably.",
        "Best pattern: LLM extracts structure, classical model scores it.",
        "Using an LLM for a task logistic regression solves is usually a cost mistake."
      ],
      "say": "Yes, and the reason is cost and precision, not nostalgia. For a well-defined task with labelled tabular data, like fraud scoring or churn, a gradient-boosted model is faster, far cheaper, deterministic and usually more accurate than a prompt. It also gives a probability I can calibrate and threshold, which an LLM's text output doesn't reliably provide. LLMs win where the input is messy language, where there are no labels, where the task changes weekly, or where the output has to be prose. The pattern that shows judgement combines them. Take an insurance claims flow. An LLM pulls structured fields out of a messy claims document, and a classical model scores those fields. You get the LLM's flexibility on the input and the classical model's precision and cost profile on the decision. The common mistake is using an LLM for a binary classification that logistic regression would handle as well at a fraction of the cost.",
      "numbers": "A gradient-boosted model serves predictions in single-digit milliseconds at effectively zero marginal cost. Compare that against a per-token bill before choosing an LLM for a scoring task.",
      "wrong": "\"LLMs can do everything now.\" The follow-up on cost per prediction, latency and calibration will expose it, because for labelled tabular tasks a simple model often wins on all three.",
      "follow": "Give me a task in our business where you would refuse to use an LLM.",
      "followAnswer": "I'd refuse to use an LLM for real-time fraud scoring on transactions. It's a labelled tabular problem, so a gradient-boosted model is more accurate, answers in milliseconds, costs almost nothing per call and gives a calibrated probability I can threshold against the cost of a miss. It's also deterministic and explainable with SHAP, which regulators expect. An LLM would add latency, a per-token bill and outputs I can't reliably calibrate. I might still use one to extract fields from free-text notes."
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
      "quick": [
        "Pick metrics that match what users see and do.",
        "Check the right items appear in the top few results.",
        "Reward putting the best result nearest the top.",
        "Clicks are plentiful but biased by position.",
        "Confirm big changes with live tests on real users."
      ],
      "simple": "To evaluate search or ranking, you pick metrics that match what the user actually sees. Recall at K asks what fraction of relevant items made the top K, which matters for a candidate generator because a missed item never comes back. MRR looks at the rank of the first relevant result, and NDCG gives more credit when highly relevant items sit near the top. K should match a real product cutoff.\n\nThe labels matter as much as the formula. Human judgements are clean but expensive, while clicks are plentiful but biased. For example, if the old ranker always put certain products first, they collect more clicks simply because users saw them, so click labels flatter the incumbent.\n\nOffline metrics catch regressions, but they aren't the product outcome, so important changes still need an online test on task success or conversions.",
      "points": [
        "Recall@K for not missing relevant candidates.",
        "Precision@K for relevance of the visible set.",
        "MRR when the first good result matters most.",
        "NDCG for graded relevance and position-sensitive ranking.",
        "Online behaviour is needed because click labels and offline judgments are imperfect."
      ],
      "say": "I pick metrics that match what the user actually sees and does, then confirm big changes online. Recall at K asks whether the relevant items made it into the top K. That matters most for candidate generation, because an item lost there never comes back. Precision at K asks how clean the visible set is. MRR looks at the rank of the first good result, which fits tasks where one answer is enough. NDCG gives more credit for putting the most relevant items near the top, and it handles graded relevance. The labels matter as much as the formula. Clicks are plentiful, but they're biased by position and by what the old ranker chose to show, so they flatter the incumbent. Human judgements are cleaner but expensive. I slice results by query type and user segment rather than trusting one average. Offline metrics catch regressions, but task success, reformulation rate and latency guardrails in a live test make the call.",
      "numbers": "Use K equal to meaningful product cutoffs: the retrieved set passed to a reranker or the number of results a user can reasonably inspect. A metric at an irrelevant K can be misleading.",
      "wrong": "Reporting one average NDCG and stopping. Ranking quality should be sliced by query/user type and checked against real online behaviour.",
      "follow": "Why can click-through be a bad relevance label, and how would you reduce position bias?",
      "followAnswer": "Clicks reflect what users saw and where, not only what's relevant. Items at the top get clicked more just for being there, and items the old ranker never showed get no clicks at all, so training on clicks teaches the model to copy the incumbent. To reduce position bias, I estimate how click probability falls with position, from a small randomised slice or result swapping, and weight clicks by the inverse of that. I also add some exploration and check against human relevance judgements."
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
      "quick": [
        "One central place defines features for training and serving.",
        "It stops training and live values quietly growing apart.",
        "It uses each value as it was at event time.",
        "Worth it for many teams or real-time predictions.",
        "For one team doing batch, a shared library is enough."
      ],
      "simple": "A feature store is a central place where features are defined once, then stored and served to both training and inference. It exists to prevent train-serve skew. For example, training computes a customer's 30-day average transaction in a Spark job, while serving recomputes it in Python from a different table. The two drift apart and accuracy quietly degrades. A feature store makes one definition the only definition.\n\nIt also handles point-in-time correctness, so each training row uses the feature value as it was at the moment of the event, not today's value. Doing that by hand with joins is where label leakage creeps in.\n\nYou need one when several teams reuse features or you serve real-time predictions. But for one team running batch predictions, a shared, tested feature library gives most of the benefit for far less cost.",
      "points": [
        "Solves train-serve skew by making one definition authoritative.",
        "Handles point-in-time correctness, which prevents subtle leakage.",
        "Serves the same features offline for training and online for inference.",
        "Justified by multi-team reuse or real-time serving.",
        "For one team doing batch, a shared library is usually enough."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "A feature store's two sides, both computed from one feature definition: the offline store for point-in-time training data and the online key-value store for millisecond inference.",
        "aspects": [
          "Feeds",
          "Guarantees",
          "Storage"
        ],
        "columns": [
          {
            "label": "Offline store",
            "note": "same definition",
            "accent": "accent",
            "cells": [
              "Training data",
              "Point-in-time values, no leakage",
              "Warehouse-scale history"
            ]
          },
          {
            "label": "Online store",
            "note": "same definition",
            "accent": "accent",
            "cells": [
              "Live inference",
              "Same features as training",
              "Key-value, single-digit ms"
            ]
          }
        ],
        "caption": "**One definition serves both training and inference**, so there is no train-serve skew. For one team doing batch, **a shared library is usually enough**."
      },
      "say": "A feature store defines each feature once and serves it to both training and inference, and most teams don't need one. The problem it solves is train-serve skew. Picture a thirty-day average transaction computed in Spark for training and recomputed in Python for serving. The two definitions drift apart, and accuracy drops with nothing in monitoring to explain it. The harder problem it handles is point-in-time correctness. Each training row has to use the feature value as it was at the moment of the event, not today's value, and hand-written joins are where subtle leakage creeps in. So it earns its place when several teams reuse the same features, when you serve real-time predictions under strict latency, or when point-in-time joins have already burned you. Otherwise it's heavy infrastructure to run. For one team doing batch predictions, a shared, tested feature library gives most of the benefit at a fraction of the cost.",
      "numbers": "Online serving typically needs feature retrieval in single-digit milliseconds, which is why the online store is a key-value store rather than a warehouse.",
      "wrong": "Recommending one for every project. It is heavy infrastructure, and for a single batch model the follow-up on operating cost will show a shared feature library would have done the job.",
      "follow": "How would you get point-in-time correctness without a feature store?",
      "followAnswer": "I'd build point-in-time joins myself. Every feature is stored as a history with the timestamp it became valid, rather than overwritten in place. When I build a training set, each row joins to the latest feature value at or before its event time, never after it. In SQL that's an as-of join, or a range join on validity windows. I also account for pipeline lag, so a value computed at midnight only counts from when it actually landed, and I test the join against known cases."
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
      "quick": [
        "First cut the huge catalogue to a few hundred likely items.",
        "Then a richer model ranks that small set.",
        "Apply business rules like variety, stock and freshness.",
        "Clicks are biased by what was shown, so explore a little.",
        "Plan for new users and items, and test live."
      ],
      "simple": "I would build a recommendation system in two stages, because running a rich model over the whole catalogue on every request is too slow. First, candidate generation quickly cuts a huge catalogue to a few hundred plausible items using signals such as recent behaviour, popularity or embeddings. It is tuned for recall, so the good item isn't lost early. Then a ranker scores that smaller set with richer user, item and context features.\n\nThe hard part is the training labels, because clicks are biased by what was shown. For example, if the system always shows bestsellers at the top, they collect the most clicks, and a model trained naively on them just repeats its past choices. So you add some exploration or debiasing, and a cold-start path for new users and items.\n\nOffline metrics narrow the options, but an online experiment makes the final call.",
      "points": [
        "Candidate generation optimises recall over a huge catalog.",
        "Ranking uses richer features on a much smaller candidate set.",
        "Account for exposure/position bias in click labels.",
        "Design a cold-start path for new users and items.",
        "Validate with online experiments, not offline ranking metrics alone."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "A recommendation funnel: a huge catalog is cut to a few hundred candidates for recall, ranked with richer features, adjusted for business rules, then validated online.",
        "top": "huge catalog",
        "bottom": "results shown to user",
        "layers": [
          {
            "label": "Candidate generation",
            "note": "few hundred, optimise recall",
            "accent": "accent"
          },
          {
            "label": "Ranking",
            "note": "rich user, item features"
          },
          {
            "label": "Business rules",
            "note": "diversity, freshness, safety"
          },
          {
            "label": "Online experiment",
            "note": "clicks are position-biased",
            "accent": "warn"
          }
        ],
        "caption": "Split it into **recall first, precision second**: a cheap wide net, then a rich ranker on a small set. **Validate online**, not on offline metrics alone."
      },
      "say": "I'd build it in two stages, because running a rich model over the whole catalogue on every request is too slow. Candidate generation comes first. It cuts millions of items down to a few hundred plausible ones using recent behaviour, popularity, rules or embeddings, and it's tuned for recall so the good item isn't lost early. Then a ranker scores that small set with richer user, item and context features, often a boosted model or a neural ranker. Business rules like diversity, inventory and freshness get applied on top. The hard part is the labels. Clicks are biased by what was shown and where, so the model learns to repeat its own past choices unless I add some exploration or debiasing. New users and items need a cold-start path through content features or popularity. Offline metrics at the positions users actually see narrow the options, but an online experiment with latency and diversity guardrails makes the final call.",
      "numbers": "Candidate and displayed-set sizes depend on latency and catalog scale. Report metrics at the actual product cutoffs, such as Recall@K or NDCG@K, rather than a convenient arbitrary K.",
      "wrong": "Training one classifier over every item in the catalog and calling that the recommender. Large systems usually need a fast retrieval stage before expensive ranking.",
      "follow": "Offline NDCG improved but click-through fell in the experiment. What biases or product effects would you investigate?",
      "followAnswer": "I'd look first at whether the offline labels and the live objective disagree. Offline NDCG was measured on logged clicks, which are biased towards what the old ranker showed, so the new model may be better at matching past behaviour but not at finding what users want now. I'd check position bias, reduced diversity or novelty, cold-start items dropping out, latency increases, and presentation changes. I'd also slice by segment, since a gain for heavy users can hide losses for new ones."
    }
  ]
};
