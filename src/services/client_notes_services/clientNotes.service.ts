import {
  getClientNotes,
  addClientNotes as addClientNotesDb,
  updateClientNotes as updateClientNotesDb,
} from "../../db/queries/clientNotes.queries";
import { ClientNotesRow } from "../../db/types/clientNotesRow.type";
import { ClientNotesInput } from "../../types/inputs/clientNotesInput.type";
import { validateClientNotes } from "./helpers/validateClientNotes.helper";

export function listClientNotes(
  client_identifier: string,
): ClientNotesRow | undefined {
  const clientNotesRow: ClientNotesRow | undefined =
    getClientNotes(client_identifier);
  return clientNotesRow;
}

export function getClientName(
  client_identifier: string,
): { client_name: string } | undefined {
  const clientNotesRow = listClientNotes(client_identifier);
  return clientNotesRow ? { client_name: clientNotesRow.client_name } : undefined;
}

export function upsertClientNotes(input: ClientNotesInput) {
  if (listClientNotes(input.client_identifier)) {
    updateClientNotes(input);
  } else {
    addClientNotes(input);
  }
}

export function addClientNotes(clientNotes: ClientNotesInput) {
  validateClientNotes(clientNotes);

  const clientNotesRow: ClientNotesRow = {
    id: -1,
    client_identifier: clientNotes.client_identifier,
    client_name: clientNotes.client_name,
    last_service_type_id: clientNotes.last_service_type_id,
    notes: clientNotes.notes,
    updated_at: new Date().toISOString(),
  };

  addClientNotesDb(clientNotesRow);
}

export function updateClientNotes(clientNotes: ClientNotesInput) {
  validateClientNotes(clientNotes);

  const clientNotesRow: ClientNotesRow = {
    id: -1,
    client_identifier: clientNotes.client_identifier,
    client_name: clientNotes.client_name,
    last_service_type_id: clientNotes.last_service_type_id,
    notes: clientNotes.notes,
    updated_at: new Date().toISOString(),
  };

  updateClientNotesDb(clientNotesRow);
}
