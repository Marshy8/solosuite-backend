import { ValidationError } from "../../../errors/validationError";
import { ClientNotesInput } from "../../../types/inputs/clientNotesInput.type";

export function validateClientNotes(
  input: unknown,
): asserts input is ClientNotesInput {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError(
      "Client Notes must be an object with client_identifier, client_name, last_service_type_id, and notes",
    );
  }

  const clientNotes = input as Record<string, unknown>;

  if (
    typeof clientNotes.client_identifier !== "string" ||
    clientNotes.client_identifier.trim() === ""
  ) {
    throw new ValidationError(
      `client_identifier must be a non-empty string. Received -> ${clientNotes.client_identifier}`,
    );
  }

  if (
    typeof clientNotes.client_name !== "string" ||
    clientNotes.client_name.trim() === ""
  ) {
    throw new ValidationError(
      `client_name must be a non-empty string. Received -> ${clientNotes.client_name}`,
    );
  }

  if (
    typeof clientNotes.last_service_type_id !== "number" ||
    !Number.isInteger(clientNotes.last_service_type_id)
  ) {
    throw new ValidationError(
      `last_service_type_id must be an integer. Received -> ${clientNotes.last_service_type_id}`,
    );
  }

  if (
    typeof clientNotes.notes !== "string" ||
    clientNotes.notes.trim() === ""
  ) {
    throw new ValidationError(
      `notes must be a non-empty string. Received -> ${clientNotes.notes}`,
    );
  }
}
