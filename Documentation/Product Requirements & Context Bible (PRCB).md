# Prospect Assist AI
## Product Requirements & Context Bible
### IDBI Innovate 2026 — Track: Prospect Assist AI

**Document Type:** Foundational Product Context Document
**Document Status:** Master Reference — Single Source of Truth
**Prepared For:** IDBI Bank, Hackathon Judges, Product & Engineering Teams
**Scope:** WHAT is being built and WHY. (Architecture, API, database, UI, and deployment design are intentionally excluded and will be produced as separate downstream documents.)

---

## 1. Executive Summary

Prospect Assist AI is an Explainable Behavioral Credit Intelligence Platform designed to help IDBI Bank's Relationship Managers identify high-quality loan prospects, understand customer financial behaviour, and improve lead conversion — without replacing human judgment at any stage.

The platform does not calculate loan eligibility, does not act as a generic chatbot, and does not attempt to replicate or bypass IDBI's existing credit scoring infrastructure. Instead, it builds a **Behavioral Financial DNA** for each prospect using both traditional financial signals and alternative data sources (UPI transaction patterns, electricity payment discipline, GST filings, fuel spending, business turnover trends, EPFO contributions, and multi-account activity). This behavioral profile is translated into a transparent, explainable prioritization signal that helps Relationship Managers spend their limited time on the prospects most likely to convert into successful, responsible borrowers.

Every output the system produces is accompanied by a human-readable explanation of the contributing factors. No recommendation is auto-actioned. A Relationship Manager or Loan Officer must review and approve every material decision the system influences. This human-in-the-loop design is not a compliance afterthought — it is a core product principle that shapes every subsequent section of this document.

The product is intended to be cloud-native, deployable within IDBI Bank's existing technology ecosystem, and built around a philosophy that behavioral understanding — not automation for its own sake — is the primary source of business value. This document is the authoritative context reference from which all future technical artifacts (architecture, API design, database schema, UI specifications, test plans, and deployment plans) should be derived.

---

## 2. Hackathon Overview

**Event:** IDBI Innovate 2026
**Track:** Prospect Assist AI
**Sponsoring Institution:** IDBI Bank

The track was framed around a specific and deliberately narrow institutional pain point: Relationship Managers within IDBI Bank's retail and MSME lending operations spend a disproportionate share of their time engaging with loan prospects who are, in hindsight, unlikely to convert or unlikely to repay responsibly. The Bank does not lack data on these prospects — it lacks a structured, explainable way of turning that data into prioritization intelligence that a human can trust and act on.

During the official problem statement explainer session (AMA), IDBI Bank representatives repeatedly emphasized that the track was not a credit scoring exercise and not an automation exercise. It was explicitly framed as a **behavioral intelligence and decision-support exercise**. Participants were instructed to prioritize business impact and explainability over algorithmic sophistication, and to avoid building anything that resembles a black-box eligibility calculator.

This document treats every insight from that AMA as a binding design constraint rather than a suggestion, because deviation from these constraints would misalign the product from the actual institutional need the track was created to solve.

---

## 3. Banking Industry Context

Indian retail and MSME lending has undergone a structural shift over the past decade. Three forces are relevant to this product:

**3.1 The rise of alternative data.** UPI transaction history, GST filings, EPFO contributions, and utility payment records have become widely available, machine-readable signals of financial behaviour — particularly for thin-file customers (individuals and small businesses with limited traditional credit history). Fintech lenders have used these signals aggressively; traditional banks, including IDBI, have been comparatively slow to operationalize them at the point of prospect engagement.

**3.2 Regulatory pressure toward explainability.** The Reserve Bank of India has progressively tightened expectations around fair lending practices, algorithmic accountability, and customer-facing explainability of credit-related decisions. Any AI system that touches lending workflows — even indirectly, as a prioritization aid — must be built with explainability and auditability as first-class requirements, not retrofitted features.

