# Pika preview deployment audit

## Objective
Fastest previewable deployment path for the internal demo once the core room slice is integration-complete across frontend + backend.

This document names:
- the recommended hosting shape
- required environment variables
- build/start commands
- current repo observations
- missing prerequisites that still need to exist before a smooth internal demo deployment

## Recommendation: fastest hosting shape

### Preferred preview shape
Deploy as **two services**:

1. **Frontend:** static/Vite frontend on **Vercel**
2. **Backend:** Node API on **Render** as a web service

### Why this is the fastest path
- The frontend already looks like a Vite app (`frontend/` with `vite.config.ts`, `src/main.tsx`, `src/App.tsx`).
- The backend already looks like a standalone Node service (`backend/src/index.js`, `backend/package.json`, env config, route structure).
- This avoids forcing a framework migration or serverless rewrite.
- This keeps frontend and backend independently previewable while the room slice stabilizes.
- Internal demo readiness is mostly a matter of setting the correct API base URL and backend env vars.

### Non-recommended for “fastest”
- **Single-host monolith:** would require packaging changes and likely app routing adjustments.
- **Frontend on Vercel + backend as Vercel functions:** likely slower because the current backend is not shaped as serverless functions.
- **Docker-first deployment:** possible later, but slower than native Node/static hosting for a fast preview.

---

## Current workspace observations

## Frontend candidates
There are two frontend-shaped directories in the workspace:

### Active app candidate
- `workspace/frontend/`
- Contains `vite.config.ts`, `src/main.tsx`, component tree, and a fuller UI implementation.

### Secondary scaffold / alt app
- `workspace/apps/frontend/`
- Contains lightweight TypeScript scaffold files and a small `src/index.ts`.

### Recommendation
For preview deployment, treat **`workspace/frontend/` as the primary deploy candidate** unless engineering explicitly declares that `workspace/apps/frontend/` is now canonical.

Reason:
- `workspace/frontend/` is much more complete and already shaped like a Vite deploy target.
- `workspace/apps/frontend/` currently reads like a minimal local-dev scaffold, not the richer demo-ready surface.

## Backend candidates
There are two backend-shaped directories in the workspace:

### Active API candidate
- `workspace/backend/`
- Contains Express-style application structure with routes, controllers, storage, env config, and `src/index.js`.

### Secondary scaffold / alt app
- `workspace/apps/backend/`
- Contains minimal TypeScript scaffold files and a small `src/index.ts`.

### Recommendation
For preview deployment, treat **`workspace/backend/` as the primary deploy candidate** unless engineering explicitly declares that `workspace/apps/backend/` is now canonical.

Reason:
- `workspace/backend/` contains the real API shape and route structure needed for the room slice.
- `workspace/apps/backend/` looks like a starter skeleton, not the primary deployable API.

---

## Recommended preview deployment topology

## Service 1: frontend
**Platform:** Vercel  
**Root directory:** `workspace/frontend`  
**Framework preset:** Vite  
**Output directory:** `dist`

### Expected frontend commands
- Install: `npm install`
- Build: `npm run build`
- Preview/start for local verification: `npm run dev` or `npm run preview` if defined by frontend

## Service 2: backend
**Platform:** Render web service  
**Root directory:** `workspace/backend`  
**Runtime:** Node

### Expected backend commands
- Install: `npm install`
- Start: `npm start`

### If backend package scripts are not yet aligned
Backend should expose a production-safe start command that launches `src/index.js` via Node. If absent, add:
- `start`: `node src/index.js`

For local development only, a `dev` script may use nodemon/tsx, but that is not required for preview hosting.

---

## Required environment variables

## Frontend
The frontend needs a browser-safe variable pointing at the deployed backend base URL.

### Required
- `VITE_API_BASE_URL`
  - Example: `https://pika-preview-api.onrender.com`
  - Purpose: points browser requests to the deployed backend API

### Nice to have
- `VITE_APP_ENV=preview`
  - Purpose: enables environment labeling or debug banners if frontend chooses to use it

## Backend
The backend already has env handling under `backend/src/config/env.js`, so the exact variable names should stay aligned with that file.

### Must exist in some form
- `PORT`
  - Render usually injects this automatically
- `NODE_ENV=production`

### Likely required by product behavior
- `CORS_ORIGIN`
  - Should be set to the deployed frontend URL
  - Example: `https://pika-preview.vercel.app`

### If backend currently supports persistence via in-memory store only
No database env vars are required for the first internal demo, **but the deployment must accept ephemeral state**.

### If backend already expects a database or secret values
Those env names must be copied exactly from `backend/src/config/env.js` into the deployment setup.  
Current audit note: the workspace tree shows env config exists, but the exact required variable list is not visible from the file tree alone, so the deploy owner should validate that file before creating the service.

