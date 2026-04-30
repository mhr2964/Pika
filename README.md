# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Authoritative runnable layout

The current runnable baseline for this repo is:

- `workspace/frontend/` — active frontend app
- `workspace/backend/` — active backend app

These are the paths that should be used for local development, CI wiring, and first-push repository expectations in the current wave.

## Scaffold-only directories

The following directories exist as scaffold/documentation structure and are **not** the executable baseline for this push:

- `workspace/apps/frontend/`
- `workspace/apps/backend/`

Do not treat `apps/*` as the live runtime path unless leadership explicitly approves a future consolidation.

## Shared structure

- `workspace/packages/contracts/` — shared contracts package
- `workspace/docs/` — shared product and development documentation
- `workspace/brand/` — brand deliverables
- `workspace/growth/` — growth deliverables
- `workspace/devops/` — deployment and operations docs

## Local development

See `workspace/docs/local-development.md` for the current startup paths and conventions.

## Shared contracts

See `workspace/packages/contracts/README.md`.

## Push-readiness note

Repository-facing baseline artifacts now reflect the current repo truth: top-level `frontend/` and top-level `backend/` are authoritative runnable paths for this wave, while `apps/*` remains scaffold-only.