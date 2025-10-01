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

  // Create regions table
  pgm.createTable('regions', {
    id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: 'varchar(100)',
      notNull: true,
      unique: true,
    },
    description: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp with time zone',
      default: pgm.func('NOW()'),
      notNull: true,
    },
    updated_at: {
      type: 'timestamp with time zone',
      default: pgm.func('NOW()'),
      notNull: true,
    },
    deleted_at: {
      type: 'timestamp with time zone',
    },
  });

  // Add an index on region name for faster lookups
  pgm.createIndex('regions', 'name');

  // Alter recipes table to add region_id column
  pgm.addColumn('recipes', {
    region_id: {
      type: 'uuid',
      references: 'regions(id)',
      onDelete: 'SET NULL',
    },
  });

  // Create an index on recipes.region_id for faster lookups
  pgm.createIndex('recipes', 'region_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // First drop the foreign key column in recipes
  pgm.dropColumn('recipes', 'region_id');

  // Then drop the regions table
  pgm.dropTable('regions', { ifExists: true });
};
