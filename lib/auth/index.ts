/**
 * Authentication Module Exports
 * Central export point for all authentication-related functionality
 */

export {
  AuthProvider,
  useAuth,
  useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthInitialized,
  useHasRole,
  useHasAnyRole,
  useIsAdmin,
  useIsRecruiter,
} from './AuthContext';

export {
  ProtectedRoute,
  withAuth,
  withAdminAuth,
  withRecruiterAuth,
  withRoleAuth,
} from './ProtectedRoute';
