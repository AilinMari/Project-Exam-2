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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userName = localStorage.getItem('userName');

    if (!token || !userName) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile with bookings and venues included
        const profileResponse = await apiClient.get<ApiResponse<Profile>>(
          `${API_ENDPOINTS.profileByName(userName)}?_bookings=true&_venues=true`,
          true
        );
        setProfile(profileResponse.data);

        // Fetch bookings separately with venue details
        try {
          const bookingsResponse = await apiClient.get<ApiResponse<Booking[]>>(
            `${API_ENDPOINTS.profileBookings(userName)}?_venue=true`,
            true
          );
          setBookings(bookingsResponse.data);
        } catch (bookingErr) {
          console.warn('Could not fetch bookings:', bookingErr);
          setBookings([]);
        }

        // Fetch venues if venue manager
        if (profileResponse.data.venueManager) {
          try {
            const venuesResponse = await apiClient.get<ApiResponse<Venue[]>>(
              `${API_ENDPOINTS.profileVenues(userName)}?_bookings=true`,
              true
            );
            setVenues(venuesResponse.data);
          } catch (venueErr) {
            console.warn('Could not fetch venues:', venueErr);
            setVenues([]);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // If unauthorized, redirect to login
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userName');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await apiClient.delete(API_ENDPOINTS.bookingById(bookingId), true);
      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert('Booking cancelled successfully');
    } catch {
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 inline-block">
            <div className="flex items-center gap-4">
              {profile.avatar?.url ? (
                <img
                  src={profile.avatar.url}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {profile.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello,<br />{profile.name}!
                </h1>
                <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                  Change Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Manage My Venues */}
          {profile.venueManager && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="bg-red-100 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Manage My Venues</h2>
              </div>
              <div className="p-6 space-y-3">
                {venues.length === 0 ? (
                  <p className="text-gray-600 text-sm">No venues yet</p>
                ) : (
                  venues.map((venue) => (
                    <div key={venue.id} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{venue.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Edit
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button className="w-full text-left text-blue-600 hover:text-blue-800 font-medium text-sm mt-4">
                  + Add New Venue
                </button>
              </div>
            </div>
          )}

          {/* Admin Tools */}
          {profile.venueManager && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="bg-orange-100 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Admin Tools</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-gray-900 font-medium">Create Venue</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-gray-900 font-medium">Manage bookings</span>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900 font-medium">Update Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Venue Bookings - For Customers */}
          {!profile.venueManager && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="bg-blue-100 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
              </div>
              <div className="p-6 space-y-3">
                {bookings.length === 0 ? (
                  <p className="text-gray-600 text-sm">No bookings yet</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{booking.venue?.name || 'Venue'}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Venue Bookings - For Managers */}
          {profile.venueManager && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="bg-red-100 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Venue Bookings</h2>
              </div>
              <div className="p-6 space-y-3">
                {bookings.length === 0 ? (
                  <p className="text-gray-600 text-sm">No bookings yet</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">John Doe</p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.dateFrom).toLocaleDateString()} - {new Date(booking.dateTo).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Calendar */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-blue-50 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Calendar</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="text-center text-sm font-medium text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2; // Start from a specific day offset
                const isToday = day === 15;
                return (
                  <div
                    key={i}
                    className={`aspect-square border border-gray-200 flex items-center justify-center text-sm ${
                      day < 1 || day > 31
                        ? 'text-gray-300'
                        : isToday
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {day > 0 && day <= 31 ? day : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
