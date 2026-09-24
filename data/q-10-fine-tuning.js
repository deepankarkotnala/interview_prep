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
      "quick": [
        "Agree only when the gap is behaviour, not missing facts.",
        "Facts change, so they belong in search, not training.",
        "Try better prompts, examples and search first.",
        "Good reasons are strict format, house tone or lower cost.",
        "You need good data and someone to own the model."
      ],
      "simple": "Fine-tuning means training an existing model further on our own examples so it changes how it behaves. It is a long-term commitment, and the rule that holds up is that fine-tuning teaches behaviour while retrieval supplies knowledge. Facts change, so they belong in RAG, not in the weights.\n\nSo four things have to be true. The gap must be behaviour, such as a house tone or a rigid output format. Cheaper fixes like prompting, few-shot examples and retrieval must already have been tried and measured. There must be a real payoff. For example, if we classify millions of tickets a month, a small fine-tuned model can be an order of magnitude cheaper per request. And we need good data and a named owner for as long as the model lives.\n\nOne myth is worth killing. Fine-tuning doesn't stop hallucination, and training on new facts can even make the model invent more confidently.",
      "points": [
        "Behaviour and format → fine-tuning. Facts and knowledge → retrieval.",
        "Cost and latency at high volume on a narrow task → a strong, underrated case.",
        "Try first: prompting, few-shot, retrieval, small model with a schema.",
        "Fine-tuning means owning a model artefact - versioning, hosting, drift, forever.",
        "It does not stop hallucination - training on facts the model did not already know can even make it invent more confidently."
      ],
      "diagram": {
        "alt": "If the gap is missing facts, use retrieval; if it is behaviour, check that cheaper fixes were tried and measured, then fine-tune only with good data and a named owner.",
        "rows": [
          [
            {
              "id": "g",
              "label": "What is the gap?"
            }
          ],
          [
            {
              "id": "rag",
              "label": "Use retrieval",
              "note": "facts change",
              "accent": "muted"
            },
            {
              "id": "c",
              "label": "Cheaper fixes tried?",
              "note": "prompting, few-shot, retrieval",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "ft",
              "label": "Fine-tune",
              "note": "good data, named owner",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "g",
            "to": "rag",
            "label": "missing facts"
          },
          {
            "from": "g",
            "to": "c",
            "label": "behaviour"
          },
          {
            "from": "c",
            "to": "ft",
            "label": "yes, measured"
          }
        ],
        "caption": "**Fine-tuning teaches behaviour; retrieval supplies knowledge.** Agree only after cheaper fixes are measured, with good data and someone to own the model."
      },
      "say": "Four things have to be true, because a fine-tune is a long-term commitment, not a quick fix. The first is that the gap is behaviour, not missing knowledge. Facts change, so they belong in retrieval, not baked into the weights. The second is that we've already tried the cheaper fixes, better prompting, few-shot examples and retrieval, and measured them. The third is a real payoff, like a rigid output format, a house tone, or a small tuned model replacing a large one. Say we classify millions of tickets a month. A small fine-tuned model can be an order of magnitude cheaper per request, and that's a business case. The fourth is good data and a named owner, because someone has to version, host and re-evaluate the model for as long as it lives. And I'd kill one myth early. Fine-tuning doesn't stop hallucination, and training on facts the model didn't know can make it invent more confidently.",
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
      "quick": [
        "LoRA trains a small add-on instead of every weight.",
        "Full training needs huge memory and makes a whole copy.",
        "The original model stays frozen, so smaller hardware works.",
        "The add-on is megabytes, so one base serves many customers.",
        "It can be merged in, so answers stay fast."
      ],
      "simple": "Full fine-tuning updates every weight, so GPU memory has to hold the weights, a gradient for each one and the optimiser's extra numbers. For a 7B model that is roughly 110 GB before activations, so several GPUs, and you get a whole new copy of the model.\n\nLoRA, low-rank adaptation, freezes the original weights and adds two small, thin matrices next to some of the weight matrices. Only those are trained, and multiplied together they form an update of the right shape, so the trainable part is a tiny fraction of the model. It fits on much smaller hardware, and the result is an adapter of megabytes, not gigabytes.\n\nThe bigger win is operational. For example, you can host one base model and swap in a different adapter per customer, and merging an adapter into the weights adds no latency. The main setting is rank, and 8 to 16 is a common start.",
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
      "diagram": {
        "kind": "compare",
        "alt": "Full fine-tuning compared with LoRA by what trains, memory for a 7B model, the artefact produced and how it is served.",
        "aspects": [
          "What trains",
          "Memory (7B)",
          "Artefact",
          "Serving"
        ],
        "columns": [
          {
            "label": "Full fine-tuning",
            "note": "update every weight",
            "accent": "warn",
            "cells": [
              "Every weight",
              "About 110 GB, several GPUs",
              "Whole new model copy",
              "One model per variant"
            ]
          },
          {
            "label": "LoRA",
            "note": "frozen base, small add-on",
            "accent": "accent",
            "cells": [
              "Two thin matrices",
              "About 14 GB base",
              "Adapter of megabytes",
              "One base, swap adapters"
            ]
          }
        ],
        "caption": "LoRA **freezes the base and trains a tiny low-rank add-on**. It can be merged for no extra latency, and one base can serve many customers' adapters."
      },
      "say": "LoRA trains a small add-on beside a frozen model instead of updating every weight. Full fine-tuning is expensive because you hold the weights, their gradients and the optimiser state in memory. For a 7B model that's roughly 110 gigabytes before activations, so several GPUs, and you get a whole new copy of the model at the end. LoRA freezes the base and trains two thin matrices next to some of the weight matrices. Multiplied together they form a low-rank update, so the trainable part is a tiny fraction of the model. That fits on much smaller hardware, and the output is an adapter of megabytes, not gigabytes. The bigger win is operational. You host one base model and swap adapters per customer or per task, and you can merge an adapter into the weights so it adds no latency. Rank is the main knob. Eight to sixteen is a common start, but I tune it rather than guess.",
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
      "quick": [
        "QLoRA is LoRA on a compressed copy of the model.",
        "The frozen model is stored in 4-bit, the add-on in 16-bit.",
        "A 7B model drops from about 14 GB to 4 GB.",
        "That lets a big model train on one GPU.",
        "Steps are slower, so check quality on your tests."
      ],
      "simple": "QLoRA is LoRA on top of a compressed base model. The big frozen model is stored in 4-bit, and only the small LoRA adapters are trained, in 16-bit. That is how a model that would need several GPUs to fine-tune fits on one.\n\nIt helps to know where memory goes. A full fine-tune costs roughly 16 bytes per parameter for weights, gradients and optimiser state. LoRA drops the gradients and optimiser state for the frozen base, but the base still takes 2 bytes per parameter. QLoRA shrinks it to about half a byte by storing each number with fewer bits. For example, a 7B model's weights go from about 14 GB to about 4 GB, so it fits on one 24 GB GPU.\n\nThe trade-off is slower steps, because weights are unpacked on the fly. Quality is usually close to normal LoRA, but check it on your own eval set.",
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
      "diagram": {
        "kind": "stack",
        "alt": "Memory per parameter shrinking from about 16 bytes for full fine-tuning, to 2 bytes for a LoRA base, to about half a byte for a QLoRA 4-bit base.",
        "top": "memory per parameter",
        "bottom": "fits one 24 GB GPU (7B)",
        "layers": [
          {
            "label": "Full fine-tune: ~16 bytes",
            "note": "weights, gradients, optimiser",
            "accent": "bad"
          },
          {
            "label": "LoRA base: 2 bytes",
            "note": "frozen 16-bit, ~14 GB",
            "accent": "warn"
          },
          {
            "label": "QLoRA base: ~0.5 bytes",
            "note": "4-bit NF4, ~4 GB",
            "accent": "accent"
          },
          {
            "label": "Adapters in 16-bit",
            "note": "the only part trained"
          },
          {
            "label": "Paged optimisers",
            "note": "spikes spill to CPU",
            "accent": "muted"
          }
        ],
        "caption": "**Base in 4-bit, adapters in 16-bit.** Steps are slower because weights unpack on the fly, and activations still grow with sequence length."
      },
      "say": "QLoRA is LoRA on a base model compressed to 4-bit, which is how a model that needed several GPUs fits on one. It helps to know where memory goes. A full fine-tune costs about 16 bytes per parameter for weights, gradients and optimiser state. LoRA drops the gradients and optimiser state for the frozen base, but the base still sits in memory at 2 bytes per parameter. QLoRA stores it at about half a byte and trains only the small adapters in 16-bit. So a 7B model's weights go from about 14 gigabytes to about 4, and it fits on one 24 gigabyte GPU. Paged optimisers also spill memory spikes to CPU RAM instead of crashing. The catch is slower steps, because weights get unpacked on the fly. Quality is usually close to normal LoRA, but I verify it on our eval set. And activations still grow with sequence length, so long inputs can run out of memory anyway.",
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
      "quick": [
        "The real difference is the kind of data each needs.",
        "SFT copies example answers that you write.",
        "RLHF learns from people picking the better of two answers.",
        "DPO uses the same choices but is far simpler.",
        "Pick by the data you can collect, often SFT then DPO."
      ],
      "simple": "SFT, RLHF and DPO are three ways to fine-tune a model, and the practical difference is the data each one learns from. SFT learns from correct answers, while RLHF and DPO learn from comparisons of the form \"A is better than B\".\n\nSupervised fine-tuning needs an input and the exact response you want, and the model learns to imitate it. Most applied fine-tunes are SFT. RLHF has people pick the better of two outputs, trains a reward model on those choices, then uses reinforcement learning to score well on it. It is powerful but hard to keep stable. DPO uses the same preference pairs but skips the reward model and the RL loop, so it is much simpler.\n\nSo you choose by the data you can collect. For example, a reviewer can say which of two replies has the better tone much faster than they can write a perfect one. A common recipe is SFT first, then DPO.",
      "points": [
        "SFT - input and correct output pairs. Imitation. Most applied fine-tunes are this.",
        "RLHF - preference pairs, a reward model, then RL. Powerful, heavy, harder to stabilise.",
        "DPO - same preference data, no reward model, direct optimisation. Simpler and stable.",
        "Common recipe: SFT first, then DPO on top.",
        "Choose by the data you can realistically collect.",
        "Preference data is often easier to gather than gold answers - people can judge faster than they can write.",
        "RL with automatic checkers for reasoning models (GRPO) - ft-11."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "SFT, RLHF and DPO compared by the data each learns from, the extra machinery needed and the trade-off.",
        "aspects": [
          "Learns from",
          "Extra parts",
          "Trade-off"
        ],
        "columns": [
          {
            "label": "SFT",
            "note": "imitate answers",
            "accent": "accent",
            "cells": [
              "Input + correct answer",
              "None",
              "Enough for most tasks"
            ]
          },
          {
            "label": "RLHF",
            "note": "reward model + RL",
            "accent": "warn",
            "cells": [
              "A-better-than-B pairs",
              "Reward model, RL loop",
              "Powerful, hard to stabilise"
            ]
          },
          {
            "label": "DPO",
            "note": "direct preferences",
            "accent": "accent",
            "cells": [
              "A-better-than-B pairs",
              "None",
              "Much simpler, stable"
            ]
          }
        ],
        "caption": "**Choose by the data you can collect.** SFT when you can write the right answer, DPO when you can only say which is better. A common recipe is SFT, then DPO."
      },
      "say": "They differ mainly in the data each one learns from. SFT, supervised fine-tuning, learns from inputs paired with the exact answer you want, so the model imitates them. Most applied fine-tunes are SFT, and for most business problems it's enough. RLHF learns from preferences instead. People pick the better of two answers, a separate reward model learns to predict those choices, and then reinforcement learning trains the main model to score well on it. It's powerful, but there are many moving parts and it's hard to keep stable. DPO uses the same preference pairs but skips the reward model and the RL loop, so it's far simpler. Simpler doesn't mean better everywhere, though, and well-tuned RL can still beat it. Tone shows why the data matters. A reviewer can say which of two replies is better much faster than they can write a perfect one. So I choose by the data we can realistically collect, and a common recipe is SFT first, then DPO on top.",
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
      "quick": [
        "Hundreds of examples for tone, thousands for judgement calls.",
        "Quality beats quantity, since the model copies every mistake.",
        "Best source is real outputs that a human corrected.",
        "Machine-made examples alone just repeat what the model does.",
        "Keep 10 to 20 percent aside for testing first."
      ],
      "simple": "How much data you need depends on what you are teaching. For a tone or a rigid output format, a few hundred good examples often move the needle. For a nuanced classification with real edge cases, you are into thousands, and the edge cases are the expensive part.\n\nQuality matters more than quantity, because the model faithfully learns whatever inconsistency is in your data, including disagreements between annotators who never shared a rubric. The best source is production outputs a human has corrected, since they match real traffic. For example, if support agents already fix a drafted reply before sending it, those corrected replies are ideal training pairs. Synthetic data adds volume, but it reinforces what the model already does, so it should never go in alone or unreviewed.\n\nFinally, hold out 10 to 20 percent as a test set before training starts, and never let it influence training. Without one, you cannot claim anything afterwards.",
      "points": [
        "Style and format: often a few hundred good examples.",
        "Nuanced judgement: thousands, and the edge cases dominate the cost.",
        "Quality beats quantity. The model learns your inconsistencies faithfully.",
        "Best source: production outputs corrected by a human.",
        "Synthetic data adds volume but tends to reinforce existing behaviour - do not rely on it alone or without human review.",
        "Format it like production: same chat template and system prompt, loss on the assistant reply only, near-duplicates removed, no overlap with the test set.",
        "Hold out a test set before training, or you cannot claim anything afterwards."
      ],
      "say": "Less than people expect for style, and more than they expect for judgement. For a tone or a strict output format, a few hundred good examples often move the needle. A nuanced classification needs thousands, and the edge cases are the expensive part. Quality beats quantity, because the model faithfully learns whatever inconsistency is in the data, including two annotators who never shared a rubric. My best source is production outputs a human has corrected, because they match real traffic. If support agents already fix a drafted reply before sending it, those corrected replies are ideal training pairs. Expert-written examples fill the cases production hasn't seen yet. Synthetic data adds volume, but it reinforces what the model already does, so it never goes in alone or unreviewed. And before any training starts, I hold out ten to twenty percent as a test set. Without that, it isn't an experiment.",
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
      "quick": [
        "Test on held-back data, not the training score.",
        "Split by customer so near copies do not leak.",
        "Compare against the base model with the same prompt.",
        "Check the task, general skill and safety separately.",
        "Report cost and speed too, since a good prompt may win."
      ],
      "simple": "When you fine-tune, the training loss keeps going down, but that is not the shipping metric, because it can keep falling while product quality gets worse. So the model is judged on held-out data set aside before training, split to avoid leakage. For example, if a support dataset has many tickets from each customer, all of one customer's tickets go into either training or test, never both.\n\nThen you compare against a strong base-model baseline on the same eval set, prompt and decoding settings. Check the target task, general ability and safety separately, because a fine-tune can win on one and quietly damage another. Cost and latency go in the report next to quality, since that is often the real business case.\n\nIf a good prompt matches the fine-tune, that is still a valuable result, because it saves you owning a model. Before full rollout, canary it on real traffic.",
      "points": [
        "Training loss is not evaluation. It falls while product quality degrades.",
        "Held-out set split by document, customer or time - never randomly across near-duplicates.",
        "Always benchmark against the base model with the same prompt and decoding settings.",
        "'A good prompt matched it' is a real and valuable result - it saves owning a model.",
        "Test the target task, general capability (forgetting) and safety behaviour separately.",
        "Report cost and latency next to quality - that is usually the actual business case.",
        "Canary on real traffic before committing; freeze and version the eval set."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Gates a fine-tuned model passes before shipping: a held-out set split by customer, a same-settings comparison with the base model, separate task, general and safety checks, cost and latency, then a canary.",
        "top": "fine-tuned model",
        "bottom": "full rollout",
        "layers": [
          {
            "label": "Held-out set",
            "note": "split by customer, no leakage"
          },
          {
            "label": "Beat the base model",
            "note": "same prompt and decoding",
            "accent": "accent"
          },
          {
            "label": "Task, general, safety",
            "note": "checked separately",
            "accent": "warn"
          },
          {
            "label": "Cost and latency",
            "note": "often the business case"
          },
          {
            "label": "Canary on real traffic",
            "note": "eval set frozen, versioned"
          }
        ],
        "caption": "**Training loss is not the shipping metric.** Beat a strong baseline on held-out data; if a good prompt matches the fine-tune, you avoid owning a model."
      },
      "say": "Training loss doesn't prove anything, so I judge it on held-out data that was set aside before training. Loss only shows how well the model fits the training objective, and it can keep falling while product quality gets worse. The split has to avoid leakage. If many rows come from the same customer, I split by customer, so near-duplicates can't land in both train and test. Then I compare with a strong base-model baseline on the same eval set, prompt and decoding settings. I check the target task, general ability and safety separately, because a fine-tune can win on one and quietly damage another. Cost and latency go in the report next to quality, since that's often the real business case. If a good prompt matches the fine-tune, that's still a useful result, because we don't have to own a model. Before full rollout I canary it on real traffic, with the eval set frozen and versioned.",
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
      "quick": [
        "Training hard on one task makes the model worse elsewhere.",
        "It may even refuse unsafe requests less reliably.",
        "Train a small add-on so the original stays frozen.",
        "Train gently, mix in general examples and stop early.",
        "Most of all, test general skill and safety every time."
      ],
      "simple": "Catastrophic forgetting is what happens when you fine-tune a model hard on one narrow task. It gets better at that task and worse at everything else. For example, train it to output strict JSON for claim summaries and it may chat worse, or refuse unsafe requests less reliably, even when the training data has nothing unsafe in it. That safety loss matters most and gets checked least.\n\nYou can reduce it. LoRA tends to forget less because the base weights stay frozen, though it also learns less. Lower learning rates and fewer epochs help, because most forgetting comes from training too hard for too long, and you can mix some general examples into the task data and stop early on a held-out set.\n\nBut the real answer is detection. Assume some degradation and run a task set, a general-capability set and a safety set on every checkpoint, because one good task score is not enough to accept a fine-tune.",
      "points": [
        "Narrow training degrades unrelated capabilities, including safety behaviour.",
        "LoRA tends to forget less than full fine-tuning (and learns less) - the base is frozen.",
        "Lower learning rate, fewer epochs, early stopping on a held-out set.",
        "Mix general examples into the task data.",
        "Evaluate general capability and safety, not only your task metric.",
        "Detection matters more than prevention. Assume some degradation and measure it."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A two by two grid of task score against general and safety behaviour; a better task score with lost safety is the hidden failure.",
        "xLabel": "General and safety behaviour",
        "yLabel": "Task metric",
        "cols": [
          "Kept",
          "Lost"
        ],
        "rows": [
          "Improved",
          "Not improved"
        ],
        "cells": [
          [
            {
              "label": "Ship candidate",
              "note": "canary next",
              "accent": "accent"
            },
            {
              "label": "Hidden failure",
              "note": "worse than not tuning",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "No gain",
              "note": "keep the base",
              "accent": "muted"
            },
            {
              "label": "Pure loss",
              "accent": "bad"
            }
          ]
        ],
        "caption": "**Detection beats prevention**: run a task set, a general set and a safety set on every checkpoint, because a great task score can hide lost refusals."
      },
      "say": "It's when training hard on one narrow task makes the model better at that task and worse at everything else. Train it to output strict JSON for claim summaries and it may chat worse, or refuse unsafe requests less reliably, even when the training data has nothing unsafe in it. That safety loss is the part that matters most and gets checked least. To reduce it, I prefer LoRA, which tends to forget less because the base stays frozen, though it also learns less. I use a lower learning rate and fewer epochs, because most forgetting comes from training too hard for too long. I mix some general examples into the task data and stop early on a held-out set. But prevention is only half of it. The real answer is detection, so every checkpoint runs a task set, a general-capability set and a safety set. One good task score isn't enough to accept a fine-tune.",
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
      "quick": [
        "PEFT freezes the big model and trains a few new parts.",
        "Adapters add small layers, which slow every answer slightly.",
        "Prompt and prefix tuning learn hidden extra inputs.",
        "LoRA can be merged in, so there is no slowdown.",
        "Start with LoRA, since data and testing matter more."
      ],
      "simple": "PEFT means parameter-efficient fine-tuning. Instead of updating the whole model, you freeze it and train a small number of new parameters, and the methods differ mainly in where those parameters go.\n\nAdapters insert small extra layers inside each transformer block, but those layers stay in the path at inference, so every request gets a little slower. Prompt tuning and prefix tuning learn a soft prompt, which is numbers the model reads as if they were extra tokens. Prompt tuning adds them at the input only, while prefix tuning adds them at every layer for more capacity.\n\nLoRA adds a low-rank update beside existing weight matrices, and you can merge it into the weights after training, so there is no extra inference cost. That, plus stability and tooling, makes it the default. For example, a team tuning a model for support replies would start with LoRA and switch only for a measured problem.",
      "points": [
        "**PEFT** = freeze the base, train a small set of new parameters.",
        "**Adapters** - small layers inside each block. Adds some inference latency.",
        "**Prompt tuning** - learned soft tokens at the input. Tiny; weaker on smaller models.",
        "**Prefix tuning** - learned vectors at every layer's attention. More capacity than prompt tuning.",
        "**LoRA** - low-rank update beside weight matrices; can be merged, so no extra latency.",
        "Variants: QLoRA (4-bit base), DoRA (splits the update into size and direction).",
        "Hugging Face `peft` implements most of these behind one API."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Adapters, soft prompts (prompt and prefix tuning) and LoRA compared by where the new parameters go, the inference cost and the catch.",
        "aspects": [
          "New parameters go",
          "Inference cost",
          "Catch"
        ],
        "columns": [
          {
            "label": "Adapters",
            "note": "the first popular one",
            "cells": [
              "Small layers in each block",
              "A little slower",
              "Stays in the path"
            ]
          },
          {
            "label": "Prompt / prefix tuning",
            "note": "soft prompts",
            "cells": [
              "Learned vectors, input or layers",
              "Uses some context",
              "Weaker on small models"
            ]
          },
          {
            "label": "LoRA",
            "note": "today's default",
            "accent": "accent",
            "cells": [
              "Low-rank update beside weights",
              "None once merged",
              "Pick the rank"
            ]
          }
        ],
        "caption": "**All PEFT freezes the base and trains a few new parameters; they differ in where.** LoRA wins because it merges away, so start there."
      },
      "say": "PEFT, parameter-efficient fine-tuning, means freezing the big model and training a small set of new parameters. The methods differ mainly in where those parameters go. Adapters insert small extra layers inside each transformer block. They work, but those layers stay in the path at inference, so every request gets a little slower. Prompt tuning and prefix tuning learn soft prompts instead, which are vectors the model reads as if they were extra tokens. Prompt tuning adds them only at the input. Prefix tuning adds them at every layer, which gives more capacity. Both are tiny, but they use up some context, and prompt tuning works noticeably less well on smaller models. LoRA adds a low-rank update beside existing weight matrices, and you can merge it into the weights after training, so there's no extra inference cost. That, plus stability and tooling, is why LoRA is my default. The method matters less than the data and the evaluation, so I only switch when a measured problem demands it.",
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
      "quick": [
        "Reasoning models learn from answers a program can check.",
        "Maths is right or wrong, code passes tests or not.",
        "GRPO scores a group of answers and favours above-average ones.",
        "It drops the costly judging model older methods needed.",
        "Needs a model that sometimes succeeds and an unfoolable checker."
      ],
      "simple": "Reasoning models are trained with reinforcement learning on tasks where the answer can be checked automatically, which is called RL with verifiable rewards. For example, a maths answer is either right or wrong and code passes its unit tests or it doesn't, so no human has to judge each output.\n\nClassic RLHF used PPO, which needs a second large network, a critic, to estimate how good each answer is. That is expensive and fiddly. GRPO drops the critic. For each prompt it samples a group of answers, say eight, scores each one with the checker, and pushes the model towards the answers above the group average. DeepSeek-R1 made it famous in early 2025.\n\nFor an applied team it rarely pays off. You need a narrow task, a reliable checker and a model that already succeeds sometimes, because RL sharpens existing ability rather than teaching from zero. And if the checker can be fooled, the model will learn to fool it.",
      "points": [
        "**RLVR** - the reward comes from an automatic check: exact answer, unit tests, schema validation.",
        "**PPO** needs a separate critic model; **GRPO** replaces it with the group's average score.",
        "Sample several answers per prompt, score each, push toward the above-average ones.",
        "Made famous by DeepSeek-R1 (2025); variants such as DAPO and GSPO adjust it for stability.",
        "Needs a base that sometimes succeeds - if a whole group scores the same, there is no learning signal.",
        "**Reward hacking** - a weak checker gets gamed. Read sampled outputs, not just the reward curve.",
        "Applied default is still SFT, then DPO; RL only with a checker you trust."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "GRPO steps: take a prompt, sample a group of answers, score each with an automatic checker, compare each score with the group average, and push the model toward above-average answers.",
        "lanes": [
          {
            "label": "Prompt",
            "note": "narrow, checkable task"
          },
          {
            "label": "Sample a group",
            "note": "say 8 answers"
          },
          {
            "label": "Checker scores",
            "note": "tests, exact answer",
            "accent": "warn"
          },
          {
            "label": "Compare to average",
            "note": "no critic model"
          },
          {
            "label": "Push above-average",
            "accent": "accent"
          }
        ],
        "caption": "**GRPO swaps PPO's critic for the group average.** The checker is the whole game: if it can be fooled, the model learns to fool it."
      },
      "say": "They're trained with reinforcement learning on tasks where a program can check the answer, which is called RL with verifiable rewards. A maths answer is right or wrong, and code passes its unit tests or it doesn't, so no human has to judge each output. Classic RLHF used PPO, which needs a second large network, a critic, to estimate how good each answer is. That's expensive and fiddly. GRPO drops the critic. For each prompt it samples a group of answers, say eight, scores each with the checker, and pushes the model toward the ones above the group average. DeepSeek introduced it in 2024, and DeepSeek-R1 made it famous in early 2025. For an applied team it rarely pays off. You need a narrow task, a reliable checker, and a model that already succeeds sometimes, because RL sharpens existing ability rather than teaching from zero. And the checker is the whole game. If it can be fooled, the model will learn to fool it.",
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
      "quick": [
        "A big model teaches a small one on one task.",
        "Run the big model on real inputs and keep its answers.",
        "Train the small model on those question and answer pairs.",
        "You keep most of the quality at a fraction of cost.",
        "Check the provider's terms and human-review the big model's answers."
      ],
      "simple": "Distillation means using a large, capable model to teach a small one a specific task. You run the large model, the teacher, over your real inputs, keep its outputs, and fine-tune the small model, the student, on those pairs.\n\nThe reason is almost always economics. For example, take a ticket classifier that works well on a big model but is too expensive at your volume. Distilled onto a small model, it can keep most of the quality at an order of magnitude less per request, with lower latency too. Use real production inputs so the student learns your actual distribution, and have humans review a sample of the teacher's outputs, because its mistakes become permanent in the student.\n\nTwo checks come first. Your provider's terms must permit training on their outputs, and you must be able to live with the narrowness, because a distilled model is good at its one task and nothing else.",
      "points": [
        "Large teacher generates outputs; small student is fine-tuned on them.",
        "The case is economics: most of the quality at a fraction of cost and latency.",
        "Use real production inputs so the student learns the real distribution.",
        "Human-review a sample - the teacher's mistakes become permanent.",
        "Check the provider's terms on training from their outputs. This varies.",
        "The student is narrow. Do not expect general capability."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Distillation steps: real production inputs go to a large teacher, a sample of its outputs is human-reviewed, a small student is fine-tuned on the pairs and evaluated against the teacher.",
        "lanes": [
          {
            "label": "Real inputs",
            "note": "production traffic"
          },
          {
            "label": "Large teacher",
            "note": "good, too costly",
            "accent": "warn"
          },
          {
            "label": "Human review",
            "note": "sample its outputs"
          },
          {
            "label": "Small student",
            "note": "fine-tuned on pairs",
            "accent": "accent"
          },
          {
            "label": "Eval vs teacher",
            "note": "held-out set"
          }
        ],
        "caption": "**A big model teaches a small one one narrow task**: most of the quality at a fraction of the cost. Check the provider's terms first."
      },
      "say": "Distillation is a large model teaching a small one a specific task. I run the large model over our real production inputs, keep its outputs, and fine-tune the small model on those pairs. The reason is almost always economics. Take a ticket classifier that works well on a big model but costs too much at our volume. Distilled onto a small model, it can keep most of the quality at an order of magnitude less per request, with lower latency too. Real inputs matter because the student should learn our actual distribution, with synthetic ones only topping up gaps. I have humans review a sample of the teacher's outputs, because its mistakes become permanent in the student. Then I evaluate the student against the teacher on a held-out set. Two checks come before any of this. Do the provider's terms allow training on their outputs? And can we live with a student that's only good at that one task?",
      "numbers": "The saving is the point - quantify it before starting. A distilled small model can be an order of magnitude cheaper per request than the teacher - measure it on your own traffic.",
      "wrong": "Not mentioning the licensing question. At an enterprise, training on another provider's outputs without checking terms is a legal problem, not a technical one.",
      "follow": "The student matches the teacher on your test set. What are you still worried about?",
      "followAnswer": "I'm still worried that the test set only shows the cases we thought to include. The student can match the teacher on average yet fail on rare inputs, long documents or edge cases the teacher handled through broad knowledge. So I slice results by segment and length, check its confidence on inputs outside the training distribution, and shadow it on live traffic. I also watch drift, because the student can't adapt to new patterns the way the teacher could."
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
      "quick": [
        "Serving it is an ongoing job, not a one-off.",
        "Record which base model and data built each version.",
        "Hosted is simplest, self-hosting needs GPUs and on-call staff.",
        "Retest on a schedule and release to a few users first.",
        "Compare with new general models each quarter, and delete if beaten."
      ],
      "simple": "Training a fine-tuned model is a one-off project, but running it in production is an ongoing commitment, and that is where the real cost shows up. You now own a model artefact, so it needs versioning and a record of which base model and data produced it, because in a year someone will ask.\n\nServing is simplest with a provider's hosted fine-tuning, while self-hosting means GPU capacity, autoscaling and someone on call. Evaluation doesn't stop either, since the base model can be deprecated and your data drifts. New versions roll out shadow first, then canary, with the previous version one flag away.\n\nFinally, plan the exit from day one, because base models improve fast. For example, if we had fine-tuned a model to classify support tickets, I would re-compare it with the current general model at least quarterly, and if the general model had caught up, I would retire ours.",
      "points": [
        "Version the artefact with its base model and training data version.",
        "Hosted fine-tuning is simplest; self-hosting means GPUs, autoscaling and on-call.",
        "Scheduled re-evaluation - the base can be deprecated and your data drifts.",
        "Shadow, then canary, with instant rollback to the previous version.",
        "Periodically re-compare against the current general model.",
        "Be willing to delete it when the general model catches up."
      ],
      "say": "Training is a one-off project, but serving is an ongoing commitment, and that's where the real cost shows up. It starts with versioning. Every model is recorded with its base model and training data version, because in a year someone will ask what produced it, and in a regulated setting not knowing isn't acceptable. For serving, a provider's hosted fine-tuning is simplest. Self-hosting means GPU capacity, autoscaling and someone on call. Evaluation doesn't stop either. The base model can be deprecated and our data drifts, so re-evaluation runs on a schedule. Rollouts go shadow first, then canary, with the previous version one flag away. And I plan the exit from day one. At least quarterly, I re-compare the fine-tune with the current general model. Base models improve fast, so if the general one has caught up, I'm happy to delete ours.",
      "numbers": "Re-compare against the current general model at least quarterly. Base models improve fast enough that a fine-tune can stop being worth its operational cost within a year.",
      "wrong": "\"We deployed it and it works.\" It skips versioning, drift, deprecation and the exit plan, which together are most of the real cost.",
      "follow": "The new general model beats your fine-tune. What do you do?",
      "followAnswer": "I plan to retire the fine-tune, but only after the general model proves itself on our own terms. I run it through the same frozen eval set, including task, safety and edge cases, and compare cost and latency too, since a bigger general model can win on quality and still lose on price. If it holds up, I shadow it, then canary it, and keep the fine-tune one flag away until the numbers are stable. Then I delete ours and stop paying to host it."
    }
  ]
};
