import { useState } from 'react';
import { CreateVenueData } from '../../types';

interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVenueData) => Promise<void>;
  initialData: CreateVenueData;
  title: string;
  submitButtonText: string;
  isSubmitting: boolean;
}

export default function VenueFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  submitButtonText,
  isSubmitting,
}: VenueFormModalProps) {
  const [formData, setFormData] = useState<CreateVenueData>(initialData);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addMediaField = () => {
    const newMedia = [...(formData.media || []), { url: '', alt: formData.name || 'Venue image' }];
    setFormData({ ...formData, media: newMedia });
  };

  const removeMediaField = (index: number) => {
    const newMedia = (formData.media || []).filter((_, i) => i !== index);
    setFormData({ ...formData, media: newMedia });
  };

  const updateMediaField = (index: number, url: string) => {
    const newMedia = [...(formData.media || [])];
    newMedia[index] = { url, alt: formData.name || 'Venue image' };
    setFormData({ ...formData, media: newMedia });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <div className="space-y-3">
                  {formData.media && formData.media.length > 0 ? (
                    formData.media.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) => updateMediaField(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                          placeholder="https://example.com/venue-image.jpg"
                        />
                        <button
                          type="button"
                          onClick={() => removeMediaField(index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No images added yet</div>
                  )}
                  <button
                    type="button"
                    onClick={addMediaField}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-red-500 hover:text-red-600"
                  >
                    + Add Image URL
                  </button>
                </div>
                
                {/* Image Previews */}
                {formData.media && formData.media.some(img => img.url) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {formData.media
                        .filter(img => img.url)
                        .map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Venue preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
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
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
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
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
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
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
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
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-700">Pets Allowed</span>
                </label>
              </div>
            </div>

            {/* Location */}
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 font-medium"
              >
                {isSubmitting ? 'Submitting...' : submitButtonText}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 disabled:bg-gray-100 font-medium"
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
