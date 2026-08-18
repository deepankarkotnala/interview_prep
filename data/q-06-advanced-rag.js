/* Topic 06 — Advanced RAG.
   Grounding: public JDs asking for "advanced RAG" / "agentic RAG", plus what
   the techniques actually cost when you run them. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["06-advanced-rag"] = {
  lede: "These techniques appear by name in job descriptions, which means you will be asked about them. The trap is enthusiasm: every one of them adds latency, cost or complexity, and a senior answer names that cost before the benefit. Knowing when not to add something is the differentiator here.",
  grounding: "public JDs naming advanced RAG techniques + their measured costs",
  evening: ["ar-01", "ar-03", "ar-05", "ar-07", "ar-09"],

  cards: [
    {
      id: "ar-01",
      q: "What is query rewriting and when does it earn its cost?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["advanced-rag", "query-rewriting", "retrieval"],
      why: "The cheapest advanced technique, and the one most candidates skip past.",
      simple:
        "Users do not write good search queries. They write \"what about the second one\" or \"is that covered\", which retrieve nothing useful because half the meaning is in the previous turn or in their head.\n\n" +
        "Query rewriting puts a model call before retrieval that turns the raw input into something searchable. Three common forms. Resolving references, so \"is that covered\" becomes \"is dental treatment covered under the GOLD plan\". Expanding, generating two or three phrasings and retrieving for each, then merging. And decomposition, splitting a two-part question into two searches.\n\n" +
        "The cost is one extra model call in front of every query — latency you always pay, for a benefit that only sometimes appears.\n\n" +
        "So the version that earns it: rewrite conditionally. In a multi-turn chat, always resolve references, because that failure is guaranteed. Expand only when the first retrieval scores poorly. That way you pay for expansion on the queries that need it.",
      points: [
        "Reference resolution — essential in multi-turn chat. Cheap and high value.",
        "Multi-query expansion — several phrasings, merged results. Costs a call plus n retrievals.",
        "Decomposition — split a compound question into separate searches.",
        "Every rewrite adds latency to every query unless you gate it.",
        "Gate on first-pass retrieval score, so you only pay when retrieval was weak.",
        "Use a small fast model here. This step does not need your best one."
      ],
      say: "Users write \"is that covered\", which retrieves nothing, so a model call before retrieval rewrites it into something searchable — resolving references, expanding phrasings, or splitting a compound question. The cost is a call in front of every query. So I always resolve references in multi-turn chat, because that failure is guaranteed, and I gate expansion on a weak first-pass retrieval score. And I use a small model for it.",
      numbers: "A small-model rewrite typically adds 100–300 ms. Gating on first-pass score means paying it on a minority of queries rather than all of them.",
      wrong: "\"I always rewrite the query, it improves retrieval.\" Sometimes it degrades it — a rewrite can drop the exact identifier that was the only thing worth matching.",
      follow: "The rewrite dropped the part number the user typed. How do you prevent that?"
    },

    {
      id: "ar-02",
      q: "What is HyDE and would you use it?",
      round: ["tech2"],
      level: "5-10",
      tags: ["advanced-rag", "hyde", "retrieval"],
      why: "A named technique check. The good answer explains the intuition and then declines to over-sell it.",
      simple:
        "HyDE stands for hypothetical document embeddings. The idea is that a question and an answer look different, so embedding the question and comparing it to documents is comparing two different kinds of text.\n\n" +
        "So instead you ask a model to write a fake answer to the question — it does not have to be correct — and embed that. The fake answer looks like a document, so it lands nearer to real documents in embedding space, and retrieval improves.\n\n" +
        "It genuinely helps when questions are short and documents are long and prose-like, and when you have no labelled data to tune anything else.\n\n" +
        "The costs: a full generation before every retrieval, so the latency is significant, and the hypothetical document can hallucinate details that pull retrieval in the wrong direction — particularly on identifiers and names, where the model invents a plausible one and you retrieve documents about the wrong thing.\n\n" +
        "My position: try hybrid search and a reranker first. They are cheaper and usually win.",
      points: [
        "Embeds a generated fake answer instead of the question, to match document-shaped text.",
        "Helps most on short questions against long prose documents.",
        "Costs a full generation before every retrieval — real latency.",
        "Hallucinated specifics can actively misdirect retrieval.",
        "Hybrid search and reranking are cheaper and usually beat it."
      ],
      say: "HyDE generates a hypothetical answer to the question and embeds that instead of the question, because an answer looks more like a document than a question does, so it lands closer in embedding space. It helps on short questions against long prose. The cost is a full generation before every retrieval, and invented specifics can misdirect the search. I would try hybrid search and a reranker first — cheaper, and usually better.",
      numbers: "HyDE adds a full generation to the critical path — commonly 500 ms to several seconds. That is often the entire latency budget.",
      wrong: "Presenting it as a standard part of a modern pipeline. It is a situational technique, and treating it as default reads as reciting a blog post.",
      follow: "What would you try before reaching for HyDE?"
    },

    {
      id: "ar-03",
      q: "Explain reranking properly — what is a cross-encoder doing?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["advanced-rag", "reranking", "cross-encoder"],
      why: "The highest-value advanced technique, so the panel expects real understanding, not just the word.",
      simple:
        "A bi-encoder — your embedding model — encodes the question and each document separately, and compares the two vectors. Fast, because documents were encoded in advance, but the model never sees the question and the document together, so it cannot notice that this specific question is answered by this specific paragraph.\n\n" +
        "A cross-encoder puts the question and one document into the model at the same time and outputs a relevance score. Because attention runs across both, it can catch exactly that. Much more accurate.\n\n" +
        "The cost is structural: nothing can be precomputed, because the score depends on the pair. So you cannot run it over two million documents — you run it over the fifty the first stage returned.\n\n" +
        "That is the whole design. Cheap approximate recall first, expensive precise ordering second. And the number that matters is how many you rerank: fifty is normal, and the latency scales with it.",
      points: [
        "Bi-encoder: separate encodings, precomputable, fast, less precise.",
        "Cross-encoder: joint encoding of the pair, precise, nothing precomputable.",
        "Therefore two stages — recall cheaply, then reorder precisely.",
        "Latency scales with how many candidates you rerank.",
        "It fixes ranking, not recall. If the right chunk was not in the fifty, it cannot help."
      ],
      say: "The embedding model encodes question and document separately, so it never sees them together and cannot judge whether this paragraph answers this question. A cross-encoder feeds the pair in jointly and scores relevance, which is far more accurate but cannot be precomputed. So I retrieve fifty cheaply and rerank those. The key limit is that it fixes ranking, not recall — if the right chunk was not retrieved, reranking cannot save it.",
      numbers: "Reranking 50 candidates with a hosted reranker typically adds 100–300 ms. Reranking 200 adds proportionally more, for diminishing returns.",
      wrong: "\"It re-sorts the results using a better model.\" True and shallow. The joint-encoding point is the whole reason it works.",
      follow: "Recall@50 is 0.7. Does a reranker help you?"
    },

    {
      id: "ar-04",
      q: "What is contextual retrieval, or contextual chunk enrichment?",
      round: ["tech2"],
      level: "5-10",
      tags: ["advanced-rag", "chunking", "ingestion"],
      why: "A current technique. Knowing it signals your knowledge is from this year.",
      simple:
        "A chunk taken out of a document loses its context. A paragraph that says \"the waiting period is 90 days\" does not say which plan it belongs to, because that was in the heading three pages up. Embed that chunk and it will not match a question about the GOLD plan.\n\n" +
        "Contextual enrichment fixes it at ingestion. Before embedding, you prepend a short generated line that situates the chunk — which document, which section, what it is about. \"From the 2026 GOLD plan policy, eligibility section: the waiting period is 90 days.\" Now the chunk carries its own context and matches properly.\n\n" +
        "The cost is at ingestion, not query time, which is what makes it attractive: you pay once per chunk instead of on every request. For a large corpus it is a real one-time bill, and prompt caching over the source document reduces it considerably.\n\n" +
        "The cheap version, worth mentioning: much of the benefit comes from simply prepending the document title and heading path, with no model call at all. Try that first.",
      points: [
        "Chunks lose the context that made them meaningful — usually the heading.",
        "Prepend a short situating line before embedding, at ingestion.",
        "Cost is one-time per chunk, not per query. That is the point.",
        "Prompt caching over the source document cuts the ingestion bill.",
        "Cheapest version: prepend title and heading path, no model call.",
        "Store the enriched text for embedding, the original for display."
      ],
      say: "A chunk loses the heading that gave it meaning, so a paragraph saying \"the waiting period is 90 days\" never matches a question about the GOLD plan. At ingestion I prepend a short line situating the chunk in its document and section, then embed that. The cost is one-time per chunk rather than per query. And much of the gain comes from just prepending the title and heading path, with no model call at all.",
      numbers: "Ingestion-time cost scales with corpus size once. Prompt caching over the source document typically makes it a fraction of the naive price.",
      wrong: "\"We add metadata to the chunk.\" Metadata in a separate field does not affect the embedding. The context has to be in the text that gets embedded.",
      follow: "Do you embed the enriched text or the original? Which one do you show the user?"
    },

    {
      id: "ar-05",
      q: "What is agentic RAG and when is it worth it?",
      round: ["tech2"],
      level: "5-10",
      tags: ["advanced-rag", "agents", "architecture", "cost"],
      why: "The buzzword of the moment. The panel is checking whether you can bound it.",
      simple:
        "Standard RAG retrieves once and answers. Agentic RAG lets the model decide: whether to retrieve at all, which source to search, whether what came back is good enough, and whether to search again with a different query.\n\n" +
        "It genuinely helps in three situations. Multi-hop questions, where no single chunk contains the answer and you need to find one fact to look up the next. Multiple sources, where the right move is choosing between a policy corpus, a database and a live API. And self-correction, where the model notices the retrieved documents do not answer the question and tries again.\n\n" +
        "The costs are the ones agents always have: several model calls instead of one, so latency and spend multiply; non-determinism, so the same question can take a different path; and much harder debugging.\n\n" +
        "So the bounded version: use it where the question genuinely needs multiple steps, cap the loop at two or three retrievals, and route simple questions straight down the cheap path. Most traffic is simple.",
      points: [
        "The model decides whether, where and how many times to retrieve.",
        "Worth it for multi-hop, multi-source, and self-correcting retrieval.",
        "Multiplies latency and cost — several calls where there was one.",
        "Cap retrieval loops at two or three. Uncapped, it is a runaway.",
        "Route simple questions past it. Most traffic does not need it.",
        "Needs tracing, or you cannot explain why one answer was slow and wrong."
      ],
      say: "Agentic RAG lets the model decide whether to retrieve, which source to use, whether the results are good enough, and whether to search again. It earns its cost on multi-hop questions, multiple sources, and self-correction. It multiplies latency and spend, and it is non-deterministic, so I cap the loop at two or three retrievals and route simple questions straight down the cheap path, because most traffic is simple.",
      numbers: "A three-step agentic path costs roughly three times the model calls of single-shot RAG. Route on question type, or that becomes your default cost.",
      wrong: "\"We made our RAG agentic to improve quality.\" Without the cap, the routing and the cost comparison, it reads as complexity added for its own sake.",
      follow: "How do you decide which questions take the cheap path?"
    },

    {
      id: "ar-06",
      q: "What is GraphRAG and would you actually build it?",
      round: ["tech2"],
      level: "10+",
      tags: ["advanced-rag", "graphrag", "knowledge-graph", "trade-off"],
      why: "A depth question where the honest answer — usually no — scores higher than enthusiasm.",
      simple:
        "GraphRAG builds a knowledge graph from your documents first — entities and the relationships between them — and retrieves over that structure instead of, or alongside, plain chunks.\n\n" +
        "It answers a class of question that chunk retrieval cannot. \"Which of our suppliers are affected by this regulation, and through which contracts?\" That requires connecting facts spread across many documents, and no single chunk contains it. Summarising a whole corpus by theme is the other case.\n\n" +
        "The costs are large and worth naming plainly. Extracting entities and relationships means a model call over every document, so ingestion is expensive. The graph needs maintenance as documents change. Extraction errors compound into a wrong graph, which is worse than no graph. And you now operate a second datastore.\n\n" +
        "So: build it when the questions are genuinely relational and the corpus is stable enough to justify the ingestion cost. For \"what does the policy say about X\", plain RAG with a reranker wins on every axis.",
      points: [
        "Extracts entities and relationships, retrieves over the graph.",
        "Wins on relational and whole-corpus questions no single chunk can answer.",
        "Ingestion cost is high — a model pass over the whole corpus.",
        "Extraction errors compound. A wrong graph is worse than none.",
        "Adds a second datastore to operate and keep in sync.",
        "For lookup-style questions, plain RAG plus reranking wins outright."
      ],
      say: "GraphRAG extracts entities and relationships into a graph and retrieves over that, which answers relational questions no single chunk contains — which suppliers are affected by this regulation, through which contracts. The cost is a model pass over the whole corpus at ingestion, ongoing graph maintenance, and a second datastore. I would build it only where the questions are genuinely relational. For lookup questions, plain RAG with a reranker wins.",
      numbers: "Entity extraction means at least one model call per document at ingestion. On a large corpus that is a substantial one-time bill — price it before proposing it.",
      wrong: "\"GraphRAG is more accurate than normal RAG.\" On relational questions, often. On lookup questions it is more expensive and no better, and that distinction is the answer.",
      follow: "Your documents change weekly. What does that do to the graph?"
    },

    {
      id: "ar-07",
      q: "How do you handle a question that needs facts from two documents?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["advanced-rag", "multi-hop", "retrieval"],
      why: "The concrete version of multi-hop, and the failure most RAG systems have but never diagnose.",
      simple:
        "This is the failure that hides. Retrieval returns chunks that are individually relevant, the model produces a confident answer, and the answer is wrong because the second fact was never retrieved.\n\n" +
        "Take \"is the manager of the Pune claims team eligible for the new allowance\". You need who that manager is from one system, and the allowance rule from another. A single retrieval on the raw question finds documents about neither, or about only one.\n\n" +
        "Three approaches. Decomposition: a model call splits it into sub-questions, each retrieved separately, then all results go into one generation. Iterative retrieval: retrieve, let the model see what it now knows, retrieve again for what it still needs — an agentic loop with a cap. Or a structural fix: if the two facts always travel together, join them at ingestion so one chunk contains both.\n\n" +
        "The last one is underrated. Fixing it at ingestion costs nothing at query time.",
      points: [
        "Symptom: confident answers built on half the facts. It rarely looks like a retrieval failure.",
        "Decomposition — split into sub-questions, retrieve each, generate once.",
        "Iterative retrieval — an agentic loop, capped at two or three hops.",
        "Structural fix — join facts at ingestion if they always co-occur.",
        "Your eval set must contain multi-hop questions, or you will never see this."
      ],
      say: "This one hides, because the chunks returned are individually relevant and the answer looks confident while resting on half the facts. I either decompose the question into sub-questions and retrieve each, or run a capped iterative retrieval loop where the model sees what it has and asks for what is missing. Best of all, if the two facts always travel together, I join them at ingestion so one chunk holds both.",
      numbers: "Cap iterative retrieval at two or three hops. Beyond that you are usually paying for a question the corpus cannot answer.",
      wrong: "\"I would increase k so more documents are retrieved.\" It occasionally helps by luck and mostly adds noise and cost, because the second fact is not near the question in embedding space.",
      follow: "How do you detect multi-hop failures in production?"
    },

    {
      id: "ar-08",
      q: "How do you build RAG over structured and unstructured data together?",
      round: ["tech2"],
      level: "5-10",
      tags: ["advanced-rag", "text-to-sql", "routing", "architecture"],
      why: "A real system-design problem, common in enterprise, and it tests routing thinking.",
      simple:
        "The mistake is trying to make one mechanism handle both. \"How many claims were denied last month\" is a database question — the answer is a number, computed by aggregation. \"Why are claims denied\" is a document question. Retrieval cannot count, and SQL cannot explain policy.\n\n" +
        "So you route. A classifier or a cheap model decides which kind of question it is, then sends it to text-to-SQL, to document retrieval, or to both when the answer needs a number and an explanation.\n\n" +
        "The parts that need care. Text-to-SQL needs the schema in context, a read-only connection, a query allowlist or validator, and a row limit, because a generated query can otherwise be expensive or unsafe. Routing needs a fallback when it is unsure — running both and letting generation use what fits is often better than guessing wrong. And when combining, the answer must state which number came from the database, because that number is exact and the prose is not.\n\n" +
        "Say the routing decision out loud. That is what is being marked.",
      points: [
        "Aggregations and counts → SQL. Explanations and policy → retrieval.",
        "Route with a cheap classifier; run both when uncertain.",
        "Text-to-SQL: read-only connection, schema in context, validator, row limit.",
        "Never let generated SQL run unbounded or with write permissions.",
        "In a combined answer, mark which figures came from the database.",
        "Evaluate the router separately — routing errors look like quality failures."
      ],
      say: "I route rather than forcing one mechanism to do both. Counts and aggregations go to text-to-SQL; explanations go to document retrieval; some questions need both. Text-to-SQL runs on a read-only connection with the schema in context, a validator and a row limit. When the router is unsure I run both and let generation use what fits. And I evaluate the router separately, because routing errors look like quality failures.",
      numbers: "Always cap generated SQL with a row limit and a statement timeout. An unbounded generated join is a production incident waiting to happen.",
      wrong: "\"I'd put the database rows into the vector store.\" Then a count becomes a retrieval, and retrieval cannot count. It gives approximately-right numbers, which is worse than none.",
      follow: "The router sent an aggregation question to retrieval. How would you know?"
    },

    {
      id: "ar-09",
      q: "Which of these techniques would you actually add first, and why?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["advanced-rag", "judgement", "prioritisation"],
      why: "The synthesis question. It tests prioritisation, which is the actual senior skill in this topic.",
      simple:
        "Measure before adding anything. The order depends on which half is failing, and adding techniques blind is how pipelines become slow and expensive without getting better.\n\n" +
        "If recall is the problem — the right chunk is not being retrieved — no amount of reranking helps, because reranking only reorders what you already found. Fix ingestion and chunking first, then add hybrid search, then contextual enrichment.\n\n" +
        "If recall is fine but the right chunk ranks low, that is exactly what a reranker fixes, and it is the highest value-per-effort change in this topic.\n\n" +
        "If retrieval is fine and answers are still wrong, the problem is generation — prompt, context ordering, refusal handling — not retrieval at all.\n\n" +
        "My default order: fix chunking, add hybrid search, add a reranker, then contextual enrichment, and only then consider query rewriting or an agentic loop. The exotic techniques come last because they cost the most and help the narrowest set of cases.",
      points: [
        "Measure first: is it recall, ranking, or generation?",
        "Low recall → chunking, ingestion quality, hybrid search. Reranking cannot help.",
        "Good recall, poor ranking → reranker. Best value in the topic.",
        "Good retrieval, bad answers → it is a generation problem.",
        "Default order: chunking, hybrid, rerank, contextual enrichment, then the rest.",
        "Each addition must be justified against latency budget and cost per query."
      ],
      say: "I measure first, because the order depends on which half is failing. If recall is low, reranking cannot help — it only reorders what was found — so I fix chunking and add hybrid search. If recall is fine but ranking is poor, a reranker is the best value in this topic. If retrieval is fine and answers are wrong, it is a generation problem. Exotic techniques come last, because they cost most and help narrowest.",
      numbers: "Track recall@k, answer accuracy, p95 latency and cost per query together. Any technique that moves one without a stated trade on the others has not been measured.",
      wrong: "Listing every technique you know. The question is about prioritisation, and an unordered list answers a different one.",
      follow: "You added three techniques and quality is flat. What went wrong?"
    },

    {
      id: "ar-10",
      q: "How do you cache in a RAG pipeline without serving stale or leaked answers?",
      round: ["tech2"],
      level: "5-10",
      tags: ["advanced-rag", "caching", "cost", "security"],
      why: "Caching is the biggest cost lever and the easiest place to cause a data breach.",
      simple:
        "There are three layers you can cache, and each has a different trap.\n\n" +
        "Embedding cache: the same query text embedded repeatedly. Safe and easy — key on the text plus the embedding model version, because the version is what makes it wrong after a migration.\n\n" +
        "Retrieval cache: the chunks returned for a query. Here the trap is permissions. If the key is only the query text, a user with wide access populates the cache and a user with narrow access gets their results. The key must include the entitlement set, or you have built a leak.\n\n" +
        "Answer cache: the full generated response. Same permission trap, plus staleness — when the underlying document changes, the cached answer is now wrong and nothing invalidates it. So cache keys need a corpus version, and ingestion must bump it.\n\n" +
        "And provider prompt caching sits alongside all of this, cutting cost on the stable prefix without any of these risks, because it never crosses users.",
      points: [
        "Embedding cache: key on text + embedding model version.",
        "Retrieval and answer caches: the key must include the user's entitlement set.",
        "Answer cache needs a corpus version in the key, bumped by ingestion.",
        "A cache keyed only on question text is a data-leak mechanism.",
        "Semantic caching — matching near-identical questions — is powerful and riskier. Set a high threshold.",
        "Provider prompt caching on the stable prefix carries none of these risks."
      ],
      say: "Three layers, three traps. Embedding cache is safe if I key on text plus embedding model version. Retrieval and answer caches must include the user's entitlement set in the key, or a broadly-permissioned user populates the cache and a restricted user reads it. Answer caches also need a corpus version bumped by ingestion, or a withdrawn document keeps answering. Provider prompt caching carries none of these risks.",
      numbers: "For semantic caching, set the similarity threshold high — a loose threshold serves the answer to a different question, and users notice that faster than any cost saving pays for.",
      wrong: "\"We cache responses by question text.\" That is the leak. It is also the most common caching implementation, which is exactly why it gets asked.",
      follow: "A document was withdrawn. Which of your caches still answers from it?"
    }
  ]
};
