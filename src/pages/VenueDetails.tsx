import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Venue, ApiResponse, CreateVenueData } from '../types';
import ImageCarousel from '../components/venue/ImageCarousel';
import BookingForm from '../components/venue/BookingForm';
import VenueFormModal from '../components/modals/VenueFormModal';
import BookingCalendar from '../components/booking/BookingCalendar';

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

  const fetchVenue = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchVenue();
    }
  }, [id, fetchVenue]);

  const handleBooking = async (bookingData: { dateFrom: string; dateTo: string; guests: number }) => {
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

  const handleUpdateVenue = async (formData: CreateVenueData) => {
    if (!id) return;

    setUpdatingVenue(true);
    try {
      await apiClient.put(
        API_ENDPOINTS.venueById(id),
        formData,
        true
      );
      alert('Venue updated successfully!');
      setShowEditModal(false);
      fetchVenue();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update venue');
      throw err;
    } finally {
      setUpdatingVenue(false);
    }
  };

  const handleDeleteVenue = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(API_ENDPOINTS.venueById(id), true);
      alert('Venue deleted successfully!');
      navigate('/profile');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete venue');
    }
  };

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
          <div className="flex justify-between items-start mb-6">
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

          {/* Content & Calendar Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Venue Information */}
            <div className="space-y-6">
              {/* Amenities */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-900">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {venue.meta.wifi && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                      WiFi
                    </span>
                  )}
                  {venue.meta.parking && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                      Parking
                    </span>
                  )}
                  {venue.meta.breakfast && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
                      Breakfast
                    </span>
                  )}
                  {venue.meta.pets && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                      Pets Allowed
                    </span>
                  )}
                </div>
              </div>

              {/* Host Information */}
              {venue.owner && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">Hosted by</h2>
                  <div className="flex items-center gap-3">
                    {venue.owner.avatar?.url ? (
                      <img
                        src={venue.owner.avatar.url}
                        alt={venue.owner.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {venue.owner.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{venue.owner.name}</p>
                      {venue.owner.bio && (
                        <p className="text-sm text-gray-600">{venue.owner.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Owner actions */}
              {isOwner && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit Venue
                  </button>
                  <button
                    onClick={handleDeleteVenue}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete Venue
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-900">Description</h2>
                <p className="text-gray-700 whitespace-pre-line text-sm">
                  {venue.description}
                </p>
              </div>
            </div>

            {/* Right: Availability Calendar */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Availability</h3>
              <BookingCalendar bookings={venue.bookings || []} />
            </div>
          </div>

          {/* Booking Section - Full Width */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {!isLoggedIn ? (
              // Not logged in - show login prompt
              <div className="text-center py-4">
                <p className="text-gray-700 mb-3">Please log in to make a booking</p>
                <button
                  onClick={() => navigate('/login')}
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
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
              >
                Book Now
              </button>
            ) : (
              // Show booking form
              <BookingForm
                maxGuests={venue.maxGuests}
                onSubmit={handleBooking}
                onCancel={() => setShowBookingForm(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Venue Modal */}
      <VenueFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateVenue}
        initialData={editFormData}
        title="Edit Venue"
        submitButtonText="Update Venue"
        isSubmitting={updatingVenue}
      />
    </div>
  );
}
