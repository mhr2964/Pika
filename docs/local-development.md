# Local development

## Current runnable baseline

For the current repo wave, the authoritative runnable app paths are:

- `frontend/`
- `backend/`

The `apps/frontend/` and `apps/backend/` directories remain scaffold-only and should not be treated as the live startup targets.

## Fastest prototype review

If you only want to review the shipped prototype artifact, open:

- `prototype/index.html`

This is a standalone HTML review file and is the quickest way to inspect the current flow without relying on a build step.

## Workspace scripts

The root `package.json` is wired to the active app paths above and includes scripts for the frontend and backend workspaces. Use those only if you intend to work with the code apps; they are not required to open the standalone prototype.