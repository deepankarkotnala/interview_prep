# Topic-wise interview questions: gap analysis and additions

**Portal:** `0_interview_focused_portal`
**Date:** 18 August 2026
**Scope:** GenAI / AI / ML engineer roles, India market, 2–10 years experience.

---

## 1 · The verdict: not sufficient yet

The portal has **167 cards across 18 topics**. `PLAN.md §4` sets a target of
**≈505**. So the portal stands at **33% of its own stated bar**, and the plan
already says so in §8 - counts are "below the wave-2 targets by design."

That design decision was right for launch. It is now the binding constraint.
Here is why the current depth does not clear an Indian AI/ML interview loop:

| Symptom | What the count causes |
| --- | --- |
| **Rehearsal repeats too fast** | 167 cards across a 4-round loop means a candidate cycling the portal for two weeks sees every card 6–8 times. Recall replaces understanding - the exact failure the portal was built to prevent. |
| **No second question on a theme** | An interviewer never asks "what is chunking?" and stops. They ask it, then push twice. Most topics carry the opener but not the two follow-ups, so the card teaches the answer that ends the conversation, not the one that survives it. |
| **Thin topics are the ones that decide offers** | MCP (6), Python coding (6), cloud (6), fine-tuning (7), cost-latency (7). These are exactly where product-company and services panels concentrate. A 6-card topic is a demo, not preparation. |
| **Coding round is effectively uncovered** | 6 cards for topic 17. An Indian AI/ML loop almost always has a live coding or debugging round. This is the single largest risk in the portal. |
| **ML fundamentals under-weighted** | 8 cards. Every services company (TCS, Infosys, Wipro, Cognizant) and most product panels still open with classical ML before touching GenAI. |

### Per-topic gap table

| # | Topic | Now | Target | Gap | Priority |
| --- | --- | ---: | ---: | ---: | --- |
| 01 | LLM foundations | **16** | 30 | −14 | Medium |
| 02 | Transformers and attention | **14** | 25 | −11 | Low |
| 03 | Prompting and structured output | 10 | 25 | −15 | Medium |
| 04 | Embeddings and vector DBs | 10 | 30 | −20 | High |
| 05 | RAG | **40** | 40 | **0 - done** | ~~Critical~~ |
| 06 | Advanced RAG | 10 | 25 | −15 | Medium |
| 07 | Agents | **35** | 35 | **0 - done** | ~~Critical~~ |
| 08 | LangChain and LangGraph | 12 | 30 | −18 | High |
| 09 | MCP and A2A | 6 | 20 | −14 | Medium |
| 10 | Fine-tuning | 7 | 25 | −18 | High |
| 11 | Evaluation | 10 | 30 | −20 | High |
| 12 | LLMOps and observability | 8 | 25 | −17 | High |
| 13 | Guardrails and responsible AI | 8 | 30 | −22 | High |
| 14 | Cost, latency, serving | 7 | 25 | −18 | High |
| 15 | Cloud and deployment | 6 | 25 | −19 | Medium |
| 16 | ML fundamentals | **30** | 30 | **0 - done** | ~~Critical~~ |
| 17 | Python and coding round | **30** | 30 | **0 - done** | ~~Critical~~ |
| 18 | System design and behavioural | **21** | 25 | −4 | Low |
| | **Total** | **280** | **505** | **−225** | |

### Recommended sequence

1. **Wave 5 - the four critical topics.** 17 (coding), 16 (ML fundamentals),
   05 (RAG), 07 (agents). ~90 cards. These decide more offers than the other
   fourteen topics combined.
2. **Wave 6 - the high-priority eight.** 01, 04, 08, 10, 11, 12, 13, 14.
   ~150 cards.
3. **Wave 7 - the remainder.** 02, 03, 06, 09, 15, 18. ~100 cards.

A realistic working floor is **~20 cards per topic (≈360 total)**, not 505. Below
20, a topic cannot carry an opener plus two follow-up depths plus a failure
story. The 505 target is the ceiling to grow into, not a gate.

---

## 2 · House style for every question below

Each new card must fill the same eleven slots the existing cards use
(`id, q, round, level, tags, why, simple, say, numbers, wrong, follow`) and pass
`node tools/check.js`. The `say` slot stays between 50 and 85 words.

**CampusX teaching style**, as the plan defines it in §2:

- **Start from the problem, not the definition.** "Why does this exist?" before
  "what is it?" - the learner should feel the pain the technique solves.
- **One concrete analogy is allowed, in the `simple` slot only.** Never in `say`,
  where precision decides the outcome.
- **Build up in layers.** Intuition → mechanism → the number → the failure mode.
- **Indian context where it is real** - rupee costs, Hindi/Tamil tokenisation,
  data residency, the services-company delivery framing.
- **Name the wrong answer explicitly.** Every card ends by telling the learner
  what a weak candidate says and why it loses the room.
- **Speak it, don't read it.** The `say` slot is what the candidate actually
  delivers out loud.

---

## 3 · Questions to add, by topic

Questions already in the portal are **not** repeated here. Everything below is
new. `L` marks the level band (`0-2`, `2-5`, `5-10`, `10+`) and `R` the rounds
(`screening`, `tech1`, `tech2`, `design`, `hiring-manager`).

### Topic 01: LLM foundations (add 20)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | What are temperature, top-p and top-k actually doing to the probability distribution? | 2-5 | tech1 | Draw the distribution, then flatten it. Explain why setting both temperature and top-p is usually confused thinking. |
| 2 | Why does temperature 0 still not give identical outputs? | 5-10 | tech1 | Batching non-determinism and floating-point reduction order on GPU. The senior answer that surprises panels. |
| 3 | What is a logit, and what does softmax do to it? | 2-5 | tech1 | The one piece of maths worth knowing cold. Score becomes probability. |
| 4 | Explain perplexity. Would you use it to pick a model? | 5-10 | tech2 | Intuition first (how surprised is the model), then why it is near-useless for ranking instruct models on your task. |
| 5 | What is BPE, and why does the tokeniser matter for Indian languages? | 2-5 | tech1 | Merge-frequency intuition, then the rupee cost of Devanagari against Latin script. |
| 6 | Greedy decoding vs beam search - why has beam search largely disappeared in LLM serving? | 5-10 | tech2 | Latency and diversity trade-off. Why it survives in translation but not chat. |
| 7 | Explain what reasoning models do differently at inference. | 5-10 | tech1 | Thinking tokens as a compute-at-inference lever, and the cost consequence. |
| 8 | What is the difference between pre-training, continued pre-training, instruction tuning and alignment? | 2-5 | tech1 | The four-stage pipeline as one clean mental ladder. |
| 9 | What does knowledge cutoff mean and how do you engineer around it? | 0-2 | screening | Cheapest question in the set - the follow-up about RAG vs tools is the real one. |
| 10 | Why do models struggle with arithmetic and character counting? | 2-5 | tech1 | Tokenisation as the root cause. Ties back to the first card of the topic. |
| 11 | What is quantisation, and what does INT8 or INT4 actually cost you? | 5-10 | tech2 | Memory against quality trade curve. Where the knee sits. |
| 12 | Model parameters vs context - which one holds knowledge? | 2-5 | tech1 | Parametric and non-parametric memory - the frame that makes RAG obvious. |
| 13 | Your model refuses a legitimate business request. How do you debug it? | 5-10 | tech2 | Safety-tuning overshoot. Prompt reframing before model swap. |
| 14 | What is speculative decoding? | 5-10 | tech2 | Draft-then-verify. Why it is free latency with no quality loss. |
| 15 | Streaming vs non-streaming - what changes in your architecture? | 2-5 | tech1 | TTFT against total latency, and what streaming breaks (validation, guardrails). |
| 16 | What is a seed parameter and why is it not a reproducibility guarantee? | 5-10 | tech2 | Best-effort determinism. Pairs with question 2. |
| 17 | How do you count tokens before sending a request, and why not estimate? | 2-5 | tech1 | Practical: the tokeniser library, and the cost of a wrong estimate at scale. |
| 18 | Open-weight or closed API model - how do you actually decide? | 5-10 | design | Decision framework: data residency, cost curve, control, latency, team capacity. |
| 19 | What is the difference between a model and an endpoint or deployment? | 0-2 | screening | Trips up candidates on Azure OpenAI. Quota lives on the deployment. |
| 20 | Explain the trade-off between a large model and a small fine-tuned one. | 5-10 | design | The cost-per-request argument a hiring manager wants to hear. |

