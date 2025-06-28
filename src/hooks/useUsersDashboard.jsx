import { useState, useEffect } from "react";

const useUsersDashboard = (mockApiService) => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const usersPerPage = 10;

  // Fetch users
  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await mockApiService.fetchUsers(
        page,
        usersPerPage,
        search
      );
      setUsers(response.users);
      setPagination(response);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      console.error("Error fetching stats:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
    fetchStats();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle user deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await mockApiService.deleteUser(id);
        console.log("User deleted successfully:", result);

        // Refresh the data to reflect changes
        await fetchUsers(currentPage, searchTerm);
        await fetchStats();

        // Show success feedback
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user: " + error.message);
      }
    }
  };

  // Handle user creation
  const handleCreateUser = async (newUser) => {
    try {
      const result = await mockApiService.createUser(newUser);
      console.log("User created successfully:", result);

      // Close modal on success
      setIsModalOpen(false);

      // Refresh the data to reflect changes
      await fetchUsers(currentPage, searchTerm);
      await fetchStats();

      // Show success feedback
      alert("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user: " + error.message);
      // Don't close modal on error so user can fix the issue
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Refresh data manually
  const refreshData = async () => {
    await fetchUsers(currentPage, searchTerm);
    await fetchStats();
  };

  return {
    // State
    users,
    isModalOpen,
    loading,
    searchTerm,
    currentPage,
    pagination,
    stats,
    usersPerPage,

    // Actions
    handleDelete,
    handleCreateUser,
    handlePageChange,
    handleSearchChange,
    openModal,
    closeModal,
    refreshData,

    // Utility functions (if needed for external access)
    fetchUsers,
    fetchStats,
  };
};

export default useUsersDashboard;
