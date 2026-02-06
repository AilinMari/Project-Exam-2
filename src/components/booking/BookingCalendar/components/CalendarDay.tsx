import { Booking } from '../../../../types';

interface CalendarDayProps {
  day: number;
  isBooked: boolean;
  isToday: boolean;
  booking?: Booking;
}

export default function CalendarDay({ day, isBooked, isToday, booking }: CalendarDayProps) {
  return (
    <div
      className={`h-16 sm:h-20 border border-gray-200 p-1 sm:p-2 relative ${
        isBooked ? 'bg-blue-100 cursor-pointer hover:bg-blue-200' : 'bg-white'
      } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
      title={booking ? `Booked: ${booking.venue?.name || 'Venue'}` : ''}
    >
      <span className={`text-xs sm:text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
        {day}
      </span>
      {isBooked && booking && (
        <div className="mt-0.5 sm:mt-1">
          <div className="text-[10px] sm:text-xs text-blue-800 font-medium truncate">
            Booked
          </div>
        </div>
      )}
    </div>
  );
}
