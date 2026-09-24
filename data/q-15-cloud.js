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
        "cloud",
        "docker",
        "kubernetes",
        "terraform",
        "deployment"
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
      "followAnswer": "I would not let the interactive path scale to zero. Keep a warm minimum sized for normal traffic, and scale on queue depth or requests in flight rather than CPU. Pre-pull images and cache weights on the nodes so a new pod is ready faster. For spikes beyond the warm pool, queue briefly, or fall back to a managed API or a smaller model, so the SLA holds while capacity catches up."
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
        "azure",
        "enterprise"
      ],
      "why": "A common enterprise platform question. The useful answer is identity, networking, governance and regional availability, not a feature list.",
      "quick": [
        "Same models, but inside your own company cloud account.",
        "Traffic stays off the public internet.",
        "Company sign-in and access roles replace a shared key.",
        "The deployment type decides which region handles prompts.",
        "Plan usage limits early, and check the model exists in your region."
      ],
      "simple": "Azure OpenAI gives you roughly the same OpenAI models, but in a very different operating environment, and that's why enterprises choose it. The resource lives in your own Azure subscription, so you get private endpoints that keep traffic off the public internet, Entra ID sign-in instead of a shared API key, role-based access control, and billing inside your existing setup. For example, for a bank, that list is exactly what gets the project past security.\n\nIn practice, you create a named deployment of a model and call it. Its deployment type decides where prompts are processed, from any Azure region for Global types down to your own geography for Regional ones. Content filtering is on by default.\n\nTwo things usually surprise teams. Quota is set per region and model, so you plan it early, and the model you want may not be in your region yet.",
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
      "wrong": "\"It's the same thing with a different URL.\" The follow-up - where is the data processed and how does the app authenticate - exposes that the enterprise deployment details are the experience being probed.",
      "follow": "The model you need is not in the required region. What do you do?",
      "followAnswer": "First I check whether a Data Zone deployment is acceptable - it often gets the model well before single-region types, and processing stays inside the US, EU or APAC zone. If policy demands one geography, I test the best model that is available there on our eval set; often it is good enough. Otherwise it is a formally approved exception or a dated wait. What I never do is quietly switch to Global."
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
        "architecture",
        "trade-off"
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
      "wrong": "Comparing them on benchmark scores. The models are largely shared or comparable; the differences that decide it are organisational and operational.",
      "follow": "Your company is on AWS but the best model for this is only on Azure. Argue it.",
      "followAnswer": "I would first check whether the gap is real on our own eval set, because the catalogues overlap a lot. If the Azure model clearly wins, the case is about the cost of a second cloud: a new security review, private networking between clouds, data leaving the AWS boundary, and another bill. If the quality gain is worth that, we call Azure through a private link for that one use case, behind our model interface."
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
        "cloud",
        "security",
        "networking",
        "compliance"
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
      "followAnswer": "In the retrieval service, from the verified token - never from the prompt or a client parameter. The app validates the user's sign-in token, resolves their groups or entitlements on the server, and the retrieval layer adds them as a mandatory filter on every vector and keyword search before any chunk comes back. So the model never sees a document the user cannot open, and the applied filter is logged with the request."
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
        "cloud",
        "cicd",
        "llmops",
        "deployment"
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
      "followAnswer": "It blocks the cutover. The new index is built next to the live one, so production keeps serving from the old index. The validation stage compares recall on the labelled retrieval set with the current production score and fails if it drops beyond the agreed tolerance. Then we diff what changed - chunking, embedding model, parser version - fix it and rebuild. Nothing was changed in place, so there is nothing to roll back."
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
        "security",
        "residency",
        "compliance"
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
      "wrong": "Saying the resource is in the local region and stopping. A Global deployment or a global inference profile can process the prompt elsewhere even when the resource itself sits in the right region.",
      "follow": "A managed model is not available in the required region. How do you compare another model, self-hosting, or a formally approved exception?",
      "followAnswer": "I compare them on the same evidence: quality on our golden set, cost, operational effort and residual compliance risk. First I check whether another managed model is available inside the boundary and whether it passes our eval, because that's usually the cheapest route. Self-hosting an open-weight model in-region keeps data local but adds GPUs, serving and on-call. A formally approved exception needs legal and risk sign-off, a documented data flow and an expiry date. I present all three with numbers, and never quietly switch routing."
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
        "quota",
        "capacity",
        "throughput"
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
      "say": "Pay-as-you-go bills per token on shared capacity, while provisioned throughput reserves capacity at a fixed price whether you use it or not. Pay-as-you-go comes with quotas in tokens and requests per minute. Exceed them and you get HTTP 429, too many requests, and latency varies because the hardware is shared. Provisioned, meaning PTUs on Azure, model units on Bedrock or GSUs on Google, buys steadier latency. Sizing starts from peak tokens per minute, with input and output counted separately, never the monthly total. That's how teams hit 429s in a morning burst while well under monthly volume. Steady, high volume favours provisioned, spiky or small volume pay-as-you-go. The usual mix is a provisioned baseline, pay-as-you-go for peaks, and batch APIs at about half price for anything that can wait. At the time of writing, Azure's minimum is 15 PTUs for Global and Data Zone. Quota increases aren't instant or guaranteed, so I request capacity per model, region and deployment type well before launch.",
      "numbers": "At the time of writing Azure's minimum provisioned deployment is 15 PTUs for Global and Data Zone types and more for Regional, and batch APIs on all three clouds are typically about 50% cheaper than real-time calls. Minimums and prices change - check the current pricing page.",
      "wrong": "\"We'll just request more quota if we hit the limit.\" Quota increases are neither instant nor guaranteed, and 429s at launch look like an outage to users. Capacity is planned from measured peak TPM before go-live.",
      "follow": "You get 429s at peak even though monthly volume is well under quota. Why?",
      "followAnswer": "Because quota is per minute, not per month. A burst - a batch job, a retry storm, everyone logging in at nine - can exceed tokens per minute while the monthly total looks small. Some platforms also count the requested max_tokens against the limit up front, so a very high max_tokens uses quota you never consume. I smooth bursts with a queue, set realistic max_tokens, and retry with backoff."
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
        "cloud",
        "deployment",
        "latency",
        "serving",
        "cost"
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
      "followAnswer": "I size it from the traffic history rather than the average. I look at the steady baseline and how fast spikes ramp compared with how long a replica takes to become ready, and keep enough warm replicas to absorb the spike that arrives within that cold-start window. Beyond that, I scale on queue depth or requests in flight, queue briefly, and overflow to a managed API or smaller model. Then I review cost against missed latency targets and adjust, with scheduled scaling for known peaks."
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
        "databricks",
        "data-platform"
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
      "followAnswer": "Usually both, with a clear split rather than one team owning everything. The data team owns ingestion, chunking, embedding jobs, the vector index and Unity Catalog permissions, because those sit next to the data and its governance. The application team owns the prompts, retrieval logic, model serving endpoint, evaluation set and user experience. The contract between them is the index, with a version, a schema and a retrieval quality target. What matters most is one named owner for end-to-end answer quality."
    }
  ]
};
