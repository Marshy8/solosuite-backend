import { db } from "../connection";
import { DayScheduleRow } from "../types/dayScheduleRow.type";

export function getAllDaySchedules(): DayScheduleRow[] {
  return db.prepare("SELECT * FROM day_schedule").all() as DayScheduleRow[];
}

export function getDaySchedule(id: number): DayScheduleRow | undefined {
  return db
    .prepare("SELECT * FROM day_schedule WHERE id = ?")
    .get(id) as DayScheduleRow;
}

export function updateDaySchedule(daySchedule: DayScheduleRow) {
  return db
    .prepare(
      "UPDATE day_schedule SET start_time = ?, end_time = ?, is_working = ? WHERE id = ?",
    )
    .run(
      daySchedule.start_time,
      daySchedule.end_time,
      daySchedule.is_working,
      daySchedule.id,
    );
}
