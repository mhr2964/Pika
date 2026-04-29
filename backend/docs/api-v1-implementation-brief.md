# API v1 Implementation Brief

## Endpoint: `GET /api/v1/rooms/:roomCode/results`

Returns the finalized, share-ready room results once the room has reached `results` or `closed`. This endpoint is intended to support both compact share cards and richer downstream renderers without requiring clients to recompute rankings.

### Route params
- `roomCode` — string, case-insensitive room identifier

### Success rules
- Returns `200` only when the room exists and is in `results` or `closed`
- Final rankings are already resolved server-side
- Payload includes stable timestamps and summary/share fields suitable for link previews, exports, or dedicated result screens

### Compact response example