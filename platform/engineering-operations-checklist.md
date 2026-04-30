# Pika engineering operations checklist

Derived from `workspace/platform/shared-engineering-foundations.md`  
Status: actionable now  
Audience: backend, frontend, devops, and cross-functional eng leads

---

## 0) Active paths vs duplicate scaffolds

### Active implementation paths — use these now
- Backend: `workspace/backend/`
- Frontend: `workspace/frontend/`
- Shared contracts: `workspace/packages/contracts/`
- Engineering docs: `workspace/docs/`, `workspace/devops/`, `workspace/platform/`

### Duplicate/parallel scaffolds — do not treat as source of truth
- `workspace/apps/backend/`
- `workspace/apps/frontend/`

### Rule for all teams
Until CTO says otherwise:
- ship code changes in `backend/` and `frontend/`,
- treat `apps/*` as duplicate scaffold paths,
- do not split active work across both structures,
- do not update docs/scripts to point at `apps/*` unless the repo is formally consolidated there.

---

## 1) Repo-structure corrections teams should follow now

### Immediate operating standard
- Backend work goes in `backend/`
- Frontend work goes in `frontend/`
- Contract examples and shared payload references come from `packages/contracts/`
- Local setup and runtime conventions come from:
  - `docs/local-development.md`
  - `devops/port-and-env-conventions.md`

### Do now
- When opening or reviewing PRs, verify changed files are in active paths.
- When adding package scripts, add them to active package manifests first.
- When updating docs, reference active paths explicitly.
- When wiring frontend to backend, use the canonical contract authority model from project metadata:
  - backend defines canonical v1 contract,
  - frontend conforms after publication.

### Do not do now
- Do not add new feature work in `apps/backend` or `apps/frontend`.
- Do not assume root-level scripts automatically target the active app paths.
- Do not introduce a third app layout.
- Do not treat both `.jsx` and `.tsx` entry flows as equally canonical in frontend implementation decisions; prefer the path already being actively integrated.

---

## 2) Backend implementation checklist

Use `workspace/backend/`.

### Runtime and API checklist
- [ ] Keep active service entrypoint changes inside `backend/src/`
- [ ] Confirm route changes align with current route files:
  - `backend/src/routes/health.js`
  - `backend/src/routes/pikaItems.js`
  - `backend/src/routes/rooms.js`
- [ ] Keep controller/service/storage changes aligned with existing module split:
  - controllers in `backend/src/controllers/`
  - services in `backend/src/services/`
  - storage in `backend/src/storage/`
- [ ] Update `backend/src/config/env.js` when adding any backend env dependency
- [ ] Keep API payloads aligned with backend-owned contract definitions and published contract artifacts
- [ ] Verify any new endpoint paths remain compatible with frontend’s current `/api/v1` expectations

### Contract and integration checklist
- [ ] Check `packages/contracts/` before changing payload shapes
- [ ] If backend changes canonical request/response shape, publish/update the contract artifact before expecting frontend to conform
- [ ] Preserve compatibility with existing sample payloads where possible
- [ ] Flag any mismatch between implemented responses and contract examples as an integration issue, not a frontend-only problem

### Quality checklist
- [ ] Use current backend package scripts from `backend/package.json`
- [ ] Run the documented local backend workflow from `docs/local-development.md`
- [ ] Confirm env assumptions match `devops/port-and-env-conventions.md`
- [ ] If adding a command, prefer standard names: `dev`, `start`, `test`, `lint`, `format`
- [ ] If no backend lint/test command exists yet, note the gap in the PR instead of inventing undocumented standards silently

### Watch-outs
- Mixed JS/TS files exist in backend (`index.js`, `index.ts`, `types/*.ts`)
- Treat this as a migration/cleanup issue, not a reason to fork implementation paths
- Avoid creating duplicate logic in both JS and TS entrypoints

---

## 3) Frontend implementation checklist

Use `workspace/frontend/`.

### App and screen checklist
- [ ] Make active app changes in `frontend/src/`
- [ ] Keep routing/screen changes inside the existing active frontend structure
- [ ] Prefer the currently integrated app path over dormant duplicate scaffolds
- [ ] Verify API wiring matches backend-owned contract outputs
- [ ] Keep any API client changes aligned with `frontend/src/lib/roomClient.ts`

