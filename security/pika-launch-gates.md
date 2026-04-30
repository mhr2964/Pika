# Pika Launch Gates — Binding Security Release Gate
Date: 2026-04-30

## Release Ruling
**Binding gate:** This file is the binding Pika v1 security release gate.  
**Current ruling:** ship blocked until critical gates below are evidenced cleared.  
**Release condition:** No route or flow may ship if it exposes room or results reads/writes without server-enforced session identity and membership/privilege checks backed by repo evidence.  
**Current auth baseline:** Guest-first, server-bound session only for v1. Anonymous-to-account upgrade is deferred and is not a launch requirement unless a live repo path brings it into scope.

## Operator Use
Use this ledger as the single release-gate source of truth for launch-baseline security only. Update gate status only when repo evidence lands. Do not reopen broader security analysis here.

## Gate Status Vocabulary
- **BLOCKED** — launch-critical proof is missing; release remains blocked on this gate.
- **CLEARED** — required implementation and proof are present in repo evidence for the current baseline.
- **DEFERRED** — intentionally out of current v1 launch baseline; not a launch blocker unless scope changes.

## Launch Gates Ledger

| Gate | Status | Severity | Owner Dept | Current Evidence | Exact Proof Required to Clear |
| --- | --- | --- | --- | --- | --- |
| Backend authorization for room, host, and results boundaries before business logic | **BLOCKED** | Critical | backend + auth | `backend/src/routes/rooms.js` exposes room routes; `backend/src/controllers/roomsController.js` and `backend/src/storage/roomsStore.js` do not provide current repo evidence of verified server-bound session checks plus membership/privilege enforcement before protected room/results actions. `frontend/src/lib/roomClient.ts` is client flow only and not security proof. | Repo evidence showing protected room/results/host endpoints are wired through verified server-side session enforcement; controller/storage code showing membership and host-role checks occur before protected reads/writes; negative tests proving unauthorized, wrong-member, and wrong-role requests are rejected. |
| Session and grant integrity for guest-first server-bound sessions | **BLOCKED** | Critical | auth + backend | `backend/src/types/sessions.ts` exists and `auth/pika-auth-launch-brief.md` defines the baseline, but reviewed workspace evidence does not yet prove implemented issuance/verification of server-bound session or grant credentials on protected room/results flows. | Repo evidence of server-issued session/grant mechanism for protected guest-first flows; verification logic on protected routes/controllers; tests proving invalid, expired, forged, replayed, and cross-room credentials are rejected. |
| Secrets and env dependencies required for session safety | **BLOCKED** | High | auth + backend + devops | `backend/src/config/env.js` currently evidences only `PORT` and `HOST`. `workspace/.env.example`, `devops/port-and-env-conventions.md`, and `docs/deployment-checklist.md` do not yet provide sufficient repo proof of required session/auth secret configuration and backend startup validation for the chosen session model. | Backend/auth config artifact listing required session/auth env vars or signing material; startup validation that fails safely when required session-safety config is missing or invalid; deployment/docs evidence describing secure provisioning requirements for those values. |
| Abuse throttles on public room create, join, and share-entry surfaces | **BLOCKED** | High | backend + auth | `backend/src/middleware/*` and `backend/scripts/smoke-test.js` do not show throttling or equivalent abuse controls on the public room-entry surfaces. Reviewed room route surfaces do not provide current repo evidence of create/join/share throttles. | Middleware/config showing throttling or equivalent abuse protection on public room create/join/share-entry routes; route wiring proving those controls are active on shipped surfaces; tests proving repeated abusive requests are constrained. |
| Launch docs and gate alignment to approved v1 auth model | **CLEARED** | Medium | auth + security | `workspace/security/pika-launch-gates.md` and `auth/pika-auth-launch-brief.md` are aligned to the approved v1 model: guest-first, server-bound session only; no account-upgrade requirement in launch baseline. | No further proof required unless the auth baseline changes. |
| Anonymous-to-account upgrade / account linking / identity merge | **DEFERRED** | Medium | auth | Current approved v1 baseline excludes account upgrade. Reviewed workspace evidence does not show a live signup, login, account-link, or identity-merge path in current launch scope. | Not required for v1 launch. Re-enter gate review only if live repo code brings account upgrade or linking into scope. |

## Blocked Critical Gates — Clearing Checklist

### 1) Backend authorization for room, host, and results boundaries
**Status:** BLOCKED  
**Why blocked now:** current repo evidence does not prove protected room/results reads or writes are gated by server-enforced session identity and membership/privilege checks before business logic.  
**Clear this gate with exactly:**
1. Protected endpoint wiring that applies verified server-side session enforcement.
2. Controller/storage evidence that room membership and host-only checks happen before protected operations.
3. Negative tests for unauthenticated, non-member, and wrong-role access denial.

### 2) Session and grant integrity for guest-first server-bound sessions
**Status:** BLOCKED  
**Why blocked now:** the baseline is documented, but implementation proof for issuance/verification and misuse rejection is not yet evidenced in the reviewed repo surfaces.  
**Clear this gate with exactly:**
1. Server-issued guest session or grant implementation for protected flows.
2. Verification logic on protected routes/controllers.
3. Tests covering invalid, expired, forged, replayed, and cross-room credential rejection.

### 3) Secrets and env dependencies required for session safety
**Status:** BLOCKED  
**Why blocked now:** current env/config docs do not yet prove the chosen session model’s required secrets/config are defined and validated at startup.  
**Clear this gate with exactly:**
1. Required session/auth env or signing-material definitions in repo config.
2. Backend startup validation for missing/unsafe values.
3. Deployment/docs evidence for secure provisioning of those values.

### 4) Abuse throttles on public room create, join, and share-entry surfaces
**Status:** BLOCKED  
**Why blocked now:** no current repo evidence shows throttling or equivalent abuse protection on the public room-entry surfaces relevant to launch.  
**Clear this gate with exactly:**
1. Active abuse-throttle middleware/config on create/join/share-entry routes.
2. Route wiring evidence showing those protections are enabled.
3. Tests demonstrating repeated abusive requests are constrained.

## Release Disposition
**Current disposition:** CONDITIONAL NO-SHIP.  
Pika v1 remains blocked from release until all **Critical** gates above are evidenced **CLEARED** in repo artifacts. High-severity gates remain required launch-baseline controls and should be closed in the same implementation cycle because they support safe operation of the approved guest-first session model.