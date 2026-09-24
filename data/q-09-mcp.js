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
      "quick": [
        "MCP is an open standard for connecting AI apps to tools.",
        "It replaces custom glue code for every integration.",
        "The tool side is the server, the app is the client.",
        "Write one server, and any MCP-aware app can use it.",
        "It is not a security layer, the app still checks permissions."
      ],
      "simple": "MCP stands for Model Context Protocol. It is an open standard that lets an AI application find and use tools, data and prompt templates offered by another program, all in one common format. The problem it solves is integration glue, because without it ten apps and ten systems can mean a hundred one-off connectors.\n\nWith MCP, a team writes one MCP server for a system once, and any MCP-aware app, called the client, can connect to it. For example, one server for a ticket system can serve a chat assistant, an IDE and an internal agent. Local servers talk over stdio and remote ones over Streamable HTTP. But MCP isn't an agent framework or a security layer, so the application still decides which tools the model sees and asks for approval before risky actions.",
      "points": [
        "Open protocol for tools, resources and prompts used by AI applications.",
        "Standard client/server boundary reduces one-off integration glue.",
        "The 2026-07-28 core is stateless: no handshake or session; each request carries its own version and capabilities.",
        "stdio is common locally; Streamable HTTP is the standard remote transport.",
        "MCP standardises interoperability, not tool choice, permissions or safety."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "MCP layers from the host application down through the client, the transport and the server to the real system behind it.",
        "top": "user and model",
        "layers": [
          {
            "label": "Host application",
            "note": "chooses tools, checks permissions",
            "accent": "warn"
          },
          {
            "label": "MCP client",
            "note": "one standard plug"
          },
          {
            "label": "Transport",
            "note": "stdio local, Streamable HTTP remote"
          },
          {
            "label": "MCP server",
            "note": "tools, resources, prompts",
            "accent": "accent"
          },
          {
            "label": "Your system",
            "note": "e.g. the ticket system"
          }
        ],
        "caption": "**USB-C for AI integrations**: write one server and any MCP-aware app can use it. MCP standardises the plug, not safety - the host still decides and approves."
      },
      "say": "MCP, the Model Context Protocol, is an open standard that lets AI applications find and use tools, data and prompt templates from other programs in one common format. Without it, every AI app writes custom glue for every integration. With it, a team writes one MCP server for, say, their ticket system, and any MCP-aware chat assistant, IDE or agent can connect. The app is the client and the program offering the tools is the server, a bit like USB-C for AI integrations. Local servers usually talk over standard input and output, and remote ones over Streamable HTTP. Since the 2026-07-28 revision the core is stateless, so each request carries everything the server needs and there's no handshake or session to maintain. What juniors miss is what MCP isn't. It's not an agent framework or a security layer, so the application still decides which tools the model sees, checks permissions and asks for approval before risky actions.",
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
      "quick": [
        "A direct API is one custom connection per service.",
        "MCP lets any app list any server's tools the same way.",
        "The app still decides what to expose and who may use it.",
        "It pays off when many apps share the same tools.",
        "For one app and one service, call the API directly."
      ],
      "simple": "You can always call an API directly, so the real question is when MCP adds something. With a direct integration, your application knows the endpoint and the request and response shapes in code, so it is one custom connection per service. With MCP, the client can list any server's tools in a common, model-friendly format, so the host doesn't need a bespoke adapter for every server.\n\nThe payoff comes with reuse. For example, if three teams' agents all need the ticket system, one MCP server serves all of them instead of three separate integrations. But for one service and one application you control end to end, a normal API call is often simpler, because MCP adds a server to deploy, secure and version. Either way, keeping the tool logic in plain functions makes wrapping them as a server cheap later.",
      "points": [
        "Direct API: application-specific integration; MCP: standard discoverable boundary.",
        "The host can list capabilities in a uniform model-friendly shape.",
        "The host still controls exposure, caching, permissions and refresh behaviour.",
        "MCP is overhead for a single tightly owned integration.",
        "It pays when several hosts, teams or third-party servers need the same boundary."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Calling an API directly versus going through MCP, compared by how the integration is known, discovery, when it fits and the cost.",
        "aspects": [
          "Interface known",
          "Discovery",
          "Best for",
          "Cost"
        ],
        "columns": [
          {
            "label": "Direct API call",
            "note": "custom glue",
            "cells": [
              "Hard-coded in the app",
              "None, you wrote it",
              "One app, one service",
              "Simplest to run"
            ]
          },
          {
            "label": "MCP",
            "note": "standard boundary",
            "accent": "accent",
            "cells": [
              "Listed by the server",
              "Tools, resources, prompts listed",
              "Many hosts, many integrations",
              "Protocol and security work"
            ]
          }
        ],
        "caption": "MCP pays off when **reuse and interoperability** are worth the extra protocol. The host still decides which listed capabilities the model ever sees."
      },
      "say": "A direct API is one custom connection per service, while MCP gives many AI hosts one standard, discoverable way to reach many integrations. With a direct call, my code hard-wires the endpoint, the request shape and the response shape for that one service. With MCP, the host can list any server's tools, resources or prompts in a common format, so it doesn't need a bespoke adapter for each. Nothing magically lands in the model's prompt, though. The host still decides what to expose, when to refresh or cache the catalogue, and what the user is allowed to do. The payoff comes with reuse. If three teams' agents all need the ticket system, one MCP server serves all of them. For one service and one app I own end to end, I'd just call the API, because MCP adds a server to deploy, secure and version. I keep tool logic in plain functions either way, so wrapping it later is cheap.",
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
      "quick": [
        "The difference is who controls each one.",
        "The model chooses to call tools, like creating a ticket.",
        "The app decides when to load resources, like files.",
        "The user picks prompts on purpose, often as slash commands.",
        "Anything with side effects or cost should be a tool."
      ],
      "simple": "MCP servers can offer tools, resources and prompts, and the real difference is who is in control. Tools are model-controlled, resources are application-controlled and prompts are user-controlled.\n\nTools are actions, like search tickets or create a record, and the model decides to call one, so they carry the risk and need precise descriptions and schemas. Resources are data, like a file or a document named by a URI, and the host application decides when to put them into context. Prompts are templates the user picks on purpose, often as a slash command.\n\nSo anything with side effects should be a tool, with validation and an approval path, while content the app already knows it needs should be a resource. For example, a company style guide should be a resource, while \"create ticket\" must be a tool. Making everything a tool bloats the list and makes selection worse.",
      "points": [
        "Tools: model-controlled actions. The model chooses to call them.",
        "Resources: application-controlled data, addressed by URI. The host decides.",
        "Prompts: user-controlled templates, invoked explicitly, often as slash commands.",
        "The three-word framing - model, application, user controlled - is what is being marked.",
        "Side effects or cost means it is a tool, with schema, validation and approval.",
        "Content the app already knows it wants should be a resource, not a tool.",
        "Tool-list bloat degrades selection accuracy - do not make everything a tool."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "MCP tools, resources and prompts compared by who controls them, what they are, an example and where the risk sits.",
        "aspects": [
          "Controlled by",
          "What it is",
          "Example",
          "Watch out"
        ],
        "columns": [
          {
            "label": "Tools",
            "note": "actions",
            "accent": "warn",
            "cells": [
              "The model",
              "Actions with side effects",
              "Create a ticket",
              "Schema, validation, approval"
            ]
          },
          {
            "label": "Resources",
            "note": "data by URI",
            "accent": "accent",
            "cells": [
              "The application",
              "Data the host loads",
              "A file or record",
              "Keeps it out of model choices"
            ]
          },
          {
            "label": "Prompts",
            "note": "templates",
            "cells": [
              "The user",
              "Templates picked on purpose",
              "A slash command",
              "Invoked explicitly"
            ]
          }
        ],
        "caption": "Say it as a control model: **model-controlled, application-controlled, user-controlled**. Side effects mean a tool; content the app already needs is a resource."
      },
      "say": "The difference is who's in control. Tools are model-controlled, resources are application-controlled and prompts are user-controlled. With tools, the model reads the list and decides to call one, like search tickets or create a record. Because the model decides, tools carry the risk, so their descriptions and input schemas have to be precise. Resources are data the server exposes, like a file or a database row, each named by a URI, and the host application decides when to fetch one into context. Prompts are templates the user picks on purpose, often as a slash command. The practical rule follows from that. Anything with side effects or cost is a tool, with a schema, validation and an approval path. Content the app already knows it needs should be a resource, which keeps it out of the model's choices and is cheaper and safer. Making everything a tool bloats the list and makes selection worse.",
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
      "quick": [
        "Both carry the same messages, just in different ways.",
        "With stdio, the app starts the server on the same machine.",
        "With stdio, logs must go to the error stream, not output.",
        "Streamable HTTP suits remote servers shared by many users.",
        "The older HTTP plus SSE method is deprecated."
      ],
      "simple": "A transport is how MCP messages travel between client and server, and the JSON is the same either way. There are two standard transports, stdio for local servers and Streamable HTTP for remote ones.\n\nWith stdio, the client starts the server as a child process on the same machine and they exchange messages over standard input and output. It is simple and fast, and the server reads credentials from environment variables. The server must write only protocol messages to stdout, so logs go to stderr. For example, a single stray print statement will corrupt the stream and break the connection.\n\nStreamable HTTP is for remote, shared servers, where every message is a POST to one endpoint and the server replies with JSON or a stream. Remote servers use OAuth. The rule of thumb is stdio for one developer's machine, and Streamable HTTP when many users share a server.",
      "points": [
        "**stdio**: client launches the server as a subprocess; newline-delimited JSON-RPC over stdin/stdout.",
        "stdio: only MCP messages on stdout, logs on stderr; credentials come from the environment, not OAuth.",
        "**Streamable HTTP**: one endpoint, every message a POST, reply as JSON or a request-scoped SSE stream.",
        "Streamable HTTP servers must validate the `Origin` header, and local ones should bind to 127.0.0.1, to block DNS-rebinding attacks.",
        "2026-07-28: no `Mcp-Session-Id` and no GET stream; requests carry `Mcp-Method` and `Mcp-Name` headers for gateways.",
        "Legacy HTTP+SSE is deprecated - migrate to Streamable HTTP."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "The two MCP transports, stdio and Streamable HTTP, compared by where they run, how messages travel, how they authenticate and the common gotcha.",
        "aspects": [
          "Runs",
          "Messages",
          "Auth",
          "Gotcha"
        ],
        "columns": [
          {
            "label": "stdio",
            "note": "local",
            "accent": "accent",
            "cells": [
              "Child process, same machine",
              "JSON lines on stdin/stdout",
              "Credentials from environment",
              "Logs to stderr, never stdout"
            ]
          },
          {
            "label": "Streamable HTTP",
            "note": "remote, shared",
            "accent": "warn",
            "cells": [
              "Shared server, many users",
              "POST to one endpoint",
              "OAuth",
              "Validate the Origin header"
            ]
          }
        ],
        "caption": "Same JSON messages, different delivery. **stdio for one developer's machine, Streamable HTTP when many share a server**. Legacy HTTP+SSE is deprecated."
      },
      "say": "There are two standard transports, stdio for local servers and Streamable HTTP for remote ones, and the JSON messages are identical in both. With stdio, the client starts the server as a child process on the same machine and they exchange one JSON message per line over standard input and output. It's simple, needs no network or login, and the server reads credentials from environment variables. The rule that catches people is that stdout carries only protocol messages. A stray print statement corrupts the stream, so logs go to stderr. Streamable HTTP exposes one endpoint where every message is a POST, and the server replies with plain JSON or streams progress as Server-Sent Events. Since 2026-07-28 there's no session, so any instance behind a load balancer can take any request, and remote servers use OAuth. The old HTTP plus SSE transport is deprecated. So stdio suits one developer's machine, and Streamable HTTP suits a server many users share.",
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
      "quick": [
        "Give each tool one job with a description written for models.",
        "Return small summaries, since you use another team's space.",
        "Write errors that say what to try next.",
        "Separate read and write, and check permissions per user.",
        "Limit calls per caller, version it, and log every call."
      ],
      "simple": "Building an MCP server for your team is mostly good tool design applied at the server boundary. Each tool gets one job, a clear name and a description written for a model, saying when to use it and when not to, with typed, constrained parameters. A common mistake is mapping forty REST endpoints one to one instead of designing a few clear tools.\n\nReturns should stay small, around a few hundred to a thousand tokens, because a full payload eats the client's context. Errors should say what to try instead, never show a stack trace. Read and write tools are separated, arguments are validated in code and authorisation is per user.\n\nBecause the server is shared, you also version it, log every call and rate-limit per caller. For example, one agent stuck retrying a search tool should not be able to take down the ticket system behind it.",
      "points": [
        "One job per tool; descriptions written for a model, not a developer.",
        "Small summarised returns - you are spending someone else's context.",
        "Errors phrased as what to do next.",
        "Read and write separated; arguments validated in code.",
        "Carry user identity through; authorise per user, least privilege.",
        "Version it - unknown consumers will depend on it.",
        "Rate-limit per caller. One runaway loop must not take the system down."
      ],
      "say": "Mostly good tool design, plus the discipline a shared server adds. Each tool gets one job, a clear name, and a description that says when to use it and when not to, written for a model, because it becomes prompt text in someone else's context. Parameters are typed and constrained. Returns stay small and summarised, within a budget of a few hundred to about a thousand tokens with pagination beyond it, since I'm spending another team's context window. Errors say what went wrong and what to try next, never a stack trace. On security, read and write tools are separate, arguments are validated in code, and the end user's identity flows through so authorisation is per user with least-privilege credentials. Because it's shared, I version it, log every call with the caller, and rate-limit per caller, since one runaway agent loop fires far more calls than a human would. What I avoid is mapping our REST endpoints one to one into forty tools.",
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
      "quick": [
        "Treat every MCP server as a new trust boundary.",
        "Review, pin versions, isolate and minimise each server's permissions.",
        "Tool text and results can hide instructions for the model.",
        "Keep permission checks in code, never with the model.",
        "Reject access keys meant for others, and log sensitive calls."
      ],
      "simple": "MCP makes integrations very easy to connect, which is exactly why every server should be treated as a new trust boundary and a supply-chain dependency.\n\nThe first risk is the server itself, since it may run code or reach sensitive systems, so you review it, pin versions, isolate it and give it the least permissions it needs. The second is influence over the model, because tool descriptions and results are untrusted input that can carry prompt injection. For example, a tool result could tell the model to send customer data to an outside address. So arguments, tenant boundaries and write permissions are checked in code, never left to the model.\n\nThe third is authorisation on remote servers. The server must reject tokens issued for anyone else and never pass the user's token on. Finally, you log sensitive calls so incidents can be investigated.",
      "points": [
        "Treat every server as a trust boundary and supply-chain dependency.",
        "Least privilege, isolation and reviewed/pinned deployments.",
        "Tool text is untrusted input; enforce permissions and validation in code.",
        "Use per-user authorisation where needed, with short-lived audience-bound tokens.",
        "Do not pass unrelated downstream tokens through the MCP server.",
        "Audit sensitive tool calls end to end."
      ],
      "say": "MCP makes integrations very easy to connect, so every server is a new trust boundary and a supply-chain dependency. The first risk is the server itself, which may run code or reach sensitive systems. I review what we deploy, pin versions, isolate it and give it the smallest set of permissions it needs. The second risk is influence over the model. Tool descriptions and results are untrusted input, and a tool result could hide instructions telling the model to send data somewhere else. So permissions, tenant checks, spend limits and argument validation stay in code, and the model is never the final authority on access. The third is authorisation on remote servers, which use OAuth. Each server must reject tokens issued for anyone else and never pass the user's token on to other services. Finally, I log sensitive calls with the user, tool, validated arguments, decision and outcome, because an incident you can't reconstruct is one you can't fix.",
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
      "quick": [
        "A2A lets one agent service work with another as a peer.",
        "MCP connects an app down to tools, A2A connects agents sideways.",
        "Each agent publishes a card saying what it can do.",
        "It hands over tasks without exposing inner workings.",
        "Inside one system, a plain internal API may be simpler."
      ],
      "simple": "MCP and A2A solve different boundaries, so they can be used together. MCP is an agent or AI application reaching down to its tools, resources and prompts. A2A, which stands for Agent2Agent, is for one agent working with another as a peer. The remote agent publishes an Agent Card describing what it can do, and a caller can hand it a task and get back results without seeing how it works inside.\n\nFor example, a claims agent passing a case to another team's fraud agent is A2A, while the fraud agent reaching its own database is MCP. A2A started at Google in 2025 and reached version 1.0 in March 2026, but real-world adoption still varies. So A2A makes sense when independent agents need a standard task contract, and MCP when the boundary is tools and context.",
      "points": [
        "MCP: AI application to tools, resources and prompts.",
        "A2A: agent service to agent service as peers.",
        "A2A uses Agent Cards for capability discovery and task-oriented interaction.",
        "A2A 1.0 (March 2026) is stable and Linux Foundation governed; real-world adoption still varies.",
        "A plain internal API can still be the simpler choice inside one system."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "A2A sits between peer agents, while MCP sits between an agent and its tools, resources and prompts.",
        "top": "peer agent",
        "layers": [
          {
            "label": "Remote agent",
            "note": "publishes an Agent Card"
          },
          {
            "label": "A2A",
            "note": "tasks, updates, results between peers",
            "accent": "warn"
          },
          {
            "label": "Your agent",
            "accent": "accent"
          },
          {
            "label": "MCP",
            "note": "reach down to capabilities",
            "accent": "accent"
          },
          {
            "label": "Tools, resources, prompts"
          }
        ],
        "caption": "Different boundaries, so they combine: **A2A is agent to agent, MCP is agent to tools and context**. Inside one system, a plain internal API may still be simpler."
      },
      "say": "A2A, or Agent2Agent, is a protocol for agents working with each other as peers, while MCP connects an application down to its tools. So they cover different boundaries and fit together. A remote A2A agent publishes an Agent Card describing what it can do and how to reach it. A caller hands it a task, gets updates, and receives results or artifacts without seeing how it works inside. Picture a claims agent passing a case to another team's fraud agent. That hand-off is A2A, while the fraud agent reaching its own database is MCP. A2A started at Google and reached a stable 1.0 in March 2026, and it's governed under the Linux Foundation, like MCP. Adoption still varies by platform, and that matters more than the version number. Inside one tightly controlled system, a plain internal API is often simpler. I reach for A2A only when independent agents need a standard discovery and task contract.",
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
      "quick": [
        "The protocol became stateless, with no start-up handshake or session.",
        "Any server copy behind a load balancer can answer any request.",
        "Headers name the method and tool, so gateways route easily.",
        "Tool lists come in a stable order with cache hints.",
        "Tasks and Apps became optional extras, and old features are deprecated."
      ],
      "simple": "The biggest change in the 2026-07-28 revision is that MCP became stateless. Before, a client and server did a start-up handshake and then kept a session with an ID. Now every request carries its own protocol version and capabilities, so any server instance behind an ordinary load balancer can answer it. That matters in production because scaling an MCP server becomes ordinary web scaling.\n\nOther changes help operations. Requests carry the method and tool name in headers, so a gateway can route and rate-limit calls without reading the body. Servers also no longer send their own requests to the client. For example, a booking tool that needs the user to confirm a date returns an \"input required\" result instead of holding a connection open. Several older features are deprecated with a twelve-month window, so you negotiate the revision both sides support.",
      "points": [
        "Stateless core: no initialize/initialized handshake or MCP session id in the 2026-07-28 revision.",
        "Per-request protocol/client/capability metadata; servers must implement server/discover, clients may skip it.",
        "Mcp-Method and Mcp-Name headers make HTTP routing and policy enforcement easier.",
        "List responses carry TTL/scope cache hints; tools should be returned in a deterministic order.",
        "Multi Round-Trip Requests replace server-initiated requests; change notifications move to `subscriptions/listen`; SSE stream resumption is removed.",
        "Extensions are first-class; Tasks and MCP Apps are important examples.",
        "Roots, Sampling, Logging, legacy HTTP+SSE and Dynamic Client Registration (in favour of Client ID Metadata Documents) are deprecated for new implementations."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "MCP before and after the 2026-07-28 revision, compared by start-up, session, scaling, gateways and how a server asks for input.",
        "aspects": [
          "Start-up",
          "Session",
          "Scaling",
          "Gateways",
          "Needs user input"
        ],
        "columns": [
          {
            "label": "Before",
            "note": "stateful",
            "accent": "muted",
            "cells": [
              "initialize handshake",
              "Session id kept",
              "Sticky to one instance",
              "Must read JSON body",
              "Server sends own request"
            ]
          },
          {
            "label": "2026-07-28",
            "note": "stateless core",
            "accent": "accent",
            "cells": [
              "None; server/discover optional",
              "Each request self-contained",
              "Any instance, plain load balancer",
              "Mcp-Method and Mcp-Name headers",
              "Returns input required, client retries"
            ]
          }
        ],
        "caption": "The big change: **every request carries its own version and capabilities**, so any server instance can answer any request. That makes scaling much simpler."
      },
      "say": "MCP went stateless, and that matters because scaling a server becomes ordinary web scaling. Earlier revisions opened with an initialize handshake and then held a session with an ID. In 2026-07-28 both are gone. Every request carries its own protocol version, client details and capabilities, so any instance behind a plain load balancer can answer any request. Clients can call server/discover to learn capabilities first, but they don't have to. HTTP requests now name the method and tool in headers, so a gateway can route, rate-limit and meter calls without parsing the body. List responses carry cache hints, and tools come back in a stable order, which helps prompt caching. A tool needing user input mid-call returns an input-required result and the client retries, which replaces server-initiated requests. Tasks and MCP Apps became optional extensions, while Sampling, Roots, Logging and the old HTTP plus SSE transport are deprecated, with at least a twelve-month window.",
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
      "quick": [
        "Remote servers use OAuth 2.1, the standard login protocol.",
        "A separate identity service issues the access keys.",
        "The user logs in, and the key works for one server only.",
        "The server rejects keys meant for others and never forwards them.",
        "Keep permissions minimal, while local servers just read stored secrets."
      ],
      "simple": "Remote MCP servers use OAuth 2.1, the standard web login-and-token protocol. The MCP server is the thing being protected, and a separate authorisation server, often your existing identity provider, logs the user in and issues tokens.\n\nThe client first calls the server without a token and gets a 401 reply, which points to the server's authorisation server. The user logs in there, using PKCE so a stolen login code can't be reused, and the client gets a short-lived token for this exact server, which it sends on every request.\n\nThe key rule is that the server accepts only tokens issued for itself. For example, a token issued for the ticket server is useless on the payroll server. The server also never passes the user's token on, and clients request only the scopes they need. Local stdio servers skip all this and read credentials from the environment.",
      "points": [
        "Remote (HTTP) servers: OAuth 2.1. stdio servers: credentials from the environment.",
        "The MCP server is a resource server and must publish Protected Resource Metadata (RFC 9728) naming its authorization server.",
        "The client uses PKCE and the `resource` parameter (RFC 8707), so the token is bound to this one server.",
        "The server validates the audience and rejects tokens meant for anyone else. No token passthrough.",
        "Least-privilege scopes, with step-up after a 403 `insufficient_scope`.",
        "Registration: Client ID Metadata Documents preferred, pre-registration allowed, Dynamic Client Registration deprecated.",
        "Clients validate the `iss` value in the authorization response to block mix-up attacks."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Remote MCP authorization: call without a token, get a 401 pointing to metadata, log the user in with PKCE, get a token bound to this server, then send it on every request.",
        "lanes": [
          {
            "label": "Call, no token",
            "note": "server replies 401"
          },
          {
            "label": "Read metadata",
            "note": "names the auth server"
          },
          {
            "label": "User logs in",
            "note": "OAuth 2.1 with PKCE"
          },
          {
            "label": "Token for this server",
            "note": "resource parameter",
            "accent": "accent"
          },
          {
            "label": "Bearer on each call",
            "note": "server checks audience",
            "accent": "accent"
          },
          {
            "label": "Never pass it on",
            "note": "own token downstream",
            "accent": "bad"
          }
        ],
        "caption": "The MCP server is a **resource server that accepts only tokens issued for itself**. Local stdio servers skip all this and read credentials from the environment."
      },
      "say": "Remote MCP servers use OAuth 2.1. The MCP server is the protected resource, and a separate authorization server, often our existing identity provider, logs the user in and issues tokens. The flow is short. The client calls without a token and gets a 401, which points to a small metadata document naming the authorization server. The user logs in there using PKCE, which stops a stolen login code being reused, and the client asks for a token bound to this exact server. It then sends that token as a bearer header on every request. Three rules stop the real attacks. The server accepts only tokens issued for itself, so a ticket-server token is useless anywhere else. It never forwards the user's token downstream, and gets its own token instead. And scopes stay minimal, stepping up only when a 403 asks for more. For registration, Client ID Metadata Documents are now preferred. Local stdio servers skip all this and read credentials from the environment.",
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
      "quick": [
        "The app likely sends every tool from all five servers.",
        "That fills space, costs money, and confuses similar tools.",
        "MCP does not require this, so fix it in the app.",
        "Filter tools by role, route first, or load on demand.",
        "Make similar tools clearly distinct, then measure accuracy."
      ],
      "simple": "When you connect five MCP servers and accuracy drops, the likely cause is that the host exposes every tool from all five servers to the model on every turn. All those names, descriptions and schemas cost tokens before the user has asked anything, and selection gets harder when tools overlap.\n\nMCP doesn't require that, so it is a host problem you can fix. The host can curate tools by user role, route the request to the right server first, or load tool definitions only when relevant. Then you improve the definitions themselves. For example, if the ticket server and the wiki server each have a tool called search, the model can't tell them apart, so they need distinct names and descriptions.\n\nThe goal is not the smallest possible tool list, but the smallest relevant list that still lets the agent do the job.",
      "points": [
        "Large eagerly-exposed tool catalogs consume context and reduce selection accuracy.",
        "MCP does not require every tool to be injected on every turn.",
        "Curate by product or role, route first, or load/search tools on demand.",
        "Use distinct names and descriptions that include when not to use a tool.",
        "Measure tool-selection accuracy, added tokens and latency."
      ],
      "say": "Most likely the host is sending every tool from all five servers to the model on every turn. All those names, descriptions and schemas eat context and cost tokens before the user has asked anything, and selection gets harder when tools overlap. MCP doesn't require that behaviour, so it's a host problem to fix. I'd curate tools by product or user role, route the request to the right server first, or search and load tool definitions only when they're relevant. Some platforms support deferred or searchable tool catalogues, which helps when the surface is large. Then I tighten the definitions themselves. If two servers each have a search tool, their names and descriptions need to be clearly distinct and say when not to use each one, rather than differing by a word. Then I measure selection accuracy, added tokens and latency. The goal isn't the smallest tool list, it's the smallest relevant list that still gets the job done.",
      "numbers": "A large catalog can consume thousands of tokens before the user asks anything, but the exact cost depends on schema size. Measure the serialized tool payload instead of quoting a universal token number.",
      "wrong": "Saying the protocol forces every connected tool into every prompt. Tool exposure is a host/runtime design choice, and large catalogs should be filtered or loaded on demand.",
      "follow": "Your router picks the wrong server on a genuinely ambiguous question. What is the fallback?",
      "followAnswer": "I fall back to asking or widening, never to a confident guess. When the router's confidence is low or two servers score closely, I load the relevant tools from both, so the model can see both options and choose with more context. If the question is still ambiguous, the agent asks the user a short clarifying question, like whether they mean a billing ticket or a support ticket. I log those cases, because repeated ambiguity usually means the server boundaries or descriptions overlap."
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
      "quick": [
        "It depends on how many apps need the same integrations.",
        "It pays when many teams or outside servers share tools.",
        "For one app with a few owned tools, it is overhead.",
        "Keep logic in plain functions with MCP as a thin layer.",
        "Count security work as cost, and pilot on one safe server."
      ],
      "simple": "Whether to adopt MCP depends on how many integrations and consuming applications you have. It pays off when several applications or teams need the same tools, or when you want to use third-party servers rather than write those integrations yourself. For example, if five teams are building agents that all need the ticket system, you write that integration once as an MCP server and every agent uses it.\n\nIt doesn't pay for one application with three tools you own end to end, because it adds a server to run, secure and version for something a function call already does. The safe path is to keep tool logic in plain functions and expose them through MCP as a thin layer, so adoption stays reversible. Security work is part of the cost, so a sensible start is a pilot on one non-sensitive server.",
      "points": [
        "Pays with many tools, many consuming applications, or third-party servers.",
        "Overhead for one application with a handful of owned tools.",
        "Keep logic in plain functions; expose via MCP as a thin layer, so it stays reversible.",
        "Count the security work - review, isolation, per-user auth - as part of the cost.",
        "A pilot on one non-sensitive server is a cheap way to decide."
      ],
      "say": "It depends on how many applications need the same integrations, and I'd make the case around that condition. MCP pays off when several apps need the same tools, when different teams build agents that share internal systems, or when we want to consume third-party servers rather than write those integrations ourselves. If five teams are building agents that all need the ticket system, we write that integration once and every agent gets it. It doesn't pay for one app with three tools we own end to end, where it's just another server to run, monitor, secure and version. Whichever way we go, I'd keep the tool logic in plain functions and expose it through MCP as a thin layer, so the decision stays reversible. The cost people skip is security. Review, isolation and per-user authorisation are part of adoption, not extras. So my recommendation would be a pilot on one non-sensitive server, then a decision on evidence.",
      "numbers": "No number applies. The reasoning and the named condition are what score.",
      "wrong": "\"Yes, it's the industry standard now.\" Adoption is not a reason on its own, and it skips the cost side that the question is really asking about.",
      "follow": "Pilot it on what, specifically?",
      "followAnswer": "I would pilot on a read-only internal system that several teams already want, like the ticket or knowledge base search. Read-only keeps the risk low, and multiple consumers tests the real claim, which is reuse. I would build a small server with three or four tools, connect two different hosts, say an IDE assistant and an internal agent, and run it for a few weeks. Then I compare integration effort, latency, selection accuracy and the security review cost against direct calls."
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
      "quick": [
        "Both are optional extras solving different problems.",
        "Tasks handle work too long for one request.",
        "The client checks status later, cancels, or fetches the result.",
        "Apps let a tool show a form or dashboard screen.",
        "Support varies, so keep a plain fallback working."
      ],
      "simple": "MCP Tasks and MCP Apps are two optional MCP extensions that solve different problems.\n\nTasks are for work that may not finish inside one request. Instead of the final result, the server returns a task handle, and the client can later check the status, cancel it or retrieve the result. For example, a large data export or a batch operation fits this well. But the extension only defines the protocol, so the server still needs a real durable queue and job state behind it.\n\nMCP Apps are for interactions that are awkward as plain text. A tool can declare an HTML UI that a compatible host renders in a sandboxed iframe, which suits dashboards, forms and review flows. Because both are extensions, support varies between hosts, so the core tool should still work on its own for clients that support neither.",
      "points": [
        "Tasks: durable, long-running tool work represented by a task handle and later status/result retrieval.",
        "The server still owns the real queue, idempotency and durable execution.",
        "MCP Apps: interactive HTML UI for tools, rendered by compatible hosts in a sandbox.",
        "Use Apps for forms, dashboards, visual review and other UI-heavy interactions.",
        "Extensions are optional and negotiated; design a sensible fallback."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Two optional MCP extensions compared: Tasks for long-running work returned as a handle, and MCP Apps for interactive HTML UI rendered by the host.",
        "aspects": [
          "Solves",
          "Server returns",
          "Client or host",
          "Use for"
        ],
        "columns": [
          {
            "label": "Tasks",
            "note": "long-running work",
            "accent": "accent",
            "cells": [
              "Work longer than one request",
              "A task handle",
              "Polls status, cancels, gets result",
              "Big export, batch, research run"
            ]
          },
          {
            "label": "MCP Apps",
            "note": "interactive UI",
            "accent": "accent",
            "cells": [
              "Awkward as plain text",
              "An HTML UI resource",
              "Renders it in sandboxed iframe",
              "Forms, dashboards, visual review"
            ]
          }
        ],
        "caption": "Both are **optional, negotiated extensions**, and hosts differ. Tasks is the contract, not the queue. Keep the core tool useful for a client that supports neither."
      },
      "say": "They're two optional MCP extensions for two different problems. Tasks handle work that outlives a request, and Apps give tools an interactive screen. With Tasks, the server returns a task handle instead of the final result, and the client comes back later to check status, cancel, or fetch the result. A large data export or a batch research run fits that well. The trap is thinking the extension is the job system. It only defines the contract, so the server still needs a durable queue, idempotency and real job state behind it. MCP Apps cover interactions that are clumsy as plain text. A tool declares an HTML interface, like a form, a dashboard or a review screen, and a compatible host renders it in a sandboxed iframe. Because both are extensions, support is negotiated and hosts differ. So I always keep the core tool useful on its own, with a plain fallback for clients that don't support either.",
      "numbers": "No universal duration makes a call a Task. Use it when the work can outlive a normal request or needs durable progress, cancellation or later result retrieval.",
      "wrong": "Treating Tasks as the background worker itself, or MCP Apps as unrestricted web pages. Tasks still need durable backend execution, and Apps are rendered through a host-controlled sandbox and permission path.",
      "follow": "Your task takes twenty minutes and the worker restarts after ten. What must survive outside the MCP connection?",
      "followAnswer": "Everything about the job must live in durable storage, not in the worker or the connection. That means the task ID, its status, the input, progress checkpoints and any partial results, kept in a queue or database. When the worker restarts, another picks the job up from the last checkpoint rather than starting again, and steps are idempotent so repeating one is safe. The client just keeps polling the same task handle, and the final result stays stored until fetched or expired."
    }
  ]
};