---

### Topic 02: Transformers and attention (add 17)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Walk me through the shapes in a single attention head. | 5-10 | tech2 | Q, K, V dimensions end to end. The whiteboard question. |
| 2 | Why divide by the square root of d_k in scaled dot-product attention? | 5-10 | tech2 | Variance grows with dimension, softmax saturates, gradients vanish. |
| 3 | Why multi-head instead of one big head? | 2-5 | tech1 | Different heads learn different relations. Subspace intuition. |
| 4 | What are MHA, MQA and GQA, and why did the industry move to GQA? | 5-10 | tech2 | KV cache size is the whole story. Connects to the existing KV-cache card. |
| 5 | What does the feed-forward layer do? Most parameters live there. | 5-10 | tech2 | Attention mixes, FFN thinks. Where knowledge is stored. |
| 6 | Why layer normalisation, and why did pre-norm replace post-norm? | 5-10 | tech2 | Training stability at depth. |
| 7 | What are residual connections doing? | 2-5 | tech1 | Gradient highway. One-line answer, asked to check fundamentals. |
| 8 | RoPE vs learned vs sinusoidal positional encoding - why did RoPE win? | 5-10 | tech2 | Relative position and extrapolation to longer contexts. |
| 9 | What is causal masking and where exactly is it applied? | 2-5 | tech1 | Prevents looking ahead. Mask before softmax, not after. |
| 10 | What is FlashAttention and why does it matter? | 5-10 | tech2 | IO-aware, not an approximation. Memory bandwidth is the bottleneck, not FLOPs. |
| 11 | Explain prefill vs decode as compute-bound and memory-bound. | 5-10 | tech2 | Deepens the existing first-token card into the serving argument. |
| 12 | What are scaling laws and what did Chinchilla change? | 5-10 | tech2 | Compute-optimal training. Why small models got much better. |
| 13 | How does a vision-language model process an image? | 5-10 | tech2 | Patches become tokens. Why images are expensive in token terms. |
| 14 | What is the embedding layer and why is it tied to the output layer? | 5-10 | tech2 | Weight tying and parameter economy. |
| 15 | Why is inference memory dominated by KV cache rather than weights at long context? | 5-10 | tech2 | Do the arithmetic live. The card should carry the formula. |
| 16 | What is a context-length extension technique like YaRN or position interpolation? | 10+ | tech2 | Only for research-adjacent roles. Mark clearly as optional depth. |
| 17 | Draw the full transformer block from memory. | 5-10 | tech2 | The synthesis card. Everything above in one diagram. |

---

### Topic 03: Prompting and structured output (add 15)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Zero-shot, few-shot, many-shot - what changed now that contexts are long? | 2-5 | tech1 | The curve flattens. Where the knee is. |
| 2 | What is self-consistency and what does it cost? | 5-10 | tech2 | Sample N, take the majority. N times the cost for a few points of accuracy. |
| 3 | Explain ReAct, chain-of-thought and tree-of-thought as one family. | 5-10 | tech2 | A ladder from linear to branching, with cost rising at each step. |
| 4 | How do you stop a model apologising or padding every answer? | 2-5 | tech1 | Practical prompt surgery. Negative instruction against positive framing. |
| 5 | What is a delimiter and why does it matter for injection defence? | 2-5 | tech1 | Structural separation of instruction and data. |
| 6 | How do you get a model to output a strict enum reliably? | 2-5 | tech1 | Constrained decoding, then validation, then retry. Three layers. |
| 7 | What is constrained or grammar-based decoding? | 5-10 | tech2 | Mask illegal tokens at sampling time. Why it beats prompt-and-pray. |
| 8 | Your JSON parses but the values are wrong. Now what? | 5-10 | tech2 | Schema validity is not semantic validity. The distinction seniors are tested on. |
| 9 | How do you design a system prompt for a multi-tenant product? | 5-10 | design | Shared base plus tenant overlay. Where injection risk enters. |
| 10 | How do you prompt for a task with no single right answer, like summary tone? | 5-10 | tech2 | Rubric in prompt, then rubric in eval. Pairs with the evaluation topic. |
| 11 | What is prompt caching and how do you structure a prompt to benefit from it? | 5-10 | tech2 | Static prefix first, variable content last. Direct rupee saving. |
| 12 | How do you migrate a prompt library when you change model provider? | 5-10 | design | The real task nobody prepares for. The eval set is the safety net. |
| 13 | What is meta-prompting or automated prompt optimisation, and would you use it? | 5-10 | tech2 | DSPy-style optimisation. When hand-tuning stops scaling. |
| 14 | How do you stop few-shot examples biasing the output toward the examples? | 5-10 | tech2 | Recency and format bias. Diversify examples deliberately. |
| 15 | Show me a prompt you are proud of and tell me why it works. | 5-10 | tech2 | The portfolio card. Forces a concrete artefact. |

---

