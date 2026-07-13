# ProspectIQ AI
> **Explainable AI-Powered Retail Lending Intelligence Platform**
> 
> *An Enterprise Banking Solution built for the official IDBI Bank Innovate Hackathon 2026.*

---

## The Problem
Traditional retail lending operations in commercial banks like IDBI rely heavily on generic CRM systems, passive database records, and legacy credit bureaus. These systems fail to capture real-time financial dynamics, UPI transactional velocities, and behavioral markers, forcing banks to make credit underwriting decisions based on stale, backward-looking parameters. As a result, valuable lending opportunities are missed, customer acquisition costs remain high, and default risks increase due to a lack of deep behavioral analysis.

## The Solution
**ProspectIQ AI** is a state-of-the-art, role-specific, explainable AI platform that transforms passive customer transaction logs into active lending opportunities. By synthesizing UPI transaction streams, salary footprints, cash flow trends, and utility payment signals, the platform computes dynamic creditworthiness scores, estimates repayment multipliers, and identifies prospects qualified for Personal, Home, Auto, and Mortgage Loans. It empowers Relationship Managers with actionable, next-best-step prompts to prudently grow the bank's retail asset portfolio.

## Our Distinction
Unlike standard CRMs that serve as record registers, **ProspectIQ AI** is an active intelligence engine that automatically qualifies opportunities, estimates income and repayment capacities, generates explanations for compliance checks, and monitors portfolio conversion rates in real-time.

---

