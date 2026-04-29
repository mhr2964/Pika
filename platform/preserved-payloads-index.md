# Preserved payloads index

This index lists platform-owned fallback artifacts created to preserve ready-but-undeliverable or path-mismatched payloads.

## Dashboard-related preservation
- `workspace/platform/dashboard-publication-workaround.md`
- `workspace/platform/dashboard-viz.backup.README.md`
- `workspace/platform/dashboard-viz.backup.json`

Status:
- preserved for recovery/reference
- not the live canonical company-root dashboard

## Frontend app-surface preservation
- `workspace/platform/frontend-app-surface-recovery-note.md`
- `workspace/platform/frontend-app-surface.backup.index.ts`
- `workspace/platform/frontend-app-surface.backup.styles.css`

Status:
- preserved for recovery/reference because canonical Sprint 1 app surface writes have shown scope mismatch warnings
- not a replacement for the canonical frontend destination at `workspace/apps/frontend`

## Canonical intent reminder
Canonical Sprint 1 targets remain:
- `workspace/apps/frontend`
- `workspace/apps/backend`
- `workspace/packages/contracts` via `@pika/contracts`

## Practical write-now reminder
Observed currently writable dept-owned surfaces still appear to be:
- `workspace/frontend/`
- `workspace/backend/`
- `workspace/pulse/viz.json`

These are practical current-write realities, not a change to canonical intended destinations.