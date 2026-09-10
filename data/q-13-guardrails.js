/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["13-guardrails"] = {
  "lede": "At a bank, a healthcare payer or any regulated employer, this topic decides the offer. The panel usually includes someone whose job is to say no, and they are listening for one thing: whether your controls live in code or in a politely worded prompt.",
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
      "tags": [
        "guardrails",
        "security",
        "owasp"
      ],
      "why": "A structured answer here signals you have read the standard material rather than improvised.",
      "simple": "The OWASP Top 10 for LLM Applications is the shared vocabulary, and naming it lets a security-minded interviewer relax.\n\nThe ones that come up in practice. Prompt injection, direct and indirect, where text the model reads carries instructions. Sensitive information disclosure, where the model reveals data the user should not see - through retrieval without permission checks, or through a system prompt it repeats. Improper output handling, where you take model output and pass it into SQL, a shell or a browser without validation, which is a classic injection vulnerability with a new source. Excessive agency, where a tool can do far more than the task requires. And supply chain, which now includes models, prompts and MCP servers, not just packages.\n\nThe framing that matters more than the list: the model is not a trust boundary. Everything it produces is untrusted input to whatever comes next, and everything it reads is untrusted data. Every control follows from those two sentences.",
      "points": [
        "Prompt injection - direct from a user, indirect through a document you indexed.",
        "Sensitive disclosure - retrieval without permission checks; leaked system prompts.",
        "Improper output handling - model output into SQL, shell or HTML unvalidated.",
        "Excessive agency - tools that can do more than the task needs.",
        "Supply chain - models, prompts and MCP servers, not just libraries.",
        "The model is not a trust boundary. Its input and its output are both untrusted."
      ],
      "say": "I use the OWASP LLM Top 10 as the vocabulary. In practice: prompt injection, direct and indirect; sensitive disclosure through retrieval with no permission check; improper output handling, where model output goes into SQL or a shell unvalidated; excessive agency, where a tool does more than the task needs; and supply chain, which now includes models and MCP servers. The framing underneath is that the model is not a trust boundary.",
      "numbers": "No number applies. What you track operationally is attempted-injection detections and blocked tool calls.",
      "wrong": "\"The main risk is hallucination.\" That is a quality risk. Answering a security question with it says you have not thought about an adversary.",
      "follow": "Which of those would you fix first in a system you just inherited?"
    },
    {
      "id": "gr-02",
      "q": "How do you defend against indirect prompt injection?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "guardrails",
        "injection",
        "rag",
        "security"
      ],
      "why": "The hardest version of the problem, and the one that applies to every RAG system in production.",
      "simple": "Indirect injection is when the attacker never contacts your system. They plant text in a document they know you will index - a shared file, a support ticket, a web page, a CV in a recruitment corpus - and wait for retrieval to load it into your prompt.\n\nIt is hard because it is the same channel as your legitimate content. You cannot block it at the door.\n\nSo the defence is layered and mostly assumes it will sometimes succeed. Delimit retrieved content clearly and state that it is data, not instructions. Scan content at ingestion for injection patterns and flag or quarantine, rather than only at query time. Keep the model's permissions minimal, so a successful injection reaches nothing valuable - this is the layer that actually contains it. Require confirmation for any state change. Validate outputs, especially anything that looks like a URL, a command or a tool call. And log so you can detect attempts.\n\nThe honest sentence to say out loud: I design assuming injection sometimes succeeds, and I make sure success is not worth much.",
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
      "follow": "A CV in your recruitment corpus contains an injection. What does it reach?"
    },
    {
      "id": "gr-03",
      "q": "How do you handle PII and PHI in a GenAI pipeline?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "guardrails",
        "pii",
        "phi",
        "privacy",
        "compliance"
      ],
      "why": "At a healthcare payer or a bank this is the deciding question of the whole loop.",
      "simple": "I start by mapping every place personal or health data can appear: user input, retrieved documents, model output, vector indexes, traces, evaluation sets, caches and any provider-side retention. If I only protect the source database, I have missed most of the AI data path.\n\nThen I put controls at each stage. Minimise or tokenise sensitive fields before model calls where the task allows it. Apply user/tenant access control before retrieval, not after generation. Scan or validate sensitive outputs before display. Redact traces at write time and keep retention deliberately short. Use enterprise provider terms and a processing region that meets the organisation's requirements.\n\nThe exact legal obligations depend on jurisdiction and sector - examples include GDPR in Europe, HIPAA for covered US healthcare use cases, India's DPDP framework, and financial-sector rules. Engineering should work from the organisation's approved interpretation rather than inventing legal policy.\n\nDeletion and access requests have a concrete systems consequence: the path must reach derived stores such as indexes, caches, traces and evaluation copies where applicable, not only the primary record.",
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
      "follow": "A user exercises their right to erasure. What exactly do you delete?"
    },
    {
      "id": "gr-04",
      "q": "What guardrails do you put on the output, and where?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
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
        "Measure false positives. Over-blocking guarantees the guardrail gets disabled."
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
      "wrong": "\"We instruct the model not to produce unsafe content.\" That is the model's own alignment doing the work, with nothing of yours behind it.",
      "follow": "Your groundedness checker is itself an LLM. What if it is wrong?"
    },
    {
      "id": "gr-05",
      "q": "How do you stop the model leaking your system prompt?",
      "round": [
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "guardrails",
        "security",
        "prompting"
      ],
      "why": "A small question with a revealing answer - it tests whether you know what actually needs protecting.",
      "simple": "You cannot reliably stop it. Given enough attempts, system prompts get extracted, and every published defence has been worked around.\n\nSo the correct response is to change what is at stake. Nothing secret goes in the system prompt. No credentials, no API keys, no internal URLs, no customer data, no business rules whose disclosure causes harm. Then a leak is embarrassing rather than damaging.\n\nWhat stays: instructions about behaviour and format, which are not secrets even if you would prefer to keep them.\n\nYou can add an output check that blocks responses resembling your prompt, and it raises the bar. Treat that as friction, not as a control.\n\nThe senior version of this answer generalises: if the security of your system depends on the model keeping a secret, the design is wrong. Secrets belong in the runtime, where the model never sees them.",
      "points": [
        "Extraction cannot be reliably prevented. Assume it eventually happens.",
        "Nothing secret in the prompt - no keys, no URLs, no customer data, no sensitive rules.",
        "Behaviour and format instructions are fine. They are not secrets.",
        "An output check that blocks prompt-shaped responses is friction, not a control.",
        "If security depends on the model keeping a secret, the design is wrong."
      ],
      "say": "You cannot reliably stop it - every published defence has been worked around - so I change what is at stake instead. Nothing secret goes in the system prompt: no credentials, no internal URLs, no customer data, no rules whose disclosure causes harm. Then extraction is embarrassing rather than damaging. If the security of a system depends on the model keeping a secret, the design is wrong.",
      "numbers": "No number applies.",
      "wrong": "\"I add an instruction never to reveal the prompt.\" It is the first thing every extraction technique is tested against.",
      "follow": "So where do credentials for a tool call live?"
    },
    {
      "id": "gr-06",
      "q": "How do you handle data residency in a regulated regional deployment?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "guardrails",
        "residency",
        "compliance",
        "cloud"
      ],
      "why": "Global enterprise AI roles need engineers who can turn jurisdiction, sector and contract requirements into an actual data flow.",
      "simple": "I do not start by naming a cloud region. I first establish the approved requirement: which data classes are covered, which jurisdictions or sector rules apply, whether processing may cross a border, and which team signs off on that interpretation.\n\nThen I draw the full data flow. Model inference is only one box. The vector store, object storage, cache, trace platform, analytics, evaluation samples, backups and support access can all move sensitive data too. Each one needs an allowed region and retention rule.\n\nNext I check service availability in the required region. The exact model or managed feature may not be offered there, so that constraint can change model choice or force an approved self-hosted/private deployment. I do not silently fail over to another geography.\n\nNetworking and identity still matter: private connectivity where required, least-privilege service identities, encryption, audit logs and explicit region configuration.\n\nFinally, I test failover and support procedures. A compliant steady state can become non-compliant during disaster recovery if backups, replicas or emergency operations cross the boundary without approval.",
      "points": [
        "Establish the approved jurisdiction/sector/contract requirement first.",
        "Map every store and processor, not only the model endpoint.",
        "Check actual model/service availability in the required region.",
        "Pin regions and prevent silent cross-region failover.",
        "Include backups, disaster recovery, support access and traces in the design."
      ],
      "say": "I first establish the approved residency rule and which data classes it covers. Then I map the full flow, because model inference is only one component: indexes, storage, caches, traces, backups and evaluation data can cross regions too. I check service and model availability in the required geography, pin regions explicitly, use the required private networking and identities, and make sure failover cannot silently move data elsewhere. Disaster recovery and support access are part of the compliance design, not exceptions to it.",
      "numbers": "No universal retention period or allowed-region list applies. Record the requirement per data class and test the actual failover path rather than assuming the cloud region setting covers every dependent service.",
      "wrong": "Saying 'we selected the local cloud region' and stopping. Logs, vector stores, backups, support tools and disaster-recovery paths can still move or retain the same data elsewhere.",
      "follow": "The model you want is unavailable in the approved region. What options do you take to the architecture and risk teams?"
    },
    {
      "id": "gr-07",
      "q": "How do you test that your guardrails work?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "guardrails",
        "testing",
        "red-team",
        "evaluation"
      ],
      "why": "Guardrails that were never tested are a design document. This is where that shows.",
      "simple": "Treat them as testable components, because they are.\n\nA red-team set: attack cases with expected outcomes. Injection attempts, jailbreak phrasings, requests for out-of-scope information, attempts to extract the prompt, and PII in inputs. Each case says what should happen - blocked, redacted, refused - and it runs in CI like any other test suite.\n\nThe mirror set matters just as much: legitimate requests that superficially resemble attacks. A user legitimately asking about a medication dosage, or quoting a document that contains the word \"ignore\". If your guardrails block those, you will find out from angry users rather than from a test.\n\nSo report two numbers - catch rate on the attack set and false positive rate on the legitimate set - because either alone can be made perfect by breaking the other.\n\nThen keep it alive: every real attempt seen in production becomes a case, and periodically someone outside the team tries to break it, since the people who wrote the guardrails have the narrowest imagination about them.",
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
      "id": "gr-08",
      "q": "What does responsible AI mean in practice for a system you build?",
      "round": [
        "manager",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "guardrails",
        "responsible-ai",
        "governance",
        "bias"
      ],
      "why": "A hiring-manager question. The failure mode is answering with principles instead of mechanisms.",
      "simple": "The gap between the policy and the system is where this question lives, so answer with mechanisms.\n\nFairness: measure quality by segment, not just overall - by language, region, customer tier, and any group the domain makes relevant. A single average is where inequity hides. If one language sits ten points lower, you have a fairness problem regardless of intent.\n\nTransparency: users know they are talking to an AI system, answers carry citations, and the system says when it does not know.\n\nAccountability: a named owner, an audit trail of what was shown to whom, and a route for a user to challenge an outcome that affected them.\n\nHuman oversight: a person decides anything consequential - a claim, a credit outcome, a clinical suggestion - and their edits and rejections are logged and reviewed.\n\nAnd contestability, which people forget: if the system influenced a decision about a person, that person needs a way to question it and reach a human who can act.\n\nSay those as things you built, not values you hold.",
      "points": [
        "Fairness = measured by segment. Averages hide inequity.",
        "Transparency = disclosure, citations, and an honest \"I do not know\".",
        "Accountability = named owner, audit trail, challenge route.",
        "Human oversight on consequential decisions, with logged edits and rejections.",
        "Contestability - a person affected can question the outcome and reach a human.",
        "Answer with mechanisms. Principles alone read as a slide."
      ],
      "say": "In mechanisms rather than principles. Fairness means measuring quality by segment - language, region, customer tier - because a single average hides inequity. Transparency means disclosure, citations and an honest not-known. Accountability means a named owner and an audit trail of what was shown to whom. Human oversight on consequential decisions, with edits logged. And contestability: an affected person can question the outcome and reach a human.",
      "numbers": "Slice every quality metric by segment. A 0.9 average routinely hides a 0.6 segment, and that gap is the fairness finding.",
      "wrong": "Reciting fairness, accountability and transparency as values. Every candidate does. The mechanisms are what distinguish an answer.",
      "follow": "You found one language performs ten points worse. What do you do about it?"
    }
  ]
};
