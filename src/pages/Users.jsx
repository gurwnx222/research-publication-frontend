import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/ui/DashboardHeader";
import SearchBar from "../components/SearchBar";
import UsersGrid from "../components/ui/UsersGrid";
import CreateUserModal from "../components/CreateUserModal";
import StatsCard from "../components/StatsCard";
import "../App.css";
import { Users as UsersIcon } from "lucide-react"; // <-- FIX: Rename the import

export default function Users() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <DashboardHeader onCreateUser={() => {}} />

        {/* Search Bar */}
        <div className="px-6">
          <SearchBar searchTerm={{}} onSearchChange={() => {}} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
          <StatsCard title="Total Users" count={1234} icon={UsersIcon} />
          <StatsCard
            title="Active Users"
            count={[]}
            iconColor="text-green-500"
            icon={UsersIcon}
          />
          <StatsCard
            title="Inactive Users"
            count={[]}
            iconColor="text-gray-400"
            icon={UsersIcon}
          />
        </div>

        {/* Users Grid */}
        <main className="flex-1 px-6">
          <UsersGrid
            users={[]}
            loading={false}
            searchTerm={{}}
            pagination={{}}
            onDelete={() => {}}
            onPageChange={() => {}}
            onCreateUser={() => {}}
          />
        </main>
      </div>
      {/* Create User Modal */}
      <CreateUserModal isOpen={false} onClose={() => {}} onSubmit={() => {}} />
    </div>
  );
}
