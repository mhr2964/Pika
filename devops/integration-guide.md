# Sprint 1 DevOps Template Integration Guide

This guide describes how to integrate the `workspace/devops/` template bundle into the current live workspace.

## Why these templates are staged here
Devops write scope is currently limited to:
- `workspace/devops/`
- `workspace/shared/`

So this directory is the approved source-of-truth staging area for operational artifacts that may be copied into root-owned destinations by platform.

## Current workspace state this guide is based on

### Root-integrated workspace files now present
Observed:
- `workspace/package.json`
- `workspace/pnpm-workspace.yaml`
- `workspace/README.md`
- `workspace/.gitignore`
- `workspace/tsconfig.base.json`
- `workspace/tsconfig.json`

### Current monorepo scaffold present
Observed:
- `workspace/apps/frontend/package.json`
- `workspace/apps/frontend/src/index.ts`
- `workspace/apps/backend/package.json`
- `workspace/apps/backend/src/index.ts`
- `workspace/packages/contracts/package.json`
- `workspace/packages/contracts/src/index.ts`
- `workspace/packages/contracts/README.md`

### Current product implementation surfaces still present
Observed:
- `workspace/frontend/src/main.tsx`
- `workspace/frontend/src/App.tsx`
- `workspace/backend/package.json`
- `workspace/backend/src/index.js`
- `workspace/backend/src/config/env.js`
- `workspace/backend/src/routes/health.js`
- `workspace/backend/src/routes/rooms.js`

## Important current-state note
The current workspace contains two different implementation shapes at once:

1. **Integrated monorepo scaffold**
   - root `package.json`
   - `pnpm-workspace.yaml`
   - `apps/frontend`
   - `apps/backend`
   - `packages/contracts`

2. **Active app implementation directories**
   - `frontend/`
   - `backend/`

Because both shapes are live in the tree, these devops templates are written as operational source-of-truth references, not as claims that every script already runs exactly as templated. Platform should install or adapt them against the root-integrated files already present.

## Template-by-template integration map

### 1) `workspace/devops/.env.example`
**Intended destination**
- `workspace/.env.example`

**Purpose**
- provide one shared local env contract for frontend, backend, compose, CI, and future deploy wiring

**Current-state note**
- `workspace/.env.example` is not visible in the current tree
- `workspace/backend/src/config/env.js` indicates the legacy backend still needs compatibility envs like `PORT`
- root `README.md` already documents local ports, so env values should match that documentation

**Install step**
1. copy `workspace/devops/.env.example` to `workspace/.env.example`
2. preserve canonical values:
   - `FRONTEND_PORT=3000`
   - `BACKEND_PORT=4000`
   - `API_PORT=4000`
   - `WS_PORT=4001`
   - `REDIS_PORT=6379`
3. preserve compatibility line:
   - `PORT=4000`
4. use this env file as the reference for:
   - root docs
   - compose services
   - CI env assumptions

### 2) `workspace/devops/docker-compose.yml`
**Intended destination**
- `workspace/docker-compose.yml`

**Purpose**
- provide a local orchestration template for frontend, backend, and redis while both monorepo and legacy backend surfaces exist

**Current-state note**
- `workspace/docker-compose.yml` is not visible in the current tree
- root `README.md` documents frontend `3000`, backend `4000`, and redis `6379`
- there is a monorepo scaffold under `apps/`, but current active implementation files for app behavior still live under `frontend/` and `backend/`

**Install step**
1. copy `workspace/devops/docker-compose.yml` to `workspace/docker-compose.yml`
2. verify ports remain aligned with docs:
   - frontend `3000`
   - backend `4000`
   - redis `6379`
3. verify service commands against the current root `package.json` scripts and actual app package names before relying on them
4. keep any legacy backend profile only while `workspace/backend/` remains operationally relevant

### 3) `workspace/devops/ci-workflow-template.yml`
**Intended destination**
- `workspace/.github/workflows/ci.yml`

**Purpose**
- define a CI baseline that checks current workspace structure and runs package scripts only when present

**Current-state note**
- no visible `workspace/.github/workflows/ci.yml` currently exists
- root `workspace/package.json` exists and should be treated as the integration anchor
- current app reality spans:
  - `apps/frontend`
  - `apps/backend`
  - `packages/contracts`
  - standalone `backend/`
- CI should not pretend the `frontend/` implementation folder is already wired into the monorepo unless platform explicitly integrates it

