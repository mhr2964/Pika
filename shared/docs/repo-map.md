# Pika repo map

## Active roots

- `frontend/` — active frontend codebase
- `backend/` — active backend codebase
- `prototype/` — standalone review artifact
- `packages/contracts/` — machine-readable shared contract files
- `shared/docs/` — platform-owned cross-team documentation

## Legacy or non-authoritative paths

- `apps/` — legacy scaffold path; not the authoritative runnable target for the current wave

## Ownership guidance

- Backend owns the canonical API contract contents.
- Frontend consumes the published contract and aligns request/response handling.
- Platform owns repo structure, path conventions, env examples, and shared doc placement.
- Prototype remains a review artifact, not a source-of-truth implementation target.

## Pathing rule

Use repo-relative paths in docs, tickets, and handoff notes. Examples:

- `frontend/src/App.tsx`
- `backend/src/index.ts`
- `packages/contracts/pika-vertical-slice.json`
- `shared/docs/api-route-map.md`

Avoid mixed references like `apps/frontend/...` when the active code lives under `frontend/...`.