import { Venue } from '../../../types';
import { applyFilters } from './applyFilters';

export const handleSearch = (
  e: React.FormEvent,
  venues: Venue[],
  searchQuery: string,
  location: string,
  guests: number | '',
  dateFrom: string,
  dateTo: string,
  setHasSearched: (hasSearched: boolean) => void,
  setFilteredVenues: (venues: Venue[]) => void
) => {
  e.preventDefault();
  setHasSearched(true);
  applyFilters(venues, searchQuery, location, guests, dateFrom, dateTo, setFilteredVenues);
};
