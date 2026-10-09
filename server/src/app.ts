import express from "express";
import { checkRouter } from "./routes/check";

export const app = express();
app.use(express.json());
app.use(checkRouter);