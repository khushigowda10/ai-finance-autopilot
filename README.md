# AI Finance Autopilot

A full-stack personal finance web application that helps users manage transactions, create budgets, visualize financial activity, and receive automated financial insights.

## 📌 Overview

AI Finance Autopilot is a full-stack web application developed to simplify personal financial management.

The application allows users to securely register and log in, upload and manage financial transactions, organize spending into categories, create monthly budgets, visualize financial activity through dashboards, and receive automated insights based on their income, expenses, savings, and budget performance.

The project was developed collaboratively as a two-person project, with both contributors involved in research, planning, development, and testing.

## ✨ Key Features

### 🔐 Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected application routes

### 💳 Transaction Management
- Upload transactions through CSV files
- Parse and process transaction data
- Automatic transaction categorization
- Search transactions by description
- Filter transactions by category and type
- Sort transactions by date
- Transaction statistics

### 💰 Budget Management
- Create and update monthly budgets
- Track spending against budgets
- Category-wise budget monitoring
- Identify budgets approaching their limits
- Delete budgets when required

### 📊 Financial Dashboard
- Total income
- Total expenses
- Net savings
- Expense category breakdown
- Monthly income and expense analytics
- Visual representation of financial activity

### 🧠 Automated Financial Insights
The Insights section analyzes transaction and budget data to generate automated financial feedback.

It includes:
- Financial Health Score
- Savings Rate
- Savings Ratio
- Expense Ratio
- Highest spending category
- Budget warnings
- Budget performance indicators
- Contextual financial messages

The current implementation uses deterministic, rule-based financial analysis to ensure consistent results.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Recharts
- Framer Motion

### Backend
- Node.js
- Express.js
- PostgreSQL
- REST APIs
- JWT
- bcrypt
- Multer
- csv-parser
- dotenv
- CORS

## 🏗️ Application Architecture

```text
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
│   ├── uploads/
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
├── .gitignore
└── README.md
🧠 Insights Development

The project was initially explored with external AI APIs for financial insight generation during development.

Due to API reliability constraints, the final working implementation uses a deterministic rule-based approach for the Insights module.

The current system automatically analyzes financial data and generates useful feedback without making the application dependent on an external AI service.

This approach provides predictable and consistent results while keeping the financial analysis available even when external services are unavailable.

🔄 How Financial Insights Work

The Insights module follows this general flow:

Transactions + Budgets
          │
          ▼
   Financial Calculations
          │
          ├── Income
          ├── Expenses
          ├── Savings
          └── Savings Rate
          │
          ▼
   Spending Analysis
          │
          ├── Category Analysis
          └── Top Spending Category
          │
          ▼
    Budget Analysis
          │
          ├── Budget Usage
          ├── Near Limit
          └── Overspending
          │
          ▼
    Financial Health Score
          │
          ▼
     Smart Insights
🔒 Security

The application includes several security-related practices:

Passwords are hashed using bcrypt before being stored.
JWT tokens are used for authentication.
Protected backend routes require authentication.
Database queries use parameterized values.
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

Create a .env file inside the backend directory with the required database and authentication configuration.

Then start the backend server.

node server.js

The backend runs on:

http://localhost:5000
Frontend Setup

Open another terminal:

cd frontend
npm install
npm run dev

The frontend runs using the Vite development server.

🌐 Live Demo

Live Application:
https://ai-finance-autopilot.vercel.app

👥 Team & Contributions

This project was developed collaboratively by two contributors with shared responsibility for research, planning, development, integration, and testing.

VISHWAS

Primary contributions:

Login and authentication module
Dashboard module
Financial Insights module
Frontend and backend integration related to these modules
Testing and debugging

KHUSHI
Primary contributions:

Sign-up module
Budget management module
Transaction management module
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
Automated financial analysis
🔮 Future Scope

Potential improvements include:

More advanced AI-assisted financial recommendations
Improved spending prediction
Personalized financial planning
More detailed financial reports
Additional data visualization
Integration with financial services and APIs
👨‍💻 Contributors

Vishwas Hiremath
GitHub: https://github.com/Vishhhh99

Khushi Gowda
GitHub: https://github.com/khushigowda10

