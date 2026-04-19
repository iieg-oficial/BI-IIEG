import api from '../../../services/api';
import type { Chart, ChartCreate, ChartUpdate, ChartConfig } from '../../../types/charts';
import type { QueryExecuteResult } from '../../../types/queries';

export async function fetchCharts(): Promise<Chart[]> {
  const response = await api.get('/charts');
  return (response.data as Record<string, unknown>[]).map(mapChart);
}

export async function fetchChart(id: number): Promise<Chart> {
  const response = await api.get(`/charts/${id}`);
  return mapChart(response.data as Record<string, unknown>);
}

export async function createChart(data: ChartCreate): Promise<Chart> {
  const response = await api.post('/charts', {
    name: data.name,
    connection_id: data.connectionId,
    saved_query_id: data.savedQueryId ?? null,
    sql_text: data.sqlText,
    chart_type: data.chartType,
    config: {
      x_column: data.config.xColumn,
      y_columns: data.config.yColumns,
      title: data.config.title,
    },
  });
  return mapChart(response.data as Record<string, unknown>);
}

export async function updateChart(id: number, data: ChartUpdate): Promise<Chart> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.sqlText !== undefined) payload.sql_text = data.sqlText;
  if (data.chartType !== undefined) payload.chart_type = data.chartType;
  if (data.savedQueryId !== undefined) payload.saved_query_id = data.savedQueryId;
  if (data.config !== undefined) {
    payload.config = {
      x_column: data.config.xColumn,
      y_columns: data.config.yColumns,
      title: data.config.title,
    };
  }
  const response = await api.put(`/charts/${id}`, payload);
  return mapChart(response.data as Record<string, unknown>);
}

export async function deleteChart(id: number): Promise<void> {
  await api.delete(`/charts/${id}`);
}

export async function previewChart(id: number): Promise<QueryExecuteResult> {
  const response = await api.post(`/charts/${id}/preview`);
  const result = response.data as Record<string, unknown>;
  return {
    columns: result.columns as string[],
    rows: result.rows as unknown[][],
    rowCount: result.row_count as number,
  };
}

function mapChart(data: Record<string, unknown>): Chart {
  const rawConfig = data.config as Record<string, unknown>;
  const config: ChartConfig = {
    xColumn: rawConfig.x_column as string,
    yColumns: rawConfig.y_columns as string[],
    title: rawConfig.title as string | undefined,
  };
  return {
    id: data.id as number,
    userId: data.user_id as number,
    connectionId: data.connection_id as number,
    savedQueryId: (data.saved_query_id as number | null) ?? null,
    name: data.name as string,
    sqlText: data.sql_text as string,
    chartType: data.chart_type as Chart['chartType'],
    config,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}
