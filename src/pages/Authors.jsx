import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/ui/DashboardHeader";
import SearchBar from "../components/SearchBar";
import UsersGrid from "../components/ui/UsersGrid";
import CreateAuthorModal from "../components/CreateAuthorModal"; // Updated import
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

  // Departments state for the modal
  //add ids of departments as needed
  // This is a placeholder; you can fetch this from your API later
  const [departments, setDepartments] = useState([
    { _id: "68730916eafef491d5e45f8c", name: "Computer Science Engineering" },
  ]);

  // Fetch departments (you can implement this later)
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/departments`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDepartments(
            data.departments || [
              {
                _id: "68730916eafef491d5e45f8c",
                name: "Computer Science Engineering",
              },
            ]
          );
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        // Keep default department if fetch fails
      }
    };

    fetchDepartments();
  }, []);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
          method: "GET",
          credentials: "include", // Important: This sends cookies
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats");
        }
        const stats = await statsResponse.json();
        setTotalUsers(stats?.counts?.authors || 0);
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
        credentials: "include", // Important: This sends cookies
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
      const response = await fetch(
        `${BASE_URL}/private-data/delete/author/${userId}`,
        {
          method: "DELETE",
          credentials: "include", // Added credentials
        }
      );

      if (response.ok) {
        // Refresh the current page after deletion
        fetchUsers(pagination.currentPage, searchTerm);
        // Also refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
          credentials: "include",
        });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalUsers(stats?.counts?.users || 0);
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle create user - FIXED: Added debugging
  const handleCreateUser = () => {
    console.log("Create user button clicked!"); // Debug log
    setIsCreateModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    console.log("Modal closing..."); // Debug log
    setIsCreateModalOpen(false);
  };

  // Handle author creation submit
  const handleAuthorSubmit = async (userData) => {
    try {
      console.log("Submitting author data:", userData); // Debug log

      const response = await fetch(`${BASE_URL}/register/author`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Response status:", response.status); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log("Author created successfully:", result); // Debug log

        // Close modal and refresh data
        setIsCreateModalOpen(false);
        fetchUsers(pagination.currentPage, searchTerm);

        // Refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
          credentials: "include",
        });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalUsers(stats?.counts?.users || 0);
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
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

      {/* Register Author Modal - FIXED: Added departments prop and debug */}
      <CreateAuthorModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAuthorSubmit}
        departments={departments}
      />
    </div>
  );
}
