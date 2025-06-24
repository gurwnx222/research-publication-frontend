import React from 'react';

/**
 * Reusable Statistics Card Component
 * 
 * @param {string} title - The title/label for the statistic
 * @param {number|string} count - The main count/value to display
 * @param {React.Component} icon - Lucide React icon component
 * @param {string} bgColor - Background color class (default: 'bg-white')
 * @param {string} iconColor - Icon color class (default: 'text-blue-500')
 * @param {string} textColor - Text color class (default: 'text-gray-700')
 */
const StatsCard = ({ 
  title, 
  count, 
  icon: Icon, 
  bgColor = 'bg-white', 
  iconColor = 'text-blue-500',
  textColor = 'text-gray-700'
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} opacity-70`}>{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{count}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;