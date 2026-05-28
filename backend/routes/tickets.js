const express = require('express');
const router = express.Router();
// Import the db instance from ../db/database.js
const db = require('../db/database.js');
// Import uuid from the 'uuid' package (not required here since we generate TKT-xxx format manually, but imported as requested)
const { v4: uuidv4 } = require('uuid');

/*
 * ENDPOINT 1 — POST /
 * Create a new ticket.
 * Why: To allow users (or the frontend) to submit a new support ticket.
 */
router.post('/', (req, res) => {
  // Read customer_name, customer_email, subject, description from req.body
  const { customer_name, customer_email, subject, description } = req.body;

  // Validate that all 4 fields exist
  if (!customer_name || !customer_email || !subject || !description) {
    // if not, return status 400 with { error: "All fields required" }
    return res.status(400).json({ error: "All fields required" });
  }

  // Auto-generate a ticket_id in format TKT-001, TKT-002 etc.
  // Count existing rows
  const rowCount = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
  // Generate ID and pad with zeros
  const nextNumber = rowCount.count + 1;
  const ticket_id = `TKT-${String(nextNumber).padStart(3, '0')}`;

  // Insert into the tickets table
  const insertStmt = db.prepare(`
    INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = insertStmt.run(ticket_id, customer_name, customer_email, subject, description);

  // Return status 201 with { ticket_id, created_at }
  res.status(201).json({
    ticket_id
    // created_at is automatically handled by SQLite, returning just success mostly
  });
});

/*
 * ENDPOINT 2 — GET /
 * Return all tickets as an array.
 * Why: To display all tickets on the frontend dashboard.
 */
router.get('/', (req, res) => {
  // Accept optional query params: ?status=Open and ?search=sometext
  const { status, search } = req.query;

  let query = 'SELECT ticket_id, customer_name, subject, status, created_at FROM tickets WHERE 1=1';
  const params = [];

  // If status is provided, filter rows WHERE status = that value
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  // If search is provided, filter rows WHERE customer_name LIKE %search% OR customer_email LIKE %search% OR subject LIKE %search% OR ticket_id LIKE %search%
  if (search) {
    query += ' AND (customer_name LIKE ? OR customer_email LIKE ? OR subject LIKE ? OR ticket_id LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  // Order by created_at DESC (newest first)
  query += ' ORDER BY created_at DESC';

  const tickets = db.prepare(query).all(...params);

  res.json(tickets);
});

/*
 * ENDPOINT 3 — GET /:ticket_id
 * Return full detail of one ticket.
 * Why: To display full information and notes for a specific ticket when a user clicks on it.
 */
router.get('/:ticket_id', (req, res) => {
  const { ticket_id } = req.params;

  // Fetch the ticket row by ticket_id
  const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(ticket_id);

  // If ticket not found, return 404 with { error: "Ticket not found" }
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  // Fetch all notes for that ticket from the notes table
  const notes = db.prepare('SELECT * FROM notes WHERE ticket_id = ? ORDER BY created_at ASC').all(ticket_id);

  // Return full details
  res.json({
    ...ticket,
    notes
  });
});

/*
 * ENDPOINT 4 — PUT /:ticket_id
 * Update ticket status and/or add a note.
 * Why: To allow support agents to change a ticket's status and add updates/notes.
 */
router.put('/:ticket_id', (req, res) => {
  const { ticket_id } = req.params;
  const { status, note_text } = req.body;
  
  // Verify ticket exists
  const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(ticket_id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  let updated_at = null;

  // If status is provided, update the tickets table and set updated_at = CURRENT_TIMESTAMP
  if (status) {
    db.prepare('UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = ?')
      .run(status, ticket_id);
    
    // Fetch the updated_at value to return
    const updated = db.prepare('SELECT updated_at FROM tickets WHERE ticket_id = ?').get(ticket_id);
    updated_at = updated.updated_at;
  }

  // If note_text is provided, insert a new row into the notes table
  if (note_text) {
    db.prepare('INSERT INTO notes (ticket_id, note_text) VALUES (?, ?)')
      .run(ticket_id, note_text);
  }

  // Return { success: true, updated_at }
  res.json({ success: true, updated_at });
});

// Export the router at the bottom
module.exports = router;
