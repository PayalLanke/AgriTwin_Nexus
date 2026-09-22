import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
import YieldPage from './pages/YieldPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { authService } from './services/authService';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Flow Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Full AgriTwin Platform SaaS Layout Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="farms" element={<MyFarmsPage />} />
          <Route path="farms/add" element={<AddFarmPage />} />
          <Route path="farms/view/:id" element={<ViewFarmPage />} />
          <Route path="farms/edit/:id" element={<EditFarmPage />} />
          
          {/* Modules 7-10+ Analytical Routes */}
          <Route path="digital-twin" element={<DigitalTwinPage />} />
          <Route path="satellite" element={<SatellitePage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="pest-risk" element={<PestRiskPage />} />
          <Route path="yield" element={<YieldPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
