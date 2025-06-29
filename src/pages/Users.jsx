import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/ui/DashboardHeader";
import SearchBar from "../components/SearchBar";
import UsersGrid from "../components/ui/UsersGrid";
import CreateUserModal from "../components/CreateUserModal";
import useUsersDashboard from "../hooks/useUsersDashboard";
import StatsCard from "../components/StatsCard";
import "../App.css";
import { Users as UsersIcon } from "lucide-react"; // <-- FIX: Rename the import

export default function Users() {
  // Mock API service should be passed here; replace with your real API service if available
  const mockApiService = {
    fetchUsers: async (page, perPage, search) => {
      // Replace with real API call
      return {
        users: [],
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };
    },
    getTotalUserCount: async () => ({
      total: 0,
      active: 0,
      inactive: 0,
    }),
    deleteUser: async (id) => ({}),
    createUser: async (user) => ({}),
  };

  const {
    users,
    isModalOpen,
    loading,
    searchTerm,
    pagination,
    stats,
    handleDelete,
    handleCreateUser,
    handlePageChange,
    handleSearchChange,
    openModal,
    closeModal,
  } = useUsersDashboard(mockApiService);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <DashboardHeader onCreateUser={openModal} />

        {/* Search Bar */}
        <div className="px-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
          <StatsCard title="Total Users" count={1234} icon={UsersIcon} />
          <StatsCard
            title="Active Users"
            count={stats.active}
            iconColor="text-green-500"
            icon={UsersIcon}
          />
          <StatsCard
            title="Inactive Users"
            count={stats.inactive}
            iconColor="text-gray-400"
            icon={UsersIcon}
          />
        </div>

        {/* Users Grid */}
        <main className="flex-1 px-6">
          <UsersGrid
            users={users}
            loading={loading}
            searchTerm={searchTerm}
            pagination={pagination}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            onCreateUser={openModal}
          />
        </main>
      </div>
      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
