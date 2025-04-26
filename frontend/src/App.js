// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';                // Landing page
import LoginPage from './pages/LoginPage';      // Login page
import AdminHome from './pages/AdminHome';
import Analytics from './pages/Analytics';
import TestUserPage from './pages/TestUserPage';

function App() {
  const [role, setRole] = useState(null); // 'admin' or 'user'

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Login Page */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* Admin-only routes */}
      <Route
        path="/adminHome"
        element={
          role === 'admin' 
            ? <AdminHome /> 
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/analytics"
        element={
          role === 'admin' 
            ? <Analytics /> 
            : <Navigate to="/login" replace />
        }
      />

      {/* Tester-only route */}
      <Route
        path="/testuserpage"
        element={
          role === 'user' 
            ? <TestUserPage /> 
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
