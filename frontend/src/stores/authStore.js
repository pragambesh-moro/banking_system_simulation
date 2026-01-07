import { create } from 'zustand';
import authService from '../services/auth.service';

/**
 * Authentication Store (Zustand)
 * 
 * Manages global authentication state
 * Alternative: Could use React Context, Redux, etc.
 */
const useAuthStore = create((set) => ({
  // State
  user: authService.getCurrentUser(),
  account: authService.getCurrentAccount(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // Actions
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, account } = await authService.signIn(email, password);
      set({ user, account, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signUp: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, account } = await authService.signUp(userData);
      set({ user, account, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: () => {
    // Clear localStorage first
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('account');
    
    // Then update store state
    set({ user: null, account: null, isAuthenticated: false, error: null });
  },

  updateAccount: (account) => {
    localStorage.setItem('account', JSON.stringify(account));
    set({ account });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;