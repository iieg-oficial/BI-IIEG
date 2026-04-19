import type { Chart } from '../../../types/charts';
import { CHARTS_LABELS } from '../consts';

interface ChartCardProps {
  chart: Chart;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChartCard({ chart, onEdit, onDelete }: ChartCardProps) {
  const typeLabel = CHARTS_LABELS.CHART_TYPE_OPTIONS[chart.chartType];
  const truncatedSql =
    chart.sqlText.length > 80 ? chart.sqlText.slice(0, 80) + '…' : chart.sqlText;
  const dateStr = new Date(chart.createdAt).toLocaleDateString();

  function handleDelete() {
    if (window.confirm(CHARTS_LABELS.CONFIRM_DELETE)) {
      onDelete(chart.id);
    }
  }

  return (
    <div className="card chart-card">
      <span className="chart-card-name">{chart.name}</span>
      <span className="chart-card-type">{typeLabel}</span>
      <span className="chart-card-sql" title={chart.sqlText}>
        {truncatedSql}
      </span>
      <span className="chart-card-date">{dateStr}</span>
      <div className="chart-card-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onEdit(chart.id)}
        >
          {CHARTS_LABELS.EDIT_BUTTON}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
        >
          {CHARTS_LABELS.DELETE_BUTTON}
        </button>
      </div>
    </div>
  );
}
