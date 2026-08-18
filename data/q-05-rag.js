/* Topic 05 — RAG. Build, evaluate, debug.
   Grounding: public JDs for GenAI / AI Engineer roles at India centres, plus
   what running retrieval in production forces you to know. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["05-rag"] = {
  lede: "RAG is the single most-asked subject in Indian GenAI interviews, because it is what most teams are actually building. The panel is rarely checking whether you know the definition. They are checking whether you have watched retrieval fail quietly and fixed it.",
  grounding: "public JDs + what production retrieval forces you to know",
  evening: ["rag-05", "rag-17", "rag-22", "rag-27", "rag-40"],

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
,

    {
      id: "rag-17",
      q: "Walk me through every stage of a RAG pipeline and name the failure mode of each.",
      round: ["tech1", "tech2"],
      level: "2-5",
      tags: ["rag", "architecture", "debugging"],
      why: "The spine question. If you can name the stages and what breaks at each, every later debugging question has somewhere to land.",
      simple:
        "There are seven stages, and each one has a characteristic way of failing quietly.\n\n" +
        "Parse. Get text out of the source. Fails on scanned PDFs, tables flattened into gibberish, and multi-column layouts read in the wrong order. Nothing errors — you just get bad text.\n\n" +
        "Chunk. Split into retrievable units. Fails by cutting mid-sentence or separating a heading from the paragraph it governs.\n\n" +
        "Embed. Turn chunks into vectors. Fails by silent truncation when a chunk exceeds the model's sequence limit — you embed the first half and never know.\n\n" +
        "Index. Store for search. Fails on stale entries after updates, and on filters that quietly exclude what you needed.\n\n" +
        "Retrieve. Fetch candidates for a query. Fails when vocabulary differs from the corpus, or on exact identifiers that dense vectors handle badly.\n\n" +
        "Rerank. Reorder candidates. Fails by adding latency without measurable gain, or by being skipped when it was the fix.\n\n" +
        "Generate. Write the answer from context. Fails by ignoring provided context, or by answering from parametric memory when retrieval returned nothing.\n\n" +
        "The debugging discipline that follows: measure retrieval separately from generation. If the right chunk was never retrieved, no prompt engineering saves you. That single split resolves most RAG problems, because teams usually tune the prompt when retrieval was the fault.",
      points: [
        "Parse, chunk, embed, index, retrieve, rerank, generate.",
        "Almost every stage fails silently rather than raising.",
        "Parsing failures poison everything downstream and are hardest to spot.",
        "Silent truncation at embedding is the most-missed failure.",
        "Always measure retrieval separately from generation."
      ],
      say: "Seven stages: parse, chunk, embed, index, retrieve, rerank, generate. What matters is that nearly all of them fail silently — a scanned PDF parses to noise, an oversized chunk gets truncated at embedding, a filter quietly excludes the right document. So when debugging I split retrieval from generation first and check whether the correct chunk was even retrieved, because if it was not, no amount of prompt work will fix the answer.",
      numbers: "In practice most RAG quality problems are retrieval problems, not generation problems. Measure recall@k before touching the prompt.",
      wrong: "Describing it as retrieve-then-generate. It is technically true and useless for debugging, because it collapses five distinct failure modes into one box.",
      follow: "Which of those stages would you instrument first, and what would you log?"
    },

    {
      id: "rag-18",
      q: "Fixed-size, recursive, semantic or document-aware chunking — defend your default.",
      round: ["tech1", "tech2"],
      level: "2-5",
      tags: ["rag", "chunking", "ingestion"],
      why: "Whether you have a reasoned default or repeat whatever the tutorial used.",
      simple:
        "Four strategies, increasing in cost and sophistication.\n\n" +
        "Fixed-size splits every N characters. Fast, predictable, and it cuts sentences in half.\n\n" +
        "Recursive character splitting tries separators in order — paragraph breaks, then line breaks, then sentences, then characters — falling back only when a piece is still too big. It respects natural boundaries when they exist.\n\n" +
        "Semantic chunking embeds each sentence and splits where consecutive similarity drops, on the theory that a topic shift shows up as a similarity dip. It sounds principled and is expensive, because you embed everything twice.\n\n" +
        "Document-aware splitting uses actual structure: markdown headings, HTML tags, contract clause numbers, code functions.\n\n" +
        "My default is recursive, and the reason is the honest one — it captures most of the benefit for almost none of the cost, and it works on arbitrary input without knowing the format ahead of time.\n\n" +
        "But I upgrade to document-aware whenever structure exists, because it reliably beats everything else. A contract split on clause boundaries retrieves far better than one split every thousand characters. The structure was authored by a human to group related meaning, which is exactly what you want a chunk to be.\n\n" +
        "Semantic chunking I have rarely found worth its cost against document-aware splitting. Say that plainly rather than listing it as an equal option — having an opinion is the point of the question.",
      points: [
        "Recursive is the sensible default: cheap, format-agnostic, respects boundaries.",
        "Document-aware wins whenever real structure exists — use it.",
        "Semantic chunking is expensive and rarely beats structure.",
        "Fixed-size only for uniform, structureless text.",
        "The right answer is measured on your eval set, not chosen by reputation."
      ],
      say: "My default is recursive character splitting, because it respects paragraph and sentence boundaries at almost no cost and works on any input. But wherever real structure exists — headings, clause numbers, code functions — I use document-aware splitting, since a human already grouped related meaning there and it reliably retrieves better. Semantic chunking is expensive and I have not seen it beat structure often enough to justify embedding the corpus twice.",
      numbers: "Semantic chunking roughly doubles ingestion cost. Document-aware splitting usually gives a bigger retrieval gain for none of that overhead.",
      wrong: "Listing all four neutrally with no default. The question asked you to defend one, and neutrality reads as never having chosen.",
      follow: "Your corpus is 50,000 scanned invoices with no headings. Now what?"
    },

    {
      id: "rag-19",
      q: "How do you pick chunk size and overlap without guessing?",
      round: ["tech1"],
      level: "2-5",
      tags: ["rag", "chunking", "evaluation"],
      why: "The anti-cargo-cult card. Everyone uses 1000/200 because a tutorial did.",
      simple:
        "Everyone uses 1000 characters with 200 overlap, and almost nobody can say why. It came from a LangChain default.\n\n" +
        "The real method is to measure, and it is a couple of hours of work.\n\n" +
        "Build a small evaluation set — fifty to a hundred questions with the passage that answers each. You can generate candidates by prompting a model over your own chunks and then verifying by hand.\n\n" +
        "Then sweep. Ingest at 256, 512, 1024, 2048 tokens with a few overlap values, and measure recall@k for each configuration: how often the correct passage appears in the top k. Pick the winner. It is a grid search, and it takes an afternoon.\n\n" +
        "What you will usually find is that the optimum depends on your content, which is why no universal default exists. Dense reference material — policies, specifications, FAQs — favours smaller chunks, because precision matters and answers are localised. Narrative or analytical documents favour larger chunks, because meaning spans paragraphs.\n\n" +
        "Two things to hold onto. Measure in tokens, not characters, because the embedding model's limit is in tokens. And overlap exists only to stop an answer being split across a boundary — beyond roughly 10 to 20% of chunk size you are paying storage and retrieval noise for duplicate text.\n\n" +
        "The senior framing: chunk size trades retrieval precision against context completeness. Small chunks retrieve precisely and may lack surrounding context; large chunks carry context and dilute the embedding. Small-to-big retrieval sidesteps the trade entirely by embedding small and returning large.",
      points: [
        "1000/200 is a tutorial default, not an analysis.",
        "Build 50–100 question-passage pairs and sweep configurations.",
        "Measure recall@k; pick the configuration that wins.",
        "Dense reference favours small chunks; narrative favours large.",
        "Overlap above ~20% buys duplication, not recall."
      ],
      say: "I would not guess. I build fifty to a hundred question-and-passage pairs, then sweep chunk sizes from 256 to 2048 tokens with a few overlap values and measure recall@k for each. That is an afternoon of work and it replaces an argument with a number. Generally dense reference content favours smaller chunks and narrative favours larger, and overlap beyond about 20% just duplicates storage without improving recall.",
      numbers: "Sweep 256, 512, 1024, 2048 tokens. Keep overlap at 10–20% of chunk size. Measure in tokens, since that is the embedding model's actual limit.",
      wrong: "'1000 characters with 200 overlap, it is the standard.' There is no standard — it is a default from a framework, and the follow-up will ask why.",
      follow: "Your eval says 2048 wins on recall but answers got worse. Explain that."
    },

    {
      id: "rag-20",
      q: "What metadata do you attach to a chunk, and why each field?",
      round: ["tech1"],
      level: "2-5",
      tags: ["rag", "metadata", "ingestion"],
      why: "Metadata decides what you can filter, cite and secure later. Most of it cannot be backfilled cheaply.",
      simple:
        "Every field should earn its place by enabling something specific downstream.\n\n" +
        "Source identifier and URI — so you can cite and so the user can open the original. Without it your answer is unverifiable and nobody in a regulated setting will sign off on it.\n\n" +
        "Page or section and position — so a citation points at the exact place rather than a 200-page document.\n\n" +
        "Document date and ingestion timestamp — so you can prefer recent policy over superseded policy, and so you can find what a stale reindex missed.\n\n" +
        "Access control list or tenant identifier — so retrieval can filter by permission. This one is load-bearing: without it you cannot enforce document permissions at query time, and retrofitting it means reingesting the corpus.\n\n" +
        "Document type and department — the filters users actually want. 'Only search HR policies.'\n\n" +
        "Content hash — so re-ingestion is idempotent. If the hash is unchanged, skip the chunk and do not pay to re-embed it.\n\n" +
        "Version or supersedes — so a replaced document can be excluded rather than competing with its own replacement.\n\n" +
        "The rule that matters: attach anything you might filter on, because adding a field later means reprocessing everything. Storage is cheap and reingestion is not. But be deliberate about high-cardinality fields, since some vector stores build an index per filterable field and it is not free.",
      points: [
        "Source and URI for citation; page and position for precision.",
        "Dates for recency and for finding stale entries.",
        "ACL or tenant id — cannot be retrofitted without reingestion.",
        "Content hash makes re-ingestion idempotent and cheap.",
        "Attach anything you might filter on; backfilling means reprocessing."
      ],
      say: "Source and URI for citation, page and position so the citation is precise, document date and ingestion timestamp for recency and staleness checks, an ACL or tenant id so retrieval can filter by permission, document type for user-facing filters, and a content hash so re-ingestion skips unchanged chunks. The rule is to attach anything I might filter on later, because adding a field afterwards means reprocessing the whole corpus.",
      numbers: "A content hash typically lets an incremental reindex skip the large majority of chunks, turning a full re-embed into a small one.",
      wrong: "Storing only the text and a filename. It works in a demo and blocks permissions, recency and citation all at once — and every fix requires reingestion.",
      follow: "You now need per-department access control. What does that cost you?"
    },

    {
      id: "rag-21",
      q: "How do you handle a 400-page document with a table of contents?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "ingestion", "structure"],
      why: "Common in BFSI, pharma and manufacturing. Flat chunking destroys exactly the structure that makes these documents usable.",
      simple:
        "A 400-page manual has hierarchy — parts, chapters, sections, subsections — and flat chunking throws all of it away. A chunk reading 'this limit does not apply' is useless when the section heading that scoped it is three chunks earlier.\n\n" +
        "Parse the structure first. Use the table of contents or the heading levels to build a tree, so every chunk knows its ancestry.\n\n" +
        "Then chunk within sections, never across them. A section boundary is a real semantic boundary that a human author chose.\n\n" +
        "Now the technique that does most of the work: prepend the heading path to each chunk before embedding.\n\n" +
        "    Part III > Chapter 7 > Section 7.2 Credit Limits > 7.2.4 Exceptions\n" +
        "    This limit does not apply where the counterparty is...\n\n" +
        "The chunk now embeds with its context, so a query about credit limit exceptions matches it even though the chunk body never repeats those words. This is cheap, it is a few lines of ingestion code, and it routinely produces a large retrieval improvement on structured documents.\n\n" +
        "Store the heading path as metadata too, so users can filter by chapter and citations can say exactly where the answer came from.\n\n" +
        "For sections longer than your chunk limit, use small-to-big: embed the small chunk for precise matching but return the whole section for generation, so the model sees complete context.\n\n" +
        "The failure to avoid is treating page boundaries as semantic. A page break usually falls mid-sentence and means nothing.",
      points: [
        "Parse the heading hierarchy into a tree before chunking.",
        "Chunk within sections, never across them.",
        "Prepend the heading path before embedding — cheap and high-impact.",
        "Store the path as metadata for filtering and precise citation.",
        "Page boundaries are not semantic boundaries."
      ],
      say: "I parse the heading hierarchy first and chunk within sections rather than across them. The highest-value step is prepending the heading path to the chunk text before embedding, so a chunk saying 'this limit does not apply' carries the section that scoped it and matches queries about credit limit exceptions. I store the path as metadata for filtering and citation, and for oversized sections I embed small but return the full section.",
      numbers: "Heading-path prefixing is a few lines of ingestion code and typically produces one of the largest retrieval gains available on structured documents.",
      wrong: "Chunking every 1000 characters straight through. Sections get cut, headings are orphaned, and retrieval on a scoped clause becomes guesswork.",
      follow: "A clause says 'as defined in Section 3.1'. How does your system resolve that?"
    },

    {
      id: "rag-22",
      q: "Your retriever returns the right chunk at rank 8. The LLM misses it. Fix it.",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "debugging", "reranking"],
      why: "A precise diagnostic. Retrieval worked, so the fix is downstream — and knowing that saves you tuning the wrong stage.",
      simple:
        "This is a good failure to get, because it tells you retrieval is not the problem. The right chunk was found. The model just did not use it.\n\n" +
        "The cause is position. Models attend most reliably to the beginning and end of their context and measurably less to the middle — the lost-in-the-middle effect. Rank 8 of 10 sits in the dead zone, buried under seven chunks that scored higher but matter less.\n\n" +
        "Three fixes, in order of what I would try.\n\n" +
        "Add a reranker. The retriever is a bi-encoder that embedded query and document separately, which is fast and approximate. A cross-encoder reads the query and each candidate together and scores relevance directly. It is far more accurate at ordering, so the rank-8 chunk moves to rank 1. Retrieve 20 to 50 candidates, rerank, keep the top 3 to 5.\n\n" +
        "Cut k. If you are passing 10 chunks and the answer is in one, the other 9 are noise. Fewer, better chunks usually beat more chunks — and it is cheaper and faster.\n\n" +
        "Reorder deliberately. If you must pass many, put the highest-scoring chunks at the start and end rather than in descending order, so nothing important sits in the middle.\n\n" +
        "Then verify it stayed fixed. Add this query to your eval set, because the next chunking change can silently undo it.",
      points: [
        "Retrieval succeeded — the failure is position, not recall.",
        "Lost-in-the-middle: models attend to the ends, not the middle.",
        "A cross-encoder reranker is the direct fix for ordering.",
        "Fewer chunks often beats more — cut k.",
        "Add the query to the eval set so the fix is protected."
      ],
      say: "Retrieval worked, so this is not a recall problem — it is position. Models attend to the start and end of context far more reliably than the middle, so rank 8 of 10 sits in the dead zone. The direct fix is a cross-encoder reranker, which reads query and chunk together and reorders properly, so I retrieve 20 to 50 and keep the top 3 after reranking. Cutting k also helps, since fewer better chunks beat more noisy ones.",
      numbers: "Retrieve 20–50 candidates, rerank, pass 3–5. Reranking adds roughly 50–200ms depending on the model and candidate count.",
      wrong: "Rewriting the prompt to say 'read all the context carefully'. It does not address position, and it is the reflex fix that wastes a day.",
      follow: "Reranking added 200ms and your latency budget is gone. What else?"
    },

    {
      id: "rag-23",
      q: "How do you decide k — how many chunks to pass?",
      round: ["tech1"],
      level: "2-5",
      tags: ["rag", "tuning", "cost"],
      why: "A single number that trades recall, noise, latency and cost. There is a measurable optimum and most teams never look for it.",
      simple:
        "k is how many retrieved chunks you put in the prompt, and it pulls in four directions at once.\n\n" +
        "Raise k and recall improves — the answer is more likely to be in there somewhere. But you also add noise, and irrelevant context measurably degrades answers. You pay more tokens per request. And latency rises.\n\n" +
        "So there is a real optimum, and you find it the same way as chunk size: sweep it on your eval set and plot answer quality against k. The curve typically rises steeply, peaks, then declines as noise takes over. Teams are consistently surprised that quality gets worse past the peak.\n\n" +
        "In practice, with a reranker in front, 3 to 5 chunks is usually the sweet spot. Without a reranker you need more raw candidates to hit the same recall, so 5 to 10.\n\n" +
        "The important structural point: separate retrieval k from generation k. Retrieve 20 to 50 candidates so recall is high, then rerank and pass only the top 3 to 5 to the model. High recall in the candidate set, high precision in the prompt. Conflating those two numbers is the common mistake.\n\n" +
        "Two refinements worth mentioning. Score thresholding — drop chunks below a relevance floor even if that leaves you with two, since padding to a fixed k with weak chunks adds pure noise. And adapting k by query type, since a summary question needs broad coverage while a lookup needs one precise chunk.",
      points: [
        "k trades recall against noise, cost and latency.",
        "Answer quality peaks then declines — more is not better.",
        "Separate retrieval k from generation k.",
        "Retrieve 20–50, rerank, pass 3–5.",
        "Threshold on score rather than always padding to a fixed k."
      ],
      say: "k trades recall against noise, cost and latency, and there is a measurable optimum — quality rises, peaks, then falls as irrelevant context degrades the answer. I separate retrieval k from generation k: retrieve twenty to fifty for recall, rerank, then pass three to five to the model for precision. I also threshold on score rather than always padding to a fixed k, because filling the prompt with weak chunks is pure noise.",
      numbers: "3–5 chunks to the model with a reranker, 5–10 without. Retrieve 20–50 candidates before reranking.",
      wrong: "'k=5 because that is the default.' Same problem as chunk size — it is a framework default standing in for a measurement you never took.",
      follow: "For a question needing facts from four documents, does your k still work?"
    },

    {
      id: "rag-24",
      q: "The user asks something the corpus does not cover. What should happen?",
      round: ["tech1", "tech2"],
      level: "2-5",
      tags: ["rag", "refusal", "hallucination"],
      why: "The most-skipped requirement in RAG demos, and the first thing a regulated buyer tests.",
      simple:
        "The system should say it does not know. That is a feature you have to build — nothing gives it to you for free.\n\n" +
        "The default behaviour is bad. Vector search always returns k results, because it returns the nearest neighbours whether or not they are relevant. Ask about parental leave when the corpus is all engineering documentation and you still get five chunks back — the least-distant ones. The model then dutifully writes a confident answer from irrelevant context.\n\n" +
        "So you need three layers.\n\n" +
        "A relevance threshold. If the best chunk scores below a floor, treat it as no result. Set the floor by looking at score distributions for known-good and known-bad queries — do not invent it.\n\n" +
        "An instruction with an explicit escape. Tell the model directly: if the context does not contain the answer, say so and do not use outside knowledge. Models comply with this far more reliably when the refusal path is named rather than implied.\n\n" +
        "A groundedness check on the output. Verify the claims are supported by the retrieved context, and suppress or flag the answer if not.\n\n" +
        "Then design what the refusal looks like, because a bare 'I don't know' is a bad product. Say what was searched, offer the closest documents found, and route to a human or a support channel. A useful refusal builds trust; a confident wrong answer destroys it, and in a regulated setting it is a liability.\n\n" +
        "Measure this deliberately: put unanswerable questions in your eval set and score refusal rate. Most teams only test questions that have answers, so they never discover the system cannot say no.",
      points: [
        "Vector search always returns k results, relevant or not.",
        "Threshold on relevance score — below the floor means no result.",
        "Name the refusal path explicitly in the prompt.",
        "Check groundedness on the output before returning it.",
        "Put unanswerable questions in the eval set and score refusals."
      ],
      say: "It should refuse, and that has to be built. Vector search always returns k nearest neighbours whether or not they are relevant, so I threshold on relevance score and treat anything below the floor as no result. I state the refusal path explicitly in the prompt, and I check groundedness on the output. I also put unanswerable questions in the eval set, because teams test only answerable ones and never find out the system cannot say no.",
      numbers: "Set the score floor from the distributions of known-good and known-bad queries. Track refusal rate as a monitored metric — a sudden drop often means retrieval broke.",
      wrong: "Assuming the model will notice the context is irrelevant. It usually will not — it will write a fluent answer from whatever you gave it.",
      follow: "Your refusal rate jumped from 2% to 20% overnight. What happened?"
    },

    {
      id: "rag-25",
      q: "How do you handle multi-turn conversation in RAG?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "conversation", "query-rewriting"],
      why: "Every real RAG product is a chat, and naive retrieval on the raw follow-up breaks immediately.",
      simple:
        "The problem shows up on the second turn.\n\n" +
        "    User: What is the notice period for senior engineers?\n" +
        "    Bot:  Ninety days.\n" +
        "    User: What about during probation?\n\n" +
        "Embed 'What about during probation?' and search. It contains no mention of notice period or senior engineers, so retrieval returns documents about probation generally — performance reviews, confirmation criteria — and the answer is wrong.\n\n" +
        "The fix is query contextualisation: before retrieving, rewrite the follow-up into a standalone question using the conversation history. A cheap fast model does this well.\n\n" +
        "    Rewritten: What is the notice period for senior engineers during probation?\n\n" +
        "Now retrieval works, because the query carries its own context.\n\n" +
        "Details that matter in production. Use a small fast model — this is on the critical path and adds latency to every turn. Only rewrite when needed; a self-contained question should pass through untouched, so classify first or instruct the rewriter to return the input unchanged when it already stands alone. Bound the history you feed it to the last few turns, since the whole conversation is expensive and mostly irrelevant.\n\n" +
        "And keep the rewritten query in your traces. When a multi-turn answer is wrong, the first thing you check is what was actually searched — and without that logged, you are debugging blind.\n\n" +
        "One caveat: rewriting can lose nuance on a topic change. If the user pivots entirely, an over-eager rewriter drags in irrelevant prior context.",
      points: [
        "Follow-ups are not self-contained; raw retrieval on them fails.",
        "Rewrite into a standalone query before retrieving.",
        "Use a small fast model — it is on every turn's critical path.",
        "Skip the rewrite when the question already stands alone.",
        "Log the rewritten query, or multi-turn debugging is blind."
      ],
      say: "The second turn breaks naive retrieval, because a follow-up like 'what about during probation' has none of the context it needs. So I rewrite it into a standalone query against the last few turns of history before retrieving. I use a small fast model since it is on the critical path, skip the rewrite when the question already stands alone, and always log the rewritten query — otherwise you cannot debug why a multi-turn answer was wrong.",
      numbers: "Keep the rewrite under about 200ms with a small model. Feed it the last 3–5 turns rather than the full history.",
      wrong: "Concatenating the whole conversation into the search query. It dilutes the embedding with old topics and retrieval gets worse as the conversation grows.",
      follow: "The user changes topic completely. Does your rewriter cope?"
    },

    {
      id: "rag-26",
      q: "How do you build the retrieval eval set when you have no labelled data?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "evaluation", "synthetic-data"],
      why: "The blocker every team hits. Without this, all tuning is guesswork.",
      simple:
        "You cannot measure retrieval without knowing which chunk should have been retrieved. Nobody starts with that, so you generate it.\n\n" +
        "The trick is to work backwards. Take a chunk, ask a model to write a question that this chunk answers, and you now have a question-answer pair where you know the correct chunk by construction.\n\n" +
        "    For each sampled chunk:\n" +
        "      generate 1-2 questions this chunk fully answers\n" +
        "      store (question, chunk_id) as ground truth\n\n" +
        "Sample 100 to 200 chunks stratified across document types, not all from one manual, or you will tune for one corner of the corpus.\n\n" +
        "Then the step that decides whether this is useful or theatre: verify by hand. Read every generated question. Throw out ones that are trivially answerable from the wording, that are ambiguous, or that other chunks answer equally well. Expect to discard a meaningful share. Two hours of a human reading questions is what makes the set trustworthy.\n\n" +
        "Deliberately include hard cases: questions needing two documents, questions using vocabulary the corpus does not use, and unanswerable questions to measure refusal.\n\n" +
        "Now you can measure recall@k, MRR and nDCG, and every chunking or embedding decision becomes an experiment rather than an argument.\n\n" +
        "The honest limitation: synthetic questions are phrased like the document, and real users phrase things differently. So this is a starting point. As soon as you have production traffic, replace synthetic questions with real logged queries — those are the ground truth that matters.",
      points: [
        "Generate questions from chunks — ground truth by construction.",
        "Stratify the sample across document types.",
        "Human verification is what makes it real; expect to discard many.",
        "Include multi-document and unanswerable questions deliberately.",
        "Replace with real logged queries as soon as you have traffic."
      ],
      say: "I generate it backwards: take a chunk, have a model write a question that chunk answers, and the correct chunk is known by construction. I sample a hundred to two hundred chunks stratified across document types, then verify by hand and discard the ambiguous or trivially-worded ones — that human pass is what makes it trustworthy. I include unanswerable questions to measure refusal, and I replace synthetic queries with real logged ones once there is traffic.",
      numbers: "100–200 verified pairs is enough to compare configurations. Expect to discard a substantial fraction of generated questions during review.",
      wrong: "Generating a thousand questions and never reading them. Unverified synthetic data produces confident metrics that measure the generator, not your retrieval.",
      follow: "Your synthetic eval says recall is 92% and users still complain. Why?"
    },

    {
      id: "rag-27",
      q: "What is context precision against context recall?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "evaluation", "metrics"],
      why: "The two RAGAS metrics that actually diagnose, and candidates routinely confuse them.",
      simple:
        "These are the two retrieval metrics worth knowing, and they answer opposite questions.\n\n" +
        "Context recall: of everything needed to answer the question, how much did retrieval find? Low recall means the answer was not in the context at all — the model could not have succeeded.\n\n" +
        "Context precision: of what retrieval returned, how much was actually relevant, and was it ranked near the top? Low precision means you found the answer but buried it in noise.\n\n" +
        "The diagnostic value is that they point at different fixes.\n\n" +
        "Low recall, decent precision — the answer is not being retrieved. Look at chunking, the embedding model, or query rewriting. Raising k may help. No prompt change will fix this.\n\n" +
        "Decent recall, low precision — the answer is there but surrounded by noise or ranked low. Add a reranker, cut k, tighten filters.\n\n" +
        "Both low — retrieval is fundamentally broken. Check the basics: is the index stale, is a filter excluding everything, did ingestion actually complete.\n\n" +
        "Both high but answers still wrong — retrieval is fine and the problem is generation. Now look at the prompt, the model, or faithfulness.\n\n" +
        "That last row is why measuring both matters. It is the only clean way to prove retrieval is not at fault, and it stops the team from tuning chunking for a week when the prompt was the problem.\n\n" +
        "Faithfulness is the third metric and it is separate: does the answer only claim things the context supports? High retrieval scores with low faithfulness means the model is inventing despite having good context.",
      points: [
        "Recall: did retrieval find what was needed.",
        "Precision: was what it returned relevant and well-ranked.",
        "Low recall points at chunking, embeddings, query rewriting.",
        "Low precision points at reranking, k, filters.",
        "Both high with bad answers means the problem is generation."
      ],
      say: "Context recall asks whether retrieval found everything needed; context precision asks whether what it returned was relevant and ranked highly. They point at different fixes — low recall means chunking, embeddings or query rewriting, while low precision means add a reranker or cut k. Measuring both is what lets me prove retrieval is fine and the problem is generation, which stops the team tuning the wrong stage for a week.",
      numbers: "Target recall above 0.9 on your eval set before tuning anything downstream. If recall is low, generation improvements cannot help.",
      wrong: "Reporting a single RAG score. It tells you something is wrong and nothing about which of five stages to look at.",
      follow: "Recall is 0.95, precision is 0.9, and users say answers are wrong. Where do you look?"
    },

    {
      id: "rag-28",
      q: "How do you ingest from SharePoint, Confluence and a shared drive at once?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "ingestion", "enterprise"],
      why: "Enterprise reality in India. The interesting part is permissions and incremental sync, not the connectors.",
      simple:
        "The connectors themselves are the easy part — every platform has an API. The hard parts are the four things underneath.\n\n" +
        "Permissions. Each system has its own model: SharePoint groups, Confluence space permissions, filesystem ACLs. You must capture the effective permission per document at ingestion and store it as chunk metadata, then filter every query by the user's identity. This is the requirement that most often gets deferred and most often blocks go-live, because retrofitting it means reingesting everything.\n\n" +
        "Incremental sync. A full reindex nightly does not scale past a modest corpus. Use each platform's change feed — SharePoint delta queries, Confluence's updated-since — plus a content hash so unchanged documents are skipped. Handle deletions explicitly, or removed documents keep being cited.\n\n" +
        "Normalisation. A Confluence page, a Word document and a PDF need to arrive as one internal representation with consistent metadata, so the rest of the pipeline does not branch per source.\n\n" +
        "Rate limits and failure isolation. These APIs throttle aggressively. One slow source must not block the others, and one failed document must not abort the run — dead-letter it and continue.\n\n" +
        "Architecturally: one scheduler, per-source workers, a normalised queue into a shared chunk-embed-index pipeline. Each source tracks its own cursor so it can resume.\n\n" +
        "The thing to say out loud is that permissions and deletion are what turn a two-week prototype into a two-month project. Naming that upfront reads as experience.",
      points: [
        "Capture effective permissions per document at ingestion — cannot be retrofitted.",
        "Incremental sync via change feeds plus content hashing.",
        "Handle deletions, or removed documents keep being cited.",
        "Normalise all sources to one internal representation.",
        "Isolate failures per source and per document; dead-letter and continue."
      ],
      say: "The connectors are straightforward; the hard parts are permissions and sync. I capture each document's effective permissions at ingestion and store them as chunk metadata, because filtering by user identity at query time cannot be retrofitted without reingesting. I sync incrementally using each platform's change feed plus a content hash, handle deletions explicitly, and normalise every source into one representation so the downstream pipeline does not branch.",
      numbers: "Content hashing typically lets an incremental run skip the vast majority of documents. Nightly full reindexes stop being viable well before a million documents.",
      wrong: "Describing the connectors and stopping. Permissions and deletion handling are the actual project, and skipping them signals prototype-only experience.",
      follow: "An employee changes department. What has to happen to your index?"
    },

    {
      id: "rag-29",
      q: "How do you handle document versioning where an old policy is superseded?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "versioning", "bfsi"],
      why: "A real BFSI and compliance failure — answering correctly from a policy that is no longer in force.",
      simple:
        "The failure is specific and expensive: a user asks about the current leave policy, retrieval returns the 2023 version because it happens to be a better lexical match, and the system answers confidently with a rule that no longer applies. Nothing errors. The answer is wrong in a way that carries compliance consequences.\n\n" +
        "Three mechanisms, and you generally want all three.\n\n" +
        "Version metadata. Every chunk carries an effective-from date, an effective-to date, and a status of current or superseded. Then filter to current by default at query time. This is the primary fix, and it is a filter rather than a ranking hint — you exclude superseded content rather than hoping it ranks lower.\n\n" +
        "Explicit supersedes links. When version 4 lands, mark version 3 superseded and point at its replacement. That lets you answer 'what changed' questions and lets a citation show which version applied.\n\n" +
        "Recency in ranking. Even among current documents, prefer the newer where dates are close.\n\n" +
        "Now the requirement people miss: you often cannot delete the old versions. In BFSI and insurance you must be able to answer what the policy was on a given past date, for audits and disputes. So keep history and make time a query parameter — default to today, allow as-of queries.\n\n" +
        "And put the effective date in the answer itself. 'Under the policy effective 1 April 2026...' lets the reader catch a version error you did not. That is cheap and it is what a compliance reviewer will look for.",
      points: [
        "Effective-from, effective-to and status on every chunk.",
        "Filter to current by default — exclude, do not just down-rank.",
        "Link superseded versions to their replacement.",
        "Keep history: audits need as-of-date answers.",
        "State the effective date in the answer text."
      ],
      say: "Every chunk carries effective-from, effective-to and a current-or-superseded status, and I filter to current by default rather than hoping the newer version ranks higher. I link superseded documents to their replacement so I can answer what-changed questions. Crucially I do not delete history, because audits and disputes need as-of-date answers, so time is a query parameter. And I put the effective date in the answer so a reader can catch a version error.",
      numbers: "Retention is usually driven by regulation — commonly seven years or more in Indian BFSI. Design for as-of-date queries from the start.",
      wrong: "Deleting the old version on upload. It solves retrieval and breaks audit, and in a regulated setting that is the more serious failure.",
      follow: "An auditor asks what the policy was in March 2024. Can your system answer?"
    },

    {
      id: "rag-30",
      q: "Your corpus is 60% Hindi, 40% English. What changes in the pipeline?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "multilingual", "india"],
      why: "Directly relevant to the Indian market, and it touches embeddings, cost and evaluation at once.",
      simple:
        "Almost every stage changes, and the cost model changes most.\n\n" +
        "Embeddings. You need a multilingual model with genuine cross-lingual alignment, so a Hindi question retrieves a relevant English document and the reverse. Test that explicitly — many models handle both languages separately without aligning them, which looks fine until a query crosses languages.\n\n" +
        "Tokenisation cost. Devanagari costs substantially more tokens per word than Latin script, because tokenisers saw far less of it in training. The same paragraph in Hindi can cost two to three times what the English costs. That reshapes your chunk sizes — measured in tokens, a Hindi chunk holds less text — and it reshapes your budget. Never quote a cost figure from English benchmarks for a Hindi-majority corpus.\n\n" +
        "Chunking. Sentence splitting on the full stop does not work for Devanagari, which uses the danda. Use a script-aware splitter.\n\n" +
        "Retrieval. Hybrid search matters more here, because BM25 behaves differently across scripts and transliteration is common — users type Hindi words in Latin script constantly. Normalising or indexing transliterated forms is often necessary.\n\n" +
        "Generation. Instruct the model to answer in the user's language regardless of the retrieved document's language. Cross-lingual answering is a common requirement and it does not happen by default.\n\n" +
        "Evaluation. Your eval set must cover both languages and the cross-lingual cases, and be reviewed by someone who reads Hindi. An English-only eval set will report good numbers on a system that fails for the majority of the corpus.\n\n" +
        "Mixed-script content within one document is normal in Indian enterprises, so do not assume one language per document.",
      points: [
        "Verify cross-lingual alignment, not just multilingual support.",
        "Devanagari costs 2–3× more tokens per word — budget and chunk for it.",
        "Sentence splitting must handle the danda, not just the full stop.",
        "Hybrid search and transliteration handling matter more.",
        "Eval set must cover both languages and cross-lingual queries."
      ],
      say: "I would pick a multilingual embedding model and explicitly test cross-lingual alignment, so a Hindi query retrieves relevant English documents. Tokenisation is the big cost change — Devanagari runs two to three times more tokens per word, so chunk sizes and the budget both shift. Sentence splitting needs to handle the danda, hybrid search matters more because of transliteration, and the eval set has to cover both languages and be reviewed by a Hindi reader.",
      numbers: "Hindi commonly costs 2–3× the tokens of equivalent English text. Cost estimates built on English benchmarks will be badly wrong for this corpus.",
      wrong: "'Use a multilingual embedding model' and stopping. It ignores the token economics, the splitting problem and the evaluation gap, which are where the project actually gets hard.",
      follow: "A user types a Hindi question in Latin script. Does retrieval work?"
    },

    {
      id: "rag-31",
      q: "How do you deal with near-duplicate documents flooding the top-k?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "deduplication", "diversity"],
      why: "Extremely common in enterprises — the same policy exists in six near-identical copies, and they crowd out everything else.",
      simple:
        "Real corpora are full of near-duplicates: the same policy attached to five emails, a template reused across forty contracts, a document and its lightly-edited revision. Retrieve top 5 and you get the same paragraph five times. Recall looks fine and the model sees one fact repeated instead of five useful ones.\n\n" +
        "Fix it at two points.\n\n" +
        "At ingestion, which is where you should prefer to solve it. An exact content hash catches identical chunks for free. Near-duplicates need similarity comparison — MinHash or SimHash for scale, or cosine above a high threshold within the embedding space. Keep one canonical copy and record the others as alternate sources, so citations can still point at the copy the user has access to. Cheaper to store, cheaper to embed, cheaper to search.\n\n" +
        "At query time, for what slips through. Maximal marginal relevance reranks for relevance and diversity together, penalising a candidate that closely resembles something already selected. A lambda around 0.5 to 0.7 keeps relevance dominant while breaking up clusters. Or simply drop candidates above a similarity threshold to an already-chosen chunk.\n\n" +
        "The judgement call worth voicing: deduplicate carefully. Two chunks can be textually near-identical and differ in one number that is the entire answer — a limit that changed between regional variants of a policy. Dedup on content plus the metadata that distinguishes them, and set the threshold high.\n\n" +
        "Watch for it by monitoring the mean pairwise similarity of retrieved sets. A high value means you are spending your k on repetition.",
      points: [
        "Near-duplicates waste k and starve the answer of other facts.",
        "Content hash at ingestion is free; MinHash or cosine for near-dupes.",
        "Keep one canonical copy, record alternates for citation.",
        "MMR at query time for what slips through — lambda 0.5 to 0.7.",
        "Dedup cautiously: one differing number can be the whole answer."
      ],
      say: "I solve it at ingestion where possible — a content hash catches exact copies free, and MinHash or a high cosine threshold catches near-duplicates. I keep one canonical chunk and record the others as alternate sources so citations still work. For what slips through I use MMR at query time, which balances relevance against diversity. I set thresholds high, because two chunks can differ by one number that is the entire answer.",
      numbers: "MMR lambda around 0.5–0.7 keeps relevance dominant. Monitor mean pairwise similarity within retrieved sets to detect duplicate flooding.",
      wrong: "Aggressive dedup on text similarity alone. It silently merges regional policy variants that differ in exactly the number the user asked about.",
      follow: "Two chunks are 99% identical but one limit differs. How does your dedup handle it?"
    },

    {
      id: "rag-32",
      q: "How do you cite at sentence level rather than document level?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "citations", "compliance"],
      why: "What regulated buyers actually demand. 'Source: policy.pdf' is not a citation they will accept.",
      simple:
        "Pointing at a 200-page PDF is not a citation — it moves the verification work to the reader. Regulated buyers want the specific sentence.\n\n" +
        "Three approaches, increasing in fidelity.\n\n" +
        "Ask the model to cite inline. Number the chunks in the prompt and require a marker after each claim, then map markers back to sources.\n\n" +
        "    [1] {chunk text}\n" +
        "    [2] {chunk text}\n" +
        "    Cite the chunk number after every factual claim.\n\n" +
        "Cheap and it works reasonably, but the model can attach a marker to the wrong claim, so it needs verification.\n\n" +
        "Post-hoc attribution. Generate the answer, split it into sentences, and for each sentence find the supporting chunk by entailment or similarity. More reliable because it is computed rather than self-reported, and it catches sentences that nothing supports — which are exactly your hallucinations.\n\n" +
        "Span-level highlighting. Go further and locate the exact character offsets within the chunk. This needs offsets preserved from ingestion — chunk start and end positions within the original document — so the UI can deep-link and highlight. If you did not store offsets during parsing, you cannot do this without reingesting.\n\n" +
        "The verification step is what makes it real: check every citation actually supports its claim, and flag or drop the ones that do not. An unverified citation is worse than none, because it looks authoritative.\n\n" +
        "Design the UI for one-click verification — click the citation, land on the highlighted sentence in the source. That single interaction is what makes a compliance team trust the system.",
      points: [
        "Document-level citation shifts verification onto the reader.",
        "Inline markers are cheap but self-reported and need checking.",
        "Post-hoc attribution is computed, and it exposes unsupported sentences.",
        "Span highlighting needs character offsets stored at ingestion.",
        "Verify every citation — an unverified one looks authoritative and misleads."
      ],
      say: "Document-level citation just moves verification to the reader. I number chunks in the prompt and require inline markers, then verify each one post-hoc by checking the cited chunk actually supports the sentence — that also surfaces unsupported sentences, which are the hallucinations. For span-level highlighting I need character offsets preserved from ingestion, so I store those upfront since it cannot be retrofitted without reprocessing.",
      numbers: "Store chunk start and end offsets at ingestion. Without them, span-level citation requires reprocessing the entire corpus.",
      wrong: "Returning the source filenames beneath the answer and calling it cited. A compliance reviewer will ask which sentence, and there is no answer.",
      follow: "The model cites a chunk that does not support the claim. How do you catch it?"
    },

    {
      id: "rag-33",
      q: "How do you measure whether the answer is actually grounded in the retrieved context?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "faithfulness", "evaluation"],
      why: "Faithfulness is the metric that separates a demo from a system you can defend.",
      simple:
        "Groundedness, or faithfulness, asks a narrow question: is every claim in the answer supported by the retrieved context? Note what it does not ask — whether the answer is correct. An answer can be perfectly faithful to a document that is itself out of date. These are separate measurements and conflating them causes confusion.\n\n" +
        "The standard method decomposes the answer:\n\n" +
        "    1. Break the answer into atomic claims.\n" +
        "    2. For each claim, ask a judge model whether the context entails it.\n" +
        "    3. Faithfulness = supported claims / total claims.\n\n" +
        "Decomposition is what makes this work. Judging a whole paragraph gives you a mushy verdict, because three sentences are supported and one is invented. Per-claim scoring localises the problem, and you can show exactly which sentence was unsupported.\n\n" +
        "Cheaper signals exist for production, where running a judge on every response is expensive. Token overlap or an NLI model gives a fast approximate score. Sample a percentage of live traffic for full judging rather than all of it.\n\n" +
        "Validate the judge itself. Hand-label fifty responses, check the judge agrees with you, and only then trust its numbers at scale. An unvalidated judge is a confident random number generator.\n\n" +
        "Then the diagnostic pairing that matters. High faithfulness with a wrong answer means retrieval gave you the wrong document — go fix retrieval. Low faithfulness means the model is inventing despite good context — tighten the prompt, lower the temperature, or add an output check. Measuring both is what tells you which team owns the bug.",
      points: [
        "Faithfulness asks if claims are supported, not if they are true.",
        "Decompose into atomic claims — paragraph-level judging is mush.",
        "Score as supported claims over total claims.",
        "Validate the judge against human labels before trusting it.",
        "Faithful but wrong means retrieval; unfaithful means generation."
      ],
      say: "I decompose the answer into atomic claims and check each against the retrieved context with a judge model, scoring supported claims over total. Decomposition matters because judging a whole paragraph hides one invented sentence among three good ones. I validate the judge against about fifty hand-labelled responses first. The diagnostic value is the pairing: faithful but wrong means retrieval failed, unfaithful means generation did.",
      numbers: "Validate the judge on 50 hand-labelled examples. Sample production traffic for full judging rather than scoring every response.",
      wrong: "Treating faithfulness as correctness. A perfectly grounded answer from a superseded policy scores 1.0 and is still wrong for the user.",
      follow: "Faithfulness is 0.98 and users report wrong answers. Where is the bug?"
    },

    {
      id: "rag-34",
      q: "What is the cost model of a RAG request, line by line?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["rag", "cost", "economics"],
      why: "A hiring manager will ask what this costs. Being able to break it down is a senior signal.",
      simple:
        "Break one request into its billable parts and it becomes a spreadsheet rather than a mystery.\n\n" +
        "Query embedding. One short embedding call. Negligible per request, but it is on every request including cache misses.\n\n" +
        "Vector search. Compute or managed-service cost, usually priced by index size and queries rather than per call. Often billed as fixed infrastructure.\n\n" +
        "Reranking. A cross-encoder over 20 to 50 candidates. Small if self-hosted, a real line item on a hosted API.\n\n" +
        "Generation input. The dominant cost and the one people underestimate. System prompt plus retrieved chunks plus conversation history. Five chunks of 500 tokens is 2,500 tokens before anything else — the retrieved context, not the user's question, is almost always the largest input.\n\n" +
        "Generation output. Priced several times higher than input per token, but usually far fewer tokens, so typically smaller in total than input.\n\n" +
        "Then the multipliers people forget when they build the estimate: retries after failures, the query-rewrite call on multi-turn, evaluation and judge calls on sampled traffic, and re-embedding the corpus whenever you change models or reingest.\n\n" +
        "Present it per thousand requests, because per-request numbers in fractions of a rupee are hard to reason about. Then the levers, in order of impact: cut retrieved context first since it is the biggest line, then cache, then route simple queries to a cheaper model, then trim output length.\n\n" +
        "And separate fixed from variable. Vector database and any self-hosted reranker are largely fixed; model calls scale with traffic. That distinction is what a finance conversation actually needs.",
      points: [
        "Embedding, search, rerank, generation input, generation output.",
        "Retrieved context dominates input tokens — usually the biggest line.",
        "Output costs more per token but there are far fewer of them.",
        "Include retries, rewrites, and eval calls in the estimate.",
        "Separate fixed infrastructure from per-request variable cost."
      ],
      say: "Query embedding, vector search, reranking, generation input and generation output. Generation input dominates, because five chunks of five hundred tokens is far more than the user's question — retrieved context is almost always the largest line. Output is pricier per token but there is much less of it. I add retries, query rewrites and sampled eval calls, present it per thousand requests, and separate fixed infrastructure from variable per-call cost.",
      numbers: "Quote per thousand requests. The fastest lever is cutting retrieved context, since it is usually the largest single component of the bill.",
      wrong: "Quoting only the generation call. It ignores embedding, reranking and eval traffic, and the real bill comes in well above the estimate.",
      follow: "Cut this by half without hurting quality. What goes first?"
    },

    {
      id: "rag-35",
      q: "How do you make a RAG system respond in under two seconds?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "latency", "optimisation"],
      why: "A concrete budget forces you to know where the milliseconds actually go.",
      simple:
        "Start by allocating the budget across stages, because you cannot optimise what you have not measured.\n\n" +
        "    query rewrite       100ms   (skip when not needed)\n" +
        "    query embedding      50ms\n" +
        "    vector search        50ms\n" +
        "    reranking           150ms\n" +
        "    generation TTFT     600ms\n" +
        "    ------------------------\n" +
        "    to first token      ~950ms\n\n" +
        "The key reframing: with streaming, the number the user feels is time to first token, not total completion. That changes what you optimise. A four-second full response that starts rendering in under a second feels fast; a two-second response that appears all at once feels slower.\n\n" +
        "Then the levers, roughly in order of payoff.\n\n" +
        "Stream. Largest perceived improvement for the least work.\n\n" +
        "Parallelise. Query embedding and any metadata lookup run concurrently, not in sequence.\n\n" +
        "Cache. Exact-match on repeated queries returns in milliseconds. Semantic caching catches paraphrases, with a high threshold.\n\n" +
        "Trim retrieval. Fewer chunks means fewer input tokens means faster prefill. Cutting k from 10 to 4 helps latency and quality at once.\n\n" +
        "Right-size the reranker. A small cross-encoder over 20 candidates rather than a large one over 100.\n\n" +
        "Skip work conditionally. Not every query needs rewriting; not every query needs retrieval at all.\n\n" +
        "Measure p95, not the mean. The mean hides the tail, and the tail is what users complain about. Trace per stage so you know which one moved.",
      points: [
        "Allocate a budget per stage, then measure against it.",
        "With streaming, TTFT is what the user feels — optimise that.",
        "Parallelise independent stages; cache aggressively.",
        "Fewer chunks improves latency and quality together.",
        "Track p95 per stage, not the overall mean."
      ],
      say: "I allocate a budget per stage — rewrite, embed, search, rerank, generation — then measure against it. The reframing is that with streaming the user feels time to first token, not total time, so I stream first. Then parallelise independent stages, cache exact and near-duplicate queries, and cut k, which improves latency and quality together. I track p95 per stage rather than the mean, because the tail is what people complain about.",
      numbers: "A workable split: ~50ms embedding, ~50ms search, ~150ms rerank, ~600ms to first token. Optimise the stage that actually dominates your p95.",
      wrong: "Jumping to a smaller model first. It costs quality, and retrieval and prompt size usually offer larger savings before you touch the model.",
      follow: "Your p95 is 4s but p50 is 900ms. What is going on?"
    },

    {
      id: "rag-36",
      q: "How would you migrate a RAG system from Pinecone to pgvector?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "migration", "vector-db"],
      why: "A realistic project. The interesting part is doing it without a quality regression or downtime.",
      simple:
        "The motivation is usually cost, data residency, or wanting one database instead of two. Say which, because it shapes the plan.\n\n" +
        "The sequence I would follow.\n\n" +
        "Baseline first. Run your retrieval eval against the current system and record recall@k and latency. Without this you cannot tell whether the migration degraded anything, and 'it feels the same' is not a migration sign-off.\n\n" +
        "Set up pgvector with a matching index. HNSW with equivalent parameters — m and ef_construction — and the same distance metric. A silent metric mismatch between cosine and L2 changes your ranking entirely.\n\n" +
        "Backfill. Export vectors with their ids and metadata and bulk-load them. Do not re-embed if you can avoid it: re-embedding is expensive and risks a different model version producing slightly different vectors. Build the index after loading, not during, which is substantially faster.\n\n" +
        "Dual-write. Point ingestion at both stores so they stay in sync while you validate. This is what lets you take your time.\n\n" +
        "Shadow-read. Send production queries to both, compare result sets and latency, and log the differences. Some divergence is expected because these are approximate indexes; large divergence means a configuration mismatch.\n\n" +
        "Re-run the eval against pgvector and compare to baseline. Tune ef_search until recall matches.\n\n" +
        "Cut over behind a feature flag with a percentage rollout, keeping dual-write until you are confident. Then stop dual-write and decommission.\n\n" +
        "The trade to state honestly: pgvector is cheaper and operationally simpler if you already run Postgres, but a dedicated store generally scales further. Below roughly a few million vectors that gap rarely matters.",
      points: [
        "Baseline retrieval metrics before touching anything.",
        "Match the distance metric and index parameters exactly.",
        "Export vectors rather than re-embedding.",
        "Dual-write, then shadow-read and compare before cutting over.",
        "Roll out behind a flag; keep dual-write until confident."
      ],
      say: "I baseline recall@k and latency first, so I can prove the migration did not regress. Then set up pgvector with a matching distance metric and HNSW parameters, bulk-load exported vectors rather than re-embedding, and build the index after loading. I dual-write to keep both in sync, shadow-read production queries to compare results, re-run the eval and tune ef_search until recall matches, then cut over behind a feature flag.",
      numbers: "Build the index after bulk loading, not per row. Tune ef_search until recall matches baseline — that is the knob that trades recall against latency.",
      wrong: "Exporting, importing and switching over in one step. Any recall regression from a mismatched metric or index parameter reaches users before you notice.",
      follow: "Post-migration recall dropped 4 points. What do you check first?"
    },

    {
      id: "rag-37",
      q: "How do you handle images and charts inside documents in the answer?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "multimodal", "ingestion"],
      why: "Financial reports, manuals and slide decks carry meaning in figures. Text-only ingestion silently drops it.",
      simple:
        "A text-only pipeline extracts nothing useful from a chart. The number the user wants is in the bars, and your index contains at best a caption. The failure is silent — ingestion succeeds and the content is simply absent.\n\n" +
        "Three approaches.\n\n" +
        "Caption and index. At ingestion, send each image to a vision model and generate a rich text description — what the chart shows, its axes, the notable values and the trend. Index that text alongside the surrounding document text, storing the image reference in metadata. Retrieval stays entirely text-based, so nothing else in the pipeline changes. This is the pragmatic default: cheap at query time, one-off cost at ingestion, and it works with the infrastructure you already have.\n\n" +
        "Multimodal embeddings. Embed images and text into a shared space so a query can match an image directly. Elegant, but it needs a multimodal embedding model and generally retrieves less precisely on text-heavy corpora.\n\n" +
        "Retrieve then look. Retrieve the page, then pass the actual image to a vision-capable model at generation time so it reads the chart to answer. Most accurate for detailed numeric questions, most expensive, and slower.\n\n" +
        "In practice I combine the first and third: caption for retrieval, then pass the source image to the model when the retrieved chunk is figure-derived.\n\n" +
        "Two details. Keep the image reference in metadata so the answer can display the figure — showing the chart is often a better answer than describing it. And separate decorative images from meaningful ones during ingestion, or you will pay to caption every logo and page-border in the corpus.",
      points: [
        "Text-only ingestion drops figure content silently.",
        "Caption-and-index is the pragmatic default — nothing downstream changes.",
        "Multimodal embeddings are elegant but less precise on text-heavy corpora.",
        "For numeric detail, pass the actual image at generation time.",
        "Filter decorative images or you pay to caption every logo."
      ],
      say: "Text-only ingestion silently drops the content of charts. My default is caption-and-index: at ingestion a vision model writes a rich description of each figure, which I index as text with the image reference in metadata, so retrieval and the rest of the pipeline are unchanged. For precise numeric questions I also pass the source image to a vision model at generation. And I filter decorative images, or I pay to caption every logo.",
      numbers: "Captioning is a one-off ingestion cost against a per-query cost for vision at generation. Filtering decorative images typically removes a large share of candidates.",
      wrong: "Assuming the PDF parser handled it. Parsers extract a caption at best; the data in the plot area is simply gone and nothing warns you.",
      follow: "The user asks for a specific value from a bar chart. Does your captioning cover that?"
    },

    {
      id: "rag-38",
      q: "Your RAG worked in the pilot and failed at 100 users. What broke?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "scale", "production"],
      why: "The pilot-to-production gap is where most Indian enterprise GenAI projects actually die.",
      simple:
        "Pilots succeed under conditions that do not survive contact with real users. Four things change at once.\n\n" +
        "Query diversity. The pilot had ten friendly testers asking questions the team anticipated. A hundred real users ask things nobody designed for — vague, misspelled, multi-part, in mixed languages, about documents outside the corpus. Retrieval quality falls because the query distribution shifted, not because anything technically broke.\n\n" +
        "Corpus growth. The pilot ran on a curated set. Production has everything: duplicates, drafts, superseded versions, scanned files, irrelevant departments. More documents means more ways to retrieve the wrong one, and precision falls even with recall unchanged.\n\n" +
        "Concurrency. Rate limits, connection pool exhaustion, and index memory pressure all appear together. p95 latency degrades sharply while p50 still looks fine, which is why the dashboard looks healthy while users complain.\n\n" +
        "Trust. Ten testers forgive a wrong answer. A hundred users tell each other, and one confident wrong answer in a visible case can end adoption regardless of your accuracy numbers.\n\n" +
        "What I would do: instrument first — log queries, retrieved chunks, scores and feedback, because you cannot fix what you cannot see. Then cluster the failing queries; there are usually two or three dominant patterns rather than a hundred unique problems. Build the eval set from real logged queries rather than the synthetic ones. Add refusal so the system stops answering confidently outside its corpus. Then fix the top cluster.\n\n" +
        "The preventable version of this is running the pilot on the full corpus with real users from the start, rather than a curated set with colleagues.",
      points: [
        "Query distribution shifts — real users ask what nobody designed for.",
        "Full corpus adds duplicates, drafts and superseded versions.",
        "Concurrency exposes rate limits and p95 degradation.",
        "One visible wrong answer can end adoption regardless of metrics.",
        "Instrument, cluster failures, rebuild the eval set from real queries."
      ],
      say: "Usually four things at once: real users ask questions nobody anticipated so the query distribution shifts, the full corpus brings duplicates and superseded documents that hurt precision, concurrency exposes rate limits and p95 latency, and trust breaks after one visible wrong answer. I would instrument everything first, cluster the failing queries — there are normally two or three patterns, not a hundred — rebuild the eval set from real logged queries, and add refusal.",
      numbers: "Failing queries usually cluster into a handful of patterns. Fixing the top two often recovers most of the perceived quality gap.",
      wrong: "Concluding the model is not good enough and proposing a bigger one. The failures are almost always retrieval, corpus hygiene and unhandled query types.",
      follow: "You have one week. Which of those four do you fix first?"
    },

    {
      id: "rag-39",
      q: "How do you handle a question that needs facts from two different documents?",
      round: ["tech2"],
      level: "5-10",
      tags: ["rag", "multi-hop", "reasoning"],
      why: "Single-shot retrieval fails on multi-hop questions, and most candidates do not notice why.",
      simple:
        "Take: 'Does the leave policy for contractors differ from the one for full-time staff?' The answer lives in two documents, and neither alone is sufficient.\n\n" +
        "Standard retrieval struggles because the query embedding is a blend of both topics and matches neither cleanly. Worse, top-k can fill entirely with chunks from the better-matching document, so one side of the comparison is simply absent — and the model answers confidently from half the evidence.\n\n" +
        "Three approaches.\n\n" +
        "Query decomposition. Split the question into sub-questions, retrieve for each independently, then combine the contexts:\n\n" +
        "    -> What is the leave policy for contractors?\n" +
        "    -> What is the leave policy for full-time staff?\n\n" +
        "Each sub-query is clean and retrieves well. This handles most comparison and multi-part questions, and it is the one I would reach for first.\n\n" +
        "Iterative retrieval. Retrieve, let the model identify what is still missing, retrieve again. Necessary for genuine multi-hop chains where the second query depends on the first result — 'who approves expenses for the department that owns this system' needs the department before you can find its approver.\n\n" +
        "Graph traversal. If entity relationships are explicit, follow edges rather than searching. Powerful for well-defined relational questions, expensive to build.\n\n" +
        "Practical detail: allocate k per sub-question rather than sharing one budget, so each side of a comparison gets guaranteed representation. That single change fixes most comparison failures.\n\n" +
        "And detect these queries rather than decomposing everything — a cheap classifier or the presence of comparison language is enough. Decomposition costs an extra model call and latency, so spend it only where it is needed.",
      points: [
        "Blended queries match neither topic cleanly.",
        "Top-k can fill from one document, hiding half the answer.",
        "Decomposition into sub-questions handles most cases.",
        "Iterative retrieval for true dependent multi-hop chains.",
        "Allocate k per sub-question so each side is represented."
      ],
      say: "A blended query matches neither topic cleanly, and top-k often fills entirely from one document so half the comparison is missing. I decompose into sub-questions, retrieve for each independently with its own k allocation so both sides are guaranteed representation, then combine the contexts. For genuine multi-hop chains where the second query depends on the first answer, I iterate. I detect these queries rather than decomposing every request.",
      numbers: "Allocate k per sub-question rather than sharing one budget. Decomposition adds one model call — roughly 100–300ms with a small model.",
      wrong: "Raising k and hoping both documents appear. It sometimes works, it doubles your input cost, and it fails silently when one document dominates the ranking.",
      follow: "The second question depends on the first answer. Does decomposition still work?"
    },

    {
      id: "rag-40",
      q: "If you could only fix one thing in a badly performing RAG system, what would you check first?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["rag", "debugging", "prioritisation"],
      why: "Forces prioritisation. The answer reveals whether you have actually debugged one of these.",
      simple:
        "Retrieval quality. Specifically: was the correct chunk in the retrieved context at all?\n\n" +
        "That single check splits the problem in two and it takes minutes. Take twenty failing queries, look at what was retrieved, and ask whether the answer was present.\n\n" +
        "If the right chunk was not retrieved, nothing downstream can help. No prompt engineering, no better model, no temperature change. The information was not there. You are looking at chunking, embeddings, query phrasing or filters.\n\n" +
        "If the right chunk was retrieved and the answer is still wrong, retrieval is fine and you look at ranking position, k, the prompt or the model.\n\n" +
        "I lead with this for two reasons. Retrieval failures are the most common cause of bad RAG by a wide margin — most quality problems are retrieval problems, not generation problems. And it is the cheapest diagnostic available; it needs no infrastructure, just reading twenty examples.\n\n" +
        "It is also the check teams skip. The instinct is to tune the prompt, because prompts feel editable and retrieval feels like plumbing. So teams spend a week rewriting instructions for a system that was never given the right context.\n\n" +
        "If pressed for the single most common root cause underneath: chunking that separated the answer from the context that makes it findable — a value split from its heading, a clause split from its scope.\n\n" +
        "The habit worth stating: never debug RAG end to end. Always split retrieval from generation first, because they have different owners, different fixes and different metrics.",
      points: [
        "Check first whether the correct chunk was retrieved at all.",
        "It splits the problem in two in about twenty minutes.",
        "Retrieval is the more common failure by a wide margin.",
        "Teams skip it because prompts feel more editable than plumbing.",
        "The usual root cause is chunking separating answer from context."
      ],
      say: "Whether the correct chunk was retrieved at all. I take twenty failing queries and read what came back. If the answer was not in the context, no prompt or model change can help and I go to chunking, embeddings or filters. If it was there, retrieval is fine and I look at ranking, k and the prompt. It is the cheapest diagnostic available and the one teams skip, because prompts feel editable and retrieval feels like plumbing.",
      numbers: "Twenty failing queries is usually enough to see the pattern. Most RAG quality problems resolve to retrieval rather than generation.",
      wrong: "'I would improve the prompt.' It is the most common instinct and it is the wrong first move — you may be instructing a model that never received the answer.",
      follow: "You check and the right chunk was there every time. Where do you go next?"
    }
  ]
};
