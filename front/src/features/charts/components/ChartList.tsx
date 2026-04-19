import type { Chart } from '../../../types/charts';
import { CHARTS_LABELS } from '../consts';
import ChartCard from './ChartCard';

interface ChartListProps {
  charts: Chart[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChartList({ charts, onEdit, onDelete }: ChartListProps) {
  if (charts.length === 0) {
    return <div className="empty-state">{CHARTS_LABELS.NO_CHARTS}</div>;
  }

  return (
    <div className="charts-grid">
      {charts.map((chart) => (
        <ChartCard
          key={chart.id}
          chart={chart}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
