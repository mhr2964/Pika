# Pika repo-surface manifest for devops

Status: **platform-reconstructed from current working context**
Confidence: **mixed** — path/layout and shared contract/docs are high-confidence; package manager and exact root scripts are inferred because direct repo reads were previously failing.

## 1) Monorepo / package manager

- Repository shape behaves like a **light monorepo / multi-app repo**
- Active top-level app roots:
  - `frontend/`
  - `backend/`
- Shared contract root:
  - `packages/contracts/`
- Shared docs root:
  - `docs/`

### Package manager choice
- **Unconfirmed**
- Safest current assumption for devops docs: **Node.js repo using npm-compatible scripts**
- Do **not** claim pnpm/turborepo/nx unless directly confirmed later

## 2) Expected top-level scripts

These are the scripts devops should document as the intended root interface, even if they still need wiring by app owners:

- `install` / setup:
  - install root dependencies if a root `package.json` exists
  - otherwise install separately in `frontend/` and `backend/`

Recommended root script contract for docs:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run start`

### Intended behavior
- `dev` → boot frontend + backend local development servers
- `build` → build frontend bundle and backend production output
- `start` → run backend server and serve frontend according to app ownership choice
- If no root scripts exist yet, fallback is per-app execution from `frontend/` and `backend/`

## 3) Expected app directory structure
