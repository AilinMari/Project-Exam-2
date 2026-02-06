import { Venue } from '../../../types';

export const handleClearFilters = (
  venues: Venue[],
  setSearchQuery: (query: string) => void,
  setLocation: (location: string) => void,
  setGuests: (guests: number | '') => void,
  setDateFrom: (date: string) => void,
  setDateTo: (date: string) => void,
  setHasSearched: (hasSearched: boolean) => void,
  setFilteredVenues: (venues: Venue[]) => void
) => {
  setSearchQuery('');
  setLocation('');
  setGuests('');
  setDateFrom('');
  setDateTo('');
  setHasSearched(false);
  setFilteredVenues(venues);
};