**3.3 The economics of Relationship Manager time.** RM time is one of the most expensive and constrained resources in a branch-led banking model. Every hour an RM spends pursuing a low-quality lead is an hour not spent on a prospect who would have converted. Industry-wide, lead conversion rates for unprioritized outbound RM engagement are low, and the cost of this inefficiency compounds across thousands of RMs operating across branch networks.

Prospect Assist AI is positioned at the intersection of these three forces: it operationalizes alternative data, it is built explainability-first to satisfy regulatory expectations, and it directly targets the economic inefficiency of undirected RM effort.

---

## 4. Current IDBI Problem Landscape

IDBI Bank's Relationship Managers currently work from prospect lists that are generated primarily through branch walk-ins, referral networks, campaign-driven leads, and broad demographic or transactional segment filters (e.g., salary account holders above a certain balance threshold). These lists carry limited signal about which prospects are actually likely to want, qualify for, and successfully repay a loan product.

The consequence is a lead funnel where RMs must manually qualify prospects through direct outreach — phone calls, branch visits, and relationship conversations — before any meaningful financial engagement occurs. This manual qualification process is the single largest source of wasted effort in the current prospect-to-borrower pipeline.

At the same time, IDBI Bank already possesses substantial behavioral data on many of its existing customers (transaction history, account activity, utility and bill payment patterns visible through banking relationships) that is not currently synthesized into any form of prospect-prioritization intelligence. This data sits in operational systems but is not translated into decision support at the point where RMs choose who to contact.

---

## 5. Existing Business Process

The current prospect-to-loan business process, as understood from the AMA and problem statement, follows this general shape:

| Stage | Description | Owner |
|---|---|---|
| Lead Generation | Prospects identified via campaigns, referrals, walk-ins, or broad segment filters | Marketing / Branch |
| Lead Assignment | Leads distributed to RMs, often without prioritization | Branch Manager |
| Manual Qualification | RM contacts prospect, gathers informal financial context | Relationship Manager |
| Application Initiation | Prospect agrees to proceed; formal application begins | Relationship Manager / Loan Officer |
| Credit Assessment | Formal underwriting using existing credit scoring systems | Loan Officer / Credit Team |
| Approval Decision | Sanctioning based on credit policy | Branch Manager / Credit Committee |
| Disbursement | Loan disbursed | Operations |

Prospect Assist AI is designed to intervene specifically at the **Lead Assignment** and **Manual Qualification** stages. It does not touch Credit Assessment, Approval, or Disbursement, and it does not replace or duplicate the Bank's existing underwriting systems.

---

## 6. Pain Points

1. RMs cannot distinguish high-intent, high-capacity prospects from low-quality leads until after significant manual effort has already been spent.
2. Existing lead lists rank prospects by demographic or balance criteria, not by behavioral indicators of repayment discipline or genuine borrowing intent.
3. Valuable alternative data (UPI activity, GST filings, utility payment history) already available to the Bank is not synthesized into any usable prioritization signal.
4. RMs have no structured way to explain to a Branch Manager or to a prospect why a particular lead was prioritized or deprioritized, which undermines trust in any prioritization tooling that has been informally attempted.
5. Existing credit scoring tools operate too late in the funnel — at formal underwriting — to help RMs decide who to approach in the first place.
6. There is no mechanism to distinguish disciplined, needs-based spending from erratic or luxury-driven spending when assessing a prospect's likely financial behaviour.
7. High-potential thin-file customers (limited traditional credit history but strong alternative-data signals) are systematically under-prioritized because current processes lean on traditional financial data alone.

---

## 7. Why Existing Solutions Fail

**Generic credit scoring engines fail** because they are built for the underwriting stage, not the prospecting stage. They require a formal application and structured financial disclosures before they can produce output, which means they cannot help an RM decide who to call in the first place.

**Generic AI chatbots fail** because they address customer-facing query resolution, not RM-facing decision support. A chatbot does not help an RM understand why one prospect is more promising than another.

**Black-box propensity models fail** in a banking context because RMs, Branch Managers, and compliance stakeholders cannot act on — or defend — a recommendation they cannot explain. Even a highly accurate model is operationally useless if it cannot be trusted and justified in a customer-facing or audit-facing conversation.

