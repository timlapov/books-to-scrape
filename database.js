import sqlite from 'sqlite3';

const db = new sqlite.Database('books.db');

createTable();

export function createTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        rating INTEGER,
        price_with_tax REAL,
        price_without_tax REAL,
        in_stock INTEGER,
        upc TEXT NOT NULL,
        photoUrl TEXT
    )
`;
    db.exec(createTableQuery);
    console.log('The books table has been successfully created');
}
