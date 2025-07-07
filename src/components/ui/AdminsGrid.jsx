import React from "react";
import { 
  Shield, 
  Mail, 
  Calendar, 
  Trash2, 
  UserCheck, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users
} from "lucide-react";

const AdminsGrid = ({ 
  admins, 
  loading, 
  searchTerm, 
  pagination, 
  onDelete, 
  onPageChange, 
  onCreateAdmin 
}) => {
  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
        <Shield className="w-12 h-12 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Admins Found</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        {searchTerm 
          ? `No admins match your search "${searchTerm}". Try adjusting your search terms.`
          : "Get started by creating your first admin user to manage the system."
        }
      </p>
      <button
        onClick={onCreateAdmin}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Admin
      </button>
    </div>
  );

  // Admin card component
  const AdminCard = ({ admin }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100 hover:border-purple-200 transform hover:scale-105">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {admin.name || admin.username || "Admin User"}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDelete(admin._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete Admin"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Details */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{admin.email || "No email provided"}</span>
        </div>
        
        <div className="flex items-center space-x-3 text-gray-600">
          <UserCheck className="w-4 h-4" />
          <span className="text-sm">Role: {admin.role || "Administrator"}</span>
        </div>

        <div className="flex items-center space-x-3 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Created: {admin.createdAt ? formatDate(admin.createdAt) : "N/A"}
          </span>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last Login:</span>
          <span className="font-medium text-gray-900">
            {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
          </span>
        </div>
      </div>
    </div>
  );

  // Pagination component
  const Pagination = () => (
    <div className="flex items-center justify-between mt-8 px-4">
      <div className="text-sm text-gray-500">
        Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalAdmins)} of {pagination.totalAdmins} admins
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            pagination.hasPrevPage
              ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-1">
          {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
            const pageNum = index + 1;
            const isCurrentPage = pageNum === pagination.currentPage;
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isCurrentPage
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            pagination.hasNextPage
              ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Management</h2>
              <p className="text-sm text-gray-500">
                Manage system administrators and their permissions
              </p>
            </div>
          </div>
          <button
            onClick={onCreateAdmin}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <LoadingSkeleton />
        ) : admins.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <AdminCard key={admin._id} admin={admin} />
              ))}
            </div>
            {pagination.totalPages > 1 && <Pagination />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminsGrid;