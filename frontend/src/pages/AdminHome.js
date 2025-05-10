// src/pages/AdminHome.js
import React, { useEffect, useState } from 'react';

function AdminHome() {
  const [simulationStatus, setSimulationStatus] = useState('Inactive');
  const [emailStats, setEmailStats] = useState({});
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(() => {
    // Fetch simulation status, email stats, and recent campaigns from API
    // For demonstration purposes, we mock the data.
    setSimulationStatus('Active');
    setEmailStats({
      sent: 120,
      opened: 85,
      clicked: 60,
    });
    setRecentCampaigns([
      { subject: 'Phishing Email #1', date: '2025-05-09' },
      { subject: 'Phishing Email #2', date: '2025-05-08' },
    ]);
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Simulation Status: {simulationStatus}</h2>
        {/* Add buttons to control simulation */}
        <button onClick={() => setSimulationStatus('Active')}>Start Simulation</button>
        <button onClick={() => setSimulationStatus('Inactive')}>Stop Simulation</button>
      </div>

      <div>
        <h2>Email Campaign Stats</h2>
        <p>Sent: {emailStats.sent}</p>
        <p>Opened: {emailStats.opened}</p>
        <p>Clicked: {emailStats.clicked}</p>
      </div>

      <div>
        <h2>Recent Email Campaigns</h2>
        <ul>
          {recentCampaigns.map((campaign, index) => (
            <li key={index}>
              <strong>{campaign.subject}</strong> - {campaign.date}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>User Reports</h2>
        {/* Add logic to display user reports */}
      </div>
    </div>
  );
}

export default AdminHome;
