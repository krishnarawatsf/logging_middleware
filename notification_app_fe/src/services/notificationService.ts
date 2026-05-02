import { getLogger, getToken } from './authService';

const API = 'http://localhost:3000/api';

export async function createNotif(title: string, msg: string) {
  const logger = getLogger();
  const token = getToken();

  if (!token) throw new Error('No token');

  try {
    if (logger) {
      await logger.Log('info', 'api', `Create: ${title}`);
    }

    const res = await fetch(`${API}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, message: msg }),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const data = await res.json();

    if (logger) {
      await logger.Log('info', 'api', `Created: ${data.id}`);
    }

    return data;
  } catch (err) {
    if (logger) {
      await logger.Log('error', 'api', `Create failed: ${err}`);
    }
    throw err;
  }
}

export async function getNotifs() {
  const logger = getLogger();
  const token = getToken();

  if (!token) throw new Error('No token');

  try {
    if (logger) {
      await logger.Log('debug', 'api', 'Fetching...');
    }

    const res = await fetch(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const data = await res.json();

    if (logger) {
      await logger.Log('debug', 'api', `Got ${data.length}`);
    }

    return data;
  } catch (err) {
    if (logger) {
      await logger.Log('error', 'api', `Fetch failed: ${err}`);
    }
    throw err;
  }
}

export async function markRead(id: string) {
  const logger = getLogger();
  const token = getToken();

  if (!token) throw new Error('No token');

  try {
    if (logger) {
      await logger.Log('debug', 'api', `Mark read: ${id}`);
    }

    const res = await fetch(`${API}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    return await res.json();
  } catch (err) {
    if (logger) {
      await logger.Log('error', 'api', `Mark failed: ${err}`);
    }
    throw err;
  }
}
