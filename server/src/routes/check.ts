import { Router } from "express";
import { z } from "zod";
import { fitsThroughDoor } from "../../../shared/src/fit";

const positive = z.number().positive();

const checkSchema = z.object({
  item: z.object({ width: positive, height: positive, depth: positive }),
  door: z.object({ width: positive, height: positive }),
  clearance: z.number().min(0).default(0),
});

export const checkRouter = Router();

checkRouter.post("/check", (req, res) => {
  const parsed = checkSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }
  const { item, door, clearance } = parsed.data;
  res.json(fitsThroughDoor(item, door, clearance));
});