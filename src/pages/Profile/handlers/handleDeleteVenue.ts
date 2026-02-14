import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue } from '../../../types';

export const handleDeleteVenue = async (
  venueId: string,
  venues: Venue[],
  setVenues: (venues: Venue[]) => void,
  addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
) => {
  if (!confirm('Are you sure you want to delete this venue?')) return;

  try {
    await apiClient.delete(API_ENDPOINTS.venueById(venueId), true);
    setVenues(venues.filter(v => v.id !== venueId));
    addToast?.('Venue deleted successfully!', 'success');
  } catch {
    addToast?.('Failed to delete venue. Please try again.', 'error');
  }
};
