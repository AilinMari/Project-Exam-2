import { CreateVenueData } from '../../../../types';

export const addMediaField = (
  formData: CreateVenueData,
  setFormData: (data: CreateVenueData) => void
) => {
  const newMedia = [...(formData.media || []), { url: '', alt: formData.name || 'Venue image' }];
  setFormData({ ...formData, media: newMedia });
};
