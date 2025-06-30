import React from "react";
import { Trash2, User, Mail, Badge, Calendar } from "lucide-react";

const UserCard = ({ user, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      Professor: "bg-purple-100 text-purple-700",
      "Associate Professor": "bg-blue-100 text-blue-700",
      "Assistant Professor": "bg-green-100 text-green-700",
      Lecturer: "bg-orange-100 text-orange-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
              user.isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                : "bg-gray-400"
            }`}
          >
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
          <button
            onClick={() => onDelete(user._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge size={14} className="text-gray-400" />
          <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${getRoleColor(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span className="font-medium">Dept:</span>
            <span>{user.department}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar size={14} />
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
