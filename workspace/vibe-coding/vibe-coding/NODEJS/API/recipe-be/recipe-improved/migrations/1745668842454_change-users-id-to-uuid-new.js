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
  // This migration is now a no-op as its functionality is handled by 1745668474463_change-users-id-to-uuid.js
  pgm.sql(`
    DO $$
    BEGIN
      RAISE NOTICE 'Skipping redundant migration - functionality handled by previous migration';
    END $$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // No-op for down migration as well
  pgm.sql(`
    DO $$
    BEGIN
      RAISE NOTICE 'Skipping redundant down migration';
    END $$;
  `);
};
