import { apiClient } from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../config/api';
import { Profile, UpdateProfileData, ApiResponse } from '../../../types';

export const handleUpdateProfile = async (
  data: UpdateProfileData,
  profile: Profile | null,
  setProfile: (profile: Profile) => void,
  addToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
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
    addToast?.('Profile updated successfully! 🎉', 'success');
  } catch {
    addToast?.('Failed to update profile. Please try again.', 'error');
    throw new Error('Failed to update profile');
  }
};
