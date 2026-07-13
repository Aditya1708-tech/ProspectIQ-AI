import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { Login } from './pages/Login.js';
import { Unauthorized } from './pages/Unauthorized.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';
import { CustomerList } from './pages/CustomerList.js';
import { CustomerDetail } from './pages/CustomerDetail.js';
import { ImportCustomers } from './pages/ImportCustomers.js';
import { Dashboard } from './pages/Dashboard.js';
import { ExplainDashboard } from './pages/ExplainDashboard.js';
import { RMWorkspace } from './pages/RMWorkspace.js';
import { AdminDashboard } from './components/dashboard/AdminDashboard.js';
import { NotificationCenter } from './pages/NotificationCenter.js';

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Branch Command Center Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer Intelligence Foundation Routes */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute>
              <CustomerDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id/explain"
          element={
            <ProtectedRoute>
              <ExplainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute>
              <RMWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/import"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ImportCustomers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
