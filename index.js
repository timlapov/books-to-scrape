import {createTable} from "./database.js";
import {scrape} from "./scrape.js";

console.log("********* Hello *********");
// console.log(`
// 1. Créer une base de données
// 2. Démarrer le scraping
// 3. Afficher les statistiques
// `)

// Create a database if not exists
createTable();

// Scraping
scrape().then(r => console.log(r));


