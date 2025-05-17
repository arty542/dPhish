import React, { useState } from 'react';

const EmailFileUpload = ({ onEmailsLoaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a CSV or text file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        let emails = [];
        
        if (file.type === 'text/csv') {
          // Handle CSV format
          const lines = text.split('\n');
          emails = lines
            .map(line => line.trim())
            .filter(line => line && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line));
        } else {
          // Handle text format (one email per line)
          emails = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line));
        }

        if (emails.length === 0) {
          setError('No valid email addresses found in the file');
          setLoading(false);
          return;
        }

        onEmailsLoaded(emails);
        setLoading(false);
      };

      reader.onerror = () => {
        setError('Error reading file');
        setLoading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      setError('Error processing file');
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          style={{ marginRight: '10px' }}
        />
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: file && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </div>
      {error && (
        <div style={{ color: 'red', marginTop: '5px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default EmailFileUpload; 