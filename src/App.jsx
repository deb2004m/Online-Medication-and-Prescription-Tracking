// src/App.jsx

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Prescriptions from "./pages/Prescription";
import Reminders from "./pages/Reminder";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import PharmacistPrescriptions from "./pages/PharmacistPrescriptions";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTE */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

   {/* DOCTOR */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      {/* Pharmacist Inventory Dashboard */}
        <Route
          path="/pharmacist/inventory"
          element={
            <ProtectedRoute allowedRole="pharmacist">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacist/prescriptions"
          element={
            <ProtectedRoute allowedRole="pharmacist">
              <PharmacistPrescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacist/dashboard"
          element={<PharmacyDashboard />}
        />


          
        {/* Orders ROUTES */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRole="pharmacist">
              <Orders />
            </ProtectedRoute>
          }
        />
      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <Prescriptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
