import { useState, useCallback, useMemo } from 'react';
import type { Chart, ChartCreate, ChartType, ChartUpdate } from '../../../types/charts';
import type { QueryExecuteResult, SavedQuery } from '../../../types/queries';
import { executeQuery } from '../../queries/services/queriesService';
import { createChart, updateChart } from '../services/chartsService';

export function useChartBuilder() {
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [selectedSavedQueryId, setSelectedSavedQueryId] = useState<number | null>(null);
  const [sqlText, setSqlText] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xColumn, setXColumn] = useState('');
  const [yColumns, setYColumns] = useState<string[]>([]);
  const [chartTitle, setChartTitle] = useState('');
  const [chartName, setChartName] = useState('');
  const [previewData, setPreviewData] = useState<QueryExecuteResult | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingChartId, setEditingChartId] = useState<number | null>(null);

  const columns = useMemo(() => previewData?.columns ?? [], [previewData]);

  const selectConnection = useCallback((id: number) => {
    setSelectedConnectionId(id);
    setPreviewData(null);
    setXColumn('');
    setYColumns([]);
    setError('');
  }, []);

  const selectSavedQuery = useCallback((query: SavedQuery) => {
    setSelectedSavedQueryId(query.id);
    setSelectedConnectionId(query.connectionId);
    setSqlText(query.sqlText);
    setPreviewData(null);
    setXColumn('');
    setYColumns([]);
    setError('');
  }, []);

  const preview = useCallback(async () => {
    if (!selectedConnectionId || !sqlText.trim()) return;
    setPreviewing(true);
    setError('');
    setPreviewData(null);
    try {
      const data = await executeQuery({
        connectionId: selectedConnectionId,
        sqlText,
      });
      setPreviewData(data);
      setXColumn('');
      setYColumns([]);
    } catch {
      setError('Error al ejecutar la consulta.');
    } finally {
      setPreviewing(false);
    }
  }, [selectedConnectionId, sqlText]);

  const save = useCallback(async (): Promise<boolean> => {
    if (!selectedConnectionId || !chartName.trim() || !sqlText.trim() || !xColumn) {
      setError('Completa todos los campos obligatorios.');
      return false;
    }
    setSaving(true);
    setError('');
    try {
      if (editingChartId !== null) {
        const data: ChartUpdate = {
          name: chartName,
          sqlText,
          chartType,
          config: { xColumn, yColumns, title: chartTitle || undefined },
          savedQueryId: selectedSavedQueryId,
        };
        await updateChart(editingChartId, data);
      } else {
        const data: ChartCreate = {
          name: chartName,
          connectionId: selectedConnectionId,
          savedQueryId: selectedSavedQueryId,
          sqlText,
          chartType,
          config: { xColumn, yColumns, title: chartTitle || undefined },
        };
        await createChart(data);
      }
      return true;
    } catch {
      setError('Error al guardar la gráfica.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [selectedConnectionId, chartName, sqlText, chartType, xColumn, yColumns, chartTitle, selectedSavedQueryId, editingChartId]);

  const initFromChart = useCallback((chart: Chart) => {
    setEditingChartId(chart.id);
    setSelectedConnectionId(chart.connectionId);
    setSelectedSavedQueryId(chart.savedQueryId);
    setSqlText(chart.sqlText);
    setChartType(chart.chartType);
    setXColumn(chart.config.xColumn);
    setYColumns(chart.config.yColumns);
    setChartTitle(chart.config.title ?? '');
    setChartName(chart.name);
    setPreviewData(null);
    setError('');
  }, []);

  return {
    selectedConnectionId,
    selectedSavedQueryId,
    sqlText,
    chartType,
    xColumn,
    yColumns,
    chartTitle,
    chartName,
    previewData,
    previewing,
    saving,
    error,
    columns,
    selectConnection,
    selectSavedQuery,
    setSqlText,
    setChartType,
    setXColumn,
    setYColumns,
    setChartTitle,
    setChartName,
    preview,
    save,
    initFromChart,
  };
}
