import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Dashboard, DashboardBlock } from '../../../types/dashboards';
import { fetchDashboard, updateDashboard } from '../services/dashboardsService';
import {
  DEFAULT_CHART_BLOCK_SIZE,
  DEFAULT_MARKDOWN_BLOCK_SIZE,
  DASHBOARDS_LABELS,
  GRID_COLS,
} from '../consts';

export interface UseDashboardBuilderResult {
  dashboard: Dashboard | null;
  loading: boolean;
  saving: boolean;
  error: string;
  isDirty: boolean;
  setName: (name: string) => void;
  setDescription: (description: string | null) => void;
  setLayout: (layout: DashboardBlock[]) => void;
  addChartBlock: (chartId: number) => void;
  addMarkdownBlock: () => void;
  updateBlock: (id: string, patch: Partial<DashboardBlock>) => void;
  removeBlock: (id: string) => void;
  save: () => Promise<void>;
}

function computeNextY(layout: DashboardBlock[]): number {
  if (layout.length === 0) return 0;
  return Math.max(...layout.map((b) => b.y + b.h));
}

export function useDashboardBuilder(dashboardId: number): UseDashboardBuilderResult {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDashboard(dashboardId);
        if (!cancelled) {
          setDashboard(data);
          setIsDirty(false);
          setError('');
        }
      } catch {
        if (!cancelled) setError('Error al cargar el dashboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [dashboardId]);

  const setName = useCallback((name: string) => {
    setDashboard((prev) => (prev ? { ...prev, name } : prev));
    setIsDirty(true);
  }, []);

  const setDescription = useCallback((description: string | null) => {
    setDashboard((prev) => (prev ? { ...prev, description } : prev));
    setIsDirty(true);
  }, []);

  const setLayout = useCallback((layout: DashboardBlock[]) => {
    setDashboard((prev) => (prev ? { ...prev, layout } : prev));
    setIsDirty(true);
  }, []);

  const addChartBlock = useCallback((chartId: number) => {
    setDashboard((prev) => {
      if (!prev) return prev;
      const newBlock: DashboardBlock = {
        id: uuidv4(),
        type: 'chart',
        x: 0,
        y: computeNextY(prev.layout),
        w: DEFAULT_CHART_BLOCK_SIZE.w,
        h: DEFAULT_CHART_BLOCK_SIZE.h,
        chartId,
        markdown: null,
      };
      return { ...prev, layout: [...prev.layout, newBlock] };
    });
    setIsDirty(true);
  }, []);

  const addMarkdownBlock = useCallback(() => {
    setDashboard((prev) => {
      if (!prev) return prev;
      const w = Math.min(DEFAULT_MARKDOWN_BLOCK_SIZE.w, GRID_COLS);
      const newBlock: DashboardBlock = {
        id: uuidv4(),
        type: 'markdown',
        x: 0,
        y: computeNextY(prev.layout),
        w,
        h: DEFAULT_MARKDOWN_BLOCK_SIZE.h,
        chartId: null,
        markdown: DASHBOARDS_LABELS.MARKDOWN_PLACEHOLDER_CONTENT,
      };
      return { ...prev, layout: [...prev.layout, newBlock] };
    });
    setIsDirty(true);
  }, []);

  const updateBlock = useCallback((id: string, patch: Partial<DashboardBlock>) => {
    setDashboard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        layout: prev.layout.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      };
    });
    setIsDirty(true);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setDashboard((prev) => {
      if (!prev) return prev;
      return { ...prev, layout: prev.layout.filter((b) => b.id !== id) };
    });
    setIsDirty(true);
  }, []);

  const save = useCallback(async () => {
    if (!dashboard) return;
    setSaving(true);
    try {
      const updated = await updateDashboard(dashboard.id, {
        name: dashboard.name,
        description: dashboard.description,
        layout: dashboard.layout,
      });
      setDashboard(updated);
      setIsDirty(false);
      setError('');
    } catch {
      setError('Error al guardar el dashboard.');
    } finally {
      setSaving(false);
    }
  }, [dashboard]);

  return {
    dashboard,
    loading,
    saving,
    error,
    isDirty,
    setName,
    setDescription,
    setLayout,
    addChartBlock,
    addMarkdownBlock,
    updateBlock,
    removeBlock,
    save,
  };
}
