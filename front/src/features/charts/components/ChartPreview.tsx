import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { ChartType } from '../../../types/charts';
import type { QueryExecuteResult } from '../../../types/queries';
import { CHARTS_LABELS } from '../consts';

interface ChartPreviewProps {
  data: QueryExecuteResult;
  chartType: ChartType;
  xColumn: string;
  yColumns: string[];
  title?: string;
}

export default function ChartPreview({
  data,
  chartType,
  xColumn,
  yColumns,
  title,
}: ChartPreviewProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  const xIndex = data.columns.indexOf(xColumn);
  const xValues = data.rows.map((row) => row[xIndex]);

  function buildTraces(): Plotly.Data[] {
    if (chartType === 'pie') {
      const yIndex = data.columns.indexOf(yColumns[0]);
      return [
        {
          type: 'pie',
          labels: xValues as string[],
          values: data.rows.map((row) => row[yIndex]) as number[],
        },
      ];
    }

    if (chartType === 'histogram') {
      const yIndex = data.columns.indexOf(yColumns[0]);
      return [
        {
          type: 'histogram',
          x: data.rows.map((row) => row[yIndex]) as number[],
          name: yColumns[0],
        },
      ];
    }

    return yColumns.map((col) => {
      const yIndex = data.columns.indexOf(col);
      const plotlyType = chartType === 'line' || chartType === 'scatter' ? 'scatter' : chartType;
      const mode = chartType === 'line' ? 'lines+markers' : chartType === 'scatter' ? 'markers' : undefined;
      return {
        type: plotlyType as 'bar' | 'scatter',
        mode,
        x: xValues as Plotly.Datum[],
        y: data.rows.map((row) => row[yIndex]) as Plotly.Datum[],
        name: col,
      } satisfies Plotly.Data;
    });
  }

  useEffect(() => {
    if (data.rows.length === 0 || !plotRef.current) return;

    const layout: Partial<Plotly.Layout> = {
      title: title ? { text: title } : undefined,
      autosize: true,
      margin: { l: 50, r: 30, t: title ? 50 : 30, b: 50 },
    };

    const config: Partial<Plotly.Config> = { responsive: true };

    Plotly.newPlot(plotRef.current, buildTraces(), layout, config);

    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  });

  if (data.rows.length === 0) {
    return <div className="empty-state">{CHARTS_LABELS.NO_DATA}</div>;
  }

  return <div ref={plotRef} className="chart-preview" style={{ width: '100%', height: '100%' }} />;
}
