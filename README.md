# Datastraw CRM

A modern, fast, and lightweight Customer Relationship Management (CRM) dashboard designed to manage support tickets, track resolutions, and maintain internal team notes.

## 🎯 Project Overview

Datastraw CRM was built with a focus on **speed**, **data integrity**, and clean **UX/UI**. It allows support teams to log customer issues, dynamically filter ticket statuses, and collaborate on resolutions through timestamped internal notes.

## ✨ Key Features

* **Complete Ticket Lifecycle Management:** Create, view, update, and manage support tickets seamlessly.
* **Smart Dashboard & Analytics:** Real-time summary stats (Total, Open, In-Progress, Closed) with dynamic searching and category filtering.
* **Internal Auditing & Notes:** Support agents can add private, timestamped notes to specific tickets to track progress without altering the original customer description.
* **Strict Localization:** Enforced standard `en-GB` (`dd/mm/yyyy`) date formatting with 12-hour precise timestamps across the application to ensure data consistency.
* **Modern UI Design:** A meticulously crafted, responsive UI built with Tailwind CSS, utilizing flex-box for dynamic wrapping. 
* **Instant Feedback:** Integrated push notifications (React Hot Toast) for clean, non-intrusive user alerts during API operations.

## 🛠️ Tech Stack

**Frontend**
* **Core:** React 19, Vite (for ultra-fast HMR and optimized builds)
* **Routing state:** React Router v7
* **Styling:** Tailwind CSS (Utility-first)
* **HTTP:** Axios

**Backend**
* **Core:** Node.js, Express.js
* **Database:** SQLite3 (`better-sqlite3` driver for rapid, synchronous, file-based storage)
* **Middleware:** CORS, Express JSON parser

## 🧠 Architectural Decisions 

1. **Proxy Local Networking:** In order to get around the CORS issue, during the development process, the frontend uses proxy configurations in `vite.config.js` to send requests to the Express server at `http://localhost:5000/api/*`.
2. **Sanitized Queries:** The backend makes use of prepared statements using `better-sqlite3.db.prepare()`. This ensures that the input queries are always sanitized, providing protection from any potential SQL injection attacks.
3. **Efficient Data Visualization:** The React frontend makes use of `useMemo` hooks for rendering the tickets in their sorted form. This ensures that the component is only rendered when there are changes in the underlying state.
4. **Data Structure Consistency:** There is normalization within the local SQLite database to keep `tickets` and `notes` separated by strict foreign key relationships through `ticket_id`.

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.

### 1. Initialize the Backend
Open your terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm run start
```
The Express server will start on http://localhost:5000. The SQLite database (crm.db) will auto-generate upon initialization.

### 2. Initialize the Frontend
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

## 📂 Core Folder Structure
```
datastraw_crm/
├── backend/
│   ├── db/            # SQLite database file and initialization logic
│   ├── routes/        # Express API endpoints (/api/tickets)
│   └── server.js      # Express server & middleware setup
└── frontend/
    ├── src/
    │   ├── pages/     # Core React views (Home, CreateTicket, TicketDetailPage)
    │   ├── App.jsx    # Client-side routing wrapper
    │   └── main.jsx   # React DOM mounting
    ├── vite.config.js # Proxy network configurations
    └── package.json
```
