/* Topic 02 — Transformers and attention.
   Grounding: the published architecture, plus what the mechanism forces you to
   know once you care about context limits, latency and serving cost. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["02-transformers"] = {
  lede: "This topic gets asked when the panel wants to know whether you read past the API documentation. The trap is answering like a textbook. Every question here has an operational consequence — why long context costs what it does, why the first token is slow, why your GPU runs out of memory before it runs out of compute — and the consequence is what scores.",
  grounding: "the published architecture + what the mechanism forces you to know operationally",
  evening: ["tf-01", "tf-03", "tf-05", "tf-07"],

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
  ]
};
