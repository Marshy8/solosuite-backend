import {
  getDaySchedule,
  getAllDaySchedules,
  updateDaySchedule,
} from "../../db/queries/daySchedule.queries";
import { getGeneralSettings } from "../../db/queries/generalSettings.queries";
import { TimeInterval } from "../../types/timeInterval.type";
import { DayScheduleRow } from "../../db/types/dayScheduleRow.type";
import { dbTimeToTimeBoundary } from "./helpers/dbTimeToTimeBoundary.helper";
import { DayScheduleInput } from "../../types/inputs/dayScheduleInput.type";

export function getWeekSchedule(): DayScheduleRow[] {
  const weekSchedule: DayScheduleRow[] = getAllDaySchedules();
  return weekSchedule;
}

export function getDayWorkingHours(day: number): TimeInterval | undefined {
  const daySchedule: DayScheduleRow | undefined = getDaySchedule(day);

  if (!daySchedule || daySchedule.is_working === 0) {
    return undefined;
  }

  const timeZone = getGeneralSettings()?.timezone ?? "America/New_York";
  const start = dbTimeToTimeBoundary(daySchedule.start_time, timeZone);
  const end = dbTimeToTimeBoundary(daySchedule.end_time, timeZone);

  if (start === null || end === null) {
    return undefined;
  }

  return { start, end };
}

export function setDaySchedule(input: DayScheduleInput) {
  const day = input.day;

  if (!Number.isInteger(day) || day < 0 || day > 6) {
    throw new Error(
      `Day must be an integer value from 0-6. Received value -> ${day}`,
    );
  }

  const is_working = input.is_working;

  if (is_working === false) {
    updateDaySchedule({
      id: day,
      start_time: null,
      end_time: null,
      is_working: 0,
    });
    return;
  }

  const start_time = input.start_time;
  const end_time = input.end_time;
  const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (
    !start_time ||
    !end_time ||
    !HHMM.test(start_time) ||
    !HHMM.test(end_time)
  ) {
    throw new Error(
      `start_time and end_time must be HH:MM when is_working = true. Received values -> start_time: ${start_time}, end_time: ${end_time}`,
    );
  }
  if (start_time >= end_time) {
    throw new Error(
      `start_time must be before end_time. Received values -> start_time: ${start_time}, end_time: ${end_time}`,
    );
  }
  updateDaySchedule({ id: day, start_time, end_time, is_working: 1 });
}