### Topic 04: Embeddings and vector databases (add 20)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Why normalise embeddings, and what does it do to cosine against dot product? | 2-5 | tech1 | After normalising they rank identically. The clean insight. |
| 2 | What is the curse of dimensionality and does it actually hurt vector search? | 5-10 | tech2 | Nuanced: distances concentrate, but learned embeddings live on a manifold. |
| 3 | HNSW, IVF, ScaNN or flat - pick one for 1M, 100M and 10B vectors. | 5-10 | design | A decision table the candidate can reproduce. |
| 4 | What is product quantisation and what does it cost in recall? | 5-10 | tech2 | Compression intuition - codebooks as a lossy dictionary. |
| 5 | What is ef_search and how do you tune recall against latency? | 5-10 | tech2 | The single knob most asked about after HNSW. Show the curve. |
| 6 | What is a binary or int8 embedding and when is it worth it? | 5-10 | tech2 | Large memory reduction, small recall loss. The current cost lever. |
| 7 | What is Matryoshka representation learning? | 5-10 | tech2 | Truncate dimensions without retraining. Increasingly asked. |
| 8 | Why do dense embeddings fail on exact identifiers like part numbers? | 2-5 | tech1 | The motivating pain for hybrid search. Common in retail and manufacturing. |
| 9 | Explain sparse embeddings - BM25 and SPLADE. | 5-10 | tech2 | Lexical and learned-sparse as one family. |
| 10 | How do you chunk for embedding when a document has hierarchy? | 5-10 | tech2 | Parent-child and small-to-big retrieval. |
| 11 | What is the max sequence length of your embedding model and what happens beyond it? | 2-5 | tech1 | Silent truncation is the trap. Most candidates miss it. |
| 12 | How do you handle multilingual embeddings for an Indian product? | 5-10 | design | Cross-lingual alignment. Directly relevant to the market. |
| 13 | How do you A/B test two embedding models in production? | 5-10 | design | Dual index, shadow traffic, retrieval metrics. |
| 14 | What does a vector database give you that a NumPy array does not? | 2-5 | tech1 | Filtering, persistence, updates, scale. Honest answer: at 10k vectors, not much. |
| 15 | How do deletes and updates work in an HNSW index? | 5-10 | tech2 | Tombstones and rebuild cost. A real operational pain. |
| 16 | What is the pre-filter against post-filter problem? | 5-10 | tech2 | Deepens the existing metadata card into the recall-collapse failure. |
| 17 | How do you shard a vector index? | 10+ | design | Scale card. Ties to the 50M-document RAG design. |
| 18 | Explain recall@k, MRR and nDCG and when each is the right metric. | 5-10 | tech2 | Three metrics, three questions they answer. |
| 19 | Your embedding costs are four lakh rupees a month. How do you cut them? | 5-10 | design | Cache, truncate dimensions, batch, self-host. Rupee framing. |
| 20 | When is a knowledge graph a better index than a vector store? | 5-10 | design | Sets up GraphRAG in topic 06. |

---

### Topic 05: RAG: ✅ **BUILT** (28 added, now 44 cards)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Walk me through every stage of a RAG pipeline and name the failure mode of each. | 2-5 | tech1 | The spine card. Ingest, chunk, embed, index, retrieve, rerank, generate. |
| 2 | Fixed-size, recursive, semantic or document-aware chunking - defend your default. | 2-5 | tech1 | Deepens the existing chunking card into a defended choice. |
| 3 | How do you pick chunk size and overlap without guessing? | 2-5 | tech1 | Measure with a retrieval eval set. The anti-cargo-cult card. |
| 4 | What metadata do you attach to a chunk, and why each field? | 2-5 | tech1 | Source, page, section, date, ACL, version. Each earns its place. |
| 5 | How do you handle a 400-page document with a table of contents? | 5-10 | tech2 | Hierarchy-aware ingestion. Very common in BFSI and pharma. |
| 6 | Your retriever returns the right chunk at rank 8. The LLM misses it. Fix it. | 5-10 | tech2 | Rerank, or cut k. The lost-in-the-middle failure made concrete. |
| 7 | How do you decide k - how many chunks to pass? | 2-5 | tech1 | Recall against noise and cost. There is a measurable optimum. |
| 8 | The user asks something the corpus does not cover. What should happen? | 2-5 | tech1 | Refusal design. The most-skipped requirement in RAG demos. |
| 9 | How do you handle multi-turn conversation in RAG? | 5-10 | tech2 | Query contextualisation - resolving "what about the second one?" |
| 10 | How do you build the retrieval eval set when you have no labelled data? | 5-10 | tech2 | Synthetic question generation from chunks, then human spot-check. |
| 11 | What is context precision against context recall? | 5-10 | tech2 | The two RAGAS metrics that actually diagnose. |
| 12 | How do you ingest from SharePoint, Confluence and a shared drive at once? | 5-10 | design | Connector reality. Enterprise India interviews love this. |
| 13 | How do you handle document versioning where an old policy is superseded? | 5-10 | design | Recency and validity metadata. A real BFSI failure. |
| 14 | Your corpus is 60% Hindi, 40% English. What changes in the pipeline? | 5-10 | design | Multilingual embedding, cross-lingual retrieval, tokeniser cost. |
| 15 | How do you deal with near-duplicate documents flooding the top-k? | 5-10 | tech2 | Dedup and MMR diversity. |
| 16 | What is MMR and when do you use it? | 5-10 | tech2 | Relevance against diversity as one tunable. |
| 17 | How do you cite at sentence level rather than document level? | 5-10 | design | Span attribution. What regulated buyers demand. |
| 18 | How do you measure whether the answer is actually grounded in the retrieved context? | 5-10 | tech2 | Faithfulness scoring. Pairs with the hallucination card. |
| 19 | What is the cost model of a RAG request, line by line? | 5-10 | design | Embedding, retrieval, rerank, generation. Rupees per thousand requests. |
| 20 | How do you make a RAG system respond in under two seconds? | 5-10 | design | Parallel retrieval, cached embeddings, smaller reranker, streaming. |
| 21 | How would you migrate a RAG system from Pinecone to pgvector? | 5-10 | design | Practical migration with dual-write and shadow evaluation. |
| 22 | How do you handle images and charts inside documents in the answer? | 5-10 | tech2 | Multimodal ingestion, or caption-and-index. |
| 23 | Your RAG worked in the pilot and failed at 100 users. What broke? | 5-10 | design | Index size, latency, corpus diversity, query diversity. Scale story. |
| 24 | If you could only fix one thing in a badly performing RAG system, what would you check first? | 5-10 | tech2 | Forces prioritisation. Retrieval quality, almost always. |
| 25 | The client wants a summary of 5,000 pages. Walk me through it. | 5-10 | tech2 | Summarisation is not retrieval. Map-reduce, tree reduce, cost per page. |
| 26 | Two retrieved documents contradict each other. What should the system do? | 5-10 | tech2 | Triage superseded vs scoped vs genuine. Never let the model arbitrate. |
| 27 | Your input is PDFs, Word files, Excel sheets, images and CSVs. Design the ingestion. | 5-10 | tech1/tech2 | Router + per-format parsers + one normalised document. The real enterprise brief. |
| 28 | A single 800-page scanned PDF has to be ingested. Walk me through it. | 5-10 | tech2 | Batch job not a parse. OCR confidence, resume, reconstructed structure. |

---

