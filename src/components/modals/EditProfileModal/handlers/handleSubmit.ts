import { UpdateProfileData } from '../../../../types';

export const handleSubmit = async (
  e: React.FormEvent,
  formData: UpdateProfileData,
  onSubmit: (data: UpdateProfileData) => Promise<void>,
  setSaving: (saving: boolean) => void,
  onClose: () => void
) => {
  e.preventDefault();
  setSaving(true);
  try {
    await onSubmit(formData);
    onClose();
  } catch (error) {
    console.error('Error updating profile:', error);
  } finally {
    setSaving(false);
  }
};
