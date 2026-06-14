import React, { useEffect } from 'react';
import { useTicketStore } from '../../store/useTicketStore';
import { useUserStore } from '../../store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, HardHat, ShieldAlert, Layers } from 'lucide-react';

export function AdminDashboard() {
  const { tickets, fetchAdminTickets } = useTicketStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchAdminTickets();
    fetchUsers();
  }, [fetchAdminTickets, fetchUsers]);

  const totalUsers = users.filter(u => u.userType === 'CUSTOMER').length;
  const totalEngineers = users.filter(u => u.userType === 'ENGINEER').length;
  const pendingApprovals = users.filter(u => u.userStatus === 'PENDING').length;
  const openTickets = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-blue-100 p-3 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Total Customers</p>
              <h3 className="text-2xl font-bold">{totalUsers}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-purple-100 p-3 text-purple-700">
              <HardHat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Total Engineers</p>
              <h3 className="text-2xl font-bold">{totalEngineers}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-yellow-100 p-3 text-warning">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Pending Approvals</p>
              <h3 className="text-2xl font-bold">{pendingApprovals}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-red-100 p-3 text-danger">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Open Tickets</p>
              <h3 className="text-2xl font-bold">{openTickets}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Minimalist Bar Chart Representation */}
            <div className="space-y-4 mt-2">
              {[
                { label: 'OPEN', count: tickets.filter(t => t.status === 'OPEN').length, color: 'bg-primary' },
                { label: 'IN_PROGRESS', count: tickets.filter(t => t.status === 'IN_PROGRESS').length, color: 'bg-warning' },
                { label: 'RESOLVED', count: tickets.filter(t => t.status === 'RESOLVED').length, color: 'bg-success' }
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="w-24 text-sm font-medium">{stat.label}</div>
                  <div className="flex-1 ml-4 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color}`} 
                      style={{ width: `${tickets.length ? (stat.count / tickets.length) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-sm text-secondaryText">{stat.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-secondaryText leading-relaxed">
              System is running smoothly. All services (CRM API, Notification Service) are operational.
              Ensure you review pending engineer registrations to grant them access to the platform.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
