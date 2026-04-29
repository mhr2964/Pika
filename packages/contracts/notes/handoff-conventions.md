# Contracts Handoff Conventions

This note formalizes the minimum artifact contract between backend and frontend for the current Pika session slice.

## Live canonical paths

For the current `/api/v1/sessions/*` slice, the exact live canonical paths in this workspace are:

### Canonical baseline artifact
- `workspace/packages/contracts/pika-vertical-slice.json`

### Typed/package implementation surface
- `workspace/packages/contracts/src/sessions.ts`
- `workspace/packages/contracts/src/index.ts`

### Current readable session request payloads
- `workspace/packages/contracts/samples/requests/sessions.create.v1.request-minimal.json`
- `workspace/packages/contracts/samples/requests/sessions.join.v1.request-minimal.json`

### Current readable session response payloads
- `workspace/packages/contracts/samples/responses/sessions.create.v1.response-success.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-complete.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-in-progress.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-review-ready.json`
- `workspace/packages/contracts/samples/responses/sessions.join.v1.response-success.json`

These sample files are authoritative inspectable examples only where consistent with `workspace/packages/contracts/pika-vertical-slice.json`.

## Current priority order

When frontend/backend need the approved current session contract, consume artifacts in this order:

1. `workspace/packages/contracts/pika-vertical-slice.json`
2. `workspace/packages/contracts/src/sessions.ts`
3. `workspace/packages/contracts/src/index.ts`
4. the currently present session sample payloads under:
   - `workspace/packages/contracts/samples/requests/`
   - `workspace/packages/contracts/samples/responses/`

This means:
- `pika-vertical-slice.json` is the canonical baseline contract artifact
- `src/sessions.ts` is the typed/package implementation surface and must conform to the JSON baseline
- `src/index.ts` is the package export entrypoint
- the existing session JSON files under `samples/requests/` and `samples/responses/` are authoritative inspectable examples only where consistent with the JSON baseline
- markdown artifacts are explanatory/reference-only and must not redefine the baseline JSON or the conforming typed session surface

## Naming and usage conventions

### Contracts
Use descriptive domain filenames:
- `api.ts`
- `domain.ts`
- `errors.ts`
- `sessions.ts`

Keep public code-facing exports reachable from:
- `index.ts`

Keep the baseline publication artifact at:
- `pika-vertical-slice.json`

### Sample JSON payloads
For the current session slice:
- session request examples currently live under `samples/requests/`
- session response examples currently live under `samples/responses/`
- sample payloads are authoritative inspectable examples only where consistent with the JSON baseline
- prefer stable, scenario-oriented filenames

### Reference markdown artifacts
Markdown files under `src/` may document the slice, summarize behavior, or aid review, but they are explanatory/reference-only.

## Superseded / invalid paths in this workspace

The following paths are stale or nonexistent in the current workspace and must not be used:

- `workspace/packages/contracts/src/pika-vertical-slice.md`
- `workspace/packages/contracts/samples/sessions/`

## Required update discipline

When the current shared session contract changes:
1. Update `workspace/packages/contracts/pika-vertical-slice.json` first.
2. Update `src/sessions.ts` so the typed/package implementation surface conforms to the JSON baseline.
3. Keep `src/index.ts` aligned as the package export entrypoint.
4. Update matching session examples in `samples/requests/` and `samples/responses/`.
5. Ensure the sample files remain consistent with the JSON baseline before treating them as authoritative inspectable examples.
6. Update `src/mocks/` fixtures if simulation depends on the changed shape.
7. Update markdown guidance only after the baseline JSON, typed contract surface, and readable sample files are aligned.

## Backend/frontend expectation split

### Backend
- publish and maintain `pika-vertical-slice.json` as the canonical baseline artifact
- keep `src/sessions.ts` conforming to that baseline
- keep `src/index.ts` aligned for package consumers
- keep session request/response examples under the existing `samples/requests/` and `samples/responses/` paths aligned with the current contract surface and consistent with the JSON baseline

### Frontend
- read `pika-vertical-slice.json` first for the canonical baseline
- treat `src/sessions.ts` as the conforming typed source
- use `src/index.ts` as the package export entrypoint when consuming shared exports
- use the existing session examples under `samples/requests/` and `samples/responses/` as authoritative inspectable examples only where consistent with the JSON baseline
- use markdown for orientation only
- do not wait for or reference the superseded paths listed above