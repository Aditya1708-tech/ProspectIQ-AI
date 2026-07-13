# ProspectIQ AI
## Software Requirements Specification (SRS)

**Project:** ProspectIQ AI (working name)
**Hackathon:** IDBI Innovate 2026 — Track: Prospect Assist AI
**Document Standard:** Structured in alignment with IEEE 29148 practices for enterprise software requirements
**Governing Documents:** Product Requirements & Context Bible (PRCB), Project Constitution
**Status:** Draft for Engineering Implementation

> **Important note on source material:** This SRS was requested to be derived from three documents — the PRCB, the Project Constitution, and a "Product Backlog & Feature Blueprint." Only the PRCB and Constitution are available as verified source material in this conversation; no Product Backlog & Feature Blueprint document has been provided or generated. Per the instruction to label assumptions clearly rather than invent unreferenced material, every functional area in this SRS has been derived directly from the PRCB's Functional Scope (§22), Product Objectives (§13), and Future Integrations (§40), and is explicitly flagged **[ASSUMED FROM PRCB]** where it extends beyond an item explicitly named in the PRCB text. No feature exists in this SRS that contradicts PRCB Section 23 (Out of Scope) or the Constitution's Section 16 (Out of Scope) and Section 15 (Non-Negotiables). If a true Product Backlog & Feature Blueprint document exists separately, this SRS should be reconciled against it before implementation begins.

---

## 1. Document Control

### 1.1 Version History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | 2026-07-08 | Requirements Engineering Team | Initial draft SRS derived from PRCB and Constitution |

### 1.2 Authors

Principal Business Analyst, Senior Product Manager, Principal Software Architect, Enterprise Solution Architect, Lead AI Systems Engineer, Banking Technology Consultant, Requirements Engineering Specialist, QA Lead, Technical Documentation Lead (functioning as a combined requirements engineering team for this document).

### 1.3 Reviewers

To be assigned: Engineering Leadership, Product Owner, Compliance/RBI advisory reviewer, QA Lead.

### 1.4 Approval Status

**Draft — Not yet approved.** This document requires formal sign-off from Product and Engineering leadership before implementation begins, per Constitution §11 (Definition of Done) and §13 (Decision Framework).

### 1.5 Revision Log

| Version | Change Summary |
|---|---|
| 0.1 | Initial creation |

---

## 2. Introduction

### 2.1 Purpose

This SRS defines the functional, non-functional, AI-specific, and business-rule requirements for ProspectIQ AI, the Explainable AI Relationship Intelligence Platform defined in the PRCB. It is the formal engineering contract between Product, Engineering, QA, and AI teams for the scope defined herein, and is intended to be sufficiently detailed that engineers can begin implementation without further clarification of *what* to build (the PRCB governs *why*, the Constitution governs *how*, and this document governs *what, precisely*).

### 2.2 Scope

This SRS covers the MVP scope of ProspectIQ AI as defined in PRCB §22 (Functional Scope): behavioral data ingestion, Behavioral Financial DNA generation, explainable prospect prioritization, RM workflow tooling, Branch Manager aggregate visibility, and audit logging. It explicitly excludes loan approval automation, core banking replacement, generic chatbot functionality, and any feature enumerated in PRCB §23 and Constitution §16.

### 2.3 Intended Audience

Software engineers (backend, frontend, AI/ML), QA engineers, DevSecOps engineers, product managers, engineering leadership, and compliance reviewers responsible for implementing, testing, or governing ProspectIQ AI.

### 2.4 Business Context

IDBI Bank's Relationship Managers currently qualify loan prospects manually, without behavioral prioritization, resulting in wasted outreach effort and under-identification of creditworthy thin-file customers (PRCB §4–§6). ProspectIQ AI addresses this by synthesizing traditional and alternative data into an explainable behavioral profile that informs — but never replaces — RM judgment.

### 2.5 Product Overview

ProspectIQ AI ingests customer behavioral and alternative data, generates a Behavioral Financial DNA profile per customer/prospect, produces an explainable prioritization ranking for RM outreach, and surfaces this through an RM-facing workspace and a Branch Manager aggregate dashboard — with mandatory human review at every actionable step.

### 2.6 Definitions

See PRCB §44 (Project Terminology) and §45 (Glossary), which this document inherits without modification.

### 2.7 Acronyms

| Acronym | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| AIR | AI Requirement |
| BR | Business Rule |
| RM | Relationship Manager |
| BFD | Behavioral Financial DNA |
| RBAC | Role-Based Access Control |

Additional acronyms per PRCB §45.

### 2.8 References

1. Product Requirements & Context Bible (PRCB) — ProspectIQ AI, IDBI Innovate 2026
2. Project Constitution — ProspectIQ AI
3. IEEE 29148 (structural reference for requirements documentation practice)

---

## 3. Overall Description

### 3.1 Product Perspective

ProspectIQ AI is a standalone decision-support layer that integrates with, but does not replace, IDBI Bank's existing core banking, CRM, and credit underwriting systems (PRCB §20, §26). It sits upstream of formal loan application and underwriting workflows.

