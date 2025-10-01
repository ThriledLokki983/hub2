/* eslint-disable camelcase */

exports.up = async pgm => {
  pgm.addColumns('users', {
    photo_variants: {
      type: 'jsonb',
      notNull: false,
      comment: 'JSON data containing information about various photo sizes and formats',
    },
    photo_metadata: {
      type: 'jsonb',
      notNull: false,
      comment: 'JSON data containing metadata about the original photo (dimensions, size, etc.)',
    },
  });

  // Create a GIN index for the jsonb columns to improve query performance when searching
  pgm.createIndex('users', 'photo_variants', { method: 'gin' });
};

exports.down = pgm => {
  pgm.dropIndex('users', 'photo_variants', { method: 'gin' });
  pgm.dropColumns('users', ['photo_variants', 'photo_metadata']);
};
