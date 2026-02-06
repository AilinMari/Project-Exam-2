import { CreateVenueData } from '../../../../types';

export const handleSubmit = async (
  e: React.FormEvent,
  onSubmit: (data: CreateVenueData) => Promise<void>,
  formData: CreateVenueData
) => {
  e.preventDefault();
  await onSubmit(formData);
};
