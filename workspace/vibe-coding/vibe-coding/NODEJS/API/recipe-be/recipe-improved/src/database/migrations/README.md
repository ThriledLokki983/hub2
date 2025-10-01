# Database Migrations

This project uses [node-pg-migrate](https://github.com/salsita/node-pg-migrate) for database migrations.

## Migration Commands

All commands should be run from the project root directory:

- **Create a new migration:**
  ```
  npm run migrate:create my_migration_name
  ```

- **Run all pending migrations:**
  ```
  npm run migrate:up
  ```

- **Roll back the last migration:**
  ```
  npm run migrate:down
  ```

- **Roll back multiple migrations:**
  ```
  npm run migrate:down 3  # Rolls back 3 migrations
  ```

- **Check migration status:**
  ```
  npm run migrate:status
  ```

## Best Practices

### 1. Always include DOWN migrations

Always implement the `down()` function for every migration to enable rolling back changes if needed. Down migrations should reverse the changes made in the corresponding `up()` function.

### 2. Use Transactions

Migrations now run in transactions by default (configured in database.json). This ensures that if any part of a migration fails, all changes from that migration are rolled back, keeping your database in a consistent state.

### 3. Use Descriptive Names

Give your migrations descriptive names that clearly indicate what they do:
```
npm run migrate:create add_user_verification_fields
```

### 4. Test Migrations

Before deploying to production, test your migrations in a development or staging environment to ensure they work correctly.

### 5. Use Shorthands

Define common column types as shorthands to make your migrations cleaner and more maintainable:

```javascript
exports.shorthands = {
  id: { type: 'serial', primaryKey: true },
  timestamps: {
    created_at: { type: 'timestamp', notNull: true, default: 'now()' },
    updated_at: { type: 'timestamp', notNull: true, default: 'now()' }
  }
};
```

### 6. One Logical Change Per Migration

Each migration should make one logical change to the database schema. This makes it easier to understand, debug, and roll back if necessary.
