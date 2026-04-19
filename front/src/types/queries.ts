export interface QueryExecuteRequest {
  connectionId: number;
  sqlText: string;
}

export interface QueryExecuteResult {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
}

export interface SavedQuery {
  id: number;
  connectionId: number;
  name: string;
  sqlText: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedQueryCreate {
  connectionId: number;
  name: string;
  sqlText: string;
  description: string;
}

export interface SavedQueryUpdate {
  name?: string;
  sqlText?: string;
  description?: string;
}
