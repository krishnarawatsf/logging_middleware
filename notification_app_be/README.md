# Backend Server

Express server for notifications.

## Run

```bash
npm install
npm run dev
```

Server at http://localhost:3000

## Endpoints

- GET /api/health - Check status
- POST /api/notifications - Create notification (need token)
- GET /api/notifications - Get all (need token)
- PATCH /api/notifications/:id/read - Mark read (need token)

## Auth

All endpoints except /health need Bearer token in Authorization header.

## Logging

All requests logged automatically using logger middleware.
