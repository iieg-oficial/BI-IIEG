import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DASHBOARDS_LABELS } from '../consts';

interface MarkdownBlockProps {
  content: string;
  editMode: boolean;
  onChange: (markdown: string) => void;
  onRemove?: () => void;
}

export default function MarkdownBlock({
  content,
  editMode,
  onChange,
  onRemove,
}: MarkdownBlockProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="dashboard-block dashboard-block-markdown">
      <div className="dashboard-block-header">
        <span className="dashboard-block-title">
          {editMode
            ? showPreview
              ? DASHBOARDS_LABELS.MARKDOWN_PREVIEW_LABEL
              : DASHBOARDS_LABELS.MARKDOWN_EDITOR_LABEL
            : ''}
        </span>
        {editMode && (
          <div className="dashboard-block-header-actions no-drag">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowPreview((prev) => !prev)}
            >
              {showPreview
                ? DASHBOARDS_LABELS.MARKDOWN_EDITOR_LABEL
                : DASHBOARDS_LABELS.MARKDOWN_PREVIEW_LABEL}
            </button>
            {onRemove && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={onRemove}
              >
                {DASHBOARDS_LABELS.REMOVE_BLOCK}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="dashboard-block-content">
        {editMode && !showPreview ? (
          <textarea
            className="markdown-block-editor no-drag"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="markdown-block-preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
