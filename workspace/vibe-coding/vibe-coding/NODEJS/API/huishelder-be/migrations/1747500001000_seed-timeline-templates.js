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
    -- Insert some timeline templates
    INSERT INTO timeline_templates (title, description, category, default_days_offset, default_priority, required_onboarding_flags)
    VALUES
      ('Get pre-approval for mortgage', 'Contact a mortgage advisor to get pre-approved for a mortgage', 'buying', 14, 1, '["buying", "first_time_buyer"]'),
      ('Start searching for properties', 'Begin actively searching for properties that match your criteria', 'buying', 30, 2, '["buying"]'),
      ('List your property', 'List your property on the market with an agent', 'selling', 21, 1, '["selling"]'),
      ('Prepare property for viewing', 'Stage your home for potential buyers', 'selling', 14, 2, '["selling"]'),
      ('Schedule property inspections', 'Arrange for necessary inspections', 'buying', 60, 3, '["buying"]'),
      ('Review offers', 'Review offers from potential buyers', 'selling', 45, 2, '["selling"]'),
      ('Negotiate final price', 'Negotiate the final purchase price with the seller', 'buying', 90, 3, '["buying"]'),
      ('Finalize mortgage application', 'Complete and submit your final mortgage application', 'buying', 75, 1, '["buying"]');
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.sql(`
    DELETE FROM timeline_templates
    WHERE title IN (
      'Get pre-approval for mortgage',
      'Start searching for properties',
      'List your property',
      'Prepare property for viewing',
      'Schedule property inspections',
      'Review offers',
      'Negotiate final price',
      'Finalize mortgage application'
    );
  `);
};
