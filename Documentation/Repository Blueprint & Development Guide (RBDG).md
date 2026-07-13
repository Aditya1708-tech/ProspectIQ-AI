# ProspectIQ AI
## Repository Blueprint & Development Guide (RBDG)

**Project:** ProspectIQ AI (working name)
**Hackathon:** IDBI Innovate 2026 — Track: Prospect Assist AI
**Document Type:** Engineering Handbook — binding for every human engineer and every AI coding assistant (Antigravity, Claude Code, Cursor, ChatGPT, or any other tool) contributing to this repository
**Governing Documents:** Product Requirements & Context Bible (PRCB), Project Constitution, Software Requirements Specification (SRS), Product Technical Blueprint (PTB)
**Assumed Team Size:** 20+ engineers
**Status:** Draft for Engineering Kickoff

> **Source note:** As with prior documents in this chain, a "Product Backlog & Feature Blueprint" was named as a source but has not been provided in this conversation. This RBDG introduces no product feature not already approved in the SRS or PTB — every module, engine, and standard below maps directly to an existing FR/AIR/BR (SRS) or engine/pillar (PTB). Technology stack choices were specified directly in the requesting brief and are used as given, with rationale added.

---

## 1. Engineering Vision

### 1.1 Engineering Philosophy

This repository is built on one operating assumption: **it will be read far more often than it will be written, by people who did not write it, including AI assistants with no memory of this conversation.** Every standard in this document exists to make that reading experience predictable. A 20-engineer team cannot function if two engineers solve the same problem two different ways — the cost is not aesthetic, it is the compounding cognitive tax every future contributor pays to understand which pattern applies where.

Per Constitution §3 and §4, the philosophy translates into three working rules for this repository specifically:

1. **Boring is correct.** The most maintainable code is the code that looks exactly like the code around it. Novel approaches require justification through the Decision Framework (Constitution §13), not personal preference.
2. **Explainability discipline extends to code.** If the product must explain every AI recommendation to a human, the codebase implementing that product must be explainable to the next engineer — undocumented cleverness is treated as a defect, not a virtue.
3. **AI-assisted code is held to the human bar, not a lower one.** Section 18 of this document exists because AI coding assistants are now first-class contributors to this repository and must follow every rule a human engineer follows.

### 1.2 Maintainability Goals

- A new engineer (human) should be able to locate the code responsible for any SRS requirement within minutes, not hours, using the module map in Section 4.
- No business rule (SRS Section 7) is ever implemented in more than one place.
- Every module can be understood, tested, and modified without needing to understand the internals of every other module (Constitution §10 — Loose Coupling, High Cohesion).

### 1.3 Scalability Goals

- The repository structure supports the PTB's engine boundaries (Section 6 of the PTB) evolving into independently deployable services without a folder-structure rewrite.
- The AI service is isolated from day one so it can scale, fail, and be redeployed independently of the core API (PTB Section 6, Constitution §10).

### 1.4 AI-Assisted Development Strategy

AI coding assistants are expected to be heavy contributors to this codebase. This is treated as an operational reality to be governed, not a risk to be avoided. Section 18 is the binding contract every AI assistant operating in this repository must follow, and it is written to be machine-readable by any tool capable of following repository-level instructions (e.g., placed in a root-level `AGENTS.md` or equivalent).

---

## 2. Repository Structure

```
prospectiq-ai/
├── apps/
│   ├── web/                 # RM/Branch Manager/Admin frontend (React + Vite + TS)
│   ├── api/                 # Core backend API (Node.js + Express + TS)
│   └── ai-service/          # AI/ML inference service (Python + FastAPI)
├── packages/
│   ├── ui/                  # Shared, reusable UI component library
│   ├── shared/               # Shared business types, constants, validation schemas
│   ├── config/                # Shared lint/tsconfig/build configuration
│   └── types/                # Shared TypeScript type definitions (API contracts, domain models)
├── docs/                     # PRCB, Constitution, SRS, PTB, RBDG, and all derived docs
├── scripts/                   # Developer tooling, codegen, migration helpers
├── infrastructure/           # Docker, IaC, CI/CD configuration
└── .github/                   # GitHub Actions workflows, PR templates, CODEOWNERS
```

