import { CreateVenueData } from '../../../../types';

export const removeMediaField = (
  formData: CreateVenueData,
  setFormData: (data: CreateVenueData) => void,
  index: number
) => {
  const newMedia = (formData.media || []).filter((_, i) => i !== index);
  setFormData({ ...formData, media: newMedia });
};
