import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Venue, ApiResponse } from '../types';

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });

  useEffect(() => {
    if (id) {
      fetchVenue();
    }
  }, [id]);

  const fetchVenue = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<Venue>>(
        `${API_ENDPOINTS.venueById(id)}?_owner=true&_bookings=true`
      );
      setVenue(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venue');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localStorage.getItem('accessToken')) {
      alert('Please login to make a booking');
      navigate('/login');
      return;
    }

    try {
      await apiClient.post(
        API_ENDPOINTS.bookings,
        {
          ...bookingData,
          venueId: id,
        },
        true
      );
      alert('Booking successful!');
      setShowBookingForm(false);
      fetchVenue();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Booking failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading venue details...</div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">
          Error: {error || 'Venue not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {venue.media && venue.media.length > 0 ? (
            venue.media.slice(0, 4).map((image, index) => (
              <div key={index} className="h-64 bg-gray-200">
                <img
                  src={image.url}
                  alt={image.alt || `${venue.name} ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No images available</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {venue.name}
              </h1>
              <p className="text-gray-600">
                {venue.location.city && venue.location.country
                  ? `${venue.location.city}, ${venue.location.country}`
                  : 'Location not specified'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                ${venue.price}
                <span className="text-lg text-gray-600">/night</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Max {venue.maxGuests} guests
              </div>
            </div>
          </div>

          <div className="border-t border-b py-4 my-4">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-3">
              {venue.meta.wifi && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  WiFi
                </span>
              )}
              {venue.meta.parking && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                  Parking
                </span>
              )}
              {venue.meta.breakfast && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                  Breakfast
                </span>
              )}
              {venue.meta.pets && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">
                  Pets Allowed
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {venue.description}
            </p>
          </div>

          {venue.owner && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Host</h2>
              <div className="flex items-center gap-3">
                {venue.owner.avatar?.url ? (
                  <img
                    src={venue.owner.avatar.url}
                    alt={venue.owner.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {venue.owner.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{venue.owner.name}</p>
                  {venue.owner.bio && (
                    <p className="text-sm text-gray-600">{venue.owner.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
              >
                Book Now
              </button>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <h2 className="text-xl font-semibold">Book Your Stay</h2>
                
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    max={venue.maxGuests}
                    value={bookingData.guests}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, guests: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
