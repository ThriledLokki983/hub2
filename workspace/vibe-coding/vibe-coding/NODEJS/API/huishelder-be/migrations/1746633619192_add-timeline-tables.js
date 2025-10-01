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
  // Enable UUID extension if not already enabled
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  // Create timeline_steps table - master list of all possible steps
  pgm.createTable(
    'timeline_steps',
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      name: {
        type: 'varchar(255)',
        notNull: true,
      },
      description: {
        type: 'text',
      },
      order: {
        type: 'integer',
        notNull: true,
      },
      default_due_in_days: {
        type: 'integer',
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func("(now() at time zone 'utc')"),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func("(now() at time zone 'utc')"),
      },
    },
    {
      comment: 'Master list of all timeline steps, shared across users',
    },
  );

  // Add unique constraint to ensure steps have unique names
  pgm.createConstraint('timeline_steps', 'timeline_steps_name_key', {
    unique: 'name',
  });

  // Add unique constraint to ensure steps have unique order
  pgm.createConstraint('timeline_steps', 'timeline_steps_order_key', {
    unique: 'order',
  });

  // Create user_timeline_steps table - per-user instances of steps
  pgm.createTable(
    'user_timeline_steps',
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      user_id: {
        type: 'uuid',
        notNull: true,
        references: 'users(id)',
        onDelete: 'CASCADE',
      },
      timeline_step_id: {
        type: 'uuid',
        notNull: true,
        references: 'timeline_steps(id)',
        onDelete: 'CASCADE',
      },
      status: {
        type: 'text',
        notNull: true,
        default: 'pending',
        check: "status IN ('pending', 'in_progress', 'completed')",
      },
      due_date: {
        type: 'date',
      },
      completed_at: {
        type: 'timestamp',
      },
      notes: {
        type: 'text',
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func("(now() at time zone 'utc')"),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func("(now() at time zone 'utc')"),
      },
    },
    {
      comment: 'Per-user instances of timeline steps',
    },
  );

  // Add indexes for performance
  pgm.createIndex('timeline_steps', 'order');
  pgm.createIndex('user_timeline_steps', 'user_id');
  pgm.createIndex('user_timeline_steps', 'timeline_step_id');
  pgm.createIndex('user_timeline_steps', 'status');
  pgm.createIndex('user_timeline_steps', 'due_date');

  // Add unique constraint to ensure a user can't have duplicate steps
  pgm.createConstraint('user_timeline_steps', 'user_timeline_steps_user_step_key', {
    unique: ['user_id', 'timeline_step_id'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Drop tables in reverse order (to respect foreign key constraints)
  pgm.dropTable('user_timeline_steps', { ifExists: true });
  pgm.dropTable('timeline_steps', { ifExists: true });
};
