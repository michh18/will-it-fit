import Database from "better-sqlite3";

export type Db = Database.Database;

export function openDb(path = "will-it-fit.db"): Db {
    const db = new Database(path);
    db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      width      REAL NOT NULL CHECK (width > 0),
      height     REAL NOT NULL CHECK (height > 0),
      depth      REAL NOT NULL CHECK (depth > 0),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
    return db;
}