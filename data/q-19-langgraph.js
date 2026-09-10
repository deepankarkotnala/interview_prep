/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["19-langgraph"] = {
  "lede": "LangGraph is what you reach for when the flow stops being a straight line - loops, a branch on a runtime decision, a pause for human approval that resumes tomorrow. Panels use it to separate people who have built an agent from people who have read about one, and the state questions are where that shows.",
  "grounding": "public job descriptions naming LangGraph + documented framework behaviour",
  "evening": [
    "lg-04",
    "lg-05",
    "lg-15",
    "lg-07"
  ],
  "cards": [
    {
      "id": "lg-03",
      "q": "LangChain or LangGraph - when do you need the graph?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "architecture",
        "trade-off"
      ],
      "why": "Whether you pick the tool for the control flow you actually need.",
      "simple": "LangChain and LangGraph sit at different levels, so I do not choose between them as if one replaced the other. In current LangChain, a standard agent created with create_agent already runs on LangGraph underneath.\n\nFor a fixed data-flow pipeline, LCEL is still a good fit. It can sequence steps, run independent branches in parallel, and do conditional routing. So a branch by itself is not a reason to build a StateGraph.\n\nI reach for LangGraph directly when the workflow needs explicit, durable orchestration: state that must survive between steps, cycles with custom exit rules, pause-and-resume for human approval, recovery after failure, or a long-running workflow where I need to control exactly which node runs next.\n\nMy rule is simple: use the highest-level abstraction that expresses the workflow clearly. Plain LCEL for a composable pipeline, create_agent for the normal model-and-tools loop, and StateGraph when I need custom durable control flow.",
      "points": [
        "LCEL can do sequences, parallel branches and conditional routing; it is not limited to a straight line.",
        "LangChain create_agent is the normal starting point for a standard tool-calling agent and runs on LangGraph.",
        "Use LangGraph directly for durable state, custom cycles, pause/resume, recovery and explicit orchestration.",
        "Choose the smallest abstraction that makes the control flow and failure handling clear."
      ],
      "say": "I do not treat LangChain and LangGraph as replacements. LCEL is fine for a composable pipeline and can sequence, parallelise and route conditionally. For a normal model-and-tools loop I start with LangChain create_agent, which already runs on LangGraph. I use StateGraph directly when I need durable state, custom cycles, pause-and-resume, recovery, or explicit control over which step runs next.",
      "numbers": "No number applies. The decision is about control flow, durability and how much orchestration you actually need.",
      "wrong": "Saying LCEL is only a straight line, or saying every branch requires LangGraph. LCEL supports parallel and conditional composition; LangGraph is about durable, stateful orchestration and custom control.",
      "follow": "Show me what the state object looks like for a RAG agent."
    },
    {
      "id": "lg-04",
      "q": "How does state work in LangGraph? What are reducers?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "state",
        "reducers"
      ],
      "why": "The single most-misunderstood part of LangGraph, and easy to verify in one question.",
      "simple": "Every LangGraph run has one state object, usually a typed dictionary. Each node receives the current state and returns a partial update - just the keys it changed. The graph merges that update into the state and moves on.\n\nThe default merge is replace. A node that returns a value for a key overwrites what was there.\n\nThat is wrong for message history, where you want to append rather than overwrite. This is what a reducer is for: a function attached to a state field that says how to combine the old value with the new one. `add_messages` is the built-in reducer for message lists - it appends, and it also handles updating a message by id.\n\nThe practical consequence: if your conversation history keeps resetting to a single message, you forgot the reducer. That is the most common LangGraph bug, and saying so is a strong signal you have written this code rather than read about it.",
      "code": "from typing import Annotated, TypedDict\nfrom langgraph.graph.message import add_messages\nimport operator\n\nclass State(TypedDict):\n    messages: Annotated[list, add_messages]   # appends\n    docs:     Annotated[list, operator.add]   # concatenates\n    step:     int                             # replaced (default)\n\ndef retrieve(state: State) -> dict:\n    return {\"docs\": search(state[\"messages\"][-1].content)}   # partial update only",
      "say": "There is one state object per run. Each node gets the state and returns only the keys it changed, and the graph merges that in. The default merge replaces the value, which is wrong for message history - so you attach a reducer, a function that says how to combine old and new. `add_messages` appends instead of overwriting. If history keeps resetting to one message, a missing reducer is almost always why.",
      "numbers": "No number applies. This is a mechanism question - the code is the answer.",
      "wrong": "\"State is just a dictionary passed between nodes.\" True but incomplete. Without reducers you cannot explain how two parallel nodes both write to `messages` without one destroying the other.",
      "follow": "Two nodes run in parallel and both write to the same key. What happens?"
    },
    {
      "id": "lg-05",
      "q": "What is a checkpointer and what does it actually give you?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "checkpointer",
        "persistence",
        "human-in-loop"
      ],
      "why": "Checkpointing is what makes production features possible. Candidates who only ran notebooks have never needed it.",
      "simple": "A checkpointer saves the graph state after every node, keyed by a thread id. In memory for development, and in Postgres or Redis for production.\n\nIt sounds like a logging detail. It is actually what enables four things you cannot build without it.\n\nConversation memory across requests - the next message on the same thread resumes with all previous state, without you managing history yourself.\n\nHuman in the loop - a node can call `interrupt()`, return control to the application, and resume hours later when the approval arrives, because the state is durable.\n\nFault recovery - if a node crashes, you resume from the last checkpoint instead of re-running the whole expensive chain.\n\nTime travel - rewind to an earlier checkpoint and re-run from there with different input, which is the most useful debugging tool the framework has.",
      "points": [
        "Saves state after every node, keyed by thread id.",
        "Cross-request memory without hand-rolled history.",
        "`interrupt()` plus durable state = human approval that can wait hours.",
        "Resume after a crash from the last node, not from the start.",
        "Time travel: rewind to a checkpoint and replay with different input.",
        "In production use a Postgres or Redis saver, never the in-memory one."
      ],
      "say": "It persists the graph state after every node, keyed by thread id. That is what makes four things possible: conversation memory across requests without managing history myself, human-in-the-loop where the graph interrupts and resumes hours later when approval arrives, crash recovery that resumes from the last node instead of re-running an expensive chain, and time travel to rewind to a checkpoint and replay with different input.",
      "numbers": "Measure checkpoint write latency and storage growth in your own deployment; the important point is that durability adds I/O on graph steps and should be included in the latency budget.",
      "wrong": "\"It saves the conversation.\" That is one use of four, and it misses the interrupt-and-resume story, which is the one regulated employers care about.",
      "follow": "Walk me through an approval flow where the human replies the next morning."
    },
    {
      "id": "lg-06",
      "q": "How do you add human approval inside a LangGraph flow?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "human-in-loop",
        "interrupt",
        "compliance"
      ],
      "why": "The concrete version of the previous question - and the feature regulated employers ask for by name.",
      "simple": "For a real approval step, I put `interrupt()` inside the node that needs a human decision. When execution reaches that call, LangGraph pauses and the checkpointer saves the state for the thread. The application receives the interrupt payload and can show it in a web page, chat message or approval queue.\n\nThe reviewer can approve, reject, or return edited data. Hours later, the application resumes the same thread with `Command(resume=...)`. The value passed to `resume` becomes the return value of `interrupt()`, so the node can apply the human's decision and continue.\n\nThat dynamic pattern is better for business approval logic than relying on a static `interrupt_before` breakpoint, because the pause is explicit in the node and can carry the exact information the reviewer needs.\n\nThe checkpointer is what makes the long wait safe: no web request stays open and no process needs to remain alive. I also make the action idempotent so a duplicate approval cannot send the same email or payment twice.",
      "code": "from langgraph.types import Command, interrupt\n\ndef review_email(state):\n    review = interrupt({\n        \"action\": \"send_email\",\n        \"draft\": state[\"draft\"],\n    })\n    if not review[\"approved\"]:\n        return {\"status\": \"rejected\"}\n    return {\n        \"draft\": review.get(\"draft\", state[\"draft\"]),\n        \"status\": \"approved\",\n    }\n\ngraph = builder.compile(checkpointer=checkpointer)\ncfg = {\"configurable\": {\"thread_id\": \"case-4471\"}}\n\ngraph.invoke(inputs, config=cfg)  # pauses at interrupt()\n\n# ... later, after the reviewer responds ...\ngraph.invoke(\n    Command(resume={\"approved\": True, \"draft\": edited_text}),\n    config=cfg,\n)",
      "say": "I put `interrupt()` inside the node that needs approval. The graph pauses there and the checkpointer persists the thread state, while the application shows the interrupt payload to a reviewer. When the person approves, rejects or edits the proposal, I resume the same thread with `Command(resume=...)`, and that value returns from the interrupt call. The wait can last hours without holding a request open, and the downstream action must be idempotent.",
      "numbers": "No number applies, but do track reviewer turnaround time and the edit rate. A near-zero edit rate means the review is a rubber stamp.",
      "wrong": "Using a prompt like 'ask for confirmation' as the approval mechanism. A prompt cannot durably pause execution, enforce who approves, or prevent a duplicate side effect.",
      "follow": "How do you make sure two reviewers do not approve the same action twice?",
      "points": [
        "Call `interrupt()` inside the node that needs the human decision.",
        "Persist state with a production checkpointer and a stable thread id.",
        "Show the interrupt payload to the reviewer in plain language.",
        "Resume with `Command(resume=...)` on the same thread.",
        "Make the downstream side effect idempotent so duplicate approvals are harmless."
      ]
    },
    {
      "id": "lg-07",
      "q": "How do you stream a LangGraph agent's output to a user?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "streaming",
        "ux",
        "latency"
      ],
      "why": "Streaming is a hard requirement for chat UX and a real source of bugs, so it is a good discriminator.",
      "simple": "There are two different things you might stream, and mixing them up is where the bugs come from.\n\nStreaming tokens means the words of the final answer appear as they are generated. That is what users think of as streaming, and it is what makes a five-second response feel acceptable.\n\nStreaming state means you emit an update after each node - \"searching documents\", \"reading three sources\", \"drafting\". For an agent, that is arguably more valuable, because during a long tool call there are no tokens at all, and a silent UI feels broken.\n\nA good agent UI does both: progress events for the loop, token streaming for the final answer.\n\nThe practical trap: anything that needs the whole output cannot stream. A structured-output parser that must see complete JSON will buffer everything. So if you promised streaming and your last node validates JSON, you have a design conflict to resolve, usually by streaming a summary field separately from the structured payload.",
      "points": [
        "`stream_mode=\"messages\"` - tokens of the final answer.",
        "`stream_mode=\"updates\"` - one event per node, for progress UI.",
        "Agents need progress events; tool calls produce long token-silent gaps.",
        "Whole-output parsers cannot stream. Structured output and token streaming conflict.",
        "Measure time to first token separately from total time - they drive different UX complaints."
      ],
      "say": "Two different streams. Token streaming gives the words of the final answer as they generate. Update streaming emits an event per node, so the UI can say \"searching\" or \"reading three sources\" - which matters more for agents, because a long tool call produces no tokens at all and silence reads as broken. A good UI does both. The trap is that whole-output parsers buffer, so structured output and token streaming conflict.",
      "numbers": "Time to first token is the metric users feel. Under about 1 second reads as responsive; past 3 seconds people assume it has failed, whatever the total time is.",
      "wrong": "\"I set streaming=True.\" It does not explain what happens during a twenty-second tool call, which is the actual UX problem in agents.",
      "follow": "Your last node validates JSON. How do you still give the user something to watch?"
    },
    {
      "id": "lg-12",
      "q": "Build a RAG agent in LangGraph - what nodes and edges?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "rag",
        "design",
        "system-design"
      ],
      "why": "A whiteboard question. Whether you can lay out control flow, not just name components.",
      "simple": "Start with the state, because everything else follows from it: the messages, the retrieved documents, a retry counter, and the final answer.\n\nThen the nodes. A router that decides whether this question even needs retrieval - many do not, and skipping retrieval is a large latency saving. A retrieve node. A grade node that checks whether the retrieved documents are actually relevant. A rewrite node that reformulates the query when they are not. A generate node. And a check node that verifies the answer is grounded in the documents.\n\nThe edges are where the design lives. After grading, go forward if the documents are good, or back to rewrite if not - but only while the retry counter is under two, otherwise fall through to an honest \"I could not find this\". After checking groundedness, either finish or go back once.\n\nThat retry counter in the state is the part interviewers listen for. Without it, this graph loops forever on a question your corpus cannot answer.",
      "code": "class State(TypedDict):\n    messages: Annotated[list, add_messages]\n    docs: list\n    retries: int\n\ng.add_node(\"route\", route); g.add_node(\"retrieve\", retrieve)\ng.add_node(\"grade\", grade); g.add_node(\"rewrite\", rewrite)\ng.add_node(\"generate\", generate); g.add_node(\"check\", check)\n\ng.add_conditional_edges(\"route\", needs_docs,\n                        {\"yes\": \"retrieve\", \"no\": \"generate\"})\ng.add_edge(\"retrieve\", \"grade\")\ng.add_conditional_edges(\"grade\", docs_ok,\n                        {\"ok\": \"generate\",\n                         \"retry\": \"rewrite\",     # only while retries < 2\n                         \"give_up\": \"generate\"}) # answers \"not found\"\ng.add_edge(\"rewrite\", \"retrieve\")\ng.add_conditional_edges(\"check\", grounded,\n                        {\"yes\": END, \"no\": \"rewrite\"})",
      "diagram": {
        "alt": "LangGraph RAG agent over a PDF corpus: route decides if retrieval is needed, retrieve pulls chunks from pgvector, grade checks relevance, rewrite reformulates the query and loops back, generate writes the answer, check verifies groundedness and can loop back once.",
        "rows": [
          [
            {
              "id": "q",
              "label": "“What is our refund window?”",
              "note": "state: messages, docs, retries = 0"
            }
          ],
          [
            {
              "id": "route",
              "label": "route",
              "note": "needs the corpus at all?",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "retrieve",
              "label": "retrieve",
              "note": "top-8 chunks from pgvector"
            },
            {
              "id": "grade",
              "label": "grade",
              "note": "do these chunks answer it?",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "rewrite",
              "label": "rewrite",
              "note": "only while retries < 2",
              "accent": "muted"
            },
            {
              "id": "generate",
              "label": "generate",
              "note": "answer + cite page numbers",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "check",
              "label": "check",
              "note": "every claim in the chunks?",
              "accent": "warn"
            },
            {
              "id": "end",
              "label": "END",
              "note": "answer, or an honest not-found",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "route"
          },
          {
            "from": "route",
            "to": "retrieve",
            "label": "yes"
          },
          {
            "from": "route",
            "to": "generate",
            "label": "no"
          },
          {
            "from": "retrieve",
            "to": "grade"
          },
          {
            "from": "grade",
            "to": "generate",
            "label": "relevant"
          },
          {
            "from": "grade",
            "to": "rewrite",
            "label": "weak",
            "kind": "back"
          },
          {
            "from": "rewrite",
            "to": "retrieve",
            "label": "new query",
            "kind": "back"
          },
          {
            "from": "generate",
            "to": "check"
          },
          {
            "from": "check",
            "to": "end",
            "label": "grounded"
          },
          {
            "from": "check",
            "to": "rewrite",
            "label": "hallucinated",
            "kind": "back"
          }
        ],
        "caption": "Walk it with one question. **“What is our refund window?”** - route says yes, this needs the corpus. Retrieve pulls the top eight chunks from pgvector; grade reads them and finds shipping policy, not refunds. That is the **weak** branch: rewrite turns the query into “refund eligibility period returns policy” and retrieval runs again against the new wording. Second pass lands the right clause, generate writes the answer with page citations, check confirms every claim traces to a retrieved chunk, END. The **retry counter in state** is the part interviewers listen for - without it, a question your PDFs simply do not answer loops between rewrite and retrieve forever. At two, grade gives up and generate says so."
      },
      "say": "State holds messages, retrieved documents and a retry counter. Nodes: route, which skips retrieval when the question does not need it; retrieve; grade, which checks whether the documents are actually relevant; rewrite, which reformulates the query; generate; and check, which verifies groundedness. The edges carry the design - grade loops back to rewrite, but only while retries are under two, then it falls through to an honest not-found answer.",
      "numbers": "Cap rewrites at two. Each one costs a full retrieval plus a model call, and a third rarely recovers a question the corpus cannot answer.",
      "wrong": "Drawing retrieve → generate → END. It is a chain, not an agent, and it does not answer the question that was asked.",
      "follow": "What happens when the grade node itself is wrong?"
    },
    {
      "id": "lg-14",
      "q": "Do you build an agent with create_agent or a StateGraph by hand?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "agents",
        "prebuilt",
        "judgement"
      ],
      "why": "Whether you reach for the abstraction that fits, or hand-build a loop the library already gives you - and whether you know the current API.",
      "simple": "For a standard tool-calling agent, the prebuilt factory is the answer. It wires the whole loop for you: call the model, if the reply contains tool calls run them, feed the results back, repeat until the model answers without calling a tool.\n\nGet the name right, because this one moved. `create_react_agent` from `langgraph.prebuilt` is deprecated in favour of `create_agent` from the `langchain` package, which is the same idea with a middleware system for the things you used to hand-roll. Naming the old one still works but tells the panel when you last read the docs.\n\nYou drop to a hand-built `StateGraph` when the flow stops being that loop. Concretely: you need state fields beyond the message list, several nodes that are not the model, routing that depends on something the model did not decide, a human approval step partway through, or a cycle with its own exit condition.\n\nThe judgement the panel is testing is that these are not tiers of skill. Hand-building a graph that reproduces the prebuilt loop is not seniority, it is work you did not need to do. Start with the factory, and drop down at the first requirement it cannot express.",
      "code": "from langchain.agents import create_agent    # not langgraph.prebuilt\n\nagent = create_agent(model, tools=[search, lookup])\nagent.invoke({\"messages\": [(\"user\", question)]})\n\n# Drop to a StateGraph when the flow needs more than the loop:\n#   extra state fields, non-model nodes, an approval pause,\n#   routing on something the model did not decide.",
      "say": "For a standard tool-calling loop I use the prebuilt factory - and the current one is create_agent from langchain, not create_react_agent from langgraph.prebuilt, which is deprecated. I hand-build a StateGraph when the flow needs state beyond the message list, nodes that are not the model, a human approval pause, or routing on something the model did not decide. Rebuilding the prebuilt loop by hand is work you did not need to do.",
      "numbers": "No number applies. This is an API-choice question.",
      "wrong": "\"I always build the graph myself for control.\" It reads as not knowing the prebuilt exists. The senior answer names the cheap default and the specific trigger for leaving it.",
      "follow": "What is the first requirement that makes you leave the prebuilt?"
    },
    {
      "id": "lg-15",
      "q": "How is tool calling actually wired in a LangGraph agent?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "tools",
        "toolnode",
        "routing"
      ],
      "why": "The most common thing you build in LangGraph. Whether you can draw the loop is whether you have built one.",
      "simple": "Underneath the prebuilt agent are two pieces, and being able to name them is the difference between having used a tutorial and having built the thing.\n\n`ToolNode` is a node that executes tool calls. It reads the last message, finds the tool calls on it, runs them - in parallel when there is more than one - and appends a `ToolMessage` per call back onto the message list.\n\n`tools_condition` is the routing function. It looks at the last message: if the model asked for tools, route to the tool node; otherwise route to END. That single decision is what makes the loop a loop.\n\nThe wiring is a cycle: model → conditional edge → tools → back to model. The edge from the tool node back to the model is unconditional, because after running tools you always want the model to see the results.\n\nThe detail that catches people: the model has to be bound to the tools with `bind_tools`, or it never emits a tool call and the conditional edge always routes straight to END. An agent that answers immediately and never calls anything is almost always a missing `bind_tools`.",
      "code": "from langgraph.graph import StateGraph, START, END\nfrom langgraph.prebuilt import ToolNode, tools_condition\n\nmodel = model.bind_tools(tools)   # without this the loop never starts\n\ng = StateGraph(State)\ng.add_node(\"model\", call_model)\ng.add_node(\"tools\", ToolNode(tools))\ng.add_edge(START, \"model\")\ng.add_conditional_edges(\"model\", tools_condition)   # tools, or END\ng.add_edge(\"tools\", \"model\")                        # always back to the model\napp = g.compile()",
      "say": "ToolNode executes the tool calls on the last message and appends a ToolMessage per call, running them in parallel when there is more than one. tools_condition is the router: if the last message has tool calls, go to the tool node, otherwise END. The edge from tools back to the model is unconditional, which is what makes it a cycle. And the model must be bound with bind_tools or it never emits a call at all.",
      "numbers": "No number applies. This is a wiring question - the graph is the answer.",
      "wrong": "Describing the loop but never mentioning `bind_tools`. It is the single most common reason a hand-built agent silently never calls a tool, and leaving it out suggests you have only read the diagram.",
      "follow": "Two tool calls come back in one message. What order do they run in?"
    },
    {
      "id": "lg-16",
      "q": "What is a subgraph, and when would you use one?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "subgraph",
        "architecture",
        "multi-agent"
      ],
      "why": "How you compose anything past a toy. Panels use it to see whether you have built something with more than one moving part.",
      "simple": "A subgraph is a compiled graph used as a node inside another graph. It is how a LangGraph app stays readable once it outgrows one flat set of nodes.\n\nThere are two ways to attach one, and which applies depends entirely on state.\n\nIf the subgraph shares state keys with the parent, you pass the compiled subgraph straight to `add_node`. It reads and writes the parent's state directly and there is nothing to translate.\n\nIf the schemas differ, you wrap it in a normal node function: map the parent's state into the subgraph's input shape, invoke it, then map the output back. That wrapper is the whole pattern.\n\nThe second case is the one that matters in multi-agent work. Each agent keeps its own private message history in its own schema, and the parent only sees what the wrapper chooses to lift out. Without that, every agent's internal chatter lands in one shared message list and the context you send the top-level model grows without limit.\n\nThe other reason to reach for one is plain reuse - an approval flow or a retrieval step that several parts of the app need, defined once.",
      "code": "# Shared schema - attach the compiled graph directly.\nparent.add_node(\"research\", research_graph)\n\n# Different schema - wrap it and translate both ways.\ndef call_research(state: ParentState) -> dict:\n    out = research_graph.invoke({\"query\": state[\"question\"]})\n    return {\"findings\": out[\"result\"]}     # only what the parent needs\n\nparent.add_node(\"research\", call_research)",
      "say": "A subgraph is a compiled graph used as a node in another graph. If it shares state keys with the parent you attach it directly to add_node. If the schemas differ you wrap it in a node function that maps parent state in and the result back out. That second pattern is what keeps each agent's private message history out of the parent's state in a multi-agent app, so the top-level context does not grow without limit.",
      "numbers": "No number applies. This is a composition question.",
      "wrong": "\"I'd just put all the nodes in one graph.\" It works until two agents share a message list, and then every agent's internal reasoning is in the context of every other one.",
      "follow": "Two subgraph agents both write to the same parent key. What do you need?"
    },
    {
      "id": "lg-19",
      "q": "Your LangGraph agent processes large documents and the checkpoints explode. What went wrong?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "langgraph",
        "state",
        "checkpointer",
        "cost",
        "debugging"
      ],
      "why": "The characteristic LangGraph production failure, and it only happens to people who have actually run one at volume.",
      "simple": "The usual cause is putting large payloads directly into graph state. Checkpointed state is persisted repeatedly as the graph advances, so a large document, huge tool result or growing message history can make storage and resume time grow quickly.\n\nI keep state small. Large raw results go to object storage, a database or a cache, and the graph state keeps an id, metadata and a short summary. A later node can fetch the full object only if it actually needs it.\n\nMessage history needs the same discipline. Long-running agents should trim or summarise old turns instead of appending every large tool result forever.\n\nTo debug it, I plot checkpoint size by step for one thread. The step where the size jumps usually identifies the node that added the payload. I also treat checkpoints as retained application data: avoid unnecessary secrets or PII and define a cleanup policy for old threads.",
      "points": [
        "Everything in state is serialised and written on every super-step.",
        "State holds references, not payloads: tool writes to storage, returns an id and a summary.",
        "The model needs to know the data exists and what it is, not to carry it.",
        "Message history grows by design - trim or summarise before the window forces it.",
        "Diagnose by plotting checkpoint size across steps; the jump names the node.",
        "Never put secrets or raw PII in state - checkpoints are a retention surface.",
        "Set a thread retention policy, or the checkpoint table grows unbounded."
      ],
      "say": "Because everything in state is serialised on every super-step, so a node that stashes a 50 MB document writes it repeatedly for the rest of the run. The rule is that state holds references, not payloads - the tool writes the raw result to object storage and returns an id and a short summary, and whoever needs the content fetches it. I also trim message history, and I diagnose by plotting checkpoint size per step, since the jump names the node.",
      "numbers": "Plot checkpoint size across steps in one thread. Flat is healthy; a staircase means accumulation, and the step where it jumps is your culprit.",
      "wrong": "Blaming the checkpointer and switching from Postgres to something else. The backend is not the problem - you are asking it to persist megabytes per step.",
      "follow": "You need the full document available to a node three steps later. How do you pass it?"
    }
  ]
};
