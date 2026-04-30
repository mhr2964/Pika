# Pika workspace

Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.

## What this repo contains

This workspace currently includes:

- `prototype/` — the fastest review artifact: a standalone HTML prototype of the shipped flow
- `frontend/` — the current frontend app source
- `backend/` — the current backend app source
- `packages/contracts/` — shared contract artifacts
- `apps/` — older scaffold paths; not the authoritative runnable targets for this repo wave

## Quickest way to view the shipped prototype

Open `prototype/index.html` in a browser.

The prototype is a static review artifact with local sibling assets (for example `prototype.js` and `styles.css`) and is intended for direct file-based review.

## Prototype location and basis

- Prototype entry: `prototype/index.html`
- The prototype’s review notes point back to:
  - `frontend/src/App.tsx`
  - `frontend/src/App.css`
  - `frontend/index.html`

## Current runnable app paths

If you are working with the codebase rather than the standalone prototype, the active app roots are:

- `frontend/`
- `backend/`

The root `package.json` also reflects those current app paths. The `apps/frontend/` and `apps/backend/` directories remain scaffold-only.

## Minimal orientation

- Review/demo the shipped flow: open `prototype/index.html`
- Inspect frontend implementation source: `frontend/`
- Inspect backend implementation source: `backend/`
- Review shared contracts: `packages/contracts/`

For concise path notes, see `docs/local-development.md`.