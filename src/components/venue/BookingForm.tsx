import { useState } from 'react';
import { Booking } from '../../types';
import { checkDateAvailability } from './BookingForm/utils/checkDateAvailability';
import DateInput from './BookingForm/components/DateInput';
import GuestsInput from './BookingForm/components/GuestsInput';
import ErrorMessage from './BookingForm/components/ErrorMessage';

interface BookingFormProps {
  maxGuests: number;
  existingBookings: Booking[];
  onSubmit: (bookingData: { dateFrom: string; dateTo: string; guests: number }) => Promise<void>;
  onCancel: () => void;
}

export default function BookingForm({ maxGuests, existingBookings, onSubmit, onCancel }: BookingFormProps) {
  const [bookingData, setBookingData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const newData = { ...bookingData, [field]: value };
    setBookingData(newData);
    setError(null);

    if (newData.dateFrom && newData.dateTo) {
      if (!checkDateAvailability(newData.dateFrom, newData.dateTo, existingBookings)) {
        setError('These dates are not available. Please select different dates.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkDateAvailability(bookingData.dateFrom, bookingData.dateTo, existingBookings)) {
      setError('These dates are not available. Please select different dates.');
      return;
    }

    setError(null);
    await onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Book Your Stay</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <DateInput
        label="Check-in Date"
        value={bookingData.dateFrom}
        onChange={(value) => handleDateChange('dateFrom', value)}
      />

      <DateInput
        label="Check-out Date"
        value={bookingData.dateTo}
        onChange={(value) => handleDateChange('dateTo', value)}
        min={bookingData.dateFrom || new Date().toISOString().split('T')[0]}
      />

      <GuestsInput
        value={bookingData.guests}
        onChange={(value) => setBookingData({ ...bookingData, guests: value })}
        maxGuests={maxGuests}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={!!error}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Confirm Booking
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
