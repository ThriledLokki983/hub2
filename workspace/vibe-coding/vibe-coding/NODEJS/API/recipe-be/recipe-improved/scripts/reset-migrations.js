const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Simple logger since we can't import the actual logger
const logger = {
  info: msg => console.log(`info: ${msg}`),
  error: msg => console.error(`error: ${msg}`),
};

async function resetMigrations() {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  try {
    logger.info('Resetting failed migrations...');

    // First check if the migrations table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'pgmigrations'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      logger.info('No migrations table found. Nothing to reset.');
      return;
    }

    // Delete both UUID migration entries from the migrations table
    await pool.query(`
      DELETE FROM pgmigrations
      WHERE name IN (
        '1745668474463_change-users-id-to-uuid',
        '1745668842454_change-users-id-to-uuid-new'
      )
    `);

    // Check if the user_sessions table exists and has the user_id column of type uuid
    const userSessionsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'user_sessions'
      );
    `);

    if (userSessionsCheck.rows[0].exists) {
      // Check the column type of user_id in user_sessions
      const columnCheck = await pool.query(`
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'user_sessions' AND column_name = 'user_id'
      `);

      // If user_id is UUID, revert it back to integer
      if (columnCheck.rows.length > 0 && columnCheck.rows[0].data_type === 'uuid') {
        logger.info('Reverting user_sessions.user_id from UUID to integer...');

        // Add temporary integer column
        await pool.query(`ALTER TABLE user_sessions ADD COLUMN int_user_id integer;`);

        // Drop the foreign key constraint if it exists
        await pool.query(`ALTER TABLE user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;`);

        // Drop the UUID column
        await pool.query(`ALTER TABLE user_sessions DROP COLUMN user_id;`);

        // Rename int_user_id to user_id
        await pool.query(`ALTER TABLE user_sessions RENAME COLUMN int_user_id TO user_id;`);
      }
    }

    // Check if users table has been modified with UUID
    const usersCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name IN ('id', 'old_id', 'uuid_id')
    `);

    // Map the results to easily check column existence
    const columns = {};
    usersCheck.rows.forEach(row => {
      columns[row.column_name] = row.data_type;
    });

    // If users table has been modified, revert it
    if (columns.old_id || columns.id === 'uuid') {
      logger.info('Reverting users table structure...');

      // If old_id exists, rename it back to id (if needed)
      if (columns.old_id && !columns.id) {
        await pool.query(`ALTER TABLE users RENAME COLUMN old_id TO id;`);
      }

      // If id is UUID, drop it and recreate as serial
      if (columns.id === 'uuid') {
        // Drop primary key constraint
        await pool.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;`);

        // Drop the UUID column if it exists
        await pool.query(`ALTER TABLE users DROP COLUMN IF EXISTS id;`);

        // Add a new serial id column
        await pool.query(`ALTER TABLE users ADD COLUMN id serial PRIMARY KEY;`);
      }

      // Drop uuid_id if it exists
      if (columns.uuid_id) {
        await pool.query(`ALTER TABLE users DROP COLUMN IF EXISTS uuid_id;`);
      }
    }

    logger.info('✅ Migration reset completed successfully');
  } catch (error) {
    logger.error(`❌ Failed to reset migrations: ${error.message}`);
    throw error;
  } finally {
    await pool.end();
  }
}

resetMigrations()
  .then(() => process.exit(0))
  .catch(err => {
    logger.error(err);
    process.exit(1);
  });
