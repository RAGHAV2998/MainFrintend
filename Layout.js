import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Layout.css";

const Layout = ({ isLoggedIn, onDrugSelect, selectedDrug, children }) => {
  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <h1>Aavyooh</h1>
        <nav>
          <ul>
            {/* Use Link instead of a for navigation */}
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </nav>
        {isLoggedIn && (
          <div className="dropdown">
            <label htmlFor="drugSelect">Products: </label>
            <select
              id="drugSelect"
              onChange={(e) => onDrugSelect(e.target.value)}
              value={selectedDrug}
            >
              <option value="" disabled>
                Select a drug
              </option>
              <option value="MainDrug1">MainDrug1</option>
              <option value="GlassVial">GlassVial</option>
              <option value="PharmaTablet1">PharmaTablet1</option>
              <option value="Syringe">Syringe</option>
              <option value="Wrapper">Wrapper</option>
              <option value="CancerDrug">CancerDrug</option>
            </select>
          </div>
        )}
      </header>

      {/* Content: The Routes component from App.js will render the correct page here */}
      <main className="layout-content">{children}</main>

      {/* Footer */}
      <footer className="layout-footer">
        <p>© 2025 Aavyooh. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;