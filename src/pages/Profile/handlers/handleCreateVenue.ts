import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue, CreateVenueData, ApiResponse } from '../../../types';

export const handleCreateVenue = async (
  formData: CreateVenueData,
  venues: Venue[],
  setVenues: (venues: Venue[]) => void,
  setShowCreateVenueModal: (show: boolean) => void,
  setCreatingVenue: (creating: boolean) => void,
  addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
) => {
  setCreatingVenue(true);
  try {
    const response = await apiClient.post<ApiResponse<Venue>>(
      API_ENDPOINTS.venues,
      formData,
      true
    );

    setVenues([...venues, response.data]);
    setShowCreateVenueModal(false);
    addToast?.('Venue created successfully! 🏠', 'success');
  } catch {
    addToast?.('Failed to create venue. Please try again.', 'error');
    throw new Error('Failed to create venue');
  } finally {
    setCreatingVenue(false);
  }
};
