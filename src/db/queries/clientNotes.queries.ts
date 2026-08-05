import { db } from "../connection";
import { ClientNotesRow } from "../types/clientNotesRow.type";

export function getClientNotes(
  client_identifier: string,
): ClientNotesRow | undefined {
  return db
    .prepare("SELECT * FROM client_notes WHERE client_identifier = ?")
    .get(client_identifier) as ClientNotesRow;
}

export function addClientNotes(clientNotes: ClientNotesRow) {
  return db
    .prepare(
      "INSERT INTO client_notes (client_identifier, client_name, last_service_type_id, notes, updated_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(
      clientNotes.client_identifier,
      clientNotes.client_name,
      clientNotes.last_service_type_id,
      clientNotes.notes,
      clientNotes.updated_at,
    );
}

export function updateClientNotes(clientNotes: ClientNotesRow) {
  return db
    .prepare(
      "UPDATE client_notes SET client_name = ?, last_service_type_id = ?, notes = ?, updated_at = ? WHERE  client_identifier = ?",
    )
    .run(
      clientNotes.client_name,
      clientNotes.last_service_type_id,
      clientNotes.notes,
      clientNotes.updated_at,
      clientNotes.client_identifier,
    );
}
