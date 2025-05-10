// src/pages/admin/CreateEmail.js
import React, { useState } from 'react';
import { createPhishingEmail } from '../services/api'; // adjust path if needed

const CreateEmail = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [emailType, setEmailType] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createPhishingEmail({ subject, body, email_type: emailType });
      setSuccess('Email saved successfully!');
      setSubject('');
      setBody('');
      setEmailType('');
    } catch (err) {
      setError(err.message || 'Failed to create email');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto' }}>
      <h2>Create Phishing Email</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Email Type (e.g. Invoice, Password Reset)"
          value={emailType}
          onChange={(e) => setEmailType(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <textarea
          placeholder="Email Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={10}
          style={{ width: '100%', padding: 10 }}
        />
        <button type="submit" style={{ marginTop: 15 }}>Save Email</button>
      </form>
    </div>
  );
};

export default CreateEmail;
