import React from "react";
import { Plus } from "lucide-react";

const DashboardHeader = ({ onCreateUser }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">Manage university users and staff</p>
      </div>
      <button
        onClick={onCreateUser}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus size={20} />
        <span>New User</span>
      </button>
    </div>
  );
};

export default DashboardHeader;
