/* Topic 08 - LangChain and LangGraph.
   Grounding: public JDs naming LangChain/LangGraph at India centres, plus the
   framework's own documented behaviour. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["08-langchain-langgraph"] = {
  lede: "LangChain and LangGraph appear by name in a large share of Indian GenAI job descriptions. The panel usually wants two things: that you know what the abstraction is doing underneath, and that you know when to drop it. Answering only the first half reads as a course-follower.",
  grounding: "public JDs naming these frameworks + documented framework behaviour",
  evening: ["lg-02", "lg-04", "lg-05", "lg-07", "lg-11"],

  cards: [
    {
      id: "lg-01",
      q: "What problem does LangChain actually solve?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["langchain", "basics"],
      why: "Whether you can describe a tool's purpose without reciting its component list.",
      simple:
        "Without a framework, an LLM application is a lot of plumbing you write again on every project. Formatting prompts, calling the provider, parsing the reply into a usable object, retrying, streaming, keeping conversation history, wiring a retriever to a prompt.\n\n" +
        "LangChain gives you standard pieces for that plumbing and a standard way to connect them. The main benefit is a common interface: swapping OpenAI for Azure OpenAI or a self-hosted model is a configuration change rather than a rewrite, because they all expose the same methods.\n\n" +
        "The honest version, which is what senior panels want: it is very useful for getting to a working pipeline fast and for integrations you would otherwise write yourself. It costs you a layer of indirection when you need to debug or tune something precisely. Many teams start with it and drop it for the hot path later.",
      say: "It standardises the plumbing around LLM calls - prompt formatting, output parsing, retries, streaming, memory, retriever wiring - behind one interface, so swapping a provider is configuration rather than a rewrite. It gets you to a working pipeline quickly and gives you integrations for free. The cost is a layer of indirection when you need to debug precisely, which is why teams often keep it for orchestration and drop it in the hot path.",
      numbers: "No number applies. The honest trade-off statement is what scores here.",
      wrong: "Listing components - \"chains, agents, memory, retrievers, callbacks\". It answers what it contains, not what it solves, and every candidate says it.",
      follow: "Where would you not use it?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-02",
      q: "What is LCEL, and why does the pipe operator exist?",
      round: ["tech1"],
      level: "2-5",
      tags: ["langchain", "lcel", "runnable"],
      why: "Whether you understand the interface, or only copied the syntax from a tutorial.",
      simple:
        "LCEL is LangChain Expression Language. The idea is that every piece - a prompt, a model, a parser, a retriever, even a plain function - implements the same small interface, called Runnable. Because they share that interface, you can connect them with the pipe operator, and the result is itself a Runnable.\n\n" +
        "The payoff is not the pretty syntax. It is that you get several things for free on every composed chain, without writing them.\n\n" +
        "Streaming, because each piece knows how to stream. Batching over many inputs. Async versions of everything. Automatic parallelism when you compose a dictionary of branches. And retries and fallbacks attached declaratively rather than wrapped in try blocks.\n\n" +
        "So the pipe is not sugar. It is what makes those cross-cutting behaviours composable.",
      code:
        "chain = (\n" +
        "    {\"context\": retriever | format_docs, \"question\": RunnablePassthrough()}\n" +
        "    | prompt\n" +
        "    | llm\n" +
        "    | StrOutputParser()\n" +
        ")\n\n" +
        "chain.invoke(q)                 # one input\n" +
        "chain.batch([q1, q2, q3])       # many, parallel\n" +
        "async for tok in chain.astream(q):   # streaming, no extra code\n" +
        "    print(tok, end=\"\")",
      say: "LCEL is a shared interface. Every component - prompt, model, parser, retriever, plain function - implements Runnable, so they compose with the pipe operator and the result is itself a Runnable. The benefit is not syntax. Because every piece implements the same interface, streaming, batching, async, automatic parallel branches, retries and fallbacks all come for free on any chain I compose, rather than being written per pipeline.",
      numbers: "A dictionary of branches in LCEL runs those branches concurrently. Two independent retrievers cost roughly max(t1, t2), not t1 + t2.",
      wrong: "\"It's just a nicer way to write chains.\" True and shallow. The interviewer wants streaming, batching, async and parallelism named as the reason.",
      follow: "How does streaming work through a chain that has an output parser at the end?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-03",
      q: "LangChain or LangGraph - when do you need the graph?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["langgraph", "architecture", "trade-off"],
      why: "Whether you pick the tool for the control flow you actually need.",
      simple:
        "LCEL chains are a directed line. Data flows forward, one step to the next. That covers a great deal - most RAG pipelines are exactly this.\n\n" +
        "What a line cannot express is going back. Loops, retries that change route, a branch that depends on a mid-run judgement, a pause for a human that resumes tomorrow. Agents need all of that, because the whole point of an agent is that the model chooses the next step.\n\n" +
        "LangGraph is built for that shape. You define nodes, which are functions, and edges, which decide where to go next. Edges can be conditional, so the route is computed at runtime, and cycles are allowed. There is a shared state object that every node reads and updates, and a checkpointer that persists that state after every node.\n\n" +
        "The rule I use: if the flow is a straight line, LCEL. If it loops, branches on a decision, or has to pause and resume, LangGraph.",
      points: [
        "LCEL - a line. Straight-through pipelines, RAG, extraction, summarisation.",
        "LangGraph - cycles, conditional routing, pause and resume, multi-agent.",
        "LangGraph gives you persisted state per step, which is what makes resume possible.",
        "Do not use a graph for a pipeline that never branches. It adds ceremony for nothing."
      ],
      say: "LCEL chains are a straight line, which covers most RAG and extraction pipelines. LangGraph is for flows that loop, branch on a runtime decision, or pause and resume - which is every real agent. It gives me nodes as functions, conditional edges that compute the route at runtime, a shared state object, and a checkpointer that persists state after every node. If the flow never branches, I stay with LCEL.",
      numbers: "No number applies. This is a control-flow decision.",
      wrong: "\"LangGraph is the new version of LangChain.\" It is not a replacement - it is a different control-flow model, and they are used together.",
      follow: "Show me what the state object looks like for a RAG agent.",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-04",
      q: "How does state work in LangGraph? What are reducers?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["langgraph", "state", "reducers"],
      why: "The single most-misunderstood part of LangGraph, and easy to verify in one question.",
      simple:
        "Every LangGraph run has one state object, usually a typed dictionary. Each node receives the current state and returns a partial update - just the keys it changed. The graph merges that update into the state and moves on.\n\n" +
        "The default merge is replace. A node that returns a value for a key overwrites what was there.\n\n" +
        "That is wrong for message history, where you want to append rather than overwrite. This is what a reducer is for: a function attached to a state field that says how to combine the old value with the new one. `add_messages` is the built-in reducer for message lists - it appends, and it also handles updating a message by id.\n\n" +
        "The practical consequence: if your conversation history keeps resetting to a single message, you forgot the reducer. That is the most common LangGraph bug, and saying so is a strong signal you have written this code rather than read about it.",
      code:
        "from typing import Annotated, TypedDict\n" +
        "from langgraph.graph.message import add_messages\n" +
        "import operator\n\n" +
        "class State(TypedDict):\n" +
        "    messages: Annotated[list, add_messages]   # appends\n" +
        "    docs:     Annotated[list, operator.add]   # concatenates\n" +
        "    step:     int                             # replaced (default)\n\n" +
        "def retrieve(state: State) -> dict:\n" +
        "    return {\"docs\": search(state[\"messages\"][-1].content)}   # partial update only",
      say: "There is one state object per run. Each node gets the state and returns only the keys it changed, and the graph merges that in. The default merge replaces the value, which is wrong for message history - so you attach a reducer, a function that says how to combine old and new. `add_messages` appends instead of overwriting. If history keeps resetting to one message, a missing reducer is almost always why.",
      numbers: "No number applies. This is a mechanism question - the code is the answer.",
      wrong: "\"State is just a dictionary passed between nodes.\" True but incomplete. Without reducers you cannot explain how two parallel nodes both write to `messages` without one destroying the other.",
      follow: "Two nodes run in parallel and both write to the same key. What happens?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-05",
      q: "What is a checkpointer and what does it actually give you?",
      round: ["tech2"],
      level: "5-10",
      tags: ["langgraph", "checkpointer", "persistence", "human-in-loop"],
      why: "Checkpointing is what makes production features possible. Candidates who only ran notebooks have never needed it.",
      simple:
        "A checkpointer saves the graph state after every node, keyed by a thread id. In memory for development, and in Postgres or Redis for production.\n\n" +
        "It sounds like a logging detail. It is actually what enables four things you cannot build without it.\n\n" +
        "Conversation memory across requests - the next message on the same thread resumes with all previous state, without you managing history yourself.\n\n" +
        "Human in the loop - the graph can interrupt before a node, return to the caller, and resume hours later when the approval arrives, because the state is durable.\n\n" +
        "Fault recovery - if a node crashes, you resume from the last checkpoint instead of re-running the whole expensive chain.\n\n" +
        "Time travel - rewind to an earlier checkpoint and re-run from there with different input, which is the most useful debugging tool the framework has.",
      points: [
        "Saves state after every node, keyed by thread id.",
        "Cross-request memory without hand-rolled history.",
        "`interrupt_before` plus durable state = human approval that can wait hours.",
        "Resume after a crash from the last node, not from the start.",
        "Time travel: rewind to a checkpoint and replay with different input.",
        "In production use a Postgres or Redis saver, never the in-memory one."
      ],
      say: "It persists the graph state after every node, keyed by thread id. That is what makes four things possible: conversation memory across requests without managing history myself, human-in-the-loop where the graph interrupts and resumes hours later when approval arrives, crash recovery that resumes from the last node instead of re-running an expensive chain, and time travel to rewind to a checkpoint and replay with different input.",
      numbers: "A Postgres checkpointer adds roughly a few milliseconds per node write. Against a model call of several hundred milliseconds it is noise.",
      wrong: "\"It saves the conversation.\" That is one use of four, and it misses the interrupt-and-resume story, which is the one regulated employers care about.",
      follow: "Walk me through an approval flow where the human replies the next morning.",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-06",
      q: "How do you add human approval inside a LangGraph flow?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["langgraph", "human-in-loop", "interrupt", "compliance"],
      why: "The concrete version of the previous question - and the feature regulated employers ask for by name.",
      simple:
        "You mark a node as interruptible. When the graph reaches it, it stops before executing, saves the state, and returns control to your application. Nothing is lost, because the checkpointer wrote everything down.\n\n" +
        "Your application then shows the pending action to a person - in plain language, with the evidence behind it. That might be a web page, a Teams message, an email. The person can approve, edit the proposed action, or reject it.\n\n" +
        "When the answer arrives, you resume the graph with the same thread id. If they edited, you update the state before resuming. If they rejected, you route to a different node.\n\n" +
        "The important property is that the wait can be long. Because state lives in Postgres, not in a running process, the approval can arrive the next morning, and no request has been held open in the meantime.",
      code:
        "graph = builder.compile(\n" +
        "    checkpointer=PostgresSaver(pool),\n" +
        "    interrupt_before=[\"send_email\"],       # pause here\n" +
        ")\n\n" +
        "cfg = {\"configurable\": {\"thread_id\": \"case-4471\"}}\n" +
        "graph.invoke(inputs, cfg)                  # runs, then stops\n\n" +
        "# ... hours later, after the reviewer clicks Approve ...\n" +
        "graph.update_state(cfg, {\"draft\": edited_text})   # optional edit\n" +
        "graph.invoke(None, cfg)                    # resumes from the interrupt",
      say: "I mark the sensitive node with `interrupt_before`, so the graph stops before executing it and the checkpointer saves the state. My application shows the pending action to a reviewer in plain language with its evidence, and they approve, edit or reject. Resuming means invoking with the same thread id - editing is a state update before that. Because state is in Postgres, the approval can arrive the next morning with no request held open.",
      numbers: "No number applies, but do track reviewer turnaround time and the edit rate. A near-zero edit rate means the review is a rubber stamp.",
      wrong: "\"I'd add a confirmation step in the prompt.\" A prompt cannot pause execution or survive a process restart. This is a runtime feature.",
      follow: "How do you make sure two reviewers do not approve the same action twice?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-07",
      q: "How do you stream a LangGraph agent's output to a user?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["langgraph", "streaming", "ux", "latency"],
      why: "Streaming is a hard requirement for chat UX and a real source of bugs, so it is a good discriminator.",
      simple:
        "There are two different things you might stream, and mixing them up is where the bugs come from.\n\n" +
        "Streaming tokens means the words of the final answer appear as they are generated. That is what users think of as streaming, and it is what makes a five-second response feel acceptable.\n\n" +
        "Streaming state means you emit an update after each node - \"searching documents\", \"reading three sources\", \"drafting\". For an agent, that is arguably more valuable, because during a long tool call there are no tokens at all, and a silent UI feels broken.\n\n" +
        "A good agent UI does both: progress events for the loop, token streaming for the final answer.\n\n" +
        "The practical trap: anything that needs the whole output cannot stream. A structured-output parser that must see complete JSON will buffer everything. So if you promised streaming and your last node validates JSON, you have a design conflict to resolve, usually by streaming a summary field separately from the structured payload.",
      points: [
        "`stream_mode=\"messages\"` - tokens of the final answer.",
        "`stream_mode=\"updates\"` - one event per node, for progress UI.",
        "Agents need progress events; tool calls produce long token-silent gaps.",
        "Whole-output parsers cannot stream. Structured output and token streaming conflict.",
        "Measure time to first token separately from total time - they drive different UX complaints."
      ],
      say: "Two different streams. Token streaming gives the words of the final answer as they generate. Update streaming emits an event per node, so the UI can say \"searching\" or \"reading three sources\" - which matters more for agents, because a long tool call produces no tokens at all and silence reads as broken. A good UI does both. The trap is that whole-output parsers buffer, so structured output and token streaming conflict.",
      numbers: "Time to first token is the metric users feel. Under about 1 second reads as responsive; past 3 seconds people assume it has failed, whatever the total time is.",
      wrong: "\"I set streaming=True.\" It does not explain what happens during a twenty-second tool call, which is the actual UX problem in agents.",
      follow: "Your last node validates JSON. How do you still give the user something to watch?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-08",
      q: "How do you test a LangChain or LangGraph application?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["langchain", "testing", "evaluation", "ci"],
      why: "Whether the code you wrote is production code or notebook code.",
      simple:
        "Split it into layers, because most of the application is ordinary software and should be tested as such.\n\n" +
        "Unit tests with the model faked. Every node is a function from state to state. Substitute a fake model that returns a fixed response, and now you can test routing, reducers, parsing, error handling and termination deterministically, in milliseconds, on every commit. This is the majority of your tests and most teams skip it.\n\n" +
        "Integration tests against a real model, on a small set, run less often, checking the shape of the output rather than exact wording.\n\n" +
        "Evaluation on a golden set - this is not a pass-or-fail test, it is a score you track over time, with a threshold that blocks the release if quality drops.\n\n" +
        "Plus the specific things that break: tool schema validation, that every conditional edge has a reachable path, and that step limits actually fire.",
      points: [
        "Fake the model. Nodes are pure functions of state - test them deterministically.",
        "Assert on routing, reducers, error paths and termination, not on model prose.",
        "Integration tests: small, real model, assert structure not wording.",
        "Golden-set evaluation as a scored gate, not a boolean test.",
        "Explicitly test that the step limit fires and that every edge is reachable."
      ],
      say: "Most of it is ordinary software. I fake the model so every node becomes a deterministic function of state, and unit test routing, reducers, parsing, error handling and termination on every commit in milliseconds. Then a small integration suite against a real model asserting structure, not wording. Then a golden-set evaluation that scores quality and gates the release. And I explicitly test that the step limit fires.",
      numbers: "Aim for the ordinary pyramid: the large majority of tests mocked and fast, a small integration layer, and one evaluation gate. If every test needs an API key, the suite will not run in CI.",
      wrong: "\"You cannot really unit test LLM apps, they are non-deterministic.\" Only the model call is non-deterministic. Everything around it is testable, and this answer says you did not try.",
      follow: "How do you stop a prompt change from silently regressing quality?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-09",
      q: "What does LangSmith give you that logging does not?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["langsmith", "observability", "tracing", "llmops"],
      why: "Whether you have debugged a chain in production or only in a notebook.",
      simple:
        "Plain logs are flat lines. A chain is a tree - a run contains a retriever call, a prompt build, a model call, a parser, maybe a nested agent loop. To debug it you need to see that structure, with the exact input and output at every node.\n\n" +
        "That is the first thing tracing gives: the hierarchy, with timing and token counts attached to each node, so you can see which step cost the latency and which one cost the money.\n\n" +
        "The second thing is the workflow around it. You can take a bad production run and turn it into a dataset example with one click. Over time that dataset becomes your evaluation set, built from real failures rather than imagined ones. Then you run evaluations against it, compare two prompt versions side by side, and see whether a change helped before you ship it.\n\n" +
        "Feedback closes the loop: a thumbs-down in your app attaches to the trace that produced it.",
      points: [
        "Hierarchical traces, not flat lines - you see which node was slow or expensive.",
        "Exact inputs and outputs at every step, including the fully assembled prompt.",
        "One-click promotion of a bad production run into an evaluation dataset.",
        "Side-by-side comparison of prompt or model versions on the same dataset.",
        "User feedback attached to the trace that caused it.",
        "It is not the only option - OpenTelemetry, Langfuse and Phoenix do similar things."
      ],
      say: "A chain is a tree, not a line, so flat logs cannot show you which node was slow or expensive. Tracing gives the hierarchy with inputs, outputs, timings and tokens at every step, including the fully assembled prompt. The bigger value is the workflow: I promote a bad production run into an evaluation dataset, so my eval set is built from real failures, then compare prompt versions on it before shipping.",
      numbers: "Traces show per-node token counts. It is common to find one retrieval-formatting step contributing a large share of prompt tokens that nobody had measured.",
      wrong: "\"We use LangSmith for monitoring.\" Names the product without saying what it does. Describe the tree, the datasets and the comparison.",
      follow: "Your traces contain customer PII. How do you keep using them?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-10",
      q: "How do you control cost and latency in a LangChain pipeline?",
      round: ["tech2"],
      level: "5-10",
      tags: ["langchain", "cost", "latency", "optimisation"],
      why: "Whether you have owned a production bill.",
      simple:
        "First measure, per step. In almost every pipeline one step dominates, and it is usually not the one people assume. Retrieved context is normally the biggest token contributor, not the user's question.\n\n" +
        "Then the standard moves, roughly in order of payoff.\n\n" +
        "Right-size the model per step. Classification, routing and extraction rarely need your most expensive model; the final generation might. Mixed-model pipelines are normal and this is the single biggest saving available.\n\n" +
        "Cut context. Rerank to fewer chunks, trim boilerplate from documents, summarise old conversation turns. Fewer input tokens is both cheaper and faster.\n\n" +
        "Cache. Exact-match caching for repeated questions, and provider prompt caching for a long stable system prompt, which cuts both cost and time to first token.\n\n" +
        "Parallelise independent branches - LCEL does this automatically if you compose them as a dictionary. Stream, so perceived latency improves even when total time does not.",
      points: [
        "Measure per step first. Context is usually the biggest token line, not the question.",
        "Right-size the model per step - cheap models for routing, classification, extraction.",
        "Cut context: rerank to fewer chunks, strip boilerplate, summarise old turns.",
        "Cache exact repeats; use provider prompt caching for stable system prompts.",
        "Run independent branches in parallel - LCEL dictionaries do this for you.",
        "Stream to fix perceived latency when real latency cannot move."
      ],
      say: "I measure per step first, because context usually dominates the token bill rather than the user's question. Then: right-size the model per step, since routing and extraction do not need the expensive model. Cut context by reranking to fewer chunks and trimming boilerplate. Cache exact repeats and use provider prompt caching for the stable system prompt. Run independent branches in parallel, and stream to fix perceived latency.",
      numbers: "Moving routing and extraction steps to a small model commonly cuts total spend substantially, because those steps are high-volume and low-difficulty. Measure the split before you optimise.",
      wrong: "\"We switched to a cheaper model.\" Across the whole pipeline this usually trades a cost problem for a quality problem. The senior answer is per-step, measured.",
      follow: "Your p95 latency is 6 seconds and the budget is 3. Where do you cut?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-11",
      q: "When would you drop the framework and call the API directly?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["langchain", "judgement", "trade-off", "architecture"],
      why: "Framework independence. Panels are wary of candidates who can only work inside one library.",
      simple:
        "When the abstraction costs more than it saves.\n\n" +
        "Concretely: when the flow is one prompt and one call, and a framework adds a dependency tree for something that is fifteen lines of code. When you need precise control of the exact bytes sent to the provider and the layer is getting in the way. When you are chasing latency and want no indirection between your code and the HTTP call. When you need a provider feature the abstraction has not exposed yet. And when debugging keeps taking you three layers deep into library internals - that is the signal that the abstraction has stopped helping.\n\n" +
        "The pattern many teams settle on is a split: the framework for orchestration, checkpointing, tracing and integrations, where it earns its place, and direct API calls in the hot path where control matters.\n\n" +
        "Saying this openly reads as confidence, not disloyalty. It is a stronger answer than defending the framework.",
      points: [
        "Single-call, single-prompt tasks - direct is simpler and clearer.",
        "Latency-critical paths where indirection is measurable.",
        "You need a provider feature the abstraction has not wrapped yet.",
        "Debugging repeatedly ends up inside library internals.",
        "Common landing spot: framework for orchestration, direct calls in the hot path."
      ],
      say: "When the abstraction costs more than it saves. A single prompt and one call does not need a dependency tree. Latency-critical paths do not want indirection. And if I need a provider feature the wrapper has not exposed, or debugging keeps taking me three layers into library internals, that is the signal. The split I usually end up with is the framework for orchestration and tracing, direct calls in the hot path.",
      numbers: "No number applies. This answer is judged on whether the reasoning is concrete.",
      wrong: "\"LangChain is bloated, I always call the API directly.\" Equally unhelpful in the other direction. You then have to explain why you rebuilt checkpointing and tracing yourself.",
      follow: "You dropped it in the hot path. What did you have to rebuild?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    },

    {
      id: "lg-12",
      q: "Build a RAG agent in LangGraph - what nodes and edges?",
      round: ["tech2"],
      level: "5-10",
      tags: ["langgraph", "rag", "design", "system-design"],
      why: "A whiteboard question. Whether you can lay out control flow, not just name components.",
      simple:
        "Start with the state, because everything else follows from it: the messages, the retrieved documents, a retry counter, and the final answer.\n\n" +
        "Then the nodes. A router that decides whether this question even needs retrieval - many do not, and skipping retrieval is a large latency saving. A retrieve node. A grade node that checks whether the retrieved documents are actually relevant. A rewrite node that reformulates the query when they are not. A generate node. And a check node that verifies the answer is grounded in the documents.\n\n" +
        "The edges are where the design lives. After grading, go forward if the documents are good, or back to rewrite if not - but only while the retry counter is under two, otherwise fall through to an honest \"I could not find this\". After checking groundedness, either finish or go back once.\n\n" +
        "That retry counter in the state is the part interviewers listen for. Without it, this graph loops forever on a question your corpus cannot answer.",
      code:
        "class State(TypedDict):\n" +
        "    messages: Annotated[list, add_messages]\n" +
        "    docs: list\n" +
        "    retries: int\n\n" +
        "g.add_node(\"route\", route); g.add_node(\"retrieve\", retrieve)\n" +
        "g.add_node(\"grade\", grade); g.add_node(\"rewrite\", rewrite)\n" +
        "g.add_node(\"generate\", generate); g.add_node(\"check\", check)\n\n" +
        "g.add_conditional_edges(\"route\", needs_docs,\n" +
        "                        {\"yes\": \"retrieve\", \"no\": \"generate\"})\n" +
        "g.add_edge(\"retrieve\", \"grade\")\n" +
        "g.add_conditional_edges(\"grade\", docs_ok,\n" +
        "                        {\"ok\": \"generate\",\n" +
        "                         \"retry\": \"rewrite\",     # only while retries < 2\n" +
        "                         \"give_up\": \"generate\"}) # answers \"not found\"\n" +
        "g.add_edge(\"rewrite\", \"retrieve\")\n" +
        "g.add_conditional_edges(\"check\", grounded,\n" +
        "                        {\"yes\": END, \"no\": \"rewrite\"})",
      say: "State holds messages, retrieved documents and a retry counter. Nodes: route, which skips retrieval when the question does not need it; retrieve; grade, which checks whether the documents are actually relevant; rewrite, which reformulates the query; generate; and check, which verifies groundedness. The edges carry the design - grade loops back to rewrite, but only while retries are under two, then it falls through to an honest not-found answer.",
      numbers: "Cap rewrites at two. Each one costs a full retrieval plus a model call, and a third rarely recovers a question the corpus cannot answer.",
      wrong: "Drawing retrieve → generate → END. It is a chain, not an agent, and it does not answer the question that was asked.",
      follow: "What happens when the grade node itself is wrong?",
      followAnswer: "In the room, address this by connecting the specific scenario directly to system trade-offs: First, state the immediate operational implication (e.g. impact on latency, cost, memory, or correctness). Second, provide the concrete architectural mitigation (such as adjusting thresholds, caching, fallback routing, or code-level validation). Finally, explain how you would measure and verify the resolution using automated metrics."
    }
  ]
};
