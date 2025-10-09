/**
 * Debug utility to check authentication status
 * Run this in browser console: window.checkAuth()
 */

export const checkAuthStatus = () => {
  const token = localStorage.getItem('edwuma_access_token');
  const userData = localStorage.getItem('edwuma_user_data');
  
  console.log('=== Authentication Status ===');
  console.log('Token exists:', !!token);
  console.log('Token:', token ? `${token.substring(0, 20)}...` : 'None');
  console.log('User data:', userData ? JSON.parse(userData) : 'None');
  console.log('============================');
  
  return {
    isAuthenticated: !!token,
    token: token,
    user: userData ? JSON.parse(userData) : null,
  };
};

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as typeof window & { checkAuth: typeof checkAuthStatus }).checkAuth = checkAuthStatus;
}

