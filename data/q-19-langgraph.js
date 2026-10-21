/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["19-langgraph"] = {
  "lede": "LangGraph is what you reach for when the flow stops being a straight line - loops, a branch on a runtime decision, a pause for human approval that resumes tomorrow. Panels use it to separate people who have built an agent from people who have read about one, and the state questions are where that shows. New to LangGraph? The questions are ordered for a first read: High priority first, from when you need a graph through state, tool wiring, create_agent, checkpointers, memory, human approval and a RAG agent design, then Medium, then Low.",
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
      "priority": "high",
      "tags": [
        "langgraph",
        "langchain",
        "trade-offs"
      ],
      "why": "Whether you pick the tool for the control flow you actually need.",
      "quick": [
        "They work at different levels, not as rivals.",
        "create_agent already runs on LangGraph underneath.",
        "Fixed pipelines with branches do not need a graph.",
        "Use the graph for saved state, pauses and crash recovery.",
        "Pick the simplest tool that shows the flow clearly."
      ],
      "simple": "LangChain and LangGraph aren't rivals, because they sit at different levels. A standard agent made with create_agent already runs on LangGraph underneath, so the real question is how much orchestration your workflow needs.\n\nFor a fixed pipeline, LCEL is still a good fit, and it can even branch and run steps in parallel. You reach for a StateGraph when the workflow needs durable orchestration, like state that survives between steps, loops with custom exit rules, pausing for human approval, or recovery after a failure. For example, an expense approval that waits hours for a manager and must survive a server crash is a clear case for a graph, while a simple summarise-then-translate pipeline isn't.\n\nSo the rule is to use the smallest abstraction that expresses the workflow clearly, because a graph adds code and concepts to maintain.",
      "points": [
        "LCEL can do sequences, parallel branches and conditional routing; it is not limited to a straight line.",
        "LangChain create_agent is the normal starting point for a standard tool-calling agent and runs on LangGraph.",
        "Use LangGraph directly for durable state, custom cycles, pause/resume, recovery and explicit orchestration.",
        "Choose the smallest abstraction that makes the control flow and failure handling clear."
      ],
      "diagram": {
        "alt": "A decision path: a fixed pipeline goes to LCEL; otherwise a standard model-and-tools loop goes to create_agent; otherwise custom durable control flow goes to a StateGraph.",
        "rows": [
          [
            {
              "id": "q1",
              "label": "Fixed pipeline?",
              "note": "steps known in advance",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "lcel",
              "label": "LCEL",
              "note": "sequence, parallel, branch",
              "accent": "accent"
            },
            {
              "id": "q2",
              "label": "Standard tool loop?",
              "note": "model picks tools",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "ca",
              "label": "create_agent",
              "note": "runs on LangGraph",
              "accent": "accent"
            },
            {
              "id": "sg",
              "label": "StateGraph",
              "note": "durable state, pause, cycles",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "q1",
            "to": "lcel",
            "label": "yes"
          },
          {
            "from": "q1",
            "to": "q2",
            "label": "no"
          },
          {
            "from": "q2",
            "to": "ca",
            "label": "yes"
          },
          {
            "from": "q2",
            "to": "sg",
            "label": "no"
          }
        ],
        "caption": "Not rivals, **levels**. Use the **highest-level abstraction that expresses the flow clearly**; a branch alone is no reason to build a graph."
      },
      "say": "They aren't rivals, because they sit at different levels. LangChain's create_agent already runs on LangGraph underneath. For a fixed data-flow pipeline, LCEL is still a good fit. It can sequence steps, run independent branches in parallel and route conditionally, so a branch alone is no reason to build a graph. I reach for a StateGraph directly when the workflow needs explicit, durable orchestration. That means state that must survive between steps, cycles with custom exit rules, pause and resume for a human, recovery after a failure, or exact control over which node runs next. An approval workflow that waits hours for a manager and has to survive a crash is the clear case. The mistake I'd avoid is reaching for the graph for its own sake. Use the highest-level abstraction that expresses the flow clearly, so LCEL for pipelines, create_agent for the normal tool loop, and StateGraph for custom durable control.",
      "numbers": "No number applies. The decision is about control flow, durability and how much orchestration you actually need.",
      "verified": "2026-10",
      "wrong": "Saying LCEL is only a straight line, or saying every branch requires LangGraph. LCEL supports parallel and conditional composition; LangGraph is about durable, stateful orchestration and custom control.",
      "follow": "Show me what the state object looks like for a RAG agent.",
      "followAnswer": "A typed dictionary with four fields. messages, with the add_messages reducer so turns append. docs, the retrieved chunks for the current question, replaced on each retrieval rather than accumulated. retries, an integer counter so the rewrite loop has an exit. And answer, the final text with citations. I keep large raw documents out of state and store ids instead, so checkpoints stay small.",
      "builds": [
        "lg-02"
      ],
      "next": [
        "lg-04",
        "lg-05",
        "lg-18"
      ],
      "deeper": [
        "langgraph-docs",
        "langchain-docs"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which requirement, on its own, is NOT a reason to move from an LCEL chain to a StateGraph?",
        "options": [
          "Pausing for a human approval that may take hours.",
          "Running two retrievers in parallel and branching on question type.",
          "Resuming from the last completed step after a crash.",
          "A loop with a custom exit rule and its own counters in state."
        ],
        "answer": 1,
        "why": "LCEL already supports parallel branches and conditional routing. The graph earns its extra code with durable state, pauses, crash recovery and custom loops. Saying every branch needs LangGraph is the misconception this card targets."
      }
    },
    {
      "id": "lg-04",
      "q": "How does state work in LangGraph? What are reducers?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "python"
      ],
      "why": "The single most-misunderstood part of LangGraph, and easy to verify in one question.",
      "quick": [
        "Each run has one shared state object.",
        "Each step returns only the fields it changed.",
        "By default a new value replaces the old one.",
        "A reducer says how to combine old and new values.",
        "Chat history resetting usually means a missing reducer."
      ],
      "simple": "Every LangGraph run has one shared state object, usually a typed dictionary. Each node receives the current state and returns just the keys it changed, and the graph merges that update in. By default, the merge is replace, so a new value overwrites the old one.\n\nThat's fine for a step counter, but wrong for message history, where you want to append. That's what a reducer is for. It's a function attached to a state field that says how to combine the old value with the new one, and the built-in add_messages reducer appends messages. Reducers also matter with parallel nodes, because two branches writing the same key without one raises an error.\n\nFor example, if a chatbot's history keeps resetting to a single message after each turn, the cause is almost always a missing reducer on the messages field.",
      "diagram": {
        "kind": "compare",
        "alt": "The default replace merge compared with the add_messages reducer, showing old value, node update, result and what each suits.",
        "aspects": [
          "Old value",
          "Node returns",
          "Merged result",
          "Use for"
        ],
        "columns": [
          {
            "label": "Default: replace",
            "note": "no reducer",
            "accent": "warn",
            "cells": [
              "[hi]",
              "[bye]",
              "[bye]",
              "Counters, flags"
            ]
          },
          {
            "label": "add_messages",
            "note": "reducer on the field",
            "accent": "accent",
            "cells": [
              "[hi]",
              "[bye]",
              "[hi, bye]",
              "Message history"
            ]
          }
        ],
        "caption": "Nodes return **only the keys they changed**; a reducer says how to merge them. History that keeps resetting to one message means **a missing reducer**."
      },
      "say": "Each run has one shared state object, and reducers decide how updates to it get merged. The state is usually a typed dictionary. Each node receives the current state and returns only the keys it changed, and the graph merges that partial update before moving on. By default the merge replaces the old value. That's fine for a step counter but wrong for message history, where you want to append. A reducer is a function attached to a state field that says how to combine old and new. add_messages is the built-in one for message lists, so it appends and also updates an existing message by its id. operator.add simply concatenates lists. Reducers matter even more with parallel nodes. If two branches write the same key in one step and it has no reducer, LangGraph raises an error rather than guess. And if chat history keeps resetting to one message, a missing reducer is almost always why.",
      "numbers": "No number applies. This is a mechanism question - the code is the answer.",
      "wrong": "\"State is just a dictionary passed between nodes.\" True but incomplete. Without reducers you cannot explain what happens when two parallel nodes write to `messages` in the same step - with no reducer on that key, LangGraph rejects the conflicting updates with an error instead of merging them.",
      "follow": "Two nodes run in parallel and both write to the same key. What happens?",
      "followAnswer": "If that key has no reducer, LangGraph raises an InvalidUpdateError, because it cannot know which value should win. With a reducer, both updates are merged in the same step - operator.add concatenates lists, add_messages appends messages. So for any key that parallel branches write, like collected search results, I attach a reducer on purpose and make sure the merge order does not matter.",
      "builds": [
        "lg-03"
      ],
      "next": [
        "lg-16",
        "lg-15",
        "lg-19"
      ],
      "deeper": [
        "langgraph-graph-api",
        "langgraph-docs"
      ],
      "check": {
        "kind": "predict",
        "q": "State is `class S(TypedDict): messages: list`, with no reducer. A node returns `{\"messages\": [new_reply]}`. What does `messages` hold afterwards?",
        "options": [
          "Only `[new_reply]` - the default merge replaces the old value.",
          "The old messages plus `new_reply`, because lists always append.",
          "An error, because nodes must return the full state.",
          "Two copies of the history."
        ],
        "answer": 0,
        "why": "Without a reducer the update overwrites the key, which is why chat history appears to reset. Annotate the field with `add_messages` or `operator.add` to append. Nodes return partial updates, so that is not the error."
      },
      "try": {
        "title": "Break and fix a reducer",
        "minutes": 10,
        "steps": [
          "`pip install langgraph` and run the starter; observe an error because two parallel nodes write `log` with no reducer.",
          "Change the field to `Annotated[list[str], operator.add]` and re-run; observe both entries kept.",
          "Remove node `b` and its edges, drop the reducer, and invoke with `{\"log\": [\"old\"]}`; observe `old` being replaced.",
          "Explain in one sentence why `add_messages` exists for chat history."
        ],
        "code": "import operator\nfrom typing import Annotated, TypedDict\nfrom langgraph.graph import StateGraph, START, END\n\nclass S(TypedDict):\n    log: list[str]  # try: Annotated[list[str], operator.add]\n\ndef a(s): return {\"log\": [\"a\"]}\ndef b(s): return {\"log\": [\"b\"]}\n\ng = StateGraph(S)\ng.add_node(\"a\", a)\ng.add_node(\"b\", b)\ng.add_edge(START, \"a\")\ng.add_edge(START, \"b\")\ng.add_edge(\"a\", END)\ng.add_edge(\"b\", END)\nprint(g.compile().invoke({\"log\": []}))"
      }
    },
    {
      "id": "lg-15",
      "q": "How is tool calling actually wired in a LangGraph agent?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "tools"
      ],
      "why": "The most common thing you build in LangGraph. Whether you can draw the loop is whether you have built one.",
      "quick": [
        "It is a loop between the model and a tool step.",
        "The tool step runs every tool the model asked for.",
        "A routing check sends it to tools or to the end.",
        "After tools it always goes back to the model.",
        "An agent that never uses tools usually lacks bind_tools."
      ],
      "simple": "Underneath the prebuilt LangGraph agent there are two pieces. ToolNode is a node that executes tool calls. It reads the last message, runs the tools it asks for, and appends one ToolMessage per call. tools_condition is the routing function. If the model asked for tools, it routes to the tool node, otherwise to END.\n\nSo the wiring is a cycle, from the model, through a conditional edge, to the tools, and always back to the model so it sees the results.\n\nThe detail that catches people is bind_tools. If the model isn't bound to the tools, it never emits a tool call, and the edge always routes straight to END. For example, if a weather agent answers every question instantly with a guess instead of calling the weather tool, a missing bind_tools is the first thing to check.",
      "diagram": {
        "alt": "The tool-calling loop: START to the model, then tools_condition routes to ToolNode if there are tool calls or to END if not, and ToolNode always returns to the model.",
        "rows": [
          [
            {
              "id": "s",
              "label": "START"
            }
          ],
          [
            {
              "id": "m",
              "label": "Model",
              "note": "needs bind_tools",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "c",
              "label": "tools_condition",
              "note": "checks last message",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "t",
              "label": "ToolNode",
              "note": "runs calls, adds ToolMessages"
            },
            {
              "id": "e",
              "label": "END",
              "note": "plain answer"
            }
          ]
        ],
        "edges": [
          {
            "from": "s",
            "to": "m"
          },
          {
            "from": "m",
            "to": "c"
          },
          {
            "from": "c",
            "to": "t",
            "label": "tool calls"
          },
          {
            "from": "c",
            "to": "e",
            "label": "none"
          },
          {
            "from": "t",
            "to": "m",
            "label": "always",
            "kind": "back"
          }
        ],
        "caption": "**One conditional edge makes the loop.** An agent that answers instantly and never calls a tool is usually **missing bind_tools**."
      },
      "say": "It's a cycle between the model and a tool node, built from ToolNode and tools_condition. ToolNode reads the last message, runs every tool call on it, in parallel when there are several, and appends one ToolMessage per call. tools_condition is the routing function. It checks the last message and sends the flow to the tool node if the model asked for tools, or to END otherwise. That one decision is what makes the loop a loop. So the flow goes model, conditional edge, tools, and back to the model. The edge back is unconditional, because after running tools you always want the model to see the results. The detail that catches people is bind_tools. If the model was never bound to the tools, it can't emit a tool call and the edge routes straight to END. When an agent answers instantly and never calls anything, that's my first check, followed by a tool description that never says when to use it.",
      "numbers": "No number applies. This is a wiring question - the graph is the answer.",
      "wrong": "Describing the loop but never mentioning `bind_tools`. It is the single most common reason a hand-built agent silently never calls a tool, and the natural follow-up - \"why does my agent never call a tool?\" - is exactly what it answers.",
      "follow": "Two tool calls come back in one message. What order do they run in?",
      "followAnswer": "ToolNode runs them concurrently, so there is no guaranteed execution order - treat them as independent. Each result comes back as a ToolMessage carrying its tool_call_id, so the model can pair every result with its call. If one call depends on another, such as create then update, parallel execution is wrong: I tell the model to call them one at a time, or turn off parallel tool calls for that model.",
      "builds": [
        "ag-14",
        "lg-04"
      ],
      "next": [
        "lg-14",
        "ag-18",
        "lg-12"
      ],
      "deeper": [
        "langgraph-docs"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A hand-built agent has ToolNode and `tools_condition` wired correctly, but every question gets an instant guessed answer and the tool node never runs. The agent node calls `llm.invoke(state[\"messages\"])` where `llm = ChatOllama(model=...)`. What is missing?",
        "options": [
          "An edge from the tool node back to the agent.",
          "A checkpointer.",
          "A higher recursion limit.",
          "`bind_tools` - the model was never told the tools exist, so it never emits a tool call."
        ],
        "answer": 3,
        "why": "If the model is not bound to the tools, it never produces a tool call, so `tools_condition` always routes to END. A missing return edge would break the loop after the first tool call, not stop tool calls entirely."
      },
      "try": {
        "title": "Wire the tool loop and break it on purpose",
        "minutes": 20,
        "steps": [
          "`pip install langgraph langchain-ollama`, pull `qwen2.5:7b`, and run the starter; observe an AI tool call, a ToolMessage, then the final answer.",
          "Remove `.bind_tools([get_weather])` and re-run; observe the model guessing with no tool call.",
          "Ask two questions in one message (Chennai and Delhi) and observe one ToolMessage per call.",
          "Remove the `tools -> agent` edge and observe the run ending on a ToolMessage with no answer."
        ],
        "code": "from langchain_core.tools import tool\nfrom langchain_ollama import ChatOllama\nfrom langgraph.graph import StateGraph, MessagesState, START\nfrom langgraph.prebuilt import ToolNode, tools_condition\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Return today's weather for a city.\"\"\"\n    return f\"32C and humid in {city}\"\n\nllm = ChatOllama(model=\"qwen2.5:7b\").bind_tools([get_weather])\n\ndef agent(s: MessagesState):\n    return {\"messages\": [llm.invoke(s[\"messages\"])]}\n\ng = StateGraph(MessagesState)\ng.add_node(\"agent\", agent)\ng.add_node(\"tools\", ToolNode([get_weather]))\ng.add_edge(START, \"agent\")\ng.add_conditional_edges(\"agent\", tools_condition)\ng.add_edge(\"tools\", \"agent\")\nout = g.compile().invoke({\"messages\": [(\"user\", \"Weather in Chennai?\")]})\nfor m in out[\"messages\"]:\n    m.pretty_print()"
      }
    },
    {
      "id": "lg-14",
      "q": "Do you build an agent with create_agent or a StateGraph by hand?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "agents",
        "langchain"
      ],
      "why": "Whether you reach for the abstraction that fits, or hand-build a loop the library already gives you - and whether you know the current API.",
      "quick": [
        "Start with create_agent for a normal tool-using agent.",
        "It already runs the model, tools, repeat loop.",
        "The old create_react_agent is outdated.",
        "Build a StateGraph only when the flow stops being that loop.",
        "Rebuilding the ready-made loop by hand is wasted work."
      ],
      "simple": "For a standard tool-calling agent, you use the prebuilt factory, because it already wires the whole loop. It calls the model, runs any tools it asks for, feeds the results back and repeats until the model answers. Rebuilding that by hand is work you didn't need to do. The current factory is create_agent from the langchain package, since the old create_react_agent was deprecated in LangGraph 1.0, and it adds middleware for things like tool approval, summarising long chats or running a fixed check before a tool call.\n\nYou drop to a hand-built StateGraph when the flow stops being that simple loop, such as extra state fields, steps that aren't model calls, or routing the model doesn't decide. For example, a refund flow that always runs a policy check, then branches to auto-approval or a manager's sign-off and tracks its own status fields, needs a graph, because those steps and routes aren't the model's choice. A single rule before one tool call, by contrast, still fits in middleware.",
      "say": "I start with create_agent, because it already wires the standard loop. It calls the model, runs any tools it asks for, feeds the results back and repeats until the model answers without a tool call. The name matters because it moved. create_react_agent from langgraph.prebuilt is deprecated as of LangGraph 1.0, and the current factory is create_agent from the langchain package. It adds middleware, small hooks for things people used to hand-build, like approving tool calls, summarising long conversations, redacting PII or running a fixed check before a tool executes. I drop to a hand-built StateGraph when the flow stops being that loop. Maybe I need state beyond the message list, steps that aren't model calls, or routing the model didn't decide. A refund flow that always runs a policy check and then branches to auto-approval or a manager's sign-off is a good example. Rebuilding the prebuilt loop by hand isn't seniority, it's unneeded work.",
      "numbers": "No number applies. This is an API-choice question.",
      "verified": "2026-10",
      "wrong": "\"I always build the graph myself for control.\" The follow-up will be why you rebuilt a loop the library already provides, and what your version does differently. The senior answer names the cheap default and the specific trigger for leaving it.",
      "follow": "What is the first requirement that makes you leave the prebuilt?",
      "followAnswer": "Usually a fixed business step the model must not decide. For example, every refund has to pass a policy-check node before payment, whatever the model says. That is application-controlled routing, which the agent loop does not express. Other common triggers are state beyond messages, like a case record, or a multi-step approval. Until one of those appears, create_agent plus middleware is enough.",
      "builds": [
        "lg-15"
      ],
      "next": [
        "lg-21",
        "lg-12",
        "lg-17"
      ],
      "deeper": [
        "langchain-docs",
        "langgraph-docs"
      ],
      "check": {
        "kind": "judgement",
        "q": "A tool-calling agent must run a fixed, deterministic policy check before its `issue_refund` tool executes. Nothing else about the loop changes. What is the simplest correct build?",
        "options": [
          "A hand-built StateGraph with a policy node.",
          "create_agent with middleware that wraps the refund tool call and runs the check in code.",
          "create_agent with a prompt telling the model to check policy first.",
          "The old `create_react_agent` from `langgraph.prebuilt`."
        ],
        "answer": 1,
        "why": "One rule around one tool call is what middleware is for: it runs in code every time and keeps the prebuilt loop. Move to a StateGraph when the flow needs its own steps, branches or state. A prompt is unenforced, and create_react_agent is deprecated."
      }
    },
    {
      "id": "lg-05",
      "q": "What is a checkpointer and what does it actually give you?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "memory"
      ],
      "why": "Checkpointing is what makes production features possible. Candidates who only ran notebooks have never needed it.",
      "quick": [
        "A checkpointer saves the state after every step.",
        "It gives memory across messages in the same conversation.",
        "It lets a flow pause for approval and resume later.",
        "After a crash, resume from the last saved step.",
        "Use a real database in production, and expect extra delay."
      ],
      "simple": "A checkpointer saves the graph state at every step, keyed by a thread id. An in-memory saver is fine in development, but production uses a database-backed one, like Postgres. It sounds like a logging detail, but it's what makes four production features possible.\n\nThe first is conversation memory, since the next message on a thread resumes with all previous state. The second is human in the loop, where a node pauses and resumes hours later when approval arrives. The third is fault recovery. For example, if a research chain with ten expensive model calls crashes at step nine, you resume from the last checkpoint instead of paying for everything again. The fourth is time travel, re-running from an earlier checkpoint to debug.\n\nThe trade-off is an extra write on every step, so it belongs in your latency budget.",
      "points": [
        "Saves state at every step (super-step), keyed by thread id.",
        "Cross-request memory without writing your own history code.",
        "`interrupt()` plus durable state = human approval that can wait hours.",
        "Resume after a crash from the last node, not from the start.",
        "Time travel: rewind to a checkpoint and replay, optionally with edited state.",
        "Durability mode trades speed for safety: `\"sync\"` writes before the next step, `\"async\"` writes in the background, `\"exit\"` writes only at the end.",
        "In production use a database-backed saver such as Postgres, never the in-memory one."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "A run where each node's state is saved by the checkpointer, a later node crashes, and the run resumes from the last checkpoint instead of the start.",
        "lanes": [
          {
            "label": "Retrieve",
            "note": "checkpoint saved"
          },
          {
            "label": "Grade",
            "note": "checkpoint saved"
          },
          {
            "label": "Generate",
            "note": "checkpoint saved"
          },
          {
            "label": "Check",
            "note": "crashes",
            "accent": "bad"
          },
          {
            "label": "Resume at Check",
            "note": "same thread id",
            "accent": "accent"
          }
        ],
        "caption": "State saved **after every step, keyed by thread id**. The same saves give memory, hours-long approvals, crash recovery and **time travel**."
      },
      "say": "A checkpointer saves the graph state after every step, keyed by a thread id, and it's what makes most production features possible. In development an in-memory saver is fine. In production it's a database-backed one, such as Postgres. It sounds like a logging detail, but it gives you four things. The first is conversation memory, because the next message on the same thread resumes with all previous state. The second is human approval. A node calls interrupt, the run ends, and it resumes hours later when the decision arrives. The third is fault recovery. If a long chain crashes near the end, I resume from the last checkpoint rather than paying for every model call again. The fourth is time travel, rewinding to an earlier checkpoint and replaying, optionally with edited state, which is one of the best debugging tools the framework has. The cost is a write on every step, so I budget for that latency or pick a lighter durability mode.",
      "numbers": "Measure checkpoint write latency and storage growth in your own deployment. Durability adds I/O on every step, so include it in the latency budget - or choose a lighter durability mode where losing a mid-run step is acceptable.",
      "wrong": "\"It saves the conversation.\" That is one use of four, and it misses the interrupt-and-resume story, which is the one regulated employers care about.",
      "follow": "Walk me through an approval flow where the human replies the next morning.",
      "followAnswer": "The node calls interrupt with the proposed action. The checkpointer saves the thread, the run ends, and the app stores the thread id against a pending approval in a review queue. Nothing waits in memory. Next morning the reviewer approves; our API invokes the graph with Command resume on the same thread id. The node re-runs, receives the decision and continues, and the payment step is idempotent.",
      "builds": [
        "lg-04"
      ],
      "next": [
        "lg-06",
        "lg-24",
        "lg-19"
      ],
      "alsoIn": [
        "riq-2605"
      ],
      "deeper": [
        "langgraph-persistence",
        "langgraph-docs"
      ],
      "check": {
        "kind": "predict",
        "q": "A 10-node research graph with a Postgres checkpointer crashes during node 9. You invoke again on the same thread ID with `None` as input. What happens?",
        "options": [
          "It restarts from node 1 and pays for every model call again.",
          "It fails, because checkpoints are only for conversation memory.",
          "It resumes from the last saved checkpoint, so nodes 1-8 are not re-run.",
          "It returns the last answer from a previous thread."
        ],
        "answer": 2,
        "why": "State is saved after each step, keyed by thread ID, so a run can continue from the last checkpoint. That fault recovery is one of four uses, alongside memory, human-in-the-loop and time travel; 'it just saves the chat' misses it."
      },
      "try": {
        "title": "See threads and checkpoints with InMemorySaver",
        "minutes": 10,
        "steps": [
          "Run the starter and observe thread `t1` accumulating turns across two invokes.",
          "Observe thread `t2` starting empty - the checkpointer is scoped per thread.",
          "Print `snap.next` and `snap.values` for each item in `get_state_history(cfg)` and observe one checkpoint per step.",
          "Swap in a SQLite or Postgres saver and confirm the history survives a Python restart."
        ],
        "code": "import operator\nfrom typing import Annotated, TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nclass S(TypedDict):\n    turns: Annotated[list[str], operator.add]\n\ndef echo(s):\n    return {\"turns\": [f\"seen {len(s['turns'])} so far\"]}\n\ng = StateGraph(S)\ng.add_node(\"echo\", echo)\ng.add_edge(START, \"echo\")\ng.add_edge(\"echo\", END)\napp = g.compile(checkpointer=InMemorySaver())\n\ncfg = {\"configurable\": {\"thread_id\": \"t1\"}}\napp.invoke({\"turns\": [\"hi\"]}, cfg)\nprint(app.invoke({\"turns\": [\"again\"]}, cfg))\nprint(app.invoke({\"turns\": [\"hi\"]}, {\"configurable\": {\"thread_id\": \"t2\"}}))\nprint(len(list(app.get_state_history(cfg))), \"checkpoints on t1\")"
      }
    },
    {
      "id": "lg-24",
      "q": "Short-term vs long-term memory in LangGraph - checkpointer or Store?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "memory",
        "privacy"
      ],
      "why": "Memory is one of the most asked agent topics. This checks whether you know which LangGraph piece holds which kind of memory.",
      "quick": [
        "The checkpointer is short-term memory for one conversation.",
        "A new conversation starts empty.",
        "The Store is long-term memory shared across conversations.",
        "Save items like user preferences, and search them by meaning.",
        "The hard part is deciding what to keep and when to delete."
      ],
      "simple": "LangGraph has two pieces for memory, and mixing them up is the classic mistake. The checkpointer is short-term memory. It saves the state of one thread, meaning one conversation, so the same thread id sees everything, but a new thread sees nothing.\n\nThe Store is long-term memory, a separate key-value store shared across threads. You save items under a namespace, such as the user id plus \"preferences\", and read them from any conversation, even searching by meaning if you give it an embedding model. For example, a travel assistant keeps today's booking chat in the checkpointer, but saves \"prefers aisle seats\" in the Store, so next month's new conversation still knows it.\n\nThe hard part isn't the API but the write policy, meaning which facts are worth keeping and when they expire. Writing every message into the Store just recreates an ever-growing history.",
      "points": [
        "**Checkpointer**: per-thread state; same `thread_id` resumes, new thread starts empty.",
        "**Store**: cross-thread items under a namespace tuple, e.g. `(user_id, \"preferences\")`.",
        "`put`, `get` and `search`; add an embedding index for semantic search.",
        "Compile with both: `builder.compile(checkpointer=..., store=...)`; nodes use `runtime.store`.",
        "Use a database-backed store (Postgres or similar) in production.",
        "The real design is the write policy: what, when, expiry, and user deletion."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "The checkpointer compared with the Store on memory type, scope, key, lookup and analogy.",
        "aspects": [
          "Memory",
          "Scope",
          "Keyed by",
          "Lookup",
          "Think of it as"
        ],
        "columns": [
          {
            "label": "Checkpointer",
            "note": "short-term",
            "cells": [
              "One conversation",
              "One thread only",
              "thread_id",
              "Reload whole state",
              "Today's meeting notes"
            ]
          },
          {
            "label": "Store",
            "note": "long-term",
            "accent": "accent",
            "cells": [
              "Facts across conversations",
              "Shared by all threads",
              "Namespace, e.g. user id",
              "get, put, semantic search",
              "The customer file"
            ]
          }
        ],
        "caption": "New thread, empty checkpointer; **the Store remembers across threads**. The hard part is the **write policy**: what to keep, expiry, user deletion."
      },
      "say": "The checkpointer is short-term memory for one conversation, and the Store is long-term memory shared across all of them. The checkpointer saves one thread's state after each step. Come back on the same thread id and the agent sees everything from that conversation. Start a new thread and it sees nothing. The Store is a separate key-value store shared across threads. You save items under a namespace, which is a tuple like the user id plus preferences, and read them from any conversation. Give it an embedding index and it can search by meaning, so the agent fetches the few memories relevant to this question. I think of the checkpointer as today's meeting notes and the Store as the customer file you open at every meeting. The API is the easy bit. The hard part is the write policy, meaning what to keep, when it expires and how a user sees or deletes it, because storing every message just rebuilds an endless history.",
      "numbers": "No universal number. Track how many memories you read per turn and how many tokens they add - retrieve a handful of relevant items, not the whole namespace.",
      "wrong": "\"The checkpointer gives the agent memory, so it remembers users.\" It remembers one thread. A returning user on a new thread gets nothing unless you add a cross-thread store.",
      "follow": "How do you stop one user's memories leaking into another user's conversation?",
      "followAnswer": "The namespace is the boundary, so it must come from the authenticated user, never from the model or the request body. The server sets the user id in runtime context, code builds the namespace from it, and the agent's memory tools cannot choose a namespace themselves. I add a test that user A's search never returns user B's items, and I audit memory writes.",
      "builds": [
        "lg-05",
        "ag-22"
      ],
      "next": [
        "ag-23",
        "gr-03"
      ],
      "deeper": [
        "langgraph-persistence",
        "langgraph-docs"
      ],
      "check": {
        "kind": "predict",
        "q": "In thread `t1` a traveller says \"I always want aisle seats\". The app uses only a checkpointer. Next month they start a new conversation (thread `t2`) and ask to book a flight. Does the agent know the preference?",
        "options": [
          "Yes - the checkpointer stores all of a user's history.",
          "Yes, if the same model is used.",
          "Only if the Postgres checkpointer is used rather than in-memory.",
          "No - the checkpointer is per thread; a cross-thread Store namespaced by user is needed for that."
        ],
        "answer": 3,
        "why": "Checkpoints are short-term memory for one thread, whatever the backend. Long-term facts belong in the Store under a user namespace, written deliberately and scoped so they cannot leak between users."
      }
    },
    {
      "id": "lg-06",
      "q": "How do you add human approval inside a LangGraph flow?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "agents",
        "compliance"
      ],
      "why": "The concrete version of the previous question - and the feature regulated employers ask for by name.",
      "quick": [
        "Put a pause call inside the step needing a decision.",
        "The flow stops and its state is saved.",
        "Show the reviewer what to approve, reject or edit.",
        "Resume the same conversation with their answer, even next day.",
        "The step reruns from the top, so actions must be safe twice."
      ],
      "simple": "Human approval in LangGraph works by letting a node pause itself. You put an interrupt call inside the node that needs a decision. When execution reaches it, LangGraph pauses, the checkpointer saves the state, and the caller shows the payload to a reviewer.\n\nThe reviewer can approve, reject or edit. Later, maybe the next morning, the application resumes the thread with a Command carrying the decision, which becomes the return value of the interrupt call. Because the state is saved, no process has to stay alive during the wait.\n\nThere's one trap. On resume, the node runs again from its first line, so anything before the interrupt runs twice, and side effects belong after it. For example, if a payments node sends a notification email before the interrupt, the customer gets that email twice. The final action should also be safe to run twice.",
      "points": [
        "Call `interrupt()` inside the node that needs the human decision.",
        "Persist state with a production checkpointer and a stable thread id.",
        "Show the interrupt payload to the reviewer in plain language.",
        "Resume with `Command(resume=...)` on the same thread.",
        "On resume the node re-runs from the top - keep side effects after the `interrupt()` call.",
        "Make the downstream side effect idempotent so duplicate approvals are harmless."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Human approval in LangGraph: a node calls interrupt, the checkpointer saves the thread, a reviewer decides later, the app resumes with Command, the node re-runs from its first line, and the final action is idempotent.",
        "lanes": [
          {
            "label": "interrupt()",
            "note": "node pauses itself",
            "accent": "accent"
          },
          {
            "label": "State saved",
            "note": "checkpointer, thread id"
          },
          {
            "label": "Reviewer decides",
            "note": "approve, reject, edit"
          },
          {
            "label": "Command(resume=...)",
            "note": "same thread, maybe next day",
            "accent": "accent"
          },
          {
            "label": "Node re-runs",
            "note": "from its first line",
            "accent": "warn"
          },
          {
            "label": "Idempotent action",
            "note": "no double payment",
            "accent": "accent"
          }
        ],
        "caption": "**The checkpointer does the waiting**: no open request, no live process. On resume the node **re-runs from the top**, so side effects go after interrupt()."
      },
      "say": "You put an interrupt call inside the node that needs the decision, and the checkpointer does the waiting. When the run reaches interrupt, LangGraph pauses and saves the thread's state. The caller gets the interrupt payload back and shows it to a reviewer in a web page, a chat message or an approval queue. The reviewer approves, rejects or sends back edited data. Later, maybe the next morning, the application resumes the same thread with Command and a resume value, and that value becomes interrupt's return value. No request stays open and no process has to stay alive. The trap is that on resume the node re-runs from its first line, not from the interrupt. Anything before it runs twice, so side effects go after the interrupt or in the next node. I also make the final action idempotent, so a duplicate approval can't send the same payment twice. That beats a static interrupt_before breakpoint, which is mainly a debugging tool.",
      "numbers": "No number applies, but do track reviewer turnaround time and the edit rate. A near-zero edit rate means the review is a rubber stamp.",
      "verified": "2026-10",
      "wrong": "Using a prompt like 'ask for confirmation' as the approval mechanism. A prompt cannot durably pause execution, enforce who approves, or prevent a duplicate side effect.",
      "follow": "How do you make sure two reviewers do not approve the same action twice?",
      "followAnswer": "Two layers. First, the approval record lives in our database with a clear state - pending, approved, rejected - and approving is a conditional update that only succeeds from pending, so the second reviewer sees 'already decided'. Second, the side effect carries an idempotency key, such as the case id plus the action, so even a duplicate resume cannot send the payment twice.",
      "builds": [
        "lg-05",
        "ag-12"
      ],
      "next": [
        "ag-33",
        "lg-23"
      ],
      "deeper": [
        "langgraph-interrupts",
        "langgraph-persistence"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "In a payments node:\n    send_email(customer, \"Refund under review\")\n    decision = interrupt({\"amount\": amt})\n    if decision == \"approve\": pay(amt)\nCustomers report two \"under review\" emails. Why?",
        "options": [
          "On resume the node re-runs from its first line, so the email before `interrupt` is sent again; move side effects after it or into a separate node.",
          "The checkpointer saved the state twice.",
          "`interrupt` sends its payload by email.",
          "The reviewer clicked approve twice."
        ],
        "answer": 0,
        "why": "Resuming replays the node from the top, with `interrupt` returning the resume value. Anything before it runs again. Keep side effects after the interrupt and make the final action idempotent in case resume is triggered twice."
      },
      "try": {
        "title": "Pause a graph for approval and resume it",
        "minutes": 15,
        "steps": [
          "Run the starter; observe the first invoke returning an `__interrupt__` payload instead of finishing.",
          "Observe \"node started\" printed twice - once before the pause, once on resume.",
          "Resume with `Command(resume=\"no\")` on a fresh thread and observe the rejected path.",
          "Restart Python between the two invokes using a SQLite saver, and confirm the resume still works."
        ],
        "code": "from typing import TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom langgraph.checkpoint.memory import InMemorySaver\nfrom langgraph.types import interrupt, Command\n\nclass S(TypedDict):\n    amount: int\n    status: str\n\ndef approve(s):\n    print(\"node started\")  # runs again on resume\n    decision = interrupt({\"refund\": s[\"amount\"]})\n    return {\"status\": \"paid\" if decision == \"yes\" else \"rejected\"}\n\ng = StateGraph(S)\ng.add_node(\"approve\", approve)\ng.add_edge(START, \"approve\")\ng.add_edge(\"approve\", END)\napp = g.compile(checkpointer=InMemorySaver())\ncfg = {\"configurable\": {\"thread_id\": \"r1\"}}\nprint(app.invoke({\"amount\": 500, \"status\": \"new\"}, cfg))\nprint(app.invoke(Command(resume=\"yes\"), cfg))"
      }
    },
    {
      "id": "lg-12",
      "q": "Build a RAG agent in LangGraph - what nodes and edges?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "langgraph",
        "advanced-rag",
        "rag"
      ],
      "why": "A whiteboard question. Whether you can lay out control flow, not just name components.",
      "quick": [
        "Start with the state, messages, documents, retry count, answer.",
        "A router decides if the question needs a search at all.",
        "Search, grade the results, rewrite the question if weak.",
        "Write the answer, then check it matches the documents.",
        "Cap retries at about two, or it loops forever."
      ],
      "simple": "A RAG agent in LangGraph starts with the state, which holds the messages, retrieved documents, a retry counter and the answer. Then come the nodes. A router decides whether the question needs retrieval at all, then there's retrieve, a grade node that checks relevance, a rewrite node for weak results, generate, and a check that the answer is grounded.\n\nThe edges are where the design lives. Good documents go to generate, while weak ones loop back to rewrite, but only while the retry counter is under two. Otherwise the agent honestly says it couldn't find the answer.\n\nFor example, if an employee asks about a travel policy that doesn't exist, the rewrite node tries once or twice and then the agent admits it can't find it. That retry counter is what interviewers listen for, because without it the graph loops forever.",
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
      "say": "I'd start with the state, because everything else follows from it. That's the messages, the retrieved documents, a retry counter and the final answer. The nodes come next. A router decides whether the question needs retrieval at all, and skipping it for simple questions is a large latency saving. Then retrieve, a grade node that checks the documents are actually relevant, a rewrite node that reformulates a weak query, generate, and a check node that confirms the answer is grounded in the documents. The edges are where the design lives. After grading, good documents go forward to generate. Weak ones loop back to rewrite, but only while the retry counter is under two, and otherwise it falls through to an honest 'I could not find this'. The groundedness check can send it back once too. That counter is what interviewers listen for, because without it the graph loops forever on a question the corpus can't answer.",
      "numbers": "Cap rewrites low - one or two is a common starting point. Each one costs a full retrieval plus a model call, and a third rarely recovers a question the corpus cannot answer.",
      "wrong": "Drawing retrieve → generate → END. It is a chain, not an agent, and it does not answer the question that was asked.",
      "follow": "What happens when the grade node itself is wrong?",
      "followAnswer": "Two failure modes. If it rejects good documents, we waste rewrites and may wrongly answer 'not found'. If it accepts bad ones, the answer is poorly grounded and only the check node might catch it. So I evaluate the grader on its own labelled set, measuring precision and recall of its relevant calls, log its decisions in traces, and keep the retry cap so a wrong grader cannot loop forever.",
      "builds": [
        "lg-04",
        "ar-05"
      ],
      "next": [
        "ar-14",
        "rag-24",
        "lg-07"
      ],
      "deeper": [
        "crag",
        "self-rag"
      ],
      "check": {
        "kind": "predict",
        "q": "Your RAG graph loops grade -> rewrite -> retrieve whenever documents look weak, with no retry counter. A user asks about a policy the corpus does not contain. What happens?",
        "options": [
          "The grade node eventually passes the weak documents through.",
          "It loops until LangGraph's recursion limit raises an error, spending a retrieval and a model call per lap, and the user gets no honest answer.",
          "LangGraph detects the cycle and routes to END automatically.",
          "The rewrite node invents a document that answers the question."
        ],
        "answer": 1,
        "why": "Nothing in the graph can exit the loop, so it spins until the runtime's safety limit. A retry counter in state, capped at one or two, plus an honest 'not found' path is what interviewers listen for."
      }
    },
    {
      "id": "lg-07",
      "q": "How do you stream a LangGraph agent's output to a user?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "langgraph",
        "latency",
        "api-design"
      ],
      "why": "Streaming is a hard requirement for chat UX and a real source of bugs, so it is a good discriminator.",
      "quick": [
        "There are two kinds of streaming to handle.",
        "Stream the answer word by word as it is written.",
        "Stream progress updates after each step.",
        "Progress matters because tool calls leave long silent gaps.",
        "Checking a full JSON reply blocks streaming, so split it."
      ],
      "simple": "When you stream a LangGraph agent's output, there are two different things you might stream. Streaming tokens means the final answer's words appear as they're generated, which makes a five-second response feel acceptable. Streaming state means an update after each node, like \"searching documents\". For an agent that's probably even more valuable, because during a long tool call there are no tokens, and a silent screen feels broken.\n\nSo a good agent UI does both. The messages stream mode gives model tokens, filtered to the answering node, and the updates mode gives one event per node for progress.\n\nThe practical trap is that anything needing the whole output can't stream. For example, if the last node validates complete JSON before replying, the user sees nothing until the end, so you stream a summary field separately from the structured payload.",
      "points": [
        "`stream_mode=\"messages\"` - LLM tokens from every model call in the graph; filter by the `langgraph_node` metadata to show only the answer.",
        "`stream_mode=\"updates\"` - one event per node, for progress UI.",
        "`stream_mode=\"custom\"` - your own progress events from inside a node, via `get_stream_writer()`.",
        "Pass a list of modes to get several at once; `subgraphs=True` includes events from nested graphs.",
        "Agents need progress events; tool calls produce long token-silent gaps.",
        "Whole-output parsers cannot stream. Structured output and token streaming conflict.",
        "Measure time to first token separately from total time - they drive different UX complaints.",
        "The streaming API is still evolving: `version=\"v2\"` (LangGraph 1.1+) gives one uniform chunk shape, and LangGraph 1.2 added `stream_events(version=\"v3\")` with typed projections, which the docs now recommend for new code. Check the version your stack pins."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Three LangGraph stream modes compared: messages for tokens, updates for per-node progress, and custom for your own events, by what they emit, UI use and watch-out.",
        "aspects": [
          "Emits",
          "Shows the user",
          "Watch out"
        ],
        "columns": [
          {
            "label": "messages",
            "note": "tokens",
            "accent": "accent",
            "cells": [
              "LLM tokens, every model call",
              "Answer word by word",
              "Filter to answer node"
            ]
          },
          {
            "label": "updates",
            "note": "per node",
            "accent": "accent",
            "cells": [
              "One event per node",
              "Searching, drafting...",
              "Covers silent tool calls"
            ]
          },
          {
            "label": "custom",
            "note": "your events",
            "cells": [
              "get_stream_writer() events",
              "Fine-grained progress",
              "You emit them yourself"
            ]
          }
        ],
        "caption": "A good agent UI streams **both tokens and progress**. A final node that validates whole JSON **cannot stream**, so stream a summary field separately."
      },
      "say": "There are two kinds of streaming, and mixing them up is where the bugs come from. Token streaming shows the final answer word by word, which is what makes a five-second response feel acceptable. Update streaming emits an event after each node, like searching documents or drafting. For an agent that matters just as much, because a long tool call produces no tokens at all and a silent screen feels broken. So a good UI does both. I use the messages stream mode for tokens, filtered to the answering node, and the updates mode or custom events for progress. The trap is structured output. If the last node validates complete JSON, it has to buffer everything and can't stream, so I stream a summary field separately from the structured payload. I also measure time to first token apart from total time, because they drive different complaints.",
      "numbers": "Time to first token is the metric users feel. Roughly, sub-second feels responsive and several seconds of silence feels broken - but set the target from your own product and users rather than quoting a universal threshold.",
      "verified": "2026-10",
      "wrong": "\"I set streaming=True.\" It does not explain what happens during a twenty-second tool call, which is the actual UX problem in agents.",
      "follow": "Your last node validates JSON. How do you still give the user something to watch?",
      "followAnswer": "I stream progress events and a separate plain-text summary, while the JSON is still validated at the end. Earlier nodes emit updates or custom events, such as searching documents or checking policy, so the screen is never silent. For the answer itself, I generate a short human-readable part that streams token by token, then build and validate the structured payload after it. The UI shows the text straight away and renders the structured parts once validation passes.",
      "builds": [
        "lg-04",
        "cl-10"
      ],
      "next": [
        "py-15",
        "py-20"
      ],
      "alsoIn": [
        "riq-1205"
      ],
      "deeper": [
        "langgraph-streaming",
        "langgraph-docs"
      ],
      "check": {
        "kind": "predict",
        "q": "An agent streams with `stream_mode=\"messages\"` only. It calls a document search tool that takes 20 seconds before the final answer. What does the user see during those 20 seconds?",
        "options": [
          "The tool's progress, streamed automatically.",
          "Nothing - no model tokens are produced during the tool call; add `updates` or `custom` progress events.",
          "A token-by-token stream of the tool output.",
          "An error, because tools cannot run while streaming."
        ],
        "answer": 1,
        "why": "`messages` streams LLM tokens, and a tool call produces none, so the screen goes silent. Per-node `updates` or `custom` events from `get_stream_writer()` fill that gap. That gap is the real UX problem in agents."
      },
      "try": {
        "title": "Stream progress from a slow node",
        "minutes": 10,
        "steps": [
          "Run the starter and observe `custom` progress events arriving during the slow search, then `updates` per node.",
          "Change to `stream_mode=\"updates\"` only and observe the silent gap during the search.",
          "Add `version=\"v2\"` to the `stream` call (LangGraph 1.1+) and observe every chunk arriving with the same `type`, `ns` and `data` shape.",
          "Decide which events your UI would show and which it would hide."
        ],
        "code": "import time\nfrom typing import TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom langgraph.config import get_stream_writer\n\nclass S(TypedDict):\n    q: str\n    docs: list[str]\n    answer: str\n\ndef search(s):\n    write = get_stream_writer()\n    for i in range(3):\n        write({\"progress\": f\"searching source {i + 1}/3\"})\n        time.sleep(0.7)\n    return {\"docs\": [\"d1\", \"d2\"]}\n\ndef answer(s):\n    return {\"answer\": f\"{len(s['docs'])} documents found for {s['q']}\"}\n\ng = StateGraph(S)\ng.add_node(\"search\", search)\ng.add_node(\"answer\", answer)\ng.add_edge(START, \"search\")\ng.add_edge(\"search\", \"answer\")\ng.add_edge(\"answer\", END)\nfor mode, chunk in g.compile().stream({\"q\": \"leave policy\"}, stream_mode=[\"updates\", \"custom\"]):\n    print(mode, chunk)"
      }
    },
    {
      "id": "lg-23",
      "q": "What is Command in LangGraph, and how do agents hand off to each other?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "langgraph",
        "multi-agent"
      ],
      "why": "The LangGraph mechanics behind multi-agent answers. Panels ask it right after you name a supervisor or handoff pattern.",
      "quick": [
        "Command updates state and picks the next step together.",
        "That is exactly what a handoff between agents needs.",
        "A transfer tool returns a Command routing to another agent.",
        "Keep a matching tool reply in history or calls fail.",
        "Try one agent or a supervisor first, handoffs are harder to debug."
      ],
      "simple": "Command is an object that a node or tool can return to do two things at once. It updates the state and says which node runs next, so the node decides both in one step instead of leaving the routing to an edge.\n\nThat's exactly what a handoff between agents needs. For example, a support agent gets a transfer_to_billing tool, and when the model calls it, the tool returns a Command that routes to the billing agent and passes along the context it needs. One detail catches people, which is that the history must also contain a matching tool result message, or the next model call fails.\n\nBut handoffs are harder to debug, because control can move anywhere. So LangChain's guidance is to try one agent, or a supervisor calling sub-agents as tools, before building peer-to-peer handoffs.",
      "say": "Command lets a node or tool update state and choose the next node in one return, instead of leaving routing to an edge. Normally a node returns an update and an edge decides where to go. With Command, you pass goto billing plus the update, and that's exactly the shape a handoff needs. Each agent is a node or a subgraph. The support agent gets a transfer_to_billing tool, and when the model calls it, the tool returns a Command routing to billing with the context it needs. If the agent is a subgraph, setting graph to Command.PARENT makes the jump in the parent graph. The detail that catches people is history. The model called a tool, so there must be a matching tool result message, or the next model call fails on malformed history. Command is also how you resume after an interrupt. Still, I'd try one agent or a supervisor calling sub-agents as tools first, because peer handoffs are harder to debug.",
      "numbers": "No number applies. Track handoffs per conversation - bouncing between agents more than once or twice usually means their descriptions overlap.",
      "wrong": "Saying agents 'talk to each other' without naming the mechanism. The panel wants to hear that control moves through a returned Command or a routing edge, and what context moves with it.",
      "follow": "After a handoff, how much of the previous agent's history should the next agent see?",
      "followAnswer": "Usually not all of it. I pass the user's request, the key facts found so far and a short handoff note, not every internal tool call, because that noise costs tokens and confuses the next agent. The full history stays in the checkpoint for debugging. If the next agent keeps asking for things the first one already found, the handoff summary is too thin.",
      "builds": [
        "lg-15",
        "ag-25"
      ],
      "next": [
        "lg-16",
        "ag-26"
      ],
      "deeper": [
        "langchain-multi-agent",
        "langgraph-graph-api"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A `transfer_to_billing` tool returns `Command(goto=\"billing\", update={\"active\": \"billing\"})`. The billing agent's first model call then fails with an error about a tool call without a matching result. What is missing?",
        "options": [
          "A conditional edge from the support agent to billing.",
          "A checkpointer.",
          "A ToolMessage answering the transfer call, included in the Command's message update.",
          "The billing agent must be a subgraph."
        ],
        "answer": 2,
        "why": "Chat APIs require every tool call in the history to have a matching tool result. The Command routes control but must also add that ToolMessage. Edges and checkpointers do not create the missing message."
      }
    },
    {
      "id": "lg-16",
      "q": "What is a subgraph, and when would you use one?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "langgraph",
        "multi-agent",
        "system-design"
      ],
      "why": "How you compose anything past a toy. Panels use it to see whether you have built something with more than one moving part.",
      "quick": [
        "A subgraph is a whole graph used as one step.",
        "It keeps a big app readable and reusable.",
        "Shared state fields mean you can plug it in directly.",
        "Different state needs a wrapper that maps data in and out.",
        "Each agent keeps its own chat private this way."
      ],
      "simple": "A subgraph is a compiled graph used as a single node inside another graph, and it's how a LangGraph app stays readable as it grows. If the subgraph shares state keys with the parent, you add it directly as a node. If the schemas differ, you wrap it in a node function that maps the parent's state in and the output back.\n\nThat second case matters in multi-agent work, because each agent keeps its own private message history, and the parent only sees what the wrapper lifts out. Otherwise every agent's internal chatter lands in one shared list and the context grows without limit.\n\nFor example, a search agent that makes twenty tool calls while reading papers keeps them in its own history and hands the parent only a short summary. Subgraphs also allow reuse, so an approval flow can be defined once and plugged in anywhere.",
      "diagram": {
        "alt": "Attaching a subgraph: if it shares state keys with the parent, add it directly as a node; if schemas differ, wrap it in a node that maps state in and out, keeping its message history private.",
        "rows": [
          [
            {
              "id": "p",
              "label": "Parent graph state"
            }
          ],
          [
            {
              "id": "q",
              "label": "Same state keys?",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "d",
              "label": "add_node(subgraph)",
              "note": "reads, writes parent state"
            },
            {
              "id": "w",
              "label": "Wrapper node",
              "note": "map in, invoke, map out",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "s",
              "label": "Agent subgraph",
              "note": "private message history",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "p",
            "to": "q"
          },
          {
            "from": "q",
            "to": "d",
            "label": "yes"
          },
          {
            "from": "q",
            "to": "w",
            "label": "no"
          },
          {
            "from": "w",
            "to": "s"
          }
        ],
        "caption": "A subgraph is **a compiled graph used as one node**. The wrapper lets each agent **keep its chatter private**, so the parent's context does not grow without limit."
      },
      "say": "A subgraph is a compiled graph used as a single node inside another graph. It's how a LangGraph app stays readable once it outgrows one flat set of nodes. How you attach it depends entirely on state. If the subgraph shares state keys with the parent, you pass it straight to add_node and it reads and writes the parent's state directly. If the schemas differ, you wrap it in an ordinary node function that maps the parent's state into the subgraph's input, invokes it, and maps the output back. That second case is the one that matters in multi-agent work. Each agent keeps its own private message history, and the parent only sees what the wrapper lifts out. Without that, every agent's internal chatter lands in one shared list and the top-level context grows without limit. The other reason is plain reuse, like an approval flow or a retrieval step that several parts of the app need, defined once.",
      "numbers": "No number applies. This is a composition question.",
      "wrong": "\"I'd just put all the nodes in one graph.\" It works until two agents share a message list, and then every agent's internal reasoning is in the context of every other one.",
      "follow": "Two subgraph agents both write to the same parent key. What do you need?",
      "followAnswer": "I need a reducer on that parent key, or a separate key for each agent. If both subgraphs write the same key in the same step without a reducer, LangGraph raises an error because it can't pick a winner. So for something like collected findings, I annotate the key with a reducer such as operator.add, and make sure the merge doesn't depend on order. Where the outputs mean different things, I give each agent its own key and let a later node combine them.",
      "builds": [
        "lg-04"
      ],
      "next": [
        "lg-23",
        "lg-19"
      ],
      "deeper": [
        "langgraph-docs",
        "anthropic-multi-agent"
      ],
      "check": {
        "kind": "predict",
        "q": "A research subgraph makes 20 tool calls per question. It is added directly as a node and shares the parent's `messages` key. What happens to the parent conversation?",
        "options": [
          "Nothing - subgraph messages are always private.",
          "The subgraph's messages are discarded when it finishes.",
          "LangGraph raises an error because keys must differ.",
          "All 20 tool calls and results land in the parent's history, bloating every later prompt; wrap it and return only a summary."
        ],
        "answer": 3,
        "why": "Shared keys flow straight through to the parent. To keep an agent's internal chatter private, give the subgraph its own schema and wrap it in a node that maps a short summary back to the parent."
      }
    },
    {
      "id": "lg-19",
      "q": "Your LangGraph agent processes large documents and the checkpoints explode. What went wrong?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "langgraph",
        "cost",
        "debugging"
      ],
      "why": "The characteristic LangGraph production failure, and it only happens to people who have actually run one at volume.",
      "quick": [
        "Big documents were stored directly in the saved state.",
        "State is saved every step, so big data is rewritten repeatedly.",
        "Store big results elsewhere and keep only an id and summary.",
        "Trim or summarise old messages too.",
        "Plot saved size per step to find the step causing it."
      ],
      "simple": "When checkpoints explode on large documents, the usual cause is putting large payloads directly into graph state. State is saved again at every step, and any key that changes, above all a growing message list, is rewritten in full each time, so storage and resume time grow quickly.\n\nTo find the culprit, you plot checkpoint size by step for one thread. Flat is healthy, while a staircase means something is piling up. For example, if a contract-review agent's checkpoints jump from a few KB to several MB right after the fetch-document node, that node is putting the whole contract into state.\n\nThe fix is that state holds references, not payloads. The raw document goes to object storage or a database, and state keeps an id and a short summary. Long-running agents also trim or summarise old messages instead of appending every large tool result forever.",
      "points": [
        "State is serialised into checkpoints as the graph advances; any key that changes - above all a growing message list - is rewritten in full each time.",
        "State holds references, not payloads: tool writes to storage, returns an id and a summary.",
        "The model needs to know the data exists and what it is, not to carry it.",
        "Message history grows by design - trim or summarise before the window forces it.",
        "Diagnose by plotting checkpoint size across steps; the jump names the node.",
        "Never put secrets or raw PII in state - checkpoints are a retention surface.",
        "Set a thread retention policy, or the checkpoint table grows unbounded.",
        "LangGraph 1.2 added a beta `DeltaChannel` that stores only the change per step; useful for long threads, but it does not excuse payloads in state."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Putting a large document directly in graph state compared with keeping only a reference in state and the raw document in storage, by what state holds, checkpoint size, resume and access to the full document.",
        "aspects": [
          "State holds",
          "Each checkpoint",
          "Size over steps",
          "Full document"
        ],
        "columns": [
          {
            "label": "Payload in state",
            "note": "the usual mistake",
            "accent": "bad",
            "cells": [
              "Whole document, big results",
              "Rewrites the payload",
              "Staircase, slow resume",
              "Carried everywhere"
            ]
          },
          {
            "label": "Reference in state",
            "note": "the fix",
            "accent": "accent",
            "cells": [
              "Id, metadata, short summary",
              "Small and cheap",
              "Flat",
              "Fetched only if needed"
            ]
          }
        ],
        "caption": "**State holds references, not payloads.** Plot checkpoint size per step: flat is healthy, and **the step where it jumps names the node**."
      },
      "say": "Almost always, large payloads are sitting directly in graph state. Whole documents, huge tool results or an ever-growing message list get persisted again as the graph advances, so storage and resume time climb fast. I'd find the culprit by plotting checkpoint size per step for one thread. Flat is healthy, a staircase means accumulation, and the step where it jumps usually names the node that added the payload. The fix is that state holds references, not payloads. The tool writes the raw document to object storage or a database and returns an id, some metadata and a short summary. The model needs to know the data exists and what it is, not carry it around, and a later node fetches the full object only if it needs it. I'd trim or summarise message history too. And since checkpoints are retained data, I keep secrets and PII out of them and set a retention policy for old threads.",
      "numbers": "Plot checkpoint size across steps in one thread. Flat is healthy; a staircase means accumulation, and the step where it jumps is your culprit.",
      "wrong": "Blaming the checkpointer and switching from Postgres to something else. The backend is not the problem - you are asking it to persist megabytes per step.",
      "follow": "You need the full document available to a node three steps later. How do you pass it?",
      "followAnswer": "I pass a reference, not the document. The node that fetches it writes the full text to object storage or a database and puts only the id, some metadata and a short summary into state. Three steps later, the node that needs the whole document reads the id from state and loads it from storage itself. Checkpoints stay small, the intermediate steps never carry it, and the stored object gets the same access control and retention rules as the thread.",
      "builds": [
        "lg-05"
      ],
      "next": [
        "lg-16",
        "ag-21"
      ],
      "deeper": [
        "langgraph-persistence"
      ],
      "check": {
        "kind": "numbers",
        "q": "A tool appends a 2 MB document to `messages`. The agent then runs 10 more steps, each appending a small message. The `messages` channel is saved in full every time it changes. Roughly how much data is written for `messages` across those steps?",
        "options": [
          "About 2 MB",
          "About 22 MB",
          "Under 100 KB",
          "Nothing - unchanged messages are never saved"
        ],
        "answer": 1,
        "why": "The list changes every step, so the whole value, including the 2 MB document, is written each time - about 11 writes of 2 MB. Storing the document elsewhere and keeping an ID and summary in state keeps each checkpoint to kilobytes."
      },
      "try": {
        "title": "Plot checkpoint growth step by step",
        "minutes": 15,
        "steps": [
          "Run the starter and observe state size jumping at the fetch step and staying high on every later checkpoint.",
          "Replace the 2 MB string with an ID such as `doc://contract-17` plus a 200-character summary and re-run.",
          "Observe the sizes staying flat in kilobytes.",
          "Note that this measures state size, a proxy for what a database checkpointer writes."
        ],
        "code": "import operator, pickle\nfrom typing import Annotated, TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nclass S(TypedDict):\n    log: Annotated[list[str], operator.add]\n    step: int\n\ndef fetch(s): return {\"log\": [\"X\" * 2_000_000], \"step\": s[\"step\"] + 1}  # whole document in state\ndef work(s): return {\"log\": [f\"note {s['step']}\"], \"step\": s[\"step\"] + 1}\n\ng = StateGraph(S)\ng.add_node(\"fetch\", fetch)\ng.add_node(\"work\", work)\ng.add_edge(START, \"fetch\")\ng.add_edge(\"fetch\", \"work\")\ng.add_conditional_edges(\"work\", lambda s: END if s[\"step\"] > 8 else \"work\")\napp = g.compile(checkpointer=InMemorySaver())\ncfg = {\"configurable\": {\"thread_id\": \"t\"}}\napp.invoke({\"log\": [], \"step\": 0}, cfg)\nfor snap in reversed(list(app.get_state_history(cfg))):\n    print(snap.metadata.get(\"step\"), len(pickle.dumps(snap.values)) // 1024, \"KB\")"
      }
    }
  ]
};
