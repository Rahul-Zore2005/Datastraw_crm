import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  // useState hooks to manage component state
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  // useNavigate is used to programmatically navigate to other routes
  const navigate = useNavigate();

  // Determine BASE_URL - Phase 6 deployment strategy
  const BASE_URL = import.meta.env.VITE_API_URL || "";

  // Function to fetch tickets from the backend
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters based on current search and filter
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);

      // GET request using axios
      const response = await axios.get(
        `${BASE_URL}/api/tickets?${params.toString()}`,
      );
      setTickets(response.data);

      // If we aren't currently searching or filtering, we can update stats
      if (!search && !statusFilter) {
        setStats({
          total: response.data.length,
          open: response.data.filter((t) => t.status === "Open").length,
          inProgress: response.data.filter((t) => t.status === "In Progress")
            .length,
          closed: response.data.filter((t) => t.status === "Closed").length,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect runs when component mounts and whenever search or statusFilter changes
  useEffect(() => {
    // Debounce the search input by wrapping fetch in a timeout
    const delayDebounceFn = setTimeout(() => {
      fetchTickets();
    }, 300);

    // Cleanup function clears the timeout if dependency changes before 300ms
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  // Helper to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "In Progress":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Closed":
        return "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedTickets = useMemo(() => {
    let sortableTickets = [...tickets];
    if (sortConfig.key) {
      sortableTickets.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableTickets;
  }, [tickets, sortConfig]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-2">
              <svg
                className="w-4 h-4 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              Total
            </p>
            <p className="text-4xl font-extrabold text-slate-800 mt-3">
              {stats.total}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Open
            </p>
            <p className="text-4xl font-extrabold text-emerald-600 mt-3">
              {stats.open}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-2">
              <svg
                className="w-4 h-4 text-amber-500"
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
              In Progress
            </p>
            <p className="text-4xl font-extrabold text-amber-500 mt-3">
              {stats.inProgress}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-slate-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-2">
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
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Closed
            </p>
            <p className="text-4xl font-extrabold text-slate-600 mt-3">
              {stats.closed}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        {/* Search bar */}
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tickets by name, email, subject, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["", "Open", "In Progress", "Closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {status === "" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden border border-slate-100">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
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
            <p className="font-medium animate-pulse">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <svg
              className="w-16 h-16 text-slate-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              ></path>
            </svg>
            <p className="font-medium text-lg text-slate-600">
              No tickets found
            </p>
            <p className="text-sm mt-1 text-slate-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 cursor-pointer">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    onClick={() => handleSort("ticket_id")}
                    className="cursor-pointer px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    ID{" "}
                    {sortConfig.key === "ticket_id" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("customer_name")}
                    className="cursor-pointer px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    Customer{" "}
                    {sortConfig.key === "customer_name" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("subject")}
                    className="cursor-pointer px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    Subject{" "}
                    {sortConfig.key === "subject" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("status")}
                    className="cursor-pointer px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    Status{" "}
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort("created_at")}
                    className="cursor-pointer px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    Date{" "}
                    {sortConfig.key === "created_at" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {sortedTickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                    className="hover:bg-indigo-50/50 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                      {ticket.ticket_id}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-700 font-medium">
                      {ticket.customer_name}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${getStatusColor(ticket.status)} shadow-sm`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                        {new Date(ticket.created_at + 'Z').toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
