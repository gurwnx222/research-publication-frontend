export const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api", // Base URL for the API
  TIMEOUT: 5000, // Timeout 5 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN",
  },
  // Retry settings
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Endpoints
  ENDPOINTS: {
    USERS: "/private-data/users",
    COUNTS: "/private-data/counts",
    SEARCH: {
      EMAIL: "/private-data/search/email",
      EMPLOYEE_ID: "/private-data/search/employee-id",
      FULLNAME: "/private-data/search/fullname",
    },
  },
};