### 3.2 Product Functions

At a high level: data ingestion and normalization, Behavioral Financial DNA generation, explainable prioritization ranking, RM workspace and review interface, Branch Manager aggregate reporting, audit logging, and administrative governance (access control, configuration).

### 3.3 User Classes

| User Class | Description | Access Level |
|---|---|---|
| Relationship Manager | Primary daily user; reviews prioritized prospects and explanations | Own assigned prospects only |
| Loan Officer | Consumes behavioral context post-RM-qualification | Read access to qualified prospect context |
| Branch Manager | Oversees RM team performance and prioritization outcomes | Aggregate/branch-level view |
| Bank Administrator | Manages access control, configuration, governance | Full administrative access, no customer behavioral data by default |
| Compliance Reviewer | Audits explainability and fairness | Read-only audit trail access |

### 3.4 Operating Environment

Cloud-native deployment target consistent with PRCB §20 and Constitution §10; containerized services; deployable within IDBI Bank's existing technology ecosystem. **[ASSUMED FROM PRCB]**: Specific cloud provider and infrastructure choices are not specified in the PRCB and are deferred to the System Architecture Document.

### 3.5 Design Constraints

- Must not modify or replace existing credit scoring/underwriting systems (PRCB §23, §26).
- Must support explainability-by-design for every AI-driven output (PRCB §34, Constitution §5).
- Must operate correctly with partial/incomplete alternative data per customer (PRCB §30).

### 3.6 User Assumptions

Users (RMs, Branch Managers) have basic digital literacy consistent with existing IDBI internal tools; no specialized AI/ML knowledge is assumed or required to interpret system output, per the Explainability Strategy (PRCB §36).

### 3.7 Dependencies

- Availability of alternative data sources (UPI, GST, EPFO, electricity, fuel, turnover, multi-account data) via existing IDBI data access agreements (PRCB §39).
- Existing IDBI identity and access management infrastructure for authentication. **[ASSUMED FROM PRCB]**

---

## 4. Functional Requirements

Priority key: **M** = Must, **S** = Should, **C** = Could, **W** = Won't (this release).

### 4.1 Authentication & Access Control

**FR-001 — User Authentication**
- **Description:** The system shall authenticate all users before granting access to any functionality or data.
- **Priority:** M
- **Business Rationale:** Constitution §8 mandates authentication with no exceptions; PRCB §38 requires role-based access.
- **Inputs:** User credentials (integration with existing IDBI identity provider). **[ASSUMED FROM PRCB]**
- **Outputs:** Authenticated session or access denial.
- **Preconditions:** User has a valid, provisioned IDBI account.
- **Postconditions:** Authenticated session established with role context.
- **Dependencies:** IDBI identity and access management system.
- **Acceptance Criteria:** Given valid credentials, when a user logs in, then a session is created with correct role-based permissions; given invalid credentials, access is denied and the attempt is logged.

**FR-002 — Role-Based Access Control**
- **Description:** The system shall restrict data and feature visibility according to the user's assigned role (RM, Loan Officer, Branch Manager, Administrator, Compliance Reviewer).
- **Priority:** M
- **Business Rationale:** PRCB §38, Constitution §8 (Least Privilege).
- **Inputs:** Authenticated user's role.
- **Outputs:** Role-scoped UI and API responses.
- **Preconditions:** FR-001 completed.
- **Postconditions:** User sees only data/features permitted for their role.
- **Dependencies:** FR-001.
- **Acceptance Criteria:** An RM cannot access another RM's assigned prospects; a Branch Manager can view aggregate but not raw individual behavioral profiles beyond their branch scope; an Administrator cannot view customer behavioral profile content by default.

### 4.2 RM Workspace & Dashboard

**FR-003 — RM Prioritized Prospect Dashboard**
- **Description:** The system shall present each RM with a ranked, explainable list of prospects assigned to them upon login.
- **Priority:** M
- **Business Rationale:** PRCB §17 (RM Journey step 1); core value proposition of the product.
- **Inputs:** RM identity, current prioritization rankings for assigned prospects.
- **Outputs:** Ranked prospect list with summary explanation per entry.
- **Preconditions:** RM authenticated; prospects assigned to RM exist with generated BFD profiles.
- **Postconditions:** RM has a current, accurate view of prioritized prospects.
- **Dependencies:** FR-001, FR-002, FR-006 (BFD Generation), FR-008 (Prioritization Ranking).
- **Acceptance Criteria:** Dashboard loads within performance target defined in NFR-001; ranking order reflects the most recently generated prioritization scores; each entry displays a one-line rationale summary.

**FR-004 — Prospect Detail View**
- **Description:** The system shall allow an RM to open a full Behavioral Financial DNA profile and explanation for a selected prospect.
- **Priority:** M
- **Business Rationale:** PRCB §17 (RM Journey step 2); supports informed RM engagement.
- **Inputs:** Selected prospect ID.
- **Outputs:** Full BFD profile, contributing factors, confidence indicator, full explanation text.
- **Preconditions:** Prospect exists and is assigned to the requesting RM.
- **Postconditions:** RM has full context to make an engagement decision.
- **Dependencies:** FR-003, FR-006, FR-009 (Explainability).
- **Acceptance Criteria:** Detail view displays confidence score alongside every behavioral indicator; no score is displayed without accompanying explanation text (per AIR-004, BR-004).

