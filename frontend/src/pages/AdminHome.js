// src/pages/AdminHome.js
import React, { useEffect, useState } from 'react';
import { startSimulation, stopSimulation, generateReport } from '../services/api';

function AdminHome() {
  const [simulationStatus, setSimulationStatus] = useState('Inactive');
  const [currentSimulationId, setCurrentSimulationId] = useState(null);
  const [emailStats, setEmailStats] = useState({
    total: 0,
    opened: 0,
    clicked: 0,
    reported: 0
  });
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  // Load simulation state from localStorage on component mount
  useEffect(() => {
    const savedSimulationId = localStorage.getItem('currentSimulationId');
    const savedSimulationStatus = localStorage.getItem('simulationStatus');
    if (savedSimulationId && savedSimulationStatus === 'Active') {
      setCurrentSimulationId(savedSimulationId);
      setSimulationStatus('Active');
    }
  }, []);

  const handleStartSimulation = async () => {
    try {
      const response = await startSimulation();
      setSimulationStatus('Active');
      setCurrentSimulationId(response.simulation_id);
      // Save simulation state to localStorage
      localStorage.setItem('currentSimulationId', response.simulation_id);
      localStorage.setItem('simulationStatus', 'Active');
      setError('');
    } catch (err) {
      setError('Failed to start simulation: ' + err.message);
    }
  };

  const handleStopSimulation = async () => {
    if (!currentSimulationId) return;
    
    try {
      await stopSimulation(currentSimulationId);
      setSimulationStatus('Inactive');
      // Clear simulation state from localStorage
      localStorage.removeItem('currentSimulationId');
      localStorage.removeItem('simulationStatus');
      setError('');
    } catch (err) {
      setError('Failed to stop simulation: ' + err.message);
    }
  };

  const handleGenerateReport = async () => {
    if (!currentSimulationId) {
      setError('No active simulation to generate report for');
      return;
    }

    try {
      const report = await generateReport(currentSimulationId);
      setReportData(report);
      setEmailStats({
        total: report.total_emails,
        opened: report.opened_emails,
        clicked: report.clicked_emails,
        reported: report.reported_emails
      });
      setError('');
    } catch (err) {
      setError('Failed to generate report: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <h1>Admin Dashboard</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h2>Simulation Control</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={handleStartSimulation}
            disabled={simulationStatus === 'Active'}
            style={{
              padding: '10px 20px',
              backgroundColor: simulationStatus === 'Active' ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: simulationStatus === 'Active' ? 'not-allowed' : 'pointer'
            }}
          >
            Start Simulation
          </button>
          <button
            onClick={handleStopSimulation}
            disabled={simulationStatus === 'Inactive'}
            style={{
              padding: '10px 20px',
              backgroundColor: simulationStatus === 'Inactive' ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: simulationStatus === 'Inactive' ? 'not-allowed' : 'pointer'
            }}
          >
            Stop Simulation
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={simulationStatus === 'Active'}
            style={{
              padding: '10px 20px',
              backgroundColor: simulationStatus === 'Active' ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: simulationStatus === 'Active' ? 'not-allowed' : 'pointer'
            }}
          >
            Generate Report
          </button>
        </div>
        <p>Status: <strong>{simulationStatus}</strong></p>
        {currentSimulationId && <p>Simulation ID: <strong>{currentSimulationId}</strong></p>}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Email Campaign Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3>Total Emails</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{emailStats.total}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3>Opened Emails</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{emailStats.opened}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3>Clicked Emails</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{emailStats.clicked}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3>Reported Emails</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{emailStats.reported}</p>
          </div>
        </div>
      </div>

      {reportData && (
        <div style={{ marginBottom: '30px' }}>
          <h2>Report Details</h2>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3>Time Information</h3>
              <p><strong>Start Time:</strong> {new Date(reportData.report_data.start_time).toLocaleString()}</p>
              <p><strong>End Time:</strong> {new Date(reportData.report_data.end_time).toLocaleString()}</p>
              <p><strong>Duration:</strong> {Math.round(reportData.report_data.duration / 60)} minutes</p>
              <p><strong>First Interaction:</strong> {reportData.report_data.first_interaction ? new Date(reportData.report_data.first_interaction).toLocaleString() : 'No interactions'}</p>
              <p><strong>Last Interaction:</strong> {reportData.report_data.last_interaction ? new Date(reportData.report_data.last_interaction).toLocaleString() : 'No interactions'}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Email Type Distribution</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {reportData.report_data.email_types.map((type, index) => (
                  <div key={index} style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
                    <p><strong>Type:</strong> {type.email__email_type}</p>
                    <p><strong>Count:</strong> {type.count}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Success Metrics</h3>
              <p><strong>Success Rate:</strong> {reportData.report_data.success_rate.toFixed(2)}%</p>
              <p><strong>Report Rate:</strong> {reportData.report_data.report_rate.toFixed(2)}%</p>
            </div>

            <div>
              <h3>Interaction Timeline</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                {reportData.report_data.interaction_timeline.map((interaction, index) => (
                  <div key={index} style={{ 
                    padding: '5px', 
                    borderBottom: index < reportData.report_data.interaction_timeline.length - 1 ? '1px solid #eee' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{interaction.action_type}</span>
                    <span>{new Date(interaction.action_time).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHome;
