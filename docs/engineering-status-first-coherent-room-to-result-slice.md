# Engineering status proof — `first-coherent-room-to-result-slice`

Milestone label: **`first-coherent-room-to-result-slice`**

This artifact is the canonical engineering-readable status for the current slice.

## Canonical roots
- `frontend/`
- `backend/`
- `packages/contracts/`
- `docs/`

`workspace/` is a local worker prefix only and must not appear in repo path references.

## Canonical shared artifacts
- Contract: `packages/contracts/pika-vertical-slice.json`
- Contract explainer: `docs/vertical-slice-contract.md`
- Route map: `docs/route-map.md`
- Mock/seed shape: `docs/mock-data-shape.md`

## Runnable surfaces that exist now
- `frontend/` — binding frontend implementation surface
- `backend/` — binding backend implementation surface
- `packages/contracts/pika-vertical-slice.json` — backend-owned shared API contract
- `docs/` — cross-lane reference surface

## Binding frontend surface for this milestone

Approved frontend screen/state inventory is now absorbed as the binding frontend surface for the slice.

### Frontend screens
1. **Create room**
   - purpose: create a new room and establish ownership context
   - outputs: room id/slug, initial room shell

2. **Option entry**
   - purpose: add, review, and edit candidate options for the room
   - outputs: option list ready for matchup generation

3. **Matchup / play**
   - purpose: present head-to-head choices and collect selections
   - outputs: recorded selections, next matchup or completion state

4. **Results**
   - purpose: show ranked outcome / winner after computation
   - outputs: winner, ranked options, completion view

### Binding frontend state progression
- `create-room`
- `option-entry`
- `matchup-in-progress`
- `results-ready`

### Frontend-to-backend mapping
- Create room ↔ `POST /api/rooms`
- Option entry ↔ `POST /api/rooms/:roomId/options`
- Matchup generation/play ↔ `POST /api/rooms/:roomId/matchups/generate`
- Submit selection ↔ `POST /api/rooms/:roomId/selections`
- Results compute/show ↔ `POST /api/rooms/:roomId/results/compute` + `GET /api/rooms/:roomId/results`

## Slice legibility for other lanes

### In-slice and binding
- create room
- add options
- generate matchup
- submit selections
- compute/show results

### Not yet binding in this slice
- join room as a distinct shared-contract capability
- share result as a distinct shared-contract capability
- mandatory auth-gated ownership

### Ownership model
Auth remains optional in the contract.
- `ownerUserId: string | null`
- `ownerSessionId: string | null`

## Current implementation posture
- Frontend surface is now binding at the screen/state level
- Backend surface is binding at the route/contract level
- Shared contract/docs are binding for cross-lane implementation
- Live end-to-end runtime proof is still not re-verified here; this artifact defines the coherent slice surface other lanes should implement against

## Milestone marker

### `first-coherent-room-to-result-slice`
Meaning:
- one coherent frontend screen/state path exists conceptually and is now binding
- one coherent backend route/contract path exists canonically
- both are aligned through shared docs under `packages/contracts/` and `docs/`

This is the milestone other lanes should anchor to for implementation and validation.