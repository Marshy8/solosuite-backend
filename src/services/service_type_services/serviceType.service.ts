import {
  addServiceType,
  getServiceType as getServiceTypeRow,
  updateServiceType as updateServiceTypeRow,
  deleteServiceType,
  getAllActiveServiceTypes,
  getAllServiceTypes,
} from "../../db/queries/serviceType.queries";
import { ServiceTypeRow } from "../../db/types/serviceTypeRow.type";
import { ServiceTypeInput } from "../../types/inputs/serviceTypeInput.type";
import { validateServiceType } from "./helpers/validateServiceType.helper";

export function listServiceTypes(): ServiceTypeRow[] {
  const serviceTypes: ServiceTypeRow[] = getAllServiceTypes();
  return serviceTypes;
}

export function listActiveServiceTypes(): ServiceTypeRow[] {
  const activeServiceTypes: ServiceTypeRow[] = getAllActiveServiceTypes();
  return activeServiceTypes;
}

export function getServiceType(id: number): ServiceTypeRow {
  const serviceType: ServiceTypeRow = getServiceTypeRow(id);
  return serviceType;
}

export function createServiceType(input: ServiceTypeInput) {
  validateServiceType(input);

  const dbServiceTypeRow: ServiceTypeRow = {
    id: -1,
    name: input.name,
    cost: input.cost,
    description: input.description,
    duration_minutes: input.duration_minutes,
    buffer_override_minutes: input.buffer_override_minutes,
    is_active: Number(input.is_active),
  };

  addServiceType(dbServiceTypeRow);
}

export function updateServiceType(input: ServiceTypeInput) {
  validateServiceType(input);

  const dbServiceTypeRow: ServiceTypeRow = {
    id: input.id,
    name: input.name,
    cost: input.cost,
    description: input.description,
    duration_minutes: input.duration_minutes,
    buffer_override_minutes: input.buffer_override_minutes,
    is_active: Number(input.is_active),
  };

  updateServiceTypeRow(dbServiceTypeRow);
}

export function deactivateServiceType(id: number) {
  deleteServiceType(id);
}
