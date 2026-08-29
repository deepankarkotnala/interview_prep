/* Topic 04 — Embeddings and vector databases.
   Grounding: public JDs naming vector databases and semantic search, plus
   documented index behaviour. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["04-embeddings"] = {
  lede: "This topic is where interviewers check whether you understand the layer under RAG or just call it. The questions look academic and are not — every one of them decides something operational: what your index costs, how fast it answers, and whether filtering works.",
  grounding: "public JDs naming vector search + documented index behaviour",
  evening: ["em-02", "em-04", "em-06", "em-07", "em-09"],

  cards: [
    {
      id: "em-01",
      q: "What is an embedding?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["embeddings", "basics"],
      why: "A warm-up. The signal is whether you connect it to retrieval behaviour or stop at the definition.",
      simple:
        "An embedding is a list of numbers that represents meaning. A model reads a piece of text and produces, say, a thousand numbers — and it was trained so that texts with similar meaning produce similar number lists.\n\n" +
        "Think of a map of a city. Places that are near each other on the map are near each other in reality. An embedding is a map of meaning: \"leave policy\" and \"time-off entitlement\" end up close together even though they share no words.\n\n" +
        "That is why semantic search works. You embed the question, embed all your documents in advance, and find the documents whose position on the map is nearest to the question's position.\n\n" +
        "The consequence worth stating: the map is only as good as the model that drew it. A model trained on general web text has a poor map of your company's internal jargon, which is exactly where retrieval quietly fails.",
      points: [
        "A fixed-length vector of numbers representing meaning.",
        "Trained so similar meaning lands nearby.",
        "Documents are embedded ahead of time; the query is embedded at request time.",
        "Domain jargon is where general-purpose models have the weakest map."
      ],
      say: "An embedding is a list of numbers that represents meaning, produced by a model trained so that similar texts land near each other. That is what lets me search by meaning rather than keywords — I embed documents in advance, embed the question at query time, and find the nearest ones. The catch is that a general-purpose model has a weak map of internal jargon, which is where retrieval quietly fails.",
      numbers: "Common dimensions: 384 for small models, 768–1536 for general-purpose, 3072 at the large end. Dimension drives both storage and search cost.",
      wrong: "\"It converts text to numbers so the computer can process it.\" True of any encoding, including ASCII. The point is that distance means similarity.",
      follow: "Two different embedding models — how do you decide which is better for us?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-02",
      q: "Cosine, dot product or Euclidean — which do you use?",
      round: ["tech1"],
      level: "2-5",
      tags: ["embeddings", "similarity", "vector-search"],
      why: "A quick factual check with a wrong answer that has real consequences.",
      simple:
        "The correct answer is: whichever the embedding model was trained with. This is not a preference, it is a compatibility requirement, and picking a different one silently degrades your ranking.\n\n" +
        "The differences: cosine compares direction only and ignores length. Dot product uses both direction and magnitude. Euclidean is straight-line distance.\n\n" +
        "One useful fact for a follow-up: if vectors are normalised to unit length, cosine and dot product rank identically, and dot product is cheaper to compute. Most modern embedding models output normalised vectors, which is why most systems use dot product or cosine interchangeably without noticing.\n\n" +
        "So the answer that scores is: check the model card, match the index metric to it, then verify ranking quality on real queries rather than trusting the setting.",
      points: [
        "Match the metric the model was trained with. Check the model card.",
        "Cosine — direction only. Dot product — direction and magnitude. Euclidean — straight-line distance.",
        "For normalised vectors, cosine and dot product produce the same ranking.",
        "Most modern models output normalised vectors.",
        "Verify with a labelled retrieval set. The setting is not the proof."
      ],
      say: "Whichever the model was trained with — it is a compatibility requirement, not a preference, and mismatching it degrades ranking silently. Cosine compares direction, dot product includes magnitude, Euclidean is straight-line distance. If the vectors are normalised, which most modern models output, cosine and dot product rank identically and dot product is cheaper. Then I verify on a labelled set rather than trusting the config.",
      numbers: "No number applies. It is a compatibility choice, verified empirically.",
      wrong: "\"Cosine is standard so I use cosine.\" Right most of the time by accident, which is not the same as knowing why.",
      follow: "What changes if the vectors are not normalised?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-03",
      q: "How do you choose an embedding model?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["embeddings", "model-selection", "evaluation"],
      why: "Whether you evaluate on your own data or pick from a leaderboard.",
      simple:
        "Not from the public leaderboard. Those benchmarks are general-purpose, and your corpus is not — a model that ranks well on general retrieval can be poor on insurance policy language or telecom part numbers.\n\n" +
        "The process: build a small labelled set from your own corpus, a hundred or so questions with the chunk that answers each, ideally written by someone who knows the domain. Shortlist models on the hard constraints first — can it run in our tenant, is there a self-hosting requirement, does it support the languages we serve, what is the maximum input length. Then run each candidate on the labelled set and compare recall@10.\n\n" +
        "Then the operational factors that decide it in practice: dimension, because that drives storage and search cost; latency, because you embed on every query; and cost per million tokens at your ingestion volume.\n\n" +
        "And remember the switching cost. Changing model later means re-embedding the entire corpus, so this decision is stickier than most.",
      points: [
        "Constraints first: tenancy, self-hosting, languages, max input length.",
        "Labelled set from your own corpus, roughly 100 pairs.",
        "Compare recall@10, not benchmark rank.",
        "Weigh dimension — it drives storage and query cost.",
        "Switching later means re-embedding everything. Decide deliberately."
      ],
      say: "Not from a leaderboard, because those are general-purpose and my corpus is not. I build about a hundred labelled question-to-chunk pairs from our own data, shortlist on hard constraints like tenancy and language support, then compare recall at ten. After that, dimension, query latency and ingestion cost decide it. And I treat it as sticky, because changing later means re-embedding the whole corpus.",
      numbers: "100 labelled pairs is usually enough to separate candidates. Re-embedding a large corpus is a real cost — price it before you treat the choice as reversible.",
      wrong: "\"We use the top model on MTEB.\" It says you did not test on your own data, which is the actual skill being probed.",
      follow: "Would you ever fine-tune the embedding model instead?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-04",
      q: "How does HNSW work, and what do its parameters cost you?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["embeddings", "hnsw", "index", "ann"],
      why: "Whether you know what your vector database is doing, which matters the moment it gets slow.",
      simple:
        "Comparing a query against every vector is exact and far too slow at scale. So we use approximate search, and HNSW is the most common approach.\n\n" +
        "It builds a graph where each vector is connected to its near neighbours, in layers. The top layers are sparse, with long-range links; the lower layers are dense. A search starts at the top and takes big jumps to get roughly to the right region, then drops down layer by layer, refining. Like finding an address by taking the highway to the right city, then main roads, then the final street.\n\n" +
        "The parameters trade three things against each other. M controls how many connections each node keeps — higher means better recall and more memory. efConstruction affects build quality and build time. efSearch is the query-time knob: higher means more of the graph is explored, so better recall and slower queries.\n\n" +
        "The point to make: efSearch is tunable per query without rebuilding, which is the lever you reach for when recall is bad but you cannot afford a rebuild.",
      points: [
        "Multi-layer proximity graph: sparse layers for coarse navigation, dense for refinement.",
        "M — connections per node. Higher recall, more memory.",
        "efConstruction — build-time quality. Higher is slower to build, better graph.",
        "efSearch — query-time breadth. Higher recall, slower queries, no rebuild needed.",
        "Approximate by design. You choose the recall you pay for.",
        "HNSW is memory-hungry. That is the reason IVF-PQ exists."
      ],
      say: "HNSW is a layered proximity graph. Search starts in sparse top layers to jump near the right region, then descends into denser layers to refine. M sets connections per node, trading memory for recall. efConstruction sets build quality. efSearch is the query-time knob — more exploration means better recall and slower queries, and it is tunable without a rebuild, which is the lever I reach for first.",
      numbers: "Common starting points: M around 16, efConstruction around 200, efSearch tuned from 50 upward against your recall target.",
      wrong: "\"It's approximate nearest neighbour search.\" Correct and content-free. The interviewer wants the mechanism and the parameter trade-off.",
      follow: "The index no longer fits in memory. What are your options?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-05",
      q: "Your index no longer fits in memory. What changes?",
      round: ["tech2"],
      level: "5-10",
      tags: ["embeddings", "scale", "quantisation", "cost"],
      why: "A scaling scenario with several valid answers — it tests whether you reason about trade-offs.",
      simple:
        "Four levers, and the good answer names the cost of each.\n\n" +
        "Quantisation: store vectors in fewer bits. Scalar quantisation to int8 cuts memory roughly fourfold with a small recall loss. Binary quantisation is far more aggressive and usually needs a rescoring pass over full-precision vectors to recover quality.\n\n" +
        "Dimension reduction: some models support shortened embeddings, and some support Matryoshka-style truncation where you can cut dimensions with graceful degradation. Cheaper than it sounds, but it must be measured.\n\n" +
        "A different index type: IVF-PQ clusters vectors and compresses them, using far less memory than HNSW at the cost of recall and tuning complexity.\n\n" +
        "Sharding: split across machines and query in parallel. It solves memory and adds operational cost and network latency.\n\n" +
        "Then say what you would actually do: quantise first because it is the cheapest change, measure recall, and shard only when a single machine genuinely cannot hold a shard.",
      points: [
        "int8 scalar quantisation — roughly 4× smaller, small recall loss. Try first.",
        "Binary quantisation — much smaller, needs rescoring against full vectors.",
        "Matryoshka-style truncation — fewer dimensions, graceful degradation, must be measured.",
        "IVF-PQ instead of HNSW — much less memory, more tuning, lower recall.",
        "Sharding — solves memory, adds ops complexity and network latency.",
        "Always re-measure recall@k after any of these. They are all quality trades."
      ],
      say: "Quantisation first, because it is the cheapest change — int8 cuts memory around fourfold for a small recall loss, and binary goes further if I add a rescoring pass over full-precision vectors. Then dimension truncation if the model supports it, or IVF-PQ instead of HNSW, which uses far less memory for more tuning and less recall. Sharding last. And I re-measure recall after each, because all of these are quality trades.",
      numbers: "float32 → int8 is about 4× smaller. 200M vectors at 1024 dimensions is roughly 800 GB in float32, about 200 GB in int8.",
      wrong: "\"Add more RAM.\" Valid once, and it is not an engineering answer. The panel is asking what you do when that stops being affordable.",
      follow: "You quantised and recall dropped 4 points. What next?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-06",
      q: "How does metadata filtering interact with vector search?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["embeddings", "filtering", "performance", "access-control"],
      why: "A subtle mechanism with a large production impact, and few candidates have hit it.",
      simple:
        "You almost always need filters — this tenant, this date range, this access group. How the database applies them decides both correctness and speed.\n\n" +
        "Post-filtering searches the vectors first, then throws away results that fail the filter. Fast, but if the filter is selective you can search the top hundred and have three left, so recall collapses. This is the failure people report as \"the vector database returns nothing\".\n\n" +
        "Pre-filtering restricts the candidate set before searching. Correct, but a naive implementation degrades to a scan, because a graph index cannot navigate a subset it was not built for.\n\n" +
        "Good engines do filtered search — applying the filter during graph traversal. It is the right behaviour and it is worth knowing whether your engine does it, because the answer changes your design.\n\n" +
        "The operational answer: for access control never post-filter, because a permissions filter must be exact. For very selective filters, consider partitioning — a separate collection per tenant is often faster and safer than one collection with a tenant filter.",
      points: [
        "Post-filter — fast, recall collapses on selective filters.",
        "Pre-filter — correct, can degrade toward a scan.",
        "Filtered graph traversal is the good behaviour. Check whether your engine does it.",
        "Access control must never rely on post-filtering.",
        "Very selective filters: partition into separate collections instead.",
        "Test recall *with* filters applied. Unfiltered recall is not representative."
      ],
      say: "It depends on whether the engine post-filters or pre-filters. Post-filtering searches then discards, so a selective filter can leave three results out of a hundred and recall collapses. Pre-filtering is correct but can degrade toward a scan. Good engines filter during graph traversal. For access control I never post-filter, and for very selective filters I partition into separate collections instead of filtering one big one.",
      numbers: "Always measure recall with filters applied. A system at 0.95 unfiltered can sit far lower once a selective tenant filter is added.",
      wrong: "\"I just add a filter to the query.\" It works until the filter is selective, and then it fails in a way that looks like a retrieval-quality problem.",
      follow: "You have 400 tenants. One collection with a filter, or 400 collections?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-07",
      q: "pgvector or a dedicated vector database?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["embeddings", "vector-db", "architecture", "trade-off"],
      why: "A real architecture decision with no universally correct answer — which is why it is asked.",
      simple:
        "Start from what you already run, because the operational cost of a new datastore is usually underestimated.\n\n" +
        "pgvector is compelling when your corpus and traffic fit comfortably in Postgres, when you need joins between vectors and relational data — filtering by customer, joining to entitlements — and when the team already operates Postgres well. One backup story, one access-control story, one set of on-call knowledge. Transactional consistency between your documents and your vectors is a genuine advantage people forget to mention.\n\n" +
        "A dedicated engine earns its place at large scale, when you need horizontal sharding, advanced filtered search, hybrid search built in, or features like multi-vector and quantisation that would otherwise be your problem.\n\n" +
        "The answer that scores: name the numbers at which you would switch, rather than declaring one better. Corpus size, QPS, p95 latency and filter selectivity are the four that decide it.",
      points: [
        "pgvector: relational joins, one backup and access story, transactional consistency.",
        "Dedicated: horizontal scale, filtered search quality, hybrid built in, quantisation.",
        "Decide on corpus size, QPS, p95 latency and filter selectivity.",
        "Adding a datastore adds on-call, backup and access-control surface. Price that in.",
        "State the migration trigger in advance, so the switch is a decision rather than a fire."
      ],
      say: "I start from what we already operate, because a new datastore costs more than people expect. pgvector wins when the corpus fits Postgres, we need joins between vectors and relational data, and we want one backup and access story with transactional consistency. A dedicated engine wins at horizontal scale, or when we need filtered and hybrid search built in. I decide on corpus size, QPS, p95 and filter selectivity, and I name the migration trigger up front.",
      numbers: "pgvector is comfortable into the low millions of vectors on adequate hardware. Past that, measure p95 with your real filters before committing either way.",
      wrong: "\"Dedicated vector databases are faster, so we use one.\" Faster at what, under which filters, at what operational cost. This answer invites all three follow-ups.",
      follow: "What measurement would trigger the migration?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-08",
      q: "How do you evaluate retrieval quality?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["embeddings", "evaluation", "metrics"],
      why: "The objective half of RAG evaluation, and the cheapest thing a team can do that most do not.",
      simple:
        "You need a labelled set: questions paired with the chunk that actually answers them. Building it is the work — a domain expert, real questions from production, and every reported failure added to the set.\n\n" +
        "Then two metrics do most of the job. Recall@k: how often the correct chunk appears in the top k. This is the one that matters for RAG, because the generator only sees the top k. And MRR, which rewards the correct chunk ranking high rather than merely appearing.\n\n" +
        "The advantage of this layer is that it needs no model calls at all. It is fast, free and objective, so it can run on every commit — which means a change that breaks retrieval is caught in CI rather than in production.\n\n" +
        "Then slice the results. An average of 0.92 routinely hides a document type or a language sitting at 0.6, and that segment is where the complaints come from.",
      points: [
        "Labelled set: question → the chunk that answers it. Built with a domain expert.",
        "Recall@k is the metric that matters for RAG. MRR rewards ranking.",
        "No model calls needed — run it on every commit.",
        "Slice by document type, language and tenant. Averages hide failing segments.",
        "Add every production failure to the set. That is how it stays honest."
      ],
      say: "A labelled set of questions paired with the chunk that answers them, built with a domain expert and grown from real production failures. Then recall at k, because the generator only sees the top k, plus MRR to reward ranking. This layer needs no model calls, so it runs on every commit and catches breakage in CI. And I slice by document type and language, because an average hides the segment that is actually failing.",
      numbers: "Useful bar: recall@10 above 0.90 before tuning the prompt. 100+ labelled pairs, or run-to-run noise exceeds the effect you are measuring.",
      wrong: "\"We check whether the answers look right.\" That measures the whole pipeline at once, so a retrieval regression and a prompt regression are indistinguishable.",
      follow: "Recall@10 is 0.95 but recall@3 is 0.6. What does that tell you?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-09",
      q: "When would you fine-tune an embedding model?",
      round: ["tech2"],
      level: "5-10",
      tags: ["embeddings", "fine-tuning", "advanced"],
      why: "A depth question. The senior answer is mostly about when not to.",
      simple:
        "Rarely, and only after the cheaper options are exhausted, because fine-tuning an embedding model means re-embedding the whole corpus every time you retrain and owning a model artefact forever.\n\n" +
        "The case where it genuinely pays: your domain language is far from general web text and retrieval keeps failing on it. Medical coding, legal citation formats, internal product taxonomies where the same word means something specific to your company. In those cases a general model's map of meaning is simply wrong in your neighbourhood.\n\n" +
        "What you need is training data in the form of pairs — a query and the document that should match it. Production query logs plus click or thumbs-up signals are the usual source, which is why this comes later in a product's life: you need traffic before you have the data.\n\n" +
        "And what to try first: hybrid search, reranking, better chunking and query rewriting. All four are cheaper, reversible and often solve the same problem.",
      points: [
        "Try hybrid search, reranking, chunking and query rewriting first. All reversible.",
        "Fine-tune when domain language is genuinely far from general text.",
        "Needs query-document pairs, usually mined from production logs and feedback.",
        "Every retrain means re-embedding the whole corpus.",
        "You now own a model artefact — versioning, hosting, drift, all yours.",
        "A reranker is often the better place to spend the same effort."
      ],
      say: "Rarely, and only after hybrid search, reranking, better chunking and query rewriting have failed, because those are cheaper and reversible. It pays when domain language is genuinely far from general text — medical coding, internal taxonomies — where a general model's map is wrong in our neighbourhood. It needs query-document pairs mined from production logs, and every retrain means re-embedding the whole corpus. Often a reranker is the better spend.",
      numbers: "Thousands of query-document pairs is a realistic starting point. Below that, the effort is usually better spent on a reranker.",
      wrong: "\"We fine-tuned embeddings to improve accuracy.\" Without the alternatives tried and the re-embedding cost named, it reads as reaching for the most expensive option first.",
      follow: "How would you get those query-document pairs without a labelling team?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "em-10",
      q: "You need to switch embedding models. Walk me through the migration.",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["embeddings", "migration", "operations", "versioning"],
      why: "An operational scenario that catches anyone who has only built, never migrated.",
      simple:
        "The first thing to say is that you cannot mix. Vectors from two models live in different spaces, so a query embedded with the new model compared against old vectors gives nonsense — not degraded results, nonsense. So this is a rebuild, not an update.\n\n" +
        "The sequence: build a second index alongside the live one, embedding the full corpus with the new model. Keep ingestion writing to both while you do it, or you will finish with a stale index. Run your labelled retrieval set against both and compare recall@k per segment, not just overall.\n\n" +
        "Then shadow: send real production queries to both, log both result sets, and compare without showing users anything. That catches the queries your labelled set never contained.\n\n" +
        "Then cut over behind a flag, keep the old index warm for a rollback window, and only then decommission it.\n\n" +
        "And the detail that shows experience: your chunks carry the embedding model version, so at any moment you can tell which model produced which vector.",
      points: [
        "Never mix vectors from two models. Different spaces, meaningless comparisons.",
        "Build the new index in parallel; dual-write during ingestion.",
        "Compare recall@k per segment on the labelled set, not just overall.",
        "Shadow real production queries against both, visible to nobody.",
        "Cut over behind a flag; keep the old index warm for rollback.",
        "Version stamp on every chunk: which model produced this vector."
      ],
      say: "It is a rebuild, not an update, because vectors from two models are in different spaces and comparing across them gives nonsense. I build the new index in parallel with dual-write ingestion, compare recall at k per segment on the labelled set, then shadow real production queries against both with nothing shown to users. Then cut over behind a flag and keep the old index warm for rollback.",
      numbers: "Budget the full re-embedding cost and time up front — for a large corpus this is a real spend and a multi-day job, not an afternoon.",
      wrong: "\"We would re-embed everything and switch.\" The right shape, missing the parallel index, the comparison and the rollback — which is where the risk actually is.",
      follow: "Halfway through the rebuild, ingestion breaks. What state are you in?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
  ]
};
