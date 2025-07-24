import React, { useState } from "react";
import { Home, User, Building, X, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

/**
 * Sidebar Navigation Component
 *
 * @param {boolean} isOpen - Controls sidebar visibility on mobile
 * @param {function} onClose - Callback function to close sidebar
 * @param {string} activeTab - Currently active tab/page
 * @param {function} onTabChange - Callback function when tab changes
 */
const Sidebar = ({ isOpen, onClose, activeTab = "dashboard", onTabChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Menu items configuration with admin route added
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "authors", label: "Authors", icon: User },
    { id: "departments", label: "Departments", icon: Building },
    { id: "admins", label: "Admins", icon: Shield },
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);

    const pathMap = {
      dashboard: "/dashboard",
      departments: "/department",
      authors: "/authors",
      admins: "/admins",
    };

    const target = pathMap[tabId];
    if (target) navigate(target);

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
      // You can add error handling here (toast notification, etc.)
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Menu item component
  const MenuItem = ({ item }) => (
    <li key={item.id}>
      <button
        onClick={() => handleTabClick(item.id)}
        className={`
          w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-left
          ${
            currentTab === item.id
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
              : "text-gray-700 hover:bg-gray-50 hover:shadow-md hover:transform hover:scale-102"
          }
        `}
      >
        <item.icon className="w-5 h-5 mr-3" />
        {item.label}
      </button>
    </li>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Centered on Left Side */}
      <div
        className={`
        fixed left-4 top-1/2 transform -translate-y-1/2 w-72 bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ease-in-out border border-gray-100 flex flex-col
        lg:relative lg:left-0 lg:top-0 lg:transform-none lg:translate-y-0 lg:shadow-xl
        ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"
        }
        max-h-[80vh] lg:max-h-full overflow-hidden
      `}
      >
        {/* Card Header with Gradient Background */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Research Publication
              </h2>
              <p className="text-sm text-gray-500 mt-1">Navigation Panel</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-full hover:bg-white/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 flex-1 overflow-y-auto">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-left
              ${
                isLoggingOut
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }
            `}
          >
            <LogOut
              className={`w-5 h-5 mr-3 ${isLoggingOut ? "animate-spin" : ""}`}
            />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Card Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-center">
            <div className="text-xs text-gray-500 text-center">
              <div className="font-medium">Research Publication</div>
              <div className="text-gray-400">Version 1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;