"""Constants and messages for connections module."""

# Defaults
DEFAULT_PORT: int = 5432
EXTERNAL_DB_TIMEOUT: int = 10

# Excluded schemas when listing external DB schemas
EXCLUDED_SCHEMAS: list[str] = ["pg_catalog", "information_schema", "pg_toast"]

# Error messages
CONNECTION_NOT_FOUND: str = "Connection not found"
CONNECTION_ACCESS_DENIED: str = "You do not have access to this connection"
CONNECTION_TEST_FAILED: str = "Could not connect to the external database"
CONNECTION_TEST_SUCCESS: str = "Connection successful"
