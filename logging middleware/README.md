# Logger Package

Simple logging for frontend and backend.

## How to Use

```javascript
import Logger from './logger';

const logger = new Logger('frontend', 'http://url/logs', true);

await logger.Log('info', 'api', 'Message here');
```

## Parameters

- Stack: `frontend` or `backend`
- Level: `debug`, `info`, `warn`, `error`, `fatal`
- Package: `api`, `auth`, `config`, `middleware`, `utils`, `component`, `state`, `hook`, `page`, `style`
- Message: Your message

## Features

- Validates all inputs
- Sends to logging service
- Local console logging
- Queues logs before token ready
- Works on frontend and backend
- Package is valid for the chosen stack
- Message is non-empty string

Invalid parameters throw an error (caught gracefully).

## Error Handling

Logging failures do not crash the application:
- Network errors are caught
- Invalid parameters return error response
- Errors logged to console for debugging
- Application continues execution
