import { useNavigate } from 'react-router-dom';
import { Booking, Venue } from '../../types';

interface VenueBookingsSectionProps {
  venues: Venue[];
}

export default function VenueBookingsSection({ venues }: VenueBookingsSectionProps) {
  const navigate = useNavigate();

  const venueBookings: Booking[] = venues.flatMap(venue => 
    (venue.bookings || []).map(booking => ({
      ...booking,
      venue: venue
    }))
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        Venue Bookings
      </h2>
      {venueBookings.length === 0 ? (
        <p className="text-gray-600">No bookings on your venues yet.</p>
      ) : (
        <div className="space-y-2">
          {venueBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded transition-colors"
            >
              <div className="flex-1">
                <div className="text-gray-900 font-medium">
                  {booking.venue?.name || 'Venue'}
                </div>
                <div className="text-xs text-gray-500">
                  {booking.customer?.name || 'Customer'} • {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(booking.dateFrom).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })} - {new Date(booking.dateTo).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <button
                onClick={() => navigate(`/venues/${booking.venue?.id}`)}
                className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                title="View venue"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