**Pure automation approaches fail** because they attempt to remove the human from decisions that regulatory expectations and sound banking practice require to remain human-owned. Automation that oversteps this boundary creates compliance risk without a corresponding increase in business value.

Prospect Assist AI is deliberately designed to avoid each of these four failure modes.

---

## 8. Opportunity Analysis

The opportunity is not to build a smarter credit model — it is to build a **trustworthy decision-support layer** that sits before formal underwriting and gives RMs a defensible, explainable reason to prioritize their time. This is a distinctly different and currently unaddressed opportunity within IDBI's lending funnel.

The specific opportunity components are:

- **Underused data becomes usable.** Alternative data sources already accessible to the Bank can be synthesized into behavioral indicators without requiring new data collection infrastructure.
- **RM time becomes an optimized resource.** Even a modest improvement in lead prioritization accuracy compounds significantly across a large RM workforce.
- **Explainability becomes a differentiator, not a constraint.** Most competing fintech propensity models are not built explainability-first; a transparent system is both more trustworthy and more compliant.
- **Thin-file customers become visible.** Behavioral scoring surfaces creditworthy prospects who would be missed by traditional balance- or income-threshold segmentation.

---

## 9. Product Vision

Prospect Assist AI exists to give every Relationship Manager at IDBI Bank a clear, explainable, and trustworthy answer to the question: *"Of the prospects available to me, who should I spend my time on today, and why?"*

The platform's long-term vision is to become the standard decision-support layer that sits between raw customer data and RM action across IDBI's retail and MSME lending operations — not by automating decisions, but by making the human decision-maker measurably better informed.

---

## 10. Product Mission

To convert IDBI Bank's existing behavioral and alternative data into transparent, explainable prospect intelligence that Relationship Managers can trust, act on, and defend — improving lead conversion and reducing wasted outreach effort while keeping human judgment at the center of every lending decision.

---

## 11. Product Philosophy

The product is built on five non-negotiable philosophical commitments:

1. **Behaviour over raw numbers.** A prospect's financial behaviour — consistency, discipline, and intent — is treated as more predictive and more actionable than any single static financial figure.
2. **Explainability is a feature, not a report.** Every score, ranking, or recommendation is generated alongside a human-readable rationale, by design, not as a bolt-on interpretability layer.
3. **The AI assists; it never decides.** The system produces recommendations and context. A human always makes the final call. This is enforced structurally, not just procedurally.
4. **Innovation is measured by adoption and trust, not novelty.** A feature that RMs do not trust or use has zero business value regardless of its technical sophistication.
5. **Alternative data is an equalizer.** Behavioral and alternative data sources are actively used to surface creditworthy prospects who would otherwise be invisible to traditional segmentation.

---

## 12. Success Criteria

The product will be considered successful if it demonstrably:

- Improves the proportion of RM-initiated contacts that convert into completed loan applications.
- Reduces the average time RMs spend qualifying leads that ultimately do not convert.
- Produces explanations that RMs, Branch Managers, and compliance reviewers independently judge to be clear and trustworthy.
- Surfaces creditworthy thin-file prospects that would not have been prioritized under existing segmentation methods.
- Operates without requiring any change to IDBI's existing credit underwriting or approval systems.
- Maintains a fully auditable trail from behavioral input data to every recommendation surfaced to an RM.

---

## 13. Product Objectives

| # | Objective | Type |
|---|---|---|
| 1 | Generate a Behavioral Financial DNA profile for each eligible prospect | Core |
| 2 | Rank and prioritize prospects for RM outreach based on behavioral signal | Core |
| 3 | Provide a plain-language explanation for every prioritization output | Core |
| 4 | Distinguish disciplined/needs-based spending from erratic/luxury spending | Core |
| 5 | Incorporate alternative data sources (UPI, electricity, GST, fuel, turnover, EPFO, multi-account activity) | Core |
| 6 | Preserve mandatory human review and approval at every actionable step | Core |
| 7 | Provide Branch Managers with aggregate visibility into RM prioritization outcomes | Secondary |
| 8 | Support future cross-sell opportunity identification | Future |

