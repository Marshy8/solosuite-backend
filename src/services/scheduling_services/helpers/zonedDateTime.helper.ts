import { fromZonedTime } from "date-fns-tz";

export function dateTimeNormalization(
  date: string,
  time: string,
  timeZone: string,
): Date {
  const dateTime = date + "T" + time + ":00";

  return fromZonedTime(dateTime, timeZone);
}
