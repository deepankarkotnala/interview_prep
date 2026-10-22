/* Visual explanation: how LangGraph runs an agent as a graph with shared state.
   Drawn by assets/visual.js - scene format in README.md. The ticket, amounts and
   thread id are illustrative. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
(function () {
  function state(cat, inv, draft, ok) {
    return [
      "messages: [\"I was charged twice this month...\"]",
      "category: " + cat,
      "invoice:  " + inv,
      "draft:    " + draft,
      "approved: " + ok
    ];
  }
  var s0 = state("None", "None", "None", "None");
  var s1 = state("\"billing\"", "None", "None", "None");
  var s2 = state("\"billing\"", "\"2 charges of ₹499 on 3 Oct\"", "None", "None");
  var s3 = state("\"billing\"", "\"2 charges of ₹499 on 3 Oct\"", "\"Sorry, we will refund it.\"", "None");
  var s4 = state("\"billing\"", "\"2 charges of ₹499 on 3 Oct\"", "\"Refund of ₹499 in 3-5 days.\"", "False  # add a date");
  var s5 = state("\"billing\"", "\"2 charges of ₹499 on 3 Oct\"", "\"Refund of ₹499 in 3-5 days.\"", "True");

  window.IR.v["langgraph"] = {
    view: [1290, 640],

    parts: [
      { id: "ticket", kind: "msg", x: 40, y: 36, w: 300, role: "Customer ticket", text: "I was charged twice this month. Please fix it.", tone: "input", concept: "ticket" },
      { id: "api", kind: "box", x: 528, y: 52, w: 172, h: 56, label: "Billing API", icon: "tool", tone: "tool", concept: "toolnode" },
      { id: "reply", kind: "msg", x: 900, y: 36, w: 360, role: "Reply sent", text: "Sorry about that - the duplicate charge of ₹499 will be refunded in 3-5 working days.", tone: "output", hidden: true, concept: "reply" },

      { id: "start", kind: "box", shape: "pill", x: 40, y: 280, w: 92, h: 34, label: "START", tone: "neutral", concept: "startend" },
      { id: "classify", kind: "box", x: 170, y: 266, w: 160, h: 62, label: "classify", sub: "LLM node", tone: "model", concept: "classify" },
      { id: "router", kind: "box", shape: "pill", x: 372, y: 280, w: 112, h: 34, label: "route", tone: "neutral", concept: "router" },
      { id: "billing", kind: "box", x: 528, y: 170, w: 172, h: 62, label: "billing", sub: "checks the invoice", tone: "model", concept: "toolnode" },
      { id: "technical", kind: "box", x: 528, y: 370, w: 172, h: 62, label: "technical", sub: "searches the docs", tone: "model", concept: "router" },
      { id: "draft", kind: "box", x: 744, y: 266, w: 150, h: 62, label: "draft", sub: "writes the reply", tone: "model", concept: "draft" },
      { id: "limit", kind: "box", shape: "pill", x: 852, y: 188, w: 172, h: 30, label: "recursion limit", tone: "guard", concept: "cycle" },
      { id: "review", kind: "box", x: 936, y: 266, w: 176, h: 62, label: "human review", sub: "interrupt()", icon: "user", tone: "guard", concept: "review" },
      { id: "end", kind: "box", shape: "pill", x: 1152, y: 280, w: 92, h: 34, label: "END", tone: "neutral", concept: "startend" },

      { id: "state", kind: "code", x: 40, y: 476, w: 560, h: 136, title: "State - shared by every node", tone: "data", concept: "state", lines: s0 },
      { id: "ckpt", kind: "db", x: 650, y: 474, w: 230, h: 132, label: "Checkpointer", sub: "thread t-81: a snapshot per step", tone: "data", concept: "ckpt" },
      { id: "vschain", kind: "box", x: 920, y: 476, w: 340, h: 130, label: "Chain vs graph", icon: "graph", tone: "neutral", concept: "vschain",
        sub: "A chain runs a fixed line. A graph can branch, loop, pause for a person and resume later." }
    ],

    links: [
      { id: "l-ticket-start", from: "ticket:b:0.2", to: "start:t", tone: "input" },
      { id: "l-start-cls", from: "start:r", to: "classify:l", style: "straight" },
      { id: "l-cls-route", from: "classify:r", to: "router:l", style: "straight" },
      { id: "l-route-bill", from: "router:t", to: "billing:l", dashed: true, label: "billing", labelAt: 0.45 },
      { id: "l-route-tech", from: "router:b", to: "technical:l", dashed: true, label: "technical", labelAt: 0.45 },
      { id: "l-bill-api", from: "billing:t", to: "api:b", style: "straight", tone: "tool" },
      { id: "l-bill-draft", from: "billing:r", to: "draft:t:0.3", tone: "model" },
      { id: "l-tech-draft", from: "technical:r", to: "draft:b:0.3", tone: "model" },
      { id: "l-draft-review", from: "draft:r", to: "review:l", style: "straight", tone: "guard" },
      { id: "l-review-draft", from: "review:t:0.5", to: "draft:t:0.65", via: [[1024, 244], [842, 244]], dashed: true, tone: "guard", label: "rejected", labelAt: 0.5 },
      { id: "l-review-end", from: "review:r", to: "end:l", style: "straight", tone: "output" },
      { id: "l-end-reply", from: "end:t", to: "reply:b:0.8", tone: "output" },
      { id: "l-state-ckpt", from: "state:r", to: "ckpt:l", style: "straight", tone: "data" }
    ],

    steps: [
      { title: "A ticket as a graph",
        text: "A support ticket must be classified, routed, answered and checked by a person before it is sent. LangGraph runs this as a graph: nodes do the work, edges choose what runs next, and one shared state travels through." },
      { title: "Why a graph, not a chain",
        text: "A chain runs steps in a fixed line. Real workflows branch on what they find, loop back when something is wrong, and wait for people. A graph can express all three.",
        focus: ["vschain"] },
      { title: "One shared state",
        text: "The graph carries one state object with named fields. Every node reads it and returns only the fields it changes. Reducers decide how updates merge - messages, for example, are appended rather than replaced.",
        focus: ["state"] },
      { title: "START: classify the ticket",
        text: "The run begins at **START**. The classify node calls an LLM, reads the ticket and returns one update: category is **billing**.",
        focus: ["ticket", "start", "classify", "state"], flow: ["l-ticket-start", "l-start-cls"], hl: { state: [1] },
        packets: [{ on: "l-ticket-start", text: "ticket" }, { on: "l-start-cls" }], set: { state: { lines: s1 } } },
      { title: "A conditional edge routes",
        text: "After classify comes a conditional edge: a small function that reads the state and returns the next node's name. Category is billing, so the billing branch runs and technical is skipped.",
        focus: ["classify", "router", "billing", "technical"], flow: ["l-cls-route", "l-route-bill"],
        packets: [{ on: "l-cls-route" }, { on: "l-route-bill", text: "billing" }] },
      { title: "The billing node uses a tool",
        text: "The billing node calls the billing API, finds two charges of **₹499** on the same day, and writes what it found into the state.",
        focus: ["billing", "api", "state"], flow: ["l-bill-api"], hl: { state: [2] },
        packets: [{ on: "l-bill-api", text: "get_invoice" }, { on: "l-bill-api", text: "2 charges", rev: true }],
        set: { state: { lines: s2 } } },
      { title: "Draft the reply",
        text: "The draft node reads the ticket and the invoice from the state and asks the LLM for a reply. Nodes never call each other directly - they only read and update the state.",
        focus: ["billing", "draft", "state"], flow: ["l-bill-draft"], hl: { state: [3] },
        packets: [{ on: "l-bill-draft", text: "state" }], set: { state: { lines: s3 } } },
      { title: "Checkpoint every step",
        text: "After each step, a checkpointer saves a snapshot of the state under the run's thread id. The run can be resumed, inspected step by step, or continued in the next conversation turn.",
        focus: ["state", "ckpt"], flow: ["l-state-ckpt"], packets: [{ on: "l-state-ckpt", text: "snapshot" }] },
      { title: "Pause for a human",
        text: "Before anything is sent, the review node calls **interrupt()**. The graph stops and its state is already saved. A person reads the draft - minutes or days later - and the graph resumes with their decision.",
        focus: ["draft", "review", "ckpt"], flow: ["l-draft-review"], packets: [{ on: "l-draft-review", text: "draft" }] },
      { title: "Rejected: loop back",
        text: "The reviewer rejects it: the reply needs a refund date. An edge sends the run back to draft, which writes a better reply. Loops like this are allowed; a recursion limit stops one that never ends.",
        focus: ["review", "draft", "limit", "state"], flow: ["l-review-draft"], hl: { state: [3, 4] },
        packets: [{ on: "l-review-draft", text: "add a date" }], set: { state: { lines: s4 } } },
      { title: "Approved: END and send",
        text: "The second draft is approved, the run reaches **END**, and the reply goes to the customer. Each node's output can be streamed as it happens, so the UI shows progress instead of a spinner.",
        focus: ["review", "end", "reply", "state"], flow: ["l-draft-review", "l-review-end", "l-end-reply"], hl: { state: [4] },
        packets: [{ on: "l-draft-review" }, { on: "l-review-end" }, { on: "l-end-reply", text: "reply" }],
        set: { reply: { hidden: false }, state: { lines: s5 } } }
    ],

    concepts: {
      ticket: {
        title: "The input",
        tip: "The customer's ticket. It becomes the first message in the graph's state, and the run starts from it.",
        detail: [
          "\"I was charged twice this month. Please fix it.\" This ticket is the input to the graph. It is placed in the state as the first message, and every node can read it from there.",
          "A graph is invoked with an input and a configuration. The configuration includes a thread id, which ties this run to its saved checkpoints so it can be paused and resumed.",
          "The same graph handles every ticket. What changes from run to run is the state - and therefore which branches run and how many times the review loop goes round."
        ],
        oneLiner: "A graph run starts from an input placed in the state, plus a config whose thread id links the run to its checkpoints."
      },
      vschain: {
        title: "Chain vs graph",
        tip: "A chain runs steps in a fixed order. A graph adds branches, loops, pauses for people and resuming from saved state.",
        detail: [
          "A LangChain chain is a pipeline: prompt, then model, then parser, always in the same order. That is perfect for simple, predictable tasks.",
          "Many real flows are not a straight line. They branch on what they find (billing or technical), loop until something is good enough (review and redraft), and wait for people (approval). LangGraph models these as a graph of nodes and edges with explicit state.",
          "Use the simplest thing that works. If your flow is a straight line, a chain is easier to read and test. Reach for a graph when you need branching, cycles, human-in-the-loop or durable, resumable runs."
        ],
        oneLiner: "Chains run fixed sequences; LangGraph adds branching, cycles, human-in-the-loop and resumable state, so use it when the flow is not a straight line."
      },
      state: {
        title: "State and reducers",
        tip: "One shared, typed object - here messages, category, invoice, draft and approved. Nodes read it and return the fields they change.",
        detail: [
          "The state is defined up front as a schema, often a Python TypedDict, with fields such as messages, category, invoice, draft and approved. It is the only thing passed between nodes.",
          "A node is just a function: it receives the current state and returns a partial update, such as {\"category\": \"billing\"}. LangGraph merges the update into the state before the next node runs.",
          "Reducers control the merge. By default a field is overwritten, but a field like messages uses a reducer (add_messages) that appends instead. Getting reducers wrong is a classic bug: parallel branches overwrite each other, or a message list keeps only the last message."
        ],
        oneLiner: "State is a typed schema passed between nodes; nodes return partial updates and reducers decide how they merge, such as appending messages."
      },
      startend: {
        title: "START, END and streaming",
        tip: "START is where every run enters; END is where it finishes. Along the way each step's output can be streamed to the UI.",
        detail: [
          "START and END are special nodes. You add an edge from START to the first real node, and edges into END from wherever a run may finish. A graph can have several paths into END.",
          "Calling the compiled graph runs it from START until it reaches END, an interrupt, or an error. Calling stream instead returns updates as each node finishes, and can even stream the model's tokens inside a node.",
          "Streaming matters for user experience: a support agent sees \"classifying... checking invoice... drafting...\" rather than a silent wait, and long runs feel responsive."
        ],
        oneLiner: "Runs enter at START and finish at END; streaming returns each node's updates as they happen, so users see progress instead of a spinner."
      },
      classify: {
        title: "A node",
        tip: "A function that does one job - here, call an LLM to classify the ticket - and returns an update to the state.",
        detail: [
          "The classify node is an ordinary Python function. It reads the ticket from the state, asks an LLM which category it belongs to, and returns {\"category\": \"billing\"}.",
          "Nodes can do anything a function can: call a model, call a tool, run plain code, or even run a whole subgraph. Keeping each node to one clear job makes the graph easy to read and each node easy to test on its own.",
          "Asking the LLM for structured output - one of a fixed set of categories - makes the next step reliable, because the router can trust the value it reads."
        ],
        oneLiner: "A node is a function that reads state, does one job - a model call, a tool, plain code - and returns a partial state update."
      },
      router: {
        title: "Conditional edges",
        tip: "A routing function that reads the state and returns which node runs next - here billing, not technical.",
        detail: [
          "A normal edge always goes to the same next node. A conditional edge calls a small function you write, which looks at the state and returns the name of the next node: \"billing\" or \"technical\".",
          "This is how a graph branches. The routing logic is plain code, so you can test it, log it and reason about it - unlike burying every decision inside one big prompt.",
          "Routing can also fan out: a conditional edge can send work to several nodes at once, which then run in parallel. Reducers on the state matter here, so the parallel updates merge correctly."
        ],
        oneLiner: "Conditional edges run a routing function on the state to choose the next node, so branching is explicit, testable code."
      },
      toolnode: {
        title: "A node that uses a tool",
        tip: "The billing node calls the billing API and writes what it found into the state for later nodes to use.",
        detail: [
          "The billing node calls a real system - the billing API - to look up the customer's invoices. It finds two charges of ₹499 on 3 October and stores that in the state's invoice field.",
          "Tools can be called directly in a node, as here, or by letting an LLM decide which tool to call, using a prebuilt tool node and a loop between the model and the tools. Both are common in LangGraph.",
          "Because the result lands in the state, every later node can use it, and the checkpoint records exactly what the API returned - very useful when you are debugging why a reply said what it said."
        ],
        oneLiner: "Nodes can call tools directly or let an LLM choose them; results are written to state, so later nodes and checkpoints can see them."
      },
      draft: {
        title: "The draft node",
        tip: "Reads the ticket and the invoice from the state and asks an LLM to write the reply. It may run more than once.",
        detail: [
          "The draft node combines what earlier nodes found: the ticket, the category and the invoice. It asks an LLM for a short, polite reply and writes it into the draft field.",
          "Nodes do not call each other. The draft node does not know the billing node exists; it only knows the state has an invoice field. That loose coupling is what makes graphs easy to extend.",
          "When the reviewer sends it back, the draft node runs again with extra feedback in the state. Writing nodes so they can safely run more than once is good practice in any graph with loops."
        ],
        oneLiner: "The draft node builds on what earlier nodes put in state and may rerun with feedback, so nodes should be safe to run more than once."
      },
      review: {
        title: "Human-in-the-loop with interrupt",
        tip: "The review node calls interrupt(): the graph pauses with its state saved, and resumes later with the person's decision.",
        detail: [
          "Before a reply goes to a customer, a person checks it. The review node calls interrupt(), passing the draft to show. The run stops right there, and because a checkpointer is configured, its state is safe.",
          "The person might respond in a minute or in two days. When they do, your app resumes the same thread with Command(resume=...) carrying their decision, and the graph continues from the review node as if it had never stopped.",
          "This only works with a checkpointer, and the node may re-run from its start on resume, so keep side effects after the interrupt. It is the standard way to add approvals, edits and escalation to agents."
        ],
        oneLiner: "interrupt() pauses a run with its state checkpointed; resuming with Command(resume=...) continues it later with the human's decision."
      },
      cycle: {
        title: "Cycles and the recursion limit",
        tip: "Graphs may loop - review sends the work back to draft - but a recursion limit stops a run that would loop forever.",
        detail: [
          "Unlike a chain, a graph can contain cycles. Here a rejected draft goes back to the draft node and comes round to review again. Loops are how agents retry, refine and act repeatedly.",
          "Loops need an exit. The conditional edge after review either ends the run or loops back, and LangGraph also enforces a recursion limit - a maximum number of steps per run - raising an error if it is reached.",
          "In production, add your own stop as well, such as a maximum of three review rounds stored as a counter in the state, so a stubborn loop escalates to a person instead of failing."
        ],
        oneLiner: "Graphs allow cycles for retries and refinement; a recursion limit plus your own counters in state make sure every loop ends."
      },
      ckpt: {
        title: "Checkpointer and threads",
        tip: "Saves a snapshot of the state after every step under a thread id, enabling resume, history, time travel and memory across turns.",
        detail: [
          "A checkpointer stores the state after each step, keyed by the thread id from the run's config. LangGraph ships in-memory, SQLite and Postgres checkpointers; production systems use a durable one such as Postgres.",
          "Checkpoints unlock several features at once: pausing for humans, resuming after a crash, inspecting exactly what the state was at each step, re-running from an earlier point, and remembering a conversation across turns on the same thread.",
          "Snapshots grow with the state. Keep large blobs such as whole documents out of the state - store a reference instead - or checkpoints become slow and expensive."
        ],
        oneLiner: "A checkpointer snapshots state per step under a thread id, enabling interrupts, crash recovery, step-by-step history and conversation memory."
      },
      reply: {
        title: "The result",
        tip: "The approved reply, sent to the customer when the run reaches END. The final state records everything that happened.",
        detail: [
          "Once the second draft is approved, the run reaches END and the reply goes out: \"the duplicate charge of ₹499 will be refunded in 3-5 working days\".",
          "The final state holds the whole story: the ticket, category, invoice, draft and approval. With the checkpoints, you can replay every step of how this reply came to be.",
          "That audit trail is a big reason teams use graphs for customer-facing agents: when someone asks why the bot said something, you can show exactly which data and which decision led there."
        ],
        oneLiner: "When the run reaches END, the result and the final state - plus checkpoints - give a full audit trail of how the answer was produced."
      }
    }
  };
})();
