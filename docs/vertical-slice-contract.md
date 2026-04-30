# Pika vertical slice contract

Canonical machine-readable contract:
- `packages/contracts/pika-vertical-slice.json`

## Scope

Core flow:

1. Create room
2. Add options
3. Generate matchup
4. Submit selections
5. Compute results
6. Show results

## Auth model

Authentication is optional in v1.

Ownership fields are nullable across room/selection payloads:

- `ownerUserId: string | null`
- `ownerSessionId: string | null`

This supports:
- signed-in ownership
- anonymous session ownership
- local/demo flows with deferred auth integration

## Shared entities

- `Room`
- `Option`
- `Matchup`
- `Selection`
- `Result`

Backend is the contract authority for exact response behavior.
Frontend should conform to the JSON contract file.