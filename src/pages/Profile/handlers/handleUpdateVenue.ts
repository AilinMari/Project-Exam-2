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
  setUpdatingVenue: (updating: boolean) => void
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
    alert('Venue updated successfully!');
  } catch (err) {
    console.error('Error updating venue:', err);
    alert('Failed to update venue. Please try again.');
    throw err;
  } finally {
    setUpdatingVenue(false);
  }
};
