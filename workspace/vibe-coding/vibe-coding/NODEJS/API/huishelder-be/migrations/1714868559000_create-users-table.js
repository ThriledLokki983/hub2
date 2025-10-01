/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    first_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    last_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    phone: {
      type: 'varchar(255)',
    },
    address: {
      type: 'varchar(255)',
    },
    role: {
      type: 'text',
      notNull: true,
      default: 'user',
      check: "role IN ('user', 'advisor')",
    },
    language_preference: {
      type: 'text',
      default: 'en',
      check: "language_preference IN ('en', 'nl')",
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
    deleted_at: {
      type: 'timestamp',
    },
    is_active: {
      type: 'boolean',
      default: true,
    },
  });

  // Add indexes for performance
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'role');
};

exports.down = pgm => {
  pgm.dropTable('users');
};
