# Cloud Native 3‑Tier Project Management System

A lightweight, cloud‑native project and task management system built with a **3‑tier architecture**:

- **Presentation Tier**: React frontend (Vite) served via nginx.
- **Logic Tier**: Node.js + Express REST API.
- **Data Tier**: PostgreSQL database.

All services are containerized and orchestrated with Docker Compose, making it easy to deploy locally or in any cloud environment.

## Running locally

1. Clone the repo.
2. At the root, run:
   ```bash
   docker-compose up --build
   ```
3. Open:
   - Frontend: http://localhost:3000
   - Backend health: http://localhost:5000/api/health

## Features

- Create and list projects.
- Create and list tasks.
- Cloud‑native, containerized design inspired by modern DevOps patterns.

Use this as a foundation and extend it with auth, CI/CD, Kubernetes manifests, or cloud‑vendor deployments (AWS, GCP, Azure).
