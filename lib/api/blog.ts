/**
 * Blog API Service
 * Public blog posts and categories
 */

import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface BlogAuthor {
  name: string;
  avatar_url: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  cover_image_url: string | null;
  author: BlogAuthor;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  is_featured: boolean;
  read_time_minutes: number;
  read_time: string;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface BlogListParams {
  search?: string;
  category?: string;
  tag?: string;
  page?: number;
  per_page?: number;
}

export interface BlogListData {
  posts: BlogPost[];
  pagination: BlogPagination;
}

class BlogService {
  async listPosts(params: BlogListParams = {}): Promise<ApiResponse<BlogListData>> {
    return apiClient.get<BlogListData>('/blog-posts', this.compactParams(params));
  }

  async listCategories(): Promise<ApiResponse<{ categories: string[] }>> {
    return apiClient.get<{ categories: string[] }>('/blog-posts/categories');
  }

  async getPost(slug: string): Promise<ApiResponse<BlogPost>> {
    return apiClient.get<BlogPost>(`/blog-posts/${encodeURIComponent(slug)}`);
  }

  private compactParams(params: BlogListParams): Record<string, string | number> {
    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ) as Record<string, string | number>;
  }
}

export const blogService = new BlogService();
