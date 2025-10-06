/**
 * Authentication Context
 * React context for managing authentication state across the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/lib/api';

// Auth State Interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

// Auth Actions Interface
interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  getUserDisplayName: () => string;
}

// Combined Auth Context Type
type AuthContextType = AuthState & AuthActions;

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
  });

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const user = await authService.initialize();
      
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const authResponse = await authService.login(credentials);
      
      setAuthState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const authResponse = await authService.register(userData);
      
      setAuthState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: !!user,
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, user might be logged out
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  };

  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return authService.hasAnyRole(roles);
  };

  const getUserDisplayName = (): string => {
    return authService.getUserDisplayName();
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    hasAnyRole,
    getUserDisplayName,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Convenience hooks for specific auth states
export function useAuthUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

export function useAuthInitialized(): boolean {
  const { isInitialized } = useAuth();
  return isInitialized;
}

// Role-based hooks
export function useHasRole(role: string): boolean {
  const { hasRole } = useAuth();
  return hasRole(role);
}

export function useHasAnyRole(roles: string[]): boolean {
  const { hasAnyRole } = useAuth();
  return hasAnyRole(roles);
}

// Admin hook
export function useIsAdmin(): boolean {
  return useHasRole('admin');
}

// Recruiter hook
export function useIsRecruiter(): boolean {
  return useHasRole('recruiter');
}
