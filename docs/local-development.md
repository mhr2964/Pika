# Local development

This document captures the minimum local-development setup currently scaffolded in the workspace.

## Active engineering surfaces
- `workspace/apps/frontend` — monorepo frontend app surface placeholder
- `workspace/apps/backend` — monorepo backend API surface placeholder
- `workspace/packages/contracts` — canonical shared contracts package (`@pika/contracts`)
- `workspace/frontend` — current richer frontend implementation/prototype surface
- `workspace/backend` — current richer backend implementation surface

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
- backend and frontend app package placeholders under `apps/`
- canonical contracts package under `packages/contracts`
- implementation-oriented frontend/backend directories for active product work

## Known gap boundary
This scaffold does **not** choose or change the final runtime/framework entry strategy for the `apps/` packages beyond placeholders. Those implementation decisions remain with engineering leads unless explicitly directed.