/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["09-mcp"] = {
  "lede": "MCP and A2A now appear in agent-platform roles across regions. Know the stable basics first - what MCP standardises, its three primitives, its two transports and its security model. Then know the July 2026 revision, which made the protocol core stateless and moved features such as Tasks and MCP Apps into optional extensions. New to MCP? The questions are ordered for a first read: High priority first, from what MCP is through primitives, transports, server design, security and A2A, then Medium, then Low.",
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
      "priority": "high",
      "tags": [
        "mcp",
        "basics",
        "protocol"
      ],
      "why": "Currency. Whether you know how the protocol works today, not how it looked at launch.",
      "simple": "MCP stands for Model Context Protocol. It is an open standard that lets an AI application find and use tools, data and prompt templates offered by another program, in one common format.\n\nWithout it, every AI app writes custom glue code for every integration. With MCP, a team writes one MCP server for, say, their ticket system. Any MCP-aware app - a chat assistant, an IDE, an agent - can then connect to it. The app side is called the client; the program offering the tools is the server. It works like USB-C for AI integrations: one plug shape, many devices.\n\nMessages travel in two standard ways. For a local server, the app starts it as a child process and they talk over standard input and output (called stdio). For a remote server, they talk over HTTP (called Streamable HTTP).\n\nSince the 2026-07-28 revision, each request carries everything the server needs to handle it, so there is no start-up handshake or session to keep.\n\nWhat MCP is not: an agent framework or a security layer. The application still decides which tools the model sees, checks permissions, and asks for approval before risky actions.",
      "points": [
        "Open protocol for tools, resources and prompts used by AI applications.",
        "Standard client/server boundary reduces one-off integration glue.",
        "The 2026-07-28 core is stateless: no handshake or session; each request carries its own version and capabilities.",
        "stdio is common locally; Streamable HTTP is the standard remote transport.",
        "MCP standardises interoperability, not tool choice, permissions or safety."
      ],
      "say": "MCP is an open protocol that standardises how AI applications discover and use tools, resources and prompts. The 2026-07-28 core is stateless, so each request carries the information it needs and calling server discovery first is optional. Local integrations commonly use stdio and remote ones Streamable HTTP. I treat MCP as an interoperability boundary, not an agent or security framework: permissions, validation, approvals and tool-selection logic still belong to the application.",
      "numbers": "No number applies. This is an integration-architecture answer.",
      "wrong": "Describing MCP as one vendor's tool feature, or assuming the protocol itself decides which tool to call and makes that call safe.",
      "follow": "So what stops a malicious MCP server from doing damage?",
      "followAnswer": "Nothing in the protocol itself - that is the application's job. I only connect reviewed, pinned servers, run them isolated with least-privilege credentials, and treat their tool descriptions and outputs as untrusted text that may contain prompt injection. Permission and argument checks happen in our code, risky actions need human approval, and every call is logged so we can see what a server actually did."
    },
    {
      "id": "mcp-02",
      "q": "How is MCP different from just calling an API?",
      "round": [
        "tech1"
      ],
      "level": "5-10",
      "priority": "high",
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
      "wrong": "\"It's just a wrapper around APIs.\" It misses standard discovery across many hosts and servers, which is where the value is - and the follow-up will ask when that value is worth the extra protocol and security work.",
      "follow": "When would you not bother with MCP?",
      "followAnswer": "When one application uses a handful of tools that my team owns end to end. There a plain function or direct API call is simpler: no extra server to deploy, secure, version and monitor. I would also skip it on a hot path where the extra hop costs latency. I keep the tool logic in plain functions, so wrapping it in MCP later is cheap if a second consumer appears."
    },
    {
      "id": "mcp-07",
      "q": "Tools, resources and prompts - what is the actual difference, and who controls each?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "mcp",
        "protocol",
        "basics",
        "architecture"
      ],
      "why": "The most common MCP question after 'what is it'. The control model is the part candidates get wrong.",
      "simple": "**Short version: tools are actions the model chooses, resources are data the application chooses to load, and prompts are templates the user picks. The question is always who is in control.**\n\nTools are model-controlled. The model sees the tool list and decides to call one. These are actions: search tickets, create a record, run a query. Because the model decides, tools carry the risk, and their descriptions and input schemas must be precise.\n\nResources are application-controlled. They are data the server exposes - a file, a database row, a document - each named by a URI, which works like a web address. The host application, not the model, decides to fetch a resource and put it into context. Hosts differ in how they show resources, but the control sits with the application.\n\nPrompts are user-controlled. They are templates the server offers that the user picks on purpose, often as a slash command or menu item.\n\nSaying \"model-controlled, application-controlled, user-controlled\" is what gets the mark. It shows you see MCP as a control model, not a feature list.\n\nThe practical rule: anything with side effects or cost is a tool, with a schema, validation and an approval path. Content the app already knows it needs should be a resource. That keeps it out of the model's choices, which is cheaper and safer. Making everything a tool bloats the tool list and makes tool selection worse.",
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
      "numbers": "If the host sends every tool definition on every turn - a common default - a bloated tool list costs tokens continuously and tends to worsen tool selection. Measure the serialised tool payload on your own server.",
      "wrong": "Describing all three as 'ways to give the model data'. It misses the control model, which is the entire point of the distinction.",
      "follow": "Your server exposes forty tools and the model keeps choosing badly. What do you change?",
      "followAnswer": "First I look in traces at which tools get confused with each other. Then I merge overlapping tools, split the server by task so a host loads only the relevant set, and move read-only content the app already knows it needs into resources. I rewrite descriptions to say when to use and when not to use each tool, and measure selection accuracy on a fixed test set before and after."
    },
    {
      "id": "mcp-11",
      "q": "What are MCP's transports, and when do you use stdio or Streamable HTTP?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "mcp",
        "transports",
        "stdio",
        "streamable-http",
        "deployment"
      ],
      "why": "A common practical follow-up. It shows whether you have actually run a server locally and remotely.",
      "simple": "A transport is how MCP messages physically travel between client and server. The messages are the same JSON either way; only the delivery changes. There are two standard transports.\n\n**stdio** is for local servers. The client app starts the server as a child process on the same machine. They exchange messages over standard input and output, one JSON message per line. It is simple and fast, and needs no network or login; the server reads its credentials from environment variables. One rule catches people: the server must write only protocol messages to stdout. Logs go to stderr, or they corrupt the stream.\n\n**Streamable HTTP** is for remote, shared servers. The server exposes one HTTP endpoint, and every message is a POST. The server replies with plain JSON, or streams progress and then the result as Server-Sent Events (a simple one-way HTTP stream). Since the 2026-07-28 revision there is no session, so any server instance behind a load balancer can take any request. Remote servers use OAuth for authorization.\n\nThe older HTTP+SSE transport is deprecated, so use Streamable HTTP for anything new.\n\nRule of thumb: stdio for a tool on one developer's machine; Streamable HTTP when many users or apps share one server.",
      "points": [
        "**stdio**: client launches the server as a subprocess; newline-delimited JSON-RPC over stdin/stdout.",
        "stdio: only MCP messages on stdout, logs on stderr; credentials come from the environment, not OAuth.",
        "**Streamable HTTP**: one endpoint, every message a POST, reply as JSON or a request-scoped SSE stream.",
        "Streamable HTTP servers must validate the `Origin` header, and local ones should bind to 127.0.0.1, to block DNS-rebinding attacks.",
        "2026-07-28: no `Mcp-Session-Id` and no GET stream; requests carry `Mcp-Method` and `Mcp-Name` headers for gateways.",
        "Legacy HTTP+SSE is deprecated - migrate to Streamable HTTP."
      ],
      "say": "MCP has two standard transports carrying the same JSON-RPC messages. stdio is for local servers: the client launches the server as a subprocess and they talk over standard input and output, with logs on stderr and credentials from the environment. Streamable HTTP is for shared remote servers: one endpoint, every message a POST, replies as JSON or a stream, with OAuth for authorization. The old HTTP+SSE transport is deprecated.",
      "numbers": "No universal number. stdio adds no network hop, so its overhead is small. For Streamable HTTP, measure p95 latency per tool call through your gateway, because that hop is added to every agent step that calls a tool.",
      "wrong": "\"MCP uses WebSockets\" or \"remote MCP means SSE\". The standard remote transport is Streamable HTTP, the older HTTP+SSE transport is deprecated, and WebSockets is not a standard MCP transport.",
      "follow": "You want to share a stdio server you built with the whole company. What changes?",
      "followAnswer": "It stops being a local process and becomes a service. I would run it behind Streamable HTTP on shared infrastructure and add OAuth, so each user's own identity and permissions reach the downstream system instead of one shared environment credential. Then Origin validation, rate limits, per-caller logging and tool versioning. The tool logic barely changes; the transport, auth and operations are the real work."
    },
    {
      "id": "mcp-05",
      "q": "You are building an MCP server for your team. What do you get right?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
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
      "numbers": "Set an explicit result budget per tool - a few hundred to about a thousand tokens is a reasonable starting point - and paginate or summarise beyond it. Rate-limit per caller, because an agent loop can generate far more calls per minute than a human client ever would.",
      "wrong": "\"I'd expose our existing REST endpoints as MCP tools.\" A one-to-one mapping gives the model forty developer-shaped tools it cannot choose between.",
      "follow": "A consumer needs a breaking change to a tool. How do you ship it?",
      "followAnswer": "I do not change the existing tool in place. I add the new version alongside it - a new tool name or a versioned server endpoint - keep the old one working, and mark it deprecated in its description. Then I use per-caller logs to see who still calls the old one, tell those teams, and remove it only after usage drops to zero or the announced date passes."
    },
    {
      "id": "mcp-03",
      "q": "What are the security risks of MCP?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "mcp",
        "security",
        "guardrails",
        "supply-chain"
      ],
      "why": "The question that matters at any regulated employer, and where candidates who only read the happy path stop.",
      "simple": "MCP makes integrations easy to connect, so I treat every server as a new trust boundary.\n\nThe first risk is the server itself: it may run code or reach sensitive systems. I review what I deploy, pin versions, isolate it, and give it the smallest set of permissions it needs.\n\nThe second risk is model influence. Tool descriptions and returned content are untrusted input. They can contain prompt injection - hidden instructions aimed at the model - so the model is never the final authority on access. Arguments, tenant boundaries, spend limits and write permissions are checked in code before an action runs.\n\nFor remote servers, authorization must be done properly. MCP uses OAuth: the user logs in and the client gets an access token meant for that one server. The server must reject tokens meant for anyone else, and must never pass the user's token on to other services. The 2026-07-28 revision also tightens the login flow, for example by requiring clients to check which authorization server sent a response.\n\nFinally, I log sensitive calls with the user, tool, validated arguments, decision and outcome so incidents can be investigated.",
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
      "follow": "How do you pass the end user's identity through to the server?",
      "followAnswer": "Over Streamable HTTP, through OAuth. The user signs in, and the client gets an access token issued for that specific MCP server, sent as a bearer token on every request. The server validates it, maps it to the user and enforces per-user permissions. If the server calls another API, it gets its own token for that API - for example through token exchange - instead of forwarding the user's token."
    },
    {
      "id": "mcp-04",
      "q": "What is A2A and how does it relate to MCP?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "mcp",
        "a2a",
        "protocol",
        "multi-agent"
      ],
      "why": "A distinction question. Getting it right shows you track the space rather than one product.",
      "simple": "MCP and A2A solve different boundaries, so they can be used together.\n\nMCP is mainly an agent or AI application reaching down to tools, resources and prompts. A2A, or Agent2Agent, is for one agent or agent service working with another as a peer. The remote agent publishes an Agent Card - a description of what it can do and how to reach it. It can accept a task, send updates, and return results or artifacts without exposing how it works inside.\n\nA2A started at Google in 2025 and is now governed under the Linux Foundation. Its first stable version, 1.0, shipped in March 2026, with several bindings (JSON-RPC, gRPC and plain HTTP+JSON) and signed Agent Cards so a caller can verify who published one. In August 2026 it joined the Agentic AI Foundation, the same Linux Foundation home as MCP. Adoption still varies by company and platform, which matters more than the version number in a design decision.\n\nInside one tightly controlled system, a normal internal API may still be simpler. I use A2A when independent agents need a standard discovery, task and interoperability contract; I use MCP when the boundary is tools and context.",
      "points": [
        "MCP: AI application to tools, resources and prompts.",
        "A2A: agent service to agent service as peers.",
        "A2A uses Agent Cards for capability discovery and task-oriented interaction.",
        "A2A 1.0 (March 2026) is stable and Linux Foundation governed; real-world adoption still varies.",
        "A plain internal API can still be the simpler choice inside one system."
      ],
      "say": "They sit at different boundaries. MCP connects an AI application to tools, resources and prompts. A2A connects independent agent services to each other as peers, with capability discovery and task-oriented interaction. A2A 1.0 is now stable, although adoption still varies by platform and company. I would not add either protocol just for fashion: inside one controlled service a normal API may be simpler, while standards pay off when interoperability across teams or products is the real requirement.",
      "numbers": "No number applies.",
      "wrong": "Calling A2A an immature idea that should not be built on at all. The protocol has reached 1.0; the real question now is whether interoperability justifies it in your system.",
      "follow": "Two agents from different teams disagree on a result. Who resolves it?",
      "followAnswer": "Not the protocol - A2A carries tasks and results, it does not settle conflicts. The calling agent, or the workflow that owns the business outcome, decides. I would name that owner up front, require each agent to return evidence or a confidence signal with its result, and route real disagreements on high-stakes outcomes to a human reviewer rather than letting one agent silently override the other."
    },
    {
      "id": "mcp-09",
      "q": "What changed in MCP 2026-07-28, and why does it matter in production?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "mcp",
        "2026",
        "protocol",
        "architecture",
        "production"
      ],
      "why": "The main MCP currency check in 2026. It shows whether you understand the protocol as it runs today rather than the older session-based version.",
      "simple": "The biggest change is that MCP became stateless. Before, a client and server did a start-up handshake (`initialize`) and then kept a session with an id. In 2026-07-28 both are gone. Every request now carries its own protocol version, client details and capabilities. So any server instance behind an ordinary load balancer can answer any request, which makes scaling much simpler.\n\nIf a client wants to learn a server's capabilities first, it can call `server/discover`. Every server must support it, but clients do not have to call it.\n\nHTTP requests now carry the method and tool name in headers (`Mcp-Method`, `Mcp-Name`). A gateway can route, rate-limit and meter calls without reading the JSON body.\n\nList responses carry cache hints: how long to keep them, and whether shared caches may store them. Servers should also list tools in a stable order, which helps prompt caching.\n\nServers no longer send their own requests to the client. When a tool needs user input mid-call, it returns an \"input required\" result and the client retries with the answer. This is called Multi Round-Trip Requests.\n\nTasks and MCP Apps are now optional extensions. Roots, Sampling, Logging, the old HTTP+SSE transport and Dynamic Client Registration are deprecated.",
      "points": [
        "Stateless core: no initialize/initialized handshake or MCP session id in the 2026-07-28 revision.",
        "Per-request protocol/client/capability metadata; servers must implement server/discover, clients may skip it.",
        "Mcp-Method and Mcp-Name headers make HTTP routing and policy enforcement easier.",
        "List responses carry TTL/scope cache hints; tools should be returned in a deterministic order.",
        "Multi Round-Trip Requests replace server-initiated requests; change notifications move to `subscriptions/listen`; SSE stream resumption is removed.",
        "Extensions are first-class; Tasks and MCP Apps are important examples.",
        "Roots, Sampling, Logging, legacy HTTP+SSE and Dynamic Client Registration (in favour of Client ID Metadata Documents) are deprecated for new implementations."
      ],
      "say": "The 2026-07-28 release made MCP stateless at the protocol layer: no initialize handshake or session id, and each request carries the client and capability information it needs. It also added a server/discover call that clients may skip, header-based routing, cacheable lists and Multi Round-Trip Requests for mid-call input. Extensions became first-class, with Tasks and MCP Apps as key examples. Operationally, the big win is simpler horizontal scaling and cleaner gateway control.",
      "numbers": "The release defines a minimum twelve-month deprecation window for deprecated protocol features. Do not hard-code a migration date; negotiate the protocol revision your client and server actually support.",
      "wrong": "Describing current MCP as requiring a long-lived protocol session and initialize handshake for every modern remote server. That describes the older revision, not 2026-07-28.",
      "follow": "If the protocol is stateless, how would a shopping or browser tool keep application state across calls?",
      "followAnswer": "The server mints its own handle - a cart id or a browser session id - returns it from one tool call, and the model passes it back as an ordinary argument on the next call. The state lives in the server's own storage keyed by that handle, so any instance can serve the request. That is what the spec recommends in place of protocol sessions."
    },
    {
      "id": "mcp-12",
      "q": "How does authorization work for a remote MCP server?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "mcp",
        "security",
        "oauth",
        "authorization"
      ],
      "why": "Asked at any company exposing MCP servers beyond one laptop. It checks whether you know the standard flow and the token rules that stop real attacks.",
      "simple": "For remote servers over HTTP, MCP uses OAuth 2.1, the standard web login-and-token protocol. The MCP server is the resource server - the thing being protected. A separate authorization server, often your existing identity provider, logs the user in and issues tokens.\n\nThe flow is short. The client calls the server without a token and gets a 401 reply. That reply points to a small metadata document on the server naming its authorization server. The client sends the user there to log in, using PKCE - a check that stops a stolen login code from being reused. It asks for a token for this exact server, using a `resource` parameter. Then it sends that token as a bearer header on every request.\n\nThree rules matter most. The server accepts only tokens issued for itself. It never passes the user's token on to other services; it gets its own token for those. And clients request only the scopes they need, stepping up later if a 403 asks for more.\n\nHow does a client register with an authorization server it has never seen? The preferred way is now a Client ID Metadata Document: the client id is a URL pointing to a file that describes the client. Dynamic Client Registration is deprecated.\n\nLocal stdio servers skip all of this and read credentials from the environment.",
      "points": [
        "Remote (HTTP) servers: OAuth 2.1. stdio servers: credentials from the environment.",
        "The MCP server is a resource server and must publish Protected Resource Metadata (RFC 9728) naming its authorization server.",
        "The client uses PKCE and the `resource` parameter (RFC 8707), so the token is bound to this one server.",
        "The server validates the audience and rejects tokens meant for anyone else. No token passthrough.",
        "Least-privilege scopes, with step-up after a 403 `insufficient_scope`.",
        "Registration: Client ID Metadata Documents preferred, pre-registration allowed, Dynamic Client Registration deprecated.",
        "Clients validate the `iss` value in the authorization response to block mix-up attacks."
      ],
      "say": "Remote MCP servers use OAuth 2.1. The server is a resource server and publishes metadata naming its authorization server. After a 401, the client discovers that, sends the user to log in with PKCE, and requests a token bound to this server with the resource parameter. The server accepts only tokens issued for itself and never forwards them downstream. Scopes stay minimal, with step-up when needed. Local stdio servers use environment credentials instead.",
      "numbers": "No number applies. Keep access tokens short-lived and rely on refresh tokens rather than long-lived bearer tokens; set the exact lifetime with your identity team.",
      "wrong": "\"We put one API key in the server config and everyone shares it.\" Every user then acts with the same permissions, the audit log cannot say who did what, and one leaked key exposes everything.",
      "follow": "Your MCP server has to call Salesforce on the user's behalf. Which token does it use?",
      "followAnswer": "Not the token the client sent - that one is issued for my MCP server only, and forwarding it is token passthrough, which the spec forbids. The server gets its own Salesforce token for that user, either through a separate OAuth consent stored per user or through token exchange with our identity provider. Then Salesforce enforces that user's own permissions, and the audit trail stays correct."
    },
    {
      "id": "mcp-08",
      "q": "You connect five MCP servers and the agent's accuracy drops. Why?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
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
      "id": "mcp-06",
      "q": "Should we adopt MCP? Make the case to me.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
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
      "id": "mcp-10",
      "q": "What are MCP Tasks and MCP Apps, and when would you use them?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
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
