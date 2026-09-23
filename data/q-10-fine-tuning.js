/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["10-fine-tuning"] = {
  "lede": "Interviewers ask about fine-tuning to see whether you reach for it too early. Almost every candidate can describe LoRA. Far fewer can say when they chose not to fine-tune and why, or name what it costs to own a model artefact for the next three years. The restraint is what is being marked. New to fine-tuning? The questions are ordered for a first read: every High priority card first, from when to fine-tune through LoRA, QLoRA, SFT versus DPO, data and evaluation, then Medium.",
  "grounding": "public JDs naming LoRA and fine-tuning + documented method behaviour",
  "evening": [
    "ft-01",
    "ft-02",
    "ft-04",
    "ft-07"
  ],
  "cards": [
    {
      "id": "ft-01",
      "q": "Your team wants to fine-tune a model. What has to be true before you agree?",
      "round": [
        "tech1",
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "judgement",
        "trade-off"
      ],
      "why": "The go/no-go gate for the whole topic. Reaching for fine-tuning first is the classic mid-level answer; the panel wants the conditions, not enthusiasm.",
      "simple": "**Short version: agree only if the gap is behaviour rather than missing facts, cheaper fixes have been tried and measured, you have good data, and someone will own the model afterwards.** (The head-to-head RAG-vs-fine-tuning decision is rag-45 in the RAG section; this card is the go/no-go checklist.)\n\nThe rule that holds up: fine-tuning teaches behaviour, retrieval supplies knowledge.\n\nIf the model does not know a fact, fine-tuning is the wrong tool. Facts change, and retraining every time a policy is updated is slow and expensive. That is RAG.\n\nIf the model knows what to say but not how to say it - your house tone, a rigid output format, a domain style, a classification boundary specific to your business - that is behaviour, and that is where fine-tuning wins.\n\nThe other two real cases are cost and latency. A small fine-tuned model matching a large general model on one narrow task can be dramatically cheaper and faster at high volume. That is a legitimate and often overlooked reason.\n\nAnd what to try first, in order: better prompting, few-shot examples, retrieval, then a small model with a schema. Fine-tuning is what you do when those are exhausted and you have the data, because you are choosing to own a model artefact - versioning, hosting, evaluation and drift - indefinitely.",
      "points": [
        "Behaviour and format → fine-tuning. Facts and knowledge → retrieval.",
        "Cost and latency at high volume on a narrow task → a strong, underrated case.",
        "Try first: prompting, few-shot, retrieval, small model with a schema.",
        "Fine-tuning means owning a model artefact - versioning, hosting, drift, forever.",
        "It does not stop hallucination - training on facts the model did not already know can even make it invent more confidently."
      ],
      "say": "Three things. The gap must be behaviour, not knowledge - facts belong in retrieval because they change. Prompting, few-shot and retrieval must already have been tried and measured. There must be a real payoff: a consistent format, tone or business-specific classification, or a small tuned model replacing a large one at high volume. And we need the training data, plus a team willing to own versioning, hosting and re-evaluation.",
      "numbers": "A small fine-tuned model can be an order of magnitude cheaper per request than a large general one on a narrow task. That is the case worth building a business argument on.",
      "wrong": "\"We fine-tuned it on our documents so it knows our data.\" This is the single most common wrong answer in the topic. Training on documents teaches style, not reliable recall, and every document change means another training run.",
      "follow": "So what would you do if the model needs both our tone and our latest policy?",
      "followAnswer": "Split the problem. The latest policy is knowledge, so it comes from retrieval at request time, with citations. The tone is behaviour, so I first try a system prompt with a few examples, and fine-tune only if that fails measurably. If I do fine-tune, I train on examples that include retrieved context, so the model learns to use fresh context in our tone rather than memorise policies."
    },
    {
      "id": "ft-02",
      "q": "What is LoRA, and why is it used instead of full fine-tuning?",
      "round": [
        "tech1"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "lora",
        "peft"
      ],
      "why": "The standard mechanism question. It should be answered with the operational benefits, not just the maths.",
      "simple": "Full fine-tuning updates every weight in the model. That needs a lot of GPU memory: the weights, a gradient for each weight, and the optimiser's extra running numbers for each weight - several times the model's size. And it produces a complete new copy of the model.\n\nLoRA, low-rank adaptation, freezes the original weights. Next to some weight matrices it adds two small, thin matrices, and only those are trained. Multiplied together, they form an update of the right shape. \"Low rank\" just means the update is built from a few directions instead of a full grid of numbers. So the trainable part is a tiny fraction of the model.\n\nThree things follow in practice. Training fits on much smaller hardware. The result is a small adapter file, megabytes rather than gigabytes, easy to version and ship. And you can host one base model and swap adapters per customer or per task - this is what makes per-customer fine-tunes practical to serve.\n\nThe main setting is rank. Higher rank means more capacity and a bigger adapter. QLoRA goes further by storing the frozen base in 4-bit (ft-09).",
      "points": [
        "Base weights frozen; small low-rank matrices trained alongside them.",
        "Trainable parameters are a tiny fraction of the model.",
        "Trains on far smaller hardware than full fine-tuning.",
        "The artefact is a small adapter - easy to version, ship and swap.",
        "One base model, many adapters - the key to multi-tenant serving.",
        "The adapter can be merged into the base weights, so it adds no inference latency.",
        "Rank is the main knob: higher rank means more capacity and a bigger adapter.",
        "QLoRA quantises the frozen base to 4-bit, cutting memory further (ft-09)."
      ],
      "say": "Full fine-tuning updates every weight and needs memory for gradients and optimiser state several times the model size, producing a whole new copy. LoRA freezes the base and trains small low-rank matrices alongside it, so the trainable parameter count is tiny. That means smaller hardware, a megabyte-scale adapter instead of a gigabyte-scale model, and one base model serving many adapters. QLoRA quantises the frozen base to 4-bit as well.",
      "numbers": "Rough memory arithmetic for a 7B model: full fine-tuning with Adam in mixed precision needs about 16 bytes per parameter for weights, gradients and optimiser state - roughly 110 GB before activations, so several GPUs. LoRA on a 16-bit frozen base needs about 14 GB for the weights plus a small adapter; QLoRA's 4-bit base is about 4 GB, which is why 7B–13B fine-tunes fit on one 24 GB GPU with modest sequence lengths. Rank 8–16 is a common starting point - tune it, do not guess it.",
      "wrong": "\"LoRA is faster fine-tuning.\" It is cheaper and lighter, and the adapter-swapping property is the bigger deal. Speed alone misses why it changed how teams deploy.",
      "follow": "You have forty customers each wanting their own tone. How do you serve that?",
      "followAnswer": "First I check whether forty system prompts with a few examples each get close, because that costs nothing extra to serve. If they really need fine-tunes, I train one LoRA adapter per customer on the same base and use multi-LoRA serving - vLLM, for example, can keep many adapters loaded on one base model and pick one per request. Each adapter is versioned and evaluated per customer, with the base as fallback."
    },
    {
      "id": "ft-09",
      "q": "What is QLoRA, and how does it fit a big model on one GPU?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "qlora",
        "quantisation",
        "peft",
        "memory"
      ],
      "why": "The follow-up to LoRA in most fine-tuning rounds. It checks whether you know where GPU memory actually goes.",
      "simple": "QLoRA is LoRA on top of a compressed base model. The big frozen model is stored in 4-bit, and only the small LoRA adapters are trained, in 16-bit. That is how a model that would need several GPUs to fine-tune fits on one.\n\nStart with where memory goes. Full fine-tuning keeps the weights, a gradient for every weight, and the optimiser's running averages for every weight - roughly 16 bytes per parameter. LoRA drops the gradients and optimiser state for the frozen base, but the base still sits in memory at 2 bytes per parameter.\n\nQLoRA shrinks that base to about half a byte per parameter. Quantisation means storing each number with fewer bits, like saving a photo at lower quality. QLoRA adds three tricks: NF4, a 4-bit format suited to the bell-curve shape of model weights; double quantisation, which also compresses the scaling constants; and paged optimisers, which move memory spikes to CPU RAM instead of crashing.\n\nThe trade-off: each step is slower, because weights are unpacked to 16-bit on the fly. Quality is usually close to 16-bit LoRA, but check it on your eval set. And decide how you will serve it: merge the adapter into a 16-bit base, or keep it on the quantised base it was trained against.",
      "points": [
        "**Base in 4-bit, adapters in 16-bit.** Only the adapters train.",
        "Memory per parameter: about 16 bytes for a full fine-tune, 2 bytes for a LoRA base, 0.5 bytes for a QLoRA base.",
        "**NF4** - a 4-bit number format suited to how weights are distributed.",
        "**Double quantisation** - compresses the quantisation constants too.",
        "**Paged optimisers** - spill memory spikes to CPU RAM instead of failing.",
        "Cost: slower steps; quality usually near 16-bit LoRA - verify on your eval set.",
        "In code: `bitsandbytes` 4-bit loading plus Hugging Face `peft` for the adapters.",
        "Activations still grow with sequence length - long inputs can run out of memory anyway."
      ],
      "say": "QLoRA is LoRA on a 4-bit base model. The frozen base weights are quantised to 4-bit with the NF4 format, and only the small LoRA adapters train in 16-bit. That cuts the base from about two bytes per parameter to about half a byte, so a 7B model's weights drop from roughly 14 gigabytes to about 4. Paged optimisers absorb memory spikes. The cost is slower steps and a possible small quality loss, which I measure.",
      "numbers": "The QLoRA paper (2023) fine-tuned a 65B model on a single 48 GB GPU. For a 7B model: about 14 GB of weights in 16-bit and about 4 GB in 4-bit, before activations and adapter state. Activations grow with sequence length and batch size, so budget for them separately.",
      "wrong": "\"QLoRA gives you a 4-bit model at the end.\" What you train is a 16-bit adapter. Whether you serve it merged into a 16-bit base or on the 4-bit base is a separate decision you must make and test.",
      "follow": "Memory is fine now, but training runs out of memory on long documents. What do you change?",
      "followAnswer": "The weights are no longer the problem; activations are, and they grow with sequence length. I turn on gradient checkpointing, which recomputes activations instead of storing them. I cut the micro-batch to one and use gradient accumulation to keep the effective batch size. I use FlashAttention-style kernels where the stack supports them. And I check whether the documents really need that length or can be split."
    },
    {
      "id": "ft-03",
      "q": "SFT, DPO, RLHF - what is the difference?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "alignment",
        "dpo",
        "rlhf"
      ],
      "why": "A vocabulary check that reveals whether you know what data each method needs.",
      "simple": "**Short version: SFT learns from correct answers. RLHF and DPO learn from \"A is better than B\" comparisons.** The practical difference is the data each one needs.\n\nSupervised fine-tuning (SFT) needs examples: an input and the exact response you want. The model learns to imitate them. Most applied fine-tunes are SFT, and for most business problems it is enough.\n\nRLHF, reinforcement learning from human feedback, needs preferences instead. People compare two outputs and pick the better one. A separate reward model learns to predict those choices. Then the main model is trained with reinforcement learning to score well on that reward. It is powerful, but it has many moving parts and is hard to keep stable.\n\nDPO, direct preference optimisation, uses the same preference pairs but skips the reward model and the RL loop. It trains the model directly to make the preferred answer more likely than the rejected one. It is much simpler, which is why ordinary teams can now do preference tuning.\n\nA common recipe is SFT first, then DPO on top. Choose by the data you can collect: SFT when you can write the right answer, DPO when you can only say which of two is better - often the case for tone and helpfulness.\n\nReasoning models trained against automatic checkers (GRPO) are a separate story - see ft-11.",
      "points": [
        "SFT - input and correct output pairs. Imitation. Most applied fine-tunes are this.",
        "RLHF - preference pairs, a reward model, then RL. Powerful, heavy, harder to stabilise.",
        "DPO - same preference data, no reward model, direct optimisation. Simpler and stable.",
        "Common recipe: SFT first, then DPO on top.",
        "Choose by the data you can realistically collect.",
        "Preference data is often easier to gather than gold answers - people can judge faster than they can write.",
        "RL with automatic checkers for reasoning models (GRPO) - ft-11."
      ],
      "say": "They differ in the data they need. Supervised fine-tuning uses input and correct-output pairs and teaches imitation - most applied fine-tunes are this. RLHF uses preference comparisons to train a reward model, then optimises with reinforcement learning, which is powerful and unstable. DPO uses the same preference pairs but skips the reward model and optimises directly, which is far simpler. I choose by what data I can actually collect.",
      "numbers": "Preference data is usually cheaper to collect than gold answers - judging two outputs is faster than authoring one. That often decides the method.",
      "wrong": "\"DPO is a better version of RLHF.\" It is simpler and more stable, not universally better. Well-tuned online RL can still beat it, and frontier labs still use RL. Overstating it invites a correction.",
      "follow": "You have thumbs-up and thumbs-down from production. Which method does that fit?",
      "followAnswer": "Thumbs are not pairs, so DPO does not fit directly. Unpaired good-or-bad labels suit KTO, a preference method built for exactly that. Or I build pairs: a thumbs-down answer and a later thumbs-up answer to the same question make one pair. Reviewed thumbs-up answers can also become SFT data. Either way I clean the data first, because thumbs are sparse, noisy and skewed toward a few vocal users."
    },
    {
      "id": "ft-04",
      "q": "How much data do you need, and where does it come from?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "data",
        "process"
      ],
      "why": "The practical blocker. Candidates who have actually fine-tuned lead with the data problem, not the method.",
      "simple": "Far less than people expect for style and format, and far more than people expect for anything requiring judgement.\n\nFor a tone or a rigid output format, a few hundred good examples often move the needle. For a nuanced classification with real edge cases, you are into thousands, and the edge cases are the expensive part.\n\nQuality dominates quantity, and this is the sentence to say. Five hundred carefully reviewed examples often beat five thousand scraped ones, because the model will faithfully learn whatever inconsistency is in your data - including the disagreements between two annotators who were never given the same rubric.\n\nSources, in order of usefulness: production logs with human-corrected outputs, which are ideal because they match the real distribution; expert-authored examples for the cases production has not seen; and synthetic generation, useful for volume and dangerous alone, because a model generating its own training data reinforces what it already does.\n\nAnd always hold out a test set before you start. Fine-tuning without one is not an experiment.",
      "points": [
        "Style and format: often a few hundred good examples.",
        "Nuanced judgement: thousands, and the edge cases dominate the cost.",
        "Quality beats quantity. The model learns your inconsistencies faithfully.",
        "Best source: production outputs corrected by a human.",
        "Synthetic data adds volume but tends to reinforce existing behaviour - do not rely on it alone or without human review.",
        "Format it like production: same chat template and system prompt, loss on the assistant reply only, near-duplicates removed, no overlap with the test set.",
        "Hold out a test set before training, or you cannot claim anything afterwards."
      ],
      "say": "Less than people expect for style - a few hundred good examples often move a tone or a format. Thousands for anything needing judgement, and the edge cases dominate the cost. Quality beats quantity, because the model faithfully learns any inconsistency between annotators. My best source is production outputs corrected by a human, since it matches the real distribution. And I hold out a test set before training.",
      "numbers": "Rule of thumb: hundreds for format and tone, thousands for judgement. Hold out at least 10–20% as a test set that never influences training.",
      "wrong": "\"We generated the training data with a larger model.\" Distillation is legitimate and must be said as such, with human review. Presented as a shortcut, it means training your model on another model's mistakes.",
      "follow": "Your annotators disagree on 20% of cases. What does that mean for the fine-tune?",
      "followAnswer": "It means the labels are noisy, and the model will learn that noise - it cannot be more consistent than its teachers. Before training I read the disagreements. Usually the rubric is unclear, so I fix the guidelines, re-label, and have a senior expert settle the hard cases. Then I measure agreement again, for example with Cohen's kappa. Cases that stay genuinely ambiguous may need an 'unsure, escalate' label instead."
    },
    {
      "id": "ft-08",
      "q": "How do you evaluate a fine-tuned model and prove it is actually better?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "evaluation",
        "process",
        "judgement"
      ],
      "why": "Everyone can describe running a fine-tune. Far fewer can prove the result was worth shipping, which is the actual decision.",
      "simple": "Training loss is not the shipping metric. It only tells me how well the model fits the training objective, so I evaluate on held-out data that was separated before training.\n\nThe split must avoid leakage. If many rows come from the same customer, document or time period, I split by that unit rather than randomly scattering near-duplicates across train and test.\n\nThen I compare the fine-tuned model against a strong base-model baseline on exactly the same evaluation set, prompt and decoding settings. I check the target task first, then general instruction-following and safety behaviour so I can see whether the fine-tune improved one area while damaging another.\n\nI also report serving cost and latency. A small fine-tuned model can be valuable even if quality is similar when it is much cheaper or faster; a fine-tune that adds operational complexity without a clear quality or cost benefit is not worth shipping.\n\nBefore full rollout, I shadow or canary it on real traffic and keep the evaluation set versioned so results remain comparable over time.",
      "points": [
        "Training loss is not evaluation. It falls while product quality degrades.",
        "Held-out set split by document, customer or time - never randomly across near-duplicates.",
        "Always benchmark against the base model with the same prompt and decoding settings.",
        "'A good prompt matched it' is a real and valuable result - it saves owning a model.",
        "Test the target task, general capability (forgetting) and safety behaviour separately.",
        "Report cost and latency next to quality - that is usually the actual business case.",
        "Canary on real traffic before committing; freeze and version the eval set."
      ],
      "say": "I do not judge a fine-tune by training loss. I use held-out data split by the right unit, such as document or customer, and compare against a strong base-model baseline with the same prompt and decoding settings. I evaluate the target task, general instruction-following and safety behaviour, then report cost and latency beside quality. If it has no clear benefit, I do not take on the extra model lifecycle. Before rollout, I shadow or canary it on real traffic.",
      "numbers": "Use the measured quality, cost and latency delta against a strong baseline. There is no universal improvement threshold that makes a fine-tune worth operating.",
      "wrong": "'Loss went down and the samples look good.' Eyeballing samples finds what you hoped for, and loss measures the wrong thing entirely.",
      "follow": "Your fine-tune wins on the task set and loses on general instruction following. Ship or not?",
      "followAnswer": "It depends on how the model is used. If it sits behind one narrow endpoint with a fixed prompt and a schema, broad instruction-following may not matter, so I test only the instructions my product actually sends. If users can send open-ended requests, it is a real regression. Then I retrain with general instruction data mixed in, or with lower rank and fewer epochs, and compare again."
    },
    {
      "id": "ft-05",
      "q": "What is catastrophic forgetting and how do you avoid it?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "risks",
        "evaluation"
      ],
      "why": "A real failure mode. Whether you evaluate beyond the task you trained on.",
      "simple": "Fine-tune a model hard on one narrow task and it gets better at that task and worse at everything else. Train it to output strict JSON for claim summaries and it may lose the ability to hold a normal conversation, or to refuse an unsafe request as reliably as before.\n\nThat last part is the one that matters most and gets checked least: fine-tuning can weaken safety behaviour, even when your training data contains nothing unsafe.\n\nHow you avoid it. LoRA rather than full fine-tuning, which tends to forget less because the base weights stay frozen (it also learns less, so it is a trade-off). Lower learning rates and fewer epochs - most forgetting comes from training too hard for too long. Mixing in some general examples alongside the task data. And stopping early, using the held-out set rather than training to convergence.\n\nBut the real answer is detection, not prevention. Evaluate the fine-tuned model on general capability and on safety, not just on your task metric. A model that scores brilliantly on your benchmark and has quietly lost its refusal behaviour is a worse outcome than not fine-tuning.",
      "points": [
        "Narrow training degrades unrelated capabilities, including safety behaviour.",
        "LoRA tends to forget less than full fine-tuning (and learns less) - the base is frozen.",
        "Lower learning rate, fewer epochs, early stopping on a held-out set.",
        "Mix general examples into the task data.",
        "Evaluate general capability and safety, not only your task metric.",
        "Detection matters more than prevention. Assume some degradation and measure it."
      ],
      "say": "Training hard on one narrow task makes the model worse at everything else, including safety behaviour, even when the training data contains nothing unsafe. LoRA tends to forget less because the base is frozen, and lower learning rates with early stopping help. But the real answer is detection: I evaluate the tuned model on general capability and safety, not just my task metric, because a model that aces the benchmark and lost its refusals is a worse outcome.",
      "numbers": "Keep a general-capability and a safety evaluation set alongside your task set, and run all three on every checkpoint. One number is not enough to accept a fine-tune.",
      "wrong": "\"We validated it on our test set and it improved.\" That measures the thing you trained for. It cannot see what you broke.",
      "follow": "Your fine-tune improved the task 12 points and refusal rate dropped. Ship it?",
      "followAnswer": "Not as it stands. A refusal drop is a safety regression, and in a regulated product that blocks release however good the task gain is. I find which refusal cases broke, then retrain with safety examples mixed into the data and a lower learning rate or fewer epochs, and re-run all three evaluation sets. If refusals still drop, I add an external guardrail or keep the base model."
    },
    {
      "id": "ft-10",
      "q": "What is PEFT? Compare LoRA, adapters, prefix tuning and prompt tuning.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "peft",
        "lora",
        "theory"
      ],
      "why": "A vocabulary check on the parameter-efficient family. The mark is knowing why LoRA became the default, not reciting four definitions.",
      "simple": "PEFT means parameter-efficient fine-tuning. You freeze the big model and train a small number of new parameters. Every method in the family does that. They differ in where the new parameters go.\n\nAdapters were the first popular version. You insert small extra layers inside each transformer block and train only those. It works, but the extra layers stay in the path at inference, so every request gets a little slower.\n\nPrompt tuning and prefix tuning add learned vectors instead. Think of them as a \"soft prompt\": not words, but numbers the model reads as if they were extra tokens. Prompt tuning adds them at the input only. Prefix tuning adds them at every layer, which gives more capacity. They are tiny, but they use up some context, and prompt tuning in particular works less well on smaller models.\n\nLoRA adds a small low-rank update beside existing weight matrices. After training you can merge it into the weights, so there is no extra inference cost. It is also stable and well supported. That is why LoRA and its variants, such as QLoRA and DoRA, are the default today.\n\nThe senior point: the method matters less than the data and the evaluation. Start with LoRA, and switch only if a measured problem demands it.",
      "points": [
        "**PEFT** = freeze the base, train a small set of new parameters.",
        "**Adapters** - small layers inside each block. Adds some inference latency.",
        "**Prompt tuning** - learned soft tokens at the input. Tiny; weaker on smaller models.",
        "**Prefix tuning** - learned vectors at every layer's attention. More capacity than prompt tuning.",
        "**LoRA** - low-rank update beside weight matrices; can be merged, so no extra latency.",
        "Variants: QLoRA (4-bit base), DoRA (splits the update into size and direction).",
        "Hugging Face `peft` implements most of these behind one API."
      ],
      "say": "PEFT means freezing the base model and training a small set of new parameters. Adapters insert small layers inside each block, which adds inference latency. Prompt tuning and prefix tuning learn soft token vectors, at the input or at every layer - tiny, but less reliable on smaller models. LoRA learns a low-rank update beside existing weights and can be merged afterwards, so it adds no latency. That is why LoRA is my default.",
      "numbers": "LoRA at rank 8-16 typically trains well under 1% of a model's parameters. Soft prompts are smaller still - often tens of thousands to a few hundred thousand parameters. Exact counts depend on rank, target modules and model size.",
      "wrong": "\"Prompt tuning is the same as prompt engineering.\" Prompt tuning learns numeric vectors with gradient descent; prompt engineering writes words. Mixing them up tells the panel you have only read the names.",
      "follow": "When would you skip LoRA and do a full fine-tune instead?",
      "followAnswer": "When the change is large rather than a behaviour tweak - for example continued pre-training on a new language or a big new domain, where a low-rank update limits how much the model can learn. Or when the model is small and I have the GPUs and data to do it properly. Even then I run LoRA first as a baseline, because if it gets close, the cheaper option wins."
    },
    {
      "id": "ft-11",
      "q": "How are reasoning models trained with RL - what are GRPO and verifiable rewards?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "rl",
        "grpo",
        "reasoning",
        "alignment"
      ],
      "why": "The 2025-26 follow-up to SFT versus DPO. It checks whether you know what changed after DeepSeek-R1, and when an applied team should actually care.",
      "simple": "Reasoning models are trained with reinforcement learning on tasks where the answer can be checked automatically. This is called RL with verifiable rewards, or RLVR. A maths answer is right or wrong. Code passes the tests or it does not. No human has to judge each output.\n\nClassic RLHF used PPO, an RL algorithm that needs a second large network, a critic, to estimate how good each answer is likely to be. That is expensive and fiddly.\n\nGRPO, group relative policy optimisation, drops the critic. For each prompt it samples a group of answers, say eight. The checker scores each one. An answer's advantage is simply how much better it scored than the group average. The model is pushed toward the above-average answers. DeepSeek introduced GRPO in 2024, and DeepSeek-R1 made it famous in early 2025.\n\nWhat it means for an applied team: you rarely need it. It pays off only with a narrow task, a reliable automatic checker, and a model that already gets it right sometimes. RL sharpens what the model can sometimes do; it does not teach from zero. And the checker is the whole game. If it can be fooled, the model will learn to fool it. That is called reward hacking.",
      "points": [
        "**RLVR** - the reward comes from an automatic check: exact answer, unit tests, schema validation.",
        "**PPO** needs a separate critic model; **GRPO** replaces it with the group's average score.",
        "Sample several answers per prompt, score each, push toward the above-average ones.",
        "Made famous by DeepSeek-R1 (2025); variants such as DAPO and GSPO adjust it for stability.",
        "Needs a base that sometimes succeeds - if a whole group scores the same, there is no learning signal.",
        "**Reward hacking** - a weak checker gets gamed. Read sampled outputs, not just the reward curve.",
        "Applied default is still SFT, then DPO; RL only with a checker you trust."
      ],
      "say": "Reasoning models are mostly trained with RL on verifiable rewards - maths with a known answer, code with unit tests - so no human judges each output. GRPO made that cheaper. Instead of PPO's separate critic model, it samples a group of answers per prompt, scores each with the checker, and pushes the model toward the above-average ones. For an applied team it only pays off with a narrow task, a reliable checker and a base that sometimes succeeds.",
      "numbers": "Groups of roughly 4-16 samples per prompt are common. If every answer in a group gets the same reward - all right or all wrong - that prompt teaches nothing, so filter training prompts to ones the model solves only some of the time.",
      "wrong": "\"GRPO is how you make any model better at our task.\" Without a checker you trust, RL learns to please the reward, not to be correct. Most business tasks lack that checker, which is why SFT and DPO stay the default.",
      "follow": "Your task is extracting fields from invoices. Could you use GRPO?",
      "followAnswer": "Possibly, because extraction is checkable: compare the extracted fields with labelled ground truth, reward each correct field, and add a reward for valid schema. But I would first try a strong prompt with structured output, then SFT on labelled invoices. RL is worth it only if SFT plateaus and I have enough labels for a reliable reward. And I would audit outputs for reward hacking, like empty fields scoring well."
    },
    {
      "id": "ft-06",
      "q": "What is distillation and when would you use it?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "distillation",
        "cost"
      ],
      "why": "The cost-driven version of fine-tuning, and increasingly the most practical one.",
      "simple": "Distillation means using a large capable model to teach a small one. You run the large model over your real inputs, keep its outputs, and fine-tune the small model on those pairs.\n\nThe case for it is almost always economics. You have a task where a large model works well and costs too much at your volume. If a small model can be brought close on that one narrow task, you get most of the quality at a fraction of the cost and latency.\n\nWhat makes it work: use your real production inputs wherever possible, topping up with synthetic ones only for gaps, so the student learns your actual distribution. Have humans review a sample of the teacher's outputs, because you are about to bake its mistakes into a permanent artefact. And evaluate the student against the teacher on a held-out set, not against a benchmark.\n\nThe two things to check before starting: whether your provider's terms permit training on their outputs, which varies and is a real constraint, and whether the narrowness holds - a distilled model is good at the task it was distilled for and nothing else.",
      "points": [
        "Large teacher generates outputs; small student is fine-tuned on them.",
        "The case is economics: most of the quality at a fraction of cost and latency.",
        "Use real production inputs so the student learns the real distribution.",
        "Human-review a sample - the teacher's mistakes become permanent.",
        "Check the provider's terms on training from their outputs. This varies.",
        "The student is narrow. Do not expect general capability."
      ],
      "say": "Distillation uses a large model to teach a small one - run the teacher over real production inputs, keep the outputs, and fine-tune the student on those pairs. The case is economics: most of the quality on one narrow task at a fraction of cost and latency. I use real inputs rather than synthetic, human-review a sample because the teacher's mistakes become permanent, and check the provider's terms on training from outputs.",
      "numbers": "The saving is the point - quantify it before starting. A distilled small model can be an order of magnitude cheaper per request than the teacher - measure it on your own traffic.",
      "wrong": "Not mentioning the licensing question. At an enterprise, training on another provider's outputs without checking terms is a legal problem, not a technical one.",
      "follow": "The student matches the teacher on your test set. What are you still worried about?"
    },
    {
      "id": "ft-07",
      "q": "You fine-tuned a model. How do you run it in production?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "operations",
        "serving",
        "llmops"
      ],
      "why": "The part people forget. Training is a project; serving it is a commitment.",
      "simple": "This is where the real cost shows up, and naming it is what makes the earlier restraint credible.\n\nYou now own a model artefact. It needs versioning, storage, and a record of which data version and base model produced it, because in a year someone will ask and \"we do not know\" is not an acceptable answer in a regulated setting.\n\nServing: either a provider's hosted fine-tuning, which is simplest, or your own inference stack - and self-hosting means GPU capacity, autoscaling, and someone on call for it.\n\nEvaluation does not stop. The base model may be deprecated, your data distribution will drift, and you need a scheduled re-evaluation to notice.\n\nRollout like any model change: shadow first, then canary, with the previous version one flag away.\n\nAnd plan the exit. Base models improve quickly, and a fine-tune that beat the general model last year may lose to the current one. Re-check that comparison periodically - being willing to delete your own model is a senior signal.",
      "points": [
        "Version the artefact with its base model and training data version.",
        "Hosted fine-tuning is simplest; self-hosting means GPUs, autoscaling and on-call.",
        "Scheduled re-evaluation - the base can be deprecated and your data drifts.",
        "Shadow, then canary, with instant rollback to the previous version.",
        "Periodically re-compare against the current general model.",
        "Be willing to delete it when the general model catches up."
      ],
      "say": "I now own an artefact, so it gets versioned with its base model and training data version, because someone will ask a year later. Serving is either hosted fine-tuning or my own GPU stack with autoscaling and on-call. Evaluation continues on a schedule, since the base can be deprecated and my data drifts. Rollout is shadow then canary with instant rollback. And I re-compare against the current general model periodically.",
      "numbers": "Re-compare against the current general model at least quarterly. Base models improve fast enough that a fine-tune can stop being worth its operational cost within a year.",
      "wrong": "\"We deployed it and it works.\" It skips versioning, drift, deprecation and the exit plan, which together are most of the real cost.",
      "follow": "The new general model beats your fine-tune. What do you do?"
    }
  ]
};
