/* Employer tracks.
   A track does not own questions. It reorders cards that already exist and adds
   the context that changes how you answer them — which is why this file is
   written last and holds only ids plus per-track framing.

   Grounding per track is stated in `grounding` and rendered on the page. No
   track claims a named company asked a named question. */

window.IR = window.IR || {};

window.IR.tracks = [
  {
    key: "healthcare",
    label: "Healthcare payer and provider",
    includes: "Optum, UnitedHealth Group, Philips, Siemens Healthineers, Novartis, and the India delivery centres of most US payers.",
    grounding: "public JDs for these employers' India centres + the regulatory regime they operate under",
    skew:
      "PHI handling and de-identification. HIPAA, and India's DPDP on top of it. Running Azure OpenAI inside a regulated tenant with nothing leaving it. Audit trails — who saw which document chunk, and can you produce that six months later. Clinical-document RAG over scanned PDFs that OCR badly. And above all, why a human stays in the loop for anything touching a care or coverage decision.",
    rounds:
      "Typically five: recruiter screen, a technical round on your GenAI depth, a design round that becomes a compliance conversation halfway through, a hiring manager round about ownership, and HR. The design round is the one that decides it, and it is usually where a security or privacy person joins.",
    watch:
      "The panel often includes someone whose job is to say no. Volunteer the control before they ask for it — say \"access control happens at retrieval, pre-filtered, never in the prompt\" unprompted, and the tone of the round changes.",
    /* ordered: the ten most likely, hardest-hitting first */
    ten: ["rag-09", "gr-03", "rag-08", "ag-12", "cd-06", "rag-04", "em-06", "gr-02", "cd-03", "sd-07"],
    scenario: {
      title: "Worked scenario — 40 minutes",
      prompt: "Design an assistant that answers coverage questions for 2,000 claims staff, over 40,000 pages of plan documents and a member database holding PHI.",
      moves: [
        "**Requirements first.** Who asks — staff, not members, so tone is internal but PHI exposure is still live. Peak QPS. Latency budget. Which documents change and how often. Which staff may see which member. What the current handling time is, because that is the success metric.",
        "**Draw the trust boundary before the architecture.** Everything in-tenant, private endpoint, no egress. Say this first — it is what the room is listening for.",
        "**Ingestion.** Scanned PDFs need OCR with a confidence score and a review queue for low-confidence pages. Tables extracted whole, plus an indexed summary. Page numbers retained so a citation points at the exact page.",
        "**Retrieval with entitlement pre-filter.** Access groups copied onto every chunk at ingestion; the query carries the staff member's groups as a hard pre-filter. Never post-filter. Re-sync on permission change, not only on text change.",
        "**Generation with mandatory citations,** validated against what was actually retrieved. Uncited claims are flagged, not shown.",
        "**Human in the loop** before anything that writes to a member record or communicates a coverage outcome. Approve, edit or reject, all logged.",
        "**Evaluation and audit.** Golden set labelled by a claims expert, not an engineer. Groundedness sampled in production. An audit log that can answer \"what did this user see on 12 March\" a year later.",
        "**Then say what you left out and why** — no member-facing channel in phase one, because the human-in-the-loop cost per interaction does not work at member volume yet."
      ]
    }
  },

  {
    key: "banking",
    label: "Banking and financial services",
    includes: "JPMorgan, Goldman Sachs, American Express, Wells Fargo, Deutsche Bank, and the large Indian private banks building internal GenAI platforms.",
    grounding: "public JDs + published model risk governance expectations + RBI data localisation rules",
    skew:
      "Auditability of every generated claim. Model risk governance — who signed off, against what evidence, and can it be re-run. Data residency, and whether inference may happen outside India at all. Deterministic fallbacks for when the model is unavailable or unsure. Text-to-SQL over sensitive schemas, and how you stop it reading a column it should not.",
    rounds:
      "Often six or more, and slower. Expect a dedicated round with risk or controls, separate from engineering. They will ask how you prove a change was safe, not just that it worked.",
    watch:
      "\"How would you roll this back?\" and \"who approved that?\" are asked literally, and a vague answer reads as a control gap. Have the version-pinning and evaluation-gate answers ready before you are asked.",
    ten: ["ops-03", "rag-08", "ev-06", "llm-10", "ar-08", "rag-14", "gr-06", "mcp-03", "ev-09", "sd-07"],
    scenario: {
      title: "Worked scenario — 40 minutes",
      prompt: "Build an internal assistant that answers analyst questions over research notes and a transactions warehouse. Answers must be defensible to an auditor.",
      moves: [
        "**Requirements first.** Who the users are, what decisions the answers feed, retention obligations, and whether inference may leave India. That last answer changes the design.",
        "**Route, do not blend.** \"How many transactions breached the threshold last quarter\" is SQL. \"What does our policy say about breaches\" is retrieval. Say the routing decision out loud — it is the mark.",
        "**Text-to-SQL safely.** Read-only connection, schema in context, a column allowlist, a statement validator, a row limit and a statement timeout. Generated SQL is untrusted input.",
        "**Citations and provenance.** Every claim carries its source; every number carries whether it came from the warehouse or from prose. Mark the difference explicitly — the warehouse number is exact and the prose is not.",
        "**Deterministic fallback.** When the model is unavailable or the retrieval score collapses, return the top matching documents and say the assistant could not answer. Never degrade silently into a guess.",
        "**Governance artefacts.** Pinned model version, prompt in version control, an evaluation gate that blocks release on a quality drop, and a stored history of every golden-set run with its date and versions. That history is what an auditor actually asks for.",
        "**Rollback story.** Model version, prompt and index each roll back independently, because they fail independently."
      ]
    }
  },

  {
    key: "retail",
    label: "Retail and supply chain",
    includes: "Walmart Global Tech, Target, Lowe's, Tesco, Maersk, Flipkart, and large Indian D2C platforms.",
    grounding: "public JDs + the cost and latency constraints of consumer-scale traffic",
    skew:
      "Cost per request at genuinely high volume — this is the track where token economics is a first-class interview subject rather than a footnote. Catalogue and product RAG, where the corpus is millions of short structured documents. Hard latency budgets, because the assistant sits in a purchase flow. Multilingual, because the customer base is. Caching at every layer.",
    rounds:
      "Usually four or five, with a strong design round focused on scale. Expect to be asked for numbers and to be pushed if you cannot produce them.",
    watch:
      "Every answer should carry a number. \"It depends\" without a figure lands badly here in a way it does not elsewhere — this panel is optimising a margin and wants to see you doing the same arithmetic.",
    ten: ["cl-01", "cl-06", "cl-03", "rag-13", "cl-07", "llm-01", "rag-11", "em-05", "cl-02", "pr-05"],
    scenario: {
      title: "Worked scenario — 40 minutes",
      prompt: "A product assistant on the catalogue: 8 million SKUs, 3,000 requests per minute at peak, 800 ms p95 budget, four languages.",
      moves: [
        "**Do the arithmetic out loud.** 3,000 rpm is 50 rps. At a naive 2,500 input tokens per request that is 125,000 tokens a second — price it, and the number itself makes the case for what follows.",
        "**The 800 ms budget rules things out.** A reranker at 200 ms may not fit. A generation-based query rewrite certainly does not. Say what you are cutting and why, before designing what stays.",
        "**Hybrid search is not optional.** SKU codes and part numbers are exact strings that embeddings blur. BM25 plus dense, fused with reciprocal rank fusion.",
        "**Route by intent.** Most catalogue traffic is lookup, not reasoning — serve it from retrieval plus a template, with no generation at all. Reserve the model for the minority that needs prose. This is the single largest cost decision.",
        "**Cache in layers.** Provider prompt caching on the stable prefix, an embedding cache, and an exact-match answer cache for the head of the query distribution — which in retail is very heavy. Keys include locale and any entitlement.",
        "**Multilingual honestly.** Indian-language answers cost 2–3× the tokens, so the per-request figure differs by locale. Cross-language retrieval needs a multilingual embedding model, tested per language, not assumed.",
        "**Then state the guardrail metrics:** cost per request, p95, and quality per language — because an average hides the language that is failing."
      ]
    }
  },

  {
    key: "product",
    label: "Product and platform",
    includes: "Microsoft IDC, Google, Salesforce, ServiceNow, Adobe, Intuit, Atlassian, and the India engineering centres of US product companies.",
    grounding: "public JDs + published interview processes for these employers",
    skew:
      "Depth on one system rather than breadth across ten. Evaluation rigour — expect to be asked how you proved a change helped, and then pushed on the answer twice more. Defending a trade-off under pressure, including one you got wrong. And a genuine coding round alongside the GenAI rounds.",
    rounds:
      "Four to six, including a real coding round and often a bar-raiser who is not from the hiring team. The bar-raiser is usually the one probing whether your depth is real.",
    watch:
      "You will be pushed on one answer until you either defend it with evidence or change your position. Both are passes. Repeating the original assertion more confidently is the failure.",
    ten: ["ev-03", "ev-10", "ev-02", "llm-06", "lg-11", "tf-03", "ft-01", "py-01", "py-04", "sd-01"],
    scenario: {
      title: "Worked scenario — 40 minutes",
      prompt: "You own an AI feature used by 200,000 people. Quality complaints are rising, your offline scores are flat, and the team wants to ship a new model next week.",
      moves: [
        "**Separate the two claims.** Complaints rising and offline scores flat cannot both be right about the same thing, so one of them is measuring the wrong quantity. That is the investigation.",
        "**Suspect the eval set first.** It probably no longer matches production traffic, or it was tuned against until it stopped testing anything. Take 50 real complaints and run them through the pipeline.",
        "**Slice everything.** A 0.9 average routinely hides a 0.6 segment — by language, by tenant, by input length, by document type. The complaining segment is usually one of those.",
        "**Check whether it is quality at all.** Latency, tone, or an answer that is correct but arrives after the user gave up all produce \"quality\" complaints.",
        "**Then the new model.** Shadow it on real traffic first, compare offline on the repaired eval set, then a canary for a full daily cycle with per-segment comparison. Do not ship into an unexplained regression — say that plainly, and say what you would need to see to change your mind.",
        "**Close the loop.** Confirmed failures become golden-set cases, so this investigation improves the harness rather than just fixing one week."
      ]
    }
  },

  {
    key: "services",
    label: "Services and consulting",
    includes: "TCS, Infosys, Wipro, Cognizant, Accenture, Deloitte, Capgemini, LTIMindtree, HCLTech.",
    grounding: "public JDs + the delivery economics of a client-funded engagement",
    skew:
      "Breadth over depth — you may be staffed on anything, so they check whether you can hold a conversation across the whole stack. Client framing: can you explain this to the person paying for it. Delivery estimates. Accelerators and reuse, because the economics depend on not building the same thing twice. Multi-cloud, because the client picks, not you.",
    rounds:
      "Often three: a technical screen, a technical round, and a client-facing or managerial round. The last one carries more weight here than at a product company, because you will be in front of a client.",
    watch:
      "You will be asked to explain something technical to a non-technical stakeholder, possibly on the spot. Practise the plain-language versions out loud — this is the one track where the `simple` slot matters as much as the `say` slot.",
    ten: ["ev-09", "rag-01", "sd-05", "sd-06", "ag-11", "sd-02", "em-07", "ml-07", "sd-03", "sd-04"],
    scenario: {
      title: "Worked scenario — 40 minutes",
      prompt: "A client wants \"an AI agent to automate our back office\". You have one call to scope it and they expect an estimate.",
      moves: [
        "**Do not accept the scope.** \"Automate the back office\" is not a project. Narrow it to one workflow with a countable volume and a measurable outcome — that reframing is most of the value you add on this call.",
        "**Ask what it costs today.** Volume, handling time, error rate, and who does it now. Without a baseline there is no business case and no way to prove success later.",
        "**Say where an agent is the wrong tool.** If the workflow is deterministic, it is automation, not an agent, and cheaper. Volunteering this builds more trust than agreeing would.",
        "**Reliability arithmetic, out loud.** Ninety-five percent per step over ten steps is about sixty percent end to end. So propose a three-or-four-step bounded loop with a deterministic pipeline around it.",
        "**Estimate in phases with a gate.** Discovery and a data audit; a pilot on one workflow with an agreed success metric and a kill criterion; then scale. Refuse to estimate the whole thing before the data audit — and say why, because the data is always worse than the client believes.",
        "**Name the human-in-the-loop point** and the running cost per transaction. A client who learns the running cost after go-live is a client you lose.",
        "**Then say what you would reuse** — accelerators, an existing evaluation harness — because that is the economics of this business and they are listening for it."
      ]
    }
  }
];