| Folder | Responsibility | Why It Exists |
|---|---|---|
| `apps/web` | User-facing application for RMs, Branch Managers, and Administrators (SRS Section 4) | Isolates all presentation-layer code; must contain zero business logic (Constitution §15 Non-Negotiable) |
| `apps/api` | Core backend: authentication, RBAC, prospect/customer data orchestration, business rule enforcement, audit logging | Owns everything in SRS Sections 4.1–4.8 except AI inference itself |
| `apps/ai-service` | Hosts the nine PTB engines (Data Quality, Income/Expense/Behavior Analysis, Financial DNA, Lead Quality, Recommendation, Explainability, Monitoring) | Isolated per PTB's design so AI/ML concerns never leak into `apps/api`, and so the AI service can be scaled, versioned, and model-swapped independently (Constitution §5 Model Independence) |
| `packages/ui` | Shared design-system components (buttons, tables, score/confidence displays, explanation panels) | Guarantees UI consistency across `apps/web` without duplication (Constitution §4 Principle 12 — Reusability) |
| `packages/shared` | Domain types and validation schemas shared between `apps/api` and `apps/web` (e.g., the Explanation Object contract from PTB Section 8) | Prevents contract drift between frontend and backend — a single source of truth for shapes like `PriorityScore`, `ExplanationObject`, `FDNAProfile` |
| `packages/config` | Shared ESLint, Prettier, TypeScript, and build configuration | Guarantees every app and package is linted and typed identically — no per-team style drift |
| `packages/types` | Cross-cutting TypeScript types not owned by a single domain (e.g., pagination, API envelope types) | Keeps generic infrastructure types out of `packages/shared`, which is reserved for domain concepts |
| `docs/` | All governing documents (PRCB, Constitution, SRS, PTB, this RBDG) and any Architecture Decision Records | Per Constitution §17 (Living Constitution) and §4 Principle 17 (Documentation First), documentation lives in-repo, versioned alongside code |
| `scripts/` | One-off and repeatable developer tooling (DB seed scripts using synthetic data only per Constitution §9/§16, codegen for shared types) | Keeps tooling out of application code paths |
| `infrastructure/` | Dockerfiles, docker-compose, CI/CD pipeline definitions, IaC | Centralizes deployment concerns per Constitution §10 (Cloud/Docker Readiness) |
| `.github/` | CI workflows, PR templates enforcing Section 19's Definition of Done, CODEOWNERS mapping to module ownership (Section 4) | Automates enforcement of this document's standards rather than relying on manual discipline alone |

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend framework | React + Vite | Fast local dev feedback loop (Constitution §4 Principle 9 — Developer Experience); React's component model maps cleanly to the shared `packages/ui` reuse strategy. |
| Frontend language | TypeScript | Type safety across the RM-facing UI reduces a whole class of runtime defects before they reach a production banking tool; supports the `packages/shared` contract-sharing strategy. |
| Styling | Tailwind CSS | Utility-first styling keeps visual consistency enforceable and reviewable, aligned with the UX Constitution's (Constitution §7) "no unnecessary visual effects" principle — Tailwind makes deviation from the design system visible in code review. |
| Component primitives | shadcn/ui | Accessible-by-default primitives reduce the burden of independently satisfying NFR-006 (Accessibility) on every custom component. |
| Backend runtime | Node.js + Express | Mature, well-understood, and fast to onboard new engineers into — directly serves the Developer Experience principle for a 20+ engineer team. |
| Backend language | TypeScript | Shares types with the frontend via `packages/shared`/`packages/types`, eliminating an entire category of contract-mismatch bugs between `apps/web` and `apps/api`. |
| AI service language | Python | Ecosystem fit for the PTB's engines (Section 6), especially data processing and future ML model integration (PTB Section 6, "Suggested Future ML Model" per engine). |
| AI service framework | FastAPI | Enforces request/response typing and auto-generates API documentation, supporting the strict Input/Output Contract requirement in Section 9 of this document. |
| AI/ML tooling | Scikit-learn, Pandas | Sufficient, well-understood tooling for the MVP-stage engines (rule-based and classical-ML approaches per PTB Section 6, e.g., Recommendation Engine is explicitly rule-based, not deep-learning-based) — avoids introducing model complexity the explainability requirements cannot support. |
| Database | PostgreSQL | Relational integrity for behavioral, audit, and business-rule data where consistency (foreign keys, transactions) is a compliance requirement, not a preference (SRS NFR-004, NFR-009). |
| ORM | Prisma | Type-safe database access shared conceptually with the TypeScript backend; migration tooling supports the Migration Strategy in Section 10. |
| Containerization | Docker | Satisfies Constitution §10 (Docker Readiness) — every service runs identically in local dev, CI, and production. |
| CI/CD | GitHub Actions | Automates the Definition of Done (Section 19) as enforced gates rather than manual checklist items. |

---

## 4. Module Boundaries

Each module below maps to one or more PTB engines or SRS functional areas. No module may implement logic owned by another module — cross-module needs are satisfied through the public interface only.

