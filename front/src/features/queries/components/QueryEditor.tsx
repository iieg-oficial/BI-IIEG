import { QUERIES_LABELS } from '../consts';

interface QueryEditorProps {
  sqlText: string;
  onSqlChange: (text: string) => void;
  onExecute: () => void;
  executing: boolean;
  disabled: boolean;
}

export default function QueryEditor({
  sqlText,
  onSqlChange,
  onExecute,
  executing,
  disabled,
}: QueryEditorProps) {
  return (
    <div>
      <label className="form-label" htmlFor="sql-editor">
        {QUERIES_LABELS.SQL_LABEL}
      </label>
      <textarea
        id="sql-editor"
        className="form-input query-editor-textarea"
        value={sqlText}
        onChange={(e) => onSqlChange(e.target.value)}
        placeholder={QUERIES_LABELS.SQL_PLACEHOLDER}
        rows={10}
        disabled={disabled}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={onExecute}
        disabled={disabled || executing || !sqlText.trim()}
        style={{ marginTop: '0.75rem' }}
      >
        {executing ? QUERIES_LABELS.EXECUTING : QUERIES_LABELS.EXECUTE_BUTTON}
      </button>
    </div>
  );
}