### Topic 06: Advanced RAG (add 15: 3 built: see #16-18)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | What is multi-query retrieval and what does it cost? | 5-10 | tech2 | Fan out, union, dedup. Recall improvement per rupee. |
| 2 | What is RAG-Fusion and reciprocal rank fusion? | 5-10 | tech2 | The one merge formula worth memorising. |
| 3 | Explain the tuning of hybrid search weights between dense and sparse. | 5-10 | tech2 | Alpha as a tunable, set by eval not by feel. |
| 4 | What is a late-interaction model like ColBERT? | 10+ | tech2 | Token-level matching. Between bi-encoder and cross-encoder. |
| 5 | What is self-RAG or corrective RAG? | 5-10 | tech2 | The model grades its own retrieval and retries. |
| 6 | How do you decide whether to retrieve at all for a given query? | 5-10 | tech2 | A routing classifier. Saves cost and latency on chitchat. |
| 7 | What is a small-to-big or parent-document retriever? | 5-10 | tech2 | Embed small for precision, return large for context. |
| 8 | What is a sentence-window retriever? | 5-10 | tech2 | Retrieve the sentence, expand the neighbours. |
| 9 | How do you build RAG that answers aggregate questions like "how many contracts expire in March"? | 5-10 | design | The card that exposes RAG's real limit - this needs SQL, not retrieval. |
| 10 | What is text-to-SQL and how do you make it safe? | 5-10 | design | Read-only role, schema in prompt, query validation, row limits. |
| 11 | How do you route between a vector store, a SQL database and a web search? | 5-10 | design | Router design. The realistic modern architecture. |
| 12 | What is a semantic cache and how do you avoid a wrong cache hit? | 5-10 | tech2 | Similarity threshold and its failure mode. Deepens the existing cache card. |
| 13 | How do you evaluate a reranker independently of the retriever? | 5-10 | tech2 | Isolate the stage. Measure ranking lift on a fixed candidate set. |
| 14 | When does the added complexity of advanced RAG stop paying? | 5-10 | design | The senior card. Complexity budget as an engineering argument. |
| 15 | Compare a long-context model with a RAG pipeline on cost, latency and accuracy for a 500-page corpus. | 5-10 | design | Run the numbers live. The most-asked architecture debate. |
| 16 | You are handed a 2 GB CSV. How do you let an LLM answer questions about it? ✅ **BUILT** | 5-10 | tech1/tech2 | Schema not data. DuckDB + text-to-SQL; why embedding rows breaks aggregation. |
| 17 | Your database has 200 tables. The schema does not fit in the prompt. Now what? ✅ **BUILT** | 5-10 | tech2 | Schema retrieval, FK graph, curated view layer. The demo-to-prod gap. |
| 18 | When would you use a knowledge graph instead of a vector store? ✅ **BUILT** | 5-10 | tech2 | Similarity vs connection. Entity resolution is the hidden cost. |

---

### Topic 07: Agents: ✅ **BUILT** (23 added, now 35 cards)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | What is the difference between a workflow and an agent, and which do you default to? | 5-10 | design | The defining modern distinction. Default to workflow - say why. |
| 2 | Explain the difference between function calling and an agent loop. | 2-5 | tech1 | One call against iterate-until-done. |
| 3 | How does a model decide which tool to call? | 2-5 | tech1 | The schema and description are the whole interface. |
| 4 | How do you write a tool description that the model gets right? | 2-5 | tech1 | Practical, high-value card. Describe when to use it, not just what it does. |
| 5 | What do you return to the model when a tool fails? | 5-10 | tech2 | Actionable error text against a stack trace. Recovery design. |
| 6 | How do you handle parallel tool calls? | 5-10 | tech2 | Independence detection, concurrency, result ordering. |
| 7 | What is planning against reactive execution in an agent? | 5-10 | tech2 | Plan-and-execute against ReAct. Trade-offs of each. |
| 8 | How do you handle an agent that needs 40 steps? | 5-10 | design | Context management, sub-agents, compaction, checkpoints. |
| 9 | What is context compaction and when does it lose something important? | 5-10 | tech2 | Summarise-and-continue and its risks. |
| 10 | Short-term, long-term, episodic, semantic memory - make the distinction concrete. | 5-10 | tech2 | Deepens the existing memory card with a taxonomy that survives follow-ups. |
| 11 | How do you decide what an agent should remember across sessions? | 5-10 | design | Write policy, not just read policy. Most candidates only discuss reading. |
| 12 | How do you give an agent access to a database safely? | 5-10 | design | Least privilege, read replicas, query allowlists. |
| 13 | What is the difference between supervisor, swarm and hierarchical multi-agent patterns? | 5-10 | design | Three named patterns with a use case each. |
| 14 | How do agents hand off context to each other without losing information? | 5-10 | design | The main multi-agent failure mode. |
| 15 | How do you estimate the cost of an agent run before you build it? | 5-10 | design | Steps times tokens times price. The arithmetic hiring managers want. |
| 16 | What is your termination policy - list every condition. | 5-10 | tech2 | Max steps, max cost, max time, repeated state, confidence. |
| 17 | How do you make an agent run reproducible for debugging? | 5-10 | tech2 | Trace, seed, tool-call recording, replay. |
| 18 | How do you test an agent in CI when every run differs? | 5-10 | tech2 | Mock tools, assert trajectory properties, not exact output. |
| 19 | What is trajectory evaluation against final-answer evaluation? | 5-10 | tech2 | Deepens the existing agent-eval card. |
| 20 | Your agent called a delete endpoint in production. Walk me through prevention. | 5-10 | design | Confirmation gates, dry-run, scoped credentials, undo. Safety design. |
| 21 | How do you handle an agent that must wait hours for a human approval? | 5-10 | design | Durable state and resumption. Connects to checkpointers in topic 08. |
| 22 | What is computer use or browser automation, and what breaks? | 5-10 | tech2 | Emerging capability, honest limitations. |
| 23 | Design an agent for insurance claim processing. Name every guardrail. | 5-10 | design | The synthesis card, in an India-relevant domain. |

---

### Topic 08: LangChain and LangGraph (add 18)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | What are the core LangChain abstractions and which do you actually use? | 2-5 | tech1 | Honest map. Many are legacy - say which. |
| 2 | What is a Runnable and what interface does everything share? | 2-5 | tech1 | invoke, batch, stream, astream. One interface explains the whole library. |
| 3 | Sync, async, batch and stream - when do you use each? | 5-10 | tech2 | Ties to the Python async topic. |
| 4 | How do you build a custom retriever or custom tool? | 2-5 | tech1 | Practical extension point. |
| 5 | What is a conditional edge in LangGraph and how do you write one? | 5-10 | tech2 | Routing as a pure function of state. |
| 6 | How do cycles work in a LangGraph and how do you bound them? | 5-10 | tech2 | The reason the graph exists. Recursion limit as the safety net. |
| 7 | What is the difference between a state graph and a message graph? | 5-10 | tech2 | Custom state against append-only messages. |
| 8 | How do you write a reducer for a custom state field? | 5-10 | tech2 | Deepens the existing state card into code. |
| 9 | What happens to state when two parallel nodes write the same key? | 5-10 | tech2 | Concurrency conflict - a real LangGraph gotcha. |
| 10 | What is a subgraph and when do you use one? | 5-10 | design | Composition and reuse. |
| 11 | How do you persist checkpoints to Postgres for production? | 5-10 | design | Deepens the checkpointer card into a deployment answer. |
| 12 | What is a thread id and how does it map to a user session? | 5-10 | tech2 | Multi-tenant memory boundary. Security-relevant. |
| 13 | How do you implement time travel or replay from a checkpoint? | 5-10 | tech2 | Debugging superpower most candidates cannot describe. |
| 14 | What is LangGraph Platform or a self-hosted deployment, and do you need it? | 5-10 | design | Honest build-against-buy answer. |
| 15 | How do you handle errors and retries at node level? | 5-10 | tech2 | Node-level policy against global try/except. |
| 16 | LlamaIndex against LangChain - when would you pick the other one? | 5-10 | design | Shows breadth. LlamaIndex is stronger on ingestion and indexing. |
| 17 | How do you keep framework upgrades from breaking production? | 5-10 | design | Pinning, eval gates, adapter layer. A real pain with these libraries. |
| 18 | Convert this chain into a graph on the whiteboard. | 5-10 | tech2 | Live-conversion exercise. Tests real understanding. |

