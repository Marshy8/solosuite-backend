import {
  getGeneralSettings,
  updateGeneralSettings as updateGeneralSettingsRow,
} from "../../db/queries/generalSettings.queries";
import { GeneralSettingsRow } from "../../db/types/gerneralSettingsRow.type";
import { GeneralSettingsInput } from "../../types/inputs/generalSettingsInput.type";
import { validateGeneralSettings } from "./helpers/validateGeneralSettings.helper";

export function listGeneralSettings(): GeneralSettingsRow | undefined {
  const generalSettingsRow: GeneralSettingsRow | undefined =
    getGeneralSettings();
  return generalSettingsRow;
}

export function updateGeneralSettings(input: GeneralSettingsInput) {
  validateGeneralSettings(input);

  const generalSettingsRow: GeneralSettingsRow = {
    id: input.id,
    worker_name: input.worker_name,
    rolling_schedule_length: input.rolling_schedule_length,
    buffer_minutes: input.buffer_minutes,
    timezone: input.timezone,
  };

  updateGeneralSettingsRow(generalSettingsRow);
}
