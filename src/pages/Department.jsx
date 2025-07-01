import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  X,
  Building2,
  User,
  Calendar,
  MoreVertical,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const DepartmentCard = ({ department, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600">
            {department.code}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {department.name}
            </h3>
            <p className="text-sm text-gray-500">{department.university}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Active Status Badge */}
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              department.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {department.isActive ? "Active" : "Inactive"}
          </span>
          <button
            onClick={() => onDelete(department._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {department.description && (
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {department.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {department.head && (
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{department.head}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(department.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Department ID (for reference) */}
      <div className="mt-3 pt-3 border-t border-gray-50">
        <p className="text-xs text-gray-400 font-mono">ID: {department._id}</p>
      </div>
    </div>
  );
};

const CreateDepartmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    university: "",
    head: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const departmentCodes = ["CSE", "ECE", "ME", "CE", "EE", "IT"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Department created successfully:", result);

      // Call the parent component's onSubmit function
      onSubmit(result);

      // Reset form
      setFormData({
        name: "",
        code: "",
        university: "",
        head: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Department
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              placeholder="e.g., Computer Science & Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Code *
            </label>
            <select
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            >
              <option value="">Select a code</option>
              {departmentCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University *
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              placeholder="e.g., Tech University"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Head
            </label>
            <input
              type="text"
              name="head"
              value={formData.head}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
              placeholder="e.g., Dr. John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
              placeholder="Brief description of the department..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DepartmentDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  // Fetch departments and count on component mount
  useEffect(() => {
    fetchDepartments();
    fetchDepartmentCount();
  }, []);

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/private-data/departments"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Departments data:", result);

      // Updated to match your API response structure
      if (result.success && result.data && Array.isArray(result.data)) {
        setDepartments(result.data);
      } else {
        setDepartments([]);
        console.warn("Unexpected API response structure:", result);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const fetchDepartmentCount = async () => {
    setIsLoadingCount(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/private-data/counts"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Department count:", data);

      // Update count based on the API response structure
      setTotalCount(data.counts?.departments || departments.length || 0);
    } catch (error) {
      console.error("Error fetching department count:", error);
      // Fallback to departments array length if count API fails
      setTotalCount(departments.length);
    } finally {
      setIsLoadingCount(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/department/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state
        setDepartments((prev) => prev.filter((dept) => dept._id !== id));
        // Refresh count after deletion
        fetchDepartmentCount();

        console.log("Department deleted successfully");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department. Please try again.");
      }
    }
  };

  const handleCreateDepartment = (result) => {
    // Add the new department to local state
    if (result.department) {
      setDepartments((prev) => [result.department, ...prev]);
    } else if (result.data) {
      // Handle if the API returns data in 'data' property
      setDepartments((prev) => [result.data, ...prev]);
    }
    setIsModalOpen(false);
    // Refresh count after creation
    fetchDepartmentCount();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Departments
              </h1>
              <p className="text-gray-600">
                Manage your university departments
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>New Department</span>
            </button>
          </div>

          {/* Stats Card */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingCount ? "..." : totalCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingDepartments ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading departments...</p>
            </div>
          ) : (
            <>
              {/* Departments Grid */}
              {departments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {departments.map((department) => (
                    <DepartmentCard
                      key={department._id}
                      department={department}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No departments yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first department
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Plus size={20} />
                    <span>Create Department</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Create Department Modal */}
          <CreateDepartmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateDepartment}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
