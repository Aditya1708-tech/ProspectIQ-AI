# ProspectIQ AI — Project Constitution
## The Governing Document for Every Engineer, Designer, and AI Contributor

**Project:** ProspectIQ AI (working name)
**Hackathon:** IDBI Innovate 2026
**Track:** Prospect Assist AI
**Document Type:** Internal Engineering & Product Constitution
**Authority:** This constitution is binding for all technical, product, AI, UX, and architectural decisions. It is subordinate only to the Product Requirements & Context Bible (PRCB), which remains the single source of truth for WHAT the product is and WHY. This document governs HOW it is built.
**Audience:** Every current and future engineer, designer, AI coding assistant, and contributor — written for a team that may eventually scale to 50+ people.

---

## 1. Vision

ProspectIQ AI will become the standard decision-support layer that sits between raw customer behavioural data and Relationship Manager action across IDBI Bank's retail and MSME lending operations. Five years from now, this platform should be recognizable as the system that changed how IDBI's RMs decide who to engage — not because it automated that decision, but because it made the human decision demonstrably better, faster, and more defensible.

This vision only survives if the engineering built underneath it is disciplined enough to still be maintainable, explainable, and trustworthy at scale. A brilliant hackathon demo that cannot survive contact with 50 engineers, real production data, and RBI scrutiny is not a fulfillment of this vision — it is a liability wearing its clothes.

---

## 2. Mission

This document exists because good intentions do not survive scale. A hackathon team of 3–5 people can hold product philosophy in their heads. A production engineering org of 50+ cannot. Without a written constitution, every new contributor — human or AI — will make locally reasonable decisions that are globally inconsistent: one engineer adds a chatbot feature because it seems helpful, another bypasses explainability because a model is "obviously accurate enough," a third hardcodes a secret because it's Friday afternoon. Individually reasonable. Collectively, they destroy the product defined in the PRCB.

This constitution's mission is to make the right decision the default decision — for every engineer and every AI assistant contributing to this codebase, at every stage of the project's life, without requiring a person in the room to explain the philosophy each time.

---

## 3. Product Philosophy

The PRCB defines what ProspectIQ AI is and is not. This section translates that product philosophy into engineering-facing principles that must survive every sprint, every pull request, and every AI-generated line of code.

| Principle | Meaning for Engineering |
|---|---|
| **AI assists — not replaces** | No code path may allow an AI-generated output to trigger a customer-facing action or a lending-relevant decision without a human approval step in between. This is enforced in code, not just in the UI copy. |
| **Behaviour over raw numbers** | Data models and feature engineering must be structured around behavioral patterns (trends, consistency, discipline) rather than single-point static values. A schema that only stores current balances instead of behavioral time-series is a philosophy violation, not just a design choice. |
| **Business value over flashy AI** | Every AI component must be traceable to a specific business objective in the PRCB (Section 13, 19, 21). "It's technically impressive" is not an acceptable justification for a feature. |
| **Deployment over demo** | Code must be written as if it will run in IDBI's production environment next quarter, not as if it exists to look good on a hackathon stage for ten minutes. Shortcuts that only work in a demo context (hardcoded happy paths, fake latency, unhandled edge cases) are technical debt from day one and must be labeled as such. |
| **Trust before automation** | Any feature that increases automation must first demonstrate it increases — or at minimum does not decrease — RM trust, as defined by the Explainability Strategy in the PRCB (Section 36). Automation that erodes trust is a regression even if it is technically correct. |

---

## 4. Core Principles

These are the eighteen operating principles of the engineering organization. Every architectural, product, or AI decision should be checkable against this list.

