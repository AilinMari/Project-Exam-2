import BookingForm from '../../../components/venue/BookingForm';
import { Booking } from '../../../types';

interface BookingSectionProps {
  isLoggedIn: boolean;
  isVenueManager: boolean;
  showBookingForm: boolean;
  maxGuests: number;
  existingBookings: Booking[];
  onShowBookingForm: () => void;
  onBooking: (bookingData: { dateFrom: string; dateTo: string; guests: number }) => Promise<void>;
  onCancelBooking: () => void;
  onNavigateToLogin: () => void;
}

export default function BookingSection({
  isLoggedIn,
  isVenueManager,
  showBookingForm,
  maxGuests,
  existingBookings,
  onShowBookingForm,
  onBooking,
  onCancelBooking,
  onNavigateToLogin,
}: BookingSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {!isLoggedIn ? (
        // Not logged in - show login prompt
        <div className="text-center py-4">
          <p className="text-gray-700 mb-3">Please log in to make a booking</p>
          <button
            onClick={onNavigateToLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
          >
            Log In
          </button>
        </div>
      ) : isVenueManager ? (
        // Logged in as venue manager - show info message
        <div className="text-center py-4">
          <p className="text-gray-700">Venue managers cannot make bookings.</p>
        </div>
      ) : !showBookingForm ? (
        // Logged in as customer - show booking button
        <button
          onClick={onShowBookingForm}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
        >
          Book Now
        </button>
      ) : (
        // Show booking form
        <BookingForm
          maxGuests={maxGuests}
          existingBookings={existingBookings}
          onSubmit={onBooking}
          onCancel={onCancelBooking}
        />
      )}
    </div>
  );
}
