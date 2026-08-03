import { addDays } from "date-fns";
import { format } from "date-fns-tz";
import { getGeneralSettings } from "../../db/queries/generalSettings.queries";
import { getServiceType } from "../../db/queries/serviceType.queries";
import { getDaySchedule } from "../../db/queries/daySchedule.queries";
import { getBusyIntervals } from "../google_services/googleCalendar.service";
import { dateTimeNormalization } from "./helpers/zonedDateTime.helper";
import { padIntervalEnd } from "./helpers/padIntervalEnd.helper";
import { workingAndBusyIntervalsDifference } from "./helpers/workingAndBusyIntervalsDifference.helper";
import { sliceFreeIntervalsIntoSlots } from "./helpers/sliceFreeIntervalsIntoSlots.helper";
import { TimeChunk } from "../../types/timeChunk.type";
import { ValidationError } from "../../errors/validationError";

export async function getAvailableSlots(
  serviceTypeId: number,
): Promise<Date[]> {
  if (!Number.isInteger(serviceTypeId)) {
    throw new ValidationError(
      `serviceTypeId must be an integer. Received -> ${serviceTypeId}`,
    );
  }

  const settings = getGeneralSettings();
  if (!settings) {
    throw new Error("General settings are not configured.");
  }

  const serviceType = getServiceType(serviceTypeId);
  if (!serviceType) {
    throw new ValidationError(
      `No service type found with id ${serviceTypeId}.`,
    );
  }
  if (!serviceType.is_active) {
    throw new ValidationError(`Service type ${serviceTypeId} is not active.`);
  }

  const bufferMinutes =
    serviceType.buffer_override_minutes ?? settings.buffer_minutes;
  const spanMinutes = serviceType.duration_minutes + bufferMinutes;

  const now = new Date();
  const todayDateString = format(now, "yyyy-MM-dd", {
    timeZone: settings.timezone,
  });
  const windowStart = dateStringToUtcMidnight(todayDateString);

  const dateStrings: string[] = [];
  for (let offset = 0; offset < settings.rolling_schedule_length; offset++) {
    dateStrings.push(utcMidnightToDateString(addDays(windowStart, offset)));
  }

  const windowEnd = addDays(now, settings.rolling_schedule_length);
  const busyIntervals = await getBusyIntervals(
    now.toISOString(),
    windowEnd.toISOString(),
  );
  const paddedBusyIntervals: TimeChunk[] = busyIntervals.map((interval) =>
    padIntervalEnd(
      { start: new Date(interval.start), end: new Date(interval.end) },
      bufferMinutes,
    ),
  );

  const slots: Date[] = [];

  for (const [index, dateString] of dateStrings.entries()) {
    const dayOfWeek = dateStringToUtcMidnight(dateString).getUTCDay();
    const daySchedule = getDaySchedule(dayOfWeek);

    if (
      !daySchedule ||
      !daySchedule.is_working ||
      daySchedule.start_time == null ||
      daySchedule.end_time == null
    ) {
      continue;
    }

    let workingChunk: TimeChunk = {
      start: dateTimeNormalization(
        dateString,
        daySchedule.start_time,
        settings.timezone,
      ),
      end: dateTimeNormalization(
        dateString,
        daySchedule.end_time,
        settings.timezone,
      ),
    };

    const isToday = index === 0;
    if (isToday && workingChunk.start.getTime() < now.getTime()) {
      workingChunk = { start: now, end: workingChunk.end };
    }

    if (workingChunk.start.getTime() >= workingChunk.end.getTime()) {
      continue;
    }

    const freeChunks = paddedBusyIntervals.reduce(
      (chunks, busy) => workingAndBusyIntervalsDifference(chunks, busy),
      [workingChunk],
    );

    slots.push(...sliceFreeIntervalsIntoSlots(freeChunks, spanMinutes));
  }

  return slots;
}

function dateStringToUtcMidnight(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function utcMidnightToDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
