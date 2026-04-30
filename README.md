# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Canonical repo roots

Only these top-level paths are authoritative for the current buildout:

- `frontend/` — frontend application implementation
- `backend/` — backend application implementation
- `packages/contracts/` — shared implementation contracts
- `docs/` — shared reference docs

Do not treat any other top-level app paths as canonical unless explicitly re-designated.

## Ownership boundaries

### Root README owns
- repo usage/setup orientation
- canonical directory map
- shared env entry points
- local boot order guidance
- path conventions used by all departments

### Shared contracts/docs own
- vertical-slice API contract
- route map
- mock/seed payload shapes
- cross-team implementation agreements

### App directories own
- framework/runtime specifics
- app-local scripts
- app-local components, routes, handlers, services, schemas
- auth/frontend/backend implementation details

## Shared contract and docs

Canonical contract:
- `packages/contracts/pika-vertical-slice.json`

Reference docs:
- `docs/vertical-slice-contract.md`
- `docs/route-map.md`
- `docs/mock-data-shape.md`
- `docs/platform-status.md`
- `docs/repo-surface-manifest.md`

## Env sample locations

- `.env.example`
- `frontend/.env.example`
- `backend/.env.example`

## Path convention

`workspace/` is a local worker prefix only.

It must not appear in:
- repo documentation
- CI path references
- implementation import/path guidance
- cross-team handoff notes

Use repo-relative paths such as:
- `frontend/...`
- `backend/...`
- `packages/contracts/...`
- `docs/...`

## Local boot guidance

Current intended boot sequence:

1. Configure env from the example files
2. Start backend first
3. Start frontend second
4. Exercise the vertical slice:
   - create room
   - add options
   - generate matchup
   - submit selections
   - compute/show results

## Current uncertainty

The canonical roots and shared artifact locations are binding for this phase.

Still not directly re-verified from manifest/package reads during the earlier ENOENT period:
- exact package manager
- exact root script wiring
- exact app framework/runtime package definitions