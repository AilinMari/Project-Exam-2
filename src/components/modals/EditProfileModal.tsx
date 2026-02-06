import { useState } from 'react';
import { UpdateProfileData } from '../../types';
import { handleSubmit } from './EditProfileModal/handlers/handleSubmit';
import BioSection from './EditProfileModal/sections/BioSection';
import AvatarSection from './EditProfileModal/sections/AvatarSection';
import BannerSection from './EditProfileModal/sections/BannerSection';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProfileData) => Promise<void>;
  initialData: UpdateProfileData;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UpdateProfileData>(initialData);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Profile</h2>
          <form onSubmit={(e) => handleSubmit(e, formData, onSubmit, setSaving, onClose)} className="space-y-4">
            <BioSection formData={formData} setFormData={setFormData} />
            <AvatarSection formData={formData} setFormData={setFormData} />
            <BannerSection formData={formData} setFormData={setFormData} />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
