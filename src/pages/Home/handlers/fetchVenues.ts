import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Venue, ApiResponse } from '../../../types';

export const fetchVenues = async (
  setVenues: (venues: Venue[]) => void,
  setFilteredVenues: (venues: Venue[]) => void,
  setFeaturedVenues: (venues: Venue[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  try {
    setLoading(true);
    // Fetch venues sorted by creation date (newest first)
    const response = await apiClient.get<ApiResponse<Venue[]>>(
      `${API_ENDPOINTS.venues}?sort=created&sortOrder=desc`
    );
    
    console.log('Fetched venues:', response.data);
    console.log('Total venues fetched:', response.data.length);
    console.log('First venue (newest):', response.data[0]);
    console.log('Last venue (oldest):', response.data[response.data.length - 1]);
    
    setVenues(response.data);
    setFilteredVenues(response.data);
    
    // Get top 5 venues with highest rating for featured carousel
    const sortedByRating = [...response.data]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    setFeaturedVenues(sortedByRating);
  } catch (err) {
    console.error('Error fetching venues:', err);
    setError(err instanceof Error ? err.message : 'Failed to fetch venues');
  } finally {
    setLoading(false);
  }
};
