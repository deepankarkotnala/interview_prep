/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["15-cloud"] = {
  "lede": "Enterprise AI roles across regions usually name at least one cloud platform. The panel is checking whether you have deployed inside a locked-down production environment rather than on a personal API key, whether you can explain network and identity boundaries, and whether you know when containers, Kubernetes or infrastructure as code are worth the operational cost.",
  "grounding": "public enterprise AI job descriptions + published cloud platform behaviour",
  "evening": [
    "cd-01",
    "cd-03",
    "cd-05",
    "cd-06"
  ],
  "cards": [
    {
      "id": "cd-01",
      "q": "What changes when you use Azure OpenAI instead of the OpenAI API?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "azure",
        "enterprise"
      ],
      "why": "A common enterprise platform question. The useful answer is identity, networking, governance and regional availability, not a feature list.",
      "simple": "Roughly the same OpenAI models, a very different operating environment - and the environment is the reason enterprises choose it. (Azure OpenAI now sits inside Microsoft Foundry, renamed from Azure AI Foundry in 2026; both names still appear in docs and JDs.)\n\nYou get a resource in your own subscription, inside your tenant, with your networking. That means private endpoints so traffic never crosses the public internet, Entra ID for authentication instead of a shared API key, role-based access control, and everything landing in your existing subscription billing and policy framework. For a bank or a payer, that list is the entire reason the project is approvable.\n\nWhat changes practically: you create a named model deployment and call that deployment, rather than a global model name. The deployment type matters: Global types may process data in any Azure region, Data Zone types keep processing inside a zone such as the US, EU or APAC, and Regional types stay in the resource's region. Quota depends on subscription, model, region and deployment type, and it is a real constraint you plan around rather than discover.\n\nAnd the two things that surprise teams. Model availability differs by region - the model you want may not exist in the required region, and that shapes the design. And new models can arrive later, or first only in Global deployments, so a plan that depends on something released last week may not be executable in your required region yet.",
      "points": [
        "Your subscription, your tenant, private endpoints, Entra ID, RBAC.",
        "Named deployments with a type - Global, Data Zone or Regional - which decides where data is processed.",
        "Quota depends on subscription, model, region and deployment type - plan it, do not discover it.",
        "Model availability varies by region. Check the required region early.",
        "New models can arrive later, or only in Global deployments first.",
        "Content filtering is on by default and is configurable - know its behaviour."
      ],
      "say": "Same models, different operating environment - and that is why enterprises pick it. The resource sits in my subscription and tenant, with private endpoints so traffic never crosses the public internet, Entra ID instead of a shared key, and RBAC. Practically, I call a named deployment, and its type - Global, Data Zone or Regional - decides where data is processed. The surprises are regional model availability and quota, and new models reaching my region later.",
      "numbers": "No number applies. Regional model availability, deployment type and quota are the constraints to check before designing.",
      "wrong": "\"It's the same thing with a different URL.\" The follow-up - where is the data processed and how does the app authenticate - exposes that the enterprise deployment details are the experience being probed.",
      "follow": "The model you need is not in the required region. What do you do?"
    },
    {
      "id": "cd-02",
      "q": "Bedrock, Vertex or Azure - how would you choose?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "architecture",
        "trade-off"
      ],
      "why": "A judgement question. The wrong instinct is to compare features when the answer is usually organisational.",
      "simple": "In practice this is rarely a free choice, and saying so is the mature answer. You go where the data already is, where the enterprise agreement is, and where your security team has already done the work. Moving a regulated data estate to a second cloud to get a slightly better model is a project nobody funds.\n\nWhere they differ is narrower than it used to be. All three now offer multi-vendor catalogues - Claude, for example, is on Bedrock, Microsoft Foundry and Google Cloud - so model choice rarely decides it alone. Bedrock has the longest-standing multi-vendor API on AWS. Azure (Microsoft Foundry) has the deepest OpenAI integration, and for a Microsoft shop the identity and networking integration is the real draw. Google's platform - renamed in 2026 from Vertex AI to Gemini Enterprise Agent Platform, with the same APIs - is the natural fit if your data is in BigQuery.\n\nThen check the same four things everywhere, because they decide feasibility: which models exist in your required region (and whether the in-region option, not just a global one, offers them), what the quota and rate limits are, whether the retention and training terms satisfy your legal team, and whether private networking is supported.\n\nAnd keep provider access behind an interface, so this decision is not permanent.",
      "points": [
        "Usually decided by where the data, the agreement and the security review already are.",
        "All three now have multi-vendor catalogues; model choice rarely decides it alone.",
        "Azure (Microsoft Foundry) - deepest OpenAI and Microsoft identity/network integration.",
        "Google (Gemini Enterprise Agent Platform, formerly Vertex AI) - natural fit alongside BigQuery.",
        "Check everywhere: regional model availability, quota, retention terms, private networking.",
        "Abstract the provider so the decision stays reversible."
      ],
      "say": "Usually it is not a free choice - you go where the data, the enterprise agreement and the completed security review already are, because moving a regulated data estate to get a slightly better model is not a fundable project. All three now offer multi-vendor catalogues, so the difference is integration: Azure for Microsoft identity and OpenAI models, Google's platform, formerly Vertex, for BigQuery, Bedrock on AWS. Then I check regional availability, quota, retention terms and private networking.",
      "numbers": "No number applies. Regional model availability is the constraint that most often changes a design.",
      "wrong": "Comparing them on benchmark scores. The models are largely shared or comparable; the differences that decide it are organisational and operational.",
      "follow": "Your company is on AWS but the best model for this is only on Azure. Argue it."
    },
    {
      "id": "cd-03",
      "q": "How do you deploy a GenAI application securely inside an enterprise?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "security",
        "networking",
        "compliance"
      ],
      "why": "The architecture question a security reviewer asks. It is answered in infrastructure terms, not model terms.",
      "simple": "Almost none of this is about the model, which is the point worth making early.\n\nNetworking: the model endpoint reached over a private endpoint inside your virtual network, public access disabled, and egress controlled. If traffic to the model can leave over the public internet, most security reviews stop there.\n\nIdentity: managed identity or workload identity, not API keys in configuration. If a key must exist, it lives in a secret store with rotation, and no key ever appears in a repository or an environment variable in a shared runbook.\n\nData: the vector store, the trace store and the logs all inside the same boundary and region, because they hold prompts, and prompts hold customer data. This is the layer teams forget.\n\nAuthorisation: per-user, enforced in your application, with the user's identity flowing through to retrieval filters.\n\nAudit: every request logged with who asked, what was retrieved, what was returned, and which prompt and model version produced it, with a retention period legal has agreed.\n\nThen the ordinary things - infrastructure as code, no manual portal changes, and a documented data flow diagram you can hand to a reviewer.",
      "points": [
        "Private endpoint, public access disabled, controlled egress.",
        "Managed identity over keys; secret store with rotation if keys are unavoidable.",
        "Vector store, traces and logs inside the same boundary and region - they hold prompts.",
        "Per-user authorisation, with identity flowing into retrieval filters.",
        "Audit log: who asked, what was retrieved, what was returned, which versions.",
        "Infrastructure as code; no manual portal changes.",
        "A data-flow diagram you can hand to a security reviewer."
      ],
      "say": "Most of it is not about the model. Private endpoint with public access disabled and controlled egress. Managed identity rather than keys. The vector store, traces and logs inside the same boundary and region, because they hold prompts and prompts hold customer data - that is the layer teams forget. Per-user authorisation flowing into retrieval filters. And an audit log of who asked, what was retrieved and which versions produced it.",
      "numbers": "No number applies. Agree the audit log retention period with legal explicitly - it is usually the question a reviewer asks that nobody prepared for.",
      "wrong": "\"We use the enterprise tier, so it is secure.\" That covers the provider's side and none of yours - your traces, your index and your authorisation are all still open.",
      "follow": "Where exactly does the end user's identity enter the retrieval query?"
    },
    {
      "id": "cd-04",
      "q": "What does Databricks add for GenAI work?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "databricks",
        "data-platform"
      ],
      "why": "Named in many Indian enterprise JDs, particularly where the data platform team owns the GenAI work.",
      "simple": "Its value is that the data is already there, and for RAG the data pipeline is most of the work.\n\nPractically: your source documents and tables already live in the lakehouse, so ingestion, chunking and embedding are jobs next to the data rather than an export to somewhere else - which matters because exporting regulated data is often the step that is not permitted.\n\nUnity Catalog is the piece worth naming, because it gives one governance and lineage model over tables, files, models and vector indexes. When a reviewer asks who can see what and where a value came from, that is one answer instead of four.\n\nThen Vector Search for the index, Model Serving for endpoints, and MLflow for tracking and evaluation runs - and MLflow now covering GenAI evaluation and tracing is the part people miss.\n\nThe honest framing: it is a strong choice when the data platform is already Databricks and governance is the binding constraint. It is not a reason to move a workload that is happily running elsewhere.",
      "points": [
        "The data is already there - ingestion runs next to it, no export of regulated data.",
        "Unity Catalog: one governance and lineage model over tables, files, models, indexes.",
        "Vector Search, Model Serving, and MLflow for tracking and GenAI evaluation.",
        "Strongest when the data platform is already Databricks and governance is binding.",
        "Not a reason to move a workload that already runs well elsewhere."
      ],
      "say": "Its value is that the data is already there, and for RAG the data pipeline is most of the work - ingestion, chunking and embedding run next to the data instead of exporting regulated data somewhere else. Unity Catalog gives one governance and lineage model across tables, files, models and vector indexes, which answers a reviewer's questions in one place. Plus Vector Search, Model Serving and MLflow for evaluation and tracing.",
      "numbers": "No number applies. The governance and no-export argument is what carries weight in a regulated review.",
      "wrong": "\"It's a Spark platform.\" Accurate a few years ago and it misses Unity Catalog, Vector Search and the GenAI evaluation tooling, which is what the JD is naming.",
      "follow": "Who owns the GenAI pipeline in that setup - the data team or the application team?"
    },
    {
      "id": "cd-05",
      "q": "Beyond the app and the prompt, what does a GenAI CI/CD pipeline have to build, gate and roll back?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "cicd",
        "llmops",
        "deployment"
      ],
      "why": "ev-06 covers eval tiers in CI and ops-08 prompt rollout. This checks the artefacts ordinary pipelines lack - especially the index and the model deployment - and whether you treat them as versioned, deployable things rather than things people change by hand.",
      "simple": "Ordinary application CI/CD, plus three artefacts most pipelines do not have.\n\nThe prompt is one - versioned, reviewed and compared against main on the pull request (details in ev-06 and ops-08).\n\nThe index is the second, and it is the one people miss. A change to chunking or the embedding model is a deployment: it needs a build, a validation step against the labelled retrieval set, and a cutover, not an in-place mutation of the live index. Build the new index alongside, validate, switch, keep the old one for rollback.\n\nThe evaluation gate is the third. Before release, run the full golden set and block if quality falls below the current production score. That gate is what makes the rest meaningful.\n\nThen deploy behind a flag, canary on a small share of traffic for a full daily cycle, watch the quality proxies and cost, and widen. With rollback for the model version, the prompt and the index independently - because they fail independently.",
      "points": [
        "Prompts in version control, tested and compared on every PR.",
        "The index is a deployable artefact: build alongside, validate, cut over, keep the old.",
        "An evaluation gate that blocks release on a quality drop.",
        "Flag-gated deploy, canary for a full daily cycle, then widen.",
        "Independent rollback for model version, prompt and index.",
        "Infrastructure as code, including the model deployment and its quota."
      ],
      "say": "Ordinary CI/CD plus three artefacts most pipelines lack. Prompts in version control, tested and compared against main on every pull request. The index as a deployable artefact - built alongside, validated against the labelled retrieval set, cut over, old one kept for rollback, never mutated in place. And an evaluation gate that blocks release on a quality drop. Then canary for a full daily cycle, with independent rollback for each artefact.",
      "numbers": "Canary on 5–10% of traffic for at least 24 hours. A shorter window misses the change in traffic mix between working hours and overnight.",
      "wrong": "\"We deploy the app; the prompts are configuration.\" That is how prompt regressions reach production untested, and prompt edits are a frequent source of regressions.",
      "follow": "The index rebuild succeeded but recall dropped. What does your pipeline do?"
    },
    {
      "id": "cd-06",
      "q": "Which concrete Azure, AWS and Google Cloud settings keep an LLM workload inside a residency boundary?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "security",
        "residency",
        "compliance"
      ],
      "why": "gr-06 covers residency principles. This is the implementation check: the deployment types, inference profiles, endpoints and org policies that decide where a prompt is actually processed - and the high-throughput defaults that quietly route it elsewhere.",
      "simple": "**Short version: on every cloud the model call has a setting that decides where your prompt is processed, and the high-throughput option is often \"anywhere\". Choose the in-boundary option explicitly, then block the others with policy.** The principles are in gr-06; this is where they meet the console.\n\nAzure (Microsoft Foundry): the deployment type decides processing location. Global deployments may process in any Azure region; Data Zone deployments stay within a zone such as the US, EU or APAC; Regional deployments stay in the resource's region. Azure Policy can restrict allowed locations and which deployment types teams may create.\n\nAWS Bedrock: cross-Region inference profiles spread requests across regions for capacity. Geographic profiles stay within a geography such as the US or EU, global profiles can route worldwide, and calling the model in-Region keeps processing local. Service control policies and IAM conditions can deny the profiles and regions you have not approved.\n\nGoogle Cloud (Gemini Enterprise Agent Platform, formerly Vertex AI): regional endpoints versus the global endpoint make the same trade, and an organisation policy on resource locations constrains where resources can be created.\n\nThen the rest of the path: vector store, object storage, caches, traces and backups pinned to the same boundary, private networking, managed identities, and a tested failover that cannot silently cross the line. The in-boundary option often offers fewer models or less capacity than the global one - check that first, because it can change the model choice.",
      "points": [
        "Azure: Global, Data Zone or Regional deployment type decides where prompts are processed.",
        "AWS Bedrock: in-Region, geographic or global cross-Region inference - deny unapproved profiles with SCPs/IAM.",
        "Google Cloud: regional vs global endpoints, plus an org policy on resource locations.",
        "The high-throughput option is often the widest routing - choose explicitly.",
        "Pin index, storage, caches, traces and backups to the same boundary; test failover.",
        "Check model availability and quota in the in-boundary option before committing."
      ],
      "say": "On every cloud the model call has a routing setting, and the high-throughput option is often the widest. On Azure it is the deployment type - Global, Data Zone or Regional. On Bedrock it is in-Region versus geographic or global cross-Region inference, with SCPs denying what is not approved. On Google Cloud, regional versus global endpoints plus a location org policy. Then I pin the index, caches, traces and backups to the same boundary and test failover.",
      "numbers": "No number applies. Record the approved processing and storage location per data class, and verify it against the deployment type or inference profile actually in use - not just the region the resource was created in.",
      "wrong": "Saying the resource is in the local region and stopping. A Global deployment or a global inference profile can process the prompt elsewhere even when the resource itself sits in the right region.",
      "follow": "A managed model is not available in the required region. How do you compare another model, self-hosting, or a formally approved exception?"
    },
    {
      "id": "cd-07",
      "q": "Your first request after a quiet period takes 40 seconds. What is happening?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "tags": [
        "cloud",
        "deployment",
        "latency",
        "serving",
        "cost"
      ],
      "why": "Cold start is the classic scale-to-zero trap, and it is how people discover that GenAI infrastructure does not behave like a web service.",
      "simple": "Cold start, and the reason it is so much worse for GenAI than for an ordinary service is that the model weights have to get onto the GPU before anything can happen. Pulling a multi-gigabyte container image, downloading weights from object storage, loading them into GPU memory, and warming the runtime - that is tens of seconds to minutes, not the hundreds of milliseconds a stateless web container takes.\n\nSo the honest first question is whether you should scale to zero at all. If traffic is steady, do not - keep a warm minimum of one replica and accept the cost, because a 40-second first request is a worse problem than an idle GPU. Scale-to-zero belongs to genuinely intermittent internal tools, not customer-facing paths.\n\nIf you do need it, attack each stage. Pre-stage the weights rather than downloading them at startup: a fast shared volume, a node-local cache, or baked into the image (which makes images huge and pulls slower, so many teams prefer a volume or a streaming model loader). Keep the image small - most GenAI images are enormous because someone installed a full CUDA toolchain they do not need at runtime. Use provisioned concurrency or a warm pool where the platform offers it. And add a health-check warmup that runs one dummy inference so the first real user is not the one paying to initialise the runtime.\n\nThere is also a cheaper architectural answer: keep a small always-warm model for the first response and let the large one scale from zero behind it. The user gets something immediately.\n\nAnd note the same problem appears with serverless functions calling an API - there it is the container, not the weights, so the fix is different and much easier.",
      "points": [
        "GenAI cold start is dominated by getting weights onto the GPU, not by container boot.",
        "First question: should this scale to zero at all? For steady traffic, no.",
        "Warm minimum of one replica is usually cheaper than the user-facing cost of a 40-second wait.",
        "Pre-stage weights (fast volume, node cache, or baked into the image) - avoid a cold download at startup.",
        "Shrink the image; runtime rarely needs the full build toolchain.",
        "Warm up with a dummy inference in the health check, before traffic arrives.",
        "Scale-to-zero suits intermittent internal tools, not customer-facing paths."
      ],
      "say": "That is cold start, and for GenAI it is dominated by loading model weights onto the GPU rather than by container boot, so it is tens of seconds rather than milliseconds. My first question is whether this should scale to zero at all - for steady traffic a warm replica is cheaper than the user-facing cost. If it must, I pre-stage weights close to the GPU, shrink it, use provisioned concurrency, and warm up with a dummy inference in the health check.",
      "numbers": "Loading a 13B model from object storage onto a GPU can take tens of seconds to a few minutes, depending on storage throughput and image size. Pre-loading and a warmup inference make the replica ready before it takes traffic, so the first real user does not pay that cost.",
      "wrong": "Treating it like a normal autoscaling problem and just raising the replica count. That spends money without addressing why any single replica takes 40 seconds to become useful.",
      "follow": "Traffic is spiky and unpredictable. How do you size the warm pool?"
    },
    {
      "id": "cd-08",
      "q": "What do Docker, Kubernetes and Terraform each do in an AI deployment?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "tags": [
        "cloud",
        "docker",
        "kubernetes",
        "terraform",
        "deployment"
      ],
      "why": "AI engineering postings increasingly expect container, orchestration and infrastructure-as-code basics alongside model knowledge.",
      "simple": "They solve three different deployment problems.\n\nDocker packages the application and its runtime dependencies into an image, so the same service can run consistently in development, CI and production.\n\nKubernetes runs and manages those containers across machines. It handles scheduling, restarts, service discovery, rolling updates and autoscaling. For GPU services it also needs the right node pools, device plugins and scheduling rules so expensive accelerators are actually used well.\n\nTerraform describes cloud infrastructure as code: networks, clusters, databases, queues, identities and policies. That makes environments reviewable and repeatable instead of being created by clicking around a console.\n\nFor a small managed-API application, I may not need Kubernetes at all. A serverless container or platform service can be simpler. I use these tools when their operational benefit is larger than the complexity they add.",
      "points": [
        "Docker packages the service and dependencies.",
        "Kubernetes schedules and operates containers across machines.",
        "Terraform declares repeatable cloud infrastructure and policies.",
        "GPU workloads add node/scheduling/capacity concerns.",
        "Do not add Kubernetes when a simpler managed runtime meets the requirement."
      ],
      "say": "Docker packages the application and dependencies into a repeatable image. Kubernetes operates those containers across machines: scheduling, restarts, services, rolling updates and scaling, with extra GPU scheduling concerns for self-hosted models. Terraform declares the surrounding cloud infrastructure such as networks, clusters, databases and identities so environments are reviewable and reproducible. I would not add Kubernetes automatically; for a small API-backed service, a simpler managed container platform may be the better production choice.",
      "numbers": "No universal cluster size applies. Estimate from request rate, CPU/GPU utilisation, memory, scaling delay and failure-domain requirements.",
      "wrong": "Saying Docker, Kubernetes and Terraform are three ways to deploy a container. Packaging, orchestration and infrastructure provisioning are different jobs.",
      "follow": "Your GPU pods take several minutes to scale from zero. How would you protect an interactive latency SLA?"
    }
  ]
};
