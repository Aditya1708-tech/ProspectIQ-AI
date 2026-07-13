# Architectural Decisions — Sprint 3: Customer Intelligence Foundation

This document details the architectural decisions and technical choices made during the implementation of Sprint 3.

---

## 1. In-Memory File Processing (Multer Memory Storage)
* **Context**: We need to ingest customer directories from JSON and CSV uploads. Storing these files temporarily on disk can lead to data residue, filesystem permission failures (especially on Windows), and security compliance issues.
* **Decision**: We utilize `multer.memoryStorage()`. Incoming file uploads are processed entirely inside volatile RAM memory buffers (`file.buffer`). Once parsed, the raw buffer is discarded and garbage-collected. No transactional banking records are ever written to the local disk.

## 2. In-Memory Quotes-Aware CSV Parser
* **Context**: External CSV files can contain commas within text cells (e.g. `"120, Street Name"`) or escaped quotes. Standard string-split algorithms fail on these.
* **Decision**: Written a custom, lightweight stream tokenizer in `ImportService` that parses characters sequentially, respects double-quote boundaries, and processes cellular comma divisions without third-party library overhead.

## 3. Flexible Header Mapping & Normalization Layer
* **Context**: Bank directories can have column headers that do not match our database model keys (e.g. `"Mobile Phone"` instead of `"phone"`, `"Full Name"` instead of `"name"`).
* **Decision**: Implemented a two-tiered mapping approach:
  1. **Header Normalizer**: An automatic mapping utility in `ImportService` that strips whitespaces and special characters, converting headers to lowercase to match common variants (like `"mobile"` -> `"phone"`).
  2. **JSON Mapping Override**: Allows administrators to submit a `columnMapping` JSON object payload during uploads to map custom column headers directly to database fields.

## 4. Relational Product Holdings Modeling
* **Context**: Customers hold multiple active banking products (Mutual Funds, Home Loans, etc.) that will be consumed later by the AI Recommendation Engine.
* **Decision**: Modeled product holdings as a separate relational table (`ProductHolding`) connected via foreign keys, rather than serialized string arrays on the `Customer` table. This preserves third normal form relational integrity and allows index queries on holdings.

## 5. Soft-Delete Architecture Scoping
* **Context**: Compliance requirements demand soft-deletion capabilities.
* **Decision**: Appended a nullable `deletedAt` DateTime column to the `Customer` table. To enforce this, all repository queries (`findById`, `findAll`, `findProfileById`) are scoped to include `deletedAt: null`. Hard deletes are never executed on core domain data.

---

# Architectural Decisions — Sprint 7: RM Co-Pilot & Intelligent Briefing
* **Rule-Based Deterministic Co-Pilot**: Implemented as a stateless rules engine in Python that generates briefings and starters in under 1ms. This ensures zero risk of hallucination and maintains complete explainability for bank auditors.
* **Word-Count-Bounded Briefings**: Designed deterministic executive summary templates that construct sentences programmatically, guaranteeing word counts strictly between 120 and 180 words.

---

# Architectural Decisions — Sprint 8: Portfolio Intelligence & Command Center
* **Stateless Batch Inference**: Designed a batch endpoint `POST /portfolio/analyze` in FastAPI. Instead of querying the database directly, the Express backend fetches all customer logs from PostgreSQL and forwards them to uvicorn in a single payload. Uvicorn executes individual client pipelines sequentially in memory in under 30ms, meeting the <250ms SLA.
* **Inline SVG Widgets**: Built circular gauges and timeline sparklines using custom SVG path rendering instead of adding heavy charting libraries. This keeps the bundle lightweight, renders instantly, and is highly responsive.

---

# Architectural Decisions — Sprint 9: Explainable AI & Audit Engine
* **Deterministic Rule-Based Explainability**: To comply with strict banking regulations and the "no-LLM, no external AI" constraints, ExplainIQ is implemented as a rule-based analyzer that maps existing scoring parameters directly to positive/negative factors and templates, avoiding any risks of hallucination.
* **SHA-256 Digest Audit Record**: Generates immutable audit records verified with a SHA-256 hash. The signature digest is computed programmatically based on the customer ID, execution timestamp, engine compiler versions, and composite score outputs. Any variance in inputs or scores results in a distinct audit signature.
* **Zero-Reload Overlay Navigation**: Designed as a sliding sidebar drawer component (`ExplainDrawer`) triggered globally by clicking any score badge. This allows relationship managers to drill down into explainability details from anywhere in the application without losing page context.
* **Direct Sub-Section API Routing**: Exposes five dedicated API endpoints (explain, audit, timeline, evidence, confidence) by querying uvicorn and mapping specific sub-fields, enabling micro-resource caching and efficient backend query recycling.
