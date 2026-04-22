# Repitch – Anonymous Pitch Feedback Tool (Base Stack)

This repository contains the **base technical setup** for a self-hosted tool that collects strict-anonymous participant feedback for pitch retrospectives.

## What is included in this base setup

- Containerized local runtime with Docker Compose
- PostgreSQL for persistent storage
- Redis for background jobs/queues
- SFTP dropbox service for outbound mail handoff (invite + result notifications)
- Environment template and architecture notes for GDPR-oriented implementation

> Important: This is a base infrastructure setup only. Application code and UI are intentionally not implemented yet.

## Why this stack

- Small expected scale (2–4 pitches/month, 5–10 participants each)
- Self-hosted deployment preference
- Strict anonymity requirement
- Deadline-based collection and report generation
- German/EU GDPR-conscious target environment

## Quick start (local)

1. Copy environment file (recommended, optional because `docker-compose.yml` includes safe defaults):

```bash
cp .env.example .env
```

2. Start infrastructure:

```bash
docker compose up -d
```

3. Verify containers are healthy:

```bash
docker compose ps
```

4. Stop services:

```bash
docker compose down
```

## Troubleshooting first run

If you saw errors such as `POSTGRES_PASSWORD is not specified` or `exec: ::1001: not found`, the cause is usually missing environment variables.

This repository now provides compose-level defaults so startup works even without `.env`. You can still set explicit values in `.env` for local consistency and safer credentials.

If you are on Apple Silicon (`arm64`) and use the `atmoz/sftp` image, Compose will run it using `linux/amd64` emulation by default (`SFTP_PLATFORM=linux/amd64`).

## Services

- `postgres`: main relational database
- `redis`: background queue backend
- `sftp`: secure file-drop endpoint for outbound mail jobs/artifacts

## Proposed app stack (next step)

- Next.js + Tailwind CSS (UI + API routes)
- Prisma ORM
- Background worker (BullMQ + Redis)
- Report export as Markdown + CSV for Confluence copy/import

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
