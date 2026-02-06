import { useState } from 'react';
import { Booking } from '../../types';
import { getDaysInMonth } from './BookingCalendar/utils/getDaysInMonth';
import { getFirstDayOfMonth } from './BookingCalendar/utils/getFirstDayOfMonth';
import { isDateBooked } from './BookingCalendar/utils/isDateBooked';
import { getBookingForDate } from './BookingCalendar/utils/getBookingForDate';
import CalendarHeader from './BookingCalendar/components/CalendarHeader';
import DayHeaders from './BookingCalendar/components/DayHeaders';
import CalendarDay from './BookingCalendar/components/CalendarDay';
import CalendarLegend from './BookingCalendar/components/CalendarLegend';

interface BookingCalendarProps {
  bookings: Booking[];
}

export default function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    const isBooked = isDateBooked(day, currentMonth, bookings);
    const booking = getBookingForDate(day, currentMonth, bookings);
    const today = new Date();
    const isToday = 
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();

    days.push(
      <CalendarDay
        key={day}
        day={day}
        isBooked={isBooked}
        isToday={isToday}
        booking={booking}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <CalendarHeader
        monthName={monthName}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
      />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days}
      </div>
      <CalendarLegend />
    </div>
  );
}