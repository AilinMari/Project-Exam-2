import { Link } from 'react-router-dom';
import { Venue } from '../../types';

interface VenueListProps {
  venues: Venue[];
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
}

export default function VenueList({ venues, onEdit, onDelete }: VenueListProps) {
  if (venues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You haven't created any venues yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {venues.map((venue) => (
        <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Link to={`/venues/${venue.id}`}>
            <div className="h-48 bg-gray-200">
              {venue.media?.[0]?.url ? (
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt || venue.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
          </Link>
          
          <div className="p-4">
            <Link to={`/venues/${venue.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2">
                {venue.name}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {venue.description}
            </p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xl font-bold text-red-600">
                ${venue.price}
                <span className="text-sm text-gray-600">/night</span>
              </span>
              <span className="text-sm text-gray-600">
                Max {venue.maxGuests} guests
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(venue)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(venue.id)}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
