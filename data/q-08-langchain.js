/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["08-langchain"] = {
  "lede": "LangChain still appears by name in many GenAI job descriptions. The panel usually wants two things: that you know what the abstraction is doing underneath, and that you know when to drop it. Answering only the first half reads as framework memorisation. Questions about graphs, state and agent loops are in the LangGraph topic.",
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
      "tags": [
        "langchain",
        "basics"
      ],
      "why": "Whether you can describe a tool's purpose without reciting its component list.",
      "simple": "Without a framework, an LLM application is a lot of plumbing you write again on every project. Formatting prompts, calling the provider, parsing the reply into a usable object, retrying, streaming, keeping conversation history, wiring a retriever to a prompt.\n\nLangChain gives you standard pieces for that plumbing and a standard way to connect them. The main benefit is a common interface: swapping OpenAI for Azure OpenAI or a self-hosted model is mostly a configuration change rather than a rewrite, because they all expose the same methods - though prompts and tool-calling behaviour still need re-testing on the new model.\n\nThe honest version, which is what senior panels want: it is very useful for getting to a working pipeline fast and for integrations you would otherwise write yourself. It costs you a layer of indirection when you need to debug or tune something precisely. Many teams start with it and drop it for the hot path later.",
      "say": "It standardises the plumbing around LLM calls - prompt formatting, output parsing, retries, streaming, memory, retriever wiring - behind one interface, so swapping a provider is mostly configuration rather than a rewrite. It gets you to a working pipeline quickly and gives you integrations for free. The cost is a layer of indirection when you need to debug precisely, which is why teams often keep it for orchestration and drop it in the hot path.",
      "numbers": "No number applies. The honest trade-off statement is what scores here.",
      "wrong": "Listing components - \"chains, agents, memory, retrievers, callbacks\". It answers what it contains, not what it solves, and every candidate says it.",
      "follow": "Where would you not use it?"
    },
    {
      "id": "lg-02",
      "q": "What is LCEL, and why does the pipe operator exist?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "langchain",
        "lcel",
        "runnable"
      ],
      "why": "Whether you understand the interface, or only copied the syntax from a tutorial.",
      "simple": "LCEL is LangChain Expression Language. The idea is that every piece - a prompt, a model, a parser, a retriever, even a plain function - implements the same small interface, called Runnable. Because they share that interface, you can connect them with the pipe operator, and the result is itself a Runnable.\n\nThe payoff is not the pretty syntax. It is that you get several things for free on every composed chain, without writing them.\n\nStreaming, because each piece knows how to stream. Batching over many inputs. Async versions of everything. Automatic parallelism when you compose a dictionary of branches. And retries and fallbacks attached declaratively rather than wrapped in try blocks.\n\nSo the pipe is not sugar. It is what makes those cross-cutting behaviours composable.",
      "code": "chain = (\n    {\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}\n    | prompt\n    | llm\n    | StrOutputParser()\n)\n\nchain.invoke(q)                 # one input\nchain.batch([q1, q2, q3])       # many, parallel\nasync for tok in chain.astream(q):   # streaming, no extra code\n    print(tok, end=\"\")",
      "say": "LCEL is a shared interface. Every component - prompt, model, parser, retriever, plain function - implements Runnable, so they compose with the pipe operator and the result is itself a Runnable. The benefit is not syntax. Because every piece implements the same interface, streaming, batching, async, automatic parallel branches, retries and fallbacks all come for free on any chain I compose, rather than being written per pipeline.",
      "numbers": "A dictionary of branches in LCEL runs those branches concurrently. Two independent retrievers cost roughly max(t1, t2), not t1 + t2.",
      "wrong": "\"It's just a nicer way to write chains.\" True and shallow. The interviewer wants streaming, batching, async and parallelism named as the reason.",
      "follow": "How does streaming work through a chain that has an output parser at the end?"
    },
    {
      "id": "lg-08",
      "q": "How do you test a LangChain or LangGraph application?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
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
      "id": "lg-09",
      "q": "What does LangSmith give you that logging does not?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
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
        "It is not the only option - OpenTelemetry, Langfuse and Phoenix do similar things."
      ],
      "say": "A chain is a tree, not a line, so flat logs cannot show you which node was slow or expensive. Tracing gives the hierarchy with inputs, outputs, timings and tokens at every step, including the fully assembled prompt. The bigger value is the workflow: I promote a bad production run into an evaluation dataset, so my eval set is built from real failures, then compare prompt versions on it before shipping.",
      "numbers": "Traces show per-node token counts. It is common to find one retrieval-formatting step contributing a large share of prompt tokens that nobody had measured.",
      "wrong": "\"We use LangSmith for monitoring.\" Names the product without saying what it does. Describe the tree, the datasets and the comparison.",
      "follow": "Your traces contain customer PII. How do you keep using them?"
    },
    {
      "id": "lg-10",
      "q": "How do you control cost and latency in a LangChain pipeline?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
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
      "id": "lg-11",
      "q": "When would you drop the framework and call the API directly?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
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
      "follow": "You dropped it in the hot path. What did you have to rebuild?"
    },
    {
      "id": "lg-13",
      "q": "What is a chain, and what is a runnable?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
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
      "follow": "So what does LCEL add on top of that?"
    },
    {
      "id": "lg-17",
      "q": "You have inherited a LangChain AgentExecutor app. Do you migrate it?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "langchain",
        "langgraph",
        "migration",
        "judgement",
        "legacy"
      ],
      "why": "A real situation at any firm with code older than about a year, and a question about judgement as much as API knowledge.",
      "simple": "**Short version: not automatically. Migrate when you need something the old executor does not give you cleanly - a durable pause for approval, state that survives a restart - and keep the tools exactly as they are.**\n\n`AgentExecutor` was the old way to run an agent loop. It still works, but it is legacy - in LangChain 1.x it moved to the `langchain-classic` package, and the current path is a graph: either the prebuilt `create_agent` factory, which runs on LangGraph, or a `StateGraph` you build.\n\nThe honest answer starts with: not automatically. A working `AgentExecutor` app that nobody is asking to change is not a reason to spend a sprint.\n\nWhat makes it worth doing is a requirement that benefits from the graph runtime: durable pause and resume for human approval, persisted state that survives a process restart, explicit application-controlled routing, or richer state than a plain agent loop. Legacy executors can expose streaming and callbacks, so streaming alone is not a reason to rewrite a working service. The graph becomes valuable when I need durable execution and addressable steps rather than only visibility into the loop.\n\nHow I would do it: keep the tools exactly as they are, because tool definitions carry over unchanged and that is most of the surface area. Move the loop first and get behaviour parity with the old one. Only then add the thing you actually migrated for - the approval pause, the checkpointer, the extra state.\n\nThe trap is rebuilding it as a hand-written graph when the prebuilt factory would have matched the old behaviour exactly. Most `AgentExecutor` apps are a plain tool-calling loop, which is what the factory already is.",
      "code": "# Before - the loop is inside the executor, and opaque.\n# (LangChain 1.x: from langchain_classic.agents import AgentExecutor)\nexecutor = AgentExecutor(agent=agent, tools=tools)\n\n# After - same tools, same behaviour, steps now addressable.\nfrom langchain.agents import create_agent\napp = create_agent(model, tools=tools, checkpointer=saver)\n\n# Now the things the executor could not do are available:\n#   pause for approval, resume after a crash, durable per-thread state.",
      "say": "Not automatically - a working app nobody is changing is not worth a sprint. I migrate when I need graph-native capabilities such as durable human approval, persisted state across restarts, explicit application routing, or richer workflow state. Streaming alone is not enough because legacy executors can expose callbacks and streams. I keep the tools, move the loop for behaviour parity, then add the capability that justified the migration.",
      "numbers": "No number applies. This is a migration-judgement question.",
      "wrong": "\"Yes, it's deprecated, so we rewrite it.\" Deprecation alone does not pay for a migration. The panel is listening for a requirement, and for the fact that tools carry over so the cost is smaller than it sounds.",
      "follow": "What is the first feature you would add once it is a graph?"
    },
    {
      "id": "lg-18",
      "q": "Three tickets land: a policy Q&A bot, a support agent that looks up orders, and a refund flow that needs manager sign-off. Which LangChain or LangGraph building block does each get?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
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
    }
  ]
};
