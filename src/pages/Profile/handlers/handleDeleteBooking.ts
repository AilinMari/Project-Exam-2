import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Booking } from '../../../types';

export const handleDeleteBooking = async (
  bookingId: string,
  bookings: Booking[],
  setBookings: (bookings: Booking[]) => void
) => {
  if (!confirm('Are you sure you want to delete this booking?')) return;

  try {
    await apiClient.delete(API_ENDPOINTS.bookingById(bookingId), true);
    setBookings(bookings.filter(b => b.id !== bookingId));
    alert('Booking deleted successfully!');
  } catch (err) {
    console.error('Error deleting booking:', err);
    alert('Failed to delete booking. Please try again.');
  }
};
