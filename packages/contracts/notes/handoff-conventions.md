# Contracts Handoff Conventions

This note formalizes the minimum artifact contract between backend and frontend for the current Pika slice.

## Canonical path summary

For the current finalized vertical slice, use these paths first:

- Final slice artifact: `workspace/packages/contracts/src/pika-vertical-slice.md`
- Final slice samples: `workspace/packages/contracts/samples/pika/`
- Shared code-facing definitions: `workspace/packages/contracts/src/`
- Mock data modules: `workspace/packages/contracts/src/mocks/`

## Current priority order

When frontend/backend need the approved slice contract, consume artifacts in this order:

1. `workspace/packages/contracts/src/pika-vertical-slice.md`
2. `workspace/packages/contracts/samples/pika/`
3. aligned exported TypeScript definitions in `workspace/packages/contracts/src/`

This package-level surface supersedes older guidance that implied backend-local contract files or older sample folders were the primary handoff source for the current slice.

## Naming conventions

### Contracts
Use descriptive domain filenames:
- `api.ts`
- `domain.ts`
- `errors.ts`
- `sessions.ts`

The finalized markdown artifact for this slice is:
- `pika-vertical-slice.md`

### Sample JSON payloads
For the finalized current slice:
- place slice payload examples in `samples/pika/`
- keep filenames scenario-oriented and stable
- prefer descriptive names that match the finalized slice artifact terminology

If generalized sample folders are used for non-slice-specific artifacts, they may still appear under:
- `samples/requests/`
- `samples/responses/`
- `samples/events/`

But those should not be treated as the primary source for the finalized current slice when `samples/pika/` exists.

### Mock TypeScript files
Format:
- `<domain>-<scenario>.ts`

Examples:
- `sessions-happy-path.ts`
- `sessions-failures.ts`
- `results-shareable.ts`

## Required update discipline

When the current shared slice contract changes:
1. Update `src/pika-vertical-slice.md` first.
2. Update matching artifacts in `samples/pika/`.
3. Update any aligned exported definitions in `src/` such as `sessions.ts`.
4. Update `src/mocks/` fixtures if frontend simulation depends on the changed shape.
5. Remove or supersede stale guidance that points teams back to backend-local handoff files.

## Backend/frontend expectation split

### Backend
- treat `src/pika-vertical-slice.md` and `samples/pika/` as the canonical slice handoff
- keep implementation payloads aligned with the package-level artifact set
- do not rely on backend-local contract notes as the final source once the package artifact is present

### Frontend
- treat `src/pika-vertical-slice.md` and `samples/pika/` as the canonical slice reference
- use aligned exported definitions in `src/` where typed integration is needed
- do not invent payload keys or states absent from the package-level artifact set

## Approved current lane

For the approved current slice, frontend and backend should align first on:
- `src/pika-vertical-slice.md`
- `samples/pika/`
- `src/sessions.ts` where shared TypeScript definitions are needed

## Minimal package-owned pointer requirement

If `src/pika-vertical-slice.md` exists, `src/index.ts` should include a package-owned pointer comment directing consumers to:
- `./pika-vertical-slice.md`
- `../samples/pika/`

This ensures the canonical slice surface is visible even from the package export entrypoint.