# @pika/contracts

Canonical cross-team handoff surface for shared contracts, sample JSON payloads, and mock data used by backend and frontend.

## Purpose

This package is the single agreed workspace location for:
- TypeScript contract definitions in `src/`
- sample JSON payload artifacts in `samples/`
- reusable mock data modules in `src/mocks/`

Backend and frontend should both reference this package when aligning on request/response shapes and fixture data.

## Canonical locations

### 1) Contracts
Authoritative TypeScript contracts live in:
- `workspace/packages/contracts/src/index.ts`
- `workspace/packages/contracts/src/api.ts`
- `workspace/packages/contracts/src/domain.ts`
- `workspace/packages/contracts/src/errors.ts`

Rule:
- shared exported types/interfaces/schemas belong in `src/`
- keep filenames noun-based and domain-specific where possible
- re-export public contract surface from `src/index.ts`

### 2) Sample JSON payloads
Canonical JSON examples live in:
- `workspace/packages/contracts/samples/requests/`
- `workspace/packages/contracts/samples/responses/`
- `workspace/packages/contracts/samples/events/`

Rule:
- one file per scenario
- JSON only
- filenames use lowercase kebab-case
- include version and scenario intent in the filename

Preferred pattern:
- `<domain>.<operation>.v<version>.<scenario>.json`

Examples:
- `rooms.create.v1.request-minimal.json`
- `rooms.create.v1.response-success.json`
- `rooms.get-state.v1.response-in-progress.json`

### 3) Mock data
Canonical code-based mocks live in:
- `workspace/packages/contracts/src/mocks/`

Rule:
- use TypeScript for composable fixtures and generators
- filename pattern: `<domain>-<scenario>.ts`
- export named constants/builders instead of default exports

Examples:
- `rooms-happy-path.ts`
- `rooms-edge-cases.ts`
- `rooms-failures.ts`

## Consumption guidance

- Frontend should use `samples/` for static fixture/reference payloads and `src/mocks/` for local UI/dev scenarios.
- Backend should use `src/` as the source of shared contract types and may mirror `samples/` in docs/tests if needed.
- If a shape changes, update contracts first, then the relevant sample JSON and mocks in the same change.

## Current structure

- `src/` — shared TypeScript contracts and mock modules
- `samples/requests/` — example request bodies
- `samples/responses/` — example response bodies
- `samples/events/` — example event payloads
- `notes/` — convention notes and handoff guidance

## Ownership note

This package is the canonical handoff surface. Product teams may consume it freely. Structural convention changes should route through platform.