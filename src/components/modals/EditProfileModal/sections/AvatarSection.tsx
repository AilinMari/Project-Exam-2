import { UpdateProfileData } from '../../../../types';
import { updateAvatar } from '../handlers/updateAvatar';

interface AvatarSectionProps {
  formData: UpdateProfileData;
  setFormData: (data: UpdateProfileData) => void;
}

export default function AvatarSection({ formData, setFormData }: AvatarSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Avatar URL
      </label>
      <input
        type="url"
        value={formData.avatar?.url || ''}
        onChange={(e) => updateAvatar(formData, setFormData, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        placeholder="https://example.com/avatar.jpg"
      />
      {formData.avatar?.url && (
        <div className="mt-2">
          <img
            src={formData.avatar.url}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/80?text=Invalid';
            }}
          />
        </div>
      )}
    </div>
  );
}
