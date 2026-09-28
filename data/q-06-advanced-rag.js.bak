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
      "quick": [
        "Query rewriting turns a messy message into a clear search.",
        "It resolves follow-ups, adds other wordings, or splits questions.",
        "It adds an extra call of about 100 to 300 milliseconds.",
        "Always rewrite follow-up questions in a chat.",
        "Add extra wordings only when the first search looks weak."
      ],
      "simple": "Query rewriting is a model call placed before retrieval that turns what the user typed into something searchable. Users write things like 'is that covered', which retrieve nothing useful, because half the meaning sits in the previous turn.\n\nThe rewrite can resolve references, so 'is that covered' becomes 'is dental treatment covered under the GOLD plan'. It can also expand the query into a few phrasings, or split a two-part question into two searches. A small, fast model is plenty, but it still adds 100 to 300 milliseconds, so the version that earns its cost is conditional. For example, in a multi-turn HR chat you always resolve references, but you only run expansion when the first retrieval scores poorly.\n\nAlso check that the rewrite never drops something exact the user typed, such as a part number, or it retrieves worse than the original.",
      "points": [
        "Reference resolution - essential in multi-turn chat. Cheap and high value.",
        "Multi-query expansion - several phrasings, merged results. Costs a call plus n retrievals.",
        "Decomposition - split a compound question into separate searches.",
        "Every rewrite adds latency to every query unless you gate it.",
        "Gate on first-pass retrieval quality (a reranker score beats raw cosine), so you only pay when retrieval was weak.",
        "Use a small fast model here. This step does not need your best one."
      ],
      "diagram": {
        "alt": "Query rewriting flow: always resolve references, retrieve, and expand the query only when the reranker score is weak.",
        "rows": [
          [
            {
              "id": "q",
              "label": "User message",
              "note": "\"is that covered?\""
            }
          ],
          [
            {
              "id": "r",
              "label": "Resolve references",
              "note": "always, in chat",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "s",
              "label": "Retrieve + rerank"
            }
          ],
          [
            {
              "id": "a",
              "label": "Answer",
              "accent": "accent"
            },
            {
              "id": "e",
              "label": "Expand query",
              "note": "2-3 phrasings, costs a call",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "r"
          },
          {
            "from": "r",
            "to": "s"
          },
          {
            "from": "s",
            "to": "a",
            "label": "score good"
          },
          {
            "from": "s",
            "to": "e",
            "label": "score weak"
          }
        ],
        "caption": "**Rewrite conditionally.** Always resolve references in chat; pay for expansion only when the reranker score says the first pass was weak."
      },
      "say": "Query rewriting is a cheap model call before retrieval that turns what the user typed into something searchable, and it only pays off when you gate it. Users write things like is that covered, where half the meaning sits in the previous turn. A rewrite turns that into is dental treatment covered under the GOLD plan, which actually retrieves. The same step can expand a query into a few phrasings and merge the results, or split a two-part question into two searches. The catch is latency. A small model adds roughly 100 to 300 milliseconds, and without a gate every query pays it. So in multi-turn chat I always resolve references, because that failure is guaranteed. Expansion only runs when a reranker score says the first pass was weak, since raw cosine is poorly calibrated across queries. I also check the rewrite never drops a part number the user typed. A small, fast model is plenty here.",
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
      "quick": [
        "HyDE has a model write a fake answer, then searches with it.",
        "A fake answer looks more like real documents than a question.",
        "It helps short questions against long written documents.",
        "It is slow, and made-up details can mislead the search.",
        "Try keyword search and careful re-sorting first."
      ],
      "simple": "HyDE stands for hypothetical document embeddings. A short question and a long document look like different kinds of text, so comparing their embeddings is comparing unlike things.\n\nSo instead of embedding the question, you ask a model to write a fake answer, which doesn't have to be correct, and embed that. The fake answer looks like a document, so it lands nearer to real documents and retrieval improves. But it puts a full generation before every retrieval, often 500 milliseconds or more, and the fake answer can hallucinate details. For example, if it invents a plausible but wrong product name, retrieval drifts towards documents about the wrong product.\n\nSo I would rarely reach for it first. Hybrid search and a reranker are cheaper and often win. If short questions still miss long documents, HyPE moves the generation to index time instead.",
      "points": [
        "Embeds a generated fake answer instead of the question, to match document-shaped text.",
        "Helps most on short questions against long prose documents.",
        "Costs a full generation before every retrieval - real latency.",
        "Hallucinated specifics can actively misdirect retrieval.",
        "Hybrid search and reranking are cheaper and often beat it."
      ],
      "say": "HyDE, or hypothetical document embeddings, embeds a model-written fake answer instead of the question, and I'd rarely reach for it first. The logic is that questions and documents are different kinds of text. A fake answer looks like a document even when it's wrong, so it lands nearer the real ones in embedding space. It genuinely helps when questions are short, documents are long prose, and there's no labelled data to tune anything else. The price is a full generation on the critical path before every search, often half a second to several seconds, which can be the whole latency budget. It also misfires on specifics. If the fake answer invents a plausible product name, retrieval drifts to documents about the wrong product. So I try hybrid search and a reranker first, because they're cheaper and often win. If short questions still miss long prose after that, I'd look at HyPE, which moves the generation to index time.",
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
      "quick": [
        "The difference is when the question and document meet.",
        "A bi-encoder turns each into numbers separately, fast but rough.",
        "A cross-encoder reads both together, accurate but slow.",
        "ColBERT matches word by word, but needs a much bigger index.",
        "Fetch with a bi-encoder, then re-sort with a cross-encoder."
      ],
      "simple": "Bi-encoders, cross-encoders and ColBERT all score how similar a query is to a document. The difference is when the two meet inside the model, and that decides the trade-off between speed and accuracy.\n\nA bi-encoder encodes them separately, so documents are embedded once in advance and search stays fast over millions of them, but each document is squeezed into one vector and details get lost. A cross-encoder reads the query and document together, so every word can look at every other word. That is much more accurate, but nothing can be pre-computed, so it runs once per document per query. ColBERT is the middle path, pre-computing one vector per token and matching each query token to its best document token, at the cost of a much bigger index.\n\nFor example, a standard stack uses a bi-encoder plus BM25 to fetch candidates, then a cross-encoder to rerank the top 20 to 100.",
      "points": [
        "**Bi-encoder:** separate encoding, one vector each, pre-computed - fast, less precise. First-stage retrieval.",
        "**Cross-encoder:** query + document together, one score - most accurate, slow, nothing pre-computed. Reranking.",
        "**ColBERT:** one vector per token, MaxSim scoring - more precise than a bi-encoder, much cheaper than a cross-encoder, but a far bigger index.",
        "Standard pipeline: bi-encoder + BM25 → cross-encoder rerank on the top 20–100."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Bi-encoder, ColBERT and cross-encoder compared on when query and document meet, what is stored, speed and use.",
        "aspects": [
          "Query and doc meet",
          "Pre-computed",
          "Speed",
          "Used for"
        ],
        "columns": [
          {
            "label": "Bi-encoder",
            "note": "two forms compared",
            "accent": "accent",
            "cells": [
              "Only at the end",
              "One vector per doc",
              "Fastest, millions of docs",
              "First-stage retrieval"
            ]
          },
          {
            "label": "ColBERT",
            "note": "late interaction",
            "cells": [
              "Token by token, MaxSim",
              "One vector per token",
              "Middle, big index",
              "Sharper first stage"
            ]
          },
          {
            "label": "Cross-encoder",
            "note": "they sit and talk",
            "accent": "warn",
            "cells": [
              "Right at the start",
              "Nothing",
              "Slow, once per doc",
              "Rerank top 20-100"
            ]
          }
        ],
        "caption": "The difference is **when the query and document meet**. Standard stack: bi-encoder plus BM25 to fetch, cross-encoder to rerank."
      },
      "say": "All three score how well a query matches a document, and they differ in when the two meet. A bi-encoder encodes them separately, so every document is embedded once in advance and search stays fast across millions. The catch is a whole chunk squeezed into one vector loses fine detail. A cross-encoder feeds the query and document through the model together, so every query word can look at every document word. That's the most accurate, but nothing can be pre-computed, so it's only for re-scoring a short list. ColBERT sits in between. It pre-computes one vector per document token, and at query time each query token takes its best match, which is called MaxSim. You get far more detail than one vector at a fraction of cross-encoder cost, but the index is much bigger. My default is a bi-encoder plus BM25 to fetch candidates, then a cross-encoder reranking the top 20 to 100. ColBERT earns its storage when the first stage needs to be sharper.",
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
      "quick": [
        "A reranker fixes the order, not what was found.",
        "It can move a found piece from eighth place to first.",
        "It cannot rescue a piece that search never found.",
        "Check how often search finds the answer at 20, 50 and 100.",
        "Rerank the smallest number where gains stop, often about 50."
      ],
      "simple": "A reranker fixes the order, not the haul. It is usually a cross-encoder that reads the question and each candidate together, so it judges relevance far better than the embedding model, but it can only promote a chunk the first stage already found.\n\nFor example, if the right policy clause was retrieved but came back eighth, the reranker moves it to the top. What it cannot fix is a chunk that was never retrieved, because of bad chunking, a missing document or a question that needs two lookups. Those are recall problems, fixed upstream.\n\nSizing matters because each candidate is a separate model pass, and reranking 20 to 50 typically adds about 50 to 300 milliseconds. So measure first-stage recall at 20, 50 and 100, and rerank the smallest number where recall stops rising. If recall@100 is still low, stop tuning the reranker and fix retrieval.",
      "points": [
        "Bi-encoder: separate encodings, precomputable, fast, less precise.",
        "Cross-encoder: joint encoding of the pair, precise, nothing precomputable.",
        "Therefore two stages - recall cheaply, then reorder precisely.",
        "Size N from first-stage recall@20/50/100 - rerank where recall flattens. Latency scales with N.",
        "It fixes ranking, not recall. If the right chunk was not in the fifty, it cannot help."
      ],
      "diagram": {
        "alt": "A missed chunk never reaches the reranker; the reranker only reorders the first-stage top 50 into a top 5.",
        "rows": [
          [
            {
              "id": "c",
              "label": "Corpus"
            }
          ],
          [
            {
              "id": "m",
              "label": "Missed chunk",
              "note": "recall problem",
              "accent": "bad"
            },
            {
              "id": "f",
              "label": "First stage",
              "note": "top 50 = the haul"
            }
          ],
          [
            {
              "id": "r",
              "label": "Reranker",
              "note": "reorders only",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "t",
              "label": "Top 5 to model",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "c",
            "to": "f",
            "label": "retrieved"
          },
          {
            "from": "c",
            "to": "m",
            "label": "not found"
          },
          {
            "from": "f",
            "to": "r"
          },
          {
            "from": "r",
            "to": "t",
            "label": "8th to 1st"
          }
        ],
        "caption": "A reranker **fixes the order, not the haul**. If the right chunk is not in the candidates, fix retrieval upstream."
      },
      "say": "A reranker fixes the order, not the haul, because it can only promote chunks the first stage already returned. It's usually a cross-encoder that reads the question and each chunk together, so it judges relevance much better than embeddings do. Say the right policy clause came back eighth and the model never used it. The reranker moves it to the top, and that's exactly the problem it solves. What it can't fix is a chunk that was never retrieved, whether from bad chunking, a missing document, an exact code the embeddings blurred, or a question needing two lookups. Those are recall problems, and they're fixed upstream. To size it, I measure first-stage recall at 20, 50 and 100 and rerank the smallest number where recall stops climbing, since every candidate is another model pass. Fifty is a common default. If recall at 100 is still low, I stop tuning the reranker and go fix retrieval.",
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
      "quick": [
        "Quantization stores each number in the index with fewer bits.",
        "One byte instead of four makes it four times smaller.",
        "One bit per number is 32 times smaller but less accurate.",
        "Re-check the top 100 with full numbers to regain accuracy.",
        "Always compare search quality before and after."
      ],
      "simple": "Quantisation means storing each number in a vector with fewer bits, so the index fits in cheaper memory. Vector search is fastest in RAM, and RAM is expensive. For example, 10 million chunks at 1,024 dimensions in float32 come to about 41 GB of raw vectors.\n\nScalar or int8 quantisation turns each 4-byte float into one byte, so that becomes about 10 GB with very little quality loss. Binary quantisation keeps one bit per dimension, 32 times smaller, but quality drops more. Product quantisation replaces pieces of the vector with codebook IDs for very high compression. Rescoring makes the aggressive options work, because you search the compressed vectors for the top 100, then re-score only those with the full vectors kept on disk.\n\nWhatever you pick, compare recall before and after on your eval set, because quantising blind is how the right chunk quietly drops out.",
      "points": [
        "Memory = vectors × dimensions × bytes per number. 10M × 1,024 × 4 B ≈ 41 GB.",
        "int8: 4x smaller, small loss. Binary: 32x smaller, bigger loss. PQ: very high compression.",
        "Rescore the top candidates with full-precision vectors to win back accuracy.",
        "Matryoshka truncation shortens the vector; combine it with quantization. Check recall on your eval set."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Storage for 10 million 1,024-dimension vectors as float32, int8 and binary, with quality loss for each.",
        "aspects": [
          "Per number",
          "10M x 1,024 dims",
          "Quality loss",
          "Speed"
        ],
        "columns": [
          {
            "label": "float32",
            "note": "full precision",
            "accent": "muted",
            "cells": [
              "4 bytes",
              "About 41 GB",
              "None",
              "Baseline"
            ]
          },
          {
            "label": "int8",
            "note": "scalar",
            "accent": "accent",
            "cells": [
              "1 byte",
              "About 10 GB",
              "Usually very small",
              "Faster"
            ]
          },
          {
            "label": "Binary",
            "note": "1 bit per dimension",
            "accent": "warn",
            "cells": [
              "1 bit",
              "About 1.3 GB",
              "Bigger, rescore it",
              "Very fast bit counts"
            ]
          }
        ],
        "caption": "**Fewer bits per number, then rescore** the top 100 with full vectors kept on disk. Always compare recall before and after."
      },
      "say": "Quantisation stores each number in fewer bits, so the index fits in cheaper memory, and rescoring wins back most of the accuracy. Ten million chunks at 1,024 dimensions in float32 is about 41 gigabytes of raw vectors, and search wants that in RAM. Int8 uses one byte per number instead of four, so that becomes about 10 gigabytes with very little quality loss. Binary keeps one bit per dimension, roughly 1.3 gigabytes with very fast comparisons, but it loses more and suits some embedding models better than others. Product quantisation compresses harder still. Rescoring is what makes the aggressive options work. I search the compressed vectors for the top hundred, then re-score just those with full-precision vectors kept on disk. Matryoshka embeddings shorten the vector instead, and the two combine. Whatever I pick, I compare recall before and after on the eval set, because quantising blind is how the right chunk quietly drops out of the top k.",
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
      "quick": [
        "The second search needs the answer from the first.",
        "One search finds half the facts, yet the answer sounds sure.",
        "Search in steps, building each search from the last answer.",
        "Stop after two or three steps.",
        "If two facts always go together, join them when loading."
      ],
      "simple": "A multi-hop question is one where the second search needs the answer to the first, so you search in steps, not in one shot. The failure hides well, because retrieval returns relevant-looking chunks and the model answers confidently, but the second fact was never retrieved.\n\nFor example, 'is the manager of the Pune claims team eligible for the new allowance?' first needs the manager and their grade, and only then the allowance rule for that grade. Raising k doesn't help, because the second fact isn't near the question in embedding space. Iterative retrieval fixes this with a loop: retrieve, extract what you now know, then write the next query with it. And if the two facts always travel together, joining them into one chunk at ingestion costs nothing at query time.\n\nCap any loop at two or three hops, and put multi-hop questions in your eval set.",
      "points": [
        "Symptom: confident answers built on half the facts. It rarely looks like a retrieval failure.",
        "Dependent chains need sequential steps, each query built from the previous answer. Parallel decomposition only suits independent parts.",
        "Iterative retrieval - an agentic loop, capped at two or three hops.",
        "Structural fix - join facts at ingestion if they always co-occur.",
        "Your eval set must contain multi-hop questions, or you will never see this."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Multi-hop retrieval in steps: find the manager, extract name and grade, build the next query, retrieve the rule, answer.",
        "lanes": [
          {
            "label": "Retrieve hop 1",
            "note": "who manages Pune claims?"
          },
          {
            "label": "Extract facts",
            "note": "name and grade"
          },
          {
            "label": "Build next query",
            "note": "allowance for that grade",
            "accent": "warn"
          },
          {
            "label": "Retrieve hop 2",
            "note": "cap at 2-3 hops"
          },
          {
            "label": "Answer",
            "note": "both facts in hand",
            "accent": "accent"
          }
        ],
        "caption": "When the second search needs the first answer, **search in steps**, each query built from the last. One search finds half the facts."
      },
      "say": "I retrieve in steps, because one search on the raw question finds half the facts at best. This failure hides well. The chunks look relevant and the model answers confidently, but the second fact was never retrieved. Take is the manager of the Pune claims team eligible for the new allowance. First you need the manager and their grade from one source, and only then can you fetch the allowance rule for that grade from another. So I run a short loop. Retrieve, let the model extract what it now knows, build the next query from it, and cap it at two or three hops, because past that the corpus usually can't answer anyway. Raising k doesn't fix it, since the second fact isn't near the question in embedding space. If two facts always travel together, I join them at ingestion instead, which costs nothing at query time. And the eval set needs multi-hop questions, or this failure never shows up.",
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
      "quick": [
        "Agentic RAG lets the model decide when and where to search.",
        "It helps multi-step questions, many sources and self-correction.",
        "It needs many model calls, so it is slower and costlier.",
        "Cap it at two or three searches.",
        "Send simple questions down the cheap fixed path."
      ],
      "simple": "Standard RAG retrieves once and then answers. Agentic RAG lets the model decide whether to retrieve at all, which source to search, whether the results are good enough, and whether to search again with a different query.\n\nThat freedom helps with multi-hop questions, where one fact is needed to look up the next, with choosing between several sources such as a policy corpus, a database and an API, and with self-correction when the documents don't answer the question. The costs are the usual agent costs: several model calls, varying paths and harder debugging. For example, a three-step agentic path costs roughly three times the model calls of single-shot RAG.\n\nSo bound it. Use it only where the question genuinely needs multiple steps, cap the loop at two or three retrievals, trace every step, and let a router send simple questions down the cheap single-shot path.",
      "points": [
        "The model decides whether, where and how many times to retrieve.",
        "Worth it for multi-hop, multi-source, and self-correcting retrieval.",
        "Multiplies latency and cost - several calls where there was one.",
        "Cap retrieval loops at two or three. Uncapped, it is a runaway.",
        "Route simple questions past it. Most traffic does not need it.",
        "Needs tracing, or you cannot explain why one answer was slow and wrong."
      ],
      "diagram": {
        "alt": "A router sends simple questions down cheap single-shot RAG and multi-step questions to a capped agent loop.",
        "rows": [
          [
            {
              "id": "q",
              "label": "Question"
            }
          ],
          [
            {
              "id": "r",
              "label": "Router",
              "note": "by question type",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "s",
              "label": "Single-shot RAG",
              "note": "most traffic, one call",
              "accent": "accent"
            },
            {
              "id": "g",
              "label": "Agent loop",
              "note": "multi-hop, multi-source",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "a",
              "label": "Answer"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "r"
          },
          {
            "from": "r",
            "to": "s",
            "label": "simple"
          },
          {
            "from": "r",
            "to": "g",
            "label": "multi-step"
          },
          {
            "from": "s",
            "to": "a"
          },
          {
            "from": "g",
            "to": "a",
            "label": "max 2-3 retrievals"
          }
        ],
        "caption": "**Bound the agent.** Route simple questions past it and cap the loop, or three times the model calls becomes your default cost."
      },
      "say": "Agentic RAG lets the model decide whether to retrieve, where to search and whether to search again, instead of retrieving once and answering. It's worth that in three cases. Multi-hop questions, where one fact is needed to look up the next. Multiple sources, where the right move is choosing between a policy corpus, a database and a live API. And self-correction, where the model notices the documents don't answer the question and tries a different query. The costs are the usual agent costs. A three-step path is roughly three times the model calls, so latency and spend multiply, the same question can take different paths, and debugging gets much harder. So I bound it. The loop is capped at two or three retrievals, every step is traced, and a router in front sends simple questions straight down the cheap single-shot path. Most traffic is simple, and if the agent becomes the default path, its cost becomes the default cost.",
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
      "quick": [
        "The model chooses whether, what and how often to search.",
        "Give the search tool a clear name and description.",
        "Allow useful filters and return short results with sources.",
        "Set limits on steps, cost and time, and check the path.",
        "For simple lookups, a fixed pipeline is faster and cheaper."
      ],
      "simple": "In classic RAG, retrieval is a fixed step, so we always search once and then answer. In agentic RAG, search becomes one tool the model can call zero, one or five times, alongside tools like SQL or web search, like a researcher who decides what to look up and looks again when something is missing.\n\nThat changes what you design. The tool needs a clear name and description, because that is all the model decides from. For example, 'search_hr_policies: searches company HR documents; use for leave, benefits and conduct questions' works far better than 'search docs'. You also need stopping rules, such as a step limit and a token budget, and evaluation that checks the path.\n\nBut an agent loop commonly takes 5 to 30 seconds against about 1 to 3 for a fixed pipeline. So simple lookups belong in a fixed pipeline, and a router sends only multi-step questions to the agent.",
      "points": [
        "Retrieval becomes a tool call: the model chooses whether, what and how often to search.",
        "Design the tool: clear name and description, useful filters, compact results with sources.",
        "Add budgets - max steps, tokens, time - and evaluate the path, not only the answer.",
        "Wrong for simple lookups, tight latency or cost, and processes that must be predictable - route instead."
      ],
      "say": "Once retrieval is a tool, the model chooses whether, what and how often to search, so the tool itself becomes something you design. The name and description matter most, because they're all the model decides from. Search HR policies, for leave, benefits and conduct questions, beats a vague search docs. Then come inputs and outputs. Can the agent filter by year or department, and does it get back compact, labelled results with sources it can reason about? It also needs stopping rules on steps, tokens and time, or it keeps searching. And evaluation moves from the final answer to the path, meaning did it search for the right thing, and how many times. The senior part is knowing when not to do this. For simple lookups like what's the notice period, tight latency or cost, or processes that must be auditable, a fixed hybrid-search pipeline with a reranker is faster, cheaper and easier to debug. I route only the multi-step questions to the agent.",
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
      "quick": [
        "Both add a check step to normal RAG.",
        "CRAG grades found documents and searches again if they are bad.",
        "Self-RAG trains the model to judge when to search.",
        "Self-RAG also checks if its own answer is backed up.",
        "In practice, build a small grading loop and cap retries."
      ],
      "simple": "Normal RAG always retrieves and always trusts whatever comes back. Self-RAG and Corrective RAG, or CRAG, both add a check step, but they check different things.\n\nCRAG checks the documents before answering. A grader labels them correct, incorrect or ambiguous. Correct documents are trimmed and used, incorrect ones are thrown away and the system searches again, for example with a rewritten query or a web search. Self-RAG goes further, training the model to output reflection tokens so that while writing it decides whether it needs to retrieve at all and whether its own sentences are supported.\n\nIn practice, most teams build a lighter version of both. For example, in LangGraph you can build a small loop that grades the documents, rewrites and retries, then checks the answer is grounded, using an ordinary LLM as the grader. Each check is another model call, so cap retries at one or two.",
      "points": [
        "**CRAG:** a retrieval grader scores documents → use them, discard and search again (e.g. web), or mix.",
        "**Self-RAG:** the model decides when to retrieve and critiques relevance, support and usefulness with reflection tokens.",
        "CRAG checks the input; Self-RAG checks the need to retrieve and the output.",
        "Production version: grade → rewrite/retry → groundedness check, as a small loop with a normal LLM grader."
      ],
      "diagram": {
        "alt": "Corrective RAG loop: retrieve, grade the documents, generate if relevant or rewrite and search again if not, then check groundedness.",
        "rows": [
          [
            {
              "id": "r",
              "label": "Retrieve"
            }
          ],
          [
            {
              "id": "g",
              "label": "Grade documents",
              "note": "LLM grader",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "w",
              "label": "Rewrite or web search",
              "note": "retry once or twice",
              "accent": "bad"
            },
            {
              "id": "a",
              "label": "Generate",
              "note": "trimmed documents",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "c",
              "label": "Grounded?",
              "note": "Self-RAG style check",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "r",
            "to": "g"
          },
          {
            "from": "g",
            "to": "w",
            "label": "incorrect"
          },
          {
            "from": "g",
            "to": "a",
            "label": "correct"
          },
          {
            "from": "w",
            "to": "r",
            "label": "retry",
            "kind": "back"
          },
          {
            "from": "a",
            "to": "c"
          }
        ],
        "caption": "**CRAG checks the input** (the retrieved documents); **Self-RAG checks when to retrieve and its own output**. In production: grade, retry, check groundedness."
      },
      "say": "Both add a check step to RAG, but CRAG checks the retrieved documents while Self-RAG checks when to retrieve and its own output. Plain RAG always retrieves and trusts whatever comes back. Corrective RAG puts a separate grader after retrieval that labels the documents correct, incorrect or ambiguous. Correct ones get trimmed and used. Incorrect ones get thrown away and it searches again, typically with a rewritten query or a web search. Ambiguous means it uses both. Self-RAG goes further by training the model to emit reflection tokens, so it decides whether it needs to retrieve at all, whether each passage is relevant, and whether its own sentences are supported and useful. Describing it as the model reviewing its answer misses the retrieve-only-when-needed part. In production I rarely train anything. I build a small loop, often in LangGraph, that grades documents, rewrites and retries, then checks groundedness with an ordinary model as the grader. Every check is another call, so I cap retries at one or two.",
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
      "quick": [
        "GraphRAG maps people, things and their links from documents.",
        "It answers questions that connect facts across many documents.",
        "Building it needs model calls on every piece, which is costly.",
        "Mistakes in the map give wrong answers, and it needs upkeep.",
        "Usually no, plain RAG wins for normal lookups."
      ],
      "simple": "GraphRAG builds a knowledge graph from your documents first, meaning the entities and the relationships between them, and then retrieves over that structure instead of, or alongside, plain chunks.\n\nIt answers questions that chunk retrieval cannot. For example, 'which of our suppliers are affected by this regulation, and through which contracts?' needs facts connected across many documents, and no single chunk contains that. Summarising a whole corpus by theme is the other case. But the costs are large. Extraction means model calls over every chunk at ingestion, the graph needs maintenance as documents change, and extraction errors compound into a wrong graph, which is worse than none.\n\nSo on most projects I wouldn't build it. It makes sense when questions are genuinely relational and the corpus is stable. For lookup questions, plain RAG with a reranker wins.",
      "points": [
        "Extracts entities and relationships, retrieves over the graph.",
        "Wins on relational and whole-corpus questions no single chunk can answer.",
        "Ingestion cost is high - model passes over the whole corpus (LazyGraphRAG-style variants cut this).",
        "Extraction errors compound. A wrong graph is worse than none.",
        "Adds a second datastore to operate and keep in sync.",
        "For lookup-style questions, plain RAG plus reranking wins outright."
      ],
      "say": "GraphRAG extracts entities and relationships into a knowledge graph and retrieves over that, and on most projects I wouldn't build it. It does answer a class of question chunk retrieval can't. Which suppliers are affected by this regulation, and through which contracts, needs facts connected across many documents. Microsoft's version also clusters the graph into communities and pre-summarises each, so whole-corpus theme questions get answered. The costs are large, though. Ingestion means model calls over every chunk plus a summary per community, a real bill to price before proposing it. The graph needs upkeep as documents change, and extraction errors compound into a wrong graph, which is worse than none. You're also running a second datastore. Lighter variants like LazyGraphRAG defer most of the LLM work to query time, which brings indexing cost down to about that of plain vector RAG. So I build it only for genuinely relational questions on a fairly stable corpus. For what does the policy say about X, plain RAG with a reranker wins.",
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
      "quick": [
        "Measure first to find which part is failing.",
        "If the right text is not found, fix splitting and search.",
        "If it is found but ranked low, add a careful second sort.",
        "If it is found but answers are wrong, fix the prompt side.",
        "Fancy methods come last, since they cost most and help least."
      ],
      "simple": "The first thing to add is nothing, until you have measured which stage is failing. Adding techniques blind is how pipelines become slow and expensive without getting better.\n\nIf recall is the problem, meaning the right chunk isn't retrieved, reranking can't help, so you fix chunking, ingestion and hybrid search. If recall is fine but the right chunk ranks low, a reranker fixes exactly that, and it is the best value-per-effort change here. If retrieval is fine but answers are still wrong, the problem is generation, such as the prompt. For example, if an HR assistant keeps missing the right leave clause entirely, you start with chunking and hybrid search, not with an agent.\n\nSo a sensible order is chunking, hybrid search, a reranker, then enrichment, and only then query rewriting or agents. Add one at a time and keep it only if it moves its metric within budget.",
      "points": [
        "Measure first: is it recall, ranking, or generation?",
        "Low recall → chunking, ingestion quality, hybrid search. Reranking cannot help.",
        "Good recall, poor ranking → reranker. Best value in the topic.",
        "Good retrieval, bad answers → it is a generation problem.",
        "Default order: chunking, hybrid, rerank, contextual enrichment, then the rest.",
        "Each addition must be justified against latency budget and cost per query."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Default order for adding RAG techniques after measuring: chunking, hybrid search, reranker, contextual enrichment, then query rewriting or agents.",
        "top": "measure first: recall, ranking or generation?",
        "bottom": "add last",
        "layers": [
          {
            "label": "Fix chunking",
            "note": "recall starts here",
            "accent": "accent"
          },
          {
            "label": "Hybrid search",
            "note": "BM25 plus vectors",
            "accent": "accent"
          },
          {
            "label": "Reranker",
            "note": "best value per effort",
            "accent": "accent"
          },
          {
            "label": "Contextual enrichment",
            "note": "one-time ingestion cost"
          },
          {
            "label": "Rewriting, agentic loop",
            "note": "costliest, narrowest",
            "accent": "warn"
          }
        ],
        "caption": "**Measure before adding anything.** Then add one technique at a time, cheapest and broadest first; the exotic ones come last."
      },
      "say": "Nothing, until I've measured which stage is failing, because adding techniques blind makes a pipeline slower and pricier without making it better. The diagnosis splits three ways. If recall is low and the right chunk isn't being retrieved, a reranker can't help, since it only reorders what was found. That's a chunking, ingestion and hybrid-search problem. If the chunk is found but ranked low, a reranker is exactly the fix, and it's the best value for effort in this whole area. If retrieval is fine and answers are still wrong, it's generation, meaning the prompt, the context ordering or refusal handling. Once I know where it's failing, my default order is chunking, then hybrid search, then a reranker, then contextual enrichment. Query rewriting and agentic loops come last because they cost the most and help the narrowest set of cases. I add one technique at a time on the same eval set and keep it only if it moves its target metric within the latency and cost budget.",
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
      "quick": [
        "Match each technique to the failure it fixes.",
        "Multi-query searches several wordings, RAG-Fusion merges them by rank.",
        "Step-back also searches a broader question to find the rule.",
        "Decomposition splits multi-part questions, routing picks where to look.",
        "Each adds a model call, so add only what tests justify."
      ],
      "simple": "The user's question is often not the best search query, so query transformation changes it before we search. The easiest way to compare the techniques is by the failure each one fixes.\n\nRewriting turns a messy follow-up into a clean standalone question. Multi-query writes a few versions of the question and searches them in parallel, and RAG-Fusion merges those lists with reciprocal rank fusion, so chunks near the top of several lists win. Step-back prompting handles a question that is too specific. For example, 'can I claim a taxi at 11 pm after a client dinner in Pune?' also gets searched as 'what is the late-night travel expense policy?'. Decomposition splits a multi-part question into sub-questions, and routing decides where to look first.\n\nAlmost every technique adds an LLM call, so add only the one that fixes the failure you actually measured.",
      "points": [
        "Rewriting → follow-up and messy questions.",
        "Multi-query / RAG-Fusion (merge with RRF) → one wording misses the chunk.",
        "Step-back → too specific; also retrieve the general rule.",
        "Decomposition → multi-part or comparison questions.",
        "Routing → pick the right index or tool. HyDE → questions and answers look different."
      ],
      "say": "The clean way to compare them is by the failure each one fixes, because stacking them all just multiplies latency. Rewriting handles a messy follow-up like what about for interns, turning it into a standalone question. Multi-query helps when one wording misses the chunk, so the model writes three to five variants and we search them in parallel. RAG-Fusion is multi-query with a proper merge, reciprocal rank fusion, which sums one over sixty plus the rank across the lists. Chunks near the top of several lists win, and ranks are used because BM25 and cosine scores aren't on the same scale. Step-back handles a question that's too specific. A late taxi claim after a client dinner also gets searched as the late-night travel policy, which finds the general rule. Decomposition splits multi-part questions, and routing picks the right index or tool, like HR documents versus a SQL database. Almost all of them add an LLM call, so I add only the one that fixes a failure the eval showed.",
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
      "quick": [
        "Both fix questions and answers looking different.",
        "HyDE writes a fake answer at question time, adding delay.",
        "HyPE writes likely questions for each piece when loading.",
        "Then it matches question to question, with no extra wait.",
        "HyPE makes the index bigger and needs redoing when text changes."
      ],
      "simple": "HyDE and HyPE solve the same problem: a question and its answer don't look alike. 'How many days of leave do I get?' and 'Employees are entitled to 24 days of paid annual leave' share very few words, so their embeddings sit far apart. The difference is when each one pays to close that gap.\n\nHyDE fixes it at query time. The LLM writes a fake answer and we search with it, since it lands near the real one. But that is an extra LLM call on every query, often 0.5 to 2 seconds. HyPE fixes it at index time. For each chunk, the LLM writes three to five questions it could answer, and we embed those. For example, the leave chunk might store 'how many days of annual leave do I get?', so the user's question is matched question to question with no extra call.\n\nSo HyPE wins on latency, while HyDE needs no re-indexing.",
      "points": [
        "Both fix the gap between how questions look and how answers look.",
        "HyDE: generate a fake answer at query time and search with it - one extra LLM call per query.",
        "HyPE: generate likely questions per chunk at index time and match question to question - no query-time call.",
        "HyPE wins on latency; HyDE avoids re-indexing. HyPE makes the index bigger."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "HyDE and HyPE compared on when the LLM runs, what gets matched, cost and trade-off.",
        "aspects": [
          "LLM runs",
          "Generates",
          "Match",
          "Query-time cost",
          "Trade-off"
        ],
        "columns": [
          {
            "label": "HyDE",
            "note": "fix at query time",
            "accent": "warn",
            "cells": [
              "On every query",
              "A fake answer",
              "Fake answer to chunk",
              "0.5-2 s extra",
              "Can drift off-topic"
            ]
          },
          {
            "label": "HyPE",
            "note": "fix at index time",
            "accent": "accent",
            "cells": [
              "Once per chunk",
              "3-5 likely questions",
              "Question to question",
              "None",
              "Bigger index, re-index"
            ]
          }
        ],
        "caption": "Both close the question-answer gap. **HyDE pays on every query; HyPE pays once at ingestion.**"
      },
      "say": "Both close the gap between how questions and answers look, but HyDE pays for it at query time and HyPE pays once at index time. How many days of leave do I get and employees are entitled to 24 days of paid annual leave share almost no words, so their embeddings sit far apart. HyDE has the LLM write a fake answer when the question arrives, and searches with that. That's an extra call on every query, often half a second to two seconds. HyPE, hypothetical prompt embeddings, flips it. At ingestion the LLM writes three to five questions each chunk could answer, and we embed those linked to the chunk. Then it's question matched to question, with no extra call at query time. The trade is an index with roughly three to five times the vectors, and regenerating questions whenever a chunk changes. HyDE needs no re-indexing, so it adapts to anything. Either way, I keep plain chunk embeddings and BM25 running alongside.",
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
      "quick": [
        "A chunk cut from a document loses its heading.",
        "Add a short line saying which document and section.",
        "Use that text for both meaning and keyword search.",
        "The cost is paid once when loading, not every question.",
        "First try just adding the title and heading path."
      ],
      "simple": "Contextual retrieval, or contextual chunk enrichment, prepends a short situating line to each chunk before it is indexed. It is needed because a chunk taken out of a document loses its context. For example, a paragraph saying 'the waiting period is 90 days' doesn't say which plan it belongs to, because that was in a heading pages earlier, so it won't match a question about the GOLD plan.\n\nAt ingestion, a model writes a line such as 'From the 2026 GOLD plan policy, eligibility section', and it goes in front of the chunk. The context has to be in the embedded text itself, because metadata in a separate field never touches the embedding.\n\nThe cost is paid once per chunk, not on every query, and prompt caching cuts it sharply. A cheap version is worth trying first: just prepend the document title and heading path, with no model call.",
      "points": [
        "Chunks lose the context that made them meaningful - usually the heading.",
        "Prepend a short situating line before embedding, at ingestion.",
        "Cost is one-time per chunk, not per query. That is the point.",
        "Prompt caching over the source document cuts the ingestion bill.",
        "Cheapest version: prepend title and heading path, no model call.",
        "Store the enriched text for embedding, the original for display."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Contextual enrichment at ingestion: take a chunk, prepend a situating line, then embed and index the enriched text.",
        "lanes": [
          {
            "label": "Raw chunk",
            "note": "\"waiting period is 90 days\"",
            "accent": "bad"
          },
          {
            "label": "Add context line",
            "note": "title + heading, or LLM",
            "accent": "warn"
          },
          {
            "label": "Enriched chunk",
            "note": "\"2026 GOLD plan, eligibility...\""
          },
          {
            "label": "Embed + BM25",
            "note": "same enriched text",
            "accent": "accent"
          }
        ],
        "caption": "Give each chunk back its heading **once, at ingestion**, not on every query. Try the free title-and-heading version first."
      },
      "say": "Contextual retrieval prepends a short situating line to each chunk before indexing, because a chunk cut out of a document loses its heading. A paragraph saying the waiting period is 90 days doesn't mention the GOLD plan, so it won't match a question about the GOLD plan. At ingestion, a model writes something like from the 2026 GOLD plan policy, eligibility section, and that goes in front of the chunk. The context has to be in the embedded text itself, because metadata in a separate field never touches the embedding. I use the same enriched text for the BM25 index too. The appeal is that the cost is once per chunk at ingestion, and prompt caching over the source document cuts it sharply. On their benchmarks, Anthropic reported about 35 percent fewer top-20 retrieval failures from contextual embeddings, 49 with contextual BM25 and 67 with reranking on top. Before paying for model calls, though, I try the free version, which just prepends the title and heading path.",
      "numbers": "Anthropic's 2024 write-up reported about 35% fewer top-20 retrieval failures from contextual embeddings, about 49% with contextual BM25 added, and about 67% with reranking on top - on their benchmarks, so measure on yours. The cost is once per chunk at ingestion, and prompt caching over the source document cuts it sharply.",
      "wrong": "\"We add metadata to the chunk.\" Metadata in a separate field does not affect the embedding. The context has to be in the text that gets embedded.",
      "follow": "Do you embed the enriched text or the original? Which one do you show the user?",
      "followAnswer": "I embed the enriched text and show the original. The situating line exists to help matching, so it goes into both the embedding and the BM25 index. But it's model-written and can be slightly off, so the user and the citation see the source text exactly as written. I store both on the chunk record, the enriched version for indexing and the original for display and for the prompt, with the document title and section kept as metadata for the citation."
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
      "quick": [
        "Both fix chunks that lose their document context.",
        "Contextual retrieval adds a written context line to each chunk.",
        "Late chunking reads the whole document first, then splits.",
        "It needs no extra model call, but a special search model.",
        "It only helps meaning search, not keyword search."
      ],
      "simple": "Late chunking and contextual retrieval fix the same problem: a chunk cut out of a document loses its context. For example, a chunk saying 'its population is 3.8 million' doesn't say which city 'its' means, so it matches the wrong questions.\n\nContextual retrieval fixes this with text. An LLM writes a context line for each chunk, which costs a call per chunk but helps both vector search and BM25. Late chunking fixes it inside the embedding model, with no LLM call. You feed the whole document through a long-context embedding model once, so every token vector has seen the whole document, and only then cut at chunk boundaries and average the token vectors in each chunk.\n\nBut it needs a model with a long window that exposes token-level outputs, which most closed APIs don't, and it only helps the dense side. The two can be combined, so measure both.",
      "points": [
        "Problem: chunks lose references like \"it\", \"the plan\" or \"the city\" that were resolved earlier in the document.",
        "Contextual retrieval: an LLM writes context text per chunk - costs calls, helps dense and BM25.",
        "Late chunking: embed the whole document once, then pool token vectors per chunk - no LLM call.",
        "Needs a long-context model with token-level outputs; helps dense retrieval only.",
        "Measure both on your eval set; they can be combined."
      ],
      "say": "Both fix chunks that lose their document context, but contextual retrieval does it with text and late chunking does it inside the embedding model. Picture a chunk saying its population is 3.8 million. Nothing in it says which city. Contextual retrieval has an LLM write a context line for each chunk and indexes that with it. That costs a call per chunk at ingestion, but it helps both dense search and BM25. Late chunking skips the LLM. You run the whole document, or a large section, through a long-context embedding model once, so every token vector has seen the city named earlier. Only then do you cut at chunk boundaries and average the token vectors inside each one. The limits are real. You need a model with a long window that exposes token-level outputs, like Jina's, most closed embedding APIs don't, and it only helps the dense side. Hosted models like voyage-context-3 now package the same idea. The two can be combined, so I measure both on our eval set.",
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
      "quick": [
        "Small pieces answer details but miss the big picture.",
        "RAPTOR groups pieces, summarises them, and repeats in levels.",
        "It searches every level, but costs many model calls.",
        "Sentence-window searches single sentences for precise matches.",
        "Then it gives the model the neighbouring sentences too."
      ],
      "simple": "Normal chunks are all small pieces at one level. That works for 'what is the late fee?' but fails for 'what are the main themes of this 200-page report?', because no small chunk holds the big picture. RAPTOR and sentence-window retrieval fix this from opposite directions.\n\nRAPTOR builds a tree of summaries, like a book with pages, chapter summaries and a book summary. It clusters similar chunks, has an LLM summarise each group, repeats on the summaries for two to four levels, and indexes every level. A detail question matches a leaf, and a big-picture question matches a summary. The downside is many LLM calls, redone when documents change.\n\nSentence-window goes the other way: search small, read wide. It embeds single sentences for a precise match, then gives the LLM that sentence plus a few neighbours. For example, in a long contract it finds the exact termination clause, while RAPTOR summarises the key risks.",
      "points": [
        "Flat chunks answer detail questions but miss big-picture questions.",
        "RAPTOR: cluster chunks → summarise → repeat; index every level of the tree.",
        "Sentence-window: embed single sentences, return the sentence plus its neighbours.",
        "RAPTOR costs many LLM calls and must be updated on change; sentence-window is cheap."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "RAPTOR tree of summaries: a corpus summary on top, cluster summaries in the middle, leaf chunks at the bottom, all indexed.",
        "top": "big-picture questions",
        "bottom": "detail questions",
        "layers": [
          {
            "label": "Top summaries",
            "note": "main themes",
            "accent": "accent"
          },
          {
            "label": "Summaries of summaries",
            "note": "cluster, summarise, repeat"
          },
          {
            "label": "Cluster summaries",
            "note": "one LLM call each",
            "accent": "warn"
          },
          {
            "label": "Leaf chunks",
            "note": "\"what is the late fee?\"",
            "accent": "accent"
          }
        ],
        "caption": "RAPTOR **indexes every level of a summary tree**, so themes match the top and facts match the leaves. Sentence-window is the cheap cousin: search small, read wide."
      },
      "say": "Both fix the fact that flat chunks are one small size, which suits detail questions but misses the big picture. RAPTOR builds a tree of summaries. It clusters similar chunks, has an LLM summarise each cluster, then repeats on the summaries, usually for two to four levels, and indexes every level. A question about the main themes of a 200-page report can then match a top-level summary, while the late fee still matches a leaf. It costs roughly one summary call per cluster per level, and a changed document means regenerating summaries up its path. Sentence-window retrieval goes the other way. It embeds single sentences, because one sentence matches precisely, then hands the model that sentence plus two to five neighbours on each side. It's a cheap cousin of parent-child retrieval, search small and read wide. Just making chunks bigger hurts precise matches and still misses themes. So sentence-window is my pick for precise lookups in long text, and RAPTOR for thematic questions.",
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
      "quick": [
        "Context compression keeps only the useful parts of found text.",
        "Less text means lower cost, faster answers and less distraction.",
        "Drop weak pieces first, then keep only relevant sentences.",
        "The risk is cutting a key condition like an exception.",
        "Test answer quality before and after, and keep the sources."
      ],
      "simple": "Context compression means keeping only the useful part of the retrieved text before it goes to the LLM. Retrieval might return 10 chunks of 500 tokens, which is 5,000 tokens, when the answer is in three sentences. The rest costs money, slows the response and can distract the model.\n\nThe easiest way, and often very effective, is dropping whole chunks with a low reranker score. The next step is keeping only the sentences that relate to the question, and for really large contexts, tools like LLMLingua delete low-information words.\n\nThe risk is cutting the sentence that mattered. For example, removing a condition like 'except for contract staff' makes the answer confidently wrong, so run the eval set with and without compression. Use it when context is large and cost or latency matters, and skip it when you already pass a few short, well-reranked chunks.",
      "points": [
        "Goal: fewer tokens and less noise - lower cost, lower latency, less \"lost in the middle\".",
        "Levels: drop chunks by reranker score → extract relevant sentences → token-level (LLMLingua).",
        "Risk: removing a key condition. Evaluate on answer quality; keep citations to the original chunks."
      ],
      "say": "Context compression trims retrieved text to the useful part before it reaches the model. Ten chunks of 500 tokens is 5,000 tokens, when the answer is often in three sentences. The rest costs money, adds latency and can distract the model, since information buried mid-context still gets used less reliably. I escalate in three steps. The easiest, and often best, is dropping whole chunks with a low reranker score. Next is extracting just the sentences that relate to the question, with a small model or embedding similarity. For really large contexts, token-level tools like LLMLingua delete low-information words, compressing several times over. The risk is cutting the one sentence that mattered, like a condition saying except for contract staff. So I run the eval set with and without compression, per question, and citations point to the original chunks. A big window doesn't remove the need, since you still pay per token. If I'm already passing a few short, well-reranked chunks, I skip it.",
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
      "quick": [
        "CAG loads all the knowledge into the model once and reuses it.",
        "There is no search step, so search cannot miss anything.",
        "It fits a small, stable set everyone may see, like an FAQ.",
        "It fails for big sets, frequent changes or per-user access.",
        "A common middle path caches the core and searches the rest."
      ],
      "simple": "Cache-augmented generation, or CAG, skips retrieval entirely. You load the whole knowledge base into the model's context once, keep the model's processed version of it cached, and reuse that cache for every question.\n\nThe cached thing is the KV cache, the keys and values the model computes for every input token. Building it for a long document is the expensive part, so CAG does it once and appends each question, which means no chunking, no index and no retrieval miss. \n\nIt fits a narrow case, where the knowledge is small, rarely changes and every user may see it. For example, a product manual or an FAQ fits well. Outside that it breaks, because the corpus must fit the window, any change invalidates the cache and there is no per-user filtering. A common middle path is to cache the stable core and retrieve the long tail.",
      "points": [
        "Preload the knowledge base, cache the model's KV state (or use provider prompt caching), answer with no retrieval step.",
        "Removes retrieval misses, chunking and index maintenance.",
        "Fits: small, stable corpus every user may see - manuals, FAQs, one policy set.",
        "Fails: corpus bigger than the window, frequent updates, per-user permissions, very long contexts that dilute accuracy.",
        "Hybrid is common: cache the stable core, retrieve the long tail."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "Two by two grid of corpus size against how often it changes: CAG fits only a small, stable corpus; otherwise RAG or a hybrid.",
        "xLabel": "How often it changes",
        "yLabel": "Corpus size",
        "cols": [
          "Rarely changes",
          "Changes often"
        ],
        "rows": [
          "Fits the window",
          "Bigger than window"
        ],
        "cells": [
          [
            {
              "label": "CAG",
              "note": "manual, FAQ, one policy set",
              "accent": "accent"
            },
            {
              "label": "RAG",
              "note": "each change breaks the cache",
              "accent": "warn"
            }
          ],
          [
            {
              "label": "Hybrid",
              "note": "cache core, retrieve the tail",
              "accent": "warn"
            },
            {
              "label": "RAG",
              "note": "CAG cannot fit it",
              "accent": "bad"
            }
          ]
        ],
        "caption": "CAG fits one corner: **small, stable, and every user may see all of it**. Cached tokens are cheaper, not free."
      },
      "say": "CAG skips retrieval by loading the whole knowledge base into context once and reusing the model's cached state for every question. That state is the KV cache, the keys and values computed for each input token, and building it for a long document is the expensive part. CAG does it once and appends each question, so there's no chunking, no index and no retrieval miss. On a hosted API, the everyday version is provider prompt caching of a long fixed prefix. It fits a narrow case, like a product manual or FAQ that's small, rarely changes, and every user may see. Outside that it breaks. The corpus has to fit the window, any change invalidates the cache, there's no per-user filtering, and accuracy can drop when the answer is buried deep. Cached tokens are cheaper, not free, and caches expire, so a 100k-token prefix still rides along on every call. The common middle path is caching the stable core and retrieving the long tail.",
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
      "quick": [
        "A vector store finds similar text, a knowledge graph finds connections.",
        "Use a graph when the relationship itself is the answer.",
        "Good fits are ownership chains, supply chains and fraud rings.",
        "Merging duplicate names is hard and never fully done.",
        "Default to a vector store, add a graph after a proven failure."
      ],
      "simple": "Vector search and a knowledge graph answer different kinds of questions. Vector search is good at similarity, as in 'find text about this topic'. A graph is good at explicit relationships. For example, it can find who ultimately owns a company, or which suppliers sit two hops from a sanctioned entity. That answer lives between chunks rather than inside one, so no amount of chunking recovers it.\n\nThe cost is where people underestimate it. You need a schema, entity extraction, update logic and, above all, entity resolution, which means deciding that ACME Ltd, Acme Limited and ACME LTD. are one node. That is never fully solved, so a graph is a data engineering programme, not a feature you add in a sprint.\n\nSo the sensible default is vector or keyword retrieval with good metadata filtering. Add a graph only after a real relationship question fails with ordinary retrieval, usually as a hybrid with vector search.",
      "points": [
        "Vector search answers similarity. A graph answers connection.",
        "The giveaway is multi-hop traversal - the answer lives between chunks, not inside one.",
        "Real fits: ownership chains, supply-chain impact, fraud rings, interaction networks.",
        "The cost is entity extraction and entity resolution, which are genuinely hard and ongoing.",
        "It is a data engineering programme, not a feature you add in a sprint.",
        "Default to vectors plus metadata filtering; escalate on a demonstrated failure.",
        "Hybrid is common: graph for traversal, vectors for the text on each node."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Vector store and knowledge graph compared on what they answer, where the answer lives, examples, cost and default role.",
        "aspects": [
          "Answers",
          "Answer lives",
          "Example",
          "Hidden cost",
          "Role"
        ],
        "columns": [
          {
            "label": "Vector store",
            "note": "plus metadata",
            "accent": "accent",
            "cells": [
              "Similarity",
              "Inside one chunk",
              "Text about this topic",
              "Chunking, embeddings",
              "The default"
            ]
          },
          {
            "label": "Knowledge graph",
            "note": "entities and links",
            "accent": "warn",
            "cells": [
              "Connection, multi-hop",
              "Between chunks",
              "Who ultimately owns this?",
              "Entity resolution, forever",
              "Add on proven failure"
            ]
          }
        ],
        "caption": "**Vectors answer similarity; a graph answers connection.** Reach for a graph only when the relationship itself is the answer."
      },
      "say": "I'd reach for a knowledge graph when the relationship itself is the answer, and otherwise stay with a vector store plus good metadata. Vector search answers similarity, as in find text about this topic. A graph answers connection, like who ultimately owns this company, or which suppliers sit two hops from a sanctioned entity. That answer lives between chunks rather than inside one, so no amount of chunking recovers it. Good fits are ownership chains, supply-chain impact and fraud rings. The cost is where people underestimate it. You need a schema, entity extraction, update logic and entity resolution, which means deciding ACME Ltd, Acme Limited and ACME LTD are one node. That's never fully solved and needs ongoing stewardship. So a graph is a data engineering programme, not a feature you add in a sprint. I add one only after a real question fails with ordinary retrieval, and usually as a hybrid, where the graph finds the connected entities and vector search pulls the supporting text.",
      "numbers": "Entity resolution is the hidden cost. Deciding that ACME Ltd, Acme Limited and ACME LTD. are one node is never fully solved and needs ongoing stewardship.",
      "wrong": "'Graphs give richer context so they are better.' It skips the build and maintenance cost entirely, and the follow-up about entity resolution exposes that gap.",
      "follow": "You have the graph. How do you actually feed a traversal result to the model?",
      "followAnswer": "I turn it into compact text with provenance, never a raw graph dump. The traversal returns paths, like company A is owned by B, which is owned by C. I serialise each path as short statements or a small table, attach the source document behind each edge, then use vector search to pull supporting passages for the key nodes. The prompt tells the model to cite those edges and passages, and I cap paths by depth and count so the context stays small."
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
      "quick": [
        "Counts and totals go to the database, explanations to documents.",
        "A cheap model decides which type each question is.",
        "Generated database queries run read-only with limits and timeouts.",
        "When unsure, run both paths.",
        "Mark which numbers came from the database."
      ],
      "simple": "The common mistake with structured and unstructured data is trying to make one mechanism handle both. For example, 'how many claims were denied last month?' is a database question, because the answer is an exact count. 'Why are claims denied?' is a document question. Retrieval cannot count, and SQL cannot explain policy.\n\nSo you route. A cheap classifier decides which kind of question it is and sends it to text-to-SQL, to document retrieval, or to both. When it is unsure, running both beats guessing wrong. Text-to-SQL needs guardrails, such as a read-only connection, a validator, a row limit and a timeout, because an unbounded generated join is an incident waiting to happen.\n\nDumping database rows into the vector store is the tempting shortcut, but it gives approximately right numbers, which is worse than none. In a combined answer, mark which figures came from the database, since those are exact.",
      "points": [
        "Aggregations and counts → SQL. Explanations and policy → retrieval.",
        "Route with a cheap classifier; run both when uncertain.",
        "Text-to-SQL: read-only connection, schema in context, validator, row limit.",
        "Never let generated SQL run unbounded or with write permissions.",
        "In a combined answer, mark which figures came from the database.",
        "Evaluate the router separately - routing errors look like quality failures."
      ],
      "diagram": {
        "alt": "A router sends count questions to guarded text-to-SQL and explanation questions to document retrieval, then combines them in one answer.",
        "rows": [
          [
            {
              "id": "q",
              "label": "Question"
            }
          ],
          [
            {
              "id": "r",
              "label": "Router",
              "note": "unsure? run both",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "s",
              "label": "Text-to-SQL",
              "note": "read-only, row limit",
              "accent": "warn"
            },
            {
              "id": "d",
              "label": "Document retrieval",
              "note": "policy, reasons"
            }
          ],
          [
            {
              "id": "a",
              "label": "Combined answer",
              "note": "mark database figures",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "r"
          },
          {
            "from": "r",
            "to": "s",
            "label": "how many?"
          },
          {
            "from": "r",
            "to": "d",
            "label": "why?"
          },
          {
            "from": "s",
            "to": "a",
            "label": "exact number"
          },
          {
            "from": "d",
            "to": "a",
            "label": "explanation"
          }
        ],
        "caption": "**Retrieval cannot count and SQL cannot explain policy**, so route. Mark which figures came from the database, because those are exact."
      },
      "say": "I route, because retrieval can't count and SQL can't explain policy, so no single mechanism handles both. How many claims were denied last month is a database question with an exact answer. Why claims get denied is a document question. A cheap classifier or small model decides which kind each question is and sends it to text-to-SQL, to document retrieval, or to both. When it's unsure, running both and letting generation use what fits beats guessing wrong. Text-to-SQL needs guardrails. It gets the schema in context, a read-only connection, a validator, a row limit and a statement timeout, because an unbounded generated join is an incident waiting to happen. Dumping database rows into the vector store is the tempting shortcut, and it gives approximately right numbers, which is worse than none. In a combined answer I mark which figures came from the database, since those are exact and the prose isn't. The router also gets its own eval set, because routing errors look like quality failures.",
      "numbers": "Always cap generated SQL with a row limit and a statement timeout. An unbounded generated join is a production incident waiting to happen.",
      "wrong": "\"I'd put the database rows into the vector store.\" Then a count becomes a retrieval, and retrieval cannot count. It gives approximately-right numbers, which is worse than none.",
      "follow": "The router sent an aggregation question to retrieval. How would you know?",
      "followAnswer": "Two ways, offline and in production. Offline, the router has its own labelled set, so aggregation questions classified as document questions show up directly. In production I log every routing decision in the trace and flag counting-style questions, with words like how many, total or average, that were answered from retrieval with no SQL result behind the figure. A number with no database source is the symptom. Those cases go back into the router's eval set, and uncertain ones run both paths."
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
      "quick": [
        "Caching the question's search numbers is safe if keyed by model version.",
        "Search and answer caches must include the user's permissions.",
        "Answer caches need a version that changes when documents change.",
        "Matching similar questions needs a strict similarity bar.",
        "The provider's own prompt reuse carries none of these risks."
      ],
      "simple": "Caching is the biggest cost lever in a RAG pipeline, but each cache layer has its own trap, and the fix is always about what goes into the cache key.\n\nThe embedding cache is the safe one, keyed on the query text plus the embedding model version, so a model migration doesn't serve stale vectors. Retrieval and answer caches are where leaks happen. For example, if the key is just the question, a manager with wide HR access fills the cache, and a junior employee asking the same thing gets restricted results. So the user's entitlement set must go in the key.\n\nAnswer caches also go stale when a document changes, so their key needs a corpus version that ingestion bumps. Semantic caching of near-identical questions is riskier still, so set the similarity threshold high. Provider prompt caching avoids all this, because every answer is still generated fresh.",
      "points": [
        "Embedding cache: key on text + embedding model version.",
        "Retrieval and answer caches: the key must include the user's entitlement set.",
        "Answer cache needs a corpus version in the key, bumped by ingestion.",
        "A cache keyed only on question text is a data-leak mechanism.",
        "Semantic caching - matching near-identical questions - is powerful and riskier. Set a high threshold.",
        "Provider prompt caching reuses an identical prefix and still generates each answer fresh - none of these risks."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Three RAG cache layers and what each key must include, plus provider prompt caching, which carries none of these risks.",
        "top": "query",
        "bottom": "answer",
        "layers": [
          {
            "label": "Embedding cache",
            "note": "key: text + model version",
            "accent": "accent"
          },
          {
            "label": "Retrieval cache",
            "note": "key: + user entitlements",
            "accent": "warn"
          },
          {
            "label": "Answer cache",
            "note": "key: + entitlements + corpus version",
            "accent": "warn"
          },
          {
            "label": "Provider prompt caching",
            "note": "answer still fresh, no leak",
            "accent": "muted"
          }
        ],
        "caption": "Every cache trap is fixed **in the key**. A key of question text alone leaks; add entitlements, and a corpus version that ingestion bumps."
      },
      "say": "Each cache layer in RAG has its own trap, and the fix is always about what goes into the key. The embedding cache is the safe one, keyed on the query text plus the embedding model version, so a model migration doesn't serve stale vectors. Retrieval and answer caches are where leaks happen. If the key is just the question, a manager with wide HR access fills the cache and a junior employee asking the same thing gets restricted results. So the user's entitlement set goes in the key. Answer caches also go stale when a document changes or is withdrawn, so they need a corpus version in the key that ingestion bumps. Semantic caching of near-identical questions is riskier still, so I set the similarity threshold high. Keying on question text alone is the most common implementation, and exactly that leak. Provider prompt caching is different. It reuses processing of an identical prefix but generates every answer fresh, so none of these risks apply.",
      "numbers": "For semantic caching, set the similarity threshold high - a loose threshold serves the answer to a different question, and users notice that faster than any cost saving pays for.",
      "wrong": "\"We cache responses by question text.\" That is the leak. It is also the most common caching implementation, which is exactly why it gets asked.",
      "follow": "A document was withdrawn. Which of your caches still answers from it?",
      "followAnswer": "Any cache holding retrieved results or finished answers, unless its key includes a corpus version. The embedding cache is fine, because a query vector doesn't depend on the documents. Retrieval and answer caches keyed on question and entitlements still return chunks or text from the withdrawn document, and the semantic cache is worst, since it serves that answer to similar questions too. So ingestion bumps the corpus version on withdrawal, and for urgent withdrawals I also purge entries citing that document."
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
      "quick": [
        "ColPali searches pictures of pages instead of extracting text.",
        "It skips text reading, table detection and chart parsing.",
        "An image-reading model then answers from the found pages.",
        "It is best for slides, charts, forms and complex tables.",
        "The index is large, and exact codes are harder to find."
      ],
      "simple": "The normal way to handle a PDF is a long pipeline: extract text, run OCR, detect tables, describe charts, then chunk and embed. Every step can break, so a table comes out as jumbled text or a chart is lost.\n\nColPali takes a shortcut by treating each page as an image and embedding it directly. A vision-language model produces one vector per small patch, roughly 1,000 per page, and each word of the question is matched against its best patches, much like ColBERT. It is like searching photos of textbook pages instead of typing out the book first.\n\nIt shines where layout carries meaning. For example, slide decks, forms and chart-heavy reports work far better this way. But the index is big, answers need a pricier vision model, and exact matching on product codes is weaker than BM25. So many teams use it only for chart and table pages.",
      "points": [
        "Embed page images directly with a vision-language model - skip OCR, layout and table parsing.",
        "Many vectors per page (one per patch), matched with late-interaction MaxSim, like ColBERT.",
        "Best for charts, slides, forms and complex tables; a vision LLM reads the retrieved pages.",
        "Costs: large index, vision-model generation, weaker exact keyword match. Usually used alongside text RAG."
      ],
      "say": "ColPali treats each PDF page as an image and embeds it directly, skipping OCR, table detection and chart parsing. That parsing pipeline is where PDFs usually break. Tables come out as jumbled text, charts vanish and the layout disappears. With ColPali, a vision-language model looks at the page and produces one vector per small patch, roughly a thousand per page. Query tokens are matched to their best patches with the same MaxSim late interaction ColBERT uses, and a vision-capable LLM then reads the retrieved page images to answer. It shines on slide decks, brochures, forms and chart-heavy reports, where the layout carries meaning. The trade-offs are a big index, a pricier vision model for every answer, weaker exact matching on product codes than BM25, and harder sentence-level citations. So it doesn't replace text RAG. I'd classify pages at ingestion, send text-heavy ones through normal chunking, give chart and table pages a visual embedding, and check that the eval set shows the visual questions actually improving.",
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
      "quick": [
        "Pasting 200 tables costs a lot and lowers accuracy.",
        "Treat each table as a document and search for relevant ones.",
        "Write clear table descriptions, since names are often cryptic.",
        "Store how tables link, so the joining tables come along.",
        "Best is a small set of documented, read-only views."
      ],
      "simple": "The demo version of text-to-SQL pastes the whole schema into the prompt. At 200 tables that is easily 30,000 to 50,000 tokens per query, and accuracy drops, because the model is choosing between 200 tables when the answer needs three. A bigger context window fixes none of this.\n\nSo you retrieve the schema instead, which is RAG applied to tables. Each table becomes a document with its name, columns, a one-line description and a few sample values, and each question pulls the ten or twenty most relevant. Descriptions matter more than names. For example, a table called DIM_CUST_MSTR_V2 will never match 'customer' without one. You also store the foreign-key graph so bridging tables come along, or the model invents joins.\n\nFor a stable workload, the best answer is a curated layer of a few dozen documented views, which also acts as an access-control boundary.",
      "points": [
        "Do not paste 200 tables. Cost rises and accuracy falls - the model is choosing between too many.",
        "Retrieve the schema: embed each table as a document, pull the top ten or twenty per question.",
        "Column descriptions beat column names. DIM_CUST_MSTR_V2 matches nothing without one.",
        "Store the foreign-key graph and auto-include bridging tables, or the joins will be invented.",
        "Best answer for a stable workload: a curated view layer, not the raw warehouse.",
        "A view layer is also an access-control boundary - the model cannot query what it cannot see.",
        "Keep the ar-08 safety rails: read-only, validated, row-limited, timed out."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Schema retrieval for text-to-SQL: embed table descriptions, retrieve the top tables, add bridging tables, generate SQL, run it with guardrails.",
        "lanes": [
          {
            "label": "Tables as documents",
            "note": "descriptions beat names",
            "accent": "warn"
          },
          {
            "label": "Retrieve top 10-20",
            "note": "not all 200"
          },
          {
            "label": "Add bridging tables",
            "note": "from foreign-key graph"
          },
          {
            "label": "Generate SQL",
            "note": "a few thousand tokens",
            "accent": "accent"
          },
          {
            "label": "Validate and run",
            "note": "read-only, limits, timeout",
            "accent": "warn"
          }
        ],
        "caption": "Do not paste 200 tables: **retrieve the schema**, RAG applied to tables. A curated view layer is even better, and doubles as access control."
      },
      "say": "You retrieve the schema instead of pasting it, which is just RAG applied to tables rather than prose. Pasting 200 tables of DDL is easily 30 to 50 thousand tokens per query, and accuracy falls, because the model is choosing between 200 tables when the answer needs three. So each table becomes a document with its name, columns, types, a one-line description and a few sample values, and each question pulls the ten or twenty most relevant. Descriptions matter far more than names. A table called DIM_CUST_MSTR_V2 won't match customer without one, and writing them is usually a data steward's job, not an engineering one. Joins are the next trap. I store the foreign-key graph so bridging tables come along automatically, otherwise the model invents joins. For a stable workload, the best answer is a curated layer of a few dozen documented views, which doubles as an access-control boundary. A bigger context window fixes none of this. And the usual rails stay, meaning read-only, validated, row-limited and timed out.",
      "numbers": "200 tables of DDL is easily 30k–50k tokens per query. Schema retrieval typically cuts that to a couple of thousand and raises accuracy at the same time.",
      "wrong": "\"I would use a model with a bigger context window.\" It costs more per query, and it does not fix the real problem, which is that the model picks the wrong table when offered 200 of them.",
      "follow": "Two tables both look like the right one and the model keeps picking the deprecated one. What do you change?",
      "followAnswer": "I make the right choice visible to retrieval and then enforce it. The deprecated table gets marked as deprecated in its description, or dropped from the schema index entirely, and the current table's description says it replaces the old one. Better still, I expose only the curated view layer, so the deprecated table isn't there to pick. As a guard, the validator rejects queries that touch deprecated tables and returns an error naming the replacement, and those questions join the eval set."
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
      "quick": [
        "First ask if users want a lookup or an exact total.",
        "Meaning search cannot count, and the file is far too big.",
        "Load it into a database and give the model the layout.",
        "The model writes the query, your code checks and runs it.",
        "Only the small result goes back to the model to explain."
      ],
      "simple": "The first question for a 2 GB CSV is whether users want a lookup or an exact computation, because most questions on a CSV are totals, counts and filters. Pasting the file in is out, since that is hundreds of millions of tokens. Embedding every row fails too, because vector search returns similar rows and can't guarantee an exact total, and an approximately right total is worse than none.\n\nSo load the data into something that can query it accurately, such as DuckDB or a warehouse. The model gets the schema, column descriptions and a few sample values, never the data, and writes SQL. Your code validates and runs it read-only, then sends only the small result back. For example, 'total refund value in March by region' becomes one query whose small result the model turns into a sentence.\n\nVector search only fits free-text rows, such as support ticket descriptions.",
      "points": [
        "A 2 GB CSV is hundreds of millions to around a billion tokens - digits and delimiters tokenise poorly. Beyond size, it is the wrong tool: a model does not compute exact totals over raw rows.",
        "Do not embed rows for aggregation questions - retrieval cannot count, and an approximate sum is worse than none.",
        "Load into DuckDB or SQLite; put schema and sample values in the prompt, never the data.",
        "The model writes the query, you execute it, only the result set goes back.",
        "Pandas dataframe agents generate code - sandbox it: no filesystem, no network.",
        "Embed rows only when they are descriptive text: serialise each row to a sentence.",
        "The deciding question: is this a lookup or an aggregation?"
      ],
      "say": "The first question is whether users want a lookup or an exact computation, since that decides the design. Most questions on a CSV are totals, counts and filters. Vector search returns similar rows, so it can't guarantee an exact sum, and an approximately right total is worse than none. Pasting the file is out too, since 2 gigabytes of digits and delimiters is hundreds of millions of tokens. So I load it into DuckDB or a warehouse. The model gets the schema, column descriptions and a few sample values, never the data, and writes SQL. My code validates that query, runs it read-only with limits, and sends only the small result back for the model to explain. Chunking the CSV into a vector store demos fine on ten rows and gives silently wrong totals on ten million. Vector search only fits free-text columns, like support ticket descriptions. Generated Python instead of SQL would run in a real sandbox with no network, filesystem or credential access.",
      "numbers": "Do not estimate feasibility from file size alone. Sample the actual file and tokenizer if token count matters; for tabular analytics, the architecture should avoid sending the raw dataset to the model either way.",
      "wrong": "'I would chunk the CSV and put it in a vector store.' It demos well on ten rows and produces silently wrong totals on ten million. The panel is listening for whether you separate lookup from aggregation.",
      "follow": "The user asks something needing both a number from the table and an explanation from a policy PDF. What happens?",
      "followAnswer": "The router sends it down both paths. The table part becomes SQL against DuckDB, run read-only with limits, and returns the exact figure. The policy part goes to document retrieval over the PDF. Generation then gets both, the small result set and the retrieved clauses, and writes one answer that marks which figure came from the data and cites the policy section. If one depends on the other, like is this total above the policy limit, I run them in sequence and let code do the comparison."
    }
  ]
};
