const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const baseUrl = `https://books.toscrape.com/catalogue/`

let booksUrls = [];

console.log('Scraping started...');

// Get the number of pages and save it as a constant
console.log("Getting the number of pages...");
const NUMBER_OF_PAGES = await getNumberOfPages();
console.log("Total pages: ", NUMBER_OF_PAGES);

//Get links to the book's webpage
console.log("Getting book urls...");
booksUrls = await getBooksUrls();
console.log("Total books: ", booksUrls.length);


console.log("Getting book details...");

console.log("Saving book details...");


//console.log(await getPageHTML(baseUrl + `page-1.html`));
//console.log(await getNumberOfPages())
//console.log(await getBooksUrls());

async function processAllBooks(booksUrls) {

}

async function getBookDetails() {

}

async function saveBookDetails() {

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