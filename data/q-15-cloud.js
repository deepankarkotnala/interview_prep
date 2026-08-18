/* Topic 15 — Cloud and deployment.
   Grounding: public JDs naming Azure OpenAI, Bedrock, Vertex and Databricks at
   India centres, plus published platform behaviour. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["15-cloud"] = {
  lede: "Almost every enterprise JD in India names a cloud — usually Azure, because so many India centres are Microsoft shops. The panel is checking two things: whether you have deployed inside a locked-down enterprise tenant rather than on a personal API key, and whether you know what a regulated environment forbids before you propose it.",
  grounding: "public JDs naming these platforms + published platform behaviour",
  evening: ["cd-01", "cd-03", "cd-05", "cd-06"],

  cards: [
    {
      id: "cd-01",
      q: "What changes when you use Azure OpenAI instead of the OpenAI API?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["cloud", "azure", "enterprise"],
      why: "The most commonly named platform in Indian enterprise JDs. Vague answers mean you have not used it in anger.",
      simple:
        "Roughly the same models, a very different operating environment — and the environment is the reason enterprises choose it.\n\n" +
        "You get a resource in your own subscription, inside your tenant, with your networking. That means private endpoints so traffic never crosses the public internet, Entra ID for authentication instead of a shared API key, role-based access control, and everything landing in your existing subscription billing and policy framework. For a bank or a payer, that list is the entire reason the project is approvable.\n\n" +
        "What changes practically: you deploy a named model deployment in a chosen region and call that deployment, rather than calling a global model name. Quota is per deployment and per region, and it is a real constraint you plan around rather than discover.\n\n" +
        "And the two things that surprise teams. Model availability differs by region — the model you want may not exist in the India region, and that shapes the design. And new models arrive later than on the direct API, so a plan that depends on something released last week may not be executable yet.",
      points: [
        "Your subscription, your tenant, private endpoints, Entra ID, RBAC.",
        "Named deployments in a chosen region, not a global model name.",
        "Quota is per deployment per region — plan it, do not discover it.",
        "Model availability varies by region. Check the India region early.",
        "New models arrive later than on the direct API.",
        "Content filtering is on by default and is configurable — know its behaviour."
      ],
      say: "Same models, different operating environment — and that is why enterprises pick it. The resource sits in my subscription and tenant, with private endpoints so traffic never crosses the public internet, Entra ID instead of a shared key, and RBAC. Practically, I call a named deployment in a chosen region and quota is per deployment. The surprises are that model availability differs by region and new models arrive later.",
      numbers: "No number applies. Regional model availability and per-deployment quota are the two constraints to check before designing.",
      wrong: "\"It's the same thing with a different URL.\" It says you have used a personal key and never gone through an enterprise deployment, which is the actual experience being probed.",
      follow: "The model you need is not in the India region. What do you do?"
    },

    {
      id: "cd-02",
      q: "Bedrock, Vertex or Azure — how would you choose?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["cloud", "architecture", "trade-off"],
      why: "A judgement question. The wrong instinct is to compare features when the answer is usually organisational.",
      simple:
        "In practice this is rarely a free choice, and saying so is the mature answer. You go where the data already is, where the enterprise agreement is, and where your security team has already done the work. Moving a regulated data estate to a second cloud to get a slightly better model is a project nobody funds.\n\n" +
        "Where they genuinely differ: model choice. Bedrock offers several vendors' models behind one API, which is useful when you want optionality without a second integration. Azure is deepest if you are a Microsoft shop, and the identity and networking integration is the real draw. Vertex is the natural fit if your data is in BigQuery and you are already on Google Cloud.\n\n" +
        "Then check the same four things everywhere, because they decide feasibility: which models exist in your required region, what the quota and rate limits are, whether the retention and training terms satisfy your legal team, and whether private networking is supported.\n\n" +
        "And keep provider access behind an interface, so this decision is not permanent.",
      points: [
        "Usually decided by where the data, the agreement and the security review already are.",
        "Bedrock — multiple vendors behind one API; optionality without a second integration.",
        "Azure — deepest identity and network integration for Microsoft estates.",
        "Vertex — natural fit alongside BigQuery and Google Cloud data.",
        "Check everywhere: regional model availability, quota, retention terms, private networking.",
        "Abstract the provider so the decision stays reversible."
      ],
      say: "Usually it is not a free choice — you go where the data, the enterprise agreement and the completed security review already are, because moving a regulated data estate to get a slightly better model is not a fundable project. Where they differ: Bedrock gives multiple vendors behind one API, Azure has the deepest identity and network integration, Vertex fits a BigQuery estate. Then I check regional availability, quota, retention terms and private networking.",
      numbers: "No number applies. Regional model availability is the constraint that most often changes a design.",
      wrong: "Comparing them on benchmark scores. The models are largely shared or comparable; the differences that decide it are organisational and operational.",
      follow: "Your company is on AWS but the best model for this is only on Azure. Argue it."
    },

    {
      id: "cd-03",
      q: "How do you deploy a GenAI application securely inside an enterprise?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["cloud", "security", "networking", "compliance"],
      why: "The architecture question a security reviewer asks. It is answered in infrastructure terms, not model terms.",
      simple:
        "Almost none of this is about the model, which is the point worth making early.\n\n" +
        "Networking: the model endpoint reached over a private endpoint inside your virtual network, public access disabled, and egress controlled. If traffic to the model can leave over the public internet, most security reviews stop there.\n\n" +
        "Identity: managed identity or workload identity, not API keys in configuration. If a key must exist, it lives in a secret store with rotation, and no key ever appears in a repository or an environment variable in a shared runbook.\n\n" +
        "Data: the vector store, the trace store and the logs all inside the same boundary and region, because they hold prompts, and prompts hold customer data. This is the layer teams forget.\n\n" +
        "Authorisation: per-user, enforced in your application, with the user's identity flowing through to retrieval filters.\n\n" +
        "Audit: every request logged with who asked, what was retrieved, what was returned, and which prompt and model version produced it, with a retention period legal has agreed.\n\n" +
        "Then the ordinary things — infrastructure as code, no manual portal changes, and a documented data flow diagram you can hand to a reviewer.",
      points: [
        "Private endpoint, public access disabled, controlled egress.",
        "Managed identity over keys; secret store with rotation if keys are unavoidable.",
        "Vector store, traces and logs inside the same boundary and region — they hold prompts.",
        "Per-user authorisation, with identity flowing into retrieval filters.",
        "Audit log: who asked, what was retrieved, what was returned, which versions.",
        "Infrastructure as code; no manual portal changes.",
        "A data-flow diagram you can hand to a security reviewer."
      ],
      say: "Most of it is not about the model. Private endpoint with public access disabled and controlled egress. Managed identity rather than keys. The vector store, traces and logs inside the same boundary and region, because they hold prompts and prompts hold customer data — that is the layer teams forget. Per-user authorisation flowing into retrieval filters. And an audit log of who asked, what was retrieved and which versions produced it.",
      numbers: "No number applies. Agree the audit log retention period with legal explicitly — it is usually the question a reviewer asks that nobody prepared for.",
      wrong: "\"We use the enterprise tier, so it is secure.\" That covers the provider's side and none of yours — your traces, your index and your authorisation are all still open.",
      follow: "Where exactly does the end user's identity enter the retrieval query?"
    },

    {
      id: "cd-04",
      q: "What does Databricks add for GenAI work?",
      round: ["tech1", "tech2"],
      level: "5-10",
      tags: ["cloud", "databricks", "data-platform"],
      why: "Named in many Indian enterprise JDs, particularly where the data platform team owns the GenAI work.",
      simple:
        "Its value is that the data is already there, and for RAG the data pipeline is most of the work.\n\n" +
        "Practically: your source documents and tables already live in the lakehouse, so ingestion, chunking and embedding are jobs next to the data rather than an export to somewhere else — which matters because exporting regulated data is often the step that is not permitted.\n\n" +
        "Unity Catalog is the piece worth naming, because it gives one governance and lineage model over tables, files, models and vector indexes. When a reviewer asks who can see what and where a value came from, that is one answer instead of four.\n\n" +
        "Then Vector Search for the index, Model Serving for endpoints, and MLflow for tracking and evaluation runs — and MLflow now covering GenAI evaluation and tracing is the part people miss.\n\n" +
        "The honest framing: it is a strong choice when the data platform is already Databricks and governance is the binding constraint. It is not a reason to move a workload that is happily running elsewhere.",
      points: [
        "The data is already there — ingestion runs next to it, no export of regulated data.",
        "Unity Catalog: one governance and lineage model over tables, files, models, indexes.",
        "Vector Search, Model Serving, and MLflow for tracking and GenAI evaluation.",
        "Strongest when the data platform is already Databricks and governance is binding.",
        "Not a reason to move a workload that already runs well elsewhere."
      ],
      say: "Its value is that the data is already there, and for RAG the data pipeline is most of the work — ingestion, chunking and embedding run next to the data instead of exporting regulated data somewhere else. Unity Catalog gives one governance and lineage model across tables, files, models and vector indexes, which answers a reviewer's questions in one place. Plus Vector Search, Model Serving and MLflow for evaluation and tracing.",
      numbers: "No number applies. The governance and no-export argument is what carries weight in a regulated review.",
      wrong: "\"It's a Spark platform.\" Accurate a few years ago and it misses Unity Catalog, Vector Search and the GenAI evaluation tooling, which is what the JD is naming.",
      follow: "Who owns the GenAI pipeline in that setup — the data team or the application team?"
    },

    {
      id: "cd-05",
      q: "What does CI/CD look like for a GenAI application?",
      round: ["tech2"],
      level: "5-10",
      tags: ["cloud", "cicd", "llmops", "deployment"],
      why: "It exposes whether prompts and indexes are treated as deployable artefacts or as things people change by hand.",
      simple:
        "Ordinary application CI/CD, plus three artefacts most pipelines do not have.\n\n" +
        "The prompt is one. In version control, reviewed, and tested on the pull request — deterministic checks plus a golden-set comparison against main, posted so the reviewer sees the effect rather than the diff.\n\n" +
        "The index is the second, and it is the one people miss. A change to chunking or the embedding model is a deployment: it needs a build, a validation step against the labelled retrieval set, and a cutover, not an in-place mutation of the live index. Build the new index alongside, validate, switch, keep the old one for rollback.\n\n" +
        "The evaluation gate is the third. Before release, run the full golden set and block if quality falls below the current production score. That gate is what makes the rest meaningful.\n\n" +
        "Then deploy behind a flag, canary on a small share of traffic for a full daily cycle, watch the quality proxies and cost, and widen. With rollback for the model version, the prompt and the index independently — because they fail independently.",
      points: [
        "Prompts in version control, tested and compared on every PR.",
        "The index is a deployable artefact: build alongside, validate, cut over, keep the old.",
        "An evaluation gate that blocks release on a quality drop.",
        "Flag-gated deploy, canary for a full daily cycle, then widen.",
        "Independent rollback for model version, prompt and index.",
        "Infrastructure as code, including the model deployment and its quota."
      ],
      say: "Ordinary CI/CD plus three artefacts most pipelines lack. Prompts in version control, tested and compared against main on every pull request. The index as a deployable artefact — built alongside, validated against the labelled retrieval set, cut over, old one kept for rollback, never mutated in place. And an evaluation gate that blocks release on a quality drop. Then canary for a full daily cycle, with independent rollback for each artefact.",
      numbers: "Canary on 5–10% of traffic for at least 24 hours. A shorter window misses the change in traffic mix between working hours and overnight.",
      wrong: "\"We deploy the app; the prompts are configuration.\" That is how prompt regressions reach production untested, and prompts cause most regressions.",
      follow: "The index rebuild succeeded but recall dropped. What does your pipeline do?"
    },

    {
      id: "cd-06",
      q: "How would you design this for an Indian regulated customer?",
      round: ["tech2", "manager"],
      level: "5-10",
      tags: ["cloud", "india", "compliance", "residency"],
      why: "Directly relevant to the market, and it is the question a services or banking panel will press hardest.",
      simple:
        "Start by establishing the regime, because it varies by sector and getting this wrong invalidates the design. The DPDP Act 2023 is the general law; the binding constraint is usually the sectoral regulator — RBI for payment data being the well-known case, with healthcare and government contracts carrying their own terms. So the first thing I say is which regime applies and who confirms it.\n\n" +
        "Then the architecture. Model deployed in an Indian region, having checked which models are actually available there, because that constraint often changes the design rather than being a footnote. Vector store, trace store and logs in-region too. Zero-retention terms with the provider, region pinned explicitly rather than by default. Private networking, per-user authorisation, and full audit logging.\n\n" +
        "Then the operational commitments that get asked about in the review: a documented data-flow diagram, an agreed retention period, a deletion path that reaches the vector index and the traces — not only the source database — and a named owner.\n\n" +
        "And a contingency, because the model you want may not be available in-region: a smaller in-region model, or a design where only de-identified data crosses a boundary, if that is permitted at all.",
      points: [
        "Establish the regime first: DPDP plus the sectoral regulator. Name who confirms it.",
        "In-region model deployment — check which models exist there early.",
        "Vector store, traces and logs in-region too. Traces contain prompts.",
        "Zero retention, region pinned explicitly, private networking.",
        "Deletion must reach the index and the traces, not just the source database.",
        "Documented data flow, agreed retention, named owner.",
        "Contingency for a model not available in-region: smaller model, or de-identified data only."
      ],
      say: "First I establish which regime applies — DPDP plus the sectoral regulator, since RBI and healthcare rules are stricter — and who signs off on that reading. Then the model deployed in an Indian region, checking availability early because it often changes the design, with the vector store, traces and logs in-region too. Zero retention, region pinned, private networking. And a deletion path that reaches the index and traces, not just the source database.",
      numbers: "No number applies. The two things to establish first are which regulator binds and which models exist in-region.",
      wrong: "\"We host in the Mumbai region.\" One line of a design. It leaves the trace store, the vector index, retention terms and the deletion path unaddressed, and a reviewer will ask about every one.",
      follow: "The customer asks you to prove a deleted record is gone. What do you show them?"
    }
  ]
};
