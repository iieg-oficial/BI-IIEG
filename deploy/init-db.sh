#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
    echo "PostgreSQL is not ready yet. Retrying in 2 seconds..."
    sleep 2
done

echo "Running migrations..."
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/001_create_users.sql
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/002_add_phone_to_users.sql
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/003_create_connections.sql
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/004_create_saved_queries.sql
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/005_create_charts.sql
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/006_create_dashboards.sql
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /migrations/007_drop_phone_from_users.sql

echo "Migrations completed successfully."

echo "Creating dummy_data database..."
PGPASSWORD="$POSTGRES_PASSWORD" psql -h db -U "$POSTGRES_USER" -d postgres -f /migrations/seed_dummy_data.sql

echo "Seeding demo data..."
cd /app && python seed.py

echo "Seed completed successfully."
