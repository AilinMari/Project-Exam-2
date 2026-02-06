import { UpdateProfileData } from '../../../../types';

export const updateAvatar = (
  formData: UpdateProfileData,
  setFormData: (data: UpdateProfileData) => void,
  url: string
) => {
  setFormData({
    ...formData,
    avatar: { ...formData.avatar, url, alt: 'User avatar' },
  });
};
