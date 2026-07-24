import { db } from "../connection";
import { ServiceTypeRow } from "../types/serviceTypeRow.type";

export function getAllServiceTypes(): ServiceTypeRow[] {
  return db.prepare("SELECT * FROM service_type").all() as ServiceTypeRow[];
}

export function getAllActiveServiceTypes(): ServiceTypeRow[] {
  return db
    .prepare("SELECT * FROM service_type WHERE is_active = 1")
    .all() as ServiceTypeRow[];
}

export function getServiceType(id: number): ServiceTypeRow {
  return db
    .prepare("SELECT * FROM service_type WHERE ID = ?")
    .get(id) as ServiceTypeRow;
}

export function addServiceType(serviceType: ServiceTypeRow) {
  return db
    .prepare(
      "INSERT INTO service_type (name, cost, description, duration_minutes, buffer_override_minutes, is_active) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      serviceType.name,
      serviceType.cost,
      serviceType.description,
      serviceType.duration_minutes,
      serviceType.buffer_override_minutes,
      serviceType.is_active,
    );
}

export function updateServiceType(serviceType: ServiceTypeRow) {
  return db
    .prepare(
      "UPDATE service_type SET name = ?, cost = ?, description = ?, duration_minutes = ?, buffer_override_minutes = ?, is_active = ? WHERE  id = ?",
    )
    .run(
      serviceType.name,
      serviceType.cost,
      serviceType.description,
      serviceType.duration_minutes,
      serviceType.buffer_override_minutes,
      serviceType.is_active,
      serviceType.id,
    );
}

export function deleteServiceType(id: number) {
  return db
    .prepare("UPDATE service_type SET is_active = ? WHERE id = ?")
    .run(0, id);
}
