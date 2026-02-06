import { Venue } from '../../../types';

export const applyFilters = (
  venues: Venue[],
  searchQuery: string,
  location: string,
  guests: number | '',
  dateFrom: string,
  dateTo: string,
  setFilteredVenues: (venues: Venue[]) => void
) => {
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
