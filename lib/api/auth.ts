/**
 * Authentication Service
 * Service for handling authentication-related API calls
 */

import { apiClient } from './client';
import { API_ENDPOINTS, STORAGE_KEYS } from './config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './types';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data.token) {
        // Store token and user data
        apiClient.setToken(response.data.token);
        this.storeUserData(response.data.user);
        
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // Handle ApiError with proper message extraction
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as { message: string; status?: number; errors?: Record<string, string[]> };
        
        // If there are validation errors, format them
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat();
          throw new Error(errorMessages[0] || apiError.message);
        }
        
        throw new Error(apiError.message);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      if (response.success && response.data.token) {
        // Store token and user data
        apiClient.setToken(response.data.token);
        this.storeUserData(response.data.user);
        
        return response.data;
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      // Handle ApiError with proper message extraction
      if (error && typeof error === 'object' && 'message' in error) {
        const apiError = error as { message: string; status?: number; errors?: Record<string, string[]> };
        
        // If there are validation errors, format them
        if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat();
          throw new Error(errorMessages[0] || apiError.message);
        }
        
        throw new Error(apiError.message);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      apiClient.removeToken();
      this.clearUserData();
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have cached user data
      const cachedUser = this.getStoredUserData();
      if (cachedUser && apiClient.isAuthenticated()) {
        return cachedUser;
      }

      // If no cached data or not authenticated, fetch from API
      if (!apiClient.isAuthenticated()) {
        return null;
      }

      const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
      
      if (response.success && response.data.user) {
        this.storeUserData(response.data.user);
        return response.data.user;
      }

      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // If token is invalid, clear it
      apiClient.removeToken();
      this.clearUserData();
      return null;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const success = await apiClient.refreshToken();
      return success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send password reset email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      throw new Error(errorMessage);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated() && !!this.getStoredUserData();
  }

  /**
   * Get stored user data
   */
  getStoredUserData(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Store user data in localStorage
   */
  private storeUserData(user: User): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Clear user data from localStorage
   */
  private clearUserData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    const user = this.getStoredUserData();
    if (!user || !user.roles || user.roles.length === 0) {
      return null;
    }
    return user.roles[0].name;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    const user = this.getStoredUserData();
    if (!user) return '';
    
    // Check profile first, then fall back to user object properties
    const firstName = user.profile?.first_name || user.first_name || '';
    const lastName = user.profile?.last_name || user.last_name || '';
    
    return `${firstName} ${lastName}`.trim() || user.email;
  }

  /**
   * Initialize authentication state
   * Call this on app startup to restore auth state
   */
  async initialize(): Promise<User | null> {
    if (apiClient.isAuthenticated()) {
      try {
        const user = await this.getCurrentUser();
        return user;
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        // Clear invalid tokens
        apiClient.removeToken();
        this.clearUserData();
        return null;
      }
    }
    return null;
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Export the class for testing purposes
export { AuthService };