**FR-005 — Engagement Outcome Logging**
- **Description:** The system shall allow an RM to record the outcome of a prospect engagement (converted, declined, follow-up needed).
- **Priority:** M
- **Business Rationale:** PRCB §17 (RM Journey step 5); feeds future refinement per PRCB §40.
- **Inputs:** Prospect ID, outcome selection, optional notes.
- **Outputs:** Logged outcome record.
- **Preconditions:** RM has engaged or attempted to engage the prospect.
- **Postconditions:** Outcome is stored and available for reporting and future model refinement.
- **Dependencies:** FR-004.
- **Acceptance Criteria:** Outcome is saved and reflected in Branch Manager reporting (FR-016) within the defined data refresh interval.

### 4.3 Behavioral Financial DNA

**FR-006 — Behavioral Financial DNA Generation**
- **Description:** The system shall generate a Behavioral Financial DNA profile for each eligible customer/prospect by synthesizing traditional and alternative data sources.
- **Priority:** M
- **Business Rationale:** PRCB §9 (Product Vision), §13 Objective 1 — the platform's core capability.
- **Inputs:** Traditional banking data (account activity, transaction history) and alternative data (UPI, electricity, GST, fuel, turnover, EPFO, multi-account activity) per PRCB §39.
- **Outputs:** A structured BFD profile containing behavioral indicators (income stability, spending discipline, payment consistency) and a confidence score reflecting data completeness.
- **Preconditions:** Customer/prospect has consented, available data from at least one source.
- **Postconditions:** BFD profile stored and available to prioritization and explanation components.
- **Dependencies:** Data ingestion pipelines for each source (FR-007).
- **Acceptance Criteria:** Profile generation succeeds with partial data (degraded confidence, not failure); profile is regenerated when underlying source data is refreshed; every profile field is traceable to its contributing source data (AIR-002).

**FR-007 — Alternative Data Ingestion**
- **Description:** The system shall ingest and normalize data from UPI, electricity payment, GST, fuel spending, business turnover, EPFO, and multi-bank-account sources.
- **Priority:** M
- **Business Rationale:** PRCB §11 (AMA insight 11), §39.
- **Inputs:** Raw data feeds from each source (format per source integration agreement). **[ASSUMED FROM PRCB — specific ingestion protocols not defined in source documents]**
- **Outputs:** Normalized, validated behavioral data records.
- **Preconditions:** Data source access is provisioned and consented.
- **Postconditions:** Normalized data available for BFD generation.
- **Dependencies:** None (foundational).
- **Acceptance Criteria:** Ingestion pipeline validates and rejects malformed records (NFR input validation); missing source does not block ingestion from other sources.

**FR-008 — Behavior vs. Static Data Distinction**
- **Description:** The system shall distinguish and separately represent behavioral pattern indicators (trends over time) from static point-in-time financial figures within the BFD profile.
- **Priority:** M
- **Business Rationale:** PRCB §11 (AMA insight 1), Product Philosophy §3 of Constitution ("Behaviour over raw numbers").
- **Inputs:** Time-series data per customer across ingested sources.
- **Outputs:** Trend-based behavioral indicators distinct from static values.
- **Preconditions:** Sufficient historical data exists to establish a trend (minimum window **[ASSUMED — to be defined by Data/AI team, not specified in PRCB]**).
- **Postconditions:** BFD profile reflects behavioral trend, not just latest snapshot.
- **Dependencies:** FR-006, FR-007.
- **Acceptance Criteria:** A customer with a single data point cannot receive a "disciplined spending" trend classification; classification requires a minimum defined observation window.

**FR-009 — Needs vs. Luxury Spending Classification**
- **Description:** The system shall classify spending patterns within the BFD profile as needs-based/disciplined versus discretionary/luxury.
- **Priority:** M
- **Business Rationale:** PRCB §11 (AMA insights 5–6).
- **Inputs:** Categorized transaction data from ingested sources.
- **Outputs:** Spending composition breakdown within the BFD profile.
- **Preconditions:** Transaction category data available.
- **Postconditions:** Spending classification available for prioritization and explanation.
- **Dependencies:** FR-007.
- **Acceptance Criteria:** Classification output is explainable (references specific transaction categories, not an opaque score).

### 4.4 Explainable Prioritization

**FR-010 — Lead Prioritization Ranking**
- **Description:** The system shall generate a ranked prioritization of prospects for each RM based on BFD-derived behavioral signal.
- **Priority:** M
- **Business Rationale:** PRCB §9, §13 Objective 2 — core value proposition.
- **Inputs:** BFD profiles for all prospects assigned to an RM.
- **Outputs:** Ranked list with a numeric or tiered priority score per prospect.
- **Preconditions:** BFD profiles exist for prospects in scope.
- **Postconditions:** RM dashboard (FR-003) reflects current ranking.
- **Dependencies:** FR-006.
- **Acceptance Criteria:** Ranking recalculates when underlying BFD profiles update; ranking is reproducible — the same inputs produce the same ranking output.

