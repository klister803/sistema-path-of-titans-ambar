import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import LoginUsuario from './pages/Login-Usuario';
import { RegisterForm } from './components/auth/RegisterForm';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import { Guides } from './pages/Guides';
import { Support } from './pages/Support';
import MainLayout from './components/Layout/MainLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useAuthStore } from './stores/authStore';
import { AuthLayout } from './components/auth/AuthLayout';
import { PageTransition } from './components/transitions/PageTransition';
import { DashboardHome } from './pages/DashboardHome';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <PageTransition />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginUsuario />} />
        <Route path="/register" element={
          <AuthLayout title="Criar Conta">
            <RegisterForm />
          </AuthLayout>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/guia" element={<Guides />} />
        <Route path="/suporte" element={<Support />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<DashboardHome />} />
        </Route>
        
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
