import { useMemo } from 'react';
import GridLayout, { useContainerWidth } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import type { DashboardBlock } from '../../../types/dashboards';
import { GRID_COLS, GRID_ROW_HEIGHT } from '../consts';
import ChartBlock from './ChartBlock';
import MarkdownBlock from './MarkdownBlock';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

type LayoutItem = Layout;

interface DashboardCanvasProps {
  layout: DashboardBlock[];
  isEditing: boolean;
  onLayoutChange: (next: DashboardBlock[]) => void;
  onBlockChange: (id: string, patch: Partial<DashboardBlock>) => void;
  onRemoveBlock: (id: string) => void;
}

export default function DashboardCanvas({
  layout,
  isEditing,
  onLayoutChange,
  onBlockChange,
  onRemoveBlock,
}: DashboardCanvasProps) {
  const { containerRef, width: containerWidth } = useContainerWidth();

  const gridLayout = useMemo<LayoutItem[]>(
    () =>
      layout.map((block) => ({
        i: block.id,
        x: block.x,
        y: block.y,
        w: block.w,
        h: block.h,
      })),
    [layout],
  );

  function handleLayoutChange(next: LayoutItem[]) {
    if (!isEditing) return;
    const byId = new Map(next.map((item) => [item.i, item]));
    let changed = false;
    const merged = layout.map((block) => {
      const updated = byId.get(block.id);
      if (!updated) return block;
      if (
        block.x === updated.x &&
        block.y === updated.y &&
        block.w === updated.w &&
        block.h === updated.h
      ) {
        return block;
      }
      changed = true;
      return {
        ...block,
        x: updated.x,
        y: updated.y,
        w: updated.w,
        h: updated.h,
      };
    });
    if (changed) onLayoutChange(merged);
  }

  return (
    <div className="dashboard-canvas" ref={containerRef}>
      <GridLayout
        className="layout"
        layout={gridLayout}
        cols={GRID_COLS}
        rowHeight={GRID_ROW_HEIGHT}
        width={containerWidth}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableCancel=".no-drag"
        onLayoutChange={handleLayoutChange}
        margin={[12, 12]}
      >
        {layout.map((block) => (
          <div key={block.id} className="dashboard-grid-item">
            {block.type === 'chart' ? (
              <ChartBlock
                chartId={block.chartId}
                editMode={isEditing}
                onRemove={() => onRemoveBlock(block.id)}
              />
            ) : (
              <MarkdownBlock
                content={block.markdown ?? ''}
                editMode={isEditing}
                onChange={(markdown) => onBlockChange(block.id, { markdown })}
                onRemove={() => onRemoveBlock(block.id)}
              />
            )}
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
