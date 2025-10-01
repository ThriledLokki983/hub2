-- fix-migration-errors.sql
-- This script fixes migration issues by:
-- 1. Making sure all required migrations are marked as completed
-- 2. Ensuring all needed columns and indexes exist

-- First, check if the pgmigrations table exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pgmigrations') THEN
        CREATE TABLE pgmigrations (
            id SERIAL PRIMARY KEY,
            name varchar(255) NOT NULL UNIQUE,
            run_on timestamp NOT NULL DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert migration records if they don't exist
INSERT INTO pgmigrations (name, run_on)
SELECT '1714868559000_create-users-table', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pgmigrations WHERE name = '1714868559000_create-users-table');

INSERT INTO pgmigrations (name, run_on)
SELECT '1746309428000_add-missing-indexes', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pgmigrations WHERE name = '1746309428000_add-missing-indexes');

INSERT INTO pgmigrations (name, run_on)
SELECT '1746309429000_add-photo-fields-to-users', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pgmigrations WHERE name = '1746309429000_add-photo-fields-to-users');

INSERT INTO pgmigrations (name, run_on)
SELECT '1746390000000_add-photo-variants-to-users', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pgmigrations WHERE name = '1746390000000_add-photo-variants-to-users');

-- Create the password_reset_tokens table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'password_reset_tokens') THEN
        CREATE TABLE password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL,
            expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Add missing indexes to users table (from 1746309428000_add-missing-indexes)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_deleted_at_idx') THEN
        CREATE INDEX users_deleted_at_idx ON users (deleted_at) WHERE deleted_at IS NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_active_not_deleted_idx') THEN
        CREATE INDEX users_active_not_deleted_idx ON users (is_active, deleted_at) WHERE is_active = true AND deleted_at IS NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_name_search_idx') THEN
        CREATE INDEX users_name_search_idx ON users (name, first_name, last_name);
    END IF;
END
$$;

-- Add missing indexes to password_reset_tokens table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'password_reset_tokens_token_idx') THEN
        CREATE UNIQUE INDEX password_reset_tokens_token_idx ON password_reset_tokens (token);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'password_reset_tokens_user_id_idx') THEN
        CREATE INDEX password_reset_tokens_user_id_idx ON password_reset_tokens (user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'password_reset_tokens_expires_at_idx') THEN
        CREATE INDEX password_reset_tokens_expires_at_idx ON password_reset_tokens (expires_at);
    END IF;
END
$$;

-- Add photo fields to users table if they don't exist (from 1746309429000_add-photo-fields-to-users)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'photo_url') THEN
        ALTER TABLE users ADD COLUMN photo_url TEXT DEFAULT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'photo_filename') THEN
        ALTER TABLE users ADD COLUMN photo_filename TEXT DEFAULT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'photo_mimetype') THEN
        ALTER TABLE users ADD COLUMN photo_mimetype TEXT DEFAULT NULL;
    END IF;
END
$$;

-- Add photo variants columns to users table (from 1746390000000_add-photo-variants-to-users)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'photo_variants') THEN
        ALTER TABLE users ADD COLUMN photo_variants JSONB DEFAULT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'photo_metadata') THEN
        ALTER TABLE users ADD COLUMN photo_metadata JSONB DEFAULT NULL;
    END IF;
END
$$;

-- Create GIN index on photo_variants if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_photo_variants_idx') THEN
        CREATE INDEX users_photo_variants_idx ON users USING GIN (photo_variants);
    END IF;
END
$$;

-- Output success message
SELECT 'Database migration errors fixed successfully.' AS message;
