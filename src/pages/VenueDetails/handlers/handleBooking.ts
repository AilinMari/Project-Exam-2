import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

export const handleBooking = async (
  bookingData: { dateFrom: string; dateTo: string; guests: number },
  id: string | undefined,
  navigate: (path: string) => void,
  setShowBookingForm: (show: boolean) => void,
  fetchVenue: () => void
) => {
  if (!localStorage.getItem('accessToken')) {
    alert('Please login to make a booking');
    navigate('/login');
    return;
  }

  try {
    await apiClient.post(
      API_ENDPOINTS.bookings,
      {
        ...bookingData,
        venueId: id,
      },
      true
    );
    alert('Booking successful!');
    setShowBookingForm(false);
    fetchVenue();
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Booking failed');
  }
};