---

### Topic 09: MCP and A2A (add 14)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Explain the MCP architecture - host, client, server. | 2-5 | tech1 | The three-part map. Most candidates blur client and host. |
| 2 | What are tools, resources and prompts in MCP, and how do they differ? | 2-5 | tech1 | The three primitives. Model-controlled against app-controlled. |
| 3 | stdio against HTTP transport - when do you use each? | 5-10 | tech2 | Local against remote. Deployment consequence. |
| 4 | How does authentication work for a remote MCP server? | 5-10 | design | OAuth flow and token scoping. The enterprise blocker. |
| 5 | What is tool poisoning and how would you detect it? | 5-10 | tech2 | Malicious description injection. The main novel MCP risk. |
| 6 | How do you handle tool-name collisions across multiple servers? | 5-10 | tech2 | Namespacing. A real operational problem. |
| 7 | How do you version an MCP server without breaking clients? | 5-10 | design | Schema evolution and backward compatibility. |
| 8 | How do you test an MCP server? | 5-10 | tech2 | Inspector, contract tests, integration tests. |
| 9 | What is sampling in MCP and why is it controversial? | 10+ | tech2 | Server asks the client for model access. Trust boundary inversion. |
| 10 | How do you limit which MCP tools a given user can reach? | 5-10 | design | Per-user tool filtering. Multi-tenant requirement. |
| 11 | How does MCP change your observability story? | 5-10 | design | Tracing across the process boundary. |
| 12 | Would you expose your production database through MCP? Defend your answer. | 5-10 | design | Judgement card. The right answer is heavily qualified. |
| 13 | How does A2A differ from MCP in the problem it solves? | 5-10 | tech2 | Deepens the existing card: tools against peer agents. |
| 14 | Build an MCP server for our internal ticketing system - design it out loud. | 5-10 | design | Synthesis card. Tool granularity is the real test. |

---

### Topic 10: Fine-tuning (add 18)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Explain the LoRA rank and alpha parameters - what do they actually control? | 5-10 | tech2 | Capacity and scaling. Deepens the existing LoRA card. |
| 2 | What is QLoRA and what does the 4-bit quantisation cost you? | 5-10 | tech2 | Fine-tune a large model on one GPU. The India-budget answer. |
| 3 | Which layers do you apply LoRA to, and why not all of them? | 5-10 | tech2 | Attention projections first. Diminishing returns. |
| 4 | How do you build a fine-tuning dataset from production logs? | 5-10 | design | Collection, filtering, dedup, human review. The real workflow. |
| 5 | How do you split train, validation and test for a fine-tune, and what leaks? | 5-10 | tech2 | Ties to the data-leakage card in ML fundamentals. |
| 6 | What hyperparameters do you actually tune, and what are sane defaults? | 5-10 | tech2 | LR, epochs, batch size, warmup. Give the numbers. |
| 7 | How do you know when to stop training? | 5-10 | tech2 | Validation loss against eval-set performance. They diverge. |
| 8 | What is instruction masking and why does it matter for loss? | 10+ | tech2 | Train on completion only, not on the prompt. |
| 9 | Explain DPO mechanically - what does the loss do? | 5-10 | tech2 | Preference pairs without a reward model. Deepens the SFT/DPO card. |
| 10 | What is GRPO or RLVR, and when is verifiable reward possible? | 10+ | tech2 | Current frontier. Only for research-leaning roles. |
| 11 | How do you evaluate a fine-tuned model against the base model fairly? | 5-10 | tech2 | Held-out set plus regression check on general ability. |
| 12 | Your fine-tune improved the target task and broke everything else. Diagnose it. | 5-10 | tech2 | Deepens catastrophic forgetting into a debugging story. |
| 13 | How do you serve many LoRA adapters efficiently on one base model? | 5-10 | design | Multi-adapter serving. A genuine cost win worth naming. |
| 14 | What GPU do you need, and what does it cost in India per month? | 5-10 | design | A100 and H100 pricing, cloud against colocation. Concrete rupees. |
| 15 | Continued pre-training against fine-tuning - when do you need the former? | 5-10 | design | New domain vocabulary or a new language. |
| 16 | How would you fine-tune for a low-resource Indian language? | 5-10 | design | Tokeniser extension, data scarcity, transfer. Market-relevant. |
| 17 | What is model merging and would you use it? | 10+ | tech2 | Combine adapters. Emerging, cheap, worth knowing. |
| 18 | Make the business case for fine-tuning against prompting to a CFO. | 5-10 | hiring-manager | Break-even volume arithmetic. The senior framing. |

---

### Topic 11: Evaluation (add 20)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | What is the difference between an eval, a test and a benchmark? | 2-5 | tech1 | Vocabulary card. Sets up everything else. |
| 2 | How many examples does a golden set need to be trustworthy? | 5-10 | tech2 | Statistical intuition, not a magic number. Confidence intervals. |
| 3 | How do you stop your golden set going stale? | 5-10 | design | Refresh policy, drawn from production failures. |
| 4 | What are position bias, verbosity bias and self-preference bias in LLM judges? | 5-10 | tech2 | Name three, give the mitigation for each. Deepens the judge card. |
| 5 | How do you validate that your judge agrees with humans? | 5-10 | tech2 | Agreement rate on a labelled subset. The step everyone skips. |
| 6 | Pairwise comparison against absolute scoring - which is more reliable? | 5-10 | tech2 | Pairwise is more consistent. Explain why. |
| 7 | How do you write a judge rubric that produces consistent scores? | 5-10 | tech2 | Concrete anchors per score level. |
| 8 | What is RAGAS and what does each of its metrics actually measure? | 2-5 | tech1 | Faithfulness, relevancy, precision, recall. One line each. |
| 9 | How do you evaluate a multi-turn conversation? | 5-10 | tech2 | Turn-level against session-level, and goal completion. |
| 10 | How do you evaluate for safety and toxicity? | 5-10 | design | Red-team set plus a classifier. Ties to guardrails. |
| 11 | How do you build an eval set for a domain where only three experts exist? | 5-10 | design | Expert time is the constraint. Prioritise ruthlessly. |
| 12 | What is inter-annotator agreement and why should you measure it? | 5-10 | tech2 | If humans disagree, your ceiling is capped. |
| 13 | How do you detect regression when scores are noisy? | 5-10 | tech2 | Repeat runs, variance, significance. Prevents chasing noise. |
| 14 | What is a canary or shadow evaluation in production? | 5-10 | design | Evaluate before users see it. |
| 15 | How do you evaluate latency and cost alongside quality? | 5-10 | design | Three-axis scorecard. No single number. |
| 16 | What online signals actually correlate with quality? | 5-10 | design | Thumbs, edits, escalation, retry, abandonment. Rank them. |
| 17 | Your judge scores rose after a prompt change but users complained. Explain. | 5-10 | tech2 | The judge learned the new style. Deepens the offline/online card. |
| 18 | How do you evaluate a system where the model calls tools? | 5-10 | tech2 | Tool-choice accuracy, argument accuracy, outcome. |
| 19 | What is the eval-driven development loop, concretely? | 5-10 | design | Fail, fix, add to set, gate. The workflow answer. |
| 20 | Show me an eval report you would send to leadership. | 5-10 | hiring-manager | Communication card. Business metric first, technical second. |

