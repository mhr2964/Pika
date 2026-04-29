# Incremental validation note

## Canonical local start commands currently declared

### `workspace/apps/frontend`
From `workspace/apps/frontend/package.json`:
- `npm run dev`
- `npm run build`
- `npm run start`

`dev` is currently declared as:
- `node src/index.ts`

### `workspace/apps/backend`
From `workspace/apps/backend/package.json`:
- `npm run dev`
- `npm run build`
- `npm run start`

`dev` is currently declared as:
- `node src/index.ts`

### `workspace/packages/contracts`
From `workspace/packages/contracts/package.json`:
- `npm run build`

## Concrete blocker

Both canonical app `dev` scripts invoke `.ts` entrypoints directly under plain `node`:
- `apps/frontend/src/index.ts`
- `apps/backend/src/index.ts`

That means the declared local bring-up path is documented, but is not a verified runnable TypeScript execution path as written. This is the current concrete blocker for runtime validation.

Both app READMEs also describe the app surfaces as minimal scaffolds rather than complete implementations.

## Env/config assumptions from existing docs

From `workspace/docs/local-development.md`:
- install workspace dependencies from the repo root
- use the monorepo scripts to run frontend/backend/contracts work
- frontend is expected on port `3000`
- backend is expected on port `4000`

From `workspace/devops/port-and-env-conventions.md`:
- frontend default port: `3000`
- backend default port: `4000`
- `PORT` is the primary backend port override
- `CORS_ORIGIN` should point backend access to the frontend origin
- `VITE_API_BASE_URL` is the frontend API base URL

From `workspace/devops/integration-guide.md`:
- frontend expects `VITE_API_BASE_URL=http://localhost:4000`
- backend examples assume `PORT=4000`
- contracts package is shared source-of-truth for request/response shapes

## Current surface state from app READMEs

### Frontend
`workspace/apps/frontend/README.md` describes the app as a minimal scaffold with a TypeScript entrypoint and basic scripts, not as a feature-complete room flow.

### Backend
`workspace/apps/backend/README.md` describes the app as a minimal scaffold with a TypeScript entrypoint and basic scripts, not as a feature-complete room API.

## Minimum manual validation flow for the current mixed real/mock state

Given the current evidence, validation should be framed as surface-level/manual and mixed real/mock, not full end-to-end runtime proof.

1. Review `workspace/apps/frontend/src/index.ts` for the exposed UI flow coverage.
2. Review `workspace/packages/contracts/src/api.ts` and `workspace/packages/contracts/src/domain.ts` for the canonical request/response and domain shapes.
3. Treat `create room` and `join room` as the most likely intended primary interaction surfaces to inspect first in the frontend scaffold.
4. Treat `add option` and `start room` as flow steps that may be represented in UI/state shape, but not proven here as live backend-backed operations.
5. Use `workspace/packages/contracts/src/mocks/happy-path.ts` and `workspace/packages/contracts/src/mocks/failures.ts` as the available evidence for mocked behavior expectations where runtime integration is not yet verified.

## Practical validation checklist

### Create room
- confirm the frontend scaffold contains a create-room entry surface
- confirm the contracts package defines the room creation shapes used by the shared API/domain model
- do **not** claim live backend verification from the current `apps/*` scripts, because the TypeScript entrypoints are invoked directly with plain `node`

### Join room
- confirm the frontend scaffold contains a join-room entry surface
- confirm the contracts package defines room/join-related shared types where applicable
- treat this as scaffold/manual inspection unless another runnable path is supplied

### Add option
- confirm option-related room/domain structures exist in shared contracts and/or frontend scaffold state
- treat option submission as mixed real/mock behavior, not verified live API behavior, based on current app scaffold status

### Start room
- confirm the frontend scaffold includes a room progression/start surface if present
- treat room-start behavior as mixed real/mock/manual-flow evidence only unless a runnable TS-capable app entry is added

## Summary

The canonical local bring-up path is currently documented by the `apps/frontend`, `apps/backend`, and `packages/contracts` package scripts, but runtime validation is blocked because both app `dev` scripts call plain `node` on `.ts` entrypoints. Existing READMEs for both apps explicitly position them as minimal scaffolds, so the present validation posture should be documented as manual surface inspection plus shared-contract review, with create room, join room, add option, and start room treated as current mixed real/mock flows rather than verified live end-to-end behavior.