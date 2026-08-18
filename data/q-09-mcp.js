/* Topic 09 — MCP, A2A and the tool boundary.
   Grounding: the published MCP specification and public JDs that now name it. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["09-mcp"] = {
  lede: "MCP started appearing in Indian job descriptions during 2025 and is now common. Most panels are not testing deep protocol knowledge — they are testing whether you understand why a standard tool boundary matters, and whether you can see the security problem it creates. That second half is where candidates fall down.",
  grounding: "the published MCP specification + public JDs naming it",
  evening: ["mcp-01", "mcp-03", "mcp-05", "mcp-06"],

  cards: [
    {
      id: "mcp-01",
      q: "What is MCP and what problem does it solve?",
      round: ["screening", "tech1"],
      level: "2-5",
      tags: ["mcp", "basics", "protocol"],
      why: "Currency. Whether your knowledge extends to what shipped in the last year.",
      simple:
        "Before MCP, every team wrote its own glue between models and tools. If you had four applications that all needed to read from the same internal system, you wrote that integration four times, in four shapes, and each one broke differently.\n\n" +
        "MCP is Model Context Protocol — an open standard for how an application exposes tools, data and prompts to a model. Anthropic published it and it has since been adopted broadly across the industry.\n\n" +
        "The comparison that lands: it is doing for tool integrations what a database driver standard did for databases. Write the server once, and any MCP-capable client can use it.\n\n" +
        "The parts: a server exposes capabilities — tools it can run, resources it can read, prompts it can offer. A client, inside your application, connects and makes them available to the model. The transport is JSON-RPC, over standard input and output for local servers or HTTP for remote ones.",
      points: [
        "An open standard for exposing tools, data and prompts to models.",
        "Server exposes capabilities; client connects and offers them to the model.",
        "Three capability types: tools (actions), resources (data), prompts (templates).",
        "JSON-RPC transport — stdio for local, HTTP for remote.",
        "Write the integration once instead of once per application."
      ],
      say: "MCP is an open standard for how applications expose tools, data and prompts to a model. Before it, every team wrote its own glue, so the same internal system got integrated four times in four shapes. A server exposes capabilities, a client inside the application connects and offers them to the model, over JSON-RPC. Write the integration once, and any MCP-capable client can use it.",
      numbers: "No number applies. This is an integration-architecture answer.",
      wrong: "\"It's how Claude connects to tools.\" It started there and it is an open standard with broad adoption. Framing it as one vendor's feature dates the answer.",
      follow: "So what stops a malicious MCP server from doing damage?"
    },

    {
      id: "mcp-02",
      q: "How is MCP different from just calling an API?",
      round: ["tech1"],
      level: "5-10",
      tags: ["mcp", "architecture", "tools"],
      why: "The obvious follow-up, and a vague answer here undoes the previous one.",
      simple:
        "You can always call an API directly. The difference is discovery and uniformity.\n\n" +
        "With a direct integration, your application has to know in advance what exists — which endpoints, what parameters, what they return — and that knowledge is hard-coded. Adding a capability means changing your application.\n\n" +
        "With MCP, the client asks the server what it offers, at runtime. The server returns tool definitions with schemas and descriptions in a standard shape, and the model can use them immediately. Adding a tool on the server side makes it available without touching the client.\n\n" +
        "The second difference is that the shape is designed for models rather than developers. A REST API assumes a developer reading documentation. MCP tool definitions carry the description and schema the model needs to decide whether to use them.\n\n" +
        "The honest caveat: for one integration you control, MCP is overhead. It pays off across many tools, many applications, or third-party servers you did not write.",
      points: [
        "Runtime discovery instead of hard-coded knowledge of endpoints.",
        "Uniform definition shape, designed to be read by a model.",
        "Add a tool server-side, no client change.",
        "Same auth, transport and error conventions across all servers.",
        "Overhead for a single integration you own. Pays off at several."
      ],
      say: "A direct integration hard-codes what exists — endpoints, parameters, returns — so adding a capability means changing the application. With MCP the client asks the server what it offers at runtime, and gets definitions in a standard shape written to be read by a model rather than a developer. Add a tool server-side and it is available without a client change. For one integration I own, it is overhead.",
      numbers: "No number applies. The payoff scales with the number of tools and consuming applications.",
      wrong: "\"It's just a wrapper around APIs.\" It misses runtime discovery, which is the property that changes how systems are built.",
      follow: "When would you not bother with MCP?"
    },

    {
      id: "mcp-03",
      q: "What are the security risks of MCP?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["mcp", "security", "guardrails", "supply-chain"],
      why: "The question that matters at any regulated employer, and where candidates who only read the happy path stop.",
      simple:
        "Connecting a model to tools through a standard protocol makes integration easy, and it makes a whole class of risk easy too.\n\n" +
        "Tool descriptions are prompt input. A server you did not write supplies text that goes straight into the model's context. A malicious or compromised server can put instructions in a tool description — this is injection with a delivery mechanism.\n\n" +
        "Supply chain. Installing a community MCP server is running someone else's code with your credentials, and the ecosystem is young. This is npm-install risk pointed at your production systems.\n\n" +
        "Over-broad permissions. A server is often given a token that can do far more than the one tool needs, because that was easier.\n\n" +
        "Confused deputy. The server acts with its own permissions, not the end user's, so a user can reach data through the tool that they could not reach directly.\n\n" +
        "The controls: review and pin servers, run them with least privilege and short-lived credentials, isolate them, pass user identity through so authorisation is per-user, validate arguments in code, and log every call.",
      points: [
        "Tool descriptions enter the prompt — a hostile server is an injection channel.",
        "Supply chain: a community server runs your credentials. Review and pin it.",
        "Least privilege per server, short-lived credentials, isolated execution.",
        "Confused deputy: authorise as the **user**, not as the server.",
        "Validate arguments in code before execution, always.",
        "Log every call including refusals. That log is your audit trail."
      ],
      say: "Three main ones. Tool descriptions go into the prompt, so a hostile server is a direct injection channel. Supply chain — installing a community server runs someone else's code with my credentials. And the confused deputy problem, where the server acts with its own permissions rather than the user's, so a user reaches data they could not reach directly. So: pinned reviewed servers, least privilege, per-user authorisation, argument validation in code, and full logging.",
      numbers: "No number applies. Track attempted-call refusals as the operational signal — a rising count means something is probing.",
      wrong: "\"MCP is secure because it is a standard.\" A standard defines the shape of messages, not the trustworthiness of who sends them. This answer usually ends the security round.",
      follow: "How do you pass the end user's identity through to the server?"
    },

    {
      id: "mcp-04",
      q: "What is A2A and how does it relate to MCP?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["mcp", "a2a", "protocol", "multi-agent"],
      why: "A distinction question. Getting it right shows you track the space rather than one product.",
      simple:
        "They sit at different layers and are complementary rather than competing.\n\n" +
        "MCP connects an agent to its tools and data. It is vertical — the agent reaching down to capabilities it uses.\n\n" +
        "A2A, agent-to-agent, is about agents built by different teams or different vendors talking to each other. It is horizontal — one agent delegating to another as a peer, without either one knowing the other's internals. An agent publishes what it can do, and another agent can hand it a task and receive a result.\n\n" +
        "The practical framing: MCP is how your agent uses a database. A2A is how your agent asks another team's agent to run a workflow it does not own.\n\n" +
        "The honest position for an interview: MCP is widely adopted and stable enough to build on. A2A is earlier, and inside one organisation you may not need it — a plain internal API is often sufficient. Say that rather than presenting both as settled.",
      points: [
        "MCP — agent to tools and data. Vertical.",
        "A2A — agent to agent, across teams or vendors. Horizontal.",
        "They compose: an agent uses MCP for tools and A2A to delegate.",
        "MCP is broadly adopted. A2A is earlier and moving faster.",
        "Inside one organisation, a plain internal API often does the job."
      ],
      say: "Different layers. MCP connects an agent down to its tools and data. A2A is agents built by different teams or vendors talking to each other as peers, delegating tasks without knowing each other's internals. So MCP is how my agent uses a database, A2A is how it asks another team's agent to run a workflow it does not own. MCP is settled enough to build on; A2A is earlier.",
      numbers: "No number applies.",
      wrong: "\"A2A is the successor to MCP.\" They solve different problems and compose. This is the mistake the question is designed to catch.",
      follow: "Two agents from different teams disagree on a result. Who resolves it?"
    },

    {
      id: "mcp-05",
      q: "You are building an MCP server for your team. What do you get right?",
      round: ["tech2"],
      level: "5-10",
      tags: ["mcp", "design", "tools", "security"],
      why: "A design question. It reveals whether you have built one or read about them.",
      simple:
        "Most of it is the tool design discipline from topic 07, applied at the server boundary, plus the things a shared server adds.\n\n" +
        "Tools: one job each, a name that says what it does, a description that says when to use it and when not to, and typed constrained parameters. Remember the description is prompt text going into someone else's context — write it for a model.\n\n" +
        "Returns: small and summarised. A tool that dumps a full payload will consume the client's context in a few calls, and the client is not yours to fix.\n\n" +
        "Errors as instructions: what was wrong and what to try instead, never a stack trace.\n\n" +
        "Security: read and write tools separated, arguments validated in code, the end user's identity carried through so authorisation is per-user, and least-privilege credentials.\n\n" +
        "And because it is shared: version it, because consumers you do not know will depend on it; log every call with the caller's identity; and rate-limit, because one badly-behaved agent loop should not take down the system behind it.",
      points: [
        "One job per tool; descriptions written for a model, not a developer.",
        "Small summarised returns — you are spending someone else's context.",
        "Errors phrased as what to do next.",
        "Read and write separated; arguments validated in code.",
        "Carry user identity through; authorise per user, least privilege.",
        "Version it — unknown consumers will depend on it.",
        "Rate-limit per caller. One runaway loop must not take the system down."
      ],
      say: "Tool discipline first: one job each, descriptions written for a model saying when to use and when not to, typed parameters, and small summarised returns because I am spending someone else's context. Errors phrased as what to try next. Security: read and write separated, arguments validated in code, user identity carried through for per-user authorisation. And because it is shared — versioning, per-caller logging and rate limits.",
      numbers: "Keep tool results under roughly 500–1000 tokens. Rate-limit per caller, because an agent loop can generate far more calls per minute than a human client ever would.",
      wrong: "\"I'd expose our existing REST endpoints as MCP tools.\" A one-to-one mapping gives the model forty developer-shaped tools it cannot choose between.",
      follow: "A consumer needs a breaking change to a tool. How do you ship it?"
    },

    {
      id: "mcp-06",
      q: "Should we adopt MCP? Make the case to me.",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["mcp", "judgement", "adoption", "architecture"],
      why: "A judgement question with no correct answer — the reasoning is the whole mark.",
      simple:
        "It depends on how many integrations and how many consuming applications you have, and the honest answer names the condition.\n\n" +
        "It pays when several applications need the same tools, when different teams build agents that all need shared internal systems, or when you want to consume third-party servers rather than write those integrations. In that shape you write each integration once and every client gets it.\n\n" +
        "It does not pay for one application with three tools that you own end to end. There the protocol is overhead — a server to run, monitor, secure and version, for something a direct function call already does.\n\n" +
        "The migration path that is easy to defend: keep tool logic in plain functions, and expose them through MCP as a thin layer. Then adoption is reversible, and the decision does not hold your business logic hostage.\n\n" +
        "And whichever way you argue, name the security work as part of the cost. Adopting the protocol without the review, isolation and per-user authorisation is not adoption, it is exposure.",
      points: [
        "Pays with many tools, many consuming applications, or third-party servers.",
        "Overhead for one application with a handful of owned tools.",
        "Keep logic in plain functions; expose via MCP as a thin layer, so it stays reversible.",
        "Count the security work — review, isolation, per-user auth — as part of the cost.",
        "A pilot on one non-sensitive server is a cheap way to decide."
      ],
      say: "It depends on the shape. It pays when several applications need the same tools, when different teams all need shared internal systems, or when we want to consume third-party servers. It is overhead for one application with three tools we own. So I would keep tool logic in plain functions and expose it through MCP as a thin reversible layer, and I would count the security work — review, isolation, per-user auth — as part of the cost.",
      numbers: "No number applies. The reasoning and the named condition are what score.",
      wrong: "\"Yes, it's the industry standard now.\" Adoption is not a reason on its own, and it skips the cost side that the question is really asking about.",
      follow: "Pilot it on what, specifically?"
    }
  ]
};