---

### Topic 12: LLMOps and observability (add 17)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | What is a span, a trace and a session, and how do they nest? | 2-5 | tech1 | The OpenTelemetry vocabulary applied to LLM apps. |
| 2 | Langfuse, LangSmith, Arize or Phoenix - how would you choose? | 5-10 | design | Self-host against SaaS, data residency, cost. India-relevant. |
| 3 | How do you trace across a multi-service architecture? | 5-10 | design | Context propagation. Where traces break. |
| 4 | What do you log when the input contains PII? | 5-10 | design | Redaction at the edge, or hashed reference. Ties to guardrails. |
| 5 | How do you sample traces at high volume without losing the failures? | 5-10 | design | Head against tail sampling. Always keep errors. |
| 6 | What alerts do you set, and what threshold for each? | 5-10 | design | Error rate, p95, cost per hour, refusal rate. Give numbers. |
| 7 | How do you detect prompt drift or silent model change? | 5-10 | design | Continuous eval on a canary set. |
| 8 | How do you build a cost dashboard broken down by feature and tenant? | 5-10 | design | Attribution requires tagging at call time. Design it upfront. |
| 9 | What does a blue-green or canary deployment look like for a prompt? | 5-10 | design | Deepens the safe-deploy card with concrete mechanics. |
| 10 | How do you roll back a prompt in under five minutes? | 5-10 | design | Config-driven prompts, not code-deployed. |
| 11 | What is a feature flag strategy for GenAI features? | 5-10 | design | Per-tenant, per-user, percentage rollout. |
| 12 | How do you run a post-mortem for a non-deterministic system? | 5-10 | design | You cannot reproduce - so what replaces reproduction? Traces. |
| 13 | What is your on-call runbook for a GenAI service? | 5-10 | design | The document a senior engineer is expected to have written. |
| 14 | How do you manage secrets and API keys across environments? | 2-5 | tech1 | Basic but frequently asked in enterprise loops. |
| 15 | How do you handle a model deprecation notice with 60 days warning? | 5-10 | design | Migration plan with an eval gate. Happens constantly. |
| 16 | What SLOs would you set for a GenAI feature? | 5-10 | design | Availability, latency, quality. Quality SLOs are the hard part. |
| 17 | How do you build a feedback loop from production failures into the eval set? | 5-10 | design | The flywheel. Connects topics 11 and 12. |

---

### Topic 13: Guardrails and responsible AI (add 22)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Walk through the OWASP Top 10 for LLM applications. | 5-10 | tech2 | The named framework enterprise panels expect. |
| 2 | Direct against indirect prompt injection - why is the second one harder? | 5-10 | tech2 | Deepens the existing card. The attacker is not the user. |
| 3 | Why can prompt injection not be fully solved by prompting? | 5-10 | tech2 | Instructions and data share one channel. The architectural answer. |
| 4 | What is the dual-LLM or privileged-unprivileged pattern? | 10+ | design | A real architectural mitigation. Impresses security-minded panels. |
| 5 | What is jailbreaking and how does it differ from injection? | 2-5 | tech1 | Bypass safety against hijack instructions. Commonly conflated. |
| 6 | How do you detect PII in free text at scale? | 5-10 | design | NER plus regex plus a classifier. Presidio as the named tool. |
| 7 | What is tokenisation or masking of PII before the model call? | 5-10 | design | Replace, call, re-substitute. The pattern regulated buyers want. |
| 8 | What does DPDP Act compliance mean for a GenAI system in India? | 5-10 | design | Consent, purpose limitation, erasure. Highly market-specific. |
| 9 | How do you honour a data-deletion request when data is in a vector index? | 5-10 | design | Right to erasure against index immutability. A genuinely hard problem. |
| 10 | How do you prevent training on customer data by accident? | 5-10 | design | Contract terms, endpoint choice, zero-retention flags. |
| 11 | Where do you put a guardrail - input, output or both, and what does each cost? | 2-5 | tech1 | Deepens the output-guardrail card with latency accounting. |
| 12 | How do you guardrail a streaming response? | 5-10 | tech2 | You cannot validate what you already sent. Buffer against risk. |
| 13 | What is a canary token for detecting system-prompt leakage? | 5-10 | tech2 | Practical detection trick. |
| 14 | How do you red-team your own application? | 5-10 | design | Systematic attack taxonomy, not ad-hoc poking. |
| 15 | What is model refusal calibration - too strict against too loose? | 5-10 | tech2 | Both directions are failures. Measure both. |
| 16 | How do you handle hate speech and toxicity in Indian languages? | 5-10 | design | Classifiers are weak outside English. An honest, market-relevant answer. |
| 17 | What is fairness testing for an LLM feature, concretely? | 5-10 | design | Slice evaluation by group. Concrete, not philosophical. |
| 18 | How would you audit a GenAI system for a regulator? | 5-10 | design | Traceability, versioning, human oversight, documentation. |
| 19 | What is a model card and would you write one? | 5-10 | design | Documentation practice. Increasingly contractual. |
| 20 | How do you handle a user who tries to get medical or legal advice? | 2-5 | tech1 | Scope refusal plus escalation design. |
| 21 | What is excessive agency in the OWASP list and how do you limit it? | 5-10 | design | Ties directly to agent tool permissions in topic 07. |
| 22 | A user says the model gave them wrong information and they lost money. What is your process? | 5-10 | hiring-manager | Incident response with a real-world consequence. |

---

### Topic 14: Cost, latency and serving (add 18)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Define TTFT, TPOT, throughput and total latency, and say which the user feels. | 2-5 | tech1 | The four numbers. Users feel TTFT most. |
| 2 | How do you set a latency budget across a RAG pipeline stage by stage? | 5-10 | design | Allocate milliseconds per stage. The design-round card. |
| 3 | What is the difference between prompt cache and semantic cache? | 5-10 | tech2 | Exact-prefix against similarity. Different hit rates and risks. |
| 4 | What cache hit rate should you expect and how do you raise it? | 5-10 | design | Prompt structure determines it. Give realistic numbers. |
| 5 | Explain PagedAttention and why vLLM is faster. | 5-10 | tech2 | Memory fragmentation as the bottleneck. Deepens the batching card. |
| 6 | What is tensor parallelism against pipeline parallelism? | 10+ | tech2 | Multi-GPU serving. For infrastructure-leaning roles. |
| 7 | How many concurrent users can one A100 serve for a 7B model? | 5-10 | design | Do the arithmetic live. Candidates who can are rare. |
| 8 | What is the break-even volume between an API and self-hosting? | 5-10 | design | The rupee calculation. The most practical card in the topic. |
| 9 | How do you handle bursty traffic - a 10x spike at 9am? | 5-10 | design | Queue, autoscale, degrade. Provisioned against on-demand. |
| 10 | What is a provisioned throughput unit and when is it worth committing? | 5-10 | design | Azure and Bedrock reality. Enterprise-relevant. |
| 11 | How do you implement a fallback chain across providers? | 5-10 | design | Primary, secondary, degraded mode. Ties to outage handling. |
| 12 | What is a token bucket and how do you rate-limit per tenant? | 5-10 | design | Fair-share design in a multi-tenant product. |
| 13 | How do you make a cascade or router that is actually cheaper in practice? | 5-10 | design | Deepens the routing card - the escalation rate decides everything. |
| 14 | How do you measure cost per resolved query rather than cost per call? | 5-10 | hiring-manager | Business framing. Retries and escalations count. |
| 15 | What is batch API and when can you use it? | 2-5 | tech1 | Roughly half price, delayed. Great for offline jobs. |
| 16 | How do you reduce output tokens without truncating the answer? | 2-5 | tech1 | Format instruction and structured output. Output is the expensive half. |
| 17 | How does context caching change the economics of long system prompts? | 5-10 | design | Changes the design, not just the bill. |
| 18 | Your CFO asks why the GenAI bill doubled. Give the two-minute answer. | 5-10 | hiring-manager | Communication card. Attribution before explanation. |

