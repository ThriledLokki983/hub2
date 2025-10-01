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
  pgm.sql(`
    INSERT INTO timeline_steps (name, description, "order", default_due_in_days)
    VALUES
      ('Get mortgage advice', 'Consult with a mortgage advisor to understand your options and borrowing capacity', 1, 14),
      ('Estimate value of current home', 'Get a professional valuation or market analysis of your current property', 2, 21),
      ('List current home for sale', 'Put your current property on the market', 3, 30),
      ('Sign koopovereenkomst (buying)', 'Sign the purchase agreement for your new property', 4, 45)
    ON CONFLICT ("order") DO NOTHING;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.sql(`DELETE FROM timeline_steps WHERE "order" IN (1, 2, 3, 4);`);
};
