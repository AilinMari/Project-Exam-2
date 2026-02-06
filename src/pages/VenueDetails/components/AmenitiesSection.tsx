import { Venue } from '../../../types';

interface AmenitiesSectionProps {
  meta: Venue['meta'];
}

export default function AmenitiesSection({ meta }: AmenitiesSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Amenities</h2>
      <div className="flex flex-wrap gap-2">
        {meta.wifi && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
            WiFi
          </span>
        )}
        {meta.parking && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
            Parking
          </span>
        )}
        {meta.breakfast && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
            Breakfast
          </span>
        )}
        {meta.pets && (
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
            Pets Allowed
          </span>
        )}
      </div>
    </div>
  );
}
