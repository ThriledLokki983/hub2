Certainly. Below is a single, consolidated, and production-level backend implementation instruction for an AI agent to create the 📊 Financial Dashboard feature in the HuisHelder app, using Node.js + PostgreSQL + Prisma, now including a normalized two-table schema.

⸻

📊 Feature: Financial Dashboard – Backend Implementation (AI-Ready Instructions)

⸻

🎯 Objective

Create a secure and modular backend feature to:
	•	Accept user-submitted financial data (current home, new home, income, etc.)
	•	Perform backend-side calculations for mortgage, boeterente, bridge loan, and costs
	•	Store both inputs and outputs in a normalized structure
	•	Return a clean JSON response for frontend visualization
	•	Support user snapshot history and future advisor comparison use

⸻

🧱 Stack Requirements
	•	Runtime: Node.js (v18+)
	•	Framework: Express.js
	•	Database: PostgreSQL
	•	ORM: Prisma
	•	Authentication: JWT (user-scoped access)
	•	Docs: Swagger (OpenAPI 3.0)
	•	Testing: Jest or Supertest
	•	Containerization (optional): Docker

⸻

📂 Database Schema (PostgreSQL)

✅ Enable Extension

Before anything, ensure UUID generation is enabled:

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


⸻

📄 Table 1: financial_inputs

Stores raw user-submitted data for each financial scenario.

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


⸻

📄 Table 2: financial_outputs

Stores derived results linked to a specific financial input.

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


⸻

🔐 Security
	•	Use existing JWT-based auth middleware.
	•	Associate each input/output record with the authenticated user.
	•	Only allow users to access or view their own snapshots (unless advisor role is enabled).

⸻

📤 API Endpoints

1. POST /api/financial-snapshot

Purpose: Accept financial input, compute backend results, and store both input & output.

Expected JSON Body

{
  "current_home_value": 450000,
  "current_mortgage_left": 300000,
  "new_home_price": 600000,
  "interest_rate": 3.5,
  "fixed_term_years": 20,
  "monthly_income": 5500,
  "include_nhg": true,
  "extra_savings": 20000
}

Response Example

{
  "estimated_mortgage": 300000,
  "estimated_boeterente": 5000,
  "bridge_loan_amount": 100000,
  "total_buyer_costs": 25000,
  "monthly_payment_gross": 1350,
  "monthly_payment_net": 1150
}


⸻

🧠 Calculation Logic (Backend Only)

1. Equity

equity = current_home_value - current_mortgage_left

2. Bridge Loan Amount

bridge_loan = max(0, new_home_price - equity - extra_savings)

3. Mortgage Needed

estimated_mortgage = bridge_loan

4. Boeterente Estimate

estimated_boeterente = round(1% of current_mortgage_left)

5. Total Buyer Costs (Rule-of-thumb)

total_buyer_costs = round(5% of new_home_price)

6. Monthly Payment (Annuity)

Use the standard formula:

monthly_payment_gross = (P * r) / (1 - (1 + r)^-n)

Where:
	•	P = estimated_mortgage
	•	r = monthly interest rate (interest_rate / 12 / 100)
	•	n = total months (fixed_term_years * 12)

7. Net Monthly Estimate

monthly_payment_net = round(monthly_payment_gross * 0.85)


⸻

🛠 Task Implementation Steps

Step 1: Add Prisma models based on the table schema

Mirror the above SQL schema in prisma/schema.prisma

Step 2: Implement Calculation Utility

Build a service function that takes financial inputs and returns computed output

Step 3: Create the Express Route
	•	Accept POST request with JSON body
	•	Validate inputs
	•	Perform calculations
	•	Save both input and output records in a transaction
	•	Return output as response

Step 4: Secure the Route
	•	Use existing JWT middleware
	•	Attach authenticated user ID to the stored records

Step 5: Swagger Documentation

Document the request/response schemas for this endpoint in OpenAPI format

Step 6: Tests
	•	Unit test the calculation logic with multiple input scenarios
	•	Integration test the POST route (valid/invalid data, unauthorized access)

⸻

✅ Deliverables Checklist
	•	Database tables created and migrated
	•	Prisma models updated
	•	Calculation utility implemented
	•	POST /api/financial-snapshot endpoint created
	•	Inputs and outputs saved in DB
	•	Swagger docs updated
	•	Route secured with user-based access
	•	Tests implemented and passing

⸻