### 4.1 Authentication
- **Purpose:** Authenticate users and establish role-scoped sessions.
- **Responsibilities:** Login/logout, session/token issuance, integration with IDBI identity provider.
- **Dependencies:** None (foundational).
- **Public Interface:** `authenticate(credentials) → Session`; `getCurrentUser(session) → UserContext`.
- **Future Scalability:** Designed to be replaceable with a full SSO/IDP integration without touching downstream modules, since all downstream modules depend only on `UserContext`, never on the authentication mechanism itself.
- **Maps to:** SRS FR-001.

### 4.2 Customer Management
- **Purpose:** Own customer/prospect identity, assignment, and consent metadata.
- **Responsibilities:** Prospect-to-RM assignment records, consent status tracking, customer identity resolution across data sources.
- **Dependencies:** Authentication (for RBAC scoping).
- **Public Interface:** `getAssignedProspects(rmId) → Prospect[]`; `getProspect(prospectId) → ProspectRecord`.
- **Future Scalability:** Assignment logic can evolve (e.g., automated assignment rules) without affecting BehaviorIQ or FinDNA, which only consume `ProspectRecord`.
- **Maps to:** SRS FR-002, FR-003 (assignment data).

### 4.3 BehaviorIQ
- **Purpose:** Implements the Data Quality, Income Analysis, Expense Analysis, and Behavior Analysis Engines (PTB Sections 6.1–6.4).
- **Responsibilities:** Data ingestion and normalization, per-dimension behavioral statement generation.
- **Dependencies:** External data source connectors (UPI, GST, EPFO, electricity, fuel, turnover, multi-account — SRS FR-007).
- **Public Interface:** `analyzeBehavior(customerId) → BehavioralIndicators` (with per-dimension confidence).
- **Future Scalability:** New data sources are added as new connectors without modifying downstream FinDNA logic, since FinDNA only consumes the `BehavioralIndicators` contract.
- **Maps to:** SRS FR-006 (data inputs), FR-007, FR-008, FR-009; PTB Section 6.1–6.4.

