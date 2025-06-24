import React from 'react';
import { Menu } from 'lucide-react';

/**
 * Header Component
 * Contains the page title and mobile menu toggle
 * 
 * @param {function} onMenuClick - Callback function for mobile menu toggle
 * @param {string} title - Page title (default: 'Dashboard')
 * @param {boolean} showDate - Whether to show current date (default: true)
 */
const Header = ({ 
  onMenuClick, 
  title = 'Dashboard', 
  showDate = true 
}) => {
  // Format current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-3 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* Right side - Date */}
        {showDate && (
          <div className="text-sm text-gray-500 hidden sm:block">
            {getCurrentDate()}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;