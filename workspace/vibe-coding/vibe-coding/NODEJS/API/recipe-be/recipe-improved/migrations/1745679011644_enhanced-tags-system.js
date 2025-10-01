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
  // Create a dedicated tags table
  pgm.createTable('tags', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    name: { type: 'varchar(100)', notNull: true },
    slug: { type: 'varchar(100)', notNull: true, unique: true },
    description: { type: 'text' },
    count: { type: 'integer', default: 0, notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // Create an index on the tag name for faster lookups
  pgm.createIndex('tags', 'name');
  pgm.createIndex('tags', 'slug');

  // Create a join table for recipes and tags (many-to-many relationship)
  pgm.createTable('recipe_tags', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('uuid_generate_v4()') },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: 'recipes',
      onDelete: 'CASCADE',
    },
    tag_id: {
      type: 'uuid',
      notNull: true,
      references: 'tags',
      onDelete: 'CASCADE',
    },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
  });

  // Create a unique constraint to prevent duplicate tag assignments
  pgm.createConstraint('recipe_tags', 'recipe_tag_unique', {
    unique: ['recipe_id', 'tag_id'],
  });

  // Create indexes for faster lookups
  pgm.createIndex('recipe_tags', 'recipe_id');
  pgm.createIndex('recipe_tags', 'tag_id');

  // Create a function to update tag count
  pgm.createFunction(
    'update_tag_count',
    [],
    { language: 'plpgsql', returns: 'trigger' },
    `
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE tags SET count = count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
      ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET count = count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
      END IF;
      RETURN NULL;
    END;
    `,
  );

  // Create triggers to automatically update the tag count
  pgm.createTrigger('recipe_tags', 'update_tag_count_insert_trigger', {
    when: 'AFTER',
    operation: 'INSERT',
    level: 'ROW',
    function: 'update_tag_count',
  });

  pgm.createTrigger('recipe_tags', 'update_tag_count_delete_trigger', {
    when: 'AFTER',
    operation: 'DELETE',
    level: 'ROW',
    function: 'update_tag_count',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Drop triggers first
  pgm.dropTrigger('recipe_tags', 'update_tag_count_insert_trigger', { ifExists: true });
  pgm.dropTrigger('recipe_tags', 'update_tag_count_delete_trigger', { ifExists: true });

  // Drop function
  pgm.dropFunction('update_tag_count', [], { ifExists: true });

  // Drop tables
  pgm.dropTable('recipe_tags', { ifExists: true, cascade: true });
  pgm.dropTable('tags', { ifExists: true, cascade: true });
};
