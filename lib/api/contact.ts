/**
 * Contact API Service
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { ApiResponse } from './types';

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  'cf-turnstile-response'?: string;
}

class ContactService {
  async send(message: ContactMessageRequest): Promise<ApiResponse<null>> {
    return apiClient.post<null>(API_ENDPOINTS.CONTACT, message);
  }
}

export const contactService = new ContactService();
