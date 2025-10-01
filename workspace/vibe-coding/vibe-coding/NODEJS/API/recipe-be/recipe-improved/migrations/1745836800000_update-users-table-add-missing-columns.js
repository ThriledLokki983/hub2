/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  // Add only the missing columns that are not yet in the users table
  pgm.addColumns('users', {
    middle_name: { type: 'VARCHAR(100)', nullable: true },
    full_name: { type: 'VARCHAR(255)', nullable: true },
    title: { type: 'VARCHAR(100)', nullable: true },
    region: { type: 'VARCHAR(100)', nullable: true },
    image: { type: 'VARCHAR(255)', nullable: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Drop the added columns
  pgm.dropColumns('users', ['middle_name', 'full_name', 'title', 'region', 'image']);
};