**FR-011 — Explanation Generation**
- **Description:** The system shall generate a plain-language explanation for every prioritization score, listing the specific contributing behavioral factors.
- **Priority:** M
- **Business Rationale:** PRCB §36 (Explainability Strategy); Constitution §5, §15 (Non-Negotiable: never bypass explainability).
- **Inputs:** BFD profile, prioritization score and its contributing feature weights.
- **Outputs:** Human-readable explanation text grounded in actual data (no generic templating disconnected from input data).
- **Preconditions:** FR-010 completed for the prospect.
- **Postconditions:** Explanation available wherever the score is displayed.
- **Dependencies:** FR-010, AIR-004.
- **Acceptance Criteria:** No score is ever rendered in the UI or API response without an accompanying explanation; explanation content changes when underlying contributing factors change (verifying it is not static/templated).

**FR-012 — Confidence Score Display**
- **Description:** The system shall display a confidence indicator alongside every BFD-derived score, reflecting data completeness and signal strength.
- **Priority:** M
- **Business Rationale:** Constitution §5 (AI Constitution — Confidence Scores).
- **Inputs:** Data completeness metadata from BFD generation.
- **Outputs:** Confidence indicator (e.g., High/Medium/Low or numeric range).
- **Preconditions:** BFD profile exists.
- **Postconditions:** Confidence context available wherever a score is shown.
- **Dependencies:** FR-006, FR-011.
- **Acceptance Criteria:** A profile built from a single data source displays materially lower confidence than one built from five sources.

**FR-013 — RM Override Logging**
- **Description:** The system shall allow an RM to override or disregard a prioritization recommendation, and shall log the override with reason (optional free text).
- **Priority:** M
- **Business Rationale:** PRCB §35 (Human-in-the-loop Strategy — Override logging, not blocking).
- **Inputs:** RM override action, optional reason.
- **Outputs:** Logged override record.
- **Preconditions:** A recommendation exists for the prospect in question.
- **Postconditions:** Override is recorded and available as feedback data (PRCB §17 step 6) and as a monitored AI health signal (Constitution §5).
- **Dependencies:** FR-010.
- **Acceptance Criteria:** Override does not block the RM from proceeding with their own judgment; override rate is queryable for reporting (FR-016, AIR-009).

### 4.5 Branch Manager Reporting

**FR-014 — Aggregate Branch Dashboard**
- **Description:** The system shall provide Branch Managers with an aggregate, explainable view of RM prioritization outcomes and engagement patterns across their branch.
- **Priority:** M
- **Business Rationale:** PRCB §13 Objective 7, §15 (Stakeholder Analysis — Branch Manager).
- **Inputs:** Aggregated engagement outcomes, override rates, and conversion data across RMs in the branch.
- **Outputs:** Branch-level dashboard views (conversion trends, override trends, thin-file surfacing counts).
- **Preconditions:** Branch Manager authenticated with appropriate role (FR-002).
- **Postconditions:** Branch Manager has visibility sufficient to assess fairness and effectiveness.
- **Dependencies:** FR-005, FR-013, FR-002.
- **Acceptance Criteria:** Dashboard does not expose individual customer-level behavioral profile detail beyond what is necessary for aggregate reporting (privacy boundary per PRCB §37).

**FR-015 — Fairness & Compliance Reporting View**
- **Description:** The system shall provide a compliance-facing report summarizing explainability coverage and flagging any recommendations lacking a complete explanation.
- **Priority:** S
- **Business Rationale:** PRCB §25 (Regulatory Constraints), Constitution §5 (Bias Awareness).
- **Inputs:** Explanation generation logs, coverage metadata.
- **Outputs:** Compliance report (completeness rate, flagged gaps).
- **Preconditions:** Explanation generation (FR-011) has been running and logging.
- **Postconditions:** Compliance Reviewer role has an auditable summary view.
- **Dependencies:** FR-011, FR-018 (Audit Logs).
- **Acceptance Criteria:** Any recommendation missing a grounded explanation is flagged, not silently served.

**FR-016 — Reporting & Export**
- **Description:** The system shall allow Branch Managers and Administrators to export aggregate reports (conversion, override rate, engagement outcomes) in a standard tabular format (e.g., CSV/XLSX).
- **Priority:** S
- **Business Rationale:** Standard enterprise reporting expectation; supports offline review and escalation.
- **Inputs:** Report type and date range selection.
- **Outputs:** Exported file.
- **Preconditions:** Requesting user has role permission (FR-002).
- **Postconditions:** Export file generated and available for download.
- **Dependencies:** FR-014.
- **Acceptance Criteria:** Export contains only data the requesting role is authorized to view; export action is logged (FR-018).

### 4.6 Search & Filtering

