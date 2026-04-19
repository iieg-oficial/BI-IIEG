import api from '../../../services/api';
import type {
  Connection,
  ConnectionCreate,
  ConnectionTestResult,
  SchemaInfo,
  TableInfo,
  ColumnInfo,
} from '../../../types/connections';

export async function fetchConnections(): Promise<Connection[]> {
  const response = await api.get('/connections');
  return (response.data as Record<string, unknown>[]).map(mapConnection);
}

export async function createConnection(data: ConnectionCreate): Promise<Connection> {
  const response = await api.post('/connections', {
    name: data.name,
    host: data.host,
    port: data.port,
    database_name: data.databaseName,
    username: data.username,
    password: data.password,
  });
  return mapConnection(response.data as Record<string, unknown>);
}

export async function deleteConnection(id: number): Promise<void> {
  await api.delete(`/connections/${id}`);
}

export async function testConnection(id: number): Promise<ConnectionTestResult> {
  const response = await api.post(`/connections/${id}/test`);
  const data = response.data as Record<string, unknown>;
  return {
    ok: data.ok as boolean,
    message: data.message as string,
  };
}

export async function fetchSchemas(connectionId: number): Promise<SchemaInfo[]> {
  const response = await api.get(`/connections/${connectionId}/schemas`);
  return (response.data as Record<string, unknown>[]).map((d) => ({
    schemaName: d.schema_name as string,
  }));
}

export async function fetchTables(connectionId: number, schemaName: string): Promise<TableInfo[]> {
  const response = await api.get(`/connections/${connectionId}/schemas/${schemaName}/tables`);
  return (response.data as Record<string, unknown>[]).map((d) => ({
    tableName: d.table_name as string,
  }));
}

export async function fetchColumns(
  connectionId: number,
  schemaName: string,
  tableName: string,
): Promise<ColumnInfo[]> {
  const response = await api.get(
    `/connections/${connectionId}/schemas/${schemaName}/tables/${tableName}/columns`,
  );
  return (response.data as Record<string, unknown>[]).map((d) => ({
    columnName: d.column_name as string,
    dataType: d.data_type as string,
    isNullable: d.is_nullable as boolean,
  }));
}

function mapConnection(data: Record<string, unknown>): Connection {
  return {
    id: data.id as number,
    name: data.name as string,
    host: data.host as string,
    port: data.port as number,
    databaseName: data.database_name as string,
    username: data.username as string,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}
