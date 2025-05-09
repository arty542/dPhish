// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords must match');
      return;
    }
    // load existing users or empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // check for duplicate
    if (users.find(u => u.email === email)) {
      setError('An account with that email already exists');
      return;
    }
    // add new user
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    // auto-login as 'user'
    onLogin('user');
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Sign Up</h2>

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
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
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
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
