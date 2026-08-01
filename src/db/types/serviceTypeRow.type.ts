export type ServiceTypeRow = {
  id: number;
  name: string;
  cost: number;
  description: string;
  duration_minutes: number;
  buffer_override_minutes: number | null;
  is_active: number;
};
