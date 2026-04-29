# Shared contracts usage

## Sprint 1 canonical contract decision
- canonical frontend engineering surface: `workspace/apps/frontend`
- canonical backend engineering surface: `workspace/apps/backend`
- canonical shared contract package: `workspace/packages/contracts`
- stable import target: `@pika/contracts`

## Legacy/reference boundary
- `workspace/frontend` and `workspace/backend` are legacy/prototype reference surfaces only.
- They must not receive new Sprint 1 implementation.
- New shared-contract adoption for Sprint 1 should happen from the canonical `apps/` surfaces.

## What belongs in contracts
Use `@pika/contracts` for cross-surface artifacts such as:
- room and matchup domain entities
- request/response payload types
- stable error shapes/codes
- shared mocks for frontend/backend coordination

## What should not be duplicated
Avoid redefining the same shared types in:
- `workspace/apps/frontend`
- `workspace/apps/backend`
- other implementation directories

If an implementation needs local view-model or transport-adapter types, keep those local and clearly distinct from canonical contracts.

## Current note
Some older implementation/reference directories in the workspace already contain local types/contracts from earlier scaffolding. For Sprint 1, `@pika/contracts` is the locked canonical source for new shared contract usage.