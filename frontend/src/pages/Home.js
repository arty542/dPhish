// frontend/src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to InternGov.pk</h1>
      <p>Your gateway to safe, verified internships.</p>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => navigate('/login?role=user')}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          Tester Login
        </button>
        <button
          onClick={() => navigate('/login?role=admin')}
          style={{ padding: '10px 20px' }}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default Home;
