// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminHome from './pages/AdminHome';
import Analytics from './pages/Analytics';
import TestUserPage from './pages/TestUserPage';

function App() {
  const [role, setRole] = useState(null); // 'admin' or 'user'

  const handleLogin = (userRole) => {
    setRole(userRole); // Call with 'admin' or 'user'
  };

  return (
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/adminHome" element={role === 'admin' ? <AdminHome /> : <Navigate to="/" />} />
        <Route path="/analytics" element={role === 'admin' ? <Analytics /> : <Navigate to="/" />} />
        <Route path="/testuserpage" element={role === 'user' ? <TestUserPage /> : <Navigate to="/" />} />
      </Routes>
  );
}

export default App;
