---
description: "Run the BI-IIEG project locally from scratch: PostgreSQL via Docker, backend with conda, frontend with npm."
agent: "agent"
tools: [execute, read, search]
---

Start the BI-IIEG project locally from scratch. Execute the following steps sequentially in the terminal. Stop on any failure and report the error.

## Step 1: Database (Docker)

Start only the PostgreSQL database via Docker Compose:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/deploy
docker compose up -d db
```

Wait until the `db` service is healthy:

```bash
docker compose ps db
```

If not healthy yet, wait a few seconds and check again.

## Step 2: Run Migrations and Seed

Run the init-db script against the Docker database. Adapt the host to `localhost` since we're running outside compose:

```bash
cd /home/zamax/Documents/Repos/personal/subagents
# Source env values from deploy/.env (or use defaults)
export POSTGRES_USER=bi_iieg
export POSTGRES_PASSWORD=changeme
export POSTGRES_DB=bi_iieg

# Run each migration
for f in back/migrations/0*.sql; do
  PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
done

# Create dummy_data database
PGPASSWORD="$POSTGRES_PASSWORD" psql -h localhost -U "$POSTGRES_USER" -d postgres -f back/migrations/seed_dummy_data.sql

# Run Python seeder
cd back && conda run -n bi-iieg python seed.py
```

## Step 3: Backend (conda + uvicorn)

Start the FastAPI backend with hot-reload using the `bi-iieg` conda environment:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/back
conda run -n bi-iieg --no-banner uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Run this in **async mode** — the server must stay running.

Verify the backend is responding:

```bash
curl -s http://localhost:8000/
```

Expected: `{"status":"ok"}`

## Step 4: Frontend (npm + vite)

Install dependencies and start the Vite dev server:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/front
npm install
npm run dev
```

Run this in **async mode** — the server must stay running.

## Step 5: Confirm

Report that all three services are running:
- **DB**: PostgreSQL on `localhost:5432`
- **Backend**: FastAPI on `http://localhost:8000`
- **Frontend**: Vite on `http://localhost:5173`
