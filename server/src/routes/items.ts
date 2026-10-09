import { Router } from "express";
import { z } from "zod";
import type { Db } from "../db";

const positive = z.number().positive();
const itemSchema = z.object({
    name: z.string().trim().min(1).max(100),
    width: positive,
    height: positive,
    depth: positive,
});

export function createItemsRouter(db: Db) {
    const router = Router();

    router.get("/", (_req, res) => {
        res.json(db.prepare("SELECT * FROM items ORDER BY id").all());
    });

    router.get("/:id", (req, res) => {
        const item = db.prepare("SELECT * FROM items WHERE id = ?").get(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.json(item);
    });

    router.post("/", (req, res) => {
        const parsed = itemSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
        }
        const { lastInsertRowid } = db
            .prepare("INSERT INTO items (name, width, height, depth) VALUES (@name, @width, @height, @depth)")
            .run(parsed.data);
        const created = db.prepare("SELECT * FROM items WHERE id = ?").get(lastInsertRowid);
        res.status(201).json(created);
    });

    router.delete("/:id", (req, res) => {
        const { changes } = db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
        if (changes === 0) return res.status(404).json({ error: "Item not found" });
        res.status(204).end();
    });

    return router;
}