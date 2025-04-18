// src/pages/Home.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
  
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
      <div>
        <h1>Phishing Email Sender</h1>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={sendEmail}>Send Email</button>
        <p>{message}</p>
    
        {/* Link to Analytics Page */}
        <Link to="/analytics">
          <button style={{ marginTop: '10px' }}>Go to Analytics</button>
        </Link>
      </div>
    );
    
}

export default Home;