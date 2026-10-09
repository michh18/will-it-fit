import express from "express";
import { checkRouter } from "./routes/check";
import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Malformed JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
};

export const app = express();
app.use(express.json());
app.use(checkRouter);
app.use(errorHandler);