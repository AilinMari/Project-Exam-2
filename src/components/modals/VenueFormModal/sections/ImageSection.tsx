import { CreateVenueData } from '../../../../types';
import { addMediaField } from '../handlers/addMediaField';
import { removeMediaField } from '../handlers/removeMediaField';
import { updateMediaField } from '../handlers/updateMediaField';

interface ImageSectionProps {
  formData: CreateVenueData;
  setFormData: (data: CreateVenueData) => void;
}

export default function ImageSection({ formData, setFormData }: ImageSectionProps) {
  return (
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
                onChange={(e) => updateMediaField(formData, setFormData, index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-900"
                placeholder="https://example.com/venue-image.jpg"
              />
              <button
                type="button"
                onClick={() => removeMediaField(formData, setFormData, index)}
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
          onClick={() => addMediaField(formData, setFormData)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-red-500 hover:text-red-600"
        >
          + Add Image URL
        </button>
      </div>
      
      {formData.media && formData.media.some((img) => img.url) && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="grid grid-cols-2 gap-3">
            {formData.media
              .filter((img) => img.url)
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
  );
}
