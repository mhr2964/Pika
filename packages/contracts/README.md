# @pika/contracts

Canonical cross-team handoff surface for shared contracts, finalized slice artifacts, sample JSON payloads, and mock data used by backend and frontend.

## Purpose

This package is the single agreed workspace location for:
- TypeScript contract definitions in `src/`
- the finalized vertical-slice artifact in `src/pika-vertical-slice.md`
- sample JSON payload artifacts in `samples/`
- reusable mock data modules in `src/mocks/`

Backend and frontend should both reference this package when aligning on request/response shapes, fixture data, and the approved current slice behavior.

## Finalized current-slice handoff

For the current Pika vertical slice, the canonical handoff surface is:

- `workspace/packages/contracts/src/pika-vertical-slice.md`
- `workspace/packages/contracts/samples/pika/`

These supersede any older guidance that implied backend-local contract handoff documents or older sample locations as the primary source for this slice.

### What each artifact is for

- `src/pika-vertical-slice.md` — finalized human-readable slice contract/reference artifact
- `samples/pika/` — payload-level examples that accompany the finalized slice artifact
- `src/sessions.ts` — exported TypeScript session definitions that should stay aligned with the finalized slice artifact
- `src/index.ts` — package export barrel plus package-owned pointer to the canonical slice artifact

## Canonical locations

### 1) Finalized vertical-slice artifact
Primary slice reference lives in:
- `workspace/packages/contracts/src/pika-vertical-slice.md`

Rule:
- treat this file as the finalized narrative/spec handoff for the current vertical slice
- frontend/backend should reconcile implementation details against this file first for slice-specific behavior
- if the slice contract changes, update this artifact and any affected typed contracts/samples together

### 2) Contracts
Authoritative shared code-facing definitions live in:
- `workspace/packages/contracts/src/index.ts`
- `workspace/packages/contracts/src/api.ts`
- `workspace/packages/contracts/src/domain.ts`
- `workspace/packages/contracts/src/errors.ts`
- `workspace/packages/contracts/src/sessions.ts`

Rule:
- shared exported types/interfaces/schemas belong in `src/`
- keep filenames noun-based and domain-specific where possible
- re-export public code-facing contract surface from `src/index.ts`

### 3) Sample JSON payloads
Canonical JSON examples for the finalized slice live in:
- `workspace/packages/contracts/samples/pika/`

Additional package sample folders may still exist for older/generalized artifacts, but for the current vertical slice frontend/backend should prefer `samples/pika/` first.

### 4) Mock data
Canonical code-based mocks live in:
- `workspace/packages/contracts/src/mocks/`

## Consumption guidance

- Frontend should use `src/pika-vertical-slice.md` plus `samples/pika/` as the primary slice reference set.
- Backend should use `src/pika-vertical-slice.md` plus `samples/pika/` as the primary slice handoff set and keep emitted payloads aligned with them.
- Both teams should keep `src/sessions.ts` aligned with the finalized slice artifact where shared TypeScript definitions are required.
- Do not treat backend-local docs as the canonical source once the package-level artifact exists here.

## Current structure

- `src/` — shared TypeScript contracts and package-owned reference artifacts
- `src/pika-vertical-slice.md` — finalized current slice artifact
- `samples/pika/` — finalized current slice payload examples
- `samples/requests/` — legacy/general request examples still present in package
- `samples/responses/` — legacy/general response examples still present in package
- `samples/events/` — example event payloads
- `notes/` — convention notes and handoff guidance

## Ownership note

This package is the canonical handoff surface. Product teams may consume it freely. Structural convention changes should route through platform.