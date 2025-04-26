import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import AdminHome from './pages/AdminHome';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';    // ← make sure this line is present

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

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

      <Route
        path="/dashboard"
        element={
          role === 'user'
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
