# Incremental validation note

This note documents what should be validated at the artifact level for the current slice without treating command execution as part of this deliverable.

## Validation scope

Review the following artifact surfaces together:

- `workspace/apps/frontend/`
- `workspace/apps/backend/`
- `workspace/packages/contracts/`
- `workspace/docs/local-development.md`
- relevant app READMEs under `workspace/apps/`

## Local-development baseline to validate

For this slice, local app expectations are now:

- frontend package scripts use `tsx` for `dev` and `start`
- backend package scripts use `tsx` for `dev` and `start`
- frontend entrypoint is `workspace/apps/frontend/src/index.ts`
- backend entrypoint is `workspace/apps/backend/src/index.ts`

This supersedes the earlier note that local TypeScript execution should be treated as a best-effort caveat.

## Artifact checks

### App manifests
Confirm each app package manifest reflects the intended local runtime baseline:
- `dev` script present
- `start` script present
- both scripts use `tsx`
- script targets are consistent with `src/index.ts`

### App source entrypoints
Confirm each app includes:
- `src/index.ts`
- file path consistent with documented scripts
- no docs pointing to obsolete entry files

### Shared contracts
Confirm shared handoff references use:
- `workspace/packages/contracts/`
- current package README and exported sources
- no stale docs telling teams to align against some other temporary contract path

### Docs
Confirm the following docs no longer present the old caveat as the active baseline:
- `workspace/devops/slice-artifact-path.md`
- `workspace/devops/integration-guide.md`
- `workspace/devops/incremental-validation-note.md`
- `workspace/docs/local-development.md`
- app READMEs under `workspace/apps/` where applicable

## Review outcome language

Preferred:
- “Local app development uses `tsx`-based scripts with `src/index.ts` entrypoints.”
- “The contracts package under `workspace/packages/contracts/` is the canonical shared handoff surface.”

Avoid:
- “TypeScript local runtime is currently best effort.”
- “The current slice is expected to have a dev-script/runtime mismatch.”
- any wording that treats the previous caveat as still in force

## If new drift is found

If future updates introduce a real mismatch again, document:
- the exact app affected
- the exact broken script or entrypoint path
- the specific artifact needing change

Do not restore broad caveat language without a concrete artifact-level regression.