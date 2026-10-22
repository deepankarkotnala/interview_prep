/* Visual explanation: how an agent decides, calls a tool and keeps going.
   Drawn by assets/visual.js - scene format in README.md. Tool names, ids and
   results are illustrative; message shapes follow common tool-calling APIs. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
(function () {
  var h0 = ["system: instructions + tools", "user: rain tomorrow? move 4 pm?"];
  var h1 = h0.concat(["assistant: call get_weather"]);
  var h2 = h1.concat(["tool: 80% chance of rain"]);
  var h3 = h2.concat(["assistant: call update_event"]);
  var h4 = h3.concat(["tool: meeting moved online"]);
  var h5 = h4.concat(["assistant: final answer"]);

  window.IR.v["agents"] = {
    view: [1290, 680],

    zones: [
      { id: "z-tools", x: 700, y: 196, w: 574, h: 220, label: "Tools - run by your code", tone: "tool" }
    ],

    parts: [
      { id: "user", kind: "msg", x: 24, y: 28, w: 262, role: "User", text: "Will it rain in Bengaluru tomorrow? If yes, move my 4 pm meeting online.", tone: "input", concept: "request" },
      { id: "sysprompt", kind: "code", x: 24, y: 200, w: 300, title: "System prompt + tools", tone: "neutral", concept: "tooldefs",
        lines: ["You are a calendar assistant.", "Tools:", "- get_weather(city, date)", "- update_event(id, changes)"] },
      { id: "llm", kind: "box", x: 420, y: 36, w: 200, h: 76, label: "LLM", sub: "decides the next step", icon: "spark", tone: "model", concept: "llm" },
      { id: "loop", kind: "box", x: 420, y: 214, w: 200, h: 90, label: "Agent loop", sub: "your code", icon: "loop", tone: "neutral", concept: "loop" },
      { id: "toolcall", kind: "code", x: 720, y: 28, w: 300, title: "Tool call from the model", tone: "model", hidden: true, concept: "toolcall",
        lines: ["get_weather", "{ \"city\": \"Bengaluru\",", "  \"date\": \"tomorrow\" }"] },

      { id: "weather", kind: "box", x: 720, y: 248, w: 190, h: 66, label: "Weather API", icon: "globe", tone: "tool", concept: "tools" },
      { id: "wres", kind: "code", x: 960, y: 236, w: 296, title: "Tool result", tone: "tool", hidden: true, concept: "result",
        lines: ["{ \"rain_chance\": 0.8,", "  \"summary\": \"showers\" }"] },
      { id: "approval", kind: "box", x: 720, y: 336, w: 210, h: 66, label: "Human approval", sub: "confirm the change", icon: "check", tone: "guard", concept: "approval" },
      { id: "calendar", kind: "box", x: 1010, y: 336, w: 210, h: 66, label: "Calendar API", icon: "clock", tone: "tool", concept: "tools" },

      { id: "history", kind: "tokens", dir: "col", x: 24, y: 400, w: 330, label: "Message history - resent every turn", tone: "data", concept: "history", items: h0 },
      { id: "answer", kind: "msg", x: 420, y: 470, w: 330, role: "Assistant", text: "Yes - an 80% chance of rain tomorrow, so I have moved your 4 pm meeting online.", tone: "output", hidden: true, concept: "answer" },
      { id: "guards", kind: "box", x: 820, y: 470, w: 440, h: 80, label: "Guard rails", sub: "max steps · timeouts · tool errors returned as results · cost limits", icon: "shield", tone: "guard", concept: "guards" }
    ],

    links: [
      { id: "l-user-loop", from: "user:b:0.8", to: "loop:l:0.3", via: [[234, 178], [372, 178], [372, 241]], tone: "input" },
      { id: "l-sys-loop", from: "sysprompt:r", to: "loop:l:0.75", tone: "neutral" },
      { id: "l-loop-llm", from: "loop:t:0.3", to: "llm:b:0.3", style: "straight", label: "messages + tools", labelAt: 0.42, labelDx: -66 },
      { id: "l-llm-loop", from: "llm:b:0.7", to: "loop:t:0.7", style: "straight", tone: "model", label: "reply", labelAt: 0.5, labelDx: 34 },
      { id: "l-llm-call", from: "llm:r", to: "toolcall:l:0.5", tone: "model" },
      { id: "l-loop-weather", from: "loop:r:0.35", to: "weather:l", tone: "tool" },
      { id: "l-weather-res", from: "weather:r", to: "wres:l:0.55", style: "straight", tone: "tool" },
      { id: "l-loop-appr", from: "loop:r:0.85", to: "approval:l", tone: "guard" },
      { id: "l-appr-cal", from: "approval:r", to: "calendar:l", style: "straight", tone: "tool" },
      { id: "l-loop-hist", from: "loop:b:0.25", to: "history:t:0.6", tone: "data", label: "append", labelAt: 0.55 },
      { id: "l-loop-ans", from: "loop:b:0.75", to: "answer:t:0.5", style: "straight", tone: "output" }
    ],

    steps: [
      { title: "A chatbot talks, an agent acts",
        text: "A chatbot only replies. An agent can act: the model asks for tools, your code runs them, and the results go back until the job is done. Follow one request that needs a weather check and a calendar change." },
      { title: "The request and the tools",
        text: "Your code starts the loop. Along with the user's message it prepares the system prompt and the tool definitions: each tool's name, what it does, and the JSON schema of its arguments.",
        focus: ["user", "sysprompt", "loop"], flow: ["l-user-loop", "l-sys-loop"],
        packets: [{ on: "l-user-loop", text: "request" }, { on: "l-sys-loop", text: "tools", "with": true }] },
      { title: "Ask the model",
        text: "The loop sends the whole message history and the tool list to the model. The model reads the request and decides what to do first.",
        focus: ["loop", "llm", "history"], flow: ["l-loop-llm"], packets: [{ on: "l-loop-llm", text: "messages" }] },
      { title: "The model asks for a tool",
        text: "The model replies not with text but with a tool call: **get_weather** for Bengaluru, tomorrow. It does not run anything itself - it only asks, in a structured format your code can read.",
        focus: ["llm", "toolcall", "history"], flow: ["l-llm-call", "l-llm-loop"], hl: { toolcall: [0], history: [2] },
        packets: [{ on: "l-llm-call", text: "tool call" }, { on: "l-llm-loop", text: "tool call", "with": true }],
        set: { toolcall: { hidden: false }, history: { items: h1 } } },
      { title: "Your code runs the tool",
        text: "Your code checks the arguments, calls the weather API and appends the result to the history as a tool result: an 80% chance of rain.",
        focus: ["loop", "weather", "wres", "history"], flow: ["l-loop-weather", "l-weather-res", "l-loop-hist"], hl: { history: [3] },
        packets: [{ on: "l-loop-weather", text: "get_weather" }, { on: "l-weather-res" }, { on: "l-loop-hist", text: "result" }],
        set: { wres: { hidden: false }, history: { items: h2 } } },
      { title: "Round two: another tool",
        text: "The loop calls the model again with the longer history. Now it knows rain is likely, so it asks for a second tool: **update_event**, to move the 4 pm meeting online.",
        focus: ["loop", "llm", "toolcall", "history"], flow: ["l-loop-llm", "l-llm-call", "l-llm-loop"], hl: { toolcall: [0], history: [4] },
        packets: [{ on: "l-loop-llm", text: "messages" }, { on: "l-llm-call", text: "tool call" }],
        set: { toolcall: { lines: ["update_event", "{ \"id\": \"evt_42\",", "  \"location\": \"online\" }"] }, history: { items: h3 } } },
      { title: "A human approves the change",
        text: "Changing someone's calendar has side effects, so your code pauses and asks the user to confirm. Read-only tools can run freely; actions that change things get a check first.",
        focus: ["loop", "approval"], flow: ["l-loop-appr"], packets: [{ on: "l-loop-appr", text: "confirm?" }] },
      { title: "Run the approved action",
        text: "The user says yes. Your code calls the calendar API, gets **status: updated**, and appends that as the second tool result.",
        focus: ["approval", "calendar", "history"], flow: ["l-appr-cal", "l-loop-hist"], hl: { history: [5] },
        packets: [{ on: "l-appr-cal" }, { on: "l-loop-hist", text: "result" }],
        set: { history: { items: h4 }, wres: { lines: ["{ \"status\": \"updated\" }"] } } },
      { title: "The model answers; the loop stops",
        text: "With both results in the history, the model replies in plain text. Its stop reason says it is finished rather than asking for a tool, so the loop ends and the answer goes to the user.",
        focus: ["llm", "loop", "answer", "history"], flow: ["l-loop-llm", "l-llm-loop", "l-loop-ans"], hl: { history: [6] },
        packets: [{ on: "l-loop-llm" }, { on: "l-llm-loop", text: "answer" }, { on: "l-loop-ans", text: "answer" }],
        set: { answer: { hidden: false }, history: { items: h5 } } },
      { title: "Guard rails around the loop",
        text: "Real agents need limits: a maximum number of steps, timeouts, tool errors sent back as results instead of crashing, and a watch on cost, because the whole history is resent every turn.",
        focus: ["guards", "loop", "history"] }
    ],

    concepts: {
      request: {
        title: "The user's request",
        tip: "A goal that needs real data and a real action - more than a model can do from memory alone.",
        detail: [
          "\"Will it rain in Bengaluru tomorrow? If yes, move my 4 pm meeting online.\" A plain chat model cannot answer this: it does not know tomorrow's weather, and it cannot touch your calendar. It needs tools.",
          "The request also has a condition - move the meeting only if it will rain - so the work cannot be fully planned in advance. The second step depends on the result of the first, which is exactly what an agent loop handles.",
          "Many requests do not need an agent at all. If the steps are always the same, a fixed workflow in code is cheaper, faster and easier to test. Agents earn their cost when the path depends on what happens along the way."
        ],
        oneLiner: "Agents are for goals whose steps depend on intermediate results; if the steps are always the same, a fixed workflow is cheaper and easier to test."
      },
      tooldefs: {
        title: "System prompt and tool definitions",
        tip: "Instructions for the model plus a list of tools, each with a name, a description and a JSON schema for its arguments.",
        detail: [
          "With every request your code sends the model a system prompt (who it is, what it may do) and the tool definitions. Each tool has a name such as get_weather, a description of when to use it, and a JSON schema listing its arguments and their types.",
          "The model chooses tools mostly from their names and descriptions, so these are effectively prompts. Vague descriptions or two overlapping tools lead to wrong choices. Clear, specific descriptions with an example often fix more than a bigger model would.",
          "Keep the list short and focused. Every definition costs tokens on every call, and accuracy drops as the menu grows. A few dozen tools is a lot; past that, group them or route to specialised agents."
        ],
        oneLiner: "Tools are described by name, description and JSON schema; the descriptions act as prompts, so clear, non-overlapping tools matter more than model size."
      },
      llm: {
        title: "The model as decision maker",
        tip: "At each turn the model reads the history and chooses: call a tool (and with what arguments) or answer the user.",
        detail: [
          "In an agent the model acts as the decision maker. Each time it is called, it reads the full history and the tool list and decides the next move: ask for a tool with specific arguments, or reply to the user with text.",
          "This reason-then-act cycle is often called ReAct. The model may think through the problem briefly before choosing; some APIs show that reasoning, others keep it hidden.",
          "The model never sees your systems directly. It only sees what is in the history. If a tool result is missing, truncated or misleading, the model's next decision will be wrong, however capable the model is."
        ],
        oneLiner: "Each turn the model reads the history and chooses between calling a tool and answering; it only knows what the history shows it."
      },
      loop: {
        title: "The agent loop",
        tip: "Your code: send the history to the model, run any tool it asks for, append the result, and repeat until it answers.",
        detail: [
          "The agent loop is ordinary code you write, or a framework writes for you. It calls the model, checks whether the reply is a tool call or a final answer, runs the tool if asked, appends the result to the history, and calls the model again.",
          "All the control lives here: which tools exist, whether arguments are valid, who is allowed to do what, when to ask a human, and when to stop. The model proposes; the loop decides what actually happens.",
          "Frameworks such as LangGraph or provider agent SDKs package this loop with extras like streaming, retries and state. Underneath, it is the same few lines: call, check, run, append, repeat."
        ],
        oneLiner: "The agent loop is your code - call the model, run requested tools, append results, repeat - and all real control and safety live there."
      },
      toolcall: {
        title: "Tool call",
        tip: "A structured request from the model - a tool name plus JSON arguments - asking your code to run something. The model never runs it.",
        detail: [
          "Instead of text, the model returns a tool call: the tool's name and arguments that match the schema, here get_weather with city Bengaluru and date tomorrow. The API marks the reply so your code knows it is a tool request, not an answer.",
          "The model cannot run code or reach the internet by itself. A tool call is only a request. Your code decides whether to honour it, which is what makes tool use safe enough to build on.",
          "The arguments can still be wrong - a missing field, a misspelt city, a date in the wrong format. Validate them against the schema before running anything, and send a clear error back if they fail."
        ],
        oneLiner: "A tool call is the model's structured request - name plus JSON arguments - that your code validates and may run; the model never executes anything itself."
      },
      tools: {
        title: "Tools",
        tip: "Ordinary functions or APIs - weather, calendar, search, databases - that your code runs when the model asks for them.",
        detail: [
          "A tool is any function your code can run: calling a weather API, reading or updating a calendar, searching documents, querying a database. To the model it is just a name, a description and a schema.",
          "There are two kinds. Read tools such as get_weather only fetch information and are safe to run freely. Write tools such as update_event change the world, so they need permission checks and often a human confirmation.",
          "Give each tool the least access it needs. The calendar tool should only be able to change the current user's events, enforced in code with their own credentials, never trusted to the model's good behaviour."
        ],
        oneLiner: "Tools are ordinary functions or APIs; separate read tools from write tools and give each the least privilege, enforced in code."
      },
      result: {
        title: "Tool result",
        tip: "What the tool returned, added to the history as a tool result so the model can use it on its next turn.",
        detail: [
          "After running get_weather, your code appends the output - an 80% chance of showers - to the history as a tool result, linked to the call that requested it. The model reads it on the next turn.",
          "Results should be compact and clear. Dumping a 5,000-line API response wastes tokens and buries the useful part. Trim it, or summarise it, before sending it back.",
          "Errors are results too. If the weather API times out, send back \"error: weather service unavailable\" rather than crashing. The model can then retry, choose another tool or tell the user. Treat tool output as untrusted data, never as instructions."
        ],
        oneLiner: "Tool results go back into the history - trimmed, linked to their call, errors included - and are treated as untrusted data, not instructions."
      },
      history: {
        title: "Message history and context",
        tip: "The running list of messages, tool calls and results. It is resent in full every turn, so it grows - and so does the cost.",
        detail: [
          "The model has no memory between calls. What it knows about this task is the message history your code sends: the system prompt, the user's request, every tool call and every result, in order.",
          "Each turn adds entries and the whole list is sent again, so a 10-step task costs far more than ten single calls. Long histories also slow responses and can push important details out of focus.",
          "Production agents manage this deliberately: they trim or summarise old results, keep large data outside the prompt and pass references, and use prompt caching so the unchanged start of the history is cheaper to resend."
        ],
        oneLiner: "The model's only memory is the history your code resends each turn, so cost and latency grow with every step unless you trim, summarise or cache."
      },
      approval: {
        title: "Human approval",
        tip: "Before an action with real consequences, the loop pauses and asks a person to confirm.",
        detail: [
          "Moving a meeting affects other people, so the agent asks first: \"Move your 4 pm meeting online?\". Your code pauses the loop until the user answers. This is often called human-in-the-loop.",
          "Decide in code which tools need approval - typically anything that sends, pays, deletes or changes shared data. Do not leave it to the model to ask politely; a confused or manipulated model might not.",
          "Approvals cost time and annoy users if overused. Common patterns are to approve once per session for low-risk actions, always for payments, and to show exactly what will change so the person can approve in seconds."
        ],
        oneLiner: "Risky actions pause for human approval, and which actions need it is decided in code, not left to the model."
      },
      answer: {
        title: "Final answer and the stop condition",
        tip: "When the model replies with text instead of a tool call, the loop ends and the answer goes to the user.",
        detail: [
          "Once the model has what it needs, it replies in plain text: \"Yes - an 80% chance of rain, so I have moved your 4 pm meeting online.\" The API's stop reason says the turn is finished rather than waiting on a tool, and your loop exits.",
          "That is the normal way an agent stops. But your loop also needs its own stops - a step limit, a time limit and a budget - because a model can keep calling tools, especially when a tool keeps failing.",
          "A good final answer reports what was actually done, based on tool results, not what the model intended. If the calendar update had failed, the answer must say so."
        ],
        oneLiner: "The loop normally stops when the model answers instead of calling a tool, backed by your own step, time and cost limits."
      },
      guards: {
        title: "Guard rails for agents",
        tip: "Limits that keep a looping agent safe and affordable: step caps, timeouts, error handling and cost budgets.",
        detail: [
          "Agents loop, and loops can run away. Cap the number of steps (say 10-20), put timeouts on each tool and on the whole run, and stop with a clear message when a limit is hit.",
          "Handle failure as data. Return tool errors to the model as results, retry transient failures with backoff, and never let a bad argument crash the whole run.",
          "Watch the cost: every step resends the growing history. Log each step - the model's choice, tool, arguments, result, tokens and time - so you can debug a bad run and measure how often the agent succeeds."
        ],
        oneLiner: "Agents need step caps, timeouts, errors returned as results, cost budgets and per-step tracing, because loops can run away silently."
      }
    }
  };
})();
