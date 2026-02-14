import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Booking } from '../../../types';

export const handleDeleteBooking = async (
  bookingId: string,
  bookings: Booking[],
  setBookings: (bookings: Booking[]) => void,
  addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
) => {
  if (!confirm('Are you sure you want to delete this booking?')) return;

  try {
    await apiClient.delete(API_ENDPOINTS.bookingById(bookingId), true);
    setBookings(bookings.filter(b => b.id !== bookingId));
    addToast?.('Booking deleted successfully!', 'success');
  } catch {
    addToast?.('Failed to delete booking. Please try again.', 'error');
  }
};
