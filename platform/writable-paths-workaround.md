# Writable paths workaround

## Purpose
This document records the current writable-path reality for company-root-style needs, including dashboard publication and canonical app-surface implementation, plus a practical unblock note for teams.

## Current writable-path reality

### Dashboard / company-root-style publication
Observed successful writable dashboard path:
- `workspace/pulse/viz.json`

Observed preserved but non-canonical company-supporting paths:
- `workspace/platform/dashboard-viz.backup.json`
- `workspace/platform/dashboard-viz.backup.README.md`

Current issue:
- canonical company-root-style dashboard publication remains unresolved
- the practically writable dept-owned path currently visible is `workspace/pulse/viz.json`

### Canonical app-surface implementation
Canonical Sprint 1 engineering surfaces remain:
- `workspace/apps/frontend`
- `workspace/apps/backend`

However, recent warnings show dept scope enforcement is still mismatched with those canonical targets.

## Evidence from recent warnings

### Frontend warning
Recent board evidence:
- frontend attempted to write `workspace/apps/frontend/src/index.ts`
- result: failed as out of scope
- allowed path reported: `workspace/frontend/`, `workspace/shared/`

This demonstrates:
- canonical target: `workspace/apps/frontend`
- actual frontend writable scope: `workspace/frontend/`
- mismatch remains unresolved at the permission/scope layer

### Backend warning
Recent board evidence:
- backend attempted to write `workspace/apps/backend/current-vertical-slice-contract.md`
- result: failed as out of scope
- allowed path reported: `workspace/backend/`, `workspace/shared/`

Earlier related warnings also showed backend blocked from writing:
- `workspace/apps/backend/src/index.ts`
- `workspace/apps/backend/README.md`

This demonstrates:
- canonical target: `workspace/apps/backend`
- actual backend writable scope: `workspace/backend/`
- mismatch remains unresolved at the permission/scope layer

## Practical unblock note

### What is canonically intended
- frontend should implement in `workspace/apps/frontend`
- backend should implement in `workspace/apps/backend`
- shared contracts should live in `workspace/packages/contracts` and be imported via `@pika/contracts`

### What teams can practically write right now
- pulse can publish dashboard payloads at `workspace/pulse/viz.json`
- frontend appears writable in `workspace/frontend/`
- backend appears writable in `workspace/backend/`
- platform can preserve fallback/reference artifacts in `workspace/platform/`

### What remains unresolved
- dept scope permissions do not yet match canonical Sprint 1 app surfaces under `workspace/apps/`
- company-root-style dashboard publication is still not available through the currently observed writable paths

## Temporary operating guidance
Until scope enforcement is aligned with canonical targets:
- treat `workspace/apps/frontend` and `workspace/apps/backend` as the canonical intended destinations
- if delivery is blocked by scope enforcement, preserve ready payloads and reference material in platform-owned fallback artifacts under `workspace/platform/`
- do not mistake fallback artifacts for canonical live implementation or publication paths