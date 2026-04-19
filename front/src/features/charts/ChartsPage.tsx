import { useState } from 'react';
import { useCharts } from './hooks';
import { ChartList, ChartBuilder } from './components';
import { CHARTS_LABELS } from './consts';

type View = 'list' | 'create' | 'edit';

export default function ChartsPage() {
  const {
    charts,
    connections,
    savedQueries,
    loading,
    error,
    loadCharts,
    removeChart,
  } = useCharts();

  const [view, setView] = useState<View>('list');
  const [editingChartId, setEditingChartId] = useState<number | null>(null);

  function handleEdit(id: number) {
    setEditingChartId(id);
    setView('edit');
  }

  async function handleDelete(id: number) {
    await removeChart(id);
  }

  function handleSaved() {
    setView('list');
    setEditingChartId(null);
    loadCharts();
  }

  function handleCancel() {
    setView('list');
    setEditingChartId(null);
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
      <div className="charts-page">
        <div className="form-error">{error}</div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="charts-page">
        <h1>{CHARTS_LABELS.CREATE_BUTTON}</h1>
        <ChartBuilder
          connections={connections}
          savedQueries={savedQueries}
          onSave={handleSaved}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (view === 'edit' && editingChartId !== null) {
    const chart = charts.find((c) => c.id === editingChartId);
    return (
      <div className="charts-page">
        <h1>{CHARTS_LABELS.EDIT_BUTTON}</h1>
        <ChartBuilder
          connections={connections}
          savedQueries={savedQueries}
          onSave={handleSaved}
          onCancel={handleCancel}
          editChart={chart}
        />
      </div>
    );
  }

  return (
    <div className="charts-page">
      <div className="charts-header">
        <h1>{CHARTS_LABELS.PAGE_TITLE}</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setView('create')}
        >
          {CHARTS_LABELS.CREATE_BUTTON}
        </button>
      </div>
      <ChartList charts={charts} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