---

## 14. Stakeholder Analysis

| Stakeholder | Interest | Influence |
|---|---|---|
| Relationship Managers | Primary daily users; need trustworthy, actionable prioritization | High |
| Loan Officers | Consume prospect context to accelerate qualification | Medium |
| Branch Managers | Need aggregate visibility and confidence in fairness/compliance | High |
| Retail Customers | Indirect beneficiaries of more relevant, timely engagement | Medium |
| Operations Team | Concerned with system reliability and data integrity | Medium |
| Bank Administrators | Own governance, access control, and compliance oversight | High |
| RBI / Compliance Function | Require explainability, fairness, and auditability | High (external) |
| Hackathon Judges | Evaluate business viability, innovation, and explainability | High (event-scoped) |

---

## 15. User Personas

**15.1 Relationship Manager — "Priya"**
Manages a portfolio of 150–300 prospects and existing customers across retail and MSME segments. Time-constrained, target-driven, and skeptical of tools that produce recommendations she cannot explain to a customer or a superior. Needs fast, trustworthy prioritization and clear rationale she can repeat in conversation.

**15.2 Loan Officer — "Rajesh"**
Engages with prospects after RM qualification, focused on moving qualified leads efficiently into formal underwriting. Benefits from behavioral context that speeds up the qualification conversation but does not directly consume the prioritization ranking.

**15.3 Branch Manager — "Sunita"**
Oversees a team of RMs and is accountable for branch-level conversion and portfolio quality. Needs aggregate, explainable visibility into how prioritization is influencing RM behaviour and outcomes, and needs confidence that the tool does not introduce discriminatory or non-compliant patterns.

**15.4 Retail/MSME Customer — "Anil"**
An existing or prospective bank customer whose behavioural data (with appropriate consent and governance) informs the platform. Experiences the product indirectly through more relevant, better-timed RM engagement rather than through irrelevant or poorly-targeted outreach.

**15.5 Bank Administrator — "Compliance Team"**
Responsible for system governance, access provisioning, and ensuring the platform operates within RBI and internal policy boundaries. Needs full auditability of data usage and recommendation logic.

---

## 16. User Journey

At a platform level, the journey moves from raw behavioral data ingestion, through profile synthesis, to explainable prioritization output, to human-reviewed action, and finally to outcome feedback that can inform future refinement. Sections 17 and 18 detail the two most important role-specific journeys.

---

## 17. Relationship Manager Journey

1. **Start of day:** RM opens the platform and sees a prioritized, explainable list of prospects assigned to them.
2. **Review:** For each high-priority prospect, the RM sees a Behavioral Financial DNA summary and a plain-language rationale (e.g., consistent disposable income, disciplined bill payment history, stable UPI transaction patterns).
3. **Decision:** The RM decides, using their own judgment informed by the explanation, whether and how to engage the prospect. The system never auto-contacts a prospect.
4. **Engagement:** The RM uses the behavioral context to have a more informed, relevant conversation with the prospect.
5. **Outcome logging:** The RM records the outcome of the engagement (converted, declined, follow-up needed), which becomes part of the feedback data used to refine future prioritization.
6. **Escalation:** If the RM disagrees with a system recommendation, they can override it — overrides are logged, not blocked, preserving the human-in-the-loop principle.

---

## 18. Customer Journey

1. A customer's existing relationship with IDBI Bank generates behavioral data (transactions, bill payments, account activity) under existing consent and data-use agreements.
2. The customer is identified by the platform as a well-suited candidate for a relevant loan product based on their behavioral profile, not solely on static demographic or balance criteria.
3. The customer receives more relevant, better-timed outreach from an RM, informed by genuine understanding of their financial behaviour rather than generic campaign targeting.
4. If the customer proceeds, they enter the Bank's standard, unchanged application and underwriting process — the platform's involvement ends at the point of qualified engagement.
5. The customer experiences no new data collection burden; the platform uses data already available to the Bank through existing customer relationships and consented data sources.

---

