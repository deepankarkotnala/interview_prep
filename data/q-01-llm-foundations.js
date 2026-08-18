/* Topic 01 — LLM foundations. Tokens, context, sampling, inference.
   Grounding: what every GenAI JD assumes as baseline, plus documented model
   and inference behaviour. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["01-llm-foundations"] = {
  lede: "These are the questions that open a technical round. They look basic, which is exactly why they are dangerous — a vague answer here sets the tone for the next forty minutes. The bar for a senior candidate is not the definition, it is the consequence.",
  grounding: "baseline assumed by every GenAI JD + documented inference behaviour",
  evening: ["llm-01", "llm-03", "llm-05", "llm-08", "llm-10"],

  cards: [
    {
      id: "llm-01",
      q: "What is a token, and why should you care?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["tokens", "basics", "cost"],
      why: "Whether you connect a definition to the things it controls — cost, limits and latency.",
      simple:
        "A model does not read letters or words. It reads tokens — chunks of text that the tokeniser produced. In English a token is roughly three quarters of a word, so a hundred words is about a hundred and thirty tokens.\n\n" +
        "Common words are one token. Rare words, names, code and numbers get split into several. And Indian-language text usually costs far more tokens per word than English, because the tokeniser saw less of it during training.\n\n" +
        "Why care: tokens are the unit of everything that matters commercially. You pay per token. The context window is measured in tokens. Latency scales with tokens. So when someone asks you to cut cost, you are being asked to cut tokens, and the fastest way is almost always trimming retrieved context, not shortening the user's question.",
      points: [
        "English: roughly 4 characters or 0.75 words per token.",
        "Rare words, names, code and numbers split into more tokens.",
        "Hindi, Tamil, Bengali cost noticeably more tokens per word than English.",
        "Cost, context limit and latency are all measured in tokens.",
        "Count tokens with the provider's tokeniser, never by estimating characters."
      ],
      say: "A token is the chunk of text the model actually reads — roughly three quarters of a word in English, more for names, code and Indian-language text. It matters because it is the unit of billing, of the context limit and of latency. So any cost or latency work is token work, and the biggest line is almost always retrieved context rather than the user's question.",
      numbers: "About 1.3 tokens per English word. Indian-language text commonly costs 2–3× more tokens per word — worth checking before you promise a multilingual cost figure.",
      wrong: "\"A token is a word.\" It is wrong and it hides the multilingual cost problem, which matters for almost any India-facing product.",
      follow: "Your product serves Hindi and English. What does that do to your cost model?"
    },

    {
      id: "llm-02",
      q: "What is the context window, and what happens when you exceed it?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["context", "basics", "limits"],
      why: "Whether you have handled the failure or only read the number on a pricing page.",
      simple:
        "The context window is the total tokens the model can look at in one call — your system prompt, the conversation, retrieved documents, the tool definitions, and the answer it is about to write. All of it shares one budget.\n\n" +
        "Exceed it and you get an error, not a graceful truncation. The request fails.\n\n" +
        "So real systems manage the budget actively. Reserve space for the output first, because a model that runs out mid-answer produces a truncated response that then breaks your JSON parser. Count tokens before sending. Trim in a defined order — usually oldest conversation turns first, then lower-ranked documents — rather than cutting from the end and losing your own instructions.\n\n" +
        "The senior addition: a bigger window is not free. You pay for every token in it, and accuracy on facts buried in the middle of a long context is measurably worse than at the ends.",
      points: [
        "Everything shares one budget: system prompt, history, documents, tools, output.",
        "Exceeding it is an error, not a truncation.",
        "Reserve output tokens first — truncated output breaks downstream parsing.",
        "Trim in a defined order; never cut blindly from the end.",
        "Longer context costs more and degrades middle-of-context recall."
      ],
      say: "It is the total tokens in one call — system prompt, history, retrieved documents, tool definitions and the answer, all sharing one budget. Exceeding it is a hard error, not a truncation, so I count before sending, reserve space for the output first, and trim in a defined order: oldest turns, then lowest-ranked documents. And I do not treat a bigger window as free — cost scales with it, and mid-context recall degrades.",
      numbers: "Reserve output tokens explicitly — typically 1–2k for a chat answer. A model that hits the limit mid-JSON returns invalid JSON, and that is a production incident, not a warning.",
      wrong: "\"The model just forgets the oldest part.\" That is your framework silently trimming, not the model. Not knowing which is happening means you cannot debug why an instruction stopped being followed.",
      follow: "Your system prompt stopped being followed after twenty turns. Why?"
    },

    {
      id: "llm-03",
      q: "Same prompt, two different answers. Explain.",
      round: ["tech1"],
      level: "2-5",
      tags: ["sampling", "temperature", "determinism"],
      why: "Whether you understand generation as sampling, which underpins every reliability question later.",
      simple:
        "At each step the model does not choose a word. It produces a probability distribution over every possible next token. Then something picks one from that distribution — and that picking is the sampling step.\n\n" +
        "Temperature controls how flat that distribution is made before picking. Low temperature sharpens it, so the most likely token nearly always wins and output becomes repeatable. High temperature flattens it, so less likely tokens get a real chance, and output varies.\n\n" +
        "Top-p, or nucleus sampling, is a different knob: keep only the smallest set of tokens whose probabilities add up to p, and sample from those. It cuts the long tail of nonsense while still allowing variety.\n\n" +
        "Worth knowing for a senior round: temperature zero is not a guarantee of identical output. Floating-point non-determinism on GPUs, batching effects and provider-side model updates all cause drift. So design for variation, do not assume it away.",
      points: [
        "Generation is sampling from a distribution, one token at a time.",
        "Temperature flattens or sharpens that distribution before sampling.",
        "Top-p keeps the smallest set of tokens summing to p, then samples.",
        "Temperature 0 is near-deterministic, not guaranteed deterministic.",
        "Extraction and classification: low temperature. Creative drafting: higher."
      ],
      say: "The model outputs a probability distribution over the next token, and sampling picks from it. Temperature sharpens or flattens that distribution — low means the top token nearly always wins, high gives less likely tokens a real chance. Top-p keeps only the smallest set summing to p. I use low temperature for extraction and classification. And temperature zero is near-deterministic, not guaranteed, so I design for variation.",
      numbers: "Common settings: 0–0.2 for extraction, classification and structured output; 0.7 for drafting and ideation. Set it explicitly — provider defaults differ.",
      wrong: "\"Temperature 0 makes it deterministic.\" Nearly true, and the exception is exactly what bites you when the same test starts failing intermittently in CI.",
      follow: "You need reproducible outputs for an audit. How do you get as close as possible?"
    },

    {
      id: "llm-04",
      q: "What is the difference between a base model, an instruct model and a chat model?",
      round: ["tech1"],
      level: "2-5",
      tags: ["training", "models", "fine-tuning"],
      why: "Whether you know how the model you call was produced.",
      simple:
        "A base model is trained to do one thing: predict the next token over a huge amount of text. It is not trying to help you. Give it a question and it may continue with more questions, because that is what a list of questions looks like in its training data.\n\n" +
        "An instruct model is a base model further trained on instruction-and-response pairs, so it learned that a request should be followed by an answer.\n\n" +
        "A chat model adds multi-turn structure — roles like system, user and assistant — and is usually aligned further with human preference data, using RLHF or DPO, so its answers are helpful and refuse harmful requests.\n\n" +
        "Almost everything you call through an API is a chat model. The reason to know the distinction is that it explains why the same underlying model behaves so differently depending on which version you use, and why a fine-tuning conversation starts with the question \"fine-tune from which checkpoint?\"",
      points: [
        "Base — next-token prediction only. Not helpful by default.",
        "Instruct — supervised fine-tuning on instruction-response pairs.",
        "Chat — role structure plus preference alignment, RLHF or DPO.",
        "The API models you use are almost always chat models.",
        "Fine-tuning usually starts from the instruct checkpoint, not the base one."
      ],
      say: "A base model only predicts the next token, so it does not follow instructions — it continues text. An instruct model is that base model fine-tuned on instruction and response pairs so it answers rather than continues. A chat model adds role structure and preference alignment with RLHF or DPO. What we call through APIs is almost always the chat variant, and fine-tuning normally starts from the instruct checkpoint.",
      numbers: "No number applies. This is a training-pipeline question.",
      wrong: "\"They are the same model with a different prompt template.\" The template differs, but so do the weights — different training stages produced them.",
      follow: "Where does RLHF fit, and what is DPO doing differently?"
    },

    {
      id: "llm-05",
      q: "Why do models hallucinate?",
      round: ["screening", "tech1", "tech2"],
      level: "5-10",
      tags: ["hallucination", "reliability", "generation"],
      why: "Whether you can explain the mechanism, which determines whether your mitigations make sense.",
      simple:
        "Because the model is not looking anything up. It is generating the most plausible continuation, token by token, from patterns in its training data. Plausible and true are different things, and nothing in the objective separates them.\n\n" +
        "So when it does not know, it does not have a gap it can feel. It produces the shape of a correct answer — a citation that looks like a citation, a section number that looks like a section number — because that is what the pattern demands there.\n\n" +
        "Three things make it worse. Rare or recent facts, where training data was thin. Questions that presuppose something false, because the model tends to accept the premise. And pressure to be specific, since a confident number is more plausible-looking than a hedge.\n\n" +
        "Which tells you what actually helps: give it the facts in context, allow it to refuse, verify the output against a source, and keep a human on the decisions that matter.",
      points: [
        "The objective rewards plausibility, not truth. There is no lookup step.",
        "Worse for rare, recent or highly specific facts.",
        "False-premise questions get accepted rather than challenged.",
        "Mitigations: retrieval, explicit permission to refuse, output verification, human review.",
        "It cannot be eliminated, only reduced and detected."
      ],
      say: "Because the model is predicting a plausible continuation, not retrieving a fact. Nothing in the objective separates plausible from true, and it has no sense of a gap in its knowledge — so it produces something shaped like a correct answer. It is worst on rare or recent facts and on false-premise questions. So I give it the facts in context, allow it to refuse, verify the output against the source, and keep a human on decisions that matter.",
      numbers: "No fixed rate — it is entirely task-dependent. What you measure is your own groundedness rate on your own traffic.",
      wrong: "\"RAG solves it.\" RAG addresses missing knowledge. It does not address a model ignoring the context it was given, which is a large share of real failures.",
      follow: "How do you measure hallucination when you have no ground truth?"
    },

    {
      id: "llm-06",
      q: "What actually happens when a model generates a response? Prefill and decode.",
      round: ["tech2"],
      level: "5-10",
      tags: ["inference", "latency", "kv-cache", "serving"],
      why: "Separates people who have tuned serving from people who have only called an API.",
      simple:
        "Generation has two phases with completely different performance characteristics, and knowing this explains most latency behaviour.\n\n" +
        "Prefill is processing your input. All the input tokens go through the model in parallel, which is compute-heavy but fast in wall-clock terms because the GPU is fully used. This determines your time to first token.\n\n" +
        "Decode is generating the output, one token at a time, each depending on the last. It cannot be parallelised within one request, and it is memory-bandwidth bound rather than compute bound. This determines tokens per second.\n\n" +
        "The KV cache is what makes decode workable: attention keys and values for previous tokens are stored so each new token does not recompute the whole sequence. The cost is memory, and KV cache memory grows with sequence length and batch size — which is usually the real limit on how many concurrent requests a GPU can serve.\n\n" +
        "The practical consequence: long input hurts time to first token; long output hurts total time. They are different problems with different fixes.",
      points: [
        "Prefill — input processed in parallel, compute-bound, sets time to first token.",
        "Decode — one token at a time, memory-bandwidth bound, sets tokens per second.",
        "KV cache avoids recomputation; its memory cost limits concurrency.",
        "Long input → slow first token. Long output → slow total. Different fixes.",
        "Continuous batching, as in vLLM, is what keeps the GPU busy across requests."
      ],
      say: "Prefill processes the whole input in parallel — compute-bound, and it sets time to first token. Decode generates one token at a time, each depending on the previous, so it is memory-bandwidth bound and sets tokens per second. The KV cache stops us recomputing attention over previous tokens, but its memory footprint is usually what limits concurrency. So long input hurts first-token latency and long output hurts total time.",
      numbers: "KV cache memory scales with batch size × sequence length × layers × 2. It is commonly the binding constraint on concurrent requests, ahead of raw compute.",
      wrong: "\"The model just generates the answer.\" For an API-only role it may pass. For anything touching self-hosting or cost, it does not.",
      follow: "How does continuous batching change throughput?"
    },

    {
      id: "llm-07",
      q: "How do you get reliable structured output?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["structured-output", "json", "reliability", "tools"],
      why: "Every real system parses model output. This is where demos break in production.",
      simple:
        "The weakest approach is asking nicely in the prompt and parsing the result. It works most of the time, which is the problem — the failures arrive at scale, wrapped in markdown fences, with a trailing comma, or with a helpful sentence before the JSON.\n\n" +
        "Better is to use what the provider offers. Constrained decoding — JSON mode or a JSON schema — restricts the tokens the model may emit so the output is valid by construction, not by luck. Function or tool calling does the same thing with a typed signature.\n\n" +
        "Then validate anyway, with Pydantic or an equivalent. Valid JSON is not correct JSON — the schema can be satisfied by a field containing nonsense.\n\n" +
        "And have a fallback path: one retry with the validation error fed back as a message, then a graceful failure. Never an infinite retry, because a model that cannot satisfy your schema usually cannot satisfy it on the fifth attempt either.",
      points: [
        "Prompt-and-parse is the weakest option. It fails at scale, not in testing.",
        "Use constrained decoding — JSON schema mode or tool calling.",
        "Validate with Pydantic regardless. Valid is not correct.",
        "Retry once with the error message, then fail gracefully.",
        "Keep schemas flat and simple. Deep nesting raises the failure rate.",
        "Log every parse failure — a rising rate usually means a silent model update."
      ],
      say: "I do not rely on asking nicely in the prompt. I use constrained decoding — JSON schema mode or tool calling — so the output is valid by construction. Then I validate with Pydantic anyway, because valid JSON can still be wrong. On failure I retry once with the validation error fed back, then fail gracefully. And I log parse-failure rate, because a sudden rise usually means the provider updated the model.",
      numbers: "Prompt-and-parse commonly fails a small but non-zero share of requests. At 10,000 requests a day even 1% is 100 broken responses — which is why constrained decoding is not optional.",
      wrong: "\"I ask for JSON and it works.\" It works in the notebook. The panel is asking about the tail, and this answer says you have not seen it.",
      follow: "Your JSON is valid but a field contains a hallucinated ID. Now what?"
    },

    {
      id: "llm-08",
      q: "How do you choose which model to use?",
      round: ["tech1", "tech2", "manager"],
      level: "5-10",
      tags: ["model-selection", "cost", "trade-off", "evaluation"],
      why: "Whether you decide with your own evaluation or with a leaderboard.",
      simple:
        "Not from a leaderboard. Public benchmarks measure general capability on public tasks; your task is neither.\n\n" +
        "The process that works: define the task and build a small evaluation set from your own data, a hundred examples or so with known good answers. Shortlist three or four candidates that meet the hard constraints first — data residency, whether it can run in your cloud tenant, contractual terms, whether it must be self-hosted. Those constraints eliminate most options before quality is even discussed, which is worth saying out loud in an enterprise interview.\n\n" +
        "Then run all candidates on your set, and compare quality, cost per request and p95 latency together. Usually the cheap model is good enough for most of the traffic and you route only the hard cases to the expensive one.\n\n" +
        "And plan for change. Wrap model access behind an interface so switching is configuration, and keep the evaluation set so you can re-run it when a new model lands.",
      points: [
        "Hard constraints first: residency, tenancy, contract, self-hosting.",
        "Build a 100-example evaluation set from your own data.",
        "Compare quality, cost per request and p95 latency together, not separately.",
        "Route by difficulty — cheap model for most traffic, expensive for the tail.",
        "Abstract the provider so switching is configuration.",
        "Keep the eval set. Re-run it when a new model ships."
      ],
      say: "Constraints first — data residency, whether it runs in our tenant, contract terms — because those eliminate most options before quality comes up. Then I build a hundred-example evaluation set from our own data and run the shortlist on it, comparing quality, cost per request and p95 latency together. Usually a cheap model handles most traffic and I route hard cases to the expensive one. And I keep the eval set for the next model.",
      numbers: "A 100-example evaluation set is usually enough to separate candidates. Cost differences between tiers are often 10–20×, which is why per-request cost belongs in the comparison from the start.",
      wrong: "\"We use the top model on the leaderboard.\" It says you have not built an evaluation set, which is the actual skill being probed.",
      follow: "A new model launches next month. What do you do?"
    },

    {
      id: "llm-09",
      q: "What is the difference between a system prompt and a user message — and does it matter?",
      round: ["tech1"],
      level: "2-5",
      tags: ["prompting", "roles", "security"],
      why: "Small question, useful signal — it leads directly into injection.",
      simple:
        "The system message sets the standing behaviour: role, rules, tone, output format. The user message is the request for this turn. Chat models were trained to weight the system message more heavily, so instructions there are followed more consistently.\n\n" +
        "More heavily is not absolutely. A long conversation can dilute it, and a user message that argues with it will sometimes win. That is why prompt injection works at all.\n\n" +
        "So the rule for anything that matters: the system prompt is guidance, not a security control. Access rules, spending limits and permission checks belong in code, in your runtime, where the model cannot argue with them. If the only thing stopping a data leak is a sentence in the system prompt, you do not have a control.",
      points: [
        "System — standing rules, weighted more heavily by training.",
        "User — this turn's request.",
        "Weighting is a tendency, not a guarantee. Long conversations dilute it.",
        "Never put a security control only in the system prompt.",
        "Anything retrieved or user-supplied is untrusted data, never instructions."
      ],
      say: "The system message carries standing behaviour — role, rules, format — and chat models were trained to weight it more heavily than a user turn. But more heavily is a tendency, not a guarantee: long conversations dilute it and a determined user turn can override it. So I treat the system prompt as guidance and put anything that is actually a control — permissions, limits — in code where the model cannot argue with it.",
      numbers: "No number applies. This is a trust-boundary answer.",
      wrong: "\"The system prompt cannot be overridden.\" It can, routinely, and saying otherwise ends the security part of the interview badly.",
      follow: "Show me how a retrieved document could override your system prompt."
    },

    {
      id: "llm-10",
      q: "A model update from the provider changed your outputs. What do you do?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["operations", "versioning", "evaluation", "incident"],
      why: "A real operational scenario. It tests whether you built for a dependency you do not control.",
      simple:
        "This happens, and the first question the panel is really asking is whether you would have noticed.\n\n" +
        "You notice if you pin model versions rather than using a floating alias, log the exact model version on every request, and run your evaluation set on a schedule rather than only before releases. Without those, the first signal is a user complaint, which is a much worse place to start.\n\n" +
        "The response: confirm the version changed by comparing logs before and after, run the evaluation set on both versions to quantify what moved and where, and if you pinned, roll back to buy time. Then work out whether it is a prompt that depended on old behaviour or a genuine regression, fix forward, and re-evaluate.\n\n" +
        "The prevention is architectural: pin versions, keep a golden set, alert on quality metrics not just errors, and abstract the provider so switching is possible.",
      points: [
        "Pin versions. A floating alias means silent changes you cannot roll back.",
        "Log the exact model version on every request.",
        "Run the golden set on a schedule, not just at release.",
        "Alert on quality drift, not only on errors and latency.",
        "Keep provider access behind an interface so a switch is possible."
      ],
      say: "First, whether I would notice — which is why I pin model versions, log the exact version per request, and run the golden set on a schedule rather than only at release. Then: compare logs before and after to confirm the change, run the eval set on both versions to quantify what moved, and roll back to the pinned version to buy time. Then decide whether it is a prompt that depended on old behaviour or a genuine regression.",
      numbers: "Run the golden set at least weekly, and always after any provider announcement. The cost of a 100-example run is small against finding out from a user.",
      wrong: "\"We would update the prompt to fix it.\" That is step four. Steps one to three are detection, quantification and rollback, and skipping them is the actual failure.",
      follow: "How would you detect quality drift automatically, without a user complaining?"
    }
  ]
};
