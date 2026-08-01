import { db } from "../connection";
import { GeneralSettingsRow } from "../types/gerneralSettingsRow.type";

export function getGeneralSettings(): GeneralSettingsRow | undefined {
  return db.prepare("SELECT * FROM general_settings WHERE id = 1").get() as
    | GeneralSettingsRow
    | undefined;
}

export function updateGeneralSettings(gerneralSettings: GeneralSettingsRow) {
  return db
    .prepare(
      "UPDATE general_settings SET worker_name = ?, rolling_schedule_length = ?, buffer_minutes = ?, timezone = ? WHERE id = 1",
    )
    .run(
      gerneralSettings.worker_name,
      gerneralSettings.rolling_schedule_length,
      gerneralSettings.buffer_minutes,
      gerneralSettings.timezone,
    );
}
