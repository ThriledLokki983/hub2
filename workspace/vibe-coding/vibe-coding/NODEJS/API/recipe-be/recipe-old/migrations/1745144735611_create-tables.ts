import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create users table with UUID primary key
  pgm.createTable('users', {
    id: { type: 'UUID', primaryKey: true },
    name: { type: 'VARCHAR(50)', notNull: true },
    email: { type: 'VARCHAR(255)', notNull: true, unique: true },
    password: { type: 'VARCHAR(255)', notNull: true },
    created_at: { type: 'TIMESTAMP WITH TIME ZONE', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'TIMESTAMP WITH TIME ZONE', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') }
  });

  // Add index on email for faster lookups
  pgm.createIndex('users', 'email');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
