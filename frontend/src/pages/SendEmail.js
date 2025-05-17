// src/pages/SendEmail.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmail } from '../services/api';
import EmailFileUpload from '../components/EmailFileUpload';

function SendEmail() {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, total: 0 });
  const navigate = useNavigate();

  const handleEmailsLoaded = (loadedEmails) => {
    setEmails(loadedEmails);
    setMessage(`Loaded ${loadedEmails.length} email addresses`);
  };

  const handleSendEmails = async () => {
    if (emails.length === 0) {
      setMessage("Please upload a file with email addresses first.");
      return;
    }

    setSending(true);
    setProgress({ sent: 0, total: emails.length });
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < emails.length; i++) {
      try {
        await sendEmail(emails[i]);
        successCount++;
      } catch (error) {
        failureCount++;
        console.error(`Failed to send to ${emails[i]}: ${error.message}`);
      }
      setProgress({ sent: i + 1, total: emails.length });
    }

    setSending(false);
    setMessage(`Completed: ${successCount} sent successfully, ${failureCount} failed`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Send Phishing Emails</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Upload Email List</h3>
        <p>Upload a CSV or text file containing one email address per line.</p>
        <EmailFileUpload onEmailsLoaded={handleEmailsLoaded} />
      </div>

      {emails.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Loaded Emails: {emails.length}</h3>
          <div style={{ 
            maxHeight: '150px', 
            overflowY: 'auto', 
            border: '1px solid #ccc', 
            padding: '10px',
            borderRadius: '4px'
          }}>
            {emails.map((email, index) => (
              <div key={index}>{email}</div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px',
          backgroundColor: message.includes('failed') ? '#ffe6e6' : '#e6ffe6',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {sending && (
        <div style={{ marginBottom: '20px' }}>
          <div>Progress: {progress.sent} / {progress.total}</div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              width: `${(progress.sent / progress.total) * 100}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      <button
        onClick={handleSendEmails}
        disabled={sending || emails.length === 0}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: sending || emails.length === 0 ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: sending || emails.length === 0 ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {sending ? 'Sending...' : 'Send Emails'}
      </button>
    </div>
  );
}

export default SendEmail;
