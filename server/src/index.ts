import { createApp } from "./app";
import { openDb } from "./db";
import { seedIfEmpty } from "./seed";

const db = openDb();
seedIfEmpty(db);

const port = process.env.PORT ?? 3000;
createApp(db).listen(port, () => console.log(`Server running on http://localhost:${port}`));