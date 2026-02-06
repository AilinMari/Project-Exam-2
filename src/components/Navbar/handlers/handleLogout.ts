export const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('venueManager');
  window.location.href = '/';
};
