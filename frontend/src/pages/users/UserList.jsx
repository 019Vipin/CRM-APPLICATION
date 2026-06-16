import React, { useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function UserList() {
  const { users, fetchUsers, updateUser, isLoading } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId, newStatus) => {
    await updateUser(userId, { userStatus: newStatus });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">APPROVED</Badge>;
      case 'PENDING': return <Badge variant="warning">PENDING</Badge>;
      case 'REJECTED': return <Badge variant="danger">REJECTED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">User Management</h1>
          <p className="text-secondaryText">Manage customers and engineers.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-secondaryText py-4">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-sm text-secondaryText py-4">No users found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.userId}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.userType === 'ADMIN' ? 'danger' : u.userType === 'ENGINEER' ? 'warning' : 'primary'}>
                        {u.userType}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(u.userStatus)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {u.userType !== 'ADMIN' && (
                        <>
                          <select
                            className="h-8 rounded-md border border-border bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary inline-block w-28 align-middle"
                            value={u.userStatus}
                            onChange={(e) => handleStatusChange(u.userId, e.target.value)}
                          >
                            <option value="APPROVED">Approve</option>
                            <option value="PENDING">Pending</option>
                            <option value="REJECTED">Reject</option>
                          </select>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
