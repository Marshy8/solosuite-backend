import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { getBusyIntervals } from "../../src/services/google_services/googleCalendar.service";

vi.mock("../../src/services/google_services/googleCalendar.service", () => ({
  getBusyIntervals: vi.fn(),
}));

const getBusyIntervalsMock = vi.mocked(getBusyIntervals);

beforeEach(() => {
  vi.clearAllMocks();
  getBusyIntervalsMock.mockResolvedValue([]);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("GET /availability", () => {
  it("returns 200 with an array of ISO slot times for a valid service type", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T13:30:00.000Z")); // 09:30 EDT Monday — mid-window (seeded 09:00-17:00)

    const res = await request(app)
      .get("/availability")
      .query({ serviceTypeId: 1 });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toBe("2026-08-10T13:30:00.000Z");
  });

  it("rejects a missing serviceTypeId with 400", async () => {
    const res = await request(app).get("/availability");

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/serviceTypeId/);
  });

  it("rejects an unknown serviceTypeId with 400", async () => {
    const res = await request(app)
      .get("/availability")
      .query({ serviceTypeId: 999 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/No service type/);
  });

  it("maps a Google failure to 502", async () => {
    getBusyIntervalsMock.mockRejectedValue(new Error("Google is down"));

    const res = await request(app)
      .get("/availability")
      .query({ serviceTypeId: 1 });

    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/Availability request failed/);
  });
});