## 19. Business Goals

- Increase the conversion rate of RM-initiated prospect outreach.
- Reduce RM time and effort spent on low-quality leads.
- Improve the Bank's understanding of customer financial behaviour at scale.
- Improve repayment prediction quality feeding into (not replacing) downstream credit decisions.
- Contribute to a measurable reduction in Non-Performing Assets over time through better-qualified lending relationships.
- Increase identification of cross-selling opportunities across the existing customer base.
- Improve overall customer experience through more relevant and timely engagement.
- Support explainable, defensible lending-adjacent decisions in line with regulatory expectations.

---

## 20. Technical Goals

- Build a cloud-native platform architecture suitable for deployment within IDBI Bank's existing technology ecosystem.
- Ensure every behavioral score or ranking is traceable back to its contributing data signals.
- Design for extensibility, allowing new alternative data sources to be incorporated without re-architecting the core platform.
- Ensure the platform can operate as a decision-support layer without requiring changes to existing core banking, credit scoring, or underwriting systems.
- Maintain strict separation between the platform's advisory outputs and any system of record for actual credit decisions.

(Note: Detailed architecture, API, and database design are intentionally out of scope for this document and will be defined separately.)

---

## 21. AI Goals

- Model customer financial **behaviour**, not just static financial position.
- Distinguish needs-based, disciplined spending from discretionary or luxury spending patterns.
- Estimate disposable income and repayment capacity using behavioral and alternative data signals.
- Estimate genuine borrowing **intent**, not just theoretical eligibility.
- Produce every output with an accompanying, human-readable explanation of contributing factors.
- Avoid any modeling approach that cannot be made explainable to a non-technical RM or a compliance reviewer.

---

## 22. Functional Scope

The platform is in scope to:

- Ingest and process behavioral and alternative data signals (UPI transaction patterns, electricity payment history, GST filings, fuel spending, business turnover trends, EPFO contributions, multi-bank-account activity, and existing core banking transaction data).
- Generate a Behavioral Financial DNA profile per eligible customer/prospect.
- Generate an explainable prioritization ranking of prospects for RM outreach.
- Present plain-language rationale alongside every score or ranking.
- Allow RMs to view, act on, or override recommendations, with overrides logged.
- Provide Branch Managers with aggregate, explainable visibility into prioritization outcomes and RM engagement patterns.
- Maintain an auditable log connecting data inputs to generated outputs.

---

## 23. Out of Scope

- Final loan eligibility determination or credit approval.
- Replacement of or modification to IDBI's existing credit scoring or underwriting systems.
- Automated or unsupervised customer contact or offer issuance.
- Loan disbursement, servicing, or collections functionality.
- Any decision that removes a human approver from the workflow.
- New primary data collection infrastructure (the platform is designed to work with data sources already accessible to the Bank under existing consent frameworks).
- Software architecture, API design, database design, UI design, testing strategy, and deployment planning (covered in separate downstream documents).

---

## 24. Business Constraints

- The platform must operate as an assistive layer and must not disrupt or replace existing RM workflows and tools wholesale; adoption depends on the platform fitting into existing processes with minimal friction.
- The platform must demonstrate clear, measurable business value (conversion improvement, time savings) to justify continued investment beyond the hackathon stage.
- The solution must be positioned as deployable within a realistic institutional timeframe and budget, not as a theoretical research prototype.

---

## 25. Regulatory Constraints

- All behavioral data usage must operate within RBI guidelines on fair lending practices and customer data usage/consent.
- The system must not produce or imply any recommendation that could constitute discriminatory treatment based on protected characteristics.
- Every recommendation must be explainable in terms that satisfy audit and regulatory review, consistent with RBI's expectations around algorithmic accountability in financial services.
- Human approval must remain mandatory at every stage where the platform's output could influence a customer-facing decision.
- Data usage must respect existing customer consent frameworks; no data source may be used in a manner inconsistent with the terms under which it was originally collected.

---

## 26. Technical Constraints

