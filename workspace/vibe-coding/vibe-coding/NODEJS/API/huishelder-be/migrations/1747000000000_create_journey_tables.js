/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Create Journey Tables Migration
 *
 * This migration creates all tables required for the "Your Home Journey" feature:
 * - user_journeys: Stores journey data for users
 * - milestones: Template milestones available in the system
 * - user_milestones: Milestones assigned to user journeys
 * - user_tasks: Tasks assigned to user milestones
 * - documents: Documents uploaded by users
 * - financial_summaries: Financial data for user journeys
 *
 * It also seeds the milestones table with default journey milestone types.
 */
exports.up = pgm => {
  // Create user_journeys table
  pgm.createTable('user_journeys', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    is_first_time_buyer: {
      type: 'boolean',
      notNull: true,
    },
    is_selling_current_home: {
      type: 'boolean',
      notNull: true,
    },
    has_bridge_loan: {
      type: 'boolean',
      notNull: true,
    },
    current_stage: {
      type: 'text',
      notNull: true,
    },
    journey_started_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });

  // Add index for user_id
  pgm.createIndex('user_journeys', 'user_id');

  // Create milestones table
  pgm.createTable('milestones', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    code: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    order_index: {
      type: 'integer',
      notNull: true,
    },
    is_optional: {
      type: 'boolean',
      default: false,
    },
  });

  // Create index for milestone code
  pgm.createIndex('milestones', 'code');

  // Create user_milestones table
  pgm.createTable('user_milestones', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_journey_id: {
      type: 'uuid',
      notNull: true,
      references: 'user_journeys(id)',
      onDelete: 'CASCADE',
    },
    milestone_id: {
      type: 'uuid',
      notNull: true,
      references: 'milestones(id)',
      onDelete: 'CASCADE',
    },
    is_complete: {
      type: 'boolean',
      default: false,
    },
    due_date: {
      type: 'date',
    },
    completed_at: {
      type: 'timestamp',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });

  // Create indexes for user_milestones
  pgm.createIndex('user_milestones', 'user_journey_id');
  pgm.createIndex('user_milestones', 'milestone_id');

  // Create documents table
  pgm.createTable('documents', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    type: {
      type: 'text',
      notNull: true,
    },
    filename: {
      type: 'text',
      notNull: true,
    },
    file_url: {
      type: 'text',
      notNull: true,
    },
    uploaded_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });

  // Create index for documents
  pgm.createIndex('documents', 'user_id');
  pgm.createIndex('documents', 'type');

  // Create user_tasks table
  pgm.createTable('user_tasks', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_milestone_id: {
      type: 'uuid',
      notNull: true,
      references: 'user_milestones(id)',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'text',
      notNull: true,
    },
    status: {
      type: 'text',
      default: "'PENDING'",
    },
    related_document_id: {
      type: 'uuid',
      references: 'documents(id)',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });

  // Create indexes for user_tasks
  pgm.createIndex('user_tasks', 'user_milestone_id');
  pgm.createIndex('user_tasks', 'status');
  pgm.createIndex('user_tasks', 'related_document_id');

  // Create financial_summaries table
  pgm.createTable('financial_summaries', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_journey_id: {
      type: 'uuid',
      notNull: true,
      references: 'user_journeys(id)',
      onDelete: 'CASCADE',
    },
    estimated_mortgage: {
      type: 'numeric(12,2)',
    },
    estimated_boeterente: {
      type: 'numeric(12,2)',
    },
    bridge_loan_needed: {
      type: 'numeric(12,2)',
    },
    monthly_gross: {
      type: 'numeric(12,2)',
    },
    monthly_net: {
      type: 'numeric(12,2)',
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });

  // Create index for financial_summaries
  pgm.createIndex('financial_summaries', 'user_journey_id');

  // Seed standard milestones
  pgm.sql(`
    INSERT INTO milestones (code, name, description, order_index, is_optional)
    VALUES 
      ('MORTGAGE_ADVICE', 'Get Mortgage Advice', 'Meet with a mortgage advisor to understand your options', 10, false),
      ('SIGN_KOOP', 'Sign Purchase Agreement', 'Sign the purchase agreement (koopcontract)', 20, false),
      ('SECURE_FINANCING', 'Secure Mortgage Financing', 'Finalize your mortgage with a lender', 30, false),
      ('SCHEDULE_NOTARY', 'Schedule Notary Appointment', 'Schedule your appointment at the notary', 40, false),
      ('FINAL_INSPECTION', 'Final Property Inspection', 'Perform the final property inspection', 50, false),
      ('KEY_TRANSFER', 'Key Transfer', 'Receive the keys to your new property', 60, false),
      ('SELL_CURRENT_HOME', 'Sell Current Home', 'Sell your current property', 25, true),
      ('ARRANGE_BRIDGE_LOAN', 'Arrange Bridge Loan', 'Set up a bridge loan if needed', 35, true)
  `);
};

exports.down = pgm => {
  // Drop tables in reverse order
  pgm.dropTable('financial_summaries');
  pgm.dropTable('user_tasks');
  pgm.dropTable('documents');
  pgm.dropTable('user_milestones');
  pgm.dropTable('milestones');
  pgm.dropTable('user_journeys');
};