**FR-017 — Prospect Search and Filtering**
- **Description:** The system shall allow RMs to search and filter their assigned prospect list by name, priority tier, confidence level, and behavioral indicator category.
- **Priority:** S
- **Business Rationale:** Supports RM productivity per Constitution §7 (UX Constitution — minimal clicks, minimal cognitive load).
- **Inputs:** Search query and/or filter selections.
- **Outputs:** Filtered prospect list.
- **Preconditions:** RM has an assigned prospect list (FR-003).
- **Postconditions:** RM sees a filtered, relevant subset.
- **Dependencies:** FR-003.
- **Acceptance Criteria:** Filtering does not alter underlying ranking logic — it only changes the visible subset; search returns results within performance target (NFR-001).

### 4.7 Audit & Governance

**FR-018 — Audit Logging**
- **Description:** The system shall log every access to an individual customer's behavioral profile, every override action, and every export action, with actor, timestamp, and action type.
- **Priority:** M
- **Business Rationale:** PRCB §38 (Security Principles), Constitution §8 (Audit Logs).
- **Inputs:** System events (profile access, override, export, administrative changes).
- **Outputs:** Immutable audit log records.
- **Preconditions:** None (always active).
- **Postconditions:** Full audit trail available to Compliance Reviewer and Administrator roles.
- **Dependencies:** FR-002.
- **Acceptance Criteria:** Audit logs cannot be edited or deleted by any non-privileged role; every FR-004, FR-013, FR-016 action produces a corresponding audit entry.

**FR-019 — Administrative User & Role Management**
- **Description:** The system shall allow Administrators to provision, modify, and deactivate user accounts and role assignments.
- **Priority:** M
- **Business Rationale:** PRCB §15 (Stakeholder Analysis — Bank Administrators), Constitution §8 (Least Privilege).
- **Inputs:** Administrator actions (create/edit/deactivate user, assign role).
- **Outputs:** Updated user/role records.
- **Preconditions:** Requesting user has Administrator role.
- **Postconditions:** Access reflects updated role assignment immediately upon next authentication.
- **Dependencies:** FR-001, FR-002.
- **Acceptance Criteria:** Deactivated users cannot authenticate; role changes are logged (FR-018).

**FR-020 — System Configuration Settings**
- **Description:** The system shall allow Administrators to configure operational parameters (e.g., data refresh intervals, confidence thresholds for display) without requiring a code deployment.
- **Priority:** C
- **Business Rationale:** Supports maintainability (Constitution §4 Core Principle 10) and operational flexibility.
- **Inputs:** Administrator configuration changes.
- **Outputs:** Updated system behavior per configuration.
- **Preconditions:** Administrator role.
- **Postconditions:** Configuration applied and logged.
- **Dependencies:** FR-019.
- **Acceptance Criteria:** Configuration changes take effect without service restart where technically feasible; all changes are logged.

### 4.8 Notifications

**FR-021 — RM Notification of New High-Priority Prospects**
- **Description:** The system shall notify an RM when a new prospect is assigned to them with a high-priority ranking.
- **Priority:** S
- **Business Rationale:** Supports timely RM action, consistent with the RM-first principle (Constitution §4 Core Principle 2).
- **Inputs:** New prioritization event exceeding a defined threshold.
- **Outputs:** In-app (and optionally email — **[ASSUMED FROM PRCB]**, channel not specified in source documents) notification.
- **Preconditions:** RM has notification preferences enabled.
- **Postconditions:** RM is informed without needing to proactively check the dashboard.
- **Dependencies:** FR-010.
- **Acceptance Criteria:** Notification includes prospect identifier and priority tier; notification does not include full behavioral detail (detail requires FR-004 access with full audit logging).

### 4.9 Loan Readiness Context (Advisory, Not Approval)

**FR-022 — Loan Readiness Indicator**
- **Description:** The system shall present a behaviorally-derived "readiness for engagement" indicator per prospect, distinct from and never labeled as loan eligibility or approval likelihood.
- **Priority:** M
- **Business Rationale:** PRCB explicitly distinguishes this product from a "Loan Eligibility Checker" (PRCB, opening context) while still requiring the platform to help RMs assess repayment intent and disposable income (PRCB §11 insights 3–4). This requirement operationalizes that distinction carefully to avoid contradicting PRCB §23 (Out of Scope: final loan eligibility determination).
- **Inputs:** BFD profile (repayment behaviour, disposable income, spending discipline indicators).
- **Outputs:** A qualitative readiness indicator (e.g., "Strong engagement candidate — consistent repayment behaviour observed") accompanied by explanation.
- **Preconditions:** BFD profile exists.
- **Postconditions:** RM has advisory context, explicitly not a lending decision.
- **Dependencies:** FR-006, FR-011.
- **Acceptance Criteria:** UI copy and API field naming never use the terms "eligible," "approved," or "qualified" in connection with this indicator (BR-001); indicator is always paired with explanation.

---

## 5. Non-Functional Requirements

