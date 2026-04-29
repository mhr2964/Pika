# @pika/contracts

Shared, implementation-agnostic contract surface for Sprint 1.

## Canonical locations
- `src/domain.ts` — core domain entities, enums, shared UI-safe state types
- `src/api.ts` — request/response contracts for room lifecycle, option entry, matchup progression, and results synthesis
- `src/errors.ts` — shared error shapes
- `src/mocks/` — example happy-path and failure payloads for frontend mocking and backend contract review
- `src/integration-notes.md` — ownership and integration guidance

Backend owns endpoint semantics, persistence rules, and runtime validation. This package provides the canonical shared type surface imported as `@pika/contracts`.