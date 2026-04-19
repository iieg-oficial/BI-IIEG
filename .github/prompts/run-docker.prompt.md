---
description: "Run the BI-IIEG project from scratch with Docker Compose: build images, start all services, verify health."
agent: "agent"
tools: [execute, read, search]
---

Start the BI-IIEG project from scratch using Docker Compose. Execute the following steps sequentially in the terminal. Stop on any failure and report the error.

## Step 1: Ensure .env Exists

Check that `deploy/.env` exists. If it doesn't, copy from the example:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/deploy
[[ -f .env ]] || cp .env.example .env
```

## Step 2: Build Images

Build all Docker images from scratch:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/deploy
docker compose build --no-cache
```

If the build fails, report the full error and stop.

## Step 3: Start Services

Bring up all services in detached mode:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/deploy
docker compose up -d
```

## Step 4: Verify Health

Wait for services to stabilize, then check status:

```bash
cd /home/zamax/Documents/Repos/personal/subagents/deploy
docker compose ps
```

All services must be running or healthy. The `seed` service should have exited successfully (`Exited (0)`).

Run a backend smoke test:

```bash
curl -s http://localhost:8000/
```

Expected: `{"status":"ok"}`

## Step 5: Report

Present a summary of service status:

| Service  | Status   | Port          |
|----------|----------|---------------|
| db       | healthy  | localhost:5432 |
| back     | running  | localhost:8000 |
| front    | running  | localhost:5173 |
| seed     | exited 0 | —              |

If any service is not healthy, show `docker compose logs <service>` for that service and diagnose the issue.
