/**
 * User Activities API Service
 * Service for tracking and retrieving user activities
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { ApiResponse } from './types';
import type { JobListing } from './jobs';

export interface UserActivity {
  id: string;
  user_id: string;
  job_listing_id?: string;
  activity_type: 'view' | 'save' | 'apply_click' | 'search' | 'profile_update';
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  job_listing?: JobListing;
}

export interface ActivityStatistics {
  jobs_viewed: number;
  apply_clicks: number;
  searches_performed: number;
  profile_updates: number;
}

export interface ActivitySummary {
  id: string;
  type: 'view' | 'save' | 'apply_click';
  job_title: string;
  job_slug: string;
  company: string;
  location: string;
  timestamp: string;
  created_at: string;
}

export interface ActivitiesResponse {
  data: UserActivity[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

class UserActivitiesService {
  /**
   * Get user's activity feed
   */
  async getActivities(page: number = 1, perPage: number = 20, type?: string): Promise<ApiResponse<ActivitiesResponse>> {
    try {
      let url = `${API_ENDPOINTS.ACTIVITIES.BASE}?page=${page}&per_page=${perPage}`;
      if (type) {
        url += `&type=${type}`;
      }
      const response = await apiClient.get<ActivitiesResponse>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Track a new user activity
   */
  async trackActivity(
    activityType: UserActivity['activity_type'],
    jobListingId?: string,
    metadata?: Record<string, unknown>
  ): Promise<ApiResponse<UserActivity>> {
    try {
      const response = await apiClient.post<UserActivity>(
        API_ENDPOINTS.ACTIVITIES.BASE,
        {
          activity_type: activityType,
          job_listing_id: jobListingId,
          metadata,
        }
      );
      return response;
    } catch (error) {
      // Don't throw errors for activity tracking - fail silently
      console.error('Activity tracking error:', error);
      return {
        success: false,
        message: 'Activity tracking failed',
        data: {} as UserActivity,
      };
    }
  }

  /**
   * Get user activity statistics
   */
  async getStatistics(days: number = 30): Promise<ApiResponse<ActivityStatistics>> {
    try {
      const response = await apiClient.get<ActivityStatistics>(
        `${API_ENDPOINTS.ACTIVITIES.BASE}/statistics?days=${days}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent activity summary
   */
  async getSummary(limit: number = 10): Promise<ApiResponse<ActivitySummary[]>> {
    try {
      const response = await apiClient.get<ActivitySummary[]>(
        `${API_ENDPOINTS.ACTIVITIES.BASE}/summary?limit=${limit}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const userActivitiesService = new UserActivitiesService();

