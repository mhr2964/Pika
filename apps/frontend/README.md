# Frontend app surface

`workspace/apps/frontend` is the Sprint 1 canonical frontend engineering surface.

## Sprint 1 canonical decision
- Canonical frontend implementation surface: `workspace/apps/frontend`
- Canonical shared contracts package: `workspace/packages/contracts`
- Stable shared-contract import target: `@pika/contracts`

## Legacy/reference boundary
- `workspace/frontend` is a legacy/prototype reference surface only.
- Do **not** place new Sprint 1 implementation in `workspace/frontend`.
- New Sprint 1 frontend engineering work should land in `workspace/apps/frontend`.

## Expectations
Frontend implementation in this package should:
- use `@pika/contracts` for shared API/domain/error types
- keep app-specific UI code local to this package
- avoid redefining shared request/response/domain contracts already published in the contracts package

## Current state
- Shared TypeScript/base workspace config exists at the workspace root.
- Shared contracts live in `workspace/packages/contracts`.
- This package is currently a minimal scaffold awaiting active Sprint 1 implementation.