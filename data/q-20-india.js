/* Interview content. Data-only file; page design lives in assets/. */
window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["20-india"] = {
  "lede": "Panels in India increasingly ask what the law and the regulator expect of your design, not just what the model can do. Most of it is phased or still in draft, so knowing what is in force today, and what lands in 2027, is itself a signal of seniority. The other half is engineering for Indian users: token inflation, Hinglish typed in Latin script, transliteration, voice-first channels and patchy networks. These cards give you dated, sourced answers you can say with confidence.",
  "grounding": "Primary sources verified in October 2026: the DPDP Act and DPDP Rules 2025 (MeitY Gazette), PIB releases, RBI, SEBI, IRDAI and CERT-In publications; Indic engineering from AI4Bharat papers and public benchmarks. Draft versus final status is stated on every card.",
  "evening": [
    "in-01",
    "in-04",
    "in-10",
    "in-11",
    "in-16"
  ],
  "cards": [
    {
      "id": "in-01",
      "q": "What do the DPDP Act and the DPDP Rules require of a GenAI system in India, and what is actually in force in October 2026?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "compliance",
        "privacy",
        "india"
      ],
      "why": "Whether you know the shape of India's data law and its phased dates, rather than reciting GDPR or claiming everything already applies. **Also asked as:** \"Is DPDP in force yet?\" · \"What does consent mean under DPDP?\"",
      "quick": [
        "Act passed August 2023; Rules notified in the Gazette in November 2025.",
        "Board provisions live now; Consent Manager registration from November 2026.",
        "Notice, safeguards, breach, rights and retention duties apply from May 2027.",
        "Consent must be specific to a stated purpose and as easy to withdraw.",
        "Design for May 2027 now - retrofitting a RAG stack is slow."
      ],
      "simple": "The Digital Personal Data Protection Act, 2023 is India's general law for digital personal data. The company that decides why and how data is processed is the **Data Fiduciary**, the person is the **Data Principal**, and anyone processing on the fiduciary's behalf - your model provider, vector database host or tracing SaaS - is a **Data Processor**. Processing needs either consent or one of the limited legitimate uses in Section 7. Consent must be free, specific, informed, unconditional and unambiguous, given by a clear affirmative action, and limited to the data necessary for the stated purpose. Rule 3 says the notice must itemise the data, state the specific purpose and give a way to withdraw consent as easily as it was given.\n\nThe Rules were notified by MeitY in November 2025 and phase in. Board-related rules applied at once, Consent Manager registration one year later, and the core duties - notice, security safeguards, breach intimation, retention, children's data, Significant Data Fiduciary duties and rights handling - eighteen months later, around May 2027.\n\nFor example, a bank's chatbot that logs every conversation needs a notice that names that logging and its purpose. Reusing those logs to train a model is a new purpose, not a free extra.",
      "points": [
        "Name the roles: fiduciary, principal, processor - and that the LLM vendor is a processor.",
        "Consent is purpose-specific; Section 7 legitimate uses are narrow.",
        "State the phasing: Nov 2025 notified, Nov 2026 consent managers, May 2027 core duties.",
        "Purpose limitation blocks silent reuse of chat logs for training.",
        "Penalties reach ₹250 crore for failing reasonable security safeguards."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Timeline of India's data protection law: Act passed August 2023, draft Rules January 2025, Rules notified November 2025, Consent Manager rules November 2026, core obligations around May 2027.",
        "caption": "**Phased, not switched on at once.** In October 2026 the Board exists, but most duties on a GenAI system bite from **around May 2027** - which is when your design has to be ready.",
        "lanes": [
          {
            "label": "DPDP Act",
            "note": "August 2023"
          },
          {
            "label": "Draft Rules",
            "note": "January 2025, consultation"
          },
          {
            "label": "Rules notified",
            "note": "November 2025, Board rules live",
            "accent": "accent"
          },
          {
            "label": "Consent Managers",
            "note": "about November 2026"
          },
          {
            "label": "Core duties",
            "note": "about May 2027",
            "accent": "warn"
          }
        ]
      },
      "say": "The DPDP Act 2023 is India's general personal data law, and the Rules that operationalise it were notified in November 2025 with a phased start. Today, in October 2026, the Board provisions are live, Consent Manager registration starts about a year after notification, and the duties that shape my design - notice, reasonable security safeguards, breach intimation, retention and erasure, data principal rights, children's data and Significant Data Fiduciary duties - apply from around May 2027. So I design for 2027 now. In practice my company is the Data Fiduciary, and the model provider, vector store and tracing tool are processors under contract. Consent has to be specific to a stated purpose, with an itemised notice and withdrawal as easy as giving it. That purpose limitation is the one that bites GenAI teams: chat logs collected to resolve tickets can't quietly become fine-tuning data. And the stakes are real - failing reasonable security safeguards can attract a penalty of up to 250 crore rupees.",
      "numbers": "Penalties in the Act's Schedule: up to ₹250 crore for failing to take reasonable security safeguards, up to ₹200 crore each for failing to notify a breach or for breaching children's-data obligations, and up to ₹50 crore for other violations. Rules notified November 2025; core obligations about 18 months later.",
      "verified": "2026-10",
      "wrong": "\"DPDP is basically GDPR, it is fully in force, and a consent checkbox covers us.\" The obligations are phased to around May 2027, the Act has its own grounds and definitions, and one blanket checkbox fails the specific-purpose and itemised-notice tests.",
      "follow": "Your support chatbot logs were collected to resolve tickets. Can you use them to fine-tune a model?",
      "followAnswer": "Not by default. The notice and consent were for resolving tickets, so training is a new purpose and I would need it covered - either a notice and consent that names it, or a basis my privacy counsel confirms. The cleaner route is often to de-identify first: strip names, phone numbers, Aadhaar and PAN, and free-text details, and check a sample by hand, because chat text leaks identity in ways regexes miss. I would also prefer using logs for evaluation over weight training, because data baked into weights is very hard to erase when someone later withdraws consent.",
      "builds": [
        "gr-03",
        "gr-06"
      ],
      "next": [
        "in-02",
        "in-03",
        "in-04"
      ],
      "deeper": [
        "in-dpdp-rules",
        "dpdp-act"
      ],
      "check": {
        "kind": "concept",
        "q": "In October 2026 a product manager says: \"DPDP has been fully enforceable since the Rules were notified, so our itemised notice must go live next week or we are in breach.\" What is accurate?",
        "options": [
          "Correct - every obligation commenced when the Rules were notified in November 2025.",
          "Nothing applies until the Data Protection Board decides its first case.",
          "Board provisions are live; notice, safeguards, breach and rights duties apply from about May 2027.",
          "Only Significant Data Fiduciaries are covered before 2028."
        ],
        "answer": 2,
        "why": "Rule 1 phases commencement: Board rules on notification, Rule 4 after one year, and Rules 3 and 5 to 16 - notice, safeguards, breach, rights - after eighteen months. The \"fully in force\" belief is the common error; the notice is still worth shipping early."
      }
    },
    {
      "id": "in-02",
      "q": "A user asks you to erase their personal data. What does that mean across a RAG and LLM stack under DPDP?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "privacy",
        "compliance",
        "rag",
        "india"
      ],
      "why": "Whether you can map a legal right onto every copy a GenAI system makes - chunks, embeddings, caches, traces and weights - rather than deleting one database row.",
      "quick": [
        "Rights: access, correction, completion, updating, erasure, grievance, nomination.",
        "Publish the grievance route; respond within ninety days at most.",
        "Personal data spreads: chunks, embeddings, BM25, caches, memory, traces, eval sets.",
        "Tag every derived copy with a principal id so deletion is one query.",
        "Keep personal data out of weights - you cannot cleanly erase it."
      ],
      "simple": "Under the DPDP Act a Data Principal can ask for a summary of their data and processing, correction, completion, updating and erasure, can raise a grievance and can nominate someone to act for them. The Rules require the fiduciary to publish how to make these requests and to respond within a period not exceeding ninety days. Erasure is also triggered when consent is withdrawn or the purpose is no longer served, unless another law requires retention.\n\nA GenAI system makes many copies. One customer email can become chunks in a vector index, sparse terms in BM25, an entry in a semantic cache, a line in conversation memory, a span in your trace store and a row in an evaluation set. So you build lineage at ingestion: every derived record carries the source id and a principal id, and erasure becomes a delete-by-key across each store, followed by a re-check that retrieval no longer returns it.\n\nFor example, if the semantic cache keyed only on query embeddings, a cached answer quoting the customer's address would survive deletion of the source. There is one tension to plan for: Rule 8(3) requires retaining processing logs for at least a year for security purposes, so serving paths are purged while access-controlled logs are kept for their legal period.",
      "points": [
        "List every store that holds a derived copy, including caches and traces.",
        "Principal id and source id on every chunk, cache entry and trace.",
        "Delete-by-key, then verify retrieval and cache no longer return it.",
        "Separate serving data from legally retained security logs.",
        "Never fine-tune on raw personal data you may have to erase."
      ],
      "say": "I treat erasure as a lineage problem, because a GenAI system copies data everywhere. One customer document becomes chunks and embeddings in the vector index, terms in the keyword index, possibly an answer in a semantic cache, lines in conversation memory, spans in tracing and maybe a row in an eval set. So at ingestion every derived record carries a source id and a principal id, and an erasure request becomes a delete-by-key across each store, followed by a test that retrieval and the cache no longer surface it. Under DPDP the fiduciary has to publish how people make requests and respond within ninety days, and erasure also follows withdrawal of consent. The trap is weights: if personal data went into fine-tuning, I can't cleanly remove it, so I keep it out of training in the first place. And I separate serving data from the processing logs the Rules require us to keep for a year, which stay locked down rather than searchable.",
      "numbers": "Rule 14(3): respond to grievances within a period not exceeding ninety days. Rule 8(3): retain personal data, traffic data and processing logs for at least one year for the purposes in the Seventh Schedule. Large e-commerce, gaming and social media fiduciaries must erase after three years of inactivity, with 48 hours' notice (Rule 8 and Third Schedule).",
      "verified": "2026-10",
      "wrong": "\"We delete the user's row in the CRM and re-embed nightly.\" The cache, memory, traces and eval sets still hold the data, and any fine-tuned weights cannot be re-embedded away.",
      "follow": "The data was used to fine-tune a model last quarter. What now?",
      "followAnswer": "First I would be honest about what is possible: there is no reliable way to surgically remove one person's data from trained weights. So I would check how it was used - if the training set was properly de-identified, the request may not touch the weights at all. If it was not, I would remove the records from the training set, retrain or re-fine-tune from the cleaned set on the next release cycle, and record the decision and timeline with privacy counsel. Then I would fix the cause: a gate that blocks raw personal data from entering any training set in future.",
      "builds": [
        "rag-10",
        "gr-03"
      ],
      "next": [
        "in-03",
        "gr-17",
        "cl-20"
      ],
      "deeper": [
        "in-dpdp-rules",
        "dpdp-act"
      ],
      "check": {
        "kind": "which-fails",
        "q": "After an erasure request you delete the source document and its chunks from the vector index. Which copy is most likely to still show the customer's data in an answer tomorrow?",
        "options": [
          "The embedding model's weights.",
          "A semantic cache entry keyed on a similar question.",
          "The BM25 index, which rebuilds from the vector store.",
          "The LLM provider's base model."
        ],
        "answer": 1,
        "why": "A semantic cache stores whole answers and is keyed on query similarity, not on source documents, so it survives source deletion unless entries carry source ids. The embedding model and base model never saw this customer's document."
      }
    },
    {
      "id": "in-03",
      "q": "Can an Indian company send prompts containing personal data to a model hosted outside India? What changes for a Significant Data Fiduciary?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "compliance",
        "privacy",
        "cloud",
        "india"
      ],
      "why": "Whether you know DPDP's real cross-border position - permitted unless restricted - and that sector rules and SDF duties override the default.",
      "quick": [
        "DPDP default: transfer allowed unless government notifies a restricted country.",
        "Stricter sector laws still win - RBI payment data stays in India.",
        "SDFs: India-based DPO, independent auditor, yearly DPIA and audit.",
        "Government may require specified SDF data to stay in India.",
        "Check sector rules and the notified list before choosing a region."
      ],
      "simple": "DPDP takes a negative-list approach. Section 16 lets the Central Government restrict transfers to countries it notifies, so the default is that transfer is allowed. Rule 15 adds that fiduciaries must meet any requirements the government specifies about making data available to a foreign State. But Section 16(2) keeps any other Indian law that is stricter, which is why sector rules matter more than DPDP for many GenAI designs. RBI requires payment system data to be stored only in India, and insurers face IRDAI's cyber security rules.\n\nThe government can also notify a company as a **Significant Data Fiduciary**, based on volume and sensitivity of data, risk to people, and national factors. An SDF must appoint a Data Protection Officer based in India who answers to the board, appoint an independent data auditor, and under Rule 13 run a Data Protection Impact Assessment and audit every twelve months, check that its algorithmic software does not risk people's rights, and keep personal data that a government committee specifies inside India.\n\nFor example, a large consumer app sending chat prompts to a US-region endpoint may be fine under DPDP alone, but if the prompts contain UPI transaction details, RBI's localisation rule decides the region.",
      "points": [
        "Section 16 is a negative list, not a whitelist.",
        "Section 16(2): stricter sector law prevails.",
        "SDF: DPO in India, independent auditor, annual DPIA and audit, algorithm due diligence.",
        "Rule 13(4) can localise specified SDF data and its traffic data.",
        "Choose regions by data class, not by default (see cd-19)."
      ],
      "say": "Under DPDP itself, yes by default. Section 16 is a negative list: the government can restrict transfers to countries it notifies, so unless a destination is restricted, transfer is permitted, subject to any requirements under Rule 15. But that is rarely the end of it, because Section 16(2) preserves stricter Indian laws. If the prompts carry payment transaction data, RBI's localisation rule means storage in India only, and a regulated insurer has IRDAI's cyber rules on top. So I classify the data in the prompt first, then pick the region. If the company is notified as a Significant Data Fiduciary, it needs a Data Protection Officer based in India, an independent data auditor, a yearly impact assessment and audit, due diligence on its algorithmic software, and it can be told to keep specified data in India. In practice, for regulated data I default to in-country inference, which Azure, AWS and Google all now offer for at least some models.",
      "numbers": "Rule 13(1): a Significant Data Fiduciary runs a Data Protection Impact Assessment and an audit once in every twelve months and reports significant observations to the Board.",
      "verified": "2026-10",
      "wrong": "\"DPDP bans sending personal data abroad, so we can't use any foreign model.\" The Act permits transfer unless a country is notified as restricted - the binding constraints usually come from sector regulators and contracts.",
      "follow": "The model you want is not offered in an Indian region. What do you take to the risk committee?",
      "followAnswer": "Three options with their trade-offs. One: an in-region model that is slightly weaker, measured on our own eval set so the quality gap is a number, not a feeling. Two: the foreign-region model with the prompt minimised and personal data redacted or tokenised before it leaves, if the data classes allow processing abroad at all - payment data does not. Three: a self-hosted open-weight model in our own Indian region or data centre. I would recommend based on the data classification and the measured quality gap, and I would name who signs off on the residual risk.",
      "builds": [
        "gr-06",
        "in-01"
      ],
      "next": [
        "cd-19",
        "in-06",
        "ft-24"
      ],
      "deeper": [
        "dpdp-act",
        "in-dpdp-rules"
      ],
      "check": {
        "kind": "concept",
        "q": "A fintech wants to send support prompts that include UPI transaction ids and amounts to a model endpoint in Singapore. Under DPDP alone this may be permitted. What decides it?",
        "options": [
          "Nothing else - DPDP is the only law that governs personal data.",
          "RBI's payment data storage rule, which DPDP's Section 16(2) preserves.",
          "Whether the user ticked a consent box for cross-border transfer.",
          "CERT-In's 180-day log rule, which bans foreign processing."
        ],
        "answer": 1,
        "why": "Section 16(2) keeps stricter Indian laws in force, and RBI requires payment system data to be stored only in India. Consent cannot override a sector localisation rule, and CERT-In's rule is about where logs are kept, not a ban on processing."
      }
    },
    {
      "id": "in-04",
      "q": "Your LLM assistant showed one customer another customer's data. What are your reporting clocks in India?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "compliance",
        "security",
        "india"
      ],
      "why": "Incident handling in India runs on short statutory clocks. The panel wants to hear six hours before you mention a postmortem.",
      "quick": [
        "CERT-In: report listed incidents within 6 hours of noticing.",
        "Data breach, data leak and attacks on AI/ML systems are all listed.",
        "Keep ICT logs 180 days, within Indian jurisdiction.",
        "DPDP from May 2027: Board without delay, details within 72 hours.",
        "Sector regulators add their own: IRDAI wants a copy, RBI and SEBI too."
      ],
      "simple": "India's fastest clock is CERT-In's. Its Directions of 28 April 2022 under Section 70B of the IT Act require service providers, intermediaries, data centres and body corporates to report the incident types in Annexure I within **6 hours** of noticing them. The list includes data breach, data leak and, explicitly, attacks or malicious activity affecting systems and applications related to Artificial Intelligence and Machine Learning. CERT-In's FAQ allows you to report what you know at the time and send the rest later. The same Directions require ICT system logs to be kept for a rolling 180 days within Indian jurisdiction.\n\nDPDP adds a second track from around May 2027. Rule 7 requires the fiduciary to tell each affected person without delay, and to tell the Data Protection Board without delay and then within 72 hours send a detailed report covering cause, mitigation and the notices sent. Regulated entities also have sector routes: IRDAI requires a copy of the CERT-In report, and banks and market intermediaries report to their regulators too.\n\nFor example, a cross-tenant leak caused by a missing retrieval filter is a data leak on day one. Your runbook should decide in advance who files at hour five, not debate it at hour seven.",
      "points": [
        "Contain first: kill switch or disable the retrieval path.",
        "Six-hour CERT-In report with what is known; update later.",
        "Preserve traces and logs - 180 days in India is the baseline.",
        "From May 2027: affected people and the Board, detailed report within 72 hours.",
        "Pre-agree owners and templates in the runbook."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of three Indian reporting tracks for an LLM data leak: CERT-In, the Data Protection Board and affected users, by deadline, legal basis and what to send.",
        "caption": "**Three audiences, three clocks.** The six-hour CERT-In report comes first and can be partial; the DPDP track starts once Rule 7 commences around May 2027.",
        "aspects": [
          "Deadline",
          "Basis",
          "What you send"
        ],
        "columns": [
          {
            "label": "CERT-In",
            "note": "in force since 2022",
            "accent": "warn",
            "cells": [
              "6 hours from noticing",
              "IT Act s.70B Directions",
              "Incident facts known so far"
            ]
          },
          {
            "label": "Data Protection Board",
            "note": "from about May 2027",
            "cells": [
              "Without delay, then 72 hours",
              "DPDP Rule 7(2)",
              "Cause, mitigation, notices sent"
            ]
          },
          {
            "label": "Affected users",
            "note": "from about May 2027",
            "cells": [
              "Without delay",
              "DPDP Rule 7(1)",
              "What happened, risks, what to do"
            ]
          }
        ]
      },
      "say": "The first clock is CERT-In's: six hours from noticing it. Their 2022 Directions list data breaches and data leaks, and they explicitly list attacks on AI and ML systems, so a cross-customer leak from my assistant is reportable, and CERT-In accepts a partial first report. So my sequence is: contain within minutes, usually by switching off the retrieval path or flipping a kill switch; preserve traces and logs, which we keep for 180 days in India anyway; and have the named owner file within six hours. In parallel the sector regulator - IRDAI wants a copy of the CERT-In report, and banks and SEBI-regulated firms have their own routes. Once the DPDP Rules' core provisions commence around May 2027, we also notify every affected person without delay and the Data Protection Board, with a detailed report within 72 hours. None of that works if it is decided during the incident, so the runbook names who files, the templates and the decision tree in advance.",
      "numbers": "CERT-In: 6 hours to report; ICT logs kept for a rolling 180 days within Indian jurisdiction; system clocks synchronised to NIC or NPL NTP servers or ones traceable to them. DPDP Rule 7: detailed report to the Board within 72 hours, extendable on written request.",
      "verified": "2026-10",
      "wrong": "\"We investigate fully, fix the bug and then decide whether it was reportable.\" Six hours runs out long before root cause; the CERT-In report is designed to be filed with partial information.",
      "follow": "A prompt injection attempt was caught by your guardrail and nothing leaked. Is that reportable?",
      "followAnswer": "Possibly, and I would not decide that alone at the keyboard. CERT-In's list includes malicious or suspicious activity affecting AI and ML applications, which is wider than successful breaches. In practice the runbook classifies in advance: a blocked, routine injection string is logged and trended, while a targeted or repeated campaign against our assistant, or anything that touched data or tools, goes to the CISO as a candidate for reporting within the six hours. The CISO and legal make the call, and the logs and traces I preserved are what lets them make it quickly.",
      "builds": [
        "gr-25",
        "gr-23"
      ],
      "next": [
        "ops-24",
        "in-08",
        "in-05"
      ],
      "deeper": [
        "cert-in-2022",
        "in-certin-faq"
      ],
      "check": {
        "kind": "judgement",
        "q": "Your RAG assistant leaked another tenant's document at 10:00. Root cause is unclear. It is now 14:30. What is the best next step?",
        "options": [
          "Keep investigating; filing without a root cause would mislead CERT-In.",
          "File the CERT-In report now with known facts, and update it as the investigation continues.",
          "Wait for the DPDP Board's 72-hour window, which replaces CERT-In for personal data.",
          "Notify the affected tenant only, since no attacker was involved."
        ],
        "answer": 1,
        "why": "The six-hour clock ends at about 16:00 and CERT-In accepts partial information. DPDP's 72-hour report is an additional track, not a replacement, and a leak counts as an incident whether or not an attacker caused it."
      }
    },
    {
      "id": "in-05",
      "q": "You are building a GenAI assistant for an Indian bank. What does RBI expect - and which of it is binding today?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "compliance",
        "responsible-ai",
        "india"
      ],
      "why": "Banking panels test whether you can separate a committee report, a draft guidance and a binding direction - and still design to all three.",
      "quick": [
        "FREE-AI report, August 2025: 7 Sutras, 26 recommendations, 6 pillars.",
        "It is a committee report - recommendations, not binding directions.",
        "Draft Model Risk Management guidance, June 2026: covers AI/ML and vendor models.",
        "Draft asks for tiering, independent validation, kill switches, human oversight.",
        "Customers told they face AI, with an option to reach a human."
      ],
      "simple": "RBI's thinking arrives in layers. In August 2025 it published the report of its committee on a Framework for Responsible and Ethical Enablement of AI, **FREE-AI**. It sets out seven Sutras - trust, people first, innovation over restraint, fairness, accountability, understandable by design, and safety and resilience - and 26 recommendations across six pillars. For regulated entities the practical ones are a board-approved AI policy, AI in the product approval process, red teaming, a business continuity plan for AI systems, AI incident reporting, an AI inventory, AI audits and disclosures to customers. It also suggests a more tolerant supervisory stance for a first-time failure where safeguards such as incident reporting and red teaming were in place.\n\nIn June 2026 RBI released draft **Guidance on Regulatory Principles for Model Risk Management**, with comments due by 24 July 2026. It covers all models, including third-party and AI/ML models: risk tiering that considers how autonomously outputs drive decisions, independent validation by the bank whatever the vendor certifies, override and kill-switch arrangements, human oversight, controls against hallucination, red teaming for generative models, and AI disclosure with a route to a human. As of October 2026 it was still a draft.\n\nFor example, a vendor chatbot still needs the bank's own validation and an inventory entry.",
      "points": [
        "Status first: report (recommendations), draft guidance, existing binding directions.",
        "Board-approved AI policy and an AI inventory are the starting artefacts.",
        "Vendor model risk stays with the bank; validate independently.",
        "Kill switch, human oversight and a human route for customers.",
        "Design to the draft now; it is the direction of travel."
      ],
      "say": "I'd separate three layers. FREE-AI, RBI's committee report from August 2025, gives seven Sutras and 26 recommendations across six pillars, but it's recommendations, not binding directions. The ones that shape my design are a board-approved AI policy, AI in product approval, red teaming, an AI business continuity plan, AI incident reporting, an inventory and audits, and customer disclosures. Then the draft Model Risk Management guidance from June 2026, which explicitly covers AI/ML and third-party models. It's still a draft as of now, but it tells you where supervision is heading: tier models by materiality and autonomy, validate them independently even if the vendor is certified, have kill-switch and override arrangements, keep humans in or on the loop, control hallucination, red-team generative models, and tell customers when they are dealing with AI, with a way to reach a person. Underneath sit binding rules like cyber security and payment data localisation. So my assistant ships with an inventory entry, an eval and red-team pack, a kill switch and a human handoff.",
      "numbers": "FREE-AI: 7 Sutras, 26 recommendations, 6 pillars (report released 13 August 2025). Draft MRM guidance: press release 24 June 2026, comments by 24 July 2026; on finalisation it would supersede Chapter 3 of RBI's 2002 credit risk guidance note.",
      "verified": "2026-10",
      "wrong": "\"RBI has issued binding AI rules under FREE-AI, so we just follow the checklist.\" FREE-AI is a committee report and the model risk guidance is a draft - saying otherwise in a bank interview signals you have not read either.",
      "follow": "The bank wants to use a vendor's hosted LLM. What do you need from the vendor?",
      "followAnswer": "Enough to validate it ourselves, because the draft guidance is explicit that the bank stays accountable and must validate third-party models independently. So I need documentation of the model and its intended use, notice of version changes or auto-updates, audit and access rights for us and the supervisor, data handling terms covering location, retention and training use, and exit and continuity arrangements. Where the vendor cannot disclose enough, I compensate with tighter scope, our own eval and red-team results, stronger human review and a fallback path. And I check concentration - how much of the bank would stop if this one provider failed.",
      "builds": [
        "gr-08",
        "ev-12"
      ],
      "next": [
        "ft-24",
        "in-06",
        "ops-22"
      ],
      "deeper": [
        "in-rbi-freeai",
        "in-rbi-mrm-draft"
      ],
      "check": {
        "kind": "concept",
        "q": "A colleague says the bank's vendor chatbot needs no internal validation because the vendor holds a recognised AI certification. Under RBI's June 2026 draft model risk guidance, what is the expectation?",
        "options": [
          "Vendor certification is sufficient for third-party models.",
          "The bank validates independently, whatever the vendor certifies, and stays accountable.",
          "Only credit models need validation; chatbots are out of scope.",
          "Validation is needed only after the first customer complaint."
        ],
        "answer": 1,
        "why": "The draft applies to all models including third-party and AI/ML ones, and requires independent validation notwithstanding vendor certification. Treating certification as sufficient is the tempting shortcut it explicitly rules out."
      }
    },
    {
      "id": "in-06",
      "q": "Your assistant answers questions for a payments app. How does RBI's payment data localisation rule change the design?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "compliance",
        "privacy",
        "cloud",
        "india"
      ],
      "why": "Payment data localisation is binding and old enough that panels assume you know it - and new enough that GenAI teams break it through traces and caches.",
      "quick": [
        "RBI 2018: payment system data stored only in India.",
        "Covers end-to-end transaction details and customer data such as PAN.",
        "Processing abroad allowed; delete and return within 24 hours or a business day.",
        "Prompts, traces, caches and vector stores holding it count as storage.",
        "Default to in-India inference and in-India observability."
      ],
      "simple": "RBI's April 2018 directive on storage of payment system data requires payment system operators to store the entire data relating to payment systems only in India. RBI's FAQ of June 2019 says this covers end-to-end transaction details and payment or settlement information, including customer data such as name, mobile number, email, Aadhaar and PAN where applicable. It applies to authorised payment system operators and to banks operating in India. Processing outside India is not barred, but data processed abroad must be deleted from foreign systems and brought back to India within one business day or 24 hours from payment processing, whichever is earlier.\n\nThe GenAI trap is that copies are storage. A support assistant that pastes a customer's last five UPI transactions into a prompt creates copies in the provider's request logs, your trace platform, a semantic cache, conversation memory and possibly an eval dataset. If any of those sit outside India and keep data beyond the window, the design is non-compliant even if the model itself is in an Indian region.\n\nFor example, a team with inference in Mumbai but a SaaS tracing tool hosted abroad capturing full prompts has quietly moved transaction data out of the country.",
      "points": [
        "Classify which fields are payment system data before prompt design.",
        "Model endpoint, traces, caches and memory all in Indian regions.",
        "Check provider abuse-monitoring retention and its location.",
        "Mask or tokenise transaction data in anything leaving India.",
        "Get compliance sign-off on the data-flow diagram, not the model choice."
      ],
      "say": "RBI's 2018 directive says payment system data is stored only in India, and the 2019 FAQ makes clear that covers end-to-end transaction details and customer data such as name, mobile, Aadhaar and PAN. Processing abroad isn't banned, but anything processed abroad must be deleted there and brought back within one business day or 24 hours, whichever is earlier. For a GenAI assistant the danger isn't the model, it's the copies. The prompt that carries the last five transactions ends up in provider logs, my traces, a semantic cache, conversation memory, maybe an eval set. So I draw the data flow and make every one of those in India: in-region inference, self-hosted or in-region tracing, caches and memory in the same region, and masked transaction fields anywhere data could leave. I also check the provider's retention and abuse-monitoring terms, because 'processed in India' is meaningless if logs are kept elsewhere for a month.",
      "numbers": "RBI FAQ (26 June 2019): data processed outside India must be deleted from foreign systems and brought back not later than one business day or 24 hours from payment processing, whichever is earlier.",
      "verified": "2026-10",
      "wrong": "\"The model runs in an Indian region, so we are compliant.\" Traces, caches and provider logs are storage too, and a foreign-hosted tracing tool capturing full prompts breaks the rule.",
      "follow": "Your observability vendor only has US and EU regions. What do you do?",
      "followAnswer": "I would not send it raw prompts. Options, in order of preference: self-host an open-source tracing stack such as Langfuse in our Indian region; keep the vendor but send only metadata - latencies, token counts, model versions, hashed ids - with payloads stored in India and linked by id; or mask payment fields before export with a tested redaction step. I would document which option compliance approved, and add a test in CI that fails if a raw transaction field ever appears in an exported span.",
      "builds": [
        "gr-06",
        "in-03"
      ],
      "next": [
        "cd-19",
        "gr-23"
      ],
      "deeper": [
        "rbi-payment-data",
        "in-rbi-payment-faq"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Inference runs in an Indian cloud region. Which component most likely breaks RBI's payment data storage rule?",
        "options": [
          "Embedding model weights downloaded from a foreign repository.",
          "A foreign-hosted tracing SaaS that stores full prompts for 30 days.",
          "An English system prompt written by a team abroad.",
          "A load balancer health check from another region."
        ],
        "answer": 1,
        "why": "Full prompts containing transaction details stored abroad for 30 days exceed the one-business-day or 24-hour window. Weights, system prompts and health checks contain no payment data."
      }
    },
    {
      "id": "in-07",
      "q": "A brokerage wants an AI assistant for clients. What is SEBI's position on AI/ML use by market intermediaries?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "compliance",
        "responsible-ai",
        "india"
      ],
      "why": "Whether you know which SEBI rule already binds (sole responsibility for AI output) and which is still a proposal - and what it means for logging and testing.",
      "quick": [
        "Regulation 16C, in force February 2025: the firm is solely responsible.",
        "Covers in-house and third-party AI, at any scale of use.",
        "Responsible for investor data, the tool's output and legal compliance.",
        "June 2025 consultation: disclosures, shadow testing, five-year input-output records.",
        "Final guidelines not yet issued as of October 2026."
      ],
      "simple": "SEBI already has one binding rule. Regulation 16C of the SEBI (Intermediaries) Regulations, inserted with effect from 10 February 2025, says any person regulated by SEBI that uses AI and ML tools - built in-house or bought from a third party, whatever the scale - is **solely responsible** for the privacy, security and integrity of investors' data, for the output of those tools, and for compliance with the law. Parallel amendments cover stock exchanges, clearing corporations and depositories. So \"the vendor's model said it\" is not a defence.\n\nIn June 2025 SEBI consulted on fuller guidelines for responsible AI/ML use. The proposals include a governance structure with skilled oversight, disclosure to clients where AI is used in operations that directly affect them such as algorithmic trading, portfolio management and advisory, testing in an environment segregated from live, shadow testing with live traffic before deployment, and keeping input and output data and model documentation for at least five years. It proposed a lighter regime for internal uses such as compliance, surveillance and cyber security. As of October 2026 the final guidelines had been announced as coming but not issued.\n\nFor example, a client-facing assistant that suggests trades needs disclosure, logs and an accountable owner today.",
      "points": [
        "Lead with 16C: sole responsibility, including for vendor models.",
        "Client-affecting uses need disclosure; internal uses lighter.",
        "Segregated testing plus shadow testing on live traffic.",
        "Plan for five-year input and output retention.",
        "Advice-like output needs human review and suitability checks."
      ],
      "say": "One rule already binds. Regulation 16C of the Intermediaries Regulations, in force since February 2025, makes any SEBI-regulated firm that uses AI or ML - in-house or third-party, at any scale - solely responsible for investor data, for the tool's output and for legal compliance. So a vendor model's mistake is the brokerage's mistake. Then there's the June 2025 consultation on fuller guidelines, which as of October 2026 hadn't been issued in final form. It points to what to build anyway: disclose AI use to clients where it affects them, such as advisory or portfolio services; test in a segregated environment and shadow-test on live traffic before go-live; and keep inputs, outputs and model documentation for at least five years so outcomes are traceable. For the assistant, that means every answer is logged with model and prompt versions, anything that looks like investment advice goes through suitability checks and human review, and there's a named accountable owner.",
      "numbers": "Regulation 16C effective 10 February 2025. June 2025 consultation (comments by 11 July 2025) proposed storing AI/ML input and output data for at least 5 years.",
      "verified": "2026-10",
      "wrong": "\"SEBI has no AI rules yet, so we can launch and adapt later.\" Regulation 16C already makes the firm solely responsible for AI output and data, whoever built the model.",
      "follow": "How would you implement five-year input and output retention without creating a privacy problem?",
      "followAnswer": "I would store records in an append-only, access-controlled archive in India, separate from the serving path - prompt, retrieved sources, model and prompt versions, output and the human decision if there was one. Access goes through a logged request process, not ad hoc queries. Personal data in the records is kept because the purpose is regulatory, and that purpose is stated in the notice. I would encrypt with keys the firm controls and set the deletion job to the retention date, so the archive doesn't silently become permanent.",
      "builds": [
        "gr-08",
        "ops-03"
      ],
      "next": [
        "gr-23",
        "ops-16",
        "in-05"
      ],
      "deeper": [
        "in-sebi-intermediaries",
        "in-sebi-aiml-cp"
      ],
      "check": {
        "kind": "concept",
        "q": "A brokerage's assistant, built on a third-party model, gives a client a misleading answer. Under SEBI's Regulation 16C, who is responsible for that output?",
        "options": [
          "The third-party model provider, since it built the model.",
          "Nobody until SEBI issues its final AI/ML guidelines.",
          "The brokerage, solely - whether the tool is in-house or procured.",
          "Responsibility is shared equally between the brokerage and vendor."
        ],
        "answer": 2,
        "why": "Regulation 16C, in force since February 2025, makes the regulated person solely responsible for output from AI tools it uses, in-house or third-party. The pending guidelines don't change that, which is why waiting is the trap."
      }
    },
    {
      "id": "in-08",
      "q": "You are deploying a GenAI claims assistant for an Indian insurer. Which IRDAI cyber security expectations shape the design?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "compliance",
        "security",
        "cloud",
        "india"
      ],
      "why": "Insurance panels check you know the current IRDAI guidelines and how a hosted model fits a vendor and cloud regime that was not written for LLMs.",
      "quick": [
        "IRDAI Information and Cyber Security Guidelines 2026 replaced the 2023 version.",
        "Report cyber incidents to CERT-In in 6 hours, copy to IRDAI.",
        "ICT logs kept 180 days within Indian jurisdiction.",
        "Cloud only from MeitY-empanelled providers with a valid STQC audit.",
        "Not AI-specific - the model provider is treated as a vendor."
      ],
      "simple": "IRDAI issued revised Information and Cyber Security Guidelines in April 2026, replacing the 2023 guidelines, with compliance expected from the current financial year. They apply to insurers including foreign reinsurance branches, intermediaries such as brokers, corporate agents, web aggregators and TPAs, and the Insurance Information Bureau.\n\nSeveral clauses land directly on a GenAI system. Cyber incidents must be reported to CERT-In within 6 hours of noticing, with a copy to IRDAI. ICT infrastructure logs are kept for a rolling 180 days within Indian jurisdiction and protected against tampering. Cloud services are to be taken only from MeitY-empanelled cloud providers whose data centre holds a valid STQC audit status, with an NDA and a contract that requires the provider to erase all traces of data at termination. Governance tightened too: the CISO must not report to the head of IT and carries no business targets, the security risk committee meets quarterly, and audit gaps are to be closed within 12 months.\n\nThe guidelines are not written about LLMs. For example, a hosted model API is a cloud and supply-chain dependency, so the question is whether its provider and region fit the empanelment and contract clauses - which is a procurement fact to check, not an assumption.",
      "points": [
        "Name the 2026 guidelines, not only the 2023 ones.",
        "6-hour CERT-In report with copy to IRDAI.",
        "Logs 180 days in India; traces count.",
        "MeitY-empanelled cloud with STQC audit; exit and data-wipe clauses.",
        "Map the model API into vendor and cloud risk processes."
      ],
      "say": "IRDAI replaced its 2023 cyber guidelines with a 2026 version in April this year, applying to insurers and intermediaries from the current financial year. Four things shape my design. Incidents go to CERT-In within six hours with a copy to IRDAI, so the assistant's runbook includes that. ICT logs are kept for 180 days within Indian jurisdiction, and I treat LLM traces as ICT logs. Cloud services must come from MeitY-empanelled providers whose data centres hold a valid STQC audit, with an NDA and a contract that makes the provider wipe our data at exit - so whether a given model endpoint and region qualifies is a procurement check I do before architecture, not after. And governance: an independent CISO, a quarterly security risk committee and an annual audit. The guidelines aren't AI-specific, so I map the model provider into vendor and cloud risk like any critical supplier, and add the AI-specific pieces - evals, red teaming, human review on claim decisions - on top.",
      "numbers": "IRDAI circular ref IRDAI/GA&HR/CIR/MISC/51/4/2026, dated 6 April 2026. Logs: rolling 180 days within Indian jurisdiction. Board to ensure audit gaps close within 12 months of reporting.",
      "verified": "2026-10",
      "wrong": "\"IRDAI has no rules on AI, so normal cloud deployment is fine.\" The 2026 guidelines constrain which cloud providers, where logs live and how fast incidents are reported - all of which apply to an LLM stack.",
      "follow": "The best model for claims is only available through a provider that is not on the empanelled list. What do you do?",
      "followAnswer": "I raise it as a procurement and risk decision early, with evidence. I would measure the gap on our own claims eval set between that model and the best option from an empanelled provider or a self-hosted open-weight model. If the gap is small, the decision makes itself. If it is large, I take the options to the CISO and risk committee: the compliant alternative with its measured quality, or an exception process with documented risk and compensating controls, if the guidelines and our policy allow one. I would not route around the rule quietly.",
      "builds": [
        "gr-06",
        "in-04"
      ],
      "next": [
        "sd-14",
        "cd-19",
        "ft-24"
      ],
      "deeper": [
        "in-irdai-cyber-2026",
        "cert-in-2022"
      ],
      "check": {
        "kind": "concept",
        "q": "An insurer's GenAI team stores full LLM traces in its own Indian region for 30 days to save cost. Which IRDAI 2026 requirement does that most likely miss?",
        "options": [
          "ICT logs kept for a rolling 180 days within Indian jurisdiction.",
          "Traces must be deleted within 24 hours.",
          "Traces may only be stored on-premises, never in cloud.",
          "Nothing - LLM traces are not ICT logs."
        ],
        "answer": 0,
        "why": "The guidelines require ICT infrastructure logs for a rolling 180 days in India, aligned with CERT-In. Treating traces as outside scope is the tempting error; they record who accessed what, which is exactly what an investigation needs."
      }
    },
    {
      "id": "in-09",
      "q": "What are IndiaAI, Sarvam, AI4Bharat and Bhashini - and when would you use each in a product?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "india",
        "multilingual",
        "open-weights"
      ],
      "why": "Indian panels expect you to know the local ecosystem accurately and to choose by measured quality, not by slogan.",
      "quick": [
        "IndiaAI Mission: approved March 2024, ₹10,371.92 crore outlay.",
        "Funds compute, datasets and sovereign foundation models; Sarvam selected first.",
        "Sarvam: company offering Indic LLMs, speech and translation APIs.",
        "AI4Bharat: IIT Madras lab releasing open Indic models and datasets.",
        "Bhashini: MeitY's language platform - translation, speech, transliteration APIs."
      ],
      "simple": "**IndiaAI Mission** is the government programme approved by the Cabinet on 7 March 2024 with an outlay of ₹10,371.92 crore, run by the IndiaAI division of Digital India Corporation. It funds shared GPU compute, datasets, startups and indigenous foundation models. In April 2025 it selected Sarvam AI to build a sovereign LLM, then Soket AI, Gnani AI and Gan AI, and by May 2025 PIB reported national compute capacity above 34,000 GPUs. MeitY's India AI Governance Guidelines of November 2025 are principle-based and say no new horizontal AI law is needed at this stage.\n\n**Sarvam AI** is a Bengaluru company offering Indic LLMs and APIs for speech-to-text, text-to-speech and translation, and some open-weight releases. **AI4Bharat** is a research lab at IIT Madras that releases open-source Indic resources - IndicTrans2 for translation across all 22 scheduled languages, IndicBERT, IndicXlit for transliteration and speech datasets such as IndicVoices. **Bhashini** is MeitY's National Language Translation Mission platform, launched in 2022 and run by the Digital India BHASHINI Division, exposing translation, speech recognition, speech synthesis and transliteration services.\n\nFor example, a government-facing service might use Bhashini APIs, while an on-prem bank deployment might self-host an AI4Bharat or Sarvam open model - each chosen after an eval on your own traffic.",
      "points": [
        "Get the categories right: programme, company, academic lab, government platform.",
        "Open weights matter for on-prem and residency.",
        "Pick per task: translation, ASR, TTS, transliteration, generation.",
        "Evaluate against global models on your own Indic golden set.",
        "Check licence, hosting region and support before committing."
      ],
      "say": "They're four different kinds of thing. IndiaAI Mission is the government programme, approved in March 2024 with about 10,370 crore rupees, funding shared GPU compute, datasets and sovereign foundation models - Sarvam was the first model builder selected, in April 2025, followed by Soket, Gnani and Gan AI. Sarvam is a company: Indic LLMs plus speech-to-text, text-to-speech and translation APIs, with some open-weight releases. AI4Bharat is an IIT Madras research lab that publishes open models and datasets - IndicTrans2 for translation across the 22 scheduled languages, IndicXlit for transliteration, and speech datasets like IndicVoices. Bhashini is MeitY's language platform, offering translation, speech and transliteration services, widely used in government. How I'd use them: as candidates in an evaluation, not defaults. For an on-prem bank, open Indic weights are attractive for residency. For voice in Tamil, I'd compare Indic ASR against global models on our own audio. The choice follows the per-language numbers.",
      "numbers": "IndiaAI Mission outlay ₹10,371.92 crore (Cabinet, 7 March 2024). PIB, 30 May 2025: compute capacity above 34,000 GPUs; Soket building a 120B open-source model, Gnani a 14B voice model, Gan AI a 70B multilingual model.",
      "verified": "2026-10",
      "wrong": "\"Always use the Indian model for Indian languages\" - or the reverse, \"global frontier models beat everything\". Both are assumptions; quality varies by language, task and domain, so the answer comes from a per-language eval.",
      "follow": "How would you compare a global frontier model with an Indic model for a Marathi support assistant?",
      "followAnswer": "On our own Marathi traffic, not on a leaderboard. I would build a golden set from real queries - Devanagari Marathi, romanised Marathi and code-mixed - with answers checked by a native speaker. Then compare on task success, faithfulness to retrieved sources, fluency rated by native reviewers, tokens per query and latency, and cost per resolved query. I would also test the boring things: hosting region, licence, rate limits and support. Often the result is a split - one model for generation, a different one for speech or translation.",
      "builds": [
        "llm-08",
        "llm-16"
      ],
      "next": [
        "in-13",
        "in-14",
        "ft-24"
      ],
      "deeper": [
        "in-indiaai-models",
        "ai4bharat"
      ],
      "check": {
        "kind": "concept",
        "q": "Which pairing is correct?",
        "options": [
          "Bhashini - an IIT Madras lab publishing IndicTrans2.",
          "AI4Bharat - MeitY's National Language Translation Mission platform.",
          "IndiaAI Mission - the government programme that selected Sarvam to build a sovereign LLM.",
          "Sarvam - the regulator for Indian AI models."
        ],
        "answer": 2,
        "why": "IndiaAI Mission selected Sarvam in April 2025. AI4Bharat is the IIT Madras lab behind IndicTrans2, and Bhashini is MeitY's language platform - the first two options swap them. India has no dedicated AI regulator."
      }
    },
    {
      "id": "in-10",
      "q": "Why does Hindi or Tamil text break into so many more tokens than English, and what does that do beyond the bill?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "llm-basics",
        "multilingual",
        "india"
      ],
      "why": "Tests whether you understand tokenisation mechanically, and see that token inflation hits context, latency and quality, not just cost.",
      "quick": [
        "BPE vocabularies are learned mostly from English-heavy text.",
        "Each Devanagari or Tamil character is 3 bytes in UTF-8.",
        "Rare scripts fall back to byte-level pieces, inflating counts.",
        "Inflation shrinks effective context, slows output and truncates answers.",
        "Measure fertility per language with the model's own tokeniser."
      ],
      "simple": "Modern LLMs use subword tokenisers such as byte-level BPE. The vocabulary is learned from training text: frequent character sequences become single tokens. If that text is mostly English, common English words become one token each, while Indic words are seen less often and are split into many small pieces. Underneath, every Devanagari, Tamil or Bengali character takes 3 bytes in UTF-8 against 1 byte for an ASCII letter, and when the vocabulary has no merge for a sequence the tokeniser falls back to those bytes. Vowel signs and conjuncts make it worse, because one visible syllable can be several code points.\n\nThe effects go beyond cost. A chunk budget of 500 tokens holds much less Tamil text than English, so retrieval passes fewer facts. Output is generated token by token, so the same answer takes longer to stream. A `max_tokens` limit tuned on English cuts Indic answers off mid-sentence. And rate limits counted in tokens per minute fill faster.\n\nFor example, the 2023 study by Petrov and colleagues found the same text can need several times more tokens in some languages than in English, depending on the tokeniser. Newer tokenisers with larger vocabularies narrow the gap, so you measure rather than assume.",
      "points": [
        "Explain BPE merges and byte fallback.",
        "UTF-8: 3 bytes per Indic character.",
        "Effects on context, chunk size, latency, max_tokens and TPM limits.",
        "Metric: fertility (tokens per word) and parity against parallel English.",
        "Tokeniser choice is part of model choice (cost in cl-14)."
      ],
      "say": "It's how the tokeniser was trained. Byte-level BPE learns merges from its training text, so if that text is mostly English, English words become single tokens and Indic words are split into many small pieces. Underneath, each Devanagari or Tamil character is three bytes in UTF-8, and where there's no learned merge the tokeniser falls back towards those bytes, and vowel signs and conjuncts add code points too. The bill is the obvious effect, but not the only one. My chunk budget in tokens holds less Tamil text, so retrieval carries fewer facts. Streaming the same answer takes longer because decoding is per token. A max-tokens limit tuned on English truncates Hindi answers mid-sentence. And tokens-per-minute rate limits fill faster. So I measure fertility, tokens per word, and parity against parallel English sentences, using the exact model's tokeniser or the usage field from the API, and I set chunk sizes, output limits and capacity per language, not once globally.",
      "numbers": "UTF-8 encodes each Devanagari, Tamil or other Indic-script character in 3 bytes versus 1 for ASCII letters. Parity ratios vary widely by tokeniser - newer large-vocabulary tokenisers are much closer to English than older ones (see the measured example in cl-14).",
      "verified": "2026-10",
      "wrong": "\"Tokens are roughly words, so Hindi costs the same as English.\" Tokens are learned subword pieces, and Indic scripts are under-represented in most vocabularies, so counts can be several times higher.",
      "follow": "Would you keep the system prompt in English or translate it into Hindi?",
      "followAnswer": "Usually English, for three reasons: it is cheaper in tokens, it is usually the language the model follows instructions in most reliably, and it is cacheable as a stable prefix. I state the output-language rule explicitly - reply in the user's language and script - and include a couple of examples in the target language if tone matters. Then I check it on the eval set, because for some models and tasks a native-language instruction improves fluency, and that is an empirical question per model.",
      "builds": [
        "llm-01",
        "riq-0801"
      ],
      "next": [
        "cl-14",
        "in-11",
        "in-12"
      ],
      "deeper": [
        "in-tokenizer-unfairness",
        "hf-tokenizers"
      ],
      "check": {
        "kind": "predict",
        "q": "You set `max_tokens=300` after testing English answers of about 200 words. Hindi users start getting answers that stop mid-sentence. What explains it?",
        "options": [
          "The model is less fluent in Hindi and gives up early.",
          "The same answer needs more tokens in Devanagari, so it hits the 300-token cap.",
          "Hindi responses are filtered by the provider's moderation layer.",
          "Streaming drops packets for non-ASCII characters."
        ],
        "answer": 1,
        "why": "Token inflation means a 200-word Hindi answer can need far more than 300 tokens, so generation stops at the limit. Fluency is a real issue but would not produce consistent mid-sentence cut-offs."
      },
      "try": {
        "title": "Measure token fertility across scripts",
        "minutes": 15,
        "steps": [
          "Install tiktoken with `pip install tiktoken`.",
          "Write one sentence in English, the same in Devanagari Hindi and in romanised Hindi.",
          "Count tokens for each under two encodings and print the ratio to English.",
          "Also print UTF-8 byte length for each sentence.",
          "Observe how much the older encoding inflates Devanagari compared with the newer one, and how romanised Hindi behaves."
        ],
        "code": "import tiktoken\n\ntexts = {\n    \"english\": \"My payment failed but money was debited. When will I get a refund?\",\n    \"hindi\": \"मेरा भुगतान विफल हो गया लेकिन पैसे कट गए। मुझे रिफंड कब मिलेगा?\",\n    \"romanised\": \"Mera payment fail ho gaya lekin paise kat gaye. Refund kab milega?\",\n}\nfor enc_name in [\"cl100k_base\", \"o200k_base\"]:\n    enc = tiktoken.get_encoding(enc_name)\n    base = len(enc.encode(texts[\"english\"]))\n    for k, t in texts.items():\n        n = len(enc.encode(t))\n        print(enc_name, k, n, round(n / base, 2), len(t.encode(\"utf-8\")), \"bytes\")"
      }
    },
    {
      "id": "in-11",
      "q": "Users type Hinglish - Hindi in Latin script mixed with English. How do you make retrieval and generation work for them?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "multilingual",
        "retrieval",
        "hybrid-search",
        "india"
      ],
      "why": "Code-mixed input is the default for many Indian users, and it breaks both keyword search and many embedding models in ways an English-only eval never shows.",
      "quick": [
        "Three forms: Devanagari Hindi, romanised Hindi, and mixed with English.",
        "Romanised Hindi has no standard spelling - nahi, nahin, nhi.",
        "Detect script per message; keep the original text.",
        "Search with variants: original, transliterated, English rewrite; fuse with RRF.",
        "Reply in the user's register, and evaluate each form separately."
      ],
      "simple": "Hinglish comes in several shapes. Some users write Hindi in Devanagari, many write Hindi in Latin letters, and most mix in English nouns: \"mera refund kab aayega, order cancel kiya tha\". Romanised Hindi has no standard spelling, so the same word appears as nahi, nahin and nhi. That hurts BM25, which needs exact terms, and many embedding models, which saw little romanised Hindi in training and so place it far from the Devanagari or English documents that hold the answer.\n\nThe fix is to search with several versions of the query. Detect the script and language for each message, never once per user. Keep the original for display and audit. Then generate variants: a transliteration into Devanagari, and an LLM rewrite into a clean English or Hindi query, which also expands abbreviations. Run hybrid search for each variant and merge the ranked lists with reciprocal rank fusion. For generation, tell the model to answer in the user's language and script, so a Hinglish question gets a natural Hinglish reply rather than formal Hindi.\n\nFor example, \"EMI bounce hone pe kya charge lagta hai\" finds nothing by keywords in an English policy, but its English rewrite, \"charges for a bounced EMI\", retrieves the right clause.",
      "points": [
        "Per-message script and language detection.",
        "Query variants: original, transliterated, rewritten; hybrid search each.",
        "Fuse with RRF; cap the variants to control latency.",
        "Output register matches the user's.",
        "Golden set sliced by form - Devanagari, romanised, mixed."
      ],
      "diagram": {
        "rows": [
          [
            {
              "id": "q",
              "label": "Hinglish query",
              "note": "original kept for display"
            }
          ],
          [
            {
              "id": "o",
              "label": "Original",
              "note": "BM25 + dense"
            },
            {
              "id": "t",
              "label": "Transliterated",
              "note": "to Devanagari"
            },
            {
              "id": "r",
              "label": "LLM rewrite",
              "note": "clean English query"
            }
          ],
          [
            {
              "id": "f",
              "label": "Fuse with RRF",
              "note": "dedupe, then rerank",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "g",
              "label": "Answer in user's register",
              "note": "same language and script"
            }
          ]
        ],
        "edges": [
          {
            "from": "q",
            "to": "o"
          },
          {
            "from": "q",
            "to": "t"
          },
          {
            "from": "q",
            "to": "r"
          },
          {
            "from": "o",
            "to": "f"
          },
          {
            "from": "t",
            "to": "f"
          },
          {
            "from": "r",
            "to": "f"
          },
          {
            "from": "f",
            "to": "g"
          }
        ],
        "alt": "A Hinglish query fans out into three search variants - the original, a Devanagari transliteration and an English rewrite - which are searched and fused with reciprocal rank fusion before the answer is written in the user's own register.",
        "caption": "**Search several spellings of the same question, then fuse.** No single form of a code-mixed query reliably matches the documents."
      },
      "say": "I treat code-mixed input as normal, not an edge case. Users write Hindi in Latin letters with English nouns mixed in, and romanised Hindi has no standard spelling, so keyword search misses and many embedding models place it far from the documents. So per message I detect script and language and keep the original for display and audit. Then I search with variants: the original, a transliteration into Devanagari, and a short LLM rewrite into a clean English query, which also expands things like EMI or KYC. Each runs through hybrid search, and I fuse the lists with reciprocal rank fusion before reranking. Three variants add latency, so I cap them and run them in parallel. On the generation side I instruct the model to answer in the user's language and script, so a Hinglish question gets a natural Hinglish answer. And the eval set is sliced by form - Devanagari, romanised and mixed - because a blended score hides the romanised slice, which is usually the weakest.",
      "numbers": "Rule of thumb: run at most two or three query variants in parallel - they add one rewrite call and extra searches, so measure p95 before adding more. Report recall@k separately for Devanagari, romanised and mixed queries.",
      "verified": "2026-10",
      "wrong": "\"Translate everything to English first and proceed as normal.\" Translation of romanised, mixed text is error-prone, loses names and product terms, and a single translated query becomes a single point of failure.",
      "follow": "How do you know which slice is failing?",
      "followAnswer": "I label each golden-set query by form - Devanagari, romanised, mixed - and language, then report retrieval recall at k, answer faithfulness and task success per slice, not just overall. In production I log the detected script and language on every trace, so I can slice thumbs-down rates and escalations the same way. When a slice is weak, I look at its failed retrievals first: usually the transliteration or rewrite step produced a wrong variant, which I can fix with better prompts, a dictionary of domain terms, or a better transliteration model.",
      "builds": [
        "rag-30",
        "rag-11",
        "pr-05"
      ],
      "next": [
        "in-12",
        "in-13",
        "gr-18"
      ],
      "deeper": [
        "in-gluecos",
        "rrf"
      ],
      "check": {
        "kind": "predict",
        "q": "Your corpus is English policy documents. Queries like `refund kab milega` get poor results from BM25 alone. What happens if you add an LLM rewrite to English as a second variant and fuse with RRF?",
        "options": [
          "Nothing - BM25 cannot match across languages, whatever the query.",
          "Recall rises, because the English rewrite shares terms with the documents.",
          "Recall falls, because RRF averages in the bad BM25 list.",
          "Results become random, because two lists conflict."
        ],
        "answer": 1,
        "why": "The rewrite produces English terms like refund timeline that BM25 can match. RRF rewards documents that rank well in any list, so a poor list mostly adds noise rather than dragging good results down."
      }
    },
    {
      "id": "in-12",
      "q": "Two Hindi strings look identical on screen but do not match in your index. What is going on, and how do you handle scripts and transliteration?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "multilingual",
        "ingestion",
        "retrieval",
        "india"
      ],
      "why": "A practical depth check: Unicode normalisation and transliteration bugs silently break search, deduplication and PII redaction in Indic pipelines.",
      "quick": [
        "Same glyph, different code points: precomposed versus base plus nukta.",
        "Normalise to NFC at ingestion and query time, consistently.",
        "Strip or standardise zero-width joiners and stray invisible characters.",
        "Learned transliteration gives top-k candidates; use them for expansion.",
        "Store original, normalised native and romanised forms as separate fields."
      ],
      "simple": "Unicode can represent the same visible Hindi letter in more than one way. For example, क़ can be stored as the single code point U+0958 or as क followed by the nukta sign U+093C. They render identically but compare unequal, so BM25 misses, deduplication fails and a PII pattern written for one form misses the other. Zero-width joiner and non-joiner characters, used to control conjunct rendering, add more invisible differences, as do copy-pasted PDFs with stray formatting characters. The fix is to normalise text with one Unicode normalisation form, usually NFC, at both ingestion and query time, and to decide a policy for zero-width characters.\n\nTransliteration is the second problem. Rule-based schemes such as ITRANS map romanised text to Devanagari deterministically, but real users do not type in any scheme. Learned models such as AI4Bharat's IndicXlit, trained on the Aksharantar dataset, return several ranked candidates for a romanised word, and those candidates make good query expansions.\n\nKeep three fields per chunk: the original text for display and citation, the normalised native-script text for search, and optionally a romanised form so romanised queries can match. Never overwrite the original.",
      "points": [
        "Show the precomposed versus combining-sequence example.",
        "NFC everywhere, applied identically at index and query time.",
        "Policy for ZWJ and ZWNJ characters, digits and punctuation such as the danda.",
        "Top-k learned transliteration for query expansion.",
        "Run PII redaction (gr-17) after normalisation."
      ],
      "say": "They're almost certainly different code points that render the same. In Devanagari, a nukta letter can be one precomposed character or the base letter plus a combining nukta, and zero-width joiners add invisible differences on top. They look identical, compare unequal, and so keyword search misses, deduplication fails, and a redaction pattern written for one form lets the other through. So I normalise with one Unicode form, NFC, identically at ingestion and at query time, and I set a policy for zero-width characters and native digits. Transliteration is the other half. Users type Hindi in Latin letters with no fixed scheme, so a rule-based scheme like ITRANS doesn't fit how people actually type. A learned model like IndicXlit returns several candidates per word, which I use as query expansions. And I store three fields per chunk: the original for display and citations, normalised native script for search, and a romanised form so romanised queries can still match.",
      "numbers": "In Unicode, U+0958 to U+095F (the precomposed Devanagari nukta letters) are composition exclusions, so NFC turns U+0958 into U+0915 U+093C. Normalising both sides is what makes them compare equal.",
      "verified": "2026-10",
      "wrong": "\"Lowercase and strip punctuation, like English.\" Indic scripts have no case, and the real problem - several code-point sequences for one visible letter - survives that cleaning untouched.",
      "follow": "Where in the pipeline does normalisation go, and what breaks if you add it later?",
      "followAnswer": "At the very start of ingestion, before chunking, deduplication, PII redaction and embedding, and in the query path before any search or cache lookup. Adding it later means the existing index holds un-normalised text, so normalised queries now miss old documents - the fix is a full re-index, not a query-side patch. It also changes cache keys and dedup hashes, so I version the normalisation step like any other index-shaping change and roll it out with a re-index and a retrieval eval before and after.",
      "builds": [
        "rag-30",
        "rag-04"
      ],
      "next": [
        "gr-17",
        "in-13",
        "in-11"
      ],
      "deeper": [
        "in-aksharantar",
        "ai4bharat"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "Your index normalises text to NFC. The query path does this:\n    q = user_text.strip()\n    hits = bm25.search(q)\nSome Devanagari queries miss documents that contain the exact visible words. What is the bug?",
        "options": [
          "`strip()` removes Devanagari vowel signs.",
          "The query is not normalised to NFC, so its code points differ from the index.",
          "BM25 cannot index Devanagari at all.",
          "NFC should never be used for Indic scripts."
        ],
        "answer": 1,
        "why": "Normalisation must be applied identically on both sides; un-normalised queries can carry a different code-point sequence for the same glyph. `strip()` only removes surrounding whitespace, and BM25 works on Devanagari once tokens match."
      },
      "try": {
        "title": "See two identical-looking strings disagree",
        "minutes": 10,
        "steps": [
          "Run the code with plain Python - no installs needed.",
          "Observe that the two strings print the same but compare unequal and differ in length.",
          "Normalise both with NFC and observe that they now compare equal.",
          "Add a zero-width joiner to one string and observe that NFC does not remove it."
        ],
        "code": "import unicodedata as ud\n\na = \"\\u0958\"          # precomposed QA\nb = \"\\u0915\\u093c\"    # KA + NUKTA\nprint(a, b, a == b, len(a), len(b))\nna, nb = ud.normalize(\"NFC\", a), ud.normalize(\"NFC\", b)\nprint(\"after NFC:\", na == nb, [hex(ord(c)) for c in na])\nc = b + \"\\u200d\"      # zero-width joiner\nprint(\"with ZWJ:\", ud.normalize(\"NFC\", c) == nb)"
      }
    },
    {
      "id": "in-13",
      "q": "How do you choose an embedding model for Indian languages, and how do you build an Indic golden set to prove it works?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "embeddings",
        "evaluation",
        "multilingual",
        "india"
      ],
      "why": "Leaderboard averages hide Indic performance. The panel wants a measurement plan sliced by language and script, owned by native speakers.",
      "quick": [
        "Shortlist multilingual models; leaderboard averages say little about Tamil.",
        "Golden set from real queries, stratified by language, script and form.",
        "Include cross-lingual pairs: Hindi query, English document.",
        "Native speakers label relevance; translated test sets only bootstrap.",
        "Report recall@k per slice and pick per slice, not on average."
      ],
      "simple": "An embedding model for Indian users has to place a Hindi question near an English document that answers it, and a romanised query near Devanagari text. Many multilingual models do this reasonably for Hindi and much worse for lower-resource languages or romanised input. Public benchmarks such as MTEB and AI4Bharat's IndicXTREME give a shortlist, but averages blend dozens of tasks and languages, so they cannot tell you how a model handles your Kannada insurance queries.\n\nSo you build your own golden set. Sample real queries from logs or pilot users and stratify them: each language, each script, Devanagari versus romanised versus mixed, and cross-lingual cases where the answer is only in English. Native-speaker annotators mark which passages are relevant, ideally two per item with disagreements resolved. Machine-translating an English test set is a quick bootstrap, but it produces clean, formal sentences unlike real typing, so it overstates quality.\n\nFor example, two models may both score 0.82 recall@10 overall, while one drops to 0.55 on romanised Tamil. Then you compare models per slice, also checking embedding latency and token limits, which inflate for Indic text. Sometimes the winner is a combination: one embedding model plus hybrid search and a cross-lingual reranker.",
      "points": [
        "Shortlist from benchmarks, decide on your own data.",
        "Stratify by language, script, code-mixing and cross-lingual.",
        "Native-speaker relevance labels with agreement checks.",
        "Recall@k and MRR per slice; minimum examples per slice.",
        "Re-test after any tokenisation or normalisation change."
      ],
      "say": "I shortlist from public benchmarks and decide on our own data, because averages blend languages and tasks and tell me nothing about romanised Tamil insurance questions. The golden set is built from real queries, stratified by language, script, code-mixed versus clean, and cross-lingual cases where the answer exists only in English. Native speakers label relevance, ideally two per item, because an engineer can't judge a Marathi passage and an LLM judge in that language is itself unvalidated. Translated English test sets are fine to bootstrap, but they're cleaner than real typing and overstate quality. Then I report recall at k and MRR per slice for each candidate model, plus embedding latency and token limits, since Indic text inflates. It's common for two models to tie overall while one collapses on the romanised slice, so I pick on the slices that matter most to traffic, and often pair the embedding model with hybrid search and a reranker.",
      "numbers": "Rule of thumb: aim for at least about 50 labelled queries per slice you will make decisions on - with fewer, a difference of a few points of recall is noise. Grow the slices that carry the most traffic first.",
      "verified": "2026-10",
      "wrong": "\"We picked the top multilingual model on the leaderboard.\" The average hides per-language and per-script failures, and romanised or code-mixed queries are rarely in public benchmarks at all.",
      "follow": "Nobody on the team reads Kannada. How do you label the Kannada slice?",
      "followAnswer": "I pay for native-speaker annotators rather than guessing - a vendor, an internal colleague from another team, or domain staff who speak it, with a short guideline and examples. I double-label a subset to measure agreement before trusting the rest. Then I can calibrate an LLM judge against those human labels for Kannada and use it to scale, keeping a human-labelled sample each release to check the judge has not drifted. Without that calibration step, an LLM judge in a language nobody can read is unverified.",
      "builds": [
        "ev-02",
        "em-03",
        "em-08"
      ],
      "next": [
        "in-11",
        "ev-03",
        "ev-04"
      ],
      "deeper": [
        "in-indicxtreme",
        "mteb"
      ],
      "check": {
        "kind": "numbers",
        "q": "Model A: recall@10 0.84 overall, 0.58 on romanised Hindi. Model B: 0.81 overall, 0.76 on romanised Hindi. Romanised Hindi is 40% of traffic. Which is the better default?",
        "options": [
          "Model A, because its overall recall is higher.",
          "Model B, because it holds up on a slice carrying 40% of traffic.",
          "Neither - recall@10 is meaningless for multilingual retrieval.",
          "Model A, if you add more chunks per query."
        ],
        "answer": 1,
        "why": "A 0.58 slice carrying 40% of users means many failed answers; Model B's small overall loss buys a large gain where traffic is. Choosing on the average is exactly the mistake per-slice evaluation exists to catch."
      }
    },
    {
      "id": "in-14",
      "q": "Design a voice-first assistant in Indian languages for users who will not type. What are the hard parts?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "multimodal",
        "multilingual",
        "latency",
        "india"
      ],
      "why": "Voice is the main interface for many Indian users. The panel wants the pipeline, the latency budget and the failure modes - numbers, names, noise and code-mixing.",
      "quick": [
        "Pipeline: voice activity detection, streaming ASR, LLM, streaming TTS.",
        "Telephony audio is narrowband and noisy; test on real recordings.",
        "Numbers, amounts and names fail most - read back critical entities.",
        "Stream every stage; the gap before speech starts is what users feel.",
        "Measure word error rate and task success per language and channel."
      ],
      "simple": "A voice assistant is a pipeline: voice activity detection decides when the user has finished, streaming speech recognition turns audio into text, the LLM decides what to say, and text-to-speech speaks it. Each stage adds delay, and conversation feels broken once the pause before the reply stretches past a second or two, so every stage streams: TTS starts speaking the first sentence while the LLM is still writing the second. Barge-in, the user interrupting, must stop playback and restart listening.\n\nIndian deployments add specific problems. Phone calls carry narrowband, compressed audio with background noise. Users switch between Hindi and English mid-sentence and speak regional varieties. The worst errors are on the things that matter most: amounts, dates, account numbers and names, including Hindi number words such as dedh sau for one hundred and fifty. So critical entities are read back for confirmation, and anything that moves money or changes an account is confirmed explicitly or handed to a person.\n\nFor example, an assistant that hears 'do hazaar' as 'two thousand' correctly but books it against the wrong account number does real harm. ASR options include Indic models from AI4Bharat, Sarvam, Bhashini and global providers - you choose by word error rate on your own call audio, per language.",
      "points": [
        "Draw the streaming pipeline and the turn-taking budget.",
        "Narrowband telephony versus app audio - evaluate each.",
        "Entity accuracy and read-back for numbers, dates, names.",
        "Code-mixed ASR and language identification per utterance.",
        "Fallbacks: DTMF keypad input, SMS confirmation, human handoff."
      ],
      "diagram": {
        "rows": [
          [
            {
              "id": "a",
              "label": "Caller audio",
              "note": "narrowband, noisy"
            }
          ],
          [
            {
              "id": "v",
              "label": "Voice activity detection",
              "note": "end of turn, barge-in"
            }
          ],
          [
            {
              "id": "s",
              "label": "Streaming ASR",
              "note": "per-language, code-mixed",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "l",
              "label": "LLM + tools",
              "note": "short replies, entity checks"
            }
          ],
          [
            {
              "id": "t",
              "label": "Streaming TTS",
              "note": "starts on first sentence"
            }
          ]
        ],
        "edges": [
          {
            "from": "a",
            "to": "v"
          },
          {
            "from": "v",
            "to": "s"
          },
          {
            "from": "s",
            "to": "l"
          },
          {
            "from": "l",
            "to": "t"
          }
        ],
        "alt": "Voice assistant pipeline: caller audio passes through voice activity detection, streaming speech recognition, the LLM with tools, and streaming text-to-speech.",
        "caption": "**Every stage streams, because users feel the silence.** Recognition quality on numbers and names, not general fluency, decides whether the assistant is safe."
      },
      "say": "I'd draw it as a streaming pipeline: voice activity detection to know when the user stopped, streaming speech recognition, the LLM with tools, then streaming text-to-speech that starts speaking the first sentence while the rest is still generating. Users feel silence, so I budget the gap before speech starts and stream every stage, with barge-in to stop playback when they interrupt. The India-specific hard parts are audio and entities. Phone audio is narrowband and noisy, and people switch between Hindi and English mid-sentence, so I evaluate recognition on real call recordings per language, not on clean benchmark audio. The dangerous errors are amounts, dates, account numbers and names, so the assistant reads critical entities back and confirms, and anything that moves money gets explicit confirmation or a human. I'd shortlist Indic ASR from AI4Bharat, Sarvam or Bhashini alongside global providers and choose on word error rate and entity accuracy on our audio, with keypad and SMS fallbacks.",
      "numbers": "Track word or character error rate per language and channel, entity accuracy on amounts and account numbers separately, and the gap from end of user speech to first audio. Turn-taking feels broken once that gap stretches past a second or two.",
      "verified": "2026-10",
      "wrong": "\"Use the best ASR model from the benchmark and pipe the transcript into our chatbot.\" Benchmark audio is clean, entity errors are not in the headline WER, and a non-streaming chain adds seconds of silence.",
      "follow": "Your word error rate looks fine but users still fail to complete payments. Why?",
      "followAnswer": "Because WER averages all words, and a payment fails on a handful of them - the amount, the account number, the beneficiary's name. I would measure entity error rate separately on those fields, using call recordings labelled for them. The fixes are targeted: constrain recognition with expected formats or a grammar for digits, confirm entities by reading them back, offer keypad entry for account numbers, and send an SMS summary before execution. I would also check the end-of-turn detection, because cutting users off mid-number looks like a recognition error.",
      "builds": [
        "sd-24",
        "cl-10"
      ],
      "next": [
        "in-15",
        "cl-12",
        "cl-02"
      ],
      "deeper": [
        "in-indicvoices",
        "whisper"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Your voice bot waits for the full LLM answer, then sends it all to TTS, then plays audio. Users say it feels slow even though each stage is fast. What is the main fix?",
        "options": [
          "Switch to a larger, smarter LLM.",
          "Stream the LLM output into TTS so speech starts on the first sentence.",
          "Lower the ASR sampling rate to save bandwidth.",
          "Add a longer silence threshold before ending the turn."
        ],
        "answer": 1,
        "why": "Serial stages add up; streaming lets speech start while generation continues, cutting the silence users perceive. A longer silence threshold makes it slower, and a bigger model usually adds latency."
      }
    },
    {
      "id": "in-15",
      "q": "Your users are on patchy mobile data and entry-level Android phones. What changes in the client-server design of the assistant?",
      "round": [
        "tech2"
      ],
      "level": "3-5",
      "priority": "low",
      "tags": [
        "latency",
        "api-design",
        "india"
      ],
      "why": "Designing for bandwidth, not just model latency, separates engineers who have shipped to Indian users from those who have demoed on office Wi-Fi.",
      "quick": [
        "Network, not the model, often dominates perceived latency.",
        "Keep state on the server; requests are resumable and idempotent.",
        "Short first answer, details on request; small payloads.",
        "Streaming over flaky links needs reconnect and resume support.",
        "Offer messaging, SMS or voice channels, not only the app."
      ],
      "simple": "On a fast office network the model is the slow part. On a weak mobile connection the network often is: a large response, a heavy web page or a dropped streaming connection costs more time than generation. So the design starts with the link.\n\nState lives on the server, keyed by a conversation id, so a dropped connection loses nothing and the user can come back later or on another channel. Each request carries an idempotency key, so a retry after a timeout does not run a payment or tool call twice. Streaming is still useful, but it needs resume: the client reconnects with the last event id it received and the server continues from there, otherwise a drop at 80% means starting again. Responses are compact - a short direct answer first and details only if asked - with text compressed and images avoided unless they carry the answer. The client is light enough for a low-memory phone, and channels like WhatsApp, SMS or voice calls reach users who will not install an app.\n\nFor example, an agri-advice assistant that sends a 40-word answer and a 'more details' option works on a weak signal; one that streams 600 words of Markdown with images does not.",
      "points": [
        "Server-side conversation state; resumable sessions.",
        "Idempotency keys on every request that can cause side effects.",
        "Streaming with reconnect and last-event-id resume.",
        "Answer-first, compact payloads; compress; avoid images.",
        "Channel choice: messaging, SMS, IVR, lightweight web."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Layers of a low-bandwidth assistant design, from channel choice down to model output size: channels, light client, resumable server state, idempotent requests, resumable streaming and compact answers.",
        "caption": "**Design for the link you have.** Every layer assumes the connection will drop, and nothing is lost or repeated when it does.",
        "top": "user on weak signal",
        "bottom": "answer delivered once",
        "layers": [
          {
            "label": "Channel choice",
            "note": "messaging, SMS, IVR, light web"
          },
          {
            "label": "Light client",
            "note": "small bundle, low memory"
          },
          {
            "label": "Server-side state",
            "note": "conversation id, resumable",
            "accent": "accent"
          },
          {
            "label": "Idempotency keys",
            "note": "retries never double-act",
            "accent": "accent"
          },
          {
            "label": "Resumable streaming",
            "note": "last event id"
          },
          {
            "label": "Compact answers",
            "note": "short first, details on request"
          }
        ]
      },
      "say": "I start from the network, because on weak mobile data it's often slower than the model. Conversation state lives on the server under a conversation id, so a dropped connection loses nothing and the user can resume later or on another channel. Every request that can cause a side effect carries an idempotency key, so a retry after a timeout doesn't book or pay twice. I still stream, but with resume: the client reconnects with the last event id and the server continues, otherwise a drop near the end means starting over. Answers are compact - a short direct answer first and details on request - compressed, with images only when they carry the answer, and the client is light enough for a low-memory phone. Finally channels: for many users a messaging app, SMS or a phone call works better than installing an app. I'd test all of this with network throttling on a cheap device, not on office Wi-Fi.",
      "numbers": "Test with throttled network profiles and packet loss on an entry-level device, and measure time to first useful text on the client, not only server-side TTFT. Keep the first answer short - a few dozen words - with details on request.",
      "verified": "2026-10",
      "wrong": "\"Low bandwidth just means using a smaller, faster model.\" The model is often not the bottleneck on a weak link - payload size, dropped streams and lost state are.",
      "follow": "The connection drops after the agent has called a payment tool but before the user sees the result. What happens?",
      "followAnswer": "The tool call completed or failed on the server, and that outcome is stored against the conversation and the idempotency key. When the client reconnects or retries, the server recognises the key and returns the stored result rather than calling the payment tool again. The user then sees a clear status - done, failed, or pending with a reference - and gets an SMS confirmation as a second channel. Without the idempotency key and stored result, a retry would risk a double payment, which is the failure this design exists to prevent.",
      "builds": [
        "sd-15",
        "py-20"
      ],
      "next": [
        "sd-25",
        "in-14",
        "cl-12"
      ],
      "deeper": [
        "fastapi-streaming",
        "huyen-ai-engineering"
      ],
      "check": {
        "kind": "which-fails",
        "q": "A user on a weak connection taps Send, the request times out, and the app retries automatically. The request asked the agent to recharge a phone. What prevents a double recharge?",
        "options": [
          "Lowering the model temperature to zero.",
          "Streaming the response so the user sees progress.",
          "An idempotency key that makes the server return the stored result.",
          "A shorter system prompt."
        ],
        "answer": 2,
        "why": "The server must recognise the retry as the same request and return the first outcome. Temperature and prompt length do not affect duplicate side effects, and streaming does not help when the connection has already dropped."
      }
    },
    {
      "id": "in-16",
      "q": "How do GenAI interviews at a global capability centre differ from an Indian product company and a services firm - and how do you prepare for each?",
      "round": [
        "screening",
        "manager"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "india",
        "behavioural",
        "system-design"
      ],
      "why": "The same answer lands differently in each setting. Panels check whether you understand the job's real constraints, not just GenAI.",
      "quick": [
        "GCC: enterprise platform work for a global parent; governance-heavy.",
        "Product: depth on one system, coding, scale, cost per request.",
        "Services: breadth, client framing, estimation, multi-cloud delivery.",
        "Tailor stories: GCC wants controls, product wants metrics, services wants clients.",
        "Research the actual team; formats vary even within one company."
      ],
      "simple": "A **global capability centre** is an Indian arm of a multinational - a bank, retailer, insurer or technology firm - that builds and runs systems for the parent. GenAI roles there are often platform roles: shared RAG and agent infrastructure, model gateways and governance used by business units worldwide. Interviews tend to probe enterprise constraints - security reviews, model risk, data residency across regions, working with stakeholders in other time zones - and the hiring manager may sit abroad. The approved cloud and models are usually decided centrally.\n\nAn **Indian product company or startup** usually tests depth on one system and real coding, then design at consumer scale: latency budgets, cost per request in rupees, Indic and code-mixed users, and how you proved a change helped. **Services and consulting firms** test breadth across clouds and frameworks, explaining trade-offs to a client, estimating effort and scoping a vague ask into a pilot.\n\nFor example, the same RAG project story should lead with access control and audit for a GCC, the metric you moved and its cost for a product company, and the client outcome and delivery plan for a services firm. Formats vary by team, so ask the recruiter about the rounds.",
      "points": [
        "Define a GCC accurately.",
        "Map what each setting rewards: controls, metrics, client outcomes.",
        "Re-angle the same project story for each.",
        "Expect take-homes or live builds more often at product firms.",
        "Ask the recruiter for the round structure."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of GenAI interviews at a global capability centre, an Indian product company and a services firm: what they reward, typical rounds and how to angle your project story.",
        "caption": "**Same project, three angles.** Lead with controls for a GCC, the measured metric for a product company and the client outcome for a services firm.",
        "aspects": [
          "Rewards",
          "Often tests",
          "Lead your story with"
        ],
        "columns": [
          {
            "label": "GCC",
            "note": "arm of a global parent",
            "cells": [
              "Governance at enterprise scale",
              "Platform design, security, stakeholders",
              "Access control, audit, rollout"
            ]
          },
          {
            "label": "Product company",
            "note": "Indian product or startup",
            "accent": "accent",
            "cells": [
              "Depth and measured impact",
              "Coding, scale design, evaluation",
              "Metric moved and its cost"
            ]
          },
          {
            "label": "Services firm",
            "note": "client-funded delivery",
            "cells": [
              "Breadth and client framing",
              "Scoping, estimation, multi-cloud",
              "Client outcome and plan"
            ]
          }
        ]
      },
      "say": "They reward different things, so I angle the same experience differently. A global capability centre builds for a multinational parent, and GenAI roles there are often platform roles - shared RAG infrastructure, gateways, governance for business units worldwide. So I lead with controls: access at retrieval, audit, model risk, residency, rolling out across teams, and working with stakeholders in other time zones. An Indian product company wants depth on one system, real coding, and design at consumer scale - latency, cost per request in rupees, Hinglish users - and above all how I proved a change helped. A services firm wants breadth across clouds and frameworks, the ability to explain trade-offs to a client, and turning a vague ask into a scoped pilot with an estimate. My RAG project story is the same facts each time, but the first minute changes: controls for the GCC, the metric I moved for the product company, the client outcome and delivery plan for services. And I ask the recruiter for the actual rounds.",
      "numbers": "No universal number. Ask the recruiter how many rounds, whether there is a take-home or live build, and whether a panellist sits outside India - it changes timing and what you prepare.",
      "verified": "2026-10",
      "wrong": "\"An interview is an interview - I'll give the same answers everywhere.\" A metrics-first story can sound careless in a governance-heavy GCC, and a controls-first story can sound slow at a startup.",
      "follow": "Why do you want a GCC role rather than a product startup?",
      "followAnswer": "I would answer with the work, not the brand. Something like: I want to build GenAI systems that have to pass real security and risk review and serve many business units, because that is where the hard engineering is - permissions, evaluation gates, rollbacks and cost governance at scale. I would add one specific thing about this centre's mandate from the job description, and be honest about the trade-off: slower release cycles than a startup, in exchange for scope and reach. That reads as a considered choice rather than a fallback.",
      "builds": [
        "sd-03",
        "sd-09"
      ],
      "next": [
        "sd-01",
        "py-35",
        "sd-29"
      ],
      "deeper": [],
      "check": {
        "kind": "judgement",
        "q": "You are interviewing at a bank's GCC. Asked about your RAG project, which opening lands best?",
        "options": [
          "We cut latency by 40% by switching to a faster model.",
          "Access groups were enforced at retrieval as a pre-filter, and every answer was auditable.",
          "We used the newest framework, so we shipped in three weeks.",
          "I built the whole thing alone over a weekend."
        ],
        "answer": 1,
        "why": "A bank's GCC is governance-heavy, so leading with entitlement enforcement and auditability signals you understand its constraints. Latency or speed-of-shipping can follow, but as an opener they suggest you optimised the wrong thing first."
      }
    }
  ]
};
