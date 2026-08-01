import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";

describe("GET /generalSettings", () => {
  it("returns the seeded singleton row", async () => {
    const res = await request(app).get("/generalSettings");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      worker_name: "Buck Harris",
      rolling_schedule_length: 60,
      buffer_minutes: 15,
      timezone: "America/New_York",
    });
  });
});

describe("PUT /generalSettings", () => {
  it("updates the row and the change is reflected on GET", async () => {
    const put = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "America/Chicago",
    });

    expect(put.status).toBe(204);

    const res = await request(app).get("/generalSettings");
    expect(res.body).toEqual({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "America/Chicago",
    });
  });

  it("rejects null rolling_schedule_length with 400", async () => {
    const res = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: null,
      buffer_minutes: 10,
      timezone: "America/New_York",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/rolling_schedule_length/);
  });

  it("rejects null buffer_minutes with 400", async () => {
    const res = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: null,
      timezone: "America/New_York",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/buffer_minutes/);
  });

  it("rejects an id other than 1 with 400 and doesn't change the row", async () => {
    const before = await request(app).get("/generalSettings");

    const res = await request(app).put("/generalSettings").send({
      id: 2,
      worker_name: "Someone",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "America/New_York",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/id/);

    const after = await request(app).get("/generalSettings");
    expect(after.body).toEqual(before.body);
  });

  it("rejects an empty worker_name with 400", async () => {
    const res = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "   ",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "America/New_York",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/worker_name/);
  });

  it("rejects a negative rolling_schedule_length with 400", async () => {
    const res = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: -1,
      buffer_minutes: 10,
      timezone: "America/New_York",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/rolling_schedule_length/);
  });

  it("rejects a negative buffer_minutes with 400", async () => {
    const res = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: -1,
      timezone: "America/New_York",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/buffer_minutes/);
  });

  it("rejects an invalid timezone with 400", async () => {
    const res = await request(app).put("/generalSettings").send({
      id: 1,
      worker_name: "Jane Doe",
      rolling_schedule_length: 30,
      buffer_minutes: 10,
      timezone: "Not/A_Real_Zone",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/timezone/);
  });
});
