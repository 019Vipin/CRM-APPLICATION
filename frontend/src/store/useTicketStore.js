import { create } from 'zustand';
import { api } from '../services/api';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  isLoading: false,
  error: null,
  
  fetchTickets: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/tickets', { params: filters });
      set({ tickets: response.data, isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch tickets', 
        isLoading: false 
      });
    }
  },
  
  fetchEngineerTickets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/engineers/tickets');
      set({ tickets: response.data, isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch tickets', 
        isLoading: false 
      });
    }
  },

  fetchAdminTickets: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/admin/issues', { params: filters });
      set({ tickets: response.data, isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch tickets', 
        isLoading: false 
      });
    }
  },

  createTicket: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/tickets', data);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create ticket', isLoading: false });
      return false;
    }
  },

  getOneTicket: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/tickets/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch ticket details', isLoading: false });
      return null;
    }
  },

  updateTicket: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/tickets/${id}`, data);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update ticket', isLoading: false });
      return false;
    }
  },

  updateEngineerTicket: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/engineers/tickets/${id}`, data);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update ticket', isLoading: false });
      return false;
    }
  }
}));
