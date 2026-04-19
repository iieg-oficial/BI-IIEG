-- Migration: 003_create_connections
-- Description: Create the connections table for external PostgreSQL database connections
-- Date: 2026-04-18

CREATE TABLE connections (
    id                 SERIAL PRIMARY KEY,
    user_id            INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name               VARCHAR(255) NOT NULL,
    host               VARCHAR(255) NOT NULL,
    port               INT NOT NULL DEFAULT 5432,
    database_name      VARCHAR(255) NOT NULL,
    username           VARCHAR(255) NOT NULL,
    encrypted_password TEXT NOT NULL,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_connections_user_id ON connections (user_id);
