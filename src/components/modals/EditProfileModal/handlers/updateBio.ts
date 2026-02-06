import { UpdateProfileData } from '../../../../types';

export const updateBio = (
  formData: UpdateProfileData,
  setFormData: (data: UpdateProfileData) => void,
  bio: string
) => {
  setFormData({ ...formData, bio });
};
