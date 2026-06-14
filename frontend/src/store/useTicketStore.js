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
  }
}));
