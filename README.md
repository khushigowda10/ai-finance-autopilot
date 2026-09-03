AI Finance Autopilot

A full-stack personal finance web application that helps users manage transactions, create budgets, visualize financial activity, and receive automated financial insights — combining real AI-generated analysis with a deterministic rule-based fallback.

📌 Overview

AI Finance Autopilot is a full-stack web application developed to simplify personal financial management.

The application allows users to securely register and log in, upload and manage financial transactions, organize spending into categories, create monthly budgets, visualize financial activity through dashboards, and receive automated insights based on their income, expenses, savings, and budget performance.

The project was developed collaboratively as a two-person project, with both contributors involved in research, planning, development, and testing.

✨ Key Features

🔐 Authentication

User registration and login
Password hashing using bcrypt
JWT-based authentication
Protected application routes
Rate limiting on login and signup to mitigate brute-force attempts
💳 Transaction Management
Upload transactions through CSV files
Parse and process transaction data
Automatic transaction categorization
Search transactions by description
Filter transactions by category and type
Sort transactions by date
Transaction statistics

💰 Budget Management

Create and update monthly budgets
Track spending against budgets
Category-wise budget monitoring
Identify budgets approaching their limits
Delete budgets when required

📊 Financial Dashboard

Total income
Total expenses
Net savings
Expense category breakdown
Monthly income and expense analytics
Visual representation of financial activity

🧠 AI-Powered Financial Insights (with rule-based fallback)

The Insights module combines backend-calculated financial data with a real external AI model to generate natural-language financial feedback, while preserving a fully deterministic fallback for reliability.

All numerical calculations — income, expenses, savings, savings rate, category breakdowns, and budget status — are always computed by the backend directly from PostgreSQL. The AI model never performs financial calculations itself; it only receives a structured summary of numbers already computed by the backend and generates a short, natural-language observation and suggestion based on them.

It includes:

Financial Health Score
Savings Rate
Savings Ratio
Expense Ratio
Highest spending category
Budget warnings
Budget performance indicators
AI-generated contextual financial messages, with automatic fallback to rule-based messages if the AI is unavailable

🛠️ Tech Stack

Frontend
React
Vite
Tailwind CSS
Axios
Recharts
Framer Motion
Backend
Node.js
Express.js
PostgreSQL
REST APIs
JWT
bcrypt
Multer
csv-parser
dotenv
CORS
express-rate-limit
@google/generative-ai (Gemini API)
Testing & Quality
Jest
Supertest
k6 (load testing)

🏗️ Application Architecture

                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      + Vite          │
                    └──────────┬───────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication    Transactions       Budgets
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │       Database       │
                    └──────────────────────┘


🧠 AI Insights Architecture

                User Financial Data
                        │
                        ▼
          Existing PostgreSQL Queries
       (income, expenses, savings, budgets)
                        │
                        ▼
          Structured Financial Summary
                        │
                        ▼
                  Gemini AI API
             (gemini-3.6-flash, minimal
              thinking, 8s timeout)
                        │
             ┌──────────┴──────────┐
             │                     │
        AI succeeds           AI fails / times out
             │                     │
             ▼                     ▼
   AI-generated insight   Rule-based fallback insight
             │                     │
             └──────────┬──────────┘
                        ▼
              Returned to frontend
           with a "source" field:
           "ai" or "fallback"


📂 Project Structure

ai-finance-autopilot/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── services/
│   │   └── insightsEngine.js
│   │
│   ├── tests/
│   │   └── api.test.js
│   │
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Budgets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Transactions.jsx
│   │   │
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── loadtest.js
├── loadtest-login.js
├── .gitignore
└── README.md

🧠 Insights Development

The project was initially explored with external AI APIs for financial insight generation during development. Early attempts were unreliable, so a deterministic rule-based system was built as a dependable baseline.

