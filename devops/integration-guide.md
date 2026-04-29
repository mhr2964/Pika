# Integration guide

This guide aligns the current slice artifacts for local development, handoff, and basic integration review.

## Canonical paths

- Frontend app: `workspace/apps/frontend/`
- Backend app: `workspace/apps/backend/`
- Shared contracts: `workspace/packages/contracts/`

The contracts package is the canonical cross-team handoff surface for the current vertical slice.

## Local app runtime baseline

The repo baseline for local app execution is now straightforward and consistent across both apps:

- `workspace/apps/frontend` exposes `tsx`-based `dev` and `start` scripts
- `workspace/apps/backend` exposes `tsx`-based `dev` and `start` scripts
- both apps use `src/index.ts` as the expected runtime entrypoint

Older guidance that framed local TypeScript execution as a known mismatch caveat should be considered superseded by this baseline.

## What each surface is responsible for

### `workspace/apps/frontend`
Owns frontend-local runtime setup and application entrypoint details.

Expect:
- app package manifest
- `src/index.ts`
- app-specific tsconfig
- frontend-local implementation details

### `workspace/apps/backend`
Owns backend-local runtime setup and application entrypoint details.

Expect:
- app package manifest
- `src/index.ts`
- app-specific tsconfig
- backend-local implementation details

### `workspace/packages/contracts`
Owns the stable shared shape of the current slice.

Expect:
- request/response definitions
- domain types
- integration notes
- mock helpers and examples used for alignment

## Integration expectations

### Frontend to contracts
Frontend should reference the shared contract package for:
- domain naming
- request and response shapes
- mock data alignment
- compatibility with backend responses for the slice

### Backend to contracts
Backend should reference the shared contract package for:
- request validation targets
- response payload shape
- shared naming and error shape alignment
- examples and fixture parity where useful

### Documentation references
When writing support docs or handoff notes:
- point app runtime guidance to `workspace/apps/frontend/` and `workspace/apps/backend/`
- point shared data-shape guidance to `workspace/packages/contracts/`
- do not reintroduce old caveat wording about a repo-wide TS runtime mismatch unless a new concrete blocker is discovered

## Basic review checklist

Use this checklist when reviewing the current slice artifacts:

- frontend app path points to `workspace/apps/frontend/`
- backend app path points to `workspace/apps/backend/`
- contract references point to `workspace/packages/contracts/`
- both app docs describe `tsx`-based `dev` and `start` scripts
- both app docs describe `src/index.ts` as the expected entrypoint
- no local-run documentation still describes the previous TypeScript-runtime caveat as the current baseline

## Troubleshooting stance

If a contributor cannot run an app locally, treat that as one of:
- machine-specific dependency/setup drift
- stale local docs
- a package manifest or tsconfig regression
- an app-specific issue requiring a direct fix

Do not describe the overall slice as having an expected TypeScript runtime mismatch. The intended and documented baseline is now stable: `tsx` scripts plus `src/index.ts` in both app folders.