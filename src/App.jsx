import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import Dashboard from "./pages/Dashboard"; 
import JournalRegistrationForm from "./pages/Publication"; // adjust path
import Department from "./pages/Department"
import Users from "./pages/Users"
import ViewPublications from "./pages/ViewPublications"; // adjust path
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-publication" element={<JournalRegistrationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/department" element={<Department/>} />
        <Route path="/users" element={<Users />}/>
        <Route path="/view-publications" element={<ViewPublications />} />
      </Routes>
    </Router>
  );
}

export default App;