The current implementation integrates the Gemini API (gemini-3.6-flash) as the primary source of financial insights, while retaining the original rule-based engine as a permanent, automatic fallback. All financial calculations (income, expenses, savings, savings rate, category breakdowns, budget status) are performed by the backend using PostgreSQL — the AI model only receives this pre-calculated summary and generates natural-language observations and suggestions from it. The AI does not perform any of the underlying financial math itself.

If the AI request fails, times out, or is not configured, the system automatically falls back to the original rule-based insight with no interruption to the user.

🔄 How Financial Insights Work


Transactions + Budgets
          │
          ▼
   Financial Calculations (PostgreSQL)
          │
          ├── Income
          ├── Expenses
          ├── Savings
          └── Savings Rate
          │
          ▼
   Spending & Budget Analysis
          │
          ├── Top Spending Category
          ├── Budget Usage
          └── Overspending / Near-Limit Categories
          │
          ▼
   Structured Financial Summary
          │
          ▼
     Gemini AI API Call (8s timeout)
          │
     ┌────┴────┐
     ▼         ▼
  Success    Failure/Timeout
     │         │
     ▼         ▼
AI Insight  Rule-Based Insight
     │         │
     └────┬────┘
          ▼
  Returned with "source": "ai" or "fallback"

🚦 Rate Limiting


To protect against abuse and manage external API usage, the backend applies two tiers of rate limiting using express-rate-limit:

Endpoint(s)	Limit	Reasoning
/auth/login, /auth/signup	5 requests / 15 minutes per IP	Strict limit to mitigate brute-force login attempts and signup abuse
/dashboard/insights	10 requests / minute per IP	Moderate limit to protect the Gemini API's free-tier quota from being exhausted by rapid repeated requests

Both limiters were verified under real concurrent load using k6 (see Load Testing below) and correctly reject excess requests with a 429 response and a descriptive message, rather than silently failing or crashing.

🧪 Automated Testing


A small, focused backend test suite was built using Jest and Supertest, covering the most meaningful behaviors rather than aiming for full coverage:

Test	Verifies
Login with wrong credentials	Returns 401/404, not a crash or 500
Protected route with no token (/dashboard/insights)	Returns 401
Protected route with no token (/transactions)	Returns 401
Login with correct credentials	Returns a valid JWT
Insights endpoint with valid token	Returns 200 with a source field of either "ai" or "fallback"

Tests run against the real local development database using read-only or non-destructive requests only — no test data is created, modified, or deleted, so there is no risk to existing data. The AI-dependent test uses an extended timeout (15s) to accommodate real-world API latency variance, and intentionally accepts either "ai" or "fallback" as a valid, successful outcome — reflecting the system's actual graceful-degradation design rather than assuming the AI will always respond.

Run tests with:
cd backend
npm test

⚡ Load Testing


Load testing was performed using k6, targeting the backend directly on localhost, with a small, controlled scenario appropriate for a portfolio project (not a claim of production-scale capacity).

Scenario 1 — Dashboard endpoint under load
10 virtual users, 30 seconds, targeting /dashboard/finance-overview after a single shared login.

Metric	Result
Total requests	300
Success rate	100% (0 errors)
Requests/sec	~9.7
Average response time	12.95 ms
p95 latency	12.57 ms

Scenario 2 — Auth rate limiter under concurrent load
2 virtual users, 10 seconds, repeatedly attempting /auth/login with invalid credentials, to verify the rate limiter holds up under concurrent (not just sequential) requests.

Result: all requests received a valid response (a mix of normal auth errors and 429 rate-limit responses once the threshold was reached), confirming the limiter functions correctly under concurrent load.

Note: the AI insights endpoint (/dashboard/insights) was deliberately excluded from repeated load testing to avoid exhausting the Gemini API's free-tier quota during testing. Its real-world latency (observed between ~3s and ~20s depending on API load) is handled by the 8-second timeout and automatic fallback described above, rather than by load-testing it directly.

