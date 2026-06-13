import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Dashboard</h1>
        <p className="text-secondaryText">Welcome back, {user?.name}</p>
      </div>
      
      {/* Role-specific dashboard content will go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-border bg-white p-6 shadow-soft">
          <h3 className="text-sm font-medium text-secondaryText">Role</h3>
          <div className="mt-2 text-2xl font-bold text-text">{user?.userType}</div>
        </div>
        <div className="rounded-md border border-border bg-white p-6 shadow-soft">
          <h3 className="text-sm font-medium text-secondaryText">Status</h3>
          <div className="mt-2 text-2xl font-bold text-text">{user?.userStatus}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
