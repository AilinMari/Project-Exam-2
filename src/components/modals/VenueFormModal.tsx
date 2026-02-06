import { useState } from 'react';
import { CreateVenueData } from '../../types';
import { handleSubmit } from './VenueFormModal/handlers/handleSubmit';
import BasicInfo from './VenueFormModal/sections/BasicInfo';
import ImageSection from './VenueFormModal/sections/ImageSection';
import Amenities from './VenueFormModal/sections/Amenities';
import Location from './VenueFormModal/sections/Location';

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

          <form onSubmit={(e) => handleSubmit(e, onSubmit, formData)} className="space-y-6">
            <BasicInfo formData={formData} setFormData={setFormData} />
            <ImageSection formData={formData} setFormData={setFormData} />
            <Amenities formData={formData} setFormData={setFormData} />
            <Location formData={formData} setFormData={setFormData} />

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
