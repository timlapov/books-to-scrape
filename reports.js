import {getTotalBooks, getAveragePrice, getBooksInStock} from "./database.js";

let writer;

export async function logErrorToFile(message, error = "") {
    const timestamp = new Date().toISOString();
    if (!writer) {
        const file = Bun.file(`error_${timestamp}.log`);
        writer = file.writer();
    }
    const logEntry = `[${timestamp}] ${message}${error ? ' | ' + error : ''}\n`;
    writer.write(logEntry);
}

export async function writeReportToFile(message) {
    const timestamp = new Date().toISOString();
    const file = Bun.file(`report.log`);
    const totalBooksInDb = await getTotalBooks();
    const averagePrice = await getAveragePrice();
    const booksInStock = await getBooksInStock();

    console.log(totalBooksInDb);
    console.log(averagePrice);
    console.log(booksInStock);

    await file.write(`
        Report generated at ${timestamp}
        ${message}
        
        Dataset overview statistics:    
        - Total books in the database:  ${totalBooksInDb}
        - Average price (with tax):     ${averagePrice}
        - Total books in stock:         ${booksInStock}
        
    `);
}

export async function showReport() {
    console.log("*".repeat(40) + "Last report" + "*".repeat(40));
    console.log(await Bun.file(`report.log`).text());
}