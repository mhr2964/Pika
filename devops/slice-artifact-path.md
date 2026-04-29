# Pika vertical-slice artifact path

This note gives engineering a single non-deployment reference for where the current slice should land, how to run it locally, what contract surfaces are in play, and which caveats matter before anyone assumes the slice is “fully integrated.”

## Scope

Sources reviewed for this pass:

- `workspace/board-digest.md`
- `workspace/docs/local-development.md`
- `workspace/devops/integration-guide.md`
- `workspace/apps/frontend/package.json`
- `workspace/apps/backend/package.json`
- `workspace/packages/contracts/package.json`

This is guidance for local artifact placement and handoff only. It does **not** imply deployment readiness.

---

## 1) Canonical output paths

### Primary app artifact roots

- Frontend app: `workspace/apps/frontend/`
- Backend app: `workspace/apps/backend/`
- Shared contracts package: `workspace/packages/contracts/`

### Expected file ownership within this slice

#### Frontend
Frontend implementation artifacts for the current vertical slice should be written under:

- `workspace/apps/frontend/src/`
- `workspace/apps/frontend/README.md` for app-specific usage notes if needed

Typical current entry surface:

- `workspace/apps/frontend/src/index.ts`

Frontend should treat `workspace/apps/frontend/` as the canonical app path for this slice, even though there is also a legacy/top-level `workspace/frontend/` tree present in the repo.

#### Backend
Backend implementation artifacts for the current vertical slice should be written under:

- `workspace/apps/backend/src/`
- `workspace/apps/backend/README.md` for app-specific usage notes if needed

Typical current entry surface:

- `workspace/apps/backend/src/index.ts`

Backend should treat `workspace/apps/backend/` as the canonical app path for this slice, even though there is also a separate/top-level `workspace/backend/` tree present in the repo.

#### Contracts
Cross-app type and payload-shape artifacts should be written under:

- `workspace/packages/contracts/src/`

Current shared contract entry surface:

- `workspace/packages/contracts/src/index.ts`

Additional contract sources already present:

- `workspace/packages/contracts/src/api.ts`
- `workspace/packages/contracts/src/domain.ts`
- `workspace/packages/contracts/src/errors.ts`
- `workspace/packages/contracts/src/mocks/happy-path.ts`
- `workspace/packages/contracts/src/mocks/failures.ts`

### Canonical path rule for this round

For the current slice, teams should prefer the monorepo app/package structure:

- `workspace/apps/frontend`
- `workspace/apps/backend`
- `workspace/packages/contracts`

Do **not** treat the top-level legacy directories (`workspace/frontend`, `workspace/backend`) as the destination for new slice code unless a manager explicitly redirects work there. They are useful as references, but they are not the preferred output target for this handoff.

---

## 2) Local start/build commands

Commands below are taken from package manifests and related local-dev docs as the declared local workflow surfaces.

### Frontend (`workspace/apps/frontend`)

From `workspace/apps/frontend/package.json`:

- local dev: `npm run dev`
- build: `npm run build`
- preview: `npm run preview`

Use from:

- working directory: `workspace/apps/frontend`

### Backend (`workspace/apps/backend`)

From `workspace/apps/backend/package.json`:

- local dev: `npm run dev`
- build: `npm run build`
- start compiled output: `npm run start`

Use from:

- working directory: `workspace/apps/backend`

### Contracts (`workspace/packages/contracts`)

From `workspace/packages/contracts/package.json`:

- build: `npm run build`

Use from:

- working directory: `workspace/packages/contracts`

### Workspace-level expectation

The repo also includes workspace-level package metadata, but for this slice the safest interpretation is:

- app teams should validate from their own package directories first
- contracts changes should be built from `workspace/packages/contracts`
- integration confidence currently depends on artifact alignment more than on any declared deployment target

---

## 3) Contract touch points

The current slice spans frontend state flow, backend room/ranking behavior, and shared contracts. The most important touch points are below.

### Shared package to consult first

Primary shared contract package:

- `workspace/packages/contracts/src/index.ts`

Supporting definitions:

- `workspace/packages/contracts/src/api.ts`
- `workspace/packages/contracts/src/domain.ts`
- `workspace/packages/contracts/src/errors.ts`

Mock/reference data already available:

- `workspace/packages/contracts/src/mocks/happy-path.ts`
- `workspace/packages/contracts/src/mocks/failures.ts`

### Frontend contract touch points

Frontend integration-facing areas likely to depend on contract shapes include:

- `workspace/apps/frontend/src/index.ts`

In the broader repo, the more componentized frontend implementation under `workspace/frontend/` also shows the intended interaction surfaces, especially:

- `workspace/frontend/src/lib/roomClient.ts`
- `workspace/frontend/src/types/pika.ts`

Those files are useful references for request/response shape expectations and room-flow semantics, but new slice artifacts for this round should still land in `workspace/apps/frontend/`.

### Backend contract touch points

Backend currently has two visible surfaces in the repo:

1. Canonical slice target:
   - `workspace/apps/backend/src/index.ts`

2. More developed reference implementation outside the app path:
   - `workspace/backend/src/contracts/rooms.js`
   - `workspace/backend/src/controllers/roomsController.js`
   - `workspace/backend/src/storage/roomsStore.js`
   - `workspace/backend/docs/api-v1-first-playable-contract.md`
   - `workspace/backend/docs/api-v1-implementation-brief.md`

These top-level backend files are useful as implementation references for room/session, option, matchup, and result semantics, but they are not themselves the designated output path for this slice.

