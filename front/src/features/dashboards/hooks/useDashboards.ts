import { useCallback, useEffect, useState } from 'react';
import type { Dashboard, DashboardCreate } from '../../../types/dashboards';
import {
  createDashboard,
  deleteDashboard,
  fetchDashboards,
} from '../services/dashboardsService';

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboards = useCallback(async () => {
    try {
      const data = await fetchDashboards();
      setDashboards(data);
      setError('');
    } catch {
      setError('Error al cargar los dashboards.');
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await loadDashboards();
      setLoading(false);
    }
    init();
  }, [loadDashboards]);

  const addDashboard = useCallback(async (data: DashboardCreate): Promise<Dashboard> => {
    const created = await createDashboard(data);
    setDashboards((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeDashboard = useCallback(async (id: number) => {
    await deleteDashboard(id);
    setDashboards((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return {
    dashboards,
    loading,
    error,
    loadDashboards,
    addDashboard,
    removeDashboard,
  };
}
