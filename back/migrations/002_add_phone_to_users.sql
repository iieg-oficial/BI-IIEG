-- Migration: 002_add_phone_to_users
-- Description: Add phone column to users table
-- Date: 2026-04-18

ALTER TABLE users
    ADD COLUMN phone VARCHAR(20) NOT NULL DEFAULT '';