| # | Principle | Why It Exists | Engineering Impact |
|---|---|---|---|
| 1 | **Customer First** | The retail/MSME customer's experience and consent govern every data-use decision. | No feature ships that uses customer data outside its consented purpose (PRCB §37). |
| 2 | **Relationship Manager First** | RMs are the primary daily user; if they don't trust or use it, the product has zero value regardless of technical merit. | UX and API design prioritize RM workflow fit over technical elegance. |
| 3 | **Explainability** | Every recommendation must be defensible to a Branch Manager, compliance reviewer, or customer. | No model or ranking logic ships without an accompanying explanation-generation mechanism. |
| 4 | **Human Oversight** | RBI expectations and sound banking practice require a human to remain the final decision-maker. | Every actionable output requires an explicit human approval step in the data flow. |
| 5 | **Privacy by Design** | Behavioral and financial data is inherently sensitive. | Data minimization and purpose limitation are enforced at the schema and query level, not just in policy documents. |
| 6 | **Security by Design** | A banking-adjacent platform is a high-value target; security cannot be retrofitted. | Security requirements (Section 8) are part of the Definition of Done for every feature. |
| 7 | **Scalability** | The platform must serve IDBI's full RM workforce, not a hackathon demo audience. | Architecture avoids designs that only work at small scale (in-memory state, single-instance assumptions). |
| 8 | **Cloud Native** | Aligns with IDBI's stated architectural preference (PRCB §14, insight 14) and enables elastic scale. | Services are built stateless where possible, containerized, and configuration-driven. |
| 9 | **Developer Experience** | A 50+ engineer team cannot be productive in a codebase that fights them. | Consistent tooling, clear folder structure, and fast local setup are treated as product requirements, not nice-to-haves. |
| 10 | **Maintainability** | Code outlives its original author; this platform is meant to run in production for years. | Complexity must be justified; clever code that only the author understands is a defect. |
| 11 | **Modularity** | Alternative data sources and models will be added over time (PRCB §40); the system must absorb this without rearchitecture. | Features are built as independently deployable, loosely coupled modules. |
| 12 | **Reusability** | Duplicated logic is duplicated risk, especially around explainability and compliance rules. | Shared logic (explanation generation, behavioral scoring primitives) lives in shared, versioned components — never copy-pasted. |
| 13 | **Enterprise Quality** | This is being evaluated as a foundation for a production banking product, not a weekend project. | Code quality bar matches what would be expected in a Tier-1 bank's engineering org, regardless of hackathon time pressure. |
| 14 | **Observability** | You cannot audit, debug, or trust a system you cannot see inside. | Every service emits structured logs, metrics, and traces sufficient to reconstruct how any recommendation was produced. |
| 15 | **Accessibility** | Enterprise banking software must be usable by RMs across ability levels and devices. | UI components meet WCAG-aligned accessibility standards by default, not as a late-stage audit fix. |
| 16 | **Performance** | RMs operate under time pressure; a slow tool will be abandoned regardless of its intelligence. | Performance budgets are defined per user-facing interaction and treated as a release gate. |
| 17 | **Documentation First** | An undocumented decision is a decision that will be reversed by accident by the next contributor. | No architectural decision, API, or model change merges without accompanying documentation. |
| 18 | **Consistency Over Novelty** | 50+ contributors introducing 50+ personal styles produces an unmaintainable system. | Established patterns in this codebase are followed even when a contributor believes they have a "better way," unless that better way is proposed and accepted via the Decision Framework (Section 13). |

---

## 5. AI Constitution

AI is a core capability of this platform, not a decoration. Its governance is therefore stricter, not looser, than standard software components.

