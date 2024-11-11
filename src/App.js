import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is configured
import "./App.css";
import ResetPassword from "./components/ResetPassword";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Import Dashboard component

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");
      const isLoggedIn = !!storedToken;

      if (isLoggedIn) {
        try {
          const response = await axios.get(
            "http://localhost:3001/auth/validate_token",
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          const userData = response.data.data;
          setCurrentUser(userData);
          setAuthToken(storedToken); // Ensure this state is set properly
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthToken(null);
          localStorage.removeItem("authToken");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear the token from localStorage
    setCurrentUser(null); // Reset the current user state
    setAuthToken(null); // Reset the authToken state
  };

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner while checking auth
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/dashboard" /> : <Login setCurrentUser={setCurrentUser} />}
        />
        <Route path="/login" component={Login} />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
