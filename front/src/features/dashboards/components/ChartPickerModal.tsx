import { useEffect, useState } from 'react';
import { fetchCharts } from '../../charts/services/chartsService';
import type { Chart } from '../../../types/charts';
import { DASHBOARDS_LABELS } from '../consts';

interface ChartPickerModalProps {
  onPick: (chartId: number) => void;
  onClose: () => void;
}

export default function ChartPickerModal({ onPick, onClose }: ChartPickerModalProps) {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchCharts();
        if (!cancelled) {
          setCharts(data);
          setError('');
        }
      } catch {
        if (!cancelled) setError(DASHBOARDS_LABELS.CHART_ERROR);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h2>{DASHBOARDS_LABELS.CHART_PICKER_TITLE}</h2>
        {loading && <div className="spinner" />}
        {!loading && error && <div className="form-error">{error}</div>}
        {!loading && !error && charts.length === 0 && (
          <div className="empty-state">{DASHBOARDS_LABELS.CHART_PICKER_EMPTY}</div>
        )}
        {!loading && !error && charts.length > 0 && (
          <ul className="chart-picker-list">
            {charts.map((chart) => (
              <li key={chart.id} className="chart-picker-item">
                <div className="chart-picker-item-info">
                  <span className="chart-picker-item-name">{chart.name}</span>
                  <span className="chart-picker-item-type">{chart.chartType}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onPick(chart.id)}
                >
                  {DASHBOARDS_LABELS.SELECT_BUTTON}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="form-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            {DASHBOARDS_LABELS.CANCEL_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
}