| Principle | Definition | Enforcement |
|---|---|---|
| **Human-in-the-loop** | No AI output is self-executing. Every AI-generated recommendation terminates in a human review step before any customer-facing or lending-relevant effect occurs. | Structurally enforced in workflow design — there must be no code path that skips the approval step, even for "high confidence" outputs. |
| **Explainability** | Every AI output must be paired with a plain-language rationale citing the specific contributing behavioral factors. | Models or techniques that cannot produce this pairing are disqualified from use, regardless of predictive performance (PRCB §34). |
| **Confidence Scores** | Every behavioral score or ranking is presented with an accompanying confidence indicator reflecting data completeness and signal strength. | RMs must never see a bare score without confidence context; UI and API contracts enforce this pairing. |
| **Bias Awareness** | AI outputs must be actively reviewed for proxies of protected characteristics (geography-as-proxy-for-caste/religion, name-based inference, etc.). | Bias review is a mandatory checklist item before any model or feature set change ships (see Section 12). |
| **Transparency** | Stakeholders (RMs, Branch Managers, compliance, judges) can always ask "why" and receive an answer grounded in real contributing data — never a generic or fabricated justification. | Explanation generation must be derived from actual feature contributions, never templated boilerplate disconnected from the underlying data. |
| **No Hallucinated Financial Advice** | The platform never generates free-form financial advice, guidance, or predictions not grounded in the customer's actual behavioral data. | Any generative AI component used for explanation text must be constrained (via structured prompts, retrieval grounding, or templated generation) to only describe verified data-derived facts. |
| **Prompt Governance** | If generative AI is used (e.g., for explanation phrasing), prompts are version-controlled, reviewed, and tested like code. | Prompts live in the repository, not in ad hoc scripts or hardcoded strings scattered through the codebase. |
| **Model Independence** | The platform's architecture must not be permanently coupled to any single model provider or model version. | Model invocation is abstracted behind an internal interface so the underlying model can be swapped without touching business logic. |
| **Future Model Replacement** | Models will improve or be replaced; the system must absorb this without breaking explainability or downstream contracts. | Model outputs conform to a stable internal schema regardless of which model produced them. |
| **AI Monitoring** | Model behaviour, output distribution, and explanation quality are monitored continuously, not just validated at launch. | Dashboards and alerting exist for score drift, explanation-generation failures, and anomalous override rates by RMs (a proxy for eroding trust). |

---

## 6. Engineering Constitution

| Topic | Standard |
|---|---|
| **Clean Architecture** | Business logic (behavioral scoring, explanation generation, prioritization rules) is isolated from frameworks, UI, and infrastructure concerns. Business rules must be testable without spinning up a web server or database. |
| **SOLID Principles** | Applied pragmatically — especially Single Responsibility and Dependency Inversion — to keep behavioral-scoring and explanation-generation components independently testable and replaceable. |
| **DRY** | Explainability logic, behavioral scoring primitives, and compliance rules are defined once and reused everywhere they apply. Duplication of compliance-relevant logic is treated as a security-severity defect. |
| **KISS** | The simplest solution that satisfies the PRCB's requirements is preferred. Complexity must be justified by a real, documented requirement — not anticipated future need. |
| **YAGNI** | Features and abstractions are not built ahead of confirmed need. Section 12's Feature Acceptance Framework is the gate against speculative build-out. |
| **Reusable Components** | UI components, scoring primitives, and explanation templates are built as shared, versioned libraries — not duplicated per feature. |
| **Dependency Injection** | External dependencies (data sources, model providers, notification systems) are injected, not hardcoded, to support testing and future model/provider replacement (Section 5). |
| **Modular Services** | Services are scoped around clear business capabilities (e.g., behavioral profiling, prioritization ranking, explanation generation) with well-defined boundaries and contracts. |
| **Code Reviews** | No code merges without at least one independent review. AI-generated code is held to the same review bar as human-written code — AI authorship is not a review exemption. |
| **Version Control** | All code, prompts, model configuration, and infrastructure-as-code live in version control. No production-relevant artifact exists only on someone's local machine. |
| **Documentation** | Every service, API, and non-obvious business rule has accompanying documentation, kept current as part of the Definition of Done (Section 11). |
| **Testing** | Unit tests cover business logic; integration tests cover service boundaries; explanation-generation logic has dedicated tests verifying output is grounded in actual input data. |
| **Logging** | Structured, queryable logs capture inputs, outputs, and decision points for every behavioral scoring and explanation-generation event, sufficient to reconstruct "why did the system say this" after the fact. |
| **Monitoring** | Service health, latency, error rates, and AI-specific metrics (Section 5) are monitored with alerting thresholds defined before launch, not after an incident. |
| **Error Handling** | Failures degrade gracefully — a missing alternative data source reduces confidence, it does not crash the profile generation pipeline (PRCB §30). Errors are never silently swallowed. |

---

## 7. UX Constitution

