# Repitch – Anonymous Pitch Feedback Tool (Base Stack)

This repository now contains a **runnable base stack** for a self-hosted anonymous pitch feedback tool:

- Next.js + Tailwind frontend/backend shell
- PostgreSQL
- Redis
- SFTP dropbox service for outbound mail handoff (invite + result notifications)

## What is currently implemented

- A running web container (`web`) on port `3000`
- A starter UI at `/` for creating a pitch feedback round (static scaffold)
- A web health endpoint at `/api/health`
- Infrastructure services for Postgres, Redis, and SFTP

> Important: This is still a scaffold. The metadata form is not wired to persistence yet, and invites/report generation are not implemented.

## Quick start (local)

1. Copy environment file (recommended, optional because `docker-compose.yml` includes safe defaults):

```bash
cp .env.example .env
```

2. Build and start all services:

```bash
docker compose up -d --build
```

3. Open the app:

- Frontend: `http://localhost:3000`
- Health API: `http://localhost:3000/api/health`

4. Verify containers are healthy:

```bash
docker compose ps
```

5. Stop services:

```bash
docker compose down
```

## Troubleshooting first run

If you saw errors such as `POSTGRES_PASSWORD is not specified` or `exec: ::1001: not found`, the cause is usually missing environment variables.

This repository now provides compose-level defaults so startup works even without `.env`. You can still set explicit values in `.env` for local consistency and safer credentials.

If you are on Apple Silicon (`arm64`) and use the `atmoz/sftp` image, Compose will run it using `linux/amd64` emulation by default (`SFTP_PLATFORM=linux/amd64`).

## Services

- `web`: Next.js app shell with starter pages
- `postgres`: main relational database
- `redis`: background queue backend
- `sftp`: secure file-drop endpoint for outbound mail jobs/artifacts

## Proposed next step

- Wire metadata form submission to Postgres
- Add invite token generation and participant questionnaire flow
- Add deadline job + synthesis/export job pipeline

## SFTP mail handoff model

Because direct email API usage is not desired, the app should create files in an SFTP outbox, for example:

- `outbox/invite-batch-<timestamp>.json`
- `outbox/final-report-<pitch-id>.json`

An internal mail relay process (outside this repo, or a later container) can consume these files and send emails through company-approved channels.

## Security and privacy principles (implementation target)

- Strict anonymity by separating invite identity from response content
- Token hashing for invite links (no plaintext token storage)
- Data minimization for personal data
- Configurable retention and deletion windows
- Audit logs for creator-side actions only

For full details see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
