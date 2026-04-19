import { useState } from 'react';
import { QUERIES_LABELS } from '../consts';

interface SaveQueryModalProps {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  saving: boolean;
}

export default function SaveQueryModal({ onSave, onCancel, saving }: SaveQueryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(QUERIES_LABELS.REQUIRED_FIELDS);
      return;
    }
    setFormError('');
    onSave(name.trim(), description.trim());
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{QUERIES_LABELS.SAVE_MODAL_TITLE}</h3>
        <form className="save-query-form" onSubmit={handleSubmit}>
          {formError && <div className="form-error">{formError}</div>}
          <label className="form-label" htmlFor="query-name">
            {QUERIES_LABELS.QUERY_NAME_LABEL}
          </label>
          <input
            id="query-name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={QUERIES_LABELS.QUERY_NAME_PLACEHOLDER}
          />
          <label className="form-label" htmlFor="query-description">
            {QUERIES_LABELS.DESCRIPTION_LABEL}
          </label>
          <textarea
            id="query-description"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={QUERIES_LABELS.DESCRIPTION_PLACEHOLDER}
            rows={3}
          />
          <div className="save-query-form-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>
              {QUERIES_LABELS.CANCEL_BUTTON}
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {QUERIES_LABELS.SAVE_MODAL_BUTTON}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
