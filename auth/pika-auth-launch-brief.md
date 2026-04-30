# Pika Auth Launch Brief

## Purpose

Define the minimum auth model required for Pika launch and document the current backend gaps against that baseline using concrete code evidence from the current backend implementation.

## Binding Launch Baseline

Per accepted auth hardening direction for launch:

- Access tokens only; no server-side session store assumed for v1
- JWT signing algorithm: `RS256`
- JWT lifetime: `7d`
- Required claims:
  - `iss`
  - `aud`
  - `sub`
  - `iat`
  - `exp`
  - `jti`

This brief scopes the smallest shippable auth surface that makes session boundaries explicit for:

- guest access via room-scoped grant
- host identity for room creation/management
- participant identity binding for join and vote actions
- protected vs unprotected routes
- launch-critical abuse controls around auth entry points

## Evidence Summary: Current Backend State

Current backend code is a single unauthenticated Express app in `workspace/backend/src/index.ts`, with only `express` and `dotenv` as runtime dependencies (`workspace/backend/package.json`).

### Concrete evidence

- No JWT library or auth middleware dependency exists in backend `package.json`
- The server is created directly in `src/index.ts`:
  - `const app = express();`
  - `app.use(express.json());`
- No auth middleware is registered before routes
- No route-level identity checks exist
- No credential exchange endpoints exist
- No rate limiting dependency or middleware exists
- Room/session state is stored in process memory and optionally persisted to JSON on disk

## Current Route Surface and Auth Exposure

All current routes are public.

### Public health route

`GET /api/v1/health`

- Returns service metadata
- No auth required
- Appropriate to remain public

### Public room creation

`POST /api/v1/rooms`

Current behavior:

- Accepts optional `roomCode`
- Creates a room with empty participants, matchups, results
- Returns `201` with room metadata

Current auth state:

- Fully unauthenticated
- No caller identity captured
- No host ownership established
- No anti-abuse controls

Launch implication:

- Anyone can create unlimited rooms anonymously
- No room host can later be proven or authorized

### Public room metadata read

`GET /api/v1/rooms/:roomCode`

Current behavior:

- Returns room summary:
  - `code`
  - `phase`
  - timestamps
  - counts
  - `completed`

Current auth state:

- Fully unauthenticated

Launch implication:

- Acceptable as public if room code possession is treated as sufficient discovery barrier
- Should be explicitly classified as unprotected room-summary access

### Public participant join

`POST /api/v1/rooms/:roomCode/join`

Current behavior:

- Accepts `name`
- Creates a participant object with generated `id`
- Appends participant directly to room
- Returns participant object and room summary

Current auth state:

- Fully unauthenticated
- Participant identity is created solely from posted display name
- No bound token is issued
- No device/user continuity exists after join

Launch implication:

- Anyone can join any room if they know the code
- Same person can mint unlimited participant identities
- Later actions cannot be tied to a stable authenticated principal

### Public session read

`GET /api/v1/rooms/:roomCode/session`

Current behavior:

- Returns full session payload:
  - all participants
  - all matchups
  - all results
  - full room status

Current auth state:

- Fully unauthenticated

Launch implication:

- Anyone with a room code can read full room internals
- No distinction between host, joined participant, and outsider
- Protected/unprotected state is undefined

### Public result submission

`POST /api/v1/rooms/:roomCode/results`

Current behavior:

- Accepts:
  - `matchupId`
  - `submittedBy`
  - `winner`
- Validates that `submittedBy` is present in participant IDs
- Validates that `winner` is a participant and belongs to matchup
- Rejects duplicate submission only for same `(matchupId, submittedBy)` pair
- Stores result and returns updated room/session data

Current auth state:

- Fully unauthenticated
- Trusts caller-provided `submittedBy`
- No proof caller controls the participant identity being claimed

Launch implication:

- Any caller can impersonate any participant by sending that participant ID
- Voting integrity is broken
- This is the most severe launch-blocking auth gap in current backend

## Code-Cited Gap Assessment

## 1. No authentication implementation exists

Evidence:

- `workspace/backend/package.json` only lists:
  - `dotenv`
  - `express`
- No JWT signing or verification package is present
- No route middleware in `src/index.ts` performs authorization checks

Gap:

