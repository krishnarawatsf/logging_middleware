# logging_middleware
Lightweight TypeScript logging & notification middleware for Node services with a Vite React admin UI.

## One-line
Structured logging middleware with pluggable notification hooks (Slack, email, webhooks).

## Problem
Observability gaps and noisy alerting make it hard for product teams to act on runtime issues. This project centralizes structured logs and provides actionable notification hooks.

## Features
- Pluggable middleware for Express/Koa
- Structured JSON logs (severity, request-id, user)
- Notification adapters: Slack, email, webhook
- Frontend admin (React + Vite) to view alerts and metadata
- Docker Compose demo for local testing

## Quickstart
```bash
# server
cd server
npm install
npm run dev

# frontend
cd ../frontend
npm install
npm run dev
```

Or run full demo with Docker Compose:
```bash
docker compose up -d
```

## Usage
Example Express integration:
```ts
import { loggingMiddleware } from 'logging-middleware'
app.use(loggingMiddleware({ notify: true }))
```

## Architecture
- `server/` — Node service exposing API and middleware
- `frontend/` — Vite React admin UI
- `notify/` — adapters for Slack, Email, Webhook

## Tests & CI
- Run unit tests: `npm test`
- CI: GitHub Actions `lint`, `test`, `build` (suggested)

## Roadmap
- Add E2E tests and Docker Compose smoke test
- Add sample metrics and Grafana dashboard
- Publish npm package for middleware

## Contributing
1. Fork the repo
2. Create feature branch
3. Run tests and open a PR

## License
MIT
