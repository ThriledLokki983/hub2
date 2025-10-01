-- If Exists Table Drop
DROP TABLE IF EXISTS users cascade;
-- ================
--   TABLE [users]
-- ================
-- create users table
CREATE TABLE users(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "address" VARCHAR(255),
    "role" TEXT CHECK (role IN ('user', 'advisor')) DEFAULT 'user',
    "language_preference" TEXT CHECK (language_preference IN ('en', 'nl')) DEFAULT 'en',
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc'),
    "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc'),
    "deleted_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc'),
    "is_active" BOOLEAN DEFAULT TRUE
);
