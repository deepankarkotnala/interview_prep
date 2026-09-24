/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["01-llm-foundations"] = {
  "lede": "These are the questions that open a technical round. They look basic, which is exactly why they are dangerous - a vague answer here sets the tone for the next forty minutes. The bar for a senior candidate is not the definition, it is the consequence. New to LLMs? The questions are ordered for a first read: every High priority card first, from what an LLM is through tokens, the context window, sampling, training, hallucination and reasoning models to structured output and model choice, then Medium, then Low.",
  "grounding": "baseline assumed by every GenAI JD + documented inference behaviour",
  "evening": [
    "llm-01",
    "llm-03",
    "llm-05",
    "llm-11",
    "llm-14"
  ],
  "cards": [
    {
      "id": "llm-20",
      "q": "What is an LLM? Explain it to a non-technical person - and how is generative AI different from traditional ML?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "basics",
        "llm",
        "generative",
        "communication"
      ],
      "why": "Whether you can explain the core technology plainly and correctly, without hype, to someone who does not build it.",
      "quick": [
        "An LLM predicts the next bit of text, over and over.",
        "Large means billions of numbers learned from vast text.",
        "It guesses rather than looks up, so it can be wrong.",
        "Traditional ML picks a label, like spam or not spam.",
        "Generative AI writes new content, which is harder to check."
      ],
      "simple": "A large language model, or LLM, is a program that has read a vast amount of text and learned one skill: predicting what comes next. It guesses the next token, then the next, and doing that very well is enough to answer questions, summarise and write code. The best picture for a non-technical listener is a very well-read autocomplete. But it is guessing, not looking things up, which is why it can sound confident and still be wrong.\n\nGenerative AI differs from traditional machine learning in what it produces. Classic ML mostly picks a label or a number from an input. For example, a classic model tells you whether an email is spam, while a generative model writes the reply. Because an open-ended reply is harder to mark right or wrong than a label, generative systems need evaluation and guardrails built in from the start.",
      "points": [
        "An LLM predicts the next token, one at a time, from patterns learned on huge amounts of text.",
        "\"Large\" = billions of parameters (the learned numbers).",
        "Plain-words version: a very well-read autocomplete that guesses rather than looks up.",
        "**Discriminative** models predict a label or number from an input (spam or not).",
        "**Generative** models produce new content (text, images, code) by learning what the data looks like.",
        "Open-ended output is harder to evaluate - that is why evals and guardrails matter."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of discriminative and generative models by what they output, an example, and how easy the output is to check.",
        "caption": "Classic ML **picks a label**; generative AI **makes new content**. Open-ended output is harder to check, so it needs evals and guardrails.",
        "aspects": [
          "Output",
          "Example",
          "Learns",
          "Checking it"
        ],
        "columns": [
          {
            "label": "Discriminative",
            "note": "traditional ML",
            "cells": [
              "A label or number",
              "Spam or not?",
              "Input to label",
              "Easy: compare to answer"
            ]
          },
          {
            "label": "Generative",
            "note": "LLMs, image models",
            "accent": "accent",
            "cells": [
              "New text, images, code",
              "Write the reply",
              "What the data looks like",
              "Hard: open-ended"
            ]
          }
        ]
      },
      "say": "An LLM is a very well-read autocomplete. It has read an enormous amount of text and learned one skill, predicting the next small chunk of text, called a token. It writes one token, then the next, then the next, and doing that really well is enough to answer questions, summarise, translate and write code. The large part refers to its billions of learned numbers, called parameters. What a non-technical person most needs to hear is that it guesses rather than looks things up. That's why it can sound completely confident and still be wrong. Traditional ML is mostly about picking a label or a number from an input. A classic model tells you whether this email is spam. A generative model writes the reply. That shift is the real difference, because a label is easy to mark right or wrong, while an open-ended reply isn't. So generative systems need evaluation, grounding and guardrails built in from the start.",
      "numbers": "No single number applies. Current models range from around a billion parameters (small on-device models) to hundreds of billions or more; size alone does not predict quality on your task.",
      "wrong": "\"It understands everything and knows the whole internet.\" It overstates what the model does, hides why it hallucinates, and loses a non-technical listener's trust the first time the model is wrong.",
      "follow": "If it only predicts the next word, how can it follow instructions or reason?",
      "followAnswer": "Because predicting the next token well, across huge and varied text, forces the model to learn grammar, facts and patterns of reasoning. Then post-training - supervised examples and preference tuning - teaches it to respond to instructions instead of just continuing text. Reasoning models add reinforcement learning on checkable problems. It is still next-token prediction; the training shapes what it predicts."
    },
    {
      "id": "llm-01",
      "q": "What is a token, and why should you care?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "tokens",
        "basics",
        "cost"
      ],
      "why": "Whether you connect a definition to the things it controls - cost, limits and latency.",
      "quick": [
        "A token is a small piece of text the model reads.",
        "Common words are one token, names and code split more.",
        "Limits, cost and speed are all counted in tokens.",
        "The same text costs differently across languages and models.",
        "Measure real text with the exact model, then cut the biggest sources."
      ],
      "simple": "A token is a small chunk of text, and it is the unit a model actually reads and writes. It is usually smaller than a word. Each model family has its own tokeniser, and while common English words are often one token, names, code, numbers and many non-Latin scripts break into several.\n\nThe reason to care is that the context limit, the bill and the latency are all counted in tokens, so more tokens means a higher cost and a slower response. That's why the rule that one token is about three quarters of a word is only a rough guide for English. For example, the same support reply can cost noticeably more in Hindi than in English. So for a real budget, I run a sample of real text through the exact tokeniser, then cut the biggest sources first, usually retrieved context and repeated tool definitions.",
      "points": [
        "A token is a model-specific chunk of text, not a word.",
        "Names, code, numbers and different scripts can tokenise very differently.",
        "Context limits and usage billing are commonly expressed in tokens.",
        "Measure representative languages with the exact model/tokeniser.",
        "Optimise the largest token sources first, often retrieved context or repeated tool definitions."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Text goes through a model-specific tokeniser into token chunks, and those tokens set the context limit, the bill and the latency.",
        "caption": "A token is a **model-specific chunk, not a word**. Context limits, the bill and latency are all counted in tokens, so measure with the exact tokeniser.",
        "lanes": [
          {
            "label": "Your text",
            "note": "names, code, other scripts"
          },
          {
            "label": "Tokeniser",
            "note": "each model family differs",
            "accent": "warn"
          },
          {
            "label": "Tokens",
            "note": "chunks, not words"
          },
          {
            "label": "Context limit",
            "note": "counted in tokens"
          },
          {
            "label": "Bill and latency",
            "note": "more tokens, more cost",
            "accent": "bad"
          }
        ]
      },
      "say": "A token is the chunk of text a model actually reads and writes, and it's usually smaller than a word. Each model family has its own tokeniser deciding where the cuts fall. Common English words are often a single token, while names, code, numbers and many non-Latin scripts break into several. I care because three things are counted in tokens: the context limit, the bill and the latency. More tokens means a higher cost and a slower response. That's also why the rule of three quarters of a word per token is only a rough guide for English. The same support reply can cost noticeably more in Hindi than in English, and different again on another model. So for a real budget I run a sample of production text in every language we serve through the exact tokeniser, or read the provider's usage numbers. Then I cut the biggest sources first, which are usually retrieved context and repeated tool definitions, not the user's question.",
      "numbers": "Use the exact tokenizer or provider usage counter on a representative sample. A single words-per-token multiplier is too model- and language-dependent for a production cost estimate.",
      "wrong": "Saying a token is a word, or quoting one English conversion factor as if it applies to every language and model.",
      "follow": "Your product serves Hindi and English. What does that do to your cost model?",
      "followAnswer": "Hindi usually needs more tokens than English for the same meaning, because most tokenisers were trained mainly on English text. The exact ratio depends on the model, so I measure it: run a few hundred real Hindi, English and mixed Hinglish messages through the tokeniser. Then I budget per language, watch context limits for Hindi users, and compare models on cost per request, not price per token."
    },
    {
      "id": "llm-02",
      "q": "What is the context window, and what happens when you exceed it?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "context",
        "basics",
        "limits"
      ],
      "why": "Whether you have handled the failure or only read the number on a pricing page.",
      "quick": [
        "The context window is the most text one call can handle.",
        "Instructions, history, documents and the answer all share it.",
        "Going over usually errors, or old text silently disappears.",
        "Count first, save room for the answer, trim oldest first.",
        "Bigger is not free, and facts in the middle get missed."
      ],
      "simple": "The context window is the maximum number of tokens a model can handle in one call. Everything shares that one budget: the system prompt, the conversation so far, retrieved documents, tool definitions and the answer the model is about to write. Go over it and most provider APIs return an error, while some frameworks quietly cut older content, which is more dangerous because it disappears without warning.\n\nSo real systems manage the budget on purpose. You reserve room for the output first, because a model that runs out of space mid-answer returns cut-off JSON and breaks the parser downstream. Then you count tokens before sending and trim in a fixed order. For example, in a long support chat you drop the earliest messages before touching the system prompt. A bigger window isn't free either, since you pay for every token and facts buried in the middle often get used less well.",
      "points": [
        "Everything shares one budget: system prompt, history, documents, tools, output.",
        "On most APIs exceeding it is an error; auto-truncation, where offered, drops content silently.",
        "Reserve output tokens first - truncated output breaks downstream parsing.",
        "Trim in a defined order; never cut blindly from the end.",
        "Longer context costs more and can weaken recall of facts buried mid-context."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "The context window as one budget stacked from system prompt, tool definitions, retrieved documents and history, with output tokens reserved at the bottom.",
        "caption": "**Everything shares one budget.** Reserve output tokens first, then trim in a fixed order - oldest turns, then lowest-ranked documents - never blindly from the end.",
        "top": "one context window",
        "layers": [
          {
            "label": "System prompt",
            "note": "never trim"
          },
          {
            "label": "Tool definitions"
          },
          {
            "label": "Retrieved documents",
            "note": "trim lowest-ranked",
            "accent": "warn"
          },
          {
            "label": "Conversation history",
            "note": "trim oldest first",
            "accent": "warn"
          },
          {
            "label": "Reserved output",
            "note": "set aside first",
            "accent": "accent"
          }
        ]
      },
      "say": "It's the total token budget for one call, and everything shares it, the answer included. That means the system prompt, the conversation history, retrieved documents, tool definitions and the output the model is about to write. Go over it and most provider APIs simply return an error. Some frameworks trim or summarise older content for you instead, which is worse, because things vanish with no warning. So the first thing I check is which behaviour our stack has. Then I manage the budget deliberately. I count tokens before sending and reserve room for the output first, because a model that runs out of space mid-answer returns cut-off JSON and the parser downstream breaks. When I have to trim, I do it in a fixed order, oldest turns first, then the lowest-ranked documents, and never by chopping the end blindly. A bigger window isn't free either. You pay for every token, and facts buried in the middle often get used less well.",
      "numbers": "Reserve output tokens explicitly - often 1–2k for a plain chat answer, far more for reasoning models, whose thinking tokens usually count against the output budget. A model that hits the limit mid-JSON returns invalid JSON, and that is a production incident, not a warning.",
      "wrong": "\"The model just forgets the oldest part.\" That is your framework silently trimming, not the model. Not knowing which is happening means you cannot debug why an instruction stopped being followed.",
      "follow": "Your system prompt stopped being followed after twenty turns. Why?",
      "followAnswer": "Usually one of two things. Either the framework trimmed the history and cut the system prompt or an early instruction with it, or the prompt is still there but diluted by thousands of tokens of conversation. I check the exact payload in the trace first. The fixes are to pin the system prompt so it is never trimmed, summarise old turns, and restate key rules near the latest message if evals show it helps."
    },
    {
      "id": "llm-03",
      "q": "Same prompt, two different answers. Explain.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "sampling",
        "temperature",
        "determinism"
      ],
      "why": "Whether you understand generation as sampling, which underpins every reliability question later.",
      "quick": [
        "The model gives odds for every possible next word.",
        "A random pick from those odds chooses the word.",
        "A randomness setting controls how varied the picks are.",
        "Use low randomness for extraction, higher for drafting.",
        "Even the lowest setting can vary, so design for it."
      ],
      "simple": "Two different answers to the same prompt are normal, because generation is sampling. At each step the model produces a probability for every possible next token, and a sampling step draws one. Since it is a draw, two runs can legitimately take different paths.\n\nTemperature controls how spread out those probabilities are. Low temperature sharpens them, so the top token nearly always wins and output repeats, while high temperature flattens them so output varies. Top-p is a separate knob that samples only from the smallest set of tokens whose probabilities add up to p. Common settings are near zero for extraction and around 0.7 for drafting.\n\nBut temperature zero is near-deterministic, not guaranteed, because GPU arithmetic, batching and model updates cause drift. For example, a test checking the exact wording of a classification can start failing now and then in CI. So you design for some variation rather than assume it away.",
      "points": [
        "Generation is sampling from a distribution, one token at a time.",
        "Temperature flattens or sharpens that distribution before sampling.",
        "Top-p keeps the smallest set of tokens summing to p, then samples.",
        "Temperature 0 is near-deterministic, not guaranteed deterministic.",
        "Extraction and classification: low temperature. Creative drafting: higher."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "At each step the model produces probabilities for every token, temperature reshapes them, top-p cuts the tail, and a random pick chooses the token.",
        "caption": "The model does not choose a word; it **samples from a distribution**, one token at a time. The random pick is why the same prompt can give two answers.",
        "lanes": [
          {
            "label": "Prompt so far"
          },
          {
            "label": "Probabilities",
            "note": "over every next token"
          },
          {
            "label": "Temperature",
            "note": "sharpen or flatten",
            "accent": "warn"
          },
          {
            "label": "Top-p",
            "note": "cut the long tail",
            "accent": "warn"
          },
          {
            "label": "Random pick",
            "note": "then repeat",
            "accent": "accent"
          }
        ]
      },
      "say": "Generation is sampling, so two runs of the same prompt can legitimately take different paths. At each step the model doesn't pick a word. It produces a probability for every possible next token, and a sampling step draws one. Temperature decides how spread out those probabilities are before the draw. Low temperature sharpens them, so the top token nearly always wins and output repeats. Higher temperature flattens them, so less likely tokens get a real chance and output varies. Top-p is a separate knob that keeps only the smallest set of likely tokens whose probabilities add up to p, and samples from those. My defaults are close to zero for extraction and classification, and around 0.7 for drafting. The thing juniors miss is that temperature zero is near-deterministic, not guaranteed. GPU arithmetic, batching and provider-side model updates still cause drift, which is how a test starts failing intermittently in CI. So I design for some variation rather than assume it away.",
      "numbers": "Common settings: 0–0.2 for extraction, classification and structured output; 0.7 for drafting and ideation. Set it explicitly - provider defaults differ, and some reasoning models do not accept a temperature setting at all.",
      "wrong": "\"Temperature 0 makes it deterministic.\" Nearly true, and the exception is exactly what bites you when the same test starts failing intermittently in CI.",
      "follow": "You need reproducible outputs for an audit. How do you get as close as possible?",
      "followAnswer": "Temperature zero, a pinned model snapshot, and a fixed prompt, tool list and retrieved context. I also set a seed if the provider supports one. Even then, GPU batching can cause small differences, so for an audit I do not rely on regenerating the answer. I log the full input, model version, parameters and exact output, and that stored output is the record."
    },
    {
      "id": "llm-11",
      "q": "What are temperature, top-p and top-k actually doing to the probability distribution?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "sampling",
        "inference",
        "decoding"
      ],
      "why": "Everyone sets these. This checks whether you know what they do to the distribution or only that one makes output 'more creative'.",
      "quick": [
        "All three change the odds of the next word before picking.",
        "Temperature sharpens or flattens the odds, zero always takes the top.",
        "Top-k keeps a fixed number of choices, however sure the model is.",
        "Top-p keeps likely words up to a set total, so it adapts.",
        "Tune only one, and leave the other at default."
      ],
      "simple": "All three settings change the model's next-token probabilities before a token is picked. The model gives every token a raw score, called a logit, and softmax turns those scores into probabilities. Temperature reshapes those odds, while top-k and top-p cut off the unlikely tail.\n\nTemperature divides the logits before softmax. Below one, the top token dominates, and above one, unlikely tokens get a real chance. Top-k keeps a fixed number of candidates, say fifty, whether the model is sure or confused, so it is blunt. Top-p keeps the smallest set of tokens whose probabilities add up to p. For example, when the model is confident that set might be two tokens, and when it is unsure it might be forty. That adaptivity is why top-p largely replaced top-k. In practice you tune one knob and leave the other at its default, because they interact confusingly.",
      "points": [
        "Temperature rescales logits before softmax - sharpens or flattens.",
        "Top-k keeps a fixed number of candidates regardless of confidence.",
        "Top-p keeps the smallest set reaching cumulative probability p.",
        "Top-p is adaptive to model confidence, which is why it won.",
        "Tune one, not both - they interact confusingly."
      ],
      "say": "All three reshape the next-token distribution before a token is drawn. Temperature changes the odds, while top-k and top-p cut off the tail. The model gives every token in its vocabulary a raw score called a logit, and softmax turns those scores into probabilities. Temperature divides the logits before softmax. Below one, the gaps widen and the top token dominates. Above one, they shrink and unlikely tokens get a chance. At zero you just take the top token, which is greedy decoding. Top-k keeps a fixed number of candidates, say fifty, whether the model is sure or confused, so it's blunt. Top-p keeps the smallest set whose probabilities add up to p. When the model is confident that might be two tokens, and when it's unsure it might be forty. That adaptivity is why top-p largely replaced top-k. In practice I tune one knob and leave the other at its default, because they interact confusingly. Some newer APIs refuse both at once, and many reasoning models accept neither.",
      "numbers": "Temperature 0 for extraction, classification and structured output. Around 0.7 with top-p 0.9 is a common creative default. Tuning both at once makes behaviour hard to reason about.",
      "wrong": "'Temperature controls creativity.' It describes the effect and not the mechanism, and the follow-up - how is top-p different? - needs the mechanism.",
      "follow": "You need deterministic JSON extraction. What do you set, and is that enough?",
      "followAnswer": "Temperature zero, a pinned model version, and schema-constrained output so the shape is guaranteed. That is not enough on its own. Temperature zero is near-deterministic, not guaranteed, and a schema says nothing about whether the values are right. So I validate every field in code, check IDs against the source system, and log failures. The schema fixes the shape; validation checks the content."
    },
    {
      "id": "llm-18",
      "q": "How is an LLM trained end to end - pre-training, fine-tuning and preference tuning?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "training",
        "pre-training",
        "sft",
        "alignment",
        "basics"
      ],
      "why": "Whether you know where a model's knowledge and its behaviour each come from - which decides whether prompting, RAG or fine-tuning can fix a problem.",
      "quick": [
        "Pre-training on huge text gives knowledge and costs the most.",
        "Training on example answers then teaches it to follow requests.",
        "Preference tuning teaches which of two answers people prefer.",
        "Reasoning models also get rewarded for correct maths and code.",
        "Knowledge comes early, so fine-tuning changes style, not facts."
      ],
      "simple": "An LLM is trained in stages, and the key idea is that the first stage gives the model its knowledge while the later stages teach it how to behave.\n\nPre-training comes first. The model reads trillions of tokens of text and code and learns to predict the next token, which forces it to pick up grammar, facts and some reasoning. It is by far the most expensive stage, and the result is a base model that just continues text. Supervised fine-tuning on instruction and answer pairs then teaches it to answer, and preference tuning, with RLHF or DPO, shapes helpfulness, tone and refusals by learning which of two answers people prefer. Reasoning models add reinforcement learning on checkable tasks like maths and code.\n\nThe practical lesson is that fine-tuning changes format and style but is poor at adding facts. For example, if a support bot doesn't know this year's refund policy, retrieval is the right fix, not a fine-tune.",
      "points": [
        "**Pre-training** - next-token prediction on trillions of tokens. Gives knowledge. Most of the compute.",
        "**SFT** - instruction and answer pairs. Teaches the model to follow requests.",
        "**Preference tuning** - RLHF (reward model + RL) or DPO (learn directly from chosen vs rejected pairs).",
        "**RL with verifiable rewards** - maths and code with automatic checks. Produces reasoning models.",
        "Knowledge comes from pre-training; behaviour from post-training. That is why fine-tuning rarely teaches facts well."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Training runs in four stages: pre-training for knowledge, supervised fine-tuning, preference tuning, then reinforcement learning on checkable tasks.",
        "caption": "**Knowledge comes from pre-training; behaviour from post-training.** That is why fine-tuning changes format and style well but rarely teaches facts.",
        "lanes": [
          {
            "label": "Pre-training",
            "note": "trillions of tokens, knowledge",
            "accent": "accent"
          },
          {
            "label": "SFT",
            "note": "instruction-answer pairs"
          },
          {
            "label": "Preference tuning",
            "note": "RLHF or DPO"
          },
          {
            "label": "RL, checkable tasks",
            "note": "maths, code: reasoning"
          }
        ]
      },
      "say": "Knowledge comes from pre-training, and behaviour comes from the stages after it. Pre-training is next-token prediction over trillions of tokens of web pages, books and code. It takes most of the compute and produces a base model that knows a lot but just continues text. Supervised fine-tuning then trains it on instruction and answer pairs, so it learns to answer instead of ramble. Preference tuning comes next. With RLHF you train a reward model on human choices between two answers and optimise the model to score well on it, while DPO learns straight from the preferred and rejected pairs. That shapes helpfulness, tone and refusals. Newer reasoning models add reinforcement learning on maths and code, where an automatic checker rewards correct answers, and that's where long step-by-step thinking comes from. The consequence that matters in practice is simple. Fine-tuning is good at changing format and style, and poor at adding new facts. So if the model is missing facts, I reach for retrieval, not a fine-tune.",
      "numbers": "Pre-training corpora for current open models are reported in the trillions of tokens - Meta reported over 15 trillion for Llama 3. Post-training data is far smaller, often thousands to millions of examples.",
      "wrong": "\"They train it on the internet and then it can answer questions.\" That skips post-training, which is exactly where instruction following, refusals and reasoning behaviour come from - and it leads to the wrong belief that fine-tuning is how you add new knowledge.",
      "follow": "If behaviour comes from post-training, when would you fine-tune instead of prompting?",
      "followAnswer": "When prompting has plateaued on a behaviour I can show with examples - a strict output style, a narrow classification, a house tone, or making a small model do one task a large model already does well. I would not fine-tune to add facts that change; that is retrieval. And I start only once an eval set shows the prompt-only baseline and what better means."
    },
    {
      "id": "llm-05",
      "q": "Why do models hallucinate?",
      "round": [
        "screening",
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "hallucination",
        "reliability",
        "generation"
      ],
      "why": "Whether you can explain the mechanism, which determines whether your mitigations make sense.",
      "quick": [
        "The model does not look anything up.",
        "It writes the likeliest words, and likely is not true.",
        "It is worse on rare or recent facts and false claims.",
        "Give it the facts and permission to say I do not know.",
        "Check against a source, since it can only be reduced."
      ],
      "simple": "Models hallucinate because they are not looking anything up. An LLM writes the most likely next token, again and again, based on patterns from training, and likely and true are different things. So when the model doesn't know something, it doesn't notice a gap. It produces the shape of a right answer instead.\n\nFor example, ask about a refund policy it has never seen and you can get a confident section number that doesn't exist, because the pattern demands something in that spot. It gets worse with rare or recent facts, questions built on a false premise, and pressure to sound specific.\n\nKnowing the mechanism tells you what helps. Put the facts in the context with retrieval, give the model permission to say it doesn't know, check the output against a source, and keep a human on decisions that matter. You can reduce and detect hallucination, but you cannot eliminate it.",
      "points": [
        "The objective rewards plausibility, not truth. There is no lookup step.",
        "Worse for rare, recent or highly specific facts.",
        "False-premise questions get accepted rather than challenged.",
        "Mitigations: retrieval, explicit permission to refuse, output verification, human review.",
        "It cannot be eliminated, only reduced and detected."
      ],
      "say": "Because the model isn't looking anything up. It writes the most likely next token, over and over, and likely isn't the same as true. So when the model doesn't know something, it doesn't notice a gap. It produces the shape of a right answer instead. Ask about a refund policy it's never seen and you can get a confident section number that doesn't exist, because the pattern demands something in that spot. It gets worse on rare or recent facts, where training data was thin, and on questions with a false premise, since the model tends to accept it. Training and benchmarks that score a confident guess above an honest I don't know make the habit stronger. The fixes follow from that. Put the facts in the context, give the model explicit permission to say it doesn't know, check the output against a source, and keep a human on decisions that matter. You can reduce and detect hallucination, but you can't eliminate it.",
      "numbers": "No fixed rate - it is entirely task-dependent. What you measure is your own groundedness rate on your own traffic.",
      "wrong": "\"RAG solves it.\" RAG addresses missing knowledge. It does not address a model ignoring the context it was given, which is a large share of real failures.",
      "follow": "How do you measure hallucination when you have no ground truth?",
      "followAnswer": "I measure groundedness instead of truth. For RAG, a judge model or an NLI checker tests whether each claim in the answer is supported by the retrieved context, and I calibrate that judge against a few hundred human labels. I also check that citations point to real sources, sample traffic for human review, and track user corrections. The trend over time matters more than the absolute number."
    },
    {
      "id": "llm-19",
      "q": "What is a reasoning model, what is test-time compute, and when would you use one?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "reasoning",
        "test-time-compute",
        "model-selection",
        "cost"
      ],
      "why": "A 2025-26 currency check: whether you know what these models do differently and can say when the extra cost and latency are worth it.",
      "quick": [
        "A reasoning model thinks step by step before answering.",
        "It learned by being rewarded for correct maths and code.",
        "Test-time compute means more thinking when asked, not in training.",
        "The thinking is billed and makes the user wait longer.",
        "Use it for hard multi-step tasks, not simple sorting jobs."
      ],
      "simple": "A reasoning model is a model trained to think before it answers. It first writes a long internal working-out, called thinking tokens, and only then gives the final answer. It learned this mostly through reinforcement learning on tasks with a checkable answer, like maths and code, so it learned to plan, check its work and backtrack. Test-time compute is the idea behind it: spend more computation when the question is asked, like giving a student scratch paper and more time.\n\nThe trade-off is cost and latency. Thinking tokens are usually billed as output and can be several times longer than the visible answer, and the user waits longer for the first word. So you route by task. For example, tricky code, multi-step analysis or planning an agent's next move are worth a reasoning model, while simple extraction or short chat should stay on a standard model, which is faster and cheaper.",
      "points": [
        "Reasoning model = trained to produce internal reasoning tokens before the answer.",
        "Test-time compute = spending more compute at inference, not training, to get a better answer.",
        "Trained mainly with RL on verifiable tasks (maths, code) - rewarded for correct final answers.",
        "Thinking tokens are usually billed as output and add latency before the first visible token.",
        "Control it with the provider's effort or thinking-budget setting; choose the level with evals.",
        "Many reasoning models ignore or reject temperature and top-p."
      ],
      "say": "A reasoning model is trained to work through a problem in hidden thinking tokens before it writes the final answer. It learns that mostly through reinforcement learning on checkable tasks like maths and code, where it's rewarded only when the final answer is correct, so it picks up planning, checking and backtracking. Test-time compute is the broader idea. You spend more computation when the question is asked, not during training, and more thinking usually means better answers on hard problems. The catch is cost and latency. Thinking tokens are usually billed as output and can run many times longer than the visible answer, and the user waits longer for the first word. So I route by task. Tricky code, multi-step analysis or planning an agent's next move gets a reasoning model. Simple extraction, classification and short chat stay on a standard model, which is faster, cheaper and just as good there. Most APIs expose an effort or thinking-budget setting, and I pick the level from our evals.",
      "numbers": "Reasoning tokens can be several times the visible answer, so a reasoning call can cost and take far longer than a standard call with the same visible output. Measure it from the provider's usage breakdown on your own tasks.",
      "wrong": "\"Reasoning models are just better, so we use them everywhere.\" On simple extraction or classification they add cost and latency for little or no quality gain, and the panel wants to hear that you route by task.",
      "follow": "How would you choose the reasoning effort level for a production feature?",
      "followAnswer": "Empirically. I run the eval set at each effort level and compare quality against cost and p95 latency. I pick the lowest level where quality stops improving meaningfully, and set a max output token cap so a runaway reasoning trace cannot blow the budget. If only some requests are hard, I route: low effort by default, higher effort for cases a classifier or a failed first attempt flags."
    },
    {
      "id": "llm-07",
      "q": "How do you get reliable structured output?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "structured-output",
        "json",
        "reliability",
        "tools"
      ],
      "why": "Every real system parses model output. This is where demos break in production.",
      "quick": [
        "Just asking for JSON in the prompt fails at scale.",
        "Use the provider's strict output mode that enforces your format.",
        "Still check every field, since valid does not mean correct.",
        "Retry once with the error, then fail gracefully.",
        "Log every failure, since a rising rate signals a change."
      ],
      "simple": "Every real system has to parse what the model returns, and this is where demos often break. Just asking for JSON in the prompt works most of the time, but failures show up at scale: markdown fences, a trailing comma or a friendly sentence before the brace. For example, at 10,000 requests a day, a 1% failure rate means 100 broken responses every day.\n\nThe better approach is structured outputs, or schema-constrained decoding, which restricts the tokens the model may emit so the output matches your schema by construction. You still validate with something like Pydantic, because valid JSON is not correct JSON, and flat, simple schemas fail less often.\n\nFinally, you need a fallback. Retry once with the validation error fed back, then fail gracefully rather than retrying forever, and log every parse failure so a rising rate warns you of a change.",
      "points": [
        "Prompt-and-parse is the weakest option. It fails at scale, not in testing.",
        "Use schema-constrained structured outputs, or tool calling with strict schemas; plain JSON mode does not enforce your schema.",
        "Validate with Pydantic regardless. Valid is not correct.",
        "Retry once with the error message, then fail gracefully.",
        "Keep schemas flat and simple. Deep nesting raises the failure rate.",
        "Log every parse failure - a rising rate often signals a model, prompt or input change."
      ],
      "diagram": {
        "alt": "The model generates schema-constrained output, which is validated with Pydantic; if valid it is used, and if invalid it retries once with the error, then fails gracefully.",
        "caption": "**Constrain, then validate anyway.** Schema-constrained output beats prompt-and-parse, but valid is not correct: retry once with the error, then fail gracefully.",
        "rows": [
          [
            {
              "id": "g",
              "label": "Constrained output",
              "note": "strict schema or tools",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "v",
              "label": "Validate",
              "note": "Pydantic",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "ok",
              "label": "Use it",
              "accent": "accent"
            },
            {
              "id": "r",
              "label": "Retry once",
              "note": "feed back the error",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "f",
              "label": "Fail gracefully",
              "note": "and log it",
              "accent": "bad"
            }
          ]
        ],
        "edges": [
          {
            "from": "g",
            "to": "v"
          },
          {
            "from": "v",
            "to": "ok",
            "label": "valid"
          },
          {
            "from": "v",
            "to": "r",
            "label": "invalid"
          },
          {
            "from": "r",
            "to": "f",
            "label": "fails again"
          }
        ]
      },
      "say": "Use the provider's schema-constrained output, then validate in code anyway. Asking for JSON in the prompt and parsing whatever comes back works most of the time, and that's exactly the problem. At scale you get markdown fences, trailing commas and a chatty sentence before the opening brace. At ten thousand requests a day, a one percent failure rate is a hundred broken responses. Structured outputs, or tool calling with strict schemas switched on, restrict which tokens the model can emit, so the output matches the schema by construction. Plain JSON mode only promises valid JSON, not your schema. Even strict modes can stop early on a token limit or a refusal, so I still validate with Pydantic, because valid JSON can hold nonsense in a field. If validation fails, I retry once with the error fed back, then fail gracefully. A model that fails twice rarely succeeds on the fifth try. And I log every parse failure, because a rising rate usually means a model, prompt or input change.",
      "numbers": "Prompt-and-parse commonly fails a small but non-zero share of requests. At 10,000 requests a day even 1% is 100 broken responses - which is why schema-constrained output or tool calling should be the default for anything parsed at volume.",
      "wrong": "\"I ask for JSON and it works.\" It works in the notebook. The panel is asking about the tail - fences, trailing commas, truncation - and the follow-up will ask what happens to the 1% that fails.",
      "follow": "Your JSON is valid but a field contains a hallucinated ID. Now what?",
      "followAnswer": "A schema cannot catch that, so I add semantic validation in code. Every ID is checked against the source of truth before use. If it does not exist, I retry once with a message saying the ID is invalid, and where possible give the model the real candidates or a lookup tool. If it still fails, I return a safe error or route to a human, and log the case."
    },
    {
      "id": "llm-08",
      "q": "How do you choose which model to use?",
      "round": [
        "tech1",
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "model-selection",
        "cost",
        "trade-off",
        "evaluation"
      ],
      "why": "Whether you decide with your own evaluation or with a leaderboard.",
      "quick": [
        "Not from a leaderboard, because your task is different.",
        "Start with hard rules like where data must stay.",
        "Test three or four models on about 100 of your examples.",
        "Compare quality, cost and speed together.",
        "Send only hard cases to the costly model, and keep switching easy."
      ],
      "simple": "You choose a model from your own evaluation, not from a leaderboard. Public benchmarks measure general skill on public tasks, and your task is neither general nor public. Hard constraints come first, such as where the data must stay or whether it has to be self-hosted, and these often remove most options before quality is even discussed.\n\nNext, build an evaluation set of around a hundred examples from your own data, run three or four shortlisted models on it, and compare quality, cost and p95 latency together. Cost matters from the start, because prices between tiers often differ by ten times or more. For example, a cheap model often handles most routine support tickets well, so you route only the hard ones to the expensive model. Since new models ship every few months, you put model access behind one interface and keep the evaluation set ready to re-run.",
      "points": [
        "Hard constraints first: residency, tenancy, contract, self-hosting.",
        "Build a ~100-example evaluation set from your own data to start.",
        "Compare quality, cost per request and p95 latency together, not separately.",
        "Route by difficulty - cheap model for most traffic, expensive for the tail.",
        "Abstract the provider so switching is configuration.",
        "Keep the eval set. Re-run it when a new model ships."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Choosing a model: apply hard constraints, build an eval set from your own data, compare quality, cost and latency together, route by difficulty, and re-run when new models ship.",
        "caption": "**Constraints first, then your own evals - not a leaderboard.** Judge quality, cost and p95 latency together, and keep the eval set for the next model.",
        "lanes": [
          {
            "label": "Hard constraints",
            "note": "residency, contract, hosting",
            "accent": "warn"
          },
          {
            "label": "Own eval set",
            "note": "~100 real examples",
            "accent": "accent"
          },
          {
            "label": "Compare together",
            "note": "quality, cost, p95"
          },
          {
            "label": "Route by difficulty",
            "note": "cheap model for most"
          },
          {
            "label": "Re-run on release",
            "note": "switch by config"
          }
        ]
      },
      "say": "From our own evaluation, not a leaderboard, because public benchmarks measure general skill on public tasks and ours is neither. I start with hard constraints. Where must the data stay, do the contract terms work, and do we need to self-host? Those rules often remove most options before quality even comes up. Then I build an eval set of around a hundred examples from our own data and run three or four shortlisted models on it. I look at quality, cost per request and p95 latency together, because prices between tiers often differ by ten times or more. A cheap model frequently handles most support tickets well, so I route only the hard ones to the expensive model. A hundred examples will spot big gaps, but separating models a few points apart needs more. Finally I plan for change. Model access sits behind one interface, so a switch is a config change, and I keep the eval set to re-run the day a new model ships.",
      "numbers": "A 100-example evaluation set is usually enough to spot large gaps between candidates; separating models a few points apart needs more examples. Price differences between model tiers are often an order of magnitude or more, which is why per-request cost belongs in the comparison from the start.",
      "wrong": "\"We use the top model on the leaderboard.\" The follow-up will ask how it performed on your data, and without your own evaluation set there is no answer - that is the skill being probed.",
      "follow": "A new model launches next month. What do you do?",
      "followAnswer": "I run it through the same eval set - same prompts first, then with light prompt tuning - and compare quality, cost per request and p95 latency against the current model. If it wins clearly, I canary it on a small slice of real traffic with monitoring, then roll out. If it only ties, I usually stay, because a switch has migration and regression-testing cost."
    },
    {
      "id": "llm-04",
      "q": "What is the difference between a base model, an instruct model and a chat model?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "training",
        "models",
        "fine-tuning"
      ],
      "why": "Whether you know how the model you call was produced.",
      "quick": [
        "A base model only continues text, it does not help.",
        "An instruct model is trained further on request and answer pairs.",
        "A chat model adds roles and learns from human preferences.",
        "Almost every model you call through an API is chat.",
        "The weights differ, not just the prompt format."
      ],
      "simple": "These are three stages of the same training pipeline, and the important point is that the weights are different, not just the prompt template.\n\nA base model is trained only to predict the next token, so it just continues text. For example, if you ask a base model a question, it may reply with more questions, because that is what a list of questions looks like in its training data. An instruct model is that base model fine-tuned on instruction and answer pairs, so it has learned to answer requests. A chat model adds roles such as system, user and assistant, and is usually tuned on human preferences so it is helpful and refuses harmful requests. Almost everything you call through an API is a chat model.\n\nThis explains why two versions of the \"same\" model behave so differently, and why every fine-tuning plan starts by choosing which checkpoint to begin from.",
      "points": [
        "Base - next-token prediction only. Not helpful by default.",
        "Instruct - supervised fine-tuning on instruction-response pairs.",
        "Chat - role structure plus preference alignment, RLHF or DPO.",
        "The API models you use are almost always chat models.",
        "Task fine-tuning (e.g. LoRA) usually starts from the instruct checkpoint; continued pre-training or a custom chat format may start from base."
      ],
      "say": "They're three stages of the same pipeline, and the weights differ, not just the prompt template. A base model is trained only to predict the next token, so it continues text rather than helps. Ask it a question and it may reply with more questions, because that's what a list of questions looks like in its training data. An instruct model is that base model fine-tuned on instruction and answer pairs, so it has learned that a request should be followed by an answer. A chat model adds roles like system, user and assistant, and is usually tuned further on human preferences with RLHF or DPO, so it's helpful and refuses harmful requests. In most open-weight releases the Instruct checkpoint is the chat model, and almost everything we call through an API is one. So every fine-tuning plan starts by choosing a checkpoint. Task fine-tuning usually starts from instruct, while continued pre-training may start from base.",
      "numbers": "No number applies. This is a training-pipeline question.",
      "wrong": "\"They are the same model with a different prompt template.\" The template differs, but so do the weights - different training stages produced them.",
      "follow": "Where does RLHF fit, and what is DPO doing differently?",
      "followAnswer": "RLHF comes after supervised fine-tuning, and it is the step that turns an instruct model into a helpful, well-behaved chat model. Humans compare pairs of answers, a reward model learns to predict their preferences, and reinforcement learning, classically PPO, pushes the model to score well while a penalty keeps it close to the original. DPO skips the reward model and the RL loop. It trains directly on chosen and rejected pairs with a simple loss, which is cheaper and more stable to run."
    },
    {
      "id": "llm-09",
      "q": "What is the difference between a system prompt and a user message - and does it matter?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "prompting",
        "roles",
        "security"
      ],
      "why": "Small question, useful signal - it leads directly into injection.",
      "quick": [
        "The system prompt sets standing rules, tone and format.",
        "The user message is this turn's request.",
        "Models weight the system prompt more, but not always.",
        "Long chats and pushy users can talk past it.",
        "Put real security rules in code, not the prompt."
      ],
      "simple": "The system message sets the standing behaviour for the model: its role, rules, tone and output format. The user message is the request for this particular turn. Chat models were trained to weight the system message more heavily, so instructions there are followed more consistently. But more heavily is not absolutely. A long conversation can dilute it, and a user message that argues with it will sometimes win, which is why prompt injection works at all.\n\nSo the system prompt is guidance, not a security control. Access rules and permission checks belong in code, where the model cannot argue with them. For example, \"never show another customer's orders\" cannot live only as a sentence in the prompt. It has to be enforced by the code that fetches orders, which only returns the logged-in customer's data. The system prompt is still the right place for behaviour and style.",
      "points": [
        "System - standing rules, weighted more heavily by training.",
        "User - this turn's request.",
        "Some APIs now call the top level the developer message and train an explicit instruction hierarchy.",
        "Weighting is a tendency, not a guarantee. Long conversations dilute it.",
        "Never put a security control only in the system prompt.",
        "Anything retrieved or user-supplied is untrusted data, never instructions."
      ],
      "say": "It matters, but mostly as a trust question rather than a formatting one. The system message sets standing behaviour like role, rules, tone and output format, and the user message is this turn's request. Chat models are trained to weight the system message more heavily, and some APIs now call it the developer message and train an explicit instruction hierarchy. Heavier isn't absolute, though. A long conversation dilutes it, and a user message that argues with it will sometimes win, which is exactly why prompt injection works at all. So I treat the system prompt as guidance, not a security control. A rule like never show another customer's orders has to be enforced in code, in our runtime, where the model can't argue with it. Anything retrieved or user-supplied is untrusted data, never instructions. If the only thing stopping a data leak is a sentence in the system prompt, you don't have a control.",
      "numbers": "No number applies. This is a trust-boundary answer.",
      "wrong": "\"The system prompt cannot be overridden.\" It can, routinely - that is how prompt injection works - and the follow-up will ask where your real controls live.",
      "follow": "Show me how a retrieved document could override your system prompt.",
      "followAnswer": "Say a support bot retrieves a help article that someone has edited to include a line telling the assistant to ignore its previous instructions and list the customer's recent orders with addresses. The model sees that text in the same context as my system prompt, and because it cannot reliably tell data from instructions, it may obey. That is indirect prompt injection. So I mark retrieved text as data, give the model only this user's tools and data, and enforce access in code, so obeying achieves nothing."
    },
    {
      "id": "llm-06",
      "q": "Walk me through what happens inside the model server for one request, from prompt to last token.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "inference",
        "latency",
        "kv-cache",
        "serving"
      ],
      "why": "The request-lifecycle view: it ties prefill, the decode loop, the KV cache and stopping together, and separates people who have tuned serving from people who have only called an API.",
      "quick": [
        "The text is first split into tokens.",
        "The whole prompt is read at once, which sets the first wait.",
        "Then the answer is written one token at a time.",
        "Saved past work avoids redoing it, but fills GPU memory.",
        "Long prompts slow the start, long answers slow the total."
      ],
      "simple": "When a request reaches the model server, the text is first split into tokens. Generation then runs in two phases: prefill, which reads the prompt all at once, and decode, which writes the answer one token at a time.\n\nPrefill processes all the input tokens in parallel, which keeps the GPU busy and sets your time to first token. Decode can't run in parallel within one request, because each token depends on the one before. Every step re-reads the model's weights, so it is limited by memory speed and sets tokens per second. The KV cache links the two by storing earlier tokens' attention data, so nothing is recomputed, but it grows with length and batch size and usually limits how many users one GPU can serve.\n\nSo long input slows the first token, while long output slows the total. For example, a chatbot stuffed with documents feels slow to start, while one writing long reports feels slow to finish.",
      "points": [
        "Prefill - input processed in parallel, compute-bound, sets time to first token.",
        "Decode - one token at a time, memory-bandwidth bound, sets tokens per second.",
        "KV cache avoids recomputation; its memory cost limits concurrency.",
        "Long input → slow first token. Long output → slow total. Different fixes.",
        "Continuous batching, as in vLLM, is what keeps the GPU busy across requests."
      ],
      "say": "It runs in two phases, prefill then decode, with a KV cache linking them. First the text is split into tokens. In prefill the whole prompt goes through the model in parallel. That's heavy arithmetic, but it keeps the GPU busy, and it sets the time to first token. Decode then writes the answer one token at a time, because each token depends on the one before. Every step reads the weights again, so decode is limited by memory bandwidth, not arithmetic, and it sets tokens per second. The loop stops at an end token, a stop sequence or the max-token limit. The KV cache makes decode workable by storing earlier tokens' attention keys and values, so nothing is recomputed. Its memory grows with sequence length and batch size, and that usually caps how many users one GPU serves. Continuous batching, as in vLLM, keeps the GPU full across requests. So a long prompt slows the first token, a long answer slows the total, and each needs a different fix.",
      "numbers": "KV cache memory ≈ 2 × layers × KV heads × head dimension × sequence length × batch × bytes per value (worked example in tf-12). It is commonly the binding constraint on concurrent requests, ahead of raw compute.",
      "wrong": "\"The model just generates the answer.\" For an API-only role it may pass. For anything touching self-hosting or cost, it does not.",
      "follow": "How does continuous batching change throughput?",
      "followAnswer": "Static batching waits for every request in the batch to finish, so short requests sit idle behind long ones. Continuous batching works at each token step: as soon as one sequence ends, a waiting one joins the running batch. The GPU stays full, so throughput is often several times higher at similar latency. vLLM, TGI and SGLang all do this, usually with a paged KV cache."
    },
    {
      "id": "llm-14",
      "q": "Explain prefill and decode, and why they need different optimisations.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "inference",
        "serving",
        "latency"
      ],
      "why": "The distinction that explains almost every serving decision, from batching to why long prompts behave differently from long outputs.",
      "quick": [
        "Prefill reads the whole prompt at once, in parallel.",
        "It is limited by maths and sets the first-word wait.",
        "Decode writes one word at a time, limited by memory speed.",
        "Grouping requests helps decode a lot, since the model is shared.",
        "If the first word is slow, check prompt size and caching."
      ],
      "simple": "Prefill and decode are the two phases of generating an answer, and they are different kinds of work. Reading the prompt is limited by GPU arithmetic, while writing the answer is limited by memory speed, so you speed them up in different ways.\n\nPrefill processes the whole prompt at once, because all its tokens are known, so it runs as large parallel calculations and fills the KV cache. Decode writes one token at a time, and for every token the GPU reads all the weights plus the cache, so the arithmetic units mostly sit waiting for data. That's why batching helps decode a lot, since the weights are read once and shared across many requests, while prompt caching helps prefill by skipping a repeated prefix.\n\nFor example, if users complain that the first word takes too long to appear, you look at prompt size, queueing and caching, not tokens per second, because the problem sits in prefill.",
      "points": [
        "Prefill: whole prompt in parallel, compute-bound, sets TTFT.",
        "Decode: one token at a time, memory-bandwidth-bound.",
        "Batching helps decode far more than prefill.",
        "Long prompts hurt TTFT; long outputs hurt total time.",
        "Prompt caching works by skipping prefill for a cached prefix."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of prefill and decode by how tokens are processed, the bottleneck, the metric each sets, and what helps each.",
        "caption": "Two phases, two bottlenecks: **prefill is compute-bound and sets TTFT; decode is memory-bound and sets tokens per second.** Fix each differently.",
        "aspects": [
          "Tokens",
          "Bottleneck",
          "Sets",
          "Hurt by",
          "Helped by"
        ],
        "columns": [
          {
            "label": "Prefill",
            "note": "read the prompt",
            "accent": "warn",
            "cells": [
              "Whole prompt in parallel",
              "Compute",
              "Time to first token",
              "Long prompts",
              "Prompt caching"
            ]
          },
          {
            "label": "Decode",
            "note": "write the answer",
            "accent": "accent",
            "cells": [
              "One at a time",
              "Memory bandwidth",
              "Tokens per second",
              "Long outputs",
              "Batching"
            ]
          }
        ]
      },
      "say": "Reading the prompt is limited by arithmetic, while writing the answer is limited by memory speed, so each needs its own fixes. In prefill every prompt token is already known, so the whole prompt runs in parallel as big matrix multiplications. The GPU is compute-bound, and this phase sets the time to first token and fills the KV cache. Decode writes one token at a time. For each token the GPU reads all the model weights plus the cache, so the compute units mostly sit waiting for data. Batching helps decode a lot, because the weights are read once and shared across many requests, while prefill is already busy. Continuous batching swaps new requests in as old ones finish. Prompt caching skips prefill for a repeated prefix. And some large deployments run the two phases on separate GPU pools. So if the first token is slow, I look at prompt size, queueing and caching, not at the model's tokens per second.",
      "numbers": "Prefill cost scales with input length; decode cost scales mainly with output length, and each decode step gets a little slower as the KV cache grows. If TTFT is your problem, look at prompt size, queueing and caching, not at the model's tokens per second.",
      "wrong": "Treating generation as one uniform process. It leaves you unable to explain why a long prompt and a long answer degrade different metrics.",
      "follow": "Your TTFT is fine but total response time is bad. Which phase, and what do you do?",
      "followAnswer": "That is the decode phase, so the problem is how many tokens we generate or how fast we generate them. I check output length first, because shorter output is the cheapest fix: tighter instructions, a max token cap, leaner JSON, or no reasoning where it adds nothing. Then I look at generation speed, with a smaller or quantised model, speculative decoding, or less crowded batches if the server is overloaded. Streaming also helps, since users start reading while the rest arrives."
    },
    {
      "id": "llm-15",
      "q": "What is prompt caching, and how do you structure a prompt to actually benefit?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "cost",
        "latency",
        "caching"
      ],
      "why": "A direct cost lever that most candidates know exists and cannot say how to exploit.",
      "quick": [
        "The provider reuses work on a repeated start of the prompt.",
        "Reused text costs much less and answers start sooner.",
        "It must match exactly and breaks at the first difference.",
        "Put fixed parts first and changing parts last.",
        "A timestamp at the top breaks it every time."
      ],
      "simple": "Prompt caching means that if many requests start with exactly the same text, the provider can reuse the work it already did on that opening part, called the prefix. That part skips prefill, so those input tokens cost much less, commonly 50-90% below the normal rate, and the first token arrives sooner.\n\nIt is an exact prefix match, so the cache breaks at the first token that differs. That's why you order the prompt from static to variable: the system prompt, tool definitions and examples first, then retrieved documents, history and the user's question. For example, a common mistake is putting a timestamp or user ID at the top of the system prompt, which silently breaks the cache on every request. The biggest payoff is in agents and long chats, which resend the same opening again and again. Caches expire after a few minutes, though, so you measure the hit rate rather than assume it.",
      "points": [
        "Caches an exact token prefix; it breaks at the first difference.",
        "Order static content first, variable content last.",
        "A timestamp or user id at the top destroys every cache hit.",
        "Highest payoff in agent loops - tool definitions resent each step.",
        "Short TTL and a minimum length; measure the hit rate."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "A prompt ordered for caching: stable system prompt, tool definitions and examples first form the cached prefix; documents, history and the user question vary and come last.",
        "caption": "Caching is an **exact prefix match** that breaks at the first difference. Put static content first and variable content last; a timestamp at the top kills every hit.",
        "top": "cached prefix starts here",
        "bottom": "computed fresh each time",
        "layers": [
          {
            "label": "System prompt",
            "note": "stable",
            "accent": "accent"
          },
          {
            "label": "Tool definitions",
            "note": "stable",
            "accent": "accent"
          },
          {
            "label": "Few-shot examples",
            "note": "stable",
            "accent": "accent"
          },
          {
            "label": "Retrieved documents",
            "note": "varies",
            "accent": "warn"
          },
          {
            "label": "History",
            "note": "grows",
            "accent": "warn"
          },
          {
            "label": "User question",
            "note": "varies",
            "accent": "warn"
          }
        ]
      },
      "say": "The provider reuses work done on a prompt's opening text, so the parts that never change must come first. If a new request starts with the same tokens as a recent one, that prefix skips prefill. Those tokens are billed at roughly 50 to 90 percent less, and the first token arrives sooner. The catch is it's an exact prefix match. It breaks at the first differing token, and everything after is computed fresh. So I order the prompt from static to variable. System prompt, tool definitions and few-shot examples go first, then retrieved documents, history and the question. The classic mistake is a timestamp or user ID at the top of the system prompt, which silently kills every cache hit. Agent loops gain most, since they resend the same prompt and tools every step. Caches expire after a few minutes, there's a minimum prefix length, and some providers charge extra for cache writes. So I measure the hit rate rather than assume it.",
      "numbers": "Cached input tokens are commonly billed at roughly 50-90% below the normal input rate, depending on provider and model, and some providers charge a premium to write the cache. Default lifetimes are typically minutes, with longer options on some providers. The minimum cacheable prefix varies by model, often around a thousand tokens.",
      "wrong": "Enabling caching and assuming the saving arrives. If a variable element sits near the top of the prompt, the hit rate is near zero and nothing tells you.",
      "follow": "Your cache hit rate is 5%. Where would you look first?",
      "followAnswer": "I diff the start of consecutive requests to find where they diverge. The usual culprits are a timestamp, request ID or user name early in the system prompt, tool definitions serialised in a different order, retrieved context placed before the stable instructions, or a prefix below the provider's minimum length. Then I check traffic: if requests sharing that prefix are minutes apart, the cache simply expires."
    },
    {
      "id": "llm-12",
      "q": "What is quantisation, and what does INT8 or INT4 actually cost you?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "quantisation",
        "serving",
        "cost"
      ],
      "why": "The main lever for self-hosting on affordable hardware, and the quality trade is what gets probed.",
      "quick": [
        "Quantisation stores each weight with fewer bits.",
        "The model shrinks and needs much less GPU memory.",
        "A 70B model drops from 140 GB to about 35 GB.",
        "8-bit loses little, 4-bit can hurt reasoning and code.",
        "Always check quality on your own tests."
      ],
      "simple": "Quantisation means storing each model weight in fewer bits, so the model needs less GPU memory. Weights are usually 16-bit numbers, and quantisation stores them in 8 or 4 bits instead, so the model shrinks roughly in proportion.\n\nThe arithmetic is why it matters. For example, a 70-billion-parameter model at 16 bits needs about 140 GB just for its weights, which means at least two 80 GB GPUs. At 4 bits it is about 35 GB and fits on one GPU, so the bill halves. The KV cache still sits on top, though.\n\nOn quality, 8-bit is usually close to free and is a common serving default. 4-bit is where judgement starts, since it is often fine but hard reasoning, long context and code degrade first. Either way, you validate on your own eval set, not a benchmark table.",
      "points": [
        "Fewer bits per weight - memory shrinks roughly proportionally.",
        "70B at FP16 is ~140 GB; at 4-bit roughly 35 GB plus overhead - one GPU instead of two.",
        "8-bit (INT8/FP8) is usually near-free; 4-bit is usually acceptable with real edge cases.",
        "Common 4-bit methods: GPTQ, AWQ, GGUF (llama.cpp); FP4 formats on the newest GPUs.",
        "Reasoning, long context and code degrade first.",
        "Validate on your own eval set, not a published benchmark."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of 16-bit, 8-bit and 4-bit weights by bytes per weight, memory for a 70B model, GPUs needed and quality cost.",
        "caption": "**Fewer bits, proportionally less memory.** A 70B model drops from ~140 GB to ~35 GB at 4-bit - one GPU instead of two - but test reasoning, long context and code.",
        "aspects": [
          "Bytes per weight",
          "70B weights",
          "Quality cost"
        ],
        "columns": [
          {
            "label": "FP16 / BF16",
            "note": "the default",
            "cells": [
              "2",
              "~140 GB",
              "Baseline"
            ]
          },
          {
            "label": "INT8 / FP8",
            "accent": "accent",
            "cells": [
              "1",
              "~70 GB",
              "Usually near-free"
            ]
          },
          {
            "label": "4-bit",
            "note": "GPTQ, AWQ, GGUF",
            "accent": "warn",
            "cells": [
              "0.5",
              "~35 GB",
              "Test on own evals"
            ]
          }
        ]
      },
      "say": "Quantisation stores each weight in fewer bits, so the model needs far less GPU memory. Weights are normally 16-bit, two bytes each, and dropping to 8 or 4 bits shrinks the model roughly in proportion. The arithmetic is why it matters. A 70-billion-parameter model needs about 140 gigabytes at 16 bits, so at least two 80 gigabyte GPUs. At 4 bits it's about 35 gigabytes plus a little overhead, and it fits on one. That's the gap between a two-GPU bill and a one-GPU bill. Mechanically, a group of weights shares a scale factor and each weight is rounded onto that scale. On cost, 8-bit, whether INT8 or FP8, is usually close to free, and FP8 is a common serving default. Four-bit methods like GPTQ or AWQ are often fine, but hard reasoning, long context and code degrade first, and below four bits the loss is clear. The KV cache still sits on top of the weights, too. So I validate on our own eval set, not a benchmark table.",
      "numbers": "Rough weight memory: FP16/BF16 is 2 bytes per parameter, 8-bit 1 byte, 4-bit half a byte (plus a few percent for scale factors). Add the KV cache on top - at long context and high concurrency it can be larger than the weights.",
      "wrong": "'INT4 halves quality.' The trade is usually far better than that and highly task-dependent, so the follow-up will ask what you measured on your own eval set.",
      "follow": "You quantised to INT4 and your eval dropped 3 points. What are your options?",
      "followAnswer": "First, check whether 3 points matters for the product and where the loss sits. Then the options: try 8-bit or FP8, which usually recovers most of it; use a better 4-bit method or smaller group size; keep sensitive layers at higher precision; or run a smaller model at higher precision. If the cost saving is large, a short fine-tune after quantisation can also win quality back."
    },
    {
      "id": "llm-10",
      "q": "A model update from the provider changed your outputs. What do you do?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "operations",
        "versioning",
        "evaluation",
        "incident"
      ],
      "why": "A real operational scenario. It tests whether you built for a dependency you do not control.",
      "quick": [
        "The real question is whether you would even notice.",
        "Pin the exact model version and log it every request.",
        "Run your test set on a schedule, not just at release.",
        "Compare old and new, then roll back to buy time.",
        "Fix prompts that relied on old quirks, then re-test."
      ],
      "simple": "When a provider update changes your outputs, the real first question is whether you would have noticed at all. Without the right setup, your first signal is a user complaint. So you pin an exact model version, log it on every request, and run your golden evaluation set on a schedule and after any provider announcement.\n\nOnce a change is flagged, you respond in order. Confirm the version really changed, run the evaluation set on old and new versions to measure what moved, and roll back if you pinned, to buy time. Only then do you fix. For example, if a ticket classifier suddenly starts labelling billing questions as general, the eval comparison shows exactly which category moved, and often a prompt tweak fixes it. Jumping straight to editing the prompt before measuring is the real mistake.",
      "points": [
        "Pin versions. A floating alias means silent changes you cannot roll back.",
        "Log the exact model version on every request.",
        "Run the golden set on a schedule, not just at release.",
        "Alert on quality drift, not only on errors and latency.",
        "Keep provider access behind an interface so a switch is possible."
      ],
      "say": "The real first question is whether we'd have noticed at all. Without the right setup, the first signal is a user complaint. Noticing takes three things. We pin an exact model version instead of a floating alias the provider can repoint, we log that version on every request, and we run a golden set on a schedule, not just before releases. Once it's flagged, I go in order. I compare logs from before and after to confirm the version really changed. Then I run the eval set on both versions to see what moved and where. If we pinned, I roll back to buy time, knowing pinned snapshots do get retired, so that's weeks or months, not forever. Only then do I fix. Often a prompt leaned on a quirk of the old model, so I fix forward and re-run the evals. Jumping straight to editing the prompt is the actual mistake. Longer term, I alert on quality drift as well as errors, and keep the provider behind an interface.",
      "numbers": "Run the golden set on a schedule matched to your risk - daily or weekly is common - and always after any provider announcement. The cost of a 100-example run is small against finding out from a user.",
      "wrong": "\"We would update the prompt to fix it.\" That is step four. Steps one to three are detection, quantification and rollback, and skipping them is the actual failure.",
      "follow": "How would you detect quality drift automatically, without a user complaining?",
      "followAnswer": "I run the golden set on a schedule and alert when a metric drops past a threshold against a baseline. On live traffic I sample requests and score them with a calibrated LLM judge for groundedness or task success. I also watch cheap proxies: refusal rate, parse failures, output length, retries, thumbs-down and escalations. A sudden shift in any of them triggers a look at the traces."
    },
    {
      "id": "llm-16",
      "q": "Open-weight or closed model - and why is that not the same decision as self-host or API?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "decision",
        "cost",
        "architecture"
      ],
      "why": "A senior architecture decision a hiring manager will press on. The trap is treating \"open-weight\" as \"self-hosted\" and deciding on cost alone.",
      "quick": [
        "Open-weight means who holds the model, self-hosting who runs it.",
        "Open models run behind APIs, closed ones can run in your cloud.",
        "Start with rules on where data must stay.",
        "Test quality on your own tasks, not public scores.",
        "Self-hosting is a fixed cost, APIs cost per use."
      ],
      "simple": "Open-weight versus closed is about who can hold the model's weights, while self-host versus API is about who runs the servers. People treat them as one decision, but open-weight models can be called through hosted APIs, and several closed models can run in your chosen cloud region. So I decide each one from constraints, not ideology.\n\nData control comes first. For example, if a bank's contract requires on-premise processing or a specific region, that rule can settle the architecture before cost is discussed. Then comes capability, measured on your own evaluation set, and then economics. Self-hosting has fixed costs in GPUs and on-call work, while an API is mostly usage cost, and the break-even point is usually higher than teams expect. So I start with the simplest option that meets the security and quality needs, and revisit it as volume or regulation changes.",
      "points": [
        "Start with residency, security and contractual constraints.",
        "Open-weight is not the same as self-hosted: open models run behind hosted APIs, closed models can run in-region via cloud providers.",
        "Measure capability on your own tasks, not public benchmark headlines.",
        "Compare self-hosting fixed cost with API variable cost at real utilisation.",
        "Include latency, rate limits, upgrade control and operational skill.",
        "Use the simplest option that meets the requirements, then revisit with data."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A two by two grid showing that open-weight and closed models can each be either self-hosted or used through a hosted API.",
        "caption": "**Who holds the weights and who runs the servers are separate choices.** Decide both from residency, security and contract constraints, then measure.",
        "xLabel": "Who runs it",
        "yLabel": "Model weights",
        "cols": [
          "Self-hosted",
          "Hosted API"
        ],
        "rows": [
          "Open-weight",
          "Closed"
        ],
        "cells": [
          [
            {
              "label": "Your own GPUs",
              "note": "fixed cost, full control",
              "accent": "warn"
            },
            {
              "label": "Open model via API",
              "note": "pay per token"
            }
          ],
          [
            {
              "label": "Rarely possible",
              "note": "weights not released",
              "accent": "muted"
            },
            {
              "label": "Provider or cloud region",
              "note": "in-region via hyperscaler",
              "accent": "accent"
            }
          ]
        ]
      },
      "say": "Model and hosting are separate choices, because open-weight is about who holds the weights and self-hosting is about who runs the servers. Open models are available through hosted APIs, and several closed models can run in your own cloud region through a hyperscaler. So I decide each from constraints, not ideology. Residency, security and contract rules come first. If a bank's contract requires on-premise or a specific region, that settles the architecture before cost comes up. Then capability, measured on our own eval set rather than benchmark headlines. A frontier model may win on hard reasoning, while an open model with retrieval is often good enough for a narrow task. Then economics. Self-hosting is fixed cost in GPUs, capacity engineering and on-call, while an API is mostly usage cost, and the break-even is usually higher than teams expect. Latency, rate limits, upgrade control and our team's GPU skills count too. I start with the simplest option that meets the requirements and revisit as volume grows.",
      "numbers": "Self-hosting is fixed GPU and engineering cost; API is per token. Compute your own break-even volume - it is usually higher than teams expect.",
      "wrong": "Assuming self-hosting is automatically cheaper or more secure. Either can be wrong if utilisation is low, operations are weak, or the surrounding data and logging path is not controlled.",
      "follow": "Your client insists on on-premise but wants frontier-model quality. What do you tell them?",
      "followAnswer": "I tell them the two goals pull against each other, so we need to pin down what on-premise really requires. If the concern is residency or no third-party access to data, some frontier models can run in a dedicated cloud region or a private deployment, which may satisfy the contract. If it truly means their own hardware, that means open-weight models, and I would show on their own eval set how close the best open model with retrieval gets, so they decide on evidence."
    },
    {
      "id": "llm-13",
      "q": "What is speculative decoding, and why is it effectively free latency?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "inference",
        "latency",
        "serving"
      ],
      "why": "A serving optimisation that sounds like it should cost quality and does not. Explaining why is the test.",
      "quick": [
        "A small model guesses the next few words.",
        "The big model checks them all in one pass.",
        "Checking several costs about the same as writing one.",
        "The output is exactly what the big model would give.",
        "Gains shrink when the GPU is already busy."
      ],
      "simple": "Speculative decoding is a way to make generation faster without changing the answer. A small draft model guesses the next few tokens, the big model checks them all in one go, and you keep the ones it agrees with.\n\nIt works because decoding is slow for a specific reason. Each pass must read all the weights from memory, so the GPU mostly moves data rather than doing maths, and checking five proposed tokens in one pass costs about the same as generating one. For example, the draft might propose \"the cat sat on the\", the big model verifies all five at once, and at the first mismatch it supplies its own token.\n\nThe output follows exactly the same distribution as the large model alone, so quality is untouched. Speedups of around 2-3x are reported on predictable text like code, but the gain shrinks at large batch sizes, and you do run two models.",
      "points": [
        "Decoding is memory-bandwidth bound, not compute bound.",
        "Verifying k tokens in one pass costs about the same as generating one.",
        "The acceptance test preserves the target model's exact distribution.",
        "Gain depends on draft-model acceptance rate.",
        "Costs extra memory and compute; gains shrink at high batch sizes, and a mismatched draft can be slower.",
        "Draft options: a small model, extra heads (Medusa, EAGLE), or n-gram / prompt-lookup when output copies the input."
      ],
      "diagram": {
        "alt": "A small draft model proposes several tokens, the large target model verifies them all in one pass, keeps the matching prefix and rejects from the first mismatch, then drafting repeats.",
        "caption": "**Draft guesses, target checks all at once.** Verifying five tokens costs about one decode step, and the acceptance rule keeps the big model's exact output.",
        "rows": [
          [
            {
              "id": "d",
              "label": "Draft model",
              "note": "proposes k tokens"
            }
          ],
          [
            {
              "id": "t",
              "label": "Target model",
              "note": "verifies all in one pass",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "k",
              "label": "Keep matching prefix",
              "accent": "accent",
              "note": "then draft the next k"
            },
            {
              "id": "x",
              "label": "Reject from mismatch",
              "note": "target picks that token",
              "accent": "bad"
            }
          ]
        ],
        "edges": [
          {
            "from": "d",
            "to": "t"
          },
          {
            "from": "t",
            "to": "k",
            "label": "agrees"
          },
          {
            "from": "t",
            "to": "x",
            "label": "differs"
          }
        ]
      },
      "say": "A small draft model guesses the next few tokens, the big model checks them all in one pass, and you keep what it agrees with. It works because decoding is limited by memory bandwidth, not arithmetic. Every step reads all the weights, so checking five tokens at once costs roughly the same as generating one. The big model keeps the matching prefix and, at the first mismatch, supplies its own token, so each pass still produces at least one token. The acceptance rule is built so the output follows exactly the big model's distribution. It's not an approximation. The gain depends on how often the draft agrees. On predictable text like code or structured output, reported speedups are around two to three times at low batch sizes. It isn't free, though. You run two models, and at large batch sizes, where the GPU is already busy, the gain shrinks or disappears. So I'd reach for it when latency matters and traffic is light.",
      "numbers": "Reported speedups are often around 2–3× at low batch sizes on predictable text like code; less on surprising content or under heavy batching. The draft model must be small enough that proposing is cheap relative to verifying.",
      "wrong": "'It trades a little accuracy for speed.' It does not - the acceptance test preserves the exact output distribution, and that is the whole reason it is interesting.",
      "follow": "Your acceptance rate is 30%. Is speculative decoding still helping?",
      "followAnswer": "Probably not much, and it may be making things slower. At that acceptance rate most verification passes keep few draft tokens, so I pay to run the draft model and still get little more than one token per pass. I measure end-to-end tokens per second with it on and off rather than guess. If it is not winning, I propose fewer tokens per step, try a draft better matched to our domain or distilled from the target, or switch it off."
    },
    {
      "id": "llm-17",
      "q": "What changes when you move from a text-only model to a multimodal model?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "multimodal",
        "vision",
        "audio",
        "llm",
        "production"
      ],
      "why": "Senior AI roles increasingly expect text, image, audio or video systems rather than text-only chat.",
      "quick": [
        "Inputs need preparing, like image checks and cutting up video.",
        "New errors appear, like misread numbers or noisy audio.",
        "Build separate test sets for each input type.",
        "Measure cost and speed per input type from real traffic.",
        "Photos and voices can expose faces, IDs and secrets."
      ],
      "simple": "A multimodal model can take images, audio or video as well as text, but moving to one changes much more than the prompt. Input handling, failure modes, cost and privacy all shift.\n\nEach input type needs its own preparation, such as size checks for images or splitting long video. The failures are different too. OCR can miss a number, a chart can be misread, and a model may describe an image confidently without seeing the detail that mattered. For example, a model reading scanned invoices might get everything right except one digit in the total, which is the one number finance needs. So you build evaluation sets per modality instead of assuming text accuracy carries over.\n\nProviders also bill each input type in its own units, so you measure real cost from real traffic. And photos, voices and screenshots can contain faces or IDs, so privacy rules must cover every modality.",
      "points": [
        "Validate and preprocess each input type.",
        "Expect modality-specific errors such as OCR, visual grounding and noisy speech.",
        "Evaluate text, image, audio and video cases separately.",
        "Measure modality-specific latency and cost from real inputs.",
        "Extend privacy, retention and redaction controls to non-text data."
      ],
      "say": "The prompt is the smallest change. Input handling, failure modes, cost and privacy all shift too. Inputs need preparing per type. Images need size and quality checks, audio needs duration and format handling, and long video usually has to be sampled or split into segments before it reaches the model. The failures are different in kind. OCR can miss one digit on an invoice total, a chart can be misread, background noise can change a transcript, and the model may describe an image confidently without seeing the detail that mattered. So I build evaluation sets per modality instead of assuming text accuracy carries over. Cost and latency change because providers bill images, audio and video in their own units, and I measure those from real traffic rather than using one universal token estimate. Privacy widens as well. Photos, voices and screenshots can expose faces, IDs, locations and secrets that were never in the typed question, so access control and retention rules have to cover every modality, not just text.",
      "numbers": "Do not convert every image or second of audio into one universal token estimate. Providers account for modalities differently, so record real request units, latency and cost by input type.",
      "wrong": "Treating multimodal as the same chat pipeline with a file attached. The preprocessing, evaluation, privacy and performance failure modes are different.",
      "follow": "A user uploads a blurry photo of a medical form. How do you decide whether to answer or ask for a better image?",
      "followAnswer": "I use a quality gate before the model answers anything that matters. First, cheap checks for blur and resolution, then I ask the model to list which fields it could read and flag any it is unsure of. If a field that matters, like a dosage or a date of birth, is unclear, I ask for a better photo and say which part was unreadable. With medical content I would rather ask again than guess, and never fill a gap with a plausible value."
    }
  ]
};
