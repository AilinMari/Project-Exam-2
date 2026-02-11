import { Venue } from '../../../types';

interface VenueHeaderProps {
  venue: Venue;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6 gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
          {venue.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {venue.location.city && venue.location.country
            ? `${venue.location.city}, ${venue.location.country}`
            : 'Location not specified'}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600">
          ${venue.price}
          <span className="text-base sm:text-lg text-gray-600">/night</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1 whitespace-nowrap">
          Max {venue.maxGuests} guests
        </div>
      </div>
    </div>
  );
}
