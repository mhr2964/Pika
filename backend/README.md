# Pika Backend

Minimal local Node/Express backend scaffold for the Pika flow.

## Features

- Express app bootstrap
- Versioned API under `/api/v1`
- Health endpoint
- Pika item create/list/update-status endpoints
- JSON request parsing
- Config/env loading with `dotenv`
- In-memory storage by default
- Optional file-backed persistence

## Requirements

- Node.js 18+

## Setup

1. Copy env file:
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

Server defaults to `http://localhost:3000`.

## API

### Health

- `GET /api/v1/health`

Response: