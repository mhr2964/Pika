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
- No route middleware in `workspace/backend/src/index.ts` performs authorization checks

Gap:

- Launch baseline requires JWT access tokens with `RS256` and explicit claims
- Current code has no token issuance, validation, or principal extraction

Severity:

- launch-blocking

## 2. No explicit principal model exists

Evidence:

Current data model in `workspace/backend/src/index.ts` uses room-local records:

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

Evidence from `POST /api/v1/rooms/:roomCode/results` in `workspace/backend/src/index.ts`:

- `submittedBy` is read from request body
- server checks only whether it exists in `room.participants`
- server does not verify token subject matches `submittedBy`

Gap:

- Launch requires participant actions be bound to a token-authenticated subject or room-scoped grant identity

Severity:

- critical, launch-blocking

## 4. No host ownership or room admin authorization exists

Evidence from `POST /api/v1/rooms` in `workspace/backend/src/index.ts`:

- room is created without owner identity
- room record contains no host subject, host participant, or creator grant

Gap:

- Launch requires host identity attachment for room creation and management semantics
- Without owner binding, no future room-protected operation can be safely authorized

Severity:

- launch-blocking

## 5. Session boundary is undefined

Evidence from `workspace/backend/src/index.ts`:

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

There are no routes in `workspace/backend/src/index.ts` for:

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

- No middleware for IP- or subject-based throttling in `workspace/backend/src/index.ts`
- Room creation and join endpoints are open
- No limits on participant creation in a room
- No limits on result submission attempts beyond duplicate pair rule
- `workspace/backend/package.json` has no rate-limit dependency

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

Current backend env usage in `workspace/backend/src/index.ts` only covers:

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

Current backend is effectively a public unauthenticated API with room-code-based obscurity only. It does not meet the accepted launch auth baseline. The most serious issue is that result submission trusts a client-provided participant ID, enabling trivial participant impersonation. Launch should be blocked on introducing signed JWT-based principals, room-bound authorization, host ownership binding, and
basic auth abuse controls.

## Release-Gate Auth/Session Decision Note

This section is implementation-grounded and is limited to release-gate decisions needed for launch review.

## 1. Session model decisions in code/contracts today

### Implemented today

Backend session state is application-managed room state, not authenticated user session state.

Evidence in `workspace/backend/src/index.ts`:

- The server initializes a plain Express app with `app.use(express.json())` and no auth/session middleware.
- All room data is held in `const inMemoryRooms = new Map<string, RoomRecord>();`.
- Persistence is optional file persistence controlled by:
  - `process.env.PERSIST_ROOMS === "true"`
  - `process.env.ROOMS_FILE || "./data/rooms.json"`
- `GET /api/v1/rooms/:roomCode/session` returns `toSessionResponse(room)`, which includes:
  - `participants`
  - `matchups`
  - `results`
  - `completed`

Decision note:
- The implemented “session” is a room-state snapshot, not a bound authenticated session.
- There is no cookie-backed session, no bearer-token session, no server-side auth session store, and no principal attachment in request handling.

Frontend evidence:

- `workspace/frontend/package.json` contains only React runtime dependencies (`react`, `react-dom`) and no auth/session client library.
- Prior verification recorded `workspace/frontend/src/main.tsx` and `workspace/frontend/src/App.tsx` as mounting routing/app shell without auth provider or route guard.

Decision note:
- Frontend currently has no implemented auth bootstrap layer, no token storage abstraction in evidence, and no protected-route/session restoration mechanism in evidence.

### Missing today

The following launch-critical session-model elements are not implemented in the visible workspace files:

- No token issuance route in `workspace/backend/src/index.ts`
- No token verification middleware in `workspace/backend/src/index.ts`
- No principal model attached to `Request`
- No host session concept for room ownership
- No guest room-bound authenticated session after join
- No contract file evidence was available from `workspace/packages/contracts/pika-vertical-slice.json` because the path was not found during read, so no contract-level auth/session guarantees can be treated as implemented

Release-gate decision:
- Treat current code as having no real auth session model at all. The only implemented continuity mechanism is possession of a room code plus any client-known participant ID.

## 2. Anonymous/guest-to-account upgrade flow and identity-binding risks

### Implemented today

Guest join behavior in `workspace/backend/src/index.ts`:

- `POST /api/v1/rooms/:roomCode/join` accepts only `name`
- Server creates:
  - `participant.id = generateId("p")`
  - `participant.name = name`
  - `participant.joinedAt = Date.now()`
- Participant is appended directly to `room.participants`
- Response returns `{ participant, room }`

Decision note:
- Today’s guest identity is only a room-local participant record created from a display name.
- No credential, token, cookie, device binding, or account binding is created during join.

