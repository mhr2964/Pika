# Pika Auth Launch Brief

## Binding V1 Launch Decision

Pika v1 launch auth is **guest-first and server-bound only**.

The binding launch model is:

- no public unauthenticated write actions after join/initiation points
- no client-authoritative participant identity for session actions
- no JWT-first launch model
- no anonymous-to-account upgrade in v1
- no account linking or upgrade UX in v1
- no host account/auth product requirement for v1 unless backend later makes it strictly necessary for room administration
- guest participation must be represented by a **server-bound opaque session/grant model**
- session/grant material must be issued by the server and treated by clients as opaque
- all room/session write authority must be derived from the server-issued session/grant, not caller-posted IDs

For v1, the auth goal is narrow: make room participation and vote submission attributable to a server-issued room-bound session, close impersonation gaps, and make protected/unprotected boundaries explicit. Any account system or guest-to-account upgrade work is **later and non-blocking**.

## Purpose

Define the minimum auth/session model required for Pika launch and document the current backend gaps against that baseline using concrete code evidence from the current backend implementation.

## Evidence Summary: Current Backend State

Current backend code is a single unauthenticated Express app in `workspace/backend/src/index.ts`, with only `express` and `dotenv` as runtime dependencies (`workspace/backend/package.json`).

### Concrete evidence

- no JWT library, session library, cookie library, or auth middleware dependency exists in backend `package.json`
- the server is created directly in `src/index.ts`
- `app.use(express.json())` is the only global middleware shown
- no auth/session middleware is registered before routes
- no route-level identity checks exist
- no credential exchange endpoints exist
- no session issuance endpoint exists
- no rate limiting dependency or middleware exists
- room/session state is stored in process memory and optionally persisted to JSON on disk

## Current Route Surface and Auth Exposure

All current routes are public.

### Public health route

`GET /api/v1/health`

- returns service metadata
- no auth required
- appropriate to remain public

### Public room creation

`POST /api/v1/rooms`

Current behavior:

- accepts optional `roomCode`
- creates a room with empty participants, matchups, results
- returns `201` with room metadata

Current auth/session state:

- fully unauthenticated
- no caller identity captured
- no room owner or creator grant established
- no anti-abuse controls

Launch implication:

- anyone can create unlimited rooms anonymously
- no server-bound authority is established for later room administration

### Public room metadata read

`GET /api/v1/rooms/:roomCode`

Current behavior:

- returns room summary:
  - `code`
  - `phase`
  - timestamps
  - counts
  - `completed`

Current auth/session state:

- fully unauthenticated

Launch implication:

- acceptable as public if room code possession is treated as sufficient discovery barrier
- should be explicitly classified as unprotected room-summary access

### Public participant join

`POST /api/v1/rooms/:roomCode/join`

Current behavior:

- accepts `name`
- creates a participant object with generated `id`
- appends participant directly to room
- returns participant object and room summary

Current auth/session state:

- fully unauthenticated
- participant identity is created solely from posted display name
- no bound opaque session/grant is issued
- no client continuity exists after join other than raw participant ID in response

Launch implication:

- anyone can join any room if they know the code
- same person can mint unlimited participant identities
- later actions cannot be tied to a stable server-issued session

### Public session read

`GET /api/v1/rooms/:roomCode/session`

Current behavior:

- returns full session payload:
  - all participants
  - all matchups
  - all results
  - full room status

Current auth/session state:

- fully unauthenticated

Launch implication:

- anyone with a room code can read full room internals
- no distinction between joined participant and outsider
- protected/unprotected state is undefined

### Public result submission

`POST /api/v1/rooms/:roomCode/results`

Current behavior:

- accepts:
  - `matchupId`
  - `submittedBy`
  - `winner`
- validates that `submittedBy` is present in participant IDs
- validates that `winner` is a participant and belongs to matchup
- rejects duplicate submission only for same `(matchupId, submittedBy)` pair
- stores result and returns updated room/session data

Current auth/session state:

- fully unauthenticated
- trusts caller-provided `submittedBy`
- no proof caller controls the participant identity being claimed

Launch implication:

- any caller can impersonate any participant by sending that participant ID
- voting integrity is broken
- this is the most severe launch-blocking auth/session gap in current backend

## Code-Cited Gap Assessment

## 1. No server-bound auth/session implementation exists

Evidence:

- `workspace/backend/package.json` only lists:
  - `dotenv`
  - `express`
- no session, cookie, JWT, or auth libraries are present
- no route middleware in `src/index.ts` performs authentication or authorization

Gap:

- v1 requires server-issued opaque room/session grants with explicit protected routes
- current code has no issuance, lookup, validation, or principal extraction path

Severity:

- launch-blocking

## 2. No explicit principal/session model exists

Evidence:

Current data model uses room-local records:

- room
- participant
- result

