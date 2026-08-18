/* Interview Room — topic registry.
   One entry per topic page. `status: "live"` means the data file exists and the
   page is built; "planned" means it is on the roadmap and renders greyed out.
   Nothing here reads the parent portal's curriculum.js — this is the only
   manifest this portal has. */

window.IR = window.IR || {};

window.IR.topics = [
  { num: "01", slug: "llm-foundations",
    title: "LLM foundations",
    blurb: "Tokens, context windows, sampling, why the same prompt gives two answers, and what actually happens at inference time.",
    status: "live" },

  { num: "02", slug: "transformers",
    title: "Transformers and attention",
    blurb: "Self-attention, KV cache, positional encoding, encoder vs decoder — asked when the panel wants to know if you read past the API docs.",
    status: "live" },

  { num: "03", slug: "prompting",
    title: "Prompting and structured output",
    blurb: "Few-shot, chain of thought, JSON mode, function calling, and how to make output parseable every single time.",
    status: "live" },

  { num: "04", slug: "embeddings",
    title: "Embeddings and vector databases",
    blurb: "What a vector really is, distance metrics, HNSW vs IVF, pgvector vs a dedicated store, and metadata filtering.",
    status: "live" },

  { num: "05", slug: "rag",
    title: "RAG — build, evaluate, debug",
    blurb: "The most-asked topic in Indian GenAI interviews. Chunking, retrieval failure, citations, and the debugging story that gets you hired.",
    status: "live" },

  { num: "06", slug: "advanced-rag",
    title: "Advanced RAG",
    blurb: "Reranking, hybrid search, query rewriting, GraphRAG, agentic RAG, and when the extra complexity is not worth it.",
    status: "live" },

  { num: "07", slug: "agents",
    title: "Agents — loop, tools, memory",
    blurb: "What makes something an agent, tool design, termination, memory, multi-agent, and why most agent demos fail in production.",
    status: "live" },

  { num: "08", slug: "langchain-langgraph",
    title: "LangChain and LangGraph",
    blurb: "LCEL, chains vs graphs, state, checkpointers, human in the loop, streaming — and when to drop the framework entirely.",
    status: "live" },

  { num: "09", slug: "mcp",
    title: "MCP, A2A and the tool boundary",
    blurb: "Model Context Protocol, servers and clients, why a standard tool boundary matters, and the security questions that follow.",
    status: "live" },

  { num: "10", slug: "fine-tuning",
    title: "Fine-tuning and adaptation",
    blurb: "LoRA, QLoRA, SFT vs DPO, distillation, dataset size, and the senior answer: when not to fine-tune at all.",
    status: "live" },

  { num: "11", slug: "evaluation",
    title: "Evaluation",
    blurb: "Offline sets, LLM as judge and its biases, retrieval metrics, online signals, and how you prove a change made things better.",
    status: "live" },

  { num: "12", slug: "llmops",
    title: "LLMOps and observability",
    blurb: "Tracing, prompt versioning, regression gates in CI, cost dashboards, incident response for a non-deterministic system.",
    status: "live" },

  { num: "13", slug: "guardrails",
    title: "Guardrails, security, responsible AI",
    blurb: "Prompt injection, PII, jailbreaks, output validation, the OWASP LLM list, and what a regulated employer will press on.",
    status: "live" },

  { num: "14", slug: "cost-latency",
    title: "Cost, latency and serving",
    blurb: "Token economics, caching, batching, streaming, vLLM and continuous batching, and the p95 number you must know.",
    status: "live" },

  { num: "15", slug: "cloud",
    title: "Cloud and deployment",
    blurb: "Azure OpenAI, Bedrock, Vertex, Databricks, private endpoints, data residency in India, and CI/CD for prompts.",
    status: "live" },

  { num: "16", slug: "ml-fundamentals",
    title: "ML fundamentals",
    blurb: "Bias-variance, overfitting, metrics, imbalanced data, feature leakage — still asked, still failed by GenAI-only candidates.",
    status: "live" },

  { num: "17", slug: "python-coding",
    title: "Python and the coding round",
    blurb: "Generators, async, pydantic, decorators, and the live-coding tasks that actually come up for AI engineer roles.",
    status: "live" },

  { num: "18", slug: "system-design",
    title: "System design and your project story",
    blurb: "The 60-minute design round, the STAR story that survives follow-ups, and how to talk about a project you half-owned.",
    status: "live" }
];

window.IR.rounds = [
  { key: "screening", label: "Screening",     hint: "20–30 min, recruiter or junior engineer" },
  { key: "tech1",     label: "Technical 1",   hint: "45–60 min, fundamentals and depth" },
  { key: "tech2",     label: "Technical 2",   hint: "60 min, architecture and design" },
  { key: "manager",   label: "Hiring manager",hint: "45 min, ownership and judgement" },
  { key: "hr",        label: "HR / fitment",  hint: "30 min, stability and expectations" }
];

window.IR.levels = [
  { key: "2-5",  label: "2–5 yrs" },
  { key: "5-10", label: "5–10 yrs" },
  { key: "10+",  label: "10+ yrs" }
];