---

## Build and start command matrix

## Frontend (`workspace/frontend`)
Use this shape in hosting config:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Backend (`workspace/backend`)
Use this shape in hosting config:

- Install command: `npm install`
- Build command: none required unless backend adds a compile step
- Start command: `npm start`

## Fallback explicit backend start
If no `start` script exists:
- Start command: `node src/index.js`

---

## Missing infra prerequisites

## 1. Canonical deploy roots must be declared
There is currently a split between:
- `workspace/frontend` vs `workspace/apps/frontend`
- `workspace/backend` vs `workspace/apps/backend`

### Blocker level
**Medium** — not a product blocker, but a deployment ambiguity blocker.

### Required resolution
Before creating preview services, engineering should explicitly confirm:
- deploy frontend from `workspace/frontend`
- deploy backend from `workspace/backend`

That is the recommended choice based on current artifact completeness.

## 2. Backend package scripts must be production-safe
The backend preview deployment depends on a clear install/start path.

### Need to verify
`workspace/backend/package.json` should include:
- `start`
- correct dependency declarations
- compatible Node engine if needed

### Blocker level
**Medium**

### Required resolution
If `npm start` does not exist or is dev-only, update `workspace/backend/package.json`.

## 3. Frontend build script must exist
The Vite app preview deployment depends on:
- `build`
- dependency list compatible with Vercel install/build flow

### Need to verify
`workspace/frontend/package.json` should include:
- `build`
- likely `dev`
- likely `preview`

### Blocker level
**Medium**

### Required resolution
If absent, update `workspace/frontend/package.json`.

## 4. CORS policy must allow the preview frontend origin
If backend is on Render and frontend is on Vercel, browser traffic will fail without allowed origin configuration.

### Required
Backend must support a configured allowed origin, ideally via:
- `CORS_ORIGIN=<frontend preview url>`

### Blocker level
**High** for browser demo success

## 5. Browser API base URL must be configurable
The frontend must not hardcode localhost for API calls.

### Required
Frontend network client should read:
- `import.meta.env.VITE_API_BASE_URL`

### Blocker level
**High** for hosted preview success

## 6. Persistence expectations must be explicit
The backend appears to include storage modules, but the deployment path depends on whether demo data can be ephemeral.

### Fastest internal-demo assumption
- In-memory / ephemeral state is acceptable for preview
- Demo rooms may reset on backend restart

### Blocker level
**Low** if internal demo accepts resets  
**High** if stable persisted rooms are required across restarts

## 7. Health check route should be confirmed
A hosted backend is easier to verify if a stable health route exists.

### Likely present
The tree includes:
- `backend/src/routes/health.js`

### Recommendation
Expose a simple GET health endpoint and use it for Render health checks.

### Blocker level
**Low**, but highly recommended

---

## Fastest path implementation checklist

## Minimum configuration for internal demo preview
1. Confirm canonical deploy roots:
   - frontend: `workspace/frontend`
   - backend: `workspace/backend`
2. Confirm frontend `package.json` has `build`
3. Confirm backend `package.json` has `start`
4. Deploy backend first on Render
5. Copy backend public URL
6. Set frontend env:
   - `VITE_API_BASE_URL=<backend public URL>`
7. Set backend env:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=<frontend public URL>` once known
8. Deploy frontend on Vercel
9. Verify browser flow:
   - create room
   - join room
   - submit result
10. If failures occur, check:
   - CORS mismatch
   - hardcoded localhost URL
   - missing production start script
   - route path mismatch against contracts

---

## Demo-readiness verdict

## Recommended path
**Proceed with Vercel frontend + Render backend preview packaging** as soon as integration-complete is reported.

## Confidence
**High** for fastest preview path selection  
**Medium** for zero-friction deployment, because script/env alignment still needs explicit verification in package manifests and env config.

## Known likely blockers to clear immediately
- canonical app-path declaration
- frontend API base URL configuration
- backend CORS configuration
- production-safe backend start script

---

## Copy-paste deployment summary

### Frontend
- Host: Vercel
- Root: `workspace/frontend`
- Build: `npm run build`
- Output: `dist`
- Env:
  - `VITE_API_BASE_URL=<backend-url>`

### Backend
- Host: Render web service
- Root: `workspace/backend`
- Start: `npm start`
- Env:
  - `NODE_ENV=production`
  - `CORS_ORIGIN=<frontend-url>`
  - `PORT` provided by host

---

## Follow-up needed
A second devops pass should produce provider-specific config artifacts only after engineering confirms the canonical deploy roots and package script compatibility.