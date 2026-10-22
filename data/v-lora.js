/* Visual explanation: how LoRA fine-tunes a big model by training two small matrices.
   Drawn by assets/visual.js - scene format in README.md. Sizes follow a 7-8B model
   with 4096-wide layers and rank 16; losses and file sizes are illustrative. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
window.IR.v["lora"] = {
  view: [1290, 600],

  zones: [
    { id: "z-layer", x: 455, y: 50, w: 520, h: 330, label: "One layer - LoRA added beside W", tone: "model" }
  ],

  parts: [
    { id: "when", kind: "box", x: 30, y: 30, w: 330, h: 84, label: "Fine-tune for behaviour", icon: "target", tone: "neutral", concept: "when",
      sub: "format, tone, style - not new facts (that is RAG)" },
    { id: "dataset", kind: "code", x: 30, y: 150, w: 330, title: "Training example (1 of 2,000)", tone: "input", concept: "dataset",
      lines: ["prompt: \"My order is late.\"", "answer: \"Hi Priya, sorry about", "  the delay. 1. Track it ...", "  Ticket #4821.\""] },
    { id: "tokens", kind: "tokens", x: 30, y: 336, gap: 4, label: "Tokens - only the answer is scored", tone: "input", concept: "masking",
      items: ["My", "order", "is", "late", "Hi", "Priya", "sorry", "…"] },

    { id: "x", kind: "vector", dir: "col", x: 480, y: 110, n: 10, seed: 4, cell: 14, label: "x", tone: "input", concept: "forward" },
    { id: "W", kind: "box", x: 560, y: 92, w: 240, h: 96, label: "Frozen weights W", sub: "4096 × 4096, not trained", icon: "lock", tone: "neutral", concept: "frozen" },
    { id: "rank", kind: "box", shape: "pill", x: 560, y: 204, w: 240, h: 30, label: "rank r = 16", tone: "model", concept: "rank" },
    { id: "A", kind: "box", x: 560, y: 252, w: 105, h: 62, label: "A", sub: "16 × 4096", tone: "model", concept: "lora" },
    { id: "B", kind: "box", x: 695, y: 252, w: 105, h: 62, label: "B", sub: "4096 × 16", tone: "model", concept: "lora" },
    { id: "plus", kind: "box", shape: "pill", x: 840, y: 166, w: 50, h: 40, label: "+", tone: "neutral", concept: "forward" },
    { id: "h", kind: "vector", dir: "col", x: 925, y: 110, n: 10, seed: 9, cell: 14, label: "h", tone: "model", concept: "forward" },

    { id: "loss", kind: "box", x: 1030, y: 110, w: 236, h: 80, label: "Loss", sub: "cross-entropy on answer tokens", icon: "target", tone: "guard", concept: "loss" },
    { id: "optim", kind: "box", x: 1030, y: 230, w: 236, h: 70, label: "Optimiser", sub: "updates A and B only", icon: "gear", tone: "model", concept: "optimiser" },

    { id: "qlora", kind: "box", x: 30, y: 440, w: 400, h: 84, label: "QLoRA", icon: "ruler", tone: "model", concept: "qlora",
      sub: "frozen W stored in 4-bit, so a big model fits on one GPU" },
    { id: "adapter", kind: "doc", x: 480, y: 432, w: 64, h: 80, label: "Adapter", sub: "≈ 30 MB", tone: "output", hidden: true, concept: "adapter" },
    { id: "serve", kind: "box", x: 600, y: 440, w: 310, h: 84, label: "Merge or swap", icon: "plug", tone: "output", hidden: true, concept: "serve",
      sub: "merge into W for no extra latency, or hot-swap one adapter per customer" },
    { id: "curves", kind: "bars", x: 960, y: 452, w: 306, lw: 80, fmt: "raw", max: 2.5, label: "Validation loss by epoch", tone: "guard", hidden: true, concept: "epochs",
      items: [{ label: "epoch 1", value: 2.2 }, { label: "epoch 2", value: 1.3 }, { label: "epoch 3", value: 1.1 }, { label: "epoch 4", value: 1.3 }] }
  ],

  links: [
    { id: "l-data-tok", from: "dataset:b:0.3", to: "tokens:t:0.25", style: "straight", tone: "input" },
    { id: "l-x-w", from: "x:r:0.3", to: "W:l", tone: "input" },
    { id: "l-x-a", from: "x:r:0.8", to: "A:l", tone: "input" },
    { id: "l-a-b", from: "A:r", to: "B:l", style: "straight", tone: "model" },
    { id: "l-w-plus", from: "W:r", to: "plus:l", tone: "neutral" },
    { id: "l-b-plus", from: "B:r", to: "plus:b", tone: "model" },
    { id: "l-plus-h", from: "plus:r", to: "h:l", style: "straight", tone: "model" },
    { id: "l-h-loss", from: "h:r", to: "loss:l", tone: "guard", label: "predictions", labelAt: 0.5 },
    { id: "l-loss-opt", from: "loss:b", to: "optim:t", style: "straight", tone: "guard" },
    { id: "l-grad", from: "optim:b:0.3", to: "B:b:0.55", via: [[1101, 404], [753, 404]], dashed: true, tone: "guard", label: "gradients", labelAt: 0.5 },
    { id: "l-ab-adapter", from: "B:b:0.2", to: "adapter:t", tone: "output" },
    { id: "l-adapter-serve", from: "adapter:r", to: "serve:l", style: "straight", tone: "output" }
  ],

  steps: [
    { title: "Change behaviour cheaply",
      text: "Fine-tuning changes how a model behaves by training it on examples. LoRA does it cheaply: the big model stays frozen and two small matrices learn the change. Follow a support bot learning the house answer format." },
    { title: "Fine-tune behaviour, not facts",
      text: "Fine-tune to change format, tone or style - a greeting, numbered steps, a ticket reference. For new or changing facts use RAG instead: fine-tuning is a poor way to add knowledge.",
      focus: ["when"] },
    { title: "Prepare good examples",
      text: "Collect about 2,000 examples of a prompt and the ideal answer, written the way you want the bot to answer. Consistency and quality matter far more than volume.",
      focus: ["dataset"] },
    { title: "Tokenize and mask the prompt",
      text: "Each example is tokenized and batched. Prompt tokens are masked, so the model is only scored on predicting the **answer** tokens - it learns how to reply, not how to write questions.",
      focus: ["dataset", "tokens"], flow: ["l-data-tok"], hl: { tokens: [4, 5, 6, 7] }, packets: [{ on: "l-data-tok" }] },
    { title: "Freeze the base model",
      text: "All of the base model's weights are frozen - billions of numbers that will not change. No gradients or optimiser state are kept for them, which is where most training memory normally goes.",
      focus: ["W"] },
    { title: "Add two small matrices",
      text: "Beside each chosen weight matrix, LoRA adds two thin matrices, A and B, with a small rank such as 16. Together they hold about 131,000 numbers instead of 16.8 million. B starts at zero, so nothing changes at first.",
      focus: ["A", "B", "rank"] },
    { title: "Forward pass: W·x plus B·A·x",
      text: "For each input vector x, the layer computes the frozen result W·x and adds the small LoRA path B·A·x, scaled by a factor. The sum flows on through the model as usual.",
      focus: ["x", "W", "A", "B", "plus", "h"], flow: ["l-x-w", "l-x-a", "l-a-b", "l-w-plus", "l-b-plus", "l-plus-h"],
      packets: [{ on: "l-x-w" }, { on: "l-x-a", "with": true }, { on: "l-a-b" }, { on: "l-w-plus" }, { on: "l-b-plus", "with": true }, { on: "l-plus-h" }] },
    { title: "Score the answer tokens",
      text: "The model predicts each answer token in turn. The loss compares those predictions with the ideal answer: low when the right token was likely, high when it was not.",
      focus: ["h", "loss"], flow: ["l-h-loss"], packets: [{ on: "l-h-loss", text: "predictions" }] },
    { title: "Update only A and B",
      text: "Backpropagation works out how each number should change, but the optimiser updates only A and B. W stays locked, so training needs a fraction of the memory of full fine-tuning.",
      focus: ["loss", "optim", "A", "B", "W"], flow: ["l-loss-opt", "l-grad", "l-a-b"],
      packets: [{ on: "l-loss-opt" }, { on: "l-grad", text: "gradients" }, { on: "l-a-b", rev: true }] },
    { title: "Repeat, and watch validation",
      text: "Training repeats over the data for a few epochs. Validation loss on held-out examples falls, then rises again at epoch 4: the model is starting to memorise. Keep the epoch 3 version.",
      focus: ["curves"], hl: { curves: [2] }, set: { curves: { hidden: false } } },
    { title: "Save a tiny adapter",
      text: "Only A and B are saved: an adapter of tens of megabytes, not a 16 GB model. Merge it into W for serving with no extra latency, or keep it separate and swap adapters per customer.",
      focus: ["A", "B", "adapter", "serve"], flow: ["l-ab-adapter", "l-adapter-serve"],
      packets: [{ on: "l-ab-adapter", text: "A, B" }, { on: "l-adapter-serve" }], set: { adapter: { hidden: false }, serve: { hidden: false } } },
    { title: "QLoRA: fit it on one GPU",
      text: "QLoRA stores the frozen weights in 4-bit while A and B train in higher precision. That cuts memory enough to fine-tune large models on a single GPU, with little loss in quality.",
      focus: ["qlora", "W"] }
  ],

  concepts: {
    when: {
      title: "When to fine-tune",
      tip: "Fine-tune to change behaviour - format, tone, style, a narrow skill. Use RAG for facts that are private, new or changing.",
      detail: [
        "The support bot already knows how to be helpful. What it lacks is the company's house style: greet by name, give numbered steps, end with a ticket reference. That is behaviour, and fine-tuning is good at behaviour.",
        "Fine-tuning is a poor way to add facts. The model may blend them up, it cannot cite them, and every change means retraining. Facts that change - prices, policies, stock - belong in RAG.",
        "Try prompting first: clear instructions and a few examples often get most of the way for free. Fine-tune when prompts get too long, too costly or too unreliable, or when a small fine-tuned model can replace a big general one."
      ],
      oneLiner: "Fine-tune for behaviour - format, tone, narrow skills - use RAG for facts, and try prompting first because it is cheaper and faster to change."
    },
    dataset: {
      title: "The training data",
      tip: "Pairs of a prompt and the ideal answer, written exactly the way you want the model to respond. Quality beats quantity.",
      detail: [
        "Each example pairs a realistic customer message with the ideal reply in the house format. A few hundred to a few thousand good examples are usually enough for a format or style change.",
        "Quality and consistency matter most. If half the examples greet by name and half do not, the model learns to be inconsistent. Remove duplicates, fix errors, and cover the variety of real requests, including awkward ones.",
        "Hold back a slice - say 10% - as a validation set the model never trains on. It is how you will know whether the model is learning the pattern or just memorising the examples."
      ],
      oneLiner: "Fine-tuning data is prompt-and-ideal-answer pairs; a few thousand clean, consistent examples beat a large messy set, with a held-out slice for validation."
    },
    masking: {
      title: "Tokenizing and masking the prompt",
      tip: "Examples become tokens. Prompt tokens are masked so the loss only counts the answer, teaching the model how to reply.",
      detail: [
        "Each example is turned into tokens using the model's chat template, so prompt and answer are laid out exactly as they will be at inference time. Examples are grouped into batches for efficient training.",
        "The prompt tokens are masked: the model reads them, but it is not scored on predicting them. Only the answer tokens count towards the loss. Otherwise the model would spend effort learning to imitate customer messages.",
        "Getting the template or the mask wrong is a common, silent bug. The run looks fine, but the model learns to produce odd role markers or repeats the question back."
      ],
      oneLiner: "Use the model's chat template and mask prompt tokens so the loss only scores the answer; template or mask mistakes are common silent bugs."
    },
    frozen: {
      title: "The frozen base model",
      tip: "The original weights stay unchanged. Nothing is stored for them during training except the weights themselves.",
      detail: [
        "In full fine-tuning every weight is trained. That needs the weights, their gradients and the optimiser's running averages - roughly 16 bytes per parameter with a common setup - well over 100 GB for a 7B model.",
        "LoRA freezes the base model. Its weights are only read, never updated, so no gradients or optimiser state are kept for them. The memory needed drops to little more than the model itself plus some activations.",
        "Freezing also protects what the model already knows. Because the original weights are untouched, you can always get the base model back, and many different adapters can share one copy of it."
      ],
      oneLiner: "LoRA freezes the base weights, so no gradients or optimiser state are stored for them, cutting training memory and keeping the original model intact."
    },
    lora: {
      title: "The LoRA matrices A and B",
      tip: "Two thin matrices beside a frozen weight matrix. Their product B·A is a small, learned correction to W.",
      detail: [
        "For a 4096 × 4096 weight matrix W, LoRA adds A (16 × 4096) and B (4096 × 16). Their product B·A has the same shape as W, but it is built from only 2 × 16 × 4096 = 131,072 numbers instead of 16.8 million - about 0.8%.",
        "The idea is that the change needed to adapt a model is simple - it lives in a few directions - so a low-rank update can capture it. B starts at zero, so at the start B·A is zero and the model behaves exactly like the base.",
        "LoRA is usually added to the attention projections and often the MLP layers in every block. Across the model the trainable part is typically well under 1% of the parameters."
      ],
      oneLiner: "LoRA learns a low-rank update B·A beside each frozen matrix - under 1% of the parameters - starting from zero so training begins at the base model."
    },
    rank: {
      title: "Rank and scaling",
      tip: "The rank r sets how thin A and B are. Small ranks (8-64) are usually enough; a scaling factor controls how strongly the update applies.",
      detail: [
        "The rank r is the inner size of A and B. Rank 16 means 16 learned directions of change per matrix. Higher ranks can capture more complex changes but cost more memory and are more prone to overfitting.",
        "For format and style changes, ranks of 8 to 64 are typical, and going higher rarely helps much. The update is multiplied by a scale, usually alpha divided by r, which controls how strongly it affects the output.",
        "Rank, alpha, the learning rate and which layers get adapters are the main settings. LoRA usually uses a higher learning rate than full fine-tuning, because there are far fewer numbers to move."
      ],
      oneLiner: "Rank r sets the adapter's capacity (8-64 is typical) and alpha/r scales its effect; with the learning rate and target layers, these are the key LoRA settings."
    },
    forward: {
      title: "The forward pass with LoRA",
      tip: "Each adapted layer computes W·x as before and adds the small path B·A·x, scaled. The sum continues through the model.",
      detail: [
        "When a vector x reaches an adapted layer, two things happen side by side. The frozen path computes W·x, exactly as in the base model. The LoRA path squeezes x down through A into 16 numbers, then expands it through B back to full size.",
        "The two results are added, with the LoRA part scaled, and the sum h carries on to the next layer. Only the LoRA path can change during training.",
        "This side-by-side shape is why an adapter can be merged later: W + scale × B·A is just another matrix of the same size, so the extra path disappears at inference time."
      ],
      oneLiner: "An adapted layer outputs W·x plus a scaled B·A·x; because that is one matrix of the same shape, the adapter can be merged into W afterwards."
    },
    loss: {
      title: "The loss",
      tip: "Measures how far the model's predictions are from the ideal answer, token by token. Training tries to make it smaller.",
      detail: [
        "For each answer token, the model gives probabilities for the next token. The loss, cross-entropy, is low when the correct token got a high probability and high when it got a low one. It is averaged over the answer tokens.",
        "This is the same next-token objective the model was pre-trained with; fine-tuning just applies it to your examples. The model is nudged towards producing replies like yours.",
        "Training loss always falls if you train long enough. That alone proves little; validation loss on examples the model has not seen is what tells you whether it is genuinely learning the pattern."
      ],
      oneLiner: "Fine-tuning minimises next-token cross-entropy on the answer tokens; falling training loss proves little without validation loss on unseen examples."
    },
    optimiser: {
      title: "Gradients and the optimiser",
      tip: "Backpropagation computes how each number should change; the optimiser applies those changes - but only to A and B.",
      detail: [
        "Backpropagation works backwards from the loss to find, for every trainable number, which direction reduces the loss. Those directions are the gradients.",
        "The optimiser, usually AdamW, uses the gradients to update the numbers a little each step. With LoRA it only tracks and updates A and B, so its memory is tiny compared with full fine-tuning.",
        "This is the main practical win: fine-tuning a 7B model with LoRA fits on a single large GPU, where full fine-tuning would need several GPUs and much more memory."
      ],
      oneLiner: "Gradients flow back from the loss, but the optimiser updates only A and B, which is why LoRA training fits on far less hardware than full fine-tuning."
    },
    epochs: {
      title: "Epochs and overfitting",
      tip: "An epoch is one pass over the data. Watch validation loss: when it stops falling and starts rising, the model is memorising.",
      detail: [
        "Training passes over the dataset several times; each pass is an epoch. With a few thousand examples, one to three epochs is common.",
        "Validation loss usually falls at first and then turns back up, as here at epoch 4, while training loss keeps falling. That turn is overfitting: the model is memorising the training examples instead of learning the general pattern.",
        "Keep the best checkpoint, not the last one. Then test the model on real tasks - format followed, tone right, nothing broken elsewhere - because loss alone does not tell you the bot got better."
      ],
      oneLiner: "Train for a few epochs, stop when validation loss turns up, keep the best checkpoint, and confirm with task-level evaluation, not loss alone."
    },
    adapter: {
      title: "The adapter file",
      tip: "Only A and B are saved - tens of megabytes instead of a full model copy of many gigabytes.",
      detail: [
        "After training, you save only the LoRA matrices: the adapter. For a 7-8B model at rank 16 that is typically tens of megabytes, while the base model is about 16 GB.",
        "Small adapters are easy to version, store and ship. You can keep one per customer, language or task, all sharing a single base model.",
        "An adapter only works with the exact base model it was trained on. Upgrade the base model and the adapter must be retrained."
      ],
      oneLiner: "A LoRA adapter is just A and B - tens of megabytes - easy to version and ship, but tied to the exact base model it was trained on."
    },
    serve: {
      title: "Merge or hot-swap",
      tip: "Merge the adapter into W for zero extra latency, or keep adapters separate and switch between them per request.",
      detail: [
        "To serve one fine-tuned model, merge the adapter into the base weights: W becomes W + scale × B·A. The result is a normal model with no extra computation at inference time.",
        "To serve many variants, keep the adapters separate. Servers such as vLLM can load one base model and many adapters, choosing the right one per request - for example one per customer - at a small speed cost.",
        "Choose by the business need: one product voice suits merging; many tenants or tasks suit multi-adapter serving on shared hardware."
      ],
      oneLiner: "Merge the adapter into W for one model with no added latency, or serve many adapters on one base model and pick one per request."
    },
    qlora: {
      title: "QLoRA",
      tip: "Stores the frozen base weights in 4-bit while LoRA trains in higher precision, so large models can be fine-tuned on a single GPU.",
      detail: [
        "QLoRA combines LoRA with quantisation. The frozen base weights are stored in a 4-bit format (NF4) and turned back into higher precision on the fly when needed, while A and B are trained in normal precision.",
        "Four-bit weights take about a quarter of the memory of 16-bit ones. That lets a much larger model be fine-tuned on one GPU, and a 7-8B model fine-tuned on modest hardware.",
        "The quality cost is usually small, but it is not zero, and 4-bit training is slower per step. It is a strong default when GPU memory is the constraint."
      ],
      oneLiner: "QLoRA keeps frozen base weights in 4-bit and trains LoRA adapters on top, letting large models be fine-tuned on a single GPU with little quality loss."
    }
  }
};
