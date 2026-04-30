# API Contract: `/api/v1` rooms launch slice

## Global rules
- All endpoints return JSON with envelope `{ ok, data? , error? }`.
- All routes live under `/api/v1`.
- `x-session-id` is accepted on all requests and echoed on responses. If absent, server generates one.
- `x-user-id` is optional auth context and is attached when available without being required.
- IDs are opaque strings.
- Timestamps are ISO-8601 UTC strings.

## POST `/api/v1/rooms`
Create a room.

### Response `201`