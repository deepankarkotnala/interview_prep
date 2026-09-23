/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["06-advanced-rag"] = {
  "lede": "These techniques appear by name in job descriptions, which means you will be asked about them. The trap is enthusiasm: every one of them adds latency, cost or complexity, and a senior answer names that cost before the benefit. Knowing when not to add something is the differentiator here. Read the RAG topic first. New to advanced RAG? The questions are ordered for a first read: High priority first, from query rewriting and reranking through multi-hop, agentic RAG, self-checking loops and GraphRAG to which technique to add first, then Medium, then Low.",
  "grounding": "public JDs naming advanced RAG techniques + their measured costs",
  "evening": [
    "ar-01",
    "ar-03",
    "ar-05",
    "ar-07",
    "ar-09"
  ],
  "cards": [
    {
      "id": "ar-01",
      "q": "What is query rewriting and when does it earn its cost?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "query-rewriting",
        "retrieval"
      ],
      "why": "The cheapest advanced technique, and the one most candidates skip past.",
      "simple": "Users do not write good search queries. They write \"what about the second one\" or \"is that covered\", which retrieve nothing useful because half the meaning is in the previous turn or in their head.\n\nQuery rewriting puts a model call before retrieval that turns the raw input into something searchable. Three common forms. Resolving references, so \"is that covered\" becomes \"is dental treatment covered under the GOLD plan\". Expanding, generating two or three phrasings and retrieving for each, then merging. And decomposition, splitting a two-part question into two searches.\n\nThe cost is one extra model call in front of every query - latency you always pay, for a benefit that only sometimes appears.\n\nSo the version that earns it: rewrite conditionally. In a multi-turn chat, always resolve references, because that failure is guaranteed. Expand only when the first retrieval scores poorly - a reranker score is a more reliable gate than raw cosine similarity, which is poorly calibrated across queries. That way you pay for expansion on the queries that need it.\n\n(How to condense a follow-up into a standalone question is covered in the RAG topic's multi-turn card; this card is about when the extra call pays for itself.)",
      "points": [
        "Reference resolution - essential in multi-turn chat. Cheap and high value.",
        "Multi-query expansion - several phrasings, merged results. Costs a call plus n retrievals.",
        "Decomposition - split a compound question into separate searches.",
        "Every rewrite adds latency to every query unless you gate it.",
        "Gate on first-pass retrieval quality (a reranker score beats raw cosine), so you only pay when retrieval was weak.",
        "Use a small fast model here. This step does not need your best one."
      ],
      "say": "Users write \"is that covered\", which retrieves nothing, so a model call before retrieval rewrites it into something searchable - resolving references, expanding phrasings, or splitting a compound question. The cost is a call in front of every query. So I always resolve references in multi-turn chat, because that failure is guaranteed, and I gate expansion on a weak first-pass retrieval score. And I use a small model for it.",
      "numbers": "A small-model rewrite typically adds 100–300 ms. Gating on first-pass score means paying it on a minority of queries rather than all of them.",
      "wrong": "\"I always rewrite the query, it improves retrieval.\" Sometimes it degrades it - a rewrite can drop the exact identifier that was the only thing worth matching.",
      "follow": "The rewrite dropped the part number the user typed. How do you prevent that?",
      "followAnswer": "Two guards. I tell the rewriter to copy identifiers, codes and names exactly, and I check it in code: pull anything that looks like an ID out of the original query, and if the rewrite lost it, add it back or fall back to the original. I also keep BM25 running on the user's original text, so exact matches still work even when a rewrite is poor."
    },
    {
      "id": "ar-02",
      "q": "What is HyDE and would you use it?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "hyde",
        "retrieval"
      ],
      "why": "A named technique check. The good answer explains the intuition and then declines to over-sell it.",
      "simple": "HyDE stands for hypothetical document embeddings. The idea is that a question and an answer look different, so embedding the question and comparing it to documents is comparing two different kinds of text.\n\nSo instead you ask a model to write a fake answer to the question - it does not have to be correct - and embed that. The fake answer looks like a document, so it lands nearer to real documents in embedding space, and retrieval improves.\n\nIt genuinely helps when questions are short and documents are long and prose-like, and when you have no labelled data to tune anything else.\n\nThe costs: a full generation before every retrieval, so the latency is significant, and the hypothetical document can hallucinate details that pull retrieval in the wrong direction - particularly on identifiers and names, where the model invents a plausible one and you retrieve documents about the wrong thing.\n\nMy position: try hybrid search and a reranker first. They are cheaper and often win.",
      "points": [
        "Embeds a generated fake answer instead of the question, to match document-shaped text.",
        "Helps most on short questions against long prose documents.",
        "Costs a full generation before every retrieval - real latency.",
        "Hallucinated specifics can actively misdirect retrieval.",
        "Hybrid search and reranking are cheaper and often beat it."
      ],
      "say": "HyDE generates a hypothetical answer to the question and embeds that instead of the question, because an answer looks more like a document than a question does, so it lands closer in embedding space. It helps on short questions against long prose. The cost is a full generation before every retrieval, and invented specifics can misdirect the search. I would try hybrid search and a reranker first - cheaper, and often better.",
      "numbers": "HyDE adds a full generation to the critical path - commonly 500 ms to several seconds. That is often the entire latency budget.",
      "wrong": "Presenting it as a standard part of a modern pipeline. It is situational, and the follow-up asks what it costs per query and how it misfires on identifiers - a default-on answer has no reply to either.",
      "follow": "What would you try before reaching for HyDE?",
      "followAnswer": "Cheaper, more predictable fixes. Hybrid search, so exact terms match through BM25. A reranker on the top fifty. Contextual enrichment of chunks at ingestion. And if questions and documents look very different, HyPE - generating likely questions per chunk at index time - which moves the LLM cost off the query path. I try HyDE only if the eval still shows short questions missing long prose."
    },
    {
      "id": "ar-15",
      "q": "Bi-encoder, cross-encoder and ColBERT (late interaction) - what is the difference?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "retrieval",
        "reranking"
      ],
      "why": "Whether you understand the speed-versus-accuracy trade-off behind every retrieval stack.",
      "simple": "All three answer the same question: how similar is this query to this document? The difference is **when the query and the document meet**.\n\n**Bi-encoder - they meet only at the very end.**\nThe query and the document are turned into vectors separately. Documents are embedded once, in advance, and stored. At query time we embed only the query and compare vectors - super fast, even over millions of documents. But the whole document is squeezed into one vector, so fine details get lost.\nAnalogy: two people each fill in a form about themselves, and a computer compares the forms.\n\n**Cross-encoder - they meet right at the start.**\nThe query and the document are fed into the model together. Every query word can look at every document word, and the model outputs one relevance score. Much more accurate - but nothing can be pre-computed, so it must run once per document for every query. Too slow for millions; perfect for re-scoring the top 20–100.\nAnalogy: the two people actually sit down and talk.\n\n**ColBERT (late interaction) - the middle path.**\nDocuments are pre-computed like a bi-encoder, but instead of one vector per document we keep **one vector per token**. At query time, each query token finds its best-matching document token (this is called MaxSim), and those scores are added up. Much more detail than one vector, much cheaper than a cross-encoder. The cost is storage: many vectors per document.\n\nSo the standard stack is: **bi-encoder (plus BM25) to fetch candidates → cross-encoder to rerank the top few.** ColBERT is a strong option when you need a more accurate first stage and can afford the bigger index.",
      "points": [
        "**Bi-encoder:** separate encoding, one vector each, pre-computed - fast, less precise. First-stage retrieval.",
        "**Cross-encoder:** query + document together, one score - most accurate, slow, nothing pre-computed. Reranking.",
        "**ColBERT:** one vector per token, MaxSim scoring - more precise than a bi-encoder, much cheaper than a cross-encoder, but a far bigger index.",
        "Standard pipeline: bi-encoder + BM25 → cross-encoder rerank on the top 20–100."
      ],
      "say": "The difference is when the query and the document interact. A bi-encoder embeds them separately, so documents are pre-computed and search is fast, but detail is lost in a single vector. A cross-encoder reads them together and gives the most accurate score, but it must run for every pair, so I only use it to rerank the top candidates. ColBERT keeps one vector per token and matches token by token - a middle path, paid for in index size.",
      "numbers": "A cross-encoder reranking 50 candidates typically adds around 50–300 ms. A ColBERT index stores one vector per token, so it is many times larger than a one-vector-per-chunk index unless compressed (ColBERTv2 / PLAID reduce this a lot).",
      "wrong": "\"Use a cross-encoder for retrieval because it is more accurate.\" You cannot score 10 million documents with a cross-encoder on every query - it is a reranker, not a retriever.",
      "follow": "Why can't we pre-compute cross-encoder scores?",
      "followAnswer": "Because the score depends on the query and the document together, and we do not know the query in advance. A bi-encoder can pre-compute because each document vector does not depend on the query. With a cross-encoder, every new query creates new pairs, so the model has to run again for each candidate."
    },
    {
      "id": "ar-03",
      "q": "A reranker only reorders what retrieval found. What can it fix, what can't it, and how many candidates should it see?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "reranking",
        "cross-encoder"
      ],
      "why": "The mechanism is covered in the RAG reranking card and the bi-encoder / cross-encoder card here; this checks whether you know its limits and how to size it.",
      "simple": "**Short version: a reranker fixes the order, not the haul. It can only promote a chunk the first stage already found.** (How a cross-encoder works is in the bi-encoder / cross-encoder / ColBERT card above.)\n\nA reranker reads the question and each candidate chunk together, so it judges relevance far better than the embedding model. But it only sees the candidates it is given. If the right chunk is not among them, no reranker can bring it back.\n\n**What it can fix:** the right chunk was retrieved but ranked low - eighth, say - so the model never used it. The reranker moves it to the top.\n\n**What it cannot fix:** the right chunk was never retrieved. Bad chunking, a missing document, an exact code that embeddings blur, or a question that needs two lookups. Those are recall problems, and they are fixed upstream.\n\n**How many candidates?** Latency grows with every candidate, because each one is a separate model pass. So measure first-stage recall at 20, 50 and 100, and rerank the smallest number where recall stops rising. Fifty is a common default. If recall@100 is still low, stop tuning the reranker and fix retrieval instead.",
      "points": [
        "Bi-encoder: separate encodings, precomputable, fast, less precise.",
        "Cross-encoder: joint encoding of the pair, precise, nothing precomputable.",
        "Therefore two stages - recall cheaply, then reorder precisely.",
        "Size N from first-stage recall@20/50/100 - rerank where recall flattens. Latency scales with N.",
        "It fixes ranking, not recall. If the right chunk was not in the fifty, it cannot help."
      ],
      "say": "A reranker is a cross-encoder that reads the question and each candidate together, so it orders far better than the embedding model - but it only reorders what the first stage returned. It fixes ranking, not recall: if the right chunk is not among the candidates, it cannot help. I size the candidate list by measuring first-stage recall at 20, 50 and 100 and reranking where recall flattens, because latency grows with every candidate.",
      "numbers": "Reranking 20–50 candidates typically adds about 50–300 ms, depending on model size, hosting and candidate count. Reranking 200 adds roughly proportionally more, usually for diminishing returns.",
      "wrong": "\"A reranker will fix our accuracy,\" with no mention of recall. The follow-up gives a low recall@50 and asks whether it helps - and it cannot, because it only reorders what was retrieved.",
      "follow": "Recall@50 is 0.7. Does a reranker help you?",
      "followAnswer": "Only for the 70% of questions where the right chunk is in the fifty - it can move that chunk to the top. For the other 30% it can do nothing, because it never sees the right chunk. So I check recall at 100 or 200 first. If it barely rises, the problem is retrieval itself - chunking, hybrid search, query rewriting or the embedding model - and I fix that first."
    },
    {
      "id": "ar-16",
      "q": "Your vector index is too big and too expensive. How does quantization help?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "vector-db",
        "scaling"
      ],
      "why": "Whether you can bring retrieval cost down without blindly giving up quality.",
      "simple": "**Short version: store each number in fewer bits so the index fits in cheaper memory, then re-check the top few results with the full vectors to win back accuracy.**\n\nLet's do the maths first, because interviewers love it. **10 million chunks × 1,024 dimensions × 4 bytes (float32) ≈ 41 GB** - just for the raw vectors, before any index overhead. Vector search is fastest when this sits in RAM, and RAM is expensive.\n\nQuantization means **storing each number with fewer bits**. Like saving a photo as a smaller JPEG: slightly less detail, a much smaller file.\n\n- **Scalar (int8) quantization:** each 4-byte float becomes a 1-byte integer. **4x smaller**, and quality loss is usually very small.\n- **Binary quantization:** each dimension becomes a single bit - positive = 1, negative = 0. **32x smaller**, and comparing vectors becomes very fast bit-counting. Quality drops more, and it works better with some embedding models than others.\n- **Product quantization (PQ):** cut the vector into pieces and replace each piece with the ID of its closest entry in a small \"codebook\". Very high compression; used in FAISS and IVF-PQ indexes.\n\nThe trick that makes aggressive quantization work is **rescoring**: search the small compressed vectors to get, say, the top 100 candidates fast, then re-score only those 100 using the full-precision vectors kept on cheaper disk. You keep most of the memory and speed savings and get most of the accuracy back.\n\nA related idea is **Matryoshka embeddings**: models trained so you can simply cut the vector shorter (for example 1,024 → 256 dimensions) and it still works. Quantization reduces the bits per number; Matryoshka reduces how many numbers there are. You can combine both.\n\nAnd always compare recall before and after on your eval set.",
      "points": [
        "Memory = vectors × dimensions × bytes per number. 10M × 1,024 × 4 B ≈ 41 GB.",
        "int8: 4x smaller, small loss. Binary: 32x smaller, bigger loss. PQ: very high compression.",
        "Rescore the top candidates with full-precision vectors to win back accuracy.",
        "Matryoshka truncation shortens the vector; combine it with quantization. Check recall on your eval set."
      ],
      "say": "Quantization stores each vector with fewer bits. Int8 makes the index four times smaller with very little quality loss; binary makes it thirty-two times smaller but loses more. The trick is rescoring: search the compressed vectors for the top hundred candidates, then re-score those with full-precision vectors kept on disk. Matryoshka embeddings let me also shorten the vector. I always compare recall before and after on the eval set.",
      "numbers": "10M × 1,024-dim: float32 ≈ 41 GB → int8 ≈ 10 GB → binary ≈ 1.3 GB. Published benchmarks report binary plus rescoring keeping roughly 90–95% or more of the original retrieval quality for models that suit it - measure on your own model and data.",
      "wrong": "Quantizing without rescoring and without measuring recall. That is how you quietly lose the right chunk from the top-k and only find out from user complaints.",
      "follow": "Why does binary quantization work at all, when it throws away so much information?",
      "followAnswer": "In high dimensions, the pattern of signs - which dimensions are positive and which are negative - still carries a lot of the vector's direction, and similarity search mostly cares about direction. So comparing bit patterns is a rough but useful stand-in for cosine similarity. It is good enough to find candidates, and rescoring with full vectors fixes the final order."
    },
    {
      "id": "ar-07",
      "q": "How do you handle a multi-hop question, where the second lookup depends on the first answer?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "multi-hop",
        "retrieval"
      ],
      "why": "The dependent version of multi-document questions, and a failure most RAG systems have but never diagnose.",
      "simple": "**Short version: when the second search needs the answer to the first, search in steps - not in one shot.**\n\nThis is the failure that hides. Retrieval returns chunks that are individually relevant, the model produces a confident answer, and the answer is wrong because the second fact was never retrieved.\n\nTake \"is the manager of the Pune claims team eligible for the new allowance\". First you must find who that manager is and their grade, from one source; only then can you look up the allowance rule for that grade, from another. The second search depends on the first answer, so a single retrieval on the raw question finds documents about neither, or about only one.\n\nThe options. Iterative retrieval: retrieve, let the model extract what it now knows (the manager's name and grade), then write the next query with it - a loop capped at two or three hops. Sequential decomposition: plan the steps up front (find the manager, then find the rule for their grade) and fill each query with the previous answer. Parallel decomposition - independent sub-questions retrieved side by side - only works when the parts do not depend on each other, which is the comparison case covered in the RAG topic. Or a structural fix: if the two facts always travel together, join them at ingestion so one chunk contains both.\n\nThe last one is underrated. Fixing it at ingestion costs nothing at query time.",
      "points": [
        "Symptom: confident answers built on half the facts. It rarely looks like a retrieval failure.",
        "Dependent chains need sequential steps, each query built from the previous answer. Parallel decomposition only suits independent parts.",
        "Iterative retrieval - an agentic loop, capped at two or three hops.",
        "Structural fix - join facts at ingestion if they always co-occur.",
        "Your eval set must contain multi-hop questions, or you will never see this."
      ],
      "say": "This one hides, because the chunks returned are individually relevant and the answer looks confident while resting on half the facts. When the second lookup depends on the first answer, I retrieve in steps - find the manager, extract their grade, then search the rule for that grade - capped at two or three hops. Parallel decomposition only suits independent parts. And if the facts always travel together, I join them at ingestion.",
      "numbers": "Cap iterative retrieval at two or three hops. Beyond that you are usually paying for a question the corpus cannot answer.",
      "wrong": "\"I would increase k so more documents are retrieved.\" It occasionally helps by luck and mostly adds noise and cost, because the second fact is not near the question in embedding space.",
      "follow": "How do you detect multi-hop failures in production?",
      "followAnswer": "Offline, I put labelled multi-hop questions in the eval set and check that every needed fact was retrieved, not just one. In production I trace each request and run a groundedness check: a claim in the answer that no retrieved chunk supports is the typical sign of a missing hop. I also review thumbs-down answers and tag the ones that needed a second lookup."
    },
    {
      "id": "ar-05",
      "q": "What is agentic RAG and when is it worth it?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "agents",
        "architecture",
        "cost"
      ],
      "why": "The buzzword of the moment. The panel is checking whether you can bound it.",
      "simple": "Standard RAG retrieves once and answers. Agentic RAG lets the model decide: whether to retrieve at all, which source to search, whether what came back is good enough, and whether to search again with a different query.\n\nIt genuinely helps in three situations. Multi-hop questions, where no single chunk contains the answer and you need to find one fact to look up the next. Multiple sources, where the right move is choosing between a policy corpus, a database and a live API. And self-correction, where the model notices the retrieved documents do not answer the question and tries again.\n\nThe costs are the ones agents always have: several model calls instead of one, so latency and spend multiply; non-determinism, so the same question can take a different path; and much harder debugging.\n\nSo the bounded version: use it where the question genuinely needs multiple steps, cap the loop at two or three retrievals, and route simple questions straight down the cheap path. Most traffic is simple.\n\n(How to design the retrieval tool itself - description, filters, budgets - is the next card.)",
      "points": [
        "The model decides whether, where and how many times to retrieve.",
        "Worth it for multi-hop, multi-source, and self-correcting retrieval.",
        "Multiplies latency and cost - several calls where there was one.",
        "Cap retrieval loops at two or three. Uncapped, it is a runaway.",
        "Route simple questions past it. Most traffic does not need it.",
        "Needs tracing, or you cannot explain why one answer was slow and wrong."
      ],
      "say": "Agentic RAG lets the model decide whether to retrieve, which source to use, whether the results are good enough, and whether to search again. It earns its cost on multi-hop questions, multiple sources, and self-correction. It multiplies latency and spend, and it is non-deterministic, so I cap the loop at two or three retrievals and route simple questions straight down the cheap path, because most traffic is simple.",
      "numbers": "A three-step agentic path costs roughly three times the model calls of single-shot RAG. Route on question type, or that becomes your default cost.",
      "wrong": "\"We made our RAG agentic to improve quality.\" Without the cap, the routing and the cost comparison, the follow-up - which questions needed it, and at what cost - has no answer ready.",
      "follow": "How do you decide which questions take the cheap path?",
      "followAnswer": "A router in front. Usually a small, fast model or a trained classifier labels the question as a simple lookup, multi-step, or out of scope. Simple questions go straight to one retrieval and one answer. I also use a runtime signal: if the first retrieval scores well on the reranker, answer directly; if not, escalate to the agent loop. And I evaluate the router on its own labelled set."
    },
    {
      "id": "ar-17",
      "q": "Retrieval is now a tool the agent calls. What changes, and when is agentic RAG the wrong choice?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "agents",
        "trade-offs"
      ],
      "why": "Whether you can design retrieval for an agent loop, and still say no to an agent when a simple pipeline is enough.",
      "simple": "In classic RAG, retrieval is a fixed step: the question comes in, we always search once, then we answer. In agentic RAG, search is just **one tool** the model can choose to call - zero times, once, or five times, with different queries, alongside other tools like SQL or web search.\n\nThink of a vending machine vs a researcher. The vending machine always does the same one thing. The researcher decides what to look up, reads it, notices something is missing, and looks again.\n\n**What changes when retrieval becomes a tool:**\n1. **The tool needs a good description.** The model decides based on the tool's name and description - for example \"search_hr_policies: searches company HR documents; use for leave, benefits and conduct questions\". A vague description means wrong or missed calls.\n2. **The tool's inputs and outputs become design choices.** Can the agent pass filters (year, department)? How many results? Short, well-labelled results with sources help the agent decide its next step.\n3. **You need stopping rules.** A maximum number of steps, a token budget and a time limit - otherwise the agent can keep searching.\n4. **Evaluation gets harder.** You now check the path - did it search for the right thing, and how many times - not only the final answer.\n\n**When agentic RAG is the wrong choice:** when most questions are simple lookups (\"What is the notice period?\"), when latency must be low, when cost per query is tight, or when the process must be predictable and auditable. There, a fixed pipeline with hybrid search and a reranker is faster, cheaper and easier to debug. Send only the multi-step questions to the agent - usually through a router.",
      "points": [
        "Retrieval becomes a tool call: the model chooses whether, what and how often to search.",
        "Design the tool: clear name and description, useful filters, compact results with sources.",
        "Add budgets - max steps, tokens, time - and evaluate the path, not only the answer.",
        "Wrong for simple lookups, tight latency or cost, and processes that must be predictable - route instead."
      ],
      "say": "When retrieval becomes a tool, the model decides whether and how often to search, so the tool description, its filters and its result format become part of the design, and I add step, token and time budgets. I also evaluate the path, not just the answer. But for simple lookups, tight latency or strict audit needs, a fixed hybrid-search pipeline is faster, cheaper and easier to debug, so I route only multi-step questions to the agent.",
      "numbers": "A fixed pipeline usually answers in about 1–3 s with one LLM call; an agent loop commonly makes 3–10 calls and takes 5–30 s. Cap retrieval at two or three calls for most questions, as in the agentic RAG card, with a slightly higher overall step budget when other tools are involved.",
      "wrong": "\"Agentic RAG is the modern way, so we use it for everything.\" You multiply latency and cost for questions a single search already answers, and you lose predictability.",
      "follow": "The agent keeps calling search with almost the same query. How do you fix it?",
      "followAnswer": "First I look at what the tool returns - usually the results don't tell the agent anything new, so it retries. I make results clearer, with sources, and return an explicit 'no results for this filter' message. Then I add guards: block near-duplicate queries, cap the number of search calls, and tell the agent to answer or say it could not find it once the budget is used."
    },
    {
      "id": "ar-14",
      "q": "What are Self-RAG and Corrective RAG (CRAG)?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "self-rag",
        "crag"
      ],
      "why": "Whether you know the main self-checking RAG patterns by name and can say what problem each one solves.",
      "simple": "Normal RAG is blind: it always retrieves, and it always trusts whatever comes back. Self-RAG and CRAG both add a **check step** - but they check different things.\n\n**Corrective RAG (CRAG) - check the documents before answering.**\nThink of a student who picks up a book, reads the pages, and asks: \"Are these pages actually about my question?\" CRAG adds a small evaluator (a grader) after retrieval that scores the documents as correct, incorrect or ambiguous:\n- **Correct** → use them (trimmed to the useful parts).\n- **Incorrect** → throw them away and search again somewhere else, for example a web search or a rewritten query.\n- **Ambiguous** → use both the trimmed documents and the new search.\nSo CRAG fixes one problem: bad retrieval being passed straight to the model.\n\n**Self-RAG - the model checks itself all the way through.**\nSelf-RAG trains the model to output special \"reflection\" tokens. While writing, the model decides: Do I even need to retrieve here? After retrieving: Is this passage relevant? After writing: Is my sentence supported by the passage? Is my answer useful?\nSo Self-RAG fixes two problems: retrieving when it is not needed, and writing claims the passage does not support.\n\n**The simple difference:** CRAG checks the **input** (the retrieved documents) with a separate grader. Self-RAG checks **when to retrieve and its own output**, and in the original paper it needs a specially trained model.\n\nIn practice, most teams build a lighter version of both, for example in LangGraph: a \"grade documents\" step, a \"rewrite and retry\" loop, and a \"is the answer grounded?\" step - using a normal LLM as the grader instead of training a special model.",
      "points": [
        "**CRAG:** a retrieval grader scores documents → use them, discard and search again (e.g. web), or mix.",
        "**Self-RAG:** the model decides when to retrieve and critiques relevance, support and usefulness with reflection tokens.",
        "CRAG checks the input; Self-RAG checks the need to retrieve and the output.",
        "Production version: grade → rewrite/retry → groundedness check, as a small loop with a normal LLM grader."
      ],
      "say": "Both add a check to blind RAG. Corrective RAG grades the retrieved documents before generation; if they are wrong, it throws them away and searches again, for example with a rewritten query or a web search. Self-RAG trains the model to decide when to retrieve and to critique whether each passage is relevant and whether its own answer is supported. In production I usually build a lighter version: grade, retry, then check groundedness.",
      "numbers": "Each check is an extra model call - a grading loop typically adds a few hundred milliseconds to a couple of seconds - so cap retries at one or two.",
      "wrong": "\"Self-RAG and CRAG are the same thing.\" They check different stages. And describing Self-RAG as just \"the LLM reviews its answer\" misses the retrieve-only-when-needed part.",
      "follow": "Would you use a big LLM as the document grader?",
      "followAnswer": "Usually not. 'Is this chunk relevant to the question?' is a simple classification task, so a small fast model - or a cross-encoder reranker score with a threshold - is often good enough and much cheaper. I would compare a small grader against a big one on a labelled sample, and only pay for the big one if the accuracy gap actually matters."
    },
    {
      "id": "ar-06",
      "q": "What is GraphRAG and would you actually build it?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "graphrag",
        "knowledge-graph",
        "trade-off"
      ],
      "why": "A depth question where the honest answer - usually no - scores higher than enthusiasm.",
      "simple": "GraphRAG builds a knowledge graph from your documents first - entities and the relationships between them - and retrieves over that structure instead of, or alongside, plain chunks.\n\nIt answers a class of question that chunk retrieval cannot. \"Which of our suppliers are affected by this regulation, and through which contracts?\" That requires connecting facts spread across many documents, and no single chunk contains it. Summarising a whole corpus by theme is the other case - Microsoft's GraphRAG clusters the graph into communities and pre-summarises each, so 'global' questions are answered from those summaries.\n\nThe costs are large and worth naming plainly. Extracting entities and relationships means model calls over every chunk, plus the community summaries, so ingestion is expensive (lighter variants such as LazyGraphRAG defer most of that LLM work to query time). The graph needs maintenance as documents change. Extraction errors compound into a wrong graph, which is worse than no graph. And you now operate a second datastore.\n\nSo: build it when the questions are genuinely relational and the corpus is stable enough to justify the ingestion cost. For \"what does the policy say about X\", plain RAG with a reranker wins on every axis. (The broader graph-versus-vector-store decision is the knowledge graph card below.)",
      "points": [
        "Extracts entities and relationships, retrieves over the graph.",
        "Wins on relational and whole-corpus questions no single chunk can answer.",
        "Ingestion cost is high - model passes over the whole corpus (LazyGraphRAG-style variants cut this).",
        "Extraction errors compound. A wrong graph is worse than none.",
        "Adds a second datastore to operate and keep in sync.",
        "For lookup-style questions, plain RAG plus reranking wins outright."
      ],
      "say": "GraphRAG extracts entities and relationships into a graph and retrieves over that, which answers relational questions no single chunk contains - which suppliers are affected by this regulation, through which contracts. The cost is a model pass over the whole corpus at ingestion, ongoing graph maintenance, and a second datastore. I would build it only where the questions are genuinely relational. For lookup questions, plain RAG with a reranker wins.",
      "numbers": "Full GraphRAG makes one or more model calls per chunk at ingestion, plus a summary call per community. On a large corpus that is a substantial one-time bill - price it before proposing it. Microsoft reports LazyGraphRAG's indexing cost as roughly that of plain vector RAG.",
      "wrong": "\"GraphRAG is more accurate than normal RAG.\" On relational questions, often. On lookup questions it is more expensive and no better, and that distinction is the answer.",
      "follow": "Your documents change weekly. What does that do to the graph?",
      "followAnswer": "It turns into a maintenance job. Each changed document needs its entities and relationships re-extracted, merged into existing nodes through entity resolution, stale ones removed, and the affected community summaries regenerated. So I track which chunks fed which nodes, update incrementally, and schedule a fuller rebuild when drift builds up. If churn is high, LazyGraphRAG-style indexing or plain RAG is often the better choice."
    },
    {
      "id": "ar-09",
      "q": "Which of these techniques would you actually add first, and why?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "advanced-rag",
        "judgement",
        "prioritisation"
      ],
      "why": "The synthesis question. It tests prioritisation, which is the actual senior skill in this topic.",
      "simple": "Measure before adding anything. The order depends on which half is failing, and adding techniques blind is how pipelines become slow and expensive without getting better.\n\nIf recall is the problem - the right chunk is not being retrieved - no amount of reranking helps, because reranking only reorders what you already found. Fix ingestion and chunking first, then add hybrid search, then contextual enrichment.\n\nIf recall is fine but the right chunk ranks low, that is exactly what a reranker fixes, and it is the highest value-per-effort change in this topic.\n\nIf retrieval is fine and answers are still wrong, the problem is generation - prompt, context ordering, refusal handling - not retrieval at all.\n\nMy default order: fix chunking, add hybrid search, add a reranker, then contextual enrichment, and only then consider query rewriting or an agentic loop. The exotic techniques come last because they cost the most and help the narrowest set of cases.",
      "points": [
        "Measure first: is it recall, ranking, or generation?",
        "Low recall → chunking, ingestion quality, hybrid search. Reranking cannot help.",
        "Good recall, poor ranking → reranker. Best value in the topic.",
        "Good retrieval, bad answers → it is a generation problem.",
        "Default order: chunking, hybrid, rerank, contextual enrichment, then the rest.",
        "Each addition must be justified against latency budget and cost per query."
      ],
      "say": "I measure first, because the order depends on which half is failing. If recall is low, reranking cannot help - it only reorders what was found - so I fix chunking and add hybrid search. If recall is fine but ranking is poor, a reranker is the best value in this topic. If retrieval is fine and answers are wrong, it is a generation problem. Exotic techniques come last, because they cost most and help narrowest.",
      "numbers": "Track recall@k, answer accuracy, p95 latency and cost per query together. Any technique that moves one without a stated trade on the others has not been measured.",
      "wrong": "Listing every technique you know. The question is about prioritisation, and an unordered list answers a different one.",
      "follow": "You added three techniques and quality is flat. What went wrong?",
      "followAnswer": "Usually they were added without diagnosing which stage was failing, or all at once, so their effects cancelled out or hid each other - or the eval set does not contain the failing questions. I go back to the baseline, measure recall, ranking and faithfulness separately, then add one technique at a time on the same eval set, keeping only those that move their target metric within budget."
    },
    {
      "id": "ar-20",
      "q": "Multi-query, RAG-Fusion, step-back, decomposition and routing - compare the query transformation techniques.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "query-transformation"
      ],
      "why": "Whether you can match a query technique to a failure, rather than listing buzzwords.",
      "simple": "The user's question is often not the best search query. Query transformation means changing the question before we search. Each technique fixes a different problem, so the easy way to remember them is **problem → fix**.\n\n**1. Rewriting** - problem: a messy or follow-up question (\"what about for interns?\"). Fix: rewrite it into a clean standalone question.\n\n**2. Multi-query** - problem: one wording can miss the right chunk. Fix: ask the LLM for 3–5 different versions of the question, search with all of them, and combine the results.\n\n**3. RAG-Fusion** - multi-query plus a smart way to merge the lists: **Reciprocal Rank Fusion (RRF)**. A chunk that appears near the top of several lists wins. Score = sum of 1 / (60 + rank) across the lists.\n\n**4. Step-back prompting** - problem: the question is too specific (\"Can I claim a taxi at 11 pm after a client dinner in Pune?\"). Fix: also search a broader question (\"What is the late-night travel expense policy?\"), which finds the general rule.\n\n**5. Decomposition** - problem: the question has several parts (\"Compare the 2024 and 2025 leave policies\"). Fix: split it into sub-questions, retrieve for each, then combine.\n\n**6. Routing** - problem: the answer lives in different places. Fix: first decide where to look - HR documents vs product manuals, or vector search vs a SQL database.\n\n**7. HyDE** - problem: questions and answers look different. Fix: search with a hypothetical answer.\n\nAlmost every technique adds an LLM call (latency and money) - routing can use a small classifier instead - so add only the one that fixes the failure you actually measured.",
      "points": [
        "Rewriting → follow-up and messy questions.",
        "Multi-query / RAG-Fusion (merge with RRF) → one wording misses the chunk.",
        "Step-back → too specific; also retrieve the general rule.",
        "Decomposition → multi-part or comparison questions.",
        "Routing → pick the right index or tool. HyDE → questions and answers look different."
      ],
      "say": "I match the technique to the failure. Rewriting fixes follow-up questions. Multi-query and RAG-Fusion fix wording sensitivity by searching several phrasings and merging them with reciprocal rank fusion. Step-back fixes over-specific questions by also retrieving the general rule. Decomposition splits multi-part questions. Routing sends the question to the right index or database. Most add an LLM call, so I add one only after the eval shows that failure.",
      "numbers": "RRF uses k = 60 by convention: score = Σ 1 / (60 + rank). Multi-query usually uses 3–5 variants, searched in parallel.",
      "wrong": "Listing all seven and saying \"we used them all\". Stacking them multiplies latency and cost, and you can no longer tell which one actually helped.",
      "follow": "Why does RRF use the rank instead of the similarity scores?",
      "followAnswer": "Because scores from different searches are not on the same scale - a BM25 score of 12 and a cosine similarity of 0.8 cannot be added in any meaningful way, and even two vector searches can have different score ranges. Ranks are always comparable. RRF simply rewards documents that show up near the top in many lists, which is simple and robust."
    },
    {
      "id": "ar-19",
      "q": "What is HyPE, and how is it different from HyDE?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "query-transformation",
        "indexing"
      ],
      "why": "Whether you understand that you can move LLM work from query time to index time.",
      "simple": "First, the problem both solve: **a question and its answer don't look alike.** \"How many days of leave do I get?\" and \"Employees are entitled to 24 days of paid annual leave\" share very few words, so their embeddings can be further apart than we would like.\n\n**HyDE (Hypothetical Document Embeddings) - fix it at query time.**\nWhen the question arrives, ask the LLM to write a fake answer, embed that fake answer, and search with it. A fake answer looks like a real answer, so it lands near the real chunk. The cost: one extra LLM call on **every query** - slower and pricier - and the fake answer can drift in the wrong direction if the model doesn't know the domain.\n\n**HyPE (Hypothetical Prompt Embeddings) - fix it at index time.**\nFlip the idea. When we ingest each chunk, we ask the LLM: \"What questions could this chunk answer?\" It writes, say, 3–5 questions. We embed those questions and link them to the chunk. At query time, the user's question is compared with the stored questions - question to question, which is a much closer match. No extra LLM call while the user waits.\n\nSo: **HyDE pays the LLM cost on every query; HyPE pays it once at ingestion.** HyPE is better for latency. HyDE needs no re-indexing and adapts to any question. HyPE's costs are a bigger index (several question vectors per chunk) and regenerating the questions when a chunk changes.",
      "points": [
        "Both fix the gap between how questions look and how answers look.",
        "HyDE: generate a fake answer at query time and search with it - one extra LLM call per query.",
        "HyPE: generate likely questions per chunk at index time and match question to question - no query-time call.",
        "HyPE wins on latency; HyDE avoids re-indexing. HyPE makes the index bigger."
      ],
      "say": "Both close the gap between how a question looks and how its answer looks. HyDE does it at query time: the LLM writes a hypothetical answer and we search with that, which costs an extra call on every query. HyPE does it at index time: for each chunk, the LLM generates the questions it could answer, and we match the user's question against those. So HyPE moves the cost to ingestion and keeps query latency low.",
      "numbers": "HyDE adds one LLM call per query, often 0.5–2 s. HyPE with about 3–5 questions per chunk multiplies the number of stored vectors by roughly that factor.",
      "wrong": "\"HyPE and HyDE are the same trick.\" The whole point is where the cost sits - query time or index time - and that changes latency, index size and freshness.",
      "follow": "When would HyPE not help?",
      "followAnswer": "When users ask things the generated questions did not anticipate - very specific combinations, or comparisons across several chunks. It also helps less when queries are keyword-like, such as product codes, where BM25 already does the work. That is why I keep the normal chunk embeddings and BM25 alongside the generated questions, not instead of them."
    },
    {
      "id": "ar-04",
      "q": "What is contextual retrieval, or contextual chunk enrichment?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "chunking",
        "ingestion"
      ],
      "why": "A widely adopted ingestion technique, popularised by Anthropic in 2024. The signal is whether you know the cheap version and where the cost sits.",
      "simple": "A chunk taken out of a document loses its context. A paragraph that says \"the waiting period is 90 days\" does not say which plan it belongs to, because that was in the heading three pages up. Embed that chunk and it will not match a question about the GOLD plan.\n\nContextual enrichment fixes it at ingestion. Before embedding, you prepend a short generated line that situates the chunk - which document, which section, what it is about. \"From the 2026 GOLD plan policy, eligibility section: the waiting period is 90 days.\" Now the chunk carries its own context and matches properly. Use the same enriched text for the BM25 index too, not only for the embeddings.\n\nThe cost is at ingestion, not query time, which is what makes it attractive: you pay once per chunk instead of on every request. For a large corpus it is a real one-time bill, and prompt caching over the source document reduces it considerably.\n\nThe cheap version, worth mentioning: much of the benefit comes from simply prepending the document title and heading path, with no model call at all. Try that first.",
      "points": [
        "Chunks lose the context that made them meaningful - usually the heading.",
        "Prepend a short situating line before embedding, at ingestion.",
        "Cost is one-time per chunk, not per query. That is the point.",
        "Prompt caching over the source document cuts the ingestion bill.",
        "Cheapest version: prepend title and heading path, no model call.",
        "Store the enriched text for embedding, the original for display."
      ],
      "say": "A chunk loses the heading that gave it meaning, so a paragraph saying \"the waiting period is 90 days\" never matches a question about the GOLD plan. At ingestion I prepend a short line situating the chunk in its document and section, then embed that. The cost is one-time per chunk rather than per query. And much of the gain comes from just prepending the title and heading path, with no model call at all.",
      "numbers": "Anthropic's 2024 write-up reported about 35% fewer top-20 retrieval failures from contextual embeddings, about 49% with contextual BM25 added, and about 67% with reranking on top - on their benchmarks, so measure on yours. The cost is once per chunk at ingestion, and prompt caching over the source document cuts it sharply.",
      "wrong": "\"We add metadata to the chunk.\" Metadata in a separate field does not affect the embedding. The context has to be in the text that gets embedded.",
      "follow": "Do you embed the enriched text or the original? Which one do you show the user?"
    },
    {
      "id": "ar-23",
      "q": "What is late chunking, and how is it different from contextual retrieval?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "chunking",
        "embeddings",
        "late-chunking"
      ],
      "why": "Whether you know the embedding-side fix for chunks that lose their context, and what it cannot do.",
      "simple": "Both fix the same problem: a chunk cut out of a document loses its context. A chunk that says \"its population is 3.8 million\" does not say which city \"its\" means, so its embedding matches the wrong questions.\n\nContextual retrieval (the card above) fixes it with text. An LLM writes a short context line for each chunk, and that line is embedded and indexed with it. It costs an LLM call per chunk at ingestion, but it helps both vector search and BM25.\n\nLate chunking fixes it inside the embedding model, with no LLM call. Normally you chunk first and embed each chunk alone. Late chunking flips the order. You feed the whole document, or a large section, through a long-context embedding model once. Every token now has a vector that has \"seen\" the whole document. Only then do you cut at the chunk boundaries and average the token vectors inside each chunk. So the population chunk still carries the city named earlier.\n\nThe limits. You need an embedding model that exposes token-level outputs and has a long input window - Jina's models support it directly, most closed embedding APIs do not. Documents longer than the window still need splitting into large sections. And it only helps the dense side, not BM25.\n\nHosted models now package the same idea: Voyage's voyage-context-3 embeds chunks with document context for you.",
      "points": [
        "Problem: chunks lose references like \"it\", \"the plan\" or \"the city\" that were resolved earlier in the document.",
        "Contextual retrieval: an LLM writes context text per chunk - costs calls, helps dense and BM25.",
        "Late chunking: embed the whole document once, then pool token vectors per chunk - no LLM call.",
        "Needs a long-context model with token-level outputs; helps dense retrieval only.",
        "Measure both on your eval set; they can be combined."
      ],
      "say": "Both fix chunks that lose their document context. Contextual retrieval uses an LLM to write a context line for each chunk before indexing, which costs a call per chunk but helps both embeddings and BM25. Late chunking runs the whole document through a long-context embedding model first, then pools the token vectors inside each chunk, so every chunk embedding already knows its surroundings, with no LLM calls. It needs a model that exposes token outputs.",
      "numbers": "Late chunking was introduced by Jina AI in 2024. It is bounded by the embedding model's input window - 8,192 tokens for jina-embeddings-v3, 32K for voyage-context-3. Reported gains are small on short documents and larger on long ones; measure on yours.",
      "wrong": "\"Just use bigger chunks so they keep their context.\" Bigger chunks blur the embedding and hurt precise matches. The point of late chunking is small chunks that still know their context.",
      "follow": "Which would you try first on a new corpus?",
      "followAnswer": "The free one: prepend the document title and section heading to each chunk. If references still break, I try late chunking or a contextual embedding model, if our embedding choice supports it, because it adds no LLM calls. I use LLM-written contextual retrieval when BM25 also needs the context, or when the corpus is small enough that the one-time bill is fine."
    },
    {
      "id": "ar-18",
      "q": "What are hierarchical indexes like RAPTOR, and what is sentence-window retrieval?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "indexing",
        "chunking"
      ],
      "why": "Whether you know how to answer both detail questions and big-picture questions from the same corpus.",
      "simple": "Normal chunking has one weakness: every chunk is a small piece at the same level. That works for \"What is the late fee?\" but fails for \"What are the main themes of this 200-page report?\" - no single small chunk contains the big picture.\n\n**RAPTOR - build a tree of summaries.**\nThink of a book: pages → chapter summaries → one book summary. RAPTOR builds this automatically:\n1. Chunk the documents normally (these are the leaves).\n2. Group similar chunks together (clustering).\n3. Ask an LLM to summarise each group.\n4. Repeat on the summaries - group, summarise - until only a few top-level summaries remain.\nThen we index **every level**. A detail question matches a leaf chunk; a big-picture question matches a high-level summary. The downside: it is expensive to build (many LLM calls), and parts must be rebuilt when documents change.\n\n**Sentence-window retrieval - search small, read wide.**\nWe embed single sentences, because one sentence has one clear meaning and matches precisely. But a sentence alone lacks context, so after finding the best sentence we give the LLM that sentence **plus a few sentences before and after** it (the \"window\"). It is a simple cousin of parent-child retrieval: search on a small unit, return a larger one.\n\nWhen to use which: sentence-window (or parent-child) for precise fact lookups in long text; RAPTOR-style summaries when users ask thematic or \"summarise across\" questions.",
      "points": [
        "Flat chunks answer detail questions but miss big-picture questions.",
        "RAPTOR: cluster chunks → summarise → repeat; index every level of the tree.",
        "Sentence-window: embed single sentences, return the sentence plus its neighbours.",
        "RAPTOR costs many LLM calls and must be updated on change; sentence-window is cheap."
      ],
      "say": "Flat chunks answer detail questions but not big-picture ones. RAPTOR fixes that by clustering chunks, summarising each cluster with an LLM, and repeating until it has a tree, then indexing every level, so a thematic question can match a summary. Sentence-window retrieval goes the other way: embed single sentences for precise matching, then give the model the surrounding sentences for context. I use RAPTOR for thematic questions and sentence-window for precise lookups.",
      "numbers": "RAPTOR-style trees usually have 2–4 levels, costing about one LLM summary call per cluster per level. A window of 2–5 sentences on each side is a common starting point.",
      "wrong": "\"Just make the chunks bigger for summary questions.\" Bigger chunks hurt precise matching for every other question, and still don't capture a whole document's themes.",
      "follow": "Documents change every week. How do you keep a RAPTOR tree up to date?",
      "followAnswer": "I don't rebuild the whole tree. I re-embed and re-cluster only the changed leaves, and regenerate the summaries on the path from those leaves up to the top. If the corpus changes a lot, I schedule a full rebuild at a quiet time and keep serving the old tree until the new one passes a quick eval."
    },
    {
      "id": "ar-21",
      "q": "What is context compression, and when would you use it?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "context",
        "cost"
      ],
      "why": "Whether you can cut tokens and noise in the prompt without cutting the answer.",
      "simple": "Retrieval gives us, say, 10 chunks of 500 tokens - 5,000 tokens. But often the actual answer is in 3 sentences. The rest is noise: it costs money, slows the response, and can distract the model. (LLMs tend to use information buried in the middle of a long context less reliably - the \"lost in the middle\" effect. Newer models have reduced it, but not removed it.)\n\nContext compression means **keeping only the useful part of the retrieved text** before it goes to the LLM. Like highlighting the important lines in a textbook before an exam, instead of re-reading every page.\n\nThree ways, from simple to advanced:\n\n**1. Filter whole chunks.** Drop chunks with a low reranker score. Easiest, and very effective.\n\n**2. Extract sentences.** Keep only the sentences inside each chunk that relate to the question, chosen by a small model or by embedding similarity. (LangChain's ContextualCompressionRetriever does this - in LangChain 1.x it lives in the langchain-classic package.)\n\n**3. Token-level compression.** Tools like LLMLingua use a small language model to delete low-information words, compressing the prompt several times over while keeping most of the meaning.\n\nThe risk: you might cut exactly the sentence that mattered - a condition like \"except for contract staff\". So always evaluate compression on answer quality, and keep citations pointing to the original chunk.\n\nUse it when context is large and cost or latency matters, or when many retrieved chunks are only partly relevant. Skip it when you already pass a few short, well-reranked chunks.",
      "points": [
        "Goal: fewer tokens and less noise - lower cost, lower latency, less \"lost in the middle\".",
        "Levels: drop chunks by reranker score → extract relevant sentences → token-level (LLMLingua).",
        "Risk: removing a key condition. Evaluate on answer quality; keep citations to the original chunks."
      ],
      "say": "Context compression keeps only the useful part of the retrieved text before it reaches the model, so we pay for fewer tokens, respond faster and give the model less noise. I start simple - drop chunks the reranker scores low - then extract only the relevant sentences if needed, and use token-level tools like LLMLingua only when the context is very large. The risk is cutting a key condition, so I evaluate answer quality before and after.",
      "numbers": "LLMLingua-style methods report compressing prompts by roughly 2–20x depending on the task; how much sentence extraction cuts depends on how focused your chunks already are - measure it on your own traffic.",
      "wrong": "\"The context window is big enough, so compression doesn't matter.\" You still pay for every token on every request, and more noise often lowers answer quality.",
      "follow": "Compression dropped a sentence and the answer became wrong. How would you catch this before users do?",
      "followAnswer": "Run the eval set twice - with and without compression - and compare correctness and faithfulness per question, not only the average. The questions that fail only with compression show what it is cutting. Conditions and exceptions are the usual victims, so I either compress less or protect sentences containing words like 'except', 'unless' and 'only'."
    },
    {
      "id": "ar-24",
      "q": "What is cache-augmented generation (CAG), and when would you use it instead of RAG?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "cag",
        "long-context",
        "caching",
        "trade-off"
      ],
      "why": "A recent name-check. The panel wants the mechanism and the narrow conditions where it beats retrieval.",
      "simple": "CAG skips retrieval. You load the whole knowledge base into the model's context once, keep the model's processed version of it cached, and reuse that cache for every question.\n\nThe cached thing is the KV cache - the keys and values the model computes internally for every input token. Computing it for a long document is the slow, expensive part. With CAG you do it once. Each new question is appended to the cached context, so there is no search step, no chunking and no retrieval miss. The idea was named in a December 2024 paper titled \"Don't Do RAG\". With a hosted API, the everyday version is provider prompt caching of a long, fixed prefix.\n\nIt fits a narrow case: the knowledge is small enough to fit comfortably in the context window, it rarely changes, and every user may see all of it. A product manual, an FAQ, one policy set.\n\nOutside that case it breaks. The corpus must fit the window. You still pay for all those tokens on every call - cached tokens are cheaper, not free. Any document change invalidates the cache. Accuracy can drop when the answer is buried in a very long context. And there is no per-user filtering, so permissions are out.\n\nA common middle path: cache the stable core, retrieve the rest. (The general long-context-versus-RAG debate is in the RAG topic.)",
      "points": [
        "Preload the knowledge base, cache the model's KV state (or use provider prompt caching), answer with no retrieval step.",
        "Removes retrieval misses, chunking and index maintenance.",
        "Fits: small, stable corpus every user may see - manuals, FAQs, one policy set.",
        "Fails: corpus bigger than the window, frequent updates, per-user permissions, very long contexts that dilute accuracy.",
        "Hybrid is common: cache the stable core, retrieve the long tail."
      ],
      "say": "Cache-augmented generation skips retrieval. I load the whole knowledge base into context once, cache the model's processed state - or use provider prompt caching - and answer every question against that cached prefix. There is no retrieval miss and no index to run. It fits a small, stable corpus that every user may see, like a product manual. It breaks when the corpus outgrows the window, changes often, or needs per-user permissions.",
      "numbers": "Cached input tokens are billed at a fraction of the normal input price - roughly 10-50% depending on provider and model - and caches expire (Anthropic's default lifetime is 5 minutes, with a 1-hour option). A 100k-token prefix is still 100k tokens of context on every call.",
      "wrong": "\"Context windows are big now, so CAG replaces RAG.\" It only holds for small, static, unpermissioned corpora, and the follow-ups on updates and access control have no answer.",
      "follow": "The FAQ you cached changes twice a day. Does CAG still work?",
      "followAnswer": "Yes, if the prompt is structured for it. Each change means rebuilding the cache once, which is cheap at twice a day. I put the stable instructions first and the FAQ after, version the FAQ, and warm the new cache when it is published. It stops working when changes are constant or different users need different content - then I retrieve instead."
    },
    {
      "id": "ar-13",
      "q": "When would you use a knowledge graph instead of a vector store?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "knowledge-graph",
        "graphrag",
        "trade-off",
        "architecture"
      ],
      "why": "Appears in JDs and gets asked as a choice question. The trap is enthusiasm - most candidates should argue against it.",
      "simple": "Vector search and a knowledge graph answer different kinds of questions. Vector search is good at similarity: find text about this topic. A graph is good at explicit relationships: which supplier depends on this component, who ultimately owns this company, or how two entities are connected across several hops.\n\nI consider a graph when the relationship itself is the answer and the business needs reliable multi-hop traversal. Common examples are ownership networks, fraud rings, supply-chain impact and other domains with well-defined entities and relationships.\n\nThe cost is significant. You need a graph schema, entity extraction, entity resolution so duplicate names become one entity, update logic, and ongoing data-quality work. That is why I do not choose a graph just because it sounds richer.\n\nMy default is vector or keyword retrieval with strong metadata. I add a graph after I can show a real question that depends on relationships and is awkward or unreliable with ordinary retrieval. Hybrid systems are common: the graph finds connected entities and vector search retrieves the supporting text.",
      "points": [
        "Vector search answers similarity. A graph answers connection.",
        "The giveaway is multi-hop traversal - the answer lives between chunks, not inside one.",
        "Real fits: ownership chains, supply-chain impact, fraud rings, interaction networks.",
        "The cost is entity extraction and entity resolution, which are genuinely hard and ongoing.",
        "It is a data engineering programme, not a feature you add in a sprint.",
        "Default to vectors plus metadata filtering; escalate on a demonstrated failure.",
        "Hybrid is common: graph for traversal, vectors for the text on each node."
      ],
      "say": "Vector search answers similarity questions; a graph answers connection questions. The giveaway is multi-hop traversal - which suppliers are two hops from a sanctioned entity - because that answer lives between chunks and no chunking recovers it. But the cost is entity extraction and entity resolution, which is a data engineering programme rather than a feature. So I default to vectors with metadata filtering and escalate only on a demonstrated multi-hop failure.",
      "numbers": "Entity resolution is the hidden cost. Deciding that ACME Ltd, Acme Limited and ACME LTD. are one node is never fully solved and needs ongoing stewardship.",
      "wrong": "'Graphs give richer context so they are better.' It skips the build and maintenance cost entirely, and the follow-up about entity resolution exposes that gap.",
      "follow": "You have the graph. How do you actually feed a traversal result to the model?"
    },
    {
      "id": "ar-08",
      "q": "How do you build RAG over structured and unstructured data together?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "text-to-sql",
        "routing",
        "architecture"
      ],
      "why": "A real system-design problem, common in enterprise, and it tests routing thinking.",
      "simple": "The mistake is trying to make one mechanism handle both. \"How many claims were denied last month\" is a database question - the answer is a number, computed by aggregation. \"Why are claims denied\" is a document question. Retrieval cannot count, and SQL cannot explain policy.\n\nSo you route. A classifier or a cheap model decides which kind of question it is, then sends it to text-to-SQL, to document retrieval, or to both when the answer needs a number and an explanation.\n\nThe parts that need care. Text-to-SQL needs the schema in context, a read-only connection, a query allowlist or validator, and a row limit, because a generated query can otherwise be expensive or unsafe. Routing needs a fallback when it is unsure - running both and letting generation use what fits is often better than guessing wrong. And when combining, the answer must state which number came from the database, because that number is exact and the prose is not.\n\nSay the routing decision out loud. That is what is being marked.",
      "points": [
        "Aggregations and counts → SQL. Explanations and policy → retrieval.",
        "Route with a cheap classifier; run both when uncertain.",
        "Text-to-SQL: read-only connection, schema in context, validator, row limit.",
        "Never let generated SQL run unbounded or with write permissions.",
        "In a combined answer, mark which figures came from the database.",
        "Evaluate the router separately - routing errors look like quality failures."
      ],
      "say": "I route rather than forcing one mechanism to do both. Counts and aggregations go to text-to-SQL; explanations go to document retrieval; some questions need both. Text-to-SQL runs on a read-only connection with the schema in context, a validator and a row limit. When the router is unsure I run both and let generation use what fits. And I evaluate the router separately, because routing errors look like quality failures.",
      "numbers": "Always cap generated SQL with a row limit and a statement timeout. An unbounded generated join is a production incident waiting to happen.",
      "wrong": "\"I'd put the database rows into the vector store.\" Then a count becomes a retrieval, and retrieval cannot count. It gives approximately-right numbers, which is worse than none.",
      "follow": "The router sent an aggregation question to retrieval. How would you know?"
    },
    {
      "id": "ar-10",
      "q": "How do you cache in a RAG pipeline without serving stale or leaked answers?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "advanced-rag",
        "caching",
        "cost",
        "security"
      ],
      "why": "Caching is the biggest cost lever and the easiest place to cause a data breach.",
      "simple": "There are three layers you can cache, and each has a different trap.\n\nEmbedding cache: the same query text embedded repeatedly. Safe and easy - key on the text plus the embedding model version, because the version is what makes it wrong after a migration.\n\nRetrieval cache: the chunks returned for a query. Here the trap is permissions. If the key is only the query text, a user with wide access populates the cache and a user with narrow access gets their results. The key must include the entitlement set, or you have built a leak.\n\nAnswer cache: the full generated response. Same permission trap, plus staleness - when the underlying document changes, the cached answer is now wrong and nothing invalidates it. So cache keys need a corpus version, and ingestion must bump it.\n\nAnd provider prompt caching sits alongside all of this, cutting cost on the stable prefix without these risks: it only reuses the provider's processing of an identical prefix, and every answer is still generated fresh from the full prompt, so it cannot hand one user's answer to another.\n\n(The general caching layers, and how to order a prompt for prompt caching, are in the Cost and Latency topic; this card is about the RAG-specific traps.)",
      "points": [
        "Embedding cache: key on text + embedding model version.",
        "Retrieval and answer caches: the key must include the user's entitlement set.",
        "Answer cache needs a corpus version in the key, bumped by ingestion.",
        "A cache keyed only on question text is a data-leak mechanism.",
        "Semantic caching - matching near-identical questions - is powerful and riskier. Set a high threshold.",
        "Provider prompt caching reuses an identical prefix and still generates each answer fresh - none of these risks."
      ],
      "say": "Three layers, three traps. Embedding cache is safe if I key on text plus embedding model version. Retrieval and answer caches must include the user's entitlement set in the key, or a broadly-permissioned user populates the cache and a restricted user reads it. Answer caches also need a corpus version bumped by ingestion, or a withdrawn document keeps answering. Provider prompt caching carries none of these risks, because every answer is still generated fresh.",
      "numbers": "For semantic caching, set the similarity threshold high - a loose threshold serves the answer to a different question, and users notice that faster than any cost saving pays for.",
      "wrong": "\"We cache responses by question text.\" That is the leak. It is also the most common caching implementation, which is exactly why it gets asked.",
      "follow": "A document was withdrawn. Which of your caches still answers from it?"
    },
    {
      "id": "ar-22",
      "q": "What are ColPali-style visual retrievers, and when would you use them instead of parsing PDFs?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "advanced-rag",
        "multimodal",
        "ingestion"
      ],
      "why": "Whether you know the newer option for visually rich documents, and its trade-offs.",
      "simple": "The normal way to handle a PDF is a long pipeline: extract text, run OCR on scans, detect tables, describe charts with a vision model, then chunk and embed the text. Every step can break - a table comes out as jumbled text, a chart is lost, the layout disappears.\n\nColPali takes a shortcut: **treat each page as an image and embed the image directly.** A vision-language model looks at a screenshot of the page and produces one vector for each small patch of the page - similar to how ColBERT keeps one vector per token. At query time, each word of the question is matched against its best patches (the same late-interaction MaxSim idea). The best-matching pages are retrieved, and a vision-capable LLM reads those page images to answer.\n\nAnalogy: instead of typing out the whole textbook before searching it, you take photos of the pages and search the photos.\n\n**Good for:** slide decks, brochures, reports full of charts, forms and complex tables - anywhere the layout carries meaning.\n\n**Trade-offs:**\n- Many vectors per page, so a big index.\n- The generator must be a vision model, which costs more per answer.\n- Exact keyword search (product codes, IDs) is weaker than text + BM25.\n- Citing an exact sentence is harder than with text chunks.\n\nIn practice many teams go hybrid: normal text parsing for text-heavy documents, visual retrieval for pages that are mostly charts and tables. (VisRAG is a similar approach. ColQwen-style successors, and multimodal embedding models that embed a whole page image - Cohere Embed v4, Voyage multimodal, Jina v4 - apply the same page-as-image idea, some with much smaller indexes.)",
      "points": [
        "Embed page images directly with a vision-language model - skip OCR, layout and table parsing.",
        "Many vectors per page (one per patch), matched with late-interaction MaxSim, like ColBERT.",
        "Best for charts, slides, forms and complex tables; a vision LLM reads the retrieved pages.",
        "Costs: large index, vision-model generation, weaker exact keyword match. Usually used alongside text RAG."
      ],
      "say": "ColPali skips the parsing pipeline: it embeds each PDF page as an image, with one vector per page patch, and matches query tokens to patches using late interaction, like ColBERT. It works well for slides, charts and complex tables, where text extraction loses the layout. The costs are a larger index, a vision model for generation and weaker exact keyword matching, so I would use it alongside text retrieval for the visually heavy pages.",
      "numbers": "ColPali produces roughly 1,000 patch vectors per page (128 dimensions each), so the index grows fast; pooling and compression are commonly used to shrink it.",
      "wrong": "\"Visual retrieval replaces text RAG.\" For text-heavy documents, text chunks plus BM25 are cheaper, more precise and easier to cite.",
      "follow": "How would you decide which pages go through visual retrieval?",
      "followAnswer": "At ingestion I classify each page by how much of it is text versus images, tables and charts - a simple ratio from the parser, or a small vision classifier. Text-heavy pages go through normal text chunking; visually heavy pages also get a visual embedding. Then I check on the eval set that questions about charts and tables actually improve."
    },
    {
      "id": "ar-12",
      "q": "Your database has 200 tables. The schema does not fit in the prompt. Now what?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "advanced-rag",
        "text-to-sql",
        "scale",
        "architecture"
      ],
      "why": "Every text-to-SQL demo uses five tables. Every real warehouse has hundreds. This is where the demo-to-production gap actually shows.",
      "simple": "The demo version of text-to-SQL pastes the whole schema into the prompt. At 200 tables that is tens of thousands of tokens on every query, it costs real money per question, and accuracy drops rather than rises, because the model is now choosing between 200 tables when the answer involves three.\n\nSo you retrieve the schema. Treat each table as a document - name, columns, types, a one-line description of what it holds, and a few representative values. Embed those. When a question arrives, retrieve the ten or twenty most relevant tables and put only those in the prompt. It is RAG, applied to schema instead of prose.\n\nTwo things make this work far better than it sounds. First, descriptions matter more than names, because real warehouse tables are called things like DIM_CUST_MSTR_V2 and no embedding will match that to 'customer'. Writing those descriptions is the actual work, and it is usually a data-steward job rather than an engineering one. Second, join paths: retrieving three unrelated tables is useless if the model does not know how they join, so store the foreign-key graph and pull in the bridging tables automatically.\n\nThen narrow the surface. Most questions hit a small fraction of the warehouse, so curate a view layer - a few dozen well-named, documented views that the model is allowed to query - and point text-to-SQL at that instead of the raw schema. It improves accuracy and doubles as an access-control boundary.\n\nAnd keep everything from ar-08: read-only connection, validator, row limit, statement timeout.",
      "points": [
        "Do not paste 200 tables. Cost rises and accuracy falls - the model is choosing between too many.",
        "Retrieve the schema: embed each table as a document, pull the top ten or twenty per question.",
        "Column descriptions beat column names. DIM_CUST_MSTR_V2 matches nothing without one.",
        "Store the foreign-key graph and auto-include bridging tables, or the joins will be invented.",
        "Best answer for a stable workload: a curated view layer, not the raw warehouse.",
        "A view layer is also an access-control boundary - the model cannot query what it cannot see.",
        "Keep the ar-08 safety rails: read-only, validated, row-limited, timed out."
      ],
      "say": "I stop pasting the schema and start retrieving it. Each table becomes a document - name, columns, a written description and sample values - and I pull only the ten or twenty relevant ones per question. Descriptions matter more than names, because real tables are called DIM_CUST_MSTR_V2. I store the foreign-key graph so bridging tables come along, and for a stable workload I point the model at a curated view layer instead of the raw warehouse.",
      "numbers": "200 tables of DDL is easily 30k–50k tokens per query. Schema retrieval typically cuts that to a couple of thousand and raises accuracy at the same time.",
      "wrong": "\"I would use a model with a bigger context window.\" It costs more per query, and it does not fix the real problem, which is that the model picks the wrong table when offered 200 of them.",
      "follow": "Two tables both look like the right one and the model keeps picking the deprecated one. What do you change?"
    },
    {
      "id": "ar-11",
      "q": "You are handed a 2 GB CSV. How do you let an LLM answer questions about it?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "advanced-rag",
        "tabular",
        "csv",
        "text-to-sql",
        "architecture"
      ],
      "why": "Enterprise data is mostly tables, and both reflex answers - paste it, or embed every row - fail. The follow-up on exact totals shows whether you separate lookup from computation.",
      "simple": "I do not put a multi-gigabyte CSV into the model context, and I do not embed every row if the questions are about totals, counts, filters or comparisons. Vector retrieval returns similar rows; it cannot guarantee an exact aggregation over all matching rows.\n\nInstead, I load the data into a system that can query it accurately, such as DuckDB, a warehouse or a database. The model gets the schema, column descriptions and a small number of safe examples, then produces SQL. My application validates the query, executes it with read-only permissions and sensible limits, and sends only the small result back to the model for explanation.\n\nIf the rows are mostly free text, such as support tickets, then vector retrieval may be appropriate for that text field. The key question is whether the user is asking for semantic lookup or exact computation.\n\nIf I allow generated Python instead of SQL, it runs in a real sandbox with no unnecessary filesystem, network or credential access.",
      "points": [
        "A 2 GB CSV is hundreds of millions to around a billion tokens - digits and delimiters tokenise poorly. Beyond size, it is the wrong tool: a model does not compute exact totals over raw rows.",
        "Do not embed rows for aggregation questions - retrieval cannot count, and an approximate sum is worse than none.",
        "Load into DuckDB or SQLite; put schema and sample values in the prompt, never the data.",
        "The model writes the query, you execute it, only the result set goes back.",
        "Pandas dataframe agents generate code - sandbox it: no filesystem, no network.",
        "Embed rows only when they are descriptive text: serialise each row to a sentence.",
        "The deciding question: is this a lookup or an aggregation?"
      ],
      "say": "I would not feed a multi-gigabyte CSV to the model, and I would not use vector retrieval for exact totals or counts. I load it into DuckDB or a warehouse, give the model the schema, let it propose SQL, validate and run that query read-only, and return only the small result for explanation. If the rows are mainly free text, vector search can still be used for that field. Generated Python needs a real sandbox.",
      "numbers": "Do not estimate feasibility from file size alone. Sample the actual file and tokenizer if token count matters; for tabular analytics, the architecture should avoid sending the raw dataset to the model either way.",
      "wrong": "'I would chunk the CSV and put it in a vector store.' It demos well on ten rows and produces silently wrong totals on ten million. The panel is listening for whether you separate lookup from aggregation.",
      "follow": "The user asks something needing both a number from the table and an explanation from a policy PDF. What happens?"
    }
  ]
};
