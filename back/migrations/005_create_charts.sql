-- Migration: 005_create_charts
-- Description: Create the charts table for user-saved chart visualizations
-- Date: 2026-04-18

CREATE TABLE charts (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    connection_id   INT NOT NULL REFERENCES connections (id) ON DELETE CASCADE,
    saved_query_id  INT REFERENCES saved_queries (id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    sql_text        TEXT NOT NULL,
    chart_type      VARCHAR(50) NOT NULL,
    config          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_charts_user_id ON charts (user_id);
CREATE INDEX idx_charts_connection_id ON charts (connection_id);
CREATE INDEX idx_charts_saved_query_id ON charts (saved_query_id);
