import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Profile, Booking, Venue, ApiResponse } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'venues'>('bookings');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userName = localStorage.getItem('userName');

    if (!token || !userName) {
      navigate('/login');
      return;
    }

    fetchProfile(userName);
  }, [navigate]);

  const fetchProfile = async (userName: string) => {
    try {
      setLoading(true);
      
      // Fetch profile
      const profileResponse = await apiClient.get<ApiResponse<Profile>>(
        API_ENDPOINTS.profileByName(userName),
        true
      );
      setProfile(profileResponse.data);

      // Fetch bookings
      const bookingsResponse = await apiClient.get<ApiResponse<Booking[]>>(
        `${API_ENDPOINTS.profileBookings(userName)}?_venue=true`,
        true
      );
      setBookings(bookingsResponse.data);

      // Fetch venues if venue manager
      if (profileResponse.data.venueManager) {
        const venuesResponse = await apiClient.get<ApiResponse<Venue[]>>(
          API_ENDPOINTS.profileVenues(userName),
          true
        );
        setVenues(venuesResponse.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // If unauthorized, redirect to login
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await apiClient.delete(API_ENDPOINTS.bookingById(bookingId), true);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert('Booking cancelled successfully');
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          {profile.avatar?.url ? (
            <img
              src={profile.avatar.url}
              alt={profile.name}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">
                {profile.name[0].toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}
            {profile.venueManager && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded mt-2">
                Venue Manager
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings ({bookings.length})
            </button>
            {profile.venueManager && (
              <button
                onClick={() => setActiveTab('venues')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'venues'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Venues ({venues.length})
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  You haven't made any bookings yet.
                </p>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.venue?.name || 'Unknown Venue'}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {new Date(booking.dateFrom).toLocaleDateString()} -{' '}
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Guests: {booking.guests}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'venues' && profile.venueManager && (
            <div className="space-y-4">
              {venues.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  You haven't created any venues yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venues.map((venue) => (
                    <div
                      key={venue.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {venue.media?.[0]?.url && (
                        <img
                          src={venue.media[0].url}
                          alt={venue.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {venue.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {venue.description}
                        </p>
                        <p className="text-blue-600 font-bold mt-2">
                          ${venue.price}/night
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
