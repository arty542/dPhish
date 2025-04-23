// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminHome from './pages/AdminHome';
import Analytics from './pages/Analytics';
import TestUserPage from './pages/TestUserPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-home" element={<AdminHome />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/test-user" element={<TestUserPage />} />
    </Routes>
  );
}

export default App;