- Launch baseline requires JWT access tokens with `RS256` and explicit claims
- Current code has no token issuance, validation, or principal extraction

Severity:

- launch-blocking

## 2. No explicit principal model exists

Evidence:

Current data model uses room-local records:

- room
- participant
- result

But request identity is never derived from an authenticated token.

Gap:

Launch needs at least these principal classes:

- `host`
- `guest-participant`
- `anonymous outsider` before join

Current code has only caller-supplied JSON and room-local IDs.

Severity:

- launch-blocking

## 3. Vote submission trusts attacker-controlled identity input

Evidence from `POST /api/v1/rooms/:roomCode/results`:

- `submittedBy` is read from request body
- server checks only whether it exists in `room.participants`
- server does not verify token subject matches `submittedBy`

Gap:

- Launch requires participant actions be bound to a token-authenticated subject or room-scoped grant identity

Severity:

- critical, launch-blocking

## 4. No host ownership or room admin authorization exists

Evidence from `POST /api/v1/rooms`:

- room is created without owner identity
- room record contains no host subject, host participant, or creator grant

Gap:

- Launch requires host identity attachment for room creation and management semantics
- Without owner binding, no future room-protected operation can be safely authorized

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
- routes requiring any valid guest/host token
- routes requiring room membership
- routes requiring host ownership

Severity:

- launch-blocking

## 6. No auth entry points exist

Evidence:

There are no routes for:

- token issuance
- guest grant exchange
- host login/signup
- token refresh or reissue
- account upgrade from guest to account

Gap:

Even the minimum launch model needs at least one controlled token issuance path.

Severity:

- launch-blocking

## 7. No auth rate limits or abuse controls exist

Evidence:

- No middleware for IP- or subject-based throttling
- Room creation and join endpoints are open
- No limits on participant creation in a room
- No limits on result submission attempts beyond duplicate pair rule

Gap:

Auth launch baseline requires abuse controls at minimum on:
- token issuance/grant exchange
- room creation
- join
- result submission

Severity:

- high, launch-blocking for internet exposure

## 8. Key/env configuration is absent

Evidence:

Current backend env usage only covers:

- `PORT`
- `PERSIST_ROOMS`
- `ROOMS_FILE`

Gap:

Launch JWT model needs explicit key and audience/issuer configuration, at minimum:

- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`

Severity:

- launch-blocking

## Minimum Launch Auth Model

This is the smallest shippable model that fits the adopted baseline while minimizing surface area.

## Identity types

### 1. Host principal

Purpose:

- create rooms
- manage room lifecycle
- optionally join as a participant

Representation:

- JWT access token signed with `RS256`
- `sub` = stable host subject ID

Acquisition:

- via dedicated host auth/issue path
- exact credential UX can remain minimal for launch, but backend must issue a real signed JWT

### 2. Guest participant principal

Purpose:

- join a specific room
- fetch room session for that room
- submit own results for that room

Representation:

- JWT access token signed with `RS256`
- `sub` = stable guest subject ID
- room scope encoded in claims or enforced via server-side room-membership lookup keyed by `sub`

Launch recommendation:

- use room-scoped guest grants, not global anonymous tokens

### 3. Anonymous outsider

Purpose:

- view public room summary by code
- optionally access join screen before exchange

Representation:

- no token

## Required token semantics

All access tokens:

- algorithm: `RS256`
- expiry: 7 days
- claims required:
  - `iss`
  - `aud`
  - `sub`
  - `iat`
  - `exp`
  - `jti`

Launch recommendation for additional claims:

- `role`: `host` or `guest`
- `roomCode`: required for guest room-scoped tokens
- `displayName`: optional convenience claim for guest UX only if treated as non-authoritative

## Route Classification for Launch

## Unprotected routes

### `GET /api/v1/health`
Public operational health.

### `GET /api/v1/rooms/:roomCode`
Public room summary only.

Reason:
- Low sensitivity compared with full session payload
- Keeps join-by-code lightweight

## Protected routes

### `POST /api/v1/rooms`
Require host token.

Server responsibilities:
- authenticate JWT
- create room with `hostSubjectId`
- return room plus host relationship metadata if needed

### `POST /api/v1/rooms/:roomCode/join`
Two acceptable launch patterns; choose the smaller backend surface:

Preferred:
- unauthenticated request with `name`
- server creates participant + guest subject binding + returns signed guest JWT

Why:
- preserves lightweight guest join UX
- still transitions immediately into authenticated state

Required server behavior:
- returned JWT must bind the new principal to the room and participant identity

### `GET /api/v1/rooms/:roomCode/session`
Require a valid token for the same room.

Allowed callers:
- room host
- guest participant bound to that room

### `POST /api/v1/rooms/:roomCode/results`
Require a valid token for the same room.

Allowed caller behavior:
- server derives submitter identity from token, not request body
- `submittedBy` in body should be removed from contract
- server maps token principal to authorized participant ID

## Canonical Launch Flow

## Guest via grant

1. User enters room code and name
2. Client calls `POST /api/v1/rooms/:roomCode/join`
3. Server creates:
   - participant record
   - guest subject binding for that participant in that room
   - JWT access token signed with `RS256`
4. Client stores token
5. Subsequent `session` and `results` calls require `Authorization: Bearer <token>`

## Host identity

1. Host authenticates through minimal host auth flow
2. Server issues host JWT
3. Host calls `POST /api/v1/rooms` with bearer token
4. Server stores room creator as host subject
5. Host may then access room-protected resources as owner

## Anonymous to account upgrade

Not required for first launch cut if host-only account model is adopted initially.

Minimum acceptable launch stance:
- guest identities are ephemeral room-scoped principals
- no guest-to-account upgrade shipped yet
- brief this explicitly as deferred work

## Required Backend Changes Before Launch

## A. Add JWT issuance and verification

Need:
- RS256 signing support
- bearer token parsing middleware
- claim validation for `iss`, `aud`, `sub`, `iat`, `exp`, `jti`

Outcome:
- authenticated principal available on protected routes

## B. Introduce explicit auth environment contract

Minimum env vars:
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`

