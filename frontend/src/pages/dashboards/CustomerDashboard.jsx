import React, { useEffect } from 'react';
import { useTicketStore } from '../../store/useTicketStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle } from 'lucide-react';

export function CustomerDashboard() {
  const { tickets, fetchTickets, isLoading } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openTickets = tickets.filter(t => ['OPEN', 'ASSIGNED'].includes(t.status)).length;
  const inProgressTickets = tickets.filter(t => ['IN_PROGRESS', 'ON_HOLD'].includes(t.status)).length;
  const closedTickets = tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <Badge variant="primary">OPEN</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">IN PROGRESS</Badge>;
      case 'RESOLVED':
      case 'CLOSED': return <Badge variant="success">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-blue-100 p-3 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Open Tickets</p>
              <h3 className="text-2xl font-bold">{openTickets}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-yellow-100 p-3 text-warning">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Pending / In Progress</p>
              <h3 className="text-2xl font-bold">{inProgressTickets}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-green-100 p-3 text-success">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Closed Tickets</p>
              <h3 className="text-2xl font-bold">{closedTickets}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-secondaryText">Loading...</div>
          ) : recentTickets.length === 0 ? (
            <div className="text-sm text-secondaryText py-4">No tickets found. Create a new ticket to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map(ticket => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">
                      <Link to={`/tickets/${ticket._id}`} className="text-primary hover:underline">
                        #{ticket._id.substring(ticket._id.length - 6)}
                      </Link>
                    </TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>Priority {ticket.ticketPriority}</TableCell>
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
