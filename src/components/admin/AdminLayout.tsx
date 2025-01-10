import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAuthStore } from '../../stores/authStore';
import { Navigate } from 'react-router-dom';

export const AdminLayout = () => {
  const user = useAuthStore(state => state.user);
  
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[rgb(var(--color-obsidian))]">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
