#!/bin/bash

# Get database connection details from .env file
source .env

echo "🔄 Running database schema fix script against Docker PostgreSQL container..."

# Copy the SQL script into the container
docker cp fix-migration-errors.sql pg:/tmp/fix-migration-errors.sql

# Execute the SQL script inside the container
docker exec -i pg psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-huishelder} -f /tmp/fix-migration-errors.sql

# Print success message
echo "✅ Database schema fix script executed. Migration issues should be resolved."
