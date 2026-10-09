import { Router } from "express";
import { z } from "zod";
import type { Db } from "../db";
import { fitsThroughDoor } from "../../../shared/src/fit";

const positive = z.number().positive();
const dims = z.object({ width: positive, height: positive, depth: positive });

const checkSchema = z.object({
    item: dims.optional(),
    itemId: z.number().int().positive().optional(),
    door: z.object({ width: positive, height: positive }),
    clearance: z.number().min(0).default(0),
}).refine((b) => (b.item !== undefined) !== (b.itemId !== undefined), {
    message: "Provide either item or itemId, not both",
});

export function createCheckRouter(db: Db) {
    const router = Router();

    router.post("/check", (req, res) => {
        const parsed = checkSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
        }
        const { door, clearance, itemId } = parsed.data;
        let item = parsed.data.item;

        if (itemId !== undefined) {
            const row = db.prepare("SELECT width, height, depth FROM items WHERE id = ?").get(itemId) as
                | { width: number; height: number; depth: number }
                | undefined;
            if (!row) return res.status(404).json({ error: "Item not found" });
            item = row;
        }

        res.json(fitsThroughDoor(item!, door, clearance));
    });

    return router;
}