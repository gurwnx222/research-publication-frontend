import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Users, Calendar, Building, Download, Eye, X, ChevronDown, ArrowLeft } from 'lucide-react';

// Data and Constants
const dummyPublications = [
  {
    id: 1,
    title: "Artificial Intelligence in Healthcare: A Comprehensive Review",
    authors: ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Prof. Amit Singh"],
    employeeId: "EMP001",
    authorDepartment: "Computer Science",
    journalDepartment: "Healthcare Technology",
    isbn: "978-0-123456-78-9",
    year: 2024,
    description: "This comprehensive review examines the current state and future prospects of artificial intelligence applications in healthcare, covering machine learning algorithms, diagnostic tools, and patient care optimization.",
    pdfUrl: "/sample.pdf"
  },
  {
    id: 2,
    title: "Sustainable Energy Solutions for Smart Cities",
    authors: ["Dr. Anita Patel"],
    employeeId: "EMP002",
    authorDepartment: "Electrical Engineering",
    journalDepartment: "Renewable Energy",
    isbn: "978-0-234567-89-0",
    year: 2023,
    description: "An in-depth analysis of renewable energy integration in urban environments, focusing on smart grid technologies and energy storage solutions.",
    pdfUrl: "/sample.pdf"
  },
  {
    id: 3,
    title: "Quantum Computing: Algorithms and Applications",
    authors: ["Prof. Vikram Mehta", "Dr. Sanjay Gupta"],
    employeeId: "EMP003",
    authorDepartment: "Physics",
    journalDepartment: "Quantum Technology",
    isbn: "978-0-345678-90-1",
    year: 2024,
    description: "Exploring the latest developments in quantum algorithms and their practical applications in cryptography, optimization, and scientific computing.",
    pdfUrl: "/sample.pdf"
  },
  {
    id: 4,
    title: "Blockchain Technology in Supply Chain Management",
    authors: ["Dr. Meera Joshi", "Prof. Rahul Verma", "Dr. Kavita Nair"],
    employeeId: "EMP004",
    authorDepartment: "Management",
    journalDepartment: "Supply Chain",
    isbn: "978-0-456789-01-2",
    year: 2023,
    description: "A detailed study on implementing blockchain solutions for transparent and efficient supply chain operations in various industries.",
    pdfUrl: "/sample.pdf"
  },
  {
    id: 5,
    title: "Machine Learning in Financial Risk Assessment",
    authors: ["Dr. Arjun Malhotra"],
    employeeId: "EMP005",
    authorDepartment: "Computer Science",
    journalDepartment: "Financial Technology",
    isbn: "978-0-567890-12-3",
    year: 2024,
    description: "Comprehensive analysis of machine learning models for predicting and managing financial risks in banking and investment sectors.",
    pdfUrl: "/sample.pdf"
  }
];

const departments = [
  "Computer Science", "Electrical Engineering", "Physics", "Management",
  "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"
];

const journalDepartments = [
  "Healthcare Technology", "Renewable Energy", "Quantum Technology", "Supply Chain",
  "Financial Technology", "Environmental Science", "Biotechnology"
];

const years = [2024, 2023, 2022, 2021, 2020];

const accessLevels = [
  { id: 'university', label: 'University Admin', password: 'admin123' },
  { id: 'department', label: 'Department HOD', password: 'hod123' },
  { id: 'author', label: 'Author', password: 'author123' }
];

// Layout Components
const PageLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {children}
  </div>
);

const ContentContainer = ({ children, className = "" }) => (
  <div className={`relative mx-auto my-10 max-w-7xl px-4 ${className}`}>
    <div className="absolute inset-y-0 left-0 h-full w-px bg-gray-200">
      <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
    </div>
    <div className="absolute inset-y-0 right-0 h-full w-px bg-gray-200">
      <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
    </div>
    {children}
  </div>
);

