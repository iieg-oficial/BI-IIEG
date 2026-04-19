import type { Dashboard } from '../../../types/dashboards';
import { DASHBOARDS_LABELS } from '../consts';

interface DashboardCardProps {
  dashboard: Dashboard;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function DashboardCard({ dashboard, onOpen, onDelete }: DashboardCardProps) {
  const dateStr = new Date(dashboard.createdAt).toLocaleDateString();

  function handleDelete(event: React.MouseEvent) {
    event.stopPropagation();
    if (window.confirm(DASHBOARDS_LABELS.CONFIRM_DELETE)) {
      onDelete(dashboard.id);
    }
  }

  function handleOpen() {
    onOpen(dashboard.id);
  }

  return (
    <div className="card dashboard-card" onClick={handleOpen} role="button" tabIndex={0}>
      <span className="dashboard-card-name">{dashboard.name}</span>
      {dashboard.description && (
        <span className="dashboard-card-description">{dashboard.description}</span>
      )}
      <span className="dashboard-card-meta">
        {dashboard.layout.length} {DASHBOARDS_LABELS.BLOCKS_COUNT}
      </span>
      <span className="dashboard-card-date">{dateStr}</span>
      <div className="dashboard-card-actions">
        <button type="button" className="btn btn-outline" onClick={handleOpen}>
          {DASHBOARDS_LABELS.OPEN_BUTTON}
        </button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          {DASHBOARDS_LABELS.DELETE_BUTTON}
        </button>
      </div>
    </div>
  );
}