- The platform must be deployable within IDBI Bank's existing cloud-native technology ecosystem.
- The platform must integrate with, rather than duplicate, existing core banking and CRM data sources.
- All AI-driven outputs must be generated using approaches that support explainability (e.g., interpretable models or models paired with rigorous explanation-generation methods); purely black-box approaches without an explanation layer are not acceptable.
- The system must be designed to operate reliably at the scale of IDBI's RM workforce and customer base.

---

## 27. Product Assumptions

- IDBI Bank has legal and consented access to the alternative data sources referenced in this document (UPI, electricity, GST, fuel, turnover, EPFO, multi-account data) for the customers/prospects in scope.
- RMs will engage with the platform voluntarily and will trust it more as explanation quality and prioritization accuracy improve over time.
- Existing credit scoring and underwriting systems will remain the final authority on loan approval; this platform's role is strictly upstream of that authority.
- Alternative data signals, where available, meaningfully improve the assessment of thin-file or under-served customer segments relative to traditional data alone.

---

## 28. Risk Analysis

Risks are grouped into business risks (Section 29) and technical risks (Section 30). Both categories are treated as first-class product concerns because either category, if unmanaged, would undermine the platform's core value proposition of trustworthy, explainable decision support.

---

## 29. Business Risks

| Risk | Impact | Mitigation Direction |
|---|---|---|
| RMs distrust or ignore recommendations | Platform delivers no business value despite technical success | Explanation quality and override-logging built in from day one |
| Perceived or actual bias in prioritization | Regulatory and reputational exposure | Explainability-first design; ongoing fairness review |
| Over-reliance on the tool erodes RM judgment | Reduced quality of human decision-making over time | Design explicitly frames output as advisory, not directive |
| Low adoption due to workflow friction | Investment fails to produce measurable ROI | Platform designed to integrate into, not replace, existing RM workflow |

---

## 30. Technical Risks

| Risk | Impact | Mitigation Direction |
|---|---|---|
| Alternative data sources are incomplete or inconsistent per customer | Degraded profile quality for some segments | Behavioral DNA design must gracefully handle partial data |
| Explanation generation lags behind model complexity | Loss of core explainability principle | Model choice constrained to explainable-by-design approaches |
| Data integration complexity with legacy core banking systems | Delayed or costly deployment | Platform designed as an advisory layer with minimal integration footprint |
| Scale limitations under full RM workforce load | Poor performance undermines daily usability | Cloud-native architecture planned for horizontal scalability (detailed separately) |

---

## 31. Product Differentiators

1. **Behavioral, not eligibility-based.** The platform assesses behaviour and intent, not just whether a prospect theoretically qualifies for a loan.
2. **Explainability is structural, not cosmetic.** Every output carries a rationale by design, not as an add-on report.
3. **Positioned upstream of underwriting.** Unlike credit scoring tools, this platform helps RMs decide who to engage before any formal application exists.
4. **Alternative-data-native.** Built from the ground up to incorporate UPI, GST, EPFO, and utility data as first-class signals, not afterthoughts.
5. **Human authority preserved by design**, not merely by policy — no workflow path allows the system to act without human approval.

---

## 32. Competitive Positioning

Compared to generic fintech credit-scoring APIs, Prospect Assist AI is not a scoring engine and does not compete on model accuracy alone — it competes on trustworthiness and integration into the RM's actual daily decision process. Compared to internal CRM lead-scoring add-ons often built by banks in-house, this platform differentiates through its explicit behavioral-DNA framing and explainability-first architecture, rather than opaque propensity scores bolted onto existing CRM tools. Compared to generic AI chatbot deployments seen elsewhere in the retail banking hackathon space, this platform is RM-facing decision support, not customer-facing conversational automation — a fundamentally different and, per the AMA, more valued category of solution for this track.

---

## 33. Innovation Strategy

Innovation in this product is deliberately defined as **behavioral synthesis and explainability**, not algorithmic novelty. The innovative core of the platform is the Behavioral Financial DNA construct — a structured, explainable synthesis of disparate alternative and traditional data sources into a single, interpretable profile that has not previously existed in IDBI's prospect engagement process. The strategy explicitly avoids innovation-for-its-own-sake features (novel UI gimmicks, unnecessary automation, chatbot novelty) that do not directly serve the RM's core decision-support need, consistent with the explicit AMA guidance that business impact outweighs flashy AI.