// Back Button Component
const BackButton = ({ onBack, label = "Back" }) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={onBack}
    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 mb-4"
  >
    <ArrowLeft className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </motion.button>
);
const FormField = ({ label, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ type = "text", value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${className}`}
  />
);

const Select = ({ value, onChange, options, placeholder, className = "" }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map((option, index) => (
      <option key={index} value={typeof option === 'object' ? option.id : option}>
        {typeof option === 'object' ? option.label : option}
      </option>
    ))}
  </select>
);

const Button = ({ onClick, children, variant = "primary", className = "" }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-300";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    icon: "p-2 text-gray-600 hover:text-blue-600"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Authentication Components
const AuthForm = ({ authForm, setAuthForm, onAuth }) => (
  <ContentContainer className="flex flex-col items-center justify-center min-h-screen max-w-4xl">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-200 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
        Access Publication Portal
      </h2>
      
      <div className="space-y-4">
        <FormField label="Access Level">
          <Select
            value={authForm.accessLevel}
            onChange={(e) => setAuthForm({...authForm, accessLevel: e.target.value})}
            options={accessLevels}
            placeholder="Select Access Level"
          />
        </FormField>

        <FormField label="Employee ID">
          <Input
            value={authForm.employeeId}
            onChange={(e) => setAuthForm({...authForm, employeeId: e.target.value})}
          />
        </FormField>

        {authForm.accessLevel === 'author' && (
          <FormField label="Author Name">
            <Input
              value={authForm.authorName}
              onChange={(e) => setAuthForm({...authForm, authorName: e.target.value})}
            />
          </FormField>
        )}

        <FormField label="Password">
          <Input
            type="password"
            value={authForm.password}
            onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
          />
        </FormField>

        <Button onClick={onAuth} className="w-full">
          Access Portal
        </Button>
      </div>

      <CredentialsInfo />
    </motion.div>
  </ContentContainer>
);

const CredentialsInfo = () => (
  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
    <h3 className="font-medium text-sm mb-2 text-gray-700">Demo Credentials:</h3>
    <div className="text-xs space-y-1 text-gray-600">
      <p>University Admin: admin123</p>
      <p>Department HOD: hod123</p>
      <p>Author: author123</p>
    </div>
  </div>
);

// Statistics Components
const StatCard = ({ icon: Icon, value, label, color = "blue" }) => {
  const colors = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500"
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 ${colors[color]}`} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {value}
          </h3>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

const PublicationStats = ({ publications }) => {
  const getDepartmentStats = () => {
    const stats = {};
    publications.forEach(pub => {
      stats[pub.authorDepartment] = (stats[pub.authorDepartment] || 0) + 1;
    });
    return stats;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      <StatCard
        icon={BookOpen}
        value={publications.length}
        label="Total Publications"
        color="blue"
      />
      <StatCard
        icon={Building}
        value={Object.keys(getDepartmentStats()).length}
        label="Active Departments"
        color="green"
      />
      <StatCard
        icon={Users}
        value={new Set(publications.flatMap(pub => pub.authors)).size}
        label="Total Authors"
        color="purple"
      />
    </motion.div>
  );
};

// Search and Filter Components
const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <Input
      placeholder="Search publications, authors, or keywords..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10"
    />
  </div>
);

const FilterControls = ({ 
  selectedDepartment, 
  selectedYear, 
  onDepartmentChange, 
  onYearChange,
  onClearFilters,
  hasActiveFilters 
}) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="mt-4 pt-4 border-t border-gray-200"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Department">
        <Select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          options={departments}
          placeholder="All Departments"
        />
      </FormField>
      
      <FormField label="Year">
        <Select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          options={years}
          placeholder="All Years"
        />
      </FormField>
    </div>
    
    {hasActiveFilters && (
      <button
        onClick={onClearFilters}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        Clear all filters
      </button>
    )}
  </motion.div>
);

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange,
  selectedDepartment,
  selectedYear,
  onDepartmentChange,
  onYearChange,
  onClearFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = selectedDepartment || selectedYear || searchTerm;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {showFilters && (
        <FilterControls
          selectedDepartment={selectedDepartment}
          selectedYear={selectedYear}
          onDepartmentChange={onDepartmentChange}
          onYearChange={onYearChange}
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    </motion.div>
  );
};

