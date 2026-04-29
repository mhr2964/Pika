# Shared contracts usage

Sprint 1 canonical shared contract package:

- package path: `workspace/packages/contracts`
- import target: `@pika/contracts`

## What belongs in contracts
Use the contracts package for cross-surface artifacts such as:
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
Some richer implementation directories in the workspace already contain local types/contracts from earlier scaffolding. For Sprint 1, `@pika/contracts` is the locked canonical source for new shared contract usage.