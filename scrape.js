import {createBook} from "./Book.js";
import {insertBook} from "./database.js";
import {bookToDbObject} from "./Book.js";

const jsdom = require("jsdom");
const url = require("node:url");
const { JSDOM } = jsdom;

const baseUrl = "https://books.toscrape.com/catalogue/";

let booksUrls = [];

const testBook = createBook({
    title: "test",
    sourceLink: "google.com",
    description: "testTESTtest",
    rating: 5,
    priceWithTax: 10,
    priceWithoutTax: 10,
    inStock: 10,
    upc: "1234567890",
    photoUrl: "https://books.toscrape.com/media/catalog/product/cache/700x525/9df78eab33525d08d6e5fb8d27136e95/b/o/book_cover_placeholder_large.jpg"
});
const testBookUrl = "https://books.toscrape.com/catalogue/soumission_998/index.html";

console.log('Scraping started...');

// Get the number of pages and save it as a constant
console.log("Getting the number of pages...");
const NUMBER_OF_PAGES = await getNumberOfPages();
console.log("Total pages: ", NUMBER_OF_PAGES);

//Get links to the book's webpage
console.log("Getting book urls...");
//booksUrls = await getBooksUrls();
console.log("Total books: ", booksUrls.length);


console.log("Getting book details...");
console.log(await getBookDetails(testBookUrl));


console.log("Saving book details...");


//saveBookDetails(testBook);
//console.log(await getPageHTML(baseUrl + `page-1.html`));
//console.log(await getNumberOfPages())
//console.log(await getBooksUrls());

async function processAllBooks(booksUrls) {

}

async function getBookDetails(url) {
    const bookPageHTML = await getPageHTML(url);
    const dom = new JSDOM(bookPageHTML);

    return createBook({
        title: dom.window.document.querySelector('h1').textContent,
        sourceLink: url,
        description: dom.window.document.querySelector('article.product_page > p').textContent,
        rating: -1, //TODO
        priceWithTax: parseFloat(dom.window.document.querySelector('table tr:nth-child(4) td')?.textContent?.trim().slice(1)),
        priceWithoutTax: parseFloat(dom.window.document.querySelector('table tr:nth-child(3) td')?.textContent?.trim().slice(1)),
        inStock: parseInt(dom.window.document.querySelector('table tr:nth-child(6) td')?.textContent?.slice(10, 12)) || 0,
        upc: dom.window.document.querySelector('table tr:nth-child(1) td')?.textContent?.trim(),
        photoUrl: baseUrl.slice(0, 27) + dom.window.document.querySelector('#product_gallery.carousel img').src.slice(6)
    });
}

async function saveBookDetails(book) {
//TODO doublons
    const dbObject = bookToDbObject(book);
    insertBook(dbObject);
}

async function getNumberOfPages() {
    const mainPage = await getPageHTML(baseUrl + `page-1.html`);
    const dom = new JSDOM(mainPage);
    const text = dom.window.document.querySelector('ul.pager li.current').textContent;
    return parseInt(text.split(' of ')[1]);
}

async function getBooksUrls() {
    let urls = [];
    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
        const pageUrl = baseUrl + `page-${i}.html`;
        const html = await getPageHTML(pageUrl);
        const dom = new JSDOM(html);

        // const url = dom.window.document.querySelector('article.product_pod a').href;
        // console.log(url);
        urls.push([...dom.window.document.querySelectorAll('article.product_pod h3 a')].map(a => a.href));
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
        throw error;
    }
}