import React, { useState, useEffect } from "react";
import { Users, BookOpen, Building2 } from "lucide-react";

// Import all components
import StatsCard from "../components/StatsCard";
import PublicationsList from "../components/PublicationsList";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

/**
 * Main Dashboard Component
 * Orchestrates all the dashboard components and manages state
 */
const Dashboard = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    authors: 0,
    departments: 0,
  });

  /**
   * Fetch data from MongoDB with proper credentials
   */
  const fetchData = async () => {
    setLoading(true);
    const BASE_URL = "http://localhost:3000/api";
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // FIXED: Added credentials: 'include' to send session cookies
      const response = await fetch(`${BASE_URL}/publications`, {
        method: "GET",
        credentials: 'include', // This sends session cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/home';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const publicationsData = data.publications || [];
      console.log("Fetched publications:", data);
      setPublications(publicationsData);

      // FIXED: Added credentials to stats request too
      const statsResponse = await fetch(
        `${BASE_URL}/private-data/counts`,
        {
          method: "GET",
          credentials: 'include', // This sends session cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!statsResponse.ok) {
        if (statsResponse.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      console.log("Fetched stats:", statsData);
      setStats({
        users: statsData.counts.users || 0,
        authors: statsData.counts.authors || 0,
        departments: statsData.counts.departments || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error state here
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Handle menu click (open sidebar)
  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Add logic here to load different content based on tab
    console.log(`Switched to ${tabId} tab`);
  };

  // Stats cards configuration
  const statsConfig = [
    {
      title: "Total Users",
      count: stats.users,
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Active Authors",
      count: stats.authors,
      icon: BookOpen,
      iconColor: "text-green-500",
    },
    {
      title: "Departments",
      count: stats.departments,
      icon: Building2,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} title="Dashboard" />

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsConfig.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                count={stat.count}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            ))}
          </div>

          {/* Publications Section */}
          <PublicationsList publications={publications} loading={loading} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;