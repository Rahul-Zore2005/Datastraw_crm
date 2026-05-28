const Database = require('better-sqlite3');
const path = require('path');

// 1. Import better-sqlite3 (already done above)
// 2. Create (or open) a SQLite database file called crm.db in the db folder
const dbPath = path.resolve(__dirname, 'crm.db');
const db = new Database(dbPath, { verbose: console.log }); // added verbose for debugging if needed

// 3. Create a TICKETS table
const createTicketsTable = `
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT UNIQUE, 
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// 4. Create a NOTES table
const createNotesTable = `
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT,
    note_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES tickets(ticket_id)
);
`;

// Execute the SQL queries to create the tables
db.exec(createTicketsTable);
db.exec(createNotesTable);

// 5. Export the db instance so other files can use it
module.exports = db;
