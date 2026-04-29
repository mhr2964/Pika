# @pika/contracts

Canonical cross-team handoff surface for baseline contract publication, shared typed contracts, readable session sample payloads, and supporting reference artifacts used by backend and frontend.

## Purpose

This package is the agreed workspace location for:
- the canonical baseline contract artifact in `pika-vertical-slice.json`
- conforming TypeScript contract definitions in `src/`
- the package export entrypoint in `src/index.ts`
- current readable session JSON examples in `samples/requests/` and `samples/responses/`
- reusable mock data modules in `src/mocks/`
- explanatory/reference markdown artifacts in `src/`

Backend and frontend should both reference this package when aligning on request/response shapes, fixture data, and the approved current session slice behavior.

## Live canonical surface for the current session slice

For the current `/api/v1/sessions/*` vertical slice, the live canonical surface in this workspace is:

### Canonical baseline artifact
- `workspace/packages/contracts/pika-vertical-slice.json`

This JSON is the canonical baseline contract artifact for the current slice.

### Typed/package implementation surface
- `workspace/packages/contracts/src/sessions.ts`
- `workspace/packages/contracts/src/index.ts`

Use these with the following roles:
- `pika-vertical-slice.json` is the canonical baseline contract artifact
- `src/sessions.ts` is the typed/package implementation surface and must conform to the JSON baseline
- `src/index.ts` is the package export entrypoint for the shared contract surface

### Current readable session payload files

#### Requests
- `workspace/packages/contracts/samples/requests/sessions.create.v1.request-minimal.json`
- `workspace/packages/contracts/samples/requests/sessions.join.v1.request-minimal.json`

#### Responses
- `workspace/packages/contracts/samples/responses/sessions.create.v1.response-success.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-complete.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-in-progress.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-review-ready.json`
- `workspace/packages/contracts/samples/responses/sessions.join.v1.response-success.json`

These sample files are authoritative inspectable examples only where consistent with the JSON baseline artifact.

## Consumption order

When consuming the current `/api/v1/sessions/*` slice, use this order:

1. `workspace/packages/contracts/pika-vertical-slice.json`
2. `workspace/packages/contracts/src/sessions.ts`
3. `workspace/packages/contracts/src/index.ts`
4. the currently present session payload examples in:
   - `workspace/packages/contracts/samples/requests/`
   - `workspace/packages/contracts/samples/responses/`

This means the JSON establishes the baseline contract, the TypeScript surface conforms to that baseline, the package entrypoint re-exports the typed surface, and the samples remain authoritative inspectable examples only where consistent with the JSON baseline.

## Superseded / invalid paths in this workspace

The following paths are stale, superseded, or not present in this workspace and must not be used as canonical references for the current session slice:

- `workspace/packages/contracts/src/pika-vertical-slice.md`
- `workspace/packages/contracts/samples/sessions/`

## Other shared package contents

Additional shared code-facing definitions live in:
- `workspace/packages/contracts/src/api.ts`
- `workspace/packages/contracts/src/domain.ts`
- `workspace/packages/contracts/src/errors.ts`

Reference/spec notes may live in:
- `workspace/packages/contracts/src/*.md`

Reusable mock data modules live in:
- `workspace/packages/contracts/src/mocks/`

## Ownership note

This package is the canonical shared contracts package for the current workspace. Product teams may consume it freely. Structural convention changes should route through platform.