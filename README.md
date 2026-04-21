# ☁️ Cloud Native Project Management System

A lightweight, production-ready 3-tier project management app containerized with Docker Compose.

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend       │────▶│   Backend        │────▶│   PostgreSQL     │
│  React + Vite    │     │  Node + Express  │     │  (port 5432)     │
│  nginx (port 80) │     │  (port 5000)     │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
     :3000 (host)             :5000 (host)
```

## Quick Start

```bash
git clone <repo>
cd projectman
docker-compose up --build
```

Then open **http://localhost:3000**

## Features

- **Projects** — Create, update status, delete projects
- **Tasks** — Create tasks with priority, assignee, status; linked to projects
- **Dashboard** — At-a-glance stats and recent activity
- **Inline status updates** — Change status directly from cards
- **Healthchecks** — Services start in correct dependency order

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project + tasks |
| GET | /api/tasks | List tasks (optional ?projectId=) |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Local Dev (without Docker)

```bash
# Start DB
docker run -e POSTGRES_DB=projectman -e POSTGRES_USER=projectman \
  -e POSTGRES_PASSWORD=securepassword -p 5432:5432 postgres:15-alpine

# Backend
cd backend && npm install && node server.js

# Frontend
cd frontend && npm install && npm run dev
```

## Extend It

- Add JWT authentication
- Add Kubernetes manifests (Deployments, Services, Ingress)
- CI/CD with GitHub Actions
- Deploy to AWS ECS / GCP Cloud Run / Azure Container Apps