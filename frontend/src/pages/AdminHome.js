// src/pages/AdminHome.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminHome() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Function to handle email sending
  const sendEmail = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/send-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("Failed to send email");
    }
  };

  return (
    <div className="App">
      <h2>Admin Home</h2>
      <div>
        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={sendEmail}>Send Email</button>
        <p>{message}</p>
      </div>
      <br />
      <button onClick={() => navigate('/analytics')}>Go to Analytics</button>
    </div>
  );
}

export default AdminHome;
