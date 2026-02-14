import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue, CreateVenueData, ApiResponse } from '../../../types';

export const handleUpdateVenue = async (
  formData: CreateVenueData,
  editingVenue: Venue | null,
  venues: Venue[],
  setVenues: (venues: Venue[]) => void,
  setShowEditVenueModal: (show: boolean) => void,
  setEditingVenue: (venue: Venue | null) => void,
  setUpdatingVenue: (updating: boolean) => void,
  addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
) => {
  if (!editingVenue) return;

  setUpdatingVenue(true);
  try {
    const response = await apiClient.put<ApiResponse<Venue>>(
      API_ENDPOINTS.venueById(editingVenue.id),
      formData,
      true
    );

    setVenues(venues.map(v => v.id === editingVenue.id ? response.data : v));
    setShowEditVenueModal(false);
    setEditingVenue(null);
    addToast?.('Venue updated successfully! 🎉', 'success');
  } catch {
    addToast?.('Failed to update venue. Please try again.', 'error');
    throw new Error('Failed to update venue');
  } finally {
    setUpdatingVenue(false);
  }
};
