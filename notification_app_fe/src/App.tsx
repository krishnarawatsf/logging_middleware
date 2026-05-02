import { useState, useEffect } from 'react';
import Logger from '../../logging middleware/logger';
import { register, authenticate, startLogger, getLogger, getRegistrationData, setLogger } from './services/authService';
import { createNotif, getNotifs } from './services/notificationService';
import './App.css';

function App() {
  const [page, setPage] = useState('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [github, setGithub] = useState('');
  const [status, setStatus] = useState('');
  const [notifs, setNotifs] = useState([]);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [logs, setLogs] = useState([]);
  const [logger, setLoggerLocal] = useState(null);


  useEffect(() => {
    const startLog = new Logger('frontend', 'http://20.107.122.201/evaluation-service/logs', true);
    setLoggerLocal(startLog);
    setLogger(startLog);
    startLog.Log('info', 'page', 'App started').catch(console.error);
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-49), msg]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus('Registering...');
    try {
      if (logger) await logger.Log('info', 'component', 'Register clicked');
      
      const result = await register(email, name, mobile, github, 'RA2311030010088', 'QkbpxH');
      setStatus('✓ Registered! ClientID: ' + result.clientID.substring(0, 10) + '...');
      if (logger) await logger.Log('info', 'state', 'Registration success');
      setTimeout(() => setPage('auth'), 1500);
    } catch (err) {
      setStatus('✗ Failed: ' + err);
      if (logger) await logger.Log('error', 'component', 'Register failed: ' + err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setStatus('Authenticating...');
    try {
      if (logger) await logger.Log('info', 'component', 'Auth started');
      
      const regData = getRegistrationData();
      if (!regData) throw new Error('No registration data');

      await authenticate(regData.email, regData.name, regData.rollno, regData.accessCode, regData.clientID, regData.clientSecret);
      
      const newLog = await startLogger();
      setLoggerLocal(newLog);
      
      setStatus('✓ Authenticated!');
      setTimeout(() => setPage('app'), 1500);
    } catch (err) {
      setStatus('✗ Auth failed: ' + err);
      if (logger) await logger.Log('error', 'component', 'Auth failed: ' + err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (logger) await logger.Log('info', 'page', 'Create notification');
      
      const notif = await createNotif(title, msg);
      setNotifs(prev => [notif, ...prev]);
      setTitle('');
      setMsg('');
      setStatus('✓ Created!');
      if (logger) await logger.Log('info', 'state', 'Notification added');
    } catch (err) {
      setStatus('✗ Failed: ' + err);
      if (logger) await logger.Log('error', 'page', 'Create failed: ' + err);
    }
  };

  const handleFetch = async () => {
    try {
      if (logger) await logger.Log('debug', 'api', 'Fetching list');
      
      const list = await getNotifs();
      setNotifs(list);
      setStatus('✓ Fetched ' + list.length);
      if (logger) await logger.Log('info', 'state', 'Notifs fetched');
    } catch (err) {
      setStatus('✗ Fetch failed: ' + err);
    }
  };

  useEffect(() => {
    if (logger) {
      const origLog = logger.Log.bind(logger);
      logger.Log = async (level, pkg, message) => {
        addLog(`[${level.toUpperCase()}] [${pkg}] ${message}`);
        return origLog(level, pkg, message);
      };
    }
  }, [logger]);

  return (
    <div className="app">
      <div className="header">
        <h1>Notification System</h1>
        <p>Frontend Track</p>
      </div>

      <div className="container">
        {status && <div className="status">{status}</div>}

        {page === 'register' && (
          <div className="card">
            <h2>Step 1: Register</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input type="text" value={github} onChange={e => setGithub(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Roll No</label>
                <input type="text" value="RA2311030010088" disabled />
              </div>
              <div className="form-group">
                <label>Access Code</label>
                <input type="text" value="QkbpxH" disabled />
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        )}

        {page === 'auth' && (
          <div className="card">
            <h2>Step 2: Authenticate</h2>
            <p>Click to get auth token</p>
            <button onClick={handleAuth}>Authenticate</button>
          </div>
        )}

        {page === 'app' && (
          <>
            <div className="card">
              <h2>Create Notification</h2>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <input type="text" value={msg} onChange={e => setMsg(e.target.value)} required />
                </div>
                <button type="submit">Create</button>
              </form>
              <button onClick={handleFetch} style={{ marginTop: '10px' }}>Fetch List</button>
            </div>

            <div className="card">
              <h2>Notifications ({notifs.length})</h2>
              {notifs.length === 0 ? (
                <p>No notifications</p>
              ) : (
                <div>
                  {notifs.map(n => (
                    <div key={n.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{new Date(n.timestamp).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h2>Activity Log</h2>
              <div className="log-viewer">
                {logs.length === 0 ? (
                  <div>No logs yet</div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="log-entry">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
