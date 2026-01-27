import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Profile, Booking, Venue, ApiResponse, UpdateProfileData, CreateVenueData } from '../types';
import EditProfileModal from '../components/modals/EditProfileModal';
import VenueFormModal from '../components/modals/VenueFormModal';
import VenueList from '../components/venue/VenueList';
import BookingCalendar from '../components/booking/BookingCalendar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  const [showEditVenueModal, setShowEditVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [creatingVenue, setCreatingVenue] = useState(false);
  const [updatingVenue, setUpdatingVenue] = useState(false);

  const emptyVenueFormData: CreateVenueData = {
    name: '',
    description: '',
    price: 0,
    maxGuests: 1,
    rating: 0,
    media: [],
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: '',
      city: '',
      zip: '',
      country: '',
      continent: '',
      lat: 0,
      lng: 0,
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userName = localStorage.getItem('userName');

    if (!token || !userName) {
      navigate('/login');
      return;
    }

    fetchData(userName);
  }, [navigate]);

  const fetchData = async (userName: string) => {
    try {
      setLoading(true);
      
      // Fetch profile with bookings and venues
      const profileResponse = await apiClient.get<ApiResponse<Profile>>(
        `${API_ENDPOINTS.profileByName(userName)}?_bookings=true&_venues=true`,
        true
      );
      setProfile(profileResponse.data);

      // Fetch bookings with venue details
      try {
        const bookingsResponse = await apiClient.get<ApiResponse<Booking[]>>(
          `${API_ENDPOINTS.profileBookings(userName)}?_venue=true`,
          true
        );
        setBookings(bookingsResponse.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      }

      // Fetch venues if user is a venue manager
      if (profileResponse.data.venueManager) {
        try {
          const venuesResponse = await apiClient.get<ApiResponse<Venue[]>>(
            API_ENDPOINTS.profileVenues(userName),
            true
          );
          setVenues(venuesResponse.data || []);
        } catch (err) {
          console.error('Error fetching venues:', err);
          setVenues([]);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    if (!profile) return;

    try {
      const userName = localStorage.getItem('userName');
      if (!userName) return;

      const updateData: UpdateProfileData = {};
      
      if (data.bio) updateData.bio = data.bio;
      if (data.avatar?.url) {
        updateData.avatar = {
          url: data.avatar.url,
          alt: data.avatar.alt || profile.name,
        };
      }
      if (data.banner?.url) {
        updateData.banner = {
          url: data.banner.url,
          alt: data.banner.alt || `${profile.name} banner`,
        };
      }

      const response = await apiClient.put<ApiResponse<Profile>>(
        API_ENDPOINTS.updateProfile(userName),
        updateData,
        true
      );

      setProfile(response.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
      throw err;
    }
  };

  const handleCreateVenue = async (formData: CreateVenueData) => {
    setCreatingVenue(true);
    try {
      const response = await apiClient.post<ApiResponse<Venue>>(
        API_ENDPOINTS.venues,
        formData,
        true
      );

      setVenues([...venues, response.data]);
      setShowCreateVenueModal(false);
      alert('Venue created successfully!');
    } catch (err) {
      console.error('Error creating venue:', err);
      alert('Failed to create venue. Please try again.');
      throw err;
    } finally {
      setCreatingVenue(false);
    }
  };

  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setShowEditVenueModal(true);
  };

  const handleUpdateVenue = async (formData: CreateVenueData) => {
    if (!editingVenue) return;

    setUpdatingVenue(true);
    try {
      const response = await apiClient.put<ApiResponse<Venue>>(
        API_ENDPOINTS.venueById(editingVenue.id),
        formData,
        true
      );

      setVenues(venues.map(v => v.id === editingVenue.id ? response.data : v));
      setShowEditVenueModal(false);
      setEditingVenue(null);
      alert('Venue updated successfully!');
    } catch (err) {
      console.error('Error updating venue:', err);
      alert('Failed to update venue. Please try again.');
      throw err;
    } finally {
      setUpdatingVenue(false);
    }
  };

  const handleDeleteVenue = async (venueId: string) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;

    try {
      await apiClient.delete(API_ENDPOINTS.venueById(venueId), true);
      setVenues(venues.filter(v => v.id !== venueId));
      alert('Venue deleted successfully!');
    } catch (err) {
      console.error('Error deleting venue:', err);
      alert('Failed to delete venue. Please try again.');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await apiClient.delete(API_ENDPOINTS.bookingById(bookingId), true);
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('Booking deleted successfully!');
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking. Please try again.');
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

  const editProfileData: UpdateProfileData = {
    bio: profile.bio || '',
    avatar: profile.avatar || { url: '', alt: '' },
    banner: profile.banner || { url: '', alt: '' },
  };

  const editVenueData: CreateVenueData = editingVenue ? {
    name: editingVenue.name,
    description: editingVenue.description,
    media: editingVenue.media || [],
    price: editingVenue.price,
    maxGuests: editingVenue.maxGuests,
    rating: editingVenue.rating || 0,
    meta: editingVenue.meta,
    location: editingVenue.location,
  } : emptyVenueFormData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className={`py-12 ${profile.venueManager ? 'bg-red-500' : 'bg-blue-600'}`}>
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
                <h1 className={`text-2xl font-bold ${
                  profile.venueManager ? 'text-red-600' : 'text-blue-600'
                }`}>
                  Hello,<br />{profile.name}!
                </h1>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className={`mt-2 text-white px-4 py-1 rounded text-sm ${
                    profile.venueManager 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings List - Left Side (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* My Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className={`text-2xl font-bold mb-4 ${
                profile.venueManager ? 'text-red-600' : 'text-blue-600'
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
                          className={`text-xs px-2 py-1 rounded ${
                            profile.venueManager 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          title="View venue"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
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

            {/* Upcoming Booking */}
            {bookings.length > 0 && (() => {
              const upcomingBooking = bookings
                .filter(b => new Date(b.dateFrom) >= new Date())
                .sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime())[0];
              
              return upcomingBooking ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className={`text-lg font-bold mb-4 ${
                    profile.venueManager ? 'text-red-600' : 'text-blue-600'
                  }`}>
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
                      <h3 className={`font-bold text-lg ${
                        profile.venueManager ? 'text-red-600' : 'text-blue-600'
                      }`}>
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
                      className={`w-full py-2 px-4 rounded text-white ${
                        profile.venueManager 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Bookings Calendar - Right Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {bookings.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className={`text-2xl font-bold mb-4 ${
                  profile.venueManager ? 'text-red-600' : 'text-blue-600'
                }`}>
                  Calendar
                </h2>
                <BookingCalendar bookings={bookings} />
              </div>
            )}
          </div>
        </div>

        {/* Venues Section (Only for Venue Managers) */}
        {profile.venueManager && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-600">
                My Venues
              </h2>
              <button
                onClick={() => setShowCreateVenueModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                + Create Venue
              </button>
            </div>
            <VenueList
              venues={venues}
              onEdit={handleEditVenue}
              onDelete={handleDeleteVenue}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateProfile}
        initialData={editProfileData}
      />

      <VenueFormModal
        isOpen={showCreateVenueModal}
        onClose={() => setShowCreateVenueModal(false)}
        onSubmit={handleCreateVenue}
        initialData={emptyVenueFormData}
        title="Create New Venue"
        submitButtonText="Create Venue"
        isSubmitting={creatingVenue}
      />

      <VenueFormModal
        isOpen={showEditVenueModal}
        onClose={() => {
          setShowEditVenueModal(false);
          setEditingVenue(null);
        }}
        onSubmit={handleUpdateVenue}
        initialData={editVenueData}
        title="Edit Venue"
        submitButtonText="Update Venue"
        isSubmitting={updatingVenue}
      />
    </div>
  );
}
