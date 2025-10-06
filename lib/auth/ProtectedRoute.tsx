/**
 * Protected Route Component
 * Component for protecting routes that require authentication
 */

'use client';

import React, { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized, hasRole, hasAnyRole } = useAuth();

  // Show loading spinner while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return fallback || null;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'; // Redirect to dashboard or appropriate page
    }
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Higher-order component for admin routes
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requiredRole: 'admin' });
}

// Higher-order component for recruiter routes
export function withRecruiterAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, { requiredRole: 'recruiter' });
}

// Higher-order component for multiple role routes
export function withRoleAuth<P extends object>(
  Component: React.ComponentType<P>,
  roles: string[]
) {
  return withAuth(Component, { requiredRoles: roles });
}
