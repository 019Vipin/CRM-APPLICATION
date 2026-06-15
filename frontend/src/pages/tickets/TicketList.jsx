import React, { useEffect, useState } from 'react';
import { useTicketStore } from '../../store/useTicketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';

export default function TicketList() {
  const { user } = useAuthStore();
  const { tickets, fetchTickets, fetchEngineerTickets, fetchAdminTickets, isLoading } = useTicketStore();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (user?.userType === 'CUSTOMER') {
      fetchTickets();
    } else if (user?.userType === 'ENGINEER') {
      fetchEngineerTickets();
    } else if (user?.userType === 'ADMIN') {
      fetchAdminTickets();
    }
  }, [user, fetchTickets, fetchEngineerTickets, fetchAdminTickets]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <Badge variant="primary">OPEN</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">IN PROGRESS</Badge>;
      case 'RESOLVED':
      case 'CLOSED': return <Badge variant="success">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const filteredTickets = tickets.filter(t => statusFilter ? t.status === statusFilter : true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Tickets</h1>
          <p className="text-secondaryText">Manage and track your support tickets.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Tickets</CardTitle>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-secondaryText" />
            <select
              className="h-8 rounded-md border border-border bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-secondaryText py-4">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-sm text-secondaryText py-4">No tickets found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map(ticket => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">
                      <Link to={`/tickets/${ticket._id}`} className="text-primary hover:underline">
                        #{ticket._id.substring(ticket._id.length - 6)}
                      </Link>
                    </TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>Priority {ticket.ticketPriority}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
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
