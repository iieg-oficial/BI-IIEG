import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ConnectionCreate, ConnectionTestResult } from '../../../types/connections';
import { testConnection, createConnection } from '../services/connectionsService';
import { CONNECTIONS_LABELS } from '../consts';

interface ConnectionFormProps {
  onSubmit: (data: ConnectionCreate) => Promise<void>;
  onCancel: () => void;
}

export default function ConnectionForm({ onSubmit, onCancel }: ConnectionFormProps) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('5432');
  const [databaseName, setDatabaseName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setTestResult(null);

    if (!name || !host || !port || !databaseName || !username || !password) {
      setError(CONNECTIONS_LABELS.REQUIRED_FIELDS);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ name, host, port: Number(port), databaseName, username, password });
    } catch {
      setError('Error al guardar la conexión.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTest() {
    setError('');
    setTestResult(null);

    if (!name || !host || !port || !databaseName || !username || !password) {
      setError(CONNECTIONS_LABELS.REQUIRED_FIELDS);
      return;
    }

    setTesting(true);
    try {
      const created = await createConnection({
        name,
        host,
        port: Number(port),
        databaseName,
        username,
        password,
      });
      const result = await testConnection(created.id);
      setTestResult(result);
    } catch {
      setTestResult({ ok: false, message: CONNECTIONS_LABELS.TEST_FAILED });
    } finally {
      setTesting(false);
    }
  }

  return (
    <form className="connection-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <label className="form-label" htmlFor="conn-name">{CONNECTIONS_LABELS.NAME_LABEL}</label>
      <input
        id="conn-name"
        className="form-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="form-label" htmlFor="conn-host">{CONNECTIONS_LABELS.HOST_LABEL}</label>
      <input
        id="conn-host"
        className="form-input"
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />

      <div className="form-row">
        <div className="form-row-field">
          <label className="form-label" htmlFor="conn-port">{CONNECTIONS_LABELS.PORT_LABEL}</label>
          <input
            id="conn-port"
            className="form-input"
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
        </div>
        <div className="form-row-field form-row-field-grow">
          <label className="form-label" htmlFor="conn-db">{CONNECTIONS_LABELS.DATABASE_LABEL}</label>
          <input
            id="conn-db"
            className="form-input"
            type="text"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
          />
        </div>
      </div>

      <label className="form-label" htmlFor="conn-user">{CONNECTIONS_LABELS.USERNAME_LABEL}</label>
      <input
        id="conn-user"
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="form-label" htmlFor="conn-pass">{CONNECTIONS_LABELS.PASSWORD_LABEL}</label>
      <input
        id="conn-pass"
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {testResult && (
        <div className={`test-result ${testResult.ok ? 'success' : 'error'}`}>
          {testResult.ok ? CONNECTIONS_LABELS.TEST_SUCCESS : testResult.message}
        </div>
      )}

      <div className="connection-form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleTest}
          disabled={testing || submitting}
        >
          {testing ? CONNECTIONS_LABELS.TESTING : CONNECTIONS_LABELS.TEST_BUTTON}
        </button>
        <div className="connection-form-actions-right">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
            {CONNECTIONS_LABELS.CANCEL_BUTTON}
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting || testing}>
            {CONNECTIONS_LABELS.SAVE_BUTTON}
          </button>
        </div>
      </div>
    </form>
  );
}
