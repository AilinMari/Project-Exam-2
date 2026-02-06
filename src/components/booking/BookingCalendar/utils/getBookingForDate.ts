import { Booking } from '../../../../types';

export const getBookingForDate = (
  day: number,
  currentMonth: Date,
  bookings: Booking[]
): Booking | undefined => {
  const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  
  return bookings.find(booking => {
    const fromDate = new Date(booking.dateFrom);
    const toDate = new Date(booking.dateTo);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    checkDate.setHours(12, 0, 0, 0);
    
    return checkDate >= fromDate && checkDate <= toDate;
  });
};
