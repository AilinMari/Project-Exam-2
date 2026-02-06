import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile, Booking, Venue, UpdateProfileData, CreateVenueData } from '../types';
import EditProfileModal from '../components/modals/EditProfileModal';
import VenueFormModal from '../components/modals/VenueFormModal';
import ProfileHeader from '../components/profile/ProfileHeader';
import CustomerBookingsSection from '../components/profile/CustomerBookingsSection';
import VenueBookingsSection from '../components/profile/VenueBookingsSection';
import ProfileCalendarSection from '../components/profile/ProfileCalendarSection';
import { fetchData } from './Profile/handlers/fetchData';
import { handleUpdateProfile } from './Profile/handlers/handleUpdateProfile';
import { handleCreateVenue } from './Profile/handlers/handleCreateVenue';
import { handleUpdateVenue } from './Profile/handlers/handleUpdateVenue';
import { handleDeleteVenue } from './Profile/handlers/handleDeleteVenue';
import { handleDeleteBooking } from './Profile/handlers/handleDeleteBooking';
import MyVenuesSection from './Profile/components/MyVenuesSection';

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

    fetchData(userName, setProfile, setBookings, setVenues, setLoading);
  }, [navigate]);

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
                <MyVenuesSection
                  venues={venues}
                  onCreateVenue={() => setShowCreateVenueModal(true)}
                  onEditVenue={(venue) => {
                    setEditingVenue(venue);
                    setShowEditVenueModal(true);
                  }}
                  onDeleteVenue={(venueId) => handleDeleteVenue(venueId, venues, setVenues)}
                />
              </>
            ) : (
              /* Customer: Show personal bookings */
              <CustomerBookingsSection 
                bookings={bookings}
                isManager={profile.venueManager ?? false}
                onDeleteBooking={(bookingId) => handleDeleteBooking(bookingId, bookings, setBookings)}
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
        onSubmit={(data) => handleUpdateProfile(data, profile, setProfile)}
        initialData={editProfileData}
      />

      <VenueFormModal
        isOpen={showCreateVenueModal}
        onClose={() => setShowCreateVenueModal(false)}
        onSubmit={(formData) => handleCreateVenue(
          formData,
          venues,
          setVenues,
          setShowCreateVenueModal,
          setCreatingVenue
        )}
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
        onSubmit={(formData) => handleUpdateVenue(
          formData,
          editingVenue,
          venues,
          setVenues,
          setShowEditVenueModal,
          setEditingVenue,
          setUpdatingVenue
        )}
        initialData={editVenueData}
        title="Edit Venue"
        submitButtonText="Update Venue"
        isSubmitting={updatingVenue}
      />
    </div>
  );
}
