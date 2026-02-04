import { useState } from 'react';
import { UpdateProfileData } from '../../types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio || ''}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar?.url || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    avatar: { ...formData.avatar, url: e.target.value, alt: 'User avatar' },
                  })
                }
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner URL
              </label>
              <input
                type="url"
                value={formData.banner?.url || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    banner: { ...formData.banner, url: e.target.value, alt: 'Profile banner' },
                  })
                }
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
