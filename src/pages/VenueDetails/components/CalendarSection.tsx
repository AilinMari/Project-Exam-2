import BookingCalendar from '../../../components/booking/BookingCalendar';
import { Booking } from '../../../types';

interface CalendarSectionProps {
  bookings: Booking[];
}

export default function CalendarSection({ bookings }: CalendarSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Availability</h3>
      <BookingCalendar bookings={bookings} />
    </div>
  );
}
