import React, { useEffect } from 'react';
import { useTicketStore } from '../../store/useTicketStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { LayoutList, Activity, CheckSquare } from 'lucide-react';

export function EngineerDashboard() {
  const { tickets, fetchEngineerTickets, isLoading } = useTicketStore();

  useEffect(() => {
    fetchEngineerTickets();
  }, [fetchEngineerTickets]);

  const assignedTickets = tickets.filter(t => t.status === 'ASSIGNED').length;
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const resolvedToday = tickets.filter(t => 
    (t.status === 'RESOLVED' || t.status === 'CLOSED') && 
    new Date(t.updatedAt) >= today
  ).length;

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
              <LayoutList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Assigned (New)</p>
              <h3 className="text-2xl font-bold">{assignedTickets}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-yellow-100 p-3 text-warning">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">In Progress</p>
              <h3 className="text-2xl font-bold">{inProgressTickets}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-full bg-green-100 p-3 text-success">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondaryText">Resolved Today</p>
              <h3 className="text-2xl font-bold">{resolvedToday}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Active Work</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-secondaryText">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="text-sm text-secondaryText py-4">No assigned tickets found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.slice(0, 10).map(ticket => (
                  <TableRow key={ticket._id}>
                    <TableCell className="font-medium">
                      <Link to={`/tickets/${ticket._id}`} className="text-primary hover:underline">
                        #{ticket._id.substring(ticket._id.length - 6)}
                      </Link>
                    </TableCell>
                    <TableCell>{ticket.reporter}</TableCell>
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
