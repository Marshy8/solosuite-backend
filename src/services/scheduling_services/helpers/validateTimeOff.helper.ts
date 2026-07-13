import { ValidationError } from "../../../errors/validationError";
import { ScheduledTime } from "../../../types/scheduledTime.type";
import { TimeBoundary } from "../../../types/timeBoundary.type";

export function validateTimeOff(
  input: unknown,
): asserts input is ScheduledTime {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError(
      "Time off must be an object with summary, start, and end.",
    );
  }
  const event = input as Record<string, unknown>;
  if (typeof event.summary !== "string" || event.summary.trim() === "") {
    throw new ValidationError(
      `summary must be a non-empty string. Received -> ${event.summary}`,
    );
  }
  if (!isValidBoundary(event.start) || !isValidBoundary(event.end)) {
    throw new ValidationError(
      'start and end must each be { kind: "fullDay", date } or { kind: "specificTime", dateTime, timeZone }.',
    );
  }
}

function isValidBoundary(boundary: unknown): boundary is TimeBoundary {
  if (typeof boundary !== "object" || boundary === null) return false;
  const b = boundary as Record<string, unknown>;
  if (b.kind === "fullDay") return typeof b.date === "string";
  if (b.kind === "specificTime") {
    return typeof b.dateTime === "string" && typeof b.timeZone === "string";
  }
  return false;
}
