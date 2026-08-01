import { describe, it, expect } from "vitest";
import {
  listServiceTypes,
  listActiveServiceTypes,
  getServiceType,
  createServiceType,
  updateServiceType,
  deactivateServiceType,
} from "../../src/services/service_type_services/serviceType.service";

describe("listServiceTypes", () => {
  it("returns all 5 seeded service types", () => {
    const serviceTypes = listServiceTypes();
    expect(serviceTypes).toHaveLength(5);
    expect(serviceTypes[0]).toEqual({
      id: 1,
      name: "Buzz Cut",
      cost: 2000,
      description: "Short clipper cut, all one length.",
      duration_minutes: 15,
      buffer_override_minutes: null,
      is_active: 1,
    });
  });
});

describe("listActiveServiceTypes", () => {
  it("returns all 5 seeded service types (all active)", () => {
    expect(listActiveServiceTypes()).toHaveLength(5);
  });
});

describe("getServiceType", () => {
  it("returns the seeded service type by id", () => {
    expect(getServiceType(3)).toEqual({
      id: 3,
      name: "Beard Trim",
      cost: 1500,
      description: "Shape and trim facial hair.",
      duration_minutes: 15,
      buffer_override_minutes: null,
      is_active: 1,
    });
  });
});

describe("createServiceType", () => {
  it("adds a new service type and it shows up in the list", () => {
    createServiceType({
      id: -1,
      name: "Kids Cut",
      cost: 1800,
      description: "Haircut for children under 12.",
      duration_minutes: 20,
      buffer_override_minutes: 5,
      is_active: true,
    });

    const serviceTypes = listServiceTypes();
    expect(serviceTypes).toHaveLength(6);

    const created = serviceTypes.find((s) => s.name === "Kids Cut");
    expect(created).toEqual({
      id: 6,
      name: "Kids Cut",
      cost: 1800,
      description: "Haircut for children under 12.",
      duration_minutes: 20,
      buffer_override_minutes: 5,
      is_active: 1,
    });
  });

  it("rejects an empty name", () => {
    expect(() =>
      createServiceType({
        id: -1,
        name: "",
        cost: 1000,
        description: "desc",
        duration_minutes: 10,
        buffer_override_minutes: 0,
        is_active: true,
      }),
    ).toThrow(/name/);
  });

  it("rejects a negative cost", () => {
    expect(() =>
      createServiceType({
        id: -1,
        name: "Broken",
        cost: -100,
        description: "desc",
        duration_minutes: 10,
        buffer_override_minutes: 0,
        is_active: true,
      }),
    ).toThrow(/cost/);
  });

  it("rejects a non-positive duration", () => {
    expect(() =>
      createServiceType({
        id: -1,
        name: "Broken",
        cost: 1000,
        description: "desc",
        duration_minutes: 0,
        buffer_override_minutes: 0,
        is_active: true,
      }),
    ).toThrow(/duration_minutes/);
  });

  it("accepts null for buffer_override_minutes", () => {
    createServiceType({
      id: -1,
      name: "No Override",
      cost: 1000,
      description: "desc",
      duration_minutes: 10,
      buffer_override_minutes: null,
      is_active: true,
    });

    const created = listServiceTypes().find((s) => s.name === "No Override");
    expect(created?.buffer_override_minutes).toBeNull();
  });
});

describe("updateServiceType", () => {
  it("updates an existing service type and reads back the change", () => {
    updateServiceType({
      id: 2,
      name: "Classic Haircut",
      cost: 3500,
      description: "Scissor and clipper cut with styling.",
      duration_minutes: 35,
      buffer_override_minutes: 10,
      is_active: true,
    });

    expect(getServiceType(2)).toEqual({
      id: 2,
      name: "Classic Haircut",
      cost: 3500,
      description: "Scissor and clipper cut with styling.",
      duration_minutes: 35,
      buffer_override_minutes: 10,
      is_active: 1,
    });
  });

  it("rejects invalid input the same way create does", () => {
    expect(() =>
      updateServiceType({
        id: 2,
        name: "  ",
        cost: 3500,
        description: "desc",
        duration_minutes: 35,
        buffer_override_minutes: 10,
        is_active: true,
      }),
    ).toThrow(/name/);
  });

  it("clears an existing buffer_override_minutes back to null", () => {
    updateServiceType({
      id: 4,
      name: "Haircut + Beard",
      cost: 4000,
      description: "Full haircut combined with a beard trim.",
      duration_minutes: 45,
      buffer_override_minutes: null,
      is_active: true,
    });

    expect(getServiceType(4).buffer_override_minutes).toBeNull();
  });
});

describe("deactivateServiceType", () => {
  it("sets is_active to 0 without removing the row", () => {
    deactivateServiceType(4);

    expect(getServiceType(4)?.is_active).toBe(0);
    expect(listServiceTypes().some((s) => s.id === 4)).toBe(true);
    expect(listActiveServiceTypes().some((s) => s.id === 4)).toBe(false);
  });
});