---

### Topic 15: Cloud and deployment (add 19)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | How do quotas and TPM limits work on Azure OpenAI and how do you plan for them? | 5-10 | design | The most common production surprise on Azure. |
| 2 | What is a private endpoint and why does every enterprise ask for one? | 5-10 | design | Traffic never leaves the VNet. The compliance unlock. |
| 3 | How do you use managed identity instead of API keys? | 5-10 | design | Keyless auth. Standard enterprise expectation. |
| 4 | Which regions matter for an Indian customer and why? | 5-10 | design | Central India, South India, model availability gaps. Very specific. |
| 5 | What is Bedrock Guardrails and would you use it over your own? | 5-10 | design | Managed against custom. Honest trade-off. |
| 6 | What is a Bedrock knowledge base and when is it enough? | 5-10 | design | Managed RAG. Where it stops being enough. |
| 7 | What does Vertex AI give you that a raw Gemini API does not? | 5-10 | design | Grounding, tuning, evaluation, governance. |
| 8 | How do you deploy a fine-tuned open model on AWS or Azure? | 5-10 | design | SageMaker endpoint or AKS with vLLM. Concrete path. |
| 9 | Containerise a GenAI service - what goes in the image and what does not? | 5-10 | tech2 | Model weights outside the image. A common mistake. |
| 10 | How do you autoscale a GPU workload? | 5-10 | design | Cold start is the problem. Warm pools. |
| 11 | What does a Terraform module for a GenAI stack contain? | 5-10 | design | IaC expectation at senior level. |
| 12 | How do you run evaluation as a CI gate in Azure DevOps or GitHub Actions? | 5-10 | design | Deepens the existing CI/CD card with a concrete pipeline. |
| 13 | What is Databricks Vector Search and Model Serving? | 5-10 | design | Deepens the Databricks card. Many Indian enterprises are Databricks shops. |
| 14 | What is Unity Catalog and why does governance matter for GenAI? | 5-10 | design | Lineage and access control across data and models. |
| 15 | How do you handle multi-cloud when the client insists on it? | 5-10 | design | The services-company reality. Abstraction layer cost. |
| 16 | What is an air-gapped or on-premise GenAI deployment and what changes? | 5-10 | design | Defence, PSU banks, some healthcare. Open weights only. |
| 17 | How do you estimate infrastructure cost for a proposal? | 5-10 | hiring-manager | The consulting card. TCS, Infosys, Wipro loops ask this. |
| 18 | What monitoring do the cloud providers give you free, and what must you add? | 5-10 | design | Platform metrics against LLM-specific traces. |
| 19 | Design the deployment architecture for a 10,000-user internal assistant. | 5-10 | design | The synthesis card for the topic. |

---

### Topic 16: ML fundamentals: ✅ **BUILT** (22 added, now 30 cards)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Explain precision, recall and F1 with a real business trade-off. | 2-5 | tech1 | Fraud against spam. Which error costs more. |
| 2 | What is the ROC curve, and when is PR-AUC the better choice? | 2-5 | tech1 | Class imbalance changes the answer. |
| 3 | How do you pick a classification threshold? | 2-5 | tech1 | Business cost matrix, not 0.5. |
| 4 | Explain overfitting and every technique you would use against it. | 0-2 | screening | Regularisation, dropout, early stopping, more data, simpler model. |
| 5 | L1 against L2 regularisation - what is the geometric intuition? | 2-5 | tech1 | Corners against circles. Sparsity from L1. |
| 6 | Explain gradient descent and its variants. | 2-5 | tech1 | SGD, momentum, Adam. What each fixes. |
| 7 | What is the vanishing gradient problem and how was it solved? | 2-5 | tech1 | ReLU, residuals, normalisation. Ties to transformers. |
| 8 | How do decision trees split, and what does a random forest add? | 2-5 | tech1 | Gini or entropy, then variance reduction by bagging. |
| 9 | Explain gradient boosting. Why does XGBoost still win on tabular data? | 5-10 | tech2 | Sequential error correction. Still the honest answer for tables. |
| 10 | Bagging against boosting - bias or variance? | 2-5 | tech1 | Clean one-line distinction. |
| 11 | Explain k-means and how you choose k. | 2-5 | tech1 | Elbow, silhouette. Limitations of both. |
| 12 | What is PCA and when would you use it? | 2-5 | tech1 | Variance-preserving projection. Ties to embedding dimensionality. |
| 13 | How do you handle missing data? | 2-5 | tech1 | Why the missingness mechanism decides the method. |
| 14 | What is feature engineering and does it still matter? | 2-5 | tech1 | Yes for tabular, less for text. Honest and current. |
| 15 | Explain the difference between correlation and causation with a work example. | 2-5 | tech1 | Stakeholder-facing reasoning. |
| 16 | What is a p-value, and what does it not mean? | 5-10 | tech2 | Asked in A/B test discussions. Most candidates get it wrong. |
| 17 | How do you design an A/B test - sample size, duration, guardrail metrics? | 5-10 | design | Ties to the GenAI A/B card in topic 11. |
| 18 | Explain data drift against concept drift and how you detect each. | 5-10 | design | Deepens the degradation card with the right vocabulary. |
| 19 | What is a feature store and do you need one? | 5-10 | design | Training and serving skew is the real motivation. |
| 20 | Explain train-serve skew with an example of how it happened. | 5-10 | tech2 | The classic production ML failure. |
| 21 | What is SHAP and how do you read a SHAP plot? | 5-10 | tech2 | Deepens the explainability card to a named tool. |
| 22 | You have 500 labelled examples and need a classifier. LLM or fine-tuned BERT? | 5-10 | design | The modern practical decision. Cost, latency and accuracy. |

---

### Topic 17: Python and the coding round: ✅ **BUILT** (24 added, now 30 cards)

