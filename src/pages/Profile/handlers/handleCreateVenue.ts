import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue, CreateVenueData, ApiResponse } from '../../../types';

export const handleCreateVenue = async (
  formData: CreateVenueData,
  venues: Venue[],
  setVenues: (venues: Venue[]) => void,
  setShowCreateVenueModal: (show: boolean) => void,
  setCreatingVenue: (creating: boolean) => void
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
    alert('Venue created successfully!');
  } catch (err) {
    console.error('Error creating venue:', err);
    alert('Failed to create venue. Please try again.');
    throw err;
  } finally {
    setCreatingVenue(false);
  }
};