## Animated Badges
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-398200?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI--Powered-FF6F61?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/IDBI--Hackathon-006A4E?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Table of Contents
* [1. Problem Statement](#1-problem-statement)
* [2. Our Solution](#2-our-solution)
* [3. Architecture Overview](#3-architecture-overview)
* [4. Project Structure](#4-project-structure)
* [5. Technology Stack](#5-technology-stack)
* [6. Core Features](#6-core-features)
* [7. AI Engine Pipeline](#7-ai-engine-pipeline)
* [8. Role-Based Access Control](#8-role-based-access-control)
* [9. Screenshots](#9-screenshots)
* [10. REST API Documentation](#10-rest-api-documentation)
* [11. Database Design](#11-database-design)
* [12. AI Modules Details](#12-ai-modules-details)
* [13. Installation](#13-installation)
* [14. Environment Variables](#14-environment-variables)
* [15. Simulation & Demo Credentials](#15-simulation--demo-credentials)
* [16. Running Tests](#16-running-tests)
* [17. Deployment](#17-deployment)
* [18. Performance & Security](#18-performance--security)
* [19. Product Roadmap](#19-product-roadmap)
* [20. Repository Statistics](#20-repository-statistics)
* [21. Hackathon Alignment Map](#21-hackathon-alignment-map)
* [22. Why ProspectIQ AI Stands Out](#22-why-prospectiq-ai-stands-out)
* [23. Contributors & License](#23-contributors--license)

---

## 1. Problem Statement
The IDBI Bank Innovate Hackathon 2026 problem statement requires building a solution that identifies qualified retail lending prospects using transaction data, behavioral insights, and estimated income/repayment capacity. The ultimate goal is to **improve loan conversion (>30%)** while enabling IDBI to prudently assess borrower viability for:
* **Personal Loans**
* **Home Loans**
* **Mortgage Loans**
* **Auto Loans**

### Why Traditional Systems Fail
1. **Passive CRM Approach**: Standard banking systems store contact logs but do not analyze active data patterns.
2. **Transactional Blindspot**: Bureaus report debt history, but cannot analyze real-time salary stability, transactional velocities, or utility bill timelines.
3. **No Explainable AI**: Black-box AI scores are rejected by credit teams due to compliance regulations (RBI guidelines require transparency).
4. **Poor RM Prioritization**: Relationship Managers spend valuable hours cold-calling unqualified names instead of focusing on verified leads.

---

## 2. Our Solution
**ProspectIQ AI** addresses these gaps through:
* **Explainable AI (ExplainIQ)**: Produces transparent, logic-grounded summaries explaining why each lead qualified.
* **Repayment Estimation (Financial DNA)**: Evaluates salary trends, utility payment consistency, and UPI transactions to build a complete financial profile.
* **Role-Specific Dashboards**: Optimizes workflows for Relationship Managers, Branch Managers, Regional Managers, and HO Admins.
* **Immediate Operational Workflows**: Allows RMs to change opportunity stages, record notes, and track timelines instantly.

---

## 3. Architecture Overview
```mermaid
graph TD
    User([IDBI Bank Employees]) -->|Auth & API Requests| FE[Vite React Client]
    FE -->|HTTP REST JSON| BE[Express Core Service]
    BE -->|Prisma Client| DB[(PostgreSQL DB)]
    BE -->|Inference Requests| AI[FastAPI Inference Service]
    
    subgraph Frontend Client
        FE
        NAV[Desktop Sidebar Layout]
        DASH[Dashboard Dispatcher]
        DIR[Lead Directory Table]
        PIPE[Conversion Workspace Grid]
        ALERTS[Lending Alerts Feed]
    end

    subgraph Backend Services
        BE
        AM[Auth Middleware]
        AC[Audit Controller]
        CC[Customer Controller]
        TC[Task Controller]
    end

    subgraph AI Inference Engines
        AI
        TL[TrustLayer Engine]
        FI[Financial DNA Engine]
        PQ[PriorityIQ Engine]
        EX[ExplainIQ Engine]
        CO[RM CoPilot Engine]
    end
```

---

## 4. Project Structure
```text
ProspectIQ-AI/
├── ai-service/              # FastAPI AI inference server
│   ├── app/                 # FastAPI controllers and routes
│   ├── contracts/           # Pydantic data schemas
│   ├── engines/             # 16 Specialized AI engines (findna, priorityiq, explainiq)
│   ├── main.py              # FastAPI server entry point
│   ├── requirements.txt     # Python requirements file
│   └── tests/               # Pytest integration tests
├── backend/                 # Core API Express.js server
│   ├── prisma/              # Prisma configuration and PostgreSQL schema
│   │   ├── dev.db           # Local database file
│   │   └── schema.prisma    # PostgreSQL tables configuration
│   ├── src/                 # Express source code
│   │   ├── controllers/     # Route logic controllers
│   │   ├── middleware/      # Rate-limiting, auth, and validations
│   │   ├── routes/          # Express routing endpoints
│   │   ├── seed.ts          # Mock databases populator script
│   │   └── index.ts         # Main server startup entry point
│   └── package.json         # Node.js configurations
├── frontend/                # Interactive React client
│   ├── src/                 # React source code
│   │   ├── components/      # UI components (Layout, RMActionCenter)
│   │   ├── contexts/        # React authentication context
│   │   ├── pages/           # Core views (Dashboard, CustomerList, Workspace)
│   │   ├── services/        # API communication functions
│   │   └── index.css        # Centralized IDBI Bank design styles
│   └── package.json         # Vite configuration file
└── shared/                  # Common TypeScript schemas
```

---

## 5. Technology Stack
| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React v18 (Vite) | High performance SPA client rendering |
| **Styling** | Tailwind CSS & Vanilla CSS | Official IDBI Bank color palette and layout styles |
| **Icons** | Lucide React | High-contrast visual icons |
| **Backend Core** | Express.js (Node.js) | Structured REST API wrapper |
| **AI Inference** | FastAPI (Python) | High-speed inference and data synthesis |
| **Database** | PostgreSQL / SQLite | Relational database (Prisma ORM) |
| **Authentication** | JWT | Secure tokens with refresh rotations |
| **Build System** | TypeScript / tsc | Type-safe codebases |

---

## 6. Core Features
1. **Dynamic Dashboard (Role-Based)**: Aggregates metrics and leaderboards for RMs, Branch Managers, Regional Managers, and HO Admins.
2. **Explainable AI (ExplainIQ)**: Displays the rationale behind qualification, detailing UPI transactions, salary trends, and next actions.
3. **Conversion Workspace**: A drag-and-drop column grid tracking prospects through the lending pipeline.
4. **RM Action Center**: A slide-over panel that allows RMs to request documents, schedule meetings, and save notes directly to PostgreSQL.
5. **Lending Alerts (NotificationIQ)**: A real-time feed tracking transactional events and lending eligibility.
6. **Scenario Simulation (SimulationIQ)**: A sandbox allowing RMs to evaluate how changes in salary or debt load impact credit readiness.

---

## 7. AI Engine Pipeline
```mermaid
flowchart TD
    RawData[Raw Banking Records & UPI Logs] --> TL[TrustLayer Engine]
    TL -->|Signal Integrity Verification| BI[BehaviorIQ Engine]
    BI -->|Transactional Velocity Check| FDNA[Financial DNA Profile Engine]
    FDNA -->|Repayment & Multiplier Estimates| PI[PriorityIQ Engine]
    PI -->|AI Qualifying Credit Scoring| RM[RM CoPilot Recommendation]
    RM -->|Next Best Actions & Prompts| NBA[Next Best Action Engine]
    NBA -->|Task Route Management| RI[RelationshipIQ Health Tracker]
    RI -->|Logs & Chronologies| EX[ExplainIQ Audit Engine]
    EX -->|Transaction Evidence| PRED[PredictIQ Risk Engine]
    PRED -->|Churn & Loan Predictions| NI[NotificationIQ Alert Service]
    NI -->|Transaction Alerts| SI[SimulationIQ Sandbox Engine]
    SI -->|Finalized Simulation Data| Frontend[Interactive Vite React Console]
```

---

## 8. Role-Based Access Control
| Role Code | User Context | Home Dashboard Console View | Actions Available |
| :--- | :--- | :--- | :--- |
| **RM** | Priya Sharma, Anil Verma, Sunita Iyer | **RM Console**: Personalized greetings, daily queue, KPI stats, task lists, notifications. | Log notes, update stages, run scenario simulations, view ExplainIQ. |
| **BM** | Sunil Mehta | **Branch Performance Command**: Branch conversion rates, RM leaderboards, stage pipelines. | Monitor branch KPIs, assign tasks to RMs. |
| **REGM** | Amit Shah | **Regional Operations Desk**: Multi-branch analytics, regional conversion indexes, product mix. | View regional trends, compare branch outputs. |
| **ADMIN** | System Admin | **Enterprise Command Center**: Nationwide KPIs, AI model accuracy, database health. | Import customer logs, inspect audit logs, change system configurations. |

---

## 9. Screenshots
*(Placeholder paths for dashboard interfaces)*
* **Login Panel**: `docs/assets/login_page.png`
* **Home Dashboard (RM Console)**: `docs/assets/rm_dashboard.png`
* **Explainability Drawer**: `docs/assets/explainiq_view.png`
* **RM Action Center**: `docs/assets/rm_action_center.png`
* **Kanban Board**: `docs/assets/kanban_grid.png`

---

## 10. REST API Documentation

### Authentication `/api/v1/auth`
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/login` | Authenticate user and issue tokens | No |
| **POST** | `/logout` | Revoke active refresh tokens | No |
| **POST** | `/refresh` | Rotate expired JWT access tokens | No |
| **GET** | `/me` | Retrieve profile of the current logged-in user | Yes |

### Lead Directory `/api/v1/customers`
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Retrieve list of qualified prospects | Yes |
| **POST** | `/import` | Batch upload CSV customer records | Yes (Admin) |
| **GET** | `/:id` | Fetch specific lead details | Yes |
| **GET** | `/:id/analyze` | Request on-the-fly AI qualification | Yes |
| **GET** | `/:id/explain` | Retrieve ExplainIQ compliance metrics | Yes |
| **POST** | `/:id/simulate` | Run scenario check on salary or EMI adjustments | Yes |

### Opportunity Tasks `/api/v1/tasks`
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Fetch active pipeline tasks | Yes |
| **POST** | `/` | Create a new lending opportunity task | Yes |
| **PATCH** | `/:id` | Update opportunity task stage or properties | Yes |
| **POST** | `/:id/comment` | Add comments/notes to opportunity history | Yes |

---

## 11. Database Design
```prisma
model User {
  id           String         @id @default(uuid())
  username     String         @unique
  passwordHash String
  name         String
  roles        UserRole[]
  customers    Customer[]     @relation("UserCustomers")
  tasks        RMTask[]       @relation("RMTasks")
}

model Customer {
  id                String            @id @default(uuid())
  name              String
  occupation        String
  incomeRange       String
  riskCategory      String
  segment           String
  status            String            // ACTIVE, INACTIVE, DORMANT, PROSPECT
  rmId              String
  rm                User              @relation("UserCustomers", fields: [rmId], references: [id])
  accounts          BankAccount[]
  interactions      Interaction[]     @relation("CustomerInteractions")
  tasks             RMTask[]          @relation("CustomerTasks")
}

model BankAccount {
  id            String        @id @default(uuid())
  customerId    String
  accountNumber String        @unique
  accountType   String        // SAVINGS, CURRENT
  balance       Float
  customer      Customer      @relation(fields: [customerId], references: [id])
  transactions  Transaction[]
}

model Transaction {
  id            String      @id @default(uuid())
  bankAccountId String
  amount        Float
  type          String      // DEBIT, CREDIT
  category      String      // UPI, SALARY, UTILITY
  valueDate     DateTime
  bankAccount   BankAccount @relation(fields: [bankAccountId], references: [id])
}

model RMTask {
  id          String        @id @default(uuid())
  customerId  String
  assignedRM  String
  title       String
  priority    String        // HIGH, MEDIUM, LOW
  status      String        // Pending, In Progress, Waiting Customer, Completed
  customer    Customer      @relation("CustomerTasks", fields: [customerId], references: [id])
  rm          User          @relation("RMTasks", fields: [assignedRM], references: [id])
  comments    TaskComment[]
}
```

---

## 12. AI Modules Details
* **TrustLayer**: Validates banking data signals to filter out corrupted fields.
* **Financial DNA**: Analyzes transactional histories to estimate salary stability and repayment limits.
* **PriorityIQ**: Scores prospects based on deposit behaviors, UPI frequencies, and loan eligibility.
* **ExplainIQ**: Translates technical AI weights into plain English compliance narratives.
* **SimulationIQ**: Evaluates how custom adjustments to income or current debt impact loan readiness.
* **NotificationIQ**: Monitors transaction streams to issue immediate eligibility alerts to Relationship Managers.

---

## 13. Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Aditya1708-tech/ProspectIQ-AI.git
cd ProspectIQ-AI
```

### 2. Configure Environment Variables
Create a `.env` file in the backend folder:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prospectiq?schema=public"
PORT=5000
AI_SERVICE_URL="http://127.0.0.1:8000"
JWT_SECRET="super-secret-key-prospect-iq-bank"
```

### 3. Initialize and Seed the Database
```bash
cd backend
npm install
npx prisma db push
npm run seed
```

### 4. Start the Express API Service
```bash
npm run dev
```

### 5. Start the FastAPI AI Service
```bash
cd ../ai-service
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

### 6. Start the React Frontend Console
```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` (or `http://localhost:5174`) in your browser.

---

## 14. Environment Variables

### Backend Configuration (`backend/.env`)
| Key | Default | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Connection string for PostgreSQL database |
| `PORT` | `5000` | Port for Express.js backend |
| `AI_SERVICE_URL` | `http://127.0.0.1:8000` | URL of the FastAPI service |
| `JWT_SECRET` | `super-secret-key` | Key for signing JWT tokens |

---

## 15. Simulation & Demo Credentials
Use the password `password123` for all demo profiles:
* **Priya Sharma** (`priya`) — Relationship Manager (HQ Branch)
* **Sunil Mehta** (`sunil`) — Branch Manager (HQ Branch)
* **Amit Shah** (`amit`) — Regional Manager (Mumbai Region)
* **System Admin** (`admin`) — National Administrator

---

## 16. Running Tests
* **Core API (Express)**: `cd backend && npm run test`
* **AI Service (Python)**: `cd ai-service && pytest`

---

## 17. Deployment
* **Frontend**: Deploy Vite static assets to Vercel or Netlify.
* **Core API**: Deploy Node.js container to Render or AWS Elastic Beanstalk.
* **Database**: Set up database instances using Neon PostgreSQL.
* **Docker Compose**: Start all layers locally using `docker-compose up --build`.

---

## 18. Performance & Security
1. **Stateless AI Design**: AI engines operate as pure stateless math functions.
2. **Rule-Based Grounding**: Prevents hallucinations by mapping predictions directly to transaction data.
3. **Database Security**: Implements type-safe queries using Prisma Client to prevent SQL injection.
4. **Token Security**: Implements JWT short-expiration tokens (15m) alongside secure database refresh tokens.

---

## 19. Product Roadmap
- [x] Integrate multi-role user dashboards.
- [x] Upgrade Lead Table to the RM Action Center Workspace.
- [x] Overhaul columns to use a responsive grid layout.
- [ ] Add real-time Core Banking System integrations.
- [ ] Implement support for multi-branch queues.

---

## 20. Repository Statistics
* **TypeScript Files**: ~42
* **Python Engine Modules**: 16
* **Database Models**: 17
* **API Endpoints**: ~45
* **Vite React Components**: ~32

---

## 21. Hackathon Alignment Map
| IDBI Hackathon Expected Outcome | ProspectIQ AI Feature Implementation |
| :--- | :--- |
| **Prudent Risk Assessment** | TrustLayer and Financial DNA validate transactional data to ensure accurate capacity scores. |
| **Explainable Decisions** | ExplainIQ compiles transparent compliance records for audit checks. |
| **Increased Conversions** | RM CoPilot provides Relationship Managers with Next Best Actions to move leads forward. |

---

## 22. Why ProspectIQ AI Stands Out
| Feature | Traditional CRM | ProspectIQ AI |
| :--- | :--- | :--- |
| **Data Focus** | Contact lists and interaction histories. | Transaction profiles and financial capacities. |
| **Intelligence** | Rule-based sorting and filters. | PredictIQ scoring and behavioral analytics. |
| **Actionable Workflow** | Manual task updates. | RM Action Center with next-best-action prompts. |

---

## 23. Contributors & License
* **Team**: Aditya1708-tech
* **License**: MIT License - see `LICENSE` for details.
* **Acknowledgements**: IDBI Bank Innovate Hackathon 2026.