---

## 34. AI Principles

1. **Explainable by design.** Every model or scoring approach used must support clear, traceable explanation generation; approaches that cannot be explained are not used, regardless of predictive performance.
2. **Assistive, never authoritative.** AI output is framed and delivered as a recommendation with supporting evidence, never as a decision.
3. **Behaviorally grounded.** Model inputs prioritize behavioral and pattern-based signals over static point-in-time financial figures.
4. **Fairness-aware.** Model design and data usage are reviewed to avoid proxies for protected characteristics.
5. **Auditable.** Every input-to-output pathway must be traceable for compliance and internal review purposes.

---

## 35. Human-in-the-loop Strategy

Human-in-the-loop is enforced at three structural points, not merely encouraged as a best practice:

1. **Recommendation, not action.** The platform surfaces prioritized prospects and explanations; it never initiates customer contact or issues offers directly.
2. **Mandatory review interface.** Every recommendation an RM acts on requires explicit RM engagement with the underlying explanation, not a one-click blind action.
3. **Override logging, not override blocking.** RMs are free to disagree with and override any recommendation. Overrides are logged as valuable feedback data, reinforcing that the human retains ultimate authority while the system continues to learn from real-world outcomes.

---

## 36. Explainability Strategy

Every score, ranking, or flag produced by the platform is accompanied by a plain-language explanation composed of the specific contributing behavioral factors (for example: consistent UPI transaction volume over six months, on-time electricity bill payments, stable GST filing cadence, disposable income trend). Explanations avoid technical model terminology and are written to be directly usable by an RM in conversation with a Branch Manager, a compliance reviewer, or the prospect themselves. Explainability is treated as a core deliverable of the AI system, evaluated with the same rigor as predictive quality.

---

## 37. Privacy Principles

- Only data sources to which IDBI Bank already has legitimate, consented access are used.
- Behavioral data is used strictly for prospect prioritization and RM decision support — not for any secondary purpose outside this product's defined scope.
- Customer-level behavioral profiles are accessible only to authorized roles (RMs for their assigned prospects, Branch Managers for aggregate views, Administrators for governance).
- Data minimization is applied: the platform uses the minimum data necessary to generate a reliable, explainable behavioral profile.

---

## 38. Security Principles

- Role-based access control governs who can view individual behavioral profiles versus aggregate data.
- All behavioral and financial data is treated as sensitive and handled under IDBI Bank's existing data security and classification standards.
- Every access to a customer's behavioral profile is logged for audit purposes.
- The platform's advisory outputs are kept logically separate from systems of record for actual credit and account decisions, limiting the blast radius of any potential platform-level incident.

---

## 39. Data Strategy

The platform's data strategy rests on synthesizing two categories of signal:

**Traditional data:** existing core banking relationship data, account balances and activity, and existing credit history where available.

**Alternative data (explicitly encouraged per the AMA):** UPI transaction patterns, electricity bill payment history, GST filings, fuel spending patterns, business turnover trends, EPFO contribution history, and activity across multiple bank accounts held by the same customer where visible to the Bank.

These signals are synthesized into the Behavioral Financial DNA profile, which emphasizes behavioral consistency and pattern recognition (e.g., payment discipline over time, spending category composition, income stability) over static point-in-time figures. The strategy explicitly avoids over-reliance on any single data source, since alternative data availability will vary by customer, and the platform must remain useful even with partial data coverage.

---

## 40. Future Integrations

- Integration with IDBI's CRM and campaign management systems to route prioritized prospects directly into existing RM workflow tools.
- Integration with cross-sell recommendation logic to extend the Behavioral Financial DNA concept beyond lending into broader product relevance (e.g., savings products, insurance, investment products).
- Integration with post-disbursement repayment outcome data to create a feedback loop that continuously refines behavioral profiling accuracy over time.
- Potential integration with customer-facing channels (with appropriate governance) to make relevant, timely offers more transparent to customers themselves.

