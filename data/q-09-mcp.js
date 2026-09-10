/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["09-mcp"] = {
  "lede": "MCP and A2A now appear in agent-platform roles across regions. For 2026 interviews, know both the stable tool boundary and the July 2026 MCP changes: a stateless protocol core, per-request capabilities, modern routing and caching, Multi Round-Trip Requests, and first-class extensions such as Tasks and MCP Apps.",
  "grounding": "MCP specification revision 2026-07-28 + current A2A specification + public JDs naming these protocols",
  "evening": [
    "mcp-01",
    "mcp-03",
    "mcp-09",
    "mcp-05",
    "mcp-06"
  ],
  "cards": [
    {
      "id": "mcp-01",
      "q": "What is MCP and what problem does it solve?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "mcp",
        "basics",
        "protocol"
      ],
      "why": "Currency. Whether your knowledge extends to what shipped in the last year.",
      "simple": "MCP stands for Model Context Protocol. It is an open protocol that gives AI applications a standard way to discover and use tools, resources and reusable prompts exposed by another process or service.\n\nWithout that boundary, every host builds custom glue for every integration. With MCP, the server describes what it offers in a common format and the client in the AI application uses the same protocol regardless of who built the server.\n\nIn the 2026-07-28 revision, the protocol core is stateless. A request carries the protocol and client information it needs, and a client can optionally use server/discover when it wants server capabilities up front. Local integrations still commonly use stdio, while remote servers use Streamable HTTP.\n\nMCP is not an agent framework and it is not a security layer. The application still owns model behaviour, permissions, validation, approvals and user experience.",
      "points": [
        "Open protocol for tools, resources and prompts used by AI applications.",
        "Standard client/server boundary reduces one-off integration glue.",
        "The 2026-07-28 core is stateless; server/discover is optional capability discovery.",
        "stdio is common locally; Streamable HTTP is the main remote transport.",
        "MCP standardises interoperability, not tool choice, permissions or safety."
      ],
      "say": "MCP is an open protocol that standardises how AI applications discover and use tools, resources and prompts. The 2026-07-28 core is stateless, so each request carries the information it needs and server discovery is optional. Local integrations commonly use stdio and remote ones Streamable HTTP. I treat MCP as an interoperability boundary, not an agent or security framework: permissions, validation, approvals and tool-selection logic still belong to the application.",
      "numbers": "No number applies. This is an integration-architecture answer.",
      "wrong": "Describing MCP as one vendor's tool feature, or assuming the protocol itself decides which tool to call and makes that call safe.",
      "follow": "So what stops a malicious MCP server from doing damage?"
    },
    {
      "id": "mcp-02",
      "q": "How is MCP different from just calling an API?",
      "round": [
        "tech1"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "architecture",
        "tools"
      ],
      "why": "The obvious follow-up, and a vague answer here undoes the previous one.",
      "simple": "You can always call an API directly. MCP becomes useful when you want a standard, discoverable interface between many AI hosts and many integrations.\n\nWith a direct integration, the application usually knows the endpoint, request shape and response shape in code. With MCP, the client can list the server's tools, resources or prompts in a common format, so the host does not need a custom adapter for every server.\n\nThat does not mean a new server tool magically appears in a model prompt. The host still decides which capabilities to expose, when to refresh or cache the catalog, and what the user is allowed to use.\n\nFor one service and one application that you control, a normal function or API call is often simpler. MCP pays off when reuse and interoperability are worth the extra protocol and security work.",
      "points": [
        "Direct API: application-specific integration; MCP: standard discoverable boundary.",
        "The host can list capabilities in a uniform model-friendly shape.",
        "The host still controls exposure, caching, permissions and refresh behaviour.",
        "MCP is overhead for a single tightly owned integration.",
        "It pays when several hosts, teams or third-party servers need the same boundary."
      ],
      "say": "A direct API call is usually application-specific: my code knows the endpoint and request shape. MCP gives the host a standard way to discover and call capabilities across different servers, which reduces custom adapters when many applications or teams share integrations. The host still decides which tools to expose and what the user may do. For one service I own end to end, I would often keep the direct API because it is simpler.",
      "numbers": "No number applies. The payoff scales with the number of tools and consuming applications.",
      "wrong": "\"It's just a wrapper around APIs.\" It misses runtime discovery, which is the property that changes how systems are built.",
      "follow": "When would you not bother with MCP?"
    },
    {
      "id": "mcp-03",
      "q": "What are the security risks of MCP?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "security",
        "guardrails",
        "supply-chain"
      ],
      "why": "The question that matters at any regulated employer, and where candidates who only read the happy path stop.",
      "simple": "MCP makes integrations easy to connect, so I treat every server as a new trust boundary.\n\nThe first risk is the server itself: it may run code or reach sensitive systems. I review what I deploy, pin versions, isolate it, and give it the smallest set of permissions it needs.\n\nThe second risk is model influence. Tool descriptions and returned content are untrusted input. They can contain prompt injection, so the model is never the final authority on access. Arguments, tenant boundaries, spend limits and write permissions are checked in code before an action runs.\n\nFor remote servers, authentication and authorization must also be correct. Tokens should be intended for that server, short-lived where practical, and not passed through to unrelated downstream services. Modern MCP authorization guidance also hardens issuer validation and moves new clients toward metadata documents rather than relying on older dynamic registration patterns.\n\nFinally, I log sensitive calls with the user, tool, validated arguments, decision and outcome so incidents can be investigated.",
      "points": [
        "Treat every server as a trust boundary and supply-chain dependency.",
        "Least privilege, isolation and reviewed/pinned deployments.",
        "Tool text is untrusted input; enforce permissions and validation in code.",
        "Use per-user authorisation where needed, with short-lived audience-bound tokens.",
        "Do not pass unrelated downstream tokens through the MCP server.",
        "Audit sensitive tool calls end to end."
      ],
      "say": "I treat every MCP server as a trust boundary. I review and pin what we deploy, isolate it and use least privilege. Tool descriptions and returned content are untrusted model input, so permissions, tenant checks and argument validation stay in code. Remote credentials must be intended for that server and must not be casually passed through to downstream services. Sensitive calls are logged with the user, tool, validated arguments and outcome for audit.",
      "numbers": "No number applies. Track attempted-call refusals as the operational signal - a rising count means something is probing.",
      "wrong": "Saying MCP is secure because it is a standard. A protocol defines message behaviour; it does not make an unknown server, credential or tool action trustworthy.",
      "follow": "How do you pass the end user's identity through to the server?"
    },
    {
      "id": "mcp-04",
      "q": "What is A2A and how does it relate to MCP?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "a2a",
        "protocol",
        "multi-agent"
      ],
      "why": "A distinction question. Getting it right shows you track the space rather than one product.",
      "simple": "MCP and A2A solve different boundaries, so they can be used together.\n\nMCP is mainly an agent or AI application reaching down to tools, resources and prompts. A2A, or Agent2Agent, is for one agent or agent service working with another as a peer. The remote agent can publish an Agent Card describing its capabilities, accept a task, send updates, and return results or artifacts without exposing its internal implementation.\n\nA2A 1.0 is now a stable protocol family rather than an early experiment, and implementations can support common web or RPC bindings such as HTTP/JSON, JSON-RPC or gRPC. Adoption will still vary by company and platform, which matters more than the version number in a design decision.\n\nInside one tightly controlled system, a normal internal API may still be simpler. I use A2A when independent agents need a standard discovery, task and interoperability contract; I use MCP when the boundary is tools and context.",
      "points": [
        "MCP: AI application to tools, resources and prompts.",
        "A2A: agent service to agent service as peers.",
        "A2A uses capability discovery and task-oriented interaction.",
        "A2A 1.0 is stable; real-world adoption still varies.",
        "A plain internal API can still be the simpler choice inside one system."
      ],
      "say": "They sit at different boundaries. MCP connects an AI application to tools, resources and prompts. A2A connects independent agent services to each other as peers, with capability discovery and task-oriented interaction. A2A 1.0 is now stable, although adoption still varies by platform and company. I would not add either protocol just for fashion: inside one controlled service a normal API may be simpler, while standards pay off when interoperability across teams or products is the real requirement.",
      "numbers": "No number applies.",
      "wrong": "Calling A2A an immature idea that should not be built on at all. The protocol has reached 1.0; the real question now is whether interoperability justifies it in your system.",
      "follow": "Two agents from different teams disagree on a result. Who resolves it?"
    },
    {
      "id": "mcp-05",
      "q": "You are building an MCP server for your team. What do you get right?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "design",
        "tools",
        "security"
      ],
      "why": "A design question. It reveals whether you have built one or read about them.",
      "simple": "Most of it is the tool design discipline from topic 07, applied at the server boundary, plus the things a shared server adds.\n\nTools: one job each, a name that says what it does, a description that says when to use it and when not to, and typed constrained parameters. Remember the description is prompt text going into someone else's context - write it for a model.\n\nReturns: small and summarised. A tool that dumps a full payload will consume the client's context in a few calls, and the client is not yours to fix.\n\nErrors as instructions: what was wrong and what to try instead, never a stack trace.\n\nSecurity: read and write tools separated, arguments validated in code, the end user's identity carried through so authorisation is per-user, and least-privilege credentials.\n\nAnd because it is shared: version it, because consumers you do not know will depend on it; log every call with the caller's identity; and rate-limit, because one badly-behaved agent loop should not take down the system behind it.",
      "points": [
        "One job per tool; descriptions written for a model, not a developer.",
        "Small summarised returns - you are spending someone else's context.",
        "Errors phrased as what to do next.",
        "Read and write separated; arguments validated in code.",
        "Carry user identity through; authorise per user, least privilege.",
        "Version it - unknown consumers will depend on it.",
        "Rate-limit per caller. One runaway loop must not take the system down."
      ],
      "say": "Tool discipline first: one job each, descriptions written for a model saying when to use and when not to, typed parameters, and small summarised returns because I am spending someone else's context. Errors phrased as what to try next. Security: read and write separated, arguments validated in code, user identity carried through for per-user authorisation. And because it is shared - versioning, per-caller logging and rate limits.",
      "numbers": "Keep tool results under roughly 500–1000 tokens. Rate-limit per caller, because an agent loop can generate far more calls per minute than a human client ever would.",
      "wrong": "\"I'd expose our existing REST endpoints as MCP tools.\" A one-to-one mapping gives the model forty developer-shaped tools it cannot choose between.",
      "follow": "A consumer needs a breaking change to a tool. How do you ship it?"
    },
    {
      "id": "mcp-06",
      "q": "Should we adopt MCP? Make the case to me.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "judgement",
        "adoption",
        "architecture"
      ],
      "why": "A judgement question with no correct answer - the reasoning is the whole mark.",
      "simple": "It depends on how many integrations and how many consuming applications you have, and the honest answer names the condition.\n\nIt pays when several applications need the same tools, when different teams build agents that all need shared internal systems, or when you want to consume third-party servers rather than write those integrations. In that shape you write each integration once and every client gets it.\n\nIt does not pay for one application with three tools that you own end to end. There the protocol is overhead - a server to run, monitor, secure and version, for something a direct function call already does.\n\nThe migration path that is easy to defend: keep tool logic in plain functions, and expose them through MCP as a thin layer. Then adoption is reversible, and the decision does not hold your business logic hostage.\n\nAnd whichever way you argue, name the security work as part of the cost. Adopting the protocol without the review, isolation and per-user authorisation is not adoption, it is exposure.",
      "points": [
        "Pays with many tools, many consuming applications, or third-party servers.",
        "Overhead for one application with a handful of owned tools.",
        "Keep logic in plain functions; expose via MCP as a thin layer, so it stays reversible.",
        "Count the security work - review, isolation, per-user auth - as part of the cost.",
        "A pilot on one non-sensitive server is a cheap way to decide."
      ],
      "say": "It depends on the shape. It pays when several applications need the same tools, when different teams all need shared internal systems, or when we want to consume third-party servers. It is overhead for one application with three tools we own. So I would keep tool logic in plain functions and expose it through MCP as a thin reversible layer, and I would count the security work - review, isolation, per-user auth - as part of the cost.",
      "numbers": "No number applies. The reasoning and the named condition are what score.",
      "wrong": "\"Yes, it's the industry standard now.\" Adoption is not a reason on its own, and it skips the cost side that the question is really asking about.",
      "follow": "Pilot it on what, specifically?"
    },
    {
      "id": "mcp-07",
      "q": "Tools, resources and prompts - what is the actual difference, and who controls each?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "protocol",
        "basics",
        "architecture"
      ],
      "why": "The most common MCP question after 'what is it'. The control model is the part candidates get wrong.",
      "simple": "Three primitives, and the distinction that matters is who decides they get used.\n\nTools are model-controlled. The model sees the tool list and chooses to call one. These are actions - search the ticket system, create a record, run a query. Because the model decides, tools are where the risk lives, and where descriptions and schemas have to be precise.\n\nResources are application-controlled. They are data the server exposes - a file, a database row, a document - identified by URI. The model does not decide to fetch a resource; the host application does, and puts it into context. Think of them as readable content rather than actions.\n\nPrompts are user-controlled. They are templates the server offers that the user explicitly invokes, usually surfacing in the client as a slash command or a menu item. The model does not pick these either.\n\nSaying 'model-controlled, application-controlled, user-controlled' is the sentence that gets the mark, because it shows you understand MCP as a permission model and not just a list of features.\n\nThe practical consequence: if an operation has side effects or costs money, it is a tool and needs a schema, validation and an approval path. If it is just content the app already knows it wants, make it a resource - that keeps it out of the model's decision space entirely, which is both cheaper and safer. Overusing tools for things that should be resources is the common design error, and it shows up as tool-list bloat that degrades selection accuracy.",
      "points": [
        "Tools: model-controlled actions. The model chooses to call them.",
        "Resources: application-controlled data, addressed by URI. The host decides.",
        "Prompts: user-controlled templates, invoked explicitly, often as slash commands.",
        "The three-word framing - model, application, user controlled - is what is being marked.",
        "Side effects or cost means it is a tool, with schema, validation and approval.",
        "Content the app already knows it wants should be a resource, not a tool.",
        "Tool-list bloat degrades selection accuracy - do not make everything a tool."
      ],
      "say": "Three primitives separated by who controls them. Tools are model-controlled actions, so that is where the risk sits and where schemas must be precise. Resources are application-controlled data addressed by URI - the host decides to fetch them, not the model. Prompts are user-controlled templates the user invokes explicitly. The practical rule is that anything with side effects is a tool, and anything the app already knows it wants should be a resource.",
      "numbers": "Tool descriptions and schemas are sent on every request. A bloated tool list costs tokens continuously and measurably worsens tool selection.",
      "wrong": "Describing all three as 'ways to give the model data'. It misses the control model, which is the entire point of the distinction.",
      "follow": "Your server exposes forty tools and the model keeps choosing badly. What do you change?"
    },
    {
      "id": "mcp-08",
      "q": "You connect five MCP servers and the agent's accuracy drops. Why?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "tools",
        "cost",
        "context",
        "debugging"
      ],
      "why": "The realistic failure of MCP adoption at scale, and it catches people who have only connected one server to a demo.",
      "simple": "The problem appears when the host eagerly exposes a very large tool catalog to the model on every turn. Tool names, descriptions and schemas consume context, cost tokens, and make selection harder when many tools overlap.\n\nI do not assume MCP requires that behaviour. The host can curate tools by product or user role, load or search tool definitions only when they are relevant, or route the request to the right server before exposing a smaller set. Some platforms also support deferred or searchable tool catalogs, which is useful when the surface is large.\n\nThen I improve the tool definitions themselves. Names should be distinct, descriptions should say when to use and when not to use a tool, and similar actions should not differ only by tiny wording.\n\nI measure selection accuracy, extra context tokens and latency. The goal is not the smallest tool list; it is the smallest relevant list that still lets the agent do the job.",
      "points": [
        "Large eagerly-exposed tool catalogs consume context and reduce selection accuracy.",
        "MCP does not require every tool to be injected on every turn.",
        "Curate by product or role, route first, or load/search tools on demand.",
        "Use distinct names and descriptions that include when not to use a tool.",
        "Measure tool-selection accuracy, added tokens and latency."
      ],
      "say": "I only get this problem if the host eagerly exposes a huge tool catalog on every turn. That wastes context and turns selection into a difficult classification problem when tools overlap. I curate by product and user role, route to the relevant server first, or load and search tool definitions on demand when the platform supports it. Then I make names and descriptions unambiguous and measure selection accuracy, added context tokens and latency rather than guessing.",
      "numbers": "A large catalog can consume thousands of tokens before the user asks anything, but the exact cost depends on schema size. Measure the serialized tool payload instead of quoting a universal token number.",
      "wrong": "Saying the protocol forces every connected tool into every prompt. Tool exposure is a host/runtime design choice, and large catalogs should be filtered or loaded on demand.",
      "follow": "Your router picks the wrong server on a genuinely ambiguous question. What is the fallback?"
    },
    {
      "id": "mcp-09",
      "q": "What changed in MCP 2026-07-28, and why does it matter in production?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "2026",
        "protocol",
        "architecture",
        "production"
      ],
      "why": "The main MCP currency check in 2026. It shows whether you understand the protocol as it runs today rather than the older session-based version.",
      "simple": "The biggest change is that the MCP core became stateless. The old initialize/initialized handshake and protocol-level session id are gone for the 2026-07-28 revision. Each request carries its protocol version, client identity and capabilities, so ordinary load balancing is much easier.\n\nIf a client wants to learn the server's capabilities first, it can call server/discover, but it does not have to. Streamable HTTP requests also carry method and tool names in headers, which lets gateways route, meter and authorize without parsing the whole JSON body.\n\nList responses can be cached, which matters when tool catalogs are large and when stable ordering helps prompt caches. Multi Round-Trip Requests let a tool ask for user input during a call without keeping a bidirectional session open.\n\nThe release also formalised extensions. Tasks moved to an official extension, MCP Apps is an official UI extension, and older features such as Roots, Sampling, Logging and the legacy HTTP+SSE transport entered deprecation. In production, the headline is simpler horizontal scaling and a cleaner path for optional capabilities.",
      "points": [
        "Stateless core: no initialize/initialized handshake or MCP session id in the 2026-07-28 revision.",
        "Per-request protocol/client/capability metadata; server/discover is optional.",
        "Mcp-Method and Mcp-Name headers make HTTP routing and policy enforcement easier.",
        "List responses are cacheable and ordered deterministically.",
        "MRTR supports mid-call input without an always-open bidirectional stream.",
        "Extensions are first-class; Tasks and MCP Apps are important examples.",
        "Roots, Sampling, Logging and legacy HTTP+SSE are deprecated for new implementations."
      ],
      "say": "The 2026-07-28 release made MCP stateless at the protocol layer: no initialize handshake or session id, and each request carries the client and capability information it needs. It also added optional server discovery, header-based routing, cacheable lists and Multi Round-Trip Requests for mid-call input. Extensions became first-class, with Tasks and MCP Apps as key examples. Operationally, the big win is simpler horizontal scaling and cleaner gateway control.",
      "numbers": "The release defines a minimum twelve-month deprecation window for deprecated protocol features. Do not hard-code a migration date; negotiate the protocol revision your client and server actually support.",
      "wrong": "Describing current MCP as requiring a long-lived protocol session and initialize handshake for every modern remote server. That describes the older revision, not 2026-07-28.",
      "follow": "If the protocol is stateless, how would a shopping or browser tool keep application state across calls?"
    },
    {
      "id": "mcp-10",
      "q": "What are MCP Tasks and MCP Apps, and when would you use them?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "mcp",
        "extensions",
        "tasks",
        "mcp-apps",
        "ui"
      ],
      "why": "Extensions are now part of the production MCP story, and experienced candidates should know which problem each one solves.",
      "simple": "They are optional MCP extensions that solve two different problems.\n\nTasks are for work that may not finish inside one request. A server can return a task handle instead of the final tool result, and the client can later get the status, update or cancel the task and retrieve the result. I use this for long-running jobs such as a large export, research run or batch operation. The server still needs real durable job state; the extension is the protocol contract, not the queue itself.\n\nMCP Apps are for interactions that are awkward as plain text. A tool can declare an HTML UI resource, and a compatible host renders it in a sandboxed iframe. That fits dashboards, forms, visualisations and review flows where clicking or editing is better than several chat turns.\n\nBecause both are extensions, support is negotiated and hosts may differ. I keep the core tool useful without assuming every client supports every extension.",
      "points": [
        "Tasks: durable, long-running tool work represented by a task handle and later status/result retrieval.",
        "The server still owns the real queue, idempotency and durable execution.",
        "MCP Apps: interactive HTML UI for tools, rendered by compatible hosts in a sandbox.",
        "Use Apps for forms, dashboards, visual review and other UI-heavy interactions.",
        "Extensions are optional and negotiated; design a sensible fallback."
      ],
      "say": "Tasks and MCP Apps solve different problems. Tasks let a server turn a long-running tool call into a durable task handle that the client can check, update or cancel later; I use that for batch or research jobs. MCP Apps let tools provide interactive HTML interfaces such as forms or dashboards inside compatible hosts. Both are optional extensions, so I negotiate support and keep a fallback instead of assuming every client implements them.",
      "numbers": "No universal duration makes a call a Task. Use it when the work can outlive a normal request or needs durable progress, cancellation or later result retrieval.",
      "wrong": "Treating Tasks as the background worker itself, or MCP Apps as unrestricted web pages. Tasks still need durable backend execution, and Apps are rendered through a host-controlled sandbox and permission path.",
      "follow": "Your task takes twenty minutes and the worker restarts after ten. What must survive outside the MCP connection?"
    }
  ]
};