### Current frontend structure to work with
- app entry files exist:
  - `frontend/src/main.tsx`
  - `frontend/src/App.tsx`
  - `frontend/src/App.jsx`
- test config exists:
  - `frontend/playwright.config.js`
- happy-path E2E exists:
  - `frontend/tests/happy-path.spec.js`

### Practical operating rule
- [ ] Treat `frontend/` as active
- [ ] Prefer the TS/Vite path already used by `main.tsx`, typed components, and `roomClient.ts`
- [ ] Avoid deepening duplicated JSX/TSX parallel screen implementations unless required for immediate integration
- [ ] When editing old JSX flow screens, ensure they do not diverge from the integrated TS flow expectations

### Quality checklist
- [ ] Use current frontend package scripts from `frontend/package.json`
- [ ] Run the local frontend workflow documented in `docs/local-development.md`
- [ ] Use Vite config already present in `frontend/`
- [ ] Run Playwright happy-path coverage if frontend flow/API wiring changes
- [ ] If adding scripts, prefer standard names: `dev`, `build`, `preview`, `test:e2e`, `lint`, `format`

### Watch-outs
- Both `vite.config.js` and `vite.config.ts` exist
- Both `App.jsx` and `App.tsx` exist
- Both JSX prototype screens and TSX integrated screens exist

These are cleanup risks, not immediate blockers. Do not spread new feature work across all parallel files without deciding which flow is actually active for the change.

---

## 4) DevOps implementation checklist

Use `workspace/devops/` as the documentation and deployment convention source.

### Environment and deploy checklist
- [ ] Keep port/env decisions aligned with `devops/port-and-env-conventions.md`
- [ ] Keep local integration guidance aligned with `devops/integration-guide.md`
- [ ] Use `devops/docker-compose.yml` as the current compose reference
- [ ] Treat `devops/deploy-skeleton.md` and `devops/preview-deployment-audit.md` as planning baselines, not proof of finalized production deployment
- [ ] Ensure any deployment or CI proposal references active app paths (`frontend/`, `backend/`) rather than `apps/*`

### CI/validation checklist
- [ ] Map any CI workflow to current package/script reality before adoption
- [ ] Use `devops/ci-workflow-template.yml` as a template only
- [ ] Verify all referenced commands actually exist in active package manifests before calling CI “ready”
- [ ] Keep preview/prod environment variable naming consistent with the env conventions doc

### Cross-team handoff checklist
- [ ] If devops writes infra guidance, call out which app paths are active
- [ ] If an env var is introduced by backend/frontend, require it to be documented in devops conventions
- [ ] If deployment assumptions depend on root workspaces, verify root `package.json` actually targets the active packages

---

## 5) Required env/config file conventions

These are the working conventions teams should follow now based on current docs and visible code.

### Source-of-truth docs
- `workspace/docs/local-development.md`
- `workspace/devops/port-and-env-conventions.md`

### Required practices
- [ ] Reuse existing env variable names before creating new ones
- [ ] Document every new env variable in `devops/port-and-env-conventions.md`
- [ ] Keep backend-only secrets backend-only
- [ ] Do not expose secret values through frontend/Vite environment configuration
- [ ] Keep local/dev/prod naming consistent across docs and code
- [ ] When backend needs a new variable, reflect it in `backend/src/config/env.js`
- [ ] When frontend needs a runtime configuration value, ensure it is intended for browser exposure and matches the Vite-based configuration approach already in use

### Current missing pieces teams should account for
The visible workspace does **not** prove the presence of:
- checked-in `.env.example` files,
- a single env matrix per service,
- one shared env schema package,
- finalized production secret injection documentation.

### Operating rule while those are missing
- [ ] Do not invent undocumented env names ad hoc
- [ ] Add documentation updates in the same change when config surface changes
- [ ] Flag missing example-file support as a follow-up if it slows onboarding, but do not block active feature wiring on it unless a variable is truly unknown

---

## 6) Standard local/dev/lint-test-run commands

This section is intentionally conservative: it reflects current manifests/docs structure rather than inventing a future standard.

## Repo/root
- [ ] Install dependencies from repo root using the package manager expected by the root `package.json`
- [ ] Use root scripts only after confirming they point to active paths
- [ ] If a root script targets `apps/*` instead of `frontend/` or `backend/`, treat it as non-authoritative for current implementation work

