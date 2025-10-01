'use strict';
const { v4: uuidv4 } = require('uuid');

exports.up = pgm => {
  // Create recipe_ratings table
  pgm.createTable('recipe_ratings', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: '"recipes"',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    rating: {
      type: 'integer',
      notNull: true,
      check: 'rating >= 1 AND rating <= 5',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  // Create unique constraint to ensure a user can only rate a recipe once
  pgm.createConstraint('recipe_ratings', 'recipe_user_unique', 'UNIQUE(recipe_id, user_id)');

  // Create recipe_comments table
  pgm.createTable('recipe_comments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: '"recipes"',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    comment: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    deleted_at: {
      type: 'timestamp',
    },
  });

  // Create indexes for faster lookups
  pgm.createIndex('recipe_ratings', 'recipe_id');
  pgm.createIndex('recipe_ratings', 'user_id');
  pgm.createIndex('recipe_comments', 'recipe_id');
  pgm.createIndex('recipe_comments', 'user_id');

  // Add a trigger to update recipe's average_rating when ratings are added, updated, or deleted
  pgm.createFunction(
    'update_recipe_average_rating',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
    },
    `
    BEGIN
      UPDATE recipes
      SET
        average_rating = (
          SELECT COALESCE(AVG(rating), 0)
          FROM recipe_ratings
          WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
        ),
        ratings_count = (
          SELECT COUNT(*)
          FROM recipe_ratings
          WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
        ),
        updated_at = NOW()
      WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
      RETURN NULL;
    END;
    `,
  );

  // Create triggers for recipe_ratings table
  pgm.createTrigger('recipe_ratings', 'update_recipe_rating_after_insert', {
    when: 'AFTER',
    operation: ['INSERT'],
    level: 'ROW',
    function: 'update_recipe_average_rating',
  });

  pgm.createTrigger('recipe_ratings', 'update_recipe_rating_after_update', {
    when: 'AFTER',
    operation: ['UPDATE'],
    level: 'ROW',
    function: 'update_recipe_average_rating',
  });

  pgm.createTrigger('recipe_ratings', 'update_recipe_rating_after_delete', {
    when: 'AFTER',
    operation: ['DELETE'],
    level: 'ROW',
    function: 'update_recipe_average_rating',
  });
};

exports.down = pgm => {
  // Drop triggers first
  pgm.dropTrigger('recipe_ratings', 'update_recipe_rating_after_insert');
  pgm.dropTrigger('recipe_ratings', 'update_recipe_rating_after_update');
  pgm.dropTrigger('recipe_ratings', 'update_recipe_rating_after_delete');

  // Drop function
  pgm.dropFunction('update_recipe_average_rating', []);

  // Drop tables
  pgm.dropTable('recipe_comments');
  pgm.dropTable('recipe_ratings');
};
