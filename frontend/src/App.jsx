import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Import the pages (ensure these exist in the pages directory)
import Home from "./pages/Home";
import CreateTicket from "./pages/CreateTicket";
import TicketDetailPage from "./pages/TicketDetailPage";

function App() {
  return (
    // Router wraps our application to enable client-side routing
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{ className: "rounded-xl shadow-lg" }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex flex-col font-sans text-slate-800">
        {/* A simple top navbar with the app name and a New Ticket button */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-4 px-6 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* Link to the Home page */}
            <Link
              to="/"
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 tracking-tight flex items-center gap-2"
            >
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              Datastraw CRM
            </Link>

            {/* Link to the Create Ticket page */}
            <Link
              to="/create"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 px-5 py-2.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              New Ticket
            </Link>
          </div>
        </nav>

        {/* Main content area */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-6">
          <Routes>
            {/*"/" → Home page (shows list of all tickets) */}
            <Route path="/" element={<Home />} />

            {/*"/create" → CreateTicket page (form to make a new ticket) */}
            <Route path="/create" element={<CreateTicket />} />

            {/*"/tickets/:ticket_id" → TicketDetailPage (detail view for one ticket) */}
            <Route path="/tickets/:ticket_id" element={<TicketDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
