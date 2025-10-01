import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // First rename the old description column to name
  pgm.renameColumn('ingredients', 'description', 'name');

  // Add the new columns
  pgm.addColumns('ingredients', {
    amount: { type: 'VARCHAR(100)' },
    notes: { type: 'VARCHAR(255)' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Remove the new columns
  pgm.dropColumns('ingredients', ['amount', 'notes']);

  // Rename name back to description
  pgm.renameColumn('ingredients', 'name', 'description');
}
