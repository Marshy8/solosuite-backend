import { ValidationError } from "../../../errors/validationError";
import { ServiceTypeInput } from "../../../types/inputs/serviceTypeInput.type";

export function validateServiceType(
  input: unknown,
): asserts input is ServiceTypeInput {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError(
      "Service type must be an object with name, cost, description, duration_minutes, buffer_override_minutes, and is_active.",
    );
  }
  const serviceType = input as Record<string, unknown>;

  if (typeof serviceType.name !== "string" || serviceType.name.trim() === "") {
    throw new ValidationError(
      `name must be a non-empty string. Received -> ${serviceType.name}`,
    );
  }

  if (typeof serviceType.cost !== "number" || serviceType.cost < 0) {
    throw new ValidationError(
      `cost must be a number >= 0. Received -> ${serviceType.cost}`,
    );
  }

  if (typeof serviceType.description !== "string") {
    throw new ValidationError(
      `description must be a string. Received -> ${serviceType.description}`,
    );
  }

  if (
    typeof serviceType.duration_minutes !== "number" ||
    !Number.isInteger(serviceType.duration_minutes) ||
    serviceType.duration_minutes <= 0
  ) {
    throw new ValidationError(
      `duration_minutes must be a positive integer. Received -> ${serviceType.duration_minutes}`,
    );
  }

  if (
    typeof serviceType.buffer_override_minutes !== "number" ||
    !Number.isInteger(serviceType.buffer_override_minutes) ||
    serviceType.buffer_override_minutes < 0
  ) {
    throw new ValidationError(
      `buffer_override_minutes must be a non-negative integer. Received -> ${serviceType.buffer_override_minutes}`,
    );
  }

  if (typeof serviceType.is_active !== "boolean") {
    throw new ValidationError(
      `is_active must be a boolean. Received -> ${serviceType.is_active}`,
    );
  }
}