## Backend
Run from `workspace/backend/` using commands defined in `backend/package.json`.

Expected command categories from current manifest/layout:
- [ ] `dev` — local backend development
- [ ] `start` — backend start/runtime entry
- [ ] additional commands only if present in the package manifest

Working standard:
- [ ] use the package’s existing commands, not guessed alternates
- [ ] if no `lint` or `test` command exists, record that as a repo gap
- [ ] verify backend starts with the env/port assumptions in the docs

## Frontend
Run from `workspace/frontend/` using commands defined in `frontend/package.json`.

Expected command categories from current manifest/layout:
- [ ] `dev`
- [ ] `build`
- [ ] `preview`
- [ ] Playwright/E2E command if defined in package manifest

Working standard:
- [ ] run frontend locally through the active Vite package
- [ ] run Playwright happy-path coverage for major room-flow changes
- [ ] if `lint` or `format` scripts are absent, note the gap instead of silently skipping quality checks in status reporting

## Contracts
Run from `workspace/packages/contracts/` using commands defined in `packages/contracts/package.json`.

Working standard:
- [ ] use package scripts that already exist
- [ ] do not create frontend/backend-local copies of contract artifacts
- [ ] use contract samples for request/response verification during integration

---

## 7) Immediate team execution checklist

## Backend team
- [ ] Continue implementation in `backend/`, not `apps/backend/`
- [ ] Wire/maintain `/api/v1` compatibility for frontend integration
- [ ] Keep env additions synced to `backend/src/config/env.js` and devops env docs
- [ ] Publish contract changes before expecting frontend conformance
- [ ] Avoid duplicating logic across JS and TS entry files

## Frontend team
- [ ] Continue implementation in `frontend/`, not `apps/frontend/`
- [ ] Wire real endpoints against backend-owned contracts
- [ ] Prefer typed/shared current client flow over duplicating prototype paths
- [ ] Run existing happy-path E2E when room flow changes
- [ ] Keep config changes aligned with current Vite/env conventions

## DevOps team
- [ ] Point all operational guidance to active app paths
- [ ] Validate CI/deploy templates against current package scripts before rollout
- [ ] Keep env naming/docs current as services evolve
- [ ] Treat preview/prod deployment docs as in-progress unless and until final targets are declared

---

## 8) Unresolved technical gaps

These are real gaps, but **not all require CTO arbitration**.

### Gaps teams can work around now
- duplicate scaffold paths under `apps/*`
- mixed JS/TS files in backend
- mixed JSX/TSX app surfaces in frontend
- unclear maturity of repo-wide lint/format standards
- lack of visible example env files in the current workspace excerpt

These should be tracked and reduced, but they do **not** currently hard-block active backend/frontend shipping.

### Gaps that require CTO arbitration only if they block work
1. **Canonical app layout decision**
   - Needed only if root scripts/CI/deploy or team ownership becomes ambiguous enough to cause conflicting implementation.
   - Current workaround: use `backend/` and `frontend/` as active paths.

2. **Canonical frontend entry flow decision**
   - Needed only if `App.jsx` vs `App.tsx` or JSX vs TSX screen trees begin producing conflicting user flows or review confusion.
   - Current workaround: prefer the typed/integrated active flow already tied to `main.tsx` and shared client code.

3. **Root workspace/script targeting**
   - Needed only if teams must rely on root-run commands and those commands target the wrong package set.
   - Current workaround: run package-local commands from active app directories.

4. **Canonical contract artifact path verification**
   - Needed only if the backend/front-end integration cannot confirm the metadata-declared contract artifact exists at the exact path:
     `workspace/packages/contracts/pika-vertical-slice.json`
   - Current workaround: use the existing `packages/contracts/` package materials while backend confirms the artifact path.

---

## 9) Blocking verdict

### Current status
- Backend: not hard blocked
- Frontend: not hard blocked
- DevOps: not hard blocked
- Cross-team integration: workable with care

### Highest-priority cleanup decision
When leadership is ready, the most valuable repo correction is:
- declare one canonical app layout,
- point root scripts/CI/docs there,
- deprecate the duplicate scaffold path.

Until then, the operational standard in this checklist is sufficient for teams to continue shipping.