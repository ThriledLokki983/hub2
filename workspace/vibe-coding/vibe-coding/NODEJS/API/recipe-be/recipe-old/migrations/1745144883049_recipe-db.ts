import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create recipes table with UUID primary key
  pgm.createTable('recipes', {
    id: { type: 'UUID', primaryKey: true },
    name: { type: 'VARCHAR(50)', notNull: true },
    description: { type: 'VARCHAR(500)', notNull: true },
    created_at: { type: 'TIMESTAMP WITH TIME ZONE', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'TIMESTAMP WITH TIME ZONE', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') }
  });

  // Create ingredients table
  pgm.createTable('ingredients', {
    id: { type: 'UUID', primaryKey: true },
    recipe_id: { type: 'UUID', notNull: true, references: 'recipes(id)', onDelete: 'CASCADE' },
    ingredient_text: { type: 'VARCHAR(255)', notNull: true }
  });

  // Create instructions table
  pgm.createTable('instructions', {
    id: { type: 'UUID', primaryKey: true },
    recipe_id: { type: 'UUID', notNull: true, references: 'recipes(id)', onDelete: 'CASCADE' },
    instruction_text: { type: 'TEXT', notNull: true },
    step_order: { type: 'INTEGER', notNull: true }
  });

  // Create indexes for faster lookups
  pgm.createIndex('ingredients', 'recipe_id');
  pgm.createIndex('instructions', 'recipe_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('instructions');
  pgm.dropTable('ingredients');
  pgm.dropTable('recipes');
}
