import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Adjust path as needed
import ProtectedRoute from "./components/ProtectedRoute"; // Adjust path as needed

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import JournalRegistrationForm from "./pages/Publication"; // adjust path
import Department from "./pages/Department";
import Users from "./pages/Users";
import ViewPublications from "./pages/ViewPublications"; // adjust path
import AdminLogin from "./pages/AdminLogin"; // adjust path
import Admin from "./pages/Admin";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/add-publication"
            element={<JournalRegistrationForm />}
          />
          <Route path="/view-publications" element={<ViewPublications />} />
          <Route
            path="/research-publication/admin/login-rimt"
            element={<AdminLogin />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
             <Dashboard />
            }
          />
          <Route
            path="/department"
            element={
              <ProtectedRoute>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route
            path="/admins"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
