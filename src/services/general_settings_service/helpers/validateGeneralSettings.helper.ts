import { ValidationError } from "../../../errors/validationError";
import { GeneralSettingsInput } from "../../../types/inputs/generalSettingsInput.type";

export function validateGeneralSettings(
  input: unknown,
): asserts input is GeneralSettingsInput {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError(
      "General Settings must be an object with id = 1, worker_name, rolling_schedule_length, and buffer_minutes",
    );
  }

  const generalSettings = input as Record<string, unknown>;

  if (typeof generalSettings.id !== "number" || generalSettings.id !== 1) {
    throw new ValidationError(
      `id must be a number and equal to 1. Received -> ${generalSettings.id}`,
    );
  }

  if (
    typeof generalSettings.worker_name !== "string" ||
    generalSettings.worker_name.trim() === ""
  ) {
    throw new ValidationError(
      `worker_name must be a non-empty string. Received -> ${generalSettings.worker_name}`,
    );
  }

  if (
    generalSettings.rolling_schedule_length !== null &&
    (typeof generalSettings.rolling_schedule_length !== "number" ||
      generalSettings.rolling_schedule_length < 0)
  ) {
    throw new ValidationError(
      `rolling_schedule_length must be a number >= 0 or null. Received -> ${generalSettings.rolling_schedule_length}`,
    );
  }

  if (
    generalSettings.buffer_minutes !== null &&
    (typeof generalSettings.buffer_minutes !== "number" ||
      generalSettings.buffer_minutes < 0)
  ) {
    throw new ValidationError(
      `buffer_minutes must be a number >= 0 or null. Received -> ${generalSettings.buffer_minutes}`,
    );
  }
}
