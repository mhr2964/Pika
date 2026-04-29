# API v1 First Playable Contract

Base path: `/api/v1`  
Content type: `application/json`  
Response envelope:
- success:
  - `{ "ok": true, "data": ... }`
- error:
  - `{ "ok": false, "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": { ...optional } } }`

## Goals
This contract defines the first playable backend slice for room creation, player join, option collection, matchup voting, ranking progression, and results retrieval. All endpoints are predictable, room-code based where useful for sharing, and return stable JSON intended for a lightweight frontend.

## Canonical Room Phases
- `collecting`
- `ready`
- `voting`
- `ranking`
- `results`
- `closed`

## Core Entities

### Room