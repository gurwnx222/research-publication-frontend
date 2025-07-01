import React, { useState } from "react";
import { X, PenTool, BookOpen } from "lucide-react";

const CreateAuthorModal = ({
  isOpen,
  onClose,
  onSubmit,
  departments = [],
  publications = [],
}) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    author_name: "",
    email: "",
    department: "",
    publication_id: "",
    author_order: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert employee_id to number and author_order to number
      const submitData = {
        ...formData,
        employee_id: parseInt(formData.employee_id),
        author_order: parseInt(formData.author_order),
      };

      await onSubmit(submitData);
      setFormData({
        employee_id: "",
        author_name: "",
        email: "",
        department: "",
        publication_id: "",
        author_order: 1,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if email is required (only for primary author)
  const isEmailRequired = parseInt(formData.author_order) === 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PenTool className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Author
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-60 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID *
              </label>
              <input
                type="number"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., 1001"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be a positive number and unique
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Order *
              </label>
              <input
                type="number"
                name="author_order"
                value={formData.author_order}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g., 1"
              />
              <p className="mt-1 text-xs text-gray-500">
                1 for primary author, 2 for second, etc.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name *
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="e.g., Dr. John Smith"
            />
            <p className="mt-1 text-xs text-gray-500">Maximum 100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address {isEmailRequired && "*"}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={isEmailRequired}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="e.g., john.smith@university.edu"
            />
            <p className="mt-1 text-xs text-gray-500">
              {isEmailRequired
                ? "Required for primary author (author order 1)"
                : "Optional for non-primary authors"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept._id || dept.id} value={dept._id || dept.id}>
                    {dept.name || dept.department_name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Reference to Department collection
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication *
              </label>
              <select
                name="publication_id"
                value={formData.publication_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select a publication</option>
                {publications.map((pub) => (
                  <option key={pub._id || pub.id} value={pub._id || pub.id}>
                    {pub.title || pub.publication_title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Reference to Publication collection
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <div className="flex items-start space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  Schema Information
                </h4>
                <p className="text-xs text-blue-600 mt-1">
                  This form creates an author entry linked to a specific
                  publication and department. Each author has an order (1 for
                  primary author) and email is only required for the primary
                  author.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? "Creating Author..." : "Create Author"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAuthorModal;
