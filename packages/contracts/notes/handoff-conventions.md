# Contracts Handoff Conventions

This note formalizes the minimum artifact contract between backend and frontend for the current Pika slice.

## Canonical path summary

- Contracts: `workspace/packages/contracts/src/`
- Sample request payloads: `workspace/packages/contracts/samples/requests/`
- Sample response payloads: `workspace/packages/contracts/samples/responses/`
- Sample event payloads: `workspace/packages/contracts/samples/events/`
- Mock data modules: `workspace/packages/contracts/src/mocks/`

## Naming conventions

### Contracts
Use descriptive domain filenames:
- `api.ts`
- `domain.ts`
- `errors.ts`
- `sessions.ts`

### Sample JSON payloads
Format:
- `<domain>.<operation>.v<version>.<artifact>.json`

Where `<artifact>` is typically one of:
- `request-minimal`
- `request-full`
- `response-success`
- `response-empty`
- `response-error`
- `event-emitted`
- `event-received`

Examples:
- `sessions.create.v1.request-minimal.json`
- `sessions.create.v1.response-success.json`
- `sessions.join.v1.request-minimal.json`
- `sessions.get.v1.response-in-progress.json`

### Mock TypeScript files
Format:
- `<domain>-<scenario>.ts`

Examples:
- `sessions-happy-path.ts`
- `sessions-failures.ts`
- `results-shareable.ts`

## Required update discipline

When a shared API shape changes:
1. Update `src/` contract exports first.
2. Update matching `samples/` JSON artifacts.
3. Update any `src/mocks/` fixtures that demonstrate the shape.
4. Keep scenario names stable unless semantics change.

## Backend/frontend expectation split

### Backend
- treat `src/` as the shared contract source
- produce/consume payloads consistent with `samples/`
- prefer adding a new scenario file instead of overwriting an unrelated example

### Frontend
- treat `samples/` as the canonical static artifact reference
- use `src/mocks/` for local fixture composition and visual states
- do not invent payload keys absent from `src/` and `samples/`

## Approved current lane

For the approved current slice, frontend and backend should align first on:
- `src/sessions.ts`
- `samples/requests/sessions.*.json`
- `samples/responses/sessions.*.json`

## Minimal artifact completeness for a new endpoint

A new shared endpoint should ideally add:
- contract/type update in `src/`
- at least one request sample in `samples/requests/` if request body exists
- at least one success response sample in `samples/responses/`
- one error response sample if error handling is user-visible
- mock fixture update in `src/mocks/` when frontend simulation needs it