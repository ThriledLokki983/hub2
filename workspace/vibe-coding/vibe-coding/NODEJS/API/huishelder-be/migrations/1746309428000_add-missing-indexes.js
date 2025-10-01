/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Add index on deleted_at which is frequently used in WHERE clauses
  pgm.createIndex('users', 'deleted_at', {
    name: 'users_deleted_at_idx',
    where: 'deleted_at IS NOT NULL',
  });

  // Create an index for common user query patterns
  pgm.createIndex('users', ['is_active', 'deleted_at'], {
    name: 'users_active_not_deleted_idx',
    where: 'is_active = true AND deleted_at IS NULL',
  });

  // Add index for name search
  pgm.createIndex('users', ['name', 'first_name', 'last_name'], {
    name: 'users_name_search_idx',
  });

  // Create an index for the password_reset_tokens table
  // First check if the table exists
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'password_reset_tokens'
      ) THEN
        -- Create the password_reset_tokens table if it doesn't exist
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
  `);

  // Add index on token for password reset lookups
  pgm.createIndex('password_reset_tokens', 'token', {
    name: 'password_reset_tokens_token_idx',
    unique: true,
  });

  // Add index on user_id for password reset token lookups
  pgm.createIndex('password_reset_tokens', 'user_id', {
    name: 'password_reset_tokens_user_id_idx',
  });

  // Add index on expires_at for cleanup of expired tokens
  pgm.createIndex('password_reset_tokens', 'expires_at', {
    name: 'password_reset_tokens_expires_at_idx',
  });
};

exports.down = pgm => {
  // Drop all created indexes
  pgm.dropIndex('users', 'users_deleted_at_idx');
  pgm.dropIndex('users', 'users_active_not_deleted_idx');
  pgm.dropIndex('users', 'users_name_search_idx');
  pgm.dropIndex('password_reset_tokens', 'password_reset_tokens_token_idx');
  pgm.dropIndex('password_reset_tokens', 'password_reset_tokens_user_id_idx');
  pgm.dropIndex('password_reset_tokens', 'password_reset_tokens_expires_at_idx');
};
