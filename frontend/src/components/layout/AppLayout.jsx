import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

// We will connect this to Zustand later
function AppLayout({ user, onLogout }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text">
      <Sidebar userType={user.userType} onLogout={onLogout} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        
        <main className="flex-1 overflow-y-auto bg-surface p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export { AppLayout };
