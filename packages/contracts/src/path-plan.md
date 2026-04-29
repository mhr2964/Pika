# Sprint 1 contract path plan

Canonical shared contract locations for `@pika/contracts`:

- `src/domain.ts`
  - Core entities and enums
  - Room, Player, OptionEntry, Matchup, RoundState, ResultSummary
  - Shared client-safe state helpers such as LoadingState

- `src/errors.ts`
  - Shared error contract types
  - APIError and related helpers/constants

- `src/api.ts`
  - Request/response definitions for:
    - room creation
    - room join
    - option entry
    - matchup progression
    - results synthesis

- `src/mocks/`
  - Example payloads only
  - Happy path examples
  - Key failure examples
  - Safe for frontend mocking and docs

- `src/index.ts`
  - Canonical export surface for `@pika/contracts`

- `src/integration-notes.md`
  - Short ownership note for consumers
  - Explicitly names backend as owner of endpoint semantics

## Naming rules
- Keep names implementation-agnostic.
- Avoid transport-library coupling.
- Prefer plain TypeScript types/interfaces/enums-like constants.
- Keep shapes frontend-mockable and backend-validatable.

## Ownership
- Platform maintains the shared package structure and export surface.
- Backend owns endpoint semantics, validation behavior, and runtime meaning of request handling.
- Other departments consume from `@pika/contracts` rather than duplicating shapes.