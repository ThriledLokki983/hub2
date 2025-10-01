import { createMigration } from '../database/migration.runner';

async function main() {
  const [, , name] = process.argv;
  if (!name) {
    console.error('Migration name is required');
    process.exit(1);
  }

  const success = await createMigration(name);
  process.exit(success ? 0 : 1);
}

main();
