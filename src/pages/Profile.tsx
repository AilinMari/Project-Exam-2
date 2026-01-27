import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Profile, Booking, Venue, ApiResponse, UpdateProfileData, CreateVenueData } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateProfileData>({
    bio: '',
    avatar: { url: '', alt: '' },
    banner: { url: '', alt: '' },
  });
  const [saving, setSaving] = useState(false);
  
  // Create Venue Modal State
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  const [venueFormData, setVenueFormData] = useState<CreateVenueData>({
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
  });
  const [creatingVenue, setCreatingVenue] = useState(false);

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

  const handleOpenEditModal = () => {
    if (profile) {
      setEditFormData({
        bio: profile.bio || '',
        avatar: profile.avatar || { url: '', alt: '' },
        banner: profile.banner || { url: '', alt: '' },
      });
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const userName = localStorage.getItem('userName');
      if (!userName) return;

      // Prepare update data - only include fields that have values
      const updateData: UpdateProfileData = {};
      
      if (editFormData.bio) {
        updateData.bio = editFormData.bio;
      }
      
      if (editFormData.avatar?.url) {
        updateData.avatar = {
          url: editFormData.avatar.url,
          alt: editFormData.avatar.alt || profile.name,
        };
      }
      
      if (editFormData.banner?.url) {
        updateData.banner = {
          url: editFormData.banner.url,
          alt: editFormData.banner.alt || `${profile.name} banner`,
        };
      }

      console.log('Updating profile with:', updateData);

      const response = await apiClient.put<ApiResponse<Profile>>(
        API_ENDPOINTS.updateProfile(userName),
        updateData,
        true
      );

      setProfile(response.data);
      setShowEditModal(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreateVenueModal = () => {
    setShowCreateVenueModal(true);
  };

  const handleCloseCreateVenueModal = () => {
    setShowCreateVenueModal(false);
    // Reset form
    setVenueFormData({
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
    });
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingVenue(true);

    try {
      const response = await apiClient.post<ApiResponse<Venue>>(
        API_ENDPOINTS.venues,
        venueFormData,
        true
      );

      console.log('Venue created:', response.data);
      
      // Add the new venue to the venues list
      setVenues([...venues, response.data]);
      setShowCreateVenueModal(false);
      alert('Venue created successfully!');
      
      // Reset form
      handleCloseCreateVenueModal();
    } catch (err) {
      console.error('Error creating venue:', err);
      alert('Failed to create venue. Please try again.');
    } finally {
      setCreatingVenue(false);
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
                  onClick={handleOpenEditModal}
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
                <button 
                  onClick={handleOpenCreateVenueModal}
                  className="w-full text-left text-red-600 hover:text-red-800 font-medium text-sm mt-4">
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
                <button 
                  onClick={handleOpenCreateVenueModal}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
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
                <button 
                  onClick={handleOpenEditModal}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
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
                        <button className="text-sm bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
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
          <div className={`px-6 py-3 border-b ${
            profile.venueManager ? 'bg-red-50' : 'bg-blue-50'
          }`}>
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
                        ? `${profile.venueManager ? 'bg-red-600' : 'bg-blue-600'} text-white font-bold`
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

      {/* Create Venue Modal */}
      {showCreateVenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Venue</h2>
                <button
                  onClick={handleCloseCreateVenueModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateVenue} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={venueFormData.name}
                      onChange={(e) => setVenueFormData({ ...venueFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      placeholder="Beautiful Beach House"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={venueFormData.description}
                      onChange={(e) => setVenueFormData({ ...venueFormData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      placeholder="Describe your venue..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Night *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={venueFormData.price}
                        onChange={(e) => setVenueFormData({ ...venueFormData, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Guests *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={venueFormData.maxGuests}
                        onChange={(e) => setVenueFormData({ ...venueFormData, maxGuests: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Image URLs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
                    <div className="space-y-3">
                      {venueFormData.media && venueFormData.media.length > 0 ? (
                        venueFormData.media.map((image, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="url"
                              value={image.url}
                              onChange={(e) => {
                                const newMedia = [...venueFormData.media!];
                                newMedia[index] = { url: e.target.value, alt: venueFormData.name || 'Venue image' };
                                setVenueFormData({ ...venueFormData, media: newMedia });
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                              placeholder="https://example.com/venue-image.jpg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newMedia = venueFormData.media!.filter((_, i) => i !== index);
                                setVenueFormData({ ...venueFormData, media: newMedia });
                              }}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No images added yet</div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newMedia = [...(venueFormData.media || []), { url: '', alt: venueFormData.name || 'Venue image' }];
                          setVenueFormData({ ...venueFormData, media: newMedia });
                        }}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-red-500 hover:text-red-600"
                      >
                        + Add Image URL
                      </button>
                    </div>
                    
                    {/* Image Previews */}
                    {venueFormData.media && venueFormData.media.some(img => img.url) && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="grid grid-cols-2 gap-3">
                          {venueFormData.media
                            .filter(img => img.url)
                            .map((image, index) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={`Venue preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Amenities</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={venueFormData.meta?.wifi}
                        onChange={(e) => setVenueFormData({
                          ...venueFormData,
                          meta: { ...venueFormData.meta!, wifi: e.target.checked }
                        })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">WiFi</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={venueFormData.meta?.parking}
                        onChange={(e) => setVenueFormData({
                          ...venueFormData,
                          meta: { ...venueFormData.meta!, parking: e.target.checked }
                        })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Parking</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={venueFormData.meta?.breakfast}
                        onChange={(e) => setVenueFormData({
                          ...venueFormData,
                          meta: { ...venueFormData.meta!, breakfast: e.target.checked }
                        })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Breakfast</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={venueFormData.meta?.pets}
                        onChange={(e) => setVenueFormData({
                          ...venueFormData,
                          meta: { ...venueFormData.meta!, pets: e.target.checked }
                        })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Pets Allowed</span>
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={venueFormData.location?.city || ''}
                        onChange={(e) => setVenueFormData({
                          ...venueFormData,
                          location: { ...venueFormData.location!, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={venueFormData.location?.country || ''}
                        onChange={(e) => setVenueFormData({
                          ...venueFormData,
                          location: { ...venueFormData.location!, country: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseCreateVenueModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={creatingVenue}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 ${
                      creatingVenue ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={creatingVenue}
                  >
                    {creatingVenue ? 'Creating...' : 'Create Venue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editFormData.avatar?.url || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        avatar: { ...editFormData.avatar, url: e.target.value, alt: profile?.name || '' },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {editFormData.avatar?.url && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={editFormData.avatar.url}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Banner URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner URL
                  </label>
                  <input
                    type="url"
                    value={editFormData.banner?.url || ''}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        banner: { ...editFormData.banner, url: e.target.value, alt: profile?.name ? `${profile.name} banner` : '' },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="https://example.com/banner.jpg"
                  />
                  {editFormData.banner?.url && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={editFormData.banner.url}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white ${
                      profile?.venueManager
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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
