# Release status

## Shipped

- Standalone prototype review artifact at `prototype/index.html`
- Current implementation workspaces at `frontend/` and `backend/`
- Shared contract artifacts at `packages/contracts/`
- Repo state already pushed to the configured GitHub remote (`origin/main`)

## Repo-ready

- Root repo handoff README at `README.md`
- Local-development orientation at `docs/local-development.md`
- Repo hygiene via `.gitignore`
- Root workspace scripts in `package.json`
- Launch-authoritative app roots are explicitly `frontend/` and `backend/`
- Older `apps/*` paths remain scaffold-only and are not the launch surface

## Remaining launch-blocking release gaps

- Deploy topology is not yet fully locked in a launch runbook:
  - backend hosting target
  - frontend hosting target
  - production/preview API base URL strategy
- Environment/secret readiness is still blocked:
  - backend runtime env values
  - frontend public API base URL value
  - auth/session secret material
  - CORS/session domain configuration
- Auth/session attachment remains a blocked dependency for release completion
- Security-gated controls remain blocked where owned by auth/security:
  - authorization/session verification
  - abuse/rate-limit controls
  - safe release-ready CORS/session settings
- Production smoke and rollback steps cannot be closed until deployed infrastructure and auth/session configuration are finalized

## Not a current blocker

- No additional repo-hygiene or handoff document is required for basic repo usability in the minimum launch cut