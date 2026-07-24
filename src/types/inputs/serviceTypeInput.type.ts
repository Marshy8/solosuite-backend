export type ServiceTypeInput = {
  id: number;
  name: string;
  cost: number;
  description: string;
  duration_minutes: number;
  buffer_override_minutes: number;
  is_active: boolean;
};
