/**
 * API Client
 * Central HTTP client for making API requests with authentication and error handling
 */

import { API_CONFIG, STORAGE_KEYS } from './config';
import type { ApiResponse, ApiError } from './types';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Get the authorization header
   */
  private getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get the stored access token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Set the access token
   */
  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  /**
   * Remove the access token
   */
  public removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Get the full URL for an endpoint
   */
  private getUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data: unknown;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorData = data as Record<string, unknown>;
      const error: ApiError = {
        message: (errorData?.message as string) || 'An error occurred',
        errors: errorData?.errors as Record<string, string[]> | undefined,
        status: response.status,
      };
      throw error;
    }

    return data as ApiResponse<T>;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Check if endpoint is already a full URL (starts with http)
    const url = endpoint.startsWith('http') ? endpoint : this.getUrl(endpoint);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add auth header if token exists
    const authHeader = this.getAuthHeader();
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...authHeader,
        ...options.headers,
      },
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Network error');
    }
  }

  /**
   * GET request
   */
  public async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const url = new URL(this.getUrl(endpoint));
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.toString());
  }

  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Upload file
   */
  public async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const authHeader = this.getAuthHeader();
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: authHeader,
      body: formData,
    });
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Refresh token if needed
   */
  public async refreshToken(): Promise<boolean> {
    try {
      const response = await this.post<{ user: unknown; token: string }>('/auth/refresh');
      if (response.success && response.data.token) {
        this.setToken(response.data.token);
        return true;
      }
      return false;
    } catch {
      this.removeToken();
      return false;
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export { ApiClient };
