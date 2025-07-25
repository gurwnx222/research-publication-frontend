import React, { useState } from "react";
import {
  X,
  UserPlus,
  User,
  Mail,
  Lock,
  Building,
  Briefcase,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";

const CreateAuthorModal = ({
  isOpen,
  onClose,
  onSubmit,
  departments = [
    { _id: "68835bb728200e02b35ddefa", name: "DEPARTMENT OF PHYSICAL SCIENCES" },
    { _id: "68835c2b28200e02b35ddf01", name: "DEPARTMENT OF LIFE SCIENCES" },
    { _id: "68835c4d28200e02b35ddf08", name: "DEPARTMENT OF AGRICULTURE & FOOD TECHNOLOGY" },
    { _id: "68835c6228200e02b35ddf0f", name: "DEPARTMENT OF PHARMACY & PHARMACEUTICAL SCIENCES" },
    { _id: "68835c8428200e02b35ddf1d", name: "DEPARTMENT OF MANAGEMENT & COMMERCE" },
    { _id: "68835cb928200e02b35ddf24", name: "DEPARTMENT OF HOTEL MANAGEMENT & CATERING SERVICES" },
    { _id: "68835cc428200e02b35ddf2b", name: "DEPARTMENT OF COMPUTER APPLICATION" },
    { _id: "68835ccf28200e02b35ddf32", name: "DEPARTMENT OF EDUCATION" },
    { _id: "68835cda28200e02b35ddf39", name: "DEPARTMENT OF JOURNALISM" },
    { _id: "68835ce828200e02b35ddf40", name: "DEPARTMENT OF HUMANITIES & LANGUAGES" },
    { _id: "68835cf528200e02b35ddf47", name: "DEPARTMENT OF ARCHITECTURE" },
    { _id: "68835d0228200e02b35ddf4e", name: "DEPARTMENT OF DESIGN & FINE ARTS" },
    { _id: "68835d1528200e02b35ddf55", name: "DEPARTMENT OF LEGAL STUDIES" },
    { _id: "68835d2728200e02b35ddf5c", name: "DEPARTMENT OF HEALTH SCIENCES" },
    { _id: "6883600728200e02b35ddf95", name: "DEPARTMENT OF ENGINEERING" },
  ],
}) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    author_name: "",
    password: "",
    department: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert employee_id to number for submission
      const submitData = {
        ...formData,
        employee_id: parseInt(formData.employee_id),
        // These fields are not needed for standalone author registration
        publication_id: null,
        author_order: null,
      };

      console.log("Submitting author data:", submitData); // Debug log

      await onSubmit(submitData);

      // Reset form after successful submission
      setFormData({
        employee_id: "",
        author_name: "",
        password: "",
        department: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error registering author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: result }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Register New Author
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-60 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* FIXED: Added form wrapper with onSubmit handler */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              Employee ID *
            </label>
            <input
              type="number"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="e.g., 1001"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be a positive number and unique across the system
            </p>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Author Name *
            </label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="e.g., Dr. John Smith"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum 100 characters. Full name with title if applicable
            </p>
          </div>

          {/* Password - FIXED: Added show/hide toggle like admin modal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono text-sm"
                placeholder="Enter secure password"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={generatePassword}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Generate Secure Password
            </button>
            <p className="mt-1 text-xs text-gray-500">
              Minimum 6 characters. Use a strong password for security
            </p>
          </div>

          {/*Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept._id || dept.id} value={dept._id || dept.id}>
                    {dept.name || dept.department_name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Author's affiliated department
              </p>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active Author
            </label>
            <p className="text-xs text-gray-500">
              Uncheck to deactivate the author profile
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <UserPlus className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  Author Registration
                </h4>
                <p className="text-xs text-blue-600 mt-1">
                  This creates a standalone author profile that can later be
                  assigned to publications. The author will be registered in the
                  system but not linked to any specific publication initially.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - FIXED: Submit button now has type="submit" */}
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? "Registering Author..." : "Register Author"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuthorModal;
