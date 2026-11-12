/**
 * Account gate for apply and save.
 * The list stays open. An account starts when someone applies or saves a role.
 */

import { userActivitiesService } from '@/lib/api/activities';
import { savedJobsService } from '@/lib/api/savedJobs';
import { rememberSaved } from '@/lib/savedJobsState';

const PENDING_JOB_ACTION_KEY = 'edwuma_pending_job_action';

export type PendingJobAction = {
  action: 'apply' | 'save';
  jobId: string;
  returnTo: string;
  applicationUrl?: string;
  country?: string;
  metadata?: Record<string, unknown>;
};

export function safeReturnPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) {
    return null;
  }

  return path;
}

export function storePendingJobAction(action: PendingJobAction): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(PENDING_JOB_ACTION_KEY, JSON.stringify(action));
  } catch (error) {
    console.error('Error storing pending job action:', error);
  }
}

export function peekPendingJobAction(): PendingJobAction | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(PENDING_JOB_ACTION_KEY);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as PendingJobAction;
  } catch (error) {
    console.error('Error reading pending job action:', error);
    return null;
  }
}

export function takePendingJobAction(): PendingJobAction | null {
  const action = peekPendingJobAction();
  if (typeof window === 'undefined') return action;

  try {
    sessionStorage.removeItem(PENDING_JOB_ACTION_KEY);
  } catch (error) {
    console.error('Error clearing pending job action:', error);
  }

  return action;
}

export function openApplication(url: string): void {
  if (url.toLowerCase().startsWith('mailto:')) {
    window.location.assign(url);
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function requireAccount(action: PendingJobAction): void {
  if (typeof window === 'undefined') return;

  storePendingJobAction(action);
  const params = new URLSearchParams();
  const returnTo = safeReturnPath(action.returnTo);
  if (returnTo) {
    params.set('returnTo', returnTo);
  }

  const query = params.toString();
  window.location.href = query ? `/start?${query}` : '/start';
}

export async function completePendingJobAction(fallback = '/dashboard', returnTo?: string | null): Promise<string> {
  const pending = takePendingJobAction();
  const destination = safeReturnPath(pending?.returnTo) ?? safeReturnPath(returnTo) ?? fallback;

  if (!pending?.jobId) {
    return destination;
  }

  if (pending.action === 'apply') {
    void userActivitiesService.trackActivity('apply_click', pending.jobId, pending.metadata);
    if (pending.applicationUrl) {
      openApplication(pending.applicationUrl);
    }
  }

  if (pending.action === 'save') {
    try {
      const response = await savedJobsService.saveJob(pending.jobId);
      if (response.data?.id) {
        rememberSaved(pending.jobId, response.data.id);
      }
    } catch (error) {
      const status = error && typeof error === 'object' && 'status' in error ? error.status : null;
      if (status !== 400) {
        console.error('Error saving job after account:', error);
      }
    }
  }

  return destination;
}
