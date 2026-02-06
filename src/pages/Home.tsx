import { useState, useEffect } from 'react';
import { Venue } from '../types';
import SearchBar from '../components/SearchBar';
import FeaturedVenuesCarousel from '../components/FeaturedVenuesCarousel';
import { fetchVenues } from './Home/handlers/fetchVenues';
import { handleSearch } from './Home/handlers/handleSearch';
import { handleClearFilters } from './Home/handlers/handleClearFilters';
import HeroSection from './Home/components/HeroSection';
import VenuesSection from './Home/components/VenuesSection';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filter states
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchVenues(setVenues, setFilteredVenues, setFeaturedVenues, setLoading, setError);
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

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
      {/* Hero Header Image with Register Buttons */}
      <HeroSection isLoggedIn={isLoggedIn} />

      {/* Featured Venues Carousel */}
      <FeaturedVenuesCarousel venues={featuredVenues} />

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
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
            onSubmit={(e) => handleSearch(
              e,
              venues,
              searchQuery,
              location,
              guests,
              dateFrom,
              dateTo,
              setHasSearched,
              setFilteredVenues
            )}
            onClearFilters={() => handleClearFilters(
              venues,
              setSearchQuery,
              setLocation,
              setGuests,
              setDateFrom,
              setDateTo,
              setHasSearched,
              setFilteredVenues
            )}
          />
        </div>

        <VenuesSection
          filteredVenues={filteredVenues}
          hasSearched={hasSearched}
          onClearFilters={() => handleClearFilters(
            venues,
            setSearchQuery,
            setLocation,
            setGuests,
            setDateFrom,
            setDateTo,
            setHasSearched,
            setFilteredVenues
          )}
        />
      </div>
    </div>
  );
}
