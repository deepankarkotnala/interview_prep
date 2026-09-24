/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["13-guardrails"] = {
  "lede": "At a bank, a healthcare payer or any regulated employer, this topic decides the offer. The panel usually includes someone whose job is to say no, and they are listening for one thing: whether your controls live in code or in a politely worded prompt. New to guardrails? The questions are ordered for a first read: every High priority card first, from the main risks and the OWASP list through prompt injection, output guardrails and PII, then Medium, then Low.",
  "grounding": "public regulated-industry job descriptions + OWASP guidance + regional privacy and sector requirements",
  "evening": [
    "gr-01",
    "gr-03",
    "gr-04",
    "gr-06",
    "gr-08"
  ],
  "cards": [
    {
      "id": "gr-01",
      "q": "What are the main security risks in an LLM application?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "guardrails",
        "security",
        "owasp"
      ],
      "why": "A structured answer here signals you have read the standard material rather than improvised.",
      "quick": [
        "Attackers steer the model, leak data, misuse tools, or run up bills.",
        "Hidden instructions can arrive from users or fetched documents.",
        "Search that skips permission checks leaks private data.",
        "Tools with too much power turn one trick into damage.",
        "Treat everything the model reads and writes as untrusted."
      ],
      "simple": "An LLM application has new kinds of security risk, because attackers can steer the model with plain text. The OWASP Top 10 for LLM Applications is the shared vocabulary for these risks.\n\nPrompt injection is at the top, where text the model reads carries instructions, either from the user or hidden in a retrieved document. Sensitive disclosure often comes from retrieval skipping a permission check. Improper output handling is when model output goes into SQL, a shell or a web page unchecked. For example, an analytics assistant writes a SQL query and the app runs it, so a crafted question could delete a table.\n\nThe framing matters more than the list. The model is not a trust boundary, so everything it reads is untrusted data and everything it produces is untrusted input to the next step.",
      "points": [
        "Prompt injection - direct from a user, indirect through a document you indexed.",
        "Sensitive disclosure - retrieval without permission checks; leaked system prompts or hidden context.",
        "Excessive agency - tools that can do more than the task needs.",
        "Improper output handling - model output into SQL, shell or HTML unvalidated.",
        "Supply chain - models, datasets, prompts and MCP servers, not just libraries.",
        "Unbounded consumption - cost and capacity abuse, including runaway agent loops.",
        "The model is not a trust boundary. Its input and its output are both untrusted.",
        "Full OWASP 2026 list with one control per entry: gr-09."
      ],
      "diagram": {
        "alt": "User input and retrieved documents both flow into the model as untrusted data; the model's output is checked in code before it reaches SQL, a shell or a tool.",
        "rows": [
          [
            {
              "id": "u",
              "label": "User input",
              "note": "direct injection",
              "accent": "bad"
            },
            {
              "id": "d",
              "label": "Retrieved docs",
              "note": "indirect injection",
              "accent": "bad"
            }
          ],
          [
            {
              "id": "m",
              "label": "Model",
              "note": "NOT a trust boundary"
            }
          ],
          [
            {
              "id": "c",
              "label": "Check in code",
              "note": "validate, least privilege",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "t",
              "label": "SQL, shell, tools",
              "note": "only checked output",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "u",
            "to": "m",
            "label": "untrusted"
          },
          {
            "from": "d",
            "to": "m",
            "label": "untrusted"
          },
          {
            "from": "m",
            "to": "c",
            "label": "untrusted output"
          },
          {
            "from": "c",
            "to": "t",
            "label": "pass"
          }
        ],
        "caption": "**The model is not a trust boundary.** Everything it reads is untrusted data, and everything it writes is untrusted input to the next step - so the checks live in your code."
      },
      "say": "Attackers can steer the model with text, get it to reveal data, make its tools do damage, or run up the bill. I use the OWASP Top 10 for LLM Applications as the shared vocabulary. Prompt injection tops it, where text the model reads carries instructions, either from the user or hidden in a retrieved document. Sensitive disclosure usually comes from retrieval skipping a permission check. Excessive agency means a tool can do far more than the task needs, so one bad instruction does real damage. Improper output handling is the old injection bug with a new source. Say an analytics assistant writes SQL and the app runs it unchecked. Then there's supply chain, covering models, datasets and MCP servers, and unbounded consumption from abuse or runaway loops. The framing matters more than the list, though. The model isn't a trust boundary, so everything it reads is untrusted data and everything it writes is untrusted input to the next step.",
      "numbers": "No number applies. What you track operationally is attempted-injection detections and blocked tool calls.",
      "wrong": "\"The main risk is hallucination.\" Misinformation is on the OWASP list, but it is not the adversarial risk - the follow-up about what an attacker can do needs injection, disclosure and excessive agency.",
      "follow": "Which of those would you fix first in a system you just inherited?",
      "followAnswer": "I start with what can do damage today. First, permissions: does retrieval enforce the user's access, and can any tool write, delete or send without confirmation? That is disclosure and excessive agency, where one injection becomes a real incident. Then output handling - is model output ever executed or rendered without escaping? Then budgets and rate limits. Prompt hardening comes last, because it is the weakest control."
    },
    {
      "id": "gr-10",
      "q": "Prompt injection versus jailbreak - what is the difference?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "guardrails",
        "injection",
        "jailbreak",
        "security",
        "basics"
      ],
      "why": "A quick definitions check that trips many candidates. It shows whether you know who the attacker is and what they are attacking.",
      "quick": [
        "Both make the model do something it should not.",
        "A jailbreak attacks the model's safety rules for forbidden content.",
        "Prompt injection hijacks your app's instructions through planted text.",
        "Injection can hide in fetched documents or emails.",
        "Safety filters stop jailbreaks, tight permissions contain injection."
      ],
      "simple": "A jailbreak and a prompt injection both make a model do something it shouldn't, but they attack different things. A jailbreak attacks the model's safety training. The user wants content the model was trained to refuse and uses tricks like role-play, hypotheticals or slow escalation to get it.\n\nPrompt injection attacks your application instead. Someone slips instructions into text the model will read, so it follows the attacker rather than you. Direct injection comes from the user, while indirect injection hides in a document, email or web page the app retrieves. For example, an email agent reads a message with a hidden line telling it to forward customer data, and the user never sees that line.\n\nThe techniques overlap, but the defences differ. For jailbreaks, you rely on the model's alignment plus safety classifiers. For injection, the real control is containment in code, meaning least privilege, confirmations and output validation, so a successful injection reaches very little.",
      "points": [
        "**Jailbreak** - target: the model's safety rules. Goal: forbidden content.",
        "**Prompt injection** - target: your application's instructions. Goal: hijack behaviour, data or tools.",
        "Direct injection comes from the user; indirect injection hides in retrieved content.",
        "Jailbreak tricks: role-play, hypotheticals, encoding, many-turn escalation.",
        "The techniques overlap - one attack can be both.",
        "Jailbreak defence: model alignment plus input and output safety classifiers.",
        "Injection defence: containment in code - least privilege, confirmation, output validation (gr-02)."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Jailbreak compared with prompt injection by target, usual attacker, goal and main defence.",
        "aspects": [
          "Target",
          "Usual attacker",
          "Goal",
          "Main defence"
        ],
        "columns": [
          {
            "label": "Jailbreak",
            "note": "break the model's rules",
            "accent": "warn",
            "cells": [
              "Model's safety training",
              "The user",
              "Forbidden content",
              "Alignment plus safety classifiers"
            ]
          },
          {
            "label": "Prompt injection",
            "note": "hijack your app",
            "accent": "bad",
            "cells": [
              "Your app's instructions",
              "User or planted document",
              "Data, tools, behaviour",
              "Containment in code"
            ]
          }
        ],
        "caption": "A jailbreak tries to **break the model's rules**; an injection tries to **take over your app's instructions**. One attack can be both, but injection is contained by least privilege, not filters."
      },
      "say": "The difference is what's being attacked. A jailbreak goes after the model's safety rules, while prompt injection goes after my application's instructions. In a jailbreak, the user wants content the model was trained to refuse, and uses role-play, hypotheticals, encoding or slow escalation over many turns to get it. The attacker is usually the user. Injection plants instructions in text the model will read, so it follows the attacker instead of me. Direct injection comes from the user. Indirect injection hides in a document, email or web page the app retrieves, and the victim is my system and my users. Take an email agent. A hidden line in an incoming message tells it to forward customer data, and the user never sees it. The techniques overlap, and one attack can be both, but the defences differ. Alignment plus safety classifiers handle jailbreaks. Injection needs containment in code, meaning least privilege, confirmations and output validation, so a successful attack reaches very little.",
      "numbers": "No number applies. Track the two separately: jailbreak attempts caught by the safety classifier, and injection-shaped content found in user inputs and retrieved documents.",
      "wrong": "\"They are the same thing.\" The follow-up is how you defend against each, and a single answer - a stronger system prompt - fails for both, and fails worst for indirect injection.",
      "follow": "Which one is more dangerous for an agent that can send emails?",
      "followAnswer": "Indirect prompt injection, clearly. A jailbreak mostly gets the user bad content for themselves. An injection hidden in an email or document the agent reads can make it send data to an attacker, on behalf of a user who never saw the attack. So I scope the email tool - allowed recipients, no attachments from private stores - and require the user to confirm every outgoing email."
    },
    {
      "id": "gr-09",
      "q": "Walk me through the OWASP Top 10 for LLM Applications.",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "guardrails",
        "owasp",
        "security",
        "standards"
      ],
      "why": "Asked by name in security-minded and regulated panels. The mark is knowing the current list and one concrete control per entry, not reciting ten titles.",
      "quick": [
        "A community list of top security risks in LLM apps.",
        "Hidden instructions and data leaks stay first and second.",
        "Tools with too much power jumped to third.",
        "Group them into what goes in, comes out, and acts.",
        "Give one fix for each, like narrow tools with approval."
      ],
      "simple": "The OWASP Top 10 for LLM Applications is a community-built list of the biggest security risks in apps that use language models. The current edition came out in August 2026, and many teams still quote the 2025 list, so it helps to know what moved. Prompt injection and sensitive information disclosure stay first and second, and excessive agency jumped from sixth to third because agents now take real actions.\n\nReciting ten names doesn't help, so group them. What goes in covers injection, poisoning, supply chain and the vector store. What comes out covers disclosure, hidden context, misinformation and output handling. What it can do covers excessive agency and unbounded consumption.\n\nThen give one control for each. For example, excessive agency is controlled with narrow tools, scoped credentials and human approval, and unbounded consumption with token budgets, rate limits and loop caps. Once your model calls tools and keeps memory, OWASP's separate Top 10 for Agentic Applications applies too.",
      "points": [
        "**LLM01 Prompt injection** - instructions hidden in text the model reads. Control: least privilege, confirm state changes.",
        "**LLM02 Sensitive information disclosure** - data the user should not see. Control: permission check before retrieval, output scanning.",
        "**LLM03 Excessive agency** - tools that can do more than the task. Control: narrow tools, scoped credentials, human approval.",
        "**LLM04 Supply chain** - untrusted models, packages, datasets, plugins. Control: pin versions, verify sources.",
        "**LLM05 Data and model poisoning** - bad data in training, fine-tuning or the corpus. Control: vet and track data sources.",
        "**LLM06 Unbounded consumption** - runaway cost or capacity abuse. Control: token budgets, rate limits, loop caps.",
        "**LLM07 Misinformation** - confident wrong answers. Control: grounding, citations, human review for high stakes.",
        "**LLM08 Hidden context exposure** - leaked system prompts or hidden context (was system prompt leakage). Control: no secrets in prompts.",
        "**LLM09 Vector and embedding weaknesses** - leaks or poisoning through the RAG store. Control: tenant isolation and access filters inside the search.",
        "**LLM10 Improper output handling** - output passed to SQL, shell or HTML unchecked. Control: treat output as untrusted input.",
        "Agents with tools and memory: also use the OWASP Top 10 for Agentic Applications."
      ],
      "say": "It's a community-built list of the biggest security risks in LLM apps, from the OWASP project behind the web Top 10. The 2026 edition is current, but many teams still quote 2025, so I know what moved. Prompt injection and sensitive information disclosure stay first and second. Excessive agency jumped from sixth to third, because agents now take real actions. The rest are supply chain, data and model poisoning, unbounded consumption, misinformation, hidden context exposure, which broadens the old system prompt leakage, vector and embedding weaknesses, and improper output handling at tenth. Reciting ten titles doesn't help, so I group them. What goes in covers injection, poisoning, supply chain and the vector store. What comes out covers disclosure, hidden context, misinformation and output handling. What it can do covers agency and consumption. Then I give one control each, like narrow tools, scoped credentials and human approval for excessive agency. Once there are tools and memory, OWASP's separate Agentic Top 10 applies too.",
      "numbers": "No number applies to your system. The 2026 edition was the first to weight the ranking partly by real incident data rather than only a practitioner vote. Operationally, track injection detections, blocked tool calls and permission-filtered retrievals.",
      "wrong": "Reciting the 2023 list - entries like insecure plugin design, overreliance and model theft - or naming ten titles with no control for any of them. It shows you read the list once, not that you use it to review a system.",
      "follow": "Which three would you check first in a RAG chatbot over internal documents?",
      "followAnswer": "Sensitive information disclosure first: does retrieval enforce the user's permissions, so nobody sees a document they could not open directly? Then prompt injection through indexed content, because anyone who can edit a wiki page can plant instructions. Then vector and embedding weaknesses - is the index isolated per tenant, with access filters applied inside the search rather than after it? Those three are where internal RAG systems actually leak."
    },
    {
      "id": "gr-02",
      "q": "Assume indirect prompt injection will sometimes succeed. How do you limit what it can reach?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "guardrails",
        "injection",
        "rag",
        "security"
      ],
      "why": "pr-06 covers injection basics and rag-52 the RAG risk list. This is the containment question - blast radius, least privilege and confirmation - which is what a security reviewer probes.",
      "quick": [
        "Attackers plant text in documents you will later search.",
        "It arrives the same way as real content, so blocking fails.",
        "Label fetched text as data, and scan documents on arrival.",
        "Give the model minimal permissions, so success reaches little.",
        "Confirm every action, check outputs, and log attempts."
      ],
      "simple": "Indirect prompt injection is when the attacker never contacts your system at all. Instead, they plant text in something you'll index, like a support ticket or a CV, and wait for retrieval to load it into your prompt. It arrives through the same channel as your legitimate content, so you can't block it at the door, and the defence has to assume injection will sometimes succeed.\n\nRetrieved content is delimited and labelled as data, and documents are scanned at ingestion, with suspicious ones quarantined. But the layer that actually contains the attack is least privilege. The model gets minimal permissions, any state change needs confirmation, and outputs that look like a URL, command or tool call are validated before anything acts on them.\n\nFor example, if a recruitment screener has read-only access and only returns a structured score, the worst an injected CV can do is get itself ranked unfairly high. Success just isn't worth much.",
      "points": [
        "The attacker plants content you will index. Same channel as legitimate data.",
        "Delimit retrieved content and label it as data.",
        "Scan at ingestion, not only at query time. Quarantine suspicious documents.",
        "Least privilege is the containing layer - make success worth little.",
        "Confirm every state change; validate outputs before acting on them.",
        "Log and alert on injection-shaped content. Detection is part of the control."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Layered defence against indirect prompt injection: delimit content, scan at ingestion, least privilege, confirm state changes, validate outputs, and log.",
        "top": "planted document is retrieved",
        "bottom": "worst case is worth little",
        "layers": [
          {
            "label": "Delimit as data",
            "note": "label it, not instructions"
          },
          {
            "label": "Scan at ingestion",
            "note": "quarantine suspicious documents"
          },
          {
            "label": "Least privilege",
            "note": "the layer that contains it",
            "accent": "accent"
          },
          {
            "label": "Confirm state changes",
            "note": "human approves actions",
            "accent": "warn"
          },
          {
            "label": "Validate outputs",
            "note": "URLs, commands, tool calls",
            "accent": "warn"
          },
          {
            "label": "Log and alert",
            "note": "detection is a control"
          }
        ],
        "caption": "Assume injection **sometimes succeeds**. Filters raise the bar, but **least privilege** is what makes success worth little."
      },
      "say": "I make sure a successful injection can't reach anything worth having. Indirect injection is when the attacker never touches our system. They plant text in something we'll index, like a support ticket, a shared file or a CV, and wait for retrieval to load it into the prompt. It arrives through the same channel as legitimate content, so I can't block it at the door. The defence is layered. Retrieved content is clearly delimited and labelled as data, not instructions. Documents are scanned at ingestion, with suspicious ones quarantined, not just checked at query time. But the layer that actually contains it is least privilege. The model gets minimal permissions, any state change needs explicit confirmation, and outputs that look like URLs, commands or tool calls are validated before anything acts on them. Take a recruitment screener. With read-only access and a structured score, the worst case is one CV ranked unfairly high. I log injection-shaped content too, because detection is part of the control.",
      "numbers": "No number applies. Track quarantined documents and blocked tool calls as the operational signals.",
      "wrong": "\"We sanitise the input.\" Sanitising natural language is not a solved problem - there is no character set to strip. Containment beats filtering here.",
      "follow": "A CV in your recruitment corpus contains an injection. What does it reach?",
      "followAnswer": "It should reach only what the screening step can touch: the text of that one CV and a score. If the design is right, the model has read-only access, cannot email candidates or change records, and its output is a structured score checked in code. So the realistic damage is one candidate ranked unfairly high. That is why I also flag injection-shaped text at ingestion and keep a human reviewing shortlists."
    },
    {
      "id": "gr-04",
      "q": "What guardrails do you put on the output, and where?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "guardrails",
        "validation",
        "architecture"
      ],
      "why": "Concrete design. Whether guardrails are components in your architecture or aspirations in a prompt.",
      "quick": [
        "Guardrails run in code around the model, not the prompt.",
        "Check input length, request volume, attacks and topic.",
        "Check outputs cheapest first, like format, citations and banned words.",
        "Then use a model to check grounding and policy.",
        "Set an action for each failure, and track wrong blocks."
      ],
      "simple": "Output guardrails run in your code, around the model call, not inside the prompt, and that placement is most of the answer. On the way in, you check length, rate limits and injection patterns.\n\nOn the way out, you run checks in order of cost. Deterministic checks come first because they're almost free, like whether the output parses against the schema, whether every citation resolves to a retrieved chunk, and whether there's a banned phrase or PII pattern. After that come model-based checks where code can't judge, like groundedness and a policy classifier.\n\nEvery check needs a defined failure action, because a guardrail with no action is just a metric. For example, a support bot answer containing a phone number might have that part stripped, while an answer citing a chunk that was never retrieved gets regenerated once. Finally, measure false positives, because guardrails that block legitimate answers get switched off by whoever is on call.",
      "points": [
        "Guardrails live in code around the call, not in the prompt.",
        "Input: length, rate, injection patterns, topic scope.",
        "Output, cheapest first: schema parse, required sections, citation resolution, banned terms, PII patterns.",
        "Then model-based: groundedness, toxicity, policy.",
        "Define the failure action per check - block, regenerate, strip, escalate.",
        "Measure false positives. Over-blocking gets the guardrail disabled.",
        "Tools such as Llama Guard, NeMo Guardrails, Guardrails AI or cloud services (Bedrock Guardrails, Azure AI Content Safety) implement checks; you still own placement and failure actions (gr-11)."
      ],
      "diagram": {
        "alt": "Guardrails around the model call: input gate, then deterministic output checks, then model-based checks, each with a defined failure action.",
        "rows": [
          [
            {
              "id": "in",
              "label": "Request"
            }
          ],
          [
            {
              "id": "ing",
              "label": "Input gate",
              "note": "length, rate, injection, topic",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "model",
              "label": "Model call",
              "note": "the prompt is NOT the guardrail"
            }
          ],
          [
            {
              "id": "det",
              "label": "Deterministic checks",
              "note": "schema, sections, citations, PII",
              "accent": "warn"
            },
            {
              "id": "mb",
              "label": "Model-based checks",
              "note": "groundedness, toxicity, policy",
              "accent": "warn"
            }
          ],
          [
            {
              "id": "act",
              "label": "Failure action",
              "note": "block, regenerate, strip, escalate",
              "accent": "bad"
            },
            {
              "id": "ok",
              "label": "Deliver",
              "accent": "accent"
            }
          ]
        ],
        "edges": [
          {
            "from": "in",
            "to": "ing"
          },
          {
            "from": "ing",
            "to": "model",
            "label": "pass"
          },
          {
            "from": "model",
            "to": "det"
          },
          {
            "from": "det",
            "to": "mb",
            "label": "pass"
          },
          {
            "from": "mb",
            "to": "ok",
            "label": "pass"
          },
          {
            "from": "mb",
            "to": "act",
            "label": "fail"
          },
          {
            "from": "act",
            "to": "model",
            "label": "regenerate once",
            "kind": "back"
          }
        ],
        "caption": "Deterministic checks run **before** the model-based ones because they are free. And a guardrail with no defined failure action is just a metric - every check needs its own choice of block, regenerate, strip or escalate. Measure the false positive rate: guardrails that block legitimate answers get switched off by whoever is on call, and then you have none."
      },
      "say": "In code, around the model call, not inside the prompt. That placement is most of the answer. On the way in, I check length, rate limits, injection patterns and topic scope if the assistant is meant to be narrow. On the way out, I go cheapest first. Deterministic checks are nearly free, so they run on every response. Does it parse against the schema, are required sections there, does every citation resolve to a chunk we actually retrieved, is there a banned phrase or a PII pattern. Model-based checks come after, where code can't judge, like groundedness against the context and a policy classifier. Every check also needs a defined failure action, because a guardrail with no action is just a metric. Depending on the failure, I block with a safe message, regenerate once, strip the offending part or route to a human. And I measure false positives, because a guardrail that blocks good answers gets switched off by whoever's on call.",
      "numbers": "Run cheap deterministic checks on every response where they apply. Model-based checks add model latency and cost, so high-volume systems may sample some of them; citation validation should still run whenever the answer shows citations.",
      "wrong": "\"We instruct the model not to produce unsafe content.\" That leaves the control to the model's own alignment, and the follow-up - what happens when an attacker talks it round - has no answer in code.",
      "follow": "Your groundedness checker is itself an LLM. What if it is wrong?",
      "followAnswer": "Then I treat it like any other model: calibrate it against a few hundred human-labelled answers and track agreement, so I know its error rate. For high-stakes answers it flags rather than being the only gate - flagged answers are regenerated or reviewed. Cheap deterministic checks, like citation resolution, run beside it. And I re-check agreement whenever the judge model or its prompt changes."
    },
    {
      "id": "gr-03",
      "q": "How do you handle PII and PHI in a GenAI pipeline?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "guardrails",
        "pii",
        "phi",
        "privacy",
        "compliance"
      ],
      "why": "At a healthcare payer or a bank this is the deciding question of the whole loop.",
      "quick": [
        "Map everywhere personal data can appear, not just the database.",
        "Strip or mask sensitive fields before calling the model.",
        "Check user access before search, not after the answer.",
        "Scrub logs when saving them and keep them briefly.",
        "Deletion requests must reach copies, caches and logs too."
      ],
      "simple": "Handling PII and PHI starts with mapping every place personal or health data can appear. That means user input, retrieved documents, model output, vector indexes, traces, eval sets, caches and provider-side retention. If you only protect the source database, you've missed most of the AI data path.\n\nThen you put a control at each stage. Sensitive fields are minimised or tokenised before the model call, access checks run before retrieval rather than after generation and traces are redacted at write time.\n\nThe part people forget is the derived stores. For example, when a patient asks a health insurer to erase their data, the request has to reach the chunks and embeddings in the vector index, cached answers, traces and eval copies, not just the main record. So you tag every derived record with its source ID. The exact legal obligations vary by jurisdiction and sector, so you build to what privacy and legal teams have approved.",
      "points": [
        "Map sensitive data across input, corpus, output, indexes, traces, eval data and providers.",
        "Minimise or tokenise before sending where the task allows.",
        "Apply authorisation before retrieval and before sensitive actions.",
        "Redact traces when writing them and set explicit retention.",
        "Use the jurisdiction/sector requirements approved by privacy and legal teams.",
        "Design access/deletion workflows for derived stores too."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Personal data path in a GenAI pipeline with one control per stage: input, retrieval, output, traces and derived stores.",
        "lanes": [
          {
            "label": "Input",
            "note": "minimise or tokenise"
          },
          {
            "label": "Retrieval",
            "note": "authorise before, not after",
            "accent": "accent"
          },
          {
            "label": "Output",
            "note": "scan before display"
          },
          {
            "label": "Traces",
            "note": "redact at write time"
          },
          {
            "label": "Derived stores",
            "note": "index, cache, eval copies",
            "accent": "warn"
          }
        ],
        "caption": "Map **every place** the data lands, not just the source database. Deletion requests must reach the **derived stores** too - tag each copy with a source ID."
      },
      "say": "I start by mapping everywhere personal or health data can appear, because protecting only the source database misses most of the AI data path. That covers user input, retrieved documents, model output, vector indexes, traces, eval sets, caches and any provider-side retention. Then each stage gets a control. Sensitive fields are minimised or tokenised before the model call where the task allows. Access checks for the user and tenant run before retrieval, not after generation. Sensitive outputs are scanned before display, traces are redacted at write time, and retention is deliberately short. The derived stores are what people forget. An erasure request has to reach the chunks and embeddings in the index, cached answers and eval copies, not just the main record, so I tag every derived record with a source ID. And a provider not training on our data isn't enough on its own. The legal rules vary, GDPR, HIPAA, India's DPDP Act, so I build to the interpretation our privacy and legal teams approved.",
      "numbers": "No number applies. What matters is coverage: every one of those points, not a sampled subset.",
      "wrong": "Saying the data is safe because the model provider does not train on it. Privacy also depends on access control, retention, logs, derived stores, processing region and the application's own behaviour.",
      "follow": "A user exercises their right to erasure. What exactly do you delete?",
      "followAnswer": "Everything derived from that person's data, not just the source record: the rows, the chunks and embeddings in the vector index, cached answers that quote them, traces beyond what legal lets us keep, and evaluation copies. I tag every derived record with a source ID, so deletion is a query, not a search. A model fine-tuned on the data is the hard case, which is why personal data stays out of training sets."
    },
    {
      "id": "gr-07",
      "q": "How do you test that your guardrails work?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "guardrails",
        "testing",
        "red-team",
        "evaluation"
      ],
      "why": "Guardrails that were never tested are a design document. This is where that shows.",
      "quick": [
        "Keep attack cases with expected results, run like normal tests.",
        "Keep real requests that look like attacks, to catch wrong blocks.",
        "Report catch rate and wrong-block rate together.",
        "Every real attack seen becomes a new test.",
        "Have outsiders try to break them now and then."
      ],
      "simple": "Guardrails are components, so you test them like any other component, with a suite that runs in CI. The first half is a red-team set of attack cases with expected outcomes, such as injection attempts, jailbreak phrasings and PII in inputs, each marked as blocked, redacted or refused.\n\nThe second half matters just as much. It's a mirror set of legitimate requests that look like attacks. For example, a patient asking about a medication dosage, or a user quoting a document that contains the word \"ignore\", could both trip a crude filter, and you'd rather find that in a test than from angry users.\n\nSo you report the catch rate and the false positive rate together, since either alone can be made perfect by breaking the other. Then you keep the suite alive, turning every real attempt from production into a new test case and having someone outside the team try to break it.",
      "points": [
        "Red-team set with expected outcomes, run in CI.",
        "Mirror set of legitimate lookalikes - the false-positive control.",
        "Report catch rate and false positive rate together. Either alone is gameable.",
        "Every production attempt becomes a new test case.",
        "Periodic external red-teaming - the authors' imagination is the narrowest."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "Two-by-two grid of attack and legitimate lookalike requests against blocked and allowed outcomes.",
        "xLabel": "What the guardrail did",
        "yLabel": "Test set",
        "cols": [
          "Blocked",
          "Allowed"
        ],
        "rows": [
          "Attack set",
          "Mirror set"
        ],
        "cells": [
          [
            {
              "label": "Caught",
              "note": "counts toward catch rate",
              "accent": "accent"
            },
            {
              "label": "Missed attack",
              "note": "hurts catch rate",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "False positive",
              "note": "angry legitimate users",
              "accent": "bad"
            },
            {
              "label": "Served",
              "note": "what we want",
              "accent": "accent"
            }
          ]
        ],
        "caption": "Report **catch rate and false positive rate together**. Either one alone can be made perfect by wrecking the other."
      },
      "say": "Like any other component, with a test suite that runs in CI, because an untested guardrail is really just a design document. The first half is a red-team set. Injection attempts, jailbreak phrasings, prompt extraction, out-of-scope requests and PII in inputs, each with an expected outcome like blocked, redacted or refused. The other half matters just as much, a mirror set of legitimate requests that look like attacks. Picture a patient asking about a medication dosage, or a user quoting a document that contains the word ignore. If those get blocked, I'd rather find out from a test than from angry users. So I report the catch rate and the false positive rate together, since either one alone can be made perfect by wrecking the other. The suite also has to stay alive. Every real attempt from production becomes a new case, and someone outside the team tries to break it periodically, because the authors have the narrowest imagination about their own guardrails.",
      "numbers": "Report catch rate and false-positive rate together. A guardrail can catch nearly every attack and still be unusable if it blocks too many legitimate requests.",
      "wrong": "\"We tried some jailbreak prompts and they were blocked.\" Manual, unrepeatable, and no false-positive control.",
      "follow": "Who writes the red-team set, and why not you?",
      "followAnswer": "Ideally people outside the team that built the guardrails, because the authors have the narrowest imagination about how their own design can be broken. I seed the set myself with known injection, jailbreak and extraction patterns, but then bring in a security or red-team colleague, domain experts who know which legitimate questions look risky, and periodically an external tester. Every real attempt from production is added too. That way the set reflects how attackers and users actually behave, not what I expected."
    },
    {
      "id": "gr-11",
      "q": "Llama Guard, NeMo Guardrails, provider moderation - which guardrail tools do you use, and how?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "guardrails",
        "tools",
        "moderation",
        "llama-guard",
        "nemo-guardrails"
      ],
      "why": "The practical follow-up to gr-04. The panel wants to know what each tool actually does and where it sits, not a list of product names.",
      "quick": [
        "They do different jobs, and none replaces your own code.",
        "Llama Guard labels text as safe or unsafe by category.",
        "Cloud moderation is easy but uses their rules and thresholds.",
        "NeMo Guardrails wires checks into input, output and dialogue.",
        "Each check adds delay, so tune it on your traffic."
      ],
      "simple": "Guardrail tools do different jobs, so teams often combine them, but none of them replaces the controls in your own code. Safety classifiers label text as safe or unsafe by harm category, and Meta's Llama Guard is the best-known open one. Small classifiers like Prompt Guard target injection specifically.\n\nManaged services, like the OpenAI moderation endpoint or Amazon Bedrock Guardrails, are easy to add, but you get their categories and thresholds. Frameworks then wire the checks into your app, such as NeMo Guardrails or Guardrails AI.\n\nWhat matters for all of them is where each check runs, what happens on failure, and how much latency it adds, since a classifier call typically adds tens to a few hundred milliseconds. For example, in a customer chat app you might run Prompt Guard on the input in parallel with retrieval, so it costs almost no extra time.",
      "points": [
        "**Safety classifiers** - Llama Guard (open, category labels, images in v4); gpt-oss-safeguard (classifies against your own written policy).",
        "**Injection classifiers** - for example Meta's Prompt Guard or Azure Prompt Shields.",
        "**Managed services** - OpenAI moderation, Azure AI Content Safety, Amazon Bedrock Guardrails, Google Cloud Model Armor.",
        "**Frameworks** - NeMo Guardrails (input, output, dialogue and retrieval rails; Colang); Guardrails AI (output validators, re-ask).",
        "A classifier is another model call - budget the latency, run it in parallel where you can.",
        "Tune thresholds on your own traffic; measure false positives on a legitimate lookalike set (gr-07).",
        "Tools implement checks. Placement, failure actions and permissions are still your design (gr-04)."
      ],
      "say": "They do different jobs, so I often combine them, but none of them replaces the controls in our own code. Safety classifiers label text as safe or unsafe by harm category. Llama Guard is the best-known open one, and version 4 handles images too. gpt-oss-safeguard is open-weight and classifies against a policy we write ourselves, and small models like Prompt Guard target injection specifically. Managed services, like OpenAI moderation, Azure AI Content Safety, Bedrock Guardrails or Model Armor, are easy to add, but we get their categories and thresholds. Frameworks wire the checks in. NeMo Guardrails defines input, output, dialogue and retrieval rails, and Guardrails AI validates outputs and can re-ask the model. The senior part is the same for all of them. Each classifier is another model call, adding tens to a few hundred milliseconds, so I run input checks in parallel with retrieval. And I tune thresholds on our own traffic, because a vendor benchmark isn't our users.",
      "numbers": "A classifier call typically adds tens to a few hundred milliseconds, depending on model size and hosting. Run input checks in parallel with retrieval where you can, and measure the false positive rate on your own legitimate traffic before trusting any threshold.",
      "wrong": "\"We use NeMo Guardrails, so we are covered.\" A framework runs the checks you configure. It cannot stop a tool that has too much permission, and it does not know your domain's harms unless you define them.",
      "follow": "Your safety classifier blocks 4% of legitimate medical questions. What do you do?",
      "followAnswer": "First I read the blocked cases to see which category fires. Then I adjust: raise the threshold for that category, or move to a policy-based classifier where I can state that patients asking about medication and dosage is allowed. I add those cases to the lookalike test set, re-measure false positives and catch rate together, and make sure a block leads to a helpful message, not a dead end."
    },
    {
      "id": "gr-05",
      "q": "How do you stop the model leaking your system prompt?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "guardrails",
        "security",
        "prompting"
      ],
      "why": "A small question with a revealing answer - it tests whether you know what actually needs protecting.",
      "quick": [
        "You cannot reliably stop it, so assume it leaks.",
        "Put nothing secret in it, like keys or customer data.",
        "Behaviour and format rules are fine to leak.",
        "Blocking prompt-like replies only slows attackers down.",
        "Security should never depend on the model keeping secrets."
      ],
      "simple": "You can't reliably stop a model leaking its system prompt. Given enough attempts, system prompts get extracted, and telling the model never to reveal it is the weakest option. So the right response is to change what's at stake.\n\nThat means nothing secret goes in the system prompt, so no API keys, customer data or sensitive business rules. What stays is instructions about behaviour and format, so a leak is embarrassing rather than damaging. For example, if a banking assistant's prompt only says \"answer politely, cite the policy document, and refuse investment advice\", nobody gains anything from it. But if it contained an API key for the payments system, the same leak would be a serious incident.\n\nThe broader rule is that if your security depends on the model keeping a secret, the design is wrong. Tool credentials belong in the runtime, where the model never sees them.",
      "points": [
        "Extraction cannot be reliably prevented. Assume it eventually happens.",
        "Nothing secret in the prompt - no keys, no URLs, no customer data, no sensitive rules.",
        "Behaviour and format instructions are fine. They are not secrets.",
        "An output check that blocks prompt-shaped responses is friction, not a control.",
        "If security depends on the model keeping a secret, the design is wrong.",
        "OWASP's 2026 list calls this **hidden context exposure** (it was system prompt leakage in 2025)."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "What belongs in the system prompt compared with what belongs in the runtime, and what a leak costs for each.",
        "aspects": [
          "Holds",
          "Model sees it?",
          "If extracted"
        ],
        "columns": [
          {
            "label": "System prompt",
            "note": "assume it leaks",
            "accent": "warn",
            "cells": [
              "Behaviour and format rules",
              "Yes",
              "Embarrassing, not damaging"
            ]
          },
          {
            "label": "Runtime",
            "note": "where secrets live",
            "accent": "accent",
            "cells": [
              "Keys, credentials, URLs, customer data",
              "Never",
              "Nothing to extract"
            ]
          }
        ],
        "caption": "Extraction **cannot be reliably stopped**. If security depends on the model keeping a secret, the design is wrong."
      },
      "say": "I can't reliably stop it, so I make sure a leak doesn't matter. Given enough attempts, system prompts get extracted, and published defences keep getting bypassed. So nothing secret goes in the prompt. No API keys, no credentials, no internal URLs, no customer data, and no business rules whose disclosure would cause harm. What stays is behaviour and format instructions, which aren't really secrets even if I'd rather keep them private. Then a leak is embarrassing, not damaging. Telling the model never to reveal its prompt is the weakest option, because it's the first thing every extraction technique is tested against. An output check that blocks prompt-shaped replies raises the bar a little, but it's friction, not a control. The broader rule is that if security depends on the model keeping a secret, the design is wrong. Tool credentials live in the runtime, where the model never sees them.",
      "numbers": "No number applies.",
      "wrong": "\"I add an instruction never to reveal the prompt.\" It is the first thing every extraction technique is tested against.",
      "follow": "So where do credentials for a tool call live?",
      "followAnswer": "In the runtime, never in the prompt or anywhere the model can read them. The model only proposes a tool call with arguments. My code validates it, then the tool executor attaches credentials from a secrets manager or a managed identity before calling the downstream service. Ideally those credentials are scoped to the current user and task, so the tool can only do what that user could. That way, even a fully leaked prompt or a successful injection never exposes a key."
    },
    {
      "id": "gr-08",
      "q": "What does responsible AI mean in practice for a system you build?",
      "round": [
        "manager",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "guardrails",
        "responsible-ai",
        "governance",
        "bias"
      ],
      "why": "A hiring-manager question. The failure mode is answering with principles instead of mechanisms.",
      "quick": [
        "Answer with things you built, not values you hold.",
        "Measure quality per group, since averages hide unfairness.",
        "Tell users it is AI, cite sources, admit not knowing.",
        "Name an owner and keep a record of what was shown.",
        "A person decides big outcomes, and users can challenge them."
      ],
      "simple": "Responsible AI is easy to state as principles, but this question is about the gap between policy and system, so you answer with mechanisms you've built. Fairness means measuring quality by segment, such as language, region or customer tier, because a single average is where inequity hides. For example, an answer-quality score of 0.9 overall can hide one language sitting at 0.6, and that gap is a fairness problem whatever the intent.\n\nTransparency means users know they're talking to an AI, answers carry citations. Accountability means a named owner, an audit trail of what was shown to whom, and a challenge route.\n\nHuman oversight means a person decides anything consequential, such as a claim or a credit outcome, with their edits and rejections logged. If the system influenced a decision about a person, that person needs a way to question it and reach a human who can act.",
      "points": [
        "Fairness = measured by segment. Averages hide inequity.",
        "Transparency = disclosure, citations, and an honest \"I do not know\".",
        "Accountability = named owner, audit trail, challenge route.",
        "Human oversight on consequential decisions, with logged edits and rejections.",
        "Contestability - a person affected can question the outcome and reach a human.",
        "Answer with mechanisms. Principles alone read as a slide.",
        "EU AI Act, if asked: risk tiers - banned, high-risk, transparency, minimal. Bans applied from Feb 2025, general-purpose model duties from Aug 2025, transparency duties (disclose AI, label generated content) from Aug 2026. High-risk duties, such as hiring and credit scoring, were pushed to Dec 2027 by the 2026 Digital Omnibus."
      ],
      "say": "It means mechanisms I've built, not values I hold, so that's how I answer. Fairness is measured by segment, by language, region, customer tier or any group the domain cares about, because a single average is where inequity hides. A 0.9 overall can hide one language sitting at 0.6, and that's a fairness problem whatever the intent. Transparency means users know they're talking to AI, answers carry citations, and the system says when it doesn't know. In the EU that's now partly law, since the AI Act's transparency duties apply from August 2026. Accountability means a named owner, an audit trail of what was shown to whom, and a challenge route. Human oversight means a person decides anything consequential, like a claim or a credit outcome, with their edits and rejections logged. And contestability, which people forget, means someone affected by a decision can question it and reach a human who can act.",
      "numbers": "Slice every quality metric by segment. A 0.9 average routinely hides a 0.6 segment, and that gap is the fairness finding.",
      "wrong": "Reciting fairness, accountability and transparency as values. Every candidate does. The mechanisms are what distinguish an answer.",
      "follow": "You found one language performs ten points worse. What do you do about it?",
      "followAnswer": "I treat it as a quality bug with a named owner, not a footnote. First I dig into why, checking whether retrieval, the documents, the embedding model or generation is weaker in that language, by looking at failed cases with a native speaker. Then I fix the weakest stage, perhaps a multilingual embedding model, translated or added documents, or prompt changes. I add that language's cases to the golden set, report quality by language on every release, and be transparent with users while the gap exists."
    },
    {
      "id": "gr-06",
      "q": "How do you handle data residency in a regulated regional deployment?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "guardrails",
        "residency",
        "compliance",
        "cloud"
      ],
      "why": "Global enterprise AI roles need engineers who can turn jurisdiction, sector and contract requirements into an actual data flow.",
      "quick": [
        "First confirm the approved rule and who signs it off.",
        "Map every place data goes, not just the model.",
        "Check the model is actually offered in that region.",
        "Pin regions and block silent moves to other regions.",
        "Test disaster recovery, since backups can cross borders."
      ],
      "simple": "Handling data residency doesn't start with picking a cloud region. It starts with the approved requirement, meaning which data classes are covered, which jurisdiction or sector rules apply, whether processing may cross a border, and who signs off on that interpretation.\n\nThen you draw the full data flow, because model inference is only one box. The vector store, caches, the trace platform, eval samples, backups and support access can all move sensitive data, and each needs an allowed region and a retention rule. You also check what's actually offered in that region, since the model you wanted may not be available there. Regions are pinned explicitly, with no silent failover to another geography.\n\nFinally, you test failover. For example, a bank's assistant might run fully inside one country normally, but during a disaster recovery drill its database replicas and trace backups fail over to a region abroad, breaking the requirement without anyone noticing.",
      "points": [
        "Establish the approved jurisdiction/sector/contract requirement first.",
        "Map every store and processor, not only the model endpoint.",
        "Check actual model/service availability in the required region.",
        "Pin regions and prevent silent cross-region failover.",
        "Include backups, disaster recovery, support access and traces in the design."
      ],
      "say": "Not by picking a cloud region first. I start by pinning down the approved requirement. Which data classes are covered, which jurisdiction or sector rules apply, whether processing may cross a border, and which team signs off on that reading. Then I map the full data flow, because inference is only one box. The vector store, object storage, caches, the trace platform, analytics, eval samples, backups and support access can all move sensitive data, and each needs an allowed region and a retention rule. Next I check what's actually offered in that region. If the model we wanted isn't available there, that can change the model choice or push us to an approved self-hosted deployment. Regions are pinned explicitly, with private networking, scoped identities, encryption and audit logs, and there's no silent failover to another geography. Finally, I test disaster recovery, because a compliant steady state can turn non-compliant when backups or replicas quietly cross the boundary during an incident.",
      "numbers": "No universal retention period or allowed-region list applies. Record the requirement per data class and test the actual failover path rather than assuming the cloud region setting covers every dependent service.",
      "wrong": "Saying 'we selected the local cloud region' and stopping. Logs, vector stores, backups, support tools and disaster-recovery paths can still move or retain the same data elsewhere.",
      "follow": "The model you want is unavailable in the approved region. What options do you take to the architecture and risk teams?",
      "followAnswer": "I'd bring three or four options with their trade-offs. First, use the best model that is available in the approved region and evaluate whether it meets our quality bar. Second, self-host an open-weight model in that region, which keeps data local but adds operational cost. Third, if legal confirms the rules allow it, send only minimised or redacted data cross-border under an approved contract. Fourth, redesign so sensitive steps stay local and only non-sensitive work uses the preferred model. Each comes with eval results and residual risk."
    }
  ]
};
