import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "./app";
import { openDb } from "./db";

let app: ReturnType<typeof createApp>;
beforeEach(() => {
    app = createApp(openDb(":memory:"));
});

const sample = { name: "Test box", width: 50, height: 100, depth: 30 };

describe("/items", () => {
    it("starts empty", async () => {
        const res = await request(app).get("/items");
        expect(res.body).toEqual([]);
    });

    it("creates and fetches an item", async () => {
        const created = await request(app).post("/items").send(sample);
        expect(created.status).toBe(201);
        const fetched = await request(app).get(`/items/${created.body.id}`);
        expect(fetched.body).toMatchObject(sample);
    });

    it("rejects invalid items with 400", async () => {
        const res = await request(app).post("/items").send({ ...sample, width: 0 });
        expect(res.status).toBe(400);
    });

    it("returns 404 for a missing item", async () => {
        const res = await request(app).get("/items/999");
        expect(res.status).toBe(404);
    });

    it("deletes an item", async () => {
        const created = await request(app).post("/items").send(sample);
        const del = await request(app).delete(`/items/${created.body.id}`);
        expect(del.status).toBe(204);
        const after = await request(app).get(`/items/${created.body.id}`);
        expect(after.status).toBe(404);
    });
});