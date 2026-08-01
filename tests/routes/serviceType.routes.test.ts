import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";

describe("GET /serviceType/all", () => {
  it("returns all 5 seeded service types", async () => {
    const res = await request(app).get("/serviceType/all");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });
});

describe("GET /serviceType/active", () => {
  it("returns all 5 seeded service types (all active)", async () => {
    const res = await request(app).get("/serviceType/active");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });
});

describe("GET /serviceType/:id", () => {
  it("returns the seeded service type matching the id", async () => {
    const res = await request(app).get("/serviceType/3");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
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

describe("POST /serviceType", () => {
  it("creates a service type and it shows up in the list", async () => {
    const post = await request(app).post("/serviceType").send({
      id: -1,
      name: "Kids Cut",
      cost: 1800,
      description: "Haircut for children under 12.",
      duration_minutes: 20,
      buffer_override_minutes: 5,
      is_active: true,
    });

    expect(post.status).toBe(201);

    const all = await request(app).get("/serviceType/all");
    expect(all.body).toHaveLength(6);
    expect(all.body.find((s: { name: string }) => s.name === "Kids Cut")).toEqual({
      id: 6,
      name: "Kids Cut",
      cost: 1800,
      description: "Haircut for children under 12.",
      duration_minutes: 20,
      buffer_override_minutes: 5,
      is_active: 1,
    });
  });

  it("accepts null for buffer_override_minutes", async () => {
    const post = await request(app).post("/serviceType").send({
      id: -1,
      name: "No Override",
      cost: 1000,
      description: "desc",
      duration_minutes: 10,
      buffer_override_minutes: null,
      is_active: true,
    });

    expect(post.status).toBe(201);

    const all = await request(app).get("/serviceType/all");
    expect(
      all.body.find((s: { name: string }) => s.name === "No Override"),
    ).toMatchObject({ buffer_override_minutes: null });
  });

  it("rejects invalid input with 400 and doesn't add a row", async () => {
    const before = await request(app).get("/serviceType/all");

    const res = await request(app).post("/serviceType").send({
      id: -1,
      name: "",
      cost: 1000,
      description: "desc",
      duration_minutes: 10,
      buffer_override_minutes: 0,
      is_active: true,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/);

    const after = await request(app).get("/serviceType/all");
    expect(after.body).toHaveLength(before.body.length);
  });
});

describe("PUT /serviceType", () => {
  it("updates an existing service type", async () => {
    const put = await request(app).put("/serviceType").send({
      id: 2,
      name: "Classic Haircut",
      cost: 3500,
      description: "Scissor and clipper cut with styling.",
      duration_minutes: 35,
      buffer_override_minutes: 10,
      is_active: true,
    });

    expect(put.status).toBe(204);

    const res = await request(app).get("/serviceType/2");
    expect(res.body).toEqual({
      id: 2,
      name: "Classic Haircut",
      cost: 3500,
      description: "Scissor and clipper cut with styling.",
      duration_minutes: 35,
      buffer_override_minutes: 10,
      is_active: 1,
    });
  });

  it("rejects invalid input with 400", async () => {
    const res = await request(app).put("/serviceType").send({
      id: 2,
      name: "   ",
      cost: 3500,
      description: "desc",
      duration_minutes: 35,
      buffer_override_minutes: 10,
      is_active: true,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/);
  });

  it("clears an existing buffer_override_minutes back to null", async () => {
    const put = await request(app).put("/serviceType").send({
      id: 4,
      name: "Haircut + Beard",
      cost: 4000,
      description: "Full haircut combined with a beard trim.",
      duration_minutes: 45,
      buffer_override_minutes: null,
      is_active: true,
    });

    expect(put.status).toBe(204);

    const res = await request(app).get("/serviceType/4");
    expect(res.body.buffer_override_minutes).toBeNull();
  });
});

describe("DELETE /serviceType/:id", () => {
  it("deactivates the service type without removing it", async () => {
    const del = await request(app).delete("/serviceType/4");
    expect(del.status).toBe(204);

    const all = await request(app).get("/serviceType/all");
    expect(all.body.some((s: { id: number }) => s.id === 4)).toBe(true);

    const active = await request(app).get("/serviceType/active");
    expect(active.body.some((s: { id: number }) => s.id === 4)).toBe(false);
  });
});
