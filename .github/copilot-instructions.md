# MessageFlow – Copilot Instructions

These instructions guide GitHub Copilot and Copilot Chat to generate consistent, production‑ready changes for this repository.

## Project intent
- Build a modern SMS & RCS messaging platform with a clean dashboard, Twilio integration, and a robust data model.
- Prioritize authentication, DB‑backed CRUD for contacts/templates/campaigns, message history, and real analytics before advanced features.

## Tech stack and constraints
- Framework: Next.js 15 (App Router). Do not add Pages Router.
- Language: TypeScript. Prefer strict types and explicit return types for public functions.
- Styling/UI: Tailwind CSS + Radix UI + existing components in `src/components`.
- Backend: Next.js route handlers under `src/app/api/**` using `NextRequest`/`NextResponse`.
- DB: Prisma ORM (`@prisma/client`) with SQLite dev; design for Postgres compatibility.
- Validation: zod for all request/response validation.
- Telephony: Twilio Node SDK only; no external SMS/RCS providers.
- Date utils: date-fns.
- Node: 18+.
- Package policy: Prefer existing deps; add new ones only when essential and pin versions.

## Paths, imports, and structure
- Use path alias `@/` (e.g., `@/lib/prisma`, `@/lib/twilio`).
- Keep UI pieces in their feature folders (`src/components/*`) and avoid duplicating primitives under `components/ui`.
- Place new API routes under `src/app/api/<domain>/<resource>/route.ts` or `src/app/api/<resource>/route.ts`.
- Co-locate server‑only helpers in `src/lib` and keep them side‑effect free.

## Environment variables
Required for Twilio and DB (validate eagerly and fail fast):
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
- DATABASE_URL
- NEXTAUTH_URL, NEXTAUTH_SECRET (when auth is implemented)
Never log secrets. Never commit `.env*`.

## Data model overview (Prisma)
- User, Contact, MessageTemplate, RCSTemplate, Message, Campaign, CampaignContact, Analytics.
- String enums represented as strings in DB; enforce via zod/types (roles, message types/statuses, campaign status).
- Key relations: Message -> Contact/User/Template/Campaign; Campaign -> Template/User/Contacts/Messages.

## API design conventions
- Handlers: `export async function GET/POST/PUT/DELETE(request: NextRequest)`.
- Validate input with zod schemas; on error return 400 with `{ error, details }`.
- Response envelope: `{ success: boolean, data?: T, error?: string, details?: unknown, message?: string }`.
- Use Prisma in `@/lib/prisma`. Avoid N+1; use `select`/`include` judiciously.
- Pagination: `page` (1‑based) and `pageSize` with max cap (e.g., 100). Return `{ data, page, pageSize, total }`.
- Sorting: `sortBy` (whitelist) + `sortDir` in {asc, desc}.
- Filtering: accept query params or JSON body; validate and index appropriately.
- Errors: Catch and return 500 with safe message; log server errors with context but without PII or secrets.

## Validation and formatting
- Always create zod schemas for request bodies and query params.
- Normalize phone numbers to E.164 when persisting and validating (`+###########`).
- Use `TwilioService.validatePhoneNumber` where applicable.
- Use date ISO strings in API responses; store Date in DB.

## Authentication and authorization (Phase 1 priority)
- Implement NextAuth with Prisma adapter.
- Protect dashboard and API routes with session checks (middleware and server‑side asserts).
- Role model: `user` (default) and `admin` via `User.role`.
- Multi‑tenancy: Scope all CRUD by `userId` unless explicitly admin.

## Feature implementation priorities (from roadmap)
1) Authentication & User management
- NextAuth config, Prisma adapter, credentials or email provider for MVP.
- Session middleware; protect `src/app/dashboard/**` and API routes.
- Basic profile page; password reset (follow‑up if using credentials provider).

2) Database‑backed CRUD
- Contacts
  - Endpoints: `GET/POST /api/contacts`, `PUT/DELETE /api/contacts/:id`.
  - Server‑side pagination, sorting, filters (name, phone, tags), bulk import/export later.
  - Deduplicate by phone per user; validate/normalize numbers; indexes are present.
- Templates
  - Endpoints: `GET/POST /api/templates`, `PUT/DELETE /api/templates/:id`.
  - Support variables array and preview rendering; isActive flag.
- Campaigns
  - Endpoints: `GET/POST /api/campaigns`, `PUT/DELETE /api/campaigns/:id`.
  - Track counts; status transitions (draft -> scheduled -> running -> completed/paused/failed).
- Messages
  - `GET /api/messages` with filters: recipient, status, date range, campaignId; include recipient + template brief.

3) Message history page
- Paginated table with filters; detail drawer with status timeline; resend failed.

4) Analytics
- `GET /api/analytics` returning aggregates from `Analytics` and computed metrics for date ranges.
- Nightly aggregation job (design placeholder until a queue is added).

5) Webhooks & real‑time
- Twilio webhook already updates `Message` status. Extend to capture more fields; ensure idempotency by `twilioSid`.
- Plan for websockets or polling (keep code structured to add WS later).

## UI conventions
- Use existing `components` and `ui` primitives; do not introduce a new design system.
- Ensure accessibility (Radix patterns, ARIA labels, keyboard support).
- Keep components server‑safe; put client‑side only pieces behind `'use client'`.
- Dark/light themes via `next-themes`; ensure color tokens are theme‑aware.

## Twilio usage
- Use `@/lib/twilio` TwilioService methods (`sendSMS`, `sendRCS`, `getMessageStatus`, etc.).
- Map Twilio statuses to app statuses consistently (pending, sent, delivered, failed, read).
- For RCS content, store template `contentSid` and variables; serialize `contentVariables` JSON for Twilio API.

## Testing (initial scope)
- Add lightweight unit tests for utilities and schema validation as introduced.
- Add API route tests once a testing framework is added; prefer Vitest or Jest (decide once, then standardize).

## Performance and safety
- Use indexes already defined; prefer `where` + `select` to minimize payloads.
- Cap page sizes; validate all inputs; rate‑limit public endpoints when implemented.
- Avoid blocking bulk operations; plan for a queue in campaign send.

## Definition of done (per change)
- TypeScript typechecks; `npm run build` passes.
- `npm run lint` passes or adds justifiable disable with comment.
- API: zod validation, error handling, and documented response shapes.
- UI: responsive, accessible, using existing primitives; no layout regressions.
- Docs: Update README or in‑code docs if behavior is user‑visible.

## Copilot DOs and DON’Ts
DO
- Follow this file’s conventions and the existing code style.
- Propose minimal, cohesive changes with small, well‑named modules.
- Reuse helpers in `@/lib` and UI primitives in `components/ui`.
- Keep secrets out of logs and code.

DON’T
- Add new frameworks or swap core tech.
- Bypass validation or Prisma; no raw SQL unless essential and reviewed.
- Include trial‑only Twilio logic that would break paid accounts.

## Helpful prompt patterns (for Copilot Chat)
- “Create CRUD API routes for contacts with pagination, sorting, and zod validation.”
- “Add NextAuth with Prisma adapter and protect dashboard routes.”
- “Replace mock analytics with DB queries and an `/api/analytics` endpoint.”
- “Implement message history page with filters and a detail drawer.”
- “Wire campaign scheduling status transitions and counts updates.”

---

By following these instructions, generated changes will align with the roadmap and fit the repository’s architecture and conventions.
