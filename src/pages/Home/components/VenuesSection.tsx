import { Venue } from '../../../types';
import VenueCard from '../../../components/venue/VenueCard';

interface VenuesSectionProps {
  filteredVenues: Venue[];
  hasSearched: boolean;
  onClearFilters: () => void;
}

export default function VenuesSection({ 
  filteredVenues, 
  hasSearched, 
  onClearFilters 
}: VenuesSectionProps) {
  return (
    <>
      {/* All Venues Section */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {hasSearched
            ? `Search Results (${filteredVenues.length} ${filteredVenues.length === 1 ? 'venue' : 'venues'})`
            : 'All Venues'
          }
        </h2>
      </div>

      {filteredVenues.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          <p className="text-lg mb-4">No venues found matching your criteria.</p>
          <button
            onClick={onClearFilters}
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
    </>
  );
}
