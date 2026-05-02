export interface CredentialsStorage {
  clientID: string;
  clientSecret: string;
  email: string;
  timestamp: string;
  notes: string;
}

const credentialsTemplate: CredentialsStorage = {
  clientID: 'SAVE_CLIENT_ID_HERE',
  clientSecret: 'SAVE_CLIENT_SECRET_HERE',
  email: 'your@email.com',
  timestamp: new Date().toISOString(),
  notes: 'Saved on first registration attempt',
};

export function loadCredentialsFromBrowser(): CredentialsStorage | null {
  try {
    const stored = localStorage.getItem('notification_credentials');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load:', error);
  }
  return null;
}

export function saveCredentialsToBrowser(credentials: CredentialsStorage): void {
  try {
    localStorage.setItem('notification_credentials', JSON.stringify(credentials));
    console.log('Saved');
  } catch (error) {
    console.error('Failed to save:', error);
  }
}

export function clearCredentials(): void {
  try {
    localStorage.removeItem('notification_credentials');
    console.log('Cleared');
  } catch (error) {
    console.error('Failed to clear:', error);
  }
}

export function exportCredentials(credentials: CredentialsStorage): string {
  return `
=== CREDENTIALS ===
Date: ${credentials.timestamp}
Email: ${credentials.email}

ClientID: ${credentials.clientID}
ClientSecret: ${credentials.clientSecret}

Notes: ${credentials.notes}

Keep secure!
`;
}
