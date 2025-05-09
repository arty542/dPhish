// frontend/src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>404 – Page Not Found</h1>
      <p>Oops! We can’t find that page.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginTop: 20
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
