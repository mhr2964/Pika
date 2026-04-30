# Pika Launch Gates — Canonical Security Source of Truth
Date: 2026-04-30  
Scope: v1 launch security gates based only on evidence present in the current workspace. Missing evidence is recorded as missing; this document does not infer controls that are not evidenced in code or docs.

## Launch Gates Table

| Gate Name | Blocker Status | Severity | Owner Dept | Required Evidence | Current Evidence | Ship / No-Ship Criterion |
| --- | --- | --- | --- | --- | --- | --- |
| Room read/write authorization enforced before business logic | BLOCKED | Critical | backend + auth | Server-side route/middleware/controller evidence that room reads/writes require authenticated identity and room membership before room data is returned or mutated; test coverage proving unauthorized access is denied. | `backend/src/routes/rooms.js` exposes room routes; `backend/src/controllers/roomsController.js` handles room create/join/get/submit flows; no evidence in cited files of authenticated user enforcement or membership checks before business logic. `frontend/src/lib/roomClient.ts` shows client-side room access flow, which is not a security boundary. | **No-ship** until backend/auth artifacts show pre-business-logic authz checks and repo tests prove unauthorized room access is rejected. |
| Results access restricted to authorized room participants or host | BLOCKED | Critical | backend + auth | Server-side handler/storage checks that results endpoints/data are limited to authorized participants/host, plus tests covering unauthorized result access denial. | Existing evidence set (`backend/src/controllers/roomsController.js`, `backend/src/storage/roomsStore.js`, `frontend/src/lib/roomClient.ts`, `docs/minimum-launch-release-slice.md`) does not show server-enforced authorization for results retrieval. No results auth test artifact is present in the cited workspace files. | **No-ship** until backend/auth proof shows results are access-controlled server-side and tests demonstrate denial for non-members/non-hosts. |
| Session/grant integrity bound to authenticated identity and room membership | BLOCKED | Critical | auth + backend | Evidence that room participation/session state is bound to a verified user/session identity, with membership checks enforced on each protected action. | `backend/src/types/sessions.ts` exists, but current round evidence does not show implemented enforcement binding room actions to authenticated identity in routes/controllers. `backend/src/controllers/roomsController.js` and `backend/src/storage/roomsStore.js` do not provide evidenced auth-bound enforcement from the reviewed artifacts. | **No-ship** until auth/backend artifacts show identity-bound session enforcement for protected room actions and tests prove cross-user/session misuse is denied. |
| Session tokens or room grants are signed, expiring, and server-issued | BLOCKED | Critical | auth + backend | Implemented token/grant issuance and verification artifacts showing signed, expiring, non-forgeable credentials; config/docs for issuance requirements; tests for invalid/expired token rejection. | System policy states the v1 auth baseline should use JWT RS256 with `iss/aud/sub/iat/exp/jti`, but no implementation artifact in the reviewed workspace proves issuance/verification is present. No current repo evidence shows signed server-issued room grants or token validation for protected room routes. | **No-ship** until repo evidence includes implementation of signed expiring credentials plus tests for valid, invalid, expired, and forged-token rejection. |
| Secrets handling for auth/security configuration is defined and validated | BLOCKED | High | auth + devops + backend | Environment/config artifacts listing required secret-bearing vars, secure storage guidance, validation on boot, and deployment documentation for secret provisioning/rotation. | `backend/src/config/env.js` loads only `PORT` and `HOST`; no secret-bearing auth/security env vars or validation are evidenced there. `devops/port-and-env-conventions.md`, `devops/deployment-readiness-report.md`, and `docs/deployment-checklist.md` do not define secret storage, rotation, required auth env vars, or environment validation gates. | **No-ship** until auth/devops/backend add concrete secret/env requirements and boot-time validation artifacts, with deployment docs covering secure provisioning. |
| Abuse and rate-limit controls on auth or room-entry surfaces | BLOCKED | High | auth + backend | Middleware/config/tests for signup/login abuse controls, room join/create throttling, or equivalent rate-limit protections on abuse-prone endpoints. | `backend/src/routes/*.js`, `backend/src/middleware/*`, and `backend/scripts/smoke-test.js` show no evidenced rate-limit middleware, lockout, challenge, or abuse guard. No signup/login throttling artifact is present in the current workspace evidence reviewed this round. | **No-ship** until backend/auth repo artifacts show abuse controls on relevant endpoints and tests verify throttling or equivalent protections. |

## Room / Results Authorization
**Status:** BLOCKED