These are the actual results of a specific, small, controlled test — not a claim about how the application would perform at large scale in production.

🔒 Security


The application includes several security-related practices:

Passwords are hashed using bcrypt before being stored.
JWT tokens are used for authentication.
Protected backend routes require authentication.
Database queries use parameterized values.
Rate limiting on authentication and AI endpoints, verified under load.
The Gemini API key is stored only in backend environment variables and is never exposed to the frontend or included in any client-side response.
Environment variables are used for sensitive configuration.
.env files are excluded from version control.

Never commit database credentials, JWT secrets, API keys, or other sensitive environment variables to the repository.

🚀 Getting Started
Prerequisites


Make sure you have installed:

Node.js
npm
PostgreSQL
Clone the repository
git clone https://github.com/khushigowda10/ai-finance-autopilot.git


cd ai-finance-autopilot
Backend Setup
cd backend
npm install

Create a .env file inside the backend directory with the following variables:

DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=ai_finance_autopilot
DB_PASSWORD=your_postgres_password
DB_PORT=5432
DATABASE_URL=postgres://username:password@localhost:5432/ai_finance_autopilot
JWT_SECRET=your_jwt_secret
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key

(TEST_USER_EMAIL and TEST_USER_PASSWORD can optionally be added for running the automated test suite against a real account.)

Then start the backend server.

node server.js

The backend runs on:

http://localhost:5000
Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

Create a .env file inside the frontend directory (optional — defaults to the deployed backend if omitted):

VITE_API_URL=http://localhost:5000

The frontend runs using the Vite development server.


🌐 Live Demo

Live Application:
https://ai-finance-autopilot.vercel.app


⚠️ Known Limitations

The AI insights endpoint's response time varies with external API load (observed ~3–20 seconds); the fallback mechanism ensures the user always receives a usable insight regardless.
Rate limiting uses in-memory storage, which resets on server restart and does not share state across multiple server instances — sufficient for this project's scale, but a production deployment across multiple instances would require a shared store such as Redis.
The Insights page currently performs some of its own client-side financial calculations independently of the backend's insights summary; a future refactor could have it consume the backend's structured summary directly for full consistency.


👥 Team & Contributions

This project was developed collaboratively by two contributors with shared responsibility for research, planning, development, integration, and testing.

VISHWAS
Primary contributions:

Login and authentication module
Dashboard module
AI-powered Financial Insights module (Gemini integration with rule-based fallback)
Rate limiting
Frontend and backend integration related to these modules
Testing and debugging

KHUSHI
Primary contributions:

Sign-up module
Budget management module
Transaction management module
Automated testing (Jest/Supertest) and load testing (k6)
Frontend and backend integration related to these modules
Testing and debugging

Both contributors participated in the overall project research, planning, development discussions, and testing.

🎯 Project Goals

The project was built to demonstrate practical experience in:

Full-stack web development
React-based frontend development
REST API development
PostgreSQL database integration
Authentication and authorization
Financial data processing
Data visualization
CSV processing
API-based application architecture
Integrating external AI APIs with graceful degradation
Rate limiting and API abuse protection
Automated testing and load testing

🔮 Future Scope

Potential improvements include:

OTP-based mobile login as an alternative to email/password, using a provider such as Twilio, to improve UX for repeat logins
More advanced AI-assisted financial recommendations (e.g. multi-month trend analysis)
Improved spending prediction
Personalized financial planning
More detailed financial reports
Additional data visualization
Integration with financial services and APIs
Migrating to Google's newer @google/genai SDK once time allows (the project currently uses the now-deprecated @google/generative-ai package, which remains functional for the single-call use case here)
Shared rate-limit storage (e.g. Redis) for multi-instance production deployments

👨‍💻 Contributors

Vishwas Hiremath
GitHub: https://github.com/Vishhhh99

Khushi Gowda
GitHub: https://github.com/khushigowda10
