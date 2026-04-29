# Deploy Skeleton Template

Intended root destination:
- `workspace/docs/deploy-skeleton.md` or repo deployment runbook location chosen by platform

Current source of truth:
- `workspace/devops/deploy-skeleton.md`

## Current topology to support
There are two active engineering shapes in the workspace:

1. **Monorepo scaffold**
   - `workspace/package.json`
   - `workspace/pnpm-workspace.yaml`
   - `workspace/apps/frontend`
   - `workspace/apps/backend`
   - `workspace/packages/contracts`

2. **Legacy standalone backend**
   - `workspace/backend/package.json`
   - `workspace/backend/src/index.js`

This means deployment automation should treat the monorepo path as the default forward path while preserving a temporary lane for the standalone backend until consolidation is complete.

## Recommended target deployment model

### Frontend
Preferred source:
- `workspace/apps/frontend`

Expected deploy shape:
- app or static frontend host
- build command sourced from `apps/frontend/package.json`
- public API URL set from:
  - `VITE_API_BASE_URL` or
  - `NEXT_PUBLIC_API_BASE_URL`

### Backend
Preferred source:
- `workspace/apps/backend`

Temporary alternate source:
- `workspace/backend`

Expected deploy shape:
- Node service or containerized web service
- internal bind:
  - `API_HOST=0.0.0.0`
  - `API_PORT=4000`

### Shared contracts
Source:
- `workspace/packages/contracts`

Expected role:
- versioned shared types/contracts consumed during build/test phases

## Skeleton pipeline stages

### 1. Verify
- checkout repo
- install package manager(s)
- verify required manifests exist
- verify env template exists

### 2. Install
- monorepo: `pnpm install`
- legacy backend fallback: `npm install` in `workspace/backend`

### 3. Quality
- `pnpm -r --if-present lint`
- `pnpm -r --if-present typecheck`
- `pnpm -r --if-present test`
- legacy backend checks if still independently deployed

### 4. Build
- frontend build from `apps/frontend`
- backend build from `apps/backend` if TypeScript compile/build is introduced
- package shared contracts if needed

### 5. Package
- optional Docker image build once Dockerfiles exist
- artifact publish to chosen host registry/platform

### 6. Deploy
- deploy frontend
- deploy backend
- inject runtime env values
- smoke-check health endpoint

## Required production env categories
- public frontend API base
- backend host/port
- CORS origin(s)
- session/auth secrets
- data service URLs
- logging level

## Migration note
If the standalone `workspace/backend` is deprecated after monorepo backend reaches parity:
- remove legacy backend CI lane
- remove legacy backend compose profile
- consolidate env docs around `apps/backend`