**Install step**
1. create `workspace/.github/workflows/` if missing
2. copy `workspace/devops/ci-workflow-template.yml` to `workspace/.github/workflows/ci.yml`
3. verify package names and script names in:
   - `workspace/package.json`
   - `workspace/apps/frontend/package.json`
   - `workspace/apps/backend/package.json`
   - `workspace/packages/contracts/package.json`
   - `workspace/backend/package.json`
4. keep all script execution guarded with `--if-present` or equivalent until runtime ownership is fully converged

### 4) `workspace/devops/deploy-skeleton.md`
**Intended destination**
- preferred: `workspace/docs/deploy-skeleton.md`
- alternate: another platform-owned docs path

**Purpose**
- define a deployment pipeline skeleton without inventing final hosting choices

**Current-state note**
- no root docs deployment runbook is visible
- deployment planning must acknowledge that:
  - monorepo scaffold exists
  - current implemented backend still exists in `workspace/backend`
  - current implemented frontend still exists in `workspace/frontend`

**Install step**
1. copy `workspace/devops/deploy-skeleton.md` to `workspace/docs/deploy-skeleton.md`
2. update deployment source selections only after platform decides whether deploys come from:
   - `apps/*`
   - `frontend/` and `backend/`
   - or a merged final layout
3. keep the document explicitly marked as a skeleton until hosting targets are chosen

### 5) `workspace/devops/port-and-env-conventions.md`
**Intended destination**
- preferred: `workspace/docs/port-and-env-conventions.md`
- acceptable temporary location: `workspace/devops/port-and-env-conventions.md`

**Purpose**
- define canonical env names and ports across docs, local run, CI, and future deploy work

**Current-state note**
- current tree has multiple potential runtime entry surfaces
- root `README.md` already states the canonical ports and should remain aligned with this file

**Install step**
1. copy to `workspace/docs/port-and-env-conventions.md` when platform is ready
2. use this conventions file as the editing reference for:
   - `workspace/.env.example`
   - `workspace/docker-compose.yml`
   - `workspace/.github/workflows/ci.yml`
   - root `README.md`

## Current ports and documented expectations
These values are the current intended Sprint 1 defaults and should stay aligned across all integrated files:
- frontend: `3000`
- backend: `4000`
- websocket reserve: `4001`
- redis: `6379`

Current public/local env names expected by templates:
- `FRONTEND_PORT`
- `BACKEND_PORT`
- `API_PORT`
- `WS_PORT`
- `REDIS_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `VITE_API_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `DATABASE_URL`
- `REDIS_URL`
- `PORT`
- `SESSION_SECRET`
- `JWT_SECRET`
- `LOG_LEVEL`

## Script and package-name handling note
The live workspace contains root and app package manifests, but this guide should not invent script names beyond what platform verifies in:
- `workspace/package.json`
- `workspace/apps/frontend/package.json`
- `workspace/apps/backend/package.json`
- `workspace/packages/contracts/package.json`
- `workspace/backend/package.json`

If any package name or script differs from the current devops templates, platform should update the integrated root artifact to match the real manifest rather than forcing the manifest to match the template.

## Recommended install order
1. install `workspace/.env.example`
2. install `workspace/docker-compose.yml`
3. install `workspace/.github/workflows/ci.yml`
4. publish `workspace/docs/port-and-env-conventions.md`
5. publish `workspace/docs/deploy-skeleton.md`

## Post-install validation checklist
After platform applies the templates, confirm:

### Files
- `workspace/.env.example` exists
- `workspace/docker-compose.yml` exists
- `workspace/.github/workflows/ci.yml` exists
- `workspace/docs/deploy-skeleton.md` exists
- `workspace/docs/port-and-env-conventions.md` exists or `workspace/devops/port-and-env-conventions.md` remains the active reference

### Alignment
- ports in root docs match env and compose
- root `package.json` remains the integration anchor
- `pnpm-workspace.yaml` still reflects current workspace package layout
- `apps/frontend`, `apps/backend`, and `packages/contracts` manifests still exist
- `frontend/` and `backend/` implementation folders are handled explicitly, not implicitly assumed away

## Cleanup path after layout convergence
Once platform settles the final runtime layout:
- remove env compatibility entries that are no longer needed
- remove duplicate runtime lanes from compose/CI
- simplify deploy documentation to the final chosen app structure