import { ValidationError } from "../../../errors/validationError";
import { GeneralSettingsInput } from "../../../types/inputs/generalSettingsInput.type";

export function validateGeneralSettings(
  input: unknown,
): asserts input is GeneralSettingsInput {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError(
      "General Settings must be an object with id = 1, worker_name, rolling_schedule_length, buffer_minutes, and timezone",
    );
  }

  const generalSettings = input as Record<string, unknown>;

  if (typeof generalSettings.id !== "number" || generalSettings.id !== 1) {
    throw new ValidationError(
      `id must be a number and equal to 1. Received -> ${generalSettings.id}`,
    );
  }

  if (
    typeof generalSettings.timezone !== "string" ||
    generalSettings.timezone.trim() === "" ||
    !isValidTimeZone(generalSettings.timezone)
  ) {
    throw new ValidationError(
      `timezone must be a valid IANA time zone name (e.g. "America/New_York"). Received -> ${generalSettings.timezone}`,
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
    typeof generalSettings.rolling_schedule_length !== "number" ||
    !Number.isInteger(generalSettings.rolling_schedule_length) ||
    generalSettings.rolling_schedule_length < 0
  ) {
    throw new ValidationError(
      `rolling_schedule_length must be a non-negative integer. Received -> ${generalSettings.rolling_schedule_length}`,
    );
  }

  if (
    typeof generalSettings.buffer_minutes !== "number" ||
    !Number.isInteger(generalSettings.buffer_minutes) ||
    generalSettings.buffer_minutes < 0
  ) {
    throw new ValidationError(
      `buffer_minutes must be a non-negative integer. Received -> ${generalSettings.buffer_minutes}`,
    );
  }
}

function isValidTimeZone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
