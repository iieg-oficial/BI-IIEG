import { useState } from 'react';
import { useQueries } from './hooks';
import {
  ConnectionSelector,
  QueryEditor,
  QueryResults,
  SaveQueryModal,
  SavedQueriesList,
} from './components';
import { QUERIES_LABELS } from './consts';

export default function QueriesPage() {
  const {
    connections,
    savedQueries,
    selectedConnectionId,
    sqlText,
    result,
    loading,
    executing,
    saving,
    error,
    selectConnection,
    setSqlText,
    execute,
    saveQuery,
    loadSavedQuery,
    removeSavedQuery,
  } = useQueries();

  const [showSaveModal, setShowSaveModal] = useState(false);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  function handleSave(name: string, description: string) {
    saveQuery(name, description).then(() => setShowSaveModal(false));
  }

  const canSave = selectedConnectionId !== null && sqlText.trim().length > 0;

  return (
    <div className="queries-page">
      <div className="queries-main">
        <h1>{QUERIES_LABELS.PAGE_TITLE}</h1>

        {error && <div className="form-error">{error}</div>}

        <ConnectionSelector
          connections={connections}
          selectedId={selectedConnectionId}
          onSelect={selectConnection}
          disabled={executing}
        />

        {selectedConnectionId ? (
          <>
            <QueryEditor
              sqlText={sqlText}
              onSqlChange={setSqlText}
              onExecute={execute}
              executing={executing}
              disabled={!selectedConnectionId}
            />

            {canSave && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowSaveModal(true)}
                disabled={executing}
              >
                {QUERIES_LABELS.SAVE_BUTTON}
              </button>
            )}

            <QueryResults result={result} />
          </>
        ) : (
          <div className="empty-state">{QUERIES_LABELS.NO_CONNECTION_SELECTED}</div>
        )}
      </div>

      <div className="queries-sidebar">
        <h2>{QUERIES_LABELS.SAVED_QUERIES_TITLE}</h2>
        <SavedQueriesList
          savedQueries={savedQueries}
          connections={connections}
          onLoad={loadSavedQuery}
          onDelete={removeSavedQuery}
        />
      </div>

      {showSaveModal && (
        <SaveQueryModal
          onSave={handleSave}
          onCancel={() => setShowSaveModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
}
