# Slice artifact path

This slice uses the monorepo-style workspace layout already present in the repository.

## Canonical artifact surfaces

- `workspace/apps/frontend/` — app-local frontend runtime artifacts
- `workspace/apps/backend/` — app-local backend runtime artifacts
- `workspace/packages/contracts/` — canonical shared contract surface for this slice
- `workspace/devops/` — delivery, validation, and integration guidance
- `workspace/docs/` — shared human-facing engineering docs

## Current local-development baseline

The local TypeScript runtime setup for this slice is now standardized:

- `workspace/apps/frontend/` uses `tsx`-based `dev` and `start` scripts
- `workspace/apps/backend/` uses `tsx`-based `dev` and `start` scripts
- both apps use `src/index.ts` as the expected runtime entrypoint
- `workspace/packages/contracts/` remains the shared contract package consumed by both sides

This replaces the earlier temporary caveat language about local TypeScript runtime mismatches. For this slice, the expected local app shape is:

- package-level scripts invoke `tsx`
- source entrypoint lives at `src/index.ts`
- shared request/response/domain contracts live under `packages/contracts/src/`

## Path guidance by use case

### Frontend app
Use `workspace/apps/frontend/` when documenting or wiring:

- frontend local run scripts
- frontend app entrypoint expectations
- frontend app-specific package metadata
- frontend-only runtime notes

### Backend app
Use `workspace/apps/backend/` when documenting or wiring:

- backend local run scripts
- backend app entrypoint expectations
- backend app-specific package metadata
- backend-only runtime notes

### Contracts package
Use `workspace/packages/contracts/` when documenting or wiring:

- API/domain types
- cross-team request/response shapes
- mock fixtures supporting local integration
- canonical handoff examples for frontend/backend alignment

Do not point cross-team consumers at ad hoc contract copies elsewhere when `workspace/packages/contracts/` is available.

## Minimal expected app layout

### Frontend
- `workspace/apps/frontend/package.json`
- `workspace/apps/frontend/src/index.ts`
- `workspace/apps/frontend/tsconfig.json`

### Backend
- `workspace/apps/backend/package.json`
- `workspace/apps/backend/src/index.ts`
- `workspace/apps/backend/tsconfig.json`

### Shared contracts
- `workspace/packages/contracts/package.json`
- `workspace/packages/contracts/src/index.ts`
- `workspace/packages/contracts/src/*.ts`

## Documentation rule

When describing local startup, avoid outdated wording that implies the TypeScript entrypoint/runtime setup is still provisional or mismatched. The current documented baseline is:

- frontend and backend local scripts are `tsx`-based
- `src/index.ts` is the expected app entrypoint in both app folders
- any remaining local machine issues should be treated as environment-specific troubleshooting, not as a repo-wide caveat for this slice