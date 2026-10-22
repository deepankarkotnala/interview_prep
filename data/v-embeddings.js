/* Visual explanation: how text becomes numbers you can search by meaning.
   Drawn by assets/visual.js - scene format in README.md. Vectors, positions and
   scores are illustrative; the 2-D map stands in for hundreds of dimensions. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
(function () {
  /* The HNSW picture: three layers of the same graph. With `hot`, the greedy
     search path from the top layer down to the nearest vector is drawn. */
  function hnsw(hot) {
    var L = [30, 104, 178], out = "";
    [[0, "Layer 2 - long jumps"], [74, "Layer 1"], [148, "Layer 0 - every vector"]].forEach(function (b) {
      out += '<rect class="vx-art-plane" x="0" y="' + b[0] + '" width="370" height="52" rx="8"/>' +
        '<text class="vx-art-text" x="10" y="' + (b[0] + 15) + '">' + b[1] + '</text>';
    });
    var rows = [[150, 250, 340], [90, 150, 205, 250, 300, 345], [60, 90, 120, 150, 180, 205, 230, 250, 275, 300, 325, 350]];
    rows.forEach(function (row, li) {
      for (var i = 0; i < row.length - 1; i++) {
        out += '<line class="vx-art-line" x1="' + row[i] + '" y1="' + L[li] + '" x2="' + row[i + 1] + '" y2="' + L[li] + '"/>';
      }
    });
    [[150, 0], [250, 0], [150, 1], [250, 1]].forEach(function (d) {
      out += '<line class="vx-art-drop" x1="' + d[0] + '" y1="' + (L[d[1]] + 6) + '" x2="' + d[0] + '" y2="' + (L[d[1] + 1] - 6) + '"/>';
    });
    if (hot) out += '<polyline class="vx-art-hot" points="340,30 250,30 250,104 205,104 150,104 150,178 120,178 90,178"/>';
    var hotSet = { "0:340": 1, "0:250": 1, "1:250": 1, "1:205": 1, "1:150": 1, "2:150": 1, "2:120": 1 };
    rows.forEach(function (row, li) {
      row.forEach(function (x) {
        var cls = "vx-art-node";
        if (hot && hotSet[li + ":" + x]) cls += " is-hot";
        if (hot && li === 2 && x === 90) cls += " is-goal";
        out += '<circle class="' + cls + '" cx="' + x + '" cy="' + L[li] + '" r="5.5"/>';
      });
    });
    return out;
  }

  var basePoints = [
    { x: 0.12, y: 0.86, label: "Forgot my login", tone: "input" },
    { x: 0.26, y: 0.74, label: "Reset your password", tone: "input" },
    { x: 0.06, y: 0.78, label: "Unlock account", tone: "input" },
    { x: 0.22, y: 0.58, label: "Change PIN", tone: "input" },
    { x: 0.6, y: 0.84, label: "Refund request", tone: "tool" },
    { x: 0.7, y: 0.72, label: "Payment failed", tone: "tool" },
    { x: 0.56, y: 0.66, label: "Invoice copy", tone: "tool" },
    { x: 0.42, y: 0.3, label: "Where is my order?", tone: "data" },
    { x: 0.56, y: 0.2, label: "Track my parcel", tone: "data" },
    { x: 0.34, y: 0.13, label: "Delivery delayed", tone: "data" },
    { x: 0.82, y: 0.38, label: "Store hours", tone: "neutral" }
  ];
  var withQuery = basePoints.concat([{ x: 0.17, y: 0.66, label: "your question", tone: "output", query: true, r: 7 }]);

  window.IR.v["embeddings"] = {
    view: [1290, 660],

    parts: [
      { id: "query", kind: "msg", x: 20, y: 34, w: 236, role: "User", text: "How do I reset my password?", tone: "input", concept: "query" },
      { id: "tokens", kind: "tokens", x: 296, y: 58, items: ["How", "do", "I", "reset", "my", "password", "?"], label: "Tokens", tone: "input", concept: "tokens" },
      { id: "model", kind: "box", x: 704, y: 44, w: 190, h: 76, label: "Embedding model", sub: "an encoder", tone: "model", concept: "model" },
      { id: "pool", kind: "box", shape: "pill", x: 934, y: 66, w: 116, h: 32, label: "Pooling", tone: "model", concept: "pool" },
      { id: "qvec", kind: "vector", x: 1090, y: 75, n: 12, seed: 5, cell: 12, label: "Query vector", tone: "input", hidden: true, concept: "vector" },

      { id: "docs", kind: "doc", x: 92, y: 214, w: 66, h: 84, count: 3, label: "Help articles", tone: "data", concept: "corpus" },
      { id: "vdb", kind: "db", x: 24, y: 384, w: 222, h: 120, label: "Vector DB", sub: "800 articles as vectors", tone: "data", concept: "vdb" },
      { id: "filter", kind: "box", shape: "pill", x: 24, y: 548, w: 222, h: 34, label: "Filter: app only", tone: "guard", concept: "filter" },

      { id: "map", kind: "scatter", x: 300, y: 216, w: 540, h: 420, label: "Meaning space (a 2-D picture of 768 dimensions)", tone: "neutral",
        points: basePoints, concept: "space" },

      { id: "cosine", kind: "box", x: 890, y: 216, w: 376, h: 62, label: "Cosine similarity", sub: "how closely two vectors point the same way", tone: "model", concept: "cosine" },
      { id: "hnsw", kind: "art", x: 893, y: 304, w: 370, h: 200, tone: "data", svg: hnsw(false), concept: "hnsw" },
      { id: "results", kind: "bars", x: 890, y: 548, w: 376, lw: 166, fmt: "raw", label: "Top 3 matches", tone: "output", hidden: true, concept: "results",
        items: [{ label: "Reset your password", value: 0.89 }, { label: "Forgot my login", value: 0.84 }, { label: "Unlock account", value: 0.79 }] }
    ],

    links: [
      { id: "l-q-tok", from: "query:r", to: "tokens:l", style: "straight", tone: "input" },
      { id: "l-tok-model", from: "tokens:r", to: "model:l", style: "straight", tone: "input" },
      { id: "l-model-pool", from: "model:r", to: "pool:l", style: "straight", tone: "model" },
      { id: "l-pool-vec", from: "pool:r", to: "qvec:l", style: "straight", tone: "model" },
      { id: "l-docs-db", from: "docs:b", to: "vdb:t", style: "straight", tone: "data", label: "embedded offline", labelAt: 0.5 },
      { id: "l-db-map", from: "vdb:r", to: "map:l:0.62", tone: "data" },
      { id: "l-vec-map", from: "qvec:b", to: "map:t:0.95", via: [[1173, 160], [813, 160]], tone: "input", label: "same space", labelAt: 0.5 },
      { id: "l-map-hnsw", from: "map:r:0.48", to: "hnsw:l", tone: "data" },
      { id: "l-hnsw-res", from: "hnsw:b", to: "results:t", style: "straight", tone: "output" }
    ],

    steps: [
      { title: "Meaning as numbers",
        text: "Computers compare numbers, not meanings. An embedding model turns text into a vector so that similar meanings get similar numbers. Follow **How do I reset my password?** to its closest help articles." },
      { title: "Split the text into tokens",
        text: "First the question is cut into tokens, the pieces the model works with. Embedding models use the same kind of tokenizer as chat models.",
        focus: ["query", "tokens"], flow: ["l-q-tok"], packets: [{ on: "l-q-tok" }] },
      { title: "The model reads the whole sentence",
        text: "The embedding model is a transformer encoder. Every token looks at every other token, so **reset** is understood together with **password**. Out comes one vector for each token.",
        focus: ["tokens", "model"], flow: ["l-tok-model"], hl: { tokens: [3, 5] }, packets: [{ on: "l-tok-model" }] },
      { title: "Pool into one vector",
        text: "Pooling averages the token vectors into a single vector for the whole question, here 768 numbers. It is then scaled to length 1, so only its direction carries meaning.",
        focus: ["model", "pool", "qvec"], flow: ["l-model-pool", "l-pool-vec"],
        packets: [{ on: "l-model-pool" }, { on: "l-pool-vec" }], set: { qvec: { hidden: false } } },
      { title: "Meaning becomes distance",
        text: "Picture every sentence as a point. Sentences that mean similar things land close together: password problems in one corner, billing in another, deliveries in a third. Real vectors have hundreds of dimensions; this map squashes them to two.",
        focus: ["map"] },
      { title: "The articles were embedded earlier",
        text: "Offline, all 800 help articles were embedded with the same model and stored in a vector database. Each one is a point in the same space.",
        focus: ["docs", "vdb", "map"], flow: ["l-docs-db", "l-db-map"],
        packets: [{ on: "l-docs-db", text: "800 vectors" }, { on: "l-db-map" }] },
      { title: "The question lands in the space",
        text: "The question's vector lands among the password articles - no shared keywords needed. **Forgot my login** is close even though it never says reset.",
        focus: ["qvec", "map"], flow: ["l-vec-map"], hl: { map: [11] },
        packets: [{ on: "l-vec-map", text: "query" }], set: { map: { points: withQuery } } },
      { title: "Measure how close",
        text: "Closeness is measured with cosine similarity: 1 means pointing the same way, 0 means unrelated. Because the vectors have length 1, this is just a dot product, which is very fast.",
        focus: ["cosine", "map"], hl: { map: [0, 1, 2, 3, 11] }, set: { map: { rings: [{ x: 0.17, y: 0.66, r: 0.22 }] } } },
      { title: "Search fast with HNSW",
        text: "Comparing against millions of vectors one by one is too slow. An HNSW index hops through a layered graph: long jumps on top, then finer steps below, until it reaches the nearest vectors.",
        focus: ["hnsw", "vdb"], flow: ["l-map-hnsw"], packets: [{ on: "l-map-hnsw" }], set: { hnsw: { svg: hnsw(true) } } },
      { title: "Return the top matches",
        text: "The search returns the top 3 articles with their scores, after a metadata filter keeps only articles for the app. A score threshold can say **nothing relevant** instead of returning weak matches.",
        focus: ["results", "filter", "hnsw"], flow: ["l-hnsw-res"], hl: { results: [0] },
        packets: [{ on: "l-hnsw-res" }], set: { results: { hidden: false } } },
      { title: "One model on both sides",
        text: "The question and the articles must be embedded by the same model. Vectors from different models live in different spaces, so upgrading the model means re-embedding every article.",
        focus: ["model", "docs", "vdb"] }
    ],

    concepts: {
      query: {
        title: "The query",
        tip: "The text you want to match by meaning - here a support question typed in everyday words.",
        detail: [
          "The user types \"How do I reset my password?\". The help centre's articles use different words: \"Forgot my login\", \"Unlock account\". Keyword search would miss some of them. Embeddings let the system match on meaning instead of exact words.",
          "The query can be anything you want to compare: a question, a product description, a support ticket or a whole document. The same machinery powers semantic search, recommendations, de-duplication and clustering.",
          "Short queries carry little information, so some systems expand or rewrite them before embedding, for example adding context from the conversation so far."
        ],
        oneLiner: "Embeddings let a query match text by meaning rather than shared keywords, which powers semantic search, recommendations and de-duplication."
      },
      tokens: {
        title: "Tokens",
        tip: "The question cut into the pieces the model reads. Each token gets its own vector inside the model before they are combined.",
        detail: [
          "Like any transformer, an embedding model first cuts text into tokens: words or pieces of words from a fixed vocabulary. \"How do I reset my password?\" becomes about seven tokens.",
          "Embedding models have a maximum input length, often 512 tokens and sometimes 8,000 or more. Text beyond the limit is usually cut off silently, which is one reason long documents are split into chunks before embedding.",
          "The tokenizer also explains odd behaviour: rare product codes or names split into many fragments and may be represented less well than common words, which is a reason to combine embeddings with keyword search."
        ],
        oneLiner: "Text is tokenized before embedding, and anything past the model's maximum input length is silently cut, which is why long documents are chunked."
      },
      model: {
        title: "Embedding model",
        tip: "A transformer encoder trained so that texts with similar meaning produce similar vectors.",
        detail: [
          "An embedding model is usually a transformer encoder: every token can attend to every other token, in both directions, so the meaning of \"reset\" is shaped by \"password\" next to it. It outputs one vector per token.",
          "It is trained on pairs of texts that mean the same thing (a question and its answer, a title and its article) to pull their vectors together and push unrelated pairs apart. That training is what makes distance mean similarity.",
          "Choose one by testing on your own data: language support (Hindi and code-mixed text matter in India), domain, maximum input length, vector size and cost. Public leaderboards such as MTEB are a starting point, not the answer."
        ],
        oneLiner: "An embedding model is an encoder trained so similar texts get similar vectors; pick it by testing on your own language and domain, not just leaderboards."
      },
      pool: {
        title: "Pooling",
        tip: "Combines the per-token vectors into a single vector for the whole text, usually by averaging them.",
        detail: [
          "The encoder produces one vector per token, but search needs one vector per text. Pooling combines them. The most common method is mean pooling: average all the token vectors. Some models instead use the vector of a special first token, often called [CLS].",
          "The pooling method is fixed when the model is trained, so you use whatever the model expects. Libraries such as sentence-transformers handle it for you.",
          "Because pooling squeezes a whole text into one vector, very long texts get blurred: a 20-page document about many topics ends up as an average of all of them. That is another reason to embed focused chunks."
        ],
        oneLiner: "Pooling turns per-token vectors into one vector per text, usually by averaging, which is why long mixed-topic texts embed poorly and get chunked."
      },
      vector: {
        title: "The vector",
        tip: "A fixed-length list of numbers - often 384 to 3,072 of them - that represents the text's meaning. Scaled to length 1, only its direction matters.",
        detail: [
          "The output is a vector with a fixed number of dimensions, set by the model: 384, 768, 1,024, 1,536 and 3,072 are common. Each square in the diagram is one number. No single number means anything human-readable; meaning lives in the pattern.",
          "Most systems normalise the vector to length 1. Then cosine similarity and dot product give the same ranking, and the dot product is the cheapest to compute.",
          "Size is a trade-off between quality and cost. A million 1,536-dimension vectors in 32-bit floats take about 6 GB before index overhead. Some newer models let you cut vectors shorter with little quality loss, and quantisation can shrink each number to 8 bits or less."
        ],
        oneLiner: "An embedding is a fixed-length vector, often normalised to length 1; its dimension trades quality against memory and search cost."
      },
      space: {
        title: "Meaning becomes distance",
        tip: "Every text is a point; similar meanings sit close together. This 2-D map is a squashed picture of a space with hundreds of dimensions.",
        detail: [
          "Imagine placing every sentence as a point. A good embedding model puts \"Reset your password\" near \"Forgot my login\", and far from \"Track my parcel\". Groups of related texts form clusters, as in the corners of this map.",
          "Real vectors have hundreds of dimensions. Pictures like this use methods such as UMAP or t-SNE to squash them into two, which keeps neighbours roughly together but distorts distances, so treat the map as an intuition, not a measurement.",
          "The same property powers more than search: clustering support tickets by theme, spotting duplicate questions, recommending similar items, and routing a message to the right team."
        ],
        oneLiner: "Embeddings place text in a space where distance means similarity, so related texts cluster - the basis for search, clustering, dedup and routing."
      },
      corpus: {
        title: "Embedding the articles",
        tip: "Every article was embedded ahead of time with the same model, so its vector is ready when a question arrives.",
        detail: [
          "Before any user asks anything, all 800 help articles are embedded once and stored. At question time only the question needs embedding, which is why search is fast.",
          "Long articles are usually split into chunks first, each embedded separately, so a match points to the relevant paragraph rather than a vague average of the whole article.",
          "Whenever an article changes, its vectors must be refreshed. A stale index quietly returns old content, so indexing is a pipeline with monitoring, not a one-time script."
        ],
        oneLiner: "Documents are embedded offline and kept fresh, so at query time only the question needs embedding."
      },
      vdb: {
        title: "Vector database",
        tip: "Stores vectors with their text and metadata, and finds the nearest vectors to a query quickly using an index.",
        detail: [
          "A vector database stores each vector together with its original text and metadata such as product, language and date. Its main job is nearest-neighbour search: given a query vector, return the closest stored vectors.",
          "Options range from an extension in a database you already run, such as pgvector in Postgres, to dedicated systems like Qdrant, Milvus or Pinecone, and search engines such as OpenSearch and Elasticsearch that also support vectors.",
          "For a few hundred thousand vectors, the database you already have is usually enough. Dedicated systems earn their place at large scale, very low latency, or heavy filtering needs."
        ],
        oneLiner: "A vector database stores vectors with text and metadata and serves fast nearest-neighbour search; at modest scale, pgvector in an existing Postgres is often enough."
      },
      cosine: {
        title: "Cosine similarity",
        tip: "Measures how closely two vectors point in the same direction: 1 means the same direction, 0 means unrelated.",
        detail: [
          "Cosine similarity compares the angle between two vectors and ignores their length. Close to 1 means very similar, near 0 means unrelated. \"Reset your password\" might score 0.89 against the question, \"Track my parcel\" about 0.2.",
          "If vectors are normalised to length 1, cosine similarity equals the dot product, which is the cheapest calculation. Euclidean distance gives the same ranking for normalised vectors too, so the choice matters less than people think.",
          "Scores are only comparable within one model. One model's 0.8 may mean \"very relevant\" while another's means \"vaguely related\", so set thresholds by testing, never by copying a number."
        ],
        oneLiner: "Cosine similarity compares vector directions; on normalised vectors it equals the dot product, and thresholds must be tuned per model."
      },
      hnsw: {
        title: "HNSW index",
        tip: "A layered graph that finds near neighbours by hopping: long jumps on top, finer steps below. Fast, and very slightly approximate.",
        detail: [
          "Checking the query against every stored vector is exact but slow once you have millions. HNSW (Hierarchical Navigable Small World) builds a graph where each vector links to its near neighbours, in several layers.",
          "The top layer has few nodes and long links, like motorways. The search starts there, moves greedily towards the query, then drops down a layer and repeats with finer steps until it reaches the bottom layer, which holds every vector.",
          "It is approximate: it may occasionally miss the true nearest neighbour, but it typically finds 95-99% of them in milliseconds. Parameters such as M (links per node) and ef (how wide the search looks) trade speed and memory against recall, and the whole graph usually sits in memory."
        ],
        oneLiner: "HNSW is a layered neighbour graph searched greedily from coarse to fine; it trades a little recall for millisecond search, tuned with M and ef."
      },
      results: {
        title: "Top-k results",
        tip: "The k closest items with their similarity scores - the answer to the search, and what a RAG system would pass to the model.",
        detail: [
          "The search returns the k nearest articles, here the top 3, each with a score. For a help centre you might show them directly; in RAG they become the context given to the language model.",
          "Always look at the scores, not just the order. If even the best match scores low, the honest result is \"nothing relevant\", not three weak guesses. A threshold, tuned on real queries, makes that decision.",
          "Measure search quality with labelled examples: recall@k (was the right article in the top k?) and MRR (how high did it rank?). These numbers tell you whether a new model or index setting is actually better."
        ],
        oneLiner: "Search returns the top k matches with scores; use a tuned threshold for 'nothing relevant' and measure quality with recall@k and MRR."
      },
      filter: {
        title: "Metadata filter",
        tip: "Restricts the search to items whose metadata matches - same product, language, country or permission level.",
        detail: [
          "Meaning alone is not enough. The question comes from the mobile app, so articles about the web dashboard should not appear, even if they are about passwords. A metadata filter keeps only items tagged for the app.",
          "Filters also enforce access: users must never retrieve documents they are not allowed to read. That check belongs in the search itself, not in a step afterwards.",
          "How the filter runs matters. Filtering after the vector search can leave fewer than k results; filtering during the search, which most modern vector databases support, avoids that. Very narrow filters can still slow HNSW down."
        ],
        oneLiner: "Metadata filters restrict search by product, language or permissions; apply them during the search so you neither leak documents nor lose results."
      }
    }
  };
})();
