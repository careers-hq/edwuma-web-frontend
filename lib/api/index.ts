/**
 * API Module Exports
 * Central export point for all API-related functionality
 */

export { apiClient, ApiClient } from './client';
export { authService, AuthService } from './auth';
export { savedJobsService } from './savedJobs';
export { userActivitiesService } from './activities';
export { jobAlertsService } from './jobAlerts';
export { blogService } from './blog';
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

export type {
  SavedJob,
  SavedJobsResponse,
} from './savedJobs';

export type {
  UserActivity,
  ActivityStatistics,
  ActivitySummary,
  ActivitiesResponse,
} from './activities';

export type {
  JobAlertSubscription,
  CreateJobAlertRequest,
  UpdateJobAlertRequest,
} from './jobAlerts';

export type {
  BlogPost,
  BlogAuthor,
  BlogPagination,
  BlogListParams,
  BlogListData,
} from './blog';
