import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Venue, ApiResponse } from '../types';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<Venue[]>>(
        API_ENDPOINTS.venues
      );
      setVenues(response.data);
      
      // Get top 5 venues with highest rating for featured carousel
      const sortedByRating = [...response.data]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setFeaturedVenues(sortedByRating);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchVenues();
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get<ApiResponse<Venue[]>>(
        `${API_ENDPOINTS.searchVenues}?q=${encodeURIComponent(searchQuery)}`
      );
      setVenues(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
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
      <div className="relative h-[500px] bg-cover bg-center mb-8" 
           style={{ 
             backgroundImage: 'url(/Images/hero.png)'
           }}>
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Search Bar Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <form onSubmit={handleSearch} className="w-full max-w-3xl bg-white shadow-lg mb-8 rounded-md">
            <div className="flex flex-col md:flex-row ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a venue.."
                className="flex-1 px-4 py-3 border rounded-s-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <select className="px-4 py-3 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option>Location</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option>Guests</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option>Dates</option>
              </select>
              <button
                type="submit"
                className="text-slate-500 px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

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
      {featuredVenues.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Venues</h2>
          <div className="relative">
            {/* Previous Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('carousel-container');
                if (container) {
                  container.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all"
              aria-label="Previous venues"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Carousel Container */}
            <div id="carousel-container" className="overflow-x-auto scrollbar-hide scroll-smooth">
              <div className="flex gap-6 pb-4">
                {featuredVenues.map((venue) => (
                  <Link
                    key={venue.id}
                    to={`/venue/${venue.id}`}
                    className="min-w-[300px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0"
                  >
                    <div className="h-48 bg-gray-200 relative">
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
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-bold text-lg">{venue.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Next Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('carousel-container');
                if (container) {
                  container.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all"
              aria-label="Next venues"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All Venues Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Venues
          </h2>
        </div>

        {venues.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No venues found. Try adjusting your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
            <Link
              key={venue.id}
              to={`/venue/${venue.id}`}
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
