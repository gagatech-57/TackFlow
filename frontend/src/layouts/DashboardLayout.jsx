import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import KineticLoader from '../components/common/KineticLoader';

const DashboardLayoutContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)'
      }}>
        <KineticLoader size="large" text="Initiating Kinetic Workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="main-wrapper">
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <ToastProvider>
      <DashboardLayoutContent />
    </ToastProvider>
  );
};

export default DashboardLayout;
