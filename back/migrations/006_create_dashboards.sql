-- Migration: 006_create_dashboards
-- Description: Create the dashboards table for user-authored dashboards with blocks on a canvas
-- Date: 2026-04-18

CREATE TABLE dashboards (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    layout      JSONB NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dashboards_user_id ON dashboards (user_id);
