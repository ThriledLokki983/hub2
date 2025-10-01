/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE financial_inputs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      current_home_value INTEGER NOT NULL,
      current_mortgage_left INTEGER NOT NULL,
      new_home_price INTEGER NOT NULL,
      interest_rate NUMERIC(5,2) NOT NULL,
      fixed_term_years INTEGER NOT NULL,
      monthly_income INTEGER NOT NULL,
      include_nhg BOOLEAN NOT NULL,
      extra_savings INTEGER NOT NULL
    );

    CREATE TABLE financial_outputs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      input_id UUID UNIQUE REFERENCES financial_inputs(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      estimated_mortgage INTEGER NOT NULL,
      estimated_boeterente INTEGER NOT NULL,
      bridge_loan_amount INTEGER NOT NULL,
      total_buyer_costs INTEGER NOT NULL,
      monthly_payment_gross INTEGER NOT NULL,
      monthly_payment_net INTEGER NOT NULL
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.sql(`
    DROP TABLE financial_outputs;
    DROP TABLE financial_inputs;
  `);
};