### 4.4 FinDNA
- **Purpose:** Implements the Financial DNA Engine (PTB Section 6.5) — synthesizes `BehavioralIndicators` into the full FDNA profile (PTB Section 5's eight dimensions).
- **Responsibilities:** Cross-dimension synthesis, composite confidence calculation, partial-profile handling for thin-file customers.
- **Dependencies:** BehaviorIQ.
- **Public Interface:** `generateFDNAProfile(customerId) → FDNAProfile`.
- **Future Scalability:** The ensemble synthesis model upgrade path (PTB Section 6.5) can be introduced behind this same interface without downstream changes.
- **Maps to:** SRS FR-006; PTB Section 5, 6.5.

### 4.5 PriorityIQ
- **Purpose:** Implements the Lead Quality Engine and Recommendation Engine (PTB Sections 6.6–6.7).
- **Responsibilities:** Priority score computation, tier classification, rule-based recommendation translation (with BR-001 language constraints enforced here and only here).
- **Dependencies:** FinDNA.
- **Public Interface:** `scoreProspect(fdnaProfile) → PriorityScore`; `generateRecommendation(priorityScore) → Recommendation`.
- **Future Scalability:** The learning-to-rank model upgrade path (PTB Section 6.6) is introduced behind the `scoreProspect` interface, and the Recommendation Engine's rule-based nature is preserved permanently per PTB's explicit design choice.
- **Maps to:** SRS FR-010, FR-022, BR-001, BR-011; PTB Section 6.6–6.7.

### 4.6 ExplainIQ
- **Purpose:** Implements the Explainability Engine (PTB Section 6.8) — produces the Explanation Object (PTB Section 8).
- **Responsibilities:** Grounded, evidence-based explanation generation; explanation completeness validation; withholding incomplete explanations (BR-010).
- **Dependencies:** FinDNA, PriorityIQ.
- **Public Interface:** `generateExplanation(fdnaProfile, priorityScore, recommendation) → ExplanationObject | IncompleteExplanationFlag`.
- **Future Scalability:** The constrained generative-model upgrade path (PTB Section 6.8) is introduced behind this interface; grounding/retrieval logic changes never affect FinDNA or PriorityIQ.
- **Maps to:** SRS FR-011, BR-003, BR-010; PTB Section 6.8, 8.

### 4.7 Dashboard
- **Purpose:** RM-facing and Branch Manager-facing presentation of prioritized prospects and aggregate views.
- **Responsibilities:** Rendering ranked lists, prospect detail views, aggregate branch views — presentation only, no scoring or explanation logic.
- **Dependencies:** Customer Management, PriorityIQ, ExplainIQ (via `apps/api` orchestration, never called directly from `apps/web`).
- **Public Interface:** Frontend module; consumes `apps/api` REST endpoints only.
- **Future Scalability:** New dashboard views can be added without touching any AI-service engine.
- **Maps to:** SRS FR-003, FR-004, FR-014, FR-017.

### 4.8 Reports
- **Purpose:** Aggregate reporting and export (SRS FR-016) and Fairness & Compliance Reporting (SRS FR-015).
- **Responsibilities:** Report generation, export formatting, explanation-completeness compliance summaries.
- **Dependencies:** Dashboard's underlying data (via `apps/api`), ExplainIQ (for compliance metrics).
- **Public Interface:** `generateReport(type, dateRange, requesterRole) → ReportFile`.
- **Maps to:** SRS FR-015, FR-016.

### 4.9 Notifications
- **Purpose:** Notify RMs of new high-priority prospects (SRS FR-021).
- **Responsibilities:** Notification triggering, delivery, preference management.
- **Dependencies:** PriorityIQ (score threshold events).
- **Public Interface:** `notify(rmId, event) → NotificationRecord`.
- **Maps to:** SRS FR-021.

### 4.10 Administration
- **Purpose:** User/role management and system configuration (SRS FR-019, FR-020).
- **Responsibilities:** Account provisioning, role assignment, configuration parameter management (e.g., scoring weight configuration referenced in PTB Section 7.2).
- **Dependencies:** Authentication.
- **Public Interface:** `manageUser(action, userId, role) → UserRecord`; `updateConfig(key, value) → ConfigRecord`.
- **Maps to:** SRS FR-019, FR-020.

### 4.11 Audit
- **Purpose:** Immutable logging of every access, override, and export event (SRS FR-018).
- **Responsibilities:** Append-only audit record creation, audit query interface for Compliance Reviewer role.
- **Dependencies:** Called by every other module; depends on none.
- **Public Interface:** `logEvent(actor, action, target, timestamp) → AuditRecord` (write-only from other modules; read via a dedicated compliance query interface).
- **Maps to:** SRS FR-018; PTB Section 6.9 (Monitoring Engine overlaps here for AI-specific health signals, but Audit owns compliance-facing event logs specifically).

**Module dependency rule:** Dependencies flow in one direction only, as listed above (e.g., PriorityIQ depends on FinDNA, never the reverse). Any proposed dependency that would create a cycle must be resolved through the Decision Framework (Constitution §13) before implementation.

---

## 5. Folder Structure Standards

### 5.1 `apps/web` (Frontend)

```
apps/web/src/
├── pages/            # Route-level components only; compose from components/, no business logic
├── components/        # App-specific components not generic enough for packages/ui
├── hooks/             # Custom React hooks (data fetching, shared UI logic)
├── services/           # API client calls (typed via packages/shared contracts)
├── contexts/           # React context providers (auth/session, theme)
├── utils/              # Pure utility functions (formatting, date handling) — no side effects
├── types/               # Component-local types not shared across apps
├── assets/              # Static assets (icons, images)
└── tests/                # Component and integration tests, mirroring src/ structure
```

### 5.2 `apps/api` (Backend)

```
apps/api/src/
├── controllers/       # HTTP request/response handling only — delegates to services
├── services/            # Business logic per module (Section 4) — no HTTP or DB specifics
├── repositories/         # Data access layer — the only layer that talks to Prisma/DB
├── middleware/           # Auth, validation, rate limiting, error handling
├── validation/            # Request schema validation (shared types from packages/shared)
├── config/                 # Environment and app configuration loading
└── tests/                   # Unit and integration tests, mirroring src/ structure
```

### 5.3 `apps/ai-service` (AI Service)

```
apps/ai-service/src/
├── engines/            # One subfolder per PTB engine (data_quality/, financial_dna/, etc.)
├── contracts/           # Pydantic models defining Input/Output Contracts (Section 9)
├── pipeline/             # Orchestration wiring engines together per PTB Section 3/6
├── monitoring/            # Monitoring Engine implementation (PTB Section 6.9)
└── tests/                  # Engine-level and pipeline-level tests
```

**Rule:** Controllers never contain business logic (Constitution §15 Non-Negotiable — "never mix UI with business logic" extends to "never mix HTTP handling with business logic"). Repositories never contain business logic. Services never import Express/FastAPI request/response objects directly.

---

## 6. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Variables | camelCase | `priorityScore`, `fdnaProfile` |
| Functions | camelCase, verb-first | `generateExplanation()`, `scoreProspect()` |
| Classes | PascalCase | `FinDnaService`, `AuditLogger` |
| Files (TS/JS) | kebab-case | `fin-dna.service.ts`, `priority-iq.controller.ts` |
| Files (Python) | snake_case | `financial_dna_engine.py` |
| Folders | kebab-case | `apps/ai-service/src/engines/financial-dna/` |
| React Components | PascalCase, file matches component name | `ProspectDetailView.tsx` |
| Database Tables | snake_case, plural | `prospects`, `fdna_profiles`, `audit_logs` |
| API Routes | kebab-case, resource-plural, versioned | `/api/v1/prospects/:id/fdna-profile` |
| Environment Variables | SCREAMING_SNAKE_CASE, module-prefixed | `AI_SERVICE_MODEL_VERSION`, `DB_CONNECTION_STRING` |
| Git Branches | `type/module-short-description` | `feature/priority-iq-tier-classification`, `fix/audit-log-immutability` |

---

## 7. Frontend Engineering Standards

| Standard | Rule |
|---|---|
| **Component architecture** | Presentational components (in `components/`) receive data via props only; no direct API calls. Container logic lives in `hooks/` or `pages/`. |
| **State management** | Local component state by default; shared/cross-page state only where genuinely needed (e.g., authenticated user context), via React Context — no premature introduction of a global state library. |
| **Routing** | Route definitions centralized in one location; each route maps to exactly one `pages/` component. |
| **Error boundaries** | Every route-level page is wrapped in an error boundary; AI-service or API failures render a graceful degraded state (e.g., "Recommendation temporarily unavailable"), never a raw error or blank screen — this directly supports SRS NFR-005's graceful-degradation requirement at the UI layer. |
| **Forms** | Controlled components with schema-based validation using shared `packages/shared` validation schemas — validation logic is never duplicated between frontend and backend. |
| **Validation** | Client-side validation is a UX convenience only; the backend is the authoritative validator (Constitution §8 — Input Validation) and never trusts the client. |
| **Responsive design** | Mobile/tablet-aware layouts for all RM-facing views, per Constitution §7. |
| **Accessibility** | shadcn/ui primitives used as the accessibility baseline; any custom component must independently meet WCAG-aligned standards (SRS NFR-006) before merge. |
| **Performance optimization** | Route-level code splitting; the RM dashboard's initial load (SRS FR-003) is treated as the primary performance budget target (SRS NFR-001). |

---

## 8. Backend Engineering Standards

| Layer | Rule |
|---|---|
| **Layered architecture** | Strict Controller → Service → Repository flow (Constitution §6 — Clean Architecture). No layer skips another. |
| **Controllers** | Parse/validate HTTP input, call exactly one service method, format the HTTP response. No business logic. |
| **Services** | Own all business logic and orchestration across modules (Section 4). Framework-agnostic — testable without an HTTP server. |
| **Repositories** | Own all Prisma/database queries. No business logic. Services never bypass repositories to query the database directly. |
| **Middleware** | Authentication, RBAC enforcement, request validation, rate limiting, and centralized error handling are implemented as middleware, applied consistently across routes — not reimplemented per route. |
| **Validation** | Every incoming request is validated against a shared schema (`packages/shared`) before reaching a controller's business logic call. |
| **Authentication** | Delegated entirely to the Authentication module (Section 4.1); no other module reimplements session/token verification. |
| **Authorization** | RBAC checks happen in middleware, using role data from the authenticated session — never re-derived ad hoc inside a service. |
| **Error handling** | Centralized error-handling middleware converts thrown errors into the standard API error format (Section 11.4); services throw typed domain errors, never raw strings. |
| **Logging** | Every service logs key decision points (e.g., "FDNA profile generated with confidence X") using structured logging (Section 16) — not `console.log`. |

---

## 9. AI Service Standards

The AI service (`apps/ai-service`) hosts the PTB's nine engines and is treated as an internal API consumed only by `apps/api` — never called directly from `apps/web`.

| Standard | Rule |
|---|---|
| **Input Contracts** | Every engine defines a Pydantic input model matching its PTB-defined Inputs (PTB Section 6). No engine accepts loosely-typed dictionaries. |
| **Output Contracts** | Every engine defines a Pydantic output model that always includes a confidence field — an engine that cannot express confidence for its output has an incomplete contract and cannot ship (PTB Section 6, "Confidence Score" per engine). |
| **Model loading** | Models are loaded once at service startup behind the stable internal interface described in PTB Section 6.10/AIR-010 — never loaded per-request. |
| **Inference flow** | Follows the PTB Section 3 pipeline order strictly: Data Quality → (Income/Expense/Behavior) → Financial DNA → Lead Quality → Recommendation → Explainability. No engine may be called out of this order. |
| **Fallback behavior** | Every engine implements the specific fallback strategy defined for it in PTB Section 6 — fallback is a required, tested code path, not an afterthought. |
| **Confidence scores** | Propagated end-to-end; an engine that consumes another engine's output must also consume and factor in its confidence score, never assuming a fixed default. |
| **Explainability** | The Explainability Engine's output (PTB Section 8) is validated for completeness before being returned to `apps/api`; an incomplete Explanation Object triggers the BR-010 flagging path, not silent delivery. |
| **Logging** | Every inference call logs input source-tags, engine version, and output confidence — sufficient to reconstruct any recommendation after the fact (Constitution §4 Principle 14). |
| **Future model replacement** | New model versions are deployed behind the same Input/Output Contract; contract changes require a version bump and are never made as silent breaking changes (Constitution §5 — Model Independence, Future Model Replacement). |

---

## 10. Database Standards

| Standard | Rule |
|---|---|
| **Naming conventions** | Tables: `snake_case`, plural (`prospects`, `fdna_profiles`). Columns: `snake_case` (`created_at`, `rm_id`). |
| **Migration strategy** | All schema changes go through Prisma migrations, committed to version control — no manual schema edits against any environment. |
| **Indexes** | Indexes are added deliberately for known access patterns (e.g., `prospects(rm_id)` for dashboard queries) and documented in the migration commit message with rationale. |
| **Audit fields** | Every table includes `created_at`, `updated_at`; tables holding data referenced by the Audit module (Section 4.11) additionally include `created_by`. |
| **Soft deletes** | Customer/prospect and audit-relevant records use soft deletes (`deleted_at` nullable timestamp) — hard deletes are never used for data with compliance/audit relevance (SRS FR-018, NFR-009). |
| **Foreign keys** | Enforced at the database level, not only in application logic, to guarantee referential integrity for compliance-relevant relationships (e.g., an `audit_logs` entry must always resolve to a valid actor). |
| **Transactions** | Multi-step writes that must be atomic (e.g., FDNA profile generation plus its audit log entry) are wrapped in a database transaction — partial writes are never acceptable for audit-relevant data. |

---

## 11. API Standards

| Standard | Rule |
|---|---|
| **REST conventions** | Resource-oriented routes (`/prospects`, `/prospects/:id/fdna-profile`), standard HTTP verbs, no verb-in-URL patterns. |
| **Versioning** | All routes are prefixed `/api/v1/`; breaking changes require a new version prefix, never an in-place breaking change to `v1`. |
| **Response format** | All successful responses use a consistent envelope. |
| **Error format** | All error responses use a consistent envelope, distinct from the success envelope. |
| **Status codes** | Standard HTTP status codes used consistently (`200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`) — no custom status code repurposing. |
| **Pagination** | List endpoints (e.g., prospect lists) use cursor or offset-based pagination consistently, never returning unbounded result sets. |
| **Filtering** | Query-parameter-based filtering (`?tier=high&confidence=high`), matching SRS FR-017's search/filter requirement. |
| **Authentication** | All non-public routes require a valid session token (Section 7 of Constitution — Secure APIs). |
| **Rate limiting** | Applied at the middleware layer (Section 8) per SRS NFR/Constitution §8; ingestion-facing endpoints (SRS FR-007) carry stricter limits than read-only dashboard endpoints. |

**Example success response:**
```json
{
  "success": true,
  "data": {
    "prospectId": "p_8f21a",
    "priorityTier": "priority-engage",
    "confidence": "high"
  },
  "meta": {
    "requestId": "req_a91c",
    "timestamp": "2026-07-08T09:15:00Z"
  }
}
```

**Example error response:**
```json
{
  "success": false,
  "error": {
    "code": "EXPLANATION_INCOMPLETE",
    "message": "Recommendation withheld: explanation object failed completeness validation.",
    "requestId": "req_a91c"
  }
}
```

Note that the error example directly encodes BR-010's requirement (incomplete explanations are flagged, not silently served) as an explicit, testable API error code — this is the kind of alignment expected throughout the codebase, not an isolated example.

---

## 12. Security Standards

| Standard | Rule |
|---|---|
| **JWT** | Short-lived access tokens with refresh flow; tokens carry role claims consumed by RBAC middleware (Section 8). |
| **RBAC** | Enforced centrally in middleware (Section 8), sourced from the Authentication module (Section 4.1) — never reimplemented per route. |
| **Input validation** | Every API boundary validates input against shared schemas before any business logic executes (Section 8, Section 11). |
| **Secrets management** | All secrets (DB credentials, model provider keys, JWT signing keys) are stored in a dedicated secrets manager and injected via environment variables at deploy time — never committed to the repository (Constitution §15 Non-Negotiable). |
| **Encryption** | TLS in transit for all services; encryption at rest for the database, satisfying SRS NFR-004. |
| **OWASP** | Standard OWASP Top 10 mitigations applied at the middleware and validation layers (injection prevention via parameterized Prisma queries, output encoding, etc.). |
| **DPDP awareness** | Data minimization enforced at the repository layer — queries retrieve only the fields a given module's public interface actually needs, not full records by default. |
| **Audit logs** | Every module writes to the Audit module (Section 4.11) for any access to individual customer behavioral data, per SRS FR-018 — enforced via a shared audit-logging utility, not per-module reimplementation (avoiding the duplication risk flagged in BR-012). |

---

## 13. Git Workflow

| Standard | Rule |
|---|---|
| **Branch naming** | `type/module-short-description`, e.g. `feature/explain-iq-watch-items`, `fix/audit-log-soft-delete`. |
| **Commit message format** | `type(module): description` — e.g., `feat(priority-iq): add tier classification thresholds`; `fix(audit): prevent hard delete on prospect records`. |
| **Pull requests** | Every PR links to its source requirement ID(s) (e.g., "Implements SRS FR-011, PTB Section 6.8") and describes what changed and why, per Constitution §11. |
| **Code reviews** | Minimum one independent reviewer required; AI-generated PRs are reviewed with the same rigor as human PRs (Constitution §6 — no AI authorship exemption). |
| **Release tagging** | Semantic versioning (`vMAJOR.MINOR.PATCH`); AI service model version bumps are tagged separately from application releases to keep model provenance traceable (Section 9 — Future model replacement). |

---

## 14. Testing Standards

| Test Type | Scope | Coverage Expectation |
|---|---|---|
| **Unit tests** | Individual service/engine functions in isolation (mocked dependencies) | Required for all business logic in `services/` (backend) and all engines in `apps/ai-service` |
| **Integration tests** | Module boundaries (e.g., PriorityIQ consuming FinDNA output) | Required for every public interface defined in Section 4 |
| **API tests** | Full request/response cycle through `apps/api`, including validation and auth middleware | Required for every endpoint |
| **Frontend tests** | Component rendering and interaction, especially error boundary and graceful-degradation states (Section 7) | Required for all `pages/` and shared `components/` |
| **AI validation tests** | Explicit tests confirming: (a) an incomplete Explanation Object is never returned to `apps/api`, (b) confidence scores are always present, (c) BR-001 language constraints are never violated by Recommendation Engine output | Required and treated as release-blocking, not optional, given these map directly to Constitution Non-Negotiables |

---

## 15. Performance Standards

| Area | Standard |
|---|---|
| **Target response times** | RM dashboard initial load and prospect detail view meet SRS NFR-001's interaction budget (target to be finalized with Engineering, per SRS's flagged assumption). |
| **Lazy loading** | Non-critical dashboard sections (e.g., historical engagement charts) load after the primary prioritized list renders. |
| **Caching** | FDNA profiles and priority scores are cached with explicit invalidation on data refresh (SRS FR-006 postcondition) — never served stale without the RM being able to tell (a "last updated" indicator is required wherever cached data is shown). |
| **Database optimization** | Query patterns for dashboard endpoints are indexed deliberately (Section 10); N+1 query patterns are treated as defects, caught in code review. |
| **Bundle optimization** | Frontend bundle is code-split by route; shared `packages/ui` components are tree-shakeable. |

