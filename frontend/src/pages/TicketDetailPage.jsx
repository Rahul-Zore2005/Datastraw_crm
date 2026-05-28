import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function TicketDetailPage() {
  // Read ticket_id from URL
  const { ticket_id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for actions
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || "";

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/tickets/${ticket_id}`);
      setTicket(response.data);
      setStatus(response.data.status); // Pre-select current status
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket_id]);

  const handleStatusUpdate = async () => {
    if (status === ticket.status) return; // No change

    setUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/tickets/${ticket_id}`, { status });
      // Refresh ticket details
      await fetchTicketDetails();
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setAddingNote(true);
    try {
      await axios.put(`${BASE_URL}/api/tickets/${ticket_id}`, {
        note_text: noteText,
      });
      setNoteText(""); // Clear input
      // Refresh ticket details to include new note
      await fetchTicketDetails();
      toast.success("Note added successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  // Helper to determine status badge color
  const getStatusColor = (statusVal) => {
    switch (statusVal) {
      case "Open":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 animate-pulse">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="font-medium text-lg">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <Link
          to="/"
          className="text-slate-500 hover:text-indigo-600 flex items-center mb-6 font-medium transition-colors w-max group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to all tickets
        </Link>
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium shadow-sm">
          {error || "Ticket not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      <Link
        to="/"
        className="text-slate-500 hover:text-indigo-600 flex items-center mb-8 font-medium transition-colors w-max group"
      >
        <div className="bg-white p-2 rounded-full shadow-sm mr-3 border border-slate-100 group-hover:border-indigo-100 transition-colors">
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </div>
        Back to Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Ticket Info */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
            <div
              className={`absolute top-0 left-0 w-full h-1.5 ${ticket.status === "Open" ? "bg-emerald-500" : ticket.status === "In Progress" ? "bg-amber-500" : "bg-slate-400"}`}
            ></div>

            <div className="border-b border-slate-100 bg-white px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  {ticket.subject}
                </h1>
                <p className="text-sm font-medium text-slate-400 mt-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    ></path>
                  </svg>
                  {ticket.ticket_id.toString().padStart(4, "0")}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 inline-flex text-sm font-bold rounded-full border shadow-sm items-center gap-2 ${
                  ticket.status === "Open"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : ticket.status === "In Progress"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    ticket.status === "Open"
                      ? "bg-emerald-500"
                      : ticket.status === "In Progress"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-slate-500"
                  }`}
                ></span>
                {ticket.status}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-semibold mb-1 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    Customer Name
                  </p>
                  <p className="text-slate-800 font-bold text-base">
                    {ticket.customer_name}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-semibold mb-1 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Contact Email
                  </p>
                  <a
                    href={`mailto:${ticket.customer_email}`}
                    className="text-indigo-600 font-bold text-base hover:text-indigo-800 transition-colors"
                  >
                    {ticket.customer_email}
                  </a>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-semibold mb-1 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Created At
                  </p>
                  <p className="text-slate-700 font-medium">
                      {new Date(ticket.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-slate-500 font-semibold mb-1 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Last Updated
                  </p>
                  <p className="text-slate-700 font-medium">
                      {new Date(ticket.updated_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    ></path>
                  </svg>
                  Description
                </h3>
                <div className="bg-white p-6 rounded-xl text-slate-700 whitespace-pre-wrap text-base leading-relaxed border border-slate-200 shadow-inner">
                  {ticket.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status Update & Notes */}
        <div className="w-full lg:w-1/3 space-y-8">
          {/* Status Update Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 relative z-10 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Update Status
            </h2>
            <div className="flex flex-col gap-3 relative z-10">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium text-slate-700 cursor-pointer shadow-sm transition-all"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === ticket.status}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
              >
                {updating ? "Updating..." : "Save Status"}
              </button>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 flex flex-col h-[600px] overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Internal Notes
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
                {ticket.notes ? ticket.notes.length : 0}
              </span>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
              {ticket.notes && ticket.notes.length > 0 ? (
                ticket.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm relative group hover:shadow-md transition-shadow"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-xl"></div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed ml-2">
                      {note.note_text}
                    </p>
                    <div className="mt-3 ml-2 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                          {new Date(note.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">
                    No internal notes yet.
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Add a note below to help your team.
                  </p>
                </div>
              )}
            </div>

            {/* Add Note Form */}
            <div className="p-5 border-t border-slate-100 bg-white">
              <form onSubmit={handleAddNote} className="flex flex-col gap-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type a private note..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm bg-slate-50 focus:bg-white transition-all shadow-inner"
                  rows="3"
                ></textarea>
                <button
                  type="submit"
                  disabled={addingNote || !noteText.trim()}
                  className="self-end px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                >
                  {addingNote ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
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
                      Add Note
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;
