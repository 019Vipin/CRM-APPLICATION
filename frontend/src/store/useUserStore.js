import { create } from 'zustand';
import { api } from '../services/api';

export const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/users', { params: filters });
      set({ users: response.data, isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch users', 
        isLoading: false 
      });
    }
  },
  
  updateUser: async (id, data) => {
    try {
      await api.put(`/users/${id}`, data);
      // Refresh list after update
      const response = await api.get('/users');
      set({ users: response.data });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}));