| Standard | Rationale |
|---|---|
| **Professional enterprise interface** | RMs and Branch Managers are working professionals under time pressure, not consumer app users; the interface should read as a trustworthy work tool. |
| **Minimal clicks** | Every additional click between an RM opening the platform and seeing an actionable, explained prospect list is a direct tax on adoption. |
| **Accessibility** | Enterprise software must be usable across ability levels and assistive technologies; this is a baseline requirement, not an enhancement. |
| **Responsive** | RMs work across desktop branch systems and, increasingly, mobile/tablet contexts; layouts must adapt without loss of critical information. |
| **Consistent navigation** | A 50+ engineer team building features over time must not fragment navigation patterns; consistency is enforced through shared UI components (Section 6). |
| **Minimal cognitive load** | Explanations and rankings must be scannable in seconds — RMs do not have time to decode a dense analytics dashboard between calls. |
| **Readable dashboards** | Aggregate views (for Branch Managers) prioritize clarity over density; more data visible is not automatically better if it obscures the signal that matters. |
| **Purposeful animation only** | Motion is used only to communicate state change or guide attention (e.g., a score updating) — never for decoration. |
| **No unnecessary visual effects** | Visual flourish that does not aid comprehension or trust is explicitly excluded, consistent with the "business value over flashy AI" philosophy (Section 3). |

---

## 8. Security Constitution

| Requirement | Standard |
|---|---|
| **Authentication** | All access is authenticated; no anonymous access to any behavioral or customer data exists at any layer. |
| **Authorization** | Role-based access control governs visibility: RMs see only their assigned prospects, Branch Managers see aggregate views, Administrators govern access (aligned with PRCB §38). |
| **Encryption** | Data is encrypted in transit and at rest, without exception, for all customer and behavioral data. |
| **Secrets Management** | Secrets (API keys, credentials, model provider keys) are stored in a dedicated secrets manager — never in code, config files, or version control. |
| **Audit Logs** | Every access to an individual customer's behavioral profile is logged with actor, timestamp, and purpose, supporting the auditability requirement in PRCB §38. |
| **Least Privilege** | Every service and role is granted the minimum access required for its function — no default broad access. |
| **Data Privacy** | Data use is scoped strictly to purposes consented to by the customer, consistent with PRCB §37. |
| **Secure APIs** | All APIs enforce authentication, authorization, input validation, and rate limiting by default — not as opt-in middleware. |
| **Input Validation** | All external and internal input is validated at the boundary; the system never trusts upstream data blindly. |
| **Rate Limiting** | APIs are protected against abuse and unintentional overload, particularly around data-ingestion endpoints for alternative data sources. |
| **OWASP Awareness** | Engineering practice follows OWASP Top 10 guidance as a baseline for web and API security hygiene. |
| **DPDP Considerations** | Data handling practices anticipate and align with India's Digital Personal Data Protection Act principles — consent, purpose limitation, and data minimization — even ahead of full regulatory mandate. |

---

## 9. Data Constitution

| Principle | Standard |
|---|---|
| **Accuracy** | Behavioral profiles must faithfully represent underlying source data; any transformation or aggregation logic must be documented and testable. |
| **Integrity** | Data pipelines must be designed to detect and flag corruption, duplication, or inconsistency rather than silently propagating it into a customer's behavioral profile. |
| **Ownership** | Every data source has a clearly documented owner and lineage, from raw ingestion through to its use in a behavioral score. |
| **Retention** | Data retention periods align with the purpose for which data was consented, and with IDBI's and regulatory retention requirements — data is not kept indefinitely by default. |
| **Synthetic Demo Data** | For hackathon and early development purposes, only synthetic or properly anonymized data is used. Production customer data must never appear in a development, demo, or hackathon environment (see Section 16). |
| **Future Production Integration** | Data pipelines are designed from the outset to be swappable from synthetic sources to real, governed IDBI production data sources without architectural rework. |
| **Alternative Data Usage** | Alternative data sources (UPI, GST, EPFO, electricity, fuel, turnover, multi-account activity) are used strictly as defined in PRCB §39 — as behavioral signal, never as a replacement for the Bank's formal underwriting data. |
| **Responsible AI** | Data used to train or configure any model is reviewed for representativeness and bias risk before use, consistent with Section 5's bias-awareness principle. |

