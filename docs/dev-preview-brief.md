# Pika dev + preview brief

## Decision in force

For the current phase, the canonical runnable surfaces are:

- `frontend/`
- `backend/`

Exclude these from the primary boot and preview path for now:

- `apps/frontend/`
- `apps/backend/`

This is a binding repo-surface decision for the current build pass, not a claim that the duplicate trees are removed.

## Live backend baseline reflected here

The current backend baseline for dev and preview is:

- Express API
- mounted under `/api/v1`
- guest-capable request handling using the `x-session-id` header
- optional JSON-file persistence

This brief updates the prior reconstruction artifacts to match that live backend shape.

## Preview-ready path

### Frontend preview target
Use:

- `frontend/`

Reason:
- It is the canonical frontend surface for this phase.
- A preview config is already visible at `frontend/vercel.json`.

### Backend expectation for preview
Use:

- `backend/`

as the separately hosted or separately run API surface behind the frontend preview.

Current preview readiness should therefore be described as:

- frontend previewable from `frontend/`
- backend connectivity required to `/api/v1`
- guest-session continuity requires preserving `x-session-id`
- exact backend deployment target/config remains unresolved where noted as `VERIFY_ON_FIRST_RUN`

## Recommended local boot order

1. Prepare env files from `/.env.example`
2. Install dependencies inside `backend/`
3. Start `backend/`
4. Confirm the backend base path is reachable under `/api/v1`
5. If using guest flows, confirm requests can send `x-session-id`
6. Install dependencies inside `frontend/`
7. Start `frontend/`
8. Exercise the room flow end to end

## Frontend/backend integration notes

For the current slice, frontend integration should assume:

- backend origin similar to `http://localhost:3001` — `VERIFY_ON_FIRST_RUN`
- API base path `/api/v1`
- room endpoints rooted under `/api/v1/rooms`
- guest-capable continuity via `x-session-id`

If the frontend stores a generated guest session identifier locally, it should reuse that value consistently across room join, vote, and results-related calls.

## Room-flow test prerequisites

Before calling the slice preview-ready, verify these prerequisites locally.

### Backend prerequisites
- backend starts from `backend/`
- Express server responds for the launch slice
- `/api/v1` routing is active
- expected room API surface is available for:
  - room creation
  - room fetch/join retrieval
  - option submission/addition
  - vote/matchup submission
  - results retrieval or computed outcome state
- `x-session-id` is accepted for guest-capable room participation flows
- optional JSON-file persistence is either:
  - disabled for ephemeral local runs, or
  - enabled with a confirmed writable path — `VERIFY_ON_FIRST_RUN`

Observed supporting backend files:
- `backend/src/index.ts`
- `backend/src/routes/rooms.js`
- `backend/src/controllers/roomsController.js`
- `backend/src/storage/roomsStore.js`
- `backend/scripts/smoke-test.js`
- `backend/src/routes/health.js`
- `backend/contracts/api-v1-rooms.md`
- `backend/README-launch-slice.md`

### Frontend prerequisites
- frontend starts from `frontend/`
- frontend is configured to call the canonical backend surface
- frontend points at `/api/v1`, not a bare `/api`
- frontend can include or preserve `x-session-id` where guest flows require continuity
- room creation UI renders
- option entry UI renders
- join/lobby flow renders
- matchup submission flow renders
- result/outcome flow renders

Observed supporting frontend files:
- `frontend/src/App.tsx`
- `frontend/src/screens/room/CreateRoomScreen.tsx`
- `frontend/src/screens/room/JoinRoomScreen.tsx`
- `frontend/src/screens/room/HostLobby.tsx`
- `frontend/src/screens/room/LobbyScreen.tsx`
- `frontend/src/screens/room/ActiveRoomScreen.tsx`
- `frontend/src/screens/room/OutcomeScreen.tsx`
- `frontend/src/screens/round/ActiveMatchup.tsx`
- `frontend/src/screens/results/ResultsReveal.tsx`
- `frontend/src/lib/api.js`
- `frontend/src/lib/roomClient.ts`
- `frontend/tests/happy-path.spec.js`
- `frontend/tests/m1-flow.spec.ts`

## Persistence guidance

The backend supports optional JSON-file persistence.

Use this interpretation for current local/dev guidance:

- default-safe mode: ephemeral/non-persistent local development
- optional mode: JSON-file persistence for repeatable manual testing
- exact env key and file location for persistence must be confirmed on first run where still marked `VERIFY_ON_FIRST_RUN`

If persistence is enabled, verify:
- the file path is writable
- the environment allows local file writes
- preview hosting, if used, is compatible with file-backed persistence before depending on it

## Env guidance for this phase

Use `workspace/.env.example` as a reconstruction template only.

### Safe assumptions
- frontend needs a backend base URL
- frontend should target `/api/v1`
- guest room flows rely on `x-session-id`
- backend needs a port and CORS/frontend-origin allowance
- preview will require a backend URL for frontend API calls

### Unsafe assumptions
Do **not** treat the following as confirmed until first run:
- exact package manager
- exact script names beyond conventional `dev`
- exact env file placement (`.env` vs `.env.local`)
- exact frontend variable names consumed by code
- exact backend env contract beyond the known `/api/v1`, `x-session-id`, and optional JSON persistence baseline
- exact backend preview/deployment platform
- whether auth-related env is required for any non-guest path

## Remaining unknowns

1. **Package manager**
   - No canonical root package manager is established from the current tree snapshot.

2. **Root orchestration**
   - No confirmed root `package.json` or workspace-run command should be documented as authoritative.

3. **Exact frontend env key names**
   - Vite-style naming is likely because `frontend/vercel.json`, `frontend/vite.config.js`, and `frontend/vite.config.ts` exist, but actual consumed keys must be verified in app code on first run.

4. **Exact backend env contract**
   - The live backend baseline is known at a high level, but exact env names for persistence and any optional runtime toggles still require first-run confirmation where marked.

5. **Contract path mismatch**
   - Project metadata references `workspace/packages/contracts/pika-vertical-slice.json`
   - That `packages/` path is not visible in the provided tree snapshot

6. **Duplicate app trees**
   - `apps/*` still exists and may confuse future contributors unless explicitly labeled non-canonical

7. **Preview backend binding**
   - Frontend preview target is clear (`frontend/`), but backend hosting URL and deploy-time env binding still need first-run confirmation

## Working status

This repo is documentable as a **preview-ready candidate path** with a known backend baseline:
- Express
- `/api/v1`
- guest-capable `x-session-id`
- optional JSON-file persistence

Use these artifacts as the canonical reconstruction set for this phase:

- `README.md`
- `.env.example`
- `docs/dev-preview-brief.md`
- `devops/platform-scaffolding-manifest.md`