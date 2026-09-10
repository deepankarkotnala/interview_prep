/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["01-llm-foundations"] = {
  "lede": "These are the questions that open a technical round. They look basic, which is exactly why they are dangerous - a vague answer here sets the tone for the next forty minutes. The bar for a senior candidate is not the definition, it is the consequence.",
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
      "id": "llm-01",
      "q": "What is a token, and why should you care?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "tokens",
        "basics",
        "cost"
      ],
      "why": "Whether you connect a definition to the things it controls - cost, limits and latency.",
      "simple": "A model reads tokens, not words. A token is a chunk produced by that model family's tokeniser, and the split depends on the text. Common words may be one token while names, code, numbers, uncommon words or some scripts can split into several.\n\nThat is why I avoid universal rules such as 'one token equals three quarters of a word' when estimating a real system. They can be a rough intuition for some English text, but they are not a contract and they do not transfer cleanly across languages or models.\n\nTokens matter because context limits, input/output usage and much of inference cost are measured from them. More tokens also increase processing work, especially for long prompts.\n\nSo for budgeting I take representative production text in every important language and format, run it through the exact tokenizer or provider usage counter, and measure the actual distribution. When reducing cost, retrieved context and repeated tool definitions are usually better places to look than shaving a few words from the user's question.",
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
      "follow": "Your product serves Hindi and English. What does that do to your cost model?"
    },
    {
      "id": "llm-02",
      "q": "What is the context window, and what happens when you exceed it?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "context",
        "basics",
        "limits"
      ],
      "why": "Whether you have handled the failure or only read the number on a pricing page.",
      "simple": "The context window is the total tokens the model can look at in one call - your system prompt, the conversation, retrieved documents, the tool definitions, and the answer it is about to write. All of it shares one budget.\n\nExceed it and you get an error, not a graceful truncation. The request fails.\n\nSo real systems manage the budget actively. Reserve space for the output first, because a model that runs out mid-answer produces a truncated response that then breaks your JSON parser. Count tokens before sending. Trim in a defined order - usually oldest conversation turns first, then lower-ranked documents - rather than cutting from the end and losing your own instructions.\n\nThe senior addition: a bigger window is not free. You pay for every token in it, and accuracy on facts buried in the middle of a long context is measurably worse than at the ends.",
      "points": [
        "Everything shares one budget: system prompt, history, documents, tools, output.",
        "Exceeding it is an error, not a truncation.",
        "Reserve output tokens first - truncated output breaks downstream parsing.",
        "Trim in a defined order; never cut blindly from the end.",
        "Longer context costs more and degrades middle-of-context recall."
      ],
      "say": "It is the total tokens in one call - system prompt, history, retrieved documents, tool definitions and the answer, all sharing one budget. Exceeding it is a hard error, not a truncation, so I count before sending, reserve space for the output first, and trim in a defined order: oldest turns, then lowest-ranked documents. And I do not treat a bigger window as free - cost scales with it, and mid-context recall degrades.",
      "numbers": "Reserve output tokens explicitly - typically 1–2k for a chat answer. A model that hits the limit mid-JSON returns invalid JSON, and that is a production incident, not a warning.",
      "wrong": "\"The model just forgets the oldest part.\" That is your framework silently trimming, not the model. Not knowing which is happening means you cannot debug why an instruction stopped being followed.",
      "follow": "Your system prompt stopped being followed after twenty turns. Why?"
    },
    {
      "id": "llm-03",
      "q": "Same prompt, two different answers. Explain.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "sampling",
        "temperature",
        "determinism"
      ],
      "why": "Whether you understand generation as sampling, which underpins every reliability question later.",
      "simple": "At each step the model does not choose a word. It produces a probability distribution over every possible next token. Then something picks one from that distribution - and that picking is the sampling step.\n\nTemperature controls how flat that distribution is made before picking. Low temperature sharpens it, so the most likely token nearly always wins and output becomes repeatable. High temperature flattens it, so less likely tokens get a real chance, and output varies.\n\nTop-p, or nucleus sampling, is a different knob: keep only the smallest set of tokens whose probabilities add up to p, and sample from those. It cuts the long tail of nonsense while still allowing variety.\n\nWorth knowing for a senior round: temperature zero is not a guarantee of identical output. Floating-point non-determinism on GPUs, batching effects and provider-side model updates all cause drift. So design for variation, do not assume it away.",
      "points": [
        "Generation is sampling from a distribution, one token at a time.",
        "Temperature flattens or sharpens that distribution before sampling.",
        "Top-p keeps the smallest set of tokens summing to p, then samples.",
        "Temperature 0 is near-deterministic, not guaranteed deterministic.",
        "Extraction and classification: low temperature. Creative drafting: higher."
      ],
      "say": "The model outputs a probability distribution over the next token, and sampling picks from it. Temperature sharpens or flattens that distribution - low means the top token nearly always wins, high gives less likely tokens a real chance. Top-p keeps only the smallest set summing to p. I use low temperature for extraction and classification. And temperature zero is near-deterministic, not guaranteed, so I design for variation.",
      "numbers": "Common settings: 0–0.2 for extraction, classification and structured output; 0.7 for drafting and ideation. Set it explicitly - provider defaults differ.",
      "wrong": "\"Temperature 0 makes it deterministic.\" Nearly true, and the exception is exactly what bites you when the same test starts failing intermittently in CI.",
      "follow": "You need reproducible outputs for an audit. How do you get as close as possible?"
    },
    {
      "id": "llm-04",
      "q": "What is the difference between a base model, an instruct model and a chat model?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "training",
        "models",
        "fine-tuning"
      ],
      "why": "Whether you know how the model you call was produced.",
      "simple": "A base model is trained to do one thing: predict the next token over a huge amount of text. It is not trying to help you. Give it a question and it may continue with more questions, because that is what a list of questions looks like in its training data.\n\nAn instruct model is a base model further trained on instruction-and-response pairs, so it learned that a request should be followed by an answer.\n\nA chat model adds multi-turn structure - roles like system, user and assistant - and is usually aligned further with human preference data, using RLHF or DPO, so its answers are helpful and refuse harmful requests.\n\nAlmost everything you call through an API is a chat model. The reason to know the distinction is that it explains why the same underlying model behaves so differently depending on which version you use, and why a fine-tuning conversation starts with the question \"fine-tune from which checkpoint?\"",
      "points": [
        "Base - next-token prediction only. Not helpful by default.",
        "Instruct - supervised fine-tuning on instruction-response pairs.",
        "Chat - role structure plus preference alignment, RLHF or DPO.",
        "The API models you use are almost always chat models.",
        "Fine-tuning usually starts from the instruct checkpoint, not the base one."
      ],
      "say": "A base model only predicts the next token, so it does not follow instructions - it continues text. An instruct model is that base model fine-tuned on instruction and response pairs so it answers rather than continues. A chat model adds role structure and preference alignment with RLHF or DPO. What we call through APIs is almost always the chat variant, and fine-tuning normally starts from the instruct checkpoint.",
      "numbers": "No number applies. This is a training-pipeline question.",
      "wrong": "\"They are the same model with a different prompt template.\" The template differs, but so do the weights - different training stages produced them.",
      "follow": "Where does RLHF fit, and what is DPO doing differently?"
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
      "tags": [
        "hallucination",
        "reliability",
        "generation"
      ],
      "why": "Whether you can explain the mechanism, which determines whether your mitigations make sense.",
      "simple": "Because the model is not looking anything up. It is generating the most plausible continuation, token by token, from patterns in its training data. Plausible and true are different things, and nothing in the objective separates them.\n\nSo when it does not know, it does not have a gap it can feel. It produces the shape of a correct answer - a citation that looks like a citation, a section number that looks like a section number - because that is what the pattern demands there.\n\nThree things make it worse. Rare or recent facts, where training data was thin. Questions that presuppose something false, because the model tends to accept the premise. And pressure to be specific, since a confident number is more plausible-looking than a hedge.\n\nWhich tells you what actually helps: give it the facts in context, allow it to refuse, verify the output against a source, and keep a human on the decisions that matter.",
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
      "follow": "How do you measure hallucination when you have no ground truth?"
    },
    {
      "id": "llm-06",
      "q": "What actually happens when a model generates a response? Prefill and decode.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "inference",
        "latency",
        "kv-cache",
        "serving"
      ],
      "why": "Separates people who have tuned serving from people who have only called an API.",
      "simple": "Generation has two phases with completely different performance characteristics, and knowing this explains most latency behaviour.\n\nPrefill is processing your input. All the input tokens go through the model in parallel, which is compute-heavy but fast in wall-clock terms because the GPU is fully used. This determines your time to first token.\n\nDecode is generating the output, one token at a time, each depending on the last. It cannot be parallelised within one request, and it is memory-bandwidth bound rather than compute bound. This determines tokens per second.\n\nThe KV cache is what makes decode workable: attention keys and values for previous tokens are stored so each new token does not recompute the whole sequence. The cost is memory, and KV cache memory grows with sequence length and batch size - which is usually the real limit on how many concurrent requests a GPU can serve.\n\nThe practical consequence: long input hurts time to first token; long output hurts total time. They are different problems with different fixes.",
      "points": [
        "Prefill - input processed in parallel, compute-bound, sets time to first token.",
        "Decode - one token at a time, memory-bandwidth bound, sets tokens per second.",
        "KV cache avoids recomputation; its memory cost limits concurrency.",
        "Long input → slow first token. Long output → slow total. Different fixes.",
        "Continuous batching, as in vLLM, is what keeps the GPU busy across requests."
      ],
      "say": "Prefill processes the whole input in parallel - compute-bound, and it sets time to first token. Decode generates one token at a time, each depending on the previous, so it is memory-bandwidth bound and sets tokens per second. The KV cache stops us recomputing attention over previous tokens, but its memory footprint is usually what limits concurrency. So long input hurts first-token latency and long output hurts total time.",
      "numbers": "KV cache memory scales with batch size × sequence length × layers × 2. It is commonly the binding constraint on concurrent requests, ahead of raw compute.",
      "wrong": "\"The model just generates the answer.\" For an API-only role it may pass. For anything touching self-hosting or cost, it does not.",
      "follow": "How does continuous batching change throughput?"
    },
    {
      "id": "llm-07",
      "q": "How do you get reliable structured output?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "structured-output",
        "json",
        "reliability",
        "tools"
      ],
      "why": "Every real system parses model output. This is where demos break in production.",
      "simple": "The weakest approach is asking nicely in the prompt and parsing the result. It works most of the time, which is the problem - the failures arrive at scale, wrapped in markdown fences, with a trailing comma, or with a helpful sentence before the JSON.\n\nBetter is to use what the provider offers. Constrained decoding - JSON mode or a JSON schema - restricts the tokens the model may emit so the output is valid by construction, not by luck. Function or tool calling does the same thing with a typed signature.\n\nThen validate anyway, with Pydantic or an equivalent. Valid JSON is not correct JSON - the schema can be satisfied by a field containing nonsense.\n\nAnd have a fallback path: one retry with the validation error fed back as a message, then a graceful failure. Never an infinite retry, because a model that cannot satisfy your schema usually cannot satisfy it on the fifth attempt either.",
      "points": [
        "Prompt-and-parse is the weakest option. It fails at scale, not in testing.",
        "Use constrained decoding - JSON schema mode or tool calling.",
        "Validate with Pydantic regardless. Valid is not correct.",
        "Retry once with the error message, then fail gracefully.",
        "Keep schemas flat and simple. Deep nesting raises the failure rate.",
        "Log every parse failure - a rising rate usually means a silent model update."
      ],
      "say": "I do not rely on asking nicely in the prompt. I use constrained decoding - JSON schema mode or tool calling - so the output is valid by construction. Then I validate with Pydantic anyway, because valid JSON can still be wrong. On failure I retry once with the validation error fed back, then fail gracefully. And I log parse-failure rate, because a sudden rise usually means the provider updated the model.",
      "numbers": "Prompt-and-parse commonly fails a small but non-zero share of requests. At 10,000 requests a day even 1% is 100 broken responses - which is why constrained decoding is not optional.",
      "wrong": "\"I ask for JSON and it works.\" It works in the notebook. The panel is asking about the tail, and this answer says you have not seen it.",
      "follow": "Your JSON is valid but a field contains a hallucinated ID. Now what?"
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
      "tags": [
        "model-selection",
        "cost",
        "trade-off",
        "evaluation"
      ],
      "why": "Whether you decide with your own evaluation or with a leaderboard.",
      "simple": "Not from a leaderboard. Public benchmarks measure general capability on public tasks; your task is neither.\n\nThe process that works: define the task and build a small evaluation set from your own data, a hundred examples or so with known good answers. Shortlist three or four candidates that meet the hard constraints first - data residency, whether it can run in your cloud tenant, contractual terms, whether it must be self-hosted. Those constraints eliminate most options before quality is even discussed, which is worth saying out loud in an enterprise interview.\n\nThen run all candidates on your set, and compare quality, cost per request and p95 latency together. Usually the cheap model is good enough for most of the traffic and you route only the hard cases to the expensive one.\n\nAnd plan for change. Wrap model access behind an interface so switching is configuration, and keep the evaluation set so you can re-run it when a new model lands.",
      "points": [
        "Hard constraints first: residency, tenancy, contract, self-hosting.",
        "Build a 100-example evaluation set from your own data.",
        "Compare quality, cost per request and p95 latency together, not separately.",
        "Route by difficulty - cheap model for most traffic, expensive for the tail.",
        "Abstract the provider so switching is configuration.",
        "Keep the eval set. Re-run it when a new model ships."
      ],
      "say": "Constraints first - data residency, whether it runs in our tenant, contract terms - because those eliminate most options before quality comes up. Then I build a hundred-example evaluation set from our own data and run the shortlist on it, comparing quality, cost per request and p95 latency together. Usually a cheap model handles most traffic and I route hard cases to the expensive one. And I keep the eval set for the next model.",
      "numbers": "A 100-example evaluation set is usually enough to separate candidates. Cost differences between tiers are often 10–20×, which is why per-request cost belongs in the comparison from the start.",
      "wrong": "\"We use the top model on the leaderboard.\" It says you have not built an evaluation set, which is the actual skill being probed.",
      "follow": "A new model launches next month. What do you do?"
    },
    {
      "id": "llm-09",
      "q": "What is the difference between a system prompt and a user message - and does it matter?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
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
        "Weighting is a tendency, not a guarantee. Long conversations dilute it.",
        "Never put a security control only in the system prompt.",
        "Anything retrieved or user-supplied is untrusted data, never instructions."
      ],
      "say": "The system message carries standing behaviour - role, rules, format - and chat models were trained to weight it more heavily than a user turn. But more heavily is a tendency, not a guarantee: long conversations dilute it and a determined user turn can override it. So I treat the system prompt as guidance and put anything that is actually a control - permissions, limits - in code where the model cannot argue with it.",
      "numbers": "No number applies. This is a trust-boundary answer.",
      "wrong": "\"The system prompt cannot be overridden.\" It can, routinely, and saying otherwise ends the security part of the interview badly.",
      "follow": "Show me how a retrieved document could override your system prompt."
    },
    {
      "id": "llm-10",
      "q": "A model update from the provider changed your outputs. What do you do?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "operations",
        "versioning",
        "evaluation",
        "incident"
      ],
      "why": "A real operational scenario. It tests whether you built for a dependency you do not control.",
      "simple": "This happens, and the first question the panel is really asking is whether you would have noticed.\n\nYou notice if you pin model versions rather than using a floating alias, log the exact model version on every request, and run your evaluation set on a schedule rather than only before releases. Without those, the first signal is a user complaint, which is a much worse place to start.\n\nThe response: confirm the version changed by comparing logs before and after, run the evaluation set on both versions to quantify what moved and where, and if you pinned, roll back to buy time. Then work out whether it is a prompt that depended on old behaviour or a genuine regression, fix forward, and re-evaluate.\n\nThe prevention is architectural: pin versions, keep a golden set, alert on quality metrics not just errors, and abstract the provider so switching is possible.",
      "points": [
        "Pin versions. A floating alias means silent changes you cannot roll back.",
        "Log the exact model version on every request.",
        "Run the golden set on a schedule, not just at release.",
        "Alert on quality drift, not only on errors and latency.",
        "Keep provider access behind an interface so a switch is possible."
      ],
      "say": "First, whether I would notice - which is why I pin model versions, log the exact version per request, and run the golden set on a schedule rather than only at release. Then: compare logs before and after to confirm the change, run the eval set on both versions to quantify what moved, and roll back to the pinned version to buy time. Then decide whether it is a prompt that depended on old behaviour or a genuine regression.",
      "numbers": "Run the golden set at least weekly, and always after any provider announcement. The cost of a 100-example run is small against finding out from a user.",
      "wrong": "\"We would update the prompt to fix it.\" That is step four. Steps one to three are detection, quantification and rollback, and skipping them is the actual failure.",
      "follow": "How would you detect quality drift automatically, without a user complaining?"
    },
    {
      "id": "llm-11",
      "q": "What are temperature, top-p and top-k actually doing to the probability distribution?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "tags": [
        "sampling",
        "inference",
        "decoding"
      ],
      "why": "Everyone sets these. This checks whether you know what they do to the distribution or only that one makes output 'more creative'.",
      "simple": "At every step the model produces a score for every token in its vocabulary. Softmax turns those into probabilities. These three parameters each modify that distribution before a token is sampled - and they act at different points, which is why combining them carelessly is confused.\n\nTemperature rescales the logits before softmax. Divide by a number below 1 and the gaps between scores widen, so the distribution sharpens and the top token dominates. Divide by a number above 1 and the gaps narrow, flattening the distribution so unlikely tokens get a real chance. Temperature 0 means always take the highest - greedy.\n\nTop-k truncates. Keep only the k highest-probability tokens, discard the rest, renormalise. A blunt instrument: k=50 keeps fifty candidates whether the model was certain or completely unsure.\n\nTop-p, or nucleus sampling, truncates adaptively. Sort by probability and keep the smallest set whose cumulative probability reaches p. When the model is confident, that might be two tokens; when it is uncertain, forty. That adaptivity is why top-p largely replaced top-k.\n\nThe senior point: temperature and top-p do different jobs - one reshapes, one truncates - so setting both to unusual values makes the effect hard to reason about. Pick one to tune. The common convention is to vary temperature and leave top-p near its default, or vice versa.\n\nFor production, the practical answer is that most structured or factual work wants temperature at or near 0, and the creativity argument matters far less than people expect.",
      "points": [
        "Temperature rescales logits before softmax - sharpens or flattens.",
        "Top-k keeps a fixed number of candidates regardless of confidence.",
        "Top-p keeps the smallest set reaching cumulative probability p.",
        "Top-p is adaptive to model confidence, which is why it won.",
        "Tune one, not both - they interact confusingly."
      ],
      "say": "Temperature rescales the logits before softmax, so below one it sharpens the distribution and above one it flattens it. Top-k keeps a fixed number of candidates regardless of how confident the model was. Top-p keeps the smallest set whose cumulative probability reaches p, so it adapts to confidence - which is why it largely replaced top-k. They do different jobs, so I tune one and leave the other at default.",
      "numbers": "Temperature 0 for extraction, classification and structured output. Around 0.7 with top-p 0.9 is a common creative default. Tuning both at once makes behaviour hard to reason about.",
      "wrong": "'Temperature controls creativity.' It describes the effect and not the mechanism, and the follow-up about top-p usually ends there.",
      "follow": "You need deterministic JSON extraction. What do you set, and is that enough?"
    },
    {
      "id": "llm-12",
      "q": "What is quantisation, and what does INT8 or INT4 actually cost you?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "quantisation",
        "serving",
        "cost"
      ],
      "why": "The main lever for self-hosting on affordable hardware, and the quality trade is what gets probed.",
      "simple": "Model weights are usually stored as 16-bit floats. Quantisation stores them in fewer bits - 8-bit or 4-bit integers - which shrinks the model roughly proportionally.\n\nThe arithmetic is what makes it matter. A 70-billion-parameter model at FP16 needs about 140 GB just for weights, so two 80 GB GPUs. At INT4 it is roughly 35 GB and fits on one. That is the difference between a two-GPU bill and a one-GPU bill, or between running locally and not running at all.\n\nThe mechanism: map a range of float values onto a small set of integers with a scale factor per group of weights. Smaller groups preserve more accuracy and cost slightly more overhead.\n\nWhat it costs you. INT8 is close to free - quality loss is usually negligible and it is a safe default for serving. INT4 is where judgement starts: often acceptable, with measurable degradation on harder reasoning, long-context tasks and code. Below 4 bits, degradation is real.\n\nTwo distinctions worth making. Post-training quantisation is applied to a finished model and is what you normally use. Quantisation-aware training bakes it into training and preserves more quality, at the cost of training. And weight-only quantisation shrinks memory while computing in higher precision, which is the common case - activations are often left alone because they are more sensitive.\n\nThe honest framing: quantisation trades quality for memory and cost, the curve is not linear, and you validate on your own eval set rather than trusting a benchmark table. A model that scores well on public benchmarks at INT4 can still degrade on your specific task.",
      "points": [
        "Fewer bits per weight - memory shrinks roughly proportionally.",
        "70B at FP16 is ~140 GB; at INT4 roughly 35 GB - one GPU instead of two.",
        "INT8 is near-free; INT4 is usually acceptable with real edge cases.",
        "Reasoning, long context and code degrade first.",
        "Validate on your own eval set, not a published benchmark."
      ],
      "say": "Quantisation stores weights in fewer bits, so memory shrinks roughly proportionally - a 70B model goes from about 140 GB at FP16 to around 35 GB at INT4, which is one GPU instead of two. INT8 costs almost nothing in quality and is a safe default. INT4 is usually acceptable but degrades first on reasoning, long context and code. I validate on my own eval set rather than trusting a benchmark table.",
      "numbers": "Rough weight memory: FP16 is 2 bytes per parameter, INT8 1 byte, INT4 half a byte. Add KV cache on top - at long context that often exceeds the weight savings.",
      "wrong": "'INT4 halves quality.' The trade is far better than that and highly task-dependent, and stating it as a fixed cost shows you have not measured it.",
      "follow": "You quantised to INT4 and your eval dropped 3 points. What are your options?"
    },
    {
      "id": "llm-13",
      "q": "What is speculative decoding, and why is it effectively free latency?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "inference",
        "latency",
        "serving"
      ],
      "why": "A serving optimisation that sounds like it should cost quality and does not. Explaining why is the test.",
      "simple": "Decoding is sequential - one token at a time, each needing a full forward pass through the model. That is why generation is slow, and the bottleneck is memory bandwidth rather than compute: you read the entire model's weights to produce a single token.\n\nSpeculative decoding exploits that waste. A small fast draft model proposes several tokens ahead. Then the large model verifies all of them in one forward pass - because verifying k tokens in parallel costs almost the same as generating one, since you were bandwidth-bound anyway.\n\n    draft model:  proposes  ' the cat sat on the'\n    target model: verifies all 5 in one pass\n    -> accepts the matching prefix, rejects from the first mismatch\n\nThe crucial property is that the acceptance test is designed so the output distribution is mathematically identical to what the large model would have produced alone. You are not approximating. The large model still decides every token - it just checks several at once instead of generating them one by one.\n\nThat is why it is free: same output distribution, fewer sequential passes.\n\nWhat determines the gain is the acceptance rate. If the draft model agrees with the target often, you accept long runs and go much faster. On predictable text - code, structured output, formulaic prose - acceptance is high. On genuinely surprising content it is lower and the speedup shrinks.\n\nThe costs: you run two models, so memory goes up, and a poorly matched draft model can make things slower by proposing tokens that are constantly rejected. Variants like Medusa avoid the separate model by adding prediction heads to the target itself.",
      "points": [
        "Decoding is memory-bandwidth bound, not compute bound.",
        "Verifying k tokens in one pass costs about the same as generating one.",
        "The acceptance test preserves the target model's exact distribution.",
        "Gain depends on draft-model acceptance rate.",
        "Costs extra memory; a mismatched draft model can be slower."
      ],
      "say": "Decoding is bandwidth-bound - you read all the weights to produce one token - so verifying several tokens in one pass costs about the same as generating one. A small draft model proposes tokens ahead and the large model verifies them in a single pass. The acceptance test is constructed so the output distribution is identical to the large model alone, so it is genuinely free rather than approximate. The gain scales with acceptance rate.",
      "numbers": "Typical speedups are around 2–3× on predictable text like code, less on surprising content. The draft model must be small enough that proposing is cheap relative to verifying.",
      "wrong": "'It trades a little accuracy for speed.' It does not - the acceptance test preserves the exact output distribution, and that is the whole reason it is interesting.",
      "follow": "Your acceptance rate is 30%. Is speculative decoding still helping?"
    },
    {
      "id": "llm-14",
      "q": "Explain prefill and decode, and why they need different optimisations.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "inference",
        "serving",
        "latency"
      ],
      "why": "The distinction that explains almost every serving decision, from batching to why long prompts behave differently from long outputs.",
      "simple": "Generation has two phases with completely different performance characteristics, and conflating them makes serving decisions look arbitrary.\n\nPrefill processes your entire prompt at once. Every token can be computed in parallel because they are all already known, so the GPU does a large matrix multiplication and is compute-bound. It produces the first output token and populates the KV cache.\n\nDecode generates the rest, one token at a time. Each step depends on the previous token, so there is no parallelism within a sequence. You read the entire model's weights plus the KV cache to produce a single token, which makes it memory-bandwidth-bound. The GPU's compute units are mostly idle.\n\nThat difference explains a lot.\n\nWhy time-to-first-token scales with prompt length but per-token speed does not: prefill work grows with input size, decode does not.\n\nWhy batching helps decode enormously and prefill much less: in decode you are reading the same weights for every request in the batch, so batching amortises the bandwidth cost across many sequences almost for free. In prefill you are already saturating compute.\n\nWhy continuous batching exists: requests finish at different times, so you want to swap new ones in mid-flight rather than waiting for the whole batch.\n\nWhy prompt caching is so effective: a cached prefix skips prefill entirely for that portion.\n\nAnd why some systems physically separate prefill and decode onto different hardware pools - they want different things from a GPU.",
      "points": [
        "Prefill: whole prompt in parallel, compute-bound, sets TTFT.",
        "Decode: one token at a time, memory-bandwidth-bound.",
        "Batching helps decode far more than prefill.",
        "Long prompts hurt TTFT; long outputs hurt total time.",
        "Prompt caching works by skipping prefill for a cached prefix."
      ],
      "say": "Prefill processes the whole prompt in parallel and is compute-bound - it sets time to first token and scales with prompt length. Decode generates one token at a time, reading all the weights per token, so it is memory-bandwidth-bound and the compute units sit idle. That is why batching helps decode enormously but prefill much less, why long prompts hurt TTFT while long outputs hurt total time, and why prompt caching pays off.",
      "numbers": "Prefill cost scales with input length; decode cost scales with output length. If TTFT is your problem, look at prompt size and caching, not at the model's speed.",
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
      "tags": [
        "cost",
        "latency",
        "caching"
      ],
      "why": "A direct cost lever that most candidates know exists and cannot say how to exploit.",
      "simple": "Providers can cache the computed state of a prompt prefix. If your next request starts with exactly the same tokens, that portion skips prefill - you pay much less for those input tokens and time-to-first-token drops.\n\nThe mechanism dictates the design rule: it is a prefix match, and it must be exact. The cache breaks at the first differing token, and everything after that point is recomputed.\n\nSo structure the prompt static-first, variable-last:\n\n    [ system prompt        ]  stable\n    [ tool definitions     ]  stable\n    [ few-shot examples    ]  stable\n    [ retrieved documents  ]  varies\n    [ conversation history ]  grows\n    [ user question        ]  varies\n\nEverything above the first variable element is cacheable. Put a timestamp or a user id at the top of your system prompt and you have destroyed the cache for every request - that is the single most common mistake, and it is invisible until you look at the bill.\n\nWhere it pays most: agents, because the system prompt and tool definitions are re-sent on every step of the loop and never change. Long stable few-shot blocks. Multi-turn chat, where the prefix grows monotonically.\n\nPractical details worth knowing: caches have a short time-to-live, typically minutes, so benefit depends on request frequency; there is usually a minimum cacheable length, so tiny prompts do not qualify; and some providers charge slightly more to write the cache, so a prefix used once can cost marginally more.\n\nMeasure the hit rate rather than assuming it. A cache you believe in and never hit is a cost estimate that is quietly wrong.",
      "points": [
        "Caches an exact token prefix; it breaks at the first difference.",
        "Order static content first, variable content last.",
        "A timestamp or user id at the top destroys every cache hit.",
        "Highest payoff in agent loops - tool definitions resent each step.",
        "Short TTL and a minimum length; measure the hit rate."
      ],
      "say": "The provider caches the computed prefix, so an identical opening to a prompt skips prefill and costs much less. Because it is an exact prefix match that breaks at the first differing token, I order the prompt static-first - system prompt, tools, few-shot examples - then retrieved context and the question last. Putting a timestamp at the top destroys every hit. It pays most in agent loops where tool definitions are resent every step.",
      "numbers": "Cached input tokens are billed at a large discount versus uncached. Caches typically expire in minutes, so benefit depends on request frequency.",
      "wrong": "Enabling caching and assuming the saving arrives. If a variable element sits near the top of the prompt, the hit rate is near zero and nothing tells you.",
      "follow": "Your cache hit rate is 5%. Where would you look first?"
    },
    {
      "id": "llm-16",
      "q": "Open-weight or closed API model - how do you actually decide?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "decision",
        "cost",
        "architecture"
      ],
      "why": "A senior architecture decision that a hiring manager will press on, and the naive answer is always cost.",
      "simple": "I decide this from constraints, not ideology.\n\nData control and residency come first. Some financial, healthcare, public-sector or enterprise contracts restrict where prompts, logs or model processing may happen. If that rule requires on-premise or a specific region, it can decide the architecture before cost.\n\nThen capability. A hosted frontier model may be best for a difficult reasoning task; an open-weight model may be more than good enough for a narrow task with retrieval or fine-tuning. Measure on your own evaluation set rather than comparing benchmark headlines.\n\nThen economics. Self-hosting has fixed costs - GPUs, capacity engineering and on-call work - while an API is mostly variable usage cost. There is a break-even point, and it moves with utilisation.\n\nAlso compare latency, availability, rate limits, model-change control and your team's ability to operate GPU serving well.\n\nMy usual path is to start with the simplest option that meets security and quality, instrument usage, and revisit the decision when volume, regulation or control requirements change.",
      "points": [
        "Start with residency, security and contractual constraints.",
        "Measure capability on your own tasks, not public benchmark headlines.",
        "Compare self-hosting fixed cost with API variable cost at real utilisation.",
        "Include latency, rate limits, upgrade control and operational skill.",
        "Use the simplest option that meets the requirements, then revisit with data."
      ],
      "say": "I start with non-negotiable security, residency and contractual constraints, because they can decide the architecture immediately. Then I compare quality on our own evaluation set, not benchmark headlines. After that I model economics: self-hosting has fixed GPU and operating cost while an API is mostly variable usage cost. I also include latency, rate limits, upgrade control and whether the team can operate inference well. I choose the simplest option that meets those requirements and revisit with measured volume.",
      "numbers": "Self-hosting is fixed GPU and engineering cost; API is per token. Compute your own break-even volume - it is usually higher than teams expect.",
      "wrong": "Assuming self-hosting is automatically cheaper or more secure. Either can be wrong if utilisation is low, operations are weak, or the surrounding data and logging path is not controlled.",
      "follow": "Your client insists on on-premise but wants frontier-model quality. What do you tell them?"
    },
    {
      "id": "llm-17",
      "q": "What changes when you move from a text-only model to a multimodal model?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
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
