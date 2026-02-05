import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Venue, ApiResponse } from '../types';
import SearchBar from '../components/SearchBar';
import FeaturedVenuesCarousel from '../components/FeaturedVenuesCarousel';
import VenueCard from '../components/venue/VenueCard';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Filter states
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchVenues();
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      // Fetch venues sorted by creation date (newest first)
      const response = await apiClient.get<ApiResponse<Venue[]>>(
        `${API_ENDPOINTS.venues}?sort=created&sortOrder=desc`
      );
      
      console.log('Fetched venues:', response.data);
      console.log('Total venues fetched:', response.data.length);
      console.log('First venue (newest):', response.data[0]);
      console.log('Last venue (oldest):', response.data[response.data.length - 1]);
      
      setVenues(response.data);
      setFilteredVenues(response.data);
      
      // Get top 5 venues with highest rating for featured carousel
      const sortedByRating = [...response.data]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setFeaturedVenues(sortedByRating);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...venues];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(venue =>
        venue.location.city?.toLowerCase().includes(location.toLowerCase()) ||
        venue.location.country?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by guests
    if (guests) {
      filtered = filtered.filter(venue => venue.maxGuests >= guests);
    }

    // Filter by dates (check if venue is available)
    // Note: This is a basic check. For real availability, you'd need to check existing bookings
    if (dateFrom && dateTo) {
      // For now, we'll just show all venues since we don't have booking data in the listing
      // In a real app, you'd fetch bookings and check availability
    }

    setFilteredVenues(filtered);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setGuests('');
    setDateFrom('');
    setDateTo('');
    setFilteredVenues(venues);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading venues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Header Image with Search Overlay */}
      <div className="relative h-[600px] sm:h-[550px] lg:h-[500px] bg-cover bg-center" 
           style={{ 
             backgroundImage: 'url(/Images/hero.png)'
           }}>
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Search Bar Overlay */}
        <div className="relative z-10 flex flex-col items-center py-8 sm:py-12 lg:py-16 h-full px-4">
          <SearchBar
            searchQuery={searchQuery}
            location={location}
            guests={guests}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onSearchQueryChange={setSearchQuery}
            onLocationChange={setLocation}
            onGuestsChange={setGuests}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onSubmit={handleSearch}
            onClearFilters={handleClearFilters}
          />

          {/* Register Buttons - Only show when not logged in */}
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none justify-center">
              <Link
                to="/register"
                state={{ tab: 'customer' }}
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-md hover:bg-blue-700 font-medium text-center"
              >
                Register as a Customer
              </Link>
              <Link
                to="/register"
                state={{ tab: 'manager' }}
                className="bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-md hover:bg-orange-700 font-medium text-center"
              >
                Register as a Venue Manager
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Featured Venues Carousel */}
      <div className="mt-8 sm:mt-12 lg:mt-0">
        <FeaturedVenuesCarousel venues={featuredVenues} />
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All Venues Section */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            All Venues {filteredVenues.length !== venues.length && `(${filteredVenues.length} of ${venues.length})`}
          </h2>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p className="text-lg mb-4">No venues found matching your criteria.</p>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters and show all venues
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
