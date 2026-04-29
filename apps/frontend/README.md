# Frontend app surface

This app workspace is reserved as the canonical app-package location for the frontend engineering surface in the monorepo layout.

## Current state
- Shared TypeScript/base workspace config exists at the workspace root.
- Shared contracts live in `workspace/packages/contracts` and should be imported via `@pika/contracts`.
- A separate legacy/prototype implementation also exists under `workspace/frontend/`.

## Minimal expectations
Frontend implementation in `workspace/apps/frontend` should:
- use `@pika/contracts` for shared API/domain types
- keep app-specific UI code local to this package
- avoid redefining shared request/response/domain contracts already published in the contracts package

## Suggested next implementation step
Replace the placeholder `src/index.ts` with the actual app entry chosen by frontend engineering once app framework decisions are finalized.