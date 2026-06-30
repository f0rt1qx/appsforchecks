import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuestRoute } from '@/components/GuestRoute';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/layouts/Layout';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { DashboardPage } from '@/pages/Dashboard';
import { ProfilePage } from '@/pages/Profile';
import { ScannerPage } from '@/pages/Scanner';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="scan" element={<ScannerPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
