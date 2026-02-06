import { UpdateProfileData } from '../../../../types';
import { updateBio } from '../handlers/updateBio';

interface BioSectionProps {
  formData: UpdateProfileData;
  setFormData: (data: UpdateProfileData) => void;
}

export default function BioSection({ formData, setFormData }: BioSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bio
      </label>
      <textarea
        rows={3}
        value={formData.bio || ''}
        onChange={(e) => updateBio(formData, setFormData, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        placeholder="Tell us about yourself..."
      />
    </div>
  );
}
