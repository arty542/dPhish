// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser } from '../services/api'; // Adjust the path as needed

const LoginPage = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'user';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { role } = await loginUser(username, password); // Calls API with username
      onLogin(role); // Notifies parent (optional)
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  useEffect(() => {
    setError('');
    setUsername('');
    setPassword('');
  }, [roleParam]);

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>
        {roleParam === 'admin' ? 'Admin Login' : 'User Login'}
      </h2>

      {error && (
        <div style={{ color: 'crimson', marginBottom: 12, textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: 8, margin: '8px 0' }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, margin: '8px 0' }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: 10,
            marginTop: 12,
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          {roleParam === 'admin' ? 'Login as Admin' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;