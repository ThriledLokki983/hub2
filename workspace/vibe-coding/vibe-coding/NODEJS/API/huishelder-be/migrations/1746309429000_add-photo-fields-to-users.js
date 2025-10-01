/**
 * Add user photo fields
 */
exports.up = async function (pgm) {
  // Add photo fields to users table
  await pgm.addColumns('users', {
    photo_url: { type: 'text', default: null },
    photo_filename: { type: 'text', default: null },
    photo_mimetype: { type: 'text', default: null },
  });
};

/**
 * Remove photo fields
 */
exports.down = async function (pgm) {
  // Remove photo columns if migration needs to be rolled back
  await pgm.dropColumns('users', ['photo_url', 'photo_filename', 'photo_mimetype']);
};