---

## 10. Architecture Constitution

| Rule | Rationale |
|---|---|
| **Loose Coupling** | Services communicate through well-defined contracts, not shared internal state, so components (especially models and data sources) can evolve independently. |
| **High Cohesion** | Each service owns a single, clearly bounded business capability (e.g., behavioral profiling is not mixed with prioritization ranking logic). |
| **Layer Separation** | Presentation, business logic, and data access are kept in distinct layers; UI code never contains business rules, and business logic never contains presentation concerns. |
| **Future Microservice Readiness** | The system is built with clear service boundaries from the start so it can be decomposed into microservices as scale demands, without requiring this to be true on day one. |
| **API-First** | Every capability is designed as an API contract first, before implementation, ensuring services remain integrable with IDBI's existing CRM and core banking ecosystem (PRCB §40). |
| **Event Readiness** | Where appropriate, state changes (new data ingested, profile updated, recommendation generated) are designed to be event-emittable, supporting future asynchronous and integration use cases. |
| **Cloud Readiness** | Services are built to run in a cloud-native environment: stateless where possible, configuration externalized, no reliance on local disk state. |
| **Docker Readiness** | Every service is containerizable and runnable in isolation for local development, testing, and cloud deployment consistency. |

---

## 11. Development Constitution

| Area | Standard |
|---|---|
| **Branching** | Feature branches off a protected main branch; no direct commits to main. Branch names reflect the feature or fix scope clearly. |
| **Naming Conventions** | Consistent, descriptive naming across code, APIs, and data models — no abbreviations that aren't broadly understood by the team. |
| **Folder Structure Philosophy** | Structure reflects business capability boundaries (behavioral profiling, prioritization, explanation generation) rather than technical layer alone, so a new contributor can navigate by business concept. |
| **Pull Requests** | Every change is submitted via pull request with a clear description of what changed and why, linked to the relevant requirement or issue. |
| **Commits** | Commits are atomic and descriptive; commit messages explain intent, not just the mechanical change. |
| **Definition of Done** | A feature is "done" only when it is implemented, tested, documented, reviewed, and passes the Feature Acceptance Framework (Section 12) — not merely when it compiles. |
| **Issue Tracking** | All work is tracked through issues linked to PRCB objectives, ensuring every engineering effort traces back to a documented business need. |
| **Documentation Updates** | Any change that affects behavior, contracts, or architecture requires a corresponding documentation update in the same pull request — documentation debt is not deferred. |

---

## 12. Feature Acceptance Framework

No feature — regardless of who proposes it, including an AI assistant generating suggestions — is added to the product without passing this checklist:

1. **Does it solve a real IDBI problem** documented in the PRCB's Pain Points (§6) or Business Goals (§19)?
2. **Does it improve measurable business value** — conversion, RM time saved, NPA reduction — rather than being technically interesting in isolation?
3. **Can a judge, RM, or Branch Manager understand it quickly**, without a lengthy technical explanation?
4. **Can it realistically be deployed** inside IDBI's ecosystem within a reasonable technical and regulatory timeframe?
5. **Does it support explainability**, or does it introduce a decision point that cannot be explained?
6. **Does it improve RM productivity or trust**, rather than adding noise, complexity, or a new manual burden?
7. **Does it preserve human oversight**, with no path to autonomous customer-facing action?

**If a feature fails any one of these questions, it is rejected or sent back for redesign.** This framework exists specifically to prevent the feature creep the PRCB explicitly warns against (PRCB, opening role definition: "Never invent unnecessary features").

---

## 13. Decision Framework

When an architectural, product, or AI-design decision is ambiguous or contested, it is resolved in this order:

1. **Check the PRCB.** If the PRCB already answers the question (scope, objectives, constraints, principles), that answer is final and this constitution does not override it.
2. **Check this Constitution.** If the PRCB is silent but this document addresses the principle at stake, follow it.
3. **Apply the Feature Acceptance Framework (Section 12)** if the decision concerns whether to build something at all.
4. **Apply the Core Principles (Section 4)** as a tiebreaker when multiple valid technical approaches exist — prefer the option that scores better on explainability, maintainability, and RM trust over the option that scores better on technical novelty.
5. **Escalate and document.** If none of the above resolves the decision, it is escalated to the engineering leadership function, and the resolution — along with its rationale — is added to this constitution so the same ambiguity never has to be re-litigated.

No individual contributor, including an AI coding assistant, has authority to make a decision that contradicts the PRCB or this constitution without going through this escalation path.

---

## 14. Success Definition

Success for ProspectIQ AI is deliberately defined beyond the hackathon outcome:

- **Winning the hackathon** is a milestone, not the definition of success.
- **Maintainable software** — a codebase a new engineer can understand and safely extend within their first week.
- **Production-ready architecture** — a system that could, with reasonable and well-scoped additional work, actually be deployed inside IDBI Bank's ecosystem.
- **Business value** — measurable movement on the KPIs defined in PRCB §43 (conversion uplift, RM time saved, thin-file surfacing rate).
- **Scalability** — a system that does not need to be rebuilt to serve IDBI's full RM workforce, only extended.
- **Developer experience** — an engineering environment that a 50+ person team can be productive in, not one that only its original hackathon authors can operate.

A technically impressive demo that fails any of these dimensions is not, by this constitution's definition, a successful outcome.

---

## 15. Non-Negotiables

These rules have no exceptions, regardless of deadline pressure, hackathon judging incentives, or individual contributor preference:

- **Never bypass explainability.** No scoring, ranking, or recommendation ships without a grounded, human-readable rationale.
- **Never hardcode secrets.** All credentials live in a secrets manager, without exception.
- **Never mix UI with business logic.** Presentation code never contains scoring rules, prioritization logic, or compliance decisions.
- **Never remove human approval.** No code path allows an AI output to trigger a customer-facing or lending-relevant action autonomously.
- **Never duplicate business rules.** Compliance-relevant and scoring logic is defined once, in one place, and referenced everywhere it is needed.
- **Never add AI where deterministic logic is sufficient.** If a rule-based system can solve the problem transparently, it is preferred over a model — consistent with "business value over flashy AI" (Section 3).
- **Never use real production customer data outside a governed production environment.** Development, demo, and hackathon contexts use synthetic or anonymized data only.
- **Never ship a feature that fails the Feature Acceptance Framework (Section 12).**

---

## 16. Out of Scope

Consistent with the PRCB (§23), the following are explicitly and permanently excluded from this project's engineering scope unless the PRCB itself is formally revised:

- Loan approval automation or any modification to IDBI's existing credit approval authority.
- Replacement of or integration that bypasses IDBI's Core Banking System.
- A generic, open-ended AI chatbot.
- Financial investment advice or any generative financial guidance not grounded in the customer's actual behavioral data.
- Use of real production customer data in development, demo, or hackathon environments.
- Any feature that allows an AI-generated output to act without human approval.

---

## 17. Living Constitution

This constitution is a governance artifact, not a static document. It evolves under the following rules:

- **Change Trigger:** A change to this constitution may only be proposed in response to a real, documented need surfaced through the Decision Framework (Section 13) — not as a speculative improvement.
- **Non-Contradiction Check:** No amendment to this constitution may contradict the PRCB. If a proposed change would require contradicting the PRCB, the PRCB must be formally revised first, and this constitution updated afterward to remain consistent.
- **Versioning:** Every substantive change to this document is versioned, dated, and accompanied by a rationale, so the engineering team can always see not just what changed, but why.
- **Governance:** Amendments are reviewed by engineering leadership before merging, with the same rigor as a pull request against production code — this document is treated as a first-class artifact of the codebase, not a static PDF written once and forgotten.
- **Onboarding Role:** Every new contributor — human or AI — is expected to read this constitution before their first commit. Violations discovered in review are treated as defects, not preferences.

---

*End of Document — ProspectIQ AI Project Constitution*
