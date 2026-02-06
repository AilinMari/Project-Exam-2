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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-red-600">
          My Venues
        </h2>
        <button
          onClick={onCreateVenue}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
