import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/ui/DashboardHeader";
import SearchBar from "../components/SearchBar";
import UsersGrid from "../components/ui/UsersGrid";
import CreateAuthorModal from "../components/CreateAuthorModal";
import StatsCard from "../components/StatsCard";
import "../App.css";
import { Users as UsersIcon } from "lucide-react";

export default function Users() {
  const BASE_URL = "http://localhost:3000/api";
  const location = useLocation();

  // Sidebar state management
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to determine active tab from current route
  const getActiveTabFromRoute = (pathname) => {
    const routeToTab = {
      '/dashboard': 'dashboard',
      '/authors': 'authors', 
      '/department': 'departments',
      '/admins': 'admins'
    };
    return routeToTab[pathname] || 'authors';
  };

  // Derive activeTab from current route
  const activeTab = getActiveTabFromRoute(location.pathname);

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

  // FIXED: Updated departments state with all the new departments
  const [departments, setDepartments] = useState([
    { _id: "68835bb728200e02b35ddefa", name: "DEPARTMENT OF PHYSICAL SCIENCES" },
    { _id: "68835c2b28200e02b35ddf01", name: "DEPARTMENT OF LIFE SCIENCES" },
    { _id: "68835c4d28200e02b35ddf08", name: "DEPARTMENT OF AGRICULTURE & FOOD TECHNOLOGY" },
    { _id: "68835c6228200e02b35ddf0f", name: "DEPARTMENT OF PHARMACY & PHARMACEUTICAL SCIENCES" },
    { _id: "68835c8428200e02b35ddf1d", name: "DEPARTMENT OF MANAGEMENT & COMMERCE" },
    { _id: "68835cb928200e02b35ddf24", name: "DEPARTMENT OF HOTEL MANAGEMENT & CATERING SERVICES" },
    { _id: "68835cc428200e02b35ddf2b", name: "DEPARTMENT OF COMPUTER APPLICATION" },
    { _id: "68835ccf28200e02b35ddf32", name: "DEPARTMENT OF EDUCATION" },
    { _id: "68835cda28200e02b35ddf39", name: "DEPARTMENT OF JOURNALISM" },
    { _id: "68835ce828200e02b35ddf40", name: "DEPARTMENT OF HUMANITIES & LANGUAGES" },
    { _id: "68835cf528200e02b35ddf47", name: "DEPARTMENT OF ARCHITECTURE" },
    { _id: "68835d0228200e02b35ddf4e", name: "DEPARTMENT OF DESIGN & FINE ARTS" },
    { _id: "68835d1528200e02b35ddf55", name: "DEPARTMENT OF LEGAL STUDIES" },
    { _id: "68835d2728200e02b35ddf5c", name: "DEPARTMENT OF HEALTH SCIENCES" },
    { _id: "6883600728200e02b35ddf95", name: "DEPARTMENT OF ENGINEERING" },
  ]);

  // Sidebar handlers
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleTabChange = (tabId) => {
    console.log(`🔄 Authors page - Tab change requested: ${tabId}`);
    // The navigation will be handled by Sidebar component
  };

  // FIXED: Updated fetch departments with better fallback
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        console.log("Fetching departments from API...");
        const response = await fetch(`${BASE_URL}/departments`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Departments fetched from API:", data);
          
          // Update departments if API returns data, otherwise keep default
          if (data.departments && data.departments.length > 0) {
            setDepartments(data.departments);
          } else {
            console.log("API returned empty departments, using default list");
          }
        } else {
          console.log("Failed to fetch departments from API, using default list");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        console.log("Using default departments list due to error");
        // Keep default departments if fetch fails
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
          credentials: "include",
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
        credentials: "include",
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
        `${BASE_URL}/private-data/delete/unassigned-author`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id: userId })
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
          setTotalUsers(stats?.counts?.authors || 0); // FIXED: Changed from users to authors
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle create user
  const handleCreateUser = () => {
    console.log("Create user button clicked!");
    console.log("Available departments:", departments); // Debug log
    setIsCreateModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    console.log("Modal closing...");
    setIsCreateModalOpen(false);
  };

  // Handle author creation submit
  const handleAuthorSubmit = async (userData) => {
    try {
      console.log("Submitting author data:", userData);

      const response = await fetch(`${BASE_URL}/register/author`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Author created successfully:", result);

        // Close modal and refresh data
        setIsCreateModalOpen(false);
        fetchUsers(pagination.currentPage, searchTerm);

        // Refresh stats
        const statsResponse = await fetch(`${BASE_URL}/private-data/counts`, {
          credentials: "include",
        });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTotalUsers(stats?.counts?.authors || 0); // FIXED: Changed from users to authors
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        // FIXED: You might want to show an error message to the user here
        alert(`Error creating author: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      // FIXED: You might want to show an error message to the user here
      alert(`Error creating author: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar with proper props */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header with menu click handler */}
        <DashboardHeader onCreateUser={handleCreateUser} onMenuClick={handleMenuClick} />

        {/* Search Bar */}
        <div className="px-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-6">
          <StatsCard title="Total Authors" count={totalUsers} icon={UsersIcon} />
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

      {/* Register Author Modal with updated departments */}
      <CreateAuthorModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAuthorSubmit}
        departments={departments}
      />
    </div>
  );
}