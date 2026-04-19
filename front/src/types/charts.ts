export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'histogram';

export interface ChartConfig {
  xColumn: string;
  yColumns: string[];
  title?: string;
}

export interface Chart {
  id: number;
  userId: number;
  connectionId: number;
  savedQueryId: number | null;
  name: string;
  sqlText: string;
  chartType: ChartType;
  config: ChartConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ChartCreate {
  name: string;
  connectionId: number;
  savedQueryId?: number | null;
  sqlText: string;
  chartType: ChartType;
  config: ChartConfig;
}

export interface ChartUpdate {
  name?: string;
  sqlText?: string;
  chartType?: ChartType;
  config?: ChartConfig;
  savedQueryId?: number | null;
}
