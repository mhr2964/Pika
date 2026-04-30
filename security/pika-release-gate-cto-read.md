# Pika Release-Gate Security Read for CTO
Date: 2026-04-30

Source of truth: `workspace/security/pika-launch-gates.md`  
Companion input: `workspace/auth/pika-auth-launch-brief.md`

This companion file is intentionally concise. It translates the currently evidenced launch gates into the shortest safe sequencing read for CTO planning and is aligned to the executive auth decision: **v1 is guest-first, server-bound session only**. Anonymous-to-account upgrade is deferred and is not a launch requirement unless a live code path brings it into scope.

## Must-Fix Before Launch

| Item | Rationale | Affected surface | Required proof to clear | Owner dept |
| --- | --- | --- | --- | --- |
| Enforce backend authorization for protected room, host, and results actions before business logic | The canonical gate file shows no current repo evidence that protected room/results/host actions are derived from verified server-bound session context with role or membership checks. | `backend/src/index.js`, `backend/src/index.ts`, `backend/src/routes/rooms.js`, `backend/src/controllers/roomsController.js`, `backend/src/storage/roomsStore.js` | Route wiring showing protected endpoints use verified session enforcement; controller/storage code showing role/membership checks occur before protected data/action handling; negative tests proving unauthorized and wrong-role requests are rejected. | auth + backend |
| Implement server-bound session/grant integrity for guest-first protected flows | The auth decision is fixed, but current workspace evidence still does not prove issuance/verification for guest-first protected sessions or room grants. | Auth/session handling across protected room and results flows; `backend/src/index.js`, `backend/src/index.ts`, `backend/src/types/sessions.ts` | Implementation artifact for server-issued and verified session/grant controls; tests for invalid, expired, forged, replayed, and cross-room misuse rejection. | auth + backend |
| Define and validate required session-safety secrets/env configuration | Current evidence still shows missing auth/session secret requirements and startup validation, which makes the chosen session model operationally unproven. | `backend/src/config/env.js`, `workspace/.env.example`, `devops/port-and-env-conventions.md`, `devops/deployment-readiness-report.md`, `docs/deployment-checklist.md` | Backend/auth config listing required env vars or signing material with boot-time validation; deployment docs stating secure provisioning requirements. | auth + backend + devops |
| Add abuse controls on public room create, room join, and share-entry surfaces | Current backend route/middleware evidence shows no throttling or equivalent abuse control on the public entry surfaces that matter for launch. | `backend/src/routes/rooms.js`, `backend/src/middleware/*`, public room create/join/share-entry routes | Middleware/config showing throttling or equivalent abuse protection on these routes; tests proving repeated abusive requests are constrained. | backend + auth |

## Later — Explicitly Non-Blocking Under Current v1 Baseline
- Anonymous-to-account upgrade, account linking, guest-to-account migration, and identity-merge semantics are **later**, not launch requirements, because no live code path in the reviewed workspace currently exposes them.
- Additional post-launch hardening beyond the minimum guest-first server-bound session baseline is **later** if the must-fix proofs above land.
- Abuse controls outside product-controlled room create/join/share-entry surfaces are **later** in this read.

## CTO Sequencing Guidance
To avoid churn, sequence around the fixed auth decision rather than reopening identity strategy: first lock the concrete guest-first server-bound session contract and any room-grant format with auth and backend; next wire backend authorization and role/membership checks for room, host, and results boundaries against that contract; then add the negative-path tests that prove invalid, expired, forged, replayed, cross-room, unauthorized, and wrong-role requests fail; in parallel, backend/auth/devops should add the minimum session-safety env definitions and boot validation; once the protected endpoint map is stable, attach abuse controls to the final public room create/join/share-entry routes.