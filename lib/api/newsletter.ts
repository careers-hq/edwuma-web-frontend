/**
 * Leave the letter. Accounts receive it without a separate signup.
 */

import { apiClient } from './client';
import type { ApiResponse } from './types';

class NewsletterService {
  unsubscribe(token: string): Promise<ApiResponse<null>> {
    return apiClient.post<null>(`/letter/stop/${token}`, {});
  }
}

export const newsletterService = new NewsletterService();
