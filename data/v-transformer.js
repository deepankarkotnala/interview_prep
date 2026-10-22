/* Visual explanation: how a transformer writes the next word.
   Drawn by assets/visual.js - scene format in README.md. Numbers are
   illustrative (GPT-2 small sizes, made-up attention weights). */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
window.IR.v["transformer"] = {
  view: [1290, 660],
  rows: { y: 190, gap: 56 },

  parts: [
    /* the block panel sits behind everything inside it */
    { id: "blocks", kind: "stack", x: 340, y: 120, w: 668, h: 450, count: 3, badge: "× 12", tone: "model", keep: true, concept: "stack" },
    { id: "blockTitle", kind: "note", x: 356, y: 130, w: 300, label: "Transformer block 1 of 12", keep: true },

    { id: "prompt", kind: "box", x: 20, y: 24, w: 292, h: 44, label: "“The capital of India is”", tone: "input", concept: "prompt" },
    { id: "tokenizer", kind: "box", shape: "pill", x: 20, y: 84, w: 176, h: 30, label: "Tokenizer", tone: "input", concept: "tokenizer" },
    { id: "words", kind: "col", cell: "text", x: 20, w: 88, label: "Tokens", tone: "input", concept: "tokens",
      items: ["The", "capital", "of", "India", "is"] },
    { id: "ids", kind: "col", cell: "chip", x: 140, w: 56, label: "IDs", tone: "input", concept: "tokenIds",
      items: ["464", "3139", "286", "3794", "318"] },
    { id: "emb", kind: "col", cell: "vec", x: 232, n: 8, cellSize: 9, seed: 3, rows: 5, label: "Embeddings", tone: "input", concept: "embedding" },
    { id: "pos", kind: "box", shape: "pill", x: 219, y: 520, w: 110, h: 30, label: "+ position", tone: "input", concept: "position" },

    { id: "qkv", kind: "col", cell: "qkv", x: 366, rows: 5, label: "Q · K · V", tone: "model", concept: "qkv" },
    { id: "matrix", kind: "matrix", x: 468, y: 208, cell: 28, mask: "causal", label: "Attention scores", tone: "model", concept: "attention",
      rows: ["The", "capital", "of", "India", "is"],
      values: [[1], [0.35, 0.65], [0.15, 0.55, 0.3], [0.1, 0.35, 0.15, 0.4], [0.05, 0.45, 0.05, 0.4, 0.05]] },
    { id: "softmax", kind: "box", shape: "pill", x: 693, y: 290, w: 86, h: 30, label: "softmax", tone: "model", concept: "softmax" },
    { id: "heads", kind: "stack", x: 490, y: 432, w: 160, h: 30, count: 3, label: "12 heads", tone: "model", concept: "multihead" },
    { id: "out", kind: "col", cell: "vec", x: 800, n: 8, cellSize: 9, seed: 11, rows: 5, label: "Mixed", tone: "model", concept: "softmax" },
    { id: "addnorm", kind: "box", shape: "pill", x: 786, y: 126, w: 110, h: 26, label: "Add & norm", tone: "neutral", concept: "residual" },
    { id: "mlp", kind: "col", cell: "vec", x: 912, n: 10, cellSize: 7, seed: 23, rows: 5, label: "MLP", tone: "data", concept: "mlp" },

    { id: "lmhead", kind: "box", x: 1036, y: 112, w: 220, h: 58, label: "LM head", sub: "a score for every token", tone: "output", concept: "lmhead" },
    { id: "probs", kind: "bars", x: 1036, y: 230, w: 236, lw: 74, label: "Next-token probabilities", tone: "output", concept: "probs",
      items: [
        { label: "New", value: 0, text: "?" }, { label: "the", value: 0, text: "?" }, { label: "Delhi", value: 0, text: "?" },
        { label: "a", value: 0, text: "?" }, { label: "located", value: 0, text: "?" }, { label: "Mumbai", value: 0, text: "?" }
      ] },
    { id: "sampler", kind: "box", x: 1036, y: 424, w: 220, h: 58, label: "Sampler", sub: "temperature 0.8 · top-k 3", tone: "output", concept: "sampling" },
    { id: "picked", kind: "tokens", x: 1118, y: 548, items: ["New"], label: "Chosen", tone: "output", hidden: true, concept: "loop" }
  ],

  links: [
    { id: "l-prompt-tok", from: "prompt:b:0.31", to: "tokenizer:t", style: "straight" },
    { id: "l-tok-words", from: "tokenizer:b", to: "words:t:0.6" },
    { id: "r-words-ids", kind: "ribbon", from: "words", to: "ids", tone: "input" },
    { id: "r-ids-emb", kind: "ribbon", from: "ids", to: "emb", rows: [0, 1, 2, 3, 4], tone: "input" },
    { id: "l-pos-emb", from: "pos:t", to: "emb:b", style: "straight" },
    { id: "r-emb-qkv", kind: "ribbon", from: "emb", to: "qkv", tone: "input" },
    { id: "r-qkv-mx", kind: "ribbon", from: "qkv", to: "matrix", tone: "model" },
    { id: "l-mx-soft", from: "matrix:r", to: "softmax:l", style: "straight" },
    { id: "r-soft-out", kind: "ribbon", from: "softmax", to: "out", tone: "model" },
    { id: "l-resid", from: "emb:t", to: "addnorm:t", via: [[273, 100], [841, 100]], dashed: true, label: "residual", labelAt: 0.5 },
    { id: "r-out-mlp", kind: "ribbon", from: "out", to: "mlp", tone: "data" },
    { id: "l-mlp-head", from: "mlp:r@4", to: "lmhead:l", tone: "output" },
    { id: "l-head-probs", from: "lmhead:b", to: "probs:t", style: "straight", tone: "output" },
    { id: "l-probs-samp", from: "probs:b", to: "sampler:t", style: "straight", tone: "output" },
    { id: "l-samp-pick", from: "sampler:b", to: "picked:t", style: "straight", tone: "output" },
    { id: "l-loop", from: "picked:b", to: "words:b", via: [[1146, 626], [64, 626]], tone: "output", label: "append, run again", labelAt: 0.5 }
  ],

  steps: [
    { title: "The whole job: one next token",
      text: "A transformer does one thing, over and over: read the text so far and predict the next token. Follow **The capital of India is** through the model and watch it choose **New**." },
    { title: "Cut the text into tokens",
      text: "The tokenizer cuts the prompt into tokens: whole words or pieces of words, each carrying its leading space. Five tokens come out, and each one gets its own row from here on.",
      focus: ["prompt", "tokenizer", "words"], flow: ["l-prompt-tok", "l-tok-words"],
      packets: [{ on: "l-prompt-tok", text: "text" }, { on: "l-tok-words", text: "5 tokens" }] },
    { title: "Look up token IDs",
      text: "Each token is replaced by its number in the vocabulary. The model never sees letters, only IDs such as 464 for **The** and 3794 for **India**.",
      focus: ["words", "ids"], flow: ["r-words-ids"], hl: { words: [3], ids: [3] },
      packets: [{ on: "r-words-ids", row: 3, text: "3794" }] },
    { title: "Turn IDs into vectors",
      text: "Each ID picks one row from the embedding table: a list of learned numbers, 768 of them in GPT-2 small. Position information is added so that word order is not lost.",
      focus: ["ids", "emb", "pos"], flow: ["r-ids-emb", "l-pos-emb"],
      packets: [{ on: "r-ids-emb", row: 3, text: "row 3794" }, { on: "l-pos-emb", text: "+pos", "with": true }] },
    { title: "Make a query, key and value",
      text: "Inside the first block, every token's vector is projected into three new vectors: a query (what am I looking for?), a key (what do I offer?) and a value (what do I pass on?).",
      focus: ["emb", "qkv"], flow: ["r-emb-qkv"],
      packets: [{ on: "r-emb-qkv", row: 4, text: "is" }] },
    { title: "Score every earlier token",
      text: "The last token **is** compares its query with the key of every token up to itself. Big dots are strong matches: **capital** and **India** matter most. Grey dots are future positions, masked out.",
      focus: ["qkv", "matrix"], flow: ["r-qkv-mx"], hl: { matrix: [4], qkv: [4] },
      packets: [{ on: "r-qkv-mx", row: 4, text: "Q" }] },
    { title: "Softmax, then mix the values",
      text: "Softmax turns each row of scores into weights that add up to one. Each token's new vector is the weighted mix of the value vectors, so **is** now carries the meaning of **capital** and **India**.",
      focus: ["matrix", "softmax", "out"], flow: ["l-mx-soft", "r-soft-out"], hl: { matrix: [4], out: [4] },
      packets: [{ on: "l-mx-soft", text: "weights" }, { on: "r-soft-out", row: 4, text: "mix" }] },
    { title: "Many heads at once",
      text: "That was one attention head. A block runs 12 of them side by side, each with its own weights, looking for different relationships. Their outputs are joined back into one vector per token.",
      focus: ["matrix", "heads"] },
    { title: "Add the input back, then normalise",
      text: "A residual connection adds the block's input back onto the attention output, and layer norm keeps the numbers steady. This shortcut is what lets dozens of blocks be stacked and still train.",
      focus: ["emb", "addnorm", "out"], flow: ["l-resid"],
      packets: [{ on: "l-resid", text: "+ input" }] },
    { title: "The MLP works on each token",
      text: "Each token's vector now passes, on its own, through a small two-layer network: widened about four times, bent by a non-linearity, then shrunk back. Much of the model's stored knowledge lives in these weights.",
      focus: ["out", "mlp"], flow: ["r-out-mlp"],
      packets: [{ on: "r-out-mlp", row: 4 }] },
    { title: "Repeat in every block",
      text: "That was one block. GPT-2 small stacks 12 of them and large models 80 or more, each with its own weights. Every block refines the vectors a little more.",
      focus: ["blocks", "mlp"] },
    { title: "Score every word in the vocabulary",
      text: "Only the last token's final vector is used to predict. The LM head turns it into a score for each of about 50,000 tokens, and softmax turns the scores into probabilities.",
      focus: ["mlp", "lmhead", "probs"], flow: ["l-mlp-head", "l-head-probs"], hl: { probs: [0], mlp: [4] },
      packets: [{ on: "l-mlp-head", text: "is" }, { on: "l-head-probs", text: "logits" }],
      set: { probs: { items: [
        { label: "New", value: 0.58 }, { label: "the", value: 0.08 }, { label: "Delhi", value: 0.06 },
        { label: "a", value: 0.05 }, { label: "located", value: 0.03 }, { label: "Mumbai", value: 0.02 }
      ] } } },
    { title: "Temperature and top-k shape the odds",
      text: "Temperature 0.8 sharpens the odds, so likely tokens get likelier. Top-k 3 then drops everything outside the three best. The sampler will draw only from what is left.",
      focus: ["probs", "sampler"], flow: ["l-probs-samp"], hl: { probs: [0, 1, 2] },
      packets: [{ on: "l-probs-samp", text: "top 3" }],
      set: { probs: { items: [
        { label: "New", value: 0.88 }, { label: "the", value: 0.07 }, { label: "Delhi", value: 0.05 },
        { label: "a", value: 0, text: "cut" }, { label: "located", value: 0, text: "cut" }, { label: "Mumbai", value: 0, text: "cut" }
      ] } } },
    { title: "Pick, append, repeat",
      text: "The sampler draws **New**. It is appended to the input and the whole pass runs again to produce **Delhi**. This loop is why answers stream out one token at a time.",
      focus: ["sampler", "picked", "words", "ids"], flow: ["l-samp-pick", "l-loop"], hl: { words: [5], ids: [5], probs: [0] },
      packets: [{ on: "l-samp-pick", text: "New" }, { on: "l-loop", text: "New" }],
      set: {
        picked: { hidden: false },
        words: { items: ["The", "capital", "of", "India", "is", "New"] },
        ids: { items: ["464", "3139", "286", "3794", "318", "968"] }
      } }
  ],

  concepts: {
    prompt: {
      title: "The prompt",
      tip: "The text the model is asked to continue. Everything it predicts is based on these words and on what it learned in training.",
      detail: [
        "The prompt is the text you give the model. Here it is \"The capital of India is\". The model's only job is to continue it, one token at a time. In a chat app the prompt is longer than what you typed: it also holds the system instructions, the earlier messages and any documents that were added, all joined into one long piece of text.",
        "The model does not look anything up while it reads. It does not search the internet or a database. Everything it knows was squeezed into its weights during training, and the prompt is the only fresh information it gets. That is why putting the right facts into the prompt, as RAG does, works so well.",
        "The prompt has a size limit called the context window, counted in tokens rather than words. Anything past the limit has to be cut or summarised. Longer prompts also cost more and make the first word slower to appear, because the model must read all of it first."
      ],
      oneLiner: "The prompt is everything the model can see - instructions, history and the user's text - measured in tokens and capped by the context window."
    },
    tokenizer: {
      title: "Tokenizer",
      tip: "Cuts text into tokens - whole words, pieces of words or punctuation - using a fixed list made before training.",
      detail: [
        "A model cannot read letters. The tokenizer cuts the text into small pieces called tokens and gives each one a number. Common words like \"the\" are one token. Rare words are split into pieces: \"unbelievable\" might become \"un\", \"believ\" and \"able\". A space is usually glued to the front of the next word, so \" capital\", space included, is one token.",
        "The list of pieces is fixed before training, using a method such as Byte Pair Encoding (BPE). BPE starts from single characters and keeps merging the pairs that appear together most often, until the list reaches a set size - usually somewhere between 32,000 and 200,000 entries.",
        "This matters in practice. Pricing and the context window are counted in tokens. English averages about three-quarters of a word per token, but Hindi or Tamil text often needs two to four times as many tokens for the same meaning, so it costs more and fits less. Token splits also explain why models are bad at counting the letters in a word."
      ],
      oneLiner: "The tokenizer splits text into sub-word tokens from a fixed vocabulary, which is why cost, limits and some odd mistakes all come down to tokens."
    },
    tokens: {
      title: "Tokens",
      tip: "The pieces the text was cut into. Each row in the diagram follows one token through the model.",
      detail: [
        "After tokenizing, \"The capital of India is\" becomes five tokens. From here on the model works with one row per token, and every row keeps its own vector all the way up the stack. That is what the horizontal rows in this diagram show.",
        "All rows are processed at the same time. Older recurrent networks read one word after another, but a transformer handles every token of the prompt in parallel. That parallel reading is the main reason transformers train so fast on GPUs.",
        "The rows only exchange information in one place: attention. Everywhere else, including the MLP, each token's vector is processed on its own. Keep that picture in mind and most transformer interview questions become easier."
      ],
      oneLiner: "Each token gets its own row and vector; rows are processed in parallel and only exchange information inside attention."
    },
    tokenIds: {
      title: "Token IDs",
      tip: "Each token's position in the vocabulary list. The model never sees text, only these numbers.",
      detail: [
        "Every entry in the tokenizer's vocabulary has a number. In GPT-2's vocabulary of 50,257 tokens, \"The\" is 464 and \" India\" is 3794. The model receives only this list of numbers: 464, 3139, 286, 3794, 318.",
        "An ID is just a label, like a roll number. 3794 is not \"bigger\" than 286 in any useful sense, so the IDs cannot go into the maths directly. The next step swaps each ID for a learned vector that does carry meaning.",
        "IDs are also what the model produces at the end. It predicts the ID of the next token, and the tokenizer turns that ID back into text before you see it."
      ],
      oneLiner: "Token IDs are positions in the vocabulary - labels with no meaning of their own - so each one is swapped for a learned embedding vector."
    },
    embedding: {
      title: "Embedding",
      tip: "A learned list of numbers for each token, looked up from a big table. Tokens used in similar ways get similar lists.",
      detail: [
        "The model keeps a big table with one row per token in the vocabulary. Each row is a vector: a list of numbers, 768 of them in GPT-2 small and several thousand in large models. Turning an ID into a vector is a simple lookup - take row 3794 for \" India\".",
        "The numbers start random and are learned during training. Tokens that are used in similar ways drift towards similar vectors, so \" India\" ends up near \" Pakistan\" and \" Delhi\" and far from \" banana\". In the diagram each small square is one number: darker means larger, red means negative.",
        "These vectors are the model's working memory. Every later step reads them, changes them and passes them on. By the top of the stack, a token's vector no longer means just that word. It carries what the word means in this particular sentence."
      ],
      oneLiner: "Each token ID looks up a learned vector in an embedding table, and that vector is what every layer then reads and refines."
    },
    position: {
      title: "Positional information",
      tip: "Attention ignores word order on its own, so the model adds information about where each token sits.",
      detail: [
        "Attention compares tokens with each other, but it has no built-in sense of order. Without help, \"dog bites man\" and \"man bites dog\" would look the same to it. So the model adds information about each token's position.",
        "The original transformer added a fixed wave pattern (sinusoidal encoding) to each vector. GPT-2 learned one position vector per slot. Most modern models use RoPE, rotary position embedding, which rotates the query and key vectors by an angle that depends on position, so attention scores naturally depend on how far apart two tokens are.",
        "Position handling decides how long a context the model can manage. Learned positions stop at the longest length seen in training. RoPE can be stretched to longer contexts with scaling tricks, which is one reason context windows grew so quickly."
      ],
      oneLiner: "Attention is order-blind, so position is injected - today mostly with RoPE, which rotates queries and keys so scores reflect relative distance."
    },
    qkv: {
      title: "Query, key and value",
      tip: "Each token makes three vectors: a query (what am I looking for?), a key (what do I offer?) and a value (what do I pass on?).",
      detail: [
        "Before attention, every token's vector is multiplied by three learned weight matrices to make three new vectors. The query says what this token is looking for. The key says what this token can offer others. The value is the information it hands over when someone pays attention to it.",
        "A library is a good picture. Your query is the question you walk in with. Each book's key is the label on its spine. The value is what is written inside. You compare your question with the labels, then read the books that match best.",
        "The three matrices are learned in training, and each attention head has its own set. That is why different heads end up looking for different things: one may link pronouns to nouns, another may track which noun a verb belongs to."
      ],
      oneLiner: "Each token projects its vector into a query, a key and a value; queries are matched against keys, and the matching values are what flows."
    },
    attention: {
      title: "Attention scores and the causal mask",
      tip: "Each token compares its query with the keys of earlier tokens. A bigger dot means a stronger match; grey dots are future tokens it may not see.",
      detail: [
        "For each pair of tokens, the model multiplies one token's query with the other's key (a dot product). A big result means a good match. Dividing by the square root of the vector size keeps the numbers from growing too large. Each row of the grid is one token looking back at the others.",
        "Look at the last row, for \"is\". To predict what comes next, it attends most to \"capital\" and \"India\" - the words that decide the answer. That is the whole idea: each token pulls in context from the words that matter most to it.",
        "The grey dots above the diagonal are masked. While generating, a token may look only at itself and earlier tokens, never later ones, because those do not exist yet. This is causal masking, and it is what makes GPT-style models decoders.",
        "Every token is compared with every other token, so this work grows with the square of the length. Doubling the prompt roughly quadruples it, which is why long contexts are expensive and why tricks such as FlashAttention matter."
      ],
      oneLiner: "Scores are scaled dot products of queries and keys, masked so each token only sees the past; their cost grows with the square of the length."
    },
    softmax: {
      title: "Softmax and the weighted mix",
      tip: "Softmax turns each row of scores into weights that add up to 1. Each token's new vector is a weighted mix of the value vectors.",
      detail: [
        "Raw scores can be any size, so each row goes through softmax. Softmax makes every score positive and scales the row so it adds up to 1. Now they are weights, like percentages: for \"is\", perhaps 45% on \"capital\", 40% on \"India\" and the rest spread thinly.",
        "Each token then builds a new vector by mixing the value vectors of the tokens it attends to, using those weights. \"is\" gets a vector made mostly of the values of \"capital\" and \"India\". The token has just absorbed context from the sentence.",
        "This mixed vector - the \"Mixed\" column in the diagram - is the output of attention, and it carries on through the block. Softmax appears again at the very end of the model, where it turns word scores into probabilities."
      ],
      oneLiner: "Softmax turns attention scores into weights that sum to one, and attention's output is the weighted sum of the value vectors."
    },
    multihead: {
      title: "Multi-head attention",
      tip: "Attention runs many times in parallel, each head with its own Q, K and V weights, so different heads can track different relationships.",
      detail: [
        "One attention pattern cannot capture everything at once. So the model runs attention several times side by side: 12 heads per block in GPT-2 small, 32 to 128 in large models. Each head has its own query, key and value weights and works on a smaller slice of the vector.",
        "Heads tend to specialise. Researchers have found heads that link a pronoun to its noun, heads that look at the previous token, and heads that copy patterns seen earlier in the text. Nobody programs this; it comes out of training.",
        "The outputs of all the heads are joined back into one vector and passed through one more weight matrix. To save memory, many modern models let several query heads share one set of keys and values (grouped-query attention), which makes the KV cache much smaller."
      ],
      oneLiner: "Several heads attend in parallel with separate weights, specialise in different relationships, and are concatenated and projected back."
    },
    residual: {
      title: "Residual connection and layer norm",
      tip: "The block adds its input back onto its output and normalises the numbers, which keeps deep stacks stable and trainable.",
      detail: [
        "After attention, the block adds the original input vector back onto the attention output. This shortcut is called a residual connection. It means each part of the block only has to learn a small change to the vector, not rebuild it from scratch.",
        "It also gives the training signal a clear path backwards through dozens of blocks. Without residual connections, very deep networks are hard to train, because the signal fades as it passes through each layer.",
        "Layer normalisation rescales each token's vector so its numbers stay a steady size. Most modern models normalise at the start of each sub-layer (pre-norm), and many use a cheaper variant called RMSNorm. The same add-and-normalise pattern wraps the MLP as well."
      ],
      oneLiner: "Residual connections add each sub-layer's input back to its output and layer norm keeps the scale steady - together they let very deep stacks train."
    },
    mlp: {
      title: "Feed-forward network (MLP)",
      tip: "A small two-layer network applied to each token on its own: widen, apply a non-linearity, shrink back. Much of the model's knowledge lives here.",
      detail: [
        "After attention mixes information between tokens, each token's vector goes through the same small neural network, one token at a time. The first layer widens the vector, usually to about four times its size. A non-linear function such as GELU or SwiGLU is applied, and the second layer shrinks it back.",
        "Attention moves information between tokens; the MLP then works on what each token now holds. Research suggests that many facts sit in these weights - somewhere in them is the link between \"capital of India\" and \"New Delhi\".",
        "The MLP holds about two-thirds of a transformer's parameters. Mixture-of-experts models replace this one MLP with many expert MLPs and send each token to only one or two of them, so the model holds far more knowledge without doing much more work per token."
      ],
      oneLiner: "The MLP is a per-token two-layer network that holds most of the parameters and much of the stored knowledge; mixture-of-experts makes it sparse."
    },
    stack: {
      title: "A stack of blocks",
      tip: "One block is attention plus an MLP. The model repeats it many times - 12 in GPT-2 small, 80 or more in large models.",
      detail: [
        "Everything inside the shaded panel is one transformer block: attention, add and normalise, the MLP, add and normalise again. The model stacks the same design many times, each block with its own weights. The output vectors of one block are the input of the next.",
        "Lower blocks tend to handle grammar and local patterns; higher blocks build more abstract meaning. By the top, the vector for the last token \"is\" holds what the model needs to predict the next word.",
        "Depth and width (the vector size) set most of a model's parameter count. A 7-billion-parameter model typically has about 32 blocks with vectors of 4,096 numbers. When people talk about the \"layers\" of an LLM, they usually mean these blocks."
      ],
      oneLiner: "A model is a stack of identical transformer blocks, each refining every token's vector; depth and width set the parameter count."
    },
    lmhead: {
      title: "LM head and logits",
      tip: "Turns the last token's final vector into a score - a logit - for every token in the vocabulary.",
      detail: [
        "After the last block, only the vector of the final token is needed to predict what comes next. The LM head is one large matrix that compares this vector with every token in the vocabulary and gives each one a score, called a logit.",
        "With a 50,000-token vocabulary that is 50,000 scores. High scores go to tokens that fit well after \"The capital of India is\", such as \" New\". Many models reuse the embedding table as this matrix, which saves parameters.",
        "Logits are not probabilities yet. They can be any size and do not add up to anything in particular. The next step, softmax, turns them into probabilities, and sampling settings such as temperature are applied to the logits on the way."
      ],
      oneLiner: "The LM head projects the final token's vector into one logit per vocabulary token, and softmax turns those logits into probabilities."
    },
    probs: {
      title: "Next-token probabilities",
      tip: "Softmax turns the scores into probabilities that add up to 100%. Only the top few are shown here.",
      detail: [
        "Softmax turns the logits into a probability for every token in the vocabulary. Here \" New\" gets most of it, because \"New Delhi\" is the usual continuation. Tokens like \" the\" or \" Delhi\" get a little, and thousands of others share the tiny remainder.",
        "This list is the model's entire output for one step. It does not produce a sentence; it produces a probability for every possible next token. Everything that looks like reasoning comes from repeating this one step many times.",
        "The same probabilities are how models are trained: the training loss is low when the true next token got a high probability. Some APIs return them as log-probabilities, which are useful for measuring confidence or for classification."
      ],
      oneLiner: "The model's output at each step is a probability for every vocabulary token; generation just repeats that prediction one token at a time."
    },
    sampling: {
      title: "Temperature, top-k and top-p",
      tip: "Settings that decide how adventurous the pick is. Low temperature sharpens the odds; top-k and top-p cut off the unlikely tail.",
      detail: [
        "The sampler picks one token from the probabilities. Always taking the most likely token (greedy decoding) is predictable but can sound flat or repeat itself. Drawing at random by the probabilities gives variety but can wander off.",
        "Temperature divides the logits before softmax. Below 1 the odds get sharper, so \" New\" becomes even more likely. Above 1 they flatten, and odd choices such as \" Mumbai\" get a real chance. Temperature 0 is effectively greedy.",
        "Top-k keeps only the k most likely tokens. Top-p keeps the smallest group whose probabilities add up to p, say 0.9, so the cut-off adapts to how confident the model is. Here top-k 3 removes everything after the third token before the draw.",
        "In practice, use a low temperature for extraction, classification and code, and a higher one for brainstorming. Temperature does not make a model know more; it only changes how it chooses among what it already predicts."
      ],
      oneLiner: "Temperature reshapes the distribution and top-k or top-p trims its tail; they change how the model chooses, not what it knows."
    },
    loop: {
      title: "The generation loop",
      tip: "The chosen token is added to the input and the model runs again. Text appears one token at a time because of this loop.",
      detail: [
        "Once \" New\" is picked, it is added to the end of the input: \"The capital of India is New\". Then the whole model runs again to predict the next token, \" Delhi\", and again after that, until it produces a stop token or reaches the length limit.",
        "This is called autoregressive generation, and it is why chat answers stream in word by word. Each new token needs one full pass through all the blocks, so longer answers take longer and cost more.",
        "Running everything again for every token would be wasteful, so servers keep the keys and values of earlier tokens in a KV cache and compute only the newest token. The first token is slow because the whole prompt must be read; later tokens are fast. The LLM inference visual shows this in detail."
      ],
      oneLiner: "Generation is a loop - predict one token, append it, run again - and the KV cache keeps the work for each new token small."
    }
  }
};
