// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>Welcome to InternGov.pk</h1>
      <p>Your gateway to safe, verified internships.</p>
      <div style={{ marginTop: 30 }}>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '10px 20px', margin: '0 10px' }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{ padding: '10px 20px', margin: '0 10px' }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;
