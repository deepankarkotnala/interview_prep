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
      "simple": "**Short version: attackers can steer the model with text, get it to reveal data, make its tools do damage, or run up your bill.** The OWASP Top 10 for LLM Applications is the shared vocabulary; gr-09 walks through the full 2026 list.\n\nThe ones that come up most in practice. Prompt injection: text the model reads carries instructions, either from the user or hidden in a document you retrieved. Sensitive information disclosure: the model shows data the user should not see, often because retrieval skipped a permission check. Excessive agency: a tool can do far more than the task needs, so one bad instruction does real damage. Improper output handling: model output goes into SQL, a shell or a web page without checks - a classic injection bug with a new source. Supply chain: risky models, packages, datasets and MCP servers. Unbounded consumption: an attacker or a runaway loop burns cost or capacity.\n\nThe framing matters more than the list: the model is not a trust boundary. A trust boundary is the point where you check input before you trust it. Everything the model reads is untrusted data, and everything it produces is untrusted input to whatever comes next. Every control follows from those two sentences.",
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
      "say": "I use the OWASP LLM Top 10 as the vocabulary. In practice: prompt injection, direct and indirect; sensitive disclosure through retrieval with no permission check; improper output handling, where model output goes into SQL or a shell unvalidated; excessive agency, where a tool does more than the task needs; and supply chain, which now includes models and MCP servers. The framing underneath is that the model is not a trust boundary.",
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
      "simple": "Both make a model do something it should not. The difference is what is being attacked.\n\nA jailbreak attacks the model's safety training. The user wants content the model was trained to refuse, like weapon instructions, and uses tricks to get it: role-play (\"pretend you are an AI with no rules\"), hypotheticals, encoding the request, or slow escalation over many turns. The attacker is usually the user, and the target is the model's safety rules.\n\nPrompt injection attacks your application. Someone slips instructions into text the model will read, so the model follows the attacker instead of you. Direct injection comes from the user. Indirect injection hides in a document, email or web page the app retrieves. The victim is your system and your users: leaked data, a wrong tool call, an email sent to the wrong person.\n\nA short way to hold it: a jailbreak tries to break the model's rules; an injection tries to take over your app's instructions. The techniques overlap, and one attack can be both.\n\nSo the defences differ. For jailbreaks, you rely on the model's alignment plus input and output safety classifiers. For injection, filters help, but the real control is containment: least privilege, confirmations and output validation, so a successful injection reaches very little.",
      "points": [
        "**Jailbreak** - target: the model's safety rules. Goal: forbidden content.",
        "**Prompt injection** - target: your application's instructions. Goal: hijack behaviour, data or tools.",
        "Direct injection comes from the user; indirect injection hides in retrieved content.",
        "Jailbreak tricks: role-play, hypotheticals, encoding, many-turn escalation.",
        "The techniques overlap - one attack can be both.",
        "Jailbreak defence: model alignment plus input and output safety classifiers.",
        "Injection defence: containment in code - least privilege, confirmation, output validation (gr-02)."
      ],
      "say": "A jailbreak attacks the model's safety training - the user wants content the model was trained to refuse, and uses role-play, hypotheticals or encoding tricks to get it. Prompt injection attacks my application - someone plants instructions in text the model reads, directly or through a retrieved document, so the model follows them instead of me. The defences differ: safety classifiers for jailbreaks, and containment in code, such as least privilege and confirmations, for injection.",
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
      "simple": "The OWASP Top 10 for LLM Applications is a community-built list of the biggest security risks in apps that use language models. OWASP is the non-profit behind the well-known web security Top 10. The current edition came out in August 2026. Many teams still quote the 2025 one, so know what moved.\n\nThe first two did not move: prompt injection, then sensitive information disclosure. Excessive agency jumped from sixth to third, because agents now take real actions. Then supply chain, data and model poisoning, unbounded consumption and misinformation. Hidden context exposure is the old system prompt leakage, broadened to any hidden context. Vector and embedding weaknesses covers RAG stores. Improper output handling dropped to tenth, but it still matters.\n\nDo not just recite ten names. Group them so they stick. What goes in: injection, poisoning, supply chain, the vector store. What comes out: disclosure, hidden context, misinformation, output handling. What it can do: excessive agency and unbounded consumption. Then give one control for each.\n\nAnd know the boundary. Once your model calls tools and keeps memory, OWASP points you to its separate Top 10 for Agentic Applications, which covers risks such as goal hijacking and tool misuse.",
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
      "say": "It is OWASP's community list of LLM application risks, and the current edition is from August 2026. Prompt injection and sensitive information disclosure stay first and second. Excessive agency jumped to third because agents now act. Then supply chain, data and model poisoning, unbounded consumption, misinformation, hidden context exposure - the old system prompt leakage - vector and embedding weaknesses, and improper output handling. For each one I name a control that lives in code, not in the prompt.",
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
      "simple": "Indirect injection is when the attacker never contacts your system. They plant text in a document they know you will index - a shared file, a support ticket, a web page, a CV in a recruitment corpus - and wait for retrieval to load it into your prompt.\n\nIt is hard because it is the same channel as your legitimate content. You cannot block it at the door.\n\nSo the defence is layered and mostly assumes it will sometimes succeed. Delimit retrieved content clearly and state that it is data, not instructions. Scan content at ingestion for injection patterns and flag or quarantine, rather than only at query time. Keep the model's permissions minimal, so a successful injection reaches nothing valuable - this is the layer that actually contains it. Require confirmation for any state change. Validate outputs, especially anything that looks like a URL, a command or a tool call. And log so you can detect attempts.\n\nThe honest sentence to say out loud: I design assuming injection sometimes succeeds, and I make sure success is not worth much.\n\n(Injection basics: pr-06. Other RAG-specific risks such as corpus poisoning: rag-52.)",
      "points": [
        "The attacker plants content you will index. Same channel as legitimate data.",
        "Delimit retrieved content and label it as data.",
        "Scan at ingestion, not only at query time. Quarantine suspicious documents.",
        "Least privilege is the containing layer - make success worth little.",
        "Confirm every state change; validate outputs before acting on them.",
        "Log and alert on injection-shaped content. Detection is part of the control."
      ],
      "say": "The attacker plants text in a document they know we will index, so it arrives through the same channel as legitimate content and cannot be blocked at the door. I delimit retrieved content and label it as data, scan at ingestion and quarantine, and keep the model's permissions minimal so a successful injection reaches nothing valuable. State changes require confirmation. I design assuming injection sometimes succeeds and make sure success is not worth much.",
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
      "simple": "Guardrails run in your code, around the model call, not inside the prompt. That placement is the answer.\n\nOn the way in: length limits, rate limits, an injection-pattern check, and a topic check if the assistant is meant to be narrow.\n\nOn the way out, in order of cost: deterministic checks first, because they are free - does it parse against the schema, are required sections present, does every citation resolve to a chunk that was actually retrieved, does it contain a banned phrase or a PII pattern. Then model-based checks where code cannot judge - groundedness against the retrieved context, and a toxicity or policy classifier.\n\nThen decide what happens on failure, because a guardrail with no defined action is just a metric. Block and return a safe message, regenerate once, strip the offending part, or route to a human. Each failure type deserves its own choice.\n\nAnd measure the false positive rate. Guardrails that block legitimate answers get switched off by whoever is on call, and then you have none.",
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
      "say": "In code around the model call, never in the prompt. Inbound: length, rate, injection patterns and topic scope. Outbound, cheapest first - schema parse, required sections, citation resolution against what was actually retrieved, banned terms and PII patterns - then model-based groundedness and policy checks. Each check has a defined action: block, regenerate, strip or escalate. And I measure false positives, because over-blocking gets guardrails switched off.",
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
      "simple": "I start by mapping every place personal or health data can appear: user input, retrieved documents, model output, vector indexes, traces, evaluation sets, caches and any provider-side retention. If I only protect the source database, I have missed most of the AI data path.\n\nThen I put controls at each stage. Minimise or tokenise sensitive fields before model calls where the task allows it. Apply user/tenant access control before retrieval, not after generation. Scan or validate sensitive outputs before display. Redact traces at write time and keep retention deliberately short. Use enterprise provider terms and a processing region that meets the organisation's requirements.\n\nThe exact legal obligations depend on jurisdiction and sector - examples include GDPR in Europe, HIPAA for covered US healthcare use cases, India's DPDP Act and Rules, and financial-sector rules. Engineering should work from the organisation's approved interpretation rather than inventing legal policy.\n\nDeletion and access requests have a concrete systems consequence: the path must reach derived stores such as indexes, caches, traces and evaluation copies where applicable, not only the primary record.",
      "points": [
        "Map sensitive data across input, corpus, output, indexes, traces, eval data and providers.",
        "Minimise or tokenise before sending where the task allows.",
        "Apply authorisation before retrieval and before sensitive actions.",
        "Redact traces when writing them and set explicit retention.",
        "Use the jurisdiction/sector requirements approved by privacy and legal teams.",
        "Design access/deletion workflows for derived stores too."
      ],
      "say": "I map sensitive data across the whole AI path: input, documents, output, indexes, traces, evaluation data and provider retention. Then I minimise or tokenise where possible, enforce access before retrieval, scan sensitive outputs, and redact traces at write time with explicit retention. The exact legal rule depends on jurisdiction and sector, so I implement the approved policy. Importantly, an access or deletion workflow may need to reach derived indexes, caches and traces, not only the source database.",
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
      "simple": "Treat them as testable components, because they are. (Running a pre-launch red-team campaign is ev-12; this card is the permanent test suite.)\n\nA red-team set: attack cases with expected outcomes. Injection attempts, jailbreak phrasings, requests for out-of-scope information, attempts to extract the prompt, and PII in inputs. Each case says what should happen - blocked, redacted, refused - and it runs in CI like any other test suite.\n\nThe mirror set matters just as much: legitimate requests that superficially resemble attacks. A user legitimately asking about a medication dosage, or quoting a document that contains the word \"ignore\". If your guardrails block those, you will find out from angry users rather than from a test.\n\nSo report two numbers - catch rate on the attack set and false positive rate on the legitimate set - because either alone can be made perfect by breaking the other.\n\nThen keep it alive: every real attempt seen in production becomes a case, and periodically someone outside the team tries to break it, since the people who wrote the guardrails have the narrowest imagination about them.",
      "points": [
        "Red-team set with expected outcomes, run in CI.",
        "Mirror set of legitimate lookalikes - the false-positive control.",
        "Report catch rate and false positive rate together. Either alone is gameable.",
        "Every production attempt becomes a new test case.",
        "Periodic external red-teaming - the authors' imagination is the narrowest."
      ],
      "say": "As testable components. A red-team set of injection attempts, jailbreaks, out-of-scope requests and PII inputs, each with an expected outcome, running in CI. Plus a mirror set of legitimate requests that look like attacks, because blocking those is the failure I would otherwise hear about from users. I report catch rate and false positive rate together, since either alone can be made perfect by breaking the other.",
      "numbers": "Report catch rate and false-positive rate together. A guardrail can catch nearly every attack and still be unusable if it blocks too many legitimate requests.",
      "wrong": "\"We tried some jailbreak prompts and they were blocked.\" Manual, unrepeatable, and no false-positive control.",
      "follow": "Who writes the red-team set, and why not you?"
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
      "simple": "They do different jobs, so teams often combine them. None of them replaces the controls in your own code.\n\nSafety classifiers are models that label text as safe or unsafe against a list of harm categories. Meta's Llama Guard is the best-known open one: you send it the user message or the model's reply, and it returns safe or unsafe plus the category broken. Llama Guard 4 also handles images. OpenAI's gpt-oss-safeguard is an open-weight model that reads a policy you write and classifies against it. There are also small classifiers just for injection, such as Meta's Prompt Guard.\n\nProvider and cloud services bundle similar checks: the OpenAI moderation endpoint, Azure AI Content Safety (with Prompt Shields for injection), Amazon Bedrock Guardrails and Google Cloud Model Armor. They are easy to add, but you get their categories and thresholds.\n\nFrameworks wire the checks into your app. NVIDIA's NeMo Guardrails lets you define input, output, dialogue and retrieval rails in config and a small language called Colang. Guardrails AI focuses on validating outputs, such as schemas and PII, and can re-ask the model on failure.\n\nThe senior part is the same for all of them: where each check runs, what happens on failure, and how much latency it adds. And measure false positives on your own traffic, because a vendor benchmark is not your users.",
      "points": [
        "**Safety classifiers** - Llama Guard (open, category labels, images in v4); gpt-oss-safeguard (classifies against your own written policy).",
        "**Injection classifiers** - for example Meta's Prompt Guard or Azure Prompt Shields.",
        "**Managed services** - OpenAI moderation, Azure AI Content Safety, Amazon Bedrock Guardrails, Google Cloud Model Armor.",
        "**Frameworks** - NeMo Guardrails (input, output, dialogue and retrieval rails; Colang); Guardrails AI (output validators, re-ask).",
        "A classifier is another model call - budget the latency, run it in parallel where you can.",
        "Tune thresholds on your own traffic; measure false positives on a legitimate lookalike set (gr-07).",
        "Tools implement checks. Placement, failure actions and permissions are still your design (gr-04)."
      ],
      "say": "They do different jobs. Safety classifiers like Llama Guard label an input or output as safe or unsafe by category, and gpt-oss-safeguard classifies against a policy I write. Managed services - Azure AI Content Safety, Bedrock Guardrails, OpenAI moderation - bundle similar checks. Frameworks like NeMo Guardrails or Guardrails AI wire checks into the input, output and retrieval stages. I choose by latency and fit, tune thresholds on our own traffic, and keep permissions in code.",
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
      "simple": "You cannot reliably stop it. Given enough attempts, system prompts get extracted, and published defences have repeatedly been bypassed.\n\nSo the correct response is to change what is at stake. Nothing secret goes in the system prompt. No credentials, no API keys, no internal URLs, no customer data, no business rules whose disclosure causes harm. Then a leak is embarrassing rather than damaging.\n\nWhat stays: instructions about behaviour and format, which are not secrets even if you would prefer to keep them.\n\nYou can add an output check that blocks responses resembling your prompt, and it raises the bar. Treat that as friction, not as a control.\n\nThe senior version of this answer generalises: if the security of your system depends on the model keeping a secret, the design is wrong. Secrets belong in the runtime, where the model never sees them.",
      "points": [
        "Extraction cannot be reliably prevented. Assume it eventually happens.",
        "Nothing secret in the prompt - no keys, no URLs, no customer data, no sensitive rules.",
        "Behaviour and format instructions are fine. They are not secrets.",
        "An output check that blocks prompt-shaped responses is friction, not a control.",
        "If security depends on the model keeping a secret, the design is wrong.",
        "OWASP's 2026 list calls this **hidden context exposure** (it was system prompt leakage in 2025)."
      ],
      "say": "You cannot reliably stop it - published defences keep getting bypassed - so I change what is at stake instead. Nothing secret goes in the system prompt: no credentials, no internal URLs, no customer data, no rules whose disclosure causes harm. Then extraction is embarrassing rather than damaging. If the security of a system depends on the model keeping a secret, the design is wrong.",
      "numbers": "No number applies.",
      "wrong": "\"I add an instruction never to reveal the prompt.\" It is the first thing every extraction technique is tested against.",
      "follow": "So where do credentials for a tool call live?"
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
      "simple": "The gap between the policy and the system is where this question lives, so answer with mechanisms.\n\nFairness: measure quality by segment, not just overall - by language, region, customer tier, and any group the domain makes relevant. A single average is where inequity hides. If one language sits ten points lower, you have a fairness problem regardless of intent.\n\nTransparency: users know they are talking to an AI system, answers carry citations, and the system says when it does not know. In the EU this is now partly law: the AI Act's transparency duties apply from August 2026.\n\nAccountability: a named owner, an audit trail of what was shown to whom, and a route for a user to challenge an outcome that affected them.\n\nHuman oversight: a person decides anything consequential - a claim, a credit outcome, a clinical suggestion - and their edits and rejections are logged and reviewed.\n\nAnd contestability, which people forget: if the system influenced a decision about a person, that person needs a way to question it and reach a human who can act.\n\nSay those as things you built, not values you hold.",
      "points": [
        "Fairness = measured by segment. Averages hide inequity.",
        "Transparency = disclosure, citations, and an honest \"I do not know\".",
        "Accountability = named owner, audit trail, challenge route.",
        "Human oversight on consequential decisions, with logged edits and rejections.",
        "Contestability - a person affected can question the outcome and reach a human.",
        "Answer with mechanisms. Principles alone read as a slide.",
        "EU AI Act, if asked: risk tiers - banned, high-risk, transparency, minimal. Bans applied from Feb 2025, general-purpose model duties from Aug 2025, transparency duties (disclose AI, label generated content) from Aug 2026. High-risk duties, such as hiring and credit scoring, were pushed to Dec 2027 by the 2026 Digital Omnibus."
      ],
      "say": "In mechanisms rather than principles. Fairness means measuring quality by segment - language, region, customer tier - because a single average hides inequity. Transparency means disclosure, citations and an honest not-known. Accountability means a named owner and an audit trail of what was shown to whom. Human oversight on consequential decisions, with edits logged. And contestability: an affected person can question the outcome and reach a human.",
      "numbers": "Slice every quality metric by segment. A 0.9 average routinely hides a 0.6 segment, and that gap is the fairness finding.",
      "wrong": "Reciting fairness, accountability and transparency as values. Every candidate does. The mechanisms are what distinguish an answer.",
      "follow": "You found one language performs ten points worse. What do you do about it?"
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
      "simple": "I do not start by naming a cloud region. I first establish the approved requirement: which data classes are covered, which jurisdictions or sector rules apply, whether processing may cross a border, and which team signs off on that interpretation.\n\nThen I draw the full data flow. Model inference is only one box. The vector store, object storage, cache, trace platform, analytics, evaluation samples, backups and support access can all move sensitive data too. Each one needs an allowed region and retention rule.\n\nNext I check service availability in the required region. The exact model or managed feature may not be offered there, so that constraint can change model choice or force an approved self-hosted/private deployment. I do not silently fail over to another geography.\n\nNetworking and identity still matter: private connectivity where required, least-privilege service identities, encryption, audit logs and explicit region configuration.\n\nFinally, I test failover and support procedures. A compliant steady state can become non-compliant during disaster recovery if backups, replicas or emergency operations cross the boundary without approval.\n\n(For the concrete Azure, AWS and Google Cloud settings that enforce this, see cd-06.)",
      "points": [
        "Establish the approved jurisdiction/sector/contract requirement first.",
        "Map every store and processor, not only the model endpoint.",
        "Check actual model/service availability in the required region.",
        "Pin regions and prevent silent cross-region failover.",
        "Include backups, disaster recovery, support access and traces in the design."
      ],
      "say": "I first establish the approved residency rule and which data classes it covers. Then I map the whole flow, because inference is only one component - indexes, storage, caches, traces, backups and evaluation data can cross regions too. I check the model is actually available in the required region, pin regions explicitly, and make sure failover cannot silently move data elsewhere. Disaster recovery and support access are part of the design.",
      "numbers": "No universal retention period or allowed-region list applies. Record the requirement per data class and test the actual failover path rather than assuming the cloud region setting covers every dependent service.",
      "wrong": "Saying 'we selected the local cloud region' and stopping. Logs, vector stores, backups, support tools and disaster-recovery paths can still move or retain the same data elsewhere.",
      "follow": "The model you want is unavailable in the approved region. What options do you take to the architecture and risk teams?"
    }
  ]
};
