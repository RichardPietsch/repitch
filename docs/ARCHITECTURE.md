# Architecture baseline

## 1) Scope and assumptions

- Usage volume: low (2–4 pitches/month, 5–10 participants/pitch)
- Hosting: self-hosted
- Anonymity: strict anonymous participant responses
- Deadline: creator-defined response deadline
- Export: file output for Confluence import/copy-paste
- Outbound notifications: SFTP handoff model

## 2) Components

1. **Web App** (planned)
   - Creator flow: create pitch metadata, manage invites, set deadline
   - Participant flow: anonymous questionnaire via tokenized link
2. **PostgreSQL**
   - Stores pitch metadata, invite records, deadlines, synthesized reports metadata
3. **Redis**
   - Queue support for scheduling reminders, deadline jobs, synthesis jobs
4. **SFTP service**
   - Receives machine-readable outbound message jobs and generated report package notifications

## 3) Data model strategy for strict anonymity

Use a split model:

- **Identity-side table** (`participant_invites`): contains email + invite status
- **Response-side table** (`feedback_responses`): contains answers only, no direct personal identifier
- **Link table** between identity and response should be ephemeral and deleted after aggregation window where possible

Recommended privacy behaviors:

- Store invite token hash only
- Expire token at deadline
- One-time submission lock per token
- Avoid storing IP/user-agent unless strictly required for abuse prevention

## 4) Processing flow

1. Creator sets up pitch + participant emails + deadline
2. System creates invite tokens, stores token hashes, emits SFTP invite-job file
3. Participant accesses link and submits 5-question response anonymously
4. On completion condition (`all_submitted` OR `deadline_reached`):
   - Aggregate responses
   - Trigger AI synthesis
   - Emit report export files (Markdown, CSV)
   - Emit SFTP creator-notification file

## 5) GDPR-focused baseline controls (Germany/EU target)

- Data minimization and purpose limitation by design
- Separation of identity data and content data
- Configurable retention policy:
  - invite identities deleted/anonymized after fulfillment window
  - responses retained only as long as needed for learning history
- Export/delete rights process (controller operations)
- Encryption in transit (TLS) and at rest where feasible
- Access controls and admin audit trail
- Processing activity documentation (RoPA) outside codebase

> Note: This is a technical baseline, not legal advice. A legal/privacy review is still required before production use.

## 6) Initial implementation recommendation

- Monorepo with Next.js app (`apps/web`) and worker (`apps/worker`)
- Prisma migrations managed in app repo
- BullMQ for scheduled/deferred jobs
- Markdown + CSV exports in first release
