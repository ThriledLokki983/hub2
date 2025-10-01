/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  // Enable UUID extension if not enabled
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Add a temporary UUID column
  pgm.addColumn('users', {
    uuid_id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true,
    },
  });

  // Check if user_sessions table exists and properly handle UUID migration
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        -- First, add a new UUID column to user_sessions
        ALTER TABLE user_sessions ADD COLUMN uuid_user_id uuid;

        -- Update the new column with UUIDs from the users table
        UPDATE user_sessions
        SET uuid_user_id = users.uuid_id
        FROM users
        WHERE user_sessions.user_id::integer = users.id::integer;

        -- Drop the old integer column (will recreate constraints later)
        ALTER TABLE user_sessions DROP COLUMN user_id;

        -- Rename the UUID column to user_id
        ALTER TABLE user_sessions RENAME COLUMN uuid_user_id TO user_id;
      END IF;
    END
    $$;
  `);

  // Drop the old primary key constraint
  pgm.dropConstraint('users', 'users_pkey');

  // Rename the id column to old_id
  pgm.renameColumn('users', 'id', 'old_id');

  // Rename uuid_id to id
  pgm.renameColumn('users', 'uuid_id', 'id');

  // Add primary key constraint to the new UUID column
  pgm.addConstraint('users', 'users_pkey', {
    primaryKey: 'id',
  });

  // Update auth middleware and services logic to use UUID instead of integer
  pgm.sql(`COMMENT ON COLUMN users.id IS 'Primary key as UUID for better security';`);

  // Add back foreign key constraint if user_sessions exists
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      END IF;
    END
    $$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Add a temporary serial column
  pgm.addColumn('users', {
    serial_id: {
      type: 'serial',
      notNull: true,
    },
  });

  // Check if user_sessions table exists and convert back to integers
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        -- First, add a new integer column
        ALTER TABLE user_sessions ADD COLUMN int_user_id integer;

        -- Update it with integer values from the users table
        UPDATE user_sessions
        SET int_user_id = users.serial_id
        FROM users
        WHERE user_sessions.user_id = users.id;

        -- Drop the foreign key constraint if it exists
        ALTER TABLE user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;

        -- Drop the UUID column
        ALTER TABLE user_sessions DROP COLUMN user_id;

        -- Rename the integer column to user_id
        ALTER TABLE user_sessions RENAME COLUMN int_user_id TO user_id;
      END IF;
    END
    $$;
  `);

  // Drop the UUID primary key constraint
  pgm.dropConstraint('users', 'users_pkey');

  // Rename the UUID column
  pgm.renameColumn('users', 'id', 'uuid_id');

  // Rename serial_id to id
  pgm.renameColumn('users', 'serial_id', 'id');

  // Add primary key constraint back to the serial ID
  pgm.addConstraint('users', 'users_pkey', {
    primaryKey: 'id',
  });

  // Drop the uuid column
  pgm.dropColumn('users', 'uuid_id');

  // If user_sessions table exists, add back the foreign key constraint
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      END IF;
    END
    $$;
  `);
};
