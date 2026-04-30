# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Recommended workspace layout

Pika should be treated as a single workspace with clear boundaries between apps and shared contracts.

- `workspace/apps/frontend/` — primary web client for the product UI
- `workspace/apps/backend/` — primary local API/server for Slice 0
- `workspace/packages/contracts/` — shared contract package, including the canonical Slice 0 contract at `workspace/packages/contracts/pika-vertical-slice.json`
- `workspace/docs/` — local development and implementation guidance
- `workspace/platform/` — platform-owned scaffolding and workspace-level engineering guidance
- `workspace/devops/` — deployment/runbook artifacts; not critical-path for local-first Slice 0

## Slice 0 placement guidance

For the first implementation slice, teams should place active engineering work here:

- frontend implementation in `workspace/apps/frontend/`
- backend implementation in `workspace/apps/backend/`
- shared API/domain contract in `workspace/packages/contracts/pika-vertical-slice.json`

This keeps the thinnest vertical slice aligned around one browser app, one local API, and one shared contract.

## Source-of-truth guidance

The workspace currently contains some duplicate or legacy-looking top-level app folders outside `apps/`.

Until directed otherwise, the recommended active roots for new Slice 0 work are:

- `workspace/apps/frontend`
- `workspace/apps/backend`

Teams should avoid creating additional parallel app roots. If older folders are still referenced, treat them as legacy/prototype material and document any exceptions before building further.

## Local-first principle

Slice 0 should work without:

- external credentials
- cloud infrastructure
- hosted databases
- auth providers
- production deploy setup

The goal is a working local flow first: one user action in the frontend, one backend call, one visible result state.

## Shared contract location

The canonical shared contract for the first playable vertical slice is:

- `workspace/packages/contracts/pika-vertical-slice.json`

Per project policy, backend defines the canonical v1 contract and frontend conforms after publication.

## Suggested local ports

- frontend: `5173`
- backend: `3001`

## Root workflow expectation

Use the root workspace to coordinate app-level work, not to contain product features directly.

Typical handoff shape:

1. backend publishes or updates the canonical contract
2. frontend integrates against that contract
3. both apps run locally with placeholder-only env config
4. docs stay current enough for another teammate to boot the slice quickly