import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const switchMode = m => {
    setError('');
    setEmail('');
    setPassword('');
    setConfirm('');
    setMode(m);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      if (mode === 'login') {
        // TODO: call your login API
        onLogin('user');  // or 'admin' if you detect admin
        navigate('/dashboard');
      } else {
        // TODO: call your signup API
        onLogin('user');
        navigate('/dashboard');
      }
    } catch {
      setError('Server error, try again');
    }
  };

  const tabStyle = active => ({
    flex: 1,
    padding: '12px 0',
    cursor: 'pointer',
    background: active ? '#0d47a1' : '#e3f2fd',
    color: active ? '#fff' : '#0d47a1',
    border: '1px solid #0d47a1',
    textAlign: 'center',
    fontWeight: 500
  });

  const inputStyle = {
    width: '100%',
    padding: 10,
    margin: '8px 0',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 16
  };

  const btnStyle = {
    width: '100%',
    padding: 12,
    marginTop: 16,
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: 16,
    cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {mode === 'login' ? 'Login to InternGov.pk' : 'Sign Up for InternGov.pk'}
      </h2>

      <div style={{ display: 'flex', marginBottom: 16 }}>
        <div style={tabStyle(mode === 'login')} onClick={() => switchMode('login')}>
          Login
        </div>
        <div style={tabStyle(mode === 'signup')} onClick={() => switchMode('signup')}>
          Sign Up
        </div>
      </div>

      {error && <div style={{ color: 'crimson', textAlign: 'center', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {mode === 'signup' && (
          <input
            type="password"
            placeholder="Confirm password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={inputStyle}
          />
        )}

        <button type="submit" style={btnStyle}>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
