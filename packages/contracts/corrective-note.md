# Corrective Note: Current Contracts Package Surface

The contracts package is physically present at:

- `workspace/packages/contracts/`

For the current `/api/v1/sessions/*` slice, the exact currently readable canonical files are:

## Canonical baseline artifact

- `workspace/packages/contracts/pika-vertical-slice.json`

This JSON is the canonical baseline contract artifact for the current slice.

## Typed/package implementation surface

- `workspace/packages/contracts/src/sessions.ts`
- `workspace/packages/contracts/src/index.ts`

`src/sessions.ts` is the typed/package implementation surface and must conform to the JSON baseline.
`src/index.ts` is the readable package export entrypoint.

## Existing readable session sample JSON files

### Requests
- `workspace/packages/contracts/samples/requests/sessions.create.v1.request-minimal.json`
- `workspace/packages/contracts/samples/requests/sessions.join.v1.request-minimal.json`

### Responses
- `workspace/packages/contracts/samples/responses/sessions.create.v1.response-success.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-complete.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-in-progress.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-review-ready.json`
- `workspace/packages/contracts/samples/responses/sessions.join.v1.response-success.json`

These sample files are authoritative inspectable examples only where consistent with the JSON baseline artifact.

## Invalid stale/nonexistent paths

The following paths are not present in the current workspace and are invalid for current consumption:

- `workspace/packages/contracts/src/pika-vertical-slice.md`
- `workspace/packages/contracts/samples/sessions/`

## Effective rule

Until a later approved package update changes the contract surface, consumers should:
1. read `workspace/packages/contracts/pika-vertical-slice.json` as the canonical baseline
2. use `workspace/packages/contracts/src/sessions.ts` as the conforming typed/package implementation surface
3. consume exports through `workspace/packages/contracts/src/index.ts`
4. inspect the current session payload examples under `samples/requests/` and `samples/responses/` as authoritative inspectable examples only where consistent with the JSON baseline