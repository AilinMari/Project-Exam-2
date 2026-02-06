import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Venue, CreateVenueData } from '../types';
import ImageCarousel from '../components/venue/ImageCarousel';
import VenueFormModal from '../components/modals/VenueFormModal';
import { fetchVenue } from './VenueDetails/handlers/fetchVenue';
import { handleBooking } from './VenueDetails/handlers/handleBooking';
import { handleUpdateVenue } from './VenueDetails/handlers/handleUpdateVenue';
import { handleDeleteVenue } from './VenueDetails/handlers/handleDeleteVenue';
import VenueHeader from './VenueDetails/components/VenueHeader';
import AmenitiesSection from './VenueDetails/components/AmenitiesSection';
import HostInfoSection from './VenueDetails/components/HostInfoSection';
import OwnerActions from './VenueDetails/components/OwnerActions';
import DescriptionSection from './VenueDetails/components/DescriptionSection';
import CalendarSection from './VenueDetails/components/CalendarSection';
import BookingSection from './VenueDetails/components/BookingSection';

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingVenue, setUpdatingVenue] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('accessToken');
    const venueManager = localStorage.getItem('venueManager') === 'true';
    setCurrentUser(userName);
    setIsLoggedIn(!!token);
    setIsVenueManager(venueManager);
  }, []);

  const fetchVenueCallback = useCallback(async () => {
    if (!id) return;
    await fetchVenue(id, setVenue, setLoading, setError);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVenueCallback();
    }
  }, [id, fetchVenueCallback]);

  const isOwner = venue?.owner?.name === currentUser;

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

  const editFormData: CreateVenueData = {
    name: venue.name,
    description: venue.description,
    media: venue.media || [],
    price: venue.price,
    maxGuests: venue.maxGuests,
    rating: venue.rating || 0,
    meta: venue.meta,
    location: venue.location,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <ImageCarousel images={venue.media || []} venueName={venue.name} />

        <div className="p-6">
          <VenueHeader venue={venue} />

          {/* Content & Calendar Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Venue Information */}
            <div className="space-y-6">
              <AmenitiesSection meta={venue.meta} />
              <HostInfoSection owner={venue.owner} />
              
              {isOwner && (
                <OwnerActions
                  onEdit={() => setShowEditModal(true)}
                  onDelete={() => handleDeleteVenue(id, navigate)}
                />
              )}

              <DescriptionSection description={venue.description} />
            </div>

            {/* Right: Availability Calendar */}
            <CalendarSection bookings={venue.bookings || []} />
          </div>

          {/* Booking Section - Full Width */}
          <BookingSection
            isLoggedIn={isLoggedIn}
            isVenueManager={isVenueManager}
            showBookingForm={showBookingForm}
            maxGuests={venue.maxGuests}
            existingBookings={venue.bookings || []}
            onShowBookingForm={() => setShowBookingForm(true)}
            onBooking={(bookingData) => handleBooking(
              bookingData,
              id,
              navigate,
              setShowBookingForm,
              fetchVenueCallback
            )}
            onCancelBooking={() => setShowBookingForm(false)}
            onNavigateToLogin={() => navigate('/login')}
          />
        </div>
      </div>

      {/* Edit Venue Modal */}
      <VenueFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={(formData) => handleUpdateVenue(
          formData,
          id,
          setUpdatingVenue,
          setShowEditModal,
          fetchVenueCallback
        )}
        initialData={editFormData}
        title="Edit Venue"
        submitButtonText="Update Venue"
        isSubmitting={updatingVenue}
      />
    </div>
  );
}
