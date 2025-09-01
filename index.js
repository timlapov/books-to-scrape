import {createTable, deleteDatabaseFile} from "./database.js";
import {scrape} from "./scrape.js";
import {showReport} from "./reports.js";

console.log("********* Hello *********");

const prompt =`
1. Create a database
2. Start scraping
3. Display last report
4. Delete database
0. Exit
`;

process.stdout.write(prompt);
for await (const line of console) {
    console.log(`You  chose ${line}. Operation in progress...`);
    switch (line) {
        case '1':
            await createTable();
            break;
        case '2':
            await scrape();
            break;
        case '3':
            await showReport();
            break;
        case '4':
            await deleteDatabaseFile();
            break;
        case '0':
            process.exit(0);
        default:
            console.log('Wrong input');
    }
    process.stdout.write(prompt);
}