/* Topic 05 — RAG. Build, evaluate, debug.
   Grounding: public JDs for GenAI / AI Engineer roles at India centres, plus
   what running retrieval in production forces you to know. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["05-rag"] = {
  lede: "RAG is the single most-asked subject in Indian GenAI interviews, because it is what most teams are actually building. The panel is rarely checking whether you know the definition. They are checking whether you have watched retrieval fail quietly and fixed it.",
  grounding: "public JDs + what production retrieval forces you to know",
  evening: ["rag-02", "rag-05", "rag-07", "rag-09", "rag-12"],

  cards: [
    {
      id: "rag-01",
      q: "What is RAG, in one minute?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["rag", "basics"],
      why: "Whether you can explain your own system to a recruiter who is not technical.",
      simple:
        "A language model only knows what it saw during training. It does not know your company's policy document that was updated last week.\n\n" +
        "RAG fixes this by doing a search first. When the user asks a question, we search our own documents, pick the few most relevant pieces, paste them into the prompt, and then ask the model to answer using only those pieces.\n\n" +
        "Think of an open-book exam. The model is the student. Retrieval is the moment the student flips to the right page before writing the answer. The student is still doing the writing — we are only making sure the right page is open.",
      points: [
        "**Retrieve** — search your documents for the question.",
        "**Augment** — put the top pieces into the prompt as context.",
        "**Generate** — the model answers from that context, and cites it."
      ],
      say: "RAG means we search our own data before the model answers. The user asks a question, we retrieve the few most relevant document chunks, put them in the prompt, and the model answers from that text and cites it. It gives us fresh, private and traceable answers without retraining the model. In our system that was around four chunks per query.",
      numbers: "Typical production setup: retrieve 20 candidates, rerank to 4–6 chunks, 300–800 tokens per chunk.",
      wrong: "\"RAG stops hallucination.\" It does not. It reduces one cause of hallucination. The model can still ignore the context, or the retrieval can hand it the wrong page confidently.",
      follow: "Then why not just put the whole document in the context window?"
    },

    {
      id: "rag-02",
      q: "Long context windows are huge now. Why not skip RAG and paste everything?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "long-context", "trade-off", "cost"],
      why: "Whether you choose architecture from constraints or from headlines.",
      simple:
        "Because context is not free, and it is not reliable at scale.\n\n" +
        "Three problems. First, cost — you pay for every token, on every single request. Ten thousand queries a day against a 200,000-token context is a bill nobody approves. Second, latency — more input means slower first token. Third, quality — models get less accurate at finding one fact buried in the middle of a very long input. This is often called the lost-in-the-middle problem.\n\n" +
        "And a fourth, which is the one senior candidates remember: permissions. If your corpus has documents that only some users may see, you have to filter at retrieval time. You cannot paste the whole corpus and hope the model respects access control.\n\n" +
        "Long context is genuinely better for a small, bounded set of documents where you need reasoning across all of them at once. Contract comparison, for example. Choose per use case, not per fashion.",
      say: "Long context works well for a few bounded documents where cross-document reasoning matters. It breaks down on cost, latency and access control. We pay for every token on every request, accuracy drops when the fact is buried mid-context, and we cannot enforce per-user permissions if we paste the whole corpus. So we retrieve, filter by entitlement, and use long context only for the final synthesis step.",
      numbers: "A 100k-token context at roughly $3 per million input tokens is $0.30 per query. At 10,000 queries a day that is about $3,000 a day, versus a few dollars for retrieval-based prompts.",
      wrong: "\"Long context has made RAG obsolete.\" Say this and the panel will ask about your cost per query, and the conversation ends there.",
      follow: "How do you enforce per-user document permissions inside retrieval?"
    },

    {
      id: "rag-03",
      q: "How do you choose a chunking strategy?",
      round: ["tech1"],
      level: "2-5",
      tags: ["rag", "chunking", "ingestion"],
      why: "Whether you have ingested real messy documents or only clean text files.",
      simple:
        "Chunking is cutting documents into pieces small enough to retrieve. The mistake is to think of it as a character-count problem. It is a meaning problem.\n\n" +
        "The right question is: what is the smallest piece of text that can answer a question on its own? For a policy document, that is usually a clause or a section under one heading. For an FAQ, one question-answer pair. For a table, often the whole table, because half a table means nothing.\n\n" +
        "So the rule is to cut along the structure the document already has — headings, sections, list items — and only fall back to fixed sizes when there is no structure. Add a small overlap, maybe 10 to 15 percent, so a sentence that spans a boundary is not lost. And attach metadata to every chunk: source, section title, date, and who is allowed to see it.",
      points: [
        "Cut on document structure first: headings, clauses, rows.",
        "Fixed-size splitting is the fallback, not the default.",
        "Overlap 10–15% so boundary sentences survive.",
        "Carry metadata: source, section, date, access group, version.",
        "Tables, code and scanned PDFs need their own handling — do not split them like prose."
      ],
      say: "I chunk on meaning, not character count. The unit is the smallest piece of text that can answer a question by itself, which usually means cutting on headings, clauses or table rows. Fixed-size splitting is my fallback when a document has no structure. I keep ten to fifteen percent overlap and attach source, section and access metadata to every chunk, then tune size against retrieval recall.",
      numbers: "Common starting point: 500–800 tokens per chunk, 10–15% overlap. Then tune with a labelled retrieval set — do not keep the default.",
      wrong: "\"I used RecursiveCharacterTextSplitter with 1000 and 200.\" That is a starting default, not a strategy. If you cannot say why 1000, you did not choose it.",
      follow: "How would you chunk a 90-page scanned PDF with tables?"
    },

    {
      id: "rag-04",
      q: "How do you handle tables, scanned PDFs and diagrams in ingestion?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "ingestion", "multimodal"],
      why: "Whether your RAG experience is with real enterprise documents or with clean markdown.",
      simple:
        "Most real enterprise corpora are PDFs, and most PDFs are hostile. Text order is wrong, tables become jumbled lines, and some pages are just images.\n\n" +
        "So ingestion becomes its own pipeline. For scanned pages you need OCR. For tables, you extract the table as a unit and store it as markdown or HTML, plus a short natural-language summary of what the table contains — because the summary is what matches a user's question, while the table itself is what the model needs to answer. For diagrams, use a vision model to write a caption and index the caption.\n\n" +
        "The important part for the interview is this: I check ingestion quality before I blame retrieval. If OCR turned a number into a letter, no amount of reranking will save the answer.",
      points: [
        "OCR for scanned pages; keep a confidence score and flag low-confidence pages.",
        "Tables: store the table intact **and** index a text summary of it.",
        "Diagrams: caption with a vision model, index the caption, link back to the image.",
        "Keep the page number and bounding box so citations can point at the exact place."
      ],
      say: "Enterprise PDFs need their own pipeline. I OCR scanned pages, extract tables as whole units and index a short summary alongside the raw table, and caption diagrams with a vision model. Every chunk keeps its page number so a citation can point to the exact place. I validate ingestion quality first, because if OCR corrupted a figure, no retrieval tuning will recover the correct answer.",
      numbers: "On a real scanned corpus, expect 5–15% of pages to need OCR review. Track that number — it becomes your data-quality SLA.",
      wrong: "\"PyPDF handles it.\" It handles text-layer PDFs. Say this about a scanned insurance corpus and the interviewer knows you have not shipped one.",
      follow: "How do you keep the pipeline from re-processing the whole corpus on every update?"
    },

    {
      id: "rag-05",
      q: "Your RAG app gives wrong answers. Walk me through debugging it.",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "debugging", "evaluation"],
      why: "The core senior question. Whether you debug systematically or change the prompt and hope.",
      simple:
        "The first move is to split the problem in two. Either the right text never reached the model, or the right text reached it and the model still got it wrong. These have completely different fixes, and mixing them up wastes weeks.\n\n" +
        "So I look at the trace for a failing query and read the retrieved chunks myself. If the correct chunk is not in there, it is a retrieval problem — look at ingestion, chunking, the query, filters and the embedding model. If the correct chunk is right there and the answer is still wrong, it is a generation problem — look at the prompt, the context ordering, and whether the model is being asked to do too much at once.\n\n" +
        "Only after that do I touch anything. And I fix one layer at a time, measured against a labelled set, not against the feeling that the last answer looked better.",
      points: [
        "**Step 1** — collect 30–50 real failing queries. Not synthetic ones.",
        "**Step 2** — for each, check: was the correct chunk retrieved at all?",
        "**Step 3** — retrieval failures: check ingestion quality, chunk boundaries, metadata filters, query phrasing, embedding model, and whether a keyword term needed lexical search.",
        "**Step 4** — generation failures: check prompt instructions, position of context, conflicting chunks, and whether the model was told it may say \"not in the documents\".",
        "**Step 5** — fix one thing, re-run the labelled set, keep the change only if recall@k or answer accuracy moved."
      ],
      say: "First I separate retrieval failure from generation failure, because they have different fixes. I take fifty real failing queries and check whether the correct chunk was retrieved at all. If it was not, I look at ingestion, chunking, filters and the embedding model. If it was retrieved and the answer is still wrong, it is a prompt or context-ordering problem. Then I fix one layer at a time and measure against a labelled set.",
      numbers: "Build a labelled set of 50–100 query-to-correct-chunk pairs. Track recall@10 and answer accuracy separately — they move independently.",
      wrong: "\"I would improve the prompt.\" This is the most common failing answer in the whole topic. It assumes the model saw the right text, which in most real failures it did not.",
      follow: "Recall is good but answers are still wrong. Now what?"
    },

    {
      id: "rag-06",
      q: "Retrieval recall is good, but answers are still wrong. What now?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "generation", "prompting", "debugging"],
      why: "Whether you can debug the second half of the pipeline, which most candidates never reach.",
      simple:
        "This is the more interesting failure. The right text is in the prompt and the model still answers badly. There are four usual causes.\n\n" +
        "One, conflicting chunks. Two versions of the same policy are both retrieved and the model picks the old one. Fix with recency metadata and explicit instructions about which wins.\n\n" +
        "Two, position. Facts buried in the middle of a long context get missed. Put the highest-ranked chunk first, and keep the total context tight.\n\n" +
        "Three, the model was never given permission to refuse. If the prompt does not say \"if the answer is not in the context, say you do not know\", the model will invent something, because that is what it was trained to do.\n\n" +
        "Four, the question needs multiple hops, and no single chunk contains the answer. That is a retrieval architecture problem, not a prompt problem.",
      points: [
        "Conflicting versions → add dates, instruct which version wins, deduplicate.",
        "Lost in the middle → rerank and put best chunk first, cut context size.",
        "No refusal path → explicitly allow \"not in the provided documents\".",
        "Multi-hop question → query decomposition or an agentic retrieval loop."
      ],
      say: "Usually one of four things. Conflicting document versions and the model picked the stale one. Position — the fact was buried mid-context and got missed. No refusal instruction, so the model invented rather than saying it did not know. Or the question needs facts from two documents and no single chunk has the answer, which is a retrieval design problem. I check them in that order.",
      numbers: "Adding an explicit refusal instruction typically cuts confident-wrong answers noticeably. Measure it — track your unsupported-answer rate before and after.",
      wrong: "\"I'd switch to a bigger model.\" Sometimes true, usually expensive, and it hides the real defect. Diagnose before you upgrade.",
      follow: "How do you detect that an answer was not supported by the retrieved context?"
    },

    {
      id: "rag-07",
      q: "How do you evaluate a RAG system?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "evaluation", "metrics"],
      why: "Whether you can prove an improvement, or only claim one.",
      simple:
        "Evaluate the two halves separately, then the whole thing end to end.\n\n" +
        "For retrieval, you need a set of questions where you already know which chunk holds the answer. Then measure recall@k — how often the correct chunk appears in the top k — and MRR, which rewards it being near the top. This part is cheap, fast and objective, and you can run it on every commit.\n\n" +
        "For generation, the standard four are: faithfulness, meaning is the answer actually supported by the retrieved context; answer relevance, does it address the question; context precision, is the retrieved context mostly useful rather than noise; and context recall, did we get everything needed. Frameworks like RAGAS compute these using an LLM as judge.\n\n" +
        "Then online: thumbs up and down, whether users rephrase, whether they click the citation, escalation rate to a human. Offline tells you if you broke something. Online tells you if it matters.",
      points: [
        "Retrieval: recall@k, MRR, hit rate. Objective, cheap, run in CI.",
        "Generation: faithfulness, answer relevance, context precision, context recall.",
        "End to end: task success on a golden set reviewed by a domain expert.",
        "Online: thumbs, rephrase rate, citation clicks, escalation to human.",
        "Every change is measured against the same frozen set, or the comparison means nothing."
      ],
      say: "I evaluate retrieval and generation separately. Retrieval gets a labelled set and recall at k plus MRR, which runs on every commit. Generation gets faithfulness, answer relevance and context precision, computed with an LLM judge that I calibrate against human labels. Then online signals — thumbs, rephrase rate, escalation. Offline tells me if I broke something, online tells me whether it mattered to users.",
      numbers: "A useful bar: recall@10 above 0.90 before you touch the prompt. And 100+ items in the golden set, or the numbers are noise.",
      wrong: "\"We tested it manually and it looked good.\" Fine for a demo. Says you have never had to defend a regression.",
      follow: "Your LLM judge scores 0.9 faithfulness. Do you trust it?"
    },

    {
      id: "rag-08",
      q: "How do you make answers traceable and citable?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["rag", "citations", "trust", "compliance"],
      why: "Regulated employers will not ship a system whose answers cannot be traced.",
      simple:
        "Citations are not a nice-to-have in banking or healthcare. They are the reason the system is allowed to exist.\n\n" +
        "The mechanism is simple. Every chunk keeps an identifier, source file, page and section from ingestion onward. When we build the prompt, we label each chunk with that identifier. We ask the model to answer and to mark which identifier supports each claim. The application then resolves those identifiers back into real links that open the source at the right page.\n\n" +
        "And then the part people forget: verify. Check that every citation the model produced actually exists in what we retrieved. Models do invent identifiers. If a claim has no valid citation, either drop that sentence or flag the answer for review.",
      code:
        "Context:\n" +
        "[doc-14 | policy_2026.pdf p.7 | Claims > Eligibility]\n" +
        "Members are eligible after 90 continuous days of coverage...\n\n" +
        "Instruction:\n" +
        "Answer only from the context above. After each claim, cite the\n" +
        "identifier in square brackets, e.g. [doc-14]. If the context does\n" +
        "not contain the answer, reply exactly: NOT_IN_CONTEXT.",
      say: "Every chunk carries an id, source and page from ingestion onward. I label chunks in the prompt with those ids and require the model to cite the id supporting each claim. The application resolves ids into links that open the source at the right page. Then I validate that every returned citation actually exists in the retrieved set, because models do invent them. Uncited claims get flagged.",
      numbers: "Citation validity should be checked on 100% of responses, not sampled. It is a cheap string check, not a model call.",
      wrong: "\"The model returns the sources in its answer.\" Only if you validate them. Unvalidated citations are a compliance incident waiting to happen.",
      follow: "What do you do when the model cites a document that says the opposite?"
    },

    {
      id: "rag-09",
      q: "How do you handle document permissions in RAG?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["rag", "security", "access-control", "compliance"],
      why: "The question that separates demo builders from people who shipped inside an enterprise.",
      simple:
        "If a junior employee asks a question and the system quotes a document only the finance director can see, you have caused a data breach. The model will happily do this, because it has no idea who is asking.\n\n" +
        "So access control has to happen at retrieval, before anything reaches the model. Each chunk carries the access groups from its source document, copied at ingestion time. Each query carries the user's identity and groups. The vector search applies that as a hard metadata filter — a pre-filter, so restricted chunks are never candidates, rather than a post-filter that retrieves everything and drops some afterwards.\n\n" +
        "Two things to add. Permissions change, so you need a re-sync path when a document's access changes, not just when its text changes. And never cache an answer across users — a cache keyed only on question text will leak one user's context to another.",
      points: [
        "Copy access groups onto every chunk at ingestion.",
        "Pre-filter in the vector query. Never post-filter.",
        "Re-sync chunks when source permissions change, not only when text changes.",
        "Cache keys must include the user's entitlement set, or not cache at all.",
        "Log which chunks were shown to which user — you will be audited on this."
      ],
      say: "Access control happens at retrieval, never in the prompt. Every chunk inherits its source document's access groups at ingestion, and the query carries the user's groups as a hard pre-filter, so restricted chunks are never candidates. I re-sync when permissions change, not just when text changes. And I never cache across users, because a cache keyed only on question text leaks context between them.",
      numbers: "No number applies. This is a binary control — it either holds on every request or it is broken.",
      wrong: "\"I tell the model in the system prompt not to reveal restricted documents.\" That is not access control. That is asking politely, and prompt injection defeats it.",
      follow: "How do you audit which user saw which document chunk?"
    },

    {
      id: "rag-10",
      q: "How do you keep the index fresh when documents change every day?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "ingestion", "pipeline", "operations"],
      why: "Whether you have operated a RAG system, not just built one.",
      simple:
        "You do not re-embed the whole corpus every night. That is slow and expensive and it will eventually be the reason your bill gets a meeting.\n\n" +
        "Instead you make ingestion incremental. Every source document gets a content hash. On each run you compare hashes, and only changed documents get re-chunked and re-embedded. Deleted documents get their chunks removed — this is the step people skip, and it is why stale answers keep appearing after a policy is withdrawn.\n\n" +
        "The other half is versioning. Chunks, embeddings and the embedding model version travel together. If you change embedding models, you cannot mix old and new vectors in one index — the geometry is different. You build a new index alongside and switch over once it is validated.",
      points: [
        "Content hash per document; re-embed only what changed.",
        "Handle deletes explicitly, or stale chunks answer forever.",
        "Version chunks, embeddings and the model together.",
        "Changing embedding model means a full rebuild into a new index, then a cutover.",
        "Track ingestion lag as a metric: how old is the freshest missing document."
      ],
      say: "Ingestion is incremental. Every source document has a content hash, and only changed documents get re-chunked and re-embedded. Deletes are handled explicitly, because stale chunks keep answering long after a policy is withdrawn. Chunks and embeddings carry the embedding model version, so switching models means building a parallel index and cutting over after validation, never mixing vectors from two models.",
      numbers: "Track ingestion lag — target is usually under 24 hours for policy corpora, under an hour for support tickets. Pick the number from the business, not the tooling.",
      wrong: "\"We re-index nightly.\" Works at a thousand documents. Ask the candidate what happens at two million and the answer usually stops.",
      follow: "You need to switch embedding models. Walk me through the migration."
    },

    {
      id: "rag-11",
      q: "What is hybrid search and when do you need it?",
      round: ["tech1"],
      level: "2-5",
      tags: ["rag", "hybrid-search", "bm25", "retrieval"],
      why: "Whether you understand what vector search is bad at.",
      simple:
        "Vector search understands meaning. Ask about \"leave policy\" and it will find a chunk that says \"time-off entitlement\", even though no word matches. That is its strength.\n\n" +
        "Its weakness is exact strings. Product code XR-4471B, an employee ID, an error code, a rare drug name — embeddings blur these, because the model never learned that this specific code matters. Keyword search, usually BM25, nails them.\n\n" +
        "Hybrid search runs both and merges the results. The usual merge is reciprocal rank fusion, which combines by rank position rather than by score, so you avoid the mess of comparing two different score scales. In enterprise corpora full of acronyms, part numbers and internal jargon, hybrid is not an optimisation. It is usually the difference between working and not working.",
      code:
        "# Reciprocal rank fusion: merge by position, not by score\n" +
        "def rrf(rankings, k=60):\n" +
        "    scores = {}\n" +
        "    for ranking in rankings:            # e.g. [bm25_hits, vector_hits]\n" +
        "        for pos, doc_id in enumerate(ranking):\n" +
        "            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + pos + 1)\n" +
        "    return sorted(scores, key=scores.get, reverse=True)",
      say: "Vector search matches meaning but blurs exact strings like part numbers and error codes. Keyword search with BM25 handles those precisely but misses paraphrases. Hybrid runs both and fuses them, usually with reciprocal rank fusion, which merges by rank position so I never have to reconcile two score scales. On enterprise corpora full of acronyms and identifiers, hybrid is normally the bigger win than any model upgrade.",
      numbers: "RRF with k=60 is the standard starting constant. On identifier-heavy corpora, hybrid commonly lifts recall@10 more than switching to a larger embedding model.",
      wrong: "\"Keyword search is old, embeddings replaced it.\" Then explain how you find part number XR-4471B. The conversation usually ends there.",
      follow: "How do you weight the lexical and dense results against each other?"
    },

    {
      id: "rag-12",
      q: "What is reranking and is it worth the latency?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "reranking", "latency", "trade-off"],
      why: "Whether you can justify a component with numbers instead of enthusiasm.",
      simple:
        "The first-stage retriever is fast but rough. It compares your question to each chunk separately, using vectors that were computed before your question existed. It is good enough to narrow two million chunks down to fifty.\n\n" +
        "A reranker is a different kind of model, a cross-encoder. It reads the question and one chunk together, at the same time, and scores how well that chunk answers that question. Much more accurate, and far too slow to run on the whole corpus.\n\n" +
        "So the pattern is two stages. Retrieve fifty cheaply, rerank those fifty carefully, keep the top five. You buy accuracy with latency.\n\n" +
        "Whether it is worth it is an empirical question, and that is the answer the panel wants. Measure recall and answer accuracy with and without it, measure the added p95 latency, and decide against your latency budget.",
      say: "Retrieval is fast but approximate — it compares the question and chunks as separate vectors. A reranker is a cross-encoder that reads the question and each chunk together, so it scores relevance much more accurately, but it is too slow to run on the full corpus. So I retrieve fifty, rerank to five, and decide with numbers: what accuracy it buys against what it adds to p95 latency.",
      numbers: "A hosted reranker on 50 candidates typically adds 100–300 ms. If your p95 budget is 3 seconds, that is affordable. If it is 800 ms, it is not.",
      wrong: "\"I always add a reranker, it improves quality.\" A senior answer names the latency cost and the budget it fits inside.",
      follow: "Your p95 budget is 800 ms end to end. What do you cut?"
    },

    {
      id: "rag-13",
      q: "How would you design RAG over 50 million documents?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "scale", "architecture", "system-design"],
      why: "Whether you start from requirements or from a list of product names.",
      simple:
        "Before any technology, I ask for the numbers. How many queries per second at peak. What latency is acceptable. How often documents change. How many users and how many permission groups. What the budget per query is. Those five answers determine the design, and giving them back to the interviewer is half of what they are marking.\n\n" +
        "At fifty million documents the shape is usually: distributed vector store with sharding, an approximate index like HNSW or IVF-PQ where memory matters, hard metadata pre-filters to shrink the search space before vector comparison, a two-stage retrieve-then-rerank, aggressive caching of both embeddings and frequent answers, and an ingestion pipeline that is a separate service with its own queue and its own scaling.\n\n" +
        "And the operational half: monitoring on recall, latency and cost per query, plus a rollback path when a bad ingestion run poisons the index.",
      points: [
        "Requirements first: QPS, latency budget, freshness, permissions, cost per query.",
        "Shard the index; use HNSW for speed, IVF-PQ when memory is the constraint.",
        "Pre-filter on metadata — tenant, date, access group — before vector search.",
        "Two-stage retrieval: cheap recall, then rerank.",
        "Ingestion is a separate scaled service with a queue and dead-letter handling.",
        "Cache embeddings for repeated queries and answers for repeated questions, keyed with entitlements.",
        "Have a rollback: index versions and a cutover, not in-place mutation."
      ],
      say: "First I ask for peak QPS, latency budget, freshness requirement, permission model and cost per query, because those decide the design. Then: a sharded vector index with approximate search, hard metadata pre-filters to shrink the candidate space, two-stage retrieve-and-rerank, and ingestion as a separately scaled service with a queue. Plus index versioning so a bad ingestion run can be rolled back instead of debugged live.",
      numbers: "50M documents at ~4 chunks each is 200M vectors. At 1024 dimensions in float32 that is roughly 800 GB raw — which is exactly why quantisation and sharding come up.",
      wrong: "Naming a vector database in the first sentence. The panel is testing whether you gather requirements. Products come after constraints.",
      follow: "Your index does not fit in memory. What changes?"
    },

    {
      id: "rag-14",
      q: "When would you not use RAG?",
      round: ["tech1", "manager"],
      level: "5-10",
      tags: ["rag", "trade-off", "judgement"],
      why: "Senior candidates are expected to argue against their own default.",
      simple:
        "RAG is for when the answer lives in text you own, and that text changes.\n\n" +
        "It is the wrong tool when the answer lives in a database — then you want text-to-SQL or a plain API call, because a query gives you an exact number and retrieval gives you a paragraph that mentions a number.\n\n" +
        "It is wrong when the problem is style or format rather than knowledge — that is fine-tuning or better prompting. It is wrong when the corpus is tiny and stable, say twenty pages that never change, because then you just put them in the prompt. And it is wrong when the task is classification or extraction on a document you already have in hand, because there is nothing to retrieve.\n\n" +
        "Saying this out loud is a strong signal. It shows you pick tools rather than apply one.",
      points: [
        "Answer is in a database → text-to-SQL or an API, not retrieval.",
        "Problem is tone, format or a specific skill → fine-tuning or prompting.",
        "Corpus is tiny and stable → just put it in the prompt.",
        "Document is already supplied by the user → extract, do not retrieve.",
        "Needs real-time state, like inventory → call the system of record."
      ],
      say: "RAG is for knowledge that lives in text I own and that changes. If the answer is in a database I use text-to-SQL or an API, because that gives an exact number instead of a paragraph. If the problem is tone or output format, that is fine-tuning or prompting. If the corpus is twenty stable pages I just put them in the prompt. And if the user already supplied the document, there is nothing to retrieve.",
      numbers: "No number applies here. This is a design-judgement answer.",
      wrong: "\"RAG works for everything.\" It marks you as someone who has built one thing.",
      follow: "How would you combine RAG with text-to-SQL in a single assistant?"
    },

    {
      id: "rag-15",
      q: "How do you detect hallucination in production, not in testing?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["rag", "hallucination", "monitoring", "guardrails"],
      why: "Whether you can watch a non-deterministic system in production.",
      simple:
        "In production you have no ground truth. Nobody is standing there with the correct answer. So you cannot measure correctness — you measure support.\n\n" +
        "The main check is groundedness: take each claim in the answer and check whether the retrieved context actually contains it. That can be done cheaply with a small model or an entailment check, on every response or on a sample. If a claim is not supported, that is a hallucination signal even without knowing the truth.\n\n" +
        "Around that, cheaper signals. Citation validity — does every cited id exist. Refusal rate — a sudden drop often means the model started inventing instead of declining. Retrieval score distribution — if the top score collapses, the model is answering from nothing. And user behaviour: rephrases, thumbs down, escalation to a human.\n\n" +
        "Then a sampled human review, weekly, weighted toward low-confidence responses. Automated checks tell you where to look. Humans tell you whether it is actually wrong.",
      points: [
        "Groundedness check per claim against retrieved context — the primary signal.",
        "Citation validity on 100% of responses; it is a cheap string check.",
        "Watch refusal rate. A sudden fall usually means invention, not improvement.",
        "Watch top retrieval score. Low scores plus a confident answer is the danger zone.",
        "Sampled human review, weighted toward low-confidence responses."
      ],
      say: "In production there is no ground truth, so I measure support rather than correctness. The main check is groundedness — is each claim actually present in the retrieved context — run with a small model on every response or a sample. Around it: citation validity, refusal rate, and retrieval score distribution, because a confident answer on low-scoring context is the danger case. Then weekly sampled human review.",
      numbers: "Sample 1–5% of production traffic for human review, weighted toward low-confidence responses. Full automated groundedness checks on 100% if the small-model cost allows.",
      wrong: "\"We have an eval suite, so we catch hallucinations.\" Eval suites cover the queries you thought of. Production is the ones you did not.",
      follow: "Your groundedness checker is itself an LLM. Who checks it?"
    },

    {
      id: "rag-16",
      q: "Tell me about a RAG system you built. What broke?",
      round: ["manager", "tech2"],
      level: "5-10",
      tags: ["rag", "story", "behavioural", "ownership"],
      why: "Ownership. Anyone can describe an architecture; few can describe a failure they personally fixed.",
      simple:
        "This question is not about RAG. It is about whether you owned something.\n\n" +
        "The shape that works: one sentence on the system and its users, then straight to a specific failure, what you measured, what you changed, and what the number did afterwards. Then what you would do differently.\n\n" +
        "The failure should be real and slightly unflattering. \"Retrieval looked fine on our test questions but real users asked in Hinglish and recall collapsed.\" \"We forgot deletes, so a withdrawn policy kept being quoted for three weeks.\" \"Our chunking split tables in half and every numeric answer was wrong.\" These are believable because they are what actually happens, and each has a clean fix you can describe.\n\n" +
        "Do not present a system with no problems. Nobody believes it, and it removes the only thing this question can reward.",
      points: [
        "One sentence of context. Users and scale, no more.",
        "One specific failure, with the signal that revealed it.",
        "What you measured before changing anything.",
        "The fix, and the number after.",
        "One thing you would do differently — it makes the whole story credible."
      ],
      say: "We ran a policy assistant for about four hundred internal users. Three weeks in, support flagged answers quoting a withdrawn policy. Our ingestion handled updates but never handled deletes, so removed documents kept answering. I added tombstone handling and a nightly reconciliation between source and index. Stale-answer reports went to zero. I would have built the delete path from day one.",
      numbers: "Use your real numbers — users, documents, latency, the metric before and after. Vague scale reads as a project you watched rather than built.",
      wrong: "\"It worked well, we did not face major issues.\" This answers a different question and wastes the round's best opportunity.",
      follow: "What would you build differently if you started that system today?"
    }
  ]
};
