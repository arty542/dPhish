// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [searchParams]        = useSearchParams();
  const role                  = searchParams.get('role') || 'user';
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    if (role === 'user') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const match = users.find(u => u.email === email && u.password === password);
      if (!match) {
        setError('Invalid user credentials');
        return;
      }
      onLogin('user');
      navigate('/dashboard');
    } else if (role === 'admin') {
      // hard-coded admin credentials
      if (email === 'admin@interngov.pk' && password === 'Admin123!') {
        onLogin('admin');
        navigate('/admin');
      } else {
        setError('Invalid admin credentials');
      }
    }
  };

  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
  }, [role]);

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>
        {role === 'admin' ? 'Admin Login' : 'User Login'}
      </h2>

      {error && (
        <div style={{ color: 'crimson', marginBottom: 12, textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          {role === 'admin' ? 'Login as Admin' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
