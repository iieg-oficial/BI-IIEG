import { useState } from 'react';
import type { FormEvent } from 'react';
import { DASHBOARDS_LABELS } from '../consts';
import type { DashboardCreate } from '../../../types/dashboards';

interface CreateDashboardModalProps {
  onClose: () => void;
  onCreate: (data: DashboardCreate) => Promise<void>;
}

export default function CreateDashboardModal({ onClose, onCreate }: CreateDashboardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        layout: [],
      });
    } catch {
      setError('Error al crear el dashboard.');
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h2>{DASHBOARDS_LABELS.CREATE_BUTTON}</h2>
        <label className="form-label" htmlFor="dashboard-name">
          {DASHBOARDS_LABELS.NAME_LABEL}
        </label>
        <input
          id="dashboard-name"
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={DASHBOARDS_LABELS.NAME_PLACEHOLDER}
          autoFocus
        />
        <label className="form-label" htmlFor="dashboard-description">
          {DASHBOARDS_LABELS.DESCRIPTION_LABEL}
        </label>
        <textarea
          id="dashboard-description"
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={DASHBOARDS_LABELS.DESCRIPTION_PLACEHOLDER}
          rows={3}
        />
        {error && <div className="form-error">{error}</div>}
        <div className="form-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={submitting}
          >
            {DASHBOARDS_LABELS.CANCEL_BUTTON}
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? DASHBOARDS_LABELS.SAVING : DASHBOARDS_LABELS.SAVE_BUTTON}
          </button>
        </div>
      </form>
    </div>
  );
}