| ID | Category | Requirement | Target / Metric |
|---|---|---|---|
| NFR-001 | Performance | RM dashboard (FR-003) shall load within an acceptable interaction time under normal load. | **[ASSUMED — exact threshold, e.g., sub-3-second load, to be finalized with Engineering; not specified in PRCB]** |
| NFR-002 | Scalability | The platform shall support IDBI's full RM workforce without architectural redesign. | Horizontally scalable service design (Constitution §10) |
| NFR-003 | Availability | Core RM-facing functionality (dashboard, prospect detail) shall be highly available during banking business hours. | **[ASSUMED — specific uptime SLA to be defined with IDBI Operations]** |
| NFR-004 | Security | All data in transit and at rest shall be encrypted; all APIs shall enforce authentication and authorization. | Per Constitution §8, no exceptions |
| NFR-005 | Reliability | BFD generation shall degrade gracefully with incomplete data rather than fail. | Per PRCB §30, Constitution §6 (Error Handling) |
| NFR-006 | Accessibility | RM and Branch Manager interfaces shall meet WCAG-aligned accessibility standards. | Per Constitution §7 |
| NFR-007 | Maintainability | Business logic shall be isolated from presentation and infrastructure layers. | Per Constitution §6, §10 |
| NFR-008 | Observability | All services shall emit structured logs, metrics, and traces sufficient to reconstruct any recommendation's derivation. | Per Constitution §4 Principle 14, §6 |
| NFR-009 | Logging | Audit-relevant events (FR-018) shall be immutably logged with actor, timestamp, and action. | Per Constitution §8 |
| NFR-010 | Localization | **[ASSUMED — not addressed in PRCB; flagged for Product decision]** The platform may need to support English and regional language interfaces for branch-level usage. | To be confirmed with Product |
| NFR-011 | Cloud Readiness | All services shall be containerized and stateless where feasible. | Per Constitution §10 |
| NFR-012 | Compliance | The platform shall operate within RBI fair-lending and DPDP-aligned data handling expectations. | Per PRCB §25, Constitution §8 |
| NFR-013 | Disaster Recovery | **[ASSUMED — specific RPO/RTO targets not defined in source documents]** A disaster recovery plan shall exist for data and service restoration. | To be finalized with DevSecOps |
| NFR-014 | Backup | Behavioral data and audit logs shall be regularly backed up per IDBI data retention policy. | Per PRCB §9 (Data Strategy retention alignment) |
| NFR-015 | Performance Targets — Ingestion | Alternative data ingestion (FR-007) shall process new source data within a defined refresh interval. | **[ASSUMED — exact interval not specified; to be defined with Data Engineering]** |

---

## 6. AI Requirements

| ID | Requirement | Description |
|---|---|---|
| AIR-001 | Behavior Detection | The AI system shall detect and represent behavioral patterns (payment consistency, spending trend, income stability) rather than relying solely on static financial values (FR-008). |
| AIR-002 | Financial DNA Generation | The AI system shall synthesize traditional and alternative data into the BFD profile with full traceability from output field to contributing source data (FR-006). |
| AIR-003 | Lead Quality Prediction | The AI system shall produce a prioritization score estimating engagement-worthiness, not loan approval likelihood (FR-010, FR-022). |
| AIR-004 | Confidence Score | Every AI-derived score shall be paired with a confidence indicator reflecting data completeness (FR-012). |
| AIR-005 | Explainability | Every AI output shall be accompanied by a grounded, human-readable explanation derived from actual contributing factors, never generic templating (FR-011). |
| AIR-006 | Prompt Governance | If generative AI is used for explanation phrasing, prompts shall be version-controlled, peer-reviewed, and tested as part of the codebase (Constitution §5). |
| AIR-007 | Human Review | No AI output shall trigger a customer-facing or lending-relevant action without explicit human review and approval (Constitution §5, §15; PRCB §35). |
| AIR-008 | Bias Awareness | AI models and features shall be reviewed for proxies of protected characteristics prior to release, and periodically thereafter (Constitution §5). |
| AIR-009 | Model Monitoring | Score distribution, explanation-generation failure rate, and RM override rate shall be continuously monitored as AI health signals (Constitution §5). |
| AIR-010 | Model Replacement Strategy | Model invocation shall be abstracted behind a stable internal interface, allowing model swaps without altering business logic or output contracts (Constitution §5). |
| AIR-011 | Future Learning | Engagement outcomes (FR-005) and override data (FR-013) shall be captured in a form suitable for future model refinement, without being used to auto-update production models without governance review in this release. |
| AIR-012 | Synthetic Data Usage | All AI model development and testing prior to a governed production data agreement shall use synthetic or anonymized data only (Constitution §9, §16). |

---

## 7. Business Rules

