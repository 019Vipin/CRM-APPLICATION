import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { CustomerDashboard } from './dashboards/CustomerDashboard';
import { EngineerDashboard } from './dashboards/EngineerDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Dashboard</h1>
        <p className="text-secondaryText">Welcome back, {user?.name}</p>
      </div>
      
      {user?.userType === 'CUSTOMER' && <CustomerDashboard />}
      {user?.userType === 'ENGINEER' && <EngineerDashboard />}
      {user?.userType === 'ADMIN' && <AdminDashboard />}
    </div>
  );
}

export default Dashboard;
