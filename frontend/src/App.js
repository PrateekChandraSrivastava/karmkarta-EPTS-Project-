import "./App.css";
import React, { useEffect } from 'react'; // Removed useState
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
// import Dashboard from "./components/Dashboard"; // Removed unused import
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import AdminDashboard from "./components/AdminDashboard";
import EmployeesDashboard from "./components/EmployeesDashboard";
import EmployeeLayout from "./components/EmployeeLayout";
import ManagerDashboard from "./components/ManagerDashboard";
import KPIs from "./components/KPIs";
import EmployeeKPIs from "./components/EmployeeKPIs";
import Feedback from "./components/Feedback";
import Reports from "./components/Reports";
import CheckInOut from "./components/CheckInOut";
// import Card from "./components/Card"; // Removed unused import
// import Button from "./components/Button"; // Removed unused import
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import LeaveRequestPage from "./components/LeaveRequestPage";
import WorkFromHomeForm from "./components/WorkFromHomeForm";
import ProjectStatus from "./components/ProjectStatus";
import RaisedComplaint from "./components/RaisedComplaint";
import AdminComplaintManagement from "./components/AdminComplaintManagement";
import MyTasks from "./components/MyTasks";
import AdminLayout from "./components/AdminLayout";
import ManageEmployees from "./components/ManageEmployees";
import LeaveApprovals from "./components/LeaveApprovals";
import TaskManagement from "./components/TaskManagement";
import ManagerLayout from "./components/ManagerLayout";
import { jwtDecode } from 'jwt-decode';

// Component to handle default route redirection
const DefaultRoute = () => {
  const userRole = localStorage.getItem('userRole');

  switch (userRole) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'employee':
      return <Navigate to="/employee" replace />;
    default:
      return <Home />;
  }
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token); // Validate token structure/expiry on load
      } catch (error) {
        console.error("Invalid token on initial load:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        // Optionally, redirect to login if a bad token is found on load
        // window.location.href = '/login'; 
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DefaultRoute />
                </ProtectedRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/admin"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </RoleBasedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="kpis" element={<KPIs />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="employees" element={<ManageEmployees />} />
              <Route path="leaves" element={<LeaveApprovals />} />
              <Route path="reports" element={<Reports />} />
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="complaints" element={<AdminComplaintManagement />} />
            </Route>

            {/* Employee routes with Sidebar */}
            <Route
              path="/employee"
              element={
                <RoleBasedRoute allowedRoles={["employee"]}>
                  <EmployeeLayout />
                </RoleBasedRoute>
              }
            >
              <Route index element={<EmployeesDashboard />} />
              <Route path="check-in-out" element={<CheckInOut />} />
              <Route path="leave-request" element={<LeaveRequestPage />} />
              <Route path="work-from-home" element={<WorkFromHomeForm />} />
              <Route path="project-status" element={<ProjectStatus />} />
              <Route path="complaints" element={<RaisedComplaint />} />
              <Route path="my-tasks" element={<MyTasks />} />
            </Route>

            {/* Manager Routes */}
            <Route path="/manager" element={<ProtectedRoute><ManagerLayout /></ProtectedRoute>}>
              <Route index element={<ManagerDashboard />} />
              <Route path="employees" element={<ManageEmployees />} />
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="leaves" element={<LeaveApprovals />} />
              <Route path="reports" element={<Reports />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="complaints" element={<AdminComplaintManagement />} />
              <Route path="kpis" element={<KPIs />} />
            </Route>

            {/* Individual Employee KPI view with dynamic employeeId */}
            <Route
              path="/employee-kpis/:employeeId"
              element={
                <RoleBasedRoute allowedRoles={["admin", "manager"]}>
                  <EmployeeKPIsWrapper />
                </RoleBasedRoute>
              }
            />

            {/* Admin-only route for TaskManagement */}
            <Route
              path="/admin/tasks"
              element={
                <ProtectedRoute>
                  <TaskManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Wrapper to pass employeeId from URL params to EmployeeKPIs component
const EmployeeKPIsWrapper = () => {
  const { employeeId } = useParams();
  return <EmployeeKPIs employeeId={employeeId} />;
};

export default App;
