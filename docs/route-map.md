# Route map

## Frontend app routes

- `/` — landing / room creation entry
- `/rooms/:roomId/options` — add and review options
- `/rooms/:roomId/play` — current matchup and selection flow
- `/rooms/:roomId/results` — result display

## Backend API routes

- `POST /api/rooms` — create room
- `POST /api/rooms/:roomId/options` — add options
- `POST /api/rooms/:roomId/matchups/generate` — generate next matchup
- `POST /api/rooms/:roomId/selections` — submit a selection
- `POST /api/rooms/:roomId/results/compute` — compute results
- `GET /api/rooms/:roomId/results` — fetch results