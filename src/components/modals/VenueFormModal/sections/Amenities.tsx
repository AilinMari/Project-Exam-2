import { CreateVenueData } from '../../../../types';

interface AmenitiesProps {
  formData: CreateVenueData;
  setFormData: (data: CreateVenueData) => void;
}

export default function Amenities({ formData, setFormData }: AmenitiesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Amenities</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.meta?.wifi}
            onChange={(e) => setFormData({
              ...formData,
              meta: { ...formData.meta, wifi: e.target.checked }
            })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-gray-700">WiFi</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.meta?.parking}
            onChange={(e) => setFormData({
              ...formData,
              meta: { ...formData.meta, parking: e.target.checked }
            })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-gray-700">Parking</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.meta?.breakfast}
            onChange={(e) => setFormData({
              ...formData,
              meta: { ...formData.meta, breakfast: e.target.checked }
            })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-gray-700">Breakfast</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.meta?.pets}
            onChange={(e) => setFormData({
              ...formData,
              meta: { ...formData.meta, pets: e.target.checked }
            })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-gray-700">Pets Allowed</span>
        </label>
      </div>
    </div>
  );
}
