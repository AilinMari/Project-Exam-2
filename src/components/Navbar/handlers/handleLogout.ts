export const handleLogout = (addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('venueManager');
  addToast?.('Logged out successfully! 👋', 'success');
  window.location.href = '/';
};
