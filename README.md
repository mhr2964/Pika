# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Active workspace layout

These are the active implementation roots for the current vertical slice:

- `frontend/` — frontend application
- `backend/` — backend application
- `packages/contracts/` — shared machine-readable API contract
- `docs/` — shared implementation/reference docs

## Path rules

- In agent file writes, local paths are prefixed with `workspace/`.
- In the pushed repo, `workspace/` does **not** exist.
- Repo paths should be referenced as:
  - `frontend/...`
  - `backend/...`
  - `packages/contracts/...`
  - `docs/...`

## Vertical slice contract

Canonical v1 contract:
- `packages/contracts/pika-vertical-slice.json`

Supporting docs:
- `docs/vertical-slice-contract.md`
- `docs/route-map.md`
- `docs/mock-data-shape.md`

## Ownership model

Auth is optional for v1. Room ownership may be attached to either:

- `ownerUserId: string | null`
- `ownerSessionId: string | null`

At least one may be null; both may not be required for anonymous/local flows.

## Working agreement

- Backend owns the canonical contract schema.
- Frontend implements against the published contract.
- Platform owns scaffold clarity, shared docs, and repo-level path consistency.