// API Service for handling backend requests
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  // Helper method to handle API responses
  static async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  // Check if author exists by employee ID
  static async checkAuthorExists(employeeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/authors/employee-id?q=${employeeId}`);
      const data = await this.handleResponse(response);
      
      return {
        exists: data.success,
        authorBio: data.authorBio || null,
        message: data.message
      };
    } catch (error) {
      // If it's a 404, author doesn't exist
      if (error.message === 'Author not found with this employee ID') {
        return {
          exists: false,
          authorBio: null,
          message: error.message
        };
      }
      
      // For other errors, re-throw
      throw error;
    }
  }

  // Get all publications with pagination (University level access)
  static async getPublications(page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await fetch(`${API_BASE_URL}/publications?${queryParams}`);
    return await this.handleResponse(response);
  }

  // Get publications by author (Author level access)
  static async getPublicationsByAuthor(authorName, page = 1, limit = 10) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      author: authorName
    });

    const response = await fetch(`${API_BASE_URL}/publications?${queryParams}`);
    return await this.handleResponse(response);
  }

  // FIXED: Search publications method
  static async searchPublications(searchTerm, page = 1, limit = 10) {
    // Build query parameters correctly
    const queryParams = new URLSearchParams({
      q: searchTerm,        // The actual search term
      page: page.toString(),
      limit: limit.toString()
    });

    // Use the query params correctly in the URL
    const response = await fetch(`${API_BASE_URL}/publications/text-search?${queryParams}`);
    return await this.handleResponse(response);
  }
}

export default ApiService;