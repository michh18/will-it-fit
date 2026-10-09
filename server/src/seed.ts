import type { Db } from "./db";

const SEED_ITEMS = [
    { name: "Tall wardrobe box", width: 60, height: 236, depth: 20 },
    { name: "Bookcase box", width: 80, height: 202, depth: 28 },
    { name: "Chest of drawers box", width: 70, height: 100, depth: 45 },
    { name: "Desk box", width: 120, height: 20, depth: 65 },
    { name: "Bedside table box", width: 45, height: 60, depth: 40 },
];

export function seedIfEmpty(db: Db) {
    const { count } = db.prepare("SELECT COUNT(*) AS count FROM items").get() as { count: number };
    if (count > 0) return;
    const insert = db.prepare("INSERT INTO items (name, width, height, depth) VALUES (@name, @width, @height, @depth)");
    db.transaction(() => SEED_ITEMS.forEach((i) => insert.run(i)))();
}