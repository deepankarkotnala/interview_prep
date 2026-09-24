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
      "quick": [
        "It handles the boring glue code every AI app needs.",
        "Fill prompts, call models, parse replies, retry and stream.",
        "One shared interface makes switching model providers easy.",
        "Many ready-made connectors for files and databases.",
        "The extra layer can make debugging and tuning harder."
      ],
      "simple": "LangChain solves the plumbing problem. Every LLM app needs the same boring code: fill in a prompt, call the model, turn the reply into a usable object, retry on errors, stream the output and connect a search step. LangChain gives you ready-made pieces for that work and one standard way to join them.\n\nThe biggest benefit is a common interface. Every chat model exposes the same methods, so switching providers is mostly a configuration change. For example, moving a support bot from OpenAI to a self-hosted model means changing the model setup, not rewriting the pipeline, although you still re-test the prompts. It also ships many integrations, such as loaders and vector stores.\n\nThe trade-off is an extra layer between your code and the model API. It gets you working fast, but it can get in the way when you debug or tune precisely, so many teams call the provider directly on the most latency-sensitive path.",
      "say": "It solves the plumbing that every LLM app needs and nobody wants to write twice. That means filling in a prompt, calling the model, turning the reply into a usable object, retrying on errors, streaming, and wiring a search step into the prompt. LangChain gives you ready-made pieces for that and one standard way to join them. The biggest benefit is the common interface. Every chat model exposes the same methods, so moving from OpenAI to a self-hosted model is mostly configuration. I still re-test prompts and tool calling, because models behave differently. It also ships a large set of integrations, like document loaders, vector stores and providers, which is code you don't have to write. The honest trade-off is an extra layer between your code and the model API, and that layer gets in the way when you debug or tune precisely. So many teams keep it for orchestration and call the provider directly in the latency-critical path.",
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
      "quick": [
        "A runnable is one step that takes input and gives output.",
        "Prompts, models, parsers and plain functions can all be runnables.",
        "Join runnables with a pipe to make a chain.",
        "The finished chain is itself a runnable you can reuse.",
        "The real idea is joining small steps into bigger ones."
      ],
      "simple": "A runnable is LangChain's common interface for a single unit of work, which receives an input and returns an output. Prompts, models, retrievers, parsers and even plain Python functions can all be runnables.\n\nBecause they share that interface, you can connect them with the pipe operator. For example, prompt, then model, then parser means build the prompt, call the model and clean up the result. That composed pipeline is what people mean by a chain, so a chain is simply several runnables joined into one.\n\nThe useful part is that the finished chain is itself a runnable. You can nest it in a bigger pipeline, batch inputs through it, run it asynchronously or stream it, without extra code. So don't define a chain by an old class name like LLMChain, because the concept is composition. The limitation is that a chain is fixed, so when the model must choose the next step, you need an agent.",
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
      "say": "A runnable is one unit of work with a standard interface, and a chain is several runnables joined into one. Each runnable takes an input and returns an output. Prompts, models, retrievers, parsers and even plain Python functions can all act as runnables. Because they share that interface, I can connect them with the pipe operator. Prompt, pipe, model, pipe, parser means build the prompt, call the model, then clean up the result, and that composed pipeline is what people usually mean by a chain. The useful bit is that the finished chain is also a runnable. So I can nest it inside a bigger pipeline, invoke it once, batch many inputs, run it asynchronously, or stream wherever the components support it. That's why I'd never define a chain by an old class name like LLMChain. The concept is composition, small pieces with the same interface building bigger ones.",
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
      "quick": [
        "LCEL is how LangChain joins steps with a pipe.",
        "Every piece shares the same small interface.",
        "Every chain gets streaming, batching and retries for free.",
        "Independent branches run at the same time automatically.",
        "Use it for fixed flows, and create_agent for agents."
      ],
      "simple": "LCEL stands for LangChain Expression Language. Every piece, whether a prompt, a model, a parser or a plain function, follows the same small interface, called Runnable, so you can join them with the pipe operator and the result is itself a Runnable.\n\nThe payoff is not the syntax. Every chain you build gets streaming, batching, async methods, and retries or fallbacks through one method call, without extra code. It also runs branches in parallel when you compose them as a dictionary. For example, if a question needs two independent retrievers, one for policy documents and one for FAQs, they run at the same time, so you wait roughly as long as the slower one, not both added together.\n\nLCEL is still the right tool for fixed pipelines, where the steps are known in advance. For agents, where the model picks the next step, current LangChain uses create_agent instead.",
      "code": "chain = (\n    {\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}\n    | prompt\n    | llm\n    | StrOutputParser()\n)\n\nchain.invoke(q)                 # one input\nchain.batch([q1, q2, q3])       # many, parallel\n\n# retries and a fallback, declared once\nsafe = chain.with_retry(stop_after_attempt=3).with_fallbacks([backup_chain])\n\n# inside an async function: streaming, no extra code\nasync for tok in chain.astream(q):\n    print(tok, end=\"\")",
      "diagram": {
        "alt": "An LCEL chain where a question fans out to two independent retrievers composed as a dictionary, which run at the same time before the prompt, model and parser.",
        "rows": [
          [
            {
              "id": "q",
              "label": "Question",
              "note": "one input"
            }
          ],
          [
            {
              "id": "a",
              "label": "Retriever A",
              "note": "takes t1",
              "accent": "accent"
            },
            {
              "id": "b",
              "label": "Retriever B",
              "note": "takes t2",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "p",
              "label": "prompt | model | parser",
              "note": "waits for the slower one"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "a"
          },
          {
            "from": "q",
            "to": "b"
          },
          {
            "from": "a",
            "to": "p"
          },
          {
            "from": "b",
            "to": "p"
          }
        ],
        "caption": "A dictionary of branches runs **in parallel**: you wait max(t1, t2), not t1 + t2. Because every piece is a Runnable, streaming, batching, retries and fallbacks come free."
      },
      "say": "LCEL is LangChain Expression Language, and the pipe exists because every component shares one interface called Runnable. A prompt, a model, a parser, a retriever or a plain function all follow it, so you can join them with the pipe, and the result is itself a Runnable. The payoff isn't the syntax. Every chain you build gets streaming, batching, async methods, retries and fallbacks with no extra code. You call with_retry or with_fallbacks instead of writing try blocks. Parallelism comes free too. Compose two independent retrievers as a dictionary of branches and they run concurrently, so you wait for the slower one, not both added together. So the pipe isn't sugar, it's what makes those features work on any chain. LCEL is still the right tool for fixed pipelines. For agents, where the model picks the next step, current LangChain uses create_agent, which runs on LangGraph.",
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
      "quick": [
        "They are the three stages of a document search pipeline.",
        "A loader reads a file into text plus details.",
        "A splitter cuts long text into small pieces.",
        "A retriever returns the pieces that best match a question.",
        "Piece size and count still need testing, the tool will not choose."
      ],
      "simple": "Document loaders, text splitters and retrievers are the three pieces of a LangChain RAG pipeline, one each for reading, chunking and fetching. A loader reads a source, such as a PDF or a web page, into Document objects, which are text plus metadata like the file name and page, useful later for citations and access filters. A text splitter cuts documents into chunks small enough to embed. RecursiveCharacterTextSplitter is the usual default, splitting on paragraphs first, then sentences, so chunks break at natural places.\n\nA retriever takes a question and returns the most relevant documents. For example, it often wraps a vector store with as_retriever and asks for the top 5 chunks, and because it is a runnable it drops straight into a chain.\n\nThe framework makes these pieces easy to connect, but it doesn't choose for you. Chunk size, overlap and the number of chunks decide answer quality, so tune them on a retrieval eval.",
      "points": [
        "**Loader** -> `Document` objects: text plus metadata (source, page).",
        "**Splitter** -> chunks; `RecursiveCharacterTextSplitter` tries paragraphs, then sentences, then words.",
        "**Retriever** -> query in, documents out; usually `vectorstore.as_retriever(search_kwargs={\"k\": 5})`.",
        "A retriever is a runnable, so it composes into LCEL with the pipe.",
        "Keep the loader's metadata - it powers citations and access filters later.",
        "The framework wires the pieces; chunk size, overlap and k are still measured decisions."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "The LangChain RAG plumbing: a source is read by a loader into Documents, cut by a splitter into chunks, embedded into a vector store, and fetched by a retriever for a question.",
        "lanes": [
          {
            "label": "Source",
            "note": "PDF, web page, DB"
          },
          {
            "label": "Loader",
            "note": "Documents: text + metadata",
            "accent": "accent"
          },
          {
            "label": "Splitter",
            "note": "chunk size, overlap",
            "accent": "warn"
          },
          {
            "label": "Vector store",
            "note": "embedded chunks"
          },
          {
            "label": "Retriever",
            "note": "query in, top k out",
            "accent": "accent"
          }
        ],
        "caption": "**Read, chunk, fetch.** The framework wires the pieces, but chunk size, overlap, metadata and k are **your decisions**, measured on a retrieval eval."
      },
      "code": "from langchain_community.document_loaders import PyPDFLoader\nfrom langchain_text_splitters import RecursiveCharacterTextSplitter\nfrom langchain_core.vectorstores import InMemoryVectorStore\n\ndocs = PyPDFLoader(\"policy.pdf\").load()          # one Document per page\nsplitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)  # characters\nchunks = splitter.split_documents(docs)          # metadata is copied onto each chunk\n\nstore = InMemoryVectorStore.from_documents(chunks, embeddings)\nretriever = store.as_retriever(search_kwargs={\"k\": 5})\nretriever.invoke(\"What is the refund window?\")   # -> list of Documents",
      "say": "They're the three stages of a LangChain RAG pipeline, reading, chunking and fetching. A loader reads a source, like a PDF, a web page or a database, and turns it into Document objects, which are just text plus metadata such as file name and page number. A splitter cuts those into chunks small enough to embed and search. RecursiveCharacterTextSplitter is the usual default, because it tries paragraphs first, then sentences, then words, so chunks break at natural places. A retriever takes a question and returns the most relevant documents, usually by wrapping a vector store with as_retriever. Since a retriever is a runnable, it drops straight into an LCEL chain. The catch is that the framework wires the pieces but doesn't choose for you. Chunk size, overlap, metadata and how many chunks you retrieve decide answer quality. Loaders are also where scanned PDFs and tables quietly break things. So I treat every setting as a starting point and measure it on a retrieval eval.",
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
      "quick": [
        "Memory is the saved conversation for each chat.",
        "A storage piece saves the chat after every step.",
        "Send a conversation id so each user gets their own history.",
        "Old memory classes are outdated, do not build on them.",
        "Trim or summarise old messages, or cost keeps climbing."
      ],
      "simple": "In current LangChain, an agent's memory is its conversation state, saved by a checkpointer. You pass a checkpointer to create_agent and a thread ID with each call, and on the next turn the agent reloads that thread's earlier messages. The checkpointer saves state after each step, usually to Postgres in production, and the thread ID keeps each conversation separate. For example, a support chatbot might use each customer's conversation ID as the thread ID, so a follow-up picks up exactly where it left off.\n\nThe real design work is stopping history from growing forever. Every past message is sent again on every turn, so cost and latency climb with conversation length. You either trim to the last few turns or summarise older ones, which SummarizationMiddleware does automatically. And this is only short-term memory, so facts that should survive across conversations belong in a separate long-term store.",
      "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import SummarizationMiddleware\nfrom langgraph.checkpoint.memory import InMemorySaver   # PostgresSaver in production\n\nagent = create_agent(\n    model,\n    tools=tools,\n    checkpointer=InMemorySaver(),\n    middleware=[SummarizationMiddleware(model=small_model,\n                                        trigger=(\"tokens\", 4000),\n                                        keep=(\"messages\", 20))],\n)\n\ncfg = {\"configurable\": {\"thread_id\": \"user-42-chat-7\"}}\nagent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"My order is 1182.\"}]}, cfg)\nagent.invoke({\"messages\": [{\"role\": \"user\", \"content\": \"Where is it?\"}]}, cfg)  # remembers 1182",
      "say": "Today it's a checkpointer on create_agent plus a thread ID on every call. The checkpointer is a small storage component that saves the agent's state after each step, in memory for development and usually Postgres in production. The thread ID is the conversation's key, so on the next turn the agent reloads that thread's earlier messages, and two users never see each other's history. The old memory classes, like ConversationBufferMemory, are legacy now and live in the langchain-classic package, so I wouldn't build anything new on them. The real design work is stopping history growing forever. Every past message is resent to the model, which means cost and latency climb each turn. So I trim to the last few turns or summarise older ones, and SummarizationMiddleware does that automatically past a token threshold. All of this is short-term memory for one conversation. Facts that should survive across conversations belong in a separate long-term store.",
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
      "quick": [
        "create_agent is the standard way to build an agent.",
        "It loops model call, run tools, feed results back.",
        "Middleware is code that runs before or after each call.",
        "Built-in ones cover approval, summaries, retries and call limits.",
        "Put firm rules in middleware, since models can ignore prompts."
      ],
      "simple": "create_agent is the standard way to build an agent in LangChain 1.x. You give it a model, tools and a system prompt, and it runs the usual loop of calling the model, running any tools it asks for and feeding the results back until the model answers. Underneath it is a LangGraph graph, so checkpointing and streaming come with it.\n\nMiddleware is how you change that loop without rewriting it. It is a small piece of code that runs at a fixed point, such as before or after the model call or around each tool call. LangChain ships ready-made middleware for human approval, summarising history, redacting PII, retries and call limits.\n\nThis matters because of enforcement. For example, rules like \"never send PII to the model\" or \"stop after 20 tool calls\" have to live in code that always runs, not in a prompt the model may ignore, and middleware gives them one clear home.",
      "points": [
        "`create_agent(model, tools, system_prompt=..., middleware=[...], checkpointer=...)` - runs on LangGraph.",
        "Hooks: `before_agent`, `before_model`, `after_model`, `after_agent`, plus `wrap_model_call` and `wrap_tool_call`.",
        "Built-ins include `HumanInTheLoopMiddleware`, `SummarizationMiddleware`, `PIIMiddleware`, `ModelRetryMiddleware`, `ModelFallbackMiddleware`, `ModelCallLimitMiddleware`, `ToolCallLimitMiddleware`.",
        "`response_format` asks for structured output when the loop finishes.",
        "Put policy - limits, redaction, approval - in middleware, not in the prompt.",
        "It replaces `create_react_agent` from `langgraph.prebuilt`, which is deprecated."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "The create_agent loop with middleware hooks in order: before_agent, before_model, the wrapped model call, after_model, the wrapped tool call, and after_agent.",
        "top": "user request",
        "bottom": "final answer",
        "layers": [
          {
            "label": "before_agent",
            "note": "once per run"
          },
          {
            "label": "before_model",
            "note": "e.g. redact PII, summarise",
            "accent": "warn"
          },
          {
            "label": "wrap_model_call",
            "note": "retry, fallback model",
            "accent": "accent"
          },
          {
            "label": "after_model",
            "note": "e.g. human approval",
            "accent": "warn"
          },
          {
            "label": "wrap_tool_call",
            "note": "call limits, retries",
            "accent": "accent"
          },
          {
            "label": "after_agent",
            "note": "once per run"
          }
        ],
        "caption": "Middleware runs at **fixed points in the loop**, like airport security every passenger passes. Policy such as PII redaction or call limits goes here, **not in a prompt** the model may ignore."
      },
      "code": "from langchain.agents import create_agent\nfrom langchain.agents.middleware import (\n    HumanInTheLoopMiddleware, ToolCallLimitMiddleware, wrap_tool_call,\n)\n\n@wrap_tool_call\ndef audit(request, handler):\n    log_tool_call(request.tool_call[\"name\"], request.tool_call[\"args\"])\n    return handler(request)               # run the real tool\n\nagent = create_agent(\n    model,\n    tools=[lookup_order, issue_refund],\n    system_prompt=\"You are a support agent.\",\n    middleware=[\n        HumanInTheLoopMiddleware(interrupt_on={\n            \"issue_refund\": {\"allowed_decisions\": [\"approve\", \"reject\"]},\n        }),\n        ToolCallLimitMiddleware(run_limit=20),\n        audit,\n    ],\n    checkpointer=saver,                   # the approval pause needs one\n)",
      "say": "create_agent is the standard way to build an agent in LangChain 1.x, and middleware lets you change its loop without rewriting it. You give it a model, tools and a system prompt. It calls the model, runs any tools it asks for, feeds the results back, and stops when the model answers without a tool call. Underneath it's a LangGraph graph, so checkpointing and streaming come along. Middleware is a small piece of code that runs at a fixed point, before or after the model call, or wrapped around each model or tool call. The built-ins cover human approval, summarisation, PII redaction, retries, model fallback and call limits, and you can write your own with decorators. The reason it matters is enforcement. A rule like never send PII to the model, or stop after twenty tool calls, has to live in code that always runs. A prompt is something the model may ignore. So agent-wide policy goes in middleware.",
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
      "quick": [
        "LangSmith shows each run as a tree of steps.",
        "See exact inputs, outputs, time and cost at every step.",
        "Turn a bad real run into a test case in one click.",
        "Compare two prompt versions side by side before release.",
        "Other tools can do similar things."
      ],
      "simple": "Plain logs are flat lines, but a chain run is a tree. One run can contain a retriever call, a prompt build, a model call, a parser and maybe a nested agent loop, and to debug it you need that structure with the exact input and output at every node, including the fully assembled prompt.\n\nLangSmith gives you that hierarchy, with timing and token counts on each node, so you can see which step cost the latency and the money. For example, teams often find that one retrieval-formatting step contributes a large share of the prompt tokens.\n\nIt also builds a workflow around traces. You turn a bad production run into a dataset example with one click, so your eval set grows from real failures, then compare versions before shipping. But tools like Langfuse do similar things, so the real point is structured tracing plus evaluation, whichever tool provides it.",
      "points": [
        "Hierarchical traces, not flat lines - you see which node was slow or expensive.",
        "Exact inputs and outputs at every step, including the fully assembled prompt.",
        "One-click promotion of a bad production run into an evaluation dataset.",
        "Side-by-side comparison of prompt or model versions on the same dataset.",
        "User feedback attached to the trace that caused it.",
        "Works without LangChain too - `@traceable` or a wrapped provider client - and accepts OpenTelemetry traces.",
        "It is not the only option - Langfuse, Arize Phoenix and plain OpenTelemetry backends do similar things."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Plain logging compared with LangSmith on shape, detail per step, cost view, eval data and feedback.",
        "aspects": [
          "Shape",
          "Per step",
          "Cost view",
          "Eval data",
          "User feedback"
        ],
        "columns": [
          {
            "label": "Plain logs",
            "note": "flat lines",
            "accent": "muted",
            "cells": [
              "Flat lines",
              "Whatever you logged",
              "Guesswork",
              "Imagined test cases",
              "Separate system"
            ]
          },
          {
            "label": "LangSmith",
            "note": "traces + workflow",
            "accent": "accent",
            "cells": [
              "Tree of nested runs",
              "Exact inputs and outputs",
              "Time and tokens per node",
              "Bad runs, one click",
              "Attached to the trace"
            ]
          }
        ],
        "caption": "A chain is **a tree, not a line**. Traces show which node cost the time and tokens, and bad production runs become your **eval dataset**."
      },
      "say": "Logging gives you flat lines, while LangSmith gives you the run as a tree, plus an evaluation workflow built on it. A chain run contains a retriever call, a prompt build, a model call, a parser, maybe a nested agent loop. LangSmith shows that hierarchy with exact inputs and outputs at every node, including the fully assembled prompt, and timing and tokens on each. So you can see which step cost the latency and which cost the money. It's common to find one retrieval-formatting step eating a big share of the prompt tokens without anyone noticing. The second half is the workflow. A bad production run becomes a dataset example in one click, so your eval set grows from real failures. You compare two prompt versions side by side on it before shipping, and a thumbs-down in the app attaches to the trace behind it. It isn't the only option, since Langfuse, Arize Phoenix and OpenTelemetry backends do similar things.",
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
      "quick": [
        "When the framework costs more than it saves.",
        "A single prompt and call is simpler done directly.",
        "Speed-critical paths want no extra layers.",
        "Also when you need a new feature or keep debugging library code.",
        "Common split is framework for flow, direct calls where speed matters."
      ],
      "simple": "You drop the framework and call the API directly when the abstraction costs more than it saves. The clearest case is a flow that is one prompt and one call, where a framework adds a whole dependency tree for about fifteen lines of code. Another is a latency-critical path, or when you need control over the exact request or a provider feature the layer hasn't exposed yet. The warning sign is debugging that keeps taking you three layers deep into library internals.\n\nIn practice, many teams split the work. The framework handles orchestration, checkpointing and tracing, and direct calls handle the hot path. For example, a support assistant might use LangGraph for its multi-step agent flow but call the provider directly for a simple, high-volume ticket classifier.\n\nThat answer is stronger than defending the framework everywhere, and stronger than dropping it everywhere and rebuilding checkpointing and tracing yourself.",
      "points": [
        "Single-call, single-prompt tasks - direct is simpler and clearer.",
        "Latency-critical paths where indirection is measurable.",
        "You need a provider feature the abstraction has not wrapped yet.",
        "Debugging repeatedly ends up inside library internals.",
        "Common landing spot: framework for orchestration, direct calls in the hot path."
      ],
      "say": "When the abstraction costs more than it saves. The clearest case is one prompt and one call, where a framework adds a dependency tree for about fifteen lines of code. Latency-critical paths are another, because I want nothing between my code and the HTTP call. Then there's control. Sometimes I need to shape exactly what gets sent, or use a provider feature the abstraction hasn't exposed yet. The warning sign I watch for is debugging that keeps taking me three layers deep into library internals. That's the abstraction telling me it has stopped helping. In practice I land on a split. The framework handles orchestration, checkpointing, tracing and integrations, where it earns its place, and direct API calls handle the hot path, where control matters. That's a stronger position than defending the framework everywhere. It's also stronger than dropping it everywhere, because then you end up rebuilding checkpointing and tracing yourself.",
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
      "quick": [
        "Test in layers, since most of it is normal software.",
        "Most tests use a fake model with scripted replies.",
        "Check routing, errors and stopping, not the wording.",
        "A few tests hit a real model and check structure.",
        "Track a quality score that blocks release if it drops."
      ],
      "simple": "The best way to test a LangChain or LangGraph application is in layers, because most of it is ordinary software. The biggest layer is unit tests with the model faked. Every node is just a function from state to a state update, so you substitute a fake chat model that returns scripted responses and stub the tools. For example, you can script the fake model to request a refund tool and check that the graph routes to the approval node and stops cleanly. These tests run in milliseconds on every commit, and you assert on routing and state, not wording.\n\nAbove that sits a small set of integration tests against a real model, checking output structure. Then comes evaluation on a golden set, which is a score tracked over time with a threshold that blocks a release. If every test needs an API key, the fast mocked layer is missing.",
      "points": [
        "Fake the model and stub the tools. Nodes then become deterministic functions of state - test them in milliseconds.",
        "Assert on routing, reducers, error paths and termination, not on model prose.",
        "Integration tests: small, real model, assert structure not wording.",
        "Golden-set evaluation as a scored gate, not a boolean test.",
        "Explicitly test that the step limit fires and that every edge is reachable."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Testing layers from a thin top to a wide base: a golden-set evaluation gate, a small integration suite against a real model, and many unit tests with a fake model.",
        "layers": [
          {
            "label": "Golden-set eval",
            "note": "a score, blocks release",
            "accent": "warn"
          },
          {
            "label": "Integration tests",
            "note": "few, real model, check structure"
          },
          {
            "label": "Unit tests, fake model",
            "note": "most tests, milliseconds",
            "accent": "accent"
          },
          {
            "label": "Also check",
            "note": "step limit fires, edges reachable"
          }
        ],
        "caption": "**Fake the model, stub the tools**, and nodes become deterministic functions of state. Most tests live there; if every test needs an API key, **CI will not run it**."
      },
      "say": "In layers, because most of the application is ordinary software and should be tested that way. The biggest layer is unit tests with the model faked and the tools stubbed. langchain_core ships fake chat models like GenericFakeChatModel that return scripted replies, so each node becomes a deterministic function of state. That lets me test routing, reducers, parsing, error handling and termination in milliseconds on every commit, and it's the layer teams most often skip. Above that sits a small integration suite against a real model, run less often, checking the structure of the output rather than exact wording. Then there's a golden-set evaluation. It isn't pass or fail, it's a score tracked over time, with a threshold that blocks the release if quality drops. I also test the things that quietly break, like step limits actually firing and every conditional edge being reachable. If every test needs an API key, the suite won't run in CI.",
      "numbers": "Aim for the ordinary pyramid: the large majority of tests mocked and fast, a small integration layer, and one evaluation gate. If every test needs an API key, the suite will not run in CI.",
      "wrong": "\"You cannot really unit test LLM apps, they are non-deterministic.\" Only the model call is non-deterministic. Everything around it - routing, parsing, error paths, termination - is deterministic and testable, and the follow-up will ask exactly how you tested those.",
      "follow": "How do you stop a prompt change from silently regressing quality?",
      "followAnswer": "I treat the prompt like code behind a quality gate. It lives in version control, and every change runs the golden set in CI, posting a score comparison against main on the pull request. If the score falls below a threshold, or a critical case fails, the merge is blocked. In LangSmith I run both versions as experiments on the same dataset, so the reviewer sees the difference case by case. After release I log the prompt version per request and watch live metrics so I can roll back quickly."
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
      "quick": [
        "Measure each step first, one step usually dominates.",
        "Use cheap models for routing, sorting and extraction.",
        "Send less text by keeping only the best document pieces.",
        "Save repeated answers and reuse the fixed prompt opening.",
        "Run independent steps together and stream the reply."
      ],
      "simple": "The first step in controlling cost and latency is to measure per step, because one step usually dominates and it is rarely the one people assume. Retrieved context is normally the biggest token contributor.\n\nThen come the standard moves. Right-size the model per step, since classification and routing rarely need your most expensive model. For example, a support pipeline might use a small model to classify each ticket and keep the strong model only for the final reply, which is often the biggest single saving. Next, cut context by reranking to fewer chunks and summarising old turns, and cache repeated questions and long stable system prompts. Run independent branches in parallel and stream the output.\n\nThe move to avoid is switching the whole pipeline to a cheaper model, because that trades a cost problem for a quality problem. So measure the split first, then optimise the steps that dominate.",
      "points": [
        "Measure per step first. Context is usually the biggest token line, not the question.",
        "Right-size the model per step - cheap models for routing, classification, extraction.",
        "Cut context: rerank to fewer chunks, strip boilerplate, summarise old turns.",
        "Cache exact repeats; use provider prompt caching for stable system prompts.",
        "Run independent branches in parallel - LCEL dictionaries do this for you.",
        "Stream to fix perceived latency when real latency cannot move."
      ],
      "say": "I measure per step first, because one step usually dominates and it's rarely the one people assume. Retrieved context is normally the biggest token line, not the user's question. The biggest single saving is often right-sizing the model per step. Classification, routing and extraction are high volume and low difficulty, so they rarely need the expensive model, while the final generation might. Next I cut context, reranking to fewer chunks, trimming boilerplate and summarising old turns, which makes calls both cheaper and faster. Then caching. Exact-match caching handles repeated questions, and provider prompt caching on a long stable system prompt cuts cost and time to first token. Independent branches run in parallel, which LCEL does automatically when you compose them as a dictionary. And I stream the output, since that fixes perceived latency even when total time can't move. Moving the whole pipeline to a cheaper model is the move to avoid, because it trades a cost problem for a quality problem.",
      "numbers": "Moving routing and extraction steps to a small model commonly cuts total spend substantially, because those steps are high-volume and low-difficulty. Measure the split before you optimise.",
      "wrong": "\"We switched to a cheaper model.\" Across the whole pipeline this usually trades a cost problem for a quality problem. The senior answer is per-step, measured.",
      "follow": "Your p95 latency is 6 seconds and the budget is 3. Where do you cut?",
      "followAnswer": "First I break the six seconds down by step in the trace, because the fix depends on where the time goes. Usually it is sequential model calls and long generation. So I remove or merge calls, run independent steps in parallel, move routing and classification to a small fast model, and cap output length. If time to first token is high, I cut retrieved chunks and cache the stable prefix. I also check for queueing or rate limiting, and stream the final answer."
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
      "quick": [
        "Pick the simplest block that fits each feature.",
        "The question bot is a fixed pipe of steps.",
        "The order lookup agent uses create_agent for its tool loop.",
        "The refund flow is a StateGraph with saved progress.",
        "It must pause hours for sign-off and survive restarts."
      ],
      "simple": "Each of these features needs a different amount of orchestration, so each gets a different building block. The policy Q&A bot has a flow known in advance, retrieve, format, call the model and parse, so an LCEL pipeline handles it well. The order-lookup agent is the standard loop where the model picks a tool, sees the result and repeats, which is exactly what create_agent already runs.\n\nThe refund flow is the hard one. It is a fixed business process, for example validate the request, check the policy, get the manager's sign-off, then pay. It pauses for approval that may last hours, its state must survive a restart, and the application controls the steps, so a StateGraph with an interrupt and a durable checkpointer makes that explicit and recoverable.\n\nThe rule is to pick the simplest block that still makes failure handling and state obvious, and it can differ per feature within one product.",
      "diagram": {
        "kind": "compare",
        "alt": "Three tickets mapped to building blocks: the policy Q&A bot to an LCEL pipeline, the order-lookup agent to create_agent, and the refund flow to a StateGraph with a checkpointer.",
        "aspects": [
          "Ticket",
          "Flow shape",
          "Who picks next step",
          "Block"
        ],
        "columns": [
          {
            "label": "Policy Q&A",
            "note": "known pipeline",
            "cells": [
              "Answer policy questions",
              "Retrieve, format, answer",
              "Fixed in code",
              "LCEL pipeline"
            ],
            "accent": "accent"
          },
          {
            "label": "Order lookup",
            "note": "tool loop",
            "cells": [
              "Support agent",
              "Tool, result, repeat",
              "The model",
              "create_agent"
            ],
            "accent": "accent"
          },
          {
            "label": "Refund",
            "note": "durable process",
            "cells": [
              "Manager sign-off",
              "Steps plus hours-long pause",
              "The application",
              "StateGraph + checkpointer"
            ],
            "accent": "warn"
          }
        ],
        "caption": "Pick **the simplest block that keeps state and failures obvious**. It can differ per feature inside one product."
      },
      "say": "The Q&A bot gets an LCEL pipeline, the order agent gets create_agent, and the refund flow gets a StateGraph with a checkpointer. The policy bot's flow is known in advance. Retrieve, format, call the model, parse. LCEL handles that, and it can branch conditionally, so a simple branch doesn't force a graph. The support agent is the standard loop where the model picks a tool, sees the result and repeats. create_agent already runs that loop on LangGraph, so there's no reason to rebuild it node by node. The refund flow is the hard one. It's a fixed business process with a pause for manager sign-off that may last hours, state that must survive a restart, and steps the application controls, not the model. Named nodes, an interrupt for the approval and a durable checkpointer make all of that explicit. If it only needed approval on one tool call inside an agent, human-in-the-loop middleware would do. My rule is the simplest block that keeps state and failures obvious.",
      "numbers": "No number applies. This is an architecture-choice question.",
      "wrong": "Using StateGraph for every pipeline, or claiming LCEL cannot branch. A graph is valuable when durable state and custom orchestration justify the extra code, not because it sounds more senior.",
      "follow": "Where would you put a RAG pipeline that retries retrieval when the answer looks thin?",
      "followAnswer": "That becomes a StateGraph, because it has a loop the application controls. I would have a retrieve node, a grading node that checks whether the documents are relevant and sufficient, and a conditional edge that either goes to generation or rewrites the query and retrieves again. State carries the query, the documents and a retry counter, so I can cap it at two or three attempts and then fall back to an honest answer that we don't know. LCEL can branch but does not loop cleanly."
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
      "quick": [
        "Not automatically, only when there is a real need.",
        "Being outdated alone does not justify a rewrite.",
        "Good reasons are approval pauses or state surviving restarts.",
        "Keep the tools unchanged and move the loop to create_agent.",
        "Check it behaves the same, then add the new feature."
      ],
      "simple": "AgentExecutor was the old way to run an agent loop in LangChain. It still works, but it is legacy and in LangChain 1.x it moved to the langchain-classic package, with create_agent as the current path. So should an inherited app be migrated? Not automatically.\n\nA working app nobody wants changed is not worth a sprint, because deprecation alone doesn't pay for a rewrite. What justifies it is a real requirement the old executor can't meet cleanly, such as a durable pause for approval or state that survives a restart. For example, if the business now wants a manager to approve any refund the agent issues, and that may take hours, that is a good reason.\n\nWhen you migrate, keep the tool definitions, move the loop to create_agent and check it behaves the same, then add the new feature. Don't hand-build a graph, since most AgentExecutor apps are a plain tool-calling loop.",
      "code": "# Before - the loop is inside the executor, and opaque.\n# (LangChain 1.x: from langchain_classic.agents import AgentExecutor)\nexecutor = AgentExecutor(agent=agent, tools=tools)\n\n# After - same tools, same behaviour, steps now addressable.\nfrom langchain.agents import create_agent\napp = create_agent(model, tools=tools, checkpointer=saver)\n\n# Now the things the executor could not do are available:\n#   pause for approval, resume after a crash, durable per-thread state.",
      "say": "Not automatically. I'd migrate when it needs something the old executor can't give cleanly. AgentExecutor still works, but it's legacy and lives in the langchain-classic package in LangChain 1.x. A working app that nobody is asking to change isn't worth a sprint, because deprecation alone doesn't pay for a rewrite. A real requirement does. That might be a durable pause for human approval, state that survives a restart, routing the application controls, or state richer than a message list. Streaming alone isn't a reason, since the old executor can already stream through callbacks. When I do migrate, the tool definitions carry over unchanged, and they're most of the code. I move the loop to create_agent first and check it behaves the same. Only then do I add the feature we migrated for. The trap is hand-building a graph, when most AgentExecutor apps are a plain tool-calling loop, which is exactly what create_agent is.",
      "numbers": "No number applies. This is a migration-judgement question.",
      "wrong": "\"Yes, it's deprecated, so we rewrite it.\" Deprecation alone does not pay for a migration. The panel is listening for a requirement, and for the fact that tools carry over so the cost is smaller than it sounds.",
      "follow": "What is the first feature you would add once it is a graph?",
      "followAnswer": "Usually human approval, since that is often the reason we migrated in the first place. With create_agent that means HumanInTheLoopMiddleware on the risky tools, such as issuing a refund, plus a durable checkpointer like Postgres, so the run pauses, survives a restart and resumes with the approver's decision. I would pair it with a tool call limit so a loop cannot run away, then test that the interrupt fires, resume works, and a rejected action never executes."
    }
  ]
};
