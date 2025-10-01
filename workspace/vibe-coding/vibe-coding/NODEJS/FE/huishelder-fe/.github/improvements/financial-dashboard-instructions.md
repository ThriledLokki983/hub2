Excellent. Below is a comprehensive and structured implementation guide for the Frontend of the 📊 Financial Dashboard in the HuisHelder app, built with React + TypeScript + React Query + CSS Modules.

⸻

🎨 Financial Dashboard – Frontend Implementation Instructions (React + TS)

⸻

🎯 Goal

Develop a dynamic and user-friendly UI module that:
• Accepts user financial inputs related to buying/selling a home
• Sends the data to the backend via API
• Displays backend-calculated financial outputs (mortgage, boeterente, bridge loan, etc.)
• Presents the result in a clean, charted, responsive format
• Allows toggling options like NHG and scenario comparisons

⸻

🧱 Tech Stack
• Framework: React (with Hooks)
• Language: TypeScript
• Data Layer: React Query
• Styling: CSS Modules
• Charts: Recharts (or similar)
• Forms: Controlled components
• Validation: Yup or custom logic
• State: Form state via local useState + API state via React Query

⸻

🧩 UI Components Structure

📁 components/
│
├── FinancialDashboard/
│ ├── FinancialForm.tsx // User inputs form
│ ├── FinancialResults.tsx // Output display
│ ├── ResultCard.tsx // Reusable info card
│ ├── MortgageChart.tsx // Visual payment breakdown
│ ├── DashboardContainer.module.css
│ └── index.tsx // Wrapper

⸻

🖋️ Form Fields (Input Section)

Create a form with the following fields:

Label Field Name Type
Current home value (€) current_home_value number
Remaining mortgage (€) current_mortgage_left number
New home price (€) new_home_price number
Interest rate (%) interest_rate number
Fixed term (years) fixed_term_years number
Monthly income (€) monthly_income number
Extra savings (€) extra_savings number
Include NHG include_nhg boolean (toggle)

Add basic validation:
• All values must be positive numbers
• Interest rate should be between 0.1% and 10%
• Fixed term: 1–30 years

⸻

🔄 Form Submission Logic
• Use useMutation from React Query to submit the form:
• Endpoint: POST /api/financial-snapshot
• On success, store the output response and show FinancialResults
• On error, show a toast/snackbar with the error message

Example state:

const [formValues, setFormValues] = useState<FinancialInput>()
const [results, setResults] = useState<FinancialOutput | null>(null)

⸻

📤 API Payload and Response

Match these exactly with backend:

Payload (form submit):

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

Response (results):

{
"estimated_mortgage": 300000,
"estimated_boeterente": 5000,
"bridge_loan_amount": 100000,
"total_buyer_costs": 25000,
"monthly_payment_gross": 1350,
"monthly_payment_net": 1150
}

⸻

📊 Output Display Section (FinancialResults.tsx)

Display results in styled info cards:
• Mortgage needed
• Boeterente (penalty)
• Bridge loan amount
• Total buyer costs
• Monthly payment (gross/net)

Use a grid layout and apply color-coded hints:
• Green for affordable outcomes
• Yellow warning for high bridge loan
• Red for boeterente > €10k

⸻

📈 Visualizer (Optional v1)

Use a simple Recharts area or bar chart to show:
• Mortgage over time
• Bridge loan vs equity vs savings
• Monthly payment distribution

Make it toggleable:
• Show with or without NHG
• Adjust fixed term slider

⸻

🔐 Authentication Handling
• Require logged-in session to access this dashboard
• If not authenticated, redirect to login or show read-only simulation

⸻

🧪 Testing

Write component tests for:
• Form input validation
• Result rendering with mock data
• Error handling (API fail, missing fields)

Use test IDs and semantic markup for accessibility and test coverage.

⸻

✅ Deliverables Checklist
• Full form built with validation
• React Query mutation working
• Success output renders correctly
• Charts and breakdowns included
• Styles match minimalist app theme
• Mobile responsive layout
• All strings support Dutch/English toggle
• Unit-tested and QA-ready

⸻

Since the Journey feature (Timeline) is already implemented, the Financial Dashboard should be integrated as a natural next step in that guided experience. Here’s how a user would reach it:

⸻

🧭 User Flow: How to Access the Financial Dashboard

📍 Starting Point: Journey Timeline

On the timeline screen, the user sees key milestones such as:
• 📝 Get mortgage advice
• 💰 Arrange bridge loan
• 📄 Submit mortgage application

⸻

✅ Integration Point: After “Get Mortgage Advice”

Right after (or during) this step, trigger:

“Want to see how your numbers look? Try the Financial Dashboard.”

Use a CTA (Call to Action) card or timeline milestone like:

📊 Estimate your financial situation
Use the dashboard to calculate your mortgage need, buyer costs, and more.

CTA Button: Open Dashboard

⸻

📲 Navigation Options

Option 1: In Timeline
• Add a clickable milestone or “tool card”
• Label: "Financial Snapshot" or "See your numbers"
• Links to: /financial-dashboard

Option 2: From Sidebar / Main Menu
• Add “Financial Dashboard” to the main navigation
• Show a badge if user hasn’t completed it yet (🟡 “Pending”)

Option 3: Trigger from Checklist
• When the user reaches or completes "Get mortgage advice" or "Check bridge loan need", automatically suggest opening the dashboard via modal or toast

⸻

🔁 Return Loop

After completing the dashboard, show:
• ✅ Save snapshot (optional)
• 🔁 Link back to the Journey with updated progress
• 🎯 Suggestions like: "Now that you’ve calculated your mortgage need, move to the next step → ‘Arrange bridge loan’"

⸻

🗺 Recommended Route Path

Frontend route:

```
<Route path="/financial-dashboard" element={<FinancialDashboard />} />
```

Backend auth should restrict this to logged-in users. For simulations, allow anonymous mode with a toggle or “Try it without saving” button.
