// src/pages/AdminHome.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmail } from '../services/api';

function AdminHome() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      const data = await sendEmail(email);
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Admin Home</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <button
          onClick={handleSendEmail}
          style={{
            width: '100%',
            padding: 10,
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          Send Email
        </button>
        {message && (
          <p
            style={{
              padding: 10,
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: 4,
              color: message.toLowerCase().includes('failed') ? 'red' : 'green',
            }}
          >
            {message}
          </p>
        )}
      </div>

      <button
        onClick={() => navigate('/analytics')}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Go to Analytics
      </button>
    </div>
  );
}

export default AdminHome;
