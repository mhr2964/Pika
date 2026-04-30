# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Workspace layout

### Canonical app structure
- `workspace/apps/frontend/` — primary frontend app workspace
- `workspace/apps/backend/` — primary backend app workspace
- `workspace/packages/contracts/` — shared contracts package
- `workspace/docs/` — shared product and development documentation
- `workspace/brand/` — brand deliverables
- `workspace/growth/` — growth deliverables
- `workspace/devops/` — deployment and operations docs

### Legacy / parallel trees currently present
- `workspace/frontend/`
- `workspace/backend/`

These legacy/parallel trees exist in the repository today, but they are **not the intended canonical baseline** for the current workspace structure. For first-push coherence, treat `apps/frontend` and `apps/backend` as the primary app locations unless leadership explicitly approves a consolidation plan.

## Local development
See `workspace/docs/local-development.md`.

## Shared contracts
See `workspace/packages/contracts/README.md`.

## First-push note
This repository is structurally push-ready at the root/shared level, with one known caveat: parallel legacy app trees still exist and should be cleaned up in a follow-up pass if the team wants a single unambiguous app layout.