| ID | Rule |
|---|---|
| BR-001 | A loan recommendation, readiness indicator, or prioritization score shall never be presented, labeled, or treated as a loan approval or eligibility determination. |
| BR-002 | RM approval/review is mandatory before any recommendation results in customer-facing action. |
| BR-003 | No recommendation, score, or ranking shall be displayed without an accompanying explanation. |
| BR-004 | No score shall be displayed without an accompanying confidence indicator. |
| BR-005 | Alternative data usage shall always be transparent and traceable to source within the BFD profile and explanation text. |
| BR-006 | RM overrides of system recommendations shall never be blocked, only logged. |
| BR-007 | Customer behavioral data shall only be used for purposes consistent with existing consent (no secondary use). |
| BR-008 | Access to individual customer behavioral profiles is restricted to the assigned RM, relevant Loan Officer context, and authorized Compliance Reviewers; Branch Managers and Administrators access aggregate views only by default. |
| BR-009 | Production customer data shall never be used in development, demo, or hackathon environments (Constitution §9, §16). |
| BR-010 | Any recommendation lacking a complete, grounded explanation shall be flagged for review, not silently served to an RM (FR-015). |
| BR-011 | System behavior shall never allow deterministic, rule-based logic to be replaced by AI/ML where the deterministic approach is sufficient and more transparent (Constitution §15). |
| BR-012 | Every business rule and compliance-relevant scoring rule shall be defined once in a shared, versioned location — never duplicated across services. |

---

## 8. User Stories

**US-001**
As a Relationship Manager, I want to see a ranked list of my assigned prospects with a clear reason for each ranking, so that I can prioritize my outreach time effectively.
*Acceptance Criteria:* Dashboard displays ranked list; each entry includes a one-line rationale; full detail is one click away (FR-003, FR-004).

**US-002**
As a Relationship Manager, I want to understand why a prospect was ranked highly, including which behavioral factors contributed, so that I can have an informed and defensible conversation with the prospect.
*Acceptance Criteria:* Detail view shows contributing factors in plain language; explanation is grounded in real data, not generic text (FR-011).

**US-003**
As a Relationship Manager, I want to override a system recommendation when my own judgment differs, without being blocked, so that I retain full control over my engagement decisions.
*Acceptance Criteria:* Override action is available on every recommendation; override is logged with optional reason; RM can proceed with their own choice (FR-013).

**US-004**
As a Branch Manager, I want to see aggregate conversion and override trends across my RM team, so that I can assess whether the tool is improving outcomes and being used fairly.
*Acceptance Criteria:* Aggregate dashboard shows conversion trend, override rate, and thin-file surfacing count without exposing individual customer-level detail beyond authorized scope (FR-014).

**US-005**
As a Compliance Reviewer, I want to audit whether every recommendation had a complete, grounded explanation, so that I can confirm the system meets regulatory explainability expectations.
*Acceptance Criteria:* Compliance report flags any recommendation with incomplete explanation coverage (FR-015).

**US-006**
As a Bank Administrator, I want to provision and deactivate user accounts and assign roles, so that access remains correctly scoped as staff join, move, or leave.
*Acceptance Criteria:* Administrator can create, edit, and deactivate accounts; role changes take effect immediately and are logged (FR-019).

---

## 9. Use Cases

### UC-001: RM Reviews and Acts on a Prioritized Prospect

- **Actors:** Relationship Manager
- **Preconditions:** RM is authenticated; prospects with generated BFD profiles are assigned to the RM.
- **Main Flow:**
  1. RM logs in and views the prioritized prospect dashboard (FR-003).
  2. RM selects a high-priority prospect to view full detail (FR-004).
  3. System displays BFD profile, confidence score, and explanation (FR-011, FR-012).
  4. RM decides to engage the prospect based on the provided context.
  5. RM contacts the prospect outside the system (existing channels).
  6. RM logs the engagement outcome (FR-005).
- **Alternative Flow:**
  3a. RM disagrees with the recommendation and overrides it (FR-013), providing an optional reason.
- **Exceptions:**
  2a. BFD profile has low confidence due to limited data — system displays this clearly rather than presenting it as a strong recommendation.
- **Business Rules:** BR-002, BR-003, BR-004, BR-006.
- **Success Condition:** RM makes an informed engagement decision, and the outcome is captured for future refinement.

### UC-002: Branch Manager Reviews Team Fairness and Performance

- **Actors:** Branch Manager
- **Preconditions:** Branch Manager is authenticated; engagement outcome and override data exist for the branch's RM team.
- **Main Flow:**
  1. Branch Manager opens the aggregate branch dashboard (FR-014).
  2. Branch Manager reviews conversion trend, override rate, and thin-file surfacing metrics.
  3. Branch Manager exports a report for further review (FR-016).
- **Alternative Flow:**
  2a. Branch Manager notices an unusually high override rate for one RM and follows up directly with that RM outside the system.
- **Exceptions:**
  1a. No data exists yet for the reporting period — dashboard displays an empty state, not an error.
- **Business Rules:** BR-008.
- **Success Condition:** Branch Manager has sufficient, appropriately-scoped visibility to manage team performance and assess fairness.

### UC-003: Compliance Reviewer Audits Explainability Coverage

- **Actors:** Compliance Reviewer
- **Preconditions:** Compliance Reviewer is authenticated with audit access.
- **Main Flow:**
  1. Compliance Reviewer opens the Fairness & Compliance Reporting view (FR-015).
  2. System displays explanation completeness rate and any flagged gaps.
  3. Compliance Reviewer drills into a flagged recommendation via the audit log (FR-018).
