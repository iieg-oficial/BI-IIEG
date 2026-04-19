import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboards } from './hooks';
import { CreateDashboardModal, DashboardList } from './components';
import { DASHBOARDS_LABELS } from './consts';
import { dashboardEdit } from '../../consts/routes';
import type { DashboardCreate } from '../../types/dashboards';

export default function DashboardsPage() {
  const { dashboards, loading, error, addDashboard, removeDashboard } = useDashboards();
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  function handleOpen(id: number) {
    navigate(dashboardEdit(id));
  }

  async function handleDelete(id: number) {
    await removeDashboard(id);
  }

  async function handleCreate(data: DashboardCreate) {
    const created = await addDashboard(data);
    setShowCreate(false);
    navigate(dashboardEdit(created.id));
  }

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboards-page">
      <div className="dashboards-header">
        <h1>{DASHBOARDS_LABELS.PAGE_TITLE}</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
        >
          {DASHBOARDS_LABELS.CREATE_BUTTON}
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
      <DashboardList
        dashboards={dashboards}
        onOpen={handleOpen}
        onDelete={handleDelete}
      />
      {showCreate && (
        <CreateDashboardModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
