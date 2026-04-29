# Local development

This document captures the minimum local-development setup currently scaffolded in the workspace.

## Sprint 1 canonical engineering surfaces
- `workspace/apps/frontend` — canonical Sprint 1 frontend engineering surface
- `workspace/apps/backend` — canonical Sprint 1 backend engineering surface
- `workspace/packages/contracts` — canonical shared contracts package (`@pika/contracts`)

## Legacy/reference surfaces
- `workspace/frontend` is a legacy/prototype reference surface only.
- `workspace/backend` is a legacy/prototype reference surface only.
- Do **not** place new Sprint 1 implementation work in `workspace/frontend` or `workspace/backend`.

These legacy/reference directories may be consulted for prior prototype context, but active Sprint 1 implementation should land only in the canonical `apps/` surfaces.

## Shared contracts
Use `@pika/contracts` for shared:
- domain models
- API request/response types
- shared error shapes
- mocks used for alignment/testing

Do not recreate these contracts independently in app packages unless an explicit compatibility plan is approved.

## Environment
A shared example env file is available at:

- `workspace/.env.example`

Current documented local defaults:
- frontend origin: `http://localhost:5173`
- backend base URL: `http://localhost:3001`

## Current scaffold status
The workspace now includes:
- root TypeScript config
- pnpm workspace definition
- canonical frontend/backend app package surfaces under `apps/`
- canonical contracts package under `packages/contracts`
- legacy/prototype reference directories under `frontend/` and `backend/`

## Known gap boundary
This scaffold does **not** choose or change the final runtime/framework entry strategy for the canonical `apps/` packages beyond placeholders. Those implementation decisions remain with engineering leads unless explicitly directed.