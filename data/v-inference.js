/* Visual explanation: how a model server turns a prompt into a stream of tokens.
   Drawn by assets/visual.js - scene format in README.md. Numbers are illustrative
   but consistent: an 8B model (Llama-3-8B-like: 32 layers, 8 KV heads, head size
   128) in 16-bit on one 80 GB GPU, so the KV cache is about 128 KB per token. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
(function () {
  /* KV cache blocks: 1 = request A, 0.45 = other requests, 0.06 = free. */
  function blocks(a, others) {
    var v = [];
    for (var i = 0; i < 20; i++) v.push(a.indexOf(i) >= 0 ? 1 : (others.indexOf(i) >= 0 ? 0.45 : 0.06));
    return v;
  }
  var A = [0, 1, 2, 3, 4, 5, 6, 7];
  function mem(kv, kvText, free, freeText) {
    return [{ label: "weights", value: 0.2, text: "16 GB" }, { label: "KV cache", value: kv, text: kvText }, { label: "free", value: free, text: freeText }];
  }
  function metrics(t, p, q) {
    return [
      { label: "TTFT", value: t ? 0.35 : 0, text: t ? "350 ms" : "-" },
      { label: "per token", value: p ? 0.25 : 0, text: p ? "25 ms" : "-" },
      { label: "throughput", value: q ? 0.7 : 0, text: q ? "2,000 tok/s" : "-" }
    ];
  }

  window.IR.v["inference"] = {
    view: [1290, 650],

    zones: [
      { id: "z-gpu", x: 290, y: 30, w: 640, h: 490, label: "One GPU - 80 GB of memory", tone: "neutral" }
    ],

    parts: [
      { id: "queue", kind: "tokens", dir: "col", x: 30, y: 74, w: 220, label: "Request queue", tone: "input", concept: "queue",
        items: ["A · 1,000 tokens", "B · 300 tokens", "C · 2,400 tokens"] },
      { id: "sched", kind: "box", x: 30, y: 262, w: 220, h: 80, label: "Scheduler", sub: "continuous batching", icon: "list", tone: "neutral", concept: "batching" },

      { id: "weights", kind: "stack", x: 320, y: 86, w: 250, h: 76, count: 3, label: "Model weights", sub: "8B parameters ≈ 16 GB", tone: "model", concept: "weights" },
      { id: "prefill", kind: "box", x: 320, y: 220, w: 250, h: 80, label: "Prefill", sub: "all 1,000 prompt tokens at once", icon: "bolt", tone: "model", concept: "prefill" },
      { id: "decode", kind: "box", x: 320, y: 360, w: 250, h: 80, label: "Decode", sub: "one new token per step", icon: "loop", tone: "model", concept: "decode" },

      { id: "memory", kind: "bars", x: 610, y: 84, w: 300, lw: 80, label: "GPU memory", tone: "neutral", concept: "memory", items: mem(0, "0 GB", 0.8, "64 GB") },
      { id: "paged", kind: "box", shape: "pill", x: 610, y: 186, w: 300, h: 30, label: "Paged blocks", tone: "data", concept: "paged" },
      { id: "kv", kind: "vector", x: 610, y: 252, cell: 13, values: blocks([], []), label: "KV cache - one cell per block", tone: "data", concept: "kvcache" },
      { id: "bandwidth", kind: "box", x: 610, y: 430, w: 300, h: 66, label: "Memory bandwidth", sub: "decode re-reads the weights every step", icon: "gauge", tone: "neutral", concept: "bandwidth" },

      { id: "metrics", kind: "bars", x: 960, y: 84, w: 306, lw: 90, fmt: "raw", label: "What the user feels", tone: "output", concept: "metrics", items: metrics(0, 0, 0) },
      { id: "stream", kind: "msg", x: 960, y: 230, w: 306, role: "Streamed answer", text: "Here", tone: "output", hidden: true, concept: "stream" },
      { id: "stop", kind: "box", x: 960, y: 420, w: 306, h: 66, label: "Stop and free", sub: "end token or max_tokens", icon: "stop", tone: "guard", concept: "stop" },

      { id: "prefix", kind: "box", x: 300, y: 550, w: 300, h: 80, label: "Prefix caching", sub: "reuse the cache of a shared system prompt", icon: "memory", tone: "data", concept: "prefix" },
      { id: "quant", kind: "box", x: 630, y: 550, w: 300, h: 80, label: "Quantisation", sub: "smaller weights and cache: 8-bit, 4-bit", icon: "ruler", tone: "model", concept: "quant" },
      { id: "spec", kind: "box", x: 960, y: 550, w: 306, h: 80, label: "Speculative decoding", sub: "a small model drafts, the big one checks", icon: "bolt", tone: "model", concept: "spec" }
    ],

    links: [
      { id: "l-queue-sched", from: "queue:b", to: "sched:t", style: "straight", tone: "input" },
      { id: "l-sched-prefill", from: "sched:r", to: "prefill:l", tone: "neutral" },
      { id: "l-prefill-kv", from: "prefill:r", to: "kv:l", tone: "data" },
      { id: "l-prefill-decode", from: "prefill:b", to: "decode:t", style: "straight", tone: "model" },
      { id: "l-decode-kv", from: "decode:r:0.25", to: "kv:b:0.3", tone: "data", label: "read + append", labelAt: 0.55 },
      { id: "l-decode-out", from: "decode:r:0.75", to: "stream:l:0.5", tone: "output" }
    ],

    steps: [
      { title: "Two phases: prefill, then decode",
        text: "A model server answers in two phases: prefill reads the whole prompt at once, then decode writes the answer one token at a time. Follow one 1,000-token request through a single GPU." },
      { title: "Requests wait in a queue",
        text: "Requests from many users arrive at the server and wait their turn. Request **A** has a 1,000-token prompt: a document plus a question.",
        focus: ["queue"], hl: { queue: [0] } },
      { title: "Continuous batching",
        text: "The scheduler runs many requests together on the GPU. With continuous batching, a new request joins the running batch between decode steps instead of waiting for the whole batch to finish.",
        focus: ["queue", "sched"], flow: ["l-queue-sched"], hl: { queue: [0, 1, 2] }, packets: [{ on: "l-queue-sched" }] },
      { title: "The weights live in GPU memory",
        text: "An 8-billion-parameter model at 2 bytes per parameter takes about 16 GB of GPU memory. Every request shares the same weights; the rest of the memory is for the KV cache.",
        focus: ["weights", "memory"], hl: { memory: [0] } },
      { title: "Prefill reads the prompt at once",
        text: "All 1,000 prompt tokens go through the model in one parallel pass. That is big matrix maths, so prefill is limited by the GPU's compute, and its time grows with prompt length.",
        focus: ["sched", "prefill", "weights"], flow: ["l-sched-prefill"], packets: [{ on: "l-sched-prefill", text: "1,000 tokens" }] },
      { title: "Fill the KV cache",
        text: "During prefill, every layer's keys and values for every prompt token are saved in the KV cache: about 128 KB per token here, so 128 MB for this prompt.",
        focus: ["prefill", "kv", "memory"], flow: ["l-prefill-kv"], hl: { memory: [1] },
        packets: [{ on: "l-prefill-kv" }],
        set: { kv: { values: blocks(A, [8, 9, 10]) }, memory: { items: mem(0.04, "3 GB", 0.76, "61 GB") } } },
      { title: "The first token: TTFT",
        text: "Prefill ends by producing the first output token. **Time to first token** is mostly queueing plus prefill, which is why long prompts feel slow to start.",
        focus: ["prefill", "metrics", "stream"], hl: { metrics: [0] },
        set: { stream: { hidden: false }, metrics: { items: metrics(1, 0, 0) } } },
      { title: "Decode: one token per step",
        text: "Now only the newest token runs through the model. Attention reads the earlier keys and values from the cache instead of recomputing them, appends the new token's K and V, and streams the token out.",
        focus: ["decode", "kv", "stream"], flow: ["l-prefill-decode", "l-decode-kv", "l-decode-out"],
        packets: [{ on: "l-prefill-decode" }, { on: "l-decode-kv", text: "read" }, { on: "l-decode-out", text: "token" }],
        set: { kv: { values: blocks(A.concat([11]), [8, 9, 10]) }, stream: { text: "Here are the three key points" } } },
      { title: "Decode is limited by memory speed",
        text: "Each decode step re-reads all 16 GB of weights to produce one token per request. Memory bandwidth, not compute, sets the pace - so batching many requests shares that read and raises throughput.",
        focus: ["decode", "bandwidth", "weights", "metrics"], hl: { metrics: [1, 2] },
        set: { metrics: { items: metrics(1, 1, 1) } } },
      { title: "The cache fills the GPU",
        text: "Every running request keeps growing its cache. Blocks are handed out in fixed-size pages, so nothing is wasted - but memory, not compute, caps how many requests fit at once.",
        focus: ["kv", "paged", "memory"], hl: { memory: [1, 2] },
        set: { kv: { values: blocks(A.concat([11, 19]), [8, 9, 10, 12, 13, 14, 15, 16, 17, 18]) }, memory: { items: mem(0.72, "58 GB", 0.08, "6 GB") } } },
      { title: "Stop and free the blocks",
        text: "Request A ends when the model emits an end token or hits **max_tokens**. Its cache blocks go back to the pool, and a waiting request can start straight away.",
        focus: ["stop", "kv", "stream", "memory"], hl: { memory: [2] },
        set: { kv: { values: blocks([], [8, 9, 10, 12, 13, 14, 15, 16, 17, 18]) }, memory: { items: mem(0.6, "48 GB", 0.2, "16 GB") },
          stream: { text: "Here are the three key points of the contract: notice period, renewal date and penalties." } } },
      { title: "Levers to go faster",
        text: "Prefix caching reuses the cache of a shared system prompt. Quantisation shrinks weights and cache. Speculative decoding lets a small model draft tokens that the big model checks in one pass.",
        focus: ["prefix", "quant", "spec"] }
    ],

    concepts: {
      queue: {
        title: "Request queue",
        tip: "Requests from many users wait here for GPU time. Time spent waiting counts towards how slow the first token feels.",
        detail: [
          "A model server handles many users at once. Requests arrive - A with a 1,000-token prompt, B with 300, C with 2,400 - and wait until the scheduler can fit them onto the GPU.",
          "Queueing time is invisible in benchmarks but very visible to users: if the GPU is full, the first token is late even though the model itself is fast. Watch queue length and wait time in production.",
          "When load is high you can add GPUs, limit prompt or output length, or route lower-priority traffic to a batch API that runs later at lower cost."
        ],
        oneLiner: "Requests queue for GPU time, and queueing delay adds directly to time to first token, so it must be monitored separately from model speed."
      },
      batching: {
        title: "Continuous batching",
        tip: "The scheduler runs many requests together and lets new ones join between decode steps, instead of waiting for a whole batch to finish.",
        detail: [
          "GPUs are most efficient when they process many requests at once, because they read the weights once per step for the whole batch. So the scheduler groups requests into a batch.",
          "Old-style static batching waited until every request in a batch finished before starting the next one, so one long answer held everyone up. Continuous batching (also called in-flight batching) adds and removes requests at every decode step.",
          "Servers such as vLLM, TGI and TensorRT-LLM do this by default. It is one of the biggest reasons modern serving gets several times more throughput from the same GPU."
        ],
        oneLiner: "Continuous batching adds and removes requests at every decode step, keeping the GPU full and raising throughput without making short requests wait for long ones."
      },
      weights: {
        title: "Model weights",
        tip: "The model's parameters, held in GPU memory: about 2 bytes each at 16-bit, so roughly 16 GB for an 8B model.",
        detail: [
          "The weights are the billions of numbers that make up the model. At 16-bit precision each takes 2 bytes, so an 8-billion-parameter model needs about 16 GB just to be loaded, and a 70B model about 140 GB, which means several GPUs.",
          "All requests share the same weights. What differs per request is the KV cache, which is why the memory left over after the weights decides how many requests can run at once.",
          "Quantising the weights to 8-bit or 4-bit halves or quarters this memory, leaving more room for cache and making each decode step faster, at a small risk to quality that you must measure."
        ],
        oneLiner: "Weights take parameters × bytes per parameter - about 16 GB for an 8B model in 16-bit - and are shared by all requests on the GPU."
      },
      memory: {
        title: "The GPU memory budget",
        tip: "GPU memory holds the weights plus the KV cache of every running request. Whatever is left decides how many requests fit.",
        detail: [
          "On an 80 GB GPU with a 16 GB model, about 64 GB is left, mostly for the KV cache. Every running request needs its own share, growing with every token it reads or writes.",
          "This is the main capacity limit of LLM serving. A server rarely runs out of compute first; it runs out of memory for cache, and then new requests must wait or old ones are paused.",
          "Sizing questions in interviews come down to this sum: weights + (cache per token × tokens per request × concurrent requests) must fit, with some headroom."
        ],
        oneLiner: "Serving capacity is mostly a memory sum: weights plus per-token cache times tokens times concurrent requests must fit on the GPU."
      },
      prefill: {
        title: "Prefill",
        tip: "Processes every prompt token in one parallel pass, filling the KV cache. It is compute-bound and its time grows with prompt length.",
        detail: [
          "In prefill the model reads the entire prompt - all 1,000 tokens - in one pass. Because all tokens are known, the GPU can process them in parallel as large matrix multiplications.",
          "That makes prefill compute-bound: the GPU's arithmetic is the limit. Doubling the prompt roughly doubles prefill time, and attention's cost grows even faster for very long prompts.",
          "Prefill ends by producing the first output token, so it dominates time to first token. Short system prompts, trimmed context and prefix caching all make prefill cheaper."
        ],
        oneLiner: "Prefill processes the whole prompt in parallel, is compute-bound, fills the KV cache and dominates time to first token."
      },
      kvcache: {
        title: "KV cache",
        tip: "The saved keys and values of every earlier token, in every layer, so decode never recomputes them. It grows with every token.",
        detail: [
          "Attention needs the keys and values of all earlier tokens. Without a cache, each new token would mean recomputing them for the whole sequence. The KV cache stores them once and reuses them at every step.",
          "Its size per token is 2 (K and V) × layers × KV heads × head size × bytes. For a Llama-3-8B-style model that is 2 × 32 × 8 × 128 × 2 bytes, about 128 KB per token: 128 MB for a 1,000-token prompt, and more as the answer grows.",
          "Long contexts and many users make the cache the biggest memory consumer. Grouped-query attention (fewer KV heads), cache quantisation and paging are the standard ways to keep it in check."
        ],
        oneLiner: "The KV cache stores every earlier token's keys and values per layer - about 128 KB per token for an 8B model - and is what limits concurrency."
      },
      paged: {
        title: "Paged blocks (PagedAttention)",
        tip: "The cache is split into fixed-size blocks handed out on demand, like pages of memory, so little space is wasted.",
        detail: [
          "Early servers reserved one big contiguous chunk per request for the longest possible answer. Most answers are shorter, so much of that memory sat empty.",
          "PagedAttention, introduced by vLLM, stores the cache in small fixed-size blocks - for example 16 tokens each - and gives a request a new block only when it needs one. Blocks do not have to sit next to each other, as request A's new block shows.",
          "Less waste means more requests fit, which means higher throughput. Blocks can also be shared, which is how prefix caching reuses one copy of a common system prompt across many requests."
        ],
        oneLiner: "PagedAttention stores the KV cache in fixed-size blocks allocated on demand, cutting waste so more requests fit, and enabling shared prefixes."
      },
      metrics: {
        title: "TTFT, time per token and throughput",
        tip: "TTFT is the wait for the first token; time per output token is the gap between tokens; throughput is total tokens per second for the server.",
        detail: [
          "Time to first token (TTFT) is how long the user waits before anything appears: queueing plus prefill. Time per output token (TPOT, or inter-token latency) is the gap between streamed tokens, set by decode.",
          "Throughput is a server number: total tokens per second across all users. Bigger batches raise throughput but can make each user's tokens arrive a little slower.",
          "Measure them separately and at percentiles such as p95, not averages. A chat feels fast with a TTFT under about a second and tokens faster than people read; a background job only cares about throughput and cost."
        ],
        oneLiner: "TTFT is queueing plus prefill, time per token is set by decode, and throughput is server-wide; measure each at p95, because they trade off."
      },
      decode: {
        title: "Decode",
        tip: "Generates one token per step: only the newest token runs through the model, reading earlier keys and values from the cache.",
        detail: [
          "After the first token, the model generates one token at a time. Each step runs just the newest token through all the layers; attention looks back at everything earlier by reading the KV cache.",
          "The new token's keys and values are appended to the cache, the next token is sampled, and it is streamed to the user. Then the loop repeats until the answer ends.",
          "Decode cannot be parallelised across one answer's tokens, because each depends on the one before. Long answers therefore take time roughly in proportion to their length, which is why max_tokens and concise prompts matter."
        ],
        oneLiner: "Decode runs only the newest token each step, using the KV cache for the past, so answer time grows with output length."
      },
      bandwidth: {
        title: "Why decode is memory-bound",
        tip: "Each decode step reads all the weights from memory to do a small amount of maths, so memory bandwidth - not compute - sets the speed.",
        detail: [
          "To produce one token, the GPU must read every weight - all 16 GB - from its memory. The actual arithmetic per token is small, so the GPU spends most of its time waiting for data. Decode is memory-bandwidth-bound.",
          "A rough rule: tokens per second for one request is about memory bandwidth divided by model size. Smaller or quantised weights decode faster for exactly this reason.",
          "Batching is the fix: one read of the weights serves every request in the batch, so 32 requests decode almost as fast as one. That is why servers batch aggressively, and why throughput rises with batch size until the cache runs out."
        ],
        oneLiner: "Decode is memory-bandwidth-bound - each step reads all the weights - so batching and smaller weights are what raise its speed."
      },
      stream: {
        title: "Sampling and streaming",
        tip: "Each step samples one token from the probabilities and sends it to the user immediately, so the answer appears word by word.",
        detail: [
          "At the end of each step the server samples the next token, using the request's temperature and top-p settings, and sends it straight to the client over a stream instead of waiting for the full answer.",
          "Streaming does not make generation faster, but it makes waiting feel much shorter: users start reading after the first token, not after the last.",
          "Streaming also matters for safety and UX. Output checks can run on chunks as they arrive, and the user can stop a long or wrong answer early, which saves cost too."
        ],
        oneLiner: "Tokens are sampled and streamed one by one, so users read from the first token; total generation time is unchanged."
      },
      stop: {
        title: "Stopping and freeing memory",
        tip: "Generation stops at an end token, a stop string or max_tokens. The request's cache blocks are freed for others immediately.",
        detail: [
          "A request finishes when the model emits its end-of-sequence token, when a stop string appears, or when it reaches max_tokens. The server then closes the stream.",
          "Its KV cache blocks return to the pool straight away, and the scheduler can admit a waiting request in the next step. Short, bounded answers keep the whole server healthy.",
          "Always set a sensible max_tokens. A runaway answer holds memory, slows everyone else in the batch and costs money for text nobody needed."
        ],
        oneLiner: "Requests stop at an end token, stop string or max_tokens, and their cache blocks are freed at once, so bounded outputs keep capacity available."
      },
      prefix: {
        title: "Prefix caching",
        tip: "Reuses the KV cache of a prompt prefix many requests share - like a long system prompt - so it is prefilled once, not every time.",
        detail: [
          "Many requests start with the same text: a long system prompt, tool definitions, or the same document. Prefix caching keeps the KV cache for that shared start and reuses it, so prefill only processes the new part.",
          "That cuts TTFT and compute for every request that hits the cache. Hosted APIs offer a version of this as prompt caching, usually with a lower price for cached input tokens.",
          "It only works for an exact shared prefix, so put stable content - instructions, tools, documents - at the start of the prompt and the changing parts at the end."
        ],
        oneLiner: "Prefix caching reuses the KV cache of an identical prompt start, cutting TTFT and cost, so stable content belongs at the beginning of the prompt."
      },
      quant: {
        title: "Quantisation",
        tip: "Stores weights (and sometimes the KV cache) in fewer bits - 8 or 4 instead of 16 - saving memory and speeding up decode.",
        detail: [
          "Quantisation stores numbers with fewer bits. An 8B model drops from 16 GB at 16-bit to about 8 GB at 8-bit and about 4-5 GB at 4-bit.",
          "Because decode is limited by reading weights, smaller weights also mean faster tokens, and the memory saved goes to more KV cache and therefore more concurrent users. The cache itself can be quantised too.",
          "The cost is a possible drop in quality, usually small at 8-bit and more noticeable at 4-bit or on demanding tasks. Measure it on your own evaluation set before switching."
        ],
        oneLiner: "Quantisation shrinks weights and cache to 8 or 4 bits, freeing memory and speeding decode, at a quality cost you must measure on your own evals."
      },
      spec: {
        title: "Speculative decoding",
        tip: "A small, fast draft model guesses several tokens; the big model checks them all in one pass and keeps the ones it agrees with.",
        detail: [
          "Decode is slow because it produces one token per pass of the big model. Speculative decoding lets a small draft model, or extra prediction heads, guess the next few tokens quickly.",
          "The big model then checks all the guesses in a single pass, which costs about the same as generating one token because decode is memory-bound. Correct guesses are kept, and the first wrong one is replaced.",
          "When the draft guesses well - predictable text, code, structured output - responses can come 2-3 times faster with exactly the same output distribution. When it guesses badly, the gain disappears, so test it on your real traffic."
        ],
        oneLiner: "Speculative decoding has a small model draft tokens that the big model verifies in one pass, often 2-3× faster with identical outputs when guesses are good."
      }
    }
  };
})();
