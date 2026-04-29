# Pika Backend

Minimal local Node/Express backend scaffold for the room-based Pika flow.

## Features

- Express app bootstrap
- Versioned API under `/api/v1`
- Health endpoint
- Create room
- Join room
- Get room state
- Submit vote
- Submit reaction
- Get results
- JSON request parsing
- Config/env loading with `dotenv`
- In-memory storage by default
- Optional file-backed persistence via environment variables
- Predictable JSON success and error responses

## Requirements

- Node.js 18+

## Setup

1. Copy the env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

Base URL: `http://localhost:3000`

## Environment Variables

| Name | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port for the local HTTP server |
| `NODE_ENV` | `development` | Runtime environment |
| `PERSIST_ROOMS` | `false` | Enables JSON-file persistence when `true` |
| `ROOMS_FILE` | `./data/rooms.json` | File path used for room persistence |

## API

All endpoints are versioned under `/api/v1`.

### Health

**GET** `/api/v1/health`
