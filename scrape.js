import {createBook} from "./Book.js";
import {insertBook} from "./database.js";
import {bookToDbObject} from "./Book.js";
import {bookAlreadyExists} from "./database.js";
import {logErrorToFile, writeReportToFile} from "./reports.js";
import { JSDOM } from "jsdom";
import * as readline from "node:readline";

const baseUrl = "https://books.toscrape.com/catalogue/";
let booksUrls = [];
let booksUrlsWithErrors = [];
let numberOfPages;

// For report
let bookDetailsCounterForReport = 0;
let savedBooksCounterForReport = 0;

export async function scrape() {
    console.log('Scraping started...');

// Get the number of pages and save it as a constant
    console.log("Getting the number of pages...");
    numberOfPages = await getNumberOfPages();
    console.log("Total pages: ", numberOfPages);

//Get links to the book's webpage
    console.log("Getting book urls...");
    booksUrls = await getBooksUrls();
    console.log("\nTotal books: ", booksUrls.length);

// Get book details and save them to the database Sqlite
    console.log("Getting and saving book details...");
    await processBooks(booksUrls);

    // If there are errors, try to get the data again
    if (booksUrlsWithErrors.length > 0) {
        console.log(`${booksUrlsWithErrors.length} errors occurred during the process. We'll make three attempts to get the data.`);
        for (let i = 0; i < 3; i++) {
            console.log(`Attempt ${i + 1} of 3`);
            await processBooks(booksUrlsWithErrors);
            console.log(`Waiting ${i} minutes before the next attempt...`);
            await Bun.sleep(i * 60 * 1000); // FOR PRESENTATION
        }
    }

    // Save and show the final report
    console.log("Saving report...");
    await writeReportToFile(`\nOf ${booksUrls.length} books received: ${bookDetailsCounterForReport} books, saved to db: ${savedBooksCounterForReport}`);
    console.log(`********** FINAL REPORT  **********
    \nOf ${booksUrls.length} books received: ${bookDetailsCounterForReport} books, saved to db: ${savedBooksCounterForReport}`
    );

    console.log("Scraping finished!");
}


async function processBooks(urls) {
    const total = urls.length;
    let getBookDetailsCounter = 0;
    let savedBooksCounter = 0;
    let doublesCounter = 0;

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        let book;

        try {
            book = await getBookDetails(url);
            getBookDetailsCounter++;
        } catch (error) {
            console.error(`URL: ${url} | Error getting book details: `, error);
            await logErrorToFile(`URL: ${url} | Error getting book details: `, error);
            booksUrlsWithErrors.push(url);
            continue;
        }

        if (!bookAlreadyExists(book)) {
            try {
                await saveBookDetails(book);
                savedBooksCounter++;
            } catch (error) {
                console.error(`URL: ${url} | Error saving book details: `, error);
                await logErrorToFile(`URL: ${url} | Error saving book details: `, error);
                continue;
            }
        } else {
            doublesCounter++;
            console.log(`URL: ${url} | Book already exists in the database`);
            await logErrorToFile(`URL: ${url} | Book already exists in the database`);
        }

        const current = i + 1;
        const progress = current / total;
        const barLength = 40;
        const filledLength = Math.round(barLength * progress);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        const textLine = `[${bar}] ${current}/${total} (${Math.round(progress * 100)}%)`;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(textLine);
    }

    console.log(`\nOf ${urls.length} books received: ${getBookDetailsCounter} books, doubles: ${doublesCounter}, errors: ${booksUrlsWithErrors.length}, saved to db: ${savedBooksCounter}`);

    savedBooksCounterForReport += savedBooksCounter;
    bookDetailsCounterForReport += getBookDetailsCounter;
}


async function getBookDetails(url) {
    const bookPageHTML = await getPageHTML(url);
    const dom = new JSDOM(bookPageHTML);

    return createBook({
        title: dom.window.document.querySelector('h1').textContent || '',
        sourceLink: url,
        description: dom.window.document.querySelector('#product_description + p')?.textContent?.trim() || '',
        rating: (() => {
            const ratingElement = dom.window.document.querySelector('.star-rating');
            if (!ratingElement) return 0;
            const ratingClass = ratingElement.className.split(' ')[1];
            return ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'].indexOf(ratingClass) || -1;
        })(),
        priceWithTax: parseFloat(dom.window.document.querySelector('table tr:nth-child(4) td')?.textContent?.trim().slice(1)) || -1,
        priceWithoutTax: parseFloat(dom.window.document.querySelector('table tr:nth-child(3) td')?.textContent?.trim().slice(1)) || -1,
        inStock: parseInt(dom.window.document.querySelector('table tr:nth-child(6) td')?.textContent?.slice(10, 12)) || 0,
        upc: dom.window.document.querySelector('table tr:nth-child(1) td')?.textContent?.trim() || '',
        photoUrl: baseUrl.slice(0, 27) + dom.window.document.querySelector('#product_gallery.carousel img').src.slice(6) || ''
    });
}

async function saveBookDetails(book) {
    const dbObject = bookToDbObject(book);
    insertBook(dbObject); // QUESTION
}

async function getNumberOfPages() {
    const mainPage = await getPageHTML(baseUrl + `page-1.html`);
    const dom = new JSDOM(mainPage);
    const text = dom.window.document.querySelector('ul.pager li.current').textContent;
    return parseInt(text.split(' of ')[1]);
}

async function getBooksUrls() {
    let urls = [];
    for (let i = 1; i <= numberOfPages; i++) {
        const pageUrl = baseUrl + `page-${i}.html`;
        const html = await getPageHTML(pageUrl);
        const dom = new JSDOM(html);
        urls.push([...dom.window.document.querySelectorAll('article.product_pod h3 a')].map(a => a.href));

        const progress = i / numberOfPages;
        const barLength = 40;
        const filledLength = Math.round(barLength * progress);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        const textLine = `[${bar}] (${Math.round(progress * 100)}%)`;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(textLine);
    }
    return urls.flat().map(url => baseUrl + url);
}

async function getPageHTML(url) {
    try {
        const response = await fetch(url);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Getting HTML as text
        return await response.text();

    } catch (error) {
        console.error('Error when requesting a page: ', error);
        await logErrorToFile('Error when requesting a page: ', error);
        throw error;
    }
}