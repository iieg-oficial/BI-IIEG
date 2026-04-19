import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboardBuilder } from './hooks';
import {
  AddBlockToolbar,
  ChartPickerModal,
  DashboardCanvas,
} from './components';
import { DASHBOARDS_LABELS } from './consts';
import { ROUTES } from '../../consts/routes';
import type { DashboardBlock } from '../../types/dashboards';

export default function DashboardBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const dashboardId = Number(id);
  const navigate = useNavigate();

  const {
    dashboard,
    loading,
    saving,
    error,
    isDirty,
    setName,
    setLayout,
    addChartBlock,
    addMarkdownBlock,
    updateBlock,
    removeBlock,
    save,
  } = useDashboardBuilder(dashboardId);

  const [isEditing, setIsEditing] = useState(true);
  const [showChartPicker, setShowChartPicker] = useState(false);

  if (Number.isNaN(dashboardId)) {
    return <div className="form-error">{DASHBOARDS_LABELS.CHART_UNAVAILABLE}</div>;
  }

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-builder">
        <div className="form-error">{error || DASHBOARDS_LABELS.CHART_UNAVAILABLE}</div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate(ROUTES.DASHBOARDS)}
        >
          {DASHBOARDS_LABELS.BACK_BUTTON}
        </button>
      </div>
    );
  }

  function handleLayoutChange(next: DashboardBlock[]) {
    setLayout(next);
  }

  function handlePickChart(chartId: number) {
    addChartBlock(chartId);
    setShowChartPicker(false);
  }

  return (
    <div className="dashboard-builder">
      <div className="dashboard-builder-toolbar">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate(ROUTES.DASHBOARDS)}
        >
          {DASHBOARDS_LABELS.BACK_BUTTON}
        </button>
        <input
          type="text"
          className="dashboard-builder-title-input"
          value={dashboard.name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
          aria-label={DASHBOARDS_LABELS.NAME_LABEL}
        />
        <div className="dashboard-builder-toolbar-actions">
          {isEditing && (
            <AddBlockToolbar
              onAddChart={() => setShowChartPicker(true)}
              onAddMarkdown={addMarkdownBlock}
            />
          )}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? DASHBOARDS_LABELS.MODE_VIEW : DASHBOARDS_LABELS.MODE_EDIT}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={saving || !isDirty}
          >
            {saving ? DASHBOARDS_LABELS.SAVING : DASHBOARDS_LABELS.SAVE_BUTTON}
          </button>
        </div>
      </div>
      {isDirty && (
        <div className="dashboard-builder-dirty">
          {DASHBOARDS_LABELS.UNSAVED_CHANGES}
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
      <DashboardCanvas
        layout={dashboard.layout}
        isEditing={isEditing}
        onLayoutChange={handleLayoutChange}
        onBlockChange={updateBlock}
        onRemoveBlock={removeBlock}
      />
      {showChartPicker && (
        <ChartPickerModal
          onPick={handlePickChart}
          onClose={() => setShowChartPicker(false)}
        />
      )}
    </div>
  );
}
