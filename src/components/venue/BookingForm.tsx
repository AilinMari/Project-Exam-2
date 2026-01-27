import { useState } from 'react';

interface BookingFormProps {
  maxGuests: number;
  onSubmit: (bookingData: { dateFrom: string; dateTo: string; guests: number }) => Promise<void>;
  onCancel: () => void;
}

export default function BookingForm({ maxGuests, onSubmit, onCancel }: BookingFormProps) {
  const [bookingData, setBookingData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Book Your Stay</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Check-in Date
        </label>
        <input
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={bookingData.dateFrom}
          onChange={(e) =>
            setBookingData({ ...bookingData, dateFrom: e.target.value })
          }
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
          onChange={(e) =>
            setBookingData({ ...bookingData, dateTo: e.target.value })
          }
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
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
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
