/* Topic 02 — Transformers and attention.
   Grounding: the published architecture, plus what the mechanism forces you to
   know once you care about context limits, latency and serving cost. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["02-transformers"] = {
  lede: "This topic gets asked when the panel wants to know whether you read past the API documentation. The trap is answering like a textbook. Every question here has an operational consequence — why long context costs what it does, why the first token is slow, why your GPU runs out of memory before it runs out of compute — and the consequence is what scores.",
  grounding: "the published architecture + what the mechanism forces you to know operationally",
  evening: ["tf-01", "tf-03", "tf-09", "tf-11", "tf-12"],

  cards: [
    {
      id: "tf-01",
      q: "Explain self-attention.",
      round: ["tech1"],
      level: "2-5",
      tags: ["transformers", "attention", "basics"],
      why: "The standard opener. It checks whether you understand the mechanism or memorised the phrase.",
      simple:
        "When the model processes a word, it needs to know which other words in the sentence matter for understanding it. In \"the claim was denied because it was filed late\", to understand \"it\" the model needs to look back at \"the claim\".\n\n" +
        "Self-attention is how it does that. For every token, the model produces three things: a query, which is what this token is looking for; a key, which is what this token offers; and a value, which is the content it carries.\n\n" +
        "Then every token's query is compared against every other token's key. Where they match strongly, that token gets a high weight. The output for this position is a weighted mix of all the values, dominated by the tokens that matched.\n\n" +
        "Think of a room where everyone holds up a card describing what they know, and each person scans all the cards to decide who to listen to. That scanning is attention. And because everyone scans everyone, the cost grows with the square of the number of people — which is the fact the next question is about.",
      points: [
        "Query — what this token is looking for. Key — what it offers. Value — what it carries.",
        "Every query is scored against every key; high scores mean high weight.",
        "The output is a weighted mixture of values.",
        "Every token attends to every token, so cost is quadratic in sequence length.",
        "Multi-head means several attentions run in parallel, each learning different relationships."
      ],
      say: "For each token the model produces a query, a key and a value. Every token's query is scored against every other token's key, and where they match strongly that token gets more weight. The output at each position is a weighted mixture of the values. Multiple heads run in parallel so different heads learn different kinds of relationship. Because every token attends to every token, cost grows with the square of the sequence length.",
      numbers: "Attention is O(n²) in sequence length. Doubling the input roughly quadruples the attention compute — which is why long context is expensive rather than merely large.",
      wrong: "\"It lets the model focus on important words.\" A description of the effect with none of the mechanism. The interviewer is asking for query, key and value.",
      follow: "So what happens to cost when I double the context length?"
    },

    {
      id: "tf-02",
      q: "Why does the model need positional encoding?",
      round: ["tech1"],
      level: "2-5",
      tags: ["transformers", "positional-encoding", "mechanism"],
      why: "A neat check. It has a clean answer, and not knowing it means the attention answer was memorised.",
      simple:
        "Attention has no sense of order. Every token is compared with every other token, and nothing in that operation knows which came first. \"The bank denied the claim\" and \"the claim denied the bank\" would look identical to the mechanism.\n\n" +
        "So position has to be injected. The original transformer added fixed sine and cosine patterns to the token embeddings. Later models learned position embeddings instead.\n\n" +
        "What is used now, and worth naming because it dates your knowledge correctly, is rotary position embedding, RoPE. Instead of adding position to the embedding, it rotates the query and key vectors by an angle that depends on the position. The effect is that the attention score between two tokens naturally depends on how far apart they are, rather than on their absolute positions.\n\n" +
        "That relative property is why RoPE extends to longer contexts better, and why context-extension techniques usually work by scaling its frequencies.",
      points: [
        "Attention is order-blind. Position must be supplied separately.",
        "Original: fixed sinusoidal patterns added to embeddings.",
        "Current: RoPE rotates query and key vectors by a position-dependent angle.",
        "RoPE encodes relative distance, which extends to longer sequences better.",
        "Context extension usually works by scaling RoPE frequencies."
      ],
      say: "Attention compares every token with every other and has no notion of order, so \"the bank denied the claim\" and its reverse would look identical. Position is injected separately. The original used fixed sinusoidal patterns; current models mostly use rotary embeddings, which rotate the query and key vectors by a position-dependent angle so the attention score depends on relative distance. That is why RoPE extends to longer contexts better.",
      numbers: "No number applies. Context-extension methods scale RoPE's frequency base — that is the knob, if the follow-up goes there.",
      wrong: "\"Positional encoding tells the model the position of each word.\" True and circular. The question is why attention needs telling, and the answer is that it is order-blind by construction.",
      follow: "How do models get extended from 8k to 128k context?"
    },

    {
      id: "tf-03",
      q: "What is the KV cache and why does it dominate your memory?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["transformers", "kv-cache", "serving", "memory"],
      why: "The single most operationally useful thing in this topic. It explains your concurrency limit.",
      simple:
        "Generation is one token at a time, and each new token attends to every previous token. Without help, generating token 500 would mean recomputing keys and values for all 499 before it — and then doing it again for token 501.\n\n" +
        "The KV cache stores those keys and values once, so each new token only computes its own and reads the rest. It turns a quadratic amount of repeated work into a linear amount.\n\n" +
        "The cost is memory, and this is the part that matters in production. The cache grows with sequence length, with batch size, and with the number of layers, and it lives on the GPU alongside the weights. Long conversations at high concurrency fill it fast.\n\n" +
        "So the practical consequence: on a serving GPU you usually run out of KV cache memory before you run out of compute. That is why your concurrency limit is what it is, and why techniques like paged attention exist — they manage this memory in blocks instead of reserving a contiguous worst-case slab per request.",
      points: [
        "Stores keys and values for previous tokens so they are computed once.",
        "Turns repeated quadratic work into linear work during decode.",
        "Memory grows with sequence length × batch size × layers.",
        "It usually binds before compute does — that is your concurrency ceiling.",
        "Paged attention allocates it in blocks instead of a worst-case contiguous reservation.",
        "It is also why a long system prompt costs memory on every concurrent request."
      ],
      say: "Each generated token attends to all previous tokens, so without caching we would recompute their keys and values every step. The KV cache stores them once, turning repeated quadratic work into linear. The cost is GPU memory that grows with sequence length, batch size and layers. In serving you normally exhaust KV cache memory before compute, which is what sets your concurrency limit — and why paged attention exists.",
      numbers: "KV cache size ≈ 2 × layers × heads × head_dim × sequence_length × batch × bytes_per_value. Quantising the cache to int8 roughly halves it against fp16.",
      wrong: "\"It caches the previous responses.\" That is a response cache, an entirely different thing at a different layer. This confusion is common and very visible.",
      follow: "You need more concurrent users on the same GPU. What do you change?"
    },

    {
      id: "tf-04",
      q: "Encoder, decoder, encoder-decoder — which is which and why does it matter?",
      round: ["tech1"],
      level: "2-5",
      tags: ["transformers", "architecture", "models"],
      why: "It explains why you use different models for embeddings and for generation.",
      simple:
        "Three shapes, and the difference is what each token is allowed to see.\n\n" +
        "An encoder lets every token see every other token, both directions. That gives a rich representation of a complete input, which is why encoder models like BERT are the basis of embedding and classification models — you have the whole text already and you want to understand it.\n\n" +
        "A decoder is causal: each token can only see tokens before it. That restriction is what makes generation possible, because the model must not see the future it is about to predict. Nearly every model you call through a chat API is decoder-only.\n\n" +
        "Encoder-decoder has both — an encoder that reads the input fully, and a decoder that generates while attending to it. T5 is the familiar one, and translation is the classic use.\n\n" +
        "The practical payoff: this is why your embedding model and your generation model are different architectures, and why you cannot use a chat model's hidden states as embeddings and expect encoder-quality results.",
      points: [
        "Encoder — bidirectional. Understanding: embeddings, classification, reranking.",
        "Decoder — causal, sees only the past. Generation.",
        "Encoder-decoder — reads fully, then generates. Translation, summarisation.",
        "Chat APIs are decoder-only, essentially without exception.",
        "Cross-encoder rerankers are encoders — that is why they read the pair jointly."
      ],
      say: "The difference is what each token can see. An encoder is bidirectional, so every token sees the whole input — that is what embedding, classification and reranking models are built on. A decoder is causal, seeing only previous tokens, which is what makes generation possible, and it is what every chat API model is. Encoder-decoder reads fully then generates. It is why embedding and generation models are different architectures.",
      numbers: "No number applies. The architectural distinction is the answer.",
      wrong: "\"Decoder-only models are just newer and better.\" They are better at generation. Encoders still win at embedding and reranking, which is why both are in your RAG pipeline.",
      follow: "So which architecture is your reranker, and why?"
    },

    {
      id: "tf-05",
      q: "Why is the first token slow and the rest fast?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["transformers", "latency", "inference", "serving"],
      why: "A latency question with a mechanism answer. It is the bridge from architecture to operations.",
      simple:
        "Because two different things are happening, with different bottlenecks.\n\n" +
        "Getting the first token out means processing the entire input — prefill. All input tokens go through the model, and they can be processed in parallel because they are all already known. That is compute-heavy work, and it scales with how much input you sent. A long retrieved context makes the first token slow.\n\n" +
        "After that, each further token is decode. One token at a time, each depending on the last, so nothing can be parallelised within a single request. Here the bottleneck is not compute but memory bandwidth — the GPU spends most of its time moving weights and cache around rather than doing arithmetic.\n\n" +
        "The operational consequence is that long input and long output are separate problems. If time to first token is bad, cut the prompt: fewer chunks, tighter context. If total time is bad, cut the output length or stream so the user starts reading immediately.",
      points: [
        "Prefill — whole input in parallel, compute-bound, sets time to first token.",
        "Decode — one token at a time, memory-bandwidth-bound, sets tokens per second.",
        "Long input hurts first token. Long output hurts total time. Different fixes.",
        "Streaming does not reduce total time; it removes the wait before anything appears.",
        "Prompt caching cuts prefill directly, which is why it improves first-token latency."
      ],
      say: "Two phases with different bottlenecks. Prefill processes the entire input in parallel — compute-bound, and it sets time to first token, so a long retrieved context makes the first token slow. Decode then produces one token at a time, each depending on the last, and is memory-bandwidth-bound, setting tokens per second. So long input and long output are separate problems: trim the prompt for one, stream or shorten output for the other.",
      numbers: "Time to first token is the one users feel. Under about 1 second reads as responsive; past 3 seconds people assume it failed, regardless of total time.",
      wrong: "\"The model warms up.\" There is no warm-up in the request. The two-phase explanation is the actual mechanism, and it points to different fixes.",
      follow: "Your p95 time to first token is 4 seconds. What do you look at?"
    },

    {
      id: "tf-06",
      q: "What is a mixture-of-experts model?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["transformers", "moe", "architecture", "cost"],
      why: "Currency. Several current frontier and open models are MoE, and it explains their odd cost profile.",
      simple:
        "In a normal model, every token passes through every parameter. Bigger model, more compute per token, linearly.\n\n" +
        "A mixture-of-experts model replaces the feed-forward part of each layer with many parallel copies, called experts, plus a small router that picks a couple of them per token. So a model might hold a very large total parameter count but only activate a small fraction for any given token.\n\n" +
        "The result is the trade that makes MoE attractive: the quality that comes with a large parameter count, at the compute cost of a much smaller one.\n\n" +
        "The catch, and the thing worth saying because it is the operational half: all the experts still have to be in memory, because the router might pick any of them. So you get cheap compute and expensive memory. For self-hosting that changes your hardware sizing completely — you size for total parameters, not active ones.",
      points: [
        "Many parallel expert blocks; a router activates only a few per token.",
        "Large total parameters, small active parameters per token.",
        "Compute cost scales with active parameters — that is the win.",
        "Memory must hold all experts — that is the cost.",
        "Self-hosting: size hardware on total parameters, not active ones.",
        "Routing can be uneven, which makes serving throughput less predictable."
      ],
      say: "Instead of every token passing through every parameter, the feed-forward block becomes many parallel experts with a small router that picks a couple per token. So the model has a large total parameter count but only activates a fraction per token, giving large-model quality at small-model compute. The catch is memory — every expert must be resident because the router might pick any. Cheap compute, expensive memory.",
      numbers: "MoE models commonly activate well under a quarter of total parameters per token. Size self-hosted hardware on total parameters; the active count only tells you about compute.",
      wrong: "\"It picks the best expert for the topic.\" Routing is learned and per-token, not semantic — there is no medical expert and legal expert. That framing invites a correction.",
      follow: "How does that change your hardware choice if you self-host?"
    },

    {
      id: "tf-07",
      q: "How do models handle 128k or 1M token contexts if attention is quadratic?",
      round: ["tech2"],
      level: "5-10",
      tags: ["transformers", "long-context", "attention", "advanced"],
      why: "A depth question that separates people who track the field from people who read one blog post.",
      simple:
        "Several things together, and no single trick.\n\n" +
        "The attention computation itself is made memory-efficient rather than algorithmically cheaper — FlashAttention reorganises the work so the full attention matrix is never written to memory. Same maths, far less memory traffic, much faster in practice.\n\n" +
        "Attention patterns get sparser: some layers attend only to a local window, some keep a few global tokens, so not every layer pays the full quadratic price.\n\n" +
        "The KV cache is shrunk architecturally. Grouped-query attention shares key and value heads across several query heads, cutting cache size several-fold, and it is in most current models.\n\n" +
        "Position handling is extended by scaling RoPE frequencies so the model generalises past its training length.\n\n" +
        "Then the honest caveat, which is the part that scores: supporting a long context is not the same as using it well. Accuracy on a fact buried mid-context is measurably worse than at the ends, so a large window is a capability, not a strategy.",
      points: [
        "FlashAttention — same maths, never materialises the attention matrix. Memory-efficient.",
        "Sparse and windowed attention — not every layer pays full cost.",
        "Grouped-query attention — shares KV heads, shrinking the cache several-fold.",
        "RoPE scaling extends usable position range beyond training length.",
        "Supporting long context ≠ using it well. Mid-context recall degrades.",
        "You still pay per token, so a large window is not a cheap window."
      ],
      say: "Several things together. FlashAttention keeps the same maths but never materialises the attention matrix, so it is memory-efficient rather than cheaper. Some layers use windowed or sparse attention. Grouped-query attention shares key and value heads, shrinking the cache. And RoPE scaling extends the position range. But supporting long context is not the same as using it well — mid-context recall measurably degrades, and you still pay per token.",
      numbers: "Grouped-query attention cuts KV cache by the query-to-KV head ratio — commonly 4× to 8×. That is the main reason long context became servable.",
      wrong: "\"They use sparse attention.\" One of four mechanisms, and stopping there misses grouped-query attention, which did more for serving cost than sparsity did.",
      follow: "Given that, would you use a 200k context or retrieval?"
    },

    {
      id: "tf-08",
      q: "Do you need to know this to build GenAI applications?",
      round: ["manager", "tech1"],
      level: "5-10",
      tags: ["transformers", "judgement", "practical"],
      why: "Sometimes asked directly, sometimes implied. The honest answer is more impressive than either extreme.",
      simple:
        "Not for most of the work, and yes for the parts where it matters — and being specific about which is which is the whole answer.\n\n" +
        "You can build a working RAG system, an agent and an evaluation harness without ever thinking about query and key vectors. Most of the job is retrieval quality, prompt discipline, evaluation and operations.\n\n" +
            "Where it does matter: when you are explaining why long context costs what it does, when you are sizing a GPU for self-hosting, when you are debugging why the first token is slow, when you are choosing between grouped-query models for serving cost, or when you are deciding whether a fine-tune can plausibly fix a problem.\n\n" +
        "So the position I would state: I know the mechanism well enough to reason about cost, latency and memory, because those decisions come to me. I do not need to implement attention from scratch, and I have not.\n\n" +
        "That answer is credible. Claiming deep expertise you cannot defend under one follow-up is worse than saying where your depth ends.",
      points: [
        "Most application work does not require it.",
        "It matters for: serving cost, GPU sizing, latency debugging, model choice.",
        "Know it well enough to reason about memory, cost and latency.",
        "Say where your depth ends. It is more credible than overclaiming.",
        "Overclaiming here is easily exposed — the follow-ups in this topic are precise."
      ],
      say: "Not for most of it. A working RAG system, an agent and an evaluation harness need retrieval quality, prompt discipline and operations, not attention internals. It matters when I am sizing a GPU, debugging first-token latency, comparing serving costs or judging whether a fine-tune can fix something. So I know the mechanism well enough to reason about memory, cost and latency, and I have not implemented attention from scratch.",
      numbers: "No number applies. Calibration is what is being marked.",
      wrong: "Either extreme. \"It's essential\" invites a follow-up you may not survive; \"it's irrelevant\" says you cannot reason about serving cost.",
      follow: "Fine — then explain why our inference bill jumped when we increased retrieved chunks."
    }
,

    {
      id: "tf-09",
      q: "Walk me through the shapes in a single attention head.",
      round: ["tech2"],
      level: "5-10",
      tags: ["attention", "transformers", "whiteboard"],
      why: "The whiteboard question. Tracking dimensions end to end proves you understand the mechanism rather than the metaphor.",
      simple:
        "Take a batch of 1, a sequence of 10 tokens, and a model dimension of 512, with 8 heads so each head works in 64 dimensions.\n\n" +
        "    x            (10, 512)     input embeddings\n" +
        "    W_q, W_k, W_v (512, 64)    per-head projections\n\n" +
        "    Q = x @ W_q  (10, 64)\n" +
        "    K = x @ W_k  (10, 64)\n" +
        "    V = x @ W_v  (10, 64)\n\n" +
        "    scores = Q @ K.T          (10, 10)   every token against every token\n" +
        "    scores = scores / sqrt(64)\n" +
        "    scores = scores + mask    (10, 10)   -inf above the diagonal\n" +
        "    weights = softmax(scores, dim=-1)    rows now sum to 1\n" +
        "    out = weights @ V         (10, 64)\n\n" +
        "Then all 8 heads concatenate back to (10, 512) and pass through an output projection.\n\n" +
        "The two shapes that carry the meaning. The (10, 10) score matrix is the attention pattern — row i is how much token i attends to every other token, and this is what gets visualised in those attention heatmaps. It is also where the quadratic cost lives: sequence length squared.\n\n" +
        "And the output being (10, 64) rather than (10, 10) is the point people miss — attention produces a weighted mixture of value vectors, not a similarity score. Each output row is a blend of the V rows, weighted by relevance.\n\n" +
        "Softmax is applied along the last dimension, so each row sums to 1 independently. Getting that axis wrong is a real bug and it trains to something plausible but wrong.",
      points: [
        "Q, K, V are (seq, d_head) after projection from (seq, d_model).",
        "Q @ K.T gives (seq, seq) — this is the quadratic cost.",
        "Mask adds -inf above the diagonal, before softmax.",
        "Softmax along the last axis so each row sums to 1.",
        "Output is (seq, d_head) — a weighted mixture of V, not a score."
      ],
      /* `why` calls this "the whiteboard question" in as many words, and the
         answer is a chain of shapes. Drawing it means the shapes stay in order
         under pressure, which is the whole thing being tested. */
      diagram: {
        kind: "lanes",
        alt: "Shapes through one attention head: input (10,512) projects to Q, K and V at (10,64), scores are (10,10), output is (10,64).",
        lanes: [
          { label: "x", note: "(10, 512)" },
          { label: "Q, K, V", note: "(10, 64) each", accent: "accent" },
          { label: "Q @ K.T", note: "(10, 10) quadratic", accent: "bad" },
          { label: "/ sqrt(64) + mask", note: "-inf above diagonal", accent: "warn" },
          { label: "softmax", note: "last axis, rows sum to 1", accent: "warn" },
          { label: "weights @ V", note: "(10, 64) not (10,10)", accent: "accent" },
          { label: "concat 8 heads", note: "(10, 512)" }
        ],
        caption: "The two shapes that carry the meaning. **(10, 10)** is the attention pattern, and it is where the quadratic cost lives. **(10, 64)** is the output - attention produces a weighted mixture of value vectors, not a similarity score, and that is the step people get wrong. Softmax along the last axis, or you get a bug that trains to something plausible and wrong."
      },
      say: "With sequence 10 and model dimension 512 across 8 heads, each head projects to 64 dimensions, so Q, K and V are each 10 by 64. Q times K transpose gives a 10 by 10 score matrix — that is the attention pattern and where the quadratic cost lives. Scale by root d_k, add the causal mask before softmax, softmax along the last axis, then multiply by V to get 10 by 64. Heads concatenate back to 512.",
      numbers: "d_head is d_model divided by the head count. The (seq, seq) matrix is what makes attention quadratic in sequence length.",
      wrong: "Describing attention as 'tokens looking at each other' with no shapes. The follow-up asks for dimensions, and that is where it falls apart.",
      follow: "Where exactly does the causal mask go, and what breaks if you apply it after softmax?"
    },

    {
      id: "tf-10",
      q: "Why divide by the square root of d_k in scaled dot-product attention?",
      round: ["tech2"],
      level: "5-10",
      tags: ["attention", "theory", "training"],
      why: "A small detail with a real reason. It separates people who read the paper from people who read a blog summary.",
      simple:
        "Without the scaling, training does not work well at larger head dimensions. Here is why.\n\n" +
        "The dot product of two vectors is a sum of d_k products. If the components are roughly independent with unit variance, the variance of that sum grows with d_k — so the dot products get larger in magnitude as the head dimension grows. At d_k = 64 the scores have a standard deviation around 8; at 512 it is around 22.\n\n" +
        "Now feed large-magnitude values into softmax. Softmax exponentiates, so a gap of 20 between the largest score and the rest means the largest gets essentially all the probability. The distribution saturates into a near one-hot vector.\n\n" +
        "That is a problem for training, not just for behaviour. The gradient of softmax in a saturated region is nearly zero, so no learning signal flows back. Attention weights get stuck early and cannot adjust.\n\n" +
        "Dividing by the square root of d_k normalises the variance back to roughly 1, independent of head dimension. The softmax stays in a responsive range, gradients flow, and the same architecture trains at any head size.\n\n" +
        "The elegant part is why it is the square root specifically: variance scales with d_k, standard deviation scales with the square root of d_k, and you are normalising the standard deviation. It falls straight out of the statistics rather than being tuned.\n\n" +
        "This is also a useful thing to connect to temperature — dividing logits by a constant before softmax is exactly what temperature does. The scaling factor is a fixed temperature chosen so the distribution stays trainable.",
      points: [
        "Dot-product variance grows with d_k, so scores grow in magnitude.",
        "Large scores saturate softmax toward one-hot.",
        "Saturated softmax has near-zero gradient — training stalls.",
        "Square root because standard deviation scales with sqrt(d_k).",
        "Mechanically identical to a fixed temperature on the logits."
      ],
      say: "The dot product sums d_k products, so its variance grows with the head dimension and the scores get large. Large scores saturate softmax into a near one-hot distribution, and saturated softmax has almost no gradient, so training stalls. Dividing by the square root of d_k normalises the standard deviation back to about one, keeping softmax responsive at any head size. It is mechanically the same as applying a fixed temperature.",
      numbers: "At d_k = 64, unscaled scores have a standard deviation around 8 — enough for softmax to saturate. Scaling brings it back to roughly 1.",
      wrong: "'To keep the numbers small.' It is the right instinct with no mechanism, and the reason it matters is gradients, not numerical size.",
      follow: "What does this have in common with the temperature parameter?"
    },

    {
      id: "tf-11",
      q: "What are MHA, MQA and GQA, and why did the industry move to GQA?",
      round: ["tech2"],
      level: "5-10",
      tags: ["attention", "kv-cache", "serving"],
      why: "A concrete architecture evolution driven entirely by a serving constraint. It ties theory to production cost.",
      simple:
        "All three are the same attention mechanism differing in how many key and value heads exist relative to query heads.\n\n" +
        "Multi-head attention gives every query head its own K and V. Maximum expressiveness. But the KV cache stores K and V for every head, every layer, every token — and at long context that cache dominates memory, often exceeding the model weights themselves.\n\n" +
        "Multi-query attention goes to the other extreme: all query heads share a single K and V head. The KV cache shrinks by the head count — a 32-head model sees roughly a 32× reduction. Enormous saving, but quality degrades measurably and training can become unstable.\n\n" +
        "Grouped-query attention is the compromise that won. Query heads are split into groups, and each group shares one K and V head. With 32 query heads and 8 groups you get a 4× cache reduction at close to MHA quality.\n\n" +
        "    MHA:  32 query heads, 32 KV heads   full cache\n" +
        "    GQA:  32 query heads,  8 KV heads   4x smaller cache\n" +
        "    MQA:  32 query heads,  1 KV head    32x smaller, quality cost\n\n" +
        "Why this matters commercially: KV cache size directly determines how many concurrent requests fit on a GPU. Shrink the cache 4× and you serve roughly 4× the concurrent users on the same hardware. That is a direct cost-per-request reduction, which is why essentially every recent open model uses GQA.\n\n" +
        "The general lesson worth stating: this architecture change was driven by inference economics, not by a modelling insight. Serving constraints now shape model design.",
      points: [
        "MHA: one KV head per query head — largest cache.",
        "MQA: all query heads share one KV head — smallest, quality cost.",
        "GQA: groups share KV heads — the practical compromise.",
        "Cache size determines concurrent requests per GPU.",
        "Driven by inference economics, not modelling insight."
      ],
      say: "They differ in how many key-value heads exist per query head. MHA gives each query head its own, which maximises the KV cache. MQA shares one across all of them, shrinking the cache by the head count but costing quality. GQA groups query heads to share KV heads — typically 32 query heads over 8 groups for a 4× reduction at close to MHA quality. It matters because cache size sets how many concurrent requests fit on a GPU.",
      numbers: "32 query heads with 8 KV groups is a common configuration — roughly 4× cache reduction, so roughly 4× the concurrent requests on the same hardware.",
      wrong: "Describing them as three equally valid options. GQA won for a specific reason, and not knowing that reason is the gap the question probes.",
      follow: "Your KV cache is still the bottleneck after GQA. What else can you do?"
    },

    {
      id: "tf-12",
      q: "Do the arithmetic: how much memory does the KV cache need?",
      round: ["tech2"],
      level: "5-10",
      tags: ["kv-cache", "serving", "capacity"],
      why: "A capacity-planning question. Candidates who can compute this have actually deployed something.",
      simple:
        "The formula, and it is worth memorising:\n\n" +
        "    2 x layers x kv_heads x d_head x seq_len x bytes_per_value\n\n" +
        "The 2 is for K and V. Everything else is per token, per sequence.\n\n" +
        "Work an example. A 7B-class model: 32 layers, 32 KV heads, d_head 128, FP16 so 2 bytes.\n\n" +
        "    per token = 2 x 32 x 32 x 128 x 2 bytes\n" +
        "              = 524,288 bytes  ~ 0.5 MB per token\n\n" +
        "So a single 8,000-token conversation needs about 4 GB of KV cache. Ten concurrent users at that length is 40 GB — more than the model weights, which are about 14 GB at FP16.\n\n" +
        "That is the punchline: at realistic context lengths and concurrency, the KV cache dominates memory, not the weights. Teams size a GPU for the model and are then surprised they can only serve a handful of users.\n\n" +
        "With GQA at 8 KV heads instead of 32, the same calculation gives about 0.125 MB per token — 1 GB for that conversation instead of 4. Four times the concurrent users on identical hardware, which is exactly why GQA exists.\n\n" +
        "The levers this exposes: GQA or MQA to cut heads, KV cache quantisation to cut bytes per value, shorter contexts, and PagedAttention to stop wasting memory on fragmentation — vLLM's core contribution is allocating cache in pages so you do not reserve worst-case contiguous blocks per request.\n\n" +
        "Being able to run this calculation live is what separates a capacity plan from a guess.",
      points: [
        "2 x layers x kv_heads x d_head x seq_len x bytes.",
        "A 7B model at FP16 is roughly 0.5 MB per token with MHA.",
        "8k context is ~4 GB — one conversation, before concurrency.",
        "At real concurrency the cache exceeds the weights.",
        "Levers: GQA, cache quantisation, shorter context, PagedAttention."
      ],
      say: "It is two times layers times KV heads times head dimension times sequence length times bytes per value. For a 7B model with 32 layers, 32 KV heads and 128 head dimension at FP16, that is about half a megabyte per token — so an 8,000-token conversation is around 4 GB, and ten concurrent users exceed the model weights. That is why GQA matters: dropping to 8 KV heads cuts it fourfold and quadruples concurrency.",
      numbers: "Roughly 0.5 MB per token for a 7B model at FP16 with MHA; about 0.125 MB with 8-group GQA. Model weights are ~2 bytes per parameter.",
      wrong: "Sizing a GPU by model weights alone. It is the most common capacity-planning error and it shows up as far lower concurrency than expected.",
      follow: "You have an 80 GB GPU and a 7B model. How many 8k-context users can you serve?"
    },

    {
      id: "tf-13",
      q: "What is FlashAttention and why does it matter?",
      round: ["tech2"],
      level: "5-10",
      tags: ["attention", "optimisation", "serving"],
      why: "Commonly named and rarely understood. The key insight is that it is exact, not approximate.",
      simple:
        "Standard attention materialises the full sequence-by-sequence score matrix in GPU memory. At 8,000 tokens that is 64 million values per head per layer — written to memory, read back for softmax, written again, read again for the multiply by V.\n\n" +
        "The problem is that GPUs are far faster at arithmetic than at moving data. So attention was bottlenecked on memory bandwidth, not on compute, and the big matrix was mostly being shuffled between fast on-chip SRAM and slower HBM.\n\n" +
        "FlashAttention avoids materialising it. It tiles the computation, loading blocks of Q, K and V into on-chip memory and computing attention block by block, using an online softmax that maintains running maximum and sum statistics so it can produce the correct normalised result without ever holding the full matrix.\n\n" +
        "The critical point, and the one that gets missed: the output is mathematically identical to standard attention. It is not an approximation like sparse or linear attention. Same numbers, fewer memory round trips.\n\n" +
        "The gains are substantial — several times faster and, more importantly, memory that scales linearly with sequence length rather than quadratically. That linear memory scaling is what made long contexts practical. The compute is still quadratic; only the memory is not.\n\n" +
        "Why you should care as an application engineer: it is the reason long-context models are affordable, and it is enabled by default in modern serving stacks. If you self-host and it is not enabled, you are leaving a large multiple of throughput on the table.\n\n" +
        "It is a good example of a broader truth — many deep learning speedups come from respecting the memory hierarchy, not from cleverer mathematics.",
      points: [
        "Standard attention materialises the full (seq, seq) matrix.",
        "The bottleneck is memory bandwidth, not arithmetic.",
        "Tiling plus online softmax avoids materialising it.",
        "Output is exact — not an approximation.",
        "Memory becomes linear in sequence length; compute stays quadratic."
      ],
      say: "Standard attention writes the full sequence-by-sequence matrix to GPU memory and reads it back several times, and the bottleneck is memory bandwidth rather than arithmetic. FlashAttention tiles the computation into on-chip memory and uses an online softmax with running statistics, so it never materialises that matrix. The important part is that the result is exact, not approximate — and memory becomes linear in sequence length, which is what made long context affordable.",
      numbers: "Memory goes from quadratic to linear in sequence length. Compute remains quadratic — FlashAttention is an IO optimisation, not an algorithmic one.",
      wrong: "Calling it an approximate or sparse attention method. It is exact, and that distinction is the entire reason it was adopted universally.",
      follow: "If compute is still quadratic, how do models handle a million-token context?"
    },

    {
      id: "tf-14",
      q: "RoPE against learned and sinusoidal positional encoding — why did RoPE win?",
      round: ["tech2"],
      level: "5-10",
      tags: ["positional-encoding", "long-context", "transformers"],
      why: "Explains how context-length extension is even possible, which is a live production concern.",
      simple:
        "Attention is permutation-invariant — it computes the same thing regardless of token order — so position has to be injected somehow. Three approaches were tried.\n\n" +
        "Sinusoidal encoding adds fixed sine and cosine patterns to the input embeddings. No parameters and it extrapolates in principle, but position is added once at the input and gets diluted through the layers.\n\n" +
        "Learned absolute encoding trains a vector per position. Works well up to the trained length and then stops dead — position 5,000 has no embedding if you trained to 4,096, so extending context requires retraining.\n\n" +
        "RoPE, rotary position embedding, does something different. Instead of adding position to the embedding, it rotates the Q and K vectors by an angle proportional to their position, applied at every attention layer.\n\n" +
        "The elegance is what that rotation does to the dot product. When you take Q at position m against K at position n, the rotations combine so the result depends only on the difference m minus n. Position becomes relative for free, out of the geometry, with no extra parameters and no separate relative-position table.\n\n" +
        "Why that won. Relative position is what actually matters for language — how far apart two tokens are, not their absolute indices. It applies at every layer rather than fading. And crucially, because it is a continuous rotation, you can interpolate: scale the angles down and a model trained at 4k can be adapted to 32k with brief fine-tuning. That is exactly what position interpolation and YaRN do.\n\n" +
        "So RoPE is the reason context-window extension became a cheap fine-tune instead of a retrain, which is a direct production consequence.",
      points: [
        "Attention is permutation-invariant, so position must be injected.",
        "Learned absolute encoding cannot extend past its trained length.",
        "RoPE rotates Q and K by an angle proportional to position.",
        "The dot product then depends only on relative distance.",
        "Continuous rotation allows interpolation — cheap context extension."
      ],
      say: "Attention is permutation-invariant so position has to be injected. Learned absolute embeddings stop working past the trained length, and sinusoidal encoding is added once at the input and dilutes through the layers. RoPE rotates Q and K by an angle proportional to position at every layer, and the rotations combine so the dot product depends only on relative distance. Because it is continuous you can interpolate, which is what makes cheap context extension possible.",
      numbers: "Position interpolation and YaRN scale RoPE angles to extend a 4k-trained model to 32k or beyond with a short fine-tune rather than a retrain.",
      wrong: "'RoPE is just better positional encoding.' The follow-up is why, and relative-distance-from-rotation plus interpolability is the answer.",
      follow: "How would you extend a model trained at 8k to handle 64k?"
    }
  ]
};