### Missing today

No guest-to-account upgrade flow is implemented in visible backend files:

- No signup/login route
- No account record
- No guest token to upgrade
- No merge endpoint
- No re-auth flow
- No session rotation on privilege change

### Identity-binding risks

#### Account merge risk

If a guest-to-account upgrade were added on top of today’s model without first introducing subject-bound identities, the system would have no trustworthy way to prove which guest participant should merge into which account-backed principal.

Evidence:
- Participant identity is generated server-side but returned to the client as plain data in `POST /join`.
- Result submission later trusts request-body `submittedBy` in `POST /results`.
- There is no stable auth subject in room records or request context.

Decision:
- Guest-to-account upgrade is unsafe to add before guest actions are bound to a signed subject and room membership mapping.

#### Session fixation / identity takeover risk

Current vote submission in `workspace/backend/src/index.ts` trusts:
- `submittedBy` from request body
- only checks that the ID exists in `room.participants`

This means any client that learns or guesses a participant ID can submit as that participant.

Decision:
- This is effectively an identity-fixation/impersonation condition already present in the product, not merely a hypothetical future risk.
- Any later upgrade flow would inherit this weakness unless submitter identity is derived from a validated token rather than body input.

#### Privilege escalation risk

Room creation in `POST /api/v1/rooms` stores no owner identity in the `RoomRecord`.
Session reads in `GET /api/v1/rooms/:roomCode/session` are public.
Results submission is public and body-trusted.

Decision:
- There is no implemented privilege boundary between outsider, guest participant, and host.
- Any future “upgrade” or “host claims room” flow would be vulnerable to escalation unless ownership and participant binding are established first.

Release-gate decision:
- Guest-to-account upgrade is safe to defer, but only if launch explicitly ships without it and treats guest identities as ephemeral room-scoped principals.
- Launch must not imply that current guest state can later be securely upgraded or merged.

## 3. Room create/join/results/share authorization boundaries

### Room create

Implemented:
- `POST /api/v1/rooms` is public in `workspace/backend/src/index.ts`
- It creates a new room with empty arrays and no host field

Missing:
- No host token requirement
- No creator subject binding
- No authorization rule for room administration
- No anti-abuse/rate-limiting guard

Decision:
- Must be protected before launch if room ownership matters at all.
- Minimum safe launch boundary: require host bearer token and store `hostSubjectId` on room creation.

### Room join

Implemented:
- `POST /api/v1/rooms/:roomCode/join` is public
- Takes `name`
- Creates participant
- Returns participant and room summary

Missing:
- No guest token issuance
- No room-scoped grant
- No participant-to-subject binding
- No join throttling
- No duplicate identity/device continuity rule

Decision:
- Join may remain publicly callable only if the response immediately attaches a room-scoped guest credential for all subsequent sensitive actions.
- As implemented today, join creates an identity without securing it.

### Room session/results read

Implemented:
- `GET /api/v1/rooms/:roomCode` returns room summary only
- `GET /api/v1/rooms/:roomCode/session` returns full room internals
- Both are public in `workspace/backend/src/index.ts`

Missing:
- No distinction between public summary and protected session data
- No membership or ownership check on session reads

Decision:
- `GET /api/v1/rooms/:roomCode` can remain public at launch.
- `GET /api/v1/rooms/:roomCode/session` must require a valid room-bound host or guest token before launch.

### Results submission

Implemented:
- `POST /api/v1/rooms/:roomCode/results` is public
- Uses body fields `matchupId`, `submittedBy`, `winner`
- Validates only against room participant/matchup data

Missing:
- No authenticated submitter
- No bearer token
- No binding of token subject to participant
- No replay/abuse protection beyond duplicate `(matchupId, submittedBy)` pair

Decision:
- Must be protected before launch.
- `submittedBy` must stop being authoritative input and should be removed from the public contract for result submission.

### Share boundary

Implemented evidence:
- In the visible backend file, there is no dedicated share endpoint.
- The only publicly readable share-like surface is `GET /api/v1/rooms/:roomCode`, which returns room summary metadata.
- The only full-data read surface is `GET /api/v1/rooms/:roomCode/session`, which is public today.

Decision:
- For launch, “share” should resolve to public room-summary access only, not full session exposure.
- If results sharing requires full result detail, add either:
  - a dedicated public results-share projection endpoint, or
  - a room setting plus explicit safe projection
- Do not use the current public session endpoint as the share mechanism.

## 4. Exact env/cookie/header/token/secrets dependencies for auth to function safely at launch

### Implemented today

Backend env variables actually used in `workspace/backend/src/index.ts`:

