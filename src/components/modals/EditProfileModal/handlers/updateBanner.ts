import { UpdateProfileData } from '../../../../types';

export const updateBanner = (
  formData: UpdateProfileData,
  setFormData: (data: UpdateProfileData) => void,
  url: string
) => {
  setFormData({
    ...formData,
    banner: { ...formData.banner, url, alt: 'Profile banner' },
  });
};
