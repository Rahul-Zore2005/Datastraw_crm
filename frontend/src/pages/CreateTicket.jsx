import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function CreateTicket() {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  // State for UI feedback
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || "";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_name.trim())
      newErrors.customer_name = "Name is required";
    if (!formData.customer_email.trim())
      newErrors.customer_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.customer_email))
      newErrors.customer_email = "Email format is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // POST to backend API to create ticket
      const response = await axios.post(`${BASE_URL}/api/tickets`, formData);

      // On success, show toast message
      toast.success(
        `Ticket created successfully! ID: ${response.data.ticket_id}`,
      );

      // Redirect to home after briefly showing toast
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error ||
          "An error occurred while creating the ticket",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
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
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Create New Ticket
        </h1>
        <Link
          to="/"
          className="text-slate-500 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 bg-slate-50 px-4 py-2 rounded-full hover:bg-indigo-50"
        >
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm ${errors.customer_name ? "border-red-400 focus:ring-red-500" : "border-slate-200"}`}
                placeholder="eg: Akshay Singh"
              />
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.customer_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Customer Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm ${errors.customer_email ? "border-red-400 focus:ring-red-500" : "border-slate-200"}`}
                placeholder="eg: akshay@example.com"
              />
              {errors.customer_email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.customer_email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm ${errors.subject ? "border-red-400 focus:ring-red-500" : "border-slate-200"}`}
              placeholder="Brief description of the issue"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm ${errors.description ? "border-red-400 focus:ring-red-500" : "border-slate-200"}`}
              placeholder="Detailed explanation of the issue..."
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link
              to="/"
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              type="button"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Creating...
                </>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
