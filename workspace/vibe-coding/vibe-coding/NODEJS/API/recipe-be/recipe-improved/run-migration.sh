#!/bin/bash

# Run the migration directly with explicit connection parameters
# Replace 'postgres' with your actual database name
npx node-pg-migrate up \
  --host=localhost \
  --port=5432 \
  --database=postgres \
  --user=gnimoh001

echo "Migration completed!"
