import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";

describe("GET /clientNotes/:client_identifier", () => {
  it("returns the seeded note for an existing client", async () => {
    const res = await request(app).get(
      `/clientNotes/${encodeURIComponent("(555) 555-0101")}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      client_identifier: "(555) 555-0101",
      client_name: "Jordan Lee",
      last_service_type_id: 2,
      notes:
        "Wants a bit more taper on the sides next time, mentioned starting a new job.",
      updated_at: "2026-07-20 14:30:00",
    });
  });

  it("returns 200 with an empty body for a client with no note", async () => {
    const res = await request(app).get(
      `/clientNotes/${encodeURIComponent("(000) 000-0000")}`,
    );

    expect(res.status).toBe(200);
  });
});

describe("GET /clientNotes/:client_identifier/name", () => {
  it("returns only the name for an existing client, no notes or service id", async () => {
    const res = await request(app).get(
      `/clientNotes/${encodeURIComponent("(555) 555-0101")}/name`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ client_name: "Jordan Lee" });
  });

  it("returns 200 with an empty body for a client with no note", async () => {
    const res = await request(app).get(
      `/clientNotes/${encodeURIComponent("(000) 000-0000")}/name`,
    );

    expect(res.status).toBe(200);
  });
});

describe("PUT /clientNotes", () => {
  it("creates a new client note and it can be read back", async () => {
    const put = await request(app).put("/clientNotes").send({
      client_identifier: "(555) 555-0199",
      client_name: "Casey Nguyen",
      last_service_type_id: 1,
      notes: "New client, wants a buzz cut every month.",
    });

    expect(put.status).toBe(204);

    const res = await request(app).get(
      `/clientNotes/${encodeURIComponent("(555) 555-0199")}`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      client_identifier: "(555) 555-0199",
      client_name: "Casey Nguyen",
      last_service_type_id: 1,
      notes: "New client, wants a buzz cut every month.",
    });
    expect(typeof res.body.id).toBe("number");
  });

  it("updates an existing client's note in place instead of duplicating it", async () => {
    const before = await request(app).get(
      `/clientNotes/${encodeURIComponent("(555) 555-0142")}`,
    );

    const put = await request(app).put("/clientNotes").send({
      client_identifier: "(555) 555-0142",
      client_name: "Sam Rivera",
      last_service_type_id: 5,
      notes: "Switched to a hot towel shave, wants the same next time.",
    });

    expect(put.status).toBe(204);

    const after = await request(app).get(
      `/clientNotes/${encodeURIComponent("(555) 555-0142")}`,
    );
    expect(after.body.id).toBe(before.body.id);
    expect(after.body).toMatchObject({
      last_service_type_id: 5,
      notes: "Switched to a hot towel shave, wants the same next time.",
    });
  });

  it("rejects invalid input with 400", async () => {
    const res = await request(app).put("/clientNotes").send({
      client_identifier: "(555) 555-0142",
      client_name: "Sam Rivera",
      last_service_type_id: 5,
      notes: "   ",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/notes/);
  });

  it("rejects a client_identifier that isn't formatted as a phone number", async () => {
    const res = await request(app).put("/clientNotes").send({
      client_identifier: "555-0142",
      client_name: "Sam Rivera",
      last_service_type_id: 5,
      notes: "Some notes.",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/client_identifier/);
  });
});
