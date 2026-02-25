import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/common/Layout';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import AnalysisPage from '../pages/dashboard/AnalysisPage';
import SubscriptionPage from '../pages/dashboard/SubscriptionPage';
import PaymentSuccessPage from '../pages/dashboard/PaymentSuccessPage';
import AdminDashboard from '../pages/admin/AdminDashboard';

function ProtectedLayout({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<LandingPage />}   />
          <Route path="/login"     element={<LoginPage />}     />
          <Route path="/register"  element={<RegisterPage />}  />

          {/* Protected */}
          <Route path="/dashboard"  element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/profile"    element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
          <Route path="/analysis"   element={<ProtectedLayout><AnalysisPage /></ProtectedLayout>} />
          <Route path="/subscription" element={<ProtectedLayout><SubscriptionPage /></ProtectedLayout>} />
          <Route path="/payment/success" element={<ProtectedLayout><PaymentSuccessPage /></ProtectedLayout>} />
          <Route path="/admin"      element={<ProtectedLayout requiredRole="ADMIN"><AdminDashboard /></ProtectedLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}