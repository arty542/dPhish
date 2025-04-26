import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fake internship listings
  const listings = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      deadline: '2025-05-31',
      status: 'Pending'
    },
    {
      id: 2,
      title: 'Digital Marketing Intern',
      deadline: '2025-06-15',
      status: 'Applied'
    },
    {
      id: 3,
      title: 'UX/UI Design Intern',
      deadline: '2025-06-01',
      status: 'Open'
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>User Dashboard</h1>
      <p>Here are the current internship opportunities and your application status:</p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {listings.map((job) => (
          <li key={job.id} style={{
              border: '1px solid #ddd',
              borderRadius: 6,
              padding: 16,
              marginBottom: 12
            }}>
            <h2 style={{ margin: 0 }}>{job.title}</h2>
            <p style={{ margin: '4px 0' }}>
              <strong>Deadline:</strong> {job.deadline}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Status:</strong> {job.status}
            </p>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/register')}
        style={{
          display: 'block',
          margin: '24px auto',
          padding: '12px 24px',
          fontSize: 16,
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Apply Now
      </button>
    </div>
  );
};

export default Dashboard;
