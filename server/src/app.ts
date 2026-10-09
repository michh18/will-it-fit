import express from "express";
import type { ErrorRequestHandler } from "express";
import type { Db } from "./db";
import { checkRouter } from "./routes/check";
import { createItemsRouter } from "./routes/items";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Malformed JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
};

export function createApp(db: Db) {
    const app = express();
    app.use(express.json());
    app.use(checkRouter);
    app.use("/items", createItemsRouter(db));
    app.use(errorHandler);
    return app;
}