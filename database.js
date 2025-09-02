import { Database } from "bun:sqlite";
import {logErrorToFile} from "./reports.js";

const db = new Database('books.db', { create: true });

export async function createTable() {
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
        await logErrorToFile('Error creating the books table: ', error);
    }
}

export async function deleteDatabaseFile() {
    try {
        await Bun.file('books.db').delete();
        console.log('Database file deleted successfully');
    } catch (error) {
        console.error('Error deleting database file: ', error);
        await logErrorToFile('Error deleting database file: ', error);
    }
}


export async function insertBook(book) {
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
        console.error('Error inserting book: ', error);
        await logErrorToFile('Error inserting book: ', error);
    }
}

export function bookAlreadyExists(book) {
    const selectQuery = db.query(`
    SELECT * FROM books WHERE upc = $upc
    `);
    const result = selectQuery.all({$upc: book.upc});
    return result.length > 0;
}

export async function getTotalBooks() {
    const selectQuery = db.query(`
    SELECT COUNT(*) as total_books FROM books
    `);
    return selectQuery.all()[0].total_books;
}

export async function getAveragePrice() {
    const selectQuery = db.query(`
    SELECT AVG(price_with_tax) as average_price FROM books
    `);
    return selectQuery.all()[0].average_price;
}

export async function getBooksInStock() {
    const selectQuery = db.query(`
    SELECT SUM(in_stock) as books_in_stock FROM books
    `);
    return selectQuery.all()[0].books_in_stock;
}