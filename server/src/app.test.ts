import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./app";

describe("POST /check", () => {
  it("returns a fit result for valid input", async () => {
    const res = await request(app)
      .post("/check")
      .send({ item: { width: 55, height: 153, depth: 55 }, door: { width: 80, height: 200 } });
    expect(res.status).toBe(200);
    expect(res.body.fits).toBe(true);
  });

  it("rejects negative dimensions with 400", async () => {
    const res = await request(app)
      .post("/check")
      .send({ item: { width: -1, height: 10, depth: 10 }, door: { width: 80, height: 200 } });
    expect(res.status).toBe(400);
  });

  it("rejects a missing door with 400", async () => {
    const res = await request(app).post("/check").send({ item: { width: 1, height: 1, depth: 1 } });
    expect(res.status).toBe(400);
  });
});