/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('password_reset_tokens', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      primaryKey: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    token: {
      type: 'text',
      notNull: true,
    },
    expires_at: {
      type: 'timestamp',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Index for faster token lookup
  pgm.createIndex('password_reset_tokens', 'token');

  // Index for faster user lookup
  pgm.createIndex('password_reset_tokens', 'user_id');
};

exports.down = pgm => {
  pgm.dropTable('password_reset_tokens');
};
