# Slice 0 scaffold

## Goal

Define the minimum shared scaffold so frontend and backend can implement the first playable vertical slice of Pika locally.

The target is intentionally narrow:

- one frontend input
- one backend call
- one result view

No external credentials, hosted services, or production infrastructure are required for this scaffold.

---

## Active app roots

For Slice 0, use these directories as the implementation roots:

- `workspace/apps/frontend`
- `workspace/apps/backend`

The shared contract location is:

- `workspace/packages/contracts/pika-vertical-slice.json`

That contract path should be named explicitly in implementation notes, app READMEs, and integration discussions so both teams align to one source of truth.

---

## Local development conventions

## Ports

Recommended defaults:

- frontend dev server: `5173`
- backend API server: `3001`

## URL relationship

Frontend should call the backend at a local base URL such as:

- `http://localhost:3001/api/v1`

## Runtime topology