---

## 16. Logging & Monitoring

| Area | Standard |
|---|---|
| **Structured logging** | All services log in structured JSON format (never plain-text `console.log` in production code paths), including a `requestId` correlating a request across `apps/web` → `apps/api` → `apps/ai-service`. |
| **Error tracking** | Unhandled exceptions in any service are captured centrally with full context (module, requestId, user role — never raw customer behavioral data in error logs, per Constitution §9 Privacy by Design). |
| **Audit events** | Distinct from general application logs; audit events (Section 4.11) are immutable, append-only, and never mixed into general debug logs. |
| **Performance metrics** | Each PTB engine emits latency and confidence-distribution metrics to the Monitoring Engine (PTB Section 6.9) — this is a required output of every engine, not an optional instrumentation add-on. |

---

## 17. Deployment Strategy

| Stage | Standard |
|---|---|
| **Local development** | `docker-compose up` brings up all three apps plus PostgreSQL with synthetic seed data (Constitution §9, §16 — never production data locally). |
| **Docker** | Every app (`web`, `api`, `ai-service`) has its own Dockerfile; images are built in CI, not manually. |
| **Environment variables** | Documented per-service in `infrastructure/`, with no secret values committed — only variable names and non-sensitive defaults. |
| **CI/CD** | GitHub Actions runs lint, type-check, unit tests, and integration tests on every PR; merge to main triggers a build; deployment to any environment beyond local/dev requires the Definition of Done (Section 19) to be fully satisfied. |
| **Production readiness** | No service is considered production-ready until it independently satisfies NFR-002 (Scalability), NFR-003 (Availability), NFR-004 (Security), and NFR-011 (Cloud Readiness) from the SRS — tracked as an explicit release checklist, not assumed by default. |

