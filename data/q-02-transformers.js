/* Topic 02 - Transformers and attention.
   Grounding: the published architecture, plus what the mechanism forces you to
   know once you care about context limits, latency and serving cost. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["02-transformers"] = {
  "lede": "This topic gets asked when the panel wants to know whether you read past the API documentation. The trap is answering like a textbook. Every question here has an operational consequence - why long context costs what it does, why the first token is slow, why your GPU runs out of memory before it runs out of compute - and the consequence is what scores. New to transformers? The questions are ordered for a first read: every High priority card first, from why transformers replaced RNNs through self-attention, the transformer block, position and encoder vs decoder to the KV cache, latency and mixture-of-experts, then Medium, then Low.",
  "grounding": "the published architecture + what the mechanism forces you to know operationally",
  "evening": [
    "tf-01",
    "tf-03",
    "tf-09",
    "tf-11",
    "tf-12"
  ],
  "cards": [
    {
      "id": "tf-16",
      "q": "Why did transformers replace RNNs and LSTMs?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "transformers",
        "rnn",
        "lstm",
        "basics",
        "history"
      ],
      "why": "Whether you know the two concrete problems the transformer solved - parallel training and long-range memory - rather than just 'attention is better'.",
      "simple": "Before transformers, language models mostly used RNNs (recurrent neural networks) and their improved version, LSTMs. They read text one word at a time, left to right. They carried a running memory, called a hidden state, from each step to the next.\n\nThat design had two big problems.\n\n**It could not be parallelised.** Step 50 needed the result of step 49. So training could not spread one sentence across thousands of GPU cores at once. Training on huge datasets was slow and expensive.\n\n**Long-range memory was weak.** Everything the model knew about earlier words had to squeeze through that one hidden state. Over long distances the information faded, and so did the training signal (the vanishing gradient problem). LSTMs added gates that decide what to keep. That helped, but did not fully fix it.\n\nThe transformer (the 2017 paper \"Attention Is All You Need\") removed the recurrence. With self-attention, every token looks directly at every other token in one step. The whole sequence is processed in parallel during training, and word 1 and word 500 are one hop apart.\n\nThat is what made it possible to scale to billions of parameters and trillions of tokens.\n\nThe honest trade-off: attention cost grows with the square of the length, and generation is still one token at a time. That is why recurrent ideas are returning in state-space models such as Mamba, and in hybrid models.",
      "points": [
        "RNN/LSTM: one token at a time, memory squeezed into a single hidden state.",
        "Problem 1: sequential - training cannot be parallelised across the sequence.",
        "Problem 2: long-range information and gradients fade, even with LSTM gates.",
        "Transformer: self-attention links every token to every other directly, trained in parallel.",
        "Result: it scales on GPUs to huge data and models.",
        "Cost: quadratic attention; state-space and hybrid models revisit recurrence for long context."
      ],
      "say": "RNNs and LSTMs process text one token at a time and carry everything in a single hidden state. That causes two problems: training cannot be parallelised across the sequence, and information from far back fades, even with LSTM gates. The transformer drops recurrence. Self-attention connects every token to every other directly, so training runs in parallel and long-range links are one step away. That is what let models scale. The cost is attention that grows quadratically with length.",
      "numbers": "The original paper (Vaswani et al., 2017) reported state-of-the-art translation quality at a fraction of the training cost of the best recurrent and convolutional models. In attention, any two tokens are one step apart; in an RNN, the path is as long as the distance between them.",
      "wrong": "\"Transformers are just more accurate.\" It misses the actual reason they won - parallel training on GPUs - and cannot explain why recurrent-style state-space models are being revisited for long context.",
      "follow": "If transformers are so good, why are people building state-space models like Mamba?",
      "followAnswer": "Because attention cost grows with the square of the length, and the KV cache grows with every token. State-space models keep a fixed-size state, so their cost is linear in length and memory stays flat during generation. The catch is that a fixed state can struggle to recall exact details from far back. So the practical direction is hybrids: mostly linear-time layers, with some full attention layers mixed in."
    },
    {
      "id": "tf-01",
      "q": "Explain self-attention.",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "transformers",
        "attention",
        "basics"
      ],
      "why": "The standard opener. It checks whether you understand the mechanism or memorised the phrase.",
      "simple": "When the model processes a word, it needs to know which other words matter for understanding it. In \"the claim was denied because it was filed late\", to understand \"it\" the model has to look back at \"the claim\".\n\nSelf-attention is how it does that. For every token, the model makes three vectors (lists of numbers). A **query**: what this token is looking for. A **key**: what this token offers. A **value**: the content it carries.\n\nThen each token's query is compared with every token's key. A strong match gives that token a high weight. The output for this position is a weighted mix of all the values, dominated by the tokens that matched best.\n\nThink of a room where everyone holds up a card describing what they know. Each person scans all the cards and decides who to listen to. That scanning is attention.\n\nThe model runs several of these in parallel, called heads, and each head learns a different kind of relationship. And because everyone scans everyone, the cost grows with the square of the number of tokens. That is the fact the next question is about.",
      "points": [
        "Query - what this token is looking for. Key - what it offers. Value - what it carries.",
        "Every query is scored against every key; high scores mean high weight.",
        "The output is a weighted mixture of values.",
        "Every token attends to every token, so cost is quadratic in sequence length.",
        "Multi-head means several attentions run in parallel, each learning different relationships."
      ],
      "say": "For each token the model produces a query, a key and a value. Every token's query is scored against every other token's key, and where they match strongly that token gets more weight. The output at each position is a weighted mixture of the values. Multiple heads run in parallel so different heads learn different kinds of relationship. Because every token attends to every token, cost grows with the square of the sequence length.",
      "numbers": "Attention is O(n²) in sequence length. Doubling the input roughly quadruples the attention-score compute. At short lengths the linear feed-forward layers still dominate total cost; the quadratic term takes over as context grows long - which is why long context is expensive rather than merely large.",
      "wrong": "\"It lets the model focus on important words.\" A description of the effect with none of the mechanism. The interviewer is asking for query, key and value.",
      "follow": "So what happens to cost when I double the context length?",
      "followAnswer": "The attention-score part roughly quadruples, because every token is compared with every other one - n squared. But not everything is quadratic. The feed-forward layers and projections grow linearly, and at short lengths they dominate, so total compute grows by less than four times. The KV cache memory doubles. And on an API, the input-token bill simply doubles."
    },
    {
      "id": "tf-15",
      "q": "What is inside one transformer block - attention, feed-forward, residuals and layer norm?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "transformers",
        "architecture",
        "basics",
        "layer-norm"
      ],
      "why": "Whether you can draw the block you keep referring to - attention, feed-forward, residuals and normalisation - and say what each part is for.",
      "simple": "A transformer is the same block stacked many times, often a few dozen up to more than a hundred. Each block has two main parts, plus some wiring that keeps training stable.\n\n**1. Self-attention.** Each token gathers information from the other tokens (in a decoder, only earlier ones). This is where tokens talk to each other.\n\n**2. Feed-forward network (FFN), also called the MLP.** Each token is then processed on its own by a small two-layer network. It widens the vector, often about four times, applies a non-linearity, and shrinks it back. This part holds most of the parameters, and much of the model's stored knowledge seems to live here.\n\n**Residual connections.** Each part adds its result to its input instead of replacing it: x = x + attention(x). That gives information and gradients a direct path through a deep stack, so very deep models can still train.\n\n**Layer normalisation.** Before each part, the vector is rescaled to a steady size. This stops the numbers blowing up or shrinking as they pass through many layers. Modern LLMs normalise before each part (pre-norm), usually with RMSNorm, a cheaper variant.\n\nSo one block is: normalise, attend, add back; normalise, feed-forward, add back.\n\nAround the stack sit the token embeddings at the start. At the end there is a final norm, plus a layer that turns each vector into scores over the vocabulary.",
      "points": [
        "**Attention** - tokens mix information across the sequence.",
        "**FFN / MLP** - per-token processing; holds most of the parameters (about two thirds or more in a dense model).",
        "**Residuals** - `x = x + f(x)`, a direct path that lets deep stacks train.",
        "**LayerNorm / RMSNorm** - keeps activations at a stable scale; modern models use pre-norm.",
        "Modern FFNs often use a gated variant such as SwiGLU; MoE models replace the FFN with experts (tf-06)."
      ],
      "code": "# One pre-norm decoder block - the pattern most current LLMs use\nx = x + attention(rms_norm(x))     # tokens exchange information\nx = x + feed_forward(rms_norm(x))  # each token processed on its own",
      "say": "Each block has two sublayers. Self-attention lets tokens exchange information across the sequence. Then a feed-forward network processes each token on its own - it widens the vector, applies a non-linearity and projects back, and it holds most of the parameters. Each sublayer sits inside a residual connection, x plus f of x, so gradients flow through deep stacks, and its input is normalised first. Modern LLMs use pre-norm with RMSNorm, and stack dozens of these blocks.",
      "numbers": "In a standard dense block with a 4× wide feed-forward layer, attention has about 4·d² parameters and the FFN about 8·d², so the FFN holds roughly two thirds. Llama 3 8B, for example, stacks 32 blocks with a model dimension of 4096.",
      "wrong": "\"It's just attention layers stacked.\" Leaving out the feed-forward network, residuals and normalisation misses where most parameters live and why deep stacks train at all.",
      "follow": "Why do modern models put the layer norm before each sublayer instead of after?",
      "followAnswer": "Pre-norm keeps the residual path clean: the raw signal flows straight through every block, and only the branch input is normalised. That keeps gradients well-behaved in very deep stacks, so training is more stable and needs less careful learning-rate warm-up. The original post-norm design can match or beat it when it trains, but it is fragile at depth, so large models standardised on pre-norm."
    },
    {
      "id": "tf-02",
      "q": "Why does the model need positional encoding?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "transformers",
        "positional-encoding",
        "mechanism"
      ],
      "why": "A neat check. It has a clean answer, and not knowing it means the attention answer was memorised.",
      "simple": "Attention has no sense of order. Every token is compared with every other token, and nothing in that operation knows which came first. \"The bank denied the claim\" and \"the claim denied the bank\" would look identical to the mechanism.\n\nSo position has to be injected. The original transformer added fixed sine and cosine patterns to the token embeddings. Later models learned position embeddings instead.\n\nWhat is used now, and worth naming because it dates your knowledge correctly, is rotary position embedding, RoPE. Instead of adding position to the embedding, it rotates the query and key vectors by an angle that depends on the position. The effect is that the attention score between two tokens naturally depends on how far apart they are, rather than on their absolute positions.\n\nThat relative property is why RoPE extends to longer contexts better, and why context-extension techniques usually work by scaling its frequencies. (For why RoPE beat learned and sinusoidal encodings, see tf-14.)",
      "points": [
        "Attention is order-blind. Position must be supplied separately.",
        "Original: fixed sinusoidal patterns added to embeddings.",
        "Current: RoPE rotates query and key vectors by a position-dependent angle.",
        "RoPE encodes relative distance, which extends to longer sequences better.",
        "Context extension usually works by scaling RoPE frequencies."
      ],
      "say": "Attention compares every token with every other and has no notion of order, so \"the bank denied the claim\" and its reverse would look identical. Position is injected separately. The original used fixed sinusoidal patterns; current models mostly use rotary embeddings, which rotate the query and key vectors by a position-dependent angle so the attention score depends on relative distance. That is why RoPE extends to longer contexts better.",
      "numbers": "No number applies. Context-extension methods scale RoPE's frequency base - that is the knob, if the follow-up goes there.",
      "wrong": "\"Positional encoding tells the model the position of each word.\" True and circular. The question is why attention needs telling, and the answer is that it is order-blind by construction.",
      "follow": "How do models get extended from 8k to 128k context?",
      "followAnswer": "Mostly by rescaling RoPE. Position interpolation or YaRN adjusts the rotation frequencies so longer positions map into the range the model saw in training. Then a short continued-training run on long documents teaches the model to use that range. Serving needs memory help too - grouped-query attention, FlashAttention, a paged KV cache. And I test recall across the whole window rather than trusting the advertised number."
    },
    {
      "id": "tf-04",
      "q": "Encoder, decoder, encoder-decoder - which is which and why does it matter?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "transformers",
        "architecture",
        "models"
      ],
      "why": "It explains why you use different models for embeddings and for generation.",
      "simple": "There are three shapes. The difference is what each token is allowed to see.\n\nAn **encoder** lets every token see every other token, in both directions. That gives a rich picture of a complete input. So encoder models such as BERT became the basis of embedding and classification models. You already have the whole text, and you want to understand it.\n\nA **decoder** is causal: each token can see only the tokens before it. That rule is what makes generation possible, because the model must not peek at the word it is about to predict. The chat models whose designs are public are almost all decoder-only.\n\nAn **encoder-decoder** has both. The encoder reads the input fully; the decoder then generates while looking back at it. T5 is the familiar example, and translation is the classic use.\n\nThe practical payoff: this is why your embedding model and your chat model are traditionally different architectures, and why raw hidden states from a chat model make poor embeddings.\n\nThe 2026 caveat: many top embedding and reranking models are now decoder LLMs fine-tuned with contrastive training (Qwen3-Embedding is one example). So the training objective matters as much as the architecture.",
      "points": [
        "Encoder - bidirectional. Understanding: embeddings, classification, reranking.",
        "Decoder - causal, sees only the past. Generation.",
        "Encoder-decoder - reads fully, then generates. Translation, summarisation.",
        "Chat models with published designs are decoder-only, almost without exception.",
        "Cross-encoder rerankers read query and document jointly; classic ones are BERT-style encoders, newer ones are often fine-tuned decoders."
      ],
      "say": "The difference is what each token can see. An encoder is bidirectional, so every token sees the whole input - that is what classic embedding, classification and reranking models are built on. A decoder is causal, seeing only previous tokens, which is what makes generation possible, and it is what chat models are built on. Encoder-decoder reads fully, then generates. That is why embedding and generation models are traditionally different architectures.",
      "numbers": "No number applies. The architectural distinction is the answer.",
      "wrong": "\"Decoder-only models are just newer and better.\" They are better at generation. For embedding and reranking, BERT-style encoders remain strong and cheap, and decoder-based embedders only work well after contrastive fine-tuning - so the training objective, not recency, decides.",
      "follow": "So which architecture is your reranker, and why?",
      "followAnswer": "A cross-encoder. It reads the query and each candidate document together in one pass, so attention can compare them word by word - that is why it beats comparing two separate embeddings. Classic rerankers are BERT-style encoders because they are small and fast; newer strong ones are often fine-tuned decoder LLMs. I pick by the measured quality gain against my latency budget."
    },
    {
      "id": "tf-03",
      "q": "What is the KV cache and why does it dominate your memory?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "transformers",
        "kv-cache",
        "serving",
        "memory"
      ],
      "why": "The single most operationally useful thing in this topic. It explains your concurrency limit.",
      "simple": "The model generates one token at a time, and each new token attends to every earlier token. Without help, producing token 500 would mean recomputing the keys and values for all 499 before it. Then doing it all again for token 501.\n\nThe **KV cache** stores those keys and values once. Each new step computes keys and values only for the new token, and reads the rest from the cache. That turns a huge repeated cost into a small one.\n\nThe price is memory, and this is what matters in production. The cache grows with the length of each sequence, with the number of requests in the batch, and with the number of layers. It lives on the GPU next to the model weights. Long conversations at high concurrency fill it fast.\n\nSo on a serving GPU you usually run out of KV cache memory before you run out of compute. That sets your concurrency limit. It is also why PagedAttention (the idea behind vLLM) exists: it hands out cache memory in small blocks, instead of reserving a worst-case slab for every request.",
      "points": [
        "Stores keys and values for previous tokens so they are computed once.",
        "Each decode step computes K and V for one new token instead of the whole prefix.",
        "Memory grows with sequence length × batch size × layers.",
        "It usually binds before compute does - that is your concurrency ceiling.",
        "Paged attention allocates it in blocks instead of a worst-case contiguous reservation.",
        "It is also why a long system prompt costs memory on every concurrent request."
      ],
      "say": "Each generated token attends to all previous tokens, so without caching we would recompute their keys and values every step. The KV cache stores them once, so each step computes only the new token's. The cost is GPU memory that grows with sequence length, batch size and layers. In serving you normally exhaust KV cache memory before compute, which is what sets your concurrency limit - and why paged attention exists.",
      "numbers": "KV cache size ≈ 2 × layers × kv_heads × head_dim × sequence_length × batch × bytes_per_value (worked example in tf-12). Quantising the cache to 8-bit (FP8 or INT8) roughly halves it against FP16.",
      "wrong": "\"It caches the previous responses.\" That is a response cache, an entirely different thing at a different layer. This confusion is common and very visible.",
      "follow": "You need more concurrent users on the same GPU. What do you change?",
      "followAnswer": "Shrink the cache per request, or waste less of it. Use a model with grouped-query attention, quantise the KV cache to FP8, cap context length and trim long prompts, and turn on prefix caching so shared prefixes are stored once. Make sure the server uses paged attention and continuous batching. Quantising the weights also frees memory for cache. Then load-test against the p95 latency I can accept."
    },
    {
      "id": "tf-05",
      "q": "Why is the first token slow and the rest fast?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "transformers",
        "latency",
        "inference",
        "serving"
      ],
      "why": "A latency question with a mechanism answer. It is the bridge from architecture to operations.",
      "simple": "Because two different things are happening, with different bottlenecks.\n\nGetting the first token out means processing the entire input - prefill. All input tokens go through the model, and they can be processed in parallel because they are all already known. That is compute-heavy work, and it scales with how much input you sent. A long retrieved context makes the first token slow.\n\nAfter that, each further token is decode. One token at a time, each depending on the last, so nothing can be parallelised within a single request. Here the bottleneck is not compute but memory bandwidth - the GPU spends most of its time moving weights and cache around rather than doing arithmetic.\n\nThe operational consequence is that long input and long output are separate problems. If time to first token is bad, cut the prompt: fewer chunks, tighter context. If total time is bad, cut the output length or stream so the user starts reading immediately.\n\nThe underlying prefill/decode split is covered in llm-14; this card is the latency-debugging version.",
      "points": [
        "Prefill - whole input in parallel, compute-bound, sets time to first token.",
        "Decode - one token at a time, memory-bandwidth-bound, sets tokens per second.",
        "Long input hurts first token. Long output hurts total time. Different fixes.",
        "Streaming does not reduce total time; it removes the wait before anything appears.",
        "Prompt caching cuts prefill directly, which is why it improves first-token latency."
      ],
      "say": "Two phases with different bottlenecks. Prefill processes the entire input in parallel - compute-bound, and it sets time to first token, so a long retrieved context makes the first token slow. Decode then produces one token at a time, each depending on the last, and is memory-bandwidth-bound, setting tokens per second. So long input and long output are separate problems: trim the prompt for one, stream or shorten output for the other.",
      "numbers": "Time to first token is the one users feel. As a rough rule of thumb, around a second feels responsive and several seconds of blank screen feels broken - set the real target from your own users and product.",
      "wrong": "\"The model warms up.\" There is no warm-up in the request. The two-phase explanation is the actual mechanism, and it points to different fixes.",
      "follow": "Your p95 time to first token is 4 seconds. What do you look at?",
      "followAnswer": "First I split it into queueing time and actual prefill. If requests are waiting, it is capacity or batching - add replicas, rebalance load, or tune the server's batch limits. If prefill itself is slow, I look at prompt size: too many retrieved chunks, long history, large tool definitions. Then prompt caching for the stable prefix. With a reasoning model, thinking time delays the first visible token too."
    },
    {
      "id": "tf-06",
      "q": "What is a mixture-of-experts model?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "transformers",
        "moe",
        "architecture",
        "cost"
      ],
      "why": "Currency. Several current frontier and open models are MoE, and it explains their odd cost profile.",
      "simple": "In a normal (dense) model, every token passes through every parameter. A bigger model means more compute per token.\n\nA **mixture-of-experts (MoE)** model changes the feed-forward part of each layer. Instead of one feed-forward network, it has many smaller ones, called experts. A small router picks a few experts for each token, commonly between 1 and 8, often alongside an always-on shared expert. So the model can hold a huge number of parameters in total, but use only a small fraction for any one token.\n\nThat is the attraction. You get quality well above a dense model of the same active size, at roughly that smaller model's compute per token. DeepSeek-V3, Qwen3's MoE models, Llama 4 and gpt-oss all use this design.\n\nThe catch is the operational half, and it is worth saying. All the experts must sit in memory, because the router might pick any of them. So you get cheap compute and expensive memory. For self-hosting that changes hardware sizing completely: size for total parameters, not active ones.\n\nOne myth to avoid: experts are not topic specialists. There is no \"legal expert\". Routing is learned per token and tracks patterns, not subjects.",
      "points": [
        "Many parallel expert blocks; a router activates only a few per token.",
        "Large total parameters, small active parameters per token.",
        "Compute cost scales with active parameters - that is the win.",
        "Memory must hold all experts - that is the cost.",
        "Self-hosting: size hardware on total parameters, not active ones.",
        "Routing can be uneven, which makes serving throughput less predictable."
      ],
      "say": "Instead of every token passing through every parameter, the feed-forward block becomes many parallel experts with a small router that picks a few per token. So the model has a large total parameter count but only activates a fraction per token, giving much of a large model's quality at small-model compute. The catch is memory - every expert must be resident because the router might pick any. Cheap compute, expensive memory.",
      "numbers": "The active fraction varies widely - DeepSeek-V3 activates about 37B of 671B parameters per token, Mixtral 8x7B about 13B of 47B, and gpt-oss-120b about 5B of 117B. Size self-hosted hardware on total parameters; the active count only tells you about compute.",
      "wrong": "\"It picks the best expert for the topic.\" Routing is learned and per-token, not semantic - there is no medical expert and legal expert. That framing invites a correction.",
      "follow": "How does that change your hardware choice if you self-host?",
      "followAnswer": "I size memory for total parameters, so a model with a small active count can still need several GPUs just to hold the weights - quantisation helps a lot here. Then I plan for expert parallelism, spreading experts across GPUs, which needs a fast interconnect such as NVLink. At high batch sizes most experts get used anyway, so the compute saving is real, but memory is the constraint."
    },
    {
      "id": "tf-10",
      "q": "Why divide by the square root of d_k in scaled dot-product attention?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "attention",
        "theory",
        "training"
      ],
      "why": "A small detail with a real reason. It separates people who read the paper from people who read a blog summary.",
      "simple": "**Short version: without the scaling, attention scores grow as the vectors get longer, softmax becomes all-or-nothing, and training stops learning.**\n\nA dot product of two vectors adds up d_k products, one per dimension. If each part is random with a variance of about 1, the sum has a variance of about d_k. So the scores get bigger as the head dimension grows. At d_k = 64 their standard deviation is about 8; at 512, about 22.\n\nNow feed big numbers into softmax. Softmax exponentiates, so a gap of 20 between the top score and the rest gives the top one almost all the probability. The output becomes nearly one-hot: one position gets everything.\n\nThat hurts training, not just behaviour. A saturated softmax has a gradient close to zero, so almost no learning signal flows back. The attention weights get stuck early.\n\nDividing by the square root of d_k brings the variance back to about 1, whatever the head size. Softmax stays in its responsive range, and gradients flow.\n\nWhy the square root exactly? Variance grows with d_k, so the standard deviation grows with the square root of d_k. You are normalising the standard deviation. It falls out of the statistics; nobody tuned it.\n\nA nice link: dividing logits by a constant before softmax is exactly what temperature does. So the scaling is a fixed temperature, chosen to keep attention trainable.",
      "points": [
        "Dot-product variance grows with d_k, so scores grow in magnitude.",
        "Large scores saturate softmax toward one-hot.",
        "Saturated softmax has near-zero gradient - training stalls.",
        "Square root because standard deviation scales with sqrt(d_k).",
        "Mechanically identical to a fixed temperature on the logits."
      ],
      "say": "The dot product sums d_k products, so its variance grows with the head dimension and the scores get large. Large scores saturate softmax into a near one-hot distribution, and saturated softmax has almost no gradient, so training stalls. Dividing by the square root of d_k normalises the standard deviation back to about one, keeping softmax responsive at any head size. It is mechanically the same as applying a fixed temperature.",
      "numbers": "At d_k = 64, unscaled scores have a standard deviation around 8 - enough for softmax to saturate. Scaling brings it back to roughly 1.",
      "wrong": "'To keep the numbers small.' It is the right instinct with no mechanism, and the reason it matters is gradients, not numerical size.",
      "follow": "What does this have in common with the temperature parameter?"
    },
    {
      "id": "tf-09",
      "q": "Walk me through the shapes in a single attention head.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "attention",
        "transformers",
        "whiteboard"
      ],
      "why": "The whiteboard question. Tracking dimensions end to end proves you understand the mechanism rather than the metaphor.",
      "simple": "**Short version: track the shapes - (10, 64) queries, keys and values in, a (10, 10) attention pattern in the middle, (10, 64) out.**\n\nTake a batch of 1, a sequence of 10 tokens, and a model dimension of 512. With 8 heads, each head works in 64 dimensions.\n\n    x            (10, 512)     input embeddings\n    W_q, W_k, W_v (512, 64)    per-head projections\n\n    Q = x @ W_q  (10, 64)\n    K = x @ W_k  (10, 64)\n    V = x @ W_v  (10, 64)\n\n    scores = Q @ K.T          (10, 10)   every token against every token\n    scores = scores / sqrt(64)\n    scores = scores + mask    (10, 10)   -inf above the diagonal\n    weights = softmax(scores, dim=-1)    rows now sum to 1\n    out = weights @ V         (10, 64)\n\nThen the 8 heads are joined back to (10, 512) and pass through an output projection.\n\nTwo shapes carry the meaning. The (10, 10) score matrix is the attention pattern. Row i says how much token i attends to each other token. It is what attention heatmaps show, and it is where the quadratic cost lives: sequence length squared.\n\nThe output is (10, 64), not (10, 10). That is the point people miss. Attention produces a weighted mix of value vectors, not a similarity score. Each output row is a blend of the V rows.\n\nSoftmax runs along the last dimension, so each row sums to 1 on its own. Getting that axis wrong is a real bug, and the model still trains to something plausible but wrong.",
      "points": [
        "Q, K, V are (seq, d_head) after projection from (seq, d_model).",
        "Q @ K.T gives (seq, seq) - this is the quadratic cost.",
        "Mask adds -inf above the diagonal, before softmax.",
        "Softmax along the last axis so each row sums to 1.",
        "Output is (seq, d_head) - a weighted mixture of V, not a score."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Shapes through one attention head: input (10,512) projects to Q, K and V at (10,64), scores are (10,10), output is (10,64).",
        "lanes": [
          {
            "label": "x",
            "note": "(10, 512)"
          },
          {
            "label": "Q, K, V",
            "note": "(10, 64) each",
            "accent": "accent"
          },
          {
            "label": "Q @ K.T",
            "note": "(10, 10) quadratic",
            "accent": "bad"
          },
          {
            "label": "/ sqrt(64) + mask",
            "note": "-inf above diagonal",
            "accent": "warn"
          },
          {
            "label": "softmax",
            "note": "last axis, rows sum to 1",
            "accent": "warn"
          },
          {
            "label": "weights @ V",
            "note": "(10, 64) not (10,10)",
            "accent": "accent"
          },
          {
            "label": "concat 8 heads",
            "note": "(10, 512)"
          }
        ],
        "caption": "The two shapes that carry the meaning. **(10, 10)** is the attention pattern, and it is where the quadratic cost lives. **(10, 64)** is the output - attention produces a weighted mixture of value vectors, not a similarity score, and that is the step people get wrong. Softmax along the last axis, or you get a bug that trains to something plausible and wrong."
      },
      "say": "With sequence 10 and model dimension 512 across 8 heads, each head projects to 64 dimensions, so Q, K and V are each 10 by 64. Q times K transpose gives a 10 by 10 score matrix - that is the attention pattern and where the quadratic cost lives. Scale by root d_k, add the causal mask before softmax, softmax along the last axis, then multiply by V to get 10 by 64. Heads concatenate back to 512.",
      "numbers": "d_head is d_model divided by the head count. The (seq, seq) matrix is what makes attention quadratic in sequence length.",
      "wrong": "Describing attention as 'tokens looking at each other' with no shapes. The follow-up asks for dimensions, and that is where it falls apart.",
      "follow": "Where exactly does the causal mask go, and what breaks if you apply it after softmax?",
      "followAnswer": "Before softmax. You add minus infinity to the scores above the diagonal, so those positions become exactly zero after softmax and each row still sums to one. If you instead zero them after softmax, the rows no longer sum to one. If you forget the mask, training leaks future tokens: the loss looks great and generation fails."
    },
    {
      "id": "tf-11",
      "q": "What are MHA, MQA and GQA, and why did the industry move to GQA?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "attention",
        "kv-cache",
        "serving"
      ],
      "why": "A concrete architecture evolution driven entirely by a serving constraint. It ties theory to production cost.",
      "simple": "**Short version: all three are the same attention. They differ in how many key/value heads are shared, and that sets the KV cache size. GQA is the quality-versus-memory compromise most models now use.**\n\n**Multi-head attention (MHA)** gives every query head its own keys and values. It is the most expressive. But the KV cache stores keys and values for every head, in every layer, for every token. At long context and high concurrency, that cache can outgrow the model weights.\n\n**Multi-query attention (MQA)** goes to the other extreme. All query heads share one key and value head. The cache shrinks by the head count, so a 32-head model's cache gets about 32 times smaller. A huge saving, but quality drops measurably and training can be less stable.\n\n**Grouped-query attention (GQA)** is the compromise that won. Query heads are split into groups, and each group shares one key/value head.\n\n    MHA:  32 query heads, 32 KV heads   full cache\n    GQA:  32 query heads,  8 KV heads   4x smaller cache\n    MQA:  32 query heads,  1 KV head    32x smaller, quality cost\n\nWhy it matters commercially: cache size decides how many requests fit on a GPU. Cut it four times and, when KV memory is the limit, you can serve up to about four times the users on the same hardware.\n\nThe lesson worth stating: this change was driven by serving cost, not by a modelling insight. Inference economics now shape model design.",
      "points": [
        "MHA: one KV head per query head - largest cache.",
        "MQA: all query heads share one KV head - smallest, quality cost.",
        "GQA: groups share KV heads - the practical compromise.",
        "Beyond GQA: DeepSeek's multi-head latent attention (MLA) compresses K and V into a small latent vector.",
        "Cache size determines concurrent requests per GPU.",
        "Driven by inference economics, not modelling insight."
      ],
      "say": "They differ in how many key-value heads exist per query head. MHA gives each query head its own, which maximises the KV cache. MQA shares one across all of them, shrinking the cache by the head count but costing quality. GQA groups query heads to share KV heads - typically 32 query heads over 8 groups for a 4× reduction at close to MHA quality. It matters because cache size sets how many concurrent requests fit on a GPU.",
      "numbers": "32 query heads with 8 KV groups is a common configuration - roughly 4× cache reduction, so up to roughly 4× the concurrent requests on the same hardware when KV memory is the limit.",
      "wrong": "Describing them as three equally valid options. GQA won for a specific reason, and not knowing that reason is the gap the question probes.",
      "follow": "Your KV cache is still the bottleneck after GQA. What else can you do?",
      "followAnswer": "Quantise the cache to FP8 or INT8, which roughly halves it. Make sure paged attention and prefix caching are on, so memory is not wasted and shared prefixes are stored once. Cap context length and trim prompts. Offload cold cache to CPU memory if the server supports it. Or pick a model with sliding-window layers or latent attention. Beyond that, it is more GPUs."
    },
    {
      "id": "tf-12",
      "q": "Do the arithmetic: how much memory does the KV cache need?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "kv-cache",
        "serving",
        "capacity"
      ],
      "why": "A capacity-planning question. Being able to compute this live is what turns a GPU-sizing conversation from a guess into a plan.",
      "simple": "**Short version: KV cache memory = 2 × layers × KV heads × head size × tokens × bytes. At real context lengths and concurrency, it is often bigger than the model weights.**\n\nThe formula is worth memorising:\n\n    2 x layers x kv_heads x d_head x seq_len x bytes_per_value\n\nThe 2 is there because you store both K and V. Multiply by the batch size for concurrent requests.\n\nWork an example. Take a 7B-class model with full multi-head attention (Llama-2-7B's shape): 32 layers, 32 KV heads, head size 128, stored in FP16, so 2 bytes per value.\n\n    per token = 2 x 32 x 32 x 128 x 2 bytes\n              = 524,288 bytes  ~ 0.5 MB per token\n\nOne 8,000-token conversation needs about 4 GB of cache. Ten users at that length need about 40 GB. The weights themselves are only about 14 GB (7B parameters × 2 bytes).\n\nThat is the punchline. At real lengths and concurrency, the cache dominates memory, not the weights. Teams size a GPU for the model, then are surprised they can serve only a handful of users.\n\nNow use GQA with 8 KV heads instead of 32, which is Llama-3-8B's shape. The same sum gives about 0.125 MB per token, so about 1 GB for that conversation instead of 4. That is up to four times the users on the same hardware.\n\nThe levers: fewer KV heads (GQA or MQA), fewer bytes per value (an FP8 cache), shorter context, and PagedAttention so memory is not lost to fragmentation.",
      "points": [
        "2 x layers x kv_heads x d_head x seq_len x bytes.",
        "A 7B model at FP16 is roughly 0.5 MB per token with MHA.",
        "8k context is ~4 GB - one conversation, before concurrency.",
        "At real concurrency the cache exceeds the weights.",
        "Levers: GQA, cache quantisation, shorter context, PagedAttention."
      ],
      "say": "It is two times layers times KV heads times head dimension times sequence length times bytes per value. For a 7B model with 32 layers, 32 KV heads and 128 head dimension at FP16, that is about half a megabyte per token - so an 8,000-token conversation is around 4 GB, and ten concurrent users exceed the model weights. That is why GQA matters: dropping to 8 KV heads cuts it fourfold and can roughly quadruple concurrency.",
      "numbers": "Roughly 0.5 MB per token for a 7B model at FP16 with MHA; about 0.125 MB with 8-group GQA. Model weights are ~2 bytes per parameter.",
      "wrong": "Sizing a GPU by model weights alone. It is the most common capacity-planning error and it shows up as far lower concurrency than expected.",
      "follow": "You have an 80 GB GPU and a 7B model. How many 8k-context users can you serve?",
      "followAnswer": "Weights take about 14 GB at FP16. I leave roughly 10 percent headroom for activations and the runtime, so about 58 GB is left for cache. With full multi-head attention at about 4 GB per 8k conversation, that is around 14 users. With an 8-KV-head GQA model it is about 1 GB each, so around 55. An FP8 cache roughly doubles either number."
    },
    {
      "id": "tf-07",
      "q": "How do models handle 128k or 1M token contexts if attention is quadratic?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "transformers",
        "long-context",
        "attention",
        "advanced"
      ],
      "why": "A depth question that separates people who track the field from people who read one blog post.",
      "simple": "No single trick. Several work together.\n\n**Faster exact attention.** FlashAttention reorganises the work so the full attention matrix is never written to GPU memory. Same maths, far less data movement, much faster in practice. The arithmetic is still quadratic.\n\n**Cheaper attention patterns.** Some layers look only at a local window of recent tokens, while a few layers keep full attention. So not every layer pays the full quadratic price. Some newer models go further and replace most attention layers with linear-time layers, in hybrid designs.\n\n**A smaller KV cache.** Grouped-query attention lets several query heads share one set of keys and values, cutting the cache several times over. It is in most current models. DeepSeek's multi-head latent attention compresses the cache further.\n\n**Longer positions.** Scaling RoPE's frequencies lets the model work past its training length, after a short extra training run.\n\nThen the honest caveat, which is the part that scores. Supporting a long context is not the same as using it well. Many models recall a fact buried in the middle less reliably than one near the start or end. So a large window is a capability, not a strategy - and you still pay for every token.",
      "points": [
        "FlashAttention - same maths, never materialises the attention matrix. Memory-efficient.",
        "Sliding-window and sparse attention - not every layer pays full cost.",
        "Hybrid models mix a few full-attention layers with linear-time layers (state-space or linear attention).",
        "Grouped-query attention - shares KV heads, shrinking the cache several-fold.",
        "RoPE scaling extends usable position range beyond training length.",
        "Supporting long context ≠ using it well. Mid-context recall can degrade.",
        "You still pay per token, so a large window is not a cheap window."
      ],
      "say": "Several things together. FlashAttention keeps the same maths but never materialises the attention matrix, so it is memory-efficient rather than cheaper. Some layers use windowed or sparse attention. Grouped-query attention shares key and value heads, shrinking the cache. And RoPE scaling extends the position range. But supporting long context is not the same as using it well - mid-context recall can degrade, and you still pay per token.",
      "numbers": "Grouped-query attention cuts KV cache by the query-to-KV head ratio - commonly 4× to 8×. That is one of the main reasons long context became servable.",
      "wrong": "\"They use sparse attention.\" One of four mechanisms, and stopping there misses grouped-query attention, which did more for serving cost than sparsity did.",
      "follow": "Given that, would you use a 200k context or retrieval?",
      "followAnswer": "Retrieval by default for a large or changing corpus: it is cheaper and faster per query, keeps per-document access control, and gives citations. I would use long context when the task needs a whole document at once - reviewing one long contract, say - and the set is small. Often both: retrieve the few relevant documents, then pass them in full rather than as tiny chunks."
    },
    {
      "id": "tf-13",
      "q": "What is FlashAttention and why does it matter?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "attention",
        "optimisation",
        "serving"
      ],
      "why": "Commonly named and rarely understood. The key insight is that it is exact, not approximate.",
      "simple": "**Short version: FlashAttention computes exactly the same attention, but in small tiles that stay in fast on-chip memory, so the huge score matrix is never stored.**\n\nStandard attention builds the full sequence-by-sequence score matrix in GPU memory. At 8,000 tokens that is 64 million values, per head, per layer. It is written out, read back for softmax, written again, and read again to multiply by V.\n\nThe problem is that GPUs do arithmetic far faster than they move data. The chip has a small, very fast on-chip memory (SRAM) and a large, slower main memory (HBM). Standard attention spends most of its time shuffling that big matrix between the two.\n\nFlashAttention never builds the full matrix. It loads small blocks of Q, K and V into fast memory and computes attention block by block. A trick called online softmax keeps a running maximum and sum, so the final result is still correctly normalised.\n\nThe point people miss: the output is the same as standard attention, apart from tiny floating-point rounding. It is not an approximation like sparse attention. Same numbers, fewer trips to memory.\n\nThe gains are large: attention runs several times faster, and its extra memory grows linearly with sequence length instead of quadratically. The compute is still quadratic. Later versions, such as FlashAttention-3 for H100-class GPUs, squeeze more out of newer hardware.\n\nFor an application engineer: it is on by default in modern serving stacks, and it is a big reason long context is affordable.",
      "points": [
        "Standard attention materialises the full (seq, seq) matrix.",
        "The bottleneck is memory bandwidth, not arithmetic.",
        "Tiling plus online softmax avoids materialising it.",
        "Output is exact - not an approximation.",
        "Memory becomes linear in sequence length; compute stays quadratic."
      ],
      "say": "Standard attention writes the full sequence-by-sequence matrix to GPU memory and reads it back several times, and the bottleneck is memory bandwidth rather than arithmetic. FlashAttention tiles the computation into on-chip memory and uses an online softmax with running statistics, so it never materialises that matrix. The important part is that the result is exact, not approximate - and memory becomes linear in sequence length, which is what made long context affordable.",
      "numbers": "Memory goes from quadratic to linear in sequence length. Compute remains quadratic - FlashAttention is an IO optimisation, not an algorithmic one.",
      "wrong": "Calling it an approximate or sparse attention method. It is exact, and that distinction is the entire reason it was adopted universally.",
      "follow": "If compute is still quadratic, how do models handle a million-token context?",
      "followAnswer": "By combining several things: FlashAttention for memory, grouped-query or latent attention to shrink the cache, sliding-window or linear-time layers so most layers are not quadratic, and RoPE scaling for positions. Serving also splits very long sequences across GPUs. Even then it is expensive and slow, and recall in the middle can weaken, so retrieval is usually still cheaper."
    },
    {
      "id": "tf-14",
      "q": "RoPE against learned and sinusoidal positional encoding - why did RoPE win?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "positional-encoding",
        "long-context",
        "transformers"
      ],
      "why": "Explains how context-length extension is even possible, which is a live production concern.",
      "simple": "**Short version: RoPE builds position into the attention score itself, as relative distance. That is what lets models be stretched to longer contexts cheaply.**\n\nAttention on its own ignores order, so position has to be added somehow. Three main approaches were tried.\n\n**Sinusoidal encoding** adds fixed sine and cosine patterns to the input embeddings. It has no parameters. But in practice it works poorly past the trained length, and position enters only once, at the input.\n\n**Learned absolute encoding** trains one vector per position. It works well up to the trained length and then stops dead. If you trained to 4,096, position 5,000 has no vector, so a longer context needs retraining.\n\n**RoPE (rotary position embedding)** does something different. It rotates the query and key vectors by angles that depend on their position, in every attention layer.\n\nThe elegant part is what the rotation does to the dot product. When a query at position m meets a key at position n, the rotations combine. So the position part of the score depends only on m minus n: the distance. Position becomes relative for free, with no extra parameters.\n\nWhy it won. Relative distance is what matters in language. It applies at every layer, so it does not fade. And because rotation is continuous, you can interpolate: shrink the angles, and a model trained at 4k can be adapted to 32k with a short fine-tune. Position interpolation and YaRN do exactly this.\n\nSo RoPE turned context extension from a retrain into a cheap fine-tune.",
      "points": [
        "Attention is permutation-invariant, so position must be injected.",
        "Learned absolute encoding cannot extend past its trained length.",
        "RoPE rotates Q and K by an angle proportional to position.",
        "The dot product then depends only on relative distance.",
        "Continuous rotation allows interpolation - cheap context extension."
      ],
      "say": "Attention is permutation-invariant so position has to be injected. Learned absolute embeddings stop working past the trained length, and sinusoidal encoding is added once at the input and extrapolates poorly in practice. RoPE rotates Q and K by an angle proportional to position at every layer, and the rotations combine so the dot product depends only on relative distance. Because it is continuous you can interpolate, which is what makes cheap context extension possible.",
      "numbers": "Position interpolation and YaRN scale RoPE angles to extend a 4k-trained model to 32k or beyond with a short fine-tune rather than a retrain.",
      "wrong": "'RoPE is just better positional encoding.' The follow-up is why, and relative-distance-from-rotation plus interpolability is the answer.",
      "follow": "How would you extend a model trained at 8k to handle 64k?",
      "followAnswer": "Apply RoPE scaling - YaRN, or a larger RoPE base - so 64k positions map into the angle range the model already knows. Then continue training briefly on long documents, mixed with normal-length data so short-context quality does not drop. Check that serving can hold a 64k KV cache. Then test with needle-in-a-haystack and, more importantly, real long-document tasks at different depths."
    },
    {
      "id": "tf-08",
      "q": "Do you need to know this to build GenAI applications?",
      "round": [
        "manager",
        "tech1"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "transformers",
        "judgement",
        "practical"
      ],
      "why": "Sometimes asked directly, sometimes implied. The honest answer is more impressive than either extreme.",
      "simple": "Not for most of the work. Yes for the parts where it matters. Being specific about which is which is the whole answer.\n\nYou can build a working RAG system, an agent and an evaluation harness without ever thinking about query and key vectors. Most of the job is retrieval quality, clear prompts, evaluation and operations.\n\nIt does matter in a few places. Explaining why long context costs what it does. Sizing a GPU for self-hosting. Debugging why the first token is slow. Comparing models' attention designs for serving cost. Judging whether a fine-tune can plausibly fix a problem.\n\nSo the position I would state: I know the mechanism well enough to reason about cost, latency and memory, because those decisions come to me. I do not need to implement attention from scratch to make those calls.\n\nThat answer is credible. Claiming deep expertise you cannot defend under one follow-up is worse than saying honestly where your depth ends.",
      "points": [
        "Most application work does not require it.",
        "It matters for: serving cost, GPU sizing, latency debugging, model choice.",
        "Know it well enough to reason about memory, cost and latency.",
        "Say where your depth ends. It is more credible than overclaiming.",
        "Overclaiming here is easily exposed - the follow-ups in this topic are precise."
      ],
      "say": "Not for most of it. A working RAG system, an agent and an evaluation harness need retrieval quality, prompt discipline and operations, not attention internals. It matters when I am sizing a GPU, debugging first-token latency, comparing serving costs or judging whether a fine-tune can fix something. So I know the mechanism well enough to reason about memory, cost and latency, without needing to implement attention from scratch.",
      "numbers": "No number applies. Calibration is what is being marked.",
      "wrong": "Either extreme. \"It's essential\" invites precise follow-ups on shapes and memory; \"it's irrelevant\" says you cannot reason about serving cost.",
      "follow": "Fine - then explain why our inference bill jumped when we increased retrieved chunks."
    }
  ]
};
