/**
 * Admin API
 * Dashboard, users, invitations, blog management, and job sync
 */

import { apiClient } from './client';
import type { BlogListData, BlogPost } from './blog';
import type { ApiError } from './types';

export interface AdminPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface AdminBreakdown {
  label: string;
  value: number;
}

export interface AdminActivityPoint {
  date: string;
  views: number;
  apply_clicks: number;
  signups: number;
}

export interface AdminTopJob {
  id: string;
  title: string;
  views: number;
  apply_clicks: number;
}

export interface AdminDashboardStats {
  total_users: number;
  active_users: number;
  new_users_7d: number;
  new_users_30d: number;
  total_invitations: number;
  pending_invitations: number;
  accepted_invitations: number;
  expired_invitations: number;
  users_by_role: {
    admin: number;
    user: number;
    recruiter: number;
  };
  jobs: {
    total: number;
    active: number;
    posted_7d: number;
    posted_30d: number;
    by_work_mode: AdminBreakdown[];
    by_country: AdminBreakdown[];
  };
  content: {
    companies: number;
    published_posts: number;
    draft_posts: number;
    job_alerts: number;
    saved_jobs: number;
  };
  engagement: {
    views_30d: number;
    apply_clicks_30d: number;
    saves_30d: number;
    searches_30d: number;
  };
  activity_series: AdminActivityPoint[];
  top_jobs: AdminTopJob[];
}

export interface AdminUserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  display_name: string | null;
  city: string | null;
  country: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  display_name: string | null;
  is_admin: boolean;
  is_user: boolean;
  is_recruiter: boolean;
  profile?: AdminUserProfile | null;
  roles?: Array<{ id: string | number; name: string; guard_name?: string }>;
}

export interface AdminInvitationPerson {
  id: string;
  email: string;
  display_name: string | null;
}

export interface AdminInvitation {
  id: string;
  email: string;
  token: string;
  role: string | null;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  is_expired: boolean;
  is_accepted: boolean;
  is_valid: boolean;
  invitation_url?: string;
  invitation_data?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  } | null;
  inviter?: AdminInvitationPerson | null;
  accepter?: AdminInvitationPerson | null;
  expires_in_hours?: number;
}

export interface InviteUserPayload {
  email: string;
  role: 'admin' | 'user' | 'recruiter';
  expiry_hours?: number;
  invitation_data: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

export interface AdminBlogPayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  cover_image_url?: string | null;
  author_name?: string | null;
  category: string;
  tags?: string[];
  status: 'draft' | 'published';
  is_featured?: boolean;
}

export interface SyncSource {
  id: string;
  name: string;
  base_url: string;
  is_active: boolean;
  last_sync_at: string | null;
  sync_frequency_minutes: number | null;
  rate_limit_per_minute: number | null;
}

export interface SyncLog {
  id: string;
  api_source: { id: string; name: string } | null;
  sync_type: string;
  status: string;
  jobs_fetched: number;
  jobs_created: number;
  jobs_updated: number;
  jobs_skipped: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  duration: number | null;
}

export interface SyncStatistics {
  overview: {
    total_syncs: number;
    successful_syncs: number;
    failed_syncs: number;
    partial_syncs: number;
    success_rate: number;
  };
  jobs: {
    total_fetched: number;
    total_created: number;
    total_updated: number;
    total_skipped: number;
  };
  sources: {
    active: number;
    total: number;
  };
  last_sync: {
    id: string;
    api_source: string;
    status: string;
    started_at: string;
    completed_at: string | null;
  } | null;
}

export interface SyncSourceResult {
  success: boolean;
  sync_log_id?: string;
  error?: string;
  results?: {
    jobs_fetched?: number;
    jobs_created?: number;
    jobs_updated?: number;
    jobs_skipped?: number;
  };
}

export interface UserListParams {
  search?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface InvitationListParams {
  status?: 'pending' | 'accepted' | 'expired';
  role?: string;
  page?: number;
  per_page?: number;
}

export interface BlogAdminListParams {
  search?: string;
  category?: string;
  status?: 'draft' | 'published';
  page?: number;
  per_page?: number;
}

const emptyPagination = (perPage = 15): AdminPagination => ({
  current_page: 1,
  last_page: 1,
  per_page: perPage,
  total: 0,
});

function compactParams(params: object): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ) as Record<string, string | number | boolean>;
}

function unwrapList<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === 'object' && 'data' in value && Array.isArray((value as { data: unknown }).data)) {
    return (value as { data: T[] }).data;
  }

  return [];
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    const firstFieldError = apiError.errors ? Object.values(apiError.errors).flat()[0] : undefined;
    return firstFieldError || apiError.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function userDisplayName(user: Pick<AdminUser, 'display_name' | 'full_name' | 'email' | 'profile'>): string {
  return user.display_name || user.full_name || user.profile?.display_name || user.profile?.full_name || user.email;
}

export function userRoleName(user: Pick<AdminUser, 'roles' | 'is_admin' | 'is_recruiter'>): string {
  if (user.roles && user.roles.length > 0) {
    return user.roles[0].name;
  }
  if (user.is_admin) return 'admin';
  if (user.is_recruiter) return 'recruiter';
  return 'user';
}

export function invitationStatus(invitation: Pick<AdminInvitation, 'is_accepted' | 'is_expired'>): 'accepted' | 'expired' | 'pending' {
  if (invitation.is_accepted) return 'accepted';
  if (invitation.is_expired) return 'expired';
  return 'pending';
}