- `PORT`
- `PERSIST_ROOMS`
- `ROOMS_FILE`

No cookies are parsed or set.
No `Authorization` header is read.
No token is issued or verified.
No secret/key material is loaded except generic dotenv file loading.

Frontend dependency evidence:
- `workspace/frontend/package.json` shows no auth package, cookie helper, or JWT helper.

Decision:
- Safe launch auth dependencies are almost entirely missing, not partially implemented.

### Required at launch

#### Headers

Must implement:
- `Authorization: Bearer <access-token>` on protected routes

Backend touchpoint:
- `workspace/backend/src/index.ts` must parse and validate bearer tokens before protected route handlers.

Frontend touchpoint:
- frontend request layer must attach the bearer token after join and host auth on:
  - `GET /api/v1/rooms/:roomCode/session`
  - `POST /api/v1/rooms/:roomCode/results`
  - `POST /api/v1/rooms` for hosts

#### Tokens

Must implement:
- access token only for v1
- `RS256`
- `7d` expiry
- required claims:
  - `iss`
  - `aud`
  - `sub`
  - `iat`
  - `exp`
  - `jti`

Recommended additional claim(s):
- `role`
- `roomCode` for guest tokens

Decision:
- No refresh-token system is required for launch if 7-day access tokens are accepted and revocation tradeoffs are acknowledged.

#### Secrets / keys / env

Must add backend env support for at least:
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`

Strongly recommended:
- `JWT_KEY_ID` if key rotation metadata is exposed
- `HOST_AUTH_MODE` if host auth path is feature-gated
- rate-limit configuration envs if middleware is introduced

Decision:
- Auth cannot safely launch without asymmetric signing keys and issuer/audience validation because the adopted baseline explicitly depends on RS256 JWT verification.

#### Cookies

Implemented today:
- none

Launch decision:
- Cookies are not required for launch if bearer-token auth is used consistently.
- If cookies are later introduced, they must be `HttpOnly`, `Secure`, and `SameSite`-scoped appropriately, but that is not required for the smallest launch surface.

## Exact backend/frontend touchpoints required to clear launch auth

### Backend touchpoints

In `workspace/backend/src/index.ts`:

1. Add auth middleware before protected routes
2. Add host-auth token issuance path
3. Update `POST /api/v1/rooms` to require host principal and store owner identity
4. Update `POST /api/v1/rooms/:roomCode/join` to mint and return a room-bound guest token
5. Update `GET /api/v1/rooms/:roomCode/session` to require room-bound authorization
6. Update `POST /api/v1/rooms/:roomCode/results` to derive submitter from authenticated principal, not `submittedBy`
7. Extend room/participant model to store:
   - `hostSubjectId` on rooms
   - `subjectId` on participant or equivalent membership mapping
8. Add 401/403 behavior
9. Add rate limiting around create/join/auth/results
10. Add env validation for JWT keys/issuer/audience at startup

### Frontend touchpoints

Visible frontend code was not provided in this read beyond `workspace/frontend/package.json`, but prior verification in dept chat established no auth provider or route guarding in `workspace/frontend/src/main.tsx` and `workspace/frontend/src/App.tsx`.

Frontend must therefore add:

1. token capture/storage after join response
2. token capture/storage after host auth
3. `Authorization` header attachment on protected API calls
4. explicit unauthenticated/authenticated room-state handling
5. 401/403 handling that returns user to join/auth flow rather than silently failing
6. no reliance on client-managed participant IDs as identity proof

## Must-fix-before-launch

- Protect `POST /api/v1/rooms` with authenticated host identity (`workspace/backend/src/index.ts`)
- Add room ownership binding on create (`workspace/backend/src/index.ts`)
- Mint room-bound guest credential on join instead of returning only a bare participant object (`workspace/backend/src/index.ts`)
- Protect `GET /api/v1/rooms/:roomCode/session` (`workspace/backend/src/index.ts`)
- Protect `POST /api/v1/rooms/:roomCode/results` and remove caller-authoritative `submittedBy` identity (`workspace/backend/src/index.ts`)
- Add JWT signing/verification dependencies beyond `express` and `dotenv` (`workspace/backend/package.json`)
- Add launch auth env contract for issuer/audience/keys (`workspace/backend/src/index.ts` and environment setup)
- Add minimal abuse controls on room create/join/results

## Safe-to-defer

- Guest-to-account upgrade flow
- Account merge handling, once guest principals are properly token-bound
- Refresh tokens
- Cookie-based auth
- Multi-device session management
- Password reset/social auth
- Dedicated public share/results projection endpoint, if room-summary-only sharing is acceptable at launch