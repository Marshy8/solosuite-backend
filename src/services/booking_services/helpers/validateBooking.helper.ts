import { ValidationError } from "../../../errors/validationError";
import { BookingInput } from "../../../types/inputs/bookingInput.type";

export function validateBooking(input: unknown): asserts input is BookingInput {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError(
      "Booking must be an object with client_identifier, client_name, service_type_id, and start_time",
    );
  }

  const booking = input as Record<string, unknown>;

  if (
    typeof booking.client_identifier !== "string" ||
    !/^\(\d{3}\) \d{3}-\d{4}$/.test(booking.client_identifier)
  ) {
    throw new ValidationError(
      `client_identifier must be a phone number formatted as (xxx) xxx-xxxx. Received -> ${booking.client_identifier}`,
    );
  }

  if (
    typeof booking.client_name !== "string" ||
    booking.client_name.trim() === ""
  ) {
    throw new ValidationError(
      `client_name must be a non-empty string. Received -> ${booking.client_name}`,
    );
  }

  if (
    typeof booking.service_type_id !== "number" ||
    !Number.isInteger(booking.service_type_id)
  ) {
    throw new ValidationError(
      `service_type_id must be an integer. Received -> ${booking.service_type_id}`,
    );
  }

  if (
    typeof booking.start_time !== "string" ||
    booking.start_time.trim() === ""
  ) {
    throw new ValidationError(
      `start_time must be a non-empty string. Received -> ${booking.start_time}`,
    );
  }
}
