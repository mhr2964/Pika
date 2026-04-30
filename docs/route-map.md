# Route map

## Frontend routes
- `/`
- `/rooms/:roomId/options`
- `/rooms/:roomId/play`
- `/rooms/:roomId/results`

## Backend routes
- `POST /api/rooms`
- `POST /api/rooms/:roomId/options`
- `POST /api/rooms/:roomId/matchups/generate`
- `POST /api/rooms/:roomId/selections`
- `POST /api/rooms/:roomId/results/compute`
- `GET /api/rooms/:roomId/results`