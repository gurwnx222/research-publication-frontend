import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/ui/DashboardHeader";
import SearchBar from "../components/SearchBar";
import UsersGrid from "../components/ui/UsersGrid";
import CreateUserModal from "../components/CreateUserModal";
import StatsCard from "../components/StatsCard";
import "../App.css";
import { Users as UsersIcon } from "lucide-react";

export default function Users() {
  const BASE_URL = "http://localhost:3000/api";

  // Stats state
  const [totalUsers, setTotalUsers] = useState(0);

  // Users and pagination state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalUsers: 0,
  });

  // Modal state - only for user creation
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
        method: "GET",
        credentials: 'include', // Important: This sends cookies
        headers: {
          "Content-Type": "application/json",
        },
        });
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats");
        }
        const stats = await statsResponse.json();

        setTotalUsers(stats?.counts?.users || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Fetch users data with pagination
  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`${BASE_URL}/private-data/users?${params}`, {
        method: "GET",
        credentials: 'include', // Important: This sends cookies
        headers: {
          "Content-Type": "application/json",
        },
        });
      console.log("Fetching user data for:", response.url);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      console.log("User data fetched:", userData);

      if (userData.success && userData.data) {
        // Set users data
        setUsers(userData.data.users || []);

        // Set pagination data
        setPagination({
          currentPage: userData.data.pagination.currentPage,
          totalPages: userData.data.pagination.totalPages,
          hasNextPage: userData.data.pagination.hasNextPage,
          hasPrevPage: userData.data.pagination.hasPrevPage,
          totalUsers: userData.data.pagination.totalUsers,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Reset to empty state on error
      setUsers([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalUsers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(1, searchTerm);
  }, []);

  // Handle search
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    // Reset to page 1 when searching
    fetchUsers(1, newSearchTerm);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchUsers(newPage, searchTerm);
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/private-data/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the current page after deletion
        fetchUsers(pagination.currentPage, searchTerm);
        // Also refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`);
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalUsers(stats?.counts?.users || 0);
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle create user
  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };
  // Handle user creation submit
  const handleUserSubmit = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log("Creating user with data:", userData);
      if (response.ok) {
        // Close modal and refresh data
        setIsCreateModalOpen(false);
        fetchUsers(pagination.currentPage, searchTerm);
        // Refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`);
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalUsers(stats?.counts?.users || 0);
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <DashboardHeader onCreateUser={handleCreateUser} />

        {/* Search Bar */}
        <div className="px-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-6">
          <StatsCard title="Total Users" count={totalUsers} icon={UsersIcon} />
        </div>

        {/* Users Grid */}
        <main className="flex-1 px-6">
          <UsersGrid
            users={users}
            loading={loading}
            searchTerm={searchTerm}
            pagination={pagination}
            onDelete={handleDeleteUser}
            onPageChange={handlePageChange}
            onCreateUser={handleCreateUser}
          />
        </main>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleUserSubmit}
      />
    </div>
  );
}
