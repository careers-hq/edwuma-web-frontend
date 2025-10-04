/**
 * API Types and Interfaces
 * Type definitions for API requests and responses
 */

// Base API Response Structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
  roles?: Role[];
}

export interface UserProfile {
  id: number;
  user_id: number;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  resume_url?: string;
  skills?: Skill[];
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  agree_to_terms_and_policy: boolean;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Job Types
export interface JobListing {
  id: number;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  location: string;
  job_type: string;
  experience_level: string;
  is_remote: boolean;
  is_featured: boolean;
  application_deadline?: string;
  status: string;
  company_id: number;
  company?: Company;
  category?: JobCategory;
  skills?: Skill[];
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  founded_year?: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

// Invitation Types
export interface Invitation {
  id: number;
  email: string;
  token: string;
  role: string;
  company_id?: number;
  invited_by: number;
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Pagination Types
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

// Search and Filter Types
export interface JobSearchParams {
  query?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  is_remote?: boolean;
  category_id?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
