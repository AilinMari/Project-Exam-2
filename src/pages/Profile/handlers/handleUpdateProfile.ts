import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Profile, UpdateProfileData, ApiResponse } from '../../../types';

export const handleUpdateProfile = async (
  data: UpdateProfileData,
  profile: Profile | null,
  setProfile: (profile: Profile) => void
) => {
  if (!profile) return;

  try {
    const userName = localStorage.getItem('userName');
    if (!userName) return;

    const updateData: UpdateProfileData = {};
    
    if (data.bio) updateData.bio = data.bio;
    if (data.avatar?.url) {
      updateData.avatar = {
        url: data.avatar.url,
        alt: data.avatar.alt || profile.name,
      };
    }
    if (data.banner?.url) {
      updateData.banner = {
        url: data.banner.url,
        alt: data.banner.alt || `${profile.name} banner`,
      };
    }

    const response = await apiClient.put<ApiResponse<Profile>>(
      API_ENDPOINTS.updateProfile(userName),
      updateData,
      true
    );

    setProfile(response.data);
    alert('Profile updated successfully!');
  } catch (err) {
    console.error('Error updating profile:', err);
    alert('Failed to update profile');
    throw err;
  }
};
