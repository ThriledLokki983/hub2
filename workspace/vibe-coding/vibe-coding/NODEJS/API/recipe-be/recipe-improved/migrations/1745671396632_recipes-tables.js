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

  // Create recipes table
  pgm.createTable('recipes', {
    id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true,
      primaryKey: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    slug: {
      type: 'varchar(255)',
      unique: true,
    },
    description: {
      type: 'text',
    },
    image: {
      type: 'varchar(255)',
    },
    chef: {
      type: 'varchar(100)',
    },
    category: {
      type: 'varchar(100)',
    },
    tags: {
      type: 'text[]',
      default: '{}',
    },
    prep_time: {
      type: 'integer',
    },
    cook_time: {
      type: 'integer',
    },
    total_time: {
      type: 'integer',
    },
    servings: {
      type: 'integer',
    },
    difficulty: {
      type: 'varchar(50)',
    },
    calories: {
      type: 'integer',
    },
    protein: {
      type: 'integer',
    },
    fat: {
      type: 'integer',
    },
    carbohydrates: {
      type: 'integer',
    },
    status: {
      type: 'varchar(20)',
      default: 'published',
    },
    is_public: {
      type: 'boolean',
      default: true,
    },
    average_rating: {
      type: 'numeric(2,1)',
      default: 0.0,
    },
    ratings_count: {
      type: 'integer',
      default: 0,
    },
    views: {
      type: 'integer',
      default: 0,
    },
    source: {
      type: 'varchar(255)',
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

  // Create recipe_ingredients table
  pgm.createTable('recipe_ingredients', {
    id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true,
      primaryKey: true,
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: 'recipes(id)',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    quantity: {
      type: 'varchar(100)',
    },
    unit: {
      type: 'varchar(50)',
    },
    notes: {
      type: 'text',
    },
    order_index: {
      type: 'integer',
      default: 0,
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
  });

  // Create recipe_instructions table
  pgm.createTable('recipe_instructions', {
    id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true,
      primaryKey: true,
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: 'recipes(id)',
      onDelete: 'CASCADE',
    },
    step_number: {
      type: 'integer',
      notNull: true,
    },
    instruction: {
      type: 'text',
      notNull: true,
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
  });

  // Create recipe_photos table
  pgm.createTable('recipe_photos', {
    id: {
      type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true,
      primaryKey: true,
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: 'recipes(id)',
      onDelete: 'CASCADE',
    },
    file_path: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_size: {
      type: 'integer',
    },
    mime_type: {
      type: 'varchar(100)',
    },
    is_primary: {
      type: 'boolean',
      default: false,
    },
    created_at: {
      type: 'timestamp with time zone',
      default: pgm.func('NOW()'),
      notNull: true,
    },
  });

  // Create indexes for faster lookups
  pgm.createIndex('recipes', 'user_id');
  pgm.createIndex('recipes', 'slug');
  pgm.createIndex('recipes', 'category');
  pgm.createIndex('recipe_ingredients', 'recipe_id');
  pgm.createIndex('recipe_instructions', ['recipe_id', 'step_number']);
  pgm.createIndex('recipe_photos', 'recipe_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Drop tables in reverse order to avoid foreign key constraints
  pgm.dropTable('recipe_photos', { ifExists: true });
  pgm.dropTable('recipe_instructions', { ifExists: true });
  pgm.dropTable('recipe_ingredients', { ifExists: true });
  pgm.dropTable('recipes', { ifExists: true });
};
