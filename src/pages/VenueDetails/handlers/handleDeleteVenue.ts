import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

export const handleDeleteVenue = async (
  id: string | undefined,
  navigate: (path: string) => void
) => {
  if (!id) return;
  
  if (!window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
    return;
  }

  try {
    await apiClient.delete(API_ENDPOINTS.venueById(id), true);
    alert('Venue deleted successfully!');
    navigate('/profile');
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete venue');
  }
};