But request identity is never derived from a server-issued session.

Gap:

Launch needs at least these runtime states:

- outsider with no room session
- joined guest with a room-bound opaque session/grant
- optional room creator authority if room administration remains in scope

Current code has only caller-supplied JSON and room-local IDs.

Severity:

- launch-blocking

## 3. Vote submission trusts attacker-controlled identity input

Evidence from `POST /api/v1/rooms/:roomCode/results`:

- `submittedBy` is read from request body
- server checks only whether it exists in `room.participants`
- server does not derive submitter from any server-issued session/grant

Gap:

- launch requires session actions be bound to a server-issued room session
- caller-posted participant identifiers cannot remain authoritative

Severity:

- critical, launch-blocking

## 4. No room-bound session issuance on join

Evidence from `POST /api/v1/rooms/:roomCode/join`:

- route creates participant and returns it directly
- no opaque session/grant is created or returned
- no persistence exists for room membership credentials beyond participant ID exposure

Gap:

- join must be the moment where the server binds the guest to the room with an opaque session/grant

Severity:

- launch-blocking

## 5. Session boundary is undefined

Evidence:

- `GET /api/v1/rooms/:roomCode` is public
- `GET /api/v1/rooms/:roomCode/session` is public
- `POST /api/v1/rooms/:roomCode/join` is public
- `POST /api/v1/rooms/:roomCode/results` is public

Gap:

Launch needs explicit classification of:

- public routes
- routes that issue room-bound sessions
- routes requiring a valid room-bound session
- any optional room-admin routes

Severity:

- launch-blocking

## 6. No auth/session rate limits or abuse controls exist

Evidence:

- no middleware for IP- or session-based throttling
- room creation and join endpoints are open
- no limits on participant creation in a room
- no limits on result submission attempts beyond duplicate pair rule

Gap:

Launch baseline requires abuse controls at minimum on:
- room creation
- join/session issuance
- result submission

Severity:

- high, launch-blocking for internet exposure

## 7. Creator/host authority is not defined

Evidence from `POST /api/v1/rooms`:

- room is created without owner identity
- room record contains no creator session, owner subject, or admin binding

Gap:

If any post-create admin actions exist for launch, authority must be server-bound.
If no admin actions ship in v1, this can be minimized and deferred.

Severity:

- medium unless room administration endpoints are introduced pre-launch

## Prioritized Must-Fix Implementation Checklist

This section turns the current auth/session touchpoints into a release-gate checklist. Items marked **P0** are launch blockers. Items marked **Later / Non-blocking** must not expand v1 scope.

## Contracts

### P0

- [ ] Publish canonical route classification:
  - public: `GET /api/v1/health`, `GET /api/v1/rooms/:roomCode`
  - session-issuing: `POST /api/v1/rooms/:roomCode/join`
  - session-required: `GET /api/v1/rooms/:roomCode/session`, `POST /api/v1/rooms/:roomCode/results`
- [ ] Remove caller-authoritative participant identity from result submission contract
  - `submittedBy` must not remain an accepted authoritative input
- [ ] Define the join response contract to include server-issued opaque session/grant material
  - opaque token or grant ID format is backend-owned and not interpreted by client
- [ ] Define how session-required requests carry the opaque session/grant
  - header or cookie must be explicit in the contract
- [ ] Define consistent auth/session error responses
  - `401` for missing/invalid session
  - `403` for valid session without room permission, if applicable

### P1

- [ ] Define whether room creation remains fully public for v1 or also returns a creator/admin grant
- [ ] Define whether session reads return the same payload for all joined guests or differ by role

### Later / Non-blocking

- [ ] Anonymous-to-account upgrade contract
- [ ] Account linking contract
- [ ] Host login/signup contract
- [ ] Multi-device session portability contract
- [ ] Long-lived account/session management contract

## Backend

### P0

- [ ] Add server-issued opaque room session/grant generation on `POST /api/v1/rooms/:roomCode/join`
- [ ] Persist room-session binding so later requests can be authorized
  - minimum binding: room code + participant ID + opaque session/grant + expiry/validity metadata
- [ ] Require valid room-bound session/grant on `GET /api/v1/rooms/:roomCode/session`
- [ ] Require valid room-bound session/grant on `POST /api/v1/rooms/:roomCode/results`
- [ ] Derive acting participant from validated server session/grant, not request body
- [ ] Remove or ignore `submittedBy` in backend write authorization
- [ ] Prevent cross-room reuse of a session/grant
- [ ] Add rate limiting for:
  - room creation
  - join/session issuance
  - result submission
- [ ] Return explicit 401/403 responses for session failures
- [ ] Keep public access limited to health and room summary endpoints only

### P1

