# Platform scaffolding manifest for devops contract reconstruction

## Scope
Compact repo/dev scaffolding assumptions only, reconstructed from the current workspace tree.

## Canonical repo layout observed
- Preferred active app layout appears to be:
  - `workspace/apps/frontend/`
  - `workspace/apps/backend/`
- Additional legacy or parallel app trees also exist:
  - `workspace/frontend/`
  - `workspace/backend/`

## Canonical app paths to use for preview/dev assumptions
Use these as the current platform-level canonical paths unless CTO says otherwise:
- frontend app: `apps/frontend/`
- backend app: `apps/backend/`

Reason:
- Both exist under a normalized `apps/` container.
- Project context points to a shared-contract path pattern under `workspace/packages/...`, which aligns more naturally with an app/package style repo than with top-level `frontend/` + `backend/`.
- Devops specifically asked whether preview should target `frontend/` or `apps/frontend/`; current platform recommendation is `apps/frontend/`.

## Package manager assumption
Unknown from available tree only.

Observed:
- `package.json` files exist in multiple app locations.
- No lockfile is present in the provided tree excerpt:
  - no `package-lock.json`
  - no `pnpm-lock.yaml`
  - no `yarn.lock`
  - no root `bun.lock*`
- No root `package.json` is visible.

Platform verdict:
- Do **not** assume npm/pnpm/yarn conclusively from current evidence.
- For docs/manifests, phrase as generic package-manager commands unless a lockfile or root tool config lands.

## Root/workspace assumptions
Observed at workspace root:
- `.gitignore`
- `apps/`
- `auth/`
- `backend/`
- `brand/`
- `devops/`
- `docs/`
- `frontend/`
- `growth/`

Not observed:
- root `package.json`
- root monorepo config (`pnpm-workspace.yaml`, turbo, nx, lerna, etc.)
- root env template
- `packages/` directory, despite project context naming `workspace/packages/contracts/pika-vertical-slice.json`

Platform conclusion:
- The repo currently reads like a mixed state: partial monorepo intent, but no confirmed root package/workspace scaffold.
- Devops should not document root-level install/run as authoritative yet.
- Prefer per-app install/run instructions until a root workspace manifest exists.

## Recommended local run command shape
Because package manager and root workspace tooling are unconfirmed, use per-app command placeholders in reliability docs:

### Frontend
- working directory: `apps/frontend/`
- run shape: `<pkg-manager> install`
- dev shape: `<pkg-manager> run dev`

### Backend
- working directory: `apps/backend/`
- run shape: `<pkg-manager> install`
- dev shape: `<pkg-manager> run dev`

### What not to assume yet
Do not state as fact:
- `npm install` at repo root
- `pnpm install` at repo root
- workspace-wide `dev` orchestration from root
- turbo/nx/pnpm workspace commands
- docker-first local development

## Shared env file conventions
No platform-confirmed shared env convention is visible from the tree.

Observed:
- backend has `backend/src/config/env.js` in the legacy tree.
- no root `.env.example` shown
- no `apps/frontend/.env.example` shown
- no `apps/backend/.env.example` shown in the tree excerpt

Recommended convention for docs until confirmed by app owners:
- frontend local env file: `apps/frontend/.env.local`
- backend local env file: `apps/backend/.env`
- shared checked-in templates, when created:
  - `apps/frontend/.env.example`
  - `apps/backend/.env.example`

But this is a recommendation only, **not** a verified current artifact.

## Preview deployment target
Recommended preview deploy target:
- `apps/frontend/`

Do not point preview at:
- `frontend/`

Reason:
- `apps/frontend/` is the cleaner platform path for the active normalized app layout.
- Using the top-level `frontend/` would reinforce the duplicate-tree ambiguity.

## Mismatches and structural risks in the provided tree
1. **Duplicate frontend app trees**
   - `apps/frontend/` exists
   - `frontend/` also exists
   - These are not minor mirrors; both contain app code and package manifests.

2. **Duplicate backend app trees**
   - `apps/backend/` exists
   - `backend/` also exists
   - `backend/` is substantially larger and more implementation-heavy than `apps/backend/`.

3. **No visible root workspace manifest**
   - Missing root `package.json` / workspace config makes `apps/` canonicalization incomplete.

4. **Contract-path mismatch**
   - Project metadata says canonical contract path is:
     - `workspace/packages/contracts/pika-vertical-slice.json`
   - Provided tree excerpt does not show `workspace/packages/`
   - This is a structural mismatch that may block shared-contract expectations.

5. **Mixed language/runtime signals**
   - `apps/backend/src/index.ts`
   - `backend/src/index.js` and `backend/src/index.ts`
   - `frontend/src/App.jsx` and `frontend/src/App.tsx`
   - `frontend/vite.config.js` and `frontend/vite.config.ts`
   - This suggests parallel migration or duplicate implementations, not one settled scaffold.

6. **Preview ambiguity**
   - `frontend/vercel.json` exists under legacy top-level frontend tree.
   - No equivalent preview config is visible under `apps/frontend/`.
   - If devops documents `apps/frontend/` as preview target, preview config may need to be recreated there later.

7. **Dev docs likely drifted across duplicate trees**
   - Existing `docs/local-development.md` and devops deployment notes may describe a path layout that no longer matches the preferred `apps/` convention.

## Safe devops interpretation for this round
For local/dev + preview briefing, use this language:
- "Current preferred app paths are `apps/frontend` and `apps/backend`, but the repo contains legacy duplicate trees at `frontend/` and `backend/`."
- "Until root workspace tooling is confirmed, install and run from each app directory individually."
- "Preview should be framed against `apps/frontend/`, with a note that existing preview config is currently visible only under legacy `frontend/`."

## Platform verdict
- `preview deploy target`: `apps/frontend/`
- `canonical app paths`: `apps/frontend/`, `apps/backend/`
- `package manager`: unconfirmed
- `root workspace commands`: unconfirmed; do not assert
- `shared env convention`: unconfirmed; recommend per-app templates, not as established fact
- `repo state`: mixed/duplicated scaffold requiring later normalization