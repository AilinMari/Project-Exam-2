import { Venue } from '../../../types';

interface VenueHeaderProps {
  venue: Venue;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {venue.name}
        </h1>
        <p className="text-gray-600">
          {venue.location.city && venue.location.country
            ? `${venue.location.city}, ${venue.location.country}`
            : 'Location not specified'}
        </p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-blue-600">
          ${venue.price}
          <span className="text-lg text-gray-600">/night</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Max {venue.maxGuests} guests
        </div>
      </div>
    </div>
  );
}
