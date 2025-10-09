/**
 * Saved Jobs API Service
 * Service for managing saved jobs
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { ApiResponse } from './types';
import type { JobListing } from './jobs';

export interface SavedJob {
  id: string;
  saved_at: string;
  job: JobListing;
}

export interface SavedJobsResponse {
  data: SavedJob[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

class SavedJobsService {
  /**
   * Get all saved jobs for the authenticated user
   */
  async getSavedJobs(page: number = 1, perPage: number = 20): Promise<ApiResponse<SavedJobsResponse>> {
    try {
      const response = await apiClient.get<SavedJobsResponse>(
        `${API_ENDPOINTS.SAVED_JOBS.BASE}?page=${page}&per_page=${perPage}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save a job
   */
  async saveJob(jobListingId: string): Promise<ApiResponse<SavedJob>> {
    try {
      const response = await apiClient.post<SavedJob>(
        API_ENDPOINTS.SAVED_JOBS.BASE,
        { job_listing_id: jobListingId }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove a saved job
   */
  async unsaveJob(savedJobId: string): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<null>(
        `${API_ENDPOINTS.SAVED_JOBS.BASE}/${savedJobId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a job is saved
   */
  async checkIfSaved(jobListingId: string): Promise<ApiResponse<{ is_saved: boolean }>> {
    try {
      const response = await apiClient.get<{ is_saved: boolean }>(
        `${API_ENDPOINTS.SAVED_JOBS.BASE}/check/${jobListingId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get count of saved jobs
   */
  async getCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await apiClient.get<{ count: number }>(
        `${API_ENDPOINTS.SAVED_JOBS.BASE}/count`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const savedJobsService = new SavedJobsService();

