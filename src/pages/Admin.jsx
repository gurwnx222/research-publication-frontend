import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminsGrid from "../components/ui/AdminsGrid";
import CreateAdminModal from "../components/CreateAdminModal";
import StatsCard from "../components/StatsCard";
import "../App.css";
import { Shield } from "lucide-react";

export default function Admins() {
  const BASE_URL = "http://localhost:3000/api";

  // Stats state
  const [totalAdmins, setTotalAdmins] = useState(0);

  // Admins and pagination state
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalAdmins: 0,
  });

  // Modal state - only for admin creation
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await fetch(`${BASE_URL}/private-data/admins`, {
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

        setTotalAdmins(stats?.adminCounts || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Fetch admins data with pagination
  const fetchAdmins = async (page = 1, search = "") => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`${BASE_URL}/private-data/admins?${params}`, {
        method: "GET",
        credentials: 'include', // Important: This sends cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Fetching admin data for:", response.url);

      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const adminData = await response.json();
      console.log("Admin data fetched:", adminData);

      if (adminData.success && adminData.data) {
        // Set admins data
        setAdmins(adminData.data.admins || []);

        // Set pagination data
        setPagination({
          currentPage: adminData.data.pagination.currentPage,
          totalPages: adminData.data.pagination.totalPages,
          hasNextPage: adminData.data.pagination.hasNextPage,
          hasPrevPage: adminData.data.pagination.hasPrevPage,
          totalAdmins: adminData.data.pagination.totalAdmins,
        });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // Reset to empty state on error
      setAdmins([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalAdmins: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAdmins(1, searchTerm);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchAdmins(newPage, searchTerm);
  };

  // Handle admin deletion
  const handleDeleteAdmin = async (adminId) => {
    try {
      const response = await fetch(`${BASE_URL}/private-data/admins/${adminId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Refresh the current page after deletion
        fetchAdmins(pagination.currentPage, searchTerm);
        // Also refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
          method: "GET",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalAdmins(stats?.counts?.admins || 0);
        }
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  // Handle create admin
  const handleCreateAdmin = () => {
    setIsCreateModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
  };

  // Handle admin creation submit
  const handleAdminSubmit = async (adminData) => {
    try {
      const response = await fetch(`${BASE_URL}/register/admin`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });
      console.log("Creating admin with data:", adminData);
      
      if (response.ok) {
        // Close modal and refresh data
        setIsCreateModalOpen(false);
        fetchAdmins(pagination.currentPage, searchTerm);
        // Refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
          method: "GET",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalAdmins(stats?.counts?.admins || 0);
        }
      }
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Stats Cards - Only Total Admins */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-6 pt-6">
          <StatsCard 
            title="Total Admins" 
            count={totalAdmins} 
            icon={Shield}
            gradient="from-purple-500 to-indigo-600"
            bgGradient="from-purple-50 to-indigo-50"
          />
        </div>

        {/* Admins Grid */}
        <main className="flex-1 px-6">
          <AdminsGrid
            admins={admins}
            loading={loading}
            searchTerm={searchTerm}
            pagination={pagination}
            onDelete={handleDeleteAdmin}
            onPageChange={handlePageChange}
            onCreateAdmin={handleCreateAdmin}
          />
        </main>
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAdminSubmit}
      />
    </div>
  );
}