- [ ] Decide whether room creation should also mint a creator/admin grant for future moderation/control
- [ ] If creator/admin actions are in launch scope, bind room ownership to a server-issued authority at create time
- [ ] Add session invalidation or simple expiry handling appropriate for launch
- [ ] Ensure persisted room/session storage model can survive process restarts if persistence is enabled

### Later / Non-blocking

- [ ] Account database or user table
- [ ] Password flows
- [ ] Email verification
- [ ] Social auth
- [ ] Guest-to-account upgrade
- [ ] Refresh-token architecture
- [ ] Cross-room identity federation
- [ ] Full account recovery/session management features

## Frontend

### P0

- [ ] Treat join as a session-establishing action, not just participant creation
- [ ] Store and resend the server-issued opaque room session/grant on session-protected requests
- [ ] Stop treating raw `participant.id` as sufficient proof of authority
- [ ] Ensure session page/data fetches send the issued session/grant
- [ ] Ensure result submission sends only vote/matchup intent, not caller-auth identity
- [ ] Handle `401` by sending user back through join/re-entry for that room
- [ ] Handle `403` with explicit room-access error state if backend uses it

### P1

- [ ] Clarify whether room creator UI has any special controls in v1
- [ ] Preserve guest session across reload for the room, using the opaque grant transport chosen by backend
- [ ] Make protected/unprotected states explicit in UI copy
  - browsing room summary vs joined room participation

### Later / Non-blocking

- [ ] Sign-up / sign-in screens
- [ ] Upgrade account prompts
- [ ] Account linking settings
- [ ] Profile/session management UI
- [ ] Multi-room account identity UX

## Minimum V1 Route Classification

## Unprotected routes

### `GET /api/v1/health`
Public operational health.

### `GET /api/v1/rooms/:roomCode`
Public room summary only.

### `POST /api/v1/rooms/:roomCode/join`
Public only as a session-issuance entry point.
It must transition the caller into a server-bound room session state.

## Protected routes

### `GET /api/v1/rooms/:roomCode/session`
Require valid room-bound opaque session/grant.

Allowed callers:
- joined guest for that room
- optional room creator/admin grant for that room, if such authority exists in v1

### `POST /api/v1/rooms/:roomCode/results`
Require valid room-bound opaque session/grant.

Allowed caller behavior:
- server derives submitter from validated session/grant
- client must not supply authoritative participant identity

## Room creation decision note

### `POST /api/v1/rooms`
Current state is public and unauthenticated.

For v1, the smallest shippable path is:

- keep room creation public if no creator-only admin actions are required at launch
- protect against abuse with rate limiting and explicit contract boundaries
- do not expand scope into host accounts unless product/backend introduces creator-only operations that truly need them

If launch requires creator-only controls later, add a creator/admin server-bound grant then. That work is separate from the core guest participation fix and should not block the first auth/session cut unless such controls are already in release scope.

## Canonical V1 Guest Flow

1. User enters room code and name
2. Client calls `POST /api/v1/rooms/:roomCode/join`
3. Server creates:
   - participant record
   - opaque room-bound session/grant
   - binding between that session/grant and participant + room
4. Server returns participant-facing data plus opaque session/grant material
5. Client stores/transports that opaque material without interpreting it
6. Subsequent `session` and `results` calls require the issued room-bound session/grant
7. Server derives the acting participant from the validated session/grant

## Explicitly Deferred from V1

The following are **later and non-blocking**:

- anonymous-to-account upgrade
- guest-to-account conversion
- account linking
- sign-up/sign-in product flows
- password reset/recovery
- social auth
- persistent multi-device account identity
- refresh token architecture
- broader user management features

## Reviewer/Implementer Checklist

- confirm no backend route currently verifies session/grant material
- confirm `submittedBy` is fully caller-controlled in current result submission flow
- confirm join currently returns participant data without any server-bound session/grant
- confirm session endpoint currently returns full room internals without auth
- confirm no auth/session or rate-limit dependencies exist in backend package manifest
- confirm any v1 implementation keeps account/upgrade work explicitly out of release-blocking scope

## Concrete Source References

Primary files reviewed:

- `workspace/backend/package.json`
- `workspace/backend/src/index.ts`

Not found when requested:

- `workspace/backend/src/server.ts`
- `workspace/backend/src/routes/rooms.ts`
- `workspace/backend/src/routes/sessions.ts`

Interpretation:
- current backend appears consolidated into `src/index.ts`, not split into route modules

## Gap Verdict

Current backend is effectively a public unauthenticated API with room-code-based obscurity only. It does not meet the binding v1 launch decision. The most serious issue is that result submission trusts a client-provided participant ID, enabling trivial participant impersonation. Launch should be blocked on introducing server-issued opaque room-bound sessions/grants, enforcing those sessions on session read and result submission, and adding basic abuse controls. Account and upgrade work are explicitly out of scope for the v1 release gate.