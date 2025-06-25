import React, { useState, useEffect } from 'react';
import { Trash2, Plus, X, User, Mail, Badge, Calendar, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';

// Persistent mock data store - simulates a database
let mockUserDatabase = [
  {
    _id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@techuniversity.edu',
    role: 'Professor',
    department: 'Computer Science & Engineering',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techuniversity.edu',
    role: 'Associate Professor',
    department: 'Electronics & Communication Engineering',
    isActive: true,
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    _id: '3',
    employeeId: 'EMP003',
    name: 'Michael Brown',
    email: 'michael.brown@techuniversity.edu',
    role: 'Assistant Professor',
    department: 'Mechanical Engineering',
    isActive: false,
    createdAt: '2024-01-05T09:15:00Z'
  },
  {
    _id: '4',
    employeeId: 'EMP004',
    name: 'Emily Davis',
    email: 'emily.davis@techuniversity.edu',
    role: 'Lecturer',
    department: 'Computer Science & Engineering',
    isActive: true,
    createdAt: '2024-01-20T11:45:00Z'
  },
  {
    _id: '5',
    employeeId: 'EMP005',
    name: 'David Wilson',
    email: 'david.wilson@techuniversity.edu',
    role: 'Professor',
    department: 'Electronics & Communication Engineering',
    isActive: true,
    createdAt: '2024-01-12T16:30:00Z'
  },
  // Add more mock users for pagination testing
  ...Array.from({ length: 25 }, (_, i) => ({
    _id: (i + 6).toString(),
    employeeId: `EMP${(i + 6).toString().padStart(3, '0')}`,
    name: `User ${i + 6}`,
    email: `user${i + 6}@techuniversity.edu`,
    role: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'][i % 4],
    department: ['Computer Science & Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering'][i % 3],
    isActive: i % 3 !== 0,
    createdAt: new Date(2024, 0, i + 1, 10, 30, 0).toISOString()
  }))
];

// Mock API functions that actually modify the persistent store
const mockApiService = {
  // Fetch users with pagination
  fetchUsers: async (page = 1, limit = 10, searchTerm = '') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Work with the persistent database
    const allUsers = [...mockUserDatabase];

    // Filter by search term
    const filteredUsers = searchTerm 
      ? allUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allUsers;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      users: paginatedUsers,
      totalUsers: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
      currentPage: page,
      hasNextPage: endIndex < filteredUsers.length,
      hasPrevPage: page > 1
    };
  },

  // Get total user count
  getTotalUserCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const total = mockUserDatabase.length;
    const active = mockUserDatabase.filter(user => user.isActive).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  },

  // Create new user
  createUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for duplicate employee ID
    const existingUser = mockUserDatabase.find(user => user.employeeId === userData.employeeId);
    if (existingUser) {
      throw new Error('Employee ID already exists');
    }
    
    // Check for duplicate email
    const existingEmail = mockUserDatabase.find(user => user.email === userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    // Actually add to the persistent store
    mockUserDatabase.unshift(newUser);
    
    return newUser;
  },

  // Delete user
  deleteUser: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userIndex = mockUserDatabase.findIndex(user => user._id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Actually remove from the persistent store
    const deletedUser = mockUserDatabase.splice(userIndex, 1)[0];
    
    return { success: true, deletedUser };
  }
};

const UserCard = ({ user, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      'Professor': 'bg-purple-100 text-purple-700',
      'Associate Professor': 'bg-blue-100 text-blue-700',
      'Assistant Professor': 'bg-green-100 text-green-700',
      'Lecturer': 'bg-orange-100 text-orange-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
            user.isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-400'
          }`}>
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
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
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRoleColor(user.role)}`}>
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

const CreateUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    role: '',
    department: '',
    isActive: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        role: '',
        department: '',
        isActive: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
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
              Employee ID *
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., EMP001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., john.doe@university.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active User
            </label>
          </div>

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
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, hasNextPage, hasPrevPage }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>
        
        {getPageNumbers().map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              currentPage === pageNumber
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {pageNumber}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const UsersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  
  const usersPerPage = 10;

  // Fetch users
  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await mockApiService.fetchUsers(page, usersPerPage, search);
      setUsers(response.users);
      setPagination(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await mockApiService.getTotalUserCount();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
    fetchStats();
  }, [currentPage]);

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await mockApiService.deleteUser(id);
        console.log('User deleted successfully:', result);
        
        // Refresh the data to reflect changes
        await fetchUsers(currentPage, searchTerm);
        await fetchStats();
        
        // Show success feedback
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user: ' + error.message);
      }
    }
  };

  const handleCreateUser = async (newUser) => {
    try {
      const result = await mockApiService.createUser(newUser);
      console.log('User created successfully:', result);
      
      setIsModalOpen(false);
      
      // Refresh the data to reflect changes
      await fetchUsers(currentPage, searchTerm);
      await fetchStats();
      
      // Show success feedback
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + error.message);
      // Don't close modal on error so user can fix the issue
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
              <p className="text-gray-600">Manage university users and staff</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>New User</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <User className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Users Grid */}
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
                {users.map(user => (
                  <UserCard
                    key={user._id}
                    user={user}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No users match your search "${searchTerm}"`
                  : 'Get started by creating your first user'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Plus size={20} />
                  <span>Create User</span>
                </button>
              )}
            </div>
          )}

          {/* Create User Modal */}
          <CreateUserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateUser}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;