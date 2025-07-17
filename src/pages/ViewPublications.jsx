import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, BookOpen, User, Building, Users, ChevronDown, X, Lock, Download, Eye, Book, Calendar, Hash } from 'lucide-react';
import AuthenticationModal from "../components/ViewPublicationAuthModal.jsx";
import Publication from '../components/ViewPublicationModal.jsx';

// Main Publications Page Component
const PublicationsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userAuth, setUserAuth] = useState(null);
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);

  const allPublications = [
    {
      id: 'PUB001',
      title: 'Machine Learning Applications in Healthcare: A Comprehensive Review',
      author: 'Dr. Sarah Johnson',
      coAuthors: ['Dr. Michael Chen', 'Dr. Lisa Wang'],
      isbn: '978-0-123456-78-9',
      issn: '2234-5678',
      year: 2024,
      journalName: 'Journal of Medical Technology',
      department: 'Computer Science',
      pdfUrl: 'https://res.cloudinary.com/example/raw/upload/v1/publications/ml_healthcare.pdf',
      abstract: 'This comprehensive review examines the current state and future prospects of machine learning applications in healthcare, covering diagnostic imaging, drug discovery, and personalized medicine.',
      keywords: ['Machine Learning', 'Healthcare', 'AI', 'Medical Technology']
    },
    {
      id: 'PUB002',
      title: 'Sustainable Energy Systems: Renewable Integration Strategies',
      author: 'Dr. Robert Smith',
      coAuthors: ['Dr. Emily Davis'],
      isbn: '978-0-987654-32-1',
      issn: '3456-7890',
      year: 2023,
      journalName: 'International Journal of Sustainable Energy',
      department: 'Electrical Engineering',
      pdfUrl: 'https://res.cloudinary.com/example/raw/upload/v1/publications/sustainable_energy.pdf',
      abstract: 'An analysis of renewable energy integration strategies in modern power systems, focusing on grid stability and energy storage solutions.',
      keywords: ['Renewable Energy', 'Grid Systems', 'Sustainability', 'Power Engineering']
    },
    {
      id: 'PUB003',
      title: 'Quantum Computing: Theoretical Foundations and Practical Applications',
      author: 'Dr. Sarah Johnson',
      coAuthors: [],
      isbn: '978-0-111222-33-4',
      issn: '4567-8901',
      year: 2023,
      journalName: 'Quantum Science Review',
      department: 'Physics',
      pdfUrl: 'https://res.cloudinary.com/example/raw/upload/v1/publications/quantum_computing.pdf',
      abstract: 'This paper explores the theoretical foundations of quantum computing and examines current practical applications in cryptography and optimization.',
      keywords: ['Quantum Computing', 'Cryptography', 'Optimization', 'Physics']
    },
    {
      id: 'PUB004',
      title: 'Climate Change Impact on Urban Planning: A Case Study',
      author: 'Dr. Michael Chen',
      coAuthors: ['Dr. Anna Wilson', 'Dr. James Brown'],
      isbn: '978-0-555666-77-8',
      issn: '5678-9012',
      year: 2022,
      journalName: 'Urban Studies Quarterly',
      department: 'Environmental Science',
      pdfUrl: 'https://res.cloudinary.com/example/raw/upload/v1/publications/climate_urban.pdf',
      abstract: 'A comprehensive case study examining how climate change considerations are being integrated into modern urban planning practices.',
      keywords: ['Climate Change', 'Urban Planning', 'Environmental Impact', 'Sustainability']
    },
    {
      id: 'PUB005',
      title: 'Blockchain Technology in Supply Chain Management',
      author: 'Dr. Lisa Wang',
      coAuthors: ['Dr. Robert Smith'],
      isbn: '978-0-999888-77-6',
      issn: '6789-0123',
      year: 2024,
      journalName: 'Supply Chain Technology Review',
      department: 'Business Administration',
      pdfUrl: 'https://res.cloudinary.com/example/raw/upload/v1/publications/blockchain_supply.pdf',
      abstract: 'An exploration of blockchain technology applications in supply chain management, focusing on transparency and traceability improvements.',
      keywords: ['Blockchain', 'Supply Chain', 'Technology', 'Business']
    }
  ];

  const handleAuthentication = (authData) => {
    setUserAuth(authData);
    setIsAuthenticated(true);
    setLoading(true);
    
    setTimeout(() => {
      let filtered = [];
      
      if (authData.accessLevel === 'university') {
        filtered = allPublications;
      } else if (authData.accessLevel === 'department') {
        filtered = allPublications.filter(pub => 
          pub.department === 'Computer Science' || pub.department === 'Physics'
        );
      } else if (authData.accessLevel === 'author') {
        filtered = allPublications.filter(pub => 
          pub.author === 'Dr. Sarah Johnson'
        );
      }
      
      setPublications(filtered);
      setFilteredPublications(filtered);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredPublications(publications);
      return;
    }
    
    const filtered = publications.filter(pub =>
      pub.title.toLowerCase().includes(term.toLowerCase()) ||
      pub.author.toLowerCase().includes(term.toLowerCase()) ||
      pub.journalName.toLowerCase().includes(term.toLowerCase()) ||
      pub.department.toLowerCase().includes(term.toLowerCase()) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredPublications(filtered);
  };

  const handleSort = (field) => {
    const order = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(order);
    
    const sorted = [...filteredPublications].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      if (field === 'year') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredPublications(sorted);
  };

  const handleDownload = (url, filename) => {
    window.open(url, '_blank');
  };

  const handleViewPdf = (url) => {
    window.open(url, '_blank');
  };

  const handleBackToHome = () => {
    setIsAuthenticated(false);
    setUserAuth(null);
    setPublications([]);
    setFilteredPublications([]);
    setSearchTerm('');
    setSortBy('year');
    setSortOrder('desc');
  };

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Publications Portal</h1>
            <p className="text-gray-600 mb-6">
              Access academic publications based on your authorization level
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Access Publications
            </button>
          </div>
        </div>
        <AuthenticationModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticate={handleAuthentication}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-gray-600" />
                <h1 className="text-xl font-semibold text-gray-900">Publications</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{userAuth?.accessLevelLabel}</span>
              <span>•</span>
              <span>ID: {userAuth?.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search publications by title, author, journal, or keywords..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSort('year')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'year' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>Year</span>
              {sortBy === 'year' && (
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  sortOrder === 'asc' ? 'transform rotate-180' : ''
                }`} />
              )}
            </button>
            <button
              onClick={() => handleSort('title')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === 'title' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>Title</span>
              {sortBy === 'title' && (
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  sortOrder === 'asc' ? 'transform rotate-180' : ''
                }`} />
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading publications...</span>
          </div>
        )}

        {/* Publications Grid */}
        {!loading && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredPublications.length} of {publications.length} publications
            </div>
            
            {filteredPublications.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'No publications available for your access level'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPublications.map((publication) => (
                  <Publication
                    key={publication.id}
                    publication={publication}
                    onDownload={handleDownload}
                    onViewPdf={handleViewPdf}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;