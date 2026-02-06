import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { CreateVenueData } from '../../../types';

export const handleUpdateVenue = async (
  formData: CreateVenueData,
  id: string | undefined,
  setUpdatingVenue: (updating: boolean) => void,
  setShowEditModal: (show: boolean) => void,
  fetchVenue: () => void
) => {
  if (!id) return;

  setUpdatingVenue(true);
  try {
    await apiClient.put(
      API_ENDPOINTS.venueById(id),
      formData,
      true
    );
    alert('Venue updated successfully!');
    setShowEditModal(false);
    fetchVenue();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to update venue');
    throw err;
  } finally {
    setUpdatingVenue(false);
  }
};
