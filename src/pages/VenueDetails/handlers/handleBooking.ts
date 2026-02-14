import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';

export const handleBooking = async (
  bookingData: { dateFrom: string; dateTo: string; guests: number },
  id: string | undefined,
  navigate: (path: string) => void,
  setShowBookingForm: (show: boolean) => void,
  fetchVenue: () => void,
  addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
) => {
  if (!localStorage.getItem('accessToken')) {
    addToast?.('Please login to make a booking', 'warning');
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
    addToast?.('Booking successful! 🎉', 'success');
    setShowBookingForm(false);
    fetchVenue();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Booking failed. Please try again.';
    addToast?.(errorMessage, 'error');
  }
};
