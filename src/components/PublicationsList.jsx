import React from 'react';
import { BookOpen } from 'lucide-react';

/**
 * Publications List Component
 * Displays a list of publications with loading state
 * 
 * @param {Array} publications - Array of publication objects
 * @param {boolean} loading - Loading state indicator
 */
const PublicationsList = ({ publications, loading }) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Publications</h3>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Publication item component
  const PublicationItem = ({ publication, index }) => {
    // Safe author handling
    const getAuthorName = (author) => {
      if (!author) return 'Unknown Author';
      if (typeof author === 'string') return author;
      if (typeof author === 'object' && author.name) return author.name;
      return 'Unknown Author';
    };

    // Safe department handling
    const getDepartmentName = (department) => {
      if (!department) return 'Unknown Department';
      if (typeof department === 'string') return department;
      if (typeof department === 'object' && department.name) return department.name;
      return 'Unknown Department';
    };

    return (
      <div 
        key={index}
        className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors"
      >
        <h4 className="font-semibold text-gray-800 mb-1">{publication.title || 'Untitled'}</h4>
        <p className="text-sm text-gray-600 mb-2">
          {getAuthorName(publication.author)}
        </p>
        <p className="text-xs text-gray-500">
          {getDepartmentName(publication.department)} • {publication.date || 'No date'}
        </p>
      </div>
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
        Recent Publications
      </h3>
      <div className="space-y-4">
        {publications.length > 0 ? (
          publications.map((pub, index) => (
            <PublicationItem key={index} publication={pub} index={index} />
          ))
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No publications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsList;