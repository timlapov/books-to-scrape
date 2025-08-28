import { Database } from "bun:sqlite";

const db = new Database('books.db', { create: true });

createTable();

export function createTable() {
    const createTableQuery = db.query(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sourceLink TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        rating INTEGER,
        price_with_tax REAL,
        price_without_tax REAL,
        in_stock INTEGER,
        upc TEXT NOT NULL,
        photoUrl TEXT
    )
`);
    createTableQuery.run();
    console.log('The books table has been successfully created');
}
