/* Updated interview content. Data-only file; page design lives in assets/. */

window.IR = window.IR || {};
window.IR.q = window.IR.q || {};

window.IR.q["15-cloud"] = {
  "lede": "Enterprise AI roles across regions usually name at least one cloud platform. The panel is checking whether you have deployed inside a locked-down production environment rather than on a personal API key, whether you can explain network and identity boundaries, and whether you know when containers, Kubernetes or infrastructure as code are worth the operational cost. New to cloud deployment? The questions are ordered for a first read: High priority first, from the Docker, Kubernetes and Terraform basics through Azure OpenAI, choosing a cloud, secure deployment and CI/CD, then Medium (residency settings, capacity planning, cold starts), then Low.",
  "grounding": "public enterprise AI job descriptions + published cloud platform behaviour",
  "evening": [
    "cd-01",
    "cd-03",
    "cd-05",
    "cd-06"
  ],
  "cards": [
    {
      "id": "cd-08",
      "q": "What do Docker, Kubernetes and Terraform each do in an AI deployment?",
      "round": [
        "screening",
        "tech1"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "deployment",
        "cloud"
      ],
      "why": "AI engineering postings increasingly expect container, orchestration and infrastructure-as-code basics alongside model knowledge.",
      "quick": [
        "They solve three different deployment problems.",
        "Docker packages the app and everything it needs.",
        "Kubernetes runs and restarts those packages across many machines.",
        "Terraform writes cloud setup as reviewable, repeatable code.",
        "A small app calling a model API may skip Kubernetes."
      ],
      "simple": "Docker, Kubernetes and Terraform solve three different deployment problems. Docker packages the application and its dependencies into an image, so the same service runs the same way in development, CI and production. Kubernetes runs and manages those containers across many machines, handling restarts, rolling updates and autoscaling. Terraform works one level lower, describing the cloud infrastructure itself as code, so environments are reviewable and repeatable instead of built by clicking around a console.\n\nThe judgement is knowing when to leave one out. For example, a small internal app that only calls a managed model API often doesn't need Kubernetes at all, because a serverless container is far simpler to run. A team self-hosting several models on GPUs, on the other hand, benefits from Kubernetes scheduling and Terraform-managed clusters. So you add each tool only when its benefit clearly outweighs the complexity it brings.",
      "points": [
        "Docker packages the service and dependencies.",
        "Kubernetes schedules and operates containers across machines.",
        "Terraform declares repeatable cloud infrastructure and policies.",
        "GPU workloads add node/scheduling/capacity concerns.",
        "Do not add Kubernetes when a simpler managed runtime meets the requirement."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Three layers of an AI deployment: Docker packages the service, Kubernetes runs the containers, Terraform provisions the cloud underneath.",
        "top": "your AI service",
        "bottom": "cloud account",
        "layers": [
          {
            "label": "Docker",
            "note": "packages service and dependencies",
            "accent": "accent"
          },
          {
            "label": "Kubernetes",
            "note": "schedules, restarts, autoscales",
            "accent": "muted"
          },
          {
            "label": "Terraform",
            "note": "networks, clusters, identities as code"
          }
        ],
        "caption": "Three **different jobs**: package it, run it, provision where it runs. Kubernetes is optional - a small managed-API app often runs fine on **serverless containers**."
      },
      "say": "Docker packages the service, Kubernetes runs it across machines, and Terraform provisions the cloud it runs on. Docker bundles the application and its runtime dependencies into an image, so the same thing runs in development, CI and production. Kubernetes schedules those containers and handles restarts, service discovery, rolling updates and autoscaling. For GPU services it also needs the right node pools, device plugins and scheduling rules, otherwise expensive accelerators sit badly used. Terraform declares the networks, clusters, databases, queues, identities and policies as code, so environments are reviewed and repeatable instead of clicked together in a console. Calling them three ways to deploy a container misses that these are different jobs. The judgement is knowing when to leave one out. A small app that just calls a managed model API often doesn't need Kubernetes, because a serverless container or platform service is far simpler. So I add each tool only when its operational benefit clearly beats the complexity it brings.",
      "numbers": "No universal cluster size applies. Estimate from request rate, CPU/GPU utilisation, memory, scaling delay and failure-domain requirements.",
      "wrong": "Saying Docker, Kubernetes and Terraform are three ways to deploy a container. Packaging, orchestration and infrastructure provisioning are different jobs.",
      "follow": "Your GPU pods take several minutes to scale from zero. How would you protect an interactive latency SLA?",
      "followAnswer": "I would not let the interactive path scale to zero. Keep a warm minimum sized for normal traffic, and scale on queue depth or requests in flight rather than CPU. Pre-pull images and cache weights on the nodes so a new pod is ready faster. For spikes beyond the warm pool, queue briefly, or fall back to a managed API or a smaller model, so the SLA holds while capacity catches up.",
      "next": [
        "cd-07",
        "cd-05",
        "cd-03"
      ],
      "alsoIn": [
        "riq-a31",
        "riq-3004"
      ],
      "deeper": [
        "kubernetes",
        "terraform"
      ],
      "check": {
        "kind": "judgement",
        "q": "A three-person team builds an internal app that only calls a managed model API, at about 20 requests per second. What deployment fits best?",
        "options": [
          "A self-managed Kubernetes cluster with GPU node pools.",
          "A container on a serverless container platform, with infrastructure defined in Terraform - no Kubernetes for now.",
          "A VM configured by hand in the cloud console.",
          "Kubernetes plus a service mesh, to be ready for scale."
        ],
        "answer": 1,
        "why": "Docker for packaging and Terraform for repeatable infrastructure are cheap wins; Kubernetes adds operational load this app does not need, since there are no GPUs to schedule. A hand-built VM is not reviewable or repeatable."
      }
    },
    {
      "id": "cd-01",
      "q": "What changes when you use Azure OpenAI instead of the OpenAI API?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cloud",
        "security"
      ],
      "why": "A common enterprise platform question. The useful answer is identity, networking, governance and regional availability, not a feature list.",
      "quick": [
        "Same models, but inside your own company cloud account.",
        "Traffic stays off the public internet.",
        "Company sign-in and access roles replace a shared key.",
        "The deployment type decides which region handles prompts.",
        "Plan usage limits early, and check the model exists in your region."
      ],
      "simple": "Azure OpenAI, now offered as part of Microsoft Foundry, gives you roughly the same OpenAI models, but in a very different operating environment, and that's why enterprises choose it. The resource lives in your own Azure subscription, so you get private endpoints that keep traffic off the public internet, Entra ID sign-in instead of a shared API key, role-based access control, and billing inside your existing setup. For example, for a bank, that list is exactly what gets the project past security.\n\nIn practice, you create a named deployment of a model and call it. Its deployment type decides where prompts are processed: any Azure region for Global types, a US or EU data zone for Data Zone types, or a single region for Regional ones. Content filtering is on by default.\n\nTwo things usually surprise teams. Quota is set per region and model, so you plan it early, and the model you want may not be in your region yet.",
      "points": [
        "Your subscription, your tenant, private endpoints, Entra ID, RBAC.",
        "Named deployments with a type - Global, Data Zone (US, EU, APAC) or Standard/Regional - which decides where prompts are processed.",
        "Quota depends on subscription, model, region and deployment type - plan it, do not discover it.",
        "Model availability varies by region. Check the required region early.",
        "New models arrive in Global first, then Data Zone, then single-geography.",
        "Content filtering is on by default and is configurable - know its behaviour."
      ],
      "say": "You get roughly the same models, but inside your own Azure environment, and that's why enterprises choose it. Azure OpenAI now sits within Microsoft Foundry, and the resource lives in your subscription and tenant. So you get private endpoints that keep traffic off the public internet, Entra ID sign-in instead of a shared key, role-based access, and billing and policy inside your existing setup. For a bank, that list is what makes the project approvable. You create a named deployment of a model and call that, and its deployment type decides where prompts are processed. Global can use any Azure region, Data Zone stays inside a zone like the EU, and Standard or Regional types stay in the resource's geography. Quota is set per subscription, region, model and deployment type, so I plan it early. The other surprise is availability. New models usually land in Global first and single-geography last, so the one you want may not be in your region yet.",
      "numbers": "No number applies. Regional model availability, deployment type and quota are the constraints to check before designing.",
      "verified": "2026-10",
      "wrong": "\"It's the same thing with a different URL.\" The follow-up - where is the data processed and how does the app authenticate - exposes that the enterprise deployment details are the experience being probed.",
      "follow": "The model you need is not in the required region. What do you do?",
      "followAnswer": "First I check whether a Data Zone deployment is acceptable - it often gets the model well before single-region types, and processing stays inside the US, EU or APAC zone. If policy demands one geography, I test the best model that is available there on our eval set; often it is good enough. Otherwise it is a formally approved exception or a dated wait. What I never do is quietly switch to Global.",
      "next": [
        "cd-06",
        "cd-09",
        "cd-02"
      ],
      "deeper": [
        "azure-openai",
        "azure-openai-privacy"
      ],
      "check": {
        "kind": "which-fails",
        "q": "A bank needs EU-only processing. The team creates its Azure OpenAI resource in Sweden Central and deploys the model with a Global Standard deployment type. What is the problem?",
        "options": [
          "Sweden Central is not an EU region.",
          "Global deployment types can process prompts in any Azure region - use Data Zone (EU) or Regional.",
          "Azure OpenAI cannot be used by banks.",
          "Content filtering must be turned off for EU deployments."
        ],
        "answer": 1,
        "why": "The resource's region is not where prompts are processed; the deployment type decides that. Global routes anywhere, Data Zone stays inside the EU or US zone, and Regional stays in one region. Sweden Central is in the EU."
      }
    },
    {
      "id": "cd-02",
      "q": "Bedrock, Vertex or Azure - how would you choose?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cloud",
        "trade-offs"
      ],
      "why": "A judgement question. The wrong instinct is to compare features when the answer is usually organisational.",
      "quick": [
        "Usually decided by where your data and contracts already are.",
        "The same top models are on all three now.",
        "Bedrock suits AWS teams, Azure suits Microsoft shops.",
        "Google suits teams whose data lives in BigQuery.",
        "Check region, limits and data terms, and keep switching easy."
      ],
      "simple": "Choosing between Bedrock, Vertex and Azure is usually not a free choice, and saying so is the mature answer. You go where the data already is, where the enterprise agreement is, and where security has already approved the setup. Model choice rarely settles it anyway, because the catalogues now overlap a lot.\n\nSo the real differences are about integration. Bedrock fits a team already on AWS, Azure fits a Microsoft shop with Entra ID, and Google's platform, formerly Vertex AI, fits when the data sits in BigQuery. For example, an insurer whose claims data is already in BigQuery would naturally build on Google Cloud.\n\nThen you check feasibility, meaning the model is offered in your region, there's quota, legal accepts the data terms, and private networking works. Whichever cloud wins, you keep model access behind an interface in your code, so the decision stays reversible.",
      "points": [
        "Usually decided by where the data, the agreement and the security review already are.",
        "Catalogues overlap: Claude is on all three, and GPT models are on Bedrock as well as Azure since mid-2026.",
        "Bedrock - natural fit for an AWS estate.",
        "Azure (Microsoft Foundry) - Microsoft identity, Microsoft 365, the longest-running enterprise OpenAI offering.",
        "Google (Gemini Enterprise Agent Platform, formerly Vertex AI) - natural fit alongside BigQuery.",
        "Check everywhere: regional model availability, quota, retention terms, private networking.",
        "Abstract the provider so the decision stays reversible."
      ],
      "say": "Usually you don't really choose. You go where the data, the enterprise agreement and the approved security setup already are. Moving a regulated data estate to a second cloud for a slightly better model is a project nobody funds. Model choice rarely settles it anyway, because the catalogues overlap a lot now. Claude is on all three, and OpenAI models are on Bedrock as well as Azure. The real differences are integration. Bedrock fits a team already on AWS identity, networking and data. Azure fits a Microsoft shop with Entra ID and Microsoft 365. Google's platform, which grew out of Vertex AI, fits when the data sits in BigQuery. Then four checks decide feasibility on each. Is the model offered in-region where you need it, is there quota, do the retention and training terms satisfy legal, and is private networking supported? Comparing benchmark scores misses all of that. Whichever wins, I keep model access behind an interface in our code, so the decision stays reversible.",
      "numbers": "No number applies. Regional model availability is the constraint that most often changes a design.",
      "verified": "2026-10",
      "wrong": "Comparing them on benchmark scores. The models are largely shared or comparable; the differences that decide it are organisational and operational.",
      "follow": "Your company is on AWS but the best model for this is only on Azure. Argue it.",
      "followAnswer": "I would first check whether the gap is real on our own eval set, because the catalogues overlap a lot. If the Azure model clearly wins, the case is about the cost of a second cloud: a new security review, private networking between clouds, data leaving the AWS boundary, and another bill. If the quality gain is worth that, we call Azure through a private link for that one use case, behind our model interface.",
      "builds": [
        "cd-01"
      ],
      "next": [
        "cd-06",
        "cd-09",
        "cd-03"
      ],
      "deeper": [
        "aws-genai-lens",
        "bedrock"
      ],
      "check": {
        "kind": "judgement",
        "q": "Your company runs on AWS, but the model that scored best on your eval is offered only on another cloud. Which argument lands with the architecture board?",
        "options": [
          "It tops the public leaderboard, so we must move.",
          "Never leave AWS under any circumstances.",
          "Quantify the quality gap on our own eval against the cost of cross-cloud networking, identity and security review, and keep the provider behind an interface.",
          "Use both clouds for every request for redundancy."
        ],
        "answer": 2,
        "why": "The decision is organisational, so you price it: measured quality gain against integration, compliance and operating cost, with an abstraction that keeps it reversible. Leaderboards are not your workload, and a blanket 'never' ignores real gaps."
      }
    },
    {
      "id": "cd-03",
      "q": "How do you deploy a GenAI application securely inside an enterprise?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "security",
        "cloud",
        "privacy"
      ],
      "why": "The architecture question a security reviewer asks. It is answered in infrastructure terms, not model terms.",
      "quick": [
        "It is mostly about the setup, not the model.",
        "Keep model traffic on a private network, no public access.",
        "Use built-in cloud identity instead of secret keys.",
        "Keep logs and stored prompts in the same region.",
        "Check each user's access and log who asked what."
      ],
      "simple": "Deploying GenAI securely inside an enterprise is almost entirely about infrastructure, not the model. It starts with networking. The model endpoint is reached through a private endpoint inside your network with public access disabled, and identity uses managed identity rather than API keys in configuration. The vector store, traces and logs all hold prompts, which hold customer data, so they stay inside the same boundary too.\n\nAuthorisation is per user and enforced in your application, with the user's identity flowing into retrieval filters. For example, when an HR assistant answers a manager's question, the search only returns documents that manager could open themselves, so nobody sees salary data they shouldn't.\n\nEvery request is also audited, recording who asked, what was retrieved and returned, and which prompt and model produced it. Saying you use the enterprise tier only covers the provider's side.",
      "points": [
        "Private endpoint, public access disabled, controlled egress.",
        "Managed identity over keys; secret store with rotation if keys are unavoidable.",
        "Vector store, traces and logs inside the same boundary and region - they hold prompts.",
        "Per-user authorisation, with identity flowing into retrieval filters.",
        "Audit log: who asked, what was retrieved, what was returned, which versions.",
        "Infrastructure as code; no manual portal changes.",
        "A data-flow diagram you can hand to a security reviewer."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Security layers for an enterprise GenAI deployment: networking, identity, data, authorisation and audit.",
        "top": "user request",
        "bottom": "reviewer-ready data-flow diagram",
        "layers": [
          {
            "label": "Networking",
            "note": "private endpoint, no public access"
          },
          {
            "label": "Identity",
            "note": "managed identity, not API keys"
          },
          {
            "label": "Data",
            "note": "vector store, traces, logs in boundary",
            "accent": "warn"
          },
          {
            "label": "Authorisation",
            "note": "user identity into retrieval filters",
            "accent": "accent"
          },
          {
            "label": "Audit",
            "note": "who, what, which versions"
          }
        ],
        "caption": "Almost none of it is **about the model**. The layer teams forget is **data**: traces and logs hold prompts, and prompts hold customer data."
      },
      "say": "Almost none of it is about the model. Start with networking. The model is reached through a private endpoint in the virtual network, with public access disabled and egress controlled, because traffic over the public internet ends most security reviews. Identity comes next. I use managed or workload identity rather than API keys, and any unavoidable key lives in a secret store with rotation. Then data, which is the layer teams forget. The vector store, traces and logs hold prompts, and prompts hold customer data, so they stay inside the same boundary and region. Authorisation is per user, with the verified identity flowing into mandatory retrieval filters, so nobody sees a chunk they couldn't open. Every request is audited with who asked, what was retrieved and returned, and which prompt and model version answered, kept for a period legal agreed. Saying we use the enterprise tier covers only the provider's side. The rest is infrastructure as code and a data-flow diagram a reviewer can read.",
      "numbers": "No number applies. Agree the audit log retention period with legal explicitly - it is usually the question a reviewer asks that nobody prepared for.",
      "wrong": "\"We use the enterprise tier, so it is secure.\" That covers the provider's side and none of yours - your traces, your index and your authorisation are all still open.",
      "follow": "Where exactly does the end user's identity enter the retrieval query?",
      "followAnswer": "In the retrieval service, from the verified token - never from the prompt or a client parameter. The app validates the user's sign-in token, resolves their groups or entitlements on the server, and the retrieval layer adds them as a mandatory filter on every vector and keyword search before any chunk comes back. So the model never sees a document the user cannot open, and the applied filter is logged with the request.",
      "builds": [
        "cd-01",
        "rag-09"
      ],
      "next": [
        "cd-06",
        "sd-07",
        "gr-03"
      ],
      "deeper": [
        "azure-openai-privacy",
        "aws-genai-lens"
      ],
      "check": {
        "kind": "which-fails",
        "q": "The model endpoint is private, public access is off and the app uses managed identity. Which leak path is most often still open?",
        "options": [
          "The model provider training on your prompts.",
          "Traces and logs containing full prompts, exported to a SaaS tool outside the boundary.",
          "The private endpoint's DNS name.",
          "Managed identity tokens expiring."
        ],
        "answer": 1,
        "why": "Prompts carry customer data, and observability exports are usually set up separately from the model path, so they leak beyond the boundary. Enterprise terms typically exclude training on your data, and DNS names or token expiry do not expose content."
      }
    },
    {
      "id": "cd-05",
      "q": "Beyond the app and the prompt, what does a GenAI CI/CD pipeline have to build, gate and roll back?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "deployment",
        "rag"
      ],
      "why": "ev-06 covers eval tiers in CI and ops-08 prompt rollout. This checks the artefacts ordinary pipelines lack - especially the index and the model deployment - and whether you treat them as versioned, deployable things rather than things people change by hand.",
      "quick": [
        "It must also handle the search index and a quality gate.",
        "Prompts are versioned and compared on every change.",
        "Build a new index next to the old one, then switch.",
        "Block release if quality drops below the live version.",
        "Release to 5 to 10 percent of users for a day first."
      ],
      "simple": "A GenAI CI/CD pipeline is ordinary CI/CD plus three extra artefacts. The first is the prompt, which is versioned, reviewed and compared against main on every pull request, since prompt edits often cause regressions. The second is the index, the one people miss. A chunking or embedding change is really a deployment, so you build the new index alongside the old one, validate it, switch over, and keep the old one for rollback. For example, if a new chunk size lowers recall on the labelled set, the cutover simply doesn't happen.\n\nThe third is the evaluation gate, which blocks a release if quality on the golden set falls below production. Then you canary on 5-10% of traffic for at least 24 hours before widening.\n\nThe model, the prompt and the index each need their own rollback, because they fail independently.",
      "points": [
        "Prompts in version control, tested and compared on every PR.",
        "The index is a deployable artefact: build alongside, validate, cut over, keep the old.",
        "An evaluation gate that blocks release on a quality drop.",
        "Flag-gated deploy, canary for a full daily cycle, then widen.",
        "Independent rollback for model version, prompt and index.",
        "Infrastructure as code, including the model deployment and its quota."
      ],
      "say": "Beyond the app and prompt, the pipeline has to build and version the index and run an evaluation gate that can block a release. Prompts still get versioned and compared against main on every pull request, since prompt edits often cause regressions. The index is the one people miss. A change to chunking or the embedding model is a deployment. I build the new index next to the live one, validate it against the labelled retrieval set, switch, and keep the old one for rollback. If recall drops, the cutover doesn't happen and production never notices. The evaluation gate runs the full golden set and blocks release if quality falls below the current production score, which is what gives the rest meaning. Then it's a flag-gated deploy and a canary on 5 to 10 percent of traffic for at least 24 hours, so it sees both daytime and overnight traffic. Model version, prompt and index each roll back independently, because they fail independently.",
      "numbers": "Canary on 5–10% of traffic for at least 24 hours. A shorter window misses the change in traffic mix between working hours and overnight.",
      "wrong": "\"We deploy the app; the prompts are configuration.\" That is how prompt regressions reach production untested, and prompt edits are a frequent source of regressions.",
      "follow": "The index rebuild succeeded but recall dropped. What does your pipeline do?",
      "followAnswer": "It blocks the cutover. The new index is built next to the live one, so production keeps serving from the old index. The validation stage compares recall on the labelled retrieval set with the current production score and fails if it drops beyond the agreed tolerance. Then we diff what changed - chunking, embedding model, parser version - fix it and rebuild. Nothing was changed in place, so there is nothing to roll back.",
      "builds": [
        "ev-06",
        "ops-08"
      ],
      "next": [
        "cd-09",
        "em-10",
        "ops-03"
      ],
      "alsoIn": [
        "riq-3010"
      ],
      "deeper": [
        "gh-actions",
        "mlflow"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "On merge, the pipeline re-embeds every document directly into the live index, then runs the retrieval eval. What is wrong?",
        "options": [
          "Embedding should happen before the merge, not after.",
          "The eval should run only weekly.",
          "Nothing, as long as the eval passes.",
          "Production serves a half-built index during the rebuild, and if recall drops there is nothing to roll back to."
        ],
        "answer": 3,
        "why": "The index is a deployable artefact: build the new one next to the live one, validate recall, then switch, keeping the old one for rollback. Rebuilding in place exposes users to a partial index and makes a failed eval irreversible."
      }
    },
    {
      "id": "cd-06",
      "q": "Which concrete Azure, AWS and Google Cloud settings keep an LLM workload inside a residency boundary?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cloud",
        "compliance",
        "privacy"
      ],
      "why": "gr-06 covers residency principles. This is the implementation check: the deployment types, inference profiles, endpoints and org policies that decide where a prompt is actually processed - and the high-throughput defaults that quietly route it elsewhere.",
      "quick": [
        "Every cloud has a setting for where prompts are processed.",
        "The fastest option often means anywhere in the world.",
        "Pick the in-region option on purpose on each cloud.",
        "Block the other options with company-wide policy.",
        "Keep storage, logs and backups in the same region too."
      ],
      "simple": "On every cloud, the model call has a setting that decides where your prompt is actually processed. The high-throughput option is often \"anywhere\", so you choose the in-boundary option explicitly and block the others with policy. On Azure it's the deployment type, where Data Zone or Regional types stay inside the boundary. On AWS Bedrock it's the inference profile, where geographic profiles or in-Region calls stay local. On Google Cloud it's regional versus global endpoints.\n\nThe common mistake is stopping at the resource sitting in the right region. For example, a German bank's Bedrock resource might live in Frankfurt while a global inference profile quietly routes some prompts outside the EU. So the vector store, caches, traces and backups get pinned to the same boundary too.\n\nThe trade-off is that the in-boundary option often has fewer models or less capacity, so check that first.",
      "points": [
        "Azure: Global, Data Zone or Regional deployment type decides where prompts are processed.",
        "AWS Bedrock: in-Region, geographic or global cross-Region inference - deny unapproved profiles with SCPs/IAM.",
        "Google Cloud: regional vs global endpoints, plus an org policy on resource locations.",
        "The high-throughput option is often the widest routing - choose explicitly.",
        "Pin index, storage, caches, traces and backups to the same boundary; test failover.",
        "Check model availability and quota in the in-boundary option before committing."
      ],
      "diagram": {
        "kind": "matrix",
        "alt": "Grid of how each cloud sets where prompts are processed, from worldwide routing to in-region only, for Azure, AWS Bedrock and Google Cloud.",
        "xLabel": "Cloud",
        "yLabel": "Where prompts go",
        "cols": [
          "Azure",
          "AWS Bedrock",
          "Google Cloud"
        ],
        "rows": [
          "Anywhere",
          "Within a zone",
          "In-region"
        ],
        "cells": [
          [
            {
              "label": "Global deployment",
              "accent": "bad"
            },
            {
              "label": "Global profile",
              "accent": "bad"
            },
            {
              "label": "Global endpoint",
              "accent": "bad"
            }
          ],
          [
            {
              "label": "Data Zone",
              "note": "US, EU or APAC",
              "accent": "warn"
            },
            {
              "label": "Geographic profile",
              "note": "US or EU",
              "accent": "warn"
            },
            {
              "label": "Two-way choice",
              "note": "regional or global",
              "accent": "muted"
            }
          ],
          [
            {
              "label": "Standard, Regional",
              "accent": "accent"
            },
            {
              "label": "In-Region call",
              "accent": "accent"
            },
            {
              "label": "Regional endpoint",
              "accent": "accent"
            }
          ]
        ],
        "caption": "The **high-throughput option often means anywhere**. Pick the in-boundary setting explicitly, then **block the rest with policy** (Azure Policy, SCPs, org policy)."
      },
      "say": "Every cloud has a setting on the model call that decides where prompts are processed, so I pick the in-boundary option explicitly and block the rest with policy. The trap is that the high-throughput option often means anywhere. On Azure it's the deployment type. Global can use any region, Data Zone stays inside a zone like the EU, and Standard or Regional types stay in the resource's geography, with Azure Policy restricting which types teams can create. On Bedrock it's the inference profile. In-Region calls keep processing local, geographic profiles stay within an area like the EU, and global profiles can route worldwide, so service control policies and IAM conditions deny unapproved ones. On Google Cloud it's regional versus global endpoints, plus an organisation policy on resource locations. The common mistake is stopping at the resource sitting in the right region. The vector store, caches, traces and backups get pinned to the same boundary too, and failover is tested so it can't cross the line.",
      "numbers": "No number applies. Record the approved processing and storage location per data class, and verify it against the deployment type or inference profile actually in use - not just the region the resource was created in.",
      "verified": "2026-10",
      "wrong": "Saying the resource is in the local region and stopping. A Global deployment or a global inference profile can process the prompt elsewhere even when the resource itself sits in the right region.",
      "follow": "A managed model is not available in the required region. How do you compare another model, self-hosting, or a formally approved exception?",
      "followAnswer": "I compare them on the same evidence: quality on our golden set, cost, operational effort and residual compliance risk. First I check whether another managed model is available inside the boundary and whether it passes our eval, because that's usually the cheapest route. Self-hosting an open-weight model in-region keeps data local but adds GPUs, serving and on-call. A formally approved exception needs legal and risk sign-off, a documented data flow and an expiry date. I present all three with numbers, and never quietly switch routing.",
      "builds": [
        "gr-06",
        "cd-01"
      ],
      "next": [
        "cd-03",
        "cd-09",
        "gr-03"
      ],
      "deeper": [
        "bedrock",
        "azure-openai"
      ],
      "check": {
        "kind": "which-fails",
        "q": "An EU bank calls Claude on Amazon Bedrock from the Frankfurt region. Which setting can send prompts for processing outside the EU?",
        "options": [
          "Using a VPC endpoint for Bedrock.",
          "An EU geographic cross-Region inference profile.",
          "A global cross-Region inference profile.",
          "Encrypting requests with a customer-managed KMS key."
        ],
        "answer": 2,
        "why": "Global profiles can route to any supported commercial AWS Region worldwide; geographic profiles stay within the EU. Where the calling resource sits does not decide where processing happens. VPC endpoints and KMS keys protect traffic and data but do not pin processing."
      }
    },
    {
      "id": "cd-09",
      "q": "Pay-as-you-go or provisioned throughput - how do you plan model capacity on Azure, AWS or Google Cloud?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cloud",
        "cost",
        "latency"
      ],
      "why": "Enterprise launches fail on quota and 429 errors more often than on model quality. This checks that you can size capacity and choose between shared and reserved throughput.",
      "quick": [
        "Pay-as-you-go charges per use on shared hardware.",
        "Going over the limit gets too many requests errors.",
        "Provisioned throughput reserves capacity at a fixed price.",
        "Size from busiest minute, not the monthly total.",
        "Common mix is reserved base, pay-as-you-go peaks, cheap batch jobs."
      ],
      "simple": "Model capacity on the big clouds comes in two forms. Pay-as-you-go bills per token on shared capacity. It's flexible, but you get a quota in tokens per minute, and going over it returns HTTP 429, \"too many requests\". Provisioned throughput reserves capacity for you at a fixed price, so latency is steadier, but you pay whether you use it or not.\n\nTo decide, you measure peak tokens per minute, not the monthly total. For example, a team can hit 429 errors during a 9am burst while being well under its monthly volume, because the quota is per minute. Steady, high volume usually makes provisioned cheaper and more predictable, while spiky or small volume favours pay-as-you-go.\n\nA common mix is provisioned for the baseline, pay-as-you-go for peaks, and batch APIs for anything that can wait. You also plan early, since reserved capacity can take time.",
      "points": [
        "Pay-as-you-go: per token, shared capacity, TPM/RPM quota, 429s when exceeded.",
        "Provisioned: reserved capacity (Azure PTUs, Bedrock model units, Google GSUs), fixed price, steadier latency.",
        "Size from peak tokens per minute, input and output separately - not monthly volume.",
        "Steady high volume → provisioned. Spiky or small → pay-as-you-go.",
        "Common mix: provisioned baseline + pay-as-you-go overflow + batch API for offline work.",
        "Request quota and capacity early - it is per model, region and deployment type."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Pay-as-you-go, provisioned throughput and batch APIs compared by billing, capacity, latency and best use.",
        "aspects": [
          "Billing",
          "Capacity",
          "Latency",
          "Best for"
        ],
        "columns": [
          {
            "label": "Pay-as-you-go",
            "note": "per token",
            "cells": [
              "Per token",
              "Shared, TPM quota, 429s",
              "Varies at peak",
              "Spiky or small volume"
            ]
          },
          {
            "label": "Provisioned",
            "note": "PTUs, model units, GSUs",
            "accent": "warn",
            "cells": [
              "Fixed, used or not",
              "Reserved for you",
              "Steadier",
              "Steady high baseline"
            ]
          },
          {
            "label": "Batch API",
            "note": "for offline work",
            "accent": "accent",
            "cells": [
              "About half price",
              "Queued jobs",
              "Not real-time",
              "Anything that can wait"
            ]
          }
        ],
        "caption": "Size from **peak tokens per minute**, not monthly volume. The usual mix: provisioned baseline, pay-as-you-go for peaks, batch for offline work."
      },
      "say": "Pay-as-you-go bills per token on shared capacity, while provisioned throughput reserves capacity at a fixed price whether you use it or not. Pay-as-you-go comes with quotas in tokens and requests per minute. Exceed them and you get HTTP 429, too many requests, and latency varies because the hardware is shared. Provisioned, meaning PTUs on Azure, model units on Bedrock or GSUs on Google, buys steadier latency. Sizing starts from peak tokens per minute, with input and output counted separately, never the monthly total. That's how teams hit 429s in a morning burst while well under monthly volume. Steady, high volume favours provisioned, spiky or small volume pay-as-you-go. The usual mix is a provisioned baseline, pay-as-you-go for peaks, and batch APIs at about half price for anything that can wait. Minimum provisioned sizes vary by model and deployment type, so I check the current table. Quota increases aren't instant or guaranteed, so I request capacity per model, region and deployment type well before launch.",
      "numbers": "Provisioned minimums vary by model and deployment type - on Azure, Regional deployments typically need more PTUs than Global or Data Zone, so check the per-model table. Batch APIs on Azure, Bedrock and Google are typically about 50% cheaper than real-time calls. Minimums and prices change - check the current pricing page.",
      "verified": "2026-10",
      "wrong": "\"We'll just request more quota if we hit the limit.\" Quota increases are neither instant nor guaranteed, and 429s at launch look like an outage to users. Capacity is planned from measured peak TPM before go-live.",
      "follow": "You get 429s at peak even though monthly volume is well under quota. Why?",
      "followAnswer": "Because quota is per minute, not per month. A burst - a batch job, a retry storm, everyone logging in at nine - can exceed tokens per minute while the monthly total looks small. Some platforms also count the requested max_tokens against the limit up front, so a very high max_tokens uses quota you never consume. I smooth bursts with a queue, set realistic max_tokens, and retry with backoff.",
      "builds": [
        "cl-01",
        "cd-01"
      ],
      "next": [
        "cl-05",
        "ops-06",
        "cd-06"
      ],
      "deeper": [
        "azure-openai",
        "bedrock"
      ],
      "check": {
        "kind": "numbers",
        "q": "Daily volume is 60M tokens, but 40% of it arrives between 9 and 10 am. Your quota is 500K tokens per minute. Will you see 429 errors?",
        "options": [
          "No - 60M a day averages only about 42K tokens per minute.",
          "Probably during bursts - that hour averages 400K per minute, so the busiest minutes likely exceed 500K.",
          "Yes, all day long.",
          "No - quotas are measured per day."
        ],
        "answer": 1,
        "why": "24M tokens in 60 minutes is 400K per minute on average, and minute-level peaks sit above the hourly average. Sizing from the daily average (42K) is the classic mistake; quotas are per minute, not per day."
      },
      "try": {
        "title": "Find your peak tokens per minute",
        "minutes": 15,
        "steps": [
          "Run the starter code, which simulates a day of requests with a morning burst.",
          "Compare the daily average tokens per minute with the busiest minute.",
          "Set a quota and count how many minutes exceed it - each would return 429s.",
          "Move 20% of the volume to an overnight batch job and observe how the peak changes."
        ],
        "code": "import numpy as np\nrng = np.random.default_rng(1)\nminutes = np.arange(1440)\n# baseline traffic plus a 9-10 am burst, in tokens per minute\nrate = 25_000 + 380_000 * ((minutes >= 540) & (minutes < 600))\ntpm = rng.poisson(rate / 2_000) * 2_000  # requests of ~2,000 tokens\n\nquota = 500_000\nprint(\"daily total\", tpm.sum(), \"avg TPM\", int(tpm.mean()))\nprint(\"peak TPM\", tpm.max(), \"minutes over quota\", int((tpm > quota).sum()))"
      }
    },
    {
      "id": "cd-07",
      "q": "Your first request after a quiet period takes 40 seconds. What is happening?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "deployment",
        "latency"
      ],
      "why": "Cold start is the classic scale-to-zero trap, and it is how people discover that GenAI infrastructure does not behave like a web service.",
      "quick": [
        "It is a cold start after the service shut down.",
        "The model must load onto the graphics chip first.",
        "For steady customer traffic, keep one copy always running.",
        "Otherwise preload the model files and shrink the package.",
        "Run one test request before real users arrive."
      ],
      "simple": "A 40-second first request after a quiet period is a cold start. It's much worse for GenAI than for an ordinary service, because the model weights have to reach the GPU first. The replica pulls a large container image, downloads the weights, loads them into GPU memory and warms up. For example, loading a 13B model this way can take tens of seconds to a few minutes.\n\nSo the first question is whether you should scale to zero at all. For steady, customer-facing traffic you shouldn't, so you keep one warm replica, because a 40-second wait is worse than an idle GPU.\n\nIf you do need it, you attack each stage. You pre-stage the weights on a fast volume or local cache, keep the image small, and run one dummy inference at startup so no real user pays for the warmup.",
      "points": [
        "GenAI cold start is dominated by getting weights onto the GPU, not by container boot.",
        "First question: should this scale to zero at all? For steady traffic, no.",
        "Warm minimum of one replica is usually cheaper than the user-facing cost of a 40-second wait.",
        "Pre-stage weights (fast volume, node cache, or baked into the image) - avoid a cold download at startup.",
        "Shrink the image; runtime rarely needs the full build toolchain.",
        "Warm up with a dummy inference in the health check, before traffic arrives.",
        "Scale-to-zero suits intermittent internal tools, not customer-facing paths."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Stages of a GenAI cold start, each with its fix: pull image, download weights, load onto the GPU, warm the runtime.",
        "lanes": [
          {
            "label": "Pull image",
            "note": "drop the CUDA toolchain"
          },
          {
            "label": "Download weights",
            "note": "pre-stage on volume or cache",
            "accent": "bad"
          },
          {
            "label": "Load onto GPU",
            "note": "tens of seconds or more",
            "accent": "bad"
          },
          {
            "label": "Warm runtime",
            "note": "dummy inference in health check"
          },
          {
            "label": "First request",
            "note": "no user pays the wait",
            "accent": "accent"
          }
        ],
        "caption": "GenAI cold start is **getting weights onto the GPU**, not container boot. For steady customer traffic, **don't scale to zero** - keep one warm replica."
      },
      "say": "That's a cold start, and for GenAI it's far worse because the weights must reach the GPU before anything runs. The replica pulls a multi-gigabyte image, downloads weights from object storage, loads them into GPU memory and warms the runtime. For a 13B model that's tens of seconds to minutes, not the milliseconds a web container takes. So first I ask whether it should scale to zero at all. For steady customer-facing traffic it shouldn't, because one warm replica costs less than users waiting forty seconds. Scale-to-zero belongs to intermittent internal tools. If we need it, I attack each stage. Weights get pre-staged on a fast volume or node-local cache, and the image drops the CUDA toolchain nobody needs at runtime. A health-check warmup runs one dummy inference, so no real user pays for initialisation. Adding replicas spends money without fixing why each one is slow. A cheaper design is a small always-warm model answering first while the large one scales up behind it.",
      "numbers": "Loading a 13B model from object storage onto a GPU can take tens of seconds to a few minutes, depending on storage throughput and image size. Pre-loading and a warmup inference make the replica ready before it takes traffic, so the first real user does not pay that cost.",
      "wrong": "Treating it like a normal autoscaling problem and just raising the replica count. That spends money without addressing why any single replica takes 40 seconds to become useful.",
      "follow": "Traffic is spiky and unpredictable. How do you size the warm pool?",
      "followAnswer": "I size it from the traffic history rather than the average. I look at the steady baseline and how fast spikes ramp compared with how long a replica takes to become ready, and keep enough warm replicas to absorb the spike that arrives within that cold-start window. Beyond that, I scale on queue depth or requests in flight, queue briefly, and overflow to a managed API or smaller model. Then I review cost against missed latency targets and adjust, with scheduled scaling for known peaks.",
      "builds": [
        "cd-08",
        "cl-08"
      ],
      "next": [
        "cl-05",
        "cd-09",
        "cl-04"
      ],
      "deeper": [
        "keda",
        "k8s-gpus"
      ],
      "check": {
        "kind": "judgement",
        "q": "A customer-facing chat runs on GPU pods that scale to zero overnight, and the first user each morning waits 40 seconds. Traffic is steady through the working day. What is the best fix?",
        "options": [
          "Raise the maximum replica count.",
          "Switch to a larger GPU so the model loads faster.",
          "Tell users the first answer may be slow.",
          "Keep a warm minimum of one replica, pre-stage the weights on fast local storage and run a warm-up inference at start-up."
        ],
        "answer": 3,
        "why": "For steady customer traffic, an idle GPU costs less than a 40-second wait. Pre-staged weights and a warm-up request mean no real user pays the load time. More replicas do not change how long each one takes to load."
      }
    },
    {
      "id": "cd-04",
      "q": "What does Databricks add for GenAI work?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "5-10",
      "priority": "low",
      "tags": [
        "cloud",
        "rag",
        "llmops"
      ],
      "why": "Named in many enterprise JDs, particularly where the data platform team owns the GenAI work.",
      "quick": [
        "Your data already lives there, so no copying it out.",
        "Prepare documents right next to the data.",
        "One place controls who sees what and where it came from.",
        "It also offers search indexes, model hosting and quality tracking.",
        "Great if you already use Databricks, not a reason to move."
      ],
      "simple": "Databricks' main value for GenAI is that the data is already there, and for RAG the data pipeline is most of the work. Your documents and tables already live in the lakehouse, so chunking and embedding run as jobs next to the data rather than as an export, which matters because exporting regulated data often isn't permitted.\n\nUnity Catalog is the piece worth naming. It gives one governance and lineage model across tables, files, models and vector indexes. For example, at a bank, a reviewer can trace a chatbot answer back through the vector index to the original policy table, all under the same access rules. Around that sit Vector Search, Model Serving and MLflow, which now covers GenAI evaluation and tracing too.\n\nSo it's a strong choice when you're already on Databricks and governance is the constraint, but not a reason to move a working system.",
      "points": [
        "The data is already there - ingestion runs next to it, no export of regulated data.",
        "Unity Catalog: one governance and lineage model over tables, files, models, indexes.",
        "Vector Search, Model Serving, and MLflow for tracking and GenAI evaluation.",
        "Strongest when the data platform is already Databricks and governance is binding.",
        "Not a reason to move a workload that already runs well elsewhere."
      ],
      "say": "Its main value is that the data is already there, and for RAG the data pipeline is most of the work. Your documents and tables live in the lakehouse, so ingestion, chunking and embedding run as jobs next to the data. That matters because exporting regulated data is often the step that isn't permitted. Unity Catalog is the piece I'd name, because it gives one governance and lineage model across tables, files, models and vector indexes. When a reviewer asks who can see what and where a value came from, that's one answer instead of four. Around it sit Vector Search for the index, Model Serving for endpoints, and MLflow for tracking. The part people miss is that MLflow now covers GenAI evaluation and tracing too, so calling Databricks just a Spark platform is a few years out of date. It's a strong choice when the data platform is already Databricks and governance is the binding constraint. It isn't a reason to move a workload that's running happily elsewhere.",
      "numbers": "No number applies. The governance and no-export argument is what carries weight in a regulated review.",
      "wrong": "\"It's a Spark platform.\" Accurate a few years ago and it misses Unity Catalog, Vector Search and the GenAI evaluation tooling, which is what the JD is naming.",
      "follow": "Who owns the GenAI pipeline in that setup - the data team or the application team?",
      "followAnswer": "Usually both, with a clear split rather than one team owning everything. The data team owns ingestion, chunking, embedding jobs, the vector index and Unity Catalog permissions, because those sit next to the data and its governance. The application team owns the prompts, retrieval logic, model serving endpoint, evaluation set and user experience. The contract between them is the index, with a version, a schema and a retrieval quality target. What matters most is one named owner for end-to-end answer quality.",
      "builds": [
        "cd-02"
      ],
      "next": [
        "cd-03",
        "cd-05",
        "rag-10"
      ],
      "deeper": [
        "databricks-genai",
        "mlflow"
      ],
      "check": {
        "kind": "judgement",
        "q": "A team with a working RAG stack on Azure asks whether to move to Databricks to get Vector Search. What is the best response?",
        "options": [
          "Yes - Databricks Vector Search is faster than any alternative.",
          "No - Databricks is only a Spark platform.",
          "Only if the data and its governance already live in Databricks, so Unity Catalog lineage and no-export processing solve a real constraint.",
          "Yes, but only for the embedding step."
        ],
        "answer": 2,
        "why": "Databricks earns its place when the data is already there and governance is the constraint. Moving a working system for a feature list adds risk for little gain. 'Only Spark' is years out of date."
      }
    },
    {
      "id": "cd-10",
      "q": "What is Microsoft Foundry, and where does Azure OpenAI fit inside it?",
      "round": [
        "screening",
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "cloud",
        "deployment",
        "agents"
      ],
      "why": "Most Indian enterprise GenAI work runs on Azure, and the platform has been renamed and restructured twice. The panel checks that you know the current resource model, not a 2024 one. **Also asked as:** \"What is Azure AI Foundry?\" · \"Hub or Foundry project?\"",
      "quick": [
        "Foundry is Microsoft's one platform for models, agents, tools and evaluation.",
        "Renamed: Azure AI Studio, then Azure AI Foundry, now Microsoft Foundry.",
        "One Foundry resource holds projects, deployments, networking and access roles.",
        "Azure OpenAI models are Foundry Models sold and supported by Microsoft.",
        "Hub-based projects are now \"Foundry (classic)\"; new work uses Foundry projects."
      ],
      "simple": "Microsoft Foundry is the Azure platform where you deploy models, build agents, attach tools and knowledge, and run evaluations and tracing, all under one Azure resource. It used to be called Azure AI Studio and then Azure AI Foundry, and the older Azure AI Services brand is now called Foundry Tools. The old design needed a hub plus separate Azure OpenAI and AI Services resources. The current design is a single Foundry resource with projects inside it, which gives you one place for access roles, private networking and Azure Policy.\n\nAzure OpenAI didn't disappear. It's now the set of OpenAI models inside Foundry Models that Microsoft sells and supports directly, next to models from partners like Anthropic, Meta and Mistral. You still create a named deployment and pick a deployment type, and that type decides where prompts are processed. An existing Azure OpenAI resource can be upgraded to a Foundry resource and keeps its endpoint and keys.\n\nFor example, a bank that has run an Azure OpenAI resource since 2024 can upgrade it, add a project for a new agent, and keep its existing apps working. The API surface also moved, from monthly `api-version` parameters to stable `/openai/v1/` routes, and from the Assistants API to the Responses API.",
      "points": [
        "Lineage: Azure AI Studio, then Azure AI Foundry, then Microsoft Foundry; AI Services became Foundry Tools.",
        "Resource model: one Foundry resource with projects, replacing hub + Azure OpenAI + AI Services.",
        "Azure OpenAI = OpenAI models sold directly by Azure inside Foundry Models; partner models sit alongside.",
        "Deployments still have a type (Global, Data Zone, Standard, Provisioned, Batch) that decides processing location.",
        "APIs moved to v1 routes and the Responses API; hub projects live on as Foundry (classic).",
        "Governance is shared: Entra ID roles, private endpoints, Azure Policy and content filters on one resource."
      ],
      "diagram": {
        "kind": "stack",
        "alt": "Layers of a Microsoft Foundry setup: the Foundry resource with networking and access, projects, model deployments, Agent Service, tools and knowledge, and observability.",
        "top": "your app or agent",
        "bottom": "one Azure resource",
        "layers": [
          {
            "label": "Observability and evals",
            "note": "tracing, monitoring, evaluations"
          },
          {
            "label": "Tools and knowledge",
            "note": "search, MCP, memory"
          },
          {
            "label": "Agent Service",
            "note": "prompt agents, hosted agents",
            "accent": "accent"
          },
          {
            "label": "Model deployments",
            "note": "Azure OpenAI and partner models",
            "accent": "accent"
          },
          {
            "label": "Projects",
            "note": "one per team or app"
          },
          {
            "label": "Foundry resource",
            "note": "RBAC, private endpoints, policy",
            "accent": "warn"
          }
        ],
        "caption": "**One resource, many projects.** Access, networking and policy are set once on the Foundry resource; Azure OpenAI is just one family of models deployed inside it."
      },
      "say": "Microsoft Foundry is Azure's single platform for models, agents, tools and evaluation, and it's the current name for what was Azure AI Studio and then Azure AI Foundry. The structural change that matters is the resource model. It used to be a hub plus separate Azure OpenAI and AI Services resources. Now it's one Foundry resource with projects inside, so access roles, private endpoints and Azure Policy are set in one place. Azure OpenAI still exists. It's the OpenAI models that Microsoft sells and supports directly inside Foundry Models, next to partner models. I still create a named deployment and pick a deployment type, because that type decides where prompts are processed and what quota I draw from. An old Azure OpenAI resource can be upgraded in place and keeps its endpoint and keys. On a new project I check the deployment type against residency, disable keys in favour of Entra ID, and use the v1 routes and the Responses API.",
      "numbers": "Microsoft's overview lists more than 10,000 models in the Foundry catalogue, but only the models sold directly by Azure come with Microsoft's own support and the full set of deployment types. Check the per-model, per-region table before designing.",
      "verified": "2026-10",
      "wrong": "\"Foundry is a new product, so we'll migrate off Azure OpenAI.\" Azure OpenAI is inside Foundry; the upgrade keeps endpoints and keys. Treating it as a rewrite wastes weeks and signals you haven't used the current platform.",
      "follow": "When would you still keep a plain Azure OpenAI resource rather than upgrade it to a Foundry resource?",
      "followAnswer": "If all an app does is call a model with no agents, tools or evaluations, upgrading buys little, and some teams have security approvals tied to the existing resource. I'd still plan the upgrade, because new investment goes into Foundry projects, the agent and evaluation features need them, and Microsoft documents an in-place upgrade that keeps the endpoint and keys. The practical step is to upgrade in a non-production subscription first, confirm that network rules, role assignments and diagnostic settings carry over, and then schedule production with the security team rather than surprising them.",
      "builds": [
        "cd-01",
        "llm-08"
      ],
      "next": [
        "cd-11",
        "cd-17",
        "cd-20"
      ],
      "deeper": [
        "azure-foundry",
        "azure-openai"
      ],
      "check": {
        "kind": "concept",
        "q": "A team says: \"We moved to Microsoft Foundry, so Azure OpenAI deployment types no longer matter for data residency.\" What is right?",
        "options": [
          "Correct - Foundry processes every model in the resource's region.",
          "Wrong - each model deployment still has a type such as Global or Data Zone that decides where prompts are processed.",
          "Correct - residency is now set once per Foundry project.",
          "Wrong - residency only depends on the region of the AI Search index."
        ],
        "answer": 1,
        "why": "Foundry changed the resource model, not how inference location works. A Global deployment may still process prompts in any Azure region even if the resource sits in an Indian region. Assuming the project or resource region decides it is the trap."
      }
    },
    {
      "id": "cd-11",
      "q": "Foundry Agent Service offers prompt agents and hosted agents. When would you use each, and when would you run the agent loop yourself?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cloud",
        "agents",
        "trade-offs"
      ],
      "why": "Checks that you can place a managed agent runtime on the build-versus-buy spectrum and name what you give up, not just list features.",
      "quick": [
        "Prompt agent: instructions, model and tools declared, Foundry runs it.",
        "Hosted agent: your own container and framework, Foundry runs and scales it.",
        "Own loop on AKS or Container Apps: most control, most work.",
        "Managed buys identity, sandboxing, tracing and session isolation for free.",
        "You trade portability and fine control of the loop for that."
      ],
      "simple": "Foundry Agent Service gives you two managed ways to run an agent. A prompt agent is declarative. You pick a model, write instructions and attach tools, and Foundry hosts and runs it, with no application code to deploy. A hosted agent is your own code, built with Microsoft Agent Framework, LangGraph or another SDK, packaged as a container. Foundry gives it a managed endpoint, scaling, identity and observability. Each session runs in its own sandbox, and you pay for active execution rather than idle time.\n\nThe third option is to run the loop yourself, for example a FastAPI service on AKS that calls the model API directly. You get full control of retries, streaming, state and cost, and the code moves between clouds, but you build the sandboxing, session store, tracing and access control yourself.\n\nFor example, an HR policy assistant over SharePoint is a good prompt agent. A claims agent with custom approval steps fits a hosted agent. A product your firm sells to several clients on different clouds usually justifies owning the loop.",
      "points": [
        "Prompt agent: declarative, fastest to build, least control.",
        "Hosted agent: bring your own container and framework; Foundry handles endpoint, scale, identity, tracing.",
        "Per-session sandboxing and pay-for-active-execution are the managed runtime's real value.",
        "Own loop: maximum control and portability; you build isolation, state, tracing and access yourself.",
        "Decide on portability, control of the loop, network isolation needs and who operates it after handover."
      ],
      "say": "I see it as a spectrum. A prompt agent is declarative: model, instructions and tools, and Foundry runs it. That's right for bounded assistants, like Q and A over HR policy with a couple of tools, where speed to production matters more than loop control. A hosted agent is my own code, for example Agent Framework or LangGraph in a container, and Foundry gives it the endpoint, scaling, managed identity, tracing and a sandbox per session, and bills only active execution. That's where I'd put a claims workflow with custom approval logic. Running the loop myself on AKS or Container Apps gives full control and portability, but then I own session isolation, state, tracing and access control. I pick by four questions. Does the client need it to run on another cloud? Do I need control the managed loop doesn't give? Does every tool work inside the network isolation they require? And who operates it after we hand over? For a services firm, that last one often decides it.",
      "numbers": "Rule of thumb: if the agent needs more than a handful of custom orchestration steps or must run on a second cloud, a hosted agent or your own loop beats a prompt agent. For network-isolated setups, check the tool-by-tool support table, because web grounding tools still call public endpoints.",
      "verified": "2026-10",
      "wrong": "\"Managed agents are always better because Microsoft runs them.\" It ignores lock-in, tools that don't work in a network-isolated setup, and the fact that the client's team must be able to change the agent after go-live.",
      "follow": "Your hosted agent must stay entirely inside the client's virtual network. What do you check?",
      "followAnswer": "First, that the Foundry resource uses the standard agent setup with our own Storage, AI Search and Cosmos DB, each with its own private endpoint, because those aren't created automatically. Second, virtual network injection into a delegated subnet, since outbound networking can't be added to an existing deployment later. Third, the tool list. Private MCP, AI Search, OpenAPI and Functions go through our subnet, but Bing and web search go to public endpoints, so I'd block them with Azure Policy if the rule is no public egress. Last, an egress firewall with only the documented identity endpoints allowed.",
      "builds": [
        "ag-01",
        "cd-10"
      ],
      "next": [
        "cd-12",
        "cd-18",
        "ag-37"
      ],
      "deeper": [
        "azure-foundry",
        "ms-agent-framework"
      ],
      "check": {
        "kind": "judgement",
        "q": "A services firm is building one agent product that three clients will run - one on Azure, two on AWS. Which hosting choice fits best?",
        "options": [
          "Foundry prompt agents for all three clients, rebuilt per cloud.",
          "Agent loop in portable code, run as a Foundry hosted agent on Azure and on AgentCore Runtime on AWS.",
          "Copilot Studio, because it is low-code and fastest to hand over.",
          "Bedrock Agents Classic everywhere, since it is free to use."
        ],
        "answer": 1,
        "why": "Portable agent code in a container can run on either cloud's managed runtime, so you keep one codebase and still get managed scaling and identity. Prompt agents and Copilot Studio tie you to one platform, and Agents Classic no longer accepts new customers."
      }
    },
    {
      "id": "cd-12",
      "q": "Semantic Kernel or Microsoft Agent Framework - which would you start a new .NET or Python agent project on today?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "agents",
        "cloud",
        "trade-offs"
      ],
      "why": "Microsoft shops still list Semantic Kernel in job descriptions. The panel checks you know it has been succeeded, what moved, and how you would migrate without a rewrite.",
      "quick": [
        "Agent Framework 1.0 shipped in April 2026 for .NET and Python.",
        "It succeeds both Semantic Kernel and AutoGen.",
        "Semantic Kernel gets fixes, but new features go to Agent Framework.",
        "Stable: agents, connectors, middleware, memory, graph workflows, MCP.",
        "New work: Agent Framework. Existing SK apps: migrate on your schedule."
      ],
      "simple": "Semantic Kernel was Microsoft's SDK for wiring models, prompts and plugins into .NET and Python apps. AutoGen was Microsoft Research's framework for multi-agent conversations. Microsoft Agent Framework merges the two. It takes Semantic Kernel's enterprise features, like connectors, telemetry and dependency injection, and AutoGen's orchestration patterns, and it reached version 1.0 in April 2026 with stable APIs and long-term support.\n\nThe stable core covers single agents with connectors for Foundry, Azure OpenAI, OpenAI, Anthropic, Bedrock, Gemini and Ollama, plus middleware hooks, memory and context providers, graph-based workflows, and multi-agent patterns such as sequential, concurrent, handoff, group chat and Magentic-One. MCP tools are supported. Some pieces, like the DevUI debugger and Foundry hosted-agent integration, were still preview at 1.0.\n\nSemantic Kernel isn't switched off. It moved to maintenance, with critical and security fixes but no new features. For example, a team with a working SK chatbot doesn't rewrite it this sprint. It starts new agents on Agent Framework and migrates the old one using Microsoft's guide, where plugins become tools and threads become sessions.",
      "points": [
        "Agent Framework 1.0 (April 2026) is the successor to Semantic Kernel and AutoGen.",
        "Stable: agents and connectors (including non-Microsoft models), middleware, memory, graph workflows, orchestration patterns, MCP.",
        "Preview at 1.0: DevUI, Foundry hosted-agent integration and some Foundry tooling; A2A 1.0 support announced as coming.",
        "Semantic Kernel: maintenance mode with critical and security fixes; no new features.",
        "Migration is mechanical: kernel to agent, plugins to tools, threads to sessions."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of Semantic Kernel, AutoGen and Microsoft Agent Framework by status, strength and what to do for new work.",
        "caption": "**Two predecessors, one successor.** Start new work on Agent Framework; move Semantic Kernel and AutoGen apps across when it suits your release plan.",
        "aspects": [
          "Status",
          "Strength",
          "For new work"
        ],
        "columns": [
          {
            "label": "Semantic Kernel",
            "note": "2023 onwards",
            "cells": [
              "Maintenance, fixes only",
              "Enterprise plumbing, plugins",
              "Don't start here"
            ]
          },
          {
            "label": "AutoGen",
            "note": "Microsoft Research",
            "cells": [
              "Maintenance",
              "Multi-agent conversation",
              "Don't start here"
            ]
          },
          {
            "label": "Agent Framework",
            "note": "1.0 in April 2026",
            "accent": "accent",
            "cells": [
              "Stable, long-term support",
              "Both, plus graph workflows",
              "Default choice"
            ]
          }
        ]
      },
      "say": "For a new project I'd start on Microsoft Agent Framework. It reached 1.0 in April 2026 for both .NET and Python and it's the stated successor to Semantic Kernel and AutoGen. It combines Semantic Kernel's enterprise plumbing with AutoGen's orchestration patterns. The stable core is what I need: agents with connectors to Azure OpenAI, Foundry and non-Microsoft models, middleware for logging and policy, memory providers, graph workflows and MCP tools. Semantic Kernel is in maintenance. It still gets critical and security fixes, but new features land in Agent Framework, so building new work on it creates migration debt on day one. For an existing Semantic Kernel app that works, I wouldn't rewrite it under pressure. I'd plan a migration using Microsoft's guide, where plugins become tools and threads become sessions, behind the eval suite so behaviour doesn't drift. I'd also avoid the preview pieces in production, like the DevUI and hosted-agent integration, until they go stable.",
      "numbers": "Microsoft's 1.0 announcement lists connectors for at least seven model providers, including Anthropic, Bedrock, Gemini and Ollama, so choosing Agent Framework does not lock you to Azure OpenAI models.",
      "verified": "2026-10",
      "wrong": "\"Semantic Kernel is deprecated, so every SK app must be rewritten now.\" It is in maintenance with fixes, not end-of-life. The mature answer is new work on Agent Framework and a planned migration for old apps.",
      "follow": "How would you migrate a Semantic Kernel plugin-based app without changing its behaviour?",
      "followAnswer": "I'd freeze behaviour first with a regression eval set of real conversations and expected tool calls, and record traces from the current app. Then I'd port in slices. Plugins become Agent Framework tools with the same names and schemas, the kernel's chat service becomes an agent with the same model deployment and settings, and chat history moves into a session. I'd run both versions side by side on the eval set and compare tool-call sequences, not just final text, because a renamed parameter or changed tool description quietly changes routing. Only when they match do I switch traffic.",
      "builds": [
        "ag-41",
        "ag-37"
      ],
      "next": [
        "cd-11",
        "ag-25",
        "mcp-04"
      ],
      "deeper": [
        "ms-agent-framework",
        "semantic-kernel"
      ],
      "check": {
        "kind": "judgement",
        "q": "A client has a stable Semantic Kernel app in production and wants a second, new agent next quarter. What do you recommend?",
        "options": [
          "Build the new agent on Semantic Kernel too, for consistency.",
          "Rewrite the existing app on Agent Framework first, then build the new one.",
          "Build the new agent on Agent Framework and plan the old app's migration behind its eval set.",
          "Use AutoGen for the new agent because it handles multi-agent work."
        ],
        "answer": 2,
        "why": "New features only land in Agent Framework, so new work starts there. The working app is in maintenance, not broken, so it migrates on a planned schedule with regression evals. A forced rewrite adds risk; AutoGen is also in maintenance."
      }
    },
    {
      "id": "cd-13",
      "q": "When does a services firm reach for Copilot Studio instead of custom code on Foundry?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cloud",
        "trade-offs",
        "agents"
      ],
      "why": "Indian services firms sell both. The panel wants a decision rule a client would accept - users, ownership, control and cost - not \"low-code is for beginners\".",
      "quick": [
        "Copilot Studio: low-code agents and workflows that live in Teams and Microsoft 365.",
        "Pick it when users live in M365 and the client's makers will own it.",
        "Pick custom code when model choice, evals, isolation or scale matter.",
        "Billing is in Copilot Credits, not raw tokens - model the cost.",
        "Common pattern: Copilot Studio front end calling a Foundry agent."
      ],
      "simple": "Copilot Studio is Microsoft's low-code studio for building agents and workflows that run in Teams, Microsoft 365 Copilot, websites and other channels. Makers connect knowledge sources and Power Platform connectors, and admins govern it from the Power Platform admin centre. Usage is billed in Copilot Credits, and the harness you pick changes how an agent reasons and how it's billed.\n\nCustom code on Foundry, with Agent Framework or LangGraph, gives you model choice, prompts versioned in Git, evaluations in CI, private networking and a container you can move. It also gives you a codebase someone has to maintain.\n\nSo the decision is mostly about who uses it and who owns it after handover. For example, an HR policy bot for 20,000 employees who already live in Teams, owned afterwards by the client's Power Platform team, is a Copilot Studio job. A claims-triage agent that must hit an accuracy target, call internal APIs inside a private network and be regression-tested on every change is a Foundry job. Often you do both: Copilot Studio as the Teams front end, calling a Foundry agent or API as a tool.",
      "points": [
        "Copilot Studio fits M365-centric users, connector-based workflows and client-owned maintenance by makers.",
        "Custom code fits strict accuracy targets, model choice, CI evals, network isolation and multi-cloud.",
        "Model the cost in Copilot Credits per conversation and action, against token cost on Foundry.",
        "Plan the handover: who can change it, test it and govern it after you leave.",
        "Hybrid is common: Copilot Studio front end, Foundry agent or API behind it as a tool."
      ],
      "say": "I decide on users, ownership and control. Copilot Studio is right when the users already live in Teams and Microsoft 365, the work is knowledge Q and A or a workflow over standard connectors, and the client's own Power Platform makers will own it after we leave. It's fast, governed from the Power Platform admin centre, and the client can change it without us. I move to custom code on Foundry when the model choice is part of the design, when I need prompts in Git and evals gating every release, when it must run inside a private network, or when it's a product for several clients. Cost needs modelling too, because Copilot Studio bills in Copilot Credits per interaction rather than raw tokens. That's cheaper at small scale and can be dearer at high volume. Quite often the answer is both. Copilot Studio is the Teams front end, and it calls a Foundry agent as a tool for the hard part.",
      "numbers": "No fixed number. Price both options per 1,000 conversations using Microsoft's current Copilot Credits rates and your measured token usage on Foundry, then add the people cost of maintaining custom code for three years.",
      "verified": "2026-10",
      "wrong": "\"Copilot Studio is a toy; real engineers write code.\" Clients pay for outcomes and maintainability. Building custom code for a Teams FAQ bot the client's makers could own is over-engineering that costs them money after handover.",
      "follow": "The client chose Copilot Studio, but now wants accuracy measured before each change. What do you do?",
      "followAnswer": "First I'd use what's built in. Copilot Studio has evaluations with test sets and graders, so I'd build a golden set from real Teams questions and run it before publishing. If they need more than that, such as regression gates in a pipeline or custom metrics, I'd move the reasoning-heavy part into a Foundry agent or API that we test in CI, and keep Copilot Studio as the channel and orchestration layer calling it. That keeps the client's makers in control of the conversation design while the accuracy-critical step gets proper release gates.",
      "builds": [
        "ag-13",
        "sd-02"
      ],
      "next": [
        "cd-11",
        "cd-23",
        "sd-18"
      ],
      "deeper": [
        "copilot-studio",
        "azure-foundry"
      ],
      "check": {
        "kind": "judgement",
        "q": "Which project most clearly belongs in custom code on Foundry rather than Copilot Studio?",
        "options": [
          "A Teams bot answering leave-policy questions from SharePoint, maintained by the client's makers.",
          "A meeting-notes summary agent for Microsoft 365 users.",
          "A multi-tenant extraction agent your firm sells to five clients, with accuracy gates on every release.",
          "An approval workflow using standard Power Platform connectors."
        ],
        "answer": 2,
        "why": "A multi-client product with release gates needs versioned code, CI evals and portability. The other three are M365-centric, connector-based and client-owned - exactly where Copilot Studio is the cheaper, more maintainable choice."
      }
    },
    {
      "id": "cd-14",
      "q": "On Amazon Bedrock, what do Knowledge Bases, AgentCore and Guardrails each do - and what changed for Bedrock Agents?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "cloud",
        "rag",
        "agents",
        "guardrails"
      ],
      "why": "The AWS half of the Indian market asks this. The panel checks you know the building blocks and the 2026 shift from Bedrock Agents to AgentCore.",
      "quick": [
        "Knowledge Bases: managed RAG - ingest, chunk, embed, store, retrieve.",
        "AgentCore: runtime, gateway, memory, identity and tracing for agents.",
        "Bedrock Agents is now \"Agents Classic\", closed to new accounts.",
        "Guardrails: filters, denied topics, PII, grounding checks on input and output.",
        "Guardrails also work standalone through the ApplyGuardrail API."
      ],
      "simple": "Bedrock gives you model access through one API, plus three building blocks around it.\n\nKnowledge Bases is managed RAG. You point it at a source such as S3, it chunks and embeds documents into a vector store you choose, and you call a retrieve API, or retrieve-and-generate, to get grounded answers with citations.\n\nAgentCore is where agents run now. You either declare the model, tools and instructions in the managed harness, or deploy your own agent code built with Strands, LangGraph, the OpenAI Agents SDK, the Claude Agent SDK or plain Python on AgentCore Runtime. Around it you get a Gateway that exposes your APIs and Lambda functions as MCP tools, memory, identity and end-to-end tracing. The older Bedrock Agents service was renamed Agents Classic and stopped taking new customers on 30 July 2026. Existing agents keep working, but no new features or models are added.\n\nGuardrails is the policy layer. It covers content filters, denied topics, word filters, PII detection and masking, and grounding checks, applied to prompts and responses. For example, a bank's agent can mask account numbers in answers and block investment advice, whether the model is on Bedrock or elsewhere, via `ApplyGuardrail`.",
      "points": [
        "Knowledge Bases: managed ingestion and retrieval with citations; you choose the vector store.",
        "AgentCore: managed harness or your own framework on AgentCore Runtime, plus Gateway (MCP tools), Memory, Identity, Observability.",
        "Agents Classic: maintenance mode, closed to accounts without prior use from 30 July 2026; migrate new work to AgentCore.",
        "Knowledge Bases and Guardrails are unaffected and plug into AgentCore through the Gateway.",
        "Guardrails: filters, denied topics, PII masking, grounding checks; usable standalone through ApplyGuardrail."
      ],
      "say": "Bedrock is model access plus three building blocks. Knowledge Bases is managed RAG. It ingests from sources like S3, chunks, embeds into a vector store I choose, and gives me retrieve or retrieve-and-generate APIs with citations. AgentCore is the agent platform. I can declare an agent in the managed harness, or run my own code, LangGraph or Strands for example, on AgentCore Runtime. It adds a Gateway that turns APIs and Lambdas into MCP tools, memory, identity and tracing. The change to know is that the original Bedrock Agents became Agents Classic and stopped accepting new customers on 30 July 2026. Existing agents keep running, but new work goes to AgentCore. Guardrails is the policy layer: content filters, denied topics, PII masking and grounding checks on input and output, and I can call it standalone with ApplyGuardrail, even for a model hosted elsewhere. And a guardrail never replaces access control on the tools.",
      "numbers": "Key date: from 30 July 2026, accounts with no Bedrock Agents activity in the previous 12 months get an AccessDeniedException on CreateAgent. There is no exception process, so new AWS accounts must use AgentCore.",
      "verified": "2026-10",
      "wrong": "\"I'd build it with Bedrock Agents and action groups.\" In a new account that call is now refused. Naming the pre-2026 service as the default tells the panel your AWS knowledge stopped in 2025.",
      "follow": "Your client has a working Agents Classic deployment. Do you migrate it now?",
      "followAnswer": "Not as an emergency. AWS states there's no migration deadline and existing agents keep working. But the model catalogue in Agents Classic is frozen, so the agent can't move to newer models, and there are no new features. I'd plan a migration to the AgentCore harness, which maps action groups to Gateway tools and knowledge bases to a Gateway retrieval tool. The things that don't map cleanly are stage-specific prompt overrides and routing-style multi-agent setups, which need code. I'd run the old and new agents on the same eval set and switch when they match.",
      "builds": [
        "rag-17",
        "cd-02"
      ],
      "next": [
        "cd-17",
        "cd-18",
        "gr-04"
      ],
      "deeper": [
        "bedrock",
        "bedrock-guardrails"
      ],
      "check": {
        "kind": "predict",
        "q": "In October 2026 a team creates a brand-new AWS account and runs their 2025 Terraform that calls `CreateAgent` for Bedrock Agents. What happens?",
        "options": [
          "It works, because Terraform templates are grandfathered.",
          "It fails with AccessDeniedException, because new accounts can't create Agents Classic agents.",
          "It works, but the agent is automatically converted to AgentCore.",
          "It fails only if a Guardrail is attached."
        ],
        "answer": 1,
        "why": "The allowlist is per account, based on Bedrock Agents use in the past 12 months. A new account has none, so CreateAgent is refused. Existing templates only keep working in allowlisted accounts; nothing is converted automatically."
      }
    },
    {
      "id": "cd-15",
      "q": "Vertex AI is now Gemini Enterprise Agent Platform. What is in it, and how is it different from the Gemini Enterprise app?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "medium",
      "tags": [
        "cloud",
        "agents"
      ],
      "why": "Google renamed its platform in April 2026. Using the old names is fine if you know the new ones; confusing the developer platform with the employee app is not.",
      "quick": [
        "April 2026: Vertex AI became part of Gemini Enterprise Agent Platform.",
        "Agent Engine is now Agent Runtime; Vertex AI Studio is Agent Studio.",
        "Vertex AI Search is now Agent Search; RAG Engine keeps its name.",
        "Gemini Enterprise is the employee app, formerly Agentspace.",
        "Existing Vertex integrations keep working; mostly names and console changed."
      ],
      "simple": "Google has two products with similar names, and the distinction matters in a client conversation.\n\nGemini Enterprise Agent Platform is the developer platform. It's what Vertex AI became at Google Cloud Next in April 2026. It holds Model Garden with Gemini, partner models like Claude and open models. It also holds Agent Studio, formerly Vertex AI Studio, for prompting and testing, and Agent Runtime, formerly Agent Engine, for hosting agents, often built with the open-source Agent Development Kit (ADK). Then there's RAG Engine, Vector Search, Agent Search (formerly Vertex AI Search), tuning, pipelines and the model registry. Google says existing integrations keep working, so this is mostly names, console and documentation.\n\nGemini Enterprise, without \"Agent Platform\", is the app for employees. It came from Agentspace in October 2025. It combines enterprise search, connectors to Workspace, SharePoint, Salesforce and similar, prebuilt agents and a no-code agent designer, and it's licensed per user.\n\nFor example, an insurer wanting staff to search policies and ask questions across Drive and ServiceNow is a Gemini Enterprise sale. An insurer building a claims agent into its own portal builds on the Agent Platform.",
      "points": [
        "Agent Platform = renamed Vertex AI (April 2026): Model Garden, Agent Studio, Agent Runtime, RAG Engine, Vector Search, Agent Search.",
        "ADK is Google's open-source agent framework; Agent Runtime hosts ADK and other framework agents.",
        "Gemini Enterprise = employee-facing app (formerly Agentspace) with connectors and no-code agents, per-user licensing.",
        "Old Vertex names and endpoints still work; links redirect.",
        "Residency: choose regional endpoints; the global endpoint has no residency guarantee."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Old Vertex AI names next to their current Gemini Enterprise Agent Platform names, plus the employee app formerly called Agentspace.",
        "caption": "**Same services, new names.** Know both, because client documents and job descriptions will use either.",
        "aspects": [
          "Platform",
          "Prompt workspace",
          "Agent hosting",
          "Enterprise search",
          "Employee app"
        ],
        "columns": [
          {
            "label": "Before",
            "note": "until 2025 to early 2026",
            "cells": [
              "Vertex AI",
              "Vertex AI Studio",
              "Vertex AI Agent Engine",
              "Vertex AI Search",
              "Agentspace"
            ]
          },
          {
            "label": "Now",
            "note": "late 2026",
            "accent": "accent",
            "cells": [
              "Gemini Enterprise Agent Platform",
              "Agent Studio",
              "Agent Runtime",
              "Agent Search",
              "Gemini Enterprise"
            ]
          }
        ]
      },
      "say": "Since Google Cloud Next in April 2026, Vertex AI is part of Gemini Enterprise Agent Platform, and that's the developer platform. It has Model Garden with Gemini, partner models like Claude, and open models. Agent Studio is the old Vertex AI Studio. Agent Runtime, the old Agent Engine, hosts agents, typically built with the open-source ADK. RAG Engine and Vector Search keep their names, and Vertex AI Search is now Agent Search. Google says existing integrations keep working, so in practice it's names and console. The thing not to confuse is Gemini Enterprise, the app. That's the employee product that grew out of Agentspace, with enterprise search, connectors and no-code agents, licensed per user. So if a client wants staff to search across Drive and ServiceNow, that's the app. If they want a claims agent inside their own portal, I build on the Agent Platform. On residency I'd use regional endpoints, because the global endpoint can process requests anywhere.",
      "numbers": "Rename date: 22 April 2026, per Google's Agent Platform release notes, which include a full old-to-new name mapping table.",
      "verified": "2026-10",
      "wrong": "Treating Gemini Enterprise and the Agent Platform as the same product. One is a per-user SaaS app for employees, the other is the developer platform - mixing them up leads to the wrong licence and the wrong architecture.",
      "follow": "Your Gemini calls get 429 errors at peak. Google's docs suggest the global endpoint. Is that acceptable for an Indian bank?",
      "followAnswer": "Usually not. With pay-as-you-go, Gemini uses a shared pool, and a 429 can mean the regional pool is saturated, not that my project is over a limit. The global endpoint spreads load across locations, but it gives no residency guarantee, so for a bank with an in-India requirement it's off the table. Instead I'd add backoff with jitter and smooth bursts through a queue. For the steady baseline I'd buy Provisioned Throughput in the Indian region so the capacity is reserved, and push anything that can wait to batch.",
      "builds": [
        "cd-02"
      ],
      "next": [
        "cd-19",
        "cd-20",
        "ag-41"
      ],
      "deeper": [
        "vertex-ai",
        "gemini-docs"
      ],
      "check": {
        "kind": "concept",
        "q": "A client asks for \"Gemini Enterprise\" to build a customer-facing claims agent inside their web portal. What do you clarify?",
        "options": [
          "Nothing - Gemini Enterprise is the platform for that.",
          "That customer-facing agents need Agentspace, which replaced Gemini Enterprise.",
          "That the employee app is Gemini Enterprise; a portal agent is built on Gemini Enterprise Agent Platform.",
          "That Google has no agent hosting, so use another cloud."
        ],
        "answer": 2,
        "why": "Gemini Enterprise is the per-user employee app (formerly Agentspace). Building an agent into your own product uses the developer platform - formerly Vertex AI - with Agent Runtime and ADK. The names are close enough that clients mix them up."
      }
    },
    {
      "id": "cd-16",
      "q": "Walk me through building and governing a RAG agent on Databricks in 2026.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cloud",
        "rag",
        "agents"
      ],
      "why": "Where the data platform team owns GenAI, Databricks is the stack. cd-04 asks what Databricks adds; this checks you can name today's components, which Databricks has been renaming.",
      "quick": [
        "Data and permissions stay in Unity Catalog.",
        "AI Search (formerly Vector Search) syncs an index from a Delta table.",
        "Agent Bricks is Databricks' agent developer platform.",
        "Unity AI Gateway adds rate limits, guardrails and usage tracking.",
        "MLflow Tracing and evaluation gate each release."
      ],
      "simple": "On Databricks the main idea is that the agent sits next to the data and inherits its governance. You prepare and chunk documents with Spark jobs into a Delta table governed by Unity Catalog. Then you create an AI Search index, which Databricks renamed from Vector Search in 2026. A Delta Sync index keeps the vectors in step with the table, so a document deleted from the table drops out of search without a separate pipeline.\n\nThe agent is built and deployed with Agent Bricks, Databricks' agent developer platform. It covers code-first agents, packaged ones like Knowledge Assistant, tools via MCP and memory backed by Lakebase. Model calls go through the gateway, now Unity AI Gateway (in beta at the time of writing), which sets rate limits per endpoint, user or group, applies guardrails such as PII and prompt-injection policies, and records usage. MLflow Tracing records each step, and MLflow evaluation runs your golden set before release.\n\nFor example, a manufacturer whose maintenance manuals already live in the lakehouse can build a technician assistant without copying data to another vendor. Search, permissions and audit then follow the same Unity Catalog grants as the tables.\n\nThe names have shifted from the \"Mosaic AI\" umbrella, so describe the function and the current name.",
      "points": [
        "Unity Catalog governs tables, indexes, models, functions and MCP services with one permission model.",
        "AI Search (formerly Vector Search): Delta Sync indexes stay in step with source tables.",
        "Agent Bricks: agent development and deployment, including prebuilt Knowledge Assistant patterns.",
        "Unity AI Gateway: rate limits, guardrails, usage tracking and MCP governance (beta at the time of writing).",
        "MLflow Tracing and evaluation for debugging and release gates.",
        "Strength: no data copy out of the lakehouse. Weakness: naming churn and fewer frontier-model options than the hyperscalers' own platforms."
      ],
      "say": "On Databricks I keep everything next to the data and governed by Unity Catalog. I chunk documents with Spark into a Delta table, then create an AI Search index, which was called Vector Search until this year, as a Delta Sync index. That keeps it in step with the table, so deletes and permission changes flow through without a second pipeline. I build the agent with Agent Bricks, Databricks' agent platform, using tools through MCP and Unity Catalog functions. Model calls go through Unity AI Gateway, which gives per-user and per-group rate limits, guardrails for PII and prompt injection, and usage tracking. It's still beta, so I'd confirm that with the client. MLflow Tracing captures each step, and MLflow evaluation runs the golden set as a release gate. The selling point is that search, audit and access follow the same grants as the tables. The caution is that Databricks has renamed a lot recently, so I describe components by what they do and check the current docs.",
      "numbers": "Rule of thumb: a Delta Sync index removes the most common RAG compliance bug - deleted or re-permissioned documents still being retrievable - because the index follows the table rather than a separate ingestion job.",
      "verified": "2026-10",
      "wrong": "\"I'd export the data to a separate vector database and build there.\" On a Databricks estate that throws away Unity Catalog governance and lineage, which is usually the reason the client chose Databricks.",
      "follow": "A user loses access to a document folder. How quickly does your Databricks agent stop citing it?",
      "followAnswer": "It depends on where access is enforced. If permissions are columns in the Delta table and I filter on them at query time with the user's groups, the change applies as soon as the table updates and the index syncs. With a triggered sync that's the next run, and with continuous sync it's near-immediate. If the agent queries with a service principal and ignores user identity, the user keeps seeing it, which is a bug. So I filter retrieval by the calling user's entitlements and run the agent on behalf of the user where possible.",
      "builds": [
        "cd-04",
        "rag-57"
      ],
      "next": [
        "cd-21",
        "ev-06",
        "ops-12"
      ],
      "deeper": [
        "databricks-genai",
        "mlflow"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which Databricks design is most likely to keep returning a document after it is deleted from the source table?",
        "options": [
          "A Delta Sync AI Search index on the governed table.",
          "Embeddings written once by a notebook into an external vector store.",
          "A Delta Sync index with self-managed embeddings.",
          "Retrieval filtered by Unity Catalog permissions at query time."
        ],
        "answer": 1,
        "why": "A one-off export has no link to the source table, so deletes never propagate. Delta Sync indexes, with Databricks-computed or self-managed embeddings, follow the table. Query-time permission filtering also helps, but only on data that is still current."
      }
    },
    {
      "id": "cd-17",
      "q": "How should a GenAI service authenticate to the model, the vector store and its tools - without API keys?",
      "round": [
        "tech1",
        "tech2"
      ],
      "level": "3-5",
      "priority": "high",
      "tags": [
        "security",
        "cloud",
        "deployment"
      ],
      "why": "A leaked key in a repo is still the most common GenAI security incident. The panel checks you default to workload identity on every cloud and know what keys bypass.",
      "quick": [
        "Use the platform's workload identity, not keys in config.",
        "Azure: managed identity plus a least-privilege Foundry role.",
        "AWS: an IAM role on the compute, scoped to model ARNs.",
        "CI pipelines use OIDC federation, not stored cloud secrets.",
        "Disable key auth - a key bypasses role-based access completely."
      ],
      "simple": "Every cloud lets the compute running your code prove who it is without a stored secret. On Azure that's a managed identity on the container app or AKS pod. You grant it a narrow role, for example Foundry User for calling models, or Foundry Agent Consumer if it only calls an agent endpoint, and the SDK fetches short-lived Entra ID tokens. On AWS it's an IAM role attached to the task or pod, with a policy that allows `bedrock:InvokeModel` only on the specific model or inference profile ARNs. On Google Cloud it's a service account bound through Workload Identity.\n\nKeys are the weak spot. Microsoft's documentation is blunt that an API key grants full access with no role restrictions. So after moving to identity, you disable local key auth on the resource, and a leaked key becomes useless.\n\nThe same pattern runs everywhere else. CI pipelines like GitHub Actions use OIDC federation to get a short-lived cloud token, so there's no stored client secret. Third-party keys that can't be avoided go in Key Vault or Secrets Manager, read with the workload's identity. For example, an agent that updates tickets should call the ticketing API with the user's delegated token, not a shared admin key.",
      "points": [
        "Workload identity per service: Azure managed identity, AWS IAM role, GCP service account with Workload Identity.",
        "Least-privilege roles: on Azure Foundry User or Foundry Agent Consumer; on AWS scope to model or inference profile ARNs.",
        "Disable key auth once identity works; keys bypass RBAC entirely.",
        "CI/CD via OIDC federation - no long-lived cloud secrets in the pipeline.",
        "Unavoidable third-party secrets in Key Vault, Secrets Manager or Secret Manager, fetched at runtime.",
        "Tools act on behalf of the user where possible, not with one god-mode identity."
      ],
      "say": "No keys. Each service gets the platform's workload identity: a managed identity on Azure, an IAM role on the ECS task or EKS pod on AWS, and a service account through Workload Identity on Google. I grant it the narrowest role. On Foundry that's Foundry User to call models, or Foundry Agent Consumer if it only calls an agent endpoint. On AWS the policy allows InvokeModel only on the model or inference profile ARNs we've approved. Then I disable key authentication on the resource, because a key grants full access with no role checks at all, so one leaked key undoes everything. The pipeline gets the same treatment, with GitHub Actions using OIDC federation instead of a stored client secret. Any third-party key we can't avoid lives in Key Vault or Secrets Manager. For tools that act on business systems, I pass the user's delegated token so the agent can never do more than the person asking, which also makes the audit log meaningful.",
      "numbers": "Note the rename: Microsoft's Foundry roles Foundry User, Foundry Owner, Foundry Account Owner and Foundry Project Manager were previously Azure AI User, Azure AI Owner and so on. Microsoft recommends referencing roles by GUID in code during the rename.",
      "verified": "2026-10",
      "wrong": "\"We keep the API key in an environment variable, so it's safe.\" It's still a long-lived bearer secret with full access that ends up in CI logs, crash dumps and laptops. Identity plus disabled keys removes the whole class of leak.",
      "follow": "An agent needs to read a user's SharePoint files and update their tickets. Which identity does it use?",
      "followAnswer": "The user's, through delegation. The app gets the user's token at sign-in and exchanges it on-behalf-of for tokens scoped to SharePoint and the ticketing API. The agent can then only see and change what that person could, and the audit log shows the real user. The agent's own managed identity is only for things that belong to the service, like calling the model deployment or reading its own configuration. If one shared service account does everything, any successful prompt injection inherits all of that account's access.",
      "builds": [
        "riq-2305",
        "cd-03"
      ],
      "next": [
        "cd-18",
        "cd-24",
        "gr-13"
      ],
      "deeper": [
        "foundry-rbac",
        "owasp-llm"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A team gives their app a managed identity with the Foundry User role, but leaves key authentication enabled \"for emergencies\" and stores the key in Key Vault. What is the weakness?",
        "options": [
          "None - Key Vault makes the key safe.",
          "Foundry User is too narrow for calling models.",
          "Anyone who obtains the key gets full access with no role restrictions, so the RBAC design can be bypassed.",
          "Managed identities cannot call Foundry models."
        ],
        "answer": 2,
        "why": "Keys bypass role-based access entirely, so the least-privilege design only holds if key auth is disabled. Key Vault reduces exposure but the key still exists and works. Foundry User is the documented least-privilege role for developers and workloads."
      }
    },
    {
      "id": "cd-18",
      "q": "The security team says: no public endpoints and no public egress. How do you network a GenAI stack on Azure or AWS?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "cloud",
        "security",
        "deployment"
      ],
      "why": "Banks and PSUs in India ask this first. Engineers who have done it talk about DNS, dependent services and tools that still go public; those who haven't talk only about \"private endpoints\".",
      "quick": [
        "Private endpoint for the model resource; public network access disabled.",
        "Private DNS zones linked to the VNet, or the private endpoint is ignored.",
        "Search, storage, database and agent runtime need private access too.",
        "Egress through a firewall with an allowlist; web-grounding tools still go public.",
        "AWS: VPC interface endpoints for Bedrock; GCP: Private Service Connect."
      ],
      "simple": "Inbound, you put a private endpoint on the model resource, which gives it a private IP inside your VNet, and set public network access to disabled. The step people miss is DNS. The app still uses the normal hostname, and only a private DNS zone linked to the VNet makes that hostname resolve to the private IP. Without it, traffic tries the public endpoint and gets refused, or worse, succeeds because public access was left on.\n\nThen you repeat it for every dependency: the vector store, blob storage, the database holding agent threads, Key Vault and the container registry. On Foundry, network-isolated agents need the standard setup with your own Storage, AI Search and Cosmos DB, plus injection into a delegated subnet. Those private endpoints aren't created for you.\n\nOutbound, you route egress through a firewall that allows only the documented identity and monitoring endpoints. Check every tool too. In Microsoft's own table, Bing grounding, web search and SharePoint grounding still talk to public endpoints, so a \"no public egress\" client must block them with policy. On AWS the equivalent is VPC interface endpoints (PrivateLink) for the Bedrock runtime APIs and no NAT route. On Google it's Private Service Connect inside a VPC Service Controls perimeter.\n\nFor example, you prove it from a VM inside the VNet: `nslookup` returns a private IP, and the same call from a laptop is refused.",
      "points": [
        "Private endpoint plus public network access disabled on the model resource.",
        "Private DNS zones linked to the VNet; custom DNS must forward the privatelink zones.",
        "Every dependency private too: search, storage, agent state, Key Vault, registry, monitoring.",
        "Foundry agents: standard setup, BYO resources, subnet injection - which can't be added to an existing deployment later.",
        "Egress firewall allowlist; block tools that use public endpoints if the rule is strict.",
        "AWS: interface VPC endpoints with endpoint policies; GCP: Private Service Connect plus VPC Service Controls."
      ],
      "diagram": {
        "rows": [
          [
            {
              "id": "app",
              "label": "App in VNet",
              "note": "managed identity"
            }
          ],
          [
            {
              "id": "dns",
              "label": "Private DNS zone",
              "note": "hostname to private IP",
              "accent": "warn"
            },
            {
              "id": "fw",
              "label": "Egress firewall",
              "note": "allowlist only"
            }
          ],
          [
            {
              "id": "pe",
              "label": "Private endpoints",
              "note": "public access disabled",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "m",
              "label": "Model resource",
              "note": "Foundry or Bedrock"
            },
            {
              "id": "s",
              "label": "Search and storage",
              "note": "own private endpoints"
            },
            {
              "id": "t",
              "label": "Web-grounding tools",
              "note": "still public",
              "accent": "bad"
            }
          ]
        ],
        "edges": [
          {
            "from": "app",
            "to": "dns"
          },
          {
            "from": "dns",
            "to": "pe"
          },
          {
            "from": "app",
            "to": "fw"
          },
          {
            "from": "pe",
            "to": "m"
          },
          {
            "from": "pe",
            "to": "s"
          },
          {
            "from": "fw",
            "to": "t"
          }
        ],
        "alt": "Network path: the app in a VNet resolves through a private DNS zone to private endpoints for the model and for search and storage, while outbound traffic goes through an egress firewall, and web-grounding tools still reach public endpoints.",
        "caption": "**A private endpoint is only as good as its DNS.** Then make every dependency private and decide what the firewall lets out - some agent tools still go public."
      },
      "say": "Inbound, a private endpoint on the model resource with public network access disabled. Then DNS, which is where most setups break. The app keeps the normal hostname, and a private DNS zone linked to the VNet makes it resolve to the private IP. If the client runs their own DNS, it has to forward the privatelink zones. Next, every dependency gets the same treatment: the vector index, storage, the database holding agent state, Key Vault and the registry. On Foundry, isolated agents need the standard setup with our own resources and subnet injection, and that can't be retrofitted, so it's decided on day one. Outbound, egress goes through a firewall with an allowlist. Some tools, like web and Bing grounding, still call public endpoints, so for a strict client we block them with Azure Policy. On AWS it's interface VPC endpoints for the Bedrock runtime with endpoint policies and no NAT. I prove it from inside the VNet with nslookup and a refused call from outside.",
      "numbers": "Validation rule: from inside the VNet, `nslookup <endpoint>` must return a private address; from outside, the same request must fail. On Foundry, the agent subnet must be delegated to `Microsoft.App/environments` and be /27 or larger.",
      "verified": "2026-10",
      "wrong": "\"We added a private endpoint, so it's private.\" Without linked private DNS the app may still resolve the public address, public access may still be on, and the search index, storage and agent tools may all still be public.",
      "follow": "After going private, the AI Search index is empty and indexing shows no errors. Why?",
      "followAnswer": "Most likely the indexer runs in the multi-tenant environment, which can't traverse private endpoints, so it silently reads nothing. Microsoft's guidance is to set the indexer's execution environment to private when it has to reach data behind private endpoints, and some auto-generated indexers don't support that, so you may need to create the indexer yourself. I'd also check that the storage account has a private endpoint the search service can use, through a shared private link, and that the search service's managed identity has read access to the blobs.",
      "builds": [
        "cd-03",
        "cd-17"
      ],
      "next": [
        "cd-19",
        "sd-07",
        "cd-24"
      ],
      "deeper": [
        "azure-openai-privacy",
        "aws-genai-lens"
      ],
      "check": {
        "kind": "predict",
        "q": "You create a private endpoint for a Foundry resource but do not link a private DNS zone, and public network access is still enabled. What happens when the app in the VNet calls the endpoint hostname?",
        "options": [
          "It uses the private endpoint automatically.",
          "It resolves to the public address and the call succeeds over the public endpoint.",
          "It fails with a DNS error.",
          "It is refused, because private endpoints disable public access."
        ],
        "answer": 1,
        "why": "Without the private DNS zone, the hostname still resolves publicly, and because public access is on, the call quietly succeeds over the internet path. Creating a private endpoint does not disable public access; you must switch that off separately."
      }
    },
    {
      "id": "cd-19",
      "q": "The client says all prompts must be processed in India. Which Azure, AWS and Google regions and options actually achieve that?",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "privacy",
        "cloud",
        "india",
        "compliance"
      ],
      "why": "The India-specific residency question. It checks you know the Indian regions, which deployment options stay in-country, and that \"APAC\" or \"global\" options quietly leave India.",
      "quick": [
        "Azure: Central, South, West India, plus India South Central (Hyderabad).",
        "Azure Data Zone is APAC-wide; use Standard or Regional Provisioned in India.",
        "AWS: Mumbai and Hyderabad; India `in.` profiles stay within them.",
        "Google: Mumbai and Delhi; use regional endpoints, not global.",
        "Newest models reach in-country options last - check per model."
      ],
      "simple": "All three clouds have Indian regions. The catch is that the model call has its own processing setting, and the default is often wider than India.\n\nAzure has Central India (Pune), South India (Chennai), West India (Mumbai) and, since July 2026, India South Central (Hyderabad). Foundry deployment types decide processing. Global can process anywhere, and Data Zone stays inside a Microsoft-defined zone, which for Asia is APAC as a whole, not India. Only the geography-based Standard and Regional Provisioned types in an Indian region keep processing in India, and Microsoft says those types get new models last, with no guaranteed date.\n\nAWS has Mumbai (ap-south-1) and Hyderabad (ap-south-2). Bedrock's India geographic cross-Region inference profiles, with the `in.` prefix, route only between those two. AWS added India profiles for some recent Claude and OpenAI models in August and September 2026, while `global.` profiles can route worldwide.\n\nGoogle has Mumbai (asia-south1) and Delhi (asia-south2). Its residency page lists Mumbai for ML processing of certain Gemini models on the regional endpoint, and the global endpoint gives no residency guarantee.\n\nFor example, a lender might find its preferred model is only Global on Azure but has an `in.` profile on Bedrock. That fact, not benchmarks, can decide the cloud.",
      "points": [
        "Azure Indian regions: Central India, South India, West India, India South Central (Hyderabad, GA July 2026).",
        "Azure: Global = anywhere, Data Zone = APAC zone; in-India needs Standard or Regional Provisioned in an Indian region.",
        "AWS: ap-south-1 and ap-south-2; `in.` geographic inference profiles stay in India for listed models.",
        "Google: asia-south1 Mumbai listed for Gemini ML processing on regional endpoints; global endpoint has no guarantee.",
        "Pin storage, vector index, logs, traces and backups to India too; check abuse-monitoring retention terms.",
        "The requirement usually comes from sector regulators and contracts; the DPDP Act itself restricts transfers only to notified countries."
      ],
      "diagram": {
        "kind": "compare",
        "alt": "Comparison of Azure, AWS and Google for India: their Indian regions, the option that keeps processing in India, and the option that looks local but is not.",
        "caption": "**The region of the resource is not the region of the inference.** Pick the in-country option per model, and block the wider ones with policy.",
        "aspects": [
          "Indian regions",
          "Keeps processing in India",
          "Looks local but isn't"
        ],
        "columns": [
          {
            "label": "Azure",
            "note": "Foundry deployment types",
            "cells": [
              "Central, South, West India; India South Central",
              "Standard or Regional Provisioned in an Indian region",
              "Data Zone (APAC) and Global"
            ]
          },
          {
            "label": "AWS",
            "note": "Bedrock inference profiles",
            "cells": [
              "Mumbai, Hyderabad",
              "In-Region calls or `in.` profiles",
              "`global.` profiles"
            ]
          },
          {
            "label": "Google",
            "note": "Agent Platform endpoints",
            "cells": [
              "Mumbai, Delhi",
              "Mumbai regional endpoint, listed models",
              "Global endpoint"
            ]
          }
        ]
      },
      "say": "First I separate where the resource lives from where inference happens. On Azure there are four Indian regions now, Central, South and West India plus India South Central in Hyderabad since July 2026. But the deployment type decides processing. Global is anywhere, and Data Zone for this part of the world is APAC, not India. Only Standard or Regional Provisioned in an Indian region stays in-country, and those get new models last. On AWS it's Mumbai and Hyderabad, and Bedrock has India geographic inference profiles, the in-dot prefix, that route only between the two. AWS added those for some recent Claude and OpenAI models this year, while global profiles can go anywhere. On Google it's Mumbai and Delhi, with Mumbai listed for Gemini processing on the regional endpoint, and the global endpoint gives no guarantee. So I check per model which option exists, block the wider options with policy, and pin the index, logs and traces to India too. Often that availability decides the cloud.",
      "numbers": "Bedrock's India profiles are prefixed `in.` (for example `in.anthropic...`) and route only between ap-south-1 and ap-south-2; billing and quota are counted in the source Region.",
      "verified": "2026-10",
      "wrong": "\"Our Foundry resource is in Central India, so we're compliant.\" A Global or Data Zone deployment on that resource can process prompts outside India. The deployment type, not the resource region, decides it.",
      "follow": "The model the client wants has no in-India option on any cloud. What do you offer?",
      "followAnswer": "Three options, each with its trade-off written down. First, a model that does have an in-India option, compared on the client's own eval set, because the gap is often smaller than the brand difference suggests. Second, an open-weight model self-hosted in an Indian region or on-premises, which gives full control but adds GPU and operations cost. Third, a formally approved exception for specific data classes, for example allowing APAC processing for de-identified text while personal data stays local. The decision belongs to the client's risk and legal team, and my job is to make the options concrete with numbers.",
      "builds": [
        "cd-06",
        "gr-06"
      ],
      "next": [
        "cd-18",
        "ft-24",
        "gr-17"
      ],
      "deeper": [
        "azure-deployment-types",
        "dpdp-act"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which setup does NOT guarantee that prompts are processed in India?",
        "options": [
          "Azure Standard deployment in South India.",
          "Bedrock call using an `in.` geographic inference profile from Mumbai.",
          "Azure Data Zone Standard deployment on a resource in Central India.",
          "Azure Regional Provisioned deployment in Central India."
        ],
        "answer": 2,
        "why": "Data Zone keeps processing within Microsoft's data zone, and for this region that is APAC, which is wider than India. Standard and Regional Provisioned stay within the Azure geography, and Bedrock's `in.` profiles route only between Mumbai and Hyderabad."
      }
    },
    {
      "id": "cd-20",
      "q": "You launched on Azure OpenAI and get 429 errors while the usage graph shows you well under quota. Walk me through it.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "debugging",
        "cloud",
        "latency"
      ],
      "why": "cd-09 covers capacity planning. This is the debugging version: whether you know how rate limits are actually counted, which is not how usage is billed.",
      "quick": [
        "Rate limits count estimated tokens, including `max_tokens`, at arrival.",
        "Usage graphs show billed tokens of successful calls only.",
        "Request limits are enforced over 1 or 10 second windows.",
        "Read the 429 message: rate limit, capacity, or temporary adjustment.",
        "Fix: smaller `max_tokens`, smooth bursts, spread deployments, reserve baseline."
      ],
      "simple": "The usage graph and the rate limiter measure different things. The graph shows billed tokens from requests that succeeded. The limiter counts an estimate made when each request arrives, which is the prompt plus the full `max_tokens` you asked for, whatever the model actually generates. So a request with a 300-token answer but `max_tokens` set to 4,000 spends about 4,000 of your tokens-per-minute budget. Rejected requests count too, but never show as usage.\n\nRequests per minute aren't checked per minute either. They're checked over short windows, typically 1 or 10 seconds. At 600 requests per minute, more than 10 in any one second can return 429 even if the minute's total is fine. Bursty traffic, like a batch job or a 10am login spike, trips this.\n\nThere are also 429s that aren't your quota at all. On shared Standard deployments the service may briefly lower your effective limit when the pool is busy, and you can see it when the `x-ratelimit-limit-tokens` header is lower than what you configured.\n\nFor example, the fix list is: set `max_tokens` close to the real output, queue and pace requests, honour `retry-after-ms` with jitter, make sure only one layer retries, and reserve a provisioned baseline for steady load.",
      "points": [
        "TPM limit uses estimated tokens (prompt plus `max_tokens`) at arrival, not billed tokens.",
        "RPM is enforced in 1 to 10 second windows, so bursts trip it.",
        "Three kinds of 429: your rate limit, backend capacity, temporary limit adjustment - read the message and headers.",
        "Quota is per subscription, region, model and deployment type; check it is allocated to the deployment taking traffic.",
        "Retry once, in one layer: SDK default retries plus your own retry library multiply calls.",
        "Structural fixes: pacing queue, several deployments or regions (residency permitting), provisioned baseline, batch for offline work."
      ],
      "say": "I'd start by not trusting the usage graph, because it shows billed tokens from successful calls. The limiter counts an estimate at arrival that includes the full max_tokens. So if we set max_tokens to 4,000 and answers are 300, we're spending more than ten times our real usage against the limit. Rejected calls count too and never appear as usage. Second, requests per minute are enforced over 1 or 10 second windows, so a burst at 10am trips it even though the minute looks fine. Third, I read the 429 itself. It can be our rate limit, backend capacity, or a temporary reduction on the shared pool, which shows as x-ratelimit-limit-tokens lower than our configured value. Then the fixes. I right-size max_tokens, pace requests through a queue, honour retry-after-ms with jitter, and make sure the SDK and our code aren't both retrying. I also check quota is assigned to the deployment that takes the traffic. For steady load I'd put a provisioned baseline underneath.",
      "numbers": "For older chat models on Azure, one capacity unit is 1,000 TPM and 6 RPM; for several reasoning models it is 1,000 TPM and 1 RPM. A 600-RPM deployment checked per second throttles above 10 requests in any one second.",
      "verified": "2026-10",
      "wrong": "\"We're under quota, so it's an Azure bug - raise a ticket for more quota.\" The limiter counts `max_tokens` and bursts, and some 429s are capacity rather than quota. More quota won't fix oversized `max_tokens` or a burst pattern.",
      "follow": "Your code uses tenacity to retry 429s, and the team says retries are making it worse. Why?",
      "followAnswer": "Two likely reasons. The OpenAI Python SDK already retries 429s twice by default with backoff, so tenacity wrapping it turns one request into as many as three calls per attempt. Microsoft's guidance is to set max_retries to zero on the client if you add your own retry layer. And failed requests still count towards the per-minute limit, so retrying fast without jitter keeps the limiter saturated, and every client retries in step. I'd keep one retry layer, honour the retry-after-ms header, add jitter, cap attempts, and shed or queue load instead of hammering.",
      "builds": [
        "cd-09",
        "ops-06"
      ],
      "next": [
        "cd-21",
        "cl-25",
        "cd-19"
      ],
      "deeper": [
        "azure-quota",
        "azure-openai"
      ],
      "check": {
        "kind": "numbers",
        "q": "A deployment has 60,000 TPM. Each request sends about 1,000 prompt tokens with `max_tokens` set to 4,000, and real answers average 300 tokens. Roughly how many requests per minute fit before the TPM limiter throttles?",
        "options": [
          "About 46 per minute (60,000 / 1,300).",
          "About 12 per minute (60,000 / 5,000).",
          "About 60 per minute (one per 1,000 tokens).",
          "About 200 per minute (60,000 / 300)."
        ],
        "answer": 1,
        "why": "The limiter estimates prompt plus `max_tokens` at arrival - about 5,000 tokens a request - so 60,000 / 5,000 = 12. The 46 figure uses billed tokens, which is what the usage graph shows but not what the limiter counts."
      },
      "try": {
        "title": "Watch a per-second limiter reject a minute that looks fine",
        "minutes": 15,
        "steps": [
          "Copy the script, which simulates 500 requests in a minute against a 600-RPM limit enforced per second.",
          "Run it with smooth arrivals and note that nothing is rejected.",
          "Switch to bursty arrivals, where most requests land in the first ten seconds, and observe how many 429s you get while staying under 600 for the minute.",
          "Add a pacing queue that releases at most 10 requests per second, and observe the 429s disappear at the cost of extra waiting time."
        ],
        "code": "import random\nLIMIT_PER_SEC = 600 // 60   # 600 RPM checked per second\n\ndef simulate(arrivals):\n    rejected = 0\n    for sec in range(60):\n        n = sum(1 for t in arrivals if int(t) == sec)\n        rejected += max(0, n - LIMIT_PER_SEC)\n    return rejected\n\nsmooth = [random.uniform(0, 60) for _ in range(500)]\nbursty = [random.uniform(0, 10) for _ in range(400)] + \\\n         [random.uniform(10, 60) for _ in range(100)]\nprint(\"smooth 429s:\", simulate(smooth))\nprint(\"bursty 429s:\", simulate(bursty))\n\n# pacing: release at most LIMIT_PER_SEC per second, in arrival order\npaced, sec, used = [], 0, 0\nfor t in sorted(bursty):\n    sec = max(sec, int(t))\n    if used == LIMIT_PER_SEC:\n        sec, used = sec + 1, 0\n    paced.append(sec + 0.5); used += 1\nprint(\"paced 429s:\", simulate(paced), \"last sent at second\", int(max(paced)))"
      }
    },
    {
      "id": "cd-21",
      "q": "Would you put a model gateway in front of several providers? Compare Azure API Management's AI gateway, LiteLLM and building your own.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cloud",
        "api-design",
        "trade-offs"
      ],
      "why": "sd-28 asks you to design a gateway. This asks you to choose one and say what it must not do - the gateway is in every request's path.",
      "quick": [
        "Gateway: one place for auth, token limits, routing, failover and logging.",
        "APIM AI gateway suits Azure estates; LiteLLM suits multi-provider, self-hosted.",
        "Route provisioned capacity first, then pay-as-you-go, then a fallback provider.",
        "It sits in the hot path: latency, availability, streaming all matter.",
        "Logged prompts become a new sensitive data store - and a residency question."
      ],
      "simple": "A gateway sits between your apps and the model endpoints, so policy lives in one place instead of in every app. It authenticates callers, enforces token budgets per team, routes to the right backend, fails over when a backend throttles, and records token usage for chargeback.\n\nAzure API Management's AI gateway does this natively on Azure. A token-limit policy caps tokens per minute or a quota per consumer, token metrics can be emitted per app, and backend pools support priority and weighted routing with a circuit breaker that honours `Retry-After`. That lets you fill provisioned capacity first and spill to pay-as-you-go. LiteLLM's proxy is open source and self-hosted. It gives one OpenAI-compatible API over many providers, with virtual keys, budgets and fallbacks. Databricks, Cloudflare, Kong and others sell similar layers. Building your own makes sense only when you have needs none of them meet.\n\nThe risks are real. Every request now has another hop, the gateway can become your single point of failure, streaming has to pass through cleanly, and provider-specific features like prompt caching or reasoning settings don't always map through a common API. For example, a hosted SaaS gateway outside India can break an in-India residency promise even if every model is local.",
      "points": [
        "Jobs: identity, per-team token limits and budgets, routing, failover, usage metrics, central logging.",
        "APIM AI gateway: token-limit and token-metric policies, backend pools with priority and circuit breaker, semantic caching.",
        "LiteLLM proxy: OpenAI-compatible API across providers, virtual keys, budgets, fallbacks; you run it.",
        "Route provisioned first, pay-as-you-go second, another region or provider as fallback - within residency rules.",
        "Risks: added latency, single point of failure, streaming, lowest-common-denominator APIs, prompt logs as a PII store.",
        "Don't put semantic caching in front of personalised or permissioned answers."
      ],
      "diagram": {
        "rows": [
          [
            {
              "id": "a",
              "label": "Apps and agents",
              "note": "one key or identity each"
            }
          ],
          [
            {
              "id": "g",
              "label": "Gateway",
              "note": "auth, token limits, routing, logs",
              "accent": "accent"
            }
          ],
          [
            {
              "id": "p",
              "label": "Provisioned deployment",
              "note": "priority 1"
            },
            {
              "id": "s",
              "label": "Pay-as-you-go",
              "note": "priority 2, spillover"
            },
            {
              "id": "f",
              "label": "Fallback provider",
              "note": "only if residency allows",
              "accent": "warn"
            }
          ]
        ],
        "edges": [
          {
            "from": "a",
            "to": "g"
          },
          {
            "from": "g",
            "to": "p"
          },
          {
            "from": "g",
            "to": "s"
          },
          {
            "from": "g",
            "to": "f"
          }
        ],
        "alt": "Apps send requests to one gateway that enforces auth, token limits and logging, then routes to a provisioned deployment first, pay-as-you-go second and a fallback provider last.",
        "caption": "**Fill the reserved capacity first, spill over second, fail over last.** The gateway makes that one policy instead of code in every app."
      },
      "say": "Yes, once there's more than one team or more than one backend. Without it, every app reimplements keys, retries and logging differently. The gateway's jobs are identity, per-team token budgets, routing, failover and usage metrics for chargeback. On an Azure estate I'd use API Management's AI gateway. It has token-limit and token-metric policies, and backend pools with priority routing and a circuit breaker that honours Retry-After, so we fill provisioned capacity first and spill to pay-as-you-go. For multi-provider or self-hosted setups, the LiteLLM proxy gives one OpenAI-compatible API, virtual keys, budgets and fallbacks. I'd only build my own for a need neither meets. Then the cautions. It's in every request's path, so it needs redundancy and must pass streaming through cleanly. Provider-specific features, like prompt caching or reasoning settings, may not map through a common API. And logged prompts become a new sensitive store, which has to live in India if the models do.",
      "numbers": "Rule of thumb: the gateway should add single-digit to low tens of milliseconds - measure it under load. Compared with model latency of seconds it is noise, but a gateway that buffers whole streamed responses destroys time-to-first-token.",
      "verified": "2026-10",
      "wrong": "\"The gateway gives us provider independence, so we can switch models any time.\" It normalises the API, not the behaviour. Prompts, evals and features like caching and structured outputs still differ, so a switch still needs a full eval run.",
      "follow": "Your gateway fails over to a second region when the first throttles. What can go wrong?",
      "followAnswer": "Three things. Residency first: if the second region is outside the approved boundary, failover quietly breaks the promise, so the fallback list per data class has to be policy, not convenience. Second, the model in the other region may be a different version, so answers change during an incident and evals didn't cover it. I'd pin versions in both. Third, failover can amplify load. If every client retries into the second region at once, it throttles too. So I'd use a circuit breaker with backoff, cap the share of traffic that can fail over, and alert when failover is active.",
      "builds": [
        "sd-28",
        "cd-20"
      ],
      "next": [
        "cd-23",
        "ops-06",
        "cl-19"
      ],
      "deeper": [
        "apim-ai-gateway",
        "litellm"
      ],
      "check": {
        "kind": "which-fails",
        "q": "Which gateway feature is most likely to cause a data leak between users?",
        "options": [
          "Priority routing to a provisioned deployment first.",
          "Per-team token limits keyed on subscription keys.",
          "A semantic cache in front of answers that depend on each user's document permissions.",
          "Emitting token metrics per calling application."
        ],
        "answer": 2,
        "why": "A semantic cache returns a stored answer for a similar question, so user B can receive an answer built from documents only user A may see. Routing, token limits and metrics don't return one user's content to another."
      },
      "try": {
        "title": "Run a local gateway with a fallback",
        "minutes": 25,
        "steps": [
          "Install Ollama, pull two small models, and install the LiteLLM proxy with `pip install 'litellm[proxy]'`.",
          "Write a `config.yaml` with two entries under `model_list`, a primary and a backup, and a fallback from primary to backup in the router settings.",
          "Start the proxy and send requests with the OpenAI Python client pointed at the proxy's URL, and observe that your code never names Ollama.",
          "Stop the primary model, or point it at a wrong name, and observe the proxy answer from the backup.",
          "Time requests with and without the proxy and note how small the added latency is next to generation time."
        ]
      }
    },
    {
      "id": "cd-22",
      "q": "You want to run an open-weight model. Compare a managed endpoint on Bedrock, Foundry or Google with running vLLM yourself on Kubernetes.",
      "round": [
        "tech2",
        "manager"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "serving",
        "cloud",
        "open-weights",
        "trade-offs"
      ],
      "why": "cl-05 is self-host versus API and cl-23 is the TCO maths. This is the middle ground most enterprises actually pick - managed hosting of an open model - and what you give up at each step.",
      "quick": [
        "Three options: per-token serverless, managed dedicated endpoint, your own vLLM.",
        "Serverless per-token: cheapest to start, only for catalogue models.",
        "Managed dedicated: your weights or adapters, billed while instances run.",
        "Own vLLM on AKS, EKS or GKE: most control, all the operations.",
        "Decide on utilisation, control needed and who carries the pager."
      ],
      "simple": "There are three ways to run an open-weight model in the cloud.\n\nThe first is per-token serverless. Popular open models are offered as an API, through Foundry's serverless deployments, Bedrock's catalogue or Google's models-as-a-service. You pay per token with no GPUs to manage, but you only get the models and settings on the menu.\n\nThe second is a managed dedicated endpoint. Foundry managed compute, SageMaker endpoints, Bedrock Custom Model Import or deploying from Google's Model Garden run your choice of weights, including your fine-tune. You pay while instances run. Bedrock Custom Model Import, for example, bills per active model copy in 5-minute windows, so when it scales to zero you get cold starts.\n\nThe third is vLLM on your own Kubernetes GPU nodes. You control quantisation, batching, LoRA adapters, sampling and upgrades, and you own drivers, autoscaling, capacity, patching and on-call.\n\nThe deciding question is utilisation. GPUs cost the same whether they're busy or idle, so dedicated hosting only beats per-token pricing when traffic keeps them busy most of the day. For example, a 24x7 classification service at high volume fits your own vLLM, while an internal tool used in office hours fits per-token serverless.",
      "points": [
        "Per-token serverless: no GPU ops, limited to catalogue models and their settings.",
        "Managed dedicated endpoints: your weights or fine-tune, platform handles hosting; pay for running instances; watch cold starts.",
        "Own vLLM on Kubernetes: full control of quantisation, batching, adapters and versions; you run everything.",
        "Utilisation decides cost; idle dedicated GPUs are the usual budget surprise.",
        "Every option still needs region and residency checks, and a team that can operate it."
      ],
      "say": "I see three rungs. Per-token serverless, where the cloud offers a popular open model as an API, is cheapest to start and needs no GPUs, but I only get the catalogue models and settings. Managed dedicated endpoints, like Foundry managed compute, SageMaker, Bedrock Custom Model Import or a Model Garden deployment, run my own weights or fine-tune, and I pay while instances are up. Custom Model Import, for example, bills per active copy in 5-minute windows and can scale to zero, which means cold starts. The top rung is vLLM on our own AKS or EKS GPU nodes. I get full control over quantisation, batching, many LoRA adapters and exact versions, and we own drivers, autoscaling, capacity and on-call. Cost comes down to utilisation, because a GPU costs the same idle or busy. So for office-hours internal tools I go per-token. For steady 24x7 volume, or when I need multi-adapter serving, I go dedicated. I only take on the operations myself when there's a team to carry the pager.",
      "numbers": "Break-even arithmetic: dedicated cost per million tokens = GPU-hour price / (measured tokens per GPU-hour on your prompts / 1,000,000). Compare that with the per-token price at your real utilisation, not at 100%.",
      "verified": "2026-10",
      "wrong": "\"Self-hosting is cheaper because there's no per-token fee.\" Only at high, steady utilisation. Idle GPUs, an engineer's on-call time and capacity for peaks usually make it dearer for spiky enterprise traffic.",
      "follow": "Your managed endpoint scales to zero overnight and the first morning request takes a minute. What do you do?",
      "followAnswer": "First, decide whether that latency is acceptable for this workload. For a batch job it is. For a user-facing assistant it isn't. Then I'd either keep a minimum of one copy warm during business hours, scheduled rather than always-on to control cost, or send a synthetic warm-up request before the working day starts. I'd also make the image and weights load faster, using a smaller quantised model and weights cached close to the compute. The trade-off is explicit: a warm copy costs money every hour, and I'd show the client that number against the cold-start complaint.",
      "builds": [
        "cl-05",
        "llm-16"
      ],
      "next": [
        "cl-23",
        "cd-07",
        "ft-25"
      ],
      "deeper": [
        "vllm",
        "sagemaker"
      ],
      "check": {
        "kind": "judgement",
        "q": "An internal policy assistant is used 9am-6pm on weekdays at modest volume, using a popular open model with no fine-tuning. Which hosting fits best?",
        "options": [
          "vLLM on a dedicated GPU node pool, always on.",
          "Per-token serverless deployment of that model in an approved region.",
          "A managed dedicated endpoint with two always-on copies.",
          "On-premises GPUs bought for the project."
        ],
        "answer": 1,
        "why": "Low, office-hours traffic would leave dedicated GPUs idle most of the week. Per-token serverless charges only for use and needs no GPU operations. Dedicated or self-hosted options pay off with steady, high utilisation or custom weights."
      }
    },
    {
      "id": "cd-23",
      "q": "Three teams share one model deployment and finance asks who spent what. How do you set up cost governance for GenAI on the cloud?",
      "round": [
        "manager",
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "cost",
        "cloud",
        "llmops"
      ],
      "why": "Cloud bills group GenAI spend by resource, not by team or feature. The panel checks you can make cost attributable and stop surprises before month end.",
      "quick": [
        "Tag every resource: app, team, environment, owner, data class.",
        "A shared deployment hides who spent - attribute per call.",
        "Bedrock: application inference profiles with cost allocation tags.",
        "Azure: separate deployments or gateway token metrics per caller.",
        "Budgets, anomaly alerts and hard caps, reviewed with unit cost per task."
      ],
      "simple": "Cloud cost tools split spend by resource and tag. That works for VMs, but with GenAI, three teams calling one model deployment show up as one line. So governance has two layers.\n\nThe first is hygiene. Every resource gets mandatory tags, enforced by Azure Policy, AWS tag policies or Google labels, for app, team, environment and owner. Then budgets with alerts and anomaly detection, so a runaway agent loop gets noticed on day two, not on the invoice.\n\nThe second is per-call attribution. On Bedrock, you create an application inference profile per team, tag it with cost allocation tags, and each team calls the model through its own profile ARN. The tags then flow into Cost Explorer, though they must be activated, take up to a day to appear and aren't retroactive. On Azure, you either give each team its own deployment, or route through an API gateway that emits token counts per caller key, and you join that with prices for chargeback.\n\nFor example, the review that matters is unit economics: cost per resolved ticket or per processed document, by feature. A hard cap at the gateway per team key stops one experiment eating everyone's quota and budget.",
      "points": [
        "Mandatory tags enforced by policy; untagged resources fail deployment.",
        "Per-call attribution: Bedrock application inference profiles with tags; Azure per-team deployments or gateway token metrics.",
        "Budgets, anomaly alerts, and hard spend or token caps per key at the gateway.",
        "Separate dev and test with low quotas so experiments can't consume production capacity.",
        "Review provisioned-capacity utilisation; idle reservations are pure waste.",
        "Report unit cost per completed task per feature, not just the total."
      ],
      "say": "Tags alone don't solve it, because the cloud bills by resource and three teams on one deployment are one line. So I do two layers. First, hygiene. Every resource carries app, team, environment and owner tags, enforced by policy so untagged resources fail to deploy, plus budgets and anomaly alerts so a looping agent is caught in a day. Second, per-call attribution. On Bedrock I'd give each team an application inference profile with cost allocation tags and have them call through that ARN. The tags need activating in billing and aren't retroactive, so it's day-one setup. On Azure, either a deployment per team, or the gateway emitting token counts per caller key, joined with prices. I'd add hard caps per key at the gateway, and keep dev quotas low so experiments can't starve production. The monthly review is unit economics, meaning cost per resolved ticket per feature and utilisation of any provisioned capacity, because an idle reservation is money burnt.",
      "numbers": "Bedrock cost allocation tags can take up to 24 hours to appear in Cost Explorer after activation and are not applied retroactively - so set them up before launch, not after the first surprising invoice.",
      "verified": "2026-10",
      "wrong": "\"We'll split the bill by headcount.\" It hides which feature is expensive, removes any incentive to optimise, and the team running a 20-step agent gets subsidised by the team running a classifier.",
      "follow": "Spend doubled this month and traffic didn't. Where do you look first?",
      "followAnswer": "At tokens per request by feature, because volume didn't change, so either requests got bigger or more calls happen per task. Typical causes are a prompt change that added context or examples, retrieval returning more chunks, a model swap to a reasoning tier generating hidden reasoning tokens, prompt caching no longer hitting because someone put a timestamp at the top of the prompt, or an agent looping more steps. The per-feature attribution is what makes this a one-hour investigation instead of a week.",
      "builds": [
        "cl-01",
        "cd-21"
      ],
      "next": [
        "cl-07",
        "ops-04",
        "cd-24"
      ],
      "deeper": [
        "bedrock-app-profiles",
        "aws-genai-lens"
      ],
      "check": {
        "kind": "predict",
        "q": "A team activates cost allocation tags on their Bedrock application inference profiles on the 20th, after a surprising bill. What will Cost Explorer show for the 1st to the 19th?",
        "options": [
          "The spend split by the new tags.",
          "The spend untagged, because cost allocation tags are not retroactive.",
          "Nothing, because the earlier data is deleted.",
          "The spend split by IAM user automatically."
        ],
        "answer": 1,
        "why": "Cost allocation tags apply from activation onwards and take up to a day to appear; they don't relabel past spend. Attribution has to be designed before launch. Bedrock doesn't split on-demand spend by calling identity on its own."
      },
      "try": {
        "title": "Build a per-team chargeback from token logs",
        "minutes": 15,
        "steps": [
          "Create a small CSV of request logs with columns team, feature, input_tokens, output_tokens and outcome.",
          "Load it with pandas and apply placeholder input and output prices per million tokens, with output priced several times higher.",
          "Group by team and feature to get total cost and cost per successful outcome.",
          "Observe that the feature with the highest total is not always the one with the worst cost per outcome, and decide which number you would show finance."
        ]
      }
    },
    {
      "id": "cd-24",
      "q": "What goes into the Terraform for a GenAI stack, and what trips people up?",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "medium",
      "tags": [
        "deployment",
        "cloud",
        "llmops"
      ],
      "why": "cd-08 covers what Terraform is. This checks you have actually codified an AI stack - model deployments, quota, networking, roles - and hit its specific traps.",
      "quick": [
        "Codify model resource, deployments, networking, DNS, roles, search, storage, budgets.",
        "Quota isn't created by Terraform - apply fails without it.",
        "Pin model versions; don't let deployments auto-upgrade silently.",
        "Deleted resources can hold quota until purged.",
        "Use AzAPI for preview features; keep state remote and encrypted."
      ],
      "simple": "An AI stack is ordinary infrastructure plus a few unusual pieces. In Terraform you declare the Foundry or Azure OpenAI account and its projects, each model deployment with model name, version, deployment type and capacity, and the private endpoints and private DNS zones. You also declare role assignments for each managed identity, the search service and storage, Key Vault, diagnostic settings that send logs to your workspace, content filter policies, and budgets. On AWS the equivalent covers guardrails, knowledge bases, inference profiles, VPC endpoints and IAM roles.\n\nThe traps are AI-specific. Quota isn't a resource you can create, so `terraform apply` fails if the subscription has no capacity for that model and region. Request it first. Deployment version upgrades have a policy, and Terraform's default for `version_upgrade_option` lets the model change when a new default version arrives, so production answers can shift with no code change. Set it deliberately. A resource deleted outside the portal can hold its quota for 48 hours until purged, which breaks quick teardown-and-recreate loops. The AzureRM provider lags new Foundry features, so preview settings often need the AzAPI provider. And state can contain keys, so it lives in a remote, encrypted, access-controlled backend.\n\nFor example, a team whose staging rebuild failed at 2am on \"insufficient quota\" usually learns the purge rule that night.",
      "points": [
        "Declare: account and projects, model deployments, private endpoints and DNS, role assignments, search, storage, Key Vault, diagnostics, content filters, budgets.",
        "Quota is a prerequisite, not a resource; check capacity before apply.",
        "Set the version upgrade policy explicitly; changing it may force replacement.",
        "Purge soft-deleted accounts, or quota stays held for 48 hours.",
        "AzAPI for preview features; use role GUIDs where role names are being renamed.",
        "Remote encrypted state; no keys in outputs; detect drift from portal edits."
      ],
      "say": "I codify the whole stack: the Foundry account and projects, each model deployment with name, version, deployment type and capacity, private endpoints with their DNS zones, role assignments for every managed identity, search, storage, Key Vault, diagnostic settings, content filters and budgets. The traps are the AI-specific bits. Quota isn't something Terraform creates, so apply fails if there's no capacity for that model in that region. We request it ahead and check with the capacity API in the pipeline. The version upgrade option matters too. Terraform's default lets the deployment move to a new default model version, so answers can change with no commit, and I set it explicitly for production. Deleting an account programmatically holds its quota for 48 hours unless you purge it, which breaks quick rebuilds. New Foundry features often need the AzAPI provider before AzureRM catches up. I reference roles by GUID because of the recent renames. And state lives in a remote, encrypted backend, because it can contain keys.",
      "numbers": "Azure holds the quota of a resource deleted through the API for 48 hours until it is purged. Each Azure deployment's capacity is set in units of 1,000 TPM, so `capacity = 50` means 50,000 TPM.",
      "verified": "2026-10",
      "wrong": "\"Everything's in Terraform, so environments are identical.\" Not if the model versions auto-upgrade, quota differs by region, or someone changed a content filter in the portal. Pin versions, check quota and detect drift.",
      "follow": "A provider retires the model version your production deployment pins. How does your IaC and release process handle it?",
      "followAnswer": "I track retirement dates as data, in a small file in the repo or a scheduled job that reads the provider's retirement list, so there's a ticket months ahead. The pipeline then creates a parallel deployment of the replacement version in staging through Terraform, runs the full eval set against it and compares with the current version. If it passes, we switch the app to the new deployment name behind a flag, canary it, and remove the old deployment after a quiet period. I never rely on auto-upgrade in production, because then the retirement date picks the moment your behaviour changes.",
      "builds": [
        "cd-08",
        "cd-17"
      ],
      "next": [
        "cd-25",
        "llm-10",
        "cd-20"
      ],
      "deeper": [
        "terraform",
        "azure-foundry"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A production Terraform block for an Azure OpenAI deployment sets model name and version but leaves `version_upgrade_option` unset. What is the risk?",
        "options": [
          "None - an explicit version can never change.",
          "The deployment may move to a new default model version without any code change, shifting production behaviour.",
          "Terraform will refuse to apply without the option.",
          "The deployment will be deleted on the retirement date."
        ],
        "answer": 1,
        "why": "Terraform's default allows upgrading when a new default version is designated, so the pinned version can change underneath you. Set the option deliberately - for example no auto-upgrade, with a planned migration before retirement. Assuming the version field alone pins it is the trap."
      }
    },
    {
      "id": "cd-25",
      "q": "Walk me through the pipeline that ships a GenAI service from pull request to production on a cloud platform.",
      "round": [
        "tech2"
      ],
      "level": "5-10",
      "priority": "high",
      "tags": [
        "llmops",
        "deployment",
        "evaluation"
      ],
      "why": "cd-05 covers which artefacts a GenAI pipeline must version. This checks the pipeline mechanics - stages, identities, environments, gates and rollback - as you would draw them on a whiteboard.",
      "quick": [
        "PR: unit tests with a mocked model, prompt checks, small eval, IaC plan.",
        "Build once: container image, scanned and versioned with prompt and config.",
        "Deploy with OIDC identity; staging uses the same pinned model version.",
        "Gate on the full eval set, then canary with online metrics.",
        "Rollback = previous image, prompt version and model deployment together."
      ],
      "simple": "The pipeline looks like a normal service pipeline with two extra concerns: model behaviour and model versions.\n\nOn a pull request it runs unit tests with the model mocked, schema and prompt checks, a small smoke eval of 20 to 50 cases against a dev deployment, and a Terraform plan. On merge it builds one container image, scans it, and records the image digest, prompt version and model deployment name together as one release.\n\nDeployment to staging uses an OIDC-federated identity, so the pipeline holds no cloud secrets. Staging calls the same model version as production, otherwise the eval proves nothing. The full eval set runs there as the gate, and it fails the release if quality, cost or latency is worse than the current version by more than an agreed margin. Then a canary, such as 5 to 10 percent of traffic or one tenant, is watched on online signals like error rate, refusals, guardrail hits, latency and thumbs-down, before full rollout.\n\nRollback restores all three parts together: previous image, previous prompt and previous model deployment. For example, a scheduled job also re-runs the eval against the next model version well before the provider retires the current one, so retirement never forces an untested change.",
      "points": [
        "PR stage: unit tests with mocked model, prompt and schema checks, smoke eval, IaC plan.",
        "Build once; a release = image digest + prompt version + model deployment + index version.",
        "OIDC federation for pipeline identity; no stored cloud secrets.",
        "Staging pins the same model version; the full eval set is the gate with agreed margins.",
        "Canary on online signals, then full rollout; rollback restores all parts together.",
        "Separate eval quota so CI never consumes production TPM; scheduled evals ahead of model retirements."
      ],
      "diagram": {
        "kind": "lanes",
        "alt": "Pipeline stages from pull request checks through build, staging deploy, eval gate and canary to full rollout.",
        "caption": "**Build once, gate on evals, canary on real traffic.** A release is the image, the prompt and the model deployment together - so is the rollback.",
        "lanes": [
          {
            "label": "Pull request",
            "note": "unit tests, smoke eval, plan"
          },
          {
            "label": "Build",
            "note": "one image, scanned"
          },
          {
            "label": "Deploy to staging",
            "note": "OIDC, pinned model"
          },
          {
            "label": "Eval gate",
            "note": "full set vs current",
            "accent": "accent"
          },
          {
            "label": "Canary",
            "note": "5-10% or one tenant",
            "accent": "warn"
          },
          {
            "label": "Full rollout",
            "note": "rollback ready"
          }
        ]
      },
      "say": "On a pull request I run unit tests with the model mocked, prompt and schema checks, a small smoke eval of a few dozen cases against a dev deployment, and the Terraform plan. On merge I build one image, scan it, and record a release as the image digest, prompt version and model deployment name together. Deployment uses OIDC federation, so the pipeline has no stored secrets. Staging calls exactly the same model version as production, because otherwise the eval proves nothing. The full eval set is the gate, and it fails if quality, cost or latency is worse than the current release beyond an agreed margin. Then a canary to 5 to 10 percent or one tenant, watched on error rate, refusals, guardrail hits, latency and user feedback. Rollback restores the image, prompt and model deployment as one unit. Two GenAI-specific extras: CI uses its own quota so evals can't starve production, and a scheduled job evaluates the next model version months before the current one retires.",
      "numbers": "Rule of thumb: a smoke eval of 20-50 cases keeps PR feedback under about five minutes; the full gate set is usually a few hundred cases and runs once per release candidate, not on every commit.",
      "verified": "2026-10",
      "wrong": "\"Our CI runs the eval against the latest model in dev, and prod uses the pinned one.\" Then the gate tests a different model from the one you ship. Staging and production must use the same model version.",
      "follow": "The eval gate is flaky - the same build passes and fails on reruns. What do you change?",
      "followAnswer": "First I measure the noise. I run the current release five times on the gate set and look at the spread per metric, because the gate threshold has to be wider than that. Then I reduce variance where I can: temperature zero where the product allows it, a fixed judge model version with a pinned prompt, and more cases on the slices that swing. I compare paired results, current against candidate on the same items, rather than two absolute scores. If a metric still swings, I make it a warning rather than a blocker until it's stable, and I keep the hard gates on deterministic checks like schema validity.",
      "builds": [
        "cd-05",
        "ev-06"
      ],
      "next": [
        "ops-08",
        "llm-10",
        "ag-30"
      ],
      "deeper": [
        "gh-actions",
        "promptfoo"
      ],
      "check": {
        "kind": "spot-the-bug",
        "q": "A pipeline runs the full eval in staging against a deployment that auto-upgrades to the newest model version, while production pins last quarter's version. What is wrong?",
        "options": [
          "Nothing - testing on the newer model is stricter.",
          "The gate evaluates a different model from the one being shipped, so a pass says little about production.",
          "Staging should use a smaller model to save cost.",
          "The eval should only run after production deployment."
        ],
        "answer": 1,
        "why": "An eval gate is only meaningful if it tests what ships. With different model versions, prompts tuned and passed on one may behave differently on the other. Newer is not \"stricter\", just different."
      },
      "try": {
        "title": "Add an eval gate to a pull request with promptfoo",
        "minutes": 30,
        "steps": [
          "In a small repo, write a prompt and a `promptfooconfig.yaml` with ten test cases using simple assertions such as contains, is-json or a regex.",
          "Point the provider at a local Ollama model so the eval costs nothing, and run `npx promptfoo eval` locally until it passes.",
          "Add a GitHub Actions workflow that runs the same command on pull requests and fails the job when any assertion fails.",
          "Open a pull request that subtly breaks the prompt, for example dropping the JSON instruction, and observe the check go red with the failing cases listed."
        ]
      }
    }
  ]
};
