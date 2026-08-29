/* Topic 10 — Fine-tuning and adaptation.
   Grounding: public JDs listing fine-tuning / LoRA, plus documented method
   behaviour and the operational cost of owning a model artefact. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["10-fine-tuning"] = {
  lede: "Interviewers ask about fine-tuning to see whether you reach for it too early. Almost every candidate can describe LoRA. Far fewer can say when they chose not to fine-tune and why, or name what it costs to own a model artefact for the next three years. The restraint is what is being marked.",
  grounding: "public JDs naming LoRA and fine-tuning + documented method behaviour",
  evening: ["ft-01", "ft-02", "ft-04", "ft-07"],

  cards: [
    {
      id: "ft-01",
      q: "When should you fine-tune instead of using prompting or RAG?",
      round: ["tech1", "tech2", "manager"],
      level: "5-10",
      tags: ["fine-tuning", "judgement", "trade-off"],
      why: "The gate question for the whole topic. Reaching for fine-tuning first is the classic mid-level answer.",
      simple:
        "The rule that holds up: fine-tuning teaches behaviour, retrieval supplies knowledge.\n\n" +
        "If the model does not know a fact, fine-tuning is the wrong tool. Facts change, and retraining every time a policy is updated is absurd. That is RAG.\n\n" +
        "If the model knows what to say but not how to say it — your house tone, a rigid output format, a domain style, a classification boundary specific to your business — that is behaviour, and that is where fine-tuning wins.\n\n" +
        "The other two real cases are cost and latency. A small fine-tuned model matching a large general model on one narrow task can be dramatically cheaper and faster at high volume. That is a legitimate and often overlooked reason.\n\n" +
        "And what to try first, in order: better prompting, few-shot examples, retrieval, then a small model with a schema. Fine-tuning is what you do when those are exhausted and you have the data, because you are choosing to own a model artefact — versioning, hosting, evaluation and drift — indefinitely.",
      points: [
        "Behaviour and format → fine-tuning. Facts and knowledge → retrieval.",
        "Cost and latency at high volume on a narrow task → a strong, underrated case.",
        "Try first: prompting, few-shot, retrieval, small model with a schema.",
        "Fine-tuning means owning a model artefact — versioning, hosting, drift, forever.",
        "It does not stop hallucination. A fine-tuned model invents just as confidently."
      ],
      say: "Fine-tuning teaches behaviour; retrieval supplies knowledge. If the model does not know a fact, retraining is the wrong tool, because facts change. If it knows what to say but not how — house tone, a rigid format, a business-specific classification boundary — that is fine-tuning. The other real case is cost: a small fine-tuned model matching a large one on a narrow task at high volume. I try prompting, few-shot and retrieval first.",
      numbers: "A small fine-tuned model can be an order of magnitude cheaper per request than a large general one on a narrow task. That is the case worth building a business argument on.",
      wrong: "\"We fine-tuned it on our documents so it knows our data.\" This is the single most common wrong answer in the topic. Training on documents teaches style, not reliable recall, and it is unfixable when a document changes.",
      follow: "So what would you do if the model needs both our tone and our latest policy?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-02",
      q: "What is LoRA, and why is it used instead of full fine-tuning?",
      round: ["tech1"],
      level: "5-10",
      tags: ["fine-tuning", "lora", "peft"],
      why: "The standard mechanism question. It should be answered with the operational benefits, not just the maths.",
      simple:
        "Full fine-tuning updates every weight in the model. That needs enough memory to hold the weights, their gradients and the optimiser state — several times the model size — and it produces a complete new copy of the model.\n\n" +
        "LoRA freezes the original weights entirely and inserts small trainable matrices alongside them. Instead of learning a full-size update, it learns a low-rank approximation of one — two thin matrices whose product has the shape of the update. Because they are thin, the trainable parameter count is a tiny fraction of the model.\n\n" +
        "Three consequences that matter operationally. Training fits on far smaller hardware. The artefact is a small adapter file, megabytes rather than gigabytes, so you can version and ship it easily. And you can host one base model and swap adapters per customer or per task, which is the property that makes multi-tenant fine-tuning practical at all.\n\n" +
        "QLoRA goes further by quantising the frozen base to 4-bit during training, which is what lets people fine-tune large models on a single GPU.",
      points: [
        "Base weights frozen; small low-rank matrices trained alongside them.",
        "Trainable parameters are a tiny fraction of the model.",
        "Trains on far smaller hardware than full fine-tuning.",
        "The artefact is a small adapter — easy to version, ship and swap.",
        "One base model, many adapters — the key to multi-tenant serving.",
        "QLoRA quantises the frozen base to 4-bit, cutting memory further.",
        "Rank is the main knob: higher rank means more capacity and a bigger adapter."
      ],
      say: "Full fine-tuning updates every weight and needs memory for gradients and optimiser state several times the model size, producing a whole new copy. LoRA freezes the base and trains small low-rank matrices alongside it, so the trainable parameter count is tiny. That means smaller hardware, a megabyte-scale adapter instead of a gigabyte-scale model, and one base model serving many adapters. QLoRA quantises the frozen base to 4-bit as well.",
      numbers: "Rank 8–16 is a common starting point for style and format adaptation. Higher ranks buy capacity and a larger adapter — tune it, do not guess it.",
      wrong: "\"LoRA is faster fine-tuning.\" It is cheaper and lighter, and the adapter-swapping property is the bigger deal. Speed alone misses why it changed how teams deploy.",
      follow: "You have forty customers each wanting their own tone. How do you serve that?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-03",
      q: "SFT, DPO, RLHF — what is the difference?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["fine-tuning", "alignment", "dpo", "rlhf"],
      why: "A vocabulary check that reveals whether you know what data each method needs.",
      simple:
        "They differ in what data they consume, and that is the practical distinction.\n\n" +
        "Supervised fine-tuning needs examples of correct outputs — an input and the response you want. It teaches the model to imitate. This is what almost every applied fine-tune actually is, and for most business problems it is enough.\n\n" +
        "RLHF needs preferences rather than answers: people compare two outputs and say which is better. A reward model is trained on those comparisons, then the language model is optimised against that reward with reinforcement learning. Powerful and operationally heavy — several moving parts, unstable to train.\n\n" +
        "DPO uses the same preference data but skips the reward model and the RL loop, optimising the model directly against the preferred-versus-rejected pairs. Much simpler, much more stable, and it is why preference tuning became something ordinary teams can do.\n\n" +
        "So the applied answer: SFT when you can write the right answer, DPO when you can only say which of two is better — which is often the case for tone and helpfulness.",
      points: [
        "SFT — input and correct output pairs. Imitation. Most applied fine-tunes are this.",
        "RLHF — preference pairs, a reward model, then RL. Powerful, heavy, unstable.",
        "DPO — same preference data, no reward model, direct optimisation. Simpler and stable.",
        "Choose by the data you can realistically collect.",
        "Preference data is often easier to gather than gold answers — people can judge faster than they can write."
      ],
      say: "They differ in the data they need. Supervised fine-tuning uses input and correct-output pairs and teaches imitation — most applied fine-tunes are this. RLHF uses preference comparisons to train a reward model, then optimises with reinforcement learning, which is powerful and unstable. DPO uses the same preference pairs but skips the reward model and optimises directly, which is far simpler. I choose by what data I can actually collect.",
      numbers: "Preference data is usually cheaper to collect than gold answers — judging two outputs is faster than authoring one. That often decides the method.",
      wrong: "\"DPO is a better version of RLHF.\" Simpler and more stable, not universally better. RLHF still has advantages at frontier scale, and overstating it invites a correction.",
      follow: "You have thumbs-up and thumbs-down from production. Which method does that fit?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-04",
      q: "How much data do you need, and where does it come from?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["fine-tuning", "data", "process"],
      why: "The practical blocker. Candidates who have actually fine-tuned lead with the data problem, not the method.",
      simple:
        "Far less than people expect for style and format, and far more than people expect for anything requiring judgement.\n\n" +
        "For a tone or a rigid output format, a few hundred good examples often move the needle. For a nuanced classification with real edge cases, you are into thousands, and the edge cases are the expensive part.\n\n" +
        "Quality dominates quantity, and this is the sentence to say. Five hundred carefully reviewed examples beat five thousand scraped ones, because the model will faithfully learn whatever inconsistency is in your data — including the disagreements between two annotators who were never given the same rubric.\n\n" +
        "Sources, in order of usefulness: production logs with human-corrected outputs, which are ideal because they match the real distribution; expert-authored examples for the cases production has not seen; and synthetic generation, useful for volume and dangerous alone, because a model generating its own training data reinforces what it already does.\n\n" +
        "And always hold out a test set before you start. Fine-tuning without one is not an experiment.",
      points: [
        "Style and format: often a few hundred good examples.",
        "Nuanced judgement: thousands, and the edge cases dominate the cost.",
        "Quality beats quantity. The model learns your inconsistencies faithfully.",
        "Best source: production outputs corrected by a human.",
        "Synthetic data adds volume and reinforces existing behaviour. Never use it alone.",
        "Hold out a test set before training, or you cannot claim anything afterwards."
      ],
      say: "Less than people expect for style — a few hundred good examples often move a tone or a format. Thousands for anything needing judgement, and the edge cases dominate the cost. Quality beats quantity, because the model faithfully learns any inconsistency between annotators. My best source is production outputs corrected by a human, since it matches the real distribution. And I hold out a test set before training.",
      numbers: "Rule of thumb: hundreds for format and tone, thousands for judgement. Hold out at least 10–20% as a test set that never influences training.",
      wrong: "\"We generated the training data with a larger model.\" Distillation is legitimate and must be said as such, with human review. Presented as a shortcut, it means training your model on another model's mistakes.",
      follow: "Your annotators disagree on 20% of cases. What does that mean for the fine-tune?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-05",
      q: "What is catastrophic forgetting and how do you avoid it?",
      round: ["tech2"],
      level: "5-10",
      tags: ["fine-tuning", "risks", "evaluation"],
      why: "A real failure mode. Whether you evaluate beyond the task you trained on.",
      simple:
        "Fine-tune a model hard on one narrow task and it gets better at that task and worse at everything else. Train it to output strict JSON for claim summaries and it may lose the ability to hold a normal conversation, or to refuse an unsafe request as reliably as before.\n\n" +
        "That last part is the one that matters most and gets checked least: fine-tuning can weaken safety behaviour, even when your training data contains nothing unsafe.\n\n" +
        "How you avoid it. LoRA rather than full fine-tuning, because frozen base weights lose less. Lower learning rates and fewer epochs — most forgetting comes from training too hard for too long. Mixing in some general examples alongside the task data. And stopping early, using the held-out set rather than training to convergence.\n\n" +
        "But the real answer is detection, not prevention. Evaluate the fine-tuned model on general capability and on safety, not just on your task metric. A model that scores brilliantly on your benchmark and has quietly lost its refusal behaviour is a worse outcome than not fine-tuning.",
      points: [
        "Narrow training degrades unrelated capabilities, including safety behaviour.",
        "LoRA forgets less than full fine-tuning — the base is frozen.",
        "Lower learning rate, fewer epochs, early stopping on a held-out set.",
        "Mix general examples into the task data.",
        "Evaluate general capability and safety, not only your task metric.",
        "Detection matters more than prevention. Assume some degradation and measure it."
      ],
      say: "Training hard on one narrow task makes the model worse at everything else, including safety behaviour, even when the training data contains nothing unsafe. LoRA forgets less because the base is frozen, and lower learning rates with early stopping help. But the real answer is detection: I evaluate the tuned model on general capability and safety, not just my task metric, because a model that aces the benchmark and lost its refusals is a worse outcome.",
      numbers: "Keep a general-capability and a safety evaluation set alongside your task set, and run all three on every checkpoint. One number is not enough to accept a fine-tune.",
      wrong: "\"We validated it on our test set and it improved.\" That measures the thing you trained for. It cannot see what you broke.",
      follow: "Your fine-tune improved the task 12 points and refusal rate dropped. Ship it?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-06",
      q: "What is distillation and when would you use it?",
      round: ["tech2"],
      level: "5-10",
      tags: ["fine-tuning", "distillation", "cost"],
      why: "The cost-driven version of fine-tuning, and increasingly the most practical one.",
      simple:
        "Distillation means using a large capable model to teach a small one. You run the large model over your real inputs, keep its outputs, and fine-tune the small model on those pairs.\n\n" +
        "The case for it is almost always economics. You have a task where a large model works well and costs too much at your volume. If a small model can be brought close on that one narrow task, you get most of the quality at a fraction of the cost and latency.\n\n" +
        "What makes it work: use your real production inputs, not synthetic ones, so the student learns your actual distribution. Have humans review a sample of the teacher's outputs, because you are about to bake its mistakes into a permanent artefact. And evaluate the student against the teacher on a held-out set, not against a benchmark.\n\n" +
        "The two things to check before starting: whether your provider's terms permit training on their outputs, which varies and is a real constraint, and whether the narrowness holds — a distilled model is good at the task it was distilled for and nothing else.",
      points: [
        "Large teacher generates outputs; small student is fine-tuned on them.",
        "The case is economics: most of the quality at a fraction of cost and latency.",
        "Use real production inputs so the student learns the real distribution.",
        "Human-review a sample — the teacher's mistakes become permanent.",
        "Check the provider's terms on training from their outputs. This varies.",
        "The student is narrow. Do not expect general capability."
      ],
      say: "Distillation uses a large model to teach a small one — run the teacher over real production inputs, keep the outputs, and fine-tune the student on those pairs. The case is economics: most of the quality on one narrow task at a fraction of cost and latency. I use real inputs rather than synthetic, human-review a sample because the teacher's mistakes become permanent, and check the provider's terms on training from outputs.",
      numbers: "The saving is the point — quantify it before starting. A distilled small model is commonly an order of magnitude cheaper per request than the teacher.",
      wrong: "Not mentioning the licensing question. At an enterprise, training on another provider's outputs without checking terms is a legal problem, not a technical one.",
      follow: "The student matches the teacher on your test set. What are you still worried about?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-07",
      q: "You fine-tuned a model. How do you run it in production?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["fine-tuning", "operations", "serving", "llmops"],
      why: "The part people forget. Training is a project; serving it is a commitment.",
      simple:
        "This is where the real cost shows up, and naming it is what makes the earlier restraint credible.\n\n" +
        "You now own a model artefact. It needs versioning, storage, and a record of which data version and base model produced it, because in a year someone will ask and \"we do not know\" is not an acceptable answer in a regulated setting.\n\n" +
        "Serving: either a provider's hosted fine-tuning, which is simplest, or your own inference stack — and self-hosting means GPU capacity, autoscaling, and someone on call for it.\n\n" +
        "Evaluation does not stop. The base model may be deprecated, your data distribution will drift, and you need a scheduled re-evaluation to notice.\n\n" +
        "Rollout like any model change: shadow first, then canary, with the previous version one flag away.\n\n" +
        "And plan the exit. Base models improve quickly, and a fine-tune that beat the general model last year may lose to the current one. Re-check that comparison periodically — being willing to delete your own model is a senior signal.",
      points: [
        "Version the artefact with its base model and training data version.",
        "Hosted fine-tuning is simplest; self-hosting means GPUs, autoscaling and on-call.",
        "Scheduled re-evaluation — the base can be deprecated and your data drifts.",
        "Shadow, then canary, with instant rollback to the previous version.",
        "Periodically re-compare against the current general model.",
        "Be willing to delete it when the general model catches up."
      ],
      say: "I now own an artefact, so it gets versioned with its base model and training data version, because someone will ask a year later. Serving is either hosted fine-tuning or my own GPU stack with autoscaling and on-call. Evaluation continues on a schedule, since the base can be deprecated and my data drifts. Rollout is shadow then canary with instant rollback. And I re-compare against the current general model periodically.",
      numbers: "Re-compare against the current general model at least quarterly. Base models improve fast enough that a fine-tune can stop being worth its operational cost within a year.",
      wrong: "\"We deployed it and it works.\" It skips versioning, drift, deprecation and the exit plan, which together are most of the real cost.",
      follow: "The new general model beats your fine-tune. What do you do?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "ft-08",
      q: "How do you evaluate a fine-tuned model and prove it is actually better?",
      round: ["tech2"],
      level: "5-10",
      tags: ["fine-tuning", "evaluation", "process", "judgement"],
      why: "Everyone can describe running a fine-tune. Far fewer can prove the result was worth shipping, which is the actual decision.",
      simple:
        "The trap is judging it on training loss. Loss going down means the model learned to imitate your training set; it says nothing about whether the product got better, and it will keep falling while quality degrades.\n\n" +
        "So: a held-out test set the model never saw, split before any training, and split by the right unit. If you split randomly across rows that came from the same customers or the same documents, near-duplicates land on both sides and your score is inflated. Split by document or by customer or by time.\n\n" +
        "Then always compare against the base model on the same set, with the same prompt. A fine-tune that beats nothing is not an achievement. This is the number that decides shipping, and surprisingly often the honest result is that a good prompt on the base model matches it — which is a legitimate finding worth reporting, since it saves you a training pipeline and a model artefact forever.\n\n" +
        "Test three things, not one. The target task, obviously. General capability, to detect catastrophic forgetting — the model got better at your extraction task and worse at following instructions. And format and safety behaviour, because SFT on a narrow dataset routinely erodes refusal behaviour that the instruct model had.\n\n" +
        "Then the operational half. Fix the decoding parameters across every comparison or you are measuring temperature. Report cost and latency alongside quality, because a fine-tuned 7B that matches GPT-class quality at a fraction of the cost is the whole business case. And run a shadow or canary against real traffic before committing, since offline sets never contain the queries that break you.\n\n" +
        "Finally, keep the eval set versioned and frozen. If it drifts between runs, you cannot compare this month's model with last month's.",
      points: [
        "Training loss is not evaluation. It falls while product quality degrades.",
        "Held-out set split by document, customer or time — never randomly across near-duplicates.",
        "Always benchmark against the base model with the same prompt and decoding settings.",
        "'A good prompt matched it' is a real and valuable result — it saves owning a model.",
        "Test the target task, general capability (forgetting) and safety behaviour separately.",
        "Report cost and latency next to quality — that is usually the actual business case.",
        "Canary on real traffic before committing; freeze and version the eval set."
      ],
      say: "Not on training loss — that measures imitation of the training set. I use a held-out set split by document or customer so near-duplicates do not leak, and I always compare against the base model with the same prompt and decoding settings. I test three things: the target task, general capability to catch forgetting, and safety behaviour, which SFT erodes. Then I report cost and latency beside quality and canary on real traffic.",
      numbers: "If the fine-tuned model does not clearly beat a well-engineered prompt on the base model, do not ship it. You would be taking on a training pipeline and a permanent model artefact for nothing.",
      wrong: "'Loss went down and the samples look good.' Eyeballing samples finds what you hoped for, and loss measures the wrong thing entirely.",
      follow: "Your fine-tune wins on the task set and loses on general instruction following. Ship or not?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
  ]
};
