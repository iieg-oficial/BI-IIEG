export interface Connection {
  id: number;
  name: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionCreate {
  name: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
}

export interface ConnectionTestResult {
  ok: boolean;
  message: string;
}

export interface SchemaInfo {
  schemaName: string;
}

export interface TableInfo {
  tableName: string;
}

export interface ColumnInfo {
  columnName: string;
  dataType: string;
  isNullable: boolean;
}
