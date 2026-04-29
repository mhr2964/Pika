# Pika

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## Workspace layout

### Existing department directories
These remain intact and are preserved alongside the engineering monorepo scaffold.

- `frontend/` — existing frontend department artifacts
- `backend/` — existing backend department artifacts
- `brand/` — brand artifacts
- `growth/` — growth artifacts
- `pulse/` — pulse artifacts

### Canonical engineering paths
- `apps/frontend/` — canonical frontend app package
- `apps/backend/` — canonical backend app package
- `packages/contracts/` — canonical shared TypeScript room-flow contract

## Requirements
- Node.js 20+
- pnpm 9+

## Local setup
1. Copy the root example env file if you need local overrides:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Common commands