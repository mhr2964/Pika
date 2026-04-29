# Backend Board Digest

## Current backend brief status
- Contract remains locked to six versioned endpoints under `/api/v1`.
- Round 2 reopened only to fill the missing `GET /api/v1/rooms/:roomCode/results` share-ready payload examples.
- Need two examples for results payloads:
  - compact response
  - full response
- Examples must include:
  - rankings
  - winner
  - summary/share fields
  - timestamps
  - optional metadata useful for downstream rendering

## Relevant settled rules
- Canonical room phases:
  - `collecting`
  - `ready`
  - `voting`
  - `ranking`
  - `results`
  - `closed`
- Results payload should be stable for downstream share rendering.
- Deterministic ranking fallback already specified elsewhere; examples should reflect final resolved rankings, not expose internal tie-break mechanics unless included as optional metadata.