import React from 'react';
import { Users, Book, Calendar, Hash, Eye, Download } from 'lucide-react';

const Publication = ({ publication, onDownload, onViewPdf }) => {
  const {
    id,
    title,
    author,
    coAuthors = [],
    isbn,
    issn,
    year,
    journalName,
    pdfUrl,
    department,
    abstract,
    keywords = []
  } = publication;

  const handleDownload = () => {
    if (pdfUrl) {
      onDownload(pdfUrl, `${title}.pdf`);
    }
  };

  const handleViewPdf = () => {
    if (pdfUrl) {
      onViewPdf(pdfUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        {abstract && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {abstract}
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-2">
          <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Author: </span>
              <span className="text-gray-700">{author}</span>
            </div>
            {coAuthors.length > 0 && (
              <div className="text-sm mt-1">
                <span className="font-medium text-gray-900">Co-authors: </span>
                <span className="text-gray-700">{coAuthors.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Book className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-gray-900">Journal: </span>
            <span className="text-gray-700">{journalName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-gray-900">Year: </span>
            <span className="text-gray-700">{year}</span>
          </div>
        </div>

        {(isbn || issn) && (
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="text-sm">
              {isbn && (
                <span className="text-gray-700 mr-4">
                  <span className="font-medium text-gray-900">ISBN: </span>
                  {isbn}
                </span>
              )}
              {issn && (
                <span className="text-gray-700">
                  <span className="font-medium text-gray-900">ISSN: </span>
                  {issn}
                </span>
              )}
            </div>
          </div>
        )}

        {department && (
          <div className="text-sm">
            <span className="font-medium text-gray-900">Department: </span>
            <span className="text-gray-700">{department}</span>
          </div>
        )}

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleViewPdf}
          disabled={!pdfUrl}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View PDF</span>
        </button>
        
        <button
          onClick={handleDownload}
          disabled={!pdfUrl}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">Publication ID: {id}</p>
      </div>
    </div>
  );
};

export default Publication;