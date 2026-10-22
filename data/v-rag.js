/* Visual explanation: how retrieval-augmented generation answers from your documents.
   Drawn by assets/visual.js - scene format in README.md. The policy, chunks and
   scores are illustrative. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
window.IR.v["rag"] = {
  view: [1290, 680],

  zones: [
    { id: "z-off", x: 16, y: 14, w: 1030, h: 218, label: "Offline: indexing", sub: "runs when documents change", tone: "data" },
    { id: "z-on", x: 16, y: 252, w: 1030, h: 414, label: "Online: answering", sub: "runs for every question", tone: "input" }
  ],

  parts: [
    { id: "docs", kind: "doc", x: 46, y: 70, w: 66, h: 84, count: 3, label: "HR PDFs", tone: "data", concept: "docs" },
    { id: "parse", kind: "box", x: 170, y: 84, w: 150, h: 62, label: "Parse", sub: "text, headings, tables", tone: "neutral", concept: "parse" },
    { id: "chunk", kind: "box", x: 372, y: 84, w: 160, h: 62, label: "Chunk", sub: "≈500 tokens, overlap", tone: "data", concept: "chunk" },
    { id: "chunks", kind: "tokens", dir: "col", x: 588, y: 62, items: ["§4.1 Leave types", "§4.2 Paternity leave", "§4.3 Carry-over"], tone: "data", concept: "chunk" },
    { id: "embed", kind: "box", x: 838, y: 84, w: 160, h: 62, label: "Embed", sub: "embedding model", tone: "model", concept: "embed" },
    { id: "vdb", kind: "db", x: 1080, y: 150, w: 186, h: 138, label: "Vector DB", sub: "vector + text + metadata", tone: "data", concept: "vdb" },

    { id: "question", kind: "msg", x: 36, y: 300, w: 240, role: "Employee", text: "How many days of paternity leave do I get?", tone: "input", concept: "question" },
    { id: "qembed", kind: "box", x: 330, y: 306, w: 140, h: 62, label: "Embed", sub: "same model", tone: "model", concept: "qembed" },
    { id: "retriever", kind: "box", x: 520, y: 298, w: 186, h: 78, label: "Hybrid search", sub: "vectors + BM25 keywords", tone: "data", concept: "hybrid" },
    { id: "reranker", kind: "box", x: 768, y: 298, w: 186, h: 78, label: "Rerank", sub: "cross-encoder · 20 → 5", tone: "model", concept: "rerank" },
    { id: "missR", kind: "box", shape: "pill", x: 520, y: 392, w: 186, h: 30, label: "Retrieval miss?", tone: "guard", hidden: true, concept: "missR" },

    { id: "best", kind: "bars", x: 740, y: 462, w: 296, lw: 160, label: "Best chunks", tone: "data", hidden: true, concept: "topk",
      items: [
        { label: "§4.1 Leave types", value: 0.82 }, { label: "§4.2 Paternity leave", value: 0.79 },
        { label: "§9.4 Travel policy", value: 0.55 }, { label: "§4.3 Carry-over", value: 0.51 }
      ] },
    { id: "prompt", kind: "code", x: 404, y: 442, w: 284, title: "Prompt", tone: "neutral", hidden: true, concept: "prompt",
      lines: [
        "Answer only from CONTEXT.",
        "Cite sources as [n].",
        "If it is not there, say so.",
        "CONTEXT:",
        "[1] §4.2 Paternity leave ...",
        "[2] §4.1 Leave types ...",
        "QUESTION: How many days of",
        "paternity leave do I get?"
      ] },
    { id: "missG", kind: "box", shape: "pill", x: 200, y: 400, w: 172, h: 30, label: "Generation miss?", tone: "guard", hidden: true, concept: "missG" },
    { id: "llm", kind: "box", x: 210, y: 452, w: 150, h: 64, label: "LLM", sub: "writes the answer", icon: "spark", tone: "model", concept: "llm" },
    { id: "answer", kind: "msg", x: 36, y: 560, w: 344, role: "HR bot", text: "You get 15 days of paid paternity leave, to be taken within 6 months of the birth [1].", tone: "output", hidden: true, concept: "answer" }
  ],

  links: [
    { id: "l-docs-parse", from: "docs:r", to: "parse:l", style: "straight" },
    { id: "l-parse-chunk", from: "parse:r", to: "chunk:l", style: "straight" },
    { id: "l-chunk-chunks", from: "chunk:r", to: "chunks:l", tone: "data" },
    { id: "l-chunks-embed", from: "chunks:r", to: "embed:l", tone: "data" },
    { id: "l-embed-db", from: "embed:r", to: "vdb:t", tone: "data", label: "write", labelAt: 0.45 },
    { id: "l-q-qe", from: "question:r", to: "qembed:l", style: "straight", tone: "input" },
    { id: "l-qe-ret", from: "qembed:r", to: "retriever:l", style: "straight", tone: "input" },
    { id: "l-ret-db", from: "retriever:t:0.7", to: "vdb:l:0.85", via: [[650, 268], [1040, 268]], tone: "data", label: "search", labelAt: 0.55 },
    { id: "l-ret-rr", from: "retriever:r", to: "reranker:l", style: "straight", tone: "data" },
    { id: "l-rr-best", from: "reranker:b:0.7", to: "best:t:0.3", style: "straight", tone: "data" },
    { id: "l-best-prompt", from: "best:l", to: "prompt:r:0.35", tone: "data" },
    { id: "l-prompt-llm", from: "prompt:l:0.45", to: "llm:r", tone: "model" },
    { id: "l-llm-ans", from: "llm:b", to: "answer:t:0.6", style: "straight", tone: "output" }
  ],

  steps: [
    { title: "Two halves, one answer",
      text: "RAG has two halves. Offline, your documents are cut into chunks and indexed. Online, each question pulls back the most relevant chunks, and the model answers from them. Follow one HR question through both." },
    { title: "Load and parse the documents",
      text: "The HR policy PDFs are read and turned into clean text. Headings, tables and page numbers are kept, because they help later with search and with citing the right section.",
      focus: ["docs", "parse"], flow: ["l-docs-parse"], packets: [{ on: "l-docs-parse", text: "PDF" }] },
    { title: "Cut the text into chunks",
      text: "The text is cut into chunks of a few hundred tokens, each overlapping the next a little, ideally along section boundaries. A chunk is the unit you retrieve, so its size decides what the model gets to read.",
      focus: ["chunk", "chunks"], flow: ["l-parse-chunk", "l-chunk-chunks"],
      packets: [{ on: "l-parse-chunk", text: "text" }, { on: "l-chunk-chunks", text: "3 chunks" }] },
    { title: "Turn each chunk into a vector",
      text: "An embedding model turns every chunk into a vector - a list of numbers that captures its meaning. Chunks about leave end up close to each other, far from chunks about travel claims.",
      focus: ["chunks", "embed"], flow: ["l-chunks-embed"], hl: { chunks: [1] },
      packets: [{ on: "l-chunks-embed", text: "§4.2" }] },
    { title: "Store vectors with their text",
      text: "Each vector is stored in a vector database together with the chunk's text and metadata: document, section, country, date. Metadata lets you filter later, for example to India's policy only.",
      focus: ["embed", "vdb"], flow: ["l-embed-db"], packets: [{ on: "l-embed-db", text: "vector + text" }] },
    { title: "A question arrives",
      text: "An employee asks **How many days of paternity leave do I get?** The question is embedded with the same model used for the chunks, so both live in the same space of meaning.",
      focus: ["question", "qembed"], flow: ["l-q-qe"], packets: [{ on: "l-q-qe", text: "question" }] },
    { title: "Search two ways at once",
      text: "Hybrid search runs a vector search for meaning and a BM25 keyword search for exact words like **paternity**, then merges the two lists. About 20 candidate chunks come back.",
      focus: ["retriever", "vdb", "best"], flow: ["l-qe-ret", "l-ret-db"],
      packets: [{ on: "l-qe-ret", text: "vector" }, { on: "l-ret-db", text: "query" }, { on: "l-ret-db", text: "top 20", rev: true }],
      set: { best: { hidden: false } } },
    { title: "Rerank the candidates",
      text: "A reranker reads the question and each candidate together and scores how well the chunk actually answers it. **§4.2 Paternity leave** jumps to the top; the travel policy drops away. Only the best five go forward.",
      focus: ["reranker", "best"], flow: ["l-ret-rr", "l-rr-best"], hl: { best: [0] },
      packets: [{ on: "l-ret-rr", text: "20" }, { on: "l-rr-best", text: "5" }],
      set: { best: { items: [
        { label: "§4.2 Paternity leave", value: 0.96 }, { label: "§4.1 Leave types", value: 0.64 },
        { label: "§4.3 Carry-over", value: 0.31 }, { label: "§9.4 Travel policy", value: 0.08 }
      ] } } },
    { title: "Build the prompt",
      text: "The best chunks are pasted into the prompt with numbered sources, under strict instructions: answer only from this context, cite the source, and say so if the answer is not there.",
      focus: ["best", "prompt"], flow: ["l-best-prompt"], hl: { prompt: [0, 4] },
      packets: [{ on: "l-best-prompt", text: "chunks" }], set: { prompt: { hidden: false } } },
    { title: "Generate a grounded answer",
      text: "The model reads the prompt and writes the answer from the context, citing **[1]**. The employee can click the citation to check the policy themselves.",
      focus: ["prompt", "llm", "answer"], flow: ["l-prompt-llm", "l-llm-ans"],
      packets: [{ on: "l-prompt-llm" }, { on: "l-llm-ans", text: "answer" }], set: { answer: { hidden: false } } },
    { title: "Where it goes wrong",
      text: "A bad answer has two possible causes. Either retrieval never found the right chunk, or the model had it and still answered badly. Measure each half separately, or you will fix the wrong one.",
      focus: ["retriever", "missR", "llm", "missG"], set: { missR: { hidden: false }, missG: { hidden: false } } }
  ],

  concepts: {
    docs: {
      title: "Your documents",
      tip: "The private or recent knowledge the model was never trained on - here, the company's HR policy PDFs.",
      detail: [
        "A language model only knows what was in its training data, and that stops at a cut-off date. It has never seen your company's HR policy, your product manuals or yesterday's price list. RAG gives it that knowledge at question time instead of trying to teach it in advance.",
        "The sources can be PDFs, wiki pages, tickets, emails or database rows. Each has its own quirks: scanned PDFs need OCR, tables need special handling, and wiki pages repeat the same menu text on every page.",
        "Document quality sets the ceiling for the whole system. If two versions of the leave policy are both indexed, the bot will sometimes quote the old one. Cleaning, de-duplicating and versioning the sources is unglamorous work that fixes more bad answers than any model change."
      ],
      oneLiner: "RAG brings in knowledge the model never saw in training - private or recent documents - and the quality of those sources caps the quality of the answers."
    },
    parse: {
      title: "Parsing",
      tip: "Turns files into clean text while keeping the structure - headings, tables, page numbers - that search and citations need later.",
      detail: [
        "Parsing turns each file into plain text the rest of the pipeline can use. For the HR PDFs that means pulling out the words in reading order, keeping headings such as \"4.2 Paternity leave\", and turning tables into text a model can read.",
        "It sounds simple, but it is where many RAG systems quietly fail. Two-column layouts get read across the columns, headers and footers repeat on every page, and tables collapse into a jumble of numbers. Layout-aware parsers and OCR for scanned pages help.",
        "Keep the structure as metadata: file name, section title, page number. The section title helps search find the right chunk, and the page number lets the answer cite exactly where the fact came from."
      ],
      oneLiner: "Parsing turns files into clean text plus structure - headings, tables, page numbers - and bad parsing silently ruins retrieval later."
    },
    chunk: {
      title: "Chunking",
      tip: "Cuts long text into small pieces - often a few hundred tokens, overlapping slightly - because a chunk is what gets retrieved.",
      detail: [
        "A whole policy document is too long to put into every prompt, and too broad to match a specific question. So the text is cut into chunks, here one per section: \"Leave types\", \"Paternity leave\", \"Carry-over\". Search later returns chunks, not documents.",
        "Common settings are 200 to 1,000 tokens per chunk with 10-20% overlap, so a sentence cut at the edge still appears whole in one of the chunks. Splitting along headings and paragraphs (structure-aware chunking) usually beats cutting every N tokens blindly.",
        "Size is a trade-off. Small chunks match questions precisely but can lose context - \"15 days\" without saying what the days are for. Large chunks carry context but dilute the match and fill the prompt with noise. Test a few sizes against real questions instead of guessing."
      ],
      oneLiner: "Chunks are the unit of retrieval; their size trades precise matching against enough context, so pick it by testing on real questions."
    },
    embed: {
      title: "Embedding the chunks",
      tip: "An embedding model turns each chunk into a vector - a list of numbers that captures its meaning - so similar text ends up close together.",
      detail: [
        "An embedding model reads a chunk and outputs a vector, typically 384 to 3,072 numbers. The model is trained so that texts with similar meaning get similar vectors. \"Paternity leave\" and \"time off when your baby is born\" land near each other even though they share no words.",
        "This runs offline, once per chunk, and again whenever a document changes. Indexing thousands of pages takes minutes, and the embedding cost is small compared with generation.",
        "Choosing the model matters: check how it performs on your language and domain, its maximum input length and its vector size. Changing the embedding model later means re-embedding every chunk, because vectors from different models cannot be compared."
      ],
      oneLiner: "Each chunk is embedded once, offline, into a vector that captures meaning; switching the embedding model later means re-indexing everything."
    },
    vdb: {
      title: "Vector database",
      tip: "Stores each chunk's vector with its text and metadata, and finds the vectors closest to a query in milliseconds.",
      detail: [
        "The vector database keeps three things per chunk: the vector, the original text, and metadata such as document, section, country and date. At question time it finds the stored vectors closest to the question's vector.",
        "Comparing against every vector would be too slow at scale, so it uses an approximate nearest-neighbour index such as HNSW, which finds very close matches in milliseconds by walking a graph instead of checking everything.",
        "Metadata filters are what make it usable in a company. An employee in India should get India's policy, not the UK one, and nobody should retrieve documents they are not allowed to see. Apply those filters in the search itself, not after the answer is written."
      ],
      oneLiner: "The vector database stores vectors with text and metadata and does fast approximate nearest-neighbour search, with metadata filters for scope and access."
    },
    question: {
      title: "The question",
      tip: "The user's question, in their own words. Often it needs no change; sometimes it is rewritten to make search work better.",
      detail: [
        "The employee types \"How many days of paternity leave do I get?\". This text is all the system knows about what they want, so it is used both to search and, later, inside the prompt.",
        "Real questions are often vague, misspelt or depend on earlier chat - \"and for adoption?\". Many systems first rewrite the question into a standalone search query, or split a compound question into parts, before retrieving.",
        "Who is asking matters as much as what is asked. The user's country, role and permissions become metadata filters, so the search only looks at documents this person is allowed to see."
      ],
      oneLiner: "The question drives both search and the prompt; vague or follow-up questions are often rewritten into a standalone query first."
    },
    qembed: {
      title: "Embedding the question",
      tip: "The question is turned into a vector with the same embedding model used for the chunks, so the two can be compared.",
      detail: [
        "To find chunks with similar meaning, the question must become a vector in the same space as the chunk vectors. That only works if it is embedded by the same model - ideally the same version, with the same settings.",
        "Some embedding models expect a short instruction or prefix on queries, such as \"query: \", and a different one on documents. Missing it quietly lowers search quality.",
        "This step runs for every question, so it adds a few tens of milliseconds. It is cheap, but it is the reason a model upgrade on one side alone breaks retrieval: old chunk vectors and new question vectors no longer line up."
      ],
      oneLiner: "The question is embedded with the same model as the chunks; mix models or versions and the vectors stop being comparable."
    },
    hybrid: {
      title: "Hybrid search",
      tip: "Runs a vector search for meaning and a keyword (BM25) search for exact words, then merges the two result lists.",
      detail: [
        "Vector search is good at meaning: it finds \"time off for new fathers\" for a paternity question. But it can miss exact terms - policy codes, product names, acronyms - which keyword search finds easily. Hybrid search runs both.",
        "BM25 is the classic keyword ranking: it scores a chunk higher when it contains the question's rarer words, like \"paternity\", several times. The two ranked lists are merged, often with Reciprocal Rank Fusion, which rewards chunks that rank well in either list.",
        "Hybrid search usually beats either method alone, especially on enterprise text full of codes and names. It returns a generous list - say the top 20 - because the next step, reranking, will pick the best few."
      ],
      oneLiner: "Hybrid search combines vector search for meaning with BM25 for exact terms, then merges the lists - usually better than either alone."
    },
    rerank: {
      title: "Reranker",
      tip: "A slower, more careful model that reads the question and each candidate together and scores how well the chunk answers it.",
      detail: [
        "First-stage search compares vectors that were made separately, so it is fast but rough. A reranker, usually a cross-encoder, reads the question and one candidate chunk together and gives a relevance score. That is far more accurate, because it sees exactly how the two relate.",
        "It is too slow to run over millions of chunks, so it only rescores the top 20 or so from hybrid search and keeps the best 3-5. Here it pushes \"§4.2 Paternity leave\" to the top and drops the travel policy.",
        "Reranking often gives one of the biggest quality jumps in a RAG system for a small cost: tens to a few hundred milliseconds. It also means fewer, better chunks in the prompt, which saves tokens and reduces distraction."
      ],
      oneLiner: "A cross-encoder reranker rescores the top candidates by reading question and chunk together, trading a little latency for much better precision."
    },
    topk: {
      title: "The best chunks",
      tip: "The handful of chunks that will go into the prompt, with their relevance scores. Only these are what the model gets to read.",
      detail: [
        "After reranking, only the top few chunks survive - here the paternity leave section, followed by the general leave types. Everything else is dropped. The model will never see a chunk that did not make this list.",
        "How many to keep is a trade-off. Too few and you might drop the one chunk that held the answer. Too many and the prompt fills with noise, costs more, and models tend to pay less attention to material in the middle of a long context.",
        "A score threshold helps: if even the best chunk scores low, the honest answer is \"I could not find this in the policy\" rather than letting the model guess."
      ],
      oneLiner: "Only the top few reranked chunks reach the prompt; keep enough to include the answer and few enough to avoid noise, with a threshold for 'not found'."
    },
    prompt: {
      title: "The prompt",
      tip: "Instructions, numbered context chunks and the question, assembled into one input that tells the model to answer only from the context.",
      detail: [
        "The prompt joins three parts: instructions, the retrieved chunks numbered as sources, and the user's question. The instructions are strict: answer only from the context, cite the source number, and say you do not know if the answer is missing.",
        "Numbering the chunks makes citations possible, and putting the most relevant chunk first helps, because models attend best to the start and end of a long context.",
        "The retrieved text is data, not instructions. A document that says \"ignore your rules\" must not be obeyed, so mark the context clearly and never let it override the system instructions."
      ],
      oneLiner: "The prompt combines strict instructions, numbered retrieved chunks and the question, so the model answers only from the context and cites its sources."
    },
    llm: {
      title: "Generation",
      tip: "The language model reads the prompt and writes the answer, using the retrieved chunks as its evidence.",
      detail: [
        "The model now has the question and the relevant policy text side by side. Its job is closer to reading comprehension than recall: find the answer in the context and phrase it clearly.",
        "Even with the right chunk, models can still go wrong - mixing in general knowledge (\"most companies give 2 weeks\"), merging two numbers, or ignoring a condition such as \"within 6 months\". A low temperature and clear instructions reduce this.",
        "Generation is usually the slowest and most expensive step, so the prompt size matters: five well-chosen chunks cost less and often give better answers than twenty mediocre ones."
      ],
      oneLiner: "The model answers from the retrieved context like a reading-comprehension task; it can still drift, so instructions, low temperature and fewer, better chunks matter."
    },
    answer: {
      title: "Grounded answer with citations",
      tip: "The answer, tied to the source it came from, so the user can check it and you can measure whether it is supported.",
      detail: [
        "The bot answers \"You get 15 days of paid paternity leave, to be taken within 6 months of the birth [1]\". The [1] points to section 4.2 of the policy, so the employee can open the source and check.",
        "Citations build trust and make errors visible. If the answer cites a section that does not say it, something is wrong, and both users and automated checks can spot it.",
        "Grounded means every claim is supported by the retrieved text. In production you can check this automatically by asking a second model whether each sentence is backed by the cited chunk, and flag the answers that are not."
      ],
      oneLiner: "A grounded answer only states what the retrieved text supports and cites it, which lets users verify it and lets you check faithfulness automatically."
    },
    missR: {
      title: "Retrieval miss",
      tip: "The right chunk never reached the prompt, so the model could not possibly answer well. Measure it with recall@k on a test set.",
      detail: [
        "If section 4.2 was never retrieved, the model either says it does not know or, worse, guesses. No prompt change can fix this, because the problem happened before the model was involved.",
        "Common causes are poor parsing, chunks cut in the wrong places, a weak embedding model for your domain, missing keyword search for exact terms, or a metadata filter that excluded the right document.",
        "Measure it on a set of real questions where you know which chunk holds the answer. Recall@k asks: was the right chunk anywhere in the top k? MRR asks how high it ranked. Fix retrieval until these are high before tuning the prompt."
      ],
      oneLiner: "A retrieval miss means the right chunk never reached the prompt; measure it with recall@k and MRR on a labelled question set and fix it before the prompt."
    },
    missG: {
      title: "Generation miss",
      tip: "The right chunk was in the prompt, but the model still answered wrongly or added things it was not given. Measure faithfulness.",
      detail: [
        "Sometimes the correct section was retrieved and the answer is still wrong: the model misread a condition, mixed two numbers, or added general knowledge that is not in your policy. That is a generation failure.",
        "Fixes live on the generation side: clearer instructions, fewer and better-ordered chunks, a lower temperature, or a stronger model.",
        "Measure it with faithfulness (is every claim supported by the context?) and answer relevance (does it answer the question asked?), often scored by an LLM judge that you have checked against human ratings. Looking at retrieval and generation separately tells you which half to fix."
      ],
      oneLiner: "A generation miss means the context was right but the answer was not; measure faithfulness and relevance separately from retrieval so you fix the right half."
    }
  }
};
