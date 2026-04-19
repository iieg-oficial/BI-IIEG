import type { Connection } from '../../../types/connections';
import { QUERIES_LABELS } from '../consts';

interface ConnectionSelectorProps {
  connections: Connection[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  disabled?: boolean;
}

export default function ConnectionSelector({
  connections,
  selectedId,
  onSelect,
  disabled,
}: ConnectionSelectorProps) {
  return (
    <div>
      <label className="form-label" htmlFor="connection-select">
        {QUERIES_LABELS.CONNECTION_SELECT_LABEL}
      </label>
      <select
        id="connection-select"
        className="form-input"
        value={selectedId ?? ''}
        onChange={(e) => onSelect(Number(e.target.value))}
        disabled={disabled}
      >
        <option value="" disabled>
          {QUERIES_LABELS.CONNECTION_SELECT_PLACEHOLDER}
        </option>
        {connections.map((conn) => (
          <option key={conn.id} value={conn.id}>
            {conn.name} ({conn.host}:{conn.port}/{conn.databaseName})
          </option>
        ))}
      </select>
    </div>
  );
}
