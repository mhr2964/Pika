# Port and Environment Conventions

This file is the Sprint 1 operational naming contract for local development, CI, Docker Compose, and later deployment.

## Current source of truth
- `workspace/devops/port-and-env-conventions.md`

## Intended integrated destinations
- `workspace/.env.example`
- `workspace/docker-compose.yml`
- `workspace/.github/workflows/ci.yml`
- `workspace/docs/port-and-env-conventions.md`

## Current workspace surfaces covered
### Monorepo
- `workspace/package.json`
- `workspace/pnpm-workspace.yaml`
- `workspace/apps/frontend/package.json`
- `workspace/apps/backend/package.json`
- `workspace/packages/contracts/package.json`

### Legacy backend
- `workspace/backend/package.json`
- `workspace/backend/src/index.js`
- `workspace/backend/src/config/env.js`

## Canonical ports
- frontend app: `3000`
- backend api: `4000`
- websocket/realtime reserve: `4001`
- redis: `6379`
- legacy backend published fallback in compose: `4100 -> 4000`

## Canonical local URLs
Browser-facing:
- frontend: `http://localhost:3000`
- backend API: `http://localhost:4000`

Container-to-container:
- monorepo frontend to monorepo backend: `http://apps-backend:4000`
- legacy backend to redis: `redis://redis:6379`

## Canonical environment variables

### Global
- `NODE_ENV`
- `APP_NAME`
- `LOG_LEVEL`

### Frontend-facing
- `FRONTEND_PORT`
- `VITE_API_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

### Backend-facing
- `BACKEND_PORT`
- `API_PORT`
- `WS_PORT`
- `API_HOST`
- `CORS_ORIGIN`

### Infra/data
- `DATABASE_URL`
- `REDIS_URL`
- `REDIS_PORT`

### Secrets
- `SESSION_SECRET`
- `JWT_SECRET`

### Legacy backend compatibility
- `PORT`

## Naming rules
1. Use one canonical frontend port: `3000`.
2. Use one canonical backend API port: `4000`.
3. Reserve `4001` for websocket/realtime expansion; do not overload it now.
4. Prefer shared, framework-agnostic variables first:
   - `FRONTEND_PORT`
   - `BACKEND_PORT`
   - `API_PORT`
5. Keep framework-specific public env aliases only as compatibility helpers:
   - `VITE_API_BASE_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
6. Keep backend-only secrets out of browser-exposed env surfaces.
7. Preserve `PORT` only while the standalone `workspace/backend` remains active.

## Current mapping by workspace area

### `workspace/apps/frontend`
Current state:
- `package.json` exists
- `src/index.ts` exists
- visible runtime framework is still minimal

Should consume:
- `FRONTEND_PORT`
- `VITE_API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL`

### `workspace/apps/backend`
Current state:
- `package.json` exists
- `src/index.ts` exists
- visible runtime framework is still minimal

Should consume:
- `BACKEND_PORT` or `API_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `LOG_LEVEL`
- optional `DATABASE_URL`
- optional `REDIS_URL`

### `workspace/backend`
Current state:
- `package.json` exists
- `src/index.js` exists
- `src/config/env.js` exists
- route surface includes health, rooms, and pika items artifacts

Currently appears to consume or expect:
- `PORT`
- `API_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `REDIS_URL`
- `LOG_LEVEL`

Compatibility guidance:
- map `BACKEND_PORT` to both `PORT` and `API_PORT` when integrating root env files
- keep `PORT=4000` in `.env.example` until legacy backend is removed

## Integration rule
Until platform installs these templates into root destinations, this file is the authoritative env/port contract for Sprint 1.