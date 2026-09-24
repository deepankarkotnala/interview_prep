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
      "quick": [
        "RNNs read one word at a time, left to right.",
        "So training could not run in parallel.",
        "Early words faded from their single running memory.",
        "Transformers let every word look at every other word at once.",
        "That scaled on GPUs, but cost grows with length squared."
      ],
      "simple": "Before transformers, language models mostly used RNNs and LSTMs, which read text one word at a time and carried a running memory, the hidden state, from step to step. That caused two problems. Training couldn't be parallelised, because step 50 needed step 49, so huge datasets were slow and expensive. And long-range memory was weak, since everything had to squeeze through that one hidden state and faded over distance. For example, a condition in the first paragraph of a long policy document could be lost by the end.\n\nThe transformer removed the recurrence. With self-attention, every token looks directly at every other token, so the whole sequence trains in parallel and word 1 and word 500 are one hop apart. That is what made scaling to billions of parameters possible. The trade-off is that attention cost grows with the square of the length.",
      "points": [
        "RNN/LSTM: one token at a time, memory squeezed into a single hidden state.",
        "Problem 1: sequential - training cannot be parallelised across the sequence.",
        "Problem 2: long-range information and gradients fade, even with LSTM gates.",
        "Transformer: self-attention links every token to every other directly, trained in parallel.",
        "Result: it scales on GPUs to huge data and models.",
        "Cost: quadratic attention; state-space and hybrid models revisit recurrence for long context."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of RNNs and LSTMs with transformers by how they read text, training parallelism, distance between far tokens, and the main cost.",
        "caption": "RNNs pass memory **one step at a time**; attention makes **every token one hop apart** and trains in parallel. That is what let transformers scale on GPUs.",
        "aspects": [
          "Reads text",
          "Training",
          "Word 1 to word 500",
          "Weak spot"
        ],
        "columns": [
          {
            "label": "RNN / LSTM",
            "note": "recurrent",
            "accent": "bad",
            "cells": [
              "One token at a time",
              "Sequential, slow",
              "499 steps, signal fades",
              "Long-range memory"
            ]
          },
          {
            "label": "Transformer",
            "note": "self-attention",
            "accent": "accent",
            "cells": [
              "All tokens at once",
              "Parallel on GPUs",
              "One hop",
              "Quadratic attention cost"
            ]
          }
        ]
      },
      "say": "Two concrete wins. Transformers train in parallel across a sequence, and they link distant tokens directly. RNNs and LSTMs read text one word at a time, carrying everything in a single running memory called a hidden state. Step 50 needed the result of step 49, so one sentence couldn't be spread across thousands of GPU cores. That single hidden state also meant information from far back faded, and so did the training signal, which is the vanishing gradient problem. LSTM gates helped but didn't fully fix it. Picture a long policy document where a condition stated early is lost by the end. Self-attention dropped the recurrence. Every token looks at every other token, so the whole sequence trains in parallel and word one and word five hundred are one hop apart. That's what let models scale. The trade-off is that attention cost grows with the square of the length, which is why recurrent ideas are back in state-space models like Mamba and in hybrids.",
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
      "quick": [
        "Self-attention lets each word pick which other words matter.",
        "Each word makes a query, a key and a value.",
        "Each query is scored against every key to get weights.",
        "The output is a weighted mix of the values.",
        "Several heads run at once, and cost grows with length squared."
      ],
      "simple": "Self-attention is how a model works out which other words matter for understanding the word it is processing. For example, in \"the claim was denied because it was filed late\", to understand \"it\" the model has to look back at \"the claim\".\n\nIt makes three vectors for every token: a query for what the token is looking for, a key for what it offers, and a value for the content it carries. Each token's query is compared with every key, and strong matches get high weights. The output is a weighted mix of the values, so \"it\" ends up carrying information mostly from \"the claim\". Several heads run in parallel, each learning a different kind of relationship.\n\nThe consequence is cost. Because every token looks at every other token, the scores grow with the square of the length, so long context is expensive, not just large.",
      "points": [
        "Query - what this token is looking for. Key - what it offers. Value - what it carries.",
        "Every query is scored against every key; high scores mean high weight.",
        "The output is a weighted mixture of values.",
        "Every token attends to every token, so cost is quadratic in sequence length.",
        "Multi-head means several attentions run in parallel, each learning different relationships."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Each token makes a query, key and value; its query is scored against every key, softmax turns the scores into weights, and the output is a weighted mix of the values.",
        "caption": "**Query asks, key offers, value carries.** Each query is scored against every key, and the output is a weighted mix of values - which is why cost is quadratic.",
        "lanes": [
          {
            "label": "Token",
            "note": "e.g. \"it\""
          },
          {
            "label": "Query, key, value",
            "note": "looks for, offers, carries"
          },
          {
            "label": "Score vs every key",
            "note": "query dot each key",
            "accent": "warn"
          },
          {
            "label": "Softmax",
            "note": "scores become weights"
          },
          {
            "label": "Weighted mix of values",
            "note": "\"it\" leans on \"the claim\"",
            "accent": "accent"
          }
        ]
      },
      "say": "It's how each token decides which other tokens matter for understanding it, and then pulls information from them. For every token the model builds three vectors. The query is what this token is looking for, the key is what it offers, and the value is the content it carries. Each token's query is compared with every token's key, and a strong match means a high weight. The output for that position is a weighted mix of all the values, dominated by the best matches. Take the claim was denied because it was filed late. To make sense of that, the word it has to attend strongly to the claim. Several of these run in parallel as heads, and each learns a different kind of relationship. The part to say out loud is the cost. Because every token looks at every other token, the score computation grows with the square of the sequence length. Double the context and that part roughly quadruples, although the feed-forward layers only grow linearly.",
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
      "quick": [
        "A transformer stacks the same block many times.",
        "Attention lets words share information with each other.",
        "A small network then processes each word on its own.",
        "That part holds about two thirds of the model's numbers.",
        "Add-back links and rescaling keep deep training stable."
      ],
      "simple": "A transformer is the same block stacked many times. For example, Llama 3 8B stacks 32 blocks. Each block has two main parts plus some wiring that keeps training stable.\n\nThe first part is self-attention, where tokens gather information from each other. The second is the feed-forward network, which processes each token on its own by widening the vector, applying a non-linearity and shrinking it back. It holds roughly two thirds of the parameters, and much of the model's stored knowledge seems to live there.\n\nThe wiring is residual connections and layer normalisation. Each part adds its result to its input instead of replacing it, which gives information and gradients a direct path through a deep stack. Normalisation rescales the vector before each part so numbers don't blow up. So one block is normalise, attend, add back, then normalise, feed-forward, add back.",
      "points": [
        "**Attention** - tokens mix information across the sequence.",
        "**FFN / MLP** - per-token processing; holds most of the parameters (about two thirds or more in a dense model).",
        "**Residuals** - `x = x + f(x)`, a direct path that lets deep stacks train.",
        "**LayerNorm / RMSNorm** - keeps activations at a stable scale; modern models use pre-norm.",
        "Modern FFNs often use a gated variant such as SwiGLU; MoE models replace the FFN with experts (tf-06)."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "One pre-norm transformer block: normalise, self-attention, add back to the input, normalise, feed-forward network, add back, repeated many times.",
        "caption": "One block is **normalise, attend, add back; normalise, feed-forward, add back** - stacked dozens of times. The residual path lets deep stacks train.",
        "top": "x in (per token)",
        "bottom": "x out, to next block",
        "layers": [
          {
            "label": "RMSNorm",
            "note": "steady scale"
          },
          {
            "label": "Self-attention",
            "note": "tokens talk to each other",
            "accent": "accent"
          },
          {
            "label": "Add back: x + f(x)",
            "note": "residual path",
            "accent": "warn"
          },
          {
            "label": "RMSNorm",
            "note": "steady scale"
          },
          {
            "label": "Feed-forward (MLP)",
            "note": "per token, ~2/3 of parameters",
            "accent": "accent"
          },
          {
            "label": "Add back: x + f(x)",
            "note": "residual path",
            "accent": "warn"
          }
        ]
      },
      "code": "# One pre-norm decoder block - the pattern most current LLMs use\nx = x + attention(rms_norm(x))     # tokens exchange information\nx = x + feed_forward(rms_norm(x))  # each token processed on its own",
      "say": "Two main parts, attention and a feed-forward network, each wrapped in normalisation and a residual connection, and the model stacks that block many times. Attention lets each token gather information from others, and in a decoder only from earlier ones. The feed-forward network then processes each token on its own. It widens the vector, often about four times, applies a non-linearity and shrinks it back. That part holds roughly two thirds or more of a dense model's parameters, and much of the stored knowledge seems to live there. The residual connection means each part adds its result to its input rather than replacing it. That gives information and gradients a direct path through the stack, which is why very deep models train at all. Normalisation rescales the vector before each part so the numbers don't blow up, and modern models use pre-norm with the cheaper RMSNorm. Llama 3 8B stacks 32 of these blocks at a model dimension of 4096.",
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
      "quick": [
        "Attention alone has no sense of word order.",
        "Swapped sentences would look identical to it.",
        "So position must be added separately.",
        "The original added fixed wave patterns to each word.",
        "Modern models rotate by position, so distance between words counts."
      ],
      "simple": "A model needs positional encoding because attention has no sense of order. It compares every token with every other token, and nothing in that operation knows which came first. For example, \"the bank denied the claim\" and \"the claim denied the bank\" would look identical, even though they mean opposite things.\n\nSo position is injected separately. The original transformer added fixed sine and cosine patterns, and later models learned one vector per position. Most current models use rotary position embedding, or RoPE, which rotates the query and key vectors by an angle that depends on position. The attention score then depends on how far apart two tokens are, not on their absolute positions, which is what matters in language. That is also why RoPE extends to longer contexts better, although extending still needs a short extra training run.",
      "points": [
        "Attention is order-blind. Position must be supplied separately.",
        "Original: fixed sinusoidal patterns added to embeddings.",
        "Current: RoPE rotates query and key vectors by a position-dependent angle.",
        "RoPE encodes relative distance, which extends to longer sequences better.",
        "Context extension usually works by scaling RoPE frequencies."
      ],
      "say": "Because attention is order-blind. It compares every token with every other token, and nothing in that operation knows which came first. The bank denied the claim and the claim denied the bank would look identical to it, even though they mean opposite things. So position has to be injected separately. The original transformer added fixed sine and cosine patterns to the token embeddings, and later models learned a position vector instead. What most current models use is RoPE, rotary position embedding. Rather than adding position to the embedding, it rotates the query and key vectors by an angle that depends on position. The result is that the attention score between two tokens depends on how far apart they are, not on their absolute positions. That relative property is why RoPE extends to longer contexts better. It's also why context-extension methods usually work by scaling RoPE's frequencies, which is the knob to name if the follow-up goes there.",
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
      "quick": [
        "An encoder lets every word see the whole input.",
        "That suits understanding jobs like search and sorting text.",
        "A decoder sees only earlier words, which enables writing.",
        "Chat models are almost all decoder-only.",
        "Encoder-decoder reads fully, then writes, like translation."
      ],
      "simple": "There are three shapes of transformer, and the difference is what each token is allowed to see. An encoder lets every token see every other token in both directions, which gives a rich picture of a complete input, so encoders such as BERT became the basis of embedding, classification and reranking models. A decoder is causal, so each token sees only the tokens before it, which is what makes generation possible, and chat models are almost all decoder-only. An encoder-decoder reads the input fully and then generates while looking back at it, as T5 does for translation.\n\nThis explains why embedding and chat models have traditionally been different architectures. But many top embedding models are now decoder LLMs fine-tuned with contrastive training. For example, Qwen3-Embedding is built this way, so the training objective matters as much as the architecture.",
      "points": [
        "Encoder - bidirectional. Understanding: embeddings, classification, reranking.",
        "Decoder - causal, sees only the past. Generation.",
        "Encoder-decoder - reads fully, then generates. Translation, summarisation.",
        "Chat models with published designs are decoder-only, almost without exception.",
        "Cross-encoder rerankers read query and document jointly; classic ones are BERT-style encoders, newer ones are often fine-tuned decoders."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of encoder, decoder and encoder-decoder models by what each token can see, what they are good at, and an example.",
        "caption": "The difference is **what each token may see**: everything (encoder), only the past (decoder), or read fully then generate (encoder-decoder).",
        "aspects": [
          "Each token sees",
          "Good at",
          "Example"
        ],
        "columns": [
          {
            "label": "Encoder",
            "note": "bidirectional",
            "cells": [
              "Past and future",
              "Embeddings, classification",
              "BERT"
            ]
          },
          {
            "label": "Decoder",
            "note": "causal",
            "accent": "accent",
            "cells": [
              "Only the past",
              "Generation, chat",
              "Chat models"
            ]
          },
          {
            "label": "Encoder-decoder",
            "note": "read, then write",
            "cells": [
              "Full input, then past",
              "Translation, summaries",
              "T5"
            ]
          }
        ]
      },
      "say": "It comes down to what each token is allowed to see, and that's why embedding and chat models have traditionally differed. An encoder is bidirectional. Every token sees the whole input, which gives a rich picture of complete text, so BERT-style encoders became the basis for embeddings, classification and reranking. A decoder is causal. Each token sees only earlier tokens, which is what makes generation possible, because the model mustn't peek at the word it's predicting. The chat models whose designs are public are almost all decoder-only. An encoder-decoder like T5 reads the input fully, then generates while looking back at it, and translation is the classic use. The practical payoff is knowing why raw hidden states from a chat model make poor embeddings. The current caveat is that many top embedding and reranking models are now decoder LLMs fine-tuned with contrastive training, Qwen3-Embedding being one. So the training objective decides as much as the architecture does.",
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
      "quick": [
        "The KV cache stores earlier words' attention work once.",
        "Each new word then computes only its own part.",
        "It grows with length, number of users and layers.",
        "GPU memory runs out before computing power does.",
        "That sets how many users one GPU can serve."
      ],
      "simple": "The model generates one token at a time, and each new token attends to every earlier one. Without help, producing token 500 would mean recomputing the keys and values for all 499 tokens before it. The KV cache stores those keys and values once, so each step computes them only for the new token and reads the rest from the cache.\n\nThe price is GPU memory. The cache grows with sequence length, batch size and the number of layers, and it sits on the GPU next to the weights. For example, a support chatbot with a long policy-heavy system prompt pays for those tokens again for every user it serves at the same time. So on a serving GPU you usually run out of cache memory before compute, and that sets your concurrency limit. PagedAttention and an 8-bit cache help stretch it.",
      "points": [
        "Stores keys and values for previous tokens so they are computed once.",
        "Each decode step computes K and V for one new token instead of the whole prefix.",
        "Memory grows with sequence length × batch size × layers.",
        "It usually binds before compute does - that is your concurrency ceiling.",
        "Paged attention allocates it in blocks instead of a worst-case contiguous reservation.",
        "It is also why a long system prompt costs memory on every concurrent request."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of decoding without and with a KV cache by work per new token, what is stored, and the resulting limit.",
        "caption": "The KV cache **trades memory for compute**: keys and values are computed once. It grows with length x batch x layers, so it usually sets your concurrency ceiling.",
        "aspects": [
          "Per new token",
          "Extra GPU memory",
          "Bottleneck"
        ],
        "columns": [
          {
            "label": "No cache",
            "accent": "bad",
            "cells": [
              "Recompute K, V for all",
              "None",
              "Repeated compute"
            ]
          },
          {
            "label": "KV cache",
            "accent": "accent",
            "cells": [
              "K, V for one token",
              "Length x batch x layers",
              "Memory: concurrency ceiling"
            ]
          }
        ]
      },
      "say": "Every earlier token's keys and values get saved once, so decode never has to recompute them. Each new token attends to everything before it. Without the cache, producing token 500 would mean recomputing keys and values for all 499 earlier tokens, then doing it all again for token 501. With it, each step computes keys and values only for the new token and reads the rest. The price is GPU memory. The cache grows with sequence length, batch size and layer count, and it sits on the GPU next to the weights. Long conversations at high concurrency fill it fast, and a long system prompt costs cache memory on every concurrent request. So on a serving GPU you usually run out of cache before you run out of compute, and that's your concurrency ceiling. It's also why vLLM's PagedAttention exists. It hands out cache in small blocks instead of reserving a worst-case slab per request. And don't confuse it with a response cache, which is a different thing entirely.",
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
      "quick": [
        "The first token needs the whole input read at once.",
        "Long input, like many documents, slows the first token.",
        "Later tokens come one at a time, limited by memory speed.",
        "For a slow start, trim the prompt or reuse cached prompts.",
        "For a slow total, shorten or stream the answer."
      ],
      "simple": "The first token is slow and the rest are fast because two different kinds of work are happening. Getting the first token out means processing the whole input, called prefill. The input tokens are all known, so they run in parallel, but the work is compute-heavy and scales with how much you sent. For example, stuffing twenty retrieved chunks into a RAG prompt is exactly what makes the first token slow.\n\nAfter that comes decode, one token at a time, each depending on the last. Here the bottleneck is memory bandwidth, not compute, because the GPU spends most of its time moving weights and cache around.\n\nSo long input and long output need separate fixes. If time to first token is bad, cut the prompt or use prompt caching. If total time is bad, cut the output or stream it, which removes the blank wait users feel.",
      "points": [
        "Prefill - whole input in parallel, compute-bound, sets time to first token.",
        "Decode - one token at a time, memory-bandwidth-bound, sets tokens per second.",
        "Long input hurts first token. Long output hurts total time. Different fixes.",
        "Streaming does not reduce total time; it removes the wait before anything appears.",
        "Prompt caching cuts prefill directly, which is why it improves first-token latency."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Two latency symptoms: a slow first token caused by long input, fixed by a shorter prompt and caching, and a slow total time caused by long output, fixed by shorter output and streaming.",
        "caption": "**Long input hurts the first token; long output hurts total time.** Diagnose which one users feel before you pick a fix.",
        "aspects": [
          "Phase",
          "Caused by",
          "Fix"
        ],
        "columns": [
          {
            "label": "Slow first token",
            "note": "blank screen",
            "accent": "warn",
            "cells": [
              "Prefill, compute-bound",
              "Long input, big context",
              "Fewer chunks, prompt caching"
            ]
          },
          {
            "label": "Slow total time",
            "note": "long wait to finish",
            "accent": "warn",
            "cells": [
              "Decode, memory-bound",
              "Long output",
              "Shorter output, stream it"
            ]
          }
        ]
      },
      "say": "The first token waits on prefill, and the rest come from decode, which has a different bottleneck. To get that first token out, the model has to process the entire input. Those tokens are all known, so they run in parallel, which is compute-heavy and scales with how much you sent. In a RAG app, stuffing in twenty retrieved chunks is exactly what makes the first token slow. After that, each token is decode, one at a time, because each depends on the last. There the limit is memory bandwidth, since the GPU spends most of its time moving weights and cache rather than doing arithmetic. Nothing is warming up. So long input and long output are separate problems. If time to first token is bad, I trim the prompt, cut chunks and cache the stable prefix. If total time is bad, I shorten the output or stream it. Streaming doesn't reduce total time, but it removes the blank wait before anything appears, and that's the delay users feel.",
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
      "quick": [
        "Each layer has many small networks called experts.",
        "A router picks a few experts for each word.",
        "Huge total size, but little computing per word.",
        "All experts must stay in memory, so size hardware on total.",
        "Experts are not topic specialists."
      ],
      "simple": "In a normal, dense model every token passes through every parameter. A mixture-of-experts, or MoE, model replaces each layer's feed-forward network with many smaller experts, and a small router picks a few of them for each token. So the model holds a huge number of parameters but uses only a small fraction per token, giving quality well above a dense model of the same active size at roughly its compute. For example, DeepSeek-V3 activates about 37 billion of its 671 billion parameters per token.\n\nThe cost is memory. All the experts must sit in memory, because the router might pick any of them, so for self-hosting you size hardware for total parameters, not active ones. And experts are not topic specialists. There is no \"legal expert\" inside, since routing is learned per token and tracks patterns, not subjects.",
      "points": [
        "Many parallel expert blocks; a router activates only a few per token.",
        "Large total parameters, small active parameters per token.",
        "Compute cost scales with active parameters - that is the win.",
        "Memory must hold all experts - that is the cost.",
        "Self-hosting: size hardware on total parameters, not active ones.",
        "Routing can be uneven, which makes serving throughput less predictable."
      ],
      "diagram": {
        "alt": "A token reaches a router, which sends it to a few active experts while most experts sit idle but still occupy memory.",
        "caption": "**Compute scales with active parameters; memory with total.** A router uses a few experts per token, but every expert must sit in memory - size hardware on total.",
        "rows": [
          [
            {
              "id": "t",
              "label": "Token"
            }
          ],
          [
            {
              "id": "r",
              "label": "Router",
              "note": "learned, per token",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "a",
              "label": "A few experts",
              "note": "active: sets compute",
              "accent": "accent"
            },
            {
              "id": "i",
              "label": "All other experts",
              "note": "idle, still in memory",
              "accent": "muted"
            }
          ],
          [
            {
              "id": "o",
              "label": "Combined output"
            }
          ]
        ],
        "edges": [
          {
            "from": "t",
            "to": "r"
          },
          {
            "from": "r",
            "to": "a",
            "label": "picks 1-8"
          },
          {
            "from": "r",
            "to": "i",
            "label": "skipped"
          },
          {
            "from": "a",
            "to": "o"
          }
        ]
      },
      "say": "An MoE model swaps each layer's single feed-forward network for many smaller experts, and a router sends each token to only a few. So the model holds a huge number of parameters but uses a small fraction per token. DeepSeek-V3 activates about 37 billion of its 671 billion, and gpt-oss-120b about 5 billion of 117 billion. The attraction is quality well above a dense model of the same active size, at roughly that smaller model's compute per token. Qwen3's MoE models, Llama 4 and Mixtral use the same idea. The operational catch is memory. Every expert has to stay loaded, because the router might pick any of them, so you get cheap compute and expensive memory. For self-hosting I size hardware on total parameters, not active ones, and expect throughput to be less predictable since routing can be uneven. One myth to avoid is that experts are topic specialists. There's no legal expert. Routing is learned per token and tracks patterns, not subjects.",
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
      "quick": [
        "Scores grow bigger as the vectors get longer.",
        "Big scores make attention put all weight on one word.",
        "Then almost no learning signal flows back.",
        "Dividing by the square root keeps scores near size one.",
        "It comes from the maths, nobody tuned it."
      ],
      "simple": "In attention, each score is a dot product between a query and a key, divided by the square root of d_k, the head dimension. Without that scaling, the scores grow as the vectors get longer, softmax becomes all-or-nothing and training stalls.\n\nThe reason is statistical. A dot product adds up d_k products, so its variance grows with d_k and its standard deviation with the square root of d_k. For example, at d_k = 64 the scores have a standard deviation of about 8. Softmax exponentiates, so big gaps give the top score almost all the probability, and a saturated softmax has a gradient close to zero, so learning stops. Dividing by the square root of d_k brings the variance back to about 1 whatever the head size. Nobody tuned that number, because it falls out of the statistics.",
      "points": [
        "Dot-product variance grows with d_k, so scores grow in magnitude.",
        "Large scores saturate softmax toward one-hot.",
        "Saturated softmax has near-zero gradient - training stalls.",
        "Square root because standard deviation scales with sqrt(d_k).",
        "Mechanically identical to a fixed temperature on the logits."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A causal chain: larger head dimension gives larger dot-product scores, which saturate softmax to near one-hot, which gives near-zero gradients; dividing by the square root of d_k restores unit variance.",
        "caption": "Without scaling, **big scores saturate softmax and gradients vanish**. Dividing by sqrt(d_k) resets the spread to about 1 - a fixed temperature.",
        "lanes": [
          {
            "label": "Larger d_k",
            "note": "e.g. 64 dimensions"
          },
          {
            "label": "Bigger scores",
            "note": "std dev ~8 at 64",
            "accent": "warn"
          },
          {
            "label": "Softmax saturates",
            "note": "near one-hot",
            "accent": "bad"
          },
          {
            "label": "Gradients vanish",
            "note": "training stalls",
            "accent": "bad"
          },
          {
            "label": "Divide by sqrt(d_k)",
            "note": "std dev back to ~1",
            "accent": "accent"
          }
        ]
      },
      "say": "Without it, attention scores grow with the head size, softmax saturates and training stalls. A dot product adds up d_k products. If each term has a variance of about one, the sum has a variance of about d_k, so its standard deviation grows with the square root of d_k. At a head size of 64 that's about 8, which is already big. Softmax exponentiates, so spreads like that hand almost all the weight to one position, and the output goes nearly one-hot. The real damage is to training. A saturated softmax has a gradient close to zero, so almost no learning signal flows back and the attention weights get stuck early. Dividing by the square root of d_k brings the standard deviation back to about one, whatever the head size. Nobody tuned that number. It falls out of the statistics. And dividing logits by a constant before softmax is exactly what temperature does, so this is a fixed temperature, chosen to keep attention trainable.",
      "numbers": "At d_k = 64, unscaled scores have a standard deviation around 8 - enough for softmax to saturate. Scaling brings it back to roughly 1.",
      "wrong": "'To keep the numbers small.' It is the right instinct with no mechanism, and the reason it matters is gradients, not numerical size.",
      "follow": "What does this have in common with the temperature parameter?",
      "followAnswer": "They are the same operation, dividing the logits by a constant before softmax. Sampling temperature divides the output logits, so a value above one flattens the distribution and below one sharpens it. Dividing by the square root of d_k is a fixed temperature inside every attention head, chosen from the statistics so scores keep a standard deviation around one. The difference is purpose. I tune sampling temperature for variety, while the attention scaling stays fixed to keep softmax out of saturation and gradients flowing."
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
      "quick": [
        "Take 10 words, 512 wide, split into 8 heads of 64.",
        "Queries, keys and values are each 10 by 64.",
        "Queries times keys gives a 10 by 10 score grid.",
        "Scale, hide future words, then make each row sum to one.",
        "The output is 10 by 64, a blend of values."
      ],
      "simple": "The easiest way to understand one attention head is to follow the shapes. For example, take 10 tokens, a model dimension of 512 and 8 heads, so each head works in 64 dimensions.\n\nThe 10 by 512 input is projected by three 512 by 64 matrices into queries, keys and values, each 10 by 64. Q times K transposed gives a 10 by 10 score matrix, where every token is scored against every token. You divide by the square root of 64, apply the causal mask and a softmax so each row sums to 1, then multiply by V to get a 10 by 64 output. The 8 heads are joined back to 10 by 512.\n\nThe 10 by 10 matrix is the attention pattern, and it is where the quadratic cost lives. The output is a weighted mix of value vectors, not a similarity score.",
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
      "say": "Take ten tokens, a model dimension of 512 and eight heads, so each head works in 64 dimensions. The input is ten by 512. Each head projects it with three 512 by 64 matrices, giving Q, K and V at ten by 64 each. Q times K transposed gives a ten by ten score matrix, every token scored with every token. That's the attention pattern a heatmap shows, and it's where the quadratic cost lives. Next I divide by the square root of 64, add minus infinity above the diagonal for the causal mask, and softmax along the last axis, so each row sums to one. Get that axis wrong and the model still trains, just to something plausible but wrong. Then the weights times V gives ten by 64, not ten by ten, which is the bit people miss. Attention outputs a blend of value vectors, not a similarity score. Finally the eight heads are joined back to ten by 512 and go through an output projection.",
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
      "quick": [
        "All three are the same attention, sharing keys differently.",
        "MHA gives every head its own keys, the biggest memory.",
        "MQA shares one set, tiny memory but lower quality.",
        "GQA shares within groups, the middle ground.",
        "Smaller memory means more users per GPU, so GQA won."
      ],
      "simple": "MHA, MQA and GQA are the same attention mechanism. They differ only in how many key and value heads are shared between query heads, and that decides the size of the KV cache.\n\nMulti-head attention gives every query head its own keys and values, which is the most expressive but makes the cache huge at long context. Multi-query attention has all query heads share one key and value head, which shrinks the cache by the head count but costs quality. Grouped-query attention is the compromise that won, with query heads split into groups that each share one key and value head. For example, 32 query heads with 8 KV heads gives a cache about 4 times smaller at close to full quality, so up to four times the users on the same GPU. The move was driven by serving cost, not a modelling insight.",
      "points": [
        "MHA: one KV head per query head - largest cache.",
        "MQA: all query heads share one KV head - smallest, quality cost.",
        "GQA: groups share KV heads - the practical compromise.",
        "Beyond GQA: DeepSeek's multi-head latent attention (MLA) compresses K and V into a small latent vector.",
        "Cache size determines concurrent requests per GPU.",
        "Driven by inference economics, not modelling insight."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of multi-head, grouped-query and multi-query attention by how KV heads are shared, cache size and quality.",
        "caption": "All three are the same attention; they differ in **how many KV heads are shared**. GQA is the compromise that won, because cache size sets requests per GPU.",
        "aspects": [
          "KV heads",
          "Cache (32 heads)",
          "Quality"
        ],
        "columns": [
          {
            "label": "MHA",
            "note": "one KV per query head",
            "accent": "bad",
            "cells": [
              "32",
              "Largest",
              "Best"
            ]
          },
          {
            "label": "GQA",
            "note": "groups share KV",
            "accent": "accent",
            "cells": [
              "e.g. 8 groups",
              "~4x smaller",
              "Near MHA"
            ]
          },
          {
            "label": "MQA",
            "note": "all share one",
            "accent": "warn",
            "cells": [
              "1",
              "~32x smaller",
              "Measurable drop"
            ]
          }
        ]
      },
      "say": "All three are the same attention, differing only in how many key-value heads are shared, which sets the KV cache size. In multi-head attention every query head has its own keys and values. It's the most expressive, but the cache stores all of them for every layer and token, and at long context it can outgrow the weights. Multi-query attention goes to the other extreme, with one key-value head for all query heads. A 32-head model's cache gets about 32 times smaller, but quality drops measurably and training can be less stable. Grouped-query attention is the compromise that won. Query heads are split into groups that each share one key-value head, so 32 query heads over 8 key-value heads gives a four times smaller cache at close to full quality. Cache size decides how many requests fit on a GPU, so when memory is the limit you serve up to about four times the users. The lesson is that serving cost drove this change, not a modelling insight.",
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
      "quick": [
        "Multiply two, layers, key heads, head size, length and bytes.",
        "A 7B model needs about half a megabyte per word.",
        "One long chat of 8,000 pieces needs about 4 GB.",
        "Ten users need 40 GB, far more than the 14 GB model.",
        "Fewer key heads, smaller numbers and shorter chats shrink it."
      ],
      "simple": "The KV cache formula is 2 times layers times KV heads times head size times sequence length times bytes per value, multiplied by the batch size. The 2 is there because you store both keys and values.\n\nFor example, a Llama-2-7B-shaped model has 32 layers, 32 KV heads and a head size of 128, in FP16 at 2 bytes. That is about 0.5 MB per token, so one 8,000-token conversation needs about 4 GB and ten users need about 40 GB, while the weights are only about 14 GB. So the cache dominates memory, not the weights, and teams that size a GPU for the model find they can serve only a handful of users. Switching to GQA with 8 KV heads cuts it to about 1 GB per conversation. The other levers are an FP8 cache, shorter context and PagedAttention.",
      "points": [
        "2 x layers x kv_heads x d_head x seq_len x bytes.",
        "A 7B model at FP16 is roughly 0.5 MB per token with MHA.",
        "8k context is ~4 GB - one conversation, before concurrency.",
        "At real concurrency the cache exceeds the weights.",
        "Levers: GQA, cache quantisation, shorter context, PagedAttention."
      ],
      "say": "Two, for keys and values, times layers, times KV heads, times head size, times tokens, times bytes per value, then times the number of concurrent requests. Take a 7B model shaped like Llama 2, with 32 layers, 32 KV heads and a head size of 128, stored in FP16 at two bytes. That's about half a megabyte per token. One 8,000-token conversation needs around 4 gigabytes of cache, and ten users at that length need about 40. The weights themselves are only about 14 gigabytes. That's the surprise for teams who size a GPU for the model and then find they can serve only a handful of users. On an 80 gigabyte card, after weights and some headroom, that's roughly fourteen such conversations. Switch to grouped-query attention with 8 KV heads, as Llama 3 8B does, and the same sum gives about a quarter, so up to four times the users. The other levers are an FP8 cache, shorter context and PagedAttention to avoid fragmentation.",
      "numbers": "Roughly 0.5 MB per token for a 7B model at FP16 with MHA; about 0.125 MB with 8-group GQA. Model weights are ~2 bytes per parameter.",
      "wrong": "Sizing a GPU by model weights alone. It is the most common capacity-planning error and it shows up as far lower concurrency than expected.",
      "follow": "You have an 80 GB GPU and a 7B model. How many 8k-context users can you serve?",
      "followAnswer": "Weights take about 14 GB at FP16. I leave roughly 10 percent headroom for activations and the runtime, so about 58 GB is left for cache. With full multi-head attention at about 4 GB per 8k conversation, that is around 14 users. With an 8-KV-head GQA model it is about 1 GB each, so around 58. An FP8 cache roughly doubles either number."
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
      "quick": [
        "Several tricks work together, not one fix.",
        "FlashAttention does exact attention with far less memory traffic.",
        "Some layers only look at recent words.",
        "Shared key heads shrink memory, and stretched positions reach further.",
        "Supporting long text is not using it well, and it costs."
      ],
      "simple": "Models handle very long contexts with several mechanisms working together, each attacking a different cost. FlashAttention never writes the full attention matrix to GPU memory, so it is much faster, although the maths is still quadratic. Some layers look only at a local window of recent tokens, so not every layer pays the full price. Grouped-query attention shrinks the KV cache, commonly 4 to 8 times, and scaling RoPE lets the model work past its training length after a short extra training run.\n\nBut supporting a long context is not the same as using it well. Many models recall a fact in the middle less reliably than one near the start or end. For example, a clause halfway through a long contract may be missed even though the whole contract fits. So a large window is a capability, not a strategy, and you still pay for every token.",
      "points": [
        "FlashAttention - same maths, never materialises the attention matrix. Memory-efficient.",
        "Sliding-window and sparse attention - not every layer pays full cost.",
        "Hybrid models mix a few full-attention layers with linear-time layers (state-space or linear attention).",
        "Grouped-query attention - shares KV heads, shrinking the cache several-fold.",
        "RoPE scaling extends usable position range beyond training length.",
        "Supporting long context ≠ using it well. Mid-context recall can degrade.",
        "You still pay per token, so a large window is not a cheap window."
      ],
      "say": "No single trick. Several mechanisms stack, and each attacks a different cost. FlashAttention computes exact attention without ever writing the full score matrix to memory, so it's far faster, but the arithmetic is still quadratic. Cheaper attention patterns come next. Some layers look only at a local window of recent tokens, with a few keeping full attention, and newer hybrid models replace most attention layers with linear-time ones. Then the KV cache gets smaller. Grouped-query attention shares key-value heads, typically cutting the cache four to eight times, and that did more for serving cost than sparsity did. Finally, scaling RoPE's frequencies lets a model work past its training length after a short extra training run. The part that scores is the caveat. Supporting a long context isn't the same as using it well. A clause buried halfway through a long contract is often recalled less reliably than one near the start or end. So a big window is a capability, not a strategy, and you still pay for every token.",
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
      "quick": [
        "FlashAttention gives the exact same result as normal attention.",
        "It works in small blocks inside fast chip memory.",
        "The huge score grid is never written out.",
        "It runs several times faster with far less memory.",
        "The maths still grows with length squared."
      ],
      "simple": "FlashAttention computes exactly the same attention as the standard method, but in small tiles that stay in fast on-chip memory, so the huge score matrix is never stored.\n\nStandard attention builds the full sequence-by-sequence score matrix in GPU memory. For example, at 8,000 tokens that is 64 million values per head, per layer, shuffled back and forth between the small fast on-chip memory and the large slow main memory. Since GPUs do arithmetic far faster than they move data, bandwidth is the bottleneck. FlashAttention loads small blocks of Q, K and V and computes attention block by block, with a running softmax so the result is still correctly normalised. It is not an approximation, just the same numbers with fewer trips to memory.\n\nAttention runs several times faster and its extra memory grows linearly, but the compute is still quadratic.",
      "points": [
        "Standard attention materialises the full (seq, seq) matrix.",
        "The bottleneck is memory bandwidth, not arithmetic.",
        "Tiling plus online softmax avoids materialising it.",
        "Output is exact - not an approximation.",
        "Memory becomes linear in sequence length; compute stays quadratic."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of standard attention and FlashAttention by whether the full score matrix is stored, where work happens, memory growth, compute and exactness.",
        "caption": "FlashAttention is **the same maths with fewer trips to memory**: tiles stay in fast SRAM, so memory goes linear while compute stays quadratic. Exact, not approximate.",
        "aspects": [
          "Score matrix",
          "Works in",
          "Memory",
          "Compute",
          "Output"
        ],
        "columns": [
          {
            "label": "Standard",
            "accent": "bad",
            "cells": [
              "Full (seq, seq) stored",
              "Slow HBM, many trips",
              "Quadratic",
              "Quadratic",
              "Exact"
            ]
          },
          {
            "label": "FlashAttention",
            "note": "tiles + online softmax",
            "accent": "accent",
            "cells": [
              "Never materialised",
              "Fast on-chip SRAM",
              "Linear",
              "Still quadratic",
              "Exact, same numbers"
            ]
          }
        ]
      },
      "say": "FlashAttention gives exactly the same attention, just computed in small tiles that stay in fast on-chip memory, so the huge score matrix is never stored. Standard attention builds the full sequence-by-sequence matrix in GPU main memory. At 8,000 tokens that's 64 million values per head, per layer, written out, read back for softmax, then written and read again to multiply by V. GPUs do arithmetic far faster than they move data, so most of the time goes on that shuffling. FlashAttention loads small blocks of Q, K and V into on-chip SRAM and works block by block. An online softmax keeps a running maximum and sum, so the final result is still correctly normalised. It isn't an approximation like sparse attention, and the output matches apart from tiny rounding. Attention runs several times faster and its extra memory grows linearly with length. Compute stays quadratic, because this is an IO optimisation, not a new algorithm. It's also a big reason long context became affordable.",
      "numbers": "Memory goes from quadratic to linear in sequence length. Compute remains quadratic - FlashAttention is an IO optimisation, not an algorithmic one.",
      "wrong": "Calling it an approximate or sparse attention method. It is exact, and that distinction is the entire reason it was adopted universally.",
      "follow": "If compute is still quadratic, how do models handle a million-token context?",
      "followAnswer": "By combining several things: FlashAttention for memory, grouped-query or latent attention to shrink the cache, sliding-window or linear-time layers so most layers are not quadratic, and RoPE scaling for positions. Serving also splits very long sequences across GPUs. Even then it is expensive and slow, and recall in the middle can weaken, so retrieval is usually still cheaper."
    },
    {
      "id": "tf-14",
      "q": "RoPE vs learned and sinusoidal positional encoding - why did RoPE win?",
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
      "quick": [
        "RoPE rotates queries and keys by position in every layer.",
        "Scores then depend only on the distance between words.",
        "Learned positions stop dead past the trained length.",
        "Fixed wave patterns also work poorly past it.",
        "Shrinking the angles stretches 4k to 32k with short training."
      ],
      "simple": "Attention ignores word order, so position has to be added somehow. Sinusoidal encoding adds fixed sine and cosine patterns once at the input and works poorly past the trained length. Learned absolute encoding trains one vector per position and stops dead at the trained length. For example, if you trained to 4,096 tokens, position 5,000 simply has no vector.\n\nRoPE, rotary position embedding, rotates the query and key vectors by angles that depend on position, in every layer. When a query at position m meets a key at position n, the rotations combine, so the score depends only on the distance between them. Position becomes relative for free.\n\nThat is why it won. And because rotation is continuous, you can shrink the angles and adapt a model trained at 4k to 32k with a short fine-tune, instead of a full retrain.",
      "points": [
        "Attention is permutation-invariant, so position must be injected.",
        "Learned absolute encoding cannot extend past its trained length.",
        "RoPE rotates Q and K by an angle proportional to position.",
        "The dot product then depends only on relative distance.",
        "Continuous rotation allows interpolation - cheap context extension."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of sinusoidal, learned absolute and rotary position encoding by how position is added, where, and what happens past the trained length.",
        "caption": "**RoPE rotates Q and K, so the score depends only on distance.** Continuous rotation allows interpolation: context extension becomes a short fine-tune, not a retrain.",
        "aspects": [
          "How",
          "Where",
          "Position type",
          "Past trained length"
        ],
        "columns": [
          {
            "label": "Sinusoidal",
            "note": "original paper",
            "cells": [
              "Fixed sine patterns added",
              "Input only",
              "Absolute",
              "Works poorly"
            ]
          },
          {
            "label": "Learned absolute",
            "accent": "bad",
            "cells": [
              "One vector per position",
              "Input only",
              "Absolute",
              "Stops dead: retrain"
            ]
          },
          {
            "label": "RoPE",
            "note": "rotary",
            "accent": "accent",
            "cells": [
              "Rotate Q and K",
              "Every attention layer",
              "Relative distance",
              "Interpolate, short fine-tune"
            ]
          }
        ]
      },
      "say": "RoPE puts position into the attention score itself as relative distance, and that made context extension cheap. Sinusoidal encoding adds fixed patterns once, at the input, and in practice it works poorly past the trained length. Learned absolute encoding trains one vector per position, so it stops dead. Train to 4,096 and position 5,000 simply has no vector, which means retraining for a longer context. RoPE rotates the query and key vectors by an angle proportional to position, in every attention layer. When a query at one position meets a key at another, the rotations combine, so the position part of the score depends only on the distance between them. You get relative position for free, with no extra parameters, and it doesn't fade with depth. Because rotation is continuous, you can also shrink the angles and interpolate. Position interpolation and YaRN do exactly that, adapting a model trained at 4k to 32k with a short fine-tune. So RoPE turned context extension from a retrain into a cheap fine-tune.",
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
      "quick": [
        "Not for most application work.",
        "It matters for cost, GPU sizing and slow answers.",
        "Know enough to reason about memory, cost and speed.",
        "You need not build attention from scratch.",
        "Say honestly where your depth ends."
      ],
      "simple": "For most GenAI application work you don't need deep transformer internals, but for some specific decisions you do. You can build a working RAG system, an agent and an evaluation harness without thinking about query and key vectors, because most of that job is retrieval, prompts, evaluation and operations.\n\nThe internals matter where cost, latency and memory come in, such as explaining why long context is expensive, sizing a GPU for self-hosting or debugging a slow first token. For example, if the inference bill jumps after the team adds more retrieved chunks, knowing how prefill and the KV cache scale lets you explain and fix it quickly.\n\nSo the calibrated answer is that I know the mechanism well enough to reason about those decisions, without claiming I could implement attention from scratch. Overclaiming is easily exposed here.",
      "points": [
        "Most application work does not require it.",
        "It matters for: serving cost, GPU sizing, latency debugging, model choice.",
        "Know it well enough to reason about memory, cost and latency.",
        "Say where your depth ends. It is more credible than overclaiming.",
        "Overclaiming here is easily exposed - the follow-ups in this topic are precise."
      ],
      "say": "Not for most of the work, but yes for specific decisions, and being precise about which is the real answer. I can build a RAG system, an agent and an evaluation harness without thinking about query and key vectors. That work is mostly retrieval quality, clear prompts, evaluation and operations. The internals matter where cost, latency and memory come in. I need them to size a GPU for self-hosting, to explain why the inference bill jumped when we added retrieved chunks, or to debug a slow first token. They also help when comparing models' attention designs for serving cost, or judging whether a fine-tune can plausibly fix a problem. So I know the mechanism well enough to reason about those calls, because they land on my desk. I don't need to implement attention from scratch to make them. And I'd rather say honestly where my depth ends than claim expertise I can't defend under one follow-up.",
      "numbers": "No number applies. Calibration is what is being marked.",
      "wrong": "Either extreme. \"It's essential\" invites precise follow-ups on shapes and memory; \"it's irrelevant\" says you cannot reason about serving cost.",
      "follow": "Fine - then explain why our inference bill jumped when we increased retrieved chunks.",
      "followAnswer": "Because every extra chunk adds input tokens, and we pay for every one on every call. Going from five chunks to twenty chunks of around 500 tokens each adds thousands of tokens per request, often more than the question and answer combined, so input cost multiplies. It also lengthens prefill, so time to first token rises. I would measure answer quality at different chunk counts, rerank to keep the best few, and keep the stable instructions ahead of the retrieved context so they can be cached."
    }
  ]
};
