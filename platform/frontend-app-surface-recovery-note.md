# Frontend app surface recovery note

## Purpose
This note preserves the current recoverable state of the canonical frontend app surface for reference while write-scope mismatches remain active.

## Canonical intent
The Sprint 1 canonical frontend engineering surface is:

- `workspace/apps/frontend`

## Scope mismatch
Recent board evidence shows frontend attempted to write into:

- `workspace/apps/frontend/src/index.ts`

but was blocked as out of scope, with allowed paths reported as:

- `workspace/frontend/`
- `workspace/shared/`

## Current recoverable payloads visible in the workspace
The canonical app surface currently contains visible files:
- `workspace/apps/frontend/src/index.ts`
- `workspace/apps/frontend/src/styles.css`

These files appear present in the workspace tree and are preserved here as a recovery/reference concern only.

## Important
- This note does **not** change canonical ownership or destination.
- `workspace/apps/frontend` remains the intended Sprint 1 target.
- Any fallback or preserved copies under `workspace/platform/` are reference artifacts only and not the live canonical frontend app.