import { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';
import { fetchChart, previewChart } from '../../charts/services/chartsService';
import type { Chart } from '../../../types/charts';
import type { QueryExecuteResult } from '../../../types/queries';
import { DASHBOARDS_LABELS } from '../consts';

interface ChartBlockProps {
  chartId: number | null;
  onRemove?: () => void;
  editMode: boolean;
}

export default function ChartBlock({ chartId, onRemove, editMode }: ChartBlockProps) {
  const [chart, setChart] = useState<Chart | null>(null);
  const [data, setData] = useState<QueryExecuteResult | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unavailable'>('loading');
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (chartId === null) {
        setStatus('unavailable');
        return;
      }
      setStatus('loading');
      try {
        const [chartData, previewData] = await Promise.all([
          fetchChart(chartId),
          previewChart(chartId),
        ]);
        if (!cancelled) {
          setChart(chartData);
          setData(previewData);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [chartId]);

  useEffect(() => {
    if (status !== 'ready' || !chart || !data || !plotRef.current || data.rows.length === 0) {
      return;
    }

    const { chartType, config } = chart;
    const { xColumn, yColumns, title } = config;
    const xIndex = data.columns.indexOf(xColumn);
    const xValues = data.rows.map((row) => row[xIndex]);

    function buildTraces(): Plotly.Data[] {
      if (chartType === 'pie') {
        const yIndex = data!.columns.indexOf(yColumns[0]);
        return [
          {
            type: 'pie',
            labels: xValues as string[],
            values: data!.rows.map((row) => row[yIndex]) as number[],
          },
        ];
      }
      if (chartType === 'histogram') {
        const yIndex = data!.columns.indexOf(yColumns[0]);
        return [
          {
            type: 'histogram',
            x: data!.rows.map((row) => row[yIndex]) as number[],
            name: yColumns[0],
          },
        ];
      }
      return yColumns.map((col) => {
        const yIndex = data!.columns.indexOf(col);
        const plotlyType = chartType === 'line' || chartType === 'scatter' ? 'scatter' : chartType;
        const mode =
          chartType === 'line' ? 'lines+markers' : chartType === 'scatter' ? 'markers' : undefined;
        return {
          type: plotlyType as 'bar' | 'scatter',
          mode,
          x: xValues as Plotly.Datum[],
          y: data!.rows.map((row) => row[yIndex]) as Plotly.Datum[],
          name: col,
        } satisfies Plotly.Data;
      });
    }

    const layout: Partial<Plotly.Layout> = {
      title: title ? { text: title } : undefined,
      autosize: true,
      margin: { l: 40, r: 20, t: title ? 40 : 20, b: 40 },
    };
    const config2: Partial<Plotly.Config> = { responsive: true, displayModeBar: false };
    const container = plotRef.current;

    Plotly.newPlot(container, buildTraces(), layout, config2);

    const observer = new ResizeObserver(() => {
      Plotly.Plots.resize(container);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      Plotly.purge(container);
    };
  }, [status, chart, data]);

  return (
    <div className="dashboard-block dashboard-block-chart">
      <div className="dashboard-block-header">
        <span className="dashboard-block-title">{chart?.name ?? '...'}</span>
        {editMode && onRemove && (
          <button
            type="button"
            className="btn btn-sm btn-danger no-drag"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onRemove}
          >
            {DASHBOARDS_LABELS.REMOVE_BLOCK}
          </button>
        )}
      </div>
      <div className="dashboard-block-content">
        {status === 'loading' && <div className="empty-state">{DASHBOARDS_LABELS.CHART_LOADING}</div>}
        {status === 'unavailable' && (
          <div className="empty-state">{DASHBOARDS_LABELS.CHART_UNAVAILABLE}</div>
        )}
        {status === 'error' && (
          <div className="form-error">{DASHBOARDS_LABELS.CHART_ERROR}</div>
        )}
        {status === 'ready' && (
          <div ref={plotRef} className="dashboard-chart-plot" style={{ width: '100%', height: '100%' }} />
        )}
      </div>
    </div>
  );
}
