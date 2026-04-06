-- ================================================
-- InstAShark Database Migrations
-- Run: docker exec -i auth-saas-db-1 psql -U admin -d authsaasdb < backend/migrations.sql
-- ================================================

-- Base: Create users table (handled by SQLAlchemy, but documented here)
-- CREATE TABLE IF NOT EXISTS users (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR UNIQUE NOT NULL,
--     name VARCHAR,
--     email VARCHAR UNIQUE NOT NULL,
--     hashed_password VARCHAR,
--     is_active BOOLEAN DEFAULT FALSE,
--     is_verified BOOLEAN DEFAULT FALSE,
--     provider VARCHAR DEFAULT 'local',
--     otp_code VARCHAR,
--     otp_expires TIMESTAMP WITH TIME ZONE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Migration 1: Add avatar column
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR;

-- Migration 2: Add phone column
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR;