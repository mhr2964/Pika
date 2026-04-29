# Contracts Handoff Conventions

This note formalizes the minimum artifact contract between backend and frontend for the current Pika slice.

## Canonical path summary

For the current `/api/v1/sessions/*` slice, use these paths first:

- Authoritative session contract: `workspace/packages/contracts/src/sessions.ts`
- Authoritative session samples: `workspace/packages/contracts/samples/sessions/`
- Additional shared code-facing definitions: `workspace/packages/contracts/src/`
- Mock data modules: `workspace/packages/contracts/src/mocks/`
- Reference markdown artifacts: `workspace/packages/contracts/src/*.md`

## Current priority order

When frontend/backend need the approved session contract, consume artifacts in this order:

1. `workspace/packages/contracts/src/sessions.ts`
2. `workspace/packages/contracts/samples/sessions/`
3. explanatory/reference markdown artifacts in `workspace/packages/contracts/src/`

This means:
- `src/sessions.ts` is authoritative
- `samples/sessions/` is the authoritative example set
- markdown artifacts are reference-only and must not redefine the binding session shape

## Naming conventions

### Contracts
Use descriptive domain filenames:
- `api.ts`
- `domain.ts`
- `errors.ts`
- `sessions.ts`

### Sample JSON payloads
For the authoritative current session slice:
- place session payload examples in `samples/sessions/`
- keep filenames scenario-oriented and stable
- prefer descriptive names that match exported session contract terminology

Generalized sample folders may still appear under:
- `samples/requests/`
- `samples/responses/`
- `samples/events/`

But those should not be treated as the primary source for the current `/api/v1/sessions/*` slice when `samples/sessions/` exists.

### Reference markdown artifacts
Markdown files under `src/` may document the slice, summarize behavior, or aid review, but they are explanatory/reference-only.

## Required update discipline

When the current shared session contract changes:
1. Update `src/sessions.ts` first.
2. Update matching artifacts in `samples/sessions/`.
3. Update aligned exported definitions or barrel references in `src/index.ts` if needed.
4. Update `src/mocks/` fixtures if frontend simulation depends on the changed shape.
5. Update reference markdown only after the authoritative code-facing contract and session samples are aligned.

## Backend/frontend expectation split

### Backend
- treat `src/sessions.ts` as the canonical shared contract
- treat `samples/sessions/` as the canonical example payload set
- do not rely on markdown or backend-local contract notes as the final source when they conflict with the package session surface

### Frontend
- treat `src/sessions.ts` as the canonical typed source
- treat `samples/sessions/` as the canonical static example set
- use markdown for orientation only
- do not invent payload keys or states absent from the package session contract and authoritative session samples

## Approved current lane

For the approved current slice, frontend and backend should align first on:
- `src/sessions.ts`
- `samples/sessions/`

Any markdown artifact in `src/` is supplementary and non-authoritative for binding contract decisions.