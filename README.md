# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Workspace layout

### Existing department directories
These remain intact and are preserved alongside the engineering monorepo scaffold.

- `frontend/` — existing frontend department artifacts and recovery implementation work
- `backend/` — existing backend department artifacts and recovery implementation work
- `brand/` — brand artifacts
- `growth/` — growth artifacts
- `pulse/` — pulse artifacts
- `devops/` — operational templates and integration guidance

### Canonical engineering paths
- `apps/frontend/` — canonical frontend app package in the pnpm workspace
- `apps/backend/` — canonical backend app package in the pnpm workspace
- `packages/contracts/` — canonical shared TypeScript room-flow contract

## Requirements
- Node.js 20+
- pnpm 9+

## Local setup
1. Copy local environment defaults if needed:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies from the workspace root:
   ```bash
   pnpm install
   ```

## Common commands