import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tutorial() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Phishing Awareness Tutorial</h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        lineHeight: '1.6'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>What is Phishing?</h2>
        <p>
          Phishing is a type of cyber-attack where attackers pretend to be someone you trust — like a bank, company, or even a friend — 
          to trick you into giving away your personal information (like passwords, credit cards, or money).
        </p>
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
          Phishing = Fake Identity + Trickery = Your Data Stolen!
        </p>
        <p style={{ marginTop: '20px' }}>
          <a 
            href="https://www.youtube.com/watch?v=XBkzBrXlle0" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3498db', textDecoration: 'none' }}
          >
            Watch this video for a concise overview of phishing attacks →
          </a>
        </p>

        <h2 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '20px' }}>Why Is Phishing Dangerous?</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>You could lose your bank money</li>
          <li>Your social media accounts can get hacked</li>
          <li>Your private information can be used illegally</li>
        </ul>
        <p style={{ marginTop: '20px' }}>
          <a 
            href="https://www.proofpoint.com/us/threat-reference/phishing" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3498db', textDecoration: 'none' }}
          >
            Learn more about phishing risks →
          </a>
        </p>

        <h2 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '20px' }}>How to Identify a Phishing Email?</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Always check the sender's email address</li>
          <li>Look for spelling or grammar mistakes</li>
          <li>Be careful of urgent language like "Act Now!" or "Immediate Action Required!"</li>
          <li>Don't click suspicious links — hover over them to check where they go</li>
          <li>If it sounds too good to be true, it probably is!</li>
        </ul>
        <p style={{ marginTop: '20px' }}>
          <a 
            href="https://www.youtube.com/watch?v=iHetr8xTWIU" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3498db', textDecoration: 'none' }}
          >
            Watch tips on recognizing phishing emails →
          </a>
        </p>

        <h2 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '20px' }}>Examples: Phishing vs Real Emails</h2>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#27ae60' }}>Real Email</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li>Correct email address</li>
              <li>Professional language</li>
              <li>No urgency</li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#e74c3c' }}>Phishing Email</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li>Weird email address (example123@abcscam.com)</li>
              <li>Spelling mistakes, weird language</li>
              <li>"Your account will be locked in 24 hours!"</li>
            </ul>
          </div>
        </div>
        <p style={{ marginTop: '20px' }}>
          <a 
            href="https://www.terranovasecurity.com/blog/top-examples-of-phishing-emails" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3498db', textDecoration: 'none' }}
          >
            See more examples of phishing emails →
          </a>
        </p>

        <h2 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '20px' }}>Mini Quiz: Practice Spotting Phishing</h2>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <p style={{ fontWeight: 'bold' }}>
            You receive an email from "support@paypaI.com" asking for your password. 
            (Notice: the "I" in "PayPal" is actually a capital "i", not "L".)
          </p>
          <p>Is it phishing or not?</p>
          <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>This is phishing. Here's why:</p>
          <ol style={{ paddingLeft: '20px' }}>
            <li>
              <strong>Suspicious Sender Address:</strong>
              <ul>
                <li>The email comes from "support@paypaI.com" (with a capital "I" instead of an "l")</li>
                <li>The legitimate PayPal domain is "paypal.com", not "paypaI.com"</li>
                <li>Scammers often use lookalike characters (e.g., "I" vs. "l") to trick users</li>
              </ul>
            </li>
            <li>
              <strong>Password Request:</strong>
              <ul>
                <li>Legitimate companies like PayPal will NEVER ask for your password via email</li>
                <li>This is a classic phishing tactic to steal credentials</li>
              </ul>
            </li>
            <li>
              <strong>Urgency or Fear Tactics:</strong>
              <ul>
                <li>Phishing emails often pressure you to act quickly (e.g., "Your account will be locked!")</li>
                <li>Check for alarming language</li>
              </ul>
            </li>
          </ol>
        </div>
        <p style={{ marginTop: '20px' }}>
          <a 
            href="https://phishingquiz.withgoogle.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3498db', textDecoration: 'none' }}
          >
            Take an interactive quiz to test your knowledge →
          </a>
        </p>

        <h2 style={{ color: '#2c3e50', marginTop: '30px', marginBottom: '20px' }}>What To Do If You Clicked on a Phishing Email</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Immediately change your passwords</li>
          <li>Use two-factor authentication (like phone verification)</li>
          <li>Scan your device with antivirus software</li>
          <li>Report the phishing email to your email provider</li>
        </ul>
        <p style={{ marginTop: '20px' }}>
          <a 
            href="https://www.youtube.com/watch?v=B06nvFCyBFs" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#3498db', textDecoration: 'none' }}
          >
            Watch what to do after clicking a phishing link →
          </a>
        </p>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tutorial; 