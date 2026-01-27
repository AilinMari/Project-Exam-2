import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Venue, ApiResponse, CreateVenueData } from '../types';

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    dateFrom: '',
    dateTo: '',
    guests: 1,
  });
  const [editFormData, setEditFormData] = useState<CreateVenueData>({
    name: '',
    description: '',
    media: [],
    price: 0,
    maxGuests: 1,
    rating: 0,
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
  });
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    setCurrentUser(userName);
  }, []);

  useEffect(() => {
    if (venue) {
      setEditFormData({
        name: venue.name,
        description: venue.description,
        media: venue.media || [],
        price: venue.price,
        maxGuests: venue.maxGuests,
        rating: venue.rating || 0,
        meta: venue.meta,
        location: venue.location,
      });
    }
  }, [venue]);

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

  const handleUpdateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await apiClient.put(
        API_ENDPOINTS.venueById(id),
        editFormData,
        true
      );
      alert('Venue updated successfully!');
      setShowEditModal(false);
      fetchVenue();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update venue');
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

  const addMediaField = () => {
    setEditFormData({
      ...editFormData,
      media: [...(editFormData.media || []), { url: '', alt: '' }],
    });
  };

  const removeMediaField = (index: number) => {
    setEditFormData({
      ...editFormData,
      media: (editFormData.media || []).filter((_, i) => i !== index),
    });
  };

  const updateMediaField = (index: number, field: 'url' | 'alt', value: string) => {
    const updatedMedia = [...(editFormData.media || [])];
    updatedMedia[index] = { ...updatedMedia[index], [field]: value };
    setEditFormData({ ...editFormData, media: updatedMedia });
  };

  const isOwner = venue?.owner?.name === currentUser;

  const handlePrevImage = useCallback(() => {
    if (venue?.media && venue.media.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? venue.media.length - 1 : prev - 1));
    }
  }, [venue?.media]);

  const handleNextImage = useCallback(() => {
    if (venue?.media && venue.media.length > 0) {
      setCurrentImageIndex((prev) => (prev === venue.media.length - 1 ? 0 : prev + 1));
    }
  }, [venue?.media]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevImage, handleNextImage]);

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
        {/* Image Carousel */}
        <div className="relative h-96 bg-gray-200">
          {venue.media && venue.media.length > 0 ? (
            <>
              <img
                src={venue.media[currentImageIndex].url}
                alt={venue.media[currentImageIndex].alt || `${venue.name} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {venue.media.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {venue.media.length}
              </div>

              {/* Dot Indicators */}
              {venue.media.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {venue.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
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

          {/* Host Information */}
          {venue.owner && (
            <div className="mb-6 pb-4 border-b">
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
            <div className="flex gap-3 mb-6">
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

          <div className="border-t border-b py-4 my-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Amenities</h2>
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
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {venue.description}
            </p>
          </div>

          <div className="mt-12">
            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
              >
                Book Now
              </button>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-600">Book Your Stay</h2>
                
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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

      {/* Edit Venue Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Venue</h2>
              <form onSubmit={handleUpdateVenue} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, price: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Guests *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.maxGuests}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, maxGuests: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  {(editFormData.media || []).map((media, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={media.url}
                        onChange={(e) => updateMediaField(index, 'url', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                      <input
                        type="text"
                        placeholder="Alt text"
                        value={media.alt}
                        onChange={(e) => updateMediaField(index, 'alt', e.target.value)}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeMediaField(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMediaField}
                    className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Add Image
                  </button>
                  {editFormData.media && editFormData.media.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {editFormData.media.map((media, index) => (
                        media.url && (
                          <div key={index} className="relative">
                            <img
                              src={media.url}
                              alt={media.alt || `Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                              }}
                            />
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.meta?.wifi || false}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            meta: { ...editFormData.meta, wifi: e.target.checked },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">WiFi</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.meta?.parking || false}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            meta: { ...editFormData.meta, parking: e.target.checked },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Parking</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.meta?.breakfast || false}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            meta: { ...editFormData.meta, breakfast: e.target.checked },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Breakfast</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editFormData.meta?.pets || false}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            meta: { ...editFormData.meta, pets: e.target.checked },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Pets Allowed</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={editFormData.location?.city || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: { ...editFormData.location, city: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={editFormData.location?.country || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: { ...editFormData.location, country: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Update Venue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
