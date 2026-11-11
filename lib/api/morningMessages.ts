import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface MorningMessageKind {
  value: string;
  label: string;
}

export interface MorningMessagePrice {
  country: string;
  slug: string;
  amount: number;
  currency: string;
}

export interface MorningMessageOptions {
  ready: boolean;
  kinds: MorningMessageKind[];
  prices: MorningMessagePrice[];
}

export interface MorningMessage {
  phone: string;
  first_name: string | null;
  email: string;
  country: string;
  kind_of_work: string;
  years: number;
  weekly_amount: number;
  currency: string;
  whatsapp_enabled: boolean;
  email_enabled: boolean;
  paid_until: string | null;
  checkout_url?: string | null;
}

export interface StartMorningMessage {
  country: string;
  phone: string;
  email: string;
  first_name?: string;
  kind_of_work: string;
  years: number;
}

class MorningMessageService {
  options(): Promise<ApiResponse<MorningMessageOptions>> {
    return apiClient.get<MorningMessageOptions>('/morning-messages/options');
  }

  save(payload: StartMorningMessage): Promise<ApiResponse<MorningMessage>> {
    return apiClient.post<MorningMessage>('/morning-messages', payload);
  }

  confirm(reference: string): Promise<ApiResponse<MorningMessage>> {
    return apiClient.post<MorningMessage>('/morning-messages/confirm', { reference });
  }

  unsubscribe(token: string): Promise<ApiResponse<MorningMessage>> {
    return apiClient.get<MorningMessage>(`/morning-messages/unsubscribe/${token}`);
  }
}

export const morningMessageService = new MorningMessageService();
