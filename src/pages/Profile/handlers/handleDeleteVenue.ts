import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue } from '../../../types';

export const handleDeleteVenue = async (
  venueId: string,
  venues: Venue[],
  setVenues: (venues: Venue[]) => void
) => {
  if (!confirm('Are you sure you want to delete this venue?')) return;

  try {
    await apiClient.delete(API_ENDPOINTS.venueById(venueId), true);
    setVenues(venues.filter(v => v.id !== venueId));
    alert('Venue deleted successfully!');
  } catch (err) {
    console.error('Error deleting venue:', err);
    alert('Failed to delete venue. Please try again.');
  }
};
