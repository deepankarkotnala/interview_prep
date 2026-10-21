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
        "trade-offs",
        "rag"
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
      "followAnswer": "Split the problem. The latest policy is knowledge, so it comes from retrieval at request time, with citations. The tone is behaviour, so I first try a system prompt with a few examples, and fine-tune only if that fails measurably. If I do fine-tune, I train on examples that include retrieved context, so the model learns to use fresh context in our tone rather than memorise policies.",
      "builds": [
        "llm-18",
        "pr-01"
      ],
      "next": [
        "ft-04",
        "ft-08",
        "ft-06"
      ],
      "deeper": [
        "huyen-ai-engineering",
        "hf-trl"
      ],
      "check": {
        "kind": "judgement",
        "q": "A team wants to fine-tune a model so the HR bot 'knows' the leave policies, which change every month. Which response is strongest?",
        "options": [
          "Agree - fine-tuning on the policy documents will also stop hallucination.",
          "Agree, and schedule a fresh fine-tune after every policy release.",
          "Serve policies through retrieval; consider fine-tuning only for tone or format, after prompting and few-shot fail measurably.",
          "Fine-tune a bigger model so it can memorise more policies."
        ],
        "answer": 2,
        "why": "Changing facts are knowledge, so they belong in retrieval with citations. Fine-tuning teaches behaviour such as tone or format. Monthly re-training turns every document change into a training run, and training on new facts can make the model invent more confidently, not less."
      }
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
        "serving"
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
        "Rank is the main setting: higher rank means more capacity and a bigger adapter.",
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
      "say": "LoRA trains a small add-on beside a frozen model instead of updating every weight. Full fine-tuning is expensive because you hold the weights, their gradients and the optimiser state in memory. For a 7B model that's roughly 110 gigabytes before activations, so several GPUs, and you get a whole new copy of the model at the end. LoRA freezes the base and trains two thin matrices next to some of the weight matrices. Multiplied together they form a low-rank update, so the trainable part is a tiny fraction of the model. That fits on much smaller hardware, and the output is an adapter of megabytes, not gigabytes. The bigger win is operational. You host one base model and swap adapters per customer or per task, and you can merge an adapter into the weights so it adds no latency. Rank is the main setting. Eight to sixteen is a common start, but I tune it rather than guess.",
      "numbers": "Rough memory arithmetic for a 7B model: full fine-tuning with Adam in mixed precision needs about 16 bytes per parameter for weights, gradients and optimiser state - roughly 110 GB before activations, so several GPUs. LoRA on a 16-bit frozen base needs about 14 GB for the weights plus a small adapter; QLoRA's 4-bit base is about 4 GB, which is why 7B–13B fine-tunes fit on one 24 GB GPU with modest sequence lengths. Rank 8–16 is a common starting point - tune it, do not guess it.",
      "wrong": "\"LoRA is faster fine-tuning.\" It is cheaper and lighter, and the adapter-swapping property is the bigger deal. Speed alone misses why it changed how teams deploy.",
      "follow": "You have forty customers each wanting their own tone. How do you serve that?",
      "followAnswer": "First I check whether forty system prompts with a few examples each get close, because that costs nothing extra to serve. If they really need fine-tunes, I train one LoRA adapter per customer on the same base and use multi-LoRA serving - vLLM, for example, can keep many adapters loaded on one base model and pick one per request. Each adapter is versioned and evaluated per customer, with the base as fallback.",
      "builds": [
        "llm-18",
        "ft-01"
      ],
      "next": [
        "ft-09",
        "ft-10",
        "ft-07"
      ],
      "alsoIn": [
        "riq-0608"
      ],
      "deeper": [
        "lora",
        "hf-peft"
      ],
      "check": {
        "kind": "numbers",
        "q": "A weight matrix is 4096 x 4096. LoRA at rank 8 adds A (4096 x 8) and B (8 x 4096). Roughly what share of that matrix's parameter count is trainable?",
        "options": [
          "About 8%",
          "About 50%",
          "About 0.4%",
          "About 0.002%"
        ],
        "answer": 2,
        "why": "A and B hold 2 x 4096 x 8 = 65,536 parameters against 16.8 million in the full matrix, about 0.39%. People who pick 8% confuse the rank with a percentage. The tiny share is why LoRA fits on small GPUs and ships as megabytes."
      },
      "try": {
        "title": "Count LoRA's trainable parameters at two ranks",
        "minutes": 15,
        "steps": [
          "Install `transformers` and `peft` and run the starter code on CPU - GPT-2 is small enough.",
          "Note the trainable percentage printed for rank 8 and for rank 64.",
          "Observe that the trainable share grows linearly with rank but stays a small fraction of the model.",
          "Add `c_proj` to `target_modules` and observe how adding target modules changes the count as much as rank does.",
          "Save the rank-8 model with `save_pretrained` and compare the adapter folder size with GPT-2's ~500 MB weights."
        ],
        "code": "from transformers import AutoModelForCausalLM\nfrom peft import LoraConfig, get_peft_model\n\nfor r in (8, 64):\n    base = AutoModelForCausalLM.from_pretrained(\"gpt2\")\n    cfg = LoraConfig(r=r, lora_alpha=2 * r, target_modules=[\"c_attn\"],\n                     fan_in_fan_out=True, task_type=\"CAUSAL_LM\")\n    model = get_peft_model(base, cfg)\n    print(f\"rank {r}:\", end=\" \")\n    model.print_trainable_parameters()"
      }
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
        "open-weights"
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
      "followAnswer": "The weights are no longer the problem; activations are, and they grow with sequence length. I turn on gradient checkpointing, which recomputes activations instead of storing them. I cut the micro-batch to one and use gradient accumulation to keep the effective batch size. I use FlashAttention-style kernels where the stack supports them. And I check whether the documents really need that length or can be split.",
      "builds": [
        "ft-02",
        "llm-12"
      ],
      "next": [
        "ft-07",
        "cl-08",
        "ft-08"
      ],
      "deeper": [
        "qlora",
        "hf-peft"
      ],
      "check": {
        "kind": "concept",
        "q": "You finish a QLoRA fine-tune of a 7B model. What exactly did training produce?",
        "options": [
          "A 16-bit LoRA adapter, trained on top of a frozen base stored in 4-bit.",
          "A 4-bit version of the whole model with updated weights.",
          "A full 16-bit copy of the model with every weight updated.",
          "A new quantisation table that replaces the base weights."
        ],
        "answer": 0,
        "why": "Only the small adapter is trained, in 16-bit; the 4-bit base is frozen and only used to save memory. 'You get a 4-bit model' is the common mistake - whether you serve on a 4-bit or 16-bit base is a separate decision you must test."
      }
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
        "alignment",
        "fine-tuning"
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
      "say": "They differ mainly in the data each one learns from. SFT, supervised fine-tuning, learns from inputs paired with the exact answer you want, so the model imitates them. Most applied fine-tunes are SFT, and for most business problems it's enough. RLHF learns from preferences instead. People pick the better of two answers, a separate reward model learns to predict those choices, and then reinforcement learning trains the main model to score well on it. It's powerful, but there are many components that can go wrong and it's hard to keep stable. DPO uses the same preference pairs but skips the reward model and the RL loop, so it's far simpler. Simpler doesn't mean better everywhere, though, and well-tuned RL can still beat it. Tone shows why the data matters. A reviewer can say which of two replies is better much faster than they can write a perfect one. So I choose by the data we can realistically collect, and a common recipe is SFT first, then DPO on top.",
      "numbers": "Preference data is usually cheaper to collect than gold answers - judging two outputs is faster than authoring one. That often decides the method.",
      "wrong": "\"DPO is a better version of RLHF.\" It is simpler and more stable, not universally better. Well-tuned online RL can still beat it, and frontier labs still use RL. Overstating it invites a correction.",
      "follow": "You have thumbs-up and thumbs-down from production. Which method does that fit?",
      "followAnswer": "Thumbs are not pairs, so DPO does not fit directly. Unpaired good-or-bad labels suit KTO, a preference method built for exactly that. Or I build pairs: a thumbs-down answer and a later thumbs-up answer to the same question make one pair. Reviewed thumbs-up answers can also become SFT data. Either way I clean the data first, because thumbs are sparse, noisy and skewed toward a few vocal users.",
      "builds": [
        "llm-18",
        "ft-01"
      ],
      "next": [
        "ft-11",
        "ft-04",
        "ft-06"
      ],
      "deeper": [
        "dpo",
        "instructgpt"
      ],
      "check": {
        "kind": "concept",
        "q": "You have 5,000 pairs where reviewers picked the better of two replies, and no ideal written answers. You want the simplest method that learns from both the winner and the loser in each pair. Which fits?",
        "options": [
          "SFT, because it imitates the preferred replies.",
          "RLHF with PPO, because preference data always needs reinforcement learning.",
          "Prompt tuning on the rejected replies.",
          "DPO, because it trains directly on chosen-versus-rejected pairs."
        ],
        "answer": 3,
        "why": "DPO optimises straight from preference pairs, with no reward model and no RL loop. SFT on the winners alone discards what the loser tells you. PPO-based RLHF can use the pairs too, but needs a trained reward model and is harder to keep stable."
      }
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
        "evaluation"
      ],
      "why": "The practical blocker. Candidates who have actually fine-tuned lead with the data problem, not the method.",
      "quick": [
        "Hundreds of examples for tone, thousands for judgement calls.",
        "Quality beats quantity, since the model copies every mistake.",
        "Best source is real outputs that a human corrected.",
        "Machine-made examples alone just repeat what the model does.",
        "Keep 10 to 20 percent aside for testing first."
      ],
      "simple": "How much data you need depends on what you are teaching. For a tone or a rigid output format, a few hundred good examples often make a real difference. For a subtle classification with real edge cases, you are into thousands, and the edge cases are the expensive part.\n\nQuality matters more than quantity, because the model faithfully learns whatever inconsistency is in your data, including disagreements between annotators who never shared a rubric. The best source is production outputs a human has corrected, since they match real traffic. For example, if support agents already fix a drafted reply before sending it, those corrected replies are ideal training pairs. Synthetic data adds volume, but it reinforces what the model already does, so it should never go in alone or unreviewed.\n\nFinally, hold out 10 to 20 percent as a test set before training starts, and never let it influence training. Without one, you cannot claim anything afterwards.",
      "points": [
        "Style and format: often a few hundred good examples.",
        "Subtle judgement: thousands, and the edge cases dominate the cost.",
        "Quality beats quantity. The model learns your inconsistencies faithfully.",
        "Best source: production outputs corrected by a human.",
        "Synthetic data adds volume but tends to reinforce existing behaviour - do not rely on it alone or without human review.",
        "Format it like production: same chat template and system prompt, loss on the assistant reply only, near-duplicates removed, no overlap with the test set.",
        "Hold out a test set before training, or you cannot claim anything afterwards."
      ],
      "say": "Less than people expect for style, and more than they expect for judgement. For a tone or a strict output format, a few hundred good examples often make a real difference. A subtle classification needs thousands, and the edge cases are the expensive part. Quality beats quantity, because the model faithfully learns whatever inconsistency is in the data, including two annotators who never shared a rubric. My best source is production outputs a human has corrected, because they match real traffic. If support agents already fix a drafted reply before sending it, those corrected replies are ideal training pairs. Expert-written examples fill the cases production hasn't seen yet. Synthetic data adds volume, but it reinforces what the model already does, so it never goes in alone or unreviewed. And before any training starts, I hold out ten to twenty percent as a test set. Without that, it isn't an experiment.",
      "numbers": "Rough guide: hundreds for format and tone, thousands for judgement. Hold out at least 10–20% as a test set that never influences training.",
      "wrong": "\"We generated the training data with a larger model.\" Distillation is legitimate and must be said as such, with human review. Presented as a shortcut, it means training your model on another model's mistakes.",
      "follow": "Your annotators disagree on 20% of cases. What does that mean for the fine-tune?",
      "followAnswer": "It means the labels are noisy, and the model will learn that noise - it cannot be more consistent than its teachers. Before training I read the disagreements. Usually the rubric is unclear, so I fix the guidelines, re-label, and have a senior expert settle the hard cases. Then I measure agreement again, for example with Cohen's kappa. Cases that stay genuinely ambiguous may need an 'unsure, escalate' label instead.",
      "builds": [
        "ft-01"
      ],
      "next": [
        "ft-08",
        "ft-06",
        "ev-02"
      ],
      "deeper": [
        "lima",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "predict",
        "q": "Two annotator teams labelled your fine-tuning data without a shared rubric, and they disagree on about 20% of cases. You train on it as-is. What happens on cases like those?",
        "options": [
          "The model learns the inconsistency, so its outputs on those cases become unpredictable.",
          "The model averages the two styles into the correct answer.",
          "More epochs will make the model settle on the better label.",
          "Nothing, as long as the data set has thousands of rows."
        ],
        "answer": 0,
        "why": "A model faithfully imitates its training data, including contradictions. It cannot know which annotator was right, so it learns both. Fix the rubric and relabel the disputed slice; more epochs or more rows just bake the conflict in harder."
      }
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
        "evaluation"
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
      "followAnswer": "It depends on how the model is used. If it sits behind one narrow endpoint with a fixed prompt and a schema, broad instruction-following may not matter, so I test only the instructions my product actually sends. If users can send open-ended requests, it is a real regression. Then I retrain with general instruction data mixed in, or with lower rank and fewer epochs, and compare again.",
      "builds": [
        "ft-04",
        "ev-02"
      ],
      "next": [
        "ft-05",
        "ev-17",
        "ft-07"
      ],
      "deeper": [
        "hamel-evals",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A team shuffles 20,000 support tickets (about 50 per customer), splits them 80/20 at random, and reports the fine-tune 15 points above the base model. What is the main flaw?",
        "options": [
          "The test set is too small to trust.",
          "They should report training loss instead of a test score.",
          "Near-duplicate tickets from the same customer sit in both splits, so the score is inflated by leakage.",
          "A 20% test split wastes training data."
        ],
        "answer": 2,
        "why": "With 50 similar tickets per customer, a random split puts near-copies in train and test, so the model is partly tested on what it memorised. Split by customer (or by time). 4,000 test rows is plenty; training loss measures fit, not product quality."
      }
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
        "evaluation",
        "alignment"
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
      "followAnswer": "Not as it stands. A refusal drop is a safety regression, and in a regulated product that blocks release however good the task gain is. I find which refusal cases broke, then retrain with safety examples mixed into the data and a lower learning rate or fewer epochs, and re-run all three evaluation sets. If refusals still drop, I add an external guardrail or keep the base model.",
      "builds": [
        "ft-02",
        "ft-08"
      ],
      "next": [
        "ft-10",
        "ft-07",
        "gr-07"
      ],
      "deeper": [
        "lora-learns-less",
        "hf-peft"
      ],
      "check": {
        "kind": "which-fails",
        "q": "You fine-tune on strict JSON claim summaries and evaluate only on a JSON task set, where accuracy jumps from 70% to 95%. Which claim does that result NOT support?",
        "options": [
          "The model's JSON output improved on that task distribution.",
          "The fine-tune learned the target format.",
          "The held-out task score improved.",
          "General instruction-following and refusal behaviour are unchanged."
        ],
        "answer": 3,
        "why": "A task set only measures the task you trained for. Forgetting shows up elsewhere - general ability and, most dangerously, refusals - so you need separate general and safety sets on every checkpoint. The other three claims are exactly what the task set does measure."
      }
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
        "transformers"
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
      "followAnswer": "When the change is large rather than a behaviour tweak - for example continued pre-training on a new language or a big new domain, where a low-rank update limits how much the model can learn. Or when the model is small and I have the GPUs and data to do it properly. Even then I run LoRA first as a baseline, because if it gets close, the cheaper option wins.",
      "builds": [
        "ft-02"
      ],
      "next": [
        "ft-09",
        "ft-03",
        "ft-07"
      ],
      "deeper": [
        "hf-peft",
        "lora"
      ],
      "check": {
        "kind": "concept",
        "q": "Why does a merged LoRA adapter add no inference latency, while classic adapter layers do?",
        "options": [
          "LoRA's update BA has the same shape as W, so it folds into the weights; adapters are extra layers every request passes through.",
          "LoRA only trains the embedding layer, which is cheap.",
          "Adapters must run on the CPU while LoRA runs on the GPU.",
          "LoRA removes layers from the model to compensate."
        ],
        "answer": 0,
        "why": "After training you can compute W + BA once and serve a normal model. Adapter layers stay in the forward path, so each request pays a small extra cost. LoRA does not touch embeddings only, and nothing is removed."
      }
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
        "alignment",
        "fine-tuning",
        "training"
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
      "followAnswer": "Possibly, because extraction is checkable: compare the extracted fields with labelled ground truth, reward each correct field, and add a reward for valid schema. But I would first try a strong prompt with structured output, then SFT on labelled invoices. RL is worth it only if SFT plateaus and I have enough labels for a reliable reward. And I would audit outputs for reward hacking, like empty fields scoring well.",
      "builds": [
        "ft-03",
        "llm-19"
      ],
      "next": [
        "ft-06",
        "ft-08",
        "ev-17"
      ],
      "deeper": [
        "deepseekmath",
        "hf-trl"
      ],
      "check": {
        "kind": "numbers",
        "q": "GRPO samples 8 answers to one prompt and the checker marks all 8 correct. How much does that prompt teach the model in this step?",
        "options": [
          "A strong positive signal, because every answer was right.",
          "A negative signal, because there was nothing to improve.",
          "Nothing - every reward equals the group average, so every advantage is zero.",
          "It depends on the critic network's value estimate."
        ],
        "answer": 2,
        "why": "GRPO scores each answer against its own group's mean. If all rewards are equal, every advantage is zero and no gradient flows. That is why you filter for prompts the model solves only sometimes. GRPO has no critic, which is the point of it."
      },
      "try": {
        "title": "Compute group-relative advantages by hand",
        "minutes": 10,
        "steps": [
          "Run the starter code with numpy and read the advantage printed for each of the 8 sampled answers.",
          "Observe that correct answers get positive advantages and wrong ones negative, centred on zero.",
          "Change the rewards to all ones and observe that every advantage becomes zero - the prompt teaches nothing.",
          "Try one correct answer out of eight and observe how large its advantage becomes compared with six out of eight."
        ],
        "code": "import numpy as np\n\ndef advantages(rewards):\n    r = np.asarray(rewards, dtype=float)\n    std = r.std()\n    if std == 0:\n        return np.zeros_like(r)  # no signal from this prompt\n    return (r - r.mean()) / std\n\nfor rewards in ([1, 0, 0, 1, 1, 0, 0, 0],\n                [1, 1, 1, 1, 1, 1, 1, 1],\n                [1, 0, 0, 0, 0, 0, 0, 0]):\n    print(rewards, np.round(advantages(rewards), 2))"
      }
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
      "followAnswer": "I'm still worried that the test set only shows the cases we thought to include. The student can match the teacher on average yet fail on rare inputs, long documents or edge cases the teacher handled through broad knowledge. So I slice results by segment and length, check its confidence on inputs outside the training distribution, and shadow it on live traffic. I also watch drift, because the student can't adapt to new patterns the way the teacher could.",
      "builds": [
        "ft-01",
        "ft-04"
      ],
      "next": [
        "ft-08",
        "cl-06",
        "ft-07"
      ],
      "deeper": [
        "distillation",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "judgement",
        "q": "Your distilled student model matches the teacher on the held-out test set and is far cheaper. What is the most important thing still to check before shipping?",
        "options": [
          "That the student is not answering too fast for users.",
          "That the provider's terms allowed training on its outputs, and how the student behaves on inputs outside the narrow training distribution.",
          "That the teacher model has not improved since you distilled.",
          "That the student fits on fewer GPUs than the teacher."
        ],
        "answer": 1,
        "why": "A distilled model is good at its one task and can fail badly off-distribution, and training on another provider's outputs is a legal question first. Speed and GPU count are the benefits you wanted; a newer teacher is a later re-distillation decision."
      }
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
        "llmops",
        "serving"
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
      "followAnswer": "I plan to retire the fine-tune, but only after the general model proves itself on our own terms. I run it through the same frozen eval set, including task, safety and edge cases, and compare cost and latency too, since a bigger general model can win on quality and still lose on price. If it holds up, I shadow it, then canary it, and keep the fine-tune one flag away until the numbers are stable. Then I delete ours and stop paying to host it.",
      "builds": [
        "ft-08",
        "ops-03"
      ],
      "next": [
        "ops-08",
        "cl-05",
        "ft-05"
      ],
      "deeper": [
        "vllm",
        "mlflow"
      ],
      "check": {
        "kind": "judgement",
        "q": "A new general model appears to match your fine-tune on quality at similar cost. What is the best next step?",
        "options": [
          "Keep the fine-tune, because the team invested in it.",
          "Switch production to the general model today.",
          "Fine-tune the new general model straight away.",
          "Run it through the same frozen task, safety and edge-case evals, then shadow and canary it before retiring the fine-tune."
        ],
        "answer": 3,
        "why": "Retiring a fine-tune is a good outcome, but only after the replacement proves itself on your own frozen evals and real traffic. Sunk cost is not a reason to keep it, and an untested switch or an immediate new fine-tune skips the evidence."
      }
    },
    {
      "id": "ft-12",
      "q": "Walk me through preparing and cleaning a dataset for supervised fine-tuning.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "training",
        "ingestion"
      ],
      "why": "ft-04 asks how much data you need. This checks the craft of making it usable - the step that decides most fine-tune outcomes and the one people skip.",
      "quick": [
        "Write the task contract first: input, exact output format, edge cases.",
        "Start from real inputs; outputs corrected by humans to a style guide.",
        "Deduplicate, including near-duplicates; scrub PII and secrets.",
        "Use the model's chat template; train on the answer tokens only.",
        "Split by customer or time, and remove eval items from training."
      ],
      "simple": "A fine-tune copies whatever is in the data, mistakes included, so preparation is most of the work.\n\nFirst you write down the task contract: what the input is, the exact output format and how edge cases should be handled. Then you gather real inputs from logs or documents and get outputs that a human has written or corrected against a short style guide, so two annotators would produce the same answer.\n\nCleaning comes next. Remove exact duplicates and near-duplicates, which over-weight common cases and leak between splits. Strip personal data and secrets, drop examples longer than your training sequence length rather than silently truncating them, and balance the mix so one easy class doesn't dominate.\n\nFormatting matters more than people expect. Each example is rendered with the target model's own chat template, and the loss is computed only on the assistant's answer, not on the prompt.\n\nFinally, split by customer, document or time, not randomly, and check that no test item or its near-duplicate is in training. For example, 400 support replies corrected by two senior agents usually beat 4,000 raw transcripts, because the model learns your best answer rather than your average one.",
      "points": [
        "Task contract and style guide before collecting anything.",
        "Real inputs, human-corrected outputs; measure annotator agreement on a sample.",
        "Exact and near-duplicate removal; PII and secret scrubbing; length filtering; class balance.",
        "Render with the model's chat template; mask the prompt so loss is on completions only.",
        "Group-aware splits (customer, document, time) and decontamination against the eval set.",
        "Version the dataset by hash so every model links to the exact data it saw."
      ],
      "diagram": {
        "rows": [
          [
            {
              "id": "raw",
              "label": "Real inputs",
              "note": "logs, tickets, documents"
            }
          ],
          [
            {
              "id": "clean",
              "label": "Filter and scrub",
              "note": "PII, secrets, length"
            },
            {
              "id": "dedup",
              "label": "Deduplicate",
              "note": "exact and near",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "label",
              "label": "Human-corrected outputs",
              "note": "one style guide",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "fmt",
              "label": "Chat template + loss mask",
              "note": "train on answers only"
            }
          ],
          [
            {
              "id": "split",
              "label": "Split by customer or time",
              "note": "no eval items in train",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "raw",
            "to": "clean"
          },
          {
            "from": "raw",
            "to": "dedup"
          },
          {
            "from": "clean",
            "to": "label"
          },
          {
            "from": "dedup",
            "to": "label"
          },
          {
            "from": "label",
            "to": "fmt"
          },
          {
            "from": "fmt",
            "to": "split"
          }
        ],
        "alt": "Dataset pipeline: real inputs are filtered and deduplicated, given human-corrected outputs, rendered with the chat template and loss mask, and split by customer or time.",
        "caption": "**The model learns exactly what you show it.** Clean and correct first; split by group so the test set measures generalisation, not memory."
      },
      "say": "I start before the data, with a task contract: what goes in, the exact output format and the edge cases, plus a one-page style guide. Then I take real inputs and get outputs written or corrected by people against that guide, and check two annotators agree on a sample, because the model copies inconsistency too. Cleaning is deduplication, including near-duplicates, scrubbing PII and secrets, dropping examples longer than the training sequence length instead of truncating them, and balancing so one easy case doesn't dominate. Formatting matters. Every example goes through the target model's chat template, and the loss is on the assistant's answer only. Then I split by customer or by time, not randomly, and remove anything in training that matches the test set, so the score measures generalisation, not memory. I version the dataset by hash. In my experience a few hundred carefully corrected examples beat thousands of raw transcripts, because the model learns the best answer, not the average one.",
      "numbers": "LIMA reached strong instruction-following with about 1,000 carefully curated examples, which is the usual citation for quality over quantity. Hold back 10-20% for testing, split by group rather than randomly.",
      "wrong": "\"We exported a year of chat logs and trained on them.\" That teaches the model your average agent, including mistakes, PII and duplicates, and a random split leaks near-identical conversations into the test set so the score looks great.",
      "follow": "Your fine-tune scores 95% on the test set and 70% in production. What do you suspect first?",
      "followAnswer": "Leakage or a skewed test set. I'd check for near-duplicates between train and test, which happens with templated tickets or the same customer appearing in both splits, by embedding both sets and looking at nearest-neighbour similarity. Then I'd compare the production input mix with the test set: new products, longer messages or other languages that the training data never covered. Finally I'd check formatting at inference. If production prompts don't use the same chat template and system prompt as training, the model behaves like a different model.",
      "builds": [
        "ft-04",
        "ft-01"
      ],
      "next": [
        "ft-14",
        "ft-19",
        "ml-03"
      ],
      "deeper": [
        "lima",
        "hf-chat-templates"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A team builds an SFT set from 20,000 support tickets, many from the same 50 customers using templated wording, and splits 80/10/10 at random. Test accuracy is 96%. What is the most likely problem?",
        "options": [
          "The set is too small for SFT.",
          "Near-duplicate tickets from the same customers sit in both train and test, so the score measures memorisation.",
          "Random splits always underestimate accuracy.",
          "They should have used DPO instead of SFT."
        ],
        "answer": 1,
        "why": "Templated tickets from the same customers are near-duplicates; a random split puts copies on both sides, inflating the score. Splitting by customer and decontaminating fixes it. Size is fine, and switching method doesn't fix leakage."
      },
      "try": {
        "title": "Find near-duplicates leaking across a split",
        "minutes": 20,
        "steps": [
          "Make or download a few hundred short support messages and add some lightly reworded copies on purpose.",
          "Split them randomly 80/20 into train and test.",
          "Embed both sets with a small sentence-transformers model and, for each test item, find its most similar train item.",
          "Count test items with similarity above about 0.9 and read a few pairs, observing how many are the same ticket in different words.",
          "Re-split by a group key such as customer and observe the leaked count fall."
        ],
        "code": "from sentence_transformers import SentenceTransformer, util\nimport random\nmsgs = open('messages.txt').read().splitlines()\nrandom.seed(0); random.shuffle(msgs)\ncut = int(len(msgs) * 0.8)\ntrain, test = msgs[:cut], msgs[cut:]\nm = SentenceTransformer('all-MiniLM-L6-v2')\ntr = m.encode(train, convert_to_tensor=True)\nte = m.encode(test, convert_to_tensor=True)\nsims = util.cos_sim(te, tr).max(dim=1).values\nleaks = [(test[i], float(s)) for i, s in enumerate(sims) if s > 0.9]\nprint(len(leaks), 'of', len(test), 'test items have a near-copy in train')\nfor t, s in leaks[:5]:\n    print(round(s, 3), t)"
      }
    },
    {
      "id": "ft-13",
      "q": "Continued pre-training or supervised fine-tuning - what is the difference, and when would you ever do continued pre-training?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "training"
      ],
      "why": "Tests whether you know the two operate on different data, at different scale, and change different things - and that continued pre-training is rarely the right call for an applied team.",
      "quick": [
        "Continued pre-training: next-token training on raw domain text.",
        "SFT: input-output pairs that shape behaviour and format.",
        "CPT needs far more data and compute, and often re-tuning afterwards.",
        "Use CPT for a large corpus in language the model barely knows.",
        "For changing facts, retrieval is cheaper and stays current."
      ],
      "simple": "Continued pre-training (CPT) carries on the model's original training objective, predicting the next token, but on your raw domain text: manuals, contracts, code in an internal language. It shifts what the model knows and how it represents your domain's vocabulary. It needs no labels, but it needs a lot of text, typically hundreds of millions of tokens or more. It's usually run on a base model, and afterwards you still need instruction tuning, because CPT on an instruct model tends to erode its chat behaviour and safety training.\n\nSupervised fine-tuning (SFT) trains on input-output pairs, usually thousands of them. It changes behaviour, such as format, tone, which steps to follow and when to refuse, more than knowledge.\n\nSo CPT is for when the model doesn't understand the language of your domain at all, and you own a big corpus of it. For example, a legal-tech company with millions of Indian court judgements full of legal Hindi and English might see a frontier model misread the terms, and CPT on a strong open-weight base can help. Most applied teams should first try retrieval for facts and SFT for behaviour, because CPT is a training project with forgetting risk and a large compute bill.",
      "points": [
        "CPT: unlabelled domain text, next-token objective, changes knowledge and representations.",
        "SFT: labelled pairs, changes behaviour and format; far less data.",
        "CPT is usually followed by instruction tuning; mix in general data to limit forgetting.",
        "Good case: large proprietary corpus in a dialect, script or jargon the model handles poorly.",
        "Bad case: frequently changing facts - use retrieval instead.",
        "Not offered on every hosted platform, so it often means self-managed training on open weights."
      ],
      "say": "Continued pre-training keeps the original objective, next-token prediction, but on raw domain text, so it changes what the model knows and how it represents the domain's language. SFT trains on input-output pairs and mainly changes behaviour, like format, steps and tone. The scale differs by orders of magnitude. CPT wants hundreds of millions of tokens, SFT wants thousands of good examples. CPT also usually runs on a base model and needs instruction tuning after, because doing it on a chat model erodes its instruction following and safety behaviour. I'd only do it when we own a large corpus in language the model genuinely handles badly. Think a big body of Indian legal judgements, or code in an internal language, where retrieval can't help because the model misreads the text it retrieves. Even then I'd mix in general data to limit forgetting. For facts that change, retrieval wins, and for behaviour, SFT wins. CPT is the expensive last resort.",
      "numbers": "Order of magnitude: CPT corpora are typically hundreds of millions to billions of tokens, while SFT sets are thousands of examples (a few million tokens) - roughly a 100-1,000x difference in data and compute.",
      "wrong": "\"We'll continue pre-training on our documents so the model knows our company.\" Facts that change go stale in weights, the model still can't cite them, and you've paid for a training run plus re-tuning. Retrieval does this better.",
      "follow": "How would you show that continued pre-training actually helped?",
      "followAnswer": "Three measurements. Perplexity on held-out domain text should fall, which shows the model now predicts the domain's language better, but on its own that's not enough. The downstream task score after the same SFT, on CPT base versus original base, is what matters. And general benchmarks and safety checks must not fall beyond the agreed tolerance. If domain perplexity improves but the downstream task doesn't, the money bought nothing, and I'd stop.",
      "builds": [
        "llm-18",
        "ft-01"
      ],
      "next": [
        "ft-15",
        "ft-18",
        "rag-45"
      ],
      "deeper": [
        "dont-stop-pretraining",
        "hf-trl"
      ],
      "check": {
        "kind": "concept",
        "q": "A team runs continued pre-training directly on a chat-tuned model using 2 billion tokens of internal documents, then deploys it as the assistant. What will most likely go wrong?",
        "options": [
          "Nothing - more domain text always improves the assistant.",
          "Its instruction following and safety behaviour erode, because raw next-token training overwrites chat behaviour.",
          "It will refuse to answer domain questions.",
          "Training will fail because chat models can't do next-token training."
        ],
        "answer": 1,
        "why": "Raw text has no instruction or refusal structure, so heavy CPT pulls the model away from its chat tuning. The usual recipe is CPT on a base model followed by instruction tuning, with general data mixed in."
      }
    },
    {
      "id": "ft-14",
      "q": "Estimate the cost and time of a LoRA fine-tuning run before you start.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "cost"
      ],
      "why": "A manager wants a number before approving GPUs. The panel checks you can do the arithmetic and know that compute is rarely the expensive part.",
      "quick": [
        "Training tokens = examples x average tokens x epochs.",
        "Compute is roughly 6 x parameters x training tokens FLOPs.",
        "Divide by GPU throughput at a realistic 30-50% utilisation.",
        "An 8B LoRA run on tens of millions of tokens takes GPU-hours.",
        "The real cost is iterations, evals and people, not one run."
      ],
      "simple": "Start with training tokens: examples times average tokens per example times epochs. For example, 10,000 examples of 800 tokens over 3 epochs is 24 million tokens.\n\nCompute is roughly 6 FLOPs per parameter per token for a full forward and backward pass. LoRA skips the weight gradients of the frozen model, so it's somewhat less, which makes 6 a safe upper bound. For an 8-billion-parameter model that's 6 x 8e9 x 2.4e7, about 1.2e18 FLOPs.\n\nAn H100 peaks around 1e15 FLOPs per second in BF16 dense maths, and real training reaches maybe 30-50% of that, so call it 3.5e14. That gives about 3,400 seconds, roughly an hour of one GPU. Even if QLoRA, padding and evaluation triple it, it's a few GPU-hours.\n\nMemory decides the GPU. QLoRA on an 8B model fits a 24GB card, while BF16 LoRA needs about 16GB for weights plus activations, so a 40-80GB card is more comfortable.\n\nThe budget conversation is really about iterations. You will run five to ten experiments, each followed by an eval run, and someone spends weeks on data. Hosted fine-tuning prices the same way, per training token times epochs, so the arithmetic carries over.",
      "points": [
        "Tokens = examples x avg tokens x epochs.",
        "FLOPs approx 6 x params x tokens (upper bound; LoRA is somewhat less).",
        "Time = FLOPs / (peak x utilisation, typically 30-50%).",
        "Memory picks the GPU: QLoRA 8B fits 24GB; BF16 LoRA 8B wants 40-80GB.",
        "Multiply by expected iterations and add eval runs.",
        "Data preparation and evaluation time usually cost more than GPUs."
      ],
      "say": "I do it in three lines. Training tokens are examples times average length times epochs, so 10,000 examples of 800 tokens over three epochs is 24 million tokens. Compute is about six FLOPs per parameter per token, which is an upper bound for LoRA because the frozen weights don't need gradients. For an 8B model that's about 1.2 times ten to the eighteen. An H100 peaks around a petaflop in BF16, and realistic utilisation is a third or so, which gives roughly an hour on one GPU. Even tripled for QLoRA and evals, it's a few GPU-hours. Memory decides the hardware. QLoRA on 8B fits a 24 gig card, and plain BF16 LoRA wants 40 to 80. Then I tell the manager the honest part. The run is cheap. We'll do five to ten iterations with an eval after each, and the expensive line is people preparing data and reviewing results. Hosted fine-tuning is priced per training token times epochs, so the same arithmetic gives that quote too.",
      "numbers": "Worked example: 8B params x 24M tokens x 6 = 1.15e18 FLOPs; at ~3.5e14 FLOPs/s effective on one H100 that is ~3,300 s, about 1 GPU-hour. Multiply by your GPU-hour price and by 5-10 iterations.",
      "wrong": "\"Fine-tuning an 8B model needs a cluster and weeks.\" For LoRA on a typical SFT set it's GPU-hours. Overstating compute and ignoring data and eval effort gets the plan, and the budget, wrong in both directions.",
      "follow": "The same job on a 70B model - what changes?",
      "followAnswer": "Compute scales with parameters, so about nine times the FLOPs, roughly ten GPU-hours at the same utilisation before overheads. Memory changes the picture more. 70B in BF16 is about 140GB of weights, so even LoRA needs several GPUs with sharding, while QLoRA brings the weights to roughly 35 to 40GB, so one 80GB GPU can work, but more slowly. Serving cost also rises for the life of the model. So I'd first prove an 8B model can't meet the target on the eval set, because the 70B decision mostly commits you to serving cost.",
      "builds": [
        "ft-02",
        "ft-09"
      ],
      "next": [
        "ft-15",
        "cl-21",
        "sd-19"
      ],
      "deeper": [
        "lora",
        "qlora"
      ],
      "check": {
        "kind": "numbers",
        "q": "A LoRA run trains a 7B model on 5,000 examples of 1,000 tokens for 2 epochs. Using 6 x params x tokens and an effective 3.5e14 FLOPs per second, roughly how long is one run on one GPU?",
        "options": [
          "About 2 minutes.",
          "About 20 minutes.",
          "About 20 hours.",
          "About 2 weeks."
        ],
        "answer": 1,
        "why": "Tokens = 5,000 x 1,000 x 2 = 1e7. FLOPs = 6 x 7e9 x 1e7 = 4.2e17. Divided by 3.5e14 gives 1,200 s, about 20 minutes. The 20-hour answer is the usual overestimate from forgetting how small LoRA SFT sets are."
      },
      "try": {
        "title": "Build a fine-tuning cost estimator",
        "minutes": 15,
        "steps": [
          "Copy the function and run it for an 8B model on 10,000 examples of 800 tokens for 3 epochs.",
          "Change utilisation from 0.5 to 0.25 and observe how sensitive the time is to it.",
          "Try 70B with the same data and note the time scales with parameters.",
          "Multiply by eight iterations and a placeholder GPU-hour price, and compare that with a week of an engineer's time - observe which line dominates."
        ],
        "code": "def lora_estimate(params_b, examples, avg_tokens, epochs,\n                  peak_flops=1e15, utilisation=0.35,\n                  gpu_hour_price=1.0, iterations=1):\n    tokens = examples * avg_tokens * epochs\n    flops = 6 * params_b * 1e9 * tokens   # upper bound for LoRA\n    seconds = flops / (peak_flops * utilisation)\n    hours = seconds / 3600\n    return {\n        'train_tokens_M': round(tokens / 1e6, 1),\n        'gpu_hours_per_run': round(hours, 2),\n        'cost_all_runs': round(hours * gpu_hour_price * iterations, 2),\n    }\n\nprint(lora_estimate(8, 10_000, 800, 3))\nprint(lora_estimate(8, 10_000, 800, 3, utilisation=0.25))\nprint(lora_estimate(70, 10_000, 800, 3, iterations=8))"
      }
    },
    {
      "id": "ft-15",
      "q": "Hosted fine-tuning on a provider's platform, or fine-tuning open weights yourself - how do you choose?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "fine-tuning",
        "cloud",
        "trade-offs"
      ],
      "why": "In 2026 this is a live risk question: one major provider closed its fine-tuning platform to new users. The panel checks you weigh ownership, exit risk and residency, not just convenience.",
      "quick": [
        "Hosted: upload data, get a tuned model, no GPUs - but no weights.",
        "OpenAI is winding down its fine-tuning platform; no new users.",
        "Azure Foundry, Bedrock and Google still offer managed tuning.",
        "DIY: open weights plus TRL or PEFT; you own and move the model.",
        "Decide on exit risk, residency of training, methods and serving cost."
      ],
      "simple": "Hosted fine-tuning means you upload a dataset, the provider trains a private variant of its model, and you call it like any deployment. There are no GPUs or training code to manage, and you can tune closed models you could never download. The catch is that you never get the weights. The tuned model lives only as long as the provider supports it and its base model.\n\nThat risk became concrete in 2026. In May, OpenAI announced it was winding down its own fine-tuning platform. It's closed to new users, existing users can run jobs for a limited period, and tuned models keep working only until their base model is retired. Managed tuning continues elsewhere. Azure Foundry offers supervised, preference and reinforcement fine-tuning for some OpenAI and open models, Bedrock offers supervised and reinforcement fine-tuning plus distillation, and Google's Agent Platform offers supervised and preference tuning for Gemini. Check where training runs, though. Foundry's cheaper Global training, for instance, comes with no data residency guarantee.\n\nDIY means taking an open-weight model and training it with TRL, PEFT or Unsloth on your own GPUs. You own the artefact, can serve it anywhere including on-premises, and can use any method. You also own the MLOps, the GPUs and the serving. For example, a client who must keep the model for seven years for audit should own weights.",
      "points": [
        "Hosted: fastest, can tune closed frontier models, no weights, tied to provider and base-model lifecycle.",
        "2026: OpenAI winding down its fine-tuning platform (closed to new users); Azure Foundry, Bedrock and Google still offer managed tuning.",
        "Check where training data is processed - some cheaper global training options have no residency guarantee.",
        "DIY on open weights: own and move the artefact, any method, on-prem possible; you run training and serving.",
        "Serving cost often decides it: a hosted tuned model may require dedicated capacity.",
        "Either way, keep the dataset and eval suite as the portable assets."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of hosted fine-tuning and do-it-yourself fine-tuning on ownership of weights, methods, residency, exit risk and operational burden.",
        "caption": "**Your dataset and eval suite are the only fully portable assets.** Hosted tuning rents the model; DIY owns it and the operations that come with it.",
        "aspects": [
          "Who owns weights",
          "Methods",
          "Training residency",
          "Exit risk",
          "Ops burden"
        ],
        "columns": [
          {
            "label": "Hosted tuning",
            "note": "Foundry, Bedrock, Google",
            "cells": [
              "Provider",
              "What the platform offers",
              "Depends on option chosen",
              "Base retirement, platform changes",
              "Low"
            ],
            "accent": "warn"
          },
          {
            "label": "DIY open weights",
            "note": "TRL, PEFT, Unsloth",
            "accent": "accent",
            "cells": [
              "You",
              "Anything",
              "Wherever you train",
              "Low - you hold the file",
              "High"
            ]
          }
        ]
      },
      "say": "I start with ownership and exit risk, because hosted tuning never gives you the weights. The tuned model lives as long as the provider and its base model. That stopped being theoretical this year. In May OpenAI announced it's winding down its fine-tuning platform, closed to new users, and tuned models only last until their base retires. Managed tuning is still alive elsewhere. Azure Foundry does supervised, preference and reinforcement tuning for some models, Bedrock does supervised, reinforcement and distillation, and Google tunes Gemini. They suit a client who needs a closed base and has no ML platform team. I'd check where training runs, because some cheaper global options carry no residency guarantee. DIY on open weights with TRL or PEFT means the client owns the artefact, can serve it on-premises, and can use any method, at the cost of running training and serving. Whichever I pick, I treat the dataset and eval suite as the real assets, because they let me re-tune on the next base model in days.",
      "numbers": "Bedrock prices model training by tokens processed (training tokens x epochs) plus a monthly storage charge per custom model; OpenAI's remaining reinforcement fine-tuning bills by training time. Check current pricing pages - the billing unit changes the estimate.",
      "verified": "2026-10",
      "wrong": "\"We'll fine-tune on the provider's API - it's the simplest.\" Simplest today, but you don't own the result, and when the platform or base model is retired you start again. Not naming that risk in 2026 is a red flag.",
      "follow": "A client's tuned model on a hosted platform has a base-model retirement date in six months. What is your plan?",
      "followAnswer": "Because we kept the dataset and the eval suite, this is a re-run, not a rescue. In the first month I'd re-tune on the platform's replacement base, or on an open-weight model if the client wants out of the lock-in, and also test the new base with just a good prompt, since newer models often close the gap that justified tuning. All candidates run the same eval set, including the regression and safety slices, and I'd pick on cost per correct answer. Then a canary and switch, with at least two months of slack before the retirement date.",
      "builds": [
        "ft-01",
        "ft-14"
      ],
      "next": [
        "ft-24",
        "ft-23",
        "ft-07"
      ],
      "deeper": [
        "openai-model-optimization",
        "hf-trl"
      ],
      "check": {
        "kind": "judgement",
        "q": "A regulated client must be able to reproduce and serve the exact tuned model for seven years, on-premises if required. Which approach fits?",
        "options": [
          "Hosted fine-tuning of a closed model, since providers guarantee long support.",
          "Fine-tune an open-weight model yourself and archive the weights, data, code and eval results.",
          "Avoid fine-tuning and rely on prompt changes, which never need archiving.",
          "Use a provider's global training option for lower cost."
        ],
        "answer": 1,
        "why": "Only owned weights can be archived and served on-premises for years. Hosted tuned models disappear when the base model or platform is retired - which has already happened in 2026. Global training is about cost and residency, not reproducibility."
      }
    },
    {
      "id": "ft-16",
      "q": "You have SFT working. How do you run preference tuning with DPO or ORPO in practice?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "alignment",
        "fine-tuning"
      ],
      "why": "ft-03 defines the methods. This checks you have done it: where pairs come from, the settings that matter, and the failure modes like learning \"longer is better\".",
      "quick": [
        "Data: a prompt, a chosen answer and a rejected answer.",
        "Best pairs: human correction is chosen, original output is rejected.",
        "SFT first, then DPO; beta controls drift from the reference model.",
        "Watch length bias - the model learns \"longer wins\".",
        "ORPO merges both steps; in TRL it is experimental, DPO is stable."
      ],
      "simple": "Preference tuning teaches a model which of two answers is better, rather than copying one answer. Each example is a prompt, a chosen response and a rejected response.\n\nThe best pairs come from your own pipeline. When a reviewer corrects a model draft, the correction is chosen and the draft is rejected. You can also sample two answers and have people pick, or use an LLM judge, with humans spot-checking it. Pairs need a real but learnable difference. Two near-identical answers teach nothing, and a garbage rejected answer teaches only the obvious.\n\nThe usual recipe is SFT first on good answers, then DPO on the pairs, and Google's tuning docs and OpenAI's guide describe the same order. DPO's `beta` sets how far the model may move from the reference model. TRL's default is 0.1, and lower values allow more drift. Learning rates are much smaller than for SFT.\n\nThe classic failure is length bias. If chosen answers are usually longer, the model learns that length wins and gets verbose, and an LLM judge that also prefers long answers hides it. So you balance lengths in the pairs and evaluate with length in mind.\n\nORPO combines SFT and preference learning in one stage with no reference model, which saves memory. In TRL v1 it sits under experimental while DPO is stable, so DPO is the safer default.",
      "points": [
        "Pairs: prompt, chosen, rejected; best from human corrections of model drafts.",
        "Pairs must differ meaningfully but be learnable; filter trivial and near-identical pairs.",
        "SFT then DPO; tune beta (TRL default 0.1) and use a small learning rate.",
        "Failure modes: length bias, judge bias, over-optimisation that hurts general skills.",
        "Track reward margins in training, but decide on a held-out eval with length controlled.",
        "ORPO: single stage, no reference model; experimental in TRL, so DPO is the default."
      ],
      "say": "Each example is a prompt with a chosen and a rejected answer, and the best source is our own review loop. When an expert corrects a draft, the correction is chosen and the draft is rejected, so the pair captures exactly the judgement we want. I'd add sampled pairs ranked by people or a judge, with humans checking the judge. I do SFT first, then DPO. The setting that matters is beta, which controls how far the model can drift from the reference. TRL defaults to 0.1, and the learning rate is much lower than in SFT. The trap I watch for is length bias. If chosen answers are usually longer, the model learns that length wins, and a judge that likes long answers won't notice. So I balance lengths in the pairs and compare outputs at similar length. ORPO folds SFT and preference into one stage without a reference model, which saves memory, but in TRL it's still experimental, so I'd default to DPO.",
      "numbers": "TRL's DPOTrainer defaults to `beta = 0.1`. Typical DPO learning rates are one to two orders of magnitude below SFT learning rates for the same setup; start low and watch held-out quality, not just training reward margins.",
      "verified": "2026-10",
      "wrong": "\"We generated pairs where the chosen answer is from a bigger model and the rejected one from a tiny model.\" The difference is too easy, mostly style and length, so the model learns surface cues, not your judgement.",
      "follow": "After DPO, your judge says the new model wins 70% of comparisons, but users complain it rambles. What happened?",
      "followAnswer": "Probably length bias in two places. The chosen answers in the pairs were longer on average, so DPO rewarded length, and the judge also prefers longer answers, so the win rate rewards the same thing. I'd measure average output length before and after, rerun the judge comparison on length-matched outputs or with an instruction to ignore length, and rebalance the pairs so chosen and rejected have similar lengths. I'd also add a user-facing metric like reading time or edit distance to the final answer, so the eval tracks what users actually feel.",
      "builds": [
        "ft-03",
        "ft-12"
      ],
      "next": [
        "ft-17",
        "ft-18",
        "ev-03"
      ],
      "deeper": [
        "dpo",
        "hf-trl"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "In a DPO dataset, 85% of chosen answers are noticeably longer than their rejected pair. After training, a judge model rates the new model higher. What is the likely problem?",
        "options": [
          "None - longer answers are more complete.",
          "Beta was too high, so the model didn't change.",
          "The model may have learned that length wins, and a length-biased judge rewards the same thing.",
          "DPO cannot learn from answers of different lengths."
        ],
        "answer": 2,
        "why": "A systematic length gap gives DPO an easy signal - be longer - and LLM judges often favour long answers, so the win rate confirms the bias rather than real quality. Balance lengths and evaluate length-matched outputs."
      }
    },
    {
      "id": "ft-17",
      "q": "A client asks for reinforcement fine-tuning on their task. What do you need before you start, and when is it worth it over SFT?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "alignment",
        "fine-tuning",
        "training"
      ],
      "why": "ft-11 explains GRPO and verifiable rewards. This is the applied version: hosted RFT now exists on several clouds, and the panel checks you know its prerequisites and failure modes.",
      "quick": [
        "RFT trains on a grader's score, not on example answers.",
        "Needs a grader you trust that can't be gamed.",
        "The base model must sometimes succeed, but not always.",
        "Watch reward hacking, collapsing variety and runaway length.",
        "Worth it when answers are checkable but hard to write out."
      ],
      "simple": "Reinforcement fine-tuning (RFT) is the applied form of the RL with verifiable rewards behind reasoning models. Instead of showing correct answers, you give prompts and a grader. The model generates several attempts per prompt, the grader scores them, and training pushes towards the higher-scoring attempts. GRPO, from the DeepSeekMath paper and used for DeepSeek-R1, does this by comparing each attempt with the group's average, without a separate value model. Variants such as DAPO and GSPO adjust the details.\n\nIt's now available as a managed service. Azure Foundry offers RFT for some reasoning models, Bedrock offers it with reward functions written as Lambda functions, and you can run GRPO yourself with TRL.\n\nThree prerequisites decide whether it works. First, a grader you trust, ideally a program: does the JSON validate, do the extracted amounts match the ledger, do the tests pass. Second, a base model that sometimes succeeds, because if it never does there's nothing to reinforce, and if it always does there's nothing to learn. Third, the grader can't be gamed by guessing or format tricks.\n\nFor example, invoice extraction with a reconciliation check is a good fit, because many reasoning paths work and correctness is checkable. A brand-voice task with no objective check is not, and SFT or DPO serve it better.",
      "points": [
        "Prompts plus grader; model samples several attempts per prompt; optimise towards higher scores.",
        "GRPO compares attempts within a group, no value model; DAPO and GSPO are later variants.",
        "Managed options exist (Azure Foundry, Bedrock with Lambda rewards); DIY with TRL's GRPOTrainer.",
        "Prerequisites: trustworthy, ungameable grader; base success rate neither zero nor near 100%.",
        "Failure modes: reward hacking, entropy collapse, length blow-up, overfitting to the grader.",
        "Fit: checkable correctness with many valid paths and no gold reasoning traces."
      ],
      "say": "RFT trains on a grader's score rather than on example answers. The model makes several attempts per prompt, the grader scores them, and training moves towards the better attempts. GRPO is the common algorithm, comparing each attempt with its group's average. It's managed now too, with Azure Foundry and Bedrock both offering RFT, or I can run GRPO in TRL. Before agreeing I check three things. Is there a grader I trust, ideally code, like a schema check plus reconciliation against the ledger? Does the base model succeed sometimes but not always? I measure that first, because zero means nothing to reinforce and near 100 percent means nothing to learn. And can the grader be gamed by guessing or format tricks? I red-team the grader before training. It's worth it over SFT when correctness is checkable but good answers are hard to write out, like multi-step extraction. For tone or style there's no objective check, so SFT or DPO is better. I watch for reward hacking throughout.",
      "numbers": "Rule of thumb: measure the base model's pass rate on the training prompts with several samples each before starting. Somewhere between roughly 10% and 80% is workable; near 0% or near 100% means RFT has little to learn from.",
      "verified": "2026-10",
      "wrong": "\"We'll use an LLM judge as the reward and train until the score maxes out.\" The model learns to please the judge, not to be right, and a maxed-out score is often the sign of reward hacking, not success.",
      "follow": "During RFT the reward climbs steadily but your held-out accuracy stops improving. What is happening?",
      "followAnswer": "The model is probably exploiting the grader rather than getting better at the task. I'd read samples from late training, looking for patterns like hedged answers that match more patterns, padding, or format tricks that pass a string check. I'd compare the grader's score with a stricter held-out check, ideally human-verified, and look at output length and diversity, since collapsing variety is another symptom. The fix is to tighten the grader, for example adding penalties or an exact-match component, and to choose the checkpoint by held-out accuracy rather than training reward.",
      "builds": [
        "ft-11",
        "ft-16"
      ],
      "next": [
        "ft-19",
        "ev-13",
        "ft-18"
      ],
      "deeper": [
        "grpo",
        "hf-trl"
      ],
      "check": {
        "kind": "which-fails",
        "q": "For which task is reinforcement fine-tuning least likely to beat SFT?",
        "options": [
          "Extracting invoice totals that can be reconciled against a ledger.",
          "Generating SQL that must return the same rows as a reference query.",
          "Writing marketing copy in the brand's voice.",
          "Solving maths word problems with known numeric answers."
        ],
        "answer": 2,
        "why": "RFT needs a grader that checks correctness objectively. Brand voice has no reliable programmatic check, so an RFT reward would be a judge model that's easy to game; SFT or DPO on examples suits it better. The others have verifiable answers."
      }
    },
    {
      "id": "ft-18",
      "q": "Your fine-tune shipped and users say it got worse at everything else. How would you have caught that, and how do you measure it now?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "evaluation"
      ],
      "why": "ft-05 covers what catastrophic forgetting is and how to avoid it. This checks the measurement - a regression suite beyond the target task - which is what actually catches it.",
      "quick": [
        "Validation loss on the task won't show forgetting.",
        "Keep a regression suite: general skills, instructions, safety, languages, nearby tasks.",
        "Compare base and tuned on identical prompts, paired.",
        "Agree tolerances before training, and block release on breach.",
        "LoRA forgets less than full tuning, but not zero."
      ],
      "simple": "Forgetting doesn't show up in the numbers people usually watch. Training and validation loss on the target task keep improving while the model quietly loses other skills. So you need a separate regression suite, built before training and run on every checkpoint, the base model and the candidate.\n\nThe suite has slices. There's general reasoning and knowledge, from small samples of public benchmarks. There's instruction following, checking that it still obeys format and length instructions. Safety covers both sides: it should still refuse harmful requests and shouldn't start refusing harmless ones. Languages matter too, for example Hindi and code-mixed Hinglish if users write that way. Finally, nearby tasks from production logs that weren't in the training data, like the email-writing requests your support model also gets.\n\nYou run base and tuned on identical prompts and compare item by item, then check each slice against a tolerance agreed beforehand. For example, \"no slice drops more than two points, and safety refusals don't drop at all.\" If a slice breaches, you mix in general data, lower the learning rate or epochs, or reduce LoRA's rank or scope, and pick the checkpoint by the suite rather than by validation loss.\n\nLoRA helps. One study found it learns less and forgets less than full fine-tuning, but less isn't none.",
      "points": [
        "Task validation loss is blind to forgetting.",
        "Regression slices: general knowledge, reasoning, instruction following, safety (refusal and over-refusal), languages, adjacent production tasks.",
        "Paired comparison of base vs tuned on identical prompts and settings.",
        "Tolerances agreed before training; release blocked on breach.",
        "Mitigations: replay general data, lower LR or epochs, smaller LoRA scope, choose checkpoint by suite.",
        "LoRA forgets less than full fine-tuning, not zero."
      ],
      "say": "The task's validation loss won't show it, because forgetting happens off-task. So before training I build a regression suite and run it on the base model and every checkpoint. It has slices: general reasoning and knowledge from small public benchmark samples, instruction following, safety in both directions, meaning it still refuses harmful requests and doesn't start refusing harmless ones, the languages our users actually write, like Hindi or Hinglish, and nearby tasks from production logs that weren't in training. I compare base and tuned on identical prompts, item by item, and check each slice against tolerances we agreed before training, say no slice down more than two points and no drop in safety. A breach blocks release. Then I fix it by mixing general data back in, lowering learning rate or epochs, or narrowing the LoRA, and I pick the checkpoint by the suite, not by validation loss. LoRA does forget less than full fine-tuning, but less isn't zero, so the suite runs regardless.",
      "numbers": "With 200 items in a slice, a measured accuracy near 50% has a 95% margin of about plus or minus 7 points, so a two-point tolerance needs paired comparison or several hundred items per slice to be meaningful.",
      "wrong": "\"Validation loss went down the whole time, so the model is better.\" Validation loss measures only the target task. The model can get better at that while losing general skills and safety behaviour.",
      "follow": "The tuned model now refuses some ordinary requests it used to answer. What do you do?",
      "followAnswer": "That's over-refusal, a safety regression in the less obvious direction. I'd measure it with a set of benign prompts that look superficially risky, and compare base and tuned refusal rates. Then I'd look at the training data for the cause, often examples where the target answer was a refusal or a heavy disclaimer, which taught the model to refuse more widely. I'd fix the data first, then add some general instruction data back in, and retrain with the refusal rate as a release gate alongside the harmful-request check.",
      "builds": [
        "ft-05",
        "ft-08"
      ],
      "next": [
        "ft-19",
        "ev-02",
        "gr-07"
      ],
      "deeper": [
        "lora-forgets-less",
        "hamel-evals"
      ],
      "check": {
        "kind": "concept",
        "q": "A fine-tune's validation loss on the target task falls steadily for three epochs. What does that tell you about catastrophic forgetting?",
        "options": [
          "It rules forgetting out, because loss is falling.",
          "Nothing directly - forgetting shows on other skills, so it needs a separate regression suite.",
          "Forgetting is certain after three epochs.",
          "It means LoRA was used, so forgetting is impossible."
        ],
        "answer": 1,
        "why": "Validation loss measures only the target task. Forgetting is loss of other skills, so only off-task slices - general, safety, languages, adjacent tasks - reveal it. LoRA reduces forgetting but doesn't prevent it."
      }
    },
    {
      "id": "ft-19",
      "q": "How do you prove a fine-tune beats a good prompt plus RAG on the base model?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "evaluation",
        "fine-tuning",
        "rag"
      ],
      "why": "The decision a manager actually needs. Many teams compare their fine-tune with a weak prompt; the panel checks you build fair baselines and decide on cost per correct answer.",
      "quick": [
        "Compare four arms: base, base+RAG, fine-tuned, fine-tuned+RAG.",
        "Give the baseline your best prompt and few-shot examples.",
        "Same held-out set, split by customer or time, same retrieval.",
        "Use paired comparisons and confidence intervals, not single scores.",
        "Decide on cost per correct answer and maintenance burden."
      ],
      "simple": "A fine-tune is only worth shipping if it beats the best alternative you could run without it. So the comparison has four arms on the same held-out set: the base model with your best prompt, the base model with RAG and a few good examples, the fine-tuned model, and the fine-tuned model with RAG.\n\nThe baseline has to be strong. Spend a day improving its prompt and few-shot examples, because a fine-tune compared with a lazy prompt always looks good. Every arm uses the same test items, split by customer or time so nothing overlaps with training, and the same retriever where RAG is used.\n\nMeasure what the business pays for. That means task accuracy or faithfulness, format validity, latency, and cost per request, combined into cost per correct answer, plus the regression suite for general skills. Compare arms item by item and put confidence intervals on the differences. With 200 items, a single accuracy figure is uncertain by several points.\n\nFor example, if the fine-tune scores 3 points higher than base-plus-RAG but the interval spans zero, and it also needs a dedicated deployment, the answer is not to ship it. If a fine-tuned small model matches the frontier-plus-RAG arm at a fifth of the cost per correct answer, that's the business case.",
      "points": [
        "Four arms: base prompt, base + RAG + few-shot, fine-tuned, fine-tuned + RAG.",
        "Invest in the baseline's prompt first; weak baselines flatter fine-tunes.",
        "Identical held-out items, group-aware split, same retriever and judge.",
        "Paired comparison with bootstrap confidence intervals on differences.",
        "Metrics: accuracy or faithfulness, format validity, p95 latency, cost per correct answer, regression slices.",
        "Include ongoing cost: retraining, serving capacity, re-tuning on new bases."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "A two by two grid: base or fine-tuned model, with or without retrieval, giving four arms to compare on the same test set.",
        "caption": "**Run all four on the same items.** The fine-tune must beat the best of the base arms on cost per correct answer, not just the plain prompt.",
        "xLabel": "Retrieval",
        "yLabel": "Model",
        "cols": [
          "No RAG",
          "With RAG"
        ],
        "rows": [
          "Base",
          "Fine-tuned"
        ],
        "cells": [
          [
            {
              "label": "Best prompt + few-shot"
            },
            {
              "label": "Usual strongest baseline",
              "accent": "accent"
            }
          ],
          [
            {
              "label": "Behaviour, no facts"
            },
            {
              "label": "Often the winner for format + facts",
              "accent": "accent"
            }
          ]
        ]
      },
      "say": "I run four arms on the same held-out set: base with our best prompt, base with RAG and a few examples, the fine-tune, and the fine-tune with RAG. The first discipline is a strong baseline. I spend real time on the base prompt, because a fine-tune compared with a lazy prompt always wins. Everything uses identical items, split by customer or time so nothing overlaps training, with the same retriever and judge. I compare item by item and bootstrap a confidence interval on each difference, because with a couple of hundred items a single score can move several points by chance. The metrics are what the business pays for: accuracy or faithfulness, format validity, p95 latency, and cost per correct answer, plus the regression suite. Then I add the ongoing cost, meaning serving capacity and re-tuning when the base model changes. If the gain is inside the noise, it doesn't ship. The winning case is usually a small fine-tuned model matching the frontier-plus-RAG arm at a fraction of the cost.",
      "numbers": "Sampling error: at around 50% accuracy, n = 200 gives a 95% interval of about plus or minus 7 points (1.96 x sqrt(0.25/200)); n = 500 gives about plus or minus 4.4. Paired comparison on the same items narrows the interval on the difference.",
      "wrong": "\"The fine-tune scored 88% against the base model's 71%.\" Against which prompt, without RAG, on which split, and is 17 points outside the noise? Without a strong baseline and an interval, that number proves nothing.",
      "follow": "The fine-tune wins on accuracy but costs more to serve. How do you present it?",
      "followAnswer": "As cost per correct answer, plus the cost of an error. If each mistake triggers a manual review that costs more than the inference difference, the more accurate model can be cheaper overall, and I'd show that arithmetic with the client's own review cost. I'd also show the fixed costs: dedicated capacity for the tuned model, retraining every time the data or base model changes, and the eval upkeep. Then a clear recommendation with the break-even volume, and the option of a cascade, where the cheaper arm handles confident cases and the tuned model takes the rest.",
      "builds": [
        "ft-08",
        "rag-45"
      ],
      "next": [
        "ft-18",
        "ev-08",
        "ft-21"
      ],
      "deeper": [
        "hamel-evals",
        "ragas"
      ],
      "check": {
        "kind": "judgement",
        "q": "Base + RAG scores 81% and the fine-tune + RAG 84% on 150 items, with a paired 95% interval on the difference of -2 to +8 points. The fine-tune needs its own deployment. What do you recommend?",
        "options": [
          "Ship the fine-tune - it scored higher.",
          "Don't ship yet; the gain may be zero, so collect more items or improve the baseline first.",
          "Ship both and let users choose.",
          "Drop RAG, since the fine-tune makes it unnecessary."
        ],
        "answer": 1,
        "why": "The interval includes zero, so the 3-point gain may be noise, and the fine-tune adds serving and maintenance cost. Enlarge the test set or try cheaper improvements before committing. Dropping RAG wasn't tested at all."
      },
      "try": {
        "title": "See how sample size changes a winning margin",
        "minutes": 15,
        "steps": [
          "Copy the script, which simulates paired results for a baseline at 80% and a fine-tune at 83% true accuracy.",
          "Run it with n = 100 and read the bootstrap interval on the difference.",
          "Run it with n = 500 and n = 2,000 and observe when the interval stops including zero.",
          "Write down the smallest test set you would accept before claiming a 3-point win."
        ],
        "code": "import numpy as np\nrng = np.random.default_rng(0)\n\ndef paired_ci(n, p_base=0.80, p_ft=0.83, boots=5000):\n    base = rng.random(n) < p_base\n    ft = rng.random(n) < p_ft\n    diffs = []\n    for _ in range(boots):\n        idx = rng.integers(0, n, n)\n        diffs.append(ft[idx].mean() - base[idx].mean())\n    lo, hi = np.percentile(diffs, [2.5, 97.5])\n    return round(ft.mean() - base.mean(), 3), round(lo, 3), round(hi, 3)\n\nfor n in (100, 500, 2000):\n    print(n, paired_ci(n))"
      }
    },
    {
      "id": "ft-20",
      "q": "GPTQ, AWQ, GGUF, FP8 - how do these quantisation methods differ, and which runs where?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "open-weights",
        "serving",
        "inference"
      ],
      "why": "llm-12 covers what quantisation costs and cl-22 how to pick one for serving. This checks you know the methods and formats themselves, which come up the moment a client says \"we downloaded the GGUF\".",
      "quick": [
        "GPTQ: 4-bit weights, rounding errors corrected layer by layer with calibration data.",
        "AWQ: 4-bit weights, protects the channels that activations show matter.",
        "GGUF: llama.cpp file format with k-quants, for CPU, Mac and Ollama.",
        "FP8: 8-bit floats for weights and activations on recent NVIDIA GPUs.",
        "8-bit is usually near-lossless; 4-bit costs most on maths, code, Indic."
      ],
      "simple": "All four shrink a model by storing numbers with fewer bits, but they differ in how they choose those numbers and where they run.\n\nGPTQ quantises weights to about 4 bits one layer at a time. It uses a small calibration set to measure the error each rounding introduces and adjusts the remaining weights to compensate. AWQ also targets 4-bit weights, but first looks at activations to find the small share of weight channels that matter most, and scales them so rounding hurts them less. Both are weight-only formats (W4A16). Weights are stored in 4 bits and expanded to 16-bit for the maths, served on GPUs by vLLM and similar engines with fast kernels.\n\nGGUF is a file format, not an algorithm. It's what llama.cpp and Ollama load, with \"k-quant\" levels such as Q4_K_M at roughly 4.9 bits per weight, Q5_K_M and Q8_0. It suits CPUs, Apple silicon and consumer GPUs.\n\nFP8 stores weights and activations as 8-bit floats and uses native FP8 maths on Hopper and Ada-generation GPUs, and vLLM can convert a 16-bit model at load time. Newer NVIDIA Blackwell GPUs add a 4-bit float format, NVFP4.\n\nFor quality, 8-bit is usually close to the original. 4-bit loses little on average benchmarks but more on maths, code, long context and low-resource languages. For example, a Hindi-heavy assistant should be evaluated in Hindi before you trust a 4-bit build.",
      "points": [
        "GPTQ: calibration-based, layer-wise error compensation; 4-bit weights for GPU serving.",
        "AWQ: activation-aware scaling protects salient channels; 4-bit weights for GPU serving.",
        "GGUF: llama.cpp/Ollama format with k-quants (Q4_K_M, Q5_K_M, Q8_0) for CPU, Mac, small GPUs.",
        "FP8: weights and activations in 8-bit float; native on Hopper/Ada; NVFP4 on Blackwell.",
        "bitsandbytes NF4 is mainly for QLoRA training, not fast serving.",
        "Quality cost concentrates in maths, code, long context and Indic languages - test there."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of GPTQ, AWQ, GGUF and FP8 by how each works, where it runs and its typical use.",
        "caption": "**Algorithm, format or number type - they are not the same kind of thing.** Pick by the runtime you deploy on, then check quality on your own eval.",
        "aspects": [
          "What it is",
          "How it works",
          "Runs on",
          "Typical use"
        ],
        "columns": [
          {
            "label": "GPTQ",
            "note": "2022",
            "cells": [
              "Quantisation algorithm",
              "Corrects rounding error layer by layer",
              "GPU (vLLM and others)",
              "4-bit GPU serving"
            ]
          },
          {
            "label": "AWQ",
            "note": "2023",
            "cells": [
              "Quantisation algorithm",
              "Protects important channels first",
              "GPU (vLLM and others)",
              "4-bit GPU serving"
            ]
          },
          {
            "label": "GGUF",
            "note": "llama.cpp",
            "accent": "accent",
            "cells": [
              "File format with k-quants",
              "Block-wise integer levels",
              "CPU, Apple silicon, small GPUs",
              "Laptops, Ollama, edge"
            ]
          },
          {
            "label": "FP8",
            "note": "Hopper, Ada",
            "cells": [
              "8-bit float number type",
              "Weights and activations in FP8",
              "Recent NVIDIA GPUs",
              "Near-lossless datacentre serving"
            ]
          }
        ]
      },
      "say": "They're different kinds of thing. GPTQ and AWQ are algorithms for 4-bit weights. GPTQ goes layer by layer with a calibration set and adjusts the remaining weights to cancel rounding error. AWQ first uses activations to find the small set of channels that matter most and protects them before rounding. Both give weight-only 4-bit models that GPU engines like vLLM serve with fast kernels. GGUF is a file format, the one llama.cpp and Ollama use, with k-quant levels like Q4_K_M at about 4.9 bits per weight, and it's what you use on CPUs, Macs and small GPUs. FP8 is an 8-bit float type for weights and activations with native support on Hopper and Ada GPUs, and it's usually close to lossless. The newer Blackwell GPUs add a 4-bit float. For quality, 8-bit rarely hurts, while 4-bit loses little on average benchmarks but more on maths, code, long context and Indic languages. So I evaluate the quantised build on our own set, in our users' languages.",
      "numbers": "Memory arithmetic: a 70B model is about 140GB of weights in 16-bit, about 70GB in 8-bit and roughly 35-40GB at 4 bits plus scales - the difference between multiple GPUs and one 80GB GPU, before the KV cache.",
      "verified": "2026-10",
      "wrong": "\"4-bit is lossless now, so we always use it.\" Average benchmark loss is small, but losses cluster in maths, code, long context and low-resource languages. Shipping without testing on your own slices is a gamble.",
      "follow": "The client wants the model on CPU-only servers. Which format and what do you warn them about?",
      "followAnswer": "GGUF with llama.cpp, or Ollama on top, at Q4_K_M or Q5_K_M as a starting point, choosing by our eval. The warnings are about throughput, not just quality. CPU generation is bandwidth-bound, so tokens per second is far lower than on a GPU, and concurrency collapses quickly with several users. I'd measure tokens per second and time-to-first-token on their actual servers with realistic prompt lengths, keep the model small, ideally under about 8B, and limit context. If they need many concurrent users, I'd show the numbers that justify a single GPU.",
      "builds": [
        "llm-12",
        "ft-09"
      ],
      "next": [
        "cl-22",
        "ft-21",
        "ft-24"
      ],
      "deeper": [
        "gptq",
        "awq"
      ],
      "check": {
        "kind": "concept",
        "q": "A colleague says: \"GGUF is a better quantisation algorithm than AWQ, so we should serve GGUF on our H100s with vLLM.\" What is the main error?",
        "options": [
          "GGUF is a file format mainly for llama.cpp-style runtimes, while AWQ is an algorithm for GPU serving - they aren't competitors on the same axis.",
          "GGUF only supports 8-bit, so it is larger.",
          "AWQ only works on CPUs.",
          "There is no error - GGUF is always faster on GPUs."
        ],
        "answer": 0,
        "why": "GGUF is the llama.cpp/Ollama format with k-quant levels, aimed at CPUs, Macs and small GPUs. AWQ and GPTQ produce weights for GPU engines like vLLM, or FP8 on H100s. Choose by runtime first, then compare quality on your eval."
      },
      "try": {
        "title": "Compare two quantisation levels of the same model",
        "minutes": 25,
        "steps": [
          "Install Ollama and, from one small model's tags page, pull its q4_K_M and q8_0 variants.",
          "Write 20 short arithmetic word problems with known answers, plus five questions in Hindi.",
          "Run both variants on all prompts at temperature 0, recording correctness and tokens per second from the API response.",
          "Observe how much accuracy changes against how much speed and memory you gain, and whether the Hindi questions suffer more."
        ]
      }
    },
    {
      "id": "ft-21",
      "q": "When does a small language model beat a frontier API?",
      "round": [
        "tech1",
        "manager"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "open-weights",
        "cost",
        "trade-offs"
      ],
      "why": "Cost pressure makes this a common manager question. The panel checks you know where small models win, where they lose, and how to get from one to the other safely.",
      "quick": [
        "Small models win on narrow, high-volume, well-defined tasks.",
        "Classification, extraction, routing and redaction are the classic wins.",
        "They lose on open-ended reasoning, long agent runs and broad knowledge.",
        "Use the frontier model to build labels and evals, then distil.",
        "Cascade: small model first, escalate when unsure."
      ],
      "simple": "A small language model, roughly 1 to 8 billion parameters, often open-weight, can match a frontier model when the task is narrow and well defined. Think classifying tickets, extracting fields from a known document type, routing intents or detecting PII. Fine-tuned on a few thousand good examples, it learns that one job, then runs at a fraction of the cost and latency. It can even run on a single modest GPU, on a CPU or inside the client's data centre.\n\nIt loses when the task needs broad knowledge, long multi-step reasoning, many tools, or languages and domains it has never seen. It also loses at low volume, where the engineering and hosting effort costs more than the API bill would.\n\nThe practical path uses both. Start with a frontier model to prove the task and build a labelled eval set, then train the small model on frontier outputs that humans have checked. Put it in front as a cascade: it answers when its confidence is high and escalates the rest to the frontier model.\n\nFor example, a bank routing 2 million customer messages a month into 40 queues is a natural small-model job, while its credit-memo drafting agent stays on a frontier model.",
      "points": [
        "Wins: narrow tasks with clear labels, high volume, tight latency, residency or on-device needs.",
        "Loses: open-ended reasoning, long agentic tasks, broad world knowledge, unseen languages, low volume.",
        "Frontier model first to prove the task and create labels and evals; then distil or fine-tune.",
        "Cascade with confidence-based escalation captures most savings with bounded risk.",
        "Count total cost: hosting, retraining and monitoring, not just tokens."
      ],
      "say": "A small model, say one to eight billion parameters, beats a frontier API when the task is narrow, well defined and high volume. Classification, field extraction from a known document type, intent routing and PII detection are the classic cases. Fine-tuned on a few thousand good examples, it matches the big model on that one job at a fraction of the cost and latency, and it can run in the client's own data centre, which matters for residency. It loses on open-ended reasoning, long agent runs with many tools, broad knowledge and languages it hasn't seen, and it also loses at low volume, where engineering effort outweighs the token bill. So I use both. The frontier model proves the task and builds the labelled eval set, and then I train the small model on checked frontier outputs. In production it's a cascade. The small model answers when it's confident and escalates the rest, and I watch escalation rate and accuracy per slice.",
      "numbers": "Rule of thumb: if a task can be written as \"choose one of N labels\" or \"fill these fields\" and you have a few thousand verified examples, a fine-tuned small model usually gets within a few points of a frontier model - prove it on your eval before switching.",
      "wrong": "\"Small models are just worse; always use the best model.\" For a narrow, high-volume task that can mean paying many times more for no measurable accuracy gain, plus higher latency.",
      "follow": "How does the small model decide when to escalate to the frontier model?",
      "followAnswer": "From signals I can calibrate on the eval set. For classification, the probability of the top label, or the margin between the top two, works well once calibrated. For generation, I use rule checks like schema validity or required fields present, or a lightweight verifier. I pick the threshold by plotting accuracy of retained cases against escalation rate, then choose the point that meets the accuracy target at the lowest escalation. In production I monitor escalation rate per slice, because a sudden rise usually means the input distribution has shifted.",
      "builds": [
        "llm-08",
        "ml-30"
      ],
      "next": [
        "ft-22",
        "cl-19",
        "ft-20"
      ],
      "deeper": [
        "distillation",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "judgement",
        "q": "Which workload is the best candidate to move from a frontier API to a fine-tuned small model?",
        "options": [
          "A research agent that browses and writes 10-page reports, 50 runs a day.",
          "Routing 3 million customer emails a month into 30 queues, with labelled history.",
          "A legal drafting assistant used by 20 partners.",
          "An internal Q&A bot over changing policies, a few hundred queries a week."
        ],
        "answer": 1,
        "why": "Email routing is narrow, labelled and very high volume - small-model territory. The research agent needs long reasoning and tools, legal drafting needs breadth and quality, and the low-volume Q&A bot's savings wouldn't cover the engineering effort."
      },
      "try": {
        "title": "Small versus larger model on a narrow task",
        "minutes": 25,
        "steps": [
          "With Ollama, pull one small model (around 1-3B) and one larger model (around 7-8B).",
          "Write 30 short customer messages and label each with one of five intents.",
          "Prompt both models with the same instructions and a few examples, asking for the label only, and record accuracy and time per request.",
          "Observe the accuracy gap and the speed gap, and note which messages the small model gets wrong - those are your escalation cases."
        ]
      }
    },
    {
      "id": "ft-22",
      "q": "Walk me through distilling a frontier model into a small model for a production task. What goes wrong?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "fine-tuning",
        "open-weights",
        "evaluation"
      ],
      "why": "ft-06 covers what distillation is. This checks the pipeline - sampling, filtering, auditing, evaluating against human labels - and the legal check that people forget.",
      "quick": [
        "Sample real, diverse inputs; the teacher labels them.",
        "Filter teacher outputs with rules, agreement checks and human audits.",
        "Fine-tune the student on what survives.",
        "Evaluate against human-labelled gold, never teacher labels.",
        "Check the teacher's terms before training on its outputs."
      ],
      "simple": "Distillation in practice is a data pipeline. First you sample real production inputs, stratified so rare but important cases are present, not just the common ones. The teacher model labels them with a carefully written prompt, often with a short rationale, and you can sample it more than once to check it agrees with itself.\n\nThen you filter. Rule checks catch schema errors and impossible values, disagreements between teacher samples flag uncertain cases, and a human audits a random slice so you know the teacher's own error rate. What survives becomes the training set for the student, usually LoRA SFT on a small open-weight model. If you host the teacher you can also match its token probabilities, but through an API you only have its text.\n\nEvaluation is where teams fool themselves. If you measure the student against teacher labels, you only learn how well it copies the teacher, mistakes included. You need a separate gold set labelled by people.\n\nThen there's the licence. Many frontier API terms restrict using outputs to build competing models, and some open-weight licences add conditions when outputs train another model. For example, Llama's licence asks for \"Llama\" at the start of a distributed derivative's name. Bedrock even offers managed distillation, but legal still signs off on the terms.",
      "points": [
        "Stratified sampling of real inputs, including rare high-impact cases.",
        "Teacher labelling with a strong prompt; self-consistency to flag uncertainty.",
        "Filter by rules and agreement; human audit to measure teacher error.",
        "Student SFT (often LoRA); logit matching only if you host the teacher.",
        "Evaluate on human gold labels; teacher-label scores only measure copying.",
        "Legal: provider terms and open-weight licence conditions on using outputs for training."
      ],
      "diagram": {
        "rows": [
          [
            {
              "id": "in",
              "label": "Real inputs",
              "note": "stratified, rare cases kept"
            }
          ],
          [
            {
              "id": "t",
              "label": "Teacher labels",
              "note": "strong prompt, sampled twice"
            }
          ],
          [
            {
              "id": "f",
              "label": "Filter and audit",
              "note": "rules, agreement, human sample",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "s",
              "label": "Student fine-tune",
              "note": "LoRA SFT"
            },
            {
              "id": "g",
              "label": "Human gold set",
              "note": "separate, never teacher-labelled",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "e",
              "label": "Eval and cascade",
              "note": "escalate low confidence"
            }
          ]
        ],
        "edges": [
          {
            "from": "in",
            "to": "t"
          },
          {
            "from": "in",
            "to": "g",
            "label": "held out, human-labelled"
          },
          {
            "from": "t",
            "to": "f"
          },
          {
            "from": "f",
            "to": "s"
          },
          {
            "from": "s",
            "to": "e"
          },
          {
            "from": "g",
            "to": "e"
          }
        ],
        "alt": "Distillation pipeline: real inputs are labelled by the teacher, filtered and audited, used to fine-tune the student, which is evaluated against a separate human-labelled gold set before running as a cascade.",
        "caption": "**The student copies the teacher's mistakes too.** Filter before training, and grade against human gold, not teacher labels."
      },
      "say": "It's mostly a data pipeline. I sample real inputs, stratified so rare but costly cases are in, not just the common ones. The teacher labels them with a strong prompt, and I sample twice so disagreement flags uncertain items. Then I filter with rule checks for schema and impossible values, and drop or human-review the disagreements. A person audits a random slice so I know the teacher's own error rate, since the student will inherit it. The student is usually a LoRA fine-tune of a small open model on what survives. The classic mistake is evaluating the student against teacher labels, which only measures copying. I keep a separate gold set labelled by people. Before any of that, legal reads the terms, because many frontier APIs restrict training competing models on their outputs, and some open licences, Llama's for example, add naming conditions for derivatives. In production the student runs as a cascade and escalates low-confidence cases to the teacher.",
      "numbers": "Rule of thumb: audit at least 100-200 teacher labels per important slice to estimate the teacher's error rate; the student rarely beats that ceiling on teacher-labelled data, so the audit sets realistic expectations.",
      "verified": "2026-10",
      "wrong": "\"The student matches the teacher 97% of the time, so it's 97% accurate.\" Agreement with the teacher isn't accuracy - if the teacher is wrong 8% of the time, the student is matching those errors too.",
      "follow": "The student is great on common cases and bad on rare ones. How do you fix the data?",
      "followAnswer": "The sample was probably dominated by common cases, so the student saw too few rare ones. I'd identify the weak slices from the eval, then deliberately collect more real inputs of those types, by searching logs or using a classifier to mine them, rather than generating synthetic ones that look different from production. The teacher labels them, with human review, since rare cases are where teachers also err. I'd upweight them in training and track per-slice accuracy, and for slices that stay weak I'd route them to the teacher in the cascade instead of forcing the student to learn everything.",
      "builds": [
        "ft-06",
        "ft-21"
      ],
      "next": [
        "ft-19",
        "ft-23",
        "ft-12"
      ],
      "deeper": [
        "distillation",
        "hf-trl"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A team distils a frontier model into an 8B model, holds back 10% of the teacher-labelled data as a test set, and reports 96% accuracy. What is wrong with the claim?",
        "options": [
          "Nothing - a held-out split is the standard method.",
          "The test labels come from the teacher, so 96% measures agreement with the teacher, errors included, not true accuracy.",
          "An 8B model can't reach 96% on any task.",
          "Distillation should be evaluated on training loss."
        ],
        "answer": 1,
        "why": "Held-out teacher labels only test how well the student copies the teacher. True accuracy needs a human-labelled gold set. A held-out split is right in principle, but its labels must be independent of the teacher."
      }
    },
    {
      "id": "ft-23",
      "q": "A client wants to use an open-weight model commercially. What do you check about its licence?",
      "round": [
        "manager",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "open-weights",
        "compliance",
        "trade-offs"
      ],
      "why": "\"Open\" covers everything from Apache 2.0 to research-only licences. Services firms carry the risk for clients, so the panel checks you read the licence, not the marketing.",
      "quick": [
        "Read the licence on the exact model card, not the family's reputation.",
        "Apache 2.0 or MIT: broad commercial use with few conditions.",
        "Llama licence: a user cap, attribution and naming rules.",
        "Research or non-commercial licences rule out client production.",
        "A fine-tune inherits the base licence; record it in the registry."
      ],
      "simple": "Open-weight means you can download the weights. It doesn't mean you can do anything with them. Licences fall into three groups.\n\nPermissive licences such as Apache 2.0 and MIT allow commercial use, modification and redistribution with light conditions like keeping notices. Most Qwen models, OpenAI's gpt-oss, several Mistral models, Sarvam's 30B and 105B models, and since April 2026 Google's Gemma 4 use Apache 2.0. Earlier Gemma versions had custom terms with a prohibited-use policy.\n\nCustom community licences, like Meta's Llama licences, allow commercial use but add conditions. Llama 4's licence requires a separate licence if your products had more than 700 million monthly active users on its release date. It also requires \"Built with Llama\" attribution and \"Llama\" at the start of the name of any distributed model trained on Llama or its outputs, plus an acceptable use policy.\n\nResearch or non-commercial licences rule out a client's production system.\n\nThree details catch teams out. The licence can differ within a family, so read the card of the exact checkpoint. A fine-tune carries its base model's licence and the licences of its training data. And open weights come with no indemnity, unlike the copyright commitments some cloud providers make for models they host. For example, record the licence, version and acceptable-use obligations in the model registry, and have legal sign off before go-live.",
      "points": [
        "Permissive (Apache 2.0, MIT): broad commercial use; keep notices.",
        "Community licences (Llama): commercial with conditions - 700M MAU threshold, attribution, derivative naming, acceptable use policy.",
        "Research or non-commercial licences: not for client production.",
        "Check the exact checkpoint's card; licences differ within families and change between versions (Gemma 4 moved to Apache 2.0).",
        "Fine-tunes inherit the base licence plus data licences; outputs may carry conditions.",
        "No indemnity with open weights; record licence in the model registry and get legal sign-off."
      ],
      "say": "I read the licence on the exact checkpoint's model card, because it can differ within a family and between versions. There are three groups. Permissive ones, Apache 2.0 or MIT, allow commercial use with light conditions, and that covers most Qwen models, gpt-oss, several Mistral models, Sarvam's new models and, since April 2026, Gemma 4. Earlier Gemma had custom terms. Then community licences like Llama's, which allow commercial use with conditions. There's a 700 million monthly user threshold, Built with Llama attribution, the Llama prefix on any distributed model trained on it or its outputs, and an acceptable use policy. Research or non-commercial licences rule out client production entirely. Two more checks. A fine-tune inherits the base licence plus whatever licences its training data carries. And open weights come with no indemnity, unlike some providers' commitments for hosted models. I record the licence and obligations in the model registry, and legal signs off before go-live.",
      "numbers": "The Llama 4 Community Licence's commercial threshold is 700 million monthly active users, measured on the model's release date - irrelevant to almost every Indian enterprise, unlike its attribution and naming conditions, which apply to everyone.",
      "verified": "2026-10",
      "wrong": "\"It's on Hugging Face, so it's open source and free to use.\" Many models there are non-commercial or carry conditions, and a client discovering that after launch is a contract problem for your firm.",
      "follow": "Your team fine-tuned a Llama model and the client wants to distribute it to their partners. What do you tell them?",
      "followAnswer": "That distribution brings in more of the licence than internal use does. They must pass on a copy of the licence, show Built with Llama attribution, and start the derivative's name with Llama. Use must stay within the acceptable use policy, which they should push through to their partners' terms. I'd check the training data licences too, since distributing a model can expose data obligations that internal use didn't. If any of that conflicts with the client's plans, an Apache 2.0 base model of similar quality is worth an eval run before they commit.",
      "builds": [
        "llm-16",
        "cl-05"
      ],
      "next": [
        "ft-24",
        "ft-22",
        "sd-02"
      ],
      "deeper": [
        "llama4-license",
        "sarvam"
      ],
      "check": {
        "kind": "concept",
        "q": "A team fine-tunes a model whose card says \"research and non-commercial use only\", then sells access to a client. What is their exposure?",
        "options": [
          "None - fine-tuning creates a new model with no inherited licence.",
          "They breach the licence; the fine-tune inherits the base model's non-commercial restriction.",
          "None if they only sell API access, not weights.",
          "Only an attribution requirement."
        ],
        "answer": 1,
        "why": "A fine-tune is a derivative of the base weights and carries its licence. Non-commercial terms cover commercial use generally, including serving it as a paid API. Inheritance is the point most teams miss."
      }
    },
    {
      "id": "ft-24",
      "q": "An Indian bank wants an LLM on its own servers - nothing leaves its data centre. What do you build, and what do you warn them about?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "open-weights",
        "serving",
        "india",
        "privacy"
      ],
      "why": "cl-05 is the self-host decision. This is the concrete on-prem design a BFSI client asks for, and the panel wants sizing, stack, operations and the honest warnings.",
      "quick": [
        "Pick the model by eval on the bank's tasks, licence-checked.",
        "Serve with vLLM behind an OpenAI-compatible gateway on GPU Kubernetes.",
        "Air-gapped artefact mirror: weights pulled, scanned and hashed once.",
        "Keep RAG, guardrails, tracing and evals on-prem too.",
        "Warn: GPU lead times, N+1 capacity, quality gap, upgrades are yours."
      ],
      "simple": "Start with the model, chosen by running the bank's own eval set on two or three licence-checked open-weight candidates in the size that its hardware budget allows. Today that's often a 20-35B dense model, or a mixture-of-experts model such as gpt-oss-120b, which fits on one 80GB GPU, quantised to FP8 or 4-bit. Sovereign options trained in India, such as Sarvam's Apache 2.0 models, are worth including for Indic-language work.\n\nThe serving stack is vLLM on Kubernetes GPU nodes, behind an internal OpenAI-compatible gateway that handles authentication, rate limits and logging. Everything else stays inside too. That means the vector store (OpenSearch or pgvector), the embedding and reranker models, guardrail models, tracing (for example self-hosted Langfuse) and the eval pipeline. Weights come in once through a controlled mirror, where they are scanned, hashed and recorded with their licence, because the cluster has no internet.\n\nThen the warnings. GPUs can have long procurement lead times. High availability needs at least one spare GPU node beyond peak. Capacity is set by concurrency and context length through the KV cache, not just model size. The open model may trail frontier APIs, so keep tasks narrow. And every upgrade, patch and incident is now the bank's job. For example, an approved in-India cloud region with in-country processing may meet the regulator's need at lower operational cost, and is worth putting on the table.",
      "points": [
        "Model chosen by the bank's eval set, licence-checked; quantised to fit the GPU budget.",
        "vLLM on GPU Kubernetes behind an internal OpenAI-compatible gateway.",
        "On-prem RAG, embeddings, reranker, guardrails, tracing and evals - nothing calls out.",
        "Controlled artefact mirror: scanned, hashed, versioned weights and images.",
        "Capacity from concurrency x context (KV cache); N+1 GPUs for availability.",
        "Warnings: procurement lead time, quality gap, ops ownership; offer an in-India cloud region as an alternative."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "On-premises LLM stack from GPU hardware and Kubernetes up through the vLLM serving layer, internal gateway, RAG and guardrails, to observability and evals.",
        "top": "bank applications",
        "bottom": "bank data centre",
        "caption": "**Nothing calls out, so everything has to be inside.** Search, guardrails, tracing and evals are part of the on-prem build, not optional extras.",
        "layers": [
          {
            "label": "Observability and evals",
            "note": "self-hosted tracing, eval pipeline"
          },
          {
            "label": "Gateway",
            "note": "auth, rate limits, audit log",
            "accent": "accent"
          },
          {
            "label": "RAG and guardrails",
            "note": "vector store, reranker, safety model"
          },
          {
            "label": "vLLM serving",
            "note": "quantised open-weight model",
            "accent": "accent"
          },
          {
            "label": "Kubernetes + GPU operator",
            "note": "N+1 nodes",
            "accent": "warn"
          },
          {
            "label": "Artefact mirror",
            "note": "scanned, hashed weights"
          }
        ]
      },
      "say": "I start with the model, choosing by the bank's own eval set across two or three licence-checked open-weight candidates that fit the hardware budget, quantised to FP8 or 4-bit. For Indic work I'd include an India-trained option like Sarvam's Apache-licensed models. Serving is vLLM on Kubernetes GPU nodes behind an internal OpenAI-compatible gateway, so apps don't care what's underneath, and the gateway does auth, rate limits and the audit log. Because nothing calls out, the vector store, embeddings, reranker, guardrail model, tracing and evals all run inside too. Weights come in once through a mirror where they're scanned and hashed. Then the warnings, said plainly. GPUs can take months to arrive. Availability needs at least one spare node. Capacity is driven by concurrency and context length through the KV cache. The open model may trail frontier APIs, so we keep tasks narrow. And every upgrade and incident is now theirs. I'd also cost an in-India cloud region with in-country processing, because it often satisfies the regulator for less.",
      "numbers": "Sizing rule: KV cache per token = 2 x layers x KV heads x head dimension x bytes per value. Multiply by concurrent users x context length; at dozens of users with long contexts this often needs more GPU memory than the weights themselves.",
      "verified": "2026-10",
      "wrong": "\"Download the model, run Ollama on a server, done.\" That's a demo, not a bank system - no concurrency, availability, audit, guardrails, evals or controlled supply chain, and it will fall over at the first busy morning.",
      "follow": "The bank's CISO asks how you know the downloaded weights are safe. What do you say?",
      "followAnswer": "I treat weights like any third-party binary. We pull them from the publisher's official repository, verify the hashes, and prefer the safetensors format, which can't carry executable code the way older pickle files could. Then we scan them in a quarantine environment and record source, version, hash and licence in the model registry. Only that recorded artefact goes into the internal mirror the cluster can reach. I'd add behavioural checks too: run the safety and regression suites before promotion, because a tampered or poisoned model shows up in behaviour, not in the file listing.",
      "builds": [
        "cl-05",
        "ft-20"
      ],
      "next": [
        "ft-25",
        "cl-21",
        "cd-19"
      ],
      "deeper": [
        "vllm",
        "sarvam"
      ],
      "check": {
        "kind": "numbers",
        "q": "Your on-prem model's weights take 40GB on an 80GB GPU. Under load with 30 concurrent users and long contexts, requests start queueing badly. What is the most likely limit?",
        "options": [
          "The weights are too large and must be re-quantised to 2-bit.",
          "KV cache memory for 30 users x long contexts is filling the remaining GPU memory, capping concurrent sequences.",
          "The CPU is too slow to tokenise.",
          "vLLM cannot serve more than 10 users per GPU."
        ],
        "answer": 1,
        "why": "After weights, the remaining memory holds the KV cache, which grows with concurrent users times context length. When it fills, the engine can't schedule more sequences and requests queue. Fix it with more GPUs, shorter contexts, KV-cache quantisation or a smaller model - not 2-bit weights by reflex."
      }
    },
    {
      "id": "ft-25",
      "q": "You have fine-tuned a LoRA adapter per client. How do you serve 50 adapters on one base model?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "fine-tuning",
        "open-weights"
      ],
      "why": "The operational payoff of LoRA. Tests whether you know multi-adapter serving exists, how engines batch across adapters, and the isolation and versioning issues of a per-tenant model.",
      "quick": [
        "Load the base once; adapters are small and swap in per request.",
        "vLLM: `--enable-lora`, `--max-loras`, `--max-lora-rank`, `--max-cpu-loras`.",
        "Requests choose the adapter by model name; mixed batches are supported.",
        "Unmerged adapters add a little latency; all must share one base.",
        "Runtime adapter loading is a security risk - lock it down."
      ],
      "simple": "A LoRA adapter is small. At rank 16 across all linear layers of an 8B model it's about 40 million parameters, roughly 80MB in 16-bit, against about 16GB for the base. So you don't run 50 copies of the model. You load the base once and keep adapters in memory.\n\nServing engines handle this directly. In vLLM you start the server with `--enable-lora`, register adapters with `--lora-modules name=path`, and set `--max-loras` (adapters active in one batch on the GPU), `--max-lora-rank` (the highest rank you'll load) and `--max-cpu-loras` (a CPU-side cache). Each request names its adapter as the model, and the engine batches requests for different adapters together with special kernels, an idea from research such as S-LoRA and Punica. Adapters can also be loaded at runtime through an API, but vLLM's docs warn that's only safe in a trusted, isolated environment.\n\nThe trade-offs: unmerged adapters add some latency compared with a merged model, every adapter must be trained on the same base version, and a busy tenant can slow others. For example, per-client isolation still needs care. The gateway must map each client's identity to its own adapter, so client A can never request client B's model name. Each adapter needs its own version, eval results and rollback.",
      "points": [
        "One base model in GPU memory; adapters are tens of MB each.",
        "vLLM flags: --enable-lora, --lora-modules, --max-loras, --max-lora-rank, --max-cpu-loras.",
        "Requests select adapters by name; mixed-adapter batching keeps GPU utilisation high.",
        "Costs: some latency vs merged weights, one shared base version, noisy neighbours.",
        "Gateway enforces tenant-to-adapter mapping; never trust a client-supplied model name.",
        "Per-adapter versioning, evals and rollback; runtime loading only in trusted environments."
      ],
      "say": "I load the base model once and serve adapters on top, because an adapter is tiny. Rank 16 on all linear layers of an 8B model is roughly 80 megabytes, against 16 gigs for the base. In vLLM I enable LoRA, register the adapters, and set max-loras for how many can be active in one batch, max-lora-rank for the largest rank, and max-cpu-loras for a CPU-side cache so less-used tenants swap in. Each request names its adapter as the model, and the engine batches different adapters together, so one GPU serves many clients. The trade-offs: unmerged adapters cost a little latency against a merged model, every adapter must share the same base version, and one busy client can slow the rest. Isolation is the part I'm strict about. The gateway maps each client's identity to its adapter, so nobody can request another client's model name. Runtime adapter loading stays off except in trusted environments, as vLLM's docs warn. And each adapter has its own version, eval results and rollback.",
      "numbers": "Adapter size arithmetic for an 8B model (hidden size 4096, 32 layers, LoRA on all seven linear projections at rank 16): about 1.3M parameters per layer, about 42M in total - roughly 84MB in 16-bit, about 0.5% of the base model.",
      "verified": "2026-10",
      "wrong": "\"Each client gets their own deployment of the fine-tuned model.\" With LoRA that multiplies GPU cost by the number of clients for no reason - the whole point of adapters is sharing one base.",
      "follow": "The base model gets a new version. What happens to your 50 adapters?",
      "followAnswer": "They don't carry over. An adapter is trained against specific base weights, so on a new base it's at best degraded and at worst meaningless. So I'd retrain each adapter on the new base from its stored dataset, which is why datasets are versioned per client, and run each client's eval suite comparing old and new. I'd serve old and new bases side by side during the migration, moving clients one at a time with their own canary, and only retire the old base once the last client has moved.",
      "builds": [
        "ft-02",
        "ft-07"
      ],
      "next": [
        "ft-24",
        "cl-04",
        "sd-07"
      ],
      "deeper": [
        "s-lora",
        "vllm"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A multi-tenant API lets each client pass the `model` field freely, and vLLM serves each client's LoRA adapter by that name. What is the flaw?",
        "options": [
          "vLLM can't serve more than one adapter.",
          "Any client can name another client's adapter and use a model trained on that client's data; the gateway must map identity to adapter.",
          "Adapters must always be merged before serving.",
          "The base model will be loaded once per client."
        ],
        "answer": 1,
        "why": "Adapter selection by name is a routing feature, not an access control. Trusting the client-supplied name lets one tenant reach another's adapter. The gateway must derive the adapter from the authenticated tenant. vLLM does serve many adapters, unmerged, on one base."
      }
    }
  ]
};
