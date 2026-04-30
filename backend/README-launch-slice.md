# Backend Launch Slice

## Endpoints
- `POST /api/v1/rooms`
- `GET /api/v1/rooms/:id`
- `POST /api/v1/rooms/:id/options`
- `POST /api/v1/rooms/:id/matchups/start`
- `POST /api/v1/rooms/:id/matchups/:matchupId/choose`
- `GET /api/v1/rooms/:id/results`

## Session behavior
- Send `x-session-id` to preserve guest identity across requests.
- If omitted, backend creates and returns one.
- Optional `x-user-id` can be forwarded from future auth middleware.

## Storage
- Default store is in-memory.
- Set `PERSIST_ROOMS=true` to persist to JSON.
- Optional `ROOMS_FILE` sets file path, default `./data/rooms-v1.json`.

## Smoke flow
1. Create room.
2. Add 2+ options.
3. Start matchups.
4. Repeatedly choose winner for returned `next_matchup`.
5. Fetch results.

## Follow-up work
- Add auth-backed actor resolution.
- Add participant model and ownership checks.
- Add restart/archive/TTL behavior.
- Add automated smoke script coverage for the new endpoints.