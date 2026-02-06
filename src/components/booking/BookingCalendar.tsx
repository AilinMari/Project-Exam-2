import { useState } from 'react';
import { Booking } from '../../types';

interface BookingCalendarProps {
  bookings: Booking[];
}

/**
 * BookingCalendar component displays a monthly calendar view with booked dates
 * Shows which dates are unavailable due to existing bookings
 * @param bookings - Array of bookings to display on the calendar
 */
export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /**
   * Gets the number of days in a given month
   * @param date - Date object for the month
   * @returns Number of days in the month
   */
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  /**
   * Gets the day of the week (0-6) for the first day of the month
   * @param date - Date object for the month
   * @returns Day of week (0 = Sunday, 6 = Saturday)
   */
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  /**
   * Checks if a specific day has any bookings
   * @param day - Day of the month (1-31)
   * @returns true if the day is booked, false otherwise
   */
  const isDateBooked = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    return bookings.some(booking => {
      const fromDate = new Date(booking.dateFrom);
      const toDate = new Date(booking.dateTo);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      checkDate.setHours(12, 0, 0, 0);
      
      return checkDate >= fromDate && checkDate <= toDate;
    });
  };

  const getBookingForDate = (day: number) => {
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

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-16 sm:h-20 bg-gray-50"></div>);
  }

  // Actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isBooked = isDateBooked(day);
    const booking = getBookingForDate(day);
    const today = new Date();
    const isToday = 
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();

    days.push(
      <div
        key={day}
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

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button
          onClick={previousMonth}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-gray-200 rounded"></div>
          <span className="text-gray-600">Booked dates</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
}
