import { useState } from 'react';
import type { Connection } from '../../../types/connections';
import { CONNECTIONS_LABELS } from '../consts';

interface ConnectionListProps {
  connections: Connection[];
  onExplore: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ConnectionList({ connections, onExplore, onDelete }: ConnectionListProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);

  function handleDelete(id: number) {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  }

  if (connections.length === 0) {
    return <div className="empty-state">{CONNECTIONS_LABELS.NO_CONNECTIONS}</div>;
  }

  return (
    <div className="connections-grid">
      {connections.map((conn) => (
        <div key={conn.id} className="connection-card card">
          <div className="connection-card-info">
            <h3 className="connection-card-name">{conn.name}</h3>
            <p className="connection-card-detail">
              {conn.host}:{conn.port}
            </p>
            <p className="connection-card-detail">{conn.databaseName}</p>
            <p className="connection-card-detail">{conn.username}</p>
          </div>
          <div className="connection-card-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onExplore(conn.id)}
            >
              {CONNECTIONS_LABELS.EXPLORE_BUTTON}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${confirmId === conn.id ? 'btn-danger' : 'btn-outline'}`}
              onClick={() => handleDelete(conn.id)}
            >
              {confirmId === conn.id
                ? CONNECTIONS_LABELS.CONFIRM_DELETE
                : CONNECTIONS_LABELS.DELETE_BUTTON}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
