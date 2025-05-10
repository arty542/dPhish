// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';  
import SendEmail from './pages/SendEmail';  
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import CreateEmail from './pages/CreateEmails'; 
import AdminHome from './pages/AdminHome';

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);  // 'user' or 'admin'
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* All other routes get the navbar */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            role === 'user'
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/admin"
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
          path="/admin/create-email"
          element={
            role === 'admin'
              ? <CreateEmail />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/send-email"
          element={
            role === 'admin'
              ? <SendEmail />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
