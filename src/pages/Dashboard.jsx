import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Building2 } from 'lucide-react';

// Import all components
import StatsCard from '../components/StatsCard';
import PublicationsList from '../components/PublicationsList';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

/**
 * Main Dashboard Component
 * Orchestrates all the dashboard components and manages state
 */
const Dashboard = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    authors: 0,
    departments: 0
  });

  // Mock data for demonstration
  const mockPublications = [
    {
      title: "Advanced Machine Learning Techniques in Healthcare",
      author: "Dr. Sarah Johnson",
      department: "Computer Science",
      date: "2024-06-20"
    },
    {
      title: "Sustainable Energy Solutions for Urban Development",
      author: "Prof. Michael Chen",
      department: "Environmental Engineering",
      date: "2024-06-18"
    },
    {
      title: "Behavioral Economics in Digital Markets",
      author: "Dr. Emily Rodriguez",
      department: "Economics",
      date: "2024-06-15"
    },
    {
      title: "Quantum Computing Applications in Cryptography",
      author: "Dr. David Kim",
      department: "Physics",
      date: "2024-06-12"
    },
    {
      title: "Biomedical Innovations in Gene Therapy",
      author: "Prof. Lisa Wang",
      department: "Biomedical Engineering",
      date: "2024-06-10"
    },
    {
      title: "Social Media Impact on Mental Health",
      author: "Dr. James Thompson",
      department: "Psychology",
      date: "2024-06-08"
    },
    {
      title: "Climate Change Effects on Marine Ecosystems",
      author: "Dr. Anna Martinez",
      department: "Marine Biology",
      date: "2024-06-05"
    },
    {
      title: "Artificial Intelligence in Educational Technology",
      author: "Prof. Robert Davis",
      department: "Education Technology",
      date: "2024-06-03"
    },
    {
      title: "Renewable Energy Storage Systems",
      author: "Dr. Jennifer Brown",
      department: "Electrical Engineering",
      date: "2024-06-01"
    },
    {
      title: "Cybersecurity Challenges in IoT Networks",
      author: "Dr. Kevin Zhang",
      department: "Information Security",
      date: "2024-05-30"
    }
  ];

  /**
   * Simulate fetching data from MongoDB
   * Replace this with your actual API calls
   */
  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, replace with:
      // const response = await fetch('/api/publications?limit=10');
      // const data = await response.json();
      
      setPublications(mockPublications);
      setStats({
        users: 1247,
        authors: 89,
        departments: 12
      });
    } catch (error) {
      console.error('Error fetching data:', error);
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
      iconColor: "text-blue-500"
    },
    {
      title: "Active Authors",
      count: stats.authors,
      icon: BookOpen,
      iconColor: "text-green-500"
    },
    {
      title: "Departments",
      count: stats.departments,
      icon: Building2,
      iconColor: "text-purple-500"
    }
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
        <Header 
          onMenuClick={handleMenuClick}
          title="Dashboard"
        />

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
          <PublicationsList 
            publications={publications} 
            loading={loading} 
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;