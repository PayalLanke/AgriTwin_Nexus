import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MyFarmsPage from './pages/MyFarmsPage';
import AddFarmPage from './pages/AddFarmPage';
import ViewFarmPage from './pages/ViewFarmPage';
import EditFarmPage from './pages/EditFarmPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import SatellitePage from './pages/SatellitePage';
import WeatherPage from './pages/WeatherPage';
import PestRiskPage from './pages/PestRiskPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { authService } from './services/authService';

// Protected Route Guard for Farmer Session
function ProtectedRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/farmer/login" replace />;
  }
  return children;
}

// Protected Route Guard for Admin Session
function AdminProtectedRoute({ children }) {
  const adminUser = authService.getAdminUser();
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Homepage Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Farmer Auth Routes */}
        <Route path="/farmer/login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/farmer/login" replace />} />
        <Route path="/farmer/register" element={<RegisterPage />} />
        <Route path="/register" element={<Navigate to="/farmer/register" replace />} />

        {/* Administrator Auth & Workspace Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        {/* Farmer Dashboard & Platform Workspace */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/farms" element={<MyFarmsPage />} />
          <Route path="/farms/add" element={<AddFarmPage />} />
          <Route path="/farms/view/:id" element={<ViewFarmPage />} />
          <Route path="/farms/:id" element={<ViewFarmPage />} />
          <Route path="/farms/edit/:id" element={<EditFarmPage />} />

          {/* Module Analytical Routes (Global & Farm-Specific) */}
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/farms/:id/digital-twin" element={<DigitalTwinPage />} />
          
          <Route path="/satellite" element={<SatellitePage />} />
          <Route path="/farms/:id/satellite" element={<SatellitePage />} />
          
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/farms/:id/weather" element={<WeatherPage />} />

          <Route path="/crop-health" element={<DigitalTwinPage />} />
          <Route path="/farms/:id/crop-health" element={<DigitalTwinPage />} />

          <Route path="/pest-risk" element={<PestRiskPage />} />
          <Route path="/farms/:id/risk" element={<PestRiskPage />} />

          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/farms/:id/recommendations" element={<RecommendationsPage />} />

          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
