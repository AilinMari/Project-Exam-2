import VenueList from '../../../components/venue/VenueList';
import { Venue } from '../../../types';

interface MyVenuesSectionProps {
  venues: Venue[];
  onCreateVenue: () => void;
  onEditVenue: (venue: Venue) => void;
  onDeleteVenue: (venueId: string) => void;
}

export default function MyVenuesSection({
  venues,
  onCreateVenue,
  onEditVenue,
  onDeleteVenue,
}: MyVenuesSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-600 flex-shrink-0">
          My Venues
        </h2>
        <button
          onClick={onCreateVenue}
          className="bg-orange-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-orange-700 text-sm sm:text-base whitespace-nowrap"
        >
          + Create Venue
        </button>
      </div>
      <VenueList
        venues={venues}
        onEdit={onEditVenue}
        onDelete={onDeleteVenue}
      />
    </div>
  );
}
