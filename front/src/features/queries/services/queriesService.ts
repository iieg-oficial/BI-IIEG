import api from '../../../services/api';
import type {
  QueryExecuteRequest,
  QueryExecuteResult,
  SavedQuery,
  SavedQueryCreate,
  SavedQueryUpdate,
} from '../../../types/queries';

export async function executeQuery(data: QueryExecuteRequest): Promise<QueryExecuteResult> {
  const response = await api.post('/queries/execute', {
    connection_id: data.connectionId,
    sql_text: data.sqlText,
  });
  const result = response.data as Record<string, unknown>;
  return {
    columns: result.columns as string[],
    rows: result.rows as unknown[][],
    rowCount: result.row_count as number,
  };
}

export async function fetchSavedQueries(): Promise<SavedQuery[]> {
  const response = await api.get('/queries/saved');
  return (response.data as Record<string, unknown>[]).map(mapSavedQuery);
}

export async function createSavedQuery(data: SavedQueryCreate): Promise<SavedQuery> {
  const response = await api.post('/queries/saved', {
    connection_id: data.connectionId,
    name: data.name,
    sql_text: data.sqlText,
    description: data.description,
  });
  return mapSavedQuery(response.data as Record<string, unknown>);
}

export async function updateSavedQuery(id: number, data: SavedQueryUpdate): Promise<SavedQuery> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.sqlText !== undefined) payload.sql_text = data.sqlText;
  if (data.description !== undefined) payload.description = data.description;
  const response = await api.put(`/queries/saved/${id}`, payload);
  return mapSavedQuery(response.data as Record<string, unknown>);
}

export async function deleteSavedQuery(id: number): Promise<void> {
  await api.delete(`/queries/saved/${id}`);
}

function mapSavedQuery(data: Record<string, unknown>): SavedQuery {
  return {
    id: data.id as number,
    connectionId: data.connection_id as number,
    name: data.name as string,
    sqlText: data.sql_text as string,
    description: (data.description as string) ?? '',
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}
