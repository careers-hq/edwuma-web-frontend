import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface JobAlertSubscription {
  id: string;
  name: string;
  email: string;
  job_titles: string[];
  countries: string[];
  frequency: string;
  send_day_of_week: string;
  send_time: string;
  timezone: string;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateJobAlertRequest {
  name: string;
  email: string;
  job_titles: string[];
  countries: string[];
}

export interface UpdateJobAlertRequest {
  name?: string;
  email?: string;
  job_titles: string[];
  countries: string[];
  frequency?: string;
  send_day_of_week?: string;
  send_time?: string;
  timezone?: string;
}

export const jobAlertsService = {
  async create(payload: CreateJobAlertRequest): Promise<ApiResponse<{ subscription: JobAlertSubscription }>> {
    return apiClient.post<{ subscription: JobAlertSubscription }>('/job-alert-subscriptions', payload);
  },
  async getMine(): Promise<ApiResponse<{ subscription: JobAlertSubscription | null }>> {
    return apiClient.get<{ subscription: JobAlertSubscription | null }>('/job-alert-subscriptions/me');
  },
  async updateMine(payload: UpdateJobAlertRequest): Promise<ApiResponse<{ subscription: JobAlertSubscription }>> {
    return apiClient.put<{ subscription: JobAlertSubscription }>('/job-alert-subscriptions/me', payload);
  },
  async deleteMine(): Promise<ApiResponse<null>> {
    return apiClient.delete<null>('/job-alert-subscriptions/me');
  },
};

