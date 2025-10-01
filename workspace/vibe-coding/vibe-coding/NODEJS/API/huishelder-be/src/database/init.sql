-- This file is now only for database initialization that happens before migrations
-- Table creation is handled by migrations

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- You can add other database-wide settings or extensions here
-- But don't create tables here as they will be managed by migrations
