/**
 * Job Application Utilities
 * Utilities for handling protected job applications with authentication flow
 */

const REDIRECT_URL_KEY = 'edwuma_redirect_after_login';
const PENDING_APPLY_ACTIVITY_KEY = 'edwuma_pending_apply_activity';

export type PendingApplyActivity = {
  jobId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Store the intended job application URL for redirect after login
 */
export function storeIntendedJobUrl(jobUrl: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(REDIRECT_URL_KEY, jobUrl);
  } catch (error) {
    console.error('Error storing intended job URL:', error);
  }
}

/**
 * Get and clear the stored job URL for redirect
 */
export function getAndClearIntendedJobUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const url = sessionStorage.getItem(REDIRECT_URL_KEY);
    if (url) {
      sessionStorage.removeItem(REDIRECT_URL_KEY);
    }
    return url;
  } catch (error) {
    console.error('Error retrieving intended job URL:', error);
    return null;
  }
}

/**
 * Clear the stored job URL
 */
export function clearIntendedJobUrl(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(REDIRECT_URL_KEY);
  } catch (error) {
    console.error('Error clearing intended job URL:', error);
  }
}

/**
 * Handle job application click with authentication check
 * If user is authenticated, open the job URL
 * If not authenticated, store URL and redirect to login
 */
export function handleJobApplication(
  jobUrl: string,
  isAuthenticated: boolean,
  options: {
    loginPath?: string;
    activity?: PendingApplyActivity | null;
  } = {}
): void {
  if (typeof window === 'undefined') return;
  
  const { loginPath = '/auth/login', activity } = options;

  if (isAuthenticated) {
    // User is authenticated, open the job application URL
    window.open(jobUrl, '_blank', 'noopener,noreferrer');
  } else {
    // User is not authenticated, store URL and redirect to login
    storeIntendedJobUrl(jobUrl);
    if (activity && (activity.jobId || activity.metadata)) {
      storePendingApplyActivity(activity);
    }
    window.location.href = loginPath;
  }
}

export function storePendingApplyActivity(activity: PendingApplyActivity): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(PENDING_APPLY_ACTIVITY_KEY, JSON.stringify(activity));
  } catch (error) {
    console.error('Error storing pending activity:', error);
  }
}

export function getAndClearPendingApplyActivity(): PendingApplyActivity | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(PENDING_APPLY_ACTIVITY_KEY);
    if (!stored) {
      return null;
    }

    sessionStorage.removeItem(PENDING_APPLY_ACTIVITY_KEY);
    return JSON.parse(stored) as PendingApplyActivity;
  } catch (error) {
    console.error('Error retrieving pending activity:', error);
    return null;
  }
}

/**
 * Process redirect after successful login
 * Opens the stored job URL if exists, otherwise returns the default dashboard URL
 */
export function processPostLoginRedirect(defaultUrl: string = '/dashboard'): {
  shouldRedirectToJob: boolean;
  jobUrl: string | null;
  dashboardUrl: string;
  pendingApplyActivity: PendingApplyActivity | null;
} {
  const jobUrl = getAndClearIntendedJobUrl();
  const pendingApplyActivity = getAndClearPendingApplyActivity();
  
  return {
    shouldRedirectToJob: !!jobUrl,
    jobUrl,
    dashboardUrl: defaultUrl,
    pendingApplyActivity,
  };
}

