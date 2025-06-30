const BASE_URL = "http://localhost:3000";

// Generic function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      // Default headers for all requests
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers here if needed
        // 'Authorization': 'Bearer your-token-here'
      },
      ...options, // Spread operator to merge any additional options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error; // Re-throw to let calling code handle it
  }
};

// Get total user count
export const getUserCount = async () => {
  return await apiCall("/private-data/counts");
};

// Get all users
export const getAllUsers = async () => {
  return await apiCall("/private-data/users");
};

// Search functions
export const searchByEmail = async (email) => {
  return await apiCall(
    `/private-data/search/email?q=${encodeURIComponent(email)}`
  );
};

export const searchByEmployeeId = async (employeeId) => {
  return await apiCall(
    `/private-data/search/employee-id?q=${encodeURIComponent(employeeId)}`
  );
};

export const searchByFullName = async (fullName) => {
  return await apiCall(
    `/private-data/search/fullname?q=${encodeURIComponent(fullName)}`
  );
};

// Alternative: Combined search function
export const searchUsers = async (searchType, searchTerm) => {
  const endpoints = {
    email: "/private-data/search/email",
    employeeId: "/private-data/search/employee-id",
    fullName: "/private-data/search/fullname",
  };

  const endpoint = endpoints[searchType];
  if (!endpoint) {
    throw new Error(`Invalid search type: ${searchType}`);
  }

  return await apiCall(`${endpoint}?q=${encodeURIComponent(searchTerm)}`);
};
