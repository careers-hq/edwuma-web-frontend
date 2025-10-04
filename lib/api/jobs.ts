/**
 * Jobs API Service
 * Handles all job-related API calls
 */

import { ApiClient } from './client';
import type { ApiResponse } from './types';

// Job-related interfaces based on the API response structure
export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string | null;
  formatted?: string;
}

export interface JobWorkMode {
  value: string;
  label: string;
}

export interface JobType {
  value: string;
  label: string;
}

export interface ExperienceLevel {
  value: string;
  label: string;
}

export interface EducationLevel {
  value: string;
  label: string;
}

export interface JobApplication {
  url: string | null;
  deadline: string | null;
  deadline_formatted: string | null;
}

export interface JobTiming {
  posted_at: string;
  posted_at_formatted: string;
  expires_at: string | null;
  expires_at_formatted: string | null;
}

export interface JobStatus {
  value: string;
  label: string;
}

export interface JobSource {
  value: string;
  label: string;
  url: string | null;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  size?: string;
  industry?: string;
  founded_year?: number;
  headquarters?: string;
  type?: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  is_diaspora: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  description?: string;
  parent_id: string | null;
  level: number;
  is_african_specific: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LanguageRequirement {
  language: {
    id: string;
    name: string;
    code: string;
    is_african: boolean;
  };
  proficiency_level: string;
  is_required: boolean;
}

export interface VisaSponsorship {
  id: string;
  country: string;
  visa_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SpecialConsideration {
  id: string;
  category: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile?: Record<string, unknown>;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: string;
  external_id: string | null;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salary: JobSalary;
  work_mode: JobWorkMode;
  job_type: JobType;
  experience_level: ExperienceLevel;
  education_level?: EducationLevel;
  application: JobApplication;
  timing: JobTiming;
  status: JobStatus;
  source: JobSource;
  data_quality_score?: number;
  companies: Company[];
  locations: Location[];
  categories: JobCategory[];
  skills: Skill[];
  language_requirements?: LanguageRequirement[];
  visa_sponsorship: VisaSponsorship[];
  special_considerations: SpecialConsideration[];
  created_by?: User;
  created_at: string;
  updated_at: string;
}

export interface JobSearchFilters {
  search?: string;
  location?: string;
  region?: string;
  country?: string;
  company?: string;
  work_mode?: string;
  job_type?: string;
  experience_level?: string;
  education_level?: string;
  status?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  has_visa_sponsorship?: boolean;
  has_remote?: boolean;
  is_african_focused?: boolean;
  category_ids?: string[];
  skill_ids?: string[];
  language_ids?: string[];
  special_consideration_ids?: string[];
  posted_after?: string;
  posted_before?: string;
  expires_after?: string;
  expires_before?: string;
  sort_by?: string;
  sort_direction?: string;
  page?: number;
  per_page?: number;
}

export interface JobSearchResponse {
  success: boolean;
  message: string;
  data: {
    jobs: JobListing[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number | null;
      to: number | null;
    };
  };
}

class JobsApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Search for jobs with filters
   */
  async searchJobs(filters: JobSearchFilters = {}): Promise<JobSearchResponse> {
    const queryParams = new URLSearchParams();
    
    // Add all non-empty filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Handle array parameters
          value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
        } else if (typeof value === 'boolean') {
          // Handle boolean parameters - convert to string for URL
          queryParams.append(key, value.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await this.apiClient.get<JobSearchResponse>(`/jobs?${queryParams.toString()}`);
    return response;
  }

  /**
   * Get a single job by ID
   */
  async getJob(jobId: string): Promise<ApiResponse<JobListing>> {
    const response = await this.apiClient.get<ApiResponse<JobListing>>(`/jobs/${jobId}`);
    return response;
  }

  /**
   * Get jobs by company
   */
  async getJobsByCompany(companyId: string, filters: JobSearchFilters = {}): Promise<JobSearchResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await this.apiClient.get<JobSearchResponse>(`/companies/${companyId}/jobs?${queryParams.toString()}`);
    return response;
  }

  /**
   * Get jobs by location
   */
  async getJobsByLocation(locationId: string, filters: JobSearchFilters = {}): Promise<JobSearchResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await this.apiClient.get<JobSearchResponse>(`/locations/${locationId}/jobs?${queryParams.toString()}`);
    return response;
  }

  /**
   * Get jobs by category
   */
  async getJobsByCategory(categoryId: string, filters: JobSearchFilters = {}): Promise<JobSearchResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await this.apiClient.get<JobSearchResponse>(`/categories/${categoryId}/jobs?${queryParams.toString()}`);
    return response;
  }

  /**
   * Get jobs by region
   */
  async getJobsByRegion(region: string, filters: JobSearchFilters = {}): Promise<JobSearchResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await this.apiClient.get<JobSearchResponse>(`/locations/region/${region}?${queryParams.toString()}`);
    return response;
  }
}

// Export a singleton instance
export const jobsApiService = new JobsApiService();
export default jobsApiService;