Optional:
- `HOST_AUTH_MODE` if host sign-in approach is feature-flagged

## C. Bind room ownership

Room record must add a creator/owner field, e.g.:

- `hostSubjectId`

Without this, host authorization is impossible.

## D. Bind participant identity to authenticated subject

Participant actions must not trust client-supplied participant IDs.

Need a mapping such as:

- participant record includes `subjectId`, or
- room membership table maps `subjectId -> participantId`

## E. Remove caller-controlled identity from vote submissions

Current request body field:
- `submittedBy`

Launch fix:
- stop accepting it as authoritative
- derive submitting participant from authenticated principal

## F. Protect session reads

`GET /api/v1/rooms/:roomCode/session` must require room-bound token.

Reason:
- this endpoint exposes full participant, matchup, and result data

## G. Add auth-focused rate limits

At minimum:
- room creation by IP and/or host subject
- join by IP and room code
- result submission by subject and room
- token issuance/exchange endpoints

## H. Publish explicit 401/403 behavior

Need consistent auth errors:

- `401 unauthorized` for missing/invalid/expired token
- `403 forbidden` for valid token lacking room or role permission

## Launch Decision Recommendations

## Recommended v1 scope

Ship:

- host-authenticated room creation
- guest token issuance on join
- protected session read
- protected result submission
- public room summary read
- public health route

Do not ship in v1 auth cut:

- refresh tokens
- social auth
- password reset
- guest-to-account upgrade
- multi-device session management
- granular admin moderation roles

## Why this is the smallest shippable surface

It fixes the launch-critical integrity issue:
- unauthenticated impersonation on votes

It also establishes explicit session boundaries without forcing a full identity platform:
- host tokens for creation/ownership
- guest room-scoped tokens for participation

## Reviewer/Implementer Checklist

- Confirm no backend route currently verifies bearer tokens
- Confirm `submittedBy` is fully caller-controlled in current result submission flow
- Confirm room creation currently stores no owner identity
- Confirm session endpoint currently returns full room internals without auth
- Confirm no JWT, auth, or rate-limit dependencies exist in backend package manifest
- Confirm env contract currently lacks JWT issuer/audience/key configuration

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

Current backend is effectively a public unauthenticated API with room-code-based obscurity only. It does not meet the accepted launch auth baseline. The most serious issue is that result submission trusts a client-provided participant ID, enabling trivial participant impersonation. Launch should be blocked on introducing signed JWT-based principals, room-bound authorization, host ownership binding, and basic auth abuse controls.