import { Link } from 'react-router-dom';
import { Venue } from '../../types';

interface VenueCardProps {
  venue: Venue;
}

/**
 * VenueCard component displays a clickable card preview of a venue
 * Shows venue image, name, location, price, and rating
 * @param venue - The venue object to display
 */
export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
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
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {venue.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${venue.price}
            <span className="text-sm text-gray-600">/night</span>
          </span>
          <span className="text-sm text-gray-600">
            Max {venue.maxGuests} guests
          </span>
        </div>
        {venue.location?.city && venue.location?.country && (
          <p className="text-sm text-gray-500 mt-2">
            {venue.location.city}, {venue.location.country}
          </p>
        )}
      </div>
    </Link>
  );
}
