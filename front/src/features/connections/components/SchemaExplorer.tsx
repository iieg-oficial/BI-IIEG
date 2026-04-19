import { useState, useEffect, useCallback } from 'react';
import type { SchemaInfo, TableInfo, ColumnInfo } from '../../../types/connections';
import { fetchSchemas, fetchTables, fetchColumns } from '../services/connectionsService';
import { CONNECTIONS_LABELS } from '../consts';

interface SchemaExplorerProps {
  connectionId: number;
  onBack: () => void;
}

type ExplorerLevel = 'schemas' | 'tables' | 'columns';

export default function SchemaExplorer({ connectionId, onBack }: SchemaExplorerProps) {
  const [level, setLevel] = useState<ExplorerLevel>('schemas');
  const [schemas, setSchemas] = useState<SchemaInfo[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSchemas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSchemas(connectionId);
      setSchemas(data);
    } catch {
      setError('Error al cargar los esquemas.');
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  useEffect(() => {
    loadSchemas();
  }, [loadSchemas]);

  async function handleSelectSchema(schemaName: string) {
    setSelectedSchema(schemaName);
    setLevel('tables');
    setLoading(true);
    setError('');
    try {
      const data = await fetchTables(connectionId, schemaName);
      setTables(data);
    } catch {
      setError('Error al cargar las tablas.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectTable(tableName: string) {
    setSelectedTable(tableName);
    setLevel('columns');
    setLoading(true);
    setError('');
    try {
      const data = await fetchColumns(connectionId, selectedSchema, tableName);
      setColumns(data);
    } catch {
      setError('Error al cargar las columnas.');
    } finally {
      setLoading(false);
    }
  }

  function handleBackToSchemas() {
    setLevel('schemas');
    setSelectedSchema('');
    setTables([]);
  }

  function handleBackToTables() {
    setLevel('tables');
    setSelectedTable('');
    setColumns([]);
  }

  return (
    <div className="schema-explorer">
      <div className="breadcrumb">
        <button type="button" className="btn btn-outline btn-sm" onClick={onBack}>
          {CONNECTIONS_LABELS.BACK_BUTTON}
        </button>
        {level !== 'schemas' && (
          <>
            <span className="breadcrumb-separator">/</span>
            <button
              type="button"
              className="breadcrumb-link"
              onClick={handleBackToSchemas}
            >
              {CONNECTIONS_LABELS.SCHEMAS_TITLE}
            </button>
          </>
        )}
        {level === 'columns' && (
          <>
            <span className="breadcrumb-separator">/</span>
            <button
              type="button"
              className="breadcrumb-link"
              onClick={handleBackToTables}
            >
              {selectedSchema}
            </button>
          </>
        )}
        {level === 'columns' && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{selectedTable}</span>
          </>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading && (
        <div className="page-center">
          <div className="spinner" />
        </div>
      )}

      {!loading && level === 'schemas' && (
        <>
          <h3>{CONNECTIONS_LABELS.SCHEMAS_TITLE}</h3>
          {schemas.length === 0 ? (
            <div className="empty-state">No se encontraron esquemas.</div>
          ) : (
            <ul className="schema-list">
              {schemas.map((s) => (
                <li key={s.schemaName}>
                  <button
                    type="button"
                    className="schema-item"
                    onClick={() => handleSelectSchema(s.schemaName)}
                  >
                    {s.schemaName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!loading && level === 'tables' && (
        <>
          <h3>{CONNECTIONS_LABELS.TABLES_TITLE} — {selectedSchema}</h3>
          {tables.length === 0 ? (
            <div className="empty-state">No se encontraron tablas.</div>
          ) : (
            <ul className="table-list">
              {tables.map((t) => (
                <li key={t.tableName}>
                  <button
                    type="button"
                    className="table-item"
                    onClick={() => handleSelectTable(t.tableName)}
                  >
                    {t.tableName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {!loading && level === 'columns' && (
        <>
          <h3>{CONNECTIONS_LABELS.COLUMNS_TITLE} — {selectedTable}</h3>
          {columns.length === 0 ? (
            <div className="empty-state">No se encontraron columnas.</div>
          ) : (
            <table className="columns-table">
              <thead>
                <tr>
                  <th>{CONNECTIONS_LABELS.COLUMN_NAME}</th>
                  <th>{CONNECTIONS_LABELS.DATA_TYPE}</th>
                  <th>{CONNECTIONS_LABELS.NULLABLE}</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((c) => (
                  <tr key={c.columnName}>
                    <td>{c.columnName}</td>
                    <td>{c.dataType}</td>
                    <td>{c.isNullable ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
