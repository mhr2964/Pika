# Vertical slice contract

Canonical machine-readable contract:
- `packages/contracts/pika-vertical-slice.json`

## Flow
1. Create room
2. Add options
3. Generate matchup
4. Submit selections
5. Compute results
6. Show results

## Ownership
Auth is optional in this phase.

Nullable ownership fields:
- `ownerUserId: string | null`
- `ownerSessionId: string | null`

## Ownership boundaries
- Backend owns canonical contract evolution
- Frontend conforms to published contract
- Platform owns shared path/document clarity