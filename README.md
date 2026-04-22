# Repitch – Anonymous Pitch Feedback Tool (Base Stack)

This repository now contains a **runnable base stack** for a self-hosted anonymous pitch feedback tool:

- Next.js + Tailwind frontend/backend shell
- PostgreSQL
- Redis
- Mailpit (local SMTP catcher + inbox UI for email testing)
- SFTP dropbox service for outbound mail handoff (invite + result notifications)

## What is currently implemented

- A running web container (`web`) on port `3000`
- A starter UI at `/` for creating a pitch feedback round (static scaffold)
- A new **SMTP test section** with a **Send test email** button
- A web health endpoint at `/api/health`
- An email test endpoint at `/api/email/test`
- Infrastructure services for Postgres, Redis, Mailpit, and SFTP

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

3. Open the app and tools:

- Frontend: `http://localhost:3000`
- Health API: `http://localhost:3000/api/health`
- Mailpit inbox UI: `http://localhost:8025`

4. Verify containers are healthy:

```bash
docker compose ps
```

5. Stop services:

```bash
docker compose down
```

## SMTP configuration

Yes — SMTP values are required if you want to send real test mails. This repository now includes SMTP variables in `.env.example`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `TEST_EMAIL_TO` (optional fallback recipient)

For local testing, defaults target Mailpit (`SMTP_HOST=mailpit`, `SMTP_PORT=1025`) so you can send test emails without an external SMTP provider.

## Testing SMTP from the UI

1. Open `http://localhost:3000`
2. In the **SMTP test** section, enter recipient email (or set `TEST_EMAIL_TO` in `.env`)
3. Click **Send test email**
4. Check result message in the UI
5. Open Mailpit UI at `http://localhost:8025` to inspect received message

## Troubleshooting first run

If you saw errors such as `POSTGRES_PASSWORD is not specified` or `exec: ::1001: not found`, the cause is usually missing environment variables.

This repository provides compose-level defaults so startup works even without `.env`. You can still set explicit values in `.env` for local consistency and safer credentials.

If you are on Apple Silicon (`arm64`) and use the `atmoz/sftp` image, Compose will run it using `linux/amd64` emulation by default (`SFTP_PLATFORM=linux/amd64`).

## Services

- `web`: Next.js app shell with starter pages and test email trigger
- `postgres`: main relational database
- `redis`: background queue backend
- `mailpit`: local SMTP test server and inbox viewer
- `sftp`: secure file-drop endpoint for outbound mail jobs/artifacts

## Proposed next step

- Wire metadata form submission to Postgres
- Add invite token generation and participant questionnaire flow
- Add deadline job + synthesis/export job pipeline

## SFTP mail handoff model

Because direct email API usage may not be desired in production, the app can create files in an SFTP outbox, for example:

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
