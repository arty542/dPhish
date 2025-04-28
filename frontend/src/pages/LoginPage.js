// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../services/api'; // Import the loginUser function

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';

  const [role, setRole] = useState(defaultRole);
  const [username, setUsername] = useState(''); // Change email to username
  const [password, setPassword] = useState('');

  // If you navigate here with ?role=admin or ?role=user
  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const { token, role } = await loginUser(username, password); // Get token and role from API

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Call the onLogin callback (to manage login state)
      onLogin(role);

      // Navigate based on role
      if (role === 'admin') {
        navigate('/adminHome');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid credentials!');
    }
  };

  const tabStyle = (active) => ({
    padding: '10px 20px',
    marginRight: active ? 0 : 10,
    backgroundColor: active ? '#007BFF' : '#e0e0e0',
    color: active ? '#fff' : '#000',
    border: 'none',
    cursor: 'pointer',
    flex: 1,
    textAlign: 'center',
  });

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Login</h1>

      {/* Role Tabs */}
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <button
          style={tabStyle(role === 'user')}
          onClick={() => setRole('user')}
        >
          Tester
        </button>
        <button
          style={tabStyle(role === 'admin')}
          onClick={() => setRole('admin')}
        >
          Admin
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Username
          <input
            type="text" // Changed from email to text for username
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', margin: '16px 0 8px' }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: 10,
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginTop: 16,
          }}
        >
          {role === 'admin' ? 'Admin Login' : 'Tester Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
