import { UpdateProfileData } from '../../../../types';
import { updateBanner } from '../handlers/updateBanner';

interface BannerSectionProps {
  formData: UpdateProfileData;
  setFormData: (data: UpdateProfileData) => void;
}

export default function BannerSection({ formData, setFormData }: BannerSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Banner URL
      </label>
      <input
        type="url"
        value={formData.banner?.url || ''}
        onChange={(e) => updateBanner(formData, setFormData, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        placeholder="https://example.com/banner.jpg"
      />
      {formData.banner?.url && (
        <div className="mt-2">
          <img
            src={formData.banner.url}
            alt="Banner preview"
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x128?text=Invalid';
            }}
          />
        </div>
      )}
    </div>
  );
}