### Practical contract coordination guidance

When touching this slice:

1. Define or update shared payload/type intent in `workspace/packages/contracts/src/` first when the shape is meant to be cross-app.
2. Implement or align backend request/response behavior in `workspace/apps/backend/src/`.
3. Consume those shapes in `workspace/apps/frontend/src/`.
4. If full runtime integration is not yet closed, frontend may temporarily use stable mocks from `workspace/packages/contracts/src/mocks/` as long as the divergence is documented.

---

## 4) Current local development guidance distilled

Based on `workspace/docs/local-development.md` and `workspace/devops/integration-guide.md`, the working assumption for this repo is:

- local execution matters more than deployment for this phase
- teams should optimize for a believable, manually reviewable vertical slice
- frontend/backend can progress in parallel if they align on a stable contract or mock
- lack of deployment should not block artifact production

### Recommended local validation order

1. Build shared contracts:
   - `workspace/packages/contracts`
2. Start backend locally from:
   - `workspace/apps/backend`
3. Start frontend locally from:
   - `workspace/apps/frontend`
4. If backend/frontend integration is not yet complete, validate:
   - frontend against mock data
   - backend endpoints independently
   - then document the gap rather than blocking file delivery

### Minimum handoff expectation for engineering

A usable slice artifact this round should make it clear:

- where the code lives
- which local command starts it
- which contract files it depends on
- whether it expects live backend data or mock data
- what remains blocked for full end-to-end behavior

---

## 5) Current caveats and blockers

These are framed as non-deployment guidance so teams can keep shipping artifacts without overstating runtime status.

### Caveat: duplicate app surfaces exist in the repo

There are parallel-looking code locations:

- canonical current slice targets:
  - `workspace/apps/frontend`
  - `workspace/apps/backend`
- legacy/reference surfaces:
  - `workspace/frontend`
  - `workspace/backend`

This creates handoff risk if one team edits the app path while another team references only the legacy path.

**Guidance:** for this slice, treat `workspace/apps/*` as the output target and `workspace/frontend` / `workspace/backend` as reference material unless management says otherwise.

### Caveat: canonical `dev` integration is not yet proven end-to-end

Prior devops validation already noted a blocker around canonical local `dev` flow not being fully proven as one seamless integrated experience.

**Guidance:** teams should avoid claiming “fully integrated local run” unless they have personally validated:
- contracts build,
- backend dev server,
- frontend dev server,
- and the actual frontend-to-backend interaction path.

Absent that proof, describe the slice accurately as:
- locally buildable by package,
- manually reviewable,
- partially integrated or mock-backed where applicable.

### Caveat: frontend may need mock-backed continuity

The integration guide and prior validation note support a mixed real/mock local validation model for this phase.

**Guidance:** if backend behavior or endpoint wiring is incomplete, frontend should continue to ship artifact progress against:
- stable mock shapes from `workspace/packages/contracts/src/mocks/`
- or another clearly documented stub path

That is acceptable for the current slice, provided the dependency is explicit in the handoff note or README.

### Caveat: top-level backend contains richer behavior than app backend target

The top-level `workspace/backend/` tree appears to contain a more developed room API/store implementation than `workspace/apps/backend/`.

**Guidance:** backend should not silently split the slice across both locations. If reference logic is borrowed conceptually, the actual deliverable for this round should still be written coherently under `workspace/apps/backend/`, or the divergence should be called out explicitly.

### Caveat: top-level frontend contains richer modular UI than app frontend target

The top-level `workspace/frontend/` tree appears to contain more modular screen/component work than `workspace/apps/frontend/src/index.ts`.

**Guidance:** frontend should avoid creating ambiguity about the “real” app. Deliver current slice changes under `workspace/apps/frontend/` and mention any reference-only borrowing from the top-level frontend tree if relevant.

### Caveat: contracts package is the safest shared truth, but adoption may be partial

A dedicated contracts package exists, but not every implementation path in the repo necessarily imports from it consistently yet.

**Guidance:** when teams touch any payload shared between backend and frontend, prefer updating `workspace/packages/contracts/src/` and note where downstream adoption is still pending.

---

## 6) Recommended handoff wording for this slice

Teams can use the following status framing to keep handoffs accurate:

### If integrated enough for local review
- “Artifacts landed in `workspace/apps/frontend` and/or `workspace/apps/backend`, with shared shapes in `workspace/packages/contracts`. Local dev/build commands are declared in each package manifest. End-to-end local verification should be treated as package-level/manual unless separately confirmed.”

### If frontend is still mock-backed
- “Frontend artifact is landed in `workspace/apps/frontend` against stable contract/mocks in `workspace/packages/contracts`. Backend artifact path is `workspace/apps/backend`, but live wiring remains a follow-up.”

### If backend is ahead of frontend
- “Backend contract/endpoint artifact is landed in `workspace/apps/backend` and aligned to shared shapes in `workspace/packages/contracts`. Frontend consumption remains partial or pending.”

---

## 7) Bottom line

For this round, the clean artifact path is:

- frontend deliverables → `workspace/apps/frontend/`
- backend deliverables → `workspace/apps/backend/`
- shared contract deliverables → `workspace/packages/contracts/`

The clean local validation expectation is:

- build contracts
- run backend locally
- run frontend locally
- document any mock/live split honestly

The main blocker is not deployment. It is repo-path ambiguity plus incomplete proof of one canonical end-to-end local `dev` flow.