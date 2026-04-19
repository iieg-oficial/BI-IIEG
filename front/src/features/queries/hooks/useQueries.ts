import { useState, useCallback, useEffect } from 'react';
import type { Connection } from '../../../types/connections';
import type { QueryExecuteResult, SavedQuery } from '../../../types/queries';
import { fetchConnections } from '../../connections/services/connectionsService';
import {
  executeQuery as executeQueryService,
  fetchSavedQueries,
  createSavedQuery,
  deleteSavedQuery as deleteSavedQueryService,
} from '../services/queriesService';

export function useQueries() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [sqlText, setSqlText] = useState('');
  const [result, setResult] = useState<QueryExecuteResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadConnections = useCallback(async () => {
    try {
      const data = await fetchConnections();
      setConnections(data);
    } catch {
      setError('Error al cargar las conexiones.');
    }
  }, []);

  const loadSavedQueries = useCallback(async () => {
    try {
      const data = await fetchSavedQueries();
      setSavedQueries(data);
    } catch {
      setError('Error al cargar las consultas guardadas.');
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadConnections(), loadSavedQueries()]);
      setLoading(false);
    }
    init();
  }, [loadConnections, loadSavedQueries]);

  const selectConnection = useCallback((id: number) => {
    setSelectedConnectionId(id);
    setError('');
  }, []);

  const execute = useCallback(async () => {
    if (!selectedConnectionId || !sqlText.trim()) return;
    setExecuting(true);
    setError('');
    setResult(null);
    try {
      const data = await executeQueryService({
        connectionId: selectedConnectionId,
        sqlText,
      });
      setResult(data);
    } catch {
      setError('Error al ejecutar la consulta.');
    } finally {
      setExecuting(false);
    }
  }, [selectedConnectionId, sqlText]);

  const saveQuery = useCallback(
    async (name: string, description: string) => {
      if (!selectedConnectionId || !sqlText.trim()) return;
      setSaving(true);
      setError('');
      try {
        const saved = await createSavedQuery({
          connectionId: selectedConnectionId,
          name,
          sqlText,
          description,
        });
        setSavedQueries((prev) => [...prev, saved]);
      } catch {
        setError('Error al guardar la consulta.');
      } finally {
        setSaving(false);
      }
    },
    [selectedConnectionId, sqlText],
  );

  const loadSavedQuery = useCallback((query: SavedQuery) => {
    setSelectedConnectionId(query.connectionId);
    setSqlText(query.sqlText);
    setResult(null);
    setError('');
  }, []);

  const removeSavedQuery = useCallback(async (id: number) => {
    try {
      await deleteSavedQueryService(id);
      setSavedQueries((prev) => prev.filter((q) => q.id !== id));
    } catch {
      setError('Error al eliminar la consulta.');
    }
  }, []);

  return {
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
  };
}
