# E-Commerce Multi-Agent Pipeline — Project Guidelines

## Overview

This workspace uses a **multi-agent pipeline** to build an e-commerce application. Each agent has a single responsibility and must not perform tasks assigned to other agents.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Containerization | Docker / Docker Compose |
| Testing | Playwright (browser UI tests) |

## Project Structure

```
project-root/
├── .github/
│   ├── copilot-instructions.md      # This file — read first by every agent
│   ├── agents/                       # Agent definitions
│   └── prompts/                      # Orchestrator prompt
├── requirements/                     # Output from Requirement Agent
│   ├── functional-requirements.md
│   └── schema.sql
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   └── routers/
│   ├── requirements.txt
│   └── Dockerfile
├── database/                         # Database setup
│   ├── init.sql                      # DDL from Requirement Agent
│   ├── seed.sql                      # Mock data
│   └── Dockerfile
├── frontend/                         # React application
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── tests/                            # Test cases and reports
│   ├── e2e/
│   └── test-report.xlsx
├── docker-compose.yml
└── README.md
```

## Pipeline Execution Order

```
User Requirement
      │
      ▼
┌─────────────────┐
│ Requirement Agent│
└────────┬────────┘
         │ produces: functional-requirements.md + schema.sql
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│Backend │ │ Database  │    ← run in parallel
│ Agent  │ │  Agent    │
└───┬────┘ └──────────┘
    │ APIs ready
    ▼
┌──────────┐
│ Frontend │
│  Agent   │
└────┬─────┘
     │ UI ready
     ▼
┌──────────┐
│ Tester   │
│  Agent   │
└──────────┘
```

## Agent Rules

1. **Read this file first** — Every agent must read `.github/copilot-instructions.md` before starting work.
2. **Single responsibility** — Each agent performs ONLY its assigned tasks. No overlap.
3. **Handoff protocol** — After completing work, an agent must explicitly invoke the next agent(s) in the pipeline.
4. **File ownership** — Agents write only to their designated directories.
5. **No skipping** — Agents must not bypass the pipeline order.

## Conventions

- Use snake_case for Python files and variables.
- Use PascalCase for React components.
- All API endpoints use `/api/v1/` prefix.
- Database table names use snake_case, singular form.
- Every API must have proper error handling and HTTP status codes.
- Docker services must be defined in `docker-compose.yml`.