- **Exceptions:**
  2a. No gaps found for the reporting period — system confirms full coverage rather than displaying an ambiguous empty state.
- **Business Rules:** BR-003, BR-010.
- **Success Condition:** Compliance Reviewer can confirm or escalate explainability coverage issues with full traceability.

---

## 10. Traceability Matrix

| Business Goal (PRCB §19) | Feature | Requirement ID(s) | Acceptance Criteria Reference |
|---|---|---|---|
| Increase lead conversion | Prioritized RM Dashboard | FR-003, FR-010 | US-001 |
| Reduce RM workload on low-quality leads | Explainable Prioritization, Filtering | FR-010, FR-017 | US-001 |
| Improve customer understanding | Behavioral Financial DNA | FR-006, FR-008, FR-009 | AIR-001, AIR-002 |
| Improve repayment prediction | Loan Readiness Indicator | FR-022 | BR-001 |
| Reduce NPAs | BFD + Readiness Indicator (upstream signal only) | FR-006, FR-022 | BR-001 |
| Increase cross-sell opportunities | *(Future — see §12)* | — | — |
| Improve customer experience | Better-targeted RM engagement | FR-003, FR-010 | US-001 |
| Support explainable lending-adjacent decisions | Explanation Generation, Compliance Reporting | FR-011, FR-015 | US-002, US-005 |

---

## 11. Risks

### 11.1 Business Risks

| Risk | Related Requirement(s) | Mitigation |
|---|---|---|
| RMs distrust or ignore recommendations | FR-011, FR-012, FR-013 | High-quality, grounded explanations; override logged, not punished |
| Perceived bias in prioritization | AIR-008, FR-015 | Mandatory bias review; compliance reporting view |

### 11.2 Technical Risks

| Risk | Related Requirement(s) | Mitigation |
|---|---|---|
| Incomplete alternative data degrades profile quality | FR-006, FR-007, NFR-005 | Graceful degradation with confidence scoring, not failure |
| Ingestion pipeline failures for a single source cascade to others | FR-007 | Independent per-source ingestion, isolated failure handling |

### 11.3 AI Risks

| Risk | Related Requirement(s) | Mitigation |
|---|---|---|
| Explanation generation fails to keep pace with model complexity | AIR-005, AIR-006 | Model choice constrained to explainable-by-design approaches (Constitution §5) |
| Model drift degrades recommendation quality silently | AIR-009 | Continuous monitoring of score distribution and override rate |

### 11.4 Operational Risks

| Risk | Related Requirement(s) | Mitigation |
|---|---|---|
| Low RM adoption due to workflow friction | FR-003, FR-017, NFR-001 | UX designed for minimal clicks and cognitive load (Constitution §7) |
| Audit log volume/performance impact at scale | FR-018, NFR-002 | Scalable, append-only audit log design |

---

## 12. Future Enhancements

The following items are explicitly **out of MVP scope** for this SRS and are deferred to the post-hackathon roadmap, consistent with PRCB §40 (Future Integrations) and §41 (Future Vision):

- **Next Best Product / Cross-Sell Recommendation Engine** — extending the BFD concept beyond lending prospecting into broader product relevance (savings, insurance, investment products). Flagged as "Future" in PRCB §13 Objective 8.
- **CRM and Campaign Management Integration** — direct routing of prioritized prospects into existing IDBI CRM tooling (PRCB §40).
- **Repayment Outcome Feedback Loop** — using post-disbursement repayment data to continuously refine behavioral profiling accuracy (PRCB §40).
- **Customer-Facing Channel Integration** — governed, transparent customer-facing surfacing of relevant offers (PRCB §40).
- **Localization** — regional language support (NFR-010), pending Product confirmation.

No item in this section may be pulled into MVP scope without a corresponding update to the PRCB and Constitution first, per Constitution §13 (Decision Framework) and §17 (Living Constitution).

---

## Quality Check Confirmation

- ✓ Every functional area named in the requesting brief (Authentication, Dashboard, RM Workspace, Customer Profile/BFD, Lead Prioritization, Loan Readiness, Behavior Analysis, Financial Summary, Explainable AI, Recommendation Engine, Reports, Notifications, Audit Logs, Admin, Settings, Search, Filtering, Export) is addressed above; Next Best Product is explicitly deferred to Future Enhancements with rationale.
- ✓ Every requirement has a unique ID.
- ✓ Every functional requirement has stated acceptance criteria.
- ✓ Every AI requirement (Section 6) maps to an explainability-preserving implementation.
- ✓ Human-in-the-loop is structurally preserved in every relevant requirement (FR-013, AIR-007, BR-002, BR-006).
- ✓ No requirement contradicts the Constitution's Non-Negotiables (§15) or Out of Scope (§16).
- ✓ Assumptions not explicitly sourced from the PRCB or Constitution are labeled **[ASSUMED FROM PRCB]** or **[ASSUMED]** throughout.

---

*End of Document — ProspectIQ AI Software Requirements Specification*
