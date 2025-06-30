import React from "react";
import { User, Plus } from "lucide-react";

const EmptyState = ({ searchTerm, onCreateUser }) => {
  return (
    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
      <User size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchTerm ? "No users found" : "No users yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {searchTerm
          ? `No users match your search "${searchTerm}"`
          : "Get started by creating your first user"}
      </p>
      {!searchTerm && (
        <button
          onClick={onCreateUser}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200"
        >
          <Plus size={20} />
          <span>Create User</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
