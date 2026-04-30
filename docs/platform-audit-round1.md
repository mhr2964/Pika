# Platform Audit — Repo/Workspace Wiring Blockers (Round 1)

Project: **Pika**  
Purpose: **Pika helps groups rank choices fast through playful head-to-head matchups, then share the result.**

## Scope audited
Per manager assignment, this audit identifies likely repo/workspace blockers affecting:
- relative path resolution and cross-department reads
- app boot scaffolding
- env sample file presence
- shared contract discoverability
- route map location
- seed/mock data shape location
- repo/workspace structural consistency

## Current known source of truth
From project metadata:
- canonical contract authority: **backend**
- canonical contract path: **`workspace/packages/contracts/pika-vertical-slice.json`**

## High-confidence structural blockers

### 1) Shared contract path conflicts with default workspace conventions
The project metadata points to:

`workspace/packages/contracts/pika-vertical-slice.json`

But platform’s normal shared area is:
- `workspace/shared/` for cross-department readable artifacts

This creates a discoverability and read-path risk:
- some teams may read `workspace/shared/...`
- project metadata points to `workspace/packages/...`
- if tooling assumes one root while artifacts live in another, relative reads fail with ENOENT

**Fix recommendation**
- Treat `workspace/packages/contracts/` as the canonical path because project metadata explicitly names it.
- Ensure the following directories exist:
  - `workspace/packages/`
  - `workspace/packages/contracts/`
- Add a platform-owned README in `workspace/shared/` that points readers to the canonical contract path.
- Do **not** duplicate canonical contract JSON unless explicitly directed; duplication risks drift.

### 2) Missing repo-root workspace map likely causing read confusion
Current assignment mentions broken file-path resolution for repository reads. The most common structural cause is absence of a single authoritative workspace map at repo-visible entry points.

**Fix recommendation**
Create or repair:
- `workspace/README.md`
- `workspace/docs/`
- `workspace/docs/route-map.md`
- `workspace/docs/mock-data-shape.md`
- `workspace/docs/env.md`

This gives all departments a stable place to read location decisions without guessing paths.

### 3) Missing root `.gitignore` and env sample conventions can block boot and confuse ownership
If no root ignore/sample policy exists, teams may scatter env files in inconsistent locations.

**Fix recommendation**
At minimum establish:
- `workspace/.gitignore`
- `workspace/.env.example`
- `workspace/backend/.env.example`
- `workspace/frontend/.env.example`

If stack is not confirmed, keep variables generic and non-framework-specific.

### 4) Missing package-style shared folder may break relative import assumptions
Because metadata uses `workspace/packages/contracts/...`, some consumers may expect a package-like tree under `workspace/packages/`.

**Fix recommendation**
Create placeholders:
- `workspace/packages/.gitkeep`
- `workspace/packages/contracts/.gitkeep`

This unblocks readers and writers immediately.

### 5) Route map and seed/mock shape do not have an explicitly declared home
Even if backend owns the contract, frontend/backend/prototype all need stable docs for:
- route list
- API endpoint map
- example payloads
- seed/mock entities

**Fix recommendation**
Platform should establish docs homes only:
- `workspace/docs/route-map.md`
- `workspace/docs/mock-data-shape.md`

Content can start as placeholders with explicit ownership notes if product teams have not published specifics yet.

## Concrete fix list

### Immediate platform-owned files to create/repair
1. `workspace/README.md`
   - describe folder layout
   - explicitly mention canonical contract path:
     `workspace/packages/contracts/pika-vertical-slice.json`

2. `workspace/.gitignore`
   - ignore common env/build/dependency artifacts

3. `workspace/.env.example`
   - repo-wide shared env naming guidance only

4. `workspace/shared/README.md`
   - clarify that canonical API contract is **not** here
   - point to `workspace/packages/contracts/pika-vertical-slice.json`

5. `workspace/docs/env.md`
   - document env file placement conventions

6. `workspace/docs/route-map.md`
   - placeholder route map doc with ownership notes

7. `workspace/docs/mock-data-shape.md`
   - placeholder seed/mock shape doc with ownership notes

8. placeholder directories if missing:
   - `workspace/packages/.gitkeep`
   - `workspace/packages/contracts/.gitkeep`
   - dept `.gitkeep` files for active departments lacking directories

### Files likely needed from owning departments after platform setup
- **backend**
  - `workspace/packages/contracts/pika-vertical-slice.json`
  - backend-specific env variables in `workspace/backend/.env.example`
  - API route details to populate `workspace/docs/route-map.md`
  - canonical mock/seed payloads to populate `workspace/docs/mock-data-shape.md`

- **frontend**
  - frontend-specific env variables in `workspace/frontend/.env.example`
  - app route inventory if distinct from API route map

- **devops**
  - CI/release env ownership and deployment variable naming conventions

## Path/layout rules to standardize now

### Canonical read paths
- Repo workspace root: `workspace/`
- Shared documentation: `workspace/docs/`
- Shared platform notes: `workspace/shared/`
- Canonical backend-owned API contract: `workspace/packages/contracts/pika-vertical-slice.json`

### Non-canonical but acceptable
- `workspace/shared/README.md` may reference contracts
- `workspace/docs/` may summarize contract usage

### Avoid
- storing contract copies in both `workspace/shared/` and `workspace/packages/contracts/`
- undocumented reads from guessed paths like `packages/contracts/...` without the `workspace/` prefix
- relative references that depend on caller working directory rather than repo root

## Likely ENOENT cause hypotheses
Without fresh file reads, the most probable blockers are:

1. consumers reading `packages/contracts/...` while files actually live under `workspace/packages/...`
2. consumers reading `workspace/shared/contracts/...` while metadata points to `workspace/packages/contracts/...`
3. missing placeholder directories causing artifact extractor/readers to fail even though intended paths are referenced in docs or board messages
4. absent repo/workspace README causing teams to infer inconsistent roots

## Targeted file reads needed next
To finish the audit with exact repairs instead of inferred ones, I need these reads:


> **manager replied:** ### Plan
> Get the exact workspace artifact state before writing fixes; this requires targeted reads/existence checks on the requested paths.
> 
> ### Assignments
> ASSIGN: platform-engineer — Check existence and contents for the requested workspace files/directories and determine whether the ENOENT issue is from `workspace/`-prefixed paths, repo-root-relative paths, or internal absolute artifact paths. Use targeted reads only where needed.
> [READ:workspace/README.md]
> [READ:workspace/.gitignore]
> [READ:workspace/.env.example]
> [READ:workspace/packages/contracts/pika-vertical-slice.json]
> [READ:workspace/docs/route-map.md]
> [READ:workspace/docs/mock-data-shape.md]
> [READ:workspace/backend/.env.example]
> [READ:workspace/frontend/.env.example]
> 
> ### Status
> Awaiting direct file/existence inspection to answer peer agent accurately and resolve path-read ambiguity.
> 
> ### Verdict
> continue
> 
> ### Reason
> Need the actual file contents/existence results before I can answer the peer request or finalize scaffold repairs. After the read returns, I’ll provide the brief path-state response and fold the findings into the platform fix batch.


## Proposed next dispatch after readback
If the files are absent or inconsistent, platform can immediately ship:
- workspace root README
- root `.gitignore`
- env placement doc
- shared README redirecting contract readers
- docs placeholders for route map and mock-data shape
- missing `workspace/packages/contracts/` placeholders

This round is an audit/fix plan; exact file repairs depend on the requested readback.