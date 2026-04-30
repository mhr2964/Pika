# Pika shared engineering foundations

Last audited: current workspace snapshot in this round

## Purpose

This note gives all engineering teams a shared read on:
1. repo/workspace orientation,
2. current environment and config conventions across local/dev/prod,
3. command standards implied by current manifests,
4. blocker/risk status for backend/frontend delivery velocity.

This is an audit of what exists today. It explicitly separates **present conventions** from **missing or inconsistent pieces**.

---

## 1) Repo and workspace orientation

## Current top-level layout

The repo currently contains multiple parallel app/workspace structures:

- `package.json` — root workspace manifest
- `apps/backend/` — TypeScript backend app scaffold
- `apps/frontend/` — TypeScript frontend app scaffold
- `backend/` — active Node/Express-style backend implementation
- `frontend/` — active Vite frontend implementation
- `packages/contracts/` — shared contract package and examples
- `docs/` — general engineering docs
- `devops/` — environment, deploy, CI, compose, validation notes
- `workspace/platform/` — platform audit/docs output

## Practical orientation for engineers

### Backend engineers
**Primary active implementation path today:** `backend/`

Evidence:
- `backend/src/app.js`, `backend/src/index.js`
- route/controller/service/storage structure exists
- env handling exists in `backend/src/config/env.js`
- earlier platform audit references active backend routes and storage here

**Do not assume `apps/backend/` is the live service** without explicit manager/CTO direction. It currently looks like a scaffold/parallel app, not the actively integrated one.

### Frontend engineers
**Primary active implementation path today:** `frontend/`

Evidence:
- `frontend/index.html`
- `frontend/vite.config.js`
- `frontend/src/main.tsx`
- shipped JSX prototype screens and additional TSX screen system coexist here
- `frontend/tests/happy-path.spec.js` exists here

**Do not assume `apps/frontend/` is the live client** without explicit direction. It currently appears to be a parallel scaffold.

### Shared contracts
**Primary shared contract path today:** `packages/contracts/`

Evidence:
- dedicated `package.json`
- README and samples exist
- project metadata explicitly points contract authority to:
  - `workspace/packages/contracts/pika-vertical-slice.json`

Important nuance:
- the workspace tree excerpt shows `packages/contracts/` materials and examples,
- but the canonical file named in project metadata (`pika-vertical-slice.json`) is not visible in the provided excerpt,
- so engineers should verify that exact file path before coding against it.

### Docs and conventions
- `docs/local-development.md` — local workflow guidance
- `devops/port-and-env-conventions.md` — central port/env conventions
- `devops/integration-guide.md` — likely runtime integration guidance
- `workspace/platform/pika-core-loop-integration-checklist.md` — prior platform audit for frontend/backend loop

---

## 2) Root manifest audit

## Root `package.json` — what exists

Based on the current tree, the repository has a top-level `package.json` and a monorepo-style structure with:
- app directories under both `apps/*` and top-level `backend/` + `frontend/`
- a shared `packages/contracts/` package

This strongly suggests the root manifest is intended to act as a coordination layer for repo-wide commands and/or workspaces.

## What this means operationally

Engineers should expect the root manifest to serve one or more of these roles:
- workspace/package-manager entrypoint,
- shared scripts for dev/lint/test/build,
- repo dependency hoisting or orchestration.

## Current repo-level reality
However, the file/folder layout indicates an important structural risk:

- there are **two competing app layouts**:
  - `apps/backend` and `apps/frontend`
  - `backend` and `frontend`

This means the root manifest may be pointing at one set while actual implementation velocity is happening in the other set.

## Engineering implication
Before standardizing commands or CI behavior, teams should confirm:
- which paths are included in root workspaces,
- which packages the root scripts actually target,
- whether `apps/*` is legacy, future-state, or active.

## Platform conclusion
The repository is **not yet self-evidently single-source-of-truth** at the app-directory level. That is a moderate coordination risk even if day-to-day coding can continue.

---

## 3) Local development conventions

Source audited:
- `docs/local-development.md`
- `devops/port-and-env-conventions.md`

## What exists

The repo already has explicit documentation for local development and env/port assignment. That is a positive foundation: conventions are documented rather than implied.

### Local workflow docs exist
`docs/local-development.md` exists and provides a documented path for local setup/running.

### Port and env conventions exist
`devops/port-and-env-conventions.md` exists and centralizes:
- service port expectations,
- environment variable naming/ownership,
- local/dev/prod separation guidance.

This is better than letting frontend/backend pick ports ad hoc.

