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
      "simple": "A large language model (LLM) is a program that has read a vast amount of text and learned to predict what comes next. Give it the start of a sentence and it guesses the next word. Then the next. Then the next. Do that very well, and you get something that can answer questions, summarise, translate and write code.\n\nThe \"large\" refers to its size. It has billions of adjustable numbers, called parameters, that were tuned during training.\n\nFor a non-technical listener, a good picture is a very well-read autocomplete. It has seen so much writing that its guesses are usually useful. But it is guessing, not looking things up. That is why it can sound confident and still be wrong.\n\n**Generative vs traditional ML.** Most classic machine learning is discriminative: it picks a label or a number from an input. Is this email spam? What will this house sell for? A generative model creates new content, such as text, images or code. It learns what the data itself looks like, so it can produce more of it.\n\nThe practical difference: a classifier's output is easy to check against the right label. A generative output is open-ended. It is harder to evaluate, and it needs grounding and guardrails.",
      "points": [
        "An LLM predicts the next token, one at a time, from patterns learned on huge amounts of text.",
        "\"Large\" = billions of parameters (the learned numbers).",
        "Plain-words version: a very well-read autocomplete that guesses rather than looks up.",
        "**Discriminative** models predict a label or number from an input (spam or not).",
        "**Generative** models produce new content (text, images, code) by learning what the data looks like.",
        "Open-ended output is harder to evaluate - that is why evals and guardrails matter."
      ],
      "say": "An LLM is a model trained on a huge amount of text to predict the next token, one at a time. At the scale of billions of parameters, that one skill lets it answer questions, summarise, translate and write code. The key caveat is that it generates plausible text rather than looking facts up, so it can be confidently wrong. Traditional discriminative models predict a label from an input; generative models produce new content, which is harder to evaluate.",
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
      "simple": "A token is a small chunk of text. It is the unit a model actually reads and writes. A tokeniser (the tool that splits text into chunks) decides where the cuts go, and each model family has its own.\n\nCommon English words are often one token. Names, code, numbers, rare words and many non-Latin scripts split into several. So the same sentence can cost very different amounts in two languages, or on two models.\n\nWhy care? Three things are counted in tokens: the context limit, the bill and the work the model does. More tokens means a higher cost and a slower response, especially for long prompts.\n\nThat is why rules like \"one token is about three quarters of a word\" are only a rough guide for English. For a real budget, take a sample of real production text in every language you serve. Run it through the exact tokeniser, or read the provider's usage numbers. Then cut the biggest sources first. Retrieved context and repeated tool definitions usually matter far more than a few words in the user's question.",
      "points": [
        "A token is a model-specific chunk of text, not a word.",
        "Names, code, numbers and different scripts can tokenise very differently.",
        "Context limits and usage billing are commonly expressed in tokens.",
        "Measure representative languages with the exact model/tokeniser.",
        "Optimise the largest token sources first, often retrieved context or repeated tool definitions."
      ],
      "say": "A token is the chunk of text a model's tokenizer produces, not a word, and the split changes with the model, language and content. That matters because context limits, usage cost and processing time are tied to token counts. I do not budget from a fixed English rule of thumb. I run representative production text through the exact tokenizer or provider usage data, including every important language, then optimise the largest token sources first.",
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
      "simple": "The context window is the maximum number of tokens the model can handle in one call. Everything shares it: the system prompt, the conversation so far, retrieved documents, tool definitions, and the answer the model is about to write.\n\nWhat happens when you go over? On most provider APIs the request simply fails with an error. Some APIs and frameworks instead cut or summarise older content for you. That is quieter, and more dangerous, because content disappears without a warning. Know which one your stack does.\n\nSo real systems manage the budget on purpose. Reserve room for the output first. A model that runs out of space mid-answer returns a cut-off response, and cut-off JSON breaks your parser. Count tokens before you send. Trim in a fixed order: usually the oldest turns first, then the lowest-ranked documents. Never just chop the end, or you may lose your own instructions.\n\nThe senior point: a bigger window is not free. You pay for every token in it, and many models get worse at using facts buried in the middle of a long context.",
      "points": [
        "Everything shares one budget: system prompt, history, documents, tools, output.",
        "On most APIs exceeding it is an error; auto-truncation, where offered, drops content silently.",
        "Reserve output tokens first - truncated output breaks downstream parsing.",
        "Trim in a defined order; never cut blindly from the end.",
        "Longer context costs more and can weaken recall of facts buried mid-context."
      ],
      "say": "It is the total tokens in one call - system prompt, history, retrieved documents, tool definitions and the answer, all sharing one budget. On most APIs exceeding it is a hard error, not a truncation, so I count before sending, reserve space for the output first, and trim in a defined order: oldest turns, then lowest-ranked documents. And I do not treat a bigger window as free - cost scales with it, and mid-context recall can degrade.",
      "numbers": "Reserve output tokens explicitly - often 1–2k for a plain chat answer, far more for reasoning models, whose thinking tokens usually count against the output budget. A model that hits the limit mid-JSON returns invalid JSON, and that is a production incident, not a warning.",
      "wrong": "\"The model just forgets the oldest part.\" That is your framework silently trimming, not the model. Not knowing which is happening means you cannot debug why an instruction stopped being followed.",
      "follow": "Your system prompt stopped being followed after twenty turns. Why?",
      "followAnswer": "Usually one of two things. Either the framework is trimming history and the system prompt, or an early instruction, got cut. Or the prompt is still there but diluted by thousands of tokens of conversation. I check the exact payload in the trace first. The fixes are to pin the system prompt so it is never trimmed, summarise old turns, and restate key rules near the latest message if evals show it helps."
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
      "simple": "At each step the model does not choose a word. It produces a probability distribution over every possible next token. Then something picks one from that distribution - and that picking is the sampling step.\n\nTemperature controls how flat that distribution is made before picking. Low temperature sharpens it, so the most likely token nearly always wins and output becomes repeatable. High temperature flattens it, so less likely tokens get a real chance, and output varies.\n\nTop-p, or nucleus sampling, is a different knob: keep only the smallest set of tokens whose probabilities add up to p, and sample from those. It cuts the long tail of nonsense while still allowing variety.\n\nWorth knowing for a senior round: temperature zero is not a guarantee of identical output. Floating-point non-determinism on GPUs, batching effects and provider-side model updates all cause drift. So design for variation, do not assume it away.\n\nFor exactly what each knob does to the distribution, see llm-11; this card is about why outputs vary.",
      "points": [
        "Generation is sampling from a distribution, one token at a time.",
        "Temperature flattens or sharpens that distribution before sampling.",
        "Top-p keeps the smallest set of tokens summing to p, then samples.",
        "Temperature 0 is near-deterministic, not guaranteed deterministic.",
        "Extraction and classification: low temperature. Creative drafting: higher."
      ],
      "say": "The model outputs a probability distribution over the next token, and sampling picks from it. Temperature sharpens or flattens that distribution - low means the top token nearly always wins, high gives less likely tokens a real chance. Top-p keeps only the smallest set summing to p. I use low temperature for extraction and classification. And temperature zero is near-deterministic, not guaranteed, so I design for variation.",
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
      "simple": "**Short version: temperature reshapes the odds of every possible next token; top-k and top-p cut off the unlikely tail. Tune one, not several.**\n\nAt every step the model gives a raw score, called a logit, to every token in its vocabulary. Softmax turns those scores into probabilities that add up to 1. These three settings change that distribution before a token is picked.\n\n**Temperature** divides the logits before softmax. Below 1, the gaps between scores widen, so the top token dominates. Above 1, the gaps shrink, so unlikely tokens get a real chance. Temperature 0 means always take the top token, which is called greedy decoding.\n\n**Top-k** keeps only the k most likely tokens and throws the rest away. It is blunt: k = 50 keeps fifty candidates whether the model was sure or confused.\n\n**Top-p**, or nucleus sampling, keeps the smallest set of tokens whose probabilities add up to p. When the model is confident, that may be two tokens. When it is unsure, it may be forty. That adaptivity is why top-p largely replaced top-k.\n\nThe senior point: temperature reshapes and top-p cuts, so changing both makes behaviour hard to reason about. Tune one and leave the other at its default. Some newer APIs reject requests that set both, and many reasoning models accept neither.\n\nFor extraction and other structured work, keep temperature at or near 0.",
      "points": [
        "Temperature rescales logits before softmax - sharpens or flattens.",
        "Top-k keeps a fixed number of candidates regardless of confidence.",
        "Top-p keeps the smallest set reaching cumulative probability p.",
        "Top-p is adaptive to model confidence, which is why it won.",
        "Tune one, not both - they interact confusingly."
      ],
      "say": "Temperature rescales the logits before softmax, so below one it sharpens the distribution and above one it flattens it. Top-k keeps a fixed number of candidates regardless of how confident the model was. Top-p keeps the smallest set whose cumulative probability reaches p, so it adapts to confidence - which is why it largely replaced top-k. They do different jobs, so I tune one and leave the other at default.",
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
      "simple": "Training happens in stages. The first stage gives the model knowledge. The later stages teach it how to behave.\n\n**1. Pre-training.** The model reads a huge amount of text, often trillions of tokens of web pages, books and code. Its only job is to predict the next token. Doing that well forces it to learn grammar, facts and some reasoning. This is by far the most expensive stage. The result is a base model: knowledgeable, but it just continues text.\n\n**2. Supervised fine-tuning (SFT).** The model is trained on a much smaller set of good examples: an instruction plus a high-quality answer. Now it learns to answer instead of ramble.\n\n**3. Preference tuning.** People, or a model, compare two answers and pick the better one. RLHF (reinforcement learning from human feedback) trains a reward model on those choices and then optimises against it. DPO (direct preference optimisation) learns straight from the pairs, with no separate reward model. This shapes helpfulness, tone and refusals.\n\n**4. Reinforcement learning on checkable tasks.** Newer reasoning models add this stage. The model tries maths or coding problems, and an automatic checker rewards correct answers. This is where long step-by-step thinking comes from.\n\nThe practical lesson: knowledge comes mostly from pre-training, and behaviour from the later stages. So fine-tuning is good at changing format and style, and poor at adding new facts. For facts, use retrieval. (SFT vs DPO vs RLHF in depth is ft-03.)",
      "points": [
        "**Pre-training** - next-token prediction on trillions of tokens. Gives knowledge. Most of the compute.",
        "**SFT** - instruction and answer pairs. Teaches the model to follow requests.",
        "**Preference tuning** - RLHF (reward model + RL) or DPO (learn directly from chosen vs rejected pairs).",
        "**RL with verifiable rewards** - maths and code with automatic checks. Produces reasoning models.",
        "Knowledge comes from pre-training; behaviour from post-training. That is why fine-tuning rarely teaches facts well."
      ],
      "say": "It happens in stages. Pre-training is next-token prediction over trillions of tokens, which gives the model its knowledge and uses most of the compute. That produces a base model. Supervised fine-tuning on instruction and answer pairs teaches it to follow requests. Preference tuning, with RLHF or DPO, shapes helpfulness and refusals. Reasoning models add reinforcement learning on checkable tasks like maths and code. So knowledge comes from pre-training, and behaviour from the later stages.",
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
      "simple": "Because the model is not looking anything up. It writes the most likely next token, again and again, based on patterns from training. Likely and true are different things, and nothing in that objective tells them apart.\n\nSo when the model does not know, it does not feel a gap. It produces the shape of a right answer: a citation that looks like a citation, a section number that looks like a section number. The pattern demands something there, so something appears.\n\nThree things make it worse. Rare or recent facts, where training data was thin. Questions built on a false premise, because the model tends to accept the premise. And pressure to be specific. A confident number looks more plausible than a hedge, and training and benchmarks that score a guess above \"I don't know\" reward that habit.\n\nThis tells you what actually helps. Put the facts in the context. Give the model explicit permission to say it does not know. Check the output against a source. And keep a human on the decisions that matter.",
      "points": [
        "The objective rewards plausibility, not truth. There is no lookup step.",
        "Worse for rare, recent or highly specific facts.",
        "False-premise questions get accepted rather than challenged.",
        "Mitigations: retrieval, explicit permission to refuse, output verification, human review.",
        "It cannot be eliminated, only reduced and detected."
      ],
      "say": "Because the model is predicting a plausible continuation, not retrieving a fact. Nothing in the objective separates plausible from true, and it has no sense of a gap in its knowledge - so it produces something shaped like a correct answer. It is worst on rare or recent facts and on false-premise questions. So I give it the facts in context, allow it to refuse, verify the output against the source, and keep a human on decisions that matter.",
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
      "simple": "A reasoning model is trained to think before it answers. It first writes a long internal working-out, often called reasoning or thinking tokens. Then it writes the final answer. Examples include OpenAI's o-series and GPT-5 reasoning models, Claude with extended thinking, Gemini's thinking models and DeepSeek-R1.\n\n**Test-time compute** means spending more computation when the question is asked, not during training. More thinking usually gives better answers on hard problems. It is like giving a student scratch paper and more time.\n\nHow did they learn this? Mostly through reinforcement learning on tasks with a checkable answer, such as maths and code. The model is rewarded when the final answer is correct, so it learns to plan, check and backtrack.\n\nThe trade-off is cost and latency. Thinking tokens are usually billed as output tokens, and they can be many times longer than the visible answer. The user also waits longer before the first visible word.\n\nSo use one when the task is genuinely multi-step: complex analysis, tricky code, planning an agent's next move, or maths. Skip it for simple extraction, classification or short chat. There a standard model is faster, cheaper and just as good. Most APIs let you set a reasoning effort or thinking budget, so tune that on your eval set. (Prompting reasoning models is pr-03; choosing one for RAG is rag-50.)",
      "points": [
        "Reasoning model = trained to produce internal reasoning tokens before the answer.",
        "Test-time compute = spending more compute at inference, not training, to get a better answer.",
        "Trained mainly with RL on verifiable tasks (maths, code) - rewarded for correct final answers.",
        "Thinking tokens are usually billed as output and add latency before the first visible token.",
        "Control it with the provider's effort or thinking-budget setting; choose the level with evals.",
        "Many reasoning models ignore or reject temperature and top-p."
      ],
      "say": "A reasoning model is trained, mostly with reinforcement learning on checkable tasks like maths and code, to write internal reasoning tokens before it answers. Test-time compute means spending more compute at inference to get a better answer. It clearly helps on multi-step problems - analysis, hard code, planning - but those tokens are billed and add latency. So I use it where evals show a real gain, tune the effort setting, and keep simple extraction on a standard model.",
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
      "simple": "The weakest approach is to ask for JSON in the prompt and parse whatever comes back. It works most of the time, and that is the problem. The failures show up at scale: JSON wrapped in markdown fences, a trailing comma, or a friendly sentence before the opening brace.\n\nBetter is to use what the provider offers. **Structured outputs** (schema-constrained decoding) restrict which tokens the model may emit, so the output matches your JSON schema by construction. Older **JSON mode** only promised valid JSON, not your schema. **Tool calling** gives a typed signature too, but check that strict schema enforcement is on, because on some APIs it is optional. Even strict modes can stop early on a token limit or a refusal.\n\nThen validate anyway, with Pydantic or similar. Valid JSON is not correct JSON. A field can match the schema and still contain nonsense.\n\nFinally, have a fallback path. Retry once with the validation error fed back to the model, then fail gracefully. Never retry forever. A model that fails your schema twice rarely manages it on the fifth attempt.",
      "points": [
        "Prompt-and-parse is the weakest option. It fails at scale, not in testing.",
        "Use schema-constrained structured outputs, or tool calling with strict schemas; plain JSON mode does not enforce your schema.",
        "Validate with Pydantic regardless. Valid is not correct.",
        "Retry once with the error message, then fail gracefully.",
        "Keep schemas flat and simple. Deep nesting raises the failure rate.",
        "Log every parse failure - a rising rate often signals a model, prompt or input change."
      ],
      "say": "I do not rely on asking nicely in the prompt. I use schema-constrained output - the provider's structured outputs or strict tool calling - so the shape is valid by construction. Then I validate with Pydantic anyway, because valid JSON can still be wrong. On failure I retry once with the validation error fed back, then fail gracefully. And I log the parse-failure rate, because a sudden rise often means a model or prompt change.",
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
      "simple": "Not from a leaderboard. Public benchmarks measure general skill on public tasks. Your task is neither.\n\nStart with the hard constraints. Where must the data stay? Can the model run in your own cloud account? Do the contract terms work? Must it be self-hosted? These rules often remove most options before quality is even discussed. Saying that out loud lands well in an enterprise interview.\n\nNext, build a small evaluation set from your own data: around a hundred examples with known good answers. Shortlist three or four models and run all of them on it. Compare quality, cost per request and p95 latency together, not one at a time. (p95 latency is the time within which 95% of requests finish.)\n\nOften a cheap model is good enough for most traffic. Then you route only the hard cases to the expensive one.\n\nFinally, plan for change. New models ship every few months. Put model access behind one interface so switching is a config change. Keep the evaluation set so you can re-run it the day a new model lands.",
      "points": [
        "Hard constraints first: residency, tenancy, contract, self-hosting.",
        "Build a ~100-example evaluation set from your own data to start.",
        "Compare quality, cost per request and p95 latency together, not separately.",
        "Route by difficulty - cheap model for most traffic, expensive for the tail.",
        "Abstract the provider so switching is configuration.",
        "Keep the eval set. Re-run it when a new model ships."
      ],
      "say": "Constraints first - data residency, whether it runs in our tenant, contract terms - because those eliminate most options before quality comes up. Then I build a hundred-example evaluation set from our own data and run the shortlist on it, comparing quality, cost per request and p95 latency together. Usually a cheap model handles most traffic and I route hard cases to the expensive one. And I keep the eval set for the next model.",
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
      "simple": "A **base model** is trained only to predict the next token over a huge amount of text. It is not trying to help you. Ask it a question and it may reply with more questions, because that is what a list of questions looks like in its training data.\n\nAn **instruct model** is a base model trained further on instruction and answer pairs. It has learned that a request should be followed by an answer.\n\nA **chat model** adds turns and roles, such as system, user and assistant. It is usually tuned further on human preferences, with RLHF or DPO, so it is helpful and refuses harmful requests.\n\nIn practice, most open-weight releases ship a base checkpoint and an \"Instruct\" checkpoint, and the Instruct one is the chat model. Reasoning models add one more stage: reinforcement learning on checkable tasks such as maths and code. Almost everything you call through an API is a chat model.\n\nWhy it matters: the weights are different, not just the prompt template. That explains why two versions of the \"same\" model behave so differently. It is also why every fine-tuning plan starts with one question: fine-tune from which checkpoint? (The full training pipeline is llm-18.)",
      "points": [
        "Base - next-token prediction only. Not helpful by default.",
        "Instruct - supervised fine-tuning on instruction-response pairs.",
        "Chat - role structure plus preference alignment, RLHF or DPO.",
        "The API models you use are almost always chat models.",
        "Task fine-tuning (e.g. LoRA) usually starts from the instruct checkpoint; continued pre-training or a custom chat format may start from base."
      ],
      "say": "A base model only predicts the next token, so it does not follow instructions - it continues text. An instruct model is that base model fine-tuned on instruction and response pairs so it answers rather than continues. A chat model adds role structure and preference alignment with RLHF or DPO. What we call through APIs is almost always the chat variant, and task fine-tuning usually starts from the instruct checkpoint, not the base.",
      "numbers": "No number applies. This is a training-pipeline question.",
      "wrong": "\"They are the same model with a different prompt template.\" The template differs, but so do the weights - different training stages produced them.",
      "follow": "Where does RLHF fit, and what is DPO doing differently?"
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
      "simple": "The system message sets the standing behaviour: role, rules, tone, output format. The user message is the request for this turn. Chat models were trained to weight the system message more heavily, so instructions there are followed more consistently.\n\nMore heavily is not absolutely. A long conversation can dilute it, and a user message that argues with it will sometimes win. That is why prompt injection works at all.\n\nSo the rule for anything that matters: the system prompt is guidance, not a security control. Access rules, spending limits and permission checks belong in code, in your runtime, where the model cannot argue with them. If the only thing stopping a data leak is a sentence in the system prompt, you do not have a control.",
      "points": [
        "System - standing rules, weighted more heavily by training.",
        "User - this turn's request.",
        "Some APIs now call the top level the developer message and train an explicit instruction hierarchy.",
        "Weighting is a tendency, not a guarantee. Long conversations dilute it.",
        "Never put a security control only in the system prompt.",
        "Anything retrieved or user-supplied is untrusted data, never instructions."
      ],
      "say": "The system message carries standing behaviour - role, rules, format - and chat models were trained to weight it more heavily than a user turn. But more heavily is a tendency, not a guarantee: long conversations dilute it and a determined user turn can override it. So I treat the system prompt as guidance and put anything that is actually a control - permissions, limits - in code where the model cannot argue with it.",
      "numbers": "No number applies. This is a trust-boundary answer.",
      "wrong": "\"The system prompt cannot be overridden.\" It can, routinely - that is how prompt injection works - and the follow-up will ask where your real controls live.",
      "follow": "Show me how a retrieved document could override your system prompt."
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
      "simple": "**Short version: the prompt is read all at once (prefill), then the answer is written one token at a time (decode), with a cache so the model does not re-read the past at every step.**\n\nFirst the text is split into tokens. Then generation runs in two phases that behave very differently. (Why each phase needs different fixes is llm-14; the latency-debugging version is tf-05.)\n\n**Prefill** processes your input. All input tokens go through the model in parallel. That is heavy arithmetic, but it keeps the GPU fully busy, so it is quick for the amount of work. It sets your time to first token.\n\n**Decode** writes the output one token at a time, and each token depends on the one before. So it cannot run in parallel within one request. Its limit is memory bandwidth, the speed of moving data on the GPU, not arithmetic. It sets tokens per second. The loop stops at an end token, a stop sequence or the max-token limit.\n\nThe **KV cache** makes decode workable. It stores the attention keys and values of earlier tokens, so each new token does not recompute the whole sequence. The cost is memory. The cache grows with sequence length and with the number of requests in the batch. That is usually the real limit on how many users one GPU can serve.\n\nThe practical lesson: long input slows the first token; long output slows the total. Different problems, different fixes.",
      "points": [
        "Prefill - input processed in parallel, compute-bound, sets time to first token.",
        "Decode - one token at a time, memory-bandwidth bound, sets tokens per second.",
        "KV cache avoids recomputation; its memory cost limits concurrency.",
        "Long input → slow first token. Long output → slow total. Different fixes.",
        "Continuous batching, as in vLLM, is what keeps the GPU busy across requests."
      ],
      "say": "Prefill processes the whole input in parallel - compute-bound, and it sets time to first token. Decode generates one token at a time, each depending on the previous, so it is memory-bandwidth bound and sets tokens per second. The KV cache stops us recomputing attention over previous tokens, but its memory footprint is usually what limits concurrency. So long input hurts first-token latency and long output hurts total time.",
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
      "simple": "**Short version: reading the prompt and writing the answer are different kinds of work. One is limited by GPU arithmetic, the other by memory speed, so you speed them up in different ways.**\n\n**Prefill** processes the whole prompt at once. All its tokens are already known, so they can be computed in parallel. The GPU runs large matrix multiplications and is compute-bound, meaning arithmetic is the limit. Prefill produces the first output token and fills the KV cache.\n\n**Decode** writes the rest one token at a time. Each step needs the previous token, so there is no parallelism within one sequence. For every single token, the GPU reads all the model weights plus the KV cache. That makes decode memory-bandwidth-bound: the arithmetic units mostly wait for data.\n\nThat one difference explains a lot.\n\nTime to first token grows with prompt length. Speed per output token depends mostly on model size, and slows only gently as the context, and so the KV cache, gets longer.\n\nBatching helps decode a lot. The weights are read once for many requests, so the cost is shared. Prefill is already busy, so batching helps it less.\n\nContinuous batching swaps new requests in as old ones finish, so the GPU stays full.\n\nPrompt caching skips prefill for a repeated prefix.\n\nAnd some large deployments run prefill and decode on separate GPU pools, because the two phases want different things from the hardware.",
      "points": [
        "Prefill: whole prompt in parallel, compute-bound, sets TTFT.",
        "Decode: one token at a time, memory-bandwidth-bound.",
        "Batching helps decode far more than prefill.",
        "Long prompts hurt TTFT; long outputs hurt total time.",
        "Prompt caching works by skipping prefill for a cached prefix."
      ],
      "say": "Prefill processes the whole prompt in parallel and is compute-bound - it sets time to first token and scales with prompt length. Decode generates one token at a time, reading all the weights per token, so it is memory-bandwidth-bound and the compute units sit idle. That is why batching helps decode enormously but prefill much less, why long prompts hurt TTFT while long outputs hurt total time, and why prompt caching pays off.",
      "numbers": "Prefill cost scales with input length; decode cost scales mainly with output length, and each decode step gets a little slower as the KV cache grows. If TTFT is your problem, look at prompt size, queueing and caching, not at the model's tokens per second.",
      "wrong": "Treating generation as one uniform process. It leaves you unable to explain why a long prompt and a long answer degrade different metrics.",
      "follow": "Your TTFT is fine but total response time is bad. Which phase, and what do you do?"
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
      "simple": "**Short version: if many requests start with exactly the same text, the provider can reuse the work already done on that opening part. So put the parts that never change first.**\n\nWhen a model reads a prompt, it computes internal state for it (the KV cache). Providers can keep that state for a prompt's opening section, called the prefix. If your next request starts with exactly the same tokens, that part skips prefill. You pay much less for those input tokens, and the first token arrives sooner.\n\nThe design rule follows from the mechanism. It is a prefix match, and it must be exact. The cache breaks at the first token that differs, and everything after it is computed fresh.\n\nSo order the prompt static first, variable last:\n\n    [ system prompt        ]  stable\n    [ tool definitions     ]  stable\n    [ few-shot examples    ]  stable\n    [ retrieved documents  ]  varies\n    [ conversation history ]  grows\n    [ user question        ]  varies\n\nThe most common mistake is a timestamp or user ID at the top of the system prompt. It silently breaks the cache on every request.\n\nIt pays most in agents, which resend the same system prompt and tools on every step, and in long multi-turn chats.\n\nDetails to know. Caches expire, often after a few minutes, so the benefit depends on traffic. Some providers cache automatically; others need explicit cache markers. There is a minimum prefix length. Some charge extra to write the cache. So measure the hit rate rather than assuming it.",
      "points": [
        "Caches an exact token prefix; it breaks at the first difference.",
        "Order static content first, variable content last.",
        "A timestamp or user id at the top destroys every cache hit.",
        "Highest payoff in agent loops - tool definitions resent each step.",
        "Short TTL and a minimum length; measure the hit rate."
      ],
      "say": "The provider caches the computed prefix, so an identical opening to a prompt skips prefill and costs much less. Because it is an exact prefix match that breaks at the first differing token, I order the prompt static-first - system prompt, tools, few-shot examples - then retrieved context and the question last. Putting a timestamp at the top destroys every hit. It pays most in agent loops where tool definitions are resent every step.",
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
      "simple": "**Short version: store each weight in fewer bits so the model needs less GPU memory. 8-bit usually costs little quality; 4-bit needs testing on your own tasks.**\n\nModel weights are usually stored as 16-bit numbers (FP16 or BF16), which is 2 bytes each. Quantisation stores them in fewer bits, such as 8 or 4. The model shrinks roughly in proportion.\n\nThe arithmetic is why it matters. A 70-billion-parameter model at 16 bits needs about 140 GB just for weights. That means at least two 80 GB GPUs once you leave room for the KV cache. At 4 bits it is about 35 GB plus a little overhead, and it fits on one. That is the gap between a two-GPU bill and a one-GPU bill.\n\nHow it works: a group of weights shares a scale factor, and each weight is rounded to a small number on that scale. Smaller groups keep more accuracy but add a little overhead.\n\nWhat it costs. 8-bit (INT8, or FP8 on H100-class and newer GPUs) is usually close to free, and FP8 is a common serving default. 4-bit (for example GPTQ or AWQ, GGUF files for local use, or FP4 formats on the newest GPUs) is where judgement starts. It is often fine, but hard reasoning, long context and code degrade first. Below 4 bits, the loss becomes clear.\n\nMost teams use post-training quantisation, applied to a finished model. Quantisation-aware training keeps more quality but needs a training run.\n\nThe honest framing: validate on your own eval set, not a benchmark table.",
      "points": [
        "Fewer bits per weight - memory shrinks roughly proportionally.",
        "70B at FP16 is ~140 GB; at 4-bit roughly 35 GB plus overhead - one GPU instead of two.",
        "8-bit (INT8/FP8) is usually near-free; 4-bit is usually acceptable with real edge cases.",
        "Common 4-bit methods: GPTQ, AWQ, GGUF (llama.cpp); FP4 formats on the newest GPUs.",
        "Reasoning, long context and code degrade first.",
        "Validate on your own eval set, not a published benchmark."
      ],
      "say": "Quantisation stores weights in fewer bits, so memory shrinks roughly proportionally - a 70B model goes from about 140 GB at FP16 to around 35 GB at INT4, which is one GPU instead of two. Eight-bit usually costs little quality and is a common default. INT4 is usually acceptable but degrades first on reasoning, long context and code. I validate on my own eval set rather than trusting a benchmark table.",
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
      "simple": "This happens. And the first thing the panel is really asking is: would you have noticed?\n\nYou notice only if three things are in place. You pin an exact model version, instead of a floating alias the provider can repoint. You log that version on every request. And you run your evaluation set on a schedule, not only before releases. Without those, your first signal is a user complaint.\n\nThen respond in order. First, confirm the version really changed by comparing logs from before and after. Second, run the evaluation set on the old and new versions to measure what moved and where. Third, if you pinned, roll back to buy time. Pinned snapshots are retired eventually, so rollback buys weeks or months, not forever.\n\nOnly then fix. Work out whether a prompt depended on old quirks, or the new model has a genuine regression. Fix forward, then re-run the evaluation.\n\nPrevention is architectural: pinned versions, a golden set, alerts on quality metrics as well as errors, and a provider interface that makes switching possible.",
      "points": [
        "Pin versions. A floating alias means silent changes you cannot roll back.",
        "Log the exact model version on every request.",
        "Run the golden set on a schedule, not just at release.",
        "Alert on quality drift, not only on errors and latency.",
        "Keep provider access behind an interface so a switch is possible."
      ],
      "say": "First, whether I would notice - which is why I pin model versions, log the exact version per request, and run the golden set on a schedule rather than only at release. Then: compare logs before and after to confirm the change, run the eval set on both versions to quantify what moved, and roll back to the pinned version to buy time. Then decide whether it is a prompt that depended on old behaviour or a genuine regression.",
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
      "simple": "**Short version: \"open-weight\" is about who can hold the weights; \"self-hosted\" is about who runs the servers. They are separate choices, and I decide both from constraints.**\n\nOpen-weight models can also be called through hosted APIs and managed cloud endpoints, and several closed models can be deployed in your chosen cloud region through a hyperscaler. So the model choice and the hosting choice are separate - the self-host-versus-API economics are covered in cl-05.\n\nI decide this from constraints, not ideology.\n\nData control and residency come first. Some financial, healthcare, public-sector or enterprise contracts restrict where prompts, logs or model processing may happen. If that rule requires on-premise or a specific region, it can decide the architecture before cost.\n\nThen capability. A hosted frontier model may be best for a difficult reasoning task; an open-weight model may be more than good enough for a narrow task with retrieval or fine-tuning. Measure on your own evaluation set rather than comparing benchmark headlines.\n\nThen economics. Self-hosting has fixed costs - GPUs, capacity engineering and on-call work - while an API is mostly variable usage cost. There is a break-even point, and it moves with utilisation.\n\nAlso compare latency, availability, rate limits, model-change control and your team's ability to operate GPU serving well.\n\nMy usual path is to start with the simplest option that meets security and quality, instrument usage, and revisit the decision when volume, regulation or control requirements change.",
      "points": [
        "Start with residency, security and contractual constraints.",
        "Open-weight is not the same as self-hosted: open models run behind hosted APIs, closed models can run in-region via cloud providers.",
        "Measure capability on your own tasks, not public benchmark headlines.",
        "Compare self-hosting fixed cost with API variable cost at real utilisation.",
        "Include latency, rate limits, upgrade control and operational skill.",
        "Use the simplest option that meets the requirements, then revisit with data."
      ],
      "say": "I separate the model from the hosting first - open weights can run behind hosted APIs, and closed models can run in-region through a cloud provider. Then residency and contract constraints, which can decide it immediately. Then quality on our own evaluation set. Then economics: self-hosting is fixed GPU and operating cost, while an API is mostly usage cost. I also weigh latency, rate limits, upgrade control and team skill, and start with the simplest option that meets the requirements.",
      "numbers": "Self-hosting is fixed GPU and engineering cost; API is per token. Compute your own break-even volume - it is usually higher than teams expect.",
      "wrong": "Assuming self-hosting is automatically cheaper or more secure. Either can be wrong if utilisation is low, operations are weak, or the surrounding data and logging path is not controlled.",
      "follow": "Your client insists on on-premise but wants frontier-model quality. What do you tell them?"
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
      "simple": "**Short version: a small model guesses the next few tokens, the big model checks them all in one go, and you keep the ones it agrees with. Same answer, less waiting.**\n\nDecoding is slow because it is sequential. Each token needs a full pass through the model, and each pass must read all the model's weights from memory. The GPU spends most of that time moving data, not doing maths.\n\nSpeculative decoding uses that spare capacity. A small, fast draft model proposes several tokens ahead. The large target model then checks all of them in one pass. Checking five tokens at once costs about the same as generating one, because the weights are read once either way.\n\n    draft model:  proposes  ' the cat sat on the'\n    target model: verifies all 5 in one pass\n    -> keeps the matching prefix, rejects from the first mismatch\n\nThe key property: the acceptance rule is designed so the output follows exactly the same probability distribution as the large model alone. It is not an approximation. The large model still decides every token.\n\nThe gain depends on the acceptance rate: how often the draft agrees. It is high on predictable text such as code or structured output, and lower on surprising text. It is not free in compute. You run two models, and at large batch sizes, where the GPU is already busy, the speedup shrinks or disappears. Variants such as Medusa and EAGLE replace the separate draft model with small prediction heads on the target model.",
      "points": [
        "Decoding is memory-bandwidth bound, not compute bound.",
        "Verifying k tokens in one pass costs about the same as generating one.",
        "The acceptance test preserves the target model's exact distribution.",
        "Gain depends on draft-model acceptance rate.",
        "Costs extra memory and compute; gains shrink at high batch sizes, and a mismatched draft can be slower.",
        "Draft options: a small model, extra heads (Medusa, EAGLE), or n-gram / prompt-lookup when output copies the input."
      ],
      "say": "Decoding is bandwidth-bound - you read all the weights to produce one token - so verifying several tokens in one pass costs about the same as generating one. A small draft model proposes tokens ahead and the large model verifies them in a single pass. The acceptance test is constructed so the output distribution is identical to the large model alone, so quality is unchanged rather than approximated. The gain scales with acceptance rate.",
      "numbers": "Reported speedups are often around 2–3× at low batch sizes on predictable text like code; less on surprising content or under heavy batching. The draft model must be small enough that proposing is cheap relative to verifying.",
      "wrong": "'It trades a little accuracy for speed.' It does not - the acceptance test preserves the exact output distribution, and that is the whole reason it is interesting.",
      "follow": "Your acceptance rate is 30%. Is speculative decoding still helping?"
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
      "simple": "A multimodal model can take more than text, but the engineering work also becomes more than prompt writing.\n\nFirst, input preparation changes. Images need size and quality checks, audio needs duration and format handling, and long video usually needs sampling or segmentation before it reaches the model.\n\nSecond, failure modes are different. OCR can miss a number, a chart can be read incorrectly, background noise can change a transcript, and a model may describe an image confidently without seeing the important detail. I create evaluation sets per modality instead of assuming text accuracy transfers.\n\nThird, cost and latency change because image, audio and video inputs have their own billing and processing units. I measure them from real traffic.\n\nFinally, privacy expands: photos, voices and screenshots can contain faces, IDs, locations and secrets that were never present in the typed question. The same access-control and retention rules have to cover every modality.",
      "points": [
        "Validate and preprocess each input type.",
        "Expect modality-specific errors such as OCR, visual grounding and noisy speech.",
        "Evaluate text, image, audio and video cases separately.",
        "Measure modality-specific latency and cost from real inputs.",
        "Extend privacy, retention and redaction controls to non-text data."
      ],
      "say": "Moving to multimodal means the input pipeline, evaluation and privacy model all change. I validate image, audio or video quality and segment large inputs before the model call. I test modality-specific failures such as OCR mistakes, visual grounding errors and noisy speech instead of reusing only text evaluations. I also measure cost and latency per input type, and I treat photos, recordings and screenshots as sensitive data because they can expose identifiers and secrets that typed text never contained.",
      "numbers": "Do not convert every image or second of audio into one universal token estimate. Providers account for modalities differently, so record real request units, latency and cost by input type.",
      "wrong": "Treating multimodal as the same chat pipeline with a file attached. The preprocessing, evaluation, privacy and performance failure modes are different.",
      "follow": "A user uploads a blurry photo of a medical form. How do you decide whether to answer or ask for a better image?"
    }
  ]
};
