import api from './api';

/**
 * Authentication Service
 * 
 * This service is designed to be FLEXIBLE and support multiple auth strategies:
 * 1. Current: Simple JWT-based auth
 * 2. Future: OAuth (Google, GitHub)
 * 3. Future: Magic links
 * 4. Future: Biometric auth
 * 
 * The interface remains the same regardless of backend implementation.
 */

class AuthService {
  /**
   * Sign in with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user, token, account}>}
   */
  async signIn(email, password) {
    try {
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });
      
      const { user, token, account } = response.data;
      
      // Store auth data
      this.setAuthData(token, user, account);
      
      return { user, token, account };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign up new user
   * @param {Object} userData - {name, email, password, initialDeposit}
   * @returns {Promise<{user, token, account}>}
   */
  async signUp(userData) {
    try {
      const response = await api.post('/api/v1/auth/register', userData);
      
      const { user, token, account } = response.data;
      
      // Store auth data
      this.setAuthData(token, user, account);
      
      return { user, token, account };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('account');
    
    // Optional: Call backend logout endpoint
    // api.post('/api/v1/auth/logout').catch(() => {});
  }

  /**
   * Get current user from storage
   * @returns {Object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current account from storage
   * @returns {Object|null}
   */
  getCurrentAccount() {
    const accountStr = localStorage.getItem('account');
    return accountStr ? JSON.parse(accountStr) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Store authentication data
   * @private
   */
  setAuthData(token, user, account) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
    }
  }

  /**
   * Handle authentication errors
   * @private
   */
  handleAuthError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.detail || 'Authentication failed';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Cannot connect to server. Please try again.');
    } else {
      // Something else happened
      return new Error('An unexpected error occurred');
    }
  }

  // ==========================================
  // FUTURE: OAuth Methods (Extensible Design)
  // ==========================================
  
  /**
   * Sign in with Google (future implementation)
   * @param {string} googleToken 
   */
  async signInWithGoogle(googleToken) {
    // TODO: Implement when backend supports OAuth
    throw new Error('Google Sign-In not yet implemented');
  }

  /**
   * Sign in with magic link (future implementation)
   * @param {string} email 
   */
  async sendMagicLink(email) {
    // TODO: Implement passwordless auth
    throw new Error('Magic link not yet implemented');
  }
}

export default new AuthService();