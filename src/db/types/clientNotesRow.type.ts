export type ClientNotesRow = {
  id: number;
  client_identifier: string;
  client_name: string;
  last_service_type_id: number | null;
  notes: string;
  updated_at: string;
};
