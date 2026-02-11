import { Booking, Venue } from '../../types';
import BookingCalendar from '../booking/BookingCalendar';

interface ProfileCalendarSectionProps {
  bookings?: Booking[];
  venues?: Venue[];
  isManager: boolean;
}

export default function ProfileCalendarSection({ 
  bookings = [], 
  venues = [], 
  isManager 
}: ProfileCalendarSectionProps) {
  // For managers, show venue bookings; for customers, show their bookings
  const calendarBookings: Booking[] = isManager 
    ? venues.flatMap(venue => 
        (venue.bookings || []).map(booking => ({
          ...booking,
          venue: venue
        }))
      )
    : bookings;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className={`text-2xl font-bold mb-4 ${
        isManager ? 'text-orange-600' : 'text-blue-600'
      }`}>
        Calendar
      </h2>
      <BookingCalendar bookings={calendarBookings} />
    </div>
  );
}
