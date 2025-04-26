// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';

  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If you navigate here with ?role=admin or ?role=user
  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call your backend auth here
    onLogin(role);
    if (role === 'admin') {
      navigate('/adminHome');
      } 
    else {
        navigate('/dashboard');
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
    textAlign: 'center'
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
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', margin: '16px 0 8px' }}>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
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
            marginTop: 16
          }}
        >
          {role === 'admin' ? 'Admin Login' : 'Tester Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
