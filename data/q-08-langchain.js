/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["08-langchain"] = {
  "lede": "LangChain still appears by name in many GenAI job descriptions. The panel usually wants two things: that you know what the abstraction is doing underneath, and that you know when to drop it. Answering only the first half reads as framework memorisation. Know the current 1.x API - create_agent and middleware - because older tutorial answers date you quickly. Questions about graphs, state and agent loops are in the LangGraph topic. New to LangChain? The questions are ordered for a first read: High priority first, from what LangChain solves through runnables, LCEL, the RAG building blocks, memory and create_agent, to tracing and when to drop the framework, then Medium, then Low.",
  "grounding": "public job descriptions naming LangChain + documented framework behaviour",
  "evening": [
    "lg-13",
    "lg-02",
    "lg-11",
    "lg-18"
  ],
  "cards": [
    {
      "id": "lg-01",
      "q": "What problem does LangChain actually solve?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "langchain",
        "basics"
      ],
      "why": "Whether you can describe a tool's purpose without reciting its component list.",
      "simple": "LangChain solves the plumbing problem. Every LLM app needs the same boring code: fill in a prompt, call the model, turn the reply into a usable object, retry on errors, stream the output, and connect a search step to the prompt. LangChain gives you ready-made pieces for that work and one standard way to join them.\n\nThe biggest benefit is a common interface. Every chat model exposes the same methods, so moving from OpenAI to Azure OpenAI or a self-hosted model is mostly a configuration change. You still re-test prompts and tool calling, because models behave differently.\n\nIt also ships a large set of integrations: document loaders, vector stores, model providers. That is code you do not have to write.\n\nThe honest trade-off, which senior panels want to hear: it gets you to a working pipeline fast, but it adds a layer between your code and the model API. When you need to debug or tune something precisely, that layer can get in the way. Many teams keep LangChain for orchestration and call the provider directly in the most latency-sensitive path.",
      "say": "It standardises the plumbing around LLM calls - prompt formatting, output parsing, retries, streaming, memory, retriever wiring - behind one interface, so swapping a provider is mostly configuration rather than a rewrite. It gets you to a working pipeline quickly and gives you integrations for free. The cost is a layer of indirection when you need to debug precisely, which is why teams often keep it for orchestration and drop it in the hot path.",
      "numbers": "No number applies. The honest trade-off statement is what scores here.",
      "wrong": "Listing components - \"chains, agents, memory, retrievers, callbacks\". It answers what it contains, not what it solves, and every candidate says it.",
      "follow": "Where would you not use it?",
      "followAnswer": "For a single prompt and one model call, where fifteen lines of direct API code are clearer than a dependency tree. Also in a latency-critical hot path where I want nothing between my code and the HTTP call, and when I need a new provider feature the wrapper has not exposed yet. In those places I call the SDK directly and keep LangChain for orchestration, tracing and integrations."
    },
    {
      "id": "lg-13",
      "q": "What is a chain, and what is a runnable?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "langchain",
        "runnable",
        "lcel",
        "basics"
      ],
      "why": "The definition the rest of the LangChain vocabulary is built on. A vague answer here makes every later answer sound borrowed.",
      "simple": "A runnable is LangChain's common interface for a unit of work: it receives an input and returns an output. Prompts, models, retrievers, parsers and plain Python functions can all be used as runnables.\n\nBecause they share the same interface, you can connect them with the pipe operator. For example, prompt | model | parser means: build the prompt, call the model, then clean up the result. That composed pipeline is what people usually mean by a chain.\n\nThe useful part is that the finished chain is also a runnable. You can put it inside a bigger pipeline, invoke it once, batch many inputs, run it asynchronously, or stream where the components support streaming.\n\nDo not define a chain by an old class name. The concept is composition: small components with the same interface connected into a larger unit.",
      "diagram": {
        "kind": "lanes",
        "alt": "A chain as a pipeline: input flows into a prompt, then a model, then an output parser, each a runnable, and the whole composition is itself a runnable.",
        "lanes": [
          {
            "label": "{ text: doc }",
            "note": "your input"
          },
          {
            "label": "prompt",
            "note": "vars in, filled prompt out",
            "accent": "accent"
          },
          {
            "label": "model",
            "note": "prompt in, reply out",
            "accent": "accent"
          },
          {
            "label": "parser",
            "note": "reply in, clean string out",
            "accent": "accent"
          },
          {
            "label": "“A one-line summary.”",
            "note": "your output"
          }
        ],
        "caption": "The three green boxes are **runnables** — each accepts an input and produces an output. `prompt | model | parser` joins them into a **chain**, and because the chain also accepts an input and produces an output, **the chain is itself a runnable** — which is why you can drop it inside a bigger chain wherever one step would go."
      },
      "code": "from langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\n\n# each of these three is a runnable: input in, output out\nprompt = ChatPromptTemplate.from_template(\"Summarise in one line: {text}\")\nparser = StrOutputParser()\n\n# joining them with | makes a chain - which is itself a runnable\nchain = prompt | model | parser\n\nchain.invoke({\"text\": doc})                  # one input\nchain.batch([{\"text\": d} for d in docs])     # many, in parallel\nfor piece in chain.stream({\"text\": doc}):    # incremental output\n    print(piece, end=\"\")\n\n# because a chain is a runnable, it nests inside a bigger one\nbigger = retriever | chain | some_other_step",
      "say": "A runnable is LangChain's common unit of work: something takes an input and produces an output. Prompts, models, retrievers and parsers can all be runnables, so I can connect them with the pipe operator into a chain. The important part is that the whole chain is itself a runnable, which means it can be nested, invoked, batched, streamed or run asynchronously without inventing a new interface.",
      "numbers": "No number applies. This is a vocabulary question, and the code is the proof you have written it.",
      "wrong": "Defining a chain by an old class such as LLMChain. The useful concept is composition of runnables, not a particular legacy class name.",
      "follow": "So what does LCEL add on top of that?",
      "followAnswer": "LCEL is the composition layer on top of the runnable interface. Once pieces are joined with the pipe, the chain gets streaming, batching, async, and retries or fallbacks through methods like with_retry and with_fallbacks, without extra code. A dictionary of branches runs in parallel automatically. So LCEL is not just syntax - it is what lets those behaviours work on any chain I compose."
    },
    {
      "id": "lg-02",
      "q": "What is LCEL, and why does the pipe operator exist?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "langchain",
        "lcel",
        "runnable"
      ],
      "why": "Whether you understand the interface, or only copied the syntax from a tutorial.",
      "simple": "LCEL is LangChain Expression Language. The idea: every piece - a prompt, a model, a parser, a retriever, even a plain function - follows the same small interface, called Runnable. Because they share it, you can join them with the pipe operator `|`, and the result is itself a Runnable.\n\nThe payoff is not the pretty syntax. It is that every chain you build gets several features without extra code.\n\nStreaming, because each piece knows how to pass output along as it arrives. Batching over many inputs. Async versions of every method. Automatic parallel runs when you compose a dictionary of branches. And retries and fallbacks added with one method call, such as `.with_retry()` or `.with_fallbacks()`, instead of hand-written try blocks.\n\nSo the pipe is not just sugar. It is what lets these shared features work on any chain you build.\n\nLCEL is still the right tool for fixed pipelines. For agents - where the model picks the next step - current LangChain uses `create_agent`, which runs on LangGraph.",
      "code": "chain = (\n    {\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}\n    | prompt\n    | llm\n    | StrOutputParser()\n)\n\nchain.invoke(q)                 # one input\nchain.batch([q1, q2, q3])       # many, parallel\n\n# retries and a fallback, declared once\nsafe = chain.with_retry(stop_after_attempt=3).with_fallbacks([backup_chain])\n\n# inside an async function: streaming, no extra code\nasync for tok in chain.astream(q):\n    print(tok, end=\"\")",
      "say": "LCEL is a shared interface. Every component - prompt, model, parser, retriever, plain function - implements Runnable, so they compose with the pipe operator and the result is itself a Runnable. The benefit is not syntax. Because every piece implements the same interface, streaming, batching, async, automatic parallel branches, retries and fallbacks all come for free on any chain I compose, rather than being written per pipeline.",
      "numbers": "A dictionary of branches in LCEL runs those branches concurrently. Two independent retrievers cost roughly max(t1, t2), not t1 + t2.",
      "wrong": "\"It's just a nicer way to write chains.\" True and shallow. The interviewer wants streaming, batching, async and parallelism named as the reason.",
      "follow": "How does streaming work through a chain that has an output parser at the end?",
      "followAnswer": "It depends on the parser. StrOutputParser works on each chunk as it arrives, so tokens stream straight through. A parser that needs the whole output, like one that validates a complete JSON object against a schema, has to wait for the end, so streaming stops at that step. JsonOutputParser can emit partial objects as they build up. If validation must see everything, I stream a text field separately."
    },
    {
      "id": "lg-22",
      "q": "What are document loaders, text splitters and retrievers in LangChain?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "langchain",
        "rag",
        "loaders",
        "splitters",
        "retrievers"
      ],
      "why": "The standard RAG-plumbing question for LangChain roles. It checks whether you know what each piece does and where the real decisions sit.",
      "simple": "They are the three pieces of a LangChain RAG pipeline, one for each stage.\n\nA document loader reads a source - a PDF, a web page, a database, a Notion space - and turns it into `Document` objects. A `Document` is just text plus metadata, such as the file name and page number. Loaders live in `langchain-community` and in provider packages.\n\nA text splitter cuts long documents into chunks small enough to embed and search. `RecursiveCharacterTextSplitter` is the usual default. It tries to split on paragraphs first, then sentences, then words, so chunks break at natural places. You set the chunk size and the overlap.\n\nA retriever takes a question and returns the most relevant documents. Most often it wraps a vector store with `as_retriever()`. But anything that maps a query to documents - a keyword index, a hybrid search, an API - can be a retriever. Because a retriever is a runnable, it drops straight into an LCEL chain.\n\nThe senior point: the framework makes these pieces easy to connect, but it does not choose for you. Chunk size, metadata and how many chunks you retrieve decide answer quality, and you still measure them. Loaders are also where messy real documents - scanned PDFs, tables - quietly break things.",
      "points": [
        "**Loader** -> `Document` objects: text plus metadata (source, page).",
        "**Splitter** -> chunks; `RecursiveCharacterTextSplitter` tries paragraphs, then sentences, then words.",
        "**Retriever** -> query in, documents out; usually `vectorstore.as_retriever(search_kwargs={\"k\": 5})`.",
        "A retriever is a runnable, so it composes into LCEL with the pipe.",
        "Keep the loader's metadata - it powers citations and access filters later.",
        "The framework wires the pieces; chunk size, overlap and k are still measured decisions."
      ],
      "code": "from langchain_community.document_loaders import PyPDFLoader\nfrom langchain_text_splitters import RecursiveCharacterTextSplitter\nfrom langchain_core.vectorstores import InMemoryVectorStore\n\ndocs = PyPDFLoader(\"policy.pdf\").load()          # one Document per page\nsplitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)  # characters\nchunks = splitter.split_documents(docs)          # metadata is copied onto each chunk\n\nstore = InMemoryVectorStore.from_documents(chunks, embeddings)\nretriever = store.as_retriever(search_kwargs={\"k\": 5})\nretriever.invoke(\"What is the refund window?\")   # -> list of Documents",
      "say": "Loaders read a source such as a PDF or web page into Document objects - text plus metadata like source and page. Text splitters cut those into chunks; RecursiveCharacterTextSplitter is the usual default because it breaks on paragraphs first, then sentences. A retriever takes a query and returns documents, usually a vector store wrapped with as_retriever. The framework connects them, but chunk size, metadata and k are still decisions I measure.",
      "numbers": "Splitter sizes are in characters by default, and English averages roughly four characters per token, so 800 characters is about 200 tokens. Treat any size, overlap and k as a starting point and tune them on a retrieval eval.",
      "wrong": "\"LangChain handles the chunking for you.\" It gives you a splitter with defaults; it does not know your documents. Shipping default sizes without measuring retrieval is how quiet retrieval failures reach production.",
      "follow": "Your PDFs contain tables and the answers about them are wrong. What do you change?",
      "followAnswer": "The default loader flattens tables into jumbled text, so the fix starts at loading, not prompting. I would use a layout-aware parser that keeps table structure, store each table as its own chunk - often converted to Markdown, or to row-level text with the header repeated - and never split a table across chunks. Then I add table questions to the eval set to confirm it helped."
    },
    {
      "id": "lg-20",
      "q": "How do you add conversation memory in LangChain today?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "langchain",
        "memory",
        "checkpointer",
        "conversation"
      ],
      "why": "Very commonly asked, and the API changed. Older tutorials teach memory classes that are now legacy, so the answer shows whether your knowledge is current.",
      "simple": "In current LangChain, an agent's memory is its conversation state, saved by a checkpointer. You pass a checkpointer to `create_agent` and a `thread_id` with each call. On the next turn, the agent reloads that thread's earlier messages automatically.\n\nA checkpointer is a small storage component. It saves the agent's state after each step - in memory for development, in Postgres or a similar database for production. A thread id is simply the conversation's key, so two users never see each other's history.\n\nThe old approach - classes like `ConversationBufferMemory` attached to a chain - is legacy. In LangChain 1.x those older pieces moved out to the `langchain-classic` package. You may meet them in older code, but do not build new features on them.\n\nThe real design work is stopping history from growing forever. Every past message is sent to the model again, so cost and latency climb each turn. You either trim to the last few turns or summarise older ones. `SummarizationMiddleware` does the second automatically once history passes a token limit.\n\nThis is short-term memory: one conversation. Facts that should survive across conversations, like a user's preferences, belong in a separate long-term store (see the LangGraph topic).",
      "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import SummarizationMiddleware\nfrom langgraph.checkpoint.memory import InMemorySaver   # PostgresSaver in production\n\nagent = create_agent(\n    model,\n    tools=tools,\n    checkpointer=InMemorySaver(),\n    middleware=[SummarizationMiddleware(model=small_model,\n                                        trigger=(\"tokens\", 4000),\n                                        keep=(\"messages\", 20))],\n)\n\ncfg = {\"configurable\": {\"thread_id\": \"user-42-chat-7\"}}\nagent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"My order is 1182.\"}]}, cfg)\nagent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Where is it?\"}]}, cfg)  # remembers 1182",
      "say": "In current LangChain, conversation memory is agent state saved by a checkpointer. I pass a checkpointer to create_agent and a thread id on every call, and the next turn reloads that thread's messages. In production the checkpointer is Postgres, not in-memory. The old ConversationBufferMemory classes are legacy. The real work is bounding history - trimming or summarising old turns so cost and latency do not grow every turn.",
      "numbers": "History is resent every turn, so input tokens grow roughly in line with conversation length. Plot input tokens against turn number; a steady climb means you need trimming or summarisation.",
      "wrong": "\"I use ConversationBufferMemory.\" It dates your knowledge to an older API, and a buffer that keeps everything has no answer for what happens on turn fifty.",
      "follow": "The user comes back next week and expects the assistant to remember their preferences. Is the checkpointer enough?",
      "followAnswer": "No. The checkpointer is per thread, so a new conversation starts empty. Cross-conversation facts go in a long-term store keyed by user id - in LangGraph that is the Store, with namespaces and optional semantic search. The agent reads relevant memories at the start and writes new ones deliberately, with rules for what is worth keeping, when it expires, and how the user can delete it."
    },
    {
      "id": "lg-21",
      "q": "What is create_agent in LangChain 1.x, and what is middleware for?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langchain",
        "create-agent",
        "middleware",
        "agents"
      ],
      "why": "The headline LangChain 1.x change. It shows whether your knowledge is current and whether you know where agent-wide rules belong.",
      "simple": "`create_agent` is LangChain 1.x's standard way to build an agent. You give it a model, a list of tools and a system prompt. It runs the usual loop: call the model, run any tools it asks for, feed the results back, and stop when the model answers without a tool call. Underneath it is a LangGraph graph, so checkpointing and streaming come with it.\n\nMiddleware is how you change that loop without rewriting it. A middleware is a small piece of code that runs at a fixed point: before the model call, after it, or wrapped around each model or tool call. Think of airport security: every passenger passes through the same check, whatever flight they are on.\n\nLangChain ships ready-made middleware for human approval of risky tool calls, summarising long history, redacting PII, retrying failed model or tool calls, falling back to another model, and capping the number of model or tool calls. You can write your own with decorators such as `@before_model` or `@wrap_tool_call`.\n\nWhy it matters: rules like \"never send PII to the model\" or \"stop after 20 tool calls\" belong in code that always runs, not in a prompt the model may ignore. Middleware gives those rules one clear home.",
      "points": [
        "`create_agent(model, tools, system_prompt=..., middleware=[...], checkpointer=...)` - runs on LangGraph.",
        "Hooks: `before_agent`, `before_model`, `after_model`, `after_agent`, plus `wrap_model_call` and `wrap_tool_call`.",
        "Built-ins include `HumanInTheLoopMiddleware`, `SummarizationMiddleware`, `PIIMiddleware`, `ModelRetryMiddleware`, `ModelFallbackMiddleware`, `ModelCallLimitMiddleware`, `ToolCallLimitMiddleware`.",
        "`response_format` asks for structured output when the loop finishes.",
        "Put policy - limits, redaction, approval - in middleware, not in the prompt.",
        "It replaces `create_react_agent` from `langgraph.prebuilt`, which is deprecated."
      ],
      "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import (\n    HumanInTheLoopMiddleware, ToolCallLimitMiddleware, wrap_tool_call,\n)\n\n@wrap_tool_call\ndef audit(request, handler):\n    log_tool_call(request.tool_call[\"name\"], request.tool_call[\"args\"])\n    return handler(request)               # run the real tool\n\nagent = create_agent(\n    model,\n    tools=[lookup_order, issue_refund],\n    system_prompt=\"You are a support agent.\",\n    middleware=[\n        HumanInTheLoopMiddleware(interrupt_on={\n            \"issue_refund\": {\"allowed_decisions\": [\"approve\", \"reject\"]},\n        }),\n        ToolCallLimitMiddleware(run_limit=20),\n        audit,\n    ],\n    checkpointer=saver,                   # the approval pause needs one\n)",
      "say": "create_agent is LangChain 1.x's standard agent: a model, tools and a system prompt, running the tool-calling loop on LangGraph, so checkpointing and streaming come with it. Middleware hooks into that loop - before or after the model call, or wrapped around model and tool calls. Built-ins cover human approval, summarisation, PII redaction, retries, fallbacks and call limits. I put policy there, in code that always runs, rather than in the prompt.",
      "numbers": "No universal number. Set call limits from your own traces: see how many tool calls successful runs actually need, and put the cap comfortably above that.",
      "wrong": "Describing agents with `initialize_agent` or `AgentExecutor`, or enforcing limits and redaction through prompt instructions. The first dates your knowledge; the second is a rule the model can ignore.",
      "follow": "Your agent must never send customer email addresses to the model provider. Where does that rule live?",
      "followAnswer": "In middleware, not the prompt. I would add PIIMiddleware for email with a redact or mask strategy, applied to user input and to tool results, since tool output is where customer data usually enters. Then I test it: a unit test with a fake model that asserts no raw email reaches the model call, and a trace check in staging that the pattern never appears."
    },
    {
      "id": "lg-09",
      "q": "What does LangSmith give you that logging does not?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langsmith",
        "observability",
        "tracing",
        "llmops"
      ],
      "why": "Whether you have debugged a chain in production or only in a notebook.",
      "simple": "Plain logs are flat lines. A chain is a tree - a run contains a retriever call, a prompt build, a model call, a parser, maybe a nested agent loop. To debug it you need to see that structure, with the exact input and output at every node.\n\nThat is the first thing tracing gives: the hierarchy, with timing and token counts attached to each node, so you can see which step cost the latency and which one cost the money.\n\nThe second thing is the workflow around it. You can take a bad production run and turn it into a dataset example with one click. Over time that dataset becomes your evaluation set, built from real failures rather than imagined ones. Then you run evaluations against it, compare two prompt versions side by side, and see whether a change helped before you ship it.\n\nFeedback closes the loop: a thumbs-down in your app attaches to the trace that produced it.",
      "points": [
        "Hierarchical traces, not flat lines - you see which node was slow or expensive.",
        "Exact inputs and outputs at every step, including the fully assembled prompt.",
        "One-click promotion of a bad production run into an evaluation dataset.",
        "Side-by-side comparison of prompt or model versions on the same dataset.",
        "User feedback attached to the trace that caused it.",
        "Works without LangChain too - `@traceable` or a wrapped provider client - and accepts OpenTelemetry traces.",
        "It is not the only option - Langfuse, Arize Phoenix and plain OpenTelemetry backends do similar things."
      ],
      "say": "A chain is a tree, not a line, so flat logs cannot show you which node was slow or expensive. Tracing gives the hierarchy with inputs, outputs, timings and tokens at every step, including the fully assembled prompt. The bigger value is the workflow: I promote a bad production run into an evaluation dataset, so my eval set is built from real failures, then compare prompt versions on it before shipping.",
      "numbers": "Traces show per-node token counts. It is common to find one retrieval-formatting step contributing a large share of prompt tokens that nobody had measured.",
      "wrong": "\"We use LangSmith for monitoring.\" Names the product without saying what it does. Describe the tree, the datasets and the comparison.",
      "follow": "Your traces contain customer PII. How do you keep using them?",
      "followAnswer": "Mask it before it leaves the process. LangSmith can hide or anonymise inputs and outputs on the client side, so raw PII is never stored in traces. I redact known patterns, log ids instead of names, set a short retention period and restrict project access. If data residency rules apply, I use a regional or self-hosted deployment. Datasets built from traces get the same scrubbing."
    },
    {
      "id": "lg-11",
      "q": "When would you drop the framework and call the API directly?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langchain",
        "judgement",
        "trade-off",
        "architecture"
      ],
      "why": "Framework independence. Panels are wary of candidates who can only work inside one library.",
      "simple": "When the abstraction costs more than it saves.\n\nConcretely: when the flow is one prompt and one call, and a framework adds a dependency tree for something that is fifteen lines of code. When you need precise control of the exact bytes sent to the provider and the layer is getting in the way. When you are chasing latency and want no indirection between your code and the HTTP call. When you need a provider feature the abstraction has not exposed yet. And when debugging keeps taking you three layers deep into library internals - that is the signal that the abstraction has stopped helping.\n\nThe pattern many teams settle on is a split: the framework for orchestration, checkpointing, tracing and integrations, where it earns its place, and direct API calls in the hot path where control matters.\n\nSaying this openly reads as confidence, not disloyalty. It is a stronger answer than defending the framework.",
      "points": [
        "Single-call, single-prompt tasks - direct is simpler and clearer.",
        "Latency-critical paths where indirection is measurable.",
        "You need a provider feature the abstraction has not wrapped yet.",
        "Debugging repeatedly ends up inside library internals.",
        "Common landing spot: framework for orchestration, direct calls in the hot path."
      ],
      "say": "When the abstraction costs more than it saves. A single prompt and one call does not need a dependency tree. Latency-critical paths do not want indirection. And if I need a provider feature the wrapper has not exposed, or debugging keeps taking me three layers into library internals, that is the signal. The split I usually end up with is the framework for orchestration and tracing, direct calls in the hot path.",
      "numbers": "No number applies. This answer is judged on whether the reasoning is concrete.",
      "wrong": "\"LangChain is bloated, I always call the API directly.\" Equally unhelpful in the other direction. You then have to explain why you rebuilt checkpointing and tracing yourself.",
      "follow": "You dropped it in the hot path. What did you have to rebuild?",
      "followAnswer": "Less than people fear, but not nothing. Retries with backoff and timeouts, streaming handling, output parsing and validation, and tracing - I wrapped the direct call in our own span so it still appears in the same trace tree. Provider switching became a thin adapter of our own. The rule I kept was to rebuild only what that path actually used, not a mini framework."
    },
    {
      "id": "lg-08",
      "q": "How do you test a LangChain or LangGraph application?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "langchain",
        "testing",
        "evaluation",
        "ci"
      ],
      "why": "Whether the code you wrote is production code or notebook code.",
      "simple": "Split it into layers, because most of the application is ordinary software and should be tested as such.\n\nUnit tests with the model faked. Every node is a function from state to a state update. Substitute a fake model that returns scripted responses (`langchain_core` ships fake chat models such as `GenericFakeChatModel` for this), stub the tools, and now you can test routing, reducers, parsing, error handling and termination deterministically, in milliseconds, on every commit. This should be the majority of your tests, and it is the layer teams most often skip.\n\nIntegration tests against a real model, on a small set, run less often, checking the shape of the output rather than exact wording.\n\nEvaluation on a golden set - this is not a pass-or-fail test, it is a score you track over time, with a threshold that blocks the release if quality drops.\n\nPlus the specific things that break: tool schema validation, that every conditional edge has a reachable path, and that step limits actually fire.\n\nFor the framework-agnostic version - trajectory assertions and repeated runs for agents - see ag-30 in the Agents section.",
      "points": [
        "Fake the model and stub the tools. Nodes then become deterministic functions of state - test them in milliseconds.",
        "Assert on routing, reducers, error paths and termination, not on model prose.",
        "Integration tests: small, real model, assert structure not wording.",
        "Golden-set evaluation as a scored gate, not a boolean test.",
        "Explicitly test that the step limit fires and that every edge is reachable."
      ],
      "say": "Most of it is ordinary software. I fake the model and stub tools so every node becomes a deterministic function of state, and unit test routing, reducers, parsing, error handling and termination on every commit in milliseconds. Then a small integration suite against a real model asserting structure, not wording. Then a golden-set evaluation that scores quality and gates the release. And I explicitly test that the step limit fires.",
      "numbers": "Aim for the ordinary pyramid: the large majority of tests mocked and fast, a small integration layer, and one evaluation gate. If every test needs an API key, the suite will not run in CI.",
      "wrong": "\"You cannot really unit test LLM apps, they are non-deterministic.\" Only the model call is non-deterministic. Everything around it - routing, parsing, error paths, termination - is deterministic and testable, and the follow-up will ask exactly how you tested those.",
      "follow": "How do you stop a prompt change from silently regressing quality?"
    },
    {
      "id": "lg-10",
      "q": "How do you control cost and latency in a LangChain pipeline?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "langchain",
        "cost",
        "latency",
        "optimisation"
      ],
      "why": "Whether you have owned a production bill.",
      "simple": "First measure, per step. In almost every pipeline one step dominates, and it is usually not the one people assume. Retrieved context is normally the biggest token contributor, not the user's question.\n\nThen the standard moves, roughly in order of payoff.\n\nRight-size the model per step. Classification, routing and extraction rarely need your most expensive model; the final generation might. Mixed-model pipelines are normal and this is often the biggest single saving.\n\nCut context. Rerank to fewer chunks, trim boilerplate from documents, summarise old conversation turns. Fewer input tokens is both cheaper and faster.\n\nCache. Exact-match caching for repeated questions, and provider prompt caching for a long stable system prompt, which cuts both cost and time to first token.\n\nParallelise independent branches - LCEL does this automatically if you compose them as a dictionary. Stream, so perceived latency improves even when total time does not.",
      "points": [
        "Measure per step first. Context is usually the biggest token line, not the question.",
        "Right-size the model per step - cheap models for routing, classification, extraction.",
        "Cut context: rerank to fewer chunks, strip boilerplate, summarise old turns.",
        "Cache exact repeats; use provider prompt caching for stable system prompts.",
        "Run independent branches in parallel - LCEL dictionaries do this for you.",
        "Stream to fix perceived latency when real latency cannot move."
      ],
      "say": "I measure per step first, because context usually dominates the token bill rather than the user's question. Then: right-size the model per step, since routing and extraction do not need the expensive model. Cut context by reranking to fewer chunks and trimming boilerplate. Cache exact repeats and use provider prompt caching for the stable system prompt. Run independent branches in parallel, and stream to fix perceived latency.",
      "numbers": "Moving routing and extraction steps to a small model commonly cuts total spend substantially, because those steps are high-volume and low-difficulty. Measure the split before you optimise.",
      "wrong": "\"We switched to a cheaper model.\" Across the whole pipeline this usually trades a cost problem for a quality problem. The senior answer is per-step, measured.",
      "follow": "Your p95 latency is 6 seconds and the budget is 3. Where do you cut?"
    },
    {
      "id": "lg-18",
      "q": "Three tickets land: a policy Q&A bot, a support agent that looks up orders, and a refund flow that needs manager sign-off. Which LangChain or LangGraph building block does each get?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "langchain",
        "langgraph",
        "architecture",
        "trade-off"
      ],
      "why": "The abstraction choice from lg-03, tested on concrete requirements. Panels use a scenario to see whether your rule survives a real backlog.",
      "simple": "**Short version: the Q&A bot is an LCEL pipeline, the order-lookup agent is `create_agent`, and the refund flow is a `StateGraph` with a checkpointer - because each needs a different amount of orchestration.** (The general rule is lg-03 in the LangGraph section; this card applies it.)\n\n**Policy Q&A bot → LCEL pipeline.** The flow is known in advance: retrieve, format, call the model, parse. LCEL handles that, runs independent branches in parallel and can route conditionally, so a simple branch does not force a graph.\n\n**Order-lookup support agent → `create_agent`.** The main behaviour is the standard loop: the model picks a tool, sees the result, and repeats until it can answer. That loop already runs on LangGraph, so there is no reason to rebuild it node by node.\n\n**Refund flow with manager sign-off → `StateGraph` + checkpointer.** It is a fixed business process - validate, check policy, get sign-off, pay - with a pause that may last hours, state that must survive a restart, and steps the application controls, not the model. Named nodes, an `interrupt()` for the approval and a durable checkpointer make that explicit. (If the need were only \"approve this one tool call\" inside an agent, `create_agent` with human-in-the-loop middleware would be enough.)\n\nThe senior choice is the simplest block that still makes failure handling and state obvious - and it can differ per feature inside one product.",
      "say": "The policy Q&A bot is a known data flow - retrieve, format, generate, parse - so an LCEL pipeline is enough, and it can parallelise and route conditionally. The order-lookup agent is the standard model-and-tools loop, so I use create_agent, which already runs on LangGraph. The refund flow is a fixed process with a manager approval that may take hours and state that must survive restarts, so it gets a StateGraph with interrupt and a checkpointer.",
      "numbers": "No number applies. This is an architecture-choice question.",
      "wrong": "Using StateGraph for every pipeline, or claiming LCEL cannot branch. A graph is valuable when durable state and custom orchestration justify the extra code, not because it sounds more senior.",
      "follow": "Where would you put a RAG pipeline that retries retrieval when the answer looks thin?"
    },
    {
      "id": "lg-17",
      "q": "You have inherited a LangChain AgentExecutor app. Do you migrate it?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "langchain",
        "langgraph",
        "migration",
        "judgement",
        "legacy"
      ],
      "why": "A real situation at any firm with code older than about a year, and a question about judgement as much as API knowledge.",
      "simple": "**Short version: not automatically. Migrate when you need something the old executor cannot give you cleanly, and keep the tools exactly as they are.**\n\n`AgentExecutor` was the old way to run an agent loop. It still works, but it is legacy: in LangChain 1.x it moved to the `langchain-classic` package. The current path is `create_agent`, which runs on LangGraph, or a hand-built `StateGraph`.\n\nA working app that nobody is asking to change is not a reason to spend a sprint. Deprecation alone does not pay for a rewrite.\n\nWhat does justify it is a real requirement: a durable pause for human approval, state that survives a restart, routing your application controls, or state richer than a message list. Streaming alone is not enough, because the old executor can already stream through callbacks.\n\nHow to do it: keep the tool definitions, since they carry over unchanged and are most of the code. Move the loop to `create_agent` first and check it behaves the same. Only then add the feature you migrated for - the approval step, the checkpointer, the extra state.\n\nThe trap is hand-building a graph when `create_agent` already matches the old behaviour. Most `AgentExecutor` apps are a plain tool-calling loop, which is exactly what `create_agent` is.",
      "code": "# Before - the loop is inside the executor, and opaque.\n# (LangChain 1.x: from langchain_classic.agents import AgentExecutor)\nexecutor = AgentExecutor(agent=agent, tools=tools)\n\n# After - same tools, same behaviour, steps now addressable.\nfrom langchain.agents import create_agent\napp = create_agent(model, tools=tools, checkpointer=saver)\n\n# Now the things the executor could not do are available:\n#   pause for approval, resume after a crash, durable per-thread state.",
      "say": "Not automatically - a working app nobody is changing is not worth a sprint. I migrate when I need graph-native capabilities such as durable human approval, persisted state across restarts, explicit application routing, or richer workflow state. Streaming alone is not enough because legacy executors can expose callbacks and streams. I keep the tools, move the loop for behaviour parity, then add the capability that justified the migration.",
      "numbers": "No number applies. This is a migration-judgement question.",
      "wrong": "\"Yes, it's deprecated, so we rewrite it.\" Deprecation alone does not pay for a migration. The panel is listening for a requirement, and for the fact that tools carry over so the cost is smaller than it sounds.",
      "follow": "What is the first feature you would add once it is a graph?"
    }
  ]
};
