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
      "quick": [
        "An embedding is a list of numbers showing meaning.",
        "Texts with similar meaning get similar numbers.",
        "Leave policy lands near time-off rules, with no shared words.",
        "Documents are turned into numbers early, questions at ask time.",
        "A general model handles company slang poorly, so search fails."
      ],
      "simple": "An embedding is a list of numbers that represents meaning. A model reads a piece of text and produces a fixed-length vector, trained so that texts with similar meaning produce similar number lists. Think of it as a map of meaning, where 'leave policy' and 'time-off entitlement' end up close together even though they share no words.\n\nThat is why semantic search works. We embed our documents ahead of time, then embed the user's question and return the documents whose vectors sit nearest to it. For example, if an employee asks 'how many days off do I get?', the search can find the time-off entitlement section without a single matching keyword.\n\nBut the map is only as good as the model that drew it. A model trained on general web text has a poor map of a company's internal jargon, and that is where retrieval quietly fails.",
      "points": [
        "A fixed-length vector of numbers representing meaning.",
        "Trained so similar meaning lands nearby.",
        "Documents are embedded ahead of time; the query is embedded at request time.",
        "Domain jargon is where general-purpose models have the weakest map."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Text goes through an embedding model to become a vector, and search returns the nearest vectors, which have similar meaning.",
        "caption": "An embedding is a **map of meaning**: similar meaning lands close together. The map is only as good as the model that drew it, so domain jargon is where it fails.",
        "lanes": [
          {
            "label": "Text",
            "note": "\"leave policy\""
          },
          {
            "label": "Embedding model",
            "note": "draws the map of meaning",
            "accent": "warn"
          },
          {
            "label": "Vector",
            "note": "e.g. 1,024 numbers"
          },
          {
            "label": "Nearest on the map",
            "note": "\"time-off entitlement\"",
            "accent": "accent"
          }
        ]
      },
      "say": "An embedding is a list of numbers that represents meaning, trained so that similar meanings land close together. A model reads a piece of text and produces, say, a thousand numbers. So 'leave policy' and 'time-off entitlement' end up near each other even though they share no words, and that's why semantic search works. We embed the documents ahead of time, embed the question at request time, and return the documents whose vectors sit nearest the question's. The dimension, anywhere from 384 to a few thousand, drives storage and search cost, and many current models let you keep a shorter prefix to save money. The part people miss is that the map is only as good as the model that drew it. A model trained on general web text has a poor picture of a company's internal jargon, and that's exactly where retrieval quietly fails.",
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
      "quick": [
        "It stores number lists and finds the closest ones fast.",
        "Storing is easy, searching by closeness is the hard part.",
        "Normal indexes handle exact values, not closeness.",
        "Checking every item is exact but too slow at scale.",
        "Many normal databases now do this too, like Postgres."
      ],
      "simple": "A vector database stores embeddings and finds the ones nearest to a query vector, fast. Storing vectors is easy. Searching them by closeness is the hard part, and a normal index such as a B-tree is built for exact values and ranges, not for 'which of these ten million vectors are closest to this one?'\n\nWithout a special index, you must compare the query with every vector. That is exact but too slow at scale. For example, exact search over one million 768-dimension vectors often takes around a hundred milliseconds on a CPU. So vector databases use approximate indexes such as HNSW, which return almost the true top results in a few milliseconds, plus metadata filters, updates and replication.\n\nMany normal databases now do this too, such as Postgres with pgvector, so the real decision is whether you need a separate engine at all.",
      "points": [
        "Stores embeddings plus metadata; its core job is fast **nearest-neighbour search**.",
        "B-tree indexes serve exact matches and ranges, not \"closest in 1,024 dimensions\".",
        "Exact kNN compares the query with every vector: perfect recall, slow at scale.",
        "ANN indexes (HNSW, IVF) trade a little recall for a large speed-up.",
        "Production features: filtering, upserts and deletes, persistence, replication, hybrid search.",
        "Postgres (pgvector), Elasticsearch/OpenSearch, MongoDB and Redis now offer vector search too."
      ],
      "say": "It stores embeddings and finds the ones nearest a query vector, fast, and the searching is the hard part, not the storage. A normal index like a B-tree is built for exact values and ranges, such as customer ID equals 42. It can't answer which of ten million vectors are closest to this one. Without a special index you compare the query with every vector, which is exact but too slow at scale. A million 768-dimension vectors means scanning about three gigabytes per query. So vector databases use approximate nearest neighbour indexes like HNSW or IVF, which skip most comparisons and return around 95 to 99 percent of the true top results in a few milliseconds. Around that they add filters, deletes, persistence and replication. The senior point is that Postgres with pgvector, Elasticsearch and Redis now do this too, so the real question is whether we need a separate engine at all. And no database rescues a weak embedding model.",
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
      "quick": [
        "Use the measure the model was trained with.",
        "A mismatch quietly hurts ranking with no error.",
        "Cosine checks direction, dot product adds length, Euclidean measures distance.",
        "If numbers are scaled to length one, all rank the same.",
        "Check the model card, then test on real labelled questions."
      ],
      "simple": "The right answer is to use whichever similarity metric the embedding model was trained with. That is a compatibility rule, not a matter of taste. If a model was trained with dot product and you search with cosine, the ranking changes and quality drops, with no error to warn you.\n\nCosine compares only the direction of two vectors, dot product uses direction and length, and Euclidean is the straight-line gap. When a model outputs normalised vectors, all of length 1, the three give the same ranking, so the cheap dot product is the usual pick. That is why teams mix them up and never notice. For example, a team switches to a model that doesn't normalise, keeps the old cosine setting, and results get quietly worse.\n\nSo read the model card, set the index metric to match, and confirm ranking quality on real labelled queries.",
      "points": [
        "Match the metric the model was trained with. Check the model card.",
        "Cosine - direction only. Dot product - direction and magnitude. Euclidean - straight-line distance.",
        "For normalised vectors, cosine, dot product and Euclidean all produce the same ranking.",
        "Many popular models output normalised vectors - check, do not assume.",
        "Verify with a labelled retrieval set. The setting is not the proof."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of cosine, dot product and Euclidean distance by what they measure, whether length counts, and behaviour on normalised vectors.",
        "caption": "**Use the metric the model was trained with.** On normalised vectors all three rank the same, which is why a mismatch often works by luck.",
        "aspects": [
          "Measures",
          "Vector length counts?",
          "On normalised vectors",
          "Cost"
        ],
        "columns": [
          {
            "label": "Cosine",
            "note": "angle between vectors",
            "cells": [
              "Direction only",
              "No",
              "Same ranking",
              "Normalise, then dot"
            ]
          },
          {
            "label": "Dot product",
            "note": "usual pick if normalised",
            "accent": "accent",
            "cells": [
              "Direction and length",
              "Yes",
              "Same ranking",
              "Cheapest"
            ]
          },
          {
            "label": "Euclidean",
            "note": "straight-line gap",
            "cells": [
              "Distance between points",
              "Yes",
              "Same ranking (2 - 2cos)",
              "Slightly more work"
            ]
          }
        ]
      },
      "say": "Whichever metric the embedding model was trained with. That's a compatibility rule, not a preference, and a mismatch hurts ranking silently. Cosine compares only the direction of two vectors. Dot product uses direction and length together, and Euclidean is the straight-line distance between the points. Many models output normalised vectors, scaled to length one, and then all three give the same ranking, because squared Euclidean distance is just two minus two times the cosine. Dot product is the cheapest to compute, so it's the usual pick for normalised vectors. That's also why teams mix up cosine and dot product and never notice. It works by luck, and it breaks on a model that doesn't normalise, where dot product starts rewarding longer vectors. So I read the model card, set the index metric to match, and confirm the ranking on real labelled queries rather than trusting the config.",
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
      "quick": [
        "Test on your own data, not public leaderboards.",
        "First rule out models by location, language and input length.",
        "Build about 100 real questions paired with correct answers.",
        "Compare how often the right text lands in the top ten.",
        "Switching later means reprocessing every document, so choose carefully."
      ],
      "simple": "Choosing an embedding model means testing candidates on your own data, not picking from a public leaderboard. Leaderboards such as MTEB measure general tasks, so a model that ranks high overall can be weak on insurance wording or telecom part numbers.\n\nFirst, apply the hard limits, such as where our data may go, which languages we need and how long an input can be. Then build a labelled set of about a hundred real questions, each paired with the chunk that answers it, and compare each candidate's recall@10, meaning how often the right chunk lands in the top ten. After quality, running costs decide it. For example, if two models score almost the same recall on our insurance questions, the one with shorter vectors and lower latency wins.\n\nTreat the choice as sticky, because switching later means re-embedding the whole corpus.",
      "points": [
        "Constraints first: tenancy, self-hosting, languages, max input length.",
        "Labelled set from your own corpus, roughly 100 pairs.",
        "Compare recall@10, not benchmark rank.",
        "Weigh dimension - it drives storage and query cost.",
        "Switching later means re-embedding everything. Decide deliberately."
      ],
      "say": "I test candidates on our own data, because a public leaderboard like MTEB measures general tasks and our corpus isn't general. Hard limits come first, since they knock models out before any testing. Where is our data allowed to go, or must we self-host? Which languages do we need, say mixed Hindi and English? How long an input can it take? Then I build about a hundred real questions, each paired with the chunk that answers it, written by someone who knows the domain. I embed the corpus with each candidate and compare recall at ten, meaning how often the right chunk lands in the top ten. That size separates a clear gap, but close calls need a few hundred. After quality, running costs decide it. Dimension drives storage and search cost, and query latency matters because every question is embedded live. And I treat the choice as sticky, because switching means re-embedding the whole corpus.",
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
      "quick": [
        "HNSW links each item to its close neighbours in layers.",
        "Search starts on top with big jumps, then refines lower down.",
        "More links per item means better results but more memory.",
        "The search width setting trades accuracy for speed.",
        "Raise the search width anytime without rebuilding."
      ],
      "simple": "HNSW is the most common way to do approximate nearest neighbour search. Comparing a query against every vector is exact but far too slow at scale, so we accept a tiny loss of accuracy for a big speed-up.\n\nIt builds a layered graph where each vector links to its near neighbours. A search starts in the sparse top layer, takes big jumps to the right region, then drops down layer by layer, refining as it goes, like taking the motorway to the right city, then main roads, then the street. M sets how many links each node keeps, so higher M means better recall and more memory. efSearch is the query-time knob, where a higher value explores more and gives better recall but slower queries.\n\nFor example, if recall is poor but you cannot afford a rebuild, raise efSearch. The trade-off is memory, because HNSW keeps everything in RAM.",
      "points": [
        "Multi-layer proximity graph: sparse layers for coarse navigation, dense for refinement.",
        "M - connections per node. Higher recall, more memory.",
        "efConstruction - build-time quality. Higher is slower to build, better graph.",
        "efSearch - query-time breadth. Higher recall, slower queries, no rebuild needed.",
        "Approximate by design. You choose the recall you pay for.",
        "HNSW is memory-hungry - one reason teams turn to quantisation, IVF-PQ or disk-based indexes such as DiskANN."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "HNSW layers from a sparse top layer with long jumps down to a dense bottom layer, with the parameters that control it.",
        "caption": "HNSW searches **coarse to fine** down a layered graph. M costs memory, efConstruction costs build time, and **efSearch** trades recall for speed per query, no rebuild.",
        "top": "query enters at the top",
        "bottom": "approximate top k",
        "layers": [
          {
            "label": "Top layer: sparse",
            "note": "motorway: long jumps"
          },
          {
            "label": "Middle layers",
            "note": "main roads: narrow in"
          },
          {
            "label": "Bottom layer: dense",
            "note": "street: every vector, refine",
            "accent": "accent"
          }
        ]
      },
      "say": "HNSW builds a layered graph of near neighbours and searches it from coarse to fine. The top layers are sparse, with long-range links, and the lower layers are dense. A search enters at the top, takes big jumps to reach roughly the right region, then drops down layer by layer to refine. It's like taking the motorway to the right city, then main roads, then the final street. The parameters trade recall, memory and speed. M is connections per node, so higher gives better recall and more memory, and sixteen is a common start. efConstruction sets build quality against build time. efSearch controls how much of the graph each query explores, and the useful thing is that it's tunable per query without a rebuild. So when recall is poor and a rebuild isn't affordable, that's the lever I reach for. The catch is memory, since HNSW keeps everything in RAM, which pushes big deployments towards quantisation or disk-based indexes.",
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
      "quick": [
        "When the filter runs decides lost results or lost speed.",
        "Filtering after search is fast but can return almost nothing.",
        "Filtering before search is correct but can be slow.",
        "Good engines filter during the search itself.",
        "Enforce access on the server, and test with filters on."
      ],
      "simple": "Real vector searches almost always carry a metadata filter, such as this tenant or this access group. When the engine applies that filter decides whether you lose results or lose speed.\n\nPost-filtering searches first and then removes results that fail the filter. It is fast, but with a strict filter you might fetch the top 100 and keep only three, so users see 'the vector database returns nothing'. Pre-filtering narrows to matching items first, which is correct, but a naive version struggles because those items can be poorly connected in the HNSW graph. Good engines apply the filter during the graph walk and switch to brute force when very few items match.\n\nFor example, a system that scores 0.95 recall unfiltered can sit far lower with a selective tenant filter, so always measure recall with the filters switched on.",
      "points": [
        "Post-filter - fast, recall collapses on selective filters.",
        "Pre-filter - correct; naive versions get slow or lose recall on mid-selectivity filters.",
        "Filtered graph traversal is the good behaviour. Check whether your engine does it.",
        "Access control: enforced server-side before the model, ideally pre-filter. Post-filter is not a leak, but returns fewer than k.",
        "Tenant isolation: partition (namespaces, partition keys, per-tenant collections) rather than one big filter.",
        "Test recall *with* filters applied. Unfiltered recall is not representative."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of post-filtering, pre-filtering and filtered graph search by order of operations, speed, recall and main risk.",
        "caption": "**When the filter is applied decides whether you lose results or lose speed.** Know what your engine does and test recall with filters on.",
        "aspects": [
          "Order",
          "Speed",
          "Recall",
          "Risk"
        ],
        "columns": [
          {
            "label": "Post-filter",
            "note": "search, then drop",
            "accent": "bad",
            "cells": [
              "Search, then filter",
              "Fast",
              "Collapses on strict filters",
              "Top 100 becomes 3"
            ]
          },
          {
            "label": "Pre-filter",
            "note": "filter, then search",
            "accent": "warn",
            "cells": [
              "Filter, then search",
              "Naive versions get slow",
              "Correct",
              "Mid-selectivity filters struggle"
            ]
          },
          {
            "label": "Filtered search",
            "note": "what good engines do",
            "accent": "accent",
            "cells": [
              "Filter during graph walk",
              "Fast",
              "Good",
              "Check your engine does it"
            ]
          }
        ]
      },
      "say": "When the engine applies the filter decides whether you lose results or lose speed. Real searches nearly always carry a filter, like this tenant or this access group. Post-filtering searches first and then drops results that fail the filter. It's fast, but with a strict tenant filter you might fetch the top hundred and keep three, so recall collapses and users report that search returns nothing. Pre-filtering narrows to matching items first, which is correct, but a naive version can get slow or lose recall, because the graph was built over everything. Good engines apply the filter during the graph walk and switch to brute force when the filter is very strict. For access control, I enforce the filter on the server before any chunk reaches the model. For tenant isolation, I partition the data rather than rely on one big filter. And I always measure recall with filters on, because unfiltered recall flatters the system.",
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
      "quick": [
        "Start from what you already run.",
        "pgvector adds this search inside Postgres.",
        "You get joins, one backup plan and changes saved together.",
        "A dedicated vector database wins at very large scale.",
        "Decide on size, traffic, speed and filters, and set a switch point."
      ],
      "simple": "The choice between pgvector and a dedicated vector database should start from what you already run, because a new datastore brings its own backups, access control and on-call.\n\npgvector adds vector search to Postgres. It is a strong choice when the data fits comfortably, when you need joins with business data such as permissions, and when the team already runs Postgres well. You also get transactions, so a document and its vector change together. A dedicated database earns its place at large scale, with sharding, strong filtered search and built-in hybrid search. The gap has narrowed, though. For example, pgvector with HNSW commonly runs at single-digit to tens of millions of vectors on one well-sized node.\n\nSo don't declare a winner. Name the numbers that would make you switch, such as corpus size, queries per second and p95 latency, and agree that trigger in advance.",
      "points": [
        "pgvector: relational joins, one backup and access story, transactional consistency.",
        "Dedicated: horizontal scale, filtered search quality, hybrid built in, managed quantisation and multi-vector.",
        "Decide on corpus size, QPS, p95 latency and filter selectivity.",
        "Adding a datastore adds on-call, backup and access-control surface. Price that in.",
        "State the migration trigger in advance, so the switch is a decision rather than a fire."
      ],
      "say": "I start from what we already run, because a new datastore brings its own backups, access control and on-call, and that cost is usually underestimated. pgvector is strong when the corpus and traffic fit comfortably in Postgres, when we need joins with business data like permissions, and when the team already runs Postgres well. It also gives transactions, so a document and its vector change together or not at all, which people forget. A dedicated engine earns its place at large scale, with sharding across machines, strong filtered search, built-in hybrid search and managed quantisation. The gap has narrowed, though. pgvector now has HNSW, half-precision vectors and iterative scans for filtered queries, and it commonly runs at millions to tens of millions of vectors on one node. So I don't declare a winner. I decide on corpus size, queries per second, p95 latency and filter selectivity, and I agree the migration trigger in advance.",
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
      "quick": [
        "Dense uses a few hundred meaningful numbers.",
        "Dense is great at same meaning, weak on exact codes.",
        "Sparse gives each vocabulary word a score, mostly zeros.",
        "BM25 rewards matching rare words, with no training needed.",
        "SPLADE learns word scores and adds related words."
      ],
      "simple": "Dense and sparse embeddings are two ways of turning text into vectors, and hybrid search uses both. A dense embedding is a short list of numbers where almost every number is non-zero, so meaning is spread across all of them. It is great at paraphrase but weaker on exact rare strings like part numbers.\n\nA sparse vector has one slot for every word in a vocabulary, and almost all of them are zero. BM25 is the classic sparse method and needs no training, scoring documents higher when they contain the query's words, especially rare ones. SPLADE is learned sparse, so a model weights the words and adds related ones, such as 'vehicle' for a text about cars.\n\nFor example, on a catalogue full of product codes, BM25 still beats dense search. So hybrid search runs both and merges the lists, usually with reciprocal rank fusion.",
      "points": [
        "**Dense:** hundreds to a few thousand non-zero numbers. Strong on meaning and paraphrase, weak on rare exact terms.",
        "**Sparse:** one weight per vocabulary term, mostly zeros, served from an inverted index.",
        "**BM25:** untrained sparse scoring - term rarity (IDF), term frequency with saturation, document-length normalisation.",
        "**SPLADE:** learned sparse - model-assigned term weights plus expansion terms. Exact match with some semantics.",
        "Default: hybrid dense + sparse, fused by rank (RRF). BGE-M3 emits dense and sparse from one model."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of dense embeddings, BM25 and SPLADE by vector shape, training, strengths, weaknesses and how they are served.",
        "caption": "Dense spreads **meaning across every number**; sparse **weights individual words**. In production run both and merge the lists with RRF.",
        "aspects": [
          "Shape",
          "Trained?",
          "Strong at",
          "Weak at",
          "Served from"
        ],
        "columns": [
          {
            "label": "Dense",
            "note": "384 to 3,072 numbers",
            "accent": "accent",
            "cells": [
              "Almost all non-zero",
              "Yes, neural",
              "Paraphrase, meaning",
              "Rare exact strings",
              "Vector index"
            ]
          },
          {
            "label": "BM25",
            "note": "classic sparse",
            "cells": [
              "Mostly zeros, word slots",
              "No training",
              "Exact rare terms",
              "Synonyms, paraphrase",
              "Inverted index"
            ]
          },
          {
            "label": "SPLADE",
            "note": "learned sparse",
            "cells": [
              "Mostly zeros, plus expansions",
              "Yes, neural",
              "Exact match, some meaning",
              "Needs model inference",
              "Inverted index"
            ]
          }
        ]
      },
      "say": "Dense embeddings spread meaning across every number, while sparse vectors weight individual words, and hybrid search uses both. A dense vector is a few hundred to a few thousand numbers, almost all non-zero. It's great at paraphrase but weaker on exact rare strings like part numbers. A sparse vector has one slot per vocabulary word, mostly zeros, so it's served from an inverted index, the way classic search engines work. BM25 is the classic sparse method and needs no training. It rewards documents containing the query's words, especially rare ones, with limits so repetition or sheer length can't win unfairly. SPLADE is learned sparse, where a model weights the words and adds related ones that aren't in the text, so you keep exact matching and gain some meaning. On a catalogue full of product codes, BM25 still beats dense search. So in production I run dense and sparse together and merge the lists, usually with reciprocal rank fusion.",
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
      "quick": [
        "Choose by data size, memory and how often data changes.",
        "Flat checks everything, exact and fine when small.",
        "IVF groups items and searches only the nearest groups.",
        "HNSW is fastest for good results, but uses most memory.",
        "Small means flat, fits memory means HNSW, huge means compressed."
      ],
      "simple": "Most real systems use one of three index families, flat, IVF or HNSW, and the choice depends on data size, memory and how often the data changes.\n\nFlat means no index, so every query is compared with every vector. It is exact, right for small collections, and the ground truth for measuring the others. IVF groups vectors into clusters and searches only the few nearest clusters, like walking to the three most relevant library shelves instead of reading every book. It uses little memory, but the clusters go stale if new data looks different. HNSW is a graph index that usually gives the best speed for a given recall and handles inserts well, but it uses the most memory.\n\nFor example, as a rough rule, small means flat, fits in RAM means HNSW, and huge or memory-bound means IVF-PQ or a disk-based index such as DiskANN.",
      "points": [
        "**Flat:** exact, no tuning, slow at scale - and the ground truth for measuring ANN recall.",
        "**IVF:** k-means clusters; search the `nprobe` nearest of `nlist` clusters. Low memory, fast build, needs training and periodic retraining.",
        "**IVF-PQ:** IVF plus compressed codes - billion-scale on modest memory, with rescoring to recover accuracy.",
        "**HNSW:** best recall for latency in RAM, good with inserts, most memory, slow build.",
        "Deletes are awkward in graph indexes (often tombstoned) - plan compaction or rebuilds."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of flat, IVF and HNSW indexes by recall, memory, build, updates and when to use each.",
        "caption": "**Small: flat. Fits in RAM: HNSW. Huge or memory-bound: IVF-PQ or disk-based.** Flat is also the ground truth for measuring the others.",
        "aspects": [
          "How it searches",
          "Recall",
          "Memory",
          "Build and updates",
          "Pick when"
        ],
        "columns": [
          {
            "label": "Flat",
            "note": "no index",
            "cells": [
              "Compare with every vector",
              "Exact",
              "Just the vectors",
              "No tuning or training",
              "Small collections"
            ]
          },
          {
            "label": "IVF / IVF-PQ",
            "note": "k-means clusters",
            "accent": "warn",
            "cells": [
              "Search nprobe nearest clusters",
              "Tune with nprobe",
              "Low; PQ compresses more",
              "Needs training, retrain when stale",
              "Memory-bound or billions"
            ]
          },
          {
            "label": "HNSW",
            "note": "layered graph",
            "accent": "accent",
            "cells": [
              "Walk the neighbour graph",
              "Best for the latency",
              "Most memory",
              "Slow build, good inserts",
              "Fits in RAM"
            ]
          }
        ]
      },
      "say": "It comes down to data size, memory and how often the data changes. Flat means no index, so every query is compared with every vector. It's exact, needs no tuning, and suits small collections, and it's also the ground truth I measure other indexes against. IVF clusters the vectors with k-means and searches only the few clusters nearest the query. Picture walking to the three most relevant shelves instead of reading every book. It's light on memory and quick to build, but it needs training, and the clusters go stale when new data looks different. HNSW is a graph index that usually gives the best speed for a given recall and copes well with steady inserts, but it uses the most memory and builds slowly. Deletes are awkward in graphs, so plan for compaction. My rough rule is small means flat, fits in RAM means HNSW, and huge means IVF-PQ with compressed vectors, or a disk-based index.",
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
      "quick": [
        "There are four options, each trading some quality.",
        "Store numbers with fewer bits, about four times smaller.",
        "Keep only the first part of each number list.",
        "Use a compressed or disk-based index instead.",
        "Split across machines last, and re-test search quality after."
      ],
      "simple": "When your vector index no longer fits in memory, you have four levers, and each saves memory at some cost in recall, latency or operations.\n\nQuantisation comes first because it is cheapest. It stores each number in fewer bits. For example, moving 200 million 1,024-dimension vectors from 32-bit floats to 8-bit integers shrinks them from about 800 GB to about 200 GB, with a small recall loss. Next, many models are Matryoshka-trained, so you can keep a shorter prefix of each vector. Then you can switch index, since IVF-PQ and disk-based indexes such as DiskANN use far less RAM than HNSW. Last, sharding splits the index across machines, but adds operations work and network hops.\n\nSo quantise first, then measure, and shard only when one well-sized machine truly cannot hold the index. Whatever you change, re-measure recall@k.",
      "points": [
        "int8 scalar quantisation - roughly 4× smaller, small recall loss. Try first.",
        "Binary quantisation - much smaller, needs rescoring against full vectors.",
        "Matryoshka-style truncation - fewer dimensions, graceful degradation, must be measured.",
        "IVF-PQ or a disk-based index instead of in-memory HNSW - much less memory, more tuning or latency, some recall loss.",
        "Sharding - solves memory, adds ops complexity and network latency.",
        "Always re-measure recall@k after any of these. They are all quality trades."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Levers for an index that no longer fits in memory, in the order to try them, each with its cost.",
        "caption": "Every lever **saves memory at a cost**. Quantise first because it is cheapest, shard last, and **re-measure recall@k** after every change.",
        "lanes": [
          {
            "label": "int8 quantisation",
            "note": "about 4x smaller, small loss",
            "accent": "accent"
          },
          {
            "label": "Binary quantisation",
            "note": "far smaller, needs rescoring"
          },
          {
            "label": "Shorter vectors",
            "note": "Matryoshka, e.g. 512 of 1,024"
          },
          {
            "label": "Different index",
            "note": "IVF-PQ or DiskANN, more latency"
          },
          {
            "label": "Sharding",
            "note": "more ops and network hops",
            "accent": "warn"
          }
        ]
      },
      "say": "You have four levers, and each saves memory at some cost to recall, latency or operations. Quantisation comes first because it's cheapest. Going from 32-bit floats to int8 makes vectors about four times smaller with a small recall loss, so 200 million vectors at 1,024 dimensions drop from roughly 800 gigabytes to about 200. Binary quantisation goes much further but needs rescoring the top candidates against full vectors. Next is shorter vectors, if the model is Matryoshka-trained, meaning the first part of the vector still works on its own. Then a different index, like IVF-PQ or a disk-based one such as DiskANN, which keeps compressed vectors in RAM and costs some latency or recall. Sharding across machines comes last. It solves memory but adds operations work and network hops. Adding RAM works once, but the corpus keeps growing. Whatever I change, I re-measure recall at k, because every one of these is a quality trade.",
      "numbers": "float32 → int8 is about 4× smaller. 200M vectors at 1024 dimensions is roughly 800 GB in float32, about 200 GB in int8 - plus the HNSW graph links, roughly another 25–30 GB at M = 16.",
      "wrong": "\"Add more RAM.\" Valid once, but it grows with the corpus. The follow-up asks what you do when that stops being affordable, and the answer needs the levers and their recall cost.",
      "follow": "You quantised and recall dropped 4 points. What next?",
      "followAnswer": "First I check whether the loss matters, by looking at which queries lost their right chunk and whether they cluster in one segment. The usual fix is rescoring. I fetch a bigger candidate set from the quantised index, say the top hundred, and re-rank those with full-precision vectors kept on disk, which typically wins back most of the loss for little latency. If it doesn't, I raise efSearch, try gentler quantisation or add a reranker, then re-measure recall at k."
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
      "quick": [
        "Measure two kinds of recall separately.",
        "Build real questions paired with the right answer text.",
        "First, how often the right text is in the top results.",
        "Second, does the fast index match a full exact search.",
        "Low index match means tune the index, else fix the model."
      ],
      "simple": "Evaluating retrieval at the embedding and index layer means measuring two kinds of recall separately, because they point to different fixes. One asks whether the index returns the true nearest vectors. The other asks whether those nearest vectors are actually the right chunks.\n\nBoth need a labelled set of 100 or more real questions, each paired with the chunk that answers it. Relevance recall@k asks how often the right chunk appears in the top k, which matters most for RAG because the model only sees the top k. ANN recall checks the index itself, by running the same queries through exact brute-force search and through the index and asking what fraction of the true top ten came back.\n\nFor example, if ANN recall is low, you tune the index, say efSearch, before blaming the model. If it is high but relevance recall is low, the embedding model or the chunking is the problem.",
      "points": [
        "Labelled set: question → the chunk that answers it. Built with a domain expert.",
        "Relevance recall@k is the metric that matters for RAG; MRR rewards ranking. ANN recall (index vs exact search) isolates index tuning.",
        "No model calls needed - run it on every commit.",
        "Slice by document type, language and tenant. Averages hide failing segments.",
        "Add every production failure to the set. That is how it stays honest."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "Two-by-two grid of ANN recall (index versus exact search) against relevance recall@k, showing which part to fix in each case.",
        "caption": "Measure **two recalls** separately: ANN recall says whether the index found the true nearest vectors; relevance recall says whether those were the right chunks.",
        "xLabel": "Relevance recall@k",
        "yLabel": "ANN recall",
        "cols": [
          "High",
          "Low"
        ],
        "rows": [
          "High",
          "Low"
        ],
        "cells": [
          [
            {
              "label": "Healthy",
              "note": "slice by segment anyway",
              "accent": "accent"
            },
            {
              "label": "Fix model or chunking",
              "note": "index is fine",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "Tune the index",
              "note": "e.g. raise efSearch",
              "accent": "warn"
            },
            {
              "label": "Tune the index first",
              "note": "then re-check relevance",
              "accent": "warn"
            }
          ]
        ]
      },
      "say": "I measure two kinds of recall separately, because they point to different fixes. Both need a labelled set of real questions, each paired with the chunk that answers it, and building that with a domain expert is the real work. Relevance recall at k asks how often the right chunk appears in the top k. That matters most for RAG, because the model only ever sees the top k, and MRR adds credit for ranking it near the top. ANN recall asks whether the index returned the true nearest vectors, so I run the same queries through exact search and through the index and compare the top ten. If ANN recall is low, I tune the index, say efSearch, before blaming the model. If it's high but relevance is low, the embedding model or chunking is at fault. Neither needs LLM calls, so both run on every commit. And I slice by language and document type, because a 0.92 average can hide a segment at 0.6.",
      "numbers": "Useful bar: recall@10 above 0.90 before tuning the prompt. 100+ labelled pairs, or run-to-run noise exceeds the effect you are measuring. ANN recall@10 against exact search of 0.95–0.99 is a common index-tuning target.",
      "wrong": "\"We check whether the answers look right.\" That measures the whole pipeline at once, so a retrieval regression and a prompt regression are indistinguishable.",
      "follow": "Recall@10 is 0.95 but recall@3 is 0.6. What does that tell you?",
      "followAnswer": "It tells me retrieval is finding the right chunk but ranking it poorly, so it's an ordering problem, not a recall problem. If the model only sees the top three, the right chunk is missing from its context on roughly four questions in ten, even though it was found. So I add a cross-encoder reranker over the top twenty or fifty, which is exactly the fix for this pattern, or pass more chunks if the context budget allows. Then I re-check recall at three and MRR."
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
      "quick": [
        "Rarely, and only after cheaper fixes fail.",
        "Try better search, sorting and document splitting first.",
        "It pays when your field's wording is far from normal text.",
        "You need a few thousand question and answer pairs.",
        "Every retrain means reprocessing all documents again."
      ],
      "simple": "You should fine-tune an embedding model rarely, and only after the cheaper options are exhausted. Every retrain usually means re-embedding the whole corpus, and from then on you own a model, with its versioning, hosting and drift.\n\nSo first try hybrid search, reranking, better chunking and query rewriting, which are cheaper, reversible and often solve the same problem. Fine-tuning genuinely pays when your domain language is far from general web text and retrieval keeps failing on it. For example, in medical coding or an internal product taxonomy, a general model's map of meaning is simply wrong in your neighbourhood.\n\nIf you go ahead, you need pairs of a query and the document that should match it, ideally from production logs with click signals, and a few thousand is a realistic start. With far fewer, the effort is usually better spent on a reranker.",
      "points": [
        "Try hybrid search, reranking, chunking and query rewriting first. All reversible.",
        "Fine-tune when domain language is genuinely far from general text.",
        "Needs query-document pairs plus hard negatives - from production logs and feedback, or LLM-generated from your chunks to start.",
        "Every retrain means re-embedding the whole corpus - unless you train only a query-side adapter.",
        "You now own a model artefact - versioning, hosting, drift, all yours.",
        "A reranker is often the better place to spend the same effort."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Ladder of fixes to try in order, from hybrid search, reranking, better chunking and query rewriting, with fine-tuning the embedding model last.",
        "caption": "**Fine-tune last.** The first four are cheap and reversible; fine-tuning means re-embedding on every retrain and owning a model. Only for domain language far from web text.",
        "lanes": [
          {
            "label": "Hybrid search",
            "note": "cheap, reversible",
            "accent": "accent"
          },
          {
            "label": "Reranking",
            "note": "often the better spend",
            "accent": "accent"
          },
          {
            "label": "Better chunking",
            "note": "cheap, reversible",
            "accent": "accent"
          },
          {
            "label": "Query rewriting",
            "note": "cheap, reversible",
            "accent": "accent"
          },
          {
            "label": "Fine-tune embeddings",
            "note": "few thousand pairs, re-embed",
            "accent": "warn"
          }
        ]
      },
      "say": "Rarely, and only after cheaper fixes have run out, because every retrain means re-embedding the whole corpus and owning a model artefact from then on. Hybrid search, reranking, better chunking and query rewriting are all cheaper, reversible and often solve the same problem, so they go first. Fine-tuning genuinely pays when the domain language sits far from general web text and retrieval keeps failing on it. Medical coding, legal citation formats and internal product taxonomies are the classic cases, where a general model's map of meaning is just wrong in your neighbourhood. Then I need a few thousand query-document pairs, ideally with hard negatives, meaning documents that look right but aren't. Production logs with click or thumbs-up signals are the best source, and LLM-generated questions from our own chunks can get us started if they're spot-checked. With far fewer pairs than that, I'd spend the same effort on a reranker instead.",
      "numbers": "A few thousand query-document pairs is a realistic starting point. With far fewer, the effort is usually better spent on a reranker.",
      "wrong": "\"We fine-tuned embeddings to improve accuracy.\" Without the alternatives tried and the re-embedding cost named, it reads as reaching for the most expensive option first.",
      "follow": "How would you get those query-document pairs without a labelling team?",
      "followAnswer": "I mine them from what we already have. Search and chat logs give real queries, and clicks, thumbs-up or a chunk cited in a well-rated answer give the positive document. Where logs are thin, I have an LLM write a few plausible questions for each chunk, so the source chunk is the label, and I spot-check a sample. For hard negatives I take chunks the current model ranks highly that aren't the answer, filtering out any that are secretly correct."
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
      "quick": [
        "You cannot mix numbers from two embedding models.",
        "Build a new index next to the live one.",
        "Keep new documents going into both while you build.",
        "Compare both quietly on real questions before switching.",
        "Switch behind a flag and keep the old one ready."
      ],
      "simple": "Switching embedding models is a rebuild, not an update. Vectors from two models live in different spaces, so a new-model query compared against old document vectors gives nonsense, not slightly worse results. You can never mix them.\n\nFirst, build a second index alongside the live one and embed the full corpus with the new model, while ingestion writes to both. Then compare recall@k on your labelled set per segment, and shadow real production queries to both indexes without users seeing anything. Finally, cut over behind a flag and keep the old index warm for a rollback window. For example, if the new model scores better overall but worse on one document type during shadowing, you find out before users do and can still roll back.\n\nBudget the re-embedding up front, because for a large corpus it is a real spend and a multi-day job.",
      "points": [
        "Never mix vectors from two models. Different spaces, meaningless comparisons.",
        "Build the new index in parallel; dual-write during ingestion.",
        "Compare recall@k per segment on the labelled set, not just overall.",
        "Shadow real production queries against both, visible to nobody.",
        "Cut over behind a flag; keep the old index warm for rollback.",
        "Version stamp on every chunk: which model produced this vector."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Steps to migrate embedding models: build a parallel index with dual writes, evaluate offline, shadow real traffic, cut over behind a flag, keep the old index for rollback, then decommission.",
        "caption": "**A rebuild, not an update**: vectors from two models never mix. Build alongside, prove it offline and in shadow, and keep the old index warm for rollback.",
        "lanes": [
          {
            "label": "Build new index",
            "note": "full re-embed, dual-write",
            "accent": "warn"
          },
          {
            "label": "Offline eval",
            "note": "recall@k per segment"
          },
          {
            "label": "Shadow traffic",
            "note": "both indexes, users see old"
          },
          {
            "label": "Cut over",
            "note": "behind a flag",
            "accent": "accent"
          },
          {
            "label": "Keep old warm",
            "note": "rollback window"
          },
          {
            "label": "Decommission",
            "note": "retire the old index",
            "accent": "muted"
          }
        ]
      },
      "say": "It's a rebuild, not an update, because vectors from two models live in different spaces. A new query vector compared against old document vectors gives nonsense, not slightly worse results. So I build a second index alongside the live one and embed the full corpus with the new model, while ingestion writes to both, or the new index is stale the day it's finished. Then I run the labelled retrieval set against both and compare recall at k per segment, not just overall. Next comes shadowing. Real production queries go to both indexes and both result sets are logged, with users seeing nothing, which catches the questions the labelled set never contained. After that I cut over behind a flag and keep the old index warm for a rollback window before decommissioning it. Every chunk carries the embedding model version, and I budget the re-embedding up front, because on a large corpus it's a multi-day job.",
      "numbers": "Budget the full re-embedding cost and time up front - for a large corpus this is a real spend and a multi-day job, not an afternoon.",
      "wrong": "\"We would re-embed everything and switch.\" The right shape, missing the parallel index, the comparison and the rollback - which is where the risk actually is.",
      "follow": "Halfway through the rebuild, ingestion breaks. What state are you in?",
      "followAnswer": "A safe one, as long as nothing has been cut over. The live index on the old model keeps serving, so users see no change, and the new index is partial and stale, so nothing queries it. Because every chunk carries its model version and the rebuild checkpoints its progress, I fix ingestion, resume from the checkpoint rather than starting over, and backfill whatever the dual-write missed. Only then do the recall comparison and shadowing carry on."
    }
  ]
};
