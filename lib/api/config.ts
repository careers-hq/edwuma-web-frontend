/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  VERSION: 'v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Helper function to get the correct API URL based on environment
export const getApiUrl = (): string => {
  // In production on Vercel, use the production API URL
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.edwuma.com';
  }
  
  // In development, use localhost or the configured URL
  return API_CONFIG.BASE_URL;
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // User Management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  
  // Job Management
  JOBS: {
    BASE: '/jobs',
    FEATURED: '/jobs/featured',
    SEARCH: '/jobs/search',
    APPLY: '/jobs/apply',
  },
  
  // Company Management
  COMPANIES: {
    BASE: '/companies',
    PROFILE: '/companies/profile',
  },
  
  // Invitations
  INVITATIONS: {
    BASE: '/invitations',
    ACCEPT: '/invitations/accept',
    VALIDATE: '/invitations/validate',
  },
  
  // Saved Jobs
  SAVED_JOBS: {
    BASE: '/saved-jobs',
    CHECK: '/saved-jobs/check',
    COUNT: '/saved-jobs/count',
  },
  
  // User Activities
  ACTIVITIES: {
    BASE: '/activities',
    STATISTICS: '/activities/statistics',
    SUMMARY: '/activities/summary',
  },
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'edwuma_access_token',
  REFRESH_TOKEN: 'edwuma_refresh_token',
  USER_DATA: 'edwuma_user_data',
  THEME: 'edwuma_theme',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
