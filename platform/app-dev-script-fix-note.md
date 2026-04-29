# App dev-script wiring fix note

## Scope inspected

Reviewed the lightweight app packages at:
- `workspace/apps/frontend/package.json`
- `workspace/apps/backend/package.json`
- `workspace/apps/frontend/src/index.ts`
- `workspace/apps/backend/src/index.ts`
- package-level TypeScript config presence in both app folders

## Problem

Both `apps/frontend` and `apps/backend` use TypeScript entrypoints under `src/index.ts`. The minimal risk issue in this setup is script wiring: if package scripts assume plain `node` execution, the `.ts` entrypoint will not run directly in local dev without a TS-aware runner.

## Minimal fix landed

Updated both app package manifests to use `tsx` for direct TypeScript execution:

- `dev`: `tsx watch src/index.ts`
- `start`: `tsx src/index.ts`
- `build`: `tsc -p tsconfig.json`

Also added local dev dependencies:
- `tsx`
- `typescript`

## Why this is the smallest safe change

- preserves current entrypoint layout
- does not force a framework or bundler decision
- supports direct local execution of `.ts` files immediately
- keeps build behavior explicit via existing package tsconfig files
- avoids touching product code inside `src/`

## Repo-level implication

This is sufficient if the workspace root install resolves package-local dev dependencies through the existing workspace manager.

If a follow-up is requested, the next minimal repo-level check would be:
1. verify root workspace install includes these app packages
2. optionally add root convenience scripts that delegate into `apps/frontend` and `apps/backend`
3. confirm whether these app folders remain long-term runnable surfaces or are temporary scaffolds beside the main `frontend/` and `backend/` implementations

## Result

`workspace/apps/frontend` and `workspace/apps/backend` now have package scripts aligned with their current TypeScript entrypoints, with no product-surface behavior changes.