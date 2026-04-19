import { useState } from 'react';
import { useConnections } from './hooks';
import { ConnectionForm, ConnectionList, SchemaExplorer } from './components';
import { CONNECTIONS_LABELS } from './consts';

type View = 'list' | 'create' | 'explore';

export default function ConnectionsPage() {
  const { connections, loading, error, addConnection, removeConnection } = useConnections();
  const [view, setView] = useState<View>('list');
  const [exploringConnectionId, setExploringConnectionId] = useState<number | null>(null);

  function handleExplore(id: number) {
    setExploringConnectionId(id);
    setView('explore');
  }

  async function handleCreate(data: Parameters<typeof addConnection>[0]) {
    await addConnection(data);
    setView('list');
  }

  async function handleDelete(id: number) {
    await removeConnection(id);
  }

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="connections-page">
        <div className="form-error">{error}</div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="connections-page">
        <h1>{CONNECTIONS_LABELS.ADD_BUTTON}</h1>
        <ConnectionForm onSubmit={handleCreate} onCancel={() => setView('list')} />
      </div>
    );
  }

  if (view === 'explore' && exploringConnectionId !== null) {
    return (
      <div className="connections-page">
        <SchemaExplorer
          connectionId={exploringConnectionId}
          onBack={() => {
            setView('list');
            setExploringConnectionId(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h1>{CONNECTIONS_LABELS.PAGE_TITLE}</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setView('create')}
        >
          {CONNECTIONS_LABELS.ADD_BUTTON}
        </button>
      </div>
      <ConnectionList
        connections={connections}
        onExplore={handleExplore}
        onDelete={handleDelete}
      />
    </div>
  );
}
