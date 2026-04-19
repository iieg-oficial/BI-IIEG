export type DashboardBlockType = 'chart' | 'markdown';

export interface DashboardBlock {
  id: string;
  type: DashboardBlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  chartId: number | null;
  markdown: string | null;
}

export interface Dashboard {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  layout: DashboardBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCreate {
  name: string;
  description?: string | null;
  layout?: DashboardBlock[];
}

export interface DashboardUpdate {
  name?: string;
  description?: string | null;
  layout?: DashboardBlock[];
}
