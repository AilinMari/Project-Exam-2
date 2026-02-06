import { CreateVenueData } from '../../../../types';

interface LocationProps {
  formData: CreateVenueData;
  setFormData: (data: CreateVenueData) => void;
}

export default function Location({ formData, setFormData }: LocationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Location</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={formData.location?.city || ''}
            onChange={(e) => setFormData({
              ...formData,
              location: { ...formData.location, city: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
            placeholder="Oslo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={formData.location?.country || ''}
            onChange={(e) => setFormData({
              ...formData,
              location: { ...formData.location, country: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
            placeholder="Norway"
          />
        </div>
      </div>
    </div>
  );
}
