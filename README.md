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
├── index.js           # Main file with interactive menu
├── scrape.js          # Core scraping logic
├── database.js        # SQLite database functions
├── Book.js            # Book data model and utilities
├── reports.js         # Logging and reporting system
├── books.db           # SQLite database (auto-created)
└── package.json       # Project dependencies
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

## 🔄 How Scraping Works

### Scraping Workflow

The scraping process follows a multi-stage pipeline approach:

```
┌─────────────────────────────────────────────────────────────┐
│                     START SCRAPING                          │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: Get Total Pages Count                             │
│  • Fetch page-1.html                                        │
│    DOM creation const dom = new JSDOM(mainPage);            │
│  • Parse pagination element (response: " Page 1 of 50 ")    │
│    dom.window.document                                      │
│    .querySelector('ul.pager li.current').textContent;       │
│  • Extract total pages number                               │
│    parseInt(text.split(' of ')[1]);                         │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: Collect All Book URLs                             │
│  • Iterate through all pages (1 to N)                       │
│  • Extract book links from each page                        │
│  • Build complete URL list (~1000 books)                    │
│  • Show progress bar                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: Process Each Book                                 │
│  ┌─────────────────────────────────────┐                    │
│  │  For each book URL:                 │                    │
│  │  1. Fetch book page HTML            │                    │
│  │  2. Parse DOM with JSDOM            │                    │
│  │  3. Extract book details            │                    │
│  │  4. Check for duplicates (by UPC)   │                    │
│  │  5. Save to SQLite database         │                    │
│  │  *5.1. Error handling and display   │                    │
│  │  6. Update progress bar             │                    │
│  └─────────────────────────────────────┘                    │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 4: Error Recovery (if needed)                        │
│  • Collect failed URLs                                      │
│  • Retry up to 3 times                                      │
│  • Progressive delays (1, 2, 3 minutes)                     │
│  • Log persistent errors                                    │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 5: Generate Report                                   │
│  • Calculate statistics                                     │
│  • Write report.log file                                    │
│  • Display final summary                                    │
└─────────────────────────────────────────────────────────────┘
```

### Detailed Process Description

#### 1. **Page Count Discovery**
The scraper starts by determining the total scope of work:
- Fetches the first catalog page
- Locates the pagination element (`ul.pager li.current`)
- Extracts text like " Page 1 of 50 "
- Parses the total page count

#### 2. **URL Collection Phase**
Builds a complete list of book URLs to process:
- Iterates through pages 1 to N
- For each page, queries all book links: `article.product_pod h3 a`
- Constructs full URLs by combining base URL with relative paths
- Flattens nested arrays into a single list
- Real-time progress bar shows collection progress

#### 3. **Book Data Extraction**
For each collected URL, the scraper:

**a) Fetches the book page:**
- Sets 5-second timeout for requests
- Uses browser-like User-Agent headers
- Handles HTTP errors and timeouts

**b) Parses HTML content:**
- Creates virtual DOM using JSDOM
- Extracts data using CSS selectors:
  - Title: `h1` element
  - Description: `#product_description + p`
  - Rating: `.star-rating` class name
  - Prices: Table rows 3 and 4
  - Stock: Table row 6 (parses number from text)
  - UPC: Table row 1
  - Photo: `#product_gallery img` src attribute

**c) Data transformation:**
- Converts star ratings from text ("One", "Two") to numbers (1-5)
- Parses prices from strings to floats
- Extracts stock quantity from text like "In stock (22 available)"
- Constructs absolute photo URLs

#### 4. **Database Operations**
Before saving each book:
- Checks for duplicates using UPC as unique identifier
- If new: Inserts into SQLite database
- If duplicate: Skips and increments counter
- Handles insertion errors gracefully

#### 5. **Error Recovery Strategy**
The scraper implements intelligent error recovery:
- **First Pass**: Process all URLs, collect failures
- **Retry Attempts**: Up to 3 additional passes for failed URLs
- **Progressive Delays**: Waits 0, 1, 2 minutes between retries
- **Error Tracking**: Maintains detailed error logs with timestamps

#### 6. **Progress Visualization**
Throughout the process, users see:
```
🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 250/500 (50%)
```
- Green squares show completed work
- White squares show remaining work
- Current count and percentage displayed

### Key Implementation Details

- **Asynchronous Processing**: Uses async/await for non-blocking operations
- **Memory Efficiency**: Processes books sequentially to avoid memory overload
- **Network Courtesy**: Includes delays after errors to avoid server strain
- **Data Integrity**: Uses database transactions for reliable storage
- **Graceful Degradation**: Missing data fields get default values rather than failing

## 🛡️ Error Handling

### Error Types and Recovery Strategies

The application implements comprehensive error handling for various failure scenarios:

#### 1. **Network Errors**
- **HTTP Request Failures**: Non-200 status codes from the server
  - **Behavior**: Logs error with status code, adds URL to retry queue
  - **Recovery**: Automatic retry up to 3 times with progressive delays
  
- **Timeout Errors**: Requests exceeding 5-second timeout limit
  - **Behavior**: Aborts request, logs timeout error with URL
  - **Recovery**: 1-second delay before retry, up to 3 retry attempts

#### 2. **Data Parsing Errors**
- **DOM Parsing Failures**: Missing or malformed HTML elements
  - **Behavior**: Uses optional chaining (`?.`) and fallback values
  - **Recovery**: Default values assigned (empty strings, -1 for prices)
  
- **Book Detail Extraction Errors**: Failed to extract book information
  - **Behavior**: Catches error, logs URL and error details
  - **Recovery**: URL added to error queue for retry attempts

#### 3. **Database Errors**
- **Table Creation Failures**: SQLite table creation issues
  - **Behavior**: Logs error to file, displays console error
  - **Recovery**: Manual intervention required
  
- **Insert Operation Failures**: Failed book insertions
  - **Behavior**: Logs error with book details
  - **Recovery**: Continues with next book, prevents data loss
  
- **Duplicate Detection**: Books with existing UPC codes
  - **Behavior**: Skips insertion, increments duplicate counter
  - **Recovery**: No action needed, expected behavior

#### 4. **File System Errors**
- **Database File Deletion**: Failed to remove database file
  - **Behavior**: Logs error, notifies user
  - **Recovery**: Manual deletion may be required
  
- **Log File Write Failures**: Cannot write to error/report logs
  - **Behavior**: Console error output as fallback
  - **Recovery**: Check file permissions

### Retry Mechanism

The scraper implements a sophisticated retry system:

1. **Initial Processing**: All book URLs processed sequentially
2. **Error Collection**: Failed URLs collected in `booksUrlsWithErrors` array
3. **Retry Loop**: Up to 3 retry attempts with:
   - Progressive delays: 0 min, 1 min, 2 min between attempts
   - Batch processing of all failed URLs
   - Error queue reset after each attempt
4. **Final Report**: Logs remaining errors after all retry attempts

### Error Logging System

All errors are logged with:
- **Timestamp**: ISO format datetime for each error
- **Context**: URL being processed when error occurred
- **Error Details**: Full error message and stack trace
- **Persistent Storage**: Written to `error_<timestamp>.log` file

Example error log entry:
```
[2024-01-15T10:30:45.123Z] URL: https://books.toscrape.com/catalogue/book_123.html | Error getting book details: | TypeError: Cannot read property 'textContent' of null
```

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