---

## 41. Future Vision

Over time, Prospect Assist AI is envisioned to evolve from a lending-prospect prioritization tool into a broader **Behavioral Relationship Intelligence Platform** for IDBI Bank — one that helps the Bank understand and serve its customers' evolving financial needs across products, not just at the point of loan prospecting. The explainability-first, human-in-the-loop foundation established in this initial scope is intended to remain the permanent architectural and philosophical backbone of that broader vision, ensuring that as capability expands, trust and compliance are never compromised for growth.

---

## 42. Success Metrics

- Increase in RM outreach-to-conversion ratio for prioritized prospects versus historical baseline.
- Reduction in average RM time spent per non-converting lead.
- RM-reported trust and usefulness ratings for generated explanations.
- Proportion of thin-file prospects surfaced by the platform that would not have been identified under prior segmentation methods.
- Compliance/audit review outcomes confirming explainability and fairness standards are met.

---

## 43. Key Performance Indicators

| KPI | Definition |
|---|---|
| Lead Conversion Uplift | % increase in prospect-to-application conversion among AI-prioritized leads vs. baseline |
| RM Time Saved | Average reduction in qualification time per RM per week |
| Explanation Trust Score | RM-rated clarity/trustworthiness of generated explanations (survey-based) |
| Thin-File Surfacing Rate | Number of creditworthy thin-file prospects identified per period |
| Override Rate | % of recommendations RMs choose to override (tracked as a health signal, not a failure metric) |
| Audit Compliance Rate | % of reviewed recommendations that pass explainability/fairness audit |

---

## 44. Project Terminology

| Term | Definition |
|---|---|
| Behavioral Financial DNA | The synthesized, explainable behavioral profile generated for a customer/prospect from traditional and alternative data |
| Prospect | An individual or business identified as a candidate for RM engagement regarding a potential loan product |
| Alternative Data | Non-traditional financial signals such as UPI activity, GST filings, EPFO contributions, and utility payment history |
| Human-in-the-loop | A design principle requiring mandatory human review/approval before any recommendation results in action |
| Explainability | The system's capacity to produce a clear, human-readable rationale for every output it generates |
| Override | An RM's decision to disregard a system recommendation, which is logged rather than blocked |

---

## 45. Glossary

- **RM** — Relationship Manager
- **NPA** — Non-Performing Asset
- **MSME** — Micro, Small, and Medium Enterprises
- **UPI** — Unified Payments Interface
- **GST** — Goods and Services Tax
- **EPFO** — Employees' Provident Fund Organisation
- **RBI** — Reserve Bank of India
- **AMA** — Ask Me Anything (the official IDBI problem statement explainer session)
- **Thin-file customer** — A customer with limited traditional credit history, for whom alternative data is especially valuable

---

## 46. References

- IDBI Innovate 2026 official problem statement — Track: Prospect Assist AI
- IDBI Bank AMA / problem statement explainer session insights (summarized in Section 3 of this document)
- General regulatory context: RBI guidelines on fair lending practices and algorithmic accountability in financial services (referenced contextually; formal compliance mapping to be conducted with IDBI's compliance function in a production setting)

---

## 47. Document Governance

**Owner:** Product team for Prospect Assist AI (hackathon submission team)
**Status:** Foundational — Single Source of Truth for all downstream documentation
**Change Control:** Any change to product scope, philosophy, or core principles defined in this document must be reflected here first, before any dependent document (architecture, API design, database design, UI design, test plan, deployment plan) is created or modified.
**Downstream Documents Expected:** Software Requirements Specification, System Architecture Document, API Design Document, Database Design Document, UI/UX Design Specification, Test Strategy, Deployment Plan.
**Non-Contradiction Principle:** No downstream document may introduce a feature, workflow, or capability that contradicts the scope boundaries, human-in-the-loop requirements, or explainability principles established in this document.

---

*End of Document — Prospect Assist AI Product Requirements & Context Bible*
