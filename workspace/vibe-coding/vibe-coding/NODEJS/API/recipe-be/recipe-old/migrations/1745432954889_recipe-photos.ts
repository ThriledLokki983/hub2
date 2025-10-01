import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create the recipe_photos table
  pgm.createTable('recipe_photos', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: '"recipes"',
      onDelete: 'CASCADE',
    },
    photo_url: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add an index on the recipe_id for faster lookups
  pgm.createIndex('recipe_photos', 'recipe_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Drop the recipe_photos table
  pgm.dropTable('recipe_photos');
}
