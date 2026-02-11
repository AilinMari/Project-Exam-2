import { CreateVenueData } from '../../../../types';

interface BasicInfoProps {
  formData: CreateVenueData;
  setFormData: (data: CreateVenueData) => void;
}

export default function BasicInfo({ formData, setFormData }: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Venue Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          placeholder="Beautiful Beach House"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          placeholder="Describe your venue..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Night *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Guests *
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.maxGuests || ''}
            onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
