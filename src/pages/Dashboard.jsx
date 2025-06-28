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
   * Simulate fetching data from MongoDB
   * Replace this with your actual API calls
   */
  const fetchData = async () => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, replace with:
      const response = await fetch("http://localhost:3000/api/publications");
      const data = await response.json();
      const publicationsData = data.publications || [];
      console.log("Fetched publications:", data);
      setPublications(publicationsData);
      // getting stats from the same API with a different endpoint
      const statsResponse = await fetch(
        "http://localhost:3000/api/private-data/counts"
      );
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
