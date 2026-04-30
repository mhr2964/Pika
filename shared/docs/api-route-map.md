# Pika API route map

This route map is a platform-owned coordination artifact for the current vertical slice. Backend remains the authority for the final implementation and contract details.

## Planned routes

| Method | Path | Purpose | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | Basic service health check | Useful for app boot and deployment smoke checks |
| POST | `/api/session` | Start or restore a lightweight player session | May return session and user identifiers |
| GET | `/api/matchups` | Fetch current matchup batch for a group | Expected to drive head-to-head voting UI |
| POST | `/api/votes` | Submit a choice between two candidates | Should validate group and option identifiers |
| GET | `/api/results` | Return ranked results for a group | Expected to support results and sharing flow |

## Response alignment

The machine-readable draft contract lives at:

- `packages/contracts/pika-vertical-slice.json`

If implementation differs from this route map, backend should update the contract first and downstream teams should align to that published shape.