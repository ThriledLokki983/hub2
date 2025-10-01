'use strict';

const fs = require('fs');
const path = require('path');

const migrationName = path.basename(__filename, '.js');
const sqlPath = path.join(__dirname, `${migrationName}.sql`);

/**
 * Function to run SQL migration
 */
exports.up = function (pgm) {
  const sqlContent = fs.existsSync(sqlPath) ? fs.readFileSync(sqlPath, { encoding: 'utf8' }) : '';
  if (sqlContent) {
    pgm.sql(sqlContent);
  }

  // Add onboarding_completed column to users table
  pgm.addColumn('users', {
    onboarding_completed: {
      type: 'boolean',
      default: false,
    },
  });

  // Create user_onboarding table
  pgm.createTable('user_onboarding', {
    user_id: {
      type: 'uuid',
      primaryKey: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    goal: {
      type: 'text',
      notNull: true,
      check: "goal IN ('buying', 'selling', 'both', 'exploring')",
    },
    budget_min: {
      type: 'integer',
    },
    budget_max: {
      type: 'integer',
    },
    owns_home: {
      type: 'boolean',
    },
    has_existing_mortgage: {
      type: 'boolean',
    },
    timeline: {
      type: 'text',
      check: "timeline IN ('<3_months', '3_6_months', '6_12_months', 'just_looking')",
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
    },
  });
};

/**
 * Function to rollback migration
 */
exports.down = function (pgm) {
  pgm.dropTable('user_onboarding');
  pgm.dropColumn('users', 'onboarding_completed');
};