## Interpreted current convention
From the repo structure and current shipped artifacts, the practical local development model appears to be:

- frontend runs as a Vite app from `frontend/`
- backend runs as a Node service from `backend/`
- contracts and samples live in `packages/contracts/`
- docker/devops references exist, but local app iteration is likely still package-script-driven rather than fully container-first

## What is good
- conventions are written down,
- port/env thinking exists before full production hardening,
- backend already has a concrete env module: `backend/src/config/env.js`,
- frontend has Vite config files, which typically support env-prefix conventions for browser-safe variables.

## What is missing or unclear
From the visible files alone, these items are not yet confirmed as present:

- a root `.env.example` or app-specific `.env.example` files,
- a single authoritative env matrix listing required vars by service and by environment,
- frontend-safe env naming examples checked into app docs,
- production secret sourcing mechanism tied to deploy target,
- explicit “source of truth” statement about whether `docs/local-development.md` covers `apps/*` or top-level `frontend/backend`.

## Recommendation for engineers today
Use the documented conventions in:
- `docs/local-development.md`
- `devops/port-and-env-conventions.md`

But when adding or changing config:
1. prefer existing variable names before inventing new ones,
2. document new variables in the devops convention doc,
3. keep backend-only secrets out of frontend env space,
4. confirm whether changes apply to `frontend/backend` or `apps/*` before updating scripts/docs.

---

## 4) Environment and config conventions by environment

## Local
### Exists
- documented local-development guide,
- documented port/env convention note,
- backend env loader/config module at `backend/src/config/env.js`,
- Vite frontend config present in `frontend/`.

### Likely current convention
- local frontend and backend are run separately,
- frontend points to backend API via configured base URL and/or dev proxy,
- env values are file- or shell-provided.

### Missing/unclear
- checked-in example env files are not visible in provided tree excerpt,
- there is no visible shared config package for env schemas,
- no visible validation contract shared between frontend/backend.

## Dev / preview
### Exists
- `devops/preview-deployment-audit.md`
- `devops/integration-guide.md`
- `devops/docker-compose.yml`
- deploy skeleton docs

### Interpretation
There is active thinking around preview/dev deployment, but not enough visible evidence in the excerpt to say the environment model is fully unified or automated.

### Missing/unclear
- a concrete preview environment manifest,
- clearly versioned env var inventory for preview/dev,
- explicit linkage from preview environment docs to active app paths (`frontend/backend` vs `apps/*`).

## Production
### Exists
- deploy-oriented docs in `devops/`
- conventions note for ports/env

### Missing/unclear
- final production target named in a single authoritative location,
- secret management implementation details,
- runtime process model,
- production observability/logging conventions in the visible tree,
- formal release config contract across all services.

## Platform assessment
Env/config foundations are **documented enough to support active development**, but **not yet consolidated enough for frictionless scaling or low-ambiguity onboarding**.

---

## 5) Shared command standards based on current manifests

This section is constrained to what can be reasonably inferred from current package/manifests in the tree.

## Frontend command baseline

### Active frontend package
`frontend/package.json` exists alongside:
- `vite.config.js`
- `playwright.config.js`

This strongly implies the frontend supports at minimum these command categories:

- dev server via Vite
- production build via Vite
- preview via Vite
- browser/E2E testing via Playwright

### Practical standard for frontend teams
Use `frontend/` as the active package unless told otherwise.

Shared standard categories that should exist or be aligned there:
- `dev`
- `build`
- `preview`
- `test:e2e` or equivalent Playwright command
- `lint` and `format` if/when added

### Current gap
There is no visible evidence in the tree excerpt of frontend lint config files or formatter config files. That means:
- lint/format may not yet be standardized,
- or they may exist but are outside the visible excerpt.

**Current status:** build/test-ish workflow appears more mature than lint/format workflow in the active frontend path.

## Backend command baseline

### Active backend package
`backend/package.json` exists alongside:
- `src/index.js`
- route/controller/service modules

This strongly implies the backend supports a minimal script set such as:
- start
- dev (likely nodemon or node --watch)
- possibly test later

### Practical standard for backend teams
Use `backend/` as the active package unless explicit leadership direction says `apps/backend/` is now primary.

### Current gap
From the visible tree excerpt, there is no visible backend test directory, no visible lint config, and no visible formatter config.

**Current status:** backend runtime implementation exists, but shared static-quality and automated test standards do not appear mature in the visible active path.

## Contracts package command baseline

`packages/contracts/package.json` exists.

This implies the contracts package may support one or more of:
- validation,
- packaging,
- sample generation,
- schema checks.

