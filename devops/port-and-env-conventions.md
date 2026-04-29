# Port and Environment Conventions

This document defines the Sprint 1 operational contract for local development, CI, and future deployment.

## Intended root consumers
- `workspace/package.json`
- `workspace/docker-compose.yml`
- `workspace/.github/workflows/ci.yml`
- `workspace/apps/frontend`
- `workspace/apps/backend`
- `workspace/backend`

## Canonical ports
- frontend app: `3000`
- backend api: `4000`
- websocket/realtime reserve: `4001`
- redis: `6379`
- legacy backend published fallback in compose: `4100 -> 4000`

## Canonical URLs
Local browser URLs:
- frontend: `http://localhost:3000`
- backend: `http://localhost:4000`

Container-to-container references:
- frontend to backend: `http://apps-backend:4000`
- legacy backend redis: `redis://redis:6379`

## Canonical env names

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

### Secrets
- `SESSION_SECRET`
- `JWT_SECRET`

## Naming rules
1. Prefer framework-agnostic canonical variables first:
   - `FRONTEND_PORT`
   - `BACKEND_PORT`
   - `API_PORT`
2. Carry framework-specific aliases only where they unblock active runtime choices:
   - `VITE_API_BASE_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
3. Keep public/browser envs distinct from backend-only secrets.
4. Use one default backend port (`4000`) across:
   - local direct run
   - compose
   - CI smoke targets
5. Reserve `4001` for future websocket/realtime separation rather than overloading it now.

## Current mapping by workspace surface

### `workspace/apps/frontend`
Should consume:
- `FRONTEND_PORT`
- `VITE_API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL`

### `workspace/apps/backend`
Should consume:
- `BACKEND_PORT` or `API_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `LOG_LEVEL`
- optional `DATABASE_URL`
- optional `REDIS_URL`

### `workspace/backend`
Currently visible env surface suggests:
- `PORT`
- `API_PORT`
- `API_HOST`
- `CORS_ORIGIN`
- `REDIS_URL`
- `LOG_LEVEL`

For consistency, root env templates should expose canonical names while compatibility shims can map:
- `BACKEND_PORT -> PORT`
- `BACKEND_PORT -> API_PORT`

## Recommendation
Use this conventions file as the authoritative naming contract until platform moves the templated artifacts into root destinations.