import { useState, useCallback, useEffect } from 'react';
import type { Connection, ConnectionCreate } from '../../../types/connections';
import {
  fetchConnections,
  createConnection,
  deleteConnection,
} from '../services/connectionsService';

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadConnections = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchConnections();
      setConnections(data);
    } catch {
      setError('Error al cargar las conexiones.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addConnection = useCallback(async (data: ConnectionCreate) => {
    const created = await createConnection(data);
    setConnections((prev) => [...prev, created]);
  }, []);

  const removeConnection = useCallback(async (id: number) => {
    await deleteConnection(id);
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  return { connections, loading, error, loadConnections, addConnection, removeConnection };
}
