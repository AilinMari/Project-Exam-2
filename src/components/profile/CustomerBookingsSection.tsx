import { useNavigate } from 'react-router-dom';
import { Booking } from '../../types';

interface CustomerBookingsSectionProps {
  bookings: Booking[];
  isManager: boolean;
  onDeleteBooking: (bookingId: string) => void;
}

export default function CustomerBookingsSection({ 
  bookings, 
  isManager,
  onDeleteBooking 
}: CustomerBookingsSectionProps) {
  const navigate = useNavigate();

  const upcomingBooking = bookings
    .filter(b => new Date(b.dateFrom) >= new Date())
    .sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime())[0];

  return (
    <>
      {/* My Bookings List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className={`text-2xl font-bold mb-4 ${
          isManager ? 'text-red-600' : 'text-blue-600'
        }`}>
          My Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded transition-colors"
              >
                <span className="text-gray-900 font-medium flex-1">
                  {booking.venue?.name || 'Venue'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/venues/${booking.venue?.id}`)}
                    className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50"
                    title="View venue"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDeleteBooking(booking.id)}
                    className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                    title="Delete booking"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Booking Card */}
      {upcomingBooking && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4 text-blue-600">
            Upcoming Booking
          </h2>
          <div className="space-y-3">
            {upcomingBooking.venue?.media?.[0]?.url && (
              <img
                src={upcomingBooking.venue.media[0].url}
                alt={upcomingBooking.venue.name}
                className="w-full h-48 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="font-bold text-lg text-blue-600">
                {upcomingBooking.venue?.name || 'Venue'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(upcomingBooking.dateFrom).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} - {new Date(upcomingBooking.dateTo).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button 
              onClick={() => navigate(`/venues/${upcomingBooking.venue?.id}`)}
              className="w-full py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}
