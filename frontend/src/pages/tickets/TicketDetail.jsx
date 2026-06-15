import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../store/useTicketStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getOneTicket, updateTicket, updateEngineerTicket } = useTicketStore();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      const data = await getOneTicket(id);
      if (data) {
        setTicket(data);
        setStatusUpdate(data.status);
      }
      setIsLoading(false);
    };
    fetchTicket();
  }, [id, getOneTicket]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    let success = false;
    
    if (user.userType === 'ENGINEER') {
      success = await updateEngineerTicket(id, { status: statusUpdate });
    } else {
      success = await updateTicket(id, { status: statusUpdate });
    }

    if (success) {
      const updatedData = await getOneTicket(id);
      if (updatedData) {
        setTicket(updatedData);
      }
    }
    setIsUpdating(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <Badge variant="primary">OPEN</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">IN PROGRESS</Badge>;
      case 'RESOLVED':
      case 'CLOSED': return <Badge variant="success">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="p-4 text-secondaryText">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="p-4 text-danger">Ticket not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Ticket #{ticket._id.substring(ticket._id.length - 6)}</h1>
          <p className="text-secondaryText">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{ticket.title}</CardTitle>
          {getStatusBadge(ticket.status)}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-secondaryText mb-1">Description</h4>
            <div className="rounded-md bg-gray-50 p-4 text-sm text-text border border-border whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-secondaryText">Priority:</span> Priority {ticket.ticketPriority}
            </div>
            <div>
              <span className="font-medium text-secondaryText">Reporter:</span> {ticket.reporter}
            </div>
            <div>
              <span className="font-medium text-secondaryText">Assignee:</span> {ticket.assignee || 'Unassigned'}
            </div>
            <div>
              <span className="font-medium text-secondaryText">Last Updated:</span> {new Date(ticket.updatedAt).toLocaleString()}
            </div>
          </div>

          {(user.userType === 'ENGINEER' || user.userType === 'ADMIN') && ticket.status !== 'CLOSED' && (
            <div className="border-t border-border pt-6 mt-6">
              <h4 className="text-sm font-medium text-text mb-2">Update Ticket Status</h4>
              <div className="flex items-center space-x-4">
                <select
                  className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  {user.userType === 'ADMIN' && <option value="ASSIGNED">Assigned</option>}
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <Button onClick={handleUpdate} disabled={isUpdating || statusUpdate === ticket.status}>
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
