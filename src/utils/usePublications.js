import { useState, useEffect, useCallback } from 'react';
import ApiService from './apiService';

const usePublications = (userInfo, searchTerm = '', currentPage = 1, limit = 10) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalPublications, setTotalPublications] = useState(0);

  const fetchPublications = useCallback(async () => {
    if (!userInfo) return;

    setLoading(true);
    setError('');

    try {
      let response;

      if (searchTerm) {
        // Search publications
        response = await ApiService.searchPublications(searchTerm, currentPage, limit);
      } else {
        // Fetch based on access level
        switch (userInfo.accessLevel) {
          case 'university':
            response = await ApiService.getPublications(currentPage, limit);
            break;
          
          case 'department':
            if (userInfo.department) {
              response = await ApiService.getPublicationsByDepartment(
                userInfo.department, 
                currentPage, 
                limit
              );
            } else {
              throw new Error('Department information not available');
            }
            break;
          
          case 'author':
            if (userInfo.authorName) {
              response = await ApiService.getPublicationsByAuthor(
                userInfo.authorName, 
                currentPage, 
                limit
              );
            } else {
              throw new Error('Author information not available');
            }
            break;
          
          default:
            throw new Error('Invalid access level');
        }
      }

      setPublications(response.publications || []);
      setTotalPages(response.totalPages || 0);
      setTotalPublications(response.totalPublications || 0);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch publications');
      setPublications([]);
      setTotalPages(0);
      setTotalPublications(0);
    } finally {
      setLoading(false);
    }
  }, [userInfo, searchTerm, currentPage, limit]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const refetch = useCallback(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    loading,
    error,
    totalPages,
    totalPublications,
    refetch
  };
};

export default usePublications;