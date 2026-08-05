import { describe, it, expect } from "vitest";
import {
  listClientNotes,
  addClientNotes,
  updateClientNotes,
  upsertClientNotes,
} from "../../src/services/client_notes_services/clientNotes.service";

describe("listClientNotes", () => {
  it("returns undefined for a client_identifier with no note", () => {
    expect(listClientNotes("555-9999")).toBeUndefined();
  });

  it("returns the seeded note for an existing client_identifier", () => {
    expect(listClientNotes("555-0101")).toEqual({
      id: 1,
      client_identifier: "555-0101",
      client_name: "Jordan Lee",
      last_service_type_id: 2,
      notes:
        "Wants a bit more taper on the sides next time, mentioned starting a new job.",
      updated_at: "2026-07-20 14:30:00",
    });
  });
});

describe("addClientNotes", () => {
  it("adds a note for a brand-new client_identifier", () => {
    addClientNotes({
      client_identifier: "555-0175",
      client_name: "Taylor Kim",
      last_service_type_id: 1,
      notes: "First-time client, buzz cut, wants to try a fade next time.",
    });

    const created = listClientNotes("555-0175");
    expect(created).toMatchObject({
      client_identifier: "555-0175",
      client_name: "Taylor Kim",
      last_service_type_id: 1,
      notes: "First-time client, buzz cut, wants to try a fade next time.",
    });
    expect(typeof created?.id).toBe("number");
    expect(Date.now() - new Date(created!.updated_at).getTime()).toBeLessThan(
      5000,
    );
  });

  it("rejects a duplicate client_identifier", () => {
    expect(() =>
      addClientNotes({
        client_identifier: "555-0101",
        client_name: "Jordan Lee",
        last_service_type_id: 2,
        notes: "duplicate",
      }),
    ).toThrow();
  });

  it("rejects an empty client_identifier", () => {
    expect(() =>
      addClientNotes({
        client_identifier: "",
        client_name: "No Identifier",
        last_service_type_id: 1,
        notes: "some notes",
      }),
    ).toThrow(/client_identifier/);
  });

  it("rejects an empty client_name", () => {
    expect(() =>
      addClientNotes({
        client_identifier: "555-0180",
        client_name: "",
        last_service_type_id: 1,
        notes: "some notes",
      }),
    ).toThrow(/client_name/);
  });

  it("rejects a non-integer last_service_type_id", () => {
    expect(() =>
      addClientNotes({
        client_identifier: "555-0181",
        client_name: "Bad Service Id",
        last_service_type_id: 1.5,
        notes: "some notes",
      }),
    ).toThrow(/last_service_type_id/);
  });

  it("rejects an empty notes string", () => {
    expect(() =>
      addClientNotes({
        client_identifier: "555-0182",
        client_name: "No Notes",
        last_service_type_id: 1,
        notes: "  ",
      }),
    ).toThrow(/notes/);
  });
});

describe("updateClientNotes", () => {
  it("updates an existing client's note and reads back the change", () => {
    updateClientNotes({
      client_identifier: "555-0142",
      client_name: "Sam Rivera",
      last_service_type_id: 5,
      notes: "Switched to a hot towel shave, wants the same next time.",
    });

    const updated = listClientNotes("555-0142");
    expect(updated).toMatchObject({
      id: 2,
      client_identifier: "555-0142",
      client_name: "Sam Rivera",
      last_service_type_id: 5,
      notes: "Switched to a hot towel shave, wants the same next time.",
    });
    expect(updated?.updated_at).not.toBe("2026-07-28 10:15:00");
  });

  it("rejects invalid input the same way add does", () => {
    expect(() =>
      updateClientNotes({
        client_identifier: "555-0142",
        client_name: "Sam Rivera",
        last_service_type_id: 5,
        notes: "",
      }),
    ).toThrow(/notes/);
  });
});

describe("upsertClientNotes", () => {
  it("creates a new row when the client doesn't exist yet", () => {
    expect(listClientNotes("555-0188")).toBeUndefined();

    upsertClientNotes({
      client_identifier: "555-0188",
      client_name: "Morgan Diaz",
      last_service_type_id: 3,
      notes: "Wants a beard trim every three weeks.",
    });

    expect(listClientNotes("555-0188")).toMatchObject({
      client_identifier: "555-0188",
      client_name: "Morgan Diaz",
      last_service_type_id: 3,
      notes: "Wants a beard trim every three weeks.",
    });
  });

  it("updates in place when the client already exists, keeping the same row", () => {
    const before = listClientNotes("555-0101");

    upsertClientNotes({
      client_identifier: "555-0101",
      client_name: "Jordan Lee",
      last_service_type_id: 4,
      notes: "Switched to haircut + beard combo.",
    });

    const after = listClientNotes("555-0101");
    expect(after?.id).toBe(before?.id);
    expect(after).toMatchObject({
      last_service_type_id: 4,
      notes: "Switched to haircut + beard combo.",
    });
  });
});