---

## 18. AI Coding Assistant Rules

This section is binding for every AI coding assistant (Antigravity, Claude Code, Cursor, ChatGPT, or any other tool) operating in this repository. These rules are not suggestions — a violation is treated as a defect in the generated code, exactly as it would be for a human contributor.

1. **Never generate duplicate code.** Before writing a new function, search `packages/shared`, `packages/ui`, and the relevant module's existing services for an equivalent that already exists. If one exists, reuse or extend it — do not create a parallel implementation.
2. **Never bypass architecture.** Respect the Controller → Service → Repository layering (Section 8) and the module boundaries (Section 4) exactly. A change that would require crossing a module boundary without going through its public interface must be flagged for human review, not silently implemented.
3. **Never mix UI and business logic.** Frontend components render; they do not compute priority scores, generate explanations, or apply business rules. Any such logic belongs in `apps/api` or `apps/ai-service`.
4. **Reuse shared components.** UI elements (score displays, confidence badges, explanation panels) must be pulled from `packages/ui`, not recreated per page.
5. **Never hardcode secrets.** No API key, credential, or connection string may appear as a literal value anywhere in generated code, including in test files or comments.
6. **Use existing types before creating new ones.** Check `packages/shared` and `packages/types` before defining a new interface or type — especially for core domain contracts like `FDNAProfile`, `PriorityScore`, and `ExplanationObject`, which must never be redefined inconsistently across apps.
7. **Every API must have validation.** No controller or FastAPI route is generated without a corresponding request validation schema.
8. **Every service must have tests.** Generated business logic (backend services, AI engines) is not complete until accompanying unit tests are also generated, per Section 14.
9. **Ask before changing shared contracts.** Any change to a type or schema in `packages/shared`, `packages/types`, or an AI engine's Input/Output Contract (Section 9) affects multiple consumers — such a change must be flagged explicitly for human confirmation rather than made silently as a side effect of an unrelated task.
10. **Never bypass explainability.** No AI-generated code path may allow a priority score or recommendation to be returned to `apps/api` or `apps/web` without an accompanying, complete Explanation Object (PTB Section 8, BR-003, BR-010) — this is the single most important rule in this section and overrides convenience or task speed.
11. **Never remove human approval paths.** Generated code must never introduce a code path where an AI-service output triggers a customer-facing action without passing through an RM/human review step (Section 9 of the PTB, Constitution §15).
12. **Follow the naming and folder conventions exactly** (Sections 5–6) — do not introduce a new folder-structure pattern "for convenience" within a single feature.
13. **When uncertain, prefer the smallest, most consistent change.** If a task is ambiguous, an AI assistant should implement the interpretation most consistent with existing patterns in the codebase and flag the ambiguity in the PR description, rather than making an assumption that introduces a new pattern.