// Publication Components
const PublicationBadge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[color]}`}>
      {children}
    </span>
  );
};

const PublicationCard = ({ publication, index, onView, onDownload }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {publication.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <PublicationBadge color="blue">
            {publication.authorDepartment}
          </PublicationBadge>
          <PublicationBadge color="green">
            {publication.year}
          </PublicationBadge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="icon" onClick={() => onView(publication)}>
          <Eye className="w-5 h-5" />
        </Button>
        <Button variant="icon" onClick={() => onDownload(publication)}>
          <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
    
    <PublicationDetails publication={publication} />
    
    <p className="mt-4 text-gray-700 line-clamp-3">
      {publication.description}
    </p>
  </motion.div>
);

const PublicationDetails = ({ publication }) => (
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4" />
      <span>{publication.authors.join(', ')}</span>
    </div>
    <div className="flex items-center gap-2">
      <BookOpen className="w-4 h-4" />
      <span>ISBN: {publication.isbn}</span>
    </div>
    <div className="flex items-center gap-2">
      <Building className="w-4 h-4" />
      <span>{publication.journalDepartment}</span>
    </div>
  </div>
);

const PublicationGrid = ({ publications, onView, onDownload }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {publications.map((publication, index) => (
      <PublicationCard
        key={publication.id}
        publication={publication}
        index={index}
        onView={onView}
        onDownload={onDownload}
      />
    ))}
  </div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12"
  >
    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-medium text-gray-500 mb-2">
      No publications found
    </h3>
    <p className="text-gray-400">
      Try adjusting your search criteria or filters
    </p>
  </motion.div>
);

// Modal Components
const PublicationModal = ({ publication, onClose, onBack }) => {
  if (!publication) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-4">
          <BackButton onBack={onBack || onClose} label="Back to List" />
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {publication.title}
          </h2>
          <Button variant="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <PublicationBadge color="blue">
              {publication.authorDepartment}
            </PublicationBadge>
            <PublicationBadge color="green">
              {publication.year}
            </PublicationBadge>
            <PublicationBadge color="purple">
              {publication.journalDepartment}
            </PublicationBadge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Authors</h4>
              <p className="text-gray-600">
                {publication.authors.join(', ')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">ISBN</h4>
              <p className="text-gray-600">{publication.isbn}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600 leading-relaxed">
              {publication.description}
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Header Component
const PageHeader = ({ userAccess, onLogout, onBack, showBackButton = false }) => (
  <div className="mb-8">
    {showBackButton && (
      <BackButton onBack={onBack} label="Back to Publications" />
    )}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Research Publications
        </h1>
        <p className="text-gray-600">
          RIMT University Research Portal - {
            userAccess?.level === 'university' ? 'University Admin' : 
            userAccess?.level === 'department' ? 'Department HOD' : 'Author'
          } Access
        </p>
      </div>
      <Button variant="secondary" onClick={onLogout}>
        Logout
      </Button>
    </div>
  </div>
);

// Main App Component
export default function PublicationPortal() {
  const [currentView, setCurrentView] = useState('auth');
  const [navigationHistory, setNavigationHistory] = useState(['auth']);
  const [userAccess, setUserAccess] = useState(null);
  const [publications, setPublications] = useState(dummyPublications);
  const [filteredPublications, setFilteredPublications] = useState(dummyPublications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPublication, setSelectedPublication] = useState(null);

  const [authForm, setAuthForm] = useState({
    accessLevel: '',
    employeeId: '',
    password: '',
    authorName: ''
  });

  // Navigation functions
  const navigateTo = (view) => {
    setNavigationHistory(prev => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentView(previousView);
      
      // Clear modal if going back from modal view
      if (selectedPublication) {
        setSelectedPublication(null);
      }
    }
  };

  const canGoBack = navigationHistory.length > 1;

  useEffect(() => {
    filterPublications();
  }, [searchTerm, selectedDepartment, selectedYear, publications]);

  const filterPublications = () => {
    let filtered = [...publications];

    if (searchTerm) {
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        pub.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(pub => pub.authorDepartment === selectedDepartment);
    }

    if (selectedYear) {
      filtered = filtered.filter(pub => pub.year === parseInt(selectedYear));
    }

    setFilteredPublications(filtered);
  };

  const handleAuth = () => {
    const accessLevel = accessLevels.find(level => level.id === authForm.accessLevel);
    
    if (!authForm.accessLevel || !authForm.employeeId || !authForm.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (authForm.accessLevel === 'author' && !authForm.authorName) {
      alert('Please enter author name');
      return;
    }
    
    if (accessLevel && authForm.password === accessLevel.password) {
      setUserAccess({
        level: authForm.accessLevel,
        employeeId: authForm.employeeId,
        authorName: authForm.authorName
      });
      navigateTo('publications');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUserAccess(null);
    setCurrentView('auth');
    setNavigationHistory(['auth']);
    setSelectedPublication(null);
    setAuthForm({ accessLevel: '', employeeId: '', password: '', authorName: '' });
  };

  const handleClearFilters = () => {
    setSelectedDepartment('');
    setSelectedYear('');
    setSearchTerm('');
  };

  const handleViewPublication = (publication) => {
    setSelectedPublication(publication);
    navigateTo('publication-detail');
  };

  const handleDownloadPublication = (publication) => {
    // Handle download logic here
    console.log('Downloading:', publication.title);
  };

  const handleCloseModal = () => {
    setSelectedPublication(null);
    goBack();
  };

  const PublicationsList = () => (
    <ContentContainer>
      <PageHeader 
        userAccess={userAccess} 
        onLogout={handleLogout}
        onBack={goBack}
        showBackButton={canGoBack && currentView === 'publications'}
      />
      
      <PublicationStats publications={publications} />
      
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDepartment={selectedDepartment}
        selectedYear={selectedYear}
        onDepartmentChange={setSelectedDepartment}
        onYearChange={setSelectedYear}
        onClearFilters={handleClearFilters}
      />
      
      {filteredPublications.length > 0 ? (
        <PublicationGrid
          publications={filteredPublications}
          onView={handleViewPublication}
          onDownload={handleDownloadPublication}
        />
      ) : (
        <EmptyState />
      )}
      
      {selectedPublication && currentView === 'publication-detail' && (
        <PublicationModal
          publication={selectedPublication}
          onClose={handleCloseModal}
          onBack={goBack}
        />
      )}
    </ContentContainer>
  );

  return (
    <PageLayout>
      {currentView === 'auth' && (
        <AuthForm
          authForm={authForm}
          setAuthForm={setAuthForm}
          onAuth={handleAuth}
        />
      )}
      {(currentView === 'publications' || currentView === 'publication-detail') && <PublicationsList />}
    </PageLayout>
  );
}