class AdminService {
  async getDashboard(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<{ stats: AdminDashboardStats }>('/admin/dashboard');
    if (!response.success || !response.data?.stats) {
      throw new Error(response.message || 'Unable to load the admin dashboard');
    }
    return response.data.stats;
  }

  async listUsers(params: UserListParams = {}): Promise<{ users: AdminUser[]; pagination: AdminPagination }> {
    const response = await apiClient.get<{ users: unknown; pagination: AdminPagination }>('/admin/users', compactParams(params));
    return {
      users: unwrapList<AdminUser>(response.data?.users),
      pagination: response.data?.pagination ?? emptyPagination(params.per_page),
    };
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
    const response = await apiClient.patch<{ user: AdminUser }>(`/admin/users/${userId}/status`, {
      is_active: isActive,
    });
    if (!response.success || !response.data?.user) {
      throw new Error(response.message || 'Unable to update user status');
    }
    return response.data.user;
  }

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    const response = await apiClient.patch<{ user: AdminUser }>(`/admin/users/${userId}/role`, { role });
    if (!response.success || !response.data?.user) {
      throw new Error(response.message || 'Unable to update user role');
    }
    return response.data.user;
  }

  async listInvitations(params: InvitationListParams = {}): Promise<{ invitations: AdminInvitation[]; pagination: AdminPagination }> {
    const response = await apiClient.get<{ invitations: unknown; pagination: AdminPagination }>(
      '/admin/invitations',
      compactParams(params)
    );
    return {
      invitations: unwrapList<AdminInvitation>(response.data?.invitations),
      pagination: response.data?.pagination ?? emptyPagination(params.per_page),
    };
  }

  async sendInvitation(payload: InviteUserPayload): Promise<AdminInvitation> {
    const response = await apiClient.post<{ invitation: AdminInvitation }>('/invitations', payload);
    if (!response.success || !response.data?.invitation) {
      throw new Error(response.message || 'Unable to send invitation');
    }
    return response.data.invitation;
  }

  async resendInvitation(invitationId: string): Promise<AdminInvitation> {
    const response = await apiClient.post<{ invitation: AdminInvitation }>(`/invitations/${invitationId}/resend`);
    if (!response.success || !response.data?.invitation) {
      throw new Error(response.message || 'Unable to resend invitation');
    }
    return response.data.invitation;
  }

  async cancelInvitation(invitationId: string): Promise<void> {
    const response = await apiClient.delete<null>(`/invitations/${invitationId}`);
    if (!response.success) {
      throw new Error(response.message || 'Unable to cancel invitation');
    }
  }

  async listBlogPosts(params: BlogAdminListParams = {}): Promise<BlogListData> {
    const response = await apiClient.get<{ posts: unknown; pagination: AdminPagination }>(
      '/admin/blog-posts',
      compactParams(params)
    );
    const pagination = response.data?.pagination ?? emptyPagination(params.per_page);
    return {
      posts: unwrapList<BlogPost>(response.data?.posts),
      pagination: {
        current_page: pagination.current_page,
        last_page: pagination.last_page,
        per_page: pagination.per_page,
        total: pagination.total,
        from: pagination.from ?? null,
        to: pagination.to ?? null,
      },
    };
  }

  async getBlogPost(id: string): Promise<BlogPost> {
    const response = await apiClient.get<BlogPost>(`/admin/blog-posts/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Unable to load blog post');
    }
    return response.data;
  }

  async createBlogPost(payload: AdminBlogPayload): Promise<BlogPost> {
    const response = await apiClient.post<BlogPost>('/blog-posts', payload);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Unable to create blog post');
    }
    return response.data;
  }

  async updateBlogPost(id: string, payload: AdminBlogPayload): Promise<BlogPost> {
    const response = await apiClient.put<BlogPost>(`/blog-posts/${id}`, payload);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Unable to update blog post');
    }
    return response.data;
  }

  async deleteBlogPost(id: string): Promise<void> {
    const response = await apiClient.delete<null>(`/blog-posts/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Unable to delete blog post');
    }
  }

  async getSyncSources(): Promise<SyncSource[]> {
    const response = await apiClient.get<unknown>('/sync/sources');
    return unwrapList<SyncSource>(response.data);
  }

  async getSyncStatistics(): Promise<SyncStatistics> {
    const response = await apiClient.get<SyncStatistics>('/sync/statistics');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Unable to load sync statistics');
    }
    return response.data;
  }

  async getSyncLogs(page = 1): Promise<{ logs: SyncLog[]; pagination: AdminPagination }> {
    const response = await apiClient.get<{ logs: unknown; pagination: AdminPagination }>('/sync/logs', {
      page,
      per_page: 10,
    });
    return {
      logs: unwrapList<SyncLog>(response.data?.logs),
      pagination: response.data?.pagination ?? emptyPagination(10),
    };
  }

  async syncAll(): Promise<Record<string, SyncSourceResult>> {
    const response = await apiClient.post<Record<string, SyncSourceResult>>('/sync/all');
    if (!response.success) {
      throw new Error(response.message || 'Job sync failed');
    }
    return response.data ?? {};
  }

  async syncSource(sourceId: string): Promise<SyncSourceResult> {
    const response = await apiClient.post<SyncSourceResult>(`/sync/source/${sourceId}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Job sync failed');
    }
    return response.data;
  }
}

export const adminService = new AdminService();
