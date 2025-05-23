
# Employee Performance Tracking System

This repository contains a prototype Employee Performance Tracking System built with:
- **Backend:** Node.js, Express, Sequelize, PostgreSQL
- **Frontend:** React.js, Chart.js (via react-chartjs-2)
- **Authentication:** JWT, bcrypt

The system supports:
- User registration and login with role-based access (admin, manager, employee)
- Employee management (users & employees are maintained)
- KPI tracking and visualization (input form, tables, and charts)
- Feedback system (submit and view feedback)
- Basic reports (aggregated KPI data)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features

- **User Authentication:** Registration and login with secure password hashing and JWT.
- **Role-Based Access:** Different dashboards and functionality for admin, manager, and employee roles.
- **KPI Tracking:** Input and view KPIs with a table and interactive charts.
- **Feedback System:** Submit and view feedback entries.
- **Reports:** Generate aggregated reports (e.g., average KPI scores per month).

## Tech Stack

- **Backend:** Node.js, Express, Sequelize, PostgreSQL
- **Frontend:** React.js, Chart.js, react-chartjs-2
- **Authentication:** JWT, bcrypt

## Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** installed and running
- A GitHub account for cloning the repository

### Environment Variables

Create a `.env` file in the `backend` folder. (Do not commit your `.env` file; use the provided `.env.example` as a guide.)

Example `.env` file:

```
DB_NAME=employee_tracking_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Database Setup

1. **Create the Database:**  
   Open your PostgreSQL client (e.g., pgAdmin or psql) and create a new database:
   ```sql
   CREATE DATABASE employee_tracking_db;
   ```

2. **Database Schema:**  
   The project uses Sequelize to sync models with the database. When you run the backend server, Sequelize will automatically create/update the necessary tables based on the model definitions.
   
3. **Optional: Seed Data**  
   You can create seed scripts (or manually insert dummy data) for users, employees, KPIs, and feedback for testing purposes.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   From the `backend` directory:
   ```bash
   npm start
   ```
   The backend server will run on [http://localhost:5000](http://localhost:5000).

2. **Start the Frontend Application:**
   From the `frontend` directory:
   ```bash
   npm start
   ```
   The React app will open in your browser at [http://localhost:3000](http://localhost:3000).

## Usage

- **Registration:**  
  Go to [http://localhost:3000/register](http://localhost:3000/register) to register a new user.  
  - For employees, fill in extra fields (email, department, position, manager ID).

- **Login:**  
  Go to [http://localhost:3000/login](http://localhost:3000/login) to log in.

- **Dashboard:**  
  After login, you are redirected to your dashboard.  
  - Access role-specific pages (e.g., `/admin`, `/manager`, `/employee`) based on your role.

- **KPI Tracking:**  
  Navigate to `/kpis` (manager only) to input and view KPIs.
  - Use the dropdown to filter KPIs by individual employee.
  - View KPI trends in the chart.

- **Feedback:**  
  Go to `/feedback` (manager/admin only) to submit feedback and view existing entries.

- **Reports:**  
  Access `/reports` (if implemented) to view aggregated KPI reports.

## Project Structure

```
employee-tracking-system/
├── backend/
│   ├── config.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Employee.js
│   │   ├── Feedback.js
│   │   ├── Goal.js
│   │   ├── PerformanceMetric.js
│   │   ├── Task.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── feedback.js
│   │   ├── goals.js
│   │   ├── performanceMetrics.js
│   │   ├── reports.js
│   │   └── tasks.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Feedback.js
│   │   │   ├── KPIChart.js
│   │   │   ├── KPIs.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ... other components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .gitignore
└── README.md
```

## Future Improvements

- Add more detailed data validations and error handling.
- Improve UI/UX using a CSS framework (Bootstrap, Tailwind CSS, etc.).
- Implement migrations for better database schema management.
- Expand reporting features with more aggregated metrics and charts.

## License

Include your license information here (e.g., MIT License).

---


