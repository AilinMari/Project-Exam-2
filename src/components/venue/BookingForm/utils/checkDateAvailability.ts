import { Booking } from '../../../../types';

export const checkDateAvailability = (
  dateFrom: string,
  dateTo: string,
  existingBookings: Booking[]
): boolean => {
  if (!dateFrom || !dateTo) return true;

  const checkInDate = new Date(dateFrom);
  const checkOutDate = new Date(dateTo);

  return !existingBookings.some(booking => {
    const bookingStart = new Date(booking.dateFrom);
    const bookingEnd = new Date(booking.dateTo);
    return checkInDate < bookingEnd && checkOutDate > bookingStart;
  });
};
