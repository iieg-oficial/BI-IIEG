import { useState, useCallback, useEffect } from 'react';
import type { Chart, ChartCreate, ChartUpdate } from '../../../types/charts';
import type { Connection } from '../../../types/connections';
import type { SavedQuery } from '../../../types/queries';
import { fetchConnections } from '../../connections/services/connectionsService';
import { fetchSavedQueries } from '../../queries/services/queriesService';
import {
  fetchCharts,
  createChart,
  updateChart,
  deleteChart,
} from '../services/chartsService';

export function useCharts() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCharts = useCallback(async () => {
    try {
      const data = await fetchCharts();
      setCharts(data);
    } catch {
      setError('Error al cargar las gráficas.');
    }
  }, []);

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
      await Promise.all([loadCharts(), loadConnections(), loadSavedQueries()]);
      setLoading(false);
    }
    init();
  }, [loadCharts, loadConnections, loadSavedQueries]);

  const addChart = useCallback(async (data: ChartCreate) => {
    const created = await createChart(data);
    setCharts((prev) => [...prev, created]);
  }, []);

  const editChart = useCallback(async (id: number, data: ChartUpdate) => {
    const updated = await updateChart(id, data);
    setCharts((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const removeChart = useCallback(async (id: number) => {
    await deleteChart(id);
    setCharts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    charts,
    connections,
    savedQueries,
    loading,
    error,
    loadCharts,
    addChart,
    editChart,
    removeChart,
  };
}
