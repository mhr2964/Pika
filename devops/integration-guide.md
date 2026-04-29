# Sprint 1 DevOps Template Integration Guide

This guide explains how to apply the `workspace/devops/` template bundle to the currently visible workspace state.

## Why these files live here
Devops write scope is currently limited to:
- `workspace/devops/`
- `workspace/shared/`

Because of that, this directory acts as the source-of-truth staging area for root-level operational artifacts that would normally live elsewhere.

## Current workspace state this guide is based on

### Monorepo root exists
Observed:
- `workspace/package.json`
- `workspace/pnpm-workspace.yaml`
- `workspace/README.md`
- `workspace/apps/frontend/package.json`
- `workspace/apps/backend/package.json`
- `workspace/packages/contracts/package.json`

### Legacy backend still exists
Observed:
- `workspace/backend/package.json`
- `workspace/backend/src/index.js`
- `workspace/backend/src/config/env.js`

## Template bundle map

| Template source | Intended root destination | Purpose |
|---|---|---|
| `workspace/devops/.env.example` | `workspace/.env.example` | shared local env contract |
| `workspace/devops/docker-compose.yml` | `workspace/docker-compose.yml` | local orchestration for monorepo apps plus optional legacy backend |
| `workspace/devops/ci-workflow-template.yml` | `workspace/.github/workflows/ci.yml` | CI baseline for monorepo plus legacy backend verification |
| `workspace/devops/deploy-skeleton.md` | `workspace/docs/deploy-skeleton.md` | deployment runbook skeleton |
| `workspace/devops/port-and-env-conventions.md` | `workspace/docs/port-and-env-conventions.md` or keep in `devops/` | canonical env/port contract |

## How each template aligns to the current workspace

### 1) `.env.example`
Why:
- root currently lacks a shared env template
- both monorepo apps and legacy backend need aligned naming

How to integrate:
- copy `workspace/devops/.env.example` to `workspace/.env.example`
- if legacy backend requires `PORT`, either add `PORT=${BACKEND_PORT}` in consuming scripts or duplicate a compatibility line during final merge

### 2) `docker-compose.yml`
Why:
- root currently lacks a local orchestration file
- monorepo now exists and should be the default local entrypoint
- legacy backend still needs a temporary path

How to integrate:
- copy `workspace/devops/docker-compose.yml` to `workspace/docker-compose.yml`
- keep `apps-backend` and `apps-frontend` as primary services
- keep `backend-legacy` behind the `legacy` compose profile until migration is complete

Important note:
- the compose template assumes package names/filters:
  - `@pika/frontend`
  - `@pika/backend`
- if app package names differ, update:
  - `pnpm --filter @pika/frontend dev`
  - `pnpm --filter @pika/backend dev`

### 3) CI workflow template
Why:
- root lacks a usable CI workflow under the constrained devops path
- monorepo and legacy backend need different install strategies

How to integrate:
- copy `workspace/devops/ci-workflow-template.yml` to `workspace/.github/workflows/ci.yml`
- confirm actual scripts exist in:
  - `apps/frontend/package.json`
  - `apps/backend/package.json`
  - `packages/contracts/package.json`
  - `backend/package.json`
- the template uses `--if-present` to stay safe during partial scaffolding

### 4) Deploy skeleton
Why:
- no deploy runbook is visible
- multiple runtime surfaces currently coexist

How to integrate:
- move to a docs path chosen by platform, ideally `workspace/docs/deploy-skeleton.md`
- use monorepo apps as preferred deploy sources
- treat standalone `workspace/backend` as temporary

### 5) Port and env conventions
Why:
- current workspace contains multiple app surfaces and potential env naming drift
- frontend framework is not fully settled from visible artifacts alone

How to integrate:
- adopt this file as the canonical naming reference before wiring more scripts
- ensure frontend uses one public API variable
- ensure backend uses `4000` consistently

## Recommended application order
1. apply `.env.example`
2. apply `docker-compose.yml`
3. apply CI workflow
4. publish conventions doc to shared docs
5. wire deploy skeleton after hosting targets are chosen

## Known assumptions to validate during integration
- `workspace/package.json` uses pnpm-based root orchestration
- `workspace/apps/frontend/package.json` package name matches the compose/CI filter
- `workspace/apps/backend/package.json` package name matches the compose/CI filter
- monorepo apps expose `dev` scripts
- legacy backend exposes `npm run dev`

## Suggested cleanup path after convergence
Once `apps/backend` replaces `workspace/backend` operationally:
- remove compose `backend-legacy` profile
- remove legacy CI job
- archive legacy backend-specific env compatibility notes