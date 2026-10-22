/* Visual explanation: how several agents split one job.
   Drawn by assets/visual.js - scene format in README.md. The task, plan and
   findings are illustrative. */
window.IR = window.IR || {};
window.IR.v = window.IR.v || {};
window.IR.v["multi-agent"] = {
  view: [1290, 640],

  parts: [
    { id: "request", kind: "msg", x: 30, y: 30, w: 300, role: "Request", text: "Write a one-page brief on EV battery makers in India.", tone: "input", concept: "request" },
    { id: "orch", kind: "box", x: 30, y: 170, w: 250, h: 80, label: "Orchestrator", sub: "plans, delegates, checks", icon: "graph", tone: "model", concept: "orchestrator" },
    { id: "plan", kind: "code", x: 30, y: 290, w: 300, title: "Plan", tone: "neutral", hidden: true, concept: "plan",
      lines: ["1. research: makers, news", "2. data: capacity, share", "3. write: one page", "4. review: against brief"] },

    { id: "web", kind: "box", x: 410, y: 30, w: 200, h: 54, label: "Web search", icon: "globe", tone: "tool", concept: "tools" },
    { id: "sql", kind: "box", x: 660, y: 30, w: 200, h: 54, label: "SQL database", icon: "db", tone: "tool", concept: "tools" },
    { id: "research", kind: "box", x: 400, y: 150, w: 220, h: 74, label: "Research agent", sub: "own prompt, own tools", icon: "search", tone: "model", concept: "worker" },
    { id: "data", kind: "box", x: 650, y: 150, w: 220, h: 74, label: "Data agent", sub: "own prompt, own tools", icon: "db", tone: "model", concept: "worker" },
    { id: "state", kind: "box", x: 400, y: 300, w: 470, h: 74, label: "Shared state", sub: "short summaries, not whole transcripts", icon: "memory", tone: "data", concept: "state" },

    { id: "writer", kind: "box", x: 960, y: 150, w: 230, h: 74, label: "Writer agent", sub: "drafts the brief", icon: "pen", tone: "model", concept: "writer" },
    { id: "reviewer", kind: "box", x: 960, y: 300, w: 230, h: 74, label: "Reviewer agent", sub: "checks against criteria", icon: "check", tone: "guard", concept: "reviewer" },
    { id: "brief", kind: "doc", x: 1040, y: 440, w: 70, h: 88, label: "Final brief", tone: "output", hidden: true, concept: "brief" },

    { id: "costs", kind: "box", x: 30, y: 450, w: 330, h: 110, label: "The cost of splitting", icon: "alert", tone: "guard", concept: "tradeoffs",
      sub: "≈N× the tokens · more latency · errors compound at every hand-off · harder to debug" },
    { id: "patterns", kind: "box", x: 400, y: 430, w: 470, h: 110, label: "Other patterns", icon: "layers", tone: "neutral", concept: "patterns",
      sub: "pipeline · router · supervisor · peer hand-offs - and often just one agent with good tools" }
  ],

  links: [
    { id: "l-req-orch", from: "request:b:0.3", to: "orch:t:0.36", style: "straight", tone: "input" },
    { id: "l-orch-plan", from: "orch:b:0.36", to: "plan:t:0.3", style: "straight" },
    { id: "l-orch-res", from: "orch:r:0.4", to: "research:l", tone: "model", label: "subtask", labelAt: 0.5 },
    { id: "l-orch-data", from: "orch:t:0.82", to: "data:t:0.25", via: [[235, 126], [705, 126]], tone: "model", label: "subtask", labelAt: 0.8 },
    { id: "l-res-web", from: "research:t:0.5", to: "web:b:0.5", style: "straight", tone: "tool" },
    { id: "l-data-sql", from: "data:t:0.6", to: "sql:b:0.66", style: "straight", tone: "tool" },
    { id: "l-res-state", from: "research:b", to: "state:t:0.23", style: "straight", tone: "data" },
    { id: "l-data-state", from: "data:b", to: "state:t:0.77", style: "straight", tone: "data" },
    { id: "l-state-writer", from: "state:r", to: "writer:l", tone: "data" },
    { id: "l-writer-rev", from: "writer:b", to: "reviewer:t", style: "straight", tone: "model", label: "draft", labelAt: 0.5 },
    { id: "l-rev-writer", from: "reviewer:r", to: "writer:r", via: [[1244, 337], [1244, 187]], dashed: true, tone: "guard", label: "fix", labelAt: 0.5 },
    { id: "l-rev-brief", from: "reviewer:b", to: "brief:t", style: "straight", tone: "output", label: "approved", labelAt: 0.5 }
  ],

  steps: [
    { title: "Several agents, one job",
      text: "Some jobs are big enough to split. An orchestrator plans the work, specialist agents do the parts, a reviewer checks the result, and one answer comes back. Follow a request for a research brief." },
    { title: "Why split the work",
      text: "One agent with thirty tools and a huge prompt gets confused and slow. Specialists each get a short, focused prompt and only the two or three tools they need, so each part is done better.",
      focus: ["research", "data", "writer", "reviewer"] },
    { title: "The orchestrator plans",
      text: "The orchestrator reads **a one-page brief on EV battery makers in India** and breaks it into tasks: research, data, writing and review, with who does what and in which order.",
      focus: ["request", "orch", "plan"], flow: ["l-req-orch", "l-orch-plan"], hl: { plan: [0, 1] },
      packets: [{ on: "l-req-orch", text: "request" }, { on: "l-orch-plan" }], set: { plan: { hidden: false } } },
    { title: "Fan out in parallel",
      text: "Research and data do not depend on each other, so the orchestrator sends both tasks at once. Each worker starts with a fresh context holding only its own task.",
      focus: ["orch", "research", "data"], flow: ["l-orch-res", "l-orch-data"],
      packets: [{ on: "l-orch-res", text: "task 1" }, { on: "l-orch-data", text: "task 2", "with": true }] },
    { title: "Each worker uses its own tools",
      text: "The research agent searches the web for makers and recent news. The data agent queries a market database for capacity and share. Neither sees the other's tools or messages.",
      focus: ["research", "data", "web", "sql"], flow: ["l-res-web", "l-data-sql"],
      packets: [{ on: "l-res-web" }, { on: "l-data-sql", "with": true }] },
    { title: "Report back as summaries",
      text: "Each worker writes a short summary of what it found into shared state - not its whole transcript. That keeps the next agent's context small and focused.",
      focus: ["research", "data", "state"], flow: ["l-res-state", "l-data-state"],
      packets: [{ on: "l-res-state", text: "5 makers" }, { on: "l-data-state", text: "table", "with": true }],
      set: { state: { lines: ["research: 5 makers + 3 news items", "data: capacity and share table"] } } },
    { title: "The writer drafts",
      text: "The writer agent reads only the shared summaries and the brief's requirements, and drafts the one-page brief.",
      focus: ["state", "writer"], flow: ["l-state-writer"], packets: [{ on: "l-state-writer", text: "summaries" }] },
    { title: "Review, then one revision",
      text: "A reviewer agent checks the draft against clear criteria: one page, sources cited, numbers match the data. It finds missing sources and sends the draft back once with that specific fix.",
      focus: ["writer", "reviewer"], flow: ["l-writer-rev", "l-rev-writer"],
      packets: [{ on: "l-writer-rev", text: "draft" }, { on: "l-rev-writer", text: "add sources" }] },
    { title: "Approve and return",
      text: "The revised draft passes review. The orchestrator checks every task in the plan is done and returns the final brief to the user.",
      focus: ["writer", "reviewer", "brief", "orch"], flow: ["l-writer-rev", "l-rev-brief"],
      packets: [{ on: "l-writer-rev", text: "draft 2" }, { on: "l-rev-brief", text: "brief" }], set: { brief: { hidden: false } } },
    { title: "What splitting costs",
      text: "Every agent is more model calls: often several times the tokens of one agent, more latency, and more places to go wrong. An error in one hand-off flows into every step after it.",
      focus: ["costs"] },
    { title: "Other patterns, and when not to",
      text: "Pipelines, routers, supervisors and peer hand-offs are other ways to split work. But the sensible default is still one agent with good tools; split only when it measurably fails.",
      focus: ["patterns"] }
  ],

  concepts: {
    request: {
      title: "The request",
      tip: "A job with several distinct parts - research, numbers, writing, checking - which is when splitting across agents can pay off.",
      detail: [
        "\"Write a one-page brief on EV battery makers in India\" needs several different skills: finding sources on the web, pulling numbers from data, writing clearly, and checking the result.",
        "One capable agent could attempt all of it, but its prompt and context would fill with search results, tables and drafts at once. Splitting gives each part a clean workspace.",
        "Not every request deserves this. A simple question to a single agent is faster and cheaper. Multi-agent designs make sense for broad, multi-part jobs where parts can run in parallel or need very different tools."
      ],
      oneLiner: "Multi-agent setups suit broad, multi-part jobs with separable pieces; simple requests are better served by a single agent."
    },
    orchestrator: {
      title: "Orchestrator",
      tip: "The lead agent: it plans the work, hands tasks to specialists, tracks progress and decides when the job is done.",
      detail: [
        "The orchestrator, sometimes called the supervisor or lead agent, receives the request, breaks it into tasks, and decides which specialist gets each one and in what order.",
        "It sends each worker a self-contained task description - what to do, what to return, and when to stop - because the worker does not see the full conversation. Vague hand-offs are the most common reason multi-agent systems produce poor work.",
        "At the end it checks the results against the plan and assembles the answer. It can also re-plan: if the data agent finds nothing, it might send the research agent back for more."
      ],
      oneLiner: "The orchestrator plans, delegates self-contained tasks, tracks progress and assembles the result; clear hand-offs make or break the system."
    },
    plan: {
      title: "The plan",
      tip: "A list of tasks with owners and order. It makes the work visible, lets independent tasks run in parallel and shows when the job is done.",
      detail: [
        "The orchestrator turns the request into a plan: 1 research, 2 data, 3 write, 4 review. Each task has an owner and a clear output.",
        "The plan shows which tasks depend on each other. Research and data are independent, so they can run at the same time; writing needs both, so it waits.",
        "Keeping the plan in shared state, rather than only in the orchestrator's head, helps with debugging and recovery: you can see which tasks finished, which failed, and restart from the failed one."
      ],
      oneLiner: "An explicit plan shows dependencies, lets independent tasks run in parallel, and makes progress and failures visible."
    },
    worker: {
      title: "Specialist workers",
      tip: "Agents with a narrow job, a short focused prompt and only the tools that job needs. Each starts with a fresh context.",
      detail: [
        "The research agent and the data agent are specialists. Each has its own system prompt, its own small set of tools and its own context window, holding only its task.",
        "Narrow roles help accuracy: a model choosing between two tools makes fewer mistakes than one choosing between thirty, and a short prompt leaves room for the actual work.",
        "Running them in parallel also cuts waiting time for independent tasks. The trade-off is that each worker knows nothing beyond its task description, so whatever it needs must be in that description."
      ],
      oneLiner: "Specialist workers get narrow prompts, few tools and fresh contexts, improving focus and allowing parallel work, but they only know what the hand-off tells them."
    },
    tools: {
      title: "Each agent's tools",
      tip: "Every specialist gets only the tools its job needs - web search for research, a database for data - and no access to the rest.",
      detail: [
        "The research agent can search the web; the data agent can query the market database. Neither can use the other's tools.",
        "Fewer tools per agent means better tool choice and simpler prompts. It also limits damage: an agent that only reads a database cannot send emails, even if a web page it read tries to trick it.",
        "In code this is just configuration - each agent is created with its own tool list and credentials. Keeping that list minimal is one of the simplest and most effective safety measures."
      ],
      oneLiner: "Give each agent only the tools and access its role needs; it improves tool choice and limits the damage of mistakes or prompt injection."
    },
    state: {
      title: "Shared state",
      tip: "Where agents leave their results for others to use - short summaries, not whole transcripts, so later agents stay focused.",
      detail: [
        "Agents need a way to pass work along. Here each worker writes a short summary into shared state: five makers and three news items, plus a capacity table. The writer reads from there.",
        "Passing summaries instead of full transcripts is deliberate. A worker's transcript is full of search results and dead ends; copying all of it would bloat the writer's context, raise cost and bury the useful facts.",
        "The risk is losing detail in the summary. Good hand-offs say exactly what to return - fields, sources, confidence - and keep the raw data available by reference if someone needs to check it."
      ],
      oneLiner: "Agents share results through state as compact, structured summaries with sources, keeping contexts small without losing what later steps need."
    },
    writer: {
      title: "Writer agent",
      tip: "Turns the workers' findings into the final document, working only from shared state and the brief's requirements.",
      detail: [
        "The writer reads the research summary, the data table and the requirements - one page, for a business reader - and drafts the brief.",
        "Because it starts from clean summaries rather than raw search results, its context is small and its job is clear: structure, clarity and accuracy against the inputs it was given.",
        "It cannot check facts it was not given. If the summaries are wrong or missing sources, the draft will be too - which is exactly why a review step follows."
      ],
      oneLiner: "The writer drafts from shared summaries with a small, clear context, but it can only be as accurate as the findings it was given."
    },
    reviewer: {
      title: "Reviewer and the revision loop",
      tip: "Checks the draft against explicit criteria and sends it back with specific fixes. One or two rounds, then stop.",
      detail: [
        "The reviewer is an agent with a different job: judge, not write. It checks the draft against a clear checklist - one page, sources cited, numbers match the data table - and returns either approval or specific fixes.",
        "This generator-and-critic pattern is often called evaluator-optimiser. Specific feedback such as \"add sources for the capacity figures\" works far better than \"make it better\".",
        "Cap the loop: one or two revision rounds, then return the best version or escalate to a person. Endless back-and-forth burns tokens and rarely converges."
      ],
      oneLiner: "A reviewer agent checks drafts against explicit criteria and returns specific fixes; cap the evaluator-optimiser loop at one or two rounds."
    },
    brief: {
      title: "The final result",
      tip: "The approved brief, returned once the orchestrator confirms every task in the plan is done.",
      detail: [
        "After the revision passes review, the orchestrator checks the plan - research, data, writing, review all done - and returns the brief to the user.",
        "The final answer should come with its sources and, ideally, a trace of which agent did what. If a number is wrong, you can see whether research, data or writing introduced it.",
        "That trace is also how you evaluate the system: run a set of real requests, score the final briefs, and compare against a single-agent baseline to prove the extra cost buys better results."
      ],
      oneLiner: "The orchestrator returns the result once the plan is complete; traces of each agent's work make errors debuggable and the design measurable."
    },
    tradeoffs: {
      title: "The cost of splitting",
      tip: "More agents mean more model calls, more tokens, more latency and more hand-offs where things can go wrong.",
      detail: [
        "Every agent is extra model calls, each with its own prompt and context. Multi-agent runs often use several times the tokens of a single agent, and sequential steps add up to slower answers.",
        "Errors compound. If the research agent misreads a source, the writer builds on it and the reviewer may not catch it. Each hand-off loses some context, too.",
        "They are also harder to debug and test: a failure might come from the plan, a hand-off, a worker or the review. Without tracing every agent's inputs and outputs, you are guessing."
      ],
      oneLiner: "Multi-agent systems cost several times the tokens, add latency, compound errors across hand-offs and are harder to debug - so the gain must be measured."
    },
    patterns: {
      title: "Other patterns - and when not to",
      tip: "Pipelines, routers, supervisors and peer hand-offs are other ways to split work. Often the best choice is one agent with good tools.",
      detail: [
        "A pipeline runs agents in a fixed order, each passing its output to the next. A router sends each request to the one specialist that fits. A supervisor, as here, plans and delegates. In peer hand-offs, agents pass control directly to each other, as in a customer-support transfer.",
        "Frameworks such as LangGraph, CrewAI, AutoGen and the provider agent SDKs implement these patterns, but the patterns matter more than the framework.",
        "The default should be the simplest thing that works: often a single agent with well-designed tools, or a fixed workflow. Add agents when you can show, with evaluation, that the single agent fails at the task."
      ],
      oneLiner: "Know pipeline, router, supervisor and hand-off patterns, but default to one agent with good tools and split only when evaluation shows it fails."
    }
  }
};
