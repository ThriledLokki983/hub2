import { runMigrations } from '../database/migration.runner';

async function main() {
  const args = process.argv.slice(2);
  const direction = args[0] as 'up' | 'down';
  if (!['up', 'down'].includes(direction)) {
    console.error(
      'Usage: ts-node ./src/scripts/run-migrations.ts <up|down> [--to <migration>] [--count <number>] [--single-transaction]'
    );
    process.exit(1);
  }

  const options: { to?: string; count?: number; singleTransaction?: boolean } =
    {};
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--to' && args[i + 1]) {
      options.to = args[++i];
    } else if (arg === '--count' && args[i + 1]) {
      options.count = parseInt(args[++i], 10);
    } else if (arg === '--single-transaction') {
      options.singleTransaction = true;
    }
  }

  const success = await runMigrations(direction, options);
  process.exit(success ? 0 : 1);
}

main();
