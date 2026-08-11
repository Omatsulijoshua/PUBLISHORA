# 🌐 PUBLISHORA — Next-Generation Global Enterprise Academic Publishing Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)](https://github.com/Omatsulijoshua/PUBLISHORA)
[![Tests](https://img.shields.io/badge/Jest_Tests-146%20Passed-blue?style=for-the-badge&logo=jest)](https://github.com/Omatsulijoshua/PUBLISHORA)
[![Test Suites](https://img.shields.io/badge/Test_Suites-46%20Passed-indigo?style=for-the-badge&logo=jest)](https://github.com/Omatsulijoshua/PUBLISHORA)
[![Frontend](https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Backend](https://img.shields.io/badge/NestJS-10.3-red?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![Database](https://img.shields.io/badge/Prisma-6.3-cyan?style=for-the-badge&logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

**PUBLISHORA** is a production-ready, full-stack enterprise global academic publishing platform and scholarly preparation ecosystem. Built across 45 comprehensive feature phases, it provides end-to-end authoring, peer review, persistent identifier minting, open access distribution, RAG AI literature synthesis, COUNTER R5 / SUSHI reporting, scientometrics, and administrative press load balancing.

---

## 🏛️ System Architecture

PUBLISHORA is structured as a multi-application monorepo containing three core tiers:

```
PUBLISHORA/
├── frontend/             ← User & Author Platform (Next.js 14 App Router • Port 3000)
├── admin/                ← Executive Super-Admin Console (Next.js 14 App Router • Port 3001)
├── backend/              ← Shared Modular Microservices API Server (NestJS • Port 4000)
├── prisma/               ← Shared Database Schema & Migration Engine (SQLite/PostgreSQL)
└── package.json          ← Monorepo Root Script Runner
```

---

## 🌟 Core Highlights & Feature Engines

### 1. 🛡️ Dynamic Dual-Operating Modes Architecture
PUBLISHORA enforces strict compliance based on regional press availability:
- **Preparation Mode**: Activated when press publishing is unavailable in a user's region. Enables full manuscript creation, AI proofreading, multi-format export (JATS XML, EPUB, PDF, BibTeX), and bibliography management **without issuing fake DOIs, ISBNs, or ISSNs**.
- **Publishing Mode**: Activated when official press publishing is available. Enables Crossref 5.3 DOI registration, KDP/IngramSpark POD ISBNs, serial ISSN issuance, and PubMed Central XML deposits.

### 2. 🔀 AI Router & Multi-Key Load Balancer Engine
Admin-configurable load balancer allowing **comma-separated API keys per provider** (e.g., 2+ Groq keys + 2+ Gemini keys) to maximize free AI quotas:
- **Comma-Separated Pooling**: Enter multiple keys per provider (e.g. `gsk_key1, gsk_key2` and `AIzaSy_key1, AIzaSy_key2`).
- **Round-Robin Rotation**: Sequentially rotates requests across available keys in the pool.
- **Automated 429 Rate-Limit Failover**: Automatically switches keys or fails over to fallback providers (Groq ➔ Gemini ➔ OpenAI ➔ Anthropic ➔ Mistral) on HTTP 429 errors without dropping user requests.

### 3. 🤖 AI Literature Synthesis & RAG Research Assistant (`/ai-synthesis`)
- **Scholarly RAG Query Engine**: Grounded Q&A over 10M+ manuscripts with inline paragraph citations (`[Vance et al., 2026]`).
- **PRISMA 2020 Flow Generator**: Automated Systematic Literature Review (SLR) flow diagrams tracking Identification, Screening, Eligibility, and Inclusion.
- **Claim Contradiction Detector**: Fact vs. speculation matrix identifying conflicting research findings across selected papers.

### 4. 📊 COUNTER Release 5 & SUSHI Reporting Engine (`/analytics-r5`)
- **COUNTER Code of Practice R5**: Automated TR_J1 (Journal Requests), TR_B1 (Book Requests), and IR (Item Reports).
- **SUSHI Protocol v5.0 REST Server**: Standardized API endpoint (`/api/v1/sushi/r5/reports/tr_j1`) for institutional library harvesting.
- **Readership Geographic Heatmap**: Global country-level readership breakdown (ISO 3166-1).
- **Cost-Per-Download (CPD) Calculator**: Institutional ROI and subscription download cost metrics.

### 5. 📈 Journal Impact Metrics & Scientometrics Engine (`/journal-metrics`)
- **Journal Impact Factor (JIF)**: 2-Year and 5-Year JIF calculations.
- **SCImago Journal Rank (SJR) & Eigenfactor**: PageRank-based centrality vector scoring.
- **Altmetric Attention Score**: News, blog, policy document, and social mention aggregator.
- **Field-Weighted Citation Impact (FWCI)**: Subject discipline normalized citation metrics.

### 6. 🎖️ Peer Reviewer Recognition & ORCID Credit Engine (`/reviewer-credit`)
- **ORCID API v3.0 XML Peer Review Deposit**: Automated XML payload generation for ORCID profiles.
- **Verified Reviewer Certificates**: Web of Science / Publons compliant certificate generator.
- **APC Discount Credit Ledger**: Reviewer points ledger redeemable for Article Processing Charge discounts.

### 7. 📁 Research Data Repositories & FAIR Audit (`/data-deposits`)
- **Dryad / Figshare / Zenodo REST Connectors**: Automated dataset deposit package builder.
- **DataCite 4.4 Schema XML Generator**: Schema-compliant metadata XML builder.
- **0–100 FAIR Data Principles Auditor**: Automated Findable, Accessible, Interoperable, and Reusable audit engine.

### 8. 📜 Grant Compliance & Plan S Rights Retention (`/funder-compliance`)
- **Plan S Rights Retention Strategy (RRS)**: Author Accepted Manuscript (AAM) CC-BY mandate auditor.
- **NIH Public Access Policy Validator**: Automated PMC deposit mandate checker.
- **Crossref FundRef Registry Resolver**: Funder ID resolution (`dx.doi.org/10.13039/...`).

---

## 📋 Complete 45-Phase Master Directory

| Phase | Module Name | Backend Service & Controller | Route / Portal |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Multi-Tenant Platform Architecture | `AuthService`, `AuthController` | `/` |
| **Phase 2** | Regional Availability & Press Matrix | `AvailabilityService`, `AvailabilityController` | `/availability` |
| **Phase 3** | Dual Operating Modes Enforcement | `ModesService`, `OnboardingController` | `/onboarding` |
| **Phase 4** | Multi-Format Authoring & Editor | `PublicationsService`, `PublicationsController` | `/editor` |
| **Phase 5** | Live Document Collaboration & Versioning | `DocumentsService`, `DocumentsController` | `/collaborate` |
| **Phase 6** | AI Proofreading & Fact Verification | `AiService`, `AiController` | `/ai-assistant` |
| **Phase 7** | Reference Manager & Crossref DOI Resolver | `ReferencesService`, `ReferencesController` | `/references` |
| **Phase 8** | Plagiarism & AI Integrity Audit | `IntegrityService`, `IntegrityController` | `/integrity` |
| **Phase 9** | Multi-Format Exporter (JATS XML, EPUB, PDF) | `ExportService`, `ExportController` | `/export` |
| **Phase 10** | Journal Setup & Scope Manager | `JournalsService`, `JournalsController` | `/journals` |
| **Phase 11** | Manuscript Intake & Editorial Screener | `SubmissionsService`, `SubmissionsController` | `/submissions` |
| **Phase 12** | Peer Review Workflow Engine | `ReviewsService`, `ReviewsController` | `/peer-review` |
| **Phase 13** | Persistent Identifiers (DOI, ISBN, ISSN) | `IdentifiersService`, `IdentifiersController` | `/identifiers` |
| **Phase 14** | Dynamic Production Pipeline & Proofing | `ProductionService`, `ProductionController` | `/production` |
| **Phase 15** | Open Access Content Distribution & OAI-PMH | `DistributionService`, `DistributionController` | `/distribution` |
| **Phase 16** | Verification Portal & Blockchain Badges | `VerificationService`, `VerificationController` | `/verification` |
| **Phase 17** | Academic Promotion & Tenure Dossier | `PromotionService`, `PromotionController` | `/promotion` |
| **Phase 18** | Grant Tracking & Funder Mandates | `GrantsService`, `GrantsController` | `/grants` |
| **Phase 19** | Institutional Library Consortium Portal | `LibraryService`, `LibraryController` | `/library` |
| **Phase 20** | Article Metrics & Altmetrics Processor | `MetricsService`, `MetricsController` | `/metrics` |
| **Phase 21** | Academic E-Reader & Personal Library | `ReaderService`, `ReaderController` | `/reader` |
| **Phase 22** | Collaborative Labs & Discussion Rooms | `LabsService`, `LabsController` | `/labs` |
| **Phase 23** | Conference Proceedings & Event Manager | `ConferencesService`, `ConferencesController` | `/conferences` |
| **Phase 24** | Monograph & Multi-Volume Book Engine | `BooksService`, `BooksController` | `/books` |
| **Phase 25** | Open Access Preprint Server & VOR Linker | `PreprintsService`, `PreprintsController` | `/preprints` |
| **Phase 26** | Post-Publication Peer Review (PPPR) | `PpprService`, `PpprController` | `/pppr` |
| **Phase 27** | Custom Domains & White-Labeling | `TenantsService`, `TenantsController` | `/tenants` |
| **Phase 28** | Universal Academic Search & Graph | `SearchService`, `SearchController` | `/search` |
| **Phase 29** | Security Compliance, Audit Logs & GDPR | `SecurityService`, `SecurityController` | `/security` |
| **Phase 30** | Disaster Recovery & Failover Engine | `DisasterRecoveryService`, `DisasterRecoveryController` | `/disaster-recovery` |
| **Phase 31** | APC Billing & Author Royalties Engine | `BillingService`, `BillingController` | `/billing` |
| **Phase 32** | Readership Analytics & Heatmaps | `AnalyticsService`, `AnalyticsController` | `/analytics` |
| **Phase 33** | Open Research Datasets & DataCite 4.4 | `DatasetsService`, `DatasetsController` | `/datasets` |
| **Phase 34** | Multilingual Translation & i18n | `LocalizationService`, `LocalizationController` | `/localization` |
| **Phase 35** | Offline-First PWA & Low-Bandwidth Mode | `OfflineService`, `OfflineController` | `/offline` |
| **Phase 36** | Open API Portal & Developer Ecosystem | `DevelopersService`, `DevelopersController` | `/developers` |
| **Phase 37** | Performance Optimization & CDN Purging | `PerformanceService`, `PerformanceController` | `/performance` |
| **Phase 38** | Journal Impact Metrics, SJR & Altmetrics | `JournalMetricsService`, `JournalMetricsController` | `/journal-metrics` |
| **Phase 39** | Reviewer Recognition & ORCID Credit | `ReviewerCreditService`, `ReviewerCreditController` | `/reviewer-credit` |
| **Phase 40** | Data Repositories & Dryad / Figshare | `DataDepositsService`, `DataDepositsController` | `/data-deposits` |
| **Phase 41** | Grant Compliance & Plan S Engine | `FunderComplianceService`, `FunderComplianceController` | `/funder-compliance` |
| **Phase 42** | Universal Search & Semantic Scholar Vector | `UniversalSearchService`, `UniversalSearchController` | `/universal-search` |
| **Phase 43** | Platform Analytics & COUNTER R5 Engine | `CounterR5Service`, `CounterR5Controller` | `/analytics-r5` |
| **Phase 44** | AI Literature Synthesis & RAG Assistant | `AiSynthesisService`, `AiSynthesisController` | `/ai-synthesis` |
| **Phase 45** | System Health Audit & Launch Readiness | `SystemHealthService`, `SystemHealthController` | `/system-health` |
| **Admin App**| Executive Super-Admin Console & AI Router | `AiRouterService`, `AiRouterController` | `http://localhost:3001` |

---

## 💻 Installation & Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30 or higher

### 1. Clone Repository
```bash
git clone https://github.com/Omatsulijoshua/PUBLISHORA.git
cd PUBLISHORA
```

### 2. Install Monorepo Dependencies
```bash
# Install root dependencies
npm install

# Install Frontend dependencies
cd frontend && npm install && cd ..

# Install Admin dependencies
cd admin && npm install && cd ..

# Install Backend dependencies
cd backend && npm install && cd ..
```

### 3. Initialize Prisma Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Launch Development Servers

You can launch all applications in separate terminal windows:

```bash
# Terminal 1 — Backend API Server (Port 4000)
npm run dev:backend

# Terminal 2 — User Platform Frontend (Port 3000)
npm run dev:frontend

# Terminal 3 — Super-Admin Console (Port 3001)
npm run dev:admin
```

---

## 🧪 Testing & Verification

### Run Backend Jest Unit Tests (46 Suites, 146 Tests)
```bash
npm run test:backend
```

Output:
```
Test Suites: 46 passed, 46 total
Tests:       146 passed, 146 total
Snapshots:   0 total
Time:        26.284 s
```

### Run TypeScript Type Checks
```bash
# Check Frontend
cd frontend && npx tsc --noEmit && cd ..

# Check Admin
cd admin && npx tsc --noEmit && cd ..

# Check Backend
cd backend && npx tsc --noEmit && cd ..
```

---

## 🔗 Key REST API Endpoints Reference

Base URL: `http://localhost:4000/api/v1`

- `GET  /api/v1/system-health/audit` — System-wide 45-module health check
- `GET  /api/v1/sushi/r5/reports/tr_j1` — COUNTER Release 5 TR_J1 SUSHI JSON report
- `POST /api/v1/ai-router/config` — Configure comma-separated multi-key AI pools & load balancing
- `POST /api/v1/ai-router/test-rotation` — Simulate multi-key round-robin rotation
- `POST /api/v1/ai-synthesis/rag-query` — Execute grounded RAG query with inline citations
- `GET  /api/v1/journal-metrics/:journalId` — Fetch 2Y/5Y JIF, SJR, and Altmetric scores
- `GET  /api/v1/funder-compliance/fundref/:funderId` — Crossref FundRef funder lookup

---

## 📄 License & Ownership

Built for **PUBLISHORA Press Global Platform**. All rights reserved.

Created by **[Omatsulijoshua](https://github.com/Omatsulijoshua)**.
