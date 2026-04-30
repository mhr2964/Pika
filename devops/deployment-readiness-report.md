# Deployment Readiness Report

## Project
**Name:** Pika  
**Purpose:** Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Artifacts staged
- `workspace/.github/workflows/ci.yml`
- `workspace/frontend/vercel.json`
- `workspace/backend/Dockerfile`
- `workspace/backend/.env.example`

## Current coverage

### CI checks
GitHub Actions now validates:
- frontend dependency install
- frontend build when a build script exists
- backend dependency install
- backend optional build step when present
- backend import/syntax smoke validation through `src/index.js`
- contracts package install and optional build validation

This workflow is intentionally conservative:
- it does not assume `test` scripts exist
- it does not assume lockfiles are present
- it validates the current visible workspace layout directly

### Frontend preview/deployment path
`workspace/frontend/vercel.json` provides a minimum Vercel-ready configuration for the Vite SPA:
- install dependencies
- run the production build
- publish `dist`
- rewrite SPA routes to `index.html`

### Backend deployment path
`workspace/backend/Dockerfile` provides a minimum production container path:
- Node 20 Alpine base image
- production dependency install
- app source copied into image
- port `3001` exposed
- runtime command `node src/index.js`

### Secrets and environment handling
`workspace/backend/.env.example` documents the current backend runtime expectations:
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- optional app metadata values

Team guidance:
- commit `.env.example`
- do not commit real `.env` files
- place production values in host-managed secrets/config
- align deployed frontend origin with backend `CORS_ORIGIN`

## Status
**Deployment support is staged and repo artifacts are present.**

The repo now has:
- a minimum CI workflow
- a frontend preview-host configuration
- a backend container artifact
- documented backend environment inputs

## Next missing piece
**A concrete backend hosting target and runtime secret set still need to be chosen/configured by integration owners.**

Examples of unresolved host-level decisions:
- which platform runs the backend container
- what public backend URL/frontend API base URL will be used
- what production `CORS_ORIGIN` value should be set
- whether healthcheck, scaling, and persistent storage policies are needed for the chosen host

## Recommended handoff step
1. Point GitHub at Vercel for `workspace/frontend`.
2. Select a backend host that can build from `workspace/backend/Dockerfile`.
3. Create production env values from `workspace/backend/.env.example`.
4. Wire the chosen backend base URL into frontend deployment config.

## Acceptance checklist
- [x] CI workflow present
- [x] Frontend preview config present
- [x] Backend Dockerfile present
- [x] Backend env example present
- [x] Readiness report updated with coverage and next missing piece