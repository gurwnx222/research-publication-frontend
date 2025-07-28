import React from 'react';
import { Users, Book, Calendar, Hash, Eye, Download } from 'lucide-react';

const Publication = ({ publication, onDownload, onViewPdf }) => {
  const {
    id,
    title,
    authorName,
    coAuthors = [],
    authors = [],
    isbnIssn,
    formattedPublicationDate,
    publicationYear,
    journalName,
    journalType,
    file_url,
    department,
    authorDeptId
  } = publication;

  // DEBUG: Add logging to identify the problematic field
  console.log('Publication debug data:', {
    id: typeof id === 'object' ? JSON.stringify(id) : id,
    authorName: typeof authorName === 'object' ? JSON.stringify(authorName) : authorName,
    authors: authors,
    department: department,
    authorDeptId: typeof authorDeptId === 'object' ? JSON.stringify(authorDeptId) : authorDeptId,
    journalName: typeof journalName === 'object' ? JSON.stringify(journalName) : journalName,
    journalType: journalType,
    formattedPublicationDate: formattedPublicationDate,
    publicationYear: publicationYear,
    isbnIssn: isbnIssn,
    file_url: file_url
  });

  // Helper function to get department name
  const getDepartmentName = () => {
    if (department && department.name) {
      return department.name;
    }
    return 'Department not specified';
  };

  // Helper function to get co-authors from authors array
  const getCoAuthors = () => {
    if (authors && Array.isArray(authors) && authors.length > 0) {
      // Filter out the main author and return co-authors
      return authors.filter(author => author.name !== authorName).map(author => author.name || author);
    }
    return coAuthors || [];
  };

  // Helper function to get publication year
  const getPublicationYear = () => {
    return formattedPublicationDate || publicationYear || 'N/A';
  };

  const handleDownload = () => {
    if (file_url) {
      onDownload(file_url, `${title}.pdf`);
    }
  };

  const handleViewPdf = () => {
    if (file_url) {
      onViewPdf(file_url);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-2">
          <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Author: </span>
              <span className="text-gray-700">{authorName || 'N/A'}</span>
            </div>
            {getCoAuthors().length > 0 && (
              <div className="text-sm mt-1">
                <span className="font-medium text-gray-900">Co-authors: </span>
                <span className="text-gray-700">{getCoAuthors().join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Book className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-gray-900">Journal: </span>
            <span className="text-gray-700">{journalName || 'N/A'}</span>
          </div>
        </div>

        {journalType && (
          <div className="flex items-center space-x-2">
            <Book className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-gray-900">Journal Type: </span>
              <span className="text-gray-700">{journalType}</span>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-gray-900">Year: </span>
            <span className="text-gray-700">{getPublicationYear()}</span>
          </div>
        </div>

        {isbnIssn && (
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-gray-900">ISBN/ISSN: </span>
              <span className="text-gray-700">{isbnIssn}</span>
            </div>
          </div>
        )}

        <div className="text-sm">
          <span className="font-medium text-gray-900">Department: </span>
          <span className="text-gray-700">{getDepartmentName()}</span>
        </div>
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleViewPdf}
          disabled={!file_url}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View PDF</span>
        </button>
        
        <button
          onClick={handleDownload}
          disabled={!file_url}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">Publication ID: {id || 'N/A'}</p>
      </div>
    </div>
  );
};

export default Publication;