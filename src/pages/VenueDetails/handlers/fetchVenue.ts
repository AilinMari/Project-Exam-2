import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue, ApiResponse } from '../../../types';

export const fetchVenue = async (
  id: string,
  setVenue: (venue: Venue | null) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  try {
    setLoading(true);
    const response = await apiClient.get<ApiResponse<Venue>>(
      `${API_ENDPOINTS.venueById(id)}?_owner=true&_bookings=true`
    );
    setVenue(response.data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch venue');
  } finally {
    setLoading(false);
  }
};
