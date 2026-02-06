import { useState } from 'react';
import { Booking } from '../../types';

interface BookingFormProps {
  maxGuests: number;
  existingBookings: Booking[];
  onSubmit: (bookingData: { dateFrom: string; dateTo: string; guests: number }) => Promise<void>;
  onCancel: () => void;
}

/**
 * BookingForm component for creating venue bookings
 * Validates date availability against existing bookings to prevent double-booking
 * @param maxGuests - Maximum number of guests allowed for the venue
 * @param existingBookings - Array of existing bookings to check for date conflicts
 * @param onSubmit - Callback function to handle booking submission
 * @param onCancel - Callback function to handle form cancellation
 */
export default function BookingForm({ maxGuests, existingBookings, onSubmit, onCancel }: BookingFormProps) {
  const [bookingData, setBookingData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });
  const [error, setError] = useState<string | null>(null);

  /**
   * Checks if the selected booking dates overlap with any existing bookings
   * @param dateFrom - Check-in date in ISO format
   * @param dateTo - Check-out date in ISO format
   * @returns true if dates are available, false if they overlap with existing bookings
   */
  const checkDateAvailability = (dateFrom: string, dateTo: string): boolean => {
    if (!dateFrom || !dateTo) return true;

    const checkInDate = new Date(dateFrom);
    const checkOutDate = new Date(dateTo);

    // Check if dates overlap with any existing booking
    return !existingBookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);

      // Check for overlap: new booking starts before existing ends AND new booking ends after existing starts
      return checkInDate < bookingEnd && checkOutDate > bookingStart;
    });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const newData = { ...bookingData, [field]: value };
    setBookingData(newData);
    setError(null);

    // Validate dates when both are set
    if (newData.dateFrom && newData.dateTo) {
      if (!checkDateAvailability(newData.dateFrom, newData.dateTo)) {
        setError('These dates are not available. Please select different dates.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!checkDateAvailability(bookingData.dateFrom, bookingData.dateTo)) {
      setError('These dates are not available. Please select different dates.');
      return;
    }

    setError(null);
    await onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Book Your Stay</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Check-in Date
        </label>
        <input
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={bookingData.dateFrom}
          onChange={(e) => handleDateChange('dateFrom', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Check-out Date
        </label>
        <input
          type="date"
          required
          min={bookingData.dateFrom || new Date().toISOString().split('T')[0]}
          value={bookingData.dateTo}
          onChange={(e) => handleDateChange('dateTo', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Guests
        </label>
        <input
          type="number"
          required
          min="1"
          max={maxGuests}
          value={bookingData.guests}
          onChange={(e) =>
            setBookingData({ ...bookingData, guests: parseInt(e.target.value) })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div className="flex gap-3">
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
