/**
 * API Module Exports
 * Central export point for all API-related functionality
 */

export { apiClient, ApiClient } from './client';
export { authService, AuthService } from './auth';
export { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, HTTP_STATUS } from './config';
export type {
  // Base types
  ApiResponse,
  ApiError,
  
  // User types
  User,
  UserProfile,
  Role,
  Skill,
  
  // Auth types
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  
  // Job types
  JobListing,
  Company,
  JobCategory,
  
  // Invitation types
  Invitation,
  
  // Pagination types
  PaginationMeta,
  PaginatedResponse,
  
  // Search types
  JobSearchParams,
} from './types';
