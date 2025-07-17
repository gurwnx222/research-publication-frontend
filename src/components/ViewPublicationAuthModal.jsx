import React, { useState } from 'react';
import { Lock, X, Building, Users, User } from 'lucide-react';
import ApiService from '../utils/apiService';

const AuthenticationModal = ({ isOpen, onClose, onAuthenticate }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('university');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const accessLevels = [
    {
      id: 'university',
      label: 'University Access',
      description: 'View all publications',
      icon: Building,
      password: 'university123',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'department',
      label: 'Department Access',
      description: 'View department publications',
      icon: Users,
      password: 'department123',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'author',
      label: 'Author Access',
      description: 'View your publications',
      icon: User,
      password: 'author123',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    }
  ];

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!employeeId || isNaN(employeeId)) {
      setError('Please enter a valid employee ID (numbers only)');
      setLoading(false);
      return;
    }

    const selectedLevel = accessLevels.find(level => level.id === accessLevel);
    if (password !== selectedLevel.password) {
      setError('Invalid password for selected access level');
      setLoading(false);
      return;
    }

    try {
      // Check if author exists in the database
      const authorCheck = await ApiService.checkAuthorExists(employeeId);
      
      let userInfo = {
        employeeId: parseInt(employeeId),
        accessLevel,
        accessLevelLabel: selectedLevel.label,
        authorExists: authorCheck.exists
      };

      // If author exists, add their bio information
      if (authorCheck.exists && authorCheck.authorBio) {
        userInfo = {
          ...userInfo,
          authorName: authorCheck.authorBio.author_name,
          department: authorCheck.authorBio.department
        };
      }

      // For author level access, ensure the author exists
      if (accessLevel === 'author' && !authorCheck.exists) {
        setError('Author not found with this employee ID. Please contact administrator.');
        setLoading(false);
        return;
      }

      // Authentication successful
      onAuthenticate(userInfo);
      setLoading(false);
      onClose();
      
    } catch (error) {
      setError(error.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmployeeId('');
    setPassword('');
    setAccessLevel('university');
    setError('');
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Access Publications</h2>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Access Level
              </label>
              <div className="space-y-2">
                {accessLevels.map((level) => {
                  const IconComponent = level.icon;
                  return (
                    <label
                      key={level.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        accessLevel === level.id ? level.color : 'bg-white border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="accessLevel"
                        value={level.id}
                        checked={accessLevel === level.id}
                        onChange={(e) => setAccessLevel(e.target.value)}
                        className="sr-only"
                      />
                      <IconComponent className="w-5 h-5 mr-3 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Publications'
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Access Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• University: university123</div>
              <div>• Department: department123</div>
              <div>• Author: author123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;