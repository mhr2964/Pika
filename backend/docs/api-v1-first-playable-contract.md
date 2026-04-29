# API v1 First Playable Contract

Base path: `/api/v1`  
Content type: `application/json; charset=utf-8`

This contract defines the Sprint 1 vertical slice only.

## Scope

Required endpoints:
- `POST /api/v1/rooms`
- `POST /api/v1/rooms/{roomId}/join`
- `GET /api/v1/rooms/{roomId}`
- `POST /api/v1/rooms/{roomId}/options`
- `POST /api/v1/rooms/{roomId}/start`
- `GET /api/v1/rooms/{roomId}/matchup`
- `POST /api/v1/rooms/{roomId}/votes`
- `GET /api/v1/rooms/{roomId}/results`

## Room state machine

Room `state` values are exact and closed:
- `waiting`
- `collecting_options`
- `active`
- `completed`

Valid progression:
- `waiting -> collecting_options -> active -> completed`

No other state names are valid in v1. Frontend should not infer hidden phases.

## Global response envelopes

### Success