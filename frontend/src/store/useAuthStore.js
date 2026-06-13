import { create } from 'zustand';
import { api } from '../services/api';

// Initialize state from local storage if available
const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create((set) => ({
  user: initialUser,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signin', { email, password });
      const userData = {
        name: response.data.name,
        email: response.data.email,
        userId: response.data.userId,
        userType: response.data.userType,
        userStatus: response.data.userStatus,
      };
      
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      set({ user: userData, isLoading: false });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },
  
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/signup', data);
      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
  },
  
  clearError: () => set({ error: null })
}));