This is the largest single gap in the portal and the highest-risk topic. Each
card should carry runnable code in the `simple` slot and a stated complexity.

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Implement cosine similarity from scratch with NumPy, then vectorise it. | 2-5 | tech1 | The single most-asked AI coding question in Indian loops. |
| 2 | Implement top-k retrieval over a matrix of embeddings. | 2-5 | tech1 | argpartition against full sort. State the complexity. |
| 3 | Write a text chunker with configurable size and overlap. | 2-5 | tech1 | Off-by-one errors are the whole test. |
| 4 | Implement a token-aware chunker that never splits mid-sentence. | 5-10 | tech2 | Harder variant. Boundary logic. |
| 5 | Implement exponential backoff with jitter from scratch. | 2-5 | tech1 | Deepens the existing retry card into an implementation. |
| 6 | Write a rate limiter - token bucket or sliding window. | 5-10 | tech2 | Very common. Thread safety is the follow-up. |
| 7 | Implement an LRU cache without functools. | 2-5 | tech1 | OrderedDict or dict plus a linked list. Classic. |
| 8 | Write a semantic cache with a similarity threshold. | 5-10 | tech2 | Applied version of the LRU question. |
| 9 | Parse streaming SSE output from an LLM API. | 5-10 | tech2 | Buffering and partial JSON. Practical and discriminating. |
| 10 | Implement a function that batches API calls with a concurrency limit. | 5-10 | tech2 | asyncio.Semaphore and gather. Deepens the async card. |
| 11 | Write an async pipeline where stage two starts before stage one finishes. | 5-10 | tech2 | Queues and producer-consumer. |
| 12 | Explain the GIL and when multiprocessing beats threading for AI workloads. | 5-10 | tech2 | IO-bound against CPU-bound. Frequently asked. |
| 13 | Implement a sliding-window conversation trimmer that respects a token budget. | 5-10 | tech2 | Directly applies topic 01. |
| 14 | Write a Pydantic model with a custom validator for an LLM output schema. | 2-5 | tech1 | Deepens the existing Pydantic card. |
| 15 | Parse JSON from a model response that wraps it in markdown fences. | 2-5 | tech1 | The most common real-world parsing bug. |
| 16 | Implement reciprocal rank fusion to merge two ranked lists. | 5-10 | tech2 | Short, elegant, and it connects to topic 06. |
| 17 | Write BM25 scoring from scratch. | 5-10 | tech2 | Tests whether hybrid search is understood or recited. |
| 18 | Implement a simple vector store class with add, search and delete. | 5-10 | tech2 | Design question disguised as coding. |
| 19 | Write a decorator that logs latency and token usage for any LLM call. | 5-10 | tech2 | Decorators plus observability. Two topics in one card. |
| 20 | Mock an LLM API in pytest and test the retry path. | 5-10 | tech2 | Deepens the existing testing card into code. |
| 21 | Debug this code - it deadlocks under concurrency. | 5-10 | tech2 | Debugging round. Provide broken code in the card. |
| 22 | This retrieval function is O(n) per query. Make it faster. | 5-10 | tech2 | Optimisation round with a stated target. |
| 23 | Two sum, group anagrams, merge intervals - the DSA baseline you still get. | 2-5 | tech1 | Honest card: product companies still ask these. Link to the DSA portal. |
| 24 | Write a FastAPI endpoint that streams an LLM response. | 5-10 | tech2 | The most realistic take-home task in this market. |

---

### Topic 18: System design and behavioural (add 12)

| # | Question | L | R | Teaching angle |
| ---: | --- | --- | --- | --- |
| 1 | Design a document intelligence platform for an insurance company. | 5-10 | design | Ingestion-heavy design. India-relevant vertical. |
| 2 | Design a multilingual customer assistant for tier-2 and tier-3 cities. | 5-10 | design | Language, latency, cost, and low-bandwidth constraints. |
| 3 | Design a code assistant for an internal 500-engineer codebase. | 5-10 | design | Repo-scale retrieval, IP boundaries, IDE latency. |
| 4 | Design an agent that files expense reports end to end. | 5-10 | design | Tool design, approvals, error recovery. |
| 5 | How do you gather requirements when the client says "we want AI"? | 5-10 | hiring-manager | The consulting card. Scoping is the skill. |
| 6 | How do you estimate effort and timeline for a GenAI project? | 5-10 | hiring-manager | Services-company staple. Pilot, hardening, production phases. |
| 7 | Tell me about a time you had to say a GenAI approach would not work. | 5-10 | hiring-manager | Judgement and courage. Strong differentiator. |
| 8 | How do you mentor a junior engineer new to GenAI? | 5-10 | hiring-manager | Asked for lead and above roles. |
| 9 | How do you keep up with a field that changes monthly? | 2-5 | hiring-manager | Specific sources beat a generic answer. |
| 10 | Describe a production incident you owned end to end. | 5-10 | hiring-manager | STAR-structured, with the metric that recovered. |
| 11 | How do you prioritise when three stakeholders each want their feature first? | 5-10 | hiring-manager | Prioritisation framework, applied to a real example. |
| 12 | Where do you see this technology in two years, and what are you doing about it? | 5-10 | hiring-manager | Tests genuine engagement rather than rehearsal. |

---

## 4 · Summary

| | Cards |
| --- | ---: |
| Currently in the portal | 280 |
| Proposed additions remaining | **225** |
| Portal total after this work | **505** |

That lands exactly on the `PLAN.md §4` target of ≈505, with every topic at
or above the 20-card working floor.

### What to build first

1. ~~**Topic 17 - Python and coding (24 cards).**~~ ✅ **Built 18 Aug 2026** - 
   now 30 cards. Largest gap closed; it was the only topic where a weak answer
   ends the loop immediately.
2. ~~**Topic 16 - ML fundamentals (22 cards).**~~ ✅ **Built 18 Aug 2026** - 
   now 30 cards. Every services-company loop opens here.
3. ~~**Topic 05 - RAG (24 cards).**~~ ✅ **Built 18 Aug 2026** - now 40 cards,
   the portal's deepest topic. Most-asked GenAI subject in this market.
4. ~~**Topic 07 - Agents (23 cards).**~~ ✅ **Built 18 Aug 2026** - now 35 cards.
   Where senior roles are actually decided in 2026.

**All four critical topics are built - 93 cards added.** The portal has moved from
"a good revision aid" to sufficient preparation for the majority of Indian AI/ML
loops. What remains (245 cards across the high and medium tiers) is depth, not
coverage: every critical topic now carries an opener, two follow-up depths and a
failure story.

**Round-2 top-up - ✅ built 18 Aug 2026 (20 cards).** After the critical tier, a
`tech2` audit found three topics too thin for a second technical round:
LLM foundations (5 tech2 cards), transformers (4) and system design (4). Adding
20 targeted cards took those to 11, 10 and 8. Portal tech2 coverage is now 211
cards. **This closes round-1 and round-2 sufficiency for AI/ML/GenAI/agentic/RAG
roles** - what remains is optional depth, not a gap.

**Remaining (optional, ~225 cards):** topics 04, 08, 10, 11, 12, 13, 14 carry the
most value; 03, 06, 09, 15 are narrow topics where current coverage is adequate.

### Rules that must hold for every card added

- Fill all eleven slots; `node tools/check.js` must pass.
- `say` stays between 50 and 85 words - speakable in one breath.
- The `wrong` slot names the weak answer explicitly and says why it loses.
- The `follow` slot carries the real follow-up, because the follow-up is where
  interviews are actually decided.
- Add each new card id to the topic's `evening` shortlist only if it belongs in
  a five-card night-before revision.
