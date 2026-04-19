"""Constants and messages for queries module."""

# Limits
MAX_QUERY_ROWS: int = 10_000
QUERY_TIMEOUT_SECONDS: int = 30

# Forbidden SQL keywords (everything except SELECT)
FORBIDDEN_SQL_KEYWORDS: set[str] = {
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "CREATE",
    "ALTER",
    "TRUNCATE",
    "GRANT",
    "REVOKE",
    "COPY",
    "CALL",
    "DO",
    "LISTEN",
    "NOTIFY",
    "EXECUTE",
    "VACUUM",
    "REINDEX",
    "CLUSTER",
    "COMMENT",
    "LOCK",
    "SET",
    "RESET",
    "SHOW",
    "LOAD",
    "SECURITY LABEL",
    "REASSIGN",
    "REFRESH",
    "IMPORT",
    "DISCARD",
    "DEALLOCATE",
    "DECLARE",
    "FETCH",
    "MOVE",
    "CLOSE",
    "PREPARE",
    "SAVEPOINT",
    "RELEASE",
    "BEGIN",
    "COMMIT",
    "ROLLBACK",
    "END",
    "ABORT",
    "START",
}

# Error messages
QUERY_NOT_ALLOWED: str = "Only SELECT queries are allowed"
QUERY_MULTIPLE_STATEMENTS: str = "Only a single SQL statement is allowed"
QUERY_EMPTY: str = "SQL text cannot be empty"
QUERY_EXECUTION_FAILED: str = "Query execution failed"
QUERY_TIMEOUT: str = "Query exceeded time limit"
SAVED_QUERY_NOT_FOUND: str = "Saved query not found"
SAVED_QUERY_ACCESS_DENIED: str = "You do not have access to this saved query"
