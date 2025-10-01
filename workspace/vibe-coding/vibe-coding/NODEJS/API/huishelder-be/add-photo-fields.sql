-- Script to add missing photo fields to users table
-- This script is idempotent - it checks if columns exist before adding them

-- Function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(tbl text, col text) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = tbl AND column_name = col
  );
END;
$$ LANGUAGE plpgsql;

-- Add photo_url if it doesn't exist
DO $$ 
BEGIN
  IF NOT column_exists('users', 'photo_url') THEN
    ALTER TABLE users ADD COLUMN photo_url TEXT DEFAULT NULL;
    RAISE NOTICE 'Added photo_url column to users table';
  ELSE
    RAISE NOTICE 'photo_url column already exists';
  END IF;
END $$;

-- Add photo_filename if it doesn't exist
DO $$ 
BEGIN
  IF NOT column_exists('users', 'photo_filename') THEN
    ALTER TABLE users ADD COLUMN photo_filename TEXT DEFAULT NULL;
    RAISE NOTICE 'Added photo_filename column to users table';
  ELSE
    RAISE NOTICE 'photo_filename column already exists';
  END IF;
END $$;

-- Add photo_mimetype if it doesn't exist
DO $$ 
BEGIN
  IF NOT column_exists('users', 'photo_mimetype') THEN
    ALTER TABLE users ADD COLUMN photo_mimetype TEXT DEFAULT NULL;
    RAISE NOTICE 'Added photo_mimetype column to users table';
  ELSE
    RAISE NOTICE 'photo_mimetype column already exists';
  END IF;
END $$;

-- Add photo_variants if it doesn't exist
DO $$ 
BEGIN
  IF NOT column_exists('users', 'photo_variants') THEN
    ALTER TABLE users ADD COLUMN photo_variants JSONB DEFAULT NULL;
    RAISE NOTICE 'Added photo_variants column to users table';
  ELSE
    RAISE NOTICE 'photo_variants column already exists';
  END IF;
END $$;

-- Add photo_metadata if it doesn't exist
DO $$ 
BEGIN
  IF NOT column_exists('users', 'photo_metadata') THEN
    ALTER TABLE users ADD COLUMN photo_metadata JSONB DEFAULT NULL;
    RAISE NOTICE 'Added photo_metadata column to users table';
  ELSE
    RAISE NOTICE 'photo_metadata column already exists';
  END IF;
END $$;

-- Create a GIN index for the jsonb columns if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_photo_variants_idx') THEN
    CREATE INDEX users_photo_variants_idx ON users USING gin (photo_variants);
    RAISE NOTICE 'Created GIN index on photo_variants';
  ELSE
    RAISE NOTICE 'GIN index on photo_variants already exists';
  END IF;
END $$;

-- Drop function when done
DROP FUNCTION IF EXISTS column_exists(text, text);