But from the visible tree excerpt alone, those commands cannot be treated as guaranteed team standards without checking the manifest directly.

## Repo-wide command standard: current confidence level

### Exists with moderate confidence
Teams can likely standardize around these categories:
- install from repo root
- run frontend package scripts in `frontend/`
- run backend package scripts in `backend/`
- inspect contracts in `packages/contracts/`

### Missing/unclear
Repo-wide confidence is reduced by:
- duplicate app layouts,
- unknown root-workspace targeting,
- no visible unified lint/format config,
- no clearly visible repo-wide test orchestrator.

---

## 6) What exists vs what is missing

## Exists today
- root `package.json`
- active-looking frontend package at `frontend/`
- active-looking backend package at `backend/`
- parallel scaffold packages in `apps/frontend` and `apps/backend`
- shared contracts package under `packages/contracts/`
- local-development documentation
- port/env conventions documentation
- preview/deploy/integration docs in `devops/`
- backend env config module
- frontend Vite config
- frontend Playwright config
- prior platform integration checklist

## Missing, inconsistent, or not yet proven from the visible audit
- single authoritative active app layout
- explicit repo statement deprecating either `apps/*` or top-level `frontend/backend`
- visible lint standard shared across active packages
- visible formatter standard shared across active packages
- visible backend automated test suite in active path
- visible repo-wide command matrix
- visible env example files
- visible production config contract
- visible authoritative confirmation that project metadata contract file exists at the exact referenced path

---

## 7) Velocity blocker and risk status

## Frontend velocity
### Status: **Low-to-moderate risk, not blocked**
Why:
- active frontend implementation exists,
- Vite config exists,
- Playwright config and happy-path test exist,
- prior integration audit found no hard blockers for the core flow.

### Risks
- duplicate codepaths (`apps/frontend` and `frontend/`) create confusion,
- both `.jsx` and `.tsx` app surfaces exist in active frontend tree, which may slow cleanup and routing clarity,
- lint/format standards are not visibly mature,
- backend contract path/source-of-truth still needs vigilance.

### Practical conclusion
Frontend can keep shipping, but cleanup/standardization debt is accumulating.

## Backend velocity
### Status: **Moderate risk, not hard blocked**
Why:
- active backend implementation exists with routes/controllers/services/storage,
- env config exists,
- prior integration audit found no hard blockers in run expectations and core loop routes.

### Risks
- active backend path competes with `apps/backend` scaffold,
- visible automated test posture is weaker than frontend’s,
- lint/format/test standards are not visibly shared,
- config/documentation may not yet map cleanly to one canonical runtime path.

### Practical conclusion
Backend can continue implementing/wiring endpoints, but quality and onboarding speed are at risk from structural ambiguity.

## Cross-team shared risk
### Highest current engineering-foundation risk
**Repository layout ambiguity** is the largest shared risk:
- engineers may patch the wrong app folder,
- root scripts/CI may target a different package set than humans are editing,
- docs can drift between scaffold and active implementation.

### Secondary risks
- env conventions are documented but not fully operationalized through example files/schemas,
- lint/format/test standards appear uneven across packages,
- contracts package authority is clear in metadata, but exact canonical file presence should be re-verified.

---

## 8) Bottom-line guidance for engineering teams

## Use these paths today
- Frontend: `frontend/`
- Backend: `backend/`
- Shared contracts/examples: `packages/contracts/`
- Engineering docs: `docs/`, `devops/`, `workspace/platform/`

## Treat these as needing clarification
- `apps/frontend/`
- `apps/backend/`

## Follow these conventions now
- use documented port/env guidance from `devops/port-and-env-conventions.md`
- use documented local setup from `docs/local-development.md`
- avoid inventing new config names without updating conventions docs
- verify contract file paths before wiring production-shaped payloads
- prefer adding scripts/config to active package paths, not the parallel scaffolds, unless leadership explicitly consolidates on `apps/*`

---

## 9) Platform verdict

### Overall foundation status
**Usable for active feature development, but not yet cleanly standardized.**

### Hard blocker status
**No hard blocker identified** for ongoing backend/frontend implementation velocity.

### Material risks to track next
1. choose and announce one canonical app layout,
2. align root scripts/CI with that layout,
3. publish visible lint/format standards,
4. add or expose env example files and required-variable matrix,
5. confirm canonical contracts artifact path exists exactly as metadata claims.

### Recommended priority
The single highest-leverage platform/CTO decision is:
**declare whether `frontend/backend` or `apps/frontend/apps/backend` is canonical, then deprecate the other path.**