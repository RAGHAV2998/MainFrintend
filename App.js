import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";

// Component Imports
import Tree from "./Tree";
import ManufacturerTree from "./ManufacturerTree";
import AuthForm from "./AuthForm";
import Layout from "./Layout";
import About from './About';
import Contact from './Contact';

// Style Imports
import "./App.css";

// Config Import
import config from './config';


// This is the main content for your homepage.
// It contains the logic for fetching and displaying the network graph.
const Home = ({ isAuthenticated, selectedDrug, username }) => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showManufacturerView, setShowManufacturerView] = useState(false);

  // Memoize fetchTreeData to prevent unnecessary re-creations
  const fetchTreeData = useCallback(async () => {
    if (!isAuthenticated || !selectedDrug) {
      setTreeData(null); // Clear data if not authenticated or no drug selected
      setError(null);    // Clear any previous error
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors before a new fetch
    try {
      const response = await axios.get(`${config.API_BASE_URL}/get_hierarchy?product=${selectedDrug}`);
      setTreeData(response.data);
    } catch (err) {
      console.error("Failed to fetch tree data:", err); // Log the actual error for debugging
      if (err.response) {
        setError(`Failed to fetch data: ${err.response.status} - ${err.response.data?.message || 'Server error'}`);
      } else if (err.request) {
        setError("Network error: No response from server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred while setting up the request.");
      }
      setTreeData(null); // Clear potentially stale data on error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedDrug]); // Dependencies for useCallback

  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]); // Dependency on the memoized function

  // Render logic for the Home component
  return (
    <>
      {!selectedDrug && (
        <h2 className="welcome-message">Welcome, {username}! Select a product to view the network.</h2>
      )}

      {loading && selectedDrug && (
        <div className="loading-indicator">
          <p>Loading network for {selectedDrug}...</p>
        </div>
      )}

      {error && selectedDrug && (
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please try again or contact support if the issue persists.</p>
        </div>
      )}

      {selectedDrug && treeData && !loading && !error && (
        <div className="network-container">
          <h1>{selectedDrug} Network</h1>
          <button
            onClick={() => setShowManufacturerView(!showManufacturerView)}
            className="toggle-view-button"
          >
            {showManufacturerView ? "Show Component View" : "Show Manufacturer View"}
          </button>
          {showManufacturerView ? <ManufacturerTree initialData={treeData} /> : <Tree initialData={treeData} />}
        </div>
      )}

      {selectedDrug && !loading && !error && !treeData && (
        <div className="no-data-message">
          <p>No network data available for {selectedDrug}.</p>
          <p>Please try another product or ensure the data source is configured correctly.</p>
        </div>
      )}
    </>
  );
};


// This is now the main App component. It handles routing and overall state.
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState("");
  const [username, setUsername] = useState("User");

  const handleLoginSuccess = useCallback((usernameFromForm) => {
    setIsAuthenticated(true);
    setUsername(usernameFromForm || "User");
  }, []);

  // If not authenticated, show the login form
  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Main application layout once authenticated
  return (
    <Router>
      <Layout 
        isLoggedIn={isAuthenticated} 
        onDrugSelect={setSelectedDrug} 
        selectedDrug={selectedDrug}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isAuthenticated={isAuthenticated}
                selectedDrug={selectedDrug}
                username={username}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;