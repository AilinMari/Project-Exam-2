import { CreateVenueData } from '../../../../types';

export const updateMediaField = (
  formData: CreateVenueData,
  setFormData: (data: CreateVenueData) => void,
  index: number,
  url: string
) => {
  const newMedia = [...(formData.media || [])];
  newMedia[index] = { url, alt: formData.name || 'Venue image' };
  setFormData({ ...formData, media: newMedia });
};
