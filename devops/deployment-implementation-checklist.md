# Deployment Implementation Checklist

## Purpose
This document is the authoritative concise spec for the remaining deployment/repo artifacts that must be created by the team with write access to the affected paths.

Pika product purpose: **Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.**

## Scope
This checklist covers the missing implementation artifacts for:
- CI validation on push and pull request
- frontend preview deployment configuration
- backend container packaging
- backend environment variable documentation

## Required artifact paths
The following files are required at these exact paths:

1. `workspace/.github/workflows/ci.yml`
2. `workspace/frontend/vercel.json`
3. `workspace/backend/Dockerfile`
4. `workspace/backend/.env.example`

---

## 1) `workspace/.github/workflows/ci.yml`

### Goal
Provide a minimum GitHub Actions workflow that validates the current frontend/backend/contracts workspace on pushes and pull requests without assuming non-existent scripts.

### Required behavior
The workflow must:
- trigger on `push`
- trigger on `pull_request`
- use a current Node runtime (Node 20 preferred)
- install dependencies for each validated package path
- run build commands only when present
- avoid assuming a `test` script exists
- validate that the backend can at least load/import its runtime entry
- validate that the backend env example file exists
- validate the contracts package as an artifact package if present in `workspace/packages/contracts`

### Required jobs
At minimum include these jobs:

#### Frontend job
Working directory:
- `workspace/frontend`

Must do:
- checkout repository
- setup Node
- run `npm install`
- run `npm run build --if-present`
- optionally perform a simple package sanity check

#### Backend job
Working directory:
- `workspace/backend`

Must do:
- checkout repository
- setup Node
- run `npm install`
- run `npm run build --if-present`
- run a smoke validation against the backend entrypoint
  - expected current target: `src/index.js`
- verify `.env.example` exists

#### Contracts job
Working directory:
- `workspace/packages/contracts`

Must do:
- checkout repository
- setup Node
- run `npm install`
- run `npm run build --if-present`
- optionally validate package metadata

### Guardrails
- Do not require lockfiles if they are not guaranteed to exist.
- Prefer `npm install` over `npm ci` unless lockfile presence is confirmed.
- Do not add deploy steps to CI.
- Do not claim CI performs production release.
- Keep the workflow validation-oriented, not release-oriented.

### What good looks like
A good CI workflow:
- runs successfully on GitHub-hosted runners with no manual setup beyond repository checkout
- catches obvious install/build/import breakage
- does not fail merely because a package lacks `test` or `build` scripts beyond what is guarded with `--if-present`
- gives engineering a reliable minimum quality gate for pull requests

### Acceptance criteria
- File exists at `workspace/.github/workflows/ci.yml`
- YAML parses as a GitHub Actions workflow
- Workflow triggers on `push` and `pull_request`
- Contains separate validation for frontend and backend
- Backend job checks `.env.example`
- Workflow does not assume unavailable scripts beyond safe install/build behavior

---

## 2) `workspace/frontend/vercel.json`

### Goal
Provide a minimum preview/prod deployment configuration for the current frontend app hosted on Vercel.

### Required behavior
The file must:
- identify the project as a Vite-style frontend
- install dependencies
- build the app
- publish the build output directory
- support client-side routing for SPA paths

### Required contents
At minimum specify:
- framework: `vite`
- install command: `npm install`
- build command: `npm run build`
- output directory: `dist`
- rewrite rule routing unmatched paths to `/index.html`

### Guardrails
- Do not invent frontend environment variables unless already confirmed elsewhere.
- Do not add backend rewrites/proxies unless explicitly approved.
- Keep the config minimal and SPA-safe.

### What good looks like
A good `vercel.json`:
- allows preview deployments from the current `workspace/frontend` app
- serves static Vite output correctly
- allows deep links and refreshes on app routes without 404s

### Acceptance criteria
- File exists at `workspace/frontend/vercel.json`
- JSON is valid
- Output directory is `dist`
- Includes SPA rewrite to `/index.html`
- Uses `npm install` and `npm run build`

---

## 3) `workspace/backend/Dockerfile`

### Goal
Provide a minimum production-ready container build path for the backend service.

### Required behavior
The Dockerfile must:
- use a current Node base image (Node 20 preferred)
- set a working directory
- copy package metadata first for cache efficiency
- install production dependencies only
- copy backend source files required to run the service
- expose the backend port
- start the current backend entrypoint

### Required contents
At minimum include:
- `FROM node:20-alpine` (preferred)
- `WORKDIR /app`
- `ENV NODE_ENV=production`
- `COPY package*.json ./`
- install dependencies with production-only intent
  - acceptable example: `RUN npm ci --omit=dev` if lockfile use is valid in the target repo
  - acceptable fallback: `RUN npm install --omit=dev`
- `COPY src ./src`
- optionally copy README or other runtime-needed non-secret files
- `EXPOSE 3001`
- `CMD ["node", "src/index.js"]`

### Guardrails
- Do not copy `.env` into the image.
- Do not require dev tooling at runtime.
- Do not add a healthcheck unless the hosting target is known and the app’s health route is confirmed for that platform.
- Do not assume TypeScript compilation at container runtime unless the backend is explicitly set up for that path.

### What good looks like
A good Dockerfile:
- builds a small production image
- starts the backend with the visible JS runtime entrypoint
- avoids bundling secrets
- aligns with the backend’s current structure under `workspace/backend`

### Acceptance criteria
- File exists at `workspace/backend/Dockerfile`
- Dockerfile is syntactically valid
- Uses a Node base image
- Installs production dependencies
- Copies source code
- Exposes port `3001`
- Starts `src/index.js`

---

## 4) `workspace/backend/.env.example`

### Goal
Document the backend environment variables required for local, preview, and production deployment setup.

### Required behavior
The file must:
- be safe to commit
- contain placeholders/examples only
- document the minimum currently expected backend variables

### Required contents
At minimum include:
- `PORT=3001`
- `NODE_ENV=production`
- `CORS_ORIGIN=http://localhost:5173`

Optional but useful:
- `APP_NAME=Pika API`
- `LOG_LEVEL=info`

### Guardrails
- No secrets
- No real credentials
- No production-only secret values
- Keep examples aligned with current frontend local dev origin unless a different origin has been formally chosen

### What good looks like
A good `.env.example`:
- lets a teammate understand required runtime configuration immediately
- mirrors the shape expected by backend env parsing
- is safe to publish in the repo

### Acceptance criteria
- File exists at `workspace/backend/.env.example`
- Contains only placeholder/sample values
- Documents `PORT`, `NODE_ENV`, and `CORS_ORIGIN`
- Contains no real secrets

---

## Artifact/build validation standard

### Minimum standard
“Artifact/build validation” is considered complete when:
- frontend dependencies install successfully
- frontend build succeeds if a build script exists
- backend dependencies install successfully
- backend build succeeds if a build script exists
- backend entrypoint can be import-smoke-checked without crashing due to syntax/module resolution issues
- contracts package installs and optionally builds if present

### Non-goals for this phase
The following are explicitly not required for minimum acceptance:
- production deployment automation
- CD to a live environment
- mandatory unit test execution
- end-to-end browser test execution
- infra provisioning
- secrets manager automation

---

## Preview deployment standard

### Minimum standard
“Preview deployment path available” is considered satisfied when:
- the frontend has a host config suitable for Vercel previews
- the app can build from the frontend directory
- generated assets are served from `dist`
- SPA routes resolve through rewrite to `index.html`

### Good preview outcome
A reviewer can:
- open a preview URL
- land on the current frontend app
- refresh on a nested route without a 404
- verify the app shell loads successfully

### Not required for minimum preview acceptance
- authenticated preview environments
- backend preview auto-provisioning
- fully wired production API endpoint
- branch-based protected release promotion

---

## Suggested implementation shape

### Reference CI shape
A compliant workflow will look roughly like:
- workflow name: `CI`
- events: `push`, `pull_request`
- jobs:
  - `frontend`
  - `backend`
  - `contracts`

### Reference frontend deployment shape
A compliant `vercel.json` will roughly contain:
- `framework`
- `installCommand`
- `buildCommand`
- `outputDirectory`
- `rewrites`

### Reference backend container shape
A compliant `Dockerfile` will roughly contain:
- Node Alpine base image
- working directory
- production env declaration
- package copy
- production dependency install
- source copy
- exposed port
- Node start command

### Reference env example shape
A compliant `.env.example` will roughly contain:
- port
- node environment
- allowed frontend origin
- optional metadata/logging defaults

---

## Final acceptance gate
The missing repo artifact set is complete only when all four files exist at the required paths and each satisfies the acceptance criteria in this document.

If one artifact lands without the others, deployment readiness remains **partial** rather than complete.