# Sprint 1 DevOps Template Integration Guide

This guide describes how to integrate the `workspace/devops/` template bundle into the live workspace without guessing beyond the current artifact tree.

## Why these templates are staged here
Devops is currently scoped to:
- `workspace/devops/`
- `workspace/shared/`

So this directory is the approved source-of-truth staging area for root operational artifacts that platform will install.

## Current workspace state this guide is based on

### Present monorepo root
Observed now:
- `workspace/package.json`
- `workspace/pnpm-workspace.yaml`
- `workspace/README.md`
- `workspace/apps/frontend/package.json`
- `workspace/apps/frontend/src/index.ts`
- `workspace/apps/backend/package.json`
- `workspace/apps/backend/src/index.ts`
- `workspace/packages/contracts/package.json`
- `workspace/packages/contracts/src/index.ts`

### Present legacy backend
Observed now:
- `workspace/backend/package.json`
- `workspace/backend/src/index.js`
- `workspace/backend/src/config/env.js`
- `workspace/backend/src/routes/health.js`
- `workspace/backend/src/routes/rooms.js`

### Important current-state note
The workspace contains both:
1. a new pnpm monorepo app layout under `apps/` and `packages/`
2. a still-active standalone Node backend under `backend/`

Templates below therefore target the monorepo as the preferred path, while keeping explicit compatibility for the standalone backend.

## Template-by-template integration map

### 1) `workspace/devops/.env.example`
**Intended destination**
- `workspace/.env.example`

**Purpose**
- establish one shared local env naming contract across monorepo apps and the legacy backend

**Current-state note**
- no root `workspace/.env.example` is visible in the current workspace tree
- legacy backend likely still expects `PORT`, while monorepo services should converge on `BACKEND_PORT` / `API_PORT`

**Install step**
1. copy `workspace/devops/.env.example` to `workspace/.env.example`
2. preserve both canonical variables and the compatibility `PORT=4000` line
3. if platform adds app-specific wrappers later, map `BACKEND_PORT` into runtime-specific env injection

### 2) `workspace/devops/docker-compose.yml`
**Intended destination**
- `workspace/docker-compose.yml`

**Purpose**
- provide a local stack for monorepo frontend/backend plus redis, with a gated legacy backend fallback profile

**Current-state note**
- no root `workspace/docker-compose.yml` is visible
- `workspace/apps/frontend/package.json` and `workspace/apps/backend/package.json` exist
- `workspace/backend/package.json` also exists, so a legacy path is still needed

**Install step**
1. copy `workspace/devops/docker-compose.yml` to `workspace/docker-compose.yml`
2. keep `apps-backend` as the default backend service
3. keep `apps-frontend` as the default frontend service
4. keep `backend-legacy` behind the `legacy` profile only
5. confirm package names in:
   - `workspace/apps/frontend/package.json`
   - `workspace/apps/backend/package.json`
6. if names differ from template filters, update:
   - `pnpm --filter @pika/frontend dev`
   - `pnpm --filter @pika/backend dev`

### 3) `workspace/devops/ci-workflow-template.yml`
**Intended destination**
- `workspace/.github/workflows/ci.yml`

**Purpose**
- create a safe CI baseline that verifies monorepo setup and separately checks the standalone backend while both exist

**Current-state note**
- no root CI workflow is visible in the current tree
- root `workspace/package.json` and `workspace/pnpm-workspace.yaml` exist
- legacy backend has an independent `package.json`

**Install step**
1. create directories `workspace/.github/workflows/` if missing
2. copy `workspace/devops/ci-workflow-template.yml` to `workspace/.github/workflows/ci.yml`
3. verify package names match the filters:
   - `@pika/frontend`
   - `@pika/backend`
   - `@pika/contracts`
4. keep `--if-present` script invocations until lint/typecheck/test/build scripts stabilize

### 4) `workspace/devops/deploy-skeleton.md`
**Intended destination**
- preferred: `workspace/docs/deploy-skeleton.md`
- alternate: a platform-selected deployment runbook path

**Purpose**
- define a deployment pipeline skeleton without inventing final hosting decisions

**Current-state note**
- the workspace has no visible deploy runbook at the root docs level
- both monorepo and legacy backend paths are still present, so deployment should prefer monorepo while documenting temporary fallback support

**Install step**
1. copy `workspace/devops/deploy-skeleton.md` to `workspace/docs/deploy-skeleton.md`
2. mark `workspace/apps/frontend` and `workspace/apps/backend` as preferred deploy sources
3. mark `workspace/backend` as temporary until parity/migration is complete

### 5) `workspace/devops/port-and-env-conventions.md`
**Intended destination**
- preferred: `workspace/docs/port-and-env-conventions.md`
- acceptable temporary location: keep under `workspace/devops/`

**Purpose**
- define the canonical Sprint 1 naming contract for ports and env variables

**Current-state note**
- current tree shows multiple app surfaces and multiple possible runtime env conventions
- this file is needed to prevent drift while platform performs root integration

**Install step**
1. copy to `workspace/docs/port-and-env-conventions.md` when platform is ready
2. use it as the reference when editing:
   - `workspace/.env.example`
   - `workspace/docker-compose.yml`
   - `workspace/.github/workflows/ci.yml`

## Install order
1. install `.env.example`
2. install `docker-compose.yml`
3. install CI workflow
4. publish port/env conventions doc
5. publish deploy skeleton doc

## Post-install validation checklist
After platform copies templates into root destinations, verify:

- `workspace/.env.example` exists
- `workspace/docker-compose.yml` exists
- `workspace/.github/workflows/ci.yml` exists
- `workspace/docs/deploy-skeleton.md` exists
- `workspace/docs/port-and-env-conventions.md` exists or `workspace/devops/port-and-env-conventions.md` remains the referenced source

Then verify current artifact alignment:
- `workspace/package.json` still represents the pnpm workspace root
- `workspace/pnpm-workspace.yaml` still exists
- `workspace/apps/frontend/package.json` still exists
- `workspace/apps/backend/package.json` still exists
- `workspace/backend/package.json` still exists if legacy support is still needed

## Known assumptions that must be checked during install
- monorepo package names match:
  - `@pika/frontend`
  - `@pika/backend`
  - `@pika/contracts`
- `apps/frontend` exposes a `dev` script
- `apps/backend` exposes a `dev` script
- `workspace/backend` exposes `npm run dev`

## Cleanup path after backend convergence
Once `workspace/apps/backend` replaces `workspace/backend` operationally:
- remove `PORT` from shared env templates if no longer needed
- remove the `backend-legacy` compose profile
- remove the legacy backend CI job
- simplify deploy documentation to monorepo-only paths