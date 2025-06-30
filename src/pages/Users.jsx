import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/ui/DashboardHeader";
import SearchBar from "../components/SearchBar";
import UsersGrid from "../components/ui/UsersGrid";
import CreateUserModal from "../components/CreateUserModal";
import StatsCard from "../components/StatsCard";
import "../App.css";
import { Users as UsersIcon, Building2 as DepartmentIcon } from "lucide-react"; // <-- FIX: Rename the import

export default function Users() {
  const BASE_URL = "http://localhost:3000/api"; // Replace with your actual base URL
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  //fetching users, departments and authors data can be done here
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    // Fetch user and stats data
    try {
      // Fetch user data
      const statsResponse = await fetch(`${BASE_URL}/private-data/counts`);
      if (!statsResponse.ok) {
        throw new Error("Failed to fetch stats");
      }
      const stats = await statsResponse.json();
      const totalUsers = stats?.counts?.users;
      const totalAuthors = stats?.counts?.authors;
      const totalDepartments = stats?.counts?.departments;
      setTotalUsers(totalUsers);
      setTotalAuthors(totalAuthors);
      setTotalDepartments(totalDepartments);
      // Do something with the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data", error);
    }
  };
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
          <StatsCard title="Total Users" count={totalUsers} icon={UsersIcon} />
          <StatsCard
            title="Total Authors"
            count={totalAuthors}
            iconColor="text-green-500"
            icon={UsersIcon}
          />
          <StatsCard
            title="Total Departments"
            count={totalDepartments}
            iconColor="text-blue-400"
            icon={DepartmentIcon}
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
