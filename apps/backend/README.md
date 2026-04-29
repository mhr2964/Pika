# Backend API surface

`workspace/apps/backend` is the Sprint 1 canonical backend engineering surface.

## Sprint 1 canonical decision
- Canonical backend implementation surface: `workspace/apps/backend`
- Canonical shared contracts package: `workspace/packages/contracts`
- Stable shared-contract import target: `@pika/contracts`

## Legacy/reference boundary
- `workspace/backend` is a legacy/prototype reference surface only.
- Do **not** place new Sprint 1 implementation in `workspace/backend`.
- New Sprint 1 backend engineering work should land in `workspace/apps/backend`.

## Expectations
Backend implementation in this package should:
- use `@pika/contracts` for shared API/domain/error contracts where applicable
- keep server/runtime wiring local to this package
- avoid duplicating shared DTO/domain definitions already present in the contracts package

## Current state
- Shared TypeScript/base workspace config exists at the workspace root.
- Shared contracts live in `workspace/packages/contracts`.
- This package is currently a minimal scaffold awaiting active Sprint 1 implementation.