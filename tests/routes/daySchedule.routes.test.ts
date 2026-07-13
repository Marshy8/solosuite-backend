import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app";

describe("GET /daySchedule/schedule", () => {
  it("returns all 7 seeded days", async () => {
    const res = await request(app).get("/daySchedule");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(7);
    expect(res.body[1]).toEqual({
      id: 1,
      start_time: "09:00",
      end_time: "17:00",
      is_working: 1,
    });
  });
});

describe("PUT /daySchedule", () => {
  it("updates a working day and the change shows in the week", async () => {
    const put = await request(app).put("/daySchedule").send({
      day: 2,
      is_working: true,
      start_time: "08:00",
      end_time: "12:00",
    });

    expect(put.status).toBe(204);

    const week = await request(app).get("/daySchedule");
    expect(week.body[2]).toEqual({
      id: 2,
      start_time: "08:00",
      end_time: "12:00",
      is_working: 1,
    });
  });

  it("sets a day off and nulls its times", async () => {
    const put = await request(app)
      .put("/daySchedule")
      .send({ day: 5, is_working: false });

    expect(put.status).toBe(204);

    const week = await request(app).get("/daySchedule");
    expect(week.body[5]).toEqual({
      id: 5,
      start_time: null,
      end_time: null,
      is_working: 0,
    });
  });

  it("rejects an invalid day with the validation message", async () => {
    const res = await request(app)
      .put("/daySchedule")
      .send({ day: 9, is_working: false });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/0-6/);
  });

  it("rejects a bad time format with the validation message", async () => {
    const res = await request(app)
      .put("/daySchedule")
      .send({ day: 2, is_working: true, start_time: "9am", end_time: "12:00" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/HH:MM/);
  });
});
