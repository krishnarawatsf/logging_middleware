import Logger from '../../../logging middleware/logger';

const REGISTER_URL = 'http://20.207.122.201/evaluation-service/register';
const AUTH_URL = 'http://20.207.122.201/evaluation-service/auth';
const LOGS_URL = 'http://20.107.122.201/evaluation-service/logs';

let logger: Logger | null = null;
let token: string | null = null;
let regData: any = null;

export function setLogger(newLogger: Logger) {
  logger = newLogger;
}

export function getLogger() {
  return logger;
}

export function setToken(t: string) {
  token = t;
  if (logger) {
    logger.setToken(t);
  }
}

export function getToken() {
  return token;
}

export function getRegistrationData() {
  return regData;
}

export async function register(email: string, name: string, mobile: string, github: string, rollno: string, code: string) {
  try {
    if (logger) {
      await logger.Log('info', 'api', `Registering ${email}`);
    }

    const res = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, name, mobileNo: mobile, githubUsername: github, rollno, accessCode: code
      })
    });

    if (!res.ok) throw new Error(`Registration failed: ${res.status}`);

    const data = await res.json();
    regData = data;

    if (logger) {
      await logger.Log('info', 'api', `Registration OK for ${email}`);
    }

    return data;
  } catch (err) {
    if (logger) {
      await logger.Log('error', 'api', `Register error: ${err}`);
    }
    throw err;
  }
}

export async function authenticate(email: string, name: string, rollno: string, code: string, clientID: string, clientSecret: string) {
  try {
    if (logger) {
      await logger.Log('info', 'api', `Auth ${email}`);
    }

    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, name, rollNo: rollno, accessCode: code, clientID, clientSecret
      })
    });

    if (!res.ok) throw new Error(`Auth failed: ${res.status}`);

    const data = await res.json();
    setToken(data.token);

    if (logger) {
      await logger.Log('info', 'auth', 'Auth OK');
    }

    return data;
  } catch (err) {
    if (logger) {
      await logger.Log('error', 'auth', `Auth error: ${err}`);
    }
    throw err;
  }
}

export async function startLogger() {
  if (!token) throw new Error('No token');

  const newLogger = new Logger('frontend', LOGS_URL, true);
  newLogger.setToken(token);
  setLogger(newLogger);

  await newLogger.Log('info', 'config', 'Logger ready');

  return newLogger;
}
