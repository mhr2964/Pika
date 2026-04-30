# Pika environment conventions

## Example env files

Platform provides these starter files:

- `frontend/.env.example`
- `backend/.env.example`

## Frontend variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL used by the frontend to call the backend API | `http://localhost:3001` |
| `VITE_APP_ENV` | Simple environment label for local configuration | `development` |

## Backend variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `PORT` | Backend listen port | `3001` |
| `CORS_ORIGIN` | Allowed frontend origin for local development | `http://localhost:5173` |
| `NODE_ENV` | Node runtime environment | `development` |

## Guidance

- Keep secrets out of committed example files.
- Add new env variables to the relevant `.env.example` file in the same change that introduces them.
- If frontend and backend must coordinate on a URL or origin, update both example files and this document together.