# @pika/contracts

Canonical cross-team handoff surface for shared contracts, session sample payloads, and supporting reference artifacts used by backend and frontend.

## Purpose

This package is the single agreed workspace location for:
- authoritative TypeScript contract definitions in `src/`
- authoritative session example payloads in `samples/sessions/`
- supporting sample JSON payload artifacts in `samples/`
- reusable mock data modules in `src/mocks/`
- explanatory/reference markdown artifacts in `src/`

Backend and frontend should both reference this package when aligning on request/response shapes, fixture data, and the approved current slice behavior.

## Precedence for the current session slice

For the current `/api/v1/sessions/*` vertical slice, use these sources in order:

1. `workspace/packages/contracts/src/sessions.ts`
2. `workspace/packages/contracts/samples/sessions/`
3. explanatory/reference markdown artifacts in `workspace/packages/contracts/src/`

This precedence is binding for the current slice:
- `src/sessions.ts` is the authoritative source of truth for the shared session contract
- `samples/sessions/` is the authoritative example payload set
- markdown artifacts are explanatory/reference-only and must not override the typed contract or canonical session samples

## Canonical locations

### 1) Authoritative session contracts
Primary current session contract lives in:
- `workspace/packages/contracts/src/sessions.ts`

Rule:
- treat this file as the authoritative shared code-facing contract for `/api/v1/sessions/*`
- if the session contract changes, update this file first
- keep `src/index.ts` exporting the session surface

### 2) Authoritative session examples
Primary current session examples live in:
- `workspace/packages/contracts/samples/sessions/`

Rule:
- treat this folder as the canonical example set for `/api/v1/sessions/*`
- examples here should mirror the shapes defined in `src/sessions.ts`
- when example payloads change, keep them aligned with the exported session contract

### 3) Other shared contracts
Additional shared code-facing definitions live in:
- `workspace/packages/contracts/src/index.ts`
- `workspace/packages/contracts/src/api.ts`
- `workspace/packages/contracts/src/domain.ts`
- `workspace/packages/contracts/src/errors.ts`

Rule:
- shared exported types/interfaces/schemas belong in `src/`
- keep filenames noun-based and domain-specific where possible
- re-export public code-facing contract surface from `src/index.ts`

### 4) Reference markdown artifacts
Reference/spec notes may live in:
- `workspace/packages/contracts/src/*.md`

Rule:
- these files are explanatory/reference-only
- they may summarize or narrate the slice, but they do not override `src/sessions.ts`
- if reference markdown conflicts with exported contracts or canonical session samples, follow the exported contracts and session sample set

### 5) Mock data
Canonical code-based mocks live in:
- `workspace/packages/contracts/src/mocks/`

## Consumption guidance

- Frontend should use `src/sessions.ts` for shared types and `samples/sessions/` for canonical session payload examples.
- Backend should implement `/api/v1/sessions/*` against `src/sessions.ts` and keep emitted payloads aligned with `samples/sessions/`.
- Markdown artifacts may be used for orientation, review, or explanation, but not as the binding contract source.
- Do not treat backend-local docs as the canonical source once the package-level session contract exists here.

## Current structure

- `src/` — shared TypeScript contracts and reference artifacts
- `src/sessions.ts` — authoritative current session contract
- `samples/sessions/` — authoritative current session payload examples
- `samples/requests/` — older/general request examples still present in package
- `samples/responses/` — older/general response examples still present in package
- `samples/events/` — example event payloads
- `notes/` — convention notes and handoff guidance

## Ownership note

This package is the canonical handoff surface. Product teams may consume it freely. Structural convention changes should route through platform.