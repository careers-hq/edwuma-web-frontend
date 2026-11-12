import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface MorningMailPreference {
  first_name: string | null;
  country: string | null;
  receiving: boolean;
}

class MorningMailService {
  show(token: string): Promise<ApiResponse<MorningMailPreference>> {
    return apiClient.get<MorningMailPreference>(`/morning-mail/${token}`);
  }

  choose(token: string, country: string): Promise<ApiResponse<MorningMailPreference>> {
    return apiClient.post<MorningMailPreference>(`/morning-mail/${token}`, { country });
  }

  stop(token: string): Promise<ApiResponse<MorningMailPreference>> {
    return apiClient.post<MorningMailPreference>(`/morning-mail/${token}/stop`, {});
  }
}

export const morningMailService = new MorningMailService();
