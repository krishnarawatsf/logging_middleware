import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import Logger from '../../logging middleware/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let logger: Logger | null = null;

function initializeLogger(): Logger {
  const newLogger = new Logger('backend', 'http://20.107.122.201/evaluation-service/logs', true);
  return newLogger;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!logger) {
    logger = initializeLogger();
  }

  logger
    .Log('debug', 'middleware', `${req.method} ${req.path}`)
    .catch((err) => console.error('Logging error:', err));

  next();
});

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!logger) {
    logger = initializeLogger();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    await logger.Log('warn', 'auth', 'Missing authorization token').catch(console.error);
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  await logger.Log('debug', 'auth', 'Token validated').catch(console.error);
  next();
}

app.get('/api/health', (req: Request, res: Response) => {
  logger?.Log('debug', 'utils', 'Health check').catch(console.error);
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/notifications', authMiddleware, async (req: Request, res: Response) => {
  if (!logger) {
    logger = initializeLogger();
  }

  try {
    const { title, message } = req.body;

    await logger.Log('info', 'middleware', 'Processing notification creation').catch(console.error);

    if (!title || !message) {
      await logger.Log('warn', 'config', 'Invalid notification data').catch(console.error);
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    await logger.Log('info', 'utils', `Notification created: ${notification.id}`).catch(console.error);

    res.status(201).json(notification);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logger.Log('error', 'middleware', `Failed to create notification: ${errorMsg}`).catch(console.error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/notifications', authMiddleware, async (req: Request, res: Response) => {
  if (!logger) {
    logger = initializeLogger();
  }

  try {
    await logger.Log('debug', 'middleware', 'Fetching notifications').catch(console.error);

    const notifications = [
      {
        id: 'notif-1',
        title: 'Welcome',
        message: 'Welcome to notification system',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ];

    await logger.Log('info', 'utils', `Retrieved ${notifications.length} notifications`).catch(console.error);

    res.json(notifications);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logger.Log('error', 'middleware', `Failed to fetch notifications: ${errorMsg}`).catch(console.error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/notifications/:id/read', authMiddleware, async (req: Request, res: Response) => {
  if (!logger) {
    logger = initializeLogger();
  }

  try {
    const { id } = req.params;

    await logger.Log('debug', 'middleware', `Marking notification as read: ${id}`).catch(console.error);

    const notification = {
      id,
      title: 'Sample',
      message: 'Sample notification',
      timestamp: new Date().toISOString(),
      read: true,
    };

    await logger.Log('info', 'utils', `Notification marked as read: ${id}`).catch(console.error);

    res.json(notification);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logger.Log('error', 'middleware', `Failed to mark notification as read: ${errorMsg}`).catch(console.error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger?.Log('error', 'middleware', `Unhandled error: ${err.message}`).catch(console.error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  if (!logger) {
    logger = initializeLogger();
  }

  logger.Log('info', 'config', `Server on port ${PORT}`).catch(console.error);
  console.log(`Running at http://localhost:${PORT}`);
});
