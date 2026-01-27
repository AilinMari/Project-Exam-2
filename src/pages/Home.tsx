import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Venue, ApiResponse } from '../types';
import SearchBar from '../components/SearchBar';
import FeaturedVenuesCarousel from '../components/FeaturedVenuesCarousel';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchVenues();
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
      <div className="relative h-[500px] bg-cover bg-center" 
           style={{ 
             backgroundImage: 'url(/Images/hero.png)'
           }}>
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Search Bar Overlay */}
        <div className="relative z-10 flex flex-col items-center py-16 h-full px-4">
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

          {/* Register Buttons */}
          <div className="flex gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Register as a Customer
            </Link>
            <Link
              to="/register"
              className="bg-orange-600 text-white px-8 py-3 rounded-md hover:bg-orange-700 font-medium"
            >
              Register as a Venue Manager
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Venues Carousel */}
      <FeaturedVenuesCarousel venues={featuredVenues} />

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
            <Link
              key={venue.id}
              to={`/venues/${venue.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gray-200">
                {venue.media?.[0]?.url ? (
                  <img
                    src={venue.media[0].url}
                    alt={venue.media[0].alt || venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {venue.name}
                </h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {venue.description}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    ${venue.price}
                    <span className="text-sm text-gray-600">/night</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Max {venue.maxGuests} guests
                  </div>
                </div>

                <div className="flex gap-2 mt-3 text-xs">
                  {venue.meta.wifi && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      WiFi
                    </span>
                  )}
                  {venue.meta.parking && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Parking
                    </span>
                  )}
                  {venue.meta.breakfast && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Breakfast
                    </span>
                  )}
                  {venue.meta.pets && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Pets
                    </span>
                  )}
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
