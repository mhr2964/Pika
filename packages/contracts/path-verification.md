# Contracts Package Path Verification

This note publishes the exact current authoritative file map for the `/api/v1/sessions/*` slice.

## Canonical baseline artifact

The current canonical baseline artifact is:

- `workspace/packages/contracts/pika-vertical-slice.json`

## Typed/package source files

The current canonical typed/package files are:

- `workspace/packages/contracts/src/sessions.ts`
- `workspace/packages/contracts/src/index.ts`

Use `pika-vertical-slice.json` as the canonical baseline contract artifact.
Use `src/sessions.ts` as the conforming typed/package implementation source.
Use `src/index.ts` as the package export entrypoint that re-exports the shared session surface.

## Current session request payload files

The current session request examples that are present are:

- `workspace/packages/contracts/samples/requests/sessions.create.v1.request-minimal.json`
- `workspace/packages/contracts/samples/requests/sessions.join.v1.request-minimal.json`

## Current session response payload files

The current session response examples that are present are:

- `workspace/packages/contracts/samples/responses/sessions.create.v1.response-success.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-complete.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-in-progress.json`
- `workspace/packages/contracts/samples/responses/sessions.get.v1.response-review-ready.json`
- `workspace/packages/contracts/samples/responses/sessions.join.v1.response-success.json`

These sample files are authoritative inspectable examples only where consistent with `workspace/packages/contracts/pika-vertical-slice.json`.

## Not present / do not use

The following referenced surfaces are not present in the current package tree and must not be used as current canonical paths:

- `workspace/packages/contracts/src/pika-vertical-slice.md`
- `workspace/packages/contracts/samples/sessions/`

## Practical rule for consumers

For the current `/api/v1/sessions/*` slice:

1. Read `workspace/packages/contracts/pika-vertical-slice.json` first.
2. Read `workspace/packages/contracts/src/sessions.ts` next.
3. Consume exports through `workspace/packages/contracts/src/index.ts` as needed.
4. Use the currently present session example payloads under:
   - `workspace/packages/contracts/samples/requests/`
   - `workspace/packages/contracts/samples/responses/`

Treat the sample files as authoritative inspectable examples only where consistent with the JSON baseline.