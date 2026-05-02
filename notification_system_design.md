# System Design

## Folders

```
AFFORDMED/
├── logging middleware/   - Logger
├── notification_app_fe/  - React app
├── notification_app_be/  - Express server
└── notification_system_design.md
```

## Logger

Log function: `Log(level, package, message)`

**Levels:** debug, info, warn, error, fatal

**Packages:** api, auth, config, middleware, utils, component, state, hook, page, style

**Sent to:** http://20.107.122.201/evaluation-service/logs

## Register

POST http://20.207.122.201/evaluation-service/register

Send: email, name, mobileNo, githubUsername, rollno, accessCode

Get: clientID, clientSecret

## Auth

POST http://20.207.122.201/evaluation-service/auth

Send: email, name, rollNo, accessCode, clientID, clientSecret

Get: Bearer token

## How It Works

1. User registers → get clientID, clientSecret
2. User authenticates → get Bearer token
3. App sends logs with token
4. Logs go to logging service
5. User creates notification
6. Frontend logs (api, state, component)
7. Backend logs (middleware, config, utils)

## Tech

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Styling: CSS
- Logger: Custom package
