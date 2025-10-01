/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Add thumbnail columns to the recipe_photos table
  pgm.addColumns('recipe_photos', {
    thumbnail_small: {
      type: 'text',
      comment: 'Path to the small thumbnail image (200x200)',
    },
    thumbnail_medium: {
      type: 'text',
      comment: 'Path to the medium thumbnail image (400x400)',
    },
  });

  // Update the recipe_photos table comment
  pgm.sql(`
    COMMENT ON TABLE recipe_photos IS 'Stores recipe photos with original image and various thumbnail sizes';
  `);
};

exports.down = pgm => {
  // Remove thumbnail columns from the recipe_photos table
  pgm.dropColumns('recipe_photos', ['thumbnail_small', 'thumbnail_medium']);
};
