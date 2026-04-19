import { useEffect } from 'react';
import type { Chart, ChartType } from '../../../types/charts';
import type { Connection } from '../../../types/connections';
import type { SavedQuery } from '../../../types/queries';
import { useChartBuilder } from '../hooks';
import { CHARTS_LABELS } from '../consts';
import ChartPreview from './ChartPreview';

interface ChartBuilderProps {
  connections: Connection[];
  savedQueries: SavedQuery[];
  onSave: () => void;
  onCancel: () => void;
  editChart?: Chart;
}

const CHART_TYPES: ChartType[] = ['bar', 'line', 'pie', 'scatter', 'histogram'];

export default function ChartBuilder({
  connections,
  savedQueries,
  onSave,
  onCancel,
  editChart,
}: ChartBuilderProps) {
  const {
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
  } = useChartBuilder();

  useEffect(() => {
    if (editChart) {
      initFromChart(editChart);
    }
  }, [editChart, initFromChart]);

  async function handleSave() {
    const success = await save();
    if (success) {
      onSave();
    }
  }

  function handleYColumnToggle(col: string) {
    setYColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
    );
  }

  const filteredQueries = savedQueries.filter(
    (q) => q.connectionId === selectedConnectionId,
  );

  const canPreview = selectedConnectionId !== null && sqlText.trim().length > 0;
  const canSave =
    chartName.trim().length > 0 &&
    sqlText.trim().length > 0 &&
    xColumn.length > 0 &&
    yColumns.length > 0;

  const showChartConfig = previewData !== null && columns.length > 0;
  const showPreview =
    showChartConfig && xColumn.length > 0 && yColumns.length > 0;

  return (
    <div className="chart-builder">
      {error && <div className="form-error">{error}</div>}

      <div className="chart-builder-section">
        <h3>{CHARTS_LABELS.CHART_NAME_LABEL}</h3>
        <div className="chart-builder-field">
          <input
            type="text"
            className="form-input"
            placeholder={CHARTS_LABELS.CHART_NAME_PLACEHOLDER}
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
          />
        </div>
      </div>

      <div className="chart-builder-section">
        <h3>{CHARTS_LABELS.CONNECTION_LABEL}</h3>
        <div className="chart-builder-row">
          <div className="chart-builder-field">
            <select
              className="form-input"
              value={selectedConnectionId ?? ''}
              onChange={(e) => selectConnection(Number(e.target.value))}
            >
              <option value="">{CHARTS_LABELS.CONNECTION_PLACEHOLDER}</option>
              {connections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="chart-builder-field">
            <select
              className="form-input"
              value={selectedSavedQueryId ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value);
                const query = savedQueries.find((q) => q.id === id);
                if (query) selectSavedQuery(query);
              }}
              disabled={!selectedConnectionId}
            >
              <option value="">{CHARTS_LABELS.SAVED_QUERY_PLACEHOLDER}</option>
              {filteredQueries.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="chart-builder-section">
        <h3>{CHARTS_LABELS.SQL_LABEL}</h3>
        <textarea
          className="form-input"
          rows={4}
          placeholder={CHARTS_LABELS.SQL_PLACEHOLDER}
          value={sqlText}
          onChange={(e) => setSqlText(e.target.value)}
        />
        <div className="chart-builder-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={preview}
            disabled={!canPreview || previewing}
          >
            {previewing ? CHARTS_LABELS.PREVIEWING : CHARTS_LABELS.PREVIEW_BUTTON}
          </button>
        </div>
      </div>

      {showChartConfig && (
        <div className="chart-builder-section">
          <h3>{CHARTS_LABELS.CHART_TYPE_LABEL}</h3>
          <div className="chart-builder-row">
            <div className="chart-builder-field">
              <select
                className="form-input"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as ChartType)}
              >
                {CHART_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {CHARTS_LABELS.CHART_TYPE_OPTIONS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="chart-builder-row">
            <div className="chart-builder-field">
              <label className="form-label">{CHARTS_LABELS.X_COLUMN_LABEL}</label>
              <select
                className="form-input"
                value={xColumn}
                onChange={(e) => setXColumn(e.target.value)}
              >
                <option value="">{CHARTS_LABELS.X_COLUMN_PLACEHOLDER}</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="chart-builder-field">
            <label className="form-label">{CHARTS_LABELS.Y_COLUMNS_LABEL}</label>
            {columns.length === 0 ? (
              <span className="text-secondary">{CHARTS_LABELS.Y_COLUMNS_PLACEHOLDER}</span>
            ) : (
              <div className="y-columns-group">
                {columns.map((col) => (
                  <label key={col} className="y-column-checkbox">
                    <input
                      type="checkbox"
                      checked={yColumns.includes(col)}
                      onChange={() => handleYColumnToggle(col)}
                    />
                    {col}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="chart-builder-field">
            <label className="form-label">{CHARTS_LABELS.TITLE_LABEL}</label>
            <input
              type="text"
              className="form-input"
              placeholder={CHARTS_LABELS.TITLE_PLACEHOLDER}
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
            />
          </div>
        </div>
      )}

      {showPreview && previewData && (
        <ChartPreview
          data={previewData}
          chartType={chartType}
          xColumn={xColumn}
          yColumns={yColumns}
          title={chartTitle}
        />
      )}

      <div className="chart-builder-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? CHARTS_LABELS.SAVING : CHARTS_LABELS.SAVE_BUTTON}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={saving}
        >
          {CHARTS_LABELS.CANCEL_BUTTON}
        </button>
      </div>
    </div>
  );
}
