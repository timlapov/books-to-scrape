# Books to Scrape - Web Scraping Project

Web scraper for the [Books to Scrape](https://books.toscrape.com) website, built with JavaScript using modern technologies to demonstrate web scraping skills, database operations, and data processing.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh) - fast JavaScript runtime and package manager
- **Database**: SQLite via `bun:sqlite` - embedded database for local storage
- **DOM Parsing**: JSDOM - server-side DOM parser for HTML processing
- **Error Handling**: Custom error logging system with file output
- **Progress Tracking**: Console progress bar with visual progress indication

## 📁 Project Architecture

```
books-to-scrape/
├── index.js          # Main file with interactive menu
├── scrape.js          # Core scraping logic
├── database.js        # SQLite database functions
├── Book.js            # Book data model and utilities
├── reports.js         # Logging and reporting system
├── books.db           # SQLite database (auto-created)
└──  package.json       # Project dependencies
```

## 🎯 Core Features

### 1. Interactive Menu
- Database creation
- Scraping process launch
- Last report viewing
- Database deletion
- Application exit

### 2. Web Scraping
- **Data Source**: https://books.toscrape.com/catalogue/
- **Multi-stage Process**:
  1. Determine total number of pages
  2. Collect URLs of all books
  3. Extract detailed information for each book
  4. Save to database

### 3. Extracted Data
For each book, the following information is collected:
- Title (`title`)
- Source link (`sourceLink`)
- Description (`description`)
- Rating (1 to 5 stars) (`rating`)
- Price with tax (`priceWithTax`)
- Price without tax (`priceWithoutTax`)
- Stock quantity (`inStock`)
- UPC code (`upc`)
- Photo URL (`photoUrl`)

### 4. Error Handling and Retry Logic
- Automatic error detection and logging
- 3 retry attempts for failed data retrieval
- Progressive delays between attempts to prevent server overload
- Comprehensive logging of all operations

### 5. Progress and Reporting
- Visual progress bar during scraping
- Detailed statistics upon completion
- Report saving to files
- Duplicate detection by UPC code

## 🛠 Installation and Setup

### Prerequisites
- [Bun](https://bun.sh) runtime (v1.0+)

### Installation
```bash
# Clone repository
git clone https://github.com/timlapov/books-to-scrape.git
cd books-to-scrape

# Install dependencies
bun install
```

### Running
```bash
bun run index.js
```

## 📊 Database

### `books` Table Schema
```sql
CREATE TABLE books (
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
);
```

## 🎮 Usage Scenarios

### Scenario 1: First Run
1. Launch application: `bun run index.js`
2. Select option `1` - create database
3. Select option `2` - start scraping
4. Wait for process completion
5. Select option `3` - view report

### Scenario 2: Data Update
1. Launch application
2. Select option `2` - start scraping
3. System automatically skips duplicates
4. New books will be added to database

### Scenario 3: Clean Start
1. Select option `4` - delete database
2. Select option `1` - create new database
3. Select option `2` - start new scraping

## 📈 Performance and Features

### Optimizations
- Bun runtime usage for enhanced performance
- Built-in SQLite database without additional dependencies
- Efficient DOM parsing with JSDOM
- Batch URL processing

### Recovery System
- Automatic tracking of failed URLs
- Multiple data retrieval attempts
- Progressive delays between attempts
- Detailed logging for diagnostics

### Duplicate Handling
- Book existence checking by UPC code
- Prevention of data duplication
- Duplicate statistics in reports

## 📝 Logging and Reports

### Log Types
- **Errors**: `error_<timestamp>.log` - detailed error logs
- **Reports**: `report.log` - final scraping statistics
- **Console Output**: Real-time progress

### Report Example
```
Of 1000 books received: 995 books, doubles: 0, errors: 5, saved to db: 995
```

## 🤝 Demonstrated Skills

- **Web Scraping**: Structured data extraction from websites
- **DOM Manipulation**: HTML structure parsing and navigation
- **Database Operations**: Schema design and CRUD operations
- **Error Handling**: Robust error handling and recovery mechanisms
- **Asynchronous Programming**: Efficient async/await usage
- **User Experience**: Interactive console interfaces
- **Logging Systems**: Comprehensive logging and reporting systems
- **Modern Technologies**: Cutting-edge Bun runtime usage

## Documentation used:
- [Bun](https://bun.sh)
- [Bun Gudies](https://bun.com/guides)
- [SQLite](https://www.sqlite.org)
- [JSDOM](https://github.com/jsdom/jsdom)

---

*This project was created to demonstrate professional skills in web scraping, database operations, and modern JavaScript development.*