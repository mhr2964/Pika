# Minimum launch release slice

This artifact maps the smallest launchable Pika cut onto the current workspace and identifies what must ship now versus what can wait.

## Scope of the minimum launch cut

Launch with one stable room flow:

- host creates a room
- participants join with a room code and display name
- room enters active matchup rounds
- participants submit choices
- backend computes and returns final result
- result is revealable/shareable in-product
- access is controlled by the approved hybrid auth model already in motion

Do not expand launch scope to profiles, long-term history, social graph, or complex moderation/admin tooling.

---

## Required backend work

Primary owned files and paths:

- `workspace/backend/src/routes/rooms.js`
- `workspace/backend/src/controllers/roomsController.js`
- `workspace/backend/src/storage/roomsStore.js`
- `workspace/packages/contracts/*`

### 1. Lock the room API to the launch slice contract
Backend must publish and enforce the canonical v1 room contract in `workspace/packages/contracts/*` for:

- create room
- join room
- fetch room state
- submit matchup choice / vote
- advance room phase where host/system action is required
- fetch final results
- structured error responses for invalid code, duplicate join, closed room, invalid phase, unauthorized action, and rate-limited action

This is the launch-critical dependency for frontend alignment.

### 2. Finish route coverage in `routes/rooms.js`
`backend/src/routes/rooms.js` must expose only the endpoints needed for the above slice and ensure they map cleanly to controller actions. Launch needs:

- room creation route
- room join route
- room state retrieval route
- matchup submission route
- result retrieval route
- any minimal host transition route required by the current frontend flow

If extra experimental routes exist, keep them out of the launch contract or mark them non-launch.

### 3. Normalize controller behavior in `controllers/roomsController.js`
`backend/src/controllers/roomsController.js` must return consistent payloads and status codes. Required launch behavior:

- validate request body/query/path inputs against contract expectations
- map storage/service errors to stable HTTP responses
- avoid leaking stack traces/internal state
- return phase-aware room state so frontend can drive screen transitions without guessing
- include participant role/capability flags needed for host vs participant behavior if auth/session attaches them

### 4. Make `roomsStore.js` safe enough for launch traffic
`backend/src/storage/roomsStore.js` is in the launch-critical path. Before launch it must support:

- deterministic room lookup by code/id
- stable participant membership tracking
- matchup submission persistence
- idempotency/duplicate-submission handling for repeated client requests
- protection against invalid phase transitions
- result aggregation consistent with contract
- cleanup or expiry behavior for abandoned rooms if already part of current design

If the store is still in-memory only, that is acceptable only for a narrow early launch if explicitly accepted elsewhere; otherwise persistence remains a release risk.

### 5. Tie auth/session context into room operations
Backend room endpoints must consume the approved auth/session model enough to distinguish:

- unauthenticated visitor before room access
- room-scoped guest participant
- host privileges
- share-result access rules if applicable

Room ownership and participant identity must not be derived purely from mutable client-provided fields once a session is established.

### 6. Add launch-level API verification
At minimum, backend must have smoke coverage for the happy path and key failures around:

- create -> join -> submit -> results
- invalid room code
- duplicate or conflicting submission
- unauthorized host-only action
- malformed payload rejection

---

## Required frontend work

Primary owned files and paths:

- `workspace/frontend/src/lib/roomClient.ts`
- `workspace/frontend/src/screens/room/*`
- `workspace/frontend/src/screens/round/*`
- `workspace/frontend/src/screens/results/*`

### 1. Align `roomClient.ts` to the published contract
`frontend/src/lib/roomClient.ts` must become the single typed client for the launch slice. Required work:

- consume the backend-published contract shapes from `packages/contracts/*`
- remove guessed field names/status handling where contract differs
- normalize network errors into a small UI-safe error model
- support create room, join room, fetch state, submit choice, and fetch results
- attach auth/session credentials in the agreed way

### 2. Make room screens phase-driven, not heuristic-driven
Files under `frontend/src/screens/room/*` should render from backend room phase/state rather than local assumptions. Launch-critical screens include:

- create room setup / create room screen
- join room screen
- host lobby / participant lobby / lobby screen
- active room screen / outcome screen as currently used

Required launch behavior:

- successful create lands in host lobby with stable room code
- successful join lands in participant lobby/active state correctly
- invalid code and closed-room states are shown clearly
- refresh/re-entry should restore current room state when session is valid

### 3. Stabilize round interaction flow
Files under `frontend/src/screens/round/*` must support the minimum active play loop:

- matchup intro
- active matchup selection
- submitted/waiting state
- between-matchups transition if backend emits one

Required launch behavior:

- one clear action to submit a choice
- prevent accidental double-submit on pending request
- poll or refetch room state as needed until next phase/result
- show recoverable network errors without losing the room session

### 4. Stabilize result flow
Files under `frontend/src/screens/results/*` must cover the minimum end state:

- calculating results
- restart pending only if restart is truly in launch scope
- final results reveal

If restart is not contractually supported for launch, treat `RestartPending.tsx` as deferred and keep result flow to reveal/share only.

### 5. Trim frontend to the smallest coherent path
For launch, frontend should prefer one canonical path over parallel legacy surfaces. If overlapping old screens remain in `frontend/src/screens/*.jsx` and newer TS screens exist, ship the path wired to the launch contract and avoid maintaining both runtime paths.

### 6. Add minimal happy-path verification
Frontend should have at least one validation artifact covering:

- create room
- join room
- submit matchup
- reveal result

This can reuse the existing test lane if already present, but launch cannot rely on purely manual confidence.

---

## Required devops and release work

Primary inputs:

- `workspace/devops/deployment-implementation-checklist.md`
- `workspace/frontend/vercel.json`
- repo-root package manifests including `workspace/package.json`

### 1. Resolve the actual deploy topology
Release must explicitly choose and document:

- backend hosting target
- frontend hosting target
- base API URL strategy for prod and preview
- package/build commands from repo root and per-app manifests

The current checklist should be updated from “implementation planning” to an executable launch runbook.

### 2. Verify frontend production routing/config
`frontend/vercel.json` must be confirmed against the actual SPA/app routing used by the room flow so deep links and refreshes do not break:

- join-by-link or room routes must resolve correctly
- API rewrites, if any, must not conflict with static asset serving
- environment variables must point to the launch backend

### 3. Lock build/install commands from package manifests
Repo-root and workspace package manifests must be validated for the release path:

- deterministic install command
- deterministic frontend build command
- deterministic backend start/build command
- contract package availability during build
- no ambiguous duplicate app roots for the chosen launch surface

Because the workspace contains both `apps/*` and top-level `frontend/` / `backend/`, release must explicitly declare which paths are authoritative for launch.

### 4. Environment and secret readiness
Before launch, devops must confirm all required values exist and are documented:

- backend runtime env
- frontend public env for API base URL
- auth/session secret material
- any CORS origin allowlist
- logging/observability endpoints if used

### 5. Release smoke and rollback
The deployment checklist should include a real launch smoke pass:

- create room in production
- join room from second client/device
- complete at least one matchup and result reveal
- verify auth/session persistence through refresh
- confirm rollback or redeploy steps if room flow fails

---

## Auth and security dependencies

These are launch-blocking dependencies on the active auth/security lane, not optional polish.

### Auth dependencies
Minimum launch cut assumes the approved hybrid model is implemented enough to support:

- lightweight guest entry for room participation
- durable session binding so a participant/host identity survives refresh
- host privilege recognition for host-only actions
- clear session attachment from frontend client to backend room endpoints

Backend and frontend cannot finalize their room flow until the session token/cookie/header mechanism and guest identity model are locked.

### Security dependencies
Launch-critical security controls for this slice:

- input validation on all room endpoints
- rate limiting / abuse controls on room create, join, and submit actions
- server-side authorization for host-only transitions
- duplicate-submission and replay resistance at the room action layer
- no trust in client-asserted role/identity without session verification
- safe error handling with no sensitive leakage
- CORS/session configuration consistent with chosen frontend/backend domains
- basic logging for suspicious room abuse and auth failures

If auth or security artifacts introduce mandatory gates beyond the above, those gates supersede this slice.

---

## Post-launch deferrals

These items should not block minimum launch unless already partially complete and cheap to finish:

- full user accounts beyond the guest-plus-host launch model
- persistent multi-room history and profile pages
- advanced analytics dashboards
- restart/rematch flows if not already contract-backed
- complex sharing destinations beyond basic result presentation/copy
- admin/moderation consoles
- broad test matrix across all legacy screen variants
- migration/cleanup of duplicate app scaffolds outside the selected launch path

---

## Launch decision checklist

Release is ready only when all are true:

- backend contract in `packages/contracts/*` is published and treated as canonical
- `rooms.js`, `roomsController.js`, and `roomsStore.js` fully support the minimum happy path
- `roomClient.ts` and active room/round/result screens use that contract without local guesswork
- deploy topology is selected and package/build commands are unambiguous
- auth/session attachment is implemented end-to-end
- security launch gates for validation, authorization, and abuse control are in place
- production smoke test proves create -> join -> submit -> results on the deployed stack