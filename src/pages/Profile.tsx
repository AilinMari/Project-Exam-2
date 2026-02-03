import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Profile, Booking, Venue, ApiResponse, UpdateProfileData, CreateVenueData } from '../types';
import EditProfileModal from '../components/modals/EditProfileModal';
import VenueFormModal from '../components/modals/VenueFormModal';
import VenueList from '../components/venue/VenueList';
import ProfileHeader from '../components/profile/ProfileHeader';
import CustomerBookingsSection from '../components/profile/CustomerBookingsSection';
import VenueBookingsSection from '../components/profile/VenueBookingsSection';
import ProfileCalendarSection from '../components/profile/ProfileCalendarSection';

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
            `${API_ENDPOINTS.profileVenues(userName)}?_bookings=true`,
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
      <ProfileHeader 
        profile={profile} 
        onEditClick={() => setShowEditModal(true)} 
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {profile.venueManager ? (
              /* Venue Manager: Show venue bookings and venues */
              <>
                <VenueBookingsSection venues={venues} />
                {/* My Venues */}
                <div className="bg-white rounded-lg shadow-md p-6">
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
              </>
            ) : (
              /* Customer: Show personal bookings */
              <CustomerBookingsSection 
                bookings={bookings}
                isManager={profile.venueManager ?? false}
                onDeleteBooking={handleDeleteBooking}
              />
            )}
          </div>

          {/* Calendar - Right Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileCalendarSection 
              bookings={bookings}
              venues={venues}
              isManager={profile.venueManager ?? false}
            />
          </div>
        </div>
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
