import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../store/useTicketStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ticketPriority: z.enum(['1', '2', '3', '4']),
});

export default function TicketCreate() {
  const navigate = useNavigate();
  const { createTicket, isLoading, error } = useTicketStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      ticketPriority: '4' // Default to lowest priority
    }
  });

  const onSubmit = async (data) => {
    // API expects ticketPriority to be an integer
    const payload = {
      ...data,
      ticketPriority: parseInt(data.ticketPriority, 10)
    };
    
    const success = await createTicket(payload);
    if (success) {
      navigate('/tickets');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Create Ticket</h1>
        <p className="text-secondaryText">Submit a new support request.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-danger border border-red-200">
                {error}
              </div>
            )}
            
            <Input
              label="Subject"
              placeholder="Brief description of the issue"
              {...register('title')}
              error={errors.title?.message}
            />

            <div className="flex flex-col space-y-1.5 w-full">
              <label className="text-sm font-medium text-text">Priority</label>
              <select
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register('ticketPriority')}
              >
                <option value="1">Priority 1 (Critical)</option>
                <option value="2">Priority 2 (High)</option>
                <option value="3">Priority 3 (Medium)</option>
                <option value="4">Priority 4 (Low)</option>
              </select>
              {errors.ticketPriority && (
                <span className="text-xs text-danger">{errors.ticketPriority.message}</span>
              )}
            </div>
            
            <div className="flex flex-col space-y-1.5 w-full">
              <label className="text-sm font-medium text-text">Description</label>
              <textarea
                className={`flex min-h-[120px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder:text-secondaryText focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.description ? 'border-danger focus:ring-danger' : ''}`}
                placeholder="Provide detailed information about your issue..."
                {...register('description')}
              />
              {errors.description && (
                <span className="text-xs text-danger">{errors.description.message}</span>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