---

## 19. Definition of Done

A feature — implemented by a human engineer or an AI coding assistant — is complete only when **all** of the following are true:

- [ ] The corresponding SRS requirement(s) are fully implemented, with the requirement ID(s) referenced in the PR description.
- [ ] Unit and integration tests pass, per the coverage expectations in Section 14.
- [ ] Documentation is updated (module docs in `docs/`, inline code comments for non-obvious logic) in the same PR — no deferred documentation debt (Constitution §11).
- [ ] No lint errors, using the shared configuration in `packages/config`.
- [ ] The code is fully type-safe (no `any` types introduced without explicit, reviewed justification).
- [ ] Frontend changes are responsive and meet the accessibility standard (Section 7).
- [ ] The change has been reviewed and approved by at least one other engineer (Section 13), regardless of whether the original author was human or AI-assisted.
- [ ] If the change touches AI-service output, it has passed AI validation tests confirming explainability completeness and BR-001 language safety (Section 14).
- [ ] The change does not violate any Non-Negotiable in Constitution §15.

A feature that satisfies its functional requirement but fails any single item above is **not done** — it is returned for further work, regardless of deadline pressure.

---

## Quality Check Confirmation

- ✓ Repository structure (Section 2) directly supports the PTB engine boundaries scaling into independent services later, without a folder rewrite.
- ✓ AI coding assistant rules (Section 18) are explicit, numbered, and enforceable — not general advice.
- ✓ Folder standards (Section 5) leave no ambiguity about where new code belongs.
- ✓ Every coding standard traces back to a Constitution principle, SRS requirement, or PTB engine definition — nothing here is generic best practice disconnected from this project's governing documents.
- ✓ `apps/web`, `apps/api`, and `apps/ai-service` communicate only through defined interfaces (Section 4, Section 9, Section 11) — no direct cross-app coupling.
- ✓ This document is structured to be directly usable as onboarding and operating instructions for Antigravity or any other AI coding assistant implementing the project.

---

*End of Document — ProspectIQ AI Repository Blueprint & Development Guide*
