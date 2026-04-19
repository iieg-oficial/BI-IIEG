import { DASHBOARDS_LABELS } from '../consts';

interface AddBlockToolbarProps {
  onAddChart: () => void;
  onAddMarkdown: () => void;
  disabled?: boolean;
}

export default function AddBlockToolbar({
  onAddChart,
  onAddMarkdown,
  disabled = false,
}: AddBlockToolbarProps) {
  return (
    <div className="add-block-toolbar">
      <button
        type="button"
        className="btn btn-outline"
        onClick={onAddChart}
        disabled={disabled}
      >
        {DASHBOARDS_LABELS.ADD_CHART_BUTTON}
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onAddMarkdown}
        disabled={disabled}
      >
        {DASHBOARDS_LABELS.ADD_MARKDOWN_BUTTON}
      </button>
    </div>
  );
}
