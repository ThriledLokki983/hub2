/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = {
  id: { type: 'serial', primaryKey: true },
  timestamps: {
    created_at: { type: 'timestamp', notNull: true, default: 'now()' },
    updated_at: { type: 'timestamp', notNull: true, default: 'now()' },
  },
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  // Create users table
  pgm.createTable(
    'users',
    {
      id: 'id',
      email: { type: 'varchar(255)', notNull: true, unique: true },
      password: { type: 'varchar(255)', notNull: true },
      first_name: { type: 'varchar(100)' },
      last_name: { type: 'varchar(100)' },
      role: { type: 'varchar(20)', notNull: true, default: "'user'" },
      ...exports.shorthands.timestamps,
    },
    {
      comment: 'Stores user account information',
      ifNotExists: true,
    },
  );

  // Create index on email for faster login lookups
  pgm.createIndex('users', 'email');

  // Example of creating a second table with a relationship
  pgm.createTable(
    'user_sessions',
    {
      id: 'id',
      user_id: {
        type: 'integer',
        notNull: true,
        references: 'users',
        onDelete: 'CASCADE',
      },
      token: { type: 'varchar(255)', notNull: true },
      expires_at: { type: 'timestamp', notNull: true },
      ...exports.shorthands.timestamps,
    },
    {
      comment: 'Stores user session information',
      ifNotExists: true,
    },
  );

  // Create index on user_id for faster lookups
  pgm.createIndex('user_sessions', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Drop tables in reverse order (to handle foreign key constraints)
  pgm.dropTable('user_sessions', { ifExists: true, cascade: true });
  pgm.dropTable('users', { ifExists: true, cascade: true });
};
