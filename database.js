import { Database } from "bun:sqlite";

const db = new Database('books.db', { create: true });

export function createTable() {
    const createTableQuery = db.query(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_link TEXT NOT NULL,
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
    try {
        createTableQuery.run();
        console.log('The books table has been successfully created');
    } catch (error) {
        console.error('Error creating the books table: ', error);
    }
}


export function insertBook(book) {
    const insertQuery = db.query(`
    INSERT INTO books (title, source_link, description, rating, price_with_tax, price_without_tax, in_stock, upc, photoUrl)
    VALUES ($title, $source_link, $description, $rating, $price_with_tax, $price_without_tax, $in_stock, $upc, $photoUrl)
    `);
    try {
        insertQuery.run({
            $title: book.title,
            $source_link: book.source_link,
            $description: book.description,
            $rating: book.rating,
            $price_with_tax: book.price_with_tax,
            $price_without_tax: book.price_without_tax,
            $in_stock: book.in_stock,
            $upc: book.upc,
            $photoUrl: book.photoUrl
        });
    } catch (error) {
        console.error('Error inserting book: ', error); // TODO Log the error
    }
}

export function bookAlreadyExists(book) {
    const selectQuery = db.query(`
    SELECT * FROM books WHERE upc = $upc
    `);
    const result = selectQuery.all({$upc: book.upc});
    return result.length > 0;
}