Evidence reviewed this round:
- `backend/src/routes/rooms.js`
- `backend/src/controllers/roomsController.js`
- `backend/src/storage/roomsStore.js`
- `frontend/src/lib/roomClient.ts`
- `docs/minimum-launch-release-slice.md`
- `docs/push-readiness-verdict.md`

Findings:
- The workspace contains room routes and controllers, but the reviewed backend artifacts do not provide evidence of authenticated, membership-based authorization being enforced before room business logic executes.
- The frontend client flow references room access behavior, but frontend behavior is not accepted as authorization proof.
- No reviewed artifact proves that results visibility is server-restricted to authorized participants or host.
- No reviewed test artifact proves denial of unauthorized room or result access.

Proof that would clear this gate:
1. Backend/auth implementation artifact showing authz checks before room read/write or results retrieval logic.
2. Tests proving non-members and unauthenticated callers are denied room and results access.
3. If host-only actions exist, tests proving non-host participants are denied those actions.

## Grant / Session Integrity
**Status:** BLOCKED

Evidence reviewed this round:
- `backend/src/index.ts`
- `backend/src/index.js`
- `backend/src/controllers/roomsController.js`
- `backend/src/storage/roomsStore.js`
- `backend/src/types/sessions.ts`

Findings:
- A sessions type artifact exists, but reviewed code does not provide evidence that room operations are bound to authenticated identity and verified room membership at enforcement points.
- The auth baseline policy exists as a system directive, but implementation proof is missing from current workspace evidence.
- No reviewed test artifact shows rejection of forged, expired, or cross-user session/grant misuse.

Proof that would clear this gate:
1. Implemented auth/backend artifact showing signed, expiring, server-issued session or grant credentials.
2. Route/controller verification logic proving protected actions require valid credentials.
3. Tests covering invalid signature, expired token, wrong audience/issuer if used, and cross-user/session misuse rejection.

## Secrets Handling
**Status:** BLOCKED

Evidence reviewed this round:
- `backend/src/config/env.js`
- `devops/port-and-env-conventions.md`
- `devops/deployment-readiness-report.md`
- `docs/deployment-checklist.md`

Findings:
- Only `PORT` and `HOST` are evidenced in backend environment loading.
- No reviewed artifact defines required auth/security secrets, provisioning method, rotation expectation, or startup validation for missing/weak secret configuration.
- No reviewed deployment document provides concrete secret-handling gates for launch.

Proof that would clear this gate:
1. Backend/auth config artifact listing required secret-bearing env vars and validating them on startup.
2. DevOps/deployment document describing secure secret provisioning and expected launch-time configuration.
3. If asymmetric signing is used, evidence of key configuration requirements and validation.

## Abuse / Rate-Limit Controls
**Status:** BLOCKED

Evidence reviewed this round:
- `backend/src/routes/health.js`
- `backend/src/routes/pikaItems.js`
- `backend/src/routes/rooms.js`
- `backend/src/middleware/errorHandler.js`
- `backend/scripts/smoke-test.js`

Findings:
- No reviewed route or middleware artifact shows rate limiting, abuse throttling, or equivalent guardrails.
- No reviewed test artifact demonstrates abuse protection on login, signup, room join, or room creation surfaces.
- Current workspace evidence does not support claiming baseline abuse controls are implemented.

Proof that would clear this gate:
1. Middleware/config artifact implementing throttling or equivalent abuse protection on relevant endpoints.
2. Route wiring showing those controls are active on launch-critical surfaces.
3. Tests proving repeated abusive requests are constrained as designed.

## Concise Verdict
Launch recommendation: **NO-SHIP**.

Blocked gates:
1. **Room read/write authorization enforced before business logic** — clear with backend/auth enforcement artifacts plus tests proving unauthorized access denial.
2. **Results access restricted to authorized room participants or host** — clear with server-side results authz implementation and tests for non-member/non-host denial.
3. **Session/grant integrity bound to authenticated identity and room membership** — clear with identity-bound enforcement artifacts and tests for cross-user/session misuse denial.
4. **Session tokens or room grants are signed, expiring, and server-issued** — clear with token/grant issuance + verification implementation and invalid/expired/forged credential tests.
5. **Secrets handling for auth/security configuration is defined and validated** — clear with required secret/env definitions, startup validation, and deployment secret-provisioning documentation.
6. **Abuse and rate-limit controls on auth or room-entry surfaces** — clear with active abuse-control middleware/config plus tests demonstrating throttling or equivalent protection.