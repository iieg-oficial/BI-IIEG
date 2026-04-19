import type { Dashboard } from '../../../types/dashboards';
import { DASHBOARDS_LABELS } from '../consts';
import DashboardCard from './DashboardCard';

interface DashboardListProps {
  dashboards: Dashboard[];
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function DashboardList({ dashboards, onOpen, onDelete }: DashboardListProps) {
  if (dashboards.length === 0) {
    return <div className="empty-state">{DASHBOARDS_LABELS.NO_DASHBOARDS}</div>;
  }

  return (
    <div className="dashboards-grid">
      {dashboards.map((d) => (
        <DashboardCard key={d.id} dashboard={d} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  );
}
