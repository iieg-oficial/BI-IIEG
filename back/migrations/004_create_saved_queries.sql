-- Migration: 004_create_saved_queries
-- Description: Create the saved_queries table for user saved SQL queries
-- Date: 2026-04-18

CREATE TABLE saved_queries (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    connection_id   INT NOT NULL REFERENCES connections (id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    sql_text        TEXT NOT NULL,
    description     TEXT DEFAULT '',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_queries_user_id ON saved_queries (user_id);
CREATE INDEX idx_saved_queries_connection_id ON saved_queries (connection_id);
