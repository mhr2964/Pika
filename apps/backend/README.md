# Backend API surface

This app workspace is reserved as the canonical app-package location for the backend engineering surface in the monorepo layout.

## Current state
- Shared TypeScript/base workspace config exists at the workspace root.
- Shared contracts live in `workspace/packages/contracts` and should be imported via `@pika/contracts`.
- A separate legacy/implementation-oriented backend tree also exists under `workspace/backend/`.

## Minimal expectations
Backend implementation in `workspace/apps/backend` should:
- use `@pika/contracts` for shared API/domain/error contracts where applicable
- keep server/runtime wiring local to this package
- avoid duplicating shared DTO/domain definitions already present in the contracts package

## Suggested next implementation step
Replace the placeholder `src/index.ts` with the actual server entry chosen by backend engineering while preserving `@pika/contracts` as the import surface for shared types/contracts.