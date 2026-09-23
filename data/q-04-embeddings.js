/* Topic 04 - Embeddings and vector databases.
   Grounding: public JDs naming vector databases and semantic search, plus
   documented index behaviour. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["04-embeddings"] = {
  "lede": "This topic is where interviewers check whether you understand the layer under RAG or just call it. The questions look academic and are not - every one of them decides something operational: what your index costs, how fast it answers, and whether filtering works. New to embeddings? The questions are ordered for a first read: High priority first, from what an embedding and a vector database are through similarity metrics, model choice, HNSW and filtering, then Medium, then Low.",
  "grounding": "public JDs naming vector search + documented index behaviour",
  "evening": [
    "em-02",
    "em-04",
    "em-06",
    "em-07",
    "em-09"
  ],
  "cards": [
    {
      "id": "em-01",
      "q": "What is an embedding?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "embeddings",
        "basics"
      ],
      "why": "A warm-up. The signal is whether you connect it to retrieval behaviour or stop at the definition.",
      "simple": "An embedding is a list of numbers that represents meaning. A model reads a piece of text and produces, say, a thousand numbers - and it was trained so that texts with similar meaning produce similar number lists.\n\nThink of a map of a city. Places that are near each other on the map are near each other in reality. An embedding is a map of meaning: \"leave policy\" and \"time-off entitlement\" end up close together even though they share no words.\n\nThat is why semantic search works. You embed the question, embed all your documents in advance, and find the documents whose position on the map is nearest to the question's position.\n\nThe consequence worth stating: the map is only as good as the model that drew it. A model trained on general web text has a poor map of your company's internal jargon, which is exactly where retrieval quietly fails.",
      "points": [
        "A fixed-length vector of numbers representing meaning.",
        "Trained so similar meaning lands nearby.",
        "Documents are embedded ahead of time; the query is embedded at request time.",
        "Domain jargon is where general-purpose models have the weakest map."
      ],
      "say": "An embedding is a list of numbers that represents meaning, produced by a model trained so that similar texts land near each other. That is what lets me search by meaning rather than keywords - I embed documents in advance, embed the question at query time, and find the nearest ones. The catch is that a general-purpose model has a weak map of internal jargon, which is where retrieval quietly fails.",
      "numbers": "Common dimensions: 384 for small models, 768–1,536 for general-purpose, 3,072–4,096 at the large end. Many current models are Matryoshka-trained, so you can keep a shorter prefix (say 256 or 512) and trade a little quality for cost. Dimension drives both storage and search cost.",
      "wrong": "\"It converts text to numbers so the computer can process it.\" True of any encoding, including ASCII. The point is that distance means similarity.",
      "follow": "Two different embedding models - how do you decide which is better for us?",
      "followAnswer": "I test both on our own data. I build about a hundred real questions, each labelled with the chunk that answers it, embed the corpus with each model, and compare recall at ten and MRR, sliced by document type and language. Then I weigh dimension, latency, cost, and whether the model can run where our data must stay. A public leaderboard only builds the shortlist."
    },
    {
      "id": "em-11",
      "q": "What is a vector database, and why not just use a normal database?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "embeddings",
        "vector-db",
        "ann",
        "basics"
      ],
      "why": "A basics check. The signal is whether you know the hard part is nearest-neighbour search at scale, not storage.",
      "simple": "A vector database stores embeddings and finds the ones nearest to a query vector, fast. Storing vectors is easy. Searching them by closeness is the hard part.\n\nA normal database index, such as a B-tree, is built for exact values and ranges: \"price below 100\" or \"customer ID = 42\". It cannot answer \"which of these ten million lists of 1,024 numbers are closest to this one?\" Without a special index, the only way is to compare the query with every vector. That is called brute-force or exact k-nearest-neighbour (kNN) search. It is perfectly accurate and fine for small collections, but too slow for millions of vectors under real traffic.\n\nSo vector databases use approximate nearest neighbour (ANN) indexes, such as HNSW or IVF. They skip most of the comparisons and return almost the true top results - you choose how close, often 95-99% - in a few milliseconds. Around that index they add what production needs: metadata filters, updates and deletes, persistence, replication, and often hybrid keyword search.\n\nThe senior twist: many \"normal\" databases now do this too - Postgres with pgvector, Elasticsearch and OpenSearch, MongoDB Atlas, Redis. So the real decision is usually whether you need a separate, dedicated engine. And no database fixes a weak embedding model.",
      "points": [
        "Stores embeddings plus metadata; its core job is fast **nearest-neighbour search**.",
        "B-tree indexes serve exact matches and ranges, not \"closest in 1,024 dimensions\".",
        "Exact kNN compares the query with every vector: perfect recall, slow at scale.",
        "ANN indexes (HNSW, IVF) trade a little recall for a large speed-up.",
        "Production features: filtering, upserts and deletes, persistence, replication, hybrid search.",
        "Postgres (pgvector), Elasticsearch/OpenSearch, MongoDB and Redis now offer vector search too."
      ],
      "say": "A vector database stores embeddings with their metadata and quickly finds the ones nearest a query vector. A normal B-tree index handles exact matches and ranges, not closeness in a thousand dimensions, so without a special index I would compare against every vector. Vector databases use approximate indexes like HNSW or IVF, trading a little recall for big speed-ups, and add filtering, updates and replication. Many regular databases, like Postgres with pgvector, now offer this too.",
      "numbers": "Exact search over 1 million 768-dimension float32 vectors scans about 3 GB and does roughly 770 million multiply-adds per query - often in the region of a hundred milliseconds on CPU. A tuned HNSW index typically answers in a few milliseconds at 95%+ recall. Measure on your own hardware.",
      "wrong": "\"It is a database that stores vectors.\" Any database can store an array. The follow-up asks why searching them is hard, and the answer needs nearest-neighbour search and the approximate-search trade-off.",
      "follow": "When is brute-force search good enough, with no index at all?",
      "followAnswer": "When the collection is small or already filtered down. Up to a few hundred thousand vectors, an exact scan with NumPy or a FAISS flat index often answers in tens of milliseconds, gives perfect recall, and has nothing to tune. It also fits right after a very selective filter, like one user's own documents. I add an ANN index only when measured latency or traffic demands it."
    },
    {
      "id": "em-02",
      "q": "Cosine, dot product or Euclidean - which do you use?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "embeddings",
        "similarity",
        "vector-search"
      ],
      "why": "A quick factual check with a wrong answer that has real consequences.",
      "simple": "Use whichever metric the embedding model was trained with. That is a compatibility rule, not a taste. If a model was trained with dot product and you search with cosine, the ranking changes and quality drops - with no error message.\n\nWhat the three measure. Cosine similarity compares only the direction of two vectors and ignores their length. Dot product uses direction and length together. Euclidean distance is the straight-line gap between two points.\n\nOne fact interviewers like: many models output normalised vectors, meaning every vector is scaled to length 1. Then all three give the same ranking. Cosine equals dot product, and squared Euclidean distance is simply 2 − 2 × cosine. Dot product is the cheapest to compute, so it is the usual pick for normalised vectors.\n\nThat is why many teams mix up cosine and dot product and never notice. It works by luck. Some models do not normalise, so read the model card instead of assuming.\n\nThe answer that scores: check the model card, set the index metric to match, then confirm ranking quality on real labelled queries rather than trusting the config.",
      "points": [
        "Match the metric the model was trained with. Check the model card.",
        "Cosine - direction only. Dot product - direction and magnitude. Euclidean - straight-line distance.",
        "For normalised vectors, cosine, dot product and Euclidean all produce the same ranking.",
        "Many popular models output normalised vectors - check, do not assume.",
        "Verify with a labelled retrieval set. The setting is not the proof."
      ],
      "say": "Whichever the model was trained with - it is a compatibility requirement, not a preference, and mismatching it degrades ranking silently. Cosine compares direction, dot product includes magnitude, Euclidean is straight-line distance. If the vectors are normalised, which many models output, all three rank identically and dot product is cheapest. Then I verify on a labelled set rather than trusting the config.",
      "numbers": "No number applies. It is a compatibility choice, verified empirically.",
      "wrong": "\"Cosine is standard so I use cosine.\" Right most of the time by accident, which is not the same as knowing why.",
      "follow": "What changes if the vectors are not normalised?",
      "followAnswer": "Then the three metrics can rank differently. Dot product rewards longer vectors, so a document with a large magnitude can win even when its direction is a worse match. Cosine ignores length, and Euclidean penalises differences in both angle and length. So I use exactly the metric the model was trained with - and if the card says cosine, I normalise at write and query time and use dot product for speed."
    },
    {
      "id": "em-03",
      "q": "How do you choose an embedding model?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "embeddings",
        "model-selection",
        "evaluation"
      ],
      "why": "Whether you evaluate on your own data or pick from a leaderboard.",
      "simple": "Test candidates on your own data, not on a public leaderboard. Leaderboards such as MTEB measure general tasks. Your corpus is not general - a model that ranks high overall can be weak on insurance wording or telecom part numbers.\n\nStart with the hard limits, because they remove models before any testing. Can it run where our data is allowed to go, or must we self-host? Does it handle our languages, such as Hindi or mixed Hindi-English? How long an input can it take?\n\nThen build a small labelled set: about a hundred real questions, each paired with the chunk that answers it, written by someone who knows the domain. Embed the corpus with each candidate and compare recall@10 - how often the right chunk lands in the top ten results.\n\nAfter quality, running costs decide it. Dimension - the length of each vector - drives storage and search cost. Query latency matters because every question is embedded live. Price per million tokens matters at your ingestion volume.\n\nFinally, treat the choice as sticky. Switching models later means re-embedding the whole corpus.",
      "points": [
        "Constraints first: tenancy, self-hosting, languages, max input length.",
        "Labelled set from your own corpus, roughly 100 pairs.",
        "Compare recall@10, not benchmark rank.",
        "Weigh dimension - it drives storage and query cost.",
        "Switching later means re-embedding everything. Decide deliberately."
      ],
      "say": "Not from a leaderboard, because those are general-purpose and my corpus is not. I build about a hundred labelled question-to-chunk pairs from our own data, shortlist on hard constraints like tenancy and language support, then compare recall at ten. After that, dimension, query latency and ingestion cost decide it. And I treat it as sticky, because changing later means re-embedding the whole corpus.",
      "numbers": "Around 100 labelled pairs is usually enough to separate candidates with a clear gap; close calls need a few hundred. Re-embedding a large corpus is a real cost - price it before you treat the choice as reversible.",
      "wrong": "\"We use the top model on MTEB.\" It says you did not test on your own data, which is the actual skill being probed.",
      "follow": "Would you ever fine-tune the embedding model instead?",
      "followAnswer": "Only after the cheaper fixes fail - hybrid search, a reranker, better chunking and query rewriting. Fine-tuning pays when our language is far from general text, like internal product codes or medical coding, and retrieval keeps missing on it. I would need a few thousand query-document pairs with hard negatives, and I would budget for re-embedding the whole corpus on every retrain."
    },
    {
      "id": "em-04",
      "q": "How does HNSW work, and what do its parameters cost you?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "embeddings",
        "hnsw",
        "index",
        "ann"
      ],
      "why": "Whether you know what your vector database is doing, which matters the moment it gets slow.",
      "simple": "Comparing a query against every vector is exact and far too slow at scale. So we use approximate search, and HNSW is the most common approach.\n\nIt builds a graph where each vector is connected to its near neighbours, in layers. The top layers are sparse, with long-range links; the lower layers are dense. A search starts at the top and takes big jumps to get roughly to the right region, then drops down layer by layer, refining. Like finding an address by taking the highway to the right city, then main roads, then the final street.\n\nThe parameters trade three things against each other. M controls how many connections each node keeps - higher means better recall and more memory. efConstruction affects build quality and build time. efSearch is the query-time knob: higher means more of the graph is explored, so better recall and slower queries.\n\nThe point to make: efSearch is tunable per query without rebuilding, which is the lever you reach for when recall is bad but you cannot afford a rebuild.",
      "points": [
        "Multi-layer proximity graph: sparse layers for coarse navigation, dense for refinement.",
        "M - connections per node. Higher recall, more memory.",
        "efConstruction - build-time quality. Higher is slower to build, better graph.",
        "efSearch - query-time breadth. Higher recall, slower queries, no rebuild needed.",
        "Approximate by design. You choose the recall you pay for.",
        "HNSW is memory-hungry - one reason teams turn to quantisation, IVF-PQ or disk-based indexes such as DiskANN."
      ],
      "say": "HNSW is a layered proximity graph. Search starts in sparse top layers to jump near the right region, then descends into denser layers to refine. M sets connections per node, trading memory for recall. efConstruction sets build quality. efSearch is the query-time knob - more exploration means better recall and slower queries, and it is tunable without a rebuild, which is the lever I reach for first.",
      "numbers": "Common starting points: M around 16, efConstruction around 200, efSearch tuned from 50 upward against your recall target. Keep efSearch at least as large as k - in some engines, pgvector included, it caps how many results come back.",
      "wrong": "\"It's approximate nearest neighbour search.\" Correct, but it only names the category. The follow-up asks for the mechanism and what each parameter costs, and the label alone cannot answer that.",
      "follow": "The index no longer fits in memory. What are your options?",
      "followAnswer": "Cheapest first. Quantise the vectors - int8 is about four times smaller with a small recall loss. Shorten them if the model supports Matryoshka truncation. Switch to IVF-PQ or a disk-based index like DiskANN, which keep only compressed vectors in RAM and rescore the top candidates. Shard across machines only when one node truly cannot hold it. After each step I re-measure recall."
    },
    {
      "id": "em-06",
      "q": "How does metadata filtering interact with vector search?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "embeddings",
        "filtering",
        "performance",
        "access-control"
      ],
      "why": "A subtle mechanism with a large production impact, and few candidates have hit it.",
      "simple": "**Short version: when the filter is applied decides whether you lose results or lose speed - so know what your engine does, and test recall with the filter switched on.**\n\nReal searches almost always carry a filter: this tenant, this date range, this access group.\n\n**Post-filtering** searches first, then removes results that fail the filter. It is fast. But if the filter is strict, you might fetch the top 100 and keep only three. Recall collapses, and users report it as \"the vector database returns nothing\".\n\n**Pre-filtering** narrows to the matching items first, then searches only those. It is correct, but a naive version struggles. The HNSW graph was built over everything, so the matching items can be poorly connected inside it. When very few items match, a brute-force scan over them is fine and exact. The hard case is a filter that keeps a middling share of the data.\n\n**Filtered search** is what good engines do: apply the filter during the graph walk, and switch to brute force when the filter is very strict. Qdrant, Weaviate and pgvector 0.8+ (iterative index scans) all have versions of this.\n\nFor access control, enforce the filter on the server before any chunk reaches the model. For tenant isolation, partition the data - namespaces or partition keys, and separate collections only for a few large tenants.",
      "points": [
        "Post-filter - fast, recall collapses on selective filters.",
        "Pre-filter - correct; naive versions get slow or lose recall on mid-selectivity filters.",
        "Filtered graph traversal is the good behaviour. Check whether your engine does it.",
        "Access control: enforced server-side before the model, ideally pre-filter. Post-filter is not a leak, but returns fewer than k.",
        "Tenant isolation: partition (namespaces, partition keys, per-tenant collections) rather than one big filter.",
        "Test recall *with* filters applied. Unfiltered recall is not representative."
      ],
      "say": "It depends on when the engine applies the filter. Post-filtering searches then discards, so a selective filter can leave three results out of a hundred. Naive pre-filtering is correct but can get slow. Good engines filter during graph traversal. For access control I enforce the filter server-side before anything reaches the model, ideally as a pre-filter, and for tenant isolation I partition rather than filtering one huge collection.",
      "numbers": "Always measure recall with filters applied. A system at 0.95 unfiltered can sit far lower once a selective tenant filter is added.",
      "wrong": "\"I just add a filter to the query.\" It works until the filter is selective, and then it fails in a way that looks like a retrieval-quality problem.",
      "follow": "You have 400 tenants. One collection with a filter, or 400 collections?",
      "followAnswer": "Usually one collection partitioned by tenant - a namespace, partition key or the engine's multi-tenancy feature - rather than a plain filter or 400 separate collections. Hundreds of collections multiply overhead, and a plain filter on a small tenant can wreck recall. If a few tenants are huge or need strict isolation, only those get their own collection. Either way the tenant is enforced server-side, never trusted from the client."
    },
    {
      "id": "em-07",
      "q": "pgvector or a dedicated vector database?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "embeddings",
        "vector-db",
        "architecture",
        "trade-off"
      ],
      "why": "A real architecture decision with no universally correct answer - which is why it is asked.",
      "simple": "Start from what you already run. The cost of operating a new datastore - backups, access control, on-call - is usually underestimated.\n\npgvector is an extension that adds vector search to Postgres. It is a strong choice when the corpus and traffic fit comfortably in Postgres, when you need joins between vectors and business data (filter by customer, join to permissions), and when the team already runs Postgres well. You get one backup story, one access-control story, and transactions: a document and its vector change together or not at all. People forget that last advantage.\n\nA dedicated vector database earns its place at large scale: sharding across many machines, strong filtered search, built-in hybrid search, multi-vector support, or managed quantisation with rescoring.\n\nThe gap has narrowed. pgvector now has HNSW indexes, half-precision and binary vectors, and iterative scans for filtered queries. Extensions such as pgvectorscale add a disk-based index.\n\nThe answer that scores does not declare a winner. It names the numbers that would make you switch: corpus size, queries per second, p95 latency and filter selectivity (how small a slice the filter leaves).",
      "points": [
        "pgvector: relational joins, one backup and access story, transactional consistency.",
        "Dedicated: horizontal scale, filtered search quality, hybrid built in, managed quantisation and multi-vector.",
        "Decide on corpus size, QPS, p95 latency and filter selectivity.",
        "Adding a datastore adds on-call, backup and access-control surface. Price that in.",
        "State the migration trigger in advance, so the switch is a decision rather than a fire."
      ],
      "say": "I start from what we already operate, because a new datastore costs more than people expect. pgvector wins when the corpus fits Postgres, we need joins between vectors and relational data, and we want one backup and access story with transactional consistency. A dedicated engine wins at horizontal scale, or when we need filtered and hybrid search built in. I decide on corpus size, QPS, p95 and filter selectivity, and I name the migration trigger up front.",
      "numbers": "pgvector with HNSW is commonly run at single-digit to tens of millions of vectors on one well-sized node, especially with halfvec; the limit is usually the index fitting in memory and filtered-query p95. Measure p95 with your real filters before committing either way.",
      "wrong": "\"Dedicated vector databases are faster, so we use one.\" Faster at what, under which filters, at what operational cost. This answer invites all three follow-ups.",
      "follow": "What measurement would trigger the migration?",
      "followAnswer": "I agree the thresholds in advance. For example: filtered p95 search latency above budget at peak QPS after tuning, the HNSW index no longer fitting in memory on the largest node we are willing to run, or index builds and vacuum hurting the main transactional workload. If one of those holds for a sustained period, we plan the move - as a decision, not a fire."
    },
    {
      "id": "em-12",
      "q": "Dense vs sparse embeddings - what is the difference, and where do BM25 and SPLADE fit?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "embeddings",
        "sparse",
        "bm25",
        "hybrid-search"
      ],
      "why": "Whether you understand both halves of hybrid search, not just the vector half.",
      "simple": "A dense embedding is a short list of numbers, often 384 to 3,072, where almost every number is non-zero. Meaning is spread across all of them. It is great at paraphrase - \"leave policy\" finds \"time-off entitlement\" - and weaker on exact rare strings like part numbers.\n\nA sparse vector has one slot for every word in a vocabulary - tens of thousands of slots - and almost all of them are zero. Only the words that matter for this text get a weight. Because most slots are empty, it is stored in an inverted index: for each word, the list of documents that contain it. That is how classic search engines work.\n\n**BM25** is the classic sparse method, with no training. It scores a document higher when it contains the query's words, especially rare words, with limits so that repeating a word or writing a very long document does not win unfairly. It is exact, cheap and easy to explain.\n\n**SPLADE** is learned sparse. A neural model weights the document's words and also adds related words that are not in the text, such as \"vehicle\" for a text about cars. You keep exact matching and gain some meaning.\n\nIn practice you rarely choose one. Hybrid search runs dense plus sparse and merges the lists (see the hybrid search card in RAG). Many vector databases now store sparse vectors natively, and models such as BGE-M3 output both kinds at once.",
      "points": [
        "**Dense:** hundreds to a few thousand non-zero numbers. Strong on meaning and paraphrase, weak on rare exact terms.",
        "**Sparse:** one weight per vocabulary term, mostly zeros, served from an inverted index.",
        "**BM25:** untrained sparse scoring - term rarity (IDF), term frequency with saturation, document-length normalisation.",
        "**SPLADE:** learned sparse - model-assigned term weights plus expansion terms. Exact match with some semantics.",
        "Default: hybrid dense + sparse, fused by rank (RRF). BGE-M3 emits dense and sparse from one model."
      ],
      "say": "Dense embeddings are a few hundred to a few thousand non-zero numbers that capture meaning, so they handle paraphrases but blur rare exact terms. Sparse vectors have one weight per vocabulary word, mostly zeros, served from an inverted index. BM25 is the untrained classic, scoring rare matching terms highly. SPLADE is learned sparse: a model weights the terms and adds related ones. In production I usually run dense and sparse together as hybrid search.",
      "numbers": "BM25's usual defaults are k1 around 1.2 and b = 0.75. A BERT-based SPLADE vector has about 30,000 possible slots (the vocabulary size), but typically only tens to a few hundred are non-zero per document.",
      "wrong": "\"Sparse is the old way and dense replaced it.\" On identifier-heavy corpora BM25 still beats dense retrieval on exact codes, and learned sparse models are a current, actively used option.",
      "follow": "Your dense retriever misses queries with product codes. What do you change?",
      "followAnswer": "I add BM25 or a learned sparse index alongside the dense one and merge the two lists with reciprocal rank fusion, so exact codes match lexically. I also check that the text analyser does not split the code into useless pieces - a keyword field for identifiers often helps. Then I measure recall on a labelled set of code-heavy queries, before and after."
    },
    {
      "id": "em-13",
      "q": "Flat, IVF or HNSW - how do you choose a vector index?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "embeddings",
        "index",
        "ivf",
        "hnsw",
        "ann"
      ],
      "why": "Whether you pick an index from data size, memory and update pattern rather than from habit.",
      "simple": "Three families cover most real systems. The choice depends on size, memory and how often the data changes.\n\n**Flat** means no index: compare the query with every vector. It is exact and needs no tuning. It is the right choice for small collections, and it is also the ground truth you use to measure the other indexes.\n\n**IVF** (inverted file index) first groups the vectors into clusters with k-means. Each cluster has a centre point. At query time you find the few centres nearest the query and search only inside those clusters. `nlist` sets how many clusters exist, and `nprobe` sets how many you search - more probes means better recall and slower queries. Think of a library: you walk to the three most relevant shelves instead of reading every book. IVF uses little memory and builds fast, but it needs a training step, and if new data looks different, the clusters go stale and need retraining.\n\n**IVF-PQ** adds product quantization, which compresses each vector into a few bytes of codes. It is a usual choice at billions of vectors.\n\n**HNSW** is a graph index (see the HNSW card). It usually gives the best speed for a given recall and handles steady inserts well, but it uses the most memory and builds slowly.\n\nRough rule: small → flat; fits in RAM → HNSW; memory-bound or huge → IVF-PQ or a disk-based index such as DiskANN.",
      "points": [
        "**Flat:** exact, no tuning, slow at scale - and the ground truth for measuring ANN recall.",
        "**IVF:** k-means clusters; search the `nprobe` nearest of `nlist` clusters. Low memory, fast build, needs training and periodic retraining.",
        "**IVF-PQ:** IVF plus compressed codes - billion-scale on modest memory, with rescoring to recover accuracy.",
        "**HNSW:** best recall for latency in RAM, good with inserts, most memory, slow build.",
        "Deletes are awkward in graph indexes (often tombstoned) - plan compaction or rebuilds."
      ],
      "say": "I choose from size, memory and update pattern. Flat search is exact and fine for small collections, and it is my ground truth for measuring the others. IVF clusters vectors with k-means and searches only the nearest few clusters, so it is light on memory and quick to build, but needs retraining as the data shifts. IVF-PQ adds compression for billion-scale. HNSW gives the best recall for latency in RAM, at the highest memory cost.",
      "numbers": "pgvector's starting guidance for IVFFlat: lists ≈ rows / 1,000 up to 1M rows and √rows above that, with probes ≈ √lists. Then tune probes (nprobe in FAISS) against ANN recall measured with flat search.",
      "wrong": "\"HNSW is the best, so always use HNSW.\" At a billion vectors the RAM bill decides otherwise, and the follow-up asks what you would do instead.",
      "follow": "Your IVF index's recall has slowly dropped over six months. Why?",
      "followAnswer": "Most likely drift. The cluster centres were trained on the data we had back then. New documents look different, so they crowd into a few clusters or sit far from every centre, and the clusters we probe no longer cover them. I confirm by measuring ANN recall against flat search on recent documents, then retrain the centroids and rebuild - and make that retrain a scheduled job."
    },
    {
      "id": "em-05",
      "q": "Your index no longer fits in memory. What changes?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "embeddings",
        "scale",
        "quantisation",
        "cost"
      ],
      "why": "A scaling scenario with several valid answers - it tests whether you reason about trade-offs.",
      "simple": "You have four levers. Each one saves memory and costs something, and the good answer names that cost.\n\n**Quantisation** stores each number in fewer bits. Moving from 32-bit floats to 8-bit integers (int8) makes vectors about four times smaller, with a small recall loss. Binary quantisation keeps one bit per number, so it is far smaller, but it usually needs rescoring: re-checking the top candidates with the full vectors.\n\n**Shorter vectors.** Many models are Matryoshka-trained, meaning the first part of the vector still works on its own. OpenAI's text-embedding-3 models, for example, take a `dimensions` parameter. You keep, say, 512 of 1,024 numbers and lose a little quality.\n\n**A different index.** HNSW keeps everything in RAM. IVF-PQ groups vectors into clusters and compresses them heavily. Disk-based indexes such as DiskANN keep small compressed vectors in RAM and full vectors on SSD. Both use far less memory, paid for in some latency or recall.\n\n**Sharding** splits the index across machines. It solves memory but adds operations work and network hops.\n\nWhat I would actually do: quantise first because it is the cheapest change, measure recall, and shard only when one well-sized machine truly cannot hold the index. (The byte arithmetic is worked through in the quantization card in Advanced RAG.)",
      "points": [
        "int8 scalar quantisation - roughly 4× smaller, small recall loss. Try first.",
        "Binary quantisation - much smaller, needs rescoring against full vectors.",
        "Matryoshka-style truncation - fewer dimensions, graceful degradation, must be measured.",
        "IVF-PQ or a disk-based index instead of in-memory HNSW - much less memory, more tuning or latency, some recall loss.",
        "Sharding - solves memory, adds ops complexity and network latency.",
        "Always re-measure recall@k after any of these. They are all quality trades."
      ],
      "say": "Quantisation first, because it is the cheapest change - int8 cuts memory around fourfold for a small recall loss, and binary goes further if I add a rescoring pass over full-precision vectors. Then dimension truncation if the model supports it, or IVF-PQ or a disk-based index instead of in-memory HNSW, trading tuning, latency or some recall for memory. Sharding last. And I re-measure recall after each, because all of these are quality trades.",
      "numbers": "float32 → int8 is about 4× smaller. 200M vectors at 1024 dimensions is roughly 800 GB in float32, about 200 GB in int8 - plus the HNSW graph links, roughly another 25–30 GB at M = 16.",
      "wrong": "\"Add more RAM.\" Valid once, but it grows with the corpus. The follow-up asks what you do when that stops being affordable, and the answer needs the levers and their recall cost.",
      "follow": "You quantised and recall dropped 4 points. What next?"
    },
    {
      "id": "em-08",
      "q": "How do you evaluate retrieval at the embedding and index layer - and what are the two kinds of 'recall'?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "embeddings",
        "evaluation",
        "metrics"
      ],
      "why": "The RAG topic owns the metric definitions; this is the embeddings-layer version - telling 'the index missed the nearest vectors' apart from 'the nearest vectors were the wrong chunks'.",
      "simple": "**Short version: measure two things separately. Does the index return the true nearest vectors? And are those nearest vectors the right chunks?** The metric definitions, with a worked example, are in the RAG topic's Precision@k / Recall@k / MRR / nDCG card.\n\nFirst you need a labelled set: real questions, each paired with the chunk that answers it. Building it is the real work. Use a domain expert and real production questions, and add every reported failure.\n\n**Relevance check.** Recall@k asks how often the right chunk appears in the top k. It matters most for RAG, because the model only sees the top k. MRR (mean reciprocal rank) rewards putting the right chunk near the top.\n\n**Index check (ANN recall).** Approximate indexes like HNSW trade some accuracy for speed. Run the same queries through exact brute-force search and through the index. What fraction of the true top ten did the index return? If that is low, tune the index (for example efSearch) before blaming the model. If it is high but relevance recall is low, the embedding model or the chunking is the problem.\n\nNeither check needs an LLM call, so both are fast and cheap enough to run on every commit.\n\nFinally, slice the results. An average of 0.92 can hide one language or document type sitting at 0.6.",
      "points": [
        "Labelled set: question → the chunk that answers it. Built with a domain expert.",
        "Relevance recall@k is the metric that matters for RAG; MRR rewards ranking. ANN recall (index vs exact search) isolates index tuning.",
        "No model calls needed - run it on every commit.",
        "Slice by document type, language and tenant. Averages hide failing segments.",
        "Add every production failure to the set. That is how it stays honest."
      ],
      "say": "Two checks. Relevance: a labelled set of questions paired with the chunk that answers them, grown from production failures, scored with recall at k and MRR. Index: ANN recall - run the same queries through exact search and through the index, and see what fraction of the true top ten came back. That tells me whether to tune efSearch or blame the embedding model. Neither needs model calls, so both run on every commit, sliced by document type and language.",
      "numbers": "Useful bar: recall@10 above 0.90 before tuning the prompt. 100+ labelled pairs, or run-to-run noise exceeds the effect you are measuring. ANN recall@10 against exact search of 0.95–0.99 is a common index-tuning target.",
      "wrong": "\"We check whether the answers look right.\" That measures the whole pipeline at once, so a retrieval regression and a prompt regression are indistinguishable.",
      "follow": "Recall@10 is 0.95 but recall@3 is 0.6. What does that tell you?"
    },
    {
      "id": "em-09",
      "q": "When would you fine-tune an embedding model?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "embeddings",
        "fine-tuning",
        "advanced"
      ],
      "why": "A depth question. The senior answer is mostly about when not to.",
      "simple": "Rarely, and only after the cheaper options are exhausted, because fine-tuning an embedding model usually means re-embedding the whole corpus every time you retrain, and owning a model artefact from then on.\n\nThe case where it genuinely pays: your domain language is far from general web text and retrieval keeps failing on it. Medical coding, legal citation formats, internal product taxonomies where the same word means something specific to your company. In those cases a general model's map of meaning is simply wrong in your neighbourhood.\n\nWhat you need is training data in the form of pairs - a query and the document that should match it - ideally with hard negatives (documents that look right but are not). Production query logs plus click or thumbs-up signals are the best source; questions generated by an LLM from your own chunks are the common way to start before you have traffic, though they need spot-checking.\n\nAnd what to try first: hybrid search, reranking, better chunking and query rewriting. All four are cheaper, reversible and often solve the same problem.",
      "points": [
        "Try hybrid search, reranking, chunking and query rewriting first. All reversible.",
        "Fine-tune when domain language is genuinely far from general text.",
        "Needs query-document pairs plus hard negatives - from production logs and feedback, or LLM-generated from your chunks to start.",
        "Every retrain means re-embedding the whole corpus - unless you train only a query-side adapter.",
        "You now own a model artefact - versioning, hosting, drift, all yours.",
        "A reranker is often the better place to spend the same effort."
      ],
      "say": "Rarely, and only after hybrid search, reranking, better chunking and query rewriting have failed, because those are cheaper and reversible. It pays when domain language is genuinely far from general text - medical coding, internal taxonomies - where a general model's map is wrong in our neighbourhood. It needs query-document pairs mined from production logs, and every retrain means re-embedding the whole corpus. Often a reranker is the better spend.",
      "numbers": "A few thousand query-document pairs is a realistic starting point. With far fewer, the effort is usually better spent on a reranker.",
      "wrong": "\"We fine-tuned embeddings to improve accuracy.\" Without the alternatives tried and the re-embedding cost named, it reads as reaching for the most expensive option first.",
      "follow": "How would you get those query-document pairs without a labelling team?"
    },
    {
      "id": "em-10",
      "q": "You need to switch embedding models. Walk me through the migration.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "embeddings",
        "migration",
        "operations",
        "versioning"
      ],
      "why": "An operational scenario that catches anyone who has only built, never migrated.",
      "simple": "The first thing to say is that you cannot mix. Vectors from two models live in different spaces, so a query embedded with the new model compared against old vectors gives nonsense - not degraded results, nonsense. So this is a rebuild, not an update.\n\nThe sequence: build a second index alongside the live one, embedding the full corpus with the new model. Keep ingestion writing to both while you do it, or you will finish with a stale index. Run your labelled retrieval set against both and compare recall@k per segment, not just overall.\n\nThen shadow: send real production queries to both, log both result sets, and compare without showing users anything. That catches the queries your labelled set never contained.\n\nThen cut over behind a flag, keep the old index warm for a rollback window, and only then decommission it.\n\nAnd the detail that shows experience: your chunks carry the embedding model version, so at any moment you can tell which model produced which vector.",
      "points": [
        "Never mix vectors from two models. Different spaces, meaningless comparisons.",
        "Build the new index in parallel; dual-write during ingestion.",
        "Compare recall@k per segment on the labelled set, not just overall.",
        "Shadow real production queries against both, visible to nobody.",
        "Cut over behind a flag; keep the old index warm for rollback.",
        "Version stamp on every chunk: which model produced this vector."
      ],
      "say": "It is a rebuild, not an update, because vectors from two models are in different spaces and comparing across them gives nonsense. I build the new index in parallel with dual-write ingestion, compare recall at k per segment on the labelled set, then shadow real production queries against both with nothing shown to users. Then cut over behind a flag and keep the old index warm for rollback.",
      "numbers": "Budget the full re-embedding cost and time up front - for a large corpus this is a real spend and a multi-day job, not an afternoon.",
      "wrong": "\"We would re-embed everything and switch.\" The right shape, missing the parallel index, the comparison and the rollback - which is where the risk actually is.",
      "follow": "Halfway through the rebuild, ingestion breaks. What state are you in?"
    }
  ]
};
