import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Profile, Booking, Venue, ApiResponse } from '../../../types';

export const fetchData = async (
  userName: string,
  setProfile: (profile: Profile) => void,
  setBookings: (bookings: Booking[]) => void,
  setVenues: (venues: Venue[]) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    
    // Fetch profile with bookings and venues
    const profileResponse = await apiClient.get<ApiResponse<Profile>>(
      `${API_ENDPOINTS.profileByName(userName)}?_bookings=true&_venues=true`,
      true
    );
    setProfile(profileResponse.data);

    // Fetch bookings with venue details
    try {
      const bookingsResponse = await apiClient.get<ApiResponse<Booking[]>>(
        `${API_ENDPOINTS.profileBookings(userName)}?_venue=true`,
        true
      );
      setBookings(bookingsResponse.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    }

    // Fetch venues if user is a venue manager
    if (profileResponse.data.venueManager) {
      try {
        const venuesResponse = await apiClient.get<ApiResponse<Venue[]>>(
          `${API_ENDPOINTS.profileVenues(userName)}?_bookings=true`,
          true
        );
        setVenues(venuesResponse.data || []);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setVenues([]);
      }
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    alert('Failed to load profile data');
  } finally {
    setLoading(false);
  }
};
