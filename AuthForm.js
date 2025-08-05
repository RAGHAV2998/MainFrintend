import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";
import config from './config'; // Import the config file

export default function AuthForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage(""); // Clear previous messages
    try {
      const response = await axios.post(`${config.API_BASE_URL}/login`, { email, password }); // Use config.API_BASE_URL
      setMessage(response.data.message);
      if (response.data.success) {
        const username = email.split("@")[0]; // Extract username from email
        onLoginSuccess(username); // Pass username to App.js
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSignup = async () => {
    setMessage(""); // Clear previous messages
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${config.API_BASE_URL}/signup`, { email, password });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Signup error:", error); // Log the actual error for debugging
      setMessage(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>SignUp</button>
        </div>

        {isLogin ? (
          <div className="form">
            <h2>Login Form</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email" // Add accessibility for screen readers
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password" // Add accessibility for screen readers
            />
            <button onClick={handleLogin}>Login</button>
            {message && <p>{message}</p>}
          </div>
        ) : (
          <div className="form">
            <h2>Signup Form</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm Password"
            />
            <button onClick={handleSignup}>SignUp</